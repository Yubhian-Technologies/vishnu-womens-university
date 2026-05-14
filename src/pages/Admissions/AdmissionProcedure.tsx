import { useEffect } from 'react';
import { Link } from 'react-router-dom';

const btechSteps = [
  { step: '01', title: 'Check Eligibility', desc: 'Pass 10+2 with Physics & Mathematics as major subjects with a minimum of 50% marks.' },
  { step: '02', title: 'Appear in EAPCET', desc: 'Qualify in EAPCET (Engineering, Agriculture and Pharmacy Common Entrance Test). Selection is based on EAPCET rank.' },
  { step: '03', title: 'Choose Your Route', desc: 'Apply through EAPCET Counselling (Code: VISW) or contact VWU directly for management seat enrollment.' },
  { step: '04', title: 'Lateral Entry (ECET)', desc: 'Diploma holders seeking lateral entry must qualify through ECET Counselling and apply to the second year directly.' },
  { step: '05', title: 'Register & Submit Documents', desc: 'Register with the admissions office with intermediate marks memo shortly after results are declared.' },
  { step: '06', title: 'Confirm Admission', desc: 'Pay the fee, submit all documents, and confirm your seat to complete the admission process.' },
];

const mtechSteps = [
  { step: '01', title: 'Check Eligibility', desc: 'Hold a B.Tech / BE degree in the relevant branch from a recognized university.' },
  { step: '02', title: 'Qualify GATE / PGECET', desc: 'Appear in GATE (Graduate Aptitude Test in Engineering) or PGECET (Post Graduate Engineering Common Entrance Test).' },
  { step: '03', title: 'Choose Your Route', desc: 'Apply through PGECET Counselling or enroll directly with VWU for management quota seats.' },
  { step: '04', title: 'Submit Documents', desc: 'Register with the admissions office and submit degree marks memo during registration.' },
];

const mbaSteps = [
  { step: '01', title: 'Check Eligibility', desc: 'Be a graduate with a minimum of 50% marks in any recognised bachelor\'s degree program.' },
  { step: '02', title: 'Qualify ICET', desc: 'Appear in ICET (Integrated Common Entrance Test) — the score determines admission placement.' },
  { step: '03', title: 'Choose Your Route', desc: 'Apply through ICET Counselling or register directly with VWU for available seats.' },
  { step: '04', title: 'Register & Confirm', desc: 'Submit degree marks memo during administrative registration and confirm your seat by paying the fee.' },
];

const documents = [
  '10th Class Marks Memo & Certificate',
  '12th / Intermediate Marks Memo',
  'EAPCET / GATE / PGECET / ICET Rank Card',
  'Transfer Certificate (TC)',
  'Study & Conduct Certificates',
  'Caste Certificate (if applicable)',
  'Income Certificate (if applicable)',
  'Aadhar Card (Student & Parent)',
  'Passport-size Photographs (6 copies)',
  'Migration Certificate (if applicable)',
];

