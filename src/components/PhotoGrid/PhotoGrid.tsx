import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './PhotoGrid.css';

export interface PhotoItem {
  src: string;
  alt: string;
  caption?: string;
}

interface PhotoGridProps {
  images: PhotoItem[];
  label?: string;
  title?: string;
  subtitle?: string;
  columns?: 2 | 3 | 4;
  variant?: 'grid' | 'collage';
  showGalleryLink?: boolean;
  className?: string;
}

export default function PhotoGrid({
  images,
  label = 'Gallery',
  title = 'Campus in Pictures',
  subtitle,
  columns = 3,
  variant = 'collage',
  showGalleryLink = true,
  className = '',
}: PhotoGridProps) {
  const [lightbox, setLightbox] = useState<number | null>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (lightbox === null) return;
      if (e.key === 'Escape') setLightbox(null);
      if (e.key === 'ArrowRight') setLightbox(i => i !== null ? (i + 1) % images.length : null);
      if (e.key === 'ArrowLeft') setLightbox(i => i !== null ? (i - 1 + images.length) % images.length : null);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [lightbox, images.length]);

  useEffect(() => {
    document.body.style.overflow = lightbox !== null ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [lightbox]);

  const gridClass = variant === 'collage'
    ? `photo-grid-collage photo-grid-collage-${columns}`
    : `photo-grid-cols-${columns}`;

  return (
    <div className={`photo-grid-wrapper ${className}`}>
      {(label || title) && (
        <div className="photo-grid-header reveal">
          {label && <span className="section-label">{label}</span>}
          {title && <h2 className="section-title">{title}</h2>}
          {subtitle && <p className="section-desc">{subtitle}</p>}
        </div>
      )}

      <div className={`photo-grid ${gridClass}`}>
        {images.map((img, i) => (
          <button
            key={i}
            className={`photo-grid-item reveal${i === 0 && variant === 'collage' ? ' photo-grid-item--featured' : ''}`}
            data-delay={`${Math.min(i, 4) * 60}`}
            onClick={() => setLightbox(i)}
            aria-label={`View ${img.alt}`}
          >
            <img src={img.src} alt={img.alt} loading="lazy" />
            {img.caption && <div className="photo-grid-caption">{img.caption}</div>}
            <div className="photo-grid-overlay">
              <span className="photo-grid-zoom">⤢</span>
            </div>
          </button>
        ))}
      </div>

      {showGalleryLink && (
        <div className="photo-grid-footer reveal">
          <Link to="/news-awards/gallery" className="btn btn-outline">
            View Full Gallery →
          </Link>
        </div>
      )}

      {/* Lightbox */}
      {lightbox !== null && (
        <div className="photo-lightbox" onClick={() => setLightbox(null)}>
          <button className="photo-lightbox-close" onClick={() => setLightbox(null)} aria-label="Close">✕</button>
          <button
            className="photo-lightbox-prev"
            onClick={e => { e.stopPropagation(); setLightbox(i => i !== null ? (i - 1 + images.length) % images.length : null); }}
            aria-label="Previous"
          >‹</button>
          <div className="photo-lightbox-img-wrap" onClick={e => e.stopPropagation()}>
            <img src={images[lightbox].src.replace('w=800', 'w=1600')} alt={images[lightbox].alt} />
            {images[lightbox].caption && (
              <p className="photo-lightbox-caption">{images[lightbox].caption}</p>
            )}
          </div>
          <button
            className="photo-lightbox-next"
            onClick={e => { e.stopPropagation(); setLightbox(i => i !== null ? (i + 1) % images.length : null); }}
            aria-label="Next"
          >›</button>
          <div className="photo-lightbox-counter">{lightbox + 1} / {images.length}</div>
        </div>
      )}
    </div>
  );
}
