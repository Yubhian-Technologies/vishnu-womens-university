import { useState } from 'react';
import { collection, addDoc, deleteDoc, doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../../lib/firebase';
import { useOrderedCollection } from '../../../hooks/useCollection';
import FileUploader from '../../../components/FileUploader/FileUploader';
import ImageUploader from '../../../components/ImageUploader/ImageUploader';
import { deleteFile, type UploadResult } from '../../../lib/storage';

// Shown as a card on the Vehicle Design Lab page's "Student Achievements &
// Motorsport Placements" section (photo + description), with an optional
// PDF report attached — a card doesn't need every field, so only `label`
// is required.
export interface VdlAchievementReportDoc {
  id: string;
  label: string;
  description: string;
  imageUrl: string;
  imageStoragePath: string;
  fileUrl: string;
  storagePath: string;
  order: number;
}

const EMPTY: Omit<VdlAchievementReportDoc, 'id'> = {
  label: '', description: '', imageUrl: '', imageStoragePath: '', fileUrl: '', storagePath: '', order: 0,
};

export default function VdlAchievementsAdmin() {
  const { docs, loading } = useOrderedCollection<VdlAchievementReportDoc>('vdlAchievementReports', 'order');
  const [form, setForm] = useState<Omit<VdlAchievementReportDoc, 'id'>>(EMPTY);
  const [editing, setEditing] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [confirmId, setConfirmId] = useState<string | null>(null);

  const set = (k: string, v: string | number) => setForm((p) => ({ ...p, [k]: v }));
  const handleFile = (r: UploadResult) => setForm((p) => ({ ...p, fileUrl: r.url, storagePath: r.path }));
  const handleImage = (r: UploadResult) => setForm((p) => ({ ...p, imageUrl: r.url, imageStoragePath: r.path }));

  const save = async () => {
    if (!form.label.trim()) return alert('Label is required.');
    setSaving(true);
    try {
      if (editing) {
        await updateDoc(doc(db, 'vdlAchievementReports', editing), { ...form });
      } else {
        await addDoc(collection(db, 'vdlAchievementReports'), { ...form, order: form.order || docs.length + 1, createdAt: serverTimestamp() });
      }
      setForm(EMPTY); setEditing(null);
    } catch (e) {
      alert(`Couldn't save: ${(e as Error).message}`);
    } finally { setSaving(false); }
  };

  const startEdit = (d: VdlAchievementReportDoc) => {
    setEditing(d.id);
    setForm({
      label: d.label, description: d.description || '',
      imageUrl: d.imageUrl || '', imageStoragePath: d.imageStoragePath || '',
      fileUrl: d.fileUrl || '', storagePath: d.storagePath || '', order: d.order,
    });
  };

  // No native window.confirm() — this admin can run inside a sandboxed
  // webview where confirm()/alert() are blocked and throw instead of
  // showing anything, which makes Delete look like it silently does
  // nothing. Confirmation is an in-page "Confirm? / Cancel" toggle instead.
  const remove = async (id: string, storagePath?: string, imageStoragePath?: string) => {
    setConfirmId(null);
    try {
      await deleteDoc(doc(db, 'vdlAchievementReports', id));
    } catch (e) {
      alert(`Couldn't delete: ${(e as Error).message}`);
      return;
    }
    if (storagePath) deleteFile(storagePath).catch(() => { /* best-effort */ });
    if (imageStoragePath) deleteFile(imageStoragePath).catch(() => { /* best-effort */ });
  };

  return (
    <div className="admin-section">
      <div className="admin-card">
        <h2 className="admin-card__title">{editing ? 'Edit Achievement' : 'Add Achievement'}</h2>
        <p className="admin-lead" style={{ marginBottom: '1rem' }}>
          Shown as a card in "Student Achievements &amp; Motorsport Placements" on the Vehicle Design Lab page —
          a photo and description, with an optional PDF report attached. Only the label is required.
        </p>
        <div className="admin-form-grid">
          <div className="admin-field">
            <label htmlFor="field-label">Label *</label>
            <input id="field-label" value={form.label} onChange={(e) => set('label', e.target.value)} placeholder="ME-VDL Achievements 2025-26" />
          </div>
          <div className="admin-field">
            <label htmlFor="field-display-order">Display Order</label>
            <input id="field-display-order" type="number" value={form.order} onChange={(e) => set('order', Number(e.target.value))} min={0} />
          </div>
          <div className="admin-field admin-field--full">
            <label htmlFor="field-description">Description</label>
            <textarea id="field-description" value={form.description} onChange={(e) => set('description', e.target.value)} placeholder="Describe the achievement, competition, or placement highlight" rows={3} />
          </div>
          <div className="admin-field" style={{ maxWidth: 220 }}>
            <label>Photo (optional)</label>
            <ImageUploader folder="vwu/vdl/achievements" currentUrl={form.imageUrl} onUploaded={handleImage} label="Upload Photo" />
          </div>
          <div className="admin-field admin-field--full">
            <label>PDF Report (optional)</label>
            <FileUploader folder="vwu/vdl/achievements" currentUrl={form.fileUrl} onUploaded={handleFile} label="Upload PDF" />
          </div>
        </div>
        <div className="admin-form-actions">
          {editing && <button className="admin-btn admin-btn--ghost" onClick={() => { setEditing(null); setForm(EMPTY); }}>Cancel</button>}
          <button className="admin-btn admin-btn--primary" onClick={save} disabled={saving}>
            {saving ? 'Saving…' : editing ? 'Update' : 'Add Achievement'}
          </button>
        </div>
      </div>

      <div className="admin-card">
        <h2 className="admin-card__title">Achievements ({docs.length})</h2>
        {loading ? <p className="admin-loading">Loading…</p> : (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead><tr><th>Photo</th><th>Order</th><th>Label</th><th>Report</th><th>Actions</th></tr></thead>
              <tbody>
                {docs.map((d) => (
                  <tr key={d.id}>
                    <td>{d.imageUrl ? <img src={d.imageUrl} alt="" className="admin-table__avatar" /> : '—'}</td>
                    <td>{d.order}</td>
                    <td>{d.label}</td>
                    <td>{d.fileUrl ? <a href={d.fileUrl} target="_blank" rel="noopener noreferrer">View</a> : '—'}</td>
                    <td>
                      <button className="admin-btn admin-btn--sm" onClick={() => startEdit(d)}>Edit</button>
                      {confirmId === d.id ? (
                        <>
                          <button className="admin-btn admin-btn--sm admin-btn--danger" onClick={() => remove(d.id, d.storagePath, d.imageStoragePath)}>Confirm?</button>
                          <button className="admin-btn admin-btn--sm admin-btn--ghost" onClick={() => setConfirmId(null)}>Cancel</button>
                        </>
                      ) : (
                        <button className="admin-btn admin-btn--sm admin-btn--danger" onClick={() => setConfirmId(d.id)}>Delete</button>
                      )}
                    </td>
                  </tr>
                ))}
                {docs.length === 0 && <tr><td colSpan={5} className="admin-empty">No achievements yet.</td></tr>}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
