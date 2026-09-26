import { useState } from 'react';
import { collection, addDoc, updateDoc, deleteDoc, doc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../../lib/firebase';
import { useOrderedCollection } from '../../../hooks/useCollection';
import FileUploader from '../../../components/FileUploader/FileUploader';
import { deleteFile, type UploadResult } from '../../../lib/storage';
import { DEFAULT_FOOTER_COLUMNS } from '../../../components/Footer/Footer';
import {
  FOOTER_COLUMNS_COLLECTION, FOOTER_LINKS_COLLECTION,
  type FooterColumnDoc, type FooterLinkDoc, type FooterLinkType,
} from '../../../lib/footerLinks';

// Note (2026-09-27): the footer's link columns used to be entirely hardcoded
// in Footer.tsx. This section makes them fully dynamic: columns themselves
// can be added/renamed/reordered/deleted, and each column's links can be
// added/edited/reordered/deleted — see Footer.tsx's own note (near
// DEFAULT_FOOTER_COLUMNS) for how the public site picks between this data
// and the original hardcoded fallback. "Load Existing Footer Links" below is
// a one-time migration of that original content into this editor, so nothing
// already published is lost by switching to the dynamic system. The shared
// collection names/types live in lib/footerLinks.ts (not here, and not in
// Footer.tsx) so the two files don't import each other.
export { FOOTER_COLUMNS_COLLECTION, FOOTER_LINKS_COLLECTION };
export type { FooterColumnDoc, FooterLinkDoc, FooterLinkType };

const LINK_TYPE_LABELS: Record<FooterLinkType, string> = {
  internal: 'Another page on this website',
  external: 'An external website',
  pdf: 'Upload a PDF',
  image: 'Upload an image',
};

interface FormState {
  columnId: string;
  label: string;
  linkType: FooterLinkType;
  url: string;
  fileUrl: string;
  storagePath: string;
  disabled: boolean;
}

function emptyForm(columnId: string): FormState {
  return { columnId, label: '', linkType: 'internal', url: '', fileUrl: '', storagePath: '', disabled: false };
}

function isValidInternalPath(v: string) {
  return v.trim().startsWith('/');
}
function isValidExternalUrl(v: string) {
  return /^https?:\/\//i.test(v.trim());
}

// What this form state would actually resolve to on the public footer —
// used both to validate before saving and to show a live "goes to" preview.
function resolveTarget(f: FormState): { valid: boolean; hint: string } {
  switch (f.linkType) {
    case 'internal':
      return { valid: isValidInternalPath(f.url), hint: 'Must start with "/" — e.g. /about or /academics/cse' };
    case 'external':
      return { valid: isValidExternalUrl(f.url), hint: 'Must start with http:// or https://' };
    case 'pdf':
    case 'image':
      return { valid: !!f.fileUrl, hint: `Upload a ${f.linkType === 'pdf' ? 'PDF' : 'image'} file above` };
  }
}

export default function FooterLinksAdmin() {
  const { docs: columns, loading: columnsLoading } = useOrderedCollection<FooterColumnDoc>(FOOTER_COLUMNS_COLLECTION, 'order');
  const { docs: links, loading: linksLoading } = useOrderedCollection<FooterLinkDoc>(FOOTER_LINKS_COLLECTION, 'order');
  const [newColumnLabel, setNewColumnLabel] = useState('');
  const [editingLinkId, setEditingLinkId] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm(''));
  const [saving, setSaving] = useState(false);
  const [seeding, setSeeding] = useState(false);

  const target = resolveTarget(form);
  const labelValid = form.label.trim().length > 0;

  const seedDefaults = async () => {
    if (!confirm('Load the site\'s existing footer links into this editor? Do this once, at most — running it again would add a second copy of every column.')) return;
    setSeeding(true);
    try {
      for (let ci = 0; ci < DEFAULT_FOOTER_COLUMNS.length; ci++) {
        const col = DEFAULT_FOOTER_COLUMNS[ci];
        const colRef = await addDoc(collection(db, FOOTER_COLUMNS_COLLECTION), { label: col.label, order: ci, createdAt: serverTimestamp() });
        for (let li = 0; li < col.links.length; li++) {
          const link = col.links[li];
          const isPdf = !link.disabled && /\.pdf(\?|$)/i.test(link.href);
          await addDoc(collection(db, FOOTER_LINKS_COLLECTION), {
            columnId: colRef.id,
            label: link.label,
            linkType: link.disabled ? 'internal' : isPdf ? 'pdf' : (link.external ? 'external' : 'internal'),
            url: !link.disabled && !isPdf ? link.href : '',
            fileUrl: !link.disabled && isPdf ? link.href : '',
            storagePath: '',
            disabled: !!link.disabled,
            order: li,
            createdAt: serverTimestamp(),
          });
        }
      }
    } catch (e) {
      alert(`Couldn't load existing links: ${(e as Error).message}`);
    } finally {
      setSeeding(false);
    }
  };

  const addColumn = async () => {
    const label = newColumnLabel.trim();
    if (!label) return;
    setSaving(true);
    try {
      await addDoc(collection(db, FOOTER_COLUMNS_COLLECTION), { label, order: columns.length, createdAt: serverTimestamp() });
      setNewColumnLabel('');
    } catch (e) {
      alert(`Couldn't add column: ${(e as Error).message}`);
    } finally {
      setSaving(false);
    }
  };

  const renameColumn = async (col: FooterColumnDoc, label: string) => {
    const trimmed = label.trim();
    if (!trimmed || trimmed === col.label) return;
    try {
      await updateDoc(doc(db, FOOTER_COLUMNS_COLLECTION, col.id), { label: trimmed });
    } catch (e) {
      alert(`Couldn't rename column: ${(e as Error).message}`);
    }
  };

  const moveColumn = async (col: FooterColumnDoc, dir: -1 | 1) => {
    const i = columns.findIndex((c) => c.id === col.id);
    const j = i + dir;
    if (j < 0 || j >= columns.length) return;
    const other = columns[j];
    try {
      await Promise.all([
        updateDoc(doc(db, FOOTER_COLUMNS_COLLECTION, col.id), { order: other.order }),
        updateDoc(doc(db, FOOTER_COLUMNS_COLLECTION, other.id), { order: col.order }),
      ]);
    } catch (e) {
      alert(`Couldn't reorder columns: ${(e as Error).message}`);
    }
  };

  const deleteColumn = async (col: FooterColumnDoc) => {
    const columnLinks = links.filter((l) => l.columnId === col.id);
    if (!confirm(`Delete the "${col.label}" column${columnLinks.length ? ` and its ${columnLinks.length} link(s)` : ''}? This cannot be undone.`)) return;
    try {
      await Promise.all([
        ...columnLinks.map(async (l) => {
          if (l.storagePath) await deleteFile(l.storagePath).catch(() => {});
          return deleteDoc(doc(db, FOOTER_LINKS_COLLECTION, l.id));
        }),
        deleteDoc(doc(db, FOOTER_COLUMNS_COLLECTION, col.id)),
      ]);
      if (form.columnId === col.id) setForm(emptyForm(columns[0]?.id === col.id ? '' : columns[0]?.id || ''));
    } catch (e) {
      alert(`Couldn't delete column: ${(e as Error).message}`);
    }
  };

  const startAddLink = (columnId: string) => { setEditingLinkId(null); setForm(emptyForm(columnId)); };
  const startEditLink = (link: FooterLinkDoc) => {
    setEditingLinkId(link.id);
    setForm({
      columnId: link.columnId,
      label: link.label,
      linkType: link.linkType,
      url: link.url || '',
      fileUrl: link.fileUrl || '',
      storagePath: link.storagePath || '',
      disabled: !!link.disabled,
    });
  };

  const saveLink = async () => {
    if (!form.columnId || !labelValid || (!form.disabled && !target.valid)) return;
    setSaving(true);
    try {
      const payload = {
        columnId: form.columnId,
        label: form.label.trim(),
        linkType: form.linkType,
        url: form.linkType === 'internal' || form.linkType === 'external' ? form.url.trim() : '',
        fileUrl: form.linkType === 'pdf' || form.linkType === 'image' ? form.fileUrl : '',
        storagePath: form.linkType === 'pdf' || form.linkType === 'image' ? form.storagePath : '',
        disabled: form.disabled,
      };
      if (editingLinkId) {
        await updateDoc(doc(db, FOOTER_LINKS_COLLECTION, editingLinkId), payload);
      } else {
        const columnLinkCount = links.filter((l) => l.columnId === form.columnId).length;
        await addDoc(collection(db, FOOTER_LINKS_COLLECTION), { ...payload, order: columnLinkCount, createdAt: serverTimestamp() });
      }
      startAddLink(form.columnId);
    } catch (e) {
      alert(`Couldn't save this link: ${(e as Error).message}`);
    } finally {
      setSaving(false);
    }
  };

  const removeLink = async (link: FooterLinkDoc) => {
    if (!confirm(`Remove "${link.label}" from the footer?`)) return;
    try {
      if (link.storagePath) await deleteFile(link.storagePath).catch(() => {});
      await deleteDoc(doc(db, FOOTER_LINKS_COLLECTION, link.id));
      if (editingLinkId === link.id) startAddLink(link.columnId);
    } catch (e) {
      alert(`Couldn't remove this link: ${(e as Error).message}`);
    }
  };

  const moveLink = async (link: FooterLinkDoc, dir: -1 | 1) => {
    const columnLinks = links.filter((l) => l.columnId === link.columnId);
    const i = columnLinks.findIndex((l) => l.id === link.id);
    const j = i + dir;
    if (j < 0 || j >= columnLinks.length) return;
    const other = columnLinks[j];
    try {
      await Promise.all([
        updateDoc(doc(db, FOOTER_LINKS_COLLECTION, link.id), { order: other.order }),
        updateDoc(doc(db, FOOTER_LINKS_COLLECTION, other.id), { order: link.order }),
      ]);
    } catch (e) {
      alert(`Couldn't reorder: ${(e as Error).message}`);
    }
  };

  const handleUploaded = (r: UploadResult) => setForm((p) => ({ ...p, fileUrl: r.url, storagePath: r.path }));

  const loading = columnsLoading || linksLoading;

  return (
    <div className="admin-section">
      <div className="admin-card">
        <h2 className="admin-card__title">Footer Columns &amp; Links</h2>
        <p className="admin-lead" style={{ marginBottom: '1.25rem' }}>
          Manage the footer's link columns directly — add a column, rename or remove one, and
          add, edit, reorder or remove the links inside it. Each link points at another page on
          this website, an external website, or a file you upload (a PDF or an image).
        </p>

        {!loading && columns.length === 0 && (
          <div className="admin-card" style={{ background: 'var(--color-off-white, #f8fafc)' }}>
            <p className="admin-field__hint" style={{ marginTop: 0 }}>
              This editor is empty — the public footer is still showing its original built-in
              columns (University, Academics &amp; Portals, Student Life &amp; Services,
              Compliance &amp; Disclosures). Load them in here once to start editing them, or just
              add a brand new column below instead.
            </p>
            <button type="button" className="admin-btn admin-btn--primary" onClick={seedDefaults} disabled={seeding}>
              {seeding ? 'Loading…' : 'Load Existing Footer Links'}
            </button>
          </div>
        )}

        <div className="admin-form-actions" style={{ justifyContent: 'flex-start', gap: '0.75rem' }}>
          <input
            value={newColumnLabel}
            onChange={(e) => setNewColumnLabel(e.target.value)}
            placeholder="New column name — e.g. Quick Links"
            style={{ flex: '1 1 260px' }}
            onKeyDown={(e) => { if (e.key === 'Enter') addColumn(); }}
          />
          <button type="button" className="admin-btn admin-btn--primary" onClick={addColumn} disabled={saving || !newColumnLabel.trim()}>
            + Add Column
          </button>
        </div>
      </div>

      {loading ? (
        <div className="admin-card"><p className="admin-loading">Loading…</p></div>
      ) : columns.map((col, ci) => {
        const columnLinks = links.filter((l) => l.columnId === col.id);
        const addingHere = !editingLinkId && form.columnId === col.id;
        return (
          <div className="admin-card" key={col.id}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
              <input
                key={col.id + col.label}
                defaultValue={col.label}
                onBlur={(e) => renameColumn(col, e.target.value)}
                style={{ fontWeight: 700, fontSize: '1rem', flex: '1 1 220px' }}
                aria-label="Column name"
              />
              <button type="button" className="admin-btn admin-btn--sm" onClick={() => moveColumn(col, -1)} disabled={ci === 0} title="Move column left">←</button>
              <button type="button" className="admin-btn admin-btn--sm" onClick={() => moveColumn(col, 1)} disabled={ci === columns.length - 1} title="Move column right">→</button>
              <button type="button" className="admin-btn admin-btn--sm admin-btn--danger" onClick={() => deleteColumn(col)}>Delete Column</button>
            </div>

            {columnLinks.length === 0 ? (
              <p className="admin-field__hint">No links in this column yet.</p>
            ) : (
              <ul style={{ listStyle: 'none', margin: '0 0 1rem', padding: 0, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {columnLinks.map((link, i) => (
                  <li
                    key={link.id}
                    style={{
                      display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap',
                      border: editingLinkId === link.id ? '1.5px solid var(--color-accent, #c9a84c)' : '1px solid var(--color-light-gray, #e5e7eb)',
                      borderRadius: 8, padding: '0.6rem 0.9rem',
                    }}
                  >
                    <div style={{ flex: '1 1 220px', minWidth: 0 }}>
                      <strong>{link.label}</strong>{link.disabled && ' (disabled)'}
                      <div className="admin-field__hint" style={{ margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {LINK_TYPE_LABELS[link.linkType]}{(link.url || link.fileUrl) ? ` — ${link.url || link.fileUrl}` : ''}
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: '0.4rem' }}>
                      <button type="button" className="admin-btn admin-btn--sm" onClick={() => moveLink(link, -1)} disabled={i === 0} title="Move up">↑</button>
                      <button type="button" className="admin-btn admin-btn--sm" onClick={() => moveLink(link, 1)} disabled={i === columnLinks.length - 1} title="Move down">↓</button>
                      <button type="button" className="admin-btn admin-btn--sm" onClick={() => startEditLink(link)}>Edit</button>
                      <button type="button" className="admin-btn admin-btn--sm admin-btn--danger" onClick={() => removeLink(link)}>Remove</button>
                    </div>
                  </li>
                ))}
              </ul>
            )}

            {(addingHere || editingLinkId) && (form.columnId === col.id) ? (
              <div className="admin-form-grid" style={{ borderTop: '1px dashed var(--color-light-gray, #e5e7eb)', paddingTop: '1rem' }}>
                <div className="admin-field">
                  <label htmlFor={`fl-label-${col.id}`}>Link text</label>
                  <input id={`fl-label-${col.id}`} value={form.label} onChange={(e) => setForm((p) => ({ ...p, label: e.target.value }))} placeholder="e.g. Convocation Brochure" />
                </div>
                <div className="admin-field">
                  <label htmlFor={`fl-type-${col.id}`}>Links to</label>
                  <select
                    id={`fl-type-${col.id}`}
                    value={form.linkType}
                    onChange={(e) => setForm((p) => ({ ...p, linkType: e.target.value as FooterLinkType, url: '', fileUrl: '', storagePath: '' }))}
                  >
                    {(Object.keys(LINK_TYPE_LABELS) as FooterLinkType[]).map((t) => <option key={t} value={t}>{LINK_TYPE_LABELS[t]}</option>)}
                  </select>
                </div>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', alignSelf: 'center' }}>
                  <input type="checkbox" checked={form.disabled} onChange={(e) => setForm((p) => ({ ...p, disabled: e.target.checked }))} />
                  Disabled (shown greyed out, not clickable)
                </label>

                {!form.disabled && (form.linkType === 'internal' || form.linkType === 'external') && (
                  <div className="admin-field admin-field--full">
                    <label htmlFor={`fl-url-${col.id}`}>{form.linkType === 'internal' ? 'Page path' : 'Website URL'}</label>
                    <input
                      id={`fl-url-${col.id}`}
                      value={form.url}
                      onChange={(e) => setForm((p) => ({ ...p, url: e.target.value }))}
                      placeholder={form.linkType === 'internal' ? '/academics/cse' : 'https://example.com'}
                    />
                    {form.url.trim() && !target.valid && (
                      <span className="admin-field__hint" style={{ color: '#dc2626' }}>{target.hint}</span>
                    )}
                  </div>
                )}

                {!form.disabled && (form.linkType === 'pdf' || form.linkType === 'image') && (
                  <div className="admin-field admin-field--full">
                    <label>{form.linkType === 'pdf' ? 'PDF file' : 'Image file'}</label>
                    <FileUploader
                      folder="vwu/footer-links"
                      currentUrl={form.fileUrl}
                      onUploaded={handleUploaded}
                      label={form.linkType === 'pdf' ? 'Upload PDF' : 'Upload Image'}
                      {...(form.linkType === 'image'
                        ? { accept: 'image/*', isValidFile: (f: File) => f.type.startsWith('image/'), invalidFileMessage: 'Please select an image file.' }
                        : {})}
                    />
                  </div>
                )}

                <div className="admin-form-actions admin-field--full">
                  {editingLinkId && <button type="button" className="admin-btn admin-btn--ghost" onClick={() => startAddLink(col.id)} disabled={saving}>Cancel</button>}
                  <button type="button" className="admin-btn admin-btn--primary" onClick={saveLink} disabled={saving || !labelValid || (!form.disabled && !target.valid)}>
                    {saving ? 'Saving…' : editingLinkId ? 'Save Changes' : '+ Add Link'}
                  </button>
                </div>
              </div>
            ) : (
              <button type="button" className="admin-btn admin-btn--sm" onClick={() => startAddLink(col.id)}>+ Add Link to {col.label}</button>
            )}
          </div>
        );
      })}
    </div>
  );
}
