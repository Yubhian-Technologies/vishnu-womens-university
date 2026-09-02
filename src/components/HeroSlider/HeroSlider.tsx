import { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search } from 'lucide-react';
import { usePageBanners } from '../../hooks/usePageBanners';
import { useContentBlocks } from '../../hooks/useContentBlocks';
import './HeroSlider.css';

// Background is a YouTube-hosted video (replaces the old self-hosted
// hero-video.mp4) — id from https://youtu.be/xv3BlJJ0MYw. playerVars below
// strip every native YouTube control (play/pause, next-video, captions,
// fullscreen, title/share overlay) so the only interactive element is our
// own .hero-mute-btn; loop:1 + playlist:<same id> is the documented way to
// make the IFrame API loop a single video indefinitely.
const HERO_YOUTUBE_VIDEO_ID = 'xv3BlJJ0MYw';
const HERO_YOUTUBE_CONTAINER_ID = 'hero-youtube-player';

interface YTPlayerInstance {
  mute: () => void;
  unMute: () => void;
}

// Minimal ad-hoc shape for the bits of the YouTube IFrame API this component
// actually touches — same "cast window, don't augment the global type"
// approach already used for requestIdleCallback below.
type YTWindow = Window & {
  YT?: {
    Player: new (
      elementId: string,
      options: {
        videoId: string;
        playerVars?: Record<string, number | string>;
        events?: { onReady?: (event: { target: YTPlayerInstance }) => void };
      }
    ) => YTPlayerInstance;
  };
  onYouTubeIframeAPIReady?: () => void;
};


interface Slide {
  id: number | string;
  tag: string;
  heading: string;
  description: string;
  primaryCta: { label: string; path: string };
  secondaryCta?: { label: string; path: string };
  image?: string;
}

// The B.Tech program count in this heading is admin-editable, but not as
// its own field — it reuses the "Departments" stat from About → Quick Stats
// (page="about", section="quickStats"), since that's the number the admin
// already maintains by hand for exactly this purpose. Falls back to the
// last-known steady-state number if that stat is ever missing/renamed.
const FALLBACK_BTECH_COUNT = '10';

function buildStaticSlides(btechCount: string): Slide[] {
  return [
    {
      id: 1,
      tag: 'Welcome to VWU',
      heading: 'Empowering.\nWomen.\nThrough Tech.',
      description: 'VWU equips women with rigorous engineering education, research opportunities, and the practical skills that top employers demand.',
      primaryCta: { label: 'Schedule a Visit', path: '/contact' },
      secondaryCta: { label: 'Apply Now', path: '/admissions' },
    },
    {
      id: 2,
      tag: 'Academics',
      heading: `${btechCount} B.Tech Programs\nBuilt for Your\nSuccess`,
      description: 'From Computer Science to Civil Engineering — VWU offers undergraduate, postgraduate, and doctoral programs rooted in applied, industry-aligned learning.',
      primaryCta: { label: 'Explore Programs', path: '/academics' },
      secondaryCta: { label: 'Request Info', path: '/contact' },
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
      description: 'VWU recorded 1,100+ placements in 2025–26, with a highest offer of 59.28 LPA — graduates are now driving impact at companies across India and beyond.',
      primaryCta: { label: 'Placement Records', path: '/placements' },
      secondaryCta: { label: 'Our Story', path: '/about' },
    },
    {
      id: 5,
      tag: 'A Historic First',
      heading: "The First Private\nWomen's University\nin the Telugu States",
      description: 'Vishnu Women\'s University is the first private university exclusively for women across the Telugu states — built to give women a dedicated space to lead in engineering, technology, and research.',
      primaryCta: { label: 'Explore VWU', path: '/about' },
      secondaryCta: { label: 'Apply Now', path: '/admissions' },
    },
  ];
}

interface HeroTitle {
  lead: string;
  italic: string;
}

const HERO_TITLES: HeroTitle[] = [
  { lead: 'Pioneering', italic: 'Women in Engineering.' },
  { lead: 'Where Ambition Meets', italic: 'Excellence.' },
  { lead: 'Engineering the', italic: 'Future of Tech.' },
  { lead: 'Inspiring Brilliance,', italic: 'Leading Change.' },
];

const SLIDE_DURATION = 6000;

