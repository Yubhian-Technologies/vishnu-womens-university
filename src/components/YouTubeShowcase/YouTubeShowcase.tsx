import { useState, useEffect, useRef, useCallback } from 'react';
import { Play, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { useContentBlocks } from '../../hooks/useContentBlocks';
import './YouTubeShowcase.css';

interface VideoItem {
  id: string;
  title: string;
  youtubeUrl: string;
}

function extractVideoId(url: string): string {
  if (!url) return '';
  const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/|v\/))([^&?#/]+)/);
  if (match) return match[1];
  if (/^[a-zA-Z0-9_-]{11}$/.test(url.trim())) return url.trim();
  return '';
}

function getThumbnail(url: string): string {
  const id = extractVideoId(url);
  return id ? `https://img.youtube.com/vi/${id}/hqdefault.jpg` : '';
}

const DEFAULT_VIDEOS: VideoItem[] = [
  { id: '1', title: 'Likitha Naidu', youtubeUrl: 'https://youtu.be/P9TPB69kmWQ' },
  { id: '2', title: 'Rukmini V', youtubeUrl: 'https://youtu.be/1pD8nzSgoFk' },
  { id: '3', title: 'Sreekari Tathvathi', youtubeUrl: 'https://www.youtube.com/watch?v=ORJgaunrM5k' },
];

export default function YouTubeShowcase() {
  const liveBlocks = useContentBlocks('home', 'vwuInAction');
  const [activeVideo, setActiveVideo] = useState<string | null>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const videos: VideoItem[] = liveBlocks.length > 0
    ? liveBlocks
        .map((b) => ({
          id: b.id,
          title: b.title || 'VWU in Action',
          youtubeUrl: b.value || b.slug || b.desc || '',
        }))
        .filter((v) => !!v.youtubeUrl)
    : DEFAULT_VIDEOS;

  const checkScroll = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    const { scrollLeft, scrollWidth, clientWidth } = el;
    setCanScrollLeft(scrollLeft > 10);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
  }, []);

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    checkScroll();
    el.addEventListener('scroll', checkScroll, { passive: true });
    window.addEventListener('resize', checkScroll);
    return () => {
      el.removeEventListener('scroll', checkScroll);
      window.removeEventListener('resize', checkScroll);
    };
  }, [checkScroll, videos]);

  const handleScroll = (direction: 'left' | 'right') => {
    const el = trackRef.current;
    if (!el) return;
    const cardWidth = el.querySelector('.yt-card')?.clientWidth || 360;
    const scrollAmount = (cardWidth + 20) * 2;
    el.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth',
    });
  };

  const closeModal = useCallback(() => {
    setActiveVideo(null);
  }, []);

  useEffect(() => {
    if (!activeVideo) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeModal();
    };
    document.addEventListener('keydown', handleKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleKey);
      document.body.style.overflow = '';
    };
  }, [activeVideo, closeModal]);

  if (videos.length === 0) return null;

  return (
    <section className="yt-showcase" aria-label="VWU Videos">
      <div className="yt-showcase-header">
        <h2 className="yt-showcase-title">VWU in Action</h2>
        {(canScrollLeft || canScrollRight) && (
          <div className="yt-showcase-nav-btns" aria-label="Carousel navigation">
            <button
              type="button"
              className="yt-nav-btn"
              onClick={() => handleScroll('left')}
              disabled={!canScrollLeft}
              aria-label="Previous videos"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              type="button"
              className="yt-nav-btn"
              onClick={() => handleScroll('right')}
              disabled={!canScrollRight}
              aria-label="Next videos"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        )}
      </div>

      <div className="yt-showcase-track-wrap">
        <button
          type="button"
          className={`yt-edge-btn yt-edge-prev ${canScrollLeft ? 'is-visible' : ''}`}
          onClick={() => handleScroll('left')}
          aria-label="Scroll left"
          tabIndex={canScrollLeft ? 0 : -1}
        >
          <ChevronLeft size={24} />
        </button>

        <div className="yt-showcase-track" ref={trackRef}>
          {videos.map((video) => (
            <button
              key={video.id}
              type="button"
              className="yt-card"
              onClick={() => setActiveVideo(extractVideoId(video.youtubeUrl))}
              aria-label={`Play ${video.title}`}
            >
              <div className="yt-card-thumb">
                <img
                  src={getThumbnail(video.youtubeUrl)}
                  alt={video.title}
                  loading="lazy"
                  decoding="async"
                />
                <div className="yt-card-play">
                  <Play size={28} fill="currentColor" strokeWidth={0} />
                </div>
              </div>
              <p className="yt-card-title">{video.title}</p>
            </button>
          ))}
        </div>

        <button
          type="button"
          className={`yt-edge-btn yt-edge-next ${canScrollRight ? 'is-visible' : ''}`}
          onClick={() => handleScroll('right')}
          aria-label="Scroll right"
          tabIndex={canScrollRight ? 0 : -1}
        >
          <ChevronRight size={24} />
        </button>
      </div>

      {activeVideo && (
        <div className="yt-modal-overlay" onClick={closeModal} role="dialog" aria-modal="true">
          <div className="yt-modal" onClick={(e) => e.stopPropagation()}>
            <button type="button" className="yt-modal-close" onClick={closeModal} aria-label="Close video">
              <X size={20} />
            </button>
            <div className="yt-modal-inner">
              <iframe
                src={`https://www.youtube.com/embed/${activeVideo}?autoplay=1&rel=0`}
                title="YouTube video player"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
