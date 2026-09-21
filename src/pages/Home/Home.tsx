import { useEffect, useMemo, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Laptop } from 'lucide-react';
import HeroSlider from '../../components/HeroSlider/HeroSlider';
import SiteSearch from '../../components/SiteSearch/SiteSearch';
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
import { useSitePhotos } from '../../hooks/useSitePhotos';
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
const STUDY_CARD_COLORS = ['var(--color-primary)', 'var(--color-primary-light)', 'var(--color-primary)'];

const defaultCtaBannerPhoto = [
  { src: PHOTO_NEEDED_PLACEHOLDER, alt: 'VWU campus', caption: '' },
];

// The original hardcoded content each of these sections shipped with,
// before becoming admin-editable via /admin → Page Content Blocks (home /
// <section>). Shown until an admin adds real entries there — same fallback
// pattern used throughout this codebase (e.g. defaultExecutives in About.tsx).
const defaultStudyCards: ContentBlockDoc[] = [
  { id: 'default-1', page: 'home', section: 'studyCards', value: 'Explore Programs', title: 'UG Programs', desc: 'Ten specialisations across Computer Science, Electronics, Electrical, Civil and Mechanical Engineering — including AI & Machine Learning, AI & Data Science, and Cyber Security.', icon: 'Laptop', slug: '/academics', order: 0 },
  { id: 'default-2', page: 'home', section: 'studyCards', value: 'PG Programs', title: 'PG Programs', desc: 'Five postgraduate programmes: M.Tech in Computer Science, VLSI Design, Power Electronics and Software Engineering, and a two-year MBA.', icon: 'GraduationCap', slug: '/academics', order: 1 },
  { id: 'default-3', page: 'home', section: 'studyCards', value: 'Research Programs', title: 'Ph.D. Programs', desc: 'Doctoral research in Computer Science, Electronics and Electrical Engineering, supported by 2,500+ publications, 150+ patents and dedicated research facilities.', icon: 'FlaskConical', slug: '/academics', order: 2 },
];

function normalizeStudyCardTitle(title: string): string {
  if (title === 'B.Tech Programs' || title === 'B.Tech') return 'UG Programs';
  if (title === 'M.Tech & MBA Programs' || title === 'M.Tech & MBA' || title === 'M.Tech Programs') return 'PG Programs';
  return title;
}

// Each study card's slug is admin-editable in Firestore and currently just
// points at the plain "/academics" page, which always lands on its default
// B.Tech tab. Route each card straight to the Programs tab matching what it
// actually advertises instead — but only when it's still the generic
// default, so an admin who deliberately customizes the slug (e.g. to an
// external link) isn't overridden.
const STUDY_CARD_TABS: Record<string, string> = {
  'B.Tech Programs': 'btech',
  'UG Programs': 'btech',
  'M.Tech & MBA Programs': 'mtech',
  'M.Tech & MBA': 'mtech',
  'PG Programs': 'mtech',
  'Ph.D. Programs': 'phd',
  'Ph.D Programs': 'phd',
  'Research & Ph.D.': 'phd',
  'Research Programs': 'phd',
};

