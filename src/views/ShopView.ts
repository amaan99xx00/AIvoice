/**
 * ShopView for Moda In Europe (https://modaineurope.com/shop/)
 * Dynamic full catalog view with:
 *   - Category filter pills (All, Modafinil, Armodafinil, Sublingual)
 *   - Live search filter
 *   - Sorting by popularity, rating, price
 *   - Product cards linking to dedicated dynamic detail pages (#/product/[slug])
 */

import { PRODUCTS_CATALOG, ProductItem } from '../data/products';

export class ShopView {
  private static currentFilter: string = 'all';
  private static currentSearch: string = '';
  private static currentSort: string = 'default';

  public static render(initialSearch: string = '', initialCategory: string = 'all'): string {
    this.currentSearch = initialSearch;
    this.currentFilter = initialCategory;

    return `
      <div class="view-shop">
        <!-- Breadcrumbs -->
        <div class="shop-breadcrumb-bar">
          <div class="moda-container">
            <nav class="breadcrumb-nav" aria-label="Breadcrumb">
              <a href="#/" class="breadcrumb-link">Home</a>
              <span class="breadcrumb-separator">/</span>
              <span class="breadcrumb-current">Shop</span>
            </nav>
          </div>
        </div>

        <!-- Shop Header & Banner -->
        <section class="shop-hero-header">
          <div class="moda-container">
            <div class="shop-header-content">
              <span class="shop-eyebrow">EU Domestic Pharmacy Catalog</span>
              <h1 class="shop-main-title">European Wakefulness Medications</h1>
              <p class="shop-lead-text">
                Browse our complete collection of laboratory-tested, pharmaceutical-grade Modafinil, Armodafinil, and rapid-acting Sublingual formulations. Shipped directly from domestic European hubs in 100% plain discreet packaging.
              </p>
            </div>
          </div>
        </section>

        <!-- Shop Main Catalog Section -->
        <section class="shop-catalog-section">
          <div class="moda-container">
            <!-- Controls Toolbar: Filters, Search, Sort -->
            <div class="shop-toolbar-wrapper">
              <div class="shop-category-chips" id="shopCategoryChips">
                <button class="shop-cat-btn ${this.currentFilter === 'all' ? 'active' : ''}" data-category="all">
                  All Medications (${PRODUCTS_CATALOG.length})
                </button>
                <button class="shop-cat-btn ${this.currentFilter === 'modafinil' ? 'active' : ''}" data-category="modafinil">
                  Modafinil (${PRODUCTS_CATALOG.filter((p) => p.category === 'Modafinil Tablet').length})
                </button>
                <button class="shop-cat-btn ${this.currentFilter === 'armodafinil' ? 'active' : ''}" data-category="armodafinil">
                  Armodafinil (${PRODUCTS_CATALOG.filter((p) => p.category === 'Armodafinil Tablet').length})
                </button>
                <button class="shop-cat-btn ${this.currentFilter === 'sublingual' ? 'active' : ''}" data-category="sublingual">
                  Sublingual / Rapid (${PRODUCTS_CATALOG.filter((p) => p.category === 'Sublingual Tablet').length})
                </button>
              </div>

              <div class="shop-search-sort-bar">
                <div class="shop-search-box">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <circle cx="11" cy="11" r="8"></circle>
                    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                  </svg>
                  <input
                    type="text"
                    id="shopCatalogSearchInput"
                    placeholder="Search by name, strength or active agent..."
                    value="${this.escapeHtml(this.currentSearch)}"
                  />
                  ${this.currentSearch ? '<button id="btnShopClearSearch" class="shop-clear-search-btn">×</button>' : ''}
                </div>

                <div class="shop-sort-box">
                  <label for="shopSortSelect" class="shop-sort-label">Sort by:</label>
                  <select id="shopSortSelect" class="shop-sort-select">
                    <option value="default" ${this.currentSort === 'default' ? 'selected' : ''}>Default sorting</option>
                    <option value="popularity" ${this.currentSort === 'popularity' ? 'selected' : ''}>Popularity & reviews</option>
                    <option value="rating" ${this.currentSort === 'rating' ? 'selected' : ''}>Average customer rating</option>
                    <option value="price-asc" ${this.currentSort === 'price-asc' ? 'selected' : ''}>Price: low to high</option>
                    <option value="price-desc" ${this.currentSort === 'price-desc' ? 'selected' : ''}>Price: high to low</option>
                  </select>
                </div>
              </div>
            </div>

            <!-- Product Results Counter -->
            <div class="shop-results-status">
              <span id="shopProductCounter">Showing all ${PRODUCTS_CATALOG.length} medications</span>
              <span class="shop-eu-badge">
                <span class="pulse-dot"></span>
                Domestic EU Stock Guaranteed
              </span>
            </div>

            <!-- Product Grid -->
            <div class="shop-products-grid" id="shopCatalogGrid">
              ${this.renderProductCards(this.getFilteredProducts())}
            </div>

            <!-- Consultation / Bulk Banner -->
            <div class="shop-bottom-cta">
              <div class="shop-cta-card">
                <div class="shop-cta-text">
                  <h3>Looking for Commercial Bulk or Need Formulation Advice?</h3>
                  <p>Order volumes of 200 to 1,000+ pills qualify for custom tiered wholesale rates with tracked express freight.</p>
                </div>
                <div class="shop-cta-actions">
                  <button class="btn-moda-primary" data-open-expert="bulk">Request Bulk Quote</button>
                  <button class="btn-moda-outline" data-open-expert="product_advice">Ask Specialist</button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    `;
  }

