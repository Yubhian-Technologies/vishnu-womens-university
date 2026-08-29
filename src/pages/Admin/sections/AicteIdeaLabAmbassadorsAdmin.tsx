import { useState } from 'react';
import { addDoc, collection, deleteDoc, doc, serverTimestamp, updateDoc } from 'firebase/firestore';
import { db } from '../../../lib/firebase';
import { useOrderedCollection, type WithId } from '../../../hooks/useCollection';

export interface AicteIdeaLabAmbassadorDoc extends WithId {
  regNumber: string;
  name: string;
  year: string;
  branch: string;
  whatsapp: string;
  email: string;
  order: number;
}

const EMPTY = { regNumber: '', name: '', year: '', branch: '', whatsapp: '', email: '', order: 0 };

// The original "Student Ambassadors" table, used as the one-click starting
// point when this collection is still empty — see seedAmbassadors below.
const DEFAULT_AMBASSADORS: Omit<AicteIdeaLabAmbassadorDoc, 'id'>[] = [
  { regNumber: '21B01A54A6', name: 'T. Hanuma Priya', year: 'II', branch: 'AIDS', whatsapp: '6301886833', email: '21B01A54A6@svecw.edu.in', order: 1 },
  { regNumber: '21B01A6110', name: 'B. Haritha Priya Lakshmi Bala', year: 'II', branch: 'AIML', whatsapp: '9398973387', email: '21B01A6110@svecw.edu.in', order: 2 },
  { regNumber: '21B01A0125', name: 'K. Renu Priyanka', year: 'II', branch: 'CIVIL', whatsapp: '9182403993', email: '21B01A0125@svecw.edu.in', order: 3 },
  { regNumber: '21B01A0525', name: 'B. Naga Sai Eswari Sathvika', year: 'II', branch: 'CSE', whatsapp: '8686850509', email: '21B01A0525@svecw.edu.in', order: 4 },
  { regNumber: '21B01A0437', name: 'J. Tejaswini Sai Sindhu', year: 'II', branch: 'ECE', whatsapp: '9133337333', email: '21B01A0437@svecw.edu.in', order: 5 },
  { regNumber: '21B01A0488', name: 'R. Jahnavi', year: 'II', branch: 'ECE', whatsapp: '8985455489', email: '21B01A04A1@svecw.edu.in', order: 6 },
  { regNumber: '21B01A0211', name: 'G. T. S. Padmavathi', year: 'II', branch: 'EEE', whatsapp: '9014368722', email: '21B01A0211@svecw.edu.in', order: 7 },
  { regNumber: '21B01A0221', name: 'K. Pujitha', year: 'II', branch: 'EEE', whatsapp: '9390151619', email: '21B01A0221@svecw.edu.in', order: 8 },
  { regNumber: '21B01A0313', name: 'D. Yasaswini Naga Sai Sirisha', year: 'II', branch: 'ME', whatsapp: '7013625483', email: '21B01A0313@svecw.edu.in', order: 9 },
  { regNumber: '21B01A0314', name: 'D. H Pravallika Devi', year: 'II', branch: 'ME', whatsapp: '6281434959', email: '21B01A0314@svecw.edu.in', order: 10 },
];

