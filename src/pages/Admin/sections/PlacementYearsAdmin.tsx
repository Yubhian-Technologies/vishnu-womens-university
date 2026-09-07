import { useRef, useState } from 'react';
import * as XLSX from 'xlsx';
import { deleteDoc, doc, serverTimestamp, setDoc, updateDoc } from 'firebase/firestore';
import { db } from '../../../lib/firebase';
import { useCollection, type WithId } from '../../../hooks/useCollection';
import {
  placementYearData,
  type BranchOfferCount,
  type PlacementRow,
  type PlacementYear,
} from '../../Placements/placementStats.data';
import TableImportButton from '../../../components/TableImportButton/TableImportButton';

type PlacementYearDoc = WithId & PlacementYear;

interface FormState {
  batch: string;
  total: string;
  salaryLabel: string;
  companiesVisited: string;
  note: string;
  rowsText: string;
  branchOffersText: string;
  averageSalaryLPA: string;
  medianSalaryLPA: string;
  highestPackageLPA: string;
  offersAbove50LPA: string;
  offersAbove30LPA: string;
  offersAbove10LPA: string;
}

const EMPTY: FormState = {
  batch: '', total: '', salaryLabel: 'CTC (LPA)', companiesVisited: '', note: '', rowsText: '', branchOffersText: '',
  averageSalaryLPA: '', medianSalaryLPA: '', highestPackageLPA: '', offersAbove50LPA: '', offersAbove30LPA: '', offersAbove10LPA: '',
};

function rowsToText(rows: PlacementRow[]): string {
  return rows.map((r) => r.sector ? `${r.company} | ${r.selects} | ${r.salary} | ${r.sector}` : `${r.company} | ${r.selects} | ${r.salary}`).join('\n');
}
// A blank/malformed Selects field defaults to 1, not 0 — matching
// parseCompanyRowsWorkbook's Excel-import convention below. A row stuck at
// 0 selects would still count toward Median (which doesn't weight by
// Selects) while contributing nothing to Average (which does), making
// Average silently wrong or missing for a hand-typed/edited row whenever
// its Selects number is left blank or mistyped.
function textToRows(text: string): PlacementRow[] {
  return text.split('\n').map((l) => l.trim()).filter(Boolean).map((line) => {
    const [company = '', selects = '', salary = '', sector] = line.split('|').map((p) => p.trim());
    return { company, selects: Number(selects) || 1, salary, ...(sector ? { sector } : {}) };
  });
}
// Catches the #1 way this textarea silently corrupts data: a line typed
// with spaces instead of "|" separators. Without this check, textToRows
// happily accepts a line with no pipes at all — the whole line becomes the
// company name, selects defaults to 0, and CTC/sector are silently dropped
// (each field just shifts left by one for every missing pipe). Requiring at
// least 2 pipes (3 fields: company | selects | CTC) turns that into an
// up-front alert naming the bad line instead of a garbled row nobody
// notices until the public page renders it wrong.
function findMalformedRowLine(text: string): { lineNumber: number; content: string } | null {
  const lines = text.split('\n');
  for (let i = 0; i < lines.length; i++) {
    const trimmed = lines[i].trim();
    if (!trimmed) continue;
    if (trimmed.split('|').length < 3) return { lineNumber: i + 1, content: trimmed };
  }
  return null;
}

// Only treats a salary cell as a real number when it's purely digits/commas/
// a decimal point (e.g. "59.15", "1,20,000") — a cell like "48,000 AED" or a
// blank ('' for older batches with no published package figures, see
// placementStats.data.ts) is left out of the salary-based stats below rather
// than silently parsed into a wrong LPA figure.
function parseSalaryLPA(raw: string): number | null {
  const trimmed = raw.trim();
  if (!trimmed || !/^[\d,]+(\.\d+)?$/.test(trimmed)) return null;
  const n = Number(trimmed.replace(/,/g, ''));
  return Number.isFinite(n) ? n : null;
}

interface ComputedPlacementStats {
  total: number;
  companiesVisited: number;
  averageSalaryLPA: number | null;
  medianSalaryLPA: number | null;
  highestPackageLPA: number | null;
  offersAbove50LPA: number;
  offersAbove30LPA: number;
  offersAbove10LPA: number;
}

