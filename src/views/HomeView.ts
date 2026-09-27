/**
 * HomeView for Moda In Europe
 * Renders the full homepage experience with Astra-styled design:
 *   - Hero Section
 *   - Trust & Authenticity Badges
 *   - Featured Wakefulness Medications
 *   - What Sets Us Apart
 *   - Sleep & Wakefulness Health Tabs
 *   - Secondary Product Showcase ("We'll help you find it fast")
 *   - Healthcare Provider Perspectives
 *   - Frequently Asked Questions
 *   - Medical Journal Highlights
 *   - Contact Desk
 */

import { HeroComponent } from '../components/Hero';
import { TrustFeaturesComponent } from '../components/TrustFeatures';
import { ProductSectionComponent } from '../components/ProductSection';
import { ApartSectionComponent } from '../components/ApartSection';
import { HealthTabsComponent } from '../components/HealthTabs';
import { SecondaryShowcaseComponent } from '../components/SecondaryShowcase';
import { TestimonialsComponent } from '../components/Testimonials';
import { FaqSectionComponent } from '../components/FaqSection';
import { BlogSectionComponent } from '../components/BlogSection';
import { ContactSectionComponent } from '../components/ContactSection';

export class HomeView {
  public static render(): string {
    return `
      <div class="view-home">
        <!-- 1. Hero Section -->
        ${HeroComponent.render()}

        <!-- 2. Trust Badges -->
        ${TrustFeaturesComponent.render()}

        <!-- 3. Featured Products Grid -->
        ${ProductSectionComponent.render()}

        <!-- 4. What Sets Us Apart Section -->
        ${ApartSectionComponent.render()}

        <!-- 5. Sleep & Wakefulness Health Tabs -->
        ${HealthTabsComponent.render()}

        <!-- 6. Secondary Product Showcase -->
        ${SecondaryShowcaseComponent.render()}

        <!-- 7. Healthcare Endorsements -->
        ${TestimonialsComponent.render()}

        <!-- 8. FAQ Accordion -->
        ${FaqSectionComponent.render()}

        <!-- 9. From Our Journal -->
        ${BlogSectionComponent.render()}

        <!-- 10. Contact Us -->
        ${ContactSectionComponent.render()}

        <!-- Quick Utterance Simulator Bar for Evaluators -->
        <section class="quick-sim-bar" style="padding: 2.5rem 0; background-color: #f8fafc; border-top: 1px solid #e2e8f0;">
          <div class="moda-container">
            <div style="background: #ffffff; padding: 1.5rem; border-radius: 16px; border: 1px solid #cbd5e1; box-shadow: 0 4px 12px rgba(0,0,0,0.05);">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.85rem; flex-wrap: wrap; gap: 0.5rem;">
                <span style="font-size: 0.85rem; font-weight: 700; color: #00349a; letter-spacing: 0.05em; text-transform: uppercase; display: flex; align-items: center; gap: 0.4rem;">
                  <span>🎙️</span> AI Voice Concierge — Multilingual Spoken Test Utterances
                </span>
                <span style="font-size: 0.78rem; color: #64748b;">
                  Click any chip to test instant speech synthesis & multi-turn dialog
                </span>
              </div>
              <div style="display: flex; flex-wrap: wrap; gap: 0.5rem;">
                <button class="quick-test-chip" data-query="Tell me about Modalert 100mg" style="padding: 0.4rem 0.85rem; background: #f8fafc; border: 1px solid #00349a; border-radius: 9999px; font-size: 0.82rem; font-weight: 600; color: #00349a; cursor: pointer;">
                  "Tell me about Modalert 100mg"
                </button>
                <button class="quick-test-chip" data-query="Pouvez-vous m'expliquer ce produit ?" style="padding: 0.4rem 0.85rem; background: #f0fdf4; border: 1px solid #86efac; border-radius: 9999px; font-size: 0.82rem; font-weight: 600; color: #15803d; cursor: pointer;">
                  🇫🇷 "Pouvez-vous m'expliquer ce produit ?"
                </button>
                <button class="quick-test-chip" data-query="What is the difference between Modafinil and Armodafinil?" style="padding: 0.4rem 0.85rem; background: #eff6ff; border: 1px solid #93c5fd; border-radius: 9999px; font-size: 0.82rem; font-weight: 600; color: #1d4ed8; cursor: pointer;">
                  "Modafinil vs Armodafinil"
                </button>
                <button class="quick-test-chip" data-query="I want to make a bulk order of 200 units" style="padding: 0.4rem 0.85rem; background: #faf5ff; border: 1px solid #d8b4fe; border-radius: 9999px; font-size: 0.82rem; font-weight: 700; color: #7e22ce; cursor: pointer;">
                  📦 "Bulk order of 200 units"
                </button>
                <button class="quick-test-chip" data-query="Is Modalert safe with my heart condition?" style="padding: 0.4rem 0.85rem; background: #fff7ed; border: 1px solid #fdba74; border-radius: 9999px; font-size: 0.82rem; font-weight: 600; color: #c2410c; cursor: pointer;">
                  🩺 "Is it safe with my heart condition?"
                </button>
                <button class="quick-test-chip" data-query="Do you ship to France and Germany?" style="padding: 0.4rem 0.85rem; background: #f8fafc; border: 1px solid #cbd5e1; border-radius: 9999px; font-size: 0.82rem; font-weight: 600; color: #334155; cursor: pointer;">
                  🚚 "Do you ship to France & Germany?"
                </button>
                <button class="quick-test-chip" data-query="Mujhe Waklert chahiye" style="padding: 0.4rem 0.85rem; background: #f0fdf4; border: 1px solid #86efac; border-radius: 9999px; font-size: 0.82rem; font-weight: 600; color: #166534; cursor: pointer;">
                  🇮🇳 "Mujhe Waklert chahiye"
                </button>
              </div>
            </div>
          </div>
        </section>
      </div>
    `;
  }

  public static initListeners(): void {
    ProductSectionComponent.initListeners();
    HealthTabsComponent.initListeners();
    SecondaryShowcaseComponent.initListeners();
    FaqSectionComponent.initListeners();
    ContactSectionComponent.initListeners();
  }
}
