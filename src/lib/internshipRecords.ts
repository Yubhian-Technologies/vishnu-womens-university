// Shared types + column-detection helpers for programme Internship Records
// — the exact same shape/pattern as placementRecords.ts (see
// InternshipYearsEditor in ProgramsAdmin.tsx and the "Internships" section
// on DepartmentDetail.tsx / ProgramDetail.tsx), just for internships
// instead of placements: no package/stipend figure at all, a "Period"
// (duration) column instead, and no LPA-tier or highest/average/median
// stat tiles (there's nothing numeric to rank or average). Kept as its own
// file rather than sharing code with placementRecords.ts so the two stay
// fully independent — same reasoning NewsEventsYearsEditor's own small
// text-array helpers aren't shared with other editors either.
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
// "Peroid" instead of "Period") within any one word of a column header.
// Only real admin-typed typos of an otherwise-recognizable word should
// match here — short words and anything more than 2 edits away don't.
function fuzzyColumnIndex(columns: string[], keyword: string): number {
  const normalized = columns.map((c) => c.toLowerCase());
  return normalized.findIndex((header) =>
    header.split(/[^a-z0-9]+/).some((word) => word.length >= 4 && levenshtein(word, keyword) <= 2)
  );
}

// Finds whichever column looks like it holds the internship duration —
// prefers "period", then "duration", then a near-miss spelling (typo
// tolerance, see fuzzyColumnIndex). Returns -1 if nothing matches (the
// public card then falls back to a generic "Internship" badge).
export function findPeriodColumnIndex(columns: string[]): number {
  const normalized = columns.map((c) => c.toLowerCase());
  let idx = normalized.findIndex((c) => c.includes('period'));
  if (idx === -1) idx = normalized.findIndex((c) => c.includes('duration'));
  if (idx === -1) idx = fuzzyColumnIndex(columns, 'period');
  return idx;
}

// Finds whichever imported column is just a serial number ("S.No", "Sl.No",
// "SNo", "Serial No") so it can be hidden from the rendered table — the
// public page already numbers rows itself (1, 2, 3…) using their current
// display position, so keeping an imported S.No column too would duplicate
// that first column. Returns -1 if no column looks like one.
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

export interface InternshipYearStats {
  companiesVisited: number;
  totalInternships: number;
}

// Every figure here is computed live from the year's raw imported rows —
// nothing is admin-entered or hardcoded.
export function computeInternshipStats(columns: string[], rows: InternshipRecordRow[]): InternshipYearStats {
  const companyIdx = findCompanyColumnIndex(columns);
  const companiesVisited = companyIdx === -1
    ? 0
    : new Set(
        rows
          .map((r) => (r.cells[companyIdx] || '').trim().toLowerCase())
          .filter(Boolean)
      ).size;

  return {
    companiesVisited,
    totalInternships: rows.length,
  };
}
