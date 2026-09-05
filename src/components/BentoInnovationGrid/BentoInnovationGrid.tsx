import { useEffect, useRef, useState } from 'react';
import { Microscope, Briefcase, Rocket, Crown } from 'lucide-react';
import './BentoInnovationGrid.css';

const CARDS = [
  {
    key: 'research',
    icon: Microscope,
    variant: 'coral',
    label: 'Research & Innovation',
    title: 'Transforming Ideas into Impact',
    desc: 'Research-driven learning, innovation and technology that create solutions for real-world challenges.',
  },
  {
    key: 'industry',
    icon: Briefcase,
    variant: 'indigo',
    label: 'Industry & Careers',
    title: 'Preparing Talent for the Future',
    desc: 'Industry exposure, internships, training and placements that connect learning with rewarding careers.',
  },
  {
    key: 'entrepreneurship',
    icon: Rocket,
    variant: 'teal',
    label: 'Entrepreneurship & Start-ups',
    title: 'Ideas That Inspire. Ventures That Grow.',
    desc: 'Mentorship, incubation and innovation support to transform promising ideas into ventures.',
  },
  {
    key: 'leadership',
    icon: Crown,
    variant: 'crimson',
    label: "Women's Leadership",
    title: 'Empowering Women to Lead',
    desc: 'Building confident, capable and future-ready women through education, leadership and opportunity.',
  },
] as const;

export default function BentoInnovationGrid() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.12 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section className="bento-innovation-section" ref={sectionRef} aria-label="Innovation, Research & Startup Ecosystem">
      <div className="container">
        <div className="bento-section-header">
          <h2 className="bento-section-title">
            Innovation, Research &amp; Startup Ecosystem
          </h2>
        </div>

        <div className={`bento-grid-canvas ${isVisible ? 'is-in-view' : ''}`}>
          {CARDS.map((card) => (
            <div key={card.key} className={`bento-card bento-card--${card.variant}`}>
              <div className="bento-card-icon-badge" aria-hidden="true">
                <card.icon size={26} strokeWidth={1.75} />
              </div>
              <div className="bento-card-content">
                <span className="bento-card-label">{card.label}</span>
                <h3 className="bento-card-title">{card.title}</h3>
                <p className="bento-card-desc">{card.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
