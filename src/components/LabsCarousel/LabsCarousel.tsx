import { useEffect, useRef, useState } from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import SmoothImage from '../SmoothImage/SmoothImage';
import type { LabItem } from '../../pages/Admin/sections/ProgramsAdmin';

interface LabsCarouselProps {
  labs: LabItem[];
  navOffset: string;
  fallbackImage?: string;
  title?: string;
  description?: string;
}

export default function LabsCarousel({
  labs,
  navOffset,
  fallbackImage,
  title = 'Specialized Laboratories',
  description = 'Industry-aligned experimental facilities engineered for hands-on technical immersion, advanced computing, and multidisciplinary project incubation.',
}: LabsCarouselProps) {
  const labScrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLabsLeft, setCanScrollLabsLeft] = useState(false);
  const [canScrollLabsRight, setCanScrollLabsRight] = useState(true);
  const [activeLabIndex, setActiveLabIndex] = useState(0);
  const [labAutoPaused, setLabAutoPaused] = useState(false);
  const labResumeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const checkLabScroll = () => {
    const el = labScrollRef.current;
    if (!el) return;
    setCanScrollLabsLeft(el.scrollLeft > 10);
    setCanScrollLabsRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 10);
    if (el.clientWidth > 0) {
      setActiveLabIndex(Math.round(el.scrollLeft / el.clientWidth));
    }
  };

  useEffect(() => {
    const el = labScrollRef.current;
    if (!el) return;
    checkLabScroll();
    el.addEventListener('scroll', checkLabScroll, { passive: true });
    window.addEventListener('resize', checkLabScroll);
    return () => {
      el.removeEventListener('scroll', checkLabScroll);
      window.removeEventListener('resize', checkLabScroll);
    };
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      const el = labScrollRef.current;
      if (labAutoPaused || !el || el.scrollWidth <= el.clientWidth) return;
      if (el.scrollLeft >= el.scrollWidth - el.clientWidth - 10) {
        el.scrollTo({ left: 0, behavior: 'smooth' });
      } else {
        el.scrollBy({ left: el.clientWidth, behavior: 'smooth' });
      }
    }, 4500);
    return () => clearInterval(timer);
  }, [labAutoPaused]);

  const pauseLabAutoTemporarily = () => {
    setLabAutoPaused(true);
    if (labResumeTimeoutRef.current) clearTimeout(labResumeTimeoutRef.current);
    labResumeTimeoutRef.current = setTimeout(() => setLabAutoPaused(false), 6000);
  };
  const scrollLabsBy = (direction: 1 | -1) => {
    const el = labScrollRef.current;
    if (!el) return;
    pauseLabAutoTemporarily();
    el.scrollBy({ left: direction * el.clientWidth, behavior: 'smooth' });
  };
  const scrollToLabIndex = (index: number) => {
    const el = labScrollRef.current;
    if (!el) return;
    pauseLabAutoTemporarily();
    el.scrollTo({ left: index * el.clientWidth, behavior: 'smooth' });
  };

  if (labs.length === 0) return null;

  // Always render carousel. Use the first lab's imageUrl, or fallbackImage,
  // or a neutral placeholder so the layout stays consistent across departments.
  const defaultImage = '/images/lab-placeholder.svg';

  return (
    <section id="labs" className="dept-labs-section" style={{ scrollMarginTop: navOffset }}>
      <div className="container">
        <div className="dept-labs-header">
          <div className="dept-labs-title-wrap">
            <h2 className="section-title">{title}</h2>
            <p className="section-desc" style={{ margin: '0.5rem 0 0 0' }}>
              {description}
            </p>
          </div>
        </div>

        <div className="dept-lab-carousel">
          <div className="dept-lab-rows" ref={labScrollRef}>
            {labs.map((lab, li) => (
              <div key={li} className="dept-lab-slide">
<div className="dept-lab-slide-text">
                   <h3 className="dept-lab-slide-title">{lab.name}</h3>
                   {lab.description && (
                     <p className="dept-lab-slide-desc">{lab.description}</p>
                   )}
                   {lab.pdfUrl && (
                     <a href={lab.pdfUrl} target="_blank" rel="noopener noreferrer" className="dept-lab-slide-cta">
                       <span>Explore Lab</span>
                       <ArrowRight size={15} strokeWidth={2.5} />
                     </a>
                   )}
                 </div>
                <div className="dept-lab-slide-media">
                  {lab.videoUrl ? (
                    // preload="none" (no autoplay/muted) keeps the clip itself
                    // out of the network until a visitor actually presses
                    // play — the poster frame (existing image, or the same
                    // fallback the image path uses) is all that loads
                    // up-front, same cost as the plain <img> below.
                    <video
                      key={lab.videoUrl}
                      className="dept-lab-slide-img"
                      poster={lab.imageUrl || fallbackImage || defaultImage}
                      controls
                      preload="none"
                      playsInline
                    >
                      <source src={lab.videoUrl} />
                    </video>
                  ) : (
                    <SmoothImage
                      src={lab.imageUrl || fallbackImage || defaultImage}
                      alt={lab.name}
                      className="dept-lab-slide-img"
                      loading="lazy"
                      decoding="async"
                    />
                  )}
                </div>
              </div>
            ))}
          </div>

          {labs.length > 1 && (
            <div className="dept-lab-carousel-controls">
              <div className="dept-lab-carousel-dots" role="tablist" aria-label="Laboratory slides">
                {labs.map((lab, li) => (
                  <button
                    key={lab.name + li}
                    type="button"
                    role="tab"
                    aria-selected={activeLabIndex === li}
                    aria-label={`Show ${lab.name}`}
                    className={`dept-lab-dot${activeLabIndex === li ? ' active' : ''}`}
                    onClick={() => scrollToLabIndex(li)}
                  />
                ))}
              </div>
              <div className="dept-lab-carousel-arrows" role="group" aria-label="Laboratories carousel navigation">
                <button
                  type="button"
                  className="dept-lab-carousel-arrow-btn"
                  onClick={() => scrollLabsBy(-1)}
                  disabled={!canScrollLabsLeft}
                  aria-label="Previous laboratory"
                >
                  <ArrowLeft size={17} strokeWidth={2.4} />
                </button>
                <button
                  type="button"
                  className="dept-lab-carousel-arrow-btn"
                  onClick={() => scrollLabsBy(1)}
                  disabled={!canScrollLabsRight}
                  aria-label="Next laboratory"
                >
                  <ArrowRight size={17} strokeWidth={2.4} />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}