import { useState } from 'react';
import {
  collection, addDoc, deleteDoc, doc, updateDoc, serverTimestamp,
} from 'firebase/firestore';
import { db } from '../../../lib/firebase';
import { useOrderedCollection } from '../../../hooks/useCollection';
import CloudinaryUploader from '../../../components/CloudinaryUploader/CloudinaryUploader';
import type { CloudinaryResult } from '../../../lib/cloudinary';

interface FacultyDoc {
  id: string;
  name: string;
  designation: string;
  department: string;
  qualification: string;
  specialization: string;
  email: string;
  imageUrl: string;
  publicId: string;
  order: number;
}

const EMPTY: Omit<FacultyDoc, 'id'> = {
  name: '', designation: 'Assistant Professor', department: 'CSE',
  qualification: '', specialization: '', email: '', imageUrl: '', publicId: '', order: 0,
};

const DEPARTMENTS = ['CSE', 'AI&ML', 'AI&DS', 'Cyber Security', 'IT', 'ECE', 'EEE', 'Civil', 'Mechanical', 'MBA'];
const DESIGNATIONS = ['Professor & HOD', 'Professor', 'Associate Professor', 'Assistant Professor'];

export default function FacultyAdmin() {
  const { docs: faculty, loading } = useOrderedCollection<FacultyDoc>('faculty', 'name');
  const [form, setForm] = useState<Omit<FacultyDoc, 'id'>>(EMPTY);
  const [editing, setEditing] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [filterDept, setFilterDept] = useState('All');

  const set = (k: string, v: string | number) => setForm((p) => ({ ...p, [k]: v }));
  const handleImage = (r: CloudinaryResult) => setForm((p) => ({ ...p, imageUrl: r.secure_url, publicId: r.public_id }));

  const save = async () => {
    if (!form.name) return alert('Name is required.');
    setSaving(true);
    try {
      if (editing) {
        await updateDoc(doc(db, 'faculty', editing), { ...form });
      } else {
        await addDoc(collection(db, 'faculty'), { ...form, createdAt: serverTimestamp() });
      }
      setForm(EMPTY); setEditing(null);
    } finally { setSaving(false); }
  };

  const startEdit = (f: FacultyDoc) => {
    setEditing(f.id);
    setForm({ name: f.name, designation: f.designation, department: f.department,
               qualification: f.qualification, specialization: f.specialization,
               email: f.email, imageUrl: f.imageUrl, publicId: f.publicId, order: f.order });
  };

  const remove = async (id: string) => {
    if (!confirm('Remove this faculty member?')) return;
    await deleteDoc(doc(db, 'faculty', id));
  };

  const filtered = filterDept === 'All' ? faculty : faculty.filter((f) => f.department === filterDept);

  return (
    <div className="admin-section">
      <div className="admin-card">
        <h2 className="admin-card__title">{editing ? 'Edit Faculty' : 'Add Faculty Member'}</h2>
        <div className="admin-form-grid">
          <div className="admin-field" style={{ gridColumn: '1 / -1', maxWidth: 200 }}>
            <label>Photo</label>
            <CloudinaryUploader folder="vwu/faculty" currentUrl={form.imageUrl} onUploaded={handleImage} label="Upload Photo" />
          </div>
          <div className="admin-field">
            <label>Full Name *</label>
            <input value={form.name} onChange={(e) => set('name', e.target.value)} placeholder="Dr. Name" />
          </div>
          <div className="admin-field">
            <label>Designation</label>
            <select value={form.designation} onChange={(e) => set('designation', e.target.value)}>
              {DESIGNATIONS.map((d) => <option key={d}>{d}</option>)}
            </select>
          </div>
          <div className="admin-field">
            <label>Department</label>
            <select value={form.department} onChange={(e) => set('department', e.target.value)}>
              {DEPARTMENTS.map((d) => <option key={d}>{d}</option>)}
            </select>
          </div>
          <div className="admin-field">
            <label>Qualification</label>
            <input value={form.qualification} onChange={(e) => set('qualification', e.target.value)} placeholder="Ph.D., M.Tech" />
          </div>
          <div className="admin-field">
            <label>Specialization</label>
            <input value={form.specialization} onChange={(e) => set('specialization', e.target.value)} placeholder="Machine Learning" />
          </div>
          <div className="admin-field">
            <label>Email</label>
            <input type="email" value={form.email} onChange={(e) => set('email', e.target.value)} placeholder="faculty@svecw.edu.in" />
          </div>
        </div>
        <div className="admin-form-actions">
          {editing && <button className="admin-btn admin-btn--ghost" onClick={() => { setEditing(null); setForm(EMPTY); }}>Cancel</button>}
          <button className="admin-btn admin-btn--primary" onClick={save} disabled={saving}>
            {saving ? 'Saving…' : editing ? 'Update' : 'Add Faculty'}
          </button>
        </div>
      </div>

      <div className="admin-card">
        <div className="admin-card__toolbar">
          <h2 className="admin-card__title">Faculty ({filtered.length})</h2>
          <select value={filterDept} onChange={(e) => setFilterDept(e.target.value)} className="admin-select-sm">
            <option value="All">All Departments</option>
            {DEPARTMENTS.map((d) => <option key={d}>{d}</option>)}
          </select>
        </div>
        {loading ? <p className="admin-loading">Loading…</p> : (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead><tr><th>Photo</th><th>Name</th><th>Designation</th><th>Department</th><th>Qualification</th><th>Actions</th></tr></thead>
              <tbody>
                {filtered.map((f) => (
                  <tr key={f.id}>
                    <td>{f.imageUrl ? <img src={f.imageUrl} alt="" className="admin-table__avatar" /> : '👤'}</td>
                    <td>{f.name}</td>
                    <td><span className="admin-badge admin-badge--sm">{f.designation}</span></td>
                    <td>{f.department}</td>
                    <td>{f.qualification}</td>
                    <td>
                      <button className="admin-btn admin-btn--sm" onClick={() => startEdit(f)}>Edit</button>
                      <button className="admin-btn admin-btn--sm admin-btn--danger" onClick={() => remove(f.id)}>Delete</button>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && <tr><td colSpan={6} className="admin-empty">No faculty records.</td></tr>}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
