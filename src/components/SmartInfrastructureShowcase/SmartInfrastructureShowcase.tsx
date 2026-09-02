import { Link } from 'react-router-dom';
import { 
  BookOpen, 
  Home, 
  ArrowRight, 
  MapPin, 
  Cpu, 
  ShieldCheck 
} from 'lucide-react';
import { useSitePhotos } from '../../hooks/useSitePhotos';
import SmoothImage from '../SmoothImage/SmoothImage';
import './SmartInfrastructureShowcase.css';

const DEFAULT_INFRA_IMAGE = 'https://images.unsplash.com/photo-1541829070764-84a7d30dd3f3?w=1920&q=85';

const defaultInfraPhoto = [
  {
    src: DEFAULT_INFRA_IMAGE,
    alt: 'World-class academic buildings, advanced laboratories, and lush campus infrastructure at Vishnu Women\'s University',
    caption: 'Smart Campus Infrastructure at VWU'
  }
];

export default function SmartInfrastructureShowcase() {
  const infraPhoto = useSitePhotos('home', 'infrastructure-showcase', defaultInfraPhoto)[0];
  const photoSrc = infraPhoto?.src || DEFAULT_INFRA_IMAGE;

  return (
    <section className="infra-showcase-section" aria-label="Smart Infrastructure & Campus Showcase">
      {/* Cinematic Background Image with Gradient Scrim */}
      <div className="infra-showcase-bg-wrap">
        <SmoothImage
          src={photoSrc}
          alt={infraPhoto?.alt || defaultInfraPhoto[0].alt}
          className="infra-showcase-bg"
        />
        <div className="infra-showcase-scrim" />
      </div>

      {/* Floating Ambient Lighting */}
      <div className="infra-showcase-glow" aria-hidden="true" />

      <div className="container">
        <div className="infra-showcase-content">
          {/* Main Headline */}
          <h2 className="infra-showcase-title">
            Engineered for Discovery.<br />
            Built for Living.
          </h2>

          {/* Description */}
          <p className="infra-showcase-desc">
            VWU combines architectural elegance with next-generation technological infrastructure. From AI-accelerated high-performance computing clusters and semiconductor cleanrooms to our 1,00,000+ volume automated Central Digital Library, multi-cuisine dining, and 24x7 secure smart residences—every facility is crafted to inspire academic mastery and holistic growth.
          </p>

          {/* 3 Pillars Grid (Google M3 Glassmorphism Style) */}
          <div className="infra-showcase-pillars">
            
            {/* Pillar 1: Advanced Research & Computing Labs */}
            <Link 
              to="/campus/facilities" 
              className="infra-pillar-card" 
              aria-label="Explore Advanced Computing & Research Laboratories"
            >
              <div className="infra-pillar-top">
                <div className="infra-pillar-icon-box">
                  <Cpu size={26} strokeWidth={2} />
                </div>
                <span className="infra-pillar-tag">120+ Labs</span>
              </div>

              <div className="infra-pillar-body">
                <h3 className="infra-pillar-title">Specialized AI, Robotics &amp; Cleanroom Labs</h3>
                <p className="infra-pillar-sub">
                  Apple Mac studio, IoT testbeds, Drone fabrication, and ISRO Space Application Center.
                </p>
              </div>

              <div className="infra-pillar-footer">
                <span className="infra-pillar-link-text">Explore Facilities</span>
                <span className="infra-pillar-arrow">
                  <ArrowRight size={14} />
                </span>
              </div>
            </Link>

            {/* Pillar 2: Central Digital Library & Learning Commons */}
            <Link 
              to="/campus/central-library" 
              className="infra-pillar-card" 
              aria-label="Explore Central Digital Library & Learning Commons"
            >
              <div className="infra-pillar-top">
                <div className="infra-pillar-icon-box">
                  <BookOpen size={26} strokeWidth={2} />
                </div>
                <span className="infra-pillar-tag">1 Lakh+ Books</span>
              </div>

              <div className="infra-pillar-body">
                <h3 className="infra-pillar-title">Automated Central Digital Library</h3>
                <p className="infra-pillar-sub">
                  KOHA-automated e-learning commons, IEEE/ACM digital access, and 24x7 quiet study zones.
                </p>
              </div>

              <div className="infra-pillar-footer">
                <span className="infra-pillar-link-text">Library Tour</span>
                <span className="infra-pillar-arrow">
                  <ArrowRight size={14} />
                </span>
              </div>
            </Link>

            {/* Pillar 3: Eco-Smart Residential & Athletic Complex */}
            <Link 
              to="/campus/hostels" 
              className="infra-pillar-card" 
              aria-label="Explore Smart Hostels and Athletic Complex"
            >
              <div className="infra-pillar-top">
                <div className="infra-pillar-icon-box">
                  <Home size={26} strokeWidth={2} />
                </div>
                <span className="infra-pillar-tag">24x7 Wi-Fi &amp; Care</span>
              </div>

              <div className="infra-pillar-body">
                <h3 className="infra-pillar-title">Secure Hostels &amp; 40-Acre Sports Arena</h3>
                <p className="infra-pillar-sub">
                  Air-conditioned smart rooms, hygienic dining, floodlit courts, gymnasiums, and round-the-clock medical care.
                </p>
              </div>

              <div className="infra-pillar-footer">
                <span className="infra-pillar-link-text">Hostels &amp; Sports</span>
                <span className="infra-pillar-arrow">
                  <ArrowRight size={14} />
                </span>
              </div>
            </Link>

          </div>

          {/* Tagline & Action Row */}
          <div className="infra-showcase-bottom-row">
            <p className="infra-showcase-tagline">
              <ShieldCheck size={18} className="infra-tagline-icon" />
              <span>A secure, self-contained biophilic campus designed for peace of mind, innovation, and global leadership.</span>
            </p>

            <div className="infra-showcase-actions">
              <Link to="/campus/facilities" className="m3-infra-btn m3-infra-btn--primary">
                <span>Explore All Campus Facilities</span>
                <ArrowRight size={16} />
              </Link>
              <Link to="/campus-visit" className="m3-infra-btn m3-infra-btn--glass">
                <span>Schedule Campus Visit</span>
                <MapPin size={15} />
              </Link>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
