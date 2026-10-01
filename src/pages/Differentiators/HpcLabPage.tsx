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
import { hasCustomSectionContent, type CustomSection } from '../../lib/customSections';
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

  const hpc = {
    paragraphs: remoteData?.paragraphs && remoteData.paragraphs.length > 0 ? remoteData.paragraphs : highPerformanceComputingLab.paragraphs,
    vision: remoteData?.vision || highPerformanceComputingLab.vision,
    mission: remoteData?.mission && remoteData.mission.length > 0 ? remoteData.mission : highPerformanceComputingLab.mission,
    objectives: remoteData?.objectives && remoteData.objectives.length > 0 ? remoteData.objectives : highPerformanceComputingLab.objectives,
    team: highPerformanceComputingLab.team,
    fundedProjects: remoteData?.fundedProjects && remoteData.fundedProjects.length > 0 ? remoteData.fundedProjects : highPerformanceComputingLab.fundedProjects,
    facultyResearch: remoteData?.facultyResearch && remoteData.facultyResearch.length > 0 ? remoteData.facultyResearch : highPerformanceComputingLab.facultyResearch,
    outcomes: remoteData?.outcomes && remoteData.outcomes.length > 0 ? remoteData.outcomes : highPerformanceComputingLab.outcomes,
    activities: remoteData?.activities && remoteData.activities.length > 0 ? remoteData.activities : highPerformanceComputingLab.activities,
  };
  const additionalSections = remoteData?.additionalSections || [];

  const aboutParagraphs = (item?.description && hasCustomSectionContent(item.description) && item.description.textContent)
    ? [item.description.textContent]
    : item?.desc
    ? [item.desc]
    : hpc.paragraphs;

  const visionText = (item?.vision && hasCustomSectionContent(item.vision) && (item.vision.textContent || item.vision.listText)) || hpc.vision;

  const missionList = (item?.mission && hasCustomSectionContent(item.mission) && (item.mission.listText?.split('\n').filter(Boolean) || [item.mission.textContent || ''])) || hpc.mission;

  const objectivesList = (item?.objectives && hasCustomSectionContent(item.objectives) && (item.objectives.listText?.split('\n').filter(Boolean) || [item.objectives.textContent || ''])) || hpc.objectives;

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
              <span className="hpc-telemetry-val">2021</span>
              <span className="hpc-telemetry-lbl">Established Year</span>
            </div>
          </div>

          <div className="hpc-telemetry-card">
            <div className="hpc-telemetry-icon-box">
              <Award className="hpc-telemetry-icon" />
            </div>
            <div className="hpc-telemetry-info">
              <span className="hpc-telemetry-val">DST R&D</span>
              <span className="hpc-telemetry-lbl">Sponsored Grant</span>
            </div>
          </div>

          <div className="hpc-telemetry-card">
            <div className="hpc-telemetry-icon-box">
              <BookOpen className="hpc-telemetry-icon" />
            </div>
            <div className="hpc-telemetry-info">
              <span className="hpc-telemetry-val">9+</span>
              <span className="hpc-telemetry-lbl">IEEE & Scopus Papers</span>
            </div>
          </div>

          <div className="hpc-telemetry-card">
            <div className="hpc-telemetry-icon-box">
              <Calendar className="hpc-telemetry-icon" />
            </div>
            <div className="hpc-telemetry-info">
              <span className="hpc-telemetry-val">6+</span>
              <span className="hpc-telemetry-lbl">Specialized Workshops</span>
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
              <Cpu size={14} /> Centre of Excellence
            </div>
            <h2 className="hpc-section-heading">{item?.title || 'High Performance Computing (HPC) Lab'}</h2>
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
                <Compass size={14} /> Vision
              </div>
              <h3 className="hpc-subcard-title">Our Vision</h3>
              <p className="hpc-vision-text">{renderBold(visionText)}</p>
            </div>

            <div className="hpc-cyber-card hpc-mission-card">
              <div className="hpc-card-badge cyan">
                <Target size={14} /> Mission
              </div>
              <h3 className="hpc-subcard-title">Our Mission</h3>
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
              <Sparkles size={14} /> Key Objectives
            </div>
            <h3 className="hpc-subcard-title">Strategic Objectives</h3>
            <div className="hpc-objectives-grid">
              {objectivesList.map((obj: string, idx: number) => (
                <div key={idx} className="hpc-objective-tile">
                  <span className="hpc-objective-num">0{idx + 1}</span>
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
              <Award size={14} /> DST Sponsored R&D
            </div>
            <h2 className="hpc-section-heading">Funded Research Projects</h2>
            <div className="hpc-funded-project-content">
              {hpc.fundedProjects.map((proj: string, idx: number) => (
                <div key={idx} className="hpc-funded-box">
                  <div className="hpc-funded-header">
                    <span className="hpc-badge-grant">DST Sponsored Project</span>
                    <span className="hpc-grant-no">DST /SEED/SCSP/STI/ 2019/140/G</span>
                  </div>
                  <p className="hpc-funded-desc">{renderBold(proj)}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Faculty Research Topics */}
          <div className="hpc-cyber-card hpc-faculty-research-card">
            <div className="hpc-card-badge cyan">
              <Code2 size={14} /> Deep Learning & Computer Vision
            </div>
            <h2 className="hpc-section-heading">Faculty Research Initiatives</h2>
            <div className="hpc-research-list">
              {hpc.facultyResearch.map((res: string, idx: number) => (
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
              <BookOpen size={14} /> Research Output
            </div>
            <div className="hpc-outcomes-header-row">
              <div>
                <h2 className="hpc-section-heading">Outcomes & Publications</h2>
                <p className="hpc-section-subtext">High-impact research publications in reputed IEEE conferences and indexed journals.</p>
              </div>
              <span className="hpc-pub-count-badge">{hpc.outcomes.length} Papers Published</span>
            </div>

            <div className="hpc-publications-grid">
              {hpc.outcomes.map((paper: string, idx: number) => {
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
              <Users size={14} /> Academic Experts
            </div>
            <h2 className="hpc-section-heading">HPC Lab Team & Leadership</h2>

            {/* In-Charge Section */}
            <div className="hpc-team-group">
              <h3 className="hpc-team-group-title">Lab In-Charge</h3>
              <div className="hpc-team-grid">
                {hpc.team.inCharge.map((member: typeof hpc.team.inCharge[0], idx: number) => (
                  <div key={idx} className="hpc-member-card in-charge">
                    <div className="hpc-member-header">
                      <div className="hpc-member-avatar-placeholder">
                        <Users size={32} />
                      </div>
                      <div>
                        <h4 className="hpc-member-name">{member.name}</h4>
                        <span className="hpc-member-role">{member.designation}</span>
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
                {hpc.team.facultyMembers.map((member: typeof hpc.team.facultyMembers[0], idx: number) => (
                  <div key={idx} className="hpc-member-card">
                    <div className="hpc-member-header">
                      <div className="hpc-member-avatar-placeholder">
                        <Users size={28} />
                      </div>
                      <div>
                        <h4 className="hpc-member-name">{member.name}</h4>
                        <span className="hpc-member-role">{member.designation}</span>
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
              <Calendar size={14} /> Specialized Events
            </div>
            <h2 className="hpc-section-heading">Workshops & Training Activities</h2>
            <div className="hpc-activities-timeline">
              {hpc.activities.map((act: string, idx: number) => (
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

      {/* Admin Custom Sections */}
      {sections.some((s) => s.placement === 'intro') && (
        <section className="hpc-section">
          <CustomSectionsIntro sections={sections} />
        </section>
      )}
      {sections.length > 0 && (
        <section className="hpc-section">
          <CustomSectionsGalleries sections={sections} />
          <CustomSectionsAccordion sections={sections.filter((s) => s.placement !== 'intro' && s.contentType !== 'gallery')} />
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
