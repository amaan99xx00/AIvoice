import { PRODUCTS_CATALOG, ProductItem } from '../data/products';
import { WooCommerceService } from '../services/wooCommerceService';
import { CartDrawerComponent } from './CartDrawer';

export class ProductSectionComponent {
  public static render(): string {
    // Show featured & top products on homepage
    const featured = PRODUCTS_CATALOG.filter((p) => p.featured || ['modalert-200-mg', 'waklert-150mg', 'modvigil-200mg', 'artvigil-150mg'].includes(p.slug));
    const cardsHtml = featured.map((prod) => this.renderCard(prod)).join('');

    return `
      <section class="products-section" id="products">
        <div class="moda-container">
          <!-- Section Header -->
          <div class="section-header-wrap">
            <div>
              <p class="section-pretitle">Look what’s right for you</p>
              <h2 class="section-title">Our Featured Medications</h2>
              <p class="section-lead-text">
                Explore our full line of laboratory-verified wakefulness and cognitive support medications. Delivered directly to your door across Europe.
              </p>
            </div>
            <div>
              <a href="#/shop" class="btn-moda-outline">Browse Full Shop Catalog (12)</a>
            </div>
          </div>

          <!-- Product Grid -->
          <div class="products-grid" id="mainProductsGrid">
            ${cardsHtml}
          </div>
        </div>
      </section>
    `;
  }

  private static renderCard(prod: ProductItem): string {
    const defaultVariant = prod.variants[0];
    const isFeatured = prod.featured;
    const ratingScore = prod.rating.toFixed(2);
    const stars = '★'.repeat(Math.round(prod.rating)) + '☆'.repeat(5 - Math.round(prod.rating));

    // Variant pills
    const variantChips = prod.variants
      .map(
        (v, idx) => `
        <button
          type="button"
          class="variant-chip-btn ${idx === 0 ? 'active' : ''}"
          data-prod-id="${prod.id}"
          data-variant-id="${v.id}"
          data-tablets="${v.tablets}"
          data-price="${v.priceEur}"
        >
          ${v.tablets} Pills
        </button>
      `
      )
      .join('');

    const perPillCost = defaultVariant.pricePerPill.toFixed(2);

    return `
      <article
        class="product-card"
        data-product-id="${prod.id}"
        data-product-slug="${prod.slug}"
        data-product-name="${prod.name}"
        data-product-desc="${prod.shortDescription}"
        data-category="${prod.category}"
      >
        ${isFeatured ? '<span class="product-badge-featured">Featured</span>' : ''}
        
        <a href="#/product/${prod.slug}" class="product-thumb-wrap" aria-label="View ${prod.name}">
          <img
            src="${prod.images[0]}"
            alt="${prod.name} online in Europe | Modaineurope"
            class="product-card-img"
            loading="lazy"
          />
        </a>

        <div class="product-card-body">
          <h3 class="product-card-title">
            <a href="#/product/${prod.slug}">${prod.name}</a>
          </h3>
          
          <div class="product-card-rating">
            <span class="star-icons">${stars}</span>
            <span class="rating-score">${ratingScore} / 5</span>
          </div>

          <div class="product-card-price-range">${prod.priceRange}</div>

          <!-- Tablet Variant Chips -->
          <div class="variant-selector-wrap">
            <span class="variant-label">Select Pill Quantity</span>
            <div class="variant-chips">
              ${variantChips}
            </div>
          </div>

          <div class="product-card-footer">
            <div class="selected-variant-calc">
              <span id="pillCountDesc-${prod.id}">${defaultVariant.tablets} pills (€${perPillCost}/pill)</span>
              <span class="selected-price" id="selectedPrice-${prod.id}">€${defaultVariant.priceEur.toFixed(2)}</span>
            </div>

            <div style="display: flex; gap: 0.5rem; align-items: center;">
              <a
                href="#/product/${prod.slug}"
                class="btn-card-buy"
                style="background: #00349a; color: #ffffff; text-decoration: none; display: flex; align-items: center; justify-content: center; padding: 0.6rem 0.9rem; border-radius: 8px; font-weight: 600; font-size: 0.88rem;"
              >
                <span>Details</span>
              </a>

              <button
                type="button"
                class="btn-card-buy btn-add-to-cart"
                data-prod-id="${prod.id}"
                data-variant-id="${defaultVariant.id}"
                id="buyBtn-${prod.id}"
                title="Quick Add to Cart"
                style="padding: 0.6rem 0.75rem;"
              >
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round">
                  <circle cx="9" cy="21" r="1"></circle>
                  <circle cx="20" cy="21" r="1"></circle>
                  <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </article>
    `;
  }

  public static initListeners(): void {
    // 1. Tablet variant chip selection
    document.querySelectorAll('.variant-chip-btn').forEach((chip) => {
      chip.addEventListener('click', (e) => {
        const btn = e.currentTarget as HTMLElement;
        const prodId = btn.getAttribute('data-prod-id');
        const varId = btn.getAttribute('data-variant-id');
        const tablets = parseInt(btn.getAttribute('data-tablets') || '30', 10);
        const price = parseFloat(btn.getAttribute('data-price') || '69');

        if (!prodId || !varId) return;

        // Deselect sibling chips in same card
        const card = btn.closest('.product-card');
        if (card) {
          card.querySelectorAll('.variant-chip-btn').forEach((c) => c.classList.remove('active'));
        }
        btn.classList.add('active');

        // Update price display
        const priceEl = document.getElementById(`selectedPrice-${prodId}`);
        const descEl = document.getElementById(`pillCountDesc-${prodId}`);
        const buyBtn = document.getElementById(`buyBtn-${prodId}`);

        if (priceEl) priceEl.textContent = `€${price.toFixed(2)}`;
        if (descEl) {
          const perPill = (price / tablets).toFixed(2);
          descEl.textContent = `${tablets} pills (€${perPill}/pill)`;
        }
        if (buyBtn) {
          buyBtn.setAttribute('data-variant-id', varId);
        }
      });
    });

    // 2. Quick Add to Cart button
    document.querySelectorAll('.btn-add-to-cart').forEach((btn) => {
      btn.addEventListener('click', async (e) => {
        const target = e.currentTarget as HTMLElement;
        const prodId = target.getAttribute('data-prod-id');
        const varId = target.getAttribute('data-variant-id');

        if (prodId && varId) {
          target.classList.add('loading');
          await WooCommerceService.executeAddToCart(prodId, varId, 1);
          target.classList.remove('loading');
          CartDrawerComponent.open();
        }
      });
    });
  }
}
