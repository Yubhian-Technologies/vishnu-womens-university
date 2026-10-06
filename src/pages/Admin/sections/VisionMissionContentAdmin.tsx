import { useState, useEffect } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { setDoc } from '../../../lib/auditLog';
import { db } from '../../../lib/firebase';
import { Save, RotateCcw, Compass } from 'lucide-react';

export interface QualityCommitmentItem {
  title: string;
  desc: string;
}

export interface VisionMissionContentDoc {
  visionStatement: string;
  missionIntro: string;
  valuesHeading: string;
  valuesDesc: string;
  galleryTitle: string;
  gallerySubtitle: string;
  galleryHighlights: string[];
  qualityEyebrow: string;
  qualityHeading: string;
  qualityParagraph: string;
  qualityItems: QualityCommitmentItem[];
  ctaHeading: string;
  ctaParagraph: string;
  ctaButtonLabel: string;
}

// Mirrors the hardcoded copy VisionMission.tsx shipped with before this
// admin editor existed, so the public page renders identically until an
// admin saves a change.
export const DEFAULT_VISION_MISSION_CONTENT: VisionMissionContentDoc = {
  visionStatement: 'To emerge as a globally benchmarked, women-centric university that advances the Sustainable Development Goals (SDGs) through academic excellence, ethical leadership, and transformative innovation—empowering women to shape an equitable, sustainable, and resilient world.',
  missionIntro: 'To advance knowledge and women’s education through academic excellence, research, innovation and responsible engagement with society. We are committed to equity, sustainability, global collaboration and the development of graduates who are prepared to contribute with competence and integrity.',
  valuesHeading: 'What We Stand For',
  valuesDesc: 'The values that guide our teaching, research and engagement.',
  galleryTitle: 'Where Purpose Meets Practice',
  gallerySubtitle: 'Every corner of VWU reflects the values we stand for — in classrooms, on the field, and in the community.',
  galleryHighlights: [
    'Excellence in teaching, research & outcomes',
    'Innovation through TBI & AICTE IDEA Lab',
    'Community service via NSS & Dr. B.V. Raju Foundation',
    'Environmental stewardship — green campus initiative',
  ],
  qualityEyebrow: 'QUALITY COMMITMENT',
  qualityHeading: 'Quality Policy',
  qualityParagraph: 'We are committed to maintaining high standards in teaching, learning, research and institutional practice, with a continued focus on student development and academic improvement.',
  qualityItems: [
    { title: 'Academic Quality', desc: 'Maintain high standards across teaching, learning and research.' },
    { title: 'Student Development', desc: 'Support meaningful learning experiences and the overall development of students.' },
    { title: 'Continuous Improvement', desc: 'Respond to evolving educational needs, technologies and academic practices.' },
    { title: 'Integrity & Responsibility', desc: 'Uphold integrity, consistency and responsible practices across the University.' },
  ],
  ctaHeading: 'Empowering Women Through Excellence',
  ctaParagraph: 'Discover our academic programs, state-of-the-art campus infrastructure, and vibrant student community.',
  ctaButtonLabel: 'About VWU',
};

export const VISION_MISSION_CONTENT_COLLECTION = 'settings';
export const VISION_MISSION_CONTENT_DOC_ID = 'visionMissionContent';

