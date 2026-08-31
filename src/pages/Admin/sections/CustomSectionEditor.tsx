import { useState } from 'react';
import FileUploader from '../../../components/FileUploader/FileUploader';
import type { UploadResult } from '../../../lib/storage';
import { mergeFlexibleTable, mergeLinkList } from '../../../lib/structuredTable';
import { parseGenericTableWorkbook, parseGenericLinksWorkbook } from '../../../lib/genericSectionImport';
import { generateSectionId, type CustomSection, type CustomSectionContentType } from '../../../lib/customSections';

const CONTENT_TYPE_LABELS: Record<CustomSectionContentType, string> = {
  text: 'Plain text',
  table: 'Table',
  links: 'List of links',
  files: 'Uploaded files',
};

interface Props {
  // The section list being edited at this level (top-level sections, or one
  // section's subSections when recursing).
  sections: CustomSection[];
  onChange: (next: CustomSection[]) => void;
  // Always the full top-level customSections tree, regardless of recursion
  // depth — generateSectionId needs the whole tree to dedupe a new id
  // against every id already in use, not just this level's siblings.
  rootSections: CustomSection[];
  // Path (of section indices) from the root down to this level's parent —
  // [] at the top level, [si] when rendering section si's subSections. Used
  // to address a specific section's file for the path-aware upload/remove
  // handlers in ProgramsAdmin.tsx (see replaceAtPath in lib/customSections.ts).
  parentPath: number[];
  onFileUploaded: (sectionPath: number[], fileIndex: number, r: UploadResult) => void;
  onFileRemoved: (sectionPath: number[], fileIndex: number) => void;
  // 0 = top-level list (shows "+ Add Section" and, per item, "+ Add
  // Sub-section"); 1 = a subSections list (no further nesting offered).
  depth?: number;
}

