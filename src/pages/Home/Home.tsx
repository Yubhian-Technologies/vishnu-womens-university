import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import HeroSlider from '../../components/HeroSlider/HeroSlider';
import CounterSection from '../../components/CounterSection/CounterSection';
import NewsCard from '../../components/NewsCard/NewsCard';
import { newsArticles } from '../../data/news';
import './Home.css';

const studyCards = [
  {
    id: 1,
    icon: '💻',
    title: 'B.Tech Programs',
    desc: 'Explore 9 B.Tech specializations in CSE, AI & ML, AI & DS, Cyber Security, IT, ECE, EEE, Civil, and Mechanical Engineering.',
    image: 'https://images.unsplash.com/photo-1498243691581-b145c3f54a5a?w=800&q=80',
    alt: 'Students studying in a modern engineering classroom',
    path: '/academics',
    linkLabel: 'Explore Programs',
  },
  {
    id: 2,
    icon: '🎓',
    title: 'M.Tech & MBA',
    desc: 'Advance your career with postgraduate programs in CSE, VLSI Design, Power Electronics, Software Engineering, and MBA.',
    image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&q=80',
    alt: 'Students in postgraduate program',
    path: '/academics',
    linkLabel: 'PG Programs',
  },
  {
    id: 3,
    icon: '🔬',
    title: 'Research & Ph.D.',
    desc: 'Pursue doctoral research in CSE, ECE, and EEE with 2,500+ publications, 90+ patents, and world-class research facilities.',
    image: 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=800&q=80',
    alt: 'Students in research laboratory',
    path: '/academics',
    linkLabel: 'Research Programs',
  },
];

const popularPrograms = [
  'CSE', 'AI & Machine Learning', 'AI & Data Science', 'Cyber Security',
  'Information Technology', 'Electronics & Communication', 'Electrical & Electronics',
  'Civil Engineering', 'Mechanical Engineering', 'MBA',
];

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
  { month: 'JUN', day: '5', title: 'mBAJA SAEINDIA 2026 Awards Ceremony', time: '10:00 AM', location: 'Main Campus, Bhimavaram' },
  { month: 'JUN', day: '18', title: 'Amazon AFE Internship Orientation', time: '9:00 AM', location: 'Seminar Hall, VWU' },
  { month: 'JUL', day: '10', title: '9th Graduation Day Ceremony', time: '10:00 AM', location: 'VWU Auditorium, Bhimavaram' },
];

const campusFeatures = [
  'Student Clubs & Organizations',
  'Radio Vishnu 90.4',
  'Vishnu TV Academy',
  'Sports & Games Facilities',
  'Career Services Center',
  'Women\'s Hostels',
  'AR/VR Studio',
  'Technology Business Incubator',
];

