import { WooCommerceService, CartState } from '../services/wooCommerceService';
import { STORE_PRODUCTS } from '../services/storeCatalog';

export class CartDrawerComponent {
  public static render(): string {
    const cart = WooCommerceService.getCart();
    const itemsHtml = this.renderItems(cart);

    return `
      <!-- Backdrop Overlay -->
      <div class="cart-drawer-overlay" id="cartDrawerOverlay"></div>

      <!-- Astra Flyout Cart Drawer -->
      <aside class="astra-cart-drawer" id="astraCartDrawer" aria-label="Shopping Cart Drawer">
        <div class="cart-drawer-header">
          <h3 class="cart-drawer-title">Shopping Cart (<span id="cartDrawerTotalQty">${cart.totalItems}</span>)</h3>
          <button type="button" class="cart-drawer-close-btn" id="btnCloseCartDrawer" aria-label="Close cart">
            ✕
          </button>
        </div>

        <div class="cart-drawer-items-list" id="cartDrawerItemsList">
          ${itemsHtml}
        </div>

        <div class="cart-drawer-footer">
          <div class="cart-subtotal-row">
            <span>Subtotal:</span>
            <span id="cartSubtotalAmount">€${cart.subtotal.toFixed(2)}</span>
          </div>

          <div class="cart-shipping-notice" id="cartShippingNotice">
            ${
              cart.subtotal >= 150
                ? '✓ Free European Tracked Shipping Unlocked!'
                : `Add €${(150 - cart.subtotal).toFixed(2)} more for Free European Tracked Shipping.`
            }
          </div>

          <button type="button" class="cart-checkout-btn" id="btnCartCheckout">
            Proceed to Secure Checkout ❯
          </button>
        </div>
      </aside>
    `;
  }

  private static renderItems(cart: CartState): string {
    if (cart.items.length === 0) {
      return `
        <div class="cart-empty-state">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <circle cx="9" cy="21" r="1"></circle>
            <circle cx="20" cy="21" r="1"></circle>
            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
          </svg>
          <p style="font-weight: 600; font-size: 1rem; color: var(--moda-primary-dark); margin-bottom: 0.5rem;">Your cart is currently empty.</p>
          <p style="font-size: 0.85rem;">Browse our verified wakefulness medications and select your preferred pill count.</p>
        </div>
      `;
    }

    return cart.items
      .map((item) => {
        const prod = STORE_PRODUCTS.find((p) => p.id === item.productId);
        const img = prod ? prod.image : 'https://modaineurope.com/wp-content/uploads/2026/02/Modalert-200-mg.webp';

        return `
          <div class="cart-item-row" data-cart-key="${item.productId}-${item.variantId}">
            <img src="${img}" alt="${item.name}" class="cart-item-img" />
            
            <div class="cart-item-details">
              <div class="cart-item-name">${item.name}</div>
              <div class="cart-item-meta">${item.tablets} Pills • €${(item.price / item.tablets).toFixed(2)}/pill</div>
              <div class="cart-item-price">€${(item.price * item.quantity).toFixed(2)}</div>
            </div>

            <div style="display: flex; flex-direction: column; align-items: flex-end; gap: 0.35rem;">
              <button
                type="button"
                class="cart-item-remove-btn btn-remove-item"
                data-prod-id="${item.productId}"
                data-variant-id="${item.variantId}"
                title="Remove item"
              >
                ✕ Remove
              </button>
              <span style="font-size: 0.8rem; font-weight: 600; color: var(--moda-text-muted);">Qty: ${item.quantity}</span>
            </div>
          </div>
        `;
      })
      .join('');
  }

  public static open(): void {
    const drawer = document.getElementById('astraCartDrawer');
    const overlay = document.getElementById('cartDrawerOverlay');
    if (drawer && overlay) {
      drawer.classList.add('active');
      overlay.classList.add('active');
    }
  }

  public static close(): void {
    const drawer = document.getElementById('astraCartDrawer');
    const overlay = document.getElementById('cartDrawerOverlay');
    if (drawer && overlay) {
      drawer.classList.remove('active');
      overlay.classList.remove('active');
    }
  }

  public static initListeners(): void {
    const closeBtn = document.getElementById('btnCloseCartDrawer');
    const openBtn = document.getElementById('btnOpenCart');
    const overlay = document.getElementById('cartDrawerOverlay');

    if (openBtn) openBtn.addEventListener('click', () => this.open());
    if (closeBtn) closeBtn.addEventListener('click', () => this.close());
    if (overlay) overlay.addEventListener('click', () => this.close());

    // Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') this.close();
    });

    // Checkout click
    const checkoutBtn = document.getElementById('btnCartCheckout');
    if (checkoutBtn) {
      checkoutBtn.addEventListener('click', () => {
        const cart = WooCommerceService.getCart();
        if (cart.totalItems === 0) {
          alert('Your cart is empty. Please add a product first.');
        } else {
          alert(`Checkout initialized! Total: €${cart.subtotal.toFixed(2)} (${cart.totalItems} items).\nProceeding to encrypted European payment gateway.`);
        }
      });
    }

    // Subscribe to cart updates to re-render items inside drawer
    WooCommerceService.subscribe((cart) => {
      const listEl = document.getElementById('cartDrawerItemsList');
      const qtyEl = document.getElementById('cartDrawerTotalQty');
      const subtotalEl = document.getElementById('cartSubtotalAmount');
      const noticeEl = document.getElementById('cartShippingNotice');

      if (listEl) {
        listEl.innerHTML = this.renderItems(cart);
        this.attachRemoveListeners();
      }
      if (qtyEl) qtyEl.textContent = cart.totalItems.toString();
      if (subtotalEl) subtotalEl.textContent = `€${cart.subtotal.toFixed(2)}`;
      if (noticeEl) {
        noticeEl.textContent =
          cart.subtotal >= 150
            ? '✓ Free European Tracked Shipping Unlocked!'
            : `Add €${(150 - cart.subtotal).toFixed(2)} more for Free European Tracked Shipping.`;
      }
    });

    this.attachRemoveListeners();
  }

  private static attachRemoveListeners(): void {
    document.querySelectorAll('.btn-remove-item').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        const prodId = (e.currentTarget as HTMLElement).getAttribute('data-prod-id');
        const varId = (e.currentTarget as HTMLElement).getAttribute('data-variant-id');
        if (prodId && varId) {
          WooCommerceService.removeItem(prodId, varId);
        }
      });
    });
  }
}
