import { useState } from 'react';
import { deleteField, doc, setDoc } from 'firebase/firestore';
import { db } from '../../../lib/firebase';
import { useCollection, type WithId } from '../../../hooks/useCollection';
import { useImageCropModal } from '../../../components/ImageUploader/useImageCropModal';
import { deleteFile, type UploadResult } from '../../../lib/storage';
import { talentSprintWise } from '../../Differentiators/talentSprintWise.data';

interface WiseTeamPhotoDoc extends WithId {
  imageUrl?: string;
  storagePath?: string;
}

/**
 * One photo per WISE Team member — each doc's id is fixed to that member's
 * id (see talentSprintWise.data.ts `team`), so uploading replaces that
 * member's existing photo rather than creating a new one.
 */
export default function WiseTeamPhotosAdmin() {
  const { docs: photos, loading } = useCollection<WiseTeamPhotoDoc>('wiseTeamPhotos', []);
  const photoMap = new Map(photos.map((p) => [p.id, p]));
  const { openCrop, cropModal } = useImageCropModal(1);
  const [uploadingId, setUploadingId] = useState<string | null>(null);

  const addPhoto = (memberId: string, file: File) => {
    setUploadingId(memberId);
    openCrop(file, `vwu/talentsprint-wise/team/${memberId}`, async (result: UploadResult) => {
      try {
        const existing = photoMap.get(memberId);
        if (existing?.storagePath) await deleteFile(existing.storagePath);
        await setDoc(doc(db, 'wiseTeamPhotos', memberId), { imageUrl: result.url, storagePath: result.path });
      } catch (e) {
        alert(`Couldn't add photo: ${(e as Error).message}`);
      } finally {
        setUploadingId(null);
      }
    });
  };

  const removePhoto = async (memberId: string) => {
    if (!confirm('Remove this photo?')) return;
    const existing = photoMap.get(memberId);
    try {
      await setDoc(doc(db, 'wiseTeamPhotos', memberId), { imageUrl: deleteField(), storagePath: deleteField() }, { merge: true });
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
      <h2 className="admin-card__title">WISE Team Photos</h2>
      <p className="admin-lead" style={{ marginBottom: '1.5rem' }}>
        Upload a photo for each WISE Team member shown on the TalentSprint – WISE page. Name, designation, and bio are edited in code — this section is photos only.
      </p>
      <div className="admin-image-grid">
        {talentSprintWise.team.map((member) => {
          const photo = photoMap.get(member.id);
          const uploading = uploadingId === member.id;
          return (
            <div key={member.id} className="admin-image-card">
              {photo?.imageUrl ? (
                <img src={photo.imageUrl} alt={member.name} />
              ) : (
                <div className="admin-image-card__empty">{member.name}</div>
              )}
              <div className="admin-image-card__actions" style={{ flexDirection: 'column', gap: '0.35rem' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 700 }}>{member.name}</span>
                <label className="admin-btn admin-btn--sm" style={{ opacity: uploading ? 0.5 : 1 }}>
                  {uploading ? 'Uploading…' : photo?.imageUrl ? 'Replace Photo' : 'Add Photo'}
                  <input
                    type="file"
                    accept="image/*"
                    hidden
                    disabled={uploading}
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) addPhoto(member.id, file);
                      e.target.value = '';
                    }}
                  />
                </label>
                {photo?.imageUrl && (
                  <button className="admin-btn admin-btn--sm admin-btn--danger" onClick={() => removePhoto(member.id)}>
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
