import { useState } from 'react';
import { FileText, Link2 } from 'lucide-react';
import { hasCustomSectionContent, type CustomSection } from '../../lib/customSections';
import { parseFlexibleTable, parseLinkList } from '../../lib/structuredTable';
import FlexibleTable from '../FlexibleTable/FlexibleTable';
import SmoothCollapse from '../SmoothCollapse/SmoothCollapse';

// Renders admin-defined custom sections (see lib/customSections.ts).
// No .reveal/scroll-reveal classes anywhere here — gated behind
// Firestore-loaded data, same reason every other conditionally-rendered
// section on these pages avoids it (see the gotcha documented in CLAUDE.md).
const DEFAULT_NAV_OFFSET = 'calc(var(--topbar-height) + var(--header-height) + 1rem)';

// Default export — used by ProgramDetail.tsx/DepartmentDetail.tsx, where
// every custom section renders as its own full-width section before the CTA
// (Programs pages don't have the intro-column/accordion split Differentiators
// pages do, so `placement` is irrelevant here — every section renders the
// same way regardless of it).
export default function CustomSectionsRenderer({ sections, navOffset = DEFAULT_NAV_OFFSET }: { sections: CustomSection[]; navOffset?: string }) {
  const visible = sections.filter(hasCustomSectionContent);
  if (visible.length === 0) return null;

  return (
    <>
      {visible.map((section) => (
        <section key={section.id} id={section.id} className="section bg-white" style={{ scrollMarginTop: navOffset }}>
          <div className="container">
            <div style={{ marginBottom: 'var(--space-8)' }}>
              <span className="section-label">Details</span>
              <h2 className="section-title" style={{ fontSize: '1.75rem', fontWeight: section.boldHeading ? 800 : undefined }}>{section.label}</h2>
            </div>
            <CustomSectionBody section={section} />
            {(section.subSections || []).filter(hasCustomSectionContent).map((sub) => (
              <div key={sub.id} style={{ marginTop: 'var(--space-8)' }}>
                <h3 style={{ fontFamily: 'var(--font-sans)', fontSize: '1.1rem', fontWeight: 700, color: 'var(--color-primary)', marginBottom: 'var(--space-3)' }}>
                  {sub.label}
                </h3>
                <CustomSectionBody section={sub} />
              </div>
            ))}
          </div>
        </section>
      ))}
    </>
  );
}

// Differentiators detail page — sections with placement:'intro' render
// compactly inline in the page's existing intro column (next to About),
// matching the small accent-bar SectionHeading style the old hardcoded
// Vision/Mission/Objectives blocks used, instead of a full boxed section.
export function CustomSectionsIntro({ sections }: { sections: CustomSection[] }) {
  const visible = sections.filter((s) => s.placement === 'intro' && hasCustomSectionContent(s));
  return (
    <>
      {visible.map((section) => (
        <div key={section.id} style={{ marginTop: 'var(--space-6)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', marginBottom: 'var(--space-3)' }}>
            <div style={{ width: 4, height: 24, background: 'var(--color-accent)', borderRadius: 'var(--radius-full)' }} />
            <h3 style={{ fontSize: '1.25rem', margin: 0, fontWeight: section.boldHeading ? 800 : undefined }}>{section.label}</h3>
          </div>
          <CustomSectionBody section={section} />
          {(section.subSections || []).filter(hasCustomSectionContent).map((sub) => (
            <div key={sub.id} style={{ marginTop: 'var(--space-4)' }}>
              <h4 style={{ fontFamily: 'var(--font-sans)', fontSize: 'var(--text-base)', fontWeight: 700, color: 'var(--color-primary)', marginBottom: 'var(--space-2)' }}>
                {sub.label}
              </h4>
              <CustomSectionBody section={sub} />
            </div>
          ))}
        </div>
      ))}
    </>
  );
}

// Groups a run of consecutive contentType:'person' sections together so
// they can render as one expandable panel list instead of each getting its
// own stacked heading+body block — everything else renders one at a time as
// before.
type SectionRun = { type: 'people'; items: CustomSection[] } | { type: 'section'; item: CustomSection };
function groupIntoRuns(sections: CustomSection[]): SectionRun[] {
  const runs: SectionRun[] = [];
  for (const s of sections) {
    if (s.contentType === 'person') {
      const last = runs[runs.length - 1];
      if (last?.type === 'people') last.items.push(s);
      else runs.push({ type: 'people', items: [s] });
    } else {
      runs.push({ type: 'section', item: s });
    }
  }
  return runs;
}

