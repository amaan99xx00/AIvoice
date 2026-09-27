export class TestimonialsComponent {
  public static render(): string {
    const reviews = [
      {
        name: 'Dr. Harold Voss, MD',
        role: 'Consultant Neurologist',
        date: 'February 18, 2026',
        avatar: 'https://modaineurope.com/wp-content/uploads/2026/09/Dr.-Jonathan-Reed-MD.webp',
        quote: 'Sleep disorders rarely exist in isolation; they permeate every facet of a patient’s life, from career performance to family dynamics. In my practice, modafinil has consistently enabled patients to regain daytime alertness, and with it, a renewed sense of confidence and structure in their daily routines.'
      },
      {
        name: 'Dr. Sofie Lindström, MD',
        role: 'Occupational Health Specialist',
        date: 'July 23, 2026',
        avatar: 'https://modaineurope.com/wp-content/uploads/2026/09/Dr-Emily-Foster-MD.webp',
        quote: 'Excessive sleepiness in shift-based professions cannot be managed with caffeine alone. Armodafinil provides a pharmacological precision that supports sustained vigilance during irregular hours. I have observed marked improvements in both cognitive performance and workplace safety.'
      },
      {
        name: 'Dr. Allen Richter, MD',
        role: 'Sleep Disorders Specialist',
        date: 'January 23, 2026',
        avatar: 'https://modaineurope.com/wp-content/uploads/2026/09/Dr.-Daniel-Harris-MD.webp',
        quote: 'The ripple effects of poor sleep quality touch every dimension of health, physical, emotional, and social. With modafinil, I have witnessed patients reclaim their daytime energy, adhere more consistently to treatment plans, and rebuild the personal and professional connections that fatigue had eroded.'
      },
      {
        name: 'Dr. Lorenzo Bianchi, MD',
        role: 'Behavioral Sleep Medicine Specialist',
        date: 'May 07, 2026',
        avatar: 'https://modaineurope.com/wp-content/uploads/2026/09/Dr.-James-Peterson-MD.webp',
        quote: 'For professionals in high-stakes environments, persistent drowsiness is not merely inconvenient, it is a barrier to excellence. In my clinical experience, armodafinil has proven invaluable in maintaining extended alertness, thereby enhancing both occupational output and overall life satisfaction.'
      }
    ];

    const cardsHtml = reviews
      .map(
        (rev) => `
      <div class="testimonial-card">
        <div class="testimonial-header">
          <div class="doctor-profile">
            <img src="${rev.avatar}" alt="${rev.name}" class="doctor-avatar" loading="lazy" />
            <div>
              <h4 class="doctor-name">${rev.name}</h4>
              <p class="doctor-role">${rev.role}</p>
            </div>
          </div>
          <span class="quote-mark">“</span>
        </div>
        <p class="testimonial-quote">${rev.quote}</p>
        <div class="testimonial-date">Published ${rev.date}</div>
      </div>
    `
      )
      .join('');

    return `
      <section class="testimonials-section">
        <div class="moda-container">
          <div style="text-align: center; margin-bottom: 2.75rem;">
            <p class="section-pretitle">VOICES FROM HEALTHCARE</p>
            <h2 class="section-title">Expert Perspectives that put health first</h2>
            <p class="section-lead-text" style="margin-left: auto; margin-right: auto;">
              Clinical insights from medical specialists on wakefulness medications, daytime vigilance, and circadian alignment.
            </p>
          </div>

          <div class="testimonials-grid">
            ${cardsHtml}
          </div>
        </div>
      </section>
    `;
  }
}
