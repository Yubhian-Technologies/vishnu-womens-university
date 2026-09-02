import { useRef, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight, ChevronRight, Award, Briefcase } from 'lucide-react';
import type { FacultyDoc } from '../../pages/Academics/Faculty';
import SmoothImage from '../SmoothImage/SmoothImage';
import './FacultyCarousel.css';

interface FacultyCarouselProps {
  faculty: FacultyDoc[];
  departmentName?: string;
  title?: string;
  viewMoreLink?: string;
}

function getInitials(name: string) {
  const cleaned = name.replace(/\b(Dr|Sri|Prof|Mr|Mrs|Ms)\.?\s*/gi, '');
  const parts = cleaned.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return 'FA';
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

function getFacultySummary(f: FacultyDoc, departmentName?: string) {
  const expFact = f.facts?.find((x) => /experience/i.test(x.label))?.value;
  const specFact = f.facts?.find((x) => /specialization|interest|area/i.test(x.label))?.value;
  const pubFact = f.facts?.find((x) => /publication|paper/i.test(x.label))?.value;
  const bioSection = f.sections?.find((s) => /summary|bio|about|profile/i.test(s.title));
  const bioParagraph = bioSection?.blocks?.find((b) => b.type === 'paragraph')?.text;

  let summaryText = '';
  if (bioParagraph) {
    summaryText = bioParagraph.slice(0, 150).trim() + (bioParagraph.length > 150 ? '...' : '');
  } else if (f.specialization) {
    summaryText = f.specialization;
  } else if (specFact) {
    summaryText = specFact;
  } else if (f.qualification) {
    summaryText = `${f.qualification} in ${f.department || departmentName || 'Engineering'}`;
  } else {
    summaryText = `Academician in ${f.department || departmentName || 'the department'}`;
  }

  return {
    experience: expFact,
    specialization: f.specialization || specFact,
    qualification: f.qualification,
    publications: pubFact,
    summaryText,
  };
}

export default function FacultyCarousel({
  faculty,
  departmentName,
  title = 'Learn from our impactful faculty',
  viewMoreLink = '/faculty',
}: FacultyCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [isPaused, setIsPaused] = useState(false);
  const resumeTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const checkScroll = () => {
    if (!scrollRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
    setCanScrollLeft(scrollLeft > 10);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 15);
  };

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    checkScroll();
    el.addEventListener('scroll', checkScroll, { passive: true });
    window.addEventListener('resize', checkScroll);
    return () => {
      el.removeEventListener('scroll', checkScroll);
      window.removeEventListener('resize', checkScroll);
    };
  }, [faculty]);

  const getCardStep = () => {
    if (!scrollRef.current) return 320;
    const firstCard = scrollRef.current.querySelector('.faculty-impact-card-wrapper') as HTMLElement | null;
    if (firstCard) {
      return firstCard.offsetWidth + 20;
    }
    return scrollRef.current.clientWidth / 4;
  };

  // Autoscroll timer effect
  useEffect(() => {
    if (!faculty || faculty.length <= 1) return;

    const timer = setInterval(() => {
      if (isPaused || !scrollRef.current) return;

      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      const step = getCardStep();

      if (scrollLeft >= scrollWidth - clientWidth - 25) {
        // Smoothly loop back to start
        scrollRef.current.scrollTo({ left: 0, behavior: 'smooth' });
      } else {
        scrollRef.current.scrollBy({ left: step, behavior: 'smooth' });
      }
    }, 4000);

    return () => clearInterval(timer);
  }, [faculty, isPaused]);

  const pauseTemporarily = () => {
    setIsPaused(true);
    if (resumeTimeoutRef.current) clearTimeout(resumeTimeoutRef.current);
    resumeTimeoutRef.current = setTimeout(() => {
      setIsPaused(false);
    }, 5000);
  };

  const scrollBy = (direction: number) => {
    if (!scrollRef.current) return;
    pauseTemporarily();
    const step = getCardStep();
    scrollRef.current.scrollBy({ left: direction * step, behavior: 'smooth' });
  };

  if (!faculty || faculty.length === 0) return null;

  return (
    <section
      className="faculty-impact-section"
      aria-label={title}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={() => setIsPaused(true)}
      onTouchEnd={() => pauseTemporarily()}
    >
      <div className="faculty-impact-container">
        {/* Top Header Bar */}
        <div className="faculty-impact-header">
          <h2 className="faculty-impact-title">{title}</h2>

          <div className="faculty-impact-controls">
            <Link to={viewMoreLink} className="faculty-impact-view-more">
              View more
            </Link>

            <div className="faculty-impact-arrows" role="group" aria-label="Carousel navigation">
              <button
                type="button"
                className="faculty-impact-arrow-btn"
                onClick={() => scrollBy(-1)}
                disabled={!canScrollLeft}
                aria-label="Scroll faculty left"
              >
                <ArrowLeft size={19} strokeWidth={2.4} />
              </button>

              <button
                type="button"
                className="faculty-impact-arrow-btn"
                onClick={() => scrollBy(1)}
                disabled={!canScrollRight}
                aria-label="Scroll faculty right"
              >
                <ArrowRight size={19} strokeWidth={2.4} />
              </button>
            </div>
          </div>
        </div>

        {/* Horizontal Carousel Track with Unclipped End Spacing */}
        <div
          ref={scrollRef}
          className="faculty-impact-track"
          tabIndex={0}
          role="region"
          aria-label="Faculty cards carousel"
        >
          {faculty.map((f) => {
            const summary = getFacultySummary(f, departmentName);

            return (
              <div key={f.id} className="faculty-impact-card-wrapper">
                {/* Entire Card in Circular White Background */}
                <div className="faculty-impact-card">
                  {/* Portrait Photo Frame */}
                  <Link to={`/faculty/${f.id}`} className="faculty-impact-photo-frame" aria-label={`View ${f.name} profile`}>
                    {f.imageUrl ? (
                      <SmoothImage
                        src={f.imageUrl}
                        alt={f.name}
                        className="faculty-impact-photo"
                      />
                    ) : (
                      <div className="faculty-impact-avatar-fallback">
                        <span className="faculty-impact-initials">{getInitials(f.name)}</span>
                      </div>
                    )}
                  </Link>

                  {/* Info inside White Card */}
                  <div className="faculty-impact-info">
                    {/* Faculty Name & Designation */}
                    <div className="faculty-impact-heading-group">
                      <h3 className="faculty-impact-name">
                        <Link to={`/faculty/${f.id}`} className="faculty-impact-name-link">
                          {f.name}
                        </Link>
                      </h3>
                      <p className="faculty-impact-meta">{f.designation}</p>
                    </div>

                    {/* Professional Badges */}
                    <div className="faculty-impact-badges">
                      {summary.qualification && (
                        <span className="faculty-impact-badge qual-badge">
                          <Award size={11} strokeWidth={2.5} />
                          <span>{summary.qualification}</span>
                        </span>
                      )}
                      {summary.experience && (
                        <span className="faculty-impact-badge exp-badge">
                          <Briefcase size={11} strokeWidth={2.5} />
                          <span>{summary.experience}</span>
                        </span>
                      )}
                    </div>

                    {/* Real Professional Summary / Area */}
                    <div className="faculty-impact-summary-wrap">
                      <span className="faculty-impact-summary-label">Area of Expertise</span>
                      <p className="faculty-impact-bio">{summary.summaryText}</p>
                    </div>

                    {/* View Full Profile Action Button with Arrow Circle */}
                    <div className="faculty-impact-footer">
                      <Link to={`/faculty/${f.id}`} className="faculty-card-profile-btn">
                        <span>View Full Profile</span>
                        <span className="faculty-btn-arrow-circle">
                          <ChevronRight size={13} strokeWidth={2.4} />
                        </span>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

