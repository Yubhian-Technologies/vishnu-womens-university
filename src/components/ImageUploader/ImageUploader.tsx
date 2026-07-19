import { useRef, useState } from 'react';
import type { UploadResult } from '../../lib/storage';
import { useImageCropModal } from './useImageCropModal';
import './ImageUploader.css';

interface Props {
  folder?: string;
  currentUrl?: string;
  onUploaded: (result: UploadResult) => void;
  label?: string;
  aspect?: number; // e.g. 16/9, 4/3, 1 — omit for free crop
}

export default function ImageUploader({
  folder = 'vwu',
  currentUrl,
  onUploaded,
  label = 'Upload Image',
  aspect,
}: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(currentUrl ?? null);
  const { openCrop, cropModal, uploading, error } = useImageCropModal(aspect ?? 16 / 9);

  const handleFile = (file: File) => {
    openCrop(file, folder, (result) => {
      setPreview(result.url);
      onUploaded(result);
    });
  };

  return (
    <>
      {/* ── Drop zone ── */}
      <div className="cld-uploader">
        <div
          className={`cld-uploader__drop ${uploading ? 'cld-uploader__drop--loading' : ''}`}
          onClick={() => !uploading && inputRef.current?.click()}
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => { e.preventDefault(); const f = e.dataTransfer.files?.[0]; if (f) handleFile(f); }}
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
          onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); e.target.value = ''; }}
        />
      </div>

      {cropModal}
    </>
  );
}
