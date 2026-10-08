import { useEffect, useRef, useState } from 'react';
import { useDocument } from '../../hooks/useDocument';
import { HOME_CONTENT_COLLECTION, HOME_CONTENT_DOC_ID, type HomeContentDoc, DEFAULT_HOME_CONTENT, DEFAULT_PLACEMENT_METRICS, type MetricItem } from '../../constants/homeContentDefaults';
import { renderBold } from '../../lib/boldText';
import './PlacementMetricsSection.css';

export type { MetricItem };
export { DEFAULT_PLACEMENT_METRICS };

export default function PlacementMetricsSection() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);
  const { data: remoteHomeContent } = useDocument<HomeContentDoc>(HOME_CONTENT_COLLECTION, HOME_CONTENT_DOC_ID);

  const badge = remoteHomeContent?.placementBadge || DEFAULT_HOME_CONTENT.placementBadge || 'PLACEMENTS';
  const titleMain = remoteHomeContent?.placementTitleMain || DEFAULT_HOME_CONTENT.placementTitleMain || 'Explore';
  const titleSub = remoteHomeContent?.placementTitleSub || DEFAULT_HOME_CONTENT.placementTitleSub || 'the Top Global recruiters who choose VWU talent';
  const desc = remoteHomeContent?.placementDesc || DEFAULT_HOME_CONTENT.placementDesc || 'VWU offers top placements with packages of up to ₹59.29 LPA, featuring 100+ recruiters like Google, Amazon, Microsoft, Palo Alto Networks, and Adobe, along with 1,100+ career-focused placements every year.';
  const metrics = (remoteHomeContent?.placementMetrics && remoteHomeContent.placementMetrics.length > 0)
    ? remoteHomeContent.placementMetrics
    : DEFAULT_PLACEMENT_METRICS;

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
            <span className="vwu-pm-badge">{badge}</span>
            <svg className="vwu-pm-badge-swash" width="90" height="12" viewBox="0 0 100 14" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M2 8C25 2 75 2 98 10" stroke="#C9973A" strokeWidth="3.5" strokeLinecap="round"/>
            </svg>
          </div>

          <div className="vwu-pm-header-content">
            <h2 className="vwu-pm-title">
              <span className="vwu-pm-title-main">{titleMain} </span>
              <span className="vwu-pm-title-sub">{titleSub}</span>
            </h2>
            <p className="vwu-pm-desc">{renderBold(desc)}</p>
          </div>
        </div>

        {/* 4 Circular Metric Cards Row */}
        <div className={`vwu-pm-circles-grid ${isVisible ? 'is-in-view' : ''}`}>
          {metrics.map((item, index) => (
            <div
              key={item.id || `metric-${index}`}
              className="vwu-pm-circle-card"
              style={{ animationDelay: `${index * 120}ms` }}
            >
              <div className="vwu-pm-circle-inner">
                <span className="vwu-pm-circle-val">{renderBold(item.value)}</span>
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
