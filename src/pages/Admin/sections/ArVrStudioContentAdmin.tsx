import { useState, useEffect } from 'react';
import {
  Glasses,
  Target,
  Sparkles,
  Layers,
  Wrench,
  Image as ImageIcon,
  UserCheck,
  PhoneCall,
  Send,
  Plus,
  Trash2,
  Save,
  RotateCcw,
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
import {
  arVrStudio,
  type TechInfrastructure,
  type ConceptExperience,
  type FormattedObjective,
  type ArVrFacultyInCharge,
} from '../../Differentiators/arVrStudio.data';

export interface ArVrGalleryPhoto {
  id?: string;
  imageUrl?: string;
  url?: string;
  storagePath?: string;
  caption?: string;
}

export interface ArVrStudioDoc {
  heroCategory: string;
  heroTitle: string;
  heroSubtitle: string;
  aboutTitle: string;
  aboutParagraphs: string[];
  visionTitle: string;
  vision: string;
  missionTitle: string;
  mission: string[];
  objectivesTitle: string;
  objectivesFormatted: FormattedObjective[];
  galleryTitle: string;
  galleryCaption: string;
  galleryPhotos?: ArVrGalleryPhoto[];
  techInfrastructure: {
    title: string;
    groups: TechInfrastructure[];
  };
  contact: {
    title: string;
    name: string;
    address: string[];
    email: string;
    phone: string;
    website?: string;
  };
  keyHighlights: string[];
  conceptExperience: {
    title: string;
    intro: string;
    cards: ConceptExperience[];
  };
  facultyInCharge: ArVrFacultyInCharge;
  cta: {
    title: string;
    subtitle: string;
    btn1: string;
    btn2: string;
    btn3: string;
  };
  customSections?: CustomSection[];
}

interface DifferentiatorItemRecord extends WithId {
  slug: string;
  title: string;
  customSections?: CustomSection[];
}

const DEFAULT_STATE: ArVrStudioDoc = {
  heroCategory: arVrStudio.heroCategory,
  heroTitle: arVrStudio.heroTitle,
  heroSubtitle: arVrStudio.heroSubtitle,
  aboutTitle: arVrStudio.aboutTitle,
  aboutParagraphs: [...arVrStudio.aboutParagraphs],
  visionTitle: arVrStudio.visionTitle,
  vision: arVrStudio.vision,
  missionTitle: arVrStudio.missionTitle,
  mission: [...arVrStudio.mission],
  objectivesTitle: arVrStudio.objectivesTitle,
  objectivesFormatted: arVrStudio.objectivesFormatted.map((o) => ({ ...o })),
  galleryTitle: arVrStudio.galleryTitle,
  galleryCaption: arVrStudio.galleryCaption,
  galleryPhotos: [],
  techInfrastructure: {
    title: arVrStudio.techInfrastructure.title,
    groups: arVrStudio.techInfrastructure.groups.map((g) => ({
      category: g.category,
      items: [...g.items],
    })),
  },
  contact: {
    ...arVrStudio.contact,
    address: [...arVrStudio.contact.address],
  },
  keyHighlights: [...arVrStudio.keyHighlights],
  conceptExperience: {
    title: arVrStudio.conceptExperience.title,
    intro: arVrStudio.conceptExperience.intro,
    cards: arVrStudio.conceptExperience.cards.map((c) => ({ ...c })),
  },
  facultyInCharge: { ...arVrStudio.facultyInCharge },
  cta: { ...arVrStudio.cta },
  customSections: [],
};

type ActiveSubTab =
  | 'overview'
  | 'vision-mission'
  | 'objectives'
  | 'concepts'
  | 'facilities'
  | 'highlights'
  | 'gallery'
  | 'faculty'
  | 'contact'
  | 'cta'
  | 'custom-sections';

export default function ArVrStudioContentAdmin() {
  const { data, loading } = useDocument<ArVrStudioDoc>('settings', 'arVrStudio');
  const { docs: diffItems } = useCollection<DifferentiatorItemRecord>('differentiatorItems');
  const arvrItem = diffItems.find((d: DifferentiatorItemRecord) => d.slug === 'ar-vr-studio');

  const [form, setForm] = useState<ArVrStudioDoc>(DEFAULT_STATE);
  const [hasInitialized, setHasInitialized] = useState(false);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<ActiveSubTab>('overview');

  useEffect(() => {
    if (!loading && !hasInitialized) {
      if (data) {
        setForm({
          heroCategory: data.heroCategory || DEFAULT_STATE.heroCategory,
          heroTitle: data.heroTitle || DEFAULT_STATE.heroTitle,
          heroSubtitle: data.heroSubtitle || DEFAULT_STATE.heroSubtitle,
          aboutTitle: data.aboutTitle || DEFAULT_STATE.aboutTitle,
          aboutParagraphs:
            data.aboutParagraphs && data.aboutParagraphs.length > 0
              ? data.aboutParagraphs
              : DEFAULT_STATE.aboutParagraphs,
          visionTitle: data.visionTitle || DEFAULT_STATE.visionTitle,
          vision: data.vision || DEFAULT_STATE.vision,
          missionTitle: data.missionTitle || DEFAULT_STATE.missionTitle,
          mission: data.mission && data.mission.length > 0 ? data.mission : DEFAULT_STATE.mission,
          objectivesTitle: data.objectivesTitle || DEFAULT_STATE.objectivesTitle,
          objectivesFormatted:
            data.objectivesFormatted && data.objectivesFormatted.length > 0
              ? data.objectivesFormatted
              : DEFAULT_STATE.objectivesFormatted,
          galleryTitle: data.galleryTitle || DEFAULT_STATE.galleryTitle,
          galleryCaption: data.galleryCaption || DEFAULT_STATE.galleryCaption,
          galleryPhotos: data.galleryPhotos || [],
          techInfrastructure: {
            title: data.techInfrastructure?.title || DEFAULT_STATE.techInfrastructure.title,
            groups:
              data.techInfrastructure?.groups && data.techInfrastructure.groups.length > 0
                ? data.techInfrastructure.groups
                : DEFAULT_STATE.techInfrastructure.groups,
          },
          contact: {
            title: data.contact?.title || DEFAULT_STATE.contact.title,
            name: data.contact?.name || DEFAULT_STATE.contact.name,
            address:
              data.contact?.address && data.contact.address.length > 0
                ? data.contact.address
                : DEFAULT_STATE.contact.address,
            email: data.contact?.email || DEFAULT_STATE.contact.email,
            phone: data.contact?.phone || DEFAULT_STATE.contact.phone,
            website: data.contact?.website || DEFAULT_STATE.contact.website,
          },
          keyHighlights:
            data.keyHighlights && data.keyHighlights.length > 0
              ? data.keyHighlights
              : DEFAULT_STATE.keyHighlights,
          conceptExperience: {
            title: data.conceptExperience?.title || DEFAULT_STATE.conceptExperience.title,
            intro: data.conceptExperience?.intro || DEFAULT_STATE.conceptExperience.intro,
            cards:
              data.conceptExperience?.cards && data.conceptExperience.cards.length > 0
                ? data.conceptExperience.cards
                : DEFAULT_STATE.conceptExperience.cards,
          },
          facultyInCharge: {
            name: data.facultyInCharge?.name || DEFAULT_STATE.facultyInCharge.name,
            designation: data.facultyInCharge?.designation || DEFAULT_STATE.facultyInCharge.designation,
            email: data.facultyInCharge?.email || DEFAULT_STATE.facultyInCharge.email,
            mobile: data.facultyInCharge?.mobile || DEFAULT_STATE.facultyInCharge.mobile,
            interests: data.facultyInCharge?.interests || DEFAULT_STATE.facultyInCharge.interests,
          },
          cta: {
            title: data.cta?.title || DEFAULT_STATE.cta.title,
            subtitle: data.cta?.subtitle || DEFAULT_STATE.cta.subtitle,
            btn1: data.cta?.btn1 || DEFAULT_STATE.cta.btn1,
            btn2: data.cta?.btn2 || DEFAULT_STATE.cta.btn2,
            btn3: data.cta?.btn3 || DEFAULT_STATE.cta.btn3,
          },
          customSections: (data.customSections || []).filter((s) => {
            const lower = (s.label || '').toLowerCase();
            const lowerId = (s.id || '').toLowerCase();
            return (
              !lower.includes('overview') &&
              !lower.includes('vision') &&
              !lower.includes('mission') &&
              !lower.includes('objective') &&
              !lower.includes('concept') &&
              !lower.includes('infrastructure') &&
              !lower.includes('facility') &&
              !lower.includes('facilities') &&
              !lower.includes('equipment') &&
              !lower.includes('highlight') &&
              !lower.includes('faculty') &&
              !lower.includes('contact') &&
              !lowerId.includes('overview') &&
              !lowerId.includes('vision') &&
              !lowerId.includes('mission') &&
              !lowerId.includes('objective') &&
              !lowerId.includes('concept') &&
              !lowerId.includes('infrastructure') &&
              !lowerId.includes('facility') &&
              !lowerId.includes('facilities') &&
              !lowerId.includes('equipment') &&
              !lowerId.includes('highlight') &&
              !lowerId.includes('faculty') &&
              !lowerId.includes('contact')
            );
          }),
        });
      }
      setHasInitialized(true);
    }
  }, [data, loading, hasInitialized]);

  const save = async () => {
    setSaving(true);
    try {
      await setDoc(
        doc(db, 'settings', 'arVrStudio'),
        {
          ...form,
          updatedAt: serverTimestamp(),
        },
        { merge: true }
      );

      if (arvrItem?.id) {
        await updateDoc(doc(db, 'differentiatorItems', arvrItem.id), {
          title: form.heroTitle,
          summary: form.heroSubtitle,
          customSections: form.customSections || [],
          updatedAt: serverTimestamp(),
        });
      }

      alert('AR / VR Studio updated successfully! All changes are live on the website.');
    } catch (e) {
      alert(`Couldn't save: ${(e as Error).message}`);
    } finally {
      setSaving(false);
    }
  };

  const resetToDefaults = () => {
    if (confirm('Reset all AR / VR Studio text to default values? You can still edit before saving.')) {
      setForm(DEFAULT_STATE);
    }
  };

  // Gallery handlers
  const handleAddGalleryPhoto = (result: UploadResult) => {
    const newPhoto: ArVrGalleryPhoto = {
      id: `photo-${Date.now()}`,
      imageUrl: result.url,
      url: result.url,
      storagePath: result.path,
      caption: '',
    };
    setForm((prev) => ({
      ...prev,
      galleryPhotos: [...(prev.galleryPhotos || []), newPhoto],
    }));
  };

  const handleRemoveGalleryPhoto = async (idx: number) => {
    const photo = form.galleryPhotos?.[idx];
    if (photo?.storagePath) {
      try {
        await deleteFile(photo.storagePath);
      } catch {
        /* ignore */
      }
    }
    setForm((prev) => ({
      ...prev,
      galleryPhotos: (prev.galleryPhotos || []).filter((_, i) => i !== idx),
    }));
  };

  const handleUpdateGalleryCaption = (idx: number, caption: string) => {
    const photos = [...(form.galleryPhotos || [])];
    if (photos[idx]) {
      photos[idx] = { ...photos[idx], caption };
      setForm((prev) => ({
        ...prev,
        galleryPhotos: photos,
      }));
    }
  };

  // Custom sections handlers matching CustomSectionEditor props
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

  const subTabs: { key: ActiveSubTab; label: string; icon: React.ReactNode }[] = [
    { key: 'overview', label: '1. Overview & Hero', icon: <Glasses size={15} /> },
    { key: 'vision-mission', label: '2. Vision & Mission', icon: <Sparkles size={15} /> },
    { key: 'objectives', label: '3. Core Objectives', icon: <Target size={15} /> },
    { key: 'concepts', label: '4. Concept to Experience', icon: <Layers size={15} /> },
    { key: 'facilities', label: '5. Facilities & Equipment', icon: <Wrench size={15} /> },
    { key: 'highlights', label: '6. Key Highlights', icon: <Sparkles size={15} /> },
    { key: 'gallery', label: '7. Studio Gallery', icon: <ImageIcon size={15} /> },
    { key: 'faculty', label: '8. Faculty In-charge', icon: <UserCheck size={15} /> },
    { key: 'contact', label: '9. Contact Details', icon: <PhoneCall size={15} /> },
    { key: 'cta', label: '10. Call to Action (CTA)', icon: <Send size={15} /> },
    { key: 'custom-sections', label: '11. Custom Sections', icon: <Plus size={15} /> },
  ];

  return (
    <div style={{ background: '#fff', borderRadius: '14px', border: '1px solid #E2E8F0', padding: '1.5rem', marginTop: '1.5rem', boxShadow: '0 4px 16px rgba(0,0,0,0.03)' }}>
      {/* Header bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem', borderBottom: '1px solid #E2E8F0', paddingBottom: '1rem' }}>
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', background: '#0B1E42', color: '#fff', padding: '0.2rem 0.6rem', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 800, marginBottom: '0.4rem' }}>
            <Glasses size={13} /> AR / VR STUDIO
          </div>
          <h2 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#0B1E42', margin: 0 }}>
            Unified Page Content Editor
          </h2>
          <p style={{ fontSize: '0.85rem', color: '#64748B', margin: '0.25rem 0 0 0' }}>
            All sections follow the exact top-to-bottom layout of the public AR / VR Studio differentiator page.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button
            type="button"
            onClick={resetToDefaults}
            className="admin-btn-secondary"
            style={{ fontSize: '0.8rem', padding: '0.5rem 0.9rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}
          >
            <RotateCcw size={14} /> Reset
          </button>
          <button
            type="button"
            onClick={save}
            disabled={saving}
            className="admin-btn-primary"
            style={{ fontSize: '0.85rem', padding: '0.5rem 1.25rem', background: '#008080', borderColor: '#008080', display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 700 }}
          >
            <Save size={15} /> {saving ? 'Saving...' : 'Save All Changes'}
          </button>
        </div>
      </div>

      {/* 11-Toggle Horizontal Bar */}
      <div style={{ display: 'flex', gap: '0.4rem', overflowX: 'auto', paddingBottom: '0.75rem', marginBottom: '1.75rem', borderBottom: '2px solid #F1F5F9' }}>
        {subTabs.map((tab) => {
          const isActive = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActiveTab(tab.key)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.45rem',
                padding: '0.55rem 0.95rem',
                fontSize: '0.825rem',
                fontWeight: 700,
                borderRadius: '8px',
                border: 'none',
                background: isActive ? '#0B1E42' : '#F1F5F9',
                color: isActive ? '#ffffff' : '#475569',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                transition: 'all 0.15s ease',
              }}
            >
              {tab.icon}
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* 1. OVERVIEW & HERO */}
      {activeTab === 'overview' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div style={{ background: '#F8FAFC', padding: '1.25rem', borderRadius: '10px', border: '1px solid #E2E8F0' }}>
            <h4 style={{ margin: '0 0 0.85rem', fontSize: '0.95rem', fontWeight: 800, color: '#0B1E42' }}>
              Hero Banner Content
            </h4>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '0.75rem', marginBottom: '0.75rem' }}>
              <div>
                <label className="admin-label">Hero Category / Eyebrow</label>
                <input
                  type="text"
                  className="admin-input"
                  value={form.heroCategory || ''}
                  onChange={(e) => setForm((p) => ({ ...p, heroCategory: e.target.value }))}
                  placeholder="RESEARCH & SPECIALISED LABS"
                />
              </div>
              <div>
                <label className="admin-label">Studio Title</label>
                <input
                  type="text"
                  className="admin-input"
                  value={form.heroTitle || ''}
                  onChange={(e) => setForm((p) => ({ ...p, heroTitle: e.target.value }))}
                  placeholder="AR / VR Studio"
                />
              </div>
            </div>
            <div>
              <label className="admin-label">Hero Subtitle / Tagline</label>
              <textarea
                className="admin-textarea"
                rows={2}
                value={form.heroSubtitle || ''}
                onChange={(e) => setForm((p) => ({ ...p, heroSubtitle: e.target.value }))}
                placeholder="Transforming ideas into immersive experiences..."
              />
            </div>
          </div>

          <div style={{ background: '#F8FAFC', padding: '1.25rem', borderRadius: '10px', border: '1px solid #E2E8F0' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
              <div>
                <h4 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 800, color: '#0B1E42' }}>
                  About the Studio Overview
                </h4>
                <p style={{ margin: '0.2rem 0 0 0', fontSize: '0.8rem', color: '#64748B' }}>
                  Main lead text displayed in the quote-card section under About.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setForm((p) => ({ ...p, aboutParagraphs: [...p.aboutParagraphs, ''] }))}
                className="admin-btn-secondary"
                style={{ fontSize: '0.78rem' }}
              >
                + Add Paragraph
              </button>
            </div>

            <div style={{ marginBottom: '0.75rem' }}>
              <label className="admin-label">Section Heading</label>
              <input
                type="text"
                className="admin-input"
                value={form.aboutTitle || ''}
                onChange={(e) => setForm((p) => ({ ...p, aboutTitle: e.target.value }))}
                placeholder="ABOUT THE STUDIO"
              />
            </div>

            <label className="admin-label">Paragraphs</label>
            {form.aboutParagraphs.map((para, idx) => (
              <div key={idx} style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.6rem' }}>
                <textarea
                  className="admin-textarea"
                  rows={3}
                  value={para}
                  onChange={(e) => {
                    const list = [...form.aboutParagraphs];
                    list[idx] = e.target.value;
                    setForm((p) => ({ ...p, aboutParagraphs: list }));
                  }}
                />
                <button
                  type="button"
                  onClick={() => {
                    const list = form.aboutParagraphs.filter((_, i) => i !== idx);
                    setForm((p) => ({ ...p, aboutParagraphs: list }));
                  }}
                  className="admin-btn-danger"
                  style={{ alignSelf: 'flex-start' }}
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 2. VISION & MISSION */}
      {activeTab === 'vision-mission' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {/* Vision */}
          <div style={{ background: '#F8FAFC', padding: '1.25rem', borderRadius: '10px', border: '1px solid #E2E8F0' }}>
            <h4 style={{ margin: '0 0 0.75rem', fontSize: '0.95rem', fontWeight: 800, color: '#0B1E42' }}>
              Vision Card
            </h4>
            <div style={{ marginBottom: '0.75rem' }}>
              <label className="admin-label">Vision Eyebrow / Label</label>
              <input
                type="text"
                className="admin-input"
                value={form.visionTitle || ''}
                onChange={(e) => setForm((p) => ({ ...p, visionTitle: e.target.value }))}
                placeholder="Our Vision"
              />
            </div>
            <div>
              <label className="admin-label">Vision Statement</label>
              <textarea
                className="admin-textarea"
                rows={3}
                value={form.vision || ''}
                onChange={(e) => setForm((p) => ({ ...p, vision: e.target.value }))}
                placeholder="To build a vibrant hub for immersive technology..."
              />
            </div>
          </div>

          {/* Mission */}
          <div style={{ background: '#F8FAFC', padding: '1.25rem', borderRadius: '10px', border: '1px solid #E2E8F0' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
              <h4 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 800, color: '#0B1E42' }}>
                Mission Card
              </h4>
              <button
                type="button"
                onClick={() => setForm((p) => ({ ...p, mission: [...p.mission, ''] }))}
                className="admin-btn-secondary"
                style={{ fontSize: '0.78rem' }}
              >
                + Add Mission Point
              </button>
            </div>
            <div style={{ marginBottom: '0.75rem' }}>
              <label className="admin-label">Mission Eyebrow / Label</label>
              <input
                type="text"
                className="admin-input"
                value={form.missionTitle || ''}
                onChange={(e) => setForm((p) => ({ ...p, missionTitle: e.target.value }))}
                placeholder="Our Mission"
              />
            </div>

            <label className="admin-label">Mission Points</label>
            {form.mission.map((item, idx) => (
              <div key={idx} style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <input
                  type="text"
                  className="admin-input"
                  value={item}
                  onChange={(e) => {
                    const list = [...form.mission];
                    list[idx] = e.target.value;
                    setForm((p) => ({ ...p, mission: list }));
                  }}
                />
                <button
                  type="button"
                  onClick={() => {
                    const list = form.mission.filter((_, i) => i !== idx);
                    setForm((p) => ({ ...p, mission: list }));
                  }}
                  className="admin-btn-danger"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. CORE OBJECTIVES */}
      {activeTab === 'objectives' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div style={{ background: '#F8FAFC', padding: '1.25rem', borderRadius: '10px', border: '1px solid #E2E8F0' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
              <div>
                <h4 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 800, color: '#0B1E42' }}>
                  Objectives Header & Cards
                </h4>
                <p style={{ margin: '0.2rem 0 0 0', fontSize: '0.8rem', color: '#64748B' }}>
                  Numbered cards with code, bold title, and description.
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  const nextNum = String(form.objectivesFormatted.length + 1).padStart(2, '0');
                  setForm((p) => ({
                    ...p,
                    objectivesFormatted: [
                      ...p.objectivesFormatted,
                      { code: nextNum, title: '', desc: '' },
                    ],
                  }));
                }}
                className="admin-btn-secondary"
                style={{ fontSize: '0.78rem' }}
              >
                + Add Objective
              </button>
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <label className="admin-label">Section Heading</label>
              <input
                type="text"
                className="admin-input"
                value={form.objectivesTitle || ''}
                onChange={(e) => setForm((p) => ({ ...p, objectivesTitle: e.target.value }))}
                placeholder="Objectives"
              />
            </div>

            {form.objectivesFormatted.map((obj, idx) => (
              <div key={idx} style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '0.85rem', marginBottom: '0.75rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '80px 1fr', gap: '0.6rem', marginBottom: '0.5rem' }}>
                  <div>
                    <label className="admin-label">Code</label>
                    <input
                      type="text"
                      className="admin-input"
                      value={obj.code}
                      onChange={(e) => {
                        const list = [...form.objectivesFormatted];
                        list[idx] = { ...list[idx], code: e.target.value };
                        setForm((p) => ({ ...p, objectivesFormatted: list }));
                      }}
                      placeholder="01"
                    />
                  </div>
                  <div>
                    <label className="admin-label">Title</label>
                    <input
                      type="text"
                      className="admin-input"
                      value={obj.title}
                      onChange={(e) => {
                        const list = [...form.objectivesFormatted];
                        list[idx] = { ...list[idx], title: e.target.value };
                        setForm((p) => ({ ...p, objectivesFormatted: list }));
                      }}
                      placeholder="Build Technical Capability"
                    />
                  </div>
                </div>
                <div style={{ marginBottom: '0.5rem' }}>
                  <label className="admin-label">Description</label>
                  <textarea
                    className="admin-textarea"
                    rows={2}
                    value={obj.desc}
                    onChange={(e) => {
                      const list = [...form.objectivesFormatted];
                      list[idx] = { ...list[idx], desc: e.target.value };
                      setForm((p) => ({ ...p, objectivesFormatted: list }));
                    }}
                    placeholder="Develop practical proficiency in AR/VR development tools..."
                  />
                </div>
                <button
                  type="button"
                  onClick={() => {
                    const list = form.objectivesFormatted.filter((_, i) => i !== idx);
                    setForm((p) => ({ ...p, objectivesFormatted: list }));
                  }}
                  className="admin-btn-danger"
                  style={{ fontSize: '0.75rem' }}
                >
                  <Trash2 size={13} style={{ marginRight: '4px' }} /> Remove Objective
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. CONCEPT TO EXPERIENCE */}
      {activeTab === 'concepts' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div style={{ background: '#F8FAFC', padding: '1.25rem', borderRadius: '10px', border: '1px solid #E2E8F0' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
              <div>
                <h4 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 800, color: '#0B1E42' }}>
                  Concept to Immersive Experience
                </h4>
                <p style={{ margin: '0.2rem 0 0 0', fontSize: '0.8rem', color: '#64748B' }}>
                  Application domain cards with title and description.
                </p>
              </div>
              <button
                type="button"
                onClick={() =>
                  setForm((p) => ({
                    ...p,
                    conceptExperience: {
                      ...p.conceptExperience,
                      cards: [...p.conceptExperience.cards, { title: '', desc: '' }],
                    },
                  }))
                }
                className="admin-btn-secondary"
                style={{ fontSize: '0.78rem' }}
              >
                + Add Experience Card
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1rem' }}>
              <div>
                <label className="admin-label">Section Heading</label>
                <input
                  type="text"
                  className="admin-input"
                  value={form.conceptExperience.title || ''}
                  onChange={(e) =>
                    setForm((p) => ({
                      ...p,
                      conceptExperience: { ...p.conceptExperience, title: e.target.value },
                    }))
                  }
                  placeholder="From Concept to Immersive Experience"
                />
              </div>
              <div>
                <label className="admin-label">Section Intro Text</label>
                <textarea
                  className="admin-textarea"
                  rows={2}
                  value={form.conceptExperience.intro || ''}
                  onChange={(e) =>
                    setForm((p) => ({
                      ...p,
                      conceptExperience: { ...p.conceptExperience, intro: e.target.value },
                    }))
                  }
                  placeholder="The Studio enables students to experiment with interactive environments..."
                />
              </div>
            </div>

            {form.conceptExperience.cards.map((card, idx) => (
              <div key={idx} style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '0.85rem', marginBottom: '0.75rem' }}>
                <div style={{ marginBottom: '0.5rem' }}>
                  <label className="admin-label">Card Title</label>
                  <input
                    type="text"
                    className="admin-input"
                    value={card.title}
                    onChange={(e) => {
                      const list = [...form.conceptExperience.cards];
                      list[idx] = { ...list[idx], title: e.target.value };
                      setForm((p) => ({
                        ...p,
                        conceptExperience: { ...p.conceptExperience, cards: list },
                      }));
                    }}
                    placeholder="Learning & Training"
                  />
                </div>
                <div style={{ marginBottom: '0.5rem' }}>
                  <label className="admin-label">Card Description</label>
                  <textarea
                    className="admin-textarea"
                    rows={2}
                    value={card.desc}
                    onChange={(e) => {
                      const list = [...form.conceptExperience.cards];
                      list[idx] = { ...list[idx], desc: e.target.value };
                      setForm((p) => ({
                        ...p,
                        conceptExperience: { ...p.conceptExperience, cards: list },
                      }));
                    }}
                    placeholder="Interactive simulations and immersive educational experiences."
                  />
                </div>
                <button
                  type="button"
                  onClick={() => {
                    const list = form.conceptExperience.cards.filter((_, i) => i !== idx);
                    setForm((p) => ({
                      ...p,
                      conceptExperience: { ...p.conceptExperience, cards: list },
                    }));
                  }}
                  className="admin-btn-danger"
                  style={{ fontSize: '0.75rem' }}
                >
                  <Trash2 size={13} style={{ marginRight: '4px' }} /> Remove Card
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 5. FACILITIES & EQUIPMENT */}
      {activeTab === 'facilities' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div style={{ background: '#F8FAFC', padding: '1.25rem', borderRadius: '10px', border: '1px solid #E2E8F0' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
              <div>
                <h4 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 800, color: '#0B1E42' }}>
                  Facilities & Equipment / Tech Infrastructure
                </h4>
                <p style={{ margin: '0.2rem 0 0 0', fontSize: '0.8rem', color: '#64748B' }}>
                  Categorized technical gear, high-performance systems, displays, and software.
                </p>
              </div>
              <button
                type="button"
                onClick={() =>
                  setForm((p) => ({
                    ...p,
                    techInfrastructure: {
                      ...p.techInfrastructure,
                      groups: [
                        ...p.techInfrastructure.groups,
                        { category: '', items: [''] },
                      ],
                    },
                  }))
                }
                className="admin-btn-secondary"
                style={{ fontSize: '0.78rem' }}
              >
                + Add Category Group
              </button>
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <label className="admin-label">Section Heading</label>
              <input
                type="text"
                className="admin-input"
                value={form.techInfrastructure.title || 'Facilities & Equipment'}
                onChange={(e) =>
                  setForm((p) => ({
                    ...p,
                    techInfrastructure: { ...p.techInfrastructure, title: e.target.value },
                  }))
                }
                placeholder="Facilities & Equipment"
              />
            </div>

            {form.techInfrastructure.groups.map((grp, gIdx) => (
              <div key={gIdx} style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '0.9rem', marginBottom: '0.85rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.6rem' }}>
                  <div style={{ flex: 1, marginRight: '0.75rem' }}>
                    <label className="admin-label">Category Name</label>
                    <input
                      type="text"
                      className="admin-input"
                      value={grp.category}
                      onChange={(e) => {
                        const groups = [...form.techInfrastructure.groups];
                        groups[gIdx] = { ...groups[gIdx], category: e.target.value };
                        setForm((p) => ({
                          ...p,
                          techInfrastructure: { ...p.techInfrastructure, groups },
                        }));
                      }}
                      placeholder="Immersive Devices"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      const groups = form.techInfrastructure.groups.filter((_, i) => i !== gIdx);
                      setForm((p) => ({
                        ...p,
                        techInfrastructure: { ...p.techInfrastructure, groups },
                      }));
                    }}
                    className="admin-btn-danger"
                    style={{ fontSize: '0.75rem', alignSelf: 'flex-end', marginBottom: '0.2rem' }}
                  >
                    <Trash2 size={13} style={{ marginRight: '4px' }} /> Remove Group
                  </button>
                </div>

                <div style={{ background: '#F8FAFC', padding: '0.75rem', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                    <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#475569' }}>Category Items / Gear</span>
                    <button
                      type="button"
                      onClick={() => {
                        const groups = [...form.techInfrastructure.groups];
                        groups[gIdx] = { ...groups[gIdx], items: [...groups[gIdx].items, ''] };
                        setForm((p) => ({
                          ...p,
                          techInfrastructure: { ...p.techInfrastructure, groups },
                        }));
                      }}
                      className="admin-btn-secondary"
                      style={{ fontSize: '0.72rem', padding: '0.2rem 0.5rem' }}
                    >
                      + Add Item
                    </button>
                  </div>

                  {grp.items.map((it, itIdx) => (
                    <div key={itIdx} style={{ display: 'flex', gap: '0.4rem', marginBottom: '0.4rem' }}>
                      <input
                        type="text"
                        className="admin-input"
                        value={it}
                        onChange={(e) => {
                          const groups = [...form.techInfrastructure.groups];
                          const items = [...groups[gIdx].items];
                          items[itIdx] = e.target.value;
                          groups[gIdx] = { ...groups[gIdx], items };
                          setForm((p) => ({
                            ...p,
                            techInfrastructure: { ...p.techInfrastructure, groups },
                          }));
                        }}
                        placeholder="2 Meta Quest 3 128 GB VR headsets"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const groups = [...form.techInfrastructure.groups];
                          const items = groups[gIdx].items.filter((_, i) => i !== itIdx);
                          groups[gIdx] = { ...groups[gIdx], items };
                          setForm((p) => ({
                            ...p,
                            techInfrastructure: { ...p.techInfrastructure, groups },
                          }));
                        }}
                        className="admin-btn-danger"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 6. KEY HIGHLIGHTS */}
      {activeTab === 'highlights' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div style={{ background: '#F8FAFC', padding: '1.25rem', borderRadius: '10px', border: '1px solid #E2E8F0' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
              <div>
                <h4 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 800, color: '#0B1E42' }}>
                  Key Highlights Section
                </h4>
                <p style={{ margin: '0.2rem 0 0 0', fontSize: '0.8rem', color: '#64748B' }}>
                  Bullet points displayed inside the key highlights card grid and accordion.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setForm((p) => ({ ...p, keyHighlights: [...p.keyHighlights, ''] }))}
                className="admin-btn-secondary"
                style={{ fontSize: '0.78rem' }}
              >
                + Add Highlight
              </button>
            </div>

            <label className="admin-label">Highlights List</label>
            {form.keyHighlights.map((hl, idx) => (
              <div key={idx} style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <input
                  type="text"
                  className="admin-input"
                  value={hl}
                  onChange={(e) => {
                    const list = [...form.keyHighlights];
                    list[idx] = e.target.value;
                    setForm((p) => ({ ...p, keyHighlights: list }));
                  }}
                  placeholder="Centre of Excellence established in August 2024"
                />
                <button
                  type="button"
                  onClick={() => {
                    const list = form.keyHighlights.filter((_, i) => i !== idx);
                    setForm((p) => ({ ...p, keyHighlights: list }));
                  }}
                  className="admin-btn-danger"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 7. STUDIO GALLERY */}
      {activeTab === 'gallery' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div style={{ background: '#F8FAFC', padding: '1.25rem', borderRadius: '10px', border: '1px solid #E2E8F0' }}>
            <h4 style={{ margin: '0 0 0.85rem', fontSize: '0.95rem', fontWeight: 800, color: '#0B1E42' }}>
              Gallery Header & Captions
            </h4>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '0.75rem', marginBottom: '1rem' }}>
              <div>
                <label className="admin-label">Gallery Heading</label>
                <input
                  type="text"
                  className="admin-input"
                  value={form.galleryTitle || ''}
                  onChange={(e) => setForm((p) => ({ ...p, galleryTitle: e.target.value }))}
                  placeholder="Immersive Learning in Action"
                />
              </div>
              <div>
                <label className="admin-label">Gallery Subtitle / Caption</label>
                <input
                  type="text"
                  className="admin-input"
                  value={form.galleryCaption || ''}
                  onChange={(e) => setForm((p) => ({ ...p, galleryCaption: e.target.value }))}
                  placeholder="Students exploring, building, and experiencing AR/VR technologies inside the Studio."
                />
              </div>
            </div>

            <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '1rem', marginTop: '1rem' }}>
              <label className="admin-label" style={{ marginBottom: '0.6rem' }}>
                Upload Studio Photos
              </label>
              <div style={{ maxWidth: '400px' }}>
                <ImageUploader
                  folder="ar-vr-studio/gallery"
                  onUploaded={handleAddGalleryPhoto}
                />
              </div>

              {form.galleryPhotos && form.galleryPhotos.length > 0 && (
                <div style={{ marginTop: '1.25rem' }}>
                  <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#0B1E42', display: 'block', marginBottom: '0.6rem' }}>
                    Uploaded Photos ({form.galleryPhotos.length})
                  </span>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '1rem' }}>
                    {form.galleryPhotos.map((photo, idx) => (
                      <div key={photo.id || idx} style={{ border: '1px solid #E2E8F0', borderRadius: '8px', padding: '0.6rem', background: '#fff' }}>
                        <img
                          src={photo.imageUrl || photo.url}
                          alt={photo.caption || 'Studio Photo'}
                          style={{ width: '100%', height: '140px', objectFit: 'cover', borderRadius: '6px', marginBottom: '0.5rem' }}
                        />
                        <input
                          type="text"
                          className="admin-input"
                          value={photo.caption || ''}
                          onChange={(e) => handleUpdateGalleryCaption(idx, e.target.value)}
                          placeholder="Photo caption (optional)"
                          style={{ fontSize: '0.78rem', marginBottom: '0.4rem' }}
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveGalleryPhoto(idx)}
                          className="admin-btn-danger"
                          style={{ fontSize: '0.75rem', width: '100%', padding: '0.3rem' }}
                        >
                          <Trash2 size={13} style={{ marginRight: '4px' }} /> Remove Photo
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 8. FACULTY IN-CHARGE */}
      {activeTab === 'faculty' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div style={{ background: '#F8FAFC', padding: '1.25rem', borderRadius: '10px', border: '1px solid #E2E8F0' }}>
            <h4 style={{ margin: '0 0 0.85rem', fontSize: '0.95rem', fontWeight: 800, color: '#0B1E42' }}>
              Faculty In-charge Details
            </h4>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              <div>
                <label className="admin-label">Full Name</label>
                <input
                  type="text"
                  className="admin-input"
                  value={form.facultyInCharge.name || ''}
                  onChange={(e) =>
                    setForm((p) => ({
                      ...p,
                      facultyInCharge: { ...p.facultyInCharge, name: e.target.value },
                    }))
                  }
                  placeholder="Mr. Phaneendra Varma Chintalapati"
                />
              </div>
              <div>
                <label className="admin-label">Designation</label>
                <input
                  type="text"
                  className="admin-input"
                  value={form.facultyInCharge.designation || ''}
                  onChange={(e) =>
                    setForm((p) => ({
                      ...p,
                      facultyInCharge: { ...p.facultyInCharge, designation: e.target.value },
                    }))
                  }
                  placeholder="Assistant Professor"
                />
              </div>
              <div>
                <label className="admin-label">Email</label>
                <input
                  type="text"
                  className="admin-input"
                  value={form.facultyInCharge.email || ''}
                  onChange={(e) =>
                    setForm((p) => ({
                      ...p,
                      facultyInCharge: { ...p.facultyInCharge, email: e.target.value },
                    }))
                  }
                  placeholder="chpvarmacse@svecw.edu.in"
                />
              </div>
              <div>
                <label className="admin-label">Mobile</label>
                <input
                  type="text"
                  className="admin-input"
                  value={form.facultyInCharge.mobile || ''}
                  onChange={(e) =>
                    setForm((p) => ({
                      ...p,
                      facultyInCharge: { ...p.facultyInCharge, mobile: e.target.value },
                    }))
                  }
                  placeholder="9948055566"
                />
              </div>
              <div style={{ gridColumn: '1 / -1' }}>
                <label className="admin-label">Areas of Interest</label>
                <input
                  type="text"
                  className="admin-input"
                  value={form.facultyInCharge.interests || ''}
                  onChange={(e) =>
                    setForm((p) => ({
                      ...p,
                      facultyInCharge: { ...p.facultyInCharge, interests: e.target.value },
                    }))
                  }
                  placeholder="AR/VR, XR and Deep Learning"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 9. CONTACT DETAILS */}
      {activeTab === 'contact' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div style={{ background: '#F8FAFC', padding: '1.25rem', borderRadius: '10px', border: '1px solid #E2E8F0' }}>
            <h4 style={{ margin: '0 0 0.85rem', fontSize: '0.95rem', fontWeight: 800, color: '#0B1E42' }}>
              Studio Contact Details
            </h4>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '0.75rem' }}>
              <div>
                <label className="admin-label">Card Title</label>
                <input
                  type="text"
                  className="admin-input"
                  value={form.contact.title || ''}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, contact: { ...p.contact, title: e.target.value } }))
                  }
                  placeholder="Connect with the AR / VR Studio"
                />
              </div>
              <div>
                <label className="admin-label">Department / Centre Name</label>
                <input
                  type="text"
                  className="admin-input"
                  value={form.contact.name || ''}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, contact: { ...p.contact, name: e.target.value } }))
                  }
                  placeholder="AR/VR Studio"
                />
              </div>
              <div>
                <label className="admin-label">Email Address</label>
                <input
                  type="text"
                  className="admin-input"
                  value={form.contact.email || ''}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, contact: { ...p.contact, email: e.target.value } }))
                  }
                  placeholder="avrcoe@svecw.edu.in"
                />
              </div>
              <div>
                <label className="admin-label">Phone / Mobile</label>
                <input
                  type="text"
                  className="admin-input"
                  value={form.contact.phone || ''}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, contact: { ...p.contact, phone: e.target.value } }))
                  }
                  placeholder="+91-9948055566"
                />
              </div>
              <div style={{ gridColumn: '1 / -1' }}>
                <label className="admin-label">Address Lines (one per line)</label>
                <textarea
                  className="admin-textarea"
                  rows={2}
                  value={(form.contact.address || []).join('\n')}
                  onChange={(e) =>
                    setForm((p) => ({
                      ...p,
                      contact: {
                        ...p.contact,
                        address: e.target.value.split('\n').filter(Boolean),
                      },
                    }))
                  }
                  placeholder="Shri Vishnu Engineering College for Women&#10;Vishnupur, Bhimavaram, Andhra Pradesh, India"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 10. CALL TO ACTION (CTA) */}
      {activeTab === 'cta' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div style={{ background: '#F8FAFC', padding: '1.25rem', borderRadius: '10px', border: '1px solid #E2E8F0' }}>
            <h4 style={{ margin: '0 0 0.85rem', fontSize: '0.95rem', fontWeight: 800, color: '#0B1E42' }}>
              Call to Action (Bottom Banner)
            </h4>
            <div style={{ marginBottom: '0.75rem' }}>
              <label className="admin-label">CTA Main Title</label>
              <input
                type="text"
                className="admin-input"
                value={form.cta.title || ''}
                onChange={(e) => setForm((p) => ({ ...p, cta: { ...p.cta, title: e.target.value } }))}
                placeholder="Don’t Just Imagine What’s Next. Build It."
              />
            </div>
            <div style={{ marginBottom: '0.75rem' }}>
              <label className="admin-label">CTA Subtitle / Paragraph</label>
              <textarea
                className="admin-textarea"
                rows={2}
                value={form.cta.subtitle || ''}
                onChange={(e) => setForm((p) => ({ ...p, cta: { ...p.cta, subtitle: e.target.value } }))}
                placeholder="At VWU, emerging technologies become spaces to experiment..."
              />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.75rem' }}>
              <div>
                <label className="admin-label">Button 1 Label</label>
                <input
                  type="text"
                  className="admin-input"
                  value={form.cta.btn1 || ''}
                  onChange={(e) => setForm((p) => ({ ...p, cta: { ...p.cta, btn1: e.target.value } }))}
                  placeholder="Explore More Differentiators"
                />
              </div>
              <div>
                <label className="admin-label">Button 2 Label</label>
                <input
                  type="text"
                  className="admin-input"
                  value={form.cta.btn2 || ''}
                  onChange={(e) => setForm((p) => ({ ...p, cta: { ...p.cta, btn2: e.target.value } }))}
                  placeholder="Discover Academics"
                />
              </div>
              <div>
                <label className="admin-label">Button 3 Label</label>
                <input
                  type="text"
                  className="admin-input"
                  value={form.cta.btn3 || ''}
                  onChange={(e) => setForm((p) => ({ ...p, cta: { ...p.cta, btn3: e.target.value } }))}
                  placeholder="Apply to VWU"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 11. CUSTOM SECTIONS */}
      {activeTab === 'custom-sections' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div style={{ background: '#F8FAFC', padding: '1.25rem', borderRadius: '10px', border: '1px solid #E2E8F0' }}>
            <h4 style={{ margin: '0 0 0.4rem', fontSize: '0.95rem', fontWeight: 800, color: '#0B1E42' }}>
              Dynamic Custom Accordions / Extra Sections
            </h4>
            <p style={{ margin: '0 0 1rem', fontSize: '0.825rem', color: '#64748B' }}>
              This section is intentionally empty by default. Use it whenever a new custom accordion or dynamic block is needed on the AR / VR Studio page.
            </p>

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
        </div>
      )}
    </div>
  );
}
