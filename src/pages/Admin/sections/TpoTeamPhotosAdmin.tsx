import { useState } from 'react';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../../lib/firebase';
import { useCollection, type WithId } from '../../../hooks/useCollection';
import { useImageCropModal } from '../../../components/ImageUploader/useImageCropModal';
import { deleteFile, type UploadResult } from '../../../lib/storage';
import type { TpoTeamBioDoc } from './TpoTeamInfoAdmin';

interface TpoPhotoDoc extends WithId {
  imageUrl: string;
  storagePath: string;
}

/**
 * Photo grid for the TPO Team bios (Admin → TPO Team Info) — one card per
 * bio's `name`, so this list stays in sync with whoever an admin has added
 * a bio for (a photo is only ever shown alongside a matching bio, never on
 * its own). Photos are stored in their own `tpoTeamPhotos` collection keyed
 * by that same exact name (setDoc upsert), and PlacementDetail.tsx reads
 * that collection to override each bio's placeholder photo.
 */
export default function TpoTeamPhotosAdmin() {
  const { docs: bios } = useCollection<TpoTeamBioDoc>('tpoTeamBios');
  const TEAM_NAMES = bios.map((b) => b.name);
  const { docs: photos, loading } = useCollection<TpoPhotoDoc>('tpoTeamPhotos');
  const { openCrop, cropModal } = useImageCropModal(3 / 4);
  const [uploadingName, setUploadingName] = useState<string | null>(null);

  const photoMap = new Map(photos.map((p) => [p.id, p]));

  const changeImage = (name: string, file: File) => {
    setUploadingName(name);
    openCrop(file, 'vwu/tpo-team', async (result: UploadResult) => {
      try {
        const prevPath = photoMap.get(name)?.storagePath;
        await setDoc(doc(db, 'tpoTeamPhotos', name), {
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
      <h2 className="admin-card__title">TPO Team Photos ({TEAM_NAMES.length})</h2>
      <p className="admin-lead" style={{ marginBottom: '1rem' }}>
        Upload the photo shown when a team member's row is expanded on the TPO Team page. Members
        without a photo here show a "Photo Needed" placeholder on the public site.
      </p>
      {TEAM_NAMES.length === 0 && (
        <p className="admin-field__hint" style={{ marginBottom: '1rem' }}>
          No one to show yet — add a bio first from <strong>TPO Team Info</strong>; a photo card appears here
          for each name added there.
        </p>
      )}
      <div className="admin-image-grid">
        {TEAM_NAMES.map((name) => {
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
