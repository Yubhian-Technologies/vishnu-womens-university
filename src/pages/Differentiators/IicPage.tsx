import { useState } from 'react';
import {
  Sparkles,
  Star,
  Award,
  Calendar,
  Building2,
  Users,
  Compass,
  Target,
  Rocket,
  FileText,
  Download,
  ChevronRight,
  School,
  Mail,
  Phone,
  CheckCircle2,
  Layers,
  MapPin,
  FileCheck,
} from 'lucide-react';
import { institutionInnovationCell } from './institutionInnovationCell.data';
import type { DifferentiatorItemDoc } from '../Admin/sections/DifferentiatorsAdmin';
import type { CustomSection } from '../../lib/customSections';
import { useOrderedCollection, type WithId } from '../../hooks/useCollection';
import { CustomSectionsPlain, CustomSectionsPills } from '../../components/CustomSectionsRenderer/CustomSectionsRenderer';
import { PHOTO_NEEDED_PLACEHOLDER } from '../../lib/photoPlaceholder';
import './IicPage.css';

interface IicDocEntryDoc extends WithId {
  label: string;
  fileUrl: string;
  order: number;
}

interface IicCouncilMemberDoc extends WithId {
  name: string;
  role: string;
  tier: 'chairman' | 'leadership' | 'coordinator';
  imageUrl: string;
  order: number;
}

interface IicPageProps {
  item?: DifferentiatorItemDoc;
  sections?: CustomSection[];
}

