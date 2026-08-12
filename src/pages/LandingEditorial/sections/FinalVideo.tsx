import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { Play, Pause, Volume2, VolumeX, Maximize2 } from 'lucide-react';
import Reveal from '../Reveal';

interface Props {
  videoUrl?: string;
  posterUrl: string;
  posterAlt: string;
}

/**
 * Large, edge-to-edge cinematic closing moment — the last thing a visitor
 * sees before the footer. Video (if the admin has uploaded one) or the
 * poster photo fills the frame; a continuous scroll-linked scale/brightness
 * settle doubles as the entrance animation, matching the same technique
 * already used by CampusCinematic. Minimal chrome (play/pause, mute,
 * fullscreen) replaces native browser video controls.
 */
export default function FinalVideo({ videoUrl, posterUrl, posterAlt }: Props) {
  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const prefersReducedMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start end', 'start start'] });
  const scale = useTransform(scrollYProgress, [0, 1], [1.12, 1]);
  const brightness = useTransform(scrollYProgress, [0, 1], [0.8, 1]);
  const filter = useTransform(brightness, (b) => `brightness(${b})`);

  const [playing, setPlaying] = useState(!prefersReducedMotion);
  const [muted, setMuted] = useState(true);

  const togglePlay = () => {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) { v.play(); setPlaying(true); } else { v.pause(); setPlaying(false); }
  };

  const toggleMute = () => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = !v.muted;
    setMuted(v.muted);
  };

  const goFullscreen = () => {
    videoRef.current?.requestFullscreen?.();
  };

  return (
    <section className="lpe-final-video" ref={sectionRef} aria-label="Vishnu Women's University">
      <motion.div className="lpe-final-video__media" style={prefersReducedMotion ? undefined : { scale, filter }}>
        {videoUrl ? (
          <video
            ref={videoRef}
            src={videoUrl}
            poster={posterUrl}
            autoPlay={!prefersReducedMotion}
            muted
            loop
            playsInline
            aria-label={posterAlt}
          />
        ) : (
          <img src={posterUrl} alt={posterAlt} loading="lazy" />
        )}
      </motion.div>
      <div className="lpe-final-video__overlay" />

      <div className="lpe-final-video__content lpe-container">
        <Reveal index={0}>
          <span className="lpe-eyebrow lpe-eyebrow--on-dark">Vishnu Women&rsquo;s University</span>
        </Reveal>
        <Reveal index={1}>
          <h2 className="lpe-final-video__headline">Where learning meets<br /><span className="lpe-italic">possibility.</span></h2>
        </Reveal>
        <Reveal index={2}>
          <p className="lpe-final-video__sub lpe-placeholder">[Content to be provided by Admin.]</p>
        </Reveal>
        <Reveal index={3}>
          <Link to="/about" className="lpe-btn lpe-btn--outline-light">Explore VWU</Link>
        </Reveal>
      </div>

      {videoUrl && (
        <div className="lpe-final-video__controls">
          <button type="button" onClick={togglePlay} aria-label={playing ? 'Pause video' : 'Play video'} className="lpe-final-video__btn">
            {playing ? <Pause size={15} /> : <Play size={15} fill="currentColor" />}
          </button>
          <button type="button" onClick={toggleMute} aria-label={muted ? 'Unmute video' : 'Mute video'} className="lpe-final-video__btn">
            {muted ? <VolumeX size={15} /> : <Volume2 size={15} />}
          </button>
          <button type="button" onClick={goFullscreen} aria-label="Full screen" className="lpe-final-video__btn lpe-final-video__btn--ghost">
            <Maximize2 size={13} />
          </button>
        </div>
      )}
    </section>
  );
}
