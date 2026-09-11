import { useRef, useEffect, useState, useCallback } from 'react';
import { useOrderedCollection } from '../../hooks/useCollection';
import SmoothImage from '../SmoothImage/SmoothImage';
import type { AlumniEvent } from '../../pages/Admin/sections/AlumniEventsAdmin';
import './AlumniConnect.css';

// Row 1 text content
const ROW1_TEXT = {
  title: 'SVES Global Alumni Network',
  desc: "Launched in January 2025, The SVES GLOBAL ALUMNI NETWORK is an enterprising community where alumni and students connect to create win-win opportunities worldwide. From mentorship and research collaborations to job opportunities and entrepreneurship initiatives, alumni from 1997 to today, spanning India, the USA, Canada, Germany, the UK, the Netherlands, Australia, New Zealand, and beyond, are driving real change.",
};

// Row 2 text content
const ROW2_TEXT = {
  title: 'A Community That Delivers Results',
  desc: "With the 'Alumni Spotlight' showcasing success stories and entrepreneurial alumni opening doors for projects and internships, this network is already delivering results. Through regional chapters, global events, career support, and collaboration initiatives, the SVES Global Alumni Network serves as a catalyst for personal growth, professional success, and lifelong engagement. Whether you are an entrepreneur, a technologist, a healthcare professional, an educator, or a leader in your field, this community is your home — a place to reconnect, give back, and grow together.",
};

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

  // Separate photos by row
  const row1Photos = events.filter((e) => e.row === 1 && e.displayType === 'photo');
  const row2Photos = events.filter((e) => e.row === 2 && e.displayType === 'photo');

  // Always render the section — text is hardcoded, photos are optional
  return (
    <section className="alumni-connect" aria-label="Alumni Connect">
      <div className="container">
        {/* Header */}
        <header className="alumni-connect-header">
          <p className="alumni-connect-eyebrow">Stay Connected</p>
          <h2 className="alumni-connect-title">Alumni Connect</h2>
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
            <h3 className="alumni-connect-text-title">{ROW1_TEXT.title}</h3>
            <p className="alumni-connect-text-desc">{ROW1_TEXT.desc}</p>
          </div>
        </div>

        {/* Row 2: Text 40% | Photos 60% */}
        <div className="alumni-connect-row alumni-connect-row--reversed">
          <div className="alumni-connect-text">
            <h3 className="alumni-connect-text-title">{ROW2_TEXT.title}</h3>
            <p className="alumni-connect-text-desc">{ROW2_TEXT.desc}</p>
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
          <a href="https://alumni.srivishnu.edu.in/" target="_blank" rel="noopener noreferrer" className="btn btn-primary btn-lg">
            Explore Our Global Alumni
          </a>
        </div>
      </div>
    </section>
  );
}
