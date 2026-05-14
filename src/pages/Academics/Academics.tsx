import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './Academics.css';

const programCategories = [
  {
    id: 'btech',
    label: 'B.Tech',
    programs: [
      { icon: '💻', name: 'Computer Science & Engineering (CSE)', desc: 'Core computer science with strong industry preparation and placement support.' },
      { icon: '🤖', name: 'CSE – Artificial Intelligence & ML', desc: 'Machine learning, deep learning, NLP, and AI-driven software development.' },
      { icon: '📊', name: 'CSE – Artificial Intelligence & Data Science', desc: 'Data analytics, big data, visualization, and intelligent systems.' },
      { icon: '🔒', name: 'CSE – Cyber Security', desc: 'Network security, ethical hacking, cryptography, and digital forensics.' },
      { icon: '🌐', name: 'Information Technology (IT)', desc: 'Web technologies, cloud computing, software development, and networking.' },
      { icon: '📡', name: 'Electronics & Communication Engineering (ECE)', desc: 'VLSI, embedded systems, signal processing, and communications.' },
      { icon: '⚡', name: 'Electrical & Electronics Engineering (EEE)', desc: 'Power systems, renewable energy, control systems, and smart grids.' },
      { icon: '🏗️', name: 'Civil Engineering (CE)', desc: 'Structural design, construction management, environmental engineering.' },
      { icon: '⚙️', name: 'Mechanical Engineering (ME)', desc: 'CAD/CAM, manufacturing, thermodynamics, and robotics.' },
    ],
  },
  {
    id: 'mtech',
    label: 'M.Tech',
    programs: [
      { icon: '💻', name: 'M.Tech – Computer Science & Engineering', desc: 'Advanced computing, algorithms, and research in computer science.' },
      { icon: '🔬', name: 'M.Tech – VLSI Design', desc: 'Digital IC design, chip design, and advanced semiconductor technologies.' },
      { icon: '⚡', name: 'M.Tech – Power Electronics', desc: 'Drives, converters, power management, and energy systems.' },
      { icon: '🌐', name: 'M.Tech – Software Engineering', desc: 'Advanced software design, architecture, testing, and project management.' },
    ],
  },
  {
    id: 'mba',
    label: 'MBA & Ph.D.',
    programs: [
      { icon: '💼', name: 'Master of Business Administration (MBA)', desc: 'Business strategy, finance, marketing, HR, and entrepreneurship.' },
      { icon: '🎓', name: 'Ph.D. – Computer Science & Engineering', desc: 'Doctoral research in AI, ML, data science, and computing technologies.' },
      { icon: '📡', name: 'Ph.D. – Electronics & Communication', desc: 'Doctoral research in VLSI, signal processing, and communications.' },
      { icon: '⚡', name: 'Ph.D. – Electrical & Electronics', desc: 'Doctoral research in power systems, smart grids, and energy engineering.' },
    ],
  },
];

const specialPrograms = [
  {
    title: 'Assistive Technology Lab (ATL)',
    desc: 'A pioneering lab dedicated to developing assistive technologies for persons with disabilities, fostering inclusive innovation at VWU.',
    image: 'https://images.unsplash.com/photo-1523580494863-6f3031224c94?w=800&q=80',
    alt: 'Students in Assistive Technology Lab',
  },
  {
    title: 'Rural Women Technology Park',
    desc: 'Empowering rural women through technology training and skill development programs, bridging the digital divide in Andhra Pradesh.',
    image: 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=800&q=80',
    alt: 'Rural Women Technology Park at VWU',
  },
  {
    title: 'Vishnu Japan Outreach Centre',
    desc: 'A unique international collaboration center facilitating cultural exchange, research partnerships, and global exposure for students.',
    image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&q=80',
    alt: 'Vishnu Japan Outreach Centre',
  },
  {
    title: 'Technology Business Incubator',
    desc: 'Supporting student and faculty startups with mentoring, funding, and industry connections to turn innovative ideas into businesses.',
    image: 'https://images.unsplash.com/photo-1498243691581-b145c3f54a5a?w=800&q=80',
    alt: 'VWU Technology Business Incubator',
  },
];

const topRecruiters = [
  'Amazon', 'TCS', 'Infosys', 'Wipro', 'Cognizant', 'HCL Technologies',
  'Tech Mahindra', 'Capgemini', 'Accenture', 'IBM', 'Microsoft', 'Deloitte',
  'Hexaware', 'Mphasis', 'L&T Infotech', 'Mindtree',
];

const placementStats = [
  { value: '1,400+', label: 'Students Placed (2024–25)' },
  { value: '52 LPA', label: 'Highest Package' },
  { value: '6.2 LPA', label: 'Average Package' },
  { value: '150+', label: 'Recruiting Companies' },
];

