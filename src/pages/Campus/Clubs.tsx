import { useEffect, useMemo, useRef, useState, type CSSProperties } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, BadgeCheck, CalendarDays, ChevronLeft, ChevronRight, Quote, Sparkle, Sparkles, Star, Trophy, Users2 } from 'lucide-react';
import { resolveContentIcon } from '../../lib/contentIcons';
// Reused for the shared .btn-hero-gold / .btn-hero-outline / .breadcrumb
// classes this page's bespoke hero styles itself with (see Clubs.css) —
// normally pulled in as a side effect of importing <PageHero>, which this
// page doesn't use since its hero layout (badge, 3-line headline, script
// tagline, corner flourish, attached stats bar) doesn't fit that component.
import '../../components/PageHero/PageHero.css';
import { useOrderedCollection } from '../../hooks/useCollection';
import { useContentBlocks } from '../../hooks/useContentBlocks';
import { usePageBanners } from '../../hooks/usePageBanners';
import { useSitePhotos } from '../../hooks/useSitePhotos';
import { smoothScrollTo } from '../../lib/smoothScroll';
import { slugify } from '../../lib/slugify';
import type { PhotoItem } from '../../components/PhotoGrid/PhotoGrid';
import type { ClubDoc } from '../Admin/sections/StudentClubsAdmin';
import { useClubCategories } from '../../lib/clubCategories';
import './Clubs.css';

// Defaults shown until an admin sets a real "clubs" Hero Banner (title,
// subtitle, image, primary CTA) and/or a "Clubs — Hero Extra Text" Content
// Block (badge, script tagline, corner text, 2nd button link) — same
// graceful-fallback pattern as the stats/testimonials sections below.
const DEFAULT_HERO_IMAGE = 'https://images.unsplash.com/photo-1523580494863-6f3031224c94?w=1600&q=80';
const DEFAULT_HERO_HEADLINE = 'FIND YOUR\nPASSION\nHERE';
const DEFAULT_HERO_BODY = "From technology to the arts, service to sport — VWU's clubs celebrate curiosity, creativity, and the spirit of community.";
const DEFAULT_HERO_BADGE = 'Campus Life';
const DEFAULT_HERO_TAGLINE = 'Where Every Passion Finds Its Place.';
const DEFAULT_HERO_CORNER = 'Every Passion.\nOne Community.';

// Shown only until an admin adds real entries under Content Blocks ->
// "Clubs — Stats Bar" / "Clubs — Testimonials" (see ContentBlocksAdmin.tsx).
// The clubs count itself is never a fallback — it's always computed live
// from the same `studentClubs` collection Student Clubs reads, so it can
// never drift out of date the way a hand-typed number would.
const DEFAULT_TESTIMONIALS = [
  {
    id: 'default-1', page: 'clubs', section: 'testimonials', order: 0, icon: 'Featured Leader', slug: '',
    title: 'Ananya Reddy', value: 'President, CodeChef & Tech Clubs',
    desc: 'Leading Vishnu\'s technical and cultural groups transformed who I am. From organizing 24-hour hackathons to mentoring juniors, clubs gave me confidence, lifelong sisters, and the project portfolio that landed my dream tech internship.',
  },
  {
    id: 'default-2', page: 'clubs', section: 'testimonials', order: 1, icon: '', slug: '',
    title: 'Sindhu Varma', value: 'Coordinator, Rotaract Club',
    desc: 'Our service projects took us into the community every month. It changed how I think about what engineering is actually for.',
  },
  {
    id: 'default-3', page: 'clubs', section: 'testimonials', order: 2, icon: '', slug: '',
    title: 'Meghana Rao', value: 'Lead, Cultural Club',
    desc: 'From classical dance to campus fests, the Cultural Club gave me a stage — and a group of friends I still call my closest ones.',
  },
];

