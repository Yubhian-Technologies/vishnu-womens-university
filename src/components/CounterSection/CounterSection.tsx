import { useState, useEffect, useRef } from 'react';
import { Award, type LucideIcon } from 'lucide-react';
import { useCounter } from '../../hooks/useCounter';
import { useContentBlocks } from '../../hooks/useContentBlocks';
import { resolveContentIcon } from '../../lib/contentIcons';
import type { ContentBlockDoc } from '../../pages/Admin/sections/ContentBlocksAdmin';
import './CounterSection.css';

// The original hardcoded stats this section shipped with, before it became
// admin-editable via /admin → Page Content Blocks (home / counters). Shown
// until an admin adds real entries there — same fallback pattern used
// throughout the rest of this codebase (e.g. defaultExecutives in About.tsx).
const defaultCounters: ContentBlockDoc[] = [
  { id: 'default-1', page: 'home', section: 'counters', value: '15000', title: 'Engineers Graduated', desc: 'Alumni strong', icon: 'GraduationCap', slug: '+', order: 0 },
  { id: 'default-2', page: 'home', section: 'counters', value: '250', title: 'Experienced Faculty', desc: 'Expert educators', icon: 'Presentation', slug: '+', order: 1 },
  { id: 'default-3', page: 'home', section: 'counters', value: '1100', title: 'Placements', desc: '2025-2026', icon: 'Briefcase', slug: '+', order: 2 },
  { id: 'default-4', page: 'home', section: 'counters', value: '2500', title: 'Research Publications', desc: 'International journals', icon: 'FileText', slug: '+', order: 3 },
  { id: 'default-5', page: 'home', section: 'counters', value: '90', title: 'Patents Filed', desc: 'Innovations & inventions', icon: 'Trophy', slug: '+', order: 4 },
  { id: 'default-7', page: 'home', section: 'counters', value: '500', title: 'Industry Partners', desc: 'Recruiting & collaborating', icon: 'Factory', slug: '+', order: 5 },
  { id: 'default-8', page: 'home', section: 'counters', value: '25', title: 'Global MoUs', desc: 'International outreach', icon: 'Globe2', slug: '+', order: 6 },
];

function SingleCounter({ item, start, Icon }: { item: ContentBlockDoc; start: boolean; Icon: LucideIcon }) {
  const count = useCounter(parseInt(item.value, 10) || 0, 2200, start);
  return (
    <div className="counter-item">
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
