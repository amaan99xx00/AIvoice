import { STORE_PRODUCTS } from '../services/storeCatalog';
import { WooCommerceService } from '../services/wooCommerceService';
import { AuthService } from '../services/authService';

export class SecondaryShowcaseComponent {
  public static render(): string {
    // 4 quick-find products
    const featuredIds = ['prod-armodavinil-150', 'prod-modafil-md-200', 'prod-modaheal-200', 'prod-modawake-200'];
    const products = STORE_PRODUCTS.filter((p) => featuredIds.includes(p.id));

    const itemsHtml = products
      .map((prod) => {
        const v = prod.variants[0];
        const stars = '★'.repeat(Math.round(prod.rating || 5)) + '☆'.repeat(5 - Math.round(prod.rating || 5));
        return `
        <div class="product-card" style="box-shadow: 0 4px 12px rgba(0,0,0,0.04);">
          <div class="product-thumb-wrap" style="min-height: 180px;">
            <img src="${prod.image}" alt="${prod.name}" class="product-card-img" style="max-height: 150px;" loading="lazy" />
          </div>
          <div class="product-card-body">
            <h3 class="product-card-title">${prod.name}</h3>
            <div class="product-card-rating">
              <span class="star-icons">${stars}</span>
              <span class="rating-score">${prod.rating?.toFixed(2)} / 5</span>
            </div>
            <div class="product-card-price-range">${prod.priceRange}</div>
            <div style="font-size: 0.82rem; color: var(--moda-text-muted); margin-bottom: 0.75rem;">
              Starter pack: ${v.tablets} Pills • €${(v.price / v.tablets).toFixed(2)}/pill
            </div>
            <button
              type="button"
              class="btn-card-buy btn-fast-buy"
              data-prod-id="${prod.id}"
              data-variant-id="${v.id}"
            >
              <span>Buy Now • €${v.price.toFixed(2)}</span>
            </button>
          </div>
        </div>
      `;
      })
      .join('');

    return `
      <section style="padding: 4.5rem 0; background: linear-gradient(180deg, #ffffff 0%, var(--moda-bg-light) 100%); border-top: 1px solid var(--moda-border);">
        <div class="moda-container">
          <div class="section-header-wrap">
            <div>
              <p class="section-pretitle">NOT SURE WHAT YOU NEED?</p>
              <h2 class="section-title">We’ll help you find it fast</h2>
              <p class="section-lead-text">
                Browse our top selected daytime alertness options, curated for fast dispatch and balanced cognitive performance.
              </p>
            </div>
            <div>
              <a href="#products" class="btn-moda-primary">
                <span>View Full Catalog</span>
              </a>
            </div>
          </div>

          <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 1.5rem;" class="secondary-showcase-grid">
            ${itemsHtml}
          </div>
        </div>
      </section>
    `;
  }

  public static initListeners(): void {
    document.querySelectorAll('.btn-fast-buy').forEach((btn) => {
      btn.addEventListener('click', async (e) => {
        const target = e.currentTarget as HTMLElement;
        const prodId = target.getAttribute('data-prod-id');
        const varId = target.getAttribute('data-variant-id');

        if (prodId && varId) {
          if (!AuthService.isLoggedIn()) {
            AuthService.login('customer@modaineurope.com');
          }
          await WooCommerceService.executeAddToCart(prodId, varId, 1);

          // Open cart drawer
          const drawer = document.getElementById('astraCartDrawer');
          const overlay = document.getElementById('cartDrawerOverlay');
          if (drawer && overlay) {
            drawer.classList.add('active');
            overlay.classList.add('active');
          }
        }
      });
    });
  }
}
