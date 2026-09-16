import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  HeartHandshake,
  Target,
  Sparkles,
  Globe2,
  Calendar,
  Mail,
  Phone,
  BookOpen,
  Cpu,
  Layers,
  ChevronLeft,
  ChevronRight,
  X,
  Maximize2,
  Check,
  Compass,
  Users,
  Eye,
  Activity,
  MessageSquare,
  Wrench,
} from 'lucide-react';
import SEO from '../../components/SEO/SEO';
import SmoothImage from '../../components/SmoothImage/SmoothImage';
import RouteFallback from '../../components/RouteFallback/RouteFallback';
import { useOrderedCollection } from '../../hooks/useCollection';
import { usePageBanners } from '../../hooks/usePageBanners';
import { fetchPriorityAttr } from '../../lib/domAttrs';
import { hasCustomSectionContent, type CustomSectionPhoto } from '../../lib/customSections';
import { DIFFERENTIATOR_CATEGORIES, type DifferentiatorItemDoc } from '../Admin/sections/DifferentiatorsAdmin';
import { assistiveTechLab } from './assistiveTechLab.data';
import './AssistiveTechLab.css';

const SLUG = 'assistive-tech-lab';

export default function AssistiveTechLab() {
  const { docs: allItems, loading } = useOrderedCollection<DifferentiatorItemDoc>('differentiatorItems', 'order');
  const { slides: heroSlides } = usePageBanners('differentiators-detail');
  const item = allItems.find((i) => i.slug === SLUG) ?? null;
  const [lightbox, setLightbox] = useState<{ photos: { imageUrl: string; caption?: string }[]; index: number } | null>(null);
  const [activeNav, setActiveNav] = useState('overview');
  const [selectedYearIdx, setSelectedYearIdx] = useState(0);

  useEffect(() => {
    document.title = "Assistive Technology Lab (ATL) | Vishnu Women's University";
  }, []);

  // Update active nav link based on scroll position
  useEffect(() => {
    const handleScroll = () => {
      const sectionIds = ['overview', 'umass', 'devices', 'trainings', 'events', 'faculty', 'facilities', 'gallery'];
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
    '/gallery/differentiators/atl-1.jpg' ||
    heroSlides[0]?.imageUrl;

  // Extract dynamic photos from Firestore custom sections
  const customSections = item?.customSections || [];
  const gallerySections = customSections.filter((s) => s.contentType === 'gallery' && hasCustomSectionContent(s));
  const dynamicPhotos: CustomSectionPhoto[] = gallerySections.flatMap((s) => s.galleryPhotos || []).filter((p) => p.imageUrl);

  const defaultGalleryPhotos = [
    { imageUrl: '/gallery/differentiators/atl-1.jpg', caption: 'Students designing assistive devices in the laboratory' },
    { imageUrl: '/gallery/differentiators/atl-2.jpg', caption: 'Assistive technology testing and sensor calibration' },
    { imageUrl: '/gallery/differentiators/atl-3.jpg', caption: 'Community client interaction and prototype demonstration' },
    { imageUrl: '/gallery/differentiators/atl-4.jpg', caption: 'International collaboration session with UMass Lowell' },
    { imageUrl: '/gallery/differentiators/atl-5.jpg', caption: 'Hardware prototyping bench with custom electronic rigs' },
    { imageUrl: '/gallery/differentiators/atl-6.jpg', caption: 'Student innovator presentation on disability aids' },
  ];

  const allGalleryPhotos = dynamicPhotos.length > 0 ? dynamicPhotos : defaultGalleryPhotos;

  // Key assistive devices portfolio
  const assistiveDevices = [
    {
      title: 'Smart Braille Slate & Reader',
      category: 'Visual & Tactile Aids',
      description: 'An affordable electronic Braille writing and reading aid with real-time audio playback feedback for visually impaired students.',
      icon: Eye,
      tag: 'Visual Impairment',
    },
    {
      title: 'Haptic Obstacle Navigator',
      category: 'Sensory Navigation',
      description: 'Wearable ultrasonic sensor belt and smart cane that produces graduated vibrational alerts for obstacle avoidance.',
      icon: Compass,
      tag: 'Mobility Assist',
    },
    {
      title: 'Sign Language Translator Glove',
      category: 'Communication Assist',
      description: 'Flex-sensor embedded smart glove that translates hand gestures into synthesized speech and text on mobile screens.',
      icon: MessageSquare,
      tag: 'Deaf & Mute Community',
    },
    {
      title: 'Automated Smart Wheelchair',
      category: 'Mobility & Motor Control',
      description: 'Intelligent motorized wheelchair with head-tilt, joystick, and obstacle avoidance features for individuals with quadriplegia.',
      icon: Activity,
      tag: 'Motor Disability',
    },
    {
      title: 'Tremor-Stabilizing Smart Cutlery',
      category: 'Daily Living Assist',
      description: 'Active gyroscopic stabilizing spoon and fork enabling individuals with Parkinson’s or essential tremors to dine independently.',
      icon: Wrench,
      tag: 'Elderly & Neurological',
    },
    {
      title: 'Zion Special School Custom Aids',
      category: 'Community Prototypes',
      description: 'Custom therapeutic and educational interactive kits co-created with special educators at Zion Special School, Rajahmundry.',
      icon: HeartHandshake,
      tag: 'Special Education',
    },
  ];

  // Community Events and Exhibitions
  const communityEvents = [
    {
      title: 'Zion Special School, Rajahmundry Client Visits',
      badge: 'Community Outreach',
      description: 'SVECW student teams conduct on-site field visits to understand the daily physical and educational needs of differently-abled children, gathering real user requirements.',
      date: 'Annual Engagement',
    },
    {
      title: 'International Day of Persons with Disabilities',
      badge: 'Annual Exhibition',
      description: 'Annual flagship exhibition showcasing student-developed assistive prototypes, interactive demos for NGO representatives, and public awareness campaigns.',
      date: 'Dec 3 (2023, 2024, 2025)',
    },
    {
      title: 'IIC Regional Meet Vijayawada',
      badge: 'Innovation Spotlight',
      description: 'ATL student innovators presented patented assistive technology prototypes before national innovation council leaders and jury members.',
      date: 'Regional Showcase',
    },
    {
      title: 'Innovation Project Fair at JNTU Kakinada',
      badge: 'University Level Honor',
      description: 'Recognition and top accolades awarded to interdisciplinary assistive hardware rigs engineered by women engineering students.',
      date: 'State-Level Fair',
    },
    {
      title: 'AVISHKANDHRA RTIH & Trance 2K25',
      badge: 'National Technical Fest',
      description: 'Live field demonstrations of assistive robotic devices and smart sensor kits before academic and industry experts.',
      date: 'National Fest',
    },
  ];

  // Facilities & Equipment
  const equipmentList = [
    'Complete electronic hardware prototyping and sensor characterization workstations.',
    'Dedicated 3D printing and rapid mechanical prototyping rigs for custom ergonomic enclosures.',
    'DSP, microcontroller, and FPGA embedded development boards (Arduino, STM32, Raspberry Pi, TI DSP).',
    'Assistive software suite for audio synthesis, image processing, and gesture recognition algorithms.',
    'Biomedical sensor kits (EMG, EEG, Flex sensors, load cells, ultrasonic arrays).',
  ];

  const highlightsList = [
    'Established in 2009 in global collaboration with University of Massachusetts (UMass), Lowell, USA.',
    'Annual mentorship visits by Prof. Alan Rux, founder of Assistive Technology Program at UMass Lowell.',
    'Interdisciplinary platform uniting students from ECE, EEE, CSE, IT, ME, and Basic Sciences for noble social engineering.',
    'Real-world service learning directly impacting community special schools and people with disabilities.',
    'Comprehensive multi-year bridge courses cultivating product design, budget management, and empathy-driven engineering.',
  ];

  return (
    <main className="page-wrapper atl-page">
      <SEO
        title="Assistive Technology Lab (ATL) | Vishnu Women's University"
        description="A pioneering center for interdisciplinary assistive technology, empowering differently-abled individuals in collaboration with UMass Lowell, USA."
        canonicalPath={`/differentiators/${SLUG}`}
      />

      {/* Hero Banner — Clean & Unobstructed Cover */}
      <section className="atl-hero-section">
        <div className="container">
          <div className="atl-hero-card">
            {heroImage && (
              <SmoothImage
                src={heroImage}
                alt="Assistive Technology Lab (ATL)"
                className="atl-hero-bg"
                loading="eager"
                decoding="sync"
                {...fetchPriorityAttr('high')}
              />
            )}
            <div className="atl-hero-content animate-fade-in-up">
              <nav aria-label="Breadcrumb" className="atl-breadcrumb">
                <Link to="/">Home</Link>
                <span className="atl-breadcrumb-sep">›</span>
                <Link to="/differentiators">Differentiators</Link>
                <span className="atl-breadcrumb-sep">›</span>
                <Link to={`/differentiators#${category?.id || 'research'}`}>{category?.label || 'Research & Specialised Labs'}</Link>
                <span className="atl-breadcrumb-sep">›</span>
                <span className="atl-breadcrumb-current">Assistive Technology Lab (ATL)</span>
              </nav>

              <div className="atl-badge">
                <HeartHandshake size={14} /> {category?.label || 'Research & Specialised Labs'}
              </div>

              <h1 className="atl-hero-title">Assistive Technology Lab (ATL)</h1>

              <p className="atl-hero-subtitle">
                {item?.summary ||
                  'A visionary center established in collaboration with University of Massachusetts (UMass), Lowell, USA — applying multidisciplinary engineering to design life-changing devices for the differently-abled.'}
              </p>

              <div className="atl-hero-stats">
                <span className="atl-stat-pill">
                  <Globe2 size={13} /> <strong>Global Partner:</strong> UMass Lowell, USA
                </span>
                <span className="atl-stat-pill">
                  <Calendar size={13} /> <strong>Established:</strong> 2009 (15+ Years)
                </span>
                <span className="atl-stat-pill">
                  <HeartHandshake size={13} /> <strong>Core Focus:</strong> Assistive Tech & Service Learning
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Sticky Quick-Jump Navigation Bar */}
      <div className="atl-sticky-nav-wrapper">
        <div className="container">
          <nav className="atl-nav-scroll" aria-label="Page Sections Navigation">
            <a href="#overview" className={`atl-nav-item ${activeNav === 'overview' ? 'active' : ''}`}>
              <BookOpen size={14} /> Overview & Mission
            </a>
            <a href="#umass" className={`atl-nav-item ${activeNav === 'umass' ? 'active' : ''}`}>
              <Globe2 size={14} /> UMass Lowell Collaboration
            </a>
            <a href="#devices" className={`atl-nav-item ${activeNav === 'devices' ? 'active' : ''}`}>
              <Cpu size={14} /> Assistive Devices
            </a>
            <a href="#trainings" className={`atl-nav-item ${activeNav === 'trainings' ? 'active' : ''}`}>
              <Layers size={14} /> Bridge Courses & Projects
            </a>
            <a href="#events" className={`atl-nav-item ${activeNav === 'events' ? 'active' : ''}`}>
              <Calendar size={14} /> Community & Events
            </a>
            <a href="#faculty" className={`atl-nav-item ${activeNav === 'faculty' ? 'active' : ''}`}>
              <Users size={14} /> Faculty & Mentors
            </a>
            <a href="#facilities" className={`atl-nav-item ${activeNav === 'facilities' ? 'active' : ''}`}>
              <Wrench size={14} /> Facilities
            </a>
            {allGalleryPhotos.length > 0 && (
              <a href="#gallery" className={`atl-nav-item ${activeNav === 'gallery' ? 'active' : ''}`}>
                <Maximize2 size={14} /> Gallery
              </a>
            )}
          </nav>
        </div>
      </div>

      {/* 1. Overview, Vision, Mission & Objectives */}
      <section id="overview" className="atl-section">
        <div className="container">
          <div className="atl-section-header">
            <span className="atl-section-label">
              <Compass size={14} /> Center of Excellence
            </span>
            <h2 className="atl-section-title">About the Assistive Technology Lab</h2>
            <p className="atl-section-lead">
              Founded on the principle of utilizing engineering knowledge for compassionate societal service, ATL empowers women engineers to solve authentic accessibility challenges.
            </p>
          </div>

          <div className="atl-overview-card">
            <HeartHandshake size={140} className="atl-overview-watermark" aria-hidden="true" />
            <div className="atl-prose">
              {assistiveTechLab.paragraphs.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
          </div>

          {/* Mission & Objectives Grid */}
          <div className="atl-vm-grid">
            {/* Mission */}
            <div className="atl-vm-card">
              <div className="atl-vm-header">
                <div className="atl-vm-icon-box">
                  <Target size={22} />
                </div>
                <h3 className="atl-vm-title">Our Mission</h3>
              </div>
              <ul className="atl-checklist">
                {assistiveTechLab.mission.map((item, i) => (
                  <li key={i} className="atl-checklist-item">
                    <span className="atl-check-badge">
                      <Check size={12} strokeWidth={3} />
                    </span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Objectives */}
            <div className="atl-vm-card">
              <div className="atl-vm-header">
                <div className="atl-vm-icon-box">
                  <Sparkles size={22} />
                </div>
                <h3 className="atl-vm-title">Core Objectives</h3>
              </div>
              <ul className="atl-checklist">
                {assistiveTechLab.objectives.map((item, i) => (
                  <li key={i} className="atl-checklist-item">
                    <span className="atl-check-badge">
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

      {/* 2. Global Collaboration Spotlight (UMass Lowell & Prof. Alan Rux) */}
      <section id="umass" className="atl-section atl-section--alt">
        <div className="container">
          <div className="atl-section-header">
            <span className="atl-section-label">
              <Globe2 size={14} /> International Partnership
            </span>
            <h2 className="atl-section-title">Collaboration with UMass Lowell, USA</h2>
          </div>

          <div className="atl-spotlight-card">
            <div className="atl-spotlight-top">
              <span className="atl-spotlight-badge">
                <Globe2 size={14} /> Sustained International Partnership Since 2009
              </span>
              <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-accent-light)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                Annual July Immersion
              </span>
            </div>

            <h3 className="atl-spotlight-title">Annual Mentorship by Professor Alan Rux</h3>

            <p className="atl-spotlight-desc">
              Professor Alan Rux, founder of the renowned Assistive Technology Program at the University of Massachusetts, Lowell, USA, visits Shri Vishnu Engineering College for Women annually every July. He conducts hands-on workshops, mentors student teams, evaluates design trade-offs, and guides the creation of affordable prototypes tailored to real community clients with disabilities.
            </p>

            <div className="atl-quote-box">
              “ATL provides a rich, authentic learning experience. Students learn the complete engineering design cycle, manage project budgets, analyze alternative materials, and develop critical workplace skills while giving back to society.”
              <span className="atl-quote-author">— Assistive Technology Program Leadership, UMass Lowell</span>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Assistive Devices & Innovative Projects Portfolio */}
      <section id="devices" className="atl-section">
        <div className="container">
          <div className="atl-section-header">
            <span className="atl-section-label">
              <Cpu size={14} /> Innovation Portfolio
            </span>
            <h2 className="atl-section-title">Assistive Devices & Technologies</h2>
            <p className="atl-section-lead">
              Student-engineered devices delivering tangible improvements in mobility, sensory navigation, communication, and daily independence for people with disabilities.
            </p>
          </div>

          <div className="atl-devices-grid">
            {assistiveDevices.map((device, i) => {
              const Icon = device.icon;
              return (
                <div key={i} className="atl-device-card">
                  <div>
                    <div className="atl-device-top">
                      <div className="atl-device-icon">
                        <Icon size={22} />
                      </div>
                      <div>
                        <span style={{ fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--color-accent)' }}>
                          {device.category}
                        </span>
                        <h3 className="atl-device-title">{device.title}</h3>
                      </div>
                    </div>
                    <p className="atl-device-desc">{device.description}</p>
                  </div>
                  <span className="atl-device-tag">{device.tag}</span>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 4. Bridge Courses & Annual Student Projects */}
      {assistiveTechLab.trainingByYear.length > 0 && (
        <section id="trainings" className="atl-section atl-section--alt">
          <div className="container">
            <div className="atl-section-header">
              <span className="atl-section-label">
                <Layers size={14} /> Academic Bridge Courses
              </span>
              <h2 className="atl-section-title">Annual Trainings & Student Project Teams</h2>
              <p className="atl-section-lead">
                Structured multi-tier training programs conducted every academic year, guiding multidisciplinary student batches from theoretical design to working prototypes.
              </p>
            </div>

            {/* Year selector pills */}
            <div style={{ display: 'flex', gap: 'var(--space-2)', overflowX: 'auto', paddingBottom: 'var(--space-4)', marginBottom: 'var(--space-4)' }}>
              {assistiveTechLab.trainingByYear.map((t, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setSelectedYearIdx(idx)}
                  style={{
                    padding: '0.5rem 1.1rem',
                    borderRadius: 'var(--radius-full)',
                    border: selectedYearIdx === idx ? '2px solid var(--color-accent)' : '1px solid var(--color-light-gray)',
                    background: selectedYearIdx === idx ? 'var(--color-primary)' : 'var(--color-white)',
                    color: selectedYearIdx === idx ? 'var(--color-white)' : 'var(--color-text)',
                    fontWeight: 800,
                    fontSize: 'var(--text-xs)',
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                    transition: 'all 0.2s ease',
                  }}
                >
                  {t.yearLabel}
                </button>
              ))}
            </div>

            {/* Selected Year Detail Card */}
            {assistiveTechLab.trainingByYear[selectedYearIdx] && (
              <div className="atl-training-year-card">
                <div className="atl-training-year-header">
                  <h3 className="atl-training-year-title">{assistiveTechLab.trainingByYear[selectedYearIdx].yearLabel} — Bridge Course Details</h3>
                </div>

                <div className="atl-training-body">
                  {/* Bridge Course Table */}
                  <div className="atl-table-container">
                    <table className="atl-table">
                      <thead>
                        <tr>
                          {assistiveTechLab.trainingByYear[selectedYearIdx].bridgeCourse.headers.map((h, i) => (
                            <th key={i}>{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {assistiveTechLab.trainingByYear[selectedYearIdx].bridgeCourse.rows.map((row, rIdx) => (
                          <tr key={rIdx}>
                            {row.map((cell, cIdx) => (
                              <td key={cIdx}>{cell}</td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Projects for this year */}
                  {assistiveTechLab.trainingByYear[selectedYearIdx].projects.length > 0 && (
                    <div style={{ marginTop: 'var(--space-6)' }}>
                      <h4 style={{ fontSize: 'var(--text-base)', fontWeight: 800, color: 'var(--color-primary)', marginBottom: 'var(--space-2)' }}>
                        Selected Projects Developed:
                      </h4>
                      <div className="atl-training-projects-grid">
                        {assistiveTechLab.trainingByYear[selectedYearIdx].projects.map((proj, pIdx) => (
                          <div key={pIdx} className="atl-project-mini-card">
                            <div className="atl-project-mini-title">{proj.title}</div>
                            <p className="atl-project-mini-desc">{proj.description}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </section>
      )}

      {/* 5. Community Engagement & Events Timeline */}
      <section id="events" className="atl-section">
        <div className="container">
          <div className="atl-section-header">
            <span className="atl-section-label">
              <Calendar size={14} /> Outreach & Impact
            </span>
            <h2 className="atl-section-title">Community Engagement & Exhibitions</h2>
            <p className="atl-section-lead">
              Direct field trials with special educators, community disability centers, and state/national project fairs.
            </p>
          </div>

          <div className="atl-events-grid">
            {communityEvents.map((evt, i) => (
              <div key={i} className="atl-event-card">
                <div>
                  <span className="atl-event-badge">{evt.badge}</span>
                  <h3 className="atl-event-title">{evt.title}</h3>
                  <p className="atl-event-desc">{evt.description}</p>
                </div>
                <div style={{ marginTop: 'var(--space-4)', paddingTop: 'var(--space-2)', borderTop: '1px solid var(--color-light-gray)', fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-text-light)' }}>
                  📅 {evt.date}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. Leadership & Faculty Mentors Roster */}
      <section id="faculty" className="atl-section atl-section--alt">
        <div className="container">
          <div className="atl-section-header">
            <span className="atl-section-label">
              <Users size={14} /> Leadership & Guidance
            </span>
            <h2 className="atl-section-title">Faculty Mentors & Laboratory Leadership</h2>
          </div>

          <div className="atl-faculty-grid">
            {/* Dean Card */}
            <div className="atl-faculty-card atl-faculty-card--dean">
              <div>
                <span className="atl-faculty-role">Dean & Faculty Advisor</span>
                <h3 className="atl-faculty-name">{assistiveTechLab.team.dean.name}</h3>
                <div className="atl-faculty-desig">{assistiveTechLab.team.dean.designation}</div>
              </div>
              <div className="atl-faculty-contact">
                {assistiveTechLab.team.dean.email && (
                  <a href={`mailto:${assistiveTechLab.team.dean.email}`} className="atl-faculty-link">
                    <Mail size={14} color="var(--color-accent)" /> {assistiveTechLab.team.dean.email}
                  </a>
                )}
                {assistiveTechLab.team.dean.mobile && (
                  <a href={`tel:${assistiveTechLab.team.dean.mobile}`} className="atl-faculty-link">
                    <Phone size={14} color="var(--color-accent)" /> +91 {assistiveTechLab.team.dean.mobile}
                  </a>
                )}
              </div>
            </div>

            {/* In-Charge Card */}
            <div className="atl-faculty-card" style={{ border: '1.5px solid var(--color-accent)' }}>
              <div>
                <span className="atl-faculty-role">Laboratory In-Charge</span>
                <h3 className="atl-faculty-name">{assistiveTechLab.team.inCharge.name}</h3>
                <div className="atl-faculty-desig">{assistiveTechLab.team.inCharge.designation}</div>
              </div>
              <div className="atl-faculty-contact">
                {assistiveTechLab.team.inCharge.email && (
                  <a href={`mailto:${assistiveTechLab.team.inCharge.email}`} className="atl-faculty-link">
                    <Mail size={14} color="var(--color-accent)" /> {assistiveTechLab.team.inCharge.email}
                  </a>
                )}
                {assistiveTechLab.team.inCharge.mobile && (
                  <a href={`tel:${assistiveTechLab.team.inCharge.mobile}`} className="atl-faculty-link">
                    <Phone size={14} color="var(--color-accent)" /> +91 {assistiveTechLab.team.inCharge.mobile}
                  </a>
                )}
              </div>
            </div>

            {/* Other Faculty Mentors */}
            {assistiveTechLab.team.facultyMembers.map((member, i) => (
              <div key={i} className="atl-faculty-card">
                <div>
                  <span className="atl-faculty-role">Faculty Mentor</span>
                  <h3 className="atl-faculty-name" style={{ fontSize: '1.15rem' }}>{member.name}</h3>
                  <div className="atl-faculty-desig">{member.designation}</div>
                </div>
                <div className="atl-faculty-contact">
                  {member.email && (
                    <a href={`mailto:${member.email}`} className="atl-faculty-link">
                      <Mail size={14} color="var(--color-accent)" /> {member.email}
                    </a>
                  )}
                  {member.mobile && (
                    <a href={`tel:${member.mobile}`} className="atl-faculty-link">
                      <Phone size={14} color="var(--color-accent)" /> +91 {member.mobile}
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. Facilities & Key Highlights */}
      <section id="facilities" className="atl-section">
        <div className="container">
          <div className="atl-vm-grid">
            {/* Key Highlights */}
            <div className="atl-vm-card">
              <div className="atl-vm-header">
                <div className="atl-vm-icon-box">
                  <Sparkles size={22} />
                </div>
                <h3 className="atl-vm-title">Key Highlights</h3>
              </div>
              <ul className="atl-checklist">
                {highlightsList.map((item, i) => (
                  <li key={i} className="atl-checklist-item">
                    <span className="atl-check-badge">
                      <Check size={12} strokeWidth={3} />
                    </span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Facilities & Equipment */}
            <div className="atl-vm-card">
              <div className="atl-vm-header">
                <div className="atl-vm-icon-box">
                  <Wrench size={22} />
                </div>
                <h3 className="atl-vm-title">Facilities & Equipment</h3>
              </div>
              <ul className="atl-checklist">
                {equipmentList.map((item, i) => (
                  <li key={i} className="atl-checklist-item">
                    <span className="atl-check-badge">
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

      {/* 8. Photo Gallery */}
      {allGalleryPhotos.length > 0 && (
        <section id="gallery" className="atl-section atl-section--alt">
          <div className="container">
            <div className="atl-section-header">
              <span className="atl-section-label">
                <Maximize2 size={14} /> Visual Showcase
              </span>
              <h2 className="atl-section-title">Laboratory Activities & Prototyping Gallery</h2>
            </div>

            <div className="atl-gallery-grid">
              {allGalleryPhotos.map((photo, i) => (
                <button
                  key={i}
                  type="button"
                  className="atl-gallery-tile"
                  onClick={() => setLightbox({ photos: allGalleryPhotos, index: i })}
                  aria-label={`View laboratory photo ${i + 1}`}
                >
                  <div className="atl-gallery-img-wrap">
                    <img src={photo.imageUrl} alt={photo.caption || 'Assistive Tech Lab'} className="atl-gallery-img" loading="lazy" />
                    <div className="atl-gallery-overlay">
                      <Maximize2 size={24} />
                    </div>
                  </div>
                  {photo.caption && <div className="atl-gallery-caption">{photo.caption}</div>}
                </button>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 9. University Call to Action (CTA) */}
      <section className="atl-cta-section">
        <div className="container">
          <h2 className="atl-cta-title">Explore More Differentiators</h2>
          <p className="atl-cta-desc">
            Discover all the unique initiatives, labs, and specialized centres that make Vishnu Women's University an extraordinary place to learn, innovate, and serve society.
          </p>
          <div className="atl-cta-buttons">
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
        <div className="atl-lightbox-backdrop" onClick={() => setLightbox(null)}>
          <div className="atl-lightbox-dialog" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              className="atl-lightbox-close"
              onClick={() => setLightbox(null)}
              aria-label="Close photo viewer"
            >
              <X size={20} />
            </button>

            {lightbox.photos.length > 1 && (
              <>
                <button
                  type="button"
                  className="atl-lightbox-btn atl-lightbox-btn--prev"
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
                  className="atl-lightbox-btn atl-lightbox-btn--next"
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
              alt={lightbox.photos[lightbox.index].caption || 'Assistive Tech Lab Photo'}
              className="atl-lightbox-img"
            />

            {lightbox.photos[lightbox.index].caption && (
              <div className="atl-lightbox-caption">{lightbox.photos[lightbox.index].caption}</div>
            )}
          </div>
        </div>
      )}
    </main>
  );
}
