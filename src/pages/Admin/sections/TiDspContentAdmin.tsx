import { useEffect, useState } from 'react';
import {
  Cpu,
  Compass,
  Target,
  Building2,
  FileText,
  BookOpen,
  Zap,
  Layers,
  Users,
  Image as ImageIcon,
  Plus,
  Trash2,
  RotateCcw,
  Save,
  Award,
  Sparkles,
  Globe,
  Handshake,
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
  tiDspCoe,
  type ContentBlock,
  type YearTab,
  type TiDspFacultyMember,
} from '../../Differentiators/tiDspCoe.data';

export interface TiDspGalleryPhoto {
  id?: string;
  imageUrl?: string;
  url?: string;
  storagePath?: string;
  caption?: string;
}

export interface CustomTiDspSection {
  id: string;
  title: string;
  badge?: string;
  paragraphs?: string[];
  bulletPoints?: string[];
}

export interface TiDspDoc {
  hero?: {
    title?: string;
    subtitle?: string;
  };
  aboutTitle?: string;
  overview?: string[];
  stats?: {
    dskValue?: string;
    dskLabel?: string;
    aicteValue?: string;
    aicteLabel?: string;
    dstValue?: string;
    dstLabel?: string;
    matlabValue?: string;
    matlabLabel?: string;
  };
  vision?: string;
  mission?: string[];
  objectives?: string[];
  labDevelopment?: string[];
  societalImpact?: string[];
  researchOutputs?: {
    title?: string;
    intro?: string;
    areas?: string[];
    publications?: string[];
  };
  trainingActivities?: {
    title?: string;
    activities?: { title: string }[];
  };
  keyHighlights?: string[];
  facilitiesEquipment?: string[];
  industryAssociation?: {
    title?: string;
    partner?: string;
    description?: string;
  };
  trainingResearch?: {
    title?: string;
    paragraphs?: string[];
    archiveTitle?: string;
    workshopTitle?: string;
    years?: YearTab[];
  };
  team?: {
    inCharge?: TiDspFacultyMember;
    facultyMembers?: TiDspFacultyMember[];
  };
  collaborations?: {
    title?: string;
    paragraphs?: string[];
  };
  partners?: {
    title?: string;
    paragraphs?: string[];
    items?: string[];
  };
  customSections?: CustomSection[];
  additionalSections?: CustomTiDspSection[];
  gallery?: {
    title?: string;
    subtitle?: string;
    photos?: TiDspGalleryPhoto[];
  };
}

interface DifferentiatorItemRecord extends WithId {
  slug: string;
  title: string;
  customSections?: CustomSection[];
  tabs?: { sections?: CustomSection[] }[];
}

const EMPTY_IN_CHARGE: TiDspFacultyMember = {
  name: '',
  designation: '',
  email: '',
  mobile: '',
  interests: '',
};

const DEFAULT_STATE: TiDspDoc = {
  hero: {
    title: 'TI-DSP Centre of Excellence',
    subtitle: 'Advancing digital signal processing, speech and image processing, and application-oriented research through specialised DSP platforms, MATLAB-enabled learning and hands-on technical training.',
  },
  aboutTitle: tiDspCoe.aboutTitle,
  overview: [...tiDspCoe.overview],
  stats: {
    dskValue: 'TMS320C6713 DSKs',
    dskLabel: 'DSP Development Platforms',
    aicteValue: '₹10 Lakh',
    aicteLabel: 'AICTE-MODROBS Lab Modernisation Funding',
    dstValue: '₹53 Lakh',
    dstLabel: 'DST-Funded Telephony Speech Enhancement Research',
    matlabValue: 'MATLAB',
    matlabLabel: 'Campus-Wide Academic Access',
  },
  vision: tiDspCoe.vision,
  mission: [...tiDspCoe.mission],
  objectives: [...tiDspCoe.objectives],
  labDevelopment: [...tiDspCoe.labDevelopment],
  societalImpact: [...tiDspCoe.societalImpact],
  researchOutputs: {
    title: tiDspCoe.researchOutputs.title,
    intro: tiDspCoe.researchOutputs.intro,
    areas: [...tiDspCoe.researchOutputs.areas],
    publications: [...tiDspCoe.researchOutputs.publications],
  },
  trainingActivities: {
    title: tiDspCoe.trainingActivities.title,
    activities: tiDspCoe.trainingActivities.activities.map((a) => ({ ...a })),
  },
  keyHighlights: [...tiDspCoe.keyHighlights],
  facilitiesEquipment: [...tiDspCoe.facilitiesEquipment],
  industryAssociation: { ...tiDspCoe.industryAssociation },
  trainingResearch: {
    title: tiDspCoe.trainingResearch.title,
    paragraphs: [...tiDspCoe.trainingResearch.paragraphs],
    archiveTitle: tiDspCoe.trainingResearch.archiveTitle,
    workshopTitle: tiDspCoe.trainingResearch.workshopTitle,
    years: tiDspCoe.trainingResearch.years.map((y) => ({
      label: y.label,
      blocks: y.blocks.map((b) => {
        if (b.type === 'paragraph' || b.type === 'heading') return { ...b };
        if (b.type === 'bullets' || b.type === 'numbered') return { type: b.type, items: [...b.items] };
        if (b.type === 'table') return { type: 'table', headers: [...b.headers], rows: b.rows.map((r) => ({ cells: [...r.cells] })) };
        return { ...b };
      }),
    })),
  },
  team: {
    inCharge: { ...tiDspCoe.team.inCharge },
    facultyMembers: tiDspCoe.team.facultyMembers.map((m) => ({ ...m })),
  },
  collaborations: {
    title: 'Collaborations [National / International]',
    paragraphs: [
      'The TI- DSP lab initially consisted of Five TMS320C6713 DSK kits along with accessories and then it received six Analog Starter Kits from Texas Instruments, India as donation. The Lab had thirty six Personal Computers a Cathode Ray Oscilloscope and Function generator other than the boards. Later, the Lab received a funding of Rs10 Lakhs in MODROBS from AICTE, New Delhi for modernizing the laboratory. Then, the following boards are purchased from Texas Instruments, India to enhance the lab facilities along with improving the research and development status of the lab.',
    ],
  },
  partners: {
    title: 'Partners',
    paragraphs: [
      'Texas Instruments, India — Technical resource and development platform partner.',
      'AICTE, New Delhi — Modernisation funding partner under MODROBS.',
      'Department of Science and Technology (DST), Government of India — Research funding partner for speech enhancement technology.',
    ],
    items: [
      'Texas Instruments, India',
      'AICTE, New Delhi',
      'Department of Science and Technology (DST), Govt. of India',
    ],
  },
  customSections: [],
  additionalSections: [],
  gallery: {
    title: 'Student Project Development Session',
    subtitle: 'Glimpses of practical learning, experimentation and project development at the TI-DSP Centre.',
    photos: [],
  },
};

type ActiveSubSection =
  | 'overview'
  | 'vision-mission'
  | 'objectives'
  | 'lab-development'
  | 'societal-impact'
  | 'research-outputs'
  | 'training-activities'
  | 'key-highlights'
  | 'facilities-equipment'
  | 'industry-association'
  | 'student-projects'
  | 'team'
  | 'collaborations'
  | 'partners'
  | 'gallery'
  | 'custom-sections';

