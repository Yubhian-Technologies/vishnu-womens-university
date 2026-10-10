import { useState } from 'react';
import {
  Building,
  Layers,
  Award,
  Users,
  Target,
  Compass,
  CheckCircle2,
  Mail,
  Phone,
  Globe,
  Rocket,
  ShieldCheck,
  GraduationCap,
  Calendar,
  Sparkles,
  ChevronRight,
  BookOpen,
  Plus,
  Minus,
  Maximize2,
} from 'lucide-react';
import { dreamHouseConstructionLab } from './dreamHouseConstructionLab.data';
import type { DifferentiatorItemDoc } from '../Admin/sections/DifferentiatorsAdmin';
import type { CustomSection, CustomSectionPhoto } from '../../lib/customSections';
import { hasCustomSectionContent } from '../../lib/customSections';
import { CustomSectionsGalleries, CustomSectionsAccordion, CustomSectionsIntro } from '../../components/CustomSectionsRenderer/CustomSectionsRenderer';
import { renderBold } from '../../lib/boldText';
import { useDocument } from '../../hooks/useDocument';
import type { DreamHouseLabDoc } from '../Admin/sections/DreamHouseLabContentAdmin';
import './DreamHouseLabPage.css';

interface DreamHouseLabPageProps {
  item: DifferentiatorItemDoc;
  sections: CustomSection[];
}

