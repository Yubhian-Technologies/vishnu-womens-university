import type { SectionBlock } from '../../lib/facultySections';
import { linkify } from '../../lib/linkify';

const TABLE_TH_STYLE = {
  background: 'var(--color-off-white)',
  color: 'var(--color-primary)',
  padding: 'var(--space-3) var(--space-4)',
  textAlign: 'left' as const,
  fontSize: 'var(--text-sm)',
  fontWeight: 800,
  borderBottom: '1.5px solid var(--color-light-gray)',
};
const TABLE_TD_STYLE = {
  padding: 'var(--space-3) var(--space-4)',
  fontSize: 'var(--text-sm)',
  color: 'var(--color-text)',
};

/** Renders one faculty profile section's body — a mix of paragraphs, bullet
 *  lists, and tables authored as plain text in /admin → Faculty (see
 *  src/lib/facultySections.ts for the encoding). Shared by FacultyProfile.tsx
 *  and FreshmanEngineering.tsx's About HOD tab so both stay visually and
 *  behaviorally in sync. */
export default function FacultySectionContent({ blocks }: { blocks: SectionBlock[] }) {
  if (blocks.length === 0) {
    return (
      <p style={{ fontSize: 'var(--text-base)', color: 'var(--color-text-light)' }}>
        Content for this section is coming soon.
      </p>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
      {blocks.map((block, i) => {
        if (block.type === 'paragraph') {
          return (
            <p key={i} style={{ fontSize: 'var(--text-base)', color: 'var(--color-text)', lineHeight: 1.75, margin: 0 }}>
              {linkify(block.text)}
            </p>
          );
        }
        if (block.type === 'bullets') {
          return (
            <ul key={i} style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
              {block.items.map((item, ii) => (
                <li key={ii} style={{ display: 'flex', alignItems: 'flex-start', gap: 'var(--space-3)' }}>
                  <span style={{ width: 7, height: 7, borderRadius: '50%', background: 'var(--color-accent)', flexShrink: 0, marginTop: 9 }} />
                  <span style={{ fontSize: 'var(--text-base)', color: 'var(--color-text)', lineHeight: 1.7 }}>{linkify(item)}</span>
                </li>
              ))}
            </ul>
          );
        }
        return (
          <div key={i} style={{ overflowX: 'auto', border: '1px solid var(--color-light-gray)', borderRadius: 'var(--radius-md)' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  {block.headers.map((h, hi) => <th key={hi} style={TABLE_TH_STYLE}>{h}</th>)}
                </tr>
              </thead>
              <tbody>
                {block.rows.map((row, ri) => (
                  <tr key={ri} style={{ background: ri % 2 === 0 ? 'var(--color-white)' : 'var(--color-off-white)' }}>
                    {row.cells.map((cell, ci) => <td key={ci} style={TABLE_TD_STYLE}>{linkify(cell)}</td>)}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      })}
    </div>
  );
}
