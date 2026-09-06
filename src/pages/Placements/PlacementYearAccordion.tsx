import { useEffect, useState } from 'react';
import type { BranchOfferCount, PlacementRow } from './placementStats.data';
import { usePlacementYears } from './usePlacementYears';
import '../detail-layout.css';

// A batch label like "2022–2026" -> "2026" for the snapshot heading — the
// graduating year reads more naturally there than the full 4-year range.
// Already-bare years (or anything with no 4-digit year at all) pass through
// unchanged.
function endingYear(label: string): string {
  const years = label.match(/\d{4}/g);
  return years ? years[years.length - 1] : label;
}

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
  /** Reports the currently active batch upward whenever it changes (initial
   *  auto-pick included) — this component still owns the selection itself,
   *  a parent can just use this to mirror the choice elsewhere on the page. */
  onActiveYearChange?: (batch: string) => void;
}

// Every batch's salary column is meant to read as LPA (e.g. "59.15"), but
// admins sometimes paste the raw rupee figure straight from a source sheet
// (e.g. "₹59,14,620") instead of converting it by hand first. Auto-convert
// that shape at display time so either input renders correctly, rather than
// requiring admins to divide by 1,00,000 themselves before saving.
function formatSalary(value: string): string {
  const trimmed = (value || '').trim();
  const match = trimmed.match(/^₹\s*([\d,]+(?:\.\d+)?)$/);
  if (!match) return trimmed;
  const rupees = parseFloat(match[1].replace(/,/g, ''));
  if (!Number.isFinite(rupees)) return trimmed;
  return (rupees / 100000).toFixed(2);
}

// A fixed categorical color per branch identity (not per array position —
// batches don't all list the same branches in the same order, and some
// omit a branch entirely, so the same real-world branch must always land
// on the same hue). Validated CVD-safe/normal-vision-safe as a set via the
// dataviz skill's validate_palette.js against this page's white card
// surface; the gold slot doubles as the site's own --color-accent so the
// chart still reads as "on brand" rather than a generic palette drop-in.
export const BRANCH_COLORS: Record<string, string> = {
  'CSE(AI&DS)': '#1f8f5c',
  Civil: '#C9A84C',
  CSE: '#17a398',
  'CSE(AI&ML)': '#5b4b9e',
  'CSE(Cyber Security)': '#c23b7a',
  ECE: '#d97a3f',
  EEE: '#3d5a99',
  IT: '#c0463f',
  MBA: '#7551a8',
  Mechanical: '#a8710a',
  'M. Tech.': '#455a64',
};

function branchKey(label: string): string {
  const stripped = label.replace(/\s*Offers$/i, '').trim();
  if (stripped === 'AIDS' || stripped === 'AI&DS') return 'CSE(AI&DS)';
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

// Donut proportions are each department's share of raw offers *among the
// listed departments* (so the arcs always complete a full circle).
function BranchOffersDonut({ data, total }: { data: BranchOfferCount[]; total: number }) {
  const [hovered, setHovered] = useState<string | null>(null);
  const sumOffers = data.reduce((s, d) => s + d.offers, 0) || 1;
  let cumulative = 0;
  const slices = data.map((d) => {
    const sweep = (d.offers / sumOffers) * 360;
    const startAngle = cumulative;
    const endAngle = cumulative + sweep;
    cumulative = endAngle;
    return { ...d, startAngle, endAngle, color: branchColor(d.branch) };
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
                aria-label={`${s.branch}: ${s.offers.toLocaleString('en-IN')} offers`}
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
                {slices.find((s) => s.branch === hovered)!.offers.toLocaleString('en-IN')}
              </div>
              <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-light)', marginTop: 'var(--space-1)', maxWidth: 120, lineHeight: 1.3 }}>{hovered}</div>
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
              }}
            >
              <span style={{ width: 12, height: 12, borderRadius: 3, background: s.color, flexShrink: 0 }} />
              <span style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text)', flex: 1 }}>{s.branch}</span>
              <span style={{ fontSize: 'var(--text-sm)', fontWeight: 700, color: 'var(--color-primary)' }}>
                {s.offers.toLocaleString('en-IN')}
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

// Short axis label for the bar chart below — same branch identity as
// branchKey(), abbreviated further so ~10 bars fit a narrow sidebar card
// without wrapping.
const SHORT_BRANCH_LABELS: Record<string, string> = {
  'CSE(AI&DS)': 'AI&DS',
  Civil: 'Civil',
  CSE: 'CSE',
  'CSE(AI&ML)': 'AI&ML',
  'CSE(Cyber Security)': 'Cyber',
  ECE: 'ECE',
  EEE: 'EEE',
  IT: 'IT',
  MBA: 'MBA',
  Mechanical: 'Mech',
  'M. Tech.': 'M.Tech',
};

