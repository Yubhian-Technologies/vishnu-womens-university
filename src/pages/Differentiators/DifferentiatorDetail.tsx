import { useEffect } from 'react';
import { Link, useParams, Navigate } from 'react-router-dom';
import { findItemBySlug } from './differentiators.data';
import '../detail-layout.css';

export default function DifferentiatorDetail() {
  const { slug } = useParams<{ slug: string }>();
  const result = slug ? findItemBySlug(slug) : null;

  useEffect(() => {
    if (result) {
      document.title = `${result.item.title} | Vishnu Womens University`;
    }
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
  }, [result]);

  if (!result) return <Navigate to="/differentiators" replace />;

  const { item, category } = result;

  return (
    <main className="page-wrapper">
      {/* Hero */}
      <section className="page-hero" style={{ minHeight: 380 }}>
        <img src={category.heroImage} alt={item.title} className="page-hero-image" />
        <div className="page-hero-overlay" />
        <div className="container page-hero-content">
          <div className="breadcrumb animate-fade-in">
            <Link to="/" className="breadcrumb-item">Home</Link>
            <span className="breadcrumb-sep">›</span>
            <Link to="/differentiators" className="breadcrumb-item">Differentiators</Link>
            <span className="breadcrumb-sep">›</span>
            <Link to={`/differentiators#${category.id}`} className="breadcrumb-item">{category.label}</Link>
            <span className="breadcrumb-sep">›</span>
            <span className="breadcrumb-item active">{item.title}</span>
          </div>
          <div className="animate-fade-in-up" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'var(--color-accent)', color: 'var(--color-white)', fontSize: 'var(--text-xs)', fontWeight: 700, padding: '0.3rem 0.9rem', borderRadius: 'var(--radius-full)', marginBottom: 'var(--space-3)' }}>
            <span>{category.icon}</span> {category.label}
          </div>
          <h1 className="animate-fade-in-up">{item.title}</h1>
        </div>
      </section>

      {/* Intro */}
      <section className="section bg-white">
        <div className="container">
          <div className="detail-grid">
            {/* Main content */}
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

            {/* Sidebar: key highlights */}
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
          </div>
        </div>
      </section>

      {/* Facilities */}
      {item.facilities && item.facilities.length > 0 && (
        <section className="section bg-off-white">
          <div className="container">
            <div className="reveal" style={{ marginBottom: 'var(--space-8)' }}>
              <span className="section-label">Infrastructure</span>
              <h2 className="section-title" style={{ fontSize: '1.75rem' }}>Facilities & Equipment</h2>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 'var(--space-4)' }}>
              {item.facilities.map((f, i) => (
                <div key={f} className="reveal" data-delay={`${i * 50}`}
                  style={{ background: 'var(--color-white)', border: '1.5px solid var(--color-light-gray)', borderRadius: 'var(--radius-md)', padding: 'var(--space-4)', display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--color-accent)', flexShrink: 0 }} />
                  <span style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text)', fontWeight: 500 }}>{f}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Outcomes */}
      {item.outcomes && item.outcomes.length > 0 && (
        <section className="section bg-white">
          <div className="container">
            <div className="reveal" style={{ marginBottom: 'var(--space-8)' }}>
              <span className="section-label">Impact</span>
              <h2 className="section-title" style={{ fontSize: '1.75rem' }}>Outcomes & Achievements</h2>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 'var(--space-4)' }}>
              {item.outcomes.map((o, i) => (
                <div key={o} className="reveal" data-delay={`${i * 60}`}
                  style={{ background: 'var(--color-off-white)', border: '1.5px solid var(--color-light-gray)', borderRadius: 'var(--radius-md)', padding: 'var(--space-5)', display: 'flex', gap: 'var(--space-3)', alignItems: 'flex-start' }}>
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
              Explore More Differentiators
            </h2>
            <p style={{ color: 'rgba(255,255,255,0.75)', maxWidth: 520, margin: '0 auto var(--space-6)' }}>
              Discover all the unique initiatives, labs, and centres that make VWU an extraordinary place to learn and grow.
            </p>
            <div style={{ display: 'flex', gap: 'var(--space-4)', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link to="/differentiators" className="btn btn-accent">All Differentiators</Link>
              <Link to="/admissions" className="btn btn-secondary">Apply Now</Link>
              <Link to="/academics" className="btn btn-secondary">Academics</Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
