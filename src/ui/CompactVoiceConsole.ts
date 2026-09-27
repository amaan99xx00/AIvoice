/**
 * CompactVoiceConsole
 * Modern Assistant Panel with Animated Orb, Conversational Bubbles,
 * Interactive Action Chips (Bulk Call / Specialist Handoff / Cart),
 * and Integrated Text Input Fallback with Send Button.
 */

import { VoiceStateMachine, VoiceState } from '../state/VoiceStateMachine';
import { VoiceOrbVisualizer } from './VoiceOrbVisualizer';
import { AuthService } from '../services/authService';
import { UnifiedProduct } from '../services/UnifiedProductService';
import { AppRouter } from '../router/Router';

export interface ConsoleCallbacks {
  onToggleMute: () => void;
  onEndSession: () => void;
  onRetry: () => void;
  onUserConfirmedCartAction?: () => void;
  onUserTextInput?: (text: string) => void;
  onActionChipClick?: (actionType: string, payload?: any) => void;
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
    el.setAttribute('aria-label', 'Moda AI Voice Assistant Panel');
    el.setAttribute('aria-modal', 'true');

    el.innerHTML = `
      <div class="voice-console-card">
        <!-- Header -->
        <div class="voice-console-header">
          <div class="console-title-area">
            <div class="console-avatar">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <path d="M8 14s1.5 2 4 2 4-2 4-2"></path>
                <line x1="9" y1="9" x2="9.01" y2="9"></line>
                <line x1="15" y1="9" x2="15.01" y2="9"></line>
              </svg>
            </div>
            <div>
              <div class="console-brand-row">
                <span class="pulsing-badge"></span>
                <span class="console-brand-name">Moda AI Concierge</span>
              </div>
              <span class="console-brand-languages">EN • FR • DE • HI</span>
            </div>
          </div>
          
          <div class="console-header-actions">
            <!-- Status Badge -->
            <div class="console-status-pill">
              <span id="consoleStatusIcon">🎙️</span>
              <span id="consoleStatusText">Connecting...</span>
            </div>
            <button id="btnCloseConsole" class="console-close-btn" aria-label="Close assistant" title="Close">
              ✕
            </button>
          </div>
        </div>

        <!-- Animated Orb Visualizer -->
        <div class="console-orb-container">
          <canvas id="consoleOrbCanvas" width="160" height="160"></canvas>
        </div>

        <!-- Latest AI / User Live Dialogue Text -->
        <div class="console-dialogue-area">
          <p id="consoleGreetingText" class="console-main-text">
            Connecting to Moda AI...
          </p>
          <p id="consoleSubText" class="console-sub-text">
            Preparing secure microphone pipeline
          </p>
        </div>

        <!-- Interactive Action Chips Container -->
        <div id="consoleActionChips" class="console-chips-container"></div>

        <!-- Dynamic Product Display Area (Single Product Card / Multi-Products) -->
        <div id="consoleProductDisplayArea" class="console-product-display-area hidden"></div>

        <!-- Authentication / Action Confirmation Banner -->
        <div id="consoleActionBar" class="console-action-bar hidden"></div>

        <!-- Conversation Transcript & History Box -->
        <div id="consoleTranscriptArea" class="console-transcript-box" aria-live="polite"></div>

        <!-- Integrated Text Input Fallback with Send Button -->
        <div class="console-text-fallback-bar">
          <input
            type="text"
            id="consoleTextInput"
            class="console-text-input"
            placeholder="Type a question or message here..."
            aria-label="Type message to AI assistant"
          />
          <button id="btnConsoleSend" class="console-send-btn" aria-label="Send text message" title="Send message">
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="22" y1="2" x2="11" y2="13"></line>
              <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
            </svg>
          </button>
        </div>

        <!-- Controls Footer (Mute & End) -->
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

    // Hook listeners
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

    // Text Input Fallback Listeners
    const textInput = el.querySelector('#consoleTextInput') as HTMLInputElement;
    const sendBtn = el.querySelector('#btnConsoleSend') as HTMLButtonElement;

    const handleSend = () => {
      const text = textInput.value.trim();
      if (text) {
        textInput.value = '';
        this.callbacks.onUserTextInput?.(text);
      }
    };

    sendBtn.addEventListener('click', handleSend);
    textInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        handleSend();
      }
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
      entry.className = `transcript-bubble ${speaker.toLowerCase()}`;
      entry.innerHTML = `
        <span class="bubble-sender">${speaker}:</span>
        <span class="bubble-text">${text}</span>
      `;
      transcript.appendChild(entry);
      transcript.scrollTop = transcript.scrollHeight;
    }
  }

  public clearTranscript(): void {
    const transcript = this.container.querySelector('#consoleTranscriptArea');
    if (transcript) {
      transcript.innerHTML = '';
    }
    this.clearActionChips();
    this.clearProductDisplay();
  }

  /**
   * Section 2 & 3: Dynamic Single Product Response Card inside Voice Console
   */
  public displayProductCard(product: UnifiedProduct): void {
    const area = this.container.querySelector('#consoleProductDisplayArea') as HTMLElement | null;
    if (!area) return;

    area.classList.remove('hidden');

    const sizesHtml =
      product.availableSizes && product.availableSizes.length > 0
        ? `
        <div class="ai-sp-detail-item">
          <span class="detail-label">Sizes / Packs</span>
          <span class="detail-value">${product.availableSizes.slice(0, 3).join(', ')}${product.availableSizes.length > 3 ? ` (+${product.availableSizes.length - 3})` : ''}</span>
        </div>
      `
        : '';

    const colorsHtml =
      product.availableColors && product.availableColors.length > 0
        ? `
        <div class="ai-sp-detail-item">
          <span class="detail-label">Color / Form</span>
          <span class="detail-value">${product.availableColors[0]}</span>
        </div>
      `
        : '';

    const featuresHtml =
      product.features && product.features.length > 0
        ? `
        <div class="ai-sp-features">
          <ul>
            ${product.features
              .slice(0, 3)
              .map(
                (f) => `
              <li>
                <span class="feature-bullet">✓</span>
                <span>${f}</span>
              </li>
            `
              )
              .join('')}
          </ul>
        </div>
      `
        : '';

    const originalPriceHtml = product.originalPrice
      ? `<span class="ai-sp-original-price">${product.originalPrice}</span>`
      : '';

    const displayImage = product.image || product.fallbackImage;

    area.innerHTML = `
      <div class="ai-single-product-card" data-slug="${product.slug}">
        <div class="ai-sp-image-wrap">
          <img
            src="${displayImage}"
            alt="${product.name}"
            class="ai-sp-image"
            loading="lazy"
            onerror="this.onerror=null; this.src='${product.fallbackImage}';"
          />
          <span class="ai-sp-badge">${product.brand}</span>
        </div>