function shortBranchLabel(label: string): string {
  const key = branchKey(label);
  return SHORT_BRANCH_LABELS[key] ?? key;
}

// Uniform-color (site primary green, not per-branch categorical colors like
// the donut above) bar chart for the Placement Cell sidebar.
export function BranchOffersBarChart({ data }: { data: BranchOfferCount[] }) {
  const CHART_HEIGHT = 340;
  const rawMax = Math.max(1, ...data.map((d) => d.offers));
  const chartMax = Math.max(10, Math.ceil(rawMax / 10) * 10);
  const ticks = [1, 0.75, 0.5, 0.25, 0].map((f) => Math.round(chartMax * f));

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', columnGap: 'var(--space-2)' }}>
      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: CHART_HEIGHT, fontSize: 'var(--text-xs)', color: 'var(--color-text-light)' }}>
        {ticks.map((t) => <span key={t} style={{ lineHeight: 1 }}>{t}</span>)}
      </div>
      <div style={{ position: 'relative', height: CHART_HEIGHT }}>
        {ticks.map((t) => (
          <div key={t} style={{ position: 'absolute', left: 0, right: 0, bottom: `${(t / chartMax) * 100}%`, borderTop: '1px dashed var(--color-light-gray)' }} />
        ))}
        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'flex-end', gap: 4 }}>
          {data.map((d) => (
            <div key={d.branch} style={{ flex: 1, height: '100%', display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}>
              <div
                role="img"
                aria-label={`${branchKey(d.branch)}: ${d.offers} offers`}
                title={`${branchKey(d.branch)}: ${d.offers} offers`}
                style={{ width: '100%', maxWidth: 22, height: `${(d.offers / chartMax) * 100}%`, background: 'var(--color-primary)', borderRadius: '3px 3px 0 0' }}
              />
            </div>
          ))}
        </div>
      </div>
      <div />
      <div style={{ display: 'flex', gap: 4, marginTop: 6 }}>
        {data.map((d) => (
          <span key={d.branch} style={{ flex: 1, textAlign: 'center', fontSize: '0.62rem', fontWeight: 700, color: 'var(--color-text)' }}>
            {shortBranchLabel(d.branch)}
          </span>
        ))}
      </div>
    </div>
  );
}

// Shared by the main Placements page and the "Placement Details" sub-page —
// both show the exact same batch-wise accordion, so the state/markup lives
// here once instead of being duplicated.
type CompanyFilter = 'all' | 'it' | 'core' | 'dream';

const COMPANY_FILTERS: { key: CompanyFilter; label: string }[] = [
  { key: 'all', label: 'All Companies' },
  { key: 'it', label: 'IT / Software' },
  { key: 'core', label: 'Core' },
  { key: 'dream', label: 'Dream Package (≥₹10L)' },
];

// Sector-based filters read the row's own `sector` field (only populated for
// some batches/companies so far — untagged rows simply won't appear under
// "IT / Software" or "Core" until an admin/source adds that tag). Dream
// Package is computed straight off the salary column instead, so it works
// for every row regardless of sector tagging.
function matchesCompanyFilter(row: PlacementRow, filter: CompanyFilter): boolean {
  if (filter === 'all') return true;
  if (filter === 'dream') {
    const lpa = parseFloat(formatSalary(row.salary));
    return Number.isFinite(lpa) && lpa >= 10;
  }
  const sector = (row.sector || '').toLowerCase();
  if (filter === 'it') return sector.includes('it');
  return sector.includes('core');
}

