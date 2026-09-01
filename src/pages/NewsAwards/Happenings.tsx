import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { CalendarDays } from 'lucide-react';
import PageHero from '../../components/PageHero/PageHero';
import NewsCard, { type NewsArticle } from '../../components/NewsCard/NewsCard';
import NewsArticleDialog from '../../components/NewsCard/NewsArticleDialog';
import { useHashScroll } from '../../hooks/useHashScroll';
import { useOrderedCollection } from '../../hooks/useCollection';
import { happeningToArticle } from '../../lib/happenings';
import type { HappeningDoc } from '../Admin/sections/NewsAwardsDataAdmin';

export default function Happenings() {
  useHashScroll();
  const { docs: happenings } = useOrderedCollection<HappeningDoc>('happenings', 'order');
  const [activeArticle, setActiveArticle] = useState<NewsArticle | null>(null);

  useEffect(() => {
    document.title = "Happenings at VWU | Vishnu Women's University";
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

  const recent = happenings.filter(h => h.type === 'recent');
  const upcoming = happenings.filter(h => h.type === 'upcoming');

  return (
    <main className="page-wrapper">
      {/* Hero */}
      <PageHero
        page="news-awards-happenings"
        defaultTitle="Happenings at VWU"
  defaultSubtitle="Workshops, MoUs, competitions, achievements, and institutional milestones — a running record of life at VWU."
        breadcrumb={[{ label: 'Home', to: '/' }, { label: 'News & Awards', to: '/news-awards' }, { label: 'Happenings' }]}
        scrollCtaTargetId={upcoming.length > 0 ? 'upcoming-events' : 'recent-events'}
      />

      {/* Upcoming Events */}
      {upcoming.length > 0 && (
        <section id="upcoming-events" className="section bg-white" style={{ scrollMarginTop: 'calc(var(--topbar-height) + var(--header-height) + 1rem)' }}>
          <div className="container">
            <div className="reveal" style={{ marginBottom: 'var(--space-8)' }}>
              <span className="section-label">Mark Your Calendar</span>
              <h2 className="section-title" style={{ fontSize: '1.75rem' }}>Upcoming Events</h2>
            </div>
            <div className="card-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 'var(--space-5)' }}>
              {upcoming.map((ev) => (
                <div key={ev.id}
                  style={{ background: 'var(--color-primary)', borderRadius: 'var(--radius-md)', overflow: 'hidden' }}>
                  {ev.imageUrl && (
                    <img src={ev.imageUrl} alt={ev.title} style={{ width: '100%', height: 160, objectFit: 'cover', display: 'block' }} />
                  )}
                  <div style={{ padding: 'var(--space-6)', display: 'flex', gap: 'var(--space-4)', alignItems: 'flex-start' }}>
                    <CalendarDays size={28} strokeWidth={1.75} style={{ flexShrink: 0, color: 'var(--color-accent)' }} />
                    <div>
                      <div style={{ fontSize: 'var(--text-xs)', fontWeight: 700, color: 'var(--color-accent)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 'var(--space-1)' }}>
                        {ev.date}
                      </div>
                      <h3 style={{ fontFamily: 'var(--font-sans)', fontSize: 'var(--text-base)', fontWeight: 700, color: 'var(--color-white)', lineHeight: 1.4, marginBottom: (ev.dept || ev.description) ? 'var(--space-2)' : 0 }}>
                        {ev.title}
                      </h3>
                      {ev.dept && (
                        <p style={{ fontSize: 'var(--text-xs)', color: 'rgba(255,255,255,0.65)', lineHeight: 1.5, marginBottom: ev.description ? 'var(--space-2)' : 0 }}>{ev.dept}</p>
                      )}
                      {ev.description && (
                        <p style={{ fontSize: 'var(--text-sm)', color: 'rgba(255,255,255,0.85)', lineHeight: 1.6, whiteSpace: 'pre-line' }}>{ev.description}</p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Recent Events — same news-card grid as the Home page's "Latest
          from VWU" teaser (see lib/happenings.ts's happeningToArticle) so
          the full list looks like more of what that teaser already showed,
          not a differently-styled timeline. */}
      <section id="recent-events" className="section bg-off-white" style={{ scrollMarginTop: 'calc(var(--topbar-height) + var(--header-height) + 1rem)' }}>
        <div className="container">
          <div className="reveal" style={{ marginBottom: 'var(--space-8)' }}>
            <span className="section-label">Latest Updates</span>
            <h2 className="section-title" style={{ fontSize: '1.75rem' }}>Recent Events</h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 'var(--space-6)' }}>
            {recent.map((ev) => {
              const article = happeningToArticle(ev);
              return <NewsCard key={ev.id} article={article} onReadMore={() => setActiveArticle(article)} />;
            })}
            {recent.length === 0 && (
              <p style={{ color: 'var(--color-text-light)' }}>No recent happenings yet — check back soon.</p>
            )}
          </div>
        </div>
      </section>

      <NewsArticleDialog article={activeArticle} onClose={() => setActiveArticle(null)} />

      {/* CTA */}
      <section style={{ background: 'var(--color-primary)', padding: 'var(--space-14) 0' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <div className="reveal">
            <h2 style={{ color: 'var(--color-white)', marginBottom: 'var(--space-4)' }}>Explore More at VWU</h2>
            <div style={{ display: 'flex', gap: 'var(--space-4)', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link to="/news-awards/gallery" className="btn btn-accent">View Gallery</Link>
              <Link to="/news-awards/accreditations-awards" className="btn btn-secondary">Accreditations & Awards</Link>
              <Link to="/news-awards" className="btn btn-secondary">Back to News & Awards</Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
