import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import SmoothImage from '../../../components/SmoothImage/SmoothImage';
import { CAMPUS_LIFE_FEATURED, CAMPUS_LIFE_STORIES } from '../landingEditorial.data';
import Reveal from '../Reveal';

interface ImageRef { url: string; alt: string; }

interface Props {
  images: Record<'hero' | 'story1' | 'story2' | 'story3', ImageRef>;
}

/** Large hero image that overlaps the dark intro band and the light content
 *  band beneath it — a one-time clip-path/scale/opacity reveal on the outer
 *  frame, plus a continuous, subtle scroll parallax on the image itself. */
function HeroImage({ src, alt }: { src: string; alt: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], ['-6%', '6%']);

  return (
    <motion.div
      ref={ref}
      className="lpe-cl__hero-wrap"
      initial={{ opacity: 0, scale: 0.96, y: 26, clipPath: 'inset(6% round 2px)' }}
      whileInView={{ opacity: 1, scale: 1, y: 0, clipPath: 'inset(0% round 2px)' }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 1, ease: [0.16, 0.75, 0.2, 1] }}
    >
      <motion.div className="lpe-cl__hero-inner" style={prefersReducedMotion ? undefined : { y }}>
        <SmoothImage src={src} alt={alt} loading="lazy" />
      </motion.div>
    </motion.div>
  );
}

export default function CampusLife({ images }: Props) {
  const [wide, narrow] = CAMPUS_LIFE_STORIES.slice(1);
  const primary = CAMPUS_LIFE_STORIES[0];

  return (
    <section className="lpe-cl" id="campus-life" aria-label="Campus life">
      {/* Dark introductory band */}
      <div className="lpe-cl__intro-band">
        <div className="lpe-container lpe-cl__intro">
          <Reveal index={0}>
            <span className="lpe-eyebrow lpe-eyebrow--on-dark">Campus Life</span>
          </Reveal>
          <Reveal index={1}>
            <h2 className="lpe-cl__heading">Life Beyond<br /><span className="lpe-italic">the Classroom.</span></h2>
          </Reveal>
          <Reveal index={2}>
            <p className="lpe-cl__intro-text">
              Clubs, hostels, festivals, and friendships — campus life at VWU is where
              students become the version of themselves they came here to build.
            </p>
          </Reveal>
        </div>
      </div>

      {/* Light content band — hero image overlaps up into the band above */}
      <div className="lpe-cl__content-band">
        <div className="lpe-container">
          <HeroImage src={images.hero.url} alt={images.hero.alt} />

          <div className="lpe-cl__primary-row">
            <Reveal index={0} className="lpe-cl__featured">
              <h3 className="lpe-cl__featured-title">{CAMPUS_LIFE_FEATURED.title}</h3>
              <p className="lpe-cl__featured-desc">{CAMPUS_LIFE_FEATURED.desc}</p>
              <Link to={CAMPUS_LIFE_FEATURED.link} className="lpe-cl__cta">
                {CAMPUS_LIFE_FEATURED.linkLabel}
                <ArrowRight size={16} className="lpe-cl__cta-arrow" />
              </Link>
            </Reveal>

            <Reveal index={1} variant="media" className="lpe-cl-story lpe-cl-story--primary">
              <Link to={primary.link}>
                <div className="lpe-cl-story__media">
                  <SmoothImage src={images.story1.url} alt={images.story1.alt} loading="lazy" />
                </div>
                <span className="lpe-cl-story__cat">{primary.category}</span>
                <h4 className="lpe-cl-story__title">{primary.title}</h4>
                <p className="lpe-cl-story__desc">{primary.desc}</p>
                <span className="lpe-cl-story__more">Read More <ArrowRight size={13} /></span>
              </Link>
            </Reveal>
          </div>

          <div className="lpe-cl__secondary-row">
            <Reveal index={2} variant="media" className="lpe-cl-story lpe-cl-story--wide">
              <Link to={wide.link}>
                <div className="lpe-cl-story__media">
                  <SmoothImage src={images.story2.url} alt={images.story2.alt} loading="lazy" />
                </div>
                <span className="lpe-cl-story__cat">{wide.category}</span>
                <h4 className="lpe-cl-story__title">{wide.title}</h4>
                <p className="lpe-cl-story__desc">{wide.desc}</p>
                <span className="lpe-cl-story__more">Read More <ArrowRight size={13} /></span>
              </Link>
            </Reveal>

            <Reveal index={3} variant="media" className="lpe-cl-story lpe-cl-story--narrow">
              <Link to={narrow.link}>
                <div className="lpe-cl-story__media">
                  <SmoothImage src={images.story3.url} alt={images.story3.alt} loading="lazy" />
                </div>
                <span className="lpe-cl-story__cat">{narrow.category}</span>
                <h4 className="lpe-cl-story__title">{narrow.title}</h4>
                <span className="lpe-cl-story__more">Read More <ArrowRight size={13} /></span>
              </Link>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