// "Why Join Clubs?" pillars — admin-editable via Content Blocks ("Clubs —
// Why Join Clubs"); icon names must match src/lib/contentIcons.ts.
const DEFAULT_WHY_JOIN = [
  { id: 'wj-1', page: 'clubs', section: 'whyJoin', order: 0, icon: 'Laptop', slug: '', value: '', title: 'Skill Mastery', desc: 'Hands-on projects, workshops & AI sprints' },
  { id: 'wj-2', page: 'clubs', section: 'whyJoin', order: 1, icon: 'UsersRound', slug: '', value: '', title: 'Diverse Network', desc: 'Collaborate across departments & cohorts' },
  { id: 'wj-3', page: 'clubs', section: 'whyJoin', order: 2, icon: 'Crown', slug: '', value: '', title: 'Executive Leadership', desc: 'Lead real budgets, fests & campus initiatives' },
  { id: 'wj-4', page: 'clubs', section: 'whyJoin', order: 3, icon: 'HeartHandshake', slug: '', value: '', title: 'Lifelong Bonds', desc: 'Friendships that last well beyond graduation' },
  { id: 'wj-5', page: 'clubs', section: 'whyJoin', order: 4, icon: 'Leaf', slug: '', value: '', title: 'Real Societal Impact', desc: 'NSS, sustainability & rural tech outreach' },
];

// Pastel icon tile colours cycled by index — purely decorative, matches the
// reference design's varied pastel palette per pillar.
const WHY_JOIN_TILE_COLORS = [
  { bg: '#FDECEA', fg: '#D97757' },
  { bg: '#E7EFFD', fg: '#3B6FE0' },
  { bg: '#E7F7EC', fg: '#2E9E5B' },
  { bg: '#FDF4DA', fg: '#C9973A' },
  { bg: '#E1F5F1', fg: '#1F9E86' },
];

// Pastel "wiggly tile" fallback colours when a club's category can't be
// matched (e.g. admin deleted the category but clubs still reference it).
// Per-category colours/icons come from the merged `studentClubCategories`
// list (src/lib/clubCategories.ts) — built-in defaults plus anything an
// admin has added, each carrying its own icon name/colours.
const DEFAULT_TILE_COLOR = { bg: '#FDF4DA', accent: '#C9973A' };

