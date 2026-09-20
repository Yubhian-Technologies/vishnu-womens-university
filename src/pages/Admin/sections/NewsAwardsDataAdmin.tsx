import { useState } from 'react';
import { collection, addDoc, deleteDoc, doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../../lib/firebase';
import { useOrderedCollection } from '../../../hooks/useCollection';
import ImageUploader from '../../../components/ImageUploader/ImageUploader';
import type { UploadResult } from '../../../lib/storage';

export interface HappeningDoc {
  id: string;
  title: string;
  date: string;
  type: 'recent' | 'upcoming';
  dept: string;
  order: number;
  imageUrl?: string;
  storagePath?: string;
  description?: string;
}

export interface AwardDoc {
  id: string;
  name: string;
  issuedBy: string;
  year: string;
  details: string;
  category: 'ranking' | 'award' | 'accreditation';
  order: number;
}

export interface StudentAchievementDoc {
  id: string;
  studentName: string;
  achievementTitle: string;
  department: string;
  category: string;
  badge?: string;
  year?: string;
  imageUrl?: string;
  storagePath?: string;
  description?: string;
  order: number;
}

const EMPTY_HAPPENING: Omit<HappeningDoc, 'id'> = { title: '', date: '', type: 'recent', dept: '', order: 0, imageUrl: '', storagePath: '', description: '' };
const EMPTY_AWARD: Omit<AwardDoc, 'id'> = { name: '', issuedBy: '', year: '', details: '', category: 'ranking', order: 0 };
const EMPTY_STUDENT_ACHIEVEMENT: Omit<StudentAchievementDoc, 'id'> = {
  studentName: '',
  achievementTitle: '',
  department: '',
  category: 'Hackathon',
  badge: '',
  year: '2026',
  imageUrl: '',
  storagePath: '',
  description: '',
  order: 0,
};

export default function NewsAwardsDataAdmin() {
  const [tab, setTab] = useState<'happenings' | 'awards' | 'student-achievements'>('student-achievements');

  return (
    <div className="admin-section">
      <div className="admin-card">
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
          <button className={`admin-btn ${tab === 'student-achievements' ? 'admin-btn--primary' : 'admin-btn--ghost'}`} onClick={() => setTab('student-achievements')}>
            🎓 Student Achievements (Hero Ticker)
          </button>
          <button className={`admin-btn ${tab === 'happenings' ? 'admin-btn--primary' : 'admin-btn--ghost'}`} onClick={() => setTab('happenings')}>
            Happenings
          </button>
          <button className={`admin-btn ${tab === 'awards' ? 'admin-btn--primary' : 'admin-btn--ghost'}`} onClick={() => setTab('awards')}>
            Accreditations & Awards
          </button>
        </div>
      </div>
      {tab === 'student-achievements' ? <StudentAchievementsPanel /> : tab === 'happenings' ? <HappeningsPanel /> : <AwardsPanel />}
    </div>
  );
}

function StudentAchievementsPanel() {
  const { docs: items, loading } = useOrderedCollection<StudentAchievementDoc>('studentAchievements', 'order');
  const [form, setForm] = useState<Omit<StudentAchievementDoc, 'id'>>(EMPTY_STUDENT_ACHIEVEMENT);
  const [editing, setEditing] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const set = (k: string, v: string | number) => setForm((p) => ({ ...p, [k]: v }));
  const handleImage = (r: UploadResult) => setForm((p) => ({ ...p, imageUrl: r.url, storagePath: r.path }));

  const save = async () => {
    if (!form.studentName || !form.achievementTitle) {
      return alert('Student Name / Team Name and Achievement Title are required.');
    }
    setSaving(true);
    try {
      if (editing) {
        await updateDoc(doc(db, 'studentAchievements', editing), { ...form });
      } else {
        await addDoc(collection(db, 'studentAchievements'), {
          ...form,
          order: form.order || items.length + 1,
          createdAt: serverTimestamp(),
        });
      }
      setForm(EMPTY_STUDENT_ACHIEVEMENT);
      setEditing(null);
    } catch (e) {
      alert(`Couldn't save: ${(e as Error).message}`);
    } finally {
      setSaving(false);
    }
  };

  const startEdit = (it: StudentAchievementDoc) => {
    setEditing(it.id);
    setForm({
      studentName: it.studentName,
      achievementTitle: it.achievementTitle,
      department: it.department || '',
      category: it.category || 'Hackathon',
      badge: it.badge || '',
      year: it.year || '',
      imageUrl: it.imageUrl || '',
      storagePath: it.storagePath || '',
      description: it.description || '',
      order: it.order || 0,
    });
  };

  const remove = async (id: string) => {
    if (!confirm('Delete this student achievement?')) return;
    try {
      await deleteDoc(doc(db, 'studentAchievements', id));
    } catch (e) {
      alert(`Couldn't delete: ${(e as Error).message}`);
    }
  };

  return (
    <>
      <div className="admin-card">
        <h2 className="admin-card__title">{editing ? 'Edit Student Achievement' : 'Add Student Achievement'}</h2>
        <p style={{ fontSize: '0.85rem', color: '#6b7280', marginBottom: '1.25rem' }}>
          Manage dynamic student achievements displayed in the Happenings page Hero scrolling ticker.
        </p>
        <div className="admin-form-grid">
          <div className="admin-field">
            <label htmlFor="st-name">Student Name / Team Name *</label>
            <input
              id="st-name"
              value={form.studentName}
              onChange={(e) => set('studentName', e.target.value)}
              placeholder="e.g. P. Sai Deepika & Team, K. Charitha"
            />
          </div>
          <div className="admin-field">
            <label htmlFor="st-dept">Department / Program</label>
            <input
              id="st-dept"
              value={form.department}
              onChange={(e) => set('department', e.target.value)}
              placeholder="e.g. Computer Science & Engineering"
            />
          </div>
          <div className="admin-field admin-field--full">
            <label htmlFor="st-title">Achievement Title / Event *</label>
            <input
              id="st-title"
              value={form.achievementTitle}
              onChange={(e) => set('achievementTitle', e.target.value)}
              placeholder="e.g. 1st Prize @ Smart India Hackathon (National Level)"
            />
          </div>
          <div className="admin-field">
            <label htmlFor="st-category">Category</label>
            <input
              id="st-category"
              value={form.category}
              onChange={(e) => set('category', e.target.value)}
              placeholder="e.g. National Hackathon, Motorsports, Placements"
            />
          </div>
          <div className="admin-field">
            <label htmlFor="st-badge">Badge / Prize Pill</label>
            <input
              id="st-badge"
              value={form.badge}
              onChange={(e) => set('badge', e.target.value)}
              placeholder="e.g. 1st Prize, Gold Medal, ₹44 LPA"
            />
          </div>
          <div className="admin-field">
            <label htmlFor="st-year">Year</label>
            <input
              id="st-year"
              value={form.year}
              onChange={(e) => set('year', e.target.value)}
              placeholder="e.g. 2026"
            />
          </div>
          <div className="admin-field">
            <label htmlFor="st-order">Display Order</label>
            <input
              id="st-order"
              type="number"
              value={form.order}
              onChange={(e) => set('order', +e.target.value)}
              min={0}
            />
          </div>
          <div className="admin-field admin-field--full">
            <label>Student Photo / Certificate / Trophy Photo</label>
            <ImageUploader
              folder="vwu/student-achievements"
              currentUrl={form.imageUrl}
              onUploaded={handleImage}
              label="Upload Student / Trophy Photo"
              aspect={1}
            />
          </div>
          <div className="admin-field admin-field--full">
            <label htmlFor="st-desc">Short Description / Details (optional)</label>
            <textarea
              id="st-desc"
              rows={2}
              value={form.description}
              onChange={(e) => set('description', e.target.value)}
              placeholder="Brief details about the project or competition."
            />
          </div>
        </div>
        <div className="admin-form-actions">
          {editing && (
            <button
              className="admin-btn admin-btn--ghost"
              onClick={() => {
                setEditing(null);
                setForm(EMPTY_STUDENT_ACHIEVEMENT);
              }}
            >
              Cancel
            </button>
          )}
          <button className="admin-btn admin-btn--primary" onClick={save} disabled={saving}>
            {saving ? 'Saving…' : editing ? 'Update Achievement' : 'Add Achievement'}
          </button>
        </div>
      </div>

      <div className="admin-card">
        <h2 className="admin-card__title">Student Achievements ({items.length})</h2>
        {loading ? (
          <p className="admin-loading">Loading…</p>
        ) : (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Order</th>
                  <th>Photo</th>
                  <th>Student / Team</th>
                  <th>Achievement</th>
                  <th>Category</th>
                  <th>Badge</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {items.map((it) => (
                  <tr key={it.id}>
                    <td>{it.order}</td>
                    <td>
                      {it.imageUrl ? (
                        <img
                          src={it.imageUrl}
                          alt={it.studentName}
                          style={{ width: 44, height: 44, borderRadius: 6, objectFit: 'cover' }}
                        />
                      ) : (
                        <span style={{ color: '#9ca3af', fontSize: '0.8rem' }}>No photo</span>
                      )}
                    </td>
                    <td>
                      <strong>{it.studentName}</strong>
                      {it.department && (
                        <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>{it.department}</div>
                      )}
                    </td>
                    <td>{it.achievementTitle}</td>
                    <td>{it.category}</td>
                    <td>{it.badge || '-'}</td>
                    <td>
                      <button className="admin-btn admin-btn--sm" onClick={() => startEdit(it)}>
                        Edit
                      </button>
                      <button
                        className="admin-btn admin-btn--sm admin-btn--danger"
                        onClick={() => remove(it.id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
                {items.length === 0 && (
                  <tr>
                    <td colSpan={7} className="admin-empty">
                      No custom student achievements added yet (default curated achievements will display).
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
}

function HappeningsPanel() {
  const { docs: items, loading } = useOrderedCollection<HappeningDoc>('happenings', 'order');
  const [form, setForm] = useState<Omit<HappeningDoc, 'id'>>(EMPTY_HAPPENING);
  const [editing, setEditing] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const set = (k: string, v: string | number) => setForm((p) => ({ ...p, [k]: v }));
  const handleImage = (r: UploadResult) => setForm((p) => ({ ...p, imageUrl: r.url, storagePath: r.path }));

  const save = async () => {
    if (!form.title || !form.date) return alert('Title and date are required.');
    setSaving(true);
    try {
      if (editing) {
        await updateDoc(doc(db, 'happenings', editing), { ...form });
      } else {
        await addDoc(collection(db, 'happenings'), { ...form, order: form.order || items.length + 1, createdAt: serverTimestamp() });
      }
      setForm(EMPTY_HAPPENING); setEditing(null);
    } catch (e) {
      alert(`Couldn't save: ${(e as Error).message}`);
    } finally { setSaving(false); }
  };

  const startEdit = (it: HappeningDoc) => {
    setEditing(it.id);
    setForm({ title: it.title, date: it.date, type: it.type, dept: it.dept || '', order: it.order, imageUrl: it.imageUrl || '', storagePath: it.storagePath || '', description: it.description || '' });
  };

  const remove = async (id: string) => {
    if (!confirm('Delete this happening?')) return;
    try { await deleteDoc(doc(db, 'happenings', id)); } catch (e) { alert(`Couldn't delete: ${(e as Error).message}`); }
  };

  return (
    <>
      <div className="admin-card">
        <h2 className="admin-card__title">{editing ? 'Edit Happening' : 'Add Happening'}</h2>
        <div className="admin-form-grid">
          <div className="admin-field admin-field--full">
            <label htmlFor="field-title">Title *</label>
            <input id="field-title" value={form.title} onChange={(e) => set('title', e.target.value)} placeholder="Workshop on AI & Robotics" />
          </div>
          <div className="admin-field">
            <label htmlFor="field-date">Date / Date Range *</label>
            <input id="field-date" value={form.date} onChange={(e) => set('date', e.target.value)} placeholder="March 15, 2026 or March 15–17, 2026" />
          </div>
          <div className="admin-field">
            <label htmlFor="field-type">Type *</label>
            <select id="field-type" value={form.type} onChange={(e) => set('type', e.target.value)}>
              <option value="recent">Recent Event</option>
              <option value="upcoming">Upcoming Event</option>
            </select>
          </div>
          <div className="admin-field">
            <label htmlFor="field-department-optional">Department (optional)</label>
            <input id="field-department-optional" value={form.dept} onChange={(e) => set('dept', e.target.value)} placeholder="Computer Science & Engineering" />
          </div>
          <div className="admin-field">
            <label htmlFor="field-display-order">Display Order</label>
            <input id="field-display-order" type="number" value={form.order} onChange={(e) => set('order', +e.target.value)} min={0} />
          </div>
          <div className="admin-field admin-field--full">
            <label>Cover Photo (optional)</label>
            <ImageUploader
              folder="vwu/happenings"
              currentUrl={form.imageUrl}
              onUploaded={handleImage}
              label="Upload Cover Photo"
              aspect={16 / 9}
            />
          </div>
          <div className="admin-field admin-field--full">
            <label htmlFor="field-description-optional">Description / Excerpt (optional)</label>
            <textarea id="field-description-optional" rows={3} value={form.description} onChange={(e) => set('description', e.target.value)} />
          </div>
        </div>
        <div className="admin-form-actions">
          {editing && <button className="admin-btn admin-btn--ghost" onClick={() => { setEditing(null); setForm(EMPTY_HAPPENING); }}>Cancel</button>}
          <button className="admin-btn admin-btn--primary" onClick={save} disabled={saving}>{saving ? 'Saving…' : editing ? 'Update' : 'Add'}</button>
        </div>
      </div>
      <div className="admin-card">
        <h2 className="admin-card__title">All Happenings ({items.length})</h2>
        {loading ? <p className="admin-loading">Loading…</p> : (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead><tr><th>Order</th><th>Photo</th><th>Title</th><th>Date</th><th>Type</th><th>Dept</th><th>Actions</th></tr></thead>
              <tbody>
                {items.map((it) => (
                  <tr key={it.id}>
                    <td>{it.order}</td>
                    <td>{it.imageUrl ? <img src={it.imageUrl} alt={it.title} style={{ width: 44, height: 28, objectFit: 'cover' }} /> : <span style={{ color: '#9ca3af' }}>None</span>}</td>
                    <td>{it.title}</td><td>{it.date}</td><td><span className={`admin-badge admin-badge--${it.type}`}>{it.type}</span></td><td>{it.dept || '—'}</td>
                    <td>
                      <button className="admin-btn admin-btn--sm" onClick={() => startEdit(it)}>Edit</button>
                      <button className="admin-btn admin-btn--sm admin-btn--danger" onClick={() => remove(it.id)}>Delete</button>
                    </td>
                  </tr>
                ))}
                {items.length === 0 && <tr><td colSpan={7} className="admin-empty">No happenings yet.</td></tr>}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
}

function AwardsPanel() {
  const { docs: items, loading } = useOrderedCollection<AwardDoc>('awards', 'order');
  const [form, setForm] = useState<Omit<AwardDoc, 'id'>>(EMPTY_AWARD);
  const [editing, setEditing] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const set = (k: string, v: string | number) => setForm((p) => ({ ...p, [k]: v }));

  const save = async () => {
    if (!form.name || !form.issuedBy) return alert('Name and issuing body are required.');
    setSaving(true);
    try {
      if (editing) {
        await updateDoc(doc(db, 'awards', editing), { ...form });
      } else {
        await addDoc(collection(db, 'awards'), { ...form, order: form.order || items.length + 1, createdAt: serverTimestamp() });
      }
      setForm(EMPTY_AWARD); setEditing(null);
    } catch (e) {
      alert(`Couldn't save: ${(e as Error).message}`);
    } finally { setSaving(false); }
  };

  const startEdit = (it: AwardDoc) => {
    setEditing(it.id);
    setForm({ name: it.name, issuedBy: it.issuedBy, year: it.year || '', details: it.details || '', category: it.category, order: it.order });
  };

  const remove = async (id: string) => {
    if (!confirm('Delete this award?')) return;
    try { await deleteDoc(doc(db, 'awards', id)); } catch (e) { alert(`Couldn't delete: ${(e as Error).message}`); }
  };

  return (
    <>
      <div className="admin-card">
        <h2 className="admin-card__title">{editing ? 'Edit Award/Ranking/Accreditation' : 'Add Award/Ranking/Accreditation'}</h2>
        <div className="admin-form-grid">
          <div className="admin-field admin-field--full">
            <label htmlFor="field-name">Name *</label>
            <input id="field-name" value={form.name} onChange={(e) => set('name', e.target.value)} placeholder="NAAC Accreditation" />
          </div>
          <div className="admin-field">
            <label htmlFor="field-issued-by">Issued By *</label>
            <input id="field-issued-by" value={form.issuedBy} onChange={(e) => set('issuedBy', e.target.value)} placeholder="National Assessment and Accreditation Council" />
          </div>
          <div className="admin-field">
            <label htmlFor="field-year-optional">Year (optional)</label>
            <input id="field-year-optional" value={form.year} onChange={(e) => set('year', e.target.value)} placeholder="2022" />
          </div>
          <div className="admin-field">
            <label htmlFor="field-category">Category *</label>
            <select id="field-category" value={form.category} onChange={(e) => set('category', e.target.value)}>
              <option value="ranking">Ranking</option>
              <option value="award">Award</option>
              <option value="accreditation">Accreditation</option>
            </select>
          </div>
          <div className="admin-field">
            <label htmlFor="field-display-order-2">Display Order</label>
            <input id="field-display-order-2" type="number" value={form.order} onChange={(e) => set('order', +e.target.value)} min={0} />
          </div>
          <div className="admin-field admin-field--full">
            <label htmlFor="field-details-optional">Details (optional)</label>
            <textarea id="field-details-optional" rows={2} value={form.details} onChange={(e) => set('details', e.target.value)} />
          </div>
        </div>
        <div className="admin-form-actions">
          {editing && <button className="admin-btn admin-btn--ghost" onClick={() => { setEditing(null); setForm(EMPTY_AWARD); }}>Cancel</button>}
          <button className="admin-btn admin-btn--primary" onClick={save} disabled={saving}>{saving ? 'Saving…' : editing ? 'Update' : 'Add'}</button>
        </div>
      </div>
      <div className="admin-card">
        <h2 className="admin-card__title">Awards & Rankings ({items.length})</h2>
        {loading ? <p className="admin-loading">Loading…</p> : (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead><tr><th>Order</th><th>Name</th><th>Category</th><th>Year</th><th>Actions</th></tr></thead>
              <tbody>
                {items.map((it) => (
                  <tr key={it.id}>
                    <td>{it.order}</td><td>{it.name}</td><td>{it.category}</td><td>{it.year}</td>
                    <td>
                      <button className="admin-btn admin-btn--sm" onClick={() => startEdit(it)}>Edit</button>
                      <button className="admin-btn admin-btn--sm admin-btn--danger" onClick={() => remove(it.id)}>Delete</button>
                    </td>
                  </tr>
                ))}
                {items.length === 0 && <tr><td colSpan={5} className="admin-empty">No awards yet.</td></tr>}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
}
