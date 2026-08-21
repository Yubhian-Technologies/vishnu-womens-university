import { useState, useEffect, useCallback, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Trophy, Star, ClipboardList, Briefcase, TrendingUp } from 'lucide-react';
import { usePageBanners } from '../../hooks/usePageBanners';
import './HeroSlider.css';

// Served from public/ (not imported as a JS module) so this ~27MB file never
// enters Vite's module graph or gets processed/hashed on every build. It's
// still a genuinely large download — re-encoding it to a smaller bitrate
// with an external tool (ffmpeg/HandBrake) would help more than anything
// done here — but deferring the fetch (below) at least keeps it from
// competing with the JS bundle for bandwidth during initial page load.
const HERO_VIDEO_SRC = '/hero-video.mp4';


interface Slide {
  id: number | string;
  tag: string;
  heading: string;
  description: string;
  primaryCta: { label: string; path: string };
  secondaryCta?: { label: string; path: string };
  image?: string;
}

const staticSlides: Slide[] = [
  {
    id: 1,
    tag: 'Welcome to VWU',
    heading: 'Empowering.\nWomen.\nThrough Tech.',
    description: 'VWU equips women with rigorous engineering education, research opportunities, and the practical skills that top employers demand.',
    primaryCta: { label: 'Schedule a Visit', path: '/admissions' },
    secondaryCta: { label: 'Apply Now', path: '/admissions' },
  },
  {
    id: 2,
    tag: 'Academics',
    heading: '10 B.Tech Programs\nBuilt for Your\nSuccess',
    description: 'From Computer Science to Civil Engineering — VWU offers undergraduate, postgraduate, and doctoral programs rooted in applied, industry-aligned learning.',
    primaryCta: { label: 'Explore Programs', path: '/academics' },
    secondaryCta: { label: 'Request Info', path: '/admissions' },
  },
  {
    id: 3,
    tag: 'Campus Life',
    heading: 'Learn, Grow\nand Excel',
    description: "VWU is more than a degree — it is a community where you build real skills, lasting connections, and the confidence to lead in your chosen field.",
    primaryCta: { label: 'Campus Life', path: '/student-life' },
    secondaryCta: { label: 'Apply Now', path: '/admissions' },
  },
  {
    id: 4,
    tag: 'Outstanding Placements',
    heading: '59.28 LPA\nHighest\nPlacement Package',
    description: 'VWU recorded 1,400+ placements in 2024–25, with a highest offer of 59.28 LPA — graduates are now driving impact at companies across India and beyond.',
    primaryCta: { label: 'Placement Records', path: '/about' },
    secondaryCta: { label: 'Our Story', path: '/about' },
  },
];

const recognitions = [
  { icon: Trophy, title: 'Top Engineering College', source: 'India Today Rankings' },
  { icon: Star, title: 'Best Engineering College', source: 'The Week Rankings' },
  { icon: ClipboardList, title: 'NBA Accredited', source: 'National Board of Accreditation' },
  { icon: Briefcase, title: 'NIRF Ranked Institution', source: 'Ministry of Education' },
  { icon: TrendingUp, title: 'IEI Award for Excellence', source: 'Institution of Engineers India' },
];

const SLIDE_DURATION = 6000;

