import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import './AboutSVES.css';

const campuses = [
  {
    name: 'Green Meadows Campus',
    location: 'Bhimavaram, West Godavari',
    institutions: [
      'Shri Vishnu Engineering College for Women (VWU)',
      'Vishnu Institute of Technology',
      'Smt. B Seetha Polytechnic',
      'Vishnu Dental College & Hospital',
      'Shri Vishnu College of Pharmacy',
      'B. V. Raju College',
      'Vishnu School, Bhimavaram',
    ],
  },
  {
    name: 'Orchard Park',
    location: 'Narsapur, West Godavari',
    institutions: [
      'B V Raju Institute of Technology (BVRIT)',
      'Vishnu Institute of Pharmaceutical Education and Research',
      'Vishnu High School, Narsapur',
    ],
  },
  {
    name: 'Valley Vista',
    location: 'Hyderabad',
    institutions: [
      'BVRIT Hyderabad College of Engineering for Women',
    ],
  },
  {
    name: 'Lake View',
    location: 'Medak',
    institutions: [
      'Vishnu Educational Development and Innovation Centre (VEDIC)',
    ],
  },
];

const svesStats = [
  { value: '20+', label: 'Institutions' },
  { value: '50,000+', label: 'Students' },
  { value: '3,000+', label: 'Faculty & Staff' },
  { value: '4', label: 'Campuses' },
  { value: '25+', label: 'Years of Service' },
  { value: 'AP & TS', label: 'States' },
];

const milestones = [
  { year: '1999', event: 'Sri Vishnu Educational Society founded by Dr. B. V. Raju in Bhimavaram, Andhra Pradesh.' },
  { year: '2001', event: 'Vishnu Womens University (then SVECW) established as the first women\'s engineering college in the region.' },
  { year: '2005', event: 'Vishnu Institute of Technology established at Bhimavaram, expanding the SVES engineering portfolio.' },
  { year: '2010', event: 'BVRIT established at Narsapur, growing the SVES footprint to West Godavari district.' },
  { year: '2015', event: 'BVRIT Hyderabad College of Engineering for Women inaugurated, marking SVES\'s expansion to Telangana.' },
  { year: '2020', event: 'VEDIC (Vishnu Educational Development & Innovation Centre) established to promote innovation and research.' },
  { year: '2024', event: 'VWU achieves record 1,400+ placements and gains recognition as a premier women\'s technical institution.' },
];

