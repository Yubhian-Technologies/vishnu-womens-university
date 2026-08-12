import { useRef } from 'react';
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ChevronDown } from 'lucide-react';
import SmoothImage from '../../../components/SmoothImage/SmoothImage';

interface Props {
  imageUrl: string;
  imageAlt: string;
  videoUrl?: string;
}

export default function Hero({ imageUrl, imageAlt, videoUrl }: Props) {
  const sectionRef = useRef<HTMLElement>(null);
  const prefersReducedMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start start', 'end start'] });
  const mediaY = useTransform(scrollYProgress, [0, 1], ['0%', prefersReducedMotion ? '0%' : '18%']);

  return (
    <section className="lpe-hero" ref={sectionRef} aria-label="Introduction">
      <div className="lpe-hero__media">
        <motion.div className="lpe-hero__media-inner" style={{ y: mediaY }}>
          {videoUrl ? (
            <video
              src={videoUrl}
              poster={imageUrl}
              autoPlay={!prefersReducedMotion}
              muted
              loop
              playsInline
              aria-label={imageAlt}
            />
          ) : (
            <SmoothImage src={imageUrl} alt={imageAlt} loading="eager" />
          )}
        </motion.div>
        <div className="lpe-hero__overlay" />
      </div>

      <div className="lpe-hero__content lpe-container">
        <motion.span
          className="lpe-eyebrow lpe-eyebrow--on-dark"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          Vishnu Women&rsquo;s University
        </motion.span>

        <motion.h1
          className="lpe-hero__headline"
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
        >
          Where women engineer<br />
          <span className="lpe-italic">what comes next.</span>
        </motion.h1>

        <motion.p
          className="lpe-hero__lede"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.25 }}
        >
          A university built for one purpose: to give every woman who walks through
          its gates the technical depth, the research grounding, and the confidence
          to lead in engineering, research, and industry.
        </motion.p>

        <motion.div
          className="lpe-btn-row"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4 }}
        >
          <Link to="/admissions" className="lpe-btn lpe-btn--gold">Apply Now</Link>
          <Link to="/academics" className="lpe-btn lpe-btn--outline-light">Explore Programs</Link>
        </motion.div>
      </div>

      <motion.div
        className="lpe-hero__scroll-cue"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.9 }}
        aria-hidden="true"
      >
        <span>Scroll</span>
        <motion.span
          animate={prefersReducedMotion ? undefined : { y: [0, 8, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
        >
          <ChevronDown size={18} />
        </motion.span>
      </motion.div>
    </section>
  );
}
