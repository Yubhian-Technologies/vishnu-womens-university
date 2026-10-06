import { useState, useEffect } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { setDoc } from '../../../lib/auditLog';
import { db } from '../../../lib/firebase';
import { Save, RotateCcw, ShieldAlert } from 'lucide-react';

export interface AntiRaggingContentDoc {
  salutation: string;
  paragraphs: string[];
  signature: string;
}

// Mirrors the hardcoded "Dear Fresher" letter AntiRagging.tsx shipped with
// before this admin editor existed, so the public page renders identically
// until an admin saves a change.
export const DEFAULT_ANTI_RAGGING_CONTENT: AntiRaggingContentDoc = {
  salutation: 'Dear Fresher,',
  paragraphs: [
    "Warm greetings and welcome to our institution. As a first step you've chosen the right college and the course you aspire to have. Make use of all the facilities and the ambiance you will have here.",
    "Since its inception, our institution has set high standards of education and is committed to taking students to new heights year by year. These efforts have culminated into consistently positioning Vishnu Women's University among the best in the state.",
    "As a fresher, you may have many apprehensions about Ragging but mind you, ours is a ragging-free campus. We always believe that ragging is an uncivilized and inhuman practice. In this regard, we formed an anti-ragging committee to ensure strict vigilance in the campus. A series of measures have been devised and implemented for the years to rule out any incident of ragging to be attempted by senior students at any place inside the Campus. Having a fully residential campus, it enhances our responsibility and also empowers us with greater control over students. For making ragging non-gratis at Vishnu Women's University, all stakeholders viz. management, faculty, students and employees are extending full support and cooperation. Students are enlightened in such a way that they never even allow the thought of ragging.",
    "Our anti-ragging committee members, anti-ragging squad and mentoring cell will always extend their support and cooperation to you at any moment and we ensure that Vishnu Women's University is free from ragging virus. Please feel free to get in touch with us in case you need any help, clarification or any other support in this regard.",
  ],
  signature: 'PRINCIPAL',
};

export const ANTI_RAGGING_CONTENT_COLLECTION = 'settings';
export const ANTI_RAGGING_CONTENT_DOC_ID = 'antiRaggingContent';

export default function AntiRaggingContentAdmin() {
  const [data, setData] = useState<AntiRaggingContentDoc>(DEFAULT_ANTI_RAGGING_CONTENT);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    async function loadData() {
      try {
        const snap = await getDoc(doc(db, ANTI_RAGGING_CONTENT_COLLECTION, ANTI_RAGGING_CONTENT_DOC_ID));
        if (snap.exists()) {
          const remote = snap.data() as Partial<AntiRaggingContentDoc>;
          setData({ ...DEFAULT_ANTI_RAGGING_CONTENT, ...remote });
        }
      } catch (err) {
        console.error('Failed to load Anti-Ragging content:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const set = <K extends keyof AntiRaggingContentDoc>(k: K, v: AntiRaggingContentDoc[K]) => setData((p) => ({ ...p, [k]: v }));

  const handleSave = async () => {
    setSaving(true);
    try {
      await setDoc(doc(db, ANTI_RAGGING_CONTENT_COLLECTION, ANTI_RAGGING_CONTENT_DOC_ID), data);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch (err) {
      console.error('Failed to save Anti-Ragging content:', err);
      alert('Failed to save changes. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    if (confirm('Reset the welcome letter to original defaults?')) setData(DEFAULT_ANTI_RAGGING_CONTENT);
  };

  if (loading) {
    return <p className="admin-loading">Loading Anti-Ragging Editor...</p>;
  }

  return (
    <div className="admin-section">
      <div className="admin-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '1.25rem', borderBottom: '1px solid #e5e7eb', paddingBottom: '1rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <ShieldAlert size={18} color="#c8a03c" />
              <h2 className="admin-card__title" style={{ margin: 0, padding: 0, border: 'none' }}>Anti-Ragging Page — Welcome Letter</h2>
            </div>
            <p className="admin-field__hint" style={{ margin: '0.35rem 0 0' }}>
              The sidebar photo is edited under Website Photos ("anti-ragging" / main).
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

        <div className="admin-form-grid">
          <div className="admin-field">
            <label>Salutation</label>
            <input type="text" value={data.salutation} onChange={(e) => set('salutation', e.target.value)} className="admin-input" />
          </div>
          <div className="admin-field">
            <label>Signature</label>
            <input type="text" value={data.signature} onChange={(e) => set('signature', e.target.value)} className="admin-input" />
          </div>
          <div className="admin-field" style={{ gridColumn: '1 / -1' }}>
            <label>Letter Body (one paragraph per line)</label>
            <textarea value={data.paragraphs.join('\n')} onChange={(e) => set('paragraphs', e.target.value.split('\n'))} className="admin-input" rows={12} style={{ width: '100%', fontFamily: 'inherit', resize: 'vertical' }} />
          </div>
        </div>
      </div>
    </div>
  );
}