// Derives every "optional" summary stat straight from the Company Rows
// table instead of leaving them for the admin to work out and type in by
// hand. Each row's "selects" count is the number of students placed at that
// row's CTC, so average/median/offers-above-X all weight by selects (one
// row of "Capgemini | 116 | 4.25" counts as 116 students at 4.25 LPA, not
// one data point) — a plain per-row average would be skewed by companies
// that only hired a handful of students vs. those that hired hundreds.
// `dedupedSalariesLPA`, when given, is one entry per distinct student —
// their single highest-package offer — collected at Excel-import time
// before per-student identity is lost to Company+CTC grouping (see
// parseCompanyRowsWorkbook). A student who shows up on 3 rows (e.g.
// Amazon-34, Adobe-32, Capgemini-13) must count only their 34 toward
// average/median/highest/offers-above-X, not all three — otherwise a
// student who simply collected more offers skews those figures. `total`
// and `companiesVisited` are unaffected: every offer still counts toward
// Total Placements and each company's Selects, since those genuinely
// happened — only the salary-based figures are computed off the deduped
// list when it's available.
// Median is computed on a different basis than Average/Highest/Offers-above-X
// — deliberately, per an explicit admin call: a company that hired 279
// students at 3.6 LPA is one entry in the sorted list for Median purposes,
// not 279 identical ones dominating where the middle falls. So `medianBasis`
// is always one CTC per Company Row (or one per distinct student, when
// `dedupedSalariesLPA` is available from a fresh per-student Excel import —
// see parseCompanyRowsWorkbook) — never repeated by Selects.
// Split out so it can be recomputed on its own (see startEdit below) without
// touching Average/Highest/Offers-above-X — those still need per-student
// data to dedupe correctly, which only exists right after a fresh Excel
// import and can't be reconstructed once a year is saved and reopened, so
// they must keep showing whatever was saved rather than being silently
// recalculated wrong on every edit. Median never has that problem: it's
// always derivable from the Company Rows alone (Company/Selects/CTC), so
// it's safe — and important — to always show a live, current value.
function computeMedianSalaryLPA(rows: PlacementRow[], dedupedSalariesLPA?: number[]): number | null {
  const medianBasis = dedupedSalariesLPA && dedupedSalariesLPA.length > 0
    ? dedupedSalariesLPA
    : rows.map((r) => parseSalaryLPA(r.salary)).filter((v): v is number => v != null);
  if (medianBasis.length === 0) return null;
  const round2 = (n: number) => Math.round(n * 100) / 100;
  const sorted = [...medianBasis].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 !== 0 ? sorted[mid] : round2((sorted[mid - 1] + sorted[mid]) / 2);
}

function computePlacementYearStats(rows: PlacementRow[], dedupedSalariesLPA?: number[]): ComputedPlacementStats {
  const total = rows.reduce((sum, r) => sum + (r.selects || 0), 0);
  const companiesVisited = new Set(rows.map((r) => r.company.trim().toLowerCase()).filter(Boolean)).size;

  let salaryEntries: number[];
  if (dedupedSalariesLPA && dedupedSalariesLPA.length > 0) {
    salaryEntries = dedupedSalariesLPA;
  } else {
    salaryEntries = [];
    for (const r of rows) {
      const lpa = parseSalaryLPA(r.salary);
      if (lpa == null) continue;
      for (let i = 0; i < r.selects; i++) salaryEntries.push(lpa);
    }
  }

  const round2 = (n: number) => Math.round(n * 100) / 100;

  if (salaryEntries.length === 0) {
    return { total, companiesVisited, averageSalaryLPA: null, medianSalaryLPA: computeMedianSalaryLPA(rows, dedupedSalariesLPA), highestPackageLPA: null, offersAbove50LPA: 0, offersAbove30LPA: 0, offersAbove10LPA: 0 };
  }
  const sorted = [...salaryEntries].sort((a, b) => a - b);
  const averageSalaryLPA = round2(salaryEntries.reduce((a, b) => a + b, 0) / salaryEntries.length);

  return {
    total,
    companiesVisited,
    averageSalaryLPA,
    medianSalaryLPA: computeMedianSalaryLPA(rows, dedupedSalariesLPA),
    highestPackageLPA: sorted[sorted.length - 1],
    offersAbove50LPA: salaryEntries.filter((v) => v > 50).length,
    offersAbove30LPA: salaryEntries.filter((v) => v > 30).length,
    offersAbove10LPA: salaryEntries.filter((v) => v > 10).length,
  };
}

function normalizeHeader(h: string): string {
  return h.toLowerCase().replace(/[^a-z]/g, '');
}

interface CompanyRowsImportResult {
  rows: PlacementRow[];
  /** Only set when the source sheet also has a Department/Branch column —
   *  see parseCompanyRowsWorkbook below. */
  branchOffers?: BranchOfferCount[];
  /** Only set when the source sheet also has a student Name/Regd No column —
   *  one entry per distinct student, their highest package only. See
   *  computePlacementYearStats. */
  dedupedSalariesLPA?: number[];
  warning?: string;
}

