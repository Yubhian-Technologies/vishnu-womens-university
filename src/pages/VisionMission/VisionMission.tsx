import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import './VisionMission.css';
import PageHero from '../../components/PageHero/PageHero';
import PhotoGrid from '../../components/PhotoGrid/PhotoGrid';

const inspirationPhotos = [
  { src: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&q=80', alt: 'Students collaborating', caption: 'Collaboration' },
  { src: 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=800&q=80', alt: 'Research and innovation', caption: 'Research & Innovation' },
  { src: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=800&q=80', alt: 'Sports and wellness', caption: 'Sports & Wellness' },
  { src: 'https://images.unsplash.com/photo-1519331379826-f10be5486c6f?w=800&q=80', alt: 'Green campus environment', caption: 'Green Campus' },
];

const missionPoints = [
  'To pursue academic excellence through progressive and innovative teaching practices',
  'To build self-confidence among women from rural backgrounds through co-curricular and extra-curricular engagement',
  'To nurture discipline and strong values in students from rural communities',
  'To develop centres of Institute-Industry collaboration',
  'To provide financial support to students from economically weaker sections',
  'To generate self-employment avenues and promote skill development',
  'To advance environmentally responsible green practices across the campus',
  'To establish and sustain innovation hubs that drive student entrepreneurship',
];

const values = [
  { icon: '🏆', title: 'Excellence', desc: 'Holding ourselves to the highest standards across academic programs, faculty quality, and research outcomes.' },
  { icon: '💡', title: 'Innovation', desc: 'Encouraging creative thinking, entrepreneurial initiative, and technology-driven solutions to real problems.' },
  { icon: '🤝', title: 'Integrity', desc: 'Maintaining honesty, transparency, and ethical conduct across all activities and interactions.' },
  { icon: '♀️', title: 'Empowerment', desc: 'Building women\'s confidence, capabilities, and readiness for leadership through education and opportunity.' },
  { icon: '🔬', title: 'Research', desc: 'Advancing knowledge through funded projects, scholarly publications, and applied innovation.' },
  { icon: '🌿', title: 'Service', desc: 'Making a positive and lasting contribution to community, environment, and society.' },
];

const qualityPolicy = [
  'We pursue excellence in everything we do, setting a clear example of achievement for our students',
  'We remain focused on student success and satisfaction, while responding to the broader needs of the community',
  'We take pride in the quality of our institution and its work, upholding originality, integrity, consistency, and care in all we deliver',
  'We keep pace with evolving student expectations, emerging communication technologies, and shifting design trends',
  'We define and model high-quality standards for students, faculty, staff, and community partners alike',
  'We hold discipline, punctuality, personal integrity, and healthy habits in the highest regard',
  'We foster an environment of innovation so that students and staff can grow into well-rounded individuals',
  'We actively pursue inclusive community initiatives that benefit those beyond our campus boundary',
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
  defaultSubtitle="The principles, purpose, and commitments that inform every decision and action at Vishnu Womens University."
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
              Six enduring values that shape how we teach, how we work, and how we engage with the world.
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

      {/* Campus Photos */}
      <section className="section bg-white">
        <div className="container">
          <PhotoGrid
            images={inspirationPhotos}
            label="Our Values in Action"
            title="Where Purpose Meets Practice"
            subtitle="Every corner of VWU reflects the values we stand for — in classrooms, on the field, and in the community."
            highlights={[
              'Excellence in teaching, research & outcomes',
              'Innovation through TBI, STI Hub & AICTE IDEA Lab',
              'Community service via NSS & Dr. B.V. Raju Foundation',
              'Environmental stewardship — green campus initiative',
            ]}
            columns={4}
            layout="side-text"
            showGalleryLink={false}
          />
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
