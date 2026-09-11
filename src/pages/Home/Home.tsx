import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Laptop, Search } from 'lucide-react';
import HeroSlider from '../../components/HeroSlider/HeroSlider';
import CounterSection from '../../components/CounterSection/CounterSection';
import ScrollTopButton from '../../components/ScrollTopButton/ScrollTopButton';
import SmoothImage from '../../components/SmoothImage/SmoothImage';
import TestimonialSlider from '../../components/TestimonialSlider/TestimonialSlider';
import RecruitersSection from '../../components/RecruitersMarquee/RecruitersSection';
import CampusLifeShowcase from '../../components/CampusLifeShowcase/CampusLifeShowcase';
import AccreditationsStrip from '../../components/AccreditationsStrip/AccreditationsStrip';
import { useOrderedCollection } from '../../hooks/useCollection';
import { fetchPriorityAttr } from '../../lib/domAttrs';
import { useContentBlocks } from '../../hooks/useContentBlocks';
import { useSitePhotos, useSitePhotosLoading } from '../../hooks/useSitePhotos';
import { PHOTO_NEEDED_PLACEHOLDER } from '../../lib/photoPlaceholder';
import { resolveContentIcon } from '../../lib/contentIcons';
import type { HappeningDoc } from '../Admin/sections/NewsAwardsDataAdmin';
import type { ContentBlockDoc } from '../Admin/sections/ContentBlocksAdmin';

import SEO from '../../components/SEO/SEO';
import UpcomingEvents from '../../components/UpcomingEvents/UpcomingEvents';
import PlacementMetricsSection from '../../components/PlacementMetricsSection/PlacementMetricsSection';
// Recent Placement Highlights — temporarily disabled, see usage below.
// import PlacementSpotlightsSection from '../../components/PlacementSpotlights/PlacementSpotlightsSection';
import HonouredGuestsSection from '../../components/HonouredGuests/HonouredGuestsSection';
import AlumniConnect from '../../components/AlumniConnect/AlumniConnect';
import YouTubeShowcase from '../../components/YouTubeShowcase/YouTubeShowcase';
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
// index-matched, non-admin-editable array (matches by position). CSS var()
// references (not literal hex) so these follow the admin Color Theme like
// everywhere else, instead of being frozen to the original brand greens.
const STUDY_CARD_COLORS = ['var(--color-primary)', 'var(--color-primary-light)', 'var(--color-secondary)'];

const defaultCtaBannerPhoto = [
  { src: PHOTO_NEEDED_PLACEHOLDER, alt: 'VWU campus', caption: '' },
];

// The original hardcoded content each of these sections shipped with,
// before becoming admin-editable via /admin → Page Content Blocks (home /
// <section>). Shown until an admin adds real entries there — same fallback
// pattern used throughout this codebase (e.g. defaultExecutives in About.tsx).
const defaultStudyCards: ContentBlockDoc[] = [
  { id: 'default-1', page: 'home', section: 'studyCards', value: 'Explore Programs', title: 'B.Tech Programs', desc: 'Ten specialisations across Computer Science, Electronics, Electrical, Civil and Mechanical Engineering — including AI & Machine Learning, AI & Data Science, and Cyber Security.', icon: 'Laptop', slug: '/academics', order: 0 },
  { id: 'default-2', page: 'home', section: 'studyCards', value: 'M.Tech & MBA Programs', title: 'M.Tech & MBA', desc: 'Five postgraduate programmes: M.Tech in Computer Science, VLSI Design, Power Electronics and Software Engineering, and a two-year MBA.', icon: 'GraduationCap', slug: '/academics', order: 1 },
  { id: 'default-3', page: 'home', section: 'studyCards', value: 'Ph.D. Programs', title: 'Research & Ph.D.', desc: 'Doctoral research in Computer Science, Electronics and Electrical Engineering, supported by 2,500+ publications, 150+ patents and dedicated research facilities.', icon: 'FlaskConical', slug: '/academics', order: 2 },
];

