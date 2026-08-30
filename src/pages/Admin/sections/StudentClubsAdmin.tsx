import { useState } from 'react';
import { collection, addDoc, deleteDoc, doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { Laptop, Handshake, Palette, type LucideIcon } from 'lucide-react';
import { db } from '../../../lib/firebase';
import { useOrderedCollection } from '../../../hooks/useCollection';
import { slugify } from '../../../lib/slugify';
import { useImageCropModal } from '../../../components/ImageUploader/useImageCropModal';
import FileUploader from '../../../components/FileUploader/FileUploader';
import { deleteFile, type UploadResult } from '../../../lib/storage';

export interface ClubImage {
  url: string;
  path: string;
}

export interface ClubCommitteeMember {
  name: string;
  designation: string;
  department?: string;
  contact?: string;
}

// Same pipe-separated-columns convention as Faculty's own bulk-import
// textarea ("Name | Designation | Qualification | Specialization | Email") —
// rendered publicly as a Club Members / Designation / Department / Contact
// Details table, department and contact trailing and optional.
function committeeToText(committee: ClubCommitteeMember[] = []): string {
  return committee.map((m) => {
    const cols = [m.name, m.designation, m.department || '', m.contact || ''];
    while (cols.length > 2 && !cols[cols.length - 1]) cols.pop();
    return cols.join(' | ');
  }).join('\n');
}

function textToCommittee(text: string): ClubCommitteeMember[] {
  return text.split('\n').map((l) => l.trim()).filter(Boolean).map((line) => {
    const [name = '', designation = '', department = '', contact = ''] = line.split('|').map((s) => s.trim());
    return { name, designation, ...(department ? { department } : {}), ...(contact ? { contact } : {}) };
  });
}

export interface ClubDoc {
  id: string;
  name: string;
  desc: string;
  category: string;
  order: number;
  // Added after the first ~23 clubs were created, so older docs may not have
  // one yet — the public pages fall back to slugify(name) when this is blank.
  slug?: string;
  // All optional so existing club records (added before these fields
  // existed) keep working unchanged — the public detail page falls back
  // to "coming soon"/hides the section when blank.
  vision?: string;
  mission?: string;
  // Up to MAX_CLUB_IMAGES photos — the first doubles as the detail page's
  // hero image, the rest render in a small gallery beneath it.
  images?: ClubImage[];
  pdfUrl?: string;
  pdfStoragePath?: string;
  committee?: ClubCommitteeMember[];
}

export const MAX_CLUB_IMAGES = 3;

interface FormState extends Omit<ClubDoc, 'id' | 'committee'> {
  committeeText: string;
}

const EMPTY: FormState = {
  name: '', desc: '', category: 'Technical Clubs', order: 0, slug: '',
  vision: '', mission: '', images: [], pdfUrl: '', pdfStoragePath: '', committeeText: '',
};

export const CLUB_CATEGORIES = ['Technical Clubs', 'Social & Service Clubs', 'Creative & Arts Clubs'];

export const CLUB_CATEGORY_ICONS: Record<string, LucideIcon> = {
  'Technical Clubs': Laptop,
  'Social & Service Clubs': Handshake,
  'Creative & Arts Clubs': Palette,
};

export default function StudentClubsAdmin() {
  const { docs: clubs, loading } = useOrderedCollection<ClubDoc>('studentClubs', 'order');
  const [form, setForm] = useState<FormState>(EMPTY);
  const [editing, setEditing] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const { openCrop, cropModal } = useImageCropModal(4 / 3);
  const [uploadingSlot, setUploadingSlot] = useState<number | null>(null);

  const set = (k: string, v: string | number) => setForm((p) => ({ ...p, [k]: v }));
  const handlePdf = (r: UploadResult) => setForm((p) => ({ ...p, pdfUrl: r.url, pdfStoragePath: r.path }));
  const removePdf = () => setForm((p) => ({ ...p, pdfUrl: '', pdfStoragePath: '' }));

  const images = form.images || [];

  const addImage = (file: File) => {
    setUploadingSlot(images.length);
    openCrop(file, 'vwu/student-clubs', (result) => {
      setForm((p) => ({ ...p, images: [...(p.images || []), { url: result.url, path: result.path }] }));
      setUploadingSlot(null);
    });
  };

  const replaceImage = (index: number, file: File) => {
    setUploadingSlot(index);
    openCrop(file, 'vwu/student-clubs', (result) => {
      setForm((p) => {
        const next = [...(p.images || [])];
        next[index] = { url: result.url, path: result.path };
        return { ...p, images: next };
      });
      setUploadingSlot(null);
    });
  };

  const removeImage = (index: number) => {
    setForm((p) => ({ ...p, images: (p.images || []).filter((_, i) => i !== index) }));
  };

  const save = async () => {
    if (!form.name) return alert('Club name is required.');
    setSaving(true);
    try {
      const slug = form.slug ? slugify(form.slug) : slugify(form.name);
      const original = editing ? clubs.find((c) => c.id === editing) : null;
      const { committeeText, ...rest } = form;
      const payload = { ...rest, slug, committee: textToCommittee(committeeText) };
      if (editing) {
        await updateDoc(doc(db, 'studentClubs', editing), payload);
      } else {
        await addDoc(collection(db, 'studentClubs'), { ...payload, order: form.order || clubs.length + 1, createdAt: serverTimestamp() });
      }
      // Clean up any Storage files no longer referenced, only after the doc
      // write succeeds — covers images that were replaced or removed.
      const keptPaths = new Set((form.images || []).map((img) => img.path));
      for (const img of original?.images || []) {
        if (img.path && !keptPaths.has(img.path)) await deleteFile(img.path);
      }
      if (original?.pdfStoragePath && original.pdfStoragePath !== form.pdfStoragePath) await deleteFile(original.pdfStoragePath);
      setForm({ ...EMPTY, category: form.category }); setEditing(null);
    } catch (e) {
      alert(`Couldn't save: ${(e as Error).message}`);
    } finally { setSaving(false); }
  };

  const startEdit = (c: ClubDoc) => {
    setEditing(c.id);
    setForm({
      name: c.name, desc: c.desc, category: c.category, order: c.order, slug: c.slug || '',
      vision: c.vision || '', mission: c.mission || '',
      images: c.images || [],
      pdfUrl: c.pdfUrl || '', pdfStoragePath: c.pdfStoragePath || '',
      committeeText: committeeToText(c.committee),
    });
  };

  const remove = async (id: string) => {
    if (!confirm('Delete this club?')) return;
    try {
      const club = clubs.find((c) => c.id === id);
      await deleteDoc(doc(db, 'studentClubs', id));
      for (const img of club?.images || []) if (img.path) await deleteFile(img.path);
      if (club?.pdfStoragePath) await deleteFile(club.pdfStoragePath);
    } catch (e) {
      alert(`Couldn't delete: ${(e as Error).message}`);
    }
  };

  return (
    <div className="admin-section">
      <div className="admin-card">
        <h2 className="admin-card__title">{editing ? 'Edit Club' : 'Add Club'}</h2>
        <div className="admin-form-grid">
          <div className="admin-field admin-field--full">
            <label>Club Images (up to {MAX_CLUB_IMAGES})</label>
            <p className="admin-field__hint">
              The first image doubles as this club's page banner; any others show in a small gallery below it.
            </p>
            <div className="admin-image-grid">
              {images.map((img, i) => (
                <div key={img.path || i} className="admin-image-card">
                  <img src={img.url} alt={`Club image ${i + 1}`} />
                  <div className="admin-image-card__actions">
                    <label className="admin-btn admin-btn--sm" style={{ opacity: uploadingSlot !== null ? 0.5 : 1 }}>
                      {uploadingSlot === i ? 'Uploading…' : 'Replace'}
                      <input
                        type="file"
                        accept="image/*"
                        hidden
                        disabled={uploadingSlot !== null}
                        onChange={(e) => { const f = e.target.files?.[0]; if (f) replaceImage(i, f); e.target.value = ''; }}
                      />
                    </label>
                    <button className="admin-btn admin-btn--sm admin-btn--danger" onClick={() => removeImage(i)}>
                      Remove
                    </button>
                  </div>
                </div>
              ))}
              {images.length < MAX_CLUB_IMAGES && (
                <div className="admin-image-card">
                  <div className="admin-image-card__empty">Add a photo</div>
                  <div className="admin-image-card__actions">
                    <label className="admin-btn admin-btn--sm" style={{ opacity: uploadingSlot !== null ? 0.5 : 1 }}>
                      {uploadingSlot === images.length ? 'Uploading…' : 'Add Photo'}
                      <input
                        type="file"
                        accept="image/*"
                        hidden
                        disabled={uploadingSlot !== null}
                        onChange={(e) => { const f = e.target.files?.[0]; if (f) addImage(f); e.target.value = ''; }}
                      />
                    </label>
                  </div>
                </div>
              )}
            </div>
          </div>
          <div className="admin-field">
            <label htmlFor="field-club-name">Club Name *</label>
            <input id="field-club-name" value={form.name} onChange={(e) => set('name', e.target.value)} placeholder="CodeChef Vishnu Women's University Chapter" />
          </div>
          <div className="admin-field">
            <label htmlFor="field-category">Category</label>
            <select id="field-category" value={form.category} onChange={(e) => set('category', e.target.value)}>
              {CLUB_CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div className="admin-field">
            <label htmlFor="field-display-order">Display Order</label>
            <input id="field-display-order" type="number" value={form.order} onChange={(e) => set('order', +e.target.value)} min={0} />
          </div>
          <div className="admin-field">
            <label>URL Slug (optional — auto-generated from name if left blank)</label>
            <input value={form.slug} onChange={(e) => set('slug', e.target.value)} placeholder="codechef-svecw-chapter" />
          </div>
          <div className="admin-field admin-field--full">
            <label htmlFor="field-description">Description</label>
            <textarea id="field-description" rows={3} value={form.desc} onChange={(e) => set('desc', e.target.value)} placeholder="What the club does…" />
          </div>
          <div className="admin-field admin-field--full">
            <label>Vision</label>
            <textarea rows={3} value={form.vision} onChange={(e) => set('vision', e.target.value)} placeholder="What this club aspires to achieve…" />
          </div>
          <div className="admin-field admin-field--full">
            <label>Mission</label>
            <textarea rows={3} value={form.mission} onChange={(e) => set('mission', e.target.value)} placeholder="How this club works toward that vision…" />
          </div>
          <div className="admin-field admin-field--full">
            <label>Committee Members</label>
            <p className="admin-field__hint">
              Optional. One per line, as "Name | Designation | Department | Contact" (department and contact
              optional). Shown on this club's public page as a table under "The {form.name || '[Club Name]'}{' '}
              Committee is constituted with the following members".
            </p>
            <textarea
              rows={6}
              value={form.committeeText}
              onChange={(e) => set('committeeText', e.target.value)}
              placeholder={'Dr. G. Srinivasa Rao | Principal, Chairperson | Mechanical | 9666832284\nMrs. G. Bharathi | Faculty Coordinator | EEE | 9491771401\nR. Puja Devi | Member | Mechanical | 9121825818'}
            />
          </div>
          <div className="admin-field admin-field--full">
            <label>Club Document / PDF</label>
            <p className="admin-field__hint">
              Optional. Shown on this club's public page as a "View / Download Club Document" button.
            </p>
            <FileUploader folder="vwu/student-clubs/documents" currentUrl={form.pdfUrl} onUploaded={handlePdf} label="Upload Club PDF" />
            {form.pdfUrl && (
              <div style={{ marginTop: '0.5rem', display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                <a href={form.pdfUrl} target="_blank" rel="noopener noreferrer">View current PDF ↗</a>
                <button type="button" className="admin-btn admin-btn--ghost admin-btn--sm" onClick={removePdf}>
                  Remove PDF
                </button>
              </div>
            )}
          </div>
        </div>
        <div className="admin-form-actions">
          {editing && <button className="admin-btn admin-btn--ghost" onClick={() => { setEditing(null); setForm(EMPTY); }}>Cancel</button>}
          <button className="admin-btn admin-btn--primary" onClick={save} disabled={saving}>{saving ? 'Saving…' : editing ? 'Update' : 'Add Club'}</button>
        </div>
        {cropModal}
      </div>

      <div className="admin-card">
        <h2 className="admin-card__title">All Clubs ({clubs.length})</h2>
        {loading ? <p className="admin-loading">Loading…</p> : (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead><tr><th>Image</th><th>Name</th><th>Category</th><th>Order</th><th>URL Slug</th><th>Document</th><th>Actions</th></tr></thead>
              <tbody>
                {clubs.map((c) => (
                  <tr key={c.id}>
                    <td>
                      {c.images && c.images.length > 0 ? (
                        <>
                          <img src={c.images[0].url} alt="" className="admin-table__avatar" />
                          {c.images.length > 1 && <span className="admin-badge admin-badge--sm">+{c.images.length - 1}</span>}
                        </>
                      ) : '—'}
                    </td>
                    <td>{c.name}</td>
                    <td><span className="admin-badge admin-badge--sm">{c.category}</span></td>
                    <td>{c.order}</td>
                    <td><code>{c.slug || slugify(c.name)}</code></td>
                    <td>{c.pdfUrl ? <a href={c.pdfUrl} target="_blank" rel="noopener noreferrer">View</a> : '—'}</td>
                    <td>
                      <button className="admin-btn admin-btn--sm" onClick={() => startEdit(c)}>Edit</button>
                      <button className="admin-btn admin-btn--sm admin-btn--danger" onClick={() => remove(c.id)}>Delete</button>
                    </td>
                  </tr>
                ))}
                {clubs.length === 0 && <tr><td colSpan={7} className="admin-empty">No clubs yet.</td></tr>}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