// A sidebar-tab page's own tab content (see CustomTabsPage.tsx) — every
// visible section renders in the same compact style as CustomSectionsIntro,
// unfiltered by `placement` (inside one tab, every section belongs
// together — there's no separate accordion zone the way the intro/
// accordion Differentiators pages have). Consecutive 'person' sections
// (e.g. a team roster) group into an expandable panel list instead — see
// PersonPanelList.
export function CustomSectionsPlain({ sections }: { sections: CustomSection[] }) {
  const visible = sections.filter(hasCustomSectionContent);
  const runs = groupIntoRuns(visible);
  return (
    <>
      {runs.map((run, i) => {
        if (run.type === 'people') {
          return (
            <div key={`people-${run.items[0].id}`} style={{ marginTop: i === 0 ? 0 : 'var(--space-6)' }}>
              <PersonPanelList people={run.items} />
            </div>
          );
        }
        const section = run.item;
        return (
          <div key={section.id} style={{ marginTop: i === 0 ? 0 : 'var(--space-6)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', marginBottom: 'var(--space-3)' }}>
              <div style={{ width: 4, height: 24, background: 'var(--color-accent)', borderRadius: 'var(--radius-full)' }} />
              <h3 style={{ fontSize: '1.25rem', margin: 0, fontWeight: section.boldHeading ? 800 : undefined }}>{section.label}</h3>
            </div>
            <CustomSectionBody section={section} />
            {(section.subSections || []).filter(hasCustomSectionContent).map((sub) => (
              <div key={sub.id} style={{ marginTop: 'var(--space-4)' }}>
                <h4 style={{ fontFamily: 'var(--font-sans)', fontSize: 'var(--text-base)', fontWeight: 700, color: 'var(--color-primary)', marginBottom: 'var(--space-2)' }}>
                  {sub.label}
                </h4>
                <CustomSectionBody section={sub} />
              </div>
            ))}
          </div>
        );
      })}
    </>
  );
}

// A run of consecutive 'person' sections (e.g. a team roster) — one row per
// person, name + position as the row label, click to expand that row's bio
// below it. Same single-open-accordion shape/style as CustomSectionsAccordion
// above (reused deliberately, not hover-based — a long bio only affects that
// one row's height, not the whole group, unlike a card grid where uneven bio
// lengths broke the row layout).
function PersonPanelList({ people }: { people: CustomSection[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      {people.map((person, i) => {
        const isOpen = openIndex === i;
        const hasBio = !!person.textContent?.trim();
        return (
          <div key={person.id}>
            <button
              type="button"
              onClick={() => hasBio && setOpenIndex(isOpen ? null : i)}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                background: isOpen ? 'var(--color-primary)' : 'var(--color-off-white)',
                border: 'none',
                padding: 'var(--space-3) var(--space-5)',
                cursor: hasBio ? 'pointer' : 'default',
                textAlign: 'left',
              }}
            >
              <span style={{ fontWeight: person.boldHeading ? 800 : 700, color: isOpen ? 'var(--color-white)' : 'var(--color-primary)', fontSize: 'var(--text-base)' }}>
                {person.label}{person.personPosition ? `, ${person.personPosition}` : ''}
              </span>
              {hasBio && (
                <span style={{ fontSize: '1.2rem', fontWeight: 700, color: isOpen ? 'var(--color-white)' : 'var(--color-text)', lineHeight: 1 }}>{isOpen ? '−' : '+'}</span>
              )}
            </button>
            {hasBio && (
              <SmoothCollapse open={isOpen}>
                <div style={{ padding: 'var(--space-5)', background: 'var(--color-white)', border: '1px solid var(--color-light-gray)', borderTop: 'none', display: 'flex', gap: 'var(--space-4)', alignItems: 'flex-start', flexWrap: 'wrap' }}>
                  {person.photo?.imageUrl && (
                    <img
                      src={person.photo.imageUrl}
                      alt={person.label}
                      style={{ width: 70, height: 70, borderRadius: '50%', objectFit: 'cover', flexShrink: 0, border: '1px solid var(--color-light-gray)' }}
                    />
                  )}
                  <p style={{ flex: '1 1 240px', color: 'var(--color-text)', lineHeight: 1.8, whiteSpace: 'pre-line', margin: 0 }}>{person.textContent}</p>
                </div>
              </SmoothCollapse>
            )}
          </div>
        );
      })}
    </div>
  );
}

