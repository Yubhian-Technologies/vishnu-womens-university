import { useRef, useState } from 'react';
import { collection, addDoc, deleteDoc, doc, updateDoc, writeBatch, serverTimestamp } from 'firebase/firestore';
import { db } from '../../../lib/firebase';
import { useOrderedCollection } from '../../../hooks/useCollection';

export interface HolidayEntry {
  id: string;
  name: string;
  date: string;
  order: number;
}

const EMPTY: Omit<HolidayEntry, 'id'> = { name: '', date: '', order: 0 };

const CSV_TEMPLATE_ROWS = [
  ['name', 'date', 'order'],
  ['Ugadi (Telugu New Year)', 'March 30, 2026', '1'],
  ['Independence Day', 'August 15, 2026', '2'],
];

// Minimal RFC4180-style parser — dates like "March 30, 2026" contain a comma, so a naive split(',') would break.
function parseCSV(text: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let field = '';
  let inQuotes = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (inQuotes) {
      if (c === '"') {
        if (text[i + 1] === '"') { field += '"'; i++; } else inQuotes = false;
      } else field += c;
    } else if (c === '"') inQuotes = true;
    else if (c === ',') { row.push(field); field = ''; }
    else if (c === '\n' || c === '\r') {
      if (c === '\r' && text[i + 1] === '\n') i++;
      row.push(field); field = '';
      if (row.some((f) => f.trim() !== '')) rows.push(row);
      row = [];
    } else field += c;
  }
  if (field !== '' || row.length) { row.push(field); rows.push(row); }
  return rows;
}

