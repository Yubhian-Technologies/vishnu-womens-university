import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Check, ArrowRight } from 'lucide-react';
import PageHero from '../../components/PageHero/PageHero';
import { useContentBlocks } from '../../hooks/useContentBlocks';
import { admissionTabs, CATEGORY_B_FOOTNOTE } from './admissionProcedure.data';
import '../Campus/tabbed-section.css';
import './AdmissionProcedure.css';

const fieldLabelStyle: React.CSSProperties = {
  fontFamily: 'var(--font-sans)',
  fontSize: '0.7rem',
  fontWeight: 800,
  textTransform: 'uppercase',
  letterSpacing: '0.06em',
  color: 'var(--color-text-light)',
};

export default function AdmissionProcedure() {
  const stats = useContentBlocks('admission-procedure', 'stats');
  const documents = useContentBlocks('admission-procedure', 'documents');

  const [activeTabKey, setActiveTabKey] = useState(admissionTabs[0].key);
  const activeTab = admissionTabs.find((t) => t.key === activeTabKey) ?? admissionTabs[0];
  const [activeCategoryKey, setActiveCategoryKey] = useState(activeTab.categories[0].key);
  const activeCategory =
    activeTab.categories.find((c) => c.key === activeCategoryKey) ?? activeTab.categories[0];

  const handleTabChange = (key: string) => {
    setActiveTabKey(key);
    const nextTab = admissionTabs.find((t) => t.key === key);
    setActiveCategoryKey(nextTab?.categories[0].key ?? 'A');
  };

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

      {/* Admission Procedure Tabs */}
      <section className="section bg-off-white">
        <div className="container">
          <div className="reveal" style={{ textAlign: 'center', marginBottom: 'var(--space-8)' }}>
            <span className="section-label">Admissions 2027</span>
            <h2 className="section-title">Admission Procedure</h2>
            <p style={{ color: 'var(--color-text-light)', maxWidth: 640, margin: '0 auto' }}>
              Select your programme below to explore the applicable entrance examination, admission category and pathway.
            </p>
          </div>

          <div className="section-tabs admission-tabs-bar" role="tablist" aria-label="Admission programmes">
            {admissionTabs.map((t) => (
              <button
                key={t.key}
                type="button"
                role="tab"
                aria-selected={activeTab.key === t.key}
                onClick={() => handleTabChange(t.key)}
                className={`section-tab-btn${activeTab.key === t.key ? ' active' : ''}`}
              >
                {t.label}
              </button>
            ))}
          </div>

          <h3 style={{ fontFamily: 'var(--font-serif)', color: 'var(--color-primary)', marginBottom: 'var(--space-3)' }}>{activeTab.heading}</h3>
          <p style={{ color: 'var(--color-text-light)', width: '100%', maxWidth: '100%', marginBottom: 'var(--space-6)' }}>{activeTab.intro}</p>

          {activeTab.categories.length > 1 && (
            <div className="section-subtabs admission-subtabs-bar" role="tablist" aria-label="Admission category">
              {activeTab.categories.map((c) => (
                <button
                  key={c.key}
                  type="button"
                  role="tab"
                  aria-selected={activeCategory.key === c.key}
                  onClick={() => setActiveCategoryKey(c.key)}
                  className={`section-subtab-btn${activeCategory.key === c.key ? ' active' : ''}`}
                >
                  {c.title}
                </button>
              ))}
            </div>
          )}

          <div className="admission-category-card" style={{ background: 'var(--color-white)', border: '1.5px solid var(--color-light-gray)', borderRadius: 'var(--radius-md)' }}>
            <h4 style={{ fontFamily: 'var(--font-sans)', fontWeight: 900, color: 'var(--color-primary)', marginBottom: 'var(--space-2)' }}>{activeCategory.title}</h4>
            <p style={{ color: 'var(--color-text-light)', fontSize: 'var(--text-sm)', marginBottom: 'var(--space-5)' }}>{activeCategory.description}</p>

            {activeCategory.eligibility && (
              <div style={{ marginBottom: 'var(--space-5)' }}>
                <div style={fieldLabelStyle}>Eligibility</div>
                <p style={{ color: 'var(--color-text-light)', fontSize: 'var(--text-sm)', marginTop: 4 }}>{activeCategory.eligibility}</p>
              </div>
            )}

            <div style={{ marginBottom: 'var(--space-5)' }}>
              <div style={fieldLabelStyle}>Entrance Examination</div>
              <p style={{ color: 'var(--color-primary-dark)', fontSize: 'var(--text-sm)', fontWeight: 700, marginTop: 4 }}>{activeCategory.examName}</p>
            </div>

            <div>
              <div style={fieldLabelStyle}>Admission Process</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 'var(--space-2)', marginTop: 'var(--space-2)' }}>
                {activeCategory.steps.map((step, i) => (
                  <div key={step} style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                    <span style={{ background: 'var(--color-off-white)', border: '1px solid var(--color-light-gray)', borderRadius: 'var(--radius-sm)', padding: 'var(--space-2) var(--space-4)', fontSize: 'var(--text-sm)', fontWeight: 700, color: 'var(--color-primary-dark)' }}>
                      {step}
                    </span>
                    {i < activeCategory.steps.length - 1 && (
                      <ArrowRight size={16} strokeWidth={2.2} style={{ color: 'var(--color-accent)', flexShrink: 0 }} />
                    )}
                  </div>
                ))}
              </div>
            </div>

            {activeCategory.codes && (
              <div style={{ marginTop: 'var(--space-5)' }}>
                <div style={fieldLabelStyle}>AP EAPCET Codes</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)', marginTop: 'var(--space-2)' }}>
                  {activeCategory.codes.map((c) => (
                    <div key={c.code} style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-3)', alignItems: 'baseline' }}>
                      <span style={{ fontWeight: 900, color: 'var(--color-primary)', fontSize: 'var(--text-sm)', minWidth: 70 }}>{c.code}</span>
                      <span style={{ color: 'var(--color-text-light)', fontSize: 'var(--text-sm)' }}>{c.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeCategory.key === 'B' && (
              <p style={{ color: 'var(--color-text-light)', fontSize: 'var(--text-xs)', marginTop: 'var(--space-5)', fontStyle: 'italic' }}>
                {CATEGORY_B_FOOTNOTE}
              </p>
            )}
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
