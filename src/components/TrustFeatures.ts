export class TrustFeaturesComponent {
  public static render(): string {
    return `
      <section class="trust-badges-section">
        <div class="moda-container">
          <!-- 3-Column Astra Image Badges -->
          <div class="trust-badges-grid">
            <div class="trust-badge-card">
              <img
                src="https://modaineurope.com/wp-content/uploads/2026/09/Discreet-Packaging-1.webp"
                alt="100% Discreet Packaging"
                loading="lazy"
              />
            </div>
            <div class="trust-badge-card">
              <img
                src="https://modaineurope.com/wp-content/uploads/2026/09/Quality-products-1.webp"
                alt="Quality Certified Wakefulness Products"
                loading="lazy"
              />
            </div>
            <div class="trust-badge-card">
              <img
                src="https://modaineurope.com/wp-content/uploads/2026/09/Authenticity-Guaranteed-1.webp"
                alt="Authenticity Guaranteed"
                loading="lazy"
              />
            </div>
          </div>

          <!-- Secondary 4-Metric Bar -->
          <div class="trust-metrics-bar">
            <div class="trust-metric-item">
              <div class="trust-metric-icon">🚀</div>
              <div>
                <h4 class="trust-metric-title">EU Express Dispatch</h4>
                <p class="trust-metric-desc">Tracked courier in 3-7 business days</p>
              </div>
            </div>

            <div class="trust-metric-item">
              <div class="trust-metric-icon">📦</div>
              <div>
                <h4 class="trust-metric-title">100% Discreet Packaging</h4>
                <p class="trust-metric-desc">Plain unbranded protective parcel</p>
              </div>
            </div>

            <div class="trust-metric-item">
              <div class="trust-metric-icon">🛡️</div>
              <div>
                <h4 class="trust-metric-title">Customs Guarantee</h4>
                <p class="trust-metric-desc">Free reshipment or refund guaranteed</p>
              </div>
            </div>

            <div class="trust-metric-item">
              <div class="trust-metric-icon">💬</div>
              <div>
                <h4 class="trust-metric-title">24/7 Concierge Support</h4>
                <p class="trust-metric-desc">Real-time voice & email assistance</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    `;
  }
}
