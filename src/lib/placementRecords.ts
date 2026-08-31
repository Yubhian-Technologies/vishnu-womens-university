// Shared types + sort logic for department Placement Records (see
// PlacementRecordsAdmin section in DepartmentsAdmin.tsx and the "Placements"
// section on DepartmentDetail.tsx). Columns are entirely whatever the admin's
// uploaded Excel file contained — nothing here assumes fixed column names.

// `cells` wraps each row in an object (not a bare string[]) because Firestore
// rejects arrays nested directly inside arrays — same reason NewsEventsYear's
// rows do this (see ProgramsAdmin.tsx).
export interface PlacementRecordRow {
  cells: string[];
}

export interface PlacementRecordSet {
  // Firestore doc id === the department's shortCode, lowercased (see
  // placementRecordsDocId below) — one current dataset per department;
  // re-importing replaces it.
  department: string;
  columns: string[];
  rows: PlacementRecordRow[];
  updatedAt?: unknown;
}

export function placementRecordsDocId(shortCode: string): string {
  return shortCode.trim().toLowerCase();
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
