import { useEffect, useState } from 'react';
import { doc, setDoc, updateDoc, writeBatch, serverTimestamp } from 'firebase/firestore';
import { db } from '../../../lib/firebase';
import { useOrderedCollection } from '../../../hooks/useCollection';
import ImageUploader from '../../../components/ImageUploader/ImageUploader';
import { uploadImage, type UploadResult } from '../../../lib/storage';
import { LANDING_PAGE_REGISTRY, DEFAULT_LANDING_PAGE_ID } from '../../../lib/landingPageRegistry';
import ConfirmDialog from '../ConfirmDialog';

export interface LandingPageImageValue {
  url: string;
  storagePath: string;
  alt: string;
}

export interface LandingPageDoc {
  id: string;
  name: string;
  description: string;
  previewImage: string;
  previewImageStoragePath: string;
  order: number;
  active: boolean;
  images?: Record<string, LandingPageImageValue>;
}

export default function LandingPagesAdmin() {
  const { docs, loading } = useOrderedCollection<LandingPageDoc>('landingPages', 'order');
  const [seeded, setSeeded] = useState(false);
  const [confirmId, setConfirmId] = useState<string | null>(null);
  const [activating, setActivating] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({ name: '', description: '' });
  const [expandedImagesId, setExpandedImagesId] = useState<string | null>(null);
  const [uploadingPreviewId, setUploadingPreviewId] = useState<string | null>(null);

  // Auto-provision a Firestore doc for any registry entry that doesn't have
  // one yet — so this feature works immediately with no manual setup, and
  // the public site always has a "home" doc to fall back to as active.
  useEffect(() => {
    if (loading || seeded) return;
    setSeeded(true);
    const existingIds = new Set(docs.map((d) => d.id));
    LANDING_PAGE_REGISTRY.forEach((entry, i) => {
      if (existingIds.has(entry.id)) return;
      setDoc(doc(db, 'landingPages', entry.id), {
        name: entry.fallbackName,
        description: entry.fallbackDescription,
        previewImage: entry.fallbackPreviewImage,
        previewImageStoragePath: '',
        order: i,
        active: entry.id === DEFAULT_LANDING_PAGE_ID,
        createdAt: serverTimestamp(),
      });
    });
  }, [loading, seeded, docs]);

  useEffect(() => {
    if (!successMsg) return;
    const t = setTimeout(() => setSuccessMsg(''), 4000);
    return () => clearTimeout(t);
  }, [successMsg]);

  const byId = new Map(docs.map((d) => [d.id, d]));
  const cards = LANDING_PAGE_REGISTRY.map((entry, i) => ({
    entry,
    doc: byId.get(entry.id) ?? {
      id: entry.id, name: entry.fallbackName, description: entry.fallbackDescription,
      previewImage: entry.fallbackPreviewImage, previewImageStoragePath: '', order: i,
      active: entry.id === DEFAULT_LANDING_PAGE_ID,
    },
  }));

  const activate = async (id: string) => {
    setActivating(true);
    try {
      const batch = writeBatch(db);
      cards.forEach((c) => {
        batch.set(doc(db, 'landingPages', c.doc.id), { active: c.doc.id === id }, { merge: true });
      });
      await batch.commit();
      setSuccessMsg('Landing Page updated successfully.');
    } catch (e) {
      alert(`Couldn't activate: ${(e as Error).message}`);
    } finally {
      setActivating(false);
      setConfirmId(null);
    }
  };

  const startEdit = (c: (typeof cards)[number]) => {
    setEditingId(c.doc.id);
    setEditForm({ name: c.doc.name, description: c.doc.description });
  };

  const saveEdit = async (id: string) => {
    try {
      await setDoc(doc(db, 'landingPages', id), { name: editForm.name, description: editForm.description }, { merge: true });
      setEditingId(null);
    } catch (e) {
      alert(`Couldn't save: ${(e as Error).message}`);
    }
  };

  const handlePreviewUpload = async (id: string, file: File) => {
    setUploadingPreviewId(id);
    try {
      const result: UploadResult = await uploadImage(file, 'landing-pages/previews');
      await setDoc(doc(db, 'landingPages', id), { previewImage: result.url, previewImageStoragePath: result.path }, { merge: true });
    } catch (e) {
      alert(`Couldn't save preview image: ${(e as Error).message}`);
    } finally {
      setUploadingPreviewId(null);
    }
  };

  const handleSlotUpload = async (id: string, slotKey: string, alt: string, result: UploadResult) => {
    try {
      await updateDoc(doc(db, 'landingPages', id), {
        [`images.${slotKey}`]: { url: result.url, storagePath: result.path, alt },
      });
    } catch (e) {
      alert(`Couldn't save image: ${(e as Error).message}`);
    }
  };

  const confirmingCard = cards.find((c) => c.doc.id === confirmId);

  return (
    <div className="admin-section">
      <p className="admin-lead">
        Only one landing page can be live at a time. Activating one here immediately switches what every
        visitor sees at the site's root — no deploy needed. Adding a future landing page only requires a new
        page component and one registry entry (see <code>src/lib/landingPageRegistry.ts</code>).
      </p>

      {successMsg && <p className="admin-success">{successMsg}</p>}

      <div className="admin-image-grid">
        {cards.map((c) => (
          <div key={c.doc.id} className="admin-card">
            <div className="admin-image-card" style={{ marginBottom: '1rem' }}>
              <img src={c.doc.previewImage} alt={c.doc.name} />
              <div className="admin-image-card__info">
                {editingId === c.doc.id ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', width: '100%' }}>
                    <input value={editForm.name} onChange={(e) => setEditForm((f) => ({ ...f, name: e.target.value }))} placeholder="Name" />
                    <textarea rows={2} value={editForm.description} onChange={(e) => setEditForm((f) => ({ ...f, description: e.target.value }))} placeholder="Short description" />
                    <div className="admin-form-actions">
                      <button className="admin-btn admin-btn--ghost admin-btn--sm" onClick={() => setEditingId(null)}>Cancel</button>
                      <button className="admin-btn admin-btn--primary admin-btn--sm" onClick={() => saveEdit(c.doc.id)}>Save</button>
                    </div>
                  </div>
                ) : (
                  <>
                    <strong>{c.doc.name}</strong>
                    <span className="admin-field__hint" style={{ margin: 0 }}>{c.doc.description}</span>
                    <span className={`admin-badge admin-badge--sm${c.doc.active ? ' admin-badge--green' : ' admin-badge--gray'}`} style={{ marginTop: 4, alignSelf: 'flex-start' }}>
                      {c.doc.active ? 'Active' : 'Inactive'}
                    </span>
                  </>
                )}
              </div>
              {editingId !== c.doc.id && (
                <div className="admin-image-card__actions" style={{ flexWrap: 'wrap' }}>
                  <label className="admin-btn admin-btn--sm" style={{ opacity: uploadingPreviewId === c.doc.id ? 0.5 : 1 }}>
                    {uploadingPreviewId === c.doc.id ? 'Uploading…' : 'Replace Preview'}
                    <input
                      type="file"
                      accept="image/*"
                      hidden
                      disabled={uploadingPreviewId !== null}
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handlePreviewUpload(c.doc.id, file);
                        e.target.value = '';
                      }}
                    />
                  </label>
                  <button className="admin-btn admin-btn--sm" onClick={() => startEdit(c)}>Edit Details</button>
                  {c.entry.imageSlots && (
                    <button className="admin-btn admin-btn--sm" onClick={() => setExpandedImagesId(expandedImagesId === c.doc.id ? null : c.doc.id)}>
                      {expandedImagesId === c.doc.id ? 'Hide Images' : 'Manage Images'}
                    </button>
                  )}
                  <button
                    className="admin-btn admin-btn--sm admin-btn--primary"
                    disabled={c.doc.active || activating}
                    onClick={() => setConfirmId(c.doc.id)}
                  >
                    {c.doc.active ? 'Activated ✓' : 'Activate'}
                  </button>
                </div>
              )}
            </div>

            {expandedImagesId === c.doc.id && c.entry.imageSlots && (
              <div className="admin-image-grid" style={{ borderTop: '1px solid #e5e7eb', paddingTop: '1rem' }}>
                {c.entry.imageSlots.map((slot) => {
                  const current = c.doc.images?.[slot.key];
                  return (
                    <div key={slot.key} className="admin-image-card">
                      <img src={current?.url || slot.defaultUrl} alt={current?.alt || slot.label} />
                      <div className="admin-image-card__info">
                        <strong>{slot.label}</strong>
                        {!current && <span className="admin-badge admin-badge--gray admin-badge--sm">Default</span>}
                      </div>
                      <div className="admin-image-card__actions">
                        <ImageUploader
                          folder={`landing-pages/${c.doc.id}`}
                          currentUrl={current?.url}
                          aspect={slot.aspect}
                          label="Replace Image"
                          onUploaded={(r) => handleSlotUpload(c.doc.id, slot.key, slot.label, r)}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        ))}
      </div>

      <ConfirmDialog
        open={!!confirmingCard}
        title="Activate Landing Page"
        message={`Are you sure you want to make "${confirmingCard?.doc.name}" the live landing page? Every visitor will see it immediately.`}
        confirmLabel={activating ? 'Activating…' : 'Activate'}
        onConfirm={() => confirmingCard && activate(confirmingCard.doc.id)}
        onCancel={() => setConfirmId(null)}
      />
    </div>
  );
}
