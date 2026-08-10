import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TESTIMONIALS } from '../landingPremium.data';

// Mirrors lpu.in's "What our Alumni say" layout: a vertical, clickable list
// of avatars on the left selecting which quote panel shows on the right —
// not a rotating centered carousel.
export default function TestimonialsSection() {
  const [active, setActive] = useState(0);
  const t = TESTIMONIALS[active];

  return (
    <section className="lph-testimonials section">
      <div className="container">
        <p className="lph-eyebrow-label">Testimonials</p>
        <h2 className="section-title" style={{ marginBottom: '2.5rem' }}>What Our Alumni Say</h2>
        <div className="lph-testimonials__grid">
          <div className="lph-testimonials__avatars">
            {TESTIMONIALS.map((item, i) => (
              <button
                key={item.name}
                className={`lph-testimonials__avatar-btn${i === active ? ' active' : ''}`}
                onClick={() => setActive(i)}
              >
                <img src={item.avatar} alt={item.name} />
              </button>
            ))}
          </div>
          <AnimatePresence mode="wait">
            <motion.div
              key={t.name}
              className="lph-testimonials__panel"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.35 }}
            >
              <p>{t.quote}</p>
              <strong>{t.name}</strong>
              <span>{t.role}</span>
            </motion.div>
          </AnimatePresence>
          <img src={t.avatar} alt="" className="lph-testimonials__hero-photo" />
        </div>
      </div>
    </section>
  );
}
