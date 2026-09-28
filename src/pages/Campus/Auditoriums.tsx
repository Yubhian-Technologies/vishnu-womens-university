import { useEffect } from "react";
import { Link } from "react-router-dom";
import SEO from "../../components/SEO/SEO";
import { usePageBanners } from "../../hooks/usePageBanners";
import { useContentBlocks } from "../../hooks/useContentBlocks";
import { useSitePhotos } from "../../hooks/useSitePhotos";
import type { PhotoItem } from "../../components/PhotoGrid/PhotoGrid";
import { renderBold } from '../../lib/boldText';
import "./Auditoriums.css";

// Bespoke page (not the generic CampusLifeDetail.tsx -> campusLifeItems
// renderer every other Campus Life facility uses) — intercepts
// /campus/auditoriums ahead of the /campus/:slug catch-all in App.tsx, same
// pattern as Clubs.tsx / Wellness.tsx / Sports.tsx. The hero image/title/
// subtitle still reuse the facility's existing, already admin-editable
// "campus-auditoriums" Hero Banners slot (auto-registered from
// campusFacilities.data.ts) — nothing new needed there. Everything else
// (tagline/caption, the two tile rows, the About section, and the gallery)
// is wired to new Content Blocks / Site Photos sections below.
const DEFAULT_HERO_IMAGE =
  "https://images.unsplash.com/photo-1580881783365-1e6d599c39e0?w=1600&q=80";
const DEFAULT_HERO_TITLE = "Auditoriums at Vishnu Women’s University";
const DEFAULT_HERO_SUBTITLE = "Versatile venues for academic events, cultural programmes, student activities and institutional gatherings.";
const DEFAULT_HERO_TAGLINE = "Ideas · Events · People · Possibilities";
const DEFAULT_HERO_CAPTION = "A Space for Every Big Idea";
const DEFAULT_HERO_SCREEN = "Ideas\nInspire\nPeople";

const DEFAULT_TOP_FEATURES = [
  {
    id: "tf1",
    title: "Academic Events",
    desc: "Seminars, lectures and conferences",
  },
  {
    id: "tf2",
    title: "Cultural Programmes",
    desc: "Performances, celebrations and events",
  },
  {
    id: "tf3",
    title: "Student Activities",
    desc: "Workshops, debates and discussions",
  },
  {
    id: "tf4",
    title: "Modern Facilities",
    desc: "Audio-visual systems and presentation facilities",
  },
];

const DEFAULT_BOTTOM_STATS = [
  {
    id: "bs1",
    title: "Multiple Venues",
    desc: "Indoor, Open-Air, Mini-Auditorium, Seminar Halls",
  },
  {
    id: "bs2",
    title: "Up to 250",
    desc: "Seating capacity (in Seminar Halls)",
  },
  {
    id: "bs3",
    title: "Modern AV Setup",
    desc: "Projectors, sound systems, internet connectivity",
  },
  {
    id: "bs4",
    title: "Comfortable & Accessible",
    desc: "Air-conditioned spaces with modern facilities",
  },
];

// Kept in sync with the real, existing copy about VWU's auditoriums
// (src/pages/Campus/campusFacilities.data.ts) rather than generic
// placeholder text.
const DEFAULT_ABOUT_HEADING = "Spaces for Learning, Expression and Engagement";
const DEFAULT_ABOUT_BODY = [
  "Vishnu Women’s University offers an Indoor Auditorium, Open-Air Auditorium, Mini-Auditorium and Seminar Halls for academic, cultural and student activities throughout the year.",
  "The venues support seminars, conferences, debates, workshops, performances and institutional events, providing flexible spaces for both large gatherings and smaller interactive sessions.",
];
const DEFAULT_ABOUT_QUOTE =
  "More than just halls, our auditoriums bring people, ideas, and opportunities together.";
const DEFAULT_ABOUT_ATTRIBUTION = "Vishnu Women's University";
const DEFAULT_ABOUT_IMAGE =
  "https://images.unsplash.com/photo-1519452575417-564c1401ecc0?w=900&q=80";

