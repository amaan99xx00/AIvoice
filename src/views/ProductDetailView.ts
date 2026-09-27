/**
 * ProductDetailView for Moda In Europe (https://modaineurope.com/product/modalert-100mg/)
 * Dynamic single-product detail page rendering authentic clinical specifications,
 * variant tier pricing, interactive image gallery, clinical accordions,
 * and dynamic related medications.
 */

import { ProductKnowledgeService, ProductItem, ProductVariantOption } from '../data/products';
import { WooCommerceService } from '../services/wooCommerceService';
import { CartDrawerComponent } from '../components/CartDrawer';
import { UnifiedProductService, UnifiedProduct } from '../services/UnifiedProductService';

export class ProductDetailView {
  private static selectedVariant: ProductVariantOption | null = null;
  private static selectedQuantity: number = 1;
  private static activeProduct: ProductItem | null = null;
  private static activeUnifiedProduct: UnifiedProduct | null = null;

  public static render(slug: string): string {
    const medProduct = ProductKnowledgeService.getBySlug(slug);
    if (medProduct) {
      return this.renderMedicationProduct(medProduct);
    }

    const unifiedProduct = UnifiedProductService.getBySlug(slug);
    if (unifiedProduct) {
      if (unifiedProduct.isMedication && unifiedProduct.medicationData) {
        return this.renderMedicationProduct(unifiedProduct.medicationData);
      }
      return this.renderGeneralProduct(unifiedProduct);
    }

    return `
      <div class="view-product-not-found">
        <div class="moda-container" style="padding: 4rem 1rem; text-align: center;">
          <div style="font-size: 3rem; margin-bottom: 1rem;">🔍</div>
          <h1 style="font-size: 2rem; color: #00349a; margin-bottom: 1rem;">Product Not Found</h1>
          <p style="color: #64748b; max-width: 500px; margin: 0 auto 2rem;">
            The requested product ("${slug}") could not be located in our catalog.
          </p>
          <a href="#/shop" class="btn-moda-primary" style="display: inline-block;">Return to Shop Catalog</a>
        </div>
      </div>
    `;
  }

