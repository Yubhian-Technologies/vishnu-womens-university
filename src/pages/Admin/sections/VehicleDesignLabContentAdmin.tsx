import { useState, useEffect } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { setDoc, updateDoc } from '../../../lib/auditLog';
import { db } from '../../../lib/firebase';
import { vehicleDesignLab } from '../../Differentiators/vehicleDesignLab.data';
import {
  Plus,
  Trash2,
  Save,
  RotateCcw,
  Check,
  Wrench,
  Target,
  Users,
  Layers,
  Zap,
  Building2,
  Award,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';
import CustomSectionEditor from './CustomSectionEditor';
import VdlTeamAdmin from './VdlTeamAdmin';
import VdlAchievementsAdmin from './VdlAchievementsAdmin';
import { replaceAtPath, getAtPath, type CustomSection } from '../../../lib/customSections';
import { deleteFile, type UploadResult } from '../../../lib/storage';

export type VehicleDesignLabDoc = typeof vehicleDesignLab & {
  customSections?: CustomSection[];
};

export default function VehicleDesignLabContentAdmin() {
  const [data, setData] = useState<VehicleDesignLabDoc>({
    ...vehicleDesignLab,
    customSections: [],
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    async function loadData() {
      try {
        const snap = await getDoc(doc(db, 'settings', 'vehicleDesignLab'));
        if (snap.exists()) {
          const remote = snap.data() as Partial<VehicleDesignLabDoc>;
          setData({
            ...vehicleDesignLab,
            ...remote,
            paragraphs: remote.paragraphs || vehicleDesignLab.paragraphs,
            fundamentals: remote.fundamentals || vehicleDesignLab.fundamentals,
            vision: remote.vision || vehicleDesignLab.vision,
            mission: remote.mission || vehicleDesignLab.mission,
            objectives: remote.objectives || vehicleDesignLab.objectives,
            facilities: {
              ...vehicleDesignLab.facilities,
              ...(remote.facilities || {}),
              activitiesPrograms: remote.facilities?.activitiesPrograms || vehicleDesignLab.facilities.activitiesPrograms,
              campusUtilityProjects: remote.facilities?.campusUtilityProjects || vehicleDesignLab.facilities.campusUtilityProjects,
            },
            industryCollaborations: {
              ...vehicleDesignLab.industryCollaborations,
              ...(remote.industryCollaborations || {}),
              endowments: remote.industryCollaborations?.endowments || vehicleDesignLab.industryCollaborations.endowments,
            },
            studentsAchievements: {
              ...vehicleDesignLab.studentsAchievements,
              ...(remote.studentsAchievements || {}),
              competitions: remote.studentsAchievements?.competitions || vehicleDesignLab.studentsAchievements.competitions,
              placementsParagraphs: remote.studentsAchievements?.placementsParagraphs || vehicleDesignLab.studentsAchievements.placementsParagraphs,
            },
            outcomes: remote.outcomes || vehicleDesignLab.outcomes,
            customSections: remote.customSections || [],
          });
        }
      } catch (err) {
        console.error('Failed to load Vehicle Design Lab data:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      await setDoc(doc(db, 'settings', 'vehicleDesignLab'), data);
      try {
        await updateDoc(doc(db, 'differentiators', 'vehicle-design-lab'), {
          customSections: data.customSections || [],
        });
      } catch (e) {
        // Ignored if differentiator document key doesn't exist
      }
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      console.error('Failed to save Vehicle Design Lab data:', err);
      alert('Failed to save changes. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    if (confirm('Reset all Vehicle Design Lab content to original defaults?')) {
      setData({
        ...vehicleDesignLab,
        customSections: [],
      });
    }
  };

  // Upload handlers for Custom Sections
  const handleCustomSectionFileUploaded = (sectionPath: number[], fileIndex: number, r: UploadResult) => {
    setData((p) => ({
      ...p,
      customSections: replaceAtPath(p.customSections || [], sectionPath, (s) => ({
        ...s,
        files: (s.files || []).map((f, i) => (i === fileIndex ? { ...f, fileUrl: r.url, storagePath: r.path } : f)),
      })),
    }));
  };

  const handleCustomSectionFileRemoved = async (sectionPath: number[], fileIndex: number) => {
    const file = getAtPath(data.customSections || [], sectionPath)?.files?.[fileIndex];
    if (!file) return;
    if (file.fileUrl && !confirm('Remove this file? This cannot be undone.')) return;
    try {
      if (file.storagePath) await deleteFile(file.storagePath);
    } catch (e) {
      alert(`Couldn't delete the file from storage: ${(e as Error).message}`);
      return;
    }
    setData((p) => ({
      ...p,
      customSections: replaceAtPath(p.customSections || [], sectionPath, (s) => ({
        ...s,
        files: (s.files || []).filter((_, i) => i !== fileIndex),
      })),
    }));
  };

  const handleCustomSectionPhotoUploaded = (sectionPath: number[], r: UploadResult) => {
    setData((p) => ({
      ...p,
      customSections: replaceAtPath(p.customSections || [], sectionPath, (s) => ({
        ...s,
        photo: { imageUrl: r.url, storagePath: r.path },
      })),
    }));
  };

  const handleCustomSectionPhotoRemoved = async (sectionPath: number[]) => {
    const photo = getAtPath(data.customSections || [], sectionPath)?.photo;
    if (!photo?.imageUrl) return;
    if (!confirm('Remove this photo? This cannot be undone.')) return;
    try {
      if (photo.storagePath) await deleteFile(photo.storagePath);
    } catch (e) {
      alert(`Couldn't delete the photo from storage: ${(e as Error).message}`);
      return;
    }
    setData((p) => ({
      ...p,
      customSections: replaceAtPath(p.customSections || [], sectionPath, (s) => {
        const next = { ...s };
        delete next.photo;
        return next;
      }),
    }));
  };

  const handleCustomSectionGalleryPhotoUploaded = (sectionPath: number[], photoIndex: number, r: UploadResult) => {
    setData((p) => ({
      ...p,
      customSections: replaceAtPath(p.customSections || [], sectionPath, (s) => ({
        ...s,
        galleryPhotos: (s.galleryPhotos || []).map((ph, i) => (i === photoIndex ? { imageUrl: r.url, storagePath: r.path } : ph)),
      })),
    }));
  };

  const handleCustomSectionGalleryPhotoRemoved = async (sectionPath: number[], photoIndex: number) => {
    const photo = getAtPath(data.customSections || [], sectionPath)?.galleryPhotos?.[photoIndex];
    if (!photo) return;
    if (photo.imageUrl && !confirm('Remove this photo? This cannot be undone.')) return;
    try {
      if (photo.storagePath) await deleteFile(photo.storagePath);
    } catch (e) {
      alert(`Couldn't delete the photo from storage: ${(e as Error).message}`);
      return;
    }
    setData((p) => ({
      ...p,
      customSections: replaceAtPath(p.customSections || [], sectionPath, (s) => ({
        ...s,
        galleryPhotos: (s.galleryPhotos || []).filter((_, i) => i !== photoIndex),
      })),
    }));
  };

  if (loading) {
    return (
      <div className="admin-card" style={{ textAlign: 'center', padding: '2rem', color: '#64748b' }}>
        Loading Vehicle Design Lab Content Editor...
      </div>
    );
  }

  return (
    <div className="admin-section" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {/* Sticky Header Bar */}
      <div className="admin-card" style={{ position: 'sticky', top: '0.5rem', zIndex: 20, boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div
              style={{
                display: 'inline-block',
                padding: '0.2rem 0.6rem',
                borderRadius: '4px',
                background: '#fee2e2',
                color: '#b91c1c',
                fontSize: '0.75rem',
                fontWeight: 700,
                textTransform: 'uppercase',
                marginBottom: '0.35rem',
              }}
            >
              Unified Differentiator Page Editor
            </div>
            <h2 style={{ margin: 0, fontSize: '1.4rem', fontWeight: 700, color: '#0f172a' }}>Vehicle Design Lab (VDL)</h2>
            <p style={{ margin: '0.25rem 0 0', fontSize: '0.85rem', color: '#64748b' }}>
              Single unified page editor in <strong>exact top-to-bottom layout order</strong> as displayed on the live public site.
            </p>
          </div>
          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
            <button
              type="button"
              onClick={handleReset}
              className="admin-btn admin-btn--secondary"
              style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem' }}
            >
              <RotateCcw size={14} /> Reset Defaults
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={saving}
              className="admin-btn admin-btn--primary"
              style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem' }}
            >
              {saving ? (
                <span>Saving...</span>
              ) : saved ? (
                <>
                  <Check size={16} /> Saved!
                </>
              ) : (
                <>
                  <Save size={16} /> Save All Changes
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* SECTION 1: HERO OVERVIEW & FUNDAMENTALS */}
      <div className="admin-card" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        <div style={{ borderBottom: '2px solid #ea580c', paddingBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Wrench size={18} color="#ea580c" />
          <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 700, color: '#0f172a' }}>
            1. Overview Paragraphs & Vehicle Fundamentals Chips
          </h3>
        </div>

        {/* Overview Paragraphs */}
        <div className="admin-field">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <label className="admin-label" style={{ margin: 0 }}>Overview Paragraphs</label>
            <button
              type="button"
              onClick={() => setData({ ...data, paragraphs: [...data.paragraphs, ''] })}
              className="admin-btn admin-btn--secondary"
              style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.8rem', padding: '0.35rem 0.75rem' }}
            >
              <Plus size={14} /> Add Paragraph
            </button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {data.paragraphs.map((p, idx) => (
              <div key={idx} style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-start' }}>
                <textarea
                  rows={3}
                  value={p}
                  onChange={(e) => {
                    const updated = [...data.paragraphs];
                    updated[idx] = e.target.value;
                    setData({ ...data, paragraphs: updated });
                  }}
                  className="admin-textarea"
                  style={{ flex: 1 }}
                />
                <button
                  type="button"
                  onClick={() => setData({ ...data, paragraphs: data.paragraphs.filter((_, i) => i !== idx) })}
                  className="admin-btn-danger"
                  style={{ padding: '0.6rem 0.75rem' }}
                  title="Remove paragraph"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Vehicle Fundamentals */}
        <div style={{ paddingTop: '1rem', borderTop: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <label className="admin-label" style={{ margin: 0 }}>Fundamentals Learned Chips</label>
            <button
              type="button"
              onClick={() => setData({ ...data, fundamentals: [...data.fundamentals, ''] })}
              className="admin-btn admin-btn--secondary"
              style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.8rem', padding: '0.35rem 0.75rem' }}
            >
              <Plus size={14} /> Add Fundamental Chip
            </button>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '0.5rem' }}>
            {data.fundamentals.map((f, idx) => (
              <div key={idx} style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                <input
                  type="text"
                  value={f}
                  onChange={(e) => {
                    const updated = [...data.fundamentals];
                    updated[idx] = e.target.value;
                    setData({ ...data, fundamentals: updated });
                  }}
                  className="admin-input"
                  style={{ flex: 1 }}
                />
                <button
                  type="button"
                  onClick={() => setData({ ...data, fundamentals: data.fundamentals.filter((_, i) => i !== idx) })}
                  className="admin-btn-danger"
                  style={{ padding: '0.5rem 0.65rem' }}
                  title="Remove fundamental"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* SECTION 2: VISION, MISSION & OBJECTIVES */}
      <div className="admin-card" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        <div style={{ borderBottom: '2px solid #ea580c', paddingBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Target size={18} color="#ea580c" />
          <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 700, color: '#0f172a' }}>
            2. Engineering Directives & Blueprint (Vision, Mission & Objectives)
          </h3>
        </div>

        <div className="admin-field">
          <label className="admin-label">Vision Statement</label>
          <textarea
            rows={3}
            value={data.vision}
            onChange={(e) => setData({ ...data, vision: e.target.value })}
            className="admin-textarea"
          />
        </div>

        <div className="admin-field">
          <label className="admin-label">Mission Statement</label>
          <textarea
            rows={3}
            value={data.mission}
            onChange={(e) => setData({ ...data, mission: e.target.value })}
            className="admin-textarea"
          />
        </div>

        {/* Objectives */}
        <div style={{ paddingTop: '1rem', borderTop: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <label className="admin-label" style={{ margin: 0 }}>Lab Objectives</label>
            <button
              type="button"
              onClick={() =>
                setData({
                  ...data,
                  objectives: [...data.objectives, { lead: 'New Objective:', text: ' Description here.' }],
                })
              }
              className="admin-btn admin-btn--secondary"
              style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.8rem', padding: '0.35rem 0.75rem' }}
            >
              <Plus size={14} /> Add Objective
            </button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {data.objectives.map((obj, idx) => (
              <div key={idx} style={{ padding: '1rem', border: '1px solid #e2e8f0', borderRadius: '8px', background: '#f8fafc', display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <input
                    type="text"
                    placeholder="Lead (e.g. Hands-on Learning:)"
                    value={obj.lead}
                    onChange={(e) => {
                      const updated = [...data.objectives];
                      updated[idx] = { ...updated[idx], lead: e.target.value };
                      setData({ ...data, objectives: updated });
                    }}
                    className="admin-input"
                    style={{ fontWeight: 700 }}
                  />
                  <textarea
                    rows={2}
                    placeholder="Details"
                    value={obj.text}
                    onChange={(e) => {
                      const updated = [...data.objectives];
                      updated[idx] = { ...updated[idx], text: e.target.value };
                      setData({ ...data, objectives: updated });
                    }}
                    className="admin-textarea"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => setData({ ...data, objectives: data.objectives.filter((_, i) => i !== idx) })}
                  className="admin-btn-danger"
                  style={{ padding: '0.55rem 0.65rem' }}
                  title="Remove objective"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* SECTION 3: FACULTY IN-CHARGE & GARAGE MENTORS */}
      <div className="admin-card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div style={{ borderBottom: '2px solid #ea580c', paddingBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Users size={18} color="#ea580c" />
          <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 700, color: '#0f172a' }}>
            3. Faculty In-Charge & Garage Mentors
          </h3>
        </div>
        <p className="admin-field__hint" style={{ margin: 0 }}>
          Manage Head of Lab and Faculty Team Members. Changes here update the team roster on the public Vehicle Design Lab page.
        </p>
        <div style={{ border: '1px solid #e2e8f0', borderRadius: '8px', padding: '0.5rem', background: '#fafafa' }}>
          <VdlTeamAdmin />
        </div>
      </div>

      {/* SECTION 4: LAB FACILITIES & FABRICATION PHASES */}
      <div className="admin-card" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        <div style={{ borderBottom: '2px solid #ea580c', paddingBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Layers size={18} color="#ea580c" />
          <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 700, color: '#0f172a' }}>
            4. Lab Facilities & Vehicle Fabrication Phases
          </h3>
        </div>

        <div className="admin-field">
          <label className="admin-label">Facilities Overview Paragraph</label>
          <textarea
            rows={3}
            value={data.facilities?.overview || ''}
            onChange={(e) =>
              setData({
                ...data,
                facilities: { ...data.facilities, overview: e.target.value },
              })
            }
            className="admin-textarea"
          />
        </div>

        {/* Facility Phases */}
        <div style={{ paddingTop: '1rem', borderTop: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h4 style={{ margin: 0, fontSize: '1rem', fontWeight: 600, color: '#0f172a' }}>Vehicle Fabrication Phases</h4>
            <button
              type="button"
              onClick={() =>
                setData({
                  ...data,
                  facilities: {
                    ...data.facilities,
                    activitiesPrograms: [
                      ...(data.facilities?.activitiesPrograms || []),
                      { title: 'New Phase', paragraph: 'Description', mediaType: 'photo' },
                    ],
                  },
                })
              }
              className="admin-btn admin-btn--secondary"
              style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.85rem' }}
            >
              <Plus size={14} /> Add Fabrication Phase
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {(data.facilities?.activitiesPrograms || []).map((phase, idx) => (
              <div key={idx} style={{ padding: '1rem', border: '1px solid #e2e8f0', borderRadius: '8px', background: '#f8fafc', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <input
                    type="text"
                    value={phase.title}
                    onChange={(e) => {
                      const updated = [...(data.facilities?.activitiesPrograms || [])];
                      updated[idx] = { ...updated[idx], title: e.target.value };
                      setData({ ...data, facilities: { ...data.facilities, activitiesPrograms: updated } });
                    }}
                    className="admin-input"
                    style={{ fontWeight: 700, width: '280px' }}
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const updated = (data.facilities?.activitiesPrograms || []).filter((_, i) => i !== idx);
                      setData({ ...data, facilities: { ...data.facilities, activitiesPrograms: updated } });
                    }}
                    className="admin-btn-danger"
                    style={{ padding: '0.35rem 0.5rem' }}
                    title="Remove phase"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
                <textarea
                  rows={2}
                  value={phase.paragraph}
                  onChange={(e) => {
                    const updated = [...(data.facilities?.activitiesPrograms || [])];
                    updated[idx] = { ...updated[idx], paragraph: e.target.value };
                    setData({ ...data, facilities: { ...data.facilities, activitiesPrograms: updated } });
                  }}
                  className="admin-textarea"
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* SECTION 5: CAMPUS UTILITY VEHICLES & EV PROJECTS */}
      <div className="admin-card" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        <div style={{ borderBottom: '2px solid #ea580c', paddingBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Zap size={18} color="#ea580c" />
          <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 700, color: '#0f172a' }}>
            5. Campus Utility Vehicles & EV Projects
          </h3>
        </div>

        <div className="admin-field">
          <label className="admin-label">Campus Utility Intro Paragraph</label>
          <textarea
            rows={2}
            value={data.facilities?.campusUtilityIntro || ''}
            onChange={(e) =>
              setData({
                ...data,
                facilities: {
                  ...data.facilities,
                  campusUtilityIntro: e.target.value,
                },
              })
            }
            className="admin-textarea"
          />
        </div>

        <div style={{ paddingTop: '1rem', borderTop: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h4 style={{ margin: 0, fontSize: '1rem', fontWeight: 600, color: '#0f172a' }}>Fabricated Vehicles & EV Projects</h4>
            <button
              type="button"
              onClick={() =>
                setData({
                  ...data,
                  facilities: {
                    ...data.facilities,
                    campusUtilityProjects: [
                      ...(data.facilities?.campusUtilityProjects || []),
                      { lead: 'New EV Project –', text: ' Description and specs' },
                    ],
                  },
                })
              }
              className="admin-btn admin-btn--secondary"
              style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.85rem' }}
            >
              <Plus size={14} /> Add Project
            </button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {(data.facilities?.campusUtilityProjects || []).map((proj, idx) => (
              <div key={idx} style={{ padding: '1rem', border: '1px solid #e2e8f0', borderRadius: '8px', background: '#f8fafc', display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <input
                    type="text"
                    placeholder="Project Title (Lead text)"
                    value={proj.lead}
                    onChange={(e) => {
                      const updated = [...(data.facilities?.campusUtilityProjects || [])];
                      updated[idx] = { ...updated[idx], lead: e.target.value };
                      setData({ ...data, facilities: { ...data.facilities, campusUtilityProjects: updated } });
                    }}
                    className="admin-input"
                    style={{ fontWeight: 700 }}
                  />
                  <textarea
                    rows={2}
                    placeholder="Details"
                    value={proj.text}
                    onChange={(e) => {
                      const updated = [...(data.facilities?.campusUtilityProjects || [])];
                      updated[idx] = { ...updated[idx], text: e.target.value };
                      setData({ ...data, facilities: { ...data.facilities, campusUtilityProjects: updated } });
                    }}
                    className="admin-textarea"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => {
                    const updated = (data.facilities?.campusUtilityProjects || []).filter((_, i) => i !== idx);
                    setData({ ...data, facilities: { ...data.facilities, campusUtilityProjects: updated } });
                  }}
                  className="admin-btn-danger"
                  style={{ padding: '0.55rem 0.65rem' }}
                  title="Remove project"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* SECTION 6: INDUSTRY CORPORATE ENDOWMENTS */}
      <div className="admin-card" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        <div style={{ borderBottom: '2px solid #ea580c', paddingBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Building2 size={18} color="#ea580c" />
          <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 700, color: '#0f172a' }}>
            6. Industry Corporate Endowments
          </h3>
        </div>

        <div className="admin-field">
          <label className="admin-label">Corporate Endowments Intro Paragraph</label>
          <textarea
            rows={3}
            value={data.industryCollaborations?.intro || ''}
            onChange={(e) =>
              setData({
                ...data,
                industryCollaborations: { ...data.industryCollaborations, intro: e.target.value },
              })
            }
            className="admin-textarea"
          />
        </div>

        {/* Endowments List */}
        <div style={{ paddingTop: '1rem', borderTop: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h4 style={{ margin: 0, fontSize: '1rem', fontWeight: 600, color: '#0f172a' }}>Endowments & Vehicles Received</h4>
            <button
              type="button"
              onClick={() =>
                setData({
                  ...data,
                  industryCollaborations: {
                    ...data.industryCollaborations,
                    endowments: [
                      ...(data.industryCollaborations?.endowments || []),
                      { id: `endow-${Date.now()}`, title: 'Award/Equipment Title', bestowedBy: 'Bestowed by...', contribution: 'Details of contribution' },
                    ],
                  },
                })
              }
              className="admin-btn admin-btn--secondary"
              style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.8rem', padding: '0.35rem 0.75rem' }}
            >
              <Plus size={14} /> Add Endowment
            </button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {(data.industryCollaborations?.endowments || []).map((endow, idx) => (
              <div key={idx} style={{ padding: '1rem', border: '1px solid #e2e8f0', borderRadius: '8px', background: '#f8fafc', display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.5rem', flex: 1 }}>
                  <input
                    type="text"
                    placeholder="Title"
                    value={endow.title}
                    onChange={(e) => {
                      const updated = [...(data.industryCollaborations?.endowments || [])];
                      updated[idx] = { ...updated[idx], title: e.target.value };
                      setData({ ...data, industryCollaborations: { ...data.industryCollaborations, endowments: updated } });
                    }}
                    className="admin-input"
                    style={{ fontWeight: 700 }}
                  />
                  <input
                    type="text"
                    placeholder="Bestowed by"
                    value={endow.bestowedBy}
                    onChange={(e) => {
                      const updated = [...(data.industryCollaborations?.endowments || [])];
                      updated[idx] = { ...updated[idx], bestowedBy: e.target.value };
                      setData({ ...data, industryCollaborations: { ...data.industryCollaborations, endowments: updated } });
                    }}
                    className="admin-input"
                  />
                  <input
                    type="text"
                    placeholder="Contribution"
                    value={endow.contribution}
                    onChange={(e) => {
                      const updated = [...(data.industryCollaborations?.endowments || [])];
                      updated[idx] = { ...updated[idx], contribution: e.target.value };
                      setData({ ...data, industryCollaborations: { ...data.industryCollaborations, endowments: updated } });
                    }}
                    className="admin-input"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => {
                    const updated = (data.industryCollaborations?.endowments || []).filter((_, i) => i !== idx);
                    setData({ ...data, industryCollaborations: { ...data.industryCollaborations, endowments: updated } });
                  }}
                  className="admin-btn-danger"
                  style={{ padding: '0.55rem 0.65rem' }}
                  title="Remove endowment"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="admin-field" style={{ paddingTop: '0.5rem' }}>
          <label className="admin-label">Endowments Closing Note</label>
          <textarea
            rows={3}
            value={data.industryCollaborations?.closing || ''}
            onChange={(e) =>
              setData({
                ...data,
                industryCollaborations: { ...data.industryCollaborations, closing: e.target.value },
              })
            }
            className="admin-textarea"
          />
        </div>
      </div>

      {/* SECTION 7: STUDENT ACHIEVEMENTS, MOTORSPORT & PLACEMENTS */}
      <div className="admin-card" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        <div style={{ borderBottom: '2px solid #ea580c', paddingBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Award size={18} color="#ea580c" />
          <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 700, color: '#0f172a' }}>
            7. Student Achievements, Motorsport & Career Placements
          </h3>
        </div>

        {/* Achievements Intro */}
        <div className="admin-field">
          <label className="admin-label">Achievements Intro Paragraph</label>
          <textarea
            rows={3}
            value={data.studentsAchievements?.intro || ''}
            onChange={(e) =>
              setData({
                ...data,
                studentsAchievements: { ...data.studentsAchievements, intro: e.target.value },
              })
            }
            className="admin-textarea"
          />
        </div>

        {/* Motorsport Competitions */}
        <div style={{ paddingTop: '1rem', borderTop: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <label className="admin-label" style={{ margin: 0 }}>Motorsport Competitions & Highlights</label>
            <button
              type="button"
              onClick={() =>
                setData({
                  ...data,
                  studentsAchievements: {
                    ...data.studentsAchievements,
                    competitions: [
                      ...(data.studentsAchievements?.competitions || []),
                      { title: 'New Competition', text: 'Competition description' },
                    ],
                  },
                })
              }
              className="admin-btn admin-btn--secondary"
              style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.8rem', padding: '0.35rem 0.75rem' }}
            >
              <Plus size={14} /> Add Competition
            </button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {(data.studentsAchievements?.competitions || []).map((comp, idx) => (
              <div key={idx} style={{ padding: '1rem', border: '1px solid #e2e8f0', borderRadius: '8px', background: '#f8fafc', display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <input
                    type="text"
                    placeholder="Title"
                    value={comp.title}
                    onChange={(e) => {
                      const updated = [...(data.studentsAchievements?.competitions || [])];
                      updated[idx] = { ...updated[idx], title: e.target.value };
                      setData({ ...data, studentsAchievements: { ...data.studentsAchievements, competitions: updated } });
                    }}
                    className="admin-input"
                    style={{ fontWeight: 700 }}
                  />
                  <textarea
                    rows={2}
                    placeholder="Details"
                    value={comp.text}
                    onChange={(e) => {
                      const updated = [...(data.studentsAchievements?.competitions || [])];
                      updated[idx] = { ...updated[idx], text: e.target.value };
                      setData({ ...data, studentsAchievements: { ...data.studentsAchievements, competitions: updated } });
                    }}
                    className="admin-textarea"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => {
                    const updated = (data.studentsAchievements?.competitions || []).filter((_, i) => i !== idx);
                    setData({ ...data, studentsAchievements: { ...data.studentsAchievements, competitions: updated } });
                  }}
                  className="admin-btn-danger"
                  style={{ padding: '0.55rem 0.65rem' }}
                  title="Remove competition"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Achievements Closing */}
        <div className="admin-field">
          <label className="admin-label">Achievements Closing Paragraph</label>
          <textarea
            rows={3}
            value={data.studentsAchievements?.closing || ''}
            onChange={(e) =>
              setData({
                ...data,
                studentsAchievements: { ...data.studentsAchievements, closing: e.target.value },
              })
            }
            className="admin-textarea"
          />
        </div>

        {/* Achievement Reports / Cards Sub-editor */}
        <div style={{ paddingTop: '1rem', borderTop: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <label className="admin-label" style={{ margin: 0 }}>Achievement Reports & Photo Cards</label>
          <p className="admin-field__hint" style={{ margin: 0 }}>
            Manage individual achievement report cards (with uploaded images & PDF reports).
          </p>
          <div style={{ border: '1px solid #e2e8f0', borderRadius: '8px', padding: '0.5rem', background: '#fafafa' }}>
            <VdlAchievementsAdmin />
          </div>
        </div>

        {/* Placements Paragraphs */}
        <div style={{ paddingTop: '1rem', borderTop: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <label className="admin-label" style={{ margin: 0 }}>Career Placements & Recruiter Paragraphs</label>
            <button
              type="button"
              onClick={() =>
                setData({
                  ...data,
                  studentsAchievements: {
                    ...data.studentsAchievements,
                    placementsParagraphs: [...(data.studentsAchievements?.placementsParagraphs || []), ''],
                  },
                })
              }
              className="admin-btn admin-btn--secondary"
              style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.8rem', padding: '0.35rem 0.75rem' }}
            >
              <Plus size={14} /> Add Placement Paragraph
            </button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {(data.studentsAchievements?.placementsParagraphs || []).map((para, idx) => (
              <div key={idx} style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-start' }}>
                <textarea
                  rows={3}
                  value={para}
                  onChange={(e) => {
                    const updated = [...(data.studentsAchievements?.placementsParagraphs || [])];
                    updated[idx] = e.target.value;
                    setData({ ...data, studentsAchievements: { ...data.studentsAchievements, placementsParagraphs: updated } });
                  }}
                  className="admin-textarea"
                  style={{ flex: 1 }}
                />
                <button
                  type="button"
                  onClick={() => {
                    const updated = (data.studentsAchievements?.placementsParagraphs || []).filter((_, i) => i !== idx);
                    setData({ ...data, studentsAchievements: { ...data.studentsAchievements, placementsParagraphs: updated } });
                  }}
                  className="admin-btn-danger"
                  style={{ padding: '0.6rem 0.75rem' }}
                  title="Remove paragraph"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* SECTION 8: PROGRAM OUTCOMES & TECHNICAL SPECTRUM */}
      <div className="admin-card" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        <div style={{ borderBottom: '2px solid #ea580c', paddingBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <CheckCircle2 size={18} color="#ea580c" />
          <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 700, color: '#0f172a' }}>
            8. Program Outcomes & Technical Spectrum (7 Core Outcomes)
          </h3>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <label className="admin-label" style={{ margin: 0 }}>Core Outcomes</label>
          <button
            type="button"
            onClick={() =>
              setData({
                ...data,
                outcomes: [...data.outcomes, { title: 'New Outcome Title', text: 'Outcome description' }],
              })
            }
            className="admin-btn admin-btn--secondary"
            style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.8rem', padding: '0.35rem 0.75rem' }}
          >
            <Plus size={14} /> Add Outcome
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {data.outcomes.map((oc, idx) => (
            <div key={idx} style={{ padding: '1rem', border: '1px solid #e2e8f0', borderRadius: '8px', background: '#f8fafc', display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <input
                  type="text"
                  placeholder="Title (e.g. 1. Job opportunities)"
                  value={oc.title}
                  onChange={(e) => {
                    const updated = [...data.outcomes];
                    updated[idx] = { ...updated[idx], title: e.target.value };
                    setData({ ...data, outcomes: updated });
                  }}
                  className="admin-input"
                  style={{ fontWeight: 700 }}
                />
                <textarea
                  rows={2}
                  placeholder="Details"
                  value={oc.text}
                  onChange={(e) => {
                    const updated = [...data.outcomes];
                    updated[idx] = { ...updated[idx], text: e.target.value };
                    setData({ ...data, outcomes: updated });
                  }}
                  className="admin-textarea"
                />
              </div>
              <button
                type="button"
                onClick={() => setData({ ...data, outcomes: data.outcomes.filter((_, i) => i !== idx) })}
                className="admin-btn-danger"
                style={{ padding: '0.55rem 0.65rem' }}
                title="Remove outcome"
              >
                <Trash2 size={14} />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* SECTION 9: CUSTOM SECTIONS (AICTE IDEA LAB STYLE AT THE END) */}
      <div className="admin-card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div style={{ borderBottom: '2px solid #0284c7', paddingBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Sparkles size={18} color="#0284c7" />
          <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 700, color: '#0f172a' }}>
            9. Custom Sections / Additional Content ({data.customSections?.length || 0})
          </h3>
        </div>
        <p className="admin-field__hint" style={{ margin: 0 }}>
          Add any custom sections needed — extra paragraphs, tables, checklists, photo galleries, file downloads, or contacts. Any custom section added here will automatically render on the Vehicle Design Lab page.
        </p>

        <CustomSectionEditor
          sections={data.customSections || []}
          onChange={(next) => setData((p) => ({ ...p, customSections: next }))}
          rootSections={data.customSections || []}
          parentPath={[]}
          onFileUploaded={handleCustomSectionFileUploaded}
          onFileRemoved={handleCustomSectionFileRemoved}
          onPhotoUploaded={handleCustomSectionPhotoUploaded}
          onPhotoRemoved={handleCustomSectionPhotoRemoved}
          onGalleryPhotoUploaded={handleCustomSectionGalleryPhotoUploaded}
          onGalleryPhotoRemoved={handleCustomSectionGalleryPhotoRemoved}
          showPlacementToggle
        />
      </div>

      {/* Bottom Save Bar */}
      <div className="admin-card" style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
        <button
          type="button"
          onClick={handleReset}
          className="admin-btn admin-btn--secondary"
          style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}
        >
          <RotateCcw size={14} /> Reset Defaults
        </button>
        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className="admin-btn admin-btn--primary"
          style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}
        >
          {saving ? (
            <span>Saving...</span>
          ) : saved ? (
            <>
              <Check size={16} /> Saved!
            </>
          ) : (
            <>
              <Save size={16} /> Save All Changes
            </>
          )}
        </button>
      </div>
    </div>
  );
}
