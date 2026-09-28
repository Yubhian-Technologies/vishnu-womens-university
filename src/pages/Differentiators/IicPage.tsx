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
  Lightbulb,
  UserCheck,
  Trophy,
  Share2,
} from 'lucide-react';
import { institutionInnovationCell } from './institutionInnovationCell.data';
import type { DifferentiatorItemDoc } from '../Admin/sections/DifferentiatorsAdmin';
import { hasCustomSectionContent, type CustomSection } from '../../lib/customSections';
import type { CustomTab } from '../../lib/customTabs';
import { useOrderedCollection, type WithId } from '../../hooks/useCollection';
import { CustomSectionsPlain, CustomSectionsPills } from '../../components/CustomSectionsRenderer/CustomSectionsRenderer';
import { PHOTO_NEEDED_PLACEHOLDER } from '../../lib/photoPlaceholder';
import { renderBold } from '../../lib/boldText';
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

// The 9 sidebar tabs below are hardcoded (not admin-created rows), but each
// one is still tied to the admin's "Quick Navigation (Dynamic Tabs)" editor
// via these id/label aliases: an admin tab whose id or label (normalized)
// matches a key here has its Custom Sections rendered *inside* that
// hardcoded pane (see AdminTabExtraSections below) instead of getting its
// own separate Quick Navigation entry — that's what used to cause the
// duplicate "top" (hardcoded) + "bottom" (admin-tab) entries for the same
// section. Any admin tab that matches none of these still renders as its
// own dynamic tab, appended to the bottom of Quick Navigation as before.
type StaticTabKey = 'about' | 'constitution' | 'ambassadors' | 'activities' | 'rating' | 'annual-reports' | 'sih' | 'nisp' | 'atl';

const STATIC_TAB_ALIASES: Record<StaticTabKey, { ids: string[]; labels: string[] }> = {
  about: { ids: ['about'], labels: ['about iic', 'about iic & moe journey'] },
  constitution: { ids: ['constitution'], labels: ['iic council', 'iic – constitution', 'iic - constitution', 'constitution'] },
  ambassadors: { ids: ['ambassadors'], labels: ['innovation ambassadors'] },
  activities: { ids: ['activities'], labels: ['iic activities'] },
  rating: { ids: ['rating', 'rating-certificates'], labels: ['recognition & rating', 'rating certificates'] },
  'annual-reports': { ids: ['annual-reports', 'iic-annual-reports'], labels: ['iic annual reports'] },
  sih: { ids: ['sih', 'sih-hackathon-reports'], labels: ['smart india hackathon', 'sih internal hackathon reports', 'sih internal hackathon'] },
  nisp: { ids: ['nisp'], labels: ['nisp policy', 'national innovation start-up policy', 'national innovation and start-up policy (nisp)'] },
  atl: { ids: ['atl', 'atal-tinkering-schools'], labels: ['atl school mentorship', 'atal tinkering schools', 'atal tinkering labs (atl) school partnerships'] },
};

// Plain Levenshtein edit distance — used below to tolerate a small typo in
// an admin-typed tab label (found in practice: an admin saved a tab labeled
// "Innovation Ambassodors", one letter off from "Innovation Ambassadors",
// which an exact-match comparison silently failed to connect to the
// hardcoded "Innovation Ambassadors" pane).
function levenshteinDistance(a: string, b: string): number {
  const dp: number[][] = Array.from({ length: a.length + 1 }, () => new Array(b.length + 1).fill(0));
  for (let i = 0; i <= a.length; i++) dp[i][0] = i;
  for (let j = 0; j <= b.length; j++) dp[0][j] = j;
  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      dp[i][j] = a[i - 1] === b[j - 1]
        ? dp[i - 1][j - 1]
        : 1 + Math.min(dp[i - 1][j - 1], dp[i - 1][j], dp[i][j - 1]);
    }
  }
  return dp[a.length][b.length];
}

// Exact match, or close enough to count as the same label typed with a
// small typo (at most 2 edits, and never more than ~20% of the label's
// length, so two genuinely different short labels can't accidentally match).
function isCloseLabelMatch(a: string, b: string): boolean {
  if (a === b) return true;
  const distance = levenshteinDistance(a, b);
  return distance <= 2 && distance <= Math.ceil(Math.max(a.length, b.length) * 0.2);
}