  private static renderMedicationProduct(product: ProductItem): string {
    this.activeProduct = product;
    this.activeUnifiedProduct = null;
    this.selectedVariant = product.variants[0];
    this.selectedQuantity = 1;

    const stars = '★'.repeat(Math.round(product.rating)) + '☆'.repeat(5 - Math.round(product.rating));
    const relatedProducts = ProductKnowledgeService.getRelated(product.slug);

    return `
      <div class="view-product-detail" data-product-slug="${product.slug}">
        <!-- Breadcrumb Navigation -->
        <div class="product-breadcrumb-bar">
          <div class="moda-container">
            <nav class="breadcrumb-nav" aria-label="Breadcrumb">
              <a href="#/" class="breadcrumb-link">Home</a>
              <span class="breadcrumb-separator">/</span>
              <a href="#/shop" class="breadcrumb-link">Shop</a>
              <span class="breadcrumb-separator">/</span>
              <span class="breadcrumb-link">${product.category}</span>
              <span class="breadcrumb-separator">/</span>
              <span class="breadcrumb-current">${product.name}</span>
            </nav>
          </div>
        </div>

        <!-- Main Product Summary Section (2-Column) -->
        <section class="product-summary-section">
          <div class="moda-container">
            <div class="product-summary-grid">
              <!-- Left: Image Gallery & Authenticity Guarantee -->
              <div class="product-gallery-column">
                <div class="product-main-image-wrap">
                  <img
                    id="pdpMainImage"
                    src="${product.images[0]}"
                    alt="${product.name} - European Wakefulness Medication"
                    class="pdp-main-img"
                  />
                  <span class="pdp-zoom-badge">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <circle cx="11" cy="11" r="8"></circle>
                      <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                      <line x1="11" y1="8" x2="11" y2="14"></line>
                      <line x1="8" y1="11" x2="14" y2="11"></line>
                    </svg>
                  </span>
                </div>

                <!-- Gallery Thumbnails -->
                <div class="product-thumbnails-row">
                  ${product.images
                    .map(
                      (img, idx) => `
                      <button
                        type="button"
                        class="pdp-thumb-btn ${idx === 0 ? 'active' : ''}"
                        data-img-src="${img}"
                        aria-label="View thumbnail ${idx + 1}"
                      >
                        <img src="${img}" alt="${product.name} view ${idx + 1}" />
                      </button>
                    `
                    )
                    .join('')}
                </div>

                <!-- Verified Security & European Quality Stamps -->
                <div class="pdp-trust-card">
                  <div class="pdp-trust-item">
                    <span class="pdp-trust-icon">🛡️</span>
                    <div>
                      <strong>100% Genuine Pharmaceutical</strong>
                      <span>Direct from ${product.keyFeatures.manufacturer}</span>
                    </div>
                  </div>
                  <div class="pdp-trust-item">
                    <span class="pdp-trust-icon">📦</span>
                    <div>
                      <strong>100% Plain Discreet Packaging</strong>
                      <span>Zero medical markings or external labels</span>
                    </div>
                  </div>
                  <div class="pdp-trust-item">
                    <span class="pdp-trust-icon">⚡</span>
                    <div>
                      <strong>Domestic EU Dispatch</strong>
                      <span>Guaranteed delivery with tracking</span>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Right: Pricing, Description, Variant Table & Add to Cart -->
              <div class="product-info-column">
                <div class="pdp-meta-header">
                  <span class="pdp-category-pill">${product.category}</span>
                  <span class="pdp-mfg-pill">By ${product.keyFeatures.manufacturer}</span>
                </div>

                <h1 class="pdp-title">${product.name}</h1>

                <div class="pdp-rating-row">
                  <div class="pdp-stars">${stars}</div>
                  <span class="pdp-rating-val">${product.rating.toFixed(1)} / 5.0</span>
                  <span class="pdp-review-count">(${product.reviewCount} customer reviews)</span>
                </div>

                <div class="pdp-price-wrap">
                  <span class="pdp-price-range">${product.priceRange}</span>
                  <span class="pdp-selected-price" id="pdpSelectedPrice">
                    €${product.variants[0].priceEur.toFixed(2)}
                  </span>
                  <span class="pdp-selected-unit" id="pdpSelectedPerPill">
                    (€${product.variants[0].pricePerPill.toFixed(2)} / pill)
                  </span>
                </div>

                <p class="pdp-short-desc">${product.shortDescription}</p>

                <!-- Variant Options Selection Table -->
                <div class="pdp-variants-section">
                  <div class="pdp-variants-header">
                    <label class="pdp-variants-label">Select Package Size (Pills):</label>
                    <span class="pdp-stock-indicator">● In Stock (EU Warehouse)</span>
                  </div>

                  <div class="pdp-variants-table">
                    ${product.variants
                      .map((v, idx) => {
                        const savings =
                          idx === 0
                            ? ''
                            : `<span class="pdp-savings-badge">Save ${(100 - (v.pricePerPill / product.variants[0].pricePerPill) * 100).toFixed(0)}%</span>`;
                        return `
                        <label class="pdp-variant-row ${idx === 0 ? 'selected' : ''}" data-variant-id="${v.id}">
                          <div class="pdp-variant-radio-wrap">
                            <input
                              type="radio"
                              name="pdpVariantRadio"
                              value="${v.id}"
                              ${idx === 0 ? 'checked' : ''}
                              data-tablets="${v.tablets}"
                              data-price="${v.priceEur}"
                              data-perpill="${v.pricePerPill}"
                            />
                            <span class="pdp-variant-tablets">${v.tablets} Pills</span>
                          </div>
                          <div class="pdp-variant-price-info">
                            ${savings}
                            <span class="pdp-variant-perpill">€${v.pricePerPill.toFixed(2)}/pill</span>
                            <span class="pdp-variant-total">€${v.priceEur.toFixed(2)}</span>
                          </div>
                        </label>
                      `;
                      })
                      .join('')}
                  </div>
                </div>

                <!-- Add to Cart & Quantity Bar -->
                <div class="pdp-actions-bar">
                  <div class="pdp-quantity-selector">
                    <button type="button" class="pdp-qty-btn" id="btnQtyMinus" aria-label="Decrease quantity">−</button>
                    <input type="number" id="pdpQtyInput" value="1" min="1" max="50" aria-label="Quantity" />
                    <button type="button" class="pdp-qty-btn" id="btnQtyPlus" aria-label="Increase quantity">+</button>
                  </div>

                  <button type="button" class="btn-pdp-add-cart" id="btnPdpAddToCart">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.3">
                      <circle cx="9" cy="21" r="1"></circle>
                      <circle cx="20" cy="21" r="1"></circle>
                      <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                    </svg>
                    <span>Add to Cart</span>
                  </button>

                  <button type="button" class="btn-pdp-expert" data-open-expert="bulk" title="Commercial Wholesale">
                    <span>Wholesale Bulk Quote</span>
                  </button>
                </div>

                <!-- Success Toast Container -->
                <div id="pdpCartToast" class="pdp-cart-toast" style="display: none;">
                  <span class="toast-icon">✓</span>
                  <span id="pdpToastMessage">Added to cart successfully!</span>
                </div>

                <!-- Product Specifications Meta Box -->
                <div class="pdp-specs-box">
                  <div class="pdp-spec-line">
                    <span class="spec-label">SKU:</span>
                    <span class="spec-value">${product.id.toUpperCase()}</span>
                  </div>
                  <div class="pdp-spec-line">
                    <span class="spec-label">Active Substance:</span>
                    <span class="spec-value">${product.composition.active}</span>
                  </div>
                  <div class="pdp-spec-line">
                    <span class="spec-label">Strength:</span>
                    <span class="spec-value">${product.keyFeatures.strength}</span>
                  </div>
                  <div class="pdp-spec-line">
                    <span class="spec-label">Packaging:</span>
                    <span class="spec-value">${product.keyFeatures.packaging} (${product.keyFeatures.packSize})</span>
                  </div>
                  <div class="pdp-spec-line">
                    <span class="spec-label">EU Dispatch:</span>
                    <span class="spec-value">3–7 Business Days with Tracking</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <!-- Detailed Clinical Information Accordions Section -->
        <section class="product-accordions-section">
          <div class="moda-container">
            <div class="pdp-section-heading">
              <span class="subheading">Clinical Specifications & Prescribing Guide</span>
              <h2>Detailed Information for ${product.name}</h2>
              <p>Verified laboratory monograph and safe usage parameters.</p>
            </div>

            <div class="pdp-accordions-wrapper">
              <!-- Accordion 1: Overview -->
              <div class="pdp-accordion-item open">
                <button class="pdp-accordion-header" aria-expanded="true">
                  <span>1. Overview & Description</span>
                  <span class="pdp-acc-icon">▾</span>
                </button>
                <div class="pdp-accordion-body">
                  <p>${product.overview}</p>
                  <p style="margin-top: 0.75rem;">${product.fullDescription}</p>
                </div>
              </div>

              <!-- Accordion 2: Mechanism of Action -->
              <div class="pdp-accordion-item">
                <button class="pdp-accordion-header" aria-expanded="false">
                  <span>2. How It Works (Mechanism of Action)</span>
                  <span class="pdp-acc-icon">▾</span>
                </button>
                <div class="pdp-accordion-body">
                  <p>${product.howItWorks}</p>
                  <div class="clinical-note" style="margin-top: 1rem; padding: 1rem; background: #eff6ff; border-left: 4px solid #00349a; border-radius: 4px;">
                    <strong>Neuropharmacological Note:</strong> Unlike classic central nervous system stimulants, eugeroics like ${product.name} selectively modulate hypothalamic sleep-wake centers without causing generalized peripheral cardiac acceleration or post-medication crash.
                  </div>
                </div>
              </div>

              <!-- Accordion 3: Key Features Specification Table -->
              <div class="pdp-accordion-item">
                <button class="pdp-accordion-header" aria-expanded="false">
                  <span>3. Key Features & Specifications Table</span>
                  <span class="pdp-acc-icon">▾</span>
                </button>
                <div class="pdp-accordion-body">
                  <div class="pdp-spec-table-wrap">
                    <table class="pdp-clinical-table">
                      <thead>
                        <tr>
                          <th>Attribute</th>
                          <th>Specification</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr><td>Drug Class</td><td>${product.keyFeatures.drugClass}</td></tr>
                        <tr><td>Chemical Class</td><td>${product.keyFeatures.chemicalClass}</td></tr>
                        <tr><td>Dosage Form</td><td>${product.keyFeatures.dosageForm}</td></tr>
                        <tr><td>Route of Administration</td><td>${product.keyFeatures.routeOfAdministration}</td></tr>
                        <tr><td>Strength</td><td>${product.keyFeatures.strength}</td></tr>
                        <tr><td>Packaging & Foil</td><td>${product.keyFeatures.packaging}</td></tr>
                        <tr><td>Pack Size</td><td>${product.keyFeatures.packSize}</td></tr>
                        <tr><td>Primary Indications</td><td>${product.keyFeatures.usedFor}</td></tr>
                        <tr><td>Onset of Action</td><td>${product.keyFeatures.onsetOfAction}</td></tr>
                        <tr><td>Duration of Action</td><td>${product.keyFeatures.durationOfAction}</td></tr>
                        <tr><td>Manufacturer</td><td>${product.keyFeatures.manufacturer}</td></tr>
                        <tr><td>Shelf Life</td><td>${product.keyFeatures.shelfLife}</td></tr>
                        <tr><td>Storage Conditions</td><td>${product.keyFeatures.storage}</td></tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              <!-- Accordion 4: Composition -->
              <div class="pdp-accordion-item">
                <button class="pdp-accordion-header" aria-expanded="false">
                  <span>4. Composition & Inactive Excipients</span>
                  <span class="pdp-acc-icon">▾</span>
                </button>
                <div class="pdp-accordion-body">
                  <div style="margin-bottom: 1rem;">
                    <strong>Active Pharmaceutical Ingredient (API):</strong>
                    <p style="color: #00349a; font-weight: 600; margin-top: 0.25rem;">${product.composition.active}</p>
                  </div>
                  <div>
                    <strong>Inactive Pharmaceutical Excipients:</strong>
                    <p style="color: #475569; margin-top: 0.25rem;">${product.composition.inactive}</p>
                  </div>
                </div>
              </div>

              <!-- Accordion 5: Indications & Clinical Uses -->
              <div class="pdp-accordion-item">
                <button class="pdp-accordion-header" aria-expanded="false">
                  <span>5. Clinical Indications & Uses</span>
                  <span class="pdp-acc-icon">▾</span>
                </button>
                <div class="pdp-accordion-body">
                  <p>In accordance with European and international medical consensus, ${product.name} is utilized for:</p>
                  <ul class="pdp-bullet-list" style="margin-top: 0.75rem;">
                    ${product.uses.map((u) => `<li>${u}</li>`).join('')}
                  </ul>
                </div>
              </div>

              <!-- Accordion 6: Dosage & Administration -->
              <div class="pdp-accordion-item">
                <button class="pdp-accordion-header" aria-expanded="false">
                  <span>6. Recommended Dosage & Administration</span>
                  <span class="pdp-acc-icon">▾</span>
                </button>
                <div class="pdp-accordion-body">
                  <ul class="pdp-bullet-list">
                    ${product.dosageInformation.map((d) => `<li>${d}</li>`).join('')}
                  </ul>
                  <div style="margin-top: 1rem; padding: 0.85rem; background: #fffbeb; border: 1px solid #fef3c7; border-radius: 6px; font-size: 0.9rem; color: #92400e;">
                    <strong>Administration Tip:</strong> Swallow tablet with a full glass of water. It may be taken with or without food, though a high-fat meal can delay absorption onset by 30 to 45 minutes.
                  </div>
                </div>
              </div>

              <!-- Accordion 7: Side Effects -->
              <div class="pdp-accordion-item">
                <button class="pdp-accordion-header" aria-expanded="false">
                  <span>7. Side Effects & Tolerance</span>
                  <span class="pdp-acc-icon">▾</span>
                </button>
                <div class="pdp-accordion-body">
                  <div style="margin-bottom: 1.25rem;">
                    <strong style="color: #1e293b;">Common & Transient Side Effects (Usually resolve within 48h):</strong>
                    <ul class="pdp-bullet-list" style="margin-top: 0.5rem;">
                      ${product.sideEffects.common.map((s) => `<li>${s}</li>`).join('')}
                    </ul>
                  </div>
                  <div>
                    <strong style="color: #b91c1c;">Rare / Severe Symptoms (Discontinue immediately and seek medical attention):</strong>
                    <ul class="pdp-bullet-list" style="margin-top: 0.5rem;">
                      ${product.sideEffects.serious.map((s) => `<li style="color: #b91c1c;">${s}</li>`).join('')}
                    </ul>
                  </div>
                </div>
              </div>

              <!-- Accordion 8: Drug Interactions -->
              <div class="pdp-accordion-item">
                <button class="pdp-accordion-header" aria-expanded="false">
                  <span>8. Drug Interactions & Contraindications</span>
                  <span class="pdp-acc-icon">▾</span>
                </button>
                <div class="pdp-accordion-body">
                  <ul class="pdp-bullet-list">
                    ${product.interactions.map((inter) => `<li>${inter}</li>`).join('')}
                  </ul>
                </div>
              </div>

              <!-- Accordion 9: Precautions -->
              <div class="pdp-accordion-item">
                <button class="pdp-accordion-header" aria-expanded="false">
                  <span>9. Medical Precautions & Warnings</span>
                  <span class="pdp-acc-icon">▾</span>
                </button>
                <div class="pdp-accordion-body">
                  <ul class="pdp-bullet-list">
                    ${product.precautions.map((p) => `<li>${p}</li>`).join('')}
                  </ul>
                </div>
              </div>

              <!-- Accordion 10: Medical Conclusion -->
              <div class="pdp-accordion-item">
                <button class="pdp-accordion-header" aria-expanded="false">
                  <span>10. Conclusion & Summary</span>
                  <span class="pdp-acc-icon">▾</span>
                </button>
                <div class="pdp-accordion-body">
                  <p>${product.conclusion}</p>
                </div>
              </div>

              <!-- Accordion 11: Product Specific FAQs -->
              <div class="pdp-accordion-item">
                <button class="pdp-accordion-header" aria-expanded="false">
                  <span>11. Frequently Asked Questions for ${product.name}</span>
                  <span class="pdp-acc-icon">▾</span>
                </button>
                <div class="pdp-accordion-body">
                  <div class="pdp-subfaqs">
                    ${product.faqs
                      .map(
                        (f) => `
                        <div class="pdp-subfaq-item">
                          <h4 class="pdp-subfaq-question">Q: ${f.question}</h4>
                          <p class="pdp-subfaq-answer">${f.answer}</p>
                        </div>
                      `
                      )
                      .join('')}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <!-- Related Products Section -->
        <section class="pdp-related-section">
          <div class="moda-container">
            <div class="pdp-related-heading">
              <span class="subheading">Complementary Formulations</span>
              <h2>Related Medications</h2>
              <p>Customers exploring ${product.name} frequently evaluate these European options:</p>
            </div>

            <div class="pdp-related-grid">
              ${relatedProducts
                .map(
                  (rel) => `
                  <article class="pdp-related-card">
                    <span class="related-cat-tag">${rel.category}</span>
                    <a href="#/product/${rel.slug}" class="related-img-wrap">
                      <img src="${rel.images[0]}" alt="${rel.name}" loading="lazy" />
                    </a>
                    <div class="related-body">
                      <h3><a href="#/product/${rel.slug}">${rel.name}</a></h3>
                      <div class="related-price">${rel.priceRange}</div>
                      <a href="#/product/${rel.slug}" class="btn-related-view">View Details</a>
                    </div>
                  </article>
                `
                )
                .join('')}
            </div>
          </div>
        </section>
      </div>
    `;
  }

