import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import SmoothImage from '../../../components/SmoothImage/SmoothImage';

interface Props {
  imageUrl: string;
  imageAlt: string;
}

// Mirrors lpu.in's "Pioneering Minds" band: narrative heading + supporting
// photo on the right, with a circular CTA button beneath the heading.
export default function ResearchSpotlightSection({ imageUrl, imageAlt }: Props) {
  return (
    <section className="lph-research-spotlight section">
      <div className="container lph-research-spotlight__grid">
        <motion.div initial={{ opacity: 0, x: -24 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, amount: 0.4 }} transition={{ duration: 0.6 }}>
          <h2 className="section-title">Pioneering Minds Driving Real Impact</h2>
          <Link to="/research" className="lph-circle-cta">Research<br />@ VWU</Link>
        </motion.div>
        <motion.div className="lph-research-spotlight__photo" initial={{ opacity: 0, x: 24 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, amount: 0.3 }} transition={{ duration: 0.6 }}>
          <SmoothImage src={imageUrl} alt={imageAlt} />
          <p>VWU's faculty continue to advance research across CSE, ECE, and EEE — backed by dedicated labs and doctoral programs.</p>
        </motion.div>
      </div>
    </section>
  );
}
