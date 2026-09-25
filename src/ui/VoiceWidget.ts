/**
 * VoiceWidget
 * Main controller and UI integration orchestrating all Section 5A modules.
 */

import { AudioCaptureManager } from '../audio/AudioCaptureManager';
import { EchoAndNoiseManager } from '../audio/EchoAndNoiseManager';
import { VoiceActivityDetector, VadState } from '../audio/VoiceActivityDetector';
import { BargeInManager } from '../audio/BargeInManager';
import { AudioQualityChecker } from '../audio/AudioQualityChecker';
import { AudioOutputManager } from '../audio/AudioOutputManager';
import { ConnectionRecovery } from '../audio/ConnectionRecovery';
import { WebSpeechFallback } from '../provider/WebSpeechFallback';
import { VapiConnector } from '../provider/VapiConnector';
import { AudioVisualizer } from './AudioVisualizer';
import { VoiceAcceptanceSuite, TestResult } from '../test/VoiceAcceptanceSuite';
import { ConversationalPacer } from '../speech/ConversationalPacer';
import { VOICE_CONFIG } from '../config/voiceConfig';

export class VoiceWidget {
  private captureManager: AudioCaptureManager;
  private echoManager: EchoAndNoiseManager;
  private vad: VoiceActivityDetector;
  private bargeInManager: BargeInManager;
  private qualityChecker: AudioQualityChecker;
  private outputManager: AudioOutputManager;
  private recoveryManager: ConnectionRecovery;
  private webSpeechFallback: WebSpeechFallback;
  private vapiConnector: VapiConnector;
  private visualizer: AudioVisualizer | null = null;

  private isSessionActive = false;
  private activeMode: 'standalone' | 'vapi' = 'standalone';

  constructor() {
    // 1. Initialize Barge-In Manager
    this.bargeInManager = new BargeInManager({
      onInterrupted: (timestamp, cause) => {
        this.handleInterruption(timestamp, cause);
      },
      onAiSpeechStarted: () => {
        this.updateStatus('AI Speaking...', 'ai');
        this.echoManager.setAiSpeakingState(true);
      },
      onAiSpeechEnded: () => {
        if (this.isSessionActive) {
          this.updateStatus('Listening for customer...', 'listening');
        } else {
          this.updateStatus('Session Idle', 'idle');
        }
        this.echoManager.setAiSpeakingState(false);
      }
    });

    // 2. Initialize Echo & Noise Manager
    this.echoManager = new EchoAndNoiseManager();

    // 3. Initialize Audio Output Manager
    this.outputManager = new AudioOutputManager();

    // 4. Initialize Quality Checker
    this.qualityChecker = new AudioQualityChecker({
      onQualityAlert: (_metrics, message) => {
        if (message) {
          this.showAlert(message, 'warning');
        }
      }
    });

    // 5. Initialize VAD
    this.vad = new VoiceActivityDetector({
      onSpeechStart: () => {
        this.updateStatus('Customer Speaking...', 'customer');
      },
      onSpeechEnd: (durationMs) => {
        console.log(`Speech turn concluded: ${durationMs}ms`);
        if (this.isSessionActive && !this.bargeInManager.getIsAiSpeaking()) {
          this.updateStatus('Processing speech...', 'processing');
        }
      },
      onVolumeChange: (rms, peak) => {
        this.updateVuMeter(rms);
        this.qualityChecker.evaluateMetrics(rms, peak);
        this.bargeInManager.evaluateAudioLevel(rms);
      },
      onStateChange: (state: VadState) => {
        this.updateVadBadge(state);
      }
    });

    // 6. Initialize Audio Capture Manager
    this.captureManager = new AudioCaptureManager({
      onPermissionChange: (state) => {
        this.updatePermissionBadge(state);
      },
      onDeviceChange: (devices) => {
        this.handleDeviceChange(devices);
      },
      onError: (friendlyMsg) => {
        this.showAlert(friendlyMsg, 'error');
      }
    });

    // 7. Initialize Connection Recovery Watchdog
    this.recoveryManager = new ConnectionRecovery({
      onReconnecting: (attempt, message) => {
        this.showAlert(`[Attempt ${attempt}] ${message}`, 'warning');
        this.updateStatus('Reconnecting audio...', 'warning');
      },
      onRecovered: () => {
        this.showAlert('Audio connection restored.', 'info');
        this.updateStatus('Listening...', 'listening');
      },
      onFailed: (message) => {
        this.showAlert(message, 'error');
        this.stopSession();
      }
    });

    // 8. Initialize Providers
    this.webSpeechFallback = new WebSpeechFallback(this.bargeInManager, {
      onTranscript: (text, isFinal) => {
        this.addTranscriptMessage('customer', text, isFinal);
      },
      onAiSpeakingStart: (text) => {
        this.addTranscriptMessage('ai', text, true);
      },
      onAiSpeakingEnd: () => {
        if (this.isSessionActive) {
          this.updateStatus('Listening...', 'listening');
        }
      },
      onError: (friendlyMsg) => {
        this.showAlert(friendlyMsg, 'error');
      }
    });

    this.vapiConnector = new VapiConnector(undefined, {
      onCallStart: () => {
        this.updateStatus('Connected to Vapi Voice', 'listening');
      },
      onCallEnd: () => {
        this.updateStatus('Session Idle', 'idle');
      },
      onError: (msg) => {
        this.showAlert(msg, 'error');
      }
    });
  }

