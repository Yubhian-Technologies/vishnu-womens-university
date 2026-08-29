import { useState } from 'react';
import { addDoc, collection, deleteDoc, doc, serverTimestamp, updateDoc } from 'firebase/firestore';
import { db } from '../../../lib/firebase';
import { useOrderedCollection, type WithId } from '../../../hooks/useCollection';

export interface AicteIdeaLabTeamMemberDoc extends WithId {
  name: string;
  designation: string;
  role: string;
  order: number;
}

const EMPTY = { name: '', designation: '', role: '', order: 0 };

// The original "SVECW AICTE IDEA LAB TEAM" table, used as the one-click
// starting point when this collection is still empty — see seedTeam below.
const DEFAULT_TEAM: Omit<AicteIdeaLabTeamMemberDoc, 'id'>[] = [
  { name: 'Dr. G. Srinivasa Rao', designation: 'Principal, SVECW', role: 'Chief Mentor', order: 1 },
  { name: 'Dr. P. Srinivasa Raju', designation: 'Vice Principal, SVECW', role: 'Coordinator', order: 2 },
  { name: 'Dr. S. Hanumantha Rao', designation: 'Professor, Dept. of ECE', role: 'Co-Coordinator', order: 3 },
  { name: 'Dr. T. Sudheer Kumar', designation: 'Professor, Dept. of ECE', role: 'Tech GURU', order: 4 },
  { name: 'Mr. B. Satya Krishna', designation: 'Asst. Professor, Dept. of ME', role: 'Tech GURU', order: 5 },
  { name: 'Mr. N. Kalyan Chakravarthy', designation: 'Technician', role: 'Lab GURU', order: 6 },
];

export default function AicteIdeaLabTeamAdmin() {
  const { docs: members, loading } = useOrderedCollection<AicteIdeaLabTeamMemberDoc>('aicteIdeaLabTeam', 'order');
  const [form, setForm] = useState(EMPTY);
  const [editing, setEditing] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const set = (k: keyof typeof EMPTY, v: string | number) => setForm((p) => ({ ...p, [k]: v }));

  const save = async () => {
    if (!form.name || !form.designation || !form.role) return alert('Name, designation, and role are required.');
    setSaving(true);
    try {
      if (editing) {
        await updateDoc(doc(db, 'aicteIdeaLabTeam', editing), { ...form });
      } else {
        await addDoc(collection(db, 'aicteIdeaLabTeam'), { ...form, order: form.order || members.length + 1, createdAt: serverTimestamp() });
      }
      setForm(EMPTY);
      setEditing(null);
    } catch (e) {
      alert(`Couldn't save: ${(e as Error).message}`);
    } finally {
      setSaving(false);
    }
  };

  const startEdit = (m: AicteIdeaLabTeamMemberDoc) => {
    setEditing(m.id);
    setForm({ name: m.name, designation: m.designation, role: m.role, order: m.order });
  };

  const remove = async (id: string) => {
    if (!confirm('Delete this team member?')) return;
    try {
      await deleteDoc(doc(db, 'aicteIdeaLabTeam', id));
    } catch (e) {
      alert(`Couldn't delete: ${(e as Error).message}`);
    }
  };

  const seedTeam = async () => {
    if (!confirm('Add the original SVECW AICTE IDEA LAB team as a starting point?')) return;
    try {
      for (const m of DEFAULT_TEAM) await addDoc(collection(db, 'aicteIdeaLabTeam'), { ...m, createdAt: serverTimestamp() });
    } catch (e) {
      alert(`Couldn't add starter team: ${(e as Error).message}`);
    }
  };

  return (
    <div className="admin-section">
      <div className="admin-card">
        <h2 className="admin-card__title">{editing ? 'Edit Team Member' : 'Add Team Member'}</h2>
        <p className="admin-lead" style={{ marginBottom: '1rem' }}>
          Powers the "Team" tab on the AICTE IDEA Lab differentiator page.
        </p>
        <div className="admin-form-grid">
          <div className="admin-field">
            <label htmlFor="field-name-of-the-faculty">Name of the Faculty *</label>
            <input id="field-name-of-the-faculty" value={form.name} onChange={(e) => set('name', e.target.value)} placeholder="Dr. G. Srinivasa Rao" />
          </div>
          <div className="admin-field">
            <label htmlFor="field-designation">Designation *</label>
            <input id="field-designation" value={form.designation} onChange={(e) => set('designation', e.target.value)} placeholder="Principal, SVECW" />
          </div>
          <div className="admin-field">
            <label htmlFor="field-role">Role *</label>
            <input id="field-role" value={form.role} onChange={(e) => set('role', e.target.value)} placeholder="Chief Mentor" />
          </div>
          <div className="admin-field">
            <label htmlFor="field-display-order">Display Order</label>
            <input id="field-display-order" type="number" value={form.order} onChange={(e) => set('order', +e.target.value)} min={0} />
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
              <thead><tr><th>Order</th><th>Name of the Faculty</th><th>Designation</th><th>Role</th><th>Actions</th></tr></thead>
              <tbody>
                {members.map((m) => (
                  <tr key={m.id}>
                    <td>{m.order}</td>
                    <td>{m.name}</td>
                    <td>{m.designation}</td>
                    <td>{m.role}</td>
                    <td>
                      <button className="admin-btn admin-btn--sm" onClick={() => startEdit(m)}>Edit</button>
                      <button className="admin-btn admin-btn--sm admin-btn--danger" onClick={() => remove(m.id)}>Delete</button>
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
