/**
 * VoiceSessionController
 * Master orchestrator connecting the Single Floating Mic Button, Compact Voice Console,
 * State Machine, Clean Audio Pipeline, Multilingual Intent Router, and WooCommerce Service.
 */

import { VoiceStateMachine } from '../state/VoiceStateMachine';
import { FloatingMicButton } from './FloatingMicButton';
import { CompactVoiceConsole } from './CompactVoiceConsole';
import { AudioCaptureManager } from '../audio/AudioCaptureManager';
import { EchoAndNoiseManager } from '../audio/EchoAndNoiseManager';
import { VoiceActivityDetector } from '../audio/VoiceActivityDetector';
import { BargeInManager } from '../audio/BargeInManager';
import { AudioQualityChecker } from '../audio/AudioQualityChecker';
import { AudioOutputManager } from '../audio/AudioOutputManager';
import { MultilingualIntentRouter } from '../speech/MultilingualIntentRouter';
import { WooCommerceService } from '../services/wooCommerceService';
import { WebSpeechFallback } from '../provider/WebSpeechFallback';

export class VoiceSessionController {
  private stateMachine: VoiceStateMachine;
  private floatingButton: FloatingMicButton;

  public getFloatingButton(): FloatingMicButton {
    return this.floatingButton;
  }
  private voiceConsole: CompactVoiceConsole;
  private captureManager: AudioCaptureManager;
  private echoManager: EchoAndNoiseManager;
  private vad: VoiceActivityDetector;
  private bargeInManager: BargeInManager;
  private qualityChecker: AudioQualityChecker;
  private outputManager: AudioOutputManager;
  private router: MultilingualIntentRouter;
  private speechEngine: WebSpeechFallback;

  private isSessionActive = false;

  constructor() {
    this.stateMachine = new VoiceStateMachine();
    this.router = new MultilingualIntentRouter();
    this.outputManager = new AudioOutputManager();
    this.echoManager = new EchoAndNoiseManager();

    // 1. Barge-in Manager (Section 6 & 25)
    this.bargeInManager = new BargeInManager({
      onInterrupted: () => {
        console.log('[Barge-In] Customer interrupted AI speech. Entering LISTENING immediately.');
        this.echoManager.setAiSpeakingState(false);
        this.stateMachine.transition('LISTENING');
        this.voiceConsole.setGreeting('Listening to you...', 'How can I help?');
      },
      onAiSpeechStarted: () => {
        this.echoManager.setAiSpeakingState(true);
        this.stateMachine.transition('ASSISTANT_SPEAKING');
      },
      onAiSpeechEnded: () => {
        this.echoManager.setAiSpeakingState(false);
        if (this.isSessionActive && !this.captureManager.isMuted()) {
          this.stateMachine.transition('LISTENING');
        }
      }
    });

    // 2. Audio Capture Manager (Section 7, 8, 9, 27, 34)
    this.captureManager = new AudioCaptureManager({
      onError: (msg) => {
        this.stateMachine.transition('ERROR', { errorMessage: msg });
        this.voiceConsole.setGreeting('Microphone access is required', 'Please enable access in browser settings');
      }
    });

    // 3. Audio Quality Checker
    this.qualityChecker = new AudioQualityChecker({
      onQualityAlert: (_metrics, msg) => {
        if (msg) {
          this.voiceConsole.setGreeting(msg, 'Please check your microphone');
        }
      }
    });

    // 4. Voice Activity Detector (Section 2, 6, 9)
    this.vad = new VoiceActivityDetector({
      onSpeechStart: () => {
        // Section 6: If customer starts speaking while AI speaks, halt TTS immediately!
        if (this.bargeInManager.getIsAiSpeaking()) {
          this.bargeInManager.triggerBargeIn('voice_detected');
        }
        if (!this.captureManager.isMuted()) {
          this.stateMachine.transition('USER_SPEAKING');
        }
      },
      onSpeechEnd: (_durationMs) => {
        if (this.isSessionActive && !this.captureManager.isMuted()) {
          this.stateMachine.transition('THINKING');
        }
      },
      onVolumeChange: (rms, peak) => {
        this.qualityChecker.evaluateMetrics(rms, peak);
        this.bargeInManager.evaluateAudioLevel(rms);
      }
    });

    // 5. Speech Recognition & Synthesis Engine
    this.speechEngine = new WebSpeechFallback(this.bargeInManager, {
      onTranscript: (text, isFinal) => {
        if (!isFinal) {
          this.voiceConsole.setGreeting(text, 'Listening to you...');
        } else {
          this.handleCustomerUtterance(text);
        }
      },
      onError: (err) => {
        console.error('Speech engine error:', err);
      }
    });

    // 6. Compact Voice Console (Section 4, 7, 8)
    this.voiceConsole = new CompactVoiceConsole(this.stateMachine, {
      onToggleMute: () => this.toggleMute(),
      onEndSession: () => this.endSession(),
      onRetry: () => this.startSession(),
      onUserConfirmedCartAction: () => this.handlePostAuthCartConfirmation()
    });

    // 7. Single Floating Microphone Button (Section 3)
    this.floatingButton = new FloatingMicButton(this.stateMachine, {
      onClick: () => this.handleFloatingMicClick()
    });
  }

  private handleFloatingMicClick(): void {
    if (!this.isSessionActive) {
      this.startSession();
    } else {
      // If already active, toggle console visibility
      if (this.voiceConsole.getIsVisible()) {
        this.voiceConsole.hide();
      } else {
        this.voiceConsole.show();
      }
    }
  }

