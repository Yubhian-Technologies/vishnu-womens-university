import { useState, useEffect } from 'react';
import { doc, getDoc, collection, serverTimestamp } from 'firebase/firestore';
import { setDoc, addDoc, updateDoc, deleteDoc } from '../../../lib/auditLog';
import { db } from '../../../lib/firebase';
import { useOrderedCollection } from '../../../hooks/useCollection';
import { CONTENT_ICON_NAMES, resolveContentIcon } from '../../../lib/contentIcons';
import {
  Compass,
  Save,
  RotateCcw,
  Plus,
  Edit2,
  Trash2,
  X,
  ArrowUp,
  ArrowDown,
  Layers,
  Sparkles,
  Target,
  Award,
  Trophy,
  ExternalLink,
  ShieldCheck,
} from 'lucide-react';

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

export interface ContentBlockDoc {
  id: string;
  page: string;
  section: string;
  value: string;
  title: string;
  desc: string;
  icon: string;
  slug: string;
  order: number;
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

  // Fetch content blocks real-time
  const { docs: allContentBlocks } = useOrderedCollection<ContentBlockDoc>('contentBlocks', 'order');

  // Filter mission points and core values for vision-mission page
  const missionPoints = allContentBlocks.filter(
    (b) => b.page === 'vision-mission' && b.section === 'missionPoints'
  );
  const coreValues = allContentBlocks.filter(
    (b) => b.page === 'vision-mission' && b.section === 'values'
  );

  // Inline editor state for Mission Points
  const [editingMissionId, setEditingMissionId] = useState<string | null>(null);
  const [missionFormTitle, setMissionFormTitle] = useState('');
  const [isAddingMission, setIsAddingMission] = useState(false);
  const [newMissionTitle, setNewMissionTitle] = useState('');

  // Inline editor state for Core Values
  const [editingValueId, setEditingValueId] = useState<string | null>(null);
  const [valueForm, setValueForm] = useState<{ title: string; desc: string; icon: string }>({
    title: '',
    desc: '',
    icon: 'Trophy',
  });
  const [isAddingValue, setIsAddingValue] = useState(false);
  const [newValueForm, setNewValueForm] = useState<{ title: string; desc: string; icon: string }>({
    title: '',
    desc: '',
    icon: 'Trophy',
  });

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

  const set = <K extends keyof VisionMissionContentDoc>(k: K, v: VisionMissionContentDoc[K]) =>
    setData((p) => ({ ...p, [k]: v }));

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

  const addQualityItem = () => {
    set('qualityItems', [...data.qualityItems, { title: '', desc: '' }]);
  };

  const removeQualityItem = (idx: number) => {
    set('qualityItems', data.qualityItems.filter((_, i) => i !== idx));
  };

  // --- MISSION POINTS CRUD ---
  const handleAddMissionPoint = async () => {
    if (!newMissionTitle.trim()) return alert('Mission point text is required.');
    try {
      const nextOrder = missionPoints.length > 0 ? Math.max(...missionPoints.map((m) => m.order || 0)) + 1 : 1;
      await addDoc(collection(db, 'contentBlocks'), {
        page: 'vision-mission',
        section: 'missionPoints',
        value: '',
        title: newMissionTitle.trim(),
        desc: '',
        icon: '',
        slug: '',
        order: nextOrder,
        createdAt: serverTimestamp(),
      });
      setNewMissionTitle('');
      setIsAddingMission(false);
    } catch (err) {
      alert(`Failed to add mission point: ${(err as Error).message}`);
    }
  };

  const handleSaveMissionEdit = async (id: string) => {
    if (!missionFormTitle.trim()) return alert('Mission point text is required.');
    try {
      await updateDoc(doc(db, 'contentBlocks', id), { title: missionFormTitle.trim() });
      setEditingMissionId(null);
    } catch (err) {
      alert(`Failed to update mission point: ${(err as Error).message}`);
    }
  };

  const handleDeleteMissionPoint = async (id: string) => {
    if (!confirm('Are you sure you want to delete this mission point?')) return;
    try {
      await deleteDoc(doc(db, 'contentBlocks', id));
    } catch (err) {
      alert(`Failed to delete mission point: ${(err as Error).message}`);
    }
  };

