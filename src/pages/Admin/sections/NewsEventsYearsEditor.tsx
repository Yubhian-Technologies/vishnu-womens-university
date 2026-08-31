import { useState } from 'react';
import type { NewsEventsYear } from './ProgramsAdmin';

interface Props {
  years: NewsEventsYear[];
  onChange: (years: NewsEventsYear[]) => void;
}

/**
 * Academic-year table editor (year -> admin-defined columns -> event rows).
 * Extracted from what used to be a single per-programme "News & Events"
 * editor so it can be reused for each of a department's News & Events
 * categories (News & Events / Student Awards / Others) without tripling this
 * logic — fully controlled, the caller owns the array and which Firestore
 * field it maps to. Columns and rows are kept in sync positionally: adding /
 * removing / reordering a column does the same to every row's cells so a
 * cell always lines up with its column.
 */
export default function NewsEventsYearsEditor({ years, onChange }: Props) {
  const addYear = () => onChange([...years, { year: '', columns: [], rows: [] }]);
  const updateYearLabel = (yi: number, year: string) => onChange(years.map((y, i) => (i === yi ? { ...y, year } : y)));
  const moveYear = (yi: number, dir: -1 | 1) => {
    const next = [...years];
    const target = yi + dir;
    if (target < 0 || target >= next.length) return;
    [next[yi], next[target]] = [next[target], next[yi]];
    onChange(next);
  };
  const removeYear = (yi: number) => {
    if (!confirm('Remove this academic year and all its events?')) return;
    onChange(years.filter((_, i) => i !== yi));
  };
  const addColumn = (yi: number) => {
    onChange(years.map((y, i) => (i !== yi ? y : {
      ...y,
      columns: [...y.columns, `Column ${y.columns.length + 1}`],
      rows: y.rows.map((r) => ({ cells: [...r.cells, ''] })),
    })));
  };
  const updateColumnLabel = (yi: number, ci: number, label: string) => {
    onChange(years.map((y, i) => (i !== yi ? y : { ...y, columns: y.columns.map((c, j) => (j === ci ? label : c)) })));
  };
  const moveColumn = (yi: number, ci: number, dir: -1 | 1) => {
    onChange(years.map((y, i) => {
      if (i !== yi) return y;
      const target = ci + dir;
      if (target < 0 || target >= y.columns.length) return y;
      const columns = [...y.columns];
      [columns[ci], columns[target]] = [columns[target], columns[ci]];
      const rows = y.rows.map((r) => {
        const cells = [...r.cells];
        [cells[ci], cells[target]] = [cells[target], cells[ci]];
        return { cells };
      });
      return { ...y, columns, rows };
    }));
  };
  const removeColumn = (yi: number, ci: number) => {
    onChange(years.map((y, i) => (i !== yi ? y : {
      ...y,
      columns: y.columns.filter((_, j) => j !== ci),
      rows: y.rows.map((r) => ({ cells: r.cells.filter((_, j) => j !== ci) })),
    })));
  };
  const addRow = (yi: number) => {
    onChange(years.map((y, i) => (i !== yi ? y : { ...y, rows: [...y.rows, { cells: y.columns.map(() => '') }] })));
  };
  const updateCell = (yi: number, ri: number, ci: number, value: string) => {
    onChange(years.map((y, i) => (i !== yi ? y : {
      ...y,
      rows: y.rows.map((r, j) => (j !== ri ? r : { cells: r.cells.map((c, k) => (k === ci ? value : c)) })),
    })));
  };
  const moveRow = (yi: number, ri: number, dir: -1 | 1) => {
    onChange(years.map((y, i) => {
      if (i !== yi) return y;
      const target = ri + dir;
      if (target < 0 || target >= y.rows.length) return y;
      const rows = [...y.rows];
      [rows[ri], rows[target]] = [rows[target], rows[ri]];
      return { ...y, rows };
    }));
  };
  const removeRow = (yi: number, ri: number) => {
    onChange(years.map((y, i) => (i !== yi ? y : { ...y, rows: y.rows.filter((_, j) => j !== ri) })));
  };
  // Drag-to-reorder for academic years and, within a year, its events — same
  // ⠿-handle drag pattern as the All Programs table elsewhere in admin. Kept
  // alongside the ↑/↓ buttons above rather than replacing them.
  const [yearDrag, setYearDrag] = useState<number | null>(null);
  const handleYearDragOver = (overIndex: number) => {
    if (yearDrag === null || yearDrag === overIndex) return;
    const next = [...years];
    const [moved] = next.splice(yearDrag, 1);
    next.splice(overIndex, 0, moved);
    onChange(next);
    setYearDrag(overIndex);
  };
  const [rowDrag, setRowDrag] = useState<{ yi: number; ri: number } | null>(null);
  const handleRowDragOver = (yi: number, overIndex: number) => {
    if (!rowDrag || rowDrag.yi !== yi || rowDrag.ri === overIndex) return;
    onChange(years.map((y, i) => {
      if (i !== yi) return y;
      const rows = [...y.rows];
      const [moved] = rows.splice(rowDrag.ri, 1);
      rows.splice(overIndex, 0, moved);
      return { ...y, rows };
    }));
    setRowDrag({ yi, ri: overIndex });
  };

  return (
    <>
      {years.map((yr, yi) => (
        <div
          key={yi}
          draggable
          onDragStart={() => setYearDrag(yi)}
          onDragOver={(e) => { e.preventDefault(); handleYearDragOver(yi); }}
          onDrop={() => setYearDrag(null)}
          onDragEnd={() => setYearDrag(null)}
          style={{ border: '1.5px solid var(--color-light-gray)', borderRadius: 8, padding: '0.75rem', marginBottom: '0.75rem', opacity: yearDrag === yi ? 0.5 : 1 }}
        >
          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginBottom: '0.75rem' }}>
            <span style={{ cursor: 'grab', color: 'var(--color-text-light, #9ca3af)', fontSize: '1.1rem', userSelect: 'none' }} title="Drag to reorder">⠿</span>
            <input
              value={yr.year}
              onChange={(e) => updateYearLabel(yi, e.target.value)}
              placeholder="2025-26"
              style={{ flex: 1, fontWeight: 700 }}
            />
            <button type="button" className="admin-btn admin-btn--sm" onClick={() => moveYear(yi, -1)} disabled={yi === 0} title="Move up">↑</button>
            <button type="button" className="admin-btn admin-btn--sm" onClick={() => moveYear(yi, 1)} disabled={yi === years.length - 1} title="Move down">↓</button>
            <button type="button" className="admin-btn admin-btn--sm admin-btn--danger" onClick={() => removeYear(yi)}>Remove Year</button>
          </div>

          <label style={{ fontSize: '0.78rem', fontWeight: 700, display: 'block', marginBottom: '0.3rem' }}>Columns</label>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.75rem' }}>
            {yr.columns.map((col, ci) => (
              <div key={ci} style={{ display: 'flex', gap: '0.25rem', alignItems: 'center' }}>
                <input
                  value={col}
                  onChange={(e) => updateColumnLabel(yi, ci, e.target.value)}
                  placeholder="Column name"
                  style={{ width: 140 }}
                />
                <button type="button" className="admin-btn admin-btn--sm" onClick={() => moveColumn(yi, ci, -1)} disabled={ci === 0} title="Move left">←</button>
                <button type="button" className="admin-btn admin-btn--sm" onClick={() => moveColumn(yi, ci, 1)} disabled={ci === yr.columns.length - 1} title="Move right">→</button>
                <button type="button" className="admin-btn admin-btn--sm admin-btn--danger" onClick={() => removeColumn(yi, ci)}>✕</button>
              </div>
            ))}
            <button type="button" className="admin-btn admin-btn--sm" onClick={() => addColumn(yi)}>+ Add Column</button>
          </div>

          {yr.columns.length === 0 ? (
            <p className="admin-field__hint">Add at least one column before adding events.</p>
          ) : (
            <>
              <label style={{ fontSize: '0.78rem', fontWeight: 700, display: 'block', marginBottom: '0.3rem' }}>Events</label>
              {yr.rows.map((row, ri) => (
                <div
                  key={ri}
                  draggable
                  onDragStart={(e) => { e.stopPropagation(); setRowDrag({ yi, ri }); }}
                  onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); handleRowDragOver(yi, ri); }}
                  onDrop={(e) => { e.stopPropagation(); setRowDrag(null); }}
                  onDragEnd={(e) => { e.stopPropagation(); setRowDrag(null); }}
                  style={{ display: 'flex', gap: '0.4rem', marginBottom: '0.4rem', alignItems: 'center', opacity: rowDrag?.yi === yi && rowDrag.ri === ri ? 0.5 : 1 }}
                >
                  <span style={{ cursor: 'grab', color: 'var(--color-text-light, #9ca3af)', fontSize: '1rem', userSelect: 'none' }} title="Drag to reorder">⠿</span>
                  {yr.columns.map((col, ci) => (
                    <input
                      key={ci}
                      value={row.cells[ci] ?? ''}
                      onChange={(e) => updateCell(yi, ri, ci, e.target.value)}
                      placeholder={col || `Column ${ci + 1}`}
                      style={{ flex: 1 }}
                    />
                  ))}
                  <button type="button" className="admin-btn admin-btn--sm" onClick={() => moveRow(yi, ri, -1)} disabled={ri === 0} title="Move up">↑</button>
                  <button type="button" className="admin-btn admin-btn--sm" onClick={() => moveRow(yi, ri, 1)} disabled={ri === yr.rows.length - 1} title="Move down">↓</button>
                  <button type="button" className="admin-btn admin-btn--sm admin-btn--danger" onClick={() => removeRow(yi, ri)}>✕</button>
                </div>
              ))}
              <button type="button" className="admin-btn admin-btn--sm" onClick={() => addRow(yi)}>+ Add Event</button>
            </>
          )}
        </div>
      ))}
      <button type="button" className="admin-btn admin-btn--primary" onClick={addYear}>+ Add Academic Year</button>
      {years.length === 0 && (
        <p className="admin-field__hint">No academic years yet — click "Add Academic Year" to start building this list.</p>
      )}
    </>
  );
}
