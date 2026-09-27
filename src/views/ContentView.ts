/**
 * ContentView for Moda In Europe (#/content)
 * Clinical educational portal presenting verified sleep-wake neuroscience,
 * eugeroics vs psychostimulants, hypothalamic orexin pathways, and circadian hygiene.
 */

import { EDUCATIONAL_CONTENT } from '../data/content';

export class ContentView {
  public static render(): string {
    return `
      <div class="view-content">
        <!-- Breadcrumbs -->
        <div class="shop-breadcrumb-bar">
          <div class="moda-container">
            <nav class="breadcrumb-nav" aria-label="Breadcrumb">
              <a href="#/" class="breadcrumb-link">Home</a>
              <span class="breadcrumb-separator">/</span>
              <span class="breadcrumb-current">Sleep & Wakefulness Resources</span>
            </nav>
          </div>
        </div>

        <!-- Hero Header -->
        <section class="content-hero-header">
          <div class="moda-container">
            <span class="shop-eyebrow">Medical & Scientific Knowledge Base</span>
            <h1 class="shop-main-title">Sleep & Wakefulness Clinical Resources</h1>
            <p class="shop-lead-text">
              Evidence-based educational documentation on wakefulness-promoting agents (eugeroics), hypothalamic neurotransmission, circadian biology, and safe harm-reduction protocols.
            </p>
          </div>
        </section>

        <!-- Educational Articles Section -->
        <section class="content-articles-section">
          <div class="moda-container">
            <div class="content-sections-stack">
              ${EDUCATIONAL_CONTENT.map(
                (sec, index) => `
                <article class="content-card-block" id="${sec.id}">
                  <div class="content-card-header">
                    <span class="content-part-badge">Part 0${index + 1}</span>
                    <h2 class="content-title">${sec.title}</h2>
                    <p class="content-subtitle">${sec.subtitle}</p>
                    <p class="content-lead-desc">${sec.description}</p>
                  </div>

                  <div class="content-subsections-grid">
                    ${sec.sections
                      .map(
                        (sub) => `
                      <div class="content-sub-item">
                        <h3 class="content-sub-heading">${sub.heading}</h3>
                        <p class="content-sub-body">${sub.body}</p>
                        ${
                          sub.bulletPoints
                            ? `
                          <ul class="content-bullet-list">
                            ${sub.bulletPoints.map((bp) => `<li>${bp}</li>`).join('')}
                          </ul>
                        `
                            : ''
                        }
                      </div>
                    `
                      )
                      .join('')}
                  </div>
                </article>
              `
              ).join('')}
            </div>

            <!-- Voice Assistant Tip Box -->
            <div class="content-voice-callout">
              <div class="voice-callout-icon">🎙️</div>
              <div class="voice-callout-body">
                <h3>Have Questions About Sleep Disorders or Eugeroic Pharmacology?</h3>
                <p>
                  Click the floating microphone button to ask Moda AI directly. You can inquire: 
                  <em>"What is the difference between Modafinil and Armodafinil?"</em> or <em>"How does Modafinil affect dopamine?"</em>
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    `;
  }

  public static initListeners(): void {
    // Smooth scrolling or tab switches if needed
  }
}