  /**
   * Starts a voice session following Section 5 (Dynamic Greeting) & Section 13 (Stop after greeting)
   */
  public async startSession(): Promise<void> {
    if (this.isSessionActive) return;
    this.stateMachine.setIsTransitioning(true);

    try {
      this.stateMachine.transition('CONNECTING');
      this.voiceConsole.show();
      this.voiceConsole.clearTranscript();
      this.voiceConsole.setGreeting('Connecting to voice assistant...', 'Setting up audio pipeline');

      // 1. Mobile audio unlock (Section 28)
      await this.outputManager.unlockMobileAudio();

      // 2. Request clean mic stream (Section 9)
      const stream = await this.captureManager.requestMicrophone();

      // 3. Setup audio pipeline (AEC + 80Hz rumble filter)
      const { analyser } = await this.echoManager.setupAudioPipeline(
        stream,
        this.outputManager.getAudioContext() || undefined
      );

      // Connect analyser to console orb
      this.voiceConsole.setAnalyser(analyser);

      // 4. Start VAD & Quality monitoring
      this.vad.start(analyser, this.echoManager);
      this.qualityChecker.startMonitoring();

      // 5. Start speech listening
      this.speechEngine.startListening();

      this.isSessionActive = true;
      this.stateMachine.setIsTransitioning(false);

      // Section 5: Dynamic greeting based on user's local time
      const greeting = MultilingualIntentRouter.getDynamicGreeting();
      this.voiceConsole.setGreeting(greeting, 'How can I help you today?');
      this.voiceConsole.addTranscriptEntry('AI', greeting);

      // Section 13: Speak greeting then STOP SPEAKING. Wait silently for customer.
      this.speechEngine.speak(greeting);
    } catch (err: unknown) {
      console.error('Failed to start voice session:', err);
      this.isSessionActive = false;
      this.stateMachine.setIsTransitioning(false);
      this.stateMachine.transition('ERROR', {
        errorMessage: 'Microphone access is required to use voice chat.'
      });
    }
  }

  /**
   * Section 7: User Mute / Unmute Option
   */
  public toggleMute(): void {
    if (!this.isSessionActive) return;

    if (this.captureManager.isMuted()) {
      this.captureManager.unmute();
      this.voiceConsole.setMuted(false);
      this.stateMachine.transition('LISTENING');
    } else {
      this.captureManager.mute();
      this.voiceConsole.setMuted(true);
      this.stateMachine.transition('MUTED');
    }
  }

  /**
   * Section 8 & 34: End Session and release all microphone resources
   */
  public endSession(): void {
    if (!this.isSessionActive) return;

    this.isSessionActive = false;
    this.speechEngine.stopListening();
    this.bargeInManager.triggerBargeIn('manual');
    this.captureManager.releaseAll();
    this.vad.stop();
    this.qualityChecker.stopMonitoring();
    this.echoManager.cleanup();

    this.voiceConsole.hide();
    this.voiceConsole.setMuted(false);
    this.stateMachine.transition('IDLE');
    this.router.resetMemory();

    console.log('[VoiceSessionController] Session ended. Microphone resources completely released.');
  }

  /**
   * Processes user customer speech with context, language following, and on-demand product info
   */
  public async handleCustomerUtterance(transcript: string): Promise<void> {
    if (!transcript.trim()) return;

    this.voiceConsole.addTranscriptEntry('User', transcript);
    this.stateMachine.transition('THINKING');

    // Route intent
    const result = this.router.processUtterance(transcript);

    // Update dialogue text
    this.voiceConsole.setGreeting(result.aiResponseText, 'AI Assistant');
    this.voiceConsole.addTranscriptEntry('AI', result.aiResponseText);

    // Speak response
    this.speechEngine.speak(result.aiResponseText);

    // Handle actions
    if (result.actionRequired === 'REQUIRE_AUTH') {
      this.stateMachine.transition('LOGIN_REQUIRED');
    } else if (result.actionRequired === 'CONFIRM_CART') {
      this.stateMachine.transition('ACTION_CONFIRMATION');
    } else if (result.actionRequired === 'CART_COMPLETED' && result.suggestedActionPayload) {
      // Execute real cart addition (Section 22)
      await WooCommerceService.executeAddToCart(
        result.suggestedActionPayload.productId,
        result.suggestedActionPayload.variantId,
        1
      );
    }
  }

  /**
   * Section 21: Preserves pending cart context across login
   */
  public async handlePostAuthCartConfirmation(): Promise<void> {
    const pending = WooCommerceService.getPendingCartAction();
    if (!pending) return;

    const confirmationMsg = `You're logged in. Would you like me to add the ${pending.tablets}-tablet pack to your cart?`;
    this.voiceConsole.setGreeting(confirmationMsg, 'Awaiting your confirmation');
    this.voiceConsole.addTranscriptEntry('AI', confirmationMsg);
    this.speechEngine.speak(confirmationMsg);

    this.stateMachine.transition('ACTION_CONFIRMATION');
    this.router.getMemory().awaitingCartConfirmation = true;
  }

  /**
   * Allows simulated testing through the unified controller
   */
  public simulateUserUtterance(text: string): void {
    if (!this.isSessionActive) {
      this.startSession().then(() => {
        setTimeout(() => this.handleCustomerUtterance(text), 600);
      });
    } else {
      this.handleCustomerUtterance(text);
    }
  }

  public getStateMachine(): VoiceStateMachine {
    return this.stateMachine;
  }
}
