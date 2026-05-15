import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { categories } from './differentiators.data';
import PageHero from '../../components/PageHero/PageHero';

export default function Differentiators() {
  useEffect(() => {
    document.title = 'Differentiators | Vishnu Womens University';
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

  const totalItems = categories.reduce((sum, c) => sum + c.items.length, 0);

  return (
    <main className="page-wrapper">
      {/* Hero */}
      <PageHero
        page="differentiators"
        defaultImage="https://images.unsplash.com/photo-1531482615713-2afd69097998?w=1920&q=80"
        defaultTitle="What Sets VWU Apart"
  defaultSubtitle="Distinctive initiatives in innovation, industry engagement, research, international outreach, and student development — all aimed at producing well-rounded women engineers."
        breadcrumb={[{ label: 'Home', to: '/' }, { label: 'Differentiators' }]}
      />

      {/* Stats bar */}
      <section style={{ background: 'var(--color-primary)', padding: 'var(--space-6) 0' }}>
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'center', gap: 'var(--space-14)', flexWrap: 'wrap' }}>
            {[
              { num: `${totalItems}+`, label: 'Unique Initiatives' },
              { num: `${categories.length}`, label: 'Focus Areas' },
              { num: '15+', label: 'Industry Partners' },
              { num: '3', label: 'International Centres' },
            ].map((s) => (
              <div key={s.label} style={{ textAlign: 'center' }}>
                <div style={{ fontFamily: 'var(--font-serif)', fontSize: '2rem', fontWeight: 900, color: 'var(--color-accent)' }}>{s.num}</div>
                <div style={{ fontSize: 'var(--text-sm)', color: 'rgba(255,255,255,0.7)' }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Quick-jump nav */}
      <section style={{ background: 'var(--color-off-white)', borderBottom: '1px solid var(--color-light-gray)', padding: 'var(--space-4) 0' }}>
        <div className="container">
          <div style={{ display: 'flex', gap: 'var(--space-3)', flexWrap: 'wrap', justifyContent: 'center' }}>
            {categories.map((cat) => (
              <a
                key={cat.id}
                href={`#${cat.id}`}
                style={{ display: 'inline-flex', alignItems: 'center', gap: 'var(--space-2)', padding: '0.4rem 1rem', borderRadius: 'var(--radius-full)', border: '1.5px solid var(--color-primary)', color: 'var(--color-primary)', fontSize: 'var(--text-sm)', fontWeight: 600, textDecoration: 'none', transition: 'all var(--transition-base)' }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = 'var(--color-primary)'; (e.currentTarget as HTMLElement).style.color = 'var(--color-white)'; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = 'transparent'; (e.currentTarget as HTMLElement).style.color = 'var(--color-primary)'; }}
              >
                <span>{cat.icon}</span> {cat.label}
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Category sections */}
      {categories.map((cat, ci) => (
        <section key={cat.id} id={cat.id} className={`section ${ci % 2 === 0 ? 'bg-off-white' : 'bg-white'}`} style={{ scrollMarginTop: '100px' }}>
          <div className="container">
            <div className="reveal" style={{ marginBottom: 'var(--space-10)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', marginBottom: 'var(--space-2)' }}>
                <span style={{ fontSize: '2rem' }}>{cat.icon}</span>
                <span className="section-label" style={{ position: 'static', marginBottom: 0 }}>{cat.label}</span>
              </div>
              <h2 className="section-title">{cat.label}</h2>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 'var(--space-5)' }}>
              {cat.items.map((item, i) => (
                <div
                  key={item.slug}
                  className="reveal"
                  data-delay={`${i * 60}`}
                  style={{ background: ci % 2 === 0 ? 'var(--color-white)' : 'var(--color-off-white)', border: '1.5px solid var(--color-light-gray)', borderRadius: 'var(--radius-md)', padding: 'var(--space-5)', display: 'flex', flexDirection: 'column', transition: 'all var(--transition-base)' }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--color-accent)'; (e.currentTarget as HTMLElement).style.boxShadow = 'var(--shadow-md)'; (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)'; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--color-light-gray)'; (e.currentTarget as HTMLElement).style.boxShadow = 'none'; (e.currentTarget as HTMLElement).style.transform = 'none'; }}
                >
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--color-accent)', marginBottom: 'var(--space-3)' }} />

                  <h3 style={{ fontFamily: 'var(--font-sans)', fontSize: 'var(--text-base)', fontWeight: 700, color: 'var(--color-primary)', marginBottom: 'var(--space-2)', lineHeight: 1.35 }}>
                    {item.title}
                  </h3>

                  <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-light)', lineHeight: 1.65, flex: 1, marginBottom: 'var(--space-4)' }}>
                    {item.desc}
                  </p>

                  {/* Learn More */}
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
                      to={`/differentiators/${item.slug}`}
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
      ))}

      {/* CTA */}
      <section style={{ background: 'var(--color-primary)', padding: 'var(--space-14) 0' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <div className="reveal">
            <h2 style={{ color: 'var(--color-white)', marginBottom: 'var(--space-4)' }}>
              Experience the VWU Difference
            </h2>
            <p style={{ color: 'rgba(255,255,255,0.75)', maxWidth: 560, margin: '0 auto var(--space-6)' }}>
              Visit VWU in person to see these initiatives firsthand. Schedule a campus visit and explore the ecosystem built for India's next generation of women technologists.
            </p>
            <div style={{ display: 'flex', gap: 'var(--space-4)', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link to="/admissions" className="btn btn-accent">Apply Now</Link>
              <Link to="/campus" className="btn btn-secondary">Campus Life</Link>
              <Link to="/academics" className="btn btn-secondary">Academics</Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
