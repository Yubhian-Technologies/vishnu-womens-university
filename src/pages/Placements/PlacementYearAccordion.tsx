import { useEffect, useState } from 'react';
import type { BranchOfferCount } from './placementStats.data';
import { usePlacementYears } from './usePlacementYears';
import SmoothCollapse from '../../components/SmoothCollapse/SmoothCollapse';

interface Props {
  /** Restrict to just these batch labels (e.g. only the 4 most recent) —
   *  omit to show every batch. Used by the Placement Details sub-page,
   *  which only wants 2022–2026 through 2019–2023. */
  years?: string[];
  /** Batches that should show the richer view (companies-visited /
   *  branch-offers stat tiles, a branch-wise bar chart, and named student
   *  records) instead of the plain company table — only for batches that
   *  actually have that data (`branchOffers`/`students` on the record). */
  enrichedYears?: string[];
}

// Each branch's share of the batch's total offers, e.g. 24.9% rather than
// a raw offer count.
function branchPercentage(offers: number, total: number): number {
  return total > 0 ? (offers / total) * 100 : 0;
}

// A fixed categorical color per branch identity (not per array position —
// batches don't all list the same branches in the same order, and some
// omit a branch entirely, so the same real-world branch must always land
// on the same hue). Validated CVD-safe/normal-vision-safe as a set via the
// dataviz skill's validate_palette.js against this page's white card
// surface; the gold slot doubles as the site's own --color-accent so the
// chart still reads as "on brand" rather than a generic palette drop-in.
const BRANCH_COLORS: Record<string, string> = {
  'AI&DS': '#1f8f5c',
  Civil: '#C9A84C',
  CSE: '#17a398',
  ECE: '#d97a3f',
  EEE: '#3d5a99',
  IT: '#c0463f',
  MBA: '#7551a8',
  Mechanical: '#a8710a',
};

function branchKey(label: string): string {
  const stripped = label.replace(/\s*Offers$/i, '').trim();
  if (stripped === 'AIDS') return 'AI&DS';
  if (stripped === 'Mech.') return 'Mechanical';
  return stripped;
}

function branchColor(label: string): string {
  return BRANCH_COLORS[branchKey(label)] ?? 'var(--color-mid-gray)';
}

// Polar → cartesian for a donut sector, angle 0 = 12 o'clock, clockwise.
function polarPoint(cx: number, cy: number, r: number, angleDeg: number) {
  const rad = ((angleDeg - 90) * Math.PI) / 180;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}

function donutSectorPath(cx: number, cy: number, rOuter: number, rInner: number, startAngle: number, endAngle: number): string {
  const largeArc = endAngle - startAngle > 180 ? 1 : 0;
  const p1 = polarPoint(cx, cy, rOuter, startAngle);
  const p2 = polarPoint(cx, cy, rOuter, endAngle);
  const p3 = polarPoint(cx, cy, rInner, endAngle);
  const p4 = polarPoint(cx, cy, rInner, startAngle);
  return [
    `M ${p1.x} ${p1.y}`,
    `A ${rOuter} ${rOuter} 0 ${largeArc} 1 ${p2.x} ${p2.y}`,
    `L ${p3.x} ${p3.y}`,
    `A ${rInner} ${rInner} 0 ${largeArc} 0 ${p4.x} ${p4.y}`,
    'Z',
  ].join(' ');
}

const DONUT_SIZE = 240;
const DONUT_CENTER = DONUT_SIZE / 2;
const DONUT_OUTER_R = 105;
const DONUT_INNER_R = 64;