export default function VisionMissionContentAdmin() {
  const [data, setData] = useState<VisionMissionContentDoc>(DEFAULT_VISION_MISSION_CONTENT);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    async function loadData() {
      try {
        const snap = await getDoc(doc(db, VISION_MISSION_CONTENT_COLLECTION, VISION_MISSION_CONTENT_DOC_ID));
        if (snap.exists()) {
          const remote = snap.data() as Partial<VisionMissionContentDoc>;
          setData({ ...DEFAULT_VISION_MISSION_CONTENT, ...remote });
        }
      } catch (err) {
        console.error('Failed to load Vision & Mission content:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const set = <K extends keyof VisionMissionContentDoc>(k: K, v: VisionMissionContentDoc[K]) => setData((p) => ({ ...p, [k]: v }));

  const handleSave = async () => {
    setSaving(true);
    try {
      await setDoc(doc(db, VISION_MISSION_CONTENT_COLLECTION, VISION_MISSION_CONTENT_DOC_ID), data);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch (err) {
      console.error('Failed to save Vision & Mission content:', err);
      alert('Failed to save changes. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    if (confirm('Reset all Vision & Mission copy to original defaults?')) setData(DEFAULT_VISION_MISSION_CONTENT);
  };

  const updateQualityItem = (idx: number, patch: Partial<QualityCommitmentItem>) => {
    const qualityItems = [...data.qualityItems];
    qualityItems[idx] = { ...qualityItems[idx], ...patch };
    set('qualityItems', qualityItems);
  };

  if (loading) {
    return <p className="admin-loading">Loading Vision & Mission Editor...</p>;
  }

  return (
    <div className="admin-section">
      <div className="admin-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '1.25rem', borderBottom: '1px solid #e5e7eb', paddingBottom: '1rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Compass size={18} color="#c8a03c" />
              <h2 className="admin-card__title" style={{ margin: 0, padding: 0, border: 'none' }}>Vision & Mission Page — Copy</h2>
            </div>
            <p className="admin-field__hint" style={{ margin: '0.35rem 0 0' }}>
              Mission points and Values cards are edited separately under Page Content Blocks ("vision-mission" /
              missionPoints &amp; values). Photos are edited under Website Photos.
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

        <h3 className="admin-card__title" style={{ fontSize: '0.95rem', marginTop: 0 }}>Vision Statement</h3>
        <textarea value={data.visionStatement} onChange={(e) => set('visionStatement', e.target.value)} className="admin-input" rows={3} style={{ width: '100%', fontFamily: 'inherit' }} />

        <h3 className="admin-card__title" style={{ fontSize: '0.95rem', marginTop: '1.25rem' }}>Mission Intro Paragraph</h3>
        <textarea value={data.missionIntro} onChange={(e) => set('missionIntro', e.target.value)} className="admin-input" rows={3} style={{ width: '100%', fontFamily: 'inherit' }} />

        <h3 className="admin-card__title" style={{ fontSize: '0.95rem', marginTop: '1.25rem' }}>"What We Stand For" Heading</h3>
        <div className="admin-form-grid">
          <div className="admin-field" style={{ gridColumn: '1 / -1' }}>
            <label>Heading</label>
            <input type="text" value={data.valuesHeading} onChange={(e) => set('valuesHeading', e.target.value)} className="admin-input" />
          </div>
          <div className="admin-field" style={{ gridColumn: '1 / -1' }}>
            <label>Description</label>
            <input type="text" value={data.valuesDesc} onChange={(e) => set('valuesDesc', e.target.value)} className="admin-input" />
          </div>
        </div>

        <h3 className="admin-card__title" style={{ fontSize: '0.95rem', marginTop: '1.25rem' }}>"Our Values in Action" Gallery</h3>
        <div className="admin-form-grid">
          <div className="admin-field" style={{ gridColumn: '1 / -1' }}>
            <label>Title</label>
            <input type="text" value={data.galleryTitle} onChange={(e) => set('galleryTitle', e.target.value)} className="admin-input" />
          </div>
          <div className="admin-field" style={{ gridColumn: '1 / -1' }}>
            <label>Subtitle</label>
            <input type="text" value={data.gallerySubtitle} onChange={(e) => set('gallerySubtitle', e.target.value)} className="admin-input" />
          </div>
          <div className="admin-field" style={{ gridColumn: '1 / -1' }}>
            <label>Highlights (one per line)</label>
            <textarea value={data.galleryHighlights.join('\n')} onChange={(e) => set('galleryHighlights', e.target.value.split('\n'))} className="admin-input" rows={4} style={{ width: '100%', fontFamily: 'inherit', resize: 'vertical' }} />
          </div>
        </div>

        <h3 className="admin-card__title" style={{ fontSize: '0.95rem', marginTop: '1.25rem' }}>Quality Policy</h3>
        <div className="admin-form-grid">
          <div className="admin-field">
            <label>Eyebrow</label>
            <input type="text" value={data.qualityEyebrow} onChange={(e) => set('qualityEyebrow', e.target.value)} className="admin-input" />
          </div>
          <div className="admin-field">
            <label>Heading</label>
            <input type="text" value={data.qualityHeading} onChange={(e) => set('qualityHeading', e.target.value)} className="admin-input" />
          </div>
          <div className="admin-field" style={{ gridColumn: '1 / -1' }}>
            <label>Paragraph</label>
            <textarea value={data.qualityParagraph} onChange={(e) => set('qualityParagraph', e.target.value)} className="admin-input" rows={2} style={{ width: '100%', fontFamily: 'inherit' }} />
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '0.6rem', marginTop: '0.5rem' }}>
          {data.qualityItems.map((item, idx) => (
            <div key={idx} style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '0.6rem' }}>
              <input type="text" value={item.title} onChange={(e) => updateQualityItem(idx, { title: e.target.value })} className="admin-input" style={{ width: '100%', marginBottom: '0.35rem', fontWeight: 600 }} placeholder="Title" />
              <textarea value={item.desc} onChange={(e) => updateQualityItem(idx, { desc: e.target.value })} className="admin-input" rows={2} style={{ width: '100%', fontFamily: 'inherit', resize: 'vertical' }} placeholder="Description" />
            </div>
          ))}
        </div>

        <h3 className="admin-card__title" style={{ fontSize: '0.95rem', marginTop: '1.25rem' }}>Closing CTA</h3>
        <div className="admin-form-grid">
          <div className="admin-field" style={{ gridColumn: '1 / -1' }}>
            <label>Heading</label>
            <input type="text" value={data.ctaHeading} onChange={(e) => set('ctaHeading', e.target.value)} className="admin-input" />
          </div>
          <div className="admin-field" style={{ gridColumn: '1 / -1' }}>
            <label>Paragraph</label>
            <textarea value={data.ctaParagraph} onChange={(e) => set('ctaParagraph', e.target.value)} className="admin-input" rows={2} style={{ width: '100%', fontFamily: 'inherit' }} />
          </div>
          <div className="admin-field">
            <label>Button Label</label>
            <input type="text" value={data.ctaButtonLabel} onChange={(e) => set('ctaButtonLabel', e.target.value)} className="admin-input" />
          </div>
        </div>
      </div>
    </div>
  );
}