  const handleMoveMission = async (index: number, direction: 'up' | 'down') => {
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= missionPoints.length) return;
    const current = missionPoints[index];
    const target = missionPoints[targetIdx];
    try {
      await updateDoc(doc(db, 'contentBlocks', current.id), { order: target.order });
      await updateDoc(doc(db, 'contentBlocks', target.id), { order: current.order });
    } catch (err) {
      alert(`Failed to reorder: ${(err as Error).message}`);
    }
  };

  // --- CORE VALUES CRUD ---
  const handleAddCoreValue = async () => {
    if (!newValueForm.title.trim()) return alert('Value title is required.');
    try {
      const nextOrder = coreValues.length > 0 ? Math.max(...coreValues.map((v) => v.order || 0)) + 1 : 1;
      await addDoc(collection(db, 'contentBlocks'), {
        page: 'vision-mission',
        section: 'values',
        value: '',
        title: newValueForm.title.trim(),
        desc: newValueForm.desc.trim(),
        icon: newValueForm.icon || 'Trophy',
        slug: '',
        order: nextOrder,
        createdAt: serverTimestamp(),
      });
      setNewValueForm({ title: '', desc: '', icon: 'Trophy' });
      setIsAddingValue(false);
    } catch (err) {
      alert(`Failed to add core value: ${(err as Error).message}`);
    }
  };

  const handleSaveValueEdit = async (id: string) => {
    if (!valueForm.title.trim()) return alert('Value title is required.');
    try {
      await updateDoc(doc(db, 'contentBlocks', id), {
        title: valueForm.title.trim(),
        desc: valueForm.desc.trim(),
        icon: valueForm.icon || 'Trophy',
      });
      setEditingValueId(null);
    } catch (err) {
      alert(`Failed to update core value: ${(err as Error).message}`);
    }
  };

  const handleDeleteCoreValue = async (id: string) => {
    if (!confirm('Are you sure you want to delete this core value card?')) return;
    try {
      await deleteDoc(doc(db, 'contentBlocks', id));
    } catch (err) {
      alert(`Failed to delete core value: ${(err as Error).message}`);
    }
  };

  const handleMoveValue = async (index: number, direction: 'up' | 'down') => {
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= coreValues.length) return;
    const current = coreValues[index];
    const target = coreValues[targetIdx];
    try {
      await updateDoc(doc(db, 'contentBlocks', current.id), { order: target.order });
      await updateDoc(doc(db, 'contentBlocks', target.id), { order: current.order });
    } catch (err) {
      alert(`Failed to reorder: ${(err as Error).message}`);
    }
  };

  if (loading) {
    return <p className="admin-loading">Loading Vision & Mission Editor...</p>;
  }

  return (
    <div className="admin-section">
      <div className="admin-card">
        {/* Admin Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '1.25rem', borderBottom: '1px solid #e5e7eb', paddingBottom: '1rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Compass size={22} color="#c8a03c" />
              <h2 className="admin-card__title" style={{ margin: 0, padding: 0, border: 'none' }}>
                Vision &amp; Mission Page Management
              </h2>
            </div>
            <p className="admin-field__hint" style={{ margin: '0.35rem 0 0', fontSize: '0.85rem' }}>
              Manage all content and sections of the public Vision &amp; Mission page in the <strong>exact top-to-bottom order</strong> as displayed on the live website.
            </p>
          </div>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button type="button" onClick={handleReset} className="admin-btn admin-btn--sm admin-btn--ghost">
              <RotateCcw size={14} /> Reset Defaults
            </button>
            <button type="button" onClick={handleSave} disabled={saving} className="admin-btn admin-btn--sm admin-btn--primary">
              <Save size={14} /> {saving ? 'Saving...' : 'Save All Changes'}
            </button>
          </div>
        </div>

        {savedSuccess && (
          <div style={{ background: '#ecfdf5', border: '1px solid #a7f3d0', padding: '0.75rem 1rem', borderRadius: '8px', color: '#065f46', fontSize: '0.85rem', marginBottom: '1.25rem' }}>
            Saved and published live to website!
          </div>
        )}

        {/* Top Jump Bar */}
        <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '0.6rem 1rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap', fontSize: '0.82rem' }}>
          <strong style={{ color: '#475569', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <Layers size={14} /> Jump to Section (Public Page Order):
          </strong>
          <a href="#sec-vision" style={{ color: '#0284c7', textDecoration: 'none', fontWeight: 600 }}>1. Vision</a> •
          <a href="#sec-mission" style={{ color: '#0284c7', textDecoration: 'none', fontWeight: 600 }}>2. Mission</a> •
          <a href="#sec-values" style={{ color: '#0284c7', textDecoration: 'none', fontWeight: 600 }}>3. Core Values</a> •
          <a href="#sec-gallery" style={{ color: '#0284c7', textDecoration: 'none', fontWeight: 600 }}>4. Values in Action Gallery</a> •
          <a href="#sec-quality" style={{ color: '#0284c7', textDecoration: 'none', fontWeight: 600 }}>5. Quality Policy</a> •
          <a href="#sec-cta" style={{ color: '#0284c7', textDecoration: 'none', fontWeight: 600 }}>6. Closing CTA</a>
        </div>

        {/* HERO BANNER NOTE */}
        <div style={{ background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '8px', padding: '0.75rem 1rem', marginBottom: '1.5rem', fontSize: '0.83rem', color: '#1e40af', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span><strong>Hero Banner:</strong> Title &amp; subtitle banner at the top of the Vision &amp; Mission page can be updated under <em>Hero Banners (page: vision-mission)</em>.</span>
        </div>

        {/* 1. VISION SECTION */}
        <div id="sec-vision" style={{ background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '10px', padding: '1.25rem', marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem', borderBottom: '2px solid #e2e8f0', paddingBottom: '0.5rem' }}>
            <Target size={18} color="#0284c7" />
            <h3 style={{ margin: 0, fontSize: '1.05rem', color: '#0f172a' }}>1. Vision Section</h3>
          </div>
          <div className="admin-field">
            <label style={{ fontWeight: 600 }}>Vision Statement (Quote Box)</label>
            <p className="admin-field__hint">The primary vision quote shown in the large quote container on the public page.</p>
            <textarea
              value={data.visionStatement}
              onChange={(e) => set('visionStatement', e.target.value)}
              className="admin-input"
              rows={3}
              style={{ width: '100%', fontFamily: 'inherit' }}
            />
          </div>
        </div>

        {/* 2. MISSION SECTION */}
        <div id="sec-mission" style={{ background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '10px', padding: '1.25rem', marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem', marginBottom: '0.75rem', borderBottom: '2px solid #e2e8f0', paddingBottom: '0.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Compass size={18} color="#0284c7" />
              <h3 style={{ margin: 0, fontSize: '1.05rem', color: '#0f172a' }}>2. Mission Section</h3>
            </div>
            <button
              type="button"
              onClick={() => setIsAddingMission(true)}
              className="admin-btn admin-btn--sm admin-btn--primary"
            >
              <Plus size={14} /> Add Mission Point
            </button>
          </div>

          <div className="admin-field" style={{ marginBottom: '1.25rem' }}>
            <label style={{ fontWeight: 600 }}>Mission Intro Paragraph</label>
            <textarea
              value={data.missionIntro}
              onChange={(e) => set('missionIntro', e.target.value)}
              className="admin-input"
              rows={3}
              style={{ width: '100%', fontFamily: 'inherit' }}
            />
          </div>

          <h4 style={{ fontSize: '0.92rem', color: '#334155', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            Dynamic Mission Points ({missionPoints.length})
          </h4>
          <p className="admin-field__hint" style={{ marginBottom: '0.75rem' }}>
            These points appear numbered sequentially on the public Mission section. Also accessible under Page Content Blocks (Vision &amp; Mission — Mission Points).
          </p>

          {/* Add New Mission Form */}
          {isAddingMission && (
            <div style={{ background: '#f0f9ff', border: '1px solid #bae6fd', borderRadius: '8px', padding: '0.75rem', marginBottom: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <strong style={{ fontSize: '0.85rem', color: '#0369a1' }}>New Mission Point</strong>
                <button type="button" onClick={() => setIsAddingMission(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}>
                  <X size={16} />
                </button>
              </div>
              <textarea
                value={newMissionTitle}
                onChange={(e) => setNewMissionTitle(e.target.value)}
                placeholder="Enter mission point text..."
                className="admin-input"
                rows={2}
                style={{ width: '100%', marginBottom: '0.5rem', fontFamily: 'inherit' }}
              />
              <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                <button type="button" onClick={() => setIsAddingMission(false)} className="admin-btn admin-btn--sm admin-btn--ghost">Cancel</button>
                <button type="button" onClick={handleAddMissionPoint} className="admin-btn admin-btn--sm admin-btn--primary"><Plus size={14} /> Add Point</button>
              </div>
            </div>
          )}

          {/* Mission Points List */}
          {missionPoints.length === 0 ? (
            <p style={{ fontStyle: 'italic', color: '#64748b', fontSize: '0.85rem' }}>No mission points added yet. Click "Add Mission Point" above to create one.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {missionPoints.map((point, idx) => {
                const numStr = String(idx + 1).padStart(2, '0');
                const isEditing = editingMissionId === point.id;

                return (
                  <div key={point.id} style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '0.75rem', display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                    <span style={{ background: '#e0f2fe', color: '#0369a1', fontWeight: 700, fontSize: '0.8rem', padding: '0.2rem 0.5rem', borderRadius: '4px', minWidth: '32px', textAlign: 'center', marginTop: '2px' }}>
                      {numStr}
                    </span>

                    {isEditing ? (
                      <div style={{ flex: 1 }}>
                        <textarea
                          value={missionFormTitle}
                          onChange={(e) => setMissionFormTitle(e.target.value)}
                          className="admin-input"
                          rows={2}
                          style={{ width: '100%', marginBottom: '0.5rem', fontFamily: 'inherit' }}
                        />
                        <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                          <button type="button" onClick={() => setEditingMissionId(null)} className="admin-btn admin-btn--sm admin-btn--ghost">Cancel</button>
                          <button type="button" onClick={() => handleSaveMissionEdit(point.id)} className="admin-btn admin-btn--sm admin-btn--primary">Save</button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div style={{ flex: 1, fontSize: '0.9rem', color: '#1e293b', lineHeight: 1.5 }}>
                          {point.title}
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                          <button type="button" onClick={() => handleMoveMission(idx, 'up')} disabled={idx === 0} title="Move Up" className="admin-btn admin-btn--sm admin-btn--ghost" style={{ padding: '0.25rem 0.4rem' }}>
                            <ArrowUp size={13} />
                          </button>
                          <button type="button" onClick={() => handleMoveMission(idx, 'down')} disabled={idx === missionPoints.length - 1} title="Move Down" className="admin-btn admin-btn--sm admin-btn--ghost" style={{ padding: '0.25rem 0.4rem' }}>
                            <ArrowDown size={13} />
                          </button>
                          <button type="button" onClick={() => { setEditingMissionId(point.id); setMissionFormTitle(point.title); }} title="Edit" className="admin-btn admin-btn--sm admin-btn--ghost" style={{ padding: '0.25rem 0.4rem' }}>
                            <Edit2 size={13} />
                          </button>
                          <button type="button" onClick={() => handleDeleteMissionPoint(point.id)} title="Delete" className="admin-btn admin-btn--sm admin-btn--ghost" style={{ padding: '0.25rem 0.4rem', color: '#dc2626' }}>
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* 3. CORE VALUES SECTION */}
        <div id="sec-values" style={{ background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '10px', padding: '1.25rem', marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem', marginBottom: '0.75rem', borderBottom: '2px solid #e2e8f0', paddingBottom: '0.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Award size={18} color="#0284c7" />
              <h3 style={{ margin: 0, fontSize: '1.05rem', color: '#0f172a' }}>3. Core Values Section</h3>
            </div>
            <button
              type="button"
              onClick={() => setIsAddingValue(true)}
              className="admin-btn admin-btn--sm admin-btn--primary"
            >
              <Plus size={14} /> Add Core Value Card
            </button>
          </div>

          <div className="admin-form-grid" style={{ marginBottom: '1.25rem' }}>
            <div className="admin-field" style={{ gridColumn: '1 / -1' }}>
              <label style={{ fontWeight: 600 }}>Section Heading</label>
              <input
                type="text"
                value={data.valuesHeading}
                onChange={(e) => set('valuesHeading', e.target.value)}
                className="admin-input"
                placeholder="What We Stand For"
              />
            </div>
            <div className="admin-field" style={{ gridColumn: '1 / -1' }}>
              <label style={{ fontWeight: 600 }}>Section Description / Subtitle</label>
              <input
                type="text"
                value={data.valuesDesc}
                onChange={(e) => set('valuesDesc', e.target.value)}
                className="admin-input"
                placeholder="The values that guide our teaching, research and engagement."
              />
            </div>
          </div>

          <h4 style={{ fontSize: '0.92rem', color: '#334155', marginBottom: '0.5rem' }}>
            Dynamic Core Values Cards ({coreValues.length})
          </h4>
          <p className="admin-field__hint" style={{ marginBottom: '0.75rem' }}>
            These card items render in the Core Values grid with their icon, title, and description. Also accessible under Page Content Blocks (Vision &amp; Mission — Core Values).
          </p>

          {/* Add Core Value Form */}
          {isAddingValue && (
            <div style={{ background: '#f0f9ff', border: '1px solid #bae6fd', borderRadius: '8px', padding: '0.75rem', marginBottom: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <strong style={{ fontSize: '0.85rem', color: '#0369a1' }}>New Core Value Card</strong>
                <button type="button" onClick={() => setIsAddingValue(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}>
                  <X size={16} />
                </button>
              </div>
              <div className="admin-form-grid">
                <div className="admin-field">
                  <label>Icon</label>
                  <select
                    value={newValueForm.icon}
                    onChange={(e) => setNewValueForm((p) => ({ ...p, icon: e.target.value }))}
                    className="admin-input"
                  >
                    {CONTENT_ICON_NAMES.map((n) => (
                      <option key={n} value={n}>{n}</option>
                    ))}
                  </select>
                </div>
                <div className="admin-field">
                  <label>Title *</label>
                  <input
                    type="text"
                    value={newValueForm.title}
                    onChange={(e) => setNewValueForm((p) => ({ ...p, title: e.target.value }))}
                    placeholder="Value Name (e.g. Academic Excellence)"
                    className="admin-input"
                  />
                </div>
                <div className="admin-field" style={{ gridColumn: '1 / -1' }}>
                  <label>Description</label>
                  <textarea
                    value={newValueForm.desc}
                    onChange={(e) => setNewValueForm((p) => ({ ...p, desc: e.target.value }))}
                    placeholder="Description of this value..."
                    className="admin-input"
                    rows={2}
                    style={{ width: '100%', fontFamily: 'inherit' }}
                  />
                </div>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
                <button type="button" onClick={() => setIsAddingValue(false)} className="admin-btn admin-btn--sm admin-btn--ghost">Cancel</button>
                <button type="button" onClick={handleAddCoreValue} className="admin-btn admin-btn--sm admin-btn--primary"><Plus size={14} /> Add Card</button>
              </div>
            </div>
          )}

          {/* Core Values Grid */}
          {coreValues.length === 0 ? (
            <p style={{ fontStyle: 'italic', color: '#64748b', fontSize: '0.85rem' }}>No core values added yet. Click "Add Core Value Card" above to add one.</p>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '0.75rem' }}>
              {coreValues.map((v, idx) => {
                const IconComponent = resolveContentIcon(v.icon) || Trophy;
                const isEditing = editingValueId === v.id;

                return (
                  <div key={v.id} style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '0.75rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    {isEditing ? (
                      <div>
                        <div className="admin-field" style={{ marginBottom: '0.4rem' }}>
                          <label style={{ fontSize: '0.75rem' }}>Icon</label>
                          <select
                            value={valueForm.icon}
                            onChange={(e) => setValueForm((p) => ({ ...p, icon: e.target.value }))}
                            className="admin-input"
                            style={{ fontSize: '0.82rem', padding: '0.3rem' }}
                          >
                            {CONTENT_ICON_NAMES.map((n) => (
                              <option key={n} value={n}>{n}</option>
                            ))}
                          </select>
                        </div>
                        <div className="admin-field" style={{ marginBottom: '0.4rem' }}>
                          <label style={{ fontSize: '0.75rem' }}>Title</label>
                          <input
                            type="text"
                            value={valueForm.title}
                            onChange={(e) => setValueForm((p) => ({ ...p, title: e.target.value }))}
                            className="admin-input"
                            style={{ fontSize: '0.85rem' }}
                          />
                        </div>
                        <div className="admin-field" style={{ marginBottom: '0.5rem' }}>
                          <label style={{ fontSize: '0.75rem' }}>Description</label>
                          <textarea
                            value={valueForm.desc}
                            onChange={(e) => setValueForm((p) => ({ ...p, desc: e.target.value }))}
                            className="admin-input"
                            rows={2}
                            style={{ width: '100%', fontFamily: 'inherit', fontSize: '0.82rem' }}
                          />
                        </div>
                        <div style={{ display: 'flex', gap: '0.4rem', justifyContent: 'flex-end' }}>
                          <button type="button" onClick={() => setEditingValueId(null)} className="admin-btn admin-btn--sm admin-btn--ghost">Cancel</button>
                          <button type="button" onClick={() => handleSaveValueEdit(v.id)} className="admin-btn admin-btn--sm admin-btn--primary">Save</button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                              <div style={{ background: '#fef3c7', padding: '0.35rem', borderRadius: '6px', color: '#b45309', display: 'flex' }}>
                                <IconComponent size={18} />
                              </div>
                              <strong style={{ fontSize: '0.9rem', color: '#0f172a' }}>{v.title}</strong>
                            </div>
                            <span style={{ fontSize: '0.72rem', color: '#94a3b8', background: '#e2e8f0', padding: '0.1rem 0.35rem', borderRadius: '4px' }}>
                              #{idx + 1}
                            </span>
                          </div>
                          <p style={{ fontSize: '0.82rem', color: '#475569', margin: '0.25rem 0 0.75rem', lineHeight: 1.45 }}>
                            {v.desc || <span style={{ fontStyle: 'italic', color: '#94a3b8' }}>No description</span>}
                          </p>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '0.25rem', borderTop: '1px solid #f1f5f9', paddingTop: '0.4rem' }}>
                          <button type="button" onClick={() => handleMoveValue(idx, 'up')} disabled={idx === 0} title="Move Up" className="admin-btn admin-btn--sm admin-btn--ghost" style={{ padding: '0.2rem 0.4rem' }}>
                            <ArrowUp size={12} />
                          </button>
                          <button type="button" onClick={() => handleMoveValue(idx, 'down')} disabled={idx === coreValues.length - 1} title="Move Down" className="admin-btn admin-btn--sm admin-btn--ghost" style={{ padding: '0.2rem 0.4rem' }}>
                            <ArrowDown size={12} />
                          </button>
                          <button type="button" onClick={() => { setEditingValueId(v.id); setValueForm({ title: v.title, desc: v.desc || '', icon: v.icon || 'Trophy' }); }} title="Edit" className="admin-btn admin-btn--sm admin-btn--ghost" style={{ padding: '0.2rem 0.4rem' }}>
                            <Edit2 size={12} />
                          </button>
                          <button type="button" onClick={() => handleDeleteCoreValue(v.id)} title="Delete" className="admin-btn admin-btn--sm admin-btn--ghost" style={{ padding: '0.2rem 0.4rem', color: '#dc2626' }}>
                            <Trash2 size={12} />
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* 4. VALUES IN ACTION / CAMPUS GALLERY SECTION */}
        <div id="sec-gallery" style={{ background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '10px', padding: '1.25rem', marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem', borderBottom: '2px solid #e2e8f0', paddingBottom: '0.5rem' }}>
            <Sparkles size={18} color="#0284c7" />
            <h3 style={{ margin: 0, fontSize: '1.05rem', color: '#0f172a' }}>4. "Our Values in Action" Gallery Copy</h3>
          </div>
          <p className="admin-field__hint" style={{ marginBottom: '1rem' }}>
            Configures the heading and highlight points displayed next to the campus photo grid. Photos themselves can be managed under <em>Website Photos (page: vision-mission, section: main)</em>.
          </p>

          <div className="admin-form-grid">
            <div className="admin-field" style={{ gridColumn: '1 / -1' }}>
              <label style={{ fontWeight: 600 }}>Gallery Section Title</label>
              <input
                type="text"
                value={data.galleryTitle}
                onChange={(e) => set('galleryTitle', e.target.value)}
                className="admin-input"
                placeholder="Where Purpose Meets Practice"
              />
            </div>
            <div className="admin-field" style={{ gridColumn: '1 / -1' }}>
              <label style={{ fontWeight: 600 }}>Gallery Subtitle</label>
              <input
                type="text"
                value={data.gallerySubtitle}
                onChange={(e) => set('gallerySubtitle', e.target.value)}
                className="admin-input"
              />
            </div>
            <div className="admin-field" style={{ gridColumn: '1 / -1' }}>
              <label style={{ fontWeight: 600 }}>Gallery Highlights (One point per line)</label>
              <textarea
                value={data.galleryHighlights.join('\n')}
                onChange={(e) => set('galleryHighlights', e.target.value.split('\n'))}
                className="admin-input"
                rows={4}
                style={{ width: '100%', fontFamily: 'inherit', resize: 'vertical' }}
              />
            </div>
          </div>
        </div>

        {/* 5. QUALITY POLICY SECTION */}
        <div id="sec-quality" style={{ background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '10px', padding: '1.25rem', marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem', marginBottom: '0.75rem', borderBottom: '2px solid #e2e8f0', paddingBottom: '0.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <ShieldCheck size={18} color="#0284c7" />
              <h3 style={{ margin: 0, fontSize: '1.05rem', color: '#0f172a' }}>5. Quality Policy Section</h3>
            </div>
            <button
              type="button"
              onClick={addQualityItem}
              className="admin-btn admin-btn--sm admin-btn--ghost"
            >
              <Plus size={14} /> Add Policy Item
            </button>
          </div>

          <div className="admin-form-grid" style={{ marginBottom: '1rem' }}>
            <div className="admin-field">
              <label style={{ fontWeight: 600 }}>Eyebrow Text</label>
              <input
                type="text"
                value={data.qualityEyebrow}
                onChange={(e) => set('qualityEyebrow', e.target.value)}
                className="admin-input"
                placeholder="QUALITY COMMITMENT"
              />
            </div>
            <div className="admin-field">
              <label style={{ fontWeight: 600 }}>Section Heading</label>
              <input
                type="text"
                value={data.qualityHeading}
                onChange={(e) => set('qualityHeading', e.target.value)}
                className="admin-input"
                placeholder="Quality Policy"
              />
            </div>
            <div className="admin-field" style={{ gridColumn: '1 / -1' }}>
              <label style={{ fontWeight: 600 }}>Introductory Paragraph</label>
              <textarea
                value={data.qualityParagraph}
                onChange={(e) => set('qualityParagraph', e.target.value)}
                className="admin-input"
                rows={2}
                style={{ width: '100%', fontFamily: 'inherit' }}
              />
            </div>
          </div>

          <h4 style={{ fontSize: '0.92rem', color: '#334155', marginBottom: '0.5rem' }}>
            Quality Policy Commitment Points ({data.qualityItems.length})
          </h4>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '0.6rem' }}>
            {data.qualityItems.map((item, idx) => (
              <div key={idx} style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '0.6rem', position: 'relative' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748b' }}>Point #{idx + 1}</span>
                  <button
                    type="button"
                    onClick={() => removeQualityItem(idx)}
                    style={{ background: 'none', border: 'none', color: '#dc2626', cursor: 'pointer', padding: 0 }}
                    title="Remove item"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
                <input
                  type="text"
                  value={item.title}
                  onChange={(e) => updateQualityItem(idx, { title: e.target.value })}
                  className="admin-input"
                  style={{ width: '100%', marginBottom: '0.35rem', fontWeight: 600 }}
                  placeholder="Title (e.g. Academic Quality)"
                />
                <textarea
                  value={item.desc}
                  onChange={(e) => updateQualityItem(idx, { desc: e.target.value })}
                  className="admin-input"
                  rows={2}
                  style={{ width: '100%', fontFamily: 'inherit', resize: 'vertical' }}
                  placeholder="Description..."
                />
              </div>
            ))}
          </div>
        </div>

        {/* 6. CLOSING CTA SECTION */}
        <div id="sec-cta" style={{ background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '10px', padding: '1.25rem', marginBottom: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem', borderBottom: '2px solid #e2e8f0', paddingBottom: '0.5rem' }}>
            <ExternalLink size={18} color="#0284c7" />
            <h3 style={{ margin: 0, fontSize: '1.05rem', color: '#0f172a' }}>6. Closing Call-To-Action (CTA)</h3>
          </div>

          <div className="admin-form-grid">
            <div className="admin-field" style={{ gridColumn: '1 / -1' }}>
              <label style={{ fontWeight: 600 }}>CTA Heading</label>
              <input
                type="text"
                value={data.ctaHeading}
                onChange={(e) => set('ctaHeading', e.target.value)}
                className="admin-input"
              />
            </div>
            <div className="admin-field" style={{ gridColumn: '1 / -1' }}>
              <label style={{ fontWeight: 600 }}>CTA Paragraph</label>
              <textarea
                value={data.ctaParagraph}
                onChange={(e) => set('ctaParagraph', e.target.value)}
                className="admin-input"
                rows={2}
                style={{ width: '100%', fontFamily: 'inherit' }}
              />
            </div>
            <div className="admin-field">
              <label style={{ fontWeight: 600 }}>Button Label</label>
              <input
                type="text"
                value={data.ctaButtonLabel}
                onChange={(e) => set('ctaButtonLabel', e.target.value)}
                className="admin-input"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

