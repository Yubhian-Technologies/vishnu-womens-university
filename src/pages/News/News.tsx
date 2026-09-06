import { useEffect, useState } from 'react';
import { Newspaper, Search } from 'lucide-react';
import NewsCard, { type NewsArticle } from '../../components/NewsCard/NewsCard';
import NewsArticleDialog from '../../components/NewsCard/NewsArticleDialog';
import SmoothImage from '../../components/SmoothImage/SmoothImage';
import { useOrderedCollection } from '../../hooks/useCollection';
import { formatDate } from '../../lib/formatDate';
import { type NewsDoc, NEWS_CATEGORIES, NEWS_FALLBACK_IMAGE, newsDocToArticle } from '../../lib/news';
import { happeningToArticle } from '../../lib/happenings';
import type { HappeningDoc } from '../Admin/sections/NewsAwardsDataAdmin';
import './News.css';
import PageHero from '../../components/PageHero/PageHero';
import { useHashScroll } from '../../hooks/useHashScroll';
import { useSiteContact } from '../../hooks/useSiteContact';
import SEO from '../../components/SEO/SEO';
import { getArticleSchema, getBreadcrumbSchema } from '../../lib/seo/schemas';

const categories = ['All', ...NEWS_CATEGORIES];

export default function News() {
  const { docs: items, loading, error } = useOrderedCollection<NewsDoc>('news', 'date', 'desc');
  // "Event" articles are sourced from the Happenings admin (see
  // NewsAwardsDataAdmin.tsx) rather than the `news` collection — everything
  // else (News/Achievement/Award/Announcement/Research) still comes from
  // the News & Events admin, same as always.
  const { docs: happenings } = useOrderedCollection<HappeningDoc>('happenings', 'order');
  const { email: contactEmail } = useSiteContact();
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeArticle, setActiveArticle] = useState<NewsArticle | null>(null);
  const [newsletterEmail, setNewsletterEmail] = useState('');

  useHashScroll();

  useEffect(() => {
    document.title = "News | Vishnu Women's University";
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
  }, []);

  // The featured hero banner below only ever picks from real news articles
  // — it shows a `body` and an ISO-formatted `date` neither of which a
  // happening has, so a happening is never eligible to become it.
  const featuredItem = items.find(i => i.featured) ?? items[0];
  const rest = items.filter(i => i.id !== featuredItem?.id);

  // Grid articles below merge both sources: real news articles (any
  // category) plus every happening, tagged "Event" regardless of whether
  // it's Recent or Upcoming — that distinction lives on the Happenings page
  // itself, not here.
  const combined: NewsArticle[] = [
    ...rest.map(newsDocToArticle),
    ...happenings.map((h) => ({ ...happeningToArticle(h), category: 'Event' })),
  ];

  const filtered = combined.filter(article => {
    const matchCategory = activeCategory === 'All' || article.category === activeCategory;
    const matchSearch = (article.title || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (article.excerpt || '').toLowerCase().includes(searchQuery.toLowerCase());
    return matchCategory && matchSearch;
  });

  const newsJsonLd = [
    getBreadcrumbSchema([{ name: 'News', url: '/news' }]),
    ...(featuredItem ? [getArticleSchema({
      title: featuredItem.title,
      description: featuredItem.summary,
      publishedDate: featuredItem.date,
      image: featuredItem.imageUrl,
      url: '/news',
    })] : [])
  ];

  return (
    <main className="page-wrapper">
      <SEO
        title="VWU News & Stories | Latest Campus Updates | Vishnu Women's University"
        description="Stay up-to-date with the latest news, achievements, events, research breakthroughs, and campus developments at Vishnu Women's University, Bhimavaram."
        canonicalPath="/news"
        ogImage={featuredItem?.imageUrl}
        jsonLd={newsJsonLd}
      />
      {/* Hero */}
      <PageHero
        page="news"
        defaultTitle="VWU News & Stories"
        defaultSubtitle="Stay up-to-date with the latest happenings, achievements, and stories from the VWU community."
        breadcrumb={[{ label: 'Home', to: '/' }, { label: 'News' }]}
        scrollCtaTargetId="news-content"
      />

      {/* Featured Article — rendered from Firestore, so no scroll-reveal
          animation here (see the gotcha documented in CLAUDE.md). */}
      {featuredItem && (
        <section className="news-featured">
          <div className="container">
            <div className="news-featured-card">
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
              {/* Firestore-derived (news + happenings), so no scroll-reveal
                  animation on the cards themselves (see the gotcha
                  documented in CLAUDE.md). */}
              <div className="news-articles-grid">
                {filtered.map((item) => (
                  <div key={item.id}>
                    <NewsCard article={item} onReadMore={() => setActiveArticle(item)} />
                  </div>
                ))}
              </div>
            </>
          ) : items.length === 0 && happenings.length === 0 ? (
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

      <NewsArticleDialog article={activeArticle} onClose={() => setActiveArticle(null)} />

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
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const email = newsletterEmail.trim();
                if (!email) return;
                const subject = encodeURIComponent('VWU Newsletter Subscription');
                const body = encodeURIComponent(`Please add me to the VWU newsletter mailing list.\n\nMy email is: ${email}`);
                window.location.href = `mailto:${contactEmail}?subject=${subject}&body=${body}`;
              }}
              className="news-newsletter-form"
            >
              <input
                type="email"
                required
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                placeholder="Enter your email address"
                className="news-newsletter-input"
              />
              <button type="submit" className="btn btn-accent">Subscribe</button>
            </form>
          </div>
        </div>
      </section>
    </main>
  );
}
