import { useState, useRef } from 'react';
import { collection, addDoc, deleteDoc, doc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../../lib/firebase';
import { useOrderedCollection } from '../../../hooks/useCollection';
import { uploadToCloudinary } from '../../../lib/cloudinary';

interface GalleryImage {
  id: string;
  title: string;
  category: string;
  imageUrl: string;
  publicId: string;
  order: number;
}

const CATEGORIES = ['Campus', 'Events', 'Academics', 'Sports', 'Cultural', 'Placements', 'Infrastructure'];

export default function GalleryAdmin() {
  const { docs: images, loading } = useOrderedCollection<GalleryImage>('gallery', 'order');
  const [category, setCategory] = useState('Campus');
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFiles = async (files: FileList) => {
    setUploading(true);
    const arr = Array.from(files);
    for (let i = 0; i < arr.length; i++) {
      setProgress(`Uploading ${i + 1} / ${arr.length}…`);
      try {
        const result = await uploadToCloudinary(arr[i], `vwu/gallery/${category.toLowerCase()}`);
        await addDoc(collection(db, 'gallery'), {
          title: arr[i].name.replace(/\.[^.]+$/, ''),
          category,
          imageUrl: result.secure_url,
          publicId: result.public_id,
          order: images.length + i,
          createdAt: serverTimestamp(),
        });
      } catch (e) {
        console.error(e);
      }
    }
    setUploading(false);
    setProgress('');
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files.length) handleFiles(e.dataTransfer.files);
  };

  const remove = async (id: string) => {
    if (!confirm('Remove this image from the gallery?')) return;
    await deleteDoc(doc(db, 'gallery', id));
  };

  return (
    <div className="admin-section">
      <div className="admin-card">
        <h2 className="admin-card__title">Upload Images</h2>
        <div className="admin-field" style={{ maxWidth: 260 }}>
          <label>Category</label>
          <select value={category} onChange={(e) => setCategory(e.target.value)}>
            {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
          </select>
        </div>
        <div
          className="gallery-drop-zone"
          onClick={() => !uploading && inputRef.current?.click()}
          onDragOver={(e) => e.preventDefault()}
          onDrop={onDrop}
        >
          {uploading ? (
            <>
              <div className="admin-spinner" />
              <p>{progress}</p>
            </>
          ) : (
            <>
              <span style={{ fontSize: '2.5rem' }}>📷</span>
              <p><strong>Click or drag & drop</strong> multiple images here</p>
              <p style={{ fontSize: '0.8rem', color: '#888' }}>JPG, PNG, WebP — uploaded directly to Cloudinary</p>
            </>
          )}
        </div>
        <input ref={inputRef} type="file" accept="image/*" multiple style={{ display: 'none' }}
          onChange={(e) => e.target.files && handleFiles(e.target.files)} />
      </div>

      <div className="admin-card">
        <h2 className="admin-card__title">Gallery ({images.length} images)</h2>
        {loading ? <p className="admin-loading">Loading…</p> : (
          <div className="admin-gallery-grid">
            {images.map((img) => (
              <div key={img.id} className="admin-gallery-item">
                <img src={img.imageUrl} alt={img.title} />
                <div className="admin-gallery-item__overlay">
                  <span className="admin-badge">{img.category}</span>
                  <button className="admin-btn admin-btn--sm admin-btn--danger" onClick={() => remove(img.id)}>✕</button>
                </div>
              </div>
            ))}
            {images.length === 0 && <p className="admin-empty">No images yet.</p>}
          </div>
        )}
      </div>
    </div>
  );
}
