import { useEffect, useState } from 'react';
import { addDoc, collection, deleteDoc, doc, getDocs, serverTimestamp, updateDoc, writeBatch } from 'firebase/firestore';
import { db } from '../../../lib/firebase';
import { useOrderedCollection, type WithId } from '../../../hooks/useCollection';
import ImageUploader from '../../../components/ImageUploader/ImageUploader';
import { deleteFile, type UploadResult } from '../../../lib/storage';
import { institutionInnovationCell } from '../../Differentiators/institutionInnovationCell.data';

export interface IicCouncilMemberDoc extends WithId {
  name: string;
  role: string;
  tier: 'chairman' | 'leadership' | 'coordinator';
  imageUrl: string;
  storagePath: string;
  order: number;
}

const TIERS: { value: IicCouncilMemberDoc['tier']; label: string }[] = [
  { value: 'chairman', label: 'Chairman' },
  { value: 'leadership', label: 'Leadership' },
  { value: 'coordinator', label: 'Coordinator' },
];

type FormState = Omit<IicCouncilMemberDoc, 'id' | 'order'>;
const EMPTY: FormState = { name: '', role: '', tier: 'coordinator', imageUrl: '', storagePath: '' };

/**
 * The IIC Constitution org chart (Chairman / Leadership / Coordinators) on
 * the Institution Innovation Cell differentiator page. Used to be a fixed
 * hardcoded roster (institutionInnovationCell.data.ts) where only a
 * member's photo was admin-editable — this is a real add/edit/remove/
 * reorder roster instead, grouped by tier, same drag-reorder pattern as
 * Faculty/Campus Life admin tables.
 */
