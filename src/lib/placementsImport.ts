import * as XLSX from 'xlsx';

// Reads a department Placements spreadsheet (.xlsx/.xls, or a plain .csv)
// and returns whatever columns/rows it actually contains — the first row is
// always treated as the header row, and every column is kept as-is (no
// fixed/expected column names, per the department Placements admin's
// "works with whatever columns are present" requirement).

export interface PlacementImportResult {
  columns: string[];
  rows: string[][];
}

export function parsePlacementsBuffer(buf: ArrayBuffer): PlacementImportResult {
  const wb = XLSX.read(buf, { type: 'array' });
  const sheet = wb.Sheets[wb.SheetNames[0]];
  const raw: unknown[][] = XLSX.utils.sheet_to_json(sheet, { header: 1, raw: false, defval: '' });
  if (raw.length === 0) return { columns: [], rows: [] };

  const columns = raw[0].map((c, i) => String(c ?? '').trim() || `Column ${i + 1}`);
  const rows = raw
    .slice(1)
    .map((row) => columns.map((_, i) => String(row[i] ?? '').trim()))
    .filter((row) => row.some((cell) => cell !== ''));

  return { columns, rows };
}

export async function parsePlacementsWorkbook(file: File): Promise<PlacementImportResult> {
  const buf = await file.arrayBuffer();
  return parsePlacementsBuffer(buf);
}