export default function IicPage({ item }: IicPageProps) {
  const iic = institutionInnovationCell;
  const adminTabs = item?.tabs || [];

  const { docs: councilMembers } = useOrderedCollection<IicCouncilMemberDoc>('iicCouncilMembers', 'order');
  const { docs: councilMembersLinks } = useOrderedCollection<IicDocEntryDoc>('iicCouncilMembersLinks', 'order');
  const { docs: innovationAmbassadorLinks } = useOrderedCollection<IicDocEntryDoc>('iicInnovationAmbassadorLinks', 'order');
  const { docs: iicActivityYears } = useOrderedCollection<IicDocEntryDoc>('iicActivities', 'order');
  const { docs: ratingCertificates } = useOrderedCollection<IicDocEntryDoc>('iicRatingCertificates', 'order');
  const { docs: annualReports } = useOrderedCollection<IicDocEntryDoc>('iicAnnualReports', 'order');
  const { docs: sihHackathonReports } = useOrderedCollection<IicDocEntryDoc>('iicSihHackathonReports', 'order');
  const { docs: nispPolicies } = useOrderedCollection<IicDocEntryDoc>('iicNispPolicies', 'order');

  const [activeTabId, setActiveTabId] = useState<string>('about');

  const renderDocumentList = (docs: IicDocEntryDoc[], emptyMsg: string = 'Content for this section is coming soon.') => {
    if (docs.length === 0) {
      return <p className="iic-empty-msg">{emptyMsg}</p>;
    }
    return (
      <div className="iic-docs-grid">
        {docs.map((d) => (
          <a key={d.id} href={d.fileUrl} download className="iic-doc-card">
            <div className="iic-doc-icon-box">
              <FileText size={20} />
            </div>
            <div className="iic-doc-info">
              <span className="iic-doc-label">{d.label}</span>
              <span className="iic-doc-action">
                Download PDF <Download size={13} />
              </span>
            </div>
          </a>
        ))}
      </div>
    );
  };

  return (
    <div className="iic-page-container">
      {/* MoE's Innovation Cell Telemetry Strip */}
      <section className="iic-telemetry-strip">
        <div className="iic-telemetry-grid">
          <div className="iic-telemetry-card">
            <div className="iic-telemetry-icon-box gold">
              <Star className="iic-telemetry-icon" />
            </div>
            <div className="iic-telemetry-info">
              <span className="iic-telemetry-val">4 / 5 Stars</span>
              <span className="iic-telemetry-lbl">IIC 5.0 Rating</span>
            </div>
          </div>

          <div className="iic-telemetry-card">
            <div className="iic-telemetry-icon-box cyan">
              <Award className="iic-telemetry-icon" />
            </div>
            <div className="iic-telemetry-info">
              <span className="iic-telemetry-val">Rank 151–300</span>
              <span className="iic-telemetry-lbl">NIRF Innovation 2023</span>
            </div>
          </div>

          <div className="iic-telemetry-card">
            <div className="iic-telemetry-icon-box green">
              <Calendar className="iic-telemetry-icon" />
            </div>
            <div className="iic-telemetry-info">
              <span className="iic-telemetry-val">A.Y: 2018–2019</span>
              <span className="iic-telemetry-lbl">Registration Year</span>
            </div>
          </div>

          <div className="iic-telemetry-card">
            <div className="iic-telemetry-icon-box purple">
              <Building2 className="iic-telemetry-icon" />
            </div>
            <div className="iic-telemetry-info">
              <span className="iic-telemetry-val">VISHVA TBI</span>
              <span className="iic-telemetry-lbl">NIDHI TBI Ecosystem</span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Container with Sidebar Navigation + Content Pane */}
      <div className="iic-main-layout">
        {/* Left Content Area */}
        <div className="iic-content-area">
          {/* Tab: About IIC & Journey */}
          {activeTabId === 'about' && (
            <div className="iic-tab-pane animate-fade-in">
              <div className="iic-card">
                <div className="iic-badge">
                  <Sparkles size={14} /> MoE Innovation Cell
                </div>
                <h2 className="iic-card-title">Institution's Innovation Council (IIC)</h2>
                <p className="iic-lead-text">{iic.about}</p>
              </div>

              {/* Journey Card */}
              <div className="iic-card iic-journey-card">
                <div className="iic-badge gold">
                  <Rocket size={14} /> Establishment Journey
                </div>
                <h3 className="iic-subcard-title">{iic.journeyTitle}</h3>
                <p className="iic-lead-text">{iic.journey}</p>
              </div>

              {/* Vision & Mission Grid */}
              <div className="iic-vision-mission-grid">
                <div className="iic-card iic-vision-card">
                  <div className="iic-badge cyan">
                    <Compass size={14} /> Vision
                  </div>
                  <h3 className="iic-subcard-title">Our Vision</h3>
                  <ul className="iic-checklist">
                    {iic.vision.map((v, i) => (
                      <li key={i}>
                        <CheckCircle2 size={16} className="iic-check-icon cyan" />
                        <span>{v}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="iic-card iic-mission-card">
                  <div className="iic-badge gold">
                    <Target size={14} /> Mission
                  </div>
                  <h3 className="iic-subcard-title">Our Mission</h3>
                  <ul className="iic-checklist">
                    {iic.mission.map((m, i) => (
                      <li key={i}>
                        <CheckCircle2 size={16} className="iic-check-icon gold" />
                        <span>{m}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* Tab: IIC – Constitution */}
          {activeTabId === 'constitution' && (
            <div className="iic-tab-pane animate-fade-in">
              <div className="iic-card">
                <div className="iic-badge">
                  <Users size={14} /> Council Roster
                </div>
                <h2 className="iic-card-title">IIC – Constitution</h2>
                <p className="iic-lead-text">{iic.constitution.intro}</p>
                <h3 className="iic-subcard-title" style={{ marginTop: '1.5rem' }}>{iic.constitution.heading}</h3>

                {/* Firestore Council Roster (if any) or Fallback Roster */}
                {councilMembers.length > 0 ? (
                  <div className="iic-council-roster-grid">
                    {councilMembers.map((m) => (
                      <div key={m.id} className="iic-council-card">
                        <img
                          src={m.imageUrl || PHOTO_NEEDED_PLACEHOLDER}
                          alt={m.name}
                          className="iic-council-avatar"
                        />
                        <span className="iic-council-name">{m.name}</span>
                        <span className="iic-council-role">{m.role}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="iic-constitution-fallback-roster">
                    <div className="iic-council-tier-block">
                      <span className="iic-tier-label">Chairman</span>
                      <div className="iic-member-pill chairman">
                        <strong>{iic.constitution.chairman.name}</strong> — {iic.constitution.chairman.role}
                      </div>
                    </div>

                    <div className="iic-council-tier-block">
                      <span className="iic-tier-label">Leadership</span>
                      <div className="iic-pills-row">
                        {iic.constitution.leadership.map((mem, i) => (
                          <div key={i} className="iic-member-pill leadership">
                            <strong>{mem.name}</strong> — {mem.role}
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="iic-council-tier-block">
                      <span className="iic-tier-label">Key Coordinators</span>
                      <div className="iic-pills-row">
                        {iic.constitution.coordinators.map((mem, i) => (
                          <div key={i} className="iic-member-pill coordinator">
                            <strong>{mem.name}</strong> — {mem.role}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Official Council PDF Document Link */}
                {councilMembersLinks.length > 0 && (
                  <div className="iic-council-pdf-wrap">
                    <a href={councilMembersLinks[0].fileUrl} download className="iic-pdf-btn">
                      <FileText size={16} /> {councilMembersLinks[0].label} <Download size={14} />
                    </a>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Tab: Innovation Ambassadors */}
          {activeTabId === 'ambassadors' && (
            <div className="iic-tab-pane animate-fade-in">
              <div className="iic-card">
                <div className="iic-badge gold">
                  <Award size={14} /> MoE Innovation Ambassadors
                </div>
                <h2 className="iic-card-title">Innovation Ambassadors</h2>
                {renderDocumentList(innovationAmbassadorLinks, 'Innovation Ambassadors documents are coming soon.')}
              </div>
            </div>
          )}

          {/* Tab: IIC Activities */}
          {activeTabId === 'activities' && (
            <div className="iic-tab-pane animate-fade-in">
              <div className="iic-card">
                <div className="iic-badge">
                  <Calendar size={14} /> Ecosystem Initiatives
                </div>
                <h2 className="iic-card-title">IIC Activities</h2>
                <p className="iic-lead-text">{iic.activities.intro}</p>
                <h3 className="iic-subcard-title" style={{ marginTop: '1.5rem' }}>Activity Reports & Documentation</h3>
                {renderDocumentList(iicActivityYears, 'Activity reports are coming soon.')}
              </div>
            </div>
          )}

          {/* Tab: Rating Certificates */}
          {activeTabId === 'rating' && (
            <div className="iic-tab-pane animate-fade-in">
              <div className="iic-card">
                <div className="iic-badge gold">
                  <Star size={14} /> Recognition & Star Ratings
                </div>
                <h2 className="iic-card-title">Rating Certificates</h2>
                {renderDocumentList(ratingCertificates, 'Rating certificates are coming soon.')}
              </div>
            </div>
          )}

          {/* Tab: IIC Annual Reports */}
          {activeTabId === 'annual-reports' && (
            <div className="iic-tab-pane animate-fade-in">
              <div className="iic-card">
                <div className="iic-badge cyan">
                  <FileCheck size={14} /> Annual Documentation
                </div>
                <h2 className="iic-card-title">IIC Annual Reports</h2>
                {renderDocumentList(annualReports, 'IIC Annual Reports are coming soon.')}
              </div>
            </div>
          )}

          {/* Tab: SIH Internal Hackathon Reports */}
          {activeTabId === 'sih' && (
            <div className="iic-tab-pane animate-fade-in">
              <div className="iic-card">
                <div className="iic-badge">
                  <Rocket size={14} /> Smart India Hackathon
                </div>
                <h2 className="iic-card-title">SIH Internal Hackathon Reports</h2>
                {renderDocumentList(sihHackathonReports, 'SIH Internal Hackathon Reports are coming soon.')}
              </div>
            </div>
          )}

          {/* Tab: National Innovation Start-Up Policy (NISP) */}
          {activeTabId === 'nisp' && (
            <div className="iic-tab-pane animate-fade-in">
              <div className="iic-card">
                <div className="iic-badge gold">
                  <FileText size={14} /> Policy Framework
                </div>
                <h2 className="iic-card-title">{iic.nisp.heading}</h2>
                {nispPolicies.length === 0 ? (
                  <p className="iic-empty-msg">NISP Policy documents are coming soon.</p>
                ) : (
                  <div className="iic-nisp-table-wrap">
                    <table className="iic-nisp-table">
                      <thead>
                        <tr>
                          <th>Policy Document Name</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {nispPolicies.map((p) => (
                          <tr key={p.id}>
                            <td>{p.label}</td>
                            <td>
                              <a href={p.fileUrl} download className="iic-nisp-download-link">
                                Download Policy <Download size={13} />
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

          {/* Tab: Atal Tinkering Schools (ATL) */}
          {activeTabId === 'atl' && (
            <div className="iic-tab-pane animate-fade-in">
              <div className="iic-card">
                <div className="iic-badge cyan">
                  <School size={14} /> School Mentorship
                </div>
                <h2 className="iic-card-title">Atal Tinkering Labs (ATL) School Partnerships</h2>
                <p className="iic-lead-text">{iic.atalTinkeringSchools.intro}</p>
                <h3 className="iic-subcard-title" style={{ marginTop: '1.5rem' }}>{iic.atalTinkeringSchools.listHeading}</h3>
                <div className="iic-atl-schools-grid">
                  {iic.atalTinkeringSchools.schools.map((school) => (
                    <div key={school.sno} className="iic-school-card">
                      <div className="iic-school-header">
                        <span className="iic-school-code">ATL Code: {school.schoolCode}</span>
                        <h4 className="iic-school-name">{school.schoolName}</h4>
                      </div>
                      <div className="iic-school-body">
                        <p className="iic-school-address"><MapPin size={14} className="iic-school-icon" /> {school.address}</p>
                        <p className="iic-school-info"><Mail size={14} className="iic-school-icon" /> <a href={`mailto:${school.email}`}>{school.email}</a></p>
                        <p className="iic-school-info"><Phone size={14} className="iic-school-icon" /> <a href={`tel:${school.mobile}`}>{school.mobile}</a></p>
                        <div className="iic-school-coordinator-badge">
                          Mentor Coordinator: <strong>{school.coordinator}</strong>
                        </div>
                      </div>
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
              <div key={tab.id} className="iic-tab-pane animate-fade-in">
                <div className="iic-card">
                  <h2 className="iic-card-title">{tab.label}</h2>
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
        <aside className="iic-sidebar">
          <div className="iic-quick-nav-card">
            <div className="iic-quick-nav-header">
              <div className="iic-quick-nav-icon">
                <Layers size={16} />
              </div>
              <div>
                <h3 className="iic-quick-nav-title">Quick Navigation</h3>
                <span className="iic-quick-nav-subtitle">
                  {9 + adminTabs.length} Sections Available
                </span>
              </div>
            </div>

            <ul className="iic-quick-nav-list">
              <li className="iic-quick-nav-item">
                <button
                  type="button"
                  onClick={() => setActiveTabId('about')}
                  className={`iic-quick-nav-btn ${activeTabId === 'about' ? 'is-active' : ''}`}
                >
                  <span>About IIC & MoE Journey</span>
                  <ChevronRight size={14} className="iic-quick-nav-arrow" />
                </button>
              </li>

              <li className="iic-quick-nav-item">
                <button
                  type="button"
                  onClick={() => setActiveTabId('constitution')}
                  className={`iic-quick-nav-btn ${activeTabId === 'constitution' ? 'is-active' : ''}`}
                >
                  <span>IIC – Constitution</span>
                  <ChevronRight size={14} className="iic-quick-nav-arrow" />
                </button>
              </li>

              <li className="iic-quick-nav-item">
                <button
                  type="button"
                  onClick={() => setActiveTabId('ambassadors')}
                  className={`iic-quick-nav-btn ${activeTabId === 'ambassadors' ? 'is-active' : ''}`}
                >
                  <span>Innovation Ambassadors</span>
                  <ChevronRight size={14} className="iic-quick-nav-arrow" />
                </button>
              </li>

              <li className="iic-quick-nav-item">
                <button
                  type="button"
                  onClick={() => setActiveTabId('activities')}
                  className={`iic-quick-nav-btn ${activeTabId === 'activities' ? 'is-active' : ''}`}
                >
                  <span>IIC Activities</span>
                  <ChevronRight size={14} className="iic-quick-nav-arrow" />
                </button>
              </li>

              <li className="iic-quick-nav-item">
                <button
                  type="button"
                  onClick={() => setActiveTabId('rating')}
                  className={`iic-quick-nav-btn ${activeTabId === 'rating' ? 'is-active' : ''}`}
                >
                  <span>Rating Certificates</span>
                  <ChevronRight size={14} className="iic-quick-nav-arrow" />
                </button>
              </li>

              <li className="iic-quick-nav-item">
                <button
                  type="button"
                  onClick={() => setActiveTabId('annual-reports')}
                  className={`iic-quick-nav-btn ${activeTabId === 'annual-reports' ? 'is-active' : ''}`}
                >
                  <span>IIC Annual Reports</span>
                  <ChevronRight size={14} className="iic-quick-nav-arrow" />
                </button>
              </li>

              <li className="iic-quick-nav-item">
                <button
                  type="button"
                  onClick={() => setActiveTabId('sih')}
                  className={`iic-quick-nav-btn ${activeTabId === 'sih' ? 'is-active' : ''}`}
                >
                  <span>SIH Internal Hackathon</span>
                  <ChevronRight size={14} className="iic-quick-nav-arrow" />
                </button>
              </li>

              <li className="iic-quick-nav-item">
                <button
                  type="button"
                  onClick={() => setActiveTabId('nisp')}
                  className={`iic-quick-nav-btn ${activeTabId === 'nisp' ? 'is-active' : ''}`}
                >
                  <span>NISP Policy</span>
                  <ChevronRight size={14} className="iic-quick-nav-arrow" />
                </button>
              </li>

              <li className="iic-quick-nav-item">
                <button
                  type="button"
                  onClick={() => setActiveTabId('atl')}
                  className={`iic-quick-nav-btn ${activeTabId === 'atl' ? 'is-active' : ''}`}
                >
                  <span>ATL School Mentorship</span>
                  <ChevronRight size={14} className="iic-quick-nav-arrow" />
                </button>
              </li>

              {/* Dynamic Admin-Defined Tabs in Quick Navigation */}
              {adminTabs.map((tab) => (
                <li key={tab.id} className="iic-quick-nav-item">
                  <button
                    type="button"
                    onClick={() => setActiveTabId(tab.id)}
                    className={`iic-quick-nav-btn ${activeTabId === tab.id ? 'is-active' : ''}`}
                  >
                    <span>{tab.label}</span>
                    <ChevronRight size={14} className="iic-quick-nav-arrow" />
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