// 10 photos matching the 10 slots of the organic cluster collage layout (Image 1 style)
const DEFAULT_GALLERY: PhotoItem[] = [
  {
    src: "https://images.unsplash.com/photo-1580881783365-1e6d599c39e0?w=500&h=750&fit=crop&q=80",
    alt: "Auditorium interior",
    caption: "Main Auditorium",
  },
  {
    src: "https://images.unsplash.com/photo-1517457373958-b7bdd4587205?w=450&h=680&fit=crop&q=80",
    alt: "Guest lecture in session",
    caption: "Guest Lecture",
  },
  {
    src: "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=600&h=380&fit=crop&q=80",
    alt: "Seminar hall in session",
    caption: "Seminar Hall",
  },
  {
    src: "https://images.unsplash.com/photo-1523580494863-6f3031224c94?w=760&h=620&fit=crop&q=80",
    alt: "Cultural programme performance",
    caption: "Cultural Programme",
  },
  {
    src: "https://images.unsplash.com/photo-1475721042765-52a63b1e2f34?w=450&h=700&fit=crop&q=80",
    alt: "Open-air auditorium",
    caption: "Open-Air Auditorium",
  },
  {
    src: "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=420&h=420&fit=crop&q=80",
    alt: "Panel discussion on stage",
    caption: "Panel Discussion",
  },
  {
    src: "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=520&h=560&fit=crop&q=80",
    alt: "Audience at a campus event",
    caption: "Student Audience",
  },
  {
    src: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=420&h=620&fit=crop&q=80",
    alt: "Students collaborating",
    caption: "Collaborative Session",
  },
  {
    src: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=560&h=440&fit=crop&q=80",
    alt: "Campus event gathering",
    caption: "Campus Gathering",
  },
  {
    src: "https://images.unsplash.com/photo-1511578314322-379afb476865?w=500&h=700&fit=crop&q=80",
    alt: "Outdoor campus event",
    caption: "Outdoor Venue",
  },
];

const BOTTOM_TILE_COLORS = [
  { bg: "#FDF6E3", fg: "#6D5415" },
  { bg: "#EAF7EE", fg: "#235E3A" },
  { bg: "#E9F1FC", fg: "#21437C" },
  { bg: "#F1F3F5", fg: "#343A40" },
];

