import { useState, useEffect } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { setDoc } from '../../../lib/auditLog';
import { db } from '../../../lib/firebase';
import { Save, RotateCcw, FileSignature } from 'lucide-react';

export interface ApplyNowProgramme {
  count: string;
  fullForm: string;
}

export interface ApplyNowContentDoc {
  headline: string;
  headlineAccent: string;
  description: string;
  statLabel: string;
  programmes: ApplyNowProgramme[]; // fixed 4 slots: UG, MBA, PG, Research (icon is structural)
}

// Mirrors the hardcoded copy ApplyNow.tsx shipped with before this admin
// editor existed, so the public page renders identically until an admin
// saves a change.
export const DEFAULT_APPLY_NOW_CONTENT: ApplyNowContentDoc = {
  headline: 'Academic Excellence.',
  headlineAccent: 'Limitless Possibilities.',
  description: "Vishnu Women's University offers quality education, modern infrastructure, experienced faculty, research opportunities, and a vibrant campus environment—empowering women to learn, lead, and excel.",
  statLabel: 'Programmes Offered',
  programmes: [
    { count: '10', fullForm: 'Undergraduate (UG)' },
    { count: '1', fullForm: 'Master of Business Administration (MBA)' },
    { count: '4', fullForm: 'Postgraduate (M.Tech.)' },
    { count: '3', fullForm: 'Doctoral & Research (Ph.D.)' },
  ],
};

export const APPLY_NOW_CONTENT_COLLECTION = 'settings';
export const APPLY_NOW_CONTENT_DOC_ID = 'applyNowContent';

export default function ApplyNowContentAdmin() {
  const [data, setData] = useState<ApplyNowContentDoc>(DEFAULT_APPLY_NOW_CONTENT);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    async function loadData() {
      try {
        const snap = await getDoc(doc(db, APPLY_NOW_CONTENT_COLLECTION, APPLY_NOW_CONTENT_DOC_ID));
        if (snap.exists()) {
          const remote = snap.data() as Partial<ApplyNowContentDoc>;
          setData({ ...DEFAULT_APPLY_NOW_CONTENT, ...remote });
        }
      } catch (err) {
        console.error('Failed to load Apply Now content:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const set = <K extends keyof ApplyNowContentDoc>(k: K, v: ApplyNowContentDoc[K]) => setData((p) => ({ ...p, [k]: v }));

  const updateProgramme = (idx: number, patch: Partial<ApplyNowProgramme>) => {
    const programmes = [...data.programmes];
    programmes[idx] = { ...programmes[idx], ...patch };
    set('programmes', programmes);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await setDoc(doc(db, APPLY_NOW_CONTENT_COLLECTION, APPLY_NOW_CONTENT_DOC_ID), data);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch (err) {
      console.error('Failed to save Apply Now content:', err);
      alert('Failed to save changes. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    if (confirm('Reset all Apply Now copy to original defaults?')) setData(DEFAULT_APPLY_NOW_CONTENT);
  };

  if (loading) {
    return <p className="admin-loading">Loading Apply Now Editor...</p>;
  }

  return (
    <div className="admin-section">
      <div className="admin-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '1.25rem', borderBottom: '1px solid #e5e7eb', paddingBottom: '1rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <FileSignature size={18} color="#c8a03c" />
              <h2 className="admin-card__title" style={{ margin: 0, padding: 0, border: 'none' }}>Apply Now Page — Copy</h2>
            </div>
            <p className="admin-field__hint" style={{ margin: '0.35rem 0 0' }}>
              The phone number badge uses Site Contact Info; the hero photo is edited under Website Photos
              ("apply-now" / hero). The application form's own fields aren't edited here.
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

        <h3 className="admin-card__title" style={{ fontSize: '0.95rem', marginTop: 0 }}>Headline & Description</h3>
        <div className="admin-form-grid">
          <div className="admin-field">
            <label>Headline (first part)</label>
            <input type="text" value={data.headline} onChange={(e) => set('headline', e.target.value)} className="admin-input" />
          </div>
          <div className="admin-field">
            <label>Headline (accent part)</label>
            <input type="text" value={data.headlineAccent} onChange={(e) => set('headlineAccent', e.target.value)} className="admin-input" />
          </div>
          <div className="admin-field" style={{ gridColumn: '1 / -1' }}>
            <label>Description</label>
            <textarea value={data.description} onChange={(e) => set('description', e.target.value)} className="admin-input" rows={2} style={{ width: '100%', fontFamily: 'inherit' }} />
          </div>
          <div className="admin-field">
            <label>Programmes Stat Label</label>
            <input type="text" value={data.statLabel} onChange={(e) => set('statLabel', e.target.value)} className="admin-input" />
          </div>
        </div>

        <h3 className="admin-card__title" style={{ fontSize: '0.95rem', marginTop: '1.25rem' }}>4 Programme Cards (UG / MBA / PG / Research)</h3>
        <p className="admin-field__hint" style={{ margin: '0 0 0.5rem' }}>Fixed set — icons aren't editable, only the count and label.</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '0.6rem' }}>
          {data.programmes.map((p, idx) => (
            <div key={idx} style={{ display: 'flex', gap: '0.4rem', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '0.5rem' }}>
              <input type="text" value={p.count} onChange={(e) => updateProgramme(idx, { count: e.target.value })} className="admin-input" style={{ width: 56 }} placeholder="#" />
              <input type="text" value={p.fullForm} onChange={(e) => updateProgramme(idx, { fullForm: e.target.value })} className="admin-input" style={{ flex: 1 }} placeholder="Programme name" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
