/**
 * CompactVoiceConsole
 * Implements Section 2 (Frontend Redesign), Section 4 (Lightweight Voice Console),
 * Section 7 (Mute Option), Section 8 (End / Close Session),
 * Section 20/21 (Login Action), Section 31 (Minimal Transcript), and Section 35 (Accessibility).
 */

import { VoiceStateMachine, VoiceState } from '../state/VoiceStateMachine';
import { VoiceOrbVisualizer } from './VoiceOrbVisualizer';
import { AuthService } from '../services/authService';

export interface ConsoleCallbacks {
  onToggleMute: () => void;
  onEndSession: () => void;
  onRetry: () => void;
  onUserConfirmedCartAction?: () => void;
}

export class CompactVoiceConsole {
  private container: HTMLElement;
  private stateMachine: VoiceStateMachine;
  private orbVisualizer: VoiceOrbVisualizer | null = null;
  private callbacks: ConsoleCallbacks;

  private isVisible = false;
  private isMuted = false;

  public getIsMuted(): boolean {
    return this.isMuted;
  }

  constructor(stateMachine: VoiceStateMachine, callbacks: ConsoleCallbacks) {
    this.stateMachine = stateMachine;
    this.callbacks = callbacks;
    this.container = this.createConsoleElement();
    document.body.appendChild(this.container);

    this.initOrb();
    this.subscribeState();
  }

  private createConsoleElement(): HTMLElement {
    const el = document.createElement('div');
    el.id = 'compactVoiceConsole';
    el.className = 'voice-console-overlay hidden';
    el.setAttribute('role', 'dialog');
    el.setAttribute('aria-label', 'AI Voice Assistant');
    el.setAttribute('aria-modal', 'true');

    el.innerHTML = `
      <div class="voice-console-card">
        <!-- Header -->
        <div class="voice-console-header">
          <div class="console-title">
            <span class="pulsing-badge"></span>
            <span>AI VOICE ASSISTANT</span>
          </div>
          <button id="btnCloseConsole" class="console-close-btn" aria-label="End voice session" title="Close">
            ✕
          </button>
        </div>

        <!-- Animated Orb Visualizer (Section 30) -->
        <div class="console-orb-container">
          <canvas id="consoleOrbCanvas" width="180" height="180"></canvas>
        </div>

        <!-- Dynamic Greeting & Live Response Text (Section 5) -->
        <div class="console-dialogue-area">
          <p id="consoleGreetingText" class="console-main-text">
            Connecting to assistant...
          </p>
          <p id="consoleSubText" class="console-sub-text">
            Please wait a moment
          </p>
        </div>

        <!-- Status Indicator Pill -->
        <div class="console-status-pill">
          <span id="consoleStatusIcon">🎙️</span>
          <span id="consoleStatusText">Connecting...</span>
        </div>

        <!-- Contextual Action Bar (Auth / Cart Confirmation) -->
        <div id="consoleActionBar" class="console-action-bar hidden"></div>

        <!-- Minimal Transcript Drawer (Section 31) -->
        <div id="consoleTranscriptArea" class="console-transcript-box"></div>

        <!-- Footer Controls (Section 7 Mute & Section 8 End) -->
        <div class="console-controls-footer">
          <button id="btnConsoleMute" class="control-btn mute-btn" aria-label="Mute microphone">
            <span id="muteBtnIcon">🔇</span>
            <span id="muteBtnText">Mute</span>
          </button>
          <button id="btnConsoleEnd" class="control-btn end-btn" aria-label="End voice session">
            <span>✕</span>
            <span>End Call</span>
          </button>
        </div>
      </div>
    `;

    // Event Listeners
    const btnMute = el.querySelector('#btnConsoleMute') as HTMLButtonElement;
    btnMute.addEventListener('click', () => {
      this.callbacks.onToggleMute();
    });

    const btnEnd = el.querySelector('#btnConsoleEnd') as HTMLButtonElement;
    btnEnd.addEventListener('click', () => {
      this.callbacks.onEndSession();
    });

    const btnClose = el.querySelector('#btnCloseConsole') as HTMLButtonElement;
    btnClose.addEventListener('click', () => {
      this.callbacks.onEndSession();
    });

    return el;
  }

  private initOrb(): void {
    const canvas = this.container.querySelector('#consoleOrbCanvas') as HTMLCanvasElement;
    if (canvas) {
      this.orbVisualizer = new VoiceOrbVisualizer(canvas);
      this.orbVisualizer.start();
    }
  }

  public setAnalyser(analyser: AnalyserNode | null): void {
    if (this.orbVisualizer) {
      this.orbVisualizer.setAnalyser(analyser);
    }
  }

  public show(): void {
    this.isVisible = true;
    this.container.classList.remove('hidden');
    this.container.classList.add('visible');
  }

  public hide(): void {
    this.isVisible = false;
    this.container.classList.remove('visible');
    this.container.classList.add('hidden');
  }

  public getIsVisible(): boolean {
    return this.isVisible;
  }

