import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import './About.css';

const timeline = [
  { year: '2001', title: 'VWU Founded', desc: 'Vishnu Womens University is established by the Sri Vishnu Educational Society in Bhimavaram, Andhra Pradesh.' },
  { year: '2005', title: 'AICTE Approval', desc: 'VWU receives full approval from the All India Council for Technical Education, cementing its academic standing.' },
  { year: '2010', title: 'Campus Expansion', desc: 'Major infrastructure development transforms the campus with state-of-the-art labs, smart classrooms, and new academic blocks.' },
  { year: '2014', title: 'UGC Autonomous Status', desc: 'VWU is granted autonomous status by the University Grants Commission, enabling curriculum innovation and academic freedom.' },
  { year: '2018', title: 'Research Milestones', desc: 'VWU crosses 1,000+ research publications and establishes its Technology Business Incubator and Space Application Center.' },
  { year: '2022', title: 'NBA-DCP Accreditation', desc: 'Programs receive prestigious NBA-DCP accreditation, recognising VWU\'s commitment to quality engineering education.' },
  { year: '2025', title: 'Placement Excellence', desc: '1,150+ placements in 2024-25 with a highest package of 52 LPA, making VWU a premier destination for top recruiters.' },
];

const leadership = [
  { name: 'Dr. P. Mallikarjuna Rao', title: 'Principal', img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80' },
  { name: 'Dr. V. Kamakshi Prasad', title: 'Dean – Academics', img: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&q=80' },
  { name: 'Prof. S. Anitha', title: 'Head – CSE Department', img: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&q=80' },
  { name: 'Dr. L. Padma', title: 'Head – ECE Department', img: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&q=80' },
  { name: 'Prof. R. Sumalatha', title: 'Head – EEE Department', img: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&q=80' },
  { name: 'Dr. K. Srinivasa Rao', title: 'IQAC Coordinator', img: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&q=80' },
];

const fastFacts = [
  { label: 'Established', value: '2001' },
  { label: 'Location', value: 'Bhimavaram, AP' },
  { label: 'Graduates', value: '13,100+' },
  { label: 'Faculty', value: '230+ Experts' },
  { label: 'Annual Placements', value: '1,400+' },
  { label: 'Programs', value: '15+ Programs' },
  { label: 'Affiliation', value: 'JNTUK' },
  { label: 'Highest Package', value: '52 LPA' },
];

const accreditations = [
  { org: 'National Board of Accreditation (NBA-DCP)', scope: 'B.Tech Programs', since: '2022' },
  { org: 'National Assessment & Accreditation Council (NAAC)', scope: 'Institutional Accreditation', since: '2015' },
  { org: 'All India Council for Technical Education (AICTE)', scope: 'Technical Programs Approval', since: '2005' },
  { org: 'University Grants Commission (UGC)', scope: 'Autonomous Status', since: '2014' },
];

export default function About() {
  useEffect(() => {
    document.title = 'About VWU | Vishnu Womens University';
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const el = entry.target as HTMLElement;
            const delay = el.dataset.delay || '0';
            setTimeout(() => el.classList.add('revealed'), parseInt(delay));
            observer.unobserve(el);
          }
        });
      },
      { threshold: 0.1 }
    );
    document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale').forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <main className="page-wrapper">
      {/* Hero */}
      <section className="page-hero">
        <img
          src="https://images.unsplash.com/photo-1562774053-701939374585?w=1920&q=80"
          alt="Dakota Wesleyan University campus"
          className="page-hero-image"
        />
        <div className="page-hero-overlay" />
        <div className="container page-hero-content">
          <div className="breadcrumb animate-fade-in">
            <Link to="/" className="breadcrumb-item">Home</Link>
            <span className="breadcrumb-sep">›</span>
            <span className="breadcrumb-item active">About VWU</span>
          </div>
          <h1 className="animate-fade-in-up">Driven by Excellence</h1>
          <p className="animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            Since 2001, Vishnu Womens University has been committed
            to empowering women through world-class engineering education and research.
          </p>
        </div>
      </section>

      {/* Fast Facts */}
      <section style={{ background: 'var(--color-primary)', padding: 'var(--space-8) 0' }}>
        <div className="container">
          <div className="about-facts-bar">
            {fastFacts.map((fact) => (
              <div key={fact.label} className="about-fact">
                <div className="about-fact-value">{fact.value}</div>
                <div className="about-fact-label">{fact.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission & Values */}
      <section className="section bg-off-white">
        <div className="container">
          <div className="about-mission-grid">
            <div className="reveal-left">
              <span className="section-label">Our Foundation</span>
              <h2 className="section-title">Mission, Vision & Values</h2>
              <div className="divider" />
              <div className="about-mv-card">
                <h3>Mission</h3>
                <p>
                  VWU is committed to empowering women engineers with quality technical
                  education, fostering innovation and research, and developing graduates who
                  contribute meaningfully to society and industry.
                </p>
              </div>
              <div className="about-mv-card">
                <h3>Vision</h3>
                <p>
                  To be a globally recognized center of excellence in engineering education,
                  producing competent, ethical, and socially responsible women engineers
                  who lead technological advancement.
                </p>
              </div>
              <div className="about-values-grid">
                {['Excellence', 'Innovation', 'Integrity', 'Empowerment', 'Research', 'Service'].map(v => (
                  <div key={v} className="about-value-tag">{v}</div>
                ))}
              </div>
            </div>
            <div className="reveal-right">
              <img
                src="https://images.unsplash.com/photo-1562774053-701939374585?w=900&q=80"
                alt="DWU campus buildings"
                style={{ width: '100%', height: '450px', objectFit: 'cover', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-xl)' }}
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </section>

      {/* History Timeline */}
      <section className="section bg-white">
        <div className="container">
          <div className="reveal" style={{ textAlign: 'center', maxWidth: 600, margin: '0 auto var(--space-12)' }}>
            <span className="section-label">Our Story</span>
            <h2 className="section-title">25+ Years of Excellence</h2>
          </div>
          <div className="about-timeline">
            {timeline.map((item, i) => (
              <div key={item.year} className={`about-timeline-item ${i % 2 === 0 ? 'left' : 'right'} reveal${i % 2 === 0 ? '-left' : '-right'}`} data-delay={`${i * 80}`}>
                <div className="about-timeline-content">
                  <div className="about-timeline-year">{item.year}</div>
                  <h3>{item.title}</h3>
                  <p>{item.desc}</p>
                </div>
                <div className="about-timeline-dot" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Leadership */}
      <section className="section bg-off-white">
        <div className="container">
          <div className="reveal" style={{ textAlign: 'center', marginBottom: 'var(--space-12)' }}>
            <span className="section-label">University Leadership</span>
            <h2 className="section-title">Meet Our Leaders</h2>
          </div>
          <div className="about-leadership-grid">
            {leadership.map((person, i) => (
              <div key={person.name} className="about-leader-card reveal" data-delay={`${i * 80}`}>
                <div className="about-leader-img-wrap">
                  <img src={person.img} alt={person.name} className="about-leader-img" loading="lazy" />
                </div>
                <h3>{person.name}</h3>
                <p>{person.title}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Accreditation */}
      <section className="section bg-white">
        <div className="container">
          <div className="reveal" style={{ marginBottom: 'var(--space-10)' }}>
            <span className="section-label">Accreditation</span>
            <h2 className="section-title">Accredited for Excellence</h2>
            <p className="section-desc">
              VWU holds accreditation from leading national bodies, ensuring your degree
              is recognized nationally and by top employers across India and globally.
            </p>
          </div>
          <div className="about-accred-grid">
            {accreditations.map((a, i) => (
              <div key={a.org} className="about-accred-card reveal" data-delay={`${i * 100}`}>
                <div className="about-accred-icon">🏛️</div>
                <div>
                  <h3>{a.org}</h3>
                  <p className="about-accred-scope">{a.scope}</p>
                  <p className="about-accred-since">Accredited since {a.since}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ background: 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-secondary) 100%)', padding: 'var(--space-20) 0' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <div className="reveal">
            <span className="section-label" style={{ color: 'var(--color-accent)' }}>Join the VWU Family</span>
            <h2 style={{ color: 'var(--color-white)', fontSize: 'clamp(1.75rem, 4vw, 2.75rem)', marginBottom: 'var(--space-4)' }}>
              Be Part of the VWU Story
            </h2>
            <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: 'var(--text-lg)', maxWidth: 560, margin: '0 auto var(--space-8)' }}>
              Whether you're a future student, a prospective employer, or a community partner —
              VWU welcomes you to our thriving community of engineers and innovators.
            </p>
            <div style={{ display: 'flex', gap: 'var(--space-4)', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link to="/admissions" className="btn btn-accent btn-lg">Apply Now</Link>
              <Link to="/admissions" className="btn btn-secondary btn-lg">Visit Campus</Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
