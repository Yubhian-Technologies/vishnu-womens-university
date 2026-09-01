import { useState, type ReactNode } from 'react';
import '../../pages/detail-layout.css';

export interface TabItem {
  id: string;
  label: string;
  // Small eyebrow label + main heading shown above this tab's content —
  // default to a generic "Details"/the tab's own label so dynamic
  // (admin-defined) tabs need nothing extra; fixed tabs can pass the exact
  // original wording to stay visually identical to before.
  eyebrow?: string;
  heading?: string;
  content: ReactNode;
}

// The one shared sidebar-tab shell — a vertical list of tab buttons with a
// content pane beside it — extracted from the identical markup that used
// to be hand-duplicated across WisePage/IicPage/VdlPage/IdeaLabPage in
// DifferentiatorDetail.tsx. Deliberately content-agnostic: a tab's
// `content` can be the generic CustomSectionsPlain renderer or an existing
// bespoke component, so this works the same whether a tab is admin-defined
// or backed by an existing fixed Firestore panel.
export default function CustomTabsPage({ tabs, defaultTabId }: { tabs: TabItem[]; defaultTabId?: string }) {
  const [activeId, setActiveId] = useState(defaultTabId ?? tabs[0]?.id ?? '');
  const active = tabs.find((t) => t.id === activeId) ?? tabs[0];
  if (!active) return null;

  return (
    <section className="section bg-white">
      <div className="container">
        <div className="detail-grid">
          <div>
            <span className="section-label">{active.eyebrow || 'Details'}</span>
            <h2 className="section-title" style={{ fontSize: '1.75rem', marginBottom: 'var(--space-5)' }}>
              {active.heading || active.label}
            </h2>
            {active.content}
          </div>

          <div className="detail-sidebar">
            <div style={{ background: 'var(--color-off-white)', border: '1.5px solid var(--color-light-gray)', borderRadius: 'var(--radius-md)', overflow: 'hidden', position: 'sticky', top: '110px' }}>
              {tabs.map((tab) => {
                const isActive = active.id === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveId(tab.id)}
                    style={{
                      display: 'block',
                      width: '100%',
                      textAlign: 'left',
                      padding: 'var(--space-3) var(--space-5)',
                      border: 'none',
                      borderBottom: '1px solid var(--color-light-gray)',
                      background: isActive ? 'var(--color-primary)' : 'transparent',
                      color: isActive ? 'var(--color-white)' : 'var(--color-primary)',
                      fontWeight: isActive ? 700 : 600,
                      fontSize: 'var(--text-sm)',
                      cursor: 'pointer',
                    }}
                  >
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
