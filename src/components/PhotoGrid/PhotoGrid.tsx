import { useState, useEffect, useRef } from 'react';
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
  highlights?: string[];
  columns?: 2 | 3 | 4;
  variant?: 'collage' | 'grid';
  layout?: 'default' | 'side-text' | 'side-text-reverse';
  showGalleryLink?: boolean;
  className?: string;
}

export default function PhotoGrid({
  images,
  label = 'Gallery',
  title = 'Campus in Pictures',
  subtitle,
  highlights,
  columns = 3,
  variant = 'collage',
  layout = 'default',
  showGalleryLink = true,
  className = '',
}: PhotoGridProps) {
  const [lightbox, setLightbox] = useState<number | null>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  // Per-image scroll animation
  useEffect(() => {
    const items = gridRef.current?.querySelectorAll('.photo-grid-item');
    if (!items) return;
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const el = entry.target as HTMLElement;
            const delay = parseInt(el.dataset.animDelay || '0');
            setTimeout(() => el.classList.add('photo-animated'), delay);
            obs.unobserve(el);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );
    items.forEach((item) => obs.observe(item));
    return () => obs.disconnect();
  }, [images]);

  // Lightbox keyboard nav
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

  // Animation direction per item index
  const getAnimClass = (i: number, featured: boolean) => {
    if (featured) return 'photo-anim-scale';
    if (i % 3 === 1) return 'photo-anim-right';
    if (i % 3 === 2) return 'photo-anim-left';
    return 'photo-anim-up';
  };

  const imageGrid = (
    <div className={`photo-grid ${gridClass}`} ref={gridRef}>
      {images.map((img, i) => {
        const featured = i === 0 && variant === 'collage';
        return (
          <button
            key={i}
            className={`photo-grid-item ${getAnimClass(i, featured)}${featured ? ' photo-grid-item--featured' : ''}`}
            data-anim-delay={`${Math.min(i, 5) * 90}`}
            onClick={() => setLightbox(i)}
            aria-label={`View ${img.alt}`}
          >
            <img src={img.src} alt={img.alt} loading="lazy" />
            {img.caption && <div className="photo-grid-caption">{img.caption}</div>}
            <div className="photo-grid-overlay">
              <span className="photo-grid-zoom">⤢</span>
            </div>
          </button>
        );
      })}
    </div>
  );

  const textPanel = (
    <div className="photo-text-panel">
      {label && <span className="section-label">{label}</span>}
      {title && <h2 className="section-title">{title}</h2>}
      {subtitle && <p className="photo-text-desc">{subtitle}</p>}
      {highlights && highlights.length > 0 && (
        <ul className="photo-highlights">
          {highlights.map((h, i) => (
            <li key={i}>
              <span className="photo-highlight-dot" />
              {h}
            </li>
          ))}
        </ul>
      )}
      {showGalleryLink && (
        <Link to="/news-awards/gallery" className="btn btn-outline photo-text-cta">
          View Full Gallery →
        </Link>
      )}
    </div>
  );

  if (layout === 'side-text' || layout === 'side-text-reverse') {
    const reversed = layout === 'side-text-reverse';
    return (
      <div className={`photo-grid-wrapper photo-side-layout${reversed ? ' photo-side-reversed' : ''} ${className}`}>
        {reversed ? (
          <>
            <div className="photo-side-images">{imageGrid}</div>
            <div className="photo-side-text">{textPanel}</div>
          </>
        ) : (
          <>
            <div className="photo-side-text">{textPanel}</div>
            <div className="photo-side-images">{imageGrid}</div>
          </>
        )}
      </div>
    );
  }

  return (
    <div className={`photo-grid-wrapper ${className}`}>
      {(label || title) && (
        <div className="photo-grid-header">
          {label && <span className="section-label">{label}</span>}
          {title && <h2 className="section-title">{title}</h2>}
          {subtitle && <p className="section-desc">{subtitle}</p>}
        </div>
      )}
      {imageGrid}
      {showGalleryLink && (
        <div className="photo-grid-footer">
          <Link to="/news-awards/gallery" className="btn btn-outline">View Full Gallery →</Link>
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
            {images[lightbox].caption && <p className="photo-lightbox-caption">{images[lightbox].caption}</p>}
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
