import { useEffect, useState } from 'react';
import { doc, serverTimestamp } from 'firebase/firestore';
import { setDoc } from '../../../lib/auditLog';
import { db } from '../../../lib/firebase';
import { useDocument } from '../../../hooks/useDocument';
import { deleteFile, type UploadResult } from '../../../lib/storage';
import {
  vsac,
  type VsacMember,
  type TrainingResearchItem,
  type CollaborationBullet,
  type SimpleTable,
} from '../../Differentiators/vsac.data';
import {
  Sparkles,
  Radio,
  Target,
  Users,
  Building2,
  BookOpen,
  Globe2,
  Award,
  Plus,
  Trash2,
  Save,
  RotateCcw,
} from 'lucide-react';
import CustomSectionEditor from './CustomSectionEditor';
import { replaceAtPath, getAtPath, type CustomSection } from '../../../lib/customSections';

export interface CustomVsacSection extends CustomSection {
  title?: string;
  badge?: string;
  paragraphs?: string[];
  bulletPoints?: string[];
}

export interface VsacDoc {
  hero?: {
    category?: string;
    title?: string;
    subtitle?: string;
  };
  aboutTitle?: string;
  paragraphs?: string[];
  visionTitle?: string;
  vision?: string;
  missionTitle?: string;
  mission?: string[];
  objectivesTitle?: string;
  objectives?: string[];
  team?: {
    inCharge?: VsacMember[];
    facultyMembers?: VsacMember[];
  };
  trainingResearch?: TrainingResearchItem[];
  industryCollaboration?: {
    title?: string;
    paragraphs?: string[];
  };
  socialImpacts?: {
    title?: string;
    bullets?: CollaborationBullet[];
  };
  learningOutcomes?: {
    title?: string;
    bullets?: CollaborationBullet[];
  };
  galleryTitle?: string;
  galleryCaption?: string;
  additionalSections?: CustomVsacSection[];
}

function cloneTable(table?: SimpleTable): SimpleTable | undefined {
  if (!table) return undefined;
  return {
    headers: [...(table.headers || [])],
    rows: (table.rows || []).map((r: { cells: string[] }) => ({ cells: [...(r.cells || [])] })),
  };
}

function cloneTrainingItem(t: TrainingResearchItem): TrainingResearchItem {
  return {
    title: t.title || '',
    paragraphs: [...(t.paragraphs || [])],
    tableTitle: t.tableTitle || '',
    table: cloneTable(t.table),
    images: [...(t.images || [])],
    secondParagraph: t.secondParagraph || '',
    secondTable: cloneTable(t.secondTable),
  };
}

const DEFAULT_STATE: VsacDoc = {
  hero: {
    category: vsac.heroCategory,
    title: vsac.heroTitle,
    subtitle: vsac.heroSubtitle,
  },
  aboutTitle: vsac.aboutTitle,
  paragraphs: [...vsac.paragraphs],
  visionTitle: vsac.visionTitle,
  vision: vsac.vision,
  missionTitle: vsac.missionTitle,
  mission: [...vsac.mission],
  objectivesTitle: vsac.objectivesTitle,
  objectives: [...vsac.objectives],
  team: {
    inCharge: vsac.team.inCharge.map((m) => ({ ...m })),
    facultyMembers: vsac.team.facultyMembers.map((m) => ({ ...m })),
  },
  trainingResearch: vsac.trainingResearch.map(cloneTrainingItem),
  industryCollaboration: {
    title: vsac.industryCollaboration.title,
    paragraphs: [...vsac.industryCollaboration.paragraphs],
  },
  socialImpacts: {
    title: vsac.socialImpacts.title,
    bullets: vsac.socialImpacts.bullets.map((b) => ({ ...b })),
  },
  learningOutcomes: {
    title: vsac.learningOutcomes.title,
    bullets: vsac.learningOutcomes.bullets.map((b) => ({ ...b })),
  },
  galleryTitle: vsac.galleryTitle,
  galleryCaption: vsac.galleryCaption,
  additionalSections: [],
};

