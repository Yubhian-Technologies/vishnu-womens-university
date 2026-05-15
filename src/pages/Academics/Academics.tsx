import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { findProgramBySlug } from './programs.data';
import './Academics.css';

const programCategories = [
  {
    id: 'btech',
    label: 'B.Tech',
    programs: [
      { icon: '💻', slug: 'cse',            name: 'Computer Science & Engineering (CSE)', desc: 'Core computer science with strong industry preparation and placement support.' },
      { icon: '🤖', slug: 'ai-ml',          name: 'CSE – Artificial Intelligence & ML', desc: 'Machine learning, deep learning, NLP, and AI-driven software development.' },
      { icon: '📊', slug: 'ai-ds',          name: 'CSE – Artificial Intelligence & Data Science', desc: 'Data analytics, big data, visualization, and intelligent systems.' },
      { icon: '🔒', slug: 'cyber-security', name: 'CSE – Cyber Security', desc: 'Network security, ethical hacking, cryptography, and digital forensics.' },
      { icon: '🌐', slug: 'it',             name: 'Information Technology (IT)', desc: 'Web technologies, cloud computing, software development, and networking.' },
      { icon: '📡', slug: 'ece',            name: 'Electronics & Communication Engineering (ECE)', desc: 'VLSI, embedded systems, signal processing, and communications.' },
      { icon: '⚡', slug: 'eee',            name: 'Electrical & Electronics Engineering (EEE)', desc: 'Power systems, renewable energy, control systems, and smart grids.' },
      { icon: '🏗️', slug: 'ce',             name: 'Civil Engineering (CE)', desc: 'Structural design, construction management, environmental engineering.' },
      { icon: '⚙️', slug: 'me',             name: 'Mechanical Engineering (ME)', desc: 'CAD/CAM, manufacturing, thermodynamics, and robotics.' },
    ],
  },
  {
    id: 'mtech',
    label: 'M.Tech',
    programs: [
      { icon: '💻', slug: 'mtech-cse',                 name: 'M.Tech – Computer Science & Engineering', desc: 'Advanced computing, algorithms, and research in computer science.' },
      { icon: '🔬', slug: 'mtech-vlsi',                name: 'M.Tech – VLSI Design', desc: 'Digital IC design, chip design, and advanced semiconductor technologies.' },
      { icon: '⚡', slug: 'mtech-power-electronics',   name: 'M.Tech – Power Electronics', desc: 'Drives, converters, power management, and energy systems.' },
      { icon: '🌐', slug: 'mtech-software-engineering', name: 'M.Tech – Software Engineering', desc: 'Advanced software design, architecture, testing, and project management.' },
    ],
  },
  {
    id: 'mba',
    label: 'MBA & Ph.D.',
    programs: [
      { icon: '💼', slug: 'mba',     name: 'Master of Business Administration (MBA)', desc: 'Business strategy, finance, marketing, HR, and entrepreneurship.' },
      { icon: '🎓', slug: 'phd-cse', name: 'Ph.D. – Computer Science & Engineering', desc: 'Doctoral research in AI, ML, data science, and computing technologies.' },
      { icon: '📡', slug: 'phd-ece', name: 'Ph.D. – Electronics & Communication', desc: 'Doctoral research in VLSI, signal processing, and communications.' },
      { icon: '⚡', slug: 'phd-eee', name: 'Ph.D. – Electrical & Electronics', desc: 'Doctoral research in power systems, smart grids, and energy engineering.' },
    ],
  },
];

