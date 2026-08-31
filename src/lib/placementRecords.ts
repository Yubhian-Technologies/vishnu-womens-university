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

// Finds whichever column looks like it holds the placement package/CTC —
// prefers a header containing both "highest" and "package", then any
// "package", then "ctc", then "salary". Returns -1 if nothing matches (the
// public page then just shows rows in their original imported order).
export function findPackageColumnIndex(columns: string[]): number {
  const normalized = columns.map((c) => c.toLowerCase());
  let idx = normalized.findIndex((c) => c.includes('highest') && c.includes('package'));
  if (idx === -1) idx = normalized.findIndex((c) => c.includes('package'));
  if (idx === -1) idx = normalized.findIndex((c) => c.includes('ctc'));
  if (idx === -1) idx = normalized.findIndex((c) => c.includes('salary'));
  return idx;
}

// Pulls the first number out of a package cell — handles values like
// "₹12 LPA", "12,00,000", "8.5", "Rs. 6 LPA" by stripping thousands commas
// and grabbing the leading digits/decimal.
function parsePackageValue(raw: string): number {
  const cleaned = (raw || '').replace(/,/g, '');
  const match = cleaned.match(/[\d.]+/);
  return match ? parseFloat(match[0]) : NaN;
}

// Finds whichever column looks like it holds the recruiting company's name —
// prefers "company", then "organisation"/"organization", then "recruiter",
// then "employer". Returns -1 if nothing matches (No. of Companies Visited
// then just falls back to 0 rather than guessing).
function findCompanyColumnIndex(columns: string[]): number {
  const normalized = columns.map((c) => c.toLowerCase());
  let idx = normalized.findIndex((c) => c.includes('company'));
  if (idx === -1) idx = normalized.findIndex((c) => c.includes('organis') || c.includes('organiz'));
  if (idx === -1) idx = normalized.findIndex((c) => c.includes('recruiter'));
  if (idx === -1) idx = normalized.findIndex((c) => c.includes('employer'));
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
