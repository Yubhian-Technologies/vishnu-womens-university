import { useState } from 'react';
import {
  Wrench,
  Gauge,
  Zap,
  Flame,
  Award,
  Users,
  Building2,
  Image as ImageIcon,
  X,
  Maximize2,
  Target,
  Compass,
  CheckCircle2,
  Briefcase,
  ChevronDown,
  ChevronUp,
  Layers,
  Settings,
} from 'lucide-react';
import { vehicleDesignLab, type VdlObjective, type VdlProjectBullet, type VdlEndowment, type VdlOutcomeItem } from './vehicleDesignLab.data';
import type { DifferentiatorItemDoc } from '../Admin/sections/DifferentiatorsAdmin';
import type { VdlAchievementReportDoc } from '../Admin/sections/VdlAchievementsAdmin';
import type { VdlTeamMemberDoc } from '../Admin/sections/VdlTeamAdmin';
import type { CustomSection } from '../../lib/customSections';
import { useOrderedCollection } from '../../hooks/useCollection';
import './VehicleDesignLabPage.css';

interface VehicleDesignLabPageProps {
  item: DifferentiatorItemDoc;
  sections: CustomSection[];
}

export default function VehicleDesignLabPage({ sections }: VehicleDesignLabPageProps) {
  const [activePhaseTab, setActivePhaseTab] = useState<number>(0);
  const [lightboxImg, setLightboxImg] = useState<string | null>(null);
  const [isUtilityProjectsExpanded, setIsUtilityProjectsExpanded] = useState<boolean>(false);

  // Admin-managed achievement cards (Admin -> Vehicle Design Lab Achievements)
  const { docs: achievementCards } = useOrderedCollection<VdlAchievementReportDoc>('vdlAchievementReports', 'order');

  // Admin-managed Head of Lab + Faculty Team Members (Admin -> Vehicle Design Lab -> Team)
  const { docs: teamMembers } = useOrderedCollection<VdlTeamMemberDoc>('vdlTeamMembers', 'order');
  const labHead = teamMembers.find((m) => m.isHead);
  const facultyMembers = teamMembers.filter((m) => !m.isHead);

  // Extract all available photos safely and recursively (including s.photo, galleryPhotos, imageCards, files)
  const rawGalleryItems: { url: string; label: string }[] = [];

  const extractPhotos = (s: CustomSection) => {
    if (s.photo?.imageUrl) {
      rawGalleryItems.push({ url: s.photo.imageUrl, label: s.photo.caption || s.label || 'VDL Workshop Photo' });
    }
    if (s.galleryPhotos) {
      s.galleryPhotos.forEach((p, idx) => {
        if (p.imageUrl) rawGalleryItems.push({ url: p.imageUrl, label: p.caption || `VDL Workshop Photo ${idx + 1}` });
      });
    }
    if (s.files) {
      s.files.forEach((f, idx) => {
        if (f.fileUrl && (f.fileUrl.match(/\.(jpg|jpeg|png|webp|gif|svg)$/i) || f.fileUrl.includes('firebasestorage') || f.fileUrl.includes('placeholder'))) {
          rawGalleryItems.push({ url: f.fileUrl, label: f.label || `VDL Workshop Photo ${idx + 1}` });
        }
      });
    }
    if (s.imageCards) {
      s.imageCards.forEach((c, idx) => {
        if (c.imageUrl) rawGalleryItems.push({ url: c.imageUrl, label: c.title || `VDL Workshop Photo ${idx + 1}` });
      });
    }
    if (s.subSections) {
      s.subSections.forEach(extractPhotos);
    }
  };

  sections.forEach(extractPhotos);

  // Deduplicate gallery items by URL to eliminate repetitive images
  const seenUrls = new Set<string>();
  const galleryItems = rawGalleryItems.filter((item) => {
    if (seenUrls.has(item.url)) return false;
    seenUrls.add(item.url);
    return true;
  });

  const hasPhotos = galleryItems.length > 0;

  // Helper to render photo frame with unique indices & non-repetitive images
  const RenderPhotoFrame = ({ index }: { index: number }) => {
    if (!hasPhotos) return null;
    const photo = galleryItems[index % galleryItems.length];
    return (
      <div className="vdl-photo-frame" onClick={() => setLightboxImg(photo.url)}>
        <img src={photo.url} alt={photo.label} className="vdl-photo-frame-img" />
        <div className="vdl-photo-frame-caption">
          <span>{photo.label}</span>
          <Maximize2 size={13} />
        </div>
      </div>
    );
  };

  const PREVIEW_UTILITY_PROJECTS_COUNT = 4;
  const utilityProjects = vehicleDesignLab.facilities.campusUtilityProjects;
  const isUtilityExpandable = utilityProjects.length > PREVIEW_UTILITY_PROJECTS_COUNT;
  const visibleUtilityProjects = isUtilityExpandable && !isUtilityProjectsExpanded
    ? utilityProjects.slice(0, PREVIEW_UTILITY_PROJECTS_COUNT)
    : utilityProjects;

  return (
    <div className="vdl-container">
      {/* RAW INDUSTRIAL WORKSHOP HERO TELEMETRY BANNER */}
      <section className={`vdl-hero-banner ${hasPhotos ? 'has-photo' : 'no-photo'}`}>
        <div>
          <div className="vdl-stamped-bar">
            <span className="vdl-stamp-badge">
              <Wrench size={14} /> VEHICLE DESIGN LAB — COE
            </span>
            <span className="vdl-stamp-chip">
              <Zap size={12} /> Inaugurated: 11-03-2019
            </span>
            <span className="vdl-stamp-chip">
              <Building2 size={12} /> Mr. Kamal Bali — MD Volvo Eicher
            </span>
            <span className="vdl-stamp-chip highlight">
              <Flame size={12} /> SAEINDIA BAJA 5x Champions
            </span>
          </div>

          <div className="vdl-hero-text-block">
            {vehicleDesignLab.paragraphs.map((para, idx) => (
              <p key={idx} className="vdl-overview-text">
                {para}
              </p>
            ))}
          </div>

          {/* Fundamentals Engine Specs Chips */}
          <div className="vdl-fundamentals-grid">
            {vehicleDesignLab.fundamentals.map((fund, idx) => (
              <div key={idx} className="vdl-fund-chip">
                <Gauge size={13} style={{ color: '#FF5722' }} />
                <span>{fund}</span>
              </div>
            ))}
          </div>
        </div>

        {hasPhotos && <RenderPhotoFrame index={0} />}
      </section>

      {/* VISION, MISSION & OBJECTIVES BLUEPRINT MATRIX */}
      <div className="vdl-block">
        <div className="vdl-block-header">
          <h2 className="vdl-block-title">
            <Target size={18} style={{ color: '#FF5722' }} /> Engineering Directives & Blueprint
          </h2>
          <span className="vdl-block-tag">SPECIFICATION D-01</span>
        </div>
        <div className="vdl-block-body">
          <div className={`vdl-split ${hasPhotos ? 'has-photo' : 'no-photo'}`}>
            <div className="vdl-vision-mission-column">
              {/* Vision */}
              <div className="vdl-card vision-card">
                <div className="vdl-card-title">
                  <Compass size={16} style={{ color: '#FF5722' }} /> Vision
                </div>
                <p className="vdl-card-text" style={{ fontStyle: 'italic', fontWeight: 600 }}>
                  {vehicleDesignLab.vision}
                </p>
              </div>

              {/* Mission */}
              <div className="vdl-card mission-card">
                <div className="vdl-card-title">
                  <Flame size={16} style={{ color: '#FF9800' }} /> Mission
                </div>
                <p className="vdl-card-text">
                  {vehicleDesignLab.mission}
                </p>
              </div>
            </div>

            {hasPhotos && <RenderPhotoFrame index={1} />}
          </div>

          {/* Objectives Grid */}
          <div style={{ marginTop: 'var(--space-4)' }}>
            <h3 className="vdl-section-subtitle">
              <Settings size={16} style={{ color: '#FF5722' }} /> Lab Objectives
            </h3>
            <div className="vdl-objectives-grid">
              {vehicleDesignLab.objectives.map((obj: VdlObjective, idx: number) => (
                <div key={idx} className="vdl-objective-card">
                  <span className="vdl-obj-lead">{obj.lead}</span>
                  <span className="vdl-obj-text">{obj.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* FACULTY GARAGE TEAM WORKBENCH */}
      <div className="vdl-block">
        <div className="vdl-block-header">
          <h2 className="vdl-block-title">
            <Users size={18} style={{ color: '#FF5722' }} /> Faculty In-Charge & Garage Mentors
          </h2>
          <span className="vdl-block-tag">AUTOMOTIVE FACULTY</span>
        </div>
        <div className="vdl-block-body">
          {labHead && (
            <>
              <h3 className="vdl-section-subtitle">Head of Vehicle Design Lab</h3>
              <div className="vdl-team-grid" style={{ marginBottom: 'var(--space-4)' }}>
                <div className="vdl-team-card lab-head">
                  <div className="vdl-team-header">
                    <div>
                      <h4 className="vdl-team-name">{labHead.name}</h4>
                      <span className="vdl-team-role">{labHead.designation}</span>
                    </div>
                    <span className="vdl-team-badge">HEAD OF LAB</span>
                  </div>
                  <div className="vdl-team-meta">
                    {labHead.interests && (
                      <div><strong>Interests:</strong> {labHead.interests}</div>
                    )}
                    {labHead.mobile && (
                      <div><strong>Mobile:</strong> {labHead.mobile}</div>
                    )}
                  </div>
                </div>
              </div>
            </>
          )}

          {facultyMembers.length > 0 && <h3 className="vdl-section-subtitle">Faculty Team Members</h3>}
          <div className="vdl-team-grid">
            {facultyMembers.map((member) => (
              <div key={member.id} className="vdl-team-card">
                <div className="vdl-team-header">
                  <div>
                    <h4 className="vdl-team-name">{member.name}</h4>
                    <span className="vdl-team-role">{member.designation}</span>
                  </div>
                  <span className="vdl-team-badge secondary">FACULTY</span>
                </div>
                <div className="vdl-team-meta">
                  {member.interests && <div><strong>Interests:</strong> {member.interests}</div>}
                  {member.email && (
                    <div>
                      <strong>Email:</strong> <a href={`mailto:${member.email}`} className="vdl-link">{member.email}</a>
                    </div>
                  )}
                  {member.mobile && <div><strong>Mobile:</strong> {member.mobile}</div>}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* FACILITIES & 4 DESIGN PHASES WORKBENCH */}
      <div className="vdl-block">
        <div className="vdl-block-header">
          <h2 className="vdl-block-title">
            <Layers size={18} style={{ color: '#FF5722' }} /> Lab Facilities & Vehicle Fabrication Phases
          </h2>
          <span className="vdl-block-tag">WORKSHOP INFRASTRUCTURE</span>
        </div>
        <div className="vdl-block-body">
          <p className="vdl-overview-text" style={{ color: '#2D3748', marginBottom: 'var(--space-4)' }}>
            {vehicleDesignLab.facilities.overview}
          </p>

          <div className={`vdl-split ${hasPhotos ? 'has-photo reverse' : 'no-photo'}`}>
            {hasPhotos && <RenderPhotoFrame index={2 + activePhaseTab} />}

            <div>
              {/* Phase Switcher Tabs */}
              <div className="vdl-tabs-bar">
                {vehicleDesignLab.facilities.activitiesPrograms.map((phase, idx) => (
                  <button
                    key={idx}
                    className={`vdl-tab-btn ${activePhaseTab === idx ? 'active' : ''}`}
                    onClick={() => setActivePhaseTab(idx)}
                  >
                    {phase.title}
                  </button>
                ))}
              </div>

              {/* Active Phase Content */}
              {vehicleDesignLab.facilities.activitiesPrograms[activePhaseTab] && (
                <div className="vdl-phase-card">
                  <h3 className="vdl-phase-title">
                    {vehicleDesignLab.facilities.activitiesPrograms[activePhaseTab].title}
                  </h3>
                  <p className="vdl-phase-text">
                    {vehicleDesignLab.facilities.activitiesPrograms[activePhaseTab].paragraph}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* CAMPUS UTILITY VEHICLES GARAGE PROJECTS (EXPANDABLE ROSTER) */}
      <div className="vdl-block">
        <div className="vdl-block-header">
          <h2 className="vdl-block-title">
            <Zap size={18} style={{ color: '#FF5722' }} /> Campus Utility Vehicles & EV Projects
          </h2>
          <span className="vdl-block-tag">IN-HOUSE EV FABRICATION</span>
        </div>
        <div className="vdl-block-body">
          <div className={`vdl-split ${hasPhotos ? 'has-photo' : 'no-photo'}`} style={{ marginBottom: 'var(--space-4)' }}>
            <div>
              <p className="vdl-overview-text" style={{ color: '#2D3748', marginBottom: 'var(--space-4)' }}>
                {vehicleDesignLab.facilities.campusUtilityIntro}
              </p>

              <div className="vdl-projects-grid">
                {visibleUtilityProjects.map((proj: VdlProjectBullet, idx: number) => (
                  <div key={idx} className="vdl-project-card">
                    <span className="vdl-proj-lead">{proj.lead}</span>
                    <span className="vdl-proj-text">{proj.text}</span>
                  </div>
                ))}
              </div>
            </div>

            {hasPhotos && <RenderPhotoFrame index={6} />}
          </div>

          {isUtilityExpandable && (
            <div className="vdl-expand-wrap">
              <button
                className={`vdl-expand-btn ${isUtilityProjectsExpanded ? 'expanded' : ''}`}
                onClick={() => setIsUtilityProjectsExpanded(!isUtilityProjectsExpanded)}
              >
                {isUtilityProjectsExpanded ? (
                  <>
                    <ChevronUp size={15} /> Show Less ({PREVIEW_UTILITY_PROJECTS_COUNT} projects)
                  </>
                ) : (
                  <>
                    <ChevronDown size={15} /> + View All {utilityProjects.length} Campus Utility Projects
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* CORPORATE INDUSTRY ENDOWMENTS */}
      <div className="vdl-block">
        <div className="vdl-block-header">
          <h2 className="vdl-block-title">
            <Building2 size={18} style={{ color: '#FF5722' }} /> Industry Corporate Endowments
          </h2>
          <span className="vdl-block-tag">CORPORATE PARTNERS</span>
        </div>
        <div className="vdl-block-body">
          <p className="vdl-overview-text" style={{ color: '#2D3748', marginBottom: 'var(--space-4)' }}>
            {vehicleDesignLab.industryCollaborations.intro}
          </p>

          <div className={`vdl-split ${hasPhotos ? 'has-photo' : 'no-photo'}`} style={{ marginBottom: 'var(--space-4)' }}>
            <div className="vdl-endowments-list">
              {vehicleDesignLab.industryCollaborations.endowments.map((endow: VdlEndowment) => (
                <div key={endow.id} className="vdl-endowment-card">
                  <div className="vdl-endowment-top">
                    <h4 className="vdl-endowment-title">{endow.title}</h4>
                    <span className="vdl-endowment-by">Bestowed by: {endow.bestowedBy}</span>
                  </div>
                  <p className="vdl-endowment-text">{endow.contribution}</p>
                </div>
              ))}
            </div>

            {hasPhotos && <RenderPhotoFrame index={7} />}
          </div>

          <p className="vdl-overview-text" style={{ color: '#4A5568', fontStyle: 'italic', background: '#F7FAFC', padding: 'var(--space-3)', borderRadius: '6px', borderLeft: '3px solid #FF5722' }}>
            {vehicleDesignLab.industryCollaborations.closing}
          </p>
        </div>
      </div>

      {/* STUDENT ACHIEVEMENTS, MOTORSPORT & RECRUITER PLACEMENTS */}
      <div className="vdl-block">
        <div className="vdl-block-header">
          <h2 className="vdl-block-title">
            <Award size={18} style={{ color: '#FF5722' }} /> Student Achievements & Motorsport Placements
          </h2>
          <span className="vdl-block-tag">NATIONAL ACCOLADES</span>
        </div>
        <div className="vdl-block-body">
          <p className="vdl-overview-text" style={{ color: '#2D3748', marginBottom: 'var(--space-4)' }}>
            {vehicleDesignLab.studentsAchievements.intro}
          </p>

          {/* Motorsport Competitions Grid */}
          <div className="vdl-competitions-grid" style={{ marginBottom: 'var(--space-4)' }}>
            {vehicleDesignLab.studentsAchievements.competitions.map((comp, idx) => (
              <div key={idx} className="vdl-comp-card">
                <div className="vdl-comp-title">
                  <Flame size={16} style={{ color: '#FF5722' }} /> {comp.title}
                </div>
                <p className="vdl-comp-text">{comp.text}</p>
              </div>
            ))}
          </div>

          <p className="vdl-overview-text" style={{ color: '#2D3748', marginBottom: 'var(--space-4)' }}>
            {vehicleDesignLab.studentsAchievements.closing}
          </p>

          {/* Admin-managed achievement cards (photo + description, optional PDF report) */}
          {achievementCards.length > 0 && (
            <div className="vdl-competitions-grid" style={{ marginBottom: 'var(--space-4)' }}>
              {achievementCards.map((card) => (
                <div key={card.id} className="vdl-comp-card">
                  {card.imageUrl && (
                    <img
                      src={card.imageUrl}
                      alt={card.label}
                      style={{ width: '100%', aspectRatio: '4 / 3', objectFit: 'cover', borderRadius: 'var(--radius-md, 8px)', marginBottom: 'var(--space-2)' }}
                    />
                  )}
                  <div className="vdl-comp-title">
                    <Award size={16} style={{ color: '#FF5722' }} /> {card.label}
                  </div>
                  {card.description && <p className="vdl-comp-text">{card.description}</p>}
                  {card.fileUrl && (
                    <a href={card.fileUrl} target="_blank" rel="noopener noreferrer" className="vdl-report-link">
                      View Report
                    </a>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Placements & Recruiter Paragraphs */}
          <div className="vdl-placements-block">
            <h3 className="vdl-section-subtitle">
              <Briefcase size={16} style={{ color: '#FF5722' }} /> Career Placements & Recruiter Ecosystem
            </h3>
            {vehicleDesignLab.studentsAchievements.placementsParagraphs.map((para, idx) => (
              <p key={idx} className="vdl-overview-text" style={{ color: '#2D3748', marginBottom: 'var(--space-2)' }}>
                {para}
              </p>
            ))}
          </div>
        </div>
      </div>

      {/* OUTCOMES & TECHNICAL SPECTRUM MATRIX */}
      <div className="vdl-block">
        <div className="vdl-block-header">
          <h2 className="vdl-block-title">
            <CheckCircle2 size={18} style={{ color: '#FF5722' }} /> Program Outcomes & Technical Spectrum
          </h2>
          <span className="vdl-block-tag">7 CORE OUTCOMES</span>
        </div>
        <div className="vdl-block-body">
          <div className={`vdl-split ${hasPhotos ? 'has-photo' : 'no-photo'}`}>
            <div className="vdl-outcomes-grid">
              {vehicleDesignLab.outcomes.map((out: VdlOutcomeItem, idx: number) => (
                <div key={idx} className="vdl-outcome-card">
                  <div className="vdl-outcome-title">{out.title}</div>
                  <p className="vdl-outcome-text">{out.text}</p>
                </div>
              ))}
            </div>

            {hasPhotos && <RenderPhotoFrame index={8} />}
          </div>
        </div>
      </div>

      {/* SATELLITE / WORKSHOP PHOTO GALLERY SHOWCASE */}
      {galleryItems.length > 0 && (
        <div className="vdl-block">
          <div className="vdl-block-header">
            <h2 className="vdl-block-title">
              <ImageIcon size={18} style={{ color: '#FF5722' }} /> Vehicle Design Lab Photo Gallery
            </h2>
            <span className="vdl-block-tag">{galleryItems.length} UNIQUE PHOTOS</span>
          </div>
          <div className="vdl-block-body">
            <div className="vdl-gallery-grid">
              {galleryItems.map((photo, idx) => (
                <div key={idx} className="vdl-gallery-card" onClick={() => setLightboxImg(photo.url)}>
                  <img src={photo.url} alt={photo.label} className="vdl-gallery-img" />
                  <div className="vdl-gallery-overlay">
                    <span>{photo.label}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* LIGHTBOX MODAL */}
      {lightboxImg && (
        <div className="meda-lightbox-backdrop" onClick={() => setLightboxImg(null)}>
          <div className="meda-lightbox-content" onClick={(e) => e.stopPropagation()}>
            <button className="meda-lightbox-close" onClick={() => setLightboxImg(null)}>
              <X size={28} />
            </button>
            <img src={lightboxImg} alt="Vehicle Design Lab Photo" className="meda-lightbox-img" />
          </div>
        </div>
      )}
    </div>
  );
}
