import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Building2 } from 'lucide-react';
import { placementItems } from './placements.data';
import PageHero from '../../components/PageHero/PageHero';
import { useOrderedCollection } from '../../hooks/useCollection';

interface PlacementRecord {
  id: string;
  companyName: string;
  logoUrl: string;
  year: string;
  package: string;
  studentsPlaced: number;
  sector: string;
  featured: boolean;
}

const stats = [
  { num: '1400+', label: 'Placements (2024–25)' },
  { num: '150+', label: 'Recruiting Companies' },
  { num: '59.28 LPA', label: 'Highest Package' },
  { num: '95%+', label: 'Placement Rate' },
];


export default function Placements() {
  const { docs: recruiters, loading: recruitersLoading } = useOrderedCollection<PlacementRecord>('placements', 'year', 'desc');

  useEffect(() => {
    document.title = 'Placements | Vishnu Womens University';
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
        defaultImage="https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=1920&q=80"
        defaultTitle="Placements & Careers"
  defaultSubtitle="Linking VWU graduates with the best opportunities in industry — through campus recruitment, career development, and pathways to global study."
        breadcrumb={[{ label: 'Home', to: '/' }, { label: 'Placements' }]}
        scrollCtaTargetId="placements-content"
      />

      {/* Stats bar */}
      <section id="placements-content" style={{ background: 'var(--color-primary)', padding: 'var(--space-6) 0', scrollMarginTop: 'calc(var(--topbar-height) + var(--header-height) + 1rem)' }}>
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'center', gap: 'var(--space-14)', flexWrap: 'wrap' }}>
            {stats.map((s) => (
              <div key={s.label} style={{ textAlign: 'center' }}>
                <div style={{ fontFamily: 'var(--font-serif)', fontSize: '2rem', fontWeight: 900, color: 'var(--color-accent)' }}>{s.num}</div>
                <div style={{ fontSize: 'var(--text-sm)', color: 'rgba(255,255,255,0.7)' }}>{s.label}</div>
              </div>
            ))}
          </div>
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

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 'var(--space-5)' }}>
            {placementItems.map((item, i) => (
              <div
                key={item.slug}
                className="reveal"
                data-delay={`${i * 50}`}
                style={{ background: 'var(--color-white)', border: '1.5px solid var(--color-light-gray)', borderRadius: 'var(--radius-md)', padding: 'var(--space-5)', display: 'flex', flexDirection: 'column', transition: 'all var(--transition-base)' }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--color-accent)'; (e.currentTarget as HTMLElement).style.boxShadow = 'var(--shadow-md)'; (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)'; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--color-light-gray)'; (e.currentTarget as HTMLElement).style.boxShadow = 'none'; (e.currentTarget as HTMLElement).style.transform = 'none'; }}
              >
                <div style={{ marginBottom: 'var(--space-3)' }}><item.icon size={32} strokeWidth={1.75} /></div>

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
            ))}
          </div>
        </div>
      </section>

      {/* Our Recruiters — live from the placements collection, managed in /admin */}
      {(recruitersLoading || recruiters.length > 0) && (
        <section className="section bg-white">
          <div className="container">
            <div style={{ textAlign: 'center', marginBottom: 'var(--space-10)' }}>
              <span className="section-label">Our Recruiters</span>
              <h2 className="section-title">Companies That Hire from VWU</h2>
              <p className="section-desc" style={{ margin: '0 auto' }}>
                A running record of recruiters, packages, and placements — updated each season by the Training & Placement Cell.
              </p>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 'var(--space-5)' }}>
              {recruiters.map((r) => (
                <div
                  key={r.id}
                  style={{ background: 'var(--color-white)', border: `1.5px solid ${r.featured ? 'var(--color-accent)' : 'var(--color-light-gray)'}`, borderRadius: 'var(--radius-md)', padding: 'var(--space-5)', display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                    {r.logoUrl ? (
                      <img src={r.logoUrl} alt={r.companyName} style={{ width: 44, height: 44, objectFit: 'contain', borderRadius: 'var(--radius-sm)', background: 'var(--color-off-white)', padding: 4 }} />
                    ) : (
                      <div style={{ width: 44, height: 44, borderRadius: 'var(--radius-sm)', background: 'var(--color-off-white)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <Building2 size={22} strokeWidth={1.75} style={{ color: 'var(--color-text-light)' }} />
                      </div>
                    )}
                    <div>
                      <div style={{ fontFamily: 'var(--font-sans)', fontWeight: 800, color: 'var(--color-primary)', fontSize: 'var(--text-sm)' }}>{r.companyName}</div>
                      <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-light)' }}>{r.year}</div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: 'var(--space-2)', flexWrap: 'wrap' }}>
                    {r.package && (
                      <span style={{ fontSize: '0.7rem', fontWeight: 700, background: 'rgba(201,168,76,0.12)', border: '1px solid rgba(201,168,76,0.4)', borderRadius: 'var(--radius-sm)', padding: '2px 8px', color: 'var(--color-accent)' }}>
                        {r.package}
                      </span>
                    )}
                    {r.sector && (
                      <span style={{ fontSize: '0.7rem', fontWeight: 700, background: 'var(--color-off-white)', border: '1px solid var(--color-light-gray)', borderRadius: 'var(--radius-sm)', padding: '2px 8px', color: 'var(--color-text-light)' }}>
                        {r.sector}
                      </span>
                    )}
                    {r.studentsPlaced > 0 && (
                      <span style={{ fontSize: '0.7rem', fontWeight: 700, background: 'var(--color-off-white)', border: '1px solid var(--color-light-gray)', borderRadius: 'var(--radius-sm)', padding: '2px 8px', color: 'var(--color-text-light)' }}>
                        {r.studentsPlaced} placed
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

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
              <Link to="/admissions" className="btn btn-accent">Apply Now</Link>
              <Link to="/academics" className="btn btn-secondary">Academics</Link>
              <Link to="/differentiators" className="btn btn-secondary">Our Differentiators</Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
