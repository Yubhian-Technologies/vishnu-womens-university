import { useState, useEffect } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { setDoc } from '../../../lib/auditLog';
import { db } from '../../../lib/firebase';
import { Plus, Trash2, Save, RotateCcw, Home as HomeIcon } from 'lucide-react';

export interface HomeCtaButton {
  label: string;
  link: string;
}

export interface HomeContentDoc {
  browserTabTitle: string;
  metaTitle: string;
  metaDescription: string;
  studyIntroTitle: string;
  studyIntroSubtitle: string;
  studyIntroParagraphs: string[];
  activityEyebrow: string;
  activityTitle: string;
  activityDesc: string;
  testimonialSectionTitle: string;
  ctaHeading: string;
  ctaBody: string;
  ctaButtons: HomeCtaButton[];
}

// Mirrors the hardcoded copy Home.tsx shipped with before this admin editor
// existed — the public page falls back to this until an admin saves a
// change, so it renders identically.
export const DEFAULT_HOME_CONTENT: HomeContentDoc = {
  browserTabTitle: 'VWU | Leading by Design — Women in Engineering',
  metaTitle: "Vishnu Women's University | Empowering Women Through Knowledge & Technology",
  metaDescription: 'First private university for women in Telugu states located in Bhimavaram, Andhra Pradesh. Offering B.Tech, M.Tech, MBA, and Ph.D. programs with world-class infrastructure and top placements.',
  studyIntroTitle: 'Study at VWU',
  studyIntroSubtitle: 'Courses for Women',
  studyIntroParagraphs: [
    'At VWU, learning extends far beyond the traditional classroom. Students gain personalized, industry-oriented education designed to develop technical expertise, leadership skills, creativity, and the confidence to shape their future.',
    'Every programme is designed exclusively for women and emphasizes hands-on learning through modern laboratories and practical experiences. Our faculty bring valuable industry exposure into the classroom from the very first year, helping students connect academic knowledge with real-world applications.',
    'All programmes are approved by AICTE and recognized by the UGC.',
  ],
  activityEyebrow: 'Campus Life',
  activityTitle: 'Recent Events/ News',
  activityDesc: 'A rolling glimpse of the events, celebrations, and everyday moments that shape life at VWU.',
  testimonialSectionTitle: 'What Our Students Say',
  ctaHeading: 'The best way to understand VWU is to see it for yourself.',
  ctaBody: 'Arrange a campus tour, speak with our admissions team, or submit your application today. Your path to a purposeful engineering career starts here.',
  ctaButtons: [
    { label: 'Schedule a Visit', link: '/admissions' },
    { label: 'Request Information', link: '/admissions' },
    { label: 'Apply via AP EAPCET', link: '/admissions' },
  ],
};

export const HOME_CONTENT_COLLECTION = 'settings';
export const HOME_CONTENT_DOC_ID = 'homeContent';