  public initUI(): void {
    // Bind canvas visualizer
    const canvas = document.getElementById('waveformCanvas') as HTMLCanvasElement;
    if (canvas) {
      this.visualizer = new AudioVisualizer(canvas);
      this.visualizer.start();
    }

    // Bind Mic Toggle Button
    const micBtn = document.getElementById('micToggleBtn') as HTMLButtonElement;
    if (micBtn) {
      micBtn.addEventListener('click', () => {
        this.toggleSession();
      });
    }

    // Bind Acceptance Test Run Button
    const testBtn = document.getElementById('btnRunTests') as HTMLButtonElement;
    if (testBtn) {
      testBtn.addEventListener('click', () => {
        this.runAcceptanceTests();
      });
    }

    // Bind Quick Prompts
    const promptButtons = document.querySelectorAll('.prompt-chip');
    promptButtons.forEach((btn) => {
      btn.addEventListener('click', (e) => {
        const target = e.currentTarget as HTMLElement;
        const promptText = target.getAttribute('data-prompt');
        if (promptText) {
          this.simulateUserPrompt(promptText);
        }
      });
    });

    // Initial check of devices
    this.captureManager.getAvailableAudioDevices().then((devices) => {
      this.handleDeviceChange(devices);
    });

    // Run acceptance tests automatically on launch to display test status
    this.runAcceptanceTests();
  }

  public async toggleSession(): Promise<void> {
    if (this.isSessionActive) {
      this.stopSession();
    } else {
      await this.startSession();
    }
  }

  public async startSession(): Promise<void> {
    try {
      this.hideAlert();
      this.updateStatus('Requesting microphone...', 'requesting');

      // 5A.17: Unlock mobile audio pipeline on user gesture
      await this.outputManager.unlockMobileAudio();

      // 5A.1 & 5A.6: Request mic with clean constraints
      const stream = await this.captureManager.requestMicrophone();

      // 5A.7: Preflight mic health check
      const preflight = await this.qualityChecker.runPreflightCheck(stream);
      if (!preflight.passed) {
        this.showAlert(preflight.message || VOICE_CONFIG.messages.microphoneUnavailable, 'warning');
      }

      // Setup audio graph (80Hz rumble filter + Analyser)
      const { analyser } = await this.echoManager.setupAudioPipeline(stream, this.outputManager.getAudioContext() || undefined);

      // Attach visualizer
      if (this.visualizer) {
        this.visualizer.attachAnalyser(analyser);
      }

      // Start VAD & Quality Monitoring
      this.vad.start(analyser, this.echoManager);
      this.qualityChecker.startMonitoring();

      // Attach connection watchdog
      this.recoveryManager.watchStream(stream, () => this.captureManager.requestMicrophone());

      this.isSessionActive = true;
      this.updateMicButtonUI(true);

      if (this.activeMode === 'standalone') {
        this.webSpeechFallback.startListening();
        this.updateStatus('Listening for customer...', 'listening');
        // Initial welcome greeting
        this.webSpeechFallback.speak(
          'Hello! Welcome to our wellness store. How can I help you today? We have 30, 60, and 100-pill packs available.'
        );
      } else {
        await this.vapiConnector.startSession();
      }
    } catch (err: unknown) {
      console.error('Session start error:', err);
      this.stopSession();
      const message = err instanceof Error ? err.message : VOICE_CONFIG.messages.permissionDenied;
      this.showAlert(message, 'error');
    }
  }

