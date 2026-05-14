import { useState, useEffect, useRef } from 'react';
import { useCounter } from '../../hooks/useCounter';
import './CounterSection.css';

interface CounterItem {
  icon: string;
  target: number;
  suffix: string;
  label: string;
  sub: string;
}

const counters: CounterItem[] = [
  { icon: '🎓', target: 13100, suffix: '+', label: 'Engineers Graduated', sub: 'Alumni strong' },
  { icon: '👩‍🏫', target: 230, suffix: '+', label: 'Experienced Faculty', sub: 'Expert educators' },
  { icon: '💼', target: 1400, suffix: '+', label: 'Annual Placements', sub: 'Every year' },
  { icon: '📄', target: 2500, suffix: '+', label: 'Research Publications', sub: 'International journals' },
  { icon: '🏆', target: 90, suffix: '+', label: 'Patents Filed', sub: 'Innovations & inventions' },
];

function SingleCounter({ item, start }: { item: CounterItem; start: boolean }) {
  const count = useCounter(item.target, 2200, start);
  return (
    <div className="counter-item reveal" data-reveal>
      <div className="counter-icon">{item.icon}</div>
      <div className="counter-number">
        {count}
        <span className="counter-suffix">{item.suffix}</span>
      </div>
      <p className="counter-label">{item.label}</p>
      <p className="counter-sub">{item.sub}</p>
    </div>
  );
}

export default function CounterSection() {
  const [started, setStarted] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setStarted(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section className="counter-section" ref={sectionRef} aria-label="VWU key statistics">
      <div className="container">
        <div className="counter-grid">
          {counters.map((item) => (
            <SingleCounter key={item.label + item.sub} item={item} start={started} />
          ))}
        </div>
      </div>
    </section>
  );
}
