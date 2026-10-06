import { useState, useEffect } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { setDoc } from '../../../lib/auditLog';
import { db } from '../../../lib/firebase';
import { Save, RotateCcw, HeartHandshake } from 'lucide-react';

export interface HighlightTile { title: string; desc: string; }
export interface CoreValueItem { title: string; desc: string; }

export interface SocialServicesContentDoc {
  highlights: HighlightTile[]; // fixed 3 (icon structural)
  nssTag: string;
  nssTitle: string;
  nssParagraphs: string[];
  nssQuote: string;
  coreValuesHeading: string;
  coreValues: CoreValueItem[]; // fixed 6 (icon/colour structural)
  founderQuoteFallback: string; // only shown if no photo caption override
  founderParagraphs: string[];
}

// Mirrors the hardcoded copy SocialServicesPage.tsx shipped with before
// this admin editor existed, so the public page renders identically until
// an admin saves a change. The 6 "Communities We Serve" card titles/
// descriptions are NOT here -- they're already admin-editable two other
// ways (Website Photos caption, or Campus Life -> Social Services ->
// "Communities We Serve" custom section caption), so a third hardcoded
// override here would just be a confusing extra place to look.
export const DEFAULT_SOCIAL_SERVICES_CONTENT: SocialServicesContentDoc = {
  highlights: [
    { title: 'Community Outreach', desc: 'Stronger communities, brighter futures' },
    { title: 'Student Volunteers', desc: 'Building skills, creating impact' },
    { title: 'Social Initiatives', desc: 'Education | Health | Awareness' },
  ],
  nssTag: 'NSS AT VWU',
  nssTitle: 'Serving the Nation Through Education',
  nssParagraphs: [
    'National integrity should flow from the heart of every citizen. Apart from academics, every student must involve in serving her country.',
    'At VWU, the National Service Scheme (NSS) is a meaningful part of student formation. The programme rests on the conviction that “Education and Service to the community and by the community” is the true basis of a complete education.',
    'Through NSS, students take part in nation-building work, strengthen their interpersonal abilities, and help foster a Technocratic Environment in rural communities — continuing the humanitarian values that our founder Dr. B. V. Raju embodied throughout his life.',
  ],
  nssQuote: 'Education and Service to the community and by the community.',
  coreValuesHeading: 'Our Core Values',
  coreValues: [
    { title: 'Not Me But You', desc: 'Selfless service for better tomorrow.' },
    { title: 'Service Before Self', desc: 'Putting community needs first.' },
    { title: 'Education Through Community', desc: 'Learning, sharing, growing together.' },
    { title: 'Nation Building Through Youth', desc: 'Empowered youth, for a stronger nation.' },
    { title: 'Inclusive Development', desc: 'Equal opportunities for all.' },
    { title: 'Rural Empowerment', desc: 'Stronger villages, brighter futures.' },
  ],
  founderQuoteFallback: 'Service to humanity is the highest form of education.',
  founderParagraphs: [
    "VWU's ethos of service has deep roots in the life of our founder, the late Padma Bhushan Dr. B. V. Raju, who devoted his later years to humanitarian causes — building leprosy care centres, schools, women's associations, community halls, and veterinary facilities in surrounding villages, all without government support.",
    'The Dr. B. V. Raju Foundation continues this tradition today. VWU students take an active part in this mission, channelling their technical knowledge, empathy, and sense of purpose into communities that genuinely need both.',
  ],
};

export const SOCIAL_SERVICES_CONTENT_COLLECTION = 'settings';
export const SOCIAL_SERVICES_CONTENT_DOC_ID = 'socialServicesContent';

