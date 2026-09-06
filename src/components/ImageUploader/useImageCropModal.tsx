import { useRef, useState, useCallback } from 'react';
import ReactCrop, { type Crop, type PixelCrop, centerCrop, makeAspectCrop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import { uploadImage, type UploadResult } from '../../lib/storage';
import './ImageUploader.css';

const ASPECT_PRESETS = [
  { label: 'Free',  value: undefined },
  { label: '16:9',  value: 16 / 9 },
  { label: '3:1',   value: 3 / 1 },
  { label: '4:3',   value: 4 / 3 },
  { label: '1:1',   value: 1 },
];

function centerAspectCrop(w: number, h: number, aspect: number): Crop {
  return centerCrop(makeAspectCrop({ unit: '%', width: 90 }, aspect, w, h), w, h);
}

// Rotates the source image itself (not just its on-screen display) by
// redrawing it onto a canvas, so the crop step downstream never has to know
// rotation happened — it just sees an already-rotated image, the same as if
// the file had come in that way. PNG (lossless) since this is only an
// intermediate working copy; the final crop step still re-encodes to WebP.
function rotateImageDataUrl(src: string, degrees: number): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const swapped = degrees % 180 !== 0;
      const canvas = document.createElement('canvas');
      canvas.width = swapped ? img.naturalHeight : img.naturalWidth;
      canvas.height = swapped ? img.naturalWidth : img.naturalHeight;
      const ctx = canvas.getContext('2d');
      if (!ctx) { reject(new Error('Could not rotate image.')); return; }
      ctx.translate(canvas.width / 2, canvas.height / 2);
      ctx.rotate((degrees * Math.PI) / 180);
      ctx.drawImage(img, -img.naturalWidth / 2, -img.naturalHeight / 2);
      resolve(canvas.toDataURL('image/png'));
    };
    img.onerror = () => reject(new Error('Could not load image for rotation.'));
    img.src = src;
  });
}

// Nothing on this site is ever displayed larger than this, so there's no
// benefit to uploading (and making every visitor download) pixels beyond
// it — a source photo straight off a phone/DSLR can otherwise sail through
// the crop step at its full native resolution (multi-MB, several thousand
// pixels wide) and become one of the slowest things on the page.
const MAX_OUTPUT_DIMENSION = 1920;

async function cropImageToBlob(img: HTMLImageElement, px: PixelCrop): Promise<Blob> {
  const canvas = document.createElement('canvas');
  const scaleX = img.naturalWidth  / img.width;
  const scaleY = img.naturalHeight / img.height;
  const cropWidth  = px.width  * scaleX;
  const cropHeight = px.height * scaleY;
  const outputScale = Math.min(1, MAX_OUTPUT_DIMENSION / Math.max(cropWidth, cropHeight));
  canvas.width  = cropWidth  * outputScale;
  canvas.height = cropHeight * outputScale;
  const ctx = canvas.getContext('2d')!;
  ctx.drawImage(
    img,
    px.x * scaleX, px.y * scaleY,
    cropWidth, cropHeight,
    0, 0, canvas.width, canvas.height,
  );
  // WebP: same visual quality as JPEG at a meaningfully smaller byte size,
  // and every browser this site supports can both encode (canvas.toBlob)
  // and decode (<img>) it.
  return new Promise((res, rej) =>
    canvas.toBlob((b) => b ? res(b) : rej(new Error('Canvas toBlob failed')), 'image/webp', 0.85),
  );
}

/**
 * The crop-before-upload flow behind ImageUploader, extracted so other admin
 * screens (e.g. SitePhotosAdmin's per-slot "Replace Image") can offer the
 * same crop step without embedding ImageUploader's own drop-zone/preview UI
 * — callers keep their own compact "choose a file" trigger and just call
 * `openCrop(file, folder, onUploaded)` from its onChange handler.
 */
