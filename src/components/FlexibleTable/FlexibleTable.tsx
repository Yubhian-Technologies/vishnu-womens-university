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
      <div style={{ overflowX: 'auto', borderRadius: '14px', border: '1.5px solid #e2e8f0', boxShadow: '0 6px 18px rgba(11, 30, 66, 0.05)', background: '#ffffff', margin: '0.75rem 0 1.25rem' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
          <thead>
            <tr style={{ background: 'linear-gradient(135deg, #0b1e42 0%, #162d5a 100%)', borderBottom: '3px solid #c9973a' }}>
              {section.headers.map((col, ci) => (
                <th key={ci} style={{ padding: '0.9rem 1.2rem', textAlign: 'left', color: '#ffffff', fontWeight: 700, whiteSpace: 'nowrap', letterSpacing: '0.02em', fontSize: '0.85rem', textTransform: 'uppercase' }}>
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {visibleRows.map((row, i) => (
              <tr key={start + i} style={{ background: i % 2 === 0 ? '#ffffff' : '#f8fafc', borderBottom: '1px solid #edf2f7' }}>
                {row.map((val, j) => (
                  <td key={j} style={{ padding: '0.85rem 1.2rem', color: '#334155', lineHeight: 1.6, fontWeight: 500 }}>
                    {/^https?:\/\//i.test(val) ? (
                      <a href={val} target="_blank" rel="noopener noreferrer" style={{ color: '#b45309', fontWeight: 700, textDecoration: 'underline' }}>View</a>
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
