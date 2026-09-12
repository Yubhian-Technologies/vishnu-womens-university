import { useEffect, useState } from 'react';
import {
  ShieldCheck, Zap, Trees, Droplets, Sparkles,
  Building2, Award, CheckCircle2, Shield
} from 'lucide-react';
import SEO from '../../components/SEO/SEO';
import PageHero from '../../components/PageHero/PageHero';
import PhotoGrid from '../../components/PhotoGrid/PhotoGrid';
import CustomSectionsRenderer from '../../components/CustomSectionsRenderer/CustomSectionsRenderer';
import { useSitePhotos } from '../../hooks/useSitePhotos';
import { useContentBlocks } from '../../hooks/useContentBlocks';
import { useOrderedCollection } from '../../hooks/useCollection';
import { hasCustomSectionContent } from '../../lib/customSections';
import type { CampusLifeItemDoc } from '../Admin/sections/CampusLifeAdmin';
import {
  DEFAULT_SQ_STATS,
  DEFAULT_SQ_ABOUT,
  DEFAULT_SQ_FEATURES,
  DEFAULT_SQ_AMENITIES,
} from '../Admin/sections/StaffQuartersAdmin';
import './StaffQuarters.css';

const ICON_MAP: Record<string, typeof Building2> = {
  Building2,
  ShieldCheck,
  Zap,
  Trees,
  Droplets,
  Sparkles,
  Award,
  Shield,
};

const DEFAULT_PHOTOS = [
  {
    src: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=1200&q=80',
    alt: 'Green Meadows Residential Cluster',
    caption: 'Green Meadows Residential Cluster at VWU',
  },
  {
    src: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&q=80',
    alt: 'Faculty Housing Architecture',
    caption: 'Modern Abode for Faculty and Staff',
  },
  {
    src: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1200&q=80',
    alt: 'Scenic Pond & Greenery',
    caption: 'Serene Environment & Natural Pond View',
  },
  {
    src: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1200&q=80',
    alt: 'Gated Security & Patrols',
    caption: '24-Hour Guarded Security Entrance',
  },
  {
    src: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&q=80',
    alt: 'Lush Gardens & Walkways',
    caption: 'Manicured Lawns & Peaceful Enclave',
  },
];

