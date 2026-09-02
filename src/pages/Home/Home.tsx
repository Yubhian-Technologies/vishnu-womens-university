import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Laptop } from 'lucide-react';
import HeroSlider from '../../components/HeroSlider/HeroSlider';
import CounterSection from '../../components/CounterSection/CounterSection';
import ScrollTopButton from '../../components/ScrollTopButton/ScrollTopButton';
import NewsCard, { type NewsArticle } from '../../components/NewsCard/NewsCard';
import NewsArticleDialog from '../../components/NewsCard/NewsArticleDialog';
import SmoothImage from '../../components/SmoothImage/SmoothImage';
import TestimonialSlider from '../../components/TestimonialSlider/TestimonialSlider';
import RecruitersSection from '../../components/RecruitersMarquee/RecruitersSection';
import WomensEducationSection from '../../components/WomensEducation/WomensEducationSection';
import CampusLifeShowcase from '../../components/CampusLifeShowcase/CampusLifeShowcase';
import ProgramsShowcase from '../../components/ProgramsShowcase/ProgramsShowcase';
import { useOrderedCollection } from '../../hooks/useCollection';
import { fetchPriorityAttr } from '../../lib/domAttrs';
import { useContentBlocks } from '../../hooks/useContentBlocks';
import { useSitePhotos, useSitePhotosLoading } from '../../hooks/useSitePhotos';
import { PHOTO_NEEDED_PLACEHOLDER } from '../../lib/photoPlaceholder';
import { happeningToArticle } from '../../lib/happenings';
import { resolveContentIcon } from '../../lib/contentIcons';
import type { HappeningDoc } from '../Admin/sections/NewsAwardsDataAdmin';
import type { ContentBlockDoc } from '../Admin/sections/ContentBlocksAdmin';

import SEO from '../../components/SEO/SEO';
import { getUniversitySchema } from '../../lib/seo/schemas';
import './Home.css';

/* ── Data ─────────────────────────────────────────────────── */
// Every photo on this page is admin-editable via /admin → Website Photos →
// Home. These arrays are just the original defaults, shown until an admin
// replaces a slot — same fallback pattern used throughout this codebase.
const defaultActivityPhotos = [
  { src: PHOTO_NEEDED_PLACEHOLDER, alt: 'mBAJA SAEINDIA 2026 Win', caption: 'mBAJA SAEINDIA 2026 Win' },
  { src: PHOTO_NEEDED_PLACEHOLDER, alt: 'Amazon AFE Internship', caption: 'Amazon AFE Internship' },
  { src: PHOTO_NEEDED_PLACEHOLDER, alt: 'Technova2026 Symposium', caption: 'Technova2026 Symposium' },
  { src: PHOTO_NEEDED_PLACEHOLDER, alt: '8th Graduation Day', caption: '8th Graduation Day' },
  { src: PHOTO_NEEDED_PLACEHOLDER, alt: 'IEI Award for Excellence', caption: 'IEI Award for Excellence' },
  { src: PHOTO_NEEDED_PLACEHOLDER, alt: 'Space Application Center', caption: 'Space Application Center' },
];

const defaultStudyCardPhotos = [
  { src: PHOTO_NEEDED_PLACEHOLDER, alt: 'Students in engineering classroom', caption: '' },
  { src: PHOTO_NEEDED_PLACEHOLDER, alt: 'Postgraduate students', caption: '' },
  { src: PHOTO_NEEDED_PLACEHOLDER, alt: 'Research laboratory', caption: '' },
];
// Study card accent colours aren't a "photo" — kept as a parallel,
// index-matched, non-admin-editable array (matches by position).
const STUDY_CARD_COLORS = ['#1b4332', '#2d6a4f', '#40916c'];

const defaultCtaBannerPhoto = [
  { src: PHOTO_NEEDED_PLACEHOLDER, alt: 'VWU campus', caption: '' },
];

