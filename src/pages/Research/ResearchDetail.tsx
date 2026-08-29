import { useEffect, useState } from 'react';
import { Link, useParams, Navigate } from 'react-router-dom';
import { Sparkles, Microscope, Check } from 'lucide-react';
import { useOrderedCollection } from '../../hooks/useCollection';
import { usePageBanners } from '../../hooks/usePageBanners';
import { resolveContentIcon } from '../../lib/contentIcons';
import { parseFlexibleTable, parseAccordionTable, parseProjectAccordion } from '../../lib/structuredTable';
import { parseAboutContent } from '../../lib/aboutContent';
import type { ResearchItemDoc } from '../Admin/sections/ResearchItemsAdmin';
import ThrustAreasSection from './ThrustAreasSection';
import ProfessionalBodiesSection from './ProfessionalBodiesSection';
import { DEFAULT_FUNDED_PROJECTS_TEXT } from './fundedProjectsDefault';
import { DEFAULT_PATENTS_TEXT } from './patentsDefault';
import { DEFAULT_THRUST_AREAS_INTRO, DEFAULT_THRUST_AREAS_TEXT } from './thrustAreasDefault';
import { DEFAULT_RESEARCH_PUBLICATIONS_TEXT } from './researchPublicationsDefault';
import { DEFAULT_CONSULTANCY_TEXT } from './consultancyDefault';
import { DEFAULT_RESEARCH_CENTERS_INTRO, DEFAULT_RESEARCH_CENTERS_TABLE_TEXT } from './researchCentersDefault';
import { DEFAULT_MOUS_TABLE_TEXT } from './mousDefault';
import { DEFAULT_SEED_MONEY_PROJECTS_TABLE_TEXT, DEFAULT_SEED_MONEY_PROJECTS_INTRO } from './seedMoneyProjectsDefault';
import { DEFAULT_ABOUT_RD_TABLE_TEXT } from './aboutRdDefault';
import { DEFAULT_RAC_INTRO, DEFAULT_RAC_ABOUT } from './researchAdvisoryCommitteeDefault';
import { DEFAULT_REC_INTRO, DEFAULT_REC_ABOUT } from './researchEthicsCommitteeDefault';
import { DEFAULT_IPR_INTRO, DEFAULT_IPR_ABOUT } from './iprCommitteeDefault';
import '../detail-layout.css';

const CATEGORY_LABELS: Record<string, string> = {
  governance: 'R&D Governance',
  output: 'Research Output',
  engagement: 'Industry & Professional Engagement',
};

// Firestore's researchItems doc for these slugs may not have its
// (newer) projectsText/accordionText field filled in yet from the admin
// panel — fall back to the real source content so the page still renders
// fully rather than staying blank until someone pastes it in manually.
const DEFAULT_PROJECTS_TEXT_BY_SLUG: Record<string, string> = {
  'funded-projects': DEFAULT_FUNDED_PROJECTS_TEXT,
  'patents': DEFAULT_PATENTS_TEXT,
};

// Same fallback pattern as above, for the accordion (category -> area ->
// faculty) content on Research Publications and Consultancy.
const DEFAULT_ACCORDION_TEXT_BY_SLUG: Record<string, string> = {
  'research-publications': DEFAULT_RESEARCH_PUBLICATIONS_TEXT,
  'consultancy': DEFAULT_CONSULTANCY_TEXT,
};

// Fallback accordionText for Thrust Areas of Research, used only until an
// admin fills in item.accordionText — item.accordionText always wins once
// set (see below). Each faculty member links out to their external IRINS
// profile (https://svecw.irins.org/profile/:id).
const DEFAULT_ACCORDION_TEXT_OVERRIDE_BY_SLUG: Record<string, string> = {
  'thrust-areas-of-research': DEFAULT_THRUST_AREAS_TEXT,
};

// Fallback tableText for Research Centers, Seed Money Projects, About R&D,
// and MoUs, used only until an admin fills in item.tableText from the
// Research Items admin section — item.tableText always wins once set (see
// below), so editing the Data Table field there fully controls this page.
const DEFAULT_TABLE_TEXT_BY_SLUG: Record<string, string> = {
  'research-centers': DEFAULT_RESEARCH_CENTERS_TABLE_TEXT,
  'seed-money-projects': DEFAULT_SEED_MONEY_PROJECTS_TABLE_TEXT,
  'about-rd': DEFAULT_ABOUT_RD_TABLE_TEXT,
  mous: DEFAULT_MOUS_TABLE_TEXT,
};

