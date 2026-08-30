import { useRef, useState } from 'react';
import * as XLSX from 'xlsx';

interface Props {
  /** Replaces the target textarea's value with the imported pipe-delimited
   *  text. Ignored (and the header-row checkbox hidden) when onImportSplit
   *  is provided instead. */
  onImport?: (text: string) => void;
  /** For fields that keep column headers in their own separate admin field
   *  (e.g. Placement Highlights' Table Column Headers + Data Table): row 1
   *  of the file is always taken as the header — no checkbox, no chance of
   *  a real data row being mistaken for it — and handed to this callback
   *  along with the rest of the rows, so one import fills both fields from
   *  the same file at once. */
  onImportSplit?: (headerLine: string, dataText: string) => void;
  label?: string;
}

// Every admin "Data Table" textarea already expects the same plain-text
// shape — one row per line, cells separated by " | " — so importing an
// Excel/CSV file just means reading its rows/columns (via SheetJS, which
// parses .xlsx/.xls/.csv identically) and joining each row's cells with
// " | " in the same column order they appear in the source file. No column
// mapping/reordering happens here — whatever order the sheet has is what
// ends up in the table.
export default function TableImportButton({ onImport, onImportSplit, label = 'Import from Excel/CSV' }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [skipHeaderRow, setSkipHeaderRow] = useState(true);
  const [status, setStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFile = async (file: File) => {
    setError(null);
    setStatus(null);
    try {
      const buffer = await file.arrayBuffer();
      const workbook = XLSX.read(buffer, { type: 'array' });
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const rows = XLSX.utils.sheet_to_json<unknown[]>(sheet, { header: 1, blankrows: false });
      const cellRows = rows
        .map((row) => row.map((cell) => (cell == null ? '' : String(cell).trim())))
        .filter((cells) => cells.some((c) => c !== ''));

      if (onImportSplit) {
        if (cellRows.length < 2) {
          setError('Need at least a header row and one data row in that file.');
          return;
        }
        const [headerRow, ...dataRows] = cellRows;
        onImportSplit(headerRow.join(' | '), dataRows.map((cells) => cells.join(' | ')).join('\n'));
        setStatus(`Imported header + ${dataRows.length} row${dataRows.length === 1 ? '' : 's'} — replaced both fields above.`);
        return;
      }

      const dataRows = skipHeaderRow ? cellRows.slice(1) : cellRows;
      const lines = dataRows.map((cells) => cells.join(' | '));
      if (lines.length === 0) {
        setError('No data rows found in that file.');
        return;
      }
      onImport?.(lines.join('\n'));
      setStatus(`Imported ${lines.length} row${lines.length === 1 ? '' : 's'} — replaced the table above.`);
    } catch {
      setError("Could not read that file — make sure it's a valid Excel (.xlsx/.xls) or CSV file.");
    }
  };

  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap' }}>
      <button
        type="button"
        className="admin-btn admin-btn--ghost admin-btn--sm"
        onClick={() => inputRef.current?.click()}
      >
        📥 {label}
      </button>
      {!onImportSplit && (
        <label style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.78rem', color: '#6b7280', cursor: 'pointer' }}>
          <input type="checkbox" checked={skipHeaderRow} onChange={(e) => setSkipHeaderRow(e.target.checked)} />
          First row is header
        </label>
      )}
      {status && <span style={{ fontSize: '0.78rem', color: '#16a34a' }}>{status}</span>}
      {error && <span style={{ fontSize: '0.78rem', color: '#dc2626' }}>{error}</span>}
      <input
        ref={inputRef}
        type="file"
        accept=".xlsx,.xls,.csv"
        style={{ display: 'none' }}
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) handleFile(f);
          e.target.value = '';
        }}
      />
    </span>
  );
}
