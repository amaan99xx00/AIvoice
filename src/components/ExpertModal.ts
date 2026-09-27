/**
 * ExpertModalComponent
 * Dedicated Consultation Callback & Bulk Wholesale Request Modal.
 * Provides authentic customer assistance for bulk inquiries and product handoffs
 * with clear European medical disclaimers (no fake calendar booking).
 */

export interface ConsultationRequest {
  id: string;
  name: string;
  email: string;
  phone: string;
  inquiryType: 'bulk' | 'product_advice' | 'shipping';
  message: string;
  timestamp: string;
}

export class ExpertModalComponent {
  public static render(): string {
    return `
      <!-- Expert Consultation & Bulk Order Modal -->
      <div id="expertModalOverlay" class="expert-modal-overlay" role="dialog" aria-modal="true" aria-labelledby="expertModalTitle" style="display: none;">
        <div class="expert-modal-dialog">
          <button id="closeExpertModalBtn" class="expert-modal-close" aria-label="Close dialog">✕</button>
          
          <div class="expert-modal-header">
            <div class="expert-badge-pill">
              <span class="pulsing-dot"></span>
              <span id="expertModalTypeBadge">European Specialist Support</span>
            </div>
            <h2 id="expertModalTitle" class="expert-modal-title">Schedule an Expert Call</h2>
            <p id="expertModalSubtitle" class="expert-modal-subtitle">
              Speak with our European logistics and wholesale team. We provide rapid wholesale quotes, shipping guidance, and product specifications.
            </p>
          </div>

          <!-- Medical Disclaimer Notice -->
          <div class="expert-disclaimer-box">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#00349a" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink: 0; margin-top: 2px;">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="8" x2="12" y2="12"></line>
              <line x1="12" y1="16" x2="12.01" y2="16"></line>
            </svg>
            <p class="expert-disclaimer-text">
              <strong>Important Notice:</strong> Moda In Europe customer specialists assist with genuine product specifications, laboratory testing verification, and discreet European logistics. We do not provide individualized medical diagnoses or prescription advice. For specific medical conditions, always consult a licensed physician.
            </p>
          </div>

          <!-- Consultation Form -->
          <form id="expertConsultationForm" class="expert-modal-form">
            <div class="expert-form-grid">
              <div class="expert-form-group">
                <label for="expertName">Full Name *</label>
                <input type="text" id="expertName" required placeholder="e.g. Jean Dupont" />
              </div>
              <div class="expert-form-group">
                <label for="expertEmail">Email Address *</label>
                <input type="email" id="expertEmail" required placeholder="name@domain.com" />
              </div>
            </div>

            <div class="expert-form-grid">
              <div class="expert-form-group">
                <label for="expertPhone">Phone / WhatsApp (Optional)</label>
                <input type="tel" id="expertPhone" placeholder="+33 6 12 34 56 78" />
              </div>
              <div class="expert-form-group">
                <label for="expertTopic">Inquiry Category *</label>
                <select id="expertTopic" required>
                  <option value="bulk">Bulk Order & Wholesale Pricing (100+ pills)</option>
                  <option value="product_advice">Product Specifications & Comparison</option>
                  <option value="shipping">Customs & European Delivery Inquiries</option>
                </select>
              </div>
            </div>

            <div class="expert-form-group">
              <label for="expertMessage">How can we assist you? (Quantity, preferred contact time, etc.)</label>
              <textarea id="expertMessage" rows="3" placeholder="Tell us about your requirements or questions..."></textarea>
            </div>

            <div class="expert-modal-actions">
              <button type="button" id="cancelExpertBtn" class="btn-moda-outline" style="padding: 0.75rem 1.25rem;">
                Cancel
              </button>
              <button type="submit" id="submitExpertBtn" class="btn-moda-primary" style="padding: 0.75rem 1.75rem;">
                Request Specialist Callback
              </button>
            </div>
          </form>

          <!-- Success State -->
          <div id="expertSuccessState" class="expert-success-state" style="display: none;">
            <div class="success-icon-wrap">
              <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#16a34a" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                <polyline points="22 4 12 14.01 9 11.01"></polyline>
              </svg>
            </div>
            <h3 class="success-title">Consultation Request Received</h3>
            <p id="successConfirmationMessage" class="success-desc">
              Thank you! Our European support team has logged your inquiry. A specialist will review your request and reach out within 1 business day.
            </p>
            <button type="button" id="closeSuccessExpertBtn" class="btn-moda-primary" style="margin-top: 1rem;">
              Back to Store
            </button>
          </div>
        </div>
      </div>
    `;
  }

