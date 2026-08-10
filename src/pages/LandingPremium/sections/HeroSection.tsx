import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

interface Props {
  imageUrl: string;
  imageAlt: string;
}

// Mirrors lpu.in's hero: a bold, oversized slanted headline over a
// torn-paper-edged photo panel, rather than a conventional centered
// hero — the single most recognizable element of LPU's homepage.
export default function HeroSection({ imageUrl, imageAlt }: Props) {
  return (
    <section className="lph-hero">
      <div className="lph-hero__text">
        <motion.p className="lph-hero__eyebrow" initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          Vishnu Womens University
        </motion.p>
        <motion.h1 initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }}>
          Empowering women.<br />Engineering excellence.
        </motion.h1>
        <motion.div className="lph-hero__tag" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 }}>
          The first private state university for women in the Telugu states.
        </motion.div>
      </div>
      <motion.div className="lph-hero__photo-wrap" initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.7, delay: 0.15 }}>
        <div className="lph-hero__torn" />
        <img src={imageUrl} alt={imageAlt} className="lph-hero__photo" />
      </motion.div>
      <motion.div className="lph-hero__actions" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.45 }}>
        <Link to="/admissions" className="btn btn-accent btn-lg">Apply Now</Link>
        <Link to="/academics" className="btn btn-outline btn-lg">Explore Programs</Link>
      </motion.div>
    </section>
  );
}
