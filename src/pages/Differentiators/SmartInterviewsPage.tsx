import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Users, ArrowRight, Award } from 'lucide-react';
import {
  CustomSectionsIntro,
  CustomSectionsGalleries,
} from '../../components/CustomSectionsRenderer/CustomSectionsRenderer';
import { hasCustomSectionContent } from '../../lib/customSections';
import type { DifferentiatorItemDoc } from '../Admin/sections/DifferentiatorsAdmin';
import type { CustomSection } from '../../lib/customSections';
import { smartInterviews } from './smartInterviews.data';
import { useDocument } from '../../hooks/useDocument';
import type { SmartInterviewsDoc } from '../Admin/sections/SmartInterviewsContentAdmin';
import { renderBold } from '../../lib/boldText';
import './smart-interviews.css';

interface SmartInterviewsPageProps {
  item: DifferentiatorItemDoc;
  customSections?: CustomSection[];
}

export default function SmartInterviewsPage({
  item,
  customSections = [],
}: SmartInterviewsPageProps) {
  // Navigation grid click state for details panel
  const [activeSectionId, setActiveSectionId] = useState<string | null>(null);
  const { data: remoteData } = useDocument<SmartInterviewsDoc>('settings', 'smartInterviews');
  const siData = { ...smartInterviews, ...(remoteData || {}) };

  const toggleSection = (id: string) => {
    setActiveSectionId((prev) => (prev === id ? null : id));
  };

  const heroImg = item?.heroImage || '/images/vibrant-campus.png';
  const pageTitle =
    siData.pageTitle ||
    (item?.title
      ? item.title.includes('–') || item.title.includes('-')
        ? item.title
        : `${item.title} – C&DS Programme`
      : 'Smart Interviews – C&DS Programme');

  const dynamicSubtitle =
    siData.heroSubtitle ||
    item?.summary ||
    item?.desc ||
    'Intensive Data Structures and Algorithms training empowering students with advanced problem-solving skills to secure high-value tech placements at top global product companies.';

  const dynamicAbout =
    siData.aboutDesc ||
    (item?.description && hasCustomSectionContent(item.description) && item.description.textContent) ||
    item?.desc ||
    'The curriculum spans three phases across three semesters: Phase 1 covers programming fundamentals and complexity analysis; Phase 2 addresses sorting, hashing, and string operations; Phase 3 focuses on advanced data structures including trees, dynamic programming, and graph theory. Up to 400 students are selected annually via HackerRank coding contests, and students are mentored by previously placed graduates.';

  return (
    <div className="si-page">
      {/* TOP HERO BANNER */}
      <section className="si-top-hero-banner">
        {heroImg && (
          <img src={heroImg} alt={pageTitle} className="si-top-hero-bg" loading="eager" />
        )}
        <div className="si-top-hero-overlay" />
        <div className="si-top-hero-container">
          <div className="si-top-hero-badge">
            <Award size={13} />
            <span>{siData.heroBadge || 'STUDENT EMPLOYMENT & PLACEMENT'}</span>
          </div>
          <h1 className="si-top-hero-title">{pageTitle}</h1>
          <p className="si-top-hero-desc">{renderBold(dynamicSubtitle)}</p>
        </div>
      </section>

      {/* SECTION 1: HERO OVERVIEW BLOCK (DARK NAVY) */}
      <section className="si-hero-section">
        <div className="si-hero-container">
          <div className="si-hero-grid">
            {/* Left Column */}
            <div className="si-hero-left">
              <div className="si-hero-tag">{siData.aboutTag || 'CAREER PREPARATION'}</div>
              <h1 className="si-hero-title">
                {siData.aboutTitle || 'Smart'}<br />
                <span className="si-hero-title-blue">{siData.aboutTitleBlue || 'Interviews'}</span>
              </h1>
              <p className="si-hero-desc">{renderBold(dynamicAbout)}</p>
              <div className="si-hero-keywords">
                {siData.aboutKeywords || 'PRACTICE / PROBLEM SOLVE / GET PLACED'}
              </div>
            </div>

            {/* Right Column */}
            <div className="si-hero-right">
              <div className="si-hero-right-header">
                <div className="si-hero-path-tag" style={{ whiteSpace: 'pre-line' }}>
                  {siData.pathTag || 'A STRUCTURED PATH\nFROM LEARNING TO PLACEMENT'}
                </div>
                <div className="si-code-comments" style={{ whiteSpace: 'pre-line' }}>
                  {siData.codeComments || '// CODE\n// LEARN\n// GROW\n// SUCCEED'}
                </div>
              </div>

              {/* 2x2 Metrics Grid */}
              <div className="si-metrics-grid">
                {/* Metric 1 */}
                <div className="si-metric-card">
                  <div className="si-metric-number blue">{siData.metricPhasesValue || '3'}</div>
                  <div className="si-metric-label">{siData.metricPhasesLabel || 'PHASES'}</div>
                  <p className="si-metric-subtext">
                    {siData.metricPhasesSubtext || 'Structured curriculum for complete preparation'}
                  </p>
                </div>

                {/* Metric 2 */}
                <div className="si-metric-card">
                  <div className="si-metric-number yellow">{siData.metricSemestersValue || '3'}</div>
                  <div className="si-metric-label">{siData.metricSemestersLabel || 'SEMESTERS'}</div>
                  <p className="si-metric-subtext">
                    {siData.metricSemestersSubtext || 'Progressive learning across core and advanced topics'}
                  </p>
                </div>

                {/* Metric 3 */}
                <div className="si-metric-card">
                  <div className="si-metric-number yellow">{siData.metricStudentsValue || '400'}</div>
                  <div className="si-metric-label">{siData.metricStudentsLabel || 'STUDENTS ANNUALLY'}</div>
                  <p className="si-metric-subtext">
                    {siData.metricStudentsSubtext || 'Selected via HackerRank coding contests'}
                  </p>
                </div>

                {/* Metric 4 */}
                <div className="si-metric-card">
                  <div className="si-metric-icon">
                    <Users size={20} />
                  </div>
                  <div className="si-metric-label">{siData.metricMentorshipLabel || 'MENTORSHIP'}</div>
                  <p className="si-metric-subtext">
                    {siData.metricMentorshipSubtext || 'Guided by previously placed graduates'}
                  </p>
                </div>
              </div>

              <div className="si-hero-tagline-bottom">
                {siData.aboutTagline || 'SAME LEARNERS. BIGGER TOMORROWS.'}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 2: TRAINING PHASES ROADMAP */}
      <section className="si-roadmap-section">
        <div className="si-roadmap-header">
          <div>
            <div className="si-roadmap-tag">{siData.roadmapTag || 'LEARNING ROADMAP'}</div>
            <h2 className="si-roadmap-title">{siData.roadmapTitle || 'Training Phases'}</h2>
          </div>
          <div className="si-roadmap-right-tag">
            {siData.roadmapRightTag || 'BUILDING PROBLEM SOLVERS FOR TOMORROW'}
          </div>
        </div>

        <div className="si-phases-timeline">
          <div className="si-phases-line" />

          {siData.phases.map((phase, idx) => (
            <div key={idx} className="si-phase-card-item">
              <div className={`si-phase-badge-box ${idx === 0 ? 'active' : 'inactive'}`}>0{idx + 1}</div>
              <div>
                <h3 className="si-phase-name">{phase.label}</h3>
                <p className="si-phase-content-text">{renderBold(phase.content)}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 3: NAVIGATION LINKS GRID */}
      <section className="si-nav-section">
        <div className="si-nav-grid">
          {/* Left Column */}
          <div>
            <div className="si-nav-col-header">EXPLORE MORE</div>
            <div className="si-nav-list">
              {/* Item 02 */}
              <div className="si-nav-item-card" onClick={() => toggleSection('02')}>
                <div className="si-nav-item-left">
                  <span className="si-nav-item-num">02</span>
                  <span className="si-nav-item-title">{siData.details02Title || 'Program Details'}</span>
                </div>
                <ArrowRight size={16} className="si-nav-item-arrow" />
              </div>
              {activeSectionId === '02' && (
                <div className="si-accordion-detail-card">
                  {siData.moreParagraphs.map((p, i) => (
                    <p key={i} style={{ margin: i === siData.moreParagraphs.length - 1 ? 0 : '0 0 0.9rem' }}>
                      {renderBold(p)}
                    </p>
                  ))}
                </div>
              )}

              {/* Item 03 */}
              <div className="si-nav-item-card" onClick={() => toggleSection('03')}>
                <div className="si-nav-item-left">
                  <span className="si-nav-item-num">03</span>
                  <span className="si-nav-item-title">
                    {siData.batchesHeading ||
                      'Training (3-Phases) Completed & Placed students Batch wise with high packages.'}
                  </span>
                </div>
                <ArrowRight size={16} className="si-nav-item-arrow" />
              </div>
              {activeSectionId === '03' && (
                <div className="si-accordion-detail-card">
                  <p style={{ margin: 0, fontWeight: 600 }}>
                    {siData.batchesSubHeading || 'Placements Batch Wise (10 LPA – 50 LPA):'}
                  </p>
                  <div className="si-batch-grid">
                    {siData.batches.map((b, i) => (
                      <div key={i} className="si-batch-item">
                        <div className="si-batch-year">{b.years}</div>
                        <div className="si-batch-count">{b.count} Placed</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Item 04 */}
              <div className="si-nav-item-card" onClick={() => toggleSection('04')}>
                <div className="si-nav-item-left">
                  <span className="si-nav-item-num">04</span>
                  <span className="si-nav-item-title">{siData.highlightsTitle || 'Key Highlights'}</span>
                </div>
                <ArrowRight size={16} className="si-nav-item-arrow" />
              </div>
              {activeSectionId === '04' && (
                <div className="si-accordion-detail-card">
                  {(() => {
                    const bullets: string[] =
                      siData.highlightsList && siData.highlightsList.length > 0
                        ? siData.highlightsList
                        : siData.highlightsContent
                        ? siData.highlightsContent
                            .split('\n')
                            .map((s) => s.trim())
                            .filter(Boolean)
                        : (smartInterviews.highlightsList || []);
                    return (
                      <ul className="si-bullets-list">
                        {bullets.map((bullet, idx) => (
                          <li key={idx}>
                            {renderBold(bullet)}
                          </li>
                        ))}
                      </ul>
                    );
                  })()}
                </div>
              )}
            </div>
          </div>

          {/* Right Column */}
          <div>
            <div className="si-nav-col-header">DETAILED INFORMATION</div>
            <div className="si-nav-list">
              {/* Item 05 */}
              <div className="si-nav-item-card" onClick={() => toggleSection('05')}>
                <div className="si-nav-item-left">
                  <span className="si-nav-item-num">05</span>
                  <span className="si-nav-item-title">{siData.facilitiesTitle || 'Facilities & Equipment'}</span>
                </div>
                <ArrowRight size={16} className="si-nav-item-arrow" />
              </div>
              {activeSectionId === '05' && (
                <div className="si-accordion-detail-card">
                  {renderBold(
                    siData.facilitiesContent ||
                      'High-speed computing labs, online contest platforms (HackerRank, CodeChef, Codeforces), automated leaderboard evaluation systems, and dedicated interactive training centers.'
                  )}
                </div>
              )}

              {/* Item 06 */}
              <div className="si-nav-item-card" onClick={() => toggleSection('06')}>
                <div className="si-nav-item-left">
                  <span className="si-nav-item-num">06</span>
                  <span className="si-nav-item-title">{siData.outcomesTitle || 'Outcomes & Achievements'}</span>
                </div>
                <ArrowRight size={16} className="si-nav-item-arrow" />
              </div>
              {activeSectionId === '06' && (
                <div className="si-accordion-detail-card">
                  {renderBold(
                    siData.outcomesContent ||
                      'Over 970+ students placed in top MNCs over the past 7 years with salary packages ranging from 10 LPA up to 50 LPA.'
                  )}
                </div>
              )}

              {/* Item 07 */}
              <div className="si-nav-item-card" onClick={() => toggleSection('07')}>
                <div className="si-nav-item-left">
                  <span className="si-nav-item-num">07</span>
                  <span className="si-nav-item-title">{siData.partnersTitle || 'Partners'}</span>
                </div>
                <ArrowRight size={16} className="si-nav-item-arrow" />
              </div>
              {activeSectionId === '07' && (
                <div className="si-accordion-detail-card">
                  {renderBold(
                    siData.partnersContent ||
                      'Smart Interviews, HackerRank, TCS (CodeVita), Infosys (HackWithInfy), CodeChef, and Codeforces.'
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 4: HIGHLIGHT STATS BANNER */}
      <section className="si-banner-section">
        <div className="si-banner-card">
          <div className="si-banner-col1">
            <span className="si-banner-col1-text">{siData.bannerCol1Line1 || 'TALENT TODAY'}</span>
            <span className="si-banner-col1-text">{siData.bannerCol1Line2 || 'OPPORTUNITIES TOMORROW'}</span>
            <div className="si-banner-col1-line" />
          </div>

          <div className="si-banner-col2">
            <div className="si-banner-stat-num">{siData.bannerStatNum || '400'}</div>
            <div>
              <div className="si-banner-stat-label">{siData.bannerStatLabel || 'STUDENTS ANNUALLY'}</div>
              <p className="si-banner-stat-desc">
                {renderBold(
                  siData.bannerStatDesc ||
                    'Selected via HackerRank coding contests, and students are mentored by previously placed graduates.'
                )}
              </p>
            </div>
          </div>

          <div className="si-banner-col3" style={{ whiteSpace: 'pre-line' }}>
            {siData.bannerCol3Text || 'SKILLS\nOPPORTUNITIES\nGLOBAL CAREERS'}
          </div>
        </div>
      </section>

      {/* DYNAMIC ADDITIONAL CUSTOM SECTIONS */}
      {siData.additionalSections && siData.additionalSections.length > 0 && (
        <section className="section bg-white" style={{ padding: '2.5rem 0 1rem' }}>
          <div className="container" style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
              {siData.additionalSections.map((sec, idx) => (
                <div
                  key={sec.id || idx}
                  style={{
                    background: '#ffffff',
                    border: '1px solid #e2e8f0',
                    borderRadius: '12px',
                    padding: '2rem',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                  }}
                >
                  {sec.badge && (
                    <div
                      style={{
                        display: 'inline-block',
                        padding: '0.2rem 0.65rem',
                        background: '#e0f2fe',
                        color: '#0369a1',
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        borderRadius: '4px',
                        textTransform: 'uppercase',
                        marginBottom: '0.5rem',
                      }}
                    >
                      {sec.badge}
                    </div>
                  )}
                  <h3 style={{ margin: '0 0 1rem', fontSize: '1.35rem', fontWeight: 700, color: '#0f172a' }}>
                    {sec.title}
                  </h3>
                  {sec.paragraphs && sec.paragraphs.length > 0 && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1rem' }}>
                      {sec.paragraphs.map((p, pIdx) => (
                        <p key={pIdx} style={{ margin: 0, color: '#334155', lineHeight: 1.65 }}>
                          {renderBold(p)}
                        </p>
                      ))}
                    </div>
                  )}
                  {sec.bulletPoints && sec.bulletPoints.length > 0 && (
                    <ul style={{ margin: 0, paddingLeft: '1.25rem', color: '#334155', lineHeight: 1.7 }}>
                      {sec.bulletPoints.map((bp, bpIdx) => (
                        <li key={bpIdx}>{renderBold(bp)}</li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* DYNAMIC CUSTOM SECTIONS (FROM ITEM) */}
      {customSections.some((s) => s.placement === 'intro') && (
        <section className="section bg-white" style={{ padding: '2rem 0' }}>
          <div className="container">
            <CustomSectionsIntro sections={customSections} />
          </div>
        </section>
      )}
      {customSections.some((s) => s.contentType === 'gallery') && (
        <section className="section bg-white" style={{ padding: '2rem 0' }}>
          <div className="container">
            <CustomSectionsGalleries sections={customSections} />
          </div>
        </section>
      )}

      {/* SECTION 5: DARK CTA BANNER */}
      <section className="si-cta-section">
        <div className="si-cta-container">
          <div className="si-cta-main">
            <div className="si-cta-tag">{siData.ctaTag || 'YOUR NEXT OPPORTUNITY AWAITS'}</div>
            <h2 className="si-cta-title">{siData.ctaTitle || 'Explore More Differentiators'}</h2>
            <p className="si-cta-desc">
              {siData.ctaDesc ||
                'Discover all the unique initiatives, labs, and centres that make VWU an extraordinary place to learn and grow.'}
            </p>
            <Link to={siData.ctaButtonLink || '/differentiators'} className="si-cta-btn">
              {siData.ctaButtonText || 'All Differentiators'} <ArrowRight size={16} />
            </Link>
          </div>

          <div className="si-cta-tech-panel">
            <div className="si-cta-tech-box" style={{ whiteSpace: 'pre-line' }}>
              {siData.ctaTechBox || 'BETTER\nLEARNERS\nBRIGHTER\nFUTURES'}
            </div>
            <div className="si-cta-keywords-right" style={{ whiteSpace: 'pre-line' }}>
              {siData.ctaKeywords || 'LEARN\nEXPLORE\nGROW\nBELONG'}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
