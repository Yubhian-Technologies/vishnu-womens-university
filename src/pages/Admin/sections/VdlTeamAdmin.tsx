import { useState } from 'react';
import { addDoc, collection, deleteDoc, doc, serverTimestamp, updateDoc } from 'firebase/firestore';
import { db } from '../../../lib/firebase';
import { useOrderedCollection, type WithId } from '../../../hooks/useCollection';

export interface VdlTeamMemberDoc extends WithId {
  name: string;
  designation: string;
  email: string;
  mobile: string;
  interests: string;
  // Exactly one member should be the Head — shown separately, above
  // "Faculty Team Members", on the public page.
  isHead: boolean;
  order: number;
}

const EMPTY: Omit<VdlTeamMemberDoc, 'id'> = { name: '', designation: '', email: '', mobile: '', interests: '', isHead: false, order: 0 };

// The original hardcoded team, used as the one-click starting point when
// this collection is still empty — see seedTeam below.
const DEFAULT_TEAM: Omit<VdlTeamMemberDoc, 'id'>[] = [
  { name: 'P. Srinivasa Raju', designation: 'Professor', email: '', mobile: '9949433561', interests: 'Design and Fuel cells', isHead: true, order: 1 },
  { name: 'Manoneet Kumar', designation: 'Assistant Professor', email: 'manoneet.kumar@svecw.edu.in', mobile: '9100212043', interests: 'Automobile engineering', isHead: false, order: 2 },
  { name: 'A.S.V. Prasad', designation: 'Assistant Professor', email: 'asvprasadme@svecw.edu.in', mobile: '8179097633', interests: 'Thermal engineering', isHead: false, order: 3 },
];