export default function AdmissionProcedure() {
  useEffect(() => {
    document.title = 'Admission Procedure | VWU';
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

  const stepStyle = (_i: number): React.CSSProperties => ({
    display: 'flex',
    gap: 'var(--space-5)',
    padding: 'var(--space-5)',
    background: 'var(--color-white)',
    border: '1.5px solid var(--color-light-gray)',
    borderRadius: 'var(--radius-md)',
    transition: 'all var(--transition-base)',
  });

  const renderSteps = (steps: typeof btechSteps) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
      {steps.map((s, i) => (
        <div key={s.step} className="reveal" data-delay={`${i * 60}`} style={stepStyle(0)}
          onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--color-accent)'; (e.currentTarget as HTMLElement).style.boxShadow = 'var(--shadow-sm)'; }}
          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--color-light-gray)'; (e.currentTarget as HTMLElement).style.boxShadow = 'none'; }}
        >
          <div style={{ width: 44, height: 44, borderRadius: '50%', background: 'var(--color-primary)', color: 'var(--color-accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-serif)', fontWeight: 900, fontSize: '0.85rem', flexShrink: 0 }}>{s.step}</div>
          <div>
            <div style={{ fontFamily: 'var(--font-sans)', fontSize: 'var(--text-base)', fontWeight: 900, color: 'var(--color-primary)', marginBottom: 4 }}>{s.title}</div>
            <div style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-light)', lineHeight: 1.6 }}>{s.desc}</div>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <main className="page-wrapper">
      <section className="page-hero" style={{ minHeight: 340 }}>
        <img src="https://images.unsplash.com/photo-1434030216411-0b793f4b6f71?w=1920&q=80" alt="Admission Procedure" className="page-hero-image" />
        <div className="page-hero-overlay" />
        <div className="container page-hero-content">
          <div className="breadcrumb animate-fade-in">
            <Link to="/" className="breadcrumb-item">Home</Link>
            <span className="breadcrumb-sep">›</span>
            <Link to="/admissions" className="breadcrumb-item">Admissions</Link>
            <span className="breadcrumb-sep">›</span>
            <span className="breadcrumb-item active">Admission Procedure</span>
          </div>
          <h1 className="animate-fade-in-up">Admission Procedure</h1>
          <p className="animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            Step-by-step guide to joining VWU — eligibility, entrance tests, and enrollment for all programmes.
          </p>
        </div>
      </section>

      {/* EAPCET code banner */}
      <section style={{ background: 'var(--color-primary)', padding: 'var(--space-5) 0' }}>
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'center', gap: 'var(--space-12)', flexWrap: 'wrap' }}>
            {[
              { label: 'EAPCET Code (B.Tech)', value: 'VISW' },
              { label: 'PGECET (M.Tech)', value: 'GATE / PGECET' },
              { label: 'MBA Entrance', value: 'ICET' },
              { label: 'Lateral Entry', value: 'ECET' },
            ].map(s => (
              <div key={s.label} style={{ textAlign: 'center' }}>
                <div style={{ fontFamily: 'var(--font-serif)', fontSize: '1.5rem', fontWeight: 900, color: 'var(--color-accent)' }}>{s.value}</div>
                <div style={{ fontSize: 'var(--text-xs)', color: 'rgba(255,255,255,0.65)', marginTop: 2 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* B.Tech */}
      <section className="section bg-off-white">
        <div className="container">
          <div className="reveal" style={{ marginBottom: 'var(--space-8)' }}>
            <span className="section-label">Undergraduate</span>
            <h2 className="section-title">B.Tech Admission Procedure</h2>
            <p style={{ color: 'var(--color-text-light)', maxWidth: 640 }}>
              Candidates who have passed 10+2 with Physics & Mathematics as major subjects with minimum 50% marks are eligible. Selection is based on EAPCET rank.
            </p>
          </div>
          {renderSteps(btechSteps)}
        </div>
      </section>

      {/* M.Tech + MBA side by side */}
      <section className="section bg-white">
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-12)' }}>
            <div>
              <div className="reveal" style={{ marginBottom: 'var(--space-8)' }}>
                <span className="section-label">Postgraduate</span>
                <h2 className="section-title" style={{ fontSize: 'var(--text-2xl)' }}>M.Tech Admission</h2>
                <p style={{ color: 'var(--color-text-light)', fontSize: 'var(--text-sm)' }}>
                  Selection based on GATE or PGECET rank. Direct enrollment also available.
                </p>
              </div>
              {renderSteps(mtechSteps)}
            </div>
            <div>
              <div className="reveal" style={{ marginBottom: 'var(--space-8)' }}>
                <span className="section-label">Management</span>
                <h2 className="section-title" style={{ fontSize: 'var(--text-2xl)' }}>MBA Admission</h2>
                <p style={{ color: 'var(--color-text-light)', fontSize: 'var(--text-sm)' }}>
                  Graduates with minimum 50% marks are eligible. Admission through ICET counselling.
                </p>
              </div>
              {renderSteps(mbaSteps)}
            </div>
          </div>
        </div>
      </section>

      {/* Documents Required */}
      <section className="section" style={{ background: 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-secondary) 100%)' }}>
        <div className="container">
          <div className="reveal" style={{ textAlign: 'center', marginBottom: 'var(--space-10)' }}>
            <span className="section-label" style={{ color: 'var(--color-accent)' }}>Checklist</span>
            <h2 style={{ color: 'var(--color-white)' }} className="section-title">Documents Required</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 'var(--space-3)', maxWidth: 800, margin: '0 auto' }}>
            {documents.map((doc, i) => (
              <div key={doc} className="reveal" data-delay={`${i * 40}`}
                style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 'var(--radius-sm)', padding: 'var(--space-3) var(--space-4)' }}>
                <span style={{ color: 'var(--color-accent)', fontWeight: 900, flexShrink: 0 }}>✓</span>
                <span style={{ fontSize: 'var(--text-sm)', color: 'rgba(255,255,255,0.85)' }}>{doc}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ background: 'var(--color-primary)', padding: 'var(--space-12) 0' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <div className="reveal">
            <h2 style={{ color: 'var(--color-white)', marginBottom: 'var(--space-4)' }}>Ready to Apply?</h2>
            <div style={{ display: 'flex', gap: 'var(--space-4)', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link to="/programmes-fee-structure" className="btn btn-accent">View Fee Structure</Link>
              <Link to="/result-analysis" className="btn btn-secondary">Result Analysis</Link>
              <Link to="/admissions" className="btn btn-secondary">Admissions Home</Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