// The department's source Excel is a per-student roster — one row per
// student ("S.No | Company | Package (LPA) | Industry Type", optionally
// with a Department/Branch column too), with no aggregate count column —
// but Company Rows needs one row per Company/CTC combination with a
// "Selects" count (e.g. "Capgemini | 116 | 4.25" — 116 students at that
// package), matching how every batch in placementStats.data.ts is
// structured. This reads the header row to find the Company/Package/
// Industry-Type/Department columns by name — in any order, with S.No or
// any other extra column simply ignored — then groups identical
// Company+Package rows together and counts them as Selects. If the sheet
// already has its own explicit Selects/Offers count column, that's used
// as-is instead of counting rows (so an already-aggregated file still
// imports correctly, not double-counted). When a Department/Branch column
// is present, the same pass also groups rows by department to produce
// Department-wise Offers (offers count + highest package per department,
// e.g. "CSE Offers | 32 | 59.3") — so one import fills in both tables at
// once instead of Department-wise Offers needing a separate file/step.
function parseCompanyRowsWorkbook(buf: ArrayBuffer): CompanyRowsImportResult {
  const wb = XLSX.read(buf, { type: 'array' });
  const sheet = wb.Sheets[wb.SheetNames[0]];
  const raw: unknown[][] = XLSX.utils.sheet_to_json(sheet, { header: 1, raw: false, defval: '' });
  if (raw.length === 0) return { rows: [], warning: 'That file has no rows.' };

  const headerCells = raw[0].map((h) => String(h ?? ''));
  const header = headerCells.map(normalizeHeader);
  const findCol = (...aliases: string[]) => header.findIndex((h) => aliases.some((a) => h.includes(a)));
  const companyIdx = findCol('company');
  const packageIdx = findCol('package', 'ctc', 'salary');
  const sectorIdx = findCol('industry', 'sector');
  const selectsIdx = findCol('select', 'offers');
  const departmentIdx = findCol('department', 'branch');
  // Student identity, when the sheet has it — Regd/Roll No preferred over
  // Name (two students could share a name; a reg no never collides). Used
  // only to collapse one student's multiple offer-rows down to their single
  // highest package for the salary-based stats below — the "name" check
  // excludes "Company Name"-style headers so it doesn't latch onto that
  // column instead.
  // Covers both abbreviated ("Roll No", "Reg No") and spelled-out ("Roll
  // Number", "Register Number") headers — "rollno" as a plain substring
  // check doesn't match "rollnumber", so both suffixes are checked.
  let studentKeyIdx = header.findIndex((h) =>
    ['regdno', 'regdnumber', 'regno', 'regnumber', 'registrationno', 'registrationnumber', 'registerno', 'registernumber', 'rollno', 'rollnumber', 'htno', 'htnumber', 'hallticketno', 'hallticketnumber', 'hallticket', 'admissionno', 'admissionnumber'].some((a) => h.includes(a))
  );
  const studentKeyIsUniqueId = studentKeyIdx !== -1;
  if (studentKeyIdx === -1) {
    studentKeyIdx = header.findIndex((h, i) =>
      h.includes('name') && !['company', 'recruiter', 'employer', 'organis', 'organiz'].some((bad) => header[i].includes(bad))
    );
  }

  if (companyIdx === -1 || packageIdx === -1) {
    return {
      rows: [],
      warning: `Couldn't find both a "Company" and a "Package (LPA)" column in this file's header row (found: ${headerCells.join(', ') || '(empty)'}) — Company Rows needs at least those two, named clearly in row 1.`,
    };
  }

  const dataRows = raw.slice(1).map((r) => r.map((c) => String(c ?? '').trim())).filter((r) => r.some((c) => c !== ''));

  // One entry per distinct student — their highest package only — collected
  // here while each row still names the student, before the grouping below
  // discards that identity into Company+CTC buckets. A student with offers
  // from 3 companies at different packages must only count once, at their
  // best offer, toward average/median/highest/offers-above-X.
  //
  // When the sheet has no unique ID (Roll No/Reg No) and we're falling back
  // to Name, two different students with the same name would otherwise get
  // wrongly merged into one — silently dropping a real data point and
  // skewing rank-based stats like the median (this is what "median: got
  // 4.25, expected 5.5" turned out to be: one merge too many flipped an
  // odd-length list, whose median is a single real value, into an
  // even-length one, whose median is an average of two). Folding in
  // Department (when the sheet has one) as part of the key makes an
  // accidental same-name merge require both a name AND department match,
  // which two distinct students are far less likely to hit than name alone.
  let dedupedSalariesLPA: number[] | undefined;
  if (studentKeyIdx !== -1) {
    const bestByStudent = new Map<string, number>();
    for (const row of dataRows) {
      const rawKey = (row[studentKeyIdx] || '').trim().toLowerCase();
      if (!rawKey) continue;
      const key = !studentKeyIsUniqueId && departmentIdx !== -1
        ? `${rawKey}|${(row[departmentIdx] || '').trim().toLowerCase()}`
        : rawKey;
      const lpa = parseSalaryLPA((row[packageIdx] || '').trim());
      if (lpa == null) continue;
      const existing = bestByStudent.get(key);
      if (existing == null || lpa > existing) bestByStudent.set(key, lpa);
    }
    if (bestByStudent.size > 0) dedupedSalariesLPA = [...bestByStudent.values()];
  }

  const groups = new Map<string, PlacementRow>();
  const departmentGroups = new Map<string, { label: string; offers: number; highestLPA: number | null }>();
  for (const row of dataRows) {
    const company = (row[companyIdx] || '').trim();
    const salary = (row[packageIdx] || '').trim();
    if (!company) continue;
    const sector = sectorIdx !== -1 ? (row[sectorIdx] || '').trim() : '';
    const count = selectsIdx !== -1 ? (Number(row[selectsIdx]) || 1) : 1;
    const key = `${company.toLowerCase()}${salary}`;
    const existing = groups.get(key);
    if (existing) existing.selects += count;
    else groups.set(key, { company, salary, selects: count, ...(sector ? { sector } : {}) });

    if (departmentIdx !== -1) {
      const deptLabel = (row[departmentIdx] || '').trim();
      if (deptLabel) {
        const deptKey = deptLabel.toLowerCase();
        const lpa = parseSalaryLPA(salary);
        const g = departmentGroups.get(deptKey);
        if (g) {
          g.offers += count;
          if (lpa != null && (g.highestLPA == null || lpa > g.highestLPA)) g.highestLPA = lpa;
        } else {
          departmentGroups.set(deptKey, { label: deptLabel, offers: count, highestLPA: lpa });
        }
      }
    }
  }

  const branchOffers: BranchOfferCount[] | undefined = departmentIdx === -1
    ? undefined
    : Array.from(departmentGroups.values()).map((g) => ({
        branch: /offers\s*$/i.test(g.label) ? g.label : `${g.label} Offers`,
        offers: g.offers,
        ...(g.highestLPA != null ? { highestLPA: g.highestLPA } : {}),
      }));

  return { rows: Array.from(groups.values()), branchOffers, dedupedSalariesLPA };
}

