import { motion } from 'framer-motion';
import { Play } from 'lucide-react';
import SmoothImage from '../../../components/SmoothImage/SmoothImage';

interface Props {
  mainImage: string;
  mainAlt: string;
  cardImages: [string, string];
}

// Mirrors lpu.in's "United in Vision" band: one large narrative photo card
// with a play affordance, followed by two smaller highlight cards with
// dark caption bars.
export default function HighlightsSection({ mainImage, mainAlt, cardImages }: Props) {
  return (
    <section className="lph-highlights section">
      <div className="container">
        <motion.div className="lph-section-head" initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.3 }} transition={{ duration: 0.6 }}>
          <p className="lph-eyebrow-label">Highlights</p>
          <h2 className="section-title">United in Purpose. Unmatched in Excellence.</h2>
        </motion.div>

        <motion.div className="lph-highlight-main" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.6 }}>
          <SmoothImage src={mainImage} alt={mainAlt} />
          <div className="lph-highlight-main__overlay">
            <h3>VWU's founding vision, twenty years on</h3>
            <button className="lph-play-btn" aria-label="Play video"><Play size={20} fill="currentColor" /></button>
          </div>
        </motion.div>

        <div className="lph-highlight-cards">
          {[
            { img: cardImages[0], caption: 'UGC recognizes VWU with autonomous status' },
            { img: cardImages[1], caption: 'Graduation Day — celebrating our engineers' },
          ].map((c, i) => (
            <motion.div
              key={c.caption}
              className="lph-highlight-card"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
            >
              <SmoothImage src={c.img} alt={c.caption} />
              <span>{c.caption}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
