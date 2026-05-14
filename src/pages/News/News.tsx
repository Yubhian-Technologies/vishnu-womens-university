import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import NewsCard from '../../components/NewsCard/NewsCard';
import { newsArticles } from '../../data/news';
import './News.css';

const categories = ['All', 'Campus News', 'Academics', 'Placements', 'Research', 'Awards', 'Events'];

export default function News() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    document.title = 'News | Vishnu Womens University';
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
  }, []);

  const filtered = newsArticles.filter(article => {
    const matchCategory = activeCategory === 'All' || article.category === activeCategory;
    const matchSearch = article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCategory && matchSearch;
  });

  return (
    <main className="page-wrapper">
      {/* Hero */}
      <section className="page-hero" style={{ minHeight: 320 }}>
        <img
          src="https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=1920&q=80"
          alt="VWU news and media"
          className="page-hero-image"
        />
        <div className="page-hero-overlay" />
        <div className="container page-hero-content">
          <div className="breadcrumb animate-fade-in">
            <Link to="/" className="breadcrumb-item">Home</Link>
            <span className="breadcrumb-sep">›</span>
            <span className="breadcrumb-item active">News</span>
          </div>
          <h1 className="animate-fade-in-up">VWU News & Stories</h1>
          <p className="animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            Stay up-to-date with the latest happenings, achievements, and stories from the VWU community.
          </p>
        </div>
      </section>

      {/* Featured Article */}
      <section className="news-featured">
        <div className="container">
          <div className="news-featured-card reveal">
            <div className="news-featured-image">
              <img
                src="https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=1200&q=80"
                alt="Team Ziba Racers at mBAJA SAEINDIA 2026"
                loading="lazy"
              />
              <span className="news-featured-badge">Featured Story</span>
            </div>
            <div className="news-featured-content">
              <div className="news-card-date">May 10, 2026</div>
              <h2>Team Ziba Racers Wins mBAJA SAEINDIA 2026 Award</h2>
              <p>
                VWU's Team Ziba Racers brought laurels to the institution by winning a prestigious
                award at the mBAJA SAEINDIA 2026 national competition on May 10, showcasing
                outstanding engineering design, teamwork, and innovation. The team competed
                against top engineering colleges from across India.
              </p>
              <p>
                The mBAJA SAEINDIA competition challenges student teams to design, build, and race
                an all-terrain vehicle, testing engineering skills in real-world conditions. VWU's
                victory reflects the college's commitment to hands-on technical excellence.
              </p>
              <div style={{ display: 'flex', gap: 'var(--space-4)', marginTop: 'var(--space-6)' }}>
                <Link to="/news" className="btn btn-primary">Read Full Story</Link>
                <Link to="/news" className="btn btn-outline">Share</Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Filters */}
      <section className="news-filter-section">
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
          {filtered.length > 0 ? (
            <>
              <div className="news-results-count">
                Showing {filtered.length} {filtered.length === 1 ? 'article' : 'articles'}
                {activeCategory !== 'All' && ` in ${activeCategory}`}
              </div>
              <div className="news-articles-grid">
                {filtered.map((article, i) => (
                  <div key={article.id} className="reveal" data-delay={`${(i % 3) * 100}`}>
                    <NewsCard article={article} />
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="news-empty">
              <div className="news-empty-icon">🔍</div>
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