function normalizeCustomSection(sec: any): CustomVsacSection {
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

function TableEditor({
  label,
  table,
  onChange,
  onRemove,
}: {
  label: string;
  table?: SimpleTable;
  onChange: (t: SimpleTable | undefined) => void;
  onRemove?: () => void;
}) {
  if (!table) {
    return (
      <div style={{ background: '#FFFFFF', padding: '0.75rem', borderRadius: '6px', border: '1px dashed #CBD5E1', margin: '0.5rem 0' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#64748B' }}>{label} (Not added)</span>
          <button
            type="button"
            className="admin-btn admin-btn--sm admin-btn--ghost"
            onClick={() =>
              onChange({
                headers: ['S.No', 'Name', 'Designation'],
                rows: [{ cells: ['1', '', ''] }],
              })
            }
          >
            <Plus size={13} /> Add {label}
          </button>
        </div>
      </div>
    );
  }

  const headers = table.headers || ['S.No', 'Name', 'Designation'];

  const updateHeader = (colIdx: number, val: string) => {
    const newHeaders = [...headers];
    newHeaders[colIdx] = val;
    onChange({ ...table, headers: newHeaders });
  };

  const addColumn = () => {
    const newHeaders = [...headers, `Column ${headers.length + 1}`];
    const newRows = (table.rows || []).map((r: { cells: string[] }) => ({ cells: [...r.cells, ''] }));
    onChange({ headers: newHeaders, rows: newRows });
  };

  const removeColumn = (colIdx: number) => {
    if (headers.length <= 1) return;
    const newHeaders = headers.filter((_: string, i: number) => i !== colIdx);
    const newRows = (table.rows || []).map((r: { cells: string[] }) => ({ cells: r.cells.filter((_: string, i: number) => i !== colIdx) }));
    onChange({ headers: newHeaders, rows: newRows });
  };

  const updateCell = (rowIdx: number, colIdx: number, val: string) => {
    const newRows = (table.rows || []).map((r: { cells: string[] }, rI: number) => {
      if (rI !== rowIdx) return r;
      const newCells = [...(r.cells || [])];
      newCells[colIdx] = val;
      return { cells: newCells };
    });
    onChange({ ...table, rows: newRows });
  };

  const addRow = () => {
    const nextNum = (table.rows || []).length + 1;
    const newCells = headers.map((_: string, colIdx: number) => (colIdx === 0 ? String(nextNum) : ''));
    const newRows = [...(table.rows || []), { cells: newCells }];
    onChange({ ...table, rows: newRows });
  };

  const removeRow = (rowIdx: number) => {
    const newRows = (table.rows || []).filter((_: { cells: string[] }, i: number) => i !== rowIdx);
    onChange({ ...table, rows: newRows });
  };

  return (
    <div style={{ background: '#FFFFFF', padding: '0.85rem', borderRadius: '6px', border: '1px solid #CBD5E1', margin: '0.5rem 0' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
        <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#0B1E42' }}>{label}</span>
        <div style={{ display: 'flex', gap: '0.4rem' }}>
          <button type="button" className="admin-btn admin-btn--sm admin-btn--ghost" onClick={addColumn}>
            <Plus size={12} /> Add Column
          </button>
          <button type="button" className="admin-btn admin-btn--sm admin-btn--ghost" onClick={addRow}>
            <Plus size={12} /> Add Member / Row
          </button>
          {onRemove && (
            <button type="button" className="admin-btn-danger" style={{ fontSize: '0.75rem', padding: '0.2rem 0.5rem' }} onClick={onRemove}>
              <Trash2 size={12} /> Remove Table
            </button>
          )}
        </div>
      </div>

      {/* Table Headers */}
      <div style={{ marginBottom: '0.5rem', overflowX: 'auto' }}>
        <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748B', marginBottom: '0.25rem' }}>Table Columns / Headers</div>
        <div style={{ display: 'flex', gap: '0.4rem' }}>
          {headers.map((h: string, colIdx: number) => (
            <div key={colIdx} style={{ display: 'flex', alignItems: 'center', gap: '0.2rem', flex: 1, minWidth: '110px' }}>
              <input
                type="text"
                className="admin-input"
                style={{ fontWeight: 700, fontSize: '0.8rem', padding: '0.25rem 0.4rem', background: '#F1F5F9' }}
                value={h}
                onChange={(e) => updateHeader(colIdx, e.target.value)}
                placeholder={`Col ${colIdx + 1}`}
              />
              {headers.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeColumn(colIdx)}
                  style={{ background: 'none', border: 'none', color: '#EF4444', cursor: 'pointer', padding: '2px' }}
                  title="Remove column"
                >
                  <Trash2 size={12} />
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Table Rows (Members) */}
      <div style={{ maxHeight: '350px', overflowY: 'auto', border: '1px solid #E2E8F0', borderRadius: '4px', padding: '0.4rem', background: '#FAFAFA' }}>
        {(table.rows || []).map((row: { cells: string[] }, rowIdx: number) => (
          <div key={rowIdx} style={{ display: 'flex', gap: '0.4rem', marginBottom: '0.35rem', alignItems: 'center' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#94A3B8', minWidth: '1.5rem', textAlign: 'right' }}>
              {rowIdx + 1}.
            </span>
            {headers.map((_: string, colIdx: number) => (
              <input
                key={colIdx}
                type="text"
                className="admin-input"
                style={{ flex: 1, minWidth: '100px', fontSize: '0.8rem', padding: '0.25rem 0.4rem' }}
                value={row.cells[colIdx] || ''}
                onChange={(e) => updateCell(rowIdx, colIdx, e.target.value)}
                placeholder={`Cell ${colIdx + 1}`}
              />
            ))}
            <button
              type="button"
              className="admin-btn-danger"
              style={{ padding: '0.2rem 0.4rem' }}
              onClick={() => removeRow(rowIdx)}
              title="Remove row"
            >
              <Trash2 size={12} />
            </button>
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.5rem' }}>
        <span style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: 600 }}>Total Members/Rows: {(table.rows || []).length}</span>
        <button type="button" className="admin-btn admin-btn--sm admin-btn--ghost" onClick={addRow}>
          <Plus size={12} /> Add Member / Row
        </button>
      </div>
    </div>
  );
}

export default function VsacContentAdmin() {
  const { data, loading } = useDocument<VsacDoc>('settings', 'vsac');
  const [form, setForm] = useState<VsacDoc>(DEFAULT_STATE);
  const [hasInitialized, setHasInitialized] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!loading && !hasInitialized) {
      if (data) {
        setForm({
          hero: { ...DEFAULT_STATE.hero, ...data.hero },
          aboutTitle: data.aboutTitle || DEFAULT_STATE.aboutTitle,
          paragraphs: data.paragraphs && data.paragraphs.length > 0 ? data.paragraphs : DEFAULT_STATE.paragraphs,
          visionTitle: data.visionTitle || DEFAULT_STATE.visionTitle,
          vision: data.vision || DEFAULT_STATE.vision,
          missionTitle: data.missionTitle || DEFAULT_STATE.missionTitle,
          mission: data.mission && data.mission.length > 0 ? data.mission : DEFAULT_STATE.mission,
          objectivesTitle: data.objectivesTitle || DEFAULT_STATE.objectivesTitle,
          objectives: data.objectives && data.objectives.length > 0 ? data.objectives : DEFAULT_STATE.objectives,
          team: {
            inCharge: data.team?.inCharge && data.team.inCharge.length > 0 ? data.team.inCharge : DEFAULT_STATE.team?.inCharge,
            facultyMembers: data.team?.facultyMembers && data.team.facultyMembers.length > 0 ? data.team.facultyMembers : DEFAULT_STATE.team?.facultyMembers,
          },
          trainingResearch: ((data.trainingResearch && data.trainingResearch.length > 0 ? data.trainingResearch : DEFAULT_STATE.trainingResearch) || []).map(cloneTrainingItem),
          industryCollaboration: data.industryCollaboration || DEFAULT_STATE.industryCollaboration,
          socialImpacts: data.socialImpacts || DEFAULT_STATE.socialImpacts,
          learningOutcomes: data.learningOutcomes || DEFAULT_STATE.learningOutcomes,
          galleryTitle: data.galleryTitle || DEFAULT_STATE.galleryTitle,
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

      await setDoc(doc(db, 'settings', 'vsac'), {
        ...form,
        additionalSections: formattedSections,
        updatedAt: serverTimestamp(),
      }, { merge: true });
      alert('Vishnu Space Application Center (VSAC) content updated successfully!');
    } catch (e) {
      alert(`Couldn't save: ${(e as Error).message}`);
    } finally {
      setSaving(false);
    }
  };

  const resetToDefaults = () => {
    if (confirm('Reset all VSAC text to default starting values? You can still edit before saving.')) {
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
      alert(`Couldn't delete file: ${(e as Error).message}`);
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
      alert(`Couldn't delete photo: ${(e as Error).message}`);
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
      {/* Top Sticky Header Bar */}
      <div style={{ background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '10px', padding: '1.25rem', marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', borderBottom: '1px solid #e2e8f0', paddingBottom: '1rem', marginBottom: '1rem' }}>
          <div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0B1E42', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Radio size={22} color="#008080" />
              Vishnu Space Application Center (VSAC) — Page Content &amp; Structure
            </h2>
            <p style={{ fontSize: '0.85rem', color: '#64748b', margin: '0.25rem 0 0 0' }}>
              Edit satellite tracking information, CubeSat modules, vision, mission, team, and industry collaborations in exact top-to-bottom public page order.
            </p>
          </div>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button type="button" onClick={resetToDefaults} className="admin-btn admin-btn--ghost" style={{ fontSize: '0.8rem' }}>
              <RotateCcw size={14} /> Reset Defaults
            </button>
            <button type="button" onClick={save} disabled={saving} className="admin-btn admin-btn--primary" style={{ background: '#008080', borderColor: '#008080', fontSize: '0.85rem' }}>
              <Save size={14} /> {saving ? 'Saving...' : 'Save VSAC Content'}
            </button>
          </div>
        </div>

        {/* Quick Jump Bar */}
        <div>
          <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em', marginRight: '0.5rem' }}>
            Jump to Section:
          </span>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginTop: '0.4rem' }}>
            {[
              { id: 'sec-hero', label: '1. Hero Banner' },
              { id: 'sec-about', label: '2. About VSAC' },
              { id: 'sec-vision-mission', label: '3. Vision, Mission & Objectives' },
              { id: 'sec-team', label: '4. Flight Operations Team' },
              { id: 'sec-research', label: '5. Research & Training' },
              { id: 'sec-collaboration', label: '6. Collaborations' },
              { id: 'sec-social-impact', label: '7. Social Impact' },
              { id: 'sec-outcomes', label: '8. Learning Outcomes' },
              { id: 'sec-custom-sections', label: '9. Custom Extra Sections' },
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

      {/* SECTION 1: HERO BANNER & SUBTITLE */}
      <div id="sec-hero" style={{ background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '10px', padding: '1.25rem', marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem', borderBottom: '2px solid #e2e8f0', paddingBottom: '0.5rem' }}>
          <Sparkles size={18} color="#008080" />
          <h3 style={{ margin: 0, fontSize: '1.05rem', color: '#0B1E42' }}>1. Hero Banner Subtitle</h3>
        </div>
        <div>
          <label className="admin-label">Hero Subtitle</label>
          <textarea
            className="admin-textarea"
            rows={3}
            value={form.hero?.subtitle || ''}
            onChange={(e) => setForm((p) => ({ ...p, hero: { ...p.hero, subtitle: e.target.value } }))}
            placeholder="Connecting students with space technology..."
          />
        </div>
      </div>

      {/* SECTION 2: ABOUT VSAC */}
      <div id="sec-about" style={{ background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '10px', padding: '1.25rem', marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem', borderBottom: '2px solid #e2e8f0', paddingBottom: '0.5rem' }}>
          <Radio size={18} color="#008080" />
          <h3 style={{ margin: 0, fontSize: '1.05rem', color: '#0B1E42' }}>2. About VSAC</h3>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div>
            <label className="admin-label">Section Heading</label>
            <input
              type="text"
              className="admin-input"
              value={form.aboutTitle || ''}
              onChange={(e) => setForm((p) => ({ ...p, aboutTitle: e.target.value }))}
              placeholder="ABOUT VSAC"
            />
          </div>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
              <label className="admin-label" style={{ margin: 0 }}>Overview Paragraphs</label>
              <button
                type="button"
                onClick={() => setForm((prev) => ({ ...prev, paragraphs: [...(prev.paragraphs || []), ''] }))}
                className="admin-btn admin-btn--sm admin-btn--ghost"
              >
                <Plus size={13} /> Add Paragraph
              </button>
            </div>
            {(form.paragraphs || []).map((p, idx) => (
              <div key={idx} style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <textarea
                  className="admin-textarea"
                  rows={3}
                  value={p}
                  onChange={(e) => {
                    const list = [...(form.paragraphs || [])];
                    list[idx] = e.target.value;
                    setForm((prev) => ({ ...prev, paragraphs: list }));
                  }}
                />
                <button
                  type="button"
                  onClick={() => {
                    const list = (form.paragraphs || []).filter((_, i) => i !== idx);
                    setForm((prev) => ({ ...prev, paragraphs: list }));
                  }}
                  className="admin-btn-danger"
                  style={{ alignSelf: 'flex-start' }}
                  title="Remove paragraph"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* SECTION 3: VISION, MISSION & OBJECTIVES */}
      <div id="sec-vision-mission" style={{ background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '10px', padding: '1.25rem', marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem', borderBottom: '2px solid #e2e8f0', paddingBottom: '0.5rem' }}>
          <Target size={18} color="#008080" />
          <h3 style={{ margin: 0, fontSize: '1.05rem', color: '#0B1E42' }}>3. Mission Control Directives (Vision, Mission &amp; Objectives)</h3>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {/* Vision */}
          <div style={{ background: '#F8FAFC', padding: '1rem', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
            <label className="admin-label" style={{ fontWeight: 700 }}>Vision Heading</label>
            <input
              type="text"
              className="admin-input"
              value={form.visionTitle || ''}
              onChange={(e) => setForm((p) => ({ ...p, visionTitle: e.target.value }))}
              placeholder="Our Vision"
              style={{ marginBottom: '0.75rem' }}
            />
            <label className="admin-label" style={{ fontWeight: 700 }}>Vision Statement</label>
            <textarea
              className="admin-textarea"
              rows={3}
              value={form.vision || ''}
              onChange={(e) => setForm((p) => ({ ...p, vision: e.target.value }))}
            />
          </div>

          {/* Mission */}
          <div style={{ background: '#F8FAFC', padding: '1rem', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
              <label className="admin-label" style={{ margin: 0, fontWeight: 700 }}>Mission Points</label>
              <button
                type="button"
                onClick={() => setForm((p) => ({ ...p, mission: [...(p.mission || []), ''] }))}
                className="admin-btn admin-btn--sm admin-btn--ghost"
              >
                <Plus size={13} /> Add Mission Point
              </button>
            </div>
            {(form.mission || []).map((m, idx) => (
              <div key={idx} style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.4rem', alignItems: 'center' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#64748b', width: '1.5rem', textAlign: 'right' }}>
                  {idx + 1}.
                </span>
                <input
                  type="text"
                  className="admin-input"
                  value={m}
                  onChange={(e) => {
                    const list = [...(form.mission || [])];
                    list[idx] = e.target.value;
                    setForm((p) => ({ ...p, mission: list }));
                  }}
                  style={{ flex: 1 }}
                />
                <button
                  type="button"
                  onClick={() => {
                    const list = (form.mission || []).filter((_, i) => i !== idx);
                    setForm((p) => ({ ...p, mission: list }));
                  }}
                  className="admin-btn-danger"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>

          {/* Objectives */}
          <div style={{ background: '#F8FAFC', padding: '1rem', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
              <label className="admin-label" style={{ margin: 0, fontWeight: 700 }}>Core Objectives</label>
              <button
                type="button"
                onClick={() => setForm((p) => ({ ...p, objectives: [...(p.objectives || []), ''] }))}
                className="admin-btn admin-btn--sm admin-btn--ghost"
              >
                <Plus size={13} /> Add Objective
              </button>
            </div>
            {(form.objectives || []).map((obj, idx) => (
              <div key={idx} style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.4rem', alignItems: 'center' }}>
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
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* SECTION 4: FLIGHT OPERATIONS TEAM */}
      <div id="sec-team" style={{ background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '10px', padding: '1.25rem', marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem', borderBottom: '2px solid #e2e8f0', paddingBottom: '0.5rem' }}>
          <Users size={18} color="#008080" />
          <h3 style={{ margin: 0, fontSize: '1.05rem', color: '#0B1E42' }}>4. Flight Operations Team &amp; HAM Radio Operators</h3>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Faculty In-Charge */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
              <label className="admin-label" style={{ margin: 0, fontWeight: 800, color: '#0B1E42' }}>Faculty In-Charge</label>
              <button
                type="button"
                onClick={() => {
                  const current = form.team?.inCharge || [];
                  setForm((p) => ({
                    ...p,
                    team: { ...p.team, inCharge: [...current, { name: '', designation: '', email: '', mobile: '', callSign: '', interests: '' }] },
                  }));
                }}
                className="admin-btn admin-btn--sm admin-btn--ghost"
              >
                <Plus size={13} /> Add Faculty In-Charge
              </button>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
              {(form.team?.inCharge || []).map((m, idx) => (
                <div key={idx} style={{ background: '#F8FAFC', padding: '1rem', borderRadius: '8px', border: '1px solid #E2E8F0', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#008080' }}>In-Charge #{idx + 1}</span>
                    <button
                      type="button"
                      onClick={() => {
                        const list = (form.team?.inCharge || []).filter((_, i) => i !== idx);
                        setForm((p) => ({ ...p, team: { ...p.team, inCharge: list } }));
                      }}
                      className="admin-btn-danger"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                  <input
                    type="text"
                    className="admin-input"
                    value={m.name}
                    onChange={(e) => {
                      const list = [...(form.team?.inCharge || [])];
                      list[idx] = { ...list[idx], name: e.target.value };
                      setForm((p) => ({ ...p, team: { ...p.team, inCharge: list } }));
                    }}
                    placeholder="Full Name"
                    style={{ fontWeight: 700 }}
                  />
                  <input
                    type="text"
                    className="admin-input"
                    value={m.designation || ''}
                    onChange={(e) => {
                      const list = [...(form.team?.inCharge || [])];
                      list[idx] = { ...list[idx], designation: e.target.value };
                      setForm((p) => ({ ...p, team: { ...p.team, inCharge: list } }));
                    }}
                    placeholder="Designation"
                  />
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.4rem' }}>
                    <input
                      type="text"
                      className="admin-input"
                      value={m.callSign || ''}
                      onChange={(e) => {
                        const list = [...(form.team?.inCharge || [])];
                        list[idx] = { ...list[idx], callSign: e.target.value };
                        setForm((p) => ({ ...p, team: { ...p.team, inCharge: list } }));
                      }}
                      placeholder="HAM Call Sign (e.g. VU2TEU)"
                    />
                    <input
                      type="text"
                      className="admin-input"
                      value={m.mobile || ''}
                      onChange={(e) => {
                        const list = [...(form.team?.inCharge || [])];
                        list[idx] = { ...list[idx], mobile: e.target.value };
                        setForm((p) => ({ ...p, team: { ...p.team, inCharge: list } }));
                      }}
                      placeholder="Mobile"
                    />
                  </div>
                  <input
                    type="text"
                    className="admin-input"
                    value={m.email || ''}
                    onChange={(e) => {
                      const list = [...(form.team?.inCharge || [])];
                      list[idx] = { ...list[idx], email: e.target.value };
                      setForm((p) => ({ ...p, team: { ...p.team, inCharge: list } }));
                    }}
                    placeholder="Email"
                  />
                  <input
                    type="text"
                    className="admin-input"
                    value={m.interests || ''}
                    onChange={(e) => {
                      const list = [...(form.team?.inCharge || [])];
                      list[idx] = { ...list[idx], interests: e.target.value };
                      setForm((p) => ({ ...p, team: { ...p.team, inCharge: list } }));
                    }}
                    placeholder="Interests"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Faculty Team Members */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
              <label className="admin-label" style={{ margin: 0, fontWeight: 800, color: '#0B1E42' }}>Faculty Team Members</label>
              <button
                type="button"
                onClick={() => {
                  const current = form.team?.facultyMembers || [];
                  setForm((p) => ({
                    ...p,
                    team: { ...p.team, facultyMembers: [...current, { name: '', designation: '', email: '', mobile: '', callSign: '', interests: '' }] },
                  }));
                }}
                className="admin-btn admin-btn--sm admin-btn--ghost"
              >
                <Plus size={13} /> Add Faculty Team Member
              </button>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
              {(form.team?.facultyMembers || []).map((m, idx) => (
                <div key={idx} style={{ background: '#F8FAFC', padding: '1rem', borderRadius: '8px', border: '1px solid #E2E8F0', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#475569' }}>Member #{idx + 1}</span>
                    <button
                      type="button"
                      onClick={() => {
                        const list = (form.team?.facultyMembers || []).filter((_, i) => i !== idx);
                        setForm((p) => ({ ...p, team: { ...p.team, facultyMembers: list } }));
                      }}
                      className="admin-btn-danger"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                  <input
                    type="text"
                    className="admin-input"
                    value={m.name}
                    onChange={(e) => {
                      const list = [...(form.team?.facultyMembers || [])];
                      list[idx] = { ...list[idx], name: e.target.value };
                      setForm((p) => ({ ...p, team: { ...p.team, facultyMembers: list } }));
                    }}
                    placeholder="Full Name"
                    style={{ fontWeight: 700 }}
                  />
                  <input
                    type="text"
                    className="admin-input"
                    value={m.designation || ''}
                    onChange={(e) => {
                      const list = [...(form.team?.facultyMembers || [])];
                      list[idx] = { ...list[idx], designation: e.target.value };
                      setForm((p) => ({ ...p, team: { ...p.team, facultyMembers: list } }));
                    }}
                    placeholder="Designation"
                  />
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.4rem' }}>
                    <input
                      type="text"
                      className="admin-input"
                      value={m.callSign || ''}
                      onChange={(e) => {
                        const list = [...(form.team?.facultyMembers || [])];
                        list[idx] = { ...list[idx], callSign: e.target.value };
                        setForm((p) => ({ ...p, team: { ...p.team, facultyMembers: list } }));
                      }}
                      placeholder="HAM Call Sign"
                    />
                    <input
                      type="text"
                      className="admin-input"
                      value={m.mobile || ''}
                      onChange={(e) => {
                        const list = [...(form.team?.facultyMembers || [])];
                        list[idx] = { ...list[idx], mobile: e.target.value };
                        setForm((p) => ({ ...p, team: { ...p.team, facultyMembers: list } }));
                      }}
                      placeholder="Mobile"
                    />
                  </div>
                  <input
                    type="text"
                    className="admin-input"
                    value={m.email || ''}
                    onChange={(e) => {
                      const list = [...(form.team?.facultyMembers || [])];
                      list[idx] = { ...list[idx], email: e.target.value };
                      setForm((p) => ({ ...p, team: { ...p.team, facultyMembers: list } }));
                    }}
                    placeholder="Email"
                  />
                  <input
                    type="text"
                    className="admin-input"
                    value={m.interests || ''}
                    onChange={(e) => {
                      const list = [...(form.team?.facultyMembers || [])];
                      list[idx] = { ...list[idx], interests: e.target.value };
                      setForm((p) => ({ ...p, team: { ...p.team, facultyMembers: list } }));
                    }}
                    placeholder="Interests"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 5: SPACE RESEARCH & TRAINING OPERATIONS */}
      <div id="sec-research" style={{ background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '10px', padding: '1.25rem', marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem', marginBottom: '0.75rem', borderBottom: '2px solid #e2e8f0', paddingBottom: '0.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <BookOpen size={18} color="#008080" />
            <h3 style={{ margin: 0, fontSize: '1.05rem', color: '#0B1E42' }}>5. Space Research &amp; Training Operations</h3>
          </div>
          <button
            type="button"
            onClick={() => {
              const current = form.trainingResearch || [];
              setForm((p) => ({
                ...p,
                trainingResearch: [...current, { title: 'New Training Program', paragraphs: ['Description...'] }],
              }));
            }}
            className="admin-btn admin-btn--sm admin-btn--ghost"
          >
            <Plus size={13} /> Add Program
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {(form.trainingResearch || []).map((item, idx) => (
            <div key={idx} style={{ background: '#F8FAFC', padding: '1rem', borderRadius: '8px', border: '1px solid #E2E8F0', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <label className="admin-label" style={{ fontWeight: 800, margin: 0, color: '#0B1E42' }}>Program #{idx + 1} Title</label>
                <button
                  type="button"
                  onClick={() => {
                    const list = (form.trainingResearch || []).filter((_, i) => i !== idx);
                    setForm((p) => ({ ...p, trainingResearch: list }));
                  }}
                  className="admin-btn-danger"
                >
                  <Trash2 size={13} /> Remove Program
                </button>
              </div>
              <input
                type="text"
                className="admin-input"
                value={item.title}
                onChange={(e) => {
                  const list = [...(form.trainingResearch || [])];
                  list[idx] = { ...list[idx], title: e.target.value };
                  setForm((p) => ({ ...p, trainingResearch: list }));
                }}
                style={{ fontWeight: 700 }}
              />
              <label className="admin-label" style={{ fontWeight: 700, marginTop: '0.3rem' }}>Paragraphs (one per line)</label>
              <textarea
                className="admin-textarea"
                rows={3}
                value={(item.paragraphs || []).join('\n')}
                onChange={(e) => {
                  const list = [...(form.trainingResearch || [])];
                  list[idx] = { ...list[idx], paragraphs: e.target.value.split('\n') };
                  setForm((p) => ({ ...p, trainingResearch: list }));
                }}
              />

              {/* Program Gallery Images */}
              <div style={{ marginTop: '0.3rem' }}>
                <label className="admin-label" style={{ fontWeight: 700 }}>Program Gallery Images (one URL per line)</label>
                <textarea
                  className="admin-textarea"
                  rows={2}
                  value={(item.images || []).join('\n')}
                  placeholder="e.g. /images/hackathon1.jpg..."
                  onChange={(e) => {
                    const list = [...(form.trainingResearch || [])];
                    list[idx] = { ...list[idx], images: e.target.value.split('\n').filter(Boolean) };
                    setForm((p) => ({ ...p, trainingResearch: list }));
                  }}
                />
              </div>

              {/* Table Heading */}
              <div style={{ marginTop: '0.3rem' }}>
                <label className="admin-label" style={{ fontWeight: 700 }}>Table Heading (Optional — e.g. Students Benefited)</label>
                <input
                  type="text"
                  className="admin-input"
                  value={item.tableTitle || ''}
                  placeholder="e.g. Students Benefited"
                  onChange={(e) => {
                    const list = [...(form.trainingResearch || [])];
                    list[idx] = { ...list[idx], tableTitle: e.target.value };
                    setForm((p) => ({ ...p, trainingResearch: list }));
                  }}
                />
              </div>

              {/* Primary Table (Members / Beneficiaries) */}
              <TableEditor
                label="Primary Table (Members / Beneficiaries)"
                table={item.table}
                onChange={(newTable) => {
                  const list = [...(form.trainingResearch || [])];
                  list[idx] = { ...list[idx], table: newTable };
                  setForm((p) => ({ ...p, trainingResearch: list }));
                }}
                onRemove={
                  item.table
                    ? () => {
                        const list = [...(form.trainingResearch || [])];
                        list[idx] = { ...list[idx], table: undefined };
                        setForm((p) => ({ ...p, trainingResearch: list }));
                      }
                    : undefined
                }
              />

              {/* Optional Second Paragraph */}
              <div style={{ marginTop: '0.4rem' }}>
                <label className="admin-label" style={{ fontWeight: 700 }}>Additional Paragraph (Optional — e.g. for Batch 2 / second section)</label>
                <textarea
                  className="admin-textarea"
                  rows={2}
                  value={item.secondParagraph || ''}
                  placeholder="Optional second paragraph..."
                  onChange={(e) => {
                    const list = [...(form.trainingResearch || [])];
                    list[idx] = { ...list[idx], secondParagraph: e.target.value };
                    setForm((p) => ({ ...p, trainingResearch: list }));
                  }}
                />
              </div>

              {/* Optional Second Table */}
              <TableEditor
                label="Second Table (Optional — e.g. Batch 2 Students)"
                table={item.secondTable}
                onChange={(newTable) => {
                  const list = [...(form.trainingResearch || [])];
                  list[idx] = { ...list[idx], secondTable: newTable };
                  setForm((p) => ({ ...p, trainingResearch: list }));
                }}
                onRemove={
                  item.secondTable
                    ? () => {
                        const list = [...(form.trainingResearch || [])];
                        list[idx] = { ...list[idx], secondTable: undefined };
                        setForm((p) => ({ ...p, trainingResearch: list }));
                      }
                    : undefined
                }
              />
            </div>
          ))}
        </div>
      </div>

      {/* SECTION 6: DHRUVA SPACE COLLABORATION */}
      <div id="sec-collaboration" style={{ background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '10px', padding: '1.25rem', marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem', borderBottom: '2px solid #e2e8f0', paddingBottom: '0.5rem' }}>
          <Building2 size={18} color="#008080" />
          <h3 style={{ margin: 0, fontSize: '1.05rem', color: '#0B1E42' }}>6. Dhruva Space Collaboration</h3>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label className="admin-label">Section Title</label>
            <input
              type="text"
              className="admin-input"
              value={form.industryCollaboration?.title || ''}
              onChange={(e) => {
                setForm((p) => ({
                  ...p,
                  industryCollaboration: {
                    title: e.target.value,
                    paragraphs: p.industryCollaboration?.paragraphs || [],
                  },
                }));
              }}
              placeholder="Industry Collaboration with Dhruva Space"
            />
          </div>
          <div>
            <label className="admin-label">Collaboration Paragraphs (one per line)</label>
            <textarea
              className="admin-textarea"
              rows={4}
              value={(form.industryCollaboration?.paragraphs || []).join('\n')}
              onChange={(e) => {
                setForm((p) => ({
                  ...p,
                  industryCollaboration: {
                    title: p.industryCollaboration?.title || '',
                    paragraphs: e.target.value.split('\n'),
                  },
                }));
              }}
            />
          </div>
        </div>
      </div>

      {/* SECTION 7: EXTENDING THE IMPACT OF SPACE EDUCATION (SOCIAL IMPACT) */}
      <div id="sec-social-impact" style={{ background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '10px', padding: '1.25rem', marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem', marginBottom: '0.75rem', borderBottom: '2px solid #e2e8f0', paddingBottom: '0.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Globe2 size={18} color="#008080" />
            <h3 style={{ margin: 0, fontSize: '1.05rem', color: '#0B1E42' }}>7. Extending the Impact of Space Education</h3>
          </div>
          <button
            type="button"
            onClick={() => {
              const current = form.socialImpacts?.bullets || [];
              setForm((p) => ({
                ...p,
                socialImpacts: {
                  title: p.socialImpacts?.title || 'Extending the Impact of Space Education',
                  bullets: [...current, { lead: 'New Lead', text: 'Impact description...' }],
                },
              }));
            }}
            className="admin-btn admin-btn--sm admin-btn--ghost"
          >
            <Plus size={13} /> Add Impact Card
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label className="admin-label">Section Title</label>
            <input
              type="text"
              className="admin-input"
              value={form.socialImpacts?.title || ''}
              onChange={(e) => setForm((p) => ({ ...p, socialImpacts: { ...p.socialImpacts, title: e.target.value } }))}
              placeholder="Extending the Impact of Space Education"
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
            {(form.socialImpacts?.bullets || []).map((b, idx) => (
              <div key={idx} style={{ background: '#F8FAFC', padding: '1rem', borderRadius: '8px', border: '1px solid #E2E8F0', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#008080' }}>Card #{idx + 1}</span>
                  <button
                    type="button"
                    onClick={() => {
                      const list = (form.socialImpacts?.bullets || []).filter((_, i) => i !== idx);
                      setForm((p) => ({ ...p, socialImpacts: { ...p.socialImpacts, bullets: list } }));
                    }}
                    className="admin-btn-danger"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
                <label className="admin-label">Lead Title</label>
                <input
                  type="text"
                  className="admin-input"
                  value={b.lead}
                  onChange={(e) => {
                    const list = [...(form.socialImpacts?.bullets || [])];
                    list[idx] = { ...list[idx], lead: e.target.value };
                    setForm((p) => ({ ...p, socialImpacts: { ...p.socialImpacts, bullets: list } }));
                  }}
                  style={{ fontWeight: 700 }}
                />
                <label className="admin-label">Description</label>
                <textarea
                  className="admin-textarea"
                  rows={2}
                  value={b.text}
                  onChange={(e) => {
                    const list = [...(form.socialImpacts?.bullets || [])];
                    list[idx] = { ...list[idx], text: e.target.value };
                    setForm((p) => ({ ...p, socialImpacts: { ...p.socialImpacts, bullets: list } }));
                  }}
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* SECTION 8: LEARNING OUTCOMES */}
      <div id="sec-outcomes" style={{ background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '10px', padding: '1.25rem', marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem', marginBottom: '0.75rem', borderBottom: '2px solid #e2e8f0', paddingBottom: '0.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Award size={18} color="#008080" />
            <h3 style={{ margin: 0, fontSize: '1.05rem', color: '#0B1E42' }}>8. Learning Outcomes</h3>
          </div>
          <button
            type="button"
            onClick={() => {
              const current = form.learningOutcomes?.bullets || [];
              setForm((p) => ({
                ...p,
                learningOutcomes: {
                  title: p.learningOutcomes?.title || 'Learning Outcomes',
                  bullets: [...current, { lead: 'New Outcome Lead', text: 'Outcome description...' }],
                },
              }));
            }}
            className="admin-btn admin-btn--sm admin-btn--ghost"
          >
            <Plus size={13} /> Add Outcome Card
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label className="admin-label">Section Title</label>
            <input
              type="text"
              className="admin-input"
              value={form.learningOutcomes?.title || ''}
              onChange={(e) => setForm((p) => ({ ...p, learningOutcomes: { ...p.learningOutcomes, title: e.target.value } }))}
              placeholder="Learning Outcomes"
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
            {(form.learningOutcomes?.bullets || []).map((b, idx) => (
              <div key={idx} style={{ background: '#F8FAFC', padding: '1rem', borderRadius: '8px', border: '1px solid #E2E8F0', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#008080' }}>Card #{idx + 1}</span>
                  <button
                    type="button"
                    onClick={() => {
                      const list = (form.learningOutcomes?.bullets || []).filter((_, i) => i !== idx);
                      setForm((p) => ({ ...p, learningOutcomes: { ...p.learningOutcomes, bullets: list } }));
                    }}
                    className="admin-btn-danger"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
                <label className="admin-label">Lead Title</label>
                <input
                  type="text"
                  className="admin-input"
                  value={b.lead}
                  onChange={(e) => {
                    const list = [...(form.learningOutcomes?.bullets || [])];
                    list[idx] = { ...list[idx], lead: e.target.value };
                    setForm((p) => ({ ...p, learningOutcomes: { ...p.learningOutcomes, bullets: list } }));
                  }}
                  style={{ fontWeight: 700 }}
                />
                <label className="admin-label">Description</label>
                <textarea
                  className="admin-textarea"
                  rows={2}
                  value={b.text}
                  onChange={(e) => {
                    const list = [...(form.learningOutcomes?.bullets || [])];
                    list[idx] = { ...list[idx], text: e.target.value };
                    setForm((p) => ({ ...p, learningOutcomes: { ...p.learningOutcomes, bullets: list } }));
                  }}
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* SECTION 9: ADDITIONAL CUSTOM SECTIONS */}
      <div id="sec-custom-sections" style={{ background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '10px', padding: '1.25rem', marginBottom: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem', marginBottom: '0.75rem', borderBottom: '2px solid #e2e8f0', paddingBottom: '0.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Sparkles size={18} color="#008080" />
            <h3 style={{ margin: 0, fontSize: '1.05rem', color: '#0B1E42' }}>
              9. Additional Custom Sections ({form.additionalSections?.length || 0})
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
          <Save size={16} style={{ marginRight: '0.35rem' }} /> {saving ? 'Saving...' : 'Save All VSAC Changes'}
        </button>
      </div>
    </div>
  );
}