export default function HomeContentAdmin() {
  const [data, setData] = useState<HomeContentDoc>(DEFAULT_HOME_CONTENT);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    async function loadData() {
      try {
        const snap = await getDoc(doc(db, HOME_CONTENT_COLLECTION, HOME_CONTENT_DOC_ID));
        if (snap.exists()) {
          const remote = snap.data() as Partial<HomeContentDoc>;
          setData({ ...DEFAULT_HOME_CONTENT, ...remote });
        }
      } catch (err) {
        console.error('Failed to load Home page content:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const set = <K extends keyof HomeContentDoc>(k: K, v: HomeContentDoc[K]) => setData((p) => ({ ...p, [k]: v }));

  const handleSave = async () => {
    setSaving(true);
    try {
      await setDoc(doc(db, HOME_CONTENT_COLLECTION, HOME_CONTENT_DOC_ID), data);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch (err) {
      console.error('Failed to save Home page content:', err);
      alert('Failed to save changes. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    if (confirm('Reset all Home page copy to original defaults?')) setData(DEFAULT_HOME_CONTENT);
  };

  const updateButton = (idx: number, patch: Partial<HomeCtaButton>) => {
    const ctaButtons = [...data.ctaButtons];
    ctaButtons[idx] = { ...ctaButtons[idx], ...patch };
    set('ctaButtons', ctaButtons);
  };

  if (loading) {
    return <p className="admin-loading">Loading Home Page Content Editor...</p>;
  }

  return (
    <div className="admin-section">
      <div className="admin-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '1.25rem', borderBottom: '1px solid #e5e7eb', paddingBottom: '1rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <HomeIcon size={18} color="#c8a03c" />
              <h2 className="admin-card__title" style={{ margin: 0, padding: 0, border: 'none' }}>Home Page — Copy</h2>
            </div>
            <p className="admin-field__hint" style={{ margin: '0.35rem 0 0' }}>
              The narrative text on the Home page — SEO tags, the "Study at VWU" intro, the "Recent Events/News" strip
              header, the testimonials heading, and the closing Admissions CTA banner. Study cards, testimonials,
              and photos are each edited separately (Page Content Blocks / Website Photos).
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

        <h3 className="admin-card__title" style={{ fontSize: '0.95rem', marginTop: 0 }}>SEO</h3>
        <div className="admin-form-grid">
          <div className="admin-field">
            <label>Browser Tab Title</label>
            <input type="text" value={data.browserTabTitle} onChange={(e) => set('browserTabTitle', e.target.value)} className="admin-input" />
          </div>
          <div className="admin-field">
            <label>Search Engine Title</label>
            <input type="text" value={data.metaTitle} onChange={(e) => set('metaTitle', e.target.value)} className="admin-input" />
          </div>
          <div className="admin-field" style={{ gridColumn: '1 / -1' }}>
            <label>Meta Description</label>
            <textarea value={data.metaDescription} onChange={(e) => set('metaDescription', e.target.value)} className="admin-input" rows={2} style={{ width: '100%', fontFamily: 'inherit' }} />
          </div>
        </div>

        <h3 className="admin-card__title" style={{ fontSize: '0.95rem', marginTop: '1.25rem' }}>"Study at VWU" Intro</h3>
        <div className="admin-form-grid">
          <div className="admin-field">
            <label>Heading</label>
            <input type="text" value={data.studyIntroTitle} onChange={(e) => set('studyIntroTitle', e.target.value)} className="admin-input" />
          </div>
          <div className="admin-field">
            <label>Subheading</label>
            <input type="text" value={data.studyIntroSubtitle} onChange={(e) => set('studyIntroSubtitle', e.target.value)} className="admin-input" />
          </div>
          <div className="admin-field" style={{ gridColumn: '1 / -1' }}>
            <label>Paragraphs (one per line)</label>
            <textarea
              value={data.studyIntroParagraphs.join('\n')}
              onChange={(e) => set('studyIntroParagraphs', e.target.value.split('\n'))}
              className="admin-input"
              rows={5}
              style={{ width: '100%', fontFamily: 'inherit', resize: 'vertical' }}
            />
          </div>
        </div>

        <h3 className="admin-card__title" style={{ fontSize: '0.95rem', marginTop: '1.25rem' }}>"Recent Events/News" Strip Header</h3>
        <div className="admin-form-grid">
          <div className="admin-field">
            <label>Eyebrow</label>
            <input type="text" value={data.activityEyebrow} onChange={(e) => set('activityEyebrow', e.target.value)} className="admin-input" />
          </div>
          <div className="admin-field">
            <label>Heading</label>
            <input type="text" value={data.activityTitle} onChange={(e) => set('activityTitle', e.target.value)} className="admin-input" />
          </div>
          <div className="admin-field" style={{ gridColumn: '1 / -1' }}>
            <label>Description</label>
            <input type="text" value={data.activityDesc} onChange={(e) => set('activityDesc', e.target.value)} className="admin-input" />
          </div>
        </div>

        <h3 className="admin-card__title" style={{ fontSize: '0.95rem', marginTop: '1.25rem' }}>Testimonials Heading</h3>
        <div className="admin-field">
          <input type="text" value={data.testimonialSectionTitle} onChange={(e) => set('testimonialSectionTitle', e.target.value)} className="admin-input" />
        </div>

        <h3 className="admin-card__title" style={{ fontSize: '0.95rem', marginTop: '1.25rem' }}>Admissions CTA Banner</h3>
        <div className="admin-form-grid">
          <div className="admin-field" style={{ gridColumn: '1 / -1' }}>
            <label>Heading</label>
            <input type="text" value={data.ctaHeading} onChange={(e) => set('ctaHeading', e.target.value)} className="admin-input" />
          </div>
          <div className="admin-field" style={{ gridColumn: '1 / -1' }}>
            <label>Body</label>
            <textarea value={data.ctaBody} onChange={(e) => set('ctaBody', e.target.value)} className="admin-input" rows={2} style={{ width: '100%', fontFamily: 'inherit' }} />
          </div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'flex-end', margin: '0.6rem 0' }}>
          <button type="button" onClick={() => set('ctaButtons', [...data.ctaButtons, { label: '', link: '/admissions' }])} className="admin-btn admin-btn--sm admin-btn--secondary">
            <Plus size={14} /> Add Button
          </button>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '0.6rem' }}>
          {data.ctaButtons.map((b, idx) => (
            <div key={idx} style={{ display: 'flex', gap: '0.4rem', alignItems: 'center', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '0.5rem' }}>
              <input type="text" placeholder="Button label" value={b.label} onChange={(e) => updateButton(idx, { label: e.target.value })} className="admin-input" style={{ flex: 1 }} />
              <input type="text" placeholder="Link" value={b.link} onChange={(e) => updateButton(idx, { link: e.target.value })} className="admin-input" style={{ flex: 1 }} />
              <button type="button" onClick={() => set('ctaButtons', data.ctaButtons.filter((_, i) => i !== idx))} className="admin-btn-danger"><Trash2 size={13} /></button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
