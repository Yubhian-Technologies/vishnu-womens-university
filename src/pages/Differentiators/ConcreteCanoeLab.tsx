import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Microscope,
  Target,
  Sparkles,
  Award,
  Calendar,
  Mail,
  Phone,
  BookOpen,
  Anchor,
  Trophy,
  Users,
  Compass,
  Check,
  ChevronLeft,
  ChevronRight,
  X,
  Maximize2,
  Cpu,
  Layers,
  FlaskConical,
} from 'lucide-react';
import SEO from '../../components/SEO/SEO';
import SmoothImage from '../../components/SmoothImage/SmoothImage';
import RouteFallback from '../../components/RouteFallback/RouteFallback';
import { useOrderedCollection } from '../../hooks/useCollection';
import { usePageBanners } from '../../hooks/usePageBanners';
import { fetchPriorityAttr } from '../../lib/domAttrs';
import { hasCustomSectionContent, type CustomSectionPhoto } from '../../lib/customSections';
import { DIFFERENTIATOR_CATEGORIES, type DifferentiatorItemDoc } from '../Admin/sections/DifferentiatorsAdmin';
import { concreteCanoeLab } from './concreteCanoeLab.data';
import './ConcreteCanoeLab.css';

const SLUG = 'concrete-canoe-lab';

