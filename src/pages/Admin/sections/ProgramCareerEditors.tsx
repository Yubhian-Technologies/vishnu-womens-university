import { useEffect, useState } from 'react';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../../../lib/firebase';
import FileUploader from '../../../components/FileUploader/FileUploader';
import type { UploadResult } from '../../../lib/storage';
import type { PlacementYearRecord } from '../../../lib/placementRecords';
import { parsePlacementsFile, dedupePlacementRows, downloadPlacementsTemplate, type PlacementImportResult } from '../../../lib/placementsImport';
import type { InternshipYearRecord } from '../../../lib/internshipRecords';
import { parseInternshipsFile, dedupeInternshipRows, downloadInternshipsTemplate, type InternshipImportResult } from '../../../lib/internshipsImport';
import RndTableEditor, { type RndStructuredTable } from './RndTableEditor';
import type { ProgramDoc, RndLink, NewsletterYear } from './ProgramsAdmin';

// Placements, Internships, Research & Development, and Newsletter — all four
// live in the Academic Departments admin now (per-programme, picked via a
// programme selector there — see DepartmentsAdmin.tsx), not under Programs.
// This is a pure UI relocation: every field/collection/document path below
// is byte-for-byte identical to before the move (still `programs/{id}` doc
// fields: placementYears, internshipYears, rndIntro/rndTableText/
// rndProjectsText/rndLinks/rndStructuredTable, newsletterYears), and the
// public pages (ProgramDetail.tsx/DepartmentDetail.tsx) still read those
// exact same fields, so Quick Links and public rendering are untouched.
//
// Placements/Internships were always self-contained (immediate Firestore
// writes, independent of the old Programs form's "Update Program" button) —
// moved verbatim. R&D/Newsletter used to be staged inside that form's shared
// `useState` and only committed on "Update Program"; since they no longer
// have that shared form to stage in, they now stage locally within their own
// component and commit via their own "Save …" button instead — same
// type-then-save shape the admin already had, just scoped to this section
// instead of the whole programme form.

