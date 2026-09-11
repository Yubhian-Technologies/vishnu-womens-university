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
} from 'lucide-react';
import { dreamHouseConstructionLab } from './dreamHouseConstructionLab.data';
import type { DifferentiatorItemDoc } from '../Admin/sections/DifferentiatorsAdmin';
import type { CustomSection } from '../../lib/customSections';
import { CustomSectionsGalleries } from '../../components/CustomSectionsRenderer/CustomSectionsRenderer';
import './DreamHouseLabPage.css';

interface DreamHouseLabPageProps {
  item: DifferentiatorItemDoc;
  sections: CustomSection[];
}

export default function DreamHouseLabPage({ sections }: DreamHouseLabPageProps) {
  const [activeStudentCohort, setActiveStudentCohort] = useState<number>(0);
  const [isIticTeamExpanded, setIsIticTeamExpanded] = useState<boolean>(true);
  const [isProjectTeamExpanded, setIsProjectTeamExpanded] = useState<boolean>(true);
  const dhcl = dreamHouseConstructionLab;

  return (
    <div className="dhcl-page-container">
      {/* Structural Stats Strip */}
      <section className="dhcl-stats-section">
        <div className="dhcl-stats-grid">
          <div className="dhcl-stat-card">
            <div className="dhcl-stat-icon-wrapper">
              <Building className="dhcl-stat-icon" />
            </div>
            <div className="dhcl-stat-content">
              <span className="dhcl-stat-number">4+</span>
              <span className="dhcl-stat-label">Years of Innovation</span>
            </div>
          </div>

          <div className="dhcl-stat-card">
            <div className="dhcl-stat-icon-wrapper">
              <GraduationCap className="dhcl-stat-icon" />
            </div>
            <div className="dhcl-stat-content">
              <span className="dhcl-stat-number">37+</span>
              <span className="dhcl-stat-label">Students Benefited</span>
            </div>
          </div>

          <div className="dhcl-stat-card">
            <div className="dhcl-stat-icon-wrapper">
              <Award className="dhcl-stat-icon" />
            </div>
            <div className="dhcl-stat-content">
              <span className="dhcl-stat-number">₹1 Lakh</span>
              <span className="dhcl-stat-label">ITIC Seed Funding</span>
            </div>
          </div>

          <div className="dhcl-stat-card">
            <div className="dhcl-stat-icon-wrapper">
              <Rocket className="dhcl-stat-icon" />
            </div>
            <div className="dhcl-stat-content">
              <span className="dhcl-stat-number">Top 75</span>
              <span className="dhcl-stat-label">ITIC BUILD Winner</span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Overview & In-Charge Spotlight */}
      <section className="dhcl-overview-section">
        <div className="dhcl-overview-wrapper">
          {/* Main Lab Intro Card */}
          <div className="dhcl-about-card">
            <div className="dhcl-card-badge">
              <Layers size={15} /> Overview & Purpose
            </div>
            <h2 className="dhcl-section-heading">Dream House Construction Lab (DHCL)</h2>
            <div className="dhcl-paragraphs">
              {dhcl.paragraphs.map((p, idx) => (
                <p key={idx} className="dhcl-lead-paragraph">
                  {p}
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

            {/* Gallery Custom Sections Renderer (if admin gallery photos exist) */}
            {sections && sections.length > 0 && (
              <div className="dhcl-custom-sections-wrapper">
                <CustomSectionsGalleries sections={sections} />
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Vision & Mission Quad-Grid */}
      <section className="dhcl-vision-mission-section">
        <div className="dhcl-vm-container">
          {/* Vision Featured Banner */}
          <div className="dhcl-vision-card">
            <div className="dhcl-vm-icon-box vision-icon">
              <Compass size={24} />
            </div>
            <div className="dhcl-vision-content">
              <span className="dhcl-vm-subtitle">Our Architectural Blueprint</span>
              <h3 className="dhcl-vm-title">Vision</h3>
              <p className="dhcl-vision-text">{dhcl.vision}</p>
            </div>
          </div>

          {/* Mission Grid */}
          <div className="dhcl-mission-block">
            <div className="dhcl-mission-header">
              <div className="dhcl-vm-icon-box mission-icon">
                <Target size={24} />
              </div>
              <div>
                <span className="dhcl-vm-subtitle">Strategic Pillars</span>
                <h3 className="dhcl-vm-title">Mission</h3>
              </div>
            </div>

            <div className="dhcl-mission-grid">
              {dhcl.mission.map((item, idx) => (
                <div key={idx} className="dhcl-mission-card">
                  <div className="dhcl-mission-badge">0{idx + 1}</div>
                  <div className="dhcl-mission-text-wrap">
                    <CheckCircle2 size={18} className="dhcl-check-icon" />
                    <p className="dhcl-mission-text">{item}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Objectives List */}
          {dhcl.objectives && dhcl.objectives.length > 0 && (
            <div className="dhcl-objectives-card">
              <h3 className="dhcl-objectives-title">
                <ShieldCheck size={20} /> Core Objectives
              </h3>
              <div className="dhcl-objectives-grid">
                {dhcl.objectives.map((obj, idx) => (
                  <div key={idx} className="dhcl-objective-item">
                    <span className="dhcl-obj-bullet">•</span>
                    <p>{obj}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Incubation & Startup Outcomes Showcase */}
      <section className="dhcl-outcomes-section">
        <div className="dhcl-outcomes-card">
          <div className="dhcl-outcomes-header-banner">
            <div className="dhcl-trophy-badge">
              <Award size={36} />
            </div>
            <div className="dhcl-outcomes-title-wrap">
              <span className="dhcl-outcomes-tag">{dhcl.outcomes.heading}</span>
              <h2 className="dhcl-outcomes-main-title">{dhcl.outcomes.subheading}</h2>
              <span className="dhcl-outcomes-badge-pill">IIT Hyderabad Incubation (ITIC)</span>
            </div>
          </div>

          <div className="dhcl-outcomes-body">
            {/* Paragraph Announcement */}
            {dhcl.outcomes.paragraphs.map((p, idx) => (
              <div key={idx} className="dhcl-outcome-alert">
                <Sparkles size={20} className="dhcl-alert-sparkle" />
                <p className="dhcl-alert-text">{p}</p>
              </div>
            ))}

            {/* Impact Brief Callout */}
            <div className="dhcl-brief-box">
              <h4 className="dhcl-brief-heading">Eco-Housing & Sustainability Impact</h4>
              <p className="dhcl-brief-text">{dhcl.outcomes.brief}</p>
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
                  <h4 className="dhcl-table-title">ITIC BUILD Incubated Student Innovators Team (SMB)</h4>
                </div>
                <div className="dhcl-table-meta-group">
                  <span className="dhcl-table-count">{dhcl.outcomes.team.rows.length} Members</span>
                  <span className="dhcl-expand-hint">{isIticTeamExpanded ? 'Hide' : 'Show'}</span>
                </div>
              </div>

              {isIticTeamExpanded && (
                <div className="dhcl-table-responsive animate-fade-in">
                  <table className="dhcl-data-table">
                    <thead>
                      <tr>
                        {dhcl.outcomes.team.headers.map((h, i) => (
                          <th key={i}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {dhcl.outcomes.team.rows.map((row, rIdx) => (
                        <tr key={rIdx}>
                          {row.map((cell, cIdx) => (
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

      {/* Academic Research Project Section */}
      <section className="dhcl-academic-project-section">
        <div className="dhcl-project-card">
          <div className="dhcl-project-header">
            <div className="dhcl-project-badge">
              <BookOpen size={16} /> Academic Research Project Spotlight
            </div>
            <h3 className="dhcl-project-heading">{dhcl.academicProject.heading}</h3>
          </div>

          <div className="dhcl-project-content-grid">
            {/* Left: Research Description */}
            <div className="dhcl-project-text-side">
              {dhcl.academicProject.paragraphs.map((para, i) => (
                <p key={i} className="dhcl-project-paragraph">
                  {para}
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
                      Project Research Team
                    </h4>
                  </div>
                  <span className="dhcl-expand-hint">{isProjectTeamExpanded ? 'Hide' : 'Show'}</span>
                </div>

                {isProjectTeamExpanded && (
                  <table className="dhcl-data-table dhcl-compact-table animate-fade-in">
                    <thead>
                      <tr>
                        {dhcl.academicProject.team.headers.map((h, idx) => (
                          <th key={idx}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {dhcl.academicProject.team.rows.map((row, rIdx) => (
                        <tr key={rIdx}>
                          {row.map((cell, cIdx) => (
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

      {/* Student Beneficiaries Directory */}
      <section className="dhcl-beneficiaries-section">
        <div className="dhcl-beneficiaries-card">
          <div className="dhcl-beneficiaries-header">
            <div>
              <span className="dhcl-beneficiaries-tag">Skill & Research Training</span>
              <h3 className="dhcl-beneficiaries-title">Students Benefited Directory</h3>
            </div>

            {/* Cohort Tabs */}
            <div className="dhcl-cohort-tabs">
              {dhcl.studentsBenefited.map((group, gIdx) => (
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
            {dhcl.studentsBenefited[activeStudentCohort]?.students.map((student, sIdx) => (
              <div key={sIdx} className="dhcl-student-card">
                <div className="dhcl-student-regd">{student.regdNo}</div>
                <div className="dhcl-student-name">{student.name}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Activities & Exposure Events Timeline */}
      {dhcl.activities && dhcl.activities.length > 0 && (
        <section className="dhcl-activities-section">
          <div className="dhcl-activities-card">
            <div className="dhcl-activities-header">
              <Calendar className="dhcl-activities-icon" size={24} />
              <h3 className="dhcl-activities-title">Department Expos & Exposure Visits</h3>
            </div>

            <div className="dhcl-activities-list">
              {dhcl.activities.map((act, idx) => (
                <div key={idx} className="dhcl-activity-item">
                  <div className="dhcl-act-bullet">
                    <ChevronRight size={16} />
                  </div>
                  <p className="dhcl-act-text">{act}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
