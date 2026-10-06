import { useState, useEffect } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { setDoc } from '../../../lib/auditLog';
import { db } from '../../../lib/firebase';
import { Plus, Trash2, Save, RotateCcw, FlaskConical } from 'lucide-react';
import { CONTENT_ICON_NAMES } from '../../../lib/contentIcons';
import { DEFAULT_OTHER_PRACTICES, EXPERIENTIAL_LEARNING_INTRO, type OtherPracticeItem } from '../../Information/otherPractices.data';

export interface OtherPracticesDoc {
  intro: string;
  items: OtherPracticeItem[];
}

// Mirrors EXPERIENTIAL_LEARNING_INTRO / DEFAULT_OTHER_PRACTICES
// (otherPractices.data.ts) -- the content Information.tsx's "Other
// Practices" tab has always shown. The public page falls back to this
// until an admin saves a change here, so it renders identically.
export const DEFAULT_OTHER_PRACTICES_CONTENT: OtherPracticesDoc = {
  intro: EXPERIENTIAL_LEARNING_INTRO,
  items: DEFAULT_OTHER_PRACTICES,
};

export const OTHER_PRACTICES_COLLECTION = 'settings';
export const OTHER_PRACTICES_DOC_ID = 'otherPractices';

const EMPTY_ITEM: OtherPracticeItem = { id: '', title: '', icon: 'Monitor', desc: '', bullets: [], order: 0 };

export default function OtherPracticesAdmin() {
  const [data, setData] = useState<OtherPracticesDoc>(DEFAULT_OTHER_PRACTICES_CONTENT);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    async function loadData() {
      try {
        const snap = await getDoc(doc(db, OTHER_PRACTICES_COLLECTION, OTHER_PRACTICES_DOC_ID));
        if (snap.exists()) {
          const remote = snap.data() as Partial<OtherPracticesDoc>;
          setData({
            intro: remote.intro || DEFAULT_OTHER_PRACTICES_CONTENT.intro,
            items: remote.items?.length ? remote.items : DEFAULT_OTHER_PRACTICES_CONTENT.items,
          });
        }
      } catch (err) {
        console.error('Failed to load Other Practices content:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const updateItem = (idx: number, patch: Partial<OtherPracticeItem>) => {
    const items = [...data.items];
    items[idx] = { ...items[idx], ...patch };
    setData({ ...data, items });
  };

  const addItem = () => {
    setData({ ...data, items: [...data.items, { ...EMPTY_ITEM, id: `practice-${Date.now()}`, order: data.items.length + 1 }] });
  };

  const removeItem = (idx: number) => {
    if (!confirm('Remove this practice?')) return;
    setData({ ...data, items: data.items.filter((_, i) => i !== idx) });
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await setDoc(doc(db, OTHER_PRACTICES_COLLECTION, OTHER_PRACTICES_DOC_ID), data);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch (err) {
      console.error('Failed to save Other Practices content:', err);
      alert('Failed to save changes. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    if (confirm('Reset the intro and all practices to original defaults?')) setData(DEFAULT_OTHER_PRACTICES_CONTENT);
  };

  if (loading) {
    return <p className="admin-loading">Loading Other Practices Editor...</p>;
  }

  return (
    <div className="admin-section">
      <div className="admin-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '1.25rem', borderBottom: '1px solid #e5e7eb', paddingBottom: '1rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <FlaskConical size={18} color="#c8a03c" />
              <h2 className="admin-card__title" style={{ margin: 0, padding: 0, border: 'none' }}>Information Page — Other Practices</h2>
            </div>
            <p className="admin-field__hint" style={{ margin: '0.35rem 0 0' }}>
              Drives the "Other Practices" tab on Information. Each practice can optionally have a sub-bullet
              list (leave the bullets box empty for none).
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

        <div className="admin-field" style={{ marginBottom: '1.25rem' }}>
          <label>Intro Paragraph</label>
          <textarea value={data.intro} onChange={(e) => setData({ ...data, intro: e.target.value })} className="admin-input" rows={3} style={{ width: '100%', fontFamily: 'inherit' }} />
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '0.6rem' }}>
          <button type="button" onClick={addItem} className="admin-btn admin-btn--sm admin-btn--secondary"><Plus size={14} /> Add Practice</button>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
          {data.items.map((item, idx) => (
            <div key={item.id || idx} style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '0.7rem' }}>
              <div style={{ display: 'flex', gap: '0.4rem', marginBottom: '0.4rem' }}>
                <input type="text" value={item.title} onChange={(e) => updateItem(idx, { title: e.target.value })} className="admin-input" style={{ flex: 2, fontWeight: 600 }} placeholder="Title" />
                <select value={item.icon} onChange={(e) => updateItem(idx, { icon: e.target.value })} className="admin-input" style={{ flex: 1 }}>
                  {CONTENT_ICON_NAMES.map((n) => <option key={n} value={n}>{n}</option>)}
                </select>
                <button type="button" onClick={() => removeItem(idx)} className="admin-btn-danger"><Trash2 size={13} /></button>
              </div>
              <textarea value={item.desc} onChange={(e) => updateItem(idx, { desc: e.target.value })} className="admin-input" rows={2} style={{ width: '100%', fontFamily: 'inherit', marginBottom: '0.4rem', resize: 'vertical' }} placeholder="Description" />
              <label className="admin-field__hint" style={{ display: 'block', marginBottom: '0.2rem' }}>Sub-bullets (optional, one per line)</label>
              <textarea
                value={(item.bullets || []).join('\n')}
                onChange={(e) => updateItem(idx, { bullets: e.target.value.split('\n').filter(Boolean) })}
                className="admin-input"
                rows={3}
                style={{ width: '100%', fontFamily: 'inherit', resize: 'vertical' }}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