  private static renderGeneralProduct(product: UnifiedProduct): string {
    this.activeUnifiedProduct = product;
    this.activeProduct = null;
    this.selectedQuantity = 1;

    const stars = '★'.repeat(Math.round(product.rating)) + '☆'.repeat(5 - Math.round(product.rating));
    const allUnified = UnifiedProductService.getAll().filter((p) => p.slug !== product.slug);
    const related = allUnified.slice(0, 3);
    const displayImg = product.image || product.fallbackImage;
    const galleryImages = product.images && product.images.length > 0 ? product.images : [displayImg];

    const sizeSelectorHtml =
      product.availableSizes && product.availableSizes.length > 0
        ? `
        <div class="pdp-variants-section">
          <div class="pdp-variants-header">
            <label class="pdp-variants-label">Select Size / Package:</label>
            <span class="pdp-stock-indicator">● ${product.stockStatus || 'In Stock'}</span>
          </div>
          <div class="pdp-chips-wrap">
            ${product.availableSizes
              .map(
                (s, idx) => `
              <button type="button" class="pdp-size-chip ${idx === 0 ? 'active' : ''}" data-size="${s}">
                ${s}
              </button>
            `
              )
              .join('')}
          </div>
        </div>
      `
        : '';

    const colorSelectorHtml =
      product.availableColors && product.availableColors.length > 0
        ? `
        <div class="pdp-colors-section" style="margin-top: 1rem;">
          <label class="pdp-variants-label" style="display:block; margin-bottom: 0.5rem; font-weight: 600; font-size: 0.9rem;">
            Colorway / Variant:
          </label>
          <div class="pdp-chips-wrap">
            ${product.availableColors
              .map(
                (c, idx) => `
              <button type="button" class="pdp-color-chip ${idx === 0 ? 'active' : ''}" data-color="${c}">
                ${c}
              </button>
            `
              )
              .join('')}
          </div>
        </div>
      `
        : '';

    const specsRows = Object.entries(product.specifications || {})
      .map(([key, val]) => `<tr><td>${key}</td><td>${val}</td></tr>`)
      .join('');

    return `
      <div class="view-product-detail" data-product-slug="${product.slug}">
        <!-- Breadcrumb Navigation -->
        <div class="product-breadcrumb-bar">
          <div class="moda-container">
            <nav class="breadcrumb-nav" aria-label="Breadcrumb">
              <a href="#/" class="breadcrumb-link">Home</a>
              <span class="breadcrumb-separator">/</span>
              <a href="#/shop" class="breadcrumb-link">Shop</a>
              <span class="breadcrumb-separator">/</span>
              <span class="breadcrumb-link">${product.category}</span>
              <span class="breadcrumb-separator">/</span>
              <span class="breadcrumb-current">${product.name}</span>
            </nav>
          </div>
        </div>

        <!-- Main Product Summary Section (2-Column) -->
        <section class="product-summary-section">
          <div class="moda-container">
            <div class="product-summary-grid">
              <!-- Left: Image Gallery & Authenticity Guarantee -->
              <div class="product-gallery-column">
                <div class="product-main-image-wrap">
                  <img
                    id="pdpMainImage"
                    src="${galleryImages[0]}"
                    alt="${product.name}"
                    class="pdp-main-img"
                    onerror="this.onerror=null; this.src='${product.fallbackImage}';"
                  />
                  <span class="pdp-zoom-badge">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <circle cx="11" cy="11" r="8"></circle>
                      <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                      <line x1="11" y1="8" x2="11" y2="14"></line>
                      <line x1="8" y1="11" x2="14" y2="11"></line>
                    </svg>
                  </span>
                </div>

                <!-- Gallery Thumbnails -->
                <div class="product-thumbnails-row">
                  ${galleryImages
                    .map(
                      (img, idx) => `
                    <button
                      type="button"
                      class="pdp-thumb-btn ${idx === 0 ? 'active' : ''}"
                      data-img-src="${img}"
                      aria-label="View thumbnail ${idx + 1}"
                    >
                      <img src="${img}" alt="${product.name} view ${idx + 1}" onerror="this.onerror=null; this.src='${product.fallbackImage}';" />
                    </button>
                  `
                    )
                    .join('')}
                </div>

                <!-- Verified Stamps -->
                <div class="pdp-trust-card">
                  <div class="pdp-trust-item">
                    <span class="pdp-trust-icon">🛡️</span>
                    <div>
                      <strong>100% Authentic Product</strong>
                      <span>Direct from verified manufacturers</span>
                    </div>
                  </div>
                  <div class="pdp-trust-item">
                    <span class="pdp-trust-icon">📦</span>
                    <div>
                      <strong>Discreet & Secure Dispatch</strong>
                      <span>Express tracked shipping across Europe</span>
                    </div>
                  </div>
                  <div class="pdp-trust-item">
                    <span class="pdp-trust-icon">⚡</span>
                    <div>
                      <strong>Satisfaction Guarantee</strong>
                      <span>30-day hassle-free returns & support</span>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Right: Pricing, Description, Selectors & Add to Cart -->
              <div class="product-info-column">
                <div class="pdp-meta-header">
                  <span class="pdp-category-pill">${product.category}</span>
                  <span class="pdp-mfg-pill">By ${product.brand}</span>
                </div>

                <h1 class="pdp-title">${product.name}</h1>

                <div class="pdp-rating-row">
                  <div class="pdp-stars">${stars}</div>
                  <span class="pdp-rating-val">${product.rating.toFixed(1)} / 5.0</span>
                  <span class="pdp-review-count">(${product.reviewCount} customer reviews)</span>
                </div>

                <div class="pdp-price-wrap">
                  <span class="pdp-selected-price" id="pdpSelectedPrice">${product.price}</span>
                  ${product.originalPrice ? `<span class="ai-sp-original-price" style="font-size: 1.1rem; text-decoration: line-through; color: #94a3b8; margin-left: 0.5rem;">${product.originalPrice}</span>` : ''}
                </div>

                <p class="pdp-short-desc">${product.shortDescription}</p>

                ${sizeSelectorHtml}
                ${colorSelectorHtml}

                <!-- Add to Cart & Quantity Bar -->
                <div class="pdp-actions-bar" style="margin-top: 1.5rem;">
                  <div class="pdp-quantity-selector">
                    <button type="button" class="pdp-qty-btn" id="btnQtyMinus" aria-label="Decrease quantity">−</button>
                    <input type="number" id="pdpQtyInput" value="1" min="1" max="50" aria-label="Quantity" />
                    <button type="button" class="pdp-qty-btn" id="btnQtyPlus" aria-label="Increase quantity">+</button>
                  </div>

                  <button type="button" class="btn-pdp-add-cart" id="btnPdpAddToCart">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.3">
                      <circle cx="9" cy="21" r="1"></circle>
                      <circle cx="20" cy="21" r="1"></circle>
                      <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                    </svg>
                    <span>Add to Cart</span>
                  </button>

                  <button type="button" class="btn-pdp-expert" data-open-expert="bulk" title="Wholesale Inquiry">
                    <span>Wholesale Bulk Quote</span>
                  </button>
                </div>

                <!-- Success Toast Container -->
                <div id="pdpCartToast" class="pdp-cart-toast" style="display: none;">
                  <span class="toast-icon">✓</span>
                  <span id="pdpToastMessage">Added to cart successfully!</span>
                </div>

                <!-- Product Specifications Meta Box -->
                <div class="pdp-specs-box">
                  <div class="pdp-spec-line">
                    <span class="spec-label">SKU:</span>
                    <span class="spec-value">${product.id.toUpperCase()}</span>
                  </div>
                  <div class="pdp-spec-line">
                    <span class="spec-label">Brand:</span>
                    <span class="spec-value">${product.brand}</span>
                  </div>
                  <div class="pdp-spec-line">
                    <span class="spec-label">Category:</span>
                    <span class="spec-value">${product.category}</span>
                  </div>
                  <div class="pdp-spec-line">
                    <span class="spec-label">Availability:</span>
                    <span class="spec-value">${product.stockStatus}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <!-- Detailed Specifications Accordions -->
        <section class="product-accordions-section">
          <div class="moda-container">
            <div class="pdp-section-heading">
              <span class="subheading">Technical Monograph & Specifications</span>
              <h2>Detailed Information for ${product.name}</h2>
              <p>Authentic product features, manufacturing details, and customer information.</p>
            </div>

            <div class="pdp-accordions-wrapper">
              <!-- Accordion 1: Overview -->
              <div class="pdp-accordion-item open">
                <button class="pdp-accordion-header" aria-expanded="true">
                  <span>1. Product Overview & Key Features</span>
                  <span class="pdp-acc-icon">▾</span>
                </button>
                <div class="pdp-accordion-body">
                  <p>${product.fullDescription || product.shortDescription}</p>
                  ${product.features ? `
                    <ul class="pdp-bullet-list" style="margin-top: 1rem;">
                      ${product.features.map((f) => `<li>${f}</li>`).join('')}
                    </ul>
                  ` : ''}
                </div>
              </div>

              <!-- Accordion 2: Full Specifications Table -->
              <div class="pdp-accordion-item">
                <button class="pdp-accordion-header" aria-expanded="false">
                  <span>2. Full Specifications Table</span>
                  <span class="pdp-acc-icon">▾</span>
                </button>
                <div class="pdp-accordion-body">
                  <div class="pdp-spec-table-wrap">
                    <table class="pdp-clinical-table">
                      <thead>
                        <tr>
                          <th>Attribute</th>
                          <th>Specification</th>
                        </tr>
                      </thead>
                      <tbody>
                        ${specsRows}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              <!-- Accordion 3: Delivery & Returns -->
              <div class="pdp-accordion-item">
                <button class="pdp-accordion-header" aria-expanded="false">
                  <span>3. European Logistics & Delivery Guarantees</span>
                  <span class="pdp-acc-icon">▾</span>
                </button>
                <div class="pdp-accordion-body">
                  <p>All items are carefully packaged and dispatched with express courier tracking. Standard delivery across Germany, France, the UK, and all EU member states takes 3 to 7 business days.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <!-- Related Products Section -->
        <section class="pdp-related-section">
          <div class="moda-container">
            <div class="pdp-related-heading">
              <span class="subheading">Recommended for You</span>
              <h2>Related Products</h2>
              <p>Explore more premium products from our catalog:</p>
            </div>

            <div class="pdp-related-grid">
              ${related
                .map(
                  (rel) => `
                <article class="pdp-related-card">
                  <span class="related-cat-tag">${rel.category}</span>
                  <a href="#/product/${rel.slug}" class="related-img-wrap">
                    <img src="${rel.image || rel.fallbackImage}" alt="${rel.name}" loading="lazy" onerror="this.onerror=null; this.src='${rel.fallbackImage}';" />
                  </a>
                  <div class="related-body">
                    <h3><a href="#/product/${rel.slug}">${rel.name}</a></h3>
                    <div class="related-price">${rel.price}</div>
                    <a href="#/product/${rel.slug}" class="btn-related-view">View Product</a>
                  </div>
                </article>
              `
                )
                .join('')}
            </div>
          </div>
        </section>
      </div>
    `;
  }

