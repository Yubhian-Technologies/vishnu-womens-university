import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useOrderedCollection } from '../../hooks/useCollection';
import { HOME_HERO_VIDEO_SRC, HOME_HERO_POSTER_SRC } from '../../lib/heroVideo';
import {
  HOME_HERO_BANNERS_COLLECTION,
  MAX_HOME_HERO_BANNERS,
  optimizeBannerUrl,
  readCachedBanners,
  writeCachedBanners,
  type HomeHeroBannerDoc,
} from '../../lib/heroBanners';
import './HeroSlider.css';

// HOME_HERO_VIDEO_SRC lives in src/lib/heroVideo.ts (the Campus Visit page's
// virtual tour uses its own HERO_VIDEO_SRC there).
//
// Flow: up to 3 admin-configured full-screen banners (each with a text
// overlay in one of four corners) auto-advance once, then give way to the
// hero video, which stays — the carousel never repeats. With no active
// banners configured, the visitor goes straight to the hero video.

const SLIDE_DURATION = 6000;

type Phase = 'banners' | 'video';

export default function HeroSlider() {
  const { docs: bannerDocs, loading } = useOrderedCollection<HomeHeroBannerDoc>(
    HOME_HERO_BANNERS_COLLECTION,
    'order',
  );
  // Until Firestore's first snapshot arrives, fall back to the banner list
  // from the previous visit so the hero doesn't wait on the network.
  const [cachedDocs] = useState(readCachedBanners);
  const liveReady = !loading;
  const sourceDocs = liveReady ? bannerDocs : cachedDocs;
  const banners = useMemo(
    () =>
      sourceDocs
        .filter((b) => b.active !== false && b.imageUrl)
        .slice(0, MAX_HOME_HERO_BANNERS),
    [sourceDocs],
  );
  useEffect(() => {
    if (liveReady) writeCachedBanners(bannerDocs);
  }, [liveReady, bannerDocs]);

  const [current, setCurrent] = useState(0);
  // Once the carousel hands over to the video it never comes back.
  const [videoReached, setVideoReached] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);
  const sectionRef = useRef<HTMLElement>(null);

  // "Decided" = we know whether banners exist (live snapshot or cached list).
  // Until then the video's poster frame fills the hero — never a blank
  // background — and a banner simply fades in over it if one turns out to exist.
  const decided = liveReady || cachedDocs.length > 0;
  const phase: Phase = videoReached || (decided && banners.length === 0) ? 'video' : 'banners';
  const ready = decided;
  const showVideo = ready && phase === 'video';
  const bannerIndex = Math.min(current, Math.max(banners.length - 1, 0));

  const goToVideo = useCallback(() => {
    setVideoReached(true);
    if (videoRef.current) videoRef.current.currentTime = 0;
  }, []);

  const prev = useCallback(() => {
    setCurrent((c) => Math.max(0, c - 1));
  }, []);

  const next = useCallback(() => {
    if (bannerIndex >= banners.length - 1) goToVideo();
    else setCurrent(bannerIndex + 1);
  }, [bannerIndex, banners.length, goToVideo]);

  // Auto-advance: each banner shows once, then the video takes over.
  useEffect(() => {
    if (phase !== 'banners' || !ready || banners.length === 0) return;
    const timer = setTimeout(next, SLIDE_DURATION);
    return () => clearTimeout(timer);
  }, [phase, ready, banners.length, bannerIndex, next]);

  // Force strict muted/autoplay state to bypass iOS Safari restrictive policies
  // that sometimes cause a giant play button to appear on top of background videos.
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    video.defaultMuted = true;
    video.muted = true;
  }, []);

  // Play the video only while it's the visible layer, the hero is on-screen
  // and the tab is active — avoids paying to keep a looping video
  // decoding/streaming behind banners or while the visitor is elsewhere.
  useEffect(() => {
    const section = sectionRef.current;
    const video = videoRef.current;
    if (!section || !video) return;

    let isIntersecting = false;
    const sync = () => {
      if (showVideo && isIntersecting && document.visibilityState === 'visible') {
        video.play().catch(() => {
          // Autoplay prevented; the poster keeps showing silently
        });
      } else {
        video.pause();
      }
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        isIntersecting = entry.isIntersecting;
        sync();
      },
      { threshold: 0.1 },
    );
    observer.observe(section);
    document.addEventListener('visibilitychange', sync);
    sync();
    return () => {
      observer.disconnect();
      document.removeEventListener('visibilitychange', sync);
    };
  }, [showVideo]);

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted((m) => !m);
    }
  };

  const inBanners = ready && phase === 'banners' && banners.length > 0;

  return (
    <section className="hero-slider" ref={sectionRef} aria-label="Featured content">
      <h1 className="sr-only">Vishnu Women&apos;s University — Leading by Design</h1>

      {/* Hero video — the final, permanent layer once the banners (if any) have played */}
      <video
        ref={videoRef}
        className="hero-video hero-video--visible"
        src={HOME_HERO_VIDEO_SRC}
        poster={HOME_HERO_POSTER_SRC}
        preload={showVideo ? 'auto' : 'metadata'}
        muted
        loop
        playsInline
        aria-hidden="true"
      />

      {/* Full-screen banner carousel with corner-positioned text overlay */}
      {inBanners && banners.map((b, i) => (
        <div
          key={b.id}
          className={`hero-banner${i === bannerIndex ? ' hero-banner--active' : ''}`}
          aria-hidden={i !== bannerIndex}
        >
          <img
            className="hero-banner__img"
            src={optimizeBannerUrl(b.imageUrl)}
            alt={b.text || 'VWU banner'}
            loading="eager"
            decoding="async"
            {...(i === 0 ? { fetchPriority: 'high' as const } : {})}
          />
          <div className={`hero-banner__scrim hero-banner__scrim--${b.position || 'bottom-left'}`} />
          {(b.text || b.subtext) && (
            <div className={`hero-banner__text hero-banner__text--${b.position || 'bottom-left'}`}>
              {b.text && <h2 className="hero-banner__title">{b.text}</h2>}
              {b.subtext && <p className="hero-banner__subtext">{b.subtext}</p>}
              {b.ctaLabel && b.ctaLink && (
                /^https?:/.test(b.ctaLink)
                  ? <a className="hero-banner__cta" href={b.ctaLink} target="_blank" rel="noreferrer" tabIndex={i === bannerIndex ? 0 : -1}>{b.ctaLabel}</a>
                  : <Link className="hero-banner__cta" to={b.ctaLink} tabIndex={i === bannerIndex ? 0 : -1}>{b.ctaLabel}</Link>
              )}
            </div>
          )}
        </div>
      ))}

      {/* Mute / Unmute — only meaningful once the video is showing */}
      {showVideo && (
        <button
          className="hero-mute-btn"
          onClick={toggleMute}
          aria-label={isMuted ? 'Unmute video' : 'Mute video'}
          title={isMuted ? 'Unmute' : 'Mute'}
        >
          {isMuted ? (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M11 5L6 9H2v6h4l5 4V5z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <line x1="23" y1="9" x2="17" y2="15" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              <line x1="17" y1="9" x2="23" y2="15" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          ) : (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M11 5L6 9H2v6h4l5 4V5z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          )}
        </button>
      )}

      {/* Prev / next + dots — banner carousel only; gone once the video takes over */}
      {inBanners && (
        <div className="hero-controls">
          <button className="hero-nav-btn" onClick={prev} disabled={bannerIndex === 0} aria-label="Previous banner">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          <div className="hero-dots" role="tablist" aria-label="Banner navigation">
            {banners.map((b, i) => (
              <button
                key={b.id}
                className={`hero-dot${i === bannerIndex ? ' active' : ''}`}
                onClick={() => setCurrent(i)}
                role="tab"
                aria-selected={i === bannerIndex}
                aria-label={`Go to banner ${i + 1}`}
              />
            ))}
          </div>
          <button className="hero-nav-btn" onClick={next} aria-label={bannerIndex >= banners.length - 1 ? 'Continue to video' : 'Next banner'}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M9 18l6-6-6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
      )}
    </section>
  );
}
