import { useEffect } from 'react';
import { Link, useParams, Navigate } from 'react-router-dom';
import { Trophy, Landmark } from 'lucide-react';
import { useOrderedCollection } from '../../hooks/useCollection';
import { usePageBanners } from '../../hooks/usePageBanners';
import { resolveContentIcon } from '../../lib/contentIcons';
import SmoothImage from '../../components/SmoothImage/SmoothImage';
import { parseStructuredTable } from '../../lib/structuredTable';
import { parseAboutContent } from '../../lib/aboutContent';
import { DEFAULT_IQAC_INTRO, DEFAULT_IQAC_ABOUT } from './iqacAboutDefault';
import { DEFAULT_QUALITY_PARAMETERS_INTRO } from './qualityParametersDefault';
import QualityParametersSection from './QualityParametersSection';
import InternalQACellSection from './InternalQACellSection';
import PoliciesListSection from '../PoliciesProcedures/PoliciesListSection';
import AnnualReportsSection from './AnnualReportsSection';
import NirfReportsSection from './NirfReportsSection';
import NbaDataSection from './NbaDataSection';
import type { GovernanceItemDoc } from '../Admin/sections/GovernanceItemsAdmin';
import '../detail-layout.css';

// Fallback intro/about for About IQAC and Quality Parameters, used only
// until an admin fills in item.intro/item.about from the Governance Items
// admin section — the Firestore value always wins once set (see below).
const DEFAULT_INTRO_BY_SLUG: Record<string, string> = {
  'about-iqac': DEFAULT_IQAC_INTRO,
  'quality-parameters': DEFAULT_QUALITY_PARAMETERS_INTRO,
};
const DEFAULT_ABOUT_BY_SLUG: Record<string, string> = {
  'about-iqac': DEFAULT_IQAC_ABOUT,
};

// Quality Parameters' item.about/item.highlights/item.outcomes in Firestore
// are currently a generic, unrelated placeholder (a synthesized "NAAC seven
// criteria" blurb, matching fabricated highlight bullets, and fabricated
// achievement cards) — this slug gets its own A/B/C/D parameter-checklist
// accordion below instead (see QualityParametersSection), so all three
// fields are suppressed regardless of what Firestore holds.
// Annual Reports & Reforms' item.about/item.highlights/item.outcomes in
// Firestore are the same kind of generic, unrelated placeholder (a
// synthesized AQAR blurb and fabricated achievement cards) — this slug gets
// its own year-by-year report archive below instead (see
// AnnualReportsSection), so those fields are suppressed here too.
const SUPPRESS_ABOUT_SLUGS = new Set(['quality-parameters', 'annual-reports']);
// IQAC Committee's sidebar column now shows the Committees quick-nav card
// instead — Key Highlights was crowding it out, so it's dropped here too.
const SUPPRESS_HIGHLIGHTS_SLUGS = new Set(['quality-parameters', 'iqac-committee', 'annual-reports']);
const SUPPRESS_OUTCOMES_SLUGS = new Set(['quality-parameters', 'annual-reports']);

// The IQAC Committee page gets a "Committees" quick-nav card (matching the
// same committee list shown in the header's Statutory > Committees menu),
// so a visitor reading about the IQAC committee can jump straight to any of
// the institution's other statutory committees. "Internal Quality Assurance
// Cell" is the entry kept highlighted, since that's the committee this page
// documents.
const IQAC_COMMITTEE_SIDEBAR_ITEMS: { label: string; path: string }[] = [
  { label: 'College Academic Committee', path: '/governance/college-academic-committee' },
  { label: 'Internal Quality Assurance Cell', path: '/governance/internal-quality-assurance-cell' },
  { label: 'Acad. & Admin. Audit Committee', path: '/governance/academic-administrative-audit' },
  { label: 'Freshmen Committee', path: '/governance/freshmen-committee' },
  { label: 'Infrastructure Management', path: '/governance/infrastructure-management' },
  { label: 'Faculty Grievance Redressal', path: '/governance/faculty-grievance' },
  { label: 'Student Grievance Redressal', path: '/governance/student-grievance' },
  { label: 'Central Purchase Committee', path: '/governance/central-purchase' },
  { label: 'Counselling & Monitoring', path: '/governance/counselling-monitoring' },
  { label: 'Anti Ragging Committee', path: '/governance/anti-ragging' },
  { label: 'Internal Committee (POSH)', path: '/governance/internal-committee' },
  { label: 'SC/ST Cell', path: '/governance/sc-st-cell' },
  { label: 'R&D Committee', path: '/governance/rd-committee' },
];
const IQAC_COMMITTEE_SIDEBAR_ACTIVE_PATH = '/governance/internal-quality-assurance-cell';

