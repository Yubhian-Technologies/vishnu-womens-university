import { useEffect, useState } from 'react';

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
// Deliberately a single <img> whose `src` swaps on an interval, sized by
// `height: auto` at a fixed max width, rather than the more common
// absolutely-positioned-stack-of-images crossfade: these banner photos can
// be any aspect ratio (promotional graphics, not uniform headshots), and a
// fixed aspect-ratio box would either crop them (object-fit: cover) or
// leave mismatched empty padding around them (object-fit: contain) unless
// it happened to exactly match each image's own ratio. Sizing the box to
// whatever the current image actually is avoids guessing that ratio
// entirely — every image displays at its own true proportions, uncropped,
// with no wasted space. The trade-off is a plain fade-in on each swap
// instead of a true crossfade (which needs two images overlaid, and thus a
// fixed-height container — the exact thing being avoided here).
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
      <img
        key={current.path || active}
        src={current.url}
        alt={`Placement highlight photo ${active + 1}`}
        style={{
          display: 'block',
          width: '100%',
          height: 'auto',
          animation: 'photo-carousel-fade-in 0.6s ease',
        }}
      />
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
