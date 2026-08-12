import { motion, type Variants } from 'framer-motion';
import type { CSSProperties, ReactNode } from 'react';

const upVariants: Variants = {
  hidden: { opacity: 0, y: 44, scale: 0.97 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.85, delay: (i ?? 0) * 0.1, ease: [0.16, 0.75, 0.2, 1] },
  }),
};

// Slightly more cinematic clip-style reveal for media/cards — starts larger
// and clipped-in rather than just faded/slid, echoing the image-scale
// treatment already used in ResearchStory's pinned scroll sequence.
const mediaVariants: Variants = {
  hidden: { opacity: 0, y: 32, scale: 1.06, clipPath: 'inset(6% 6% 6% 6% round 2px)' },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    clipPath: 'inset(0% 0% 0% 0% round 2px)',
    transition: { duration: 0.9, delay: (i ?? 0) * 0.1, ease: [0.16, 0.75, 0.2, 1] },
  }),
};

interface RevealProps {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  index?: number;
  as?: 'div' | 'span';
  variant?: 'up' | 'media';
}

/** Shared whileInView reveal used across most Landing Page 3 sections. */
export default function Reveal({ children, className, style, index = 0, as = 'div', variant = 'up' }: RevealProps) {
  const MotionTag = as === 'span' ? motion.span : motion.div;
  return (
    <MotionTag
      className={className}
      style={style}
      variants={variant === 'media' ? mediaVariants : upVariants}
      custom={index}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.15 }}
    >
      {children}
    </MotionTag>
  );
}
