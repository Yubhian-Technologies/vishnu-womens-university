// Shared types + sort logic for programme Internship Records — the exact
// same shape/pattern as placementRecords.ts (see InternshipYearsEditor in
// ProgramsAdmin.tsx and the "Internships" section on DepartmentDetail.tsx /
// ProgramDetail.tsx), just for internships instead of placements: a
// "Stipend" column instead of "Package/CTC", and no LPA-tier stat tiles
// (there's no equivalent milestone convention for a stipend the way there
// is for a package). Kept as its own file rather than sharing code with
// placementRecords.ts so the two stay fully independent — same reasoning
// NewsEventsYearsEditor's own small text-array helpers aren't shared with
// other editors either.
//
// Stored as `ProgramDoc.internshipYears` — an ordered list of academic
// years, each with its own independently-imported dataset — so records are
// scoped to exactly one Academic Year + Department + Programme, same as
// placementYears.

// `cells` wraps each row in an object (not a bare string[]) because Firestore
// rejects arrays nested directly inside arrays — same reason PlacementRecordRow/
// NewsEventsYear's rows do this (see ProgramsAdmin.tsx).
export interface InternshipRecordRow {
  cells: string[];
}

export interface InternshipYearRecord {
  // Admin-typed label, e.g. "2024-25" — free text, not a fixed enum, so an
  // admin can create/rename/reorder Academic Years however they like.
  year: string;
  columns: string[];
  rows: InternshipRecordRow[];
}

// Plain Levenshtein edit distance — backs fuzzyColumnIndex below.
function levenshtein(a: string, b: string): number {
  const dp: number[][] = Array.from({ length: a.length + 1 }, () => new Array(b.length + 1).fill(0));
  for (let i = 0; i <= a.length; i++) dp[i][0] = i;
  for (let j = 0; j <= b.length; j++) dp[0][j] = j;
  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      dp[i][j] = a[i - 1] === b[j - 1]
        ? dp[i - 1][j - 1]
        : 1 + Math.min(dp[i - 1][j - 1], dp[i - 1][j], dp[i][j - 1]);
    }
  }
  return dp[a.length][b.length];
}

// Last-resort fallback for the exact substring checks above: catches a
// near-miss spelling of `keyword` (e.g. a real production header typo'd as
// "Stipned" instead of "Stipend") within any one word of a column header.
// Only real admin-typed typos of an otherwise-recognizable word should
// match here — short words and anything more than 2 edits away don't.
function fuzzyColumnIndex(columns: string[], keyword: string): number {
  const normalized = columns.map((c) => c.toLowerCase());
  return normalized.findIndex((header) =>
    header.split(/[^a-z0-9]+/).some((word) => word.length >= 4 && levenshtein(word, keyword) <= 2)
  );
}

// Finds whichever column looks like it holds the internship stipend —
// prefers "stipend", then "package" (a department may still label it that
// way), then "salary"/"amount", then a near-miss spelling (typo tolerance,
// see fuzzyColumnIndex). Returns -1 if nothing matches (the public page
// then just shows rows in their original imported order).
export function findStipendColumnIndex(columns: string[]): number {
  const normalized = columns.map((c) => c.toLowerCase());
  let idx = normalized.findIndex((c) => c.includes('stipend'));
  if (idx === -1) idx = normalized.findIndex((c) => c.includes('package'));
  if (idx === -1) idx = normalized.findIndex((c) => c.includes('salary'));
  if (idx === -1) idx = normalized.findIndex((c) => c.includes('amount'));
  if (idx === -1) idx = fuzzyColumnIndex(columns, 'stipend');
  return idx;
}

// Pulls the first number out of a stipend cell — handles values like
// "₹15,000", "15000/month", "10,000 - 20,000" by stripping thousands
// commas and grabbing the leading digits/decimal. Unlike a placement
// package, a stipend is never plausibly quoted as an annual-lakhs figure,
// so — unlike parsePackageValue — nothing here needs to guess between two
// different scales; the number is just used as-is.
function parseStipendValue(raw: string): number {
  const cleaned = (raw || '').replace(/,/g, '');
  const match = cleaned.match(/\d[\d.]*/);
  if (!match) return NaN;
  return parseFloat(match[0]);
}

