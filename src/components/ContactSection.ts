export class ContactSectionComponent {
  public static render(): string {
    return `
      <section class="contact-section" id="contact">
        <div class="moda-container">
          <div class="contact-grid">
            <!-- Contact Details -->
            <div class="contact-info-card">
              <div>
                <p class="section-pretitle">NEED ASSISTANCE?</p>
                <h2 class="section-title">We’re here when you need us</h2>
                <p class="section-lead-text">
                  Have questions about your order, tracking, dosage guidelines, or customs clearance across the EU? Our friendly pharmacy support team is ready to help.
                </p>
              </div>

              <div class="contact-info-item">
                <div class="contact-icon-box">📞</div>
                <div>
                  <h4 class="contact-info-title">Telephone Customer Support</h4>
                  <p class="contact-info-desc">+1 (734) 274 6420 (Mon - Sat, 8:00 AM - 8:00 PM CET)</p>
                </div>
              </div>

              <div class="contact-info-item">
                <div class="contact-icon-box">✉️</div>
                <div>
                  <h4 class="contact-info-title">Official Email Support</h4>
                  <p class="contact-info-desc">Info@modaineurope.com (Average reply within 2 hours)</p>
                </div>
              </div>

              <div class="contact-info-item">
                <div class="contact-icon-box">📍</div>
                <div>
                  <h4 class="contact-info-title">Registered Office & EU Logistics</h4>
                  <p class="contact-info-desc">Landline St. North Southern Berwick, United States & EU Dispatch Hub (Frankfurt & London)</p>
                </div>
              </div>

              <div class="contact-info-item">
                <div class="contact-icon-box">🤖</div>
                <div>
                  <h4 class="contact-info-title">AI Voice Concierge</h4>
                  <p class="contact-info-desc">Click the blue floating microphone icon at the bottom-right to speak with our smart shopping assistant.</p>
                </div>
              </div>
            </div>

            <!-- Interactive Working Form -->
            <div class="contact-form-box">
              <h3 style="font-size: 1.35rem; font-weight: 700; color: var(--moda-primary-dark); margin-bottom: 1.25rem;">
                Send Us a Direct Message
              </h3>

              <form id="contactForm">
                <div class="contact-form-row">
                  <div class="form-group">
                    <label for="firstName" style="font-size: 0.82rem; font-weight: 600; color: var(--moda-text-muted);">First Name *</label>
                    <input type="text" id="firstName" class="form-input" placeholder="e.g. Thomas" required />
                  </div>
                  <div class="form-group">
                    <label for="lastName" style="font-size: 0.82rem; font-weight: 600; color: var(--moda-text-muted);">Last Name *</label>
                    <input type="text" id="lastName" class="form-input" placeholder="e.g. Müller" required />
                  </div>
                </div>

                <div class="contact-form-row">
                  <div class="form-group">
                    <label for="emailAddr" style="font-size: 0.82rem; font-weight: 600; color: var(--moda-text-muted);">Email Address *</label>
                    <input type="email" id="emailAddr" class="form-input" placeholder="name@example.eu" required />
                  </div>
                  <div class="form-group">
                    <label for="phoneNumber" style="font-size: 0.82rem; font-weight: 600; color: var(--moda-text-muted);">Phone Number</label>
                    <input type="tel" id="phoneNumber" class="form-input" placeholder="+49 170 1234567" />
                  </div>
                </div>

                <div class="form-group">
                  <label for="messageText" style="font-size: 0.82rem; font-weight: 600; color: var(--moda-text-muted);">Write Your Message *</label>
                  <textarea id="messageText" class="form-textarea" placeholder="How can our European team assist you with wakefulness medications or tracking?" required></textarea>
                </div>

                <button type="submit" class="btn-submit-contact" id="btnSubmitContact">
                  <span>Send Us Messages</span>
                  <span>❯</span>
                </button>

                <div class="contact-success-msg" id="contactSuccessMsg">
                  ✓ Thank you! Your message has been received. Our European support team will contact you shortly at the provided email.
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>
    `;
  }

  public static initListeners(): void {
    const form = document.getElementById('contactForm') as HTMLFormElement | null;
    const successMsg = document.getElementById('contactSuccessMsg');
    const submitBtn = document.getElementById('btnSubmitContact');

    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        if (submitBtn) {
          submitBtn.setAttribute('disabled', 'true');
          submitBtn.style.opacity = '0.7';
          submitBtn.innerHTML = '<span>Sending Message...</span>';
        }

        setTimeout(() => {
          if (submitBtn) {
            submitBtn.removeAttribute('disabled');
            submitBtn.style.opacity = '1';
            submitBtn.innerHTML = '<span>Send Us Messages</span><span>❯</span>';
          }
          if (successMsg) {
            successMsg.style.display = 'block';
          }
          form.reset();
        }, 800);
      });
    }
  }
}
