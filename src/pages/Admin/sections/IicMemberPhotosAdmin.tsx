import { useState } from 'react';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../../lib/firebase';
import { useCollection, type WithId } from '../../../hooks/useCollection';
import { useImageCropModal } from '../../../components/ImageUploader/useImageCropModal';
import { deleteFile, type UploadResult } from '../../../lib/storage';
import { institutionInnovationCell } from '../../Differentiators/institutionInnovationCell.data';

interface IicPhotoDoc extends WithId {
  imageUrl: string;
  storagePath: string;
}

const { constitution } = institutionInnovationCell;
const MEMBER_NAMES = [
  constitution.chairman.name,
  ...constitution.leadership.map((m) => m.name),
  ...constitution.coordinators.map((m) => m.name),
];

/**
 * Fixed-list photo grid for the IIC Constitution org chart on the
 * Institution Innovation Cell differentiator page (Chairman, leadership,
 * and coordinators) — same pattern as TPO Team Photos, keyed by exact
 * member name in the iicMemberPhotos collection.
 */
export default function IicMemberPhotosAdmin() {
  const { docs: photos, loading } = useCollection<IicPhotoDoc>('iicMemberPhotos');
  const { openCrop, cropModal } = useImageCropModal(1);
  const [uploadingName, setUploadingName] = useState<string | null>(null);

  const photoMap = new Map(photos.map((p) => [p.id, p]));

  const changeImage = (name: string, file: File) => {
    setUploadingName(name);
    openCrop(file, 'vwu/iic-members', async (result: UploadResult) => {
      try {
        const prevPath = photoMap.get(name)?.storagePath;
        await setDoc(doc(db, 'iicMemberPhotos', name), {
          imageUrl: result.url,
          storagePath: result.path,
          updatedAt: serverTimestamp(),
        });
        if (prevPath) await deleteFile(prevPath);
      } catch (e) {
        alert(`Couldn't update photo: ${(e as Error).message}`);
      } finally {
        setUploadingName(null);
      }
    });
  };

  if (loading) {
    return <div className="admin-card"><p className="admin-loading">Loading…</p></div>;
  }

  return (
    <div className="admin-card">
      <h2 className="admin-card__title">IIC Council Member Photos ({MEMBER_NAMES.length})</h2>
      <p className="admin-lead" style={{ marginBottom: '1rem' }}>
        Upload the photo shown on each member's card in the IIC – Constitution org chart
        (Institution Innovation Cell page). Members without a photo here show a placeholder.
      </p>
      <div className="admin-image-grid">
        {MEMBER_NAMES.map((name) => {
          const imageUrl = photoMap.get(name)?.imageUrl;
          return (
            <div key={name} className="admin-image-card">
              {imageUrl ? (
                <img src={imageUrl} alt={name} />
              ) : (
                <div className="admin-image-card__empty">No photo set</div>
              )}
              <div className="admin-image-card__info">
                <strong>{name}</strong>
              </div>
              <div className="admin-image-card__actions">
                <label className="admin-btn admin-btn--sm" style={{ opacity: uploadingName !== null ? 0.5 : 1 }}>
                  {uploadingName === name ? 'Uploading…' : imageUrl ? 'Change Photo' : 'Add Photo'}
                  <input
                    type="file"
                    accept="image/*"
                    hidden
                    disabled={uploadingName !== null}
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) changeImage(name, file);
                      e.target.value = '';
                    }}
                  />
                </label>
              </div>
            </div>
          );
        })}
      </div>
      {cropModal}
    </div>
  );
}