export default function DreamHouseLabPage({ item, sections }: DreamHouseLabPageProps) {
  const [activeStudentCohort, setActiveStudentCohort] = useState<number>(0);
  const [isIticTeamExpanded, setIsIticTeamExpanded] = useState<boolean>(true);
  const [isProjectTeamExpanded, setIsProjectTeamExpanded] = useState<boolean>(true);
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);
  const { data: remoteData } = useDocument<DreamHouseLabDoc>('settings', 'dreamHouseLab');
  const dhcl = { ...dreamHouseConstructionLab, ...(remoteData || {}) };

  // 1. Stats
  const stats = {
    stat1: remoteData?.stats?.stat1?.value ? remoteData.stats.stat1 : { value: '4+', label: 'Years of Innovation' },
    stat2: remoteData?.stats?.stat2?.value ? remoteData.stats.stat2 : { value: '37+', label: 'Students Benefited' },
    stat3: remoteData?.stats?.stat3?.value ? remoteData.stats.stat3 : { value: '₹1 Lakh', label: 'ITIC Seed Funding' },
    stat4: remoteData?.stats?.stat4?.value ? remoteData.stats.stat4 : { value: 'Top 75', label: 'ITIC BUILD Winner' },
  };

  // 2. Overview & In-Charge
  const overviewBadge = remoteData?.overviewBadge || 'Overview & Purpose';
  const overviewTitle = remoteData?.overviewTitle || item?.title || 'Dream House Construction Lab (DHCL)';
  const aboutParagraphs = (remoteData?.paragraphs && remoteData.paragraphs.length > 0)
    ? remoteData.paragraphs
    : dhcl.paragraphs;

  // 3. Vision & Mission
  const visionSubtitle = remoteData?.visionSubtitle || 'Our Architectural Blueprint';
  const visionTitle = remoteData?.visionTitle || 'Vision';
  const visionText = remoteData?.vision || dhcl.vision;

  const missionSubtitle = remoteData?.missionSubtitle || 'Strategic Pillars';
  const missionTitle = remoteData?.missionTitle || 'Mission';
  const missionList = (remoteData?.mission && remoteData.mission.length > 0)
    ? remoteData.mission
    : dhcl.mission;

  // 4. Objectives
  const objectivesTitle = remoteData?.objectivesTitle || 'Core Objectives';
  const objectivesList = (remoteData?.objectives && remoteData.objectives.length > 0)
    ? remoteData.objectives
    : dhcl.objectives;

  // 5. Outcomes & Incubation
  const outcomes = {
    ...dhcl.outcomes,
    ...(remoteData?.outcomes || {}),
    badgePill: remoteData?.outcomes?.badgePill || 'IIT Hyderabad Incubation (ITIC)',
    briefHeading: remoteData?.outcomes?.briefHeading || 'Eco-Housing & Sustainability Impact',
    teamTitle: remoteData?.outcomes?.teamTitle || 'ITIC BUILD Incubated Student Innovators Team (SMB)',
  };

  // 6. Academic Research Project
  const academicProject = {
    ...dhcl.academicProject,
    ...(remoteData?.academicProject || {}),
    badge: remoteData?.academicProject?.badge || 'Academic Research Project Spotlight',
    teamTitle: remoteData?.academicProject?.teamTitle || 'Project Research Team',
  };

  // 7. Beneficiaries Directory
  const beneficiariesTag = remoteData?.beneficiariesTag || 'Skill & Research Training';
  const beneficiariesTitle = remoteData?.beneficiariesTitle || 'Students Benefited Directory';
  const studentsBenefited = (remoteData?.studentsBenefited && remoteData.studentsBenefited.length > 0)
    ? remoteData.studentsBenefited
    : dhcl.studentsBenefited;

  // 8. Expos & Activities
  const activitiesTitle = remoteData?.activitiesTitle || 'Department Expos & Exposure Visits';
  const activitiesList = (remoteData?.activities && remoteData.activities.length > 0)
    ? remoteData.activities
    : dhcl.activities;

  // 9. Photo Gallery
  const dynamicPhotos: CustomSectionPhoto[] = (sections || [])
    .filter((s) => s.contentType === 'gallery' && hasCustomSectionContent(s))
    .flatMap((s) => s.galleryPhotos || [])
    .filter((p) => p.imageUrl);

  const allGalleryPhotos = (remoteData?.gallery && remoteData.gallery.length > 0)
    ? remoteData.gallery
    : dynamicPhotos;

  // 10. Key Highlights
  const highlights = (remoteData?.highlights && remoteData.highlights.length > 0)
    ? remoteData.highlights
    : (sections?.find((s) => s.id === 'highlights' || s.label?.toLowerCase() === 'key highlights')?.listText?.split('\n').filter(Boolean)
      || (sections?.find((s) => s.id === 'highlights' || s.label?.toLowerCase() === 'key highlights')?.textContent ? [sections?.find((s) => s.id === 'highlights' || s.label?.toLowerCase() === 'key highlights')!.textContent!] : null))
    || dreamHouseConstructionLab.highlights;

  // 11. Facilities & Equipment
  const facilities = (remoteData?.facilities && remoteData.facilities.length > 0)
    ? remoteData.facilities
    : (sections?.find((s) => s.id === 'facilities' || s.label?.toLowerCase() === 'facilities & equipment')?.listText?.split('\n').filter(Boolean)
      || (sections?.find((s) => s.id === 'facilities' || s.label?.toLowerCase() === 'facilities & equipment')?.textContent ? [sections?.find((s) => s.id === 'facilities' || s.label?.toLowerCase() === 'facilities & equipment')!.textContent!] : null))
    || dreamHouseConstructionLab.facilities;

  // 12. Partners
  const partners = (remoteData?.partners && remoteData.partners.length > 0)
    ? remoteData.partners
    : (sections?.find((s) => s.id === 'partners' || s.label?.toLowerCase() === 'partners')?.listText?.split('\n').filter(Boolean)
      || (sections?.find((s) => s.id === 'partners' || s.label?.toLowerCase() === 'partners')?.textContent ? [sections?.find((s) => s.id === 'partners' || s.label?.toLowerCase() === 'partners')!.textContent!] : null))
    || dreamHouseConstructionLab.partners;

  // 13. Dynamic Custom Sections from Admin
  const additionalSections = remoteData?.additionalSections || [];

  // Filter legacy duplicate accordion sections
  const BUILT_IN_SECTION_NAMES = [
    'in-charge', 'incharge', 'in charge',
    'academic projects', 'academic-projects', 'academic-project', 'academic project',
    'students benefited', 'students-benefited',
    'outcomes', 'incubation',
    'activities', 'expos', 'exposure visits',
    'vision', 'mission', 'objectives',
    'highlights', 'key highlights',
    'facilities', 'facilities & equipment',
    'partners',
  ];

  const nonDuplicateCustomSections = (sections || []).filter((s) => {
    const label = (s.label || '').toLowerCase().trim();
    const id = (s.id || '').toLowerCase().trim();
    return !BUILT_IN_SECTION_NAMES.some((b) => b === label || b === id);
  });

  const dynamicAccordionSections: CustomSection[] = [
    ...(highlights && highlights.length > 0 ? [{
      id: 'highlights',
      label: remoteData?.highlightsTitle || 'Key Highlights',
      contentType: 'list' as const,
      listText: highlights.join('\n'),
    }] : []),
    ...(facilities && facilities.length > 0 ? [{
      id: 'facilities',
      label: remoteData?.facilitiesTitle || 'Facilities & Equipment',
      contentType: 'list' as const,
      listText: facilities.join('\n'),
    }] : []),
    ...(partners && partners.length > 0 ? [{
      id: 'partners',
      label: remoteData?.partnersTitle || 'Partners',
      contentType: 'list' as const,
      listText: partners.join('\n'),
    }] : []),
    ...nonDuplicateCustomSections.filter((s) => s.placement !== 'intro' && s.contentType !== 'gallery'),
  ];

  return (
    <div className="dhcl-page-container">
      {/* 1. Structural Stats Strip */}
      <section className="dhcl-stats-section">
        <div className="dhcl-stats-grid">
          <div className="dhcl-stat-card">
            <div className="dhcl-stat-icon-wrapper">
              <Building className="dhcl-stat-icon" />
            </div>
            <div className="dhcl-stat-content">
              <span className="dhcl-stat-number">{stats.stat1.value}</span>
              <span className="dhcl-stat-label">{stats.stat1.label}</span>
            </div>
          </div>

          <div className="dhcl-stat-card">
            <div className="dhcl-stat-icon-wrapper">
              <GraduationCap className="dhcl-stat-icon" />
            </div>
            <div className="dhcl-stat-content">
              <span className="dhcl-stat-number">{stats.stat2.value}</span>
              <span className="dhcl-stat-label">{stats.stat2.label}</span>
            </div>
          </div>

          <div className="dhcl-stat-card">
            <div className="dhcl-stat-icon-wrapper">
              <Award className="dhcl-stat-icon" />
            </div>
            <div className="dhcl-stat-content">
              <span className="dhcl-stat-number">{stats.stat3.value}</span>
              <span className="dhcl-stat-label">{stats.stat3.label}</span>
            </div>
          </div>

          <div className="dhcl-stat-card">
            <div className="dhcl-stat-icon-wrapper">
              <Rocket className="dhcl-stat-icon" />
            </div>
            <div className="dhcl-stat-content">
              <span className="dhcl-stat-number">{stats.stat4.value}</span>
              <span className="dhcl-stat-label">{stats.stat4.label}</span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Main Overview & In-Charge Spotlight */}
      <section className="dhcl-overview-section">
        <div className="dhcl-overview-wrapper">
          {/* Main Lab Intro Card */}
          <div className="dhcl-about-card">
            <div className="dhcl-card-badge">
              <Layers size={15} /> {overviewBadge}
            </div>
            <h2 className="dhcl-section-heading">{overviewTitle}</h2>
            <div className="dhcl-paragraphs">
              {aboutParagraphs.map((p, idx) => (
                <p key={idx} className="dhcl-lead-paragraph">
                  {renderBold(p)}
                </p>
              ))}
            </div>

            {/* Faculty In-Charge Spotlight Bar */}
            <div className="dhcl-incharge-spotlight-bar">
              <div className="dhcl-incharge-profile-col">
                <div className="dhcl-incharge-avatar-box">
                  <Users size={28} className="dhcl-incharge-avatar-icon" />
                </div>
                <div className="dhcl-incharge-titles">
                  <span className="dhcl-incharge-tag">Faculty In-Charge</span>
                  <h3 className="dhcl-incharge-name">{dhcl.inCharge.name}</h3>
                  <p className="dhcl-incharge-designation">{dhcl.inCharge.designation}</p>
                </div>
              </div>

              {dhcl.inCharge.interests && (
                <div className="dhcl-incharge-interests-col">
                  <span className="dhcl-field-label">Research Focus & Interests</span>
                  <div className="dhcl-interests-pills">
                    {dhcl.inCharge.interests.split(',').map((interest, i) => (
                      <span key={i} className="dhcl-interest-pill">
                        {interest.trim()}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="dhcl-incharge-contacts-col">
                <div className="dhcl-incharge-contacts">
                  {dhcl.inCharge.email && (
                    <a href={`mailto:${dhcl.inCharge.email}`} className="dhcl-contact-item">
                      <Mail size={15} />
                      <span>{dhcl.inCharge.email}</span>
                    </a>
                  )}
                  {dhcl.inCharge.mobile && (
                    <div className="dhcl-contact-item">
                      <Phone size={15} />
                      <span>+91 {dhcl.inCharge.mobile}</span>
                    </div>
                  )}
                  {dhcl.inCharge.website && (
                    <div className="dhcl-contact-item">
                      <Globe size={15} />
                      <span>{dhcl.inCharge.website}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Gallery Custom Sections Renderer */}
            {nonDuplicateCustomSections && nonDuplicateCustomSections.length > 0 && (
              <div className="dhcl-custom-sections-wrapper">
                <CustomSectionsGalleries sections={nonDuplicateCustomSections} />
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 3. Vision & Mission Quad-Grid */}
      <section className="dhcl-vision-mission-section">
        <div className="dhcl-vm-container">
          {/* Vision Featured Banner */}
          <div className="dhcl-vision-card">
            <div className="dhcl-vm-icon-box vision-icon">
              <Compass size={24} />
            </div>
            <div className="dhcl-vision-content">
              <span className="dhcl-vm-subtitle">{visionSubtitle}</span>
              <h3 className="dhcl-vm-title">{visionTitle}</h3>
              <p className="dhcl-vision-text">{visionText}</p>
            </div>
          </div>

          {/* Mission Grid */}
          <div className="dhcl-mission-block">
            <div className="dhcl-mission-header">
              <div className="dhcl-vm-icon-box mission-icon">
                <Target size={24} />
              </div>
              <div>
                <span className="dhcl-vm-subtitle">{missionSubtitle}</span>
                <h3 className="dhcl-vm-title">{missionTitle}</h3>
              </div>
            </div>

            <div className="dhcl-mission-grid">
              {missionList.map((item, idx) => (
                <div key={idx} className="dhcl-mission-card">
                  <div className="dhcl-mission-badge">0{idx + 1}</div>
                  <div className="dhcl-mission-text-wrap">
                    <CheckCircle2 size={18} className="dhcl-check-icon" />
                    <p className="dhcl-mission-text">{renderBold(item)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 4. Objectives List */}
          {objectivesList && objectivesList.length > 0 && (
            <div className="dhcl-objectives-card">
              <h3 className="dhcl-objectives-title">
                <ShieldCheck size={20} /> {objectivesTitle}
              </h3>
              <div className="dhcl-objectives-grid">
                {objectivesList.map((obj, idx) => (
                  <div key={idx} className="dhcl-objective-item">
                    <span className="dhcl-obj-bullet">•</span>
                    <p>{renderBold(obj)}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* 5. Incubation & Startup Outcomes Showcase */}
      <section className="dhcl-outcomes-section">
        <div className="dhcl-outcomes-card">
          <div className="dhcl-outcomes-header-banner">
            <div className="dhcl-trophy-badge">
              <Award size={36} />
            </div>
            <div className="dhcl-outcomes-title-wrap">
              <span className="dhcl-outcomes-tag">{outcomes.heading}</span>
              <h2 className="dhcl-outcomes-main-title">{outcomes.subheading}</h2>
              {outcomes.badgePill && (
                <span className="dhcl-outcomes-badge-pill">{outcomes.badgePill}</span>
              )}
            </div>
          </div>

          <div className="dhcl-outcomes-body">
            {/* Paragraph Announcement */}
            {outcomes.paragraphs.map((p, idx) => (
              <div key={idx} className="dhcl-outcome-alert">
                <Sparkles size={20} className="dhcl-alert-sparkle" />
                <p className="dhcl-alert-text">{renderBold(p)}</p>
              </div>
            ))}

            {/* Impact Brief Callout */}
            <div className="dhcl-brief-box">
              <h4 className="dhcl-brief-heading">{outcomes.briefHeading}</h4>
              <p className="dhcl-brief-text">{outcomes.brief}</p>
            </div>

            {/* Incubation Team Table with + and - toggle */}
            <div className="dhcl-table-container">
              <div
                className="dhcl-table-header-bar dhcl-table-header-toggleable"
                onClick={() => setIsIticTeamExpanded(!isIticTeamExpanded)}
                title="Click to collapse / expand team details"
              >
                <div className="dhcl-table-title-group">
                  <span className="dhcl-plus-minus-badge">
                    {isIticTeamExpanded ? <Minus size={16} /> : <Plus size={16} />}
                  </span>
                  <h4 className="dhcl-table-title">{outcomes.teamTitle}</h4>
                </div>
                <div className="dhcl-table-meta-group">
                  <span className="dhcl-table-count">{outcomes.team.rows.length} Members</span>
                  <span className="dhcl-expand-hint">{isIticTeamExpanded ? 'Hide' : 'Show'}</span>
                </div>
              </div>

              {isIticTeamExpanded && (
                <div className="dhcl-table-responsive animate-fade-in">
                  <table className="dhcl-data-table">
                    <thead>
                      <tr>
                        {outcomes.team.headers.map((h, i) => (
                          <th key={i}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {outcomes.team.rows.map((row, rIdx) => (
                        <tr key={rIdx}>
                          {row.cells.map((cell, cIdx) => (
                            <td key={cIdx} className={cIdx === 0 ? 'dhcl-td-sno' : cIdx === 1 ? 'dhcl-td-regd' : ''}>
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
          </div>
        </div>
      </section>

      {/* 6. Academic Research Project Section */}
      <section className="dhcl-academic-project-section">
        <div className="dhcl-project-card">
          <div className="dhcl-project-header">
            <div className="dhcl-project-badge">
              <BookOpen size={16} /> {academicProject.badge}
            </div>
            <h3 className="dhcl-project-heading">{academicProject.heading}</h3>
          </div>

          <div className="dhcl-project-content-grid">
            {/* Left: Research Description */}
            <div className="dhcl-project-text-side">
              {academicProject.paragraphs.map((para, i) => (
                <p key={i} className="dhcl-project-paragraph">
                  {renderBold(para)}
                </p>
              ))}
            </div>

            {/* Right: Research Team Table */}
            <div className="dhcl-project-team-side">
              <div className="dhcl-team-box">
                <div
                  className="dhcl-team-box-header dhcl-table-header-toggleable"
                  onClick={() => setIsProjectTeamExpanded(!isProjectTeamExpanded)}
                  title="Click to collapse / expand research team"
                >
                  <div className="dhcl-table-title-group">
                    <span className="dhcl-plus-minus-badge">
                      {isProjectTeamExpanded ? <Minus size={14} /> : <Plus size={14} />}
                    </span>
                    <h4 className="dhcl-team-box-title" style={{ margin: 0 }}>
                      {academicProject.teamTitle}
                    </h4>
                  </div>
                  <span className="dhcl-expand-hint">{isProjectTeamExpanded ? 'Hide' : 'Show'}</span>
                </div>

                {isProjectTeamExpanded && (
                  <table className="dhcl-data-table dhcl-compact-table animate-fade-in">
                    <thead>
                      <tr>
                        {academicProject.team.headers.map((h, idx) => (
                          <th key={idx}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {academicProject.team.rows.map((row, rIdx) => (
                        <tr key={rIdx}>
                          {row.cells.map((cell, cIdx) => (
                            <td key={cIdx} className={cIdx === 3 && cell ? 'dhcl-faculty-cell' : ''}>
                              {cell}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. Student Beneficiaries Directory */}
      <section className="dhcl-beneficiaries-section">
        <div className="dhcl-beneficiaries-card">
          <div className="dhcl-beneficiaries-header">
            <div>
              <span className="dhcl-beneficiaries-tag">{beneficiariesTag}</span>
              <h3 className="dhcl-beneficiaries-title">{beneficiariesTitle}</h3>
            </div>

            {/* Cohort Tabs */}
            <div className="dhcl-cohort-tabs">
              {studentsBenefited.map((group, gIdx) => (
                <button
                  key={gIdx}
                  className={`dhcl-cohort-tab ${activeStudentCohort === gIdx ? 'active' : ''}`}
                  onClick={() => setActiveStudentCohort(gIdx)}
                >
                  {group.yearLabel}
                  <span className="dhcl-cohort-count">{group.students.length}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Active Cohort Grid */}
          <div className="dhcl-students-grid">
            {studentsBenefited[activeStudentCohort]?.students.map((student, sIdx) => (
              <div key={sIdx} className="dhcl-student-card">
                <div className="dhcl-student-regd">{student.regdNo}</div>
                <div className="dhcl-student-name">{student.name}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 8. Activities & Exposure Events Timeline */}
      {activitiesList && activitiesList.length > 0 && (
        <section className="dhcl-activities-section">
          <div className="dhcl-activities-card">
            <div className="dhcl-activities-header">
              <Calendar className="dhcl-activities-icon" size={24} />
              <h3 className="dhcl-activities-title">{activitiesTitle}</h3>
            </div>

            <div className="dhcl-activities-list">
              {activitiesList.map((act, idx) => (
                <div key={idx} className="dhcl-activity-item">
                  <div className="dhcl-act-bullet">
                    <ChevronRight size={16} />
                  </div>
                  <p className="dhcl-act-text">{renderBold(act)}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 9. Photo Gallery */}
      {allGalleryPhotos.length > 0 && (
        <section className="dhcl-activities-section">
          <div className="dhcl-activities-card">
            <div className="dhcl-activities-header">
              <Maximize2 className="dhcl-activities-icon" size={24} />
              <h3 className="dhcl-activities-title">Laboratory & Testing Gallery</h3>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '1rem', marginTop: '1rem' }}>
              {allGalleryPhotos.map((photo, pIdx) => (
                <div
                  key={pIdx}
                  onClick={() => setSelectedPhoto(photo.imageUrl)}
                  style={{ borderRadius: '8px', overflow: 'hidden', border: '1px solid #e2e8f0', cursor: 'pointer', background: '#f8fafc', transition: 'transform 0.2s' }}
                >
                  <img
                    src={photo.imageUrl}
                    alt={photo.caption || 'Dream House Lab'}
                    style={{ width: '100%', height: '180px', objectFit: 'cover' }}
                    loading="lazy"
                  />
                  {photo.caption && (
                    <div style={{ padding: '0.5rem 0.75rem', fontSize: '0.8rem', color: '#475569' }}>
                      {renderBold(photo.caption)}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* DYNAMIC CUSTOM SECTIONS ACCORDION (Highlights, Facilities, Partners, etc.) */}
      {nonDuplicateCustomSections.some((s) => s.placement === 'intro') && (
        <section className="dhcl-activities-section">
          <CustomSectionsIntro sections={nonDuplicateCustomSections} />
        </section>
      )}
      {nonDuplicateCustomSections.some((s) => s.contentType === 'gallery') && (
        <section className="dhcl-activities-section">
          <CustomSectionsGalleries sections={nonDuplicateCustomSections} />
        </section>
      )}
      {dynamicAccordionSections.length > 0 && (
        <section className="dhcl-activities-section">
          <CustomSectionsAccordion sections={dynamicAccordionSections} />
        </section>
      )}

      {/* 10. Dynamic Additional Custom Sections from Admin */}
      {additionalSections.length > 0 && (
        <section className="dhcl-activities-section">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {additionalSections.map((sec) => (
              <div key={sec.id} className="dhcl-about-card">
                {sec.badge && (
                  <div className="dhcl-card-badge">
                    <Sparkles size={15} /> {sec.badge}
                  </div>
                )}
                <h3 className="dhcl-section-heading" style={{ fontSize: '1.4rem' }}>{sec.title}</h3>
                <div className="dhcl-paragraphs">
                  {(sec.paragraphs || []).map((p, pIdx) => (
                    <p key={pIdx} className="dhcl-lead-paragraph">{renderBold(p)}</p>
                  ))}
                </div>
                {(sec.bulletPoints || []).length > 0 && (
                  <div className="dhcl-objectives-grid" style={{ marginTop: '1rem' }}>
                    {sec.bulletPoints!.map((b, bIdx) => (
                      <div key={bIdx} className="dhcl-objective-item">
                        <span className="dhcl-obj-bullet">•</span>
                        <p>{renderBold(b)}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Lightbox */}
      {selectedPhoto && (
        <div
          onClick={() => setSelectedPhoto(null)}
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, padding: '1rem' }}
        >
          <img
            src={selectedPhoto}
            alt="Enlarged gallery view"
            style={{ maxWidth: '90vw', maxHeight: '90vh', borderRadius: '8px', objectFit: 'contain' }}
          />
        </div>
      )}
    </div>
  );
}
