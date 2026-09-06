import { useEffect, useRef, useState } from 'react';
import { useCounter } from '../../../hooks/useCounter';
import { IMPACT_STATS } from '../landingEditorial.data';
import Reveal from '../Reveal';

function Stat({ value, suffix, label, start, index }: { value: number; suffix: string; label: string; start: boolean; index: number }) {
  const count = useCounter(value, 1800, start);
  return (
    <Reveal className="lpe-stat lpe-stat--big" index={index}>
      {value > 0 && <span className="lpe-stat__num">{count.toLocaleString()}{suffix}</span>}
      <span className="lpe-stat__label">{label}</span>
    </Reveal>
  );
}

export default function Impact() {
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
    <section className="lpe-section lpe-section--dark lpe-section--tight" aria-label="University impact">
      <div className="lpe-container">
        <Reveal index={0}>
          <span className="lpe-eyebrow">University Impact</span>
        </Reveal>
        <div className="lpe-stat-row" ref={ref} style={{ marginTop: '1.5rem' }}>
          {IMPACT_STATS.map((s, i) => (
            <Stat key={s.label} {...s} start={started} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
