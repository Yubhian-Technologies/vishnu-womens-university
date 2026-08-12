import { useRef } from 'react';
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';

interface Props {
  imageUrl: string;
  imageAlt: string;
  videoUrl?: string;
}

/**
 * Full-viewport, text-free cinematic moment — a single immersive campus
 * shot (video if the admin has uploaded one, else the poster photo) that
 * scales down from a slight zoom to rest as it scrolls into view, then
 * holds. Mirrors the "just let the campus speak" full-bleed video beat
 * university sites like Stanford's use between editorial sections.
 */
export default function CampusCinematic({ imageUrl, imageAlt, videoUrl }: Props) {
  const ref = useRef<HTMLElement>(null);
  const prefersReducedMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'start start'] });
  const scale = useTransform(scrollYProgress, [0, 1], [1.18, 1]);
  const brightness = useTransform(scrollYProgress, [0, 1], [0.75, 1]);
  const filter = useTransform(brightness, (b) => `brightness(${b})`);

  return (
    <section className="lpe-cinema" ref={ref} aria-label="Vishnu Women's University campus">
      <motion.div
        className="lpe-cinema__media"
        style={prefersReducedMotion ? undefined : { scale, filter }}
      >
        {videoUrl ? (
          <video src={videoUrl} poster={imageUrl} autoPlay={!prefersReducedMotion} muted loop playsInline aria-label={imageAlt} />
        ) : (
          <img src={imageUrl} alt={imageAlt} loading="lazy" />
        )}
      </motion.div>
      <span className="lpe-cinema__caption">Vishnu Women&rsquo;s University — Bhimavaram Campus</span>
    </section>
  );
}
