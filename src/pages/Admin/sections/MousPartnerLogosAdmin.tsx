import { useState } from 'react';
import { collection, addDoc, deleteDoc, doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../../lib/firebase';
import { useOrderedCollection } from '../../../hooks/useCollection';
import ImageUploader from '../../../components/ImageUploader/ImageUploader';
import { deleteFile, type UploadResult } from '../../../lib/storage';
import { parseFlexibleTable } from '../../../lib/structuredTable';
import type { ResearchItemDoc } from './ResearchItemsAdmin';

export interface MousPartnerLogoDoc {
  id: string;
  label: string;
  // Groups this partner under a heading on the public page, e.g. "Foreign
  // Universities" — mirrors the "## Section Title" groups the old Data Table
  // format used. Optional: an empty section renders as one flat list.
  section: string;
  // Optional — a partner with no logo yet still shows, just without one.
  imageUrl: string;
  storagePath: string;
  order: number;
}

const EMPTY: Omit<MousPartnerLogoDoc, 'id'> = { label: '', section: '', imageUrl: '', storagePath: '', order: 0 };

// This is now the whole public MoUs page's partner list (name, optional
// group heading, optional small circular logo) — it replaced the old
// Data Table field on the MoUs research item, which is now hidden. See
// copyFromDataTable below for pulling that field's existing partners in
// as a one-time starting point.
export default function MousPartnerLogosAdmin() {
  const { docs, loading } = useOrderedCollection<MousPartnerLogoDoc>('mousPartnerLogos', 'order');
  const { docs: researchItems } = useOrderedCollection<ResearchItemDoc>('researchItems', 'order');
  const mousItem = researchItems.find((it) => it.slug === 'mous');
  const [form, setForm] = useState<Omit<MousPartnerLogoDoc, 'id'>>(EMPTY);
  const [editing, setEditing] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [copying, setCopying] = useState(false);

  const set = (k: string, v: string | number) => setForm((p) => ({ ...p, [k]: v }));
  const handleImage = (r: UploadResult) => setForm((p) => ({ ...p, imageUrl: r.url, storagePath: r.path }));

  const save = async () => {
    if (!form.label) return alert('Partner name is required.');
    setSaving(true);
    try {
      if (editing) {
        await updateDoc(doc(db, 'mousPartnerLogos', editing), { ...form });
      } else {
        await addDoc(collection(db, 'mousPartnerLogos'), { ...form, order: form.order || docs.length + 1, createdAt: serverTimestamp() });
      }
      setForm(EMPTY); setEditing(null);
    } catch (e) {
      alert(`Couldn't save: ${(e as Error).message}`);
    } finally { setSaving(false); }
  };

  const startEdit = (d: MousPartnerLogoDoc) => {
    setEditing(d.id);
    setForm({ label: d.label, section: d.section || '', imageUrl: d.imageUrl, storagePath: d.storagePath || '', order: d.order });
  };

  const remove = async (id: string, storagePath?: string) => {
    if (!confirm('Delete this partner?')) return;
    try {
      if (storagePath) await deleteFile(storagePath);
      await deleteDoc(doc(db, 'mousPartnerLogos', id));
    } catch (e) {
      alert(`Couldn't delete: ${(e as Error).message}`);
    }
  };

  // One-time pull of whatever's still sitting in the old Data Table field
  // (now hidden) into this list, grouped exactly as it already was. Never
  // overwrites or duplicates an entry that's already here (matched by exact
  // name), so it's safe to click more than once, e.g. after adding a new
  // partner to the Data Table by mistake before remembering it's frozen now.
  const copyFromDataTable = async () => {
    if (!mousItem?.tableText) { alert('The Data Table field is empty — nothing to copy.'); return; }
    const sections = parseFlexibleTable(mousItem.tableText).filter((s) => s.headers.length > 0);
    const existing = new Set(docs.map((d) => d.label.trim().toLowerCase()));
    const toAdd: { label: string; section: string }[] = [];
    sections.forEach((sec) => {
      sec.rows.forEach((row) => {
        const name = (row[0] || '').trim();
        if (name && !existing.has(name.toLowerCase())) {
          toAdd.push({ label: name, section: sec.title });
          existing.add(name.toLowerCase());
        }
      });
    });
    if (toAdd.length === 0) { alert('Nothing new to copy — every partner in the Data Table is already listed here.'); return; }
    if (!confirm(`Add ${toAdd.length} partner(s) from the Data Table? Nothing already listed here gets changed.`)) return;
    setCopying(true);
    try {
      let order = docs.length;
      for (const p of toAdd) {
        await addDoc(collection(db, 'mousPartnerLogos'), { label: p.label, section: p.section, imageUrl: '', storagePath: '', order: order++, createdAt: serverTimestamp() });
      }
    } catch (e) {
      alert(`Couldn't copy: ${(e as Error).message}`);
    } finally { setCopying(false); }
  };

  return (
    <div className="admin-section">
      {mousItem?.tableText && (
        <div className="admin-card">
          <h2 className="admin-card__title">Copy from Data Table</h2>
          <p className="admin-lead" style={{ marginBottom: '1rem' }}>
            The old Data Table field on this item still has partners in it. Pull any of them not already listed
            below into this list (grouped the same way), as a one-time starting point — logos can be added
            afterwards. Safe to click more than once; it never touches an entry already listed here.
          </p>
          <button className="admin-btn admin-btn--primary" onClick={copyFromDataTable} disabled={copying}>
            {copying ? 'Copying…' : 'Copy from Data Table'}
          </button>
        </div>
      )}

      <div className="admin-card">
        <h2 className="admin-card__title">{editing ? 'Edit Partner' : 'Add Partner'}</h2>
        <p className="admin-lead" style={{ marginBottom: '1rem' }}>
          This list is the MoUs page's partner list — name, an optional group heading (e.g. "Foreign
          Universities", matching how the page groups them), and an optional small circular logo.
        </p>
        <div className="admin-form-grid">
          <div className="admin-field">
            <label htmlFor="field-partner-name">Partner Name *</label>
            <input id="field-partner-name" value={form.label} onChange={(e) => set('label', e.target.value)} placeholder="Purdue University" />
          </div>
          <div className="admin-field">
            <label htmlFor="field-section">Group Heading (optional)</label>
            <input id="field-section" value={form.section} onChange={(e) => set('section', e.target.value)} placeholder="Foreign Universities" />
          </div>
          <div className="admin-field admin-field--full" style={{ maxWidth: 200 }}>
            <label>Logo (optional)</label>
            <ImageUploader folder="vwu/research-mous" currentUrl={form.imageUrl} onUploaded={handleImage} label="Upload Logo" aspect={1} />
          </div>
          <div className="admin-field">
            <label htmlFor="field-display-order">Display Order</label>
            <input id="field-display-order" type="number" value={form.order} onChange={(e) => set('order', Number(e.target.value))} min={0} />
          </div>
        </div>
        <div className="admin-form-actions">
          {editing && <button className="admin-btn admin-btn--ghost" onClick={() => { setEditing(null); setForm(EMPTY); }}>Cancel</button>}
          <button className="admin-btn admin-btn--primary" onClick={save} disabled={saving}>
            {saving ? 'Saving…' : editing ? 'Update' : 'Add Partner'}
          </button>
        </div>
      </div>

      <div className="admin-card">
        <h2 className="admin-card__title">Partners ({docs.length})</h2>
        {loading ? <p className="admin-loading">Loading…</p> : (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead><tr><th>Order</th><th>Logo</th><th>Partner Name</th><th>Group</th><th>Actions</th></tr></thead>
              <tbody>
                {docs.map((d) => (
                  <tr key={d.id}>
                    <td>{d.order}</td>
                    <td>{d.imageUrl ? <img src={d.imageUrl} alt="" className="admin-table__avatar" /> : '—'}</td>
                    <td>{d.label}</td>
                    <td>{d.section || '—'}</td>
                    <td>
                      <button className="admin-btn admin-btn--sm" onClick={() => startEdit(d)}>Edit</button>
                      <button className="admin-btn admin-btn--sm admin-btn--danger" onClick={() => remove(d.id, d.storagePath)}>Delete</button>
                    </td>
                  </tr>
                ))}
                {docs.length === 0 && (
                  <tr>
                    <td colSpan={5} className="admin-empty">No partners yet — add one above, or copy from the Data Table if it still has some.</td>
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
