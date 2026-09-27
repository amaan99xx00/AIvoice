/**
 * FloatingMicButton
 * Implements Section 3 (ONLY ONE FLOATING MICROPHONE BUTTON)
 * Circular glassmorphism design with soundwave animation, safe-area mobile positioning,
 * and Section 33 (Double-connection prevention).
 */

import { VoiceStateMachine, VoiceState } from '../state/VoiceStateMachine';

export interface FloatingButtonCallbacks {
  onClick: () => void;
}

export class FloatingMicButton {
  private buttonElement: HTMLElement;
  private stateMachine: VoiceStateMachine;
  private callbacks: FloatingButtonCallbacks;
  private lastClickTime = 0;

  constructor(stateMachine: VoiceStateMachine, callbacks: FloatingButtonCallbacks) {
    this.stateMachine = stateMachine;
    this.callbacks = callbacks;
    this.buttonElement = this.createButtonElement();
    document.body.appendChild(this.buttonElement);

    this.subscribeState();
  }

  private createButtonElement(): HTMLElement {
    const wrapper = document.createElement('div');
    wrapper.id = 'floatingMicContainer';
    wrapper.className = 'floating-mic-wrapper';

    wrapper.innerHTML = `
      <button
        id="primaryFloatingMicBtn"
        class="floating-mic-btn idle"
        aria-label="Start AI Voice Concierge"
        title="Talk to AI Voice Concierge (English, French, German, Hindi)"
      >
        <div class="pulse-ring"></div>
        <div class="mic-icon-circle">
          <svg class="mic-svg" viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path>
            <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
            <line x1="12" y1="19" x2="12" y2="23"></line>
            <line x1="8" y1="23" x2="16" y2="23"></line>
          </svg>
          <div class="sound-wave-bars">
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>
        <span id="floatingMicLabel" class="mic-label">Voice AI</span>
      </button>
    `;

    const btn = wrapper.querySelector('#primaryFloatingMicBtn') as HTMLButtonElement;
    btn.addEventListener('click', () => {
      const now = performance.now();
      // Section 33: Prevent double connections from rapid clicking
      if (now - this.lastClickTime < 450) {
        return;
      }
      this.lastClickTime = now;

      if (this.stateMachine.getIsTransitioning()) {
        return;
      }

      this.callbacks.onClick();
    });

    return wrapper;
  }

  private subscribeState(): void {
    this.stateMachine.subscribe((details) => {
      this.updateStateUI(details.currentState);
    });
  }

  private updateStateUI(state: VoiceState): void {
    const btn = this.buttonElement.querySelector('#primaryFloatingMicBtn') as HTMLButtonElement;
    const label = this.buttonElement.querySelector('#floatingMicLabel');
    if (!btn || !label) return;

    // Reset base classes
    btn.className = 'floating-mic-btn';

    switch (state) {
      case 'IDLE':
      case 'ENDED':
        btn.classList.add('idle');
        label.textContent = 'Voice AI';
        btn.setAttribute('aria-label', 'Start AI voice concierge');
        break;

      case 'CONNECTING':
        btn.classList.add('connecting');
        label.textContent = 'Connecting...';
        btn.setAttribute('aria-label', 'Connecting to voice concierge');
        break;

      case 'READY':
      case 'LISTENING':
        btn.classList.add('listening');
        label.textContent = 'Listening...';
        btn.setAttribute('aria-label', 'Listening for your voice');
        break;

      case 'USER_SPEAKING':
        btn.classList.add('user-speaking');
        label.textContent = 'Hearing you...';
        btn.setAttribute('aria-label', 'Hearing your voice');
        break;

      case 'TRANSCRIBING':
      case 'THINKING':
        btn.classList.add('thinking');
        label.textContent = 'Thinking...';
        btn.setAttribute('aria-label', 'AI is processing response');
        break;

      case 'ASSISTANT_SPEAKING':
        btn.classList.add('speaking');
        label.textContent = 'Speaking...';
        btn.setAttribute('aria-label', 'AI concierge is speaking');
        break;

      case 'MUTED':
        btn.classList.add('muted');
        label.textContent = 'Muted';
        btn.setAttribute('aria-label', 'Microphone is muted');
        break;

      case 'ERROR':
        btn.classList.add('error');
        label.textContent = 'Retry Mic';
        btn.setAttribute('aria-label', 'Microphone error. Click to retry');
        break;

      case 'LOGIN_REQUIRED':
      case 'ACTION_CONFIRMATION':
        btn.classList.add('action-needed');
        label.textContent = 'Action Ready';
        break;
    }
  }
}
