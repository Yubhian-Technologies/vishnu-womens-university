import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Laptop, Presentation, Check, Clock, MapPin } from 'lucide-react';
import HeroSlider from '../../components/HeroSlider/HeroSlider';
import CounterSection from '../../components/CounterSection/CounterSection';
import NewsCard from '../../components/NewsCard/NewsCard';
import { useOrderedCollection } from '../../hooks/useCollection';
import { useContentBlocks } from '../../hooks/useContentBlocks';
import { resolveContentIcon } from '../../lib/contentIcons';
import { type NewsDoc, newsDocToArticle } from '../../lib/news';
import type { EventDoc } from '../Admin/sections/EventsAdmin';
import './Home.css';

/* ── Data ─────────────────────────────────────────────────── */
const STUDY_CARD_IMAGES = [
  { image: 'https://images.unsplash.com/photo-1498243691581-b145c3f54a5a?w=800&q=80', alt: 'Students in engineering classroom', color: '#1b4332' },
  { image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&q=80', alt: 'Postgraduate students', color: '#2d6a4f' },
  { image: 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=800&q=80', alt: 'Research laboratory', color: '#40916c' },
];

const activityItems = [
  { img: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=600&q=80', label: 'mBAJA SAEINDIA 2026 Win' },
  { img: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=600&q=80', label: 'Amazon AFE Internship' },
  { img: 'https://images.unsplash.com/photo-1498243691581-b145c3f54a5a?w=600&q=80', label: 'Technova2026 Symposium' },
  { img: 'https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=600&q=80', label: '8th Graduation Day' },
  { img: 'https://images.unsplash.com/photo-1607237138185-eedd9c632b0b?w=600&q=80', label: 'IEI Award for Excellence' },
  { img: 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=600&q=80', label: 'Space Application Center' },
];

/* ── Tilt Hook ────────────────────────────────────────────── */
function useTilt(strength = 12) {
  const ref = useRef<HTMLDivElement>(null);
  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width  - 0.5) * strength;
    const y = ((e.clientY - rect.top)  / rect.height - 0.5) * -strength;
    el.style.transform = `perspective(800px) rotateX(${y}deg) rotateY(${x}deg) translateY(-6px)`;
  };
  const onLeave = () => {
    if (ref.current) ref.current.style.transform = '';
  };
  return { ref, onMouseMove: onMove, onMouseLeave: onLeave };
}

/* ── Magnetic Button ──────────────────────────────────────── */
function MagneticBtn({ children, to, className }: { children: React.ReactNode; to: string; className: string }) {
  const ref = useRef<HTMLAnchorElement>(null);
  const onMove = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = (e.clientX - rect.left - rect.width  / 2) * 0.35;
    const y = (e.clientY - rect.top  - rect.height / 2) * 0.35;
    el.style.transform = `translate(${x}px, ${y}px)`;
  };
  const onLeave = () => { if (ref.current) ref.current.style.transform = ''; };
  return (
    <Link ref={ref} to={to} className={className} onMouseMove={onMove} onMouseLeave={onLeave}>
      {children}
    </Link>
  );
}

/* ── Wave Divider ─────────────────────────────────────────── */
function Wave({ flip = false, fill = '#f7f8fb' }: { flip?: boolean; fill?: string }) {
  return (
    <div className={`wave-divider${flip ? ' wave-divider--flip' : ''}`}>
      <svg viewBox="0 0 1440 60" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M0,30 C360,60 1080,0 1440,30 L1440,60 L0,60 Z" fill={fill} />
      </svg>
    </div>
  );
}

/* ── Component ────────────────────────────────────────────── */
export default function Home() {
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [tagHovered, setTagHovered] = useState<number | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const { docs: newsItems } = useOrderedCollection<NewsDoc>('news', 'date', 'desc');
  const featuredNews = newsItems.filter(n => n.featured).slice(0, 3);
  const { docs: allEvents } = useOrderedCollection<EventDoc>('events', 'order');
  const featuredEvents = allEvents.filter(e => e.featured).slice(0, 4);
  const recognitions = useContentBlocks('home', 'recognitions');
  const campusFeatures = useContentBlocks('home', 'campusFeatures');
  const testimonials = useContentBlocks('home', 'testimonials');
  const studyCards = useContentBlocks('home', 'studyCards');
  const popularPrograms = useContentBlocks('home', 'popularPrograms');

  useEffect(() => {
    document.title = 'VWU | Empowering Women Through Knowledge and Action';

    // Scroll reveal
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const el = entry.target as HTMLElement;
            const delay = el.dataset.delay || '0';
            setTimeout(() => el.classList.add('revealed'), parseInt(delay));
            observer.unobserve(el);
          }
        });
      },
      { threshold: 0.08 }
    );
    document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale, .reveal-bounce, .reveal-zoom').forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  // Re-run reveal for news cards once Firestore data arrives (they don't exist at initial mount)
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const el = entry.target as HTMLElement;
            const delay = el.dataset.delay || '0';
            setTimeout(() => el.classList.add('revealed'), parseInt(delay));
            observer.unobserve(el);
          }
        });
      },
      { threshold: 0.08 }
    );
    document.querySelectorAll('.news-grid .reveal-bounce').forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, [featuredNews]);

  // Testimonial auto-advance (re-armed once Firestore testimonials arrive)
  useEffect(() => {
    if (testimonials.length === 0) return;
    timerRef.current = setInterval(() => setActiveTestimonial(p => (p + 1) % testimonials.length), 5000);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [testimonials.length]);

  const tilt1 = useTilt(10);
  const tilt2 = useTilt(10);
  const tilt3 = useTilt(10);
  const tilts = [tilt1, tilt2, tilt3];

  return (
    <main className="home-page">

      {/* ── Hero Slider ── */}
      <HeroSlider />

      {/* ── Activity Scroll Strip ── */}
      <div className="activity-strip">
        <div className="activity-strip-label">Recent<br />Activities</div>
        <div className="activity-track-wrap">
          <div className="activity-track">
            {[...activityItems, ...activityItems].map((item, i) => (
              <div key={i} className="activity-card">
                <img src={item.img} alt={item.label} className="activity-card-img" loading="lazy" />
                <div className="activity-card-label">{item.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Counter Stats ── */}
      <CounterSection />

      {/* ── Study at VWU ── */}
      <section className="study-section section">
        {/* floating shapes */}
        <div className="floating-shapes" aria-hidden="true">
          <div className="shape shape--circle shape--1" />
          <div className="shape shape--ring shape--2" />
          <div className="shape shape--dot-grid shape--3" />
        </div>
        <div className="container">
          <div className="study-intro reveal">
            <span className="section-label">Academics</span>
            <h2 className="section-title gradient-text">Study at VWU</h2>
            <p className="section-desc">Your education at VWU is personalized, industry-focused, and structured to develop your technical depth, leadership capacity, and innovative thinking.</p>
          </div>
          <div className="study-grid">
            {studyCards.map((card, i) => {
              const Icon = resolveContentIcon(card.icon) || Laptop;
              const visuals = STUDY_CARD_IMAGES[i % STUDY_CARD_IMAGES.length];
              return (
                <div
                  key={card.id}
                  className="study-card"
                  {...tilts[i]}
                  style={{ '--card-color': visuals.color } as React.CSSProperties}
                >
                  <div className="study-card-image-wrap">
                    <img src={visuals.image} alt={visuals.alt} className="study-card-image" loading="lazy" />
                    <div className="study-card-overlay" style={{ background: `linear-gradient(to top, ${visuals.color}cc 0%, transparent 65%)` }} />
                    <div className="study-card-icon"><Icon size={24} strokeWidth={1.75} color="var(--color-primary-dark)" /></div>
                    <div className="study-card-shine" />
                  </div>
                  <div className="study-card-body">
                    <h3 className="study-card-title">{card.title}</h3>
                    <p className="study-card-desc">{card.desc}</p>
                    <Link to={card.slug || '/academics'} className="study-card-link">
                      {card.value}
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>

          <div>
            <p className="program-label">Popular Programs</p>
            <div className="study-programs">
              {popularPrograms.map((p, i) => (
                <Link
                  to="/academics"
                  key={p.id}
                  className={`program-tag${tagHovered === i ? ' program-tag--active' : ''}`}
                  onMouseEnter={() => setTagHovered(i)}
                  onMouseLeave={() => setTagHovered(null)}
                  style={{ transitionDelay: `${i * 30}ms` } as React.CSSProperties}
                >
                  {p.title}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      <Wave fill="var(--color-primary)" />

      {/* ── Campus Life ── */}
      <section className="campus-section" aria-label="Campus Life">
        <div className="campus-image-side reveal-left">
          <img src="https://images.unsplash.com/photo-1607237138185-eedd9c632b0b?w=1000&q=80" alt="VWU campus life" className="campus-image" loading="lazy" />
          <div className="campus-image-overlay" />
          <div className="campus-image-badge reveal-scale" data-delay="300">
            <span className="campus-badge-num">100+</span>
            <span className="campus-badge-lbl">Acre Campus</span>
          </div>
        </div>
        <div className="campus-content-side">
          <div className="reveal-right">
            <span className="section-label">Student Life</span>
            <h2>Learn, Grow<br /><span className="text-accent">and Excel</span></h2>
            <p>Belonging matters. At VWU, every student finds her footing in a community that genuinely supports her growth — academically, personally, and professionally.</p>
            <div className="campus-features">
              {campusFeatures.map((f, i) => (
                <div key={f.id} className="campus-feature" style={{ animationDelay: `${i * 60}ms` }}>
                  <span className="campus-feature-check"><Check size={14} strokeWidth={2.5} /></span>
                  {f.title}
                </div>
              ))}
            </div>
            <MagneticBtn to="/student-life" className="btn btn-accent btn-lg magnetic-btn">
              Explore Campus Life ↗
            </MagneticBtn>
          </div>
        </div>
      </section>

      <Wave flip fill="var(--color-white)" />

      {/* ── Mission ── */}
      <section className="mission-section section">
        <div className="container">
          <div className="mission-grid">
            <div className="mission-content reveal-left">
              <span className="section-label">Our Purpose</span>
              <h2 className="section-title">Driven by<br /><span className="gradient-text">Excellence</span></h2>
              <div className="divider" />
              <p>Vishnu Womens University is committed to providing women with rigorous technical education, cultivating a spirit of innovation, and producing graduates who contribute meaningfully to society and industry.</p>
              <p>Founded under the Sri Vishnu Educational Society and affiliated to JNTUK, VWU has been developing engineers, researchers, and leaders for over two decades from its campus in Bhimavaram, Andhra Pradesh.</p>
              <div className="mission-quote">
                <blockquote>"VWU gave me the technical grounding and the self-belief to pursue my ambitions. The faculty are genuinely invested in your success — every step of the way."</blockquote>
                <cite>— Priya, CSE Graduate, placed at Amazon</cite>
              </div>
              <MagneticBtn to="/about" className="btn btn-primary magnetic-btn">Learn More About VWU</MagneticBtn>
            </div>
            <div className="mission-image-grid reveal-right">
              {[
                'https://images.unsplash.com/photo-1571260899304-425eee4c7efc?w=800&q=80',
                'https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=800&q=80',
                'https://images.unsplash.com/photo-1523580494863-6f3031224c94?w=800&q=80',
              ].map((src, i) => (
                <div key={src} className={`mission-img mission-img--${i}`}>
                  <img src={src} alt="VWU campus" loading="lazy" />
                  <div className="mission-img-overlay" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Recognition ── */}
      <section className="recognition-section">
        <div className="container">
          <div className="recognition-header reveal">
            <span className="section-label">Nationally Recognized</span>
            <h2 className="section-title gradient-text">VWU's Commitment to Excellence</h2>
          </div>
          <div className="recognition-grid">
            {recognitions.map((r) => {
              const Icon = resolveContentIcon(r.icon) || Presentation;
              return (
                <div key={r.id} className="rec-card">
                  <div className="rec-badge-wrap">
                    <div className="rec-badge"><Icon size={24} strokeWidth={1.75} /></div>
                    <div className="rec-badge-ring" />
                  </div>
                  <div className="rec-body">
                    <strong>{r.title}</strong>
                    <span>{r.desc}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <Wave fill="var(--color-primary)" />

      {/* ── Testimonials Carousel ── */}
      <section className="testimonial-section">
        <div className="testimonial-bg-shapes" aria-hidden="true">
          <div className="ts-shape ts-shape--1" />
          <div className="ts-shape ts-shape--2" />
        </div>
        <div className="container">
          <div className="testimonial-header reveal">
            <span className="section-label" style={{ color: 'var(--color-accent)' }}>Alumni Voices</span>
            <h2 style={{ color: '#fff' }}>What Our Graduates Say</h2>
          </div>
          <div className="testimonial-carousel">
            {testimonials.map((t, i) => (
              <div key={t.id} className={`testimonial-slide${i === activeTestimonial ? ' active' : ''}${i === (activeTestimonial - 1 + testimonials.length) % testimonials.length ? ' prev' : ''}`}>
                <div className="testimonial-quote-mark">"</div>
                <p className="testimonial-quote">{t.desc}</p>
                <div className="testimonial-author">
                  {t.slug && <img src={t.slug} alt={t.title} className="testimonial-avatar" loading="lazy" />}
                  <div className="testimonial-info">
                    <strong>{t.title}</strong>
                    <span>{t.value}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="testimonial-dots">
            {testimonials.map((_, i) => (
              <button
                key={i}
                className={`testimonial-dot${i === activeTestimonial ? ' active' : ''}`}
                onClick={() => { setActiveTestimonial(i); if (timerRef.current) clearInterval(timerRef.current); }}
                aria-label={`Testimonial ${i + 1}`}
              />
            ))}
          </div>
        </div>
      </section>

      <Wave flip fill="var(--color-white)" />

      {/* ── News ── */}
      <section className="news-section">
        <div className="container">
          <div className="news-section-header">
            <div className="reveal-left">
              <span className="section-label">Stay Informed</span>
              <h2 className="section-title">Latest from VWU</h2>
            </div>
            <Link to="/news" className="btn btn-outline reveal-right">View All News →</Link>
          </div>
          <div className="news-grid">
            {featuredNews.map((item, i) => (
              <div key={item.id} className="reveal-bounce" data-delay={`${i * 110}`}>
                <NewsCard article={newsDocToArticle(item)} />
              </div>
            ))}
            {featuredNews.length === 0 && (
              <p style={{ color: 'var(--color-text-light)' }}>No featured news yet — check back soon.</p>
            )}
          </div>
        </div>
      </section>

      {/* ── Events ── */}
      <section className="events-section">
        <div className="container">
          <div className="events-header">
            <div className="reveal-left">
              <span className="section-label">What's Happening</span>
              <h2 className="section-title">Upcoming at VWU</h2>
            </div>
            <Link to="/events" className="btn btn-outline reveal-right">All Events →</Link>
          </div>
          <div className="events-list">
            {featuredEvents.map((event) => (
              <Link key={event.id} to="/events" className="event-item">
                <div className="event-date-badge">
                  <span className="month">{event.month}</span>
                  <span className="day">{event.day}</span>
                </div>
                <div className="event-line" />
                <div className="event-content">
                  <div className="event-title">{event.title}</div>
                  <div className="event-meta">
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}><Clock size={14} /> {event.time}</span>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}><MapPin size={14} /> {event.location}</span>
                  </div>
                </div>
                <svg className="event-arrow" width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path d="M9 18l6-6-6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Banner ── */}
      <section className="cta-banner">
        <img src="https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=1920&q=80" alt="VWU campus" className="cta-banner-bg" loading="lazy" />
        <div className="cta-banner-overlay" />
        <div className="cta-particles" aria-hidden="true">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="cta-particle" style={{ '--i': i } as React.CSSProperties} />
          ))}
        </div>
        <div className="container">
          <div className="cta-banner-content reveal">
            <span className="section-label" style={{ color: 'var(--color-accent)' }}>Take the Next Step</span>
            <h2>The best way to understand VWU<br />is to see it for yourself.</h2>
            <p>Arrange a campus tour, speak with our admissions team, or submit your application today. Your path to a purposeful engineering career starts here.</p>
            <div className="cta-actions">
              <MagneticBtn to="/admissions" className="btn btn-accent btn-lg magnetic-btn pulse-btn">Schedule a Visit</MagneticBtn>
              <MagneticBtn to="/admissions" className="btn btn-secondary btn-lg magnetic-btn">Request Information</MagneticBtn>
              <MagneticBtn to="/admissions" className="btn btn-secondary btn-lg magnetic-btn">Apply via EAPCET</MagneticBtn>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