const activityItems = [
  { img: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=600&q=80', label: 'mBAJA SAEINDIA 2026 Win' },
  { img: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=600&q=80', label: 'Amazon AFE Internship' },
  { img: 'https://images.unsplash.com/photo-1498243691581-b145c3f54a5a?w=600&q=80', label: 'Technova2026 Symposium' },
  { img: 'https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=600&q=80', label: '8th Graduation Day' },
  { img: 'https://images.unsplash.com/photo-1607237138185-eedd9c632b0b?w=600&q=80', label: 'IEI Award for Excellence' },
  { img: 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=600&q=80', label: 'Space Application Center' },
];

export default function Home() {
  useEffect(() => {
    document.title = 'VWU | Empowering Women Through Knowledge and Action';

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
      { threshold: 0.1 }
    );

    document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale').forEach(el => {
      observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <main>
      {/* Hero Slider */}
      <HeroSlider />

      {/* Recent Activities Scroll Strip */}
      <div className="activity-strip">
        <div className="activity-strip-label">Recent Activities</div>
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

      {/* Counter Stats */}
      <CounterSection />

      {/* Study at VWU */}
      <section className="study-section section">
        <div className="container">
          <div className="study-intro reveal">
            <span className="section-label">Academics</span>
            <h2 className="section-title">Study at VWU</h2>
            <p className="section-desc">
              You'll be gaining an education that is personalized, industry-focused, and designed to
              empower you with technical skills, leadership, and innovation.
            </p>
          </div>

          <div className="study-grid">
            {studyCards.map((card, i) => (
              <div key={card.id} className="study-card reveal" data-delay={`${i * 120}`}>
                <div className="study-card-image-wrap">
                  <img src={card.image} alt={card.alt} className="study-card-image" loading="lazy" />
                  <div className="study-card-overlay" />
                  <div className="study-card-icon">{card.icon}</div>
                </div>
                <div className="study-card-body">
                  <h3 className="study-card-title">{card.title}</h3>
                  <p className="study-card-desc">{card.desc}</p>
                  <Link to={card.path} className="study-card-link">
                    {card.linkLabel}
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                      <path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </Link>
                </div>
              </div>
            ))}
          </div>

          <div className="reveal" data-delay="300">
            <p style={{ marginBottom: 'var(--space-4)', fontFamily: 'var(--font-sans)', fontWeight: 700, fontSize: 'var(--text-sm)', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--color-text-light)' }}>
              Popular Programs
            </p>
            <div className="study-programs">
              {popularPrograms.map((p) => (
                <Link to="/academics" key={p} className="program-tag">{p}</Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Campus Life */}
      <section className="campus-section" aria-label="Campus Life">
        <div className="campus-image-side reveal-left">
          <img
            src="https://images.unsplash.com/photo-1607237138185-eedd9c632b0b?w=1000&q=80"
            alt="VWU campus life with students"
            className="campus-image"
            loading="lazy"
          />
          <div className="campus-image-overlay" />
        </div>
        <div className="campus-content-side">
          <div className="reveal-right">
            <span className="section-label">Student Life</span>
            <h2>Learn, Grow and Excel</h2>
            <p>
              There's nothing better than feeling like you belong, and knowing you're in a place
              where you can flourish, grow and succeed. At VWU, every student is valued,
              mentored, and empowered to reach their highest potential.
            </p>
            <div className="campus-features">
              {campusFeatures.map((f) => (
                <div key={f} className="campus-feature">{f}</div>
              ))}
            </div>
            <Link to="/student-life" className="btn btn-accent btn-lg">
              Explore Campus Life
            </Link>
          </div>
        </div>
      </section>

      {/* Mission */}
      <section className="mission-section section">
        <div className="container">
          <div className="mission-grid">
            <div className="mission-content reveal-left">
              <span className="section-label">Our Purpose</span>
              <h2 className="section-title">Driven by Excellence</h2>
              <div className="divider" />
              <p>
                Vishnu Womens University is committed to empowering women
                with quality technical education, fostering innovation, and creating graduates
                who make a real difference in the world.
              </p>
              <p>
                Established under the Sri Vishnu Educational Society and affiliated to JNTUK,
                VWU has been shaping engineers, researchers, and leaders for over two decades
                from its campus in Bhimavaram, Andhra Pradesh.
              </p>
              <div className="mission-quote">
                <blockquote>
                  "VWU gave me the technical foundation and the confidence to achieve my dreams.
                  The faculty truly care about your growth and your future."
                </blockquote>
                <cite>— Priya, CSE Graduate, placed at Amazon</cite>
              </div>
              <Link to="/about" className="btn btn-primary">Learn More About VWU</Link>
            </div>

            <div className="mission-image-grid reveal-right">
              <div className="mission-img">
                <img
                  src="https://images.unsplash.com/photo-1571260899304-425eee4c7efc?w=800&q=80"
                  alt="Students engaged in learning at VWU"
                  loading="lazy"
                />
              </div>
              <div className="mission-img">
                <img
                  src="https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=800&q=80"
                  alt="Modern technology in the classroom"
                  loading="lazy"
                />
              </div>
              <div className="mission-img">
                <img
                  src="https://images.unsplash.com/photo-1523580494863-6f3031224c94?w=800&q=80"
                  alt="Students at campus event"
                  loading="lazy"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Recognition */}
      <section className="recognition-section">
        <div className="container">
          <div className="recognition-header reveal">
            <span className="section-label">Nationally Recognized</span>
            <h2 className="section-title">VWU's Commitment to Excellence</h2>
          </div>
          <div className="recognition-grid">
            {recognitions.map((r, i) => (
              <div key={r.title} className="rec-card reveal" data-delay={`${i * 80}`}>
                <div className="rec-badge">{r.icon}</div>
                <div className="rec-body">
                  <strong>{r.title}</strong>
                  <span>{r.source}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonial */}
      <section className="testimonial-section" aria-label="Student testimonial">
        <div className="container">
          <div className="testimonial-content reveal">
            <p className="testimonial-quote">
              The faculty at VWU are exceptional — they know your name, your goals, and
              they push you to become the best engineer you can be. VWU gave me the skills,
              the confidence, and the placement I dreamed of.
            </p>
            <div className="testimonial-author">
              <img
                src="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=200&q=80"
                alt="VWU graduate testimonial"
                className="testimonial-avatar"
                loading="lazy"
              />
              <div className="testimonial-info">
                <strong>Lakshmi R., Class of 2024</strong>
                <span>Computer Science Engineering — Software Engineer at Google</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* News */}
      <section className="news-section">
        <div className="container">
          <div className="news-section-header">
            <div className="reveal-left">
              <span className="section-label">Stay Informed</span>
              <h2 className="section-title">Latest from VWU</h2>
            </div>
            <Link to="/news" className="btn btn-outline reveal-right">View All News</Link>
          </div>
          <div className="news-grid">
            {newsArticles.slice(0, 3).map((article, i) => (
              <div key={article.id} className="reveal" data-delay={`${i * 100}`}>
                <NewsCard article={article} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Events */}
      <section className="events-section">
        <div className="container">
          <div className="events-header">
            <div className="reveal-left">
              <span className="section-label">What's Happening</span>
              <h2 className="section-title">Upcoming at VWU</h2>
            </div>
            <Link to="/events" className="btn btn-outline reveal-right">All Events</Link>
          </div>
          <div className="events-list">
            {events.map((event, i) => (
              <Link key={event.title} to="/events" className="event-item reveal" data-delay={`${i * 80}`}>
                <div className="event-date-badge">
                  <span className="month">{event.month}</span>
                  <span className="day">{event.day}</span>
                </div>
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

      {/* CTA Banner */}
      <section className="cta-banner">
        <img
          src="https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=1920&q=80"
          alt="VWU campus in background"
          className="cta-banner-bg"
          loading="lazy"
        />
        <div className="cta-banner-overlay" />
        <div className="container">
          <div className="cta-banner-content reveal">
            <span className="section-label" style={{ color: 'var(--color-accent)' }}>Take the Next Step</span>
            <h2>
              The best way to discover VWU is to experience it yourself.
            </h2>
            <p>
              Schedule a campus tour, talk to our admissions team, or apply today.
              Begin your journey toward an empowered future at VWU.
            </p>
            <div className="cta-actions">
              <Link to="/admissions" className="btn btn-accent btn-lg">Schedule a Visit</Link>
              <Link to="/admissions" className="btn btn-secondary btn-lg">Request Information</Link>
              <Link to="/admissions" className="btn btn-secondary btn-lg">Apply via EAPCET</Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
