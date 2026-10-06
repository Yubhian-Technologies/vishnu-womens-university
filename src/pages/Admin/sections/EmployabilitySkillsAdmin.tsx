import { useState, useEffect } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { setDoc } from '../../../lib/auditLog';
import { db } from '../../../lib/firebase';
import { Plus, Trash2, Save, RotateCcw, ListChecks } from 'lucide-react';
import { employabilitySkillTabs, type SkillTab, type SkillCategory } from '../../Placements/employabilitySkills.data';

export interface EmployabilitySkillsDoc {
  tabs: SkillTab[]; // fixed 2: Essential Employability Skills, Professional Skills
}

// Mirrors employabilitySkills.data.ts -- the public page falls back to
// this until an admin saves a change here, so it renders identically.
export const DEFAULT_EMPLOYABILITY_SKILLS: EmployabilitySkillsDoc = {
  tabs: employabilitySkillTabs,
};

export const EMPLOYABILITY_SKILLS_COLLECTION = 'settings';
export const EMPLOYABILITY_SKILLS_DOC_ID = 'employabilitySkills';

export default function EmployabilitySkillsAdmin() {
  const [data, setData] = useState<EmployabilitySkillsDoc>(DEFAULT_EMPLOYABILITY_SKILLS);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState(0);

  useEffect(() => {
    async function loadData() {
      try {
        const snap = await getDoc(doc(db, EMPLOYABILITY_SKILLS_COLLECTION, EMPLOYABILITY_SKILLS_DOC_ID));
        if (snap.exists()) {
          const remote = snap.data() as Partial<EmployabilitySkillsDoc>;
          setData({ tabs: remote.tabs?.length === 2 ? remote.tabs : DEFAULT_EMPLOYABILITY_SKILLS.tabs });
        }
      } catch (err) {
        console.error('Failed to load Employability Skills content:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const tab = data.tabs[activeTab];

  const updateTab = (patch: Partial<SkillTab>) => {
    const tabs = [...data.tabs];
    tabs[activeTab] = { ...tabs[activeTab], ...patch };
    setData({ tabs });
  };

  const updateCategory = (idx: number, patch: Partial<SkillCategory>) => {
    const categories = [...tab.categories];
    categories[idx] = { ...categories[idx], ...patch };
    updateTab({ categories });
  };

  const addCategory = () => updateTab({ categories: [...tab.categories, { title: 'New Category', items: [] }] });
  const removeCategory = (idx: number) => {
    if (!confirm('Remove this category?')) return;
    updateTab({ categories: tab.categories.filter((_, i) => i !== idx) });
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await setDoc(doc(db, EMPLOYABILITY_SKILLS_COLLECTION, EMPLOYABILITY_SKILLS_DOC_ID), data);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch (err) {
      console.error('Failed to save Employability Skills content:', err);
      alert('Failed to save changes. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    if (confirm('Reset both tabs to original defaults?')) setData(DEFAULT_EMPLOYABILITY_SKILLS);
  };

  if (loading) {
    return <p className="admin-loading">Loading Employability Skills Editor...</p>;
  }

  return (
    <div className="admin-section">
      <div className="admin-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '1.25rem', borderBottom: '1px solid #e5e7eb', paddingBottom: '1rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <ListChecks size={18} color="#c8a03c" />
              <h2 className="admin-card__title" style={{ margin: 0, padding: 0, border: 'none' }}>Employability Skills Page</h2>
            </div>
            <p className="admin-field__hint" style={{ margin: '0.35rem 0 0' }}>
              Drives both tabs on the Employability Skills placement page. Leave "Professional Skills"
              with no categories to keep showing its coming-soon note.
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

        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
          {data.tabs.map((t, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setActiveTab(i)}
              className={`admin-btn admin-btn--sm ${activeTab === i ? 'admin-btn--primary' : 'admin-btn--ghost'}`}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div className="admin-field" style={{ marginBottom: '1rem' }}>
          <label>Tab Label</label>
          <input type="text" value={tab.label} onChange={(e) => updateTab({ label: e.target.value })} className="admin-input" />
        </div>
        <div className="admin-field" style={{ marginBottom: '1rem' }}>
          <label>Intro (optional)</label>
          <textarea value={tab.intro || ''} onChange={(e) => updateTab({ intro: e.target.value })} className="admin-input" rows={2} style={{ width: '100%', fontFamily: 'inherit' }} />
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '0.5rem' }}>
          <button type="button" onClick={addCategory} className="admin-btn admin-btn--sm admin-btn--secondary"><Plus size={14} /> Add Category</button>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
          {tab.categories.map((cat, idx) => (
            <div key={idx} style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '0.7rem' }}>
              <div style={{ display: 'flex', gap: '0.4rem', marginBottom: '0.4rem' }}>
                <input type="text" value={cat.title} onChange={(e) => updateCategory(idx, { title: e.target.value })} className="admin-input" style={{ flex: 1, fontWeight: 600 }} placeholder="Category title" />
                <button type="button" onClick={() => removeCategory(idx)} className="admin-btn-danger"><Trash2 size={14} /></button>
              </div>
              <label className="admin-field__hint" style={{ display: 'block', marginBottom: '0.2rem' }}>Items (one per line)</label>
              <textarea
                value={cat.items.join('\n')}
                onChange={(e) => updateCategory(idx, { items: e.target.value.split('\n') })}
                className="admin-input"
                rows={5}
                style={{ width: '100%', fontFamily: 'inherit', resize: 'vertical' }}
              />
            </div>
          ))}
          {tab.categories.length === 0 && <p className="admin-field__hint">No categories yet — this tab will show its "coming soon" note on the public page.</p>}
        </div>
      </div>
    </div>
  );
}
