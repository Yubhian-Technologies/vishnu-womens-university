import { useRef, useState } from 'react';
import { uploadFile, type UploadResult } from '../../lib/storage';
import '../ImageUploader/ImageUploader.css';

interface Props {
  folder?: string;
  currentUrl?: string;
  onUploaded: (result: UploadResult) => void;
  label?: string;
  // Defaults to PDF-only (every existing call site relies on this). Pass
  // accept="image/*" + isValidFile checking file.type.startsWith('image/')
  // for a non-cropped image upload (e.g. a scanned chart/document image
  // that shouldn't be cropped, unlike ImageUploader's cover-photo crop flow).
  accept?: string;
  isValidFile?: (file: File) => boolean;
  invalidFileMessage?: string;
}

function fileNameFromUrl(url: string): string {
  try {
    const decoded = decodeURIComponent(url);
    const last = decoded.split('/').pop() || decoded;
    return last.split('?')[0];
  } catch {
    return url;
  }
}

export default function FileUploader({
  folder = 'vwu',
  currentUrl,
  onUploaded,
  label = 'Upload PDF',
  accept = '.pdf,application/pdf',
  isValidFile = (file) => file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf'),
  invalidFileMessage = 'Please select a PDF file.',
}: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [fileName, setFileName] = useState<string | null>(currentUrl ? fileNameFromUrl(currentUrl) : null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFile = async (file: File) => {
    if (!isValidFile(file)) { setError(invalidFileMessage); return; }
    setError(null);
    setUploading(true);
    try {
      const result = await uploadFile(file, folder);
      setFileName(file.name);
      onUploaded(result);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="cld-uploader">
      <div
        className={`cld-uploader__drop ${uploading ? 'cld-uploader__drop--loading' : ''}`}
        onClick={() => !uploading && inputRef.current?.click()}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => { e.preventDefault(); const f = e.dataTransfer.files?.[0]; if (f) handleFile(f); }}
      >
        {fileName ? (
          <div className="cld-uploader__placeholder">
            <span className="cld-uploader__icon">📄</span>
            <p>{fileName}</p>
            <p className="cld-uploader__hint">Click or drag & drop to replace</p>
          </div>
        ) : (
          <div className="cld-uploader__placeholder">
            <span className="cld-uploader__icon">📄</span>
            <p>{label}</p>
            <p className="cld-uploader__hint">Click or drag & drop a PDF file</p>
          </div>
        )}
        {uploading && (
          <div className="cld-uploader__overlay">
            <div className="cld-uploader__spinner" />
            <span>Uploading…</span>
          </div>
        )}
      </div>

      {fileName && !uploading && (
        <button type="button" className="cld-uploader__change" onClick={() => inputRef.current?.click()}>
          Change PDF
        </button>
      )}
      {error && <p className="cld-uploader__error">{error}</p>}

      <input
        ref={inputRef}
        type="file"
        accept={accept}
        style={{ display: 'none' }}
        onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); e.target.value = ''; }}
      />
    </div>
  );
}
