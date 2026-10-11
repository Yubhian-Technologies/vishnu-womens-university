import { useEffect, useState } from 'react';
import { doc, serverTimestamp } from 'firebase/firestore';
import { setDoc } from '../../../lib/auditLog';
import { db } from '../../../lib/firebase';
import { useDocument } from '../../../hooks/useDocument';
import { deleteFile, type UploadResult } from '../../../lib/storage';
import {
  ultraTechCoe,
  type UltraTechInCharge,
  type StudentsBenefitedGroup,
} from '../../Differentiators/ultraTechCoe.data';
import {
  Building2,
  Cpu,
  Layers,
  Sparkles,
  BookOpen,
  Award,
  Plus,
  Trash2,
  Save,
  RotateCcw,
  CheckCircle,
  Users,
  GraduationCap,
  Calendar,
  Compass,
  Target,
  FileCheck2,
} from 'lucide-react';
import CustomSectionEditor from './CustomSectionEditor';
import { replaceAtPath, getAtPath, type CustomSection } from '../../../lib/customSections';

export interface CustomUltraTechSection extends CustomSection {
  title?: string;
  badge?: string;
  paragraphs?: string[];
  bulletPoints?: string[];
}

export interface UltraTechDoc {
  pageTitle?: string;
  heroSubtitle?: string;
  taglineTitle?: string;
  taglineDesc?: string;
  aboutTitle?: string;
  overview?: string[];
  focusDomains?: { title: string; desc: string }[];
  vision?: string;
  mission?: string[];
  objectivesIntro?: string;
  objectives?: { index: string; badge: string; title: string; desc: string }[];
  activitiesList?: { eventTag: string; dateStr: string; desc: string }[];
  keyHighlights?: string[];
  outcomes?: string[];
  inCharge?: UltraTechInCharge;
  studentsBenefited?: StudentsBenefitedGroup[];
  additionalSections?: CustomUltraTechSection[];
}