/** Header-aware counterpart to the generic TableImportButton, specific to
 *  Company Rows: reads an Excel/CSV student roster and aggregates it into
 *  Company/Selects/CTC/Sector rows, plus Department-wise Offers when a
 *  Department column is present (see parseCompanyRowsWorkbook above),
 *  rather than blindly joining columns in whatever order the file has them,
 *  which is what silently produced garbled rows before this existed. */
function CompanyRowsImportButton({ onImport }: { onImport: (rows: PlacementRow[], branchOffers?: BranchOfferCount[], dedupedSalariesLPA?: number[]) => void }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [status, setStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFile = async (file: File) => {
    setError(null);
    setStatus(null);
    try {
      const buf = await file.arrayBuffer();
      const { rows, branchOffers, dedupedSalariesLPA, warning } = parseCompanyRowsWorkbook(buf);
      if (warning) {
        setError(warning);
        return;
      }
      if (rows.length === 0) {
        setError('No data rows found in that file.');
        return;
      }
      onImport(rows, branchOffers, dedupedSalariesLPA);
      const studentCount = rows.reduce((sum, r) => sum + r.selects, 0);
      const deptNote = branchOffers ? ` and Department-wise Offers for ${branchOffers.length} department${branchOffers.length === 1 ? '' : 's'}` : '';
      const dedupNote = dedupedSalariesLPA ? ` Average/Median/Highest salary were computed from each student's single best offer (${dedupedSalariesLPA.length} distinct student${dedupedSalariesLPA.length === 1 ? '' : 's'}), not every row.` : '';
      setStatus(`Imported ${studentCount} student${studentCount === 1 ? '' : 's'} across ${rows.length} Company/CTC row${rows.length === 1 ? '' : 's'}${deptNote} — replaced the table${branchOffers ? 's' : ''} above.${dedupNote}`);
    } catch {
      setError("Could not read that file — make sure it's a valid Excel (.xlsx/.xls) or CSV file.");
    }
  };

  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap' }}>
      <button type="button" className="admin-btn admin-btn--ghost admin-btn--sm" onClick={() => inputRef.current?.click()}>
        📥 Import Company Rows from Excel/CSV
      </button>
      {status && <span style={{ fontSize: '0.78rem', color: '#16a34a' }}>{status}</span>}
      {error && <span style={{ fontSize: '0.78rem', color: '#dc2626' }}>{error}</span>}
      <input
        ref={inputRef}
        type="file"
        accept=".xlsx,.xls,.csv"
        style={{ display: 'none' }}
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) handleFile(f);
          e.target.value = '';
        }}
      />
    </span>
  );
}

function offersToText(offers: BranchOfferCount[]): string {
  return offers.map((o) => o.highestLPA != null ? `${o.branch} | ${o.offers} | ${o.highestLPA}` : `${o.branch} | ${o.offers}`).join('\n');
}
function textToOffers(text: string): BranchOfferCount[] {
  return text.split('\n').map((l) => l.trim()).filter(Boolean).map((line) => {
    const [branch = '', offers = '0', highestLPA] = line.split('|').map((p) => p.trim());
    return { branch, offers: Number(offers) || 0, ...(highestLPA ? { highestLPA: Number(highestLPA) || 0 } : {}) };
  });
}