export default function AboutSVES() {
  useEffect(() => {
    document.title = 'About SVES | VWU';
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
      <section className="page-hero" style={{ minHeight: 340 }}>
        <img src="https://images.unsplash.com/photo-1523580494863-6f3031224c94?w=1920&q=80" alt="SVES campus" className="page-hero-image" />
        <div className="page-hero-overlay" />
        <div className="container page-hero-content">
          <div className="breadcrumb animate-fade-in">
            <Link to="/" className="breadcrumb-item">Home</Link>
            <span className="breadcrumb-sep">›</span>
            <Link to="/about" className="breadcrumb-item">Discover</Link>
            <span className="breadcrumb-sep">›</span>
            <span className="breadcrumb-item active">About SVES</span>
          </div>
          <h1 className="animate-fade-in-up">Sri Vishnu Educational Society</h1>
          <p className="animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            A legacy of educational excellence spanning 25+ years and 20+ institutions across Andhra Pradesh and Telangana.
          </p>
        </div>
      </section>

      {/* Stats */}
      <section style={{ background: 'var(--color-primary)', padding: 'var(--space-8) 0' }}>
        <div className="container">
          <div className="sves-stats-bar">
            {svesStats.map(s => (
              <div key={s.label} className="sves-stat">
                <div className="sves-stat-value">{s.value}</div>
                <div className="sves-stat-label">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About */}
      <section className="section bg-off-white">
        <div className="container">
          <div className="about-mission-grid">
            <div className="reveal-left">
              <span className="section-label">Our Parent Society</span>
              <h2 className="section-title">About Sri Vishnu Educational Society</h2>
              <div className="divider" />
              <p style={{ lineHeight: 1.8, marginBottom: 'var(--space-4)', color: 'var(--color-text-light)' }}>
                The <strong>Sri Vishnu Educational Society (SVES)</strong> stands first among its counterparts for its
                unending quest and diligence in shaping an ideal educational society. It was founded by the late
                <strong> Padma Bhushan Dr. B. V. Raju</strong>, a foresighted visionary who established numerous
                educational institutions dedicated to quality technical and professional education.
              </p>
              <p style={{ lineHeight: 1.8, marginBottom: 'var(--space-4)', color: 'var(--color-text-light)' }}>
                Following Dr. Raju's passing, his grandson <strong>Sri K. V. Vishnu Raju</strong> assumed the role
                of Chairman and has continued advancing the original mission while actively supporting social welfare
                initiatives. Beyond education, the <strong>Dr. B. V. Raju Foundation</strong> operates leprosy centres,
                schools, women's associations, community halls, and veterinary facilities across surrounding villages —
                all without Government assistance.
              </p>
              <p style={{ lineHeight: 1.8, color: 'var(--color-text-light)' }}>
                Today SVES operates <strong>20+ institutions</strong> across <strong>4 campuses</strong> — Green Meadows
                (Bhimavaram), Orchard Park (Narsapur), Valley Vista (Hyderabad), and Lake View (Medak) — serving over
                <strong> 50,000 students</strong> across engineering, pharmacy, dental, polytechnic, and school education.
              </p>
            </div>
            <div className="reveal-right">
              <img
                src="https://images.unsplash.com/photo-1607237138185-eedd9c632b0b?w=900&q=80"
                alt="SVES campus"
                style={{ width: '100%', height: '420px', objectFit: 'cover', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-xl)' }}
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Campuses */}
      <section className="section bg-white">
        <div className="container">
          <div className="reveal" style={{ textAlign: 'center', marginBottom: 'var(--space-12)' }}>
            <span className="section-label">SVES Campuses</span>
            <h2 className="section-title">Four World-Class Campuses</h2>
          </div>
          <div className="sves-campuses-grid">
            {campuses.map((campus, i) => (
              <div key={campus.name} className="sves-campus-card reveal" data-delay={`${i * 100}`}>
                <div className="sves-campus-header">
                  <h3>{campus.name}</h3>
                  <span className="sves-campus-location">📍 {campus.location}</span>
                </div>
                <ul className="sves-campus-list">
                  {campus.institutions.map(inst => (
                    <li key={inst}>
                      <span>›</span>
                      <span>{inst}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Milestones */}
      <section className="section" style={{ background: 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-secondary) 100%)' }}>
        <div className="container">
          <div className="reveal" style={{ textAlign: 'center', marginBottom: 'var(--space-12)' }}>
            <span className="section-label" style={{ color: 'var(--color-accent)' }}>Journey</span>
            <h2 className="section-title" style={{ color: 'var(--color-white)' }}>25+ Years of SVES Excellence</h2>
          </div>
          <div className="sves-milestones">
            {milestones.map((m, i) => (
              <div key={m.year} className="sves-milestone reveal" data-delay={`${i * 80}`}>
                <div className="sves-milestone-year">{m.year}</div>
                <div className="sves-milestone-dot" />
                <div className="sves-milestone-text">{m.event}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Navigation */}
      <section style={{ background: 'var(--color-primary)', padding: 'var(--space-12) 0' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <div className="reveal">
            <h2 style={{ color: 'var(--color-white)', marginBottom: 'var(--space-6)' }}>Explore More</h2>
            <div style={{ display: 'flex', gap: 'var(--space-4)', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link to="/about" className="btn btn-accent">About VWU</Link>
              <Link to="/vision-mission" className="btn btn-secondary">Vision & Mission</Link>
              <Link to="/governance" className="btn btn-secondary">Governance</Link>
              <Link to="/admissions" className="btn btn-secondary">Apply Now</Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
