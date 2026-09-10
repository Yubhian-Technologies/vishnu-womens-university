import { useState } from 'react';
import { collection, addDoc, deleteDoc, doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../../../lib/firebase';
import { useOrderedCollection, type WithId } from '../../../../hooks/useCollection';
import ImageUploader from '../../../../components/ImageUploader/ImageUploader';
import { deleteFile, type UploadResult } from '../../../../lib/storage';
import type { SportsTournamentDoc } from '../../../../lib/sportsPage';

type TournamentItem = WithId & SportsTournamentDoc;

const EMPTY: SportsTournamentDoc = { title: '', imageUrl: '', storagePath: '', order: 0 };

export default function SportsTournamentAdmin() {
  const { docs: items, loading } = useOrderedCollection<TournamentItem>('sportsTournaments', 'order');
  const [form, setForm] = useState<SportsTournamentDoc>(EMPTY);
  const [editing, setEditing] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [confirmId, setConfirmId] = useState<string | null>(null);

  const set = (k: string, v: string | number) => setForm((p) => ({ ...p, [k]: v }));
  const handleImage = (r: UploadResult) => setForm((p) => ({ ...p, imageUrl: r.url, storagePath: r.path }));

  const save = async () => {
    if (!form.title.trim()) return alert('Tournament name is required.');
    if (!form.imageUrl) return alert('Please upload a photo.');
    setSaving(true);
    try {
      if (editing) {
        await updateDoc(doc(db, 'sportsTournaments', editing), { ...form });
      } else {
        await addDoc(collection(db, 'sportsTournaments'), {
          ...form,
          order: form.order || items.length + 1,
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

  const startEdit = (item: TournamentItem) => {
    setEditing(item.id);
    setForm({ title: item.title, imageUrl: item.imageUrl, storagePath: item.storagePath || '', order: item.order });
  };

  // No native window.confirm() — this admin can run inside a sandboxed
  // webview where confirm()/alert() are blocked and throw instead of
  // showing anything, which made Delete look like it silently did nothing.
  // Confirmation is an in-page "Confirm? / Cancel" toggle instead.
  const remove = async (id: string, storagePath?: string) => {
    setConfirmId(null);
    try {
      await deleteDoc(doc(db, 'sportsTournaments', id));
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
        <h2 className="admin-card__title">{editing ? 'Edit Tournament' : 'Add Tournament'}</h2>
        <p className="admin-field__hint" style={{ marginBottom: '1rem' }}>
          Shown as a card in "Collegewise Tournaments" — just a photo and a name.
        </p>
        <div className="admin-form-grid">
          <div className="admin-field" style={{ gridColumn: '1 / -1', maxWidth: 260 }}>
            <label>Photo *</label>
            <ImageUploader folder="vwu/sports-tournaments" currentUrl={form.imageUrl} onUploaded={handleImage} label="Upload Photo" aspect={4 / 3} />
          </div>
          <div className="admin-field">
            <label htmlFor="field-tournament-title">Tournament Name *</label>
            <input id="field-tournament-title" value={form.title} onChange={(e) => set('title', e.target.value)} placeholder="Annual Basketball Championship" />
          </div>
          <div className="admin-field">
            <label htmlFor="field-tournament-order">Display Order</label>
            <input id="field-tournament-order" type="number" value={form.order} onChange={(e) => set('order', Number(e.target.value))} min={0} />
          </div>
        </div>
        <div className="admin-form-actions">
          {editing && <button className="admin-btn admin-btn--ghost" onClick={() => { setEditing(null); setForm(EMPTY); }}>Cancel</button>}
          <button className="admin-btn admin-btn--primary" onClick={save} disabled={saving}>
            {saving ? 'Saving…' : editing ? 'Update' : 'Add Tournament'}
          </button>
        </div>
      </div>

      <div className="admin-card">
        <h2 className="admin-card__title">Tournaments ({items.length})</h2>
        {loading ? <p className="admin-loading">Loading…</p> : (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead><tr><th>Photo</th><th>Name</th><th>Order</th><th>Actions</th></tr></thead>
              <tbody>
                {items.map((item) => (
                  <tr key={item.id}>
                    <td>{item.imageUrl ? <img src={item.imageUrl} alt="" className="admin-table__avatar" /> : '🏆'}</td>
                    <td>{item.title}</td>
                    <td>{item.order}</td>
                    <td>
                      <button className="admin-btn admin-btn--sm" onClick={() => startEdit(item)}>Edit</button>
                      {confirmId === item.id ? (
                        <>
                          <button className="admin-btn admin-btn--sm admin-btn--danger" onClick={() => remove(item.id, item.storagePath)}>Confirm?</button>
                          <button className="admin-btn admin-btn--sm admin-btn--ghost" onClick={() => setConfirmId(null)}>Cancel</button>
                        </>
                      ) : (
                        <button className="admin-btn admin-btn--sm admin-btn--danger" onClick={() => setConfirmId(item.id)}>Delete</button>
                      )}
                    </td>
                  </tr>
                ))}
                {items.length === 0 && <tr><td colSpan={4} className="admin-empty">No tournaments yet — add one using the form above.</td></tr>}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
