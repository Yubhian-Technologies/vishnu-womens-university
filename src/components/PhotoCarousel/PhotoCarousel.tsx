import { useEffect, useState } from 'react';
import { PLACEMENT_HIGHLIGHTS_CAROUSEL_RATIO } from '../../lib/placementHighlightsCarousel';

interface Props {
  images: { url: string; path: string }[];
  /** Seconds between slides. */
  intervalSeconds?: number;
}

// Auto-advancing carousel — currently only used to replace the Placement
// Highlights page's Overview text/Key Highlights sidebar with a rotating
// set of admin-uploaded promotional banner photos (Admin -> Placement
// Sub-pages -> Placement Highlights -> Photo Carousel).
//
// A fixed-ratio box (PLACEMENT_HIGHLIGHTS_CAROUSEL_RATIO, matching what the
// admin crop step now enforces on upload) with object-fit: cover, rather
// than sizing the box to each image's own natural dimensions — the admin
// crop step is what's actually responsible for each photo already being
// that shape, but forcing it again here too means the carousel still holds
// a steady height (and any older photo uploaded before that crop step
// existed still displays at the right ratio) instead of visibly resizing
// on every swap.
export default function PhotoCarousel({ images, intervalSeconds = 3 }: Props) {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);

  // Preload every image up front — with a single visible <img> whose `src`
  // swaps on an interval (see the note above), the browser would otherwise
  // only start fetching a photo the moment it's due to appear, showing a
  // blank/broken frame for however long that photo takes to load. Plain
  // `Image()` objects here warm the browser's own cache so by the time a
  // photo becomes active, the visible <img>'s fetch resolves instantly.
  useEffect(() => {
    images.forEach((img) => {
      const preload = new Image();
      preload.src = img.url;
    });
  }, [images]);

  useEffect(() => {
    if (images.length <= 1 || paused) return;
    const id = setInterval(() => {
      setActive((prev) => (prev + 1) % images.length);
    }, intervalSeconds * 1000);
    return () => clearInterval(id);
  }, [images.length, intervalSeconds, paused]);

  if (images.length === 0) return null;

  const current = images[active];

  return (
    <div
      style={{ width: '100%' }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div style={{ width: '100%', aspectRatio: `${PLACEMENT_HIGHLIGHTS_CAROUSEL_RATIO}`, overflow: 'hidden' }}>
        <img
          key={current.path || active}
          src={current.url}
          alt={`Placement highlight photo ${active + 1}`}
          style={{
            display: 'block',
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            // These banner graphics tend to carry a blank/whitespace margin
            // above the actual content (title bleed, logo padding) rather
            // than below it — anchoring the crop to the bottom trims that
            // top margin off first instead of splitting the crop evenly
            // above and below (the default 'center'), which otherwise left
            // a visible gap of empty space at the top of the slide.
            objectPosition: 'bottom',
            animation: 'photo-carousel-fade-in 0.6s ease',
          }}
        />
      </div>
      {images.length > 1 && (
        <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', marginTop: 'var(--space-3)', padding: '0 var(--space-4)' }}>
          {images.map((img, i) => (
            <button
              key={img.path || i}
              type="button"
              aria-label={`Show photo ${i + 1}`}
              onClick={() => setActive(i)}
              style={{
                width: i === active ? 22 : 8,
                height: 8,
                borderRadius: 4,
                border: 'none',
                padding: 0,
                cursor: 'pointer',
                background: i === active ? 'var(--color-accent)' : 'var(--color-light-gray)',
                transition: 'width 0.3s ease, background 0.3s ease',
              }}
            />
          ))}
        </div>
      )}
      <style>{`
        @keyframes photo-carousel-fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>
    </div>
  );
}
