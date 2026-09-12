import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import SEO from '../../components/SEO/SEO';
import { usePageBanners } from '../../hooks/usePageBanners';
import { useContentBlocks } from '../../hooks/useContentBlocks';
import { useSitePhotos } from '../../hooks/useSitePhotos';
import type { PhotoItem } from '../../components/PhotoGrid/PhotoGrid';
import './Auditoriums.css';

// Bespoke page (not the generic CampusLifeDetail.tsx -> campusLifeItems
// renderer every other Campus Life facility uses) — intercepts
// /campus/auditoriums ahead of the /campus/:slug catch-all in App.tsx, same
// pattern as Clubs.tsx / Wellness.tsx / Sports.tsx. The hero image/title/
// subtitle still reuse the facility's existing, already admin-editable
// "campus-auditoriums" Hero Banners slot (auto-registered from
// campusFacilities.data.ts) — nothing new needed there. Everything else
// (tagline/caption, the two tile rows, the About section, and the gallery)
// is wired to new Content Blocks / Site Photos sections below.
const DEFAULT_HERO_IMAGE = 'https://images.unsplash.com/photo-1580881783365-1e6d599c39e0?w=1600&q=80';
const DEFAULT_HERO_TITLE = 'Auditoriums';
const DEFAULT_HERO_SUBTITLE = 'Versatile Spaces for Academic, Cultural, and Institutional Events';
const DEFAULT_HERO_TAGLINE = 'Ideas · Events · People · Possibilities';
const DEFAULT_HERO_CAPTION = 'A Space for Every Big Idea';
const DEFAULT_HERO_SCREEN = 'Ideas\nInspire\nPeople';

const DEFAULT_TOP_FEATURES = [
  { id: 'tf1', title: 'Academic Events', desc: 'Seminars, lectures, conferences' },
  { id: 'tf2', title: 'Cultural Programmes', desc: 'Celebrations, performances' },
  { id: 'tf3', title: 'Student Activities', desc: 'Workshops, debates, discussions' },
  { id: 'tf4', title: 'Modern Facilities', desc: 'Audio-visual systems, projectors' },
];

const DEFAULT_BOTTOM_STATS = [
  { id: 'bs1', title: 'Multiple Venues', desc: 'Indoor, Open-Air, Mini-Auditorium, Seminar Halls' },
  { id: 'bs2', title: 'Up to 250', desc: 'Seating capacity (in Seminar Halls)' },
  { id: 'bs3', title: 'Modern AV Setup', desc: 'Projectors, sound systems, internet connectivity' },
  { id: 'bs4', title: 'Comfortable & Accessible', desc: 'Air-conditioned spaces with modern facilities' },
];

// Kept in sync with the real, existing copy about VWU's auditoriums
// (src/pages/Campus/campusFacilities.data.ts) rather than generic
// placeholder text.
const DEFAULT_ABOUT_HEADING = "Auditoriums at Vishnu Women's University";
const DEFAULT_ABOUT_BODY = [
  "Vishnu Women's University houses an Indoor Auditorium, Open-Air Auditorium, Mini-Auditorium, and numerous Seminar Halls that support the cultural programmes, seminars, debates, plays, and other events held throughout the year — bringing students together to share, discuss, and explore knowledge in their areas of learning.",
  'The Smt. B. Seetha Indoor Auditorium is centrally air-conditioned, fully sound-proofed, and equipped with the latest technology for audio/video presentations. The Open-Air Auditorium and Mini-Auditorium host a wide variety of student activities, while the Seminar Halls provide flexible, well-equipped spaces for smaller academic and collaborative sessions.',
];
const DEFAULT_ABOUT_QUOTE = 'More than just halls, our auditoriums bring people, ideas, and opportunities together.';
const DEFAULT_ABOUT_ATTRIBUTION = "Vishnu Women's University";
const DEFAULT_ABOUT_IMAGE = 'https://images.unsplash.com/photo-1519452575417-564c1401ecc0?w=900&q=80';

