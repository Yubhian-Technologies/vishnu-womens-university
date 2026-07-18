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
import type { ContentBlockDoc } from '../Admin/sections/ContentBlocksAdmin';
import './Home.css';

/* ── Data ─────────────────────────────────────────────────── */
const STUDY_CARD_IMAGES = [
  { image: 'https://images.unsplash.com/photo-1498243691581-b145c3f54a5a?w=800&q=80', alt: 'Students in engineering classroom', color: '#1b4332' },
  { image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&q=80', alt: 'Postgraduate students', color: '#2d6a4f' },
  { image: 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=800&q=80', alt: 'Research laboratory', color: '#40916c' },
];

// The original hardcoded content each of these sections shipped with,
// before becoming admin-editable via /admin → Page Content Blocks (home /
// <section>). Shown until an admin adds real entries there — same fallback
// pattern used throughout this codebase (e.g. defaultExecutives in About.tsx).
const defaultStudyCards: ContentBlockDoc[] = [
  { id: 'default-1', page: 'home', section: 'studyCards', value: 'Explore Programs', title: 'B.Tech Programs', desc: 'Choose from 9 B.Tech specializations — CSE, AI & ML, AI & DS, Cyber Security, IT, ECE, EEE, Civil, and Mechanical Engineering.', icon: 'Laptop', slug: '/academics', order: 0 },
  { id: 'default-2', page: 'home', section: 'studyCards', value: 'PG Programs', title: 'M.Tech & MBA', desc: 'Elevate your qualifications with postgraduate programs in CSE, VLSI Design, Power Electronics, Software Engineering, and MBA.', icon: 'GraduationCap', slug: '/academics', order: 1 },
  { id: 'default-3', page: 'home', section: 'studyCards', value: 'Research Programs', title: 'Research & Ph.D.', desc: 'Conduct doctoral research in CSE, ECE, and EEE — backed by 2,500+ publications, 90+ patents, and purpose-built research facilities.', icon: 'FlaskConical', slug: '/academics', order: 2 },
];

// The real /academics/:slug values for each B.Tech program, exactly as used
// by the live `programs` Firestore collection (department abbreviations, not
// a generic slugified title — e.g. "AI & Machine Learning" is "ai-ml", not
// "ai-machine-learning"). Recovered from programs.data.ts (the static file
// these were migrated out of, see commit a0ddb39) and confirmed against the
// live site. A generic slugify() can't derive these since they're
// abbreviations, so each Popular Programs tag is matched by title here first.
const POPULAR_PROGRAM_SLUGS: Record<string, string> = {
  'CSE': 'cse',
  'AI & Machine Learning': 'ai-ml',
  'AI & Data Science': 'ai-ds',
  'Cyber Security': 'cyber-security',
  'Information Technology': 'it',
  'Electronics & Communication': 'ece',
  'Electrical & Electronics': 'eee',
  'Civil Engineering': 'ce',
  'Mechanical Engineering': 'me',
  'MBA': 'mba',
};

const slugify = (title: string) =>
  title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');

const defaultPopularPrograms: ContentBlockDoc[] = Object.keys(POPULAR_PROGRAM_SLUGS).map((title, i) => ({
  id: `default-${i}`, page: 'home', section: 'popularPrograms', value: '', title, desc: '', icon: '',
  slug: POPULAR_PROGRAM_SLUGS[title], order: i,
}));

const defaultCampusFeatures: ContentBlockDoc[] = [
  'Student Clubs & Organizations', 'Radio Vishnu 90.4', 'Vishnu TV Academy', 'Sports & Games Facilities',
  'Career Services Center', "Women's Hostels", 'AR/VR Studio', 'Technology Business Incubator',
].map((title, i) => ({ id: `default-${i}`, page: 'home', section: 'campusFeatures', value: '', title, desc: '', icon: '', slug: '', order: i }));

const defaultRecognitions: ContentBlockDoc[] = [
  { id: 'default-1', page: 'home', section: 'recognitions', value: '', title: 'Top Engineering College', desc: 'India Today Rankings', icon: 'Trophy', slug: '', order: 0 },
  { id: 'default-2', page: 'home', section: 'recognitions', value: '', title: 'Best Engineering College', desc: 'The Week Rankings', icon: 'Star', slug: '', order: 1 },
  { id: 'default-3', page: 'home', section: 'recognitions', value: '', title: 'NBA Accreditation', desc: 'National Board of Accreditation', icon: 'ClipboardList', slug: '', order: 2 },
  { id: 'default-4', page: 'home', section: 'recognitions', value: '', title: 'NIRF Ranked Institution', desc: 'Ministry of Education, India', icon: 'Briefcase', slug: '', order: 3 },
  { id: 'default-5', page: 'home', section: 'recognitions', value: '', title: 'IEI Award for Excellence', desc: 'Institution of Engineers India', icon: 'TrendingUp', slug: '', order: 4 },
  { id: 'default-6', page: 'home', section: 'recognitions', value: '', title: 'UGC Autonomous Status', desc: 'University Grants Commission', icon: 'Award', slug: '', order: 5 },
];

const defaultTestimonials: ContentBlockDoc[] = [
  { id: 'default-1', page: 'home', section: 'testimonials', value: 'Computer Science Engineering — Software Engineer at Google', title: 'Lakshmi R., Class of 2024', desc: 'VWU faculty genuinely invest in each student — they know your name, your ambitions, and they hold you to a high standard. The skills and confidence I gained here led directly to my placement at Google.', icon: '', slug: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=200&q=80', order: 0 },
  { id: 'default-2', page: 'home', section: 'testimonials', value: 'M.Tech ECE — Research Scholar at IIT Hyderabad', title: 'Anusha P., Class of 2022', desc: 'VWU is a true launchpad. The research infrastructure, the labs, and the guidance I received here built the academic foundation that made my Ph.D. at IIT Hyderabad possible.', icon: '', slug: 'https://images.unsplash.com/photo-1607746882042-944635dfe10e?w=200&q=80', order: 1 },
  { id: 'default-3', page: 'home', section: 'testimonials', value: 'CSE — Co-founder at TechFemme Startup', title: 'Divya K., Class of 2023', desc: 'Studying in an all-women environment gave me real confidence in my abilities. I led several national-level projects at VWU — and that leadership mindset is what drives my startup today.', icon: '', slug: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&q=80', order: 2 },
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
  const liveRecognitions = useContentBlocks('home', 'recognitions');
  const recognitions = liveRecognitions.length > 0 ? liveRecognitions : defaultRecognitions;
  const liveCampusFeatures = useContentBlocks('home', 'campusFeatures');
  const campusFeatures = liveCampusFeatures.length > 0 ? liveCampusFeatures : defaultCampusFeatures;
  const liveTestimonials = useContentBlocks('home', 'testimonials');
  const testimonials = liveTestimonials.length > 0 ? liveTestimonials : defaultTestimonials;
  const liveStudyCards = useContentBlocks('home', 'studyCards');
  const studyCards = liveStudyCards.length > 0 ? liveStudyCards : defaultStudyCards;
  const livePopularPrograms = useContentBlocks('home', 'popularPrograms');
  const popularPrograms = livePopularPrograms.length > 0 ? livePopularPrograms : defaultPopularPrograms;

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
                  to={(() => {
                    const slug = p.slug || POPULAR_PROGRAM_SLUGS[p.title] || slugify(p.title);
                    return slug ? `/academics/${slug}` : '/academics';
                  })()}
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