// Donut proportions are each branch's share *among the listed branches*
// (so the arcs always complete a full circle); the printed percentage
// alongside every slice stays the approved "share of the batch's total
// offers" figure — the two agree on relative order and magnitude (same
// underlying offers, just a different common denominator), so nothing
// reads as contradictory.
function BranchOffersDonut({ data, total }: { data: BranchOfferCount[]; total: number }) {
  const [hovered, setHovered] = useState<string | null>(null);
  const sumOffers = data.reduce((s, d) => s + d.offers, 0) || 1;
  let cumulative = 0;
  const slices = data.map((d) => {
    const sweep = (d.offers / sumOffers) * 360;
    const startAngle = cumulative;
    const endAngle = cumulative + sweep;
    cumulative = endAngle;
    return { ...d, startAngle, endAngle, pct: branchPercentage(d.offers, total), color: branchColor(d.branch) };
  });
  const topBranch = [...slices].sort((a, b) => b.offers - a.offers)[0];

  return (
    <div
      style={{
        background: 'var(--color-white)',
        border: '1.5px solid var(--color-light-gray)',
        borderRadius: 'var(--radius-md)',
        padding: 'var(--space-6) var(--space-5)',
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 'var(--space-8)',
      }}
    >
      <div style={{ position: 'relative', width: DONUT_SIZE, height: DONUT_SIZE, flexShrink: 0 }}>
        <svg viewBox={`0 0 ${DONUT_SIZE} ${DONUT_SIZE}`} width={DONUT_SIZE} height={DONUT_SIZE}>
          {slices.map((s) => {
            const isHovered = hovered === s.branch;
            return (
              <path
                key={s.branch}
                d={donutSectorPath(DONUT_CENTER, DONUT_CENTER, DONUT_OUTER_R, DONUT_INNER_R, s.startAngle, s.endAngle)}
                fill={s.color}
                stroke="var(--color-white)"
                strokeWidth={3}
                strokeLinejoin="round"
                style={{
                  transformOrigin: `${DONUT_CENTER}px ${DONUT_CENTER}px`,
                  transform: isHovered ? 'scale(1.045)' : 'scale(1)',
                  transition: 'transform var(--transition-fast), opacity var(--transition-fast)',
                  opacity: hovered && !isHovered ? 0.55 : 1,
                  cursor: 'pointer',
                }}
                tabIndex={0}
                role="img"
                aria-label={`${s.branch}: ${s.pct.toFixed(1)} percent, ${s.offers.toLocaleString('en-IN')} offers`}
                onMouseEnter={() => setHovered(s.branch)}
                onMouseLeave={() => setHovered(null)}
                onFocus={() => setHovered(s.branch)}
                onBlur={() => setHovered(null)}
              />
            );
          })}
        </svg>

        <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none', textAlign: 'center' }}>
          {hovered ? (
            <>
              <div style={{ fontSize: 'var(--text-2xl)', fontWeight: 900, color: branchColor(hovered), lineHeight: 1 }}>
                {slices.find((s) => s.branch === hovered)!.pct.toFixed(1)}%
              </div>
              <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-light)', marginTop: 'var(--space-1)', maxWidth: 120, lineHeight: 1.3 }}>{hovered}</div>
              <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-light)', marginTop: 2 }}>
                {slices.find((s) => s.branch === hovered)!.offers.toLocaleString('en-IN')} offers
              </div>
            </>
          ) : (
            <>
              <div style={{ fontSize: 'var(--text-2xl)', fontWeight: 900, color: 'var(--color-primary)', lineHeight: 1 }}>
                {total.toLocaleString('en-IN')}
              </div>
              <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-light)', marginTop: 'var(--space-1)' }}>Total Offers</div>
              {topBranch && (
                <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-light)', marginTop: 2 }}>
                  Top: <span style={{ fontWeight: 700, color: topBranch.color }}>{topBranch.branch}</span>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: 'var(--space-2) var(--space-4)', minWidth: 260, flex: 1 }}>
        {slices.map((s) => {
          const isHovered = hovered === s.branch;
          return (
            <li
              key={s.branch}
              tabIndex={0}
              onMouseEnter={() => setHovered(s.branch)}
              onMouseLeave={() => setHovered(null)}
              onFocus={() => setHovered(s.branch)}
              onBlur={() => setHovered(null)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--space-2)',
                padding: '0.35rem 0.5rem',
                borderRadius: 'var(--radius-sm)',
                background: isHovered ? 'var(--color-off-white)' : 'transparent',
                transition: 'background var(--transition-fast)',
                cursor: 'pointer',
                outline: 'none',
              }}
            >
              <span style={{ width: 12, height: 12, borderRadius: 3, background: s.color, flexShrink: 0 }} />
              <span style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text)', flex: 1 }}>{s.branch}</span>
              <span style={{ fontSize: 'var(--text-sm)', fontWeight: 700, color: 'var(--color-primary)' }}>{s.pct.toFixed(1)}%</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

// Shared by the main Placements page and the "Placement Details" sub-page —
// both show the exact same batch-wise accordion, so the state/markup lives
// here once instead of being duplicated.
export default function PlacementYearAccordion({ years, enrichedYears }: Props) {
  const placementYearData = usePlacementYears();
  const visibleYears = years ? placementYearData.filter((y) => years.includes(y.batch)) : placementYearData;
  const [activeStatsYear, setActiveStatsYear] = useState('');
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [statsPage, setStatsPage] = useState(0);

  // Opens the first batch by default, and re-picks one if the currently
  // open batch disappears from the list (e.g. the static fallback above
  // gets replaced by live Firestore data with a different set of batches)
  // — but leaves it alone if the active batch is still present, so a real
  // Firestore load doesn't collapse whatever the visitor had open.
  const visibleBatchKey = visibleYears.map((y) => y.batch).join(',');
  useEffect(() => {
    if (visibleYears.length > 0 && !visibleYears.some((y) => y.batch === activeStatsYear)) {
      setActiveStatsYear(visibleYears[0].batch);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visibleBatchKey]);

  if (visibleYears.length === 0) {
    return (
      <p style={{ color: 'var(--color-text-light)' }}>
        Batch-wise placement data will appear here once it's added from the admin.
      </p>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      {visibleYears.map((y) => {
        const isOpen = activeStatsYear === y.batch;
        const totalPages = Math.max(1, Math.ceil(y.rows.length / entriesPerPage));
        const page = Math.min(statsPage, totalPages - 1);
        const pageRows = entriesPerPage >= y.rows.length ? y.rows : y.rows.slice(page * entriesPerPage, page * entriesPerPage + entriesPerPage);
        return (
          <div key={y.batch}>
            <button
              onClick={() => { setActiveStatsYear(isOpen ? '' : y.batch); setStatsPage(0); }}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                background: isOpen ? 'var(--color-primary)' : 'var(--color-off-white)',
                border: 'none',
                padding: 'var(--space-3) var(--space-5)',
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'background var(--transition-base)',
              }}
            >
              <span style={{ fontWeight: 700, color: isOpen ? 'var(--color-white)' : 'var(--color-primary)', fontSize: 'var(--text-base)', transition: 'color var(--transition-base)' }}>{y.batch}</span>
              <span
                style={{
                  fontSize: '1.2rem',
                  fontWeight: 700,
                  color: isOpen ? 'var(--color-white)' : 'var(--color-text)',
                  lineHeight: 1,
                  display: 'inline-block',
                  transform: isOpen ? 'scale(1.1)' : 'scale(1)',
                  transition: 'transform var(--transition-base), color var(--transition-base)',
                }}
              >
                {isOpen ? '−' : '+'}
              </span>
            </button>

            <SmoothCollapse open={isOpen}>
              <div style={{ padding: 'var(--space-5)', background: 'var(--color-white)', border: '1px solid var(--color-light-gray)', borderTop: 'none' }}>
                <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text)', marginBottom: 'var(--space-5)' }}>
                  {y.batch} Placements as on date: <strong>{y.total !== null ? y.total.toLocaleString('en-IN') : '—'}</strong>
                </p>

                {y.note && (
                  <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-light)', fontStyle: 'italic', marginBottom: y.rows.length > 0 ? 'var(--space-4)' : 0 }}>
                    {y.note}
                  </p>
                )}

                {enrichedYears?.includes(y.batch) && y.branchOffers && (
                  <div style={{ marginBottom: 'var(--space-8)' }}>
                    <div className="mobile-stack-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 'var(--space-4)', marginBottom: 'var(--space-5)' }}>
                      <div style={{ background: 'var(--color-off-white)', border: '1px solid var(--color-light-gray)', borderRadius: 'var(--radius-md)', padding: 'var(--space-4)', textAlign: 'center' }}>
                        <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-light)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.03em' }}>No. of Companies Visited</div>
                        <div style={{ fontFamily: 'var(--font-serif)', fontSize: '1.75rem', fontWeight: 900, color: 'var(--color-primary)' }}>{y.companiesVisited}</div>
                      </div>
                      <div style={{ background: 'var(--color-off-white)', border: '1px solid var(--color-light-gray)', borderRadius: 'var(--radius-md)', padding: 'var(--space-4)', textAlign: 'center' }}>
                        <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-light)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.03em' }}>Total no. of Offers</div>
                        <div style={{ fontFamily: 'var(--font-serif)', fontSize: '1.75rem', fontWeight: 900, color: 'var(--color-primary)' }}>{y.total?.toLocaleString('en-IN')}</div>
                      </div>
                      <div style={{ background: 'var(--color-off-white)', border: '1px solid var(--color-light-gray)', borderRadius: 'var(--radius-md)', padding: 'var(--space-4)', textAlign: 'center' }}>
                        <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-light)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.03em' }}>Top 10 Companies List</div>
                        <div style={{ fontFamily: 'var(--font-serif)', fontSize: '1.1rem', fontWeight: 900, color: 'var(--color-accent)' }}>Package wise</div>
                      </div>
                    </div>

                    <div className="mobile-stack-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 'var(--space-3)', marginBottom: 'var(--space-6)' }}>
                      {y.branchOffers.map((b) => (
                        <div
                          key={b.branch}
                          style={{
                            position: 'relative',
                            background: 'var(--color-white)',
                            border: '1px solid var(--color-light-gray)',
                            borderRadius: 'var(--radius-md)',
                            padding: 'var(--space-3) var(--space-3) var(--space-3) calc(var(--space-3) + 4px)',
                            textAlign: 'center',
                            overflow: 'hidden',
                            boxShadow: 'var(--shadow-sm)',
                          }}
                        >
                          <span style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 4, background: branchColor(b.branch) }} />
                          <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-light)', fontWeight: 700 }}>{b.branch}</div>
                          <div style={{ fontSize: '1.3rem', fontWeight: 900, color: 'var(--color-primary)' }}>{branchPercentage(b.offers, y.total ?? 0).toFixed(1)}%</div>
                        </div>
                      ))}
                    </div>

                    <h3 style={{ fontFamily: 'var(--font-sans)', fontWeight: 900, color: 'var(--color-primary)', marginBottom: 'var(--space-3)', fontSize: 'var(--text-base)' }}>
                      Branch-wise Offers — {y.batch}
                    </h3>
                    <BranchOffersDonut data={y.branchOffers} total={y.total ?? 0} />
                  </div>
                )}

                {y.rows.length > 0 && (
                  <>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginBottom: 'var(--space-4)', fontSize: 'var(--text-sm)', color: 'var(--color-text)' }}>
                      <span>Show</span>
                      <select
                        value={entriesPerPage}
                        onChange={(e) => { setEntriesPerPage(Number(e.target.value)); setStatsPage(0); }}
                        style={{ border: '1px solid var(--color-light-gray)', borderRadius: 'var(--radius-sm)', padding: '0.3rem 0.5rem', fontSize: 'var(--text-sm)' }}
                      >
                        {[10, 25, 50, 100].map((n) => <option key={n} value={n}>{n}</option>)}
                        <option value={y.rows.length}>All</option>
                      </select>
                      <span>entries</span>
                    </div>

                    <div style={{ overflowX: 'auto' }}>
                      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 'var(--text-sm)' }}>
                        <thead>
                          <tr style={{ background: 'var(--color-accent)' }}>
                            <th style={{ textAlign: 'left', padding: 'var(--space-3) var(--space-4)', color: 'var(--color-primary-dark)', fontWeight: 900, whiteSpace: 'nowrap' }}>S.No</th>
                            <th style={{ textAlign: 'left', padding: 'var(--space-3) var(--space-4)', color: 'var(--color-primary-dark)', fontWeight: 900 }}>Company Name</th>
                            <th style={{ textAlign: 'left', padding: 'var(--space-3) var(--space-4)', color: 'var(--color-primary-dark)', fontWeight: 900, whiteSpace: 'nowrap' }}>No. of Selects</th>
                            {y.salaryLabel && (
                              <th style={{ textAlign: 'left', padding: 'var(--space-3) var(--space-4)', color: 'var(--color-primary-dark)', fontWeight: 900 }}>{y.salaryLabel}</th>
                            )}
                          </tr>
                        </thead>
                        <tbody>
                          {pageRows.map((row, i) => (
                            <tr key={`${row.company}-${i}`} style={{ background: i % 2 === 0 ? 'var(--color-off-white)' : 'transparent' }}>
                              <td style={{ padding: 'var(--space-3) var(--space-4)', color: 'var(--color-text)' }}>{page * entriesPerPage + i + 1}</td>
                              <td style={{ padding: 'var(--space-3) var(--space-4)', color: 'var(--color-text)', fontWeight: 600 }}>{row.company}</td>
                              <td style={{ padding: 'var(--space-3) var(--space-4)', color: 'var(--color-text)' }}>{row.selects}</td>
                              {y.salaryLabel && (
                                <td style={{ padding: 'var(--space-3) var(--space-4)', color: 'var(--color-text)' }}>{row.salary}</td>
                              )}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    {totalPages > 1 && (
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 'var(--space-4)', fontSize: 'var(--text-sm)', color: 'var(--color-text-light)' }}>
                        <span>
                          Showing {page * entriesPerPage + 1} to {Math.min(page * entriesPerPage + entriesPerPage, y.rows.length)} of {y.rows.length} entries
                        </span>
                        <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
                          <button
                            onClick={() => setStatsPage((p) => Math.max(0, p - 1))}
                            disabled={page === 0}
                            style={{ padding: '0.3rem 0.8rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-light-gray)', background: 'var(--color-white)', cursor: page === 0 ? 'default' : 'pointer', opacity: page === 0 ? 0.5 : 1 }}
                          >
                            Previous
                          </button>
                          <button
                            onClick={() => setStatsPage((p) => Math.min(totalPages - 1, p + 1))}
                            disabled={page >= totalPages - 1}
                            style={{ padding: '0.3rem 0.8rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-light-gray)', background: 'var(--color-white)', cursor: page >= totalPages - 1 ? 'default' : 'pointer', opacity: page >= totalPages - 1 ? 0.5 : 1 }}
                          >
                            Next
                          </button>
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>
            </SmoothCollapse>
          </div>
        );
      })}
    </div>
  );
}
