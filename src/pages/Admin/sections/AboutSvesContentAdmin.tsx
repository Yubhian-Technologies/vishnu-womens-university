import { useState, useEffect } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { setDoc } from '../../../lib/auditLog';
import { db } from '../../../lib/firebase';
import { Save, RotateCcw, Landmark } from 'lucide-react';

export interface AboutSvesContentDoc {
  statsHeading: string;
  statsSubtitle: string;
  introSubheading: string;
  introParagraphs: string[];
  introLinkLabel: string;
  campusesHeading: string;
  campusesParagraph: string;
  galleryLabel: string;
  galleryTitle: string;
  gallerySubtitle: string;
  milestonesHeading: string;
  milestonesParagraph: string;
  ctaEyebrow: string;
  ctaHeading: string;
  ctaParagraphs: string[];
  ctaButtonLabel: string;
}

// Mirrors the hardcoded copy AboutSVES.tsx shipped with before this admin
// editor existed, so the public page renders identically until an admin
// saves a change.
export const DEFAULT_ABOUT_SVES_CONTENT: AboutSvesContentDoc = {
  statsHeading: 'SVES AT A GLANCE',
  statsSubtitle: 'A Growing Educational Community',
  introSubheading: 'Sri Vishnu Educational Society Education with a Long View since 1992',
  introParagraphs: [
    'Sri Vishnu Educational Society was founded in 1992 by Late **Dr. B. V. Raju**, an industrialist, philanthropist and recipient of the **Padma Shri and Padma Bhushan**.',
    'Established as a not-for-profit educational organisation, SVES has developed institutions across engineering, pharmacy, dentistry, management, sciences, polytechnic and school education.',
    'Over the years, the Society has focused on creating learning environments that bring together academic quality, practical exposure and opportunities for students to progress in their chosen fields.',
  ],
  introLinkLabel: 'Know More',
  campusesHeading: 'Four Campus Communities.',
  campusesParagraph: "SVES institutions are organised across distinct campus communities in Andhra Pradesh and Telangana, each contributing to the Society's wider academic network.",
  galleryLabel: 'ACROSS SVES',
  galleryTitle: 'Life Across Our Campuses',
  gallerySubtitle: 'A glimpse of the academic spaces, people and experiences that make up the wider SVES community.',
  milestonesHeading: 'Milestones in the SVES Journey',
  milestonesParagraph: "Each milestone reflects the Society's continued growth across institutions, disciplines and learning communities.",
  ctaEyebrow: "Vishnu Women's University",
  ctaHeading: "Explore Vishnu Women's University",
  ctaParagraphs: [
    "Vishnu Women's University carries forward the educational legacy of SVES through academic programmes, research, student development and a university experience centred on women.",
    'Discover the University, its academic environment and the opportunities available to students.',
  ],
  ctaButtonLabel: 'Join VWU →',
};

export const ABOUT_SVES_CONTENT_COLLECTION = 'settings';
export const ABOUT_SVES_CONTENT_DOC_ID = 'aboutSvesContent';

function TextField({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div className="admin-field" style={{ gridColumn: '1 / -1' }}>
      <label>{label}</label>
      <input type="text" value={value} onChange={(e) => onChange(e.target.value)} className="admin-input" />
    </div>
  );
}

function ParagraphsField({ label, value, onChange, rows = 4 }: { label: string; value: string[]; onChange: (v: string[]) => void; rows?: number }) {
  return (
    <div className="admin-field" style={{ gridColumn: '1 / -1' }}>
      <label>{label} (one paragraph per line; use **text** for bold)</label>
      <textarea value={value.join('\n')} onChange={(e) => onChange(e.target.value.split('\n'))} className="admin-input" rows={rows} style={{ width: '100%', fontFamily: 'inherit', resize: 'vertical' }} />
    </div>
  );
}