// Powers the "Head of Lab" and "Faculty Team Members" cards on the Vehicle
// Design Lab differentiator page (previously hardcoded in
// vehicleDesignLab.data.ts).
export default function VdlTeamAdmin() {
  const { docs: members, loading } = useOrderedCollection<VdlTeamMemberDoc>('vdlTeamMembers', 'order');
  const [form, setForm] = useState<Omit<VdlTeamMemberDoc, 'id'>>(EMPTY);
  const [editing, setEditing] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [confirmId, setConfirmId] = useState<string | null>(null);

  const set = (k: keyof typeof EMPTY, v: string | number | boolean) => setForm((p) => ({ ...p, [k]: v }));

  const save = async () => {
    if (!form.name.trim()) return alert('Name is required.');
    setSaving(true);
    try {
      if (editing) {
        await updateDoc(doc(db, 'vdlTeamMembers', editing), { ...form });
      } else {
        await addDoc(collection(db, 'vdlTeamMembers'), { ...form, order: form.order || members.length + 1, createdAt: serverTimestamp() });
      }
      setForm(EMPTY);
      setEditing(null);
    } catch (e) {
      alert(`Couldn't save: ${(e as Error).message}`);
    } finally {
      setSaving(false);
    }
  };

  const startEdit = (m: VdlTeamMemberDoc) => {
    setEditing(m.id);
    setForm({ name: m.name, designation: m.designation || '', email: m.email || '', mobile: m.mobile || '', interests: m.interests || '', isHead: !!m.isHead, order: m.order });
  };

  // No native window.confirm() — this admin can run inside a sandboxed
  // webview where confirm()/alert() are blocked and throw instead of
  // showing anything, which makes Delete look like it silently does
  // nothing. Confirmation is an in-page "Confirm? / Cancel" toggle instead.
  const remove = async (id: string) => {
    setConfirmId(null);
    try {
      await deleteDoc(doc(db, 'vdlTeamMembers', id));
    } catch (e) {
      alert(`Couldn't delete: ${(e as Error).message}`);
    }
  };

  const seedTeam = async () => {
    if (!confirm('Add the original Vehicle Design Lab head and faculty as a starting point?')) return;
    try {
      for (const m of DEFAULT_TEAM) await addDoc(collection(db, 'vdlTeamMembers'), { ...m, createdAt: serverTimestamp() });
    } catch (e) {
      alert(`Couldn't add starter team: ${(e as Error).message}`);
    }
  };

  return (
    <div className="admin-section">
      <div className="admin-card">
        <h2 className="admin-card__title">{editing ? 'Edit Team Member' : 'Add Team Member'}</h2>
        <p className="admin-lead" style={{ marginBottom: '1rem' }}>
          Powers the "Head of Lab" and "Faculty Team Members" cards on the Vehicle Design Lab differentiator page.
          Mark exactly one member as Head — everyone else shows as Faculty.
        </p>
        <div className="admin-form-grid">
          <div className="admin-field">
            <label htmlFor="field-vdl-name">Name *</label>
            <input id="field-vdl-name" value={form.name} onChange={(e) => set('name', e.target.value)} placeholder="P. Srinivasa Raju" />
          </div>
          <div className="admin-field">
            <label htmlFor="field-vdl-designation">Designation</label>
            <input id="field-vdl-designation" value={form.designation} onChange={(e) => set('designation', e.target.value)} placeholder="Professor" />
          </div>
          <div className="admin-field">
            <label htmlFor="field-vdl-email">Email</label>
            <input id="field-vdl-email" value={form.email} onChange={(e) => set('email', e.target.value)} placeholder="name@svecw.edu.in" />
          </div>
          <div className="admin-field">
            <label htmlFor="field-vdl-mobile">Mobile</label>
            <input id="field-vdl-mobile" value={form.mobile} onChange={(e) => set('mobile', e.target.value)} placeholder="9949433561" />
          </div>
          <div className="admin-field admin-field--full">
            <label htmlFor="field-vdl-interests">Interests</label>
            <input id="field-vdl-interests" value={form.interests} onChange={(e) => set('interests', e.target.value)} placeholder="Design and Fuel cells" />
          </div>
          <div className="admin-field" style={{ display: 'flex', alignItems: 'center', gap: '8px', paddingTop: '1.5rem' }}>
            <input id="field-vdl-is-head" type="checkbox" checked={form.isHead} onChange={(e) => set('isHead', e.target.checked)} />
            <label htmlFor="field-vdl-is-head" style={{ margin: 0, cursor: 'pointer' }}>This is the Head of Lab</label>
          </div>
          <div className="admin-field">
            <label htmlFor="field-vdl-order">Display Order</label>
            <input id="field-vdl-order" type="number" value={form.order} onChange={(e) => set('order', Number(e.target.value))} min={0} />
          </div>
        </div>
        <div className="admin-form-actions">
          {editing && <button className="admin-btn admin-btn--ghost" onClick={() => { setEditing(null); setForm(EMPTY); }}>Cancel</button>}
          <button className="admin-btn admin-btn--primary" onClick={save} disabled={saving}>{saving ? 'Saving…' : editing ? 'Update' : 'Add Member'}</button>
        </div>
      </div>

      <div className="admin-card">
        <h2 className="admin-card__title">Team ({members.length})</h2>
        {loading ? <p className="admin-loading">Loading…</p> : (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead><tr><th>Order</th><th>Name</th><th>Designation</th><th>Role</th><th>Actions</th></tr></thead>
              <tbody>
                {members.map((m) => (
                  <tr key={m.id}>
                    <td>{m.order}</td>
                    <td>{m.name}</td>
                    <td>{m.designation}</td>
                    <td>{m.isHead ? 'Head of Lab' : 'Faculty'}</td>
                    <td>
                      <button className="admin-btn admin-btn--sm" onClick={() => startEdit(m)}>Edit</button>
                      {confirmId === m.id ? (
                        <>
                          <button className="admin-btn admin-btn--sm admin-btn--danger" onClick={() => remove(m.id)}>Confirm?</button>
                          <button className="admin-btn admin-btn--sm admin-btn--ghost" onClick={() => setConfirmId(null)}>Cancel</button>
                        </>
                      ) : (
                        <button className="admin-btn admin-btn--sm admin-btn--danger" onClick={() => setConfirmId(m.id)}>Delete</button>
                      )}
                    </td>
                  </tr>
                ))}
                {members.length === 0 && (
                  <tr>
                    <td colSpan={5} className="admin-empty">
                      No team members yet.{' '}
                      <button className="admin-btn admin-btn--sm" onClick={seedTeam}>Add starter team</button>
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
