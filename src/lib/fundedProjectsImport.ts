import * as XLSX from 'xlsx';

// Reads a "Funded R&D Projects" spreadsheet (.xlsx/.xls, or a plain .csv)
// and converts it into the same "## Category / ### Project / Label: value /
// Outcome:\n- bullet" text the Project Accordion field already understands
// (see parseProjectAccordion in structuredTable.ts).
//
// Expected header row (order doesn't matter): S.No. | Sanction File No |
// Agencie | Name of the Project | Name of the Staff | Dept. | Status |
// Start Date | Year of Sanctioned | Total Amount Sanctioned | Outcomes.
// Multiple outcomes in one cell are entered with Alt+Enter inside Excel (a
// line break within the cell) — each line becomes its own bullet.
//
// A workbook with separate "Ongoing"/"Completed" sheet tabs gets one
// category per tab; a single-sheet file (a .csv can only ever have one)
// falls back to the filename ("...ongoing...", "...completed...") for its
// category, or no category heading at all if neither matches.

const HEADER_TO_LABEL: Record<string, string> = {
  'sanction file no': 'Sanction File No',
  'agencie': 'Agency',
  'agency': 'Agency',
  'agencies': 'Agency',
  'name of the staff': 'PI',
  'staff': 'PI',
  'dept': 'Department',
  'department': 'Department',
  'status': 'Status',
  'start date': 'Start Date',
  'year of sanctioned': 'Year of Sanction',
  'year of sanction': 'Year of Sanction',
  'total amount sanctioned': 'Amount',
  'amount sanctioned': 'Amount',
  'amount': 'Amount',
};

function normalizeHeader(h: string): string {
  return h.trim().toLowerCase().replace(/\.+$/, '').replace(/\s+/g, ' ');
}

function categoryFromName(name: string): string | null {
  const n = name.toLowerCase();
  if (n.includes('ongoing')) return 'Ongoing Projects';
  if (n.includes('completed')) return 'Completed Projects';
  return null;
}

function buildBlock(rows: unknown[][], category: string | null): { text: string; count: number } {
  // Find the header row — the sheet may have a couple of title rows above
  // it ("VISHNU WOMEN'S UNIVERSITY :: Bhimavaram", "ONGOING FUNDED R&D
  // PROJECTS") before the real column headers.
  let headerRowIndex = -1;
  const colMap: Record<number, string> = {};
  for (let i = 0; i < rows.length; i++) {
    const row = rows[i].map((c) => String(c ?? ''));
    if (row.some((c) => normalizeHeader(c) === 'name of the project')) {
      headerRowIndex = i;
      row.forEach((cell, idx) => {
        const norm = normalizeHeader(cell);
        if (norm === 'name of the project') colMap[idx] = 'title';
        else if (norm === 'outcomes' || norm === 'outcome') colMap[idx] = 'outcome';
        else if (HEADER_TO_LABEL[norm]) colMap[idx] = HEADER_TO_LABEL[norm];
      });
      break;
    }
  }
  if (headerRowIndex === -1) return { text: '', count: 0 };
  const titleCol = Number(Object.entries(colMap).find(([, v]) => v === 'title')?.[0]);
  if (Number.isNaN(titleCol)) return { text: '', count: 0 };

  const lines: string[] = category ? [`## ${category}`] : [];
  let count = 0;
  for (let i = headerRowIndex + 1; i < rows.length; i++) {
    const row = rows[i];
    const title = String(row[titleCol] ?? '').trim();
    if (!title) continue;
    count++;
    lines.push(`### ${title}`);
    for (const [idxStr, field] of Object.entries(colMap)) {
      if (field === 'title') continue;
      const raw = String(row[Number(idxStr)] ?? '').trim();
      if (!raw) continue;
      if (field === 'outcome') {
        lines.push('Outcome:');
        raw.split('\n').map((s) => s.trim()).filter(Boolean).forEach((line) => lines.push(`- ${line}`));
      } else {
        lines.push(`${field}: ${raw}`);
      }
    }
  }
  return { text: lines.join('\n'), count };
}

export interface ImportSummary {
  text: string;
  sheetsUsed: string[];
  projectCount: number;
}

export function parseFundedProjectsBuffer(buf: ArrayBuffer, fileName: string): ImportSummary {
  const wb = XLSX.read(buf, { type: 'array' });
  const blocks: string[] = [];
  const sheetsUsed: string[] = [];
  let projectCount = 0;

  // Pass 1: sheets whose tab name says which category they are.
  for (const sheetName of wb.SheetNames) {
    const category = categoryFromName(sheetName);
    if (!category) continue;
    const rows: unknown[][] = XLSX.utils.sheet_to_json(wb.Sheets[sheetName], { header: 1, raw: false, defval: '' });
    const { text, count } = buildBlock(rows, category);
    if (count > 0) {
      blocks.push(text);
      sheetsUsed.push(sheetName);
      projectCount += count;
    }
  }

  // Pass 2 (fallback): nothing matched by tab name — e.g. a single-sheet
  // .csv, or tabs not literally named "Ongoing"/"Completed". Use every
  // sheet, guessing its category from the file name; no category heading
  // if that doesn't match either.
  if (blocks.length === 0) {
    const fileCategory = categoryFromName(fileName);
    for (const sheetName of wb.SheetNames) {
      const rows: unknown[][] = XLSX.utils.sheet_to_json(wb.Sheets[sheetName], { header: 1, raw: false, defval: '' });
      const { text, count } = buildBlock(rows, fileCategory);
      if (count > 0) {
        blocks.push(text);
        sheetsUsed.push(sheetName);
        projectCount += count;
      }
    }
  }

  return { text: blocks.join('\n'), sheetsUsed, projectCount };
}

export async function parseFundedProjectsWorkbook(file: File): Promise<ImportSummary> {
  const buf = await file.arrayBuffer();
  return parseFundedProjectsBuffer(buf, file.name);
}
