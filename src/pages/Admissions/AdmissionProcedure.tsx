import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Check } from 'lucide-react';
import PageHero from '../../components/PageHero/PageHero';
import { useContentBlocks } from '../../hooks/useContentBlocks';
import { admissionTabs, CATEGORY_B_FOOTNOTE } from './admissionProcedure.data';
import { dotTech } from '../../lib/academicDegreeNames';
import './AdmissionProcedure.css';
/** Split "Name (note)" -> ["Name", "note"]; no parens -> ["Name", ""]. */
const splitNote = (s: string): [string, string] => {
  const m = s.match(/^(.*?)\s*\(([^)]+)\)\s*$/);
  return m ? [m[1], m[2]] : [s, ''];
};

export default function AdmissionProcedure() {
  const documents = useContentBlocks('admission-procedure', 'documents');

  const [activeTabKey, setActiveTabKey] = useState(admissionTabs[0].key);
  const activeTab = admissionTabs.find((t) => t.key === activeTabKey) ?? admissionTabs[0];
  const [activeCatKey, setActiveCatKey] = useState(admissionTabs[0].categories[0].key);
  const activeCat = activeTab.categories.find((c) => c.key === activeCatKey) ?? activeTab.categories[0];
  const [progName, progNote] = splitNote(dotTech(activeTab.label));
  const showCategoryTabs = activeTab.categories.length > 0;
  const catIsVwunet = /VWUNET/.test(activeCat.examName);

  const selectTab = (key: string) => {
    setActiveTabKey(key);
    const next = admissionTabs.find((t) => t.key === key);
    setActiveCatKey(next?.categories[0].key ?? 'A');
  };

  useEffect(() => {
    document.title = 'Admission Procedure | VWU';
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );
    document.querySelectorAll('.reveal').forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <main className="page-wrapper ap">
      <PageHero
        page="admission-procedure"
        defaultTitle="Admission Procedure"
        defaultSubtitle="Which entrance exam applies to you, who can apply, and every step from application to enrolment."
        breadcrumb={[{ label: 'Home', to: '/' }, { label: 'Admissions', to: '/admissions' }, { label: 'Admission Procedure' }]}
        hideCta
      />

      <section className="ap-codes">
        <div className="container ap-codes__inner">
          <span className="ap-codes__exams">EAPCET | ECET | PGCET | ICET</span>
          <span className="ap-codes__code">CODES: VISW & VISWPU</span>
        </div>
      </section>

      <section className="section ap-main" id="admission-procedure-content">
        <div className="container">
          <header className="ap-lead reveal">
            <p className="ap-lead__title">Find your pathway</p>
            <p className="ap-lead__text">
             Choose your programme to explore the applicable entrance exam, eligibility criteria, and the steps involved in the admission process.
            </p>
          </header>

          <div className="ap-switch" role="tablist" aria-label="Programme">
            {admissionTabs.map((t) => {
              const isActive = t.key === activeTab.key;
              return (
                <button
                  key={t.key}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  className={`ap-switch__btn${isActive ? ' is-active' : ''}`}
                  onClick={() => selectTab(t.key)}
                >
                  {dotTech(splitNote(t.label)[0])}
                </button>
              );
            })}
          </div>

          <div className="ap-panel">
            <h2 className="ap-panel__name">
              {progName}
              {progNote && <span className="ap-panel__note"> ({dotTech(progNote)})</span>}
            </h2>
            <p className="ap-panel__intro">{dotTech(activeTab.intro)}</p>

            {showCategoryTabs && (
              <div className="ap-subswitch" role="tablist" aria-label="Admission category">
                {activeTab.categories.map((c) => {
                  const on = c.key === activeCat.key;
                  return (
                    <button
                      key={c.key}
                      type="button"
                      role="tab"
                      aria-selected={on}
                      className={`ap-subswitch__btn${on ? ' is-active' : ''}`}
                      onClick={() => setActiveCatKey(c.key)}
                    >
                      Category {c.key}
                    </button>
                  );
                })}
              </div>
            )}

            <article className="ap-route">
              <h3 className="ap-route__exam">{dotTech(activeCat.examName)}</h3>
              <p className="ap-route__desc">{dotTech(activeCat.description)}</p>

              {catIsVwunet && (
                <p className="ap-route__more">
                  <Link to="/vwunet">About VWUNET and the test format</Link>
                </p>
              )}

              {activeCat.eligibility && (
                <p className="ap-route__who">
                  <span className="ap-route__who-tag">Who can apply</span>
                  {dotTech(activeCat.eligibility)}
                  {activeCat.eligibilityMoreUrl && (
                    <>
                      {' '}
                      {/^https?:\/\//.test(activeCat.eligibilityMoreUrl) ? (
                        <a
                          className="ap-route__who-link"
                          href={activeCat.eligibilityMoreUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Full eligibility details
                        </a>
                      ) : (
                        <Link className="ap-route__who-link" to={activeCat.eligibilityMoreUrl}>
                          Full eligibility details
                        </Link>
                      )}
                    </>
                  )}
                </p>
              )}

              <div className="ap-track">
                <p className="ap-track__title">How admission works</p>
                <ol className="ap-track__steps">
                  {activeCat.steps.map((step, i) => (
                    <li key={step} className="ap-track__step">
                      <span className="ap-track__num">{i + 1}</span>
                      <span className="ap-track__name">{dotTech(step)}</span>
                    </li>
                  ))}
                </ol>
              </div>

              {activeCat.codes && (
                <dl className="ap-codes-def">
                  <dt>College codes for counselling</dt>
                  {activeCat.codes.map((c) => (
                    <div key={c.code} className="ap-codes-def__row">
                      <span className="ap-codes-def__key">{c.code}</span>
                      <span className="ap-codes-def__val">{c.label}</span>
                    </div>
                  ))}
                </dl>
              )}

              {activeCat.key === 'B' && <p className="ap-route__foot">{dotTech(CATEGORY_B_FOOTNOTE)}</p>}
            </article>
          </div>
        </div>
      </section>

      <section className="section ap-docs">
        <div className="container">
          <header className="ap-docs__head reveal">
            <span className="section-label section-label--dark">Before you apply</span>
            <h2 className="ap-docs__title">Documents to keep ready</h2>
          </header>
          <ul className="ap-docs__grid">
            {documents.map((doc) => (
              <li key={doc.id} className="ap-docs__item">
                <Check size={16} strokeWidth={2.5} />
                <span>{dotTech(doc.title || '')}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="ap-cta">
        <div className="container ap-cta__inner reveal">
          <h2 className="ap-cta__title">Ready to apply?</h2>
          <p className="ap-cta__text">
            Check the fee structure and recent results, or go back to the admissions overview.
          </p>
          <div className="ap-cta__actions">
            <Link to="/programmes-fee-structure" className="btn btn-accent">View fee structure</Link>
            <Link to="/result-analysis" className="btn btn-secondary">Results analysis</Link>
            <Link to="/admissions" className="btn btn-secondary">Admissions home</Link>
          </div>
        </div>
      </section>
    </main>
  );
}
