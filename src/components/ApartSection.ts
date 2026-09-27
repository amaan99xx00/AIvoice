export class ApartSectionComponent {
  public static render(): string {
    return `
      <section class="apart-section" id="about">
        <div class="moda-container">
          <div class="apart-grid">
            <div class="apart-content">
              <p class="section-pretitle">EUROPEAN PHARMACY EXCELLENCE</p>
              <h2 class="section-title">What Sets Us Apart in Wakefulness Care</h2>
              <p class="section-lead-text">
                Moda In Europe was founded to provide transparent, laboratory-certified access to wakefulness medications across the EU and UK. We streamline ordering without unnecessary complications.
              </p>

              <ul class="apart-checklist">
                <li class="apart-checklist-item">
                  <span class="check-icon">✓</span>
                  <span><strong>Product-focused selection:</strong> Only authentic Sun Pharma, HAB Pharma, and Centurion formulations.</span>
                </li>
                <li class="apart-checklist-item">
                  <span class="check-icon">✓</span>
                  <span><strong>Helpful customer service:</strong> Multilingual support via email and intelligent real-time voice assistance.</span>
                </li>
                <li class="apart-checklist-item">
                  <span class="check-icon">✓</span>
                  <span><strong>Delivery tracking available:</strong> Complete step-by-step courier dispatch with guaranteed customs clearance.</span>
                </li>
              </ul>

              <a href="#products" class="btn-moda-primary">
                <span>Explore Verified Range</span>
              </a>
            </div>

            <div class="apart-image-wrapper">
              <img
                src="https://modaineurope.com/wp-content/uploads/2026/09/Quality-products-1.webp"
                alt="European Certified Standards"
                style="border-radius: 16px; box-shadow: 0 16px 32px rgba(0, 52, 154, 0.1);"
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </section>
    `;
  }
}
