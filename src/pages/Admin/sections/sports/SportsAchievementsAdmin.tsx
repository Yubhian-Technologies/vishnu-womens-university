import { useState } from 'react';
import { collection, addDoc, deleteDoc, doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../../../lib/firebase';
import { useOrderedCollection, type WithId } from '../../../../hooks/useCollection';
import ImageUploader from '../../../../components/ImageUploader/ImageUploader';
import { deleteFile, type UploadResult } from '../../../../lib/storage';
import type { SportsAchievementDoc } from '../../../../lib/sportsPage';

type AchievementItem = WithId & SportsAchievementDoc;

const EMPTY: SportsAchievementDoc = { title: '', order: 0, imageUrl: '', storagePath: '' };

// Backs the "Medals & Achievements" cards — just a photo and a name.
export default function SportsAchievementsAdmin() {
  const { docs: achievements, loading } = useOrderedCollection<AchievementItem>('sportsAchievements', 'order');
  const [form, setForm] = useState<SportsAchievementDoc>(EMPTY);
  const [editing, setEditing] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [confirmId, setConfirmId] = useState<string | null>(null);

  const set = (k: string, v: string | number) => setForm((p) => ({ ...p, [k]: v }));
  const handleImage = (r: UploadResult) => setForm((p) => ({ ...p, imageUrl: r.url, storagePath: r.path }));

  const save = async () => {
    if (!form.title.trim()) return alert('Achievement name is required.');
    if (!form.imageUrl) return alert('Please upload a photo.');
    setSaving(true);
    try {
      if (editing) {
        await updateDoc(doc(db, 'sportsAchievements', editing), { ...form });
      } else {
        await addDoc(collection(db, 'sportsAchievements'), {
          ...form,
          order: form.order || achievements.length + 1,
          createdAt: serverTimestamp(),
        });
      }
      setForm(EMPTY);
      setEditing(null);
    } catch (e) {
      alert(`Couldn't save: ${(e as Error).message}`);
    } finally {
      setSaving(false);
    }
  };

  const startEdit = (a: AchievementItem) => {
    setEditing(a.id);
    setForm({ title: a.title, order: a.order, imageUrl: a.imageUrl || '', storagePath: a.storagePath || '' });
  };

  // No native window.confirm() — this admin can run inside a sandboxed
  // webview (e.g. an embedded preview) where confirm()/alert() are blocked
  // and throw instead of showing anything, which made Delete look like it
  // silently did nothing. Confirmation is a plain in-page "Confirm? /
  // Cancel" toggle instead, and the Firestore delete is the sole gate on
  // whether the row disappears — the live onSnapshot listener updates the
  // list the moment it succeeds. Storage cleanup runs after, fire-and-
  // forget, so it can never delay or block the doc removal.
  const remove = async (id: string, storagePath?: string) => {
    setConfirmId(null);
    try {
      await deleteDoc(doc(db, 'sportsAchievements', id));
    } catch (e) {
      alert(`Couldn't delete: ${(e as Error).message}`);
      return;
    }
    if (storagePath) {
      deleteFile(storagePath).catch(() => { /* best-effort */ });
    }
  };

  return (
    <div className="admin-section">
      <div className="admin-card">
        <h2 className="admin-card__title">{editing ? 'Edit Achievement' : 'Add Achievement'}</h2>
        <p className="admin-field__hint" style={{ marginBottom: '1rem' }}>
          Shown as a card in "Medals &amp; Achievements" — just a photo and a name.
        </p>
        <div className="admin-form-grid">
          <div className="admin-field" style={{ gridColumn: '1 / -1', maxWidth: 200 }}>
            <label>Photo *</label>
            <ImageUploader folder="vwu/sports" currentUrl={form.imageUrl} onUploaded={handleImage} label="Upload Photo" />
          </div>
          <div className="admin-field">
            <label htmlFor="field-achievement-title">Achievement Name *</label>
            <input id="field-achievement-title" value={form.title} onChange={(e) => set('title', e.target.value)} placeholder="State Level Badminton Championship (Gold)" />
          </div>
          <div className="admin-field">
            <label htmlFor="field-achievement-order">Display Order</label>
            <input id="field-achievement-order" type="number" value={form.order} onChange={(e) => set('order', Number(e.target.value))} min={0} />
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
        <h2 className="admin-card__title">Achievements ({achievements.length})</h2>
        {loading ? <p className="admin-loading">Loading…</p> : (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead><tr><th>Photo</th><th>Name</th><th>Order</th><th>Actions</th></tr></thead>
              <tbody>
                {achievements.map((a) => (
                  <tr key={a.id}>
                    <td>{a.imageUrl ? <img src={a.imageUrl} alt="" className="admin-table__avatar" /> : '—'}</td>
                    <td>{a.title}</td>
                    <td>{a.order}</td>
                    <td>
                      <button className="admin-btn admin-btn--sm" onClick={() => startEdit(a)}>Edit</button>
                      {confirmId === a.id ? (
                        <>
                          <button className="admin-btn admin-btn--sm admin-btn--danger" onClick={() => remove(a.id, a.storagePath)}>Confirm?</button>
                          <button className="admin-btn admin-btn--sm admin-btn--ghost" onClick={() => setConfirmId(null)}>Cancel</button>
                        </>
                      ) : (
                        <button className="admin-btn admin-btn--sm admin-btn--danger" onClick={() => setConfirmId(a.id)}>Delete</button>
                      )}
                    </td>
                  </tr>
                ))}
                {achievements.length === 0 && <tr><td colSpan={4} className="admin-empty">No achievements yet — add one using the form above.</td></tr>}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
