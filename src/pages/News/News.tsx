import { useEffect, useState } from 'react';
import { Newspaper, Search } from 'lucide-react';
import NewsCard from '../../components/NewsCard/NewsCard';
import SmoothImage from '../../components/SmoothImage/SmoothImage';
import { useOrderedCollection } from '../../hooks/useCollection';
import { formatDate } from '../../lib/formatDate';
import { type NewsDoc, NEWS_CATEGORIES, NEWS_FALLBACK_IMAGE, newsDocToArticle } from '../../lib/news';
import './News.css';
import PageHero from '../../components/PageHero/PageHero';
import { useHashScroll } from '../../hooks/useHashScroll';

const categories = ['All', ...NEWS_CATEGORIES];

export default function News() {
  const { docs: items, loading, error } = useOrderedCollection<NewsDoc>('news', 'date', 'desc');
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  useHashScroll();

  useEffect(() => {
    document.title = 'News | Vishnu Womens University';
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const el = entry.target as HTMLElement;
            setTimeout(() => el.classList.add('revealed'), parseInt(el.dataset.delay || '0'));
            observer.unobserve(el);
          }
        });
      },
      { threshold: 0.1 }
    );
    document.querySelectorAll('.reveal, .reveal-left, .reveal-right').forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, [items]);

  const featuredItem = items.find(i => i.featured) ?? items[0];
  const rest = items.filter(i => i.id !== featuredItem?.id);

  const filtered = rest.filter(article => {
    const matchCategory = activeCategory === 'All' || article.category === activeCategory;
    const matchSearch = article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.summary.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCategory && matchSearch;
  });

  return (
    <main className="page-wrapper">
      {/* Hero */}
      <PageHero
        page="news"
        defaultTitle="VWU News & Stories"
        defaultSubtitle="Stay up-to-date with the latest happenings, achievements, and stories from the VWU community."
        breadcrumb={[{ label: 'Home', to: '/' }, { label: 'News' }]}
        scrollCtaTargetId="news-content"
      />

      {/* Featured Article */}
      {featuredItem && (
        <section className="news-featured">
          <div className="container">
            <div className="news-featured-card reveal">
              <div className="news-featured-image">
                <SmoothImage
                  src={featuredItem.imageUrl || NEWS_FALLBACK_IMAGE}
                  alt={featuredItem.title}
                />
                <span className="news-featured-badge">Featured Story</span>
              </div>
              <div className="news-featured-content">
                <div className="news-card-date">{formatDate(featuredItem.date)}</div>
                <h2>{featuredItem.title}</h2>
                <p>{featuredItem.summary}</p>
                {featuredItem.body && <p>{featuredItem.body}</p>}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Filters */}
      <section id="news-content" className="news-filter-section" style={{ scrollMarginTop: 'calc(var(--topbar-height) + var(--header-height) + 1rem)' }}>
        <div className="container">
          <div className="news-filter-bar">
            <div className="news-categories">
              {categories.map(cat => (
                <button
                  key={cat}
                  className={`news-cat-btn${activeCategory === cat ? ' active' : ''}`}
                  onClick={() => setActiveCategory(cat)}
                >
                  {cat}
                </button>
              ))}
            </div>
            <div className="news-search">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="news-search-icon">
                <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2"/>
                <path d="M21 21l-4.35-4.35" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
              <input
                type="search"
                placeholder="Search articles..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="news-search-input"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Articles Grid */}
      <section className="section bg-off-white">
        <div className="container">
          {loading ? (
            <div className="news-empty"><p>Loading articles…</p></div>
          ) : error ? (
            <div className="news-empty"><p>Couldn't load news right now. Please try again later.</p></div>
          ) : filtered.length > 0 ? (
            <>
              <div className="news-results-count">
                Showing {filtered.length} {filtered.length === 1 ? 'article' : 'articles'}
                {activeCategory !== 'All' && ` in ${activeCategory}`}
              </div>
              <div className="news-articles-grid">
                {filtered.map((item, i) => (
                  <div key={item.id} className="reveal" data-delay={`${(i % 3) * 100}`}>
                    <NewsCard article={newsDocToArticle(item)} />
                  </div>
                ))}
              </div>
            </>
          ) : items.length === 0 ? (
            <div className="news-empty">
              <div className="news-empty-icon" style={{ display: 'flex', justifyContent: 'center' }}><Newspaper size={56} strokeWidth={1.5} color="var(--color-light-gray)" /></div>
              <h3>No news yet</h3>
              <p>Check back soon for the latest updates from VWU.</p>
            </div>
          ) : (
            <div className="news-empty">
              <div className="news-empty-icon" style={{ display: 'flex', justifyContent: 'center' }}><Search size={56} strokeWidth={1.5} color="var(--color-light-gray)" /></div>
              <h3>No articles found</h3>
              <p>Try adjusting your search or category filter.</p>
              <button
                className="btn btn-primary"
                onClick={() => { setActiveCategory('All'); setSearchQuery(''); }}
              >
                Clear Filters
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Newsletter CTA */}
      <section className="section" style={{ background: 'var(--color-primary)' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <div className="reveal">
            <span className="section-label" style={{ color: 'var(--color-accent)' }}>Stay Connected</span>
            <h2 style={{ color: 'var(--color-white)', marginBottom: 'var(--space-4)' }}>
              Get VWU News Delivered to You
            </h2>
            <p style={{ color: 'rgba(255,255,255,0.7)', maxWidth: 480, margin: '0 auto var(--space-6)', fontSize: 'var(--text-lg)' }}>
              Subscribe to the VWU newsletter for the latest news, events, and campus updates.
            </p>
            <form onSubmit={e => e.preventDefault()} className="news-newsletter-form">
              <input type="email" placeholder="Enter your email address" className="news-newsletter-input" />
              <button type="submit" className="btn btn-accent">Subscribe</button>
            </form>
          </div>
        </div>
      </section>
    </main>
  );
}