export default function StaffQuarters() {
  const photos = useSitePhotos('campus', 'staff-quarters', DEFAULT_PHOTOS);
  const [activePhotoIdx, setActivePhotoIdx] = useState(0);

  // Dynamic content blocks
  const statDocs = useContentBlocks('staff-quarters', 'stats');
  const aboutDocs = useContentBlocks('staff-quarters', 'about');
  const featureDocs = useContentBlocks('staff-quarters', 'features');
  const amenitiesDocs = useContentBlocks('staff-quarters', 'amenities');

  const { docs: items } = useOrderedCollection<CampusLifeItemDoc>('campusLifeItems', 'order');
  const adminItem = items.find((i) => i.slug === 'staff-quarters');
  const customSections = (adminItem?.customSections || []).filter(hasCustomSectionContent);

  const aboutDoc = aboutDocs[0];
  const amenitiesDoc = amenitiesDocs[0];

  const statsList = statDocs.length > 0
    ? statDocs.map((s) => ({
        value: s.value || '',
        label: s.title || '',
        sub: s.desc || '',
        icon: ICON_MAP[s.icon || 'Building2'] || Building2,
      }))
    : DEFAULT_SQ_STATS.map((s) => ({
        value: s.value,
        label: s.label,
        sub: s.sub,
        icon: ICON_MAP[s.icon] || Building2,
      }));

  const aboutData = {
    badge: aboutDoc?.value || DEFAULT_SQ_ABOUT.badge,
    title: aboutDoc?.title || DEFAULT_SQ_ABOUT.title,
    subtitle: aboutDoc?.slug || DEFAULT_SQ_ABOUT.subtitle,
    storyParagraphs: (aboutDoc?.desc || DEFAULT_SQ_ABOUT.story).split('\n\n'),
  };

  const featuresList = featureDocs.length > 0
    ? featureDocs.map((f, i) => ({
        imgIndex: i % DEFAULT_PHOTOS.length,
        title: f.title,
        tag: f.slug || 'Residential Feature',
        desc: f.desc,
      }))
    : DEFAULT_SQ_FEATURES.map((f, i) => ({
        imgIndex: i % DEFAULT_PHOTOS.length,
        title: f.title,
        tag: f.tag,
        desc: f.desc,
      }));

  const amenitiesList = (amenitiesDoc?.desc || DEFAULT_SQ_AMENITIES.join('\n'))
    .split('\n')
    .map((s) => s.trim())
    .filter(Boolean);

  const getPhotoSrc = (index: number) => {
    const p = photos[index]?.src;
    if (p && !p.includes('photoPlaceholder') && !p.includes('data:image')) return p;
    return DEFAULT_PHOTOS[index % DEFAULT_PHOTOS.length].src;
  };

  useEffect(() => {
    document.title = `${adminItem?.title || 'Faculty & Staff Residential Facilities'} | VWU`;
    
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const el = entry.target as HTMLElement;
            setTimeout(() => el.classList.add('revealed'), parseInt(el.dataset.delay || '0'));
            observer.unobserve(el);
          }
        });
      },
      { threshold: 0.1 }
    );

    document.querySelectorAll('.sq-animate').forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [adminItem?.title]);

  return (
    <main className="page-wrapper staff-quarters-page">
      <SEO
        title="Faculty & Staff Residential Facilities — Green Meadows | VWU"
        description="Explore Green Meadows, the premier faculty & staff residential enclave at Vishnu Women's University featuring 100+ houses, 24/7 security, pond views, and continuous utilities."
      />

      {/* Hero Section */}
      <PageHero
        page="campus-staff-quarters"
        defaultTitle={adminItem?.title || 'Faculty & Staff Residential Facilities'}
        defaultSubtitle={adminItem?.desc || aboutData.subtitle}
        breadcrumb={[
          { label: 'Home', to: '/' },
          { label: 'Campus Life', to: '/campus' },
          { label: adminItem?.title || 'Staff Quarters' },
        ]}
        hideCta={true}
      />

      {/* TOP PHOTO SHOWCASE HERO BANNER */}
      <section className="sq-photo-showcase-section">
        <div className="container">
          <div className="sq-hero-gallery-card sq-animate" data-delay="100">
            <div className="sq-main-photo-stage">
              <img
                src={getPhotoSrc(activePhotoIdx)}
                alt={DEFAULT_PHOTOS[activePhotoIdx]?.alt || 'Green Meadows Quarters'}
                className="sq-stage-img"
              />
              <div className="sq-stage-overlay">
                <div className="sq-stage-badge">
                  <Sparkles size={16} /> Featured Residential View
                </div>
                <h3 className="sq-stage-caption">
                  {photos[activePhotoIdx]?.caption || DEFAULT_PHOTOS[activePhotoIdx]?.caption}
                </h3>
              </div>
            </div>
            
            {/* Thumbnail Navigation Strip */}
            <div className="sq-thumb-strip">
              {DEFAULT_PHOTOS.map((p, idx) => (
                <button
                  key={idx}
                  onClick={() => setActivePhotoIdx(idx)}
                  className={`sq-thumb-btn ${activePhotoIdx === idx ? 'active' : ''}`}
                >
                  <img src={getPhotoSrc(idx)} alt={p.alt} />
                  <span className="sq-thumb-number">0{idx + 1}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Metric Highlights Strip with Icons */}
      <section className="sq-stats-strip">
        <div className="container">
          <div className="sq-stats-grid">
            {statsList.map((stat, idx) => {
              const IconComponent = stat.icon;
              return (
                <div key={idx} className="sq-stat-card sq-animate" data-delay={idx * 100}>
                  <div className="sq-stat-icon-wrap">
                    <IconComponent size={24} />
                  </div>
                  <div className="sq-stat-value">{stat.value}</div>
                  <div className="sq-stat-label">{stat.label}</div>
                  <div className="sq-stat-sub">{stat.sub}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Main Content & Visual Storytelling Section */}
      <section className="section sq-overview-section">
        <div className="container">
          <div className="sq-grid-layout">
            
            {/* Main Visual Column */}
            <div className="sq-main-content">
              
              {/* 1. Chairman's Vision Hero Card with Full Background Photo Overlay */}
              <div className="sq-vision-hero-card sq-animate" data-delay="100">
                <div className="sq-vision-bg-image">
                  <img src={getPhotoSrc(0)} alt="Green Meadows Housing Vision" />
                  <div className="sq-vision-overlay"></div>
                </div>
                <div className="sq-vision-content">
                  <div className="sq-vision-badge">
                    <Award size={16} /> {aboutData.badge}
                  </div>
                  <blockquote className="sq-vision-quote">
                    “Of three basic human needs, accommodation has got the highest priority in this modern world of high standards of living.”
                  </blockquote>
                  <p className="sq-vision-text">
                    <strong>Green Meadows</strong> is the creation of our beloved chairman with the very idea of providing own houses to the faculty.
                  </p>
                </div>
              </div>

              {/* 2. Living at Green Meadows Story Section */}
              <div className="sq-feature-hero-card sq-animate" data-delay="200">
                <div className="sq-card-image-col">
                  <img src={getPhotoSrc(2)} alt="Green Meadows Pond & Scenery" />
                  <div className="sq-image-badge">
                    <Trees size={14} /> Scenic Pond Frontage
                  </div>
                </div>
                <div className="sq-card-text-col">
                  <div className="sq-card-tag">
                    <Building2 size={16} /> {aboutData.title}
                  </div>
                  <h2 className="sq-visual-title">{aboutData.subtitle}</h2>
                  
                  <div className="sq-text-highlight-box">
                    {aboutData.storyParagraphs.map((para, pIdx) => (
                      <p key={pIdx} className="sq-canonical-text">
                        {para}
                      </p>
                    ))}
                  </div>

                  <div className="sq-visual-metrics-pills">
                    {amenitiesList.slice(0, 3).map((am, aIdx) => (
                      <span key={aIdx} className="sq-pill"><CheckCircle2 size={15} /> {am}</span>
                    ))}
                  </div>
                </div>
              </div>

              {/* PHOTO-BACKED AMENITIES GRID */}
              <div className="sq-photo-grid-section sq-animate" data-delay="400">
                <div className="sq-section-header">
                  <h2 className="sq-section-title">Visual Highlights of Green Meadows</h2>
                  <p className="sq-section-subtitle">Experience high-quality living, scenic landscapes, and full security on campus.</p>
                </div>

                <div className="sq-photo-cards-grid">
                  {featuresList.map((item, idx) => (
                    <div key={idx} className="sq-photo-card">
                      <div className="sq-photo-card-img-wrap">
                        <img src={getPhotoSrc(item.imgIndex)} alt={item.title} />
                        <span className="sq-photo-card-tag">{item.tag}</span>
                      </div>
                      <div className="sq-photo-card-content">
                        <h3 className="sq-photo-card-title">{item.title}</h3>
                        <p className="sq-photo-card-desc">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Optional Custom Sections from Admin */}
              {customSections.length > 0 && (
                <div className="sq-custom-sections-wrap" style={{ marginTop: '2rem' }}>
                  <CustomSectionsRenderer sections={customSections} />
                </div>
              )}

              {/* FULL PHOTO GALLERY */}
              <div className="sq-gallery-wrapper sq-animate" data-delay="500">
                <PhotoGrid
                  images={photos}
                  columns={3}
                  label="Residential Gallery"
                  title="Green Meadows Housing Gallery"
                  subtitle="Snapshots of the serene housing enclave at Vishnu Women's University."
                  showGalleryLink={false}
                />
              </div>

            </div>

            {/* Sidebar Navigation & Quick Specs */}
            <aside className="sq-sidebar sq-animate" data-delay="250">
              <div className="sq-sidebar-card">
                <h3 className="sq-sidebar-title">Residential Amenities &amp; Facts</h3>
                <ul className="sq-quick-facts">
                  {amenitiesList.map((am, i) => (
                    <li key={i}>
                      <span className="fact-label">Amenity {i + 1}</span>
                      <span className="fact-val">{am}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </aside>

          </div>
        </div>
      </section>
    </main>
  );
}
