export class BlogSectionComponent {
  public static render(): string {
    const posts = [
      {
        title: 'What Is Dysania And Why Is Getting Up So Hard?',
        author: 'Dr. Liam',
        date: 'September 23, 2026',
        image: 'https://modaineurope.com/wp-content/uploads/2026/09/What-Is-Dysania-And-Why-Is-Getting-Up-So-Hard.webp',
        excerpt: 'The alarm just went off at 7 a.m. You know you have to get out of bed, yet an overwhelming chronic morning fatigue holds you back. Here is the science behind severe morning sleep inertia.'
      },
      {
        title: 'Ever Felt Awake While Falling Asleep? Could Be Hypnagogia',
        author: 'Dr. Liam',
        date: 'September 17, 2026',
        image: 'https://modaineurope.com/wp-content/uploads/2026/09/Ever-Felt-Awake-While-Falling-Asleep-Could-Be-Hypnagogia-2.webp',
        excerpt: 'You know when you are lying in bed, the phone is put away, but you experience vivid sensory impressions while drifting off? Discover how hypnagogic transitions work.'
      },
      {
        title: 'How the Suprachiasmatic Nucleus Controls the Circadian Rhythm',
        author: 'Dr. Liam',
        date: 'September 10, 2026',
        image: 'https://modaineurope.com/wp-content/uploads/2026/09/How-the-Suprachiasmatic-Nucleus-Controls-the-Circadian-Rhythm.webp',
        excerpt: 'Ever wonder why you can feel alert at 11 p.m. despite being exhausted all afternoon? Learn how the master biological clock in your hypothalamus coordinates wakefulness hormones.'
      },
      {
        title: 'What Is Circadian Misalignment and Why Does It Matter?',
        author: 'Dr. Liam',
        date: 'September 8, 2026',
        image: 'https://modaineurope.com/wp-content/uploads/2026/09/What-Is-Circadian-Misalignment-and-Why-Does-It-Matter.webp',
        excerpt: 'Think of your weekly work pattern and habits. When modern social obligations conflict with natural biological rhythms, fatigue accumulates and concentration declines.'
      }
    ];

    const postsHtml = posts
      .map(
        (post) => `
      <article class="blog-card">
        <div class="blog-thumb-wrap">
          <img
            src="${post.image}"
            alt="${post.title}"
            class="blog-thumb"
            loading="lazy"
          />
        </div>
        <div class="blog-card-body">
          <div class="blog-meta">
            <span>👤 ${post.author}</span>
            <span>•</span>
            <span>📅 ${post.date}</span>
          </div>
          <h3 class="blog-title">${post.title}</h3>
          <p class="blog-excerpt">${post.excerpt}</p>
          <a href="#journal" class="blog-read-more">
            <span>Read More</span>
            <span>›</span>
          </a>
        </div>
      </article>
    `
      )
      .join('');

    return `
      <section class="blog-section" id="journal">
        <div class="moda-container">
          <div style="text-align: center; margin-bottom: 2.75rem;">
            <p class="section-pretitle">FROM OUR JOURNAL</p>
            <h2 class="section-title">What we’re talking about</h2>
            <p class="section-lead-text" style="margin-left: auto; margin-right: auto;">
              Scientific articles, sleep medicine breakthroughs, circadian rhythm insights, and nootropic research from clinical professionals.
            </p>
          </div>

          <div class="blog-grid">
            ${postsHtml}
          </div>
        </div>
      </section>
    `;
  }
}
