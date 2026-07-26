import { useState } from 'react';
import { addDoc, collection, deleteDoc, doc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../../lib/firebase';
import { useOrderedCollection, type WithId } from '../../../hooks/useCollection';
import { useImageCropModal } from '../../../components/ImageUploader/useImageCropModal';
import { deleteFile, type UploadResult } from '../../../lib/storage';

interface C2sPhotoDoc extends WithId {
  imageUrl: string;
  storagePath: string;
  order: number;
}

function PhotoGroup({
  title,
  helpText,
  collectionName,
  storageFolder,
}: {
  title: string;
  helpText: string;
  collectionName: string;
  storageFolder: string;
}) {
  const { docs: photos, loading } = useOrderedCollection<C2sPhotoDoc>(collectionName, 'order');
  const { openCrop, cropModal } = useImageCropModal(4 / 3);
  const [uploading, setUploading] = useState(false);

  const addPhoto = (file: File) => {
    setUploading(true);
    openCrop(file, storageFolder, async (result: UploadResult) => {
      try {
        await addDoc(collection(db, collectionName), {
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

  const removePhoto = async (photo: C2sPhotoDoc) => {
    if (!confirm('Remove this photo?')) return;
    try {
      await deleteDoc(doc(db, collectionName, photo.id));
      if (photo.storagePath) await deleteFile(photo.storagePath);
    } catch (e) {
      alert(`Couldn't remove photo: ${(e as Error).message}`);
    }
  };

  if (loading) {
    return <p className="admin-loading">Loading…</p>;
  }

  return (
    <div style={{ marginBottom: '2rem' }}>
      <h3 style={{ fontSize: '1.1rem', marginBottom: '0.25rem' }}>{title} ({photos.length})</h3>
      <p className="admin-lead" style={{ marginBottom: '1rem' }}>{helpText}</p>
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

/**
 * Photo galleries for the Chips to Startup (C2S) differentiator page —
 * two independent ordered photo groups (Activities Done Under the
 * Project, Outcomes), each rendered inside its own accordion section
 * on the public page.
 */
export default function ChipsToStartupPhotosAdmin() {
  return (
    <div className="admin-card">
      <h2 className="admin-card__title">Chips to Startup (C2S) Photos</h2>
      <PhotoGroup
        title="Activities Done Under the Project"
        helpText="Upload the workshop/event poster photos shown in the Activities accordion section."
        collectionName="chipsToStartupActivityPhotos"
        storageFolder="vwu/chipstostartup/activities"
      />
      <PhotoGroup
        title="Outcomes"
        helpText="Upload the outcome/award photos shown in the Outcomes accordion section."
        collectionName="chipsToStartupOutcomePhotos"
        storageFolder="vwu/chipstostartup/outcomes"
      />
    </div>
  );
}
