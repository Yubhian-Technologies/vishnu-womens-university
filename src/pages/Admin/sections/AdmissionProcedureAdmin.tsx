import { useState, useEffect } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { setDoc } from '../../../lib/auditLog';
import { db } from '../../../lib/firebase';
import { Plus, Trash2, Save, RotateCcw, Route, ListChecks } from 'lucide-react';
import { admissionTabs as defaultTabs, CATEGORY_B_FOOTNOTE as defaultFootnote, type AdmissionTab, type AdmissionCategory } from '../../Admissions/admissionProcedure.data';

export interface AdmissionProcedureDoc {
  examsCodesLine: string;
  collegeCodesLine: string;
  categoryBFootnote: string;
  tabs: AdmissionTab[];
}

// Mirrors what was hardcoded in admissionProcedure.data.ts before this admin
// editor existed — the public page falls back to this until an admin saves
// anything, so it renders identically. The 4 tabs themselves (B.Tech
// Regular/LE, M.Tech, MBA) are a fixed structural set matching the page's 4
// programme buttons; everything inside each one (heading, intro, exam
// names/years, descriptions, eligibility, steps, codes) is fully editable,
// and categories within a tab can be added/removed.
export const DEFAULT_ADMISSION_PROCEDURE: AdmissionProcedureDoc = {
  examsCodesLine: 'EAPCET | ECET | PGCET | ICET',
  collegeCodesLine: 'CODES: VISW & VISWPU',
  categoryBFootnote: defaultFootnote,
  tabs: defaultTabs,
};

export const ADMISSION_PROCEDURE_COLLECTION = 'settings';
export const ADMISSION_PROCEDURE_DOC_ID = 'admissionProcedure';

const emptyCategory = (): AdmissionCategory => ({
  key: 'B',
  title: '',
  examName: '',
  description: '',
  steps: [],
});

