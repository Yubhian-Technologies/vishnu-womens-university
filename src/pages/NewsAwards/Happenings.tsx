import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { CalendarDays } from 'lucide-react';
import PageHero from '../../components/PageHero/PageHero';
import { useHashScroll } from '../../hooks/useHashScroll';
import { useOrderedCollection } from '../../hooks/useCollection';
import type { HappeningDoc } from '../Admin/sections/NewsAwardsDataAdmin';

export default function Happenings() {
  useHashScroll();
  const { docs: happenings } = useOrderedCollection<HappeningDoc>('happenings', 'order');

  useEffect(() => {
    document.title = 'Happenings at VWU | Vishnu Womens University';
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
        scrollCtaTargetId="happenings-content"
      />

      {/* Upcoming Events */}
      {upcoming.length > 0 && (
        <section id="happenings-content" className="section bg-white" style={{ scrollMarginTop: 'calc(var(--topbar-height) + var(--header-height) + 1rem)' }}>
          <div className="container">
            <div className="reveal" style={{ marginBottom: 'var(--space-8)' }}>
              <span className="section-label">Mark Your Calendar</span>
              <h2 className="section-title" style={{ fontSize: '1.75rem' }}>Upcoming Events</h2>
            </div>
            <div className="card-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 'var(--space-5)' }}>
              {upcoming.map((ev) => (
                <div key={ev.id}
                  style={{ background: 'var(--color-primary)', borderRadius: 'var(--radius-md)', padding: 'var(--space-6)', display: 'flex', gap: 'var(--space-4)', alignItems: 'flex-start' }}>
                  <CalendarDays size={28} strokeWidth={1.75} style={{ flexShrink: 0, color: 'var(--color-accent)' }} />
                  <div>
                    <div style={{ fontSize: 'var(--text-xs)', fontWeight: 700, color: 'var(--color-accent)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 'var(--space-1)' }}>
                      {ev.date}
                    </div>
                    <h3 style={{ fontFamily: 'var(--font-sans)', fontSize: 'var(--text-base)', fontWeight: 700, color: 'var(--color-white)', lineHeight: 1.4, marginBottom: ev.dept ? 'var(--space-2)' : 0 }}>
                      {ev.title}
                    </h3>
                    {ev.dept && (
                      <p style={{ fontSize: 'var(--text-xs)', color: 'rgba(255,255,255,0.65)', lineHeight: 1.5 }}>{ev.dept}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Recent Events — Timeline */}
      <section id={upcoming.length === 0 ? 'happenings-content' : undefined} className="section bg-off-white" style={{ scrollMarginTop: 'calc(var(--topbar-height) + var(--header-height) + 1rem)' }}>
        <div className="container">
          <div className="reveal" style={{ marginBottom: 'var(--space-8)' }}>
            <span className="section-label">Latest Updates</span>
            <h2 className="section-title" style={{ fontSize: '1.75rem' }}>Recent Events</h2>
          </div>

          <div style={{ position: 'relative', paddingLeft: '2rem' }}>
            {/* Timeline line */}
            <div style={{ position: 'absolute', left: '0.45rem', top: 0, bottom: 0, width: 2, background: 'var(--color-light-gray)' }} />

            {recent.map((ev) => (
              <div key={ev.id}
                style={{ position: 'relative', marginBottom: 'var(--space-5)' }}>
                {/* Dot */}
                <div style={{ position: 'absolute', left: '-2rem', top: '0.35rem', width: 14, height: 14, borderRadius: '50%', background: 'var(--color-accent)', border: '2.5px solid var(--color-white)', boxShadow: '0 0 0 2px var(--color-accent)' }} />

                <div style={{ background: 'var(--color-white)', border: '1.5px solid var(--color-light-gray)', borderRadius: 'var(--radius-md)', padding: 'var(--space-4) var(--space-5)' }}>
                  <div style={{ fontSize: 'var(--text-xs)', fontWeight: 700, color: 'var(--color-accent)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 'var(--space-1)' }}>
                    {ev.date}
                  </div>
                  <h3 style={{ fontFamily: 'var(--font-sans)', fontSize: 'var(--text-base)', fontWeight: 700, color: 'var(--color-primary)', lineHeight: 1.4, marginBottom: ev.dept ? 'var(--space-1)' : 0 }}>
                    {ev.title}
                  </h3>
                  {ev.dept && (
                    <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-light)', lineHeight: 1.5, marginTop: 'var(--space-1)' }}>
                      {ev.dept}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

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