  private static getFilteredProducts(): ProductItem[] {
    let list = [...PRODUCTS_CATALOG];

    // Filter by Category
    if (this.currentFilter === 'modafinil') {
      list = list.filter((p) => p.category === 'Modafinil Tablet');
    } else if (this.currentFilter === 'armodafinil') {
      list = list.filter((p) => p.category === 'Armodafinil Tablet');
    } else if (this.currentFilter === 'sublingual') {
      list = list.filter((p) => p.category === 'Sublingual Tablet');
    }

    // Filter by Search Query
    if (this.currentSearch.trim()) {
      const q = this.currentSearch.toLowerCase().trim();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.shortDescription.toLowerCase().includes(q) ||
          p.keyFeatures.manufacturer.toLowerCase().includes(q) ||
          p.keyFeatures.chemicalClass.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q)
      );
    }

    // Sort
    if (this.currentSort === 'popularity') {
      list.sort((a, b) => b.reviewCount - a.reviewCount);
    } else if (this.currentSort === 'rating') {
      list.sort((a, b) => b.rating - a.rating);
    } else if (this.currentSort === 'price-asc') {
      list.sort((a, b) => (a.variants[0]?.priceEur || 0) - (b.variants[0]?.priceEur || 0));
    } else if (this.currentSort === 'price-desc') {
      list.sort((a, b) => (b.variants[0]?.priceEur || 0) - (a.variants[0]?.priceEur || 0));
    }

    return list;
  }

  private static renderProductCards(products: ProductItem[]): string {
    if (products.length === 0) {
      return `
        <div class="shop-no-results">
          <div class="no-results-icon">🔍</div>
          <h3>No medications found matching "${this.escapeHtml(this.currentSearch)}"</h3>
          <p>Try searching for Modalert, Waklert, Modvigil, or reset your filters.</p>
          <button class="btn-moda-primary" id="btnResetShopFilters">Reset All Filters</button>
        </div>
      `;
    }

    return products
      .map((p) => {
        const stars = '★'.repeat(Math.round(p.rating)) + '☆'.repeat(5 - Math.round(p.rating));
        const lowestPerPill = p.variants[p.variants.length - 1]?.pricePerPill?.toFixed(2) || '0.90';

        return `
        <article class="shop-product-card" data-slug="${p.slug}">
          <div class="shop-card-badge-wrap">
            <span class="shop-pill-tag ${p.category.includes('Armodafinil') ? 'tag-armodafinil' : p.category.includes('Sublingual') ? 'tag-sublingual' : 'tag-modafinil'}">
              ${p.category}
            </span>
            ${p.featured ? '<span class="shop-tag-featured">Top Choice</span>' : ''}
          </div>

          <a href="#/product/${p.slug}" class="shop-card-media" aria-label="View ${p.name}">
            <img
              src="${p.images[0]}"
              alt="${p.name} - European Wakefulness Medication"
              class="shop-card-img"
              loading="lazy"
            />
          </a>

          <div class="shop-card-info">
            <div class="shop-card-rating">
              <span class="stars">${stars}</span>
              <span class="review-count">(${p.reviewCount} verified reviews)</span>
            </div>

            <h2 class="shop-card-title">
              <a href="#/product/${p.slug}">${p.name}</a>
            </h2>

            <p class="shop-card-desc">${p.shortDescription}</p>

            <div class="shop-card-specs">
              <span class="spec-item"><strong>Onset:</strong> ${p.keyFeatures.onsetOfAction}</span>
              <span class="spec-item"><strong>Duration:</strong> ${p.keyFeatures.durationOfAction}</span>
            </div>

            <div class="shop-card-price-row">
              <div class="price-stack">
                <span class="price-range">${p.priceRange}</span>
                <span class="per-pill-hint">From €${lowestPerPill} / pill</span>
              </div>
              <span class="stock-status in-stock">● In Stock</span>
            </div>

            <div class="shop-card-actions">
              <a href="#/product/${p.slug}" class="btn-shop-select-options">
                <span>Select Options</span>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                  <polyline points="12 5 19 12 12 19"></polyline>
                </svg>
              </a>
            </div>
          </div>
        </article>
      `;
      })
      .join('');
  }

  public static initListeners(): void {
    // 1. Category Filter Buttons
    document.querySelectorAll('.shop-cat-btn').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        const target = e.currentTarget as HTMLElement;
        const category = target.getAttribute('data-category') || 'all';
        this.currentFilter = category;

        document.querySelectorAll('.shop-cat-btn').forEach((b) => b.classList.remove('active'));
        target.classList.add('active');

        this.refreshGrid();
      });
    });

    // 2. Search Input Listener
    const searchInput = document.getElementById('shopCatalogSearchInput') as HTMLInputElement | null;
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        this.currentSearch = (e.target as HTMLInputElement).value;
        this.refreshGrid();
      });
    }

    // 3. Clear Search Button
    const clearBtn = document.getElementById('btnShopClearSearch');
    if (clearBtn && searchInput) {
      clearBtn.addEventListener('click', () => {
        this.currentSearch = '';
        searchInput.value = '';
        this.refreshGrid();
      });
    }

    // 4. Sort Dropdown
    const sortSelect = document.getElementById('shopSortSelect') as HTMLSelectElement | null;
    if (sortSelect) {
      sortSelect.addEventListener('change', (e) => {
        this.currentSort = (e.target as HTMLSelectElement).value;
        this.refreshGrid();
      });
    }

    // 5. Reset Filters Button
    const resetBtn = document.getElementById('btnResetShopFilters');
    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        this.currentFilter = 'all';
        this.currentSearch = '';
        this.currentSort = 'default';
        if (searchInput) searchInput.value = '';
        document.querySelectorAll('.shop-cat-btn').forEach((b) => {
          if (b.getAttribute('data-category') === 'all') b.classList.add('active');
          else b.classList.remove('active');
        });
        this.refreshGrid();
      });
    }
  }

  private static refreshGrid(): void {
    const grid = document.getElementById('shopCatalogGrid');
    const counter = document.getElementById('shopProductCounter');
    const filtered = this.getFilteredProducts();

    if (grid) {
      grid.innerHTML = this.renderProductCards(filtered);
    }
    if (counter) {
      counter.textContent = `Showing ${filtered.length} of ${PRODUCTS_CATALOG.length} medications`;
    }
  }

  private static escapeHtml(str: string): string {
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }
}
