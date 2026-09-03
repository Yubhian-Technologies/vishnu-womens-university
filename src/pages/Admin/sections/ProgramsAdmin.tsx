import { useEffect, useState } from 'react';
import {
  collection, addDoc, deleteDoc, doc, updateDoc, serverTimestamp, writeBatch,
} from 'firebase/firestore';
import { db } from '../../../lib/firebase';
import { useOrderedCollection } from '../../../hooks/useCollection';
import { useImageCropModal } from '../../../components/ImageUploader/useImageCropModal';
import FileUploader from '../../../components/FileUploader/FileUploader';
import { deleteFile, type UploadResult } from '../../../lib/storage';
import { PROGRAM_ICON_NAMES } from '../../../lib/programIcons';
import DepartmentNewsManager from './DepartmentNewsManager';
import type { PlacementYearRecord } from '../../../lib/placementRecords';
import type { InternshipYearRecord } from '../../../lib/internshipRecords';
import CustomSectionEditor from './CustomSectionEditor';
import { replaceAtPath, getAtPath, type CustomSection } from '../../../lib/customSections';
import type { RndStructuredTable } from './RndTableEditor';
import { diffChangedFields } from '../../../lib/formDiff';

export interface ProgramSubject {
  title: string;
  code?: string;
  credits?: number;
}

export interface ProgramSemester {
  label: string;
  subjects: ProgramSubject[];
  // Each semester can have its own uploaded PDF (syllabus) — same
  // independent-upload pattern as LabItem/RndLink/NewsletterIssue above.
  pdfUrl?: string;
  pdfStoragePath?: string;
}

// Older programme docs stored subjects as plain strings — normalize either
// shape to the richer one at read time so existing data keeps working
// without a migration, both here and in <ProgrammeStructure>.
export function normalizeSubject(s: string | ProgramSubject): ProgramSubject {
  return typeof s === 'string' ? { title: s } : s;
}

export interface ProgramLink {
  label: string;
  url: string;
}

export interface LabItem {
  name: string;
  description?: string;
  pdfUrl?: string;
  pdfStoragePath?: string;
}

// Older programme docs stored labs as plain strings (no PDF) — normalize
// either shape to the richer one at read time so existing data keeps
// rendering without a migration, same approach as normalizeSubject above.
export function normalizeLab(l: string | LabItem): LabItem {
  return typeof l === 'string' ? { name: l } : l;
}

export interface MindMapImage {
  url: string;
  storagePath?: string;
}

// Older programme docs stored a single Mind Map image (mindMapImage /
// mindMapImageStoragePath) — normalize to the new multi-image array shape at
// read time so existing data keeps rendering without a migration, same
// approach as normalizeLab/normalizeSubject above.
export function normalizeMindMapImages(p: {
  mindMapImages?: MindMapImage[];
  mindMapImage?: string;
  mindMapImageStoragePath?: string;
}): MindMapImage[] {
  if (p.mindMapImages && p.mindMapImages.length > 0) return p.mindMapImages;
  if (p.mindMapImage) return [{ url: p.mindMapImage, storagePath: p.mindMapImageStoragePath || '' }];
  return [];
}

export interface LibraryItem {
  label: string;
  value: string;
}

export interface LibrarySection {
  heading: string;
  items: LibraryItem[];
}

// `cells` wraps each row in an object (not a bare string[]) because Firestore
// rejects arrays nested directly inside arrays — same reason FacultySection's
// table rows do this (see lib/facultySections.ts).
export interface NewsEventRow {
  cells: string[];
}

// One event shown as an image + a short write-up instead of (or alongside)
// a table row — for entries a plain table cell doesn't do justice to (e.g.
// a single notable achievement with a photo), same image/description shape
// used by Happenings (see lib/happenings.ts).
export interface NewsEventCard {
  imageUrl?: string;
  storagePath?: string;
  title: string;
  description: string;
}

export interface NewsEventsYear {
  year: string;
  // How this year's content is displayed. Optional and defaults to 'table'
  // — every year created before this field existed only ever had
  // columns/rows, so treating a missing mode as 'table' keeps that content
  // showing exactly as it always has.
  mode?: 'table' | 'cards' | 'text' | 'both';
  // Admin-defined, in display order — "S.No" is never stored here, it's
  // always generated on the public page.
  columns: string[];
  rows: NewsEventRow[];
  // Only shown when `mode` is 'cards' or 'both'.
  cards?: NewsEventCard[];
  // Only shown when `mode` is 'text' — a plain paragraph for a year that's
  // neither a table nor image cards.
  text?: string;
}

export interface NewsletterIssue {
  pdfUrl?: string;
  pdfStoragePath?: string;
}

export interface RndLink {
  label: string;
  pdfUrl?: string;
  pdfStoragePath?: string;
}

export interface NewsletterYear {
  year: string;
  // Ordered — an issue's "Issue – N" label is always its 1-based position,
  // never stored, so there's nothing to keep in sync when one is removed.
  issues: NewsletterIssue[];
}

