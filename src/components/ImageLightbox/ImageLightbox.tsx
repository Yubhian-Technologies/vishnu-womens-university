import { useEffect } from 'react';
import { X } from 'lucide-react';
import SmoothImage from '../SmoothImage/SmoothImage';
import './ImageLightbox.css';

interface ImageLightboxProps {
  src: string;
  alt: string;
  onClose: () => void;
}

/**
 * Single-image full-screen lightbox — darkened backdrop, centered image
 * (never stretched/cropped, capped to the viewport), an explicit close
 * button, and click-outside-to-close. Reuses the same visual language as
 * the multi-image lightbox in <PhotoGrid> (src/components/PhotoGrid) —
 * just without the prev/next/counter chrome a single image doesn't need.
 */
export default function ImageLightbox({ src, alt, onClose }: ImageLightboxProps) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  return (
    <div className="img-lightbox" onClick={onClose}>
      <button className="img-lightbox__close" onClick={onClose} aria-label="Close"><X size={18} /></button>
      <div className="img-lightbox__wrap" onClick={(e) => e.stopPropagation()}>
        <SmoothImage src={src} alt={alt} />
      </div>
    </div>
  );
}
