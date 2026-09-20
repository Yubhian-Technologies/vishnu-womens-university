import { useRef, useState, useEffect } from 'react';
import { Trophy, Award, Sparkles, Star, Zap, ChevronLeft, ChevronRight, GraduationCap } from 'lucide-react';
import { useOrderedCollection } from '../../hooks/useCollection';
import type { StudentAchievementDoc } from '../Admin/sections/NewsAwardsDataAdmin';
import './ScrollingAchievements.css';

export interface StudentAchievementItem {
  id: string;
  studentName: string;
  achievementTitle: string;
  department: string;
  category: string;
  badge?: string;
  year?: string;
  image?: string;
  icon?: 'trophy' | 'award' | 'star' | 'sparkles' | 'zap' | 'grad';
}

const renderIcon = (type?: string) => {
  switch (type) {
    case 'trophy':
      return <Trophy size={14} className="ach-icon" />;
    case 'star':
      return <Star size={14} className="ach-icon" />;
    case 'sparkles':
      return <Sparkles size={14} className="ach-icon" />;
    case 'zap':
      return <Zap size={14} className="ach-icon" />;
    case 'grad':
      return <GraduationCap size={14} className="ach-icon" />;
    default:
      return <Award size={14} className="ach-icon" />;
  }
};

export default function ScrollingAchievements() {
  const { docs: liveStudentAchievements } = useOrderedCollection<StudentAchievementDoc>('studentAchievements', 'order');
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
  const [isPaused, setIsPaused] = useState(false);
  const autoScrollTimer = useRef<number | null>(null);

  // Purely dynamic: only display items that admin has added
  const items: StudentAchievementItem[] = (liveStudentAchievements || []).map((a) => ({
    id: a.id,
    studentName: a.studentName,
    achievementTitle: a.achievementTitle,
    department: a.department || '',
    category: a.category || '',
    badge: a.badge || a.year || '',
    year: a.year || '',
    image: a.imageUrl || '',
    icon: /hackathon|prize|cup|winner/i.test(a.achievementTitle)
      ? 'trophy'
      : /patent|research/i.test(a.achievementTitle)
      ? 'grad'
      : 'award',
  }));

  // Gentle, slow auto-scrolling
  useEffect(() => {
    const el = scrollContainerRef.current;
    if (!el || items.length === 0) return;

    let lastTime = performance.now();
    const speed = 26; // pixels per second

    const step = (time: number) => {
      const delta = (time - lastTime) / 1000;
      lastTime = time;

      if (!isPaused && el) {
        el.scrollLeft += speed * delta;
        // Wrap around seamlessly if duplicated
        if (el.scrollLeft >= el.scrollWidth / 2 && el.scrollWidth > el.clientWidth) {
          el.scrollLeft -= el.scrollWidth / 2;
        }
      }
      autoScrollTimer.current = requestAnimationFrame(step);
    };

    autoScrollTimer.current = requestAnimationFrame(step);

    return () => {
      if (autoScrollTimer.current) {
        cancelAnimationFrame(autoScrollTimer.current);
      }
    };
  }, [isPaused, items.length]);

  const handlePrev = () => {
    const el = scrollContainerRef.current;
    if (!el) return;
    setIsPaused(true);
    el.scrollBy({ left: -380, behavior: 'smooth' });
    setTimeout(() => setIsPaused(false), 3500);
  };

  const handleNext = () => {
    const el = scrollContainerRef.current;
    if (!el) return;
    setIsPaused(true);
    el.scrollBy({ left: 380, behavior: 'smooth' });
    setTimeout(() => setIsPaused(false), 3500);
  };

  // If no achievements are added by admin yet, do not render placeholder/dummy items
  if (items.length === 0) {
    return null;
  }

  return (
    <div
      className="hero-achievements-ticker"
      aria-label="Achievements Showcase"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={() => setIsPaused(true)}
      onTouchEnd={() => setTimeout(() => setIsPaused(false), 2500)}
    >
      <div className="ach-marquee-wrapper">
        <div className="ach-scroll-container" ref={scrollContainerRef}>
          {/* Main loop of added achievements: starts exactly aligned with Explore Gallery button */}
          {items.map((item, idx) => (
            <div
              key={`ach-item-1-${item.id}-${idx}`}
              className="ach-card"
              title={`${item.studentName} - ${item.achievementTitle}`}
            >
              {item.image && (
                <div className="ach-card-thumb-wrap">
                  <img
                    src={item.image}
                    alt={item.studentName}
                    className="ach-card-thumb"
                    loading="lazy"
                  />
                  <span className="ach-card-icon-pill">
                    {renderIcon(item.icon)}
                  </span>
                </div>
              )}
              <div className="ach-card-body">
                {(item.category || item.badge) && (
                  <div className="ach-card-top">
                    {item.category && <span className="ach-card-category">{item.category}</span>}
                    {item.badge && <span className="ach-card-badge">{item.badge}</span>}
                  </div>
                )}
                <div className="ach-card-student-name">{item.studentName}</div>
                <div className="ach-card-highlight">{item.achievementTitle}</div>
                {item.department && <div className="ach-card-dept">{item.department}</div>}
              </div>
            </div>
          ))}

          {/* Duplicate loop for seamless infinite scrolling when multiple items exist */}
          {items.length > 1 && items.map((item, idx) => (
            <div
              key={`ach-item-2-${item.id}-${idx}`}
              className="ach-card"
              aria-hidden="true"
              title={`${item.studentName} - ${item.achievementTitle}`}
            >
              {item.image && (
                <div className="ach-card-thumb-wrap">
                  <img
                    src={item.image}
                    alt={item.studentName}
                    className="ach-card-thumb"
                    loading="lazy"
                  />
                  <span className="ach-card-icon-pill">
                    {renderIcon(item.icon)}
                  </span>
                </div>
              )}
              <div className="ach-card-body">
                {(item.category || item.badge) && (
                  <div className="ach-card-top">
                    {item.category && <span className="ach-card-category">{item.category}</span>}
                    {item.badge && <span className="ach-card-badge">{item.badge}</span>}
                  </div>
                )}
                <div className="ach-card-student-name">{item.studentName}</div>
                <div className="ach-card-highlight">{item.achievementTitle}</div>
                {item.department && <div className="ach-card-dept">{item.department}</div>}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Directional navigation controls placed at the right side */}
      <div className="ach-ticker-controls">
        <button
          type="button"
          className="ach-arrow-btn ach-arrow-btn--prev"
          onClick={handlePrev}
          aria-label="Scroll achievements left"
          title="Previous"
        >
          <ChevronLeft size={18} />
        </button>
        <button
          type="button"
          className="ach-arrow-btn ach-arrow-btn--next"
          onClick={handleNext}
          aria-label="Scroll achievements right"
          title="Next"
        >
          <ChevronRight size={18} />
        </button>
      </div>
    </div>
  );
}