export default function SocialServicesContentAdmin() {
  const [data, setData] = useState<SocialServicesContentDoc>(DEFAULT_SOCIAL_SERVICES_CONTENT);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    async function loadData() {
      try {
        const snap = await getDoc(doc(db, SOCIAL_SERVICES_CONTENT_COLLECTION, SOCIAL_SERVICES_CONTENT_DOC_ID));
        if (snap.exists()) {
          const remote = snap.data() as Partial<SocialServicesContentDoc>;
          setData({ ...DEFAULT_SOCIAL_SERVICES_CONTENT, ...remote });
        }
      } catch (err) {
        console.error('Failed to load Social Services content:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const set = <K extends keyof SocialServicesContentDoc>(k: K, v: SocialServicesContentDoc[K]) => setData((p) => ({ ...p, [k]: v }));

  const handleSave = async () => {
    setSaving(true);
    try {
      await setDoc(doc(db, SOCIAL_SERVICES_CONTENT_COLLECTION, SOCIAL_SERVICES_CONTENT_DOC_ID), data);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch (err) {
      console.error('Failed to save Social Services content:', err);
      alert('Failed to save changes. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    if (confirm('Reset all Social Services copy to original defaults?')) setData(DEFAULT_SOCIAL_SERVICES_CONTENT);
  };

  if (loading) {
    return <p className="admin-loading">Loading Social Services Editor...</p>;
  }

  return (
    <div className="admin-section">
      <div className="admin-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '1.25rem', borderBottom: '1px solid #e5e7eb', paddingBottom: '1rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <HeartHandshake size={18} color="#c8a03c" />
              <h2 className="admin-card__title" style={{ margin: 0, padding: 0, border: 'none' }}>Social Services (NSS) — Copy</h2>
            </div>
            <p className="admin-field__hint" style={{ margin: '0.35rem 0 0' }}>
              The 6 "Communities We Serve" card photos/captions are edited elsewhere (Website Photos, or
              Campus Life → Social Services → "Communities We Serve") — not duplicated here.
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

        <h3 className="admin-card__title" style={{ fontSize: '0.95rem', marginTop: 0 }}>Hero Highlights Bar (3 tiles)</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '0.5rem' }}>
          {data.highlights.map((h, idx) => (
            <div key={idx} style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '0.5rem' }}>
              <input type="text" value={h.title} onChange={(e) => { const next = [...data.highlights]; next[idx] = { ...next[idx], title: e.target.value }; set('highlights', next); }} className="admin-input" style={{ width: '100%', marginBottom: '0.3rem', fontWeight: 600 }} placeholder="Title" />
              <input type="text" value={h.desc} onChange={(e) => { const next = [...data.highlights]; next[idx] = { ...next[idx], desc: e.target.value }; set('highlights', next); }} className="admin-input" style={{ width: '100%' }} placeholder="Description" />
            </div>
          ))}
        </div>

        <h3 className="admin-card__title" style={{ fontSize: '0.95rem', marginTop: '1.25rem' }}>"NSS at VWU" Section</h3>
        <div className="admin-form-grid">
          <div className="admin-field">
            <label>Tag</label>
            <input type="text" value={data.nssTag} onChange={(e) => set('nssTag', e.target.value)} className="admin-input" />
          </div>
          <div className="admin-field">
            <label>Title</label>
            <input type="text" value={data.nssTitle} onChange={(e) => set('nssTitle', e.target.value)} className="admin-input" />
          </div>
          <div className="admin-field" style={{ gridColumn: '1 / -1' }}>
            <label>Paragraphs (one per line)</label>
            <textarea value={data.nssParagraphs.join('\n')} onChange={(e) => set('nssParagraphs', e.target.value.split('\n'))} className="admin-input" rows={5} style={{ width: '100%', fontFamily: 'inherit', resize: 'vertical' }} />
          </div>
          <div className="admin-field" style={{ gridColumn: '1 / -1' }}>
            <label>Quote</label>
            <input type="text" value={data.nssQuote} onChange={(e) => set('nssQuote', e.target.value)} className="admin-input" />
          </div>
        </div>

        <h3 className="admin-card__title" style={{ fontSize: '0.95rem', marginTop: '1.25rem' }}>Core Values (6 tiles, icons fixed)</h3>
        <div className="admin-form-grid">
          <TextField label="Section heading" value={data.coreValuesHeading} onChange={(v) => set('coreValuesHeading', v)} />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '0.5rem', marginTop: '0.4rem' }}>
          {data.coreValues.map((v, idx) => (
            <div key={idx} style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '0.5rem' }}>
              <input type="text" value={v.title} onChange={(e) => { const next = [...data.coreValues]; next[idx] = { ...next[idx], title: e.target.value }; set('coreValues', next); }} className="admin-input" style={{ width: '100%', marginBottom: '0.3rem', fontWeight: 600 }} placeholder="Title" />
              <input type="text" value={v.desc} onChange={(e) => { const next = [...data.coreValues]; next[idx] = { ...next[idx], desc: e.target.value }; set('coreValues', next); }} className="admin-input" style={{ width: '100%' }} placeholder="Description" />
            </div>
          ))}
        </div>

        <h3 className="admin-card__title" style={{ fontSize: '0.95rem', marginTop: '1.25rem' }}>Founder's Legacy</h3>
        <div className="admin-form-grid">
          <div className="admin-field" style={{ gridColumn: '1 / -1' }}>
            <label>Quote (fallback — overridden by the founder photo's own caption if set)</label>
            <input type="text" value={data.founderQuoteFallback} onChange={(e) => set('founderQuoteFallback', e.target.value)} className="admin-input" />
          </div>
          <div className="admin-field" style={{ gridColumn: '1 / -1' }}>
            <label>Paragraphs (one per line)</label>
            <textarea value={data.founderParagraphs.join('\n')} onChange={(e) => set('founderParagraphs', e.target.value.split('\n'))} className="admin-input" rows={4} style={{ width: '100%', fontFamily: 'inherit', resize: 'vertical' }} />
          </div>
        </div>
      </div>
    </div>
  );
}

function TextField({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div className="admin-field" style={{ gridColumn: '1 / -1' }}>
      <label>{label}</label>
      <input type="text" value={value} onChange={(e) => onChange(e.target.value)} className="admin-input" />
    </div>
  );
}