// "Clubs in Action" photos — feeds both the CoverFlow carousel and (first 3)
// the Student Voices photo collage. Admin-editable via Site Photos -> Campus
// Life -> Clubs (each slot below maps to that section's slot 1-8, in order);
// these stock defaults show until an admin uploads VWU's own event photos
// over them. Extra photos beyond slot 8 are appended, so the carousel never
// feels sparse.
const DEFAULT_GALLERY = [
  { src: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&q=80', alt: 'Campus cultural festival performance', caption: 'Campus Cultural Fest' },
  { src: 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?w=800&q=80', alt: 'Students at a technical hackathon', caption: 'Hackathon Winners' },
  { src: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=800&q=80', alt: 'Robotics team celebrating a win', caption: 'Robotics Champions' },
  { src: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&q=80', alt: 'Students collaborating in a coding workshop', caption: 'Coding Workshop' },
  { src: 'https://images.unsplash.com/photo-1607237138185-eedd9c632b0b?w=800&q=80', alt: 'Club members on a community outreach visit', caption: 'Community Outreach' },
  { src: 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=800&q=80', alt: 'Seminar and workshop hall in session', caption: 'Guest Lecture' },
  { src: 'https://images.unsplash.com/photo-1531545514256-b1400bc00f31?w=800&q=80', alt: 'Students collaborating on a science project', caption: 'Science & Innovation Club' },
  { src: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=800&q=80', alt: 'Students on a campus nature walk', caption: 'Ecology Club Outing' },
];

// "Club Gallery" — 3D CoverFlow carousel below the Student Voices section,
// fed from the same admin-editable Site Photos -> Campus Life -> Clubs slots
// (page 'campus', section 'clubs') the Student Voices collage uses, so it
// needs no separate admin surface. The deck drifts continuously on its own
// (a `requestAnimationFrame` loop advances a fractional "position" rather
// than snapping between whole photos every few seconds) and only pauses
// while hovered; arrows/dots still jump straight to a photo for manual
// override. Card transforms are written directly to the DOM via refs each
// frame instead of through React state/props — at 60fps that avoids
// re-rendering every card's JSX every frame, which plain useState churn
// would otherwise cause.
const COVERFLOW_MS_PER_PHOTO = 3200;
// A fixed radius threshold (e.g. "within 2 of centre") flickers between 4
// and 5 visible cards as the continuous position drifts past whole numbers,
// since the count of integer indices within a shifting radius of a moving
// real-valued centre isn't constant. Picking the N nearest indices instead
// keeps the visible count steady at exactly this many, always.
const COVERFLOW_VISIBLE_COUNT = 6;

function ClubsGalleryCarousel({ photos }: { photos: PhotoItem[] }) {
  const [paused, setPaused] = useState(false);
  const [activeIdx, setActiveIdx] = useState(0);
  const pausedRef = useRef(paused);
  const positionRef = useRef(0);
  const cardRefs = useRef<(HTMLElement | null)[]>([]);

  const count = photos.length;

  useEffect(() => { pausedRef.current = paused; }, [paused]);

  useEffect(() => {
    // Clamp back into range if the admin's photo set shrank.
    positionRef.current = count > 0 ? positionRef.current % count : 0;
  }, [count]);

  useEffect(() => {
    if (count === 0) return;
    let raf = 0;
    let lastTs: number | null = null;

    const applyTransforms = () => {
      const position = positionRef.current;
      const nearest = Math.round(position) % count;
      setActiveIdx((prev) => (prev === nearest ? prev : nearest));

      const distances = Array.from({ length: count }, (_, idx) => {
        let signed = idx - position;
        if (signed > count / 2) signed -= count;
        if (signed < -count / 2) signed += count;
        return { idx, signed, absDistance: Math.abs(signed) };
      });
      const visibleIdx = new Set(
        [...distances]
          .sort((a, b) => a.absDistance - b.absDistance)
          .slice(0, Math.min(COVERFLOW_VISIBLE_COUNT, count))
          .map((d) => d.idx)
      );

      for (const { idx, signed, absDistance } of distances) {
        const el = cardRefs.current[idx];
        if (!el) continue;
        const visible = visibleIdx.has(idx);
        const scale = Math.max(0.72, 1 - absDistance * 0.14);
        const curve = signed * (absDistance < 2 ? 22 : 16) * -1; // rotateY sign: left cards turn toward viewer
        const zTuck = -(absDistance * 90);
        el.style.zIndex = String(Math.round(100 - absDistance));
        el.style.transform = `translate(-50%, -50%) translateX(${signed * 60}%) translateZ(${zTuck}px) rotateY(${curve}deg) scale(${scale})`;
        el.classList.toggle('clubs-coverflow-card--active', absDistance < 0.5);
        el.classList.toggle('clubs-coverflow-card--hidden', !visible);
      }
    };

    const tick = (ts: number) => {
      if (lastTs === null) lastTs = ts;
      const dt = ts - lastTs;
      lastTs = ts;
      if (!pausedRef.current && count > 1) {
        positionRef.current = (positionRef.current + dt / COVERFLOW_MS_PER_PHOTO) % count;
      }
      applyTransforms();
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [count]);

  if (count === 0) return null;

  const goTo = (i: number) => { positionRef.current = ((i % count) + count) % count; };
  const prev = () => goTo(Math.round(positionRef.current) - 1);
  const next = () => goTo(Math.round(positionRef.current) + 1);

  return (
    <div
      className="clubs-coverflow"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div
        className="clubs-coverflow-stage"
        style={{ transform: paused ? 'scale(0.985)' : undefined }}
      >
        {photos.map((photo, idx) => (
          <figure
            key={photo.src || idx}
            ref={(el) => { cardRefs.current[idx] = el; }}
            className="clubs-coverflow-card"
            onClick={() => { goTo(idx); }}
          >
            <img src={photo.src} alt={photo.alt} loading="lazy" />
            {(photo.caption || photo.alt) && (
              <figcaption>{photo.caption || photo.alt}</figcaption>
            )}
          </figure>
        ))}
      </div>

      <div className="clubs-coverflow-controls">
        <button type="button" className="clubs-coverflow-arrow" onClick={prev} aria-label="Previous photo">
          <ChevronLeft size={18} />
        </button>
        <div className="clubs-coverflow-dots">
          {photos.map((photo, i) => (
            <button
              key={photo.src || i}
              type="button"
              className={`clubs-coverflow-dot${i === activeIdx ? ' clubs-coverflow-dot--active' : ''}`}
              onClick={() => { goTo(i); }}
              aria-label={`View photo ${i + 1}`}
            />
          ))}
        </div>
        <button type="button" className="clubs-coverflow-arrow" onClick={next} aria-label="Next photo">
          <ChevronRight size={18} />
        </button>
      </div>
    </div>
  );
}

export default function Clubs() {
  const { docs: allClubs } = useOrderedCollection<ClubDoc>('studentClubs', 'order');
  const categories = useClubCategories();
  const liveStats = useContentBlocks('clubs', 'stats');
  const liveTestimonials = useContentBlocks('clubs', 'testimonials');
  const liveWhyJoin = useContentBlocks('clubs', 'whyJoin');
  const heroExtra = useContentBlocks('clubs', 'hero')[0];
  const { slides: heroSlides } = usePageBanners('clubs');
  const galleryPhotos = useSitePhotos('campus', 'clubs', DEFAULT_GALLERY);
  const [activeCategory, setActiveCategory] = useState<string | null>('Technical, Innovation & Academic');
  const [storyIndex, setStoryIndex] = useState(0);

  const testimonials = liveTestimonials.length > 0 ? liveTestimonials : DEFAULT_TESTIMONIALS;
  const whyJoinItems = liveWhyJoin.length > 0 ? liveWhyJoin : DEFAULT_WHY_JOIN;
  const activeStory = testimonials[storyIndex % testimonials.length];
  const collagePhotos = galleryPhotos.slice(0, 3);

  const heroSlide = heroSlides[0];
  const heroImage = heroSlide?.imageUrl || DEFAULT_HERO_IMAGE;
  const heroHeadlineLines = (heroSlide?.title || DEFAULT_HERO_HEADLINE).split('\n').filter(Boolean);
  const heroBody = heroSlide?.subtitle || DEFAULT_HERO_BODY;
  const heroCta1Label = heroSlide?.ctaLabel || 'Explore Clubs';
  const heroCta1Link = heroSlide?.ctaLink || '';
  const heroBadge = heroExtra?.value || DEFAULT_HERO_BADGE;
  const heroTagline = heroExtra?.title || DEFAULT_HERO_TAGLINE;
  const heroCornerLines = (heroExtra?.desc || DEFAULT_HERO_CORNER).split('\n').filter(Boolean);
  const heroCta2Link = heroExtra?.slug || '/events';

  const categoriesPresent = useMemo(
    () => categories.filter((c) => allClubs.some((club) => club.category === c.name)),
    [allClubs, categories]
  );

  const visibleClubs = useMemo(
    () => (activeCategory ? allClubs.filter((c) => c.category === activeCategory) : allClubs),
    [allClubs, activeCategory]
  );

  const derivedStats = useMemo(() => ([
    { id: 'clubs-count', icon: Users2, value: `${allClubs.length}+`, label: 'Clubs & Associations' },
    { id: 'categories-count', icon: Sparkles, value: `${categoriesPresent.length || categories.length}`, label: 'Interest Areas' },
  ]), [allClubs.length, categoriesPresent.length, categories.length]);

  const extraStatIcons = [Trophy, CalendarDays];

  useEffect(() => {
    document.title = 'Clubs | Campus Life | VWU';
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const el = entry.target as HTMLElement;
            setTimeout(() => el.classList.add('revealed'), parseInt(el.dataset.delay || '0'));
            observer.unobserve(el);
          }
        });
      },
      { threshold: 0.1 }
    );
    document.querySelectorAll('.reveal, .reveal-left, .reveal-right').forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <main className="page-wrapper">
      {/* Hero — bespoke design (not the shared PageHero, which can't fit a
          badge + 3-line headline + script tagline + corner flourish + 2
          buttons + an attached stats bar). Text/image/CTAs are still fully
          admin-editable: image/headline/body/1st button via Hero Banners
          (page "clubs"), badge/tagline/corner text/2nd button link via
          Content Blocks ("Clubs — Hero Extra Text"). */}
      <section className="clubs-hero-section">
          <div className="clubs-hero-card">
            <img src={heroImage} alt="" className="clubs-hero-bg-img" />
            <div className="clubs-hero-overlay" />

            <div className="clubs-hero-corner" aria-hidden="true">
              {heroCornerLines.map((line, i) => <span key={i}>{line}</span>)}
            </div>

            <div className="clubs-hero-content">
              <div className="clubs-hero-badge-row">
                <span className="clubs-hero-badge-dash" />
                <span className="clubs-hero-badge-text">{heroBadge}</span>
              </div>

              <h1 className="clubs-hero-headline">
                {heroHeadlineLines.map((line, i) => (
                  <span
                    key={i}
                    className={`clubs-hero-headline-line${heroHeadlineLines.length === 3 && i === 1 ? ' clubs-hero-headline-line--accent' : ''}`}
                  >
                    {line}
                  </span>
                ))}
              </h1>

              <p className="clubs-hero-tagline">{heroTagline}</p>
              <p className="clubs-hero-body">{heroBody}</p>

              <div className="clubs-hero-actions">
                {heroCta1Link ? (
                  heroCta1Link.startsWith('http') ? (
                    <a href={heroCta1Link} target="_blank" rel="noopener noreferrer" className="btn-hero-gold">
                      {heroCta1Label} <ArrowRight size={16} />
                    </a>
                  ) : (
                    <Link to={heroCta1Link} className="btn-hero-gold">
                      {heroCta1Label} <ArrowRight size={16} />
                    </Link>
                  )
                ) : (
                  <button type="button" className="btn-hero-gold" onClick={() => smoothScrollTo('#clubs-grid')}>
                    {heroCta1Label} <ArrowRight size={16} />
                  </button>
                )}
                {heroCta2Link.startsWith('http') ? (
                  <a href={heroCta2Link} target="_blank" rel="noopener noreferrer" className="btn-hero-outline">Upcoming Events</a>
                ) : (
                  <Link to={heroCta2Link} className="btn-hero-outline">Upcoming Events</Link>
                )}
              </div>
            </div>

            {/* Stats bar — first two figures are always live, computed
                straight from the studentClubs collection; the other two are
                admin-editable via Content Blocks (Clubs — Stats Bar) and
                fall back to sensible copy until an admin sets them. */}
            <div className="clubs-hero-stats-bar">
              {derivedStats.map((s) => (
                <div key={s.id} className="clubs-hero-stat">
                  <s.icon size={26} strokeWidth={1.75} />
                  <div>
                    <div className="clubs-hero-stat-value">{s.value}</div>
                    <div className="clubs-hero-stat-label">{s.label}</div>
                  </div>
                </div>
              ))}
              {liveStats.length > 0
                ? liveStats.map((s, i) => {
                    const Icon = extraStatIcons[i % extraStatIcons.length];
                    return (
                      <div key={s.id} className="clubs-hero-stat">
                        <Icon size={26} strokeWidth={1.75} />
                        <div>
                          <div className="clubs-hero-stat-value">{s.value}</div>
                          <div className="clubs-hero-stat-label">{s.title}</div>
                        </div>
                      </div>
                    );
                  })
                : (
                  <>
                    <div className="clubs-hero-stat">
                      <Trophy size={26} strokeWidth={1.75} />
                      <div>
                        <div className="clubs-hero-stat-value">Numerous</div>
                        <div className="clubs-hero-stat-label">Achievements</div>
                      </div>
                    </div>
                    <div className="clubs-hero-stat">
                      <CalendarDays size={26} strokeWidth={1.75} />
                      <div>
                        <div className="clubs-hero-stat-value">Year-Round</div>
                        <div className="clubs-hero-stat-label">Events & Activities</div>
                      </div>
                    </div>
                  </>
                )}
            </div>
          </div>
      </section>

      {/* Club grid — sourced live from the same studentClubs collection
          Student Clubs (/student-clubs) reads; that page and its admin are
          untouched, this is a read-only, differently-styled view onto the
          same data. */}
      <section id="clubs-grid" className="section bg-white clubs-grid-section" style={{ scrollMarginTop: 'calc(var(--topbar-height) + var(--header-height) + 1rem)' }}>
        <div className="clubs-grid-blobs" aria-hidden="true">
          <span className="clubs-blob clubs-blob--1" />
          <span className="clubs-blob clubs-blob--2" />
          <span className="clubs-blob clubs-blob--3" />
          <span className="clubs-blob clubs-blob--4" />
          <span className="clubs-blob clubs-blob--5" />
          <span className="clubs-blob clubs-blob--6" />
          <span className="clubs-blob clubs-blob--7" />
          <span className="clubs-blob clubs-blob--8" />
          <span className="clubs-blob clubs-blob--9" />
          <span className="clubs-blob clubs-blob--10" />
        </div>
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 'var(--space-4)', marginBottom: 'var(--space-6)' }}>
            <div className="reveal">
              <span className="section-label"><Sparkles size={14} /> Our Clubs</span>
              <h2 className="clubs-grid-title">Find Your Passion, Join a Club</h2>
              <p className="clubs-grid-subtitle">From creativity to technology, sports to service — there's a club for everyone.</p>
            </div>
          </div>

          {categoriesPresent.length > 1 && (
            <div className="clubs-filter-row">
              {categoriesPresent.map((cat) => (
                <button
                  key={cat.name}
                  type="button"
                  className={`clubs-filter-chip ${activeCategory === cat.name ? 'clubs-filter-chip--active' : ''}`}
                  onClick={() => setActiveCategory(cat.name)}
                >
                  {cat.name}
                </button>
              ))}
              <button
                type="button"
                className={`clubs-filter-chip ${activeCategory === null ? 'clubs-filter-chip--active' : ''}`}
                onClick={() => setActiveCategory(null)}
              >
                All Clubs
              </button>
            </div>
          )}

          <div className="grid-4 clubs-wiggly-grid">
            {visibleClubs.map((club) => {
              const cat = categories.find((c) => c.name === club.category);
              const Icon = (cat && resolveContentIcon(cat.icon)) || Sparkles;
              const thumb = club.images?.[0]?.url;
              const color = cat ? { bg: cat.bg, accent: cat.accent } : DEFAULT_TILE_COLOR;
              const tileVars = { '--wiggly-bg': color.bg, '--wiggly-accent': color.accent } as CSSProperties;
              return (
                <Link key={club.id} to={`/student-clubs/${club.slug || slugify(club.name)}`} className="clubs-wiggly-card" style={tileVars}>
                  <Star size={13} className="clubs-wiggly-sprinkle clubs-wiggly-sprinkle--star" aria-hidden="true" />
                  <Sparkle size={12} className="clubs-wiggly-sprinkle clubs-wiggly-sprinkle--sparkle" aria-hidden="true" />
                  <div className="clubs-wiggly-img-wrap">
                    {thumb ? (
                      <img src={thumb} alt={club.name} loading="lazy" />
                    ) : (
                      <div className="clubs-wiggly-icon-fallback">
                        <Icon size={36} strokeWidth={1.5} />
                      </div>
                    )}
                    <span className="clubs-wiggly-category">{club.category.replace(' Clubs', '')}</span>
                  </div>
                  <div className="clubs-wiggly-body">
                    <h3 className="clubs-wiggly-name">{club.name}</h3>
                    <p className="clubs-wiggly-desc">{club.desc}</p>
                    <span className="clubs-wiggly-link">
                      View Club
                      <span className="clubs-wiggly-link-arrow"><ArrowRight size={12} /></span>
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Student Voices — admin-editable via Content Blocks (Clubs —
          Testimonials, including an optional "Featured Leader"-style badge
          per story) and (Clubs — Why Join Clubs); the photo collage reuses
          the same "Clubs in Action" photos as the gallery section below
          (Site Photos -> Campus Life -> Clubs), so it needs no separate
          admin surface. Shows sensible defaults until an admin adds real
          content, same pattern as CounterSection's defaultCounters. */}
      <section className="section clubs-voices-section">
        <div className="container">
          <div className="clubs-voices-header">
            <div className="reveal">
              <span className="section-label"><Sparkles size={14} /> Student Voices &amp; Journeys</span>
              <h2 className="clubs-voices-title">
                Real People. <span className="clubs-voices-title--accent">Real Experiences.</span>
              </h2>
              <p className="clubs-voices-subtitle">
                Hear directly from student leaders and creators across VWU on how club communities ignited their passion, leadership, and careers.
              </p>
            </div>
            
          </div>

          <div className={`clubs-voices-grid${collagePhotos.length === 0 ? ' clubs-voices-grid--no-collage' : ''}`}>
            {/* Story card + carousel controls */}
            <div className="clubs-story-card">
              <div className="clubs-story-top">
                <div className="clubs-story-stars">
                  {Array.from({ length: 5 }, (_, i) => <Star key={i} size={13} fill="currentColor" />)}
                  <span>5.0 Star Story</span>
                </div>
                {activeStory.icon && <span className="clubs-story-badge">{activeStory.icon}</span>}
              </div>

              <Quote size={30} className="clubs-story-quote-icon" />
              <p className="clubs-story-quote">"{activeStory.desc}"</p>

              <div className="clubs-story-author">
                {activeStory.slug && activeStory.slug.startsWith('http') ? (
                  <img src={activeStory.slug} alt={activeStory.title} className="clubs-story-avatar" />
                ) : (
                  <div className="clubs-story-avatar clubs-story-avatar--initials">
                    {activeStory.title.split(' ').slice(0, 2).map((n) => n[0]).join('').toUpperCase()}
                  </div>
                )}
                <div>
                  <div className="clubs-story-name">
                    {activeStory.title} <BadgeCheck size={14} className="clubs-story-verified" />
                  </div>
                  <div className="clubs-story-role">{activeStory.value}</div>
                </div>
              </div>

              {testimonials.length > 1 && (
                <div className="clubs-story-controls">
                  <div className="clubs-story-dots">
                    {testimonials.map((t, i) => (
                      <button
                        key={t.id}
                        type="button"
                        className={`clubs-story-dot ${i === storyIndex % testimonials.length ? 'clubs-story-dot--active' : ''}`}
                        onClick={() => setStoryIndex(i)}
                        aria-label={`View story ${i + 1}`}
                      />
                    ))}
                  </div>
                  <div className="clubs-story-arrows">
                    <button type="button" onClick={() => setStoryIndex((i) => i - 1)} aria-label="Previous story">
                      <ChevronLeft size={16} />
                    </button>
                    <button type="button" onClick={() => setStoryIndex((i) => i + 1)} aria-label="Next story">
                      <ChevronRight size={16} />
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Photo collage — reuses the "Clubs in Action" photos (Site
                Photos -> Campus Life -> Clubs); hidden entirely until an
                admin uploads at least one, rather than showing an empty
                frame around just the sticky note. */}
            {collagePhotos.length > 0 && (
              <div className="clubs-voices-collage">
                <div className="clubs-collage-sticky-note">
                  <Sparkle size={14} /> Same Passion, Different Stories
                </div>
                {collagePhotos.map((photo, i) => (
                  <div key={photo.src} className={`clubs-collage-polaroid clubs-collage-polaroid--${i}`}>
                    <img src={photo.src} alt={photo.alt} />
                    <span>{photo.caption || photo.alt}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Why Join Clubs? */}
            <div className="clubs-why-join-card">
              <div className="clubs-why-join-head">
                <div>
                  <h3>Why Join Clubs?</h3>
                  <p>The VWU holistic development advantage</p>
                </div>
                <span className="clubs-why-join-badge">{whyJoinItems.length} Pillars</span>
              </div>
              <ul className="clubs-why-join-list">
                {whyJoinItems.map((item, i) => {
                  const Icon = resolveContentIcon(item.icon) || Sparkles;
                  const tile = WHY_JOIN_TILE_COLORS[i % WHY_JOIN_TILE_COLORS.length];
                  return (
                    <li key={item.id}>
                      <span className="clubs-why-join-icon" style={{ background: tile.bg, color: tile.fg }}>
                        <Icon size={17} strokeWidth={2} />
                      </span>
                      <div>
                        <div className="clubs-why-join-item-title">{item.title}</div>
                        <div className="clubs-why-join-item-desc">{item.desc}</div>
                      </div>
                    </li>
                  );
                })}
              </ul>
              <div className="clubs-why-join-footer">
                <span className="clubs-why-join-dot" /> 94% report career growth
                <Link to="/student-clubs">Read Stories <ArrowRight size={13} /></Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Club Gallery — auto-scrolling photo strip below Student Voices.
          Admin-editable via the same Site Photos -> Campus Life -> Clubs
          slots the Voices collage reads (page 'campus', section 'clubs'),
          so it needs no separate admin surface. */}
      {galleryPhotos.length > 0 && (
        <section className="section clubs-gallery-section">
          <div className="container">
            <div className="clubs-gallery-header">
              <span className="section-label"><Sparkles size={14} /> Club Gallery</span>
              <h2 className="clubs-gallery-title">Moments Across Our Clubs</h2>
              <p className="clubs-gallery-subtitle">
                A glimpse of the workshops, festivals, and outreach that define campus life at VWU.
              </p>
            </div>
            <ClubsGalleryCarousel photos={galleryPhotos} />
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="clubs-cta-section">
        <div className="container clubs-cta-inner reveal">
          <p className="clubs-cta-script">Your Passion<br />Our Community</p>
          <div className="clubs-cta-main">
            <h2 className="clubs-cta-heading">Join a Club Today</h2>
            <p className="clubs-cta-subtitle">Connect. Collaborate. Create.</p>
            <div className="clubs-cta-actions">
              <button
                type="button"
                className="btn clubs-cta-btn clubs-cta-btn--primary"
                onClick={() => { setActiveCategory(null); smoothScrollTo('#clubs-grid'); }}
              >
                View All Clubs
              </button>
              <Link to="/events" className="btn clubs-cta-btn clubs-cta-btn--outline">Upcoming Events</Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
