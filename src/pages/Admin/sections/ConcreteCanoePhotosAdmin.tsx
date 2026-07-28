import { useState } from 'react';
import { addDoc, collection, deleteDoc, doc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../../lib/firebase';
import { useOrderedCollection, type WithId } from '../../../hooks/useCollection';
import { useImageCropModal } from '../../../components/ImageUploader/useImageCropModal';
import { deleteFile, type UploadResult } from '../../../lib/storage';

interface CanoePhotoDoc extends WithId {
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
  const { docs: photos, loading } = useOrderedCollection<CanoePhotoDoc>(collectionName, 'order');
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

  const removePhoto = async (photo: CanoePhotoDoc) => {
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
 * Photo galleries for the Concrete Canoe Laboratory differentiator page —
 * the Academic Project write-up photos, the Previous Project Works gallery,
 * and each team's group photo under Students Benefited.
 */
export default function ConcreteCanoePhotosAdmin() {
  return (
    <div className="admin-card">
      <h2 className="admin-card__title">Concrete Canoe Laboratory Photos</h2>

      <h3 style={{ fontSize: '1rem', color: 'var(--color-text-light)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '1rem' }}>Academic Projects [Ongoing]</h3>
      <PhotoGroup
        title="Eco-friendly Concrete Boats Project Photos"
        helpText="Upload the photos shown under Academic Projects — the team-with-canoe photo and the presentation/poster photo."
        collectionName="canoeAcademicProjectPhotos"
        storageFolder="vwu/concrete-canoe/academic-project"
      />

      <h3 style={{ fontSize: '1rem', color: 'var(--color-text-light)', textTransform: 'uppercase', letterSpacing: '0.04em', margin: '1.5rem 0 1rem' }}>Previous Project Works</h3>
      <PhotoGroup
        title="WAKA / KANU / AIKYAM / CANOE Gallery"
        helpText="Upload the canoe photos (finished boats, water trials, team builds) shown under Previous Project Works."
        collectionName="canoePreviousProjectPhotos"
        storageFolder="vwu/concrete-canoe/previous-projects"
      />

      <h3 style={{ fontSize: '1rem', color: 'var(--color-text-light)', textTransform: 'uppercase', letterSpacing: '0.04em', margin: '1.5rem 0 1rem' }}>Students Benefited — Team Photos</h3>
      <PhotoGroup
        title="Team WAKA Photo (IV Year, 2020 Batch)"
        helpText="Upload the Team WAKA composite/group photo shown under Students Benefited."
        collectionName="canoeTeamWakaPhotos"
        storageFolder="vwu/concrete-canoe/team-waka"
      />
      <PhotoGroup
        title="Team AIKYAM Photo (III Year, 2021 Batch)"
        helpText="Upload the Team AIKYAM composite/group photo shown under Students Benefited."
        collectionName="canoeTeamAikyamPhotos"
        storageFolder="vwu/concrete-canoe/team-aikyam"
      />
      <PhotoGroup
        title="Team KANU Photo"
        helpText="Upload the Team KANU composite/group photo shown under Students Benefited."
        collectionName="canoeTeamKanuPhotos"
        storageFolder="vwu/concrete-canoe/team-kanu"
      />
    </div>
  );
}