export default function TiDspContentAdmin() {
  const { data, loading } = useDocument<TiDspDoc>('settings', 'tiDspCoe');
  const { docs: diffItems } = useCollection<DifferentiatorItemRecord>('differentiatorItems');
  const tiItem = diffItems.find((d: DifferentiatorItemRecord) => d.slug === 'ti-dsp-coe');

  const [form, setForm] = useState<TiDspDoc>(DEFAULT_STATE);
  const [hasInitialized, setHasInitialized] = useState(false);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<ActiveSubSection>('overview');
  const [selectedYearIdx, setSelectedYearIdx] = useState<number>(0);

  useEffect(() => {
    if (!loading && !hasInitialized) {
      if (data) {
        const allCustom = [...(data.customSections || []), ...(tiItem?.customSections || [])];
        const legacyCollabSec = allCustom.find(s => {
          const lbl = (s.label || '').toLowerCase();
          const id = (s.id || '').toLowerCase();
          return lbl.includes('collab') || id.includes('collab') || lbl.includes('national') || lbl.includes('international');
        });

        const legacyPartnerSec = allCustom.find(s => {
          const lbl = (s.label || '').toLowerCase();
          const id = (s.id || '').toLowerCase();
          return lbl.includes('partner') || id.includes('partner');
        });

        const extractSectionText = (sec?: CustomSection): string[] => {
          if (!sec) return [];
          if (sec.textContent?.trim()) return sec.textContent.split(/\n\n+/).map(s => s.trim()).filter(Boolean);
          if (sec.listText?.trim()) return sec.listText.split('\n').map(s => s.trim()).filter(Boolean);
          return [];
        };

        const resolvedCollabParas = (data.collaborations?.paragraphs && data.collaborations.paragraphs.filter(p => p && p.trim()).length > 0)
          ? data.collaborations.paragraphs.filter(p => p && p.trim())
          : legacyCollabSec ? extractSectionText(legacyCollabSec) : [];

        const resolvedPartnerParas = (data.partners?.paragraphs && data.partners.paragraphs.filter(p => p && p.trim()).length > 0)
          ? data.partners.paragraphs.filter(p => p && p.trim())
          : legacyPartnerSec ? extractSectionText(legacyPartnerSec) : [];

        setForm({
          hero: { ...DEFAULT_STATE.hero, ...data.hero },
          aboutTitle: data.aboutTitle || DEFAULT_STATE.aboutTitle,
          overview: data.overview && data.overview.length > 0 ? data.overview : DEFAULT_STATE.overview,
          stats: { ...DEFAULT_STATE.stats, ...data.stats },
          vision: data.vision || DEFAULT_STATE.vision,
          mission: data.mission && data.mission.length > 0 ? data.mission : DEFAULT_STATE.mission,
          objectives: data.objectives && data.objectives.length > 0 ? data.objectives : DEFAULT_STATE.objectives,
          labDevelopment: data.labDevelopment && data.labDevelopment.length > 0 ? data.labDevelopment : DEFAULT_STATE.labDevelopment,
          societalImpact: data.societalImpact && data.societalImpact.length > 0 ? data.societalImpact : DEFAULT_STATE.societalImpact,
          researchOutputs: {
            title: data.researchOutputs?.title || DEFAULT_STATE.researchOutputs?.title,
            intro: data.researchOutputs?.intro || DEFAULT_STATE.researchOutputs?.intro,
            areas: data.researchOutputs?.areas && data.researchOutputs.areas.length > 0 ? data.researchOutputs.areas : DEFAULT_STATE.researchOutputs?.areas,
            publications: data.researchOutputs?.publications && data.researchOutputs.publications.length > 0 ? data.researchOutputs.publications : DEFAULT_STATE.researchOutputs?.publications,
          },
          trainingActivities: {
            title: data.trainingActivities?.title || DEFAULT_STATE.trainingActivities?.title,
            activities: data.trainingActivities?.activities && data.trainingActivities.activities.length > 0 ? data.trainingActivities.activities : DEFAULT_STATE.trainingActivities?.activities,
          },
          keyHighlights: data.keyHighlights && data.keyHighlights.length > 0 ? data.keyHighlights : DEFAULT_STATE.keyHighlights,
          facilitiesEquipment: data.facilitiesEquipment && data.facilitiesEquipment.length > 0 ? data.facilitiesEquipment : DEFAULT_STATE.facilitiesEquipment,
          industryAssociation: { ...DEFAULT_STATE.industryAssociation, ...data.industryAssociation },
          trainingResearch: {
            title: data.trainingResearch?.title || DEFAULT_STATE.trainingResearch?.title,
            paragraphs: data.trainingResearch?.paragraphs && data.trainingResearch.paragraphs.length > 0 ? data.trainingResearch.paragraphs : DEFAULT_STATE.trainingResearch?.paragraphs,
            archiveTitle: data.trainingResearch?.archiveTitle || DEFAULT_STATE.trainingResearch?.archiveTitle,
            workshopTitle: data.trainingResearch?.workshopTitle || DEFAULT_STATE.trainingResearch?.workshopTitle,
            years: data.trainingResearch?.years && data.trainingResearch.years.length > 0 ? data.trainingResearch.years : DEFAULT_STATE.trainingResearch?.years,
          },
          team: {
            inCharge: { ...EMPTY_IN_CHARGE, ...DEFAULT_STATE.team?.inCharge, ...data.team?.inCharge },
            facultyMembers: data.team?.facultyMembers && data.team.facultyMembers.length > 0 ? data.team.facultyMembers : DEFAULT_STATE.team?.facultyMembers,
          },
          collaborations: {
            title: (data.collaborations?.title && data.collaborations.title.trim())
              || legacyCollabSec?.label?.trim()
              || DEFAULT_STATE.collaborations?.title
              || 'Collaborations [National / International]',
            paragraphs: resolvedCollabParas.length > 0
              ? resolvedCollabParas
              : (DEFAULT_STATE.collaborations?.paragraphs || []),
          },
          partners: {
            title: (data.partners?.title && data.partners.title.trim())
              || legacyPartnerSec?.label?.trim()
              || DEFAULT_STATE.partners?.title
              || 'Partners',
            paragraphs: resolvedPartnerParas.length > 0
              ? resolvedPartnerParas
              : (DEFAULT_STATE.partners?.paragraphs || []),
            items: data.partners?.items && data.partners.items.length > 0 ? data.partners.items : DEFAULT_STATE.partners?.items,
          },
          customSections: (data.customSections || []).filter((s) => {
            const lower = (s.label || '').toLowerCase();
            const lowerId = (s.id || '').toLowerCase();
            return (
              !lower.includes('team') &&
              !lowerId.includes('team') &&
              !lower.includes('training') &&
              !lower.includes('academic project') &&
              !lower.includes('student project') &&
              !lower.includes('research') &&
              !lower.includes('collab') &&
              !lower.includes('national') &&
              !lower.includes('international') &&
              !lower.includes('lab development') &&
              !lower.includes('modernisation') &&
              !lower.includes('facility') &&
              !lower.includes('equipment') &&
              !lower.includes('highlight') &&
              !lower.includes('partner') &&
              !lowerId.includes('training-research') &&
              !lowerId.includes('academic-project') &&
              !lowerId.includes('training_research') &&
              !lowerId.includes('student-project') &&
              !lowerId.includes('collab') &&
              !lowerId.includes('partner')
            );
          }),
          additionalSections: data.additionalSections || [],
          gallery: {
            title: data.gallery?.title || DEFAULT_STATE.gallery?.title,
            subtitle: data.gallery?.subtitle || DEFAULT_STATE.gallery?.subtitle,
            photos: data.gallery?.photos || [],
          },
        });
      }
      setHasInitialized(true);
    }
  }, [data, loading, hasInitialized, tiItem]);

  const save = async () => {
    setSaving(true);
    try {
      await setDoc(doc(db, 'settings', 'tiDspCoe'), {
        ...form,
        updatedAt: serverTimestamp(),
      }, { merge: true });

      if (tiItem?.id) {
        await updateDoc(doc(db, 'differentiatorItems', tiItem.id), {
          customSections: form.customSections || [],
          updatedAt: serverTimestamp(),
        });
      }

      alert('TI-DSP Centre of Excellence updated successfully! All changes are live on the website.');
    } catch (e) {
      alert(`Couldn't save: ${(e as Error).message}`);
    } finally {
      setSaving(false);
    }
  };

  const resetToDefaults = () => {
    if (confirm('Reset all TI-DSP text to default starting values? You can still edit them before saving.')) {
      setForm(DEFAULT_STATE);
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

  // Gallery handlers
  const handleAddGalleryPhoto = (result: UploadResult) => {
    const newPhoto: TiDspGalleryPhoto = {
      id: `photo-${Date.now()}`,
      imageUrl: result.url,
      url: result.url,
      storagePath: result.path,
      caption: '',
    };
    setForm((prev) => ({
      ...prev,
      gallery: {
        ...prev.gallery,
        photos: [...(prev.gallery?.photos || []), newPhoto],
      },
    }));
  };

  const handleRemoveGalleryPhoto = async (idx: number) => {
    const photo = form.gallery?.photos?.[idx];
    if (photo?.storagePath) {
      try { await deleteFile(photo.storagePath); } catch { /* ignore */ }
    }
    setForm((prev) => ({
      ...prev,
      gallery: {
        ...prev.gallery,
        photos: (prev.gallery?.photos || []).filter((_, i) => i !== idx),
      },
    }));
  };

  const handleUpdateGalleryCaption = (idx: number, caption: string) => {
    const photos = [...(form.gallery?.photos || [])];
    if (photos[idx]) {
      photos[idx] = { ...photos[idx], caption };
      setForm((prev) => ({
        ...prev,
        gallery: { ...prev.gallery, photos },
      }));
    }
  };

  // Year Tab Block manipulation helpers
  const updateYearBlock = (yearIdx: number, blockIdx: number, updatedBlock: ContentBlock) => {
    const years = [...(form.trainingResearch?.years || [])];
    if (years[yearIdx]) {
      const blocks = [...years[yearIdx].blocks];
      blocks[blockIdx] = updatedBlock;
      years[yearIdx] = { ...years[yearIdx], blocks };
      setForm((p) => ({ ...p, trainingResearch: { ...p.trainingResearch, years } }));
    }
  };

  const addYearBlock = (yearIdx: number, type: 'paragraph' | 'heading' | 'bullets' | 'numbered' | 'table') => {
    const years = [...(form.trainingResearch?.years || [])];
    if (years[yearIdx]) {
      let newBlock: ContentBlock = { type: 'paragraph', text: '' };
      if (type === 'heading') newBlock = { type: 'heading', text: '' };
      if (type === 'bullets') newBlock = { type: 'bullets', items: [''] };
      if (type === 'numbered') newBlock = { type: 'numbered', items: [''] };
      if (type === 'table') newBlock = { type: 'table', headers: ['S.No', 'Title', 'Details'], rows: [{ cells: ['1', '', ''] }] };

      const blocks = [...years[yearIdx].blocks, newBlock];
      years[yearIdx] = { ...years[yearIdx], blocks };
      setForm((p) => ({ ...p, trainingResearch: { ...p.trainingResearch, years } }));
    }
  };

  const removeYearBlock = (yearIdx: number, blockIdx: number) => {
    const years = [...(form.trainingResearch?.years || [])];
    if (years[yearIdx]) {
      const blocks = years[yearIdx].blocks.filter((_, i) => i !== blockIdx);
      years[yearIdx] = { ...years[yearIdx], blocks };
      setForm((p) => ({ ...p, trainingResearch: { ...p.trainingResearch, years } }));
    }
  };

  const addYearTab = () => {
    const label = prompt('Enter Academic Year label (e.g. AY 2023-2024):');
    if (!label) return;
    const newYear: YearTab = {
      label,
      blocks: [{ type: 'paragraph', text: 'Project work details...' }],
    };
    const years = [...(form.trainingResearch?.years || []), newYear];
    setForm((p) => ({ ...p, trainingResearch: { ...p.trainingResearch, years } }));
    setSelectedYearIdx(years.length - 1);
  };

  const removeYearTab = (idx: number) => {
    if (!confirm('Are you sure you want to delete this year archive tab?')) return;
    const years = (form.trainingResearch?.years || []).filter((_, i) => i !== idx);
    setForm((p) => ({ ...p, trainingResearch: { ...p.trainingResearch, years } }));
    setSelectedYearIdx(Math.max(0, idx - 1));
  };

  const subTabs: { key: ActiveSubSection; label: string; icon: React.ReactNode }[] = [
    { key: 'overview', label: '1. Overview & About', icon: <Cpu size={15} /> },
    { key: 'vision-mission', label: '2. Vision & Mission', icon: <Compass size={15} /> },
    { key: 'objectives', label: '3. Core Objectives', icon: <Target size={15} /> },
    { key: 'lab-development', label: '4. Lab Development & Support', icon: <Building2 size={15} /> },
    { key: 'societal-impact', label: '5. Societal Impact Research', icon: <Award size={15} /> },
    { key: 'research-outputs', label: '6. Research Outputs & Publications', icon: <FileText size={15} /> },
    { key: 'training-activities', label: '7. Training & Activities', icon: <BookOpen size={15} /> },
    { key: 'key-highlights', label: '8. Key Highlights', icon: <Sparkles size={15} /> },
    { key: 'facilities-equipment', label: '9. Facilities & Equipment', icon: <Zap size={15} /> },
    { key: 'industry-association', label: '10. Industry Association', icon: <Layers size={15} /> },
    { key: 'student-projects', label: '11. Student Projects & Archive', icon: <BookOpen size={15} /> },
    { key: 'team', label: '12. Team', icon: <Users size={15} /> },
    { key: 'collaborations', label: '13. Collaborations', icon: <Globe size={15} /> },
    { key: 'partners', label: '14. Partners', icon: <Handshake size={15} /> },
    { key: 'gallery', label: '15. Visual Documentation', icon: <ImageIcon size={15} /> },
    { key: 'custom-sections', label: '16. Custom Sections', icon: <Plus size={15} /> },
  ];

  return (
    <div style={{ background: '#fff', borderRadius: '14px', border: '1px solid #E2E8F0', padding: '1.5rem', marginTop: '1.5rem', boxShadow: '0 4px 16px rgba(0,0,0,0.03)' }}>
      {/* Header bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem', borderBottom: '1px solid #E2E8F0', paddingBottom: '1rem' }}>
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', background: '#0B1E42', color: '#fff', padding: '0.2rem 0.6rem', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 800, marginBottom: '0.4rem' }}>
            <Cpu size={13} /> TI-DSP CENTRE OF EXCELLENCE
          </div>
          <h2 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#0B1E42', margin: 0 }}>
            Unified Page Content Editor
          </h2>
          <p style={{ fontSize: '0.85rem', color: '#64748B', margin: '0.25rem 0 0 0' }}>
            All sections match the exact top-to-bottom layout of the public TI-DSP Centre of Excellence page.
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

      {/* 16-Toggle Horizontal Bar */}
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

      {/* 1. OVERVIEW & ABOUT */}
      {activeTab === 'overview' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div>
            <label className="admin-label">Hero Banner Subtitle / Tagline</label>
            <textarea
              className="admin-textarea"
              rows={2}
              value={form.hero?.subtitle || ''}
              onChange={(e) => setForm((p) => ({ ...p, hero: { ...p.hero, subtitle: e.target.value } }))}
            />
          </div>

          <div>
            <label className="admin-label">About Card Heading</label>
            <input
              type="text"
              className="admin-input"
              value={form.aboutTitle || ''}
              onChange={(e) => setForm((p) => ({ ...p, aboutTitle: e.target.value }))}
            />
          </div>

          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
              <label className="admin-label" style={{ margin: 0 }}>Overview Paragraphs</label>
              <button
                type="button"
                onClick={() => setForm((p) => ({ ...p, overview: [...(p.overview || []), ''] }))}
                className="admin-btn-secondary"
                style={{ fontSize: '0.78rem', padding: '0.3rem 0.65rem' }}
              >
                + Add Paragraph
              </button>
            </div>
            {(form.overview || []).map((p, idx) => (
              <div key={idx} style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.6rem' }}>
                <textarea
                  className="admin-textarea"
                  rows={3}
                  value={p}
                  onChange={(e) => {
                    const list = [...(form.overview || [])];
                    list[idx] = e.target.value;
                    setForm((prev) => ({ ...prev, overview: list }));
                  }}
                />
                <button
                  type="button"
                  onClick={() => {
                    const list = (form.overview || []).filter((_, i) => i !== idx);
                    setForm((prev) => ({ ...prev, overview: list }));
                  }}
                  className="admin-btn-danger"
                  style={{ alignSelf: 'flex-start' }}
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>

          {/* Stats strip */}
          <div style={{ background: '#F8FAFC', padding: '1.25rem', borderRadius: '10px', border: '1px solid #E2E8F0' }}>
            <h4 style={{ margin: '0 0 1rem 0', fontSize: '0.95rem', fontWeight: 800, color: '#0B1E42' }}>
              Stat Highlights Strip (4 Metric Boxes)
            </h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
              <div style={{ background: '#fff', padding: '0.85rem', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
                <label className="admin-label">Stat 1 Value (DSKs)</label>
                <input
                  type="text"
                  className="admin-input"
                  value={form.stats?.dskValue || ''}
                  onChange={(e) => setForm((p) => ({ ...p, stats: { ...p.stats, dskValue: e.target.value } }))}
                />
                <label className="admin-label" style={{ marginTop: '0.4rem' }}>Stat 1 Label</label>
                <input
                  type="text"
                  className="admin-input"
                  value={form.stats?.dskLabel || ''}
                  onChange={(e) => setForm((p) => ({ ...p, stats: { ...p.stats, dskLabel: e.target.value } }))}
                />
              </div>

              <div style={{ background: '#fff', padding: '0.85rem', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
                <label className="admin-label">Stat 2 Value (AICTE-MODROBS)</label>
                <input
                  type="text"
                  className="admin-input"
                  value={form.stats?.aicteValue || ''}
                  onChange={(e) => setForm((p) => ({ ...p, stats: { ...p.stats, aicteValue: e.target.value } }))}
                />
                <label className="admin-label" style={{ marginTop: '0.4rem' }}>Stat 2 Label</label>
                <input
                  type="text"
                  className="admin-input"
                  value={form.stats?.aicteLabel || ''}
                  onChange={(e) => setForm((p) => ({ ...p, stats: { ...p.stats, aicteLabel: e.target.value } }))}
                />
              </div>

              <div style={{ background: '#fff', padding: '0.85rem', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
                <label className="admin-label">Stat 3 Value (DST Grant)</label>
                <input
                  type="text"
                  className="admin-input"
                  value={form.stats?.dstValue || ''}
                  onChange={(e) => setForm((p) => ({ ...p, stats: { ...p.stats, dstValue: e.target.value } }))}
                />
                <label className="admin-label" style={{ marginTop: '0.4rem' }}>Stat 3 Label</label>
                <input
                  type="text"
                  className="admin-input"
                  value={form.stats?.dstLabel || ''}
                  onChange={(e) => setForm((p) => ({ ...p, stats: { ...p.stats, dstLabel: e.target.value } }))}
                />
              </div>

              <div style={{ background: '#fff', padding: '0.85rem', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
                <label className="admin-label">Stat 4 Value (MATLAB)</label>
                <input
                  type="text"
                  className="admin-input"
                  value={form.stats?.matlabValue || ''}
                  onChange={(e) => setForm((p) => ({ ...p, stats: { ...p.stats, matlabValue: e.target.value } }))}
                />
                <label className="admin-label" style={{ marginTop: '0.4rem' }}>Stat 4 Label</label>
                <input
                  type="text"
                  className="admin-input"
                  value={form.stats?.matlabLabel || ''}
                  onChange={(e) => setForm((p) => ({ ...p, stats: { ...p.stats, matlabLabel: e.target.value } }))}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. VISION & MISSION */}
      {activeTab === 'vision-mission' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div>
            <label className="admin-label">Strategic Vision Statement</label>
            <textarea
              className="admin-textarea"
              rows={3}
              value={form.vision || ''}
              onChange={(e) => setForm((p) => ({ ...p, vision: e.target.value }))}
            />
          </div>

          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
              <label className="admin-label" style={{ margin: 0 }}>Institutional Mission Points</label>
              <button
                type="button"
                onClick={() => setForm((p) => ({ ...p, mission: [...(p.mission || []), ''] }))}
                className="admin-btn-secondary"
                style={{ fontSize: '0.78rem', padding: '0.3rem 0.65rem' }}
              >
                + Add Mission Point
              </button>
            </div>
            {(form.mission || []).map((m, idx) => (
              <div key={idx} style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <input
                  type="text"
                  className="admin-input"
                  value={m}
                  onChange={(e) => {
                    const list = [...(form.mission || [])];
                    list[idx] = e.target.value;
                    setForm((prev) => ({ ...prev, mission: list }));
                  }}
                />
                <button
                  type="button"
                  onClick={() => {
                    const list = (form.mission || []).filter((_, i) => i !== idx);
                    setForm((prev) => ({ ...prev, mission: list }));
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
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <label className="admin-label" style={{ margin: 0 }}>Pillars of Excellence — Core Objectives</label>
              <p style={{ fontSize: '0.8rem', color: '#64748B', margin: '0.2rem 0 0 0' }}>
                Format as <strong>Title: Description</strong> (e.g. <em>Advance DSP Research: Support research and experimentation...</em>)
              </p>
            </div>
            <button
              type="button"
              onClick={() => setForm((p) => ({ ...p, objectives: [...(p.objectives || []), ''] }))}
              className="admin-btn-secondary"
              style={{ fontSize: '0.8rem' }}
            >
              + Add Objective
            </button>
          </div>

          {(form.objectives || []).map((obj, idx) => (
            <div key={idx} style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <div style={{ width: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, color: '#0B1E42', background: '#F1F5F9', borderRadius: '6px', fontSize: '0.85rem' }}>
                0{idx + 1}
              </div>
              <input
                type="text"
                className="admin-input"
                value={obj}
                onChange={(e) => {
                  const list = [...(form.objectives || [])];
                  list[idx] = e.target.value;
                  setForm((prev) => ({ ...prev, objectives: list }));
                }}
              />
              <button
                type="button"
                onClick={() => {
                  const list = (form.objectives || []).filter((_, i) => i !== idx);
                  setForm((prev) => ({ ...prev, objectives: list }));
                }}
                className="admin-btn-danger"
              >
                <Trash2 size={14} />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* 4. LAB DEVELOPMENT & SUPPORT */}
      {activeTab === 'lab-development' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div style={{ background: '#F8FAFC', padding: '1.25rem', borderRadius: '10px', border: '1px solid #E2E8F0' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
              <div>
                <h4 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 800, color: '#0B1E42' }}>
                  Lab Development & External Support (Modernisation)
                </h4>
                <p style={{ margin: '0.2rem 0 0 0', fontSize: '0.8rem', color: '#64748B' }}>
                  Details about AICTE-MODROBS grant, TMS320C6713 DSKs, and Texas Instruments lab modernisation.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setForm((p) => ({ ...p, labDevelopment: [...(p.labDevelopment || []), ''] }))}
                className="admin-btn-secondary"
                style={{ fontSize: '0.78rem' }}
              >
                + Add Paragraph
              </button>
            </div>
            {(form.labDevelopment || []).map((p, idx) => (
              <div key={idx} style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.6rem' }}>
                <textarea
                  className="admin-textarea"
                  rows={3}
                  value={p}
                  onChange={(e) => {
                    const list = [...(form.labDevelopment || [])];
                    list[idx] = e.target.value;
                    setForm((prev) => ({ ...prev, labDevelopment: list }));
                  }}
                />
                <button
                  type="button"
                  onClick={() => {
                    const list = (form.labDevelopment || []).filter((_, i) => i !== idx);
                    setForm((prev) => ({ ...prev, labDevelopment: list }));
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

      {/* 5. SOCIETAL IMPACT RESEARCH */}
      {activeTab === 'societal-impact' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div style={{ background: '#F8FAFC', padding: '1.25rem', borderRadius: '10px', border: '1px solid #E2E8F0' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
              <div>
                <h4 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 800, color: '#0B1E42' }}>
                  Societal Impact Research
                </h4>
                <p style={{ margin: '0.2rem 0 0 0', fontSize: '0.8rem', color: '#64748B' }}>
                  Details about ₹53 Lakh DST grant, speech enhancement for hearing impairment, and social relevance.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setForm((p) => ({ ...p, societalImpact: [...(p.societalImpact || []), ''] }))}
                className="admin-btn-secondary"
                style={{ fontSize: '0.78rem' }}
              >
                + Add Paragraph
              </button>
            </div>
            {(form.societalImpact || []).map((p, idx) => (
              <div key={idx} style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.6rem' }}>
                <textarea
                  className="admin-textarea"
                  rows={3}
                  value={p}
                  onChange={(e) => {
                    const list = [...(form.societalImpact || [])];
                    list[idx] = e.target.value;
                    setForm((prev) => ({ ...prev, societalImpact: list }));
                  }}
                />
                <button
                  type="button"
                  onClick={() => {
                    const list = (form.societalImpact || []).filter((_, i) => i !== idx);
                    setForm((prev) => ({ ...prev, societalImpact: list }));
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

      {/* 6. RESEARCH OUTPUTS & PUBLICATIONS */}
      {activeTab === 'research-outputs' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div>
            <label className="admin-label">Section Heading</label>
            <input
              type="text"
              className="admin-input"
              value={form.researchOutputs?.title || ''}
              onChange={(e) => setForm((p) => ({ ...p, researchOutputs: { ...p.researchOutputs, title: e.target.value } }))}
            />
          </div>

          <div>
            <label className="admin-label">Introductory Paragraph</label>
            <textarea
              className="admin-textarea"
              rows={2}
              value={form.researchOutputs?.intro || ''}
              onChange={(e) => setForm((p) => ({ ...p, researchOutputs: { ...p.researchOutputs, intro: e.target.value } }))}
            />
          </div>

          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
              <label className="admin-label" style={{ margin: 0 }}>Research Focus Areas (Checklist)</label>
              <button
                type="button"
                onClick={() => setForm((p) => ({ ...p, researchOutputs: { ...p.researchOutputs, areas: [...(p.researchOutputs?.areas || []), ''] } }))}
                className="admin-btn-secondary"
                style={{ fontSize: '0.78rem' }}
              >
                + Add Area
              </button>
            </div>
            {(form.researchOutputs?.areas || []).map((area, idx) => (
              <div key={idx} style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.4rem' }}>
                <input
                  type="text"
                  className="admin-input"
                  value={area}
                  onChange={(e) => {
                    const list = [...(form.researchOutputs?.areas || [])];
                    list[idx] = e.target.value;
                    setForm((p) => ({ ...p, researchOutputs: { ...p.researchOutputs, areas: list } }));
                  }}
                />
                <button
                  type="button"
                  onClick={() => {
                    const list = (form.researchOutputs?.areas || []).filter((_, i) => i !== idx);
                    setForm((p) => ({ ...p, researchOutputs: { ...p.researchOutputs, areas: list } }));
                  }}
                  className="admin-btn-danger"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>

          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
              <label className="admin-label" style={{ margin: 0 }}>Selected Publications & Presentations Citations</label>
              <button
                type="button"
                onClick={() => setForm((p) => ({ ...p, researchOutputs: { ...p.researchOutputs, publications: [...(p.researchOutputs?.publications || []), ''] } }))}
                className="admin-btn-secondary"
                style={{ fontSize: '0.78rem' }}
              >
                + Add Publication Citation
              </button>
            </div>
            {(form.researchOutputs?.publications || []).map((pub, idx) => (
              <div key={idx} style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <textarea
                  className="admin-textarea"
                  rows={2}
                  value={pub}
                  onChange={(e) => {
                    const list = [...(form.researchOutputs?.publications || [])];
                    list[idx] = e.target.value;
                    setForm((p) => ({ ...p, researchOutputs: { ...p.researchOutputs, publications: list } }));
                  }}
                />
                <button
                  type="button"
                  onClick={() => {
                    const list = (form.researchOutputs?.publications || []).filter((_, i) => i !== idx);
                    setForm((p) => ({ ...p, researchOutputs: { ...p.researchOutputs, publications: list } }));
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

      {/* 7. TRAINING & ACTIVITIES */}
      {activeTab === 'training-activities' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div style={{ background: '#F8FAFC', padding: '1.25rem', borderRadius: '10px', border: '1px solid #E2E8F0' }}>
            <label className="admin-label">Training & Academic Activities Section Heading</label>
            <input
              type="text"
              className="admin-input"
              style={{ marginBottom: '1rem' }}
              value={form.trainingActivities?.title || ''}
              onChange={(e) => setForm((p) => ({ ...p, trainingActivities: { ...p.trainingActivities, title: e.target.value } }))}
            />

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
              <label className="admin-label" style={{ margin: 0 }}>Conducted Workshops & Training List</label>
              <button
                type="button"
                onClick={() => setForm((p) => ({ ...p, trainingActivities: { ...p.trainingActivities, activities: [...(p.trainingActivities?.activities || []), { title: '' }] } }))}
                className="admin-btn-secondary"
                style={{ fontSize: '0.78rem' }}
              >
                + Add Workshop
              </button>
            </div>
            {(form.trainingActivities?.activities || []).map((act, idx) => (
              <div key={idx} style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <input
                  type="text"
                  className="admin-input"
                  value={act.title}
                  onChange={(e) => {
                    const list = [...(form.trainingActivities?.activities || [])];
                    list[idx] = { title: e.target.value };
                    setForm((p) => ({ ...p, trainingActivities: { ...p.trainingActivities, activities: list } }));
                  }}
                />
                <button
                  type="button"
                  onClick={() => {
                    const list = (form.trainingActivities?.activities || []).filter((_, i) => i !== idx);
                    setForm((p) => ({ ...p, trainingActivities: { ...p.trainingActivities, activities: list } }));
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

      {/* 8. KEY HIGHLIGHTS */}
      {activeTab === 'key-highlights' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div style={{ background: '#F8FAFC', padding: '1.25rem', borderRadius: '10px', border: '1px solid #E2E8F0' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
              <div>
                <h4 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 800, color: '#0B1E42' }}>
                  Key Highlights & Achievements
                </h4>
                <p style={{ margin: '0.2rem 0 0 0', fontSize: '0.8rem', color: '#64748B' }}>
                  Highlights checklist displayed on the public page.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setForm((p) => ({ ...p, keyHighlights: [...(p.keyHighlights || []), ''] }))}
                className="admin-btn-secondary"
                style={{ fontSize: '0.78rem' }}
              >
                + Add Highlight
              </button>
            </div>
            {(form.keyHighlights || []).map((hl, idx) => (
              <div key={idx} style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.4rem' }}>
                <input
                  type="text"
                  className="admin-input"
                  value={hl}
                  onChange={(e) => {
                    const list = [...(form.keyHighlights || [])];
                    list[idx] = e.target.value;
                    setForm((p) => ({ ...p, keyHighlights: list }));
                  }}
                />
                <button
                  type="button"
                  onClick={() => {
                    const list = (form.keyHighlights || []).filter((_, i) => i !== idx);
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

      {/* 9. FACILITIES & EQUIPMENT */}
      {activeTab === 'facilities-equipment' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div style={{ background: '#F8FAFC', padding: '1.25rem', borderRadius: '10px', border: '1px solid #E2E8F0' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
              <div>
                <h4 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 800, color: '#0B1E42' }}>
                  Facilities & Hardware Kits Checklist
                </h4>
                <p style={{ margin: '0.2rem 0 0 0', fontSize: '0.8rem', color: '#64748B' }}>
                  DSKs, Evaluation Kits, LaunchPads, and software licenses available in the lab.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setForm((p) => ({ ...p, facilitiesEquipment: [...(p.facilitiesEquipment || []), ''] }))}
                className="admin-btn-secondary"
                style={{ fontSize: '0.78rem' }}
              >
                + Add Hardware Kit / Facility
              </button>
            </div>
            {(form.facilitiesEquipment || []).map((eq, idx) => (
              <div key={idx} style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.4rem' }}>
                <input
                  type="text"
                  className="admin-input"
                  value={eq}
                  onChange={(e) => {
                    const list = [...(form.facilitiesEquipment || [])];
                    list[idx] = e.target.value;
                    setForm((p) => ({ ...p, facilitiesEquipment: list }));
                  }}
                />
                <button
                  type="button"
                  onClick={() => {
                    const list = (form.facilitiesEquipment || []).filter((_, i) => i !== idx);
                    setForm((p) => ({ ...p, facilitiesEquipment: list }));
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

      {/* 10. INDUSTRY ASSOCIATION */}
      {activeTab === 'industry-association' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div style={{ background: '#F8FAFC', padding: '1.25rem', borderRadius: '10px', border: '1px solid #E2E8F0' }}>
            <h4 style={{ margin: '0 0 0.75rem 0', fontSize: '0.95rem', fontWeight: 800, color: '#0B1E42' }}>
              Industry Association Partner
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div>
                <label className="admin-label">Partner Name</label>
                <input
                  type="text"
                  className="admin-input"
                  value={form.industryAssociation?.partner || ''}
                  onChange={(e) => setForm((p) => ({ ...p, industryAssociation: { ...p.industryAssociation, partner: e.target.value } }))}
                />
              </div>
              <div>
                <label className="admin-label">Collaboration Description</label>
                <textarea
                  className="admin-textarea"
                  rows={4}
                  value={form.industryAssociation?.description || ''}
                  onChange={(e) => setForm((p) => ({ ...p, industryAssociation: { ...p.industryAssociation, description: e.target.value } }))}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 11. STUDENT PROJECTS & ARCHIVE */}
      {activeTab === 'student-projects' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div>
            <label className="admin-label">Section Title</label>
            <input
              type="text"
              className="admin-input"
              value={form.trainingResearch?.title || ''}
              onChange={(e) => setForm((p) => ({ ...p, trainingResearch: { ...p.trainingResearch, title: e.target.value } }))}
            />
          </div>

          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
              <label className="admin-label" style={{ margin: 0 }}>Introductory Paragraphs</label>
              <button
                type="button"
                onClick={() => setForm((p) => ({ ...p, trainingResearch: { ...p.trainingResearch, paragraphs: [...(p.trainingResearch?.paragraphs || []), ''] } }))}
                className="admin-btn-secondary"
                style={{ fontSize: '0.78rem' }}
              >
                + Add Paragraph
              </button>
            </div>
            {(form.trainingResearch?.paragraphs || []).map((p, idx) => (
              <div key={idx} style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <textarea
                  className="admin-textarea"
                  rows={2}
                  value={p}
                  onChange={(e) => {
                    const list = [...(form.trainingResearch?.paragraphs || [])];
                    list[idx] = e.target.value;
                    setForm((prev) => ({ ...prev, trainingResearch: { ...prev.trainingResearch, paragraphs: list } }));
                  }}
                />
                <button
                  type="button"
                  onClick={() => {
                    const list = (form.trainingResearch?.paragraphs || []).filter((_, i) => i !== idx);
                    setForm((prev) => ({ ...prev, trainingResearch: { ...prev.trainingResearch, paragraphs: list } }));
                  }}
                  className="admin-btn-danger"
                  style={{ alignSelf: 'flex-start' }}
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>

          <div>
            <label className="admin-label">Archive Subheading</label>
            <input
              type="text"
              className="admin-input"
              value={form.trainingResearch?.archiveTitle || ''}
              onChange={(e) => setForm((p) => ({ ...p, trainingResearch: { ...p.trainingResearch, archiveTitle: e.target.value } }))}
            />
          </div>

          {/* Year Archive Tabs Editor */}
          <div style={{ background: '#F8FAFC', padding: '1.25rem', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
              <h4 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 800, color: '#0B1E42' }}>
                Year-wise Project Archive ({form.trainingResearch?.years?.length || 0} Years)
              </h4>
              <button
                type="button"
                onClick={addYearTab}
                className="admin-btn-secondary"
                style={{ fontSize: '0.8rem', padding: '0.35rem 0.75rem' }}
              >
                + Add Academic Year
              </button>
            </div>

            {/* Year Switcher Pills */}
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1.25rem' }}>
              {(form.trainingResearch?.years || []).map((y, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setSelectedYearIdx(idx)}
                  style={{
                    padding: '0.45rem 0.9rem',
                    borderRadius: '9999px',
                    fontSize: '0.825rem',
                    fontWeight: 700,
                    border: 'none',
                    cursor: 'pointer',
                    background: selectedYearIdx === idx ? '#0B1E42' : '#e2e8f0',
                    color: selectedYearIdx === idx ? '#ffffff' : '#334155',
                    transition: 'all 0.15s ease',
                  }}
                >
                  {y.label}
                </button>
              ))}
            </div>

            {/* Active Year Blocks Editor */}
            {form.trainingResearch?.years && form.trainingResearch.years[selectedYearIdx] ? (
              <div style={{ background: '#fff', border: '1px solid #E2E8F0', borderRadius: '10px', padding: '1.25rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', borderBottom: '1px solid #f1f5f9', paddingBottom: '0.75rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <label className="admin-label" style={{ margin: 0, whiteSpace: 'nowrap' }}>Year Label:</label>
                    <input
                      type="text"
                      className="admin-input"
                      style={{ width: '220px' }}
                      value={form.trainingResearch.years[selectedYearIdx].label}
                      onChange={(e) => {
                        const years = [...(form.trainingResearch?.years || [])];
                        years[selectedYearIdx] = { ...years[selectedYearIdx], label: e.target.value };
                        setForm((p) => ({ ...p, trainingResearch: { ...p.trainingResearch, years } }));
                      }}
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => removeYearTab(selectedYearIdx)}
                    className="admin-btn-danger"
                    style={{ fontSize: '0.78rem' }}
                  >
                    Delete Year Tab
                  </button>
                </div>

                {/* Blocks list */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {form.trainingResearch.years[selectedYearIdx].blocks.map((block, bIdx) => (
                    <div key={bIdx} style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '0.85rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                        <span style={{ fontSize: '0.78rem', fontWeight: 800, textTransform: 'uppercase', color: '#64748b' }}>
                          Block #{bIdx + 1} ({block.type})
                        </span>
                        <button
                          type="button"
                          onClick={() => removeYearBlock(selectedYearIdx, bIdx)}
                          className="admin-btn-danger"
                          style={{ padding: '0.2rem 0.5rem', fontSize: '0.75rem' }}
                        >
                          Remove
                        </button>
                      </div>

                      {block.type === 'paragraph' && (
                        <textarea
                          className="admin-textarea"
                          rows={2}
                          value={block.text}
                          onChange={(e) => updateYearBlock(selectedYearIdx, bIdx, { type: 'paragraph', text: e.target.value })}
                        />
                      )}

                      {block.type === 'heading' && (
                        <input
                          type="text"
                          className="admin-input"
                          value={block.text}
                          onChange={(e) => updateYearBlock(selectedYearIdx, bIdx, { type: 'heading', text: e.target.value })}
                        />
                      )}

                      {block.type === 'bullets' && (
                        <div>
                          <label className="admin-label">Bullet points (one per line)</label>
                          <textarea
                            className="admin-textarea"
                            rows={3}
                            value={block.items.join('\n')}
                            onChange={(e) => updateYearBlock(selectedYearIdx, bIdx, { type: 'bullets', items: e.target.value.split('\n') })}
                          />
                        </div>
                      )}

                      {block.type === 'numbered' && (
                        <div>
                          <label className="admin-label">Numbered list items (one per line)</label>
                          <textarea
                            className="admin-textarea"
                            rows={3}
                            value={block.items.join('\n')}
                            onChange={(e) => updateYearBlock(selectedYearIdx, bIdx, { type: 'numbered', items: e.target.value.split('\n') })}
                          />
                        </div>
                      )}

                      {block.type === 'table' && (
                        <div>
                          <label className="admin-label">Table Headers (comma-separated)</label>
                          <input
                            type="text"
                            className="admin-input"
                            style={{ marginBottom: '0.5rem' }}
                            value={block.headers.join(', ')}
                            onChange={(e) => updateYearBlock(selectedYearIdx, bIdx, { ...block, headers: e.target.value.split(',').map((h) => h.trim()) })}
                          />
                          <label className="admin-label">Table Rows ({block.rows.length} rows)</label>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                            {block.rows.map((row, rIdx) => (
                              <div key={rIdx} style={{ display: 'flex', gap: '0.4rem' }}>
                                <input
                                  type="text"
                                  className="admin-input"
                                  value={row.cells.join(' | ')}
                                  onChange={(e) => {
                                    const nextRows = [...block.rows];
                                    nextRows[rIdx] = { cells: e.target.value.split('|').map((c) => c.trim()) };
                                    updateYearBlock(selectedYearIdx, bIdx, { ...block, rows: nextRows });
                                  }}
                                  placeholder="Cell 1 | Cell 2 | Cell 3"
                                />
                                <button
                                  type="button"
                                  onClick={() => {
                                    const nextRows = block.rows.filter((_, i) => i !== rIdx);
                                    updateYearBlock(selectedYearIdx, bIdx, { ...block, rows: nextRows });
                                  }}
                                  className="admin-btn-danger"
                                >
                                  ✕
                                </button>
                              </div>
                            ))}
                            <button
                              type="button"
                              onClick={() => {
                                const nextRows = [...block.rows, { cells: block.headers.map(() => '') }];
                                updateYearBlock(selectedYearIdx, bIdx, { ...block, rows: nextRows });
                              }}
                              className="admin-btn-secondary"
                              style={{ fontSize: '0.75rem', alignSelf: 'flex-start', marginTop: '0.3rem' }}
                            >
                              + Add Row
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {/* Add Block Buttons */}
                <div style={{ marginTop: '1rem', paddingTop: '0.75rem', borderTop: '1px dashed #e2e8f0', display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                  <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#64748b', alignSelf: 'center', marginRight: '0.3rem' }}>+ Add:</span>
                  <button type="button" onClick={() => addYearBlock(selectedYearIdx, 'paragraph')} className="admin-btn-secondary" style={{ fontSize: '0.75rem', padding: '0.3rem 0.6rem' }}>Paragraph</button>
                  <button type="button" onClick={() => addYearBlock(selectedYearIdx, 'heading')} className="admin-btn-secondary" style={{ fontSize: '0.75rem', padding: '0.3rem 0.6rem' }}>Heading</button>
                  <button type="button" onClick={() => addYearBlock(selectedYearIdx, 'bullets')} className="admin-btn-secondary" style={{ fontSize: '0.75rem', padding: '0.3rem 0.6rem' }}>Bullets</button>
                  <button type="button" onClick={() => addYearBlock(selectedYearIdx, 'numbered')} className="admin-btn-secondary" style={{ fontSize: '0.75rem', padding: '0.3rem 0.6rem' }}>Numbered List</button>
                  <button type="button" onClick={() => addYearBlock(selectedYearIdx, 'table')} className="admin-btn-secondary" style={{ fontSize: '0.75rem', padding: '0.3rem 0.6rem' }}>Table</button>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      )}

      {/* 12. TEAM */}
      {activeTab === 'team' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
          {/* Faculty In-Charge */}
          <div style={{ background: '#F8FAFC', padding: '1.25rem', borderRadius: '10px', border: '1px solid #E2E8F0' }}>
            <h4 style={{ margin: '0 0 0.85rem', fontSize: '0.95rem', fontWeight: 800, color: '#0B1E42' }}>
              Faculty In-Charge
            </h4>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              <div>
                <label className="admin-label">Name</label>
                <input
                  type="text"
                  className="admin-input"
                  value={form.team?.inCharge?.name || ''}
                  onChange={(e) => setForm((p) => ({ ...p, team: { ...p.team, inCharge: { ...EMPTY_IN_CHARGE, ...p.team?.inCharge, name: e.target.value } } }))}
                />
              </div>
              <div>
                <label className="admin-label">Designation</label>
                <input
                  type="text"
                  className="admin-input"
                  value={form.team?.inCharge?.designation || ''}
                  onChange={(e) => setForm((p) => ({ ...p, team: { ...p.team, inCharge: { ...EMPTY_IN_CHARGE, ...p.team?.inCharge, designation: e.target.value } } }))}
                />
              </div>
              <div>
                <label className="admin-label">Email</label>
                <input
                  type="text"
                  className="admin-input"
                  value={form.team?.inCharge?.email || ''}
                  onChange={(e) => setForm((p) => ({ ...p, team: { ...p.team, inCharge: { ...EMPTY_IN_CHARGE, ...p.team?.inCharge, email: e.target.value } } }))}
                />
              </div>
              <div>
                <label className="admin-label">Mobile</label>
                <input
                  type="text"
                  className="admin-input"
                  value={form.team?.inCharge?.mobile || ''}
                  onChange={(e) => setForm((p) => ({ ...p, team: { ...p.team, inCharge: { ...EMPTY_IN_CHARGE, ...p.team?.inCharge, mobile: e.target.value } } }))}
                />
              </div>
              <div style={{ gridColumn: '1 / -1' }}>
                <label className="admin-label">Interests</label>
                <input
                  type="text"
                  className="admin-input"
                  value={form.team?.inCharge?.interests || ''}
                  onChange={(e) => setForm((p) => ({ ...p, team: { ...p.team, inCharge: { ...EMPTY_IN_CHARGE, ...p.team?.inCharge, interests: e.target.value } } }))}
                />
              </div>
            </div>
          </div>

          {/* Faculty Members List */}
          <div style={{ background: '#F8FAFC', padding: '1.25rem', borderRadius: '10px', border: '1px solid #E2E8F0' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.85rem' }}>
              <h4 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 800, color: '#0B1E42' }}>
                Faculty Members ({form.team?.facultyMembers?.length || 0})
              </h4>
              <button
                type="button"
                onClick={() => {
                  setForm((p) => ({
                    ...p,
                    team: {
                      ...p.team,
                      facultyMembers: [
                        ...(p.team?.facultyMembers || []),
                        { name: '', designation: '', email: '', mobile: '', interests: '' },
                      ],
                    },
                  }));
                }}
                className="admin-btn-secondary"
                style={{ fontSize: '0.8rem' }}
              >
                + Add Faculty Member
              </button>
            </div>

            {(form.team?.facultyMembers || []).map((member, idx) => (
              <div key={idx} style={{ border: '1px solid #e2e8f0', borderRadius: '10px', padding: '1rem', marginBottom: '0.75rem', background: '#fff' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.6rem' }}>
                  <div>
                    <label className="admin-label">Name</label>
                    <input
                      type="text"
                      className="admin-input"
                      value={member.name}
                      onChange={(e) => {
                        const list = [...(form.team?.facultyMembers || [])];
                        list[idx] = { ...list[idx], name: e.target.value };
                        setForm((p) => ({ ...p, team: { ...p.team, facultyMembers: list } }));
                      }}
                    />
                  </div>
                  <div>
                    <label className="admin-label">Designation</label>
                    <input
                      type="text"
                      className="admin-input"
                      value={member.designation || ''}
                      onChange={(e) => {
                        const list = [...(form.team?.facultyMembers || [])];
                        list[idx] = { ...list[idx], designation: e.target.value };
                        setForm((p) => ({ ...p, team: { ...p.team, facultyMembers: list } }));
                      }}
                    />
                  </div>
                  <div>
                    <label className="admin-label">Email</label>
                    <input
                      type="text"
                      className="admin-input"
                      value={member.email || ''}
                      onChange={(e) => {
                        const list = [...(form.team?.facultyMembers || [])];
                        list[idx] = { ...list[idx], email: e.target.value };
                        setForm((p) => ({ ...p, team: { ...p.team, facultyMembers: list } }));
                      }}
                    />
                  </div>
                  <div>
                    <label className="admin-label">Mobile</label>
                    <input
                      type="text"
                      className="admin-input"
                      value={member.mobile || ''}
                      onChange={(e) => {
                        const list = [...(form.team?.facultyMembers || [])];
                        list[idx] = { ...list[idx], mobile: e.target.value };
                        setForm((p) => ({ ...p, team: { ...p.team, facultyMembers: list } }));
                      }}
                    />
                  </div>
                  <div style={{ gridColumn: '1 / -1' }}>
                    <label className="admin-label">Interests</label>
                    <input
                      type="text"
                      className="admin-input"
                      value={member.interests || ''}
                      onChange={(e) => {
                        const list = [...(form.team?.facultyMembers || [])];
                        list[idx] = { ...list[idx], interests: e.target.value };
                        setForm((p) => ({ ...p, team: { ...p.team, facultyMembers: list } }));
                      }}
                    />
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    const list = (form.team?.facultyMembers || []).filter((_, i) => i !== idx);
                    setForm((p) => ({ ...p, team: { ...p.team, facultyMembers: list } }));
                  }}
                  className="admin-btn-danger"
                  style={{ marginTop: '0.6rem', fontSize: '0.8rem' }}
                >
                  <Trash2 size={13} style={{ marginRight: '4px' }} /> Remove Member
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 13. COLLABORATIONS [NATIONAL / INTERNATIONAL] */}
      {activeTab === 'collaborations' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div style={{ background: '#F8FAFC', padding: '1.25rem', borderRadius: '10px', border: '1px solid #E2E8F0' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
              <div>
                <h4 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 800, color: '#0B1E42' }}>
                  Collaborations [National / International] Section
                </h4>
                <p style={{ margin: '0.2rem 0 0 0', fontSize: '0.8rem', color: '#64748B' }}>
                  Accordion item #02 rendered directly on the public TI-DSP page.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setForm((p) => ({
                  ...p,
                  collaborations: {
                    ...p.collaborations,
                    paragraphs: [...(p.collaborations?.paragraphs && p.collaborations.paragraphs.length > 0 ? p.collaborations.paragraphs : (DEFAULT_STATE.collaborations?.paragraphs || [])), ''],
                  },
                }))}
                className="admin-btn-secondary"
                style={{ fontSize: '0.78rem' }}
              >
                + Add Paragraph
              </button>
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <label className="admin-label">Accordion Title</label>
              <input
                type="text"
                className="admin-input"
                value={form.collaborations?.title || DEFAULT_STATE.collaborations?.title || 'Collaborations [National / International]'}
                onChange={(e) => setForm((p) => ({
                  ...p,
                  collaborations: { ...p.collaborations, title: e.target.value },
                }))}
                placeholder="Collaborations [National / International]"
              />
            </div>

            <label className="admin-label">Paragraphs</label>
            {(form.collaborations?.paragraphs && form.collaborations.paragraphs.length > 0
              ? form.collaborations.paragraphs
              : (DEFAULT_STATE.collaborations?.paragraphs || [''])
            ).map((p, idx) => (
              <div key={idx} style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.6rem' }}>
                <textarea
                  className="admin-textarea"
                  rows={4}
                  value={p}
                  onChange={(e) => {
                    const baseList = form.collaborations?.paragraphs && form.collaborations.paragraphs.length > 0
                      ? form.collaborations.paragraphs
                      : (DEFAULT_STATE.collaborations?.paragraphs || ['']);
                    const list = [...baseList];
                    list[idx] = e.target.value;
                    setForm((prev) => ({
                      ...prev,
                      collaborations: { ...prev.collaborations, paragraphs: list },
                    }));
                  }}
                />
                <button
                  type="button"
                  onClick={() => {
                    const baseList = form.collaborations?.paragraphs && form.collaborations.paragraphs.length > 0
                      ? form.collaborations.paragraphs
                      : (DEFAULT_STATE.collaborations?.paragraphs || ['']);
                    const list = baseList.filter((_, i) => i !== idx);
                    setForm((prev) => ({
                      ...prev,
                      collaborations: { ...prev.collaborations, paragraphs: list },
                    }));
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

      {/* 14. PARTNERS */}
      {activeTab === 'partners' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div style={{ background: '#F8FAFC', padding: '1.25rem', borderRadius: '10px', border: '1px solid #E2E8F0' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
              <div>
                <h4 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 800, color: '#0B1E42' }}>
                  Partners Section
                </h4>
                <p style={{ margin: '0.2rem 0 0 0', fontSize: '0.8rem', color: '#64748B' }}>
                  Accordion item #03 rendered directly on the public TI-DSP page.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setForm((p) => ({
                  ...p,
                  partners: {
                    ...p.partners,
                    paragraphs: [...(p.partners?.paragraphs && p.partners.paragraphs.length > 0 ? p.partners.paragraphs : (DEFAULT_STATE.partners?.paragraphs || [])), ''],
                  },
                }))}
                className="admin-btn-secondary"
                style={{ fontSize: '0.78rem' }}
              >
                + Add Paragraph / Partner
              </button>
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <label className="admin-label">Accordion Title</label>
              <input
                type="text"
                className="admin-input"
                value={form.partners?.title || DEFAULT_STATE.partners?.title || 'Partners'}
                onChange={(e) => setForm((p) => ({
                  ...p,
                  partners: { ...p.partners, title: e.target.value },
                }))}
                placeholder="Partners"
              />
            </div>

            <label className="admin-label">Partner Descriptions / Highlights</label>
            {(form.partners?.paragraphs && form.partners.paragraphs.length > 0
              ? form.partners.paragraphs
              : (DEFAULT_STATE.partners?.paragraphs || [''])
            ).map((p, idx) => (
              <div key={idx} style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.6rem' }}>
                <textarea
                  className="admin-textarea"
                  rows={2}
                  value={p}
                  onChange={(e) => {
                    const baseList = form.partners?.paragraphs && form.partners.paragraphs.length > 0
                      ? form.partners.paragraphs
                      : (DEFAULT_STATE.partners?.paragraphs || ['']);
                    const list = [...baseList];
                    list[idx] = e.target.value;
                    setForm((prev) => ({
                      ...prev,
                      partners: { ...prev.partners, paragraphs: list },
                    }));
                  }}
                />
                <button
                  type="button"
                  onClick={() => {
                    const baseList = form.partners?.paragraphs && form.partners.paragraphs.length > 0
                      ? form.partners.paragraphs
                      : (DEFAULT_STATE.partners?.paragraphs || ['']);
                    const list = baseList.filter((_, i) => i !== idx);
                    setForm((prev) => ({
                      ...prev,
                      partners: { ...prev.partners, paragraphs: list },
                    }));
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

      {/* 15. VISUAL DOCUMENTATION / GALLERY */}
      {activeTab === 'gallery' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label className="admin-label">Gallery Heading</label>
              <input
                type="text"
                className="admin-input"
                value={form.gallery?.title || ''}
                onChange={(e) => setForm((p) => ({ ...p, gallery: { ...p.gallery, title: e.target.value } }))}
                placeholder="Student Project Development Session"
              />
            </div>
            <div>
              <label className="admin-label">Gallery Subtitle / Description</label>
              <input
                type="text"
                className="admin-input"
                value={form.gallery?.subtitle || ''}
                onChange={(e) => setForm((p) => ({ ...p, gallery: { ...p.gallery, subtitle: e.target.value } }))}
                placeholder="Glimpses of practical learning, experimentation..."
              />
            </div>
          </div>

          <div>
            <label className="admin-label">Upload New Photo</label>
            <div style={{ maxWidth: '400px' }}>
              <ImageUploader
                folder="ti-dsp-gallery"
                onUploaded={handleAddGalleryPhoto}
              />
            </div>
          </div>

          {/* Uploaded Photos Grid */}
          <div>
            <h4 style={{ margin: '0 0 0.85rem', fontSize: '0.95rem', fontWeight: 800, color: '#0B1E42' }}>
              Current Gallery Photos ({form.gallery?.photos?.length || 0})
            </h4>

            {(form.gallery?.photos || []).length === 0 ? (
              <div style={{ padding: '2rem', background: '#F8FAFC', borderRadius: '10px', textAlign: 'center', color: '#64748B', border: '1px dashed #CBD5E1' }}>
                No gallery photos uploaded yet. Use the uploader above to add project session photos.
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '1rem' }}>
                {(form.gallery?.photos || []).map((photo, idx) => (
                  <div key={photo.id || idx} style={{ background: '#fff', border: '1px solid #E2E8F0', borderRadius: '10px', overflow: 'hidden', boxShadow: '0 2px 6px rgba(0,0,0,0.04)' }}>
                    <div style={{ height: '150px', overflow: 'hidden', background: '#f1f5f9' }}>
                      <img
                        src={photo.url || photo.imageUrl}
                        alt={photo.caption || `Photo ${idx + 1}`}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                    </div>
                    <div style={{ padding: '0.75rem' }}>
                      <input
                        type="text"
                        className="admin-input"
                        placeholder="Caption (optional)"
                        value={photo.caption || ''}
                        onChange={(e) => handleUpdateGalleryCaption(idx, e.target.value)}
                        style={{ fontSize: '0.8rem', marginBottom: '0.5rem' }}
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveGalleryPhoto(idx)}
                        className="admin-btn-danger"
                        style={{ width: '100%', fontSize: '0.75rem', padding: '0.35rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.25rem' }}
                      >
                        <Trash2 size={13} /> Delete Photo
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* 16. CUSTOM SECTIONS (KEPT EMPTY BY DEFAULT FOR NEW TOGGLES) */}
      {activeTab === 'custom-sections' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div style={{ background: '#F8FAFC', padding: '1rem', borderRadius: '8px', border: '1px solid #E2E8F0', marginBottom: '0.5rem' }}>
            <h4 style={{ margin: '0 0 0.35rem 0', fontSize: '0.95rem', fontWeight: 800, color: '#0B1E42' }}>
              Custom Sections (Kept Empty by Default)
            </h4>
            <p style={{ margin: 0, fontSize: '0.825rem', color: '#64748B' }}>
              Use this section only when a new dynamic accordion or intro toggle is required in the future.
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

      {/* Floating Bottom Save Bar */}
      <div style={{ marginTop: '2.5rem', paddingTop: '1.25rem', borderTop: '1px solid #E2E8F0', display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
        <button
          type="button"
          onClick={save}
          disabled={saving}
          className="admin-btn-primary"
          style={{ padding: '0.65rem 1.75rem', background: '#008080', borderColor: '#008080', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 800 }}
        >
          <Save size={16} /> {saving ? 'Saving...' : 'Save TI-DSP Content'}
        </button>
      </div>
    </div>
  );
}
