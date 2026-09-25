import './styles/premium-voice.css';
import { VoiceSessionController } from './ui/VoiceSessionController';
import { WooCommerceService } from './services/wooCommerceService';
import { AuthService } from './services/authService';
import { STORE_PRODUCTS } from './services/storeCatalog';

document.addEventListener('DOMContentLoaded', () => {
  // 1. Initialize Master Voice Session Controller
  const controller = new VoiceSessionController();

  // 2. Render Storefront Products
  const productsGrid = document.getElementById('productsGrid');
  if (productsGrid) {
    productsGrid.innerHTML = STORE_PRODUCTS.map((prod) => {
      const variantTags = prod.variants
        .map((v) => `<span class="variant-tag">${v.tablets} tablets - $${v.price.toFixed(2)}</span>`)
        .join('');

      const mainVariant = prod.variants[0];

      return `
        <div class="product-card" data-product-id="${prod.id}">
          <img src="${prod.image}" alt="${prod.name}" class="product-image" loading="lazy" />
          <div class="product-info">
            <span class="product-category">${prod.category}</span>
            <h3 class="product-title">${prod.name}</h3>
            <p class="product-desc">${prod.description}</p>
            <div class="product-variants-tags">
              ${variantTags}
            </div>
            <div class="product-footer">
              <span class="product-price">$${mainVariant.price.toFixed(2)}</span>
              <button class="btn-add-cart" data-prod-id="${prod.id}" data-var-id="${mainVariant.id}">
                Add to Cart
              </button>
            </div>
          </div>
        </div>
      `;
    }).join('');

    // Attach manual add-to-cart clicks
    document.querySelectorAll('.btn-add-cart').forEach((btn) => {
      btn.addEventListener('click', async (e) => {
        const target = e.currentTarget as HTMLElement;
        const prodId = target.getAttribute('data-prod-id');
        const varId = target.getAttribute('data-var-id');
        if (prodId && varId) {
          if (!AuthService.isLoggedIn()) {
            AuthService.login('customer@example.com');
          }
          await WooCommerceService.executeAddToCart(prodId, varId, 1);
        }
      });
    });
  }

  // 3. Subscribe to Cart updates
  const cartCounter = document.getElementById('cartCounter');
  WooCommerceService.subscribe((cart) => {
    if (cartCounter) {
      cartCounter.textContent = cart.totalItems.toString();
    }
  });

  // 4. Subscribe to Auth updates
  const authStatus = document.getElementById('authStatus');
  AuthService.subscribe((user) => {
    if (authStatus) {
      if (user) {
        authStatus.textContent = `👤 ${user.name}`;
      } else {
        authStatus.textContent = '👤 Guest (Sign in)';
      }
    }
  });

  // 5. Connect Quick-test simulator chips if present
  document.querySelectorAll('.quick-test-chip').forEach((chip) => {
    chip.addEventListener('click', (e) => {
      const prompt = (e.currentTarget as HTMLElement).getAttribute('data-query');
      if (prompt) {
        controller.simulateUserUtterance(prompt);
      }
    });
  });
});
