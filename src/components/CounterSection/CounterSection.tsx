import { useState, useEffect, useRef } from 'react';
import { GraduationCap, Presentation, Briefcase, FileText, Trophy, Award, Factory, Globe2, type LucideIcon } from 'lucide-react';
import { useCounter } from '../../hooks/useCounter';
import './CounterSection.css';

interface CounterItem {
  icon: LucideIcon;
  target: number;
  suffix: string;
  label: string;
  sub: string;
}

const counters: CounterItem[] = [
  { icon: GraduationCap, target: 13100, suffix: '+', label: 'Engineers Graduated', sub: 'Alumni strong' },
  { icon: Presentation, target: 230, suffix: '+', label: 'Experienced Faculty', sub: 'Expert educators' },
  { icon: Briefcase, target: 1400, suffix: '+', label: 'Annual Placements', sub: 'Every year' },
  { icon: FileText, target: 2500, suffix: '+', label: 'Research Publications', sub: 'International journals' },
  { icon: Trophy, target: 90, suffix: '+', label: 'Patents Filed', sub: 'Innovations & inventions' },
  { icon: Award, target: 300, suffix: '+', label: 'Qualified Faculty', sub: 'Across all departments' },
  { icon: Factory, target: 500, suffix: '+', label: 'Industry Partners', sub: 'Recruiting & collaborating' },
  { icon: Globe2, target: 25, suffix: '+', label: 'Global MoUs', sub: 'International outreach' },
];

function SingleCounter({ item, start }: { item: CounterItem; start: boolean }) {
  const count = useCounter(item.target, 2200, start);
  return (
    <div className="counter-item reveal" data-reveal>
      <div className="counter-icon"><item.icon size={22} strokeWidth={1.75} /></div>
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
