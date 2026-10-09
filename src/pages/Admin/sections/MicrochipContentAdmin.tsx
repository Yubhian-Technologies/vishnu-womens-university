import { useEffect, useState } from 'react';
import {
  Cpu,
  Compass,
  Target,
  BookOpen,
  Award,
  Sparkles,
  Zap,
  Wrench,
  Building2,
  Image as ImageIcon,
  Layers,
  Users,
  Plus,
  Trash2,
  RotateCcw,
  Save,
  CheckCircle2,
} from 'lucide-react';
import { doc, serverTimestamp } from 'firebase/firestore';
import { setDoc, updateDoc } from '../../../lib/auditLog';
import { db } from '../../../lib/firebase';
import { useDocument } from '../../../hooks/useDocument';
import { useCollection, type WithId } from '../../../hooks/useCollection';
import { deleteFile, type UploadResult } from '../../../lib/storage';
import ImageUploader from '../../../components/ImageUploader/ImageUploader';
import CustomSectionEditor from './CustomSectionEditor';
import { replaceAtPath, getAtPath, type CustomSection } from '../../../lib/customSections';
import { microchipEmbedded } from '../../Differentiators/microchipEmbedded.data';

export interface MicrochipGalleryPhoto {
  imageUrl: string;
  storagePath?: string;
  caption?: string;
}

export interface CustomMicrochipSection {
  id: string;
  title: string;
  badge?: string;
  paragraphs?: string[];
  bulletPoints?: string[];
}

export interface MicrochipTeamMember {
  name: string;
  role?: string;
  designation?: string;
  email?: string;
  phone?: string;
}

export interface MicrochipDoc {
  hero?: {
    category?: string;
    title?: string;
    subtitle?: string;
  };
  about?: {
    title?: string;
    paragraphs?: string[];
    keyTags?: string[];
  };
  vision?: {
    title?: string;
    statement?: string;
  };
  mission?: {
    title?: string;
    intro?: string;
    points?: string[];
  };
  learningAreas?: {
    number: string;
    title: string;
    description: string;
  }[];
  team?: {
    title?: string;
    members?: MicrochipTeamMember[];
  };
  trainingAndActivities?: {
    title?: string;
    programmeName?: string;
    description?: string;
    activities?: string[];
  };
  programmeOutcome?: {
    title?: string;
    subtitle?: string;
    description?: string;
    outcomes?: string[];
  };
  technicalHighlights?: {
    title?: string;
    items?: string[];
  };
  facilities?: {
    title?: string;
    intro?: string;
    items?: string[];
  };
  learningPartners?: {
    title?: string;
    partners?: { name: string; description: string }[];
  };
  gallery?: {
    title?: string;
    caption?: string;
    photos?: MicrochipGalleryPhoto[];
  };
  customSections?: CustomSection[];
  additionalSections?: CustomMicrochipSection[];
}

interface DifferentiatorItemRecord extends WithId {
  slug: string;
  title: string;
  customSections?: CustomSection[];
  tabs?: { sections?: CustomSection[] }[];
}

const DEFAULT_STATE: MicrochipDoc = {
  hero: { ...microchipEmbedded.hero },
  about: {
    title: microchipEmbedded.about.title,
    paragraphs: [...microchipEmbedded.about.paragraphs],
    keyTags: [
      '8, 16 & 32-Bit PIC Microcontrollers',
      'IoT & Sensor-Based Applications',
      'EduSkills & AICTE ATAL Integration',
    ],
  },
  vision: { ...microchipEmbedded.vision },
  mission: {
    title: microchipEmbedded.mission.title,
    intro: microchipEmbedded.mission.intro,
    points: [...microchipEmbedded.mission.points],
  },
  learningAreas: microchipEmbedded.learningAreas.map((l) => ({ ...l })),
  team: {
    title: 'Team (Microchip Embedded System)',
    members: [
      { name: 'Dr. Faculty In-Charge', designation: 'Professor & Head', role: 'Faculty Coordinator', email: '', phone: '' },
    ],
  },
  trainingAndActivities: {
    title: microchipEmbedded.trainingAndActivities.title,
    programmeName: microchipEmbedded.trainingAndActivities.programmeName,
    description: microchipEmbedded.trainingAndActivities.description,
    activities: [
      'Hands-on microcontroller programming workshops',
      'EduSkills & AICTE ATAL Developer initiatives',
      'Sensor interfacing and IoT prototyping sessions',
    ],
  },
  programmeOutcome: {
    title: microchipEmbedded.programmeOutcome.title,
    subtitle: 'Faculty Development & Impact',
    description: microchipEmbedded.programmeOutcome.description,
    outcomes: [
      'Faculty certification in modern embedded architectures',
      'Student capability in PIC microcontroller project execution',
      'Industry-aligned practical problem solving',
    ],
  },
  technicalHighlights: {
    title: microchipEmbedded.technicalHighlights.title,
    items: [...microchipEmbedded.technicalHighlights.items],
  },
  facilities: {
    title: microchipEmbedded.facilities.title,
    intro: microchipEmbedded.facilities.intro,
    items: [...microchipEmbedded.facilities.items],
  },
  learningPartners: {
    title: microchipEmbedded.learningPartners.title,
    partners: microchipEmbedded.learningPartners.partners.map((p) => ({ ...p })),
  },
  gallery: {
    title: microchipEmbedded.gallery.title,
    caption: microchipEmbedded.gallery.caption,
    photos: [],
  },
  customSections: [],
  additionalSections: [],
};

type ActiveSubSection =
  | 'overview'
  | 'vision-mission'
  | 'learning-areas'
  | 'team'
  | 'activities'
  | 'outcomes'
  | 'highlights'
  | 'facilities'
  | 'partners'
  | 'gallery'
  | 'custom-sections';

const SUB_TABS: { key: ActiveSubSection; label: string; icon: typeof Cpu }[] = [
  { key: 'overview', label: '1. Overview & About', icon: Cpu },
  { key: 'vision-mission', label: '2. Vision & Mission', icon: Compass },
  { key: 'learning-areas', label: '3. Core Learning Areas', icon: BookOpen },
  { key: 'team', label: '4. Team', icon: Users },
  { key: 'activities', label: '5. Activities', icon: Award },
  { key: 'outcomes', label: '6. Outcomes', icon: Sparkles },
  { key: 'highlights', label: '7. Key Highlights', icon: Zap },
  { key: 'facilities', label: '8. Facilities & Equipment', icon: Wrench },
  { key: 'partners', label: '9. Partners', icon: Building2 },
  { key: 'gallery', label: '10. Visual Documentation', icon: ImageIcon },
  { key: 'custom-sections', label: '11. Custom Sections', icon: Layers },
];

