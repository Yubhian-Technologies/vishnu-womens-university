import { useState } from 'react';
import {
  Cpu,
  Layers,
  Award,
  Users,
  Target,
  Compass,
  CheckCircle2,
  Mail,
  Phone,
  BookOpen,
  Calendar,
  Sparkles,
  Code2,
  Database,
  BrainCircuit,
  FileText,
} from 'lucide-react';
import { CustomSectionsGalleries, CustomSectionsAccordion, CustomSectionsIntro } from '../../components/CustomSectionsRenderer/CustomSectionsRenderer';
import { type CustomSection } from '../../lib/customSections';
import { useDocument } from '../../hooks/useDocument';
import type { HpcLabDoc } from '../Admin/sections/HpcLabContentAdmin';
import type { DifferentiatorItemDoc } from '../Admin/sections/DifferentiatorsAdmin';
import { highPerformanceComputingLab } from './highPerformanceComputingLab.data';
import { renderBold } from '../../lib/boldText';
import './HpcLabPage.css';

interface HpcLabPageProps {
  item?: DifferentiatorItemDoc;
  sections?: CustomSection[];
}

export default function HpcLabPage({ item, sections = [] }: HpcLabPageProps) {
  const { data: remoteData } = useDocument<HpcLabDoc>('settings', 'hpcLab');
  const [activeTab, setActiveTab] = useState<'all' | 'overview' | 'research' | 'publications' | 'team' | 'activities'>('all');

  // 1. Telemetry Stats
  const telemetry = {
    stat1: remoteData?.telemetry?.stat1?.value ? remoteData.telemetry.stat1 : { value: '2021', label: 'Established Year' },
    stat2: remoteData?.telemetry?.stat2?.value ? remoteData.telemetry.stat2 : { value: 'DST R&D', label: 'Sponsored Grant' },
    stat3: remoteData?.telemetry?.stat3?.value ? remoteData.telemetry.stat3 : { value: '9+', label: 'IEEE & Scopus Papers' },
    stat4: remoteData?.telemetry?.stat4?.value ? remoteData.telemetry.stat4 : { value: '6+', label: 'Specialized Workshops' },
  };

  // 2. Overview & Purpose
  const overviewBadge = remoteData?.overviewBadge || 'Centre of Excellence';
  const overviewTitle = remoteData?.overviewTitle || item?.title || 'High Performance Computing (HPC) Lab';
  const aboutParagraphs = (remoteData?.paragraphs && remoteData.paragraphs.length > 0)
    ? remoteData.paragraphs
    : highPerformanceComputingLab.paragraphs;

  // 3. Vision & Mission
  const visionBadge = remoteData?.visionBadge || 'Vision';
  const visionTitle = remoteData?.visionTitle || 'Our Vision';
  const visionText = remoteData?.vision || highPerformanceComputingLab.vision;

  const missionBadge = remoteData?.missionBadge || 'Mission';
  const missionTitle = remoteData?.missionTitle || 'Our Mission';
  const missionList = (remoteData?.mission && remoteData.mission.length > 0)
    ? remoteData.mission
    : highPerformanceComputingLab.mission;

  // 4. Strategic Objectives
  const objectivesBadge = remoteData?.objectivesBadge || 'Key Objectives';
  const objectivesTitle = remoteData?.objectivesTitle || 'Strategic Objectives';
  const objectivesList = (remoteData?.objectives && remoteData.objectives.length > 0)
    ? remoteData.objectives
    : highPerformanceComputingLab.objectives;

  // 5. Funded Research Projects
  const fundedProjectsBadge = remoteData?.fundedProjectsBadge || 'DST Sponsored R&D';
  const fundedProjectsTitle = remoteData?.fundedProjectsTitle || 'Funded Research Projects';
  const fundedProjects = (remoteData?.fundedProjects && remoteData.fundedProjects.length > 0)
    ? remoteData.fundedProjects
    : highPerformanceComputingLab.fundedProjects;

  // 6. Faculty Research Initiatives
  const facultyResearchBadge = remoteData?.facultyResearchBadge || 'Deep Learning & Computer Vision';
  const facultyResearchTitle = remoteData?.facultyResearchTitle || 'Faculty Research Initiatives';
  const facultyResearch = (remoteData?.facultyResearch && remoteData.facultyResearch.length > 0)
    ? remoteData.facultyResearch
    : highPerformanceComputingLab.facultyResearch;

  // 7. Outcomes & Publications
  const outcomesBadge = remoteData?.outcomesBadge || 'Research Output';
  const outcomesTitle = remoteData?.outcomesTitle || 'Outcomes & Publications';
  const outcomesSubtext = remoteData?.outcomesSubtext || 'High-impact research publications in reputed IEEE conferences and indexed journals.';
  const outcomes = (remoteData?.outcomes && remoteData.outcomes.length > 0)
    ? remoteData.outcomes
    : highPerformanceComputingLab.outcomes;

  // 8. HPC Lab Team & Leadership
  const teamBadge = remoteData?.teamBadge || 'Academic Experts';
  const teamTitle = remoteData?.teamTitle || 'HPC Lab Team & Leadership';
  const inChargeMembers = (remoteData?.team?.inCharge && remoteData.team.inCharge.length > 0)
    ? remoteData.team.inCharge
    : highPerformanceComputingLab.team.inCharge;
  const facultyMembers = (remoteData?.team?.facultyMembers && remoteData.team.facultyMembers.length > 0)
    ? remoteData.team.facultyMembers
    : highPerformanceComputingLab.team.facultyMembers;

  // 9. Workshops & Activities
  const activitiesBadge = remoteData?.activitiesBadge || 'Specialized Events';
  const activitiesTitle = remoteData?.activitiesTitle || 'Workshops & Training Activities';
  const activities = (remoteData?.activities && remoteData.activities.length > 0)
    ? remoteData.activities
    : highPerformanceComputingLab.activities;

  // 10. Key Highlights
  const highlights = (remoteData?.highlights && remoteData.highlights.length > 0)
    ? remoteData.highlights
    : (sections.find((s) => s.id === 'highlights' || s.label?.toLowerCase() === 'key highlights')?.listText?.split('\n').filter(Boolean)
      || (sections.find((s) => s.id === 'highlights' || s.label?.toLowerCase() === 'key highlights')?.textContent ? [sections.find((s) => s.id === 'highlights' || s.label?.toLowerCase() === 'key highlights')!.textContent!] : null))
    || highPerformanceComputingLab.highlights;

  // 11. Facilities & Equipment
  const facilities = (remoteData?.facilities && remoteData.facilities.length > 0)
    ? remoteData.facilities
    : (sections.find((s) => s.id === 'facilities' || s.label?.toLowerCase() === 'facilities & equipment')?.listText?.split('\n').filter(Boolean)
      || (sections.find((s) => s.id === 'facilities' || s.label?.toLowerCase() === 'facilities & equipment')?.textContent ? [sections.find((s) => s.id === 'facilities' || s.label?.toLowerCase() === 'facilities & equipment')!.textContent!] : null))
    || highPerformanceComputingLab.facilities;

  // 12. Partners
  const partners = (remoteData?.partners && remoteData.partners.length > 0)
    ? remoteData.partners
    : (sections.find((s) => s.id === 'partners' || s.label?.toLowerCase() === 'partners')?.listText?.split('\n').filter(Boolean)
      || (sections.find((s) => s.id === 'partners' || s.label?.toLowerCase() === 'partners')?.textContent ? [sections.find((s) => s.id === 'partners' || s.label?.toLowerCase() === 'partners')!.textContent!] : null))
    || highPerformanceComputingLab.partners;

  // 13. Additional Sections
  const additionalSections = remoteData?.additionalSections || [];

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
    ...sections.filter((s) => {
      const label = (s.label || '').trim().toLowerCase();
      const id = (s.id || '').trim().toLowerCase();
      const skip = new Set([
        'team',
        'funded projects',
        'funded-projects',
        'fundedprojects',
        'faculty research',
        'faculty-research',
        'facultyresearch',
        'outcomes',
        'activities',
        'overview',
        'vision',
        'mission',
        'objectives',
        'highlights',
        'key highlights',
        'facilities',
        'facilities & equipment',
        'partners',
      ]);
      return s.placement !== 'intro' && s.contentType !== 'gallery' && !skip.has(label) && !skip.has(id);
    }),
  ];

  return (
    <div className="hpc-page-container">
      {/* Supercomputing Telemetry Metric Banner */}
      <section className="hpc-telemetry-strip">
        <div className="hpc-telemetry-grid">
          <div className="hpc-telemetry-card">
            <div className="hpc-telemetry-icon-box">
              <Cpu className="hpc-telemetry-icon" />
            </div>
            <div className="hpc-telemetry-info">
              <span className="hpc-telemetry-val">{telemetry.stat1.value}</span>
              <span className="hpc-telemetry-lbl">{telemetry.stat1.label}</span>
            </div>
          </div>

          <div className="hpc-telemetry-card">
            <div className="hpc-telemetry-icon-box">
              <Award className="hpc-telemetry-icon" />
            </div>
            <div className="hpc-telemetry-info">
              <span className="hpc-telemetry-val">{telemetry.stat2.value}</span>
              <span className="hpc-telemetry-lbl">{telemetry.stat2.label}</span>
            </div>
          </div>

          <div className="hpc-telemetry-card">
            <div className="hpc-telemetry-icon-box">
              <BookOpen className="hpc-telemetry-icon" />
            </div>
            <div className="hpc-telemetry-info">
              <span className="hpc-telemetry-val">{telemetry.stat3.value}</span>
              <span className="hpc-telemetry-lbl">{telemetry.stat3.label}</span>
            </div>
          </div>

          <div className="hpc-telemetry-card">
            <div className="hpc-telemetry-icon-box">
              <Calendar className="hpc-telemetry-icon" />
            </div>
            <div className="hpc-telemetry-info">
              <span className="hpc-telemetry-val">{telemetry.stat4.value}</span>
              <span className="hpc-telemetry-lbl">{telemetry.stat4.label}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Cyber Console Section Filter Tabs */}
      <nav className="hpc-nav-console" aria-label="HPC Lab Content Navigation">
        <button
          type="button"
          className={`hpc-console-tab ${activeTab === 'all' ? 'active' : ''}`}
          onClick={() => setActiveTab('all')}
        >
          <Layers size={15} /> All Sections
        </button>
        <button
          type="button"
          className={`hpc-console-tab ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          <Compass size={15} /> Overview & Vision
        </button>
        <button
          type="button"
          className={`hpc-console-tab ${activeTab === 'research' ? 'active' : ''}`}
          onClick={() => setActiveTab('research')}
        >
          <BrainCircuit size={15} /> R&D & Projects
        </button>
        <button
          type="button"
          className={`hpc-console-tab ${activeTab === 'publications' ? 'active' : ''}`}
          onClick={() => setActiveTab('publications')}
        >
          <FileText size={15} /> Outcomes & Papers
        </button>
        <button
          type="button"
          className={`hpc-console-tab ${activeTab === 'team' ? 'active' : ''}`}
          onClick={() => setActiveTab('team')}
        >
          <Users size={15} /> Lab Team
        </button>
        <button
          type="button"
          className={`hpc-console-tab ${activeTab === 'activities' ? 'active' : ''}`}
          onClick={() => setActiveTab('activities')}
        >
          <Calendar size={15} /> Workshops
        </button>
      </nav>

      {/* Overview & Core Purpose Section */}
      {(activeTab === 'all' || activeTab === 'overview') && (
        <section className="hpc-section hpc-overview-section">
          <div className="hpc-cyber-card hpc-about-card">
            <div className="hpc-card-badge">
              <Cpu size={14} /> {overviewBadge}
            </div>
            <h2 className="hpc-section-heading">{overviewTitle}</h2>
            <div className="hpc-paragraphs">
              {aboutParagraphs.map((para: string, idx: number) => (
                <p key={idx} className="hpc-lead-paragraph">
                  {renderBold(para)}
                </p>
              ))}
            </div>
          </div>

          {/* Vision & Mission Grid */}
          <div className="hpc-vision-mission-grid">
            <div className="hpc-cyber-card hpc-vision-card">
              <div className="hpc-card-badge gold">
                <Compass size={14} /> {visionBadge}
              </div>
              <h3 className="hpc-subcard-title">{visionTitle}</h3>
              <p className="hpc-vision-text">{renderBold(visionText)}</p>
            </div>

            <div className="hpc-cyber-card hpc-mission-card">
              <div className="hpc-card-badge cyan">
                <Target size={14} /> {missionBadge}
              </div>
              <h3 className="hpc-subcard-title">{missionTitle}</h3>
              <ul className="hpc-mission-list">
                {missionList.map((item: string, idx: number) => (
                  <li key={idx} className="hpc-mission-item">
                    <CheckCircle2 className="hpc-bullet-icon cyan" size={18} />
                    <span>{renderBold(item)}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Key Objectives */}
          <div className="hpc-cyber-card hpc-objectives-card">
            <div className="hpc-card-badge">
              <Sparkles size={14} /> {objectivesBadge}
            </div>
            <h3 className="hpc-subcard-title">{objectivesTitle}</h3>
            <div className="hpc-objectives-grid">
              {objectivesList.map((obj: string, idx: number) => (
                <div key={idx} className="hpc-objective-tile">
                  <span className="hpc-objective-num">{String(idx + 1).padStart(2, '0')}</span>
                  <p className="hpc-objective-text">{renderBold(obj)}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* R&D, Funded Projects & Faculty Research */}
      {(activeTab === 'all' || activeTab === 'research') && (
        <section className="hpc-section hpc-research-section">
          {/* Funded Projects */}
          <div className="hpc-cyber-card hpc-project-card">
            <div className="hpc-card-badge gold">
              <Award size={14} /> {fundedProjectsBadge}
            </div>
            <h2 className="hpc-section-heading">{fundedProjectsTitle}</h2>
            <div className="hpc-funded-project-content">
              {fundedProjects.map((proj, idx) => {
                const isObj = typeof proj === 'object' && proj !== null;
                const tag = isObj ? proj.tag || 'DST Sponsored Project' : 'DST Sponsored Project';
                const grantNo = isObj
                  ? proj.grantNo
                  : (typeof proj === 'string' && proj.includes('(No.')
                  ? proj.split('(No.')[1]?.split(')')[0]
                  : 'DST /SEED/SCSP/STI/ 2019/140/G');
                const desc = isObj ? proj.description : String(proj);

                return (
                  <div key={idx} className="hpc-funded-box">
                    <div className="hpc-funded-header">
                      <span className="hpc-badge-grant">{tag}</span>
                      {grantNo && <span className="hpc-grant-no">{grantNo}</span>}
                    </div>
                    <p className="hpc-funded-desc">{renderBold(desc)}</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Faculty Research Topics */}
          <div className="hpc-cyber-card hpc-faculty-research-card">
            <div className="hpc-card-badge cyan">
              <Code2 size={14} /> {facultyResearchBadge}
            </div>
            <h2 className="hpc-section-heading">{facultyResearchTitle}</h2>
            <div className="hpc-research-list">
              {facultyResearch.map((res: string, idx: number) => (
                <div key={idx} className="hpc-research-item">
                  <div className="hpc-research-icon-wrapper">
                    <Database size={18} className="hpc-research-icon" />
                  </div>
                  <div className="hpc-research-body">
                    <span className="hpc-research-tag">AI & Machine Learning R&D</span>
                    <p className="hpc-research-text">{renderBold(res)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Publications & Outcomes */}
      {(activeTab === 'all' || activeTab === 'publications') && (
        <section className="hpc-section hpc-outcomes-section">
          <div className="hpc-cyber-card hpc-outcomes-card">
            <div className="hpc-card-badge cyan">
              <BookOpen size={14} /> {outcomesBadge}
            </div>
            <div className="hpc-outcomes-header-row">
              <div>
                <h2 className="hpc-section-heading">{outcomesTitle}</h2>
                <p className="hpc-section-subtext">{outcomesSubtext}</p>
              </div>
              <span className="hpc-pub-count-badge">{outcomes.length} Papers Published</span>
            </div>

            <div className="hpc-publications-grid">
              {outcomes.map((paper: string, idx: number) => {
                const isIeee = paper.toLowerCase().includes('ieee');
                const isJournal = paper.toLowerCase().includes('journal');
                return (
                  <div key={idx} className="hpc-pub-card">
                    <div className="hpc-pub-top">
                      <span className={`hpc-pub-type-chip ${isIeee ? 'ieee' : isJournal ? 'journal' : 'scopus'}`}>
                        {isIeee ? 'IEEE Proceeding' : isJournal ? 'Scopus Journal' : 'Book Chapter / Conf'}
                      </span>
                      <span className="hpc-pub-index">#{idx + 1}</span>
                    </div>
                    <p className="hpc-pub-title">{renderBold(paper)}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Team Roster */}
      {(activeTab === 'all' || activeTab === 'team') && (
        <section className="hpc-section hpc-team-section">
          <div className="hpc-cyber-card hpc-team-container-card">
            <div className="hpc-card-badge gold">
              <Users size={14} /> {teamBadge}
            </div>
            <h2 className="hpc-section-heading">{teamTitle}</h2>

            {/* In-Charge Section */}
            <div className="hpc-team-group">
              <h3 className="hpc-team-group-title">Lab In-Charge</h3>
              <div className="hpc-team-grid">
                {inChargeMembers.map((member, idx: number) => (
                  <div key={idx} className="hpc-member-card in-charge">
                    <div className="hpc-member-header">
                      <div className="hpc-member-avatar-placeholder">
                        <Users size={32} />
                      </div>
                      <div>
                        <h4 className="hpc-member-name">{member.name}</h4>
                        {member.designation && <span className="hpc-member-role">{member.designation}</span>}
                      </div>
                    </div>
                    <div className="hpc-member-details">
                      {member.interests && (
                        <div className="hpc-member-row">
                          <BrainCircuit size={14} className="hpc-member-icon" />
                          <span>Specialization: <strong>{member.interests}</strong></span>
                        </div>
                      )}
                      {member.email && (
                        <div className="hpc-member-row">
                          <Mail size={14} className="hpc-member-icon" />
                          <a href={`mailto:${member.email}`}>{member.email}</a>
                        </div>
                      )}
                      {member.mobile && (
                        <div className="hpc-member-row">
                          <Phone size={14} className="hpc-member-icon" />
                          <a href={`tel:${member.mobile}`}>{member.mobile}</a>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Faculty Members */}
            <div className="hpc-team-group">
              <h3 className="hpc-team-group-title">Faculty Members</h3>
              <div className="hpc-team-grid">
                {facultyMembers.map((member, idx: number) => (
                  <div key={idx} className="hpc-member-card">
                    <div className="hpc-member-header">
                      <div className="hpc-member-avatar-placeholder">
                        <Users size={28} />
                      </div>
                      <div>
                        <h4 className="hpc-member-name">{member.name}</h4>
                        {member.designation && <span className="hpc-member-role">{member.designation}</span>}
                      </div>
                    </div>
                    <div className="hpc-member-details">
                      {member.interests && (
                        <div className="hpc-member-row">
                          <BrainCircuit size={14} className="hpc-member-icon" />
                          <span>Domain: <strong>{member.interests}</strong></span>
                        </div>
                      )}
                      {member.email && (
                        <div className="hpc-member-row">
                          <Mail size={14} className="hpc-member-icon" />
                          <a href={`mailto:${member.email}`}>{member.email}</a>
                        </div>
                      )}
                      {member.mobile && (
                        <div className="hpc-member-row">
                          <Phone size={14} className="hpc-member-icon" />
                          <a href={`tel:${member.mobile}`}>{member.mobile}</a>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Workshops & Activities */}
      {(activeTab === 'all' || activeTab === 'activities') && (
        <section className="hpc-section hpc-activities-section">
          <div className="hpc-cyber-card hpc-activities-card">
            <div className="hpc-card-badge cyan">
              <Calendar size={14} /> {activitiesBadge}
            </div>
            <h2 className="hpc-section-heading">{activitiesTitle}</h2>
            <div className="hpc-activities-timeline">
              {activities.map((act: string, idx: number) => (
                <div key={idx} className="hpc-activity-timeline-item">
                  <div className="hpc-timeline-marker">
                    <span className="hpc-marker-dot" />
                  </div>
                  <div className="hpc-activity-content">
                    <span className="hpc-activity-tag">Capacity Building Event</span>
                    <p className="hpc-activity-text">{renderBold(act)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Admin Custom Sections & Galleries */}
      {sections.some((s) => s.placement === 'intro') && (
        <section className="hpc-section">
          <CustomSectionsIntro sections={sections} />
        </section>
      )}
      {(sections.some((s) => s.contentType === 'gallery') || dynamicAccordionSections.length > 0) && (
        <section className="hpc-section">
          <CustomSectionsGalleries sections={sections} />
          {dynamicAccordionSections.length > 0 && (
            <CustomSectionsAccordion sections={dynamicAccordionSections} />
          )}
        </section>
      )}

      {/* Dynamic Additional Sections from Admin */}
      {additionalSections.length > 0 && (
        <section className="hpc-section">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {additionalSections.map((sec) => (
              <div key={sec.id} className="hpc-cyber-card">
                {sec.badge && (
                  <div className="hpc-card-badge cyan">
                    <Sparkles size={14} /> {sec.badge}
                  </div>
                )}
                <h2 className="hpc-section-heading">{sec.title}</h2>
                {(sec.paragraphs || []).map((p, pIdx) => (
                  <p key={pIdx} className="hpc-lead-paragraph" style={{ marginBottom: '0.75rem' }}>
                    {renderBold(p)}
                  </p>
                ))}
                {(sec.bulletPoints || []).length > 0 && (
                  <ul className="hpc-mission-list" style={{ marginTop: '0.75rem' }}>
                    {sec.bulletPoints!.map((b, bIdx) => (
                      <li key={bIdx} className="hpc-mission-item">
                        <CheckCircle2 size={16} className="hpc-bullet-icon cyan" />
                        <span>{renderBold(b)}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