export default function AboutSvesContentAdmin() {
  const [data, setData] = useState<AboutSvesContentDoc>(DEFAULT_ABOUT_SVES_CONTENT);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    async function loadData() {
      try {
        const snap = await getDoc(doc(db, ABOUT_SVES_CONTENT_COLLECTION, ABOUT_SVES_CONTENT_DOC_ID));
        if (snap.exists()) {
          const remote = snap.data() as Partial<AboutSvesContentDoc>;
          setData({ ...DEFAULT_ABOUT_SVES_CONTENT, ...remote });
        }
      } catch (err) {
        console.error('Failed to load About SVES content:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const set = <K extends keyof AboutSvesContentDoc>(k: K, v: AboutSvesContentDoc[K]) => setData((p) => ({ ...p, [k]: v }));

  const handleSave = async () => {
    setSaving(true);
    try {
      await setDoc(doc(db, ABOUT_SVES_CONTENT_COLLECTION, ABOUT_SVES_CONTENT_DOC_ID), data);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch (err) {
      console.error('Failed to save About SVES content:', err);
      alert('Failed to save changes. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    if (confirm('Reset all About SVES copy to original defaults?')) setData(DEFAULT_ABOUT_SVES_CONTENT);
  };

  if (loading) {
    return <p className="admin-loading">Loading About SVES Editor...</p>;
  }

  return (
    <div className="admin-section">
      <div className="admin-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '1.25rem', borderBottom: '1px solid #e5e7eb', paddingBottom: '1rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Landmark size={18} color="#c8a03c" />
              <h2 className="admin-card__title" style={{ margin: 0, padding: 0, border: 'none' }}>About SVES Page — Copy</h2>
            </div>
            <p className="admin-field__hint" style={{ margin: '0.35rem 0 0' }}>
              Stats values, milestones, "Legacy Rooted in Vision" and "Leadership & Culture" text are each edited
              separately under Page Content Blocks ("about-sves"). The Four Campuses grid is edited under SVES Campuses.
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

        <h3 className="admin-card__title" style={{ fontSize: '0.95rem', marginTop: 0 }}>Stats Banner</h3>
        <div className="admin-form-grid">
          <TextField label="Heading" value={data.statsHeading} onChange={(v) => set('statsHeading', v)} />
          <TextField label="Subtitle" value={data.statsSubtitle} onChange={(v) => set('statsSubtitle', v)} />
        </div>

        <h3 className="admin-card__title" style={{ fontSize: '0.95rem', marginTop: '1.25rem' }}>Society Intro</h3>
        <div className="admin-form-grid">
          <TextField label="Subheading" value={data.introSubheading} onChange={(v) => set('introSubheading', v)} />
          <ParagraphsField label="Paragraphs" value={data.introParagraphs} onChange={(v) => set('introParagraphs', v)} rows={4} />
          <TextField label='"Know More" link label' value={data.introLinkLabel} onChange={(v) => set('introLinkLabel', v)} />
        </div>

        <h3 className="admin-card__title" style={{ fontSize: '0.95rem', marginTop: '1.25rem' }}>Four Campus Communities Heading</h3>
        <div className="admin-form-grid">
          <TextField label="Heading" value={data.campusesHeading} onChange={(v) => set('campusesHeading', v)} />
          <div className="admin-field" style={{ gridColumn: '1 / -1' }}>
            <label>Paragraph</label>
            <textarea value={data.campusesParagraph} onChange={(e) => set('campusesParagraph', e.target.value)} className="admin-input" rows={2} style={{ width: '100%', fontFamily: 'inherit' }} />
          </div>
        </div>

        <h3 className="admin-card__title" style={{ fontSize: '0.95rem', marginTop: '1.25rem' }}>Campus Photos Caption</h3>
        <div className="admin-form-grid">
          <TextField label="Label" value={data.galleryLabel} onChange={(v) => set('galleryLabel', v)} />
          <TextField label="Title" value={data.galleryTitle} onChange={(v) => set('galleryTitle', v)} />
          <TextField label="Subtitle" value={data.gallerySubtitle} onChange={(v) => set('gallerySubtitle', v)} />
        </div>

        <h3 className="admin-card__title" style={{ fontSize: '0.95rem', marginTop: '1.25rem' }}>Milestones Heading</h3>
        <div className="admin-form-grid">
          <TextField label="Heading" value={data.milestonesHeading} onChange={(v) => set('milestonesHeading', v)} />
          <div className="admin-field" style={{ gridColumn: '1 / -1' }}>
            <label>Paragraph</label>
            <textarea value={data.milestonesParagraph} onChange={(e) => set('milestonesParagraph', e.target.value)} className="admin-input" rows={2} style={{ width: '100%', fontFamily: 'inherit' }} />
          </div>
        </div>

        <h3 className="admin-card__title" style={{ fontSize: '0.95rem', marginTop: '1.25rem' }}>Closing CTA</h3>
        <div className="admin-form-grid">
          <TextField label="Eyebrow" value={data.ctaEyebrow} onChange={(v) => set('ctaEyebrow', v)} />
          <TextField label="Heading" value={data.ctaHeading} onChange={(v) => set('ctaHeading', v)} />
          <ParagraphsField label="Paragraphs" value={data.ctaParagraphs} onChange={(v) => set('ctaParagraphs', v)} rows={3} />
          <TextField label="Button label" value={data.ctaButtonLabel} onChange={(v) => set('ctaButtonLabel', v)} />
        </div>
      </div>
    </div>
  );
}
