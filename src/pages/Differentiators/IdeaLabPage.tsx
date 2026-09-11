import { useState } from 'react';
import {
  Lightbulb,
  Layers,
  Award,
  Users,
  Compass,
  CheckCircle2,
  GraduationCap,
  ChevronRight,
  Building2,
  FileCheck,
  Wrench,
  Leaf,
  Mail,
} from 'lucide-react';
import { aicteIdeaLab } from './aicteIdeaLab.data';
import type { DifferentiatorItemDoc } from '../Admin/sections/DifferentiatorsAdmin';
import type { CustomSection } from '../../lib/customSections';
import { useOrderedCollection, type WithId } from '../../hooks/useCollection';
import type { AicteIdeaLabTeamMemberDoc } from '../Admin/sections/AicteIdeaLabTeamAdmin';
import type { AicteIdeaLabAmbassadorDoc } from '../Admin/sections/AicteIdeaLabAmbassadorsAdmin';
import { CustomSectionsPlain, CustomSectionsPills } from '../../components/CustomSectionsRenderer/CustomSectionsRenderer';
import { PHOTO_NEEDED_PLACEHOLDER } from '../../lib/photoPlaceholder';
import './IdeaLabPage.css';

interface IdeaLabPageProps {
  item?: DifferentiatorItemDoc;
  sections?: CustomSection[];
}

