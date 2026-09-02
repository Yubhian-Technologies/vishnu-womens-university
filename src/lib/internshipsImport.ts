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

// Column names chosen to match the auto-detection heuristics in
// internshipRecords.ts: "S.No" (findInternshipSerialColumnIndex — hidden
// from the public table, which numbers rows itself), "Company" and
// "Stipend" (used for the stat tiles and the "10 highest" sort).
// "Registration Number", "Student Name", and "Industry Type" have no
// special handling — they just display as-is.
const INTERNSHIP_TEMPLATE_HEADERS = ['S.No', 'Registration Number', 'Student Name', 'Company', 'Industry Type', 'Stipend'];

// Two rows for the same student ("A. Priya") to make the whole-row-only
// duplicate rule concrete in the template itself, rather than just in
// admin copy: repeating a name/company/etc. is fine, only an exact
// duplicate row (every column the same) gets rejected on import.
const INTERNSHIP_TEMPLATE_EXAMPLE_ROWS = [
  ['1', '21A91A0501', 'A. Priya', 'TCS', 'IT Services', '15000'],
  ['2', '21A91A0502', 'B. Swathi', 'Infosys', 'IT Services', '20000'],
  ['3', '21A91A0501', 'A. Priya', 'Wipro', 'IT Services', '18000'],
];

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
