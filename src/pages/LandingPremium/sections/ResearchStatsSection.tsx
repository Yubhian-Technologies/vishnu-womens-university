import { motion } from 'framer-motion';
import { RESEARCH_STATS } from '../landingPremium.data';

// Mirrors lpu.in's oversized-typography research stats band.
export default function ResearchStatsSection() {
  return (
    <section className="lph-research-stats">
      <div className="container">
        <p className="lph-eyebrow-label">Research</p>
        <div className="lph-research-stats__grid">
          {RESEARCH_STATS.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
            >
              {s.big ? <div className="lph-research-stats__big">{s.big}</div> : null}
              <p>{s.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
