import { useEffect, useState } from 'react';
import { doc, serverTimestamp } from 'firebase/firestore';
import { setDoc } from '../../../lib/auditLog';
import { db } from '../../../lib/firebase';
import { useDocument } from '../../../hooks/useDocument';
import { deleteFile, type UploadResult } from '../../../lib/storage';
import {
  chipsToStartup,
  type ProjectOutlay,
  type EdaToolsTable,
  type StatCard,
  type ResourcesData,
  type FacilitiesData,
} from '../../Differentiators/chipsToStartup.data';
import {
  Sparkles,
  Cpu,
  FileText,
  Boxes,
  Target,
  Building2,
  Star,
  Plus,
  Trash2,
  Save,
  RotateCcw,
  Lightbulb,
} from 'lucide-react';
import CustomSectionEditor from './CustomSectionEditor';
import { replaceAtPath, getAtPath, type CustomSection } from '../../../lib/customSections';

export interface CustomChipsSection extends CustomSection {
  title?: string;
  badge?: string;
  paragraphs?: string[];
  bulletPoints?: string[];
}

export interface ChipsToStartupDoc {
  heroTitle?: string;
  heroSubtitle?: string;
  aboutTitle?: string;
  aboutParagraphs?: string[];
  statCards?: StatCard[];
  objectives?: string[];
  projectOutlay?: Partial<ProjectOutlay>;
  resources?: Partial<ResourcesData>;
  edaTools?: Partial<EdaToolsTable>;
  projectObjectives?: { title?: string; items?: string[] };
  facilities?: Partial<FacilitiesData>;
  keyHighlights?: string[];
  galleryCaption?: string;
  additionalSections?: CustomChipsSection[];
}

const DEFAULT_STATE: ChipsToStartupDoc = {
  heroTitle: chipsToStartup.heroTitle,
  heroSubtitle: chipsToStartup.heroSubtitle,
  aboutTitle: chipsToStartup.aboutTitle,
  aboutParagraphs: [...chipsToStartup.aboutParagraphs],
  statCards: chipsToStartup.statCards.map((s) => ({ ...s })),
  objectives: [...chipsToStartup.objectives],
  projectOutlay: { ...chipsToStartup.projectOutlay },
  resources: { ...chipsToStartup.resources },
  edaTools: { ...chipsToStartup.edaTools },
  projectObjectives: { ...chipsToStartup.projectObjectives },
  facilities: { ...chipsToStartup.facilities },
  keyHighlights: [...chipsToStartup.keyHighlights],
  galleryCaption: chipsToStartup.galleryCaption,
  additionalSections: [],
};

function normalizeCustomSection(sec: any): CustomChipsSection {
  const label = sec.label || sec.title || 'Custom Section';
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
    files: sec.files || [],
    photo: sec.photo,
    galleryPhotos: sec.galleryPhotos || [],
    subSections: sec.subSections || [],
    placement: sec.placement || 'accordion',
  };
}

