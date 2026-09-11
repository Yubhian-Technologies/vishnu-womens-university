import { useState, useEffect, useRef } from 'react';
import { useCounter } from '../../hooks/useCounter';
import { useContentBlocks } from '../../hooks/useContentBlocks';
import type { ContentBlockDoc } from '../../pages/Admin/sections/ContentBlocksAdmin';
import './CounterSection.css';

const defaultCounters: ContentBlockDoc[] = [
  { id: 'default-1', page: 'home', section: 'counters', value: '25', title: 'International Partnerships', desc: '', icon: '', slug: '+', order: 0 },
  { id: 'default-2', page: 'home', section: 'counters', value: '1100', title: 'Placements Every Year', desc: '', icon: '', slug: '+', order: 1 },
];

function StatItem({ item, start }: { item: ContentBlockDoc; start: boolean }) {
  const numVal = parseInt(item.value, 10) || 0;
  const count = useCounter(numVal, 2000, start);

  return (
    <div className="glance-stat-item">
      {item.value ? (
        <div className="glance-stat-value-wrap">
          <span className="glance-stat-number">{count.toLocaleString()}</span>
          <span className="glance-stat-suffix">{item.slug || '+'}</span>
        </div>
      ) : null}
      <div className="glance-stat-label">{item.title}</div>
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
    <section className="glance-section" ref={sectionRef} aria-label="VWU at a Glance">
      <div className="container">
        <div className="glance-header">
          <span className="glance-eyebrow">By the Numbers</span>
          <h2 className="glance-title">VWU at a Glance</h2>
          <p className="glance-subtitle">Twenty-five years of graduates, research and industry partnership. Verified as of March 2026</p>
        </div>

        <div className="glance-unified-card">
          <div className="glance-stats-grid">
            {counters.map((item) => (
              <StatItem key={item.id} item={item} start={started} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
