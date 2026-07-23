import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Download } from 'lucide-react';
import PageHero from '../../components/PageHero/PageHero';
import { useOrderedCollection } from '../../hooks/useCollection';
import { useHashScroll } from '../../hooks/useHashScroll';
import type { CurriculumDoc } from '../Admin/sections/CurriculumAdmin';
import '../detail-layout.css';

export const PROGRAM_LABELS: Record<string, string> = {
  btech: 'B.Tech', mtech: 'M.Tech', mba: 'MBA', phd: 'Ph.D.',
};

function regulationSortKey(reg: string): number {
  const match = reg.match(/\d+/);
  return match ? parseInt(match[0], 10) : 0;
}

interface ProgramGroup {
  program: string;
  rows: { rowLabel: string; rowOrder: number }[];
  regulations: string[];
  cells: Map<string, Map<string, CurriculumDoc>>;
}

function groupByProgram(docs: CurriculumDoc[]): ProgramGroup[] {
  const byProgram = new Map<string, CurriculumDoc[]>();
  for (const d of docs) {
    if (!byProgram.has(d.program)) byProgram.set(d.program, []);
    byProgram.get(d.program)!.push(d);
  }

  return Array.from(byProgram.entries()).map(([program, entries]) => {
    const rowMap = new Map<string, number>();
    const regulationSet = new Set<string>();
    const cells = new Map<string, Map<string, CurriculumDoc>>();

    for (const d of entries) {
      rowMap.set(d.rowLabel, d.rowOrder);
      regulationSet.add(d.regulation);
      if (!cells.has(d.rowLabel)) cells.set(d.rowLabel, new Map());
      cells.get(d.rowLabel)!.set(d.regulation, d);
    }

    const rows = Array.from(rowMap.entries())
      .map(([rowLabel, rowOrder]) => ({ rowLabel, rowOrder }))
      .sort((a, b) => a.rowOrder - b.rowOrder);

    const regulations = Array.from(regulationSet).sort((a, b) => regulationSortKey(a) - regulationSortKey(b));

    return { program, rows, regulations, cells };
  });
}

export default function CurriculumMatrix() {
  const { docs } = useOrderedCollection<CurriculumDoc>('curriculum', 'rowOrder');
  const groups = groupByProgram(docs);
  const location = useLocation();

  const [openPrograms, setOpenPrograms] = useState<Set<string>>(new Set());
  const toggleProgram = (program: string) => {
    setOpenPrograms((prev) => {
      const next = new Set(prev);
      if (next.has(program)) next.delete(program);
      else next.add(program);
      return next;
    });
  };
  // A header nav link (e.g. "/academics/curriculum#curriculum-btech") should
  // land on that programme already expanded, not on a collapsed header with
  // nothing visible underneath it.
  useEffect(() => {
    const match = location.hash.match(/^#curriculum-(.+)$/);
    if (match) setOpenPrograms((prev) => new Set(prev).add(match[1]));
  }, [location.hash]);

  useHashScroll();

  useEffect(() => {
    document.title = 'Course Curriculum | Vishnu Womens University';
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
    document.querySelectorAll('.reveal').forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <main className="page-wrapper">
      {/* Hero */}
      <PageHero
        page="academics-curriculum"
        defaultImage="https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=1920&q=80"
        defaultTitle="Course Curriculum"
        defaultSubtitle="Semester-wise curriculum documents for every programme and regulation."
        breadcrumb={[{ label: 'Home', to: '/' }, { label: 'Academics', to: '/academics' }, { label: 'Course Curriculum' }]}
      />

      {/* Curriculum Matrix */}
      <section id="curriculum-content" className="section bg-white">
        <div className="container">
          <div className="reveal" style={{ textAlign: 'center', marginBottom: 'var(--space-12)' }}>
            <span className="section-label">Academics</span>
            <h2 className="section-title">Curriculum by Programme & Regulation</h2>
            <p className="section-desc" style={{ margin: '0 auto' }}>
              Select the semester and regulation to download the corresponding curriculum document.
            </p>
          </div>

          {/* Rendered from Firestore, so no scroll-reveal animation here
              (see the gotcha documented in CLAUDE.md). */}
          {groups.length === 0 ? (
            <p style={{ color: 'var(--color-text-light)', textAlign: 'center' }}>
              No curriculum documents have been added yet.
            </p>
          ) : (
            <div className="thrust-accordion" style={{ gap: 'var(--space-5)' }}>
              {groups.map((group) => {
                const isOpen = openPrograms.has(group.program);
                return (
                  <div
                    key={group.program}
                    id={`curriculum-${group.program}`}
                    className={`thrust-accordion-item${isOpen ? ' open' : ''}`}
                    style={{ scrollMarginTop: 'calc(var(--topbar-height) + var(--header-height) + 1rem)' }}
                  >
                    <button
                      type="button"
                      className="thrust-accordion-header"
                      onClick={() => toggleProgram(group.program)}
                      aria-expanded={isOpen}
                    >
                      <span style={{ textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                        {(PROGRAM_LABELS[group.program] ?? group.program).toUpperCase()}
                      </span>
                      <span className="thrust-accordion-icon">{isOpen ? '−' : '+'}</span>
                    </button>
                    <div className="thrust-accordion-collapse">
                      <div className="thrust-accordion-collapse-inner">
                        <div style={{ padding: 'var(--space-5)', overflowX: 'auto' }}>
                          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 'var(--text-sm)' }}>
                            <thead>
                              <tr style={{ background: 'var(--color-primary)' }}>
                                <th style={{ padding: 'var(--space-3) var(--space-4)', textAlign: 'left', color: 'var(--color-white)', fontWeight: 700, whiteSpace: 'nowrap' }}>
                                  Semester
                                </th>
                                {group.regulations.map((reg) => (
                                  <th key={reg} style={{ padding: 'var(--space-3) var(--space-4)', textAlign: 'center', color: 'var(--color-white)', fontWeight: 700, whiteSpace: 'nowrap' }}>
                                    {reg} Regulation
                                  </th>
                                ))}
                              </tr>
                            </thead>
                            <tbody>
                              {group.rows.map((row, i) => (
                                <tr key={row.rowLabel} style={{ background: i % 2 === 0 ? 'var(--color-white)' : 'var(--color-off-white)', borderBottom: '1px solid var(--color-light-gray)' }}>
                                  <td style={{ padding: 'var(--space-3) var(--space-4)', color: 'var(--color-text)', fontWeight: 600, whiteSpace: 'nowrap' }}>
                                    {row.rowLabel}
                                  </td>
                                  {group.regulations.map((reg) => {
                                    const entry = group.cells.get(row.rowLabel)?.get(reg);
                                    return (
                                      <td key={reg} style={{ padding: 'var(--space-3) var(--space-4)', textAlign: 'center' }}>
                                        {entry ? (
                                          <a
                                            href={entry.fileUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            download
                                            aria-label={`Download ${row.rowLabel} ${reg} curriculum`}
                                            style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 28, height: 28, borderRadius: '50%', background: 'var(--color-accent)', color: 'var(--color-primary-dark)' }}
                                          >
                                            <Download size={15} strokeWidth={2.25} />
                                          </a>
                                        ) : (
                                          <span style={{ color: 'var(--color-text-light)' }}>--</span>
                                        )}
                                      </td>
                                    );
                                  })}
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
