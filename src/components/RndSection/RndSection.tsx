import { useState } from 'react';
import { FileText, Check } from 'lucide-react';
import { parseFlexibleTable, parseProjectAccordion } from '../../lib/structuredTable';
import type { RndYear } from '../../pages/Admin/sections/ProgramsAdmin';

const NAV_OFFSET = 'calc(var(--topbar-height) + var(--header-height) + 1rem)';

interface LegacyRndFields {
  rndIntro?: string;
  rndTableText?: string;
  rndProjectsText?: string;
  rndLinks?: RndYear['links'];
  rndStructuredTable?: RndYear['structuredTable'];
  rndYears?: RndYear[];
}

// Department R&D is department-wide, but before Academic Year support was
// added it was one flat block (rndIntro/rndTableText/etc., possibly still
// only present on the linked programme from the even-earlier per-programme
// era). Wrapping that as a single unlabeled year here means a department
// that hasn't been re-saved through the new per-year editor keeps showing
// exactly what it already had — no data disappears, and no year pills show
// until an admin actually adds a labeled year.
export function resolveRndYears(primary?: LegacyRndFields | null, fallback?: LegacyRndFields | null): RndYear[] {
  if (primary?.rndYears?.length) return primary.rndYears;
  if (fallback?.rndYears?.length) return fallback.rndYears;
  const intro = primary?.rndIntro || fallback?.rndIntro || '';
  const tableText = primary?.rndTableText || fallback?.rndTableText || '';
  const projectsText = primary?.rndProjectsText || fallback?.rndProjectsText || '';
  const links = (primary?.rndLinks?.length ? primary.rndLinks : fallback?.rndLinks) || [];
  const structuredTable = primary?.rndStructuredTable || fallback?.rndStructuredTable;
  const hasStructured = !!structuredTable && structuredTable.columns.length > 0 && structuredTable.rows.length > 0;
  if (intro || tableText || projectsText || links.length > 0 || hasStructured) {
    return [{ year: '', intro, tableText, projectsText, links, structuredTable }];
  }
  return [];
}

export function rndYearHasContent(y: RndYear): boolean {
  const tableSections = parseFlexibleTable(y.tableText || '').filter((s) => s.headers.length > 0);
  const projectCategories = parseProjectAccordion(y.projectsText || '').filter((c) => c.projects.length > 0);
  const hasStructured = !!y.structuredTable && y.structuredTable.columns.length > 0 && y.structuredTable.rows.length > 0;
  return !!y.intro || tableSections.length > 0 || projectCategories.length > 0 || (y.links?.length || 0) > 0 || hasStructured;
}

export function rndYearsHaveContent(years: RndYear[]): boolean {
  return years.some(rndYearHasContent);
}

interface Props {
  years: RndYear[];
  sectionClassName?: string;
  labelClassName?: string;
}

