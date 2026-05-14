import { useEffect } from 'react';
import { Link, useParams, Navigate } from 'react-router-dom';
import { findPlacementItemBySlug, TableRow } from './placements.data';
import '../detail-layout.css';

export default function PlacementDetail() {
  const { slug } = useParams<{ slug: string }>();
  const item = slug ? findPlacementItemBySlug(slug) : null;

  useEffect(() => {
    if (item) document.title = `${item.title} | Vishnu Womens University`;
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
  }, [item]);

  if (!item) return <Navigate to="/placements" replace />;

  return (
    <main className="page-wrapper">
      {/* Hero */}
      <section className="page-hero" style={{ minHeight: 360 }}>
        <img
          src="https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=1920&q=80"
          alt={item.title}
          className="page-hero-image"
        />
        <div className="page-hero-overlay" />
        <div className="container page-hero-content">
          <div className="breadcrumb animate-fade-in">
            <Link to="/" className="breadcrumb-item">Home</Link>
            <span className="breadcrumb-sep">›</span>
            <Link to="/placements" className="breadcrumb-item">Placements</Link>
            <span className="breadcrumb-sep">›</span>
            <span className="breadcrumb-item active">{item.title}</span>
          </div>
          <div className="animate-fade-in-up" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'var(--color-accent)', color: 'var(--color-white)', fontSize: 'var(--text-xs)', fontWeight: 700, padding: '0.3rem 0.9rem', borderRadius: 'var(--radius-full)', marginBottom: 'var(--space-3)' }}>
            <span>{item.icon}</span> Placements & Careers
          </div>
          <h1 className="animate-fade-in-up">{item.title}</h1>
        </div>
      </section>

      {/* Content */}
      <section className="section bg-white">
        <div className="container">
          <div className={item.highlights && item.highlights.length > 0 ? 'detail-grid' : ''}>
            {/* Main */}
            <div className="reveal">
              <span className="section-label">Overview</span>
              <h2 className="section-title" style={{ fontSize: '1.75rem' }}>About {item.title}</h2>
              {item.intro ? (
                <>
                  <p style={{ fontSize: 'var(--text-lg)', color: 'var(--color-text)', lineHeight: 1.75, marginBottom: 'var(--space-5)' }}>
                    {item.intro}
                  </p>
                  {item.about && (
                    <p style={{ fontSize: 'var(--text-base)', color: 'var(--color-text-light)', lineHeight: 1.75 }}>
                      {item.about}
                    </p>
                  )}
                </>
              ) : (
                <p style={{ fontSize: 'var(--text-lg)', color: 'var(--color-text)', lineHeight: 1.75 }}>
                  {item.desc}
                </p>
              )}
            </div>

            {/* Sidebar: highlights */}
            {item.highlights && item.highlights.length > 0 && (
              <div className="reveal detail-sidebar" data-delay="100">
                <div style={{ background: 'var(--color-off-white)', border: '1.5px solid var(--color-light-gray)', borderRadius: 'var(--radius-md)', padding: 'var(--space-6)', position: 'sticky', top: '110px' }}>
                  <h3 style={{ fontFamily: 'var(--font-sans)', fontSize: 'var(--text-base)', fontWeight: 700, color: 'var(--color-primary)', marginBottom: 'var(--space-4)' }}>
                    Key Highlights
                  </h3>
                  <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                    {item.highlights.map((h) => (
                      <li key={h} style={{ display: 'flex', alignItems: 'flex-start', gap: 'var(--space-2)' }}>
                        <span style={{ width: 20, height: 20, borderRadius: '50%', background: 'var(--color-accent)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 1 }}>
                          <svg width="10" height="10" viewBox="0 0 10 10" fill="none"><path d="M2 5l2.5 2.5L8 3" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                        </span>
                        <span style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text)', lineHeight: 1.5 }}>{h}</span>
                      </li>
                    ))}
                  </ul>
                  {item.partners && item.partners.length > 0 && (
                    <div style={{ marginTop: 'var(--space-5)', paddingTop: 'var(--space-4)', borderTop: '1px solid var(--color-light-gray)' }}>
                      <p style={{ fontSize: 'var(--text-xs)', fontWeight: 700, color: 'var(--color-text-light)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 'var(--space-2)' }}>Partners</p>
                      {item.partners.map((p) => (
                        <span key={p} style={{ display: 'inline-block', fontSize: 'var(--text-xs)', background: 'var(--color-primary)', color: 'var(--color-white)', padding: '0.2rem 0.6rem', borderRadius: 'var(--radius-sm)', marginRight: 'var(--space-1)', marginBottom: 'var(--space-1)' }}>{p}</span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Outcomes */}
      {item.outcomes && item.outcomes.length > 0 && (
        <section className="section bg-off-white">
          <div className="container">
            <div className="reveal" style={{ marginBottom: 'var(--space-8)' }}>
              <span className="section-label">Impact</span>
              <h2 className="section-title" style={{ fontSize: '1.75rem' }}>Outcomes & Achievements</h2>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 'var(--space-4)' }}>
              {item.outcomes.map((o, i) => (
                <div key={o} className="reveal" data-delay={`${i * 60}`}
                  style={{ background: 'var(--color-white)', border: '1.5px solid var(--color-light-gray)', borderRadius: 'var(--radius-md)', padding: 'var(--space-5)', display: 'flex', gap: 'var(--space-3)', alignItems: 'flex-start' }}>
                  <span style={{ fontSize: '1.25rem', flexShrink: 0 }}>🏆</span>
                  <span style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text)', lineHeight: 1.6 }}>{o}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Table Data */}
      {item.tableData && item.tableData.length > 0 && (
        <section className="section bg-white">
          <div className="container">
            <div className="reveal" style={{ marginBottom: 'var(--space-8)' }}>
              <span className="section-label">Data</span>
              <h2 className="section-title" style={{ fontSize: '1.75rem' }}>
                {item.slug === 'tpo-team' ? 'Team Roster' : item.slug === 'industry-liaison-offices' ? 'Regional Offices' : 'Batch-wise Statistics'}
              </h2>
            </div>
            <div className="reveal" style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 'var(--text-sm)' }}>
                <thead>
                  <tr style={{ background: 'var(--color-primary)' }}>
                    {Object.keys(item.tableData[0]).map((col) => (
                      <th key={col} style={{ padding: 'var(--space-3) var(--space-4)', textAlign: 'left', color: 'var(--color-white)', fontWeight: 700, whiteSpace: 'nowrap' }}>
                        {col}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {item.tableData.map((row: TableRow, i: number) => (
                    <tr key={i} style={{ background: i % 2 === 0 ? 'var(--color-off-white)' : 'var(--color-white)', borderBottom: '1px solid var(--color-light-gray)' }}>
                      {Object.values(row).map((val, j) => (
                        <td key={j} style={{ padding: 'var(--space-3) var(--space-4)', color: 'var(--color-text)', lineHeight: 1.5 }}>
                          {String(val)}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      )}

      {/* Partners Grid */}
      {item.partners && item.partners.length > 0 && (
        <section className="section bg-off-white">
          <div className="container">
            <div className="reveal" style={{ marginBottom: 'var(--space-8)' }}>
              <span className="section-label">Network</span>
              <h2 className="section-title" style={{ fontSize: '1.75rem' }}>Recruiting Partners</h2>
            </div>
            <div className="reveal" style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-2)' }}>
              {item.partners.map((p, i) => (
                <span key={i} style={{ display: 'inline-block', fontSize: 'var(--text-sm)', fontWeight: 600, background: 'var(--color-white)', border: '1.5px solid var(--color-light-gray)', color: 'var(--color-primary)', padding: '0.35rem 0.85rem', borderRadius: 'var(--radius-full)', lineHeight: 1.4 }}>
                  {p}
                </span>
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
              Explore More Placement Resources
            </h2>
            <div style={{ display: 'flex', gap: 'var(--space-4)', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link to="/placements" className="btn btn-accent">Back to Placements</Link>
              <Link to="/admissions" className="btn btn-secondary">Apply Now</Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