// Formats a stipend cell for display in the internship records table —
// reuses parseStipendValue so "15,000/month" displays as the plain figure
// "15000". Falls back to the original cell text when it doesn't parse as a
// number (e.g. "Unpaid", a blank cell).
export function formatStipendCell(raw: string): string {
  const value = parseStipendValue(raw);
  return Number.isNaN(value) ? raw : `${Number(value.toFixed(2))}`;
}

// Finds whichever imported column is just a serial number ("S.No", "Sl.No",
// "SNo", "Serial No") so it can be hidden from the rendered table — the
// public page already numbers rows itself (1, 2, 3…) using their current
// (post-sort) display position, so keeping an imported S.No column too both
// duplicates that first column and shows stale numbers once rows get
// reordered by sortInternshipRows. Returns -1 if no column looks like one.
export function findInternshipSerialColumnIndex(columns: string[]): number {
  const normalized = columns.map((c) => c.toLowerCase().replace(/[^a-z]/g, ''));
  return normalized.findIndex((c) => c === 'sno' || c === 'slno' || c === 'serialno' || c === 'serialnumber');
}

// Finds whichever column looks like it holds the hosting company/
// organisation's name — same preference order as placementRecords.ts'
// (internal) findCompanyColumnIndex. Returns -1 if nothing matches.
function findCompanyColumnIndex(columns: string[]): number {
  const normalized = columns.map((c) => c.toLowerCase());
  let idx = normalized.findIndex((c) => c.includes('company'));
  if (idx === -1) idx = normalized.findIndex((c) => c.includes('organis') || c.includes('organiz'));
  if (idx === -1) idx = normalized.findIndex((c) => c.includes('employer'));
  if (idx === -1) idx = fuzzyColumnIndex(columns, 'company');
  return idx;
}

function median(values: number[]): number {
  if (values.length === 0) return NaN;
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 === 0 ? (sorted[mid - 1] + sorted[mid]) / 2 : sorted[mid];
}

// Strips a trailing ".00"/".30" -> "8.3" style zero, but keeps genuine
// precision — matches how these figures read naturally rather than always
// showing a fixed decimal count.
function formatStipendAmount(n: number): string {
  return `₹${Number(n.toFixed(2)).toLocaleString('en-IN')}`;
}

export interface InternshipYearStats {
  companiesVisited: number;
  totalInternships: number;
  averageStipend: string | null;
  medianStipend: string | null;
  highestStipend: string | null;
}

// Every figure here is computed live from the year's raw imported rows —
// nothing is admin-entered or hardcoded. `averageStipend`/`medianStipend`/
// `highestStipend` come back null when the dataset has no column that looks
// like a stipend column, so the tile can show "—" instead of a bogus 0.
export function computeInternshipStats(columns: string[], rows: InternshipRecordRow[]): InternshipYearStats {
  const companyIdx = findCompanyColumnIndex(columns);
  const companiesVisited = companyIdx === -1
    ? 0
    : new Set(
        rows
          .map((r) => (r.cells[companyIdx] || '').trim().toLowerCase())
          .filter(Boolean)
      ).size;

  const stipendIdx = findStipendColumnIndex(columns);
  const stipends = stipendIdx === -1
    ? []
    : rows.map((r) => parseStipendValue(r.cells[stipendIdx] || '')).filter((v) => !Number.isNaN(v));

  const hasStipends = stipends.length > 0;
  return {
    companiesVisited,
    totalInternships: rows.length,
    averageStipend: hasStipends ? formatStipendAmount(stipends.reduce((a, b) => a + b, 0) / stipends.length) : null,
    medianStipend: hasStipends ? formatStipendAmount(median(stipends)) : null,
    highestStipend: hasStipends ? formatStipendAmount(Math.max(...stipends)) : null,
  };
}

// Top 10 rows by stipend value (descending) first, then every other row in
// its original imported order — rows with an unparseable/missing stipend
// value are treated as "not in the top 10" and stay in the trailing group.
export function sortInternshipRows(columns: string[], rows: InternshipRecordRow[]): InternshipRecordRow[] {
  const stipendIdx = findStipendColumnIndex(columns);
  if (stipendIdx === -1) return rows;
  const ranked = rows
    .map((r, i) => ({ r, i, val: parseStipendValue(r.cells[stipendIdx] || '') }))
    .filter((x) => !Number.isNaN(x.val))
    .sort((a, b) => b.val - a.val)
    .slice(0, 10);
  const topIndices = new Set(ranked.map((x) => x.i));
  const rest = rows.filter((_, i) => !topIndices.has(i));
  return [...ranked.map((x) => x.r), ...rest];
}
