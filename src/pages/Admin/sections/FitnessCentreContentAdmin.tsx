import { useState, useEffect } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { setDoc } from '../../../lib/auditLog';
import { db } from '../../../lib/firebase';
import { Save, RotateCcw, Dumbbell } from 'lucide-react';

export interface FitnessGlanceItem {
  title: string;
  desc: string;
}

export interface FitnessCentreContentDoc {
  heroTitle: string;
  heroSubtitle: string;
  glanceHeading: string;
  glanceItems: FitnessGlanceItem[]; // fixed 4 items
  activeCampusHeading: string;
  activeCampusParagraphs: string[];
  moreThanWorkoutHeading: string;
  moreThanWorkoutParagraphs: string[];
  galleryTag: string;
  galleryHeading: string;
  galleryParagraph: string;
  exploreHeading: string;
  exploreParagraph: string;
}

// Mirrors the hardcoded copy FitnessCentre.tsx shipped with before this
// admin editor existed, so the public page renders identically until an
// admin saves a change.
export const DEFAULT_FITNESS_CENTRE_CONTENT: FitnessCentreContentDoc = {
  heroTitle: 'Vishnu Fitness Centre',
  heroSubtitle: "Supporting fitness, wellness and an active lifestyle at Vishnu Women’s University.",
  glanceHeading: 'Fitness & Wellness at a Glance',
  glanceItems: [
    { title: 'Modern Fitness Equipment', desc: 'Training equipment for strength, cardio and general fitness.' },
    { title: 'Trained Instructors', desc: 'Guidance and supervision to support safe and effective workouts.' },
    { title: 'Sports & Competitive Fitness', desc: 'Facilities that complement students’ participation in inter-collegiate, inter-university and state-level competitions.' },
    { title: 'Yoga & Wellness', desc: 'Yoga and wellness activities that support flexibility, balance and overall well-being.' },
  ],
  activeCampusHeading: 'Fitness for an Active Campus Life',
  activeCampusParagraphs: [
    'The Vishnu Fitness Centre provides students with a dedicated space to stay active, build physical fitness and make wellness part of everyday campus life.',
    'Equipped with modern training facilities and supported by trained instructors, the centre caters to different fitness needs while complementing the University’s wider sports and wellness initiatives.',
  ],
  moreThanWorkoutHeading: 'More Than a Workout',
  moreThanWorkoutParagraphs: [
    'Regular physical activity supports endurance, strength and overall well-being. Along with fitness training, students can participate in yoga and wellness activities, creating opportunities to balance physical activity with relaxation and mental well-being.',
    'The fitness environment also supports students involved in competitive sports, including participation in inter-collegiate, inter-university and state-level events.',
  ],
  galleryTag: 'FACILITY GALLERY',
  galleryHeading: 'Inside the Vishnu Fitness Centre',
  galleryParagraph: 'Explore the equipment, training spaces and fitness activities available to students at Vishnu Women’s University.',
  exploreHeading: 'Explore More of Campus Life',
  exploreParagraph: 'Discover more opportunities to stay active, connected and well at Vishnu Women’s University.',
};

export const FITNESS_CENTRE_CONTENT_COLLECTION = 'settings';
export const FITNESS_CENTRE_CONTENT_DOC_ID = 'fitnessCentreContent';

function TextField({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div className="admin-field" style={{ gridColumn: '1 / -1' }}>
      <label>{label}</label>
      <input type="text" value={value} onChange={(e) => onChange(e.target.value)} className="admin-input" />
    </div>
  );
}

function ParagraphsField({ label, value, onChange }: { label: string; value: string[]; onChange: (v: string[]) => void }) {
  return (
    <div className="admin-field" style={{ gridColumn: '1 / -1' }}>
      <label>{label} (one paragraph per line)</label>
      <textarea value={value.join('\n')} onChange={(e) => onChange(e.target.value.split('\n'))} className="admin-input" rows={3} style={{ width: '100%', fontFamily: 'inherit', resize: 'vertical' }} />
    </div>
  );
}

