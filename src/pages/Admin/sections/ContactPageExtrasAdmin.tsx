import { useState, useEffect } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { setDoc } from '../../../lib/auditLog';
import { db } from '../../../lib/firebase';
import { Plus, Trash2, Save, RotateCcw, PhoneCall, MapPinned } from 'lucide-react';

export interface HelplineEntry {
  label: string;
  num: string;
  tel: string;
}

export interface ContactPageExtrasDoc {
  helplineTitle: string;
  helplineSubtitle: string;
  helplines: HelplineEntry[];
  trainInfo: string;
  airInfo: string;
  roadInfo: string;
}

// Mirrors what was hardcoded directly in Contact.tsx before this admin
// editor existed — the public page falls back to this until an admin saves
// anything, so it renders identically. **double asterisks** render as bold
// (see splitBold in lib/boldText.ts); a literal line break starts a new
// line, matching the original <br /> in the Air route info.
export const DEFAULT_CONTACT_EXTRAS: ContactPageExtrasDoc = {
  helplineTitle: "24x7 Women's Safety & Helplines",
  helplineSubtitle: 'Round-the-clock emergency support for student security, health, and campus safety.',
  helplines: [
    { label: 'University Toll-Free', num: '1800 599 0599', tel: '18005990599' },
    { label: 'Campus Security', num: '+91 8816 250864', tel: '+918816250864' },
    { label: 'Health Centre', num: '+91 8816 250869', tel: '+918816250869' },
    { label: 'Anti-Ragging Toll-Free', num: '1800-180-5522', tel: '18001805522' },
  ],
  trainInfo: '**Bhimavaram Town (BVRM)** & **Junction (BVRT)** stations are **3.8 km and 4.2 km** away. Autos and cabs operate continuously to campus.',
  airInfo: '**Vijayawada International Airport (VGA):** ~92 km (2 hrs drive).\n**Rajahmundry Domestic Airport (RJA):** ~78 km (2 hrs drive).',
  roadInfo: 'Located on SH-63 / NH-216A. Direct APSRTC buses connect from Vijayawada, Guntur, Rajahmundry, Eluru, and Tanuku.',
};

export const CONTACT_EXTRAS_COLLECTION = 'settings';
export const CONTACT_EXTRAS_DOC_ID = 'contactPageExtras';

export default function ContactPageExtrasAdmin() {
  const [data, setData] = useState<ContactPageExtrasDoc>(DEFAULT_CONTACT_EXTRAS);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    async function loadData() {
      try {
        const snap = await getDoc(doc(db, CONTACT_EXTRAS_COLLECTION, CONTACT_EXTRAS_DOC_ID));
        if (snap.exists()) {
          const remote = snap.data() as Partial<ContactPageExtrasDoc>;
          setData({
            ...DEFAULT_CONTACT_EXTRAS,
            ...remote,
            helplines: remote.helplines?.length ? remote.helplines : DEFAULT_CONTACT_EXTRAS.helplines,
          });
        }
      } catch (err) {
        console.error('Failed to load Contact Page Extras data:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      await setDoc(doc(db, CONTACT_EXTRAS_COLLECTION, CONTACT_EXTRAS_DOC_ID), data);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch (err) {
      console.error('Failed to save Contact Page Extras data:', err);
      alert('Failed to save changes. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    if (confirm('Reset all content to original defaults?')) setData(DEFAULT_CONTACT_EXTRAS);
  };

  const updateHelpline = (idx: number, patch: Partial<HelplineEntry>) => {
    const helplines = [...data.helplines];
    helplines[idx] = { ...helplines[idx], ...patch };
    setData({ ...data, helplines });
  };

  if (loading) {
    return <p className="admin-loading">Loading Contact Page Extras Editor...</p>;
  }

  return (
    <div className="admin-section">
      <div className="admin-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '1.25rem', borderBottom: '1px solid #e5e7eb', paddingBottom: '1rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <PhoneCall size={18} color="#c8a03c" />
              <h2 className="admin-card__title" style={{ margin: 0, padding: 0, border: 'none' }}>Contact Page — Helplines & Travel Guide</h2>
            </div>
            <p className="admin-field__hint" style={{ margin: '0.35rem 0 0' }}>
              The "24x7 Safety & Helplines" strip and the "How to Reach VWU Campus" Train/Air/Road tabs. Everything
              else on the Contact page (info cards, department directory, social links, phone/email) is already
              editable elsewhere in admin.
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

        <h3 style={{ fontSize: '0.95rem', marginBottom: '0.5rem' }}>Safety Helplines</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.85rem', marginBottom: '1rem' }}>
          <div className="admin-field" style={{ margin: 0 }}>
            <label>Strip title</label>
            <input type="text" className="admin-input" value={data.helplineTitle} onChange={(e) => setData({ ...data, helplineTitle: e.target.value })} />
          </div>
          <div className="admin-field" style={{ margin: 0 }}>
            <label>Strip subtitle</label>
            <input type="text" className="admin-input" value={data.helplineSubtitle} onChange={(e) => setData({ ...data, helplineSubtitle: e.target.value })} />
          </div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '0.5rem' }}>
          <button type="button" onClick={() => setData({ ...data, helplines: [...data.helplines, { label: '', num: '', tel: '' }] })} className="admin-btn admin-btn--sm admin-btn--secondary">
            <Plus size={14} /> Add Helpline
          </button>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1.5rem', paddingBottom: '1.5rem', borderBottom: '1px solid #e2e8f0' }}>
          {data.helplines.map((h, idx) => (
            <div key={idx} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr auto', gap: '0.4rem' }}>
              <input type="text" placeholder="Label (e.g. Campus Security)" value={h.label} onChange={(e) => updateHelpline(idx, { label: e.target.value })} className="admin-input" />
              <input type="text" placeholder="Displayed number" value={h.num} onChange={(e) => updateHelpline(idx, { num: e.target.value })} className="admin-input" />
              <input type="text" placeholder="tel: link (digits/+ only)" value={h.tel} onChange={(e) => updateHelpline(idx, { tel: e.target.value })} className="admin-input" />
              <button type="button" onClick={() => setData({ ...data, helplines: data.helplines.filter((_, i) => i !== idx) })} className="admin-btn-danger"><Trash2 size={14} /></button>
            </div>
          ))}
          {data.helplines.length === 0 && <p className="admin-field__hint">No helplines yet.</p>}
        </div>

        <h3 style={{ fontSize: '0.95rem', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}><MapPinned size={16} /> How to Reach VWU Campus</h3>
        <p className="admin-field__hint" style={{ marginTop: 0, marginBottom: '0.75rem' }}>
          Wrap any phrase in **double asterisks** for bold, e.g. "**3.8 km** away". Start a new line for a line break (used in the Air tab).
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
          <div className="admin-field" style={{ margin: 0 }}>
            <label>By Train</label>
            <textarea rows={2} className="admin-textarea" value={data.trainInfo} onChange={(e) => setData({ ...data, trainInfo: e.target.value })} />
          </div>
          <div className="admin-field" style={{ margin: 0 }}>
            <label>By Air</label>
            <textarea rows={2} className="admin-textarea" value={data.airInfo} onChange={(e) => setData({ ...data, airInfo: e.target.value })} />
          </div>
          <div className="admin-field" style={{ margin: 0 }}>
            <label>By Road</label>
            <textarea rows={2} className="admin-textarea" value={data.roadInfo} onChange={(e) => setData({ ...data, roadInfo: e.target.value })} />
          </div>
        </div>
      </div>
    </div>
  );
}
