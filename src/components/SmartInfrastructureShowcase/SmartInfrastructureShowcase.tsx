import { Link } from 'react-router-dom';
import {
  ArrowRight,
  MapPin,
  Rocket,
  Factory,
  Microscope,
  Globe2,
  GraduationCap
} from 'lucide-react';
import { useSitePhotos } from '../../hooks/useSitePhotos';
import SmoothImage from '../SmoothImage/SmoothImage';
import './SmartInfrastructureShowcase.css';

const DEFAULT_INFRA_IMAGE = '/images/ENGINEERED-SECION.jpeg';

const DIFF_TABS = [
  { id: 'innovation', label: 'Innovation & Entrepreneurship', icon: Rocket },
  { id: 'industry', label: 'Industry Centres of Excellence', icon: Factory },
  { id: 'research', label: 'Research & Specialised Labs', icon: Microscope },
  { id: 'global', label: 'International & Global Outreach', icon: Globe2 },
  { id: 'student', label: 'Student Development & Impact', icon: GraduationCap },
];

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
      {/* Background Image Wrap */}
      <div className="infra-showcase-bg-wrap">
        <SmoothImage
          src={photoSrc}
          alt={infraPhoto?.alt || defaultInfraPhoto[0].alt}
          className="infra-showcase-bg"
        />
        {/* Balanced Gradient Scrim */}
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

          {/* Concise Description */}
          <p className="infra-showcase-desc">
            VWU combines architectural elegance with next-generation smart infrastructure. From AI computing clusters and semiconductor cleanrooms to biophilic residences and a digital central library—every facility is crafted for innovation, peace of mind, and student leadership.
          </p>

          {/* 5 Compact Feature Cards */}
          <nav className="infra-diff-cards" aria-label="Explore what sets VWU apart">
            {DIFF_TABS.map((tab) => (
              <Link key={tab.id} to={`/differentiators#${tab.id}`} className="infra-diff-card">
                <div className="infra-diff-card-header">
                  <span className="infra-diff-card-icon" aria-hidden="true">
                    <tab.icon size={18} strokeWidth={2} />
                  </span>
                  <span className="infra-diff-card-arrow" aria-hidden="true">
                    <ArrowRight size={14} />
                  </span>
                </div>
                <span className="infra-diff-card-label">{tab.label}</span>
              </Link>
            ))}
          </nav>

          {/* Action Row */}
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
    </section>
  );
}
