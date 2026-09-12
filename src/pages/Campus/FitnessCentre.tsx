import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Dumbbell, 
  Trophy, 
  Sparkles, 
  ArrowRight, 
  Award, 
  Flame, 
  ChevronRight,
  Activity,
  Heart,
  ShieldCheck,
  Target,
  Zap,
  Users
} from 'lucide-react';
import SEO from '../../components/SEO/SEO';
import PhotoGrid from '../../components/PhotoGrid/PhotoGrid';
import { useSitePhotos, useSitePhotosLoading } from '../../hooks/useSitePhotos';
import { useOrderedCollection } from '../../hooks/useCollection';
import { smoothScrollTo } from '../../lib/smoothScroll';
import { toFitnessCentreForm } from '../../lib/fitnessCentreContent';
import type { CampusLifeItemDoc } from '../Admin/sections/CampusLifeAdmin';
import './FitnessCentre.css';

const DEFAULT_PHOTOS = [
  { src: '/images/sports-hero-bg.jpg', alt: 'VISHNU Fitness Centre & Gymnasium', caption: 'Modern Gym Equipment & Fitness Facilities' },
  { src: '/images/sports-trophy-banner.jpg', alt: 'Sports & Athletic Competitions', caption: 'State & Inter-Collegiate Tournaments' },
  { src: '/images/sports-volleyball-champion.jpg', alt: 'Student Sports Training', caption: 'Physical Stamina & Sports Coaching' },
  { src: '/images/hall-of-champions-banner.jpg', alt: 'Hall of Champions', caption: 'Sports & Fitness Champions' },
  { src: '/images/campus-vibrant.jpeg', alt: 'VWU Campus Active Life', caption: 'Yoga & Active Campus Wellness' }
];

const ICON_MAP: Record<string, typeof Dumbbell> = {
  Dumbbell,
  Award,
  Trophy,
  Sparkles,
  Flame,
  Activity,
  Heart,
  ShieldCheck,
  Target,
  Zap,
  Users,
};

