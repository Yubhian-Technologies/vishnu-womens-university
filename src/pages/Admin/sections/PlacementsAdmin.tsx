import { useState } from 'react';
import {
  collection, addDoc, deleteDoc, doc, updateDoc, serverTimestamp,
} from 'firebase/firestore';
import { db } from '../../../lib/firebase';
import { useOrderedCollection } from '../../../hooks/useCollection';
import CloudinaryUploader from '../../../components/CloudinaryUploader/CloudinaryUploader';
import type { CloudinaryResult } from '../../../lib/cloudinary';

interface PlacementRecord {
  id: string;
  companyName: string;
  logoUrl: string;
  publicId: string;
  year: string;
  package: string;
  studentsPlaced: number;
  sector: string;
  featured: boolean;
}

const EMPTY: Omit<PlacementRecord, 'id'> = {
  companyName: '', logoUrl: '', publicId: '', year: '2024-25',
  package: '', studentsPlaced: 0, sector: 'IT', featured: false,
};

const SECTORS = ['IT', 'Core Engineering', 'Finance', 'Consulting', 'Healthcare', 'Research', 'Other'];

export default function PlacementsAdmin() {
  const { docs: placements, loading } = useOrderedCollection<PlacementRecord>('placements', 'year', 'desc');
  const [form, setForm] = useState<Omit<PlacementRecord, 'id'>>(EMPTY);
  const [editing, setEditing] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const set = (k: string, v: string | number | boolean) => setForm((p) => ({ ...p, [k]: v }));
  const handleLogo = (r: CloudinaryResult) => setForm((p) => ({ ...p, logoUrl: r.secure_url, publicId: r.public_id }));

  const save = async () => {
    if (!form.companyName) return alert('Company name is required.');
    setSaving(true);
    try {
      if (editing) {
        await updateDoc(doc(db, 'placements', editing), { ...form });
      } else {
        await addDoc(collection(db, 'placements'), { ...form, createdAt: serverTimestamp() });
      }
      setForm(EMPTY); setEditing(null);
    } finally { setSaving(false); }
  };

  const startEdit = (p: PlacementRecord) => {
    setEditing(p.id);
    setForm({ companyName: p.companyName, logoUrl: p.logoUrl, publicId: p.publicId,
               year: p.year, package: p.package, studentsPlaced: p.studentsPlaced,
               sector: p.sector, featured: p.featured });
  };

  const remove = async (id: string) => {
    if (!confirm('Delete this record?')) return;
    await deleteDoc(doc(db, 'placements', id));
  };

  return (
    <div className="admin-section">
      <div className="admin-card">
        <h2 className="admin-card__title">{editing ? 'Edit Record' : 'Add Placement Record'}</h2>
        <div className="admin-form-grid">
          <div className="admin-field" style={{ maxWidth: 180 }}>
            <label>Company Logo</label>
            <CloudinaryUploader folder="vwu/placements" currentUrl={form.logoUrl} onUploaded={handleLogo} label="Upload Logo" />
          </div>
          <div className="admin-field">
            <label>Company Name *</label>
            <input value={form.companyName} onChange={(e) => set('companyName', e.target.value)} placeholder="TCS, Infosys, Google…" />
          </div>
          <div className="admin-field">
            <label>Academic Year</label>
            <input value={form.year} onChange={(e) => set('year', e.target.value)} placeholder="2024-25" />
          </div>
          <div className="admin-field">
            <label>Package (LPA)</label>
            <input value={form.package} onChange={(e) => set('package', e.target.value)} placeholder="e.g. 6.5 LPA" />
          </div>
          <div className="admin-field">
            <label>Students Placed</label>
            <input type="number" value={form.studentsPlaced} onChange={(e) => set('studentsPlaced', +e.target.value)} min={0} />
          </div>
          <div className="admin-field">
            <label>Sector</label>
            <select value={form.sector} onChange={(e) => set('sector', e.target.value)}>
              {SECTORS.map((s) => <option key={s}>{s}</option>)}
            </select>
          </div>
          <div className="admin-field">
            <label>Featured</label>
            <label className="admin-toggle">
              <input type="checkbox" checked={form.featured} onChange={(e) => set('featured', e.target.checked)} />
              <span>Show on homepage</span>
            </label>
          </div>
        </div>
        <div className="admin-form-actions">
          {editing && <button className="admin-btn admin-btn--ghost" onClick={() => { setEditing(null); setForm(EMPTY); }}>Cancel</button>}
          <button className="admin-btn admin-btn--primary" onClick={save} disabled={saving}>
            {saving ? 'Saving…' : editing ? 'Update' : 'Add Record'}
          </button>
        </div>
      </div>

      <div className="admin-card">
        <h2 className="admin-card__title">All Records ({placements.length})</h2>
        {loading ? <p className="admin-loading">Loading…</p> : (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead><tr><th>Logo</th><th>Company</th><th>Year</th><th>Package</th><th>Students</th><th>Featured</th><th>Actions</th></tr></thead>
              <tbody>
                {placements.map((p) => (
                  <tr key={p.id}>
                    <td>{p.logoUrl ? <img src={p.logoUrl} alt="" className="admin-table__thumb" style={{ objectFit: 'contain' }} /> : '🏢'}</td>
                    <td>{p.companyName}</td>
                    <td>{p.year}</td>
                    <td>{p.package || '—'}</td>
                    <td>{p.studentsPlaced}</td>
                    <td>{p.featured ? '✅' : '—'}</td>
                    <td>
                      <button className="admin-btn admin-btn--sm" onClick={() => startEdit(p)}>Edit</button>
                      <button className="admin-btn admin-btn--sm admin-btn--danger" onClick={() => remove(p.id)}>Delete</button>
                    </td>
                  </tr>
                ))}
                {placements.length === 0 && <tr><td colSpan={7} className="admin-empty">No records yet.</td></tr>}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
