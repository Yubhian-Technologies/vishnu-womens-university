import { useState, useEffect, useRef } from 'react';
import { useCounter } from '../../hooks/useCounter';
import { useContentBlocks } from '../../hooks/useContentBlocks';
import type { ContentBlockDoc } from '../../pages/Admin/sections/ContentBlocksAdmin';
import './CounterSection.css';

const defaultCounters: ContentBlockDoc[] = [
  { id: 'default-1', page: 'home', section: 'counters', value: '15000', title: 'Engineers Graduated',   desc: 'Alumni strong',              icon: '', slug: '+', order: 0 },
  { id: 'default-2', page: 'home', section: 'counters', value: '',      title: 'Expert Faculty',        desc: 'Expert educators',           icon: '', slug: '',  order: 1 },
  { id: 'default-3', page: 'home', section: 'counters', value: '1100',  title: 'Placements',            desc: '2025-2026',                  icon: '', slug: '+', order: 2 },
  { id: 'default-4', page: 'home', section: 'counters', value: '2500',  title: 'Research Publications', desc: 'International journals',     icon: '', slug: '+', order: 3 },
  { id: 'default-5', page: 'home', section: 'counters', value: '150',   title: 'Patents Filed',         desc: 'Innovations & inventions',   icon: '', slug: '+', order: 4 },
  { id: 'default-6', page: 'home', section: 'counters', value: '500',   title: 'Industry Partners',     desc: 'Recruiting & collaborating', icon: '', slug: '+', order: 5 },
  { id: 'default-7', page: 'home', section: 'counters', value: '25',    title: 'Global MoUs',           desc: 'International outreach',     icon: '', slug: '+', order: 6 },
];

function SingleCounter({
  item,
  start,
}: {
  item: ContentBlockDoc;
  start: boolean;
}) {
  const count = useCounter(parseInt(item.value, 10) || 0, 2200, start);

  return (
    <div className="counter-item-m3">
      <div className="counter-item-state-layer" />
      
      {/* Big Bold Stat Value */}
      {item.value ? (
        <div className="counter-number-m3">
          <span className="counter-value">{count.toLocaleString()}</span>
          <span className="counter-suffix-m3">{item.slug || '+'}</span>
        </div>
      ) : null}

      {/* Metric Label */}
      <h3 className="counter-label-m3">{item.title}</h3>

      {/* Subtitle / Micro Tag */}
      {item.desc && (
        <div className="counter-sub-pill">
          <span>{item.desc}</span>
        </div>
      )}
    </div>
  );
}

export default function CounterSection() {
  const liveCounters = useContentBlocks('home', 'counters');
  const counters = liveCounters.length > 0 ? liveCounters : defaultCounters;
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
      { threshold: 0.2 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section className="counter-section-m3" ref={sectionRef} aria-label="VWU Key University Statistics">
      {/* Subtle Ambient Glow */}
      <div className="counter-glow" aria-hidden="true" />

      <div className="container">
        <div className="counter-grid-m3">
          {counters.map((item) => (
            <SingleCounter key={item.id} item={item} start={started} />
          ))}
        </div>
      </div>
    </section>
  );
}
