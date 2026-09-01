import { useState, useEffect, useRef } from 'react';
import { useCounter } from '../../hooks/useCounter';
import { useContentBlocks } from '../../hooks/useContentBlocks';
import type { ContentBlockDoc } from '../../pages/Admin/sections/ContentBlocksAdmin';
import './CounterSection.css';

// FA icon class mapped from the admin icon field name
const FA_ICON_MAP: Record<string, string> = {
  GraduationCap:    'fa-solid fa-graduation-cap',
  Presentation:     'fa-solid fa-chalkboard-user',
  Briefcase:        'fa-solid fa-briefcase',
  FileText:         'fa-solid fa-file-lines',
  Trophy:           'fa-solid fa-trophy',
  Factory:          'fa-solid fa-industry',
  Globe2:           'fa-solid fa-earth-asia',
  // fallback
  default:          'fa-solid fa-chart-simple',
};

const defaultCounters: ContentBlockDoc[] = [
  { id: 'default-1', page: 'home', section: 'counters', value: '15000', title: 'Engineers Graduated',    desc: 'Alumni strong',               icon: 'GraduationCap', slug: '+', order: 0 },
  { id: 'default-2', page: 'home', section: 'counters', value: '250',   title: 'Experienced Faculty',    desc: 'Expert educators',            icon: 'Presentation',  slug: '+', order: 1 },
  { id: 'default-3', page: 'home', section: 'counters', value: '1100',  title: 'Placements',             desc: '2025-2026',                   icon: 'Briefcase',     slug: '+', order: 2 },
  { id: 'default-4', page: 'home', section: 'counters', value: '2500',  title: 'Research Publications',  desc: 'International journals',      icon: 'FileText',      slug: '+', order: 3 },
  { id: 'default-5', page: 'home', section: 'counters', value: '150',   title: 'Patents Filed',          desc: 'Innovations & inventions',    icon: 'Trophy',        slug: '+', order: 4 },
  { id: 'default-6', page: 'home', section: 'counters', value: '500',   title: 'Industry Partners',      desc: 'Recruiting & collaborating',  icon: 'Factory',       slug: '+', order: 5 },
  { id: 'default-7', page: 'home', section: 'counters', value: '25',    title: 'Global MoUs',            desc: 'International outreach',      icon: 'Globe2',        slug: '+', order: 6 },
];

// Alternating colour themes for the cards
const CARD_THEMES = [
  'counter-theme--forest',   // dark green
  'counter-theme--white',    // white / light
  'counter-theme--forest',
  'counter-theme--white',
  'counter-theme--forest',
  'counter-theme--white',
  'counter-theme--forest',
];

function SingleCounter({
  item,
  start,
  index,
}: {
  item: ContentBlockDoc;
  start: boolean;
  index: number;
}) {
  const count = useCounter(parseInt(item.value, 10) || 0, 2200, start);
  const faClass = FA_ICON_MAP[item.icon] || FA_ICON_MAP.default;
  const theme = CARD_THEMES[index % CARD_THEMES.length];

  return (
    <div className={`counter-item ${theme}`}>
      <div className="counter-icon-wrap">
        <i className={`${faClass} counter-fa-icon`} aria-hidden="true" />
      </div>
      <div className="counter-number">
        {count.toLocaleString()}
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
      { threshold: 0.25 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section className="counter-section" ref={sectionRef} aria-label="VWU key statistics">
      <div className="counter-grid">
        {counters.map((item, idx) => (
          <SingleCounter key={item.id} item={item} start={started} index={idx} />
        ))}
      </div>
    </section>
  );
}
