import { useEffect, useRef, useState } from 'react';
import './MarqueeText.css';

interface Props {
  text: string;
  className?: string;
}

/**
 * A single line of text that scrolls in place (same translateX(-50%)-of-a-
 * duplicated-copy technique as AnnouncementsTicker) only when it's actually
 * too wide for its container — e.g. a long Profile Section / Quick
 * Navigation pill label that would otherwise wrap and blow out the pill's
 * height. Short labels render as plain static text, unaffected.
 */
export default function MarqueeText({ text, className }: Props) {
  const outerRef = useRef<HTMLSpanElement>(null);
  const firstItemRef = useRef<HTMLSpanElement>(null);
  const [overflowing, setOverflowing] = useState(false);

  useEffect(() => {
    const check = () => {
      const outer = outerRef.current;
      const firstItem = firstItemRef.current;
      if (!outer || !firstItem) return;
      setOverflowing(firstItem.scrollWidth > outer.clientWidth + 1);
    };
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, [text]);

  return (
    <span ref={outerRef} className={`marquee-text${overflowing ? ' is-overflowing' : ''}${className ? ` ${className}` : ''}`}>
      <span className="marquee-text__track">
        <span ref={firstItemRef} className="marquee-text__item">{text}</span>
        {overflowing && <span className="marquee-text__item" aria-hidden="true">{text}</span>}
      </span>
    </span>
  );
}
