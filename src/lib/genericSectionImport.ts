import * as XLSX from 'xlsx';

// Reads a spreadsheet (.xlsx/.xls, or a plain .csv) into the plain-text
// formats an admin-defined custom section understands (see
// lib/customSections.ts / CustomSectionEditor.tsx) — for "table" content
// this is parseFlexibleTable's DSL, for "links" content it's
// parseLinkList's DSL (both in structuredTable.ts).
//
// Unlike fundedProjectsImport.ts / patentsImport.ts (which map known,
// domain-specific column headers to canonical labels), a custom section's
// columns aren't known in advance — an admin could be importing a faculty
// roster, a list of patents, anything. So these importers are structurally
// generic instead: row 0 of each sheet is used as the header row verbatim,
// every following non-blank row is a data row. A workbook with more than
// one sheet gets one named group per sheet (`## <sheet name>`); a
// single-sheet file (a .csv can only ever have one) has no group heading.

function isBlankRow(row: unknown[]): boolean {
  return row.every((c) => String(c ?? '').trim() === '');
}

export interface GenericTableImportSummary {
  text: string;
  sheetsUsed: string[];
  rowCount: number;
}

export function parseGenericTableBuffer(buf: ArrayBuffer): GenericTableImportSummary {
  const wb = XLSX.read(buf, { type: 'array' });
  const multiSheet = wb.SheetNames.length > 1;
  const blocks: string[] = [];
  const sheetsUsed: string[] = [];
  let rowCount = 0;

  for (const sheetName of wb.SheetNames) {
    const rows: unknown[][] = XLSX.utils.sheet_to_json(wb.Sheets[sheetName], { header: 1, raw: false, defval: '' });
    const dataRows = rows.filter((r) => !isBlankRow(r));
    if (dataRows.length < 2) continue; // need at least a header row + one data row
    const [header, ...body] = dataRows;
    const lines: string[] = [];
    if (multiSheet) lines.push(`## ${sheetName}`);
    lines.push(header.map((c) => String(c ?? '').trim()).join(' | '));
    for (const row of body) {
      lines.push(row.map((c) => String(c ?? '').trim()).join(' | '));
      rowCount++;
    }
    blocks.push(lines.join('\n'));
    sheetsUsed.push(sheetName);
  }

  return { text: blocks.join('\n\n'), sheetsUsed, rowCount };
}

export async function parseGenericTableWorkbook(file: File): Promise<GenericTableImportSummary> {
  const buf = await file.arrayBuffer();
  return parseGenericTableBuffer(buf);
}

export interface GenericLinksImportSummary {
  text: string;
  sheetsUsed: string[];
  linkCount: number;
}

// Positional, not name-matched: column A is always the label, column B is
// always the URL, whatever their header text says. Row 0 is treated as a
// header row and skipped.
export function parseGenericLinksBuffer(buf: ArrayBuffer): GenericLinksImportSummary {
  const wb = XLSX.read(buf, { type: 'array' });
  const multiSheet = wb.SheetNames.length > 1;
  const blocks: string[] = [];
  const sheetsUsed: string[] = [];
  let linkCount = 0;

  for (const sheetName of wb.SheetNames) {
    const rows: unknown[][] = XLSX.utils.sheet_to_json(wb.Sheets[sheetName], { header: 1, raw: false, defval: '' });
    const dataRows = rows.filter((r) => !isBlankRow(r)).slice(1); // drop header row
    const lines: string[] = [];
    let count = 0;
    for (const row of dataRows) {
      const label = String(row[0] ?? '').trim();
      const url = String(row[1] ?? '').trim();
      if (!label || !url) continue;
      lines.push(`${label} | ${url}`);
      count++;
    }
    if (count === 0) continue;
    const block = multiSheet ? [`## ${sheetName}`, ...lines].join('\n') : lines.join('\n');
    blocks.push(block);
    sheetsUsed.push(sheetName);
    linkCount += count;
  }

  return { text: blocks.join('\n\n'), sheetsUsed, linkCount };
}

export async function parseGenericLinksWorkbook(file: File): Promise<GenericLinksImportSummary> {
  const buf = await file.arrayBuffer();
  return parseGenericLinksBuffer(buf);
}