function normalizeCustomSection(sec: any): CustomUltraTechSection {
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

function getNonEmptyList(arr?: string[], fallback: string[] = []): string[] {
  if (!arr || !Array.isArray(arr)) return fallback;
  const filtered = arr.filter((item) => item && typeof item === 'string' && item.trim().length > 0);
  return filtered.length > 0 ? filtered : fallback;
}

const DEFAULT_STATE: UltraTechDoc = {
  pageTitle: ultraTechCoe.pageTitle,
  heroSubtitle: ultraTechCoe.heroSubtitle,
  taglineTitle: ultraTechCoe.taglineTitle,
  taglineDesc: ultraTechCoe.taglineDesc,
  aboutTitle: ultraTechCoe.aboutTitle,
  overview: [...ultraTechCoe.overview],
  focusDomains: ultraTechCoe.focusDomains.map((d) => ({ ...d })),
  vision: ultraTechCoe.vision,
  mission: [...ultraTechCoe.mission],
  objectivesIntro: ultraTechCoe.objectivesIntro,
  objectives: ultraTechCoe.objectives.map((o) => ({ ...o })),
  activitiesList: ultraTechCoe.activitiesList.map((a) => ({ ...a })),
  keyHighlights: [...ultraTechCoe.keyHighlights],
  outcomes: [...ultraTechCoe.outcomes],
  inCharge: { ...ultraTechCoe.inCharge },
  studentsBenefited: ultraTechCoe.studentsBenefited.map((g) => ({
    yearLabel: g.yearLabel,
    students: g.students.map((s) => ({ ...s })),
  })),
  additionalSections: [],
};

export default function UltraTechContentAdmin() {
  const { data, loading } = useDocument<UltraTechDoc>('settings', 'ultraTechCoe');
  const [form, setForm] = useState<UltraTechDoc>(DEFAULT_STATE);
  const [hasInitialized, setHasInitialized] = useState(false);
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    if (!loading && !hasInitialized) {
      if (data) {
        setForm({
          pageTitle: data.pageTitle || DEFAULT_STATE.pageTitle,
          heroSubtitle: data.heroSubtitle || DEFAULT_STATE.heroSubtitle,
          taglineTitle: data.taglineTitle || DEFAULT_STATE.taglineTitle,
          taglineDesc: data.taglineDesc || DEFAULT_STATE.taglineDesc,
          aboutTitle: data.aboutTitle || DEFAULT_STATE.aboutTitle,
          overview: getNonEmptyList(data.overview, DEFAULT_STATE.overview || []),
          focusDomains: data.focusDomains && data.focusDomains.length > 0 ? data.focusDomains : DEFAULT_STATE.focusDomains,
          vision: data.vision || DEFAULT_STATE.vision,
          mission: getNonEmptyList(data.mission, DEFAULT_STATE.mission || []),
          objectivesIntro: data.objectivesIntro || DEFAULT_STATE.objectivesIntro,
          objectives: data.objectives && data.objectives.length > 0 ? data.objectives : DEFAULT_STATE.objectives,
          activitiesList: data.activitiesList && data.activitiesList.length > 0 ? data.activitiesList : DEFAULT_STATE.activitiesList,
          keyHighlights: getNonEmptyList(data.keyHighlights, DEFAULT_STATE.keyHighlights || []),
          outcomes: getNonEmptyList(data.outcomes, DEFAULT_STATE.outcomes || []),
          inCharge: {
            name: data.inCharge?.name || DEFAULT_STATE.inCharge?.name || 'Mr. Ramgopal. L',
            designation: data.inCharge?.designation || DEFAULT_STATE.inCharge?.designation || '',
            email: data.inCharge?.email || DEFAULT_STATE.inCharge?.email || '',
            mobile: data.inCharge?.mobile || DEFAULT_STATE.inCharge?.mobile || '',
            interests: data.inCharge?.interests || DEFAULT_STATE.inCharge?.interests || '',
          },
          studentsBenefited: data.studentsBenefited && data.studentsBenefited.length > 0 ? data.studentsBenefited : DEFAULT_STATE.studentsBenefited,
          additionalSections: (data.additionalSections || []).map(normalizeCustomSection),
        });
      }
      setHasInitialized(true);
    }
  }, [data, loading, hasInitialized]);

  const save = async () => {
    setSaving(true);
    try {
      const formattedSections: CustomUltraTechSection[] = (form.additionalSections || []).map((sec) => ({
        ...sec,
        title: sec.label || sec.title || 'Navigation Section',
        badge: sec.subtitle || sec.badge || '',
        paragraphs: sec.textContent ? sec.textContent.split('\n').filter(Boolean) : (sec.paragraphs || []),
        bulletPoints: sec.listText ? sec.listText.split('\n').filter(Boolean) : (sec.bulletPoints || []),
      }));

      const finalHighlights = getNonEmptyList(form.keyHighlights, DEFAULT_STATE.keyHighlights || []);
      const finalOutcomes = getNonEmptyList(form.outcomes, DEFAULT_STATE.outcomes || []);

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
          label: 'Outcomes',
          contentType: 'list',
          listText: finalOutcomes.join('\n'),
        },
        ...formattedSections,
      ];

      // 1. Save settings/ultraTechCoe doc
      await setDoc(doc(db, 'settings', 'ultraTechCoe'), {
        ...form,
        keyHighlights: finalHighlights,
        outcomes: finalOutcomes,
        additionalSections: formattedSections,
        updatedAt: serverTimestamp(),
      }, { merge: true });

      // 2. Sync to differentiatorItems/ultratech-coe doc for live public rendering
      try {
        await setDoc(doc(db, 'differentiatorItems', 'ultratech-coe'), {
          customSections: customSectionsForDifferentiator,
          highlights: finalHighlights,
          outcomes: finalOutcomes,
          updatedAt: serverTimestamp(),
        }, { merge: true });
      } catch (err) {
        console.warn('Could not sync customSections to differentiatorItems/ultratech-coe:', err);
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
    if (confirm('Reset all UltraTech CoE text to default starting values? You can still edit before saving.')) {
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
    return <p className="admin-loading">Loading UltraTech Centre of Excellence Management Editor…</p>;
  }

  return (
    <div className="admin-section">
      <div className="admin-card">
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '1.25rem', borderBottom: '1px solid #e5e7eb', paddingBottom: '1rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Building2 size={22} color="#b45309" />
              <h2 className="admin-card__title" style={{ margin: 0, padding: 0, border: 'none' }}>
                UltraTech Centre of Excellence Management
              </h2>
            </div>
            <p className="admin-field__hint" style={{ margin: '0.35rem 0 0', fontSize: '0.85rem' }}>
              Manage all content, focus domains, vision &amp; mission, key objectives, faculty in-charge, students list, activities, and custom extra sections in the <strong>exact top-to-bottom order</strong> as displayed on the live public UltraTech CoE page.
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
            <CheckCircle size={16} /> Saved and published live to UltraTech CoE page!
          </div>
        )}

        {/* Top Jump Bar (Exact Public Page Top-to-Bottom Order) */}
        <div style={{ background: '#fffdf5', border: '1px solid #fef08a', borderRadius: '8px', padding: '0.65rem 1rem', marginBottom: '1.75rem', display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap', fontSize: '0.82rem' }}>
          <strong style={{ color: '#b45309', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <Layers size={14} /> Jump to Section (Public Page Order):
          </strong>
          <a href="#sec-hero" style={{ color: '#0284c7', textDecoration: 'none', fontWeight: 600 }}>1. Hero Banner &amp; Tagline</a> •
          <a href="#sec-about" style={{ color: '#0284c7', textDecoration: 'none', fontWeight: 600 }}>2. About Us &amp; 4 Focus Domains</a> •
          <a href="#sec-vision" style={{ color: '#0284c7', textDecoration: 'none', fontWeight: 600 }}>3. Strategic Vision &amp; Mission</a> •
          <a href="#sec-objectives" style={{ color: '#0284c7', textDecoration: 'none', fontWeight: 600 }}>4. Key Objectives</a> •
          <a href="#sec-incharge" style={{ color: '#0284c7', textDecoration: 'none', fontWeight: 600 }}>5. Faculty In-Charge</a> •
          <a href="#sec-students" style={{ color: '#0284c7', textDecoration: 'none', fontWeight: 600 }}>6. Students Benefited List</a> •
          <a href="#sec-activities" style={{ color: '#0284c7', textDecoration: 'none', fontWeight: 600 }}>7. Activities &amp; Events</a> •
          <a href="#sec-highlights" style={{ color: '#0284c7', textDecoration: 'none', fontWeight: 600 }}>8. Key Highlights &amp; Outcomes</a> •
          <a href="#sec-custom" style={{ color: '#0284c7', textDecoration: 'none', fontWeight: 600 }}>9. Additional Navigation Sections</a>
        </div>

        {/* SECTION 1: HERO BANNER & TAGLINE */}
        <div id="sec-hero" style={{ background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '10px', padding: '1.25rem', marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem', borderBottom: '2px solid #e2e8f0', paddingBottom: '0.5rem' }}>
            <Building2 size={18} color="#b45309" />
            <h3 style={{ margin: 0, fontSize: '1.05rem', color: '#0f172a' }}>1. Hero Banner &amp; Main Tagline</h3>
          </div>

          <div className="admin-form-grid">
            <div className="admin-field" style={{ gridColumn: '1 / -1' }}>
              <label style={{ fontWeight: 600 }}>Tagline Main Title (Hero Heading)</label>
              <input
                type="text"
                value={form.taglineTitle || ''}
                onChange={(e) => setForm((p) => ({ ...p, taglineTitle: e.target.value }))}
                className="admin-input"
                style={{ fontWeight: 700 }}
              />
            </div>
            <div className="admin-field" style={{ gridColumn: '1 / -1' }}>
              <label style={{ fontWeight: 600 }}>Tagline Description (Hero Subheading)</label>
              <textarea
                value={form.taglineDesc || ''}
                onChange={(e) => setForm((p) => ({ ...p, taglineDesc: e.target.value }))}
                className="admin-input"
                rows={2}
                style={{ width: '100%', fontFamily: 'inherit' }}
              />
            </div>
            <div className="admin-field" style={{ gridColumn: '1 / -1' }}>
              <label style={{ fontWeight: 600 }}>Hero Subtitle (Detailed Blurb)</label>
              <textarea
                value={form.heroSubtitle || ''}
                onChange={(e) => setForm((p) => ({ ...p, heroSubtitle: e.target.value }))}
                className="admin-input"
                rows={3}
                style={{ width: '100%', fontFamily: 'inherit' }}
              />
            </div>
          </div>
        </div>

        {/* SECTION 2: ABOUT US & 4 FOCUS DOMAINS */}
        <div id="sec-about" style={{ background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '10px', padding: '1.25rem', marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem', borderBottom: '2px solid #e2e8f0', paddingBottom: '0.5rem' }}>
            <Layers size={18} color="#0284c7" />
            <h3 style={{ margin: 0, fontSize: '1.05rem', color: '#0f172a' }}>2. About Us &amp; 4 Core Focus Domains</h3>
          </div>

          <div className="admin-field" style={{ marginBottom: '1.25rem' }}>
            <label style={{ fontWeight: 600 }}>About Us Section Heading</label>
            <input
              type="text"
              value={form.aboutTitle || ''}
              onChange={(e) => setForm((p) => ({ ...p, aboutTitle: e.target.value }))}
              className="admin-input"
            />
          </div>

          {/* Overview Paragraphs */}
          <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '1rem', marginBottom: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
              <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#0369a1', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <BookOpen size={16} /> Overview Paragraphs ({form.overview?.length || 0})
              </div>
              <button
                type="button"
                onClick={() => setForm((p) => ({ ...p, overview: [...(p.overview || []), ''] }))}
                className="admin-btn admin-btn--sm admin-btn--ghost"
              >
                <Plus size={13} /> Add Paragraph
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {(form.overview || []).map((p, idx) => (
                <div key={idx} style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-start' }}>
                  <textarea
                    rows={2}
                    value={p}
                    onChange={(e) => {
                      const list = [...(form.overview || [])];
                      list[idx] = e.target.value;
                      setForm((prev) => ({ ...prev, overview: list }));
                    }}
                    className="admin-input"
                    style={{ flex: 1, fontFamily: 'inherit' }}
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const list = (form.overview || []).filter((_, i) => i !== idx);
                      setForm((prev) => ({ ...prev, overview: list }));
                    }}
                    style={{ background: 'none', border: 'none', color: '#dc2626', cursor: 'pointer', padding: '0.4rem' }}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Focus Domains Cards */}
          <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
              <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#0369a1', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <Cpu size={16} /> Core Focus Domains ({form.focusDomains?.length || 0})
              </div>
              <button
                type="button"
                onClick={() => {
                  setForm((p) => ({ ...p, focusDomains: [...(p.focusDomains || []), { title: '', desc: '' }] }));
                }}
                className="admin-btn admin-btn--sm admin-btn--ghost"
              >
                <Plus size={13} /> Add Focus Domain
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '0.75rem' }}>
              {(form.focusDomains || []).map((domain, idx) => (
                <div key={idx} style={{ background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '8px', padding: '0.75rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                    <strong style={{ fontSize: '0.8rem', color: '#b45309' }}>Domain #{idx + 1}</strong>
                    <button
                      type="button"
                      onClick={() => {
                        const list = (form.focusDomains || []).filter((_, i) => i !== idx);
                        setForm((prev) => ({ ...prev, focusDomains: list }));
                      }}
                      style={{ background: 'none', border: 'none', color: '#dc2626', cursor: 'pointer' }}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                  <div className="admin-field" style={{ marginBottom: '0.4rem' }}>
                    <label style={{ fontSize: '0.75rem' }}>Title</label>
                    <input
                      type="text"
                      value={domain.title}
                      onChange={(e) => {
                        const list = [...(form.focusDomains || [])];
                        list[idx] = { ...list[idx], title: e.target.value };
                        setForm((prev) => ({ ...prev, focusDomains: list }));
                      }}
                      className="admin-input"
                      style={{ fontWeight: 700 }}
                    />
                  </div>
                  <div className="admin-field">
                    <label style={{ fontSize: '0.75rem' }}>Description</label>
                    <textarea
                      rows={2}
                      value={domain.desc}
                      onChange={(e) => {
                        const list = [...(form.focusDomains || [])];
                        list[idx] = { ...list[idx], desc: e.target.value };
                        setForm((prev) => ({ ...prev, focusDomains: list }));
                      }}
                      className="admin-input"
                      style={{ fontSize: '0.82rem', fontFamily: 'inherit' }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* SECTION 3: STRATEGIC VISION & MISSION */}
        <div id="sec-vision" style={{ background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '10px', padding: '1.25rem', marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem', borderBottom: '2px solid #e2e8f0', paddingBottom: '0.5rem' }}>
            <Compass size={18} color="#0284c7" />
            <h3 style={{ margin: 0, fontSize: '1.05rem', color: '#0f172a' }}>3. Strategic Blueprint: Vision &amp; Mission</h3>
          </div>

          <div className="admin-field" style={{ marginBottom: '1.25rem' }}>
            <label style={{ fontWeight: 600 }}>Vision Statement</label>
            <textarea
              value={form.vision || ''}
              onChange={(e) => setForm((p) => ({ ...p, vision: e.target.value }))}
              className="admin-input"
              rows={3}
              style={{ width: '100%', fontFamily: 'inherit' }}
            />
          </div>

          {/* Mission Statements */}
          <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
              <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#0369a1', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <Target size={16} /> Mission Statements List ({form.mission?.length || 0})
              </div>
              <button
                type="button"
                onClick={() => setForm((p) => ({ ...p, mission: [...(p.mission || []), ''] }))}
                className="admin-btn admin-btn--sm admin-btn--ghost"
              >
                <Plus size={13} /> Add Mission Bullet
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {(form.mission || []).map((bullet, idx) => (
                <div key={idx} style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#64748b', width: '1.5rem', textAlign: 'right' }}>
                    {idx + 1}.
                  </span>
                  <input
                    type="text"
                    value={bullet}
                    onChange={(e) => {
                      const list = [...(form.mission || [])];
                      list[idx] = e.target.value;
                      setForm((prev) => ({ ...prev, mission: list }));
                    }}
                    className="admin-input"
                    style={{ flex: 1 }}
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const list = (form.mission || []).filter((_, i) => i !== idx);
                      setForm((prev) => ({ ...prev, mission: list }));
                    }}
                    style={{ background: 'none', border: 'none', color: '#dc2626', cursor: 'pointer', padding: '0.3rem' }}
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* SECTION 4: KEY OBJECTIVES */}
        <div id="sec-objectives" style={{ background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '10px', padding: '1.25rem', marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem', borderBottom: '2px solid #e2e8f0', paddingBottom: '0.5rem' }}>
            <FileCheck2 size={18} color="#0284c7" />
            <h3 style={{ margin: 0, fontSize: '1.05rem', color: '#0f172a' }}>4. Key Objectives</h3>
          </div>

          <div className="admin-field" style={{ marginBottom: '1.25rem' }}>
            <label style={{ fontWeight: 600 }}>Objectives Intro Text</label>
            <textarea
              value={form.objectivesIntro || ''}
              onChange={(e) => setForm((p) => ({ ...p, objectivesIntro: e.target.value }))}
              className="admin-input"
              rows={2}
              style={{ width: '100%', fontFamily: 'inherit' }}
            />
          </div>

          {/* Objectives Cards */}
          <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
              <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#0369a1', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <FileCheck2 size={16} /> Objective Cards ({form.objectives?.length || 0})
              </div>
              <button
                type="button"
                onClick={() => {
                  setForm((p) => ({
                    ...p,
                    objectives: [
                      ...(p.objectives || []),
                      { index: `0${(p.objectives?.length || 0) + 1}`, badge: 'Core', title: `0${(p.objectives?.length || 0) + 1}. Objective`, desc: '' },
                    ],
                  }));
                }}
                className="admin-btn admin-btn--sm admin-btn--ghost"
              >
                <Plus size={13} /> Add Objective Card
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '0.75rem' }}>
              {(form.objectives || []).map((obj, idx) => (
                <div key={idx} style={{ background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '8px', padding: '0.75rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                    <strong style={{ fontSize: '0.8rem', color: '#b45309' }}>Objective #{obj.index || idx + 1}</strong>
                    <button
                      type="button"
                      onClick={() => {
                        const list = (form.objectives || []).filter((_, i) => i !== idx);
                        setForm((prev) => ({ ...prev, objectives: list }));
                      }}
                      style={{ background: 'none', border: 'none', color: '#dc2626', cursor: 'pointer' }}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '0.4rem', marginBottom: '0.4rem' }}>
                    <div>
                      <label style={{ fontSize: '0.72rem' }}>Badge</label>
                      <input
                        type="text"
                        value={obj.badge}
                        onChange={(e) => {
                          const list = [...(form.objectives || [])];
                          list[idx] = { ...list[idx], badge: e.target.value };
                          setForm((prev) => ({ ...prev, objectives: list }));
                        }}
                        className="admin-input"
                      />
                    </div>
                    <div>
                      <label style={{ fontSize: '0.72rem' }}>Title</label>
                      <input
                        type="text"
                        value={obj.title}
                        onChange={(e) => {
                          const list = [...(form.objectives || [])];
                          list[idx] = { ...list[idx], title: e.target.value };
                          setForm((prev) => ({ ...prev, objectives: list }));
                        }}
                        className="admin-input"
                      />
                    </div>
                  </div>

                  <div className="admin-field">
                    <label style={{ fontSize: '0.72rem' }}>Description</label>
                    <textarea
                      rows={2}
                      value={obj.desc}
                      onChange={(e) => {
                        const list = [...(form.objectives || [])];
                        list[idx] = { ...list[idx], desc: e.target.value };
                        setForm((prev) => ({ ...prev, objectives: list }));
                      }}
                      className="admin-input"
                      style={{ fontSize: '0.82rem', fontFamily: 'inherit' }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* SECTION 5: FACULTY IN-CHARGE DETAILS */}
        <div id="sec-incharge" style={{ background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '10px', padding: '1.25rem', marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem', borderBottom: '2px solid #e2e8f0', paddingBottom: '0.5rem' }}>
            <Users size={18} color="#0284c7" />
            <h3 style={{ margin: 0, fontSize: '1.05rem', color: '#0f172a' }}>5. Faculty In-Charge Details</h3>
          </div>

          <div className="admin-form-grid">
            <div className="admin-field">
              <label style={{ fontWeight: 600 }}>Faculty Name</label>
              <input
                type="text"
                value={form.inCharge?.name || ''}
                onChange={(e) => setForm((p) => ({
                  ...p,
                  inCharge: {
                    name: e.target.value,
                    designation: p.inCharge?.designation || '',
                    email: p.inCharge?.email || '',
                    mobile: p.inCharge?.mobile || '',
                    interests: p.inCharge?.interests || '',
                  },
                }))}
                className="admin-input"
                style={{ fontWeight: 700 }}
              />
            </div>

            <div className="admin-field">
              <label style={{ fontWeight: 600 }}>Designation &amp; Department</label>
              <input
                type="text"
                value={form.inCharge?.designation || ''}
                onChange={(e) => setForm((p) => ({
                  ...p,
                  inCharge: {
                    name: p.inCharge?.name || '',
                    designation: e.target.value,
                    email: p.inCharge?.email || '',
                    mobile: p.inCharge?.mobile || '',
                    interests: p.inCharge?.interests || '',
                  },
                }))}
                className="admin-input"
              />
            </div>

            <div className="admin-field">
              <label style={{ fontWeight: 600 }}>Email Address</label>
              <input
                type="email"
                value={form.inCharge?.email || ''}
                onChange={(e) => setForm((p) => ({
                  ...p,
                  inCharge: {
                    name: p.inCharge?.name || '',
                    designation: p.inCharge?.designation || '',
                    email: e.target.value,
                    mobile: p.inCharge?.mobile || '',
                    interests: p.inCharge?.interests || '',
                  },
                }))}
                className="admin-input"
              />
            </div>

            <div className="admin-field">
              <label style={{ fontWeight: 600 }}>Mobile Number</label>
              <input
                type="text"
                value={form.inCharge?.mobile || ''}
                onChange={(e) => setForm((p) => ({
                  ...p,
                  inCharge: {
                    name: p.inCharge?.name || '',
                    designation: p.inCharge?.designation || '',
                    email: p.inCharge?.email || '',
                    mobile: e.target.value,
                    interests: p.inCharge?.interests || '',
                  },
                }))}
                className="admin-input"
              />
            </div>

            <div className="admin-field" style={{ gridColumn: '1 / -1' }}>
              <label style={{ fontWeight: 600 }}>Areas of Specialization &amp; Interests (Comma separated)</label>
              <input
                type="text"
                value={form.inCharge?.interests || ''}
                onChange={(e) => setForm((p) => ({
                  ...p,
                  inCharge: {
                    name: p.inCharge?.name || '',
                    designation: p.inCharge?.designation || '',
                    email: p.inCharge?.email || '',
                    mobile: p.inCharge?.mobile || '',
                    interests: e.target.value,
                  },
                }))}
                className="admin-input"
              />
            </div>
          </div>
        </div>

        {/* SECTION 6: STUDENTS BENEFITED LIST */}
        <div id="sec-students" style={{ background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '10px', padding: '1.25rem', marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem', marginBottom: '0.75rem', borderBottom: '2px solid #e2e8f0', paddingBottom: '0.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <GraduationCap size={18} color="#0284c7" />
              <h3 style={{ margin: 0, fontSize: '1.05rem', color: '#0f172a' }}>
                6. Students Benefited Cohort Groups ({form.studentsBenefited?.length || 0})
              </h3>
            </div>
            <button
              type="button"
              onClick={() => {
                setForm((p) => ({
                  ...p,
                  studentsBenefited: [
                    ...(p.studentsBenefited || []),
                    { yearLabel: 'NEW BATCH', students: [{ regdNo: '', name: '' }] },
                  ],
                }));
              }}
              className="admin-btn admin-btn--sm admin-btn--ghost"
            >
              <Plus size={13} /> Add Year Cohort
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {(form.studentsBenefited || []).map((cohort, cIdx) => (
              <div key={cIdx} style={{ background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '8px', padding: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.75rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <label style={{ fontSize: '0.85rem', fontWeight: 700, color: '#0369a1' }}>Cohort Label:</label>
                    <input
                      type="text"
                      value={cohort.yearLabel}
                      onChange={(e) => {
                        const list = [...(form.studentsBenefited || [])];
                        list[cIdx] = { ...list[cIdx], yearLabel: e.target.value };
                        setForm((prev) => ({ ...prev, studentsBenefited: list }));
                      }}
                      className="admin-input"
                      style={{ fontWeight: 700, width: '180px' }}
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      const list = (form.studentsBenefited || []).filter((_, i) => i !== cIdx);
                      setForm((prev) => ({ ...prev, studentsBenefited: list }));
                    }}
                    style={{ background: 'none', border: 'none', color: '#dc2626', cursor: 'pointer', fontSize: '0.82rem', fontWeight: 600 }}
                  >
                    <Trash2 size={14} /> Delete Cohort
                  </button>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                  <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#475569' }}>
                    Students in Batch ({cohort.students?.length || 0}):
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      const list = [...(form.studentsBenefited || [])];
                      list[cIdx] = {
                        ...list[cIdx],
                        students: [...(list[cIdx].students || []), { regdNo: '', name: '' }],
                      };
                      setForm((prev) => ({ ...prev, studentsBenefited: list }));
                    }}
                    className="admin-btn admin-btn--sm admin-btn--ghost"
                    style={{ fontSize: '0.75rem', padding: '0.2rem 0.5rem' }}
                  >
                    <Plus size={12} /> Add Student
                  </button>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '0.5rem', maxHeight: '280px', overflowY: 'auto', padding: '0.5rem', background: '#ffffff', borderRadius: '6px', border: '1px solid #cbd5e1' }}>
                  {(cohort.students || []).map((st, sIdx) => (
                    <div key={sIdx} style={{ display: 'flex', gap: '0.35rem', alignItems: 'center', background: '#f8fafc', padding: '0.35rem', borderRadius: '4px', border: '1px solid #cbd5e1' }}>
                      <span style={{ fontSize: '0.75rem', color: '#94a3b8', width: '20px', textAlign: 'right' }}>{sIdx + 1}.</span>
                      <input
                        type="text"
                        placeholder="Regd No"
                        value={st.regdNo}
                        onChange={(e) => {
                          const list = [...(form.studentsBenefited || [])];
                          const stList = [...list[cIdx].students];
                          stList[sIdx] = { ...stList[sIdx], regdNo: e.target.value };
                          list[cIdx] = { ...list[cIdx], students: stList };
                          setForm((prev) => ({ ...prev, studentsBenefited: list }));
                        }}
                        className="admin-input"
                        style={{ width: '100px', padding: '0.25rem 0.4rem', fontSize: '0.75rem', textTransform: 'uppercase', fontFamily: 'monospace' }}
                      />
                      <input
                        type="text"
                        placeholder="Student Name"
                        value={st.name}
                        onChange={(e) => {
                          const list = [...(form.studentsBenefited || [])];
                          const stList = [...list[cIdx].students];
                          stList[sIdx] = { ...stList[sIdx], name: e.target.value };
                          list[cIdx] = { ...list[cIdx], students: stList };
                          setForm((prev) => ({ ...prev, studentsBenefited: list }));
                        }}
                        className="admin-input"
                        style={{ flex: 1, padding: '0.25rem 0.4rem', fontSize: '0.75rem', textTransform: 'uppercase' }}
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const list = [...(form.studentsBenefited || [])];
                          const stList = list[cIdx].students.filter((_, i) => i !== sIdx);
                          list[cIdx] = { ...list[cIdx], students: stList };
                          setForm((prev) => ({ ...prev, studentsBenefited: list }));
                        }}
                        style={{ background: 'none', border: 'none', color: '#dc2626', cursor: 'pointer', padding: '0.2rem' }}
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

        {/* SECTION 7: ACTIVITIES & EVENTS */}
        <div id="sec-activities" style={{ background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '10px', padding: '1.25rem', marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem', marginBottom: '0.75rem', borderBottom: '2px solid #e2e8f0', paddingBottom: '0.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Calendar size={18} color="#0284c7" />
              <h3 style={{ margin: 0, fontSize: '1.05rem', color: '#0f172a' }}>
                7. Activities &amp; Technical Events ({form.activitiesList?.length || 0})
              </h3>
            </div>
            <button
              type="button"
              onClick={() => {
                setForm((p) => ({
                  ...p,
                  activitiesList: [
                    ...(p.activitiesList || []),
                    { eventTag: 'Webinar', dateStr: 'Recent', desc: '' },
                  ],
                }));
              }}
              className="admin-btn admin-btn--sm admin-btn--ghost"
            >
              <Plus size={13} /> Add Activity
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {(form.activitiesList || []).map((act, idx) => (
              <div key={idx} style={{ background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '8px', padding: '0.75rem', display: 'flex', gap: '0.5rem', alignItems: 'flex-start' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.5rem', flex: 1 }}>
                  <div>
                    <label style={{ fontSize: '0.75rem', fontWeight: 600 }}>Event Tag / Badge</label>
                    <input
                      type="text"
                      value={act.eventTag}
                      onChange={(e) => {
                        const list = [...(form.activitiesList || [])];
                        list[idx] = { ...list[idx], eventTag: e.target.value };
                        setForm((prev) => ({ ...prev, activitiesList: list }));
                      }}
                      className="admin-input"
                      style={{ fontWeight: 700 }}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.75rem', fontWeight: 600 }}>Date / Period</label>
                    <input
                      type="text"
                      value={act.dateStr}
                      onChange={(e) => {
                        const list = [...(form.activitiesList || [])];
                        list[idx] = { ...list[idx], dateStr: e.target.value };
                        setForm((prev) => ({ ...prev, activitiesList: list }));
                      }}
                      className="admin-input"
                    />
                  </div>
                  <div style={{ gridColumn: '1 / -1' }}>
                    <label style={{ fontSize: '0.75rem', fontWeight: 600 }}>Event Description</label>
                    <textarea
                      rows={2}
                      value={act.desc}
                      onChange={(e) => {
                        const list = [...(form.activitiesList || [])];
                        list[idx] = { ...list[idx], desc: e.target.value };
                        setForm((prev) => ({ ...prev, activitiesList: list }));
                      }}
                      className="admin-input"
                      style={{ fontFamily: 'inherit' }}
                    />
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    const list = (form.activitiesList || []).filter((_, i) => i !== idx);
                    setForm((prev) => ({ ...prev, activitiesList: list }));
                  }}
                  style={{ background: 'none', border: 'none', color: '#dc2626', cursor: 'pointer', padding: '0.3rem' }}
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* SECTION 8: KEY HIGHLIGHTS & OUTCOMES */}
        <div id="sec-highlights" style={{ background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '10px', padding: '1.25rem', marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem', borderBottom: '2px solid #e2e8f0', paddingBottom: '0.5rem' }}>
            <Sparkles size={18} color="#0284c7" />
            <h3 style={{ margin: 0, fontSize: '1.05rem', color: '#0f172a' }}>8. Key Highlights &amp; Outcomes</h3>
          </div>

          <div className="admin-form-grid">
            <div className="admin-field" style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '1rem' }}>
              <label style={{ fontWeight: 700, color: '#0369a1', display: 'flex', alignItems: 'center', gap: '0.35rem', marginBottom: '0.5rem' }}>
                <Sparkles size={16} /> Key Highlights List (One per line)
              </label>
              <textarea
                value={getNonEmptyList(form.keyHighlights, DEFAULT_STATE.keyHighlights || []).join('\n')}
                onChange={(e) => setForm((p) => ({ ...p, keyHighlights: e.target.value.split('\n') }))}
                className="admin-input"
                rows={5}
                style={{ width: '100%', fontFamily: 'inherit' }}
              />
            </div>

            <div className="admin-field" style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '1rem' }}>
              <label style={{ fontWeight: 700, color: '#0369a1', display: 'flex', alignItems: 'center', gap: '0.35rem', marginBottom: '0.5rem' }}>
                <Award size={16} /> Outcomes List (One per line)
              </label>
              <textarea
                value={getNonEmptyList(form.outcomes, DEFAULT_STATE.outcomes || []).join('\n')}
                onChange={(e) => setForm((p) => ({ ...p, outcomes: e.target.value.split('\n') }))}
                className="admin-input"
                rows={5}
                style={{ width: '100%', fontFamily: 'inherit' }}
              />
            </div>
          </div>
        </div>

        {/* SECTION 9: ADDITIONAL CUSTOM NAVIGATION SECTIONS */}
        <div id="sec-custom" style={{ background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '10px', padding: '1.25rem', marginBottom: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem', marginBottom: '0.75rem', borderBottom: '2px solid #e2e8f0', paddingBottom: '0.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Sparkles size={18} color="#0284c7" />
              <h3 style={{ margin: 0, fontSize: '1.05rem', color: '#0f172a' }}>
                9. Additional Navigation Sections ({form.additionalSections?.length || 0})
              </h3>
            </div>
          </div>
          <p className="admin-field__hint" style={{ marginBottom: '1rem' }}>
            Add any additional sections or sub-sections needed — key highlights, equipment tables, checklists, lists of links, files, contacts, or photo galleries. Any top-level section created here automatically appears as a tab under Quick Navigation / More Information on the live public UltraTech CoE page.
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
            <Save size={14} /> {saving ? 'Saving...' : 'Save All UltraTech CoE Changes'}
          </button>
        </div>
      </div>
    </div>
  );
}
