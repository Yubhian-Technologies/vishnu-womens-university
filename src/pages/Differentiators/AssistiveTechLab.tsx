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
import { CustomSectionsIntro, CustomSectionsGalleries, CustomSectionsAccordion } from '../../components/CustomSectionsRenderer/CustomSectionsRenderer';
import { hasCustomSectionContent, type CustomSectionPhoto } from '../../lib/customSections';
import { DIFFERENTIATOR_CATEGORIES, type DifferentiatorItemDoc } from '../Admin/sections/DifferentiatorsAdmin';
import { assistiveTechLab, type AtlStudentRosterYear, type AtlBlock, type AtlExhibitionYear, type AtlExhibitionShowcase, type AtlProjectOutcome, type AtlClientVisitYear, type AtlInnovationFair } from './assistiveTechLab.data';
import { useDocument } from '../../hooks/useDocument';
import type { AssistiveTechLabDoc } from '../Admin/sections/AssistiveTechContentAdmin';
import { renderBold } from '../../lib/boldText';
import BodyBlocks, { parseBodyContent } from '../../components/BodyBlocks/BodyBlocks';
import './AssistiveTechLab.css';

const SLUG = 'assistive-tech-lab';

// Helper to render activity/exhibition blocks
function renderAtlBlock(block: AtlBlock, bIdx: number) {
  switch (block.type) {
    case 'meta':
      return (
        <div key={bIdx} className="atl-block-meta">
          {block.items.map((item, i) => (
            <div key={i} className="atl-meta-item">
              <strong>{item.label}:</strong> {item.value}
            </div>
          ))}
        </div>
      );
    case 'paragraph':
      return (
        <div key={bIdx} className="atl-block-paragraph">
          <BodyBlocks blocks={parseBodyContent(block.text)} paragraphStyle={{}} />
        </div>
      );
    case 'heading':
      return (
        <h4 key={bIdx} className="atl-block-heading">
          {block.text}
        </h4>
      );
    case 'bullets':
      return (
        <ul key={bIdx} className="atl-block-bullets">
          {block.items.map((item, i) => (
            <li key={i}>{renderBold(item)}</li>
          ))}
        </ul>
      );
    case 'boldBullets':
      return (
        <ul key={bIdx} className="atl-block-bullets">
          {block.items.map((item, i) => (
            <li key={i}>
              <strong>{item.lead}</strong> {renderBold(item.text)}
            </li>
          ))}
        </ul>
      );
    case 'numbered':
      return (
        <ol key={bIdx} className="atl-block-numbered">
          {block.items.map((item, i) => (
            <li key={i}>{renderBold(item)}</li>
          ))}
        </ol>
      );
    case 'table':
      return (
        <div key={bIdx} className="atl-block-table-wrap">
          {block.title && <h5 className="atl-table-subheading">{block.title}</h5>}
          <div className="atl-table-container">
            <table className="atl-table atl-table--sm">
              <thead>
                <tr>
                  {block.table.headers.map((h, i) => (
                    <th key={i}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {block.table.rows.map((row, rIdx) => (
                  <tr key={rIdx}>
                    {row.cells.map((cell, cIdx) => (
                      <td key={cIdx}>{cell}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      );
    default:
      return null;
  }
}

// Resolves an AtlDevice's `icon` key (plain data — see assistiveTechLab.data.ts)
// to its lucide component. An unrecognized key (e.g. an older admin-saved
// row) falls back to Eye at the call site, same as every other admin-picked
// icon elsewhere on the site.
const DEVICE_ICONS: Record<string, typeof Eye> = {
  eye: Eye,
  compass: Compass,
  'message-square': MessageSquare,
  activity: Activity,
  wrench: Wrench,
  'heart-handshake': HeartHandshake,
};

export default function AssistiveTechLab() {
  const { docs: allItems, loading } = useOrderedCollection<DifferentiatorItemDoc>('differentiatorItems', 'order');
  const { slides: heroSlides } = usePageBanners('differentiators-detail');
  const item = allItems.find((i) => i.slug === SLUG) ?? null;
  const [lightbox, setLightbox] = useState<{ photos: { imageUrl: string; caption?: string }[]; index: number } | null>(null);
  const [activeNav, setActiveNav] = useState('overview');
  const [selectedYearIdx, setSelectedYearIdx] = useState(0);
  const [activeStudentTabIdx, setActiveStudentTabIdx] = useState<number | null>(null);
  const [activeExhibitionTabIdx, setActiveExhibitionTabIdx] = useState<number | null>(null);
  const [activeShowcaseTabIdx, setActiveShowcaseTabIdx] = useState<number | null>(null);
  const [activeOutcomeTabIdx, setActiveOutcomeTabIdx] = useState<number | null>(null);
  const [activeClientVisitTabIdx, setActiveClientVisitTabIdx] = useState<number | null>(null);
  const [activeInnovationTabIdx, setActiveInnovationTabIdx] = useState<number | null>(null);
  const { data: remoteData } = useDocument<AssistiveTechLabDoc>('settings', 'assistiveTechLab');
  const atl = { ...assistiveTechLab, ...(remoteData || {}) };

  const exhibitionReports: AtlExhibitionYear[] = (remoteData?.exhibitionReports && remoteData.exhibitionReports.length > 0)
    ? remoteData.exhibitionReports
    : (atl.exhibitionReports || []);

  const exhibitionShowcases: AtlExhibitionShowcase[] = (remoteData?.exhibitionShowcases && remoteData.exhibitionShowcases.length > 0)
    ? remoteData.exhibitionShowcases
    : (atl.exhibitionShowcases || []);

  const atlOutcomes: AtlProjectOutcome[] = (remoteData?.atlOutcomes && remoteData.atlOutcomes.length > 0)
    ? remoteData.atlOutcomes
    : (atl.atlOutcomes || []);

  const clientVisits: AtlClientVisitYear[] = (remoteData?.clientVisits && remoteData.clientVisits.length > 0)
    ? remoteData.clientVisits
    : (atl.clientVisits || []);

  const innovationFairs: AtlInnovationFair[] = (remoteData?.innovationFairs && remoteData.innovationFairs.length > 0)
    ? remoteData.innovationFairs
    : (atl.innovationFairs || []);

  const studentRosters: AtlStudentRosterYear[] = (remoteData?.studentRosters && remoteData.studentRosters.length > 0)
    ? remoteData.studentRosters
    : [
        { id: '2023-24', yearLabel: atl.studentsBenefitted?.yearLabel || 'Students Benefitted: Academic Year 2023-24', type: 'batches', batches: atl.studentsBenefitted?.batches || [] },
        { id: '2024-25', yearLabel: atl.studentsBenefitted2024?.yearLabel || 'Students Benefitted: Academic Year 2024-25', type: 'batches', batches: atl.studentsBenefitted2024?.batches || [] },
        { id: '2025-26', yearLabel: 'ATL Selected Students (2025-26)', type: 'table', table: atl.selectedStudents2025 || { headers: [], rows: [] } },
      ];

  const dynamicTitle = item?.title || 'Assistive Technology Lab (ATL)';
  const dynamicSubtitle = item?.summary || item?.desc || 'A visionary center established in collaboration with University of Massachusetts (UMass), Lowell, USA — applying multidisciplinary engineering to design life-changing devices for the differently-abled.';

  const aboutParagraphs = (item?.description && hasCustomSectionContent(item.description) && item.description.textContent)
    ? [item.description.textContent]
    : item?.desc
    ? [item.desc]
    : atl.paragraphs;

  const missionList = (item?.mission && hasCustomSectionContent(item.mission))
    ? (item.mission.listText ? item.mission.listText.split('\n').filter(Boolean) : [item.mission.textContent || ''])
    : atl.mission;

  const objectivesList = (item?.objectives && hasCustomSectionContent(item.objectives))
    ? (item.objectives.listText ? item.objectives.listText.split('\n').filter(Boolean) : [item.objectives.textContent || ''])
    : atl.objectives;

  useEffect(() => {
    document.title = `${dynamicTitle} | Vishnu Women's University`;
  }, [dynamicTitle]);

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
  const customSections = (remoteData?.customSections && remoteData.customSections.length > 0)
    ? remoteData.customSections
    : (item?.customSections || []);
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

  // Key assistive devices portfolio, community events, facilities/equipment
  // and key highlights — all admin-editable (Admin → Differentiators →
  // Assistive Technology Lab → All Page Content & Sections), same
  // paragraphs/mission/objectives/team/trainingByYear pattern as above:
  // `atl.*` already falls back to assistiveTechLab.data.ts's defaults when
  // nothing's been saved to Firestore yet, so this never renders blank.
  const assistiveDevices = atl.assistiveDevices;
  const communityEvents = atl.communityEvents;
  const equipmentList = atl.equipmentList;
  const highlightsList = atl.highlightsList;

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

              <h1 className="atl-hero-title">{dynamicTitle}</h1>

              <p className="atl-hero-subtitle">
                {renderBold(dynamicSubtitle)}
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
              {aboutParagraphs.map((p, i) => (
                <BodyBlocks key={i} blocks={parseBodyContent(p)} paragraphStyle={{}} />
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
                {missionList.map((item, i) => (
                  <li key={i} className="atl-checklist-item">
                    <span className="atl-check-badge">
                      <Check size={12} strokeWidth={3} />
                    </span>
                    <span>{renderBold(item)}</span>
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
                {objectivesList.map((item, i) => (
                  <li key={i} className="atl-checklist-item">
                    <span className="atl-check-badge">
                      <Check size={12} strokeWidth={3} />
                    </span>
                    <span>{renderBold(item)}</span>
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
              const Icon = DEVICE_ICONS[device.icon] || Eye;
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
                    <p className="atl-device-desc">{renderBold(device.description)}</p>
                  </div>
                  <span className="atl-device-tag">{device.tag}</span>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 4. Bridge Courses & Annual Student Projects */}
      {atl.trainingByYear.length > 0 && (
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
              {atl.trainingByYear.map((t, idx) => (
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
            {atl.trainingByYear[selectedYearIdx] && (
              <div className="atl-training-year-card">
                <div className="atl-training-year-header">
                  <h3 className="atl-training-year-title">{atl.trainingByYear[selectedYearIdx].yearLabel} — Bridge Course Details</h3>
                </div>

                <div className="atl-training-body">
                  {/* Bridge Course Table */}
                  <div className="atl-table-container">
                    <table className="atl-table">
                      <thead>
                        <tr>
                          {atl.trainingByYear[selectedYearIdx].bridgeCourse.headers.map((h, i) => (
                            <th key={i}>{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {atl.trainingByYear[selectedYearIdx].bridgeCourse.rows.map((row, rIdx) => (
                          <tr key={rIdx}>
                            {row.cells.map((cell, cIdx) => (
                              <td key={cIdx}>{cell}</td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Projects for this year */}
                  {atl.trainingByYear[selectedYearIdx].projects.length > 0 && (
                    <div style={{ marginTop: 'var(--space-6)' }}>
                      <h4 style={{ fontSize: 'var(--text-base)', fontWeight: 800, color: 'var(--color-primary)', marginBottom: 'var(--space-2)' }}>
                        Selected Projects Developed:
                      </h4>
                      <div className="atl-training-projects-grid">
                        {atl.trainingByYear[selectedYearIdx].projects.map((proj, pIdx) => (
                          <div key={pIdx} className="atl-project-mini-card">
                            <div className="atl-project-mini-title">{proj.title}</div>
                            <p className="atl-project-mini-desc">{renderBold(proj.description)}</p>
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
                  <p className="atl-event-desc">{renderBold(evt.description)}</p>
                </div>
                <div style={{ marginTop: 'var(--space-4)', paddingTop: 'var(--space-2)', borderTop: '1px solid var(--color-light-gray)', fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-text-light)' }}>
                  📅 {evt.date}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5.1 International Day of Persons with Disabilities — Exhibition Days & Event Reports */}
      {exhibitionReports.length > 0 && (
        <section id="exhibitions" className="atl-section atl-section--compact atl-section--alt">
          <div className="container">
            <div className="atl-section-header atl-section-header--sm">
              <span className="atl-section-label">
                <Sparkles size={14} /> Annual Flagship Showcases
              </span>
              <h2 className="atl-section-title">International Day of Persons with Disabilities — Exhibition Days & Event Reports</h2>
              <p className="atl-section-lead">
                Comprehensive annual exhibition reports, beneficiary product distributions, keynote addresses, and event proceedings.
              </p>
            </div>

            <div className="atl-students-unified-card">
              {/* Horizontal Pill Track for Academic Years */}
              <div className="atl-students-pill-track">
                {exhibitionReports.map((report, idx) => {
                  const isActive = activeExhibitionTabIdx === idx;
                  return (
                    <button
                      key={report.id || idx}
                      type="button"
                      onClick={() => setActiveExhibitionTabIdx(isActive ? null : idx)}
                      className={`atl-student-pill-btn ${isActive ? 'is-active' : ''}`}
                    >
                      <span className="atl-pill-num">{String(idx + 1).padStart(2, '0')}</span>
                      <span className="atl-pill-title">{report.yearLabel}</span>
                    </button>
                  );
                })}
              </div>

              {/* Active Exhibition Year Content */}
              {activeExhibitionTabIdx !== null && exhibitionReports[activeExhibitionTabIdx] && (
                <div className="atl-students-content-pane" style={{ padding: '0.5rem 0.25rem' }}>
                  <h3 className="atl-exhibition-pane-title">
                    {exhibitionReports[activeExhibitionTabIdx].title}
                  </h3>
                  <div className="atl-exhibition-blocks">
                    {(exhibitionReports[activeExhibitionTabIdx].blocks || []).map((b, bIdx) => renderAtlBlock(b, bIdx))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* 5.2 National & Regional Project Exhibitions & Summits */}
      {exhibitionShowcases.length > 0 && (
        <section id="showcases" className="atl-section atl-section--compact">
          <div className="container">
            <div className="atl-section-header atl-section-header--sm">
              <span className="atl-section-label">
                <Globe2 size={14} /> Fairs & Summits
              </span>
              <h2 className="atl-section-title">National & Regional Project Exhibitions & Summits</h2>
              <p className="atl-section-lead">
                Student team presentations, prototypes, and awards at prestigious summits and regional meets across India.
              </p>
            </div>

            <div className="atl-students-unified-card">
              {/* Horizontal Pill Track for Exhibition Showcase Events */}
              <div className="atl-students-pill-track">
                {exhibitionShowcases.map((showcase, idx) => {
                  const isActive = activeShowcaseTabIdx === idx;
                  return (
                    <button
                      key={showcase.id || idx}
                      type="button"
                      onClick={() => setActiveShowcaseTabIdx(isActive ? null : idx)}
                      className={`atl-student-pill-btn ${isActive ? 'is-active' : ''}`}
                    >
                      <span className="atl-pill-num">{String(idx + 1).padStart(2, '0')}</span>
                      <span className="atl-pill-title">{showcase.tabLabel || showcase.title}</span>
                    </button>
                  );
                })}
              </div>

              {/* Active Showcase Content */}
              {activeShowcaseTabIdx !== null && exhibitionShowcases[activeShowcaseTabIdx] && (
                <div className="atl-students-content-pane">
                  <h3 className="atl-exhibition-pane-title" style={{ marginBottom: '1rem' }}>
                    {exhibitionShowcases[activeShowcaseTabIdx].title}
                  </h3>

                  {exhibitionShowcases[activeShowcaseTabIdx].type === 'batches' &&
                    (exhibitionShowcases[activeShowcaseTabIdx].batches || []).length > 0 && (
                      <div className="atl-batches-grid">
                        {(exhibitionShowcases[activeShowcaseTabIdx].batches || []).map((batch, bIdx) => (
                          <div key={bIdx} className="atl-batch-compact-card">
                            <div className="atl-batch-mini-header" style={{ marginTop: 0 }}>
                              <div className="atl-batch-header-left">
                                <span className="atl-batch-badge">Batch {batch.batchNo}</span>
                                {batch.batchName && (
                                  <span className="atl-batch-name-tag">{batch.batchName}</span>
                                )}
                                {batch.selectedProject && (
                                  <span className="atl-batch-project-title">
                                    Project: {batch.selectedProject}
                                  </span>
                                )}
                              </div>
                              {batch.mentors && (
                                <span className="atl-batch-mentors-tag">Mentors: {batch.mentors}</span>
                              )}
                            </div>

                            <div className="atl-table-container" style={{ marginTop: '0.5rem' }}>
                              <table className="atl-table atl-table--sm">
                                <thead>
                                  <tr>
                                    <th>Regd. No</th>
                                    <th>Student Name</th>
                                    <th>Department</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {(batch.members || []).map((m, mIdx) => (
                                    <tr key={mIdx}>
                                      <td className="atl-cell-mono">{m.regdNo}</td>
                                      <td className="atl-cell-bold">{m.name}</td>
                                      <td>{m.department}</td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                  {exhibitionShowcases[activeShowcaseTabIdx].type === 'table' &&
                    exhibitionShowcases[activeShowcaseTabIdx].table && (
                      <div className="atl-table-container">
                        <table className="atl-table atl-table--sm">
                          <thead>
                            <tr>
                              {(exhibitionShowcases[activeShowcaseTabIdx].table?.headers || []).map((h, i) => (
                                <th key={i}>{h}</th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {(exhibitionShowcases[activeShowcaseTabIdx].table?.rows || []).map((row, rIdx) => (
                              <tr key={rIdx}>
                                {(row.cells || []).map((cell, cIdx) => (
                                  <td key={cIdx} className={cIdx === 2 || cIdx === 4 ? 'atl-cell-bold' : ''}>
                                    {cell}
                                  </td>
                                ))}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}

                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* 5.3 ATL Project Outcomes & Tech Fests */}
      {atlOutcomes.length > 0 && (
        <section id="outcomes" className="atl-section atl-section--compact atl-section--alt">
          <div className="container">
            <div className="atl-section-header atl-section-header--sm">
              <span className="atl-section-label">
                <Sparkles size={14} /> Innovations & Competition Results
              </span>
              <h2 className="atl-section-title">ATL Project Outcomes & Tech Fests</h2>
              <p className="atl-section-lead">
                Specialized project outcomes, award-winning innovations, and competition results achieved by Assistive Technology Lab teams.
              </p>
            </div>

            <div className="atl-students-unified-card">
              {/* Horizontal Pill Track for Project Outcomes */}
              <div className="atl-students-pill-track">
                {atlOutcomes.map((outcome, idx) => {
                  const isActive = activeOutcomeTabIdx === idx;
                  return (
                    <button
                      key={outcome.id || idx}
                      type="button"
                      onClick={() => setActiveOutcomeTabIdx(isActive ? null : idx)}
                      className={`atl-student-pill-btn ${isActive ? 'is-active' : ''}`}
                    >
                      <span className="atl-pill-num">{String(idx + 1).padStart(2, '0')}</span>
                      <span className="atl-pill-title">{outcome.tabLabel || outcome.title}</span>
                    </button>
                  );
                })}
              </div>

              {/* Active Outcome Content */}
              {activeOutcomeTabIdx !== null && atlOutcomes[activeOutcomeTabIdx] && (
                <div className="atl-students-content-pane" style={{ padding: '0.5rem 0.25rem' }}>
                  <h3 className="atl-exhibition-pane-title">
                    {atlOutcomes[activeOutcomeTabIdx].title}
                  </h3>
                  <div className="atl-exhibition-blocks">
                    {(atlOutcomes[activeOutcomeTabIdx].blocks || []).map((b, bIdx) => renderAtlBlock(b, bIdx))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* 5.4 Zion School & Client Field Visits */}
      {clientVisits.length > 0 && (
        <section id="client-visits" className="atl-section atl-section--compact">
          <div className="container">
            <div className="atl-section-header atl-section-header--sm">
              <span className="atl-section-label">
                <Globe2 size={14} /> School & Client Visits
              </span>
              <h2 className="atl-section-title">Zion School & Client Field Visits</h2>
              <p className="atl-section-lead">
                Outreach initiatives, school student visits, and assistive technology client consultation reports.
              </p>
            </div>

            <div className="atl-students-unified-card">
              {/* Horizontal Pill Track for Client Visits */}
              <div className="atl-students-pill-track">
                {clientVisits.map((visit, idx) => {
                  const isActive = activeClientVisitTabIdx === idx;
                  return (
                    <button
                      key={visit.id || idx}
                      type="button"
                      onClick={() => setActiveClientVisitTabIdx(isActive ? null : idx)}
                      className={`atl-student-pill-btn ${isActive ? 'is-active' : ''}`}
                    >
                      <span className="atl-pill-num">{String(idx + 1).padStart(2, '0')}</span>
                      <span className="atl-pill-title">{visit.tabLabel || visit.title}</span>
                    </button>
                  );
                })}
              </div>

              {/* Active Client Visit Content */}
              {activeClientVisitTabIdx !== null && clientVisits[activeClientVisitTabIdx] && (
                <div className="atl-students-content-pane" style={{ padding: '0.5rem 0.25rem' }}>
                  <h3 className="atl-exhibition-pane-title">
                    {clientVisits[activeClientVisitTabIdx].title}
                  </h3>
                  <div className="atl-exhibition-blocks">
                    {(clientVisits[activeClientVisitTabIdx].blocks || []).map((b, bIdx) => renderAtlBlock(b, bIdx))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* 5.5 Innovation Fairs & Regional Expos */}
      {innovationFairs.length > 0 && (
        <section id="innovation-fairs" className="atl-section atl-section--compact atl-section--alt">
          <div className="container">
            <div className="atl-section-header atl-section-header--sm">
              <span className="atl-section-label">
                <Sparkles size={14} /> Project Fairs & Expos
              </span>
              <h2 className="atl-section-title">Innovation Project Fairs & Regional Expos</h2>
              <p className="atl-section-lead">
                State-level project exhibitions, innovation hub showcases, and incubation center inauguration expos.
              </p>
            </div>

            <div className="atl-students-unified-card">
              {/* Horizontal Pill Track for Innovation Fairs */}
              <div className="atl-students-pill-track">
                {innovationFairs.map((fair, idx) => {
                  const isActive = activeInnovationTabIdx === idx;
                  return (
                    <button
                      key={fair.id || idx}
                      type="button"
                      onClick={() => setActiveInnovationTabIdx(isActive ? null : idx)}
                      className={`atl-student-pill-btn ${isActive ? 'is-active' : ''}`}
                    >
                      <span className="atl-pill-num">{String(idx + 1).padStart(2, '0')}</span>
                      <span className="atl-pill-title">{fair.tabLabel || fair.title}</span>
                    </button>
                  );
                })}
              </div>

              {/* Active Innovation Fair Content */}
              {activeInnovationTabIdx !== null && innovationFairs[activeInnovationTabIdx] && (
                <div className="atl-students-content-pane" style={{ padding: '0.5rem 0.25rem' }}>
                  <h3 className="atl-exhibition-pane-title">
                    {innovationFairs[activeInnovationTabIdx].title}
                  </h3>
                  <div className="atl-exhibition-blocks">
                    {(innovationFairs[activeInnovationTabIdx].blocks || []).map((b, bIdx) => renderAtlBlock(b, bIdx))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>
      )}

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
                <h3 className="atl-faculty-name">{atl.team.dean.name}</h3>
                <div className="atl-faculty-desig">{atl.team.dean.designation}</div>
              </div>
              <div className="atl-faculty-contact">
                {atl.team.dean.email && (
                  <a href={`mailto:${atl.team.dean.email}`} className="atl-faculty-link">
                    <Mail size={14} color="var(--color-accent)" /> {atl.team.dean.email}
                  </a>
                )}
                {atl.team.dean.mobile && (
                  <a href={`tel:${atl.team.dean.mobile}`} className="atl-faculty-link">
                    <Phone size={14} color="var(--color-accent)" /> +91 {atl.team.dean.mobile}
                  </a>
                )}
              </div>
            </div>

            {/* In-Charge Card */}
            <div className="atl-faculty-card" style={{ border: '1.5px solid var(--color-accent)' }}>
              <div>
                <span className="atl-faculty-role">Laboratory In-Charge</span>
                <h3 className="atl-faculty-name">{atl.team.inCharge.name}</h3>
                <div className="atl-faculty-desig">{atl.team.inCharge.designation}</div>
              </div>
              <div className="atl-faculty-contact">
                {atl.team.inCharge.email && (
                  <a href={`mailto:${atl.team.inCharge.email}`} className="atl-faculty-link">
                    <Mail size={14} color="var(--color-accent)" /> {atl.team.inCharge.email}
                  </a>
                )}
                {atl.team.inCharge.mobile && (
                  <a href={`tel:${atl.team.inCharge.mobile}`} className="atl-faculty-link">
                    <Phone size={14} color="var(--color-accent)" /> +91 {atl.team.inCharge.mobile}
                  </a>
                )}
              </div>
            </div>

            {/* Other Faculty Mentors */}
            {atl.team.facultyMembers.map((member, i) => (
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
                    <span>{renderBold(item)}</span>
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
                    <span>{renderBold(item)}</span>
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
                  {photo.caption && <div className="atl-gallery-caption">{renderBold(photo.caption)}</div>}
                </button>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 9. Unified Students Benefitted & Selected Students Roster (Compact Horizontal Tab Bar) */}
      <section id="students" className="atl-section atl-section--compact">
        <div className="container">
          <div className="atl-section-header atl-section-header--sm">
            <span className="atl-section-label">
              <Users size={14} /> Student Roster & Beneficiaries
            </span>
            <h2 className="atl-section-title">Students Benefitted & Selected Students Roster</h2>
            <p className="atl-section-lead">
              Comprehensive rosters of students trained, project batches mentored, and selected innovators in the Assistive Technology Lab.
            </p>
          </div>

          <div className="atl-students-unified-card">
            {/* Horizontal Pill Track for Academic Years */}
            <div className="atl-students-pill-track">
              {studentRosters.map((roster, idx) => {
                const isActive = activeStudentTabIdx === idx;
                return (
                  <button
                    key={roster.id || idx}
                    type="button"
                    onClick={() => setActiveStudentTabIdx(isActive ? null : idx)}
                    className={`atl-student-pill-btn ${isActive ? 'is-active' : ''}`}
                  >
                    <span className="atl-pill-num">{String(idx + 1).padStart(2, '0')}</span>
                    <span className="atl-pill-title">{roster.yearLabel}</span>
                  </button>
                );
              })}
            </div>

            {/* Active Academic Year Content */}
            {activeStudentTabIdx !== null && studentRosters[activeStudentTabIdx] && (
              <div className="atl-students-content-pane">
                {studentRosters[activeStudentTabIdx].type === 'batches' &&
                  (studentRosters[activeStudentTabIdx].batches || []).length > 0 && (
                    <div className="atl-batches-grid">
                      {(studentRosters[activeStudentTabIdx].batches || []).map((batch, bIdx) => (
                        <div key={bIdx} className="atl-batch-compact-card">
                          <div className="atl-batch-mini-header" style={{ marginTop: 0 }}>
                            <div className="atl-batch-header-left">
                              <span className="atl-batch-badge">Batch {batch.batchNo}</span>
                              {batch.batchName && (
                                <span className="atl-batch-name-tag">
                                  {batch.batchName}
                                </span>
                              )}
                              {batch.selectedProject && (
                                <span className="atl-batch-project-title">
                                  Project: {batch.selectedProject}
                                </span>
                              )}
                            </div>
                            {batch.mentors && (
                              <span className="atl-batch-mentors-tag">
                                Mentors: {batch.mentors}
                              </span>
                            )}
                          </div>

                          <div className="atl-table-container" style={{ marginTop: '0.5rem' }}>
                            <table className="atl-table atl-table--sm">
                              <thead>
                                <tr>
                                  <th>Regd. No</th>
                                  <th>Student Name</th>
                                  <th>Department</th>
                                </tr>
                              </thead>
                              <tbody>
                                {(batch.members || []).map((m, mIdx) => (
                                  <tr key={mIdx}>
                                    <td className="atl-cell-mono">{m.regdNo}</td>
                                    <td className="atl-cell-bold">{m.name}</td>
                                    <td>{m.department}</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                {studentRosters[activeStudentTabIdx].type === 'table' &&
                  studentRosters[activeStudentTabIdx].table && (
                    <div className="atl-table-container">
                      <table className="atl-table atl-table--sm">
                        <thead>
                          <tr>
                            {(studentRosters[activeStudentTabIdx].table?.headers || []).map((h, i) => (
                              <th key={i}>{h}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {(studentRosters[activeStudentTabIdx].table?.rows || []).map((row, rIdx) => (
                            <tr key={rIdx}>
                              {(row.cells || []).map((cell, cIdx) => (
                                <td key={cIdx} className={cIdx === 3 ? 'atl-cell-bold' : ''}>{cell}</td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* DYNAMIC CUSTOM SECTIONS */}
      {customSections.some((s) => s.placement === 'intro') && (
        <section className="atl-section">
          <div className="container">
            <CustomSectionsIntro sections={customSections} />
          </div>
        </section>
      )}
      {customSections.some((s) => {
        const title = (s.label || '').trim().toLowerCase();
        const isExcluded =
          title === 'team' ||
          title.startsWith('atl activities') ||
          title === 'key highlights' ||
          title === 'highlights' ||
          s.id === 'highlights' ||
          title.startsWith('students benefitted') ||
          title.startsWith('atl selected students') ||
          title.includes('selected students') ||
          title.includes('international day of persons with disabilities') ||
          title.includes('exhibition day') ||
          title.includes('kl university') ||
          title.includes('iit madras') ||
          title.includes('telangana') ||
          title.includes('projects exhibiting') ||
          title.includes('trance') ||
          title.includes('iic regional') ||
          title.includes('zion') ||
          title.includes('client visit') ||
          title.includes('jntu kakinada') ||
          title.includes('avishkandhra') ||
          title.includes('rtih') ||
          title.includes('incubation center inauguration') ||
          title.includes('project expo at rajahmundry') ||
          title.includes('innovation project fair');
        return s.placement !== 'intro' && s.contentType !== 'gallery' && !isExcluded;
      }) && (
        <section className="atl-section">
          <div className="container">
            <CustomSectionsGalleries sections={customSections} />
            <CustomSectionsAccordion
              sections={customSections.filter((s) => {
                const title = (s.label || '').trim().toLowerCase();
                const isExcluded =
                  title === 'team' ||
                  title.startsWith('atl activities') ||
                  title === 'key highlights' ||
                  title === 'highlights' ||
                  s.id === 'highlights' ||
                  title.startsWith('students benefitted') ||
                  title.startsWith('atl selected students') ||
                  title.includes('selected students') ||
                  title.includes('international day of persons with disabilities') ||
                  title.includes('exhibition day') ||
                  title.includes('kl university') ||
                  title.includes('iit madras') ||
                  title.includes('telangana') ||
                  title.includes('projects exhibiting') ||
                  title.includes('trance') ||
                  title.includes('iic regional') ||
                  title.includes('zion') ||
                  title.includes('client visit') ||
                  title.includes('jntu kakinada') ||
                  title.includes('avishkandhra') ||
                  title.includes('rtih') ||
                  title.includes('incubation center inauguration') ||
                  title.includes('project expo at rajahmundry') ||
                  title.includes('innovation project fair');
                return s.placement !== 'intro' && s.contentType !== 'gallery' && !isExcluded;
              })}
            />
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
