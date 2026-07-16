import { useEffect } from 'react';
import { Download } from 'lucide-react';
import PageHero from '../../components/PageHero/PageHero';
import { useOrderedCollection } from '../../hooks/useCollection';
import { useHashScroll } from '../../hooks/useHashScroll';
import type { CurriculumDoc } from '../Admin/sections/CurriculumAdmin';

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
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))', gap: 'var(--space-8)', alignItems: 'start' }}>
              {groups.map((group) => (
                <div
                  key={group.program}
                  id={`curriculum-${group.program}`}
                  style={{ border: '1.5px solid var(--color-light-gray)', borderRadius: 'var(--radius-md)', padding: 'var(--space-6)', scrollMarginTop: 'calc(var(--topbar-height) + var(--header-height) + 1rem)' }}
                >
                  <h3 style={{ fontFamily: 'var(--font-sans)', fontSize: '1.1rem', fontWeight: 800, color: 'var(--color-primary)', marginBottom: 'var(--space-4)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    {(PROGRAM_LABELS[group.program] ?? group.program).toUpperCase()}
                  </h3>
                  <div style={{ overflowX: 'auto' }}>
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
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