function tabMatchesAliases(tab: CustomTab, aliases: { ids: string[]; labels: string[] }): boolean {
  const normId = (tab.id || '').trim().toLowerCase();
  const normLabel = (tab.label || '').trim().toLowerCase();
  if (aliases.ids.includes(normId) || aliases.labels.includes(normLabel)) return true;
  return aliases.labels.some((label) => isCloseLabelMatch(normLabel, label));
}

// Renders a matched admin tab's Custom Sections inline within a hardcoded
// pane — same CustomSectionsPlain/Pills machinery the bottom dynamic tabs
// already use, just placed inside the static pane instead of a standalone one.
function AdminTabExtraSections({ tab }: { tab?: CustomTab }) {
  if (!tab || !tab.sections.some(hasCustomSectionContent)) return null;
  return (
    <div className="iic-card" style={{ marginTop: '1.5rem' }}>
      {tab.sectionsDisplay === 'pills' ? (
        <CustomSectionsPills sections={tab.sections} />
      ) : (
        <CustomSectionsPlain sections={tab.sections} />
      )}
    </div>
  );
}

export default function IicPage({ item }: IicPageProps) {
  const iic = institutionInnovationCell;
  const rawAdminTabs = item?.tabs || [];
  const adminTabs = rawAdminTabs.filter((tab) => {
    return !Object.values(STATIC_TAB_ALIASES).some((aliases) => tabMatchesAliases(tab, aliases));
  });
  const findStaticTabMatch = (key: StaticTabKey): CustomTab | undefined =>
    rawAdminTabs.find((tab) => tabMatchesAliases(tab, STATIC_TAB_ALIASES[key]));

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

  const supportIcons = [Lightbulb, UserCheck, Trophy, Rocket, Share2];

  return (
    <div className="iic-page-container" id="iic-main">
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
              <span className="iic-telemetry-val">Rank Band 151–300</span>
              <span className="iic-telemetry-lbl">NIRF Innovation 2023</span>
            </div>
          </div>

          <div className="iic-telemetry-card">
            <div className="iic-telemetry-icon-box green">
              <Calendar className="iic-telemetry-icon" />
            </div>
            <div className="iic-telemetry-info">
              <span className="iic-telemetry-val">2018–2019</span>
              <span className="iic-telemetry-lbl">IIC Registration Year</span>
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
                <h2 className="iic-card-title">{iic.aboutTitle}</h2>
                {iic.about.map((paragraph, i) => (
                  <p key={i} className="iic-lead-text" style={{ marginBottom: i < iic.about.length - 1 ? '1rem' : 0 }}>
                    {renderBold(paragraph)}
                  </p>
                ))}
              </div>

              {/* Journey Card */}
              <div className="iic-card iic-journey-card">
                <div className="iic-badge gold">
                  <Rocket size={14} /> Establishment Journey
                </div>
                <h3 className="iic-subcard-title">{iic.journeyTitle}</h3>
                {iic.journey.map((p, i) => (
                  <p key={i} className="iic-lead-text" style={{ marginBottom: i < iic.journey.length - 1 ? '1rem' : 0 }}>
                    {renderBold(p)}
                  </p>
                ))}
              </div>

              {/* Vision & Mission Grid */}
              <div className="iic-vision-mission-grid">
                <div className="iic-card iic-vision-card">
                  <div className="iic-badge cyan">
                    <Compass size={14} /> Vision
                  </div>
                  <h3 className="iic-subcard-title">Vision</h3>
                  <ul className="iic-checklist">
                    {iic.vision.map((v, i) => (
                      <li key={i}>
                        <CheckCircle2 size={16} className="iic-check-icon cyan" />
                        <span>{renderBold(v)}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="iic-card iic-mission-card">
                  <div className="iic-badge gold">
                    <Target size={14} /> Mission
                  </div>
                  <h3 className="iic-subcard-title">Mission</h3>
                  <ul className="iic-checklist">
                    {iic.mission.map((m, i) => (
                      <li key={i}>
                        <CheckCircle2 size={16} className="iic-check-icon gold" />
                        <span>{renderBold(m)}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* How the IIC Supports Innovation Grid */}
              <div className="iic-card" style={{ marginTop: '1.5rem' }}>
                <div className="iic-badge purple">
                  <Layers size={14} /> Ecosystem Support
                </div>
                <h3 className="iic-card-title">{iic.supportsInnovation.title}</h3>
                <div className="iic-docs-grid" style={{ marginTop: '1rem', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))' }}>
                  {iic.supportsInnovation.items.map((item, index) => {
                    const IconComp = supportIcons[index % supportIcons.length];
                    return (
                      <div key={index} className="iic-doc-card" style={{ flexDirection: 'column', alignItems: 'flex-start', gap: '0.75rem', cursor: 'default' }}>
                        <div className="iic-doc-icon-box" style={{ background: 'var(--color-primary-light)', color: 'var(--color-primary)' }}>
                          <IconComp size={20} />
                        </div>
                        <div className="iic-doc-info" style={{ width: '100%' }}>
                          <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#0B1E42', marginBottom: '0.35rem' }}>
                            {item.title}
                          </h4>
                          <p style={{ fontSize: '0.875rem', color: '#4A5568', lineHeight: 1.5, margin: 0 }}>
                            {renderBold(item.description)}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <AdminTabExtraSections tab={findStaticTabMatch('about')} />
            </div>
          )}

          {/* Tab: IIC – Constitution */}
          {activeTabId === 'constitution' && (
            <div className="iic-tab-pane animate-fade-in">
              <div className="iic-card">
                <div className="iic-badge">
                  <Users size={14} /> Council Roster
                </div>
                <h2 className="iic-card-title">{iic.constitution.title}</h2>
                <p className="iic-lead-text">{renderBold(iic.constitution.intro)}</p>
                <h3 className="iic-subcard-title" style={{ marginTop: '1.5rem' }}>{iic.constitution.heading}</h3>

                {/* Firestore Council Roster (if any) or Fallback Roster */}
                {councilMembers.length > 0 ? (
                  <div className="iic-council-roster-grid">
                    {councilMembers.map((m) => (
                      <div key={m.id} className="iic-council-card">
                        <img loading="lazy"
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
                  <div className="iic-council-pdf-wrap" style={{ marginTop: '1.5rem' }}>
                    <a href={councilMembersLinks[0].fileUrl} download className="iic-pdf-btn">
                      <FileText size={16} /> {councilMembersLinks[0].label || 'View IIC Council Members 2025–26'} <Download size={14} />
                    </a>
                  </div>
                )}
              </div>

              <AdminTabExtraSections tab={findStaticTabMatch('constitution')} />
            </div>
          )}

          {/* Tab: Innovation Ambassadors */}
          {activeTabId === 'ambassadors' && (
            <div className="iic-tab-pane animate-fade-in">
              <div className="iic-card">
                <div className="iic-badge gold">
                  <Award size={14} /> MoE Innovation Ambassadors
                </div>
                <h2 className="iic-card-title">{iic.ambassadors.title}</h2>
                <p className="iic-lead-text">{renderBold(iic.ambassadors.intro)}</p>
                <h3 className="iic-subcard-title" style={{ marginTop: '1.25rem', marginBottom: '0.75rem' }}>
                  {iic.ambassadors.rolesTitle}
                </h3>
                <ul className="iic-checklist" style={{ marginBottom: '1.5rem' }}>
                  {iic.ambassadors.roles.map((role, idx) => (
                    <li key={idx}>
                      <CheckCircle2 size={16} className="iic-check-icon gold" />
                      <span>{renderBold(role)}</span>
                    </li>
                  ))}
                </ul>
                <h3 className="iic-subcard-title" style={{ marginTop: '1.5rem' }}>Ambassador Document Links</h3>
                {renderDocumentList(innovationAmbassadorLinks, 'Innovation Ambassadors documents are coming soon.')}
              </div>

              <AdminTabExtraSections tab={findStaticTabMatch('ambassadors')} />
            </div>
          )}

          {/* Tab: IIC Activities */}
          {activeTabId === 'activities' && (
            <div className="iic-tab-pane animate-fade-in">
              <div className="iic-card">
                <div className="iic-badge">
                  <Calendar size={14} /> Ecosystem Initiatives
                </div>
                <h2 className="iic-card-title">{iic.activities.title}</h2>
                {iic.activities.paragraphs.map((p, i) => (
                  <p key={i} className="iic-lead-text" style={{ marginBottom: i < iic.activities.paragraphs.length - 1 ? '1rem' : 0 }}>
                    {renderBold(p)}
                  </p>
                ))}
                <h3 className="iic-subcard-title" style={{ marginTop: '1.5rem' }}>{iic.activities.subheading}</h3>
                {renderDocumentList(iicActivityYears, 'Activity reports are coming soon.')}
              </div>

              <AdminTabExtraSections tab={findStaticTabMatch('activities')} />
            </div>
          )}

          {/* Tab: Rating Certificates */}
          {activeTabId === 'rating' && (
            <div className="iic-tab-pane animate-fade-in">
              <div className="iic-card">
                <div className="iic-badge gold">
                  <Star size={14} /> Recognition & Star Ratings
                </div>
                <h2 className="iic-card-title">{iic.rating.heading}</h2>
                <p className="iic-lead-text">{iic.rating.subheading}</p>
                <div style={{ marginTop: '1.5rem' }}>
                  {renderDocumentList(ratingCertificates, 'Rating certificates are coming soon.')}
                </div>
              </div>

              <AdminTabExtraSections tab={findStaticTabMatch('rating')} />
            </div>
          )}

          {/* Tab: IIC Annual Reports */}
          {activeTabId === 'annual-reports' && (
            <div className="iic-tab-pane animate-fade-in">
              <div className="iic-card">
                <div className="iic-badge cyan">
                  <FileCheck size={14} /> Annual Documentation
                </div>
                <h2 className="iic-card-title">{iic.annualReports.heading}</h2>
                <p className="iic-lead-text">{iic.annualReports.subheading}</p>
                <div style={{ marginTop: '1.5rem' }}>
                  {renderDocumentList(annualReports, 'IIC Annual Reports are coming soon.')}
                </div>
              </div>

              <AdminTabExtraSections tab={findStaticTabMatch('annual-reports')} />
            </div>
          )}

          {/* Tab: SIH Internal Hackathon Reports */}
          {activeTabId === 'sih' && (
            <div className="iic-tab-pane animate-fade-in">
              <div className="iic-card">
                <div className="iic-badge">
                  <Rocket size={14} /> Smart India Hackathon
                </div>
                <h2 className="iic-card-title">{iic.sih.heading}</h2>
                <p className="iic-lead-text">{iic.sih.subheading}</p>
                <div style={{ marginTop: '1.5rem' }}>
                  {renderDocumentList(sihHackathonReports, 'SIH Internal Hackathon Reports are coming soon.')}
                </div>
              </div>

              <AdminTabExtraSections tab={findStaticTabMatch('sih')} />
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
                <p className="iic-lead-text">{iic.nisp.subheading}</p>
                <div style={{ marginTop: '1.5rem' }}>
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

              <AdminTabExtraSections tab={findStaticTabMatch('nisp')} />
            </div>
          )}

          {/* Tab: Atal Tinkering Schools (ATL) */}
          {activeTabId === 'atl' && (
            <div className="iic-tab-pane animate-fade-in">
              <div className="iic-card">
                <div className="iic-badge cyan">
                  <School size={14} /> School Mentorship
                </div>
                <h2 className="iic-card-title">{iic.atalTinkeringSchools.title}</h2>
                {iic.atalTinkeringSchools.paragraphs.map((p, i) => (
                  <p key={i} className="iic-lead-text" style={{ marginBottom: i < iic.atalTinkeringSchools.paragraphs.length - 1 ? '1rem' : 0 }}>
                    {renderBold(p)}
                  </p>
                ))}
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

              <AdminTabExtraSections tab={findStaticTabMatch('atl')} />
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
                  <span>IIC Council</span>
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
                  <span>Recognition & Rating</span>
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
                  <span>Smart India Hackathon</span>
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
