import './styles/modaineurope.css';
import './styles/premium-voice.css';

import { HeaderComponent } from './components/Header';
import { FooterComponent } from './components/Footer';
import { CartDrawerComponent } from './components/CartDrawer';
import { ExpertModalComponent } from './components/ExpertModal';

import { AppRouter, RouteContext } from './router/Router';
import { HomeView } from './views/HomeView';
import { ShopView } from './views/ShopView';
import { ProductDetailView } from './views/ProductDetailView';
import { ContentView } from './views/ContentView';
import { AboutView } from './views/AboutView';
import { BlogView } from './views/BlogView';

import { VoiceSessionController } from './ui/VoiceSessionController';

document.addEventListener('DOMContentLoaded', () => {
  const app = document.getElementById('app');
  if (!app) return;

  // 1. Render App Shell
  app.innerHTML = `
    <!-- Top Header Bar with Astra Navigation (Exactly 5 items) -->
    ${HeaderComponent.render()}

    <!-- Dynamic Routed Main Content View -->
    <main id="mainContent" class="main-content-viewport"></main>

    <!-- Global Footer -->
    ${FooterComponent.render()}

    <!-- Global Flyout Cart Drawer -->
    ${CartDrawerComponent.render()}

    <!-- Global Consultation & Wholesale Expert Modal -->
    ${ExpertModalComponent.render()}
  `;

  // 2. Initialize Shell Interactive Listeners
  HeaderComponent.initListeners();
  CartDrawerComponent.initListeners();
  FooterComponent.initListeners();
  ExpertModalComponent.initListeners();

  // 3. Initialize Master AI Voice Concierge
  const voiceController = new VoiceSessionController();

  // 4. View Rendering Handler for Router
  const mainContentEl = document.getElementById('mainContent');
  const router = AppRouter.getInstance();

  const renderCurrentView = (ctx: RouteContext) => {
    if (!mainContentEl) return;

    switch (ctx.pageType) {
      case 'home':
        mainContentEl.innerHTML = HomeView.render();
        HomeView.initListeners();
        break;

      case 'shop':
        mainContentEl.innerHTML = ShopView.render(ctx.searchQuery, ctx.categoryFilter);
        ShopView.initListeners();
        break;

      case 'product':
        mainContentEl.innerHTML = ProductDetailView.render(ctx.slug || '');
        ProductDetailView.initListeners();
        break;

      case 'content':
        mainContentEl.innerHTML = ContentView.render();
        ContentView.initListeners();
        break;

      case 'about':
        mainContentEl.innerHTML = AboutView.render();
        AboutView.initListeners();
        break;

      case 'blog':
        mainContentEl.innerHTML = BlogView.render(ctx.searchQuery);
        BlogView.initListeners();
        break;

      default:
        mainContentEl.innerHTML = HomeView.render();
        HomeView.initListeners();
        break;
    }

    // Inform AI Voice Concierge of the page context (critical for single product context awareness)
    voiceController.setPageContext(ctx);

    // Attach quick simulator chips if present on page
    document.querySelectorAll('.quick-test-chip').forEach((chip) => {
      chip.addEventListener('click', (e) => {
        const prompt = (e.currentTarget as HTMLElement).getAttribute('data-query');
        if (prompt) {
          voiceController.simulateUserUtterance(prompt);
        }
      });
    });

    // Attach dynamic expert consultation triggers
    document.querySelectorAll('[data-open-expert]').forEach((el) => {
      el.addEventListener('click', (e) => {
        e.preventDefault();
        const type = (el.getAttribute('data-open-expert') as 'bulk' | 'product_advice' | 'shipping') || 'bulk';
        ExpertModalComponent.open(type);
      });
    });
  };

  // Subscribe to route changes
  router.on((context) => {
    renderCurrentView(context);
  });

  // Trigger initial route parsing
  router.init();

  // Global expert button handlers on shell elements
  document.querySelectorAll('[data-open-expert]').forEach((el) => {
    el.addEventListener('click', (e) => {
      e.preventDefault();
      const type = (el.getAttribute('data-open-expert') as 'bulk' | 'product_advice' | 'shipping') || 'bulk';
      ExpertModalComponent.open(type);
    });
  });
});