        <div class="ai-sp-content">
          <div class="ai-sp-header">
            <h3 class="ai-sp-title">${product.name}</h3>
            <div class="ai-sp-price-row">
              <span class="ai-sp-price">${product.price}</span>
              ${originalPriceHtml}
              <span class="ai-sp-stock-tag">${product.inStock ? '● In Stock' : 'Out of Stock'}</span>
            </div>
            <div class="ai-sp-rating-row">
              <span class="ai-sp-stars">★ ${product.rating.toFixed(1)}</span>
              <span class="ai-sp-reviews">(${product.reviewCount} reviews)</span>
            </div>
          </div>

          <p class="ai-sp-desc">${product.shortDescription}</p>

          <div class="ai-sp-details-grid">
            <div class="ai-sp-detail-item">
              <span class="detail-label">Brand</span>
              <span class="detail-value">${product.brand}</span>
            </div>
            <div class="ai-sp-detail-item">
              <span class="detail-label">Category</span>
              <span class="detail-value">${product.category}</span>
            </div>
            ${sizesHtml}
            ${colorsHtml}
          </div>

          ${featuresHtml}

          <div class="ai-sp-actions">
            <button type="button" class="btn-ai-sp-primary btn-view-product" data-slug="${product.slug}">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
              <span>View Product</span>
            </button>

            <button type="button" class="btn-ai-sp-secondary btn-buy-product" data-slug="${product.slug}" data-id="${product.id}">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
              <span>Buy / Select Product</span>
            </button>