function studyCardHref(card: ContentBlockDoc): string {
  const tab = STUDY_CARD_TABS[card.title] || STUDY_CARD_TABS[card.value] || STUDY_CARD_TABS[normalizeStudyCardTitle(card.title)];
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

/* ── Subcomponents ────────────────────────────────────────── */
function StudyCardItem({ card, photo, color }: { card: ContentBlockDoc; photo?: { src: string; alt: string; caption?: string }; color: string }) {
  const Icon = resolveContentIcon(card.icon) || Laptop;
  const tilt = useTilt(10);
  const displayTitle = normalizeStudyCardTitle(card.title);
  
  return (
    <div
      className="study-card"
      {...tilt}
      style={{ '--card-color': color } as React.CSSProperties}
    >
      <div className="study-card-image-wrap">
        {photo && <SmoothImage src={photo.src} alt={photo.alt} className="study-card-image" loading="lazy" decoding="async" />}
        <div className="study-card-overlay" style={{ background: `linear-gradient(to top, color-mix(in srgb, ${color} 80%, transparent) 0%, transparent 65%)` }} />
        <div className="study-card-icon"><Icon size={24} strokeWidth={1.75} color="var(--color-primary-dark)" /></div>
        <div className="study-card-shine" />
      </div>
      <div className="study-card-body">
        <h3 className="study-card-title">{displayTitle}</h3>
        <p className="study-card-desc">{card.desc}</p>
        <Link to={studyCardHref(card)} className="study-card-link">
          {card.value}
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </Link>
      </div>
    </div>
  );
}



/* ── Component ────────────────────────────────────────────── */
export default function Home() {
  // "Upcoming at VWU" and "Recent Campus Activities" are driven by the
  // Happenings collection (see NewsAwardsDataAdmin.tsx / Happenings.tsx).
  const { docs: happenings, loading: happeningsLoading } = useOrderedCollection<HappeningDoc>('happenings', 'order');
  const upcomingHappenings = happenings.filter(h => h.type === 'upcoming');
  const recentHappenings = happenings.filter(h => h.type === 'recent');

  const liveTestimonials = useContentBlocks('home', 'testimonials');
  const testimonials = liveTestimonials.length > 0 ? liveTestimonials : defaultTestimonials;
  const liveStudyCards = useContentBlocks('home', 'studyCards');
  const studyCards = liveStudyCards.length > 0 ? liveStudyCards : defaultStudyCards;
  const activityPhotos = useSitePhotos('home', 'activities', defaultActivityPhotos);
  const studyCardPhotos = useSitePhotos('home', 'study-cards', defaultStudyCardPhotos);
  const ctaBannerPhoto = useSitePhotos('home', 'cta-banner', defaultCtaBannerPhoto)[0];

  // Derive Recent Campus Activities directly from Happenings (#recent-events)
  const activityItems = useMemo(() => {
    if (recentHappenings.length > 0) {
      return recentHappenings.map(item => ({
        id: item.id,
        title: item.title,
        src: item.imageUrl || PHOTO_NEEDED_PLACEHOLDER,
        alt: item.title,
        link: `/news-awards/happenings/${item.id}`,
      }));
    }
    return activityPhotos.map((item, idx) => ({
      id: `default-${idx}`,
      title: item.caption || item.alt,
      src: item.src,
      alt: item.alt,
      link: '/news-awards/happenings#recent-events',
    }));
  }, [recentHappenings, activityPhotos]);

  const loopItems = useMemo(() => {
    if (activityItems.length === 0) return [];
    let base = activityItems;
    while (base.length < 6) {
      base = [...base, ...activityItems];
    }
    return [...base, ...base];
  }, [activityItems]);

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
      <section className="home-search-float" aria-label="Search courses, programs and schools">
        <SiteSearch />
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
            <p className="section-desc">
              <strong>Courses for Women</strong>
              <br /><br />
              At VWU, learning extends far beyond the traditional classroom. Students gain personalized, industry-oriented education designed to develop technical expertise, leadership skills, creativity, and the confidence to shape their future.
              <br /><br />
              Every programme is designed exclusively for women and emphasizes hands-on learning through modern laboratories and practical experiences. Our faculty bring valuable industry exposure into the classroom from the very first year, helping students connect academic knowledge with real-world applications.
              <br /><br />
              All programmes are approved by AICTE and recognized by the UGC.
            </p>
          </div>
          <div className="study-grid">
            {studyCards.map((card, i) => {
              const photo = studyCardPhotos.length > 0 ? studyCardPhotos[i % studyCardPhotos.length] : undefined;
              const color = STUDY_CARD_COLORS[i % STUDY_CARD_COLORS.length];
              return <StudyCardItem key={card.id} card={card} photo={photo} color={color} />;
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
            <Link to="/news-awards/happenings#recent-events" className="btn btn-outline reveal-right">View All Events →</Link>
          </div>
        </div>

        <div className="activity-strip">
          <div className="activity-track-wrap">
            <div className="activity-track">
              {happeningsLoading ? (
                Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="activity-card activity-card--skeleton" aria-hidden="true" />
                ))
              ) : (
                loopItems.map((item, i) => (
                  <Link
                    key={`${item.id}-${i}`}
                    to={item.link}
                    className="activity-card"
                    title={item.title}
                  >
                    <SmoothImage
                      src={item.src}
                      alt={item.alt}
                      className="activity-card-img"
                      {...(i < 3 ? fetchPriorityAttr('high') : { loading: 'lazy', decoding: 'async' })}
                    />
                    <div className="activity-card-label">{item.title}</div>
                  </Link>
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
      <TestimonialSlider testimonials={testimonials} title="What Our Students Say" />

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
