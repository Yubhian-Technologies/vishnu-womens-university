import { useState, type ReactNode } from 'react';
import { MapPin, ChevronRight } from 'lucide-react';
import MarqueeText from '../MarqueeText/MarqueeText';
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
        {/* Mobile-only horizontal tab strip — the sidebar quick-nav card
            below is desktop-only (see detail-layout.css); at the
            .detail-grid single-column breakpoint it would otherwise land
            BELOW the active tab's full content, forcing a scroll-past just
            to reach the next tab. This sits pinned above the content
            instead, so switching tabs never requires scrolling first. */}
        <div className="tabs-mobile-strip-wrap">
          <div className="tabs-mobile-strip" role="tablist" aria-label="Sections">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                type="button"
                role="tab"
                aria-selected={active.id === tab.id}
                onClick={() => setActiveId(tab.id)}
                className={`tabs-mobile-strip-btn${active.id === tab.id ? ' is-active' : ''}`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="detail-grid detail-grid--tabs">
          <div>
            <span className="section-label">{active.eyebrow || 'Details'}</span>
            <h2 className="section-title" style={{ fontSize: '1.75rem', marginBottom: 'var(--space-5)' }}>
              {active.heading || active.label}
            </h2>
            {active.content}
          </div>

          <div className="detail-sidebar">
            <div style={{ position: 'sticky', top: '110px' }}>
              <nav className="dept-quick-nav-card" aria-label="Sections">
                <div className="dept-quick-nav-header">
                  <div className="dept-quick-nav-icon">
                    <MapPin size={15} strokeWidth={2.4} />
                  </div>
                  <div className="dept-quick-nav-title-wrap">
                    <h4 className="dept-quick-nav-title">Quick Navigation</h4>
                    <span className="dept-quick-nav-subtitle">{tabs.length} Section{tabs.length === 1 ? '' : 's'}</span>
                  </div>
                </div>
                <ul className="dept-quick-nav-list" role="list">
                  {tabs.map((tab) => {
                    const isActive = active.id === tab.id;
                    return (
                      <li key={tab.id} className="dept-quick-nav-item">
                        <button
                          type="button"
                          onClick={() => setActiveId(tab.id)}
                          aria-current={isActive ? 'true' : undefined}
                          className={`dept-quick-nav-link${isActive ? ' is-active' : ''}`}
                          style={{ width: '100%', font: 'inherit', cursor: 'pointer' }}
                        >
                          <MarqueeText text={tab.label} className="dept-quick-nav-text" />
                          <span className="dept-btn-arrow-circle">
                            <ChevronRight size={13} strokeWidth={2.4} className="dept-quick-nav-arrow" aria-hidden="true" />
                          </span>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
