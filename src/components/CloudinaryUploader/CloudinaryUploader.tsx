import { useRef, useState } from 'react';
import { uploadToCloudinary, type CloudinaryResult } from '../../lib/cloudinary';
import './CloudinaryUploader.css';

interface Props {
  folder?: string;
  currentUrl?: string;
  onUploaded: (result: CloudinaryResult) => void;
  label?: string;
}

export default function CloudinaryUploader({
  folder = 'vwu',
  currentUrl,
  onUploaded,
  label = 'Upload Image',
}: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(currentUrl ?? null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFile = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file.');
      return;
    }
    setError(null);
    setPreview(URL.createObjectURL(file));
    setUploading(true);
    try {
      const result = await uploadToCloudinary(file, folder);
      onUploaded(result);
    } catch (e) {
      setError((e as Error).message);
      setPreview(currentUrl ?? null);
    } finally {
      setUploading(false);
    }
  };

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  };

  return (
    <div className="cld-uploader">
      <div
        className={`cld-uploader__drop ${uploading ? 'cld-uploader__drop--loading' : ''}`}
        onClick={() => !uploading && inputRef.current?.click()}
        onDragOver={(e) => e.preventDefault()}
        onDrop={onDrop}
      >
        {preview ? (
          <img src={preview} alt="Preview" className="cld-uploader__preview" />
        ) : (
          <div className="cld-uploader__placeholder">
            <span className="cld-uploader__icon">🖼️</span>
            <p>{label}</p>
            <p className="cld-uploader__hint">Click or drag & drop</p>
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
        <button
          type="button"
          className="cld-uploader__change"
          onClick={() => inputRef.current?.click()}
        >
          Change Image
        </button>
      )}
      {error && <p className="cld-uploader__error">{error}</p>}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        style={{ display: 'none' }}
        onChange={onInputChange}
      />
    </div>
  );
}
