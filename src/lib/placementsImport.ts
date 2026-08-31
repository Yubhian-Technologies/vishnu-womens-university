import * as XLSX from 'xlsx';
// The worker script itself is just a static asset here — resolving its URL
// doesn't pull the (large) pdfjs-dist library into the eagerly-loaded
// bundle; that only happens inside parsePlacementsPdf's dynamic import.
import pdfWorkerSrc from 'pdfjs-dist/build/pdf.worker.mjs?url';

// Reads a department Placements source file and returns whatever
// columns/rows it actually contains — the first row (or, for Word/PDF, the
// first detected table row) is always treated as the header row, and every
// column is kept as-is (no fixed/expected column names, per the department
// Placements admin's "works with whatever columns are present"
// requirement). Four formats are accepted:
//   - .xlsx / .xls / .csv — read via the `xlsx` package, first sheet only.
//   - .docx — read via `mammoth`, which converts Word tables straight to
//     HTML <table> markup; the first table found is used.
//   - .pdf — PDF has no native table structure, so this reconstructs one
//     from raw text position data (see parsePlacementsPdf below). Works
//     well for placement lists exported straight from Excel/Word; a PDF
//     with an unusual/overlapping layout may need a manual re-export to
//     Excel instead.
// Both mammoth and pdfjs-dist are dynamically imported so their (sizeable)
// code only loads when a Word/PDF file is actually being imported.

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

async function parsePlacementsDocx(buf: ArrayBuffer): Promise<PlacementImportResult> {
  const mammoth = await import('mammoth');
  const { value: html } = await mammoth.convertToHtml({ arrayBuffer: buf });
  const parsed = new DOMParser().parseFromString(html, 'text/html');
  const table = parsed.querySelector('table');
  if (!table) return { columns: [], rows: [] };

  const trs = Array.from(table.querySelectorAll('tr'));
  if (trs.length === 0) return { columns: [], rows: [] };

  const columns = Array.from(trs[0].querySelectorAll('th, td')).map(
    (cell, i) => (cell.textContent || '').trim() || `Column ${i + 1}`
  );
  const rows = trs
    .slice(1)
    .map((tr) => {
      const cells = Array.from(tr.querySelectorAll('th, td')).map((c) => (c.textContent || '').trim());
      return columns.map((_, i) => cells[i] ?? '');
    })
    .filter((row) => row.some((cell) => cell !== ''));

  return { columns, rows };
}

// Merges text runs that sit close enough together to be separate words
// within the same cell (e.g. "Company" + "Name") rather than genuinely
// separate columns — PDF text is a stream of individually-positioned runs,
// not pre-grouped into cells like a Word table is.
function mergeAdjacentText<T extends { text: string; x: number }>(items: T[], gap = 12): T[] {
  const merged: T[] = [];
  for (const it of items) {
    const last = merged[merged.length - 1];
    if (last && it.x - last.x < gap) last.text = `${last.text} ${it.text}`.trim();
    else merged.push({ ...it });
  }
  return merged;
}

// PDF has no native concept of a table, so this reconstructs one from raw
// text position data: every text run on every page is grouped into rows by
// its y-position (allowing a small tolerance, since baselines wobble by a
// point or two even within one visual row), then each row's runs are
// bucketed into columns using the header row's x-positions as column
// boundaries. This is a heuristic, not real table detection — it works well
// for placement lists exported straight from Excel/Word (clean, evenly
// spaced columns) but can misalign on an unusually laid-out PDF.
async function parsePlacementsPdf(buf: ArrayBuffer): Promise<PlacementImportResult> {
  const pdfjsLib = await import('pdfjs-dist');
  pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorkerSrc;

  const pdf = await pdfjsLib.getDocument({ data: buf }).promise;

  type PositionedText = { text: string; x: number; y: number };
  const lineRows: PositionedText[][] = [];

  for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
    const page = await pdf.getPage(pageNum);
    const content = await page.getTextContent();

    const items: PositionedText[] = [];
    for (const it of content.items) {
      if (!('str' in it) || !it.str.trim()) continue;
      items.push({ text: it.str, x: it.transform[4], y: Math.round(it.transform[5]) });
    }
    items.sort((a, b) => b.y - a.y || a.x - b.x);

    const rows: PositionedText[][] = [];
    for (const it of items) {
      const row = rows.find((r) => Math.abs(r[0].y - it.y) <= 3);
      if (row) row.push(it);
      else rows.push([it]);
    }
    rows.forEach((r) => r.sort((a, b) => a.x - b.x));
    lineRows.push(...rows);
  }

  if (lineRows.length === 0) return { columns: [], rows: [] };

  const headerCells = mergeAdjacentText(lineRows[0]);
  const columns = headerCells.map((c, i) => c.text.trim() || `Column ${i + 1}`);
  const columnStarts = headerCells.map((c) => c.x);

  const rows = lineRows
    .slice(1)
    .map((line) => {
      const cells = columns.map(() => '');
      for (const it of line) {
        let colIdx = 0;
        for (let i = 0; i < columnStarts.length; i++) {
          if (it.x >= columnStarts[i] - 5) colIdx = i;
        }
        cells[colIdx] = cells[colIdx] ? `${cells[colIdx]} ${it.text}` : it.text;
      }
      return cells;
    })
    .filter((row) => row.some((cell) => cell !== ''));

  return { columns, rows };
}

export async function parsePlacementsFile(file: File): Promise<PlacementImportResult> {
  const name = file.name.toLowerCase();
  const buf = await file.arrayBuffer();
  if (name.endsWith('.docx')) return parsePlacementsDocx(buf);
  if (name.endsWith('.pdf')) return parsePlacementsPdf(buf);
  // .xlsx / .xls / .csv, and anything else — hand to the spreadsheet
  // reader, which is the most forgiving of the four.
  return parsePlacementsBuffer(buf);
}