/**
 * Manages the "Placements, Year by Year" batch data (placementYears
 * collection) that PlacementYearAccordion.tsx renders on both the main
 * Placements page and the Placement Details sub-page. Replaces the old
 * "Placements" admin section, which wrote to a `placements` collection
 * nothing on the public site reads anymore (that Our Recruiters section was
 * removed). Company rows and branch-offer breakdowns are edited as plain
 * pipe-delimited text — one line per row — since a batch can have 100+
 * companies and a one-field-per-row form would be unusable at that size.
 */
export default function PlacementYearsAdmin() {
  const { docs: years, loading } = useCollection<PlacementYearDoc>('placementYears');
  const sortedYears = [...years].sort((a, b) => b.batch.localeCompare(a.batch));

  const [form, setForm] = useState<FormState>(EMPTY);
  const [editing, setEditing] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [seeding, setSeeding] = useState(false);
  const [recalculating, setRecalculating] = useState(false);
  // Set only right after a fresh Excel import that found a student-identity
  // column (see parseCompanyRowsWorkbook) — one highest-package entry per
  // distinct student. Kept in state (not just passed once to
  // applyComputedStats) so that later edits to the Company Rows textarea
  // still use it on blur, instead of silently reverting Average/Median back
  // to the old weighted-by-every-offer calculation the moment the admin
  // clicks into that field again. Cleared on save, cancel, or switching to
  // edit an existing year, since none of those retain fresh per-student data.
  const [importedDedupedSalaries, setImportedDedupedSalaries] = useState<number[] | undefined>(undefined);

  const set = (k: keyof FormState, v: string) => setForm((p) => ({ ...p, [k]: v }));

  // Fills Total Placements, Companies Visited, and every salary/offers stat
  // straight from the Company Rows text — run right after an import and
  // whenever the admin finishes editing that textarea by hand, so those
  // fields never have to be worked out and typed in separately. Left as
  // ordinary editable inputs afterward, so an admin can still override any
  // one of them before saving.
  const applyComputedStats = (rows: PlacementRow[], dedupedSalariesLPA?: number[]) => {
    if (rows.length === 0) return;
    const stats = computePlacementYearStats(rows, dedupedSalariesLPA);
    setForm((p) => ({
      ...p,
      total: String(stats.total),
      companiesVisited: String(stats.companiesVisited),
      averageSalaryLPA: stats.averageSalaryLPA != null ? String(stats.averageSalaryLPA) : '',
      medianSalaryLPA: stats.medianSalaryLPA != null ? String(stats.medianSalaryLPA) : '',
      highestPackageLPA: stats.highestPackageLPA != null ? String(stats.highestPackageLPA) : '',
      offersAbove50LPA: String(stats.offersAbove50LPA),
      offersAbove30LPA: String(stats.offersAbove30LPA),
      offersAbove10LPA: String(stats.offersAbove10LPA),
    }));
  };

  const save = async () => {
    const batch = form.batch.trim();
    if (!batch) return alert('Batch (e.g. 2025–2026) is required.');
    const badRow = findMalformedRowLine(form.rowsText);
    if (badRow) {
      return alert(
        `Line ${badRow.lineNumber} of Company Rows is missing its "|" separators, so it can't be split into Company / Selects / CTC:\n\n"${badRow.content}"\n\nFix that line (use "|" between each value, e.g. "Company | 4 | 53.35 | IT Sector") and save again. Nothing was saved.`
      );
    }
    setSaving(true);
    try {
      await setDoc(doc(db, 'placementYears', batch), {
        batch,
        total: form.total ? Number(form.total) : null,
        salaryLabel: form.salaryLabel.trim(),
        companiesVisited: form.companiesVisited ? Number(form.companiesVisited) : null,
        branchOffers: textToOffers(form.branchOffersText),
        rows: textToRows(form.rowsText),
        note: form.note.trim() || null,
        averageSalaryLPA: form.averageSalaryLPA ? Number(form.averageSalaryLPA) : null,
        medianSalaryLPA: form.medianSalaryLPA ? Number(form.medianSalaryLPA) : null,
        highestPackageLPA: form.highestPackageLPA ? Number(form.highestPackageLPA) : null,
        offersAbove50LPA: form.offersAbove50LPA ? Number(form.offersAbove50LPA) : null,
        offersAbove30LPA: form.offersAbove30LPA ? Number(form.offersAbove30LPA) : null,
        offersAbove10LPA: form.offersAbove10LPA ? Number(form.offersAbove10LPA) : null,
        updatedAt: serverTimestamp(),
      });
      setForm(EMPTY);
      setEditing(null);
      setImportedDedupedSalaries(undefined);
    } catch (e) {
      alert(`Couldn't save: ${(e as Error).message}`);
    } finally {
      setSaving(false);
    }
  };

  const startEdit = (y: PlacementYearDoc) => {
    setEditing(y.batch);
    setImportedDedupedSalaries(undefined);
    setForm({
      batch: y.batch,
      total: y.total != null ? String(y.total) : '',
      salaryLabel: y.salaryLabel || '',
      companiesVisited: y.companiesVisited != null ? String(y.companiesVisited) : '',
      note: y.note || '',
      rowsText: rowsToText(y.rows || []),
      branchOffersText: offersToText(y.branchOffers || []),
      averageSalaryLPA: y.averageSalaryLPA != null ? String(y.averageSalaryLPA) : '',
      medianSalaryLPA: y.medianSalaryLPA != null ? String(y.medianSalaryLPA) : '',
      highestPackageLPA: y.highestPackageLPA != null ? String(y.highestPackageLPA) : '',
      offersAbove50LPA: y.offersAbove50LPA != null ? String(y.offersAbove50LPA) : '',
      offersAbove30LPA: y.offersAbove30LPA != null ? String(y.offersAbove30LPA) : '',
      offersAbove10LPA: y.offersAbove10LPA != null ? String(y.offersAbove10LPA) : '',
    });
    // Median specifically is always refreshed live from the year's current
    // Company Rows on open — it never needs per-student import data (see
    // computeMedianSalaryLPA), so there's no reason to ever show a stale
    // saved value for it. Average/Highest/Offers-above-X are deliberately
    // left as whatever was saved: those can only be correctly deduped by
    // student right after a fresh Excel import, and that per-student data
    // no longer exists once a year is saved and reopened — recalculating
    // them here would silently replace a correct saved figure with a wrong
    // one computed from the aggregated rows alone.
    const liveMedian = computeMedianSalaryLPA(y.rows || []);
    setForm((p) => ({ ...p, medianSalaryLPA: liveMedian != null ? String(liveMedian) : '' }));
  };

  const remove = async (batchId: string) => {
    if (!confirm(`Delete the ${batchId} batch? This removes all its company and offer data.`)) return;
    try {
      await deleteDoc(doc(db, 'placementYears', batchId));
    } catch (e) {
      alert(`Couldn't delete: ${(e as Error).message}`);
    }
  };

  const seedFromSiteData = async () => {
    if (!confirm(`Load the original ${placementYearData.length} batch years (2003–2007 through 2022–2026) from the site's built-in data? This overwrites any existing entries that share the same batch label.`)) return;
    setSeeding(true);
    try {
      for (const y of placementYearData) {
        await setDoc(doc(db, 'placementYears', y.batch), {
          batch: y.batch,
          total: y.total,
          salaryLabel: y.salaryLabel,
          companiesVisited: y.companiesVisited ?? null,
          branchOffers: y.branchOffers ?? [],
          rows: y.rows,
          note: y.note ?? null,
          averageSalaryLPA: y.averageSalaryLPA ?? null,
          medianSalaryLPA: y.medianSalaryLPA ?? null,
          highestPackageLPA: y.highestPackageLPA ?? null,
          offersAbove50LPA: y.offersAbove50LPA ?? null,
          offersAbove30LPA: y.offersAbove30LPA ?? null,
          offersAbove10LPA: y.offersAbove10LPA ?? null,
          updatedAt: serverTimestamp(),
        });
      }
    } catch (e) {
      alert(`Couldn't load site data: ${(e as Error).message}`);
    } finally {
      setSeeding(false);
    }
  };

  // Re-runs the SAFE stats against every already-saved year's own Company
  // Rows, all at once — Total Placements, Companies Visited, Median Salary,
  // and Highest Package are always exactly derivable from Company/Selects/
  // CTC alone (median never weights by Selects — see computeMedianSalaryLPA
  // — and the max of a set is the same whether or not it's weighted), so
  // it's always safe to recompute these for every year in bulk, covering
  // years saved before this median fix existed without having to reopen
  // each one individually.
  //
  // Average Salary and the Offers-above-X counts are deliberately left
  // alone here — they should weight by Selects, per-student-deduped when
  // possible, and that per-student identity (who got which of their
  // multiple offers) only exists right after a fresh Excel import; it's
  // gone from the aggregated Company Rows once a year is saved. Bulk-
  // recomputing them here would silently replace a correctly-deduped saved
  // Average with a wrong non-deduped one for any year that WAS imported
  // correctly — exactly the regression this same mistake caused in
  // startEdit before it was fixed. The only way to get a truly correct,
  // per-student-deduped Average for an already-saved year is to re-import
  // that year's original per-student Excel file.
  const recalculateAllStats = async () => {
    const withRows = sortedYears.filter((y) => (y.rows?.length ?? 0) > 0);
    if (withRows.length === 0) return alert('No years have Company Rows to calculate stats from.');
    if (!confirm(`Recalculate Total Placements, Companies Visited, Median Salary, and Highest Package for all ${withRows.length} year(s) that have Company Rows, from their Salary column? This overwrites whatever those fields currently hold for each. Average Salary and the Offers-above-X counts are left untouched — those need each year's original per-student Excel re-imported to recompute correctly.`)) return;
    setRecalculating(true);
    try {
      for (const y of withRows) {
        const stats = computePlacementYearStats(y.rows);
        await updateDoc(doc(db, 'placementYears', y.batch), {
          total: stats.total,
          companiesVisited: stats.companiesVisited,
          medianSalaryLPA: stats.medianSalaryLPA,
          highestPackageLPA: stats.highestPackageLPA,
          updatedAt: serverTimestamp(),
        });
      }
      alert(`Recalculated Total Placements, Companies Visited, Median Salary, and Highest Package for ${withRows.length} year(s). Average Salary and Offers-above-X were left as-is — re-import a year's original per-student Excel to correct those.`);
    } catch (e) {
      alert(`Couldn't recalculate all years: ${(e as Error).message}`);
    } finally {
      setRecalculating(false);
    }
  };

  return (
    <div className="admin-section">
      <div className="admin-card">
        <h2 className="admin-card__title">{editing ? `Edit ${editing}` : 'Add Placement Year'}</h2>
        <p className="admin-lead" style={{ marginBottom: '1rem' }}>
          Powers the "Placements, Year by Year" accordion on the Placements page and the Placement
          Details sub-page. List each company one per line as <code>Company | Selects | CTC</code> (add a 4th <code>| Sector</code> if you want a Sector column).
        </p>
        <div className="admin-form-grid">
          <div className="admin-field">
            <label htmlFor="field-batch">Batch *</label>
            <input id="field-batch" value={form.batch} onChange={(e) => set('batch', e.target.value)} placeholder="2025–2026" disabled={!!editing} />
          </div>
          <div className="admin-field">
            <label htmlFor="field-total-placements">Total Placements (auto-filled from Company Rows, editable)</label>
            <input id="field-total-placements" type="number" value={form.total} onChange={(e) => set('total', e.target.value)} min={0} />
          </div>
          <div className="admin-field">
            <label htmlFor="field-salary-column-label">CTC Column Label</label>
            <input id="field-salary-column-label" value={form.salaryLabel} onChange={(e) => set('salaryLabel', e.target.value)} placeholder="CTC (LPA)" />
          </div>
          <div className="admin-field">
            <label htmlFor="field-companies-visited-optional">Companies Visited (auto-filled from Company Rows, editable)</label>
            <input id="field-companies-visited-optional" type="number" value={form.companiesVisited} onChange={(e) => set('companiesVisited', e.target.value)} min={0} />
          </div>
          <div className="admin-field">
            <label htmlFor="field-average-salary-lpa">Average Salary — LPA (auto-filled from Company Rows, editable)</label>
            <input id="field-average-salary-lpa" type="number" step="0.01" value={form.averageSalaryLPA} onChange={(e) => set('averageSalaryLPA', e.target.value)} min={0} placeholder="8.3" />
          </div>
          <div className="admin-field">
            <label htmlFor="field-median-salary-lpa">Median Salary — LPA (auto-filled from Company Rows, editable)</label>
            <input id="field-median-salary-lpa" type="number" step="0.01" value={form.medianSalaryLPA} onChange={(e) => set('medianSalaryLPA', e.target.value)} min={0} placeholder="5.5" />
          </div>
          <div className="admin-field">
            <label htmlFor="field-highest-package-lpa">Highest Package — LPA (auto-filled from Company Rows, editable)</label>
            <input id="field-highest-package-lpa" type="number" step="0.01" value={form.highestPackageLPA} onChange={(e) => set('highestPackageLPA', e.target.value)} min={0} placeholder="59.28" />
          </div>
          <div className="admin-field">
            <label htmlFor="field-offers-above-50-lpa">Offers Above 50 LPA (auto-filled from Company Rows, editable)</label>
            <input id="field-offers-above-50-lpa" type="number" value={form.offersAbove50LPA} onChange={(e) => set('offersAbove50LPA', e.target.value)} min={0} placeholder="9" />
          </div>
          <div className="admin-field">
            <label htmlFor="field-offers-above-30-lpa">Offers Above 30 LPA (auto-filled from Company Rows, editable)</label>
            <input id="field-offers-above-30-lpa" type="number" value={form.offersAbove30LPA} onChange={(e) => set('offersAbove30LPA', e.target.value)} min={0} placeholder="43" />
          </div>
          <div className="admin-field">
            <label htmlFor="field-offers-above-10-lpa">Offers Above 10 LPA (auto-filled from Company Rows, editable)</label>
            <input id="field-offers-above-10-lpa" type="number" value={form.offersAbove10LPA} onChange={(e) => set('offersAbove10LPA', e.target.value)} min={0} placeholder="93" />
          </div>
          <div className="admin-field admin-field--full">
            <label htmlFor="field-note-optional">Note (optional)</label>
            <input id="field-note-optional" value={form.note} onChange={(e) => set('note', e.target.value)} placeholder="Shown in italics above the table, if set" />
          </div>
          <div className="admin-field admin-field--full">
            <label htmlFor="field-branch-wise-offers-optional-one">Department-wise Offers (optional — one per line, "Department | Offers | Highest LPA". Highest LPA is optional per line — when set, that department's tile/donut also shows its highest package.)</label>
            <textarea id="field-branch-wise-offers-optional-one" rows={4} value={form.branchOffersText} onChange={(e) => set('branchOffersText', e.target.value)} placeholder={'CSE Offers | 268 | 46.38\nECE Offers | 97 | 32.02'} />
            <div style={{ marginTop: '0.4rem' }}>
              <TableImportButton onImport={(text) => set('branchOffersText', text)} label="Import Branch Offers from Excel/CSV" />
            </div>
          </div>
          <div className="admin-field admin-field--full">
            <label htmlFor="field-company-rows-one-per-line">Company Rows — one per line, "Company | Selects | CTC | Sector". Sector is optional per line — when at least one row has it, the table shows a Sector column. Total Placements, Companies Visited, and every salary/offers stat above are auto-calculated from this table on import (and whenever you finish editing it here) — override any of them afterward if needed. Importing from Excel/CSV reads a per-student sheet ("Company", "Package (LPA)", "Industry Type" columns, in any order — a "S.No" or similar extra column is ignored) and automatically groups matching Company+Package rows into one line with a Selects count. If the sheet also has a "Department"/"Branch" column, the same import auto-fills Department-wise Offers below too (offers count + highest package per department).</label>
            <textarea
              id="field-company-rows-one-per-line"
              rows={14}
              value={form.rowsText}
              onChange={(e) => set('rowsText', e.target.value)}
              onBlur={(e) => applyComputedStats(textToRows(e.target.value), importedDedupedSalaries)}
              placeholder={'Google | 3 | 59.15 | IT Sector\nAdobe | 4 | 53.35 | IT Sector'}
            />
            <div style={{ marginTop: '0.4rem' }}>
              <CompanyRowsImportButton
                onImport={(rows, branchOffers, dedupedSalariesLPA) => {
                  set('rowsText', rowsToText(rows));
                  if (branchOffers && branchOffers.length > 0) set('branchOffersText', offersToText(branchOffers));
                  setImportedDedupedSalaries(dedupedSalariesLPA);
                  applyComputedStats(rows, dedupedSalariesLPA);
                }}
              />
            </div>
          </div>
        </div>
        <div className="admin-form-actions">
          {editing && <button className="admin-btn admin-btn--ghost" onClick={() => { setEditing(null); setForm(EMPTY); setImportedDedupedSalaries(undefined); }}>Cancel</button>}
          <button className="admin-btn admin-btn--primary" onClick={save} disabled={saving}>
            {saving ? 'Saving…' : editing ? 'Update' : 'Add Year'}
          </button>
        </div>
      </div>

      <div className="admin-card">
        <h2 className="admin-card__title">All Batch Years ({sortedYears.length})</h2>
        {loading ? <p className="admin-loading">Loading…</p> : (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead><tr><th>Batch</th><th>Total</th><th>Companies Visited</th><th>Rows</th><th>Actions</th></tr></thead>
              <tbody>
                {sortedYears.map((y) => (
                  <tr key={y.id}>
                    <td>{y.batch}</td>
                    <td>{y.total != null ? y.total.toLocaleString('en-IN') : '—'}</td>
                    <td>{y.companiesVisited ?? '—'}</td>
                    <td>{y.rows?.length ?? 0}</td>
                    <td>
                      <button className="admin-btn admin-btn--sm" onClick={() => startEdit(y)}>Edit</button>
                      <button className="admin-btn admin-btn--sm admin-btn--danger" onClick={() => remove(y.batch)}>Delete</button>
                    </td>
                  </tr>
                ))}
                {sortedYears.length === 0 && (
                  <tr>
                    <td colSpan={5} className="admin-empty">
                      No batch years yet.{' '}
                      <button className="admin-btn admin-btn--sm" onClick={seedFromSiteData} disabled={seeding}>
                        {seeding ? 'Loading…' : 'Load original site data'}
                      </button>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
        {sortedYears.length > 0 && (
          <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap', marginTop: '1rem' }}>
            <button className="admin-btn admin-btn--sm admin-btn--ghost" onClick={seedFromSiteData} disabled={seeding}>
              {seeding ? 'Loading…' : 'Re-load original site data'}
            </button>
            <button className="admin-btn admin-btn--sm" onClick={recalculateAllStats} disabled={recalculating}>
              {recalculating ? 'Recalculating…' : '🔄 Recalculate Median Salary for All Years'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