export default function RndSection({ years, sectionClassName = 'section bg-white', labelClassName = 'section-label' }: Props) {
  const [selectedYear, setSelectedYear] = useState<string | null>(null);
  const [openProjects, setOpenProjects] = useState<Set<string>>(new Set());
  const toggleProject = (key: string) => {
    setOpenProjects((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  const contentYears = years.filter(rndYearHasContent);
  const labeledYears = contentYears.filter((y) => y.year);
  const activeYear = labeledYears.length > 0
    ? labeledYears.find((y) => y.year === selectedYear) ?? labeledYears[0]
    : contentYears[0];

  if (!activeYear) return null;

  const tableSections = parseFlexibleTable(activeYear.tableText || '').filter((s) => s.headers.length > 0);
  const projectCategories = parseProjectAccordion(activeYear.projectsText || '').filter((c) => c.projects.length > 0);
  const links = activeYear.links || [];
  const structuredColumns = activeYear.structuredTable?.columns || [];
  const structuredRows = activeYear.structuredTable?.rows || [];
  const hasStructuredTable = structuredColumns.length > 0 && structuredRows.length > 0;

  return (
    <section id="rnd" className={sectionClassName} style={{ scrollMarginTop: NAV_OFFSET }}>
      <div className="container">
        <div style={{ marginBottom: 'var(--space-8)' }}>
          <span className={labelClassName}>Research</span>
          <h2 className="section-title">Research &amp; Development (Funded Projects &amp; Patents)</h2>
        </div>

        {labeledYears.length > 0 && (
          <div className="placement-year-pills" role="group" aria-label="Select academic year" style={{ marginBottom: 'var(--space-6)' }}>
            {labeledYears.map((y) => (
              <button
                key={y.year}
                type="button"
                onClick={() => setSelectedYear(y.year)}
                className={`placement-year-pill${activeYear.year === y.year ? ' active' : ''}`}
                aria-pressed={activeYear.year === y.year}
              >
                AY. {y.year}
              </button>
            ))}
          </div>
        )}

        {activeYear.intro && (
          <p style={{ color: 'var(--color-text)', lineHeight: 1.85, fontSize: 'var(--text-base)', marginBottom: 'var(--space-6)', maxWidth: 760, whiteSpace: 'pre-line' }}>
            {activeYear.intro}
          </p>
        )}

        {tableSections.map((section, si) => (
          <div key={si} style={{ marginBottom: 'var(--space-8)' }}>
            {section.title && (
              <h3 style={{ fontFamily: 'var(--font-sans)', fontSize: 'var(--text-base)', fontWeight: 700, color: 'var(--color-primary)', marginBottom: 'var(--space-3)' }}>
                {section.title}
              </h3>
            )}
            <div role="region" aria-label={section.title || 'Research & Development table'} tabIndex={0} style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 'var(--text-sm)' }}>
                <thead>
                  <tr style={{ background: 'var(--color-primary)' }}>
                    {section.headers.map((col, ci) => (
                      <th key={ci} scope="col" style={{ padding: 'var(--space-3) var(--space-4)', textAlign: 'left', color: 'var(--color-white)', fontWeight: 700, whiteSpace: 'nowrap' }}>
                        {col}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {section.rows.map((row, ri) => (
                    <tr key={ri} style={{ background: ri % 2 === 0 ? 'var(--color-white)' : 'var(--color-off-white)', borderBottom: '1px solid var(--color-light-gray)' }}>
                      {row.map((val, ci) => (
                        <td key={ci} style={{ padding: 'var(--space-3) var(--space-4)', color: 'var(--color-text)', lineHeight: 1.5 }}>
                          {/^https?:\/\//i.test(val) ? <a href={val} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--color-primary)', fontWeight: 600 }}>View</a> : val}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ))}

        {hasStructuredTable && (
          <div style={{ marginBottom: 'var(--space-8)', overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 'var(--text-sm)' }}>
              <thead>
                <tr style={{ background: 'var(--color-primary)' }}>
                  {structuredColumns.map((col, ci) => (
                    <th key={ci} style={{ padding: 'var(--space-3) var(--space-4)', textAlign: 'left', color: 'var(--color-white)', fontWeight: 700, whiteSpace: 'nowrap' }}>
                      {col}
                    </th>
                  ))}
                  <th style={{ padding: 'var(--space-3) var(--space-4)', textAlign: 'left', color: 'var(--color-white)', fontWeight: 700, whiteSpace: 'nowrap' }}>PDF</th>
                </tr>
              </thead>
              <tbody>
                {structuredRows.map((row, ri) => (
                  <tr key={ri} style={{ background: ri % 2 === 0 ? 'var(--color-white)' : 'var(--color-off-white)', borderBottom: '1px solid var(--color-light-gray)' }}>
                    {structuredColumns.map((_, ci) => (
                      <td key={ci} style={{ padding: 'var(--space-3) var(--space-4)', color: 'var(--color-text)', lineHeight: 1.5 }}>
                        {row.cells[ci] ?? ''}
                      </td>
                    ))}
                    <td style={{ padding: 'var(--space-3) var(--space-4)' }}>
                      {row.pdfUrl ? (
                        <a href={row.pdfUrl} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--color-primary)', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                          <FileText size={14} strokeWidth={2} /> View
                        </a>
                      ) : '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {projectCategories.map((cat, ci) => (
          <div key={ci} style={{ marginBottom: ci < projectCategories.length - 1 ? 'var(--space-10)' : (links.length > 0 ? 'var(--space-8)' : 0) }}>
            {cat.title && (
              <h3 style={{ fontFamily: 'var(--font-sans)', fontSize: 'var(--text-base)', fontWeight: 700, color: 'var(--color-primary)', marginBottom: 'var(--space-3)' }}>
                {cat.title}
              </h3>
            )}
            <div className="thrust-accordion">
              {cat.projects.map((project, pi) => {
                const key = `${activeYear.year}-${ci}-${pi}`;
                const isOpen = openProjects.has(key);
                return (
                  <div key={pi} className={`thrust-accordion-item${isOpen ? ' open' : ''}`}>
                    <button
                      type="button"
                      className="thrust-accordion-header"
                      onClick={() => toggleProject(key)}
                      aria-expanded={isOpen}
                      aria-controls={`rnd-project-${key}`}
                    >
                      <span>{project.title}</span>
                      <span className="thrust-accordion-icon" aria-hidden="true">{isOpen ? '−' : '+'}</span>
                    </button>
                    <div id={`rnd-project-${key}`} className="thrust-accordion-collapse">
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

        {links.length > 0 && (
          <ul className="annual-reports-list">
            {links.map((link, li) => (
              <li key={li}>
                <a href={link.pdfUrl} target="_blank" rel="noopener noreferrer" className="annual-reports-link">
                  <FileText size={14} strokeWidth={2} className="annual-reports-icon" />
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
