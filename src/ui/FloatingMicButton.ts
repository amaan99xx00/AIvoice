/**
 * FloatingMicButton
 * Implements Section 3 (ONLY ONE FLOATING MICROPHONE BUTTON)
 * and Section 33 (Prevent Double Connections).
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
      <button id="primaryFloatingMicBtn" class="floating-mic-btn idle" aria-label="Start voice assistant" title="Talk to AI Voice Assistant">
        <span class="pulse-ring"></span>
        <span id="floatingMicIcon" class="mic-icon">🎙️</span>
        <span id="floatingMicLabel" class="mic-label">Talk to AI</span>
      </button>
    `;

    const btn = wrapper.querySelector('#primaryFloatingMicBtn') as HTMLButtonElement;
    btn.addEventListener('click', () => {
      const now = performance.now();
      // Section 33: Prevent double connections from rapid clicking
      if (now - this.lastClickTime < 500) {
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
    const icon = this.buttonElement.querySelector('#floatingMicIcon');
    const label = this.buttonElement.querySelector('#floatingMicLabel');
    if (!btn || !icon || !label) return;

    // Reset base classes
    btn.className = 'floating-mic-btn';

    switch (state) {
      case 'IDLE':
      case 'ENDED':
        btn.classList.add('idle');
        icon.textContent = '🎙️';
        label.textContent = 'Talk to AI';
        btn.setAttribute('aria-label', 'Start voice assistant');
        break;

      case 'CONNECTING':
        btn.classList.add('connecting');
        icon.textContent = '⏳';
        label.textContent = 'Connecting...';
        btn.setAttribute('aria-label', 'Connecting to voice assistant');
        break;

      case 'READY':
      case 'LISTENING':
        btn.classList.add('listening');
        icon.textContent = '🎙️';
        label.textContent = 'Listening...';
        btn.setAttribute('aria-label', 'Listening for speech');
        break;

      case 'USER_SPEAKING':
        btn.classList.add('user-speaking');
        icon.textContent = '🗣️';
        label.textContent = 'Hearing you...';
        btn.setAttribute('aria-label', 'User is speaking');
        break;

      case 'TRANSCRIBING':
      case 'THINKING':
        btn.classList.add('thinking');
        icon.textContent = '✨';
        label.textContent = 'Thinking...';
        btn.setAttribute('aria-label', 'Assistant is thinking');
        break;

      case 'ASSISTANT_SPEAKING':
        btn.classList.add('speaking');
        icon.textContent = '🔊';
        label.textContent = 'Speaking...';
        btn.setAttribute('aria-label', 'Assistant is speaking');
        break;

      case 'MUTED':
        btn.classList.add('muted');
        icon.textContent = '🔇';
        label.textContent = 'Muted';
        btn.setAttribute('aria-label', 'Microphone is muted');
        break;

      case 'ERROR':
        btn.classList.add('error');
        icon.textContent = '⚠️';
        label.textContent = 'Retry';
        btn.setAttribute('aria-label', 'Error occurred. Click to retry');
        break;

      case 'LOGIN_REQUIRED':
      case 'ACTION_CONFIRMATION':
        btn.classList.add('action-needed');
        icon.textContent = '🛒';
        label.textContent = 'Action Needed';
        break;
    }
  }
}