export default function ChipsToStartupContentAdmin() {
  const { data, loading } = useDocument<ChipsToStartupDoc>('settings', 'chipsToStartup');
  const [form, setForm] = useState<ChipsToStartupDoc>(DEFAULT_STATE);
  const [hasInitialized, setHasInitialized] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!loading && !hasInitialized) {
      if (data) {
        setForm({
          heroTitle: data.heroTitle || DEFAULT_STATE.heroTitle,
          heroSubtitle: data.heroSubtitle || DEFAULT_STATE.heroSubtitle,
          aboutTitle: data.aboutTitle || DEFAULT_STATE.aboutTitle,
          aboutParagraphs: data.aboutParagraphs && data.aboutParagraphs.length > 0 ? data.aboutParagraphs : DEFAULT_STATE.aboutParagraphs,
          statCards: data.statCards && data.statCards.length > 0 ? data.statCards : DEFAULT_STATE.statCards,
          objectives: data.objectives && data.objectives.length > 0 ? data.objectives : DEFAULT_STATE.objectives,
          projectOutlay: { ...DEFAULT_STATE.projectOutlay, ...(data.projectOutlay || {}) } as ProjectOutlay,
          resources: { ...DEFAULT_STATE.resources, ...(data.resources || {}) } as ResourcesData,
          edaTools: { ...DEFAULT_STATE.edaTools, ...(data.edaTools || {}) } as EdaToolsTable,
          projectObjectives: { ...DEFAULT_STATE.projectObjectives, ...(data.projectObjectives || {}) },
          facilities: { ...DEFAULT_STATE.facilities, ...(data.facilities || {}) } as FacilitiesData,
          keyHighlights: data.keyHighlights && data.keyHighlights.length > 0 ? data.keyHighlights : DEFAULT_STATE.keyHighlights,
          galleryCaption: data.galleryCaption || DEFAULT_STATE.galleryCaption,
          additionalSections: (data.additionalSections || []).map(normalizeCustomSection),
        });
      }
      setHasInitialized(true);
    }
  }, [data, loading, hasInitialized]);

  const save = async () => {
    setSaving(true);
    try {
      const formattedSections = (form.additionalSections || []).map((sec) => ({
        ...sec,
        title: sec.title || sec.label,
        label: sec.label || sec.title,
        badge: sec.badge || sec.subtitle || '',
        subtitle: sec.badge || sec.subtitle || '',
        paragraphs: sec.textContent ? sec.textContent.split('\n').filter(Boolean) : sec.paragraphs || [],
        bulletPoints: sec.listText ? sec.listText.split('\n').filter(Boolean) : sec.bulletPoints || [],
      }));

      await setDoc(doc(db, 'settings', 'chipsToStartup'), {
        ...form,
        additionalSections: formattedSections,
        updatedAt: serverTimestamp(),
      }, { merge: true });
      alert('Chips to Startup (C2S) content updated successfully!');
    } catch (e) {
      alert(`Couldn't save: ${(e as Error).message}`);
    } finally {
      setSaving(false);
    }
  };

  const resetToDefaults = () => {
    if (confirm('Reset all Chips to Startup text to starting default values? You can still review and edit before saving.')) {
      setForm(DEFAULT_STATE);
    }
  };

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Custom Section Upload Handlers
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
      alert(`Couldn't delete photo: ${(e as Error).message}`);
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

  return (
    <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: '12px', border: '1px solid #e2e8f0', marginTop: '1.5rem' }}>
      {/* Top Sticky Bar / Header */}
      <div style={{ background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '10px', padding: '1.25rem', marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', borderBottom: '1px solid #e2e8f0', paddingBottom: '1rem', marginBottom: '1rem' }}>
          <div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0F2547', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Cpu size={22} color="#008080" />
              Chips to Startup (C2S) — Page Content &amp; Structure
            </h2>
            <p style={{ fontSize: '0.85rem', color: '#64748b', margin: '0.25rem 0 0 0' }}>
              Edit all page content in the exact top-to-bottom sequence as displayed on the live public website.
            </p>
          </div>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button type="button" onClick={resetToDefaults} className="admin-btn admin-btn--ghost" style={{ fontSize: '0.8rem' }}>
              <RotateCcw size={14} /> Reset Defaults
            </button>
            <button type="button" onClick={save} disabled={saving} className="admin-btn admin-btn--primary" style={{ background: '#008080', borderColor: '#008080', fontSize: '0.85rem' }}>
              <Save size={14} /> {saving ? 'Saving...' : 'Save All C2S Changes'}
            </button>
          </div>
        </div>

        {/* Quick Jump Links Bar */}
        <div>
          <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em', marginRight: '0.5rem' }}>
            Jump to Section:
          </span>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginTop: '0.4rem' }}>
            {[
              { id: 'sec-hero', label: '1. Hero Banner' },
              { id: 'sec-about', label: '2. About & Stats' },
              { id: 'sec-objectives', label: '3. Objectives' },
              { id: 'sec-outlay', label: '4. Project Outlay' },
              { id: 'sec-resources', label: '5. Resources' },
              { id: 'sec-eda-tools', label: '6. EDA Tools' },
              { id: 'sec-project-objectives', label: '7. Project Objectives' },
              { id: 'sec-facilities', label: '8. Facilities' },
              { id: 'sec-highlights', label: '9. Key Highlights' },
              { id: 'sec-custom-sections', label: '10. Custom Extra Sections' },
            ].map((btn) => (
              <button
                key={btn.id}
                type="button"
                onClick={() => scrollToSection(btn.id)}
                style={{
                  padding: '0.35rem 0.65rem',
                  fontSize: '0.78rem',
                  fontWeight: 600,
                  borderRadius: '6px',
                  border: '1px solid #cbd5e1',
                  background: '#f1f5f9',
                  color: '#334155',
                  cursor: 'pointer',
                }}
              >
                {btn.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* SECTION 1: HERO BANNER & MAIN TITLE */}
      <div id="sec-hero" style={{ background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '10px', padding: '1.25rem', marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem', borderBottom: '2px solid #e2e8f0', paddingBottom: '0.5rem' }}>
          <Sparkles size={18} color="#008080" />
          <h3 style={{ margin: 0, fontSize: '1.05rem', color: '#0F2547' }}>1. Hero Banner &amp; Main Title</h3>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label className="admin-label">Hero Title</label>
            <input
              type="text"
              className="admin-input"
              value={form.heroTitle || ''}
              onChange={(e) => setForm((p) => ({ ...p, heroTitle: e.target.value }))}
              placeholder="Chips to Startup (C2S)"
            />
          </div>
          <div>
            <label className="admin-label">Hero Subtitle</label>
            <textarea
              className="admin-textarea"
              rows={3}
              value={form.heroSubtitle || ''}
              onChange={(e) => setForm((p) => ({ ...p, heroSubtitle: e.target.value }))}
              placeholder="Building a strong System-on-Chip (SoC) design ecosystem..."
            />
          </div>
        </div>
      </div>

      {/* SECTION 2: ABOUT THE PROGRAMME & STAT CARDS */}
      <div id="sec-about" style={{ background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '10px', padding: '1.25rem', marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem', borderBottom: '2px solid #e2e8f0', paddingBottom: '0.5rem' }}>
          <Sparkles size={18} color="#008080" />
          <h3 style={{ margin: 0, fontSize: '1.05rem', color: '#0F2547' }}>2. About the Programme &amp; Metric / Stat Cards</h3>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div>
            <label className="admin-label">About Heading</label>
            <input
              type="text"
              className="admin-input"
              value={form.aboutTitle || ''}
              onChange={(e) => setForm((p) => ({ ...p, aboutTitle: e.target.value }))}
              placeholder="About the Programme"
            />
          </div>

          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
              <label className="admin-label" style={{ margin: 0 }}>About Paragraphs</label>
              <button
                type="button"
                onClick={() => setForm((prev) => ({ ...prev, aboutParagraphs: [...(prev.aboutParagraphs || []), ''] }))}
                className="admin-btn admin-btn--sm admin-btn--ghost"
              >
                <Plus size={13} /> Add Paragraph
              </button>
            </div>
            {(form.aboutParagraphs || []).map((p, idx) => (
              <div key={idx} style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <textarea
                  className="admin-textarea"
                  rows={3}
                  value={p}
                  onChange={(e) => {
                    const list = [...(form.aboutParagraphs || [])];
                    list[idx] = e.target.value;
                    setForm((prev) => ({ ...prev, aboutParagraphs: list }));
                  }}
                />
                <button
                  type="button"
                  onClick={() => {
                    const list = (form.aboutParagraphs || []).filter((_, i) => i !== idx);
                    setForm((prev) => ({ ...prev, aboutParagraphs: list }));
                  }}
                  className="admin-btn-danger"
                  style={{ alignSelf: 'flex-start' }}
                  title="Delete paragraph"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>

          <div>
            <label className="admin-label" style={{ marginBottom: '0.75rem', display: 'block' }}>
              Metric / Stat Cards (4 Cards)
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
              {(form.statCards || []).map((card, idx) => (
                <div key={idx} style={{ background: '#F8FAFC', padding: '1rem', borderRadius: '8px', border: '1px solid #E2E8F0', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <label className="admin-label" style={{ fontWeight: 800, color: '#0F2547' }}>Card #{idx + 1} Label</label>
                  <input
                    type="text"
                    className="admin-input"
                    value={card.title}
                    onChange={(e) => {
                      const list = [...(form.statCards || [])];
                      list[idx] = { ...list[idx], title: e.target.value };
                      setForm((p) => ({ ...p, statCards: list }));
                    }}
                  />
                  <label className="admin-label">Value</label>
                  <input
                    type="text"
                    className="admin-input"
                    value={card.val}
                    onChange={(e) => {
                      const list = [...(form.statCards || [])];
                      list[idx] = { ...list[idx], val: e.target.value };
                      setForm((p) => ({ ...p, statCards: list }));
                    }}
                  />
                  <label className="admin-label">Description</label>
                  <textarea
                    className="admin-textarea"
                    rows={2}
                    value={card.desc}
                    onChange={(e) => {
                      const list = [...(form.statCards || [])];
                      list[idx] = { ...list[idx], desc: e.target.value };
                      setForm((p) => ({ ...p, statCards: list }));
                    }}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 3: PROGRAMME OBJECTIVES */}
      <div id="sec-objectives" style={{ background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '10px', padding: '1.25rem', marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem', marginBottom: '0.75rem', borderBottom: '2px solid #e2e8f0', paddingBottom: '0.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Lightbulb size={18} color="#008080" />
            <h3 style={{ margin: 0, fontSize: '1.05rem', color: '#0F2547' }}>3. Programme Objectives</h3>
          </div>
          <button
            type="button"
            onClick={() => setForm((p) => ({ ...p, objectives: [...(p.objectives || []), ''] }))}
            className="admin-btn admin-btn--sm admin-btn--ghost"
          >
            <Plus size={13} /> Add Objective
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {(form.objectives || []).map((obj, idx) => (
            <div key={idx} style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#64748b', width: '1.5rem', textAlign: 'right' }}>
                {idx + 1}.
              </span>
              <input
                type="text"
                className="admin-input"
                value={obj}
                onChange={(e) => {
                  const list = [...(form.objectives || [])];
                  list[idx] = e.target.value;
                  setForm((p) => ({ ...p, objectives: list }));
                }}
                style={{ flex: 1 }}
              />
              <button
                type="button"
                onClick={() => {
                  const list = (form.objectives || []).filter((_, i) => i !== idx);
                  setForm((p) => ({ ...p, objectives: list }));
                }}
                className="admin-btn-danger"
                title="Remove objective"
              >
                <Trash2 size={14} />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* SECTION 4: PROJECT OVERVIEW & FUNDING (PROJECT OUTLAY) */}
      <div id="sec-outlay" style={{ background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '10px', padding: '1.25rem', marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem', borderBottom: '2px solid #e2e8f0', paddingBottom: '0.5rem' }}>
          <FileText size={18} color="#008080" />
          <h3 style={{ margin: 0, fontSize: '1.05rem', color: '#0F2547' }}>4. Project Overview &amp; Funding (Project Outlay)</h3>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label className="admin-label">Section Title</label>
            <input
              type="text"
              className="admin-input"
              value={form.projectOutlay?.title || ''}
              onChange={(e) => setForm((p) => ({ ...p, projectOutlay: { ...p.projectOutlay, title: e.target.value } }))}
              placeholder="Project Overview & Funding"
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1rem' }}>
            <div>
              <label className="admin-label">Institution</label>
              <input
                type="text"
                className="admin-input"
                value={form.projectOutlay?.institute || ''}
                onChange={(e) => setForm((p) => ({ ...p, projectOutlay: { ...p.projectOutlay, institute: e.target.value } }))}
                placeholder="Vishnu Women's University, Bhimavaram"
              />
            </div>

            <div>
              <label className="admin-label">Project Title</label>
              <input
                type="text"
                className="admin-input"
                value={form.projectOutlay?.projectTitle || ''}
                onChange={(e) => setForm((p) => ({ ...p, projectOutlay: { ...p.projectOutlay, projectTitle: e.target.value } }))}
                placeholder="Memory Optimized Co-Processing Unit for Enhanced Edge AI"
              />
            </div>

            <div>
              <label className="admin-label">Total Outlay Amount</label>
              <input
                type="text"
                className="admin-input"
                value={form.projectOutlay?.totalOutlay || ''}
                onChange={(e) => setForm((p) => ({ ...p, projectOutlay: { ...p.projectOutlay, totalOutlay: e.target.value } }))}
                placeholder="₹64.5 lakh"
              />
            </div>

            <div>
              <label className="admin-label">Duration</label>
              <input
                type="text"
                className="admin-input"
                value={form.projectOutlay?.duration || ''}
                onChange={(e) => setForm((p) => ({ ...p, projectOutlay: { ...p.projectOutlay, duration: e.target.value } }))}
                placeholder="5 years"
              />
            </div>
          </div>

          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
              <label className="admin-label" style={{ margin: 0 }}>Project Investigators</label>
              <button
                type="button"
                onClick={() => {
                  const current = form.projectOutlay?.investigators || [];
                  setForm((p) => ({ ...p, projectOutlay: { ...p.projectOutlay, investigators: [...current, ''] } }));
                }}
                className="admin-btn admin-btn--sm admin-btn--ghost"
              >
                <Plus size={13} /> Add Investigator
              </button>
            </div>
            {(form.projectOutlay?.investigators || []).map((inv, idx) => (
              <div key={idx} style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.4rem', alignItems: 'center' }}>
                <input
                  type="text"
                  className="admin-input"
                  value={inv}
                  onChange={(e) => {
                    const list = [...(form.projectOutlay?.investigators || [])];
                    list[idx] = e.target.value;
                    setForm((p) => ({ ...p, projectOutlay: { ...p.projectOutlay, investigators: list } }));
                  }}
                  style={{ flex: 1 }}
                  placeholder="e.g. Dr. K. Padma Vasavi – Chief Investigator"
                />
                <button
                  type="button"
                  onClick={() => {
                    const list = (form.projectOutlay?.investigators || []).filter((_, i) => i !== idx);
                    setForm((p) => ({ ...p, projectOutlay: { ...p.projectOutlay, investigators: list } }));
                  }}
                  className="admin-btn-danger"
                  title="Remove investigator"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* SECTION 5: PROGRAMME RESOURCES & CAPACITY BUILDING */}
      <div id="sec-resources" style={{ background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '10px', padding: '1.25rem', marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem', borderBottom: '2px solid #e2e8f0', paddingBottom: '0.5rem' }}>
          <Boxes size={18} color="#008080" />
          <h3 style={{ margin: 0, fontSize: '1.05rem', color: '#0F2547' }}>5. Programme Resources &amp; Capacity Building</h3>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label className="admin-label">Section Title</label>
            <input
              type="text"
              className="admin-input"
              value={form.resources?.title || ''}
              onChange={(e) => setForm((p) => ({ ...p, resources: { ...p.resources, title: e.target.value } }))}
              placeholder="Programme Resources & Capacity Building"
            />
          </div>

          <div>
            <label className="admin-label">Introductory Text</label>
            <textarea
              className="admin-textarea"
              rows={2}
              value={form.resources?.intro || ''}
              onChange={(e) => setForm((p) => ({ ...p, resources: { ...p.resources, intro: e.target.value } }))}
            />
          </div>

          <div>
            <label className="admin-label">Key Intro Heading</label>
            <input
              type="text"
              className="admin-input"
              value={form.resources?.keyIntro || ''}
              onChange={(e) => setForm((p) => ({ ...p, resources: { ...p.resources, keyIntro: e.target.value } }))}
              placeholder="Key resources and initiatives include:"
            />
          </div>

          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
              <label className="admin-label" style={{ margin: 0 }}>Resources &amp; Initiatives Checklist</label>
              <button
                type="button"
                onClick={() => {
                  const current = form.resources?.items || [];
                  setForm((p) => ({ ...p, resources: { ...p.resources, items: [...current, ''] } }));
                }}
                className="admin-btn admin-btn--sm admin-btn--ghost"
              >
                <Plus size={13} /> Add Resource
              </button>
            </div>
            {(form.resources?.items || []).map((item, idx) => (
              <div key={idx} style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.4rem', alignItems: 'center' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#64748b', width: '1.5rem', textAlign: 'right' }}>
                  {idx + 1}.
                </span>
                <input
                  type="text"
                  className="admin-input"
                  value={item}
                  onChange={(e) => {
                    const list = [...(form.resources?.items || [])];
                    list[idx] = e.target.value;
                    setForm((p) => ({ ...p, resources: { ...p.resources, items: list } }));
                  }}
                  style={{ flex: 1 }}
                />
                <button
                  type="button"
                  onClick={() => {
                    const list = (form.resources?.items || []).filter((_, i) => i !== idx);
                    setForm((p) => ({ ...p, resources: { ...p.resources, items: list } }));
                  }}
                  className="admin-btn-danger"
                  title="Remove resource item"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* SECTION 6: EDA TOOLS & DESIGN INFRASTRUCTURE */}
      <div id="sec-eda-tools" style={{ background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '10px', padding: '1.25rem', marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem', borderBottom: '2px solid #e2e8f0', paddingBottom: '0.5rem' }}>
          <Cpu size={18} color="#008080" />
          <h3 style={{ margin: 0, fontSize: '1.05rem', color: '#0F2547' }}>6. EDA Tools &amp; Design Infrastructure</h3>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label className="admin-label">Section Title</label>
            <input
              type="text"
              className="admin-input"
              value={form.edaTools?.title || ''}
              onChange={(e) => setForm((p) => ({ ...p, edaTools: { ...p.edaTools, title: e.target.value } }))}
              placeholder="EDA Tools & Design Infrastructure"
            />
          </div>

          <div>
            <label className="admin-label">Introductory Text</label>
            <textarea
              className="admin-textarea"
              rows={2}
              value={form.edaTools?.intro || ''}
              onChange={(e) => setForm((p) => ({ ...p, edaTools: { ...p.edaTools, intro: e.target.value } }))}
            />
          </div>

          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
              <label className="admin-label" style={{ margin: 0 }}>EDA Tools Table Rows (S.No | Tool Name | Description)</label>
              <button
                type="button"
                onClick={() => {
                  const count = (form.edaTools?.rows || []).length + 1;
                  setForm((p) => ({
                    ...p,
                    edaTools: {
                      ...p.edaTools,
                      rows: [...(p.edaTools?.rows || []), { cells: [`${count}`, '', ''] }],
                    },
                  }));
                }}
                className="admin-btn admin-btn--sm admin-btn--ghost"
              >
                <Plus size={13} /> Add Tool Row
              </button>
            </div>

            {(form.edaTools?.rows || []).map((row, idx) => (
              <div key={idx} style={{ display: 'grid', gridTemplateColumns: '60px 200px 1fr auto', gap: '0.5rem', marginBottom: '0.4rem', alignItems: 'center' }}>
                <input
                  type="text"
                  className="admin-input"
                  value={row.cells[0] || `${idx + 1}`}
                  onChange={(e) => {
                    const list = [...(form.edaTools?.rows || [])];
                    list[idx] = { cells: [e.target.value, row.cells[1] || '', row.cells[2] || ''] };
                    setForm((p) => ({ ...p, edaTools: { ...p.edaTools, rows: list } }));
                  }}
                  placeholder="S.No"
                />
                <input
                  type="text"
                  className="admin-input"
                  value={row.cells[1] || ''}
                  onChange={(e) => {
                    const list = [...(form.edaTools?.rows || [])];
                    list[idx] = { cells: [row.cells[0] || `${idx + 1}`, e.target.value, row.cells[2] || ''] };
                    setForm((p) => ({ ...p, edaTools: { ...p.edaTools, rows: list } }));
                  }}
                  placeholder="Tool Name (e.g. Cadence)"
                  style={{ fontWeight: 600 }}
                />
                <input
                  type="text"
                  className="admin-input"
                  value={row.cells[2] || ''}
                  onChange={(e) => {
                    const list = [...(form.edaTools?.rows || [])];
                    list[idx] = { cells: [row.cells[0] || `${idx + 1}`, row.cells[1] || '', e.target.value] };
                    setForm((p) => ({ ...p, edaTools: { ...p.edaTools, rows: list } }));
                  }}
                  placeholder="Product Description..."
                />
                <button
                  type="button"
                  onClick={() => {
                    const list = (form.edaTools?.rows || []).filter((_, i) => i !== idx);
                    setForm((p) => ({ ...p, edaTools: { ...p.edaTools, rows: list } }));
                  }}
                  className="admin-btn-danger"
                  title="Remove tool row"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* SECTION 7: PROJECT OBJECTIVES (BROAD OBJECTIVES OF PROJECT) */}
      <div id="sec-project-objectives" style={{ background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '10px', padding: '1.25rem', marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem', marginBottom: '0.75rem', borderBottom: '2px solid #e2e8f0', paddingBottom: '0.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Target size={18} color="#008080" />
            <h3 style={{ margin: 0, fontSize: '1.05rem', color: '#0F2547' }}>7. Project Objectives</h3>
          </div>
          <button
            type="button"
            onClick={() => {
              const current = form.projectObjectives?.items || [];
              setForm((p) => ({
                ...p,
                projectObjectives: { ...p.projectObjectives, items: [...current, ''] },
              }));
            }}
            className="admin-btn admin-btn--sm admin-btn--ghost"
          >
            <Plus size={13} /> Add Project Objective
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
          <div>
            <label className="admin-label">Section Title</label>
            <input
              type="text"
              className="admin-input"
              value={form.projectObjectives?.title || ''}
              onChange={(e) => setForm((p) => ({ ...p, projectObjectives: { ...p.projectObjectives, title: e.target.value } }))}
              placeholder="Project Objectives"
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {(form.projectObjectives?.items || []).map((item, idx) => (
              <div key={idx} style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#64748b', width: '1.5rem', textAlign: 'right' }}>
                  0{idx + 1}.
                </span>
                <input
                  type="text"
                  className="admin-input"
                  value={item}
                  onChange={(e) => {
                    const list = [...(form.projectObjectives?.items || [])];
                    list[idx] = e.target.value;
                    setForm((p) => ({
                      ...p,
                      projectObjectives: { ...p.projectObjectives, items: list },
                    }));
                  }}
                  style={{ flex: 1 }}
                />
                <button
                  type="button"
                  onClick={() => {
                    const list = (form.projectObjectives?.items || []).filter((_, i) => i !== idx);
                    setForm((p) => ({
                      ...p,
                      projectObjectives: { ...p.projectObjectives, items: list },
                    }));
                  }}
                  className="admin-btn-danger"
                  title="Remove objective item"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* SECTION 8: FACILITIES & EQUIPMENT */}
      <div id="sec-facilities" style={{ background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '10px', padding: '1.25rem', marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem', borderBottom: '2px solid #e2e8f0', paddingBottom: '0.5rem' }}>
          <Building2 size={18} color="#008080" />
          <h3 style={{ margin: 0, fontSize: '1.05rem', color: '#0F2547' }}>8. Facilities &amp; Equipment</h3>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label className="admin-label">Section Title</label>
            <input
              type="text"
              className="admin-input"
              value={form.facilities?.title || ''}
              onChange={(e) => setForm((p) => ({ ...p, facilities: { ...p.facilities, title: e.target.value } }))}
              placeholder="Facilities & Equipment"
            />
          </div>

          <div>
            <label className="admin-label">Introductory Text</label>
            <textarea
              className="admin-textarea"
              rows={2}
              value={form.facilities?.intro || ''}
              onChange={(e) => setForm((p) => ({ ...p, facilities: { ...p.facilities, intro: e.target.value } }))}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
            {/* Development Hardware */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <label className="admin-label" style={{ margin: 0, fontWeight: 700 }}>Development Hardware</label>
                <button
                  type="button"
                  onClick={() => {
                    const current = form.facilities?.developmentHardware || [];
                    setForm((p) => ({ ...p, facilities: { ...p.facilities, developmentHardware: [...current, ''] } }));
                  }}
                  className="admin-btn admin-btn--sm admin-btn--ghost"
                >
                  <Plus size={13} /> Add Hardware
                </button>
              </div>
              {(form.facilities?.developmentHardware || []).map((hw, idx) => (
                <div key={idx} style={{ display: 'flex', gap: '0.4rem', marginBottom: '0.4rem', alignItems: 'center' }}>
                  <input
                    type="text"
                    className="admin-input"
                    value={hw}
                    onChange={(e) => {
                      const list = [...(form.facilities?.developmentHardware || [])];
                      list[idx] = e.target.value;
                      setForm((p) => ({ ...p, facilities: { ...p.facilities, developmentHardware: list } }));
                    }}
                    style={{ flex: 1 }}
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const list = (form.facilities?.developmentHardware || []).filter((_, i) => i !== idx);
                      setForm((p) => ({ ...p, facilities: { ...p.facilities, developmentHardware: list } }));
                    }}
                    className="admin-btn-danger"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>

            {/* Design Infrastructure */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <label className="admin-label" style={{ margin: 0, fontWeight: 700 }}>Design Infrastructure</label>
                <button
                  type="button"
                  onClick={() => {
                    const current = form.facilities?.designInfrastructure || [];
                    setForm((p) => ({ ...p, facilities: { ...p.facilities, designInfrastructure: [...current, ''] } }));
                  }}
                  className="admin-btn admin-btn--sm admin-btn--ghost"
                >
                  <Plus size={13} /> Add Infra Item
                </button>
              </div>
              {(form.facilities?.designInfrastructure || []).map((infra, idx) => (
                <div key={idx} style={{ display: 'flex', gap: '0.4rem', marginBottom: '0.4rem', alignItems: 'center' }}>
                  <input
                    type="text"
                    className="admin-input"
                    value={infra}
                    onChange={(e) => {
                      const list = [...(form.facilities?.designInfrastructure || [])];
                      list[idx] = e.target.value;
                      setForm((p) => ({ ...p, facilities: { ...p.facilities, designInfrastructure: list } }));
                    }}
                    style={{ flex: 1 }}
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const list = (form.facilities?.designInfrastructure || []).filter((_, i) => i !== idx);
                      setForm((p) => ({ ...p, facilities: { ...p.facilities, designInfrastructure: list } }));
                    }}
                    className="admin-btn-danger"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 9: KEY HIGHLIGHTS */}
      <div id="sec-highlights" style={{ background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '10px', padding: '1.25rem', marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem', marginBottom: '0.75rem', borderBottom: '2px solid #e2e8f0', paddingBottom: '0.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Star size={18} color="#008080" />
            <h3 style={{ margin: 0, fontSize: '1.05rem', color: '#0F2547' }}>9. Key Highlights</h3>
          </div>
          <button
            type="button"
            onClick={() => setForm((p) => ({ ...p, keyHighlights: [...(p.keyHighlights || []), ''] }))}
            className="admin-btn admin-btn--sm admin-btn--ghost"
          >
            <Plus size={13} /> Add Highlight
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {(form.keyHighlights || []).map((kh, idx) => (
            <div key={idx} style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#64748b', width: '1.5rem', textAlign: 'right' }}>
                {idx + 1}.
              </span>
              <input
                type="text"
                className="admin-input"
                value={kh}
                onChange={(e) => {
                  const list = [...(form.keyHighlights || [])];
                  list[idx] = e.target.value;
                  setForm((p) => ({ ...p, keyHighlights: list }));
                }}
                style={{ flex: 1 }}
              />
              <button
                type="button"
                onClick={() => {
                  const list = (form.keyHighlights || []).filter((_, i) => i !== idx);
                  setForm((p) => ({ ...p, keyHighlights: list }));
                }}
                className="admin-btn-danger"
                title="Remove highlight"
              >
                <Trash2 size={14} />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* SECTION 10: CUSTOM EXTRA SECTIONS */}
      <div id="sec-custom-sections" style={{ background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '10px', padding: '1.25rem', marginBottom: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem', marginBottom: '0.75rem', borderBottom: '2px solid #e2e8f0', paddingBottom: '0.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Sparkles size={18} color="#008080" />
            <h3 style={{ margin: 0, fontSize: '1.05rem', color: '#0F2547' }}>
              10. Additional Custom Sections ({form.additionalSections?.length || 0})
            </h3>
          </div>
        </div>
        <p className="admin-field__hint" style={{ marginBottom: '1rem' }}>
          Add any custom section or module (text, tables, checklists, links, files, or photo galleries) just like on the AICTE IDEA Lab page. Any top-level section created here automatically appears on the public page.
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

      {/* Bottom Save Bar */}
      <div style={{ marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid #cbd5e1', display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
        <button type="button" onClick={save} disabled={saving} className="admin-btn admin-btn--primary" style={{ padding: '0.6rem 1.5rem', background: '#008080', borderColor: '#008080' }}>
          <Save size={16} style={{ marginRight: '0.35rem' }} /> {saving ? 'Saving...' : 'Save All C2S Changes'}
        </button>
      </div>
    </div>
  );
}
