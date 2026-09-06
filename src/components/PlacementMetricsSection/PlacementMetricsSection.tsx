import { useEffect, useRef, useState } from 'react';
import './PlacementMetricsSection.css';

interface MetricItem {
  id: string;
  value: string;
  boldText: string;
  line1: string;
  line2: string;
}

const METRICS: MetricItem[] = [
  {
    id: 'recruiters',
    value: '100+',
    boldText: 'recruiters',
    line1: 'hired VWU',
    line2: 'graduates',
  },
  {
    id: 'placements',
    value: '1000+',
    boldText: 'annual placements',
    line1: 'from Fortune 500',
    line2: 'companies',
  },
  {
    id: 'package',
    value: '₹59.29 LPA',
    boldText: 'highest package',
    line1: 'secured at',
    line2: 'Google',
  },
  {
    id: 'placement-rate',
    value: '92%+',
    boldText: 'placement rate',
    line1: 'across B.Tech',
    line2: 'disciplines',
  },
];

export default function PlacementMetricsSection() {
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
      { threshold: 0.15 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section className="vwu-placement-metrics-section" ref={sectionRef} aria-label="Placement Highlights">
      <div className="container">
        {/* Header Layout */}
        <div className="vwu-pm-header">
          <div className="vwu-pm-badge-col">
            <span className="vwu-pm-badge">PLACEMENTS</span>
            <svg className="vwu-pm-badge-swash" width="90" height="12" viewBox="0 0 100 14" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M2 8C25 2 75 2 98 10" stroke="#C9973A" strokeWidth="3.5" strokeLinecap="round"/>
            </svg>
          </div>

          <div className="vwu-pm-header-content">
            <h2 className="vwu-pm-title">
              <span className="vwu-pm-title-main">Explore</span>
              <span className="vwu-pm-title-sub">the Top Global recruiters who choose VWU talent</span>
            </h2>
            <p className="vwu-pm-desc">
              VWU offers top placements with packages of up to ₹59.29 LPA, featuring 100+ recruiters like Google, Amazon, Microsoft, Palo Alto Networks, and Adobe, along with career-focused training.
            </p>
          </div>
        </div>

        {/* 4 Circular Metric Cards Row */}
        <div className={`vwu-pm-circles-grid ${isVisible ? 'is-in-view' : ''}`}>
          {METRICS.map((item, index) => (
            <div
              key={item.id}
              className="vwu-pm-circle-card"
              style={{ animationDelay: `${index * 120}ms` }}
            >
              <div className="vwu-pm-circle-inner">
                <span className="vwu-pm-circle-val">{item.value}</span>
                <span className="vwu-pm-circle-bold">{item.boldText}</span>
                <span className="vwu-pm-circle-sub">{item.line1}</span>
                <span className="vwu-pm-circle-sub">{item.line2}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
