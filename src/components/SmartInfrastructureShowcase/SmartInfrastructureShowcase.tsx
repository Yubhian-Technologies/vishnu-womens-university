import { Link } from 'react-router-dom';
import { 
  ArrowRight, 
  MapPin, 
  ShieldCheck 
} from 'lucide-react';
import { useSitePhotos } from '../../hooks/useSitePhotos';
import SmoothImage from '../SmoothImage/SmoothImage';
import './SmartInfrastructureShowcase.css';

const DEFAULT_INFRA_IMAGE = '/images/ENGINEERED-SECION.jpeg';

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
