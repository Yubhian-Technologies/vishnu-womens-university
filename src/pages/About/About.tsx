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

const differentiators = [
  { cat: 'Innovation & Entrepreneurship', icon: '🚀', items: ['Vishnu Technology Business Incubator (TBI)', 'Vishnu Space Application Center (VSAC)', 'Science Technology & Innovation Hub (STI Hub)', 'AICTE IDEA Lab', 'Chips to Startup (C2S)', 'Institution Innovation Cell'] },
  { cat: 'Industry Partnerships', icon: '🤝', items: ['NASSCOM Embedded Systems Training', 'HCL Tech VLSI Training', 'Microchip Embedded System', 'TI-DSP Centre of Excellence', 'TalentSprint @ NSE (WISE)', 'Smart Interviews – C&DS Programme'] },
  { cat: 'Specialised Labs', icon: '🔬', items: ['AR / VR Studio', 'High Performance Computing Lab', 'Vehicle Design Lab', 'Assistive Technology Lab (ATL)', 'Concrete Canoe Laboratory', 'Dream House Construction Lab'] },
  { cat: 'International & Global', icon: '🌍', items: ['Vishnu Japan Outreach Centre (VJOC)', 'Graduate Study Abroad Center (GSAC)', 'Foreign Languages Programme', 'TEDxSVECW', 'Rural Women Technology Park', 'Vishnu School of Music'] },
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
                With <strong>13,100+ engineers graduated</strong> and <strong>1,400+ annual placements</strong>,
                VWU is the premier destination for women's engineering education in the Telugu states.
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

      {/* Academic Snapshot */}
      <section className="section bg-white">
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-12)', alignItems: 'center' }}>
            <div className="reveal-left">
              <span className="section-label">Academic Excellence</span>
              <h2 className="section-title">Programs Across Engineering, Management & Research</h2>
              <p style={{ color: 'var(--color-text-light)', lineHeight: 1.8, marginBottom: 'var(--space-6)' }}>
                VWU offers 9 B.Tech specialisations, 4 M.Tech programs, MBA, and Ph.D. across 9 departments —
                all affiliated to JNTUK, with full UGC Autonomous curricular freedom.
              </p>
              <Link to="/academics" className="btn btn-primary">View All Programs & Departments →</Link>
            </div>
            <div className="reveal-right">
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
                {[
                  { label: 'B.Tech', value: '9 Specialisations' },
                  { label: 'M.Tech', value: '4 Programs' },
                  { label: 'MBA', value: '1 Program · 60 Seats' },
                  { label: 'Ph.D.', value: 'CSE · ECE · EEE' },
                ].map(p => (
                  <div key={p.label} style={{ background: 'var(--color-off-white)', border: '1.5px solid var(--color-light-gray)', borderRadius: 'var(--radius-md)', padding: 'var(--space-5)', borderLeft: '4px solid var(--color-accent)' }}>
                    <div style={{ fontFamily: 'var(--font-sans)', fontSize: 'var(--text-xs)', fontWeight: 700, color: 'var(--color-accent)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 4 }}>{p.label}</div>
                    <div style={{ fontFamily: 'var(--font-sans)', fontWeight: 900, color: 'var(--color-primary)', fontSize: 'var(--text-base)' }}>{p.value}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Executive Body */}
      <section id="core-executive" className="section bg-off-white" style={{ scrollMarginTop: 'calc(var(--topbar-height) + var(--header-height) + 1rem)' }}>
        <div className="container">
          <div className="reveal" style={{ textAlign: 'center', marginBottom: 'var(--space-10)' }}>
            <span className="section-label">Leadership</span>
            <h2 className="section-title">Core Executive Body</h2>
            <p className="section-desc" style={{ margin: '0 auto' }}>
              The senior leadership team steering VWU's academic excellence and institutional growth.
            </p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 'var(--space-5)' }}>
            {[
              { name: 'Dr. G. Srinivasa Rao',          role: 'Principal',                    icon: '🎓' },
              { name: 'Prof. P. Venkata Rama Raju',     role: 'Vice-Principal',               icon: '🏛️' },
              { name: 'Dr. G.R.L.V.N. Srinivasa Raju', role: 'Dean – Research & Development', icon: '🔬' },
              { name: 'Dr. V. Purushothama Raju',       role: 'Dean – Academics',             icon: '📚' },
              { name: 'Dr. V.V.R. Maheswara Rao',       role: 'Dean – Statutory Bodies / IQAC Coordinator', icon: '⚖️' },
              { name: 'Dr. K.S.N. Raju',                role: 'Controller of Examinations',   icon: '📋' },
              { name: 'Mr. Md. Siddiq',                 role: 'Administrative Officer',       icon: '🏢' },
              { name: 'Mr. S.S.S. Varma',               role: 'Finance Manager',              icon: '💰' },
            ].map((exec, i) => (
              <div key={exec.name} className="reveal" data-delay={`${i * 50}`}
                style={{ background: 'var(--color-white)', border: '1.5px solid var(--color-light-gray)', borderRadius: 'var(--radius-md)', padding: 'var(--space-5)', display: 'flex', gap: 'var(--space-4)', alignItems: 'flex-start', borderTop: '3px solid var(--color-accent)' }}>
                <span style={{ fontSize: '1.8rem', flexShrink: 0 }}>{exec.icon}</span>
                <div>
                  <div style={{ fontFamily: 'var(--font-sans)', fontWeight: 900, color: 'var(--color-primary)', fontSize: 'var(--text-base)', marginBottom: 4 }}>{exec.name}</div>
                  <div style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-light)' }}>{exec.role}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Organizational Chart */}
      <section id="org-chart" className="section bg-white" style={{ scrollMarginTop: 'calc(var(--topbar-height) + var(--header-height) + 1rem)' }}>
        <div className="container">
          <div className="reveal" style={{ textAlign: 'center', marginBottom: 'var(--space-10)' }}>
            <span className="section-label">Structure</span>
            <h2 className="section-title">Organizational Chart</h2>
          </div>
          <div className="reveal" style={{ overflowX: 'auto' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0, minWidth: 560 }}>
              {/* Top */}
              {[
                { label: 'Sri K.V. Vishnu Raju', sub: 'Chairman, SVES', color: 'var(--color-primary)', textColor: 'var(--color-white)' },
              ].map(n => (
                <div key={n.label} style={{ background: n.color, color: n.textColor, padding: 'var(--space-3) var(--space-8)', borderRadius: 'var(--radius-md)', fontFamily: 'var(--font-sans)', fontWeight: 700, fontSize: 'var(--text-sm)', textAlign: 'center', minWidth: 240 }}>
                  {n.label}<br /><span style={{ fontWeight: 400, fontSize: 'var(--text-xs)', opacity: 0.8 }}>{n.sub}</span>
                </div>
              ))}
              <div style={{ width: 2, height: 28, background: 'var(--color-light-gray)' }} />
              <div style={{ background: 'var(--color-accent)', color: 'var(--color-white)', padding: 'var(--space-3) var(--space-8)', borderRadius: 'var(--radius-md)', fontFamily: 'var(--font-sans)', fontWeight: 700, fontSize: 'var(--text-sm)', textAlign: 'center', minWidth: 240 }}>
                Dr. G. Srinivasa Rao<br /><span style={{ fontWeight: 400, fontSize: 'var(--text-xs)', opacity: 0.9 }}>Principal</span>
              </div>
              <div style={{ width: 2, height: 28, background: 'var(--color-light-gray)' }} />
              {/* Mid tier */}
              <div style={{ display: 'flex', gap: 'var(--space-4)', flexWrap: 'wrap', justifyContent: 'center' }}>
                {[
                  { label: 'Vice-Principal', name: 'Prof. P. Venkata Rama Raju' },
                  { label: 'Dean – R&D', name: 'Dr. G.R.L.V.N.S. Raju' },
                  { label: 'Dean – Academics', name: 'Dr. V. Purushothama Raju' },
                  { label: 'Dean – Statutory', name: 'Dr. V.V.R. Maheswara Rao' },
                  { label: 'Controller of Exams', name: 'Dr. K.S.N. Raju' },
                ].map(n => (
                  <div key={n.label} style={{ background: 'var(--color-off-white)', border: '1.5px solid var(--color-light-gray)', borderRadius: 'var(--radius-md)', padding: 'var(--space-3) var(--space-4)', fontFamily: 'var(--font-sans)', fontSize: 'var(--text-xs)', textAlign: 'center', minWidth: 150 }}>
                    <div style={{ fontWeight: 700, color: 'var(--color-primary)', marginBottom: 2 }}>{n.label}</div>
                    <div style={{ color: 'var(--color-text-light)' }}>{n.name}</div>
                  </div>
                ))}
              </div>
              <div style={{ width: 2, height: 28, background: 'var(--color-light-gray)' }} />
              {/* HoDs */}
              <div style={{ fontFamily: 'var(--font-sans)', fontSize: 'var(--text-xs)', fontWeight: 700, color: 'var(--color-text-light)', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 'var(--space-3)' }}>Heads of Departments</div>
              <div style={{ display: 'flex', gap: 'var(--space-3)', flexWrap: 'wrap', justifyContent: 'center' }}>
                {['EEE','ECE','CSE','IT','Civil','ME','AI & DS','Mathematics','Chemistry','English','MBA'].map(dept => (
                  <div key={dept} style={{ background: 'var(--color-white)', border: '1px solid var(--color-light-gray)', borderRadius: 'var(--radius-sm)', padding: '0.3rem 0.7rem', fontFamily: 'var(--font-sans)', fontSize: '0.7rem', fontWeight: 600, color: 'var(--color-primary)' }}>
                    {dept}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Differentiators — unique content, not duplicated anywhere */}
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

      {/* Campus Snapshot */}
      <section className="section bg-white">
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-12)', alignItems: 'center' }}>
            <div className="reveal-left">
              <img
                src="https://images.unsplash.com/photo-1498243691581-b145c3f54a5a?w=900&q=80"
                alt="VWU campus facilities"
                style={{ width: '100%', height: '360px', objectFit: 'cover', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-xl)' }}
                loading="lazy"
              />
            </div>
            <div className="reveal-right">
              <span className="section-label">Campus Life</span>
              <h2 className="section-title">World-Class Infrastructure</h2>
              <p style={{ color: 'var(--color-text-light)', lineHeight: 1.8, marginBottom: 'var(--space-5)' }}>
                A 100-acre campus with 200+ smart classrooms, 50+ labs, an Olympic-standard swimming pool,
                fitness centre, 1 Gbps Wi-Fi, hostels, food courts, health centre, and on-campus temples.
              </p>
              <Link to="/campus" className="btn btn-primary">Explore Campus Facilities →</Link>
            </div>
          </div>
        </div>
      </section>

      {/* SVES Snapshot */}
      <section className="section" style={{ background: 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-secondary) 100%)' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-12)', alignItems: 'center' }}>
            <div className="reveal-left">
              <span className="section-label" style={{ color: 'var(--color-accent)' }}>Our Parent Society</span>
              <h2 style={{ color: 'var(--color-white)', marginBottom: 'var(--space-4)' }}>Sri Vishnu Educational Society (SVES)</h2>
              <p style={{ color: 'rgba(255,255,255,0.75)', lineHeight: 1.8, marginBottom: 'var(--space-4)' }}>
                Founded by Padma Bhushan Dr. B. V. Raju, SVES operates <strong style={{ color: 'var(--color-accent)' }}>20+ institutions</strong> across
                4 campuses in Bhimavaram, Narsapur, Hyderabad, and Medak — serving over
                <strong style={{ color: 'var(--color-accent)' }}> 50,000 students</strong> annually.
              </p>
              <p style={{ color: 'rgba(255,255,255,0.7)', lineHeight: 1.8, marginBottom: 'var(--space-6)' }}>
                VWU is the flagship women's institution of this celebrated society, embodying its core mission
                of empowering women through world-class technical education.
              </p>
              <Link to="/about-sves" className="btn btn-accent">Learn About SVES →</Link>
            </div>
            <div className="reveal-right" style={{ borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
              <img
                src="https://images.unsplash.com/photo-1523580494863-6f3031224c94?w=900&q=80"
                alt="Sri Vishnu Educational Society campus"
                style={{ width: '100%', height: '380px', objectFit: 'cover' }}
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
              { title: 'Governance & Leadership', desc: 'Governing body, core executive, committees, and development plan.', path: '/governance', icon: '🏛️' },
              { title: 'About Society (SVES)', desc: 'The Sri Vishnu Educational Society — our founding parent organization.', path: '/about-sves', icon: '🌿' },
              { title: 'Campus Life', desc: 'Smart classrooms, labs, hostels, fitness, swimming pool, and more.', path: '/campus', icon: '🏫' },
              { title: 'Academics', desc: 'All B.Tech, M.Tech, MBA and Ph.D. programs with departments.', path: '/academics', icon: '📚' },
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
              <Link to="/campus" className="btn btn-secondary btn-lg">Visit Campus</Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
