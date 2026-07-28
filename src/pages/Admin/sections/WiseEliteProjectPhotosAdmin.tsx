import { useState } from 'react';
import { deleteField, doc, setDoc } from 'firebase/firestore';
import { db } from '../../../lib/firebase';
import { useCollection, type WithId } from '../../../hooks/useCollection';
import { useImageCropModal } from '../../../components/ImageUploader/useImageCropModal';
import { deleteFile, type UploadResult } from '../../../lib/storage';
import { talentSprintWise } from '../../Differentiators/talentSprintWise.data';

interface WiseElitePhotoDoc extends WithId {
  imageUrl?: string;
  storagePath?: string;
}

/**
 * One team photo per WISE-ELITE project — each doc's id is fixed to that
 * project's id (see talentSprintWise.data.ts `elite.projects`), so
 * uploading replaces that project's existing photo rather than creating a
 * new one.
 */
export default function WiseEliteProjectPhotosAdmin() {
  const { docs: photos, loading } = useCollection<WiseElitePhotoDoc>('wiseEliteProjectPhotos', []);
  const photoMap = new Map(photos.map((p) => [p.id, p]));
  const { openCrop, cropModal } = useImageCropModal(4 / 3);
  const [uploadingId, setUploadingId] = useState<string | null>(null);

  const addPhoto = (projectId: string, file: File) => {
    setUploadingId(projectId);
    openCrop(file, `vwu/talentsprint-wise/elite/${projectId}`, async (result: UploadResult) => {
      try {
        const existing = photoMap.get(projectId);
        if (existing?.storagePath) await deleteFile(existing.storagePath);
        await setDoc(doc(db, 'wiseEliteProjectPhotos', projectId), { imageUrl: result.url, storagePath: result.path });
      } catch (e) {
        alert(`Couldn't add photo: ${(e as Error).message}`);
      } finally {
        setUploadingId(null);
      }
    });
  };

  const removePhoto = async (projectId: string) => {
    if (!confirm('Remove this photo?')) return;
    const existing = photoMap.get(projectId);
    try {
      await setDoc(doc(db, 'wiseEliteProjectPhotos', projectId), { imageUrl: deleteField(), storagePath: deleteField() }, { merge: true });
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
      <h2 className="admin-card__title">WISE-ELITE Project Photos</h2>
      <p className="admin-lead" style={{ marginBottom: '1.5rem' }}>
        Upload a team photo for each WISE-ELITE project shown on the TalentSprint – WISE page. Description and student names are edited in code — this section is photos only.
      </p>
      <div className="admin-image-grid">
        {talentSprintWise.elite.projects.map((project) => {
          const photo = photoMap.get(project.id);
          const uploading = uploadingId === project.id;
          return (
            <div key={project.id} className="admin-image-card">
              {photo?.imageUrl ? (
                <img src={photo.imageUrl} alt={project.name} />
              ) : (
                <div className="admin-image-card__empty">{project.name}</div>
              )}
              <div className="admin-image-card__actions" style={{ flexDirection: 'column', gap: '0.35rem' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 700 }}>{project.name}</span>
                <label className="admin-btn admin-btn--sm" style={{ opacity: uploading ? 0.5 : 1 }}>
                  {uploading ? 'Uploading…' : photo?.imageUrl ? 'Replace Photo' : 'Add Photo'}
                  <input
                    type="file"
                    accept="image/*"
                    hidden
                    disabled={uploading}
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) addPhoto(project.id, file);
                      e.target.value = '';
                    }}
                  />
                </label>
                {photo?.imageUrl && (
                  <button className="admin-btn admin-btn--sm admin-btn--danger" onClick={() => removePhoto(project.id)}>
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
