import { useEffect, useState } from 'react';
import {
  collection, addDoc, deleteDoc, doc, updateDoc, serverTimestamp, writeBatch,
} from 'firebase/firestore';
import { db } from '../../../lib/firebase';
import { useOrderedCollection } from '../../../hooks/useCollection';
import ImageUploader from '../../../components/ImageUploader/ImageUploader';
import FileUploader from '../../../components/FileUploader/FileUploader';
import { deleteFile, type UploadResult } from '../../../lib/storage';
import { PROGRAM_ICON_NAMES } from '../../../lib/programIcons';
import DepartmentNewsManager from './DepartmentNewsManager';
import type { PlacementYearRecord } from '../../../lib/placementRecords';
import { parsePlacementsFile, type PlacementImportResult } from '../../../lib/placementsImport';
import CustomSectionEditor from './CustomSectionEditor';
import { replaceAtPath, getAtPath, type CustomSection } from '../../../lib/customSections';
import RndTableEditor, { type RndStructuredTable } from './RndTableEditor';

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
  mindMapImage: string;
  mindMapImageStoragePath: string;
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
  mindMapImage: '', mindMapImageStoragePath: '',
  libraryIntro: '', libraryInCharge: '', librarySections: [],
  newsEventsYears: [],
  newsletterYears: [],
  rndIntro: '', rndTableText: '', rndProjectsText: '', rndLinks: [],
  rndStructuredTable: { columns: [], rows: [] },
  // placementYears is intentionally NOT part of this form/EMPTY: it's
  // managed entirely by <PlacementYearsEditor> below via its own immediate
  // Firestore writes (same reason the old department-wide placement editor
  // was kept separate — see that component's own comment). Leaving it out
  // of `form` means `save()`'s `{...form}` spread never touches this field,
  // so clicking "Update Program" can never clobber it with a stale/empty
  // array.
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

  const set = (k: string, v: string | number | string[] | ProgramSemester[] | ProgramLink[] | LibrarySection[] | NewsEventsYear[] | NewsletterYear[] | RndLink[] | RndStructuredTable | LabItem[] | CustomSection[]) => setForm((p) => ({ ...p, [k]: v }));
  const handleMindMapImage = (r: UploadResult) => setForm((p) => ({ ...p, mindMapImage: r.url, mindMapImageStoragePath: r.path }));

  // Newsletter (academic years, each with an ordered list of PDF-backed
  // issues) editing. An issue's "Issue – N" label is always its position,
  // so removing one just shifts the rest down — nothing to relabel.
  const newsletterYears = form.newsletterYears || [];
  const addNewsletterYear = () => {
    set('newsletterYears', [...newsletterYears, { year: '', issues: [] }]);
  };
  const updateNewsletterYearLabel = (yi: number, year: string) => {
    set('newsletterYears', newsletterYears.map((y, i) => (i === yi ? { ...y, year } : y)));
  };
  const moveNewsletterYear = (yi: number, dir: -1 | 1) => {
    const next = [...newsletterYears];
    const target = yi + dir;
    if (target < 0 || target >= next.length) return;
    [next[yi], next[target]] = [next[target], next[yi]];
    set('newsletterYears', next);
  };
  const removeNewsletterYear = (yi: number) => {
    if (!confirm('Remove this academic year and all its issues?')) return;
    set('newsletterYears', newsletterYears.filter((_, i) => i !== yi));
  };
  const addNewsletterIssue = (yi: number) => {
    set('newsletterYears', newsletterYears.map((y, i) => (i !== yi ? y : { ...y, issues: [...y.issues, {}] })));
  };
  const handleNewsletterIssuePdf = (yi: number, ii: number, r: UploadResult) => {
    set('newsletterYears', newsletterYears.map((y, i) => (i !== yi ? y : {
      ...y,
      issues: y.issues.map((iss, j) => (j === ii ? { pdfUrl: r.url, pdfStoragePath: r.path } : iss)),
    })));
  };
  const removeNewsletterIssuePdf = (yi: number, ii: number) => {
    set('newsletterYears', newsletterYears.map((y, i) => (i !== yi ? y : {
      ...y,
      issues: y.issues.map((iss, j) => (j === ii ? {} : iss)),
    })));
  };
  const moveNewsletterIssue = (yi: number, ii: number, dir: -1 | 1) => {
    set('newsletterYears', newsletterYears.map((y, i) => {
      if (i !== yi) return y;
      const target = ii + dir;
      if (target < 0 || target >= y.issues.length) return y;
      const issues = [...y.issues];
      [issues[ii], issues[target]] = [issues[target], issues[ii]];
      return { ...y, issues };
    }));
  };
  const removeNewsletterIssue = (yi: number, ii: number) => {
    set('newsletterYears', newsletterYears.map((y, i) => (i !== yi ? y : { ...y, issues: y.issues.filter((_, j) => j !== ii) })));
  };

  // Research & Development (Funded Projects & Patents) editing — a flat
  // admin-named list of links, each backed by its own uploaded PDF.
  const rndLinks = form.rndLinks || [];
  const addRndLink = () => {
    set('rndLinks', [...rndLinks, { label: '' }]);
  };
  const updateRndLinkLabel = (li: number, label: string) => {
    set('rndLinks', rndLinks.map((l, i) => (i === li ? { ...l, label } : l)));
  };
  const moveRndLink = (li: number, dir: -1 | 1) => {
    const next = [...rndLinks];
    const target = li + dir;
    if (target < 0 || target >= next.length) return;
    [next[li], next[target]] = [next[target], next[li]];
    set('rndLinks', next);
  };
  const removeRndLink = (li: number) => {
    if (!confirm('Remove this link?')) return;
    set('rndLinks', rndLinks.filter((_, i) => i !== li));
  };
  const handleRndLinkPdf = (li: number, r: UploadResult) => {
    set('rndLinks', rndLinks.map((l, i) => (i === li ? { ...l, pdfUrl: r.url, pdfStoragePath: r.path } : l)));
  };
  const removeRndLinkPdf = (li: number) => {
    set('rndLinks', rndLinks.map((l, i) => (i === li ? { ...l, pdfUrl: '', pdfStoragePath: '' } : l)));
  };

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
        await updateDoc(doc(db, 'programs', editing), { ...payload });
      } else {
        await addDoc(collection(db, 'programs'), { ...payload, order: form.order || programs.filter((p) => p.category === form.category).length, createdAt: serverTimestamp() });
      }
      setForm(EMPTY); setEditing(null);
    } catch (e) {
      alert(`Couldn't save: ${(e as Error).message}`);
    } finally { setSaving(false); }
  };

  const startEdit = (p: ProgramDoc) => {
    setEditing(p.id);
    setForm({
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
      mindMapImage: p.mindMapImage || '', mindMapImageStoragePath: p.mindMapImageStoragePath || '',
      libraryIntro: p.libraryIntro || '', libraryInCharge: p.libraryInCharge || '',
      librarySections: (p.librarySections || []).map((s) => ({ heading: s.heading, items: s.items || [] })),
      newsEventsYears: (p.newsEventsYears || []).map((y) => ({
        year: y.year, columns: y.columns || [], rows: (y.rows || []).map((r) => ({ cells: r.cells || [] })),
      })),
      newsletterYears: (p.newsletterYears || []).map((y) => ({
        year: y.year,
        issues: (y.issues || []).map((iss) => ({ pdfUrl: iss.pdfUrl || '', pdfStoragePath: iss.pdfStoragePath || '' })),
      })),
      rndIntro: p.rndIntro || '', rndTableText: p.rndTableText || '', rndProjectsText: p.rndProjectsText || '',
      rndLinks: (p.rndLinks || []).map((l) => ({ label: l.label, pdfUrl: l.pdfUrl || '', pdfStoragePath: l.pdfStoragePath || '' })),
      rndStructuredTable: {
        columns: p.rndStructuredTable?.columns || [],
        rows: (p.rndStructuredTable?.rows || []).map((r) => ({ cells: r.cells || [], pdfUrl: r.pdfUrl || '', pdfStoragePath: r.pdfStoragePath || '' })),
      },
      customSections: p.customSections || [],
      order: p.order || 0,
    });
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
            <label htmlFor="field-about">About</label>
            <textarea id="field-about" rows={4} value={form.about} onChange={(e) => set('about', e.target.value)} placeholder="Department overview…" />
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
          <div className="admin-field admin-field--full">
            <label>Curriculum Mind Map Image</label>
            <ImageUploader folder="vwu/programs/mindmap" currentUrl={form.mindMapImage} onUploaded={handleMindMapImage} label="Upload Mind Map Image" />
          </div>

          <div className="admin-field admin-field--full">
            <p className="admin-field__hint">
              The academic-year "News &amp; Events" table (News &amp; Events / Student Awards / Others tabs) isn't
              edited per-programme anymore — it's shared across a department's programmes, so it now lives on the
              matching card in <strong>Admin → Academic Departments</strong> instead.
            </p>
          </div>

          <div className="admin-field admin-field--full"><hr /><h3>News &amp; Events — This Programme</h3></div>
          <div className="admin-field admin-field--full">
            {editing ? (
              <DepartmentNewsManager programSlug={form.slug} />
            ) : (
              <p className="admin-field__hint">Save this program first, then reopen it here to add News &amp; Events.</p>
            )}
          </div>

          <div className="admin-field admin-field--full"><hr /><h3>Newsletter</h3></div>
          <p className="admin-field__hint" style={{ marginTop: '-0.5rem' }}>
            Optional. Shown as a "Newsletter" section (and Quick Links entry) on this programme's page. Add an
            academic year, then upload a PDF for each issue under it — "Issue – 1", "Issue – 2", etc. are
            numbered automatically by position, so removing one just shifts the rest down.
          </p>
          <div className="admin-field admin-field--full">
            {newsletterYears.map((yr, yi) => (
              <div key={yi} style={{ border: '1.5px solid var(--color-light-gray)', borderRadius: 8, padding: '0.75rem', marginBottom: '0.75rem' }}>
                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginBottom: '0.75rem' }}>
                  <input
                    value={yr.year}
                    onChange={(e) => updateNewsletterYearLabel(yi, e.target.value)}
                    placeholder="2025-26"
                    style={{ flex: 1, fontWeight: 700 }}
                  />
                  <button type="button" className="admin-btn admin-btn--sm" onClick={() => moveNewsletterYear(yi, -1)} disabled={yi === 0} title="Move up">↑</button>
                  <button type="button" className="admin-btn admin-btn--sm" onClick={() => moveNewsletterYear(yi, 1)} disabled={yi === newsletterYears.length - 1} title="Move down">↓</button>
                  <button type="button" className="admin-btn admin-btn--sm admin-btn--danger" onClick={() => removeNewsletterYear(yi)}>Remove Year</button>
                </div>

                {yr.issues.map((issue, ii) => (
                  <div key={ii} style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', marginBottom: '0.6rem', flexWrap: 'wrap' }}>
                    <strong style={{ minWidth: 70 }}>Issue – {ii + 1}</strong>
                    <div style={{ maxWidth: 260 }}>
                      <FileUploader
                        folder="vwu/programs/newsletter"
                        currentUrl={issue.pdfUrl}
                        onUploaded={(r) => handleNewsletterIssuePdf(yi, ii, r)}
                        label="Upload PDF"
                      />
                    </div>
                    {issue.pdfUrl && (
                      <button type="button" className="admin-btn admin-btn--ghost admin-btn--sm" onClick={() => removeNewsletterIssuePdf(yi, ii)}>
                        Remove PDF
                      </button>
                    )}
                    <button type="button" className="admin-btn admin-btn--sm" onClick={() => moveNewsletterIssue(yi, ii, -1)} disabled={ii === 0} title="Move up">↑</button>
                    <button type="button" className="admin-btn admin-btn--sm" onClick={() => moveNewsletterIssue(yi, ii, 1)} disabled={ii === yr.issues.length - 1} title="Move down">↓</button>
                    <button type="button" className="admin-btn admin-btn--sm admin-btn--danger" onClick={() => removeNewsletterIssue(yi, ii)}>Remove Issue</button>
                  </div>
                ))}
                <button type="button" className="admin-btn admin-btn--sm" onClick={() => addNewsletterIssue(yi)}>+ Add Issue</button>
              </div>
            ))}
            <button type="button" className="admin-btn admin-btn--primary" onClick={addNewsletterYear}>+ Add Academic Year</button>
            {newsletterYears.length === 0 && (
              <p className="admin-field__hint">No academic years yet — click "Add Academic Year" to start building this programme's Newsletter.</p>
            )}
          </div>

          <div className="admin-field admin-field--full"><hr /><h3>Research &amp; Development (Funded Projects &amp; Patents)</h3></div>
          <p className="admin-field__hint" style={{ marginTop: '-0.5rem' }}>
            Optional. Shown as a "Research &amp; Development (Funded Projects &amp; Patents)" section (and Quick
            Links entry) on this programme's page. Real department R&amp;D pages vary a lot — use whichever of the
            five fields below fit this department's actual content; only the ones you fill in will show.
          </p>
          <div className="admin-field admin-field--full">
            <label htmlFor="field-rnd-intro">Overview (optional)</label>
            <textarea id="field-rnd-intro" rows={3} value={form.rndIntro} onChange={(e) => set('rndIntro', e.target.value)} placeholder="An introductory paragraph, e.g. project background, campus context, or a general statement about the department's research focus." />
          </div>
          <div className="admin-field admin-field--full">
            <label>Table (optional — for a flat table like Patents: Application No. | Title | Proof). Start a
              section with <code>## Section Title</code> (optional if there's only one table), then a header row and
              data rows, all pipe-separated — the first line under a section becomes the column headers.</label>
            <textarea
              rows={6}
              value={form.rndTableText}
              onChange={(e) => set('rndTableText', e.target.value)}
              placeholder={'## Patents\nApplication No. | Title | Proof\n202441093677 | Home safety and guidance system... | https://...\n6335941 | Novel Display Design for Immersive VR | https://...'}
            />
          </div>
          <div className="admin-field admin-field--full">
            <label>Detailed Project / Patent Cards (optional — for entries with several labeled fields, e.g. a
              granted patent's invention title, patent number, grant date, inventor). Start each category with{' '}
              <code>## Category</code> (e.g. <code>## Patents Granted</code>), each entry with{' '}
              <code>### Title</code>, then <code>Label: value</code> lines for its fields, and{' '}
              <code>- bullet text</code> lines for an optional Outcome list.</label>
            <textarea
              rows={8}
              value={form.rndProjectsText}
              onChange={(e) => set('rndProjectsText', e.target.value)}
              placeholder={'## Funds from AICTE\n### Dictated Note Printer in Braille for Blind with Cyber Physical System\nReference: DST/SEED/TIDE/2023/1131 (C)\nAmount: Rs. 34,24,523/- (2025)\n\n## Patents Granted\n### Machine Learning Based DC-DC Converter\nPatent Number: 202441093677\nApplication Number: 202441093677\nGrant Date: 12-03-2025\nInventor: Dr. G Srinivasa Rao'}
            />
          </div>
          <div className="admin-field admin-field--full">
            <label className="admin-field__hint" style={{ display: 'block', marginBottom: '0.5rem' }}>PDF-only Links (optional — for a department that just wants to link out to a couple of PDFs, e.g. "Funded R&amp;D Projects" / "In-house R&amp;D Projects").</label>
            {rndLinks.map((link, li) => (
              <div key={li} style={{ border: '1.5px solid var(--color-light-gray)', borderRadius: 8, padding: '0.75rem', marginBottom: '0.75rem' }}>
                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginBottom: '0.6rem' }}>
                  <input
                    value={link.label}
                    onChange={(e) => updateRndLinkLabel(li, e.target.value)}
                    placeholder="Link name, e.g. Funded Project – AICTE RPS 2023"
                    style={{ flex: 1, fontWeight: 700 }}
                  />
                  <button type="button" className="admin-btn admin-btn--sm" onClick={() => moveRndLink(li, -1)} disabled={li === 0} title="Move up">↑</button>
                  <button type="button" className="admin-btn admin-btn--sm" onClick={() => moveRndLink(li, 1)} disabled={li === rndLinks.length - 1} title="Move down">↓</button>
                  <button type="button" className="admin-btn admin-btn--sm admin-btn--danger" onClick={() => removeRndLink(li)}>Remove Link</button>
                </div>
                <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap' }}>
                  <div style={{ maxWidth: 260 }}>
                    <FileUploader
                      folder="vwu/programs/rnd"
                      currentUrl={link.pdfUrl}
                      onUploaded={(r) => handleRndLinkPdf(li, r)}
                      label="Upload PDF"
                    />
                  </div>
                  {link.pdfUrl && (
                    <button type="button" className="admin-btn admin-btn--ghost admin-btn--sm" onClick={() => removeRndLinkPdf(li)}>
                      Remove PDF
                    </button>
                  )}
                </div>
              </div>
            ))}
            <button type="button" className="admin-btn admin-btn--primary" onClick={addRndLink}>+ Add Link</button>
            {rndLinks.length === 0 && (
              <p className="admin-field__hint">No links yet — click "Add Link" to start building this programme's Research &amp; Development list.</p>
            )}
          </div>
          <div className="admin-field admin-field--full">
            <label className="admin-field__hint" style={{ display: 'block', marginBottom: '0.5rem' }}>
              Structured Table (optional — a table with columns you add yourself, where each row also has its own
              uploaded PDF, e.g. a Patents table where every row links to that patent's own document).
            </label>
            <RndTableEditor
              table={form.rndStructuredTable || { columns: [], rows: [] }}
              onChange={(t) => set('rndStructuredTable', t)}
            />
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
            />
          </div>
        </div>
        <div className="admin-form-actions">
          {editing && <button className="admin-btn admin-btn--ghost" onClick={() => { setEditing(null); setForm(EMPTY); }}>Cancel</button>}
          <button className="admin-btn admin-btn--primary" onClick={save} disabled={saving}>
            {saving ? 'Saving…' : editing ? 'Update Program' : 'Add Program'}
          </button>
        </div>
      </div>

      {editing && (() => {
        const liveProgram = programs.find((p) => p.id === editing);
        return liveProgram ? <PlacementYearsEditor program={liveProgram} /> : null;
      })()}

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

// Individual student Placement Records for one programme, grouped by
// Academic Year — kept separate from the main programme form/doc's "Update
// Program" save (like the department-wide version this replaces) since
// it's a much bigger, purely tabular dataset per year; every action here
// writes straight to Firestore immediately instead of staging in `form`.
// Scoped to exactly one Academic Year + Department + Programme: the
// programme doc already carries its own `department`, and `placementYears`
// lives on this specific programme's own doc, so B.Tech ECE / B.Tech EVT /
// M.Tech VLSI (all department "ECE") each keep fully independent data. An
// admin adds an Academic Year, imports an Excel/CSV file for it, reviews
// the detected columns + a preview of the parsed rows, then saves;
// re-importing a year later fully replaces that year's previous dataset.
// Columns are never assumed or hardcoded — whatever the uploaded file's
// header row contains is exactly what gets stored and shown.
function PlacementYearsEditor({ program }: { program: ProgramDoc }) {
  const years = program.placementYears || [];
  const [newYearLabel, setNewYearLabel] = useState('');
  const [previews, setPreviews] = useState<Record<number, PlacementImportResult>>({});
  const [importingYear, setImportingYear] = useState<number | null>(null);
  const [busyYear, setBusyYear] = useState<number | null>(null);

  const persistYears = (next: PlacementYearRecord[]) => updateDoc(doc(db, 'programs', program.id), { placementYears: next });

  const addYear = async () => {
    const label = newYearLabel.trim();
    if (!label) return;
    if (years.some((y) => y.year.trim().toLowerCase() === label.toLowerCase())) {
      alert('That Academic Year already exists for this programme.');
      return;
    }
    try {
      await persistYears([...years, { year: label, columns: [], rows: [] }]);
      setNewYearLabel('');
    } catch (e) {
      alert(`Couldn't add Academic Year: ${(e as Error).message}`);
    }
  };

  const removeYear = async (yi: number) => {
    if (!confirm(`Remove Academic Year "${years[yi].year}" and all its placement records? This cannot be undone.`)) return;
    setBusyYear(yi);
    try {
      await persistYears(years.filter((_, i) => i !== yi));
    } catch (e) {
      alert(`Couldn't remove Academic Year: ${(e as Error).message}`);
    } finally {
      setBusyYear(null);
    }
  };

  const moveYear = async (yi: number, dir: -1 | 1) => {
    const target = yi + dir;
    if (target < 0 || target >= years.length) return;
    const next = [...years];
    [next[yi], next[target]] = [next[target], next[yi]];
    try {
      await persistYears(next);
    } catch (e) {
      alert(`Couldn't reorder: ${(e as Error).message}`);
    }
  };

  const handleFile = async (yi: number, file: File) => {
    setImportingYear(yi);
    try {
      const result = await parsePlacementsFile(file);
      if (result.columns.length === 0 || result.rows.length === 0) {
        alert(
          "Couldn't find any data in that file — for Excel/CSV make sure the first row has column headers, " +
          'for Word make sure the records are in an actual table, and for PDF make sure it has selectable text (not a scanned image).'
        );
        return;
      }
      setPreviews((p) => ({ ...p, [yi]: result }));
    } catch (e) {
      alert(`Couldn't read that file: ${(e as Error).message}`);
    } finally {
      setImportingYear(null);
    }
  };

  const discardPreview = (yi: number) => setPreviews((p) => { const next = { ...p }; delete next[yi]; return next; });

  const savePreview = async (yi: number) => {
    const preview = previews[yi];
    if (!preview) return;
    setBusyYear(yi);
    try {
      const next = years.map((y, i) => (i === yi ? { ...y, columns: preview.columns, rows: preview.rows.map((cells) => ({ cells })) } : y));
      await persistYears(next);
      discardPreview(yi);
    } catch (e) {
      alert(`Couldn't save: ${(e as Error).message}`);
    } finally {
      setBusyYear(null);
    }
  };

  const clearRecords = async (yi: number) => {
    if (!confirm(`Delete the saved placement records for "${years[yi].year}"? The Academic Year itself stays, just empty. This cannot be undone.`)) return;
    setBusyYear(yi);
    try {
      await persistYears(years.map((y, i) => (i === yi ? { ...y, columns: [], rows: [] } : y)));
    } catch (e) {
      alert(`Couldn't delete: ${(e as Error).message}`);
    } finally {
      setBusyYear(null);
    }
  };

  return (
    <div className="admin-card">
      <h2 className="admin-card__title">Placements — {program.shortName || program.name}</h2>
      <p className="admin-field__hint" style={{ marginBottom: '1rem' }}>
        Add an Academic Year, then upload a file of student placement records for that year — Excel (.xlsx/.xls),
        CSV, Word (.docx, records must be in an actual table), or PDF (records must be selectable text, not a
        scanned image) are all accepted. The first row is treated as column headers — whatever columns the file
        actually has are used as-is, nothing is assumed or hardcoded. On the public page, the 10 highest values in
        whichever column looks like "Package"/"Highest Package"/"CTC" show first for that year, then everyone else
        in the order they were imported. Re-importing a year replaces its previous dataset. Scoped to this exact
        programme only — other programmes in the same department manage their own Academic Years independently.
      </p>

      <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginBottom: '1.25rem' }}>
        <input
          value={newYearLabel}
          onChange={(e) => setNewYearLabel(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter') addYear(); }}
          placeholder="e.g. 2025-26"
          style={{ maxWidth: 220 }}
        />
        <button type="button" className="admin-btn admin-btn--primary" onClick={addYear}>+ Add Academic Year</button>
      </div>

      {years.length === 0 && (
        <p className="admin-field__hint">No Academic Years yet — add one above to start importing placement records.</p>
      )}

      {years.map((y, yi) => {
        const preview = previews[yi];
        const displayed = preview
          ? preview
          : y.columns.length > 0
            ? { columns: y.columns, rows: y.rows.map((r) => r.cells) }
            : null;
        const importing = importingYear === yi;
        const busy = busyYear === yi;

        return (
          <div key={yi} style={{ border: '1.5px solid var(--color-light-gray)', borderRadius: 8, padding: '1rem', marginBottom: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
              <strong style={{ flex: 1, fontSize: '1rem' }}>{y.year}</strong>
              <button type="button" className="admin-btn admin-btn--sm" onClick={() => moveYear(yi, -1)} disabled={yi === 0} title="Move up">↑</button>
              <button type="button" className="admin-btn admin-btn--sm" onClick={() => moveYear(yi, 1)} disabled={yi === years.length - 1} title="Move down">↓</button>
              <button type="button" className="admin-btn admin-btn--sm admin-btn--danger" onClick={() => removeYear(yi)} disabled={busy}>Remove Year</button>
            </div>

            <label className="admin-btn admin-btn--primary" style={{ display: 'inline-block', cursor: importing ? 'default' : 'pointer', opacity: importing ? 0.6 : 1 }}>
              {importing ? 'Reading file…' : 'Import from Excel / CSV / Word / PDF'}
              <input
                type="file"
                accept=".xlsx,.xls,.csv,.docx,.pdf"
                hidden
                disabled={importing}
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleFile(yi, file);
                  e.target.value = '';
                }}
              />
            </label>

            {displayed && displayed.columns.length > 0 ? (
              <>
                <div style={{ margin: '1rem 0' }}>
                  <strong>Detected columns:</strong>{' '}
                  {displayed.columns.map((c, ci) => (
                    <span key={ci} className="admin-badge" style={{ marginRight: '0.4rem', textTransform: 'none' }}>{c}</span>
                  ))}
                </div>
                <p className="admin-field__hint">
                  {displayed.rows.length} record{displayed.rows.length === 1 ? '' : 's'}{preview ? ' — not yet saved' : ' saved'}.
                </p>
                {preview?.warning && (
                  <p
                    className="admin-field__hint"
                    style={{ background: '#fff8e6', border: '1px solid #f5d78e', borderRadius: 6, padding: '0.6rem 0.9rem', marginBottom: '0.75rem' }}
                  >
                    ℹ️ {preview.warning}
                  </p>
                )}
                <div className="admin-table-wrap" style={{ maxHeight: 320, overflow: 'auto' }}>
                  <table className="admin-table">
                    <thead>
                      <tr>{displayed.columns.map((c, ci) => <th key={ci}>{c}</th>)}</tr>
                    </thead>
                    <tbody>
                      {displayed.rows.slice(0, 25).map((row, ri) => (
                        <tr key={ri}>{row.map((cell, ci) => <td key={ci}>{cell}</td>)}</tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {displayed.rows.length > 25 && (
                  <p className="admin-field__hint">Showing the first 25 of {displayed.rows.length} rows.</p>
                )}
                {preview ? (
                  <div className="admin-form-actions">
                    <button className="admin-btn admin-btn--ghost" onClick={() => discardPreview(yi)}>Discard</button>
                    <button className="admin-btn admin-btn--primary" onClick={() => savePreview(yi)} disabled={busy}>
                      {busy ? 'Saving…' : 'Save Placement Records'}
                    </button>
                  </div>
                ) : (
                  <div className="admin-form-actions">
                    <button className="admin-btn admin-btn--danger" onClick={() => clearRecords(yi)} disabled={busy}>
                      {busy ? 'Deleting…' : 'Delete Records'}
                    </button>
                  </div>
                )}
              </>
            ) : (
              <p className="admin-field__hint" style={{ marginTop: '0.75rem' }}>No placement records imported yet for {y.year}.</p>
            )}
          </div>
        );
      })}
    </div>
  );
}
