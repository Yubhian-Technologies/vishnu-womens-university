import { useState, useEffect } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { setDoc } from '../../../lib/auditLog';
import { db } from '../../../lib/firebase';
import { Save, RotateCcw, Plane } from 'lucide-react';

export interface GsacFeature { title: string; subtitle: string; }
export interface GsacStatPill { value: string; label: string; }

export interface GsacHeroContentDoc {
  subtitle: string;
  features: GsacFeature[]; // fixed 4
  statPills: GsacStatPill[]; // fixed 3
}

// Mirrors the hardcoded copy in GsacHero (DifferentiatorDetail.tsx) the
// GSAC page shipped with before this admin editor existed, so the public
// page renders identically until an admin saves a change. The GSAC title,
// eyebrow, and decorative elements (doodle, vertical script text, carousel)
// stay structural/code-only -- this covers the substantive hero text only.
// GSAC's other sections (stats further down the page, gallery) are already
// admin-editable via Differentiators -> GSAC's custom sections.
export const DEFAULT_GSAC_HERO_CONTENT: GsacHeroContentDoc = {
  subtitle: 'Empowering students to pursue international higher education across 7 global destinations through expert counselling, test preparation, loan support, and pre-departure guidance.',
  features: [
    { title: 'EXPLORE', subtitle: 'GLOBAL\nOPPORTUNITIES' },
    { title: 'LEARN', subtitle: 'FROM\nEXPERTS' },
    { title: 'CONNECT', subtitle: 'WITH A\nGLOBAL NETWORK' },
    { title: 'GO BEYOND', subtitle: 'A BRIGHTER\nTOMORROW' },
  ],
  statPills: [
    { value: '7+', label: 'Global Destinations' },
    { value: 'Expert', label: 'End-to-End Guidance' },
    { value: 'A Brighter', label: 'Global Future' },
  ],
};

export const GSAC_HERO_CONTENT_COLLECTION = 'settings';
export const GSAC_HERO_CONTENT_DOC_ID = 'gsacHeroContent';

export default function GsacHeroContentAdmin() {
  const [data, setData] = useState<GsacHeroContentDoc>(DEFAULT_GSAC_HERO_CONTENT);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    async function loadData() {
      try {
        const snap = await getDoc(doc(db, GSAC_HERO_CONTENT_COLLECTION, GSAC_HERO_CONTENT_DOC_ID));
        if (snap.exists()) {
          const remote = snap.data() as Partial<GsacHeroContentDoc>;
          setData({
            subtitle: remote.subtitle || DEFAULT_GSAC_HERO_CONTENT.subtitle,
            features: remote.features?.length === 4 ? remote.features : DEFAULT_GSAC_HERO_CONTENT.features,
            statPills: remote.statPills?.length === 3 ? remote.statPills : DEFAULT_GSAC_HERO_CONTENT.statPills,
          });
        }
      } catch (err) {
        console.error('Failed to load GSAC Hero content:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      await setDoc(doc(db, GSAC_HERO_CONTENT_COLLECTION, GSAC_HERO_CONTENT_DOC_ID), data);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch (err) {
      console.error('Failed to save GSAC Hero content:', err);
      alert('Failed to save changes. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    if (confirm('Reset the GSAC hero text to original defaults?')) setData(DEFAULT_GSAC_HERO_CONTENT);
  };

  if (loading) {
    return <p className="admin-loading">Loading GSAC Hero Editor...</p>;
  }

  return (
    <div className="admin-section">
      <div className="admin-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '1.25rem', borderBottom: '1px solid #e5e7eb', paddingBottom: '1rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Plane size={18} color="#c8a03c" />
              <h2 className="admin-card__title" style={{ margin: 0, padding: 0, border: 'none' }}>GSAC Hero — Copy</h2>
            </div>
            <p className="admin-field__hint" style={{ margin: '0.35rem 0 0' }}>
              The GSAC title/eyebrow and decorative elements stay fixed. GSAC's stats section further down
              the page and its photo gallery are edited separately under Differentiators → GSAC's custom sections.
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
          <label>Subtitle</label>
          <textarea value={data.subtitle} onChange={(e) => setData({ ...data, subtitle: e.target.value })} className="admin-input" rows={2} style={{ width: '100%', fontFamily: 'inherit' }} />
        </div>

        <h3 className="admin-card__title" style={{ fontSize: '0.95rem' }}>4 Features (EXPLORE / LEARN / CONNECT / GO BEYOND)</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '0.5rem', marginBottom: '1.25rem' }}>
          {data.features.map((f, idx) => (
            <div key={idx} style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '0.5rem' }}>
              <input type="text" value={f.title} onChange={(e) => { const next = [...data.features]; next[idx] = { ...next[idx], title: e.target.value }; setData({ ...data, features: next }); }} className="admin-input" style={{ width: '100%', marginBottom: '0.3rem', fontWeight: 600 }} placeholder="Title" />
              <input type="text" value={f.subtitle.replace('\n', ' / ')} onChange={(e) => { const next = [...data.features]; next[idx] = { ...next[idx], subtitle: e.target.value.replace(' / ', '\n') }; setData({ ...data, features: next }); }} className="admin-input" style={{ width: '100%' }} placeholder="Subtitle (use / for a line break)" />
            </div>
          ))}
        </div>

        <h3 className="admin-card__title" style={{ fontSize: '0.95rem' }}>3 Stat Pills</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '0.5rem' }}>
          {data.statPills.map((s, idx) => (
            <div key={idx} style={{ display: 'flex', gap: '0.4rem', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '0.5rem' }}>
              <input type="text" value={s.value} onChange={(e) => { const next = [...data.statPills]; next[idx] = { ...next[idx], value: e.target.value }; setData({ ...data, statPills: next }); }} className="admin-input" style={{ width: 100 }} placeholder="Value" />
              <input type="text" value={s.label} onChange={(e) => { const next = [...data.statPills]; next[idx] = { ...next[idx], label: e.target.value }; setData({ ...data, statPills: next }); }} className="admin-input" style={{ flex: 1 }} placeholder="Label" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
