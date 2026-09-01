import FileUploader from '../../../components/FileUploader/FileUploader';
import type { UploadResult } from '../../../lib/storage';

export interface RndTableRow {
  cells: string[];
  pdfUrl?: string;
  pdfStoragePath?: string;
}

export interface RndStructuredTable {
  columns: string[];
  rows: RndTableRow[];
}

interface Props {
  table: RndStructuredTable;
  onChange: (table: RndStructuredTable) => void;
}

/**
 * A structured Research & Development table — admin-defined columns (like
 * NewsEventsYearsEditor's), but each row can also carry its own PDF upload
 * (e.g. the actual patent/paper for that row), unlike the free-text
 * `rndTableText` field above it or the flat, table-less `rndLinks` list.
 * Rows and columns are kept in sync positionally, same as
 * NewsEventsYearsEditor: adding/removing/reordering a column does the same
 * to every row's cells.
 */
export default function RndTableEditor({ table, onChange }: Props) {
  const columns = table.columns || [];
  const rows = table.rows || [];

  const addColumn = () => {
    onChange({ columns: [...columns, `Column ${columns.length + 1}`], rows: rows.map((r) => ({ ...r, cells: [...r.cells, ''] })) });
  };
  const updateColumnLabel = (ci: number, label: string) => {
    onChange({ columns: columns.map((c, i) => (i === ci ? label : c)), rows });
  };
  const moveColumn = (ci: number, dir: -1 | 1) => {
    const target = ci + dir;
    if (target < 0 || target >= columns.length) return;
    const nextColumns = [...columns];
    [nextColumns[ci], nextColumns[target]] = [nextColumns[target], nextColumns[ci]];
    const nextRows = rows.map((r) => {
      const cells = [...r.cells];
      [cells[ci], cells[target]] = [cells[target], cells[ci]];
      return { ...r, cells };
    });
    onChange({ columns: nextColumns, rows: nextRows });
  };
  const removeColumn = (ci: number) => {
    onChange({ columns: columns.filter((_, i) => i !== ci), rows: rows.map((r) => ({ ...r, cells: r.cells.filter((_, i) => i !== ci) })) });
  };
  const addRow = () => onChange({ columns, rows: [...rows, { cells: columns.map(() => ''), pdfUrl: '', pdfStoragePath: '' }] });
  const updateCell = (ri: number, ci: number, value: string) => {
    onChange({ columns, rows: rows.map((r, i) => (i !== ri ? r : { ...r, cells: r.cells.map((c, j) => (j === ci ? value : c)) })) });
  };
  const moveRow = (ri: number, dir: -1 | 1) => {
    const target = ri + dir;
    if (target < 0 || target >= rows.length) return;
    const next = [...rows];
    [next[ri], next[target]] = [next[target], next[ri]];
    onChange({ columns, rows: next });
  };
  const removeRow = (ri: number) => onChange({ columns, rows: rows.filter((_, i) => i !== ri) });
  const handleRowPdf = (ri: number, r: UploadResult) => {
    onChange({ columns, rows: rows.map((row, i) => (i === ri ? { ...row, pdfUrl: r.url, pdfStoragePath: r.path } : row)) });
  };
  const removeRowPdf = (ri: number) => {
    onChange({ columns, rows: rows.map((row, i) => (i === ri ? { ...row, pdfUrl: '', pdfStoragePath: '' } : row)) });
  };

  return (
    <div style={{ border: '1.5px solid var(--color-light-gray)', borderRadius: 8, padding: '0.75rem' }}>
      <label style={{ fontSize: '0.78rem', fontWeight: 700, display: 'block', marginBottom: '0.3rem' }}>Columns</label>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.75rem' }}>
        {columns.map((col, ci) => (
          <div key={ci} style={{ display: 'flex', gap: '0.25rem', alignItems: 'center' }}>
            <input value={col} onChange={(e) => updateColumnLabel(ci, e.target.value)} placeholder="Column name" style={{ width: 140 }} />
            <button type="button" className="admin-btn admin-btn--sm" onClick={() => moveColumn(ci, -1)} disabled={ci === 0} title="Move left">←</button>
            <button type="button" className="admin-btn admin-btn--sm" onClick={() => moveColumn(ci, 1)} disabled={ci === columns.length - 1} title="Move right">→</button>
            <button type="button" className="admin-btn admin-btn--sm admin-btn--danger" onClick={() => removeColumn(ci)}>✕</button>
          </div>
        ))}
        <button type="button" className="admin-btn admin-btn--sm" onClick={addColumn}>+ Add Column</button>
      </div>

      {columns.length === 0 ? (
        <p className="admin-field__hint">Add at least one column before adding rows.</p>
      ) : (
        <>
          <label style={{ fontSize: '0.78rem', fontWeight: 700, display: 'block', marginBottom: '0.3rem' }}>Rows</label>
          {rows.map((row, ri) => (
            <div key={ri} style={{ border: '1px solid var(--color-light-gray)', borderRadius: 6, padding: '0.5rem', marginBottom: '0.5rem' }}>
              <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center', marginBottom: '0.5rem', flexWrap: 'wrap' }}>
                {columns.map((col, ci) => (
                  <input
                    key={ci}
                    value={row.cells[ci] ?? ''}
                    onChange={(e) => updateCell(ri, ci, e.target.value)}
                    placeholder={col || `Column ${ci + 1}`}
                    style={{ flex: 1, minWidth: 100 }}
                  />
                ))}
                <button type="button" className="admin-btn admin-btn--sm" onClick={() => moveRow(ri, -1)} disabled={ri === 0} title="Move up">↑</button>
                <button type="button" className="admin-btn admin-btn--sm" onClick={() => moveRow(ri, 1)} disabled={ri === rows.length - 1} title="Move down">↓</button>
                <button type="button" className="admin-btn admin-btn--sm admin-btn--danger" onClick={() => removeRow(ri)}>✕</button>
              </div>
              <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap' }}>
                <div style={{ maxWidth: 260 }}>
                  <FileUploader folder="vwu/programs/rnd" currentUrl={row.pdfUrl} onUploaded={(r) => handleRowPdf(ri, r)} label="Upload PDF" />
                </div>
                {row.pdfUrl && (
                  <button type="button" className="admin-btn admin-btn--ghost admin-btn--sm" onClick={() => removeRowPdf(ri)}>Remove PDF</button>
                )}
              </div>
            </div>
          ))}
          <button type="button" className="admin-btn admin-btn--sm" onClick={addRow}>+ Add Row</button>
        </>
      )}
    </div>
  );
}
