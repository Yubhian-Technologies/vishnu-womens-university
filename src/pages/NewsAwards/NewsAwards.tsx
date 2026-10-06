import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Trophy, Image } from 'lucide-react';
import PageHero from '../../components/PageHero/PageHero';
import { useHashScroll } from '../../hooks/useHashScroll';
import { useContentBlocks } from '../../hooks/useContentBlocks';
import { renderBold } from '../../lib/boldText';
import { useDocument } from '../../hooks/useDocument';
import { DEFAULT_NEWS_AWARDS_CONTENT, NEWS_AWARDS_CONTENT_COLLECTION, NEWS_AWARDS_CONTENT_DOC_ID, type NewsAwardsContentDoc } from '../Admin/sections/NewsAwardsContentAdmin';

// slug/anchor/icon per card are structural/position-matched -- title/desc
// come from the settings/newsAwardsContent doc (see NewsAwardsContentAdmin).
const SECTION_META = [
  { slug: 'happenings', anchor: 'upcoming-events', icon: Calendar },
  { slug: 'accreditations-awards', anchor: 'accreditations-content', icon: Trophy },
  { slug: 'gallery', anchor: 'gallery-content', icon: Image },
];

export default function NewsAwards() {
  useHashScroll();
  const highlights = useContentBlocks('news-awards', 'highlights');
  const { data: remoteContent } = useDocument<NewsAwardsContentDoc>(NEWS_AWARDS_CONTENT_COLLECTION, NEWS_AWARDS_CONTENT_DOC_ID);
  const content = { ...DEFAULT_NEWS_AWARDS_CONTENT, ...remoteContent };
  const sections = SECTION_META.map((meta, idx) => ({ ...meta, ...(content.cards[idx] || DEFAULT_NEWS_AWARDS_CONTENT.cards[idx]) }));

  useEffect(() => {
    document.title = "News & Awards | Vishnu Women's University";
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
    document.querySelectorAll('.reveal').forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <main className="page-wrapper">
      {/* Hero */}
      <PageHero
        page="news-awards"
        defaultTitle="News & Awards"
  defaultSubtitle="Celebrating VWU's achievements, events, and milestones — from national accreditations and rankings to campus happenings and visual memories."
        breadcrumb={[{ label: 'Home', to: '/' }, { label: 'News & Awards' }]}
        scrollCtaTargetId="news-awards-content"
      />

      {/* Stats bar */}
      <section id="news-awards-content" style={{ background: 'var(--color-primary)', padding: 'var(--space-6) 0', scrollMarginTop: 'calc(var(--topbar-height) + var(--header-height) + 1rem)' }}>
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'center', gap: 'var(--space-14)', flexWrap: 'wrap' }}>
            {highlights.map((h) => (
              <div key={h.id} style={{ textAlign: 'center' }}>
                <div style={{ fontFamily: 'var(--font-serif)', fontSize: '2rem', fontWeight: 900, color: 'var(--color-accent)' }}>{renderBold(h.value)}</div>
                <div style={{ fontSize: 'var(--text-sm)', color: 'rgba(255,255,255,0.7)' }}>{h.title}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Cards */}
      <section className="section bg-off-white">
        <div className="container">
          <div className="reveal" style={{ marginBottom: 'var(--space-10)' }}>
            <h2 className="section-title">{content.cardsHeading}</h2>
            <p style={{ color: 'var(--color-text-light)', maxWidth: 600, lineHeight: 1.7 }}>
              {content.cardsParagraph}
            </p>
          </div>

          <div className="card-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(300px, 100%), 1fr))', gap: 'var(--space-6)' }}>
            {sections.map((s, i) => (
              <div
                key={s.slug}
                className="reveal"
                data-delay={`${i * 80}`}
                style={{ background: 'var(--color-white)', border: '1.5px solid var(--color-light-gray)', borderRadius: 'var(--radius-md)', padding: 'var(--space-6)', display: 'flex', flexDirection: 'column', transition: 'all var(--transition-base)' }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--color-accent)'; (e.currentTarget as HTMLElement).style.boxShadow = 'var(--shadow-md)'; (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)'; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--color-light-gray)'; (e.currentTarget as HTMLElement).style.boxShadow = 'none'; (e.currentTarget as HTMLElement).style.transform = 'none'; }}
              >
                <div style={{ marginBottom: 'var(--space-4)' }}><s.icon size={40} strokeWidth={1.75} /></div>
                <h3 style={{ fontFamily: 'var(--font-sans)', fontSize: 'var(--text-lg)', fontWeight: 700, color: 'var(--color-primary)', marginBottom: 'var(--space-2)', lineHeight: 1.3 }}>
                  {s.title}
                </h3>
                <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-light)', lineHeight: 1.65, flex: 1, marginBottom: 'var(--space-5)' }}>
                  {renderBold(s.desc)}
                </p>
                <Link
                  to={`/news-awards/${s.slug}#${s.anchor}`}
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--color-primary)', textDecoration: 'none', paddingTop: 'var(--space-3)', borderTop: '1px solid var(--color-light-gray)', marginTop: 'auto' }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = 'var(--color-accent)'; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = 'var(--color-primary)'; }}
                >
                  Explore
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                    <path d="M2 6h8M6 2l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ background: 'var(--color-primary)', padding: 'var(--space-14) 0' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <div className="reveal">
            <h2 style={{ color: 'var(--color-white)', marginBottom: 'var(--space-4)' }}>
              {content.ctaHeading}
            </h2>
            <p style={{ color: 'rgba(255,255,255,0.75)', maxWidth: 500, margin: '0 auto var(--space-6)' }}>
              {content.ctaParagraph}
            </p>
            <div style={{ display: 'flex', gap: 'var(--space-4)', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link to="/apply-now" className="btn btn-accent">Apply Now</Link>
              <Link to="/differentiators" className="btn btn-secondary">Our Differentiators</Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
