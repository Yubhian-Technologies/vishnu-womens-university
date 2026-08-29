import { useState } from 'react';
import { collection, addDoc, deleteDoc, doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../../lib/firebase';
import { useOrderedCollection } from '../../../hooks/useCollection';
import FileUploader from '../../../components/FileUploader/FileUploader';
import { deleteFile, type UploadResult } from '../../../lib/storage';

// Each program/year (I B.Tech, II M.Tech, ...) publishes its own academic
// calendar as a signed PDF rather than a flat list of dates — this stores
// one uploaded PDF per program, same upload-and-link pattern as
// ComplianceDocsAdmin, rather than trying to keep a hand-typed event/date
// table in sync with those PDFs.
export type CalendarCategory = 'btech' | 'mtech' | 'mba';

export const CALENDAR_CATEGORIES: { id: CalendarCategory; label: string }[] = [
  { id: 'btech', label: 'B.Tech' },
  { id: 'mtech', label: 'M.Tech' },
  { id: 'mba', label: 'MBA' },
];

export interface CalendarEntry {
  id: string;
  category: CalendarCategory;
  label: string;
  fileUrl: string;
  storagePath: string;
  order: number;
}

const EMPTY: Omit<CalendarEntry, 'id'> = { category: 'btech', label: '', fileUrl: '', storagePath: '', order: 0 };

// Guesses the Program from what's typed into Label (e.g. "I M.Tech" -> mtech)
// so the dropdown — which defaults to B.Tech — doesn't silently stay wrong
// when someone forgets to touch it after typing an M.Tech/MBA label.
function guessCategory(label: string): CalendarCategory | null {
  const l = label.toLowerCase();
  if (l.includes('mba')) return 'mba';
  if (l.includes('m.tech') || l.includes('mtech')) return 'mtech';
  if (l.includes('b.tech') || l.includes('btech')) return 'btech';
  return null;
}

export default function AcademicCalendarAdmin() {
  const { docs: entries, loading } = useOrderedCollection<CalendarEntry>('academicCalendar', 'order');
  const [form, setForm] = useState<Omit<CalendarEntry, 'id'>>(EMPTY);
  const [editing, setEditing] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [filterCategory, setFilterCategory] = useState<'all' | CalendarCategory>('all');
  // Once the Program dropdown is touched directly, stop overriding it from
  // the label — only auto-follows until the user makes their own choice.
  const [categoryTouched, setCategoryTouched] = useState(false);

  const set = (k: string, v: string | number) => setForm((p) => ({ ...p, [k]: v }));
  const setLabel = (label: string) => setForm((p) => ({ ...p, label, category: !categoryTouched ? guessCategory(label) || p.category : p.category }));
  const setCategory = (category: CalendarCategory) => { setCategoryTouched(true); setForm((p) => ({ ...p, category })); };
  const handleFile = (r: UploadResult) => setForm((p) => ({ ...p, fileUrl: r.url, storagePath: r.path }));

  const save = async () => {
    if (!form.label || !form.fileUrl) return alert('Label and a PDF are required.');
    setSaving(true);
    try {
      if (editing) {
        await updateDoc(doc(db, 'academicCalendar', editing), { ...form });
      } else {
        await addDoc(collection(db, 'academicCalendar'), { ...form, order: form.order || entries.length + 1, createdAt: serverTimestamp() });
      }
      setForm(EMPTY); setEditing(null); setCategoryTouched(false);
    } catch (e) {
      alert(`Couldn't save: ${(e as Error).message}`);
    } finally { setSaving(false); }
  };

  const startEdit = (e: CalendarEntry) => {
    setEditing(e.id);
    setForm({ category: e.category || 'btech', label: e.label, fileUrl: e.fileUrl, storagePath: e.storagePath || '', order: e.order });
    setCategoryTouched(true); // editing an existing entry — don't second-guess its saved category
  };

  const filtered = filterCategory === 'all' ? entries : entries.filter((e) => e.category === filterCategory);

  const remove = async (id: string, storagePath?: string) => {
    if (!confirm('Delete this calendar PDF?')) return;
    try {
      if (storagePath) await deleteFile(storagePath);
      await deleteDoc(doc(db, 'academicCalendar', id));
    } catch (e) {
      alert(`Couldn't delete: ${(e as Error).message}`);
    }
  };

  return (
    <div className="admin-section">
      <div className="admin-card">
        <h2 className="admin-card__title">{editing ? 'Edit Calendar PDF' : 'Add Calendar PDF'}</h2>
        <p className="admin-lead" style={{ marginBottom: '1rem' }}>
          One entry per program/year (e.g. "I B.Tech", "II M.Tech") — visitors click through from the
          Information page straight to the uploaded PDF.
        </p>
        <div className="admin-form-grid">
          <div className="admin-field">
            <label htmlFor="field-category">Program *</label>
            <select id="field-category" value={form.category} onChange={(e) => setCategory(e.target.value as CalendarCategory)}>
              {CALENDAR_CATEGORIES.map((c) => <option key={c.id} value={c.id}>{c.label}</option>)}
            </select>
          </div>
          <div className="admin-field">
            <label htmlFor="field-label">Label *</label>
            <input id="field-label" value={form.label} onChange={(e) => setLabel(e.target.value)} placeholder="I B.Tech" />
          </div>
          <div className="admin-field admin-field--full">
            <label>Calendar PDF *</label>
            <FileUploader folder="vwu/academic-calendar" currentUrl={form.fileUrl} onUploaded={handleFile} label="Upload PDF" />
          </div>
          <div className="admin-field">
            <label htmlFor="field-display-order">Display Order</label>
            <input id="field-display-order" type="number" value={form.order} onChange={(e) => set('order', +e.target.value)} min={0} />
          </div>
        </div>
        <div className="admin-form-actions">
          {editing && <button className="admin-btn admin-btn--ghost" onClick={() => { setEditing(null); setForm(EMPTY); setCategoryTouched(false); }}>Cancel</button>}
          <button className="admin-btn admin-btn--primary" onClick={save} disabled={saving}>{saving ? 'Saving…' : editing ? 'Update' : 'Add Entry'}</button>
        </div>
      </div>

      <div className="admin-card">
        <div className="admin-card__toolbar">
          <h2 className="admin-card__title">Academic Calendar ({filtered.length})</h2>
          <select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value as 'all' | CalendarCategory)} className="admin-select-sm">
            <option value="all">All Programs</option>
            {CALENDAR_CATEGORIES.map((c) => <option key={c.id} value={c.id}>{c.label}</option>)}
          </select>
        </div>
        {loading ? <p className="admin-loading">Loading…</p> : (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead><tr><th>Order</th><th>Program</th><th>Label</th><th>File</th><th>Actions</th></tr></thead>
              <tbody>
                {filtered.map((e) => (
                  <tr key={e.id}>
                    <td>{e.order}</td>
                    <td>{CALENDAR_CATEGORIES.find((c) => c.id === e.category)?.label || e.category}</td>
                    <td>{e.label}</td>
                    <td><a href={e.fileUrl} target="_blank" rel="noopener noreferrer">View</a></td>
                    <td>
                      <button className="admin-btn admin-btn--sm" onClick={() => startEdit(e)}>Edit</button>
                      <button className="admin-btn admin-btn--sm admin-btn--danger" onClick={() => remove(e.id, e.storagePath)}>Delete</button>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && <tr><td colSpan={5} className="admin-empty">No calendar PDFs yet.</td></tr>}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
