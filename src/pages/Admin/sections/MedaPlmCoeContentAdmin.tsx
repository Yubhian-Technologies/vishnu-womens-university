import { useEffect, useState } from 'react';
import { doc, serverTimestamp } from 'firebase/firestore';
import { setDoc } from '../../../lib/auditLog';
import { db } from '../../../lib/firebase';
import { useDocument } from '../../../hooks/useDocument';
import { deleteFile, type UploadResult } from '../../../lib/storage';
import {
  medaPlmCoe,
  type MedaSoftwarePlatform,
  type MedaGlanceItem,
} from '../../Differentiators/medaPlmCoe.data';
import {
  Boxes,
  Cpu,
  Layers,
  Handshake,
  Sparkles,
  BookOpen,
  Workflow,
  Database,
  Award,
  Plus,
  Trash2,
  Save,
  RotateCcw,
  CheckCircle,
  Settings,
  Building2,
} from 'lucide-react';
import CustomSectionEditor from './CustomSectionEditor';
import { replaceAtPath, getAtPath, type CustomSection } from '../../../lib/customSections';

export interface CustomMedaSection extends CustomSection {
  title?: string;
  badge?: string;
  paragraphs?: string[];
  bulletPoints?: string[];
}

export interface MedaPlmCoeDoc {
  hero?: {
    category?: string;
    title?: string;
    subtitle?: string;
  };
  glance?: MedaGlanceItem[];
  collaboration?: {
    title?: string;
    paragraphs?: string[];
  };
  meda?: {
    heading?: string;
    intro?: string;
    softwarePlatformsHeading?: string;
    softwarePlatforms?: MedaSoftwarePlatform[];
    learningAreasHeading?: string;
    learningAreas?: string[];
    closing?: string;
  };
  plm?: {
    heading?: string;
    intro?: string;
    trainingHeading?: string;
    trainingItems?: string[];
    teamcenter?: {
      heading?: string;
      description?: string;
    };
  };
  outcomes?: {
    heading?: string;
    intro?: string;
    opportunitiesHeading?: string;
    opportunities?: string[];
    closing?: string;
  };
  highlights?: string[];
  achievements?: string[];
  facilities?: string[];
  partners?: string[];
  additionalSections?: CustomMedaSection[];
}

function normalizeCustomSection(sec: any): CustomMedaSection {
  const label = sec.label || sec.title || 'Navigation Section';
  const title = sec.title || label;
  const badge = sec.badge || sec.subtitle || '';
  const textContent = sec.textContent !== undefined ? sec.textContent : (Array.isArray(sec.paragraphs) ? sec.paragraphs.join('\n') : '');
  const listText = sec.listText !== undefined ? sec.listText : (Array.isArray(sec.bulletPoints) ? sec.bulletPoints.join('\n') : '');
  const paragraphs = sec.paragraphs || (textContent ? textContent.split('\n').filter(Boolean) : []);
  const bulletPoints = sec.bulletPoints || (listText ? listText.split('\n').filter(Boolean) : []);
  const contentType = sec.contentType || (listText.trim() ? 'list' : 'text');
  return {
    id: sec.id || `section-${Date.now()}`,
    label,
    title,
    badge,
    subtitle: badge,
    contentType,
    textContent,
    listText,
    paragraphs,
    bulletPoints,
    tableText: sec.tableText || '',
    linksText: sec.linksText || '',
    files: sec.files || [],
    subSections: Array.isArray(sec.subSections) ? sec.subSections.map(normalizeCustomSection) : [],
    subSectionsDisplay: sec.subSectionsDisplay,
    placement: sec.placement,
    boldHeading: sec.boldHeading,
    photo: sec.photo,
    galleryPhotos: sec.galleryPhotos,
    imageCards: sec.imageCards,
    contacts: sec.contacts,
  };
}

const DEFAULT_HIGHLIGHTS = [
  'MoU partnership with Capgemini',
  'MEDA: 3D modelling, parametric design, FEA, GD&T, design for manufacturing',
  'PLM: product structure, BOM, CAD-PLM integration, Siemens Teamcenter',
  'Training tools: CATIA, Siemens NX CAD, ANSYS, Siemens Teamcenter',
  'Graduates eligible for Capgemini internships and placements',
  'Industry-ready credentials upon completion',
];

const DEFAULT_ACHIEVEMENTS = [
  'Students receive industry-ready credentials upon completion',
  'Mentorship from Capgemini industry experts',
  'Internship and placement opportunities with Capgemini',
];

const DEFAULT_FACILITIES = [
  'CATIA',
  'Siemens NX CAD',
  'ANSYS',
  'Siemens Teamcenter',
];

const DEFAULT_PARTNERS = [
  'Capgemini',
];

