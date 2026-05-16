import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { findProgramBySlug } from './programs.data';
import './Academics.css';
import PageHero from '../../components/PageHero/PageHero';
import PhotoGrid from '../../components/PhotoGrid/PhotoGrid';

const academicsPhotos = [
  { src: 'https://images.unsplash.com/photo-1498243691581-b145c3f54a5a?w=800&q=80', alt: 'Smart lecture halls', caption: 'Smart Lecture Halls' },
  { src: 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=800&q=80', alt: 'Specialised research labs', caption: 'Research Labs' },
  { src: 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?w=800&q=80', alt: 'Technical hackathons', caption: 'Hackathons & Projects' },
  { src: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=800&q=80', alt: 'Library resources', caption: 'Digital Library' },
  { src: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&q=80', alt: 'Group learning sessions', caption: 'Collaborative Learning' },
];

const programCategories = [
  {
    id: 'btech',
    label: 'B.Tech',
    programs: [
      { icon: '💻', slug: 'cse',            name: 'Computer Science & Engineering (CSE)', desc: 'Foundational computer science paired with practical industry preparation and strong placement support.' },
      { icon: '🤖', slug: 'ai-ml',          name: 'CSE – Artificial Intelligence & ML', desc: 'Machine learning, deep learning, NLP, and building AI-powered software systems.' },
      { icon: '📊', slug: 'ai-ds',          name: 'CSE – Artificial Intelligence & Data Science', desc: 'Data analytics, big data processing, visualization, and the design of intelligent systems.' },
      { icon: '🔒', slug: 'cyber-security', name: 'CSE – Cyber Security', desc: 'Network security, ethical hacking, cryptography, and digital forensics techniques.' },
      { icon: '🌐', slug: 'it',             name: 'Information Technology (IT)', desc: 'Web technologies, cloud platforms, software development, and network infrastructure.' },
      { icon: '📡', slug: 'ece',            name: 'Electronics & Communication Engineering (ECE)', desc: 'VLSI design, embedded systems, signal processing, and communication technologies.' },
      { icon: '⚡', slug: 'eee',            name: 'Electrical & Electronics Engineering (EEE)', desc: 'Power systems, renewable energy, control engineering, and smart grid applications.' },
      { icon: '🏗️', slug: 'ce',             name: 'Civil Engineering (CE)', desc: 'Structural design, construction project management, and environmental engineering.' },
      { icon: '⚙️', slug: 'me',             name: 'Mechanical Engineering (ME)', desc: 'CAD/CAM, manufacturing processes, thermodynamics, and robotics.' },
    ],
  },
  {
    id: 'mtech',
    label: 'M.Tech',
    programs: [
      { icon: '💻', slug: 'mtech-cse',                 name: 'M.Tech – Computer Science & Engineering', desc: 'In-depth study of advanced computing, algorithm design, and computer science research.' },
      { icon: '🔬', slug: 'mtech-vlsi',                name: 'M.Tech – VLSI Design', desc: 'Digital IC design, chip architecture, and advanced semiconductor engineering.' },
      { icon: '⚡', slug: 'mtech-power-electronics',   name: 'M.Tech – Power Electronics', desc: 'Drives, converters, power management circuits, and energy conversion systems.' },
      { icon: '🌐', slug: 'mtech-software-engineering', name: 'M.Tech – Software Engineering', desc: 'Advanced software architecture, quality assurance, testing, and project leadership.' },
    ],
  },
  {
    id: 'mba',
    label: 'MBA & Ph.D.',
    programs: [
      { icon: '💼', slug: 'mba',     name: 'Master of Business Administration (MBA)', desc: 'Business strategy, finance, marketing, human resources, and entrepreneurial thinking.' },
      { icon: '🎓', slug: 'phd-cse', name: 'Ph.D. – Computer Science & Engineering', desc: 'Doctoral-level investigation into AI, ML, data science, and computing technologies.' },
      { icon: '📡', slug: 'phd-ece', name: 'Ph.D. – Electronics & Communication', desc: 'Doctoral research in VLSI design, signal processing, and communication systems.' },
      { icon: '⚡', slug: 'phd-eee', name: 'Ph.D. – Electrical & Electronics', desc: 'Doctoral research spanning power systems, smart grid technologies, and energy engineering.' },
    ],
  },
];

const departments = [
  { icon: '💻', code: 'CSE', name: 'Computer Science & Engineering', desc: 'AI and machine learning, data structures, algorithms, cloud computing, and software engineering disciplines.', labs: '12 Labs', slug: 'cse' },
  { icon: '📡', code: 'ECE', name: 'Electronics & Communication Engineering', desc: 'VLSI design, embedded systems, signal processing, communication networks, and IoT technologies.', labs: '10 Labs', slug: 'ece' },
  { icon: '🌐', code: 'IT', name: 'Information Technology', desc: 'Web development, networking, database management, cybersecurity, and cloud computing platforms.', labs: '8 Labs', slug: 'it' },
  { icon: '⚡', code: 'EEE', name: 'Electrical & Electronics Engineering', desc: 'Power systems, control engineering, electric drives, smart grid technology, and renewable energy.', labs: '9 Labs', slug: 'eee' },
  { icon: '⚙️', code: 'ME', name: 'Mechanical Engineering', desc: 'CAD/CAM, manufacturing systems, thermodynamics, fluid mechanics, and robotics applications.', labs: '11 Labs', slug: 'me' },
  { icon: '🏗️', code: 'CE', name: 'Civil Engineering', desc: 'Structural analysis, construction management, geotechnical and environmental engineering principles.', labs: '8 Labs', slug: 'ce' },
  { icon: '🤖', code: 'AI', name: 'Artificial Intelligence', desc: 'Machine learning, deep learning, NLP, computer vision, and the design of intelligent systems.', labs: '6 Labs', slug: 'ai-ds' },
  { icon: '📐', code: 'FE', name: 'Freshman Engineering', desc: 'Foundation courses in mathematics, physics, chemistry, and the core principles of engineering.', labs: '4 Labs', slug: null },
  { icon: '💼', code: 'MBA', name: 'Master of Business Administration', desc: 'Business strategy, finance, marketing, human resource management, and entrepreneurship.', labs: '2 Labs', slug: 'mba' },
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
      <PageHero
        page="academics"
        defaultImage="https://images.unsplash.com/photo-1498243691581-b145c3f54a5a?w=1920&q=80"
        defaultTitle="You Will Excel."
  defaultSubtitle="Rigorous, industry-aligned programs designed to build your technical expertise, sharpen your research instincts, and develop you as a professional."
        breadcrumb={[{ label: 'Home', to: '/' }, { label: 'Academics' }]}
      />

      {/* Quick Stats */}
      <section style={{ background: 'var(--color-primary)', padding: 'var(--space-6) 0' }}>
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'center', gap: 'var(--space-12)', flexWrap: 'wrap' }}>
            {[
              { num: '9', label: 'B.Tech Programs' },
              { num: '1,400+', label: 'Annual Placements' },
              { num: '230+', label: 'Expert Faculty' },
              { num: '59.28 LPA', label: 'Highest Package' },
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
              Whether you are beginning your B.Tech, advancing to M.Tech, or pursuing doctoral research — VWU offers a program matched to your goals.
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
              Nine specialised departments — each bringing together experienced faculty, well-equipped laboratories, and curricula shaped by industry demands.
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
              From managing a campus radio station to competing at inter-collegiate sports meets — there is a great deal more to life at VWU than lectures alone.
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
                The Training & Placement Cell maintains year-round engagement with India's leading employers — including Amazon, TCS, Infosys, Wipro, HCL, Cognizant, and 150+ other companies.
              </p>
              <Link to="/result-analysis" className="btn btn-primary">View Result Analysis →</Link>
            </div>
            <div className="reveal-right">
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
                {[
                  { value: '1,400+', label: 'Students Placed (2024–25)' },
                  { value: '59.28 LPA', label: 'Highest Package' },
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

      {/* Academics Photos */}
      <section className="section bg-off-white">
        <div className="container">
          <PhotoGrid
            images={academicsPhotos}
            label="Academic Life"
            title="Learning, Research & Innovation"
            subtitle="Inside VWU's labs, classrooms, and events — where students are trained to think, build, and lead."
            highlights={[
              '9 B.Tech specialisations with UGC Autonomous curriculum',
              '50+ specialised labs across all departments',
              '200+ smart classrooms with interactive boards',
              'IEEE, Springer & NPTEL digital library access',
              'Industry-sponsored research & funded projects',
            ]}
            columns={2}
            layout="side-text-reverse"
          />
        </div>
      </section>

      {/* CTA */}
      <section className="section" style={{ background: 'var(--color-primary)' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <div className="reveal">
            <span className="section-label" style={{ color: 'var(--color-accent)' }}>Get Started</span>
            <h2 className="section-title" style={{ color: 'var(--color-white)' }}>Ready to Join VWU?</h2>
            <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: 'var(--text-lg)', maxWidth: 560, margin: '0 auto var(--space-8)' }}>
              Arrange a campus visit, request further information, or apply through EAPCET (Code: VISW) today.
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
