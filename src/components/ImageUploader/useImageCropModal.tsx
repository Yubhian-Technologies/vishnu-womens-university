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

async function cropImageToBlob(img: HTMLImageElement, px: PixelCrop): Promise<Blob> {
  const canvas = document.createElement('canvas');
  const scaleX = img.naturalWidth  / img.width;
  const scaleY = img.naturalHeight / img.height;
  canvas.width  = px.width  * scaleX;
  canvas.height = px.height * scaleY;
  const ctx = canvas.getContext('2d')!;
  ctx.drawImage(
    img,
    px.x * scaleX, px.y * scaleY,
    px.width * scaleX, px.height * scaleY,
    0, 0, canvas.width, canvas.height,
  );
  return new Promise((res, rej) =>
    canvas.toBlob((b) => b ? res(b) : rej(new Error('Canvas toBlob failed')), 'image/jpeg', 0.92),
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

  const [cropSrc,   setCropSrc]   = useState<string | null>(null);
  const [crop,      setCrop]      = useState<Crop>();
  const [pixelCrop, setPixelCrop] = useState<PixelCrop>();
  const [aspect,    setAspect]    = useState<number | undefined>(defaultAspect);
  const [uploading, setUploading] = useState(false);
  const [error,     setError]     = useState<string | null>(null);

  const openCrop = (file: File, folder: string, onUploaded: (r: UploadResult) => void) => {
    if (!file.type.startsWith('image/')) { setError('Please select an image file.'); return; }
    setError(null);
    pendingUpload.current = { folder, onUploaded };
    const reader = new FileReader();
    reader.onload = () => setCropSrc(reader.result as string);
    reader.readAsDataURL(file);
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
      const file = new File([blob], 'cropped.jpg', { type: 'image/jpeg' });
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