export interface ProgramDoc {
  id: string;
  slug: string;
  name: string;
  shortName: string;
  icon: string;
  category: string;
  intake: number;
  established: string;
  accreditation: string;
  hod: string;
  department: string;
  fee: string;
  heroImage: string;
  storagePath: string;
  about: string;
  highlights: string[];
  // Each lab is independently backed by its own uploaded PDF (see LabItem) —
  // legacy docs may still have this as a plain string[]; normalizeLab()
  // upgrades either shape to LabItem at read time.
  labs: LabItem[];
  outcomes: string[];
  semesters: ProgramSemester[];
  vision: string;
  mission: string[];
  coreValues: string[];
  peos: string[];
  pos: string[];
  psos: string[];
  // Knowledge Profile statements (WK1, WK2, …) — same shape/pattern as
  // peos/pos/psos above, shown as a 4th tab alongside them.
  wks: string[];
  hodMessage: string;
  hodImage: string;
  hodImageStoragePath: string;
  hodEmail: string;
  hodResearchProfiles: ProgramLink[];
  // Legacy single-image fields — normalizeMindMapImages() upgrades these to
  // the array below at read time; new saves only ever write mindMapImages.
  mindMapImage?: string;
  mindMapImageStoragePath?: string;
  // Curriculum Mind Map — any number of admin-uploaded images (shown as a
  // gallery on the public page) plus an optional PDF download.
  mindMapImages?: MindMapImage[];
  mindMapPdfUrl?: string;
  mindMapPdfStoragePath?: string;
  // Optional — shown as a "Department Library" section + Quick Links entry on
  // every programme's page (same shared template, not per-branch content,
  // and stored on this programme's own doc so each branch's library data is
  // completely independent of every other's).
  libraryIntro?: string;
  libraryInCharge?: string;
  // Fully admin-defined: any number of sections, each with any number of
  // items — nothing about headings or item names is fixed, so different
  // programmes can have entirely different Department Library content. Each
  // section renders as its own table on the public page.
  librarySections?: LibrarySection[];
  // Optional — shown as a "News & Events" section + Quick Links entry on
  // every programme's page. Grouped by academic year, each year with its
  // own admin-defined columns and rows — completely independent per
  // programme, and per year within a programme.
  newsEventsYears?: NewsEventsYear[];
  // Optional — shown as a "Newsletter" section + Quick Links entry on every
  // programme's page. Grouped by academic year like News & Events, but each
  // year holds an ordered list of issues, each with its own uploaded PDF.
  newsletterYears?: NewsletterYear[];
  // Optional — shown as a "Research & Development (Funded Projects &
  // Patents)" section + Quick Links entry on every programme's page. Real
  // department R&D pages turn out to differ a lot in shape (a department
  // might just want an intro paragraph, a simple table, detailed per-patent
  // cards, or plain PDF links — any combination), so this reuses the same
  // three free-text formats already used site-wide on the Research pages
  // (see ResearchItemsAdmin.tsx) instead of forcing one fixed layout:
  rndIntro?: string;
  // "## Section" / "Header | Header | ..." / "Value | Value | ..." — parsed
  // by parseFlexibleTable(). Good for a flat table (e.g. Patents: Application
  // No. | Title | Proof).
  rndTableText?: string;
  // "## Category" / "### Project Title" / "Label: value" / "- bullet" —
  // parsed by parseProjectAccordion(). Good for detailed per-entry cards
  // (e.g. a granted patent's invention title, patent no., grant date...).
  rndProjectsText?: string;
  // A flat, admin-named list of links, each backed by its own uploaded PDF —
  // still the simplest option for a department that just wants to link out
  // to a couple of PDFs (e.g. "Funded R&D Projects", "In-house R&D Projects").
  rndLinks?: RndLink[];
  // Admin-defined columns (added/reordered/removed dynamically, same as
  // NewsEventsYearsEditor's), but — unlike rndTableText above — each row
  // also carries its own uploaded PDF (e.g. the actual paper/patent for
  // that row), retrieved from Firebase Storage the same way every other
  // per-item PDF in this codebase is (rndLinks, labs, semesters…).
  rndStructuredTable?: RndStructuredTable;
  // Optional — shown as the "Placements" section's records table + Quick
  // Links entry on every programme's page. Grouped by academic year like
  // News & Events/Newsletter, but each year holds its own admin-imported
  // Excel/CSV dataset (columns + rows exactly as uploaded) — scoped to
  // exactly one Academic Year + Department + Programme, since it lives on
  // this specific programme's own doc.
  placementYears?: PlacementYearRecord[];
  // Same shape/pattern as placementYears above, for internships instead of
  // placements — shown as the "Internships" section's records table + Quick
  // Links entry.
  internshipYears?: InternshipYearRecord[];
  // Admin-defined sections beyond the fixed set above — any name, any number
  // of sub-sections, and a choice of plain text / table / links / files per
  // section (see lib/customSections.ts). Fully additive: a program with no
  // customSections renders exactly as it did before this field existed.
  customSections?: CustomSection[];
  order: number;
}

const EMPTY: Omit<ProgramDoc, 'id'> = {
  slug: '', name: '', shortName: '', icon: 'GraduationCap', category: 'btech', intake: 60,
  established: '', accreditation: '', hod: '', department: '', fee: '', heroImage: '', storagePath: '', about: '',
  highlights: [], labs: [], outcomes: [], semesters: [],
  vision: '', mission: [], coreValues: [], peos: [], pos: [], psos: [], wks: [],
  hodMessage: '', hodImage: '', hodImageStoragePath: '', hodEmail: '', hodResearchProfiles: [],
  mindMapImages: [], mindMapPdfUrl: '', mindMapPdfStoragePath: '',
  libraryIntro: '', libraryInCharge: '', librarySections: [],
  newsEventsYears: [],
  // placementYears/internshipYears/newsletterYears/rndIntro/rndTableText/
  // rndProjectsText/rndLinks/rndStructuredTable are intentionally NOT part
  // of this form/EMPTY: they're each managed entirely by their own editor
  // (PlacementYearsEditor/InternshipYearsEditor/RndEditor/
  // NewsletterYearsEditor in ProgramCareerEditors.tsx, rendered from Admin →
  // Academic Departments, not here — see that file's own comment) via
  // immediate/self-staged Firestore writes, independent of this form.
  // Leaving them out of `form` means `save()`'s `{...form}` spread never
  // touches any of them, so clicking "Update Program" can never clobber one
  // with a stale/empty value.
  customSections: [],
  order: 0,
};