export default function PlacementYearAccordion({ years, enrichedYears, onActiveYearChange }: Props) {
  const placementYearData = usePlacementYears();
  const visibleYears = years ? placementYearData.filter((y) => years.includes(y.batch)) : placementYearData;
  const [activeStatsYear, setActiveStatsYear] = useState('');
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [statsPage, setStatsPage] = useState(0);
  const [companyFilter, setCompanyFilter] = useState<CompanyFilter>('all');

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

  useEffect(() => {
    if (activeStatsYear) onActiveYearChange?.(activeStatsYear);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeStatsYear]);

  if (visibleYears.length === 0) {
    return (
      <p style={{ color: 'var(--color-text-light)' }}>
        Batch-wise placement data will appear here once it's added from the admin.
      </p>
    );
  }

  const activeYear = visibleYears.find((y) => y.batch === activeStatsYear) ?? visibleYears[0];
  const filteredRows = companyFilter === 'all' ? activeYear.rows : activeYear.rows.filter((r) => matchesCompanyFilter(r, companyFilter));
  const totalPages = Math.max(1, Math.ceil(filteredRows.length / entriesPerPage));
  const page = Math.min(statsPage, totalPages - 1);
  const pageRows = entriesPerPage >= filteredRows.length ? filteredRows : filteredRows.slice(page * entriesPerPage, page * entriesPerPage + entriesPerPage);

  return (
    <div>
      {/* Batch pills — pick which year's panel shows below */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-3)', marginBottom: 'var(--space-6)' }}>
        {visibleYears.map((y) => {
          const isActive = activeYear.batch === y.batch;
          return (
            <button
              key={y.batch}
              onClick={() => { setActiveStatsYear(y.batch); setStatsPage(0); }}
              style={{
                padding: '0.6rem 1.5rem',
                borderRadius: 'var(--radius-full)',
                border: '1.5px solid var(--color-primary)',
                background: isActive ? 'var(--color-primary)' : 'var(--color-white)',
                color: isActive ? 'var(--color-white)' : 'var(--color-primary)',
                fontWeight: 700,
                fontSize: 'var(--text-sm)',
                cursor: 'pointer',
                transition: 'background var(--transition-base), color var(--transition-base)',
              }}
            >
              AY. {y.batch.replace('–', '-')}
            </button>
          );
        })}
      </div>

      {(() => {
        const y = activeYear;
        return (
              <div style={{ padding: 'var(--space-5)', background: 'var(--color-white)', border: '1px solid var(--color-light-gray)', borderRadius: 'var(--radius-md)' }}>
                <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text)', marginBottom: 'var(--space-5)' }}>
                  {endingYear(y.batch)} Placement Snapshot
                </p>

                {y.note && (
                  <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-light)', fontStyle: 'italic', marginBottom: y.rows.length > 0 ? 'var(--space-4)' : 0 }}>
                    {y.note}
                  </p>
                )}

                {enrichedYears?.includes(y.batch) && y.branchOffers && (
                  <div style={{ marginBottom: 'var(--space-8)' }}>
                    {/* Same dept-stat-grid/dept-stat-tile styling as the
                        Department Overview Placements stat tiles (see
                        DepartmentDetail.tsx) — one dark navy/gold card with
                        every stat as a divided column, instead of separate
                        light gray boxes. Average Salary/Median Salary/
                        Highest Package/Above N LPA+ tiles are individually
                        hidden when not present, same as there. */}
                    <div className="dept-stat-grid">
                      <div className="dept-stat-tile">
                        <div className="dept-stat-tile__circle"><span className="dept-stat-tile__value">{y.companiesVisited}</span></div>
                        <div className="dept-stat-tile__label">No. of Companies Visited</div>
                      </div>
                      <div className="dept-stat-tile">
                        <div className="dept-stat-tile__circle"><span className="dept-stat-tile__value">{y.total?.toLocaleString('en-IN')}</span></div>
                        <div className="dept-stat-tile__label">Total No. of Offers</div>
                      </div>
                      {y.averageSalaryLPA != null && (
                        <div className="dept-stat-tile">
                          <div className="dept-stat-tile__circle"><span className="dept-stat-tile__value">{y.averageSalaryLPA} LPA</span></div>
                          <div className="dept-stat-tile__label">Average Salary</div>
                        </div>
                      )}
                      {y.medianSalaryLPA != null && (
                        <div className="dept-stat-tile">
                          <div className="dept-stat-tile__circle"><span className="dept-stat-tile__value">{y.medianSalaryLPA} LPA</span></div>
                          <div className="dept-stat-tile__label">Median Salary</div>
                        </div>
                      )}
                      {y.highestPackageLPA != null && (
                        <div className="dept-stat-tile">
                          <div className="dept-stat-tile__circle"><span className="dept-stat-tile__value">{y.highestPackageLPA} LPA</span></div>
                          <div className="dept-stat-tile__label">Highest Package</div>
                        </div>
                      )}
                      {y.offersAbove50LPA != null && (
                        <div className="dept-stat-tile">
                          <div className="dept-stat-tile__circle"><span className="dept-stat-tile__value">{y.offersAbove50LPA} offers</span></div>
                          <div className="dept-stat-tile__label">Above 50 LPA+</div>
                        </div>
                      )}
                      {y.offersAbove30LPA != null && (
                        <div className="dept-stat-tile">
                          <div className="dept-stat-tile__circle"><span className="dept-stat-tile__value">{y.offersAbove30LPA} offers</span></div>
                          <div className="dept-stat-tile__label">Above 30 LPA+</div>
                        </div>
                      )}
                      {y.offersAbove10LPA != null && (
                        <div className="dept-stat-tile">
                          <div className="dept-stat-tile__circle"><span className="dept-stat-tile__value">{y.offersAbove10LPA} offers</span></div>
                          <div className="dept-stat-tile__label">Above 10 LPA+</div>
                        </div>
                      )}
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
                            overflow: 'hidden',
                            boxShadow: 'var(--shadow-sm)',
                            display: 'flex',
                            alignItems: 'stretch',
                          }}
                        >
                          <span style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 4, background: branchColor(b.branch) }} />
                          <div style={{ flex: 1, textAlign: 'center' }}>
                            <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-light)', fontWeight: 700 }}>{b.branch}</div>
                            <div style={{ fontSize: '1.3rem', fontWeight: 900, color: 'var(--color-primary)' }}>{b.offers.toLocaleString('en-IN')}</div>
                          </div>
                          {b.highestLPA != null && (
                            <div style={{ flex: 1, textAlign: 'center', borderLeft: '1px solid var(--color-light-gray)', marginLeft: 'var(--space-2)', paddingLeft: 'var(--space-2)' }}>
                              <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-light)', fontWeight: 700 }}>Highest Package</div>
                              <div style={{ fontSize: '1.3rem', fontWeight: 900, color: 'var(--color-primary)' }}>{b.highestLPA} LPA</div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>

                    <h3 style={{ fontFamily: 'var(--font-sans)', fontWeight: 900, color: 'var(--color-primary)', marginBottom: 'var(--space-3)', fontSize: 'var(--text-base)' }}>
                      Branch-Wise Placement Overview
                    </h3>
                    <BranchOffersDonut data={y.branchOffers} total={y.total ?? 0} />
                  </div>
                )}

                {y.rows.length > 0 && (
                  <>
                    <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 'var(--space-3)', marginBottom: 'var(--space-4)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', fontSize: 'var(--text-sm)', color: 'var(--color-text)' }}>
                        <span>Show</span>
                        <select
                          value={entriesPerPage}
                          onChange={(e) => { setEntriesPerPage(Number(e.target.value)); setStatsPage(0); }}
                          style={{ border: '1px solid var(--color-light-gray)', borderRadius: 'var(--radius-sm)', padding: '0.3rem 0.5rem', fontSize: 'var(--text-sm)' }}
                        >
                          {[10, 25, 50, 100].map((n) => <option key={n} value={n}>{n}</option>)}
                          <option value={filteredRows.length || 1}>All</option>
                        </select>
                        <span>entries</span>
                      </div>

                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-2)' }}>
                        {COMPANY_FILTERS.map((f) => {
                          const isActive = companyFilter === f.key;
                          return (
                            <button
                              key={f.key}
                              onClick={() => { setCompanyFilter(f.key); setStatsPage(0); }}
                              style={{
                                padding: '0.45rem 1rem',
                                borderRadius: 'var(--radius-md)',
                                border: `1.5px solid ${isActive ? 'var(--color-primary-dark)' : 'var(--color-light-gray)'}`,
                                background: isActive ? 'var(--color-primary-dark)' : 'var(--color-white)',
                                color: isActive ? 'var(--color-white)' : 'var(--color-text)',
                                fontWeight: 600,
                                fontSize: 'var(--text-sm)',
                                cursor: 'pointer',
                                whiteSpace: 'nowrap',
                                transition: 'background var(--transition-base), color var(--transition-base)',
                              }}
                            >
                              {f.label}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {filteredRows.length === 0 ? (
                      <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-light)', padding: 'var(--space-4) 0' }}>
                        No companies match this filter for this batch.
                      </p>
                    ) : (
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
                            {y.rows.some((r) => r.sector) && (
                              <th style={{ textAlign: 'left', padding: 'var(--space-3) var(--space-4)', color: 'var(--color-primary-dark)', fontWeight: 900 }}>Sector</th>
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
                                <td style={{ padding: 'var(--space-3) var(--space-4)', color: 'var(--color-text)' }}>{formatSalary(row.salary)}</td>
                              )}
                              {y.rows.some((r) => r.sector) && (
                                <td style={{ padding: 'var(--space-3) var(--space-4)', color: 'var(--color-text)' }}>{row.sector}</td>
                              )}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    )}

                    {totalPages > 1 && filteredRows.length > 0 && (
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 'var(--space-4)', fontSize: 'var(--text-sm)', color: 'var(--color-text-light)' }}>
                        <span>
                          Showing {page * entriesPerPage + 1} to {Math.min(page * entriesPerPage + entriesPerPage, filteredRows.length)} of {filteredRows.length} entries
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
        );
      })()}
    </div>
  );
}
