import { Link } from 'react-router-dom';
import {
  ArrowRight,
  MapPin,
  ShieldCheck,
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

// Mirrors DIFFERENTIATOR_CATEGORIES in DifferentiatorsAdmin — links to each anchor on /differentiators
const DIFF_TABS = [
  { id: 'innovation', label: 'Innovation & Entrepreneurship', icon: Rocket },
  { id: 'industry', label: 'Industry Centres of Excellence', icon: Factory },
  { id: 'research', label: 'Research & Specialised Labs', icon: Microscope },
  { id: 'global', label: 'International & Global Outreach', icon: Globe2 },
  { id: 'student', label: 'Student Development & Social Impact', icon: GraduationCap },
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

          {/* Differentiator category cards */}
          <nav className="infra-diff-cards" aria-label="Explore what sets VWU apart">
            {DIFF_TABS.map((tab) => (
              <Link key={tab.id} to={`/differentiators#${tab.id}`} className="infra-diff-card">
                <span className="infra-diff-card-icon" aria-hidden="true">
                  <tab.icon size={22} strokeWidth={1.9} />
                </span>
                <span className="infra-diff-card-label">{tab.label}</span>
                <span className="infra-diff-card-arrow" aria-hidden="true">
                  <ArrowRight size={16} />
                </span>
              </Link>
            ))}
          </nav>

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
