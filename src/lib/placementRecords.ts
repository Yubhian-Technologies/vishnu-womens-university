// Shared types + sort logic for programme Placement Records (see
// PlacementYearsEditor in ProgramsAdmin.tsx and the "Placements" section on
// DepartmentDetail.tsx / ProgramDetail.tsx). Columns are entirely whatever
// the admin's uploaded Excel file contained — nothing here assumes fixed
// column names.
//
// Stored as `ProgramDoc.placementYears` — an ordered list of academic years,
// each with its own independently-imported dataset — so records are scoped
// to exactly one Academic Year + Department + Programme (a programme's own
// `department` field already carries the department; the doc itself already
// carries the programme), matching the same "array of years on the
// programme doc" shape as newsletterYears/newsEventsYears above.

// `cells` wraps each row in an object (not a bare string[]) because Firestore
// rejects arrays nested directly inside arrays — same reason NewsEventsYear's
// rows do this (see ProgramsAdmin.tsx).
export interface PlacementRecordRow {
  cells: string[];
}

export interface PlacementYearRecord {
  // Admin-typed label, e.g. "2024-25" — free text, not a fixed enum, so an
  // admin can create/rename/reorder Academic Years however they like.
  year: string;
  columns: string[];
  rows: PlacementRecordRow[];
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
// "Pacakage" instead of "Package") within any one word of a column header.
// Only real admin-typed typos of an otherwise-recognizable word should
// match here — short words and anything more than 2 edits away don't.
function fuzzyColumnIndex(columns: string[], keyword: string): number {
  const normalized = columns.map((c) => c.toLowerCase());
  return normalized.findIndex((header) =>
    header.split(/[^a-z0-9]+/).some((word) => word.length >= 4 && levenshtein(word, keyword) <= 2)
  );
}

// Finds whichever column looks like it holds the placement package/CTC —
// prefers a header containing both "highest" and "package", then any
// "package", then "ctc", then "salary", then a near-miss spelling of
// "package"/"salary" (typo tolerance, see fuzzyColumnIndex). Returns -1 if
// nothing matches (the public page then just shows rows in their original
// imported order).
export function findPackageColumnIndex(columns: string[]): number {
  const normalized = columns.map((c) => c.toLowerCase());
  let idx = normalized.findIndex((c) => c.includes('highest') && c.includes('package'));
  if (idx === -1) idx = normalized.findIndex((c) => c.includes('package'));
  if (idx === -1) idx = normalized.findIndex((c) => c.includes('ctc'));
  if (idx === -1) idx = normalized.findIndex((c) => c.includes('salary'));
  if (idx === -1) idx = fuzzyColumnIndex(columns, 'package');
  if (idx === -1) idx = fuzzyColumnIndex(columns, 'salary');
  return idx;
}

// Pulls the first number out of a package cell — handles values like
// "₹12 LPA", "12,00,000", "8.5", "Rs. 6 LPA" by stripping thousands commas
// and grabbing the leading digits/decimal. Some departments' source sheets
// record the raw annual rupee figure ("12,00,000") instead of LPA ("12") —
// nothing in the cell text distinguishes the two once commas are stripped,
// so anything past what any real placement offer could plausibly be in LPA
// (the highest on record here is under 60) is treated as rupees and
// converted down; a genuine LPA figure is always well under that and passes
// through unchanged.
const IMPLAUSIBLE_LPA_THRESHOLD = 1000;
function parsePackageValue(raw: string): number {
  const cleaned = (raw || '').replace(/,/g, '');
  // Must start on an actual digit — a plain [\d.]+ can match a bare "."
  // inside e.g. "Rs. 6 LPA" (the period right after "Rs") before ever
  // reaching the real "6", parsing to NaN instead of 6.
  const match = cleaned.match(/\d[\d.]*/);
  if (!match) return NaN;
  const value = parseFloat(match[0]);
  return value >= IMPLAUSIBLE_LPA_THRESHOLD ? value / 100000 : value;
}

// Formats a package/CTC cell for display in the placement records table —
// reuses parsePackageValue's rupee-vs-LPA disambiguation so a raw annual
// rupee figure like "45,00,000" displays as the plain LPA figure "45"
// instead of the imported rupee text. Falls back to the original cell text
// when it doesn't parse as a number (e.g. "N/A", a blank cell).
export function formatPackageCell(raw: string): string {
  const value = parsePackageValue(raw);
  return Number.isNaN(value) ? raw : `${Number(value.toFixed(2))}`;
}

// Finds whichever imported column is just a serial number ("S.No", "Sl.No",
// "SNo", "Serial No") so it can be hidden from the rendered table — the
// public page already numbers rows itself (1, 2, 3…) using their current
// (post-sort) display position, so keeping an imported S.No column too both
// duplicates that first column and shows stale numbers once rows get
// reordered by sortPlacementRows. Returns -1 if no column looks like one.
export function findSerialColumnIndex(columns: string[]): number {
  const normalized = columns.map((c) => c.toLowerCase().replace(/[^a-z]/g, ''));
  return normalized.findIndex((c) => c === 'sno' || c === 'slno' || c === 'serialno' || c === 'serialnumber');
}

// Finds whichever column looks like it holds the recruiting company's name —
// prefers "company", then "organisation"/"organization", then "recruiter",
// then "employer". Returns -1 if nothing matches (No. of Companies Visited
// then just falls back to 0 rather than guessing).
export function findCompanyColumnIndex(columns: string[]): number {
  const normalized = columns.map((c) => c.toLowerCase());
  let idx = normalized.findIndex((c) => c.includes('company'));
  if (idx === -1) idx = normalized.findIndex((c) => c.includes('organis') || c.includes('organiz'));
  if (idx === -1) idx = normalized.findIndex((c) => c.includes('recruiter'));
  if (idx === -1) idx = normalized.findIndex((c) => c.includes('employer'));
  // "Placed in" / "Placed at" — some departments' own sheets label the
  // company column this way instead of "Company"/"Recruiter".
  if (idx === -1) idx = normalized.findIndex((c) => c.includes('placed'));
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
// precision (59.28 stays 59.28) — matches how these figures read naturally
// rather than always showing a fixed decimal count.
function formatLpa(n: number): string {
  return `${Number(n.toFixed(2))} LPA`;
}

export interface PlacementYearStats {
  companiesVisited: number;
  totalOffers: number;
  averageSalary: string | null;
  medianSalary: string | null;
  highestPackage: string | null;
  above50Lpa: number;
  above30Lpa: number;
  above10Lpa: number;
}

// Every figure here is computed live from the year's raw imported rows —
// nothing is admin-entered or hardcoded. `averageSalary`/`medianSalary`/
// `highestPackage` come back null when the dataset has no column that looks
// like a package/CTC column, so the tile can show "—" instead of a bogus 0.
export function computePlacementStats(columns: string[], rows: PlacementRecordRow[]): PlacementYearStats {
  const companyIdx = findCompanyColumnIndex(columns);
  const companiesVisited = companyIdx === -1
    ? 0
    : new Set(
        rows
          .map((r) => (r.cells[companyIdx] || '').trim().toLowerCase())
          .filter(Boolean)
      ).size;

  const pkgIdx = findPackageColumnIndex(columns);
  // parsePackageValue already normalizes rupee-scale figures down to LPA,
  // so nothing further is needed here.
  const packages = pkgIdx === -1
    ? []
    : rows.map((r) => parsePackageValue(r.cells[pkgIdx] || '')).filter((v) => !Number.isNaN(v));

  const hasPackages = packages.length > 0;
  return {
    companiesVisited,
    totalOffers: rows.length,
    averageSalary: hasPackages ? formatLpa(packages.reduce((a, b) => a + b, 0) / packages.length) : null,
    medianSalary: hasPackages ? formatLpa(median(packages)) : null,
    highestPackage: hasPackages ? formatLpa(Math.max(...packages)) : null,
    above50Lpa: packages.filter((v) => v >= 50).length,
    above30Lpa: packages.filter((v) => v >= 30).length,
    above10Lpa: packages.filter((v) => v >= 10).length,
  };
}

// Top 10 rows by package value (descending) first, then every other row in
// its original imported order — rows with an unparseable/missing package
// value are treated as "not in the top 10" and stay in the trailing group.
export function sortPlacementRows(columns: string[], rows: PlacementRecordRow[]): PlacementRecordRow[] {
  const pkgIdx = findPackageColumnIndex(columns);
  if (pkgIdx === -1) return rows;
  const ranked = rows
    .map((r, i) => ({ r, i, val: parsePackageValue(r.cells[pkgIdx] || '') }))
    .filter((x) => !Number.isNaN(x.val))
    .sort((a, b) => b.val - a.val)
    .slice(0, 10);
  const topIndices = new Set(ranked.map((x) => x.i));
  const rest = rows.filter((_, i) => !topIndices.has(i));
  return [...ranked.map((x) => x.r), ...rest];
}
