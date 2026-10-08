import { useEffect, useState } from 'react';
import { collection, doc, serverTimestamp } from 'firebase/firestore';
import { addDoc, deleteDoc, updateDoc, writeBatch } from '../../../lib/auditLog';
import { db } from '../../../lib/firebase';
import { useOrderedCollection } from '../../../hooks/useCollection';
import ImageUploader from '../../../components/ImageUploader/ImageUploader';
import type { UploadResult } from '../../../lib/storage';
import { GOVERNING_BODY_DEFAULTS } from '../../Governance/governingBody.data';

export interface GoverningBodyDoc {
  id: string;
  number?: number;
  nature: string;
  name: string;
  org?: string;
  position?: string;
  photoUrl?: string;
  storagePath?: string;
  order: number;
}

const EMPTY: Omit<GoverningBodyDoc, 'id'> = {
  nature: '',
  name: '',
  org: '',
  position: '',
  photoUrl: '',
  storagePath: '',
  order: 0,
};

const DEFAULT_GB_TABLE_MEMBERS: Omit<GoverningBodyDoc, 'id'>[] = GOVERNING_BODY_DEFAULTS.map((m, i) => ({
  nature: m.details,
  number: m.number,
  name: m.name,
  org: '',
  position: m.details,
  order: i + 1,
}));

