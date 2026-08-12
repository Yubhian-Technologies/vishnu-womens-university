import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { TESTIMONIALS } from '../landingEditorial.data';
import Reveal from '../Reveal';

export default function Testimonials() {
  const [active, setActive] = useState(0);
  const current = TESTIMONIALS[active];

  return (
    <section className="lpe-section lpe-section--paper" aria-label="Testimonials">
      <div className="lpe-container">
        <Reveal index={0}>
          <span className="lpe-eyebrow">Voices of VWU</span>
          <h2 className="lpe-h2" style={{ marginBottom: '2.5rem' }}>Students. Alumni.<br /><span className="lpe-italic">Faculty. Family.</span></h2>
        </Reveal>

        <div className="lpe-testimonial-wrap">
          <div className="lpe-testimonial-avatars">
            {TESTIMONIALS.map((t, i) => (
              <button
                key={t.name + i}
                className={`lpe-testimonial-avatar${i === active ? ' active' : ''}`}
                onClick={() => setActive(i)}
              >
                <img src={t.avatar} alt="" aria-hidden="true" />
                <span>
                  <span className="name">{t.name}</span>
                  <span className="tag">{t.tag}</span>
                </span>
              </button>
            ))}
          </div>

          <div className="lpe-testimonial-panel">
            <AnimatePresence mode="wait">
              <motion.div
                key={active}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.4 }}
              >
                <p className="lpe-testimonial-quote">&ldquo;{current.quote}&rdquo;</p>
                <div className="lpe-testimonial-who">
                  {current.name}
                  <span>{current.role}</span>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