const departments = [
  { icon: '💻', code: 'CSE', name: 'Computer Science & Engineering', desc: 'AI, machine learning, data structures, algorithms, cloud computing, and software engineering.', labs: '12 Labs', slug: 'cse' },
  { icon: '📡', code: 'ECE', name: 'Electronics & Communication Engineering', desc: 'VLSI design, embedded systems, signal processing, communications, and IoT.', labs: '10 Labs', slug: 'ece' },
  { icon: '🌐', code: 'IT', name: 'Information Technology', desc: 'Web technologies, networking, database systems, cybersecurity, and cloud platforms.', labs: '8 Labs', slug: 'it' },
  { icon: '⚡', code: 'EEE', name: 'Electrical & Electronics Engineering', desc: 'Power systems, control systems, electric drives, smart grid, and renewable energy.', labs: '9 Labs', slug: 'eee' },
  { icon: '⚙️', code: 'ME', name: 'Mechanical Engineering', desc: 'CAD/CAM, manufacturing, thermodynamics, fluid mechanics, and robotics.', labs: '11 Labs', slug: 'me' },
  { icon: '🏗️', code: 'CE', name: 'Civil Engineering', desc: 'Structural analysis, construction management, geotechnical engineering, and environmental engineering.', labs: '8 Labs', slug: 'ce' },
  { icon: '🤖', code: 'AI', name: 'Artificial Intelligence', desc: 'Machine learning, deep learning, NLP, computer vision, and intelligent systems design.', labs: '6 Labs', slug: 'ai-ds' },
  { icon: '📐', code: 'FE', name: 'Freshman Engineering', desc: 'Foundation year covering mathematics, physics, chemistry, and core engineering fundamentals.', labs: '4 Labs', slug: null },
  { icon: '💼', code: 'MBA', name: 'Master of Business Administration', desc: 'Business strategy, finance, marketing, human resources, and entrepreneurship.', labs: '2 Labs', slug: 'mba' },
];

const studentActivities = [
  { icon: '📻', title: 'Radio Vishnu 90.4', path: 'http://radiovishnu.com/', external: true },
  { icon: '🎬', title: 'Vishnu TV Academy', path: '/vishnu-tv-academy', external: false },
  { icon: '👥', title: 'Student Clubs', path: '/student-clubs', external: false },
  { icon: '🤝', title: 'Social Services', path: '/social-services', external: false },
  { icon: '📰', title: 'Campus Magazines', path: '/campus-magazines', external: false },
  { icon: '🎭', title: 'Arts & Culture', path: '/arts-culture', external: false },
  { icon: '🏆', title: 'Sports & Games', path: '/sports-games', external: false },
];

