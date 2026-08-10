import { motion } from 'framer-motion';
import { LEADERSHIP } from '../landingPremium.data';

function getInitials(name: string) {
  const cleaned = name.replace(/\b(Dr|Sri|Prof|Mr|Mrs|Ms)\.?\s*/gi, '');
  const parts = cleaned.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return '';
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

// Mirrors lpu.in's "Esteemed Visitors" photo-grid band, reframed with VWU's
// own real Governing Body leadership (src/pages/Governance/GoverningBody.tsx)
// rather than inventing visiting dignitaries.
export default function LeadershipGallerySection() {
  return (
    <section className="lph-leadership">
      <div className="container">
        <p className="lph-eyebrow-label">Leadership</p>
        <h2 className="section-title">Governing VWU's Vision</h2>
        <div className="lph-leadership__grid">
          {LEADERSHIP.map((m, i) => (
            <motion.div
              key={m.name}
              className="lph-leadership__tile"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.45, delay: (i % 6) * 0.07 }}
            >
              <div className="lph-leadership__avatar">{getInitials(m.name)}</div>
              <strong>{m.name}</strong>
              <span>{m.title}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
