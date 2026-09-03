import { useEffect, useRef, useState } from 'react';
import { X } from 'lucide-react';

interface PhotoCarouselCard {
  name: string;
  subtitle: string;
  imageUrl: string;
  storagePath: string;
}

const CARD_WIDTH = 200;

// A 2x-size preview, not the shared <ImageLightbox> full-screen modal — this
// strip's cards are 200px thumbnails, so "click to zoom" here means showing
// the photo at 400px (capped to the viewport on small screens), not blowing
// it up to fill the whole screen.
function ZoomPreview({ url, alt, onClose }: { url: string; alt: string; onClose: () => void }) {
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
    <div
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9000,
        background: 'rgba(5, 18, 13, 0.75)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 'var(--space-6)',
      }}
    >
      <button
        onClick={onClose}
        aria-label="Close"
        style={{
          position: 'absolute',
          top: 'var(--space-5)',
          right: 'var(--space-5)',
          width: 40,
          height: 40,
          borderRadius: '50%',
          background: 'rgba(255, 255, 255, 0.14)',
          border: '1px solid rgba(255, 255, 255, 0.3)',
          color: '#fff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
        }}
      >
        <X size={18} />
      </button>
      <img
        src={url}
        alt={alt}
        onClick={(e) => e.stopPropagation()}
        style={{
          width: CARD_WIDTH * 2,
          maxWidth: '90vw',
          maxHeight: '85vh',
          height: 'auto',
          borderRadius: 'var(--radius-md)',
          boxShadow: '0 24px 60px rgba(0, 0, 0, 0.5)',
          objectFit: 'contain',
        }}
      />
    </div>
  );
}

interface Props {
  cards: PhotoCarouselCard[];
  /** Pixels of horizontal travel per second — controls how fast the strip
   *  moves, independent of how many cards there are. */
  pixelsPerSecond?: number;
}

// Placement Highlights' "Photo Carousel" — continuously moving, not an
// interval-based "scroll one page every few seconds": that approach only
// does anything once there are enough cards to overflow the row's width,
// so with just 2-3 photos (which fit fine on their own) there was nothing
// to scroll to and it looked broken. This instead renders the card list
// twice back-to-back and loops a CSS transform from 0 to -50% forever, so
// the strip is always visibly moving no matter how many photos exist now
// or get added later. Cards use a fixed marginRight (not a flex `gap`) so
// the spacing is identical at the seam between the two copies as it is
// everywhere else — the loop point is invisible. Duration is computed from
// the actual measured content width divided by a constant px/sec speed
// (re-measured whenever the card list changes), so more cards make a
// longer loop at the same visual speed rather than a faster/slower one.
export default function PhotoCarouselStrip({ cards, pixelsPerSecond = 60 }: Props) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [duration, setDuration] = useState(20);
  const [paused, setPaused] = useState(false);
  const [zoomed, setZoomed] = useState<{ url: string; alt: string } | null>(null);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    // The track holds two copies of `cards` back to back so the loop point
    // (translateX(-50%)) lines up seamlessly — half its measured width is
    // one copy's actual width.
    const singleCopyWidth = track.scrollWidth / 2;
    if (singleCopyWidth > 0) setDuration(singleCopyWidth / pixelsPerSecond);
  }, [cards, pixelsPerSecond]);

  if (cards.length === 0) return null;

  const renderCard = (card: PhotoCarouselCard, key: string) => (
    <div key={key} style={{ flex: `0 0 ${CARD_WIDTH}px`, marginRight: 'var(--space-5)' }}>
      <img
        src={card.imageUrl}
        alt={card.name || 'Photo'}
        onClick={() => setZoomed({ url: card.imageUrl, alt: card.name || 'Photo' })}
        style={{ display: 'block', width: '100%', height: 'auto', borderRadius: 'var(--radius-md)', cursor: 'zoom-in' }}
      />
      {(card.name || card.subtitle) && (
        <>
          <p style={{ fontFamily: 'var(--font-sans)', fontWeight: 700, color: 'var(--color-primary)', fontSize: 'var(--text-sm)', marginTop: 'var(--space-3)', marginBottom: 'var(--space-1)' }}>
            {card.name}
          </p>
          <p style={{ color: 'var(--color-text-light)', fontSize: 'var(--text-xs)' }}>
            {card.subtitle}
          </p>
        </>
      )}
    </div>
  );

  return (
    <div
      style={{ overflow: 'hidden' }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div
        ref={trackRef}
        style={{
          display: 'flex',
          width: 'max-content',
          animation: `photo-carousel-marquee ${duration}s linear infinite`,
          animationPlayState: paused || zoomed ? 'paused' : 'running',
        }}
      >
        {cards.map((card, i) => renderCard(card, `a-${card.storagePath || i}`))}
        {cards.map((card, i) => renderCard(card, `b-${card.storagePath || i}`))}
      </div>
      <style>{`
        @keyframes photo-carousel-marquee {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
      `}</style>
      {zoomed && <ZoomPreview url={zoomed.url} alt={zoomed.alt} onClose={() => setZoomed(null)} />}
    </div>
  );
}