// The original hardcoded content each of these sections shipped with,
// before becoming admin-editable via /admin → Page Content Blocks (home /
// <section>). Shown until an admin adds real entries there — same fallback
// pattern used throughout this codebase (e.g. defaultExecutives in About.tsx).
const defaultStudyCards: ContentBlockDoc[] = [
  { id: 'default-1', page: 'home', section: 'studyCards', value: 'Explore Programs', title: 'B.Tech Programs', desc: 'Choose from 10+ B.Tech specializations — CSE, CSE[AI & ML], CSE[AI & DS], CSE[Cyber Security], IT, ECE, ECE[VLSI], ECE[EVT], EEE, Civil, and Mechanical Engineering.', icon: 'Laptop', slug: '/academics', order: 0 },
  { id: 'default-2', page: 'home', section: 'studyCards', value: 'M.Tech & MBA Programs', title: 'M.Tech & MBA', desc: 'Elevate your qualifications with postgraduate programs in CSE, VLSI Design, Power Electronics, Software Engineering, and MBA.', icon: 'GraduationCap', slug: '/academics', order: 1 },
  { id: 'default-3', page: 'home', section: 'studyCards', value: 'Ph.D. Programs', title: 'Research & Ph.D.', desc: 'Conduct doctoral research in CSE, ECE, and EEE — backed by 2,500+ publications, 90+ patents, and purpose-built research facilities.', icon: 'FlaskConical', slug: '/academics', order: 2 },
];

// The "M.Tech & MBA" study card's slug is admin-editable in Firestore and
// currently just points at the plain "/academics" page, which lands on its
// default B.Tech tab. Route that specific card straight to the M.Tech tab
// instead — but only when it's still the generic default, so an admin who
// deliberately customizes the slug (e.g. to an external link) isn't overridden.
function studyCardHref(card: ContentBlockDoc): string {
  if (card.value === 'M.Tech & MBA Programs' && (card.slug === '/academics' || !card.slug)) {
    return '/academics?tab=mtech';
  }
  return card.slug || '/academics';
}

