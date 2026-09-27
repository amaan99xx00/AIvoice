export class FaqSectionComponent {
  public static render(): string {
    const faqs = [
      {
        question: 'What are the reasons for daytime sleepiness?',
        answer: 'Few reasons for daytime sleepiness are poor sleep quality; hidden sleep disorders like Narcolepsy, Obstructive Sleep Apnea; shift work disruption; nutritional gaps or chronic stress.'
      },
      {
        question: 'What is Narcolepsy?',
        answer: 'Narcolepsy is a chronic neurological disorder that disrupts the brain’s ability to control sleep-wake cycles, leading to severe daytime drowsiness and sudden sleep attacks.'
      },
      {
        question: 'Can sleep affect concentration during the day?',
        answer: 'Yes. Poor or disrupted sleep directly compromises cognitive executive function, making it difficult to remain attentive, process complex information, and maintain stamina throughout the day.'
      },
      {
        question: 'What is the difference between Modafinil and Armodafinil?',
        answer: 'Modafinil contains an equal mix of two mirror-image enantiomers (R- and S- isomers) with an 8-12 hour half-life, whereas Armodafinil contains only the purified R-isomer, delivering a smoother 12-15 hour duration of action.'
      },
      {
        question: 'How is my order packaged and shipped across Europe?',
        answer: 'Every order is sealed in discreet, unbranded padded envelopes with neutral shipping labels. Zero pharmaceutical names or medication contents appear on the exterior packaging. Orders dispatch within 24 hours with complete online courier tracking (3-7 business days across the EU).'
      },
      {
        question: 'Do you guarantee European customs clearance?',
        answer: 'Yes. We provide a 100% delivery guarantee for all European destinations. In the rare event that a package is held or damaged, we arrange an immediate free reshipment or full refund.'
      },
      {
        question: 'How can I learn more about sleep disorders?',
        answer: 'Our Medical Journal and Blog section regularly covers sleep-related conditions, circadian biology, everyday sleep hygiene, and nootropic research to keep you informed.'
      }
    ];

    const faqItemsHtml = faqs
      .map(
        (faq, idx) => `
      <div class="faq-item ${idx === 0 ? 'active' : ''}" id="faqItem-${idx}">
        <button type="button" class="faq-question-btn" data-faq-index="${idx}" aria-expanded="${idx === 0 ? 'true' : 'false'}">
          <span>${faq.question}</span>
          <span class="faq-icon">${idx === 0 ? '−' : '+'}</span>
        </button>
        <div class="faq-answer-panel">
          <p>${faq.answer}</p>
        </div>
      </div>
    `
      )
      .join('');

    return `
      <section class="faq-section" id="faq">
        <div class="moda-container">
          <div class="faq-grid">
            <div class="faq-intro-col">
              <p class="section-pretitle">YOUR QUESTIONS ANSWERED</p>
              <h2 class="section-title">Making important information simple, accessible, and easier for everyone.</h2>
              <p class="section-lead-text">
                From sleep and wakefulness to product formulation, dosing, and European customs clearance, find straightforward answers to frequently asked questions.
              </p>

              <div style="margin-top: 2rem; padding: 1.5rem; background: var(--moda-bg-light); border-radius: 12px; border: 1px solid var(--moda-border);">
                <h4 style="font-size: 1.05rem; font-weight: 700; color: var(--moda-primary-dark); margin-bottom: 0.5rem;">Still have questions?</h4>
                <p style="font-size: 0.88rem; color: var(--moda-text-muted); margin-bottom: 1rem;">
                  Our AI Voice Concierge is available in the bottom-right corner 24/7, or you can speak directly with our European customer desk.
                </p>
                <div style="display: flex; gap: 0.75rem; flex-wrap: wrap;">
                  <a href="#contact" class="btn-moda-primary" style="padding: 0.65rem 1.4rem; font-size: 0.9rem;">
                    Contact Support
                  </a>
                  <button type="button" data-open-expert="bulk" class="btn-moda-outline" style="padding: 0.65rem 1.4rem; font-size: 0.9rem; cursor: pointer;">
                    Schedule an Expert Call
                  </button>
                </div>
              </div>
            </div>

            <div class="faq-accordion-col">
              <div class="faq-accordion">
                ${faqItemsHtml}
              </div>
            </div>
          </div>
        </div>
      </section>
    `;
  }

  public static initListeners(): void {
    document.querySelectorAll('.faq-question-btn').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        const target = e.currentTarget as HTMLElement;
        const item = target.closest('.faq-item');
        if (!item) return;

        const isActive = item.classList.contains('active');

        // Close other items (Astra single-accordion behavior)
        document.querySelectorAll('.faq-item').forEach((it) => {
          it.classList.remove('active');
          const btnEl = it.querySelector('.faq-question-btn');
          const iconEl = it.querySelector('.faq-icon');
          if (btnEl) btnEl.setAttribute('aria-expanded', 'false');
          if (iconEl) iconEl.textContent = '+';
        });

        if (!isActive) {
          item.classList.add('active');
          target.setAttribute('aria-expanded', 'true');
          const icon = item.querySelector('.faq-icon');
          if (icon) icon.textContent = '−';
        }
      });
    });
  }
}