// Fallback intro for Research Advisory Committee, Research Ethics Committee,
// IPR Committee, Seed Money Projects, Research Centers, and Thrust Areas of
// Research, used only until an admin fills in item.intro — item.intro always
// wins once set (see below).
const DEFAULT_INTRO_BY_SLUG: Record<string, string> = {
  'research-advisory-committee': DEFAULT_RAC_INTRO,
  'research-ethics-committee': DEFAULT_REC_INTRO,
  'ipr-committee': DEFAULT_IPR_INTRO,
  'seed-money-projects': DEFAULT_SEED_MONEY_PROJECTS_INTRO,
  'research-centers': DEFAULT_RESEARCH_CENTERS_INTRO,
  'thrust-areas-of-research': DEFAULT_THRUST_AREAS_INTRO,
};
const DEFAULT_ABOUT_BY_SLUG: Record<string, string> = {
  'research-advisory-committee': DEFAULT_RAC_ABOUT,
  'research-ethics-committee': DEFAULT_REC_ABOUT,
  'ipr-committee': DEFAULT_IPR_ABOUT,
};

export default function ResearchDetail() {
  const { slug } = useParams<{ slug: string }>();
  const { docs: allItems, loading } = useOrderedCollection<ResearchItemDoc>('researchItems', 'order');
  const { slides: heroSlides } = usePageBanners('research-detail');
  const item = allItems.find((i) => i.slug === slug) ?? null;
  const [openAreas, setOpenAreas] = useState<Set<string>>(new Set());
  const toggleArea = (key: string) => {
    setOpenAreas((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };
  const [openProjects, setOpenProjects] = useState<Set<string>>(new Set());
  const toggleProject = (key: string) => {
    setOpenProjects((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  // No scroll-reveal here — this whole page's content (including the hero
  // title) only renders once the Firestore-backed `item` has loaded, so any
  // .reveal/IntersectionObserver setup would be racing async data on every
  // navigation (see the gotcha documented in CLAUDE.md).
  useEffect(() => {
    if (item) document.title = `${item.title} | Vishnu Women's University`;
  }, [item]);

  if (!item) {
    if (loading) {
      return (
        <main className="route-fallback">
          <div className="route-fallback__spinner" />
        </main>
      );
    }
    return <Navigate to="/research" replace />;
  }

  const Icon = resolveContentIcon(item.icon) || Microscope;
  const categoryLabel = CATEGORY_LABELS[item.category] || item.category;
  const heroImage = item.heroImage || heroSlides[0]?.imageUrl;
  const intro = item.intro || DEFAULT_INTRO_BY_SLUG[item.slug] || '';
  const about = item.about || DEFAULT_ABOUT_BY_SLUG[item.slug] || '';
  const aboutBlocks = parseAboutContent(about);
  const tableText = item.tableText || DEFAULT_TABLE_TEXT_BY_SLUG[item.slug] || '';
  const tableSections = parseFlexibleTable(tableText).filter((s) => s.headers.length > 0);
  const accordionText = item.accordionText || DEFAULT_ACCORDION_TEXT_OVERRIDE_BY_SLUG[item.slug] || DEFAULT_ACCORDION_TEXT_BY_SLUG[item.slug] || '';
  const accordionCategories = parseAccordionTable(accordionText).filter((c) => c.areas.length > 0);
  const projectsText = item.projectsText || DEFAULT_PROJECTS_TEXT_BY_SLUG[item.slug] || '';
  const projectCategories = parseProjectAccordion(projectsText).filter((c) => c.projects.length > 0);

  return (
    <main className="page-wrapper">
      {/* Hero */}
      <section className="page-hero" style={{ minHeight: 340 }}>
        {heroImage && (
          <img src={heroImage} alt={item.title} className="page-hero-image" loading="eager" decoding="sync" fetchPriority="high" />
        )}
        <div className="page-hero-overlay" />
        <div className="container page-hero-content">
          <div className="breadcrumb">
            <Link to="/" className="breadcrumb-item">Home</Link>
            <span className="breadcrumb-sep">›</span>
            <Link to="/research" className="breadcrumb-item">Research & Development</Link>
            <span className="breadcrumb-sep">›</span>
            <span className="breadcrumb-item active">{item.title}</span>
          </div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'var(--color-accent)', color: 'var(--color-white)', fontSize: 'var(--text-xs)', fontWeight: 700, padding: '0.3rem 0.9rem', borderRadius: 'var(--radius-full)', marginBottom: 'var(--space-3)' }}>
            <Icon size={14} /> {categoryLabel}
          </div>
          <h1>{item.title}</h1>
        </div>
      </section>

      {/* Overview */}
      <section className="section bg-white">
        <div className="container">
          <div className={item.highlights && item.highlights.length > 0 ? 'detail-grid' : ''}>
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

            {item.highlights && item.highlights.length > 0 && (
              <div className="detail-sidebar">
                <div style={{ background: 'var(--color-off-white)', border: '1.5px solid var(--color-light-gray)', borderRadius: 'var(--radius-md)', padding: 'var(--space-6)', position: 'sticky', top: '110px' }}>
                  <h3 style={{ fontFamily: 'var(--font-sans)', fontSize: 'var(--text-base)', fontWeight: 700, color: 'var(--color-primary)', marginBottom: 'var(--space-4)' }}>
                    Key Highlights
                  </h3>
                  <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                    {item.highlights.map((h) => (
                      <li key={h} style={{ display: 'flex', alignItems: 'flex-start', gap: 'var(--space-2)' }}>
                        <span style={{ width: 20, height: 20, borderRadius: '50%', background: 'var(--color-accent)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 1 }}>
                          <svg width="10" height="10" viewBox="0 0 10 10" fill="none"><path d="M2 5l2.5 2.5L8 3" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                        </span>
                        <span style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text)', lineHeight: 1.5 }}>{h}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>

          {item.slug === 'about-rd' && (
            <div style={{ textAlign: 'center', marginTop: 'var(--space-6)' }}>
              {item.policyPdfUrl ? (
                <a
                  href={item.policyPdfUrl}
                  download
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: 'var(--color-accent)', fontWeight: 700, fontSize: 'var(--text-base)', textDecoration: 'none' }}
                >
                  *** R&D Policy ***
                </a>
              ) : (
                <span style={{ color: 'var(--color-text-light)', fontWeight: 700, fontSize: 'var(--text-base)' }}>
                  *** R&D Policy *** (coming soon)
                </span>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Professional Bodies gets its own richer per-body layout (paragraphs,
          advisor/chair details, chapter info, and activity-log tables) —
          far more structure than the plain summary table Firestore's
          tableText field currently holds for this slug, so it's rendered
          directly instead of through the generic table renderer below. */}
      {item.slug === 'professional-bodies' && (
        <section className="section bg-off-white">
          <div className="container">
            <div style={{ marginBottom: 'var(--space-8)' }}>
              <span className="section-label">Details</span>
              <h2 className="section-title" style={{ fontSize: '1.75rem' }}>{item.title}</h2>
            </div>
            <ProfessionalBodiesSection />
          </div>
        </section>
      )}

      {/* Data table(s) — a single unnamed section renders as one table under
          the item's own title; multiple named sections (e.g. Patents grouped
          by year) each get their own sub-heading. */}
      {item.slug !== 'professional-bodies' && tableSections.length > 0 && projectCategories.length === 0 && accordionCategories.length === 0 && (
        <section className="section bg-off-white">
          <div className="container">
            <div style={{ marginBottom: 'var(--space-8)' }}>
              <span className="section-label">Details</span>
              <h2 className="section-title" style={{ fontSize: '1.75rem' }}>
                {item.slug === 'about-rd' ? "Research Team at Vishnu Women's University" : item.title}
              </h2>
            </div>
            {tableSections.map((section, si) => (
              <div key={si} style={{ marginBottom: si < tableSections.length - 1 ? 'var(--space-10)' : 0 }}>
                {section.title && (
                  <h3 style={{ fontFamily: 'var(--font-sans)', fontSize: 'var(--text-base)', fontWeight: 700, color: 'var(--color-primary)', marginBottom: 'var(--space-3)' }}>
                    {section.title}
                  </h3>
                )}
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 'var(--text-sm)' }}>
                    <thead>
                      <tr style={{ background: 'var(--color-primary)' }}>
                        {section.headers.map((col, ci) => (
                          <th key={ci} style={{ padding: 'var(--space-3) var(--space-4)', textAlign: 'left', color: 'var(--color-white)', fontWeight: 700, whiteSpace: 'nowrap' }}>
                            {col}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {section.rows.map((row, i) => (
                        <tr key={i} style={{ background: i % 2 === 0 ? 'var(--color-white)' : 'var(--color-off-white)', borderBottom: '1px solid var(--color-light-gray)' }}>
                          {row.map((val, j) => (
                            <td key={j} style={{ padding: 'var(--space-3) var(--space-4)', color: 'var(--color-text)', lineHeight: 1.5 }}>
                              {val}
                            </td>
                          ))}
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

      {/* Expandable areas — a category > area accordion for content that
          doesn't fit a table (e.g. Research Publications, Consultancy: a
          category -> research area -> faculty accordion), each area toggling
          independently. Thrust Areas of Research uses the same underlying
          category/area/faculty data shape but gets its own department-tab
          browsing UI below instead (it has far more categories/areas than
          the others, so the plain stacked accordion read as one long
          undifferentiated list). */}
      {accordionCategories.length > 0 && item.slug === 'thrust-areas-of-research' && (
        <section className="section bg-off-white">
          <div className="container">
            <div style={{ marginBottom: 'var(--space-8)' }}>
              <span className="section-label">Details</span>
              <h2 className="section-title" style={{ fontSize: '1.75rem' }}>{item.title}</h2>
            </div>
            <ThrustAreasSection categories={accordionCategories} />
          </div>
        </section>
      )}
      {accordionCategories.length > 0 && item.slug !== 'thrust-areas-of-research' && (
        <section className="section bg-off-white">
          <div className="container">
            <div style={{ marginBottom: 'var(--space-8)' }}>
              <span className="section-label">Details</span>
              <h2 className="section-title" style={{ fontSize: '1.75rem' }}>{item.title}</h2>
            </div>
            {accordionCategories.map((cat, ci) => (
              <div key={ci} style={{ marginBottom: ci < accordionCategories.length - 1 ? 'var(--space-10)' : 0 }}>
                {cat.title && (
                  <h3 style={{ fontFamily: 'var(--font-sans)', fontSize: 'var(--text-base)', fontWeight: 700, color: 'var(--color-primary)', marginBottom: 'var(--space-3)' }}>
                    {cat.title}
                  </h3>
                )}
                <div className="thrust-accordion">
                  {cat.areas.map((area, ai) => {
                    const key = `${ci}-${ai}`;
                    const isOpen = openAreas.has(key);
                    return (
                      <div key={ai} className={`thrust-accordion-item${isOpen ? ' open' : ''}`}>
                        <button
                          type="button"
                          className="thrust-accordion-header"
                          onClick={() => toggleArea(key)}
                          aria-expanded={isOpen}
                        >
                          <span>{area.name}</span>
                          <span className="thrust-accordion-icon">{isOpen ? '−' : '+'}</span>
                        </button>
                        <div className="thrust-accordion-collapse">
                          <div className="thrust-accordion-collapse-inner">
                            <ul className="thrust-accordion-list">
                              {area.items.map((it, ii) => (
                                <li key={ii}>
                                  <Check size={13} strokeWidth={2.5} style={{ color: 'var(--color-accent)', flexShrink: 0 }} />
                                  {it.href ? (
                                    /^https?:\/\//i.test(it.href) ? (
                                      // An absolute URL (e.g. an external IRINS faculty profile) —
                                      // a router Link would try to SPA-navigate to it as an
                                      // internal route instead of leaving the site.
                                      <a href={it.href} target="_blank" rel="noopener noreferrer" className="thrust-accordion-link">{it.label}</a>
                                    ) : /\.[a-z0-9]+$/i.test(it.href) ? (
                                      // A local file path (e.g. a PDF), not another page — a
                                      // router Link would just SPA-navigate to a nonexistent
                                      // route instead of fetching the file, so use a plain anchor.
                                      <a href={it.href} download target="_blank" rel="noopener noreferrer" className="thrust-accordion-link">{it.label}</a>
                                    ) : (
                                      <Link to={it.href} className="thrust-accordion-link">{it.label}</Link>
                                    )
                                  ) : (
                                    <span>{it.label}</span>
                                  )}
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Project accordion — a richer per-item card for content that has
          several labeled fields plus an Outcome list per entry (e.g. Funded
          Projects: PI, Department, Amount, Agency, ... and an outcome list),
          grouped into categories (e.g. Ongoing / Completed). */}
      {projectCategories.length > 0 && (
        <section className="section bg-off-white">
          <div className="container">
            <div style={{ marginBottom: 'var(--space-8)' }}>
              <span className="section-label">Details</span>
              <h2 className="section-title" style={{ fontSize: '1.75rem' }}>{item.title}</h2>
            </div>
            {projectCategories.map((cat, ci) => (
              <div key={ci} style={{ marginBottom: ci < projectCategories.length - 1 ? 'var(--space-10)' : 0 }}>
                {cat.title && (
                  <h3 style={{ fontFamily: 'var(--font-sans)', fontSize: 'var(--text-base)', fontWeight: 700, color: 'var(--color-primary)', marginBottom: 'var(--space-3)' }}>
                    {cat.title}
                  </h3>
                )}
                <div className="thrust-accordion">
                  {cat.projects.map((project, pi) => {
                    const key = `${ci}-${pi}`;
                    const isOpen = openProjects.has(key);
                    return (
                      <div key={pi} className={`thrust-accordion-item${isOpen ? ' open' : ''}`}>
                        <button
                          type="button"
                          className="thrust-accordion-header"
                          onClick={() => toggleProject(key)}
                          aria-expanded={isOpen}
                        >
                          <span>{project.title}</span>
                          <span className="thrust-accordion-icon">{isOpen ? '−' : '+'}</span>
                        </button>
                        <div className="thrust-accordion-collapse">
                          <div className="thrust-accordion-collapse-inner">
                            <div style={{ padding: 'var(--space-4) var(--space-5)' }}>
                              {project.fields.length > 0 && (
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 'var(--space-2) var(--space-5)', marginBottom: project.outcomes.length > 0 ? 'var(--space-4)' : 0 }}>
                                  {project.fields.map((f, fi) => (
                                    <div key={fi} style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text)', lineHeight: 1.5 }}>
                                      <strong style={{ color: 'var(--color-primary)' }}>{f.label}:</strong>{' '}
                                      {f.href ? (
                                        <a href={f.href} download target="_blank" rel="noopener noreferrer" className="thrust-accordion-link">{f.value}</a>
                                      ) : (
                                        f.value
                                      )}
                                    </div>
                                  ))}
                                </div>
                              )}
                              {project.outcomes.length > 0 && (
                                <div>
                                  <strong style={{ fontSize: 'var(--text-sm)', color: 'var(--color-primary)', display: 'block', marginBottom: 'var(--space-2)' }}>
                                    Outcome
                                  </strong>
                                  <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
                                    {project.outcomes.map((o, oi) => (
                                      <li key={oi} style={{ display: 'flex', alignItems: 'flex-start', gap: 'var(--space-2)' }}>
                                        <Check size={13} strokeWidth={2.5} style={{ color: 'var(--color-accent)', flexShrink: 0, marginTop: 3 }} />
                                        <span style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text)', lineHeight: 1.5 }}>{o}</span>
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* CTA */}
      <section style={{ background: 'var(--color-primary)', padding: 'var(--space-14) 0' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <div>
            <span className="section-label" style={{ color: 'var(--color-accent)', display: 'inline-flex', alignItems: 'center', gap: '0.4rem', justifyContent: 'center' }}>
              <Sparkles size={14} /> Research at VWU
            </span>
            <h2 style={{ color: 'var(--color-white)', marginBottom: 'var(--space-4)' }}>
              Explore More Research Resources
            </h2>
            <div style={{ display: 'flex', gap: 'var(--space-4)', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link to="/research" className="btn btn-accent">Back to Research</Link>
              <Link to="/differentiators" className="btn btn-secondary">Differentiators</Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