export default function ConcreteCanoeLab() {
  const { docs: allItems, loading } = useOrderedCollection<DifferentiatorItemDoc>('differentiatorItems', 'order');
  const { slides: heroSlides } = usePageBanners('differentiators-detail');
  const item = allItems.find((i) => i.slug === SLUG) ?? null;
  const [lightbox, setLightbox] = useState<{ photos: { imageUrl: string; caption?: string }[]; index: number } | null>(null);
  const [activeNav, setActiveNav] = useState('overview');

  useEffect(() => {
    document.title = "Concrete Canoe Laboratory | Vishnu Women's University";
  }, []);

  // Update active nav link based on scroll position
  useEffect(() => {
    const handleScroll = () => {
      const sectionIds = ['overview', 'incubation', 'research', 'fleet', 'competitions', 'events', 'mentors', 'gallery', 'highlights'];
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

  // Use the differentiator category metadata or fallback to research
  const category = item ? DIFFERENTIATOR_CATEGORIES.find((c) => c.id === item.category) : { id: 'research', label: 'Research & Specialised Labs' };
  const heroImage = item?.heroImage || heroSlides[0]?.imageUrl || 'https://res.cloudinary.com/dljzfysft/image/upload/v1777358383/download_u6eeyl.jpg';

  // Extract any dynamic photos from Firestore custom sections (e.g. Gallery)
  const customSections = item?.customSections || [];
  const gallerySections = customSections.filter((s) => s.contentType === 'gallery' && hasCustomSectionContent(s));
  const dynamicPhotos: CustomSectionPhoto[] = gallerySections.flatMap((s) => s.galleryPhotos || []).filter((p) => p.imageUrl);

  // Fallback / default gallery photos from the lab if none or supplement
  const allGalleryPhotos = dynamicPhotos.length > 0
    ? dynamicPhotos
    : [
        { imageUrl: heroImage, caption: 'WAKA Concrete Canoe at the lakeside test trials' },
      ];

  // Highlights & Facilities extracted from custom sections or default items
  const highlightsSection = customSections.find((s) => s.id === 'highlights' || s.label?.toLowerCase().includes('highlight'));
  const facilitiesSection = customSections.find((s) => s.id === 'facilities' || s.label?.toLowerCase().includes('facilit'));

  const highlightList = highlightsSection?.listText
    ? highlightsSection.listText.split('\n').filter(Boolean)
    : [
        'First-ever concrete canoe engineering initiative in Andhra Pradesh and Telangana dedicated to women engineers.',
        'Pioneering sustainable aquaculture boat designs using lightweight concrete and eco-friendly additives.',
        'National Concrete Canoe Competition (NCCC) host institution with over 10 collegiate teams participating.',
        'Winners of IIT Hyderabad ITIC BUILD incubation grant (₹1 Lakh) for industry-ready marine prototype.',
      ];

  const facilityList = facilitiesSection?.listText
    ? facilitiesSection.listText.split('\n').filter(Boolean)
    : [
        'Dedicated Concrete Technology & Materials Characterization Lab',
        'Lightweight composite mix design, cenosphere & metakaolin testing tanks',
        'Marine 3D Hull Modelling & Hydrodynamic Stabilizer Suite (Maxsurf, AutoCAD, STAAD Pro, Bearcat SP)',
        'Casting moulds & specialized fibre mesh reinforcement fabrication facilities',
      ];

  return (
    <main className="page-wrapper canoe-page">
      <SEO
        title="Concrete Canoe Laboratory | Vishnu Women's University"
        description="Equipping female civil engineers with hands-on skills in concrete canoe design, eco-friendly material research, and competitive boat engineering."
        canonicalPath={`/differentiators/${SLUG}`}
      />

      {/* Hero Banner — University Standard */}
      <section className="canoe-hero-section">
        <div className="container">
          <div className="canoe-hero-card">
            {heroImage && (
              <SmoothImage
                src={heroImage}
                alt="Concrete Canoe Laboratory"
                className="canoe-hero-bg"
                loading="eager"
                decoding="sync"
                {...fetchPriorityAttr('high')}
              />
            )}
            <div className="canoe-hero-overlay" />
            <div className="canoe-hero-content animate-fade-in-up">
              <nav aria-label="Breadcrumb" className="canoe-breadcrumb">
                <Link to="/">Home</Link>
                <span className="canoe-breadcrumb-sep">›</span>
                <Link to="/differentiators">Differentiators</Link>
                <span className="canoe-breadcrumb-sep">›</span>
                <Link to={`/differentiators#${category?.id || 'research'}`}>{category?.label || 'Research & Specialised Labs'}</Link>
                <span className="canoe-breadcrumb-sep">›</span>
                <span className="canoe-breadcrumb-current">Concrete Canoe Laboratory</span>
              </nav>

              <div className="canoe-badge">
                <Microscope size={14} /> {category?.label || 'Research & Specialised Labs'}
              </div>

              <h1 className="canoe-hero-title">Concrete Canoe Laboratory</h1>

              <p className="canoe-hero-subtitle">
                {item?.summary ||
                  'Equipping female civil engineers with hands-on skills in concrete canoe design, eco-friendly material research, and competitive boat engineering.'}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Sticky Quick-Jump Navigation Bar */}
      <div className="canoe-sticky-nav-wrapper">
        <div className="container">
          <nav className="canoe-nav-scroll" aria-label="Page Sections Navigation">
            <a href="#overview" className={`canoe-nav-item ${activeNav === 'overview' ? 'active' : ''}`}>
              <BookOpen size={14} /> Overview
            </a>
            <a href="#incubation" className={`canoe-nav-item ${activeNav === 'incubation' ? 'active' : ''}`}>
              <Sparkles size={14} /> Startup Incubation
            </a>
            <a href="#research" className={`canoe-nav-item ${activeNav === 'research' ? 'active' : ''}`}>
              <FlaskConical size={14} /> Research Project
            </a>
            <a href="#fleet" className={`canoe-nav-item ${activeNav === 'fleet' ? 'active' : ''}`}>
              <Anchor size={14} /> Fleet Evolution
            </a>
            <a href="#competitions" className={`canoe-nav-item ${activeNav === 'competitions' ? 'active' : ''}`}>
              <Trophy size={14} /> Competitions
            </a>
            <a href="#events" className={`canoe-nav-item ${activeNav === 'events' ? 'active' : ''}`}>
              <Calendar size={14} /> National Event
            </a>
            <a href="#mentors" className={`canoe-nav-item ${activeNav === 'mentors' ? 'active' : ''}`}>
              <Users size={14} /> Leadership & Teams
            </a>
            {allGalleryPhotos.length > 0 && (
              <a href="#gallery" className={`canoe-nav-item ${activeNav === 'gallery' ? 'active' : ''}`}>
                <Maximize2 size={14} /> Gallery
              </a>
            )}
            <a href="#highlights" className={`canoe-nav-item ${activeNav === 'highlights' ? 'active' : ''}`}>
              <Cpu size={14} /> Facilities
            </a>
          </nav>
        </div>
      </div>

      {/* 1. Overview, Vision, Mission & Objectives */}
      <section id="overview" className="canoe-section">
        <div className="container">
          <div className="canoe-section-header">
            <span className="canoe-section-label">
              <Compass size={14} /> Center of Excellence
            </span>
            <h2 className="canoe-section-title">About the Concrete Canoe Laboratory</h2>
          </div>

          {/* Overview Prose Card */}
          <div className="canoe-overview-card">
            <Anchor size={120} className="canoe-overview-quote-mark" aria-hidden="true" />
            <div className="canoe-prose">
              {concreteCanoeLab.paragraphs.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
          </div>

          {/* Vision & Mission Grid */}
          <div className="canoe-vm-grid">
            {/* Vision */}
            <div className="canoe-vm-card">
              <div className="canoe-vm-header">
                <div className="canoe-vm-icon-box">
                  <Target size={22} />
                </div>
                <h3 className="canoe-vm-title">Our Vision</h3>
              </div>
              <p style={{ fontSize: 'var(--text-base)', lineHeight: 1.7, color: 'var(--color-text)', margin: 0 }}>
                {concreteCanoeLab.vision}
              </p>
            </div>

            {/* Mission */}
            <div className="canoe-vm-card">
              <div className="canoe-vm-header">
                <div className="canoe-vm-icon-box">
                  <Sparkles size={22} />
                </div>
                <h3 className="canoe-vm-title">Our Mission</h3>
              </div>
              <ul className="canoe-mission-list">
                {concreteCanoeLab.mission.map((item, i) => (
                  <li key={i} className="canoe-mission-item">
                    <span className="canoe-check-badge">
                      <Check size={12} strokeWidth={3} />
                    </span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Objectives Banner */}
          {concreteCanoeLab.objectives.length > 0 && (
            <div className="canoe-objective-banner">
              <div className="canoe-objective-icon">
                <Compass size={24} />
              </div>
              <div>
                <strong style={{ display: 'block', fontSize: 'var(--text-xs)', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--color-accent)', marginBottom: '0.25rem' }}>
                  Laboratory Objective
                </strong>
                <p className="canoe-objective-text">{concreteCanoeLab.objectives[0]}</p>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* 2. Startup Under Incubation — ITIC BUILD Spotlight */}
      <section id="incubation" className="canoe-section canoe-section--alt">
        <div className="container">
          <div className="canoe-section-header">
            <span className="canoe-section-label">
              <Award size={14} /> Incubation & Enterprise
            </span>
            <h2 className="canoe-section-title">{concreteCanoeLab.outcomes.heading}</h2>
          </div>

          <div className="canoe-spotlight-card">
            <div className="canoe-spotlight-top">
              <div className="canoe-spotlight-badge">
                <Trophy size={14} /> {concreteCanoeLab.outcomes.subheading}
              </div>
              <div className="canoe-grant-pill">
                <span>Seed Capital:</span>
                <span className="canoe-grant-amount">₹1,00,000 (One Lakh INR)</span>
              </div>
            </div>

            <h3 className="canoe-spotlight-title">IIT Hyderabad Technology Incubation Centre (ITIC) Awardee</h3>

            {concreteCanoeLab.outcomes.paragraphs.map((para, i) => (
              <p key={i} className="canoe-spotlight-desc">
                {para}
              </p>
            ))}

            <div className="canoe-spotlight-brief">
              <strong>Innovation Brief:</strong> {concreteCanoeLab.outcomes.brief}
            </div>

            <div>
              <div className="canoe-spotlight-team-title">Student Innovators & Founders (Team WAKA)</div>
              <div className="canoe-student-badges-grid">
                {concreteCanoeLab.outcomes.team.rows.map((row, idx) => (
                  <div key={idx} className="canoe-student-badge">
                    <span className="canoe-student-reg">{row[1]}</span>
                    <span>{row[2]}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Ongoing Academic Project (AY 2023–2024) */}
      <section id="research" className="canoe-section">
        <div className="container">
          <div className="canoe-section-header">
            <span className="canoe-section-label">
              <FlaskConical size={14} /> Active Academic Research
            </span>
            <h2 className="canoe-section-title">Final Year Project Showcase</h2>
          </div>

          <div className="canoe-project-card">
            <div className="canoe-project-header">
              <h3 className="canoe-project-heading">{concreteCanoeLab.academicProject.heading}</h3>
            </div>

            <div className="canoe-project-body">
              <div className="canoe-project-prose">
                {concreteCanoeLab.academicProject.paragraphs.map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
              </div>

              <h4 style={{ fontSize: 'var(--text-base)', fontWeight: 800, color: 'var(--color-primary)', marginBottom: 'var(--space-3)' }}>
                Project Research Team
              </h4>

              <div className="canoe-table-container">
                <table className="canoe-table">
                  <thead>
                    <tr>
                      {concreteCanoeLab.academicProject.team.headers.map((h, i) => (
                        <th key={i}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {concreteCanoeLab.academicProject.team.rows.map((r, i) => (
                      <tr key={i}>
                        {r.map((cell, cIdx) => (
                          <td key={cIdx} style={cIdx === 1 ? { fontWeight: 700, color: 'var(--color-primary)' } : {}}>
                            {cell || '—'}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Canoe Fleet Evolution Matrix (Previous Project Works) */}
      <section id="fleet" className="canoe-section canoe-section--alt">
        <div className="container">
          <div className="canoe-section-header">
            <span className="canoe-section-label">
              <Layers size={14} /> Engineering Evolution
            </span>
            <h2 className="canoe-section-title">Previous Project Works & Canoe Fleet Matrix</h2>
            <p className="canoe-section-lead">
              A comprehensive technical comparison of progressive concrete canoe models developed by successive student cohorts, showcasing advancements in structural design, lightweight concrete mix proportions, and hydrodynamic modelling tools.
            </p>
          </div>

          <div className="canoe-fleet-matrix">
            <table className="canoe-fleet-table">
              <thead>
                <tr>
                  {concreteCanoeLab.previousProjects.table.headers.map((h, i) => (
                    <th key={i}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {concreteCanoeLab.previousProjects.table.rows.map((row, rIdx) => (
                  <tr key={rIdx}>
                    {row.map((cell, cIdx) => (
                      <td key={cIdx}>{cell}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* 5. Competitions & Accolades Timeline */}
      <section id="competitions" className="canoe-section">
        <div className="container">
          <div className="canoe-section-header">
            <span className="canoe-section-label">
              <Trophy size={14} /> Accolades & Recognition
            </span>
            <h2 className="canoe-section-title">Competitions & Awards Record</h2>
            <p className="canoe-section-lead">
              SVECW civil engineering students consistently achieve top honors, first prizes, and special recognitions across national competitions and technical symposiums.
            </p>
          </div>

          <div className="canoe-competitions-grid">
            {concreteCanoeLab.competitions.map((comp, i) => {
              const isFirstPrize = comp.remarks.toLowerCase().includes('first prize');
              return (
                <div key={i} className="canoe-award-card">
                  <div>
                    <div className="canoe-award-top">
                      <span className={`canoe-award-pill ${isFirstPrize ? 'first-prize' : ''}`}>
                        <Trophy size={12} /> {comp.remarks}
                      </span>
                      <span className="canoe-award-date">
                        <Calendar size={12} /> {comp.date}
                      </span>
                    </div>

                    <h3 className="canoe-award-name">{comp.name}</h3>

                    <div style={{ display: 'inline-block', fontSize: 'var(--text-xs)', fontWeight: 700, color: 'var(--color-primary)', background: 'rgba(11, 30, 66, 0.06)', padding: '0.2rem 0.5rem', borderRadius: '4px', marginBottom: 'var(--space-3)' }}>
                      Cohort: {comp.year}
                    </div>
                  </div>

                  <div className="canoe-award-students">
                    <div className="canoe-award-students-label">Participating Student Engineers:</div>
                    <div className="canoe-students-chips">
                      {comp.students.map((student, sIdx) => (
                        <span key={sIdx} className="canoe-student-chip">
                          {student}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 6. National Event (NCCC) Highlight Banner */}
      <section id="events" className="canoe-section canoe-section--alt">
        <div className="container">
          <div className="canoe-event-card">
            <span className="canoe-event-badge">
              <Award size={14} /> Historic Milestone
            </span>
            <h3 className="canoe-event-title">National Concrete Canoe Competition (NCCC)</h3>
            <div className="canoe-event-body">
              {concreteCanoeLab.activities.map((act, i) => (
                <p key={i}>{act}</p>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 7. Leadership, Mentorship & Student Cohorts */}
      <section id="mentors" className="canoe-section">
        <div className="container">
          <div className="canoe-section-header">
            <span className="canoe-section-label">
              <Users size={14} /> Faculty & Student Roster
            </span>
            <h2 className="canoe-section-title">Leadership & Student Beneficiaries</h2>
          </div>

          <div className="canoe-leadership-grid">
            {/* Faculty In-Charge Card */}
            <div className="canoe-incharge-card">
              <span className="canoe-incharge-tag">Faculty In-Charge</span>
              <h3 className="canoe-incharge-name">{concreteCanoeLab.inCharge.name}</h3>
              <div className="canoe-incharge-role">{concreteCanoeLab.inCharge.designation}</div>

              <div className="canoe-incharge-contacts">
                {concreteCanoeLab.inCharge.email && (
                  <a href={`mailto:${concreteCanoeLab.inCharge.email}`} className="canoe-contact-link">
                    <Mail size={16} color="var(--color-accent)" /> {concreteCanoeLab.inCharge.email}
                  </a>
                )}
                {concreteCanoeLab.inCharge.mobile && (
                  <a href={`tel:${concreteCanoeLab.inCharge.mobile}`} className="canoe-contact-link">
                    <Phone size={16} color="var(--color-accent)" /> +91 {concreteCanoeLab.inCharge.mobile}
                  </a>
                )}
              </div>

              {concreteCanoeLab.inCharge.interests && (
                <div>
                  <div className="canoe-incharge-interests-label">Research & Domain Interests:</div>
                  <div className="canoe-interests-chips">
                    {concreteCanoeLab.inCharge.interests.split(',').map((int, i) => (
                      <span key={i} className="canoe-interest-chip">
                        {int.trim()}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Faculty Mentors & Student Cohorts */}
            <div className="canoe-cohorts-box">
              {/* Faculty Mentors */}
              <div className="canoe-mentors-card">
                <h4 className="canoe-subcard-title">
                  <Users size={18} color="var(--color-accent)" /> Faculty Mentors
                </h4>
                <ul className="canoe-mentors-list">
                  {concreteCanoeLab.facultyMentors.map((mentor, i) => (
                    <li key={i} className="canoe-mentor-item">
                      <span className="canoe-check-badge">
                        <Check size={12} strokeWidth={3} />
                      </span>
                      <span>{mentor}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Student Cohorts */}
              <div className="canoe-mentors-card">
                <h4 className="canoe-subcard-title">
                  <Award size={18} color="var(--color-accent)" /> Students Benefited & Cohorts
                </h4>
                <div className="canoe-teams-grid">
                  {concreteCanoeLab.studentsBenefited.map((team, i) => (
                    <div key={i} className="canoe-team-card">
                      <div className="canoe-team-header">
                        <span>{team.label}</span>
                        <span className="canoe-team-count">{team.students.length} Students</span>
                      </div>
                      <div className="canoe-students-chips">
                        {team.students.map((student, sIdx) => (
                          <span key={sIdx} className="canoe-student-chip">
                            {student}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 8. Photo Gallery */}
      {allGalleryPhotos.length > 0 && (
        <section id="gallery" className="canoe-section canoe-section--alt">
          <div className="container">
            <div className="canoe-section-header">
              <span className="canoe-section-label">
                <Maximize2 size={14} /> Visual Showcase
              </span>
              <h2 className="canoe-section-title">Laboratory & Field Testing Gallery</h2>
            </div>

            <div className="canoe-gallery-grid">
              {allGalleryPhotos.map((photo, i) => (
                <button
                  key={i}
                  type="button"
                  className="canoe-gallery-tile"
                  onClick={() => setLightbox({ photos: allGalleryPhotos, index: i })}
                  aria-label={`View laboratory photo ${i + 1}`}
                >
                  <div className="canoe-gallery-img-wrap">
                    <img src={photo.imageUrl} alt={photo.caption || 'Concrete Canoe Lab'} className="canoe-gallery-img" loading="lazy" />
                    <div className="canoe-gallery-overlay">
                      <Maximize2 size={24} />
                    </div>
                  </div>
                  {photo.caption && <div className="canoe-gallery-caption">{photo.caption}</div>}
                </button>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 9. Key Highlights & Facilities */}
      <section id="highlights" className="canoe-section">
        <div className="container">
          <div className="canoe-highlights-grid">
            <div className="canoe-highlight-card">
              <div className="canoe-highlight-header">
                <Sparkles size={22} color="var(--color-accent)" />
                <h3 className="canoe-highlight-title">Key Highlights</h3>
              </div>
              <ul className="canoe-mission-list">
                {highlightList.map((item, i) => (
                  <li key={i} className="canoe-mission-item">
                    <span className="canoe-check-badge">
                      <Check size={12} strokeWidth={3} />
                    </span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="canoe-highlight-card">
              <div className="canoe-highlight-header">
                <Cpu size={22} color="var(--color-accent)" />
                <h3 className="canoe-highlight-title">Facilities & Equipment</h3>
              </div>
              <ul className="canoe-mission-list">
                {facilityList.map((item, i) => (
                  <li key={i} className="canoe-mission-item">
                    <span className="canoe-check-badge">
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

      {/* 10. University Call to Action (CTA) */}
      <section className="canoe-cta-section">
        <div className="container">
          <h2 className="canoe-cta-title">Explore More Differentiators</h2>
          <p className="canoe-cta-desc">
            Discover all the unique initiatives, labs, and specialized centres that make Vishnu Women's University an extraordinary place to learn, innovate, and lead.
          </p>
          <div className="canoe-cta-buttons">
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
        <div className="canoe-lightbox-backdrop" onClick={() => setLightbox(null)}>
          <div className="canoe-lightbox-dialog" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              className="canoe-lightbox-close"
              onClick={() => setLightbox(null)}
              aria-label="Close photo viewer"
            >
              <X size={20} />
            </button>

            {lightbox.photos.length > 1 && (
              <>
                <button
                  type="button"
                  className="canoe-lightbox-btn canoe-lightbox-btn--prev"
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
                  className="canoe-lightbox-btn canoe-lightbox-btn--next"
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
              alt={lightbox.photos[lightbox.index].caption || 'Concrete Canoe Lab Photo'}
              className="canoe-lightbox-img"
            />

            {lightbox.photos[lightbox.index].caption && (
              <div className="canoe-lightbox-caption">{lightbox.photos[lightbox.index].caption}</div>
            )}
          </div>
        </div>
      )}
    </main>
  );
}
