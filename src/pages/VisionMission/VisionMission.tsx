import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import './VisionMission.css';
import PageHero from '../../components/PageHero/PageHero';

const missionPoints = [
  'To achieve Academic excellence through innovative learning practices',
  'To instil self confidence among rural women students by supplementing with co-curricular and extra-curricular activities',
  'To inculcate discipline and values among rural women students',
  'To establish centers for Institute Industry partnership',
  'To extend financial assistance for the economically weaker sections',
  'To create self employment opportunities and skill up gradation',
  'To support environment friendly Green Practices',
  'Creating innovation hubs',
];

const values = [
  { icon: '🏆', title: 'Excellence', desc: 'Pursuing the highest standards in academic programs, faculty, and research outcomes.' },
  { icon: '💡', title: 'Innovation', desc: 'Fostering creativity, entrepreneurship, and technology-driven problem solving.' },
  { icon: '🤝', title: 'Integrity', desc: 'Upholding honesty, transparency, and ethical conduct in all endeavours.' },
  { icon: '♀️', title: 'Empowerment', desc: 'Strengthening women through education, confidence, and leadership development.' },
  { icon: '🔬', title: 'Research', desc: 'Advancing knowledge through funded projects, publications, and innovation.' },
  { icon: '🌿', title: 'Service', desc: 'Contributing to community, environment, and society through meaningful action.' },
];

const qualityPolicy = [
  'We strive for excellence in all that we do in order to model success for our students',
  'We focus on students\' success and satisfaction and meeting the needs of the community',
  'We take pride in the quality of our organization and work, and we value originality, integrity, consistency, and attention to detail',
  'We stay abreast of ever-changing youth culture, emerging communication technologies and design trends',
  'We set benchmarks and model high quality standards for students, faculty, staff, and community partners',
  'We lay utmost importance on discipline, punctuality, personal values and healthy practices',
  'We create an innovative environment for students and staff to develop an integrated personality',
  'Inclusive community projects',
];

export default function VisionMission() {
  useEffect(() => {
    document.title = 'Vision, Mission & Values | VWU';
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
    document.querySelectorAll('.reveal, .reveal-left, .reveal-right').forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <main className="page-wrapper">
      {/* Hero */}
      <PageHero
        page="vision-mission"
        defaultImage="https://images.unsplash.com/photo-1562774053-701939374585?w=1920&q=80"
        defaultTitle="Vision, Mission & Values"
  defaultSubtitle="The guiding principles and purpose that drive every decision at Vishnu Womens University."
        breadcrumb={[{ label: 'Home', to: '/' }, { label: 'Discover', to: '/' }, { label: 'Vision, Mission & Values' }]}
      />

      {/* Vision */}
      <section className="section bg-white">
        <div className="container">
          <div className="vm-section reveal">
            <div className="vm-label">
              <span className="vm-bar" />
              <h2>Vision</h2>
            </div>
            <div className="vm-content">
              <div className="vm-vision-box">
                <span className="vm-quote-icon">❝</span>
                <p>
                  Transform the society through excellence in Women's Education, Community empowerment
                  and sustained Environmental protection.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission */}
      <section className="section bg-off-white">
        <div className="container">
          <div className="vm-section reveal">
            <div className="vm-label">
              <span className="vm-bar" />
              <h2>Mission</h2>
            </div>
            <div className="vm-content">
              <ul className="vm-mission-list">
                {missionPoints.map((point, i) => (
                  <li key={i} className="vm-mission-item reveal" data-delay={`${i * 60}`}>
                    <span className="vm-mission-num">{String(i + 1).padStart(2, '0')}</span>
                    <p>{point}</p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="section bg-white">
        <div className="container">
          <div className="reveal" style={{ textAlign: 'center', marginBottom: 'var(--space-12)' }}>
            <span className="section-label">Core Values</span>
            <h2 className="section-title">What We Stand For</h2>
            <p className="section-desc" style={{ margin: '0 auto' }}>
              Six core values guide every aspect of life and learning at VWU.
            </p>
          </div>
          <div className="vm-values-grid">
            {values.map((v, i) => (
              <div key={v.title} className="vm-value-card reveal" data-delay={`${i * 80}`}>
                <div className="vm-value-icon">{v.icon}</div>
                <h3>{v.title}</h3>
                <p>{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Quality Policy */}
      <section className="section" style={{ background: 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-secondary) 100%)' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-12)', alignItems: 'center' }}>
            <div className="reveal-left">
              <span className="section-label" style={{ color: 'var(--color-accent)' }}>Quality Commitment</span>
              <h2 style={{ color: 'var(--color-white)', marginBottom: 'var(--space-6)' }}>Quality Policy</h2>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                {qualityPolicy.map((p, i) => (
                  <li key={i} style={{ display: 'flex', gap: 'var(--space-3)', alignItems: 'flex-start' }}>
                    <span style={{ color: 'var(--color-accent)', fontWeight: 900, fontSize: '1.1rem', flexShrink: 0 }}>✓</span>
                    <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: 'var(--text-sm)', lineHeight: 1.7 }}>{p}</p>
                  </li>
                ))}
              </ul>
            </div>
            <div className="reveal-right">
              <img
                src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=900&q=80"
                alt="VWU quality education"
                style={{ width: '100%', height: '400px', objectFit: 'cover', borderRadius: 'var(--radius-lg)' }}
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Discover sidebar links */}
      <section className="section bg-off-white">
        <div className="container">
          <div className="vm-discover-row">
            {[
              { title: 'About VWU', path: '/about', icon: '🏛️' },
              { title: 'Governance', path: '/governance', icon: '📋' },
              { title: 'About SVES', path: '/about-sves', icon: '🌿' },
              { title: 'Campus Life', path: '/campus', icon: '🏫' },
            ].map(l => (
              <Link to={l.path} key={l.title} className="vm-discover-link">
                <span>{l.icon}</span>
                <span>{l.title}</span>
                <span style={{ marginLeft: 'auto', color: 'var(--color-accent)' }}>→</span>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
