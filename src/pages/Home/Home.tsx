import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import HeroSlider from '../../components/HeroSlider/HeroSlider';
import CounterSection from '../../components/CounterSection/CounterSection';
import NewsCard from '../../components/NewsCard/NewsCard';
import { newsArticles } from '../../data/news';
import './Home.css';

/* ── Data ─────────────────────────────────────────────────── */
const studyCards = [
  { id: 1, icon: '💻', title: 'B.Tech Programs', desc: 'Choose from 9 B.Tech specializations — CSE, AI & ML, AI & DS, Cyber Security, IT, ECE, EEE, Civil, and Mechanical Engineering.', image: 'https://images.unsplash.com/photo-1498243691581-b145c3f54a5a?w=800&q=80', alt: 'Students in engineering classroom', path: '/academics', linkLabel: 'Explore Programs', color: '#1a4080' },
  { id: 2, icon: '🎓', title: 'M.Tech & MBA', desc: 'Elevate your qualifications with postgraduate programs in CSE, VLSI Design, Power Electronics, Software Engineering, and MBA.', image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&q=80', alt: 'Postgraduate students', path: '/academics', linkLabel: 'PG Programs', color: '#8B1A4A' },
  { id: 3, icon: '🔬', title: 'Research & Ph.D.', desc: 'Conduct doctoral research in CSE, ECE, and EEE — backed by 2,500+ publications, 90+ patents, and purpose-built research facilities.', image: 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=800&q=80', alt: 'Research laboratory', path: '/academics', linkLabel: 'Research Programs', color: '#1A6B3C' },
];

const popularPrograms = ['CSE', 'AI & Machine Learning', 'AI & Data Science', 'Cyber Security', 'Information Technology', 'Electronics & Communication', 'Electrical & Electronics', 'Civil Engineering', 'Mechanical Engineering', 'MBA'];

const recognitions = [
  { icon: '🏆', title: 'Top Engineering College', source: 'India Today Rankings' },
  { icon: '⭐', title: 'Best Engineering College', source: 'The Week Rankings' },
  { icon: '📋', title: 'NBA-DCP Accreditation', source: 'National Board of Accreditation' },
  { icon: '💼', title: 'NIRF Ranked Institution', source: 'Ministry of Education, India' },
  { icon: '📈', title: 'IEI Award for Excellence', source: 'Institution of Engineers India' },
  { icon: '🎖️', title: 'UGC Autonomous Status', source: 'University Grants Commission' },
];

const events = [
  { month: 'MAY', day: '20', title: 'Technova2026 National Symposium', time: '9:00 AM', location: 'VWU Auditorium, Bhimavaram' },
  { month: 'JUN', day: '5',  title: 'mBAJA SAEINDIA 2026 Awards Ceremony', time: '10:00 AM', location: 'Main Campus, Bhimavaram' },
  { month: 'JUN', day: '18', title: 'Amazon AFE Internship Orientation', time: '9:00 AM', location: 'Seminar Hall, VWU' },
  { month: 'JUL', day: '10', title: '9th Graduation Day Ceremony', time: '10:00 AM', location: 'VWU Auditorium, Bhimavaram' },
];

const campusFeatures = ['Student Clubs & Organizations', 'Radio Vishnu 90.4', 'Vishnu TV Academy', 'Sports & Games Facilities', 'Career Services Center', "Women's Hostels", 'AR/VR Studio', 'Technology Business Incubator'];

const activityItems = [
  { img: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=600&q=80', label: 'mBAJA SAEINDIA 2026 Win' },
  { img: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=600&q=80', label: 'Amazon AFE Internship' },
  { img: 'https://images.unsplash.com/photo-1498243691581-b145c3f54a5a?w=600&q=80', label: 'Technova2026 Symposium' },
  { img: 'https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=600&q=80', label: '8th Graduation Day' },
  { img: 'https://images.unsplash.com/photo-1607237138185-eedd9c632b0b?w=600&q=80', label: 'IEI Award for Excellence' },
  { img: 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=600&q=80', label: 'Space Application Center' },
];

const testimonials = [
  { quote: 'VWU faculty genuinely invest in each student — they know your name, your ambitions, and they hold you to a high standard. The skills and confidence I gained here led directly to my placement at Google.', name: 'Lakshmi R., Class of 2024', role: 'Computer Science Engineering — Software Engineer at Google', avatar: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=200&q=80' },
  { quote: 'VWU is a true launchpad. The research infrastructure, the labs, and the guidance I received here built the academic foundation that made my Ph.D. at IIT Hyderabad possible.', name: 'Anusha P., Class of 2022', role: 'M.Tech ECE — Research Scholar at IIT Hyderabad', avatar: 'https://images.unsplash.com/photo-1607746882042-944635dfe10e?w=200&q=80' },
  { quote: 'Studying in an all-women environment gave me real confidence in my abilities. I led several national-level projects at VWU — and that leadership mindset is what drives my startup today.', name: 'Divya K., Class of 2023', role: 'CSE — Co-founder at TechFemme Startup', avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&q=80' },
];

const whyVwu = [
  { icon: '👩‍🏫', stat: '300+', label: 'Qualified Faculty' },
  { icon: '🏭', stat: '500+', label: 'Industry Partners' },
  { icon: '📜', stat: '90+', label: 'Patents Filed' },
  { icon: '🌍', stat: '25+', label: 'Global MoUs' },
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

  // Testimonial auto-advance
  useEffect(() => {
    timerRef.current = setInterval(() => setActiveTestimonial(p => (p + 1) % testimonials.length), 5000);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, []);

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

      {/* ── Quick Stats Bar ── */}
      <div className="quick-stats-bar">
        {whyVwu.map((w, i) => (
          <div key={i} className="quick-stat reveal" data-delay={`${i * 80}`}>
            <span className="quick-stat__icon">{w.icon}</span>
            <span className="quick-stat__num">{w.stat}</span>
            <span className="quick-stat__label">{w.label}</span>
          </div>
        ))}
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
            {studyCards.map((card, i) => (
              <div
                key={card.id}
                className="study-card reveal-bounce"
                data-delay={`${i * 130}`}
                {...tilts[i]}
                style={{ '--card-color': card.color } as React.CSSProperties}
              >
                <div className="study-card-image-wrap">
                  <img src={card.image} alt={card.alt} className="study-card-image" loading="lazy" />
                  <div className="study-card-overlay" style={{ background: `linear-gradient(to top, ${card.color}cc 0%, transparent 65%)` }} />
                  <div className="study-card-icon">{card.icon}</div>
                  <div className="study-card-shine" />
                </div>
                <div className="study-card-body">
                  <h3 className="study-card-title">{card.title}</h3>
                  <p className="study-card-desc">{card.desc}</p>
                  <Link to={card.path} className="study-card-link">
                    {card.linkLabel}
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  </Link>
                </div>
              </div>
            ))}
          </div>

          <div className="reveal" data-delay="350">
            <p className="program-label">Popular Programs</p>
            <div className="study-programs">
              {popularPrograms.map((p, i) => (
                <Link
                  to="/academics"
                  key={p}
                  className={`program-tag${tagHovered === i ? ' program-tag--active' : ''}`}
                  onMouseEnter={() => setTagHovered(i)}
                  onMouseLeave={() => setTagHovered(null)}
                  style={{ transitionDelay: `${i * 30}ms` } as React.CSSProperties}
                >
                  {p}
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
                <div key={f} className="campus-feature" style={{ animationDelay: `${i * 60}ms` }}>
                  <span className="campus-feature-check">✓</span>
                  {f}
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
                <div key={i} className={`mission-img mission-img--${i}`}>
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
            {recognitions.map((r, i) => (
              <div key={r.title} className="rec-card reveal" data-delay={`${i * 90}`}>
                <div className="rec-badge-wrap">
                  <div className="rec-badge">{r.icon}</div>
                  <div className="rec-badge-ring" />
                </div>
                <div className="rec-body">
                  <strong>{r.title}</strong>
                  <span>{r.source}</span>
                </div>
              </div>
            ))}
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
              <div key={i} className={`testimonial-slide${i === activeTestimonial ? ' active' : ''}${i === (activeTestimonial - 1 + testimonials.length) % testimonials.length ? ' prev' : ''}`}>
                <div className="testimonial-quote-mark">"</div>
                <p className="testimonial-quote">{t.quote}</p>
                <div className="testimonial-author">
                  <img src={t.avatar} alt={t.name} className="testimonial-avatar" loading="lazy" />
                  <div className="testimonial-info">
                    <strong>{t.name}</strong>
                    <span>{t.role}</span>
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
            {newsArticles.slice(0, 3).map((article, i) => (
              <div key={article.id} className="reveal-bounce" data-delay={`${i * 110}`}>
                <NewsCard article={article} />
              </div>
            ))}
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
            {events.map((event, i) => (
              <Link key={event.title} to="/events" className="event-item reveal" data-delay={`${i * 90}`}>
                <div className="event-date-badge">
                  <span className="month">{event.month}</span>
                  <span className="day">{event.day}</span>
                </div>
                <div className="event-line" />
                <div className="event-content">
                  <div className="event-title">{event.title}</div>
                  <div className="event-meta">
                    <span>🕐 {event.time}</span>
                    <span>📍 {event.location}</span>
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
