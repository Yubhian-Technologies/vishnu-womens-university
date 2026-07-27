import { useState } from 'react';
import { addDoc, collection, deleteDoc, doc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../../lib/firebase';
import { useOrderedCollection, type WithId } from '../../../hooks/useCollection';
import { useImageCropModal } from '../../../components/ImageUploader/useImageCropModal';
import { deleteFile, type UploadResult } from '../../../lib/storage';

interface AtlPhotoDoc extends WithId {
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
  const { docs: photos, loading } = useOrderedCollection<AtlPhotoDoc>(collectionName, 'order');
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

  const removePhoto = async (photo: AtlPhotoDoc) => {
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
 * Photo galleries for the Assistive Technology Lab (ATL) differentiator
 * page — project prototype photos for all three years, every Activities
 * event gallery (2023-24 through 2025-26), and the three 2023-24
 * Outcomes & Gallery sub-galleries.
 */
export default function AssistiveTechLabPhotosAdmin() {
  return (
    <div className="admin-card">
      <h2 className="admin-card__title">Assistive Technology Lab (ATL) Photos</h2>

      <h3 style={{ fontSize: '1rem', color: 'var(--color-text-light)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '1rem' }}>Training/Research — Project Photos</h3>
      <PhotoGroup
        title="ATL Projects Prototype Photos (2023-24)"
        helpText="Upload one photo per project, in order: Smart Sole, Currency Detector, Prosthetic Fore Arm, Tactile Ups and Downs, A Blind-Friendly Interactive Ball Game, Sign Math, Sign Language to Audio Converter, Vision Assist, SHESHIELD, Seizure Detection and Alert System."
        collectionName="atlProjectPrototypePhotos"
        storageFolder="vwu/atl/projects-2023-24"
      />
      <PhotoGroup
        title="ATL Projects Prototype Photos (2024-25)"
        helpText="Upload one photo per project, in order: Tactile Gloves, Smart Assistive Clothing, E-Stylus, Vitality Visionaries – Luggage Identifier, Myosync, Auto Braille, Drip Track, Medicine Identifier, Diabetic Foot Ulcer Monitoring System, Smart Assistive Glasses, Temperature-Controlled Wearable Blanket."
        collectionName="atlProjectPrototypePhotos2024"
        storageFolder="vwu/atl/projects-2024-25"
      />
      <PhotoGroup
        title="ATL Projects Prototype Photos (2025-26)"
        helpText="Upload one photo per project, in order: ECHOMAT, PAGE VOICE, CURRENCY DETECTION, SPELLMATE, BRAILLINK, BRAILLE EASE, EYENOVA, BAROVOICE, MEDI SENSE, BEEP BASE BALL, EDUPLAY BOARD."
        collectionName="atlProjectPrototypePhotos2025"
        storageFolder="vwu/atl/projects-2025-26"
      />

      <h3 style={{ fontSize: '1rem', color: 'var(--color-text-light)', textTransform: 'uppercase', letterSpacing: '0.04em', margin: '1.5rem 0 1rem' }}>Activities</h3>
      <PhotoGroup
        title="ZION School Visit Photos (2023-24)"
        helpText="Upload the photos shown under Activities → ZION School Visit for ATL Students (2023-24)."
        collectionName="atlZionVisitPhotos"
        storageFolder="vwu/atl/zion-visit-2023-24"
      />
      <PhotoGroup
        title="International Day of Persons with Disabilities Photos (2023-24)"
        helpText="Upload the photos shown under Activities → International Day of Persons with Disabilities event (2023-24)."
        collectionName="atlDayEventPhotos"
        storageFolder="vwu/atl/atl-day-2023-24"
      />
      <PhotoGroup
        title="International Day of Persons with Disabilities Photos (2024-25)"
        helpText="Upload the 'GLIMPSES OF EVENT' photos shown under Activities → International Day of Persons with Disabilities event (2024-25)."
        collectionName="atlDay2024EventPhotos"
        storageFolder="vwu/atl/atl-day-2024-25"
      />
      <PhotoGroup
        title="TRANCE-2K25 Outcome Photos (2024-25)"
        helpText="Upload the award photos shown under Activities → ATL 2024-25 Outcomes — TRANCE-2K25."
        collectionName="atlTrance2025Photos"
        storageFolder="vwu/atl/trance-2025"
      />
      <PhotoGroup
        title="Client Visit — Zion School Photos (2025-26)"
        helpText="Upload the photos shown under Activities → Client Visit Report — Zion School, Rajahmundry (2025-26)."
        collectionName="atlZion2025VisitPhotos"
        storageFolder="vwu/atl/zion-visit-2025-26"
      />
      <PhotoGroup
        title="International Day of Persons with Disabilities Photos (2025-26)"
        helpText="Upload the photos (distribution, stage, media coverage clipping, student booths) shown under Activities → International Day of Persons with Disabilities Day – Event Report (2025-26)."
        collectionName="atlDay2025EventPhotos"
        storageFolder="vwu/atl/atl-day-2025-26"
      />
      <PhotoGroup
        title="IIC Regional Meet 2025 Vijayawada Photos"
        helpText="Upload the photos shown under Activities → ATL Outcomes (2025-26) — IIC Regional Meet 2025 Vijayawada (VoxDot)."
        collectionName="atlRegionalMeet2025Photos"
        storageFolder="vwu/atl/regional-meet-2025"
      />
      <PhotoGroup
        title="JNTU Kakinada Innovation Fair Photos"
        helpText="Upload the photos shown under Activities → Innovation Project Fair at JNTU Kakinada (BrailleEase)."
        collectionName="atlJntuKakinadaPhotos"
        storageFolder="vwu/atl/jntu-kakinada"
      />
      <PhotoGroup
        title="AVISHKANDHRA / RTIH Photos"
        helpText="Upload the photos shown under Activities → AVISHKANDHRA — RTIH, Rajamahendravaram (DripTrack & SheShield)."
        collectionName="atlRtihPhotos"
        storageFolder="vwu/atl/rtih"
      />
      <PhotoGroup
        title="Rajahmundry Innovation & Incubation Expo Photos"
        helpText="Upload the photos shown under Activities → Innovation & Incubation Center Inauguration — Project Expo at Rajahmundry."
        collectionName="atlRajahmundryExpoPhotos"
        storageFolder="vwu/atl/rajahmundry-expo"
      />

      <h3 style={{ fontSize: '1rem', color: 'var(--color-text-light)', textTransform: 'uppercase', letterSpacing: '0.04em', margin: '1.5rem 0 1rem' }}>Outcomes & Gallery (2023-24)</h3>
      <PhotoGroup
        title="Gallery — Regional Meet KL University Photos"
        helpText="Upload the photos shown under Outcomes & Gallery → Gallery → Regional Meet KL University Vijayawada."
        collectionName="atlGalleryRegionalMeetPhotos"
        storageFolder="vwu/atl/gallery-regional-meet"
      />
      <PhotoGroup
        title="Gallery — IIT Madras AT Makeathon Photos"
        helpText="Upload the photos shown under Outcomes & Gallery → Gallery → IIT Madras AT MAKEATHON event."
        collectionName="atlGalleryIitMadrasPhotos"
        storageFolder="vwu/atl/gallery-iit-madras"
      />
      <PhotoGroup
        title="Gallery — ATL in News Photos"
        helpText="Upload the photos shown under Outcomes & Gallery → Gallery → ATL in News."
        collectionName="atlGalleryNewsPhotos"
        storageFolder="vwu/atl/gallery-news"
      />
    </div>
  );
}
