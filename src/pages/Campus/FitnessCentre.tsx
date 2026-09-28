import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowRight, 
  ChevronRight,
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
  { src: '/images/campus-vibrant.jpeg', alt: 'VWU Campus Active Life', caption: 'Yoga & Active Campus Wellness' }
];

export default function FitnessCentre() {
  const photos = useSitePhotos('campus', 'fitness-centre', DEFAULT_PHOTOS);
  const photosLoading = useSitePhotosLoading('campus');

  useEffect(() => {
    document.title = `Vishnu Fitness Centre | Vishnu Women's University`;
  }, []);

  const handleScrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      const top = el.getBoundingClientRect().top + window.scrollY - 100;
      smoothScrollTo(top);
    }
  };

  const heroBg = photosLoading ? undefined : (photos[0]?.src || '/images/sports-hero-bg.jpg');
  const photo1 = photosLoading ? undefined : (photos[0]?.src || '/images/sports-hero-bg.jpg');
  const photo2 = photosLoading ? undefined : (photos[1]?.src || '/images/sports-trophy-banner.jpg');
  const photo3 = photosLoading ? undefined : (photos[2]?.src || '/images/sports-volleyball-champion.jpg');
  const photo4 = photosLoading ? undefined : (photos[3]?.src || '/images/hall-of-champions-banner.jpg');

  return (
    <main className="fc-page page-wrapper">
      <SEO
        title="Vishnu Fitness Centre | Vishnu Women's University"
        description="Supporting fitness, wellness and an active lifestyle at Vishnu Women’s University."
        canonicalPath="/campus/fitness-centre"
      />

      {/* ====================================================================
          1. HERO BANNER
          ==================================================================== */}
      <section className="fc-hero" style={heroBg ? { backgroundImage: `url('${heroBg}')` } : undefined}>
        <div className="fc-hero-overlay" />

        <div className="fc-hero-content">
          <h1 className="fc-hero-title">
            Vishnu Fitness Centre
          </h1>

          <p className="fc-hero-sub">
            Supporting fitness, wellness and an active lifestyle at Vishnu Women’s University.
          </p>

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
      </section>

      {/* ====================================================================
          1.5 FITNESS & WELLNESS AT A GLANCE
          ==================================================================== */}
      <section className="section bg-white" style={{ padding: '4rem 0' }}>
        <div className="container">
          <div style={{ maxWidth: '900px', margin: '0 auto' }}>
            <h2 className="section-title" style={{ fontSize: '2rem', marginBottom: '2.5rem', color: 'var(--color-heading)' }}>
              Fitness & Wellness at a Glance
            </h2>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
              <div style={{ borderLeft: '4px solid var(--color-primary)', paddingLeft: '1.5rem' }}>
                <h3 style={{ fontSize: '1.25rem', color: 'var(--color-heading)', marginBottom: '0.5rem' }}>
                  Modern Fitness Equipment
                </h3>
                <p style={{ fontSize: '1.1rem', color: 'var(--color-text-light)' }}>
                  Training equipment for strength, cardio and general fitness.
                </p>
              </div>
              
              <div style={{ borderLeft: '4px solid var(--color-primary)', paddingLeft: '1.5rem' }}>
                <h3 style={{ fontSize: '1.25rem', color: 'var(--color-heading)', marginBottom: '0.5rem' }}>
                  Trained Instructors
                </h3>
                <p style={{ fontSize: '1.1rem', color: 'var(--color-text-light)' }}>
                  Guidance and supervision to support safe and effective workouts.
                </p>
              </div>

              <div style={{ borderLeft: '4px solid var(--color-primary)', paddingLeft: '1.5rem' }}>
                <h3 style={{ fontSize: '1.25rem', color: 'var(--color-heading)', marginBottom: '0.5rem' }}>
                  Sports & Competitive Fitness
                </h3>
                <p style={{ fontSize: '1.1rem', color: 'var(--color-text-light)' }}>
                  Facilities that complement students’ participation in inter-collegiate, inter-university and state-level competitions.
                </p>
              </div>

              <div style={{ borderLeft: '4px solid var(--color-primary)', paddingLeft: '1.5rem' }}>
                <h3 style={{ fontSize: '1.25rem', color: 'var(--color-heading)', marginBottom: '0.5rem' }}>
                  Yoga & Wellness
                </h3>
                <p style={{ fontSize: '1.1rem', color: 'var(--color-text-light)' }}>
                  Yoga and wellness activities that support flexibility, balance and overall well-being.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ====================================================================
          2. CAMPUS FITNESS FOCUS
          ==================================================================== */}
      <section className="fc-ethos-layout-section" id="ethos-layout-section">
        <div className="fc-container-wide">
          <div className="fc-ethos-layout-grid">
            
            <div className="fc-ethos-text-column">
              <h2 className="fc-ethos-main-title" style={{ marginBottom: '1.5rem' }}>Fitness for an Active Campus Life</h2>
              <div style={{ fontSize: '1.1rem', color: 'var(--color-text)', lineHeight: 1.7, marginBottom: '3rem' }}>
                <p style={{ marginBottom: '1rem' }}>
                  The Vishnu Fitness Centre provides students with a dedicated space to stay active, build physical fitness and make wellness part of everyday campus life.
                </p>
                <p>
                  Equipped with modern training facilities and supported by trained instructors, the centre caters to different fitness needs while complementing the University’s wider sports and wellness initiatives.
                </p>
              </div>

              <h2 className="fc-ethos-main-title" style={{ marginBottom: '1.5rem', fontSize: '2rem' }}>More Than a Workout</h2>
              <div style={{ fontSize: '1.1rem', color: 'var(--color-text)', lineHeight: 1.7 }}>
                <p style={{ marginBottom: '1rem' }}>
                  Regular physical activity supports endurance, strength and overall well-being. Along with fitness training, students can participate in yoga and wellness activities, creating opportunities to balance physical activity with relaxation and mental well-being.
                </p>
                <p>
                  The fitness environment also supports students involved in competitive sports, including participation in inter-collegiate, inter-university and state-level events.
                </p>
              </div>
            </div>

            {/* Middle Column: Cascading Overlapping Tilted Polaroid Photos */}
            <div className="fc-polaroid-stack">
              <div className="fc-polaroid-card p-1">
                {photo1 ? <img loading="lazy" src={photo1} alt="Fitness Centre Facility 1" /> : <div className="fc-img-skeleton" />}
              </div>
              <div className="fc-polaroid-card p-2">
                {photo2 ? <img loading="lazy" src={photo2} alt="Fitness Centre Facility 2" /> : <div className="fc-img-skeleton" />}
              </div>
              <div className="fc-polaroid-card p-3">
                {photo3 ? <img loading="lazy" src={photo3} alt="Fitness Centre Facility 3" /> : <div className="fc-img-skeleton" />}
              </div>
              <div className="fc-polaroid-card p-4">
                {photo4 ? <img loading="lazy" src={photo4} alt="Fitness Centre Facility 4" /> : <div className="fc-img-skeleton" />}
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ====================================================================
          3. PHOTO GALLERY SHOWCASE
          ==================================================================== */}
      {!photosLoading && photos.length > 0 && (
        <section className="fc-gallery-section" id="gallery-section">
          <div className="fc-container">
            <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
              <span className="fc-ethos-tag" style={{ justifyContent: 'center' }}>FACILITY GALLERY</span>
              <h2 className="fc-ethos-main-title">Inside the Vishnu Fitness Centre</h2>
              <p style={{ fontSize: '1.1rem', color: 'var(--color-text)', maxWidth: '600px', margin: '1rem auto' }}>
                Explore the equipment, training spaces and fitness activities available to students at Vishnu Women’s University.
              </p>
            </div>
            <PhotoGrid images={photos} label="" title="" columns={3} layout="default" />
          </div>
        </section>
      )}

      {/* ====================================================================
          4. EXPLORE MORE CAMPUS LIFE
          ==================================================================== */}
      <section className="fc-explore-band">
        <div className="fc-container">
          <h2 className="fc-explore-title">Explore More of Campus Life</h2>
          <p className="fc-explore-sub">Discover more opportunities to stay active, connected and well at Vishnu Women’s University.</p>
          <div className="fc-explore-pills">
            <Link to="/campus/sports-games" className="fc-explore-btn amber">
              Sports & Games
            </Link>
            <Link to="/campus/wellness" className="fc-explore-btn outline">
              Wellness Centre
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