export default function Academics() {
  const [activeTab, setActiveTab] = useState('btech');

  useEffect(() => {
    document.title = 'Academics | Vishnu Womens University';
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

  const activeCategory = programCategories.find(c => c.id === activeTab);

  return (
    <main className="page-wrapper">
      {/* Hero */}
      <section className="page-hero">
        <img
          src="https://images.unsplash.com/photo-1498243691581-b145c3f54a5a?w=1920&q=80"
          alt="Students studying in library"
          className="page-hero-image"
        />
        <div className="page-hero-overlay" />
        <div className="container page-hero-content">
          <div className="breadcrumb animate-fade-in">
            <Link to="/" className="breadcrumb-item">Home</Link>
            <span className="breadcrumb-sep">›</span>
            <span className="breadcrumb-item active">Academics</span>
          </div>
          <h1 className="animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
            You Will Excel.
          </h1>
          <p className="animate-fade-in-up" style={{ animationDelay: '0.25s' }}>
            A comprehensive, industry-focused engineering education designed to develop
            your technical expertise, research skills, and professional leadership.
          </p>
        </div>
      </section>

      {/* Quick Stats */}
      <section style={{ background: 'var(--color-primary)', padding: 'var(--space-6) 0' }}>
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'center', gap: 'var(--space-12)', flexWrap: 'wrap' }}>
            {[
              { num: '9', label: 'B.Tech Programs' },
              { num: '1,400+', label: 'Annual Placements' },
              { num: '230+', label: 'Expert Faculty' },
              { num: '52 LPA', label: 'Highest Package' },
            ].map(s => (
              <div key={s.label} style={{ textAlign: 'center' }}>
                <div style={{ fontFamily: 'var(--font-serif)', fontSize: '2rem', fontWeight: 900, color: 'var(--color-accent)' }}>{s.num}</div>
                <div style={{ fontSize: 'var(--text-sm)', color: 'rgba(255,255,255,0.7)', fontFamily: 'var(--font-sans)' }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Programs */}
      <section className="academics-programs-section">
        <div className="container">
          <div className="reveal">
            <span className="section-label">Academic Programs</span>
            <h2 className="section-title">Explore Your Options</h2>
            <p className="section-desc" style={{ marginBottom: 'var(--space-8)' }}>
              Whether you're starting your B.Tech journey, pursuing M.Tech, or seeking doctoral research — VWU has a program built for your goals.
            </p>
          </div>

          <div className="programs-tabs">
            {programCategories.map(cat => (
              <button
                key={cat.id}
                className={`prog-tab${activeTab === cat.id ? ' active' : ''}`}
                onClick={() => setActiveTab(cat.id)}
              >
                {cat.label}
              </button>
            ))}
          </div>

          <div className="programs-grid">
            {activeCategory?.programs.map((prog) => {
              const data = findProgramBySlug(prog.slug);
              return (
                <Link
                  key={prog.name}
                  to={`/academics/${prog.slug}`}
                  className="program-card"
                >
                  <div className="program-card-icon">{prog.icon}</div>
                  <h3>{prog.name}</h3>
                  <p>{prog.desc}</p>
                  {data && (
                    <div style={{ display: 'flex', gap: 'var(--space-2)', flexWrap: 'wrap', marginTop: 'var(--space-3)' }}>
                      <span style={{ fontSize: '0.68rem', fontWeight: 700, background: 'var(--color-off-white)', border: '1px solid var(--color-light-gray)', borderRadius: 'var(--radius-sm)', padding: '2px 8px', color: 'var(--color-text-light)', fontFamily: 'var(--font-sans)', whiteSpace: 'nowrap' }}>
                        {data.intake} Seats
                      </span>
                      {data.accreditation !== '—' && (
                        <span style={{ fontSize: '0.68rem', fontWeight: 700, background: 'rgba(201,168,76,0.12)', border: '1px solid rgba(201,168,76,0.4)', borderRadius: 'var(--radius-sm)', padding: '2px 8px', color: 'var(--color-accent)', fontFamily: 'var(--font-sans)', whiteSpace: 'nowrap' }}>
                          {data.accreditation.split(' ').slice(0, 2).join(' ')}
                        </span>
                      )}
                    </div>
                  )}
                  <div className="program-card-arrow" style={{ marginTop: 'auto' }}>
                    Learn More →
                  </div>
                </Link>
              );
            })}
          </div>

          <div style={{ textAlign: 'center', marginTop: 'var(--space-8)' }}>
            <Link to="/programmes-fee-structure" className="btn btn-primary">View Full Fee Structure →</Link>
          </div>
        </div>
      </section>

      {/* Departments */}
      <section className="section bg-white">
        <div className="container">
          <div className="reveal" style={{ textAlign: 'center', marginBottom: 'var(--space-12)' }}>
            <span className="section-label">Departments</span>
            <h2 className="section-title">Academic Departments</h2>
            <p className="section-desc" style={{ margin: '0 auto' }}>
              Nine specialised departments bringing together expert faculty, state-of-the-art laboratories, and industry-aligned curricula.
            </p>
          </div>
          <div className="dept-grid">
            {departments.map((d, i) => {
              const inner = (
                <>
                  <div className="dept-card-top">
                    <span className="dept-icon">{d.icon}</span>
                    <span className="dept-code">{d.code}</span>
                  </div>
                  <h3 className="dept-name">{d.name}</h3>
                  <p className="dept-desc">{d.desc}</p>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 'auto' }}>
                    <div className="dept-labs">{d.labs}</div>
                    {d.slug && <span style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--color-accent)', fontFamily: 'var(--font-sans)' }}>View →</span>}
                  </div>
                </>
              );
              return d.slug ? (
                <Link key={d.code} to={`/academics/${d.slug}`} className="dept-card reveal" data-delay={`${i * 50}`} style={{ textDecoration: 'none' }}>
                  {inner}
                </Link>
              ) : (
                <div key={d.code} className="dept-card reveal" data-delay={`${i * 50}`}>
                  {inner}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Student Activities — compact hub */}
      <section className="section bg-off-white">
        <div className="container">
          <div className="reveal" style={{ textAlign: 'center', marginBottom: 'var(--space-10)' }}>
            <span className="section-label">Student Life</span>
            <h2 className="section-title">Beyond the Classroom</h2>
            <p className="section-desc" style={{ margin: '0 auto var(--space-8)' }}>
              From running a community radio station to competing in inter-collegiate sports — life at VWU goes far beyond lectures.
            </p>
          </div>
          <div className="activities-grid">
            {studentActivities.map((act, i) => (
              act.external
                ? (
                  <a
                    key={act.title}
                    href={act.path}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="activity-item-card reveal"
                    data-delay={`${i * 60}`}
                    style={{ textDecoration: 'none' }}
                  >
                    <div className="activity-item-icon">{act.icon}</div>
                    <h3 className="activity-item-title">{act.title}</h3>
                    <span style={{ marginTop: 'auto', fontSize: 'var(--text-xs)', fontWeight: 700, color: 'var(--color-accent)', textTransform: 'uppercase', letterSpacing: '0.05em', fontFamily: 'var(--font-sans)' }}>Explore →</span>
                  </a>
                ) : (
                  <Link
                    key={act.title}
                    to={act.path}
                    className="activity-item-card reveal"
                    data-delay={`${i * 60}`}
                    style={{ textDecoration: 'none' }}
                  >
                    <div className="activity-item-icon">{act.icon}</div>
                    <h3 className="activity-item-title">{act.title}</h3>
                    <span style={{ marginTop: 'auto', fontSize: 'var(--text-xs)', fontWeight: 700, color: 'var(--color-accent)', textTransform: 'uppercase', letterSpacing: '0.05em', fontFamily: 'var(--font-sans)' }}>Explore →</span>
                  </Link>
                )
            ))}
          </div>
          <div style={{ textAlign: 'center', marginTop: 'var(--space-8)' }}>
            <Link to="/student-life" className="btn btn-primary">Full Student Life Experience →</Link>
          </div>
        </div>
      </section>

      {/* Placements — stats only, links to ResultAnalysis */}
      <section className="section bg-white">
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-12)', alignItems: 'center' }}>
            <div className="reveal-left">
              <span className="section-label">Career Outcomes</span>
              <h2 className="section-title">Where VWU Engineers Go</h2>
              <p style={{ color: 'var(--color-text-light)', lineHeight: 1.8, marginBottom: 'var(--space-6)' }}>
                Our Training & Placement Cell works year-round connecting students with India's top employers — Amazon, TCS, Infosys, Wipro, HCL, Cognizant, and 150+ more.
              </p>
              <Link to="/result-analysis" className="btn btn-primary">View Result Analysis →</Link>
            </div>
            <div className="reveal-right">
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
                {[
                  { value: '1,400+', label: 'Students Placed (2024–25)' },
                  { value: '52 LPA', label: 'Highest Package' },
                  { value: '6.2 LPA', label: 'Average Package' },
                  { value: '150+', label: 'Recruiting Companies' },
                ].map(s => (
                  <div key={s.label} style={{ background: 'var(--color-off-white)', border: '1.5px solid var(--color-light-gray)', borderRadius: 'var(--radius-md)', padding: 'var(--space-5)', borderLeft: '4px solid var(--color-accent)', textAlign: 'center' }}>
                    <div style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(1.2rem, 2.5vw, 1.8rem)', fontWeight: 900, color: 'var(--color-primary)' }}>{s.value}</div>
                    <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-light)', fontFamily: 'var(--font-sans)', marginTop: 4 }}>{s.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section" style={{ background: 'var(--color-primary)' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <div className="reveal">
            <span className="section-label" style={{ color: 'var(--color-accent)' }}>Get Started</span>
            <h2 className="section-title" style={{ color: 'var(--color-white)' }}>Ready to Join VWU?</h2>
            <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: 'var(--text-lg)', maxWidth: 560, margin: '0 auto var(--space-8)' }}>
              Visit our campus, request more information, or apply today through EAPCET (Code: VISW).
            </p>
            <div style={{ display: 'flex', gap: 'var(--space-4)', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link to="/admissions" className="btn btn-accent btn-lg">Apply via EAPCET</Link>
              <Link to="/admission-procedure" className="btn btn-secondary btn-lg">Admission Procedure</Link>
              <Link to="/programmes-fee-structure" className="btn btn-secondary btn-lg">Fee Structure</Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
