import { useState, useEffect } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { setDoc } from '../../../lib/auditLog';
import { db } from '../../../lib/firebase';
import { Save, RotateCcw, Share2 } from 'lucide-react';

export interface SocialHandle {
  label: string;
  href: string;
  handle: string;
}

export interface SocialHandlesDoc {
  // Fixed 5 slots, in this order: Instagram, Facebook, Twitter/X, LinkedIn,
  // YouTube -- the icon for each slot is structural (see SOCIAL_ICONS in
  // Footer.tsx / SocialMedia.tsx), only label/href/handle are editable here.
  platforms: SocialHandle[];
}

// Mirrors the hardcoded SOCIAL_LINKS (Footer.tsx) / socialHandles
// (SocialMedia.tsx) arrays these two places shipped with, each previously
// its own separate hardcoded copy -- now a single shared source so they
// can't drift out of sync.
export const DEFAULT_SOCIAL_HANDLES: SocialHandlesDoc = {
  platforms: [
    { label: 'Instagram', href: 'http://instagram.com/vishnu_svecw/', handle: '@vishnu_svecw' },
    { label: 'Facebook', href: 'https://www.facebook.com/svecwcollege', handle: 'svecwcollege' },
    { label: 'Twitter / X', href: 'https://twitter.com/svecw2', handle: '@svecw2' },
    { label: 'LinkedIn', href: 'https://www.linkedin.com/school/vishnusvecw/', handle: 'Vishnu SVECW' },
    { label: 'YouTube', href: 'https://www.youtube.com/@SVECW-B0', handle: '@SVECW-B0' },
  ],
};

export const SOCIAL_HANDLES_COLLECTION = 'settings';
export const SOCIAL_HANDLES_DOC_ID = 'socialHandles';

export default function SocialHandlesAdmin() {
  const [data, setData] = useState<SocialHandlesDoc>(DEFAULT_SOCIAL_HANDLES);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    async function loadData() {
      try {
        const snap = await getDoc(doc(db, SOCIAL_HANDLES_COLLECTION, SOCIAL_HANDLES_DOC_ID));
        if (snap.exists()) {
          const remote = snap.data() as Partial<SocialHandlesDoc>;
          setData({ platforms: remote.platforms?.length === DEFAULT_SOCIAL_HANDLES.platforms.length ? remote.platforms : DEFAULT_SOCIAL_HANDLES.platforms });
        }
      } catch (err) {
        console.error('Failed to load Social Handles:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const updatePlatform = (idx: number, patch: Partial<SocialHandle>) => {
    const platforms = [...data.platforms];
    platforms[idx] = { ...platforms[idx], ...patch };
    setData({ platforms });
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await setDoc(doc(db, SOCIAL_HANDLES_COLLECTION, SOCIAL_HANDLES_DOC_ID), data);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch (err) {
      console.error('Failed to save Social Handles:', err);
      alert('Failed to save changes. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    if (confirm('Reset all social handles to original defaults?')) setData(DEFAULT_SOCIAL_HANDLES);
  };

  if (loading) {
    return <p className="admin-loading">Loading Social Handles Editor...</p>;
  }

  return (
    <div className="admin-section">
      <div className="admin-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '1.25rem', borderBottom: '1px solid #e5e7eb', paddingBottom: '1rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Share2 size={18} color="#c8a03c" />
              <h2 className="admin-card__title" style={{ margin: 0, padding: 0, border: 'none' }}>Social Media Handles</h2>
            </div>
            <p className="admin-field__hint" style={{ margin: '0.35rem 0 0' }}>
              Drives both the footer's social icon strip (every page) and the Social Media Handles page
              (News &amp; Awards → Social Media Handles). Fixed 5 platforms — icons aren't editable, only the
              label, link, and displayed handle for each.
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

        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Platform</th>
                <th>Label</th>
                <th>Link (href)</th>
                <th>Displayed Handle</th>
              </tr>
            </thead>
            <tbody>
              {data.platforms.map((p, idx) => (
                <tr key={idx}>
                  <td style={{ color: 'var(--color-text-light, #9ca3af)' }}>{DEFAULT_SOCIAL_HANDLES.platforms[idx]?.label}</td>
                  <td><input type="text" value={p.label} onChange={(e) => updatePlatform(idx, { label: e.target.value })} className="admin-input" /></td>
                  <td><input type="text" value={p.href} onChange={(e) => updatePlatform(idx, { href: e.target.value })} className="admin-input" /></td>
                  <td><input type="text" value={p.handle} onChange={(e) => updatePlatform(idx, { handle: e.target.value })} className="admin-input" /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
