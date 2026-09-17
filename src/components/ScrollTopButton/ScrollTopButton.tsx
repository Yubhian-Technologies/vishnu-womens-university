import { useEffect, useState } from 'react';
import { ArrowUp } from 'lucide-react';
import './ScrollTopButton.css';

const RADIUS = 18;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;
const VISIBLE_AFTER_PX = 480;

export default function ScrollTopButton() {
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      const scrollTop = window.scrollY;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(max > 0 ? Math.min(1, scrollTop / max) : 0);
      setVisible(scrollTop > VISIBLE_AFTER_PX);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <button
      type="button"
      className={`scroll-top-btn${visible ? ' scroll-top-btn--visible' : ''}`}
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      aria-label="Back to top"
    >
      <svg viewBox="0 0 44 44" className="scroll-top-btn__ring">
        <circle cx="22" cy="22" r={RADIUS} className="scroll-top-btn__track" />
        <circle
          cx="22" cy="22" r={RADIUS}
          className="scroll-top-btn__progress"
          strokeDasharray={CIRCUMFERENCE}
          strokeDashoffset={CIRCUMFERENCE * (1 - progress)}
        />
      </svg>
      <ArrowUp size={16} className="scroll-top-btn__icon" />
    </button>
  );
}