export default function GoverningBodyAdmin() {
  const { docs: members, loading } = useOrderedCollection<GoverningBodyDoc>('governingBody', 'order');
  const [form, setForm] = useState<Omit<GoverningBodyDoc, 'id'>>(EMPTY);
  const [editing, setEditing] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [clearing, setClearing] = useState(false);
  const [seeding, setSeeding] = useState(false);

  const [orderedMembers, setOrderedMembers] = useState<GoverningBodyDoc[]>([]);
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  useEffect(() => setOrderedMembers(members), [members]);

  const handleDragOver = (i: number) => {
    if (dragIndex === null || dragIndex === i) return;
    setOrderedMembers((prev) => {
      const next = [...prev];
      const [moved] = next.splice(dragIndex, 1);
      next.splice(i, 0, moved);
      return next;
    });
    setDragIndex(i);
  };

  const handleDrop = async () => {
    setDragIndex(null);
    const batch = writeBatch(db);
    let changed = false;
    orderedMembers.forEach((m, i) => {
      if (m.order !== i + 1) { batch.update(doc(db, 'governingBody', m.id), { order: i + 1 }); changed = true; }
    });
    if (changed) {
      try {
        await batch.commit();
      } catch (e) {
        alert(`Couldn't save new order: ${(e as Error).message}`);
      }
    }
  };

  const set = (k: string, v: string | number) => setForm((p) => ({ ...p, [k]: v }));
  const handleImage = (r: UploadResult) => setForm((p) => ({ ...p, photoUrl: r.url, storagePath: r.path }));

  const save = async () => {
    if (!form.nature) return alert('Details is required.');
    setSaving(true);
    try {
      const payload = {
        ...form,
        position: form.position || form.org || form.nature,
      };
      if (editing) {
        await updateDoc(doc(db, 'governingBody', editing), { ...payload });
      } else {
        await addDoc(collection(db, 'governingBody'), {
          ...payload,
          order: form.order || members.length + 1,
          createdAt: serverTimestamp(),
        });
      }
      setForm(EMPTY); setEditing(null);
    } catch (e) {
      alert(`Couldn't save: ${(e as Error).message}`);
    } finally { setSaving(false); }
  };

  const startEdit = (m: GoverningBodyDoc) => {
    setEditing(m.id);
    setForm({
      number: m.number,
      nature: m.nature || m.position || '',
      name: m.name || '',
      org: m.org || '',
      position: m.position || '',
      photoUrl: m.photoUrl || '',
      storagePath: m.storagePath || '',
      order: m.order,
    });
  };

  const remove = async (id: string) => {
    if (!confirm('Remove this Governing Body member?')) return;
    try {
      await deleteDoc(doc(db, 'governingBody', id));
    } catch (e) {
      alert(`Couldn't delete: ${(e as Error).message}`);
    }
  };

  const seedWebsiteDefaults = async () => {
    if (!confirm('Populate Governing Body table with the current official member list?')) return;
    setSeeding(true);
    try {
      const batch = writeBatch(db);
      DEFAULT_GB_TABLE_MEMBERS.forEach((m) => {
        const ref = doc(collection(db, 'governingBody'));
        batch.set(ref, { ...m, createdAt: serverTimestamp() });
      });
      await batch.commit();
    } catch (e) {
      alert(`Couldn't populate defaults: ${(e as Error).message}`);
    } finally {
      setSeeding(false);
    }
  };

  const clearAll = async () => {
    if (members.length === 0) return;
    if (!confirm(`Delete all ${members.length} Governing Body members? This cannot be undone.`)) return;
    setClearing(true);
    try {
      for (let i = 0; i < members.length; i += 450) {
        const batch = writeBatch(db);
        members.slice(i, i + 450).forEach((m) => batch.delete(doc(db, 'governingBody', m.id)));
        await batch.commit();
      }
    } catch (e) {
      alert(`Couldn't delete all: ${(e as Error).message}`);
    } finally {
      setClearing(false);
    }
  };

  return (
    <div className="admin-section">
      <div className="admin-card">
        <h2 className="admin-card__title">{editing ? 'Edit Governing Body Member' : 'Add Governing Body Member'}</h2>
        <p className="admin-lead" style={{ marginBottom: '1rem' }}>
          Matches the Governing Body table on the live website (Number, Name, Details).
        </p>
        <div className="admin-form-grid">
          <div className="admin-field">
            <label htmlFor="field-number">Number (as printed)</label>
            <input id="field-number" type="number" value={form.number ?? ''} onChange={(e) => setForm((p) => ({ ...p, number: e.target.value === '' ? undefined : Number(e.target.value) }))} />
          </div>
          <div className="admin-field">
            <label htmlFor="field-nature">Details *</label>
            <input id="field-nature" value={form.nature} onChange={(e) => set('nature', e.target.value)} placeholder="Chancellor of the University & Chairman of SVES" />
          </div>
          <div className="admin-field">
            <label htmlFor="field-full-name">Name of the Member</label>
            <input id="field-full-name" value={form.name} onChange={(e) => set('name', e.target.value)} placeholder="Sri K.V. Vishnu Raju" />
          </div>
          <div className="admin-field">
            <label htmlFor="field-org">Additional details (optional)</label>
            <input id="field-org" value={form.org} onChange={(e) => set('org', e.target.value)} placeholder="Vice Chairman, SVES or NITTTR, Bhopal" />
          </div>
          <div className="admin-field">
            <label htmlFor="field-display-order">Display Order</label>
            <input id="field-display-order" type="number" value={form.order} onChange={(e) => set('order', Number(e.target.value))} />
          </div>
          <div className="admin-field" style={{ gridColumn: '1 / -1', maxWidth: 220 }}>
            <label>Photo (optional)</label>
            <ImageUploader folder="vwu/governing-body" currentUrl={form.photoUrl} onUploaded={handleImage} label="Upload Photo" />
          </div>
        </div>
        <div className="admin-form-actions">
          {editing && <button className="admin-btn admin-btn--ghost" onClick={() => { setEditing(null); setForm(EMPTY); }}>Cancel</button>}
          <button className="admin-btn admin-btn--primary" onClick={save} disabled={saving}>
            {saving ? 'Saving…' : editing ? 'Update Member' : 'Add Member'}
          </button>
        </div>
      </div>

      <div className="admin-card">
        <div className="admin-card__toolbar">
          <h2 className="admin-card__title">Governing Body Composition ({members.length})</h2>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            {members.length === 0 && (
              <button className="admin-btn admin-btn--sm admin-btn--secondary" onClick={seedWebsiteDefaults} disabled={seeding}>
                {seeding ? 'Populating…' : 'Populate Website Statutory Table'}
              </button>
            )}
            {members.length > 0 && (
              <button className="admin-btn admin-btn--sm admin-btn--danger" onClick={clearAll} disabled={clearing}>
                {clearing ? 'Clearing…' : 'Clear All'}
              </button>
            )}
          </div>
        </div>
        <p className="admin-field__hint" style={{ marginBottom: '0.75rem' }}>
          Drag rows by the ⠿ handle to reorder members in the Governing Body composition table.
        </p>
        {loading ? <p className="admin-loading">Loading…</p> : (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th></th>
                  <th>Order</th>
                  <th>No.</th>
                  <th>Details</th>
                  <th>Name of Member</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {orderedMembers.map((m, i) => (
                  <tr
                    key={m.id}
                    draggable
                    onDragStart={() => setDragIndex(i)}
                    onDragOver={(e) => { e.preventDefault(); handleDragOver(i); }}
                    onDrop={handleDrop}
                    onDragEnd={() => setDragIndex(null)}
                    style={{ opacity: dragIndex === i ? 0.5 : 1, cursor: 'grab' }}
                  >
                    <td style={{ color: 'var(--color-text-light, #9ca3af)', fontSize: '1.1rem', userSelect: 'none' }}>⠿</td>
                    <td>{m.order || i + 1}</td>
                    <td>{m.number ?? '-'}</td>
                  <td><strong>{m.nature || m.position}</strong></td>
                    <td>{m.name || <em style={{ color: '#9ca3af' }}>—</em>}</td>
                  <td>
                      <button className="admin-btn admin-btn--sm" onClick={() => startEdit(m)}>Edit</button>
                      <button className="admin-btn admin-btn--sm admin-btn--danger" onClick={() => remove(m.id)}>Delete</button>
                    </td>
                  </tr>
                ))}
                {members.length === 0 && (
                  <tr>
                    <td colSpan={6} className="admin-empty">
                      No Governing Body members yet. Click &quot;Populate Website Statutory Table&quot; or use the form above to add members.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
