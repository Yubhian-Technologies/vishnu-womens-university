import { useRef, useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight, ChevronRight, Award, Briefcase } from 'lucide-react';
import type { FacultyDoc } from '../../pages/Academics/Faculty';
import SmoothImage from '../SmoothImage/SmoothImage';
import { smoothScrollTo } from '../../lib/smoothScroll';
import './FacultyCarousel.css';

// Set on the page's own history entry when a faculty profile is opened from
// this carousel, so pressing Back returns to the Faculty section instead of
// the top of the page. The page re-loads its Firestore content on return —
// too late for the browser's own scroll restoration (turned off site-wide in
// App.tsx's RouteScrollReset anyway) — so the carousel restores it itself.
const RETURN_FLAG = 'vwuFacultyCarouselReturn';

function markFacultyReturn(facultyId: string) {
  try {
    window.history.replaceState({ ...(window.history.state ?? {}), [RETURN_FLAG]: true }, '');
  } catch { /* history unavailable — Back just behaves as before */ }
  // Remembers the exact page (e.g. /academics/cse, not just "some CSE
  // programme") this profile was opened from, for the profile page's
  // "Back to … Faculty" button — see facultyReturnPath in FacultyProfile.tsx.
  try {
    sessionStorage.setItem(`vwu:faculty-return:${facultyId}`, window.location.pathname);
  } catch { /* storage unavailable — the button falls back to the department's page */ }
}

// The faculty profile page's "Back to … Faculty" link sets the same flag as
// React Router link state, which lands under history.state.usr.
function hasFacultyReturn(): boolean {
  const state = window.history.state;
  return !!(state?.[RETURN_FLAG] || state?.usr?.[RETURN_FLAG]);
}

function clearFacultyReturn() {
  try {
    const state = window.history.state;
    if (!state?.[RETURN_FLAG] && !state?.usr?.[RETURN_FLAG]) return;
    const rest = { ...state };
    delete rest[RETURN_FLAG];
    if (rest.usr && typeof rest.usr === 'object') {
      rest.usr = { ...rest.usr };
      delete rest.usr[RETURN_FLAG];
    }
    window.history.replaceState(rest, '');
  } catch { /* ignore */ }
}

interface FacultyCarouselProps {
  faculty: FacultyDoc[];
  departmentName?: string;
  title?: string;
  viewMoreLink?: string;
  autoScrollInterval?: number;
}