            <button type="button" class="btn-ai-sp-ghost btn-ask-product" data-name="${product.name}">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
              <span>Ask About This Product</span>
            </button>
          </div>
        </div>
      </div>
    `;

    // Hook listeners
    const viewBtn = area.querySelector('.btn-view-product');
    const buyBtn = area.querySelector('.btn-buy-product');
    const askBtn = area.querySelector('.btn-ask-product');

    const handleNavigate = () => {
      AppRouter.getInstance().navigate('product/' + product.slug);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    viewBtn?.addEventListener('click', (e) => {
      e.stopPropagation();
      handleNavigate();
    });

    buyBtn?.addEventListener('click', (e) => {
      e.stopPropagation();
      handleNavigate();
      setTimeout(() => {
        const variantsSection = document.querySelector('.pdp-variants-section');
        if (variantsSection) {
          variantsSection.scrollIntoView({ behavior: 'smooth' });
        }
      }, 250);
    });

    askBtn?.addEventListener('click', (e) => {
      e.stopPropagation();
      const textInput = this.container.querySelector('#consoleTextInput') as HTMLInputElement | null;
      if (textInput) {
        textInput.value = `Tell me more about ${product.name}`;
        textInput.focus();
      }
      this.callbacks.onUserTextInput?.(`Tell me more about ${product.name}`);
    });

    // Clicking the card image or title also navigates to PDP
    const imgWrap = area.querySelector('.ai-sp-image-wrap');
    imgWrap?.addEventListener('click', handleNavigate);
    const titleEl = area.querySelector('.ai-sp-title');
    titleEl?.addEventListener('click', handleNavigate);
  }

  /**
   * Section 6: Multi-Product Response Grid inside Voice Console
   */
  public displayProductList(products: UnifiedProduct[]): void {
    const area = this.container.querySelector('#consoleProductDisplayArea') as HTMLElement | null;
    if (!area) return;

    area.classList.remove('hidden');

    area.innerHTML = `
      <div class="ai-multi-products-wrap">
        <div class="ai-mp-header">
          <span class="ai-mp-title">Available Products (${products.length})</span>
        </div>
        <div class="ai-mp-grid">
          ${products
            .slice(0, 4)
            .map(
              (p) => `
            <div class="ai-mp-card" data-slug="${p.slug}">
              <div class="ai-mp-img-wrap">
                <img
                  src="${p.image || p.fallbackImage}"
                  alt="${p.name}"
                  loading="lazy"
                  onerror="this.onerror=null; this.src='${p.fallbackImage}';"
                />
              </div>
              <div class="ai-mp-body">
                <span class="ai-mp-brand">${p.brand}</span>
                <h4 class="ai-mp-name" title="${p.name}">${p.name}</h4>
                <div class="ai-mp-price">${p.price}</div>
                <button type="button" class="btn-ai-mp-view" data-slug="${p.slug}">View Product</button>
              </div>
            </div>
          `
            )
            .join('')}
        </div>
      </div>
    `;

    area.querySelectorAll('.btn-ai-mp-view, .ai-mp-card').forEach((el) => {
      el.addEventListener('click', (e) => {
        const slug =
          (e.currentTarget as HTMLElement).getAttribute('data-slug') ||
          el.closest('[data-slug]')?.getAttribute('data-slug');
        if (slug) {
          AppRouter.getInstance().navigate('product/' + slug);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      });
    });
  }

  public clearProductDisplay(): void {
    const area = this.container.querySelector('#consoleProductDisplayArea') as HTMLElement | null;
    if (area) {
      area.classList.add('hidden');
      area.innerHTML = '';
    }
  }

  /**
   * Renders interactive quick action chips inside the console
   */
  public setActionChips(chips: { label: string; actionType: string; payload?: any }[]): void {
    const container = this.container.querySelector('#consoleActionChips');
    if (!container) return;

    container.innerHTML = '';
    chips.forEach((c) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'console-chip-action-btn';
      btn.textContent = c.label;
      btn.addEventListener('click', () => {
        this.callbacks.onActionChipClick?.(c.actionType, c.payload);
      });
      container.appendChild(btn);
    });
  }

  public clearActionChips(): void {
    const container = this.container.querySelector('#consoleActionChips');
    if (container) {
      container.innerHTML = '';
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
      AuthService.login('customer@example.com');
      bar.classList.add('hidden');
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
        label = 'Hearing you...';
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
        label = 'Cart Action';
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
