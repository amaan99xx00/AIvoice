/**
 * BlogView for Moda In Europe (#/blog or #/journal)
 * Clinical medical publications, peer-reviewed sleep disorder analyses,
 * and cognitive performance guides.
 */

import { BLOG_POSTS, BlogPost, BlogKnowledgeService } from '../data/blog';

export class BlogView {
  private static currentSearch: string = '';

  public static render(searchQuery: string = ''): string {
    this.currentSearch = searchQuery;
    const posts = this.currentSearch
      ? BlogKnowledgeService.searchArticles(this.currentSearch)
      : BLOG_POSTS;

    return `
      <div class="view-blog">
        <!-- Breadcrumbs -->
        <div class="shop-breadcrumb-bar">
          <div class="moda-container">
            <nav class="breadcrumb-nav" aria-label="Breadcrumb">
              <a href="#/" class="breadcrumb-link">Home</a>
              <span class="breadcrumb-separator">/</span>
              <span class="breadcrumb-current">Medical Journal & Blogs</span>
            </nav>
          </div>
        </div>

        <!-- Hero Header -->
        <section class="blog-hero-section">
          <div class="moda-container">
            <span class="shop-eyebrow">From Our Medical Journal</span>
            <h1 class="shop-main-title">Clinical Publications & Research</h1>
            <p class="shop-lead-text">
              Authoritative medical analyses on circadian misalignment, narcolepsy management, neuropharmacology of wakefulness, and evidence-based sleep hygiene.
            </p>

            <!-- Search Bar -->
            <div class="blog-search-bar-wrap">
              <input
                type="text"
                id="blogSearchInput"
                class="blog-search-input"
                placeholder="Search articles by keyword (e.g., Narcolepsy, Shift Work, Armodafinil, Melatonin)..."
                value="${this.escapeHtml(this.currentSearch)}"
              />
              <button type="button" id="btnBlogSearchSubmit" class="btn-moda-primary">Search</button>
            </div>
          </div>
        </section>

        <!-- Articles Grid -->
        <section class="blog-grid-section">
          <div class="moda-container">
            <div class="blog-articles-grid" id="blogArticlesGrid">
              ${this.renderArticles(posts)}
            </div>
          </div>
        </section>

        <!-- Article Reader Modal Container -->
        <div id="blogArticleModal" class="blog-modal-backdrop" style="display: none;">
          <div class="blog-modal-container">
            <button type="button" class="blog-modal-close" id="btnBlogModalClose" aria-label="Close article">×</button>
            <div id="blogModalBody" class="blog-modal-body"></div>
          </div>
        </div>
      </div>
    `;
  }

  private static renderArticles(posts: BlogPost[]): string {
    if (posts.length === 0) {
      return `
        <div class="blog-no-results" style="grid-column: 1 / -1; text-align: center; padding: 3rem 1rem;">
          <p style="font-size: 1.2rem; color: #475569;">No clinical publications found for "${this.escapeHtml(this.currentSearch)}".</p>
          <button class="btn-moda-outline" id="btnResetBlogSearch" style="margin-top: 1rem;">View All Publications</button>
        </div>
      `;
    }

    return posts
      .map(
        (post) => `
        <article class="blog-card" data-slug="${post.slug}">
          <div class="blog-card-media">
            <img src="${post.image}" alt="${post.title}" loading="lazy" />
            <span class="blog-card-category">${post.category}</span>
          </div>

          <div class="blog-card-content">
            <div class="blog-card-meta">
              <span>📅 ${post.publishDate}</span>
              <span>⏱️ ${post.readTime}</span>
            </div>

            <h2 class="blog-card-title">${post.title}</h2>
            <p class="blog-card-author">By <strong>${post.author}</strong> — <em>${post.authorTitle}</em></p>
            <p class="blog-card-summary">${post.summary}</p>

            <div class="blog-card-footer">
              <button type="button" class="btn-read-article" data-article-id="${post.id}">
                <span>Read Full Article</span>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2">
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                  <polyline points="12 5 19 12 12 19"></polyline>
                </svg>
              </button>
            </div>
          </div>
        </article>
      `
      )
      .join('');
  }

