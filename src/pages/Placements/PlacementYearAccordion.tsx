import { useEffect, useState } from 'react';
import type { BranchOfferCount } from './placementStats.data';
import { usePlacementYears } from './usePlacementYears';

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

function BranchOffersChart({ data }: { data: BranchOfferCount[] }) {
  const max = Math.max(...data.map((d) => d.offers));
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: 'var(--space-4)', height: 220, padding: 'var(--space-5) var(--space-4) var(--space-6)', overflowX: 'auto' }}>
      {data.map((d) => {
        const heightPct = max > 0 ? (d.offers / max) * 100 : 0;
        return (
          <div key={d.branch} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'var(--space-2)', minWidth: 64 }}>
            <div style={{ fontSize: 'var(--text-xs)', fontWeight: 700, color: 'var(--color-text)' }}>{d.offers}</div>
            <div style={{ display: 'flex', alignItems: 'flex-end', height: 160 }}>
              <div
                style={{
                  width: 22,
                  height: `${Math.max(heightPct, 2)}%`,
                  background: 'var(--color-primary)',
                  borderRadius: '4px 4px 0 0',
                }}
              />
            </div>
            <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-light)', textAlign: 'center', lineHeight: 1.3 }}>{d.branch}</div>
          </div>
        );
      })}
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
              }}
            >
              <span style={{ fontWeight: 700, color: isOpen ? 'var(--color-white)' : 'var(--color-primary)', fontSize: 'var(--text-base)' }}>{y.batch}</span>
              <span style={{ fontSize: '1.2rem', fontWeight: 700, color: isOpen ? 'var(--color-white)' : 'var(--color-text)', lineHeight: 1 }}>{isOpen ? '−' : '+'}</span>
            </button>

            {isOpen && (
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
                        <div key={b.branch} style={{ background: 'var(--color-white)', border: '1.5px solid var(--color-accent)', borderRadius: 'var(--radius-md)', padding: 'var(--space-3)', textAlign: 'center' }}>
                          <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-light)', fontWeight: 700 }}>{b.branch}</div>
                          <div style={{ fontSize: '1.3rem', fontWeight: 900, color: 'var(--color-primary)' }}>{b.offers}</div>
                        </div>
                      ))}
                    </div>

                    <h3 style={{ fontFamily: 'var(--font-sans)', fontWeight: 900, color: 'var(--color-primary)', marginBottom: 'var(--space-3)', fontSize: 'var(--text-base)' }}>
                      Branch-wise Offers — {y.batch}
                    </h3>
                    <BranchOffersChart data={y.branchOffers} />
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
            )}
          </div>
        );
      })}
    </div>
  );
}
