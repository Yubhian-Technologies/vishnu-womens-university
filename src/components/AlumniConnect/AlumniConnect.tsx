import { useRef, useEffect, useState, useCallback } from 'react';
import { useOrderedCollection } from '../../hooks/useCollection';
import { useDocument } from '../../hooks/useDocument';
import { HOME_CONTENT_COLLECTION, HOME_CONTENT_DOC_ID, type HomeContentDoc, DEFAULT_HOME_CONTENT } from '../../constants/homeContentDefaults';
import SmoothImage from '../SmoothImage/SmoothImage';
import type { AlumniEvent } from '../../pages/Admin/sections/AlumniEventsAdmin';
import { renderBold } from '../../lib/boldText';
import './AlumniConnect.css';

interface PhotoScrollerProps {
  photos: AlumniEvent[];
  speed?: number; // pixels per frame (lower = slower)
}

function PhotoScroller({ photos, speed = 0.5 }: PhotoScrollerProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [isPaused, setIsPaused] = useState(false);
  const animationRef = useRef<number>();
  const scrollPosRef = useRef(0);

  useEffect(() => {
    const track = trackRef.current;
    if (!track || photos.length === 0) return;

    const animate = () => {
      if (!isPaused && track) {
        scrollPosRef.current += speed;
        // Reset when we've scrolled through half (for seamless loop)
        if (scrollPosRef.current >= track.scrollWidth / 2) {
          scrollPosRef.current = 0;
        }
        track.scrollLeft = scrollPosRef.current;
      }
      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [isPaused, photos.length, speed]);

  const handleMouseEnter = useCallback(() => setIsPaused(true), []);
  const handleMouseLeave = useCallback(() => setIsPaused(false), []);

  if (photos.length === 0) return null;

  // Duplicate photos for seamless infinite scroll
  const displayPhotos = [...photos, ...photos];

  return (
    <div
      className="alumni-photo-scroller"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onTouchStart={handleMouseEnter}
      onTouchEnd={handleMouseLeave}
    >
      <div className="alumni-photo-track" ref={trackRef}>
        {displayPhotos.map((photo, i) => (
          <div key={`${photo.id}-${i}`} className="alumni-photo-card">
            <SmoothImage
              src={photo.photoUrl || ''}
              alt={photo.title}
              loading="lazy"
              decoding="async"
            />
          </div>
        ))}
      </div>
      {/* Fade edges */}
      <div className="alumni-photo-fade-left" aria-hidden="true" />
      <div className="alumni-photo-fade-right" aria-hidden="true" />
    </div>
  );
}

export default function AlumniConnect() {
  const { docs: events } = useOrderedCollection<AlumniEvent>('alumniEvents', 'order');
  const { data: remoteHomeContent } = useDocument<HomeContentDoc>(HOME_CONTENT_COLLECTION, HOME_CONTENT_DOC_ID);

  const alumni = remoteHomeContent?.alumniContent || DEFAULT_HOME_CONTENT.alumniContent;

  const eyebrow = alumni?.eyebrow || DEFAULT_HOME_CONTENT.alumniContent.eyebrow;
  const title = alumni?.title || DEFAULT_HOME_CONTENT.alumniContent.title;
  const row1Title = alumni?.row1Title || DEFAULT_HOME_CONTENT.alumniContent.row1Title;
  const row1Desc = alumni?.row1Desc || DEFAULT_HOME_CONTENT.alumniContent.row1Desc;
  const row2Title = alumni?.row2Title || DEFAULT_HOME_CONTENT.alumniContent.row2Title;
  const row2Desc = alumni?.row2Desc || DEFAULT_HOME_CONTENT.alumniContent.row2Desc;
  const ctaLabel = alumni?.ctaLabel || DEFAULT_HOME_CONTENT.alumniContent.ctaLabel;
  const ctaHref = alumni?.ctaHref || DEFAULT_HOME_CONTENT.alumniContent.ctaHref;

  // Separate photos by row
  const row1Photos = events.filter((e) => e.row === 1 && e.displayType === 'photo');
  const row2Photos = events.filter((e) => e.row === 2 && e.displayType === 'photo');

  return (
    <section className="alumni-connect" aria-label="Alumni Connect">
      <div className="container">
        {/* Header */}
        <header className="alumni-connect-header">
          <p className="alumni-connect-eyebrow">{eyebrow}</p>
          <h2 className="alumni-connect-title">{title}</h2>
        </header>

        {/* Row 1: Photos 60% | Text 40% */}
        <div className="alumni-connect-row">
          <div className="alumni-connect-photos">
            {row1Photos.length > 0 ? (
              <PhotoScroller photos={row1Photos} />
            ) : (
              <div className="alumni-connect-photos-placeholder" />
            )}
          </div>
          <div className="alumni-connect-text">
            <h3 className="alumni-connect-text-title">{row1Title}</h3>
            <p className="alumni-connect-text-desc">{renderBold(row1Desc)}</p>
          </div>
        </div>

        {/* Row 2: Text 40% | Photos 60% */}
        <div className="alumni-connect-row alumni-connect-row--reversed">
          <div className="alumni-connect-text">
            <h3 className="alumni-connect-text-title">{row2Title}</h3>
            <p className="alumni-connect-text-desc">{renderBold(row2Desc)}</p>
          </div>
          <div className="alumni-connect-photos">
            {row2Photos.length > 0 ? (
              <PhotoScroller photos={row2Photos} speed={0.4} />
            ) : (
              <div className="alumni-connect-photos-placeholder" />
            )}
          </div>
        </div>

        {/* CTA */}
        <div className="alumni-connect-cta">
          <a href={ctaHref} target="_blank" rel="noopener noreferrer" className="btn btn-primary btn-lg">
            {ctaLabel}
          </a>
        </div>
      </div>
    </section>
  );
}
