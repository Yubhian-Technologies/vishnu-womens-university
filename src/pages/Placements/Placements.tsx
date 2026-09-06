import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { BarChart3 } from 'lucide-react';
import PageHero from '../../components/PageHero/PageHero';
import { useOrderedCollection } from '../../hooks/useCollection';
import { useContentBlocks } from '../../hooks/useContentBlocks';
import { resolveContentIcon } from '../../lib/contentIcons';
import type { PlacementItemDoc } from '../Admin/sections/PlacementItemsAdmin';
import PlacementYearAccordion from './PlacementYearAccordion';

export default function Placements() {
  const { docs: placementItems } = useOrderedCollection<PlacementItemDoc>('placementItems', 'order');
  const stats = useContentBlocks('placements', 'stats');

  useEffect(() => {
    document.title = "Placements | Vishnu Women's University";
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
    // Only static, always-present elements use .reveal — the Firestore-
    // derived recruiter cards render without it (see comment in
    // ProgramDetail.tsx), so a plain mount-only observer is safe here.
    document.querySelectorAll('.reveal').forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <main className="page-wrapper">
      {/* Hero */}
      <PageHero
        page="placements"
        defaultTitle="Placements & Careers"
  defaultSubtitle="Linking VWU graduates with the best opportunities in industry — through campus recruitment, career development, and pathways to global study."
        breadcrumb={[{ label: 'Home', to: '/' }, { label: 'Placements' }]}
        scrollCtaTargetId="placements-content"
      />

      {/* Stats bar */}
      <section id="placements-content" style={{ background: 'var(--color-primary)', padding: 'var(--space-6) 0', scrollMarginTop: 'calc(var(--topbar-height) + var(--header-height) + 1rem)' }}>
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'center', gap: 'var(--space-14)', flexWrap: 'wrap' }}>
            {stats.length > 0 ? stats.map((s) => (
              <div key={s.id} style={{ textAlign: 'center' }}>
                <div style={{ fontFamily: 'var(--font-serif)', fontSize: '2rem', fontWeight: 900, color: 'var(--color-accent)' }}>{s.value}</div>
                <div style={{ fontSize: 'var(--text-sm)', color: 'rgba(255,255,255,0.7)' }}>{s.title}</div>
              </div>
            )) : (
              <div style={{ textAlign: 'center', color: 'rgba(255,255,255,0.6)', fontSize: 'var(--text-sm)' }}>
                Placement statistics will appear here once the Training & Placement Office shares its latest figures.
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Placement Statistics, Year by Year */}
      <section className="section bg-white">
        <div className="container">
          <div className="reveal" style={{ marginBottom: 'var(--space-8)' }}>
            <span className="section-label">Placement Statistics</span>
            <h2 className="section-title">Placements, Year by Year</h2>
            <p style={{ color: 'var(--color-text-light)', maxWidth: 640, lineHeight: 1.7 }}>
              A full batch-wise record of every recruiter, number of selects, and package offered — updated season by season by the Training & Placement Office.
            </p>
          </div>

          <PlacementYearAccordion />
        </div>
      </section>

      {/* Cards grid */}
      <section className="section bg-off-white">
        <div className="container">
          <div className="reveal" style={{ marginBottom: 'var(--space-10)' }}>
            <span className="section-label">Training & Placement Office</span>
            <h2 className="section-title">Explore Placements at VWU</h2>
            <p style={{ color: 'var(--color-text-light)', maxWidth: 640, lineHeight: 1.7 }}>
              Career outcomes, campus recruitment, industry partnerships, and higher education pathways — everything in one place.
            </p>
          </div>

          <div className="card-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 'var(--space-5)' }}>
            {placementItems.map((item) => {
              const Icon = resolveContentIcon(item.icon) || BarChart3;
              return (
                <div
                  key={item.slug}
                  style={{ background: 'var(--color-white)', border: '1.5px solid var(--color-light-gray)', borderRadius: 'var(--radius-md)', padding: 'var(--space-5)', display: 'flex', flexDirection: 'column', transition: 'all var(--transition-base)' }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--color-accent)'; (e.currentTarget as HTMLElement).style.boxShadow = 'var(--shadow-md)'; (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)'; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--color-light-gray)'; (e.currentTarget as HTMLElement).style.boxShadow = 'none'; (e.currentTarget as HTMLElement).style.transform = 'none'; }}
                >
                  <div style={{ marginBottom: 'var(--space-3)' }}><Icon size={32} strokeWidth={1.75} /></div>

                  <h3 style={{ fontFamily: 'var(--font-sans)', fontSize: 'var(--text-base)', fontWeight: 700, color: 'var(--color-primary)', marginBottom: 'var(--space-2)', lineHeight: 1.35 }}>
                    {item.title}
                  </h3>

                  <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-light)', lineHeight: 1.65, flex: 1, marginBottom: 'var(--space-4)' }}>
                    {item.desc}
                  </p>

                  {item.external && item.url ? (
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--color-primary)', textDecoration: 'none', paddingTop: 'var(--space-3)', borderTop: '1px solid var(--color-light-gray)', marginTop: 'auto' }}
                      onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = 'var(--color-accent)'; }}
                      onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = 'var(--color-primary)'; }}
                    >
                      Learn More
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                        <path d="M2.5 9.5l7-7M4 2.5h5.5V8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </a>
                  ) : (
                    <Link
                      to={`/placements/${item.slug}`}
                      style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--color-primary)', textDecoration: 'none', paddingTop: 'var(--space-3)', borderTop: '1px solid var(--color-light-gray)', marginTop: 'auto' }}
                      onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = 'var(--color-accent)'; }}
                      onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = 'var(--color-primary)'; }}
                    >
                      Learn More
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                        <path d="M2 6h8M6 2l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </Link>
                  )}
                </div>
              );
            })}
          </div>
          {placementItems.length === 0 && (
            <div style={{ textAlign: 'center', padding: 'var(--space-10) 1rem', color: 'var(--color-text-light)' }}>
              <BarChart3 size={28} style={{ marginBottom: 'var(--space-3)', opacity: 0.5 }} />
              <p style={{ fontSize: 'var(--text-sm)' }}>Placement resources are being updated. Check back soon.</p>
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section style={{ background: 'var(--color-primary)', padding: 'var(--space-14) 0' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <div className="reveal">
            <h2 style={{ color: 'var(--color-white)', marginBottom: 'var(--space-4)' }}>
              Start Your Career Journey at VWU
            </h2>
            <p style={{ color: 'rgba(255,255,255,0.75)', maxWidth: 520, margin: '0 auto var(--space-6)' }}>
              Join a university where academic rigour translates into real career outcomes. Apply now and take the first step toward a future you have earned.
            </p>
            <div style={{ display: 'flex', gap: 'var(--space-4)', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link to="/apply-now" className="btn btn-accent">Apply Now</Link>
              <Link to="/academics" className="btn btn-secondary">Academics</Link>
              <Link to="/differentiators" className="btn btn-secondary">Our Differentiators</Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
