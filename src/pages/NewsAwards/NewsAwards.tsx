import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import PageHero from '../../components/PageHero/PageHero';

const sections = [
  {
    slug: 'happenings',
    title: 'Happenings at VWU',
    icon: '📅',
    desc: 'Stay updated with the latest events, workshops, MoUs, competitions, and campus milestones — from recent achievements to upcoming programmes.',
  },
  {
    slug: 'accreditations-awards',
    title: 'Accreditations & Awards',
    icon: '🏆',
    desc: 'VWU is recognised by NAAC, NBA, NIRF, ARIIA, IEI, ISTE, and more. Explore our full record of national rankings, quality awards, and institutional accreditations.',
  },
  {
    slug: 'gallery',
    title: 'Gallery',
    icon: '🖼️',
    desc: 'A visual archive of campus life — from national symposia, graduation days, and cultural festivals to sports championships and industry collaborations.',
  },
];

const highlights = [
  { num: '15+', label: 'National Rankings & Ratings' },
  { num: '10+', label: 'Awards & Recognitions' },
  { num: '10', label: 'Accreditations & Approvals' },
  { num: '200+', label: 'Gallery Albums (2017–2026)' },
];

export default function NewsAwards() {
  useEffect(() => {
    document.title = 'News & Awards | Vishnu Womens University';
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
        defaultImage="https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=1920&q=80"
        defaultTitle="News & Awards"
  defaultSubtitle="Celebrating VWU's achievements, events, and milestones — from national accreditations and rankings to campus happenings and visual memories."
        breadcrumb={[{ label: 'Home', to: '/' }, { label: 'News & Awards' }]}
      />

      {/* Stats bar */}
      <section style={{ background: 'var(--color-primary)', padding: 'var(--space-6) 0' }}>
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'center', gap: 'var(--space-14)', flexWrap: 'wrap' }}>
            {highlights.map((h) => (
              <div key={h.label} style={{ textAlign: 'center' }}>
                <div style={{ fontFamily: 'var(--font-serif)', fontSize: '2rem', fontWeight: 900, color: 'var(--color-accent)' }}>{h.num}</div>
                <div style={{ fontSize: 'var(--text-sm)', color: 'rgba(255,255,255,0.7)' }}>{h.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Cards */}
      <section className="section bg-off-white">
        <div className="container">
          <div className="reveal" style={{ marginBottom: 'var(--space-10)' }}>
            <span className="section-label">At a Glance</span>
            <h2 className="section-title">Explore News & Awards</h2>
            <p style={{ color: 'var(--color-text-light)', maxWidth: 600, lineHeight: 1.7 }}>
              Everything you need to know about VWU's recognition, campus life, and visual history — all in one place.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 'var(--space-6)' }}>
            {sections.map((s, i) => (
              <div
                key={s.slug}
                className="reveal"
                data-delay={`${i * 80}`}
                style={{ background: 'var(--color-white)', border: '1.5px solid var(--color-light-gray)', borderRadius: 'var(--radius-md)', padding: 'var(--space-6)', display: 'flex', flexDirection: 'column', transition: 'all var(--transition-base)' }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--color-accent)'; (e.currentTarget as HTMLElement).style.boxShadow = 'var(--shadow-md)'; (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)'; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--color-light-gray)'; (e.currentTarget as HTMLElement).style.boxShadow = 'none'; (e.currentTarget as HTMLElement).style.transform = 'none'; }}
              >
                <div style={{ fontSize: '2.5rem', marginBottom: 'var(--space-4)' }}>{s.icon}</div>
                <h3 style={{ fontFamily: 'var(--font-sans)', fontSize: 'var(--text-lg)', fontWeight: 700, color: 'var(--color-primary)', marginBottom: 'var(--space-2)', lineHeight: 1.3 }}>
                  {s.title}
                </h3>
                <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-light)', lineHeight: 1.65, flex: 1, marginBottom: 'var(--space-5)' }}>
                  {s.desc}
                </p>
                <Link
                  to={`/news-awards/${s.slug}`}
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
              Be Part of VWU's Story
            </h2>
            <p style={{ color: 'rgba(255,255,255,0.75)', maxWidth: 500, margin: '0 auto var(--space-6)' }}>
              Join a university that earns its recognition every year through student achievement, research, and institutional excellence.
            </p>
            <div style={{ display: 'flex', gap: 'var(--space-4)', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link to="/admissions" className="btn btn-accent">Apply Now</Link>
              <Link to="/differentiators" className="btn btn-secondary">Our Differentiators</Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