interface FacultyDoc {
  id: string;
  name: string;
  designation: string;
  department: string;
}

// Maps a Board of Studies table title to the matching FacultyAdmin department value,
// so faculty added in /admin show up under the right department's BoS table.
const BOS_DEPARTMENT_MAP: Record<string, string> = {
  'Computer Science & Engineering': 'CSE',
  'CSE [Cyber Security]': 'Cyber Security',
  'CSE [Artificial Intelligence & Data Science]': 'AI&DS',
  'CSE [Artificial Intelligence & Machine Learning]': 'AI&ML',
  'Information Technology': 'IT',
  'Electronics & Communication Engineering': 'ECE',
  'Electrical & Electronics Engineering': 'EEE',
  'Civil Engineering': 'Civil',
  'Mechanical Engineering': 'Mechanical',
  'Master of Business Administration (MBA)': 'MBA',
};

export default function GovernanceDetail() {
  const { slug } = useParams<{ slug: string }>();
  const { docs: govDocs, loading: govLoading } = useOrderedCollection<GovernanceItemDoc>('governanceItems', 'order');
  const item = govDocs.find((i) => i.slug === slug) ?? null;
  const { docs: faculty } = useOrderedCollection<FacultyDoc>('faculty', 'name');
  // Each item can have its own hero image (set in the Governance/Committees/
  // IQAC admin); falls back to the shared "Governance Detail Pages" banner.
  // No hardcoded stock-photo fallback — the hero just shows its solid
  // background color if neither is set yet.
  const { slides: heroSlides } = usePageBanners('governance-detail');
  const heroImage = item?.heroImage || heroSlides[0]?.imageUrl;

  // No scroll-reveal here — this whole page's content (including the hero
  // title) only renders once the Firestore-backed `item` has loaded, so any
  // .reveal/IntersectionObserver setup would be racing async data on every
  // navigation (see the gotcha documented in CLAUDE.md).
  useEffect(() => {
    if (item) document.title = `${item.title} | Vishnu Women's University`;
  }, [item]);

  if (!item) {
    if (govLoading) {
      return (
        <main className="route-fallback">
          <div className="route-fallback__spinner" />
        </main>
      );
    }
    return <Navigate to="/governance" replace />;
  }

  const intro = item.intro || DEFAULT_INTRO_BY_SLUG[item.slug] || '';
  const about = SUPPRESS_ABOUT_SLUGS.has(item.slug) ? '' : item.about || DEFAULT_ABOUT_BY_SLUG[item.slug] || '';
  const aboutBlocks = parseAboutContent(about);
  const highlights = SUPPRESS_HIGHLIGHTS_SLUGS.has(item.slug) ? [] : item.highlights || [];

  const parsedTable = parseStructuredTable(item.tableText);
  const tableSections = item.slug === 'board-of-studies'
    ? parsedTable.map((section) => {
        const dept = BOS_DEPARTMENT_MAP[section.title];
        const deptFaculty = dept ? faculty.filter((f) => f.department === dept) : [];
        if (deptFaculty.length === 0) return section;

        const staticRows = section.rows.filter((r) => !r.name.toLowerCase().startsWith('faculty member'));
        const facultyRows = deptFaculty.map((f) => ({ name: f.name, role: f.designation, notes: '' }));
        return { ...section, rows: [...staticRows, ...facultyRows] };
      })
    : parsedTable;

  const categoryLabel =
    item.category === 'governance' ? 'Governance'
    : item.category === 'committees' ? 'Committees'
    : 'IQAC';

  return (
    <main className="page-wrapper">
      {/* Hero */}
      <section className="page-hero" style={{ minHeight: 340 }}>
        {heroImage && (
          <img
            src={heroImage}
            alt={item.title}
            className="page-hero-image"
            loading="eager"
            decoding="sync"
            {...({ fetchpriority: 'high' } as any)}
          />
        )}
        <div className="page-hero-overlay" />
        <div className="container page-hero-content">
          <div className="breadcrumb animate-fade-in">
            <Link to="/" className="breadcrumb-item">Home</Link>
            <span className="breadcrumb-sep">›</span>
            <Link to="/governance" className="breadcrumb-item">Governance</Link>
            <span className="breadcrumb-sep">›</span>
            <span className="breadcrumb-item active">{item.title}</span>
          </div>
          <div className="animate-fade-in-up" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'var(--color-accent)', color: 'var(--color-white)', fontSize: 'var(--text-xs)', fontWeight: 700, padding: '0.3rem 0.9rem', borderRadius: 'var(--radius-full)', marginBottom: 'var(--space-3)' }}>
            {(() => { const Icon = resolveContentIcon(item.icon) || Landmark; return <Icon size={14} />; })()} {categoryLabel}
          </div>
          <h1 className="animate-fade-in-up">{item.title}</h1>
        </div>
      </section>

      {/* Overview */}
      <section className="section bg-white">
        <div className="container">
          <div className={highlights.length > 0 || item.slug === 'iqac-committee' ? 'detail-grid' : ''}>
            <div>
              <span className="section-label">Overview</span>
              <h2 className="section-title" style={{ fontSize: '1.75rem' }}>
                {item.title.toLowerCase().startsWith('about ') ? item.title : `About ${item.title}`}
              </h2>
              {intro && (
                <p style={{ fontSize: 'var(--text-lg)', color: 'var(--color-text)', lineHeight: 1.75, marginBottom: 'var(--space-5)' }}>
                  {intro}
                </p>
              )}
              {aboutBlocks.map((block, bi) => {
                if (block.type === 'heading') {
                  return (
                    <h3 key={bi} style={{ fontFamily: 'var(--font-sans)', fontSize: 'var(--text-base)', fontWeight: 700, color: 'var(--color-primary)', marginBottom: 'var(--space-3)' }}>
                      {block.text}
                    </h3>
                  );
                }
                if (block.type === 'list') {
                  return (
                    <ul key={bi} style={{ listStyle: 'none', padding: 0, margin: '0 0 var(--space-4) 0', display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                      {block.items.map((line, li) => {
                        const colonIndex = line.indexOf(':');
                        const label = colonIndex > -1 ? line.slice(0, colonIndex).trim() : '';
                        const rest = colonIndex > -1 ? line.slice(colonIndex + 1).trim() : line;
                        return (
                          <li key={li} style={{ display: 'flex', alignItems: 'flex-start', gap: 'var(--space-2)' }}>
                            <span style={{ width: 20, height: 20, borderRadius: '50%', background: 'var(--color-accent)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 3 }}>
                              <svg width="10" height="10" viewBox="0 0 10 10" fill="none"><path d="M2 5l2.5 2.5L8 3" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                            </span>
                            <span style={{ fontSize: 'var(--text-base)', color: 'var(--color-text-light)', lineHeight: 1.75 }}>
                              {label && <strong style={{ color: 'var(--color-primary)' }}>{label}: </strong>}
                              {rest}
                            </span>
                          </li>
                        );
                      })}
                    </ul>
                  );
                }
                return (
                  <p key={bi} style={{ fontSize: 'var(--text-base)', color: 'var(--color-text-light)', lineHeight: 1.75, marginBottom: 'var(--space-4)' }}>
                    {block.text}
                  </p>
                );
              })}
              {!intro && aboutBlocks.length === 0 && (
                <p style={{ fontSize: 'var(--text-lg)', color: 'var(--color-text)', lineHeight: 1.75 }}>
                  {item.desc}
                </p>
              )}
            </div>

            {(item.slug === 'iqac-committee' || highlights.length > 0) && (
              <div className="detail-sidebar">
                <div style={{ position: 'sticky', top: '110px', display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}>
                  {item.slug === 'iqac-committee' && (
                    <nav className="gov-sidenav" aria-label="Statutory committees">
                      <span className="gov-sidenav-label">Committees</span>
                      <ul>
                        {IQAC_COMMITTEE_SIDEBAR_ITEMS.map((navItem) => (
                          <li key={navItem.path}>
                            <Link
                              to={navItem.path}
                              className={`gov-sidenav-link${navItem.path === IQAC_COMMITTEE_SIDEBAR_ACTIVE_PATH ? ' active' : ''}`}
                            >
                              {navItem.label}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </nav>
                  )}
                  {highlights.length > 0 && (
                    <div style={{ background: 'var(--color-off-white)', border: '1.5px solid var(--color-light-gray)', borderRadius: 'var(--radius-md)', padding: 'var(--space-6)' }}>
                      <h3 style={{ fontFamily: 'var(--font-sans)', fontSize: 'var(--text-base)', fontWeight: 700, color: 'var(--color-primary)', marginBottom: 'var(--space-4)' }}>
                        Key Highlights
                      </h3>
                      <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                        {highlights.map((h) => (
                          <li key={h} style={{ display: 'flex', alignItems: 'flex-start', gap: 'var(--space-2)' }}>
                            <span style={{ width: 20, height: 20, borderRadius: '50%', background: 'var(--color-accent)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 1 }}>
                              <svg width="10" height="10" viewBox="0 0 10 10" fill="none"><path d="M2 5l2.5 2.5L8 3" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                            </span>
                            <span style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text)', lineHeight: 1.5 }}>{h}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* IQAC Worksystem gets a framed diagram of the VWU IQAC Work System
          Framework (the Plan/Do/Analyse/Improve cycle, stakeholders, IDP
          enablers, and quality-parameter categories), placed as its own
          full-width card below the overview text since it's a single wide
          infographic rather than something the plain intro/about copy or a
          data table could represent. */}
      {item.slug === 'iqac-worksystem' && (
        <section className="section bg-off-white">
          <div className="container">
            <div style={{ marginBottom: 'var(--space-8)' }}>
              <span className="section-label">Framework</span>
              <h2 className="section-title" style={{ fontSize: '1.75rem' }}>IQAC Work System Framework</h2>
            </div>
            <div
              style={{
                background: 'var(--color-white)',
                border: '1.5px solid var(--color-light-gray)',
                borderRadius: 'var(--radius-md)',
                padding: 'var(--space-4)',
                boxShadow: 'var(--shadow-sm)',
              }}
            >
              <SmoothImage
                src="/images/iqac-worksystem-framework.jpg"
                alt="VWU IQAC Work System Framework: stakeholder inputs and institutional pillars feed a Plan, Do, Analyse, Improve cycle alongside the Institutional Development Plan enablers, driving Quality Parameters through departments, IQAC review, and Governing Body approval."
                style={{ width: '100%', height: 'auto', display: 'block', borderRadius: 'var(--radius-sm)' }}
              />
            </div>
          </div>
        </section>
      )}

      {/* Quality Parameters gets its own A/B/C/D checklist accordion —
          richer than the plain paragraph/table content the other
          Governance/IQAC sub-pages use, so it's rendered directly instead
          of through the generic table renderer below. */}
      {item.slug === 'quality-parameters' && (
        <section className="section bg-off-white">
          <div className="container">
            <div style={{ marginBottom: 'var(--space-8)' }}>
              <span className="section-label">Details</span>
              <h2 className="section-title" style={{ fontSize: '1.75rem' }}>{item.title}</h2>
            </div>
            <QualityParametersSection />
          </div>
        </section>
      )}

      {/* Policies & Procedures gets the same admin-managed policy list
          (title + "View" link once a PDF is uploaded + description) used by
          the standalone /policies-procedures page, reading the same
          institutionalPolicies collection so the two never drift apart. */}
      {item.slug === 'policies-procedures' && (
        <section className="section bg-off-white">
          <div className="container">
            <div style={{ marginBottom: 'var(--space-8)' }}>
              <span className="section-label">Details</span>
              <h2 className="section-title" style={{ fontSize: '1.75rem' }}>Institutional Policies</h2>
            </div>
            <PoliciesListSection />
          </div>
        </section>
      )}

      {/* Annual Reports & Reforms gets a year-by-year archive of downloadable
          PDFs (College Annual Reports, Annual Examination Reports,
          Examination Reforms, Financial Audit Statements) instead of the
          plain paragraph/table content the other Governance/IQAC sub-pages
          use. */}
      {item.slug === 'annual-reports' && (
        <section className="section bg-off-white">
          <div className="container">
            <div style={{ marginBottom: 'var(--space-8)' }}>
              <span className="section-label">Details</span>
              <h2 className="section-title" style={{ fontSize: '1.75rem' }}>{item.title}</h2>
            </div>
            <AnnualReportsSection />
          </div>
        </section>
      )}

      {/* MHRD NIRF Reports gets a tabbed browser (Engineering / Innovation /
          SDG / Overall), each holding its own dated report PDFs, instead of
          the plain paragraph/table content the other Governance/IQAC subpages use. */}
      {item.slug === 'nirf-reports' && (
        <section className="section bg-off-white">
          <div className="container">
            <div style={{ marginBottom: 'var(--space-8)' }}>
              <span className="section-label">Details</span>
              <h2 className="section-title" style={{ fontSize: '1.75rem' }}>{item.title}</h2>
            </div>
            <NirfReportsSection />
          </div>
        </section>
      )}

      {/* NBA – Data Capturing Points gets a plain bulleted list of the real
          per-programme and institution-wide DCP document links, instead of
          the plain paragraph/table content the other Governance/IQAC subpages use. */}
      {item.slug === 'nba-data' && (
        <section className="section bg-off-white">
          <div className="container">
            <div style={{ marginBottom: 'var(--space-8)' }}>
              <span className="section-label">Details</span>
              <h2 className="section-title" style={{ fontSize: '1.75rem' }}>{item.title}</h2>
            </div>
            <NbaDataSection />
          </div>
        </section>
      )}

      {/* Internal Quality Assurance Cell gets its own tabbed Members/
          Functions view — the full 25-member roster needs Designation/Type
          of Membership/Position columns beyond the shared Name/Role/Notes
          table below, so it's rendered directly instead. */}
      {item.slug === 'internal-quality-assurance-cell' && (
        <section className="section bg-off-white">
          <div className="container">
            <div style={{ marginBottom: 'var(--space-8)' }}>
              <span className="section-label">Members</span>
              <h2 className="section-title" style={{ fontSize: '1.75rem' }}>{item.title}</h2>
            </div>
            <InternalQACellSection />
          </div>
        </section>
      )}

      {/* Members Table(s) */}
      {item.slug !== 'internal-quality-assurance-cell' && tableSections.length > 0 && tableSections.some((s) => s.rows.length > 0) && (
        <section className="section bg-off-white">
          <div className="container">
            <div style={{ marginBottom: 'var(--space-8)' }}>
              <span className="section-label">Members</span>
              <h2 className="section-title" style={{ fontSize: '1.75rem' }}>
                {tableSections.length > 1 ? 'Department Boards of Studies'
                  : item.slug === 'iqac-committee' ? 'Committee Composition' : 'Members & Composition'}
              </h2>
            </div>
            {tableSections.map((section, si) => (
              <div key={section.title || si} style={{ marginBottom: 'var(--space-10)' }}>
                {section.title && (
                  <h3 style={{ fontFamily: 'var(--font-sans)', fontSize: 'var(--text-base)', fontWeight: 700, color: 'var(--color-primary)', marginBottom: 'var(--space-3)' }}>
                    {section.title}
                  </h3>
                )}
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 'var(--text-sm)' }}>
                    <thead>
                      <tr style={{ background: 'var(--color-primary)' }}>
                        <th style={{ padding: 'var(--space-3) var(--space-4)', textAlign: 'left', color: 'var(--color-white)', fontWeight: 700, whiteSpace: 'nowrap' }}>Name</th>
                        <th style={{ padding: 'var(--space-3) var(--space-4)', textAlign: 'left', color: 'var(--color-white)', fontWeight: 700, whiteSpace: 'nowrap' }}>Role</th>
                        {section.rows.some((r) => r.notes) && (
                          <th style={{ padding: 'var(--space-3) var(--space-4)', textAlign: 'left', color: 'var(--color-white)', fontWeight: 700, whiteSpace: 'nowrap' }}>Notes</th>
                        )}
                      </tr>
                    </thead>
                    <tbody>
                      {section.rows.map((row, i) => (
                        <tr key={i} style={{ background: i % 2 === 0 ? 'var(--color-white)' : 'var(--color-off-white)', borderBottom: '1px solid var(--color-light-gray)' }}>
                          <td style={{ padding: 'var(--space-3) var(--space-4)', color: 'var(--color-text)', lineHeight: 1.5 }}>{row.name}</td>
                          <td style={{ padding: 'var(--space-3) var(--space-4)', color: 'var(--color-text)', lineHeight: 1.5 }}>{row.role}</td>
                          {section.rows.some((r) => r.notes) && (
                            <td style={{ padding: 'var(--space-3) var(--space-4)', color: 'var(--color-text)', lineHeight: 1.5 }}>{row.notes}</td>
                          )}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Outcomes */}
      {item.outcomes && item.outcomes.length > 0 && !SUPPRESS_OUTCOMES_SLUGS.has(item.slug) && (
        <section className="section bg-off-white">
          <div className="container">
            <div style={{ marginBottom: 'var(--space-8)' }}>
              <span className="section-label">Impact</span>
              <h2 className="section-title" style={{ fontSize: '1.75rem' }}>Outcomes & Achievements</h2>
            </div>
            <div className="card-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 'var(--space-4)' }}>
              {item.outcomes.map((o) => (
                <div key={o}
                  style={{ background: 'var(--color-white)', border: '1.5px solid var(--color-light-gray)', borderRadius: 'var(--radius-md)', padding: 'var(--space-5)', display: 'flex', gap: 'var(--space-3)', alignItems: 'flex-start' }}>
                  <Trophy size={20} strokeWidth={1.75} style={{ flexShrink: 0, color: 'var(--color-accent)' }} />
                  <span style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text)', lineHeight: 1.6 }}>{o}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section style={{ background: 'var(--color-primary)', padding: 'var(--space-14) 0' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <div>
            <h2 style={{ color: 'var(--color-white)', marginBottom: 'var(--space-4)' }}>
              Explore More Governance Resources
            </h2>
            <div style={{ display: 'flex', gap: 'var(--space-4)', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link to="/governance" className="btn btn-accent">Back to Governance</Link>
              <Link to="/about" className="btn btn-secondary">About VWU</Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
