import { useState, useEffect } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { setDoc } from '../../../lib/auditLog';
import { db } from '../../../lib/firebase';
import { Save, RotateCcw, Globe2 } from 'lucide-react';
import { higherEducationSections, type HigherEducationSection } from '../../Placements/higherEducation.data';

export interface HigherEducationDoc {
  // Fixed shape: sections[0] = USA (flat `universities` list), sections[1] =
  // UK/Australia/Canada (3 `tabs`, each its own university list).
  sections: HigherEducationSection[];
}

// Mirrors higherEducation.data.ts -- the public page falls back to this
// until an admin saves a change here, so it renders identically.
export const DEFAULT_HIGHER_EDUCATION: HigherEducationDoc = {
  sections: higherEducationSections,
};

export const HIGHER_EDUCATION_COLLECTION = 'settings';
export const HIGHER_EDUCATION_DOC_ID = 'higherEducation';

export default function HigherEducationAdmin() {
  const [data, setData] = useState<HigherEducationDoc>(DEFAULT_HIGHER_EDUCATION);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    async function loadData() {
      try {
        const snap = await getDoc(doc(db, HIGHER_EDUCATION_COLLECTION, HIGHER_EDUCATION_DOC_ID));
        if (snap.exists()) {
          const remote = snap.data() as Partial<HigherEducationDoc>;
          setData({ sections: remote.sections?.length === 2 ? remote.sections : DEFAULT_HIGHER_EDUCATION.sections });
        }
      } catch (err) {
        console.error('Failed to load Higher Education content:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const usaSection = data.sections[0];
  const ukAusCanSection = data.sections[1];

  const updateUsaList = (text: string) => {
    const sections = [...data.sections];
    sections[0] = { ...usaSection, universities: text.split('\n') };
    setData({ sections });
  };

  const updateTabList = (tabIdx: number, text: string) => {
    const sections = [...data.sections];
    const tabs = [...(ukAusCanSection.tabs || [])];
    tabs[tabIdx] = { ...tabs[tabIdx], universities: text.split('\n') };
    sections[1] = { ...ukAusCanSection, tabs };
    setData({ sections });
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      // Drop blank lines on save so an accidental trailing newline doesn't
      // become an empty university row on the public page.
      const cleaned: HigherEducationDoc = {
        sections: [
          { ...usaSection, universities: (usaSection.universities || []).map((s) => s.trim()).filter(Boolean) },
          { ...ukAusCanSection, tabs: (ukAusCanSection.tabs || []).map((t) => ({ ...t, universities: t.universities.map((s) => s.trim()).filter(Boolean) })) },
        ],
      };
      await setDoc(doc(db, HIGHER_EDUCATION_COLLECTION, HIGHER_EDUCATION_DOC_ID), cleaned);
      setData(cleaned);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch (err) {
      console.error('Failed to save Higher Education content:', err);
      alert('Failed to save changes. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    if (confirm('Reset all university lists to original defaults?')) setData(DEFAULT_HIGHER_EDUCATION);
  };

  if (loading) {
    return <p className="admin-loading">Loading Higher Education Editor...</p>;
  }

  return (
    <div className="admin-section">
      <div className="admin-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '1.25rem', borderBottom: '1px solid #e5e7eb', paddingBottom: '1rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Globe2 size={18} color="#c8a03c" />
              <h2 className="admin-card__title" style={{ margin: 0, padding: 0, border: 'none' }}>Higher Education — University Lists</h2>
            </div>
            <p className="admin-field__hint" style={{ margin: '0.35rem 0 0' }}>
              One university name per line. Drives the accordion on the Higher Education placement page —
              USA is a flat list; UK / Australia / Canada each have their own list under that section's tabs.
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
          <label>{usaSection.title} ({(usaSection.universities || []).length} universities)</label>
          <textarea
            value={(usaSection.universities || []).join('\n')}
            onChange={(e) => updateUsaList(e.target.value)}
            className="admin-input"
            rows={14}
            style={{ width: '100%', fontFamily: 'inherit', resize: 'vertical' }}
          />
        </div>

        <h3 className="admin-card__title" style={{ fontSize: '0.95rem' }}>{ukAusCanSection.title}</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {(ukAusCanSection.tabs || []).map((t, idx) => (
            <div key={t.label} className="admin-field">
              <label>{t.label} ({t.universities.length} universities)</label>
              <textarea
                value={t.universities.join('\n')}
                onChange={(e) => updateTabList(idx, e.target.value)}
                className="admin-input"
                rows={6}
                style={{ width: '100%', fontFamily: 'inherit', resize: 'vertical' }}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
