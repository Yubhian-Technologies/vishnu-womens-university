import { useRef, type ReactNode } from 'react';
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';

interface Props {
  children: ReactNode;
  className?: string;
  /** How far the media drifts across its own scroll passage, in % of height. */
  strength?: number;
}

/**
 * Wraps a feature-block image so it drifts slightly as the section scrolls
 * past — the "editorial" pinned-photo feel used throughout, without the
 * complexity of a fully scroll-jacked section. Media must be visually
 * taller than its frame (see .lpe-parallax-frame) so the drift never
 * reveals an edge. No-ops under prefers-reduced-motion.
 */
export default function ParallaxMedia({ children, className, strength = 12 }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], [`-${strength}%`, `${strength}%`]);

  return (
    <div ref={ref} className={`lpe-parallax-frame${className ? ` ${className}` : ''}`}>
      <motion.div className="lpe-parallax-inner" style={prefersReducedMotion ? undefined : { y }}>
        {children}
      </motion.div>
    </div>
  );
}