const defaultTestimonials: ContentBlockDoc[] = [
  { id: 'default-1', page: 'home', section: 'testimonials', value: 'Computer Science Engineering — Software Engineer at Google', title: 'Lakshmi R., Class of 2024', desc: 'VWU faculty genuinely invest in each student — they know your name, your ambitions, and they hold you to a high standard. The skills and confidence I gained here led directly to my placement at Google.', icon: '', slug: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=200&q=80', order: 0 },
  { id: 'default-2', page: 'home', section: 'testimonials', value: 'M.Tech ECE — Research Scholar at IIT Hyderabad', title: 'Anusha P., Class of 2022', desc: 'VWU is a true launchpad. The research infrastructure, the labs, and the guidance I received here built the academic foundation that made my Ph.D. at IIT Hyderabad possible.', icon: '', slug: 'https://images.unsplash.com/photo-1607746882042-944635dfe10e?w=200&q=80', order: 1 },
  { id: 'default-3', page: 'home', section: 'testimonials', value: 'CSE — Co-founder at TechFemme Startup', title: 'Divya K., Class of 2023', desc: 'Studying in an all-women environment gave me real confidence in my abilities. I led several national-level projects at VWU — and that leadership mindset is what drives my startup today.', icon: '', slug: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&q=80', order: 2 },
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

/* ── Happenings → Home widgets ────────────────────────────── */
// "Latest from VWU" and "Upcoming at VWU" both read the `happenings`
// collection (see Home() below) instead of the separate `news`/`events`
// collections, but keep their original look — a NewsCard grid (via
// happeningToArticle, shared with Happenings.tsx's own Recent Events grid —
// see lib/happenings.ts) and a date-badge row list.

// The event-date-badge (month + day) expects two separate fields, but a
// happening only has one free-text `date` string (admin-entered, e.g.
// "January 31, 2026" — see NewsAwardsDataAdmin's Happenings form). Best-
// effort split for that common "Month D[, YYYY]" shape; anything that
// doesn't match that pattern still renders, just as a single-line date
// instead of the split badge.
function splitHappeningDate(date: string): { month: string; day: string } | null {
  const match = date.trim().match(/^([A-Za-z]+)\s+(\d{1,2})\b/);
  if (!match) return null;
  return { month: match[1].slice(0, 3).toUpperCase(), day: match[2] };
}

/* ── Component ────────────────────────────────────────────── */
export default function Home() {
  // "Latest from VWU" / "Upcoming at VWU" below are driven by the same
  // Happenings collection the admin's "Happenings & Awards" → Happenings
  // editor writes to (see NewsAwardsDataAdmin.tsx) and the /news-awards/
  // happenings page reads — not by the separate `news`/`events` collections
  // — so marking something Recent/Upcoming there is what shows it here.
  // "Latest from VWU" caps to 3, matching the original news-grid's size —
  // "View All News" links to /news-awards/happenings for the rest. Ordered
  // by the admin's Display Order field, same as the Happenings admin table
  // itself, so a newly-added item needs a lower order to appear in the top 3
  // (see the Happenings form's "Display Order" field).
  const { docs: happenings } = useOrderedCollection<HappeningDoc>('happenings', 'order');
  const recentHappenings = happenings.filter(h => h.type === 'recent');
  const upcomingHappenings = happenings.filter(h => h.type === 'upcoming');
  const featuredNews = recentHappenings.slice(0, 3).map(happeningToArticle);
  const [activeArticle, setActiveArticle] = useState<NewsArticle | null>(null);
  const liveTestimonials = useContentBlocks('home', 'testimonials');
  const testimonials = liveTestimonials.length > 0 ? liveTestimonials : defaultTestimonials;
  const liveStudyCards = useContentBlocks('home', 'studyCards');
  const studyCards = liveStudyCards.length > 0 ? liveStudyCards : defaultStudyCards;
  const activityPhotos = useSitePhotos('home', 'activities', defaultActivityPhotos);
  // Gates the strip's first paint: until Firestore actually responds, we
  // don't yet know whether real activity photos exist, so a skeleton shows
  // instead of the generic stock defaults — avoids ever rendering a photo
  // that's about to be replaced by a different one a moment later. Shares
  // useSitePhotos' subscription (not its own useOrderedCollection call) so
  // this always resolves at the exact same moment as activityPhotos itself.
  const activitiesLoading = useSitePhotosLoading();
  const studyCardPhotos = useSitePhotos('home', 'study-cards', defaultStudyCardPhotos);
  const ctaBannerPhoto = useSitePhotos('home', 'cta-banner', defaultCtaBannerPhoto)[0];

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

  const tilt1 = useTilt(10);
  const tilt2 = useTilt(10);
  const tilt3 = useTilt(10);
  const tilts = [tilt1, tilt2, tilt3];

  return (
    <main className="home-page">
      <SEO
        title="Vishnu Women's University | Empowering Women Through Knowledge & Technology"
        description="First private university for women in Telugu states located in Bhimavaram, Andhra Pradesh. Offering B.Tech, M.Tech, MBA, and Ph.D. programs with world-class infrastructure and top placements."
        canonicalPath="/"
        jsonLd={getUniversitySchema()}
      />

      {/* ── Hero Slider ── */}
      <HeroSlider />

      {/* ── Recent Activities Section ── */}
      <section className="activity-section" aria-label="Recent Activities">
        {/* Section Header */}
        <div className="container">
          <div className="activity-section-header reveal">
            <div className="activity-section-titlebar">
              <div className="activity-section-meta">
                <span className="section-label">Campus Life</span>
                <h2 className="section-title">Recent Activities</h2>
              </div>
              <p className="activity-section-desc">
                From mBAJA racing championships to NASA-level internships — VWU students lead, build, and inspire at every stage.
              </p>
            </div>
            <Link to="/news-awards/gallery" className="btn btn-outline reveal-right">View Gallery →</Link>
          </div>
        </div>

        {/* Photo Marquee */}
        <div className="activity-strip">
          <div className="activity-track-wrap">
            <div className="activity-track">
              {activitiesLoading ? (
                Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="activity-card activity-card--skeleton" aria-hidden="true" />
                ))
              ) : (
                [...activityPhotos, ...activityPhotos].map((item, i) => (
                  <div key={i} className="activity-card">
                    <SmoothImage
                      src={item.src}
                      alt={item.alt}
                      className="activity-card-img"
                      {...(i < 3 ? fetchPriorityAttr('high') : {})}
                    />
                    <div className="activity-card-label">{item.caption || item.alt}</div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </section>

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
              const photo = studyCardPhotos.length > 0 ? studyCardPhotos[i % studyCardPhotos.length] : undefined;
              const color = STUDY_CARD_COLORS[i % STUDY_CARD_COLORS.length];
              return (
                <div
                  key={card.id}
                  className="study-card"
                  {...tilts[i]}
                  style={{ '--card-color': color } as React.CSSProperties}
                >
                  <div className="study-card-image-wrap">
                    {photo && <SmoothImage src={photo.src} alt={photo.alt} className="study-card-image" />}
                    <div className="study-card-overlay" style={{ background: `linear-gradient(to top, ${color}cc 0%, transparent 65%)` }} />
                    <div className="study-card-icon"><Icon size={24} strokeWidth={1.75} color="var(--color-primary-dark)" /></div>
                    <div className="study-card-shine" />
                  </div>
                  <div className="study-card-body">
                    <h3 className="study-card-title">{card.title}</h3>
                    <p className="study-card-desc">{card.desc}</p>
                    <Link to={studyCardHref(card)} className="study-card-link">
                      {card.value}
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Campus Life Showcase (A vibrant campus. A memorable journey.) ── */}
      <CampusLifeShowcase />

      {/* ── Programs & Schools Showcase (Future-focused education across disciplines) ── */}
      <ProgramsShowcase />

      {/* ── Women's Education & Empowerment ── */}
      <WomensEducationSection />

      {/* ── Our Recruiters (3-Row Auto-Scrolling Marquee) ── */}
      <RecruitersSection />

      <Wave fill="#09130f" />

      {/* ── Modern Testimonials Slider ── */}
      <TestimonialSlider testimonials={testimonials} />

      <Wave flip fill="var(--color-white)" />

      {/* ── News (Recent Happenings) ── */}
      <section className="news-section">
        <div className="container">
          <div className="news-section-header">
            <div className="reveal-left">
              <span className="section-label">Stay Informed</span>
              <h2 className="section-title">Latest from VWU</h2>
            </div>
            <Link to="/news-awards/happenings" className="btn btn-outline reveal-right">View All News →</Link>
          </div>
          <div className="news-grid">
            {featuredNews.map((item, i) => (
              <div key={item.id} className="reveal-bounce" data-delay={`${i * 110}`}>
                <NewsCard article={item} onReadMore={() => setActiveArticle(item)} />
              </div>
            ))}
            {featuredNews.length === 0 && (
              <p style={{ color: 'var(--color-text-light)' }}>No recent happenings yet — check back soon.</p>
            )}
          </div>
        </div>
      </section>

      <NewsArticleDialog article={activeArticle} onClose={() => setActiveArticle(null)} />

      {/* ── Events (Upcoming Happenings) ── */}
      <section className="events-section">
        <div className="container">
          <div className="events-header">
            <div className="reveal-left">
              <span className="section-label">What's Happening</span>
              <h2 className="section-title">Upcoming at VWU</h2>
            </div>
            <Link to="/news-awards/happenings" className="btn btn-outline reveal-right">All Events →</Link>
          </div>
          <div className="events-list">
            {upcomingHappenings.map((item) => {
              const split = splitHappeningDate(item.date);
              return (
                <Link key={item.id} to="/news-awards/happenings" className="event-item">
                  <div className="event-date-badge">
                    {split ? (
                      <>
                        <span className="month">{split.month}</span>
                        <span className="day">{split.day}</span>
                      </>
                    ) : (
                      <span className="day" style={{ fontSize: 'var(--text-sm)' }}>{item.date}</span>
                    )}
                  </div>
                  <div className="event-line" />
                  <div className="event-content">
                    <div className="event-title">{item.title}</div>
                    {item.dept && (
                      <div className="event-meta">
                        <span>{item.dept}</span>
                      </div>
                    )}
                  </div>
                  <svg className="event-arrow" width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <path d="M9 18l6-6-6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </Link>
              );
            })}
            {upcomingHappenings.length === 0 && (
              <p style={{ color: 'var(--color-text-light)' }}>No upcoming happenings yet — check back soon.</p>
            )}
          </div>
        </div>
      </section>

      {/* ── CTA Banner ── */}
      <section className="cta-banner">
        {ctaBannerPhoto && <SmoothImage src={ctaBannerPhoto.src} alt={ctaBannerPhoto.alt} className="cta-banner-bg" />}
        <div className="cta-banner-overlay" />
        <div className="cta-particles" aria-hidden="true">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="cta-particle" style={{ '--i': i } as React.CSSProperties} />
          ))}
        </div>
        <div className="container">
          <div className="cta-banner-content reveal">
            <span className="section-label" style={{ color: 'var(--color-accent)' }}>Take the Next Step</span>
            <h2>The best way to understand VWU is to see it for yourself.</h2>
            <p>Arrange a campus tour, speak with our admissions team, or submit your application today. Your path to a purposeful engineering career starts here.</p>
            <div className="cta-actions">
              <Link to="/admissions" className="btn btn-accent btn-lg">Schedule a Visit</Link>
              <Link to="/admissions" className="btn btn-secondary btn-lg">Request Information</Link>
              <Link to="/admissions" className="btn btn-secondary btn-lg">Apply via EAPCET</Link>
            </div>
          </div>
        </div>
      </section>

      <ScrollTopButton />
    </main>
  );
}
