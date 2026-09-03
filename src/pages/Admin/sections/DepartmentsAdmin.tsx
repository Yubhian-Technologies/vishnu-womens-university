import { useEffect, useState } from 'react';
import { collection, addDoc, deleteDoc, doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../../lib/firebase';
import { useOrderedCollection } from '../../../hooks/useCollection';
import ImageUploader from '../../../components/ImageUploader/ImageUploader';
import FileUploader from '../../../components/FileUploader/FileUploader';
import { deleteFile, type UploadResult } from '../../../lib/storage';
import { PROGRAM_ICON_NAMES } from '../../../lib/programIcons';
import { normalizeLab, type LabItem, type LibrarySection, type LibraryItem, type NewsEventsYear, type ProgramLink, type ProgramDoc } from './ProgramsAdmin';
import NewsEventsYearsEditor from './NewsEventsYearsEditor';
import { diffChangedFields } from '../../../lib/formDiff';
import { PlacementYearsEditor, InternshipYearsEditor, RndEditor, NewsletterYearsEditor } from './ProgramCareerEditors';
import { downloadPlacementsTemplate } from '../../../lib/placementsImport';
import { downloadInternshipsTemplate } from '../../../lib/internshipsImport';
import CustomSectionEditor from './CustomSectionEditor';
import { replaceAtPath, getAtPath, type CustomSection } from '../../../lib/customSections';
import { FRESHMAN_DEPARTMENT_SEEDS } from '../../Academics/freshmanDepartmentSeeds';
import { STANDALONE_DEPARTMENTS } from '../../../lib/departmentGroups';

// Backs the "Academic Departments" card grid on Academics.tsx — independent
// of the `programs` collection, so a department's card copy doesn't have to
// borrow one specific program's name/about text (which broke down once a
// department groups more than one program, e.g. AI&ML + AI&DS under "AI").
//
// The extra fields below (about / hod* / labs / vision …) power the grouped
// department pages (AI, CSE, ECE — see src/lib/departmentGroups.ts): the
// shared top of /academics/<grouped-slug> reads from this doc, matched by
// `shortCode`. They're all optional — a plain department card ignores them.
export interface ProgramLevelRow {
  program: string;
  intake: string;
}

export interface ProgramLevel {
  title: string;
  intro: string;
  rows: ProgramLevelRow[];
}

export interface DepartmentDoc {
  id: string;
  title: string;
  shortCode: string;
  description: string;
  icon: string;
  order: number;
  // Grouped-department page (shared top) content — all optional.
  heroImage?: string;
  storagePath?: string;
  about?: string;
  // Same shape/purpose as a programme's own (see ProgramsAdmin) — shown
  // right below "About the Department" on the grouped department page,
  // filling the space that used to be empty next to the Quick Links sidebar
  // whenever "About" itself was short.
  highlights?: string[];
  established?: string;
  accreditation?: string;
  hod?: string;
  hodImage?: string;
  hodImageStoragePath?: string;
  hodEmail?: string;
  hodMessage?: string;
  hodResearchProfiles?: ProgramLink[];
  vision?: string;
  mission?: string[];
  coreValues?: string[];
  // Same shape as a programme's own (see ProgramsAdmin) — a department's
  // labs are no longer editable per-programme, so this is the only place
  // they're entered. Legacy docs may still hold plain strings; normalizeLab()
  // upgrades either shape at read time.
  labs?: (string | LabItem)[];
  // Digital Library — same shape as a programme's own (see ProgramsAdmin),
  // shown as a shared section before the program toggle on the grouped
  // department page.
  libraryIntro?: string;
  libraryInCharge?: string;
  librarySections?: LibrarySection[];
  // Programme Levels (e.g. "B.Tech.", "M.Tech.") — each a heading + intro
  // paragraph + an intake table, shown right below "About the Department".
  programLevels?: ProgramLevel[];
  // Placements — shared across the department's programmes. placementStats
  // reuses the { label, value } shape (e.g. "Highest Package" / "₹12 LPA").
  placementIntro?: string;
  placementStats?: LibraryItem[];
  placementRecruiters?: string[];
  // News & Events — department-wide, split into three admin-defined
  // categories shown as tabs on the public page (see NewsEventsTabs). Each
  // is the same academic-year table shape as everything else here. No
  // per-programme editing exists for this anymore; `newsEventsYears` used to
  // live on ProgramDoc — legacy content there is picked up by "Copy from
  // Programs" below.
  newsEventsYears?: NewsEventsYear[];
  studentAwardsYears?: NewsEventsYear[];
  othersYears?: NewsEventsYear[];
  // Any name, any number of sub-sections, any content type (text/table/
  // list/links/files/gallery/panel view) — same system as Programs/
  // Differentiators/Faculty/Campus Life. Exists specifically so a
  // standalone department with no linked programme (e.g. Freshman
  // Engineering's Mathematics/Physics/Chemistry/English — see
  // StandaloneDepartmentDetail.tsx) can still have Research & Development,
  // Awards & Recognitions, and Laboratories-with-real-photos, none of
  // which have another home when there's no programme doc to carry them.
  // Additive for every other department too, not just standalone ones —
  // rendered alongside (not instead of) the grouped department page's
  // existing Program-sourced customSections.
  customSections?: CustomSection[];
}

const EMPTY: Omit<DepartmentDoc, 'id'> = {
  title: '', shortCode: '', description: '', icon: 'GraduationCap', order: 0,
  heroImage: '', storagePath: '', about: '', highlights: [], established: '', accreditation: '',
  hod: '', hodImage: '', hodImageStoragePath: '', hodEmail: '', hodMessage: '', hodResearchProfiles: [],
  vision: '', mission: [], coreValues: [], labs: [],
  libraryIntro: '', libraryInCharge: '', librarySections: [],
  programLevels: [],
  placementIntro: '', placementStats: [], placementRecruiters: [],
  newsEventsYears: [], studentAwardsYears: [], othersYears: [],
  customSections: [],
};

function linesToArray(text: string): string[] {
  return text.split('\n').map((s) => s.trim());
}
function arrayToLines(arr: string[] = []): string {
  return arr.join('\n');
}
function linksToText(links: ProgramLink[] = []): string {
  return links.map((l) => `${l.label}: ${l.url}`).join('\n');
}
function textToLinks(text: string): ProgramLink[] {
  return linesToArray(text).map((line) => {
    const idx = line.indexOf(':');
    return {
      label: (idx === -1 ? line : line.slice(0, idx)).trim(),
      url: (idx === -1 ? '' : line.slice(idx + 1)).trim(),
    };
  }).filter((l) => l.label && l.url);
}

// A couple of legacy `programs` docs spell out their department in prose
// ("Civil", "Mechanical") rather than the Academic Departments admin's short
// code ("CE", "ME") — this is the only place that mismatch needs correcting
// for the copy-from-programs match below; every other department's programs
// already use its short code exactly.
const DEPT_PROGRAM_CODE_ALIASES: Record<string, string> = { Civil: 'CE', Mechanical: 'ME' };

// How much Vision/Mission/Values/Labs/Library content a program actually
// has — used to pick which of a department's programs to copy from when it
// has more than one (e.g. CSE also has M.Tech./Ph.D. programs alongside the
// B.Tech. one that actually carries this content).
function programRichness(p: ProgramDoc): number {
  return (p.vision ? 100 : 0)
    + (p.mission?.length || 0) * 10
    + (p.coreValues?.length || 0) * 5
    + (p.labs?.length || 0) * 3
    + (p.libraryIntro || p.libraryInCharge || p.librarySections?.length ? 50 : 0);
}

export default function DepartmentsAdmin() {
  const { docs: departments, loading } = useOrderedCollection<DepartmentDoc>('departments', 'order');
  const { docs: allPrograms } = useOrderedCollection<ProgramDoc>('programs', 'order');
  const [form, setForm] = useState<Omit<DepartmentDoc, 'id'>>(EMPTY);
  // Snapshot of `form` taken when "Edit" was clicked (see startEdit) — save()
  // diffs against this so Update only writes fields actually changed in this
  // session, instead of blindly overwriting the whole doc with a possibly
  // stale copy (see lib/formDiff.ts). null while adding a new department.
  const [originalForm, setOriginalForm] = useState<Omit<DepartmentDoc, 'id'> | null>(null);
  const [editing, setEditing] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [copying, setCopying] = useState(false);

  const set = (k: string, v: string | number | string[] | LibrarySection[] | ProgramLevel[] | LibraryItem[] | LabItem[] | NewsEventsYear[] | ProgramLink[] | CustomSection[]) => setForm((p) => ({ ...p, [k]: v }));
  const handleHero = (r: UploadResult) => setForm((p) => ({ ...p, heroImage: r.url, storagePath: r.path }));
  const handleHodImage = (r: UploadResult) => setForm((p) => ({ ...p, hodImage: r.url, hodImageStoragePath: r.path }));

  // Custom Sections — same wiring as ProgramsAdmin.tsx/DifferentiatorsAdmin.tsx/
  // FacultyAdmin.tsx/CampusLifeAdmin.tsx.
  const handleCustomSectionFileUploaded = (sectionPath: number[], fileIndex: number, r: UploadResult) => {
    setForm((p) => ({
      ...p,
      customSections: replaceAtPath(p.customSections || [], sectionPath, (s) => ({
        ...s,
        files: (s.files || []).map((f, i) => (i === fileIndex ? { ...f, fileUrl: r.url, storagePath: r.path } : f)),
      })),
    }));
  };
  const handleCustomSectionFileRemoved = async (sectionPath: number[], fileIndex: number) => {
    const file = getAtPath(form.customSections || [], sectionPath)?.files?.[fileIndex];
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
      customSections: replaceAtPath(p.customSections || [], sectionPath, (s) => ({
        ...s,
        files: (s.files || []).filter((_, i) => i !== fileIndex),
      })),
    }));
  };
  const handleCustomSectionPhotoUploaded = (sectionPath: number[], r: UploadResult) => {
    setForm((p) => ({
      ...p,
      customSections: replaceAtPath(p.customSections || [], sectionPath, (s) => ({
        ...s,
        photo: { imageUrl: r.url, storagePath: r.path },
      })),
    }));
  };
  const handleCustomSectionPhotoRemoved = async (sectionPath: number[]) => {
    const photo = getAtPath(form.customSections || [], sectionPath)?.photo;
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
      customSections: replaceAtPath(p.customSections || [], sectionPath, (s) => {
        const next = { ...s };
        delete next.photo;
        return next;
      }),
    }));
  };
  const handleCustomSectionGalleryPhotoUploaded = (sectionPath: number[], photoIndex: number, r: UploadResult) => {
    setForm((p) => ({
      ...p,
      customSections: replaceAtPath(p.customSections || [], sectionPath, (s) => ({
        ...s,
        galleryPhotos: (s.galleryPhotos || []).map((ph, i) => (i === photoIndex ? { imageUrl: r.url, storagePath: r.path } : ph)),
      })),
    }));
  };
  const handleCustomSectionGalleryPhotoRemoved = async (sectionPath: number[], photoIndex: number) => {
    const photo = getAtPath(form.customSections || [], sectionPath)?.galleryPhotos?.[photoIndex];
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
      customSections: replaceAtPath(p.customSections || [], sectionPath, (s) => ({
        ...s,
        galleryPhotos: (s.galleryPhotos || []).filter((_, i) => i !== photoIndex),
      })),
    }));
  };

  // One-time starter content for the 4 standalone Freshman Engineering
  // departments (Mathematics/Physics/Chemistry/English) — pre-fills the
  // whole Add form (title/shortCode/about/customSections for Laboratories/
  // Research & Development/Awards & Recognitions) from the content that
  // used to be hardcoded in FreshmanEngineering.tsx, so nothing is lost in
  // moving them to real Department records. Only offered for a shortCode
  // that's both known and not already created.
  const quickAddFreshman = (shortCode: string) => {
    const seed = FRESHMAN_DEPARTMENT_SEEDS[shortCode];
    if (!seed) return;
    setEditing(null);
    setForm({ ...EMPTY, ...seed() });
  };
  const freshmanNotYetCreated = Object.keys(FRESHMAN_DEPARTMENT_SEEDS)
    .filter((code) => !departments.some((d) => d.shortCode === code));

  // Vision/Mission/Values, Laboratories, and the Department Library used to
  // be edited per-programme; a lot of departments already have this content
  // sitting on their programme(s) from before that changed. This one-click
  // action copies it over — per department, from whichever of its programs
  // has the most of it (see programRichness) — filling in only the fields a
  // department doc doesn't already have, so it never overwrites anything an
  // admin has already entered directly on the department.
  const matchingPrograms = (d: DepartmentDoc) => {
    const code = d.shortCode.trim().toUpperCase();
    return allPrograms.filter((p) => (DEPT_PROGRAM_CODE_ALIASES[p.department] || p.department || '').trim().toUpperCase() === code);
  };

  // Placements/Internships/R&D/Newsletter — moved here from Admin → Programs
  // (per-programme data still lives on each programme's own `programs/{id}`
  // doc, completely unchanged; only where it's edited moved). A department
  // that groups more than one programme (AI/CSE/ECE) needs a picker to say
  // which programme's data these four cards below are currently showing —
  // `matchingPrograms` above already finds them by department Short Code.
  const editingDept = editing ? departments.find((d) => d.id === editing) || null : null;
  const careerPrograms = editingDept ? matchingPrograms(editingDept) : [];
  const [selectedProgramId, setSelectedProgramId] = useState('');
  useEffect(() => {
    setSelectedProgramId('');
  }, [editing]);
  const selectedProgram = careerPrograms.find((p) => p.id === selectedProgramId) || careerPrograms[0] || null;
  // News & Events and the HOD fields aren't part of programRichness (they're
  // separate legacy fields, not one of Vision/Mission/Values/Labs/Library) —
  // each found independently as whichever matching program still has it,
  // same "first non-empty wins" rule the grouped department page itself
  // already uses when pooling across AI&ML/AI&DS etc. A department's HOD is
  // one person, not a blend, so this picks one whole program's set of HOD
  // fields together rather than mixing, say, one program's photo with
  // another's message.
  const legacyNewsEvents = (matches: ProgramDoc[]) => matches.map((p) => p.newsEventsYears).find((arr) => arr && arr.length > 0);
  const hasHodInfo = (p: ProgramDoc) => !!(p.hod || p.hodImage || p.hodEmail || p.hodMessage || p.hodResearchProfiles?.length);
  const legacyHod = (matches: ProgramDoc[]) => matches.find(hasHodInfo);
  const departmentsMissingContent = departments.filter((d) => {
    const matches = matchingPrograms(d);
    const richest = matches.reduce((best: ProgramDoc | null, p) => (!best || programRichness(p) > programRichness(best) ? p : best), null);
    const news = legacyNewsEvents(matches);
    const hodSource = legacyHod(matches);
    const hasOwnHod = !!(d.hod || d.hodImage || d.hodEmail || d.hodMessage || d.hodResearchProfiles?.length);
    const missing = (richest && programRichness(richest) > 0 && (
      !d.vision && !!richest.vision
      || !(d.mission?.length) && !!richest.mission?.length
      || !(d.coreValues?.length) && !!richest.coreValues?.length
      || !(d.labs?.length) && !!richest.labs?.length
      || !d.libraryIntro && !!richest.libraryIntro
      || !d.libraryInCharge && !!richest.libraryInCharge
      || !(d.librarySections?.length) && !!richest.librarySections?.length
    )) || (!(d.newsEventsYears?.length) && !!news?.length) || (!hasOwnHod && !!hodSource);
    return missing;
  });
  const copyFromPrograms = async () => {
    if (!confirm(`Copy Vision/Mission/Values, Laboratories, Department Library, News & Events, and Head of Department from each department's programme(s) into ${departmentsMissingContent.length} department(s) that don't already have it? This never overwrites content already entered directly on a department.`)) return;
    setCopying(true);
    try {
      for (const d of departmentsMissingContent) {
        const matches = matchingPrograms(d);
        const richest = matches.reduce((best: ProgramDoc | null, p) => (!best || programRichness(p) > programRichness(best) ? p : best), null);
        const news = legacyNewsEvents(matches);
        const hodSource = legacyHod(matches);
        const hasOwnHod = !!(d.hod || d.hodImage || d.hodEmail || d.hodMessage || d.hodResearchProfiles?.length);
        const patch: Record<string, unknown> = {};
        if (richest) {
          if (!d.vision && richest.vision) patch.vision = richest.vision;
          if (!(d.mission?.length) && richest.mission?.length) patch.mission = richest.mission;
          if (!(d.coreValues?.length) && richest.coreValues?.length) patch.coreValues = richest.coreValues;
          if (!(d.labs?.length) && richest.labs?.length) patch.labs = richest.labs;
          if (!d.libraryIntro && richest.libraryIntro) patch.libraryIntro = richest.libraryIntro;
          if (!d.libraryInCharge && richest.libraryInCharge) patch.libraryInCharge = richest.libraryInCharge;
          if (!(d.librarySections?.length) && richest.librarySections?.length) patch.librarySections = richest.librarySections;
        }
        if (!(d.newsEventsYears?.length) && news?.length) patch.newsEventsYears = news;
        if (!hasOwnHod && hodSource) {
          if (hodSource.hod) patch.hod = hodSource.hod;
          if (hodSource.hodImage) { patch.hodImage = hodSource.hodImage; patch.hodImageStoragePath = hodSource.hodImageStoragePath || ''; }
          if (hodSource.hodEmail) patch.hodEmail = hodSource.hodEmail;
          if (hodSource.hodMessage) patch.hodMessage = hodSource.hodMessage;
          if (hodSource.hodResearchProfiles?.length) patch.hodResearchProfiles = hodSource.hodResearchProfiles;
        }
        if (Object.keys(patch).length > 0) await updateDoc(doc(db, 'departments', d.id), patch);
      }
      alert(`Copied into ${departmentsMissingContent.length} department(s).`);
    } catch (e) {
      alert(`Couldn't finish copying: ${(e as Error).message}`);
    } finally {
      setCopying(false);
    }
  };

  // Laboratories editor — same shape/pattern as the old per-programme one in
  // ProgramsAdmin, each lab independently backed by its own uploaded PDF.
  //
  // These all update via the functional `setForm(p => ...)` form (reading
  // `p.labs`), never the `labs` snapshot below — that snapshot is only for
  // rendering. Uploading PDFs for several labs in quick succession fires
  // several overlapping async `handleLabPdf` calls; if each one computed its
  // next array from the same stale outer `labs` closure, whichever upload's
  // state write landed last would silently overwrite every other lab's
  // just-uploaded pdfUrl with its own stale copy of the list — losing
  // already-successful uploads without any error.
  const labs = (form.labs || []).map(normalizeLab);
  const addLab = () => {
    setForm((p) => ({ ...p, labs: [...(p.labs || []).map(normalizeLab), { name: '' }] }));
  };
  const updateLabName = (li: number, name: string) => {
    setForm((p) => ({ ...p, labs: (p.labs || []).map(normalizeLab).map((l, i) => (i === li ? { ...l, name } : l)) }));
  };
  const updateLabDescription = (li: number, description: string) => {
    setForm((p) => ({ ...p, labs: (p.labs || []).map(normalizeLab).map((l, i) => (i === li ? { ...l, description } : l)) }));
  };
  const moveLab = (li: number, dir: -1 | 1) => {
    setForm((p) => {
      const next = (p.labs || []).map(normalizeLab);
      const target = li + dir;
      if (target < 0 || target >= next.length) return p;
      [next[li], next[target]] = [next[target], next[li]];
      return { ...p, labs: next };
    });
  };
  const removeLab = (li: number) => {
    setForm((p) => ({ ...p, labs: (p.labs || []).map(normalizeLab).filter((_, i) => i !== li) }));
  };
  const handleLabPdf = (li: number, r: UploadResult) => {
    setForm((p) => ({ ...p, labs: (p.labs || []).map(normalizeLab).map((l, i) => (i === li ? { ...l, pdfUrl: r.url, pdfStoragePath: r.path } : l)) }));
  };
  const removeLabPdf = async (li: number) => {
    const lab = labs[li];
    if (!lab?.pdfUrl) return;
    if (!confirm('Remove this PDF? This cannot be undone.')) return;
    try {
      if (lab.pdfStoragePath) await deleteFile(lab.pdfStoragePath);
    } catch (e) {
      alert(`Couldn't delete the file from storage: ${(e as Error).message}`);
      return;
    }
    setForm((p) => ({ ...p, labs: (p.labs || []).map(normalizeLab).map((l, i) => (i === li ? { ...l, pdfUrl: '', pdfStoragePath: '' } : l)) }));
  };

  // Digital Library section editor — same add/reorder/remove pattern as the
  // per-programme one in ProgramsAdmin.
  const librarySections = form.librarySections || [];
  const addLibrarySection = () => {
    set('librarySections', [...librarySections, { heading: `Section ${librarySections.length + 1}`, items: [] }]);
  };
  const updateLibrarySectionHeading = (si: number, heading: string) => {
    set('librarySections', librarySections.map((s, i) => (i === si ? { ...s, heading } : s)));
  };
  const moveLibrarySection = (si: number, dir: -1 | 1) => {
    const next = [...librarySections];
    const target = si + dir;
    if (target < 0 || target >= next.length) return;
    [next[si], next[target]] = [next[target], next[si]];
    set('librarySections', next);
  };
  const removeLibrarySection = (si: number) => {
    set('librarySections', librarySections.filter((_, i) => i !== si));
  };
  const addLibraryItem = (si: number) => {
    set('librarySections', librarySections.map((s, i) => (i === si ? { ...s, items: [...s.items, { label: '', value: '' }] } : s)));
  };
  const updateLibraryItem = (si: number, ji: number, patch: Partial<LibraryItem>) => {
    set('librarySections', librarySections.map((s, i) => (i !== si ? s : {
      ...s,
      items: s.items.map((it, j) => (j === ji ? { ...it, ...patch } : it)),
    })));
  };
  const moveLibraryItem = (si: number, ji: number, dir: -1 | 1) => {
    set('librarySections', librarySections.map((s, i) => {
      if (i !== si) return s;
      const items = [...s.items];
      const target = ji + dir;
      if (target < 0 || target >= items.length) return s;
      [items[ji], items[target]] = [items[target], items[ji]];
      return { ...s, items };
    }));
  };
  const removeLibraryItem = (si: number, ji: number) => {
    set('librarySections', librarySections.map((s, i) => (i === si ? { ...s, items: s.items.filter((_, j) => j !== ji) } : s)));
  };

  // Programme Levels editor (B.Tech / M.Tech) — same add/reorder/remove
  // pattern as the Digital Library sections above.
  const programLevels = form.programLevels || [];
  const addProgramLevel = () => {
    set('programLevels', [...programLevels, { title: `Level ${programLevels.length + 1}`, intro: '', rows: [] }]);
  };
  const updateProgramLevel = (li: number, patch: Partial<ProgramLevel>) => {
    set('programLevels', programLevels.map((l, i) => (i === li ? { ...l, ...patch } : l)));
  };
  const moveProgramLevel = (li: number, dir: -1 | 1) => {
    const next = [...programLevels];
    const target = li + dir;
    if (target < 0 || target >= next.length) return;
    [next[li], next[target]] = [next[target], next[li]];
    set('programLevels', next);
  };
  const removeProgramLevel = (li: number) => {
    set('programLevels', programLevels.filter((_, i) => i !== li));
  };
  const addProgramLevelRow = (li: number) => {
    set('programLevels', programLevels.map((l, i) => (i === li ? { ...l, rows: [...l.rows, { program: '', intake: '' }] } : l)));
  };
  const updateProgramLevelRow = (li: number, ri: number, patch: Partial<ProgramLevelRow>) => {
    set('programLevels', programLevels.map((l, i) => (i !== li ? l : {
      ...l,
      rows: l.rows.map((r, j) => (j === ri ? { ...r, ...patch } : r)),
    })));
  };
  const moveProgramLevelRow = (li: number, ri: number, dir: -1 | 1) => {
    set('programLevels', programLevels.map((l, i) => {
      if (i !== li) return l;
      const rows = [...l.rows];
      const target = ri + dir;
      if (target < 0 || target >= rows.length) return l;
      [rows[ri], rows[target]] = [rows[target], rows[ri]];
      return { ...l, rows };
    }));
  };
  const removeProgramLevelRow = (li: number, ri: number) => {
    set('programLevels', programLevels.map((l, i) => (i === li ? { ...l, rows: l.rows.filter((_, j) => j !== ri) } : l)));
  };

  // Placement Stats editor — a flat list of { label, value } tiles (e.g.
  // "Highest Package" / "₹12 LPA").
  const placementStats = form.placementStats || [];
  const addPlacementStat = () => {
    set('placementStats', [...placementStats, { label: '', value: '' }]);
  };
  const updatePlacementStat = (si: number, patch: Partial<LibraryItem>) => {
    set('placementStats', placementStats.map((s, i) => (i === si ? { ...s, ...patch } : s)));
  };
  const movePlacementStat = (si: number, dir: -1 | 1) => {
    const next = [...placementStats];
    const target = si + dir;
    if (target < 0 || target >= next.length) return;
    [next[si], next[target]] = [next[target], next[si]];
    set('placementStats', next);
  };
  const removePlacementStat = (si: number) => {
    set('placementStats', placementStats.filter((_, i) => i !== si));
  };

  const save = async () => {
    if (!form.title || !form.shortCode) return alert('Title and Short Code are required.');
    setSaving(true);
    try {
      const payload = {
        ...form,
        highlights: (form.highlights || []).filter(Boolean),
        mission: (form.mission || []).filter(Boolean),
        coreValues: (form.coreValues || []).filter(Boolean),
        labs: labs.filter((l) => l.name),
      };
      if (editing) {
        // Only send fields that actually changed in this editing session —
        // see originalForm/diffChangedFields above.
        const changed = originalForm ? diffChangedFields(payload, originalForm) : payload;
        if (Object.keys(changed).length > 0) {
          await updateDoc(doc(db, 'departments', editing), changed);
        }
      } else {
        await addDoc(collection(db, 'departments'), { ...payload, order: form.order || departments.length, createdAt: serverTimestamp() });
      }
      setForm(EMPTY); setEditing(null); setOriginalForm(null);
    } catch (e) {
      alert(`Couldn't save: ${(e as Error).message}`);
    } finally { setSaving(false); }
  };

  const startEdit = (d: DepartmentDoc) => {
    setEditing(d.id);
    const next: Omit<DepartmentDoc, 'id'> = {
      title: d.title, shortCode: d.shortCode, description: d.description || '',
      icon: d.icon || 'GraduationCap', order: d.order,
      heroImage: d.heroImage || '', storagePath: d.storagePath || '',
      about: d.about || '', highlights: d.highlights || [], established: d.established || '', accreditation: d.accreditation || '',
      hod: d.hod || '', hodImage: d.hodImage || '', hodImageStoragePath: d.hodImageStoragePath || '',
      hodEmail: d.hodEmail || '', hodMessage: d.hodMessage || '', hodResearchProfiles: d.hodResearchProfiles || [],
      vision: d.vision || '', mission: d.mission || [], coreValues: d.coreValues || [],
      labs: (d.labs || []).map(normalizeLab).map((l) => ({ name: l.name, description: l.description || '', pdfUrl: l.pdfUrl || '', pdfStoragePath: l.pdfStoragePath || '' })),
      libraryIntro: d.libraryIntro || '', libraryInCharge: d.libraryInCharge || '',
      librarySections: (d.librarySections || []).map((s) => ({ heading: s.heading, items: s.items || [] })),
      programLevels: (d.programLevels || []).map((l) => ({ title: l.title, intro: l.intro || '', rows: l.rows || [] })),
      placementIntro: d.placementIntro || '', placementStats: d.placementStats || [], placementRecruiters: d.placementRecruiters || [],
      newsEventsYears: d.newsEventsYears || [], studentAwardsYears: d.studentAwardsYears || [], othersYears: d.othersYears || [],
      customSections: d.customSections || [],
    };
    setForm(next);
    setOriginalForm(next);
  };

  const remove = async (id: string) => {
    if (!confirm('Delete this department card?')) return;
    try {
      await deleteDoc(doc(db, 'departments', id));
    } catch (e) {
      alert(`Couldn't delete: ${(e as Error).message}`);
    }
  };

  return (
    <div className="admin-section">
      {freshmanNotYetCreated.length > 0 && (
        <div className="admin-card">
          <h2 className="admin-card__title">Freshman Engineering — Quick Add</h2>
          <p className="admin-field__hint">
            Mathematics, Physics, Chemistry, and English were previously hardcoded on the Freshman Engineering page
            with no admin path (only About HOD/Faculty were ever dynamic, via /admin → Faculty). Each is its own
            standalone department here, same as CSE/ECE — click one to load its correct title/short code and
            original content (Laboratories, Research &amp; Development, Awards &amp; Recognitions) into the form
            below, review it, then click "Add Department".
          </p>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            {freshmanNotYetCreated.map((code) => (
              <button key={code} type="button" className="admin-btn admin-btn--sm" onClick={() => quickAddFreshman(code)}>
                + {code}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="admin-card">
        <h2 className="admin-card__title">{editing ? 'Edit Department' : 'Add Department'}</h2>
        <p className="admin-field__hint" style={{ marginBottom: '1rem' }}>
          Controls the cards in the "Academic Departments" grid on the public Academics page — separate from the
          individual B.Tech/M.Tech programs listed above it.
        </p>
        <div className="admin-form-grid">
          <div className="admin-field">
            <label htmlFor="field-title">Title *</label>
            <input id="field-title" value={form.title} onChange={(e) => set('title', e.target.value)} placeholder="Computer Science & Engineering" />
          </div>
          <div className="admin-field">
            <label htmlFor="field-short-code">Short Code *</label>
            <input id="field-short-code" value={form.shortCode} onChange={(e) => set('shortCode', e.target.value)} placeholder="CSE" />
          </div>
          <div className="admin-field">
            <label htmlFor="field-icon">Icon</label>
            <select id="field-icon" value={form.icon} onChange={(e) => set('icon', e.target.value)}>
              {PROGRAM_ICON_NAMES.map((n) => <option key={n} value={n}>{n}</option>)}
            </select>
          </div>
          <div className="admin-field">
            <label htmlFor="field-display-order">Display Order</label>
            <input id="field-display-order" type="number" value={form.order} onChange={(e) => set('order', +e.target.value)} min={0} />
          </div>
          <div className="admin-field admin-field--full">
            <label htmlFor="field-description">Description</label>
            <textarea id="field-description" rows={4} value={form.description} onChange={(e) => set('description', e.target.value)} placeholder="The Department of Computer Science & Engineering, established in…" />
          </div>

          <div className="admin-field admin-field--full"><hr /><h3>Department Page — Shared Content</h3>
            <p className="admin-field__hint" style={{ marginTop: '0.25rem' }}>
              Shown on every department's page at <code>/academics/&lt;program&gt;</code> — above the programme
              toggle for the grouped departments (<strong>AI</strong>, <strong>CSE</strong>, <strong>ECE</strong>),
              or as that programme's own "About the Department" section for every other (single-programme)
              department — matched to this card by <strong>Short Code</strong>. Overview specifically feeds
              "About the Department"; a programme's own "About the Programme" text stays a separate field on that
              programme itself (Admin → Programs → About the Programme).
            </p>
          </div>
          <div className="admin-field admin-field--full">
            <label>Hero Image</label>
            <ImageUploader folder="vwu/departments" currentUrl={form.heroImage} onUploaded={handleHero} label="Upload Hero Image" />
          </div>
          <div className="admin-field">
            <label htmlFor="field-established">Established</label>
            <input id="field-established" value={form.established} onChange={(e) => set('established', e.target.value)} placeholder="2020" />
          </div>
          <div className="admin-field">
            <label htmlFor="field-accreditation">Accreditation</label>
            <input id="field-accreditation" value={form.accreditation} onChange={(e) => set('accreditation', e.target.value)} placeholder="NBA Accredited" />
          </div>
          <div className="admin-field admin-field--full">
            <label htmlFor="field-about">Overview</label>
            <textarea id="field-about" rows={5} value={form.about} onChange={(e) => set('about', e.target.value)} placeholder="About the department…" />
          </div>
          <div className="admin-field admin-field--full">
            <label htmlFor="field-highlights-one-per-line">Department Highlights (one per line)</label>
            <p className="admin-field__hint" style={{ marginTop: '-0.25rem', marginBottom: '0.5rem' }}>
              Shown right below "About the Department" — same layout as a programme's own Highlights.
            </p>
            <textarea id="field-highlights-one-per-line" rows={5} value={arrayToLines(form.highlights)} onChange={(e) => set('highlights', linesToArray(e.target.value))} placeholder="NAAC A+ Accredited undergraduate programmes" />
          </div>

          <div className="admin-field admin-field--full"><hr /><h3>Department Page — Programme Levels (B.Tech / M.Tech)</h3>
            <p className="admin-field__hint" style={{ marginTop: '0.25rem' }}>
              Shown right below "About the Department" as headed subsections, each with its own intro paragraph
              and an intake table (e.g. a "B.Tech." block listing each B.Tech programme's intake).
            </p>
          </div>
          <div className="admin-field admin-field--full">
            {programLevels.map((level, li) => (
              <div key={li} style={{ border: '1.5px solid var(--color-light-gray)', borderRadius: 8, padding: '0.75rem', marginBottom: '0.75rem' }}>
                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginBottom: '0.5rem' }}>
                  <input
                    value={level.title}
                    onChange={(e) => updateProgramLevel(li, { title: e.target.value })}
                    placeholder="B.Tech."
                    style={{ flex: 1, fontWeight: 700 }}
                  />
                  <button type="button" className="admin-btn admin-btn--sm" onClick={() => moveProgramLevel(li, -1)} disabled={li === 0} title="Move up">↑</button>
                  <button type="button" className="admin-btn admin-btn--sm" onClick={() => moveProgramLevel(li, 1)} disabled={li === programLevels.length - 1} title="Move down">↓</button>
                  <button type="button" className="admin-btn admin-btn--sm admin-btn--danger" onClick={() => removeProgramLevel(li)}>Remove Level</button>
                </div>
                <textarea
                  rows={3}
                  value={level.intro}
                  onChange={(e) => updateProgramLevel(li, { intro: e.target.value })}
                  placeholder="B.Tech. in Computer Science & Allied courses includes study of…"
                  style={{ width: '100%', marginBottom: '0.5rem' }}
                />
                {level.rows.map((row, ri) => (
                  <div key={ri} style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.4rem' }}>
                    <input
                      value={row.program}
                      onChange={(e) => updateProgramLevelRow(li, ri, { program: e.target.value })}
                      placeholder="Computer Science & Engineering"
                      style={{ flex: 2 }}
                    />
                    <input
                      value={row.intake}
                      onChange={(e) => updateProgramLevelRow(li, ri, { intake: e.target.value })}
                      placeholder="180"
                      style={{ flex: 1 }}
                    />
                    <button type="button" className="admin-btn admin-btn--sm" onClick={() => moveProgramLevelRow(li, ri, -1)} disabled={ri === 0} title="Move up">↑</button>
                    <button type="button" className="admin-btn admin-btn--sm" onClick={() => moveProgramLevelRow(li, ri, 1)} disabled={ri === level.rows.length - 1} title="Move down">↓</button>
                    <button type="button" className="admin-btn admin-btn--sm admin-btn--danger" onClick={() => removeProgramLevelRow(li, ri)}>✕</button>
                  </div>
                ))}
                <button type="button" className="admin-btn admin-btn--sm" onClick={() => addProgramLevelRow(li)}>+ Add Row</button>
              </div>
            ))}
            <button type="button" className="admin-btn admin-btn--primary" onClick={addProgramLevel}>+ Add Level</button>
            {programLevels.length === 0 && (
              <p className="admin-field__hint">No levels yet — click "Add Level" to add a B.Tech./M.Tech. block.</p>
            )}
          </div>

          <div className="admin-field admin-field--full"><hr /><h3>Department Page — Vision, Mission &amp; Values</h3></div>
          <div className="admin-field admin-field--full">
            <label htmlFor="field-vision">Vision</label>
            <textarea id="field-vision" rows={3} value={form.vision} onChange={(e) => set('vision', e.target.value)} />
          </div>
          <div className="admin-field admin-field--full">
            <label htmlFor="field-mission">Mission (one per line)</label>
            <textarea id="field-mission" rows={4} value={arrayToLines(form.mission)} onChange={(e) => set('mission', linesToArray(e.target.value))} />
          </div>
          <div className="admin-field admin-field--full">
            <label htmlFor="field-core-values">Core Values (one per line)</label>
            <textarea id="field-core-values" rows={3} value={arrayToLines(form.coreValues)} onChange={(e) => set('coreValues', linesToArray(e.target.value))} />
          </div>
          <div className="admin-field admin-field--full"><hr /><h3>Department Page — Laboratories</h3></div>
          <div className="admin-field admin-field--full">
            <label>Laboratories</label>
            <p className="admin-field__hint" style={{ marginTop: 0 }}>
              Each laboratory has its own name, an optional description (a paragraph, or points — one per line, however
              you write it), and its own uploaded PDF. On the public page, tapping a laboratory tile opens a dialog
              with its description and a link to its PDF — a lab with no PDF uploaded yet still shows its tile and
              dialog, just marked as unavailable there.
            </p>
            {labs.length > 0 && (
              <div className="admin-compact-list" style={{ marginBottom: '0.75rem' }}>
                {labs.map((lab, li) => (
                  <div key={li} style={{ padding: '0.4rem 0.6rem', borderBottom: li < labs.length - 1 ? '1px solid #e5e7eb' : 'none' }}>
                    <div className="admin-compact-row" style={{ padding: 0, border: 'none' }}>
                      <input
                        className="admin-compact-row__name"
                        value={lab.name}
                        onChange={(e) => updateLabName(li, e.target.value)}
                        placeholder="Advanced Computing Lab"
                      />
                      <div className="admin-compact-row__file">
                        <FileUploader
                          compact
                          folder="vwu/departments/labs"
                          currentUrl={lab.pdfUrl}
                          onUploaded={(r) => handleLabPdf(li, r)}
                          label="Upload PDF"
                        />
                      </div>
                      <div className="admin-compact-row__actions">
                        <button
                          type="button"
                          className="admin-btn admin-btn--ghost admin-btn--sm"
                          onClick={() => removeLabPdf(li)}
                          disabled={!lab.pdfUrl}
                          title={lab.pdfUrl ? 'Remove PDF' : 'No PDF uploaded yet'}
                        >
                          Remove PDF
                        </button>
                        <button type="button" className="admin-btn admin-btn--sm" onClick={() => moveLab(li, -1)} disabled={li === 0} title="Move up">↑</button>
                        <button type="button" className="admin-btn admin-btn--sm" onClick={() => moveLab(li, 1)} disabled={li === labs.length - 1} title="Move down">↓</button>
                        <button type="button" className="admin-btn admin-btn--sm admin-btn--danger" onClick={() => removeLab(li)} title="Remove laboratory">Remove</button>
                      </div>
                    </div>
                    <textarea
                      value={lab.description || ''}
                      onChange={(e) => updateLabDescription(li, e.target.value)}
                      placeholder="Description (optional) — a paragraph, or one point per line…"
                      rows={2}
                      style={{ width: '100%', marginTop: '0.4rem' }}
                    />
                  </div>
                ))}
              </div>
            )}
            <button type="button" className="admin-btn admin-btn--primary" onClick={addLab}>+ Add Lab</button>
            {labs.length === 0 && (
              <p className="admin-field__hint">No laboratories yet — click "Add Lab" to start building this department's Laboratories list.</p>
            )}
          </div>

          <div className="admin-field admin-field--full"><hr /><h3>Department Page — Placements</h3>
            <p className="admin-field__hint" style={{ marginTop: '0.25rem' }}>
              Shown as a shared "Placements" section, before the program toggle. The individual student placement
              records table is managed separately, per programme — see "Placements, Internships, Research &amp;
              Development &amp; Newsletter" further down this page, once you've saved this department.
            </p>
          </div>
          <div className="admin-field admin-field--full">
            <label htmlFor="field-placement-intro">Placements Overview</label>
            <textarea id="field-placement-intro" rows={3} value={form.placementIntro} onChange={(e) => set('placementIntro', e.target.value)} placeholder="Graduates of the department are placed in leading IT and core engineering companies…" />
          </div>
          <div className="admin-field admin-field--full">
            <label>Placement Stats</label>
            {placementStats.map((stat, si) => (
              <div key={si} style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.4rem' }}>
                <input
                  value={stat.label}
                  onChange={(e) => updatePlacementStat(si, { label: e.target.value })}
                  placeholder="Highest Package"
                  style={{ flex: 2 }}
                />
                <input
                  value={stat.value}
                  onChange={(e) => updatePlacementStat(si, { value: e.target.value })}
                  placeholder="₹12 LPA"
                  style={{ flex: 1 }}
                />
                <button type="button" className="admin-btn admin-btn--sm" onClick={() => movePlacementStat(si, -1)} disabled={si === 0} title="Move up">↑</button>
                <button type="button" className="admin-btn admin-btn--sm" onClick={() => movePlacementStat(si, 1)} disabled={si === placementStats.length - 1} title="Move down">↓</button>
                <button type="button" className="admin-btn admin-btn--sm admin-btn--danger" onClick={() => removePlacementStat(si)}>✕</button>
              </div>
            ))}
            <button type="button" className="admin-btn admin-btn--sm" onClick={addPlacementStat}>+ Add Stat</button>
          </div>
          <div className="admin-field admin-field--full">
            <label htmlFor="field-placement-recruiters">Recruiters (one per line)</label>
            <textarea id="field-placement-recruiters" rows={4} value={arrayToLines(form.placementRecruiters)} onChange={(e) => set('placementRecruiters', linesToArray(e.target.value))} placeholder="TCS&#10;Infosys&#10;Wipro" />
          </div>

          <div className="admin-field admin-field--full"><hr /><h3>Department Page — Digital Library</h3>
            <p className="admin-field__hint" style={{ marginTop: '0.25rem' }}>
              Shown as a shared "Digital Library" section, before the program toggle. Each section below becomes
              its own table on the public page.
            </p>
          </div>
          <div className="admin-field admin-field--full">
            <label htmlFor="field-library-intro">Library Overview</label>
            <textarea id="field-library-intro" rows={3} value={form.libraryIntro} onChange={(e) => set('libraryIntro', e.target.value)} placeholder="The Department Library occupies a unique place in academic and research activities of the Department…" />
          </div>
          <div className="admin-field admin-field--full">
            <label htmlFor="field-library-in-charge">In-charge of Department Library</label>
            <input id="field-library-in-charge" value={form.libraryInCharge} onChange={(e) => set('libraryInCharge', e.target.value)} placeholder="Dr. P. Ravi Kumar, Ph.D. Associate Professor" />
          </div>
          <div className="admin-field admin-field--full">
            {librarySections.map((sec, si) => (
              <div key={si} style={{ border: '1.5px solid var(--color-light-gray)', borderRadius: 8, padding: '0.75rem', marginBottom: '0.75rem' }}>
                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginBottom: '0.5rem' }}>
                  <input
                    value={sec.heading}
                    onChange={(e) => updateLibrarySectionHeading(si, e.target.value)}
                    placeholder="Number of Books"
                    style={{ flex: 1, fontWeight: 700 }}
                  />
                  <button type="button" className="admin-btn admin-btn--sm" onClick={() => moveLibrarySection(si, -1)} disabled={si === 0} title="Move up">↑</button>
                  <button type="button" className="admin-btn admin-btn--sm" onClick={() => moveLibrarySection(si, 1)} disabled={si === librarySections.length - 1} title="Move down">↓</button>
                  <button type="button" className="admin-btn admin-btn--sm admin-btn--danger" onClick={() => removeLibrarySection(si)}>Remove Section</button>
                </div>

                {sec.items.map((item, ji) => (
                  <div key={ji} style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.4rem' }}>
                    <input
                      value={item.label}
                      onChange={(e) => updateLibraryItem(si, ji, { label: e.target.value })}
                      placeholder="Item name"
                      style={{ flex: 2 }}
                    />
                    <input
                      value={item.value}
                      onChange={(e) => updateLibraryItem(si, ji, { value: e.target.value })}
                      placeholder="Count"
                      style={{ flex: 1 }}
                    />
                    <button type="button" className="admin-btn admin-btn--sm" onClick={() => moveLibraryItem(si, ji, -1)} disabled={ji === 0} title="Move up">↑</button>
                    <button type="button" className="admin-btn admin-btn--sm" onClick={() => moveLibraryItem(si, ji, 1)} disabled={ji === sec.items.length - 1} title="Move down">↓</button>
                    <button type="button" className="admin-btn admin-btn--sm admin-btn--danger" onClick={() => removeLibraryItem(si, ji)}>✕</button>
                  </div>
                ))}
                <button type="button" className="admin-btn admin-btn--sm" onClick={() => addLibraryItem(si)}>+ Add Item</button>
              </div>
            ))}
            <button type="button" className="admin-btn admin-btn--primary" onClick={addLibrarySection}>+ Add Section</button>
            {librarySections.length === 0 && (
              <p className="admin-field__hint">No sections yet — click "Add Section" to start building this department's Digital Library.</p>
            )}
          </div>

          <div className="admin-field admin-field--full"><hr /><h3>Department Page — News &amp; Events</h3>
            <p className="admin-field__hint" style={{ marginTop: '0.25rem' }}>
              Shown as a shared "News &amp; Events" section, with a tab to switch between the three lists below —
              same academic-year table shape for each, with columns you define per year (e.g. "Date", "Seminars /
              Workshop"); "S.No" is added automatically. A tab with nothing in it still shows, so leaving one empty
              for now is fine.
            </p>
          </div>
          <div className="admin-field admin-field--full">
            <label>News &amp; Events</label>
            <NewsEventsYearsEditor years={form.newsEventsYears || []} onChange={(years) => set('newsEventsYears', years)} />
          </div>
          <div className="admin-field admin-field--full">
            <label>Student Awards</label>
            <NewsEventsYearsEditor years={form.studentAwardsYears || []} onChange={(years) => set('studentAwardsYears', years)} />
          </div>
          <div className="admin-field admin-field--full">
            <label>Others</label>
            <NewsEventsYearsEditor years={form.othersYears || []} onChange={(years) => set('othersYears', years)} />
          </div>

          <div className="admin-field admin-field--full"><hr /><h3>Department Page — Head of Department</h3></div>
          <div className="admin-field admin-field--full">
            <label>HOD Photo</label>
            <ImageUploader folder="vwu/departments" currentUrl={form.hodImage} onUploaded={handleHodImage} label="Upload HOD Photo" aspect={1} />
          </div>
          <div className="admin-field">
            <label htmlFor="field-hod">HOD Name</label>
            <input id="field-hod" value={form.hod} onChange={(e) => set('hod', e.target.value)} placeholder="Dr. …" />
          </div>
          <div className="admin-field">
            <label htmlFor="field-hod-email">HOD Email</label>
            <input id="field-hod-email" value={form.hodEmail} onChange={(e) => set('hodEmail', e.target.value)} placeholder="hod.cse@vishnu.edu.in" />
          </div>
          <div className="admin-field admin-field--full">
            <label htmlFor="field-hod-message">HOD Message</label>
            <textarea id="field-hod-message" rows={5} value={form.hodMessage} onChange={(e) => set('hodMessage', e.target.value)} />
          </div>
          <div className="admin-field admin-field--full">
            <label htmlFor="field-hod-research-profiles">HOD Research Profiles (one per line: "Google Scholar: https://…")</label>
            <textarea id="field-hod-research-profiles" rows={4} value={linksToText(form.hodResearchProfiles)} onChange={(e) => set('hodResearchProfiles', textToLinks(e.target.value))} placeholder="Google Scholar: https://scholar.google.com/citations?user=…" />
          </div>

          {STANDALONE_DEPARTMENTS.some((d) => d.deptShortCode.trim().toLowerCase() === form.shortCode.trim().toLowerCase()) ? (
            <>
              <div className="admin-field admin-field--full"><hr /><h3>Department Page — Custom Sections</h3>
                <p className="admin-field__hint" style={{ marginTop: '0.25rem' }}>
                  Optional. Add any section this department needs beyond the fixed fields above — Research &amp;
                  Development, Awards &amp; Recognitions, or anything else — any name, any number of sub-sections, and
                  a choice of plain text, a table, a checklist, a list of links, uploaded files, a photo gallery, or
                  panel view per section. This department has no linked programme, so this is the only place to add
                  its page content — shown after Laboratories, and it's also the only place to add real Laboratory
                  photos (one section per lab, each with its own Photo Gallery).
                </p>
              </div>
              <div className="admin-field admin-field--full">
                <CustomSectionEditor
                  sections={form.customSections || []}
                  onChange={(next) => set('customSections', next)}
                  rootSections={form.customSections || []}
                  parentPath={[]}
                  onFileUploaded={handleCustomSectionFileUploaded}
                  onFileRemoved={handleCustomSectionFileRemoved}
                  onPhotoUploaded={handleCustomSectionPhotoUploaded}
                  onPhotoRemoved={handleCustomSectionPhotoRemoved}
                  onGalleryPhotoUploaded={handleCustomSectionGalleryPhotoUploaded}
                  onGalleryPhotoRemoved={handleCustomSectionGalleryPhotoRemoved}
                />
              </div>
            </>
          ) : (
            <div className="admin-field admin-field--full">
              <hr />
              <p className="admin-field__hint">
                This department's public page is driven by its linked programme(s) — add Custom Sections from{' '}
                <strong>Programs</strong> (edit the relevant programme) instead of here; anything added on this form
                would never be shown, since this department's page doesn't read it.
              </p>
            </div>
          )}
        </div>

        <div className="admin-form-actions">
          {editing && <button className="admin-btn admin-btn--ghost" onClick={() => { setEditing(null); setForm(EMPTY); setOriginalForm(null); }}>Cancel</button>}
          <button className="admin-btn admin-btn--primary" onClick={save} disabled={saving}>
            {saving ? 'Saving…' : editing ? 'Update' : 'Add Department'}
          </button>
        </div>
      </div>

      {editingDept && (
        <div className="admin-card">
          <h2 className="admin-card__title">Placements, Internships, Research &amp; Development &amp; Newsletter — {editingDept.title}</h2>
          <p className="admin-field__hint" style={{ marginBottom: '1rem' }}>
            Per-programme, not shared across the department — each programme keeps its own independent Academic
            Years/records, exactly as it always has. Pick a programme below to manage its Placements, Internships,
            Research &amp; Development, and Newsletter.
          </p>
          <div style={{ marginBottom: '1rem' }}>
            <button type="button" className="admin-btn admin-btn--ghost admin-btn--sm" onClick={downloadPlacementsTemplate}>
              ⬇ Download Placements Template
            </button>{' '}
            <button type="button" className="admin-btn admin-btn--ghost admin-btn--sm" onClick={downloadInternshipsTemplate}>
              ⬇ Download Internships Template
            </button>
          </div>
          {careerPrograms.length === 0 ? (
            <p className="admin-field__hint">
              No programme's Department code matches this department's Short Code ({editingDept.shortCode}) yet —
              add/edit a programme under <strong>Admin → Programs</strong> with that Department code to manage its
              Placements, Internships, R&amp;D, and Newsletter here.
            </p>
          ) : (
            <>
              {careerPrograms.length > 1 && (
                <div className="admin-field" style={{ maxWidth: 360 }}>
                  <label htmlFor="field-select-programme">Programme</label>
                  <select
                    id="field-select-programme"
                    value={selectedProgram?.id || ''}
                    onChange={(e) => setSelectedProgramId(e.target.value)}
                  >
                    {careerPrograms.map((p) => (
                      <option key={p.id} value={p.id}>{p.shortName || p.name}</option>
                    ))}
                  </select>
                </div>
              )}
            </>
          )}
        </div>
      )}

      {selectedProgram && (
        <>
          <PlacementYearsEditor program={selectedProgram} />
          <InternshipYearsEditor program={selectedProgram} />
          <RndEditor program={selectedProgram} />
          <NewsletterYearsEditor program={selectedProgram} />
        </>
      )}

      {editingDept && (
        <div className="admin-card">
          <p className="admin-field__hint" style={{ marginBottom: '0.75rem' }}>
            Placements, Internships, Research &amp; Development, and Newsletter above each save on their own
            ("Save Changes" / "Save Research &amp; Development" / "Save Newsletter"). Once you're done editing this
            department, use Update below to save the department fields themselves.
          </p>
          <div className="admin-form-actions">
            <button className="admin-btn admin-btn--ghost" onClick={() => { setEditing(null); setForm(EMPTY); setOriginalForm(null); }}>Cancel</button>
            <button className="admin-btn admin-btn--primary" onClick={save} disabled={saving}>
              {saving ? 'Saving…' : 'Update'}
            </button>
          </div>
        </div>
      )}

      <div className="admin-card">
        <h2 className="admin-card__title">Departments ({departments.length})</h2>
        {departmentsMissingContent.length > 0 && (
          <p className="admin-field__hint" style={{ margin: '0 0 1rem' }}>
            {departmentsMissingContent.length} department(s) are missing Vision/Mission/Values, Laboratories,
            Department Library, News &amp; Events, or Head of Department info that already exist on one of their
            programmes.{' '}
            <button className="admin-btn admin-btn--sm" onClick={copyFromPrograms} disabled={copying}>
              {copying ? 'Copying…' : 'Copy from Programs'}
            </button>
          </p>
        )}
        {loading ? <p className="admin-loading">Loading…</p> : (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead><tr><th>Title</th><th>Short Code</th><th>Order</th><th>Actions</th></tr></thead>
              <tbody>
                {departments.map((d) => (
                  <tr key={d.id}>
                    <td><strong>{d.title}</strong></td>
                    <td><span className="admin-badge" style={{ textTransform: 'none' }}>{d.shortCode}</span></td>
                    <td>{d.order}</td>
                    <td>
                      <button className="admin-btn admin-btn--sm" onClick={() => startEdit(d)}>Edit</button>
                      <button className="admin-btn admin-btn--sm admin-btn--danger" onClick={() => remove(d.id)}>Delete</button>
                    </td>
                  </tr>
                ))}
                {departments.length === 0 && <tr><td colSpan={4} className="admin-empty">No departments yet — add one using the form above.</td></tr>}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