// Alternate display for a tab whose `sectionsDisplay` is 'pills' instead of
// the default 'stacked' (CustomSectionsPlain above) — a horizontal row of
// pill buttons, one per top-level section, with only the selected section's
// content shown below. Matches the old WISE Modules tab's own internal tab
// strip (Python Programming / Java / Weaving the Web / Angular JS / Machine
// Learning / Projects), which the generic stacked renderer couldn't
// reproduce since it always showed every section at once.
export function CustomSectionsPills({ sections }: { sections: CustomSection[] }) {
  const visible = sections.filter(hasCustomSectionContent);
  const [activeId, setActiveId] = useState<string | null>(null);
  const active = visible.find((s) => s.id === activeId) ?? visible[0];
  if (visible.length === 0) return null;

  return (
    <div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-2)', marginBottom: 'var(--space-6)' }}>
        {visible.map((s) => {
          const isActive = active?.id === s.id;
          return (
            <button
              key={s.id}
              type="button"
              onClick={() => setActiveId(s.id)}
              style={{
                padding: '0.6rem 1.25rem',
                borderRadius: 'var(--radius-full)',
                border: 'none',
                background: isActive ? 'var(--color-primary)' : 'var(--color-off-white)',
                color: isActive ? 'var(--color-white)' : 'var(--color-primary)',
                fontWeight: 700,
                fontSize: 'var(--text-sm)',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
              }}
            >
              {s.label}
            </button>
          );
        })}
      </div>
      {active && (
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', marginBottom: 'var(--space-3)' }}>
            <div style={{ width: 4, height: 24, background: 'var(--color-accent)', borderRadius: 'var(--radius-full)' }} />
            <h3 style={{ fontSize: '1.25rem', margin: 0, fontWeight: active.boldHeading ? 800 : undefined }}>{active.label}</h3>
          </div>
          <CustomSectionBody section={active} />
          {(active.subSections || []).filter(hasCustomSectionContent).map((sub) => (
            <div key={sub.id} style={{ marginTop: 'var(--space-4)' }}>
              <h4 style={{ fontFamily: 'var(--font-sans)', fontSize: 'var(--text-base)', fontWeight: 700, color: 'var(--color-primary)', marginBottom: 'var(--space-2)' }}>
                {sub.label}
              </h4>
              <CustomSectionBody section={sub} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// Differentiators detail page — every section WITHOUT placement:'intro'
// (the default) renders as a single-open collapsible accordion, matching the
// old hardcoded In-charge/Academic Projects/Students Benefited/Outcomes/
// Activities accordions.
export function CustomSectionsAccordion({ sections }: { sections: CustomSection[] }) {
  const visible = sections.filter((s) => s.placement !== 'intro' && hasCustomSectionContent(s));
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  if (visible.length === 0) return null;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 2, marginTop: 'var(--space-6)' }}>
      {visible.map((section, i) => {
        const isOpen = openIndex === i;
        const visibleSubs = (section.subSections || []).filter(hasCustomSectionContent);
        return (
          <div key={section.id}>
            <button
              type="button"
              onClick={() => setOpenIndex(isOpen ? null : i)}
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
              <span style={{ fontWeight: 700, color: isOpen ? 'var(--color-white)' : 'var(--color-primary)', fontSize: 'var(--text-base)' }}>{section.label}</span>
              <span style={{ fontSize: '1.2rem', fontWeight: 700, color: isOpen ? 'var(--color-white)' : 'var(--color-text)', lineHeight: 1 }}>{isOpen ? '−' : '+'}</span>
            </button>
            <SmoothCollapse open={isOpen}>
              <div style={{ padding: 'var(--space-5)', background: 'var(--color-white)', border: '1px solid var(--color-light-gray)', borderTop: 'none' }}>
                <CustomSectionBody section={section} />
                {visibleSubs.map((sub) => (
                  <div key={sub.id} style={{ marginTop: 'var(--space-5)' }}>
                    <h4 style={{ fontFamily: 'var(--font-sans)', fontSize: 'var(--text-base)', fontWeight: 700, color: 'var(--color-primary)', marginBottom: 'var(--space-2)' }}>
                      {sub.label}
                    </h4>
                    <CustomSectionBody section={sub} />
                  </div>
                ))}
              </div>
            </SmoothCollapse>
          </div>
        );
      })}
    </div>
  );
}

function CustomSectionBody({ section }: { section: CustomSection }) {
  const body = <CustomSectionBodyContent section={section} />;
  if (!section.photo?.imageUrl) return body;
  return (
    <div style={{ display: 'flex', gap: 'var(--space-5)', alignItems: 'flex-start', flexWrap: 'wrap' }}>
      <img
        src={section.photo.imageUrl}
        alt={section.label}
        style={{ width: 90, height: 90, borderRadius: '50%', objectFit: 'cover', flexShrink: 0, border: '1px solid var(--color-light-gray)' }}
      />
      <div style={{ flex: '1 1 260px', minWidth: 0 }}>{body}</div>
    </div>
  );
}

function CustomSectionBodyContent({ section }: { section: CustomSection }) {
  if (section.contentType === 'text') {
    if (!section.textContent?.trim()) return null;
    return (
      <p style={{ color: 'var(--color-text)', lineHeight: 1.8, whiteSpace: 'pre-line' }}>
        {section.textContent}
      </p>
    );
  }
  if (section.contentType === 'person') {
    if (!section.personPosition?.trim() && !section.textContent?.trim()) return null;
    return (
      <>
        {section.personPosition?.trim() && (
          <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-accent)', fontWeight: 600, margin: '0 0 var(--space-2)' }}>
            {section.personPosition}
          </p>
        )}
        {section.textContent?.trim() && (
          <p style={{ color: 'var(--color-text)', lineHeight: 1.8, whiteSpace: 'pre-line' }}>
            {section.textContent}
          </p>
        )}
      </>
    );
  }
  if (section.contentType === 'table') {
    return <FlexibleTable sections={parseFlexibleTable(section.tableText || '')} />;
  }
  if (section.contentType === 'links') {
    const groups = parseLinkList(section.linksText || '');
    return (
      <>
        {groups.map((group, gi) => (
          <div key={gi} style={{ marginBottom: gi < groups.length - 1 ? 'var(--space-6)' : 0 }}>
            {group.title && (
              <h4 style={{ fontFamily: 'var(--font-sans)', fontSize: 'var(--text-sm)', fontWeight: 700, color: 'var(--color-primary)', marginBottom: 'var(--space-2)' }}>
                {group.title}
              </h4>
            )}
            <ul className="annual-reports-list">
              {group.links.map((l, li) => (
                <li key={li}>
                  <a href={l.url} target="_blank" rel="noopener noreferrer" className="annual-reports-link">
                    <Link2 size={14} strokeWidth={2} className="annual-reports-icon" />
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </>
    );
  }
  if (section.contentType === 'list') {
    const items = (section.listText || '').split('\n').map((s) => s.trim()).filter(Boolean);
    return (
      <ul style={{ listStyle: 'none', margin: '0 0 var(--space-5)', padding: 0, display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
        {items.map((point, i) => (
          <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 'var(--space-3)' }}>
            <span style={{ width: 18, height: 18, borderRadius: '50%', background: 'var(--color-accent)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 2 }}>
              <svg width="9" height="9" viewBox="0 0 10 10" fill="none"><path d="M2 5l2.5 2.5L8 3" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </span>
            <span style={{ fontSize: 'var(--text-base)', color: 'var(--color-text)', lineHeight: 1.6 }}>{point}</span>
          </li>
        ))}
      </ul>
    );
  }
  // files
  const files = (section.files || []).filter((f) => f.fileUrl);
  return (
    <ul className="annual-reports-list">
      {files.map((f, fi) => (
        <li key={fi}>
          <a href={f.fileUrl} target="_blank" rel="noopener noreferrer" className="annual-reports-link">
            <FileText size={14} strokeWidth={2} className="annual-reports-icon" />
            {f.label || 'Download'}
          </a>
        </li>
      ))}
    </ul>
  );
}
