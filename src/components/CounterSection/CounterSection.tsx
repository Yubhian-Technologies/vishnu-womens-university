import { useState, useEffect, useRef } from 'react';
import { Award, type LucideIcon } from 'lucide-react';
import { useCounter } from '../../hooks/useCounter';
import { useContentBlocks } from '../../hooks/useContentBlocks';
import { resolveContentIcon } from '../../lib/contentIcons';
import type { ContentBlockDoc } from '../../pages/Admin/sections/ContentBlocksAdmin';
import './CounterSection.css';

function SingleCounter({ item, start, Icon }: { item: ContentBlockDoc; start: boolean; Icon: LucideIcon }) {
  const count = useCounter(parseInt(item.value, 10) || 0, 2200, start);
  return (
    <div className="counter-item reveal" data-reveal>
      <div className="counter-icon"><Icon size={22} strokeWidth={1.75} /></div>
      <div className="counter-number">
        {count}
        <span className="counter-suffix">{item.slug}</span>
      </div>
      <p className="counter-label">{item.title}</p>
      <p className="counter-sub">{item.desc}</p>
    </div>
  );
}

export default function CounterSection() {
  const counters = useContentBlocks('home', 'counters');
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
            <SingleCounter key={item.id} item={item} start={started} Icon={resolveContentIcon(item.icon) || Award} />
          ))}
        </div>
      </div>
    </section>
  );
}
