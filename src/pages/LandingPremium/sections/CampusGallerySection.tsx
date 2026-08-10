import { motion } from 'framer-motion';
import SmoothImage from '../../../components/SmoothImage/SmoothImage';

interface Props {
  images: { url: string; alt: string }[];
}

// Mirrors lpu.in's "Spotlight" masonry photo band — varied tile sizes
// rather than a uniform grid.
export default function CampusGallerySection({ images }: Props) {
  return (
    <section className="lph-spotlight">
      <p className="lph-eyebrow-label" style={{ textAlign: 'center' }}>Spotlight</p>
      <h2 className="section-title" style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
        Where a Dream Turns into Reality — Life at VWU
      </h2>
      <div className="lph-spotlight__grid">
        {images.map((img, i) => (
          <motion.div
            key={i}
            className={`lph-spotlight__tile lph-spotlight__tile--${i}`}
            initial={{ opacity: 0, scale: 0.94 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.5, delay: (i % 6) * 0.06 }}
          >
            <SmoothImage src={img.url} alt={img.alt} />
          </motion.div>
        ))}
      </div>
    </section>
  );
}
