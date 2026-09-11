import { useState, useEffect, useRef, useCallback } from 'react';
import { Play, X } from 'lucide-react';
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

const VIDEOS: VideoItem[] = [
  { id: '1', title: 'Likitha Naidu', youtubeUrl: 'https://youtu.be/P9TPB69kmWQ' },
  { id: '2', title: 'Rukmini V', youtubeUrl: 'https://youtu.be/1pD8nzSgoFk' },
  { id: '3', title: 'Sreekari Tathvathi', youtubeUrl: 'https://www.youtube.com/watch?v=ORJgaunrM5k' },
];

export default function YouTubeShowcase() {
  const [activeVideo, setActiveVideo] = useState<string | null>(null);
  const trackRef = useRef<HTMLDivElement>(null);

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
