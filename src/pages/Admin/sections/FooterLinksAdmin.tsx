import { useState } from 'react';
import { collection, addDoc, updateDoc, deleteDoc, doc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../../lib/firebase';
import { useOrderedCollection, type WithId } from '../../../hooks/useCollection';
import FileUploader from '../../../components/FileUploader/FileUploader';
import { deleteFile, type UploadResult } from '../../../lib/storage';

// Note (2026-09-26): the footer itself (Footer.tsx) is otherwise completely
// static/hardcoded by design — this section only ADDS extra links on top of
// it, appended to the end of whichever existing column an admin picks. It
// never edits or removes anything already in Footer.tsx's own link arrays.
// See Footer.tsx's own comment at FOOTER_LINKS_COLLECTION for the public
// side of this.
export const FOOTER_LINKS_COLLECTION = 'footerLinks';

export type FooterLinkColumn = 'university' | 'academics' | 'student' | 'compliance';
export type FooterLinkType = 'internal' | 'external' | 'pdf' | 'image';

export interface FooterLinkDoc extends WithId {
  column: FooterLinkColumn;
  label: string;
  linkType: FooterLinkType;
  // 'internal' (a path on this site, e.g. "/about") or 'external' (a full
  // http(s) URL) store their destination here.
  url?: string;
  // 'pdf' / 'image' store their uploaded file here instead.
  fileUrl?: string;
  storagePath?: string;
  order: number;
}

const COLUMN_DEFS: { key: FooterLinkColumn; label: string }[] = [
  { key: 'university', label: 'University' },
  { key: 'academics', label: 'Academics & Portals' },
  { key: 'student', label: 'Student Life & Services' },
  { key: 'compliance', label: 'Compliance & Disclosures' },
];

const LINK_TYPE_LABELS: Record<FooterLinkType, string> = {
  internal: 'Another page on this website',
  external: 'An external website',
  pdf: 'Upload a PDF',
  image: 'Upload an image',
};

interface FormState {
  column: FooterLinkColumn;
  label: string;
  linkType: FooterLinkType;
  url: string;
  fileUrl: string;
  storagePath: string;
}

const EMPTY_FORM: FormState = { column: 'university', label: '', linkType: 'internal', url: '', fileUrl: '', storagePath: '' };

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
  const { docs: links, loading } = useOrderedCollection<FooterLinkDoc>(FOOTER_LINKS_COLLECTION, 'order');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);

  const target = resolveTarget(form);
  const labelValid = form.label.trim().length > 0;

  const startAdd = () => { setEditingId(null); setForm(EMPTY_FORM); };
  const startEdit = (link: FooterLinkDoc) => {
    setEditingId(link.id);
    setForm({
      column: link.column,
      label: link.label,
      linkType: link.linkType,
      url: link.url || '',
      fileUrl: link.fileUrl || '',
      storagePath: link.storagePath || '',
    });
  };

  const save = async () => {
    if (!labelValid || !target.valid) return;
    setSaving(true);
    try {
      const payload = {
        column: form.column,
        label: form.label.trim(),
        linkType: form.linkType,
        url: form.linkType === 'internal' || form.linkType === 'external' ? form.url.trim() : '',
        fileUrl: form.linkType === 'pdf' || form.linkType === 'image' ? form.fileUrl : '',
        storagePath: form.linkType === 'pdf' || form.linkType === 'image' ? form.storagePath : '',
      };
      if (editingId) {
        await updateDoc(doc(db, FOOTER_LINKS_COLLECTION, editingId), payload);
      } else {
        await addDoc(collection(db, FOOTER_LINKS_COLLECTION), {
          ...payload,
          order: links.length,
          createdAt: serverTimestamp(),
        });
      }
      startAdd();
    } catch (e) {
      alert(`Couldn't save this link: ${(e as Error).message}`);
    } finally {
      setSaving(false);
    }
  };

  const remove = async (link: FooterLinkDoc) => {
    if (!confirm(`Remove "${link.label}" from the footer?`)) return;
    try {
      if (link.storagePath) await deleteFile(link.storagePath).catch(() => {});
      await deleteDoc(doc(db, FOOTER_LINKS_COLLECTION, link.id));
      if (editingId === link.id) startAdd();
    } catch (e) {
      alert(`Couldn't remove this link: ${(e as Error).message}`);
    }
  };

  const move = async (link: FooterLinkDoc, dir: -1 | 1) => {
    const columnLinks = links.filter((l) => l.column === link.column);
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

  return (
    <div className="admin-section">
      <div className="admin-card">
        <h2 className="admin-card__title">Footer Extra Links</h2>
        <p className="admin-lead" style={{ marginBottom: '1.25rem' }}>
          The site footer's existing content (columns, addresses, social links) stays exactly as it
          is — this only lets you add extra links on top of it. Pick which footer column a link
          appears in, then point it at another page on this website, an external website, or a file
          you upload here (a PDF or an image) — it opens in a new tab either way.
        </p>

        <div className="admin-form-grid">
          <div className="admin-field">
            <label htmlFor="fl-column">Footer column</label>
            <select id="fl-column" value={form.column} onChange={(e) => setForm((p) => ({ ...p, column: e.target.value as FooterLinkColumn }))}>
              {COLUMN_DEFS.map((c) => <option key={c.key} value={c.key}>{c.label}</option>)}
            </select>
          </div>
          <div className="admin-field">
            <label htmlFor="fl-label">Link text</label>
            <input id="fl-label" value={form.label} onChange={(e) => setForm((p) => ({ ...p, label: e.target.value }))} placeholder="e.g. Convocation Brochure" />
          </div>
          <div className="admin-field">
            <label htmlFor="fl-type">Links to</label>
            <select
              id="fl-type"
              value={form.linkType}
              onChange={(e) => setForm((p) => ({ ...p, linkType: e.target.value as FooterLinkType, url: '', fileUrl: '', storagePath: '' }))}
            >
              {(Object.keys(LINK_TYPE_LABELS) as FooterLinkType[]).map((t) => <option key={t} value={t}>{LINK_TYPE_LABELS[t]}</option>)}
            </select>
          </div>

          {(form.linkType === 'internal' || form.linkType === 'external') && (
            <div className="admin-field admin-field--full">
              <label htmlFor="fl-url">{form.linkType === 'internal' ? 'Page path' : 'Website URL'}</label>
              <input
                id="fl-url"
                value={form.url}
                onChange={(e) => setForm((p) => ({ ...p, url: e.target.value }))}
                placeholder={form.linkType === 'internal' ? '/academics/cse' : 'https://example.com'}
              />
              {form.url.trim() && !target.valid && (
                <span className="admin-field__hint" style={{ color: '#dc2626' }}>{target.hint}</span>
              )}
            </div>
          )}

          {(form.linkType === 'pdf' || form.linkType === 'image') && (
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
        </div>

        <div className="admin-form-actions">
          {editingId && <button type="button" className="admin-btn admin-btn--ghost" onClick={startAdd} disabled={saving}>Cancel Edit</button>}
          <button type="button" className="admin-btn admin-btn--primary" onClick={save} disabled={saving || !labelValid || !target.valid}>
            {saving ? 'Saving…' : editingId ? 'Save Changes' : '+ Add Link'}
          </button>
        </div>
      </div>

      {loading ? (
        <div className="admin-card"><p className="admin-loading">Loading…</p></div>
      ) : COLUMN_DEFS.map((col) => {
        const columnLinks = links.filter((l) => l.column === col.key);
        return (
          <div className="admin-card" key={col.key}>
            <h3 className="admin-card__title" style={{ fontSize: '1rem' }}>{col.label}</h3>
            {columnLinks.length === 0 ? (
              <p className="admin-field__hint">No extra links added to this column yet.</p>
            ) : (
              <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {columnLinks.map((link, i) => (
                  <li
                    key={link.id}
                    style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap', border: '1px solid var(--color-light-gray, #e5e7eb)', borderRadius: 8, padding: '0.6rem 0.9rem' }}
                  >
                    <div style={{ flex: '1 1 220px', minWidth: 0 }}>
                      <strong>{link.label}</strong>
                      <div className="admin-field__hint" style={{ margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {LINK_TYPE_LABELS[link.linkType]} — {link.url || link.fileUrl}
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: '0.4rem' }}>
                      <button type="button" className="admin-btn admin-btn--sm" onClick={() => move(link, -1)} disabled={i === 0} title="Move up">↑</button>
                      <button type="button" className="admin-btn admin-btn--sm" onClick={() => move(link, 1)} disabled={i === columnLinks.length - 1} title="Move down">↓</button>
                      <button type="button" className="admin-btn admin-btn--sm" onClick={() => startEdit(link)}>Edit</button>
                      <button type="button" className="admin-btn admin-btn--sm admin-btn--danger" onClick={() => remove(link)}>Remove</button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        );
      })}
    </div>
  );
}