export default function FitnessCentreContentAdmin() {
  const [data, setData] = useState<FitnessCentreContentDoc>(DEFAULT_FITNESS_CENTRE_CONTENT);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    async function loadData() {
      try {
        const snap = await getDoc(doc(db, FITNESS_CENTRE_CONTENT_COLLECTION, FITNESS_CENTRE_CONTENT_DOC_ID));
        if (snap.exists()) {
          const remote = snap.data() as Partial<FitnessCentreContentDoc>;
          setData({ ...DEFAULT_FITNESS_CENTRE_CONTENT, ...remote });
        }
      } catch (err) {
        console.error('Failed to load Fitness Centre content:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const set = <K extends keyof FitnessCentreContentDoc>(k: K, v: FitnessCentreContentDoc[K]) => setData((p) => ({ ...p, [k]: v }));

  const updateGlanceItem = (idx: number, patch: Partial<FitnessGlanceItem>) => {
    const glanceItems = [...data.glanceItems];
    glanceItems[idx] = { ...glanceItems[idx], ...patch };
    set('glanceItems', glanceItems);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await setDoc(doc(db, FITNESS_CENTRE_CONTENT_COLLECTION, FITNESS_CENTRE_CONTENT_DOC_ID), data);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch (err) {
      console.error('Failed to save Fitness Centre content:', err);
      alert('Failed to save changes. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    if (confirm('Reset all Fitness Centre copy to original defaults?')) setData(DEFAULT_FITNESS_CENTRE_CONTENT);
  };

  if (loading) {
    return <p className="admin-loading">Loading Fitness Centre Editor...</p>;
  }

  return (
    <div className="admin-section">
      <div className="admin-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '1.25rem', borderBottom: '1px solid #e5e7eb', paddingBottom: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Dumbbell size={18} color="#c8a03c" />
            <h2 className="admin-card__title" style={{ margin: 0, padding: 0, border: 'none' }}>Fitness Centre — Copy</h2>
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

        <h3 className="admin-card__title" style={{ fontSize: '0.95rem', marginTop: 0 }}>Hero</h3>
        <div className="admin-form-grid">
          <TextField label="Title" value={data.heroTitle} onChange={(v) => set('heroTitle', v)} />
          <TextField label="Subtitle" value={data.heroSubtitle} onChange={(v) => set('heroSubtitle', v)} />
        </div>

        <h3 className="admin-card__title" style={{ fontSize: '0.95rem', marginTop: '1.25rem' }}>"Fitness & Wellness at a Glance"</h3>
        <div className="admin-form-grid">
          <TextField label="Heading" value={data.glanceHeading} onChange={(v) => set('glanceHeading', v)} />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '0.6rem', marginTop: '0.4rem' }}>
          {data.glanceItems.map((item, idx) => (
            <div key={idx} style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '0.6rem' }}>
              <input type="text" value={item.title} onChange={(e) => updateGlanceItem(idx, { title: e.target.value })} className="admin-input" style={{ width: '100%', marginBottom: '0.35rem', fontWeight: 600 }} placeholder="Title" />
              <textarea value={item.desc} onChange={(e) => updateGlanceItem(idx, { desc: e.target.value })} className="admin-input" rows={2} style={{ width: '100%', fontFamily: 'inherit', resize: 'vertical' }} placeholder="Description" />
            </div>
          ))}
        </div>

        <h3 className="admin-card__title" style={{ fontSize: '0.95rem', marginTop: '1.25rem' }}>"Fitness for an Active Campus Life"</h3>
        <div className="admin-form-grid">
          <TextField label="Heading" value={data.activeCampusHeading} onChange={(v) => set('activeCampusHeading', v)} />
          <ParagraphsField label="Paragraphs" value={data.activeCampusParagraphs} onChange={(v) => set('activeCampusParagraphs', v)} />
        </div>

        <h3 className="admin-card__title" style={{ fontSize: '0.95rem', marginTop: '1.25rem' }}>"More Than a Workout"</h3>
        <div className="admin-form-grid">
          <TextField label="Heading" value={data.moreThanWorkoutHeading} onChange={(v) => set('moreThanWorkoutHeading', v)} />
          <ParagraphsField label="Paragraphs" value={data.moreThanWorkoutParagraphs} onChange={(v) => set('moreThanWorkoutParagraphs', v)} />
        </div>

        <h3 className="admin-card__title" style={{ fontSize: '0.95rem', marginTop: '1.25rem' }}>Gallery Caption</h3>
        <div className="admin-form-grid">
          <TextField label="Tag" value={data.galleryTag} onChange={(v) => set('galleryTag', v)} />
          <TextField label="Heading" value={data.galleryHeading} onChange={(v) => set('galleryHeading', v)} />
          <TextField label="Paragraph" value={data.galleryParagraph} onChange={(v) => set('galleryParagraph', v)} />
        </div>

        <h3 className="admin-card__title" style={{ fontSize: '0.95rem', marginTop: '1.25rem' }}>"Explore More of Campus Life" Band</h3>
        <div className="admin-form-grid">
          <TextField label="Heading" value={data.exploreHeading} onChange={(v) => set('exploreHeading', v)} />
          <TextField label="Paragraph" value={data.exploreParagraph} onChange={(v) => set('exploreParagraph', v)} />
        </div>
      </div>
    </div>
  );
}
