import { useState, useEffect } from 'react';
import { doc, getDoc, collection, serverTimestamp } from 'firebase/firestore';
import { setDoc, addDoc, updateDoc, deleteDoc } from '../../../lib/auditLog';
import { db } from '../../../lib/firebase';
import { useOrderedCollection } from '../../../hooks/useCollection';
import {
  Landmark,
  Save,
  RotateCcw,
  Plus,
  Edit2,
  Trash2,
  X,
  ArrowUp,
  ArrowDown,
  Layers,
  Building2,
  MapPin,
  Calendar,
  Sparkles,
  ExternalLink,
  Award,
  History,
  Users,
} from 'lucide-react';

export interface AboutSvesContentDoc {
  statsHeading: string;
  statsSubtitle: string;
  introSubheading: string;
  introParagraphs: string[];
  introLinkLabel: string;
  legacyHeading: string;
  legacyParagraphs: string[];
  leadershipHeading: string;
  leadershipParagraphs: string[];
  campusesHeading: string;
  campusesParagraph: string;
  galleryLabel: string;
  galleryTitle: string;
  gallerySubtitle: string;
  milestonesHeading: string;
  milestonesParagraph: string;
  ctaEyebrow: string;
  ctaHeading: string;
  ctaParagraphs: string[];
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

export interface SvesCampusDoc {
  id: string;
  name: string;
  location: string;
  institutions: string[];
  order: number;
}

export interface SubLocation {
  tag: string;
  institutions: string[];
}

export function parseCampusInstitutions(campusName: string, rawInsts: string[]) {
  const nameLower = (campusName || '').toLowerCase();
  let mainInsts: string[] = [];
  let subLocs: SubLocation[] = [];

  if (nameLower.includes('green meadows')) {
    const defaultMain = [
      "Vishnu Women's University",
      "Vishnu Institute of Technology",
      "Vishnu Dental College & Hospital",
      "Shri Vishnu College of Pharmacy",
      "B. V. Raju College",
      "Vishnu School",
    ];
    const defaultSouth = ["Smt. B Seetha Polytechnic"];

    if (!rawInsts || rawInsts.length === 0) {
      mainInsts = defaultMain;
      subLocs = [{ tag: 'South Campus', institutions: defaultSouth }];
    } else {
      const main = rawInsts.filter((i) => !i.toLowerCase().includes('seetha polytechnic') && !i.startsWith('['));
      const south = rawInsts.filter((i) => i.toLowerCase().includes('seetha polytechnic'));

      const customSubMap: { [tag: string]: string[] } = {};
      rawInsts.forEach((item) => {
        const match = item.match(/^\[(.*?)\]\s*(.*)$/);
        if (match) {
          const tag = match[1].trim();
          const inst = match[2].trim();
          if (!customSubMap[tag]) customSubMap[tag] = [];
          if (inst) customSubMap[tag].push(inst);
        }
      });

      mainInsts = main.length > 0 ? main : defaultMain;
      subLocs = [{ tag: 'South Campus', institutions: south.length > 0 ? south : defaultSouth }];

      Object.keys(customSubMap).forEach((tag) => {
        if (tag.toLowerCase() !== 'south campus') {
          subLocs.push({ tag, institutions: customSubMap[tag] });
        }
      });
    }
  } else if (nameLower.includes('lake view') || nameLower.includes('vedic')) {
    const vedicName = (rawInsts && rawInsts[0]) || 'Vishnu Educational Development and Innovation Centre (VEDIC)';
    mainInsts = [];
    subLocs = [
      { tag: 'HYDERABAD', institutions: [vedicName] },
      { tag: 'BANGALORE', institutions: [vedicName] },
    ];
  } else {
    const main: string[] = [];
    const subMap: { [tag: string]: string[] } = {};

    (rawInsts || []).forEach((item) => {
      const match = item.match(/^\[(.*?)\]\s*(.*)$/);
      if (match) {
        const tag = match[1].trim();
        const inst = match[2].trim();
        if (!subMap[tag]) subMap[tag] = [];
        if (inst) subMap[tag].push(inst);
      } else if (item.trim()) {
        main.push(item.trim());
      }
    });

    mainInsts = main;
    subLocs = Object.keys(subMap).map((tag) => ({ tag, institutions: subMap[tag] }));
  }

  return { mainInsts, subLocs };
}

export function serializeCampusInstitutions(mainInsts: string[], subLocs: SubLocation[]): string[] {
  const result: string[] = [];

  mainInsts.forEach((inst) => {
    const trimmed = inst.trim();
    if (trimmed) result.push(trimmed);
  });

  subLocs.forEach((sub) => {
    const tag = sub.tag.trim();
    sub.institutions.forEach((inst) => {
      const trimmed = inst.trim();
      if (trimmed) {
        if (tag.toLowerCase().includes('south campus') || trimmed.toLowerCase().includes('seetha polytechnic')) {
          result.push(trimmed);
        } else if (tag) {
          result.push(`[${tag}] ${trimmed}`);
        } else {
          result.push(trimmed);
        }
      }
    });
  });

  return result;
}

// Mirrors the hardcoded copy AboutSVES.tsx shipped with before this admin
// editor existed, so the public page renders identically until an admin
// saves a change.
export const DEFAULT_ABOUT_SVES_CONTENT: AboutSvesContentDoc = {
  statsHeading: 'SVES AT A GLANCE',
  statsSubtitle: 'A Growing Educational Community',
  introSubheading: 'Sri Vishnu Educational Society Education with a Long View since 1992',
  introParagraphs: [
    'Sri Vishnu Educational Society was founded in 1992 by Late **Dr. B. V. Raju**, an industrialist, philanthropist and recipient of the **Padma Shri and Padma Bhushan**.',
    'Established as a not-for-profit educational organisation, SVES has developed institutions across engineering, pharmacy, dentistry, management, sciences, polytechnic and school education.',
    'Over the years, the Society has focused on creating learning environments that bring together academic quality, practical exposure and opportunities for students to progress in their chosen fields.',
  ],
  introLinkLabel: 'Know More',
  legacyHeading: 'A Vision That Began in 1992',
  legacyParagraphs: [
    'Late Dr. B. V. Raju believed that quality education should be accessible to aspiring learners beyond major urban centres.',
    'That belief led to the establishment of Sri Vishnu Educational Society and shaped its approach to creating institutions where students could gain knowledge, develop skills and build meaningful futures.',
    "His commitment to education continues to guide the Society's academic direction and growth.",
  ],
  leadershipHeading: 'Carrying the Vision Forward',
  leadershipParagraphs: [
    'The educational vision established by **Late Dr. B. V. Raju** continues under the leadership of **Sri K. V. Vishnu Raju**, Chairman, and grandson of the Founder Chairman.',
    'SVES remains committed to creating transformative educational experiences that empower students to realize their potential and contribute meaningfully to society across Andhra Pradesh and Telangana.',
  ],
  campusesHeading: 'Four Campus Communities.',
  campusesParagraph: "SVES institutions are organised across distinct campus communities in Andhra Pradesh and Telangana, each contributing to the Society's wider academic network.",
  galleryLabel: 'ACROSS SVES',
  galleryTitle: 'Life Across Our Campuses',
  gallerySubtitle: 'A glimpse of the academic spaces, people and experiences that make up the wider SVES community.',
  milestonesHeading: 'Milestones in the SVES Journey',
  milestonesParagraph: "Each milestone reflects the Society's continued growth across institutions, disciplines and learning communities.",
  ctaEyebrow: "Vishnu Women's University",
  ctaHeading: "Explore Vishnu Women's University",
  ctaParagraphs: [
    "Vishnu Women's University carries forward the educational legacy of SVES through academic programmes, research, student development and a university experience centred on women.",
    'Discover the University, its academic environment and the opportunities available to students.',
  ],
  ctaButtonLabel: 'Join VWU →',
};

export const ABOUT_SVES_CONTENT_COLLECTION = 'settings';
export const ABOUT_SVES_CONTENT_DOC_ID = 'aboutSvesContent';

function TextField({ label, value, onChange, placeholder }: { label: string; value: string; onChange: (v: string) => void; placeholder?: string }) {
  return (
    <div className="admin-field" style={{ gridColumn: '1 / -1' }}>
      <label style={{ fontWeight: 600 }}>{label}</label>
      <input type="text" value={value} onChange={(e) => onChange(e.target.value)} className="admin-input" placeholder={placeholder} />
    </div>
  );
}

function ParagraphsField({ label, value, onChange, rows = 4 }: { label: string; value: string[]; onChange: (v: string[]) => void; rows?: number }) {
  return (
    <div className="admin-field" style={{ gridColumn: '1 / -1' }}>
      <label style={{ fontWeight: 600 }}>{label} (one paragraph per line; use **text** for bold)</label>
      <textarea
        value={value.join('\n')}
        onChange={(e) => onChange(e.target.value.split('\n'))}
        className="admin-input"
        rows={rows}
        style={{ width: '100%', fontFamily: 'inherit', resize: 'vertical' }}
      />
    </div>
  );
}

export default function AboutSvesContentAdmin() {
  const [data, setData] = useState<AboutSvesContentDoc>(DEFAULT_ABOUT_SVES_CONTENT);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Real-time collections
  const { docs: allContentBlocks } = useOrderedCollection<ContentBlockDoc>('contentBlocks', 'order');
  const { docs: campuses } = useOrderedCollection<SvesCampusDoc>('svesCampuses', 'order');

  // Filter content blocks for about-sves page
  const statsBlocks = allContentBlocks.filter((b) => b.page === 'about-sves' && b.section === 'stats');
  const milestonesBlocks = allContentBlocks.filter((b) => b.page === 'about-sves' && b.section === 'milestones');
  const legacyVisionBlocks = allContentBlocks.filter((b) => b.page === 'about-sves' && b.section === 'legacy-vision');
  const leadershipCultureBlocks = allContentBlocks.filter((b) => b.page === 'about-sves' && b.section === 'leadership-culture');

  // --- Quick Stats Editor State ---
  const [editingStatId, setEditingStatId] = useState<string | null>(null);
  const [statForm, setStatForm] = useState<{ value: string; title: string }>({ value: '', title: '' });
  const [isAddingStat, setIsAddingStat] = useState(false);
  const [newStatForm, setNewStatForm] = useState<{ value: string; title: string }>({ value: '', title: '' });

  // --- Legacy Vision Editor State ---
  const [editingLegacyId, setEditingLegacyId] = useState<string | null>(null);
  const [legacyForm, setLegacyForm] = useState<{ title: string; desc: string }>({ title: '', desc: '' });
  const [isAddingLegacy, setIsAddingLegacy] = useState(false);
  const [newLegacyForm, setNewLegacyForm] = useState<{ title: string; desc: string }>({ title: '', desc: '' });

  // --- Leadership & Culture Editor State ---
  const [editingLeadershipId, setEditingLeadershipId] = useState<string | null>(null);
  const [leadershipForm, setLeadershipForm] = useState<{ title: string; desc: string }>({ title: '', desc: '' });
  const [isAddingLeadership, setIsAddingLeadership] = useState(false);
  const [newLeadershipForm, setNewLeadershipForm] = useState<{ title: string; desc: string }>({ title: '', desc: '' });

  // --- Campuses Editor State ---
  const [editingCampusId, setEditingCampusId] = useState<string | null>(null);
  const [campusForm, setCampusForm] = useState<{
    name: string;
    location: string;
    mainInstitutions: string[];
    subLocations: { tag: string; institutions: string[] }[];
    order: number;
  }>({
    name: '',
    location: '',
    mainInstitutions: [],
    subLocations: [],
    order: 0,
  });
  const [isAddingCampus, setIsAddingCampus] = useState(false);
  const [newCampusForm, setNewCampusForm] = useState<{
    name: string;
    location: string;
    mainInstitutions: string[];
    subLocations: { tag: string; institutions: string[] }[];
  }>({
    name: '',
    location: '',
    mainInstitutions: [],
    subLocations: [],
  });

  // --- Milestones Editor State ---
  const [editingMilestoneId, setEditingMilestoneId] = useState<string | null>(null);
  const [milestoneForm, setMilestoneForm] = useState<{ title: string; desc: string }>({ title: '', desc: '' });
  const [isAddingMilestone, setIsAddingMilestone] = useState(false);
  const [newMilestoneForm, setNewMilestoneForm] = useState<{ title: string; desc: string }>({ title: '', desc: '' });

  useEffect(() => {
    async function loadData() {
      try {
        const snap = await getDoc(doc(db, ABOUT_SVES_CONTENT_COLLECTION, ABOUT_SVES_CONTENT_DOC_ID));
        if (snap.exists()) {
          const remote = snap.data() as Partial<AboutSvesContentDoc>;
          setData({ ...DEFAULT_ABOUT_SVES_CONTENT, ...remote });
        }
      } catch (err) {
        console.error('Failed to load About SVES content:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const set = <K extends keyof AboutSvesContentDoc>(k: K, v: AboutSvesContentDoc[K]) =>
    setData((p) => ({ ...p, [k]: v }));

  const handleSave = async () => {
    setSaving(true);
    try {
      await setDoc(doc(db, ABOUT_SVES_CONTENT_COLLECTION, ABOUT_SVES_CONTENT_DOC_ID), data);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch (err) {
      console.error('Failed to save About SVES content:', err);
      alert('Failed to save changes. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    if (confirm('Reset all About SVES copy to original defaults?')) setData(DEFAULT_ABOUT_SVES_CONTENT);
  };

  // --- QUICK STATS CRUD ---
  const handleAddStat = async () => {
    if (!newStatForm.value.trim() || !newStatForm.title.trim()) return alert('Stat value and title are required.');
    try {
      const nextOrder = statsBlocks.length > 0 ? Math.max(...statsBlocks.map((s) => s.order || 0)) + 1 : 1;
      await addDoc(collection(db, 'contentBlocks'), {
        page: 'about-sves',
        section: 'stats',
        value: newStatForm.value.trim(),
        title: newStatForm.title.trim(),
        desc: '',
        icon: '',
        slug: '',
        order: nextOrder,
        createdAt: serverTimestamp(),
      });
      setNewStatForm({ value: '', title: '' });
      setIsAddingStat(false);
    } catch (err) {
      alert(`Failed to add stat: ${(err as Error).message}`);
    }
  };

  const handleSaveStatEdit = async (id: string) => {
    if (!statForm.value.trim() || !statForm.title.trim()) return alert('Stat value and title are required.');
    try {
      await updateDoc(doc(db, 'contentBlocks', id), { value: statForm.value.trim(), title: statForm.title.trim() });
      setEditingStatId(null);
    } catch (err) {
      alert(`Failed to update stat: ${(err as Error).message}`);
    }
  };

  const handleDeleteStat = async (id: string) => {
    if (!confirm('Are you sure you want to delete this stat block?')) return;
    try {
      await deleteDoc(doc(db, 'contentBlocks', id));
    } catch (err) {
      alert(`Failed to delete stat: ${(err as Error).message}`);
    }
  };

  const handleMoveStat = async (index: number, direction: 'up' | 'down') => {
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= statsBlocks.length) return;
    const current = statsBlocks[index];
    const target = statsBlocks[targetIdx];
    try {
      await updateDoc(doc(db, 'contentBlocks', current.id), { order: target.order });
      await updateDoc(doc(db, 'contentBlocks', target.id), { order: current.order });
    } catch (err) {
      alert(`Failed to reorder: ${(err as Error).message}`);
    }
  };

  // --- LEGACY VISION CRUD ---
  const handleAddLegacy = async () => {
    if (!newLegacyForm.desc.trim()) return alert('Paragraph text is required.');
    try {
      const nextOrder = legacyVisionBlocks.length > 0 ? Math.max(...legacyVisionBlocks.map((b) => b.order || 0)) + 1 : 1;
      await addDoc(collection(db, 'contentBlocks'), {
        page: 'about-sves',
        section: 'legacy-vision',
        value: '',
        title: newLegacyForm.title.trim(),
        desc: newLegacyForm.desc.trim(),
        icon: '',
        slug: '',
        order: nextOrder,
        createdAt: serverTimestamp(),
      });
      setNewLegacyForm({ title: '', desc: '' });
      setIsAddingLegacy(false);
    } catch (err) {
      alert(`Failed to add item: ${(err as Error).message}`);
    }
  };

  const handleSaveLegacyEdit = async (id: string) => {
    if (!legacyForm.desc.trim()) return alert('Paragraph text is required.');
    try {
      await updateDoc(doc(db, 'contentBlocks', id), { title: legacyForm.title.trim(), desc: legacyForm.desc.trim() });
      setEditingLegacyId(null);
    } catch (err) {
      alert(`Failed to update item: ${(err as Error).message}`);
    }
  };

  const handleDeleteLegacy = async (id: string) => {
    if (!confirm('Are you sure you want to delete this paragraph block?')) return;
    try {
      await deleteDoc(doc(db, 'contentBlocks', id));
    } catch (err) {
      alert(`Failed to delete item: ${(err as Error).message}`);
    }
  };

  const handleMoveLegacy = async (index: number, direction: 'up' | 'down') => {
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= legacyVisionBlocks.length) return;
    const current = legacyVisionBlocks[index];
    const target = legacyVisionBlocks[targetIdx];
    try {
      await updateDoc(doc(db, 'contentBlocks', current.id), { order: target.order });
      await updateDoc(doc(db, 'contentBlocks', target.id), { order: current.order });
    } catch (err) {
      alert(`Failed to reorder: ${(err as Error).message}`);
    }
  };

  // --- LEADERSHIP & CULTURE CRUD ---
  const handleAddLeadership = async () => {
    if (!newLeadershipForm.desc.trim()) return alert('Paragraph text is required.');
    try {
      const nextOrder = leadershipCultureBlocks.length > 0 ? Math.max(...leadershipCultureBlocks.map((b) => b.order || 0)) + 1 : 1;
      await addDoc(collection(db, 'contentBlocks'), {
        page: 'about-sves',
        section: 'leadership-culture',
        value: '',
        title: newLeadershipForm.title.trim(),
        desc: newLeadershipForm.desc.trim(),
        icon: '',
        slug: '',
        order: nextOrder,
        createdAt: serverTimestamp(),
      });
      setNewLeadershipForm({ title: '', desc: '' });
      setIsAddingLeadership(false);
    } catch (err) {
      alert(`Failed to add item: ${(err as Error).message}`);
    }
  };

  const handleSaveLeadershipEdit = async (id: string) => {
    if (!leadershipForm.desc.trim()) return alert('Paragraph text is required.');
    try {
      await updateDoc(doc(db, 'contentBlocks', id), { title: leadershipForm.title.trim(), desc: leadershipForm.desc.trim() });
      setEditingLeadershipId(null);
    } catch (err) {
      alert(`Failed to update item: ${(err as Error).message}`);
    }
  };

  const handleDeleteLeadership = async (id: string) => {
    if (!confirm('Are you sure you want to delete this paragraph block?')) return;
    try {
      await deleteDoc(doc(db, 'contentBlocks', id));
    } catch (err) {
      alert(`Failed to delete item: ${(err as Error).message}`);
    }
  };

  const handleMoveLeadership = async (index: number, direction: 'up' | 'down') => {
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= leadershipCultureBlocks.length) return;
    const current = leadershipCultureBlocks[index];
    const target = leadershipCultureBlocks[targetIdx];
    try {
      await updateDoc(doc(db, 'contentBlocks', current.id), { order: target.order });
      await updateDoc(doc(db, 'contentBlocks', target.id), { order: current.order });
    } catch (err) {
      alert(`Failed to reorder: ${(err as Error).message}`);
    }
  };

  // --- SVES CAMPUSES CRUD ---
  const startEditCampus = (c: SvesCampusDoc, idx: number) => {
    setEditingCampusId(c.id);
    const displayLoc = (c.name.toLowerCase().includes('lake view') || idx === 3)
      ? (c.location && c.location !== 'Aziz Nagar' && c.location !== 'Hyderabad' ? c.location : 'Hyderabad & Bangalore')
      : c.location;
    const { mainInsts, subLocs } = parseCampusInstitutions(c.name, c.institutions || []);
    setCampusForm({
      name: c.name,
      location: displayLoc || '',
      mainInstitutions: mainInsts,
      subLocations: subLocs,
      order: c.order,
    });
  };

  const handleAddCampus = async () => {
    if (!newCampusForm.name.trim()) return alert('Campus name is required.');
    try {
      const nextOrder = campuses.length > 0 ? Math.max(...campuses.map((c) => c.order || 0)) + 1 : 1;
      const finalInsts = serializeCampusInstitutions(
        newCampusForm.mainInstitutions,
        newCampusForm.subLocations
      );
      await addDoc(collection(db, 'svesCampuses'), {
        name: newCampusForm.name.trim(),
        location: newCampusForm.location.trim(),
        institutions: finalInsts,
        order: nextOrder,
        createdAt: serverTimestamp(),
      });
      setNewCampusForm({ name: '', location: '', mainInstitutions: [], subLocations: [] });
      setIsAddingCampus(false);
    } catch (err) {
      alert(`Failed to add campus: ${(err as Error).message}`);
    }
  };

  const handleSaveCampusEdit = async (id: string) => {
    if (!campusForm.name.trim()) return alert('Campus name is required.');
    try {
      const finalInsts = serializeCampusInstitutions(
        campusForm.mainInstitutions,
        campusForm.subLocations
      );
      await updateDoc(doc(db, 'svesCampuses', id), {
        name: campusForm.name.trim(),
        location: campusForm.location.trim(),
        institutions: finalInsts,
        order: campusForm.order,
      });
      setEditingCampusId(null);
    } catch (err) {
      alert(`Failed to update campus: ${(err as Error).message}`);
    }
  };

  const handleDeleteCampus = async (id: string) => {
    if (!confirm('Are you sure you want to delete this campus?')) return;
    try {
      await deleteDoc(doc(db, 'svesCampuses', id));
    } catch (err) {
      alert(`Failed to delete campus: ${(err as Error).message}`);
    }
  };

  const handleMoveCampus = async (index: number, direction: 'up' | 'down') => {
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= campuses.length) return;
    const current = campuses[index];
    const target = campuses[targetIdx];
    try {
      await updateDoc(doc(db, 'svesCampuses', current.id), { order: target.order });
      await updateDoc(doc(db, 'svesCampuses', target.id), { order: current.order });
    } catch (err) {
      alert(`Failed to reorder: ${(err as Error).message}`);
    }
  };

  // --- MILESTONES CRUD ---
  const handleAddMilestone = async () => {
    if (!newMilestoneForm.title.trim() || !newMilestoneForm.desc.trim()) return alert('Year title and milestone detail are required.');
    try {
      const nextOrder = milestonesBlocks.length > 0 ? Math.max(...milestonesBlocks.map((m) => m.order || 0)) + 1 : 1;
      await addDoc(collection(db, 'contentBlocks'), {
        page: 'about-sves',
        section: 'milestones',
        value: '',
        title: newMilestoneForm.title.trim(),
        desc: newMilestoneForm.desc.trim(),
        icon: '',
        slug: '',
        order: nextOrder,
        createdAt: serverTimestamp(),
      });
      setNewMilestoneForm({ title: '', desc: '' });
      setIsAddingMilestone(false);
    } catch (err) {
      alert(`Failed to add milestone: ${(err as Error).message}`);
    }
  };

  const handleSaveMilestoneEdit = async (id: string) => {
    if (!milestoneForm.title.trim() || !milestoneForm.desc.trim()) return alert('Year title and milestone detail are required.');
    try {
      await updateDoc(doc(db, 'contentBlocks', id), { title: milestoneForm.title.trim(), desc: milestoneForm.desc.trim() });
      setEditingMilestoneId(null);
    } catch (err) {
      alert(`Failed to update milestone: ${(err as Error).message}`);
    }
  };

  const handleDeleteMilestone = async (id: string) => {
    if (!confirm('Are you sure you want to delete this milestone?')) return;
    try {
      await deleteDoc(doc(db, 'contentBlocks', id));
    } catch (err) {
      alert(`Failed to delete milestone: ${(err as Error).message}`);
    }
  };

  const handleMoveMilestone = async (index: number, direction: 'up' | 'down') => {
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= milestonesBlocks.length) return;
    const current = milestonesBlocks[index];
    const target = milestonesBlocks[targetIdx];
    try {
      await updateDoc(doc(db, 'contentBlocks', current.id), { order: target.order });
      await updateDoc(doc(db, 'contentBlocks', target.id), { order: current.order });
    } catch (err) {
      alert(`Failed to reorder: ${(err as Error).message}`);
    }
  };

  if (loading) {
    return <p className="admin-loading">Loading About SVES Editor...</p>;
  }

  return (
    <div className="admin-section">
      <div className="admin-card">
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '1.25rem', borderBottom: '1px solid #e5e7eb', paddingBottom: '1rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Landmark size={22} color="#c8a03c" />
              <h2 className="admin-card__title" style={{ margin: 0, padding: 0, border: 'none' }}>
                About SVES Page Management
              </h2>
            </div>
            <p className="admin-field__hint" style={{ margin: '0.35rem 0 0', fontSize: '0.85rem' }}>
              Manage all content and sections of the public About SVES page in the <strong>exact top-to-bottom order</strong> as displayed on the live website.
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
          <a href="#sec-stats" style={{ color: '#0284c7', textDecoration: 'none', fontWeight: 600 }}>1. Quick Stats Bar</a> •
          <a href="#sec-intro" style={{ color: '#0284c7', textDecoration: 'none', fontWeight: 600 }}>2. Society Intro</a> •
          <a href="#sec-legacy" style={{ color: '#0284c7', textDecoration: 'none', fontWeight: 600 }}>3. Legacy Rooted in Vision</a> •
          <a href="#sec-leadership" style={{ color: '#0284c7', textDecoration: 'none', fontWeight: 600 }}>4. Leadership &amp; Culture</a> •
          <a href="#sec-campuses" style={{ color: '#0284c7', textDecoration: 'none', fontWeight: 600 }}>5. SVES Campuses Grid</a> •
          <a href="#sec-gallery" style={{ color: '#0284c7', textDecoration: 'none', fontWeight: 600 }}>6. Campus Photos Copy</a> •
          <a href="#sec-milestones" style={{ color: '#0284c7', textDecoration: 'none', fontWeight: 600 }}>7. Milestones</a> •
          <a href="#sec-cta" style={{ color: '#0284c7', textDecoration: 'none', fontWeight: 600 }}>8. Closing CTA</a>
        </div>

        {/* HERO BANNER NOTE */}
        <div style={{ background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '8px', padding: '0.75rem 1rem', marginBottom: '1.5rem', fontSize: '0.83rem', color: '#1e40af', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span><strong>Hero Banner:</strong> Title &amp; subtitle banner at the top of the About SVES page can be updated under <em>Hero Banners (page: about-sves)</em>.</span>
        </div>

        {/* 1. QUICK STATS BAR */}
        <div id="sec-stats" style={{ background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '10px', padding: '1.25rem', marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem', marginBottom: '0.75rem', borderBottom: '2px solid #e2e8f0', paddingBottom: '0.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Award size={18} color="#0284c7" />
              <h3 style={{ margin: 0, fontSize: '1.05rem', color: '#0f172a' }}>1. Quick Stats Bar (Below Hero Banner)</h3>
            </div>
            <button type="button" onClick={() => setIsAddingStat(true)} className="admin-btn admin-btn--sm admin-btn--primary">
              <Plus size={14} /> Add Stat Card
            </button>
          </div>

          <div className="admin-form-grid" style={{ marginBottom: '1.25rem' }}>
            <TextField label="Section Heading" value={data.statsHeading} onChange={(v) => set('statsHeading', v)} placeholder="SVES AT A GLANCE" />
            <TextField label="Section Subtitle" value={data.statsSubtitle} onChange={(v) => set('statsSubtitle', v)} placeholder="A Growing Educational Community" />
          </div>

          <h4 style={{ fontSize: '0.92rem', color: '#334155', marginBottom: '0.5rem' }}>
            Dynamic Quick Stats ({statsBlocks.length})
          </h4>
          <p className="admin-field__hint" style={{ marginBottom: '0.75rem' }}>
            These stat pills appear below the hero banner. Also accessible under Page Content Blocks (About SVES — Stats).
          </p>

          {/* Add Stat Form */}
          {isAddingStat && (
            <div style={{ background: '#f0f9ff', border: '1px solid #bae6fd', borderRadius: '8px', padding: '0.75rem', marginBottom: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <strong style={{ fontSize: '0.85rem', color: '#0369a1' }}>New Quick Stat</strong>
                <button type="button" onClick={() => setIsAddingStat(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}>
                  <X size={16} />
                </button>
              </div>
              <div className="admin-form-grid">
                <div className="admin-field">
                  <label>Stat Value (e.g. 25,000+)</label>
                  <input
                    type="text"
                    value={newStatForm.value}
                    onChange={(e) => setNewStatForm((p) => ({ ...p, value: e.target.value }))}
                    className="admin-input"
                    placeholder="25,000+"
                  />
                </div>
                <div className="admin-field">
                  <label>Stat Label (e.g. Students)</label>
                  <input
                    type="text"
                    value={newStatForm.title}
                    onChange={(e) => setNewStatForm((p) => ({ ...p, title: e.target.value }))}
                    className="admin-input"
                    placeholder="Students"
                  />
                </div>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
                <button type="button" onClick={() => setIsAddingStat(false)} className="admin-btn admin-btn--sm admin-btn--ghost">Cancel</button>
                <button type="button" onClick={handleAddStat} className="admin-btn admin-btn--sm admin-btn--primary"><Plus size={14} /> Add Stat</button>
              </div>
            </div>
          )}

          {/* Stats List */}
          {statsBlocks.length === 0 ? (
            <p style={{ fontStyle: 'italic', color: '#64748b', fontSize: '0.85rem' }}>No stats added yet. Click "Add Stat Card" above to create one.</p>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '0.6rem' }}>
              {statsBlocks.map((s, idx) => {
                const isEditing = editingStatId === s.id;
                return (
                  <div key={s.id} style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '0.65rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    {isEditing ? (
                      <div>
                        <input
                          type="text"
                          value={statForm.value}
                          onChange={(e) => setStatForm((p) => ({ ...p, value: e.target.value }))}
                          className="admin-input"
                          style={{ width: '100%', marginBottom: '0.35rem', fontWeight: 700 }}
                          placeholder="Value (25,000+)"
                        />
                        <input
                          type="text"
                          value={statForm.title}
                          onChange={(e) => setStatForm((p) => ({ ...p, title: e.target.value }))}
                          className="admin-input"
                          style={{ width: '100%', marginBottom: '0.5rem' }}
                          placeholder="Label (Students)"
                        />
                        <div style={{ display: 'flex', gap: '0.4rem', justifyContent: 'flex-end' }}>
                          <button type="button" onClick={() => setEditingStatId(null)} className="admin-btn admin-btn--sm admin-btn--ghost">Cancel</button>
                          <button type="button" onClick={() => handleSaveStatEdit(s.id)} className="admin-btn admin-btn--sm admin-btn--primary">Save</button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div>
                          <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0369a1' }}>{s.value}</div>
                          <div style={{ fontSize: '0.83rem', color: '#475569', fontWeight: 600 }}>{s.title}</div>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '0.2rem', marginTop: '0.5rem', borderTop: '1px solid #f1f5f9', paddingTop: '0.35rem' }}>
                          <button type="button" onClick={() => handleMoveStat(idx, 'up')} disabled={idx === 0} title="Move Left" className="admin-btn admin-btn--sm admin-btn--ghost" style={{ padding: '0.2rem 0.35rem' }}>
                            <ArrowUp size={12} />
                          </button>
                          <button type="button" onClick={() => handleMoveStat(idx, 'down')} disabled={idx === statsBlocks.length - 1} title="Move Right" className="admin-btn admin-btn--sm admin-btn--ghost" style={{ padding: '0.2rem 0.35rem' }}>
                            <ArrowDown size={12} />
                          </button>
                          <button type="button" onClick={() => { setEditingStatId(s.id); setStatForm({ value: s.value, title: s.title }); }} title="Edit" className="admin-btn admin-btn--sm admin-btn--ghost" style={{ padding: '0.2rem 0.35rem' }}>
                            <Edit2 size={12} />
                          </button>
                          <button type="button" onClick={() => handleDeleteStat(s.id)} title="Delete" className="admin-btn admin-btn--sm admin-btn--ghost" style={{ padding: '0.2rem 0.35rem', color: '#dc2626' }}>
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

        {/* 2. SOCIETY INTRO */}
        <div id="sec-intro" style={{ background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '10px', padding: '1.25rem', marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem', borderBottom: '2px solid #e2e8f0', paddingBottom: '0.5rem' }}>
            <Building2 size={18} color="#0284c7" />
            <h3 style={{ margin: 0, fontSize: '1.05rem', color: '#0f172a' }}>2. Society Intro Section</h3>
          </div>
          <div className="admin-form-grid">
            <TextField label="Subheading" value={data.introSubheading} onChange={(v) => set('introSubheading', v)} />
            <ParagraphsField label="Paragraphs" value={data.introParagraphs} onChange={(v) => set('introParagraphs', v)} rows={4} />
            <TextField label='"Know More" Link Label' value={data.introLinkLabel} onChange={(v) => set('introLinkLabel', v)} />
          </div>
        </div>

        {/* 3. LEGACY ROOTED IN VISION */}
        <div id="sec-legacy" style={{ background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '10px', padding: '1.25rem', marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem', marginBottom: '0.75rem', borderBottom: '2px solid #e2e8f0', paddingBottom: '0.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <History size={18} color="#0284c7" />
              <h3 style={{ margin: 0, fontSize: '1.05rem', color: '#0f172a' }}>3. Legacy Rooted in Vision</h3>
            </div>
            <button type="button" onClick={() => setIsAddingLegacy(true)} className="admin-btn admin-btn--sm admin-btn--ghost">
              <Plus size={14} /> Add Content Block Override
            </button>
          </div>

          <div className="admin-form-grid" style={{ marginBottom: '1.25rem' }}>
            <TextField label="Section Heading" value={data.legacyHeading} onChange={(v) => set('legacyHeading', v)} placeholder="A Vision That Began in 1992" />
            <ParagraphsField label="Section Paragraphs" value={data.legacyParagraphs} onChange={(v) => set('legacyParagraphs', v)} rows={4} />
          </div>

          {/* Optional Content Block Overrides */}
          {legacyVisionBlocks.length > 0 && (
            <div style={{ marginTop: '1rem', borderTop: '1px dashed #cbd5e1', paddingTop: '1rem' }}>
              <h4 style={{ fontSize: '0.92rem', color: '#334155', marginBottom: '0.5rem' }}>
                Content Block Overrides ({legacyVisionBlocks.length})
              </h4>
              <p className="admin-field__hint" style={{ marginBottom: '0.75rem' }}>
                Custom blocks created under Page Content Blocks (About SVES — Legacy Rooted in Vision).
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {legacyVisionBlocks.map((b, idx) => {
                  const isEditing = editingLegacyId === b.id;
                  return (
                    <div key={b.id} style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '0.75rem' }}>
                      {isEditing ? (
                        <div>
                          <input
                            type="text"
                            value={legacyForm.title}
                            onChange={(e) => setLegacyForm((p) => ({ ...p, title: e.target.value }))}
                            className="admin-input"
                            style={{ width: '100%', marginBottom: '0.4rem', fontWeight: 600 }}
                            placeholder="Heading (Optional)"
                          />
                          <textarea
                            value={legacyForm.desc}
                            onChange={(e) => setLegacyForm((p) => ({ ...p, desc: e.target.value }))}
                            className="admin-input"
                            rows={3}
                            style={{ width: '100%', marginBottom: '0.5rem', fontFamily: 'inherit' }}
                          />
                          <div style={{ display: 'flex', gap: '0.4rem', justifyContent: 'flex-end' }}>
                            <button type="button" onClick={() => setEditingLegacyId(null)} className="admin-btn admin-btn--sm admin-btn--ghost">Cancel</button>
                            <button type="button" onClick={() => handleSaveLegacyEdit(b.id)} className="admin-btn admin-btn--sm admin-btn--primary">Save</button>
                          </div>
                        </div>
                      ) : (
                        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '0.75rem' }}>
                          <div style={{ flex: 1 }}>
                            {b.title && <strong style={{ display: 'block', fontSize: '0.9rem', color: '#0f172a', marginBottom: '0.2rem' }}>{b.title}</strong>}
                            <p style={{ fontSize: '0.85rem', color: '#334155', margin: 0, lineHeight: 1.5 }}>{b.desc}</p>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                            <button type="button" onClick={() => handleMoveLegacy(idx, 'up')} disabled={idx === 0} title="Move Up" className="admin-btn admin-btn--sm admin-btn--ghost" style={{ padding: '0.2rem 0.35rem' }}>
                              <ArrowUp size={12} />
                            </button>
                            <button type="button" onClick={() => handleMoveLegacy(idx, 'down')} disabled={idx === legacyVisionBlocks.length - 1} title="Move Down" className="admin-btn admin-btn--sm admin-btn--ghost" style={{ padding: '0.2rem 0.35rem' }}>
                              <ArrowDown size={12} />
                            </button>
                            <button type="button" onClick={() => { setEditingLegacyId(b.id); setLegacyForm({ title: b.title || '', desc: b.desc || '' }); }} title="Edit" className="admin-btn admin-btn--sm admin-btn--ghost" style={{ padding: '0.2rem 0.35rem' }}>
                              <Edit2 size={12} />
                            </button>
                            <button type="button" onClick={() => handleDeleteLegacy(b.id)} title="Delete" className="admin-btn admin-btn--sm admin-btn--ghost" style={{ padding: '0.2rem 0.35rem', color: '#dc2626' }}>
                              <Trash2 size={12} />
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Add Legacy Form Modal */}
          {isAddingLegacy && (
            <div style={{ background: '#f0f9ff', border: '1px solid #bae6fd', borderRadius: '8px', padding: '0.75rem', marginTop: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <strong style={{ fontSize: '0.85rem', color: '#0369a1' }}>New Legacy Content Block</strong>
                <button type="button" onClick={() => setIsAddingLegacy(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}>
                  <X size={16} />
                </button>
              </div>
              <div className="admin-field" style={{ marginBottom: '0.4rem' }}>
                <label>Heading (Optional — set on 1st item)</label>
                <input
                  type="text"
                  value={newLegacyForm.title}
                  onChange={(e) => setNewLegacyForm((p) => ({ ...p, title: e.target.value }))}
                  placeholder="A Vision That Began in 1992"
                  className="admin-input"
                />
              </div>
              <div className="admin-field">
                <label>Paragraph Content * (Use **bold** for bold text)</label>
                <textarea
                  value={newLegacyForm.desc}
                  onChange={(e) => setNewLegacyForm((p) => ({ ...p, desc: e.target.value }))}
                  className="admin-input"
                  rows={3}
                  style={{ width: '100%', fontFamily: 'inherit' }}
                />
              </div>
              <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
                <button type="button" onClick={() => setIsAddingLegacy(false)} className="admin-btn admin-btn--sm admin-btn--ghost">Cancel</button>
                <button type="button" onClick={handleAddLegacy} className="admin-btn admin-btn--sm admin-btn--primary"><Plus size={14} /> Add Block</button>
              </div>
            </div>
          )}
        </div>

        {/* 4. LEADERSHIP & CULTURE */}
        <div id="sec-leadership" style={{ background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '10px', padding: '1.25rem', marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem', marginBottom: '0.75rem', borderBottom: '2px solid #e2e8f0', paddingBottom: '0.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Users size={18} color="#0284c7" />
              <h3 style={{ margin: 0, fontSize: '1.05rem', color: '#0f172a' }}>4. Leadership &amp; Culture</h3>
            </div>
            <button type="button" onClick={() => setIsAddingLeadership(true)} className="admin-btn admin-btn--sm admin-btn--ghost">
              <Plus size={14} /> Add Content Block Override
            </button>
          </div>

          <div className="admin-form-grid" style={{ marginBottom: '1.25rem' }}>
            <TextField label="Section Heading" value={data.leadershipHeading} onChange={(v) => set('leadershipHeading', v)} placeholder="Carrying the Vision Forward" />
            <ParagraphsField label="Section Paragraphs" value={data.leadershipParagraphs} onChange={(v) => set('leadershipParagraphs', v)} rows={3} />
          </div>

          {/* Optional Content Block Overrides */}
          {leadershipCultureBlocks.length > 0 && (
            <div style={{ marginTop: '1rem', borderTop: '1px dashed #cbd5e1', paddingTop: '1rem' }}>
              <h4 style={{ fontSize: '0.92rem', color: '#334155', marginBottom: '0.5rem' }}>
                Content Block Overrides ({leadershipCultureBlocks.length})
              </h4>
              <p className="admin-field__hint" style={{ marginBottom: '0.75rem' }}>
                Custom blocks created under Page Content Blocks (About SVES — Leadership &amp; Culture).
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {leadershipCultureBlocks.map((b, idx) => {
                  const isEditing = editingLeadershipId === b.id;
                  return (
                    <div key={b.id} style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '0.75rem' }}>
                      {isEditing ? (
                        <div>
                          <input
                            type="text"
                            value={leadershipForm.title}
                            onChange={(e) => setLeadershipForm((p) => ({ ...p, title: e.target.value }))}
                            className="admin-input"
                            style={{ width: '100%', marginBottom: '0.4rem', fontWeight: 600 }}
                            placeholder="Heading (Optional)"
                          />
                          <textarea
                            value={leadershipForm.desc}
                            onChange={(e) => setLeadershipForm((p) => ({ ...p, desc: e.target.value }))}
                            className="admin-input"
                            rows={3}
                            style={{ width: '100%', marginBottom: '0.5rem', fontFamily: 'inherit' }}
                          />
                          <div style={{ display: 'flex', gap: '0.4rem', justifyContent: 'flex-end' }}>
                            <button type="button" onClick={() => setEditingLeadershipId(null)} className="admin-btn admin-btn--sm admin-btn--ghost">Cancel</button>
                            <button type="button" onClick={() => handleSaveLeadershipEdit(b.id)} className="admin-btn admin-btn--sm admin-btn--primary">Save</button>
                          </div>
                        </div>
                      ) : (
                        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '0.75rem' }}>
                          <div style={{ flex: 1 }}>
                            {b.title && <strong style={{ display: 'block', fontSize: '0.9rem', color: '#0f172a', marginBottom: '0.2rem' }}>{b.title}</strong>}
                            <p style={{ fontSize: '0.85rem', color: '#334155', margin: 0, lineHeight: 1.5 }}>{b.desc}</p>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                            <button type="button" onClick={() => handleMoveLeadership(idx, 'up')} disabled={idx === 0} title="Move Up" className="admin-btn admin-btn--sm admin-btn--ghost" style={{ padding: '0.2rem 0.35rem' }}>
                              <ArrowUp size={12} />
                            </button>
                            <button type="button" onClick={() => handleMoveLeadership(idx, 'down')} disabled={idx === leadershipCultureBlocks.length - 1} title="Move Down" className="admin-btn admin-btn--sm admin-btn--ghost" style={{ padding: '0.2rem 0.35rem' }}>
                              <ArrowDown size={12} />
                            </button>
                            <button type="button" onClick={() => { setEditingLeadershipId(b.id); setLeadershipForm({ title: b.title || '', desc: b.desc || '' }); }} title="Edit" className="admin-btn admin-btn--sm admin-btn--ghost" style={{ padding: '0.2rem 0.35rem' }}>
                              <Edit2 size={12} />
                            </button>
                            <button type="button" onClick={() => handleDeleteLeadership(b.id)} title="Delete" className="admin-btn admin-btn--sm admin-btn--ghost" style={{ padding: '0.2rem 0.35rem', color: '#dc2626' }}>
                              <Trash2 size={12} />
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Add Leadership Form Modal */}
          {isAddingLeadership && (
            <div style={{ background: '#f0f9ff', border: '1px solid #bae6fd', borderRadius: '8px', padding: '0.75rem', marginTop: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <strong style={{ fontSize: '0.85rem', color: '#0369a1' }}>New Leadership Content Block</strong>
                <button type="button" onClick={() => setIsAddingLeadership(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}>
                  <X size={16} />
                </button>
              </div>
              <div className="admin-field" style={{ marginBottom: '0.4rem' }}>
                <label>Heading (Optional — set on 1st item)</label>
                <input
                  type="text"
                  value={newLeadershipForm.title}
                  onChange={(e) => setNewLeadershipForm((p) => ({ ...p, title: e.target.value }))}
                  placeholder="Carrying the Vision Forward"
                  className="admin-input"
                />
              </div>
              <div className="admin-field">
                <label>Paragraph Content * (Use **bold** for bold text)</label>
                <textarea
                  value={newLeadershipForm.desc}
                  onChange={(e) => setNewLeadershipForm((p) => ({ ...p, desc: e.target.value }))}
                  className="admin-input"
                  rows={3}
                  style={{ width: '100%', fontFamily: 'inherit' }}
                />
              </div>
              <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
                <button type="button" onClick={() => setIsAddingLeadership(false)} className="admin-btn admin-btn--sm admin-btn--ghost">Cancel</button>
                <button type="button" onClick={handleAddLeadership} className="admin-btn admin-btn--sm admin-btn--primary"><Plus size={14} /> Add Block</button>
              </div>
            </div>
          )}
        </div>

        {/* 5. FOUR DISTINCT CAMPUSES (SVES CAMPUSES GRID) */}
        <div id="sec-campuses" style={{ background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '10px', padding: '1.25rem', marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem', marginBottom: '0.75rem', borderBottom: '2px solid #e2e8f0', paddingBottom: '0.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <MapPin size={18} color="#0284c7" />
              <h3 style={{ margin: 0, fontSize: '1.05rem', color: '#0f172a' }}>5. Four Distinct Campuses (SVES Campuses Grid)</h3>
            </div>
            <button type="button" onClick={() => setIsAddingCampus(true)} className="admin-btn admin-btn--sm admin-btn--primary">
              <Plus size={14} /> Add Campus
            </button>
          </div>

          <div className="admin-form-grid" style={{ marginBottom: '1.25rem' }}>
            <TextField label="Section Heading" value={data.campusesHeading} onChange={(v) => set('campusesHeading', v)} placeholder="Four Campus Communities." />
            <div className="admin-field" style={{ gridColumn: '1 / -1' }}>
              <label style={{ fontWeight: 600 }}>Section Paragraph</label>
              <textarea
                value={data.campusesParagraph}
                onChange={(e) => set('campusesParagraph', e.target.value)}
                className="admin-input"
                rows={2}
                style={{ width: '100%', fontFamily: 'inherit' }}
              />
            </div>
          </div>

          <h4 style={{ fontSize: '0.92rem', color: '#334155', marginBottom: '0.5rem' }}>
            Managed SVES Campuses ({campuses.length})
          </h4>
          <p className="admin-field__hint" style={{ marginBottom: '0.75rem' }}>
            These campuses display on the public page grid with their institution lists. Formerly managed under standalone SVES Campuses sidebar section.
          </p>

          {/* Add Campus Form */}
          {isAddingCampus && (
            <div style={{ background: '#f0f9ff', border: '1px solid #bae6fd', borderRadius: '8px', padding: '0.85rem', marginBottom: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <strong style={{ fontSize: '0.85rem', color: '#0369a1' }}>New SVES Campus Card</strong>
                <button type="button" onClick={() => setIsAddingCampus(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}>
                  <X size={16} />
                </button>
              </div>
              <div className="admin-form-grid">
                <div className="admin-field">
                  <label style={{ fontWeight: 600, fontSize: '0.8rem' }}>Campus Name *</label>
                  <input
                    type="text"
                    value={newCampusForm.name}
                    onChange={(e) => setNewCampusForm((p) => ({ ...p, name: e.target.value }))}
                    placeholder="Green Meadows"
                    className="admin-input"
                  />
                </div>
                <div className="admin-field">
                  <label style={{ fontWeight: 600, fontSize: '0.8rem' }}>Primary Location</label>
                  <input
                    type="text"
                    value={newCampusForm.location}
                    onChange={(e) => setNewCampusForm((p) => ({ ...p, location: e.target.value }))}
                    placeholder="Bhimavaram, West Godavari"
                    className="admin-input"
                  />
                </div>
                <div className="admin-field" style={{ gridColumn: '1 / -1' }}>
                  <label style={{ fontWeight: 600, fontSize: '0.8rem' }}>Main Campus Institutions (One per line)</label>
                  <textarea
                    value={newCampusForm.mainInstitutions.join('\n')}
                    onChange={(e) => setNewCampusForm((p) => ({ ...p, mainInstitutions: e.target.value.split('\n') }))}
                    placeholder="Vishnu Women's University&#10;Vishnu Institute of Technology"
                    className="admin-input"
                    rows={4}
                    style={{ width: '100%', fontFamily: 'inherit' }}
                  />
                </div>
              </div>

              {/* Sub Locations for New Campus */}
              <div style={{ background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '6px', padding: '0.75rem', margin: '0.75rem 0' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                  <strong style={{ fontSize: '0.78rem', color: '#334155' }}>Sub-Locations / Tagged Sections (e.g. South Campus)</strong>
                  <button
                    type="button"
                    onClick={() => setNewCampusForm((p) => ({ ...p, subLocations: [...p.subLocations, { tag: '', institutions: [''] }] }))}
                    className="admin-btn admin-btn--sm admin-btn--ghost"
                    style={{ fontSize: '0.72rem', padding: '0.15rem 0.4rem' }}
                  >
                    <Plus size={12} /> Add Sub-Location
                  </button>
                </div>

                {newCampusForm.subLocations.map((sub, sIdx) => (
                  <div key={sIdx} style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '6px', padding: '0.5rem', marginBottom: '0.5rem' }}>
                    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginBottom: '0.35rem' }}>
                      <input
                        type="text"
                        value={sub.tag}
                        onChange={(e) => {
                          const val = e.target.value;
                          setNewCampusForm((p) => ({
                            ...p,
                            subLocations: p.subLocations.map((item, i) => (i === sIdx ? { ...item, tag: val } : item)),
                          }));
                        }}
                        placeholder="Sub-Location Name (e.g. South Campus)"
                        className="admin-input"
                        style={{ fontSize: '0.78rem', fontWeight: 600, flex: 1 }}
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setNewCampusForm((p) => ({
                            ...p,
                            subLocations: p.subLocations.filter((_, i) => i !== sIdx),
                          }))
                        }
                        style={{ background: 'none', border: 'none', color: '#dc2626', cursor: 'pointer', padding: '0.2rem' }}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                    <textarea
                      value={sub.institutions.join('\n')}
                      onChange={(e) => {
                        const val = e.target.value.split('\n');
                        setNewCampusForm((p) => ({
                          ...p,
                          subLocations: p.subLocations.map((item, i) => (i === sIdx ? { ...item, institutions: val } : item)),
                        }));
                      }}
                      placeholder="Institutions for this location (one per line, e.g. Smt. B Seetha Polytechnic)"
                      className="admin-input"
                      rows={2}
                      style={{ width: '100%', fontFamily: 'inherit', fontSize: '0.78rem' }}
                    />
                  </div>
                ))}
              </div>

              <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
                <button type="button" onClick={() => setIsAddingCampus(false)} className="admin-btn admin-btn--sm admin-btn--ghost">Cancel</button>
                <button type="button" onClick={handleAddCampus} className="admin-btn admin-btn--sm admin-btn--primary"><Plus size={14} /> Add Campus Card</button>
              </div>
            </div>
          )}

          {/* Campuses Grid */}
          {campuses.length === 0 ? (
            <p style={{ fontStyle: 'italic', color: '#64748b', fontSize: '0.85rem' }}>No campuses configured yet. Click "Add Campus" above to add one.</p>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '0.85rem' }}>
              {campuses.map((c, idx) => {
                const isEditing = editingCampusId === c.id;
                const nameLower = c.name.toLowerCase();
                const displayLocation = (nameLower.includes('lake view') || idx === 3)
                  ? (c.location && c.location !== 'Aziz Nagar' && c.location !== 'Hyderabad' ? c.location : 'Hyderabad & Bangalore')
                  : c.location;

                const { mainInsts, subLocs } = parseCampusInstitutions(c.name, c.institutions || []);
                const totalInsts = mainInsts.length + subLocs.reduce((acc, s) => acc + s.institutions.length, 0);

                return (
                  <div key={c.id} style={{ background: '#f8fafc', border: isEditing ? '2px solid #0284c7' : '1px solid #e2e8f0', borderRadius: '10px', padding: '0.85rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    {isEditing ? (
                      <div>
                        <div style={{ fontWeight: 700, fontSize: '0.88rem', color: '#0369a1', marginBottom: '0.65rem', borderBottom: '1px solid #bae6fd', paddingBottom: '0.3rem' }}>
                          Edit Campus Card: {c.name}
                        </div>

                        <div className="admin-field" style={{ marginBottom: '0.45rem' }}>
                          <label style={{ fontSize: '0.75rem', fontWeight: 600 }}>Campus Name *</label>
                          <input
                            type="text"
                            value={campusForm.name}
                            onChange={(e) => setCampusForm((p) => ({ ...p, name: e.target.value }))}
                            className="admin-input"
                            style={{ fontSize: '0.82rem' }}
                          />
                        </div>
                        <div className="admin-field" style={{ marginBottom: '0.45rem' }}>
                          <label style={{ fontSize: '0.75rem', fontWeight: 600 }}>Primary Location</label>
                          <input
                            type="text"
                            value={campusForm.location}
                            onChange={(e) => setCampusForm((p) => ({ ...p, location: e.target.value }))}
                            className="admin-input"
                            style={{ fontSize: '0.82rem' }}
                          />
                        </div>

                        <div className="admin-field" style={{ marginBottom: '0.6rem' }}>
                          <label style={{ fontSize: '0.75rem', fontWeight: 600 }}>Main Campus Institutions (One per line)</label>
                          <textarea
                            value={campusForm.mainInstitutions.join('\n')}
                            onChange={(e) => setCampusForm((p) => ({ ...p, mainInstitutions: e.target.value.split('\n') }))}
                            className="admin-input"
                            rows={3}
                            style={{ width: '100%', fontFamily: 'inherit', fontSize: '0.8rem' }}
                            placeholder="Vishnu Women's University&#10;Vishnu Institute of Technology"
                          />
                        </div>

                        {/* Sub-Locations inside Edit Mode */}
                        <div style={{ background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '6px', padding: '0.5rem', marginBottom: '0.65rem' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                            <strong style={{ fontSize: '0.74rem', color: '#334155' }}>Sub-Locations (e.g. South Campus)</strong>
                            <button
                              type="button"
                              onClick={() => setCampusForm((p) => ({ ...p, subLocations: [...p.subLocations, { tag: '', institutions: [''] }] }))}
                              className="admin-btn admin-btn--sm admin-btn--ghost"
                              style={{ fontSize: '0.7rem', padding: '0.1rem 0.35rem' }}
                            >
                              <Plus size={11} /> Add Location
                            </button>
                          </div>

                          {campusForm.subLocations.length === 0 ? (
                            <p style={{ fontSize: '0.72rem', color: '#94a3b8', fontStyle: 'italic', margin: 0 }}>
                              No sub-locations added. Click "+ Add Location" to add one.
                            </p>
                          ) : (
                            campusForm.subLocations.map((sub, sIdx) => (
                              <div key={sIdx} style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '6px', padding: '0.4rem', marginBottom: '0.4rem' }}>
                                <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center', marginBottom: '0.25rem' }}>
                                  <input
                                    type="text"
                                    value={sub.tag}
                                    onChange={(e) => {
                                      const val = e.target.value;
                                      setCampusForm((p) => ({
                                        ...p,
                                        subLocations: p.subLocations.map((item, i) => (i === sIdx ? { ...item, tag: val } : item)),
                                      }));
                                    }}
                                    placeholder="Location Tag (e.g. South Campus)"
                                    className="admin-input"
                                    style={{ fontSize: '0.75rem', fontWeight: 600, flex: 1 }}
                                  />
                                  <button
                                    type="button"
                                    onClick={() =>
                                      setCampusForm((p) => ({
                                        ...p,
                                        subLocations: p.subLocations.filter((_, i) => i !== sIdx),
                                      }))
                                    }
                                    style={{ background: 'none', border: 'none', color: '#dc2626', cursor: 'pointer', padding: '0.15rem' }}
                                    title="Remove Location"
                                  >
                                    <Trash2 size={13} />
                                  </button>
                                </div>
                                <textarea
                                  value={sub.institutions.join('\n')}
                                  onChange={(e) => {
                                    const val = e.target.value.split('\n');
                                    setCampusForm((p) => ({
                                      ...p,
                                      subLocations: p.subLocations.map((item, i) => (i === sIdx ? { ...item, institutions: val } : item)),
                                    }));
                                  }}
                                  placeholder="Institutions for this location (one per line)"
                                  className="admin-input"
                                  rows={2}
                                  style={{ width: '100%', fontFamily: 'inherit', fontSize: '0.75rem' }}
                                />
                              </div>
                            ))
                          )}
                        </div>

                        <div style={{ display: 'flex', gap: '0.4rem', justifyContent: 'flex-end' }}>
                          <button type="button" onClick={() => setEditingCampusId(null)} className="admin-btn admin-btn--sm admin-btn--ghost">Cancel</button>
                          <button type="button" onClick={() => handleSaveCampusEdit(c.id)} className="admin-btn admin-btn--sm admin-btn--primary"><Save size={12} /> Save</button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.3rem' }}>
                            <strong style={{ fontSize: '0.92rem', color: '#0f172a' }}>{c.name}</strong>
                            <span style={{ fontSize: '0.72rem', color: '#94a3b8', background: '#e2e8f0', padding: '0.1rem 0.35rem', borderRadius: '4px' }}>
                              #{idx + 1}
                            </span>
                          </div>
                          <div style={{ fontSize: '0.78rem', color: '#0284c7', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.2rem', marginBottom: '0.35rem' }}>
                            <MapPin size={12} /> {displayLocation}
                          </div>

                          <div style={{ fontSize: '0.75rem', color: '#475569', marginBottom: '0.5rem', background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '6px', padding: '0.45rem 0.55rem' }}>
                            <div style={{ fontWeight: 600, color: '#334155', marginBottom: '0.25rem', fontSize: '0.72rem' }}>
                              {totalInsts} {totalInsts === 1 ? 'Institution' : 'Institutions'} listed:
                            </div>

                            {/* Main Institutions */}
                            {mainInsts.length > 0 && (
                              <ul style={{ margin: '0 0 0.35rem 0', paddingLeft: '0.85rem', listStyleType: 'disc', fontSize: '0.72rem', color: '#334155' }}>
                                {mainInsts.map((inst, iIdx) => (
                                  <li key={iIdx} style={{ marginBottom: '0.1rem' }}>{inst}</li>
                                ))}
                              </ul>
                            )}

                            {/* Sub Locations / Tagged Campuses */}
                            {subLocs.map((sub, sIdx) => (
                              <div key={sIdx} style={{ marginTop: '0.3rem', borderTop: sIdx > 0 || mainInsts.length > 0 ? '1px dashed #e2e8f0' : 'none', paddingTop: '0.25rem' }}>
                                {sub.tag && (
                                  <span style={{ fontSize: '0.64rem', fontWeight: 700, color: '#d97706', background: '#fef3c7', padding: '0.05rem 0.3rem', borderRadius: '3px', textTransform: 'uppercase', display: 'inline-block', marginBottom: '0.15rem' }}>
                                    {sub.tag}
                                  </span>
                                )}
                                <ul style={{ margin: 0, paddingLeft: '0.85rem', listStyleType: 'disc', fontSize: '0.72rem', color: '#475569' }}>
                                  {sub.institutions.map((inst, iIdx) => (
                                    <li key={iIdx}>{inst}</li>
                                  ))}
                                </ul>
                              </div>
                            ))}
                          </div>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '0.2rem', marginTop: '0.6rem', borderTop: '1px solid #f1f5f9', paddingTop: '0.4rem' }}>
                          <button type="button" onClick={() => handleMoveCampus(idx, 'up')} disabled={idx === 0} title="Move Up" className="admin-btn admin-btn--sm admin-btn--ghost" style={{ padding: '0.2rem 0.35rem' }}>
                            <ArrowUp size={12} />
                          </button>
                          <button type="button" onClick={() => handleMoveCampus(idx, 'down')} disabled={idx === campuses.length - 1} title="Move Down" className="admin-btn admin-btn--sm admin-btn--ghost" style={{ padding: '0.2rem 0.35rem' }}>
                            <ArrowDown size={12} />
                          </button>
                          <button type="button" onClick={() => startEditCampus(c, idx)} title="Edit" className="admin-btn admin-btn--sm admin-btn--ghost" style={{ padding: '0.2rem 0.35rem' }}>
                            <Edit2 size={12} />
                          </button>
                          <button type="button" onClick={() => handleDeleteCampus(c.id)} title="Delete" className="admin-btn admin-btn--sm admin-btn--ghost" style={{ padding: '0.2rem 0.35rem', color: '#dc2626' }}>
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

        {/* 6. LIFE ACROSS OUR CAMPUSES GALLERY COPY */}
        <div id="sec-gallery" style={{ background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '10px', padding: '1.25rem', marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem', borderBottom: '2px solid #e2e8f0', paddingBottom: '0.5rem' }}>
            <Sparkles size={18} color="#0284c7" />
            <h3 style={{ margin: 0, fontSize: '1.05rem', color: '#0f172a' }}>6. "Life Across Our Campuses" Gallery Copy</h3>
          </div>
          <p className="admin-field__hint" style={{ marginBottom: '1rem' }}>
            Configures heading text shown alongside the campus photo grid. Photos are managed under <em>Website Photos (page: about-sves, section: main)</em>.
          </p>

          <div className="admin-form-grid">
            <TextField label="Eyebrow Label" value={data.galleryLabel} onChange={(v) => set('galleryLabel', v)} placeholder="ACROSS SVES" />
            <TextField label="Gallery Title" value={data.galleryTitle} onChange={(v) => set('galleryTitle', v)} placeholder="Life Across Our Campuses" />
            <TextField label="Gallery Subtitle" value={data.gallerySubtitle} onChange={(v) => set('gallerySubtitle', v)} />
          </div>
        </div>

        {/* 7. MILESTONES IN OUR JOURNEY */}
        <div id="sec-milestones" style={{ background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '10px', padding: '1.25rem', marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem', marginBottom: '0.75rem', borderBottom: '2px solid #e2e8f0', paddingBottom: '0.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Calendar size={18} color="#0284c7" />
              <h3 style={{ margin: 0, fontSize: '1.05rem', color: '#0f172a' }}>7. Milestones in Our Journey</h3>
            </div>
            <button type="button" onClick={() => setIsAddingMilestone(true)} className="admin-btn admin-btn--sm admin-btn--primary">
              <Plus size={14} /> Add Milestone
            </button>
          </div>

          <div className="admin-form-grid" style={{ marginBottom: '1.25rem' }}>
            <TextField label="Section Heading" value={data.milestonesHeading} onChange={(v) => set('milestonesHeading', v)} placeholder="Milestones in the SVES Journey" />
            <div className="admin-field" style={{ gridColumn: '1 / -1' }}>
              <label style={{ fontWeight: 600 }}>Section Paragraph</label>
              <textarea
                value={data.milestonesParagraph}
                onChange={(e) => set('milestonesParagraph', e.target.value)}
                className="admin-input"
                rows={2}
                style={{ width: '100%', fontFamily: 'inherit' }}
              />
            </div>
          </div>

          <h4 style={{ fontSize: '0.92rem', color: '#334155', marginBottom: '0.5rem' }}>
            Dynamic Milestones Timeline ({milestonesBlocks.length})
          </h4>
          <p className="admin-field__hint" style={{ marginBottom: '0.75rem' }}>
            These timeline points appear on the gradient milestone band. Also accessible under Page Content Blocks (About SVES — Milestones).
          </p>

          {/* Add Milestone Form */}
          {isAddingMilestone && (
            <div style={{ background: '#f0f9ff', border: '1px solid #bae6fd', borderRadius: '8px', padding: '0.75rem', marginBottom: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <strong style={{ fontSize: '0.85rem', color: '#0369a1' }}>New Milestone</strong>
                <button type="button" onClick={() => setIsAddingMilestone(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}>
                  <X size={16} />
                </button>
              </div>
              <div className="admin-form-grid">
                <div className="admin-field">
                  <label>Year / Date Title * (e.g. 1992)</label>
                  <input
                    type="text"
                    value={newMilestoneForm.title}
                    onChange={(e) => setNewMilestoneForm((p) => ({ ...p, title: e.target.value }))}
                    placeholder="1992"
                    className="admin-input"
                  />
                </div>
                <div className="admin-field" style={{ gridColumn: '1 / -1' }}>
                  <label>Milestone Details * (Use **bold** for bold text)</label>
                  <textarea
                    value={newMilestoneForm.desc}
                    onChange={(e) => setNewMilestoneForm((p) => ({ ...p, desc: e.target.value }))}
                    placeholder="Establishment of Sri Vishnu Educational Society..."
                    className="admin-input"
                    rows={2}
                    style={{ width: '100%', fontFamily: 'inherit' }}
                  />
                </div>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
                <button type="button" onClick={() => setIsAddingMilestone(false)} className="admin-btn admin-btn--sm admin-btn--ghost">Cancel</button>
                <button type="button" onClick={handleAddMilestone} className="admin-btn admin-btn--sm admin-btn--primary"><Plus size={14} /> Add Milestone</button>
              </div>
            </div>
          )}

          {/* Milestones List */}
          {milestonesBlocks.length === 0 ? (
            <p style={{ fontStyle: 'italic', color: '#64748b', fontSize: '0.85rem' }}>No milestones configured yet. Click "Add Milestone" above to create one.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {milestonesBlocks.map((m, idx) => {
                const isEditing = editingMilestoneId === m.id;
                return (
                  <div key={m.id} style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '0.75rem', display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                    <span style={{ background: '#fef3c7', color: '#b45309', fontWeight: 800, fontSize: '0.85rem', padding: '0.2rem 0.5rem', borderRadius: '4px', minWidth: '55px', textAlign: 'center', marginTop: '2px' }}>
                      {m.title}
                    </span>

                    {isEditing ? (
                      <div style={{ flex: 1 }}>
                        <input
                          type="text"
                          value={milestoneForm.title}
                          onChange={(e) => setMilestoneForm((p) => ({ ...p, title: e.target.value }))}
                          className="admin-input"
                          style={{ width: '100%', marginBottom: '0.4rem', fontWeight: 700 }}
                          placeholder="Year (e.g. 1992)"
                        />
                        <textarea
                          value={milestoneForm.desc}
                          onChange={(e) => setMilestoneForm((p) => ({ ...p, desc: e.target.value }))}
                          className="admin-input"
                          rows={2}
                          style={{ width: '100%', marginBottom: '0.5rem', fontFamily: 'inherit' }}
                        />
                        <div style={{ display: 'flex', gap: '0.4rem', justifyContent: 'flex-end' }}>
                          <button type="button" onClick={() => setEditingMilestoneId(null)} className="admin-btn admin-btn--sm admin-btn--ghost">Cancel</button>
                          <button type="button" onClick={() => handleSaveMilestoneEdit(m.id)} className="admin-btn admin-btn--sm admin-btn--primary">Save</button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div style={{ flex: 1, fontSize: '0.88rem', color: '#1e293b', lineHeight: 1.5 }}>
                          {m.desc}
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                          <button type="button" onClick={() => handleMoveMilestone(idx, 'up')} disabled={idx === 0} title="Move Up" className="admin-btn admin-btn--sm admin-btn--ghost" style={{ padding: '0.25rem 0.4rem' }}>
                            <ArrowUp size={13} />
                          </button>
                          <button type="button" onClick={() => handleMoveMilestone(idx, 'down')} disabled={idx === milestonesBlocks.length - 1} title="Move Down" className="admin-btn admin-btn--sm admin-btn--ghost" style={{ padding: '0.25rem 0.4rem' }}>
                            <ArrowDown size={13} />
                          </button>
                          <button type="button" onClick={() => { setEditingMilestoneId(m.id); setMilestoneForm({ title: m.title, desc: m.desc || '' }); }} title="Edit" className="admin-btn admin-btn--sm admin-btn--ghost" style={{ padding: '0.25rem 0.4rem' }}>
                            <Edit2 size={13} />
                          </button>
                          <button type="button" onClick={() => handleDeleteMilestone(m.id)} title="Delete" className="admin-btn admin-btn--sm admin-btn--ghost" style={{ padding: '0.25rem 0.4rem', color: '#dc2626' }}>
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

        {/* 8. CLOSING CTA SECTION */}
        <div id="sec-cta" style={{ background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '10px', padding: '1.25rem', marginBottom: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem', borderBottom: '2px solid #e2e8f0', paddingBottom: '0.5rem' }}>
            <ExternalLink size={18} color="#0284c7" />
            <h3 style={{ margin: 0, fontSize: '1.05rem', color: '#0f172a' }}>8. Closing Call-To-Action (CTA)</h3>
          </div>

          <div className="admin-form-grid">
            <TextField label="CTA Eyebrow" value={data.ctaEyebrow} onChange={(v) => set('ctaEyebrow', v)} />
            <TextField label="CTA Heading" value={data.ctaHeading} onChange={(v) => set('ctaHeading', v)} />
            <ParagraphsField label="CTA Paragraphs" value={data.ctaParagraphs} onChange={(v) => set('ctaParagraphs', v)} rows={3} />
            <TextField label="CTA Button Label" value={data.ctaButtonLabel} onChange={(v) => set('ctaButtonLabel', v)} />
          </div>
        </div>
      </div>
    </div>
  );
}