export default function HeroSlider() {
  const [current, setCurrent] = useState(0);
  const [progressWidth, setProgressWidth] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [videoReady, setVideoReady] = useState(false);
  // Only slides a visitor has actually reached get their photo downloaded —
  // admin-uploaded banner slides append photos after the 4 static marketing
  // slides, so without this every one of them would load on first paint
  // even though the carousel only shows one at a time.
  const [visited, setVisited] = useState<Set<number>>(new Set([0]));
  const videoRef = useRef<HTMLVideoElement>(null);

  // Defer the video fetch until the browser is idle (or a short timeout, on
  // browsers without requestIdleCallback) so it doesn't compete with the JS
  // bundle for bandwidth while the page is still becoming interactive. The
  // hero has a solid brand-colour background (.hero-slider) as a fallback
  // in the meantime, so there's no blank flash.
  useEffect(() => {
    const ric = (window as unknown as { requestIdleCallback?: (cb: () => void) => number }).requestIdleCallback;
    const handle = ric ? ric(() => setVideoReady(true)) : window.setTimeout(() => setVideoReady(true), 1200);
    return () => {
      const cic = (window as unknown as { cancelIdleCallback?: (h: number) => void }).cancelIdleCallback;
      if (ric && cic) cic(handle as number);
      else window.clearTimeout(handle as number);
    };
  }, []);

  // Admin-uploaded Hero Banners (page="home") are appended after the fixed
  // marketing slides — the video keeps playing behind all of them, these
  // just add their photo alongside the slide's own text/CTA.
  const { slides: bannerSlides } = usePageBanners('home');
  const slides: Slide[] = [
    ...staticSlides,
    ...bannerSlides.map((b) => ({
      id: b.id,
      tag: 'Announcement',
      heading: b.title,
      description: b.subtitle,
      primaryCta: { label: b.ctaLabel || 'Learn More', path: b.ctaLink || '/admissions' },
      image: b.imageUrl,
    })),
  ];

  const goTo = useCallback((index: number) => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrent(index);
    setProgressWidth(0);
    setTimeout(() => setIsAnimating(false), 1000);
  }, [isAnimating]);

  const next = useCallback(() => {
    goTo((current + 1) % slides.length);
  }, [current, goTo, slides.length]);

  const prev = useCallback(() => {
    goTo((current - 1 + slides.length) % slides.length);
  }, [current, goTo, slides.length]);

  useEffect(() => {
    setProgressWidth(0);
    const timer = setTimeout(() => setProgressWidth(100), 50);
    return () => clearTimeout(timer);
  }, [current]);

  useEffect(() => {
    setVisited((prev) => (prev.has(current) ? prev : new Set(prev).add(current)));
  }, [current]);

  useEffect(() => {
    const interval = setInterval(next, SLIDE_DURATION);
    return () => clearInterval(interval);
  }, [next]);

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(m => !m);
    }
  };

  return (
    <section className="hero-slider" aria-label="Featured content">

      {/* Background video — src only set once idle (see effect above), so the
          browser doesn't fetch it until the rest of the page is usable */}
      {videoReady && (
        <video
          ref={videoRef}
          className="hero-video"
          src={HERO_VIDEO_SRC}
          preload="metadata"
          autoPlay
          muted
          loop
          playsInline
          aria-hidden="true"
        />
      )}
      <div className="hero-video-overlay" />

      {/* Slide content layers */}
      {slides.map((slide, i) => (
        <div
          key={slide.id}
          className={`slide${i === current ? ' active' : ''}`}
          aria-hidden={i !== current}
        >
          <div className="slide-content">
            <div className={`slide-inner${slide.image ? ' slide-inner--with-image' : ''}`}>
              <div className="slide-text">
                <span className="slide-tag">{slide.tag}</span>
                <h1 className="slide-heading">
                  {slide.heading.split('\n').map((line, j) => (
                    <span key={j}>{line}<br /></span>
                  ))}
                </h1>
                <p className="slide-desc">{slide.description}</p>
                <div className="slide-actions">
                  <Link to={slide.primaryCta.path} className="btn btn-accent btn-lg">
                    {slide.primaryCta.label}
                  </Link>
                  {slide.secondaryCta && (
                    <Link to={slide.secondaryCta.path} className="btn btn-secondary btn-lg">
                      {slide.secondaryCta.label}
                    </Link>
                  )}
                </div>
              </div>
              {slide.image && (
                <div className="slide-photo-wrap">
                  {visited.has(i) && <img src={slide.image} alt={slide.heading} className="slide-photo" />}
                </div>
              )}
            </div>
          </div>
        </div>
      ))}

      {/* Mute / Unmute */}
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

      {/* Controls */}
      <div className="hero-controls">
        <button className="hero-nav-btn" onClick={prev} aria-label="Previous slide">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        <div className="hero-dots" role="tablist" aria-label="Slide navigation">
          {slides.map((_, i) => (
            <button
              key={i}
              className={`hero-dot${i === current ? ' active' : ''}`}
              onClick={() => goTo(i)}
              role="tab"
              aria-selected={i === current}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
        <button className="hero-nav-btn" onClick={next} aria-label="Next slide">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path d="M9 18l6-6-6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>

      {/* Progress Bar */}
      <div className="hero-progress" aria-hidden="true">
        <div
          className="hero-progress-fill"
          style={{ width: `${progressWidth}%` }}
        />
      </div>

      {/* Scroll Indicator */}
      <div className="scroll-indicator" aria-hidden="true">
        <div className="scroll-indicator-line" />
        <span>Scroll</span>
      </div>



      {/* Recognition Bar */}
      <div className="hero-recognition" aria-label="Awards and recognitions">
        <div className="hero-recognition-inner">
          {recognitions.map((r, i) => (
            <div key={r.title} style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
              <div className="recognition-item">
                <div className="recognition-icon"><r.icon size={16} strokeWidth={2} color="var(--color-primary-dark)" /></div>
                <div className="recognition-text">
                  <strong>{r.title}</strong>
                  <span>{r.source}</span>
                </div>
              </div>
              {i < recognitions.length - 1 && <div className="recognition-divider" />}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