  public stopSession(): void {
    this.isSessionActive = false;
    this.captureManager.stopCapture();
    this.vad.stop();
    this.qualityChecker.stopMonitoring();
    this.echoManager.cleanup();
    this.recoveryManager.stopWatchdog();
    this.bargeInManager.triggerBargeIn('manual');

    if (this.activeMode === 'standalone') {
      this.webSpeechFallback.stopListening();
    } else {
      this.vapiConnector.stopSession();
    }

    this.updateMicButtonUI(false);
    this.updateStatus('Session Idle', 'idle');
    this.updateVuMeter(0);
  }

  private handleInterruption(timestamp: number, cause: string): void {
    console.log(`[5A.3 Barge-In] Customer interrupted AI speech at ${timestamp} (cause: ${cause})`);
    this.updateStatus('Interrupted! Listening to customer...', 'interrupted');

    // Add visual indicator to transcript
    const transcriptBox = document.getElementById('transcriptBox');
    if (transcriptBox) {
      const bubble = document.createElement('div');
      bubble.className = 'message-bubble ai barge-in';
      bubble.innerHTML = `<div class="bubble-author">⚡ Barge-in Triggered</div><div>AI response cut off immediately upon customer speech</div>`;
      transcriptBox.appendChild(bubble);
      transcriptBox.scrollTop = transcriptBox.scrollHeight;
    }
  }

  private simulateUserPrompt(promptText: string): void {
    if (!this.isSessionActive) {
      this.startSession().then(() => {
        setTimeout(() => this.processSimulatedPrompt(promptText), 400);
      });
    } else {
      this.processSimulatedPrompt(promptText);
    }
  }

  private processSimulatedPrompt(promptText: string): void {
    // If AI is currently speaking, prompt triggers barge-in!
    if (this.bargeInManager.getIsAiSpeaking()) {
      this.bargeInManager.triggerBargeIn('voice_detected');
    }

    this.addTranscriptMessage('customer', promptText, true);

    if (promptText.toLowerCase().includes('catalog') || promptText.toLowerCase().includes('options')) {
      const pacerResponse = ConversationalPacer.formatProductOptionsResponse();
      this.webSpeechFallback.speak(pacerResponse);
    } else {
      this.webSpeechFallback.handleCustomerUtterance(promptText);
    }
  }

  private addTranscriptMessage(author: 'customer' | 'ai', text: string, isFinal: boolean): void {
    const transcriptBox = document.getElementById('transcriptBox');
    if (!transcriptBox) return;

    let targetElement = document.getElementById('interimMessage');

    if (!isFinal) {
      if (!targetElement) {
        targetElement = document.createElement('div');
        targetElement.id = 'interimMessage';
        targetElement.className = `message-bubble ${author}`;
        transcriptBox.appendChild(targetElement);
      }
      targetElement.innerHTML = `<div class="bubble-author">${author === 'customer' ? 'Customer' : 'AI Assistant'} (speaking...)</div><div>${text}</div>`;
    } else {
      if (targetElement) {
        targetElement.remove();
      }
      const bubble = document.createElement('div');
      bubble.className = `message-bubble ${author}`;
      bubble.innerHTML = `<div class="bubble-author">${author === 'customer' ? 'Customer' : 'AI Assistant'}</div><div>${text}</div>`;
      transcriptBox.appendChild(bubble);
    }

    transcriptBox.scrollTop = transcriptBox.scrollHeight;
  }

