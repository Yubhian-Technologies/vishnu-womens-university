import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import './About.css';

const quickStats = [
  { value: '2001', label: 'Established' },
  { value: '100 Acres', label: 'Campus Area' },
  { value: '13,100+', label: 'Graduates' },
  { value: '230+', label: 'Expert Faculty' },
  { value: '1,400+', label: 'Annual Placements' },
  { value: '9', label: 'Departments' },
  { value: '52 LPA', label: 'Highest Package' },
  { value: 'JNTUK', label: 'Affiliated To' },
];

const btechPrograms = [
  { icon: '💻', name: 'Computer Science & Engineering (CSE)' },
  { icon: '🤖', name: 'CSE – Artificial Intelligence & ML' },
  { icon: '📊', name: 'CSE – Artificial Intelligence & Data Science' },
  { icon: '🔒', name: 'CSE – Cyber Security' },
  { icon: '🌐', name: 'Information Technology (IT)' },
  { icon: '📡', name: 'Electronics & Communication Engineering (ECE)' },
  { icon: '⚡', name: 'Electrical & Electronics Engineering (EEE)' },
  { icon: '🏗️', name: 'Civil Engineering (CE)' },
  { icon: '⚙️', name: 'Mechanical Engineering (ME)' },
];

const pgPrograms = [
  { icon: '💻', name: 'M.Tech – Computer Science & Engineering' },
  { icon: '🔬', name: 'M.Tech – VLSI Design' },
  { icon: '⚡', name: 'M.Tech – Power Electronics' },
  { icon: '🌐', name: 'M.Tech – Software Engineering' },
  { icon: '💼', name: 'Master of Business Administration (MBA)' },
  { icon: '🎓', name: 'Ph.D. – CSE / ECE / EEE' },
];

const departments = [
  { code: 'CSE', name: 'Computer Science & Engineering', icon: '💻' },
  { code: 'ECE', name: 'Electronics & Communication Engineering', icon: '📡' },
  { code: 'IT', name: 'Information Technology', icon: '🌐' },
  { code: 'EEE', name: 'Electrical & Electronics Engineering', icon: '⚡' },
  { code: 'ME', name: 'Mechanical Engineering', icon: '⚙️' },
  { code: 'CE', name: 'Civil Engineering', icon: '🏗️' },
  { code: 'AI', name: 'Artificial Intelligence', icon: '🤖' },
  { code: 'FE', name: 'Freshman Engineering', icon: '📚' },
  { code: 'MBA', name: 'Master of Business Administration', icon: '💼' },
];

const differentiators = [
  { cat: 'Innovation & Entrepreneurship', icon: '🚀', items: ['Vishnu Technology Business Incubator (TBI)', 'Vishnu Space Application Center (VSAC)', 'Science Technology & Innovation Hub (STI Hub)', 'AICTE IDEA Lab', 'Chips to Startup (C2S)', 'Institution Innovation Cell'] },
  { cat: 'Industry Partnerships', icon: '🤝', items: ['NASSCOM Embedded Systems Training', 'HCL Tech VLSI Training', 'Microchip Embedded System', 'TI-DSP Centre of Excellence', 'TalentSprint @ NSE (WISE)', 'Smart Interviews – C&DS Programme'] },
  { cat: 'Specialised Labs', icon: '🔬', items: ['AR / VR Studio', 'High Performance Computing Lab', 'Vehicle Design Lab', 'Assistive Technology Lab (ATL)', 'Concrete Canoe Laboratory', 'Dream House Construction Lab'] },
  { cat: 'International & Global', icon: '🌍', items: ['Vishnu Japan Outreach Centre (VJOC)', 'Graduate Study Abroad Center (GSAC)', 'Foreign Languages Programme', 'TEDxSVECW', 'Rural Women Technology Park', 'Vishnu School of Music'] },
];

const campusFacilities = [
  { icon: '📺', label: 'Smart Class Rooms' },
  { icon: '🔬', label: 'State-of-the-art Labs' },
  { icon: '📚', label: 'Central Library' },
  { icon: '🎭', label: 'Auditoriums' },
  { icon: '📖', label: 'Campus Book Stores' },
  { icon: '📶', label: 'Wi-Fi Campus' },
  { icon: '🏠', label: 'Campus Hostels' },
  { icon: '🍽️', label: 'Food Courts' },
  { icon: '💪', label: 'VISHNU Fitness Centre' },
  { icon: '🏊', label: 'Swimming Pool' },
  { icon: '🏥', label: 'Health Care' },
  { icon: '🔐', label: 'Campus Security' },
];

