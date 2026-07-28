import { useState } from 'react';
import { deleteField, doc, setDoc } from 'firebase/firestore';
import { db } from '../../../lib/firebase';
import { useCollection, type WithId } from '../../../hooks/useCollection';
import { useImageCropModal } from '../../../components/ImageUploader/useImageCropModal';
import { deleteFile, type UploadResult } from '../../../lib/storage';
import { talentSprintWise } from '../../Differentiators/talentSprintWise.data';

interface WiseNseClippingPhotoDoc extends WithId {
  imageUrl?: string;
  storagePath?: string;
}

/**
 * One scanned news-clipping image per entry — each doc's id is fixed to
 * that clipping's id (see talentSprintWise.data.ts `nse.clippings`), so
 * uploading replaces the existing scan rather than creating a new one.
 */
export default function WiseNseClippingsAdmin() {
  const { docs: photos, loading } = useCollection<WiseNseClippingPhotoDoc>('wiseNseClippings', []);
  const photoMap = new Map(photos.map((p) => [p.id, p]));
  const { openCrop, cropModal } = useImageCropModal(4 / 3);
  const [uploadingId, setUploadingId] = useState<string | null>(null);

  const addPhoto = (clippingId: string, file: File) => {
    setUploadingId(clippingId);
    openCrop(file, `vwu/talentsprint-wise/nse/${clippingId}`, async (result: UploadResult) => {
      try {
        const existing = photoMap.get(clippingId);
        if (existing?.storagePath) await deleteFile(existing.storagePath);
        await setDoc(doc(db, 'wiseNseClippings', clippingId), { imageUrl: result.url, storagePath: result.path });
      } catch (e) {
        alert(`Couldn't add photo: ${(e as Error).message}`);
      } finally {
        setUploadingId(null);
      }
    });
  };

  const removePhoto = async (clippingId: string) => {
    if (!confirm('Remove this photo?')) return;
    const existing = photoMap.get(clippingId);
    try {
      await setDoc(doc(db, 'wiseNseClippings', clippingId), { imageUrl: deleteField(), storagePath: deleteField() }, { merge: true });
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
      <h2 className="admin-card__title">TalentSprint @ NSE — News Clippings</h2>
      <p className="admin-lead" style={{ marginBottom: '1.5rem' }}>
        Upload the scanned news clipping for each entry shown on the TalentSprint – WISE page. Caption text is edited in code — this section is photos only.
      </p>
      <div className="admin-image-grid">
        {talentSprintWise.nse.clippings.map((clip) => {
          const photo = photoMap.get(clip.id);
          const uploading = uploadingId === clip.id;
          return (
            <div key={clip.id} className="admin-image-card">
              {photo?.imageUrl ? (
                <img src={photo.imageUrl} alt={clip.caption} />
              ) : (
                <div className="admin-image-card__empty">{clip.caption}</div>
              )}
              <div className="admin-image-card__actions" style={{ flexDirection: 'column', gap: '0.35rem' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 700 }}>{clip.caption}</span>
                <label className="admin-btn admin-btn--sm" style={{ opacity: uploading ? 0.5 : 1 }}>
                  {uploading ? 'Uploading…' : photo?.imageUrl ? 'Replace Photo' : 'Add Photo'}
                  <input
                    type="file"
                    accept="image/*"
                    hidden
                    disabled={uploading}
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) addPhoto(clip.id, file);
                      e.target.value = '';
                    }}
                  />
                </label>
                {photo?.imageUrl && (
                  <button className="admin-btn admin-btn--sm admin-btn--danger" onClick={() => removePhoto(clip.id)}>
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
