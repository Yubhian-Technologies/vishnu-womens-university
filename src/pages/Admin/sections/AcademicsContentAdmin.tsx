import { useState, useEffect } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { setDoc } from '../../../lib/auditLog';
import { db } from '../../../lib/firebase';
import { Save, RotateCcw, GraduationCap } from 'lucide-react';

export interface AcademicsContentDoc {
  programsHeading: string;
  programsDesc: string;
  deptHeading: string;
  deptDesc: string;
  activitiesHeading: string;
  activitiesDesc: string;
  placementsHeading: string;
  placementsParagraph: string;
  galleryTitle: string;
  gallerySubtitle: string;
  galleryHighlights: string[];
  ctaHeading: string;
  ctaParagraph: string;
}

// Mirrors the hardcoded copy Academics.tsx shipped with before this admin
// editor existed, so the public page renders identically until an admin
// saves a change.
export const DEFAULT_ACADEMICS_CONTENT: AcademicsContentDoc = {
  programsHeading: 'Explore Your Options',
  programsDesc: 'Whether you are beginning your B.Tech, advancing to M.Tech, or pursuing doctoral research — VWU offers a program matched to your goals.',
  deptHeading: 'Academic Departments',
  deptDesc: 'Specialised departments bringing together experienced faculty, modern laboratories, and industry-aligned curricula for relevant and future-ready education.',
  activitiesHeading: 'Beyond the Classroom',
  activitiesDesc: 'From managing a campus radio station to competing at inter-collegiate sports meets — there is a great deal more to life at VWU than lectures alone.',
  placementsHeading: 'Where VWU Engineers Go',
  placementsParagraph: "The Training & Placement Cell maintains year-round engagement with India's leading employers — including Amazon, TCS, Infosys, Wipro, HCL, Cognizant, and 150+ other companies.",
  galleryTitle: 'Learning, Research & Innovation',
  gallerySubtitle: "Inside VWU's labs, classrooms, and events — where students are trained to think, build, and lead.",
  galleryHighlights: [
    '10 B.Tech specialisations with UGC Autonomous curriculum',
    '50+ specialised labs across all departments',
    '200+ smart classrooms with interactive boards',
    'IEEE, Springer & NPTEL digital library access',
    'Industry-sponsored research & funded projects',
  ],
  ctaHeading: 'Ready to Join VWU?',
  ctaParagraph: 'Arrange a campus visit, request further information, or apply through AP EAPCET (Code: {eapcetCode}) today.',
};

export const ACADEMICS_CONTENT_COLLECTION = 'settings';
export const ACADEMICS_CONTENT_DOC_ID = 'academicsContent';

function TextField({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div className="admin-field" style={{ gridColumn: '1 / -1' }}>
      <label>{label}</label>
      <input type="text" value={value} onChange={(e) => onChange(e.target.value)} className="admin-input" />
    </div>
  );
}

