import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Users, ShieldCheck, Star, Activity } from 'lucide-react';
import PageHero from '../../components/PageHero/PageHero';
import CustomSectionsRenderer from '../../components/CustomSectionsRenderer/CustomSectionsRenderer';
import HealthCareDetailsTable from './HealthCareDetailsTable';
import { useOrderedCollection } from '../../hooks/useCollection';
import { useSitePhotos } from '../../hooks/useSitePhotos';
import { useContentBlocks } from '../../hooks/useContentBlocks';
import { PHOTO_NEEDED_PLACEHOLDER } from '../../lib/photoPlaceholder';
import { hasCustomSectionContent } from '../../lib/customSections';
import type { CampusLifeItemDoc } from '../Admin/sections/CampusLifeAdmin';
import { DEFAULT_HC_PILLS } from '../Admin/sections/HealthCareAdmin';
import './HealthCare.css';

// Default Fallback Photos
const DEFAULT_HC_PHOTOS = [
  { src: PHOTO_NEEDED_PLACEHOLDER, alt: 'Campus Healthcare Clinic Room', caption: 'Healthcare Facilities' },
  { src: PHOTO_NEEDED_PLACEHOLDER, alt: 'Medical Consultation', caption: 'Doctor Consultation' },
  { src: PHOTO_NEEDED_PLACEHOLDER, alt: 'Health Centre Building Exterior', caption: 'Health Centre Building' },
  { src: PHOTO_NEEDED_PLACEHOLDER, alt: 'Medical Equipment & Checkup', caption: 'Preventive Care' },
  { src: PHOTO_NEEDED_PLACEHOLDER, alt: 'Student Wellness Support', caption: 'Student Wellness' },
];

const ICON_MAP: Record<string, typeof Heart> = {
  Heart,
  Users,
  ShieldCheck,
  Star,
  Activity,
};

export default function HealthCare() {
  // Dynamic admin data from Firestore `campusLifeItems` (slug: 'health-care')
  const { docs: items } = useOrderedCollection<CampusLifeItemDoc>('campusLifeItems', 'order');
  const adminItem = items.find((i) => i.slug === 'health-care');

  // Dynamic admin photos from `useSitePhotos`
  const photos = useSitePhotos('campus', 'health-care', DEFAULT_HC_PHOTOS);

  // Dynamic content blocks
  const pillDocs = useContentBlocks('health-care', 'heroPills');
  const pillsList = pillDocs.length > 0
    ? pillDocs.map((p) => ({
        title: p.title || '',
        desc: p.desc || '',
        icon: ICON_MAP[p.icon || 'Heart'] || Heart,
      }))
    : DEFAULT_HC_PILLS.map((p) => ({
        title: p.title,
        desc: p.desc,
        icon: ICON_MAP[p.icon] || Heart,
      }));

  // Dynamic page title & desc overrides from Firestore if present
  const title = adminItem?.title || 'Health Care';
  const desc = adminItem?.desc || 'Accessible healthcare services and medical support for students, faculty and staff on campus.';

  const customSections = (adminItem?.customSections || []).filter(hasCustomSectionContent);

  useEffect(() => {
    document.title = `${title} | Campus Life | VWU`;
  }, [title]);

  return (
    <main className="hc-page">
      <PageHero
        page="campus-health-care"
        defaultTitle={title}
        defaultSubtitle={desc}
        hideCta={true}
      />

      {/* Hero Section */}
      <section className="hc-hero">
        <div className="hc-container">
          <div className="hc-hero-grid">
            <div className="hc-hero-content">
              <h1 className="hc-hero-title">
                Campus <span className="hc-hero-title-accent">Healthcare Services</span>
              </h1>
              <p className="hc-hero-subtitle">
                Vishnu Women’s University provides healthcare support within the campus to address routine medical needs, first aid and other essential health requirements of students, faculty and staff.
              </p>
              <p className="hc-hero-subtitle">
                Campus medical facilities provide access to consultation, basic diagnostic services, first aid, pharmacy support and other healthcare services when required.
              </p>

              {/* 4 Feature Pills */}
              <div className="hc-pills-row">
                {pillsList.map((pill, idx) => {
                  const Icon = pill.icon;
                  return (
                    <div key={idx} className="hc-pill-item">
                      <div className="hc-pill-icon">
                        <Icon size={18} />
                      </div>
                      <div className="hc-pill-text">
                        {pill.title}<br />{pill.desc}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="hc-hero-image-wrapper">
              <img loading="lazy"
                src={photos[0]?.src || PHOTO_NEEDED_PLACEHOLDER}
                alt="Campus Healthcare"
                className="hc-hero-img"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Campus Medical Facilities & Staff Schedule Table Section ("Quality Healthcare, Close to Campus") */}
      <HealthCareDetailsTable />

      {/* Admin Custom Sections Render (if updated via Admin CMS) */}
      {customSections.length > 0 && (
        <section className="hc-section bg-white">
          <div className="hc-container">
            <CustomSectionsRenderer sections={customSections} />
          </div>
        </section>
      )}

      {/* Dynamic Admin Photo Gallery Section */}
      <section className="hc-section hc-gallery-section">
        <div className="hc-container">
          <div className="hc-section-header">
            <h2 className="hc-section-title">
              Campus <span>Healthcare Gallery</span>
            </h2>
            <p className="hc-section-subtitle">
              A glimpse of the medical facilities, healthcare services and support available to students and staff across the University campus.
            </p>
          </div>

          <div className="hc-gallery-grid-layout">
            <div className="hc-gallery-featured-card">
              <img loading="lazy"
                src={photos[0]?.src || PHOTO_NEEDED_PLACEHOLDER}
                alt="Campus Health Featured"
                className="hc-gallery-featured-img"
              />
            </div>

            <div className="hc-gallery-sub-grid">
              {photos.slice(1, 5).map((pic, idx) => (
                <div key={idx} className="hc-gallery-sub-card">
                  <img loading="lazy"
                    src={pic.src || PHOTO_NEEDED_PLACEHOLDER}
                    alt={pic.alt || `Healthcare Photo ${idx + 1}`}
                    className="hc-gallery-sub-img"
                  />
                </div>
              ))}
            </div>
          </div>

          <div style={{ textAlign: 'center', marginTop: 'var(--space-6)' }}>
            <Link to="/news-awards/gallery" className="btn btn-outline">
              View Full Gallery →
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
