import * as XLSX from 'xlsx';

// Reads a "Patents" spreadsheet (.xlsx/.xls, or a plain .csv) and converts it
// into the same "## Category / ### Project / Label: value" text the Project
// Accordion field already understands (see parseProjectAccordion in
// structuredTable.ts).
//
// Expected header row (order doesn't matter): Sl. | Category | Application |
// Applicant Name | Dept. | Date of Filing | Title of Invention |
// Inventor Name | Status | Proof.
// "Category" holds the patent's utility/type (e.g. "Design Patent") and gets
// appended to the project title in parens. "Status" holds Granted/Published
// and is used to group projects under a "## <Year> – <Status>" heading — the
// year itself isn't a column, it comes from the sheet's tab name (or, for a
// single-sheet file/.csv, the file name) — e.g. a tab named "2024" groups all
// its rows under headings like "## 2024 – Granted" / "## 2024 – Published".

const HEADER_TO_LABEL: Record<string, string> = {
  'application': 'Application Number',
  'application number': 'Application Number',
  'application no': 'Application Number',
  'applicant name': 'Applicant Names',
  'applicant names': 'Applicant Names',
  'dept': 'Department',
  'department': 'Department',
  'date of filing': 'Date of Filing',
  'date of': 'Date of Filing',
  'inventor name': 'Inventor Name',
  'inventor names': 'Inventor Name',
  'status': 'Status',
  'proof': 'Proof',
};

function normalizeHeader(h: string): string {
  return h.trim().toLowerCase().replace(/\.+$/, '').replace(/\s+/g, ' ');
}

function yearFromName(name: string): string | null {
  const match = name.match(/20\d{2}/);
  return match ? match[0] : null;
}

function buildYearBlock(rows: unknown[][], year: string | null): { text: string; count: number } {
  // Find the header row — the sheet may have a couple of title rows above it
  // before the real column headers.
  let headerRowIndex = -1;
  const colMap: Record<number, string> = {};
  let titleCol = NaN;
  let categoryCol = NaN;
  let statusCol = NaN;
  for (let i = 0; i < rows.length; i++) {
    const row = rows[i].map((c) => String(c ?? ''));
    if (row.some((c) => normalizeHeader(c) === 'title of invention')) {
      headerRowIndex = i;
      row.forEach((cell, idx) => {
        const norm = normalizeHeader(cell);
        if (norm === 'title of invention') titleCol = idx;
        else if (norm === 'category') categoryCol = idx;
        else if (norm === 'status') { statusCol = idx; colMap[idx] = 'Status'; }
        else if (norm === 'sl' || norm === 's no' || norm === 'sno') { /* row number — ignore */ }
        else if (HEADER_TO_LABEL[norm]) colMap[idx] = HEADER_TO_LABEL[norm];
      });
      break;
    }
  }
  if (headerRowIndex === -1 || Number.isNaN(titleCol)) return { text: '', count: 0 };

  // Group rows by their Status value, preserving the order each status is
  // first encountered, so every project for a given status ends up under one
  // "## <Year> – <Status>" heading even if the sheet isn't pre-sorted.
  const groups = new Map<string, string[]>();
  const groupOrder: string[] = [];
  let count = 0;

  for (let i = headerRowIndex + 1; i < rows.length; i++) {
    const row = rows[i];
    const title = String(row[titleCol] ?? '').trim();
    if (!title) continue;
    count++;

    const category = !Number.isNaN(categoryCol) ? String(row[categoryCol] ?? '').trim() : '';
    const status = (!Number.isNaN(statusCol) ? String(row[statusCol] ?? '').trim() : '') || 'Uncategorized';
    if (!groups.has(status)) { groups.set(status, []); groupOrder.push(status); }
    const lines = groups.get(status)!;

    if (lines.length > 0) lines.push('');
    lines.push(`### ${category ? `${title} (${category})` : title}`);
    for (const [idxStr, label] of Object.entries(colMap)) {
      const raw = String(row[Number(idxStr)] ?? '').trim();
      if (raw) lines.push(`${label}: ${raw}`);
    }
  }

  const blocks = groupOrder.map((status) => {
    const heading = `## ${year ? `${year} – ${status}` : status}`;
    return [heading, ...groups.get(status)!].join('\n');
  });
  return { text: blocks.join('\n\n'), count };
}

export interface PatentsImportSummary {
  text: string;
  sheetsUsed: string[];
  patentCount: number;
}

export function parsePatentsBuffer(buf: ArrayBuffer, fileName: string): PatentsImportSummary {
  const wb = XLSX.read(buf, { type: 'array' });
  const blocks: string[] = [];
  const sheetsUsed: string[] = [];
  let patentCount = 0;
  const fileYear = yearFromName(fileName);

  for (const sheetName of wb.SheetNames) {
    const rows: unknown[][] = XLSX.utils.sheet_to_json(wb.Sheets[sheetName], { header: 1, raw: false, defval: '' });
    const year = yearFromName(sheetName) || fileYear;
    const { text, count } = buildYearBlock(rows, year);
    if (count > 0) {
      blocks.push(text);
      sheetsUsed.push(sheetName);
      patentCount += count;
    }
  }

  return { text: blocks.join('\n\n'), sheetsUsed, patentCount };
}

export async function parsePatentsWorkbook(file: File): Promise<PatentsImportSummary> {
  const buf = await file.arrayBuffer();
  return parsePatentsBuffer(buf, file.name);
}