// A subject's Code/Credits fields are cleared to a literal `undefined`
// (see updateSubject's onChange handlers below) to represent "not set" in
// local state — but Firestore's updateDoc/addDoc reject any field whose
// value is `undefined` anywhere in the payload (nested arrays/objects
// included), throwing "Unsupported field value: undefined". This strips
// every such undefined leaf right before saving, so a program with an
// empty subject Code/Credits (or any other optional field left blank)
// always saves successfully.
function stripUndefined<T>(value: T): T {
  if (Array.isArray(value)) {
    return value.map((v) => stripUndefined(v)) as unknown as T;
  }
  if (value !== null && typeof value === 'object') {
    const out: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(value as Record<string, unknown>)) {
      if (v !== undefined) out[k] = stripUndefined(v);
    }
    return out as T;
  }
  return value;
}

const CATEGORIES = ['btech', 'mtech', 'mba', 'phd'];
// Display-only labels — the stored `category` value stays lowercase since
// public pages (e.g. Academics.tsx) filter on it directly.
const CATEGORY_LABELS: Record<string, string> = { btech: 'B.Tech', mtech: 'M.Tech', mba: 'MBA', phd: 'Ph.D.' };
const DEPARTMENTS = ['CSE', 'AI', 'Cyber Security', 'IT', 'ECE', 'EEE', 'Civil', 'Mechanical', 'MBA'];

