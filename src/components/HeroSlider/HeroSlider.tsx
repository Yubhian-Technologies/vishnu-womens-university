import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import './HeroSlider.css';

interface Slide {
  id: number;
  tag: string;
  heading: string;
  description: string;
  imageUrl: string;
  imageAlt: string;
  primaryCta: { label: string; path: string };
  secondaryCta: { label: string; path: string };
}

const slides: Slide[] = [
  {
    id: 1,
    tag: 'Welcome to VWU',
    heading: 'Empowering.\nWomen.\nThrough Tech.',
    description: 'At VWU, we are dedicated to empowering women with cutting-edge engineering education, world-class research, and industry-ready skills.',
    imageUrl: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=1920&q=80',
    imageAlt: 'Vishnu Womens University campus',
    primaryCta: { label: 'Schedule a Visit', path: '/admissions' },
    secondaryCta: { label: 'Apply Now', path: '/admissions' },
  },
  {
    id: 2,
    tag: 'Academics',
    heading: '9 B.Tech Programs\nBuilt for Your\nSuccess',
    description: 'From Computer Science to Civil Engineering — VWU offers comprehensive undergraduate, postgraduate, and doctoral programs with hands-on learning.',
    imageUrl: 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=1920&q=80',
    imageAlt: 'Students in an engineering laboratory',
    primaryCta: { label: 'Explore Programs', path: '/academics' },
    secondaryCta: { label: 'Request Info', path: '/admissions' },
  },
  {
    id: 3,
    tag: 'Campus Life',
    heading: 'Learn, Grow\nand Excel',
    description: "VWU is more than a college — it's a community where you discover your potential, build lifelong friendships, and become a leader in your field.",
    imageUrl: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=1920&q=80',
    imageAlt: 'Students celebrating at graduation',
    primaryCta: { label: 'Campus Life', path: '/student-life' },
    secondaryCta: { label: 'Apply Now', path: '/admissions' },
  },
  {
    id: 4,
    tag: 'Outstanding Placements',
    heading: '52 LPA\nHighest\nPlacement Package',
    description: 'With 1,400+ annual placements and a highest package of 52 LPA, VWU graduates lead in top companies across India and globally.',
    imageUrl: 'https://images.unsplash.com/photo-1571260899304-425eee4c7efc?w=1920&q=80',
    imageAlt: 'Students studying and collaborating',
    primaryCta: { label: 'Placement Records', path: '/about' },
    secondaryCta: { label: 'Our Story', path: '/about' },
  },
];

const recognitions = [
  { icon: '★', title: 'Top Engineering College', source: 'India Today Rankings' },
  { icon: '●', title: 'Best Engineering College', source: 'The Week Rankings' },
  { icon: '♦', title: 'NBA-DCP Accredited', source: 'National Board of Accreditation' },
  { icon: '▲', title: 'NIRF Ranked Institution', source: 'Ministry of Education' },
  { icon: '★', title: 'IEI Award for Excellence', source: 'Institution of Engineers India' },
];

const SLIDE_DURATION = 6000;

export default function HeroSlider() {
  const [current, setCurrent] = useState(0);
  const [progressWidth, setProgressWidth] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const goTo = useCallback((index: number) => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrent(index);
    setProgressWidth(0);
    setTimeout(() => setIsAnimating(false), 1000);
  }, [isAnimating]);

  const next = useCallback(() => {
    goTo((current + 1) % slides.length);
  }, [current, goTo]);

  const prev = useCallback(() => {
    goTo((current - 1 + slides.length) % slides.length);
  }, [current, goTo]);

  useEffect(() => {
    setProgressWidth(0);
    const timer = setTimeout(() => setProgressWidth(100), 50);
    return () => clearTimeout(timer);
  }, [current]);

  useEffect(() => {
    const interval = setInterval(next, SLIDE_DURATION);
    return () => clearInterval(interval);
  }, [next]);

  return (
    <section className="hero-slider" aria-label="Featured content">
      {slides.map((slide, i) => (
        <div
          key={slide.id}
          className={`slide${i === current ? ' active' : ''}`}
          aria-hidden={i !== current}
        >
          <img
            src={slide.imageUrl}
            alt={slide.imageAlt}
            className="slide-image"
            loading={i === 0 ? 'eager' : 'lazy'}
          />
          <div className="slide-overlay" />
          <div className="slide-content">
            <div className="slide-inner">
              <span className="slide-tag">{slide.tag}</span>
              <h1 className="slide-heading">
                {slide.heading.split('\n').map((line, j) => (
                  <span key={j}>{line}<br /></span>
                ))}
              </h1>
              <p className="slide-desc">{slide.description}</p>
              <div className="slide-actions">
                <Link to={slide.primaryCta.path} className="btn btn-accent btn-lg">
                  {slide.primaryCta.label}
                </Link>
                <Link to={slide.secondaryCta.path} className="btn btn-secondary btn-lg">
                  {slide.secondaryCta.label}
                </Link>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Controls */}
      <div className="hero-controls">
        <button className="hero-nav-btn" onClick={prev} aria-label="Previous slide">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        <div className="hero-dots" role="tablist" aria-label="Slide navigation">
          {slides.map((_, i) => (
            <button
              key={i}
              className={`hero-dot${i === current ? ' active' : ''}`}
              onClick={() => goTo(i)}
              role="tab"
              aria-selected={i === current}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
        <button className="hero-nav-btn" onClick={next} aria-label="Next slide">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path d="M9 18l6-6-6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>

      {/* Progress Bar */}
      <div className="hero-progress" aria-hidden="true">
        <div
          className="hero-progress-fill"
          style={{ width: `${progressWidth}%` }}
        />
      </div>

      {/* Scroll Indicator */}
      <div className="scroll-indicator" aria-hidden="true">
        <div className="scroll-indicator-line" />
        <span>Scroll</span>
      </div>

      {/* Recognition Bar */}
      <div className="hero-recognition" aria-label="Awards and recognitions">
        <div className="hero-recognition-inner">
          {recognitions.map((r, i) => (
            <div key={r.title} style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
              <div className="recognition-item">
                <div className="recognition-icon">{r.icon}</div>
                <div className="recognition-text">
                  <strong>{r.title}</strong>
                  <span>{r.source}</span>
                </div>
              </div>
              {i < recognitions.length - 1 && <div className="recognition-divider" />}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
