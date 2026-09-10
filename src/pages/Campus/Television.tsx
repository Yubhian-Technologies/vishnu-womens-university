import { useState, useEffect } from 'react';
import { CheckCircle2, GraduationCap, Clapperboard, Newspaper, CalendarDays } from 'lucide-react';
import PageHero from '../../components/PageHero/PageHero';
import PhotoGrid from '../../components/PhotoGrid/PhotoGrid';
import CustomSectionsRenderer from '../../components/CustomSectionsRenderer/CustomSectionsRenderer';
import { useOrderedCollection } from '../../hooks/useCollection';
import { useSitePhotos } from '../../hooks/useSitePhotos';
import { PHOTO_NEEDED_PLACEHOLDER } from '../../lib/photoPlaceholder';
import { hasCustomSectionContent } from '../../lib/customSections';
import { findCampusFacilityBySlug } from './campusFacilities.data';
import { TELEVISION_PILLAR_KEYS, TELEVISION_PILLAR_LABELS, toTelevisionPillarsForm, type TelevisionPillarKey } from '../../lib/televisionPillars';
import type { CampusLifeItemDoc } from '../Admin/sections/CampusLifeAdmin';
import './Television.css';

const PILLAR_ICONS: Record<TelevisionPillarKey, typeof GraduationCap> = {
  education: GraduationCap,
  entertainment: Clapperboard,
  news: Newspaper,
  events: CalendarDays,
};

// Default photos fallback if admin has not uploaded site photos yet
const DEFAULT_PHOTOS = Array.from({ length: 6 }, (_, i) => ({
  src: PHOTO_NEEDED_PLACEHOLDER,
  alt: `Television Photo ${i + 1}`,
  caption: `University Television Highlights`,
}));

export default function Television() {
  const [activeTabId, setActiveTabId] = useState('');

  // Dynamic admin data from Firestore `campusLifeItems` collection (slug: 'television')
  const { docs: items } = useOrderedCollection<CampusLifeItemDoc>('campusLifeItems', 'order');
  const adminItem = items.find((i) => i.slug === 'television');
  const facilityDefault = findCampusFacilityBySlug('television');

  // Dynamic admin photos from `useSitePhotos`
  const photos = useSitePhotos('campus', 'television', DEFAULT_PHOTOS);

  // Resolve dynamic titles and descriptions
  const pageTitle = adminItem?.title || facilityDefault?.title || 'Television';
  const pageDesc = adminItem?.desc || facilityDefault?.heroSubtitle || facilityDefault?.desc || 'University Level Television & Broadcast Media Center';

  // Dynamic custom sections from Firestore
  const customSections = (adminItem?.customSections || []).filter(hasCustomSectionContent);
  const adminTabs = (adminItem?.tabs || []).filter((t) => t.sections.some(hasCustomSectionContent));

  // Programming Pillars (Education/Entertainment/News/Events) — 4 fixed
  // categories, but each only shows once an admin has uploaded a photo for
  // it (Admin -> Campus Life -> Television -> Programming Pillars).
  const pillarContent = toTelevisionPillarsForm(adminItem?.pillars);
  const visiblePillars = TELEVISION_PILLAR_KEYS.filter((key) => pillarContent[key].imageUrl);

  // Production Facilities tabs — entirely admin-driven (Campus Life admin's
  // Custom Tabs for this page). No hardcoded fallback list: the section
  // below stays hidden until an admin actually adds a tab, same "no static
  // fallback" convention every other Firestore-backed section on this site
  // follows.
  const techFacilities = adminTabs.map((tab) => ({
    id: tab.id,
    title: tab.label,
    desc: tab.sections[0]?.textContent || pageDesc,
    specs: tab.sections.slice(1).map((s) => s.label || s.subtitle || '').filter(Boolean),
  }));

  const activeFacility = techFacilities.find((f) => f.id === activeTabId) || techFacilities[0];

  useEffect(() => {
    document.title = `${pageTitle} | Campus Life | VWU`;
  }, [pageTitle]);

  return (
    <main className="tv-page">
      <PageHero
        page="campus-television"
        defaultTitle={pageTitle}
        defaultSubtitle={pageDesc}
        breadcrumb={[
          { label: 'Home', to: '/' },
          { label: 'Campus Life', to: '/campus' },
          { label: pageTitle },
        ]}
        hideCta={true}
      />

      {/* Dynamic Admin Custom Sections */}
      {customSections.length > 0 && (
        <section className="tv-section bg-white text-dark">
          <div className="tv-container">
            <CustomSectionsRenderer sections={customSections} />
          </div>
        </section>
      )}

      {/* Programming & Content — 4 fixed pillars (Education, Entertainment,
          News, Events); each tile is entirely admin-driven (photo +
          description) and hidden until an admin adds a photo for it. */}
      {visiblePillars.length > 0 && (
        <section className="tv-section">
          <div className="tv-container">
            <div className="tv-section-header">
              <div className="tv-badge">Broadcasting</div>
              <h2 className="tv-section-title">Programming &amp; Content</h2>
            </div>

            <div className="tv-pillars-grid">
              {visiblePillars.map((key) => {
                const Icon = PILLAR_ICONS[key];
                const pillar = pillarContent[key];
                return (
                  <div className="tv-pillar-card" key={key}>
                    <img src={pillar.imageUrl} alt={TELEVISION_PILLAR_LABELS[key]} className="tv-pillar-img" loading="lazy" />
                    <div className="tv-pillar-icon"><Icon size={22} /></div>
                    <h3 className="tv-pillar-title">{TELEVISION_PILLAR_LABELS[key]}</h3>
                    {pillar.desc && <p className="tv-pillar-desc">{pillar.desc}</p>}
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Production Facilities & Technology Showcase — entirely admin-driven
          (Campus Life admin's Custom Tabs for this page), hidden until an
          admin adds at least one tab. */}
      {techFacilities.length > 0 && (
        <section className="tv-section" id="facilities">
          <div className="tv-container">
            <div className="tv-section-header">
              <div className="tv-badge">Infrastructure</div>
              <h2 className="tv-section-title">Production Facilities</h2>
              <p className="tv-section-subtitle">Studio technology and equipment</p>
            </div>

            <div className="tv-tech-nav">
              {techFacilities.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTabId(tab.id)}
                  className={`tv-tech-tab-btn ${activeTabId === tab.id ? 'active' : ''}`}
                >
                  {tab.title}
                </button>
              ))}
            </div>

            {activeFacility && (
              <div className="tv-tech-card">
                <div className="tv-tech-img-box">
                  <img
                    src={photos[1]?.src || PHOTO_NEEDED_PLACEHOLDER}
                    alt={activeFacility.title}
                    className="tv-tech-img"
                  />
                </div>
                <div className="tv-tech-details">
                  <h3>{activeFacility.title}</h3>
                  <p>{activeFacility.desc}</p>
                  {activeFacility.specs.length > 0 && (
                    <ul className="tv-tech-specs-list">
                      {activeFacility.specs.map((spec, idx) => (
                        <li key={idx} className="tv-tech-spec-item">
                          <CheckCircle2 size={16} className="tv-tech-spec-icon" />
                          <span>{spec}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Dynamic Admin Photo Gallery — just the photos, no heading. */}
      <section className="tv-section">
        <div className="tv-container">
          <PhotoGrid images={photos} title="" label="" showGalleryLink={false} />
        </div>
      </section>
    </main>
  );
}
