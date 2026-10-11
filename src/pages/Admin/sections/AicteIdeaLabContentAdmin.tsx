import { useEffect, useState } from 'react';
import { collection, doc, serverTimestamp } from 'firebase/firestore';
import { setDoc, addDoc, updateDoc, deleteDoc } from '../../../lib/auditLog';
import { db } from '../../../lib/firebase';
import { useDocument } from '../../../hooks/useDocument';
import { useOrderedCollection, type WithId } from '../../../hooks/useCollection';
import { useImageCropModal } from '../../../components/ImageUploader/useImageCropModal';
import { deleteFile, type UploadResult } from '../../../lib/storage';
import {
  aicteIdeaLab,
  type IdeaLabProcessStep,
  type IdeaLabPillar,
  type IdeaLabEquipmentItem,
} from '../../Differentiators/aicteIdeaLab.data';
import {
  Award,
  Lightbulb,
  Workflow,
  Compass,
  Users,
  GraduationCap,
  Building2,
  FileCheck,
  Plus,
  Trash2,
  Edit2,
  Save,
  RotateCcw,
  Sparkles,
  Layers,
  X,
  CheckCircle,
  Image as ImageIcon,
} from 'lucide-react';

import CustomSectionEditor from './CustomSectionEditor';
import { replaceAtPath, getAtPath, type CustomSection } from '../../../lib/customSections';

export interface CustomIdeaLabSection extends CustomSection {
  title?: string;
  badge?: string;
  paragraphs?: string[];
  bulletPoints?: string[];
}