export default function HeroSlider() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [titleIndex, setTitleIndex] = useState(0);
  const [isFadingTitle, setIsFadingTitle] = useState(false);
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
  const ytPlayerRef = useRef<YTPlayerInstance | null>(null);

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

  // Loads the YouTube IFrame API (once, shared across mounts via the
  // youtube-iframe-api script id) and builds the background player once the
  // idle-deferred videoReady flag flips. controls:0 + disablekb:1 + fs:0
  // remove every native YouTube control; loop:1 + playlist:<id> loops the
  // single video indefinitely; the iframe itself gets pointer-events:none
  // in CSS so nothing (not even a click-to-pause) can reach it — the only
  // way to affect playback is the custom .hero-mute-btn below.
  useEffect(() => {
    if (!videoReady) return;

    const win = window as YTWindow;

    const createPlayer = () => {
      if (!win.YT) return;
      ytPlayerRef.current = new win.YT.Player(HERO_YOUTUBE_CONTAINER_ID, {
        videoId: HERO_YOUTUBE_VIDEO_ID,
        playerVars: {
          autoplay: 1,
          mute: 1,
          controls: 0,
          disablekb: 1,
          fs: 0,
          iv_load_policy: 3,
          loop: 1,
          modestbranding: 1,
          playlist: HERO_YOUTUBE_VIDEO_ID,
          playsinline: 1,
          rel: 0,
          showinfo: 0,
        },
        events: {
          onReady: (e) => e.target.mute(),
        },
      });
    };

    if (win.YT) {
      createPlayer();
    } else {
      const previousCallback = win.onYouTubeIframeAPIReady;
      win.onYouTubeIframeAPIReady = () => {
        previousCallback?.();
        createPlayer();
      };
      if (!document.getElementById('youtube-iframe-api')) {
        const script = document.createElement('script');
        script.id = 'youtube-iframe-api';
        script.src = 'https://www.youtube.com/iframe_api';
        document.body.appendChild(script);
      }
    }
  }, [videoReady]);

  // Admin-uploaded Hero Banners (page="home") are appended after the fixed
  // marketing slides — the video keeps playing behind all of them, these
  // just add their photo alongside the slide's own text/CTA.
  const { slides: bannerSlides } = usePageBanners('home');
  const aboutQuickStats = useContentBlocks('about', 'quickStats');
  const departmentsStat = aboutQuickStats.find((s) => s.title === 'Departments');
  const btechCount = departmentsStat?.value || FALLBACK_BTECH_COUNT;
  const slides: Slide[] = [
    ...buildStaticSlides(btechCount),
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

  useEffect(() => {
    const timer = setInterval(() => {
      setIsFadingTitle(true);
      setTimeout(() => {
        setTitleIndex((prev) => (prev + 1) % HERO_TITLES.length);
        setIsFadingTitle(false);
      }, 450);
    }, 4200);
    return () => clearInterval(timer);
  }, []);

  const toggleMute = () => {
    const player = ytPlayerRef.current;
    if (!player) return;
    if (isMuted) player.unMute();
    else player.mute();
    setIsMuted(m => !m);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/academics/programs?search=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      navigate('/academics/programs');
    }
  };

  return (
    <section className="hero-slider" aria-label="Featured content">

      {/* Background video — YouTube player only created once idle (see effect
          above), so the browser doesn't fetch the IFrame API/video until the
          rest of the page is usable. Wrapper has pointer-events:none (CSS) so
          the video itself can't be clicked/paused — the mute button below is
          the only control. */}
      {videoReady && (
        <div className="hero-youtube-bg" aria-hidden="true">
          <div id={HERO_YOUTUBE_CONTAINER_ID} />
        </div>
      )}
      <div className="hero-video-overlay" />

      {/* Center Tagline & Clean Sleek Search */}
      <div className="hero-center-panel">
        <h1 className={`hero-center-tagline ${isFadingTitle ? 'title-exit' : 'title-enter'}`}>
          <span className="hero-title-lead">{HERO_TITLES[titleIndex].lead}</span>
          {' '}
          <span className="hero-title-italic">{HERO_TITLES[titleIndex].italic}</span>
        </h1>
        <form className="hero-center-search" onSubmit={handleSearch} role="search">
          <div className="hero-search-box">
            <Search className="hero-search-icon" size={19} strokeWidth={2} />
            <input
              type="text"
              className="hero-search-input"
              placeholder="Explore courses"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              aria-label="Explore courses"
            />
            <button type="submit" className="hero-search-submit">
              Search
            </button>
          </div>
        </form>
        <div className="hero-tag-words" aria-label="Values">
          <span>Empower</span>
          <span className="hero-tag-dot">•</span>
          <span>Innovate</span>
          <span className="hero-tag-dot">•</span>
          <span>Lead</span>
        </div>
      </div>

      {/* Slide layer — carries only the optional admin-uploaded Hero Banner
          photo now; the title/description card has been removed. */}
      {slides.some(s => s.image) && slides.map((slide, i) => (
        <div
          key={slide.id}
          className={`slide${i === current ? ' active' : ''}`}
          aria-hidden={i !== current}
        >
          <div className="slide-content">
            <div className={`slide-inner${slide.image ? ' slide-inner--with-image' : ''}`}>
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
      {slides.some(s => s.image) && slides.length > 1 && (
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
      )}

      {/* Progress Bar */}
      {slides.some(s => s.image) && slides.length > 1 && (
        <div className="hero-progress" aria-hidden="true">
          <div
            className="hero-progress-fill"
            style={{ width: `${progressWidth}%` }}
          />
        </div>
      )}



    </section>
  );
}
