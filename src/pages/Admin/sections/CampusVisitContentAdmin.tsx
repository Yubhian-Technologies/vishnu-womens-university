import { useState, useEffect } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { setDoc } from '../../../lib/auditLog';
import { db } from '../../../lib/firebase';
import { Save, RotateCcw, Bus } from 'lucide-react';

export interface CampusVisitTypeCopy {
  title: string;
  desc: string;
  buttonText: string;
}

export interface CampusVisitContentDoc {
  // Fixed 4 slots, in this order: Group Tour, Individual Visit, Virtual
  // Tour, Open Day -- key/icon are structural (drive form logic), only
  // title/desc/buttonText are editable here.
  visitTypes: CampusVisitTypeCopy[];
}

// Mirrors the hardcoded VISIT_TYPES array CampusVisit.tsx shipped with
// before this admin editor existed, so the public page renders identically
// until an admin saves a change.
export const DEFAULT_CAMPUS_VISIT_CONTENT: CampusVisitContentDoc = {
  visitTypes: [
    { title: 'Group Campus Tour', desc: 'Join a guided walkthrough of the VWU campus — see the labs, smart classrooms, hostels, and student facilities in Bhimavaram.', buttonText: 'Book a Group Tour' },
    { title: 'Individual Visit Day', desc: 'Arrange a one-on-one visit with our admissions team, sit in on a demo class, and meet faculty from your preferred department.', buttonText: 'Schedule a Visit' },
    { title: 'Virtual Campus Tour', desc: 'Unable to travel to Bhimavaram? Take an online tour of the campus and speak with our admissions team via video call.', buttonText: 'Take the Virtual Tour' },
    { title: 'Open Day for Admitted Students', desc: 'Spend a full day at VWU after confirming your admission — meet your future classmates, faculty, and student activity groups.', buttonText: 'Register for Open Day' },
  ],
};

export const CAMPUS_VISIT_CONTENT_COLLECTION = 'settings';
export const CAMPUS_VISIT_CONTENT_DOC_ID = 'campusVisitContent';

export default function CampusVisitContentAdmin() {
  const [data, setData] = useState<CampusVisitContentDoc>(DEFAULT_CAMPUS_VISIT_CONTENT);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    async function loadData() {
      try {
        const snap = await getDoc(doc(db, CAMPUS_VISIT_CONTENT_COLLECTION, CAMPUS_VISIT_CONTENT_DOC_ID));
        if (snap.exists()) {
          const remote = snap.data() as Partial<CampusVisitContentDoc>;
          setData({ visitTypes: remote.visitTypes?.length === DEFAULT_CAMPUS_VISIT_CONTENT.visitTypes.length ? remote.visitTypes : DEFAULT_CAMPUS_VISIT_CONTENT.visitTypes });
        }
      } catch (err) {
        console.error('Failed to load Campus Visit content:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const updateType = (idx: number, patch: Partial<CampusVisitTypeCopy>) => {
    const visitTypes = [...data.visitTypes];
    visitTypes[idx] = { ...visitTypes[idx], ...patch };
    setData({ visitTypes });
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await setDoc(doc(db, CAMPUS_VISIT_CONTENT_COLLECTION, CAMPUS_VISIT_CONTENT_DOC_ID), data);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch (err) {
      console.error('Failed to save Campus Visit content:', err);
      alert('Failed to save changes. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    if (confirm('Reset all Campus Visit copy to original defaults?')) setData(DEFAULT_CAMPUS_VISIT_CONTENT);
  };

  const labels = ['Group Campus Tour', 'Individual Visit Day', 'Virtual Campus Tour', 'Open Day for Admitted Students'];

  if (loading) {
    return <p className="admin-loading">Loading Campus Visit Editor...</p>;
  }

  return (
    <div className="admin-section">
      <div className="admin-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '1.25rem', borderBottom: '1px solid #e5e7eb', paddingBottom: '1rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Bus size={18} color="#c8a03c" />
              <h2 className="admin-card__title" style={{ margin: 0, padding: 0, border: 'none' }}>Campus Visit — 4 Visit Types</h2>
            </div>
            <p className="admin-field__hint" style={{ margin: '0.35rem 0 0' }}>
              Fixed 4 visit types — icons aren't editable, only title, description, and button text for each.
              Submitted requests appear under Campus Visit Requests.
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

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.7rem' }}>
          {data.visitTypes.map((t, idx) => (
            <div key={idx} style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '0.7rem' }}>
              <p className="admin-field__hint" style={{ margin: '0 0 0.35rem', fontWeight: 600 }}>{labels[idx]}</p>
              <input type="text" value={t.title} onChange={(e) => updateType(idx, { title: e.target.value })} className="admin-input" style={{ width: '100%', marginBottom: '0.35rem' }} placeholder="Title" />
              <textarea value={t.desc} onChange={(e) => updateType(idx, { desc: e.target.value })} className="admin-input" rows={2} style={{ width: '100%', fontFamily: 'inherit', marginBottom: '0.35rem', resize: 'vertical' }} placeholder="Description" />
              <input type="text" value={t.buttonText} onChange={(e) => updateType(idx, { buttonText: e.target.value })} className="admin-input" style={{ width: '100%' }} placeholder="Button text" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
