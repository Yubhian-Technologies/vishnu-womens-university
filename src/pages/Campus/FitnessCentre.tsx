import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Dumbbell, 
  Trophy, 
  Sparkles, 
  ArrowRight, 
  Award, 
  Flame, 
  ChevronRight
} from 'lucide-react';
import SEO from '../../components/SEO/SEO';
import PhotoGrid from '../../components/PhotoGrid/PhotoGrid';
import { useSitePhotos, useSitePhotosLoading } from '../../hooks/useSitePhotos';
import { smoothScrollTo } from '../../lib/smoothScroll';
import './FitnessCentre.css';

const DEFAULT_PHOTOS = [
  { src: '/images/sports-hero-bg.jpg', alt: 'VISHNU Fitness Centre & Gymnasium', caption: 'Modern Gym Equipment & Fitness Facilities' },
  { src: '/images/sports-trophy-banner.jpg', alt: 'Sports & Athletic Competitions', caption: 'State & Inter-Collegiate Tournaments' },
  { src: '/images/sports-volleyball-champion.jpg', alt: 'Student Sports Training', caption: 'Physical Stamina & Sports Coaching' },
  { src: '/images/hall-of-champions-banner.jpg', alt: 'Hall of Champions', caption: 'Sports & Fitness Champions' },
  { src: '/images/vibrant-campus.png', alt: 'VWU Campus Active Life', caption: 'Yoga & Active Campus Wellness' }
];

export default function FitnessCentre() {
  const photos = useSitePhotos('campus', 'fitness-centre', DEFAULT_PHOTOS);
  // Until Firestore actually responds, an admin-uploaded photo can't be
  // told apart from "none uploaded yet" — rendering `photos` immediately
  // would flash the hardcoded default photo on every load/refresh before
  // swapping to the real uploaded one a moment later. Shares useSitePhotos'
  // subscription (not a separate listener) so this resolves at the exact
  // same moment `photos` itself does.
  const photosLoading = useSitePhotosLoading();

  useEffect(() => {
    document.title = "VISHNU Fitness Centre | Vishnu Women's University";
  }, []);

  const handleScrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      const top = el.getBoundingClientRect().top + window.scrollY - 100;
      smoothScrollTo(top);
    }
  };

  const heroBg = photosLoading ? undefined : (photos[0]?.src || '/images/sports-hero-bg.jpg');
  const ethosImg = photosLoading ? undefined : (photos[1]?.src || '/images/sports-trophy-banner.jpg');
  const photo1 = photosLoading ? undefined : (photos[0]?.src || '/images/sports-hero-bg.jpg');
  const photo2 = photosLoading ? undefined : (photos[1]?.src || '/images/sports-trophy-banner.jpg');
  const photo3 = photosLoading ? undefined : (photos[2]?.src || '/images/sports-volleyball-champion.jpg');
  const photo4 = photosLoading ? undefined : (photos[3]?.src || '/images/hall-of-champions-banner.jpg');

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
          2. CAMPUS FITNESS ETHOS (Exact Image 2 Cultural Initiatives Replica)
          ==================================================================== */}
      <section className="fc-ethos-layout-section" id="ethos-layout-section">
        <div className="fc-container-wide">
          <div className="fc-ethos-layout-grid">
            
            {/* Left Column: Tag, Title, Subtitle & 4 Icon Badges Row */}
            <div className="fc-ethos-text-column">
              <span className="fc-ethos-tag">CAMPUS FITNESS ETHOS</span>
              <h2 className="fc-ethos-main-title">Four Pillars of Vishnu Fitness Centre</h2>
              <p className="fc-ethos-main-sub">
                Building endurance, competitive excellence, and long-term wellness for every student.
              </p>

              {/* 4 Icon Badges Row */}
              <div className="fc-badges-row">
                <div className="fc-badge-item">
                  <div className="fc-badge-circle">
                    <Dumbbell size={24} />
                  </div>
                  <h4 className="fc-badge-title">Modern Equipment</h4>
                  <p className="fc-badge-sub">Sophisticated gym machines</p>
                </div>

                <div className="fc-badge-item">
                  <div className="fc-badge-circle">
                    <Award size={24} />
                  </div>
                  <h4 className="fc-badge-title">Trained Instructors</h4>
                  <p className="fc-badge-sub">Professional supervision</p>
                </div>

                <div className="fc-badge-item">
                  <div className="fc-badge-circle">
                    <Trophy size={24} />
                  </div>
                  <h4 className="fc-badge-title">Tournament Champions</h4>
                  <p className="fc-badge-sub">Inter-collegiate medals</p>
                </div>

                <div className="fc-badge-item">
                  <div className="fc-badge-circle">
                    <Sparkles size={24} />
                  </div>
                  <h4 className="fc-badge-title">Yoga & Mind Balance</h4>
                  <p className="fc-badge-sub">Flexibility & stress relief</p>
                </div>
              </div>
            </div>

            {/* Middle Column: Cascading Overlapping Tilted Polaroid Photos */}
            <div className="fc-polaroid-stack">
              <div className="fc-polaroid-card p-1">
                {photo1 ? <img src={photo1} alt="Fitness Centre Facility 1" /> : <div className="fc-img-skeleton" />}
              </div>
              <div className="fc-polaroid-card p-2">
                {photo2 ? <img src={photo2} alt="Fitness Centre Facility 2" /> : <div className="fc-img-skeleton" />}
              </div>
              <div className="fc-polaroid-card p-3">
                {photo3 ? <img src={photo3} alt="Fitness Centre Facility 3" /> : <div className="fc-img-skeleton" />}
              </div>
              <div className="fc-polaroid-card p-4">
                {photo4 ? <img src={photo4} alt="Fitness Centre Facility 4" /> : <div className="fc-img-skeleton" />}
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ====================================================================
          3. ETHOS BODY PARAGRAPHS & DETAILS
          ==================================================================== */}
      <section className="fc-body-section">
        <div className="fc-container">
          <div className="fc-body-grid">
            <div className="fc-body-box">
              <span className="fc-ethos-tag">HEALTH & VITALITY</span>
              <h2 className="fc-ethos-main-title">A Strong Mind Resides in a Healthy Body</h2>
              <p>
                A strong mind resides in a healthy body. This saying has never been more significant. The fast pace of modern lifestyle has led to an unimaginable amount of physical and psychological stress on human body and mind. Consequently, demand for trained fitness instructors has increased manifold. Vishnu Fitness Center with its sophisticated modern equipment improves physical fitness for sound health.
              </p>
              <p>
                Students often compete in Inter-Collegiate, Inter-University and State Level tournaments and win prizes and medals. Vishnu Fitness Center is a source of health generation and physical stamina. All types of sports and games have a place on this campus. Even Yoga training is provided, emphasizing the physical and mental fitness of students.
              </p>
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
              <span className="fc-ethos-tag" style={{ justifyContent: 'center' }}>FACILITY GALLERY</span>
              <h2 className="fc-ethos-main-title">Fitness Centre in Action</h2>
            </div>
            <PhotoGrid images={photos} label="" title="VISHNU Fitness Centre" columns={3} layout="default" />
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
