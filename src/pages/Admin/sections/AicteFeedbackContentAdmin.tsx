import { useState, useEffect } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { setDoc } from '../../../lib/auditLog';
import { db } from '../../../lib/firebase';
import { Plus, Trash2, Save, RotateCcw, Megaphone } from 'lucide-react';

export interface AicteFeedbackLink {
  label: string;
  href: string;
}

export interface AicteFeedbackContentDoc {
  notice: string;
  links: AicteFeedbackLink[];
}

// Mirrors the hardcoded notice/feedbackLinks AicteFeedback.tsx shipped with
// before this admin editor existed, so the public page renders identically
// until an admin saves a change.
export const DEFAULT_AICTE_FEEDBACK_CONTENT: AicteFeedbackContentDoc = {
  notice: 'This is to inform all the faculty, staff and students that the feedback facility of students and faculty is available in the AICTE Web-Portal. You may use the below links to use this facility.',
  links: [
    { label: 'AICTE Feedback Portal', href: 'https://www.aicte-india.org/feedback/' },
    { label: 'For Students', href: 'https://www.aicte-india.org/feedback/students.php' },
    { label: 'For Staff', href: 'https://www.aicte-india.org/feedback/faculty.php' },
  ],
};

export const AICTE_FEEDBACK_CONTENT_COLLECTION = 'settings';
export const AICTE_FEEDBACK_CONTENT_DOC_ID = 'aicteFeedbackContent';

export default function AicteFeedbackContentAdmin() {
  const [data, setData] = useState<AicteFeedbackContentDoc>(DEFAULT_AICTE_FEEDBACK_CONTENT);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    async function loadData() {
      try {
        const snap = await getDoc(doc(db, AICTE_FEEDBACK_CONTENT_COLLECTION, AICTE_FEEDBACK_CONTENT_DOC_ID));
        if (snap.exists()) {
          const remote = snap.data() as Partial<AicteFeedbackContentDoc>;
          setData({
            notice: remote.notice || DEFAULT_AICTE_FEEDBACK_CONTENT.notice,
            links: remote.links?.length ? remote.links : DEFAULT_AICTE_FEEDBACK_CONTENT.links,
          });
        }
      } catch (err) {
        console.error('Failed to load AICTE Feedback content:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const updateLink = (idx: number, patch: Partial<AicteFeedbackLink>) => {
    const links = [...data.links];
    links[idx] = { ...links[idx], ...patch };
    setData({ ...data, links });
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await setDoc(doc(db, AICTE_FEEDBACK_CONTENT_COLLECTION, AICTE_FEEDBACK_CONTENT_DOC_ID), data);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch (err) {
      console.error('Failed to save AICTE Feedback content:', err);
      alert('Failed to save changes. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    if (confirm('Reset notice and links to original defaults?')) setData(DEFAULT_AICTE_FEEDBACK_CONTENT);
  };

  if (loading) {
    return <p className="admin-loading">Loading AICTE Feedback Editor...</p>;
  }

  return (
    <div className="admin-section">
      <div className="admin-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '1.25rem', borderBottom: '1px solid #e5e7eb', paddingBottom: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Megaphone size={18} color="#c8a03c" />
            <h2 className="admin-card__title" style={{ margin: 0, padding: 0, border: 'none' }}>AICTE Feedback Facility</h2>
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

        <div className="admin-field" style={{ marginBottom: '1rem' }}>
          <label>Notice</label>
          <textarea value={data.notice} onChange={(e) => setData({ ...data, notice: e.target.value })} className="admin-input" rows={3} style={{ width: '100%', fontFamily: 'inherit' }} />
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
          <label style={{ fontWeight: 600 }}>Links</label>
          <button type="button" onClick={() => setData({ ...data, links: [...data.links, { label: '', href: '' }] })} className="admin-btn admin-btn--sm admin-btn--secondary"><Plus size={14} /> Add Link</button>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {data.links.map((link, idx) => (
            <div key={idx} style={{ display: 'flex', gap: '0.4rem', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '0.5rem' }}>
              <input type="text" placeholder="Label" value={link.label} onChange={(e) => updateLink(idx, { label: e.target.value })} className="admin-input" style={{ flex: 1 }} />
              <input type="text" placeholder="https://…" value={link.href} onChange={(e) => updateLink(idx, { href: e.target.value })} className="admin-input" style={{ flex: 2 }} />
              <button type="button" onClick={() => setData({ ...data, links: data.links.filter((_, i) => i !== idx) })} className="admin-btn-danger"><Trash2 size={13} /></button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