export default function CustomSectionEditor({
  sections, onChange, rootSections, parentPath, onFileUploaded, onFileRemoved, depth = 0,
}: Props) {
  const [importingKey, setImportingKey] = useState<string | null>(null);

  const updateSection = (si: number, patch: Partial<CustomSection>) => {
    onChange(sections.map((s, i) => (i === si ? { ...s, ...patch } : s)));
  };
  const moveSection = (si: number, dir: -1 | 1) => {
    const next = [...sections];
    const target = si + dir;
    if (target < 0 || target >= next.length) return;
    [next[si], next[target]] = [next[target], next[si]];
    onChange(next);
  };
  const removeSection = (si: number) => {
    if (!confirm('Remove this section? This cannot be undone until you save.')) return;
    onChange(sections.filter((_, i) => i !== si));
  };
  const addSection = () => {
    const label = `Section ${sections.length + 1}`;
    onChange([...sections, { id: generateSectionId(label, rootSections), label, contentType: 'text', textContent: '' }]);
  };
  const addSubSection = (si: number) => {
    const subs = sections[si].subSections || [];
    const label = `Sub-section ${subs.length + 1}`;
    updateSection(si, { subSections: [...subs, { id: generateSectionId(label, rootSections), label, contentType: 'text', textContent: '' }] });
  };

  const addFileRow = (si: number) => {
    const files = sections[si].files || [];
    updateSection(si, { files: [...files, { label: '', fileUrl: '', storagePath: '' }] });
  };
  const updateFileLabel = (si: number, fi: number, label: string) => {
    const files = (sections[si].files || []).map((f, i) => (i === fi ? { ...f, label } : f));
    updateSection(si, { files });
  };

  const handleTableImport = async (si: number, file: File) => {
    const key = `table-${si}`;
    setImportingKey(key);
    try {
      const { text, rowCount, sheetsUsed } = await parseGenericTableWorkbook(file);
      if (rowCount === 0) {
        alert('Couldn\'t find any rows in that file — it needs a header row plus at least one data row.');
        return;
      }
      updateSection(si, { tableText: mergeFlexibleTable(sections[si].tableText || '', text) });
      alert(`Added ${rowCount} row(s) across ${sheetsUsed.length} sheet(s) to the table below.`);
    } catch (e) {
      alert(`Couldn't read that file: ${(e as Error).message}`);
    } finally {
      setImportingKey(null);
    }
  };

  const handleLinksImport = async (si: number, file: File) => {
    const key = `links-${si}`;
    setImportingKey(key);
    try {
      const { text, linkCount, sheetsUsed } = await parseGenericLinksWorkbook(file);
      if (linkCount === 0) {
        alert('Couldn\'t find any links in that file — column A should be the label, column B the URL.');
        return;
      }
      updateSection(si, { linksText: mergeLinkList(sections[si].linksText || '', text) });
      alert(`Added ${linkCount} link(s) across ${sheetsUsed.length} sheet(s) to the list below.`);
    } catch (e) {
      alert(`Couldn't read that file: ${(e as Error).message}`);
    } finally {
      setImportingKey(null);
    }
  };

  return (
    <div>
      {sections.map((s, si) => {
        const path = [...parentPath, si];
        const importing = importingKey === `table-${si}` || importingKey === `links-${si}`;
        return (
          <div key={s.id} style={{ border: '1.5px solid var(--color-light-gray)', borderRadius: 8, padding: '0.75rem', marginBottom: '0.75rem' }}>
            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginBottom: '0.5rem', flexWrap: 'wrap' }}>
              <input
                value={s.label}
                onChange={(e) => updateSection(si, { label: e.target.value })}
                placeholder="Section name"
                style={{ flex: 2, minWidth: 160, fontWeight: 700 }}
              />
              <select
                value={s.contentType}
                onChange={(e) => updateSection(si, { contentType: e.target.value as CustomSectionContentType })}
                style={{ flex: 1, minWidth: 140 }}
              >
                {(Object.keys(CONTENT_TYPE_LABELS) as CustomSectionContentType[]).map((ct) => (
                  <option key={ct} value={ct}>{CONTENT_TYPE_LABELS[ct]}</option>
                ))}
              </select>
              <button type="button" className="admin-btn admin-btn--sm" onClick={() => moveSection(si, -1)} disabled={si === 0} title="Move up">↑</button>
              <button type="button" className="admin-btn admin-btn--sm" onClick={() => moveSection(si, 1)} disabled={si === sections.length - 1} title="Move down">↓</button>
              <button type="button" className="admin-btn admin-btn--sm admin-btn--danger" onClick={() => removeSection(si)}>Remove</button>
            </div>

            {s.contentType === 'text' && (
              <textarea
                rows={4}
                value={s.textContent || ''}
                onChange={(e) => updateSection(si, { textContent: e.target.value })}
                placeholder="Section content…"
              />
            )}

            {s.contentType === 'table' && (
              <>
                <textarea
                  rows={5}
                  value={s.tableText || ''}
                  onChange={(e) => updateSection(si, { tableText: e.target.value })}
                  placeholder={'Header 1 | Header 2\nValue 1 | Value 2'}
                />
                <label className="admin-btn admin-btn--sm" style={{ display: 'inline-block', marginTop: '0.5rem', cursor: importing ? 'default' : 'pointer', opacity: importing ? 0.6 : 1 }}>
                  {importingKey === `table-${si}` ? 'Reading file…' : 'Import from Excel/CSV'}
                  <input
                    type="file"
                    accept=".xlsx,.xls,.csv"
                    hidden
                    disabled={importing}
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleTableImport(si, file);
                      e.target.value = '';
                    }}
                  />
                </label>
                <p className="admin-field__hint">Importing adds to whatever's already here rather than replacing it.</p>
              </>
            )}

            {s.contentType === 'links' && (
              <>
                <textarea
                  rows={5}
                  value={s.linksText || ''}
                  onChange={(e) => updateSection(si, { linksText: e.target.value })}
                  placeholder={'Label one | https://example.com/one\nLabel two | https://example.com/two'}
                />
                <label className="admin-btn admin-btn--sm" style={{ display: 'inline-block', marginTop: '0.5rem', cursor: importing ? 'default' : 'pointer', opacity: importing ? 0.6 : 1 }}>
                  {importingKey === `links-${si}` ? 'Reading file…' : 'Import from Excel/CSV'}
                  <input
                    type="file"
                    accept=".xlsx,.xls,.csv"
                    hidden
                    disabled={importing}
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleLinksImport(si, file);
                      e.target.value = '';
                    }}
                  />
                </label>
                <p className="admin-field__hint">
                  Column A = label, column B = URL. Importing adds to whatever's already here rather than replacing it.
                </p>
              </>
            )}

            {s.contentType === 'files' && (
              <div>
                {(s.files || []).map((f, fi) => (
                  <div key={fi} style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginBottom: '0.5rem', flexWrap: 'wrap' }}>
                    <input
                      value={f.label}
                      onChange={(e) => updateFileLabel(si, fi, e.target.value)}
                      placeholder="File label"
                      style={{ flex: 1, minWidth: 140 }}
                    />
                    <FileUploader
                      compact
                      folder="vwu/programs/custom-sections"
                      currentUrl={f.fileUrl}
                      onUploaded={(r) => onFileUploaded(path, fi, r)}
                      label="Upload File"
                    />
                    <button type="button" className="admin-btn admin-btn--sm admin-btn--danger" onClick={() => onFileRemoved(path, fi)}>✕</button>
                  </div>
                ))}
                <button type="button" className="admin-btn admin-btn--sm" onClick={() => addFileRow(si)}>+ Add File</button>
                <p className="admin-field__hint">No bulk import for files — add and upload one at a time.</p>
              </div>
            )}

            {depth === 0 && (
              <div style={{ marginTop: '0.75rem', paddingTop: '0.75rem', borderTop: '1px dashed var(--color-light-gray)' }}>
                {(s.subSections?.length ?? 0) > 0 && (
                  <div style={{ marginBottom: '0.5rem', paddingLeft: '1rem', borderLeft: '2px solid var(--color-light-gray)' }}>
                    <CustomSectionEditor
                      sections={s.subSections || []}
                      onChange={(next) => updateSection(si, { subSections: next })}
                      rootSections={rootSections}
                      parentPath={path}
                      onFileUploaded={onFileUploaded}
                      onFileRemoved={onFileRemoved}
                      depth={1}
                    />
                  </div>
                )}
                <button type="button" className="admin-btn admin-btn--sm" onClick={() => addSubSection(si)}>+ Add Sub-section</button>
              </div>
            )}
          </div>
        );
      })}
      {depth === 0 && (
        <button type="button" className="admin-btn admin-btn--primary" onClick={addSection}>+ Add Section</button>
      )}
      {depth === 0 && sections.length === 0 && (
        <p className="admin-field__hint">No custom sections yet — click "Add Section" to create one.</p>
      )}
    </div>
  );
}
