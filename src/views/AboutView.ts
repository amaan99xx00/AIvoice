/**
 * AboutView for Moda In Europe (#/about)
 * Presents authentic European logistics, domestic warehouse dispatch,
 * pharmaceutical laboratory partnerships, delivery guarantees, and company history.
 */

import { SITE_INFO } from '../data/siteInfo';

export class AboutView {
  public static render(): string {
    return `
      <div class="view-about">
        <!-- Breadcrumbs -->
        <div class="shop-breadcrumb-bar">
          <div class="moda-container">
            <nav class="breadcrumb-nav" aria-label="Breadcrumb">
              <a href="#/" class="breadcrumb-link">Home</a>
              <span class="breadcrumb-separator">/</span>
              <span class="breadcrumb-current">About Us</span>
            </nav>
          </div>
        </div>

        <!-- About Hero -->
        <section class="about-hero-section">
          <div class="moda-container">
            <span class="shop-eyebrow">Domestic European Healthcare Supply</span>
            <h1 class="shop-main-title">About Moda In Europe</h1>
            <p class="shop-lead-text">
              ${SITE_INFO.mission}
            </p>
          </div>
        </section>

        <!-- Company Pillars & Story -->
        <section class="about-pillars-section">
          <div class="moda-container">
            <div class="about-grid-3col">
              <div class="about-card">
                <div class="about-icon-circle">🇪🇺</div>
                <h3>Domestic European Fulfillment</h3>
                <p>
                  ${SITE_INFO.logisticsHubs} Orders never face third-country customs complications or international transit delays.
                </p>
              </div>

              <div class="about-card">
                <div class="about-icon-circle">🔬</div>
                <h3>GMP Certified Formulations</h3>
                <p>
                  Every batch of Modafinil (Modalert, Modvigil, Vilafinil) and Armodafinil (Waklert, Artvigil) is sourced directly from WHO-GMP certified facilities with verified certificates of analysis.
                </p>
              </div>

              <div class="about-card">
                <div class="about-icon-circle">🔒</div>
                <h3>100% Discreet & Protected</h3>
                <p>
                  Shipments arrive in plain, tamper-evident brown padded mailers with no pharmaceutical identifiers, logos, or content descriptions on the exterior.
                </p>
              </div>
            </div>

            <!-- Guarantee Highlights -->
            <div class="about-guarantee-box">
              <div class="about-guarantee-header">
                <h2>Our European Service Guarantees</h2>
                <p>Built on reliability, medical compliance, and customer satisfaction since ${SITE_INFO.establishedYear}.</p>
              </div>

              <div class="about-guarantee-grid">
                <div class="guarantee-row">
                  <div class="g-num">01</div>
                  <div class="g-content">
                    <h4>Customs Delivery Guarantee</h4>
                    <p>${SITE_INFO.guarantees.customs}</p>
                  </div>
                </div>

                <div class="guarantee-row">
                  <div class="g-num">02</div>
                  <div class="g-content">
                    <h4>Authenticity & Laboratory Purity</h4>
                    <p>${SITE_INFO.guarantees.authenticity}</p>
                  </div>
                </div>

                <div class="guarantee-row">
                  <div class="g-num">03</div>
                  <div class="g-content">
                    <h4>Discreet Packaging</h4>
                    <p>${SITE_INFO.guarantees.packaging}</p>
                  </div>
                </div>

                <div class="guarantee-row">
                  <div class="g-num">04</div>
                  <div class="g-content">
                    <h4>Speed & Online Tracking</h4>
                    <p>${SITE_INFO.guarantees.shippingTime}</p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Contact & Operations Info -->
            <div class="about-contact-strip">
              <div class="contact-info-block">
                <h4>Direct Customer Assistance</h4>
                <p>Email: <a href="mailto:${SITE_INFO.email}">${SITE_INFO.email}</a></p>
                <p>Phone: <a href="tel:+17342746420">${SITE_INFO.phone}</a></p>
                <p>Specialist Desk: ${SITE_INFO.specialistSupportHours}</p>
              </div>
              <div class="contact-action-block">
                <a href="#/shop" class="btn-moda-primary">Browse Pharmacy Catalog</a>
                <button class="btn-moda-outline" data-open-expert="bulk">Inquire for Bulk Orders</button>
              </div>
            </div>
          </div>
        </section>
      </div>
    `;
  }

  public static initListeners(): void {}
}