  public static initListeners(): void {
    if (!this.activeProduct && !this.activeUnifiedProduct) return;
    const product = this.activeProduct;

    // 1. Thumbnail Image Switcher
    const mainImg = document.getElementById('pdpMainImage') as HTMLImageElement | null;
    const thumbBtns = document.querySelectorAll('.pdp-thumb-btn');

    thumbBtns.forEach((btn) => {
      btn.addEventListener('click', (e) => {
        const target = e.currentTarget as HTMLElement;
        const newSrc = target.getAttribute('data-img-src');
        if (newSrc && mainImg) {
          mainImg.src = newSrc;
          thumbBtns.forEach((b) => b.classList.remove('active'));
          target.classList.add('active');
        }
      });
    });

    // 2. Variant Row Selection (Medication)
    const variantRows = document.querySelectorAll('.pdp-variant-row');
    const priceDisplay = document.getElementById('pdpSelectedPrice');
    const perPillDisplay = document.getElementById('pdpSelectedPerPill');

    variantRows.forEach((row) => {
      row.addEventListener('click', () => {
        const radio = row.querySelector('input[type="radio"]') as HTMLInputElement | null;
        if (!radio) return;

        radio.checked = true;
        variantRows.forEach((r) => r.classList.remove('selected'));
        row.classList.add('selected');

        const variantId = row.getAttribute('data-variant-id') || '';
        if (product) {
          const found = product.variants.find((v) => v.id === variantId);
          if (found) {
            this.selectedVariant = found;
            if (priceDisplay) priceDisplay.textContent = `€${found.priceEur.toFixed(2)}`;
            if (perPillDisplay) perPillDisplay.textContent = `(€${found.pricePerPill.toFixed(2)} / pill)`;
          }
        }
      });
    });

    // 2B. Size Chips Selection (General products)
    document.querySelectorAll('.pdp-size-chip').forEach((chip) => {
      chip.addEventListener('click', (e) => {
        document.querySelectorAll('.pdp-size-chip').forEach((c) => c.classList.remove('active'));
        (e.currentTarget as HTMLElement).classList.add('active');
      });
    });

    // 2C. Color Chips Selection (General products)
    document.querySelectorAll('.pdp-color-chip').forEach((chip) => {
      chip.addEventListener('click', (e) => {
        document.querySelectorAll('.pdp-color-chip').forEach((c) => c.classList.remove('active'));
        (e.currentTarget as HTMLElement).classList.add('active');
      });
    });

    // 3. Quantity Increment/Decrement
    const qtyInput = document.getElementById('pdpQtyInput') as HTMLInputElement | null;
    const btnMinus = document.getElementById('btnQtyMinus');
    const btnPlus = document.getElementById('btnQtyPlus');

    if (btnMinus && qtyInput) {
      btnMinus.addEventListener('click', () => {
        let val = parseInt(qtyInput.value, 10) || 1;
        if (val > 1) {
          val -= 1;
          qtyInput.value = val.toString();
          this.selectedQuantity = val;
        }
      });
    }

    if (btnPlus && qtyInput) {
      btnPlus.addEventListener('click', () => {
        let val = parseInt(qtyInput.value, 10) || 1;
        if (val < 50) {
          val += 1;
          qtyInput.value = val.toString();
          this.selectedQuantity = val;
        }
      });
    }

    // 4. Add to Cart Button
    const btnAddToCart = document.getElementById('btnPdpAddToCart');
    const cartToast = document.getElementById('pdpCartToast');
    const toastMsg = document.getElementById('pdpToastMessage');

    if (btnAddToCart) {
      btnAddToCart.addEventListener('click', async () => {
        btnAddToCart.setAttribute('disabled', 'true');
        btnAddToCart.innerHTML = `<span>Adding...</span>`;

        try {
          if (this.activeProduct && this.selectedVariant) {
            await WooCommerceService.executeAddToCart(
              this.activeProduct.id,
              this.selectedVariant.id,
              this.selectedQuantity
            );
            if (cartToast && toastMsg) {
              toastMsg.textContent = `Added ${this.selectedQuantity}x ${this.activeProduct.name} (${this.selectedVariant.tablets} pills) to cart!`;
            }
          } else if (this.activeUnifiedProduct) {
            await WooCommerceService.executeAddToCart(
              this.activeUnifiedProduct.id,
              'standard',
              this.selectedQuantity
            );
            if (cartToast && toastMsg) {
              toastMsg.textContent = `Added ${this.selectedQuantity}x ${this.activeUnifiedProduct.name} to cart!`;
            }
          }

          if (cartToast) {
            cartToast.style.display = 'flex';
            setTimeout(() => {
              cartToast.style.display = 'none';
            }, 3500);
          }

          // Open cart drawer
          CartDrawerComponent.open();
        } catch (err) {
          console.error('Failed to add to cart:', err);
        } finally {
          btnAddToCart.removeAttribute('disabled');
          btnAddToCart.innerHTML = `
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.3">
              <circle cx="9" cy="21" r="1"></circle>
              <circle cx="20" cy="21" r="1"></circle>
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
            </svg>
            <span>Add to Cart</span>
          `;
        }
      });
    }

    // 5. Accordion expand / collapse
    document.querySelectorAll('.pdp-accordion-header').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        const item = (e.currentTarget as HTMLElement).closest('.pdp-accordion-item');
        if (!item) return;
        const isOpen = item.classList.contains('open');

        // Toggle clicked
        if (isOpen) {
          item.classList.remove('open');
          (e.currentTarget as HTMLElement).setAttribute('aria-expanded', 'false');
        } else {
          item.classList.add('open');
          (e.currentTarget as HTMLElement).setAttribute('aria-expanded', 'true');
        }
      });
    });
  }
}
