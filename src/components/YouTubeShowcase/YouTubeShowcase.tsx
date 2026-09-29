import { useState, useEffect, useRef, useCallback } from 'react';
import { Play, X } from 'lucide-react';
import { useContentBlocks } from '../../hooks/useContentBlocks';
import './YouTubeShowcase.css';

interface VideoItem {
  id: string;
  title: string;
  youtubeUrl: string;
}

function extractVideoId(url: string): string {
  const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/))([^&?#/]+)/);
  return match ? match[1] : '';
}

function getThumbnail(url: string): string {
  const id = extractVideoId(url);
  return id ? `https://img.youtube.com/vi/${id}/hqdefault.jpg` : '';
}

// Shown until an admin adds any items under Admin → Page Content Blocks →
// "Home — VWU in Action Videos" (same "hardcoded default first, swap in
// Firestore once there's anything to swap to" convention used site-wide —
// see e.g. DEFAULT_CAMPUS_LIFE_QUICK_LINKS), so this section never goes
// blank and nothing changes here until an admin actually edits it.
const DEFAULT_VIDEOS: VideoItem[] = [
  { id: '1', title: 'Likitha Naidu', youtubeUrl: 'https://youtu.be/P9TPB69kmWQ' },
  { id: '2', title: 'Rukmini V', youtubeUrl: 'https://youtu.be/1pD8nzSgoFk' },
  { id: '3', title: 'Sreekari Tathvathi', youtubeUrl: 'https://www.youtube.com/watch?v=ORJgaunrM5k' },
];

export default function YouTubeShowcase() {
  const [activeVideo, setActiveVideo] = useState<string | null>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const blocks = useContentBlocks('home', 'vwuInAction');
  const VIDEOS: VideoItem[] = blocks.length > 0
    ? blocks.map((b) => ({ id: b.id, title: b.title, youtubeUrl: b.value }))
    : DEFAULT_VIDEOS;

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

  return (
    <section className="yt-showcase" aria-label="VWU Videos">
      <div className="yt-showcase-header">
        <h2 className="yt-showcase-title">VWU in Action</h2>
      </div>

      <div className="yt-showcase-track-wrap">
        <div className="yt-showcase-track" ref={trackRef}>
          {VIDEOS.map((video) => (
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