export function useImageCropModal(defaultAspect = 16 / 9) {
  const imgRef = useRef<HTMLImageElement>(null);
  const pendingUpload = useRef<{ folder: string; onUploaded: (r: UploadResult) => void } | null>(null);
  // The as-selected file, never itself rotated — every rotate step re-derives
  // `cropSrc` from this so repeated rotations don't compound quality loss
  // (or drift out of sync with the "0°" starting point).
  const originalSrc = useRef<string | null>(null);

  const [cropSrc,   setCropSrc]   = useState<string | null>(null);
  const [crop,      setCrop]      = useState<Crop>();
  const [pixelCrop, setPixelCrop] = useState<PixelCrop>();
  const [aspect,    setAspect]    = useState<number | undefined>(defaultAspect);
  const [rotation,  setRotation]  = useState(0);
  const [rotating,  setRotating]  = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error,     setError]     = useState<string | null>(null);

  const openCrop = (file: File, folder: string, onUploaded: (r: UploadResult) => void) => {
    if (!file.type.startsWith('image/')) { setError('Please select an image file.'); return; }
    setError(null);
    pendingUpload.current = { folder, onUploaded };
    setRotation(0);
    const reader = new FileReader();
    reader.onload = () => {
      originalSrc.current = reader.result as string;
      setCropSrc(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  // Always rotates from the original (never the already-rotated `cropSrc`)
  // by the full new angle — simpler and lossier-safer than compounding 90°
  // turns on top of each other. Existing crop selection is cleared since the
  // image's own dimensions change on a 90°/270° turn; onImageLoad below
  // re-centers a fresh one once the rotated image finishes loading.
  const rotate = async () => {
    if (!originalSrc.current || rotating) return;
    const next = (rotation + 90) % 360;
    setRotating(true);
    try {
      const rotated = next === 0 ? originalSrc.current : await rotateImageDataUrl(originalSrc.current, next);
      setRotation(next);
      setCrop(undefined);
      setPixelCrop(undefined);
      setCropSrc(rotated);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setRotating(false);
    }
  };

  const onImageLoad = useCallback((e: React.SyntheticEvent<HTMLImageElement>) => {
    const { width, height } = e.currentTarget;
    const initial = aspect
      ? centerAspectCrop(width, height, aspect)
      : centerCrop({ unit: '%', width: 90, height: 90 }, width, height);
    setCrop(initial);
  }, [aspect]);

  const handleAspectChange = (val: number | undefined) => {
    setAspect(val);
    if (!imgRef.current) return;
    const { width, height } = imgRef.current;
    const next = val
      ? centerAspectCrop(width, height, val)
      : centerCrop({ unit: '%', width: 90, height: 90 }, width, height);
    setCrop(next);
  };

  const confirmCrop = async () => {
    const pending = pendingUpload.current;
    if (!imgRef.current || !pixelCrop || !pending) return;
    setUploading(true);
    setCropSrc(null);
    try {
      const blob = await cropImageToBlob(imgRef.current, pixelCrop);
      const file = new File([blob], 'cropped.webp', { type: 'image/webp' });
      const result = await uploadImage(file, pending.folder);
      pending.onUploaded(result);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setUploading(false);
      pendingUpload.current = null;
    }
  };

  const cropModal = cropSrc && (
    <div className="crop-modal-backdrop" onClick={(e) => e.target === e.currentTarget && setCropSrc(null)}>
      <div className="crop-modal">
        <div className="crop-modal__header">
          <h3>Crop Image</h3>
          <button className="crop-modal__close" onClick={() => setCropSrc(null)}>✕</button>
        </div>

        <div className="crop-aspect-bar">
          <span className="crop-aspect-label">Aspect Ratio:</span>
          {ASPECT_PRESETS.map((p) => (
            <button
              key={p.label}
              type="button"
              className={`crop-aspect-btn${aspect === p.value ? ' active' : ''}`}
              onClick={() => handleAspectChange(p.value)}
            >
              {p.label}
            </button>
          ))}
          <button
            type="button"
            className="crop-aspect-btn crop-rotate-btn"
            onClick={rotate}
            disabled={rotating}
            title="Rotate 90°"
          >
            ⟳ Rotate
          </button>
        </div>

        <div className="crop-modal__canvas">
          <ReactCrop
            crop={crop}
            onChange={(c) => setCrop(c)}
            onComplete={(c) => setPixelCrop(c)}
            aspect={aspect}
            minWidth={40}
            minHeight={40}
          >
            <img
              ref={imgRef}
              src={cropSrc}
              alt="Crop source"
              className="crop-modal__img"
              onLoad={onImageLoad}
            />
          </ReactCrop>
        </div>

        <div className="crop-modal__actions">
          <button type="button" className="admin-btn admin-btn--ghost" onClick={() => setCropSrc(null)}>
            Cancel
          </button>
          <button
            type="button"
            className="admin-btn admin-btn--primary"
            onClick={confirmCrop}
            disabled={!pixelCrop || pixelCrop.width < 1}
          >
            Crop & Upload
          </button>
        </div>
      </div>
    </div>
  );

  return { openCrop, cropModal, uploading, error };
}
