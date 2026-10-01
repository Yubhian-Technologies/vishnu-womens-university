import { useEffect, useState } from 'react';
import {
  Lightbulb,
  Layers,
  Award,
  Users,
  Compass,
  GraduationCap,
  ChevronRight,
  Building2,
  FileCheck,
  Wrench,
  Leaf,
  Sparkles,
  Workflow,
  Mail,
  ShieldCheck,
} from 'lucide-react';
import { aicteIdeaLab } from './aicteIdeaLab.data';
import type { DifferentiatorItemDoc } from '../Admin/sections/DifferentiatorsAdmin';
import type { CustomSection } from '../../lib/customSections';
import { useOrderedCollection, type WithId } from '../../hooks/useCollection';
import { useDocument } from '../../hooks/useDocument';
import type { AicteIdeaLabDoc } from '../Admin/sections/AicteIdeaLabContentAdmin';
import type { AicteIdeaLabTeamMemberDoc } from '../Admin/sections/AicteIdeaLabTeamAdmin';
import type { AicteIdeaLabAmbassadorDoc } from '../Admin/sections/AicteIdeaLabAmbassadorsAdmin';
import { CustomSectionsPlain, CustomSectionsPills, CustomSectionsGalleries, CustomSectionsAccordion } from '../../components/CustomSectionsRenderer/CustomSectionsRenderer';
import { PHOTO_NEEDED_PLACEHOLDER } from '../../lib/photoPlaceholder';
import { renderBold } from '../../lib/boldText';
import './IdeaLabPage.css';

interface IdeaLabPageProps {
  item?: DifferentiatorItemDoc;
  sections?: CustomSection[];
}

const DEFAULT_TEAM = [
  { id: 't1', name: 'Dr. G. Srinivasa Rao', designation: 'Principal, SVECW', role: 'Chief Mentor', order: 1 },
  { id: 't2', name: 'Dr. P. Srinivasa Raju', designation: 'Vice Principal, SVECW', role: 'Coordinator', order: 2 },
  { id: 't3', name: 'Dr. S. Hanumantha Rao', designation: 'Professor, Dept. of ECE', role: 'Co-Coordinator', order: 3 },
  { id: 't4', name: 'Dr. T. Sudheer Kumar', designation: 'Professor, Dept. of ECE', role: 'Tech GURU', order: 4 },
  { id: 't5', name: 'Mr. B. Satya Krishna', designation: 'Asst. Professor, Dept. of ME', role: 'Tech GURU', order: 5 },
  { id: 't6', name: 'Mr. N. Kalyan Chakravarthy', designation: 'Technician', role: 'Lab GURU', order: 6 },
];

const DEFAULT_AMBASSADORS = [
  { id: 'a1', regNumber: '21B01A54A6', name: 'T. Hanuma Priya', year: 'II', branch: 'AIDS', order: 1 },
  { id: 'a2', regNumber: '21B01A6110', name: 'B. Haritha Priya Lakshmi Bala', year: 'II', branch: 'AIML', order: 2 },
  { id: 'a3', regNumber: '21B01A0125', name: 'K. Renu Priyanka', year: 'II', branch: 'CIVIL', order: 3 },
  { id: 'a4', regNumber: '21B01A0525', name: 'B. Naga Sai Eswari Sathvika', year: 'II', branch: 'CSE', order: 4 },
  { id: 'a5', regNumber: '21B01A0437', name: 'J. Tejaswini Sai Sindhu', year: 'II', branch: 'ECE', order: 5 },
  { id: 'a6', regNumber: '21B01A0488', name: 'R. Jahnavi', year: 'II', branch: 'ECE', order: 6 },
  { id: 'a7', regNumber: '21B01A0211', name: 'G. T. S. Padmavathi', year: 'II', branch: 'EEE', order: 7 },
  { id: 'a8', regNumber: '21B01A0221', name: 'K. Pujitha', year: 'II', branch: 'EEE', order: 8 },
  { id: 'a9', regNumber: '21B01A0313', name: 'D. Yasaswini Naga Sai Sirisha', year: 'II', branch: 'ME', order: 9 },
  { id: 'a10', regNumber: '21B01A0314', name: 'D. H Pravallika Devi', year: 'II', branch: 'ME', order: 10 },
];

