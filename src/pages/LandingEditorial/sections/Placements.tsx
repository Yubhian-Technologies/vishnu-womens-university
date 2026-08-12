import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useCounter } from '../../../hooks/useCounter';
import { PLACEMENT_STATS, RECRUITERS } from '../landingEditorial.data';
import Reveal from '../Reveal';

function Stat({ value, suffix, label, start, index }: { value: number; suffix: string; label: string; start: boolean; index: number }) {
  const count = useCounter(value, 1800, start);
  return (
    <Reveal className="lpe-stat" index={index}>
      <span className="lpe-stat__num">{count.toLocaleString()}{suffix}</span>
      <span className="lpe-stat__label">{label}</span>
    </Reveal>
  );
}

export default function Placements() {
  const [started, setStarted] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { setStarted(true); obs.disconnect(); }
    }, { threshold: 0.35 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <section className="lpe-section lpe-section--paper" id="placements" aria-label="Placements and career outcomes">
      <div className="lpe-container">
        <div className="lpe-section-head">
          <Reveal index={0}>
            <span className="lpe-eyebrow">Placements &amp; Career Outcomes</span>
            <h2 className="lpe-h2">Careers that start<br /><span className="lpe-italic">before graduation.</span></h2>
          </Reveal>
          <Reveal index={1}>
            <Link to="/placements" className="lpe-btn lpe-btn--outline-dark">Placement Details</Link>
          </Reveal>
        </div>

        <div className="lpe-stat-row" ref={ref} style={{ marginBottom: '3rem' }}>
          {PLACEMENT_STATS.map((s, i) => <Stat key={s.label} {...s} start={started} index={i} />)}
        </div>

        <Reveal index={0}>
          <p className="lpe-kicker" style={{ marginBottom: '1rem' }}>Our Recruiters</p>
        </Reveal>
        <div className="lpe-marquee">
          <div className="lpe-marquee__track">
            {[...RECRUITERS, ...RECRUITERS].map((name, i) => (
              <span key={name + i} className="lpe-marquee__chip">{name}</span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
