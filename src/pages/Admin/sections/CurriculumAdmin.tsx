import { useState } from 'react';
import {
  collection, addDoc, deleteDoc, doc, updateDoc, serverTimestamp,
} from 'firebase/firestore';
import { db } from '../../../lib/firebase';
import { useOrderedCollection } from '../../../hooks/useCollection';
import FileUploader from '../../../components/FileUploader/FileUploader';
import { deleteFile, type UploadResult } from '../../../lib/storage';

export interface CurriculumDoc {
  id: string;
  program: string;
  rowLabel: string;
  rowOrder: number;
  regulation: string;
  fileUrl: string;
  storagePath: string;
}

const EMPTY: Omit<CurriculumDoc, 'id'> = {
  program: 'btech', rowLabel: '', rowOrder: 0, regulation: '', fileUrl: '', storagePath: '',
};

const PROGRAMS = [
  { value: 'btech', label: 'B.Tech' },
  { value: 'mtech', label: 'M.Tech' },
  { value: 'mba', label: 'MBA' },
  { value: 'phd', label: 'Ph.D.' },
];

export default function CurriculumAdmin() {
  const { docs: entries, loading } = useOrderedCollection<CurriculumDoc>('curriculum', 'rowOrder');
  const [form, setForm] = useState<Omit<CurriculumDoc, 'id'>>(EMPTY);
  const [editing, setEditing] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const set = (k: string, v: string | number) => setForm((p) => ({ ...p, [k]: v }));
  const handleFile = (r: UploadResult) => setForm((p) => ({ ...p, fileUrl: r.url, storagePath: r.path }));

  const save = async () => {
    if (!form.rowLabel || !form.regulation || !form.fileUrl) {
      return alert('Row label, regulation, and PDF file are required.');
    }
    setSaving(true);
    try {
      if (editing) {
        await updateDoc(doc(db, 'curriculum', editing), { ...form });
      } else {
        await addDoc(collection(db, 'curriculum'), { ...form, createdAt: serverTimestamp() });
      }
      setForm(EMPTY); setEditing(null);
    } catch (e) {
      alert(`Couldn't save: ${(e as Error).message}`);
    } finally { setSaving(false); }
  };

  const startEdit = (c: CurriculumDoc) => {
    setEditing(c.id);
    setForm({
      program: c.program, rowLabel: c.rowLabel, rowOrder: c.rowOrder,
      regulation: c.regulation, fileUrl: c.fileUrl, storagePath: c.storagePath,
    });
  };

  const remove = async (entry: CurriculumDoc) => {
    if (!confirm('Delete this curriculum entry?')) return;
    try {
      await deleteFile(entry.storagePath);
      await deleteDoc(doc(db, 'curriculum', entry.id));
    } catch (e) {
      alert(`Couldn't delete: ${(e as Error).message}`);
    }
  };

  const programLabel = (val: string) => PROGRAMS.find((p) => p.value === val)?.label ?? val;

  return (
    <div className="admin-section">
      <div className="admin-card">
        <h2 className="admin-card__title">{editing ? 'Edit Curriculum Entry' : 'Add Curriculum Entry'}</h2>
        <div className="admin-form-grid">
          <div className="admin-field admin-field--full">
            <label>PDF File *</label>
            <FileUploader folder="vwu/curriculum" currentUrl={form.fileUrl} onUploaded={handleFile} label="Upload PDF" />
          </div>
          <div className="admin-field">
            <label>Program</label>
            <select value={form.program} onChange={(e) => set('program', e.target.value)}>
              {PROGRAMS.map((p) => <option key={p.value} value={p.value}>{p.label}</option>)}
            </select>
          </div>
          <div className="admin-field">
            <label>Row Label *</label>
            <input value={form.rowLabel} onChange={(e) => set('rowLabel', e.target.value)} placeholder="I B.Tech I Sem" />
          </div>
          <div className="admin-field">
            <label>Row Order</label>
            <input type="number" value={form.rowOrder} onChange={(e) => set('rowOrder', Number(e.target.value))} min={0} />
          </div>
          <div className="admin-field">
            <label>Regulation *</label>
            <input value={form.regulation} onChange={(e) => set('regulation', e.target.value)} placeholder="R19" />
          </div>
        </div>
        <div className="admin-form-actions">
          {editing && <button className="admin-btn admin-btn--ghost" onClick={() => { setEditing(null); setForm(EMPTY); }}>Cancel</button>}
          <button className="admin-btn admin-btn--primary" onClick={save} disabled={saving}>
            {saving ? 'Saving…' : editing ? 'Update' : 'Add Entry'}
          </button>
        </div>
      </div>

      <div className="admin-card">
        <h2 className="admin-card__title">All Curriculum Entries ({entries.length})</h2>
        {loading ? <p className="admin-loading">Loading…</p> : (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead><tr><th>Program</th><th>Row Label</th><th>Regulation</th><th>File</th><th>Actions</th></tr></thead>
              <tbody>
                {entries.map((c) => (
                  <tr key={c.id}>
                    <td>{programLabel(c.program)}</td>
                    <td>{c.rowLabel}</td>
                    <td>{c.regulation}</td>
                    <td><a href={c.fileUrl} target="_blank" rel="noopener noreferrer">View</a></td>
                    <td>
                      <button className="admin-btn admin-btn--sm" onClick={() => startEdit(c)}>Edit</button>
                      <button className="admin-btn admin-btn--sm admin-btn--danger" onClick={() => remove(c)}>Delete</button>
                    </td>
                  </tr>
                ))}
                {entries.length === 0 && <tr><td colSpan={5} className="admin-empty">No curriculum entries yet — add one using the form above.</td></tr>}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
