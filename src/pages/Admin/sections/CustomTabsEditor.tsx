import { useState } from 'react';
import type { UploadResult } from '../../../lib/storage';
import { generateTabId, type CustomTab } from '../../../lib/customTabs';
import CustomSectionEditor from './CustomSectionEditor';

interface Props {
  tabs: CustomTab[];
  onChange: (next: CustomTab[]) => void;
  onFileUploaded: (tabIndex: number, sectionPath: number[], fileIndex: number, r: UploadResult) => void;
  onFileRemoved: (tabIndex: number, sectionPath: number[], fileIndex: number) => void;
  onPhotoUploaded: (tabIndex: number, sectionPath: number[], r: UploadResult) => void;
  onPhotoRemoved: (tabIndex: number, sectionPath: number[]) => void;
}

// The NIRF-Reports-style list: add a named tab, reorder/remove it, and
// toggle "Edit Content" to reveal that one tab's own CustomSectionEditor
// tree right below it — the same editor already used for Programs/
// Differentiators custom sections, just scoped to this tab's own sections.
export default function CustomTabsEditor({ tabs, onChange, onFileUploaded, onFileRemoved, onPhotoUploaded, onPhotoRemoved }: Props) {
  const [newTabLabel, setNewTabLabel] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const updateTab = (ti: number, patch: Partial<CustomTab>) => {
    onChange(tabs.map((t, i) => (i === ti ? { ...t, ...patch } : t)));
  };
  const moveTab = (ti: number, dir: -1 | 1) => {
    const next = [...tabs];
    const target = ti + dir;
    if (target < 0 || target >= next.length) return;
    [next[ti], next[target]] = [next[target], next[ti]];
    onChange(next);
  };
  const removeTab = (ti: number) => {
    if (!confirm('Remove this tab and everything inside it? This cannot be undone until you save.')) return;
    onChange(tabs.filter((_, i) => i !== ti));
  };
  const addTab = () => {
    const label = newTabLabel.trim();
    if (!label) return;
    const tab: CustomTab = { id: generateTabId(label, tabs), label, sections: [] };
    onChange([...tabs, tab]);
    setNewTabLabel('');
    setExpandedId(tab.id);
  };

  return (
    <div>
      {tabs.map((tab, ti) => {
        const isExpanded = expandedId === tab.id;
        return (
          <div key={tab.id} style={{ border: '1.5px solid var(--color-light-gray)', borderRadius: 8, padding: '0.75rem', marginBottom: '0.75rem' }}>
            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
              <div className="admin-field" style={{ flex: 1, minWidth: 160, marginBottom: 0 }}>
                <input
                  value={tab.label}
                  onChange={(e) => updateTab(ti, { label: e.target.value })}
                  placeholder="Tab name"
                  style={{ fontWeight: 700 }}
                />
              </div>
              <div className="admin-field" style={{ flex: 1, minWidth: 190, marginBottom: 0 }}>
                <select
                  value={tab.sectionsDisplay === 'pills' ? 'pills' : 'stacked'}
                  onChange={(e) => updateTab(ti, { sectionsDisplay: e.target.value === 'pills' ? 'pills' : 'stacked' })}
                  title="How this tab's sections display on the public page"
                >
                  <option value="stacked">Sections shown stacked</option>
                  <option value="pills">Sections shown as pill switcher</option>
                </select>
              </div>
              <button type="button" className="admin-btn admin-btn--sm" onClick={() => moveTab(ti, -1)} disabled={ti === 0} title="Move up">↑</button>
              <button type="button" className="admin-btn admin-btn--sm" onClick={() => moveTab(ti, 1)} disabled={ti === tabs.length - 1} title="Move down">↓</button>
              <button type="button" className={`admin-btn admin-btn--sm${isExpanded ? ' admin-btn--primary' : ''}`} onClick={() => setExpandedId(isExpanded ? null : tab.id)}>
                {isExpanded ? 'Hide Content' : 'Edit Content'}
              </button>
              <button type="button" className="admin-btn admin-btn--sm admin-btn--danger" onClick={() => removeTab(ti)}>Remove Tab</button>
            </div>

            {isExpanded && (
              <div style={{ marginTop: '0.75rem', paddingTop: '0.75rem', borderTop: '1px dashed var(--color-light-gray)' }}>
                <CustomSectionEditor
                  sections={tab.sections}
                  onChange={(next) => updateTab(ti, { sections: next })}
                  rootSections={tab.sections}
                  parentPath={[]}
                  onFileUploaded={(sectionPath, fileIndex, r) => onFileUploaded(ti, sectionPath, fileIndex, r)}
                  onFileRemoved={(sectionPath, fileIndex) => onFileRemoved(ti, sectionPath, fileIndex)}
                  onPhotoUploaded={(sectionPath, r) => onPhotoUploaded(ti, sectionPath, r)}
                  onPhotoRemoved={(sectionPath) => onPhotoRemoved(ti, sectionPath)}
                />
              </div>
            )}
          </div>
        );
      })}

      <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
        <div className="admin-field" style={{ flex: 1, minWidth: 160, marginBottom: 0 }}>
          <input
            value={newTabLabel}
            onChange={(e) => setNewTabLabel(e.target.value)}
            placeholder="New tab name, e.g. About WISE"
          />
        </div>
        <button type="button" className="admin-btn admin-btn--primary" onClick={addTab}>+ Add Tab</button>
      </div>
      {tabs.length === 0 && (
        <p className="admin-field__hint">No tabs yet — add one above to start building this page's sidebar.</p>
      )}
    </div>
  );
}
