import { useState } from 'react';
import { addDoc, collection, deleteDoc, doc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../../lib/firebase';
import { useOrderedCollection, type WithId } from '../../../hooks/useCollection';
import { useImageCropModal } from '../../../components/ImageUploader/useImageCropModal';
import { deleteFile, type UploadResult } from '../../../lib/storage';

interface VsacPhotoDoc extends WithId {
  imageUrl: string;
  storagePath: string;
  order: number;
}

/**
 * Photo gallery for the Vishnu Space Application Center (VSAC)
 * differentiator page — a flat, ordered list of uploaded lab/ground
 * station photos, same pattern as TI-DSP CoE Gallery Photos.
 */
export default function VsacGalleryPhotosAdmin() {
  const { docs: photos, loading } = useOrderedCollection<VsacPhotoDoc>('vsacGalleryPhotos', 'order');
  const { openCrop, cropModal } = useImageCropModal(4 / 3);
  const [uploading, setUploading] = useState(false);

  const addPhoto = (file: File) => {
    setUploading(true);
    openCrop(file, 'vwu/vsac', async (result: UploadResult) => {
      try {
        await addDoc(collection(db, 'vsacGalleryPhotos'), {
          imageUrl: result.url,
          storagePath: result.path,
          order: photos.length + 1,
          createdAt: serverTimestamp(),
        });
      } catch (e) {
        alert(`Couldn't add photo: ${(e as Error).message}`);
      } finally {
        setUploading(false);
      }
    });
  };

  const removePhoto = async (photo: VsacPhotoDoc) => {
    if (!confirm('Remove this photo?')) return;
    try {
      await deleteDoc(doc(db, 'vsacGalleryPhotos', photo.id));
      if (photo.storagePath) await deleteFile(photo.storagePath);
    } catch (e) {
      alert(`Couldn't remove photo: ${(e as Error).message}`);
    }
  };

  if (loading) {
    return <div className="admin-card"><p className="admin-loading">Loading…</p></div>;
  }

  return (
    <div className="admin-card">
      <h2 className="admin-card__title">VSAC Gallery Photos ({photos.length})</h2>
      <p className="admin-lead" style={{ marginBottom: '1.5rem' }}>
        Upload the photos shown in the Gallery section of the Vishnu Space Application Center (VSAC) differentiator page.
      </p>
      <div className="admin-image-grid">
        {photos.map((p) => (
          <div key={p.id} className="admin-image-card">
            <img src={p.imageUrl} alt="" />
            <div className="admin-image-card__actions">
              <button className="admin-btn admin-btn--sm admin-btn--danger" onClick={() => removePhoto(p)}>
                Remove
              </button>
            </div>
          </div>
        ))}
        <div className="admin-image-card">
          <div className="admin-image-card__empty">Add a photo</div>
          <div className="admin-image-card__actions">
            <label className="admin-btn admin-btn--sm" style={{ opacity: uploading ? 0.5 : 1 }}>
              {uploading ? 'Uploading…' : 'Add Photo'}
              <input
                type="file"
                accept="image/*"
                hidden
                disabled={uploading}
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) addPhoto(file);
                  e.target.value = '';
                }}
              />
            </label>
          </div>
        </div>
      </div>
      {cropModal}
    </div>
  );
}
