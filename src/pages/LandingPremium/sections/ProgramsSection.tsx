import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { PROGRAM_GROUPS } from '../landingPremium.data';

// Mirrors lpu.in's "Diverse Range of Programmes" band: descriptive text +
// circular CTA on the left, a two-column list of plain text links on the
// right, plus a secondary dark "download" button.
export default function ProgramsSection() {
  return (
    <section className="lph-programs section">
      <div className="container lph-programs__grid">
        <motion.div initial={{ opacity: 0, x: -24 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, amount: 0.4 }} transition={{ duration: 0.6 }}>
          <p className="lph-eyebrow-label">Academics</p>
          <h2 className="section-title">A Diverse Range of Programmes Designed for Learning, Research, and Innovation</h2>
          <p className="section-desc" style={{ marginBottom: '1.75rem' }}>
            From undergraduate to doctoral levels, VWU's programmes are designed to equip students with
            cutting-edge skills, research aptitude, and professional readiness.
          </p>
          <Link to="/academics" className="lph-circle-cta">Explore All<br />Programmes</Link>
        </motion.div>
        <motion.div className="lph-programs__lists" initial={{ opacity: 0, x: 24 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, amount: 0.3 }} transition={{ duration: 0.6 }}>
          {PROGRAM_GROUPS.map((group) => (
            <div key={group.heading} className="lph-programs__list">
              <h4>{group.heading}</h4>
              {group.items.map((p) => (
                <Link key={p.slug} to={`/academics/${p.slug}`}>{p.title}</Link>
              ))}
            </div>
          ))}
          <Link to="/academics/downloads" className="btn btn-primary" style={{ marginTop: '1rem' }}>
            Download Academic Documents ↗
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
