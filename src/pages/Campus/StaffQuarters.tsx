import { useEffect, useState } from 'react';
import {
  ShieldCheck, Zap, Trees, Droplets, Sparkles,
  Building2, Award, CheckCircle2, Shield
} from 'lucide-react';
import SEO from '../../components/SEO/SEO';
import PageHero from '../../components/PageHero/PageHero';
import PhotoGrid from '../../components/PhotoGrid/PhotoGrid';
import { useSitePhotos } from '../../hooks/useSitePhotos';
import './StaffQuarters.css';

const RESIDENTIAL_STATS = [
  { value: '100+', label: 'Faculty Houses', sub: 'Spacious Residential Cluster', icon: Building2 },
  { value: '24 / 7', label: 'Guarded Security', sub: 'Round-the-clock Patrols', icon: ShieldCheck },
  { value: '100%', label: 'Water & Power', sub: 'Zero Utility Disruptions', icon: Zap },
  { value: 'Green', label: 'Scenic Meadows', sub: 'Lake & Pond Frontage', icon: Trees },
];

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

const PHOTO_FEATURES = [
  {
    imgIndex: 0,
    title: 'Green Meadows Landscape',
    tag: 'Nature & Scenery',
    desc: 'Surrounded by lush greenery, manicured lawns, and a natural pond directly in front, creating a calm and refreshing atmosphere for inmate families.',
  },
  {
    imgIndex: 3,
    title: '24-Hour Guarded Security',
    tag: 'Total Safety',
    desc: 'Dedicated 24/7 security personnel patrol the premises continuously to guarantee complete safety and peace of mind for every family.',
  },
  {
    imgIndex: 1,
    title: 'Modern Living Abode',
    tag: 'High Standards',
    desc: 'Built with high standards of modern architecture, featuring spacious layouts, contemporary amenities, and proper ventilation.',
  },
  {
    imgIndex: 2,
    title: 'Scenic Pond Frontage',
    tag: 'Serene Atmosphere',
    desc: 'The sparkling pond right in front of Green Meadows adds natural elegance, cool breezes, and peaceful walking pathways.',
  },
  {
    imgIndex: 4,
    title: 'Warm Faculty Community',
    tag: 'Camaraderie',
    desc: 'Fosters a close-knit, supportive residential community among faculty and staff members within the safe perimeter of the campus.',
  },
];

