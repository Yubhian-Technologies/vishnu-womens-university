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
        </div>
      ))}
    </>
  );
}