const DEFAULT_STATE: MedaPlmCoeDoc = {
  hero: { ...medaPlmCoe.hero },
  glance: medaPlmCoe.glance.map((g) => ({ ...g })),
  collaboration: {
    title: medaPlmCoe.collaboration.title,
    paragraphs: [...medaPlmCoe.collaboration.paragraphs],
  },
  meda: {
    heading: medaPlmCoe.meda.heading,
    intro: medaPlmCoe.meda.intro,
    softwarePlatformsHeading: medaPlmCoe.meda.softwarePlatformsHeading,
    softwarePlatforms: medaPlmCoe.meda.softwarePlatforms.map((s) => ({ ...s })),
    learningAreasHeading: medaPlmCoe.meda.learningAreasHeading,
    learningAreas: [...medaPlmCoe.meda.learningAreas],
    closing: medaPlmCoe.meda.closing,
  },
  plm: {
    heading: medaPlmCoe.plm.heading,
    intro: medaPlmCoe.plm.intro,
    trainingHeading: medaPlmCoe.plm.trainingHeading,
    trainingItems: [...medaPlmCoe.plm.trainingItems],
    teamcenter: { ...medaPlmCoe.plm.teamcenter },
  },
  outcomes: {
    heading: medaPlmCoe.outcomes.heading,
    intro: medaPlmCoe.outcomes.intro,
    opportunitiesHeading: medaPlmCoe.outcomes.opportunitiesHeading,
    opportunities: [...medaPlmCoe.outcomes.opportunities],
    closing: medaPlmCoe.outcomes.closing,
  },
  highlights: [...DEFAULT_HIGHLIGHTS],
  achievements: [...DEFAULT_ACHIEVEMENTS],
  facilities: [...DEFAULT_FACILITIES],
  partners: [...DEFAULT_PARTNERS],
  additionalSections: [],
};

function getNonEmptyList(arr?: string[], fallback: string[] = []): string[] {
  if (!arr || !Array.isArray(arr)) return fallback;
  const filtered = arr.filter((item) => item && typeof item === 'string' && item.trim().length > 0);
  return filtered.length > 0 ? filtered : fallback;
}