function normalizeCustomSection(sec: any): CustomIdeaLabSection {
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

export interface AicteIdeaLabDoc {
  hero?: {
    category?: string;
    title?: string;
    tagline?: string;
    ctaPrimary?: string;
    ctaSecondary?: string;
  };
  telemetry?: { value: string; label: string }[];
  overview?: {
    title?: string;
    paragraphs?: string[];
  };
  process?: {
    title?: string;
    intro?: string;
    steps?: IdeaLabProcessStep[];
  };
  pillars?: IdeaLabPillar[];
  team?: {
    title?: string;
    intro?: string;
    contactNotice?: string;
  };
  ambassadors?: {
    title?: string;
    intro?: string;
    contactNotice?: string;
  };
  facilities?: {
    title?: string;
    paragraphs?: string[];
    defaultEquipment?: IdeaLabEquipmentItem[];
  };
  officialInfo?: {
    title?: string;
    aqisId?: string;
    institution?: string;
    headOfInstitution?: string;
    facultyCoordinators?: string[];
    email?: string;
  };
  cta?: {
    title?: string;
    description?: string;
    primaryBtn?: string;
    secondaryBtn?: string;
  };
  additionalSections?: CustomIdeaLabSection[];
}

export interface AicteIdeaLabTeamMemberDoc extends WithId {
  name: string;
  designation: string;
  role: string;
  order: number;
}

export interface AicteIdeaLabAmbassadorDoc extends WithId {
  regNumber: string;
  name: string;
  year: string;
  branch: string;
  email: string;
  order: number;
}

export interface AicteIdeaLabFacilityPhotoDoc extends WithId {
  imageUrl: string;
  storagePath: string;
  caption: string;
  category?: string;
  order: number;
}

const DEFAULT_STATE: AicteIdeaLabDoc = {
  telemetry: aicteIdeaLab.telemetry.map((t) => ({ ...t })),
  overview: {
    title: aicteIdeaLab.overview.title,
    paragraphs: [...aicteIdeaLab.overview.paragraphs],
  },
  process: {
    title: aicteIdeaLab.process.title,
    intro: aicteIdeaLab.process.intro,
    steps: aicteIdeaLab.process.steps.map((s) => ({ ...s })),
  },
  pillars: aicteIdeaLab.pillars.map((p) => ({ ...p })),
  team: { ...aicteIdeaLab.team },
  ambassadors: { ...aicteIdeaLab.ambassadors },
  facilities: {
    title: aicteIdeaLab.facilities.title,
    paragraphs: [...aicteIdeaLab.facilities.paragraphs],
    defaultEquipment: aicteIdeaLab.facilities.defaultEquipment.map((e) => ({ ...e })),
  },
  officialInfo: {
    title: aicteIdeaLab.officialInfo.title,
    aqisId: aicteIdeaLab.officialInfo.aqisId,
    institution: aicteIdeaLab.officialInfo.institution,
    headOfInstitution: aicteIdeaLab.officialInfo.headOfInstitution,
    facultyCoordinators: [...aicteIdeaLab.officialInfo.facultyCoordinators],
    email: aicteIdeaLab.officialInfo.email,
  },
  additionalSections: [],
};

const DEFAULT_TEAM = [
  { name: 'Dr. G. Srinivasa Rao', designation: 'Principal, SVECW', role: 'Chief Mentor', order: 1 },
  { name: 'Dr. P. Srinivasa Raju', designation: 'Vice Principal, SVECW', role: 'Coordinator', order: 2 },
  { name: 'Dr. S. Hanumantha Rao', designation: 'Professor, Dept. of ECE', role: 'Co-Coordinator', order: 3 },
  { name: 'Dr. T. Sudheer Kumar', designation: 'Professor, Dept. of ECE', role: 'Tech GURU', order: 4 },
  { name: 'Mr. B. Satya Krishna', designation: 'Asst. Professor, Dept. of ME', role: 'Tech GURU', order: 5 },
  { name: 'Mr. N. Kalyan Chakravarthy', designation: 'Technician', role: 'Lab GURU', order: 6 },
];

const DEFAULT_AMBASSADORS = [
  { regNumber: '21B01A54A6', name: 'T. Hanuma Priya', year: 'II', branch: 'AIDS', email: '21B01A54A6@svecw.edu.in', order: 1 },
  { regNumber: '21B01A6110', name: 'B. Haritha Priya Lakshmi Bala', year: 'II', branch: 'AIML', email: '21B01A6110@svecw.edu.in', order: 2 },
  { regNumber: '21B01A0125', name: 'K. Renu Priyanka', year: 'II', branch: 'CIVIL', email: '21B01A0125@svecw.edu.in', order: 3 },
  { regNumber: '21B01A0525', name: 'B. Naga Sai Eswari Sathvika', year: 'II', branch: 'CSE', email: '21B01A0525@svecw.edu.in', order: 4 },
  { regNumber: '21B01A0437', name: 'J. Tejaswini Sai Sindhu', year: 'II', branch: 'ECE', email: '21B01A0437@svecw.edu.in', order: 5 },
  { regNumber: '21B01A0488', name: 'R. Jahnavi', year: 'II', branch: 'ECE', email: '21B01A04A1@svecw.edu.in', order: 6 },
  { regNumber: '21B01A0211', name: 'G. T. S. Padmavathi', year: 'II', branch: 'EEE', email: '21B01A0211@svecw.edu.in', order: 7 },
  { regNumber: '21B01A0221', name: 'K. Pujitha', year: 'II', branch: 'EEE', email: '21B01A0221@svecw.edu.in', order: 8 },
  { regNumber: '21B01A0313', name: 'D. Yasaswini Naga Sai Sirisha', year: 'II', branch: 'ME', email: '21B01A0313@svecw.edu.in', order: 9 },
  { regNumber: '21B01A0314', name: 'D. H Pravallika Devi', year: 'II', branch: 'ME', email: '21B01A0314@svecw.edu.in', order: 10 },
];

function FacilityPhotoCardItem({
  photo,
  onReplacePhoto,
  onRemovePhoto,
}: {
  photo: AicteIdeaLabFacilityPhotoDoc;
  onReplacePhoto: (photo: AicteIdeaLabFacilityPhotoDoc, file: File) => void;
  onRemovePhoto: (photo: AicteIdeaLabFacilityPhotoDoc) => void;
}) {
  const [caption, setCaption] = useState(photo.caption || '');
  const [category, setCategory] = useState(photo.category || '');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setCaption(photo.caption || '');
    setCategory(photo.category || '');
  }, [photo.caption, photo.category]);

  const saveDetails = async () => {
    setSaving(true);
    try {
      await updateDoc(doc(db, 'aicteIdeaLabFacilityPhotos', photo.id), {
        caption,
        category,
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (e) {
      alert(`Couldn't update details: ${(e as Error).message}`);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={{ background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '8px', overflow: 'hidden', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
      <div style={{ position: 'relative' }}>
        <img loading="lazy" src={photo.imageUrl} alt={caption} style={{ width: '100%', height: '145px', objectFit: 'cover', display: 'block' }} />
        <label style={{ position: 'absolute', top: '0.35rem', right: '0.35rem', background: 'rgba(15, 23, 42, 0.85)', color: '#ffffff', padding: '0.25rem 0.5rem', borderRadius: '5px', fontSize: '0.72rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.3rem', fontWeight: 600, backdropFilter: 'blur(4px)', boxShadow: '0 2px 4px rgba(0,0,0,0.2)' }}>
          <Edit2 size={13} /> Edit Image
          <input
            type="file"
            accept="image/*"
            hidden
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) onReplacePhoto(photo, file);
              e.target.value = '';
            }}
          />
        </label>
      </div>

      <div style={{ padding: '0.65rem', display: 'flex', flexDirection: 'column', gap: '0.45rem', background: '#f8fafc', flex: 1 }}>
        <div>
          <label style={{ fontSize: '0.68rem', textTransform: 'uppercase', letterSpacing: '0.04em', color: '#64748b', fontWeight: 700, display: 'block', marginBottom: '0.2rem' }}>
            Category Badge (e.g. DIGITAL FABRICATION)
          </label>
          <input
            type="text"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            onBlur={saveDetails}
            placeholder="e.g. DIGITAL FABRICATION"
            className="admin-input"
            style={{ fontSize: '0.78rem', padding: '0.3rem 0.45rem' }}
          />
        </div>

        <div>
          <label style={{ fontSize: '0.68rem', textTransform: 'uppercase', letterSpacing: '0.04em', color: '#64748b', fontWeight: 700, display: 'block', marginBottom: '0.2rem' }}>
            Equipment Name / Title
          </label>
          <input
            type="text"
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            onBlur={saveDetails}
            placeholder="e.g. 3D Printers & Additive Manufacturing"
            className="admin-input"
            style={{ fontSize: '0.8rem', fontWeight: 600, padding: '0.3rem 0.45rem' }}
          />
        </div>

        <div style={{ display: 'flex', gap: '0.4rem', marginTop: '0.2rem', paddingTop: '0.35rem', borderTop: '1px solid #e2e8f0' }}>
          <button
            type="button"
            onClick={saveDetails}
            disabled={saving}
            className="admin-btn admin-btn--sm admin-btn--primary"
            style={{ flex: 1, padding: '0.25rem 0.4rem', fontSize: '0.72rem', justifyContent: 'center' }}
          >
            <Save size={12} /> {saving ? 'Saving...' : saved ? 'Saved!' : 'Save Text'}
          </button>
          <button
            type="button"
            onClick={() => onRemovePhoto(photo)}
            className="admin-btn admin-btn--sm admin-btn--ghost"
            style={{ color: '#dc2626', padding: '0.25rem 0.4rem', fontSize: '0.72rem' }}
            title="Remove Photo"
          >
            <Trash2 size={13} />
          </button>
        </div>
      </div>
    </div>
  );
}

export default function AicteIdeaLabContentAdmin() {
  const { data, loading } = useDocument<AicteIdeaLabDoc>('settings', 'aicteIdeaLab');
  const [form, setForm] = useState<AicteIdeaLabDoc>(DEFAULT_STATE);
  const [hasInitialized, setHasInitialized] = useState(false);
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Collections for inline team, ambassadors & photo gallery
  const { docs: teamMembers } = useOrderedCollection<AicteIdeaLabTeamMemberDoc>('aicteIdeaLabTeam', 'order');
  const { docs: ambassadorMembers } = useOrderedCollection<AicteIdeaLabAmbassadorDoc>('aicteIdeaLabAmbassadors', 'order');
  const { docs: facilityPhotos } = useOrderedCollection<AicteIdeaLabFacilityPhotoDoc>('aicteIdeaLabFacilityPhotos', 'order');

  // Image Cropper for Facility Photos
  const { openCrop, cropModal } = useImageCropModal(4 / 3);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);

  // Inline forms state
  const [teamForm, setTeamForm] = useState({ name: '', designation: '', role: '', order: 0 });
  const [editingTeamId, setEditingTeamId] = useState<string | null>(null);
  const [isAddingTeam, setIsAddingTeam] = useState(false);

  const [ambassadorForm, setAmbassadorForm] = useState({ regNumber: '', name: '', year: '', branch: '', email: '', order: 0 });
  const [editingAmbassadorId, setEditingAmbassadorId] = useState<string | null>(null);
  const [isAddingAmbassador, setIsAddingAmbassador] = useState(false);

  useEffect(() => {
    if (!loading && !hasInitialized) {
      if (data) {
        setForm({
          telemetry: data.telemetry && data.telemetry.length > 0 ? data.telemetry : DEFAULT_STATE.telemetry,
          overview: {
            title: data.overview?.title || DEFAULT_STATE.overview?.title || '',
            paragraphs: data.overview?.paragraphs && data.overview.paragraphs.length > 0
              ? data.overview.paragraphs
              : DEFAULT_STATE.overview?.paragraphs || [],
          },
          process: {
            title: data.process?.title || DEFAULT_STATE.process?.title || '',
            intro: data.process?.intro || DEFAULT_STATE.process?.intro || '',
            steps: data.process?.steps && data.process.steps.length > 0
              ? data.process.steps
              : DEFAULT_STATE.process?.steps || [],
          },
          pillars: data.pillars && data.pillars.length > 0 ? data.pillars : DEFAULT_STATE.pillars,
          team: { ...DEFAULT_STATE.team, ...data.team },
          ambassadors: { ...DEFAULT_STATE.ambassadors, ...data.ambassadors },
          facilities: {
            title: data.facilities?.title || DEFAULT_STATE.facilities?.title || '',
            paragraphs: data.facilities?.paragraphs && data.facilities.paragraphs.length > 0
              ? data.facilities.paragraphs
              : DEFAULT_STATE.facilities?.paragraphs || [],
            defaultEquipment: data.facilities?.defaultEquipment && data.facilities.defaultEquipment.length > 0
              ? data.facilities.defaultEquipment
              : DEFAULT_STATE.facilities?.defaultEquipment || [],
          },
          officialInfo: {
            title: data.officialInfo?.title || DEFAULT_STATE.officialInfo?.title || '',
            aqisId: data.officialInfo?.aqisId || DEFAULT_STATE.officialInfo?.aqisId || '',
            institution: data.officialInfo?.institution || DEFAULT_STATE.officialInfo?.institution || '',
            headOfInstitution: data.officialInfo?.headOfInstitution || DEFAULT_STATE.officialInfo?.headOfInstitution || '',
            facultyCoordinators: data.officialInfo?.facultyCoordinators || DEFAULT_STATE.officialInfo?.facultyCoordinators || [],
            email: data.officialInfo?.email || DEFAULT_STATE.officialInfo?.email || '',
          },
          additionalSections: (data.additionalSections || []).map(normalizeCustomSection),
        });
      }
      setHasInitialized(true);
    }
  }, [data, loading, hasInitialized]);

  const saveMainDoc = async () => {
    setSaving(true);
    try {
      const formattedSections = (form.additionalSections || []).map((sec) => ({
        ...sec,
        title: sec.label || sec.title || 'Navigation Section',
        badge: sec.subtitle || sec.badge || '',
        paragraphs: sec.textContent ? sec.textContent.split('\n').filter(Boolean) : (sec.paragraphs || []),
        bulletPoints: sec.listText ? sec.listText.split('\n').filter(Boolean) : (sec.bulletPoints || []),
      }));

      await setDoc(doc(db, 'settings', 'aicteIdeaLab'), {
        ...form,
        additionalSections: formattedSections,
        updatedAt: serverTimestamp(),
      }, { merge: true });
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch (e) {
      alert(`Couldn't save: ${(e as Error).message}`);
    } finally {
      setSaving(false);
    }
  };

  const resetToDefaults = () => {
    if (confirm('Reset all AICTE IDEA Lab copy to starting defaults?')) {
      setForm(DEFAULT_STATE);
    }
  };

  // --- 1. TELEMETRY STATS HELPERS ---
  const updateTelemetry = (idx: number, field: 'value' | 'label', val: string) => {
    const list = [...(form.telemetry || [])];
    if (list[idx]) {
      list[idx] = { ...list[idx], [field]: val };
      setForm((p) => ({ ...p, telemetry: list }));
    }
  };

  const addTelemetryItem = () => {
    setForm((p) => ({
      ...p,
      telemetry: [...(p.telemetry || []), { value: 'New Stat', label: 'Stat Description' }],
    }));
  };

  const removeTelemetryItem = (idx: number) => {
    setForm((p) => ({
      ...p,
      telemetry: (p.telemetry || []).filter((_, i) => i !== idx),
    }));
  };

  // --- 2. PROCESS STEP HELPERS ---
  const updateProcessStep = (idx: number, field: keyof IdeaLabProcessStep, val: string) => {
    const steps = [...(form.process?.steps || [])];
    if (steps[idx]) {
      steps[idx] = { ...steps[idx], [field]: val };
      setForm((p) => ({ ...p, process: { ...p.process, steps } }));
    }
  };

  const addProcessStep = () => {
    const count = (form.process?.steps || []).length + 1;
    const num = count < 10 ? `0${count}` : `${count}`;
    setForm((p) => ({
      ...p,
      process: {
        ...p.process,
        steps: [
          ...(p.process?.steps || []),
          { number: num, title: 'New Step', description: 'Step description...' },
        ],
      },
    }));
  };

  const removeProcessStep = (idx: number) => {
    setForm((p) => ({
      ...p,
      process: {
        ...p.process,
        steps: (p.process?.steps || []).filter((_, i) => i !== idx),
      },
    }));
  };

  // --- 3. PILLARS HELPERS ---
  const updatePillar = (idx: number, field: keyof IdeaLabPillar, val: string) => {
    const pillars = [...(form.pillars || [])];
    if (pillars[idx]) {
      pillars[idx] = { ...pillars[idx], [field]: val };
      setForm((p) => ({ ...p, pillars }));
    }
  };

  const addPillar = () => {
    const count = (form.pillars || []).length + 1;
    const num = count < 10 ? `0${count}` : `${count}`;
    setForm((p) => ({
      ...p,
      pillars: [
        ...(p.pillars || []),
        { number: num, title: 'New Academic Pillar', description: 'Pillar description...' },
      ],
    }));
  };

  const removePillar = (idx: number) => {
    setForm((p) => ({
      ...p,
      pillars: (p.pillars || []).filter((_, i) => i !== idx),
    }));
  };

  // --- 4. TEAM MEMBERS CRUD ---
  const handleSaveTeam = async () => {
    if (!teamForm.name || !teamForm.designation || !teamForm.role) return alert('Name, designation, and role are required.');
    try {
      if (editingTeamId) {
        await updateDoc(doc(db, 'aicteIdeaLabTeam', editingTeamId), { ...teamForm });
      } else {
        await addDoc(collection(db, 'aicteIdeaLabTeam'), {
          ...teamForm,
          order: teamForm.order || teamMembers.length + 1,
          createdAt: serverTimestamp(),
        });
      }
      setTeamForm({ name: '', designation: '', role: '', order: 0 });
      setEditingTeamId(null);
      setIsAddingTeam(false);
    } catch (e) {
      alert(`Couldn't save member: ${(e as Error).message}`);
    }
  };

  const handleDeleteTeam = async (id: string) => {
    if (!confirm('Delete this team member?')) return;
    try {
      await deleteDoc(doc(db, 'aicteIdeaLabTeam', id));
    } catch (e) {
      alert(`Couldn't delete: ${(e as Error).message}`);
    }
  };

  const seedTeam = async () => {
    if (!confirm('Add starter SVECW AICTE IDEA LAB team members?')) return;
    try {
      for (const m of DEFAULT_TEAM) {
        await addDoc(collection(db, 'aicteIdeaLabTeam'), { ...m, createdAt: serverTimestamp() });
      }
    } catch (e) {
      alert(`Couldn't add starter team: ${(e as Error).message}`);
    }
  };

  // --- 5. AMBASSADORS CRUD ---
  const handleSaveAmbassador = async () => {
    if (!ambassadorForm.regNumber || !ambassadorForm.name) return alert('Reg. number and name are required.');
    try {
      if (editingAmbassadorId) {
        await updateDoc(doc(db, 'aicteIdeaLabAmbassadors', editingAmbassadorId), { ...ambassadorForm });
      } else {
        await addDoc(collection(db, 'aicteIdeaLabAmbassadors'), {
          ...ambassadorForm,
          order: ambassadorForm.order || ambassadorMembers.length + 1,
          createdAt: serverTimestamp(),
        });
      }
      setAmbassadorForm({ regNumber: '', name: '', year: '', branch: '', email: '', order: 0 });
      setEditingAmbassadorId(null);
      setIsAddingAmbassador(false);
    } catch (e) {
      alert(`Couldn't save ambassador: ${(e as Error).message}`);
    }
  };

  const handleDeleteAmbassador = async (id: string) => {
    if (!confirm('Delete this student ambassador?')) return;
    try {
      await deleteDoc(doc(db, 'aicteIdeaLabAmbassadors', id));
    } catch (e) {
      alert(`Couldn't delete: ${(e as Error).message}`);
    }
  };

  const seedAmbassadors = async () => {
    if (!confirm('Add starter set of student ambassadors?')) return;
    try {
      for (const a of DEFAULT_AMBASSADORS) {
        await addDoc(collection(db, 'aicteIdeaLabAmbassadors'), { ...a, createdAt: serverTimestamp() });
      }
    } catch (e) {
      alert(`Couldn't add starter ambassadors: ${(e as Error).message}`);
    }
  };

  // --- 6. FACILITY PHOTOS CRUD ---
  const addFacilityPhoto = (file: File) => {
    setUploadingPhoto(true);
    openCrop(file, 'vwu/aicte-idea-lab-facilities', async (result: UploadResult) => {
      try {
        await addDoc(collection(db, 'aicteIdeaLabFacilityPhotos'), {
          imageUrl: result.url,
          storagePath: result.path,
          caption: '3D Printers & Additive Manufacturing',
          category: 'DIGITAL FABRICATION',
          order: facilityPhotos.length + 1,
          createdAt: serverTimestamp(),
        });
      } catch (e) {
        alert(`Couldn't upload photo: ${(e as Error).message}`);
      } finally {
        setUploadingPhoto(false);
      }
    });
  };

  const replaceFacilityPhoto = (photo: AicteIdeaLabFacilityPhotoDoc, file: File) => {
    setUploadingPhoto(true);
    openCrop(file, 'vwu/aicte-idea-lab-facilities', async (result: UploadResult) => {
      try {
        if (photo.storagePath) {
          try { await deleteFile(photo.storagePath); } catch {}
        }
        await updateDoc(doc(db, 'aicteIdeaLabFacilityPhotos', photo.id), {
          imageUrl: result.url,
          storagePath: result.path,
        });
      } catch (e) {
        alert(`Couldn't update photo image: ${(e as Error).message}`);
      } finally {
        setUploadingPhoto(false);
      }
    });
  };

  const removeFacilityPhoto = async (photo: AicteIdeaLabFacilityPhotoDoc) => {
    if (!confirm('Remove this photo?')) return;
    try {
      await deleteDoc(doc(db, 'aicteIdeaLabFacilityPhotos', photo.id));
      if (photo.storagePath) await deleteFile(photo.storagePath);
    } catch (e) {
      alert(`Couldn't remove photo: ${(e as Error).message}`);
    }
  };

  // --- 8. CUSTOM ADDITIONAL SECTIONS HELPERS ---
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
    return <p className="admin-loading">Loading AICTE IDEA Lab Page Editor…</p>;
  }

  return (
    <div className="admin-section">
      <div className="admin-card">
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '1.25rem', borderBottom: '1px solid #e5e7eb', paddingBottom: '1rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Lightbulb size={22} color="#c8a03c" />
              <h2 className="admin-card__title" style={{ margin: 0, padding: 0, border: 'none' }}>
                AICTE IDEA Lab Page Management
              </h2>
            </div>
            <p className="admin-field__hint" style={{ margin: '0.35rem 0 0', fontSize: '0.85rem' }}>
              Manage all content, team rosters, student ambassadors, and facility equipment photos in the <strong>exact top-to-bottom order</strong> as displayed on the live public website.
            </p>
          </div>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button type="button" onClick={resetToDefaults} className="admin-btn admin-btn--sm admin-btn--ghost">
              <RotateCcw size={14} /> Reset Defaults
            </button>
            <button type="button" onClick={saveMainDoc} disabled={saving} className="admin-btn admin-btn--sm admin-btn--primary">
              <Save size={14} /> {saving ? 'Saving...' : 'Save All Changes'}
            </button>
          </div>
        </div>

        {savedSuccess && (
          <div style={{ background: '#ecfdf5', border: '1px solid #a7f3d0', padding: '0.75rem 1rem', borderRadius: '8px', color: '#065f46', fontSize: '0.85rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <CheckCircle size={16} /> Saved and published live to AICTE IDEA Lab page!
          </div>
        )}

        {/* Top Jump Bar (Exact Public Page Top-to-Bottom Order) */}
        <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '0.65rem 1rem', marginBottom: '1.75rem', display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap', fontSize: '0.82rem' }}>
          <strong style={{ color: '#475569', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <Layers size={14} /> Jump to Section (Public Page Order):
          </strong>
          <a href="#sec-telemetry" style={{ color: '#0284c7', textDecoration: 'none', fontWeight: 600 }}>1. Telemetry Stats Banner</a> •
          <a href="#sec-overview" style={{ color: '#0284c7', textDecoration: 'none', fontWeight: 600 }}>2. From Idea to Prototype</a> •
          <a href="#sec-vision" style={{ color: '#0284c7', textDecoration: 'none', fontWeight: 600 }}>3. Vision &amp; Academic Pillars</a> •
          <a href="#sec-team" style={{ color: '#0284c7', textDecoration: 'none', fontWeight: 600 }}>4. Leadership &amp; Mentorship Roster</a> •
          <a href="#sec-ambassadors" style={{ color: '#0284c7', textDecoration: 'none', fontWeight: 600 }}>5. Student Ambassadors</a> •
          <a href="#sec-facilities" style={{ color: '#0284c7', textDecoration: 'none', fontWeight: 600 }}>6. Facilities &amp; Equipment Photos</a> •
          <a href="#sec-official" style={{ color: '#0284c7', textDecoration: 'none', fontWeight: 600 }}>7. Official Roster &amp; Registry</a> •
          <a href="#sec-custom" style={{ color: '#0284c7', textDecoration: 'none', fontWeight: 600 }}>8. Additional Navigation Sections</a>
        </div>

        {/* SECTION 1: TELEMETRY BADGES BANNER */}
        <div id="sec-telemetry" style={{ background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '10px', padding: '1.25rem', marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem', marginBottom: '0.75rem', borderBottom: '2px solid #e2e8f0', paddingBottom: '0.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Award size={18} color="#0284c7" />
              <h3 style={{ margin: 0, fontSize: '1.05rem', color: '#0f172a' }}>1. Telemetry Badges Banner ({form.telemetry?.length || 0})</h3>
            </div>
            <button type="button" onClick={addTelemetryItem} className="admin-btn admin-btn--sm admin-btn--primary">
              <Plus size={14} /> Add Stat Badge
            </button>
          </div>
          <p className="admin-field__hint" style={{ marginBottom: '1rem' }}>
            These 4 key metrics display prominently at the top of the AICTE IDEA Lab page.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '0.75rem' }}>
            {(form.telemetry || []).map((stat, idx) => (
              <div key={idx} style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '0.75rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                  <strong style={{ fontSize: '0.82rem', color: '#0369a1' }}>Stat #{idx + 1}</strong>
                  <button type="button" onClick={() => removeTelemetryItem(idx)} style={{ background: 'none', border: 'none', color: '#dc2626', cursor: 'pointer', padding: '0.2rem' }}>
                    <Trash2 size={14} />
                  </button>
                </div>
                <div className="admin-field" style={{ marginBottom: '0.4rem' }}>
                  <label style={{ fontSize: '0.75rem' }}>Stat Value (e.g. ₹1.13 Cr)</label>
                  <input
                    type="text"
                    value={stat.value}
                    onChange={(e) => updateTelemetry(idx, 'value', e.target.value)}
                    className="admin-input"
                    style={{ fontWeight: 700 }}
                  />
                </div>
                <div className="admin-field">
                  <label style={{ fontSize: '0.75rem' }}>Stat Label (e.g. Total Project Outlay)</label>
                  <input
                    type="text"
                    value={stat.label}
                    onChange={(e) => updateTelemetry(idx, 'label', e.target.value)}
                    className="admin-input"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* SECTION 2: FROM IDEA TO PROTOTYPE & INNOVATION PROCESS */}
        <div id="sec-overview" style={{ background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '10px', padding: '1.25rem', marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem', borderBottom: '2px solid #e2e8f0', paddingBottom: '0.5rem' }}>
            <Workflow size={18} color="#0284c7" />
            <h3 style={{ margin: 0, fontSize: '1.05rem', color: '#0f172a' }}>2. From Idea to Prototype &amp; Innovation Process (Tab 1)</h3>
          </div>

          <div className="admin-form-grid" style={{ marginBottom: '1.25rem' }}>
            <div className="admin-field" style={{ gridColumn: '1 / -1' }}>
              <label style={{ fontWeight: 600 }}>Tab Title</label>
              <input
                type="text"
                value={form.overview?.title || ''}
                onChange={(e) => setForm((p) => ({ ...p, overview: { ...p.overview, title: e.target.value } }))}
                className="admin-input"
                placeholder="From Idea to Prototype"
              />
            </div>
            <div className="admin-field" style={{ gridColumn: '1 / -1' }}>
              <label style={{ fontWeight: 600 }}>Overview Paragraphs (One per line; use **text** for bold)</label>
              <textarea
                value={(form.overview?.paragraphs || []).join('\n')}
                onChange={(e) => setForm((p) => ({ ...p, overview: { ...p.overview, paragraphs: e.target.value.split('\n') } }))}
                className="admin-input"
                rows={4}
                style={{ width: '100%', fontFamily: 'inherit' }}
              />
            </div>
          </div>

          {/* Process Section Sub-Card */}
          <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
              <div style={{ fontWeight: 700, fontSize: '0.92rem', color: '#0369a1', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <Sparkles size={16} /> Innovation Process Cards ({form.process?.steps?.length || 0})
              </div>
              <button type="button" onClick={addProcessStep} className="admin-btn admin-btn--sm admin-btn--ghost">
                <Plus size={13} /> Add Process Step
              </button>
            </div>

            <div className="admin-form-grid" style={{ marginBottom: '1rem' }}>
              <div className="admin-field">
                <label style={{ fontSize: '0.78rem', fontWeight: 600 }}>Process Subtitle / Title</label>
                <input
                  type="text"
                  value={form.process?.title || ''}
                  onChange={(e) => setForm((p) => ({ ...p, process: { ...p.process, title: e.target.value } }))}
                  className="admin-input"
                  placeholder="Learn. Build. Test. Improve."
                />
              </div>
              <div className="admin-field">
                <label style={{ fontSize: '0.78rem', fontWeight: 600 }}>Process Intro Text</label>
                <input
                  type="text"
                  value={form.process?.intro || ''}
                  onChange={(e) => setForm((p) => ({ ...p, process: { ...p.process, intro: e.target.value } }))}
                  className="admin-input"
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '0.75rem' }}>
              {(form.process?.steps || []).map((step, idx) => (
                <div key={idx} style={{ background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '6px', padding: '0.65rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                    <span style={{ fontSize: '0.72rem', fontWeight: 800, background: '#fef3c7', color: '#b45309', padding: '0.1rem 0.35rem', borderRadius: '4px' }}>
                      Step #{step.number}
                    </span>
                    <button type="button" onClick={() => removeProcessStep(idx)} style={{ background: 'none', border: 'none', color: '#dc2626', cursor: 'pointer', padding: '0.15rem' }}>
                      <Trash2 size={13} />
                    </button>
                  </div>
                  <input
                    type="text"
                    value={step.title}
                    onChange={(e) => updateProcessStep(idx, 'title', e.target.value)}
                    className="admin-input"
                    style={{ fontSize: '0.82rem', fontWeight: 700, marginBottom: '0.35rem' }}
                    placeholder="Step Title"
                  />
                  <textarea
                    value={step.description}
                    onChange={(e) => updateProcessStep(idx, 'description', e.target.value)}
                    className="admin-input"
                    rows={2}
                    style={{ fontSize: '0.78rem', fontFamily: 'inherit' }}
                    placeholder="Step description..."
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* SECTION 3: VISION & ACADEMIC PILLARS */}
        <div id="sec-vision" style={{ background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '10px', padding: '1.25rem', marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem', marginBottom: '0.75rem', borderBottom: '2px solid #e2e8f0', paddingBottom: '0.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Compass size={18} color="#0284c7" />
              <h3 style={{ margin: 0, fontSize: '1.05rem', color: '#0f172a' }}>3. Vision &amp; Academic Pillars (Tab 2)</h3>
            </div>
            <button type="button" onClick={addPillar} className="admin-btn admin-btn--sm admin-btn--primary">
              <Plus size={14} /> Add Academic Pillar
            </button>
          </div>
          <p className="admin-field__hint" style={{ marginBottom: '1rem' }}>
            These pillar cards form the Vision &amp; Philosophy framework.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '0.75rem' }}>
            {(form.pillars || []).map((pillar, idx) => (
              <div key={idx} style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '0.75rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                  <span style={{ fontSize: '0.72rem', fontWeight: 800, background: '#e0f2fe', color: '#0369a1', padding: '0.1rem 0.35rem', borderRadius: '4px' }}>
                    Pillar #{pillar.number}
                  </span>
                  <button type="button" onClick={() => removePillar(idx)} style={{ background: 'none', border: 'none', color: '#dc2626', cursor: 'pointer', padding: '0.15rem' }}>
                    <Trash2 size={13} />
                  </button>
                </div>
                <input
                  type="text"
                  value={pillar.title}
                  onChange={(e) => updatePillar(idx, 'title', e.target.value)}
                  className="admin-input"
                  style={{ fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.35rem' }}
                  placeholder="Pillar Title"
                />
                <textarea
                  value={pillar.description}
                  onChange={(e) => updatePillar(idx, 'description', e.target.value)}
                  className="admin-input"
                  rows={3}
                  style={{ fontSize: '0.78rem', fontFamily: 'inherit' }}
                  placeholder="Pillar description..."
                />
              </div>
            ))}
          </div>
        </div>

        {/* SECTION 4: LEADERSHIP & MENTORSHIP (TEAM ROSTER) */}
        <div id="sec-team" style={{ background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '10px', padding: '1.25rem', marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem', marginBottom: '0.75rem', borderBottom: '2px solid #e2e8f0', paddingBottom: '0.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Users size={18} color="#0284c7" />
              <h3 style={{ margin: 0, fontSize: '1.05rem', color: '#0f172a' }}>4. Leadership &amp; Mentorship — Faculty Team (Tab 3)</h3>
            </div>
            <div style={{ display: 'flex', gap: '0.4rem' }}>
              {teamMembers.length === 0 && (
                <button type="button" onClick={seedTeam} className="admin-btn admin-btn--sm admin-btn--ghost">
                  Seed Starter Team
                </button>
              )}
              <button type="button" onClick={() => setIsAddingTeam(true)} className="admin-btn admin-btn--sm admin-btn--primary">
                <Plus size={14} /> Add Faculty Member
              </button>
            </div>
          </div>

          <div className="admin-form-grid" style={{ marginBottom: '1.25rem' }}>
            <div className="admin-field">
              <label style={{ fontWeight: 600 }}>Section Title</label>
              <input
                type="text"
                value={form.team?.title || ''}
                onChange={(e) => setForm((p) => ({ ...p, team: { ...p.team, title: e.target.value } }))}
                className="admin-input"
                placeholder="People Behind the IDEA Lab"
              />
            </div>
            <div className="admin-field" style={{ gridColumn: '1 / -1' }}>
              <label style={{ fontWeight: 600 }}>Introductory Text</label>
              <textarea
                value={form.team?.intro || ''}
                onChange={(e) => setForm((p) => ({ ...p, team: { ...p.team, intro: e.target.value } }))}
                className="admin-input"
                rows={2}
                style={{ width: '100%', fontFamily: 'inherit' }}
              />
            </div>
          </div>

          {/* Add / Edit Team Member Form Modal */}
          {(isAddingTeam || editingTeamId) && (
            <div style={{ background: '#f0f9ff', border: '1px solid #bae6fd', borderRadius: '8px', padding: '0.75rem', marginBottom: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <strong style={{ fontSize: '0.85rem', color: '#0369a1' }}>
                  {editingTeamId ? 'Edit Team Member' : 'New Faculty Team Member'}
                </strong>
                <button type="button" onClick={() => { setIsAddingTeam(false); setEditingTeamId(null); }} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}>
                  <X size={16} />
                </button>
              </div>
              <div className="admin-form-grid">
                <div className="admin-field">
                  <label>Faculty Name *</label>
                  <input
                    type="text"
                    value={teamForm.name}
                    onChange={(e) => setTeamForm((p) => ({ ...p, name: e.target.value }))}
                    placeholder="Dr. G. Srinivasa Rao"
                    className="admin-input"
                  />
                </div>
                <div className="admin-field">
                  <label>Designation *</label>
                  <input
                    type="text"
                    value={teamForm.designation}
                    onChange={(e) => setTeamForm((p) => ({ ...p, designation: e.target.value }))}
                    placeholder="Principal, SVECW"
                    className="admin-input"
                  />
                </div>
                <div className="admin-field">
                  <label>Role * (e.g. Chief Mentor, Tech GURU)</label>
                  <input
                    type="text"
                    value={teamForm.role}
                    onChange={(e) => setTeamForm((p) => ({ ...p, role: e.target.value }))}
                    placeholder="Chief Mentor"
                    className="admin-input"
                  />
                </div>
                <div className="admin-field">
                  <label>Display Order</label>
                  <input
                    type="number"
                    value={teamForm.order}
                    onChange={(e) => setTeamForm((p) => ({ ...p, order: +e.target.value }))}
                    className="admin-input"
                  />
                </div>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
                <button type="button" onClick={() => { setIsAddingTeam(false); setEditingTeamId(null); }} className="admin-btn admin-btn--sm admin-btn--ghost">Cancel</button>
                <button type="button" onClick={handleSaveTeam} className="admin-btn admin-btn--sm admin-btn--primary">
                  <Save size={13} /> {editingTeamId ? 'Update Member' : 'Add Member'}
                </button>
              </div>
            </div>
          )}

          {/* Team Roster Table */}
          <div className="admin-table-wrap" style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '0.5rem' }}>
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Order</th>
                  <th>Faculty Name</th>
                  <th>Designation</th>
                  <th>Role</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {teamMembers.map((m) => (
                  <tr key={m.id}>
                    <td>#{m.order}</td>
                    <td style={{ fontWeight: 600 }}>{m.name}</td>
                    <td>{m.designation}</td>
                    <td>
                      <span style={{ fontSize: '0.72rem', background: '#fef3c7', color: '#b45309', fontWeight: 700, padding: '0.1rem 0.4rem', borderRadius: '4px' }}>
                        {m.role}
                      </span>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <button
                        type="button"
                        onClick={() => {
                          setEditingTeamId(m.id);
                          setTeamForm({ name: m.name, designation: m.designation, role: m.role, order: m.order });
                        }}
                        className="admin-btn admin-btn--sm admin-btn--ghost"
                        style={{ padding: '0.2rem 0.35rem' }}
                      >
                        <Edit2 size={13} />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteTeam(m.id)}
                        className="admin-btn admin-btn--sm admin-btn--ghost"
                        style={{ padding: '0.2rem 0.35rem', color: '#dc2626' }}
                      >
                        <Trash2 size={13} />
                      </button>
                    </td>
                  </tr>
                ))}
                {teamMembers.length === 0 && (
                  <tr>
                    <td colSpan={5} style={{ fontStyle: 'italic', color: '#64748b', textAlign: 'center', padding: '1rem' }}>
                      No team members listed yet. Click "Add Faculty Member" above.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* SECTION 5: STUDENT AMBASSADORS */}
        <div id="sec-ambassadors" style={{ background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '10px', padding: '1.25rem', marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem', marginBottom: '0.75rem', borderBottom: '2px solid #e2e8f0', paddingBottom: '0.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <GraduationCap size={18} color="#0284c7" />
              <h3 style={{ margin: 0, fontSize: '1.05rem', color: '#0f172a' }}>5. Student Leadership &amp; Ambassadors (Tab 4)</h3>
            </div>
            <div style={{ display: 'flex', gap: '0.4rem' }}>
              {ambassadorMembers.length === 0 && (
                <button type="button" onClick={seedAmbassadors} className="admin-btn admin-btn--sm admin-btn--ghost">
                  Seed Starter Ambassadors
                </button>
              )}
              <button type="button" onClick={() => setIsAddingAmbassador(true)} className="admin-btn admin-btn--sm admin-btn--primary">
                <Plus size={14} /> Add Ambassador
              </button>
            </div>
          </div>

          <div className="admin-form-grid" style={{ marginBottom: '1.25rem' }}>
            <div className="admin-field">
              <label style={{ fontWeight: 600 }}>Section Title</label>
              <input
                type="text"
                value={form.ambassadors?.title || ''}
                onChange={(e) => setForm((p) => ({ ...p, ambassadors: { ...p.ambassadors, title: e.target.value } }))}
                className="admin-input"
                placeholder="Student Ambassadors"
              />
            </div>
            <div className="admin-field">
              <label style={{ fontWeight: 600 }}>Notice / Contact Note</label>
              <input
                type="text"
                value={form.ambassadors?.contactNotice || ''}
                onChange={(e) => setForm((p) => ({ ...p, ambassadors: { ...p.ambassadors, contactNotice: e.target.value } }))}
                className="admin-input"
              />
            </div>
            <div className="admin-field" style={{ gridColumn: '1 / -1' }}>
              <label style={{ fontWeight: 600 }}>Introductory Text</label>
              <textarea
                value={form.ambassadors?.intro || ''}
                onChange={(e) => setForm((p) => ({ ...p, ambassadors: { ...p.ambassadors, intro: e.target.value } }))}
                className="admin-input"
                rows={2}
                style={{ width: '100%', fontFamily: 'inherit' }}
              />
            </div>
          </div>

          {/* Add / Edit Ambassador Form Modal */}
          {(isAddingAmbassador || editingAmbassadorId) && (
            <div style={{ background: '#f0f9ff', border: '1px solid #bae6fd', borderRadius: '8px', padding: '0.75rem', marginBottom: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <strong style={{ fontSize: '0.85rem', color: '#0369a1' }}>
                  {editingAmbassadorId ? 'Edit Student Ambassador' : 'New Student Ambassador'}
                </strong>
                <button type="button" onClick={() => { setIsAddingAmbassador(false); setEditingAmbassadorId(null); }} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}>
                  <X size={16} />
                </button>
              </div>
              <div className="admin-form-grid">
                <div className="admin-field">
                  <label>Reg. Number *</label>
                  <input
                    type="text"
                    value={ambassadorForm.regNumber}
                    onChange={(e) => setAmbassadorForm((p) => ({ ...p, regNumber: e.target.value.toUpperCase() }))}
                    placeholder="21B01A54A6"
                    className="admin-input"
                  />
                </div>
                <div className="admin-field">
                  <label>Student Name *</label>
                  <input
                    type="text"
                    value={ambassadorForm.name}
                    onChange={(e) => setAmbassadorForm((p) => ({ ...p, name: e.target.value }))}
                    placeholder="T. Hanuma Priya"
                    className="admin-input"
                  />
                </div>
                <div className="admin-field">
                  <label>Year (e.g. II)</label>
                  <input
                    type="text"
                    value={ambassadorForm.year}
                    onChange={(e) => setAmbassadorForm((p) => ({ ...p, year: e.target.value }))}
                    placeholder="II"
                    className="admin-input"
                  />
                </div>
                <div className="admin-field">
                  <label>Branch (e.g. AIDS, ECE)</label>
                  <input
                    type="text"
                    value={ambassadorForm.branch}
                    onChange={(e) => setAmbassadorForm((p) => ({ ...p, branch: e.target.value.toUpperCase() }))}
                    placeholder="AIDS"
                    className="admin-input"
                  />
                </div>
                <div className="admin-field">
                  <label>Student Email</label>
                  <input
                    type="text"
                    value={ambassadorForm.email}
                    onChange={(e) => setAmbassadorForm((p) => ({ ...p, email: e.target.value }))}
                    placeholder="21B01A54A6@svecw.edu.in"
                    className="admin-input"
                  />
                </div>
                <div className="admin-field">
                  <label>Display Order</label>
                  <input
                    type="number"
                    value={ambassadorForm.order}
                    onChange={(e) => setAmbassadorForm((p) => ({ ...p, order: +e.target.value }))}
                    className="admin-input"
                  />
                </div>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
                <button type="button" onClick={() => { setIsAddingAmbassador(false); setEditingAmbassadorId(null); }} className="admin-btn admin-btn--sm admin-btn--ghost">Cancel</button>
                <button type="button" onClick={handleSaveAmbassador} className="admin-btn admin-btn--sm admin-btn--primary">
                  <Save size={13} /> {editingAmbassadorId ? 'Update Ambassador' : 'Add Ambassador'}
                </button>
              </div>
            </div>
          )}

          {/* Ambassadors Table */}
          <div className="admin-table-wrap" style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '0.5rem' }}>
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Order</th>
                  <th>Reg. Number</th>
                  <th>Student Name</th>
                  <th>Year &amp; Branch</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {ambassadorMembers.map((a) => (
                  <tr key={a.id}>
                    <td>#{a.order}</td>
                    <td style={{ fontFamily: 'monospace', fontWeight: 700, color: '#0369a1' }}>{a.regNumber}</td>
                    <td style={{ fontWeight: 600 }}>{a.name}</td>
                    <td>{a.year} - {a.branch}</td>
                    <td style={{ textAlign: 'right' }}>
                      <button
                        type="button"
                        onClick={() => {
                          setEditingAmbassadorId(a.id);
                          setAmbassadorForm({ regNumber: a.regNumber, name: a.name, year: a.year, branch: a.branch, email: a.email, order: a.order });
                        }}
                        className="admin-btn admin-btn--sm admin-btn--ghost"
                        style={{ padding: '0.2rem 0.35rem' }}
                      >
                        <Edit2 size={13} />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteAmbassador(a.id)}
                        className="admin-btn admin-btn--sm admin-btn--ghost"
                        style={{ padding: '0.2rem 0.35rem', color: '#dc2626' }}
                      >
                        <Trash2 size={13} />
                      </button>
                    </td>
                  </tr>
                ))}
                {ambassadorMembers.length === 0 && (
                  <tr>
                    <td colSpan={5} style={{ fontStyle: 'italic', color: '#64748b', textAlign: 'center', padding: '1rem' }}>
                      No student ambassadors listed yet. Click "Add Ambassador" above.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* SECTION 6: INFRASTRUCTURE & FACILITIES */}
        <div id="sec-facilities" style={{ background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '10px', padding: '1.25rem', marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem', marginBottom: '0.75rem', borderBottom: '2px solid #e2e8f0', paddingBottom: '0.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Building2 size={18} color="#0284c7" />
              <h3 style={{ margin: 0, fontSize: '1.05rem', color: '#0f172a' }}>6. Facilities &amp; Workstation Photos (Tab 5)</h3>
            </div>
            <label className="admin-btn admin-btn--sm admin-btn--primary" style={{ cursor: 'pointer', opacity: uploadingPhoto ? 0.6 : 1 }}>
              <ImageIcon size={14} /> {uploadingPhoto ? 'Uploading...' : 'Add Facility Photo'}
              <input
                type="file"
                accept="image/*"
                hidden
                disabled={uploadingPhoto}
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) addFacilityPhoto(file);
                  e.target.value = '';
                }}
              />
            </label>
          </div>

          <div className="admin-form-grid" style={{ marginBottom: '1.25rem' }}>
            <div className="admin-field" style={{ gridColumn: '1 / -1' }}>
              <label style={{ fontWeight: 600 }}>Section Title</label>
              <input
                type="text"
                value={form.facilities?.title || ''}
                onChange={(e) => setForm((p) => ({ ...p, facilities: { ...p.facilities, title: e.target.value } }))}
                className="admin-input"
                placeholder="Facilities for Making & Prototyping"
              />
            </div>
            <div className="admin-field" style={{ gridColumn: '1 / -1' }}>
              <label style={{ fontWeight: 600 }}>Facilities Lead Paragraphs (One per line)</label>
              <textarea
                value={(form.facilities?.paragraphs || []).join('\n')}
                onChange={(e) => setForm((p) => ({ ...p, facilities: { ...p.facilities, paragraphs: e.target.value.split('\n') } }))}
                className="admin-input"
                rows={3}
                style={{ width: '100%', fontFamily: 'inherit' }}
              />
            </div>
          </div>

          {/* Facility Photos Gallery */}
          <h4 style={{ fontSize: '0.88rem', color: '#334155', marginBottom: '0.5rem' }}>
            Equipment &amp; Workstation Photos Gallery ({facilityPhotos.length})
          </h4>
          <p className="admin-field__hint" style={{ marginBottom: '0.75rem' }}>
            Photos uploaded here display in the Facilities grid on the live page.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '1rem' }}>
            {facilityPhotos.map((p) => (
              <FacilityPhotoCardItem
                key={p.id}
                photo={p}
                onReplacePhoto={replaceFacilityPhoto}
                onRemovePhoto={removeFacilityPhoto}
              />
            ))}
            {facilityPhotos.length === 0 && (
              <p style={{ fontStyle: 'italic', color: '#64748b', fontSize: '0.85rem', gridColumn: '1 / -1' }}>
                No custom facility photos uploaded yet. Public page displays standard workstation slots. Click "Add Facility Photo" above to upload images.
              </p>
            )}
          </div>
        </div>

        {/* SECTION 7: OFFICIAL ROSTER & REGISTRY */}
        <div id="sec-official" style={{ background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '10px', padding: '1.25rem', marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem', borderBottom: '2px solid #e2e8f0', paddingBottom: '0.5rem' }}>
            <FileCheck size={18} color="#0284c7" />
            <h3 style={{ margin: 0, fontSize: '1.05rem', color: '#0f172a' }}>7. Official Roster &amp; Registry (Tab 6)</h3>
          </div>

          <div className="admin-form-grid">
            <div className="admin-field" style={{ gridColumn: '1 / -1' }}>
              <label style={{ fontWeight: 600 }}>Section Title</label>
              <input
                type="text"
                value={form.officialInfo?.title || ''}
                onChange={(e) => setForm((p) => ({ ...p, officialInfo: { ...p.officialInfo, title: e.target.value } }))}
                className="admin-input"
                placeholder="Official IDEA Lab Information"
              />
            </div>
            <div className="admin-field">
              <label style={{ fontWeight: 600 }}>AQIS Application ID</label>
              <input
                type="text"
                value={form.officialInfo?.aqisId || ''}
                onChange={(e) => setForm((p) => ({ ...p, officialInfo: { ...p.officialInfo, aqisId: e.target.value } }))}
                className="admin-input"
                placeholder="1-10972304911"
              />
            </div>
            <div className="admin-field">
              <label style={{ fontWeight: 600 }}>Head of Institution</label>
              <input
                type="text"
                value={form.officialInfo?.headOfInstitution || ''}
                onChange={(e) => setForm((p) => ({ ...p, officialInfo: { ...p.officialInfo, headOfInstitution: e.target.value } }))}
                className="admin-input"
                placeholder="Dr. G. Srinivasa Rao, Principal"
              />
            </div>
            <div className="admin-field" style={{ gridColumn: '1 / -1' }}>
              <label style={{ fontWeight: 600 }}>Institution Name</label>
              <input
                type="text"
                value={form.officialInfo?.institution || ''}
                onChange={(e) => setForm((p) => ({ ...p, officialInfo: { ...p.officialInfo, institution: e.target.value } }))}
                className="admin-input"
                placeholder="Shri Vishnu Engineering College for Women (Autonomous)"
              />
            </div>
            <div className="admin-field" style={{ gridColumn: '1 / -1' }}>
              <label style={{ fontWeight: 600 }}>Faculty Coordinators List (One per line)</label>
              <textarea
                value={(form.officialInfo?.facultyCoordinators || []).join('\n')}
                onChange={(e) => setForm((p) => ({ ...p, officialInfo: { ...p.officialInfo, facultyCoordinators: e.target.value.split('\n') } }))}
                className="admin-input"
                rows={3}
                style={{ width: '100%', fontFamily: 'inherit' }}
              />
            </div>
            <div className="admin-field" style={{ gridColumn: '1 / -1' }}>
              <label style={{ fontWeight: 600 }}>Official Contact Email</label>
              <input
                type="text"
                value={form.officialInfo?.email || ''}
                onChange={(e) => setForm((p) => ({ ...p, officialInfo: { ...p.officialInfo, email: e.target.value } }))}
                className="admin-input"
                placeholder="idealab@svecw.edu.in"
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
          <button type="button" onClick={saveMainDoc} disabled={saving} className="admin-btn admin-btn--primary">
            <Save size={14} /> {saving ? 'Saving...' : 'Save All AICTE IDEA Lab Changes'}
          </button>
        </div>
      </div>
      {cropModal}
    </div>
  );
}