export default function AcademicsContentAdmin() {
  const [data, setData] = useState<AcademicsContentDoc>(DEFAULT_ACADEMICS_CONTENT);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    async function loadData() {
      try {
        const snap = await getDoc(doc(db, ACADEMICS_CONTENT_COLLECTION, ACADEMICS_CONTENT_DOC_ID));
        if (snap.exists()) {
          const remote = snap.data() as Partial<AcademicsContentDoc>;
          setData({ ...DEFAULT_ACADEMICS_CONTENT, ...remote });
        }
      } catch (err) {
        console.error('Failed to load Academics content:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const set = <K extends keyof AcademicsContentDoc>(k: K, v: AcademicsContentDoc[K]) => setData((p) => ({ ...p, [k]: v }));

  const handleSave = async () => {
    setSaving(true);
    try {
      await setDoc(doc(db, ACADEMICS_CONTENT_COLLECTION, ACADEMICS_CONTENT_DOC_ID), data);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch (err) {
      console.error('Failed to save Academics content:', err);
      alert('Failed to save changes. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    if (confirm('Reset all Academics hub copy to original defaults?')) setData(DEFAULT_ACADEMICS_CONTENT);
  };

  if (loading) {
    return <p className="admin-loading">Loading Academics Hub Editor...</p>;
  }

  return (
    <div className="admin-section">
      <div className="admin-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '1.25rem', borderBottom: '1px solid #e5e7eb', paddingBottom: '1rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <GraduationCap size={18} color="#c8a03c" />
              <h2 className="admin-card__title" style={{ margin: 0, padding: 0, border: 'none' }}>Academics Hub — Copy</h2>
            </div>
            <p className="admin-field__hint" style={{ margin: '0.35rem 0 0' }}>
              Quick stats, student activity cards, and career outcome stats are each edited separately under
              Page Content Blocks ("academics"). Keep "{'{eapcetCode}'}" in the CTA paragraph where the live
              EAPCET code should appear.
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

        <h3 className="admin-card__title" style={{ fontSize: '0.95rem', marginTop: 0 }}>"Explore Your Options" (Programs)</h3>
        <div className="admin-form-grid">
          <TextField label="Heading" value={data.programsHeading} onChange={(v) => set('programsHeading', v)} />
          <TextField label="Description" value={data.programsDesc} onChange={(v) => set('programsDesc', v)} />
        </div>

        <h3 className="admin-card__title" style={{ fontSize: '0.95rem', marginTop: '1.25rem' }}>"Academic Departments"</h3>
        <div className="admin-form-grid">
          <TextField label="Heading" value={data.deptHeading} onChange={(v) => set('deptHeading', v)} />
          <TextField label="Description" value={data.deptDesc} onChange={(v) => set('deptDesc', v)} />
        </div>

        <h3 className="admin-card__title" style={{ fontSize: '0.95rem', marginTop: '1.25rem' }}>"Beyond the Classroom"</h3>
        <div className="admin-form-grid">
          <TextField label="Heading" value={data.activitiesHeading} onChange={(v) => set('activitiesHeading', v)} />
          <TextField label="Description" value={data.activitiesDesc} onChange={(v) => set('activitiesDesc', v)} />
        </div>

        <h3 className="admin-card__title" style={{ fontSize: '0.95rem', marginTop: '1.25rem' }}>"Where VWU Engineers Go" (Placements)</h3>
        <div className="admin-form-grid">
          <TextField label="Heading" value={data.placementsHeading} onChange={(v) => set('placementsHeading', v)} />
          <div className="admin-field" style={{ gridColumn: '1 / -1' }}>
            <label>Paragraph</label>
            <textarea value={data.placementsParagraph} onChange={(e) => set('placementsParagraph', e.target.value)} className="admin-input" rows={2} style={{ width: '100%', fontFamily: 'inherit' }} />
          </div>
        </div>

        <h3 className="admin-card__title" style={{ fontSize: '0.95rem', marginTop: '1.25rem' }}>Academic Life Gallery Caption</h3>
        <div className="admin-form-grid">
          <TextField label="Title" value={data.galleryTitle} onChange={(v) => set('galleryTitle', v)} />
          <TextField label="Subtitle" value={data.gallerySubtitle} onChange={(v) => set('gallerySubtitle', v)} />
          <div className="admin-field" style={{ gridColumn: '1 / -1' }}>
            <label>Highlights (one per line)</label>
            <textarea value={data.galleryHighlights.join('\n')} onChange={(e) => set('galleryHighlights', e.target.value.split('\n'))} className="admin-input" rows={5} style={{ width: '100%', fontFamily: 'inherit', resize: 'vertical' }} />
          </div>
        </div>

        <h3 className="admin-card__title" style={{ fontSize: '0.95rem', marginTop: '1.25rem' }}>Closing CTA</h3>
        <div className="admin-form-grid">
          <TextField label="Heading" value={data.ctaHeading} onChange={(v) => set('ctaHeading', v)} />
          <div className="admin-field" style={{ gridColumn: '1 / -1' }}>
            <label>Paragraph</label>
            <textarea value={data.ctaParagraph} onChange={(e) => set('ctaParagraph', e.target.value)} className="admin-input" rows={2} style={{ width: '100%', fontFamily: 'inherit' }} />
          </div>
        </div>
      </div>
    </div>
  );
}
