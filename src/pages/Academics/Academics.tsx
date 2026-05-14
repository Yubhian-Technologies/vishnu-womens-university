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

const departments = [
  { icon: '💻', code: 'CSE', name: 'Computer Science & Engineering', desc: 'AI, machine learning, data structures, algorithms, cloud computing, and software engineering.', labs: '12 Labs' },
  { icon: '📡', code: 'ECE', name: 'Electronics & Communication Engineering', desc: 'VLSI design, embedded systems, signal processing, communications, and IoT.', labs: '10 Labs' },
  { icon: '🌐', code: 'IT', name: 'Information Technology', desc: 'Web technologies, networking, database systems, cybersecurity, and cloud platforms.', labs: '8 Labs' },
  { icon: '⚡', code: 'EEE', name: 'Electrical & Electronics Engineering', desc: 'Power systems, control systems, electric drives, smart grid, and renewable energy.', labs: '9 Labs' },
  { icon: '⚙️', code: 'ME', name: 'Mechanical Engineering', desc: 'CAD/CAM, manufacturing, thermodynamics, fluid mechanics, and robotics.', labs: '11 Labs' },
  { icon: '🏗️', code: 'CE', name: 'Civil Engineering', desc: 'Structural analysis, construction management, geotechnical engineering, and environmental engineering.', labs: '8 Labs' },
  { icon: '🤖', code: 'AI', name: 'Artificial Intelligence', desc: 'Machine learning, deep learning, NLP, computer vision, and intelligent systems design.', labs: '6 Labs' },
  { icon: '📐', code: 'FE', name: 'Freshman Engineering', desc: 'Foundation year covering mathematics, physics, chemistry, and core engineering fundamentals.', labs: '4 Labs' },
  { icon: '💼', code: 'MBA', name: 'Master of Business Administration', desc: 'Business strategy, finance, marketing, human resources, and entrepreneurship.', labs: '2 Labs' },
];

const admissionItems = [
  { icon: '📋', title: 'Programmes & Fee Structure', desc: 'Detailed information on all B.Tech, M.Tech, MBA, and Ph.D. programs with annual fee structure and intake details.', path: '/programmes-fee-structure' },
  { icon: '📝', title: 'Admission Procedure', desc: 'Step-by-step guide to applying through EAPCET (Code: VISW), document requirements, and selection process.', path: '/admission-procedure' },
  { icon: '📊', title: 'Result Analysis', desc: 'Academic performance data, pass percentages, and university rank holders across all departments and batches.', path: '/result-analysis' },
  { icon: '💳', title: 'Fee Payment Portal', desc: 'Secure online fee payment for tuition, hostel, and examination fees with multiple payment options.', path: '/admissions' },
];

const studentActivities = [
  { icon: '📻', title: 'Radio Vishnu 90.4', desc: 'The first college community radio station in Andhra Pradesh, broadcasting programs on education, culture, and local issues — run entirely by students.', path: 'http://radiovishnu.com/', external: true },
  { icon: '🎬', title: 'Vishnu TV Academy', desc: 'A student-run TV production studio where students learn filmmaking, anchoring, journalism, and digital media production.', path: '/vishnu-tv-academy', external: false },
  { icon: '👥', title: 'Student Clubs', desc: 'Technical, cultural, literary, and social clubs — including coding teams, robotics squads, debate societies, and more.', path: '/student-clubs', external: false },
  { icon: '🤝', title: 'Social Services', desc: 'NSS units and outreach programs engaging students in community development, rural welfare, and environmental initiatives.', path: '/social-services', external: false },
  { icon: '📰', title: 'Campus Magazines', desc: 'Student-published magazines covering campus news, technical writing, creative literature, and cultural events.', path: '/campus-magazines', external: false },
  { icon: '🎭', title: 'Arts & Culture', desc: 'Dance, music, drama, fine arts, and cultural festivals celebrating student creativity and diversity.', path: '/arts-culture', external: false },
  { icon: '🏆', title: 'Sports & Games', desc: 'Indoor and outdoor sports, inter-collegiate tournaments, gymnasium, and Olympic-standard swimming pool.', path: '/sports-games', external: false },
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
            {departments.map((d, i) => (
              <div key={d.code} className="dept-card reveal" data-delay={`${i * 50}`}>
                <div className="dept-card-top">
                  <span className="dept-icon">{d.icon}</span>
                  <span className="dept-code">{d.code}</span>
                </div>
                <h3 className="dept-name">{d.name}</h3>
                <p className="dept-desc">{d.desc}</p>
                <div className="dept-labs">{d.labs}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Admission */}
      <section className="section bg-off-white">
        <div className="container">
          <div className="reveal" style={{ textAlign: 'center', marginBottom: 'var(--space-12)' }}>
            <span className="section-label">Admissions</span>
            <h2 className="section-title">Join VWU — EAPCET Code: VISW</h2>
            <p className="section-desc" style={{ margin: '0 auto' }}>
              Everything you need to apply, understand the fee structure, and secure your seat at Vishnu Womens University.
            </p>
          </div>
          <div className="adm-items-grid">
            {admissionItems.map((item, i) => (
              <div key={item.title} className="adm-item-card reveal" data-delay={`${i * 80}`}>
                <div className="adm-item-icon">{item.icon}</div>
                <h3 className="adm-item-title">{item.title}</h3>
                <p className="adm-item-desc">{item.desc}</p>
                <Link to={item.path} className="adm-item-link">View Details →</Link>
              </div>
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

      {/* Student Activities */}
      <section className="section bg-off-white">
        <div className="container">
          <div className="reveal" style={{ textAlign: 'center', marginBottom: 'var(--space-12)' }}>
            <span className="section-label">Student Life</span>
            <h2 className="section-title">Student Activities</h2>
            <p className="section-desc" style={{ margin: '0 auto' }}>
              Life at VWU goes far beyond the classroom — from running a community radio station to competing in inter-collegiate sports.
            </p>
          </div>
          <div className="activities-grid">
            {studentActivities.map((act, i) => (
              <div key={act.title} className="activity-item-card reveal" data-delay={`${i * 60}`}>
                <div className="activity-item-icon">{act.icon}</div>
                <h3 className="activity-item-title">{act.title}</h3>
                <p className="activity-item-desc">{act.desc}</p>
                {act.path && (
                  act.external
                    ? <a href={act.path} target="_blank" rel="noopener noreferrer" style={{ marginTop: 'var(--space-2)', fontSize: 'var(--text-xs)', fontWeight: 700, color: 'var(--color-accent)', textDecoration: 'none', fontFamily: 'var(--font-sans)', letterSpacing: '0.05em', textTransform: 'uppercase' }}>Explore →</a>
                    : <Link to={act.path} style={{ marginTop: 'var(--space-2)', fontSize: 'var(--text-xs)', fontWeight: 700, color: 'var(--color-accent)', textDecoration: 'none', fontFamily: 'var(--font-sans)', letterSpacing: '0.05em', textTransform: 'uppercase' }}>Explore →</Link>
                )}
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