// Each study card's slug is admin-editable in Firestore and currently just
// points at the plain "/academics" page, which always lands on its default
// B.Tech tab. Route each card straight to the Programs tab matching what it
// actually advertises instead — but only when it's still the generic
// default, so an admin who deliberately customizes the slug (e.g. to an
// external link) isn't overridden.
const STUDY_CARD_TABS: Record<string, string> = {
  'B.Tech Programs': 'btech',
  'M.Tech & MBA Programs': 'mtech',
  'Ph.D. Programs': 'phd',
};

function studyCardHref(card: ContentBlockDoc): string {
  const tab = STUDY_CARD_TABS[card.value];
  if (tab && (card.slug === '/academics' || !card.slug)) {
    return `/academics?tab=${tab}`;
  }
  return card.slug || '/academics';
}

const defaultTestimonials: ContentBlockDoc[] = [
  { id: 'default-1', page: 'home', section: 'testimonials', value: 'B.Tech CSE — Software Engineer at Google', title: 'Lakshmi R., Class of 2024', desc: 'VWU faculty genuinely invest in each student — they know your name, your ambitions, and they hold you to a high standard. The skills and confidence I gained here led directly to my placement at Google.', icon: '', slug: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=500&q=80', order: 0 },
  { id: 'default-2', page: 'home', section: 'testimonials', value: 'M.Tech ECE — Research Scholar at IIT Hyderabad', title: 'Anusha P., Class of 2022', desc: 'VWU is a true launchpad. The research infrastructure, the labs, and the guidance I received here built the academic foundation that made my Ph.D. at IIT Hyderabad possible.', icon: '', slug: 'https://images.unsplash.com/photo-1607746882042-944635dfe10e?w=500&q=80', order: 1 },
  { id: 'default-3', page: 'home', section: 'testimonials', value: 'AI & Data Science — Applied Scientist at Amazon', title: 'Sowmya K., Class of 2023', desc: 'The specialized AI labs and machine learning faculty mentorship gave me the competitive edge to secure an Amazon AFE fellowship, which converted into a full-time Applied Scientist role.', icon: '', slug: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=500&q=80', order: 2 },
  { id: 'default-4', page: 'home', section: 'testimonials', value: 'CSE — Co-founder at TechFemme Startup', title: 'Divya K., Class of 2023', desc: 'Studying in an all-women environment gave me real confidence in my abilities. I led several national-level projects at VWU — and that leadership mindset is what drives my startup today.', icon: '', slug: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=500&q=80', order: 3 },
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



/* ── Component ────────────────────────────────────────────── */
export default function Home() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    navigate(searchQuery.trim() ? `/academics/programs?search=${encodeURIComponent(searchQuery.trim())}` : '/academics/programs');
  };

  // "Upcoming at VWU" is driven by the Happenings collection the admin's
  // "Happenings & Awards" → Happenings editor writes to (see
  // NewsAwardsDataAdmin.tsx) — marking something Upcoming there is what
  // shows it below.
  const { docs: happenings } = useOrderedCollection<HappeningDoc>('happenings', 'order');
  const upcomingHappenings = happenings.filter(h => h.type === 'upcoming');

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
    document.title = 'VWU | Leading by Design — Women in Engineering';

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

      {/* ── Chapter 1: Hero & Trust Bar ── */}
      <HeroSlider />

      {/* Straddles the hero/Accreditations seam — half the pill overlaps
          the hero's bottom edge, half sits in the strip below, via the
          negative margin-top in Home.css (no visible section of its own). */}
      <section className="home-search-float" aria-label="Search Programs">
        <form className="home-search-form" onSubmit={handleSearch} role="search">
          <div className="home-search-box">
            <Search className="home-search-icon" size={19} strokeWidth={2} />
            <input
              type="text"
              className="home-search-input"
              placeholder="Explore courses"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              aria-label="Explore courses"
            />
            <button type="submit" className="home-search-submit">Search</button>
          </div>
        </form>
      </section>

      <AccreditationsStrip />

      {/* ── Chapter 2: Institutional Impact & Stat Matrix ── */}
      <CounterSection />

      {/* ── Chapter 3: Unified Academic Hub & Degree Programs ── */}
      <section className="study-section section">
        {/* floating shapes */}
        <div className="floating-shapes" aria-hidden="true">
          <div className="shape shape--circle shape--1" />
          <div className="shape shape--ring shape--2" />
          <div className="shape shape--dot-grid shape--3" />
        </div>
        <div className="container">
          <div className="study-intro reveal">
            <h2 className="section-title gradient-text">Study at VWU</h2>
            <p className="section-desc"><strong>Courses for Women</strong><br />At VWU, education goes beyond the classroom. Experience personalized, industry-focused learning that builds technical expertise, leadership confidence, creativity, and the skills to shape your future. Every course here is taught to women, in working laboratories, by faculty who bring industry into the classroom from the first year. All programmes are approved by AICTE and recognised by the UGC.</p>
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
                    {photo && <SmoothImage src={photo.src} alt={photo.alt} className="study-card-image" loading="lazy" decoding="async" />}
                    <div className="study-card-overlay" style={{ background: `linear-gradient(to top, color-mix(in srgb, ${color} 80%, transparent) 0%, transparent 65%)` }} />
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

      {/* ── Chapter 3: Programme Finder ── */}
      {/* Recent Campus Activities */}
      <section className="activity-section" aria-label="Recent Activities">
        <div className="container">
          <div className="activity-section-header reveal">
            <div className="activity-section-titlebar">
              <div className="activity-section-meta">
                <p className="activity-section-eyebrow">Campus Life</p>
                <h2 className="section-title">Recent Campus Activities</h2>
              </div>
              <p className="activity-section-desc">
                A rolling glimpse of the events, celebrations, and everyday moments that shape life at VWU.
              </p>
            </div>
            <Link to="/news-awards/gallery" className="btn btn-outline reveal-right">View Gallery →</Link>
          </div>
        </div>

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
                      {...(i < 3 ? fetchPriorityAttr('high') : { loading: 'lazy', decoding: 'async' })}
                    />
                    <div className="activity-card-label">{item.caption || item.alt}</div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ── Chapter 5: Smart Infrastructure & Innovation Ecosystem ── */}
      <PlacementMetricsSection />
      {/* Recent Placement Highlights — commented out, uncomment (and the import above) to restore.
      <PlacementSpotlightsSection /> */}
      <YouTubeShowcase />
      <RecruitersSection />
      <CampusLifeShowcase />
      <HonouredGuestsSection />
      <AlumniConnect />

      {/* ── Chapter 6: Student Voices & Testimonials ── */}
      <div className="student-voices-header reveal">
        <div className="container">
          <p className="section-eyebrow">Student Voices</p>
          <h2 className="section-title gradient-text">What Our Students Say</h2>
        </div>
      </div>
      <TestimonialSlider testimonials={testimonials} title="" />

      <UpcomingEvents happenings={upcomingHappenings} />

      {/* ── Admissions CTA Banner ── */}
      <section className="cta-banner">
        {ctaBannerPhoto && <SmoothImage src={ctaBannerPhoto.src} alt={ctaBannerPhoto.alt} className="cta-banner-bg" loading="lazy" decoding="async" />}
        <div className="cta-banner-overlay" />
        <div className="cta-particles" aria-hidden="true">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="cta-particle" style={{ '--i': i } as React.CSSProperties} />
          ))}
        </div>
        <div className="container">
          <div className="cta-banner-content reveal">
            <h2>The best way to understand VWU is to see it for yourself.</h2>
            <p>Arrange a campus tour, speak with our admissions team, or submit your application today. Your path to a purposeful engineering career starts here.</p>
            <div className="cta-actions">
              <Link to="/admissions" className="btn btn-accent btn-lg">Schedule a Visit</Link>
              <Link to="/admissions" className="btn btn-secondary btn-lg">Request Information</Link>
              <Link to="/admissions" className="btn btn-secondary btn-lg">Apply via AP EAPCET</Link>
            </div>
          </div>
        </div>
      </section>

      <ScrollTopButton />
    </main>
  );
}
