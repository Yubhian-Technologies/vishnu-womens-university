import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Zap,
  Cpu,
  Award,
  BookOpen,
  Maximize2,
  ChevronLeft,
  ChevronRight,
  X,
  Compass,
  Check,
  ShieldCheck,
  Layers,
  Sparkles,
  Flame,
  Activity,
  Boxes,
  Sun,
  Printer,
  HeartHandshake,
} from 'lucide-react';
import SEO from '../../components/SEO/SEO';
import SmoothImage from '../../components/SmoothImage/SmoothImage';
import RouteFallback from '../../components/RouteFallback/RouteFallback';
import { useOrderedCollection } from '../../hooks/useCollection';
import { usePageBanners } from '../../hooks/usePageBanners';
import { fetchPriorityAttr } from '../../lib/domAttrs';
import { hasCustomSectionContent, type CustomSectionPhoto } from '../../lib/customSections';
import { DIFFERENTIATOR_CATEGORIES, type DifferentiatorItemDoc } from '../Admin/sections/DifferentiatorsAdmin';
import './AdvancedElectricalRdLab.css';

const SLUG = 'advanced-electrical-rd-lab';

export default function AdvancedElectricalRdLab() {
  const { docs: allItems, loading } = useOrderedCollection<DifferentiatorItemDoc>('differentiatorItems', 'order');
  const { slides: heroSlides } = usePageBanners('differentiators-detail');
  const item = allItems.find((i) => i.slug === SLUG) ?? null;
  const [lightbox, setLightbox] = useState<{ photos: { imageUrl: string; caption?: string }[]; index: number } | null>(null);
  const [activeNav, setActiveNav] = useState('overview');

  useEffect(() => {
    document.title = "Advanced Electrical R&D Lab | Vishnu Women's University";
  }, []);

  // Update active nav link based on scroll position
  useEffect(() => {
    const handleScroll = () => {
      const sectionIds = ['overview', 'patents', 'models', 'highlights', 'facilities', 'gallery'];
      const scrollPosition = window.scrollY + 140;

      for (let i = sectionIds.length - 1; i >= 0; i--) {
        const section = document.getElementById(sectionIds[i]);
        if (section && section.offsetTop <= scrollPosition) {
          setActiveNav(sectionIds[i]);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (!item && loading) {
    return <RouteFallback />;
  }

  const category = item
    ? DIFFERENTIATOR_CATEGORIES.find((c) => c.id === item.category)
    : { id: 'research', label: 'Research & Specialised Labs' };

  const heroImage =
    item?.heroImage ||
    '/gallery/differentiators/elec-lab-1.jpg' ||
    heroSlides[0]?.imageUrl;

  // Extract dynamic gallery photos if present in Firestore custom sections
  const customSections = item?.customSections || [];
  const gallerySections = customSections.filter((s) => s.contentType === 'gallery' && hasCustomSectionContent(s));
  const dynamicPhotos: CustomSectionPhoto[] = gallerySections.flatMap((s) => s.galleryPhotos || []).filter((p) => p.imageUrl);

  const defaultGalleryPhotos = [
    { imageUrl: '/gallery/differentiators/elec-lab-1.jpg', caption: 'Students working on motor control test bench' },
    { imageUrl: '/gallery/differentiators/elec-lab-2.jpg', caption: 'DSP & FPGA based BLDC motor setup' },
    { imageUrl: '/gallery/differentiators/elec-lab-3.jpg', caption: 'R&D experimental hardware assembly' },
    { imageUrl: '/gallery/differentiators/elec-lab-4.jpg', caption: 'Testing team with faculty supervisors' },
  ];

  const allGalleryPhotos = dynamicPhotos.length > 0 ? dynamicPhotos : defaultGalleryPhotos;

  // Patents data
  const patents = [
    {
      title: 'Dental Dispenser',
      status: 'Patent Granted',
      inventor: 'Dr. J. Rohith Balaji',
      domain: 'Biomedical & Precision Dispensing',
      icon: Flame,
    },
    {
      title: 'Braille-Character Printer',
      status: 'Patent Granted',
      inventor: 'Dr. J. Rohith Balaji',
      domain: 'Assistive Electromechanical Technology',
      icon: Printer,
    },
    {
      title: 'EV Motor Drive Testing Apparatus',
      status: 'Patent Granted',
      inventor: 'Dr. J. Rohith Balaji',
      domain: 'Electric Mobility & Motor Characterization',
      icon: Zap,
    },
  ];

  // 9 Operational Working Models
  const workingModels = [
    {
      title: 'Smart Solar Aerator System',
      description: 'Automated solar-powered aquaculture oxygenation system with smart monitoring.',
      tag: 'Solar & Aquaculture',
      icon: Sun,
    },
    {
      title: 'PLC Automation Trainer Kit',
      description: 'Industrial programmable logic controller test bench for process automation.',
      tag: 'Industrial Automation',
      icon: Cpu,
    },
    {
      title: 'Hybrid EV Charging System',
      description: 'Multi-source renewable energy charging infrastructure for electric vehicles.',
      tag: 'EV Infrastructure',
      icon: Zap,
    },
    {
      title: 'FPGA & DSP-Based Motor Control Setup',
      description: 'High-speed digital signal processing platforms for BLDC and PMSM electric motors.',
      tag: 'Digital Motor Drives',
      icon: Activity,
    },
    {
      title: 'Multilevel Inverters & Battery Management (BMS)',
      description: 'Advanced power conversion architecture with cell balancing and thermal management.',
      tag: 'Power Electronics',
      icon: Layers,
    },
    {
      title: 'Solar PV MPPT & Wind Emulator',
      description: 'Dynamic hardware emulator for maximum power point tracking and grid integration.',
      tag: 'Renewable Systems',
      icon: Sun,
    },
    {
      title: 'Low-Cost Braille Character Printer',
      description: 'Patented assistive electromechanical device designed for visually challenged learners.',
      tag: 'Assistive Technology',
      icon: HeartHandshake,
    },
    {
      title: 'Automated Dental Dispenser Apparatus',
      description: 'Patented electromechanical precision dispenser for clinical dental applications.',
      tag: 'Biomedical Devices',
      icon: Sparkles,
    },
    {
      title: 'Cyber-Physical Energy Automation Testbed',
      description: 'Connected microgrid test bench with adaptive PID, fuzzy logic, and neural control.',
      tag: 'Smart Grids',
      icon: Boxes,
    },
  ];

  // Focus areas
  const focusAreas = [
    'Power Electronics & Drives',
    'FPGA & DSP-based Motor Control',
    'Control & Automation Systems',
    'Green & Renewable Energy Systems',
    'Electric Vehicle (EV) Controllers',
    'Advanced Control Algorithms (PID, Adaptive, Fuzzy, Neural, ADRC)',
    'Multilevel Inverters & Smart BMS',
    'Solar PV MPPT Systems',
    'Assistive Devices for Differently-Abled',
  ];

  const highlightsList = [
    'Vision of excellence in Power Electronics, Electric Drives, Embedded Control, and Renewable Technologies.',
    '9 operational working models — spanning EV drive controllers, solar systems, and assistive medical devices.',
    '3 Patents granted, including a Braille-character printer, dental dispenser, and EV motor drive testing apparatus.',
    'Advanced focus areas: FPGA/DSP motor control, control & automation, inverters & converters, solar PV, and cyber-physical systems.',
    'Continuous research projects successfully delivered annually from 2015-16 through 2021-22 and beyond.',
    'Directly aligned with national Atmanirbhar Bharat and Make in India innovation missions.',
  ];

  const facilitiesList = [
    '9 operational working models, including a Smart Solar Aerator System, PLC Automation Trainer Kit, and Hybrid EV Charging System.',
    'FPGA and DSP-based high-performance motor control test benches with real-time feedback loops.',
    'Solar PV MPPT testing array and wind turbine emulation hardware setup.',
    'Precision digital storage oscilloscopes, power quality analyzers, and embedded microcontroller testbeds.',
  ];

  return (
    <main className="page-wrapper elec-page">
      <SEO
        title="Advanced Electrical R&D Lab | Vishnu Women's University"
        description="Advancing innovation in Power Electronics, EV motor control, and renewable technologies through hands-on R&D, working prototypes, and patent-backed research."
        canonicalPath={`/differentiators/${SLUG}`}
      />

      {/* Hero Banner */}
      <section className="elec-hero-section">
        <div className="container">
          <div className="elec-hero-card">
            {heroImage && (
              <SmoothImage
                src={heroImage}
                alt="Advanced Electrical R&D Lab"
                className="elec-hero-bg"
                loading="eager"
                decoding="sync"
                {...fetchPriorityAttr('high')}
              />
            )}
            <div className="elec-hero-content animate-fade-in-up">
              <nav aria-label="Breadcrumb" className="elec-breadcrumb">
                <Link to="/">Home</Link>
                <span className="elec-breadcrumb-sep">›</span>
                <Link to="/differentiators">Differentiators</Link>
                <span className="elec-breadcrumb-sep">›</span>
                <Link to={`/differentiators#${category?.id || 'research'}`}>{category?.label || 'Research & Specialised Labs'}</Link>
                <span className="elec-breadcrumb-sep">›</span>
                <span className="elec-breadcrumb-current">Advanced Electrical R&D Lab</span>
              </nav>

              <div className="elec-badge">
                <Zap size={14} /> {category?.label || 'Research & Specialised Labs'}
              </div>

              <h1 className="elec-hero-title">Advanced Electrical R&D Lab</h1>

              <p className="elec-hero-subtitle">
                {item?.summary ||
                  'Advancing innovation in Power Electronics, EV motor control, and renewable technologies through hands-on R&D, working prototypes, and patent-backed research.'}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Sticky Quick-Jump Navigation */}
      <div className="elec-sticky-nav-wrapper">
        <div className="container">
          <nav className="elec-nav-scroll" aria-label="Page Sections Navigation">
            <a href="#overview" className={`elec-nav-item ${activeNav === 'overview' ? 'active' : ''}`}>
              <BookOpen size={14} /> Overview & Domains
            </a>
            <a href="#patents" className={`elec-nav-item ${activeNav === 'patents' ? 'active' : ''}`}>
              <Award size={14} /> Patents Granted
            </a>
            <a href="#models" className={`elec-nav-item ${activeNav === 'models' ? 'active' : ''}`}>
              <Cpu size={14} /> Working Models (9)
            </a>
            <a href="#highlights" className={`elec-nav-item ${activeNav === 'highlights' ? 'active' : ''}`}>
              <Sparkles size={14} /> Key Highlights
            </a>
            <a href="#facilities" className={`elec-nav-item ${activeNav === 'facilities' ? 'active' : ''}`}>
              <Layers size={14} /> Facilities
            </a>
            {allGalleryPhotos.length > 0 && (
              <a href="#gallery" className={`elec-nav-item ${activeNav === 'gallery' ? 'active' : ''}`}>
                <Maximize2 size={14} /> Gallery
              </a>
            )}
          </nav>
        </div>
      </div>

      {/* 1. Overview & Mission + Focus Areas */}
      <section id="overview" className="elec-section">
        <div className="container">
          <div className="elec-section-header">
            <span className="elec-section-label">
              <Compass size={14} /> Center of Excellence
            </span>
            <h2 className="elec-section-title">Laboratory Mission & Core Focus</h2>
            <p className="elec-section-lead">
              A state-of-the-art facility fostering industry-ready skills in electric mobility, green energy systems, and intelligent embedded automation.
            </p>
          </div>

          <div className="elec-overview-card">
            <Zap size={140} className="elec-overview-watermark" aria-hidden="true" />
            <div className="elec-prose">
              <p>
                The lab's mission spans advancing research in Power Electronics & Drives, FPGA & DSP-based Motor Control, Control & Automation, and Green Energy Systems; providing hands-on experience through project-based learning; fostering innovation through industry partnerships and startup incubation; and developing socially impactful technologies. Focus areas include motor controllers and drives for EVs, advanced control algorithms (PID, Adaptive, Fuzzy Logic, Neural Networks, ADRC), FPGA/DSP-based high-performance motor control, multilevel inverters and battery management systems, solar PV MPPT systems, and low-cost assistive devices for differently-abled individuals.
              </p>
            </div>
          </div>

          {/* Focus Areas Grid */}
          <div className="elec-focus-grid">
            {focusAreas.map((area, i) => (
              <div key={i} className="elec-focus-card">
                <div className="elec-focus-icon">
                  <Zap size={18} />
                </div>
                <span className="elec-focus-title">{area}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 2. Patents Granted Showcase */}
      <section id="patents" className="elec-section elec-section--alt">
        <div className="container">
          <div className="elec-section-header">
            <span className="elec-section-label">
              <Award size={14} /> Intellectual Property & Innovation
            </span>
            <h2 className="elec-section-title">Patents Granted</h2>
            <p className="elec-section-lead">
              Transforming innovative engineering concepts into patented, industry-ready technologies and socially impactful assistive systems.
            </p>
          </div>

          <div className="elec-patents-grid">
            {patents.map((patent, i) => {
              const Icon = patent.icon;
              return (
                <div key={i} className="elec-patent-card">
                  <div>
                    <span className="elec-patent-badge">
                      <ShieldCheck size={12} /> {patent.status}
                    </span>
                    <h3 className="elec-patent-title">{patent.title}</h3>
                    <div style={{ fontSize: 'var(--text-xs)', color: 'rgba(255,255,255,0.7)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <Icon size={14} color="var(--color-accent-light)" /> {patent.domain}
                    </div>
                  </div>

                  <div className="elec-patent-inventor">
                    <span>Lead Inventor:</span>
                    <span className="elec-patent-inventor-name">{patent.inventor}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 3. Operational Working Models (9 Models) */}
      <section id="models" className="elec-section">
        <div className="container">
          <div className="elec-section-header">
            <span className="elec-section-label">
              <Cpu size={14} /> Hardware Prototypes
            </span>
            <h2 className="elec-section-title">Operational Working Models</h2>
            <p className="elec-section-lead">
              The laboratory houses 9 fully functional hardware prototypes and test rigs developed by student and faculty researchers.
            </p>
          </div>

          <div className="elec-models-grid">
            {workingModels.map((model, i) => {
              const Icon = model.icon;
              return (
                <div key={i} className="elec-model-card">
                  <div>
                    <div className="elec-model-top">
                      <div className="elec-model-icon">
                        <Icon size={20} />
                      </div>
                      <h3 className="elec-model-title">{model.title}</h3>
                    </div>
                    <p className="elec-model-desc">{model.description}</p>
                  </div>
                  <span className="elec-model-tag">{model.tag}</span>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 4. Highlights & Facilities Side-by-Side */}
      <section id="highlights" className="elec-section elec-section--alt">
        <div className="container">
          <div className="elec-dual-grid">
            {/* Key Highlights */}
            <div className="elec-info-card">
              <div className="elec-info-header">
                <Sparkles size={22} color="var(--color-accent)" />
                <h3 className="elec-info-title">Key Highlights</h3>
              </div>
              <ul className="elec-checklist">
                {highlightsList.map((item, i) => (
                  <li key={i} className="elec-checklist-item">
                    <span className="elec-check-badge">
                      <Check size={12} strokeWidth={3} />
                    </span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Facilities & Equipment */}
            <div id="facilities" className="elec-info-card">
              <div className="elec-info-header">
                <Layers size={22} color="var(--color-accent)" />
                <h3 className="elec-info-title">Facilities & Equipment</h3>
              </div>
              <ul className="elec-checklist">
                {facilitiesList.map((item, i) => (
                  <li key={i} className="elec-checklist-item">
                    <span className="elec-check-badge">
                      <Check size={12} strokeWidth={3} />
                    </span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Photo Gallery */}
      {allGalleryPhotos.length > 0 && (
        <section id="gallery" className="elec-section">
          <div className="container">
            <div className="elec-section-header">
              <span className="elec-section-label">
                <Maximize2 size={14} /> Visual Showcase
              </span>
              <h2 className="elec-section-title">Laboratory & R&D Gallery</h2>
            </div>

            <div className="elec-gallery-grid">
              {allGalleryPhotos.map((photo, i) => (
                <button
                  key={i}
                  type="button"
                  className="elec-gallery-tile"
                  onClick={() => setLightbox({ photos: allGalleryPhotos, index: i })}
                  aria-label={`View laboratory photo ${i + 1}`}
                >
                  <div className="elec-gallery-img-wrap">
                    <img src={photo.imageUrl} alt={photo.caption || 'Advanced Electrical Lab'} className="elec-gallery-img" loading="lazy" />
                    <div className="elec-gallery-overlay">
                      <Maximize2 size={24} />
                    </div>
                  </div>
                  {photo.caption && <div className="elec-gallery-caption">{photo.caption}</div>}
                </button>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 6. University Call to Action (CTA) */}
      <section className="elec-cta-section">
        <div className="container">
          <h2 className="elec-cta-title">Explore More Differentiators</h2>
          <p className="elec-cta-desc">
            Discover all the unique initiatives, labs, and specialised centres that make Vishnu Women's University an extraordinary place to learn and grow.
          </p>
          <div className="elec-cta-buttons">
            <Link to="/differentiators" className="btn btn-accent">
              All Differentiators
            </Link>
            <Link to="/apply-now" className="btn btn-secondary">
              Apply Now
            </Link>
            <Link to="/academics" className="btn btn-secondary">
              Academics
            </Link>
          </div>
        </div>
      </section>

      {/* Lightbox Modal */}
      {lightbox && (
        <div className="elec-lightbox-backdrop" onClick={() => setLightbox(null)}>
          <div className="elec-lightbox-dialog" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              className="elec-lightbox-close"
              onClick={() => setLightbox(null)}
              aria-label="Close photo viewer"
            >
              <X size={20} />
            </button>

            {lightbox.photos.length > 1 && (
              <>
                <button
                  type="button"
                  className="elec-lightbox-btn elec-lightbox-btn--prev"
                  aria-label="Previous photo"
                  onClick={() =>
                    setLightbox((curr) =>
                      curr ? { ...curr, index: (curr.index - 1 + curr.photos.length) % curr.photos.length } : null
                    )
                  }
                >
                  <ChevronLeft size={24} />
                </button>
                <button
                  type="button"
                  className="elec-lightbox-btn elec-lightbox-btn--next"
                  aria-label="Next photo"
                  onClick={() =>
                    setLightbox((curr) =>
                      curr ? { ...curr, index: (curr.index + 1) % curr.photos.length } : null
                    )
                  }
                >
                  <ChevronRight size={24} />
                </button>
              </>
            )}

            <img
              src={lightbox.photos[lightbox.index].imageUrl}
              alt={lightbox.photos[lightbox.index].caption || 'Advanced Electrical Lab Photo'}
              className="elec-lightbox-img"
            />

            {lightbox.photos[lightbox.index].caption && (
              <div className="elec-lightbox-caption">{lightbox.photos[lightbox.index].caption}</div>
            )}
          </div>
        </div>
      )}
    </main>
  );
}