export default function IdeaLabPage({ item }: IdeaLabPageProps) {
  const { docs: team } = useOrderedCollection<AicteIdeaLabTeamMemberDoc>('aicteIdeaLabTeam', 'order');
  const { docs: ambassadors } = useOrderedCollection<AicteIdeaLabAmbassadorDoc>('aicteIdeaLabAmbassadors', 'order');
  const { docs: facilityPhotos } = useOrderedCollection<WithId & { imageUrl: string }>('aicteIdeaLabFacilityPhotos', 'order');

  const adminTabs = item?.tabs || [];
  const [activeTabId, setActiveTabId] = useState<string>('overview');

  const idea = aicteIdeaLab;

  return (
    <div className="idealab-page-container">
      {/* IDEA Lab Telemetry Banner */}
      <section className="idealab-telemetry-strip">
        <div className="idealab-telemetry-grid">
          <div className="idealab-telemetry-card">
            <div className="idealab-telemetry-icon-box">
              <Award className="idealab-telemetry-icon" />
            </div>
            <div className="idealab-telemetry-info">
              <span className="idealab-telemetry-val">IDEA202000128</span>
              <span className="idealab-telemetry-lbl">AQIS Application ID</span>
            </div>
          </div>

          <div className="idealab-telemetry-card">
            <div className="idealab-telemetry-icon-box">
              <Lightbulb className="idealab-telemetry-icon" />
            </div>
            <div className="idealab-telemetry-info">
              <span className="idealab-telemetry-val">AICTE CoE</span>
              <span className="idealab-telemetry-lbl">Approved IDEA Lab</span>
            </div>
          </div>

          <div className="idealab-telemetry-card">
            <div className="idealab-telemetry-icon-box">
              <Wrench className="idealab-telemetry-icon" />
            </div>
            <div className="idealab-telemetry-info">
              <span className="idealab-telemetry-val">Prototype CoE</span>
              <span className="idealab-telemetry-lbl">Learn While Make</span>
            </div>
          </div>

          <div className="idealab-telemetry-card">
            <div className="idealab-telemetry-icon-box">
              <Leaf className="idealab-telemetry-icon" />
            </div>
            <div className="idealab-telemetry-info">
              <span className="idealab-telemetry-val">Green R&D</span>
              <span className="idealab-telemetry-lbl">Eco-Friendly Initiatives</span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Grid with Content Pane + Dynamic Quick Navigation Sidebar */}
      <div className="idealab-main-layout">
        {/* Left Content Area */}
        <div className="idealab-content-area">
          {/* Tab: Overview & AQIS Details */}
          {activeTabId === 'overview' && (
            <div className="idealab-tab-pane animate-fade-in">
              <div className="idealab-card">
                <div className="idealab-badge">
                  <Lightbulb size={14} /> AICTE IDEA Lab
                </div>
                <h2 className="idealab-card-title">{idea.tagline}</h2>
                <div className="idealab-paragraphs">
                  {idea.paragraphs.map((p, idx) => (
                    <p key={idx} className="idealab-lead-text">{p}</p>
                  ))}
                </div>
              </div>

              {/* AQIS Institutional Details Card */}
              <div className="idealab-card idealab-aqis-card">
                <div className="idealab-badge gold">
                  <FileCheck size={14} /> Official AQIS Roster
                </div>
                <h3 className="idealab-subcard-title">Key Institutional Roster & Coordinators</h3>
                <div className="idealab-aqis-grid">
                  {idea.fields.map((f, idx) => (
                    <div key={idx} className="idealab-aqis-field-box">
                      <span className="idealab-aqis-field-label">{f.label}</span>
                      <div className="idealab-aqis-field-values">
                        {f.value.map((v, vIdx) => (
                          <span key={vIdx} className="idealab-aqis-field-val">{v}</span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Tab: Vision & Mission */}
          {activeTabId === 'vision' && (
            <div className="idealab-tab-pane animate-fade-in">
              <div className="idealab-card">
                <div className="idealab-badge gold">
                  <Compass size={14} /> Vision & Philosophy
                </div>
                <h2 className="idealab-card-title">Core Vision & Pillars of IDEA Lab</h2>
                <div className="idealab-vision-grid">
                  {idea.vision.map((vItem, idx) => (
                    <div key={idx} className="idealab-vision-pillar-card">
                      <div className="idealab-pillar-num">0{idx + 1}</div>
                      <div className="idealab-pillar-body">
                        <CheckCircle2 size={18} className="idealab-pillar-check" />
                        <p className="idealab-pillar-text">{vItem}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Tab: Team Roster */}
          {activeTabId === 'team' && (
            <div className="idealab-tab-pane animate-fade-in">
              <div className="idealab-card">
                <div className="idealab-badge">
                  <Users size={14} /> Leadership Roster
                </div>
                <h2 className="idealab-card-title">VWU AICTE IDEA LAB Team</h2>
                {team.length === 0 ? (
                  <p className="idealab-empty-msg">Team content is coming soon.</p>
                ) : (
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
                )}
              </div>
            </div>
          )}

          {/* Tab: Student Ambassadors */}
          {activeTabId === 'ambassadors' && (
            <div className="idealab-tab-pane animate-fade-in">
              <div className="idealab-card">
                <div className="idealab-badge gold">
                  <GraduationCap size={14} /> Student Leadership
                </div>
                <h2 className="idealab-card-title">Student Ambassadors</h2>
                {ambassadors.length === 0 ? (
                  <p className="idealab-empty-msg">Student Ambassadors content is coming soon.</p>
                ) : (
                  <div className="idealab-table-responsive">
                    <table className="idealab-table">
                      <thead>
                        <tr>
                          <th>S.No</th>
                          <th>Reg. Number</th>
                          <th>Name of Student</th>
                          <th>Year & Branch</th>
                          <th>WhatsApp</th>
                          <th>Email</th>
                        </tr>
                      </thead>
                      <tbody>
                        {ambassadors.map((a, i) => (
                          <tr key={a.id}>
                            <td className="idealab-td-num">{i + 1}</td>
                            <td className="idealab-td-reg">{a.regNumber}</td>
                            <td className="idealab-td-name">{a.name}</td>
                            <td>{a.year} - {a.branch}</td>
                            <td>{a.whatsapp}</td>
                            <td>
                              <a href={`mailto:${a.email}`} className="idealab-mail-link">
                                <Mail size={13} /> {a.email}
                              </a>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Tab: Facilities */}
          {activeTabId === 'facilities' && (
            <div className="idealab-tab-pane animate-fade-in">
              <div className="idealab-card">
                <div className="idealab-badge">
                  <Building2 size={14} /> Infrastructure
                </div>
                <h2 className="idealab-card-title">Facilities Available in AICTE – IDEA LAB</h2>
                <div className="idealab-facilities-masonry">
                  {(facilityPhotos.length > 0
                    ? facilityPhotos
                    : Array.from({ length: 6 }, (_, i) => ({ id: `ph-${i}`, imageUrl: PHOTO_NEEDED_PLACEHOLDER }))
                  ).map((photo) => (
                    <div key={photo.id} className="idealab-facility-item">
                      <img src={photo.imageUrl} alt="AICTE IDEA Lab facility" loading="lazy" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

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
                  {5 + adminTabs.length} Sections Available
                </span>
              </div>
            </div>

            <ul className="idealab-quick-nav-list">
              <li className="idealab-quick-nav-item">
                <button
                  type="button"
                  onClick={() => setActiveTabId('overview')}
                  className={`idealab-quick-nav-btn ${activeTabId === 'overview' ? 'is-active' : ''}`}
                >
                  <span>About IDEA Lab & AQIS</span>
                  <ChevronRight size={14} className="idealab-quick-nav-arrow" />
                </button>
              </li>

              <li className="idealab-quick-nav-item">
                <button
                  type="button"
                  onClick={() => setActiveTabId('vision')}
                  className={`idealab-quick-nav-btn ${activeTabId === 'vision' ? 'is-active' : ''}`}
                >
                  <span>Vision & Philosophy</span>
                  <ChevronRight size={14} className="idealab-quick-nav-arrow" />
                </button>
              </li>

              <li className="idealab-quick-nav-item">
                <button
                  type="button"
                  onClick={() => setActiveTabId('team')}
                  className={`idealab-quick-nav-btn ${activeTabId === 'team' ? 'is-active' : ''}`}
                >
                  <span>VWU IDEA Lab Team</span>
                  <ChevronRight size={14} className="idealab-quick-nav-arrow" />
                </button>
              </li>

              <li className="idealab-quick-nav-item">
                <button
                  type="button"
                  onClick={() => setActiveTabId('ambassadors')}
                  className={`idealab-quick-nav-btn ${activeTabId === 'ambassadors' ? 'is-active' : ''}`}
                >
                  <span>Student Ambassadors</span>
                  <ChevronRight size={14} className="idealab-quick-nav-arrow" />
                </button>
              </li>

              <li className="idealab-quick-nav-item">
                <button
                  type="button"
                  onClick={() => setActiveTabId('facilities')}
                  className={`idealab-quick-nav-btn ${activeTabId === 'facilities' ? 'is-active' : ''}`}
                >
                  <span>Facilities & Infrastructure</span>
                  <ChevronRight size={14} className="idealab-quick-nav-arrow" />
                </button>
              </li>

              {/* Dynamic Admin-Defined Tabs in Quick Navigation */}
              {adminTabs.map((tab) => (
                <li key={tab.id} className="idealab-quick-nav-item">
                  <button
                    type="button"
                    onClick={() => setActiveTabId(tab.id)}
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
    </div>
  );
}