const supportItems = [
  { icon: '📖', title: 'Central Library', desc: 'Access thousands of engineering textbooks, research journals, digital databases, and comfortable study spaces.' },
  { icon: '🎯', title: 'Academic Advising', desc: 'Every student receives dedicated guidance from faculty advisors who help plan your academic journey and career goals.' },
  { icon: '🏢', title: 'Career Services', desc: 'From resume preparation to mock interviews and campus drives, VWU connects you with 1,400+ placement opportunities annually.' },
  { icon: '🚀', title: 'AR/VR Studio', desc: 'Cutting-edge augmented and virtual reality facilities for immersive learning, research, and prototyping.' },
  { icon: '🛸', title: 'Space Application Center', desc: 'A specialized center for research in satellite technologies, remote sensing, and space applications.' },
  { icon: '🌍', title: 'TalentSprint @ NSE', desc: 'Industry-partnered programs with NSE through TalentSprint, providing students with financial technology and advanced training.' },
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
            {activeCategory?.programs.map((prog) => (
              <Link
                key={prog.name}
                to="/academics"
                className="program-card"
              >
                <div className="program-card-icon">{prog.icon}</div>
                <h3>{prog.name}</h3>
                <p>{prog.desc}</p>
                <div className="program-card-arrow">
                  Learn More →
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Special Programs */}
      <section className="special-programs-section">
        <div className="container">
          <div className="reveal" style={{ textAlign: 'center', marginBottom: 0 }}>
            <span className="section-label">Signature Programs</span>
            <h2 className="section-title">What Sets VWU Apart</h2>
          </div>
          <div className="special-grid">
            {specialPrograms.map((sp, i) => (
              <div key={sp.title} className={`special-card reveal${i % 2 === 0 ? '-left' : '-right'}`} data-delay={`${i * 100}`}>
                <img src={sp.image} alt={sp.alt} className="special-card-bg" loading="lazy" />
                <div className="special-card-overlay" />
                <div className="special-card-content">
                  <h3>{sp.title}</h3>
                  <p>{sp.desc}</p>
                  <Link to="/academics" className="btn btn-accent" style={{ fontSize: '0.75rem' }}>Learn More</Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Academic Support */}
      <section className="academic-support-section">
        <div className="container">
          <div className="reveal" style={{ textAlign: 'center', marginBottom: 0 }}>
            <span className="section-label" style={{ color: 'var(--color-accent)' }}>Resources</span>
            <h2 className="section-title" style={{ color: 'var(--color-white)' }}>
              Resources to Fuel Your Success
            </h2>
          </div>
          <div className="support-grid">
            {supportItems.map((item, i) => (
              <div key={item.title} className="support-card reveal" data-delay={`${i * 80}`}>
                <div className="support-card-icon">{item.icon}</div>
                <h3>{item.title}</h3>
                <p>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Placements */}
      <section className="section bg-off-white">
        <div className="container">
          <div className="reveal" style={{ textAlign: 'center', marginBottom: 'var(--space-10)' }}>
            <span className="section-label">Career Outcomes</span>
            <h2 className="section-title">Where VWU Engineers Go</h2>
            <p className="section-desc" style={{ margin: '0 auto' }}>
              Our Training & Placement Cell works year-round to connect students with India's top employers.
            </p>
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 'var(--space-8)', flexWrap: 'wrap', marginBottom: 'var(--space-12)' }}>
            {placementStats.map((s, i) => (
              <div key={s.label} className="reveal" data-delay={`${i * 80}`} style={{ textAlign: 'center' }}>
                <div style={{ fontFamily: 'var(--font-serif)', fontSize: '2.2rem', fontWeight: 900, color: 'var(--color-primary)' }}>{s.value}</div>
                <div style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-light)', fontFamily: 'var(--font-sans)', marginTop: 'var(--space-1)' }}>{s.label}</div>
              </div>
            ))}
          </div>
          <div className="reveal" style={{ marginBottom: 'var(--space-6)' }}>
            <h3 style={{ fontFamily: 'var(--font-sans)', fontSize: 'var(--text-sm)', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--color-text-light)', marginBottom: 'var(--space-5)' }}>
              Top Recruiting Companies
            </h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-3)' }}>
              {topRecruiters.map((r) => (
                <span key={r} style={{ background: 'var(--color-white)', border: '1px solid var(--color-light-gray)', borderRadius: 'var(--radius-sm)', padding: '0.4rem 1rem', fontSize: 'var(--text-sm)', fontFamily: 'var(--font-sans)', fontWeight: 600, color: 'var(--color-primary)', boxShadow: 'var(--shadow-sm)' }}>
                  {r}
                </span>
              ))}
            </div>
          </div>
          <div style={{ textAlign: 'center', marginTop: 'var(--space-8)' }}>
            <Link to="/admissions" className="btn btn-primary btn-lg">Explore Career Services</Link>
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
              <Link to="/admissions" className="btn btn-secondary btn-lg">Schedule a Visit</Link>
              <Link to="/admissions" className="btn btn-secondary btn-lg">Request Info</Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
