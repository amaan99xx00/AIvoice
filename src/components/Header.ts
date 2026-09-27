import { AuthService } from '../services/authService';
import { WooCommerceService } from '../services/wooCommerceService';
import { AppRouter } from '../router/Router';

export class HeaderComponent {
  public static render(): string {
    const user = AuthService.getCurrentUser();
    const cart = WooCommerceService.getCart();

    return `
      <!-- 1. Above Header Info Bar -->
      <div class="above-header-bar">
        <div class="moda-container above-header-inner">
          <div class="above-header-left">
            <a href="mailto:info@modaineurope.com" class="above-header-link">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
              </svg>
              <span>Info@modaineurope.com</span>
            </a>
          </div>
          <div class="above-header-right">
            <button class="above-header-link" data-open-expert="bulk" style="background: none; border: none; cursor: pointer; color: #ffcc00; font-weight: 700; font-family: inherit;">
              <span>📦 Bulk & Wholesale Inquiries</span>
            </button>
            <a href="tel:+17342746420" class="above-header-link">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/>
              </svg>
              <span>+1 (734) 274-6420</span>
            </a>
          </div>
        </div>
      </div>

      <!-- 2. Main Header Bar (Exactly 5 Navigation Items) -->
      <header class="main-header" id="mainHeader">
        <div class="moda-container main-header-inner">
          <!-- Logo -->
          <a href="#/" class="site-logo" title="Moda In Europe">
            <img src="https://modaineurope.com/wp-content/uploads/2026/09/Logo-EUR-230x85.webp" alt="Moda In Europe - Sleep Awakening Medication" />
          </a>

          <!-- Desktop Navigation: Exactly 5 items -->
          <nav class="desktop-nav" aria-label="Main Navigation">
            <a href="#/" class="nav-link active">Home</a>
            <a href="#/shop" class="nav-link">Shop</a>
            <a href="#/content" class="nav-link">Content</a>
            <a href="#/about" class="nav-link">About</a>
            <a href="#/blog" class="nav-link">Blog</a>
          </nav>

          <!-- Header Right Actions -->
          <div class="header-action-group">
            <!-- Search Button -->
            <button class="header-btn" id="btnToggleSearch" title="Search medications" aria-label="Search">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
            </button>

            <!-- Account Button -->
            <button class="header-btn" id="btnUserAccount" title="${user ? user.name : 'Sign In / Account'}" aria-label="Account">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
            </button>

            <!-- Cart Drawer Button -->
            <button class="header-btn cart-icon-wrapper" id="btnOpenCart" title="Shopping Cart" aria-label="Cart">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
                <line x1="3" y1="6" x2="21" y2="6"></line>
                <path d="M16 10a4 4 0 0 1-8 0"></path>
              </svg>
              <span class="cart-badge-count" id="headerCartCount">${cart.totalItems}</span>
            </button>

            <!-- Mobile Hamburger Toggle -->
            <button class="header-btn mobile-menu-toggle" id="btnMobileMenuToggle" aria-label="Toggle Menu">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                <line x1="3" y1="12" x2="21" y2="12"></line>
                <line x1="3" y1="6" x2="21" y2="6"></line>
                <line x1="3" y1="18" x2="21" y2="18"></line>
              </svg>
            </button>
          </div>
        </div>

        <!-- Live Header Search Dropdown -->
        <div class="header-search-bar" id="headerSearchBar">
          <div class="header-search-input-wrapper">
            <input type="text" id="siteSearchInput" class="header-search-input" placeholder="Search wakefulness medications (e.g. Modalert, Waklert, Artvigil)..." />
            <button class="header-search-submit" id="btnExecuteSearch" aria-label="Submit search">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
            </button>
          </div>
        </div>

        <!-- Mobile Slide-Down Drawer (Exactly 5 Navigation Items + Consultation Actions) -->
        <div class="mobile-nav-drawer" id="mobileNavDrawer">
          <ul class="mobile-nav-list">
            <li><a href="#/" class="mobile-nav-link active">Home</a></li>
            <li><a href="#/shop" class="mobile-nav-link">Shop</a></li>
            <li><a href="#/content" class="mobile-nav-link">Content</a></li>
            <li><a href="#/about" class="mobile-nav-link">About</a></li>
            <li><a href="#/blog" class="mobile-nav-link">Blog</a></li>
            <li style="border-top: 1px solid #e2e8f0; margin-top: 0.5rem; padding-top: 0.5rem;">
              <a href="#" data-open-expert="bulk" class="mobile-nav-link" style="color: #00349a; font-weight: 700;">📦 Bulk & Wholesale Orders</a>
            </li>
            <li>
              <a href="#" data-open-expert="product_advice" class="mobile-nav-link" style="color: #046bd2; font-weight: 700;">🩺 Talk to a Product Specialist</a>
            </li>
          </ul>
        </div>
      </header>
    `;
  }

  public static initListeners(): void {
    // 1. Mobile toggle
    const mobileBtn = document.getElementById('btnMobileMenuToggle');
    const mobileDrawer = document.getElementById('mobileNavDrawer');
    if (mobileBtn && mobileDrawer) {
      mobileBtn.addEventListener('click', () => {
        mobileDrawer.classList.toggle('active');
      });

      // Close mobile drawer when clicking a link
      mobileDrawer.querySelectorAll('.mobile-nav-link').forEach((link) => {
        link.addEventListener('click', () => {
          mobileDrawer.classList.remove('active');
        });
      });
    }

    // 2. Search bar toggle
    const searchBtn = document.getElementById('btnToggleSearch');
    const searchBar = document.getElementById('headerSearchBar');
    const searchInput = document.getElementById('siteSearchInput') as HTMLInputElement | null;
    if (searchBtn && searchBar) {
      searchBtn.addEventListener('click', () => {
        searchBar.classList.toggle('active');
        if (searchBar.classList.contains('active') && searchInput) {
          searchInput.focus();
        }
      });
    }

    // 3. Search query submission: navigates to #/shop?search=...
    const executeSearch = () => {
      if (!searchInput) return;
      const term = searchInput.value.trim();
      if (term) {
        if (searchBar) searchBar.classList.remove('active');
        AppRouter.getInstance().navigate(`shop?search=${encodeURIComponent(term)}`);
      }
    };

    if (searchInput) {
      searchInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          executeSearch();
        }
      });
    }

    const btnExec = document.getElementById('btnExecuteSearch');
    if (btnExec) btnExec.addEventListener('click', executeSearch);

    // 4. User Account Modal / Quick Sign-in
    const btnUser = document.getElementById('btnUserAccount');
    if (btnUser) {
      btnUser.addEventListener('click', () => {
        if (AuthService.isLoggedIn()) {
          const u = AuthService.getCurrentUser();
          const logout = confirm(`Logged in as ${u?.name} (${u?.email}).\nDo you want to log out?`);
          if (logout) {
            AuthService.logout();
            alert('You have logged out.');
          }
        } else {
          const email = prompt('Sign in to your Moda In Europe account:\nEnter your email address:', 'customer@modaineurope.com');
          if (email && email.trim().length > 3) {
            AuthService.login(email.trim());
            alert(`Welcome back, ${email}!`);
          }
        }
      });
    }

    // 5. Subscribe to Cart count updates
    const countEl = document.getElementById('headerCartCount');
    WooCommerceService.subscribe((cart) => {
      if (countEl) {
        countEl.textContent = cart.totalItems.toString();
      }
    });
  }
}
