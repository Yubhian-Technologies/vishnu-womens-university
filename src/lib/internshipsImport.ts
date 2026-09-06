import * as XLSX from 'xlsx';
// The file-reading/parsing machinery (any format, no fixed column names) is
// entirely generic — nothing in it is placement-specific — so it's reused
// as-is here rather than duplicated. Only the template (fixed columns +
// example rows, specific to what an Internships sheet should contain) is
// its own thing.
export {
  parsePlacementsFile as parseInternshipsFile,
  dedupePlacementRows as dedupeInternshipRows,
  type PlacementImportResult as InternshipImportResult,
} from './placementsImport';
import type { PlacementImportResult } from './placementsImport';

// Column names chosen to match the auto-detection heuristics in
// internshipRecords.ts: "S. No." (findInternshipSerialColumnIndex — hidden
// from the public table, which numbers rows itself), "Name of Company"
// (used for the "No. of Companies" stat tile) and "Period" (shown as the
// card badge on the public page). "Name of the Student" and "Skill" have
// no special handling — they just display as-is.
const INTERNSHIP_TEMPLATE_HEADERS = ['S. No.', 'Name of the Student', 'Skill', 'Name of Company', 'Period'];

// Two rows for the same student ("A. Priya") to make the whole-row-only
// duplicate rule concrete in the template itself, rather than just in
// admin copy: repeating a name/company/etc. is fine, only an exact
// duplicate row (every column the same) gets rejected on import.
const INTERNSHIP_TEMPLATE_EXAMPLE_ROWS = [
  ['1', 'A. Priya', 'Web Development', 'TCS', '6 Weeks'],
  ['2', 'B. Swathi', 'Data Analytics', 'Infosys', '2 Months'],
  ['3', 'A. Priya', 'Cloud Computing', 'Wipro', '4 Weeks'],
];

// Strict, whole-file validation — same rule as Placements' own
// validatePlacementsImport (see there for the full reasoning): the header
// row must exactly be this template's columns, in that exact order
// (case/whitespace-insensitive) — nothing missing, extra, or reordered —
// AND every single row must have a value in every column. Failing either
// rejects the ENTIRE file, never a partial import with a bad row silently
// dropped. Returns an error message to show, or null if the file is clean.
export function validateInternshipsImport(result: PlacementImportResult): string | null {
  const norm = (s: string) => s.trim().toLowerCase();
  const got = result.columns.map(norm);
  const want = INTERNSHIP_TEMPLATE_HEADERS.map(norm);
  if (got.length !== want.length || got.some((c, i) => c !== want[i])) {
    return `This file's columns don't match the required Internships template — they must appear in this exact order, with nothing missing or extra.\n\nExpected: ${INTERNSHIP_TEMPLATE_HEADERS.join(', ')}\nFound: ${result.columns.join(', ')}\n\nUse "Download Internships Template" above and fill that file in instead.`;
  }
  const badRowIndex = result.rows.findIndex((row) => row.some((cell) => !cell.trim()));
  if (badRowIndex !== -1) {
    return `Row ${badRowIndex + 1} is missing a value in one or more columns — every column must be filled in for every row. The whole file was NOT imported; fix that row and re-upload it.`;
  }
  return null;
}

/** Downloads a blank Internships import template (.xlsx) with the expected
 *  columns and a couple of example rows — see InternshipYearsEditor's
 *  "Download Template" button in ProgramsAdmin.tsx. */
export function downloadInternshipsTemplate() {
  const ws = XLSX.utils.aoa_to_sheet([INTERNSHIP_TEMPLATE_HEADERS, ...INTERNSHIP_TEMPLATE_EXAMPLE_ROWS]);
  ws['!cols'] = INTERNSHIP_TEMPLATE_HEADERS.map((h) => ({ wch: Math.max(h.length, 16) }));
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Internships');
  XLSX.writeFile(wb, 'internship-records-template.xlsx');
}
