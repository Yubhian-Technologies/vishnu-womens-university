import { useState, useEffect } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { setDoc } from '../../../lib/auditLog';
import { db } from '../../../lib/firebase';
import { Plus, Trash2, Save, RotateCcw, ListChecks } from 'lucide-react';
import { QUALITY_PARAMETER_CATEGORIES } from '../../Governance/qualityParametersDefault';

export interface QualityParameterCategory {
  key: string;
  title: string;
  items: string[];
}

export interface QualityParametersDoc {
  categories: QualityParameterCategory[];
}

// Mirrors QUALITY_PARAMETER_CATEGORIES (the hardcoded A/B/C/D checklist on
// the Quality Parameters governance page) so the public page renders
// identically until an admin saves a change here.
export const DEFAULT_QUALITY_PARAMETERS: QualityParametersDoc = {
  categories: QUALITY_PARAMETER_CATEGORIES,
};

export const QUALITY_PARAMETERS_COLLECTION = 'settings';
export const QUALITY_PARAMETERS_DOC_ID = 'qualityParameters';

export default function QualityParametersAdmin() {
  const [data, setData] = useState<QualityParametersDoc>(DEFAULT_QUALITY_PARAMETERS);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    async function loadData() {
      try {
        const snap = await getDoc(doc(db, QUALITY_PARAMETERS_COLLECTION, QUALITY_PARAMETERS_DOC_ID));
        if (snap.exists()) {
          const remote = snap.data() as Partial<QualityParametersDoc>;
          setData({ categories: remote.categories?.length ? remote.categories : DEFAULT_QUALITY_PARAMETERS.categories });
        }
      } catch (err) {
        console.error('Failed to load Quality Parameters:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      await setDoc(doc(db, QUALITY_PARAMETERS_COLLECTION, QUALITY_PARAMETERS_DOC_ID), data);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch (err) {
      console.error('Failed to save Quality Parameters:', err);
      alert('Failed to save changes. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    if (confirm('Reset all categories to original defaults?')) setData(DEFAULT_QUALITY_PARAMETERS);
  };

  const updateCategory = (idx: number, patch: Partial<QualityParameterCategory>) => {
    const categories = [...data.categories];
    categories[idx] = { ...categories[idx], ...patch };
    setData({ categories });
  };

  const addCategory = () => {
    setData({ categories: [...data.categories, { key: `category-${Date.now()}`, title: 'New Category', items: [] }] });
  };

  const removeCategory = (idx: number) => {
    if (!confirm('Remove this category and all its items?')) return;
    setData({ categories: data.categories.filter((_, i) => i !== idx) });
  };

  if (loading) {
    return <p className="admin-loading">Loading Quality Parameters Editor...</p>;
  }

  return (
    <div className="admin-section">
      <div className="admin-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '1.25rem', borderBottom: '1px solid #e5e7eb', paddingBottom: '1rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <ListChecks size={18} color="#c8a03c" />
              <h2 className="admin-card__title" style={{ margin: 0, padding: 0, border: 'none' }}>Quality Parameters Checklist</h2>
            </div>
            <p className="admin-field__hint" style={{ margin: '0.35rem 0 0' }}>
              Drives the A/B/C/D accordion checklist on Governance → Quality Parameters. The intro paragraph above the
              accordion is edited separately under Governance / Committees / IQAC → the "Quality Parameters" item.
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

        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '0.75rem' }}>
          <button type="button" onClick={addCategory} className="admin-btn admin-btn--sm admin-btn--secondary"><Plus size={14} /> Add Category</button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
          {data.categories.map((cat, idx) => (
            <div key={cat.key} style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '0.9rem' }}>
              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginBottom: '0.6rem' }}>
                <input
                  type="text"
                  value={cat.title}
                  onChange={(e) => updateCategory(idx, { title: e.target.value })}
                  className="admin-input"
                  style={{ flex: 1, fontWeight: 600 }}
                  placeholder="e.g. A. Quality Education"
                />
                <button type="button" onClick={() => removeCategory(idx)} className="admin-btn-danger"><Trash2 size={14} /></button>
              </div>
              <label className="admin-field__hint" style={{ display: 'block', marginBottom: '0.25rem' }}>Checklist items (one per line)</label>
              <textarea
                value={cat.items.join('\n')}
                onChange={(e) => updateCategory(idx, { items: e.target.value.split('\n') })}
                className="admin-input"
                rows={6}
                style={{ width: '100%', fontFamily: 'inherit', resize: 'vertical' }}
              />
            </div>
          ))}
          {data.categories.length === 0 && <p className="admin-field__hint">No categories yet.</p>}
        </div>
      </div>
    </div>
  );
}