export default function AicteIdeaLabAmbassadorsAdmin() {
  const { docs: ambassadors, loading } = useOrderedCollection<AicteIdeaLabAmbassadorDoc>('aicteIdeaLabAmbassadors', 'order');
  const [form, setForm] = useState(EMPTY);
  const [editing, setEditing] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const set = (k: keyof typeof EMPTY, v: string | number) => setForm((p) => ({ ...p, [k]: v }));

  const save = async () => {
    if (!form.regNumber || !form.name) return alert('Reg. number and name are required.');
    setSaving(true);
    try {
      if (editing) {
        await updateDoc(doc(db, 'aicteIdeaLabAmbassadors', editing), { ...form });
      } else {
        await addDoc(collection(db, 'aicteIdeaLabAmbassadors'), { ...form, order: form.order || ambassadors.length + 1, createdAt: serverTimestamp() });
      }
      setForm(EMPTY);
      setEditing(null);
    } catch (e) {
      alert(`Couldn't save: ${(e as Error).message}`);
    } finally {
      setSaving(false);
    }
  };

  const startEdit = (a: AicteIdeaLabAmbassadorDoc) => {
    setEditing(a.id);
    setForm({ regNumber: a.regNumber, name: a.name, year: a.year, branch: a.branch, whatsapp: a.whatsapp, email: a.email, order: a.order });
  };

  const remove = async (id: string) => {
    if (!confirm('Delete this student ambassador?')) return;
    try {
      await deleteDoc(doc(db, 'aicteIdeaLabAmbassadors', id));
    } catch (e) {
      alert(`Couldn't delete: ${(e as Error).message}`);
    }
  };

  const seedAmbassadors = async () => {
    if (!confirm('Add the original set of student ambassadors as a starting point?')) return;
    try {
      for (const a of DEFAULT_AMBASSADORS) await addDoc(collection(db, 'aicteIdeaLabAmbassadors'), { ...a, createdAt: serverTimestamp() });
    } catch (e) {
      alert(`Couldn't add starter ambassadors: ${(e as Error).message}`);
    }
  };

  return (
    <div className="admin-section">
      <div className="admin-card">
        <h2 className="admin-card__title">{editing ? 'Edit Student Ambassador' : 'Add Student Ambassador'}</h2>
        <p className="admin-lead" style={{ marginBottom: '1rem' }}>
          Powers the "Student Ambassadors" tab on the AICTE IDEA Lab differentiator page.
        </p>
        <div className="admin-form-grid">
          <div className="admin-field">
            <label htmlFor="field-reg-number">Reg. Number *</label>
            <input id="field-reg-number" value={form.regNumber} onChange={(e) => set('regNumber', e.target.value.toUpperCase())} placeholder="21B01A54A6" />
          </div>
          <div className="admin-field">
            <label htmlFor="field-name-of-the-student">Name of the Student *</label>
            <input id="field-name-of-the-student" value={form.name} onChange={(e) => set('name', e.target.value)} placeholder="T. Hanuma Priya" />
          </div>
          <div className="admin-field">
            <label htmlFor="field-year">Year</label>
            <input id="field-year" value={form.year} onChange={(e) => set('year', e.target.value)} placeholder="II" />
          </div>
          <div className="admin-field">
            <label htmlFor="field-branch">Branch</label>
            <input id="field-branch" value={form.branch} onChange={(e) => set('branch', e.target.value.toUpperCase())} placeholder="AIDS" />
          </div>
          <div className="admin-field">
            <label htmlFor="field-whatsapp-number">WhatsApp Number</label>
            <input id="field-whatsapp-number" value={form.whatsapp} onChange={(e) => set('whatsapp', e.target.value)} placeholder="6301886833" />
          </div>
          <div className="admin-field">
            <label htmlFor="field-e-mail-id">E Mail Id</label>
            <input id="field-e-mail-id" value={form.email} onChange={(e) => set('email', e.target.value)} placeholder="21B01A54A6@svecw.edu.in" />
          </div>
          <div className="admin-field">
            <label htmlFor="field-display-order">Display Order</label>
            <input id="field-display-order" type="number" value={form.order} onChange={(e) => set('order', +e.target.value)} min={0} />
          </div>
        </div>
        <div className="admin-form-actions">
          {editing && <button className="admin-btn admin-btn--ghost" onClick={() => { setEditing(null); setForm(EMPTY); }}>Cancel</button>}
          <button className="admin-btn admin-btn--primary" onClick={save} disabled={saving}>{saving ? 'Saving…' : editing ? 'Update' : 'Add Ambassador'}</button>
        </div>
      </div>

      <div className="admin-card">
        <h2 className="admin-card__title">Student Ambassadors ({ambassadors.length})</h2>
        {loading ? <p className="admin-loading">Loading…</p> : (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead><tr><th>Order</th><th>Reg. Number</th><th>Name</th><th>Year</th><th>Branch</th><th>WhatsApp</th><th>Email</th><th>Actions</th></tr></thead>
              <tbody>
                {ambassadors.map((a) => (
                  <tr key={a.id}>
                    <td>{a.order}</td>
                    <td>{a.regNumber}</td>
                    <td>{a.name}</td>
                    <td>{a.year}</td>
                    <td>{a.branch}</td>
                    <td>{a.whatsapp}</td>
                    <td>{a.email}</td>
                    <td>
                      <button className="admin-btn admin-btn--sm" onClick={() => startEdit(a)}>Edit</button>
                      <button className="admin-btn admin-btn--sm admin-btn--danger" onClick={() => remove(a.id)}>Delete</button>
                    </td>
                  </tr>
                ))}
                {ambassadors.length === 0 && (
                  <tr>
                    <td colSpan={8} className="admin-empty">
                      No student ambassadors yet.{' '}
                      <button className="admin-btn admin-btn--sm" onClick={seedAmbassadors}>Add starter ambassadors</button>
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
