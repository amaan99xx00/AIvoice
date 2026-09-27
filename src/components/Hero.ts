export class HeroComponent {
  public static render(): string {
    return `
      <section class="hero-section" id="hero">
        <div class="moda-container">
          <div class="hero-grid">
            <div class="hero-content">
              <p class="hero-subtitle">Built for busy lives</p>
              <h1 class="hero-title">
                Trusted Wakefulness <br>
                <span class="hero-title-highlight">Anytime you need</span>
              </h1>
              <p class="hero-description">
                Experience clinical alertness and sustained daytime focus. We provide verified Modafinil, Armodafinil, Modalert, and Waklert with fast, 100% discreet delivery throughout Europe.
              </p>
              <div class="hero-actions">
                <a href="#products" class="btn-moda-primary">
                  <span>Shop Products</span>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                    <polyline points="12 5 19 12 12 19"></polyline>
                  </svg>
                </a>
                <a href="#about" class="btn-moda-outline">
                  <span>What Sets Us Apart</span>
                </a>
              </div>
            </div>

            <div class="hero-image-wrapper">
              <img
                src="https://modaineurope.com/wp-content/uploads/2026/09/Moda_Eup_Banner_MV.webp"
                alt="Moda In Europe Wakefulness Banner"
                class="hero-image"
                loading="eager"
              />
            </div>
          </div>
        </div>
      </section>
    `;
  }
}