  public static initListeners(): void {
    // 1. Search input and button
    const searchInput = document.getElementById('blogSearchInput') as HTMLInputElement | null;
    const searchBtn = document.getElementById('btnBlogSearchSubmit');
    const resetBtn = document.getElementById('btnResetBlogSearch');

    const executeSearch = () => {
      if (!searchInput) return;
      this.currentSearch = searchInput.value;
      const grid = document.getElementById('blogArticlesGrid');
      if (grid) {
        const results = this.currentSearch
          ? BlogKnowledgeService.searchArticles(this.currentSearch)
          : BLOG_POSTS;
        grid.innerHTML = this.renderArticles(results);
        this.attachArticleClickListeners();
      }
    };

    if (searchBtn) searchBtn.addEventListener('click', executeSearch);
    if (searchInput) {
      searchInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') executeSearch();
      });
    }
    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        this.currentSearch = '';
        if (searchInput) searchInput.value = '';
        executeSearch();
      });
    }

    // 2. Article modal click
    this.attachArticleClickListeners();

    // 3. Close modal
    const modal = document.getElementById('blogArticleModal');
    const closeBtn = document.getElementById('btnBlogModalClose');

    if (closeBtn && modal) {
      closeBtn.addEventListener('click', () => {
        modal.style.display = 'none';
        document.body.classList.remove('modal-open');
      });
    }

    if (modal) {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) {
          modal.style.display = 'none';
          document.body.classList.remove('modal-open');
        }
      });
    }
  }

  private static attachArticleClickListeners(): void {
    document.querySelectorAll('.btn-read-article').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        const id = (e.currentTarget as HTMLElement).getAttribute('data-article-id');
        const post = BLOG_POSTS.find((p) => p.id === id);
        if (!post) return;

        this.openArticleModal(post);
      });
    });
  }

  private static openArticleModal(post: BlogPost): void {
    const modal = document.getElementById('blogArticleModal');
    const body = document.getElementById('blogModalBody');
    if (!modal || !body) return;

    body.innerHTML = `
      <div class="article-modal-header">
        <span class="blog-card-category" style="position: static; margin-bottom: 0.5rem; display: inline-block;">${post.category}</span>
        <h1 style="font-size: 1.75rem; color: #00349a; margin-bottom: 0.5rem; line-height: 1.3;">${post.title}</h1>
        <div style="font-size: 0.85rem; color: #64748b; margin-bottom: 1.5rem;">
          <span>By <strong>${post.author}</strong> (${post.authorTitle})</span> • 
          <span>${post.publishDate}</span> • 
          <span>${post.readTime}</span>
        </div>
      </div>

      <div class="article-modal-content" style="color: #334155; line-height: 1.7; font-size: 1rem;">
        ${post.content.map((p) => `<p style="margin-bottom: 1.2rem;">${p}</p>`).join('')}

        <div style="margin: 2rem 0; padding: 1.5rem; background: #f0fdf4; border-left: 4px solid #16a34a; border-radius: 8px;">
          <h4 style="color: #166534; font-size: 1.05rem; margin-bottom: 0.5rem;">Key Clinical Takeaways</h4>
          <ul style="padding-left: 1.25rem; color: #166534; margin: 0;">
            ${post.keyTakeaways.map((t) => `<li style="margin-bottom: 0.35rem;">${t}</li>`).join('')}
          </ul>
        </div>

        <div style="display: flex; gap: 0.5rem; flex-wrap: wrap; margin-top: 1.5rem;">
          ${post.tags.map((t) => `<span style="padding: 0.25rem 0.65rem; background: #f1f5f9; color: #475569; font-size: 0.8rem; border-radius: 9999px;">#${t}</span>`).join('')}
        </div>
      </div>
    `;

    modal.style.display = 'flex';
    document.body.classList.add('modal-open');
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
