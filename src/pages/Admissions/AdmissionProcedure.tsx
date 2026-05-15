import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import PageHero from '../../components/PageHero/PageHero';

const btechSteps = [
  { step: '01', title: 'Check Eligibility', desc: 'Candidates must have passed 10+2 with Physics and Mathematics as major subjects, securing a minimum of 50% marks.' },
  { step: '02', title: 'Appear in EAPCET', desc: 'Qualify in the EAPCET (Engineering, Agriculture and Pharmacy Common Entrance Test). Admission is based on EAPCET rank.' },
  { step: '03', title: 'Choose Your Route', desc: 'Proceed through EAPCET Counselling (Code: VISW) or approach VWU directly for management quota seat enrollment.' },
  { step: '04', title: 'Lateral Entry (ECET)', desc: 'Diploma holders applying for lateral entry must qualify through ECET Counselling and join the second year directly.' },
  { step: '05', title: 'Register & Submit Documents', desc: 'Report to the admissions office with your intermediate marks memo shortly after results are announced.' },
  { step: '06', title: 'Confirm Admission', desc: 'Pay the required fee, submit all original documents, and finalise your seat to complete the admission.' },
];

const mtechSteps = [
  { step: '01', title: 'Check Eligibility', desc: 'Applicants must hold a B.Tech or BE degree in the relevant branch from a recognised university.' },
  { step: '02', title: 'Qualify GATE / PGECET', desc: 'Appear in GATE (Graduate Aptitude Test in Engineering) or PGECET (Post Graduate Engineering Common Entrance Test).' },
  { step: '03', title: 'Choose Your Route', desc: 'Apply through PGECET Counselling or register with VWU directly for available management quota seats.' },
  { step: '04', title: 'Submit Documents', desc: 'Complete registration at the admissions office and submit your degree marks memo at the time of enrollment.' },
];

const mbaSteps = [
  { step: '01', title: 'Check Eligibility', desc: 'Applicants must hold a bachelor\'s degree in any discipline from a recognised institution, with a minimum of 50% marks.' },
  { step: '02', title: 'Qualify ICET', desc: 'Appear in ICET (Integrated Common Entrance Test) — your score determines your placement in the admission process.' },
  { step: '03', title: 'Choose Your Route', desc: 'Proceed through ICET Counselling or register with VWU directly for available seats.' },
  { step: '04', title: 'Register & Confirm', desc: 'Submit your degree marks memo during administrative registration, then confirm your seat by completing fee payment.' },
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
      {/* Hero */}
      <PageHero
        page="admission-procedure"
        defaultImage="https://images.unsplash.com/photo-1434030216411-0b793f4b6f71?w=1920&q=80"
        defaultTitle="Admission Procedure"
  defaultSubtitle="A clear, step-by-step guide to joining VWU — covering eligibility, entrance examinations, and the enrollment process for all programmes."
        breadcrumb={[{ label: 'Home', to: '/' }, { label: 'Admissions', to: '/admissions' }, { label: 'Admission Procedure' }]}
      />

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
              Candidates who have completed 10+2 with Physics and Mathematics as major subjects — achieving at least 50% — are eligible. Admission is determined by EAPCET rank.
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
                  Selection is based on GATE or PGECET rank. Direct enrollment is also available for management quota seats.
                </p>
              </div>
              {renderSteps(mtechSteps)}
            </div>
            <div>
              <div className="reveal" style={{ marginBottom: 'var(--space-8)' }}>
                <span className="section-label">Management</span>
                <h2 className="section-title" style={{ fontSize: 'var(--text-2xl)' }}>MBA Admission</h2>
                <p style={{ color: 'var(--color-text-light)', fontSize: 'var(--text-sm)' }}>
                  Graduates with a minimum of 50% marks are eligible. Admission is through ICET counselling.
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