export default function MicrochipContentAdmin() {
  const { data, loading } = useDocument<MicrochipDoc>('settings', 'microchipEmbedded');
  const { docs: diffItems } = useCollection<DifferentiatorItemRecord>('differentiatorItems');
  const microchipItem = diffItems.find((d) => d.slug === 'microchip-embedded');

  const [form, setForm] = useState<MicrochipDoc>(DEFAULT_STATE);
  const [hasInitialized, setHasInitialized] = useState(false);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<ActiveSubSection>('overview');

  useEffect(() => {
    if (!loading && !hasInitialized) {
      if (data) {
        setForm({
          hero: { ...DEFAULT_STATE.hero, ...data.hero },
          about: {
            title: data.about?.title || DEFAULT_STATE.about?.title,
            paragraphs:
              data.about?.paragraphs && data.about.paragraphs.length > 0
                ? data.about.paragraphs
                : DEFAULT_STATE.about?.paragraphs,
            keyTags:
              data.about?.keyTags && data.about.keyTags.length > 0
                ? data.about.keyTags
                : DEFAULT_STATE.about?.keyTags,
          },
          vision: { ...DEFAULT_STATE.vision, ...data.vision },
          mission: {
            title: data.mission?.title || DEFAULT_STATE.mission?.title,
            intro: data.mission?.intro || DEFAULT_STATE.mission?.intro,
            points:
              data.mission?.points && data.mission.points.length > 0
                ? data.mission.points
                : DEFAULT_STATE.mission?.points,
          },
          learningAreas:
            data.learningAreas && data.learningAreas.length > 0
              ? data.learningAreas
              : DEFAULT_STATE.learningAreas,
          team: {
            title: data.team?.title || DEFAULT_STATE.team?.title,
            members:
              data.team?.members && data.team.members.length > 0
                ? data.team.members
                : DEFAULT_STATE.team?.members,
          },
          trainingAndActivities: {
            ...DEFAULT_STATE.trainingAndActivities,
            ...data.trainingAndActivities,
          },
          programmeOutcome: {
            ...DEFAULT_STATE.programmeOutcome,
            ...data.programmeOutcome,
          },
          technicalHighlights: {
            title: data.technicalHighlights?.title || DEFAULT_STATE.technicalHighlights?.title,
            items:
              data.technicalHighlights?.items && data.technicalHighlights.items.length > 0
                ? data.technicalHighlights.items
                : DEFAULT_STATE.technicalHighlights?.items,
          },
          facilities: {
            title: data.facilities?.title || DEFAULT_STATE.facilities?.title,
            intro: data.facilities?.intro || DEFAULT_STATE.facilities?.intro,
            items:
              data.facilities?.items && data.facilities.items.length > 0
                ? data.facilities.items
                : DEFAULT_STATE.facilities?.items,
          },
          learningPartners: {
            title: data.learningPartners?.title || DEFAULT_STATE.learningPartners?.title,
            partners:
              data.learningPartners?.partners && data.learningPartners.partners.length > 0
                ? data.learningPartners.partners
                : DEFAULT_STATE.learningPartners?.partners,
          },
          gallery: {
            title: data.gallery?.title || DEFAULT_STATE.gallery?.title,
            caption: data.gallery?.caption || DEFAULT_STATE.gallery?.caption,
            photos: data.gallery?.photos || [],
          },
          customSections: data.customSections || [],
          additionalSections: data.additionalSections || [],
        });
      }
      setHasInitialized(true);
    }
  }, [data, loading, hasInitialized]);

  const save = async () => {
    setSaving(true);
    try {
      await setDoc(
        doc(db, 'settings', 'microchipEmbedded'),
        {
          ...form,
          updatedAt: serverTimestamp(),
        },
        { merge: true }
      );

      if (microchipItem?.id) {
        await updateDoc(doc(db, 'differentiatorItems', microchipItem.id), {
          customSections: form.customSections || [],
          updatedAt: serverTimestamp(),
        });
      }

      alert('Microchip Embedded Systems Centre content updated successfully!');
    } catch (e) {
      alert(`Couldn't save: ${(e as Error).message}`);
    } finally {
      setSaving(false);
    }
  };

  const resetToDefaults = () => {
    if (
      confirm(
        'Reset all Microchip Centre text to default starting values? You can still review and edit before saving.'
      )
    ) {
      setForm(DEFAULT_STATE);
    }
  };

  // Custom Section Editor upload handlers for Tab 11 (new custom toggles)
  const handleCustomSectionFileUploaded = (path: number[], fileIndex: number, r: UploadResult) => {
    setForm((p) => ({
      ...p,
      customSections: replaceAtPath(p.customSections || [], path, (s) => ({
        ...s,
        files: (s.files || []).map((f, i) => (i === fileIndex ? { ...f, fileUrl: r.url, storagePath: r.path } : f)),
      })),
    }));
  };

  const handleCustomSectionFileRemoved = async (path: number[], fileIndex: number) => {
    const file = getAtPath(form.customSections || [], path)?.files?.[fileIndex];
    if (!file?.fileUrl) return;
    if (!confirm('Remove this file? This cannot be undone.')) return;
    try {
      if (file.storagePath) await deleteFile(file.storagePath);
    } catch (e) {
      alert(`Couldn't delete the file from storage: ${(e as Error).message}`);
      return;
    }
    setForm((p) => ({
      ...p,
      customSections: replaceAtPath(p.customSections || [], path, (s) => ({
        ...s,
        files: (s.files || []).filter((_, i) => i !== fileIndex),
      })),
    }));
  };

  const handleCustomSectionPhotoUploaded = (path: number[], r: UploadResult) => {
    setForm((p) => ({
      ...p,
      customSections: replaceAtPath(p.customSections || [], path, (s) => ({
        ...s,
        photo: { imageUrl: r.url, storagePath: r.path },
      })),
    }));
  };

  const handleCustomSectionPhotoRemoved = async (path: number[]) => {
    const photo = getAtPath(form.customSections || [], path)?.photo;
    if (!photo?.imageUrl) return;
    if (!confirm('Remove this photo? This cannot be undone.')) return;
    try {
      if (photo.storagePath) await deleteFile(photo.storagePath);
    } catch (e) {
      alert(`Couldn't delete the photo from storage: ${(e as Error).message}`);
      return;
    }
    setForm((p) => ({
      ...p,
      customSections: replaceAtPath(p.customSections || [], path, (s) => {
        const next = { ...s };
        delete next.photo;
        return next;
      }),
    }));
  };

  const handleCustomSectionGalleryPhotoUploaded = (
    path: number[],
    photoIndex: number,
    r: UploadResult
  ) => {
    setForm((p) => ({
      ...p,
      customSections: replaceAtPath(p.customSections || [], path, (s) => ({
        ...s,
        galleryPhotos: (s.galleryPhotos || []).map((ph, i) =>
          i === photoIndex ? { imageUrl: r.url, storagePath: r.path } : ph
        ),
      })),
    }));
  };

  const handleCustomSectionGalleryPhotoRemoved = async (path: number[], photoIndex: number) => {
    const photo = getAtPath(form.customSections || [], path)?.galleryPhotos?.[photoIndex];
    if (!photo) return;
    if (photo.imageUrl && !confirm('Remove this photo? This cannot be undone.')) return;
    try {
      if (photo.storagePath) await deleteFile(photo.storagePath);
    } catch (e) {
      alert(`Couldn't delete the photo from storage: ${(e as Error).message}`);
      return;
    }
    setForm((p) => ({
      ...p,
      customSections: replaceAtPath(p.customSections || [], path, (s) => ({
        ...s,
        galleryPhotos: (s.galleryPhotos || []).filter((_, i) => i !== photoIndex),
      })),
    }));
  };

  return (
    <div style={{ background: '#fff', borderRadius: '12px', border: '1px solid #E2E8F0', padding: '1.5rem', marginTop: '1.5rem' }}>
      {/* Top Header & Actions */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '1.5rem',
          flexWrap: 'wrap',
          gap: '1rem',
          borderBottom: '1px solid #E2E8F0',
          paddingBottom: '1.25rem',
        }}
      >
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', background: '#E0F2FE', color: '#0369A1', padding: '0.2rem 0.6rem', borderRadius: '999px', fontSize: '0.75rem', fontWeight: 700, marginBottom: '0.35rem' }}>
            <Cpu size={13} /> Differentiators Admin
          </div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0B1E42', margin: 0 }}>
            Microchip Embedded Systems Centre — Content & Sections
          </h2>
          <p style={{ fontSize: '0.85rem', color: '#64748B', margin: '0.25rem 0 0 0' }}>
            All sections have their own dedicated toggle matching the exact page layout from top to bottom.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '0.6rem', alignItems: 'center' }}>
          <button
            type="button"
            onClick={resetToDefaults}
            className="admin-btn-secondary"
            style={{ fontSize: '0.8rem', padding: '0.5rem 0.9rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}
          >
            <RotateCcw size={14} /> Reset Defaults
          </button>
          <button
            type="button"
            onClick={save}
            disabled={saving}
            className="admin-btn-primary"
            style={{
              fontSize: '0.825rem',
              padding: '0.5rem 1.25rem',
              background: '#008080',
              borderColor: '#008080',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              fontWeight: 700,
            }}
          >
            <Save size={14} /> {saving ? 'Saving...' : 'Save All Changes'}
          </button>
        </div>
      </div>

      {/* 11-Tab Navigation Bar */}
      <div
        style={{
          display: 'flex',
          gap: '0.4rem',
          overflowX: 'auto',
          paddingBottom: '0.75rem',
          marginBottom: '1.75rem',
          borderBottom: '2px solid #F1F5F9',
        }}
      >
        {SUB_TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActiveTab(tab.key)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.45rem',
                padding: '0.55rem 0.95rem',
                fontSize: '0.825rem',
                fontWeight: 700,
                borderRadius: '8px',
                border: 'none',
                background: isActive ? '#0B1E42' : '#F8FAFC',
                color: isActive ? '#FFFFFF' : '#475569',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                transition: 'all 0.15s ease',
              }}
            >
              <Icon size={15} color={isActive ? '#38BDF8' : '#64748B'} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: 1. OVERVIEW & ABOUT                                                */}
      {/* ========================================================================= */}
      {activeTab === 'overview' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div style={{ background: '#F8FAFC', padding: '1.25rem', borderRadius: '10px', border: '1px solid #E2E8F0' }}>
            <h3 style={{ margin: '0 0 1rem 0', fontSize: '1rem', fontWeight: 800, color: '#0B1E42', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Cpu size={18} color="#008080" /> Section 1: Centre Overview & About Card
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label className="admin-label">About Card Heading</label>
                <input
                  type="text"
                  className="admin-input"
                  value={form.about?.title || ''}
                  onChange={(e) =>
                    setForm((p) => ({
                      ...p,
                      about: { ...p.about, title: e.target.value },
                    }))
                  }
                  placeholder="e.g. About the Centre"
                />
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                  <label className="admin-label" style={{ margin: 0 }}>About Paragraphs</label>
                  <button
                    type="button"
                    onClick={() =>
                      setForm((p) => ({
                        ...p,
                        about: {
                          ...p.about,
                          paragraphs: [...(p.about?.paragraphs || []), ''],
                        },
                      }))
                    }
                    className="admin-btn-secondary"
                    style={{ fontSize: '0.75rem', padding: '0.25rem 0.6rem' }}
                  >
                    + Add Paragraph
                  </button>
                </div>
                {(form.about?.paragraphs || []).map((para, idx) => (
                  <div key={idx} style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.6rem' }}>
                    <div style={{ flex: 1 }}>
                      <textarea
                        className="admin-textarea"
                        rows={3}
                        value={para}
                        placeholder={`Paragraph ${idx + 1}...`}
                        onChange={(e) => {
                          const list = [...(form.about?.paragraphs || [])];
                          list[idx] = e.target.value;
                          setForm((p) => ({ ...p, about: { ...p.about, paragraphs: list } }));
                        }}
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        const list = (form.about?.paragraphs || []).filter((_, i) => i !== idx);
                        setForm((p) => ({ ...p, about: { ...p.about, paragraphs: list } }));
                      }}
                      className="admin-btn-danger"
                      style={{ alignSelf: 'flex-start', padding: '0.45rem 0.65rem' }}
                      title="Delete Paragraph"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>

              {/* Key Tag Pills */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                  <label className="admin-label" style={{ margin: 0 }}>Key Feature Pills (Shown under About text)</label>
                  <button
                    type="button"
                    onClick={() =>
                      setForm((p) => ({
                        ...p,
                        about: {
                          ...p.about,
                          keyTags: [...(p.about?.keyTags || []), ''],
                        },
                      }))
                    }
                    className="admin-btn-secondary"
                    style={{ fontSize: '0.75rem', padding: '0.25rem 0.6rem' }}
                  >
                    + Add Pill
                  </button>
                </div>
                {(form.about?.keyTags || []).map((tag, idx) => (
                  <div key={idx} style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
                    <input
                      type="text"
                      className="admin-input"
                      value={tag}
                      placeholder={`Pill #${idx + 1}`}
                      onChange={(e) => {
                        const list = [...(form.about?.keyTags || [])];
                        list[idx] = e.target.value;
                        setForm((p) => ({ ...p, about: { ...p.about, keyTags: list } }));
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const list = (form.about?.keyTags || []).filter((_, i) => i !== idx);
                        setForm((p) => ({ ...p, about: { ...p.about, keyTags: list } }));
                      }}
                      className="admin-btn-danger"
                      style={{ padding: '0.45rem 0.65rem' }}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: 2. VISION & MISSION                                                */}
      {/* ========================================================================= */}
      {activeTab === 'vision-mission' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Vision Card */}
          <div style={{ background: '#F8FAFC', padding: '1.25rem', borderRadius: '10px', border: '1px solid #E2E8F0' }}>
            <h3 style={{ margin: '0 0 1rem 0', fontSize: '1rem', fontWeight: 800, color: '#0B1E42', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Compass size={18} color="#008080" /> Strategic Vision
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label className="admin-label">Vision Heading</label>
                <input
                  type="text"
                  className="admin-input"
                  value={form.vision?.title || ''}
                  onChange={(e) =>
                    setForm((p) => ({
                      ...p,
                      vision: { ...p.vision, title: e.target.value },
                    }))
                  }
                  placeholder="e.g. Our Vision"
                />
              </div>
              <div>
                <label className="admin-label">Vision Statement</label>
                <textarea
                  className="admin-textarea"
                  rows={4}
                  value={form.vision?.statement || ''}
                  onChange={(e) =>
                    setForm((p) => ({
                      ...p,
                      vision: { ...p.vision, statement: e.target.value },
                    }))
                  }
                  placeholder="Write the strategic vision statement..."
                />
              </div>
            </div>
          </div>

          {/* Mission Card */}
          <div style={{ background: '#F8FAFC', padding: '1.25rem', borderRadius: '10px', border: '1px solid #E2E8F0' }}>
            <h3 style={{ margin: '0 0 1rem 0', fontSize: '1rem', fontWeight: 800, color: '#0B1E42', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Target size={18} color="#008080" /> Institutional Mission
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label className="admin-label">Mission Heading</label>
                  <input
                    type="text"
                    className="admin-input"
                    value={form.mission?.title || ''}
                    onChange={(e) =>
                      setForm((p) => ({
                        ...p,
                        mission: { ...p.mission, title: e.target.value },
                      }))
                    }
                    placeholder="e.g. Our Mission"
                  />
                </div>
                <div>
                  <label className="admin-label">Mission Introduction</label>
                  <input
                    type="text"
                    className="admin-input"
                    value={form.mission?.intro || ''}
                    onChange={(e) =>
                      setForm((p) => ({
                        ...p,
                        mission: { ...p.mission, intro: e.target.value },
                      }))
                    }
                    placeholder="e.g. The Centre aims to:"
                  />
                </div>
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                  <label className="admin-label" style={{ margin: 0 }}>Mission Points</label>
                  <button
                    type="button"
                    onClick={() =>
                      setForm((p) => ({
                        ...p,
                        mission: {
                          ...p.mission,
                          points: [...(p.mission?.points || []), ''],
                        },
                      }))
                    }
                    className="admin-btn-secondary"
                    style={{ fontSize: '0.75rem', padding: '0.25rem 0.6rem' }}
                  >
                    + Add Mission Point
                  </button>
                </div>
                {(form.mission?.points || []).map((pt, idx) => (
                  <div key={idx} style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
                    <input
                      type="text"
                      className="admin-input"
                      value={pt}
                      placeholder={`Mission point ${idx + 1}`}
                      onChange={(e) => {
                        const list = [...(form.mission?.points || [])];
                        list[idx] = e.target.value;
                        setForm((p) => ({ ...p, mission: { ...p.mission, points: list } }));
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const list = (form.mission?.points || []).filter((_, i) => i !== idx);
                        setForm((p) => ({ ...p, mission: { ...p.mission, points: list } }));
                      }}
                      className="admin-btn-danger"
                      style={{ padding: '0.45rem 0.65rem' }}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: 3. CORE LEARNING AREAS                                             */}
      {/* ========================================================================= */}
      {activeTab === 'learning-areas' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 800, color: '#0B1E42', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <BookOpen size={18} color="#008080" /> Section 3: Competency Framework (Core Learning Areas)
              </h3>
              <p style={{ margin: '0.2rem 0 0', fontSize: '0.8rem', color: '#64748B' }}>
                Numbered cards highlighting core competency pillars.
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                const nextNum = String((form.learningAreas || []).length + 1).padStart(2, '0');
                setForm((p) => ({
                  ...p,
                  learningAreas: [
                    ...(p.learningAreas || []),
                    {
                      number: nextNum,
                      title: 'New Learning Area',
                      description: 'Describe the core learning competency here...',
                    },
                  ],
                }));
              }}
              className="admin-btn-secondary"
              style={{ fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}
            >
              <Plus size={14} /> Add Learning Area
            </button>
          </div>

          {(form.learningAreas || []).map((area, idx) => (
            <div
              key={idx}
              style={{
                background: '#F8FAFC',
                border: '1px solid #E2E8F0',
                borderRadius: '10px',
                padding: '1.15rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.8rem',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontWeight: 800, fontSize: '0.9rem', color: '#008080' }}>
                  Card #{idx + 1}
                </span>
                <button
                  type="button"
                  onClick={() => {
                    const list = (form.learningAreas || []).filter((_, i) => i !== idx);
                    setForm((p) => ({ ...p, learningAreas: list }));
                  }}
                  className="admin-btn-danger"
                  style={{ fontSize: '0.75rem', padding: '0.3rem 0.6rem' }}
                >
                  <Trash2 size={13} /> Delete Card
                </button>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '100px 1fr', gap: '0.75rem' }}>
                <div>
                  <label className="admin-label">Number</label>
                  <input
                    type="text"
                    className="admin-input"
                    value={area.number}
                    onChange={(e) => {
                      const list = [...(form.learningAreas || [])];
                      list[idx] = { ...list[idx], number: e.target.value };
                      setForm((p) => ({ ...p, learningAreas: list }));
                    }}
                  />
                </div>
                <div>
                  <label className="admin-label">Area Title</label>
                  <input
                    type="text"
                    className="admin-input"
                    value={area.title}
                    onChange={(e) => {
                      const list = [...(form.learningAreas || [])];
                      list[idx] = { ...list[idx], title: e.target.value };
                      setForm((p) => ({ ...p, learningAreas: list }));
                    }}
                  />
                </div>
              </div>

              <div>
                <label className="admin-label">Description</label>
                <textarea
                  className="admin-textarea"
                  rows={2}
                  value={area.description}
                  onChange={(e) => {
                    const list = [...(form.learningAreas || [])];
                    list[idx] = { ...list[idx], description: e.target.value };
                    setForm((p) => ({ ...p, learningAreas: list }));
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 4: 4. TEAM (MICROCHIP EMBEDDED SYSTEM)                                */}
      {/* ========================================================================= */}
      {activeTab === 'team' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 800, color: '#0B1E42', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Users size={18} color="#008080" /> Section 4: Team (Microchip Embedded System)
              </h3>
              <p style={{ margin: '0.2rem 0 0', fontSize: '0.8rem', color: '#64748B' }}>
                Manage faculty coordinators, mentors, and core team members.
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                setForm((p) => ({
                  ...p,
                  team: {
                    ...p.team,
                    members: [
                      ...(p.team?.members || []),
                      { name: '', designation: '', role: '', email: '', phone: '' },
                    ],
                  },
                }));
              }}
              className="admin-btn-secondary"
              style={{ fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}
            >
              <Plus size={14} /> Add Team Member
            </button>
          </div>

          <div>
            <label className="admin-label">Section Title</label>
            <input
              type="text"
              className="admin-input"
              value={form.team?.title || ''}
              onChange={(e) =>
                setForm((p) => ({
                  ...p,
                  team: { ...p.team, title: e.target.value },
                }))
              }
              placeholder="e.g. Team (Microchip Embedded System)"
            />
          </div>

          {(form.team?.members || []).map((m, idx) => (
            <div
              key={idx}
              style={{
                background: '#F8FAFC',
                border: '1px solid #E2E8F0',
                borderRadius: '10px',
                padding: '1.15rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.75rem',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontWeight: 800, fontSize: '0.9rem', color: '#008080' }}>
                  Member #{idx + 1}
                </span>
                <button
                  type="button"
                  onClick={() => {
                    const list = (form.team?.members || []).filter((_, i) => i !== idx);
                    setForm((p) => ({ ...p, team: { ...p.team, members: list } }));
                  }}
                  className="admin-btn-danger"
                  style={{ fontSize: '0.75rem', padding: '0.3rem 0.6rem' }}
                >
                  <Trash2 size={13} /> Delete Member
                </button>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div>
                  <label className="admin-label">Name *</label>
                  <input
                    type="text"
                    className="admin-input"
                    value={m.name}
                    placeholder="Full Name"
                    onChange={(e) => {
                      const list = [...(form.team?.members || [])];
                      list[idx] = { ...list[idx], name: e.target.value };
                      setForm((p) => ({ ...p, team: { ...p.team, members: list } }));
                    }}
                  />
                </div>
                <div>
                  <label className="admin-label">Role / Responsibilities</label>
                  <input
                    type="text"
                    className="admin-input"
                    value={m.role || ''}
                    placeholder="e.g. Faculty Coordinator / Lab In-Charge"
                    onChange={(e) => {
                      const list = [...(form.team?.members || [])];
                      list[idx] = { ...list[idx], role: e.target.value };
                      setForm((p) => ({ ...p, team: { ...p.team, members: list } }));
                    }}
                  />
                </div>
                <div>
                  <label className="admin-label">Designation</label>
                  <input
                    type="text"
                    className="admin-input"
                    value={m.designation || ''}
                    placeholder="e.g. Professor & Head"
                    onChange={(e) => {
                      const list = [...(form.team?.members || [])];
                      list[idx] = { ...list[idx], designation: e.target.value };
                      setForm((p) => ({ ...p, team: { ...p.team, members: list } }));
                    }}
                  />
                </div>
                <div>
                  <label className="admin-label">Email</label>
                  <input
                    type="email"
                    className="admin-input"
                    value={m.email || ''}
                    placeholder="name@vishnu.edu.in"
                    onChange={(e) => {
                      const list = [...(form.team?.members || [])];
                      list[idx] = { ...list[idx], email: e.target.value };
                      setForm((p) => ({ ...p, team: { ...p.team, members: list } }));
                    }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 5: 5. ACTIVITIES                                                      */}
      {/* ========================================================================= */}
      {activeTab === 'activities' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div style={{ background: '#F8FAFC', padding: '1.25rem', borderRadius: '10px', border: '1px solid #E2E8F0' }}>
            <h3 style={{ margin: '0 0 1rem 0', fontSize: '1rem', fontWeight: 800, color: '#0B1E42', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Award size={18} color="#008080" /> Section 5: Training & Activities
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label className="admin-label">Section Title</label>
                  <input
                    type="text"
                    className="admin-input"
                    value={form.trainingAndActivities?.title || ''}
                    onChange={(e) =>
                      setForm((p) => ({
                        ...p,
                        trainingAndActivities: {
                          ...p.trainingAndActivities,
                          title: e.target.value,
                        },
                      }))
                    }
                    placeholder="e.g. Training & Activities"
                  />
                </div>
                <div>
                  <label className="admin-label">Programme Name</label>
                  <input
                    type="text"
                    className="admin-input"
                    value={form.trainingAndActivities?.programmeName || ''}
                    onChange={(e) =>
                      setForm((p) => ({
                        ...p,
                        trainingAndActivities: {
                          ...p.trainingAndActivities,
                          programmeName: e.target.value,
                        },
                      }))
                    }
                    placeholder="e.g. AICTE ATAL – EduSkills Microchip Embedded Systems Developer Programme"
                  />
                </div>
              </div>
              <div>
                <label className="admin-label">Description</label>
                <textarea
                  className="admin-textarea"
                  rows={3}
                  value={form.trainingAndActivities?.description || ''}
                  onChange={(e) =>
                    setForm((p) => ({
                      ...p,
                      trainingAndActivities: {
                        ...p.trainingAndActivities,
                        description: e.target.value,
                      },
                    }))
                  }
                  placeholder="Describe the training & activities initiatives..."
                />
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                  <label className="admin-label" style={{ margin: 0 }}>Activities List Points</label>
                  <button
                    type="button"
                    onClick={() =>
                      setForm((p) => ({
                        ...p,
                        trainingAndActivities: {
                          ...p.trainingAndActivities,
                          activities: [...(p.trainingAndActivities?.activities || []), ''],
                        },
                      }))
                    }
                    className="admin-btn-secondary"
                    style={{ fontSize: '0.75rem', padding: '0.25rem 0.6rem' }}
                  >
                    + Add Activity Point
                  </button>
                </div>
                {(form.trainingAndActivities?.activities || []).map((act, idx) => (
                  <div key={idx} style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
                    <input
                      type="text"
                      className="admin-input"
                      value={act}
                      placeholder={`Activity ${idx + 1}`}
                      onChange={(e) => {
                        const list = [...(form.trainingAndActivities?.activities || [])];
                        list[idx] = e.target.value;
                        setForm((p) => ({
                          ...p,
                          trainingAndActivities: { ...p.trainingAndActivities, activities: list },
                        }));
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const list = (form.trainingAndActivities?.activities || []).filter((_, i) => i !== idx);
                        setForm((p) => ({
                          ...p,
                          trainingAndActivities: { ...p.trainingAndActivities, activities: list },
                        }));
                      }}
                      className="admin-btn-danger"
                      style={{ padding: '0.45rem 0.65rem' }}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 6: 6. OUTCOMES                                                        */}
      {/* ========================================================================= */}
      {activeTab === 'outcomes' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div style={{ background: '#F8FAFC', padding: '1.25rem', borderRadius: '10px', border: '1px solid #E2E8F0' }}>
            <h3 style={{ margin: '0 0 1rem 0', fontSize: '1rem', fontWeight: 800, color: '#0B1E42', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Sparkles size={18} color="#008080" /> Section 6: Programme Outcomes & Impact
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label className="admin-label">Section Title</label>
                  <input
                    type="text"
                    className="admin-input"
                    value={form.programmeOutcome?.title || ''}
                    onChange={(e) =>
                      setForm((p) => ({
                        ...p,
                        programmeOutcome: {
                          ...p.programmeOutcome,
                          title: e.target.value,
                        },
                      }))
                    }
                    placeholder="e.g. Programme Outcome"
                  />
                </div>
                <div>
                  <label className="admin-label">Subheading</label>
                  <input
                    type="text"
                    className="admin-input"
                    value={form.programmeOutcome?.subtitle || ''}
                    onChange={(e) =>
                      setForm((p) => ({
                        ...p,
                        programmeOutcome: {
                          ...p.programmeOutcome,
                          subtitle: e.target.value,
                        },
                      }))
                    }
                    placeholder="e.g. Faculty Development & Impact"
                  />
                </div>
              </div>
              <div>
                <label className="admin-label">Outcome Description</label>
                <textarea
                  className="admin-textarea"
                  rows={3}
                  value={form.programmeOutcome?.description || ''}
                  onChange={(e) =>
                    setForm((p) => ({
                      ...p,
                      programmeOutcome: {
                        ...p.programmeOutcome,
                        description: e.target.value,
                      },
                    }))
                  }
                  placeholder="Describe the programme outcomes..."
                />
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                  <label className="admin-label" style={{ margin: 0 }}>Outcome Bullet Points</label>
                  <button
                    type="button"
                    onClick={() =>
                      setForm((p) => ({
                        ...p,
                        programmeOutcome: {
                          ...p.programmeOutcome,
                          outcomes: [...(p.programmeOutcome?.outcomes || []), ''],
                        },
                      }))
                    }
                    className="admin-btn-secondary"
                    style={{ fontSize: '0.75rem', padding: '0.25rem 0.6rem' }}
                  >
                    + Add Outcome Point
                  </button>
                </div>
                {(form.programmeOutcome?.outcomes || []).map((out, idx) => (
                  <div key={idx} style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
                    <input
                      type="text"
                      className="admin-input"
                      value={out}
                      placeholder={`Outcome point ${idx + 1}`}
                      onChange={(e) => {
                        const list = [...(form.programmeOutcome?.outcomes || [])];
                        list[idx] = e.target.value;
                        setForm((p) => ({
                          ...p,
                          programmeOutcome: { ...p.programmeOutcome, outcomes: list },
                        }));
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const list = (form.programmeOutcome?.outcomes || []).filter((_, i) => i !== idx);
                        setForm((p) => ({
                          ...p,
                          programmeOutcome: { ...p.programmeOutcome, outcomes: list },
                        }));
                      }}
                      className="admin-btn-danger"
                      style={{ padding: '0.45rem 0.65rem' }}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 7: 7. KEY HIGHLIGHTS                                                  */}
      {/* ========================================================================= */}
      {activeTab === 'highlights' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div style={{ background: '#F8FAFC', padding: '1.25rem', borderRadius: '10px', border: '1px solid #E2E8F0' }}>
            <h3 style={{ margin: '0 0 1rem 0', fontSize: '1rem', fontWeight: 800, color: '#0B1E42', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Zap size={18} color="#008080" /> Section 7: Key Highlights
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label className="admin-label">Card Title</label>
                <input
                  type="text"
                  className="admin-input"
                  value={form.technicalHighlights?.title || ''}
                  onChange={(e) =>
                    setForm((p) => ({
                      ...p,
                      technicalHighlights: {
                        ...p.technicalHighlights,
                        title: e.target.value,
                      },
                    }))
                  }
                  placeholder="e.g. Technical Highlights"
                />
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                  <label className="admin-label" style={{ margin: 0 }}>Highlights Bullet Items</label>
                  <button
                    type="button"
                    onClick={() =>
                      setForm((p) => ({
                        ...p,
                        technicalHighlights: {
                          ...p.technicalHighlights,
                          items: [...(p.technicalHighlights?.items || []), ''],
                        },
                      }))
                    }
                    className="admin-btn-secondary"
                    style={{ fontSize: '0.75rem', padding: '0.25rem 0.6rem' }}
                  >
                    + Add Highlight
                  </button>
                </div>
                {(form.technicalHighlights?.items || []).map((item, idx) => (
                  <div key={idx} style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
                    <input
                      type="text"
                      className="admin-input"
                      value={item}
                      placeholder={`Highlight point ${idx + 1}`}
                      onChange={(e) => {
                        const list = [...(form.technicalHighlights?.items || [])];
                        list[idx] = e.target.value;
                        setForm((p) => ({
                          ...p,
                          technicalHighlights: { ...p.technicalHighlights, items: list },
                        }));
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const list = (form.technicalHighlights?.items || []).filter((_, i) => i !== idx);
                        setForm((p) => ({
                          ...p,
                          technicalHighlights: { ...p.technicalHighlights, items: list },
                        }));
                      }}
                      className="admin-btn-danger"
                      style={{ padding: '0.45rem 0.65rem' }}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 8: 8. FACILITIES & EQUIPMENT                                          */}
      {/* ========================================================================= */}
      {activeTab === 'facilities' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div style={{ background: '#F8FAFC', padding: '1.25rem', borderRadius: '10px', border: '1px solid #E2E8F0' }}>
            <h3 style={{ margin: '0 0 1rem 0', fontSize: '1rem', fontWeight: 800, color: '#0B1E42', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Wrench size={18} color="#008080" /> Section 8: Facilities & Equipment
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label className="admin-label">Card Title</label>
                  <input
                    type="text"
                    className="admin-input"
                    value={form.facilities?.title || ''}
                    onChange={(e) =>
                      setForm((p) => ({
                        ...p,
                        facilities: { ...p.facilities, title: e.target.value },
                      }))
                    }
                    placeholder="e.g. Facilities & Development Resources"
                  />
                </div>
                <div>
                  <label className="admin-label">Intro Text</label>
                  <input
                    type="text"
                    className="admin-input"
                    value={form.facilities?.intro || ''}
                    onChange={(e) =>
                      setForm((p) => ({
                        ...p,
                        facilities: { ...p.facilities, intro: e.target.value },
                      }))
                    }
                    placeholder="e.g. The Centre supports practical learning through resources such as:"
                  />
                </div>
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                  <label className="admin-label" style={{ margin: 0 }}>Facilities Bullet Items</label>
                  <button
                    type="button"
                    onClick={() =>
                      setForm((p) => ({
                        ...p,
                        facilities: {
                          ...p.facilities,
                          items: [...(p.facilities?.items || []), ''],
                        },
                      }))
                    }
                    className="admin-btn-secondary"
                    style={{ fontSize: '0.75rem', padding: '0.25rem 0.6rem' }}
                  >
                    + Add Facility Item
                  </button>
                </div>
                {(form.facilities?.items || []).map((item, idx) => (
                  <div key={idx} style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
                    <input
                      type="text"
                      className="admin-input"
                      value={item}
                      placeholder={`Facility resource ${idx + 1}`}
                      onChange={(e) => {
                        const list = [...(form.facilities?.items || [])];
                        list[idx] = e.target.value;
                        setForm((p) => ({
                          ...p,
                          facilities: { ...p.facilities, items: list },
                        }));
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const list = (form.facilities?.items || []).filter((_, i) => i !== idx);
                        setForm((p) => ({
                          ...p,
                          facilities: { ...p.facilities, items: list },
                        }));
                      }}
                      className="admin-btn-danger"
                      style={{ padding: '0.45rem 0.65rem' }}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 9: 9. PARTNERS                                                        */}
      {/* ========================================================================= */}
      {activeTab === 'partners' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 800, color: '#0B1E42', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Building2 size={18} color="#008080" /> Section 9: External Programmes & Learning Partners
              </h3>
              <p style={{ margin: '0.2rem 0 0', fontSize: '0.8rem', color: '#64748B' }}>
                Collaborative ecosystem partners and technical learning platforms.
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                setForm((p) => ({
                  ...p,
                  learningPartners: {
                    ...p.learningPartners,
                    partners: [
                      ...(p.learningPartners?.partners || []),
                      {
                        name: 'New Partner Name',
                        description: 'Describe the partner association and learning support...',
                      },
                    ],
                  },
                }));
              }}
              className="admin-btn-secondary"
              style={{ fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}
            >
              <Plus size={14} /> Add Partner
            </button>
          </div>

          <div>
            <label className="admin-label">Section Heading</label>
            <input
              type="text"
              className="admin-input"
              value={form.learningPartners?.title || ''}
              onChange={(e) =>
                setForm((p) => ({
                  ...p,
                  learningPartners: { ...p.learningPartners, title: e.target.value },
                }))
              }
              placeholder="e.g. External Programmes & Learning Partners"
            />
          </div>

          {(form.learningPartners?.partners || []).map((partner, idx) => (
            <div
              key={idx}
              style={{
                background: '#F8FAFC',
                padding: '1.15rem',
                borderRadius: '10px',
                border: '1px solid #E2E8F0',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.8rem',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontWeight: 800, fontSize: '0.9rem', color: '#008080' }}>
                  Partner #{idx + 1}
                </span>
                <button
                  type="button"
                  onClick={() => {
                    const list = (form.learningPartners?.partners || []).filter((_, i) => i !== idx);
                    setForm((p) => ({
                      ...p,
                      learningPartners: { ...p.learningPartners, partners: list },
                    }));
                  }}
                  className="admin-btn-danger"
                  style={{ fontSize: '0.75rem', padding: '0.3rem 0.6rem' }}
                >
                  <Trash2 size={13} /> Delete Partner
                </button>
              </div>

              <div>
                <label className="admin-label">Partner Name</label>
                <input
                  type="text"
                  className="admin-input"
                  value={partner.name}
                  onChange={(e) => {
                    const list = [...(form.learningPartners?.partners || [])];
                    list[idx] = { ...list[idx], name: e.target.value };
                    setForm((p) => ({
                      ...p,
                      learningPartners: { ...p.learningPartners, partners: list },
                    }));
                  }}
                  placeholder="e.g. EduSkills / AICTE ATAL Academy"
                />
              </div>
              <div>
                <label className="admin-label">Description</label>
                <textarea
                  className="admin-textarea"
                  rows={2}
                  value={partner.description}
                  onChange={(e) => {
                    const list = [...(form.learningPartners?.partners || [])];
                    list[idx] = { ...list[idx], description: e.target.value };
                    setForm((p) => ({
                      ...p,
                      learningPartners: { ...p.learningPartners, partners: list },
                    }));
                  }}
                  placeholder="Partner description..."
                />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 10: 10. VISUAL DOCUMENTATION (GALLERY)                                */}
      {/* ========================================================================= */}
      {activeTab === 'gallery' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div style={{ background: '#F8FAFC', padding: '1.25rem', borderRadius: '10px', border: '1px solid #E2E8F0' }}>
            <h3 style={{ margin: '0 0 1rem 0', fontSize: '1rem', fontWeight: 800, color: '#0B1E42', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <ImageIcon size={18} color="#008080" /> Section 10: Visual Documentation & Gallery
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.25rem' }}>
              <div>
                <label className="admin-label">Gallery Heading</label>
                <input
                  type="text"
                  className="admin-input"
                  value={form.gallery?.title || ''}
                  onChange={(e) =>
                    setForm((p) => ({
                      ...p,
                      gallery: { ...p.gallery, title: e.target.value },
                    }))
                  }
                  placeholder="e.g. Gallery"
                />
              </div>
              <div>
                <label className="admin-label">Gallery Caption / Subtitle</label>
                <input
                  type="text"
                  className="admin-input"
                  value={form.gallery?.caption || ''}
                  onChange={(e) =>
                    setForm((p) => ({
                      ...p,
                      gallery: { ...p.gallery, caption: e.target.value },
                    }))
                  }
                  placeholder="e.g. Faculty-led Embedded Systems Workshop"
                />
              </div>
            </div>

            {/* Gallery Photos Uploader */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                <label className="admin-label" style={{ margin: 0 }}>
                  Gallery Photos ({(form.gallery?.photos || []).length})
                </label>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '1rem', marginBottom: '1.25rem' }}>
                {(form.gallery?.photos || []).map((photo, idx) => (
                  <div
                    key={idx}
                    style={{
                      background: '#FFFFFF',
                      border: '1px solid #E2E8F0',
                      borderRadius: '8px',
                      padding: '0.75rem',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.5rem',
                    }}
                  >
                    <div style={{ position: 'relative', width: '100%', height: '140px', borderRadius: '6px', overflow: 'hidden', background: '#F1F5F9' }}>
                      <img
                        src={photo.imageUrl}
                        alt={photo.caption || `Photo ${idx + 1}`}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                    </div>
                    <input
                      type="text"
                      className="admin-input"
                      style={{ fontSize: '0.8rem', padding: '0.35rem 0.6rem' }}
                      value={photo.caption || ''}
                      placeholder="Photo Caption..."
                      onChange={(e) => {
                        const list = [...(form.gallery?.photos || [])];
                        list[idx] = { ...list[idx], caption: e.target.value };
                        setForm((p) => ({
                          ...p,
                          gallery: { ...p.gallery, photos: list },
                        }));
                      }}
                    />
                    <button
                      type="button"
                      onClick={async () => {
                        if (!confirm('Remove this photo?')) return;
                        try {
                          if (photo.storagePath) await deleteFile(photo.storagePath);
                        } catch {
                          // ignore storage delete errors
                        }
                        const list = (form.gallery?.photos || []).filter((_, i) => i !== idx);
                        setForm((p) => ({
                          ...p,
                          gallery: { ...p.gallery, photos: list },
                        }));
                      }}
                      className="admin-btn-danger"
                      style={{ fontSize: '0.75rem', padding: '0.35rem 0.6rem', alignSelf: 'flex-end' }}
                    >
                      <Trash2 size={13} /> Remove Photo
                    </button>
                  </div>
                ))}
              </div>

              {/* Upload New Photo */}
              <div style={{ background: '#FFFFFF', border: '1px dashed #94A3B8', borderRadius: '8px', padding: '1rem' }}>
                <p style={{ margin: '0 0 0.5rem 0', fontSize: '0.85rem', fontWeight: 700, color: '#0B1E42' }}>
                  + Upload New Workshop / Lab Photo
                </p>
                <ImageUploader
                  folder="differentiators/microchip"
                  onUploaded={(res: UploadResult) => {
                    setForm((p) => ({
                      ...p,
                      gallery: {
                        ...p.gallery,
                        photos: [
                          ...(p.gallery?.photos || []),
                          {
                            imageUrl: res.url,
                            storagePath: res.path,
                            caption: `Microchip Workshop Photo ${(p.gallery?.photos || []).length + 1}`,
                          },
                        ],
                      },
                    }));
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 11: 11. DYNAMIC CUSTOM SECTIONS                                       */}
      {/* ========================================================================= */}
      {activeTab === 'custom-sections' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div>
            <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 800, color: '#0B1E42', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Layers size={18} color="#008080" /> Section 11: New Custom Dynamic Sections
            </h3>
            <p className="admin-field__hint" style={{ margin: '0.25rem 0 1rem 0' }}>
              Kept clean for when a brand new dynamic section or accordion is required in the future. Click "+ Add Section" below to create one anytime.
            </p>
          </div>

          <CustomSectionEditor
            sections={form.customSections || []}
            onChange={(next) => setForm((p) => ({ ...p, customSections: next }))}
            rootSections={form.customSections || []}
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
      )}

      {/* Bottom Save Bar */}
      <div
        style={{
          marginTop: '2rem',
          paddingTop: '1.25rem',
          borderTop: '1px solid #E2E8F0',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem',
        }}
      >
        <div style={{ fontSize: '0.85rem', color: '#64748B', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <CheckCircle2 size={16} color="#10B981" /> All Microchip Embedded System edits reflect live on the website.
        </div>
        <button
          type="button"
          onClick={save}
          disabled={saving}
          className="admin-btn-primary"
          style={{
            padding: '0.65rem 1.75rem',
            background: '#008080',
            borderColor: '#008080',
            fontSize: '0.875rem',
            fontWeight: 800,
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
          }}
        >
          <Save size={16} /> {saving ? 'Saving...' : 'Save All Changes'}
        </button>
      </div>
    </div>
  );
}