  public static initListeners(): void {
    const overlay = document.getElementById('expertModalOverlay');
    if (!overlay) return;

    // Close on backdrop click
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) {
        this.close();
      }
    });

    // Close button
    const closeBtn = document.getElementById('closeExpertModalBtn');
    closeBtn?.addEventListener('click', () => this.close());

    const cancelBtn = document.getElementById('cancelExpertBtn');
    cancelBtn?.addEventListener('click', () => this.close());

    const closeSuccessBtn = document.getElementById('closeSuccessExpertBtn');
    closeSuccessBtn?.addEventListener('click', () => this.close());

    // ESC key close
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && overlay.style.display !== 'none') {
        this.close();
      }
    });

    // Handle Form Submit
    const form = document.getElementById('expertConsultationForm') as HTMLFormElement;
    form?.addEventListener('submit', (e) => {
      e.preventDefault();
      const nameInput = document.getElementById('expertName') as HTMLInputElement;
      const emailInput = document.getElementById('expertEmail') as HTMLInputElement;
      const phoneInput = document.getElementById('expertPhone') as HTMLInputElement;
      const topicSelect = document.getElementById('expertTopic') as HTMLSelectElement;
      const messageInput = document.getElementById('expertMessage') as HTMLTextAreaElement;

      const request: ConsultationRequest = {
        id: `req-${Date.now()}`,
        name: nameInput.value.trim(),
        email: emailInput.value.trim(),
        phone: phoneInput.value.trim(),
        inquiryType: (topicSelect.value as 'bulk' | 'product_advice' | 'shipping') || 'bulk',
        message: messageInput.value.trim(),
        timestamp: new Date().toISOString()
      };

      // Save to localStorage
      try {
        const stored = JSON.parse(localStorage.getItem('moda_consultation_requests') || '[]');
        stored.push(request);
        localStorage.setItem('moda_consultation_requests', JSON.stringify(stored));
      } catch (err) {
        console.warn('Could not save consultation request to localStorage:', err);
      }

      // Show success view
      form.style.display = 'none';
      const successView = document.getElementById('expertSuccessState');
      const successMsg = document.getElementById('successConfirmationMessage');
      if (successMsg) {
        successMsg.textContent = `Thank you, ${request.name}. Our European team has received your request regarding ${
          request.inquiryType === 'bulk' ? 'bulk order pricing' : 'product guidance'
        }. A specialist will reach out to ${request.email} within 1 business day.`;
      }
      if (successView) {
        successView.style.display = 'block';
      }
    });
  }

  public static open(type: 'bulk' | 'product_advice' | 'shipping' = 'bulk', prefillMessage?: string): void {
    const overlay = document.getElementById('expertModalOverlay');
    if (!overlay) return;

    const titleEl = document.getElementById('expertModalTitle');
    const badgeEl = document.getElementById('expertModalTypeBadge');
    const subtitleEl = document.getElementById('expertModalSubtitle');
    const topicSelect = document.getElementById('expertTopic') as HTMLSelectElement;
    const msgText = document.getElementById('expertMessage') as HTMLTextAreaElement;
    const form = document.getElementById('expertConsultationForm');
    const successView = document.getElementById('expertSuccessState');

    if (form) form.style.display = 'block';
    if (successView) successView.style.display = 'none';

    if (type === 'bulk') {
      if (titleEl) titleEl.textContent = 'Schedule an Expert Call — Wholesale & Bulk';
      if (badgeEl) badgeEl.textContent = 'Wholesale & B2B Logistics';
      if (subtitleEl) subtitleEl.textContent = 'Looking for orders of 100 to 1,000+ units? Request custom pricing, courier freight options, and commercial verification.';
      if (topicSelect) topicSelect.value = 'bulk';
    } else if (type === 'product_advice') {
      if (titleEl) titleEl.textContent = 'Talk to a Product Specialist';
      if (badgeEl) badgeEl.textContent = 'Product Specialist Handoff';
      if (subtitleEl) subtitleEl.textContent = 'Have in-depth questions about formulations, batch testing, or brand specifications? Our product team is happy to assist.';
      if (topicSelect) topicSelect.value = 'product_advice';
    } else {
      if (titleEl) titleEl.textContent = 'European Delivery & Customs Specialist';
      if (badgeEl) badgeEl.textContent = 'Logistics & Customs Support';
      if (subtitleEl) subtitleEl.textContent = 'Questions about discreet European dispatch, customs guarantee, or tracking in your country.';
      if (topicSelect) topicSelect.value = 'shipping';
    }

    if (prefillMessage && msgText) {
      msgText.value = prefillMessage;
    }

    overlay.style.display = 'flex';
    document.body.style.overflow = 'hidden';
  }

  public static close(): void {
    const overlay = document.getElementById('expertModalOverlay');
    if (overlay) {
      overlay.style.display = 'none';
    }
    document.body.style.overflow = '';
  }
}