function getInitials(name: string) {
  const cleaned = name.replace(/\b(Dr|Sri|Prof|Mr|Mrs|Ms)\.?\s*/gi, '');
  const parts = cleaned.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return 'FA';
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

function getFacultySummary(f: FacultyDoc) {
  const expFact = f.facts?.find((x) => /experience/i.test(x.label))?.value;
  const specFact = f.facts?.find((x) => /specialization|interest|area/i.test(x.label))?.value;
  const pubFact = f.facts?.find((x) => /publication|paper/i.test(x.label))?.value;

  return {
    experience: expFact,
    specialization: f.specialization || specFact,
    qualification: f.qualification,
    publications: pubFact,
  };
}

export default function FacultyCarousel({
  faculty,
  departmentName: _,
  title = 'Learn from our impactful faculty',
  viewMoreLink = '/faculty',
  autoScrollInterval = 2000,
}: FacultyCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isPaused, setIsPaused] = useState(false);
  const resumeTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const sectionRef = useRef<HTMLElement>(null);
  // Read once at mount (not inside the effect) so React.StrictMode's dev-only
  // effect double-run can't consume the flag on the first pass.
  const returningRef = useRef<boolean>(hasFacultyReturn());
  const hasFaculty = !!faculty && faculty.length > 0;

  // Back from a faculty profile → scroll to this carousel's section (the
  // page's id="faculty" wrapper, so its scroll-margin clears the sticky
  // header). Sections above keep loading from Firestore after this mounts and
  // push it further down, so its position is re-checked every frame and
  // corrected, for up to 6s, and abandoned the moment the visitor scrolls,
  // taps, clicks or presses a key themselves.
  useEffect(() => {
    if (!hasFaculty || !returningRef.current) return;
    clearFacultyReturn();
    const target = sectionRef.current?.closest<HTMLElement>('[id]') ?? sectionRef.current;
    if (!target) return;

    const interactionEvents = ['wheel', 'touchstart', 'keydown', 'mousedown'] as const;
    let raf = 0;
    const check = () => {
      const margin = parseFloat(getComputedStyle(target).scrollMarginTop) || 0;
      const offBy = target.getBoundingClientRect().top - margin;
      if (Math.abs(offBy) > 2) smoothScrollTo(Math.max(0, window.scrollY + offBy), { immediate: true });
      raf = requestAnimationFrame(check);
    };
    raf = requestAnimationFrame(check);

    const cleanup = () => {
      cancelAnimationFrame(raf);
      clearTimeout(timer);
      interactionEvents.forEach((e) => window.removeEventListener(e, stop));
    };
    function stop() {
      returningRef.current = false;
      cleanup();
    }
    const timer = setTimeout(stop, 6000);
    interactionEvents.forEach((e) => window.addEventListener(e, stop, { passive: true }));
    return cleanup;
  }, [hasFaculty]);

  // Circular Array Data Structure: Triplicate faculty list so the last card connects
  // directly to the first card seamlessly without any sudden revert/rewind to start.
  const displayItems = useMemo(() => {
    if (!faculty || faculty.length === 0) return [];
    if (faculty.length === 1) return faculty;
    return [...faculty, ...faculty, ...faculty];
  }, [faculty]);

  // Set initial scroll position to the start of the middle set
  useEffect(() => {
    const el = scrollRef.current;
    if (!el || !faculty || faculty.length <= 1) return;
    const initialPosition = el.scrollWidth / 3;
    el.scrollLeft = initialPosition;
  }, [faculty]);

  // Seamless circular array modulo scroll listener
  useEffect(() => {
    const el = scrollRef.current;
    if (!el || !faculty || faculty.length <= 1) return;

    const handleScroll = () => {
      const { scrollLeft, scrollWidth } = el;
      const singleSetWidth = scrollWidth / 3;

      // Instantaneous modulo shift (invisible to user) when crossing set boundaries
      if (scrollLeft >= 2 * singleSetWidth - 10) {
        el.scrollLeft -= singleSetWidth;
      } else if (scrollLeft <= 10) {
        el.scrollLeft += singleSetWidth;
      }
    };

    el.addEventListener('scroll', handleScroll, { passive: true });
    return () => el.removeEventListener('scroll', handleScroll);
  }, [faculty]);

  const getCardStep = () => {
    if (!scrollRef.current) return 240;
    const firstCard = scrollRef.current.querySelector('.faculty-impact-card-wrapper') as HTMLElement | null;
    if (firstCard) {
      return firstCard.offsetWidth + 14;
    }
    return scrollRef.current.clientWidth / 5;
  };

  // Continuous autoscroll loop
  useEffect(() => {
    if (!faculty || faculty.length <= 1) return;

    const timer = setInterval(() => {
      if (isPaused || !scrollRef.current) return;
      const step = getCardStep();
      scrollRef.current.scrollBy({ left: step, behavior: 'smooth' });
    }, autoScrollInterval);

    return () => clearInterval(timer);
  }, [faculty, isPaused, autoScrollInterval]);

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
      ref={sectionRef}
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
                aria-label="Scroll faculty left"
              >
                <ArrowLeft size={19} strokeWidth={2.4} />
              </button>

              <button
                type="button"
                className="faculty-impact-arrow-btn"
                onClick={() => scrollBy(1)}
                aria-label="Scroll faculty right"
              >
                <ArrowRight size={19} strokeWidth={2.4} />
              </button>
            </div>
          </div>
        </div>

        {/* Horizontal Carousel Track with Infinite Circular Buffer */}
        <div
          ref={scrollRef}
          className="faculty-impact-track"
          tabIndex={0}
          role="region"
          aria-label="Faculty cards carousel"
        >
          {displayItems.map((f, idx) => {
            const summary = getFacultySummary(f);

            return (
              <div key={`${f.id}-${idx}`} className="faculty-impact-card-wrapper">
                {/* Entire Card in Circular White Background */}
                <div className="faculty-impact-card">
                  {/* Portrait Photo Frame */}
                  <Link to={`/faculty/${f.id}`} onClick={() => markFacultyReturn(f.id)} className="faculty-impact-photo-frame" aria-label={`View ${f.name} profile`}>
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
                        <Link to={`/faculty/${f.id}`} onClick={() => markFacultyReturn(f.id)} className="faculty-impact-name-link">
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



                    {/* View Full Profile Action Button with Arrow Circle */}
                    <div className="faculty-impact-footer">
                      <Link to={`/faculty/${f.id}`} onClick={() => markFacultyReturn(f.id)} className="faculty-card-profile-btn">
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