export default function Auditoriums() {
  const { slides: heroSlides } = usePageBanners("campus-auditoriums");
  const heroExtra = useContentBlocks("auditoriums", "hero")[0];
  const liveTopFeatures = useContentBlocks("auditoriums", "topFeatures");
  const liveBottomStats = useContentBlocks("auditoriums", "bottomStats");
  const about = useContentBlocks("auditoriums", "about")[0];
  const galleryPhotos = useSitePhotos("campus", "auditoriums", DEFAULT_GALLERY);

  const topFeatures =
    liveTopFeatures.length > 0 ? liveTopFeatures : DEFAULT_TOP_FEATURES;
  const bottomStats =
    liveBottomStats.length > 0 ? liveBottomStats : DEFAULT_BOTTOM_STATS;

  const heroSlide = heroSlides[0];
  const heroImage = heroSlide?.imageUrl || DEFAULT_HERO_IMAGE;
  const heroTitle = heroSlide?.title || DEFAULT_HERO_TITLE;
  const heroSubtitle = heroSlide?.subtitle || DEFAULT_HERO_SUBTITLE;
  const heroTagline = (heroExtra?.value || DEFAULT_HERO_TAGLINE)
    .split("·")
    .map((s) => s.trim())
    .filter(Boolean);
  const heroCaption = heroExtra?.title || DEFAULT_HERO_CAPTION;
  const heroScreenLines = (heroExtra?.desc || DEFAULT_HERO_SCREEN)
    .split("\n")
    .filter(Boolean);

  const aboutHeading = about?.title || DEFAULT_ABOUT_HEADING;
  const aboutBody = about?.desc
    ? about.desc.split("\n").filter(Boolean)
    : DEFAULT_ABOUT_BODY;
  const aboutQuote = about?.value || DEFAULT_ABOUT_QUOTE;
  const aboutAttribution = about?.icon || DEFAULT_ABOUT_ATTRIBUTION;
  const aboutImage = about?.slug || DEFAULT_ABOUT_IMAGE;

  useEffect(() => {
    document.title = "Auditoriums | Campus Life | VWU";
  }, []);

  return (
    <main className="page-wrapper">
      <SEO
        title="Auditoriums | Vishnu Women's University"
        description="Versatile indoor, open-air, and mini-auditorium spaces for academic, cultural, and institutional events at Vishnu Women's University."
        canonicalPath="/campus/auditoriums"
      />

      {/* Hero */}
      <section className="aud-hero-section">
        <div className="aud-hero-card">
          <div className="aud-hero-text">
            <h1 className="aud-hero-title">{heroTitle}</h1>
            <p className="aud-hero-subtitle">{renderBold(heroSubtitle)}</p>
            <div className="aud-hero-tagline">
              {heroTagline.map((word) => (
                <span key={word}>{word}</span>
              ))}
            </div>
          </div>
          <div className="aud-hero-media">
            <img loading="lazy" src={heroImage} alt="" className="aud-hero-bg-img" />
            <div className="aud-hero-media-overlay" />
            <div className="aud-hero-screen" aria-hidden="true">
              {heroScreenLines.map((line, i) => (
                <p key={i}>{renderBold(line)}</p>
              ))}
            </div>
            <div className="aud-hero-caption">{renderBold(heroCaption)}</div>
          </div>
        </div>
      </section>

      {/* Custom Auditoriums List Section */}
      <section className="section bg-off-white">
        <div className="container">
          <div style={{ maxWidth: '900px', margin: '0 auto', padding: '2rem 0' }}>
            <h2 className="section-title" style={{ fontSize: '2rem', marginBottom: '1rem', color: 'var(--color-heading)' }}>
              {heroTitle}
            </h2>
            <p style={{ fontSize: '1.15rem', color: 'var(--color-text)', lineHeight: 1.7, marginBottom: '3rem' }}>
              {renderBold(heroSubtitle)}
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
              {topFeatures.map((f) => (
                <div key={f.id} style={{ borderLeft: '4px solid var(--color-primary)', paddingLeft: '1.5rem' }}>
                  <h3 style={{ fontSize: '1.25rem', color: 'var(--color-heading)', marginBottom: '0.5rem' }}>
                    {f.title}
                  </h3>
                  <p style={{ fontSize: '1.1rem', color: 'var(--color-text-light)' }}>
                    {renderBold(f.desc)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* About */}
      <section className="section bg-white">
        <div className="container">
          <div className="aud-about-grid">
            <div>
              <span className="section-label">About Our Auditoriums</span>
              <h2 className="aud-about-heading">{aboutHeading}</h2>
              <div className="aud-about-body">
                {aboutBody.map((para, i) => (
                  <p key={i}>{renderBold(para)}</p>
                ))}
              </div>
            </div>
            <div className="aud-about-media">
              <div className="aud-about-photo">
                <img src={aboutImage} alt={aboutHeading} loading="lazy" />
              </div>
              <div className="aud-about-quote">
                <p>&ldquo;{aboutQuote}&rdquo;</p>
                <cite>{aboutAttribution}</cite>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom stat tiles */}
      <div className="aud-tiles-row">
        {bottomStats.map((s, i) => {
          const color = BOTTOM_TILE_COLORS[i % BOTTOM_TILE_COLORS.length];
          return (
            <div
              key={s.id}
              className="aud-tile"
              style={{ background: color.bg }}
            >
              <p className="aud-tile-title" style={{ color: color.fg }}>
                {s.title}
              </p>
              <p className="aud-tile-desc" style={{ color: color.fg }}>
                {renderBold(s.desc)}
              </p>
            </div>
          );
        })}
      </div>

      {/* Gallery — organic scattered photo cluster collage (matching Image 1 layout) */}
      {galleryPhotos.length > 0 && (
        <section className="aud-gallery-section bg-off-white">
          <div className="container">
            <div className="aud-gallery-header">
              <h2 className="section-title">Inside Our Auditoriums</h2>
              <p>
                Explore the venues that host academic programmes, cultural
                events and student activities at Vishnu Women&rsquo;s
                University.
              </p>
            </div>
            <div className="aud-collage-grid">
              {galleryPhotos.slice(0, 6).map((photo, i) => (
                <div
                  key={photo.src || i}
                  className={`aud-collage-item aud-collage-item-${i + 1}`}
                >
                  <img
                    src={photo.src}
                    alt={photo.alt || `Auditorium gallery photo ${i + 1}`}
                    loading="lazy"
                  />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      <section style={{ background: 'var(--color-primary)', padding: 'var(--space-14) 0' }}>
        <div className="container" style={{ textAlign: 'center', color: 'var(--color-white)' }}>
          <h2 style={{ color: 'var(--color-white)', marginBottom: 'var(--space-2)' }}>
            Explore More Campus Facilities
          </h2>
          <p style={{ fontSize: '1.1rem', opacity: 0.9, maxWidth: '600px', margin: '0 auto var(--space-6)' }}>
            Discover the spaces and facilities that support learning, collaboration and student life at Vishnu Women&rsquo;s University.
          </p>
          <div style={{ display: 'flex', gap: 'var(--space-4)', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/student-life" className="btn btn-secondary">Discover Student Life</Link>
          </div>
        </div>
      </section>
    </main>
  );
}
