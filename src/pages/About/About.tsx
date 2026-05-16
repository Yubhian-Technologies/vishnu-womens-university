import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import './About.css';
import PageHero from '../../components/PageHero/PageHero';

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
      <PageHero
        page="about"
        defaultImage="https://images.unsplash.com/photo-1562774053-701939374585?w=1920&q=80"
        defaultTitle="About Vishnu Womens University"
  defaultSubtitle="Rooted in Bhimavaram since 2001, VWU has grown into Andhra Pradesh's foremost institution for women's technical education."
        breadcrumb={[{ label: 'Home', to: '/' }, { label: 'About VWU' }]}
      />

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
                Vishnu Womens University is set in Vishnupur, 3 km from Bhimavaram along Tadepalligudem Road
                in Coastal Andhra Pradesh. The campus stretches across approximately <strong> 100 acres</strong>,
                offering an environment well-suited to focused, high-quality learning.
              </p>
              <p style={{ lineHeight: 1.8, marginBottom: 'var(--space-4)', color: 'var(--color-text-light)' }}>
                Operating under the <strong>Sri Vishnu Educational Society</strong> and affiliated to JNTUK,
                VWU carries UGC Autonomous status, NBA-DCP accreditation, AICTE approval, and NAAC recognition.
                Its infrastructure includes fully equipped laboratories, smart classrooms, drawing halls, and seminar rooms.
              </p>
              <p style={{ lineHeight: 1.8, marginBottom: 'var(--space-6)', color: 'var(--color-text-light)' }}>
                Having graduated <strong>13,100+ engineers</strong> and achieved <strong>1,400+ annual placements</strong>,
                VWU stands as the leading destination for women's engineering education in the Telugu-speaking states.
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
                VWU delivers 9 B.Tech specialisations, 4 M.Tech programs, MBA, and Ph.D. across 9 departments —
                all affiliated to JNTUK and shaped by the curricular freedom that comes with full UGC Autonomous status.
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
              The senior leadership team responsible for guiding VWU's academic direction and institutional development.
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

      {/* Differentiators — unique content, not duplicated anywhere */}
      <section className="section bg-off-white">
        <div className="container">
          <div className="reveal" style={{ textAlign: 'center', marginBottom: 'var(--space-12)' }}>
            <span className="section-label">What Sets Us Apart</span>
            <h2 className="section-title">30+ Differentiating Initiatives</h2>
            <p className="section-desc" style={{ margin: '0 auto' }}>
              VWU extends well beyond conventional engineering education through programs in innovation,
              industry engagement, international exposure, and community-driven initiatives.
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
              <h2 className="section-title">Purpose-Built Infrastructure</h2>
              <p style={{ color: 'var(--color-text-light)', lineHeight: 1.8, marginBottom: 'var(--space-5)' }}>
                A 100-acre campus housing 200+ smart classrooms, 50+ laboratories, an Olympic-standard swimming pool,
                a fitness centre, 1 Gbps campus Wi-Fi, hostels, food courts, a health centre, and on-campus temples.
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
                Established by Padma Bhushan Dr. B. V. Raju, SVES runs <strong style={{ color: 'var(--color-accent)' }}>20+ institutions</strong> across
                4 campuses in Bhimavaram, Narsapur, Hyderabad, and Medak — reaching more than
                <strong style={{ color: 'var(--color-accent)' }}> 50,000 students</strong> each year.
              </p>
              <p style={{ color: 'rgba(255,255,255,0.7)', lineHeight: 1.8, marginBottom: 'var(--space-6)' }}>
                VWU is the principal women's institution within this distinguished society, reflecting its founding
                commitment to advancing women through rigorous technical education.
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
              Whether you are a prospective student, an employer, or a community partner — VWU has a place for you.
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
