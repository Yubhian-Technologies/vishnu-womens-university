import { useState } from 'react';

export interface OutcomeGroup {
  key: string;
  /** Short label shown on the tab itself, e.g. "PEOs". */
  tabLabel: string;
  /** Full heading shown above the list once this tab is active. */
  title: string;
  items?: string[];
}

// Click-to-switch PEOs/POs/PSOs, replacing the old always-all-visible
// 3-column grid — shared by ProgramDetail.tsx (standalone programme pages)
// and DepartmentDetail.tsx (grouped AI/CSE/ECE pages) so both render
// identically. Groups with no items are dropped entirely, same as before;
// nothing renders if every group is empty.
export default function OutcomeTabs({ groups }: { groups: OutcomeGroup[] }) {
  const available = groups.filter((g) => g.items && g.items.length > 0);
  const [active, setActive] = useState(available[0]?.key);
  if (available.length === 0) return null;
  const activeGroup = available.find((g) => g.key === active) || available[0];

  return (
    <div>
      <div style={{ display: 'flex', borderRadius: 'var(--radius-md)', overflow: 'hidden', marginBottom: 'var(--space-6)' }}>
        {available.map((g) => {
          const isActive = g.key === activeGroup.key;
          return (
            <button
              key={g.key}
              type="button"
              onClick={() => setActive(g.key)}
              aria-pressed={isActive}
              style={{
                flex: 1,
                padding: 'var(--space-4) var(--space-5)',
                background: isActive ? 'var(--color-primary)' : 'var(--color-off-white)',
                color: isActive ? 'var(--color-white)' : 'var(--color-text)',
                border: 'none',
                fontFamily: 'var(--font-sans)',
                fontSize: 'var(--text-sm)',
                fontWeight: 700,
                cursor: 'pointer',
                transition: 'background var(--transition-fast), color var(--transition-fast)',
              }}
            >
              {g.tabLabel}
            </button>
          );
        })}
      </div>
      <div style={{ background: 'var(--color-off-white)', border: '1.5px solid var(--color-light-gray)', borderRadius: 'var(--radius-md)', padding: 'var(--space-6)' }}>
        <h3 style={{ fontFamily: 'var(--font-sans)', fontSize: 'var(--text-sm)', fontWeight: 800, color: 'var(--color-primary)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 'var(--space-4)', paddingBottom: 'var(--space-3)', borderBottom: '2px solid var(--color-accent)' }}>
          {activeGroup.title}
        </h3>
        <ol style={{ padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 'var(--space-3)', listStylePosition: 'inside' }}>
          {activeGroup.items!.map((item, i) => (
            <li key={item} style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text)', lineHeight: 1.65 }}>
              <strong style={{ color: 'var(--color-accent)' }}>{activeGroup.key.slice(0, -1).toUpperCase()}{i + 1}:</strong> {item}
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