  public setGreeting(greetingText: string, subText: string = ''): void {
    const greetingEl = this.container.querySelector('#consoleGreetingText');
    const subEl = this.container.querySelector('#consoleSubText');
    if (greetingEl) greetingEl.textContent = `"${greetingText}"`;
    if (subEl) subEl.textContent = subText;
  }

  public setMuted(muted: boolean): void {
    this.isMuted = muted;
    const btnText = this.container.querySelector('#muteBtnText');
    const btnIcon = this.container.querySelector('#muteBtnIcon');
    const muteBtn = this.container.querySelector('#btnConsoleMute');

    if (muted) {
      if (btnText) btnText.textContent = 'Unmute';
      if (btnIcon) btnIcon.textContent = '🎙️';
      muteBtn?.classList.add('active-muted');
      muteBtn?.setAttribute('aria-label', 'Unmute microphone');
    } else {
      if (btnText) btnText.textContent = 'Mute';
      if (btnIcon) btnIcon.textContent = '🔇';
      muteBtn?.classList.remove('active-muted');
      muteBtn?.setAttribute('aria-label', 'Mute microphone');
    }
  }

  public addTranscriptEntry(speaker: 'User' | 'AI', text: string): void {
    const transcript = this.container.querySelector('#consoleTranscriptArea');
    if (transcript) {
      const entry = document.createElement('div');
      entry.className = `transcript-line ${speaker.toLowerCase()}`;
      entry.innerHTML = `<span class="speaker-tag">${speaker}:</span> <span class="speaker-text">${text}</span>`;
      transcript.appendChild(entry);
      transcript.scrollTop = transcript.scrollHeight;
    }
  }

  public clearTranscript(): void {
    const transcript = this.container.querySelector('#consoleTranscriptArea');
    if (transcript) {
      transcript.innerHTML = '';
    }
  }

  /**
   * Section 20 & 21: Contextual Login Action Bar inside console
   */
  public showLoginAction(): void {
    const bar = this.container.querySelector('#consoleActionBar');
    if (!bar) return;

    bar.classList.remove('hidden');
    bar.innerHTML = `
      <div class="auth-prompt-card">
        <p>🔒 Please sign in to add items to your cart</p>
        <button id="btnConsoleLoginAction" class="btn-primary-action">
          Log In Now
        </button>
      </div>
    `;

    const loginBtn = bar.querySelector('#btnConsoleLoginAction');
    loginBtn?.addEventListener('click', () => {
      // Prompt user or log them in with test account
      AuthService.login('customer@example.com');
      bar.classList.add('hidden');
      // Trigger confirmation of pending cart item
      this.callbacks.onUserConfirmedCartAction?.();
    });
  }

  public hideActionBar(): void {
    const bar = this.container.querySelector('#consoleActionBar');
    if (bar) {
      bar.classList.add('hidden');
      bar.innerHTML = '';
    }
  }

  /**
   * Subscribes to central state machine
   */
  private subscribeState(): void {
    this.stateMachine.subscribe((details) => {
      const state = details.currentState;
      if (this.orbVisualizer) {
        this.orbVisualizer.setState(state);
      }

      this.updateStatusBadge(state, details.errorMessage);

      if (state === 'LOGIN_REQUIRED') {
        this.showLoginAction();
      } else if (state !== 'ACTION_CONFIRMATION') {
        this.hideActionBar();
      }
    });
  }

  private updateStatusBadge(state: VoiceState, errorMsg?: string): void {
    const iconEl = this.container.querySelector('#consoleStatusIcon');
    const textEl = this.container.querySelector('#consoleStatusText');

    let icon = '🎙️';
    let label = 'Listening...';

    switch (state) {
      case 'IDLE':
        icon = '⏸️';
        label = 'Idle';
        break;
      case 'CONNECTING':
        icon = '⏳';
        label = 'Connecting...';
        break;
      case 'READY':
      case 'LISTENING':
        icon = '🎙️';
        label = 'Listening...';
        break;
      case 'USER_SPEAKING':
        icon = '🗣️';
        label = 'Listening to you...';
        break;
      case 'TRANSCRIBING':
      case 'THINKING':
        icon = '✨';
        label = 'Thinking...';
        break;
      case 'ASSISTANT_SPEAKING':
        icon = '🔊';
        label = 'Speaking...';
        break;
      case 'MUTED':
        icon = '🔇';
        label = 'Microphone Muted';
        break;
      case 'LOGIN_REQUIRED':
        icon = '🔒';
        label = 'Login Required';
        break;
      case 'ACTION_CONFIRMATION':
        icon = '🛒';
        label = 'Cart Confirmation';
        break;
      case 'ERROR':
        icon = '⚠️';
        label = errorMsg || "Something went wrong. Let's try again.";
        break;
      case 'ENDED':
        icon = '✕';
        label = 'Session Ended';
        break;
    }

    if (iconEl) iconEl.textContent = icon;
    if (textEl) textEl.textContent = label;
  }
}
