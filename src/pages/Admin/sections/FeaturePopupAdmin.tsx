import { useEffect, useState } from 'react';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '../../../lib/firebase';
import { useDocument } from '../../../hooks/useDocument';
import ImageUploader from '../../../components/ImageUploader/ImageUploader';
import { deleteFile, type UploadResult } from '../../../lib/storage';

export interface FeaturePopupDoc {
  id?: string;
  isImage: boolean;
  imageUrl: string;
  storagePath: string;
}

const DOC_COLLECTION = 'settings';
const DOC_ID = 'featurePopup';

export default function FeaturePopupAdmin() {
  const { data, loading } = useDocument<FeaturePopupDoc>(DOC_COLLECTION, DOC_ID);
  const [isImage, setIsImage] = useState(false);
  const [imageUrl, setImageUrl] = useState('');
  const [storagePath, setStoragePath] = useState('');
  const [saving, setSaving] = useState(false);
  const [hasInitialized, setHasInitialized] = useState(false);

  useEffect(() => {
    if (!loading && !hasInitialized) {
      if (data) {
        setIsImage(!!data.isImage);
        setImageUrl(data.imageUrl || '');
        setStoragePath(data.storagePath || '');
      } else {
        setIsImage(false);
        setImageUrl('');
        setStoragePath('');
      }
      setHasInitialized(true);
    }
  }, [data, loading, hasInitialized]);

  // Keep isImage in sync with imageUrl when doc changes after initial load (e.g. external edit)
  useEffect(() => {
    if (hasInitialized && data) {
      // Only sync if doc was deleted/reset externally – don't overwrite user's in-progress edits
    }
  }, [data, hasInitialized]);

  const handleUploaded = (r: UploadResult) => {
    setImageUrl(r.url);
    setStoragePath(r.path);
    setIsImage(true);
  };

  const handleRemove = async () => {
    if (!imageUrl && !storagePath && !isImage) return;
    if (!confirm('Remove popup image? The popup will not be shown on the site.')) return;
    // Delete from storage if exists
    if (storagePath) {
      try {
        await deleteFile(storagePath);
      } catch (e) {
        console.warn('Failed to delete storage file', e);
      }
    }
    setImageUrl('');
    setStoragePath('');
    setIsImage(false);
  };

  const save = async () => {
    if (isImage && !imageUrl) {
      alert('Please upload an image or turn off "Show popup image".');
      return;
    }
    setSaving(true);
    try {
      const payload: FeaturePopupDoc = {
        isImage: isImage && !!imageUrl,
        imageUrl: isImage ? imageUrl : '',
        storagePath: isImage ? storagePath : '',
      };
      await setDoc(doc(db, DOC_COLLECTION, DOC_ID), payload, { merge: true });
      alert('Feature popup saved.');
    } catch (e) {
      alert(`Couldn't save: ${(e as Error).message}`);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p className="admin-loading">Loading…</p>;

  return (
    <div className="admin-section">
      <div className="admin-card">
        <h2 className="admin-card__title">Feature Popup (Homepage)</h2>
        <p className="admin-field__hint" style={{ marginBottom: '1rem' }}>
          Controls the feature popup image shown on site start (after ~2.8s, once per session). Turn on to upload an image, off to hide the popup entirely.
          When <code>isImage = false</code> no image is shown.
        </p>

        <div className="admin-field">
          <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={isImage}
              onChange={(e) => setIsImage(e.target.checked)}
              style={{ width: 18, height: 18 }}
            />
            <span>Show popup image (isImage)</span>
          </label>
          <p className="admin-field__hint">When off, the popup will not appear even if an image is stored.</p>
        </div>

        {isImage && (
          <div className="admin-field" style={{ marginTop: '1rem' }}>
            <label>Popup Image {isImage ? '*' : ''}</label>
            <ImageUploader
              folder="vwu/feature-popup"
              currentUrl={imageUrl}
              onUploaded={handleUploaded}
              label="Upload Popup Image (recommended: 800×1000 JPG)"
            />
            {imageUrl && (
              <div style={{ marginTop: 12, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                <button type="button" className="admin-btn admin-btn--ghost admin-btn--sm" onClick={handleRemove}>
                  Remove image (set isImage false)
                </button>
              </div>
            )}
            {!imageUrl && <p className="admin-field__hint" style={{ color: '#b45309' }}>No image uploaded yet — popup will not show until you upload one and save.</p>}
          </div>
        )}

        {!isImage && (imageUrl || storagePath) && (
          <p className="admin-field__hint" style={{ marginTop: 12, background: '#fff7ed', border: '1px solid #fed7aa', padding: '0.6rem 0.85rem', borderRadius: 6 }}>
            An image is still stored but hidden because <strong>isImage is off</strong>. Turn it on to show it again, or click Remove to delete it permanently before saving.
          </p>
        )}

        <div className="admin-form-actions" style={{ marginTop: '1.25rem' }}>
          <button className="admin-btn admin-btn--primary" onClick={save} disabled={saving}>
            {saving ? 'Saving…' : 'Save'}
          </button>
        </div>
      </div>

      <div className="admin-card">
        <h3 style={{ marginBottom: 8, fontSize: '0.95rem' }}>Current state</h3>
        <ul style={{ fontSize: '0.88rem', color: 'var(--color-text-light)', lineHeight: 1.6, paddingLeft: 18 }}>
          <li><strong>isImage:</strong> {isImage ? 'true — popup will show (if image exists)' : 'false — popup hidden'}</li>
          <li><strong>imageUrl:</strong> {imageUrl ? <a href={imageUrl} target="_blank" rel="noopener noreferrer" style={{ wordBreak: 'break-all' }}>{imageUrl.slice(0, 80)}…</a> : '—'}</li>
          <li><strong>Behaviour:</strong> Popup appears once per session after ~2.8s; dismiss sets session flag.</li>
        </ul>
      </div>
    </div>
  );
}