export default function StaffQuarters() {
  const photos = useSitePhotos('campus', 'staff-quarters', DEFAULT_PHOTOS);
  const [activePhotoIdx, setActivePhotoIdx] = useState(0);

  const getPhotoSrc = (index: number) => {
    const p = photos[index]?.src;
    if (p && !p.includes('photoPlaceholder') && !p.includes('data:image')) return p;
    return DEFAULT_PHOTOS[index % DEFAULT_PHOTOS.length].src;
  };

  useEffect(() => {
    document.title = 'Faculty & Staff Residential Facilities | VWU';
    
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
  }, []);

  return (
    <main className="page-wrapper staff-quarters-page">
      <SEO
        title="Faculty & Staff Residential Facilities — Green Meadows | VWU"
        description="Explore Green Meadows, the premier faculty & staff residential enclave at Vishnu Women's University featuring 100+ houses, 24/7 security, pond views, and continuous utilities."
      />

      {/* Hero Section */}
      <PageHero
        page="campus-staff-quarters"
        defaultTitle="Faculty & Staff Residential Facilities"
        defaultSubtitle="Comfortable On-Campus Living for Faculty and Staff."
        breadcrumb={[
          { label: 'Home', to: '/' },
          { label: 'Campus Life', to: '/campus' },
          { label: 'Staff Quarters' },
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
            {RESIDENTIAL_STATS.map((stat, idx) => {
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
                    <Award size={16} /> Chairman's Founding Vision
                  </div>
                  <blockquote className="sq-vision-quote">
                    “Of three basic human needs, accommodation has got the highest priority in this modern world of high standards of living.”
                  </blockquote>
                  <p className="sq-vision-text">
                    <strong>Green Meadows</strong> is the creation of our beloved chairman with the very idea of providing own houses to the faculty.
                  </p>
                </div>
              </div>

              {/* 2. Green Meadows Enclave Visual Card (100 Houses & Scenic Pond) */}
              <div className="sq-feature-hero-card sq-animate" data-delay="200">
                <div className="sq-card-image-col">
                  <img src={getPhotoSrc(2)} alt="Green Meadows Pond & Scenery" />
                  <div className="sq-image-badge">
                    <Trees size={14} /> Scenic Pond Frontage
                  </div>
                </div>
                <div className="sq-card-text-col">
                  <div className="sq-card-tag">
                    <Building2 size={16} /> Housing Cluster
                  </div>
                  <h2 className="sq-visual-title">Green Meadows Cluster</h2>
                  
                  <div className="sq-text-highlight-box">
                    <p className="sq-canonical-text">
                      <strong>Green Meadows is a cluster of about hundred houses.</strong>
                    </p>
                    <p className="sq-canonical-text">
                      <strong>With the beautiful scenery around and a pond in front of the Green Meadows add more beauty and pleasantness to all the inmates.</strong>
                    </p>
                  </div>

                  <div className="sq-visual-metrics-pills">
                    <span className="sq-pill"><CheckCircle2 size={15} /> 100+ Houses Cluster</span>
                    <span className="sq-pill"><CheckCircle2 size={15} /> Natural Water Pond Front</span>
                    <span className="sq-pill"><CheckCircle2 size={15} /> Beautiful Scenery & Air</span>
                  </div>
                </div>
              </div>

              {/* 3. Security & Utilities Visual Card */}
              <div className="sq-feature-hero-card reverse sq-animate" data-delay="300">
                <div className="sq-card-text-col">
                  <div className="sq-card-tag gold">
                    <ShieldCheck size={16} /> Security & Infrastructure
                  </div>
                  <h2 className="sq-visual-title">24/7 Security & Uninterrupted Utilities</h2>
                  
                  <div className="sq-text-highlight-box gold">
                    <p className="sq-canonical-text">
                      <strong>The Green Meadows has security personnel who patrol 24 hours.</strong>
                    </p>
                    <p className="sq-canonical-text">
                      <strong>Water and current are supplied without creating any inconvenience.</strong>
                    </p>
                    <p className="sq-canonical-text highlight">
                      <strong>In every aspect Green Meadows is a modern abode with all the conveniences.</strong>
                    </p>
                  </div>

                  <div className="sq-visual-metrics-pills">
                    <span className="sq-pill gold"><Shield size={15} /> 24/7 Guarded Patrols</span>
                    <span className="sq-pill gold"><Zap size={15} /> Continuous Power & Backup</span>
                    <span className="sq-pill gold"><Droplets size={15} /> Pure Water Supply</span>
                  </div>
                </div>

                <div className="sq-card-image-col">
                  <img src={getPhotoSrc(3)} alt="Gated Security Entrance" />
                  <div className="sq-image-badge gold">
                    <ShieldCheck size={14} /> 24/7 Patrol Security
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
                  {PHOTO_FEATURES.map((item, idx) => (
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
                <h3 className="sq-sidebar-title">Residential Quick Facts</h3>
                <ul className="sq-quick-facts">
                  <li>
                    <span className="fact-label">Location</span>
                    <span className="fact-val">Green Meadows, VWU Campus</span>
                  </li>
                  <li>
                    <span className="fact-label">Total Housing</span>
                    <span className="fact-val">Cluster of ~100 Houses</span>
                  </li>
                  <li>
                    <span className="fact-label">Surroundings</span>
                    <span className="fact-val">Front Pond & Scenery</span>
                  </li>
                  <li>
                    <span className="fact-label">Security</span>
                    <span className="fact-val">24-Hour Guarded Patrols</span>
                  </li>
                  <li>
                    <span className="fact-label">Utilities</span>
                    <span className="fact-val">100% Water & Power Supply</span>
                  </li>
                  <li>
                    <span className="fact-label">Living Standard</span>
                    <span className="fact-val">Modern Abode with Conveniences</span>
                  </li>
                </ul>
              </div>
            </aside>

          </div>
        </div>
      </section>
    </main>
  );
}