function CategoryEditor({ cat, onChange, onRemove }: { cat: AdmissionCategory; onChange: (c: AdmissionCategory) => void; onRemove: () => void }) {
  return (
    <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '0.85rem', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '80px 1fr auto', gap: '0.5rem', alignItems: 'center' }}>
        <input type="text" placeholder="Key (A/B)" value={cat.key} onChange={(e) => onChange({ ...cat, key: e.target.value })} className="admin-input" />
        <input type="text" placeholder="Title (e.g. Category A — AP EAPCET 2027)" value={cat.title} onChange={(e) => onChange({ ...cat, title: e.target.value })} className="admin-input" style={{ fontWeight: 700 }} />
        <button type="button" onClick={onRemove} className="admin-btn-danger"><Trash2 size={14} /></button>
      </div>
      <input type="text" placeholder="Exam name (e.g. AP EAPCET 2027)" value={cat.examName} onChange={(e) => onChange({ ...cat, examName: e.target.value })} className="admin-input" />
      <textarea rows={2} placeholder="Description" value={cat.description} onChange={(e) => onChange({ ...cat, description: e.target.value })} className="admin-textarea" />
      <input type="text" placeholder="Eligibility (optional)" value={cat.eligibility || ''} onChange={(e) => onChange({ ...cat, eligibility: e.target.value })} className="admin-input" />
      <input type="text" placeholder="Eligibility 'Full details' link URL (optional)" value={cat.eligibilityMoreUrl || ''} onChange={(e) => onChange({ ...cat, eligibilityMoreUrl: e.target.value })} className="admin-input" />
      <div className="admin-field" style={{ margin: 0 }}>
        <label style={{ fontSize: '0.8rem' }}>Admission steps (one per line, in order)</label>
        <textarea
          rows={3}
          value={cat.steps.join('\n')}
          onChange={(e) => onChange({ ...cat, steps: e.target.value.split('\n') })}
          className="admin-textarea"
          placeholder={'AP EAPCET 2027\nCounselling\nWeb Options\nSeat Allotment\nAdmission'}
        />
      </div>
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
          <label style={{ fontSize: '0.8rem' }}>College codes for counselling (optional)</label>
          <button type="button" onClick={() => onChange({ ...cat, codes: [...(cat.codes || []), { code: '', label: '' }] })} className="admin-btn admin-btn--sm admin-btn--secondary">
            <Plus size={12} /> Add Code
          </button>
        </div>
        {(cat.codes || []).map((c, ci) => (
          <div key={ci} style={{ display: 'grid', gridTemplateColumns: '120px 1fr auto', gap: '0.4rem', marginBottom: '0.35rem' }}>
            <input type="text" placeholder="Code" value={c.code} onChange={(e) => {
              const codes = [...(cat.codes || [])]; codes[ci] = { ...codes[ci], code: e.target.value }; onChange({ ...cat, codes });
            }} className="admin-input" />
            <input type="text" placeholder="Label" value={c.label} onChange={(e) => {
              const codes = [...(cat.codes || [])]; codes[ci] = { ...codes[ci], label: e.target.value }; onChange({ ...cat, codes });
            }} className="admin-input" />
            <button type="button" onClick={() => onChange({ ...cat, codes: (cat.codes || []).filter((_, i) => i !== ci) })} className="admin-btn-danger"><Trash2 size={13} /></button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function AdmissionProcedureAdmin() {
  const [data, setData] = useState<AdmissionProcedureDoc>(DEFAULT_ADMISSION_PROCEDURE);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [activeTabKey, setActiveTabKey] = useState(DEFAULT_ADMISSION_PROCEDURE.tabs[0].key);

  useEffect(() => {
    async function loadData() {
      try {
        const snap = await getDoc(doc(db, ADMISSION_PROCEDURE_COLLECTION, ADMISSION_PROCEDURE_DOC_ID));
        if (snap.exists()) {
          const remote = snap.data() as Partial<AdmissionProcedureDoc>;
          setData({
            ...DEFAULT_ADMISSION_PROCEDURE,
            ...remote,
            tabs: remote.tabs?.length ? remote.tabs : DEFAULT_ADMISSION_PROCEDURE.tabs,
          });
        }
      } catch (err) {
        console.error('Failed to load Admission Procedure data:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      await setDoc(doc(db, ADMISSION_PROCEDURE_COLLECTION, ADMISSION_PROCEDURE_DOC_ID), data);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch (err) {
      console.error('Failed to save Admission Procedure data:', err);
      alert('Failed to save changes. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    if (confirm('Reset all content to original defaults?')) {
      setData(DEFAULT_ADMISSION_PROCEDURE);
      setActiveTabKey(DEFAULT_ADMISSION_PROCEDURE.tabs[0].key);
    }
  };

  if (loading) {
    return <p className="admin-loading">Loading Admission Procedure Editor...</p>;
  }

  const activeTabIdx = data.tabs.findIndex((t) => t.key === activeTabKey);
  const activeTab = data.tabs[activeTabIdx] ?? data.tabs[0];

  const updateTab = (patch: Partial<AdmissionTab>) => {
    const tabs = [...data.tabs];
    tabs[activeTabIdx] = { ...tabs[activeTabIdx], ...patch };
    setData({ ...data, tabs });
  };

  return (
    <div className="admin-section">
      <div className="admin-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '1.25rem', borderBottom: '1px solid #e5e7eb', paddingBottom: '1rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Route size={18} color="#c8a03c" />
              <h2 className="admin-card__title" style={{ margin: 0, padding: 0, border: 'none' }}>Admission Procedure</h2>
            </div>
            <p className="admin-field__hint" style={{ margin: '0.35rem 0 0' }}>
              Edit the exam/code strip, each programme tab's heading, intro, and admission categories (exam name,
              description, eligibility, steps, college codes). The "Documents Required" checklist is edited
              separately under Page Content Blocks → "Admission Procedure — Documents Checklist".
            </p>
          </div>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button type="button" onClick={handleReset} className="admin-btn admin-btn--sm admin-btn--ghost"><RotateCcw size={14} /> Reset Defaults</button>
            <button type="button" onClick={handleSave} disabled={saving} className="admin-btn admin-btn--sm admin-btn--primary"><Save size={14} /> {saving ? 'Saving...' : 'Save All Changes'}</button>
          </div>
        </div>

        {savedSuccess && (
          <div style={{ background: '#ecfdf5', border: '1px solid #a7f3d0', padding: '0.75rem 1rem', borderRadius: '8px', color: '#065f46', fontSize: '0.85rem', marginBottom: '1.25rem' }}>
            Saved and published live!
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', marginBottom: '1.5rem', paddingBottom: '1.5rem', borderBottom: '1px solid #e2e8f0' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '0.85rem' }}>
            <div className="admin-field" style={{ margin: 0 }}>
              <label>Exam codes strip</label>
              <input type="text" className="admin-input" value={data.examsCodesLine} onChange={(e) => setData({ ...data, examsCodesLine: e.target.value })} />
            </div>
            <div className="admin-field" style={{ margin: 0 }}>
              <label>College codes strip</label>
              <input type="text" className="admin-input" value={data.collegeCodesLine} onChange={(e) => setData({ ...data, collegeCodesLine: e.target.value })} />
            </div>
          </div>
          <div className="admin-field" style={{ margin: 0 }}>
            <label>Category B footnote (shown under any Category B route)</label>
            <textarea rows={2} className="admin-textarea" value={data.categoryBFootnote} onChange={(e) => setData({ ...data, categoryBFootnote: e.target.value })} />
          </div>
        </div>

        <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.75rem', marginBottom: '1.5rem' }}>
          {data.tabs.map((t) => {
            const isActive = t.key === activeTabKey;
            return (
              <button
                key={t.key}
                type="button"
                onClick={() => setActiveTabKey(t.key)}
                className={`admin-btn admin-btn--sm ${isActive ? 'admin-btn--primary' : 'admin-btn--ghost'}`}
              >
                <ListChecks size={14} /> {t.label || '(untitled)'}
              </button>
            );
          })}
        </div>

        {activeTab && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div className="admin-field" style={{ margin: 0 }}>
              <label>Tab button label</label>
              <input type="text" className="admin-input" value={activeTab.label} onChange={(e) => updateTab({ label: e.target.value })} />
            </div>
            <div className="admin-field" style={{ margin: 0 }}>
              <label>Panel heading</label>
              <input type="text" className="admin-input" value={activeTab.heading} onChange={(e) => updateTab({ heading: e.target.value })} />
            </div>
            <div className="admin-field" style={{ margin: 0 }}>
              <label>Intro paragraph</label>
              <textarea rows={2} className="admin-textarea" value={activeTab.intro} onChange={(e) => updateTab({ intro: e.target.value })} />
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <label className="admin-label" style={{ margin: 0 }}>Admission Categories</label>
              <button
                type="button"
                onClick={() => updateTab({ categories: [...activeTab.categories, emptyCategory()] })}
                className="admin-btn admin-btn--sm admin-btn--secondary"
              >
                <Plus size={14} /> Add Category
              </button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {activeTab.categories.map((cat, ci) => (
                <CategoryEditor
                  key={ci}
                  cat={cat}
                  onChange={(next) => {
                    const categories = [...activeTab.categories];
                    categories[ci] = next;
                    updateTab({ categories });
                  }}
                  onRemove={() => updateTab({ categories: activeTab.categories.filter((_, i) => i !== ci) })}
                />
              ))}
              {activeTab.categories.length === 0 && <p className="admin-field__hint">No categories yet.</p>}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