function linesToArray(text: string): string[] {
  return text.split('\n').map((s) => s.trim());
}
function arrayToLines(arr: string[] = []): string {
  return arr.join('\n');
}
export default function ProgramsAdmin() {
  const { docs: programs, loading } = useOrderedCollection<ProgramDoc>('programs', 'order');
  const [form, setForm] = useState<Omit<ProgramDoc, 'id'>>(EMPTY);
  // Snapshot of `form` taken at the moment "Edit" was clicked (see
  // startEdit) — save() diffs against this so Update only writes fields you
  // actually changed in this session. Without it, `updateDoc(doc, {...form})`
  // blindly overwrites every field with this tab's stale copy, silently
  // reverting whatever anyone else (or you, in another tab) saved on this
  // program in the meantime. null while adding a new program (nothing to
  // diff against — always writes the full form then).
  const [originalForm, setOriginalForm] = useState<Omit<ProgramDoc, 'id'> | null>(null);
  const [editing, setEditing] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  // Drag-to-reorder for the programs table — grouped by category (B.Tech,
  // M.Tech, MBA, Ph.D. each get their own list) since that's how the public
  // Academics page's tabs filter and display them: `order` only needs to be
  // consistent within a category, not across all four.
  const [groupedOrdered, setGroupedOrdered] = useState<Record<string, ProgramDoc[]>>({});
  const [drag, setDrag] = useState<{ cat: string; index: number } | null>(null);
  useEffect(() => {
    const groups: Record<string, ProgramDoc[]> = {};
    CATEGORIES.forEach((c) => { groups[c] = []; });
    programs.forEach((p) => { (groups[p.category] ??= []).push(p); });
    setGroupedOrdered(groups);
  }, [programs]);

  const handleDragOver = (cat: string, i: number) => {
    if (!drag || drag.cat !== cat || drag.index === i) return;
    setGroupedOrdered((prev) => {
      const list = [...(prev[cat] || [])];
      const [moved] = list.splice(drag.index, 1);
      list.splice(i, 0, moved);
      return { ...prev, [cat]: list };
    });
    setDrag({ cat, index: i });
  };
  const handleDrop = async (cat: string) => {
    setDrag(null);
    const list = groupedOrdered[cat] || [];
    const batch = writeBatch(db);
    let changed = false;
    list.forEach((p, i) => {
      if (p.order !== i) { batch.update(doc(db, 'programs', p.id), { order: i }); changed = true; }
    });
    if (changed) {
      try {
        await batch.commit();
      } catch (e) {
        alert(`Couldn't save new order: ${(e as Error).message}`);
      }
    }
  };

  const set = (k: string, v: string | number | string[] | ProgramSemester[] | ProgramLink[] | LibrarySection[] | NewsEventsYear[] | LabItem[] | CustomSection[] | MindMapImage[]) => setForm((p) => ({ ...p, [k]: v }));
  // Mind Map — any number of admin-uploaded images (shown as a gallery on
  // the public page) plus an optional PDF download. Adding uses a functional
  // setForm update (not the plain `set` helper) so uploading several images
  // in quick succession never has one upload's completion silently overwrite
  // another's — same race avoided by handleLabPdf above.
  const { openCrop: openMindMapCrop, cropModal: mindMapCropModal, uploading: mindMapUploading } = useImageCropModal();
  const mindMapImages = form.mindMapImages || [];
  const addMindMapImage = (file: File) => {
    openMindMapCrop(file, 'vwu/programs/mindmap', (result) => {
      setForm((p) => ({ ...p, mindMapImages: [...(p.mindMapImages || []), { url: result.url, storagePath: result.path }] }));
    });
  };
  const removeMindMapImage = (mi: number) => {
    if (!confirm('Remove this Mind Map image?')) return;
    set('mindMapImages', mindMapImages.filter((_, i) => i !== mi));
  };
  const moveMindMapImage = (mi: number, dir: -1 | 1) => {
    const next = [...mindMapImages];
    const target = mi + dir;
    if (target < 0 || target >= next.length) return;
    [next[mi], next[target]] = [next[target], next[mi]];
    set('mindMapImages', next);
  };
  const handleMindMapPdf = (r: UploadResult) => setForm((p) => ({ ...p, mindMapPdfUrl: r.url, mindMapPdfStoragePath: r.path }));
  const removeMindMapPdf = () => setForm((p) => ({ ...p, mindMapPdfUrl: '', mindMapPdfStoragePath: '' }));

  // Custom Sections — file uploads route through the functional `setForm(p
  // => ...)` form via replaceAtPath, recomputing from `p.customSections` at
  // call time (never a closed-over snapshot), for the same reason
  // handleLabPdf above does: several file uploads across different sections
  // can resolve in quick succession, and each must land on top of whatever
  // the others already saved, not silently overwrite it.
  const handleCustomSectionFileUploaded = (sectionPath: number[], fileIndex: number, r: UploadResult) => {
    setForm((p) => ({
      ...p,
      customSections: replaceAtPath(p.customSections || [], sectionPath, (s) => ({
        ...s,
        files: (s.files || []).map((f, i) => (i === fileIndex ? { ...f, fileUrl: r.url, storagePath: r.path } : f)),
      })),
    }));
  };
  // Unlike the rest of this form (which only takes effect once "Update
  // Program" is clicked), removing a custom section's file acts immediately
  // — same as removeLabPdf above — so there's no orphaned Storage file.
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
        // Firestore's updateDoc rejects an explicit `undefined` value
        // anywhere in the document, including nested — the key must be
        // dropped entirely, not set to undefined.
        const next = { ...s };
        delete next.photo;
        return next;
      }),
    }));
  };

  // contentType 'gallery' — same shape as the file handlers above, but each
  // photo is addressed by its index within that section's galleryPhotos.
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

  // Programme Structure (semesters + subjects) editing — structured add /
  // remove / reorder, replacing the old free-text "Semester I: A, B" parser.
  const addSemester = () => {
    set('semesters', [...form.semesters, { label: `Semester ${form.semesters.length + 1}`, subjects: [] }]);
  };
  const updateSemesterLabel = (si: number, label: string) => {
    set('semesters', form.semesters.map((s, i) => (i === si ? { ...s, label } : s)));
  };
  const moveSemester = (si: number, dir: -1 | 1) => {
    const next = [...form.semesters];
    const target = si + dir;
    if (target < 0 || target >= next.length) return;
    [next[si], next[target]] = [next[target], next[si]];
    set('semesters', next);
  };
  const removeSemester = (si: number) => {
    if (!confirm('Remove this semester and all its subjects?')) return;
    set('semesters', form.semesters.filter((_, i) => i !== si));
  };
  // Semester PDF upload/remove — same functional-setForm + immediate-Storage-
  // delete pattern as handleLabPdf/removeLabPdf above (see that comment for
  // why: several uploads firing in quick succession must each read the
  // latest `p.semesters`, never a stale outer-scope snapshot).
  const handleSemesterPdf = (si: number, r: UploadResult) => {
    setForm((p) => ({ ...p, semesters: p.semesters.map((s, i) => (i === si ? { ...s, pdfUrl: r.url, pdfStoragePath: r.path } : s)) }));
  };
  const removeSemesterPdf = async (si: number) => {
    const sem = form.semesters[si];
    if (!sem?.pdfUrl) return;
    if (!confirm('Remove this semester\'s PDF? This cannot be undone.')) return;
    try {
      if (sem.pdfStoragePath) await deleteFile(sem.pdfStoragePath);
    } catch (e) {
      alert(`Couldn't delete the file from storage: ${(e as Error).message}`);
      return;
    }
    let nextSemesters: ProgramSemester[] = [];
    setForm((p) => {
      nextSemesters = p.semesters.map((s, i) => (i === si ? { ...s, pdfUrl: '', pdfStoragePath: '' } : s));
      return { ...p, semesters: nextSemesters };
    });
    if (editing) {
      try {
        await updateDoc(doc(db, 'programs', editing), { semesters: nextSemesters });
      } catch (e) {
        alert(`The file was deleted from storage, but the saved record couldn't be updated: ${(e as Error).message}`);
      }
    }
  };
  const addSubject = (si: number) => {
    set('semesters', form.semesters.map((s, i) => (i === si ? { ...s, subjects: [...s.subjects, { title: '' }] } : s)));
  };
  const updateSubject = (si: number, ji: number, patch: Partial<ProgramSubject>) => {
    set('semesters', form.semesters.map((s, i) => (i !== si ? s : {
      ...s,
      subjects: s.subjects.map((sub, j) => (j === ji ? { ...sub, ...patch } : sub)),
    })));
  };
  const moveSubject = (si: number, ji: number, dir: -1 | 1) => {
    set('semesters', form.semesters.map((s, i) => {
      if (i !== si) return s;
      const subs = [...s.subjects];
      const target = ji + dir;
      if (target < 0 || target >= subs.length) return s;
      [subs[ji], subs[target]] = [subs[target], subs[ji]];
      return { ...s, subjects: subs };
    }));
  };
  const removeSubject = (si: number, ji: number) => {
    set('semesters', form.semesters.map((s, i) => (i === si ? { ...s, subjects: s.subjects.filter((_, j) => j !== ji) } : s)));
  };

  const save = async () => {
    if (!form.name || !form.slug) return alert('Program name and slug are required.');
    setSaving(true);
    try {
      const payload = stripUndefined({
        ...form,
        highlights: form.highlights.filter(Boolean),
        outcomes: form.outcomes.filter(Boolean),
        mission: form.mission.filter(Boolean),
        coreValues: form.coreValues.filter(Boolean),
        peos: form.peos.filter(Boolean),
        pos: form.pos.filter(Boolean),
        psos: form.psos.filter(Boolean),
      });
      if (editing) {
        // Only send fields that actually changed since this edit session
        // started — see diffChangedFields/originalForm above. Skips the
        // network call entirely if nothing did (e.g. Edit then Update with
        // no changes).
        const changed = originalForm ? diffChangedFields(payload, stripUndefined(originalForm)) : payload;
        if (Object.keys(changed).length > 0) {
          await updateDoc(doc(db, 'programs', editing), changed);
        }
      } else {
        await addDoc(collection(db, 'programs'), { ...payload, order: form.order || programs.filter((p) => p.category === form.category).length, createdAt: serverTimestamp() });
      }
      setForm(EMPTY); setEditing(null); setOriginalForm(null);
    } catch (e) {
      alert(`Couldn't save: ${(e as Error).message}`);
    } finally { setSaving(false); }
  };

  const startEdit = (p: ProgramDoc) => {
    setEditing(p.id);
    const next: Omit<ProgramDoc, 'id'> = {
      slug: p.slug, name: p.name, shortName: p.shortName, icon: p.icon || 'GraduationCap',
      category: p.category, intake: p.intake, established: p.established, accreditation: p.accreditation,
      hod: p.hod, department: p.department || '', fee: p.fee || '', heroImage: p.heroImage, storagePath: p.storagePath, about: p.about,
      highlights: p.highlights || [],
      labs: (p.labs || []).map(normalizeLab).map((l) => ({ name: l.name, description: l.description || '', pdfUrl: l.pdfUrl || '', pdfStoragePath: l.pdfStoragePath || '' })),
      outcomes: p.outcomes || [],
      semesters: (p.semesters || []).map((s) => ({
        label: s.label, subjects: (s.subjects || []).map(normalizeSubject),
        pdfUrl: s.pdfUrl || '', pdfStoragePath: s.pdfStoragePath || '',
      })),
      vision: p.vision || '', mission: p.mission || [], coreValues: p.coreValues || [],
      peos: p.peos || [], pos: p.pos || [], psos: p.psos || [], wks: p.wks || [],
      hodMessage: p.hodMessage || '', hodImage: p.hodImage || '', hodImageStoragePath: p.hodImageStoragePath || '',
      hodEmail: p.hodEmail || '', hodResearchProfiles: p.hodResearchProfiles || [],
      mindMapImages: normalizeMindMapImages(p),
      mindMapPdfUrl: p.mindMapPdfUrl || '', mindMapPdfStoragePath: p.mindMapPdfStoragePath || '',
      libraryIntro: p.libraryIntro || '', libraryInCharge: p.libraryInCharge || '',
      librarySections: (p.librarySections || []).map((s) => ({ heading: s.heading, items: s.items || [] })),
      newsEventsYears: (p.newsEventsYears || []).map((y) => ({
        year: y.year, columns: y.columns || [], rows: (y.rows || []).map((r) => ({ cells: r.cells || [] })),
      })),
      customSections: p.customSections || [],
      order: p.order || 0,
    };
    setForm(next);
    setOriginalForm(next);
  };

  const remove = async (id: string) => {
    if (!confirm('Delete this program?')) return;
    try {
      await deleteDoc(doc(db, 'programs', id));
    } catch (e) {
      alert(`Couldn't delete: ${(e as Error).message}`);
    }
  };

  return (
    <div className="admin-section">
      <div className="admin-card">
        <h2 className="admin-card__title">{editing ? 'Edit Program' : 'Add Program'}</h2>
        <p className="admin-field__hint" style={{ background: '#eef6ff', border: '1px solid #bcdcfd', borderRadius: 6, padding: '0.6rem 0.9rem', marginBottom: '1rem' }}>
          This program's hero image is now edited from <strong>Hero Banners → Programs</strong>, not here.
        </p>
        <div className="admin-form-grid">
          <div className="admin-field">
            <label htmlFor="field-full-name">Full Name *</label>
            <input id="field-full-name" value={form.name} onChange={(e) => set('name', e.target.value)} placeholder="B.Tech Computer Science and Engineering" />
          </div>
          <div className="admin-field">
            <label htmlFor="field-short-name">Short Name</label>
            <input id="field-short-name" value={form.shortName} onChange={(e) => set('shortName', e.target.value)} placeholder="B.Tech CSE" />
          </div>
          <div className="admin-field">
            <label htmlFor="field-slug-used-in-url">Slug (used in URL) *</label>
            <input id="field-slug-used-in-url" value={form.slug} onChange={(e) => set('slug', e.target.value)} placeholder="cse" />
          </div>
          <div className="admin-field">
            <label htmlFor="field-icon">Icon</label>
            <select id="field-icon" value={form.icon} onChange={(e) => set('icon', e.target.value)}>
              {PROGRAM_ICON_NAMES.map((n) => <option key={n} value={n}>{n}</option>)}
            </select>
          </div>
          <div className="admin-field">
            <label htmlFor="field-category">Category</label>
            <select id="field-category" value={form.category} onChange={(e) => set('category', e.target.value)}>
              {CATEGORIES.map((c) => <option key={c} value={c}>{CATEGORY_LABELS[c]}</option>)}
            </select>
          </div>
          <div className="admin-field">
            <label htmlFor="field-intake-seats">Intake (seats)</label>
            <input id="field-intake-seats" type="number" value={form.intake} onChange={(e) => set('intake', +e.target.value)} min={0} />
          </div>
          <div className="admin-field">
            <label htmlFor="field-established-year">Established Year</label>
            <input id="field-established-year" value={form.established} onChange={(e) => set('established', e.target.value)} placeholder="2000" />
          </div>
          <div className="admin-field">
            <label htmlFor="field-accreditation">Accreditation</label>
            <input id="field-accreditation" value={form.accreditation} onChange={(e) => set('accreditation', e.target.value)} placeholder="NBA Tier-I Accredited" />
          </div>
          <div className="admin-field">
            <label htmlFor="field-annual-fee">Annual Fee</label>
            <input id="field-annual-fee" value={form.fee} onChange={(e) => set('fee', e.target.value)} placeholder="₹ 1,05,000" />
          </div>
          <div className="admin-field">
            <label htmlFor="field-department-links-this-program-to">Department (links this program to the Faculty page)</label>
            <input id="field-department-links-this-program-to" list="program-departments" value={form.department} onChange={(e) => set('department', e.target.value)} placeholder="CSE" />
            <datalist id="program-departments">
              {DEPARTMENTS.map((d) => <option key={d} value={d} />)}
            </datalist>
          </div>
          <div className="admin-field">
            <label htmlFor="field-display-order">Display Order</label>
            <input id="field-display-order" type="number" value={form.order} onChange={(e) => set('order', +e.target.value)} min={0} />
          </div>
          <div className="admin-field admin-field--full">
            <label htmlFor="field-about">About the Programme</label>
            <p className="admin-field__hint" style={{ marginTop: 0 }}>
              For this specific programme's own page. Shown as "About the Programme". Department-wide text
              ("About the Department") is a separate field, edited on the matching record in{' '}
              <strong>Admin → Academic Departments → Overview</strong>.
            </p>
            <textarea id="field-about" rows={4} value={form.about} onChange={(e) => set('about', e.target.value)} placeholder="Programme overview…" />
          </div>
          <div className="admin-field admin-field--full">
            <label htmlFor="field-highlights-one-per-line">Highlights (one per line)</label>
            <textarea id="field-highlights-one-per-line" rows={5} value={arrayToLines(form.highlights)} onChange={(e) => set('highlights', linesToArray(e.target.value))} placeholder="NBA Tier-I Accredited undergraduate programme" />
          </div>
          <div className="admin-field admin-field--full">
            <p className="admin-field__hint">
              Vision, Mission &amp; Values, Laboratories, and the Department Library aren't edited per-programme
              anymore — they're the same across a department's programmes, so they now live on the matching card in
              <strong> Admin → Academic Departments</strong> instead.
            </p>
          </div>
          <div className="admin-field admin-field--full">
            <label htmlFor="field-career-outcomes-one-per-line">Career Outcomes (one per line)</label>
            <textarea id="field-career-outcomes-one-per-line" rows={5} value={arrayToLines(form.outcomes)} onChange={(e) => set('outcomes', linesToArray(e.target.value))} placeholder="Software Engineer / Developer" />
          </div>
          <div className="admin-field admin-field--full"><hr /><h3>Programme Structure (Semester-wise Curriculum)</h3></div>
          <p className="admin-field__hint" style={{ marginTop: '-0.5rem' }}>
            Each semester can have its own uploaded PDF (e.g. the full syllabus). On the public page, clicking that
            semester's PDF link downloads it directly — a semester with no PDF uploaded just shows its subject list
            with no download link.
          </p>
          <div className="admin-field admin-field--full">
            {form.semesters.map((sem, si) => (
              <div key={si} style={{ border: '1.5px solid var(--color-light-gray)', borderRadius: 8, padding: '0.75rem', marginBottom: '0.75rem' }}>
                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginBottom: '0.5rem' }}>
                  <input
                    value={sem.label}
                    onChange={(e) => updateSemesterLabel(si, e.target.value)}
                    placeholder="Semester I"
                    style={{ flex: 1, fontWeight: 700 }}
                  />
                  <button type="button" className="admin-btn admin-btn--sm" onClick={() => moveSemester(si, -1)} disabled={si === 0} title="Move up">↑</button>
                  <button type="button" className="admin-btn admin-btn--sm" onClick={() => moveSemester(si, 1)} disabled={si === form.semesters.length - 1} title="Move down">↓</button>
                  <button type="button" className="admin-btn admin-btn--sm admin-btn--danger" onClick={() => removeSemester(si)}>Remove Semester</button>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginBottom: '0.5rem' }}>
                  <FileUploader
                    compact
                    folder="vwu/programs/semesters"
                    currentUrl={sem.pdfUrl}
                    onUploaded={(r) => handleSemesterPdf(si, r)}
                    label="Upload Semester PDF"
                  />
                  <button
                    type="button"
                    className="admin-btn admin-btn--ghost admin-btn--sm"
                    onClick={() => removeSemesterPdf(si)}
                    disabled={!sem.pdfUrl}
                    title={sem.pdfUrl ? 'Remove PDF' : 'No PDF uploaded yet'}
                  >
                    Remove PDF
                  </button>
                </div>

                {sem.subjects.map((subj, ji) => (
                  <div key={ji} style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.4rem' }}>
                    <input
                      value={subj.title}
                      onChange={(e) => updateSubject(si, ji, { title: e.target.value })}
                      placeholder="Subject title"
                      style={{ flex: 2 }}
                    />
                    <input
                      value={subj.code ?? ''}
                      onChange={(e) => updateSubject(si, ji, { code: e.target.value || undefined })}
                      placeholder="Code (optional)"
                      style={{ flex: 1 }}
                    />
                    <input
                      type="number"
                      value={subj.credits ?? ''}
                      onChange={(e) => updateSubject(si, ji, { credits: e.target.value === '' ? undefined : Number(e.target.value) })}
                      placeholder="Credits"
                      style={{ width: 80 }}
                      min={0}
                    />
                    <button type="button" className="admin-btn admin-btn--sm" onClick={() => moveSubject(si, ji, -1)} disabled={ji === 0} title="Move up">↑</button>
                    <button type="button" className="admin-btn admin-btn--sm" onClick={() => moveSubject(si, ji, 1)} disabled={ji === sem.subjects.length - 1} title="Move down">↓</button>
                    <button type="button" className="admin-btn admin-btn--sm admin-btn--danger" onClick={() => removeSubject(si, ji)}>✕</button>
                  </div>
                ))}
                <button type="button" className="admin-btn admin-btn--sm" onClick={() => addSubject(si)}>+ Add Subject</button>
              </div>
            ))}
            <button type="button" className="admin-btn admin-btn--primary" onClick={addSemester}>+ Add Semester</button>
            {form.semesters.length === 0 && (
              <p className="admin-field__hint">No semesters yet — click "Add Semester" to start building this programme's curriculum.</p>
            )}
          </div>

          <div className="admin-field admin-field--full"><hr /><h3>PEOs, POs, PSOs & WKs</h3></div>
          <div className="admin-field admin-field--full">
            <label htmlFor="field-programme-educational-objectives-peos-one">Programme Educational Objectives — PEOs (one per line)</label>
            <textarea id="field-programme-educational-objectives-peos-one" rows={4} value={arrayToLines(form.peos)} onChange={(e) => set('peos', linesToArray(e.target.value))} placeholder="Graduates will excel in…" />
          </div>
          <div className="admin-field admin-field--full">
            <label htmlFor="field-programme-outcomes-pos-one-per">Programme Outcomes — POs (one per line)</label>
            <textarea id="field-programme-outcomes-pos-one-per" rows={5} value={arrayToLines(form.pos)} onChange={(e) => set('pos', linesToArray(e.target.value))} placeholder="Engineering knowledge…" />
          </div>
          <div className="admin-field admin-field--full">
            <label htmlFor="field-programme-specific-outcomes-psos-one">Programme Specific Outcomes — PSOs (one per line)</label>
            <textarea id="field-programme-specific-outcomes-psos-one" rows={4} value={arrayToLines(form.psos)} onChange={(e) => set('psos', linesToArray(e.target.value))} placeholder="Ability to apply…" />
          </div>
          <div className="admin-field admin-field--full">
            <label htmlFor="field-knowledge-profile-wks-one-per-line">Knowledge Profile — WKs (one per line)</label>
            <textarea id="field-knowledge-profile-wks-one-per-line" rows={4} value={arrayToLines(form.wks)} onChange={(e) => set('wks', linesToArray(e.target.value))} placeholder="Systematic, theory-based understanding of the natural sciences…" />
          </div>

          <div className="admin-field admin-field--full">
            <p className="admin-field__hint">
              About HOD (name, photo, email, message, research profiles) isn't edited per-programme anymore — a
              department has one Head of Department, not one per programme, so it now lives on the matching card in
              <strong> Admin → Academic Departments</strong> instead.
            </p>
          </div>

          <div className="admin-field admin-field--full"><hr /><h3>Mind Map</h3></div>
          <p className="admin-field__hint" style={{ marginTop: '-0.5rem' }}>
            Upload one or more Mind Map images — shown as a gallery on the public page — plus, optionally, a PDF version visitors can download.
          </p>
          <div className="admin-field admin-field--full">
            <label>Mind Map Images</label>
            {mindMapImages.length > 0 && (
              <div className="admin-image-grid" style={{ marginBottom: '0.75rem' }}>
                {mindMapImages.map((img, mi) => (
                  <div key={mi} className="admin-image-card">
                    <img src={img.url} alt="" />
                    <div className="admin-image-card__actions">
                      <button type="button" className="admin-btn admin-btn--sm" onClick={() => moveMindMapImage(mi, -1)} disabled={mi === 0} title="Move up">↑</button>
                      <button type="button" className="admin-btn admin-btn--sm" onClick={() => moveMindMapImage(mi, 1)} disabled={mi === mindMapImages.length - 1} title="Move down">↓</button>
                      <button type="button" className="admin-btn admin-btn--sm admin-btn--danger" onClick={() => removeMindMapImage(mi)}>Remove</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
            <label className="admin-btn admin-btn--primary" style={{ opacity: mindMapUploading ? 0.5 : 1, display: 'inline-block', cursor: 'pointer' }}>
              {mindMapUploading ? 'Uploading…' : '+ Add Mind Map Image'}
              <input
                type="file"
                accept="image/*"
                hidden
                disabled={mindMapUploading}
                onChange={(e) => { const f = e.target.files?.[0]; if (f) addMindMapImage(f); e.target.value = ''; }}
              />
            </label>
            {mindMapImages.length === 0 && (
              <p className="admin-field__hint">No Mind Map images yet — click "Add Mind Map Image" to upload one (add more to build a gallery).</p>
            )}
          </div>
          <div className="admin-field admin-field--full">
            <label>Mind Map PDF (optional)</label>
            <FileUploader folder="vwu/programs/mindmap-pdf" currentUrl={form.mindMapPdfUrl} onUploaded={handleMindMapPdf} label="Upload Mind Map PDF" />
            {form.mindMapPdfUrl && (
              <button type="button" className="admin-btn admin-btn--ghost admin-btn--sm" style={{ marginTop: '0.5rem' }} onClick={removeMindMapPdf}>Remove PDF</button>
            )}
          </div>

          <div className="admin-field admin-field--full"><hr /><h3>News &amp; Events — This Programme</h3></div>
          <div className="admin-field admin-field--full">
            {editing ? (
              <DepartmentNewsManager programSlug={form.slug} />
            ) : (
              <p className="admin-field__hint">Save this program first, then reopen it here to add News &amp; Events.</p>
            )}
          </div>

          <div className="admin-field admin-field--full">
            <p className="admin-field__hint">
              Newsletter and Research &amp; Development aren't edited per-programme here anymore — like
              Placements and Internships, they now live on the matching card in{' '}
              <strong>Admin → Academic Departments</strong> instead (pick this programme from the selector
              there once your changes here are saved).
            </p>
          </div>

          <div className="admin-field admin-field--full"><hr /><h3>Custom Sections</h3></div>
          <p className="admin-field__hint" style={{ marginTop: '-0.5rem' }}>
            Optional. Add any section this programme needs beyond the fixed ones above — any name, any number of
            sub-sections, and a choice of plain text, a table, a list of links, or uploaded files per section. Each
            one automatically gets its own Quick Links entry and shows up on the public page once it has content.
          </p>
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
        </div>
      </div>
      {mindMapCropModal}

      <div className="admin-card">
        <div className="admin-form-actions">
          {editing && <button className="admin-btn admin-btn--ghost" onClick={() => { setEditing(null); setForm(EMPTY); setOriginalForm(null); }}>Cancel</button>}
          <button className="admin-btn admin-btn--primary" onClick={save} disabled={saving}>
            {saving ? 'Saving…' : editing ? 'Update Program' : 'Add Program'}
          </button>
        </div>
      </div>

      <div className="admin-card">
        <h2 className="admin-card__title">All Programs ({programs.length})</h2>
        <p className="admin-field__hint" style={{ marginBottom: '0.75rem' }}>
          Programs are grouped by category, matching the tabs on the public Academics page. Drag rows by the ⠿ handle
          within a category to change the order they appear in on that tab.
        </p>
        {loading ? <p className="admin-loading">Loading…</p> : CATEGORIES.map((cat) => {
          const list = groupedOrdered[cat] || [];
          return (
            <div key={cat} style={{ marginBottom: '1.5rem' }}>
              <h3 style={{ fontSize: '0.95rem', marginBottom: '0.5rem' }}>{CATEGORY_LABELS[cat]} ({list.length})</h3>
              <div className="admin-table-wrap">
                <table className="admin-table">
                  <thead><tr><th></th><th>Name</th><th>Slug</th><th>Intake</th><th>Accreditation</th><th>Actions</th></tr></thead>
                  <tbody>
                    {list.map((p, i) => (
                      <tr
                        key={p.id}
                        draggable
                        onDragStart={() => setDrag({ cat, index: i })}
                        onDragOver={(e) => { e.preventDefault(); handleDragOver(cat, i); }}
                        onDrop={() => handleDrop(cat)}
                        onDragEnd={() => setDrag(null)}
                        style={{ opacity: drag?.cat === cat && drag.index === i ? 0.5 : 1, cursor: 'grab' }}
                      >
                        <td style={{ color: 'var(--color-text-light, #9ca3af)', fontSize: '1.1rem', userSelect: 'none' }}>⠿</td>
                        <td><strong>{p.shortName || p.name}</strong><br /><small>{p.name}</small></td>
                        <td><code>{p.slug}</code></td>
                        <td>{p.intake}</td>
                        <td>{p.accreditation || '—'}</td>
                        <td>
                          <button className="admin-btn admin-btn--sm" onClick={() => startEdit(p)}>Edit</button>
                          <button className="admin-btn admin-btn--sm admin-btn--danger" onClick={() => remove(p.id)}>Delete</button>
                        </td>
                      </tr>
                    ))}
                    {list.length === 0 && <tr><td colSpan={6} className="admin-empty">No {CATEGORY_LABELS[cat]} programs yet.</td></tr>}
                  </tbody>
                </table>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