export default function FitnessCentre() {
  const { docs: items } = useOrderedCollection<CampusLifeItemDoc>('campusLifeItems', 'order');
  const adminItem = items.find((i) => i.slug === 'fitness-centre');
  const fcData = toFitnessCentreForm(adminItem?.fitnessCentre);

  const photos = useSitePhotos('campus', 'fitness-centre', DEFAULT_PHOTOS);
  const photosLoading = useSitePhotosLoading();

  useEffect(() => {
    document.title = `${adminItem?.title || 'VISHNU Fitness Centre'} | Vishnu Women's University`;
  }, [adminItem?.title]);

  const handleScrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      const top = el.getBoundingClientRect().top + window.scrollY - 100;
      smoothScrollTo(top);
    }
  };

  const heroBg = photosLoading ? undefined : (photos[0]?.src || '/images/sports-hero-bg.jpg');
  const ethosImg = fcData.vitalityImageUrl || (photosLoading ? undefined : (photos[1]?.src || '/images/sports-trophy-banner.jpg'));
  const photo1 = fcData.polaroidPhotos[0]?.imageUrl || (photosLoading ? undefined : (photos[0]?.src || '/images/sports-hero-bg.jpg'));
  const photo2 = fcData.polaroidPhotos[1]?.imageUrl || (photosLoading ? undefined : (photos[1]?.src || '/images/sports-trophy-banner.jpg'));
  const photo3 = fcData.polaroidPhotos[2]?.imageUrl || (photosLoading ? undefined : (photos[2]?.src || '/images/sports-volleyball-champion.jpg'));
  const photo4 = fcData.polaroidPhotos[3]?.imageUrl || (photosLoading ? undefined : (photos[3]?.src || '/images/hall-of-champions-banner.jpg'));

  return (
    <main className="fc-page page-wrapper">
      <SEO
        title="VISHNU Fitness Centre | Vishnu Women's University"
        description="Supporting Fitness, Wellness, and an Active Lifestyle with sophisticated modern equipment, trained instructors, tournament training, and Yoga sessions."
      />

      {/* ====================================================================
          1. HERO BANNER
          ==================================================================== */}
      <section className="fc-hero" style={heroBg ? { backgroundImage: `url('${heroBg}')` } : undefined}>
        <div className="fc-hero-overlay" />

        <div className="fc-hero-content">
          {/* Breadcrumb */}
          <nav className="fc-breadcrumb" aria-label="Breadcrumb">
            <Link to="/">Home</Link>
            <span>/</span>
            <Link to="/campus">Campus Life</Link>
            <span>/</span>
            <span style={{ color: '#ffffff' }}>VISHNU Fitness Centre</span>
          </nav>

          {/* Badge */}
          <div className="fc-hero-badge">
            <Flame size={15} color="#fb923c" /> VISHNU FITNESS CENTRE
          </div>

          {/* Title & Subtitle */}
          <h1 className="fc-hero-title">
            Peak Performance.
            <span className="fc-highlight">Sound Body, Dynamic Mind.</span>
          </h1>

          <p className="fc-hero-sub">
            Supporting Fitness, Wellness, and an Active Lifestyle across Vishnu Women's University.
          </p>

          {/* Buttons */}
          <div className="fc-hero-actions">
            <button 
              onClick={() => handleScrollTo('ethos-layout-section')} 
              className="fc-btn-orange"
            >
              Explore Facilities <ArrowRight size={17} />
            </button>
            <button 
              onClick={() => handleScrollTo('gallery-section')} 
              className="fc-btn-outline-white"
            >
              View Photo Gallery <ChevronRight size={17} />
            </button>
          </div>
        </div>

        {/* Bottom Translucent Stats Bar */}
        <div className="fc-hero-bar">
          <div className="fc-hero-bar-grid">
            <div className="fc-bar-item">
              <div className="fc-bar-icon">
                <Dumbbell size={22} />
              </div>
              <div className="fc-bar-text">
                <h4>Modern Equipment</h4>
                <p>Sophisticated training gear</p>
              </div>
            </div>

            <div className="fc-bar-item">
              <div className="fc-bar-icon">
                <Award size={22} />
              </div>
              <div className="fc-bar-text">
                <h4>Trained Instructors</h4>
                <p>Professional supervision</p>
              </div>
            </div>

            <div className="fc-bar-item">
              <div className="fc-bar-icon">
                <Trophy size={22} />
              </div>
              <div className="fc-bar-text">
                <h4>Tournament Excellence</h4>
                <p>Inter-collegiate medalists</p>
              </div>
            </div>

            <div className="fc-bar-item">
              <div className="fc-bar-icon">
                <Sparkles size={22} />
              </div>
              <div className="fc-bar-text">
                <h4>Yoga & Wellness</h4>
                <p>Mind & body harmony</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ====================================================================
          2. CAMPUS FITNESS FOCUS / FOUR PILLARS
          ==================================================================== */}
      <section className="fc-ethos-layout-section" id="ethos-layout-section">
        <div className="fc-container-wide">
          <div className="fc-ethos-layout-grid">
            
            {/* Left Column: Tag, Title, Subtitle & 4 Icon Badges Row */}
            <div className="fc-ethos-text-column">
              <span className="fc-ethos-tag">{fcData.pillarsTag || 'CAMPUS FITNESS FOCUS'}</span>
              <h2 className="fc-ethos-main-title">{fcData.pillarsTitle || 'Four Pillars of Vishnu Fitness Centre'}</h2>
              <p className="fc-ethos-main-sub">
                {fcData.pillarsSubtitle || 'Building endurance, competitive excellence, and long-term wellness for every student.'}
              </p>

              {/* 4 Icon Badges Row */}
              <div className="fc-badges-row">
                {fcData.pillars.map((pillar, idx) => {
                  const IconComp = ICON_MAP[pillar.icon] || Dumbbell;
                  return (
                    <div key={idx} className="fc-badge-item">
                      <div className="fc-badge-circle">
                        <IconComp size={24} />
                      </div>
                      <h4 className="fc-badge-title">{pillar.title}</h4>
                      <p className="fc-badge-sub">{pillar.desc}</p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Middle Column: Cascading Overlapping Tilted Polaroid Photos */}
            <div className="fc-polaroid-stack">
              <div className="fc-polaroid-card p-1">
                {photo1 ? <img src={photo1} alt={fcData.polaroidPhotos[0]?.alt || "Fitness Centre Facility 1"} /> : <div className="fc-img-skeleton" />}
              </div>
              <div className="fc-polaroid-card p-2">
                {photo2 ? <img src={photo2} alt={fcData.polaroidPhotos[1]?.alt || "Fitness Centre Facility 2"} /> : <div className="fc-img-skeleton" />}
              </div>
              <div className="fc-polaroid-card p-3">
                {photo3 ? <img src={photo3} alt={fcData.polaroidPhotos[2]?.alt || "Fitness Centre Facility 3"} /> : <div className="fc-img-skeleton" />}
              </div>
              <div className="fc-polaroid-card p-4">
                {photo4 ? <img src={photo4} alt={fcData.polaroidPhotos[3]?.alt || "Fitness Centre Facility 4"} /> : <div className="fc-img-skeleton" />}
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ====================================================================
          3. ETHOS BODY PARAGRAPHS & DETAILS (HEALTH & VITALITY)
          ==================================================================== */}
      <section className="fc-body-section">
        <div className="fc-container">
          <div className="fc-body-grid">
            <div className="fc-body-box">
              <span className="fc-ethos-tag">{fcData.vitalityTag || 'HEALTH & VITALITY'}</span>
              <h2 className="fc-ethos-main-title">{fcData.vitalityTitle || 'A Strong Mind Resides in a Healthy Body'}</h2>
              {fcData.vitalityParagraph1 && (
                <p>{fcData.vitalityParagraph1}</p>
              )}
              {fcData.vitalityParagraph2 && (
                <p>{fcData.vitalityParagraph2}</p>
              )}
            </div>

            <div className="fc-body-media">
              {ethosImg ? (
                <img
                  src={ethosImg}
                  alt="VWU Fitness Training Session"
                  onError={(e) => { (e.currentTarget as HTMLImageElement).src = '/images/sports-trophy-banner.jpg'; }}
                />
              ) : (
                <div className="fc-img-skeleton" style={{ height: '340px' }} />
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ====================================================================
          4. PHOTO GALLERY SHOWCASE
          ==================================================================== */}
      {!photosLoading && photos.length > 0 && (
        <section className="fc-gallery-section" id="gallery-section">
          <div className="fc-container">
            <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
              <span className="fc-ethos-tag" style={{ justifyContent: 'center' }}>{fcData.galleryTag || 'FACILITY GALLERY'}</span>
              <h2 className="fc-ethos-main-title">{fcData.galleryTitle || 'Fitness Centre in Action'}</h2>
            </div>
            <PhotoGrid images={photos} label="" title={fcData.gallerySubtitle || 'VISHNU Fitness Centre'} columns={3} layout="default" />
          </div>
        </section>
      )}

      {/* ====================================================================
          5. EXPLORE MORE CAMPUS LIFE
          ==================================================================== */}
      <section className="fc-explore-band">
        <div className="fc-container">
          <h2 className="fc-explore-title">Explore More of Campus Life</h2>
          <div className="fc-explore-pills">
            <Link to="/campus" className="fc-explore-btn amber">
              Back to Campus Life
            </Link>
            <Link to="/campus/sports" className="fc-explore-btn outline">
              Sports & Games
            </Link>
            <Link to="/campus/wellness-center" className="fc-explore-btn outline">
              Wellness Center
            </Link>
            <Link to="/student-life" className="fc-explore-btn outline">
              Student Life
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
