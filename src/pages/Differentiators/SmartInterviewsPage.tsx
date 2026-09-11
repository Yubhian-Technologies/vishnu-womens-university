import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Users, ArrowRight, Award } from 'lucide-react';
import type { DifferentiatorItemDoc } from '../Admin/sections/DifferentiatorsAdmin';
import type { CustomSection } from '../../lib/customSections';
import { smartInterviews } from './smartInterviews.data';
import './smart-interviews.css';

interface SmartInterviewsPageProps {
  item: DifferentiatorItemDoc;
  customSections: CustomSection[];
}

export default function SmartInterviewsPage({
  item,
  customSections: _customSections,
}: SmartInterviewsPageProps) {
  // Navigation grid click state for details panel
  const [activeSectionId, setActiveSectionId] = useState<string | null>(null);

  const toggleSection = (id: string) => {
    setActiveSectionId((prev) => (prev === id ? null : id));
  };

  const heroImg = item?.heroImage || '/images/vibrant-campus.png';
  const pageTitle = item?.title
    ? (item.title.includes('–') || item.title.includes('-') ? item.title : `${item.title} – C&DS Programme`)
    : 'Smart Interviews – C&DS Programme';

  return (
    <div className="si-page">
      {/* TOP HERO BANNER */}
      <section className="si-top-hero-banner">
        {heroImg && (
          <img src={heroImg} alt={item?.title || 'Smart Interviews'} className="si-top-hero-bg" loading="eager" />
        )}
        <div className="si-top-hero-overlay" />
        <div className="si-top-hero-container">
          <div className="si-top-hero-badge">
            <Award size={13} />
            <span>STUDENT EMPLOYMENT &amp; PLACEMENT</span>
          </div>
          <h1 className="si-top-hero-title">{pageTitle}</h1>
          <p className="si-top-hero-desc">
            Intensive Data Structures and Algorithms training empowering students with advanced problem-solving skills to secure high-value tech placements at top global product companies.
          </p>
        </div>
      </section>

      {/* SECTION 1: HERO OVERVIEW BLOCK (DARK NAVY) */}
      <section className="si-hero-section">
        <div className="si-hero-container">
          <div className="si-hero-grid">
            {/* Left Column */}
            <div className="si-hero-left">
              <div className="si-hero-tag">CAREER PREPARATION</div>
              <h1 className="si-hero-title">
                Smart<br />
                <span className="si-hero-title-blue">Interviews</span>
              </h1>
              <p className="si-hero-desc">
                The curriculum spans three phases across three semesters: Phase 1 covers programming fundamentals and complexity analysis; Phase 2 addresses sorting, hashing, and string operations; Phase 3 focuses on advanced data structures including trees, dynamic programming, and graph theory. Up to 400 students are selected annually via HackerRank coding contests, and students are mentored by previously placed graduates.
              </p>
              <div className="si-hero-keywords">
                PRACTICE &nbsp;/&nbsp; PROBLEM SOLVE &nbsp;/&nbsp; GET PLACED
              </div>
            </div>

            {/* Right Column */}
            <div className="si-hero-right">
              <div className="si-hero-right-header">
                <div className="si-hero-path-tag">
                  A STRUCTURED PATH<br />FROM LEARNING TO PLACEMENT
                </div>
                <div className="si-code-comments">
                  // CODE<br />
                  // LEARN<br />
                  // GROW<br />
                  // SUCCEED
                </div>
              </div>

              {/* 2x2 Metrics Grid */}
              <div className="si-metrics-grid">
                {/* Metric 1 */}
                <div className="si-metric-card">
                  <div className="si-metric-number blue">3</div>
                  <div className="si-metric-label">PHASES</div>
                  <p className="si-metric-subtext">Structured curriculum for complete preparation</p>
                </div>

                {/* Metric 2 */}
                <div className="si-metric-card">
                  <div className="si-metric-number yellow">3</div>
                  <div className="si-metric-label">SEMESTERS</div>
                  <p className="si-metric-subtext">Progressive learning across core and advanced topics</p>
                </div>

                {/* Metric 3 */}
                <div className="si-metric-card">
                  <div className="si-metric-number yellow">400</div>
                  <div className="si-metric-label">STUDENTS ANNUALLY</div>
                  <p className="si-metric-subtext">Selected via HackerRank coding contests</p>
                </div>

                {/* Metric 4 */}
                <div className="si-metric-card">
                  <div className="si-metric-icon">
                    <Users size={20} />
                  </div>
                  <div className="si-metric-label">MENTORSHIP</div>
                  <p className="si-metric-subtext">Guided by previously placed graduates</p>
                </div>
              </div>

              <div className="si-hero-tagline-bottom">
                SAME LEARNERS. BIGGER TOMORROWS.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 2: TRAINING PHASES ROADMAP */}
      <section className="si-roadmap-section">
        <div className="si-roadmap-header">
          <div>
            <div className="si-roadmap-tag">LEARNING ROADMAP</div>
            <h2 className="si-roadmap-title">Training Phases</h2>
          </div>
          <div className="si-roadmap-right-tag">
            BUILDING PROBLEM SOLVERS FOR TOMORROW
          </div>
        </div>

        <div className="si-phases-timeline">
          <div className="si-phases-line" />

          {/* Phase 1 */}
          <div className="si-phase-card-item">
            <div className="si-phase-badge-box active">01</div>
            <div>
              <h3 className="si-phase-name">Phase-1</h3>
              <p className="si-phase-content-text">
                Basics of Programming, Data types & operators, Complexity Analysis, Bit-Manipulation & Applications, Recursion / Backtracking.
              </p>
            </div>
          </div>

          {/* Phase 2 */}
          <div className="si-phase-card-item">
            <div className="si-phase-badge-box inactive">02</div>
            <div>
              <h3 className="si-phase-name">Phase-2</h3>
              <p className="si-phase-content-text">
                Sorting / Searching Techniques & Applications, Hashing Implementation & Libraries, Subarrays & Subsequences, Strings & Rolling Hash, Mixed-bag Concepts.
              </p>
            </div>
          </div>

          {/* Phase 3 */}
          <div className="si-phase-card-item">
            <div className="si-phase-badge-box inactive">03</div>
            <div>
              <h3 className="si-phase-name">Phase-3</h3>
              <p className="si-phase-content-text">
                Stacks & Queues, Linked Lists, LRU Cache, Trees / Binary Tries / Binary Search Trees, Priority Queues, Trie DS & Applications, Dynamic Programming, Graph Theory.
              </p>
            </div>
          </div>
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
              <div
                className="si-nav-item-card"
                onClick={() => toggleSection('02')}
              >
                <div className="si-nav-item-left">
                  <span className="si-nav-item-num">02</span>
                  <span className="si-nav-item-title">Program Details</span>
                </div>
                <ArrowRight size={16} className="si-nav-item-arrow" />
              </div>
              {activeSectionId === '02' && (
                <div className="si-accordion-detail-card">
                  {smartInterviews.moreParagraphs.map((p, i) => (
                    <p key={i} style={{ margin: i === smartInterviews.moreParagraphs.length - 1 ? 0 : '0 0 0.9rem' }}>{p}</p>
                  ))}
                </div>
              )}

              {/* Item 03 */}
              <div
                className="si-nav-item-card"
                onClick={() => toggleSection('03')}
              >
                <div className="si-nav-item-left">
                  <span className="si-nav-item-num">03</span>
                  <span className="si-nav-item-title">
                    Training (3-Phases) Completed & Placed students Batch wise with high packages.
                  </span>
                </div>
                <ArrowRight size={16} className="si-nav-item-arrow" />
              </div>
              {activeSectionId === '03' && (
                <div className="si-accordion-detail-card">
                  <p style={{ margin: 0, fontWeight: 600 }}>Placements Batch Wise (10 LPA – 50 LPA):</p>
                  <div className="si-batch-grid">
                    {smartInterviews.batches.map((b, i) => (
                      <div key={i} className="si-batch-item">
                        <div className="si-batch-year">{b.years}</div>
                        <div className="si-batch-count">{b.count} Placed</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Item 04 */}
              <div
                className="si-nav-item-card"
                onClick={() => toggleSection('04')}
              >
                <div className="si-nav-item-left">
                  <span className="si-nav-item-num">04</span>
                  <span className="si-nav-item-title">Key Highlights</span>
                </div>
                <ArrowRight size={16} className="si-nav-item-arrow" />
              </div>
              {activeSectionId === '04' && (
                <div className="si-accordion-detail-card">
                  High success rates in top product companies (Amazon, Flipkart, Adobe, Palo Alto Networks), college financial sponsorship for ACM-ICPC contests, active peer mentorship by placed final-year seniors, and continuous 7-year track record.
                </div>
              )}
            </div>
          </div>

          {/* Right Column */}
          <div>
            <div className="si-nav-col-header">DETAILED INFORMATION</div>
            <div className="si-nav-list">
              {/* Item 05 */}
              <div
                className="si-nav-item-card"
                onClick={() => toggleSection('05')}
              >
                <div className="si-nav-item-left">
                  <span className="si-nav-item-num">05</span>
                  <span className="si-nav-item-title">Facilities & Equipment</span>
                </div>
                <ArrowRight size={16} className="si-nav-item-arrow" />
              </div>
              {activeSectionId === '05' && (
                <div className="si-accordion-detail-card">
                  High-speed computing labs, online contest platforms (HackerRank, CodeChef, Codeforces), automated leaderboard evaluation systems, and dedicated interactive training centers.
                </div>
              )}

              {/* Item 06 */}
              <div
                className="si-nav-item-card"
                onClick={() => toggleSection('06')}
              >
                <div className="si-nav-item-left">
                  <span className="si-nav-item-num">06</span>
                  <span className="si-nav-item-title">Outcomes & Achievements</span>
                </div>
                <ArrowRight size={16} className="si-nav-item-arrow" />
              </div>
              {activeSectionId === '06' && (
                <div className="si-accordion-detail-card">
                  Over 970+ students placed in top MNCs over the past 7 years with salary packages ranging from 10 LPA up to 50 LPA.
                </div>
              )}

              {/* Item 07 */}
              <div
                className="si-nav-item-card"
                onClick={() => toggleSection('07')}
              >
                <div className="si-nav-item-left">
                  <span className="si-nav-item-num">07</span>
                  <span className="si-nav-item-title">Partners</span>
                </div>
                <ArrowRight size={16} className="si-nav-item-arrow" />
              </div>
              {activeSectionId === '07' && (
                <div className="si-accordion-detail-card">
                  Smart Interviews, HackerRank, TCS (CodeVita), Infosys (HackWithInfy), CodeChef, and Codeforces.
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
            <span className="si-banner-col1-text">TALENT TODAY</span>
            <span className="si-banner-col1-text">OPPORTUNITIES TOMORROW</span>
            <div className="si-banner-col1-line" />
          </div>

          <div className="si-banner-col2">
            <div className="si-banner-stat-num">400</div>
            <div>
              <div className="si-banner-stat-label">STUDENTS ANNUALLY</div>
              <p className="si-banner-stat-desc">
                Selected via HackerRank coding contests, and students are mentored by previously placed graduates.
              </p>
            </div>
          </div>

          <div className="si-banner-col3">
            SKILLS<br />
            OPPORTUNITIES<br />
            GLOBAL CAREERS
          </div>
        </div>
      </section>

      {/* SECTION 5: DARK CTA BANNER */}
      <section className="si-cta-section">
        <div className="si-cta-container">
          <div className="si-cta-main">
            <div className="si-cta-tag">YOUR NEXT OPPORTUNITY AWAITS</div>
            <h2 className="si-cta-title">Explore More Differentiators</h2>
            <p className="si-cta-desc">
              Discover all the unique initiatives, labs, and centres that make VWU an extraordinary place to learn and grow.
            </p>
            <Link to="/differentiators" className="si-cta-btn">
              All Differentiators <ArrowRight size={16} />
            </Link>
          </div>

          <div className="si-cta-tech-panel">
            <div className="si-cta-tech-box">
              BETTER<br />
              LEARNERS<br />
              BRIGHTER<br />
              FUTURES
            </div>
            <div className="si-cta-keywords-right">
              LEARN<br />
              EXPLORE<br />
              GROW<br />
              BELONG
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
