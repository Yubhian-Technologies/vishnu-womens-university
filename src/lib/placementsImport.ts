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
  // Diagnostic shown in the admin preview — e.g. how many separate tables
  // the document was split into and how many rows each contributed. Lets
  // whoever's importing see *why* the row count came out the way it did
  // (a small single table vs. several combined) without needing the raw
  // file to be inspected separately.
  warning?: string;
}

// A Word table's vertically-merged cell (e.g. one "Company" cell spanning
// several student rows) renders as a single <td rowspan="n"> on its first
// row and simply has NO <td> at all on the rows it continues into — mammoth
// preserves rowspan/colspan from the source .docx. Reading rows with a flat
// querySelectorAll('th,td') misaligns every cell after a merge (each
// continuation row is missing one cell, so every later column shifts left
// by one). This walks each row left-to-right, filling a column either from
// an active merge carried down from a row above or from the row's own next
// cell, so column position stays correct regardless of merges.
function expandTableRows(trs: Element[]): string[][] {
  const pending: Array<{ text: string; remaining: number } | undefined> = [];
  const rows: string[][] = [];
  for (const tr of trs) {
    const cellEls = Array.from(tr.querySelectorAll('th, td'));
    const row: string[] = [];
    let col = 0;
    let cellIdx = 0;
    while (cellIdx < cellEls.length || pending[col]) {
      const carry = pending[col];
      if (carry && carry.remaining > 0) {
        row[col] = carry.text;
        carry.remaining--;
        if (carry.remaining === 0) pending[col] = undefined;
        col++;
        continue;
      }
      const cell = cellEls[cellIdx];
      if (!cell) break;
      cellIdx++;
      const text = (cell.textContent || '').trim();
      const colSpan = Math.max(1, parseInt(cell.getAttribute('colspan') || '1', 10) || 1);
      const rowSpan = Math.max(1, parseInt(cell.getAttribute('rowspan') || '1', 10) || 1);
      for (let s = 0; s < colSpan; s++) {
        row[col] = text;
        if (rowSpan > 1) pending[col] = { text, remaining: rowSpan - 1 };
        col++;
      }
    }
    rows.push(row);
  }
  return rows;
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
  // A placement list long enough to span several pages is frequently split
  // by Word (and so by mammoth's conversion) into multiple separate <table>
  // elements — one per page/section break — rather than one continuous
  // table. Reading only the first one silently dropped every row after the
  // first break, e.g. a 150-row list coming through as ~25-30 rows. Every
  // table in the document is read and its data rows concatenated.
  const tables = Array.from(parsed.querySelectorAll('table'));
  if (tables.length === 0) return { columns: [], rows: [] };

  const tableTrs = tables.map((t) => Array.from(t.querySelectorAll('tr')));
  const firstTrs = tableTrs[0];
  if (firstTrs.length === 0) return { columns: [], rows: [] };

  // Word placement lists often have one or more title/caption rows above the
  // real header ("Department of Information Technology", "Placements ::
  // 2024-2025") — those render as a single merged cell spanning the row,
  // whereas a genuine header row always has more than one cell. Skip any
  // leading single-cell rows so the first true multi-column row becomes the
  // header instead of a title line (which previously locked `columns` to
  // length 1 and silently dropped every other column from every row).
  const headerIdx = firstTrs.findIndex((tr) => tr.querySelectorAll('th, td').length > 1);
  const startIdx = headerIdx === -1 ? 0 : headerIdx;

  const expandedFirst = expandTableRows(firstTrs);
  const columns = expandedFirst[startIdx].map((c, i) => c.trim() || `Column ${i + 1}`);
  const headerKey = columns.join('|').toLowerCase();
  const toCells = (row: string[]) => columns.map((_, i) => (row[i] ?? '').trim());

  const rows: string[][] = [];
  const perTableCounts: number[] = [];
  tableTrs.forEach((trs, tableIdx) => {
    const expanded = tableIdx === 0 ? expandedFirst : expandTableRows(trs);
    // Only the first table has title rows to skip past; a continuation
    // table (page 2 onward) starts straight into data — except it may
    // repeat the header row itself (Word's "repeat header row" setting),
    // which the headerKey check below filters back out either way.
    const from = tableIdx === 0 ? startIdx + 1 : 0;
    let kept = 0;
    for (let i = from; i < expanded.length; i++) {
      const cells = toCells(expanded[i]);
      if (!cells.some((c) => c !== '')) continue;
      if (cells.join('|').toLowerCase() === headerKey) continue;
      rows.push(cells);
      kept++;
    }
    perTableCounts.push(kept);
  });

  // Always surfaced (not just when something looks wrong) so whoever is
  // importing can immediately tell, from the admin preview itself, whether
  // a lower-than-expected row count is because the document really only had
  // that many rows in an actual Word table, or because it was split into
  // several tables that did/didn't all get picked up. If more rows were
  // expected than this reports even after combining every table's count,
  // the remaining entries most likely aren't in a real Word table at all
  // (e.g. pasted in as a picture/screenshot, or plain paragraph text) —
  // this importer can only read genuine table structure, not that.
  const warning = tables.length > 1
    ? `Found ${tables.length} tables in this document (one is often produced per page) — combined ${rows.length} data row${rows.length === 1 ? '' : 's'} from them (${perTableCounts.join(' + ')} per table). If you expected more than that combined total, the extra entries likely aren't inside an actual Word table.`
    : `Found 1 table in this document with ${rows.length} data row${rows.length === 1 ? '' : 's'}. If you expected more, the rest likely isn't inside an actual Word table (e.g. pasted in as an image or plain text) — only real table content can be read automatically.`;

  return { columns, rows, warning };
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

  // Same reasoning as the Word/.docx parser above: a title/caption line
  // ("Department of X", "Placements :: 2024-25") sits above the real header
  // in most placement lists exported from a template, and reads as a single
  // merged run of text rather than several separately-positioned column
  // labels. Skip any leading lines that merge down to just one cell so the
  // first genuinely multi-column line becomes the header.
  const headerRowIdx = lineRows.findIndex((line) => mergeAdjacentText(line).length > 1);
  const headerStart = headerRowIdx === -1 ? 0 : headerRowIdx;

  const headerCells = mergeAdjacentText(lineRows[headerStart]);
  const columns = headerCells.map((c, i) => c.text.trim() || `Column ${i + 1}`);
  const columnStarts = headerCells.map((c) => c.x);

  const rows = lineRows
    .slice(headerStart + 1)
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
