import { useState, useEffect } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { setDoc } from '../../../lib/auditLog';
import { db } from '../../../lib/firebase';
import { Save, RotateCcw, FileText } from 'lucide-react';

export interface PoliciesIntroDoc {
  paragraphs: string[];
}

// Mirrors the hardcoded intro paragraphs PoliciesProcedures.tsx shipped
// with before this admin editor existed, so the public page renders
// identically until an admin saves a change.
export const DEFAULT_POLICIES_INTRO: PoliciesIntroDoc = {
  paragraphs: [
    "Vishnu Women's University has established a set of well-defined policies and standard operating procedures to ensure effective governance, academic excellence, transparency, and continuous institutional development.",
    'These policies provide a structured framework for teaching–learning, research, administration, student support, and campus sustainability, aligning with the guidelines of statutory bodies such as AICTE and UGC.',
  ],
};

export const POLICIES_INTRO_COLLECTION = 'settings';
export const POLICIES_INTRO_DOC_ID = 'policiesIntro';

export default function PoliciesIntroAdmin() {
  const [data, setData] = useState<PoliciesIntroDoc>(DEFAULT_POLICIES_INTRO);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    async function loadData() {
      try {
        const snap = await getDoc(doc(db, POLICIES_INTRO_COLLECTION, POLICIES_INTRO_DOC_ID));
        if (snap.exists()) {
          const remote = snap.data() as Partial<PoliciesIntroDoc>;
          setData({ paragraphs: remote.paragraphs?.length ? remote.paragraphs : DEFAULT_POLICIES_INTRO.paragraphs });
        }
      } catch (err) {
        console.error('Failed to load Policies intro:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      await setDoc(doc(db, POLICIES_INTRO_COLLECTION, POLICIES_INTRO_DOC_ID), data);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch (err) {
      console.error('Failed to save Policies intro:', err);
      alert('Failed to save changes. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    if (confirm('Reset the intro paragraphs to original defaults?')) setData(DEFAULT_POLICIES_INTRO);
  };

  if (loading) {
    return <p className="admin-loading">Loading Policies Intro Editor...</p>;
  }

  return (
    <div className="admin-section">
      <div className="admin-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '1.25rem', borderBottom: '1px solid #e5e7eb', paddingBottom: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <FileText size={18} color="#c8a03c" />
            <h2 className="admin-card__title" style={{ margin: 0, padding: 0, border: 'none' }}>Policies & Procedures — Intro</h2>
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

        <p className="admin-field__hint" style={{ margin: '0 0 0.5rem' }}>
          The policy list below this intro is edited separately under Institutional Policies.
        </p>
        <textarea
          value={data.paragraphs.join('\n')}
          onChange={(e) => setData({ paragraphs: e.target.value.split('\n') })}
          className="admin-input"
          rows={5}
          style={{ width: '100%', fontFamily: 'inherit', resize: 'vertical' }}
        />
      </div>
    </div>
  );
}
