import { useState } from 'react';
import type { CustomSection } from '../../lib/customSections';
import { CustomSectionsGalleries, SectionSubtree } from '../../components/CustomSectionsRenderer/CustomSectionsRenderer';
import { ultraTechCoe } from './ultraTechCoe.data';
import {
  Target,
  Compass,
  Mail,
  BookOpen,
  ChevronRight,
  Users,
  Calendar,
  Leaf,
  Droplets,
  HeartPulse,
  GraduationCap,
  ArrowRight,
  Building2,
  Sparkles,
  Award,
  CheckCircle2,
  Layers,
  FileCheck2,
  FileText,
  Handshake
} from 'lucide-react';
import './UltraTechPage.css';

interface InfoTabItem {
  id: string;
  num: string;
  label: string;
  badge: string;
  icon: typeof Users;
  customSection?: CustomSection;
}

interface UltraTechPageProps {
  customSections?: CustomSection[];
  descriptionSection?: CustomSection;
  introBlocks?: CustomSection[];
}

export default function UltraTechPage({
  customSections = [],
  introBlocks = [],
}: UltraTechPageProps) {
  const { overview, vision, mission, objectives, inCharge, studentsBenefited, accordionContent } = ultraTechCoe;

  const overviewText = overview;
  
  const visionBlock = introBlocks.find((s) => s.id === 'vision');
  const visionText = visionBlock?.textContent?.trim() || (typeof vision === 'string' ? vision : '');

  const missionBlock = introBlocks.find((s) => s.id === 'mission');
  const missionList = missionBlock?.listText?.split('\n').map((s) => s.trim()).filter(Boolean) || mission;

  const objBlock = introBlocks.find((s) => s.id === 'objectives');
  const objectivesText = objBlock?.textContent?.trim() || objBlock?.listText?.trim() || objectives;
  
  // Total count of students
  const totalStudents = studentsBenefited.reduce((acc, curr) => acc + curr.students.length, 0);

  // Helper to filter out hardcoded or explicitly removed sections
  const isExcluded = (id?: string, label?: string) => {
    const text = `${id || ''} ${label || ''}`.toLowerCase();
    return (
      text.includes('academic') ||
      text.includes('training') ||
      text.includes('testi') ||
      text.includes('placement') ||
      text.includes('incharge') ||
      text.includes('in-charge') ||
      text.includes('students-benefited') ||
      text.includes('activities')
    );
  };

  // Filter out any custom sections that duplicate our hardcoded blocks or are removed
  const accordionSections = customSections.filter(
    (s) => !isExcluded(s.id, s.label)
  );

  // Unified Tabs for the Side-by-Side "More Information" layout
  const fixedTabs: InfoTabItem[] = [
    {
      id: 'in-charges',
      num: '01',
      label: 'In-charges',
      badge: 'Faculty Lead',
      icon: Users,
    },
    {
      id: 'students-benefited',
      num: '02',
      label: 'Students Benefited',
      badge: `${totalStudents} Students`,
      icon: GraduationCap,
    },
    {
      id: 'activities',
      num: '03',
      label: 'Activities',
      badge: '3 Milestones',
      icon: Calendar,
    },
  ];

  const getCustomIcon = (id: string, label: string): typeof Users => {
    const l = (id + ' ' + label).toLowerCase();
    if (l.includes('partner')) return Handshake;
    if (l.includes('highlight') || l.includes('outcome')) return Award;
    return FileText;
  };

  const allTabs: InfoTabItem[] = [
    ...fixedTabs,
    ...accordionSections
      .filter((sec) => !isExcluded(sec.id, sec.label))
      .map((sec, idx) => ({
        id: sec.id,
        num: String(idx + 4).padStart(2, '0'),
        label: sec.label,
        badge: sec.contentType || 'Details',
        icon: getCustomIcon(sec.id, sec.label),
        customSection: sec,
      })),
  ];

  const [activeTabId, setActiveTabId] = useState<string>('in-charges');
  const [activeYearTab, setActiveYearTab] = useState<number>(0);

  const activeTab = allTabs.find((t) => t.id === activeTabId) || allTabs[0];

  return (
    <div className="utec-page">
      {/* ===== HERO BANNER: ENTERPRISE CO-LAB SHOWCASE ===== */}
      <section className="utec-hero-banner">
        <div className="utec-hero-ambient utec-ambient-1" />
        <div className="utec-hero-ambient utec-ambient-2" />
        <div className="utec-hero-blueprint-grid" />

        <div className="utec-hero-container">
          <div className="utec-hero-content">
            {/* Top kicker row with glowing live indicator */}
            <div className="utec-badge-group">
              <div className="utec-yellow-kicker">
                <span className="utec-kicker-beacon">
                  <span className="utec-beacon-ping" />
                  <span className="utec-beacon-dot" />
                </span>
                <span className="utec-kicker-slash">///</span>
                <span>UTEC R&D WATER, HEALTH CARE & TRAINING</span>
              </div>
              <div className="utec-partner-chip">
                <Building2 size={13} />
                <span>Industry CoE Collaboration</span>
              </div>
            </div>

            <h1 className="utec-hero-title">
              Empowering Communities <br />
              <span className="utec-hero-script">Through Innovation & Training</span>
            </h1>

            <p className="utec-hero-subtitle">
              Partnering with UltraTech Cement Ltd to empower civil engineering students with hands-on training in sustainable construction materials and technologies.
            </p>
          </div>

          {/* Right Floating Badge Card */}
          <div className="utec-hero-watermark-card">
            <div className="utec-watermark-icon-ring">
              <Leaf size={22} className="utec-watermark-leaf" />
            </div>
            <div className="utec-watermark-text-wrap">
              <span className="utec-watermark-main">Better Materials</span>
              <span className="utec-watermark-sub">A Healthier Tomorrow</span>
            </div>
            <div className="utec-watermark-pill">
              <Sparkles size={11} /> Sustainable Future
            </div>
          </div>
        </div>

        {/* Hero Bottom Stats Strip */}
        <div className="utec-hero-stats-bar">
          <div className="utec-hstat-item">
            <span className="utec-hstat-number">{totalStudents}+</span>
            <span className="utec-hstat-label">Students Benefited</span>
          </div>
          <div className="utec-hstat-divider" />
          <div className="utec-hstat-item">
            <span className="utec-hstat-number">UltraTech Cement</span>
            <span className="utec-hstat-label">Industry MoU Partner</span>
          </div>
          <div className="utec-hstat-divider" />
          <div className="utec-hstat-item">
            <span className="utec-hstat-number">4 Key Pillars</span>
            <span className="utec-hstat-label">Research & Skilling</span>
          </div>
          <div className="utec-hstat-divider" />
          <div className="utec-hstat-item">
            <span className="utec-hstat-number">Civil Engineering</span>
            <span className="utec-hstat-label">Center of Excellence</span>
          </div>
        </div>
      </section>

      <div className="utec-main-content">
        {/* ===== SECTION 1: ABOUT US & PILLARS + VISION & MISSION ===== */}
        <div className="utec-executive-grid">
          {/* LEFT: ABOUT US CARD & 4 FEATURE PILLARS */}
          <div className="utec-about-panel">
            <div className="utec-card-header">
              <div className="utec-section-kicker">
                <span className="utec-yellow-bar" />
                <span>ABOUT US</span>
              </div>
              <span className="utec-badge-outline">Civil Engineering</span>
            </div>

            <h2 className="utec-about-title">{ultraTechCoe.pageTitle}</h2>
            <p className="utec-about-desc">{overviewText}</p>

            {/* 4 FEATURE PILLARS INTEGRATED */}
            <div className="utec-pillars-wrapper">
              <div className="utec-pillars-label">
                <Layers size={14} /> Core Focus Domains
              </div>
              <div className="utec-pillars-grid">
                <div className="utec-pillar-card p-green">
                  <div className="utec-pillar-icon-box green">
                    <Leaf size={18} />
                  </div>
                  <div className="utec-pillar-body">
                    <h4 className="utec-pillar-title">Sustainable Materials</h4>
                    <p className="utec-pillar-desc">Innovating for a greener tomorrow</p>
                  </div>
                </div>

                <div className="utec-pillar-card p-blue">
                  <div className="utec-pillar-icon-box blue">
                    <Droplets size={18} />
                  </div>
                  <div className="utec-pillar-body">
                    <h4 className="utec-pillar-title">Water & Environment</h4>
                    <p className="utec-pillar-desc">Conserving resources, protecting ecosystems</p>
                  </div>
                </div>

                <div className="utec-pillar-card p-pink">
                  <div className="utec-pillar-icon-box pink">
                    <HeartPulse size={18} />
                  </div>
                  <div className="utec-pillar-body">
                    <h4 className="utec-pillar-title">Health & Safety</h4>
                    <p className="utec-pillar-desc">Creating safer communities</p>
                  </div>
                </div>

                <div className="utec-pillar-card p-purple">
                  <div className="utec-pillar-icon-box purple">
                    <GraduationCap size={18} />
                  </div>
                  <div className="utec-pillar-body">
                    <h4 className="utec-pillar-title">Training & Capacity</h4>
                    <p className="utec-pillar-desc">Skilling for a stronger future</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="utec-about-action">
              <a href="#more-info" className="utec-btn-primary">
                <span>Explore Research & Activities</span>
                <ArrowRight size={15} className="utec-btn-arrow" />
              </a>
            </div>
          </div>

          {/* RIGHT: STRATEGIC VISION & MISSION SHOWCASE */}
          <div className="utec-blueprint-card">
            <div className="utec-blueprint-badge">
              <Award size={14} />
              <span>STRATEGIC BLUEPRINT</span>
            </div>

            {/* OUR VISION */}
            {visionText && (
              <div className="utec-vm-section utec-vision-box">
                <div className="utec-vm-title-row">
                  <div className="utec-vm-icon-bubble vision">
                    <Compass size={18} />
                  </div>
                  <div>
                    <span className="utec-vm-subtitle">Strategic Outlook</span>
                    <h3 className="utec-vm-heading">Our Vision</h3>
                  </div>
                </div>

                <div className="utec-vision-quote-card">
                  <span className="utec-quote-mark">“</span>
                  <p className="utec-vision-quote-text">{visionText}</p>
                </div>
              </div>
            )}

            {/* OUR MISSION */}
            <div className="utec-vm-section utec-mission-box">
              <div className="utec-vm-title-row">
                <div className="utec-vm-icon-bubble mission">
                  <Target size={18} />
                </div>
                <div>
                  <span className="utec-vm-subtitle">Institutional Charter</span>
                  <h3 className="utec-vm-heading">Our Mission</h3>
                </div>
              </div>

              <ul className="utec-mission-checklist">
                {missionList.map((item, idx) => (
                  <li key={idx} className="utec-mission-item">
                    <div className="utec-mission-bullet-gold">
                      <CheckCircle2 size={15} />
                    </div>
                    <span className="utec-mission-text">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* QUOTE BANNER AT BOTTOM */}
            <div className="utec-blueprint-footer">
              <div className="utec-blueprint-footer-tag">
                <Sparkles size={13} />
                <span>Foundational Motto</span>
              </div>
              <p className="utec-blueprint-quote">
                “Knowledge, Training and Innovation for a Sustainable World”
              </p>
            </div>
          </div>
        </div>

        {/* ===== SECTION 2: OUR FOCUS / KEY OBJECTIVES ===== */}
        <section className="utec-focus-section">
          <div className="utec-focus-header">
            <div>
              <div className="utec-section-kicker">
                <span className="utec-yellow-bar" />
                <span>OUR FOCUS</span>
              </div>
              <h2 className="utec-section-heading">Key Objectives</h2>
            </div>
            <div className="utec-focus-badge">
              <FileCheck2 size={16} /> 4 Strategic Directives
            </div>
          </div>

          {objectivesText && (
            <div className="utec-focus-intro-box">
              <p>{objectivesText}</p>
            </div>
          )}

          <div className="utec-objectives-grid">
            <div className="utec-obj-card card-green">
              <div className="utec-obj-card-top">
                <div className="utec-obj-icon-circle green">
                  <Leaf size={20} />
                </div>
                <span className="utec-obj-index">01</span>
              </div>
              <div className="utec-obj-badge green">Education</div>
              <p className="utec-obj-text">
                Provide quality education in sustainable construction materials and technology.
              </p>
            </div>

            <div className="utec-obj-card card-blue">
              <div className="utec-obj-card-top">
                <div className="utec-obj-icon-circle blue">
                  <Droplets size={20} />
                </div>
                <span className="utec-obj-index">02</span>
              </div>
              <div className="utec-obj-badge blue">Research</div>
              <p className="utec-obj-text">
                Encourage research and innovation in sustainable materials and environmental management.
              </p>
            </div>

            <div className="utec-obj-card card-pink">
              <div className="utec-obj-card-top">
                <div className="utec-obj-icon-circle pink">
                  <HeartPulse size={20} />
                </div>
                <span className="utec-obj-index">03</span>
              </div>
              <div className="utec-obj-badge pink">Awareness</div>
              <p className="utec-obj-text">
                Promote health and safety awareness and social responsibility practices.
              </p>
            </div>

            <div className="utec-obj-card card-purple">
              <div className="utec-obj-card-top">
                <div className="utec-obj-icon-circle purple">
                  <GraduationCap size={20} />
                </div>
                <span className="utec-obj-index">04</span>
              </div>
              <div className="utec-obj-badge purple">Capacity</div>
              <p className="utec-obj-text">
                Offer training and capacity building for students and industry professionals.
              </p>
            </div>
          </div>
        </section>

        {/* ===== SECTION 3: MORE INFORMATION SIDE-BY-SIDE TABS ===== */}
        <section id="more-info" className="utec-side-by-side-section">
          <div className="utec-accordion-header-title">
            <div className="utec-acc-title-left">
              <span className="utec-acc-dot" />
              <span>More Information</span>
            </div>
            <span className="utec-header-rule" />
          </div>

          <div className="utec-master-detail-layout">
            {/* LEFT SIDEBAR: TAB CONTROLS */}
            <div className="utec-tabs-sidebar">
              <div className="utec-sidebar-heading">Select Category</div>
              <div className="utec-tabs-nav" role="tablist">
                {allTabs.map((tab) => {
                  const isActive = activeTabId === tab.id;
                  const TabIcon = tab.icon;

                  return (
                    <button
                      key={tab.id}
                      type="button"
                      role="tab"
                      aria-selected={isActive}
                      className={`utec-side-tab-btn${isActive ? ' is-active' : ''}`}
                      onClick={() => setActiveTabId(tab.id)}
                    >
                      <div className="utec-tab-btn-main">
                        <span className="utec-tab-num">{tab.num}</span>
                        <div className="utec-tab-btn-text">
                          <span className="utec-tab-title">{tab.label}</span>
                          <span className="utec-tab-badge-pill">
                            <TabIcon size={11} /> {tab.badge}
                          </span>
                        </div>
                      </div>
                      <ChevronRight size={16} className="utec-tab-arrow" />
                    </button>
                  );
                })}
              </div>
            </div>

            {/* RIGHT MAIN PANEL: ACTIVE CONTENT DISPLAY ONLY */}
            <div className="utec-tab-content-panel" role="tabpanel">
              {/* Header inside the active panel */}
              <div className="utec-panel-header">
                <div className="utec-panel-header-left">
                  <span className="utec-panel-num">{activeTab.num}</span>
                  <div>
                    <h3 className="utec-panel-title">{activeTab.label}</h3>
                    <span className="utec-panel-tag">{activeTab.badge}</span>
                  </div>
                </div>
              </div>

              {/* BODY: CONDITIONAL RENDERING — ONLY ACTIVE TAB VISIBLE */}
              <div className="utec-panel-body">
                {/* 1. IN-CHARGES */}
                {activeTabId === 'in-charges' && (
                  <div className="utec-incharge-card animate-tab-fade">
                    <div className="utec-incharge-left">
                      <div className="utec-avatar-wrapper">
                        <div className="utec-avatar-circle">
                          {inCharge.name.replace(/^(Mr\.|Dr\.|Ms\.)\s*/, '').split(' ').map(n => n[0]).join('').slice(0, 2)}
                        </div>
                        <span className="utec-avatar-badge" title="Active Faculty Coordinator">
                          <CheckCircle2 size={14} />
                        </span>
                      </div>

                      <div className="utec-incharge-main">
                        <div className="utec-incharge-header-row">
                          <h4 className="utec-incharge-name">{inCharge.name}</h4>
                          <span className="utec-incharge-badge">CoE Coordinator</span>
                        </div>
                        <div className="utec-incharge-role">{inCharge.designation} • Department of Civil Engineering</div>

                        <div className="utec-incharge-contact-chips">
                          {inCharge.email && (
                            <a href={`mailto:${inCharge.email}`} className="utec-contact-chip">
                              <Mail size={14} className="utec-chip-icon" />
                              <span>{inCharge.email}</span>
                            </a>
                          )}
                        </div>
                      </div>
                    </div>

                    {inCharge.interests && (
                      <div className="utec-interests-box">
                        <div className="utec-interests-header">
                          <BookOpen size={14} />
                          <span>Areas of Specialization & Interests</span>
                        </div>
                        <div className="utec-interest-tags">
                          {inCharge.interests.split(',').map((tag, i) => (
                            <span key={i} className="utec-tag-item">
                              {tag.trim()}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* 2. STUDENTS BENEFITED */}
                {activeTabId === 'students-benefited' && (
                  <div className="utec-students-tab-content animate-tab-fade">
                    <div className="utec-students-top-bar">
                      <div className="utec-year-pills">
                        {studentsBenefited.map((group, idx) => (
                          <button
                            key={idx}
                            type="button"
                            className={`utec-pill${activeYearTab === idx ? ' is-active' : ''}`}
                            onClick={() => setActiveYearTab(idx)}
                          >
                            <Users size={14} />
                            <span>{group.yearLabel}</span>
                            <span className="utec-pill-count">{group.students.length}</span>
                          </button>
                        ))}
                      </div>

                      <div className="utec-table-caption">
                        Showing batch of {studentsBenefited[activeYearTab]?.students.length || 0} students under UltraTech CoE training
                      </div>
                    </div>

                    {studentsBenefited[activeYearTab] && (
                      <div className="utec-table-container">
                        <table>
                          <thead>
                            <tr>
                              <th style={{ width: '80px', textAlign: 'center' }}>S.No</th>
                              <th style={{ width: '180px' }}>Regd. No</th>
                              <th>Student Name</th>
                              <th style={{ width: '140px', textAlign: 'right' }}>Department</th>
                            </tr>
                          </thead>
                          <tbody>
                            {studentsBenefited[activeYearTab].students.map((st, i) => (
                              <tr key={st.regdNo}>
                                <td style={{ textAlign: 'center' }} className="utec-sno-col">
                                  {String(i + 1).padStart(2, '0')}
                                </td>
                                <td className="reg-no">
                                  <span className="utec-reg-pill">{st.regdNo}</span>
                                </td>
                                <td className="st-name">
                                  <div className="utec-student-name-wrap">
                                    <span className="utec-student-dot" />
                                    <span>{st.name}</span>
                                  </div>
                                </td>
                                <td style={{ textAlign: 'right' }}>
                                  <span className="utec-dept-tag">Civil Engg</span>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                )}

                {/* 3. ACTIVITIES */}
                {activeTabId === 'activities' && (
                  <div className="utec-timeline-wrapper animate-tab-fade">
                    {(accordionContent['Activities'] || []).map((activity, idx) => {
                      const dateMatch = activity.match(/on\s+([A-Za-z]+\s+\d{1,2},\s+\d{4})/i);
                      const dateStr = dateMatch ? dateMatch[1] : null;

                      let eventTag = 'Event';
                      if (activity.toLowerCase().includes('mou')) eventTag = 'MoU Signing';
                      else if (activity.toLowerCase().includes('webinar')) eventTag = 'Webinar Session';
                      else if (activity.toLowerCase().includes('expert talk')) eventTag = 'Expert Talk';

                      return (
                        <div key={idx} className="utec-timeline-card">
                          <div className="utec-timeline-marker">
                            <div className="utec-marker-ring">
                              <span className="utec-marker-dot" />
                            </div>
                            {idx < (accordionContent['Activities']?.length || 1) - 1 && (
                              <div className="utec-timeline-line" />
                            )}
                          </div>

                          <div className="utec-timeline-content">
                            <div className="utec-timeline-header">
                              <span className="utec-event-type-badge">{eventTag}</span>
                              {dateStr && (
                                <span className="utec-event-date">
                                  <Calendar size={13} /> {dateStr}
                                </span>
                              )}
                            </div>
                            <p className="utec-timeline-desc">{activity}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* 4. DYNAMIC CUSTOM SECTION CONTENT */}
                {activeTab?.customSection && (
                  <div className="utec-custom-tab-content animate-tab-fade">
                    <SectionSubtree section={activeTab.customSection} />
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* ===== BOTTOM DECORATIVE FOOTER BANNER ===== */}
        <div className="utec-footer-wave">
          <div className="utec-footer-ambient-glow" />
          <div className="utec-wave-content">
            <span className="utec-wave-line" />
            <div className="utec-wave-badge">
              <Leaf size={16} />
              <span className="utec-wave-text">Together for a Sustainable Future</span>
            </div>
            <span className="utec-wave-line" />
          </div>
          <div className="utec-wave-subtext">
            Centre of Excellence for Sustainable Construction Practices and Materials (CSCPM)
          </div>
        </div>

        {/* PHOTO GALLERIES AT VERY BOTTOM IF CUSTOM SECTIONS CARRY ANY */}
        {customSections.length > 0 && (
          <section className="utec-gallery-section" style={{ marginTop: '3rem' }}>
            <CustomSectionsGalleries sections={customSections} />
          </section>
        )}
      </div>
    </div>
  );
}