function toCSVField(v: string): string {
  return /[",\n]/.test(v) ? `"${v.replace(/"/g, '""')}"` : v;
}

function downloadCSV(filename: string, rows: string[][]) {
  const csv = rows.map((r) => r.map(toCSVField).join(',')).join('\r\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export default function HolidaysAdmin() {
  const { docs: holidays, loading } = useOrderedCollection<HolidayEntry>('holidays', 'order');
  const [form, setForm] = useState<Omit<HolidayEntry, 'id'>>(EMPTY);
  const [editing, setEditing] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [importing, setImporting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const set = (k: string, v: string | number) => setForm((p) => ({ ...p, [k]: v }));

  const save = async () => {
    if (!form.name || !form.date) return alert('Name and date are required.');
    setSaving(true);
    try {
      if (editing) {
        await updateDoc(doc(db, 'holidays', editing), { ...form });
      } else {
        await addDoc(collection(db, 'holidays'), { ...form, order: form.order || holidays.length + 1, createdAt: serverTimestamp() });
      }
      setForm(EMPTY); setEditing(null);
    } catch (e) {
      alert(`Couldn't save: ${(e as Error).message}`);
    } finally { setSaving(false); }
  };

  const startEdit = (h: HolidayEntry) => { setEditing(h.id); setForm({ name: h.name, date: h.date, order: h.order }); };

  const remove = async (id: string) => {
    if (!confirm('Delete this holiday?')) return;
    try {
      await deleteDoc(doc(db, 'holidays', id));
    } catch (e) {
      alert(`Couldn't delete: ${(e as Error).message}`);
    }
  };

  const handleImportFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;

    const rows = parseCSV(await file.text());
    if (rows.length < 2) return alert('CSV has no data rows.');
    const [header, ...dataRows] = rows;
    const col = {
      name: header.findIndex((h) => h.trim().toLowerCase() === 'name'),
      date: header.findIndex((h) => h.trim().toLowerCase() === 'date'),
      order: header.findIndex((h) => h.trim().toLowerCase() === 'order'),
    };
    if (col.name === -1 || col.date === -1) return alert('CSV must have "name" and "date" columns.');

    const parsed = dataRows
      .filter((r) => r.some((f) => f.trim() !== ''))
      .map((r, i) => ({
        name: r[col.name]?.trim() || '',
        date: r[col.date]?.trim() || '',
        order: col.order !== -1 && r[col.order]?.trim() ? +r[col.order] : i + 1,
      }));
    if (parsed.length === 0) return alert('No valid rows found in CSV.');
    if (parsed.some((p) => !p.name || !p.date)) return alert('Every row needs a name and date.');

    if (!confirm(`This replaces all ${holidays.length} existing holiday(s) with ${parsed.length} from the CSV. Continue?`)) return;

    setImporting(true);
    try {
      const batch = writeBatch(db);
      holidays.forEach((h) => batch.delete(doc(db, 'holidays', h.id)));
      parsed.forEach((p) => batch.set(doc(collection(db, 'holidays')), { ...p, createdAt: serverTimestamp() }));
      await batch.commit();
    } catch (err) {
      alert(`Import failed: ${(err as Error).message}`);
    } finally {
      setImporting(false);
    }
  };

  return (
    <div className="admin-section">
      <div className="admin-card">
        <h2 className="admin-card__title">Bulk Import / Export</h2>
        <p className="admin-lead" style={{ marginBottom: '1rem' }}>
          Importing a CSV replaces the entire holiday list — there's only ever one active list at a time.
        </p>
        <div className="admin-form-actions" style={{ justifyContent: 'flex-start' }}>
          <button className="admin-btn admin-btn--ghost" onClick={() => downloadCSV('holidays-template.csv', CSV_TEMPLATE_ROWS)}>
            Download CSV Template
          </button>
          <button className="admin-btn admin-btn--primary" onClick={() => fileInputRef.current?.click()} disabled={importing}>
            {importing ? 'Importing…' : 'Import CSV (replaces all)'}
          </button>
          <input ref={fileInputRef} type="file" accept=".csv,text/csv" onChange={handleImportFile} style={{ display: 'none' }} />
        </div>
      </div>

      <div className="admin-card">
        <h2 className="admin-card__title">{editing ? 'Edit Holiday' : 'Add Holiday'}</h2>
        <p className="admin-lead" style={{ marginBottom: '1rem' }}>Date must be in "Month Day, Year" format (e.g. "March 30, 2026") — the public page parses the month and day out of this string.</p>
        <div className="admin-form-grid">
          <div className="admin-field">
            <label htmlFor="field-holiday-name">Holiday Name *</label>
            <input id="field-holiday-name" value={form.name} onChange={(e) => set('name', e.target.value)} placeholder="Ugadi (Telugu New Year)" />
          </div>
          <div className="admin-field">
            <label htmlFor="field-date">Date *</label>
            <input id="field-date" value={form.date} onChange={(e) => set('date', e.target.value)} placeholder="March 30, 2026" />
          </div>
          <div className="admin-field">
            <label htmlFor="field-display-order">Display Order</label>
            <input id="field-display-order" type="number" value={form.order} onChange={(e) => set('order', +e.target.value)} min={0} />
          </div>
        </div>
        <div className="admin-form-actions">
          {editing && <button className="admin-btn admin-btn--ghost" onClick={() => { setEditing(null); setForm(EMPTY); }}>Cancel</button>}
          <button className="admin-btn admin-btn--primary" onClick={save} disabled={saving}>{saving ? 'Saving…' : editing ? 'Update' : 'Add Holiday'}</button>
        </div>
      </div>

      <div className="admin-card">
        <h2 className="admin-card__title">Holidays ({holidays.length})</h2>
        {loading ? <p className="admin-loading">Loading…</p> : (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead><tr><th>Order</th><th>Name</th><th>Date</th><th>Actions</th></tr></thead>
              <tbody>
                {holidays.map((h) => (
                  <tr key={h.id}>
                    <td>{h.order}</td>
                    <td>{h.name}</td>
                    <td>{h.date}</td>
                    <td>
                      <button className="admin-btn admin-btn--sm" onClick={() => startEdit(h)}>Edit</button>
                      <button className="admin-btn admin-btn--sm admin-btn--danger" onClick={() => remove(h.id)}>Delete</button>
                    </td>
                  </tr>
                ))}
                {holidays.length === 0 && <tr><td colSpan={4} className="admin-empty">No holidays yet.</td></tr>}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
