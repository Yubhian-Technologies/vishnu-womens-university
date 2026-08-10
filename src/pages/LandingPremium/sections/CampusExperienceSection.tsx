import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Play, ArrowRight } from 'lucide-react';
import SmoothImage from '../../../components/SmoothImage/SmoothImage';

interface Props {
  imageUrl: string;
  imageAlt: string;
}

// Mirrors lpu.in's "A Campus Experience Designed for Excellence" band: a
// large aerial-style campus photo with a play affordance, set against a
// diagonal accent-color background shape.
export default function CampusExperienceSection({ imageUrl, imageAlt }: Props) {
  return (
    <section className="lph-campus-exp">
      <div className="lph-campus-exp__shape" />
      <div className="container">
        <div className="lph-campus-exp__head">
          <h2>A Campus Experience<br />Designed for Excellence</h2>
          <Link to="/campus" className="lph-campus-exp__link">
            Infrastructure <ArrowRight size={16} />
          </Link>
        </div>
        <motion.div className="lph-campus-exp__photo" initial={{ opacity: 0, scale: 0.96 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.7 }}>
          <SmoothImage src={imageUrl} alt={imageAlt} />
          <button className="lph-play-btn lph-play-btn--lg" aria-label="Play campus video"><Play size={28} fill="currentColor" /></button>
        </motion.div>
      </div>
    </section>
  );
}
