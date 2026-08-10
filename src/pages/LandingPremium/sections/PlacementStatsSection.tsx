import { useEffect, useRef, useState } from 'react';
import { useCounter } from '../../../hooks/useCounter';
import { PLACEMENT_STATS, RECRUITERS } from '../landingPremium.data';

// Mirrors lpu.in's placements band: stats presented as large circular
// bubbles (not cards), followed by a plain recruiter wordmark wall.
function StatCircle({ value, suffix, label, start }: { value: number; suffix: string; label: string; start: boolean }) {
  const count = useCounter(value, 2000, start);
  return (
    <div className="lph-stat-circle">
      <div className="lph-stat-circle__number">{count}{suffix}</div>
      <p>{label}</p>
    </div>
  );
}

export default function PlacementStatsSection() {
  const [started, setStarted] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { setStarted(true); obs.disconnect(); }
    }, { threshold: 0.3 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <section className="lph-placement section">
      <div className="container">
        <div className="lph-stat-circles" ref={ref}>
          {PLACEMENT_STATS.map((s) => <StatCircle key={s.label} {...s} start={started} />)}
        </div>
        <div className="lph-recruiter-wall">
          {RECRUITERS.map((name) => (
            <div key={name} className="lph-recruiter-chip">{name}</div>
          ))}
        </div>
      </div>
    </section>
  );
}