// 10 photos matching the 10 slots of the organic cluster collage layout (Image 1 style)
const DEFAULT_GALLERY: PhotoItem[] = [
  { src: 'https://images.unsplash.com/photo-1580881783365-1e6d599c39e0?w=500&h=750&fit=crop&q=80', alt: 'Auditorium interior', caption: 'Main Auditorium' },
  { src: 'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?w=450&h=680&fit=crop&q=80', alt: 'Guest lecture in session', caption: 'Guest Lecture' },
  { src: 'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=600&h=380&fit=crop&q=80', alt: 'Seminar hall in session', caption: 'Seminar Hall' },
  { src: 'https://images.unsplash.com/photo-1523580494863-6f3031224c94?w=760&h=620&fit=crop&q=80', alt: 'Cultural programme performance', caption: 'Cultural Programme' },
  { src: 'https://images.unsplash.com/photo-1475721042765-52a63b1e2f34?w=450&h=700&fit=crop&q=80', alt: 'Open-air auditorium', caption: 'Open-Air Auditorium' },
  { src: 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=420&h=420&fit=crop&q=80', alt: 'Panel discussion on stage', caption: 'Panel Discussion' },
  { src: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=520&h=560&fit=crop&q=80', alt: 'Audience at a campus event', caption: 'Student Audience' },
  { src: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=420&h=620&fit=crop&q=80', alt: 'Students collaborating', caption: 'Collaborative Session' },
  { src: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=560&h=440&fit=crop&q=80', alt: 'Campus event gathering', caption: 'Campus Gathering' },
  { src: 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=500&h=700&fit=crop&q=80', alt: 'Outdoor campus event', caption: 'Outdoor Venue' },
];

// Tile background/text colours cycled across the two feature-tile rows —
// kept local to this page, same small hand-picked-palette convention used
// elsewhere (e.g. Clubs.tsx / Wellness.tsx), not a shared design token since
// it's purely decorative to this layout.
const TOP_TILE_COLORS = [
  { bg: '#FDF6E3', fg: '#6D5415' },
  { bg: '#F3ECFB', fg: '#533184' },
  { bg: '#E9F1FC', fg: '#21437C' },
  { bg: '#EAF7EE', fg: '#235E3A' },
];
const BOTTOM_TILE_COLORS = [
  { bg: '#FDF6E3', fg: '#6D5415' },
  { bg: '#EAF7EE', fg: '#235E3A' },
  { bg: '#E9F1FC', fg: '#21437C' },
  { bg: '#F1F3F5', fg: '#343A40' },
];

export default function Auditoriums() {
  const { slides: heroSlides } = usePageBanners('campus-auditoriums');
  const heroExtra = useContentBlocks('auditoriums', 'hero')[0];
  const liveTopFeatures = useContentBlocks('auditoriums', 'topFeatures');
  const liveBottomStats = useContentBlocks('auditoriums', 'bottomStats');
  const about = useContentBlocks('auditoriums', 'about')[0];
  const galleryPhotos = useSitePhotos('campus', 'auditoriums', DEFAULT_GALLERY);

  const topFeatures = liveTopFeatures.length > 0 ? liveTopFeatures : DEFAULT_TOP_FEATURES;
  const bottomStats = liveBottomStats.length > 0 ? liveBottomStats : DEFAULT_BOTTOM_STATS;

  const heroSlide = heroSlides[0];
  const heroImage = heroSlide?.imageUrl || DEFAULT_HERO_IMAGE;
  const heroTitle = heroSlide?.title || DEFAULT_HERO_TITLE;
  const heroSubtitle = heroSlide?.subtitle || DEFAULT_HERO_SUBTITLE;
  const heroTagline = (heroExtra?.value || DEFAULT_HERO_TAGLINE).split('·').map((s) => s.trim()).filter(Boolean);
  const heroCaption = heroExtra?.title || DEFAULT_HERO_CAPTION;
  const heroScreenLines = (heroExtra?.desc || DEFAULT_HERO_SCREEN).split('\n').filter(Boolean);

  const aboutHeading = about?.title || DEFAULT_ABOUT_HEADING;
  const aboutBody = about?.desc ? about.desc.split('\n').filter(Boolean) : DEFAULT_ABOUT_BODY;
  const aboutQuote = about?.value || DEFAULT_ABOUT_QUOTE;
  const aboutAttribution = about?.icon || DEFAULT_ABOUT_ATTRIBUTION;
  const aboutImage = about?.slug || DEFAULT_ABOUT_IMAGE;

  useEffect(() => {
    document.title = 'Auditoriums | Campus Life | VWU';
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
            <div className="aud-hero-breadcrumb">
              <Link to="/">Home</Link>
              <span>/</span>
              <Link to="/campus">Campus Life</Link>
              <span>/</span>
              <strong>Auditoriums</strong>
            </div>
            <h1 className="aud-hero-title">{heroTitle}</h1>
            <p className="aud-hero-subtitle">{heroSubtitle}</p>
            <div className="aud-hero-tagline">
              {heroTagline.map((word) => <span key={word}>{word}</span>)}
            </div>
          </div>
          <div className="aud-hero-media">
            <img src={heroImage} alt="" className="aud-hero-bg-img" />
            <div className="aud-hero-media-overlay" />
            <div className="aud-hero-screen" aria-hidden="true">
              {heroScreenLines.map((line, i) => <p key={i}>{line}</p>)}
            </div>
            <div className="aud-hero-caption">{heroCaption}</div>
          </div>
        </div>
      </section>

      {/* Top feature tiles */}
      <div className="aud-tiles-row">
        {topFeatures.map((f, i) => {
          const color = TOP_TILE_COLORS[i % TOP_TILE_COLORS.length];
          return (
            <div key={f.id} className="aud-tile" style={{ background: color.bg }}>
              <p className="aud-tile-title" style={{ color: color.fg }}>{f.title}</p>
              <p className="aud-tile-desc" style={{ color: color.fg }}>{f.desc}</p>
            </div>
          );
        })}
      </div>

      {/* About */}
      <section className="section bg-white">
        <div className="container">
          <div className="aud-about-grid">
            <div>
              <span className="section-label">About Our Auditoriums</span>
              <h2 className="aud-about-heading">{aboutHeading}</h2>
              <div className="aud-about-body">
                {aboutBody.map((para, i) => <p key={i}>{para}</p>)}
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
            <div key={s.id} className="aud-tile" style={{ background: color.bg }}>
              <p className="aud-tile-title" style={{ color: color.fg }}>{s.title}</p>
              <p className="aud-tile-desc" style={{ color: color.fg }}>{s.desc}</p>
            </div>
          );
        })}
      </div>

      {/* Gallery — organic scattered photo cluster collage (matching Image 1 layout) */}
      {galleryPhotos.length > 0 && (
        <section className="aud-gallery-section bg-off-white">
          <div className="container">
            <div className="aud-gallery-header">
              <span className="section-label">Gallery</span>
              <p>A closer look at the venues that host VWU&rsquo;s academic, cultural, and institutional life.</p>
            </div>
            <div className="aud-collage-grid">
              {galleryPhotos.slice(0, 6).map((photo, i) => (
                <div key={photo.src || i} className={`aud-collage-item aud-collage-item-${i + 1}`}>
                  <img src={photo.src} alt={photo.alt || `Auditorium gallery photo ${i + 1}`} loading="lazy" />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </main>
  );
}
