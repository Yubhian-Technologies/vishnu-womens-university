import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './Governance.css';

const governingBody = [
  { name: 'Sri B. Vishnu Vardhan Reddy', role: 'Chairman', org: 'Sri Vishnu Educational Society' },
  { name: 'Dr. B. Venkateshwara Rao', role: 'Secretary', org: 'Sri Vishnu Educational Society' },
  { name: 'Dr. P. Mallikarjuna Rao', role: 'Principal & Member Secretary', org: 'Vishnu Womens University' },
  { name: 'Dr. S. Narayana Reddy', role: 'Nominee – JNTUK', org: 'JNTUK, Kakinada' },
  { name: 'Prof. A. Srinivasa Rao', role: 'Nominee – State Government', org: 'Govt. of Andhra Pradesh' },
  { name: 'Dr. V. Kamakshi Prasad', role: 'Dean – Academics', org: 'Vishnu Womens University' },
  { name: 'Industry Representative', role: 'Industry Nominee', org: 'Infosys Limited' },
  { name: 'Dr. L. Padma', role: 'Faculty Representative', org: 'Vishnu Womens University' },
];

const coreExecutive = [
  { name: 'Dr. P. Mallikarjuna Rao', role: 'Principal', dept: '' },
  { name: 'Dr. V. Kamakshi Prasad', role: 'Dean – Academics', dept: '' },
  { name: 'Prof. S. Anitha', role: 'Head of Department', dept: 'CSE' },
  { name: 'Dr. L. Padma', role: 'Head of Department', dept: 'ECE' },
  { name: 'Prof. R. Sumalatha', role: 'Head of Department', dept: 'EEE' },
  { name: 'Dr. K. Srinivasa Rao', role: 'IQAC Coordinator', dept: '' },
  { name: 'Prof. B. Sridevi', role: 'Head of Department', dept: 'IT' },
  { name: 'Dr. M. Anuradha', role: 'Head of Department', dept: 'Civil' },
  { name: 'Prof. T. Ramesh', role: 'Head of Department', dept: 'Mechanical' },
  { name: 'Dr. P. Lavanya', role: 'Head of Department', dept: 'AI' },
  { name: 'Prof. K. Madhuri', role: 'Head of Department', dept: 'MBA' },
  { name: 'Dr. N. Sujatha', role: 'Head – Freshman Engineering', dept: 'FE' },
];

const committees = [
  'College Academic Committee',
  'Internal Quality Assurance Cell (IQAC)',
  'Academic and Administrative Audit Committee',
  'Freshmen Committee',
  'Infrastructure Management Committee',
  'Faculty Grievance Redressal Committee',
  'Student Grievance Redressal Committee',
  'Central Purchase Committee',
  'Counselling & Monitoring Committee',
  'Anti Ragging Committee',
  'Internal Committee (IC)',
  'SC/ST Cell',
  'R&D Committee',
];

const idpPoints = [
  { year: '2024–25', title: 'Research & Innovation Hub', desc: 'Establish a dedicated Research & Innovation Hub with 10 new funded projects and 5 industry-sponsored research centers.' },
  { year: '2025–26', title: 'Global Outreach Expansion', desc: 'Expand the Vishnu Japan Outreach Centre and sign 3 new international MoUs for student and faculty exchange programs.' },
  { year: '2026–27', title: 'Digital Learning Ecosystem', desc: 'Complete rollout of AI-powered LMS, expand the AR/VR studio, and introduce 100% digital assessment for all programs.' },
  { year: '2027–28', title: 'Autonomous University Status', desc: 'Achieve Deemed University status with full curricular autonomy, enabling globally benchmarked engineering programs.' },
  { year: '2028–30', title: 'Sustainability & Green Campus', desc: 'Achieve zero-carbon campus with solar energy, rainwater harvesting, and a fully sustainable Green Campus certification.' },
];

type TabId = 'governing' | 'executive' | 'committees' | 'idp';

