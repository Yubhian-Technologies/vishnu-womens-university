import { useEffect, useState } from 'react';
import { Link, useParams, Navigate } from 'react-router-dom';
import { Sparkles, Microscope, Check } from 'lucide-react';
import { useOrderedCollection } from '../../hooks/useCollection';
import { resolveContentIcon } from '../../lib/contentIcons';
import { parseFlexibleTable, parseAccordionTable, parseProjectAccordion } from '../../lib/structuredTable';
import type { ResearchItemDoc } from '../Admin/sections/ResearchItemsAdmin';
import '../detail-layout.css';

const DEFAULT_HERO_IMAGE = 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=1920&q=80';

const CATEGORY_LABELS: Record<string, string> = {
  governance: 'R&D Governance',
  output: 'Research Output',
  engagement: 'Industry & Professional Engagement',
};

export default function ResearchDetail() {
  const { slug } = useParams<{ slug: string }>();
  const { docs: allItems, loading } = useOrderedCollection<ResearchItemDoc>('researchItems', 'order');
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
    if (item) document.title = `${item.title} | Vishnu Womens University`;
  }, [item]);

  if (!item) {
    if (loading) return null;
    return <Navigate to="/research" replace />;
  }

  const Icon = resolveContentIcon(item.icon) || Microscope;
  const categoryLabel = CATEGORY_LABELS[item.category] || item.category;
  const heroImage = item.heroImage || DEFAULT_HERO_IMAGE;
  const tableSections = parseFlexibleTable(item.tableText).filter((s) => s.headers.length > 0);
  const accordionCategories = parseAccordionTable(item.accordionText).filter((c) => c.areas.length > 0);
  const projectCategories = parseProjectAccordion(item.projectsText).filter((c) => c.projects.length > 0);

  return (
    <main className="page-wrapper">
      {/* Hero */}
      <section className="page-hero" style={{ minHeight: 340 }}>
        <img src={heroImage} alt={item.title} className="page-hero-image" />
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
              <h2 className="section-title" style={{ fontSize: '1.75rem' }}>About {item.title}</h2>
              {item.intro && (
                <p style={{ fontSize: 'var(--text-lg)', color: 'var(--color-text)', lineHeight: 1.75, marginBottom: 'var(--space-5)' }}>
                  {item.intro}
                </p>
              )}
              {item.about && (
                <p style={{ fontSize: 'var(--text-base)', color: 'var(--color-text-light)', lineHeight: 1.75 }}>
                  {item.about}
                </p>
              )}
              {!item.intro && !item.about && (
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
        </div>
      </section>

      {/* Data table(s) — a single unnamed section renders as one table under
          the item's own title; multiple named sections (e.g. Patents grouped
          by year) each get their own sub-heading. */}
      {tableSections.length > 0 && (
        <section className="section bg-off-white">
          <div className="container">
            <div style={{ marginBottom: 'var(--space-8)' }}>
              <span className="section-label">Details</span>
              <h2 className="section-title" style={{ fontSize: '1.75rem' }}>{item.title}</h2>
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
          doesn't fit a table (e.g. Thrust Areas of Research: department ->
          research area -> faculty names), each area toggling independently. */}
      {accordionCategories.length > 0 && (
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
                                  <span>{it}</span>
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
                                      <strong style={{ color: 'var(--color-primary)' }}>{f.label}:</strong> {f.value}
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
