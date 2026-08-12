import { useRef, useState } from 'react';
import { uploadFile, deleteFile, type UploadResult } from '../../lib/storage';
import '../ImageUploader/ImageUploader.css';

interface Props {
  folder?: string;
  currentUrl?: string;
  currentPath?: string;
  onUploaded: (result: UploadResult) => void;
  onRemoved?: () => void;
  label?: string;
  /** Max upload size in MB — Firebase Storage has no hard client-side cap,
   *  but a hero background video should stay lightweight for real visitors. */
  maxSizeMb?: number;
}

const MAX_DEFAULT_MB = 40;

export default function VideoUploader({
  folder = 'vwu/video',
  currentUrl,
  currentPath,
  onUploaded,
  onRemoved,
  label = 'Upload Video',
  maxSizeMb = MAX_DEFAULT_MB,
}: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(currentUrl ?? null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFile = async (file: File) => {
    setError(null);
    if (!file.type.startsWith('video/')) {
      setError('Please choose a video file (MP4 recommended).');
      return;
    }
    if (file.size > maxSizeMb * 1024 * 1024) {
      setError(`Video is too large — please keep it under ${maxSizeMb}MB.`);
      return;
    }
    setUploading(true);
    try {
      const result = await uploadFile(file, folder);
      setPreview(result.url);
      onUploaded(result);
    } catch (e) {
      setError((e as Error).message || 'Upload failed.');
    } finally {
      setUploading(false);
    }
  };

  const handleRemove = async () => {
    setPreview(null);
    if (currentPath) await deleteFile(currentPath).catch(() => {});
    onRemoved?.();
  };

  return (
    <div className="cld-uploader">
      <div
        className={`cld-uploader__drop ${uploading ? 'cld-uploader__drop--loading' : ''}`}
        onClick={() => !uploading && inputRef.current?.click()}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => { e.preventDefault(); const f = e.dataTransfer.files?.[0]; if (f) handleFile(f); }}
      >
        {preview ? (
          <video src={preview} className="cld-uploader__preview" muted loop playsInline controls />
        ) : (
          <div className="cld-uploader__placeholder">
            <span className="cld-uploader__icon">🎬</span>
            <p>{label}</p>
            <p className="cld-uploader__hint">Click or drag &amp; drop an MP4 — under {maxSizeMb}MB</p>
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
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button type="button" className="cld-uploader__change" onClick={() => inputRef.current?.click()}>
            Change Video
          </button>
          <button type="button" className="cld-uploader__change" onClick={handleRemove}>
            Remove
          </button>
        </div>
      )}
      {error && <p className="cld-uploader__error">{error}</p>}

      <input
        ref={inputRef}
        type="file"
        accept="video/*"
        style={{ display: 'none' }}
        onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); e.target.value = ''; }}
      />
    </div>
  );
}