const TELEMETRY_ICONS = [Award, Lightbulb, Wrench, Leaf];

export default function IdeaLabPage({ item, sections = [] }: IdeaLabPageProps) {
  const { data: ideaDoc } = useDocument<AicteIdeaLabDoc>('settings', 'aicteIdeaLab');
  const { docs: teamDocs } = useOrderedCollection<AicteIdeaLabTeamMemberDoc>('aicteIdeaLabTeam', 'order');
  const { docs: ambassadorDocs } = useOrderedCollection<AicteIdeaLabAmbassadorDoc>('aicteIdeaLabAmbassadors', 'order');
  const { docs: facilityPhotos } = useOrderedCollection<WithId & { imageUrl: string; caption?: string }>('aicteIdeaLabFacilityPhotos', 'order');

  const team = teamDocs.length > 0 ? teamDocs : DEFAULT_TEAM;
  const ambassadors = ambassadorDocs.length > 0 ? ambassadorDocs : DEFAULT_AMBASSADORS;

  // Merged dynamic content from Firestore document with fallbacks to static dataset
  const telemetry = ideaDoc?.telemetry && ideaDoc.telemetry.length > 0
    ? ideaDoc.telemetry
    : aicteIdeaLab.telemetry;

  const overview = {
    title: ideaDoc?.overview?.title || aicteIdeaLab.overview.title,
    paragraphs: ideaDoc?.overview?.paragraphs && ideaDoc.overview.paragraphs.length > 0
      ? ideaDoc.overview.paragraphs
      : aicteIdeaLab.overview.paragraphs,
  };

  const process = {
    title: ideaDoc?.process?.title || aicteIdeaLab.process.title,
    intro: ideaDoc?.process?.intro || aicteIdeaLab.process.intro,
    steps: ideaDoc?.process?.steps && ideaDoc.process.steps.length > 0
      ? ideaDoc.process.steps
      : aicteIdeaLab.process.steps,
  };

  const pillars = ideaDoc?.pillars && ideaDoc.pillars.length > 0
    ? ideaDoc.pillars
    : aicteIdeaLab.pillars;

  const teamInfo = {
    title: ideaDoc?.team?.title || aicteIdeaLab.team.title,
    intro: ideaDoc?.team?.intro || aicteIdeaLab.team.intro,
    contactNotice: ideaDoc?.team?.contactNotice || aicteIdeaLab.team.contactNotice,
  };

  const ambassadorsInfo = {
    title: ideaDoc?.ambassadors?.title || aicteIdeaLab.ambassadors.title,
    intro: ideaDoc?.ambassadors?.intro || aicteIdeaLab.ambassadors.intro,
    contactNotice: ideaDoc?.ambassadors?.contactNotice || aicteIdeaLab.ambassadors.contactNotice,
  };

  const facilitiesInfo = {
    title: ideaDoc?.facilities?.title || aicteIdeaLab.facilities.title,
    paragraphs: ideaDoc?.facilities?.paragraphs && ideaDoc.facilities.paragraphs.length > 0
      ? ideaDoc.facilities.paragraphs
      : aicteIdeaLab.facilities.paragraphs,
    defaultEquipment: ideaDoc?.facilities?.defaultEquipment && ideaDoc.facilities.defaultEquipment.length > 0
      ? ideaDoc.facilities.defaultEquipment
      : aicteIdeaLab.facilities.defaultEquipment,
  };

  const officialInfo = {
    title: ideaDoc?.officialInfo?.title || aicteIdeaLab.officialInfo.title,
    aqisId: ideaDoc?.officialInfo?.aqisId || aicteIdeaLab.officialInfo.aqisId,
    institution: ideaDoc?.officialInfo?.institution || aicteIdeaLab.officialInfo.institution,
    headOfInstitution: ideaDoc?.officialInfo?.headOfInstitution || aicteIdeaLab.officialInfo.headOfInstitution,
    facultyCoordinators: ideaDoc?.officialInfo?.facultyCoordinators && ideaDoc.officialInfo.facultyCoordinators.length > 0
      ? ideaDoc.officialInfo.facultyCoordinators
      : aicteIdeaLab.officialInfo.facultyCoordinators,
    email: ideaDoc?.officialInfo?.email || aicteIdeaLab.officialInfo.email,
  };

  const additionalSections = ideaDoc?.additionalSections || [];
  const adminTabs = item?.tabs || [];

  const [activeTabId, setActiveTabId] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      const hash = window.location.hash.replace('#', '');
      if (hash) {
        return hash;
      }
    }
    return 'overview';
  });

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '');
      if (hash) {
        setActiveTabId(hash);
      }
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const selectTab = (id: string) => {
    setActiveTabId(id);
    window.location.hash = id;
  };

  return (
    <div className="idealab-page-container" id="idealab-main">
      {/* IDEA Lab Telemetry Banner */}
      <section className="idealab-telemetry-strip">
        <div className="idealab-telemetry-grid">
          {telemetry.map((stat, idx) => {
            const Icon = TELEMETRY_ICONS[idx % TELEMETRY_ICONS.length] || Award;
            return (
              <div key={idx} className="idealab-telemetry-card">
                <div className="idealab-telemetry-icon-box">
                  <Icon className="idealab-telemetry-icon" />
                </div>
                <div className="idealab-telemetry-info">
                  <span className="idealab-telemetry-val">{stat.value}</span>
                  <span className="idealab-telemetry-lbl">{stat.label}</span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Main Grid with Content Pane + Dynamic Quick Navigation Sidebar */}
      <div className="idealab-main-layout">
        {/* Left Content Area */}
        <div className="idealab-content-area">
          {/* Tab 1: From Idea to Prototype & Workflow */}
          {activeTabId === 'overview' && (
            <div className="idealab-tab-pane animate-fade-in">
              <div className="idealab-card">
                <div className="idealab-badge">
                  <Lightbulb size={14} /> AICTE IDEA Lab
                </div>
                <h2 className="idealab-card-title">{overview.title}</h2>
                <div className="idealab-paragraphs">
                  {overview.paragraphs.map((p, idx) => (
                    <p key={idx} className="idealab-lead-text">{renderBold(p)}</p>
                  ))}
                </div>

                {/* Process Section: Learn. Build. Test. Improve. */}
                <div className="idealab-process-section">
                  <div className="idealab-badge gold">
                    <Workflow size={14} /> Innovation Process
                  </div>
                  <h3 className="idealab-subcard-title">{process.title}</h3>
                  <p className="idealab-lead-text" style={{ marginBottom: '0.75rem' }}>
                    {renderBold(process.intro)}
                  </p>

                  <div className="idealab-process-grid">
                    {process.steps.map((step) => (
                      <div key={step.number} className="idealab-process-card">
                        <div className="idealab-process-card-header">
                          <span className="idealab-process-num">{step.number}</span>
                          <Sparkles size={16} color="#C9973A" />
                        </div>
                        <h4 className="idealab-process-title">{step.title}</h4>
                        <p className="idealab-process-desc">{renderBold(step.description)}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Tab 2: Vision & Academic Pillars */}
          {activeTabId === 'vision' && (
            <div className="idealab-tab-pane animate-fade-in">
              <div className="idealab-card">
                <div className="idealab-badge gold">
                  <Compass size={14} /> Vision & Philosophy
                </div>
                <h2 className="idealab-card-title">Vision & Academic Pillars</h2>
                <div className="idealab-vision-grid">
                  {pillars.map((pillar) => (
                    <div key={pillar.number} className="idealab-vision-pillar-card">
                      <div className="idealab-pillar-header">
                        <span className="idealab-pillar-num">{pillar.number}</span>
                        <Sparkles size={16} color="#0B1E42" />
                      </div>
                      <h3 className="idealab-pillar-title">{pillar.title}</h3>
                      <p className="idealab-pillar-text">{renderBold(pillar.description)}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Tab 3: People Behind the IDEA Lab */}
          {activeTabId === 'team' && (
            <div className="idealab-tab-pane animate-fade-in">
              <div className="idealab-card">
                <div className="idealab-badge">
                  <Users size={14} /> Leadership & Mentorship
                </div>
                <h2 className="idealab-card-title">{teamInfo.title}</h2>
                <p className="idealab-lead-text" style={{ marginBottom: '1.25rem' }}>
                  {renderBold(teamInfo.intro)}
                </p>

                <div className="idealab-table-responsive">
                  <table className="idealab-table">
                    <thead>
                      <tr>
                        <th>S.No</th>
                        <th>Name of Faculty</th>
                        <th>Designation</th>
                        <th>Role</th>
                      </tr>
                    </thead>
                    <tbody>
                      {team.map((m, i) => (
                        <tr key={m.id}>
                          <td className="idealab-td-num">{i + 1}</td>
                          <td className="idealab-td-name">{m.name}</td>
                          <td>{m.designation}</td>
                          <td><span className="idealab-role-chip">{m.role}</span></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="idealab-notice-card">
                  <Mail size={16} color="#C9973A" />
                  <span>
                    Official Coordinator Contact: <a href={`mailto:${officialInfo.email}`}>{officialInfo.email}</a>
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Tab 4: Student Ambassadors */}
          {activeTabId === 'ambassadors' && (
            <div className="idealab-tab-pane animate-fade-in">
              <div className="idealab-card">
                <div className="idealab-badge gold">
                  <GraduationCap size={14} /> Student Leadership
                </div>
                <h2 className="idealab-card-title">{ambassadorsInfo.title}</h2>
                <p className="idealab-lead-text" style={{ marginBottom: '1.25rem' }}>
                  {renderBold(ambassadorsInfo.intro)}
                </p>

                <div className="idealab-table-responsive">
                  <table className="idealab-table">
                    <thead>
                      <tr>
                        <th>S.No</th>
                        <th>Reg. Number</th>
                        <th>Name of Student</th>
                        <th>Year & Branch</th>
                      </tr>
                    </thead>
                    <tbody>
                      {ambassadors.map((a, i) => (
                        <tr key={a.id}>
                          <td className="idealab-td-num">{i + 1}</td>
                          <td className="idealab-td-reg">{a.regNumber}</td>
                          <td className="idealab-td-name">{a.name}</td>
                          <td>{a.year} - {a.branch}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="idealab-notice-card">
                  <ShieldCheck size={16} color="#C9973A" />
                  <span>
                    {ambassadorsInfo.contactNotice}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Tab 5: Facilities for Making & Prototyping */}
          {activeTabId === 'facilities' && (
            <div className="idealab-tab-pane animate-fade-in">
              <div className="idealab-card">
                <div className="idealab-badge">
                  <Building2 size={14} /> Infrastructure & Workstations
                </div>
                <h2 className="idealab-card-title">{facilitiesInfo.title}</h2>
                <div className="idealab-paragraphs">
                  {facilitiesInfo.paragraphs.map((p, idx) => (
                    <p key={idx} className="idealab-lead-text">{renderBold(p)}</p>
                  ))}
                </div>

                {/* Confirmed Equipment Gallery with Labels */}
                <div className="idealab-facilities-grid">
                  {(facilityPhotos.length > 0
                    ? facilityPhotos
                    : facilitiesInfo.defaultEquipment.map((eq) => ({
                        id: eq.id,
                        imageUrl: PHOTO_NEEDED_PLACEHOLDER,
                        caption: eq.title,
                        category: eq.category,
                      }))
                  ).map((photo, idx) => {
                    const fallbackEq = facilitiesInfo.defaultEquipment[idx % Math.max(1, facilitiesInfo.defaultEquipment.length)];
                    const label = photo.caption || fallbackEq?.title || 'Advanced Prototyping Equipment';
                    const category = ('category' in photo && typeof photo.category === 'string' ? photo.category : null) || fallbackEq?.category || 'IDEA Lab Workstation';

                    return (
                      <div key={photo.id} className="idealab-facility-card">
                        <div className="idealab-facility-img-wrap">
                          <img src={photo.imageUrl} alt={label} loading="lazy" />
                        </div>
                        <div className="idealab-facility-info">
                          <span className="idealab-facility-category">{category}</span>
                          <h4 className="idealab-facility-title">{label}</h4>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* Tab 6: Official IDEA Lab Information */}
          {activeTabId === 'official-info' && (
            <div className="idealab-tab-pane animate-fade-in">
              <div className="idealab-card">
                <div className="idealab-badge gold">
                  <FileCheck size={14} /> Official Roster & Registry
                </div>
                <h2 className="idealab-card-title">{officialInfo.title}</h2>
                <div className="idealab-official-grid">
                  <div className="idealab-official-box">
                    <span className="idealab-official-label">AQIS Application ID</span>
                    <span className="idealab-official-val" style={{ fontFamily: 'monospace', fontSize: '1.05rem', color: '#C9973A' }}>
                      {officialInfo.aqisId}
                    </span>
                  </div>

                  <div className="idealab-official-box">
                    <span className="idealab-official-label">Head of Institution</span>
                    <span className="idealab-official-val">{officialInfo.headOfInstitution}</span>
                  </div>

                  <div className="idealab-official-box" style={{ gridColumn: '1 / -1' }}>
                    <span className="idealab-official-label">Institution</span>
                    <span className="idealab-official-val">{officialInfo.institution}</span>
                  </div>

                  <div className="idealab-official-box" style={{ gridColumn: '1 / -1' }}>
                    <span className="idealab-official-label">Faculty Coordinators</span>
                    <div className="idealab-official-val-list">
                      {officialInfo.facultyCoordinators.map((coord, idx) => (
                        <span key={idx} className="idealab-official-val">• {renderBold(coord)}</span>
                      ))}
                    </div>
                  </div>

                  <div className="idealab-official-box" style={{ gridColumn: '1 / -1' }}>
                    <span className="idealab-official-label">Official Contact Email</span>
                    <span className="idealab-official-val">
                      <a href={`mailto:${officialInfo.email}`} style={{ color: '#0B1E42', textDecoration: 'underline' }}>
                        {officialInfo.email}
                      </a>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Render Additional Custom Sections from Content Admin */}
          {additionalSections.map((sec) => {
            if (activeTabId !== sec.id) return null;
            return (
              <div key={sec.id} className="idealab-tab-pane animate-fade-in">
                <div className="idealab-card">
                  {sec.badge && (
                    <div className="idealab-badge gold">
                      <Sparkles size={14} /> {sec.badge}
                    </div>
                  )}
                  <h2 className="idealab-card-title">{sec.title}</h2>
                  {sec.paragraphs && sec.paragraphs.length > 0 && (
                    <div className="idealab-paragraphs">
                      {sec.paragraphs.map((p, idx) => (
                        <p key={idx} className="idealab-lead-text">{renderBold(p)}</p>
                      ))}
                    </div>
                  )}
                  {sec.bulletPoints && sec.bulletPoints.length > 0 && (
                    <div className="idealab-vision-grid" style={{ marginTop: '1.25rem' }}>
                      {sec.bulletPoints.map((pt, idx) => (
                        <div key={idx} className="idealab-vision-pillar-card">
                          <div className="idealab-pillar-header">
                            <span className="idealab-pillar-num">{idx < 9 ? `0${idx + 1}` : `${idx + 1}`}</span>
                            <Sparkles size={16} color="#0B1E42" />
                          </div>
                          <p className="idealab-pillar-text">{renderBold(pt)}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {/* Render Dynamic Admin Tabs (if selected) */}
          {adminTabs.map((tab) => {
            if (activeTabId !== tab.id) return null;
            return (
              <div key={tab.id} className="idealab-tab-pane animate-fade-in">
                <div className="idealab-card">
                  <h2 className="idealab-card-title">{tab.label}</h2>
                  {tab.sectionsDisplay === 'pills' ? (
                    <CustomSectionsPills sections={tab.sections} />
                  ) : (
                    <CustomSectionsPlain sections={tab.sections} />
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Sidebar: Dynamic Quick Navigation Card */}
        <aside className="idealab-sidebar">
          <div className="idealab-quick-nav-card">
            <div className="idealab-quick-nav-header">
              <div className="idealab-quick-nav-icon">
                <Layers size={16} />
              </div>
              <div>
                <h3 className="idealab-quick-nav-title">Quick Navigation</h3>
                <span className="idealab-quick-nav-subtitle">
                  {6 + additionalSections.length + adminTabs.length} Sections Available
                </span>
              </div>
            </div>

            <ul className="idealab-quick-nav-list">
              <li className="idealab-quick-nav-item">
                <button
                  type="button"
                  onClick={() => selectTab('overview')}
                  className={`idealab-quick-nav-btn ${activeTabId === 'overview' ? 'is-active' : ''}`}
                >
                  <span>{overview.title}</span>
                  <ChevronRight size={14} className="idealab-quick-nav-arrow" />
                </button>
              </li>

              <li className="idealab-quick-nav-item">
                <button
                  type="button"
                  onClick={() => selectTab('vision')}
                  className={`idealab-quick-nav-btn ${activeTabId === 'vision' ? 'is-active' : ''}`}
                >
                  <span>Vision & Academic Pillars</span>
                  <ChevronRight size={14} className="idealab-quick-nav-arrow" />
                </button>
              </li>

              <li className="idealab-quick-nav-item">
                <button
                  type="button"
                  onClick={() => selectTab('team')}
                  className={`idealab-quick-nav-btn ${activeTabId === 'team' ? 'is-active' : ''}`}
                >
                  <span>{teamInfo.title}</span>
                  <ChevronRight size={14} className="idealab-quick-nav-arrow" />
                </button>
              </li>

              <li className="idealab-quick-nav-item">
                <button
                  type="button"
                  onClick={() => selectTab('ambassadors')}
                  className={`idealab-quick-nav-btn ${activeTabId === 'ambassadors' ? 'is-active' : ''}`}
                >
                  <span>{ambassadorsInfo.title}</span>
                  <ChevronRight size={14} className="idealab-quick-nav-arrow" />
                </button>
              </li>

              <li className="idealab-quick-nav-item">
                <button
                  type="button"
                  onClick={() => selectTab('facilities')}
                  className={`idealab-quick-nav-btn ${activeTabId === 'facilities' ? 'is-active' : ''}`}
                >
                  <span>{facilitiesInfo.title}</span>
                  <ChevronRight size={14} className="idealab-quick-nav-arrow" />
                </button>
              </li>

              <li className="idealab-quick-nav-item">
                <button
                  type="button"
                  onClick={() => selectTab('official-info')}
                  className={`idealab-quick-nav-btn ${activeTabId === 'official-info' ? 'is-active' : ''}`}
                >
                  <span>{officialInfo.title}</span>
                  <ChevronRight size={14} className="idealab-quick-nav-arrow" />
                </button>
              </li>

              {/* Custom Additional Sections from Content Admin */}
              {additionalSections.map((sec) => (
                <li key={sec.id} className="idealab-quick-nav-item">
                  <button
                    type="button"
                    onClick={() => selectTab(sec.id)}
                    className={`idealab-quick-nav-btn ${activeTabId === sec.id ? 'is-active' : ''}`}
                  >
                    <span>{sec.title}</span>
                    <ChevronRight size={14} className="idealab-quick-nav-arrow" />
                  </button>
                </li>
              ))}

              {/* Dynamic Admin-Defined Tabs in Quick Navigation */}
              {adminTabs.map((tab) => (
                <li key={tab.id} className="idealab-quick-nav-item">
                  <button
                    type="button"
                    onClick={() => selectTab(tab.id)}
                    className={`idealab-quick-nav-btn ${activeTabId === tab.id ? 'is-active' : ''}`}
                  >
                    <span>{tab.label}</span>
                    <ChevronRight size={14} className="idealab-quick-nav-arrow" />
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </aside>
      </div>

      {/* Dynamic custom sections */}
      <CustomSectionsGalleries sections={sections} />
      <CustomSectionsAccordion sections={sections} />
    </div>
  );
}