// Individual student Placement Records for one programme, grouped by
// Academic Year — kept separate from the main programme form/doc's "Update
// Program" save (like the department-wide version this replaces) since
// it's a much bigger, purely tabular dataset per year; every action here
// writes straight to Firestore immediately instead of staging in `form`.
// Scoped to exactly one Academic Year + Department + Programme: the
// programme doc already carries its own `department`, and `placementYears`
// lives on this specific programme's own doc, so B.Tech ECE / B.Tech EVT /
// M.Tech VLSI (all department "ECE") each keep fully independent data. An
// admin adds an Academic Year, imports an Excel/CSV file for it, reviews
// the detected columns + a preview of the parsed rows, then saves;
// re-importing a year later fully replaces that year's previous dataset.
// Columns are never assumed or hardcoded — whatever the uploaded file's
// header row contains is exactly what gets stored and shown.
export function PlacementYearsEditor({ program }: { program: ProgramDoc }) {
  const years = program.placementYears || [];
  const [newYearLabel, setNewYearLabel] = useState('');
  const [previews, setPreviews] = useState<Record<number, PlacementImportResult>>({});
  const [importingYear, setImportingYear] = useState<number | null>(null);
  const [busyYear, setBusyYear] = useState<number | null>(null);
  // Edit Table mode: `editRows` is a working copy of just the one year being
  // edited (`editingYear`'s index) — cell edits/row add/delete only ever
  // touch this local copy until "Save Changes" persists it back onto that
  // same year's `rows`, leaving every other year and this year's `columns`
  // untouched. Nothing here re-runs the Excel/CSV/Word/PDF import path, so a
  // one-cell fix never requires re-uploading the source file.
  const [editingYear, setEditingYear] = useState<number | null>(null);
  const [editRows, setEditRows] = useState<string[][]>([]);
  // Row drag-to-reorder while in Edit Table mode — index of the row currently
  // being dragged, or null when nothing is being dragged.
  const [dragRow, setDragRow] = useState<number | null>(null);

  const persistYears = (next: PlacementYearRecord[]) => updateDoc(doc(db, 'programs', program.id), { placementYears: next });

  const addYear = async () => {
    const label = newYearLabel.trim();
    if (!label) return;
    if (years.some((y) => y.year.trim().toLowerCase() === label.toLowerCase())) {
      alert('That Academic Year already exists for this programme.');
      return;
    }
    try {
      await persistYears([...years, { year: label, columns: [], rows: [] }]);
      setNewYearLabel('');
    } catch (e) {
      alert(`Couldn't add Academic Year: ${(e as Error).message}`);
    }
  };

  const removeYear = async (yi: number) => {
    if (!confirm(`Remove Academic Year "${years[yi].year}" and all its placement records? This cannot be undone.`)) return;
    setBusyYear(yi);
    try {
      await persistYears(years.filter((_, i) => i !== yi));
    } catch (e) {
      alert(`Couldn't remove Academic Year: ${(e as Error).message}`);
    } finally {
      setBusyYear(null);
    }
  };

  const moveYear = async (yi: number, dir: -1 | 1) => {
    const target = yi + dir;
    if (target < 0 || target >= years.length) return;
    const next = [...years];
    [next[yi], next[target]] = [next[target], next[yi]];
    try {
      await persistYears(next);
    } catch (e) {
      alert(`Couldn't reorder: ${(e as Error).message}`);
    }
  };

  const handleFile = async (yi: number, file: File) => {
    setImportingYear(yi);
    try {
      const result = await parsePlacementsFile(file);
      if (result.columns.length === 0 || result.rows.length === 0) {
        alert(
          "Couldn't find any data in that file — for Excel/CSV make sure the first row has column headers, " +
          'for Word make sure the records are in an actual table, and for PDF make sure it has selectable text (not a scanned image).'
        );
        return;
      }
      // Only an exact whole-row duplicate (every column the same) is
      // dropped — a repeated name, registration number, company, etc. on
      // its own is a normal, expected occurrence (e.g. one student with
      // multiple offers) and is left alone.
      const { rows: dedupedRows, removed } = dedupePlacementRows(result.rows);
      const dupWarning = removed > 0
        ? `Skipped ${removed} exact duplicate row${removed === 1 ? '' : 's'} (every column matched another row already in the file).`
        : '';
      const warning = [result.warning, dupWarning].filter(Boolean).join(' ') || undefined;
      setPreviews((p) => ({ ...p, [yi]: { ...result, rows: dedupedRows, warning } }));
    } catch (e) {
      alert(`Couldn't read that file: ${(e as Error).message}`);
    } finally {
      setImportingYear(null);
    }
  };

  const discardPreview = (yi: number) => setPreviews((p) => { const next = { ...p }; delete next[yi]; return next; });

  const savePreview = async (yi: number) => {
    const preview = previews[yi];
    if (!preview) return;
    setBusyYear(yi);
    try {
      const next = years.map((y, i) => (i === yi ? { ...y, columns: preview.columns, rows: preview.rows.map((cells) => ({ cells })) } : y));
      await persistYears(next);
      discardPreview(yi);
    } catch (e) {
      alert(`Couldn't save: ${(e as Error).message}`);
    } finally {
      setBusyYear(null);
    }
  };

  const clearRecords = async (yi: number) => {
    if (!confirm(`Delete the saved placement records for "${years[yi].year}"? The Academic Year itself stays, just empty. This cannot be undone.`)) return;
    setBusyYear(yi);
    try {
      await persistYears(years.map((y, i) => (i === yi ? { ...y, columns: [], rows: [] } : y)));
    } catch (e) {
      alert(`Couldn't delete: ${(e as Error).message}`);
    } finally {
      setBusyYear(null);
    }
  };

  const startEditTable = (yi: number) => {
    setEditingYear(yi);
    setEditRows(years[yi].rows.map((r) => [...r.cells]));
  };

  const cancelEditTable = () => {
    setEditingYear(null);
    setEditRows([]);
  };

  const editCell = (ri: number, ci: number, value: string) => {
    setEditRows((rows) => rows.map((row, i) => (i === ri ? row.map((c, j) => (j === ci ? value : c)) : row)));
  };

  const deleteEditRow = (ri: number) => {
    if (!confirm('Delete this row? This cannot be undone once you save changes.')) return;
    setEditRows((rows) => rows.filter((_, i) => i !== ri));
  };

  const addEditRow = () => {
    if (editingYear === null) return;
    setEditRows((rows) => [...rows, years[editingYear].columns.map(() => '')]);
  };

  const reorderEditRow = (from: number, to: number) => {
    if (from === to) return;
    setEditRows((rows) => {
      const next = [...rows];
      const [moved] = next.splice(from, 1);
      next.splice(to, 0, moved);
      return next;
    });
  };

  const saveEditTable = async () => {
    if (editingYear === null) return;
    const yi = editingYear;
    setBusyYear(yi);
    try {
      const next = years.map((y, i) => (i === yi ? { ...y, rows: editRows.map((cells) => ({ cells })) } : y));
      await persistYears(next);
      setEditingYear(null);
      setEditRows([]);
    } catch (e) {
      alert(`Couldn't save changes: ${(e as Error).message}`);
    } finally {
      setBusyYear(null);
    }
  };

  return (
    <div className="admin-card">
      <h2 className="admin-card__title">Placements — {program.shortName || program.name}</h2>
      <p className="admin-field__hint" style={{ marginBottom: '1rem' }}>
        Add an Academic Year, then upload a file of student placement records for that year — Excel (.xlsx/.xls),
        CSV, Word (.docx, records must be in an actual table), or PDF (records must be selectable text, not a
        scanned image) are all accepted. The first row is treated as column headers — whatever columns the file
        actually has are used as-is, nothing is assumed or hardcoded. On the public page, the 10 highest values in
        whichever column looks like "Package"/"Highest Package"/"CTC" show first for that year, then everyone else
        in the order they were imported. Re-importing a year replaces its previous dataset. Scoped to this exact
        programme only — other programmes in the same department manage their own Academic Years independently.
        A row that's an exact duplicate of another (every column matches) is skipped automatically on import — a
        single column repeating on its own, like a student's name against two different companies, is fine.
      </p>
      <div style={{ marginBottom: '1rem' }}>
        <button type="button" className="admin-btn admin-btn--ghost admin-btn--sm" onClick={downloadPlacementsTemplate}>
          ⬇ Download Excel Template
        </button>
      </div>

      <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginBottom: '1.25rem' }}>
        <input
          value={newYearLabel}
          onChange={(e) => setNewYearLabel(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter') addYear(); }}
          placeholder="e.g. 2025-26"
          style={{ maxWidth: 220 }}
        />
        <button type="button" className="admin-btn admin-btn--primary" onClick={addYear}>+ Add Academic Year</button>
      </div>

      {years.length === 0 && (
        <p className="admin-field__hint">No Academic Years yet — add one above to start importing placement records.</p>
      )}

      {years.map((y, yi) => {
        const preview = previews[yi];
        const displayed = preview
          ? preview
          : y.columns.length > 0
            ? { columns: y.columns, rows: y.rows.map((r) => r.cells) }
            : null;
        const importing = importingYear === yi;
        const busy = busyYear === yi;
        const isEditing = editingYear === yi;

        return (
          <div key={yi} style={{ border: '1.5px solid var(--color-light-gray)', borderRadius: 8, padding: '1rem', marginBottom: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
              <strong style={{ flex: 1, fontSize: '1rem' }}>{y.year}</strong>
              <button type="button" className="admin-btn admin-btn--sm" onClick={() => moveYear(yi, -1)} disabled={yi === 0 || isEditing} title="Move up">↑</button>
              <button type="button" className="admin-btn admin-btn--sm" onClick={() => moveYear(yi, 1)} disabled={yi === years.length - 1 || isEditing} title="Move down">↓</button>
              <button type="button" className="admin-btn admin-btn--sm admin-btn--danger" onClick={() => removeYear(yi)} disabled={busy || isEditing}>Remove Year</button>
            </div>

            {!isEditing && (
              <label className="admin-btn admin-btn--primary" style={{ display: 'inline-block', cursor: importing ? 'default' : 'pointer', opacity: importing ? 0.6 : 1 }}>
                {importing ? 'Reading file…' : 'Import'}
                <input
                  type="file"
                  accept=".xlsx,.xls,.csv,.docx,.pdf"
                  hidden
                  disabled={importing}
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleFile(yi, file);
                    e.target.value = '';
                  }}
                />
              </label>
            )}

            {isEditing ? (
              <>
                <div style={{ margin: '1rem 0' }}>
                  <strong>Detected columns:</strong>{' '}
                  {y.columns.map((c, ci) => (
                    <span key={ci} className="admin-badge" style={{ marginRight: '0.4rem', textTransform: 'none' }}>{c}</span>
                  ))}
                </div>
                <p className="admin-field__hint">
                  Editing {editRows.length} record{editRows.length === 1 ? '' : 's'} — drag <strong>⠿</strong> to
                  reorder rows. Nothing is saved until you click "Save Changes".
                </p>
                <div className="admin-table-wrap" style={{ maxHeight: 420, overflow: 'auto' }}>
                  <table className="admin-table admin-table--editing">
                    <thead>
                      <tr>
                        <th style={{ width: 32 }} />
                        {y.columns.map((c, ci) => <th key={ci}>{c}</th>)}
                        <th style={{ width: 40 }} />
                      </tr>
                    </thead>
                    <tbody>
                      {editRows.map((row, ri) => (
                        <tr
                          key={ri}
                          onDragOver={(e) => { e.preventDefault(); e.dataTransfer.dropEffect = 'move'; }}
                          onDrop={(e) => { e.preventDefault(); if (dragRow !== null) reorderEditRow(dragRow, ri); setDragRow(null); }}
                          style={dragRow === ri ? { opacity: 0.4 } : undefined}
                        >
                          <td
                            className="admin-table__drag-handle"
                            draggable
                            title="Drag to reorder"
                            aria-label="Drag to reorder row"
                            onDragStart={(e) => { e.dataTransfer.effectAllowed = 'move'; setDragRow(ri); }}
                            onDragEnd={() => setDragRow(null)}
                          >
                            ⠿
                          </td>
                          {row.map((cell, ci) => (
                            <td key={ci}>
                              <input
                                className="admin-table__cell-input"
                                value={cell}
                                onChange={(e) => editCell(ri, ci, e.target.value)}
                              />
                            </td>
                          ))}
                          <td>
                            <button
                              type="button"
                              className="admin-table__row-delete"
                              title="Delete row"
                              aria-label="Delete row"
                              onClick={() => deleteEditRow(ri)}
                            >
                              ✕
                            </button>
                          </td>
                        </tr>
                      ))}
                      {editRows.length === 0 && (
                        <tr><td colSpan={y.columns.length + 2} className="admin-field__hint">No rows left — add one below or Cancel to discard.</td></tr>
                      )}
                    </tbody>
                  </table>
                </div>
                <div className="admin-form-actions" style={{ justifyContent: 'space-between' }}>
                  <button type="button" className="admin-btn admin-btn--ghost" onClick={addEditRow}>+ Add Row</button>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button type="button" className="admin-btn admin-btn--ghost" onClick={cancelEditTable} disabled={busy}>Cancel</button>
                    <button type="button" className="admin-btn admin-btn--primary" onClick={saveEditTable} disabled={busy}>
                      {busy ? 'Saving…' : 'Save Changes'}
                    </button>
                  </div>
                </div>
              </>
            ) : displayed && displayed.columns.length > 0 ? (
              <>
                <div style={{ margin: '1rem 0' }}>
                  <strong>Detected columns:</strong>{' '}
                  {displayed.columns.map((c, ci) => (
                    <span key={ci} className="admin-badge" style={{ marginRight: '0.4rem', textTransform: 'none' }}>{c}</span>
                  ))}
                </div>
                <p className="admin-field__hint">
                  {displayed.rows.length} record{displayed.rows.length === 1 ? '' : 's'}{preview ? ' — not yet saved' : ' saved'}.
                </p>
                {preview?.warning && (
                  <p
                    className="admin-field__hint"
                    style={{ background: '#fff8e6', border: '1px solid #f5d78e', borderRadius: 6, padding: '0.6rem 0.9rem', marginBottom: '0.75rem' }}
                  >
                    ℹ️ {preview.warning}
                  </p>
                )}
                <div className="admin-table-wrap" style={{ maxHeight: 320, overflow: 'auto' }}>
                  <table className="admin-table">
                    <thead>
                      <tr>{displayed.columns.map((c, ci) => <th key={ci}>{c}</th>)}</tr>
                    </thead>
                    <tbody>
                      {displayed.rows.slice(0, 25).map((row, ri) => (
                        <tr key={ri}>{row.map((cell, ci) => <td key={ci}>{cell}</td>)}</tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {displayed.rows.length > 25 && (
                  <p className="admin-field__hint">Showing the first 25 of {displayed.rows.length} rows.</p>
                )}
                {preview ? (
                  <div className="admin-form-actions">
                    <button className="admin-btn admin-btn--ghost" onClick={() => discardPreview(yi)}>Discard</button>
                    <button className="admin-btn admin-btn--primary" onClick={() => savePreview(yi)} disabled={busy}>
                      {busy ? 'Saving…' : 'Save Placement Records'}
                    </button>
                  </div>
                ) : (
                  <div className="admin-form-actions">
                    <button className="admin-btn admin-btn--ghost" onClick={() => startEditTable(yi)} disabled={busy}>Edit Table</button>
                    <button className="admin-btn admin-btn--danger" onClick={() => clearRecords(yi)} disabled={busy}>
                      {busy ? 'Deleting…' : 'Delete Records'}
                    </button>
                  </div>
                )}
              </>
            ) : (
              <p className="admin-field__hint" style={{ marginTop: '0.75rem' }}>No placement records imported yet for {y.year}.</p>
            )}
          </div>
        );
      })}
    </div>
  );
}

// Individual student Internship Records for one programme, grouped by
// Academic Year — the exact same shape/pattern as PlacementYearsEditor
// above (see its comment for the full reasoning), just writing to
// `internshipYears` instead of `placementYears`.
export function InternshipYearsEditor({ program }: { program: ProgramDoc }) {
  const years = program.internshipYears || [];
  const [newYearLabel, setNewYearLabel] = useState('');
  const [previews, setPreviews] = useState<Record<number, InternshipImportResult>>({});
  const [importingYear, setImportingYear] = useState<number | null>(null);
  const [busyYear, setBusyYear] = useState<number | null>(null);
  // Edit Table mode: `editRows` is a working copy of just the one year being
  // edited (`editingYear`'s index) — cell edits/row add/delete/reorder only
  // ever touch this local copy until "Save Changes" persists it back onto
  // that same year's `rows`, leaving every other year and this year's
  // `columns` untouched. Nothing here re-runs the Excel/CSV/Word/PDF import
  // path, so a one-cell fix never requires re-uploading the source file.
  const [editingYear, setEditingYear] = useState<number | null>(null);
  const [editRows, setEditRows] = useState<string[][]>([]);
  // Row drag-to-reorder while in Edit Table mode — index of the row currently
  // being dragged, or null when nothing is being dragged.
  const [dragRow, setDragRow] = useState<number | null>(null);

  const persistYears = (next: InternshipYearRecord[]) => updateDoc(doc(db, 'programs', program.id), { internshipYears: next });

  const addYear = async () => {
    const label = newYearLabel.trim();
    if (!label) return;
    if (years.some((y) => y.year.trim().toLowerCase() === label.toLowerCase())) {
      alert('That Academic Year already exists for this programme.');
      return;
    }
    try {
      await persistYears([...years, { year: label, columns: [], rows: [] }]);
      setNewYearLabel('');
    } catch (e) {
      alert(`Couldn't add Academic Year: ${(e as Error).message}`);
    }
  };

  const removeYear = async (yi: number) => {
    if (!confirm(`Remove Academic Year "${years[yi].year}" and all its internship records? This cannot be undone.`)) return;
    setBusyYear(yi);
    try {
      await persistYears(years.filter((_, i) => i !== yi));
    } catch (e) {
      alert(`Couldn't remove Academic Year: ${(e as Error).message}`);
    } finally {
      setBusyYear(null);
    }
  };

  const moveYear = async (yi: number, dir: -1 | 1) => {
    const target = yi + dir;
    if (target < 0 || target >= years.length) return;
    const next = [...years];
    [next[yi], next[target]] = [next[target], next[yi]];
    try {
      await persistYears(next);
    } catch (e) {
      alert(`Couldn't reorder: ${(e as Error).message}`);
    }
  };

  const handleFile = async (yi: number, file: File) => {
    setImportingYear(yi);
    try {
      const result = await parseInternshipsFile(file);
      if (result.columns.length === 0 || result.rows.length === 0) {
        alert(
          "Couldn't find any data in that file — for Excel/CSV make sure the first row has column headers, " +
          'for Word make sure the records are in an actual table, and for PDF make sure it has selectable text (not a scanned image).'
        );
        return;
      }
      // Only an exact whole-row duplicate (every column the same) is
      // dropped — a repeated name, registration number, company, etc. on
      // its own is a normal, expected occurrence (e.g. one student with
      // multiple internships) and is left alone.
      const { rows: dedupedRows, removed } = dedupeInternshipRows(result.rows);
      const dupWarning = removed > 0
        ? `Skipped ${removed} exact duplicate row${removed === 1 ? '' : 's'} (every column matched another row already in the file).`
        : '';
      const warning = [result.warning, dupWarning].filter(Boolean).join(' ') || undefined;
      setPreviews((p) => ({ ...p, [yi]: { ...result, rows: dedupedRows, warning } }));
    } catch (e) {
      alert(`Couldn't read that file: ${(e as Error).message}`);
    } finally {
      setImportingYear(null);
    }
  };

  const discardPreview = (yi: number) => setPreviews((p) => { const next = { ...p }; delete next[yi]; return next; });

  const savePreview = async (yi: number) => {
    const preview = previews[yi];
    if (!preview) return;
    setBusyYear(yi);
    try {
      const next = years.map((y, i) => (i === yi ? { ...y, columns: preview.columns, rows: preview.rows.map((cells) => ({ cells })) } : y));
      await persistYears(next);
      discardPreview(yi);
    } catch (e) {
      alert(`Couldn't save: ${(e as Error).message}`);
    } finally {
      setBusyYear(null);
    }
  };

  const clearRecords = async (yi: number) => {
    if (!confirm(`Delete the saved internship records for "${years[yi].year}"? The Academic Year itself stays, just empty. This cannot be undone.`)) return;
    setBusyYear(yi);
    try {
      await persistYears(years.map((y, i) => (i === yi ? { ...y, columns: [], rows: [] } : y)));
    } catch (e) {
      alert(`Couldn't delete: ${(e as Error).message}`);
    } finally {
      setBusyYear(null);
    }
  };

  const startEditTable = (yi: number) => {
    setEditingYear(yi);
    setEditRows(years[yi].rows.map((r) => [...r.cells]));
  };

  const cancelEditTable = () => {
    setEditingYear(null);
    setEditRows([]);
  };

  const editCell = (ri: number, ci: number, value: string) => {
    setEditRows((rows) => rows.map((row, i) => (i === ri ? row.map((c, j) => (j === ci ? value : c)) : row)));
  };

  const deleteEditRow = (ri: number) => {
    if (!confirm('Delete this row? This cannot be undone once you save changes.')) return;
    setEditRows((rows) => rows.filter((_, i) => i !== ri));
  };

  const addEditRow = () => {
    if (editingYear === null) return;
    setEditRows((rows) => [...rows, years[editingYear].columns.map(() => '')]);
  };

  const reorderEditRow = (from: number, to: number) => {
    if (from === to) return;
    setEditRows((rows) => {
      const next = [...rows];
      const [moved] = next.splice(from, 1);
      next.splice(to, 0, moved);
      return next;
    });
  };

  const saveEditTable = async () => {
    if (editingYear === null) return;
    const yi = editingYear;
    setBusyYear(yi);
    try {
      const next = years.map((y, i) => (i === yi ? { ...y, rows: editRows.map((cells) => ({ cells })) } : y));
      await persistYears(next);
      setEditingYear(null);
      setEditRows([]);
    } catch (e) {
      alert(`Couldn't save changes: ${(e as Error).message}`);
    } finally {
      setBusyYear(null);
    }
  };

  return (
    <div className="admin-card">
      <h2 className="admin-card__title">Internships — {program.shortName || program.name}</h2>
      <p className="admin-field__hint" style={{ marginBottom: '1rem' }}>
        Add an Academic Year, then upload a file of student internship records for that year — Excel (.xlsx/.xls),
        CSV, Word (.docx, records must be in an actual table), or PDF (records must be selectable text, not a
        scanned image) are all accepted. The first row is treated as column headers — whatever columns the file
        actually has are used as-is, nothing is assumed or hardcoded. On the public page, the 10 highest values in
        whichever column looks like "Stipend" show first for that year, then everyone else in the order they were
        imported. Re-importing a year replaces its previous dataset. Scoped to this exact programme only — other
        programmes in the same department manage their own Academic Years independently.
        A row that's an exact duplicate of another (every column matches) is skipped automatically on import — a
        single column repeating on its own, like a student's name against two different companies, is fine.
      </p>
      <div style={{ marginBottom: '1rem' }}>
        <button type="button" className="admin-btn admin-btn--ghost admin-btn--sm" onClick={downloadInternshipsTemplate}>
          ⬇ Download Excel Template
        </button>
      </div>

      <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginBottom: '1.25rem' }}>
        <input
          value={newYearLabel}
          onChange={(e) => setNewYearLabel(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter') addYear(); }}
          placeholder="e.g. 2025-26"
          style={{ maxWidth: 220 }}
        />
        <button type="button" className="admin-btn admin-btn--primary" onClick={addYear}>+ Add Academic Year</button>
      </div>

      {years.length === 0 && (
        <p className="admin-field__hint">No Academic Years yet — add one above to start importing internship records.</p>
      )}

      {years.map((y, yi) => {
        const preview = previews[yi];
        const displayed = preview
          ? preview
          : y.columns.length > 0
            ? { columns: y.columns, rows: y.rows.map((r) => r.cells) }
            : null;
        const importing = importingYear === yi;
        const busy = busyYear === yi;
        const isEditing = editingYear === yi;

        return (
          <div key={yi} style={{ border: '1.5px solid var(--color-light-gray)', borderRadius: 8, padding: '1rem', marginBottom: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
              <strong style={{ flex: 1, fontSize: '1rem' }}>{y.year}</strong>
              <button type="button" className="admin-btn admin-btn--sm" onClick={() => moveYear(yi, -1)} disabled={yi === 0 || isEditing} title="Move up">↑</button>
              <button type="button" className="admin-btn admin-btn--sm" onClick={() => moveYear(yi, 1)} disabled={yi === years.length - 1 || isEditing} title="Move down">↓</button>
              <button type="button" className="admin-btn admin-btn--sm admin-btn--danger" onClick={() => removeYear(yi)} disabled={busy || isEditing}>Remove Year</button>
            </div>

            {!isEditing && (
              <label className="admin-btn admin-btn--primary" style={{ display: 'inline-block', cursor: importing ? 'default' : 'pointer', opacity: importing ? 0.6 : 1 }}>
                {importing ? 'Reading file…' : 'Import'}
                <input
                  type="file"
                  accept=".xlsx,.xls,.csv,.docx,.pdf"
                  hidden
                  disabled={importing}
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleFile(yi, file);
                    e.target.value = '';
                  }}
                />
              </label>
            )}

            {isEditing ? (
              <>
                <div style={{ margin: '1rem 0' }}>
                  <strong>Detected columns:</strong>{' '}
                  {y.columns.map((c, ci) => (
                    <span key={ci} className="admin-badge" style={{ marginRight: '0.4rem', textTransform: 'none' }}>{c}</span>
                  ))}
                </div>
                <p className="admin-field__hint">
                  Editing {editRows.length} record{editRows.length === 1 ? '' : 's'} — drag <strong>⠿</strong> to
                  reorder rows. Nothing is saved until you click "Save Changes".
                </p>
                <div className="admin-table-wrap" style={{ maxHeight: 420, overflow: 'auto' }}>
                  <table className="admin-table admin-table--editing">
                    <thead>
                      <tr>
                        <th style={{ width: 32 }} />
                        {y.columns.map((c, ci) => <th key={ci}>{c}</th>)}
                        <th style={{ width: 40 }} />
                      </tr>
                    </thead>
                    <tbody>
                      {editRows.map((row, ri) => (
                        <tr
                          key={ri}
                          onDragOver={(e) => { e.preventDefault(); e.dataTransfer.dropEffect = 'move'; }}
                          onDrop={(e) => { e.preventDefault(); if (dragRow !== null) reorderEditRow(dragRow, ri); setDragRow(null); }}
                          style={dragRow === ri ? { opacity: 0.4 } : undefined}
                        >
                          <td
                            className="admin-table__drag-handle"
                            draggable
                            title="Drag to reorder"
                            aria-label="Drag to reorder row"
                            onDragStart={(e) => { e.dataTransfer.effectAllowed = 'move'; setDragRow(ri); }}
                            onDragEnd={() => setDragRow(null)}
                          >
                            ⠿
                          </td>
                          {row.map((cell, ci) => (
                            <td key={ci}>
                              <input
                                className="admin-table__cell-input"
                                value={cell}
                                onChange={(e) => editCell(ri, ci, e.target.value)}
                              />
                            </td>
                          ))}
                          <td>
                            <button
                              type="button"
                              className="admin-table__row-delete"
                              title="Delete row"
                              aria-label="Delete row"
                              onClick={() => deleteEditRow(ri)}
                            >
                              ✕
                            </button>
                          </td>
                        </tr>
                      ))}
                      {editRows.length === 0 && (
                        <tr><td colSpan={y.columns.length + 2} className="admin-field__hint">No rows left — add one below or Cancel to discard.</td></tr>
                      )}
                    </tbody>
                  </table>
                </div>
                <div className="admin-form-actions" style={{ justifyContent: 'space-between' }}>
                  <button type="button" className="admin-btn admin-btn--ghost" onClick={addEditRow}>+ Add Row</button>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button type="button" className="admin-btn admin-btn--ghost" onClick={cancelEditTable} disabled={busy}>Cancel</button>
                    <button type="button" className="admin-btn admin-btn--primary" onClick={saveEditTable} disabled={busy}>
                      {busy ? 'Saving…' : 'Save Changes'}
                    </button>
                  </div>
                </div>
              </>
            ) : displayed && displayed.columns.length > 0 ? (
              <>
                <div style={{ margin: '1rem 0' }}>
                  <strong>Detected columns:</strong>{' '}
                  {displayed.columns.map((c, ci) => (
                    <span key={ci} className="admin-badge" style={{ marginRight: '0.4rem', textTransform: 'none' }}>{c}</span>
                  ))}
                </div>
                <p className="admin-field__hint">
                  {displayed.rows.length} record{displayed.rows.length === 1 ? '' : 's'}{preview ? ' — not yet saved' : ' saved'}.
                </p>
                {preview?.warning && (
                  <p
                    className="admin-field__hint"
                    style={{ background: '#fff8e6', border: '1px solid #f5d78e', borderRadius: 6, padding: '0.6rem 0.9rem', marginBottom: '0.75rem' }}
                  >
                    ℹ️ {preview.warning}
                  </p>
                )}
                <div className="admin-table-wrap" style={{ maxHeight: 320, overflow: 'auto' }}>
                  <table className="admin-table">
                    <thead>
                      <tr>{displayed.columns.map((c, ci) => <th key={ci}>{c}</th>)}</tr>
                    </thead>
                    <tbody>
                      {displayed.rows.slice(0, 25).map((row, ri) => (
                        <tr key={ri}>{row.map((cell, ci) => <td key={ci}>{cell}</td>)}</tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {displayed.rows.length > 25 && (
                  <p className="admin-field__hint">Showing the first 25 of {displayed.rows.length} rows.</p>
                )}
                {preview ? (
                  <div className="admin-form-actions">
                    <button className="admin-btn admin-btn--ghost" onClick={() => discardPreview(yi)}>Discard</button>
                    <button className="admin-btn admin-btn--primary" onClick={() => savePreview(yi)} disabled={busy}>
                      {busy ? 'Saving…' : 'Save Internship Records'}
                    </button>
                  </div>
                ) : (
                  <div className="admin-form-actions">
                    <button className="admin-btn admin-btn--ghost" onClick={() => startEditTable(yi)} disabled={busy}>Edit Table</button>
                    <button className="admin-btn admin-btn--danger" onClick={() => clearRecords(yi)} disabled={busy}>
                      {busy ? 'Deleting…' : 'Delete Records'}
                    </button>
                  </div>
                )}
              </>
            ) : (
              <p className="admin-field__hint" style={{ marginTop: '0.75rem' }}>No internship records imported yet for {y.year}.</p>
            )}
          </div>
        );
      })}
    </div>
  );
}

// Research & Development (Funded Projects & Patents) for one programme.
// Was previously staged inside the big Programs form's `useState` and only
// committed when "Update Program" was clicked; now stages locally in this
// component's own state instead (reset from `program` whenever a different
// programme is selected in the department admin's programme picker) and
// commits via its own "Save Research & Development" button — same
// type-then-save shape, just scoped to this section. Fields/shapes on the
// `programs/{id}` doc are unchanged: rndIntro/rndTableText/rndProjectsText/
// rndLinks/rndStructuredTable.
export function RndEditor({ program }: { program: ProgramDoc }) {
  const [rndIntro, setRndIntro] = useState(program.rndIntro || '');
  const [rndTableText, setRndTableText] = useState(program.rndTableText || '');
  const [rndProjectsText, setRndProjectsText] = useState(program.rndProjectsText || '');
  const [rndLinks, setRndLinks] = useState<RndLink[]>(program.rndLinks || []);
  const [rndStructuredTable, setRndStructuredTable] = useState<RndStructuredTable>(program.rndStructuredTable || { columns: [], rows: [] });
  const [dirty, setDirty] = useState(false);
  const [saving, setSaving] = useState(false);

  // Re-sync from the programme whenever a different one is picked in the
  // department admin's selector (or after this programme's own save
  // resolves — no-op there since state already matches).
  useEffect(() => {
    setRndIntro(program.rndIntro || '');
    setRndTableText(program.rndTableText || '');
    setRndProjectsText(program.rndProjectsText || '');
    setRndLinks(program.rndLinks || []);
    setRndStructuredTable(program.rndStructuredTable || { columns: [], rows: [] });
    setDirty(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [program.id]);

  const addRndLink = () => { setRndLinks((l) => [...l, { label: '' }]); setDirty(true); };
  const updateRndLinkLabel = (li: number, label: string) => { setRndLinks((l) => l.map((x, i) => (i === li ? { ...x, label } : x))); setDirty(true); };
  const moveRndLink = (li: number, dir: -1 | 1) => {
    setRndLinks((l) => {
      const target = li + dir;
      if (target < 0 || target >= l.length) return l;
      const next = [...l];
      [next[li], next[target]] = [next[target], next[li]];
      return next;
    });
    setDirty(true);
  };
  const removeRndLink = (li: number) => { setRndLinks((l) => l.filter((_, i) => i !== li)); setDirty(true); };
  const handleRndLinkPdf = (li: number, r: UploadResult) => { setRndLinks((l) => l.map((x, i) => (i === li ? { ...x, pdfUrl: r.url, pdfStoragePath: r.path } : x))); setDirty(true); };
  const removeRndLinkPdf = (li: number) => { setRndLinks((l) => l.map((x, i) => (i === li ? { ...x, pdfUrl: '', pdfStoragePath: '' } : x))); setDirty(true); };

  const save = async () => {
    setSaving(true);
    try {
      await updateDoc(doc(db, 'programs', program.id), { rndIntro, rndTableText, rndProjectsText, rndLinks, rndStructuredTable });
      setDirty(false);
    } catch (e) {
      alert(`Couldn't save: ${(e as Error).message}`);
    } finally {
      setSaving(false);
    }
  };
  const discard = () => {
    setRndIntro(program.rndIntro || '');
    setRndTableText(program.rndTableText || '');
    setRndProjectsText(program.rndProjectsText || '');
    setRndLinks(program.rndLinks || []);
    setRndStructuredTable(program.rndStructuredTable || { columns: [], rows: [] });
    setDirty(false);
  };

  return (
    <div className="admin-card">
      <h2 className="admin-card__title">Research &amp; Development — {program.shortName || program.name}</h2>
      <p className="admin-field__hint" style={{ marginBottom: '1rem' }}>
        Optional. Shown as a "Research &amp; Development (Funded Projects &amp; Patents)" section (and Quick
        Links entry) on this programme's page. Real department R&amp;D pages vary a lot — use whichever of the
        five fields below fit this department's actual content; only the ones you fill in will show.
      </p>
      <div className="admin-field">
        <label htmlFor="field-rnd-intro">Overview (optional)</label>
        <textarea id="field-rnd-intro" rows={3} value={rndIntro} onChange={(e) => { setRndIntro(e.target.value); setDirty(true); }} placeholder="An introductory paragraph, e.g. project background, campus context, or a general statement about the department's research focus." />
      </div>
      <div className="admin-field" style={{ marginTop: '1rem' }}>
        <label>Table (optional — for a flat table like Patents: Application No. | Title | Proof). Start a
          section with <code>## Section Title</code> (optional if there's only one table), then a header row and
          data rows, all pipe-separated — the first line under a section becomes the column headers.</label>
        <textarea
          rows={6}
          value={rndTableText}
          onChange={(e) => { setRndTableText(e.target.value); setDirty(true); }}
          placeholder={'## Patents\nApplication No. | Title | Proof\n202441093677 | Home safety and guidance system... | https://...\n6335941 | Novel Display Design for Immersive VR | https://...'}
        />
      </div>
      <div className="admin-field" style={{ marginTop: '1rem' }}>
        <label>Detailed Project / Patent Cards (optional — for entries with several labeled fields, e.g. a
          granted patent's invention title, patent number, grant date, inventor). Start each category with{' '}
          <code>## Category</code> (e.g. <code>## Patents Granted</code>), each entry with{' '}
          <code>### Title</code>, then <code>Label: value</code> lines for its fields, and{' '}
          <code>- bullet text</code> lines for an optional Outcome list.</label>
        <textarea
          rows={8}
          value={rndProjectsText}
          onChange={(e) => { setRndProjectsText(e.target.value); setDirty(true); }}
          placeholder={'## Funds from AICTE\n### Dictated Note Printer in Braille for Blind with Cyber Physical System\nReference: DST/SEED/TIDE/2023/1131 (C)\nAmount: Rs. 34,24,523/- (2025)\n\n## Patents Granted\n### Machine Learning Based DC-DC Converter\nPatent Number: 202441093677\nApplication Number: 202441093677\nGrant Date: 12-03-2025\nInventor: Dr. G Srinivasa Rao'}
        />
      </div>
      <div className="admin-field" style={{ marginTop: '1rem' }}>
        <label className="admin-field__hint" style={{ display: 'block', marginBottom: '0.5rem' }}>PDF-only Links (optional — for a department that just wants to link out to a couple of PDFs, e.g. "Funded R&amp;D Projects" / "In-house R&amp;D Projects").</label>
        {rndLinks.map((link, li) => (
          <div key={li} style={{ border: '1.5px solid var(--color-light-gray)', borderRadius: 8, padding: '0.75rem', marginBottom: '0.75rem' }}>
            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginBottom: '0.6rem' }}>
              <input
                value={link.label}
                onChange={(e) => updateRndLinkLabel(li, e.target.value)}
                placeholder="Link name, e.g. Funded Project – AICTE RPS 2023"
                style={{ flex: 1, fontWeight: 700 }}
              />
              <button type="button" className="admin-btn admin-btn--sm" onClick={() => moveRndLink(li, -1)} disabled={li === 0} title="Move up">↑</button>
              <button type="button" className="admin-btn admin-btn--sm" onClick={() => moveRndLink(li, 1)} disabled={li === rndLinks.length - 1} title="Move down">↓</button>
              <button type="button" className="admin-btn admin-btn--sm admin-btn--danger" onClick={() => removeRndLink(li)}>Remove Link</button>
            </div>
            <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap' }}>
              <div style={{ maxWidth: 260 }}>
                <FileUploader
                  folder="vwu/programs/rnd"
                  currentUrl={link.pdfUrl}
                  onUploaded={(r) => handleRndLinkPdf(li, r)}
                  label="Upload PDF"
                />
              </div>
              {link.pdfUrl && (
                <button type="button" className="admin-btn admin-btn--ghost admin-btn--sm" onClick={() => removeRndLinkPdf(li)}>
                  Remove PDF
                </button>
              )}
            </div>
          </div>
        ))}
        <button type="button" className="admin-btn admin-btn--primary" onClick={addRndLink}>+ Add Link</button>
        {rndLinks.length === 0 && (
          <p className="admin-field__hint">No links yet — click "Add Link" to start building this programme's Research &amp; Development list.</p>
        )}
      </div>
      <div className="admin-field" style={{ marginTop: '1rem' }}>
        <label className="admin-field__hint" style={{ display: 'block', marginBottom: '0.5rem' }}>
          Structured Table (optional — a table with columns you add yourself, where each row also has its own
          uploaded PDF, e.g. a Patents table where every row links to that patent's own document).
        </label>
        <RndTableEditor
          table={rndStructuredTable}
          onChange={(t) => { setRndStructuredTable(t); setDirty(true); }}
        />
      </div>
      <div className="admin-form-actions">
        <button type="button" className="admin-btn admin-btn--ghost" onClick={discard} disabled={!dirty || saving}>Cancel</button>
        <button type="button" className="admin-btn admin-btn--primary" onClick={save} disabled={!dirty || saving}>
          {saving ? 'Saving…' : 'Save Research & Development'}
        </button>
      </div>
    </div>
  );
}

// Newsletter for one programme. Same relocation/staging notes as RndEditor
// above — writes to the same `programs/{id}.newsletterYears` field as
// before.
export function NewsletterYearsEditor({ program }: { program: ProgramDoc }) {
  const [years, setYears] = useState<NewsletterYear[]>(program.newsletterYears || []);
  const [dirty, setDirty] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setYears(program.newsletterYears || []);
    setDirty(false);
  }, [program.id]);

  const update = (next: NewsletterYear[]) => { setYears(next); setDirty(true); };

  const addNewsletterYear = () => update([...years, { year: '', issues: [] }]);
  const updateNewsletterYearLabel = (yi: number, year: string) => update(years.map((y, i) => (i === yi ? { ...y, year } : y)));
  const moveNewsletterYear = (yi: number, dir: -1 | 1) => {
    const next = [...years];
    const target = yi + dir;
    if (target < 0 || target >= next.length) return;
    [next[yi], next[target]] = [next[target], next[yi]];
    update(next);
  };
  const removeNewsletterYear = (yi: number) => update(years.filter((_, i) => i !== yi));
  const addNewsletterIssue = (yi: number) => update(years.map((y, i) => (i !== yi ? y : { ...y, issues: [...y.issues, {}] })));
  const handleNewsletterIssuePdf = (yi: number, ii: number, r: UploadResult) => update(years.map((y, i) => (i !== yi ? y : {
    ...y,
    issues: y.issues.map((iss, j) => (j === ii ? { ...iss, pdfUrl: r.url, pdfStoragePath: r.path } : iss)),
  })));
  const removeNewsletterIssuePdf = (yi: number, ii: number) => update(years.map((y, i) => (i !== yi ? y : {
    ...y,
    issues: y.issues.map((iss, j) => (j === ii ? { ...iss, pdfUrl: '', pdfStoragePath: '' } : iss)),
  })));
  const moveNewsletterIssue = (yi: number, ii: number, dir: -1 | 1) => {
    update(years.map((y, i) => {
      if (i !== yi) return y;
      const issues = [...y.issues];
      const target = ii + dir;
      if (target < 0 || target >= issues.length) return y;
      [issues[ii], issues[target]] = [issues[target], issues[ii]];
      return { ...y, issues };
    }));
  };
  const removeNewsletterIssue = (yi: number, ii: number) => update(years.map((y, i) => (i === yi ? { ...y, issues: y.issues.filter((_, j) => j !== ii) } : y)));

  const save = async () => {
    setSaving(true);
    try {
      await updateDoc(doc(db, 'programs', program.id), { newsletterYears: years });
      setDirty(false);
    } catch (e) {
      alert(`Couldn't save: ${(e as Error).message}`);
    } finally {
      setSaving(false);
    }
  };
  const discard = () => { setYears(program.newsletterYears || []); setDirty(false); };

  return (
    <div className="admin-card">
      <h2 className="admin-card__title">Newsletter — {program.shortName || program.name}</h2>
      <p className="admin-field__hint" style={{ marginBottom: '1rem' }}>
        Optional. Shown as a "Newsletter" section (and Quick Links entry) on this programme's page. Add an
        academic year, then upload a PDF for each issue under it — "Issue – 1", "Issue – 2", etc. are
        numbered automatically by position, so removing one just shifts the rest down.
      </p>
      {years.map((yr, yi) => (
        <div key={yi} style={{ border: '1.5px solid var(--color-light-gray)', borderRadius: 8, padding: '0.75rem', marginBottom: '0.75rem' }}>
          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginBottom: '0.75rem' }}>
            <input
              value={yr.year}
              onChange={(e) => updateNewsletterYearLabel(yi, e.target.value)}
              placeholder="2025-26"
              style={{ flex: 1, fontWeight: 700 }}
            />
            <button type="button" className="admin-btn admin-btn--sm" onClick={() => moveNewsletterYear(yi, -1)} disabled={yi === 0} title="Move up">↑</button>
            <button type="button" className="admin-btn admin-btn--sm" onClick={() => moveNewsletterYear(yi, 1)} disabled={yi === years.length - 1} title="Move down">↓</button>
            <button type="button" className="admin-btn admin-btn--sm admin-btn--danger" onClick={() => removeNewsletterYear(yi)}>Remove Year</button>
          </div>

          {yr.issues.map((issue, ii) => (
            <div key={ii} style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', marginBottom: '0.6rem', flexWrap: 'wrap' }}>
              <strong style={{ minWidth: 70 }}>Issue – {ii + 1}</strong>
              <div style={{ maxWidth: 260 }}>
                <FileUploader
                  folder="vwu/programs/newsletter"
                  currentUrl={issue.pdfUrl}
                  onUploaded={(r) => handleNewsletterIssuePdf(yi, ii, r)}
                  label="Upload PDF"
                />
              </div>
              {issue.pdfUrl && (
                <button type="button" className="admin-btn admin-btn--ghost admin-btn--sm" onClick={() => removeNewsletterIssuePdf(yi, ii)}>
                  Remove PDF
                </button>
              )}
              <button type="button" className="admin-btn admin-btn--sm" onClick={() => moveNewsletterIssue(yi, ii, -1)} disabled={ii === 0} title="Move up">↑</button>
              <button type="button" className="admin-btn admin-btn--sm" onClick={() => moveNewsletterIssue(yi, ii, 1)} disabled={ii === yr.issues.length - 1} title="Move down">↓</button>
              <button type="button" className="admin-btn admin-btn--sm admin-btn--danger" onClick={() => removeNewsletterIssue(yi, ii)}>Remove Issue</button>
            </div>
          ))}
          <button type="button" className="admin-btn admin-btn--sm" onClick={() => addNewsletterIssue(yi)}>+ Add Issue</button>
        </div>
      ))}
      <button type="button" className="admin-btn admin-btn--primary" onClick={addNewsletterYear}>+ Add Academic Year</button>
      {years.length === 0 && (
        <p className="admin-field__hint">No academic years yet — click "Add Academic Year" to start building this programme's Newsletter.</p>
      )}
      <div className="admin-form-actions">
        <button type="button" className="admin-btn admin-btn--ghost" onClick={discard} disabled={!dirty || saving}>Cancel</button>
        <button type="button" className="admin-btn admin-btn--primary" onClick={save} disabled={!dirty || saving}>
          {saving ? 'Saving…' : 'Save Newsletter'}
        </button>
      </div>
    </div>
  );
}
