import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './Governance.css';

const governingBody = [
  { name: 'Sri K.V. Vishnu Raju', role: 'Chairperson', org: 'Chairman, Sri Vishnu Educational Society' },
  { name: 'Sri Ravichandran Rajagopal', role: 'Member – Management', org: 'Vice Chairman, SVES' },
  { name: 'Sri Aditya Vissam', role: 'Member – Management', org: 'Secretary, SVES' },
  { name: 'Sri K. Sai Sumant', role: 'Member – Management', org: 'Joint Secretary, SVES' },
  { name: 'Sri JVSSRD Prasada Raju', role: 'Member – Management', org: 'Director, SVES' },
  { name: 'Prof. P. Venkata Rama Raju', role: 'Member – Faculty (Nominated by Principal)', org: 'Vice-Principal, SVECW' },
  { name: 'Dr. S.M. Padmaja', role: 'Member – Faculty', org: 'Professor & Head, Dept. of EEE' },
  { name: 'Dr. U. Chandra Sekhar', role: 'Educationalist / Industrialist', org: 'WIPRO, Bengaluru' },
  { name: 'Dr. Buddha Singh', role: 'UGC Nominee', org: 'School of Computer & Systems Sciences, JNU, New Delhi' },
  { name: 'Mr. J. Satyanarayana Murthy', role: 'State Government Nominee', org: 'RJD, Technical Education, Kakinada' },
  { name: 'Prof. GVR Prasada Raju', role: 'University Nominee', org: 'Professor of Civil Engineering, UCEK, JNTUK, Kakinada' },
  { name: 'Dr. G. Srinivasa Rao', role: 'Ex-Officio (Principal)', org: 'Principal, SVECW' },
];

const coreExecutive = [
  { name: 'Dr. B.V. Raju', role: 'Founder Chairman', bio: 'Padma Bhushan awardee (1977: Padmashri, 2001: Padmabhushan). Chemical Engineer, BHU; Management Graduate, Harvard University.' },
  { name: 'Sri K.V. Vishnu Raju', role: 'Chairman', bio: 'B.Tech Chemical Engineering, REC Tiruchirapalli; M.S Chemical Engineering, Michigan Technological University. MD, Anjani Portland Cement Limited.' },
  { name: 'Sri Ravichandran Rajagopal', role: 'Vice Chairman', bio: 'Mechanical Engineering, NIT Tiruchirapalli; Management PG, IIM Calcutta. Prior experience with Novartis India.' },
  { name: 'Sri K. Aditya Vissam', role: 'Secretary', bio: 'Industrial Engineering, Penn State University; MBA, Imperial College, London. Previously at Office Depot and Amazon.' },
  { name: 'Kalidindi Sai Sumant', role: 'Joint Secretary', bio: 'Materials Science, Pennsylvania State University; MBA, University of California, Irvine. Former R&D Engineer at Glidewell Dental; USA Patent inventor.' },
  { name: 'Dr. G. Srinivasa Rao', role: 'Principal', bio: 'PhD Mechanical Engineering, Visvesvaraya Technological University; M.Tech, NIT-Calicut. 32 years teaching experience; Fellow, Institution of Engineers.' },
  { name: 'P. Venkata Rama Raju', role: 'Vice Principal', bio: 'M.Tech CS, JNTU Hyderabad; B.Tech CSE, SRKR Engineering College. 22 years teaching and 5 years industry experience.' },
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
  {
    year: 'Objective 1',
    title: 'Enhanced Educational Quality',
    desc: 'Create an increasingly high-quality and innovative educational experience for all students through systematic study plans, scientific teaching practices, certification programs, value-added courses, and industry/academic expert engagement.',
  },
  {
    year: 'Objective 2',
    title: 'Employment & Higher Education Opportunities',
    desc: 'Strengthen industry-institute collaboration, expand metropolitan liaison offices, build dedicated placement teams, and promote entrepreneurship awareness including GRE/TOEFL/GATE preparation.',
  },
  {
    year: 'Objective 3',
    title: 'Faculty Recruitment & Retention',
    desc: 'Establish award and reward systems, encourage faculty customization, promote workshop and conference participation, and foster a strong research culture among educators.',
  },
  {
    year: 'Objective 4',
    title: 'Research Culture Development',
    desc: 'Encourage and provide financial support for workforce participation in research through theme labs, special facilities, and research center applications.',
  },
  {
    year: 'Objective 5',
    title: 'Community & Environmental Commitment',
    desc: 'Advance societal service through student and faculty involvement, rural women\'s technical and nutritional awareness via Radio Vishnu, zero-discharge infrastructure, green practices, and alternative energy adoption.',
  },
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
                  The Core Executive Body of VWU is led by the SVES management and institution's senior academic leaders, guiding the strategic and operational direction of the university.
                </p>
              </div>
              <div className="gov-exec-grid">
                {coreExecutive.map((m, i) => (
                  <div key={i} className="gov-exec-card reveal" data-delay={`${i * 40}`}
                    style={{ alignItems: 'flex-start' }}>
                    <div className="gov-exec-avatar" style={{ marginTop: 4 }}>{m.name.split(' ').map(n => n[0]).slice(0, 2).join('')}</div>
                    <div>
                      <div className="gov-exec-name">{m.name}</div>
                      <div className="gov-exec-role" style={{ marginBottom: 6 }}>{m.role}</div>
                      <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-light)', lineHeight: 1.5 }}>{m.bio}</div>
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
                  VWU's Institutional Development Plan (2020–2035) outlines five strategic objectives covering education quality, employability, faculty development, research culture, and community commitment.
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