const svesGroup = [
  'Vishnu Institute of Technology',
  'Vishnu Dental College & Hospital',
  'Shri Vishnu College of Pharmacy',
  'B. V. Raju College',
  'Smt. B Seetha Polytechnic',
  'BVRIT Hyderabad College of Engineering for Women',
  'B V Raju Institute of Technology',
  'Vishnu Educational Development & Innovation Centre (VEDIC)',
];

export default function About() {
  useEffect(() => {
    document.title = 'About VWU | Vishnu Womens University';
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
    document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale').forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <main className="page-wrapper">
      {/* Hero */}
      <section className="page-hero">
        <img src="https://images.unsplash.com/photo-1562774053-701939374585?w=1920&q=80" alt="VWU campus" className="page-hero-image" />
        <div className="page-hero-overlay" />
        <div className="container page-hero-content">
          <div className="breadcrumb animate-fade-in">
            <Link to="/" className="breadcrumb-item">Home</Link>
            <span className="breadcrumb-sep">›</span>
            <span className="breadcrumb-item">Discover</span>
            <span className="breadcrumb-sep">›</span>
            <span className="breadcrumb-item active">About VWU</span>
          </div>
          <h1 className="animate-fade-in-up">About Vishnu Womens University</h1>
          <p className="animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            Empowering women through knowledge and action — since 2001, from Bhimavaram, Andhra Pradesh.
          </p>
        </div>
      </section>

      {/* Quick Stats */}
      <section style={{ background: 'var(--color-primary)', padding: 'var(--space-8) 0' }}>
        <div className="container">
          <div className="about-facts-bar">
            {quickStats.map(s => (
              <div key={s.label} className="about-fact">
                <div className="about-fact-value">{s.value}</div>
                <div className="about-fact-label">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Overview */}
      <section className="section bg-off-white">
        <div className="container">
          <div className="about-mission-grid">
            <div className="reveal-left">
              <span className="section-label">Who We Are</span>
              <h2 className="section-title">First Private State University for Women in Telugu States</h2>
              <div className="divider" />
              <p style={{ lineHeight: 1.8, marginBottom: 'var(--space-4)', color: 'var(--color-text-light)' }}>
                Vishnu Womens University is located in Bhimavaram in Coastal Andhra Pradesh. The campus
                is situated in Vishnupur, 3 km from Bhimavaram on Tadepalligudem Road, spanning approximately
                <strong> 100 acres</strong> with a salubrious climate conducive to higher education.
              </p>
              <p style={{ lineHeight: 1.8, marginBottom: 'var(--space-4)', color: 'var(--color-text-light)' }}>
                Established under the <strong>Sri Vishnu Educational Society</strong> and affiliated to JNTUK,
                VWU holds UGC Autonomous status, NBA-DCP accreditation, AICTE approval, and NAAC recognition.
                The university maintains vibrant infrastructure with well-equipped laboratories, smart classrooms,
                drawing halls, and seminar rooms.
              </p>
              <p style={{ lineHeight: 1.8, marginBottom: 'var(--space-6)', color: 'var(--color-text-light)' }}>
                Sports facilities support physical fitness, personality development, and foster sportsmanship
                and leadership qualities. With <strong>13,100+ engineers graduated</strong> and <strong>1,400+
                annual placements</strong>, VWU is the premier destination for women's engineering education
                in the Telugu states.
              </p>
              <div style={{ display: 'flex', gap: 'var(--space-4)', flexWrap: 'wrap' }}>
                <Link to="/vision-mission" className="btn btn-primary">Vision & Mission</Link>
                <Link to="/about-sves" className="btn btn-outline">About SVES</Link>
              </div>
            </div>
            <div className="reveal-right">
              <img
                src="https://images.unsplash.com/photo-1607237138185-eedd9c632b0b?w=900&q=80"
                alt="VWU campus Bhimavaram"
                style={{ width: '100%', height: '460px', objectFit: 'cover', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-xl)' }}
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Academic Programs */}
      <section className="section bg-white">
        <div className="container">
          <div className="reveal" style={{ textAlign: 'center', marginBottom: 'var(--space-12)' }}>
            <span className="section-label">Academic Excellence</span>
            <h2 className="section-title">Programs Offered</h2>
            <p className="section-desc" style={{ margin: '0 auto' }}>
              9 B.Tech specializations, 4 M.Tech programs, MBA, and Ph.D. — all designed for the demands of tomorrow's industry.
            </p>
          </div>

          <div style={{ marginBottom: 'var(--space-10)' }}>
            <h3 className="about-sub-heading">B.Tech Programs <span style={{ color: 'var(--color-accent)', fontSize: '1rem', fontWeight: 400 }}>(9 Specializations)</span></h3>
            <div className="about-prog-grid">
              {btechPrograms.map((p, i) => (
                <div key={p.name} className="about-prog-card reveal" data-delay={`${i * 50}`}>
                  <span className="about-prog-icon">{p.icon}</span>
                  <span>{p.name}</span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="about-sub-heading">Postgraduate & Doctoral Programs</h3>
            <div className="about-prog-grid">
              {pgPrograms.map((p, i) => (
                <div key={p.name} className="about-prog-card reveal" data-delay={`${i * 50}`}>
                  <span className="about-prog-icon">{p.icon}</span>
                  <span>{p.name}</span>
                </div>
              ))}
            </div>
          </div>

          <div style={{ textAlign: 'center', marginTop: 'var(--space-10)' }}>
            <Link to="/academics" className="btn btn-primary btn-lg">Explore All Programs</Link>
          </div>
        </div>
      </section>

      {/* Departments */}
      <section className="section" style={{ background: 'var(--color-primary)' }}>
        <div className="container">
          <div className="reveal" style={{ textAlign: 'center', marginBottom: 'var(--space-10)' }}>
            <span className="section-label" style={{ color: 'var(--color-accent)' }}>Academic Departments</span>
            <h2 className="section-title" style={{ color: 'var(--color-white)' }}>9 Departments of Excellence</h2>
          </div>
          <div className="about-dept-grid">
            {departments.map((d, i) => (
              <div key={d.code} className="about-dept-card reveal" data-delay={`${i * 60}`}>
                <div className="about-dept-icon">{d.icon}</div>
                <div className="about-dept-code">{d.code}</div>
                <div className="about-dept-name">{d.name}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Differentiators */}
      <section className="section bg-off-white">
        <div className="container">
          <div className="reveal" style={{ textAlign: 'center', marginBottom: 'var(--space-12)' }}>
            <span className="section-label">What Sets Us Apart</span>
            <h2 className="section-title">30+ Differentiating Initiatives</h2>
            <p className="section-desc" style={{ margin: '0 auto' }}>
              VWU goes beyond traditional engineering education with pioneering programs in innovation,
              industry partnerships, international exposure, and community impact.
            </p>
          </div>
          <div className="about-diff-grid">
            {differentiators.map((d, i) => (
              <div key={d.cat} className="about-diff-card reveal" data-delay={`${i * 80}`}>
                <div className="about-diff-header">
                  <span className="about-diff-icon">{d.icon}</span>
                  <h3>{d.cat}</h3>
                </div>
                <ul className="about-diff-list">
                  {d.items.map(item => (
                    <li key={item}><span>›</span>{item}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Campus Facilities */}
      <section className="section bg-white">
        <div className="container">
          <div className="reveal" style={{ textAlign: 'center', marginBottom: 'var(--space-12)' }}>
            <span className="section-label">Campus Life</span>
            <h2 className="section-title">World-Class Infrastructure</h2>
            <p className="section-desc" style={{ margin: '0 auto' }}>
              A 100-acre campus in Bhimavaram designed to inspire, support, and elevate every student.
            </p>
          </div>
          <div className="about-facilities-grid">
            {campusFacilities.map((f, i) => (
              <Link to="/campus" key={f.label} className="about-facility-card reveal" data-delay={`${i * 40}`}>
                <span className="about-facility-icon">{f.icon}</span>
                <span>{f.label}</span>
              </Link>
            ))}
          </div>
          <div style={{ textAlign: 'center', marginTop: 'var(--space-8)' }}>
            <Link to="/campus" className="btn btn-primary">Explore Campus</Link>
          </div>
        </div>
      </section>

      {/* SVES Group */}
      <section className="section" style={{ background: 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-secondary) 100%)' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-12)', alignItems: 'center' }}>
            <div className="reveal-left">
              <span className="section-label" style={{ color: 'var(--color-accent)' }}>Our Parent Society</span>
              <h2 style={{ color: 'var(--color-white)', marginBottom: 'var(--space-4)' }}>Sri Vishnu Educational Society (SVES)</h2>
              <p style={{ color: 'rgba(255,255,255,0.75)', lineHeight: 1.8, marginBottom: 'var(--space-6)' }}>
                Founded by Dr. B. V. Raju, the Sri Vishnu Educational Society operates a network of premier
                educational institutions across Andhra Pradesh. VWU is the flagship women's institution in this
                celebrated group dedicated to transforming education in the Telugu states.
              </p>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 'var(--space-2)', marginBottom: 'var(--space-6)' }}>
                {svesGroup.map(inst => (
                  <li key={inst} style={{ display: 'flex', gap: 'var(--space-2)', fontSize: 'var(--text-sm)', color: 'rgba(255,255,255,0.8)', alignItems: 'center' }}>
                    <span style={{ color: 'var(--color-accent)', fontWeight: 900 }}>›</span> {inst}
                  </li>
                ))}
              </ul>
              <Link to="/about-sves" className="btn btn-accent">Learn About SVES</Link>
            </div>
            <div className="reveal-right" style={{ borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
              <img
                src="https://images.unsplash.com/photo-1523580494863-6f3031224c94?w=900&q=80"
                alt="Sri Vishnu Educational Society campus"
                style={{ width: '100%', height: '420px', objectFit: 'cover' }}
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Discover Sub-pages */}
      <section className="section bg-off-white">
        <div className="container">
          <div className="reveal" style={{ textAlign: 'center', marginBottom: 'var(--space-10)' }}>
            <span className="section-label">Discover More</span>
            <h2 className="section-title">Explore VWU in Detail</h2>
          </div>
          <div className="about-discover-grid">
            {[
              { title: 'Vision, Mission & Values', desc: 'Our guiding purpose, mission statements, and core institutional values.', path: '/vision-mission', icon: '🎯' },
              { title: 'Institutional Development Plan', desc: 'Strategic roadmap and development initiatives shaping VWU\'s future.', path: '/governance', icon: '📋' },
              { title: 'Governing Body', desc: 'Meet the governing body and core executive leaders of VWU.', path: '/governance', icon: '🏛️' },
              { title: 'About Society (SVES)', desc: 'The Sri Vishnu Educational Society — our founding parent organization.', path: '/about-sves', icon: '🌿' },
              { title: 'Campus Life', desc: 'Smart classrooms, labs, hostels, fitness, swimming pool, and more.', path: '/campus', icon: '🏫' },
              { title: 'Information', desc: 'Academic calendar, holidays, how to reach, ICT platforms, and more.', path: '/information', icon: 'ℹ️' },
            ].map((item, i) => (
              <Link to={item.path} key={item.title} className="about-discover-card reveal" data-delay={`${i * 60}`}>
                <span className="about-discover-icon">{item.icon}</span>
                <h3>{item.title}</h3>
                <p>{item.desc}</p>
                <span className="about-discover-link">Explore →</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ background: 'var(--color-primary)', padding: 'var(--space-20) 0' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <div className="reveal">
            <span className="section-label" style={{ color: 'var(--color-accent)' }}>Join the VWU Family</span>
            <h2 style={{ color: 'var(--color-white)', fontSize: 'clamp(1.75rem, 4vw, 2.75rem)', marginBottom: 'var(--space-4)' }}>
              Be Part of the VWU Story
            </h2>
            <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: 'var(--text-lg)', maxWidth: 560, margin: '0 auto var(--space-8)' }}>
              Whether you're a future student, employer, or community partner — VWU welcomes you.
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
