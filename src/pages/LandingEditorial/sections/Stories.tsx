import { useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { UNIVERSITY_STORIES } from '../landingEditorial.data';
import SmoothImage from '../../../components/SmoothImage/SmoothImage';
import Reveal from '../Reveal';

interface Props {
  images: Record<string, string>;
}

export default function Stories({ images }: Props) {
  const trackRef = useRef<HTMLDivElement>(null);
  const scrollBy = (dir: 1 | -1) => trackRef.current?.scrollBy({ left: dir * 420, behavior: 'smooth' });

  return (
    <section className="lpe-section lpe-section--dim" aria-label="University stories">
      <div className="lpe-container">
        <div className="lpe-section-head">
          <Reveal index={0}>
            <span className="lpe-eyebrow">University Stories</span>
            <h2 className="lpe-h2">Every story here<br /><span className="lpe-italic">is someone&rsquo;s milestone.</span></h2>
          </Reveal>
          <Reveal index={1} className="lpe-alumni-nav">
            <button onClick={() => scrollBy(-1)} aria-label="Previous story"><ChevronLeft size={20} /></button>
            <button onClick={() => scrollBy(1)} aria-label="Next story"><ChevronRight size={20} /></button>
          </Reveal>
        </div>
      </div>

      {/* Bleeds past the container edge, Stanford's horizontal "story rail" pattern */}
      <div className="lpe-stories-track" ref={trackRef}>
        {UNIVERSITY_STORIES.map((s, i) => (
          <Reveal key={s.eyebrow} index={i} variant="media" className="lpe-card lpe-stories-track__card">
            <div className="lpe-card__media">
              <SmoothImage src={images[s.imageSlot]} alt={s.title} loading="lazy" />
              <span className="lpe-card__tag">{s.eyebrow}</span>
            </div>
            <div className="lpe-card__body">
              <h3 className="lpe-card__title">{s.title}</h3>
              <p className="lpe-card__desc">{s.teaser}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
