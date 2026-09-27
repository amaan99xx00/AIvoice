/**
 * VoiceSessionController
 * Master orchestrator connecting the Single Floating Mic Button, Compact Voice Console,
 * State Machine, Clean Audio Pipeline, Multilingual Intent Router, WooCommerce Service,
 * and ExpertModalComponent.
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
import { AuthService } from '../services/authService';
import { WebSpeechFallback } from '../provider/WebSpeechFallback';
import { ExpertModalComponent } from '../components/ExpertModal';

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
          this.voiceConsole.setGreeting("I'm listening...", "Speak in English, French, German, or Hindi");
        }
      }
    });

    // 2. Audio Capture Manager (Section 7, 8, 9, 27, 34)
    this.captureManager = new AudioCaptureManager({
      onError: (msg) => {
        this.stateMachine.transition('ERROR', { errorMessage: msg });
        this.voiceConsole.setGreeting('Microphone access is required', 'Please enable access in browser settings or use text chat below');
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
        if (this.bargeInManager.getIsAiSpeaking()) {
          return;
        }
        if (!this.captureManager.isMuted() && this.isSessionActive) {
          this.stateMachine.transition('USER_SPEAKING');
        }
      },
      onSpeechEnd: (_durationMs) => {
        if (this.isSessionActive && !this.captureManager.isMuted() && !this.bargeInManager.getIsAiSpeaking()) {
          if (this.stateMachine.getState() === 'USER_SPEAKING') {
            this.stateMachine.transition('THINKING');
          }
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
          this.stateMachine.transition('USER_SPEAKING');
          this.voiceConsole.setGreeting(`"${text}"`, 'Hearing your voice...');
        } else {
          this.handleCustomerUtterance(text);
        }
      },
      onSpeechDetected: () => {
        if (this.isSessionActive && !this.bargeInManager.getIsAiSpeaking()) {
          this.stateMachine.transition('USER_SPEAKING');
        }
      },
      onError: (err) => {
        console.warn('Speech engine warning:', err);
      }
    });

    // 6. Compact Voice Console with Text Input Fallback & Action Chips
    this.voiceConsole = new CompactVoiceConsole(this.stateMachine, {
      onToggleMute: () => this.toggleMute(),
      onEndSession: () => this.endSession(),
      onRetry: () => this.startSession(),
      onUserConfirmedCartAction: () => this.handlePostAuthCartConfirmation(),
      onUserTextInput: (text: string) => {
        this.handleUserTextFallback(text);
      },
      onActionChipClick: (actionType: string, payload?: any) => {
        this.handleActionChipTrigger(actionType, payload);
      }
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
      this.voiceConsole.setGreeting('Connecting to Moda AI...', 'Setting up audio pipeline');

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

      // Section 8: Natural Opening & Conversational Tone
      const isReturning = AuthService.isLoggedIn() || localStorage.getItem('moda_session_visited') === 'true';
      try {
        localStorage.setItem('moda_session_visited', 'true');
      } catch (e) {
        // ignore in private browsing
      }
      const greeting = isReturning
        ? 'Hi, welcome back. How can I help you today?'
        : 'Hi! How can I help you today?';

      this.voiceConsole.setGreeting(greeting, 'Moda AI Assistant');
      this.voiceConsole.addTranscriptEntry('AI', greeting);

      // Set initial quick suggestion chips
      this.voiceConsole.setActionChips([
        { label: 'Modalert 100mg', actionType: 'SIMULATE', payload: 'Tell me about Modalert 100mg' },
        { label: 'Wholesale & Bulk', actionType: 'OPEN_EXPERT_CALL', payload: { type: 'bulk' } },
        { label: 'Modafinil vs Armodafinil', actionType: 'SIMULATE', payload: 'What is the difference between Modafinil and Armodafinil?' }
      ]);

      // Section 13: Speak greeting then STOP SPEAKING. Wait silently for customer.
      this.speechEngine.speak(greeting);
    } catch (err: unknown) {
      console.error('Failed to start voice session:', err);
      this.isSessionActive = false;
      this.stateMachine.setIsTransitioning(false);
      this.stateMachine.transition('ERROR', {
        errorMessage: 'Microphone permission not granted. You can still type below.'
      });
      // Allow user to use text fallback even if mic fails
      this.voiceConsole.show();
      this.voiceConsole.setGreeting(
        "Microphone wasn't detected",
        'You can type your questions in the box below!'
      );
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
    if (!this.isSessionActive) {
      this.voiceConsole.hide();
      return;
    }

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
   * Handles text input fallback (typing in the console)
   */
  public handleUserTextFallback(text: string): void {
    if (!this.voiceConsole.getIsVisible()) {
      this.voiceConsole.show();
    }
    this.handleCustomerUtterance(text);
  }

  /**
   * Handles clicking on an Action Chip in the console
   */
  private handleActionChipTrigger(actionType: string, payload?: any): void {
    if (actionType === 'OPEN_EXPERT_CALL') {
      ExpertModalComponent.open(payload?.type || 'bulk', payload?.prefillMessage);
    } else if (actionType === 'NAVIGATE') {
      const target = document.querySelector(payload?.targetSelector || '#products');
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
      }
    } else if (actionType === 'CONFIRM_CART') {
      this.handleCustomerUtterance('Yes, add it');
    } else if (actionType === 'SIMULATE' && typeof payload === 'string') {
      this.handleCustomerUtterance(payload);
    }
  }

  /**
   * Processes user customer speech/text with context, language following, and on-demand product info
   */
  public async handleCustomerUtterance(transcript: string): Promise<void> {
    if (!transcript.trim()) return;

    this.voiceConsole.addTranscriptEntry('User', transcript);
    this.stateMachine.transition('THINKING');

    // Route intent
    const result = this.router.processUtterance(transcript);

    // Update dialogue text & transcript
    this.voiceConsole.setGreeting(result.aiResponseText, 'Moda AI Assistant');
    this.voiceConsole.addTranscriptEntry('AI', result.aiResponseText);

    // Dynamic Product Display (Single Product Card / Multi-Product List)
    if (result.productCard) {
      this.voiceConsole.displayProductCard(result.productCard);
    } else if (result.productList && result.productList.length > 0) {
      this.voiceConsole.displayProductList(result.productList);
    } else {
      this.voiceConsole.clearProductDisplay();
    }

    // Dynamic Action Chips based on response
    const chips: { label: string; actionType: string; payload?: any }[] = [];

    if (result.actionRequired === 'OPEN_EXPERT_CALL' && result.actionButtonLabel) {
      chips.push({
        label: result.actionButtonLabel,
        actionType: 'OPEN_EXPERT_CALL',
        payload: result.actionPayload
      });
    }

    if (result.actionRequired === 'NAVIGATE') {
      if (result.actionButtonLabel) {
        chips.push({
          label: result.actionButtonLabel,
          actionType: 'NAVIGATE',
          payload: result.actionPayload
        });
      }
      // Auto smooth scroll to requested section
      const target = document.querySelector(result.actionPayload?.targetSelector || '');
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
      }
    }

    if (result.actionRequired === 'CONFIRM_CART') {
      chips.push({
        label: '🛒 Yes, Add to Cart',
        actionType: 'CONFIRM_CART'
      });
    }

    if (chips.length > 0) {
      this.voiceConsole.setActionChips(chips);
    } else {
      this.voiceConsole.clearActionChips();
    }

    // Speak response
    this.speechEngine.speak(result.aiResponseText);

    // Handle authentication or real cart addition
    if (result.actionRequired === 'REQUIRE_AUTH') {
      this.stateMachine.transition('LOGIN_REQUIRED');
    } else if (result.actionRequired === 'CONFIRM_CART') {
      this.stateMachine.transition('ACTION_CONFIRMATION');
    } else if (result.actionRequired === 'CART_COMPLETED' && result.suggestedActionPayload) {
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
    this.voiceConsole.setActionChips([
      { label: '🛒 Yes, Add to Cart', actionType: 'CONFIRM_CART' }
    ]);
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

  public setPageContext(context: {
    pageType: 'home' | 'shop' | 'product' | 'content' | 'about' | 'blog';
    slug?: string;
    product?: any;
  }): void {
    this.router.setPageContext(context);
  }

  public getStateMachine(): VoiceStateMachine {
    return this.stateMachine;
  }
}