export default function Governance() {
  const [activeTab, setActiveTab] = useState<TabId>('governing');

  useEffect(() => {
    document.title = 'Governance | VWU';
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
        <img src="https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=1920&q=80" alt="VWU governance" className="page-hero-image" />
        <div className="page-hero-overlay" />
        <div className="container page-hero-content">
          <div className="breadcrumb animate-fade-in">
            <Link to="/" className="breadcrumb-item">Home</Link>
            <span className="breadcrumb-sep">›</span>
            <Link to="/about" className="breadcrumb-item">Discover</Link>
            <span className="breadcrumb-sep">›</span>
            <span className="breadcrumb-item active">Governance</span>
          </div>
          <h1 className="animate-fade-in-up">Governance & Leadership</h1>
          <p className="animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            Transparent, accountable governance driving academic excellence and institutional growth at VWU.
          </p>
        </div>
      </section>

      {/* Tabs */}
      <section className="section bg-off-white">
        <div className="container">
          <div className="gov-tabs">
            {([
              { id: 'governing', label: 'Governing Body' },
              { id: 'executive', label: 'Core Executive Body' },
              { id: 'committees', label: 'Committees' },
              { id: 'idp', label: 'Development Plan (IDP)' },
            ] as { id: TabId; label: string }[]).map(tab => (
              <button
                key={tab.id}
                className={`gov-tab${activeTab === tab.id ? ' active' : ''}`}
                onClick={() => setActiveTab(tab.id)}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Governing Body */}
          {activeTab === 'governing' && (
            <div>
              <div style={{ marginBottom: 'var(--space-8)' }}>
                <h2 className="section-title" style={{ marginBottom: 'var(--space-2)' }}>Governing Body</h2>
                <p style={{ color: 'var(--color-text-light)', fontSize: 'var(--text-base)', maxWidth: 700 }}>
                  The Governing Body of Vishnu Womens University is constituted as per AICTE norms and
                  includes representatives from the management, faculty, industry, and regulatory bodies.
                </p>
              </div>
              <div className="gov-table-wrap">
                <table className="gov-table">
                  <thead>
                    <tr>
                      <th>S.No</th>
                      <th>Name</th>
                      <th>Designation</th>
                      <th>Organisation</th>
                    </tr>
                  </thead>
                  <tbody>
                    {governingBody.map((m, i) => (
                      <tr key={i}>
                        <td>{i + 1}</td>
                        <td><strong>{m.name}</strong></td>
                        <td>{m.role}</td>
                        <td>{m.org}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Core Executive */}
          {activeTab === 'executive' && (
            <div>
              <div style={{ marginBottom: 'var(--space-8)' }}>
                <h2 className="section-title" style={{ marginBottom: 'var(--space-2)' }}>Core Executive Body</h2>
                <p style={{ color: 'var(--color-text-light)', fontSize: 'var(--text-base)', maxWidth: 700 }}>
                  The Core Executive Body comprises the Principal, Deans, and Department Heads responsible for
                  day-to-day academic and administrative management of VWU.
                </p>
              </div>
              <div className="gov-exec-grid">
                {coreExecutive.map((m, i) => (
                  <div key={i} className="gov-exec-card reveal" data-delay={`${i * 40}`}>
                    <div className="gov-exec-avatar">{m.name.split(' ').map(n => n[0]).slice(0, 2).join('')}</div>
                    <div>
                      <div className="gov-exec-name">{m.name}</div>
                      <div className="gov-exec-role">{m.role}{m.dept ? ` – ${m.dept}` : ''}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Committees */}
          {activeTab === 'committees' && (
            <div>
              <div style={{ marginBottom: 'var(--space-8)' }}>
                <h2 className="section-title" style={{ marginBottom: 'var(--space-2)' }}>Administrative Committees</h2>
                <p style={{ color: 'var(--color-text-light)', fontSize: 'var(--text-base)', maxWidth: 700 }}>
                  VWU operates 13 committees ensuring quality, transparency, and student welfare across
                  all academic and administrative functions.
                </p>
              </div>
              <div className="gov-committees-grid">
                {committees.map((c, i) => (
                  <div key={c} className="gov-committee-card reveal" data-delay={`${i * 40}`}>
                    <span className="gov-committee-num">{String(i + 1).padStart(2, '0')}</span>
                    <span>{c}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* IDP */}
          {activeTab === 'idp' && (
            <div>
              <div style={{ marginBottom: 'var(--space-8)' }}>
                <h2 className="section-title" style={{ marginBottom: 'var(--space-2)' }}>Institutional Development Plan (IDP)</h2>
                <p style={{ color: 'var(--color-text-light)', fontSize: 'var(--text-base)', maxWidth: 700 }}>
                  VWU's five-year Institutional Development Plan outlines strategic goals across research,
                  global outreach, digital learning, and campus sustainability through 2030.
                </p>
              </div>
              <div className="gov-idp-list">
                {idpPoints.map((item, i) => (
                  <div key={item.year} className="gov-idp-card reveal" data-delay={`${i * 80}`}>
                    <div className="gov-idp-year">{item.year}</div>
                    <div>
                      <h3>{item.title}</h3>
                      <p>{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section style={{ background: 'var(--color-primary)', padding: 'var(--space-12) 0' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <div className="reveal">
            <h2 style={{ color: 'var(--color-white)', marginBottom: 'var(--space-4)' }}>Learn More About VWU</h2>
            <div style={{ display: 'flex', gap: 'var(--space-4)', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link to="/about" className="btn btn-accent">About VWU</Link>
              <Link to="/vision-mission" className="btn btn-secondary">Vision & Mission</Link>
              <Link to="/about-sves" className="btn btn-secondary">About SVES</Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