export default function IicCouncilMembersAdmin() {
  const { docs: members, loading } = useOrderedCollection<IicCouncilMemberDoc>('iicCouncilMembers', 'order');
  const [form, setForm] = useState<FormState>(EMPTY);
  const [editing, setEditing] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [seeding, setSeeding] = useState(false);

  const [groupedOrdered, setGroupedOrdered] = useState<Record<string, IicCouncilMemberDoc[]>>({});
  const [drag, setDrag] = useState<{ tier: string; index: number } | null>(null);
  useEffect(() => {
    const groups: Record<string, IicCouncilMemberDoc[]> = {};
    members.forEach((m) => { (groups[m.tier] ??= []).push(m); });
    setGroupedOrdered(groups);
  }, [members]);

  const handleDragOver = (tier: string, i: number) => {
    if (!drag || drag.tier !== tier || drag.index === i) return;
    setGroupedOrdered((prev) => {
      const list = [...(prev[tier] || [])];
      const [moved] = list.splice(drag.index, 1);
      list.splice(i, 0, moved);
      return { ...prev, [tier]: list };
    });
    setDrag({ tier, index: i });
  };
  const handleDrop = async (tier: string) => {
    setDrag(null);
    const list = groupedOrdered[tier] || [];
    const batch = writeBatch(db);
    let changed = false;
    list.forEach((m, i) => {
      if (m.order !== i) { batch.update(doc(db, 'iicCouncilMembers', m.id), { order: i }); changed = true; }
    });
    if (changed) {
      try {
        await batch.commit();
      } catch (e) {
        alert(`Couldn't save new order: ${(e as Error).message}`);
      }
    }
  };

  const [orderEdits, setOrderEdits] = useState<Record<string, string>>({});
  const commitOrder = async (m: IicCouncilMemberDoc, raw: string) => {
    setOrderEdits((prev) => { const next = { ...prev }; delete next[m.id]; return next; });
    const value = parseInt(raw, 10);
    if (Number.isNaN(value) || value === m.order) return;
    try {
      await updateDoc(doc(db, 'iicCouncilMembers', m.id), { order: value });
    } catch (e) {
      alert(`Couldn't update order: ${(e as Error).message}`);
    }
  };

  const set = (k: keyof FormState, v: string) => setForm((p) => ({ ...p, [k]: v }));
  const handleImage = (r: UploadResult) => setForm((p) => ({ ...p, imageUrl: r.url, storagePath: r.path }));

  const save = async () => {
    if (!form.name.trim()) return alert('Name is required.');
    setSaving(true);
    try {
      if (editing) {
        await updateDoc(doc(db, 'iicCouncilMembers', editing), { ...form });
      } else {
        const order = members.filter((m) => m.tier === form.tier).length;
        await addDoc(collection(db, 'iicCouncilMembers'), { ...form, order, createdAt: serverTimestamp() });
      }
      setForm(EMPTY);
      setEditing(null);
    } catch (e) {
      alert(`Couldn't save: ${(e as Error).message}`);
    } finally {
      setSaving(false);
    }
  };

  const startEdit = (m: IicCouncilMemberDoc) => {
    setEditing(m.id);
    setForm({ name: m.name, role: m.role, tier: m.tier, imageUrl: m.imageUrl || '', storagePath: m.storagePath || '' });
  };

  const remove = async (m: IicCouncilMemberDoc) => {
    if (!confirm(`Remove ${m.name}?`)) return;
    try {
      await deleteDoc(doc(db, 'iicCouncilMembers', m.id));
      if (m.storagePath) await deleteFile(m.storagePath);
    } catch (e) {
      alert(`Couldn't delete: ${(e as Error).message}`);
    }
  };

  // One-time: brings over the old hardcoded roster (name/role/tier/order)
  // plus any photo already uploaded against that name in the old
  // iicMemberPhotos collection, so nothing is lost switching to this admin
  // panel. Only shown while this collection is still empty.
  const seedFromLegacyRoster = async () => {
    setSeeding(true);
    try {
      const legacyPhotosSnap = await getDocs(collection(db, 'iicMemberPhotos'));
      const legacyPhotoMap = new Map(
        legacyPhotosSnap.docs.map((d) => [d.id, d.data() as { imageUrl?: string; storagePath?: string }])
      );
      const roster: { name: string; role: string; tier: IicCouncilMemberDoc['tier'] }[] = [
        { ...institutionInnovationCell.constitution.chairman, tier: 'chairman' },
        ...institutionInnovationCell.constitution.leadership.map((p) => ({ ...p, tier: 'leadership' as const })),
        ...institutionInnovationCell.constitution.coordinators.map((p) => ({ ...p, tier: 'coordinator' as const })),
      ];
      const tierOrder: Record<string, number> = {};
      for (const person of roster) {
        const order = tierOrder[person.tier] ?? 0;
        const photo = legacyPhotoMap.get(person.name);
        await addDoc(collection(db, 'iicCouncilMembers'), {
          name: person.name,
          role: person.role,
          tier: person.tier,
          imageUrl: photo?.imageUrl || '',
          storagePath: photo?.storagePath || '',
          order,
          createdAt: serverTimestamp(),
        });
        tierOrder[person.tier] = order + 1;
      }
    } catch (e) {
      alert(`Couldn't seed roster: ${(e as Error).message}`);
    } finally {
      setSeeding(false);
    }
  };

  return (
    <div className="admin-card">
      <h2 className="admin-card__title">{editing ? 'Edit Council Member' : 'Add Council Member'}</h2>
      <p className="admin-lead" style={{ marginBottom: '1rem' }}>
        Powers the IIC &ndash; Constitution org chart on the Institution Innovation Cell page &mdash; Chairman,
        Leadership, and Coordinators. Add, edit, remove, or reorder members below; each tier is its own row on the
        public page.
      </p>
      {!loading && members.length === 0 && (
        <p className="admin-field__hint" style={{ marginBottom: '1rem' }}>
          <button type="button" className="admin-btn admin-btn--sm" onClick={seedFromLegacyRoster} disabled={seeding}>
            {seeding ? 'Seeding…' : 'Seed all 11 members from the old hardcoded roster'}
          </button>{' '}
          One-time — brings over the old names/roles/order (and any photo already uploaded) so nothing is lost.
        </p>
      )}
      <div className="admin-form-grid">
        <div className="admin-field" style={{ gridColumn: '1 / -1', maxWidth: 200 }}>
          <label>Photo</label>
          <ImageUploader folder="vwu/iic-members" currentUrl={form.imageUrl} onUploaded={handleImage} label="Upload Photo" aspect={1} />
        </div>
        <div className="admin-field">
          <label htmlFor="field-iic-member-name">Name *</label>
          <input id="field-iic-member-name" value={form.name} onChange={(e) => set('name', e.target.value)} placeholder="Dr. Name" />
        </div>
        <div className="admin-field">
          <label htmlFor="field-iic-member-role">Role</label>
          <input id="field-iic-member-role" value={form.role} onChange={(e) => set('role', e.target.value)} placeholder="Convener" />
        </div>
        <div className="admin-field">
          <label htmlFor="field-iic-member-tier">Tier</label>
          <select id="field-iic-member-tier" value={form.tier} onChange={(e) => set('tier', e.target.value)}>
            {TIERS.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
          </select>
        </div>
      </div>
      <div className="admin-form-actions">
        {editing && <button className="admin-btn admin-btn--ghost" onClick={() => { setEditing(null); setForm(EMPTY); }}>Cancel</button>}
        <button className="admin-btn admin-btn--primary" onClick={save} disabled={saving}>
          {saving ? 'Saving…' : editing ? 'Update' : 'Add Member'}
        </button>
      </div>

      {loading ? <p className="admin-loading">Loading…</p> : (
        TIERS.map((t) => {
          const list = groupedOrdered[t.value] || [];
          return (
            <div key={t.value} style={{ marginTop: '1.5rem' }}>
              <h3 style={{ fontSize: '0.95rem', marginBottom: '0.5rem' }}>{t.label} ({list.length})</h3>
              <div className="admin-table-wrap">
                <table className="admin-table">
                  <thead><tr><th></th><th>Order</th><th>Photo</th><th>Name</th><th>Role</th><th>Actions</th></tr></thead>
                  <tbody>
                    {list.map((m, i) => (
                      <tr
                        key={m.id}
                        draggable
                        onDragStart={() => setDrag({ tier: t.value, index: i })}
                        onDragOver={(e) => { e.preventDefault(); handleDragOver(t.value, i); }}
                        onDrop={() => handleDrop(t.value)}
                        onDragEnd={() => setDrag(null)}
                        style={{ opacity: drag?.tier === t.value && drag.index === i ? 0.5 : 1, cursor: 'grab' }}
                      >
                        <td style={{ color: 'var(--color-text-light, #9ca3af)', fontSize: '1.1rem', userSelect: 'none' }}>⠿</td>
                        <td>
                          <input
                            type="number"
                            className="admin-order-input"
                            value={orderEdits[m.id] ?? m.order}
                            onChange={(e) => setOrderEdits((prev) => ({ ...prev, [m.id]: e.target.value }))}
                            onBlur={(e) => commitOrder(m, e.target.value)}
                            onKeyDown={(e) => { if (e.key === 'Enter') (e.target as HTMLInputElement).blur(); }}
                            onClick={(e) => e.stopPropagation()}
                            onMouseDown={(e) => e.stopPropagation()}
                          />
                        </td>
                        <td>{m.imageUrl ? <img src={m.imageUrl} alt="" className="admin-table__avatar" /> : '👤'}</td>
                        <td>{m.name}</td>
                        <td>{m.role}</td>
                        <td>
                          <button className="admin-btn admin-btn--sm" onClick={() => startEdit(m)}>Edit</button>
                          <button className="admin-btn admin-btn--sm admin-btn--danger" onClick={() => remove(m)}>Delete</button>
                        </td>
                      </tr>
                    ))}
                    {list.length === 0 && <tr><td colSpan={6} className="admin-empty">No {t.label.toLowerCase()} yet.</td></tr>}
                  </tbody>
                </table>
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}
