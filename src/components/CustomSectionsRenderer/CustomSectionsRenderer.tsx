import { FileText, Link2 } from 'lucide-react';
import { hasCustomSectionContent, type CustomSection } from '../../lib/customSections';
import { parseFlexibleTable, parseLinkList } from '../../lib/structuredTable';
import FlexibleTable from '../FlexibleTable/FlexibleTable';

// Renders admin-defined custom sections (see lib/customSections.ts) on both
// ProgramDetail.tsx and DepartmentDetail.tsx. No .reveal/scroll-reveal
// classes anywhere here — gated behind Firestore-loaded program data, same
// reason every other conditionally-rendered section on those two pages
// avoids it (see the gotcha documented in CLAUDE.md).
export default function CustomSectionsRenderer({ sections, navOffset }: { sections: CustomSection[]; navOffset: string }) {
  const visible = sections.filter(hasCustomSectionContent);
  if (visible.length === 0) return null;

  return (
    <>
      {visible.map((section) => (
        <section key={section.id} id={section.id} className="section bg-white" style={{ scrollMarginTop: navOffset }}>
          <div className="container">
            <div style={{ marginBottom: 'var(--space-8)' }}>
              <span className="section-label">Details</span>
              <h2 className="section-title" style={{ fontSize: '1.75rem' }}>{section.label}</h2>
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

function CustomSectionBody({ section }: { section: CustomSection }) {
  if (section.contentType === 'text') {
    return (
      <p style={{ color: 'var(--color-text)', lineHeight: 1.8, whiteSpace: 'pre-line' }}>
        {section.textContent}
      </p>
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
