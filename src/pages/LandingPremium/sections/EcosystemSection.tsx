import { useEffect, useRef, useState } from 'react';
import { motion, useMotionValueEvent, useScroll, useTransform, type MotionValue } from 'framer-motion';
import { smoothScrollTo } from '../../../lib/smoothScroll';
import { ECOSYSTEM_STORIES } from '../landingPremium.data';

interface Props {
  images: Record<string, string>;
}

const TOTAL = ECOSYSTEM_STORIES.length;
// Must be referentially stable across renders — `useScroll` re-runs its
// scroll-tracking setup effect whenever this array's reference changes, and
// this component re-renders on every scroll step (the active-item state
// update below), so a fresh literal here on every render was tearing down
// and rebuilding the scroll listener continuously, resetting its tracked
// progress in the process.
const SCROLL_OFFSET: ['start start', 'end end'] = ['start start', 'end end'];

/**
 * Enter/hold/exit keyframes for item `index` of `total`, as fractions of
 * the whole section's scroll progress (0–1). Every item — including the
 * first and last — uses the same 4-point fade-in/hold/fade-out shape; the
 * first item's brief fade-in from progress 0 and the last item's fade-out
 * at progress 1 are both effectively instantaneous (each is ~7% of that
 * item's own 1/total-sized segment) and imperceptible in practice.
 */
function segmentKeyframes(index: number, total: number, enterVals: [number, number], holdExitVals: [number, number]) {
  const start = index / total;
  const end = (index + 1) / total;
  const len = end - start;
  const ease = len * 0.28;
  const fadeInEnd = start + ease;
  const fadeOutStart = end - ease;
  return {
    input: [start, fadeInEnd, fadeOutStart, end],
    output: [enterVals[0], enterVals[1], holdExitVals[0], holdExitVals[1]],
  };
}

function EcosystemTextItem({ scrollYProgress, index, story }: {
  scrollYProgress: MotionValue<number>;
  index: number;
  story: (typeof ECOSYSTEM_STORIES)[number];
}) {
  const opacityKf = segmentKeyframes(index, TOTAL, [0, 1], [1, 0]);
  const yKf = segmentKeyframes(index, TOTAL, [28, 0], [0, -28]);
  const opacity = useTransform(scrollYProgress, opacityKf.input, opacityKf.output);
  const y = useTransform(scrollYProgress, yKf.input, yKf.output);

  return (
    <motion.div className="eco3-text__item" style={{ opacity, y }}>
      <h3>{story.title}</h3>
      <p>{story.desc}</p>
    </motion.div>
  );
}

function EcosystemImageLayer({ scrollYProgress, index, src, alt }: {
  scrollYProgress: MotionValue<number>;
  index: number;
  src: string;
  alt: string;
}) {
  const start = index / TOTAL;
  const end = (index + 1) / TOTAL;
  const opacityKf = segmentKeyframes(index, TOTAL, [0, 1], [1, 0]);
  const scaleKf = segmentKeyframes(index, TOTAL, [1.08, 1], [1, 1.06]);
  const opacity = useTransform(scrollYProgress, opacityKf.input, opacityKf.output);
  const scale = useTransform(scrollYProgress, scaleKf.input, scaleKf.output);
  // Subtle continuous parallax drift across the item's own segment, purely
  // transform-based (GPU-accelerated, no layout impact).
  const parallaxY = useTransform(scrollYProgress, [start, end], [18, -18]);

  return (
    <motion.div className="eco3-image__layer" style={{ opacity }}>
      <motion.img src={src} alt={alt} loading={index === 0 ? 'eager' : 'lazy'} style={{ scale, y: parallaxY }} />
    </motion.div>
  );
}

function useIsMobile(breakpoint = 768) {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia(`(max-width: ${breakpoint}px)`);
    const update = () => setIsMobile(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, [breakpoint]);
  return isMobile;
}

// Cinematic scroll-story: the section is TOTAL viewport-heights tall; a
// `position: sticky` viewport pins for that whole scroll distance while
// framer-motion's scroll-linked transforms crossfade/parallax each story's
// text and image in and out based on scroll progress alone (opacity +
// transform only — no layout thrash, fully GPU-accelerated). Falls back to
// a plain stacked-card list on mobile, where scroll-jacking is unreliable.
export default function EcosystemSection({ images }: Props) {
  const wrapRef = useRef<HTMLElement>(null);
  const isMobile = useIsMobile();
  const { scrollYProgress } = useScroll({ target: wrapRef, offset: SCROLL_OFFSET });
  const [active, setActive] = useState(0);

  useMotionValueEvent(scrollYProgress, 'change', (v) => {
    setActive(Math.min(TOTAL - 1, Math.max(0, Math.floor(v * TOTAL))));
  });

  // Fractional progress through the *current* item only (0–1), so the fill
  // bar resets each time a new story becomes active rather than growing
  // across the whole section.
  const progressFill = useTransform(scrollYProgress, (v) => v * TOTAL - Math.floor(v * TOTAL));

  const goTo = (i: number) => {
    const el = wrapRef.current;
    if (!el) return;
    const top = el.offsetTop + (i / TOTAL) * el.offsetHeight + 4;
    smoothScrollTo(top);
  };

  if (isMobile) {
    return (
      <section className="eco3-mobile">
        <div className="eco3-topbar">
          <span className="eco3-topbar__eyebrow">360° Campus Ecosystem</span>
          <span className="eco3-topbar__sub">Your Growth, Our Priority</span>
        </div>
        {ECOSYSTEM_STORIES.map((story) => (
          <div key={story.title} className="eco3-mobile__item">
            <img src={images[story.imageSlot]} alt={story.title} loading="lazy" />
            <h3>{story.title}</h3>
            <p>{story.desc}</p>
          </div>
        ))}
      </section>
    );
  }

  return (
    <section className="eco3" ref={wrapRef} style={{ height: `${TOTAL * 100}vh` }}>
      <div className="eco3-pin">
        <div className="eco3-topbar">
          <span className="eco3-topbar__eyebrow">360° Campus Ecosystem</span>
          <span className="eco3-topbar__sub">Your Growth, Our Priority</span>
        </div>

        <nav className="eco3-rail" aria-label="Campus ecosystem stories">
          {ECOSYSTEM_STORIES.map((story, i) => (
            <button
              key={story.title}
              className={`eco3-rail__item${i === active ? ' active' : ''}`}
              onClick={() => goTo(i)}
            >
              <span className="eco3-rail__dot" />
              <span className="eco3-rail__label">{story.title}</span>
            </button>
          ))}
        </nav>

        <div className="eco3-content">
          <div className="eco3-text">
            {ECOSYSTEM_STORIES.map((story, i) => (
              <EcosystemTextItem key={story.title} scrollYProgress={scrollYProgress} index={i} story={story} />
            ))}
          </div>
          <div className="eco3-image">
            {ECOSYSTEM_STORIES.map((story, i) => (
              <EcosystemImageLayer
                key={story.title}
                scrollYProgress={scrollYProgress}
                index={i}
                src={images[story.imageSlot]}
                alt={story.title}
              />
            ))}
          </div>
        </div>

        <div className="eco3-progress">
          <span className="eco3-progress__current">{String(active + 1).padStart(2, '0')}</span>
          <div className="eco3-progress__bar">
            <motion.div className="eco3-progress__fill" style={{ scaleY: progressFill }} />
          </div>
          <span>{String(TOTAL).padStart(2, '0')}</span>
        </div>
      </div>
    </section>
  );
}
