import { useRef, useState, useCallback } from 'react';
import ReactCrop, { type Crop, type PixelCrop, centerCrop, makeAspectCrop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import { uploadToCloudinary, type CloudinaryResult } from '../../lib/cloudinary';
import './CloudinaryUploader.css';

interface Props {
  folder?: string;
  currentUrl?: string;
  onUploaded: (result: CloudinaryResult) => void;
  label?: string;
  aspect?: number; // e.g. 16/9, 4/3, 1 — omit for free crop
}

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

export default function CloudinaryUploader({
  folder = 'vwu',
  currentUrl,
  onUploaded,
  label = 'Upload Image',
  aspect: defaultAspect,
}: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const imgRef   = useRef<HTMLImageElement>(null);

  const [preview,    setPreview]    = useState<string | null>(currentUrl ?? null);
  const [uploading,  setUploading]  = useState(false);
  const [error,      setError]      = useState<string | null>(null);

  // crop modal state
  const [cropSrc,    setCropSrc]    = useState<string | null>(null);
  const [crop,       setCrop]       = useState<Crop>();
  const [pixelCrop,  setPixelCrop]  = useState<PixelCrop>();
  const [aspect,     setAspect]     = useState<number | undefined>(defaultAspect ?? 16 / 9);

  const openCrop = (file: File) => {
    if (!file.type.startsWith('image/')) { setError('Please select an image file.'); return; }
    setError(null);
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
    if (!imgRef.current || !pixelCrop) return;
    setUploading(true);
    setCropSrc(null);
    try {
      const blob   = await cropImageToBlob(imgRef.current, pixelCrop);
      const file   = new File([blob], 'cropped.jpg', { type: 'image/jpeg' });
      setPreview(URL.createObjectURL(blob));
      const result = await uploadToCloudinary(file, folder);
      onUploaded(result);
      setError(null);
    } catch (e) {
      setError((e as Error).message);
      setPreview(currentUrl ?? null);
    } finally {
      setUploading(false);
    }
  };

  return (
    <>
      {/* ── Drop zone ── */}
      <div className="cld-uploader">
        <div
          className={`cld-uploader__drop ${uploading ? 'cld-uploader__drop--loading' : ''}`}
          onClick={() => !uploading && inputRef.current?.click()}
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => { e.preventDefault(); const f = e.dataTransfer.files?.[0]; if (f) openCrop(f); }}
        >
          {preview ? (
            <img src={preview} alt="Preview" className="cld-uploader__preview" />
          ) : (
            <div className="cld-uploader__placeholder">
              <span className="cld-uploader__icon">🖼️</span>
              <p>{label}</p>
              <p className="cld-uploader__hint">Click or drag & drop — crop before upload</p>
            </div>
          )}
          {uploading && (
            <div className="cld-uploader__overlay">
              <div className="cld-uploader__spinner" />
              <span>Uploading…</span>
            </div>
          )}
        </div>

        {preview && !uploading && (
          <button type="button" className="cld-uploader__change" onClick={() => inputRef.current?.click()}>
            Change Image
          </button>
        )}
        {error && <p className="cld-uploader__error">{error}</p>}

        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          style={{ display: 'none' }}
          onChange={(e) => { const f = e.target.files?.[0]; if (f) openCrop(f); e.target.value = ''; }}
        />
      </div>

      {/* ── Crop Modal ── */}
      {cropSrc && (
        <div className="crop-modal-backdrop" onClick={(e) => e.target === e.currentTarget && setCropSrc(null)}>
          <div className="crop-modal">
            <div className="crop-modal__header">
              <h3>Crop Image</h3>
              <button className="crop-modal__close" onClick={() => setCropSrc(null)}>✕</button>
            </div>

            {/* Aspect ratio presets */}
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
      )}
    </>
  );
}
