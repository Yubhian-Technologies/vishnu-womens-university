import { useState } from 'react';
import { deleteField, doc, setDoc } from 'firebase/firestore';
import { db } from '../../../lib/firebase';
import { useCollection, type WithId } from '../../../hooks/useCollection';
import { useImageCropModal } from '../../../components/ImageUploader/useImageCropModal';
import { deleteFile, type UploadResult } from '../../../lib/storage';
import { nirvahana } from '../../Differentiators/nirvahana.data';

interface NirvahanaEventPhotoDoc extends WithId {
  imageUrl?: string;
  storagePath?: string;
}

/**
 * One event banner photo per entry — each doc's id is fixed to that
 * event's id (see nirvahana.data.ts `events`), so uploading replaces the
 * existing banner rather than creating a new one.
 */
export default function NirvahanaEventPhotosAdmin() {
  const { docs: photos, loading } = useCollection<NirvahanaEventPhotoDoc>('nirvahanaEventPhotos', []);
  const photoMap = new Map(photos.map((p) => [p.id, p]));
  const { openCrop, cropModal } = useImageCropModal(4 / 3);
  const [uploadingId, setUploadingId] = useState<string | null>(null);

  const addPhoto = (eventId: string, file: File) => {
    setUploadingId(eventId);
    openCrop(file, `vwu/nirvahana/${eventId}`, async (result: UploadResult) => {
      try {
        const existing = photoMap.get(eventId);
        if (existing?.storagePath) await deleteFile(existing.storagePath);
        await setDoc(doc(db, 'nirvahanaEventPhotos', eventId), { imageUrl: result.url, storagePath: result.path });
      } catch (e) {
        alert(`Couldn't add photo: ${(e as Error).message}`);
      } finally {
        setUploadingId(null);
      }
    });
  };

  const removePhoto = async (eventId: string) => {
    if (!confirm('Remove this photo?')) return;
    const existing = photoMap.get(eventId);
    try {
      await setDoc(doc(db, 'nirvahanaEventPhotos', eventId), { imageUrl: deleteField(), storagePath: deleteField() }, { merge: true });
      if (existing?.storagePath) await deleteFile(existing.storagePath);
    } catch (e) {
      alert(`Couldn't remove photo: ${(e as Error).message}`);
    }
  };

  if (loading) {
    return <div className="admin-card"><p className="admin-loading">Loading…</p></div>;
  }

  return (
    <div className="admin-card">
      <h2 className="admin-card__title">Nirvahana Event Photos</h2>
      <p className="admin-lead" style={{ marginBottom: '1.5rem' }}>
        Upload the promotional banner/poster image for each event shown on the Nirvahana differentiator page.
      </p>
      <div className="admin-image-grid">
        {nirvahana.events.map((event) => {
          const photo = photoMap.get(event.id);
          const uploading = uploadingId === event.id;
          return (
            <div key={event.id} className="admin-image-card">
              {photo?.imageUrl ? (
                <img src={photo.imageUrl} alt={event.caption} />
              ) : (
                <div className="admin-image-card__empty">{event.caption}</div>
              )}
              <div className="admin-image-card__actions" style={{ flexDirection: 'column', gap: '0.35rem' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 700 }}>{event.caption}</span>
                <label className="admin-btn admin-btn--sm" style={{ opacity: uploading ? 0.5 : 1 }}>
                  {uploading ? 'Uploading…' : photo?.imageUrl ? 'Replace Photo' : 'Add Photo'}
                  <input
                    type="file"
                    accept="image/*"
                    hidden
                    disabled={uploading}
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) addPhoto(event.id, file);
                      e.target.value = '';
                    }}
                  />
                </label>
                {photo?.imageUrl && (
                  <button className="admin-btn admin-btn--sm admin-btn--danger" onClick={() => removePhoto(event.id)}>
                    Remove
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
      {cropModal}
    </div>
  );
}