export default function MedaPlmCoeContentAdmin() {
  const { data, loading } = useDocument<MedaPlmCoeDoc>('settings', 'medaPlmCoe');
  const { data: diffDoc } = useDocument<any>('differentiatorItems', 'meda-plm-coe');
  const [form, setForm] = useState<MedaPlmCoeDoc>(DEFAULT_STATE);
  const [hasInitialized, setHasInitialized] = useState(false);
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    if (!loading && !hasInitialized) {
      const extractFromDiffDoc = (secId: string, legacyField?: string): string[] => {
        if (diffDoc?.customSections && Array.isArray(diffDoc.customSections)) {
          const found = diffDoc.customSections.find((s: any) => s.id === secId || s.label?.toLowerCase()?.includes(secId));
          if (found?.listText) {
            const parsed = found.listText.split('\n').map((l: string) => l.trim()).filter(Boolean);
            if (parsed.length > 0) return parsed;
          }
        }
        if (legacyField && diffDoc?.[legacyField] && Array.isArray(diffDoc[legacyField])) {
          const parsed = (diffDoc[legacyField] as string[]).filter((l: string) => l && l.trim());
          if (parsed.length > 0) return parsed;
        }
        return [];
      };

      const initialHighlights = getNonEmptyList(data?.highlights, getNonEmptyList(extractFromDiffDoc('highlights', 'highlights'), DEFAULT_HIGHLIGHTS));
      const initialAchievements = getNonEmptyList(data?.achievements, getNonEmptyList(extractFromDiffDoc('outcomes', 'outcomes'), DEFAULT_ACHIEVEMENTS));
      const initialFacilities = getNonEmptyList(data?.facilities, getNonEmptyList(extractFromDiffDoc('facilities', 'facilities'), DEFAULT_FACILITIES));
      const initialPartners = getNonEmptyList(data?.partners, getNonEmptyList(extractFromDiffDoc('partners', 'partners'), DEFAULT_PARTNERS));

      setForm({
        hero: { ...DEFAULT_STATE.hero, ...(data?.hero || {}) },
        glance: data?.glance && data.glance.length > 0 ? data.glance : DEFAULT_STATE.glance,
        collaboration: {
          title: data?.collaboration?.title || DEFAULT_STATE.collaboration?.title,
          paragraphs: getNonEmptyList(data?.collaboration?.paragraphs, DEFAULT_STATE.collaboration?.paragraphs || []),
        },
        meda: {
          heading: data?.meda?.heading || DEFAULT_STATE.meda?.heading,
          intro: data?.meda?.intro || DEFAULT_STATE.meda?.intro,
          softwarePlatformsHeading: data?.meda?.softwarePlatformsHeading || DEFAULT_STATE.meda?.softwarePlatformsHeading,
          softwarePlatforms: data?.meda?.softwarePlatforms && data.meda.softwarePlatforms.length > 0 ? data.meda.softwarePlatforms : DEFAULT_STATE.meda?.softwarePlatforms,
          learningAreasHeading: data?.meda?.learningAreasHeading || DEFAULT_STATE.meda?.learningAreasHeading,
          learningAreas: getNonEmptyList(data?.meda?.learningAreas, DEFAULT_STATE.meda?.learningAreas || []),
          closing: data?.meda?.closing || DEFAULT_STATE.meda?.closing,
        },
        plm: {
          heading: data?.plm?.heading || DEFAULT_STATE.plm?.heading,
          intro: data?.plm?.intro || DEFAULT_STATE.plm?.intro,
          trainingHeading: data?.plm?.trainingHeading || DEFAULT_STATE.plm?.trainingHeading,
          trainingItems: getNonEmptyList(data?.plm?.trainingItems, DEFAULT_STATE.plm?.trainingItems || []),
          teamcenter: { ...DEFAULT_STATE.plm?.teamcenter, ...(data?.plm?.teamcenter || {}) },
        },
        outcomes: {
          heading: data?.outcomes?.heading || DEFAULT_STATE.outcomes?.heading,
          intro: data?.outcomes?.intro || DEFAULT_STATE.outcomes?.intro,
          opportunitiesHeading: data?.outcomes?.opportunitiesHeading || DEFAULT_STATE.outcomes?.opportunitiesHeading,
          opportunities: getNonEmptyList(data?.outcomes?.opportunities, DEFAULT_STATE.outcomes?.opportunities || []),
          closing: data?.outcomes?.closing || DEFAULT_STATE.outcomes?.closing,
        },
        highlights: initialHighlights,
        achievements: initialAchievements,
        facilities: initialFacilities,
        partners: initialPartners,
        additionalSections: (data?.additionalSections || []).map(normalizeCustomSection),
      });
      setHasInitialized(true);
    }
  }, [data, diffDoc, loading, hasInitialized]);

  const save = async () => {
    setSaving(true);
    try {
      const formattedSections: CustomMedaSection[] = (form.additionalSections || []).map((sec) => ({
        ...sec,
        title: sec.label || sec.title || 'Navigation Section',
        badge: sec.subtitle || sec.badge || '',
        paragraphs: sec.textContent ? sec.textContent.split('\n').filter(Boolean) : (sec.paragraphs || []),
        bulletPoints: sec.listText ? sec.listText.split('\n').filter(Boolean) : (sec.bulletPoints || []),
      }));

      const finalHighlights = getNonEmptyList(form.highlights, DEFAULT_HIGHLIGHTS);
      const finalAchievements = getNonEmptyList(form.achievements, DEFAULT_ACHIEVEMENTS);
      const finalFacilities = getNonEmptyList(form.facilities, DEFAULT_FACILITIES);
      const finalPartners = getNonEmptyList(form.partners, DEFAULT_PARTNERS);

      // Custom sections list for live differentiator item sync
      const customSectionsForDifferentiator: CustomSection[] = [
        {
          id: 'highlights',
          label: 'Key Highlights',
          contentType: 'list',
          listText: finalHighlights.join('\n'),
        },
        {
          id: 'outcomes',
          label: 'Additional Achievements',
          contentType: 'list',
          listText: finalAchievements.join('\n'),
        },
        {
          id: 'facilities',
          label: 'Facilities & Equipment',
          contentType: 'list',
          listText: finalFacilities.join('\n'),
        },
        {
          id: 'partners',
          label: 'Partners',
          contentType: 'list',
          listText: finalPartners.join('\n'),
        },
        ...formattedSections,
      ];

      // 1. Save settings/medaPlmCoe doc
      await setDoc(doc(db, 'settings', 'medaPlmCoe'), {
        ...form,
        highlights: finalHighlights,
        achievements: finalAchievements,
        facilities: finalFacilities,
        partners: finalPartners,
        additionalSections: formattedSections,
        updatedAt: serverTimestamp(),
      }, { merge: true });

      // 2. Sync to differentiatorItems/meda-plm-coe doc for live public rendering
      try {
        await setDoc(doc(db, 'differentiatorItems', 'meda-plm-coe'), {
          customSections: customSectionsForDifferentiator,
          highlights: finalHighlights,
          outcomes: finalAchievements,
          facilities: finalFacilities,
          partners: finalPartners,
          updatedAt: serverTimestamp(),
        }, { merge: true });
      } catch (err) {
        console.warn('Could not sync customSections to differentiatorItems/meda-plm-coe:', err);
      }

      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch (e) {
      alert(`Couldn't save: ${(e as Error).message}`);
    } finally {
      setSaving(false);
    }
  };

  const resetToDefaults = () => {
    if (confirm('Reset all MEDA & PLM text to default starting values? You can still edit before saving.')) {
      setForm(DEFAULT_STATE);
    }
  };

  // Custom section path-addressed upload/remove handlers
  const handleCustomSectionFileUploaded = (sectionPath: number[], fileIndex: number, r: UploadResult) => {
    setForm((p) => ({
      ...p,
      additionalSections: replaceAtPath(p.additionalSections || [], sectionPath, (s) => ({
        ...s,
        files: (s.files || []).map((f, i) => (i === fileIndex ? { ...f, fileUrl: r.url, storagePath: r.path } : f)),
      })),
    }));
  };

  const handleCustomSectionFileRemoved = async (sectionPath: number[], fileIndex: number) => {
    const file = getAtPath(form.additionalSections || [], sectionPath)?.files?.[fileIndex];
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
      additionalSections: replaceAtPath(p.additionalSections || [], sectionPath, (s) => ({
        ...s,
        files: (s.files || []).filter((_, i) => i !== fileIndex),
      })),
    }));
  };

  const handleCustomSectionPhotoUploaded = (sectionPath: number[], r: UploadResult) => {
    setForm((p) => ({
      ...p,
      additionalSections: replaceAtPath(p.additionalSections || [], sectionPath, (s) => ({
        ...s,
        photo: { imageUrl: r.url, storagePath: r.path },
      })),
    }));
  };

  const handleCustomSectionPhotoRemoved = async (sectionPath: number[]) => {
    const photo = getAtPath(form.additionalSections || [], sectionPath)?.photo;
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
      additionalSections: replaceAtPath(p.additionalSections || [], sectionPath, (s) => {
        const next = { ...s };
        delete next.photo;
        return next;
      }),
    }));
  };

  const handleCustomSectionGalleryPhotoUploaded = (sectionPath: number[], photoIndex: number, r: UploadResult) => {
    setForm((p) => ({
      ...p,
      additionalSections: replaceAtPath(p.additionalSections || [], sectionPath, (s) => ({
        ...s,
        galleryPhotos: (s.galleryPhotos || []).map((ph, i) => (i === photoIndex ? { imageUrl: r.url, storagePath: r.path } : ph)),
      })),
    }));
  };

  const handleCustomSectionGalleryPhotoRemoved = async (sectionPath: number[], photoIndex: number) => {
    const photo = getAtPath(form.additionalSections || [], sectionPath)?.galleryPhotos?.[photoIndex];
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
      additionalSections: replaceAtPath(p.additionalSections || [], sectionPath, (s) => ({
        ...s,
        galleryPhotos: (s.galleryPhotos || []).filter((_, i) => i !== photoIndex),
      })),
    }));
  };

  if (loading && !hasInitialized) {
    return <p className="admin-loading">Loading MEDA & PLM CoE Content Editor…</p>;
  }

  return (
    <div className="admin-section">
      <div className="admin-card">
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '1.25rem', borderBottom: '1px solid #e5e7eb', paddingBottom: '1rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Boxes size={22} color="#008080" />
              <h2 className="admin-card__title" style={{ margin: 0, padding: 0, border: 'none' }}>
                MEDA &amp; PLM Centre of Excellence Management
              </h2>
            </div>
            <p className="admin-field__hint" style={{ margin: '0.35rem 0 0', fontSize: '0.85rem' }}>
              Manage all content, modules, software tools, training topics, highlights, facilities, and custom extra sections in the <strong>exact top-to-bottom order</strong> as displayed on the live public page.
            </p>
          </div>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button type="button" onClick={resetToDefaults} className="admin-btn admin-btn--sm admin-btn--ghost">
              <RotateCcw size={14} /> Reset Defaults
            </button>
            <button type="button" onClick={save} disabled={saving} className="admin-btn admin-btn--sm admin-btn--primary">
              <Save size={14} /> {saving ? 'Saving...' : 'Save All Changes'}
            </button>
          </div>
        </div>

        {savedSuccess && (
          <div style={{ background: '#ecfdf5', border: '1px solid #a7f3d0', padding: '0.75rem 1rem', borderRadius: '8px', color: '#065f46', fontSize: '0.85rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <CheckCircle size={16} /> Saved and published live to MEDA &amp; PLM CoE page!
          </div>
        )}

        {/* Top Jump Bar (Exact Public Page Top-to-Bottom Order) */}
        <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '0.65rem 1rem', marginBottom: '1.75rem', display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap', fontSize: '0.82rem' }}>
          <strong style={{ color: '#475569', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <Layers size={14} /> Jump to Section (Public Page Order):
          </strong>
          <a href="#sec-glance" style={{ color: '#0284c7', textDecoration: 'none', fontWeight: 600 }}>1. Centre at a Glance</a> •
          <a href="#sec-mou" style={{ color: '#0284c7', textDecoration: 'none', fontWeight: 600 }}>2. MoU &amp; Capgemini Collaboration</a> •
          <a href="#sec-meda" style={{ color: '#0284c7', textDecoration: 'none', fontWeight: 600 }}>3. Section 01: MEDA Automation</a> •
          <a href="#sec-plm" style={{ color: '#0284c7', textDecoration: 'none', fontWeight: 600 }}>4. Section 02: PLM &amp; Teamcenter</a> •
          <a href="#sec-outcomes" style={{ color: '#0284c7', textDecoration: 'none', fontWeight: 600 }}>5. Section 03: Outcomes &amp; Opportunities</a> •
          <a href="#sec-highlights" style={{ color: '#0284c7', textDecoration: 'none', fontWeight: 600 }}>6. Key Highlights &amp; Achievements</a> •
          <a href="#sec-facilities" style={{ color: '#0284c7', textDecoration: 'none', fontWeight: 600 }}>7. Facilities &amp; Industry Partners</a> •
          <a href="#sec-custom" style={{ color: '#0284c7', textDecoration: 'none', fontWeight: 600 }}>8. Additional Navigation Sections</a>
        </div>

        {/* SECTION 1: CENTRE AT A GLANCE (4 BADGES) */}
        <div id="sec-glance" style={{ background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '10px', padding: '1.25rem', marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem', borderBottom: '2px solid #e2e8f0', paddingBottom: '0.5rem' }}>
            <Cpu size={18} color="#0284c7" />
            <h3 style={{ margin: 0, fontSize: '1.05rem', color: '#0f172a' }}>1. Centre at a Glance (4 Key Stat Badges)</h3>
          </div>
          <p className="admin-field__hint" style={{ marginBottom: '1rem' }}>
            These 4 badges display prominently at the top of the MEDA &amp; PLM CoE page.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '0.75rem' }}>
            {(form.glance || []).map((item, idx) => (
              <div key={idx} style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '0.75rem' }}>
                <strong style={{ fontSize: '0.82rem', color: '#0369a1', display: 'block', marginBottom: '0.4rem' }}>
                  Badge #{idx + 1}
                </strong>
                <div className="admin-field" style={{ marginBottom: '0.4rem' }}>
                  <label style={{ fontSize: '0.75rem' }}>Title (e.g. 3 Software Platforms)</label>
                  <input
                    type="text"
                    value={item.title}
                    onChange={(e) => {
                      const list = [...(form.glance || [])];
                      list[idx] = { ...list[idx], title: e.target.value };
                      setForm((p) => ({ ...p, glance: list }));
                    }}
                    className="admin-input"
                    style={{ fontWeight: 700 }}
                  />
                </div>
                <div className="admin-field">
                  <label style={{ fontSize: '0.75rem' }}>Subtitle (e.g. AutoCAD, Creo &amp; Ansys)</label>
                  <input
                    type="text"
                    value={item.subtitle}
                    onChange={(e) => {
                      const list = [...(form.glance || [])];
                      list[idx] = { ...list[idx], subtitle: e.target.value };
                      setForm((p) => ({ ...p, glance: list }));
                    }}
                    className="admin-input"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* SECTION 2: MOU & CAPGEMINI COLLABORATION */}
        <div id="sec-mou" style={{ background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '10px', padding: '1.25rem', marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem', borderBottom: '2px solid #e2e8f0', paddingBottom: '0.5rem' }}>
            <Handshake size={18} color="#0284c7" />
            <h3 style={{ margin: 0, fontSize: '1.05rem', color: '#0f172a' }}>2. Capgemini Collaboration MoU Banner</h3>
          </div>

          <div className="admin-form-grid">
            <div className="admin-field" style={{ gridColumn: '1 / -1' }}>
              <label style={{ fontWeight: 600 }}>MoU Section Title</label>
              <input
                type="text"
                value={form.collaboration?.title || ''}
                onChange={(e) => setForm((p) => ({ ...p, collaboration: { ...p.collaboration, title: e.target.value } }))}
                className="admin-input"
                placeholder="Industry Collaboration & Excellence — Capgemini MoU"
              />
            </div>
            <div className="admin-field" style={{ gridColumn: '1 / -1' }}>
              <label style={{ fontWeight: 600 }}>Collaboration Lead Paragraphs (One per line)</label>
              <textarea
                value={(form.collaboration?.paragraphs || []).join('\n')}
                onChange={(e) => setForm((p) => ({ ...p, collaboration: { ...p.collaboration, paragraphs: e.target.value.split('\n') } }))}
                className="admin-input"
                rows={4}
                style={{ width: '100%', fontFamily: 'inherit' }}
              />
            </div>
          </div>
        </div>

        {/* SECTION 3: SECTION 01 - MEDA AUTOMATION */}
        <div id="sec-meda" style={{ background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '10px', padding: '1.25rem', marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem', borderBottom: '2px solid #e2e8f0', paddingBottom: '0.5rem' }}>
            <Workflow size={18} color="#0284c7" />
            <h3 style={{ margin: 0, fontSize: '1.05rem', color: '#0f172a' }}>3. Section 01: Mechanical Engineering Design Automation (MEDA)</h3>
          </div>

          <div className="admin-form-grid" style={{ marginBottom: '1.25rem' }}>
            <div className="admin-field" style={{ gridColumn: '1 / -1' }}>
              <label style={{ fontWeight: 600 }}>Section 01 Heading</label>
              <input
                type="text"
                value={form.meda?.heading || ''}
                onChange={(e) => setForm((p) => ({ ...p, meda: { ...p.meda, heading: e.target.value } }))}
                className="admin-input"
              />
            </div>
            <div className="admin-field" style={{ gridColumn: '1 / -1' }}>
              <label style={{ fontWeight: 600 }}>MEDA Introduction Text</label>
              <textarea
                value={form.meda?.intro || ''}
                onChange={(e) => setForm((p) => ({ ...p, meda: { ...p.meda, intro: e.target.value } }))}
                className="admin-input"
                rows={3}
                style={{ width: '100%', fontFamily: 'inherit' }}
              />
            </div>
          </div>

          {/* Software Platforms Sub-Card */}
          <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '1rem', marginBottom: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
              <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#0369a1', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <Cpu size={16} /> Software Platforms &amp; CAD/CAM Tools ({form.meda?.softwarePlatforms?.length || 0})
              </div>
              <button
                type="button"
                onClick={() => {
                  setForm((p) => ({ ...p, meda: { ...p.meda, softwarePlatforms: [...(p.meda?.softwarePlatforms || []), { name: '', description: '' }] } }));
                }}
                className="admin-btn admin-btn--sm admin-btn--ghost"
              >
                <Plus size={13} /> Add Software Tool
              </button>
            </div>

            <div className="admin-field" style={{ marginBottom: '0.75rem' }}>
              <label style={{ fontSize: '0.78rem', fontWeight: 600 }}>Software Platforms Subheading</label>
              <input
                type="text"
                value={form.meda?.softwarePlatformsHeading || ''}
                onChange={(e) => setForm((p) => ({ ...p, meda: { ...p.meda, softwarePlatformsHeading: e.target.value } }))}
                className="admin-input"
              />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {(form.meda?.softwarePlatforms || []).map((tool, idx) => (
                <div key={idx} style={{ background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '6px', padding: '0.65rem', display: 'grid', gridTemplateColumns: '200px 1fr auto', gap: '0.5rem', alignItems: 'center' }}>
                  <input
                    type="text"
                    value={tool.name}
                    onChange={(e) => {
                      const list = [...(form.meda?.softwarePlatforms || [])];
                      list[idx] = { ...list[idx], name: e.target.value };
                      setForm((p) => ({ ...p, meda: { ...p.meda, softwarePlatforms: list } }));
                    }}
                    placeholder="Tool Name (e.g. PTC Creo)"
                    className="admin-input"
                    style={{ fontSize: '0.82rem', fontWeight: 700 }}
                  />
                  <input
                    type="text"
                    value={tool.description}
                    onChange={(e) => {
                      const list = [...(form.meda?.softwarePlatforms || [])];
                      list[idx] = { ...list[idx], description: e.target.value };
                      setForm((p) => ({ ...p, meda: { ...p.meda, softwarePlatforms: list } }));
                    }}
                    placeholder="Tool Description..."
                    className="admin-input"
                    style={{ fontSize: '0.82rem' }}
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const list = (form.meda?.softwarePlatforms || []).filter((_, i) => i !== idx);
                      setForm((p) => ({ ...p, meda: { ...p.meda, softwarePlatforms: list } }));
                    }}
                    style={{ background: 'none', border: 'none', color: '#dc2626', cursor: 'pointer', padding: '0.2rem' }}
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Key Areas of Learning Sub-Card */}
          <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '1rem', marginBottom: '1.25rem' }}>
            <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#0369a1', display: 'flex', alignItems: 'center', gap: '0.35rem', marginBottom: '0.75rem' }}>
              <BookOpen size={16} /> Key Areas of Learning List
            </div>

            <div className="admin-field" style={{ marginBottom: '0.75rem' }}>
              <label style={{ fontSize: '0.78rem', fontWeight: 600 }}>Learning Areas Subheading</label>
              <input
                type="text"
                value={form.meda?.learningAreasHeading || ''}
                onChange={(e) => setForm((p) => ({ ...p, meda: { ...p.meda, learningAreasHeading: e.target.value } }))}
                className="admin-input"
              />
            </div>

            <div className="admin-field">
              <label style={{ fontSize: '0.78rem', fontWeight: 600 }}>Learning Topics (One per line)</label>
              <textarea
                value={(form.meda?.learningAreas || []).join('\n')}
                onChange={(e) => setForm((p) => ({ ...p, meda: { ...p.meda, learningAreas: e.target.value.split('\n') } }))}
                className="admin-input"
                rows={4}
                style={{ width: '100%', fontFamily: 'inherit' }}
              />
            </div>
          </div>

          <div className="admin-field">
            <label style={{ fontWeight: 600 }}>MEDA Closing Note</label>
            <textarea
              value={form.meda?.closing || ''}
              onChange={(e) => setForm((p) => ({ ...p, meda: { ...p.meda, closing: e.target.value } }))}
              className="admin-input"
              rows={2}
              style={{ width: '100%', fontFamily: 'inherit' }}
            />
          </div>
        </div>

        {/* SECTION 4: SECTION 02 - PLM & TEAMCENTER */}
        <div id="sec-plm" style={{ background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '10px', padding: '1.25rem', marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem', borderBottom: '2px solid #e2e8f0', paddingBottom: '0.5rem' }}>
            <Boxes size={18} color="#0284c7" />
            <h3 style={{ margin: 0, fontSize: '1.05rem', color: '#0f172a' }}>4. Section 02: Product Lifecycle Management (PLM &amp; Siemens Teamcenter)</h3>
          </div>

          <div className="admin-form-grid" style={{ marginBottom: '1.25rem' }}>
            <div className="admin-field" style={{ gridColumn: '1 / -1' }}>
              <label style={{ fontWeight: 600 }}>Section 02 Heading</label>
              <input
                type="text"
                value={form.plm?.heading || ''}
                onChange={(e) => setForm((p) => ({ ...p, plm: { ...p.plm, heading: e.target.value } }))}
                className="admin-input"
              />
            </div>
            <div className="admin-field" style={{ gridColumn: '1 / -1' }}>
              <label style={{ fontWeight: 600 }}>PLM Introduction Text</label>
              <textarea
                value={form.plm?.intro || ''}
                onChange={(e) => setForm((p) => ({ ...p, plm: { ...p.plm, intro: e.target.value } }))}
                className="admin-input"
                rows={3}
                style={{ width: '100%', fontFamily: 'inherit' }}
              />
            </div>
          </div>

          {/* PLM Training Topics Sub-Card */}
          <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '1rem', marginBottom: '1.25rem' }}>
            <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#0369a1', display: 'flex', alignItems: 'center', gap: '0.35rem', marginBottom: '0.75rem' }}>
              <Workflow size={16} /> PLM Training Modules List
            </div>

            <div className="admin-field" style={{ marginBottom: '0.75rem' }}>
              <label style={{ fontSize: '0.78rem', fontWeight: 600 }}>Training Subheading</label>
              <input
                type="text"
                value={form.plm?.trainingHeading || ''}
                onChange={(e) => setForm((p) => ({ ...p, plm: { ...p.plm, trainingHeading: e.target.value } }))}
                className="admin-input"
              />
            </div>

            <div className="admin-field">
              <label style={{ fontSize: '0.78rem', fontWeight: 600 }}>Training Topics (One per line)</label>
              <textarea
                value={(form.plm?.trainingItems || []).join('\n')}
                onChange={(e) => setForm((p) => ({ ...p, plm: { ...p.plm, trainingItems: e.target.value.split('\n') } }))}
                className="admin-input"
                rows={4}
                style={{ width: '100%', fontFamily: 'inherit' }}
              />
            </div>
          </div>

          {/* Siemens Teamcenter Box */}
          <div style={{ background: '#fffdf7', border: '1px solid #fef08a', borderRadius: '8px', padding: '1rem' }}>
            <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#b45309', display: 'flex', alignItems: 'center', gap: '0.35rem', marginBottom: '0.75rem' }}>
              <Database size={16} /> Siemens Teamcenter Integration Spotlight
            </div>

            <div className="admin-field" style={{ marginBottom: '0.75rem' }}>
              <label style={{ fontSize: '0.78rem', fontWeight: 600 }}>Spotlight Title</label>
              <input
                type="text"
                value={form.plm?.teamcenter?.heading || ''}
                onChange={(e) => setForm((p) => ({ ...p, plm: { ...p.plm, teamcenter: { ...p.plm?.teamcenter, heading: e.target.value } } }))}
                className="admin-input"
              />
            </div>

            <div className="admin-field">
              <label style={{ fontSize: '0.78rem', fontWeight: 600 }}>Spotlight Description</label>
              <textarea
                value={form.plm?.teamcenter?.description || ''}
                onChange={(e) => setForm((p) => ({ ...p, plm: { ...p.plm, teamcenter: { ...p.plm?.teamcenter, description: e.target.value } } }))}
                className="admin-input"
                rows={3}
                style={{ width: '100%', fontFamily: 'inherit' }}
              />
            </div>
          </div>
        </div>

        {/* SECTION 5: SECTION 03 - LEARNING OUTCOMES & OPPORTUNITIES */}
        <div id="sec-outcomes" style={{ background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '10px', padding: '1.25rem', marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem', borderBottom: '2px solid #e2e8f0', paddingBottom: '0.5rem' }}>
            <Award size={18} color="#0284c7" />
            <h3 style={{ margin: 0, fontSize: '1.05rem', color: '#0f172a' }}>5. Section 03: Learning Outcomes &amp; Opportunities</h3>
          </div>

          <div className="admin-form-grid" style={{ marginBottom: '1.25rem' }}>
            <div className="admin-field" style={{ gridColumn: '1 / -1' }}>
              <label style={{ fontWeight: 600 }}>Section 03 Heading</label>
              <input
                type="text"
                value={form.outcomes?.heading || ''}
                onChange={(e) => setForm((p) => ({ ...p, outcomes: { ...p.outcomes, heading: e.target.value } }))}
                className="admin-input"
              />
            </div>
            <div className="admin-field" style={{ gridColumn: '1 / -1' }}>
              <label style={{ fontWeight: 600 }}>Outcomes Intro Text</label>
              <textarea
                value={form.outcomes?.intro || ''}
                onChange={(e) => setForm((p) => ({ ...p, outcomes: { ...p.outcomes, intro: e.target.value } }))}
                className="admin-input"
                rows={3}
                style={{ width: '100%', fontFamily: 'inherit' }}
              />
            </div>
          </div>

          {/* Career & Industry Opportunities Sub-Card */}
          <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '1rem', marginBottom: '1.25rem' }}>
            <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#0369a1', display: 'flex', alignItems: 'center', gap: '0.35rem', marginBottom: '0.75rem' }}>
              <CheckCircle size={16} /> Career &amp; Industry Opportunities List
            </div>

            <div className="admin-field" style={{ marginBottom: '0.75rem' }}>
              <label style={{ fontSize: '0.78rem', fontWeight: 600 }}>Opportunities Subheading</label>
              <input
                type="text"
                value={form.outcomes?.opportunitiesHeading || ''}
                onChange={(e) => setForm((p) => ({ ...p, outcomes: { ...p.outcomes, opportunitiesHeading: e.target.value } }))}
                className="admin-input"
              />
            </div>

            <div className="admin-field">
              <label style={{ fontSize: '0.78rem', fontWeight: 600 }}>Opportunities Items (One per line)</label>
              <textarea
                value={(form.outcomes?.opportunities || []).join('\n')}
                onChange={(e) => setForm((p) => ({ ...p, outcomes: { ...p.outcomes, opportunities: e.target.value.split('\n') } }))}
                className="admin-input"
                rows={4}
                style={{ width: '100%', fontFamily: 'inherit' }}
              />
            </div>
          </div>

          <div className="admin-field">
            <label style={{ fontWeight: 600 }}>Outcomes Closing Note</label>
            <textarea
              value={form.outcomes?.closing || ''}
              onChange={(e) => setForm((p) => ({ ...p, outcomes: { ...p.outcomes, closing: e.target.value } }))}
              className="admin-input"
              rows={2}
              style={{ width: '100%', fontFamily: 'inherit' }}
            />
          </div>
        </div>

        {/* SECTION 6: KEY HIGHLIGHTS & ADDITIONAL ACHIEVEMENTS */}
        <div id="sec-highlights" style={{ background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '10px', padding: '1.25rem', marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem', borderBottom: '2px solid #e2e8f0', paddingBottom: '0.5rem' }}>
            <Sparkles size={18} color="#0284c7" />
            <h3 style={{ margin: 0, fontSize: '1.05rem', color: '#0f172a' }}>6. Key Highlights &amp; Additional Achievements (Side-by-Side Cards)</h3>
          </div>
          <p className="admin-field__hint" style={{ marginBottom: '1rem' }}>
            These two lists render side-by-side in the Highlights &amp; Achievements matrix card row on the public page.
          </p>

          <div className="admin-form-grid">
            <div className="admin-field" style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '1rem' }}>
              <label style={{ fontWeight: 700, color: '#0369a1', display: 'flex', alignItems: 'center', gap: '0.35rem', marginBottom: '0.5rem' }}>
                <Sparkles size={16} /> Key Highlights List (One per line)
              </label>
              <textarea
                value={getNonEmptyList(form.highlights, DEFAULT_HIGHLIGHTS).join('\n')}
                onChange={(e) => setForm((p) => ({ ...p, highlights: e.target.value.split('\n') }))}
                className="admin-input"
                rows={5}
                style={{ width: '100%', fontFamily: 'inherit' }}
                placeholder="MoU partnership with Capgemini..."
              />
            </div>

            <div className="admin-field" style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '1rem' }}>
              <label style={{ fontWeight: 700, color: '#0369a1', display: 'flex', alignItems: 'center', gap: '0.35rem', marginBottom: '0.5rem' }}>
                <Award size={16} /> Additional Achievements List (One per line)
              </label>
              <textarea
                value={getNonEmptyList(form.achievements, DEFAULT_ACHIEVEMENTS).join('\n')}
                onChange={(e) => setForm((p) => ({ ...p, achievements: e.target.value.split('\n') }))}
                className="admin-input"
                rows={5}
                style={{ width: '100%', fontFamily: 'inherit' }}
                placeholder="Students receive industry-ready credentials upon completion..."
              />
            </div>
          </div>
        </div>

        {/* SECTION 7: FACILITIES & EQUIPMENT AND INDUSTRY PARTNERS */}
        <div id="sec-facilities" style={{ background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '10px', padding: '1.25rem', marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem', borderBottom: '2px solid #e2e8f0', paddingBottom: '0.5rem' }}>
            <Settings size={18} color="#0284c7" />
            <h3 style={{ margin: 0, fontSize: '1.05rem', color: '#0f172a' }}>7. Facilities &amp; Equipment AND Industry Partners (Side-by-Side Cards)</h3>
          </div>
          <p className="admin-field__hint" style={{ marginBottom: '1rem' }}>
            These two lists render side-by-side in the Facilities &amp; Partners matrix card row on the public page.
          </p>

          <div className="admin-form-grid">
            <div className="admin-field" style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '1rem' }}>
              <label style={{ fontWeight: 700, color: '#0369a1', display: 'flex', alignItems: 'center', gap: '0.35rem', marginBottom: '0.5rem' }}>
                <Settings size={16} /> Facilities &amp; Equipment List (One per line)
              </label>
              <textarea
                value={getNonEmptyList(form.facilities, DEFAULT_FACILITIES).join('\n')}
                onChange={(e) => setForm((p) => ({ ...p, facilities: e.target.value.split('\n') }))}
                className="admin-input"
                rows={4}
                style={{ width: '100%', fontFamily: 'inherit' }}
                placeholder="CATIA&#10;Siemens NX CAD&#10;ANSYS..."
              />
            </div>

            <div className="admin-field" style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '1rem' }}>
              <label style={{ fontWeight: 700, color: '#0369a1', display: 'flex', alignItems: 'center', gap: '0.35rem', marginBottom: '0.5rem' }}>
                <Building2 size={16} /> Industry Partners List (One per line)
              </label>
              <textarea
                value={getNonEmptyList(form.partners, DEFAULT_PARTNERS).join('\n')}
                onChange={(e) => setForm((p) => ({ ...p, partners: e.target.value.split('\n') }))}
                className="admin-input"
                rows={4}
                style={{ width: '100%', fontFamily: 'inherit' }}
                placeholder="Capgemini..."
              />
            </div>
          </div>
        </div>

        {/* SECTION 8: ADDITIONAL CUSTOM NAVIGATION SECTIONS */}
        <div id="sec-custom" style={{ background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '10px', padding: '1.25rem', marginBottom: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem', marginBottom: '0.75rem', borderBottom: '2px solid #e2e8f0', paddingBottom: '0.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Sparkles size={18} color="#0284c7" />
              <h3 style={{ margin: 0, fontSize: '1.05rem', color: '#0f172a' }}>
                8. Additional Navigation Sections ({form.additionalSections?.length || 0})
              </h3>
            </div>
          </div>
          <p className="admin-field__hint" style={{ marginBottom: '1rem' }}>
            Add any additional sections or sub-sections needed — key highlights, equipment tables, checklists, lists of links, files, contacts, or photo galleries. Any top-level section created here automatically appears as a tab under Quick Navigation on the live public page.
          </p>

          <CustomSectionEditor
            sections={form.additionalSections || []}
            onChange={(next) => setForm((p) => ({ ...p, additionalSections: next }))}
            rootSections={form.additionalSections || []}
            parentPath={[]}
            onFileUploaded={handleCustomSectionFileUploaded}
            onFileRemoved={handleCustomSectionFileRemoved}
            onPhotoUploaded={handleCustomSectionPhotoUploaded}
            onPhotoRemoved={handleCustomSectionPhotoRemoved}
            onGalleryPhotoUploaded={handleCustomSectionGalleryPhotoUploaded}
            onGalleryPhotoRemoved={handleCustomSectionGalleryPhotoRemoved}
          />
        </div>

        {/* Save Footer */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', marginTop: '1.5rem', borderTop: '1px solid #e5e7eb', paddingTop: '1rem' }}>
          <button type="button" onClick={save} disabled={saving} className="admin-btn admin-btn--primary">
            <Save size={14} /> {saving ? 'Saving...' : 'Save All MEDA & PLM CoE Changes'}
          </button>
        </div>
      </div>
    </div>
  );
}
