import { useState } from 'react';
import type { FlexibleTableSection } from '../../lib/structuredTable';

// Shared renderer for parseFlexibleTable's output — the identical <table>
// markup several pages (ResearchDetail.tsx, ProgramDetail.tsx,
// DepartmentDetail.tsx, PlacementDetail.tsx) each hand-roll independently.
// Used by CustomSectionsRenderer for the "table" content type; existing call
// sites are left as-is (retrofitting them risks an unrelated visual diff).
export default function FlexibleTable({ sections }: { sections: FlexibleTableSection[] }) {
  return (
    <>
      {sections.map((section, si) => (
        <div key={si} style={{ marginBottom: si < sections.length - 1 ? 'var(--space-10)' : 0 }}>
          {section.title && (
            <h3 style={{ fontFamily: 'var(--font-sans)', fontSize: 'var(--text-base)', fontWeight: 700, color: 'var(--color-primary)', marginBottom: 'var(--space-3)' }}>
              {section.title}
            </h3>
          )}
          <PaginatedTable section={section} />
        </div>
      ))}
    </>
  );
}

// Rows-per-page choices for any table long enough to need paging (e.g.
// Central Library's "List of Journals", 100+ rows) — a short table (fewer
// rows than the smallest option) just renders in full with no controls.
const PAGE_SIZE_OPTIONS = [10, 25, 50];

function PaginatedTable({ section }: { section: FlexibleTableSection }) {
  const [pageSize, setPageSize] = useState(PAGE_SIZE_OPTIONS[0]);
  const [page, setPage] = useState(0);

  const totalPages = Math.max(1, Math.ceil(section.rows.length / pageSize));
  const currentPage = Math.min(page, totalPages - 1);
  const start = currentPage * pageSize;
  const visibleRows = section.rows.slice(start, start + pageSize);
  const showPagination = section.rows.length > PAGE_SIZE_OPTIONS[0];

  return (
    <>
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
            {visibleRows.map((row, i) => (
              <tr key={start + i} style={{ background: i % 2 === 0 ? 'var(--color-white)' : 'var(--color-off-white)', borderBottom: '1px solid var(--color-light-gray)' }}>
                {row.map((val, j) => (
                  <td key={j} style={{ padding: 'var(--space-3) var(--space-4)', color: 'var(--color-text)', lineHeight: 1.5 }}>
                    {/^https?:\/\//i.test(val) ? (
                      <a href={val} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--color-primary)', fontWeight: 600 }}>View</a>
                    ) : val}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showPagination && (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 'var(--space-3)', marginTop: 'var(--space-4)' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', fontSize: 'var(--text-sm)', color: 'var(--color-text-light)' }}>
            Rows per page
            <select
              value={pageSize}
              onChange={(e) => { setPageSize(Number(e.target.value)); setPage(0); }}
              style={{ padding: '0.3rem 0.5rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-light-gray)', fontSize: 'var(--text-sm)' }}
            >
              {PAGE_SIZE_OPTIONS.map((n) => (
                <option key={n} value={n}>{n}</option>
              ))}
            </select>
          </label>

          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
            <button
              type="button"
              onClick={() => setPage((p) => Math.max(0, p - 1))}
              disabled={currentPage === 0}
              style={{ padding: '0.4rem 0.9rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-light-gray)', background: 'var(--color-white)', color: 'var(--color-primary)', fontWeight: 600, fontSize: 'var(--text-sm)', cursor: currentPage === 0 ? 'not-allowed' : 'pointer', opacity: currentPage === 0 ? 0.5 : 1 }}
            >
              Prev
            </button>
            <span style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text)', whiteSpace: 'nowrap' }}>
              Page {currentPage + 1} of {totalPages}
            </span>
            <button
              type="button"
              onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
              disabled={currentPage >= totalPages - 1}
              style={{ padding: '0.4rem 0.9rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-light-gray)', background: 'var(--color-white)', color: 'var(--color-primary)', fontWeight: 600, fontSize: 'var(--text-sm)', cursor: currentPage >= totalPages - 1 ? 'not-allowed' : 'pointer', opacity: currentPage >= totalPages - 1 ? 0.5 : 1 }}
            >
              Next
            </button>
          </div>
        </div>
      )}
    </>
  );
}