  private updateVuMeter(rms: number): void {
    const fill = document.getElementById('vuFill');
    const dbValue = document.getElementById('rmsValue');
    if (fill) {
      const pct = Math.min(100, Math.round(rms * 280));
      fill.style.width = `${pct}%`;
    }
    if (dbValue) {
      const db = rms > 0.0001 ? Math.round(20 * Math.log10(rms)) : -60;
      dbValue.textContent = `${db} dB`;
    }
  }

  private updateStatus(text: string, stateClass: string): void {
    const statusLabel = document.getElementById('statusLabel');
    if (statusLabel) {
      statusLabel.textContent = text;
      statusLabel.className = `status-label ${stateClass}`;
    }
  }

  private updateMicButtonUI(isActive: boolean): void {
    const btn = document.getElementById('micToggleBtn');
    if (btn) {
      if (isActive) {
        btn.classList.add('active');
        btn.setAttribute('title', 'Click to End Voice Session');
      } else {
        btn.classList.remove('active');
        btn.setAttribute('title', 'Click to Speak with AI Assistant');
      }
    }
  }

  private updatePermissionBadge(state: string): void {
    const badge = document.getElementById('permissionBadge');
    if (badge) {
      badge.textContent = `Mic: ${state.toUpperCase()}`;
    }
  }

  private updateVadBadge(state: VadState): void {
    const badge = document.getElementById('vadBadge');
    if (badge) {
      badge.textContent = `VAD: ${state.replace('_', ' ').toUpperCase()}`;
    }
  }

  private handleDeviceChange(devices: Array<{ isBluetoothOrHeadset: boolean; label: string }>): void {
    const deviceBadge = document.getElementById('deviceBadge');
    const hasHeadset = devices.some((d) => d.isBluetoothOrHeadset);
    if (deviceBadge) {
      deviceBadge.textContent = hasHeadset ? 'Audio: Headset / BT' : 'Audio: Built-in Mic';
    }
  }

  private showAlert(message: string, type: 'warning' | 'error' | 'info'): void {
    const banner = document.getElementById('alertBanner');
    if (banner) {
      banner.textContent = message;
      banner.className = `alert-banner active ${type}`;
    }
  }

  private hideAlert(): void {
    const banner = document.getElementById('alertBanner');
    if (banner) {
      banner.className = 'alert-banner';
      banner.textContent = '';
    }
  }

  public async runAcceptanceTests(): Promise<void> {
    const resultsContainer = document.getElementById('testsContainer');
    if (!resultsContainer) return;

    resultsContainer.innerHTML = '<div style="padding: 1rem; color: #94a3b8;">Running Section 5A.22 Acceptance Tests...</div>';

    const testResults: TestResult[] = await VoiceAcceptanceSuite.runAutomatedAcceptanceTests();

    resultsContainer.innerHTML = '';
    testResults.forEach((test) => {
      const item = document.createElement('div');
      item.className = `test-item ${test.passed ? 'passed' : 'failed'}`;
      item.innerHTML = `
        <div>
          <div class="test-name">${test.name}</div>
          <div class="test-desc">${test.actual}</div>
        </div>
        <span class="test-badge ${test.passed ? 'pass' : 'fail'}">${test.passed ? 'PASS' : 'FAIL'}</span>
      `;
      resultsContainer.appendChild(item);
    });

    const passedCount = testResults.filter((t) => t.passed).length;
    const testSummaryBadge = document.getElementById('testSummaryBadge');
    if (testSummaryBadge) {
      testSummaryBadge.textContent = `Acceptance Tests: ${passedCount}/${testResults.length} Passed`;
    }
  }
}
