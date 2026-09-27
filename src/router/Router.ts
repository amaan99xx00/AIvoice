/**
 * SPA Router for Moda In Europe
 * Manages client-side hash routing for:
 *   - / or #/ or #home: Home View
 *   - #/shop: Catalog Shop View
 *   - #/product/:slug: Single Product Detail View (e.g. #/product/modalert-100mg)
 *   - #/content: Educational Sleep & Wakefulness Resources
 *   - #/about: About Us, European Logistics & Authenticity
 *   - #/blog: Medical Journal & Articles
 *
 * Emits route changes to notify Voice Concierge and updates page context.
 */

import { ProductKnowledgeService, ProductItem } from '../data/products';
import { UnifiedProductService } from '../services/UnifiedProductService';

export type PageType = 'home' | 'shop' | 'product' | 'content' | 'about' | 'blog';

export interface RouteContext {
  pageType: PageType;
  slug?: string;
  product?: ProductItem;
  searchQuery?: string;
  categoryFilter?: string;
}

export type RouteChangeCallback = (context: RouteContext) => void;

export class AppRouter {
  private static instance: AppRouter;
  private currentContext: RouteContext = { pageType: 'home' };
  private listeners: RouteChangeCallback[] = [];

  private constructor() {
    if (typeof window !== 'undefined') {
      window.addEventListener('hashchange', () => this.handleHashChange());
      window.addEventListener('popstate', () => this.handleHashChange());
    }
  }

  public static getInstance(): AppRouter {
    if (!AppRouter.instance) {
      AppRouter.instance = new AppRouter();
    }
    return AppRouter.instance;
  }

  public on(callback: RouteChangeCallback): () => void {
    this.listeners.push(callback);
    // Immediately notify with current context
    callback(this.currentContext);
    return () => {
      this.listeners = this.listeners.filter((cb) => cb !== callback);
    };
  }

  public getCurrentContext(): RouteContext {
    return this.currentContext;
  }

  public navigate(path: string): void {
    const cleanPath = path.startsWith('#') ? path : `#${path}`;
    if (typeof window !== 'undefined') {
      window.location.hash = cleanPath;
    }
  }

