import { useState } from 'react';
import { doc, serverTimestamp, setDoc } from 'firebase/firestore';
import { db } from '../../../lib/firebase';
import { useCollection, type WithId } from '../../../hooks/useCollection';
import { useImageCropModal } from '../../../components/ImageUploader/useImageCropModal';
import { deleteFile, type UploadResult } from '../../../lib/storage';

interface OfficePhoto {
  url: string;
  path: string;
}

interface IloPhotosDoc extends WithId {
  photos?: OfficePhoto[];
}

const OFFICES = ['Bengaluru', 'Chennai', 'Pune', 'Vadodara'];

/**
 * Photo galleries for the Regional Offices shown on the Industry Liaison
 * Offices page — one doc per office (iloOfficePhotos/{officeName}) holding
 * an array of uploaded photos, since (unlike a single bio photo) each
 * office can have several office/team photos shown in a grid.
 */
export default function IloOfficePhotosAdmin() {
  const { docs, loading } = useCollection<IloPhotosDoc>('iloOfficePhotos');
  const { openCrop, cropModal } = useImageCropModal(4 / 3);
  const [uploadingOffice, setUploadingOffice] = useState<string | null>(null);

  const photoMap = new Map(docs.map((d) => [d.id, d.photos || []]));

  const addPhoto = (office: string, file: File) => {
    setUploadingOffice(office);
    openCrop(file, `vwu/ilo-offices/${office.toLowerCase()}`, async (result: UploadResult) => {
      try {
        const existing = photoMap.get(office) || [];
        await setDoc(doc(db, 'iloOfficePhotos', office), {
          photos: [...existing, { url: result.url, path: result.path }],
          updatedAt: serverTimestamp(),
        });
      } catch (e) {
        alert(`Couldn't add photo: ${(e as Error).message}`);
      } finally {
        setUploadingOffice(null);
      }
    });
  };

  const removePhoto = async (office: string, index: number) => {
    if (!confirm('Remove this photo?')) return;
    const existing = photoMap.get(office) || [];
    const removed = existing[index];
    const next = existing.filter((_, i) => i !== index);
    try {
      await setDoc(doc(db, 'iloOfficePhotos', office), { photos: next, updatedAt: serverTimestamp() });
      if (removed?.path) await deleteFile(removed.path);
    } catch (e) {
      alert(`Couldn't remove photo: ${(e as Error).message}`);
    }
  };

  if (loading) {
    return <div className="admin-card"><p className="admin-loading">Loading…</p></div>;
  }

  return (
    <div className="admin-card">
      <h2 className="admin-card__title">Industry Liaison Office Photos</h2>
      <p className="admin-lead" style={{ marginBottom: '1.5rem' }}>
        Upload the office photos shown when a region's row is expanded on the Industry Liaison
        Offices page.
      </p>
      {OFFICES.map((office) => {
        const photos = photoMap.get(office) || [];
        return (
          <div key={office} style={{ marginBottom: '2rem' }}>
            <h3 style={{ marginBottom: '0.75rem' }}>{office} ({photos.length})</h3>
            <div className="admin-image-grid">
              {photos.map((p, i) => (
                <div key={p.path || i} className="admin-image-card">
                  <img src={p.url} alt={`${office} office ${i + 1}`} />
                  <div className="admin-image-card__actions">
                    <button className="admin-btn admin-btn--sm admin-btn--danger" onClick={() => removePhoto(office, i)}>
                      Remove
                    </button>
                  </div>
                </div>
              ))}
              <div className="admin-image-card">
                <div className="admin-image-card__empty">Add a photo</div>
                <div className="admin-image-card__actions">
                  <label className="admin-btn admin-btn--sm" style={{ opacity: uploadingOffice !== null ? 0.5 : 1 }}>
                    {uploadingOffice === office ? 'Uploading…' : 'Add Photo'}
                    <input
                      type="file"
                      accept="image/*"
                      hidden
                      disabled={uploadingOffice !== null}
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) addPhoto(office, file);
                        e.target.value = '';
                      }}
                    />
                  </label>
                </div>
              </div>
            </div>
          </div>
        );
      })}
      {cropModal}
    </div>
  );
}
