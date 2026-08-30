import { useState } from 'react';
import { addDoc, collection, deleteDoc, deleteField, doc, serverTimestamp, setDoc } from 'firebase/firestore';
import { db } from '../../../lib/firebase';
import { useCollection, useOrderedCollection, type WithId } from '../../../hooks/useCollection';
import { useImageCropModal } from '../../../components/ImageUploader/useImageCropModal';
import { deleteFile, type UploadResult } from '../../../lib/storage';
import { vehicleDesignLab } from '../../Differentiators/vehicleDesignLab.data';

interface VdlPhotoDoc extends WithId {
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
  const { docs: photos, loading } = useOrderedCollection<VdlPhotoDoc>(collectionName, 'order');
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

  const removePhoto = async (photo: VdlPhotoDoc) => {
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

interface IndustryCollabPhotoDoc extends WithId {
  imageUrl?: string;
  storagePath?: string;
}

// One photo per endowment (Ford Figo Vehicle / Volvo Powertrain Cut Section
// / MG Hector Plus Vehicle) — each doc's id is fixed to that endowment's id
// (see vehicleDesignLab.data.ts industryCollaborations.endowments), so
// uploading replaces that endowment's own photo rather than adding to a
// shared ordered list (which previously only ever showed a photo for
// whichever endowment happened to be first).
function IndustryCollabPhotoSlots() {
  const { docs: photos, loading } = useCollection<IndustryCollabPhotoDoc>('vdlIndustryCollabPhotos', []);
  const photoMap = new Map(photos.map((p) => [p.id, p]));
  const { openCrop, cropModal } = useImageCropModal(4 / 3);
  const [uploadingId, setUploadingId] = useState<string | null>(null);

  const addPhoto = (endowmentId: string, file: File) => {
    setUploadingId(endowmentId);
    openCrop(file, `vwu/vdl/industry-collaborations/${endowmentId}`, async (result: UploadResult) => {
      try {
        const existing = photoMap.get(endowmentId);
        if (existing?.storagePath) await deleteFile(existing.storagePath);
        await setDoc(doc(db, 'vdlIndustryCollabPhotos', endowmentId), { imageUrl: result.url, storagePath: result.path });
      } catch (e) {
        alert(`Couldn't add photo: ${(e as Error).message}`);
      } finally {
        setUploadingId(null);
      }
    });
  };

  const removePhoto = async (endowmentId: string) => {
    if (!confirm('Remove this photo?')) return;
    const existing = photoMap.get(endowmentId);
    try {
      await setDoc(doc(db, 'vdlIndustryCollabPhotos', endowmentId), { imageUrl: deleteField(), storagePath: deleteField() }, { merge: true });
      if (existing?.storagePath) await deleteFile(existing.storagePath);
    } catch (e) {
      alert(`Couldn't remove photo: ${(e as Error).message}`);
    }
  };

  if (loading) {
    return <p className="admin-loading">Loading…</p>;
  }

  return (
    <div style={{ marginBottom: '2rem' }}>
      <h3 style={{ fontSize: '1.1rem', marginBottom: '0.25rem' }}>Industry Collaborations Photos</h3>
      <p className="admin-lead" style={{ marginBottom: '1rem' }}>
        Upload a photo for each endowment shown in the Industry Collaborations tab.
      </p>
      <div className="admin-image-grid">
        {vehicleDesignLab.industryCollaborations.endowments.map((e) => {
          const photo = photoMap.get(e.id);
          const uploading = uploadingId === e.id;
          return (
            <div key={e.id} className="admin-image-card">
              {photo?.imageUrl ? (
                <img src={photo.imageUrl} alt={e.title} />
              ) : (
                <div className="admin-image-card__empty">{e.title}</div>
              )}
              <div className="admin-image-card__actions" style={{ flexDirection: 'column', gap: '0.35rem' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 700 }}>{e.title}</span>
                <label className="admin-btn admin-btn--sm" style={{ opacity: uploading ? 0.5 : 1 }}>
                  {uploading ? 'Uploading…' : photo?.imageUrl ? 'Replace Photo' : 'Add Photo'}
                  <input
                    type="file"
                    accept="image/*"
                    hidden
                    disabled={uploading}
                    onChange={(ev) => {
                      const file = ev.target.files?.[0];
                      if (file) addPhoto(e.id, file);
                      ev.target.value = '';
                    }}
                  />
                </label>
                {photo?.imageUrl && (
                  <button className="admin-btn admin-btn--sm admin-btn--danger" onClick={() => removePhoto(e.id)}>
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

/**
 * Photo galleries for the Vehicle Design Lab differentiator page — one
 * photo per Activities and Programs phase (Design, Fabrication, Testing,
 * Motorsport Vehicle Projects, each shown singly), the Campus Utility
 * Vehicle Projects photo grid, and one named photo slot per Industry
 * Collaborations endowment.
 */
export default function VdlFacilitiesPhotosAdmin() {
  return (
    <div className="admin-card">
      <h2 className="admin-card__title">Vehicle Design Lab Photos</h2>
      <PhotoGroup
        title="Design Phase Photo"
        helpText="Upload the photo shown in the Design Phase of Activities and Programs. Only the first photo is shown on the public page."
        collectionName="vdlDesignPhasePhotos"
        storageFolder="vwu/vdl/design-phase"
      />
      <PhotoGroup
        title="Fabrication Phase Photo"
        helpText="Upload the photo shown in the Fabrication Phase of Activities and Programs. Only the first photo is shown on the public page."
        collectionName="vdlFabricationPhasePhotos"
        storageFolder="vwu/vdl/fabrication-phase"
      />
      <PhotoGroup
        title="Testing Phase Photo"
        helpText="Upload the Vishnu ATV & Gokart Track photo shown in the Testing Phase of Activities and Programs. Only the first photo is shown on the public page."
        collectionName="vdlTestingPhotos"
        storageFolder="vwu/vdl/testing"
      />
      <PhotoGroup
        title="Motorsport Vehicle Projects Photo"
        helpText="Upload the photo shown in the Motorsport Vehicle Projects phase of Activities and Programs. Only the first photo is shown on the public page."
        collectionName="vdlMotorsportPhotos"
        storageFolder="vwu/vdl/motorsport"
      />
      <PhotoGroup
        title="Campus Utility Vehicle Projects Photos"
        helpText="Upload the project photos shown in the Campus Utility Vehicle Projects tab."
        collectionName="vdlCampusVehiclePhotos"
        storageFolder="vwu/vdl/campus-vehicles"
      />
      <IndustryCollabPhotoSlots />
    </div>
  );
}