  public parseCurrentRoute(customPath?: string): RouteContext {
    let rawPath = '';
    let queryPart = '';

    if (customPath !== undefined) {
      const parts = customPath.replace(/^#\/?/, '').replace(/^\//, '').split('?');
      rawPath = parts[0] || '';
      queryPart = parts[1] || '';
    } else if (typeof window !== 'undefined') {
      rawPath = window.location.hash.replace(/^#\/?/, '').trim();
      // If no hash route is present, support direct pathname deep links (e.g. /product/nike-air-max-270 or /shop)
      if (!rawPath && window.location.pathname && window.location.pathname !== '/') {
        rawPath = window.location.pathname.replace(/^\//, '').trim();
        queryPart = window.location.search.replace(/^\?/, '').trim();
      } else {
        const parts = rawPath.split('?');
        rawPath = parts[0] || '';
        queryPart = parts[1] || '';
      }
    }

    const windowSearch = typeof window !== 'undefined' ? window.location.search : '';
    const params = new URLSearchParams(queryPart || windowSearch || '');
    const searchQuery = params.get('search') || undefined;
    const categoryFilter = params.get('category') || undefined;

    const segments = rawPath.split('/').filter(Boolean);

    // Empty or home
    if (segments.length === 0 || segments[0] === 'home') {
      return { pageType: 'home' };
    }

    // Shop catalog / products alias
    if (segments[0] === 'shop' || (segments[0] === 'products' && !segments[1])) {
      return {
        pageType: 'shop',
        searchQuery,
        categoryFilter
      };
    }

    // Product detail: /product/:slug or /products/:slug
    if ((segments[0] === 'product' || segments[0] === 'products') && segments[1]) {
      const slug = segments[1];
      const product = ProductKnowledgeService.getBySlug(slug);
      return {
        pageType: 'product',
        slug,
        product
      };
    }

    // Content educational page
    if (segments[0] === 'content') {
      return { pageType: 'content' };
    }

    // About page
    if (segments[0] === 'about') {
      return { pageType: 'about' };
    }

    // Contact page (maps to home with contact anchor)
    if (segments[0] === 'contact') {
      return { pageType: 'home' };
    }

    // Blog / Journal page
    if (segments[0] === 'blog' || segments[0] === 'journal') {
      return {
        pageType: 'blog',
        searchQuery
      };
    }

    // Fallback: If anchor matches a section id on home (e.g. faq, contact)
    if (['faq', 'contact', 'testimonials', 'apart', 'health'].includes(segments[0])) {
      return { pageType: 'home' };
    }

    // Default to home
    return { pageType: 'home' };
  }

  public init(): void {
    this.handleHashChange();
  }

  private handleHashChange(): void {
    this.currentContext = this.parseCurrentRoute();

    // Update document title dynamically
    if (typeof document !== 'undefined') {
      this.updateDocumentTitle();
      this.updateNavigationActiveStates();
    }

    // Scroll to top unless navigating to an anchor on home
    if (typeof window !== 'undefined') {
      const rawHash = window.location.hash.replace(/^#\/?/, '').trim();
      if (['faq', 'contact', 'testimonials', 'apart', 'health'].includes(rawHash)) {
        setTimeout(() => {
          const el = document.getElementById(rawHash);
          if (el) {
            el.scrollIntoView({ behavior: 'smooth' });
          }
        }, 100);
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }

    // Notify listeners (e.g., VoiceSessionController, View Renderer)
    this.listeners.forEach((callback) => {
      try {
        callback(this.currentContext);
      } catch (e) {
        console.error('Error in route change listener:', e);
      }
    });
  }

  private updateDocumentTitle(): void {
    const baseTitle = 'Moda In Europe | Sleep Awakening Medications';
    switch (this.currentContext.pageType) {
      case 'home':
        document.title = `Home | ${baseTitle}`;
        break;
      case 'shop':
        document.title = `European Wakefulness Medications Shop | ${baseTitle}`;
        break;
      case 'product':
        if (this.currentContext.product) {
          document.title = `${this.currentContext.product.name} | Moda In Europe`;
        } else if (this.currentContext.slug) {
          const unified = UnifiedProductService.getBySlug(this.currentContext.slug);
          if (unified) {
            document.title = `${unified.name} | Moda In Europe`;
          } else {
            document.title = `Product Detail | ${baseTitle}`;
          }
        } else {
          document.title = `Product Detail | ${baseTitle}`;
        }
        break;
      case 'content':
        document.title = `Sleep & Wakefulness Educational Resources | ${baseTitle}`;
        break;
      case 'about':
        document.title = `About Moda In Europe & European Logistics | ${baseTitle}`;
        break;
      case 'blog':
        document.title = `Medical Journal & Clinical Publications | ${baseTitle}`;
        break;
      default:
        document.title = baseTitle;
    }
  }

  private updateNavigationActiveStates(): void {
    const currentPage = this.currentContext.pageType;
    document.querySelectorAll('.desktop-nav .nav-link, .mobile-nav-link').forEach((link) => {
      const href = link.getAttribute('href') || '';
      let matches = false;

      if (currentPage === 'home' && (href === '#/' || href === '#' || href === '#home' || href === '')) {
        matches = true;
      } else if (currentPage === 'shop' && href.includes('#/shop')) {
        matches = true;
      } else if (currentPage === 'content' && href.includes('#/content')) {
        matches = true;
      } else if (currentPage === 'about' && href.includes('#/about')) {
        matches = true;
      } else if (currentPage === 'blog' && (href.includes('#/blog') || href.includes('#/journal'))) {
        matches = true;
      }

      if (matches) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });
  }
}
