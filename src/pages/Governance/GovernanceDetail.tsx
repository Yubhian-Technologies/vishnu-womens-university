import { useEffect } from 'react';
import { Link, useParams, Navigate } from 'react-router-dom';
import { findGovItemBySlug, GovTableRow } from './governance.data';
import '../detail-layout.css';

export default function GovernanceDetail() {
  const { slug } = useParams<{ slug: string }>();
  const item = slug ? findGovItemBySlug(slug) : null;

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

  if (!item) return <Navigate to="/governance" replace />;

  const categoryLabel =
    item.category === 'governance' ? 'Governance'
    : item.category === 'committees' ? 'Committees'
    : 'IQAC';

  return (
    <main className="page-wrapper">
      {/* Hero */}
      <section className="page-hero" style={{ minHeight: 340 }}>
        <img
          src="https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=1920&q=80"
          alt={item.title}
          className="page-hero-image"
        />
        <div className="page-hero-overlay" />
        <div className="container page-hero-content">
          <div className="breadcrumb animate-fade-in">
            <Link to="/" className="breadcrumb-item">Home</Link>
            <span className="breadcrumb-sep">›</span>
            <Link to="/governance" className="breadcrumb-item">Governance</Link>
            <span className="breadcrumb-sep">›</span>
            <span className="breadcrumb-item active">{item.title}</span>
          </div>
          <div className="animate-fade-in-up" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'var(--color-accent)', color: 'var(--color-white)', fontSize: 'var(--text-xs)', fontWeight: 700, padding: '0.3rem 0.9rem', borderRadius: 'var(--radius-full)', marginBottom: 'var(--space-3)' }}>
            <span>{item.icon}</span> {categoryLabel}
          </div>
          <h1 className="animate-fade-in-up">{item.title}</h1>
        </div>
      </section>

      {/* Overview */}
      <section className="section bg-white">
        <div className="container">
          <div className={item.highlights && item.highlights.length > 0 ? 'detail-grid' : ''}>
            <div className="reveal">
              <span className="section-label">Overview</span>
              <h2 className="section-title" style={{ fontSize: '1.75rem' }}>About {item.title}</h2>
              {item.intro && (
                <p style={{ fontSize: 'var(--text-lg)', color: 'var(--color-text)', lineHeight: 1.75, marginBottom: 'var(--space-5)' }}>
                  {item.intro}
                </p>
              )}
              {item.about && (
                <p style={{ fontSize: 'var(--text-base)', color: 'var(--color-text-light)', lineHeight: 1.75 }}>
                  {item.about}
                </p>
              )}
              {!item.intro && !item.about && (
                <p style={{ fontSize: 'var(--text-lg)', color: 'var(--color-text)', lineHeight: 1.75 }}>
                  {item.desc}
                </p>
              )}
            </div>

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
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Table */}
      {item.tableData && item.tableData.length > 0 && (
        <section className="section bg-off-white">
          <div className="container">
            <div className="reveal" style={{ marginBottom: 'var(--space-8)' }}>
              <span className="section-label">Members</span>
              <h2 className="section-title" style={{ fontSize: '1.75rem' }}>
                {item.slug === 'iqac-committee' ? 'Committee Composition' : 'Members & Composition'}
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
                  {item.tableData.map((row: GovTableRow, i: number) => (
                    <tr key={i} style={{ background: i % 2 === 0 ? 'var(--color-white)' : 'var(--color-off-white)', borderBottom: '1px solid var(--color-light-gray)' }}>
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

      {/* CTA */}
      <section style={{ background: 'var(--color-primary)', padding: 'var(--space-14) 0' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <div className="reveal">
            <h2 style={{ color: 'var(--color-white)', marginBottom: 'var(--space-4)' }}>
              Explore More Governance Resources
            </h2>
            <div style={{ display: 'flex', gap: 'var(--space-4)', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link to="/governance" className="btn btn-accent">Back to Governance</Link>
              <Link to="/about" className="btn btn-secondary">About VWU</Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
