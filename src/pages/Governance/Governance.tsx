import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { govItems, govCategories } from './governance.data';
import PageHero from '../../components/PageHero/PageHero';
import PhotoGrid from '../../components/PhotoGrid/PhotoGrid';

const govPhotos = [
  { src: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=800&q=80', alt: 'Governance and administration', caption: 'Institutional Governance' },
  { src: 'https://images.unsplash.com/photo-1544531585-9847b68c8c86?w=800&q=80', alt: 'Academic council meeting', caption: 'Academic Council' },
  { src: 'https://images.unsplash.com/photo-1523580494863-6f3031224c94?w=800&q=80', alt: 'Convocation ceremony', caption: 'Annual Convocation' },
  { src: 'https://images.unsplash.com/photo-1562774053-701939374585?w=800&q=80', alt: 'University campus', caption: 'VWU Campus' },
  { src: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&q=80', alt: 'Events and seminars', caption: 'Seminars & Events' },
  { src: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&q=80', alt: 'Faculty collaboration', caption: 'Faculty Development' },
];

export default function Governance() {
  useEffect(() => {
    document.title = 'Governance | Vishnu Womens University';
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
        page="governance"
        defaultImage="https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=1920&q=80"
        defaultTitle="Governance & Statutory Bodies"
  defaultSubtitle="Transparent, accountable governance driving academic excellence — from apex statutory bodies to quality assurance committees."
        breadcrumb={[{ label: 'Home', to: '/' }, { label: 'Governance' }]}
      />

      {/* Stats bar */}
      <section style={{ background: 'var(--color-primary)', padding: 'var(--space-6) 0' }}>
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'center', gap: 'var(--space-14)', flexWrap: 'wrap' }}>
            {[
              { num: '5', label: 'Governance Bodies' },
              { num: '13', label: 'Standing Committees' },
              { num: '8', label: 'IQAC Initiatives' },
              { num: 'NAAC', label: 'Accredited' },
            ].map(s => (
              <div key={s.label} style={{ textAlign: 'center' }}>
                <div style={{ fontFamily: 'var(--font-serif)', fontSize: '2rem', fontWeight: 900, color: 'var(--color-accent)' }}>{s.num}</div>
                <div style={{ fontSize: 'var(--text-sm)', color: 'rgba(255,255,255,0.7)' }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Quick-jump nav */}
      <div style={{ background: 'var(--color-off-white)', borderBottom: '1px solid var(--color-light-gray)', position: 'sticky', top: 'calc(var(--topbar-height) + var(--header-height))', zIndex: 10 }}>
        <div className="container" style={{ display: 'flex', gap: 0, overflowX: 'auto' }}>
          {govCategories.map(cat => (
            <a
              key={cat.key}
              href={`#${cat.key}`}
              style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', padding: 'var(--space-3) var(--space-5)', fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--color-text)', textDecoration: 'none', whiteSpace: 'nowrap', borderBottom: '3px solid transparent', transition: 'all var(--transition-fast)' }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = 'var(--color-primary)'; (e.currentTarget as HTMLElement).style.borderBottomColor = 'var(--color-accent)'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = 'var(--color-text)'; (e.currentTarget as HTMLElement).style.borderBottomColor = 'transparent'; }}
            >
              <span>{cat.icon}</span> {cat.label}
            </a>
          ))}
        </div>
      </div>

      {/* Category sections */}
      {govCategories.map((cat, ci) => {
        const items = govItems.filter(i => i.category === cat.key);
        return (
          <section
            key={cat.key}
            id={cat.key}
            className={`section ${ci % 2 === 0 ? 'bg-off-white' : 'bg-white'}`}
          >
            <div className="container">
              <div className="reveal" style={{ marginBottom: 'var(--space-10)' }}>
                <span className="section-label">{cat.icon} {cat.label}</span>
                <h2 className="section-title">{cat.label}</h2>
                <p style={{ color: 'var(--color-text-light)', maxWidth: 600, lineHeight: 1.7 }}>{cat.desc}</p>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 'var(--space-5)' }}>
                {items.map((item, i) => (
                  <div
                    key={item.slug}
                    className="reveal"
                    data-delay={`${i * 50}`}
                    style={{ background: ci % 2 === 0 ? 'var(--color-white)' : 'var(--color-off-white)', border: '1.5px solid var(--color-light-gray)', borderRadius: 'var(--radius-md)', padding: 'var(--space-5)', display: 'flex', flexDirection: 'column', transition: 'all var(--transition-base)' }}
                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--color-accent)'; (e.currentTarget as HTMLElement).style.boxShadow = 'var(--shadow-md)'; (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)'; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--color-light-gray)'; (e.currentTarget as HTMLElement).style.boxShadow = 'none'; (e.currentTarget as HTMLElement).style.transform = 'none'; }}
                  >
                    <div style={{ fontSize: '2rem', marginBottom: 'var(--space-3)' }}>{item.icon}</div>
                    <h3 style={{ fontFamily: 'var(--font-sans)', fontSize: 'var(--text-base)', fontWeight: 700, color: 'var(--color-primary)', marginBottom: 'var(--space-2)', lineHeight: 1.35 }}>
                      {item.title}
                    </h3>
                    <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-light)', lineHeight: 1.65, flex: 1, marginBottom: 'var(--space-4)' }}>
                      {item.desc}
                    </p>
                    <Link
                      to={`/governance/${item.slug}`}
                      style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--color-primary)', textDecoration: 'none', paddingTop: 'var(--space-3)', borderTop: '1px solid var(--color-light-gray)', marginTop: 'auto' }}
                      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = 'var(--color-accent)'; }}
                      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = 'var(--color-primary)'; }}
                    >
                      Learn More
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                        <path d="M2 6h8M6 2l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          </section>
        );
      })}

      {/* Institutional Photos */}
      <section className="section bg-off-white">
        <div className="container">
          <PhotoGrid
            images={govPhotos}
            label="Institutional Life"
            title="Governance in Action"
            subtitle="From council meetings to convocation, VWU's governance is built on transparency, accountability, and a commitment to excellence."
            highlights={[
              'NAAC accredited institution',
              'NBA-DCP programme accreditation',
              'UGC Autonomous status since 2014',
              'AICTE approved with NBA outcomes framework',
              'ISO-certified quality management systems',
            ]}
            columns={3}
            layout="side-text-reverse"
          />
        </div>
      </section>

      {/* CTA */}
      <section style={{ background: 'var(--color-primary)', padding: 'var(--space-14) 0' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <div className="reveal">
            <h2 style={{ color: 'var(--color-white)', marginBottom: 'var(--space-4)' }}>Learn More About VWU</h2>
            <div style={{ display: 'flex', gap: 'var(--space-4)', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link to="/about" className="btn btn-accent">About VWU</Link>
              <Link to="/vision-mission" className="btn btn-secondary">Vision & Mission</Link>
              <Link to="/about-sves" className="btn btn-secondary">About SVES</Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
