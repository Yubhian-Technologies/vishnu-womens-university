import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Check } from 'lucide-react';
import PageHero from '../../components/PageHero/PageHero';
import { useContentBlocks } from '../../hooks/useContentBlocks';

export default function AdmissionProcedure() {
  const stats = useContentBlocks('admission-procedure', 'stats');
  const btechSteps = useContentBlocks('admission-procedure', 'btechSteps');
  const mtechSteps = useContentBlocks('admission-procedure', 'mtechSteps');
  const mbaSteps = useContentBlocks('admission-procedure', 'mbaSteps');
  const documents = useContentBlocks('admission-procedure', 'documents');

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

  const renderSteps = (steps: ReturnType<typeof useContentBlocks>) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
      {steps.map((s, i) => (
        <div key={s.id} style={stepStyle(0)}
          onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--color-accent)'; (e.currentTarget as HTMLElement).style.boxShadow = 'var(--shadow-sm)'; }}
          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--color-light-gray)'; (e.currentTarget as HTMLElement).style.boxShadow = 'none'; }}
        >
          <div style={{ width: 44, height: 44, borderRadius: '50%', background: 'var(--color-primary)', color: 'var(--color-accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-serif)', fontWeight: 900, fontSize: '0.85rem', flexShrink: 0 }}>{String(i + 1).padStart(2, '0')}</div>
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
        defaultTitle="Admission Procedure"
  defaultSubtitle="A clear, step-by-step guide to joining VWU — covering eligibility, entrance examinations, and the enrollment process for all programmes."
        breadcrumb={[{ label: 'Home', to: '/' }, { label: 'Admissions', to: '/admissions' }, { label: 'Admission Procedure' }]}
        scrollCtaTargetId="admission-procedure-content"
      />

      {/* EAPCET code banner */}
      <section id="admission-procedure-content" style={{ background: 'var(--color-primary)', padding: 'var(--space-5) 0', scrollMarginTop: 'calc(var(--topbar-height) + var(--header-height) + 1rem)' }}>
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'center', gap: 'var(--space-12)', flexWrap: 'wrap' }}>
            {stats.map(s => (
              <div key={s.id} style={{ textAlign: 'center' }}>
                <div style={{ fontFamily: 'var(--font-serif)', fontSize: '1.5rem', fontWeight: 900, color: 'var(--color-accent)' }}>{s.value}</div>
                <div style={{ fontSize: 'var(--text-xs)', color: 'rgba(255,255,255,0.65)', marginTop: 2 }}>{s.title}</div>
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
          <div className="mobile-stack-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-12)' }}>
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
          <div className="mobile-stack-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 'var(--space-3)', maxWidth: 800, margin: '0 auto' }}>
            {documents.map((doc) => (
              <div key={doc.id}
                style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 'var(--radius-sm)', padding: 'var(--space-3) var(--space-4)' }}>
                <Check size={16} strokeWidth={2.5} style={{ color: 'var(--color-accent)', flexShrink: 0 }} />
                <span style={{ fontSize: 'var(--text-sm)', color: 'rgba(255,255,255,0.85)' }}>{doc.title}</span>
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
              <Link to="/result-analysis" className="btn btn-secondary">Results Analysis</Link>
              <Link to="/admissions" className="btn btn-secondary">Admissions Home</Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
