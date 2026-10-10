import { useEffect, useState } from 'react';
import {
  Cpu,
  Compass,
  Target,
  Sparkles,
  Award,
  Code2,
  BookOpen,
  Users,
  Calendar,
  Layers,
  Plus,
  Trash2,
  RotateCcw,
  Save,
  CheckCircle2,
  Zap,
  Wrench,
  Handshake,
} from 'lucide-react';
import { doc, serverTimestamp } from 'firebase/firestore';
import { setDoc } from '../../../lib/auditLog';
import { db } from '../../../lib/firebase';
import { useDocument } from '../../../hooks/useDocument';
import {
  highPerformanceComputingLab,
  type HpcMember,
} from '../../Differentiators/highPerformanceComputingLab.data';

export type { HpcMember };

export interface HpcTelemetryStat {
  value: string;
  label: string;
}

export interface HpcFundedProject {
  tag?: string;
  grantNo?: string;
  description: string;
}

export interface CustomHpcSection {
  id: string;
  title: string;
  badge?: string;
  paragraphs?: string[];
  bulletPoints?: string[];
}

export interface HpcLabDoc {
  // 1. Supercomputing Telemetry
  telemetry?: {
    stat1?: HpcTelemetryStat;
    stat2?: HpcTelemetryStat;
    stat3?: HpcTelemetryStat;
    stat4?: HpcTelemetryStat;
  };
  // 2. Overview & Purpose
  overviewBadge?: string;
  overviewTitle?: string;
  paragraphs?: string[];
  // 3. Vision & Mission
  visionBadge?: string;
  visionTitle?: string;
  vision?: string;
  missionBadge?: string;
  missionTitle?: string;
  mission?: string[];
  // 4. Strategic Objectives
  objectivesBadge?: string;
  objectivesTitle?: string;
  objectives?: string[];
  // 5. Funded Research Projects
  fundedProjectsBadge?: string;
  fundedProjectsTitle?: string;
  fundedProjects?: (string | HpcFundedProject)[];
  // 6. Faculty Research Initiatives
  facultyResearchBadge?: string;
  facultyResearchTitle?: string;
  facultyResearch?: string[];
  // 7. Outcomes & Publications
  outcomesBadge?: string;
  outcomesTitle?: string;
  outcomesSubtext?: string;
  outcomes?: string[];
  // 8. Team & Leadership
  teamBadge?: string;
  teamTitle?: string;
  team?: {
    inCharge?: HpcMember[];
    facultyMembers?: HpcMember[];
  };
  // 9. Workshops & Training Activities
  activitiesBadge?: string;
  activitiesTitle?: string;
  activities?: string[];
  // 10. Key Highlights
  highlightsBadge?: string;
  highlightsTitle?: string;
  highlights?: string[];
  // 11. Facilities & Equipment
  facilitiesBadge?: string;
  facilitiesTitle?: string;
  facilities?: string[];
  // 12. Partners
  partnersBadge?: string;
  partnersTitle?: string;
  partners?: string[];
  // 13. Dynamic Additional Sections
  additionalSections?: CustomHpcSection[];
}

const DEFAULT_STATE: HpcLabDoc = {
  telemetry: {
    stat1: { value: '2021', label: 'Established Year' },
    stat2: { value: 'DST R&D', label: 'Sponsored Grant' },
    stat3: { value: '9+', label: 'IEEE & Scopus Papers' },
    stat4: { value: '6+', label: 'Specialized Workshops' },
  },
  overviewBadge: 'Centre of Excellence',
  overviewTitle: 'High Performance Computing (HPC) Lab',
  paragraphs: [...highPerformanceComputingLab.paragraphs],
  visionBadge: 'Vision',
  visionTitle: 'Our Vision',
  vision: highPerformanceComputingLab.vision,
  missionBadge: 'Mission',
  missionTitle: 'Our Mission',
  mission: [...highPerformanceComputingLab.mission],
  objectivesBadge: 'Key Objectives',
  objectivesTitle: 'Strategic Objectives',
  objectives: [...highPerformanceComputingLab.objectives],
  fundedProjectsBadge: 'DST Sponsored R&D',
  fundedProjectsTitle: 'Funded Research Projects',
  fundedProjects: [
    {
      tag: 'DST Sponsored Project',
      grantNo: 'DST /SEED/SCSP/STI/ 2019/140/G',
      description: highPerformanceComputingLab.fundedProjects[0],
    },
  ],
  facultyResearchBadge: 'Deep Learning & Computer Vision',
  facultyResearchTitle: 'Faculty Research Initiatives',
  facultyResearch: [...highPerformanceComputingLab.facultyResearch],
  outcomesBadge: 'Research Output',
  outcomesTitle: 'Outcomes & Publications',
  outcomesSubtext: 'High-impact research publications in reputed IEEE conferences and indexed journals.',
  outcomes: [...highPerformanceComputingLab.outcomes],
  teamBadge: 'Academic Experts',
  teamTitle: 'HPC Lab Team & Leadership',
  team: {
    inCharge: highPerformanceComputingLab.team.inCharge.map((m) => ({ ...m })),
    facultyMembers: highPerformanceComputingLab.team.facultyMembers.map((m) => ({ ...m })),
  },
  activitiesBadge: 'Specialized Events',
  activitiesTitle: 'Workshops & Training Activities',
  activities: [...highPerformanceComputingLab.activities],
  highlightsBadge: 'Core Highlights',
  highlightsTitle: 'Key Highlights',
  highlights: [...highPerformanceComputingLab.highlights],
  facilitiesBadge: 'Infrastructure',
  facilitiesTitle: 'Facilities & Equipment',
  facilities: [...highPerformanceComputingLab.facilities],
  partnersBadge: 'Industry & Research',
  partnersTitle: 'Partners',
  partners: [...highPerformanceComputingLab.partners],
  additionalSections: [],
};

type ActiveSubSection =
  | 'telemetry'
  | 'overview'
  | 'vision-mission'
  | 'objectives'
  | 'funded-projects'
  | 'faculty-research'
  | 'outcomes'
  | 'team'
  | 'activities'
  | 'highlights'
  | 'facilities'
  | 'partners'
  | 'custom-sections';

export default function HpcLabContentAdmin() {
  const { data, loading } = useDocument<HpcLabDoc>('settings', 'hpcLab');
  const [form, setForm] = useState<HpcLabDoc>(DEFAULT_STATE);
  const [hasInitialized, setHasInitialized] = useState(false);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<ActiveSubSection>('telemetry');

  useEffect(() => {
    if (!loading && !hasInitialized) {
      if (data) {
        setForm({
          telemetry: {
            stat1: data.telemetry?.stat1 || DEFAULT_STATE.telemetry!.stat1,
            stat2: data.telemetry?.stat2 || DEFAULT_STATE.telemetry!.stat2,
            stat3: data.telemetry?.stat3 || DEFAULT_STATE.telemetry!.stat3,
            stat4: data.telemetry?.stat4 || DEFAULT_STATE.telemetry!.stat4,
          },
          overviewBadge: data.overviewBadge || DEFAULT_STATE.overviewBadge,
          overviewTitle: data.overviewTitle || DEFAULT_STATE.overviewTitle,
          paragraphs: data.paragraphs && data.paragraphs.length > 0 ? data.paragraphs : DEFAULT_STATE.paragraphs,
          visionBadge: data.visionBadge || DEFAULT_STATE.visionBadge,
          visionTitle: data.visionTitle || DEFAULT_STATE.visionTitle,
          vision: data.vision || DEFAULT_STATE.vision,
          missionBadge: data.missionBadge || DEFAULT_STATE.missionBadge,
          missionTitle: data.missionTitle || DEFAULT_STATE.missionTitle,
          mission: data.mission && data.mission.length > 0 ? data.mission : DEFAULT_STATE.mission,
          objectivesBadge: data.objectivesBadge || DEFAULT_STATE.objectivesBadge,
          objectivesTitle: data.objectivesTitle || DEFAULT_STATE.objectivesTitle,
          objectives: data.objectives && data.objectives.length > 0 ? data.objectives : DEFAULT_STATE.objectives,
          fundedProjectsBadge: data.fundedProjectsBadge || DEFAULT_STATE.fundedProjectsBadge,
          fundedProjectsTitle: data.fundedProjectsTitle || DEFAULT_STATE.fundedProjectsTitle,
          fundedProjects:
            data.fundedProjects && data.fundedProjects.length > 0
              ? data.fundedProjects
              : DEFAULT_STATE.fundedProjects,
          facultyResearchBadge: data.facultyResearchBadge || DEFAULT_STATE.facultyResearchBadge,
          facultyResearchTitle: data.facultyResearchTitle || DEFAULT_STATE.facultyResearchTitle,
          facultyResearch:
            data.facultyResearch && data.facultyResearch.length > 0
              ? data.facultyResearch
              : DEFAULT_STATE.facultyResearch,
          outcomesBadge: data.outcomesBadge || DEFAULT_STATE.outcomesBadge,
          outcomesTitle: data.outcomesTitle || DEFAULT_STATE.outcomesTitle,
          outcomesSubtext: data.outcomesSubtext || DEFAULT_STATE.outcomesSubtext,
          outcomes: data.outcomes && data.outcomes.length > 0 ? data.outcomes : DEFAULT_STATE.outcomes,
          teamBadge: data.teamBadge || DEFAULT_STATE.teamBadge,
          teamTitle: data.teamTitle || DEFAULT_STATE.teamTitle,
          team: {
            inCharge:
              data.team?.inCharge && data.team.inCharge.length > 0
                ? data.team.inCharge
                : DEFAULT_STATE.team!.inCharge,
            facultyMembers:
              data.team?.facultyMembers && data.team.facultyMembers.length > 0
                ? data.team.facultyMembers
                : DEFAULT_STATE.team!.facultyMembers,
          },
          activitiesBadge: data.activitiesBadge || DEFAULT_STATE.activitiesBadge,
          activitiesTitle: data.activitiesTitle || DEFAULT_STATE.activitiesTitle,
          activities: data.activities && data.activities.length > 0 ? data.activities : DEFAULT_STATE.activities,
          highlightsBadge: data.highlightsBadge || DEFAULT_STATE.highlightsBadge,
          highlightsTitle: data.highlightsTitle || DEFAULT_STATE.highlightsTitle,
          highlights: data.highlights && data.highlights.length > 0 ? data.highlights : DEFAULT_STATE.highlights,
          facilitiesBadge: data.facilitiesBadge || DEFAULT_STATE.facilitiesBadge,
          facilitiesTitle: data.facilitiesTitle || DEFAULT_STATE.facilitiesTitle,
          facilities: data.facilities && data.facilities.length > 0 ? data.facilities : DEFAULT_STATE.facilities,
          partnersBadge: data.partnersBadge || DEFAULT_STATE.partnersBadge,
          partnersTitle: data.partnersTitle || DEFAULT_STATE.partnersTitle,
          partners: data.partners && data.partners.length > 0 ? data.partners : DEFAULT_STATE.partners,
          additionalSections: data.additionalSections || [],
        });
      }
      setHasInitialized(true);
    }
  }, [data, loading, hasInitialized]);

  const save = async () => {
    setSaving(true);
    try {
      await setDoc(
        doc(db, 'settings', 'hpcLab'),
        {
          ...form,
          updatedAt: serverTimestamp(),
        },
        { merge: true }
      );
      alert('High Performance Computing (HPC) Lab content updated successfully!');
    } catch (e) {
      alert(`Couldn't save: ${(e as Error).message}`);
    } finally {
      setSaving(false);
    }
  };

  const resetToDefaults = () => {
    if (confirm('Reset all HPC Lab text to default starting values? You can still edit before saving.')) {
      setForm(DEFAULT_STATE);
    }
  };

  const navTabs = [
    { key: 'telemetry', label: '1. Telemetry Metrics', icon: Cpu },
    { key: 'overview', label: '2. Overview & Purpose', icon: Compass },
    { key: 'vision-mission', label: '3. Vision & Mission', icon: Target },
    { key: 'objectives', label: '4. Strategic Objectives', icon: Sparkles },
    { key: 'funded-projects', label: '5. Funded Projects', icon: Award },
    { key: 'faculty-research', label: '6. Faculty Research', icon: Code2 },
    { key: 'outcomes', label: '7. Outcomes & Publications', icon: BookOpen },
    { key: 'team', label: '8. Lab Team Roster', icon: Users },
    { key: 'activities', label: '9. Workshops & Activities', icon: Calendar },
    { key: 'highlights', label: '10. Key Highlights', icon: Zap },
    { key: 'facilities', label: '11. Facilities & Equipment', icon: Wrench },
    { key: 'partners', label: '12. Partners', icon: Handshake },
    { key: 'custom-sections', label: '13. Custom Section', icon: Layers },
  ];

  return (
    <div style={{ background: '#fff', borderRadius: '12px', border: '1px solid #E2E8F0', padding: '1.5rem', marginTop: '1.5rem' }}>
      {/* Top Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem', borderBottom: '1px solid #E2E8F0', paddingBottom: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
            <span style={{ display: 'inline-flex', padding: '0.2rem 0.5rem', background: '#0F766E', color: '#fff', fontSize: '0.75rem', fontWeight: 700, borderRadius: '4px' }}>
              Differentiators
            </span>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0B1E42', margin: 0 }}>
              High Performance Computing (HPC) Lab — Page Content & Sections
            </h2>
          </div>
          <p style={{ fontSize: '0.85rem', color: '#64748B', margin: 0 }}>
            Dynamically edit all sections in the exact order they appear on the public page: Telemetry Stats, Overview, Vision & Mission, Objectives, Funded Projects, Faculty Research, Publications, Team Roster, Workshops, Key Highlights, Facilities & Equipment, Partners, and Custom Sections.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button type="button" onClick={resetToDefaults} className="admin-btn-secondary" style={{ fontSize: '0.8rem', padding: '0.45rem 0.85rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <RotateCcw size={14} /> Reset Defaults
          </button>
          <button type="button" onClick={save} disabled={saving} className="admin-btn-primary" style={{ fontSize: '0.8rem', padding: '0.45rem 1.1rem', background: '#008080', borderColor: '#008080', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <Save size={14} /> {saving ? 'Saving...' : 'Save HPC Lab Content'}
          </button>
        </div>
      </div>

      {/* Subtabs Navigation matching exact public page order */}
      <div style={{ display: 'flex', gap: '0.35rem', overflowX: 'auto', paddingBottom: '0.75rem', marginBottom: '1.5rem', borderBottom: '2px solid #F1F5F9' }}>
        {navTabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActiveTab(tab.key as ActiveSubSection)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
                padding: '0.45rem 0.85rem',
                fontSize: '0.8rem',
                fontWeight: 700,
                borderRadius: '6px',
                border: 'none',
                background: isActive ? '#0B1E42' : '#F1F5F9',
                color: isActive ? '#fff' : '#475569',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                transition: 'all 0.15s ease',
              }}
            >
              <Icon size={14} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* TAB 1: TELEMETRY METRICS BANNER */}
      {activeTab === 'telemetry' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '8px', padding: '1rem' }}>
            <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '0.95rem', fontWeight: 800, color: '#0B1E42', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Cpu size={16} /> Supercomputing Telemetry Metric Banner (4 Stat Cards)
            </h3>
            <p style={{ margin: 0, fontSize: '0.825rem', color: '#64748B' }}>
              Displayed at the very top of the High Performance Computing Lab page as 4 highlighted telemetry statistics.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
            {/* Stat 1 */}
            <div style={{ background: '#fff', border: '1px solid #E2E8F0', borderRadius: '8px', padding: '1rem' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#008080', textTransform: 'uppercase' }}>Stat Card #1 (Icon: Cpu)</span>
              <div style={{ marginTop: '0.5rem' }}>
                <label className="admin-label">Metric Value</label>
                <input
                  type="text"
                  className="admin-input"
                  value={form.telemetry?.stat1?.value || ''}
                  onChange={(e) =>
                    setForm((p) => ({
                      ...p,
                      telemetry: {
                        ...p.telemetry,
                        stat1: { ...p.telemetry?.stat1, value: e.target.value, label: p.telemetry?.stat1?.label || '' },
                      },
                    }))
                  }
                  placeholder="2021"
                />
              </div>
              <div style={{ marginTop: '0.5rem' }}>
                <label className="admin-label">Metric Label</label>
                <input
                  type="text"
                  className="admin-input"
                  value={form.telemetry?.stat1?.label || ''}
                  onChange={(e) =>
                    setForm((p) => ({
                      ...p,
                      telemetry: {
                        ...p.telemetry,
                        stat1: { ...p.telemetry?.stat1, label: e.target.value, value: p.telemetry?.stat1?.value || '' },
                      },
                    }))
                  }
                  placeholder="Established Year"
                />
              </div>
            </div>

            {/* Stat 2 */}
            <div style={{ background: '#fff', border: '1px solid #E2E8F0', borderRadius: '8px', padding: '1rem' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#008080', textTransform: 'uppercase' }}>Stat Card #2 (Icon: Award)</span>
              <div style={{ marginTop: '0.5rem' }}>
                <label className="admin-label">Metric Value</label>
                <input
                  type="text"
                  className="admin-input"
                  value={form.telemetry?.stat2?.value || ''}
                  onChange={(e) =>
                    setForm((p) => ({
                      ...p,
                      telemetry: {
                        ...p.telemetry,
                        stat2: { ...p.telemetry?.stat2, value: e.target.value, label: p.telemetry?.stat2?.label || '' },
                      },
                    }))
                  }
                  placeholder="DST R&D"
                />
              </div>
              <div style={{ marginTop: '0.5rem' }}>
                <label className="admin-label">Metric Label</label>
                <input
                  type="text"
                  className="admin-input"
                  value={form.telemetry?.stat2?.label || ''}
                  onChange={(e) =>
                    setForm((p) => ({
                      ...p,
                      telemetry: {
                        ...p.telemetry,
                        stat2: { ...p.telemetry?.stat2, label: e.target.value, value: p.telemetry?.stat2?.value || '' },
                      },
                    }))
                  }
                  placeholder="Sponsored Grant"
                />
              </div>
            </div>

            {/* Stat 3 */}
            <div style={{ background: '#fff', border: '1px solid #E2E8F0', borderRadius: '8px', padding: '1rem' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#008080', textTransform: 'uppercase' }}>Stat Card #3 (Icon: BookOpen)</span>
              <div style={{ marginTop: '0.5rem' }}>
                <label className="admin-label">Metric Value</label>
                <input
                  type="text"
                  className="admin-input"
                  value={form.telemetry?.stat3?.value || ''}
                  onChange={(e) =>
                    setForm((p) => ({
                      ...p,
                      telemetry: {
                        ...p.telemetry,
                        stat3: { ...p.telemetry?.stat3, value: e.target.value, label: p.telemetry?.stat3?.label || '' },
                      },
                    }))
                  }
                  placeholder="9+"
                />
              </div>
              <div style={{ marginTop: '0.5rem' }}>
                <label className="admin-label">Metric Label</label>
                <input
                  type="text"
                  className="admin-input"
                  value={form.telemetry?.stat3?.label || ''}
                  onChange={(e) =>
                    setForm((p) => ({
                      ...p,
                      telemetry: {
                        ...p.telemetry,
                        stat3: { ...p.telemetry?.stat3, label: e.target.value, value: p.telemetry?.stat3?.value || '' },
                      },
                    }))
                  }
                  placeholder="IEEE & Scopus Papers"
                />
              </div>
            </div>

            {/* Stat 4 */}
            <div style={{ background: '#fff', border: '1px solid #E2E8F0', borderRadius: '8px', padding: '1rem' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#008080', textTransform: 'uppercase' }}>Stat Card #4 (Icon: Calendar)</span>
              <div style={{ marginTop: '0.5rem' }}>
                <label className="admin-label">Metric Value</label>
                <input
                  type="text"
                  className="admin-input"
                  value={form.telemetry?.stat4?.value || ''}
                  onChange={(e) =>
                    setForm((p) => ({
                      ...p,
                      telemetry: {
                        ...p.telemetry,
                        stat4: { ...p.telemetry?.stat4, value: e.target.value, label: p.telemetry?.stat4?.label || '' },
                      },
                    }))
                  }
                  placeholder="6+"
                />
              </div>
              <div style={{ marginTop: '0.5rem' }}>
                <label className="admin-label">Metric Label</label>
                <input
                  type="text"
                  className="admin-input"
                  value={form.telemetry?.stat4?.label || ''}
                  onChange={(e) =>
                    setForm((p) => ({
                      ...p,
                      telemetry: {
                        ...p.telemetry,
                        stat4: { ...p.telemetry?.stat4, label: e.target.value, value: p.telemetry?.stat4?.value || '' },
                      },
                    }))
                  }
                  placeholder="Specialized Workshops"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: OVERVIEW & PURPOSE */}
      {activeTab === 'overview' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '1rem' }}>
            <div>
              <label className="admin-label">Badge Label</label>
              <input
                type="text"
                className="admin-input"
                value={form.overviewBadge || ''}
                onChange={(e) => setForm((p) => ({ ...p, overviewBadge: e.target.value }))}
                placeholder="Centre of Excellence"
              />
            </div>
            <div>
              <label className="admin-label">Section Heading</label>
              <input
                type="text"
                className="admin-input"
                value={form.overviewTitle || ''}
                onChange={(e) => setForm((p) => ({ ...p, overviewTitle: e.target.value }))}
                placeholder="High Performance Computing (HPC) Lab"
              />
            </div>
          </div>

          <div>
            <label className="admin-label">Overview Paragraphs</label>
            <p style={{ fontSize: '0.8rem', color: '#64748B', margin: '0 0 0.5rem 0' }}>
              Each paragraph is rendered as a stylized lead paragraph. You can wrap text in **asterisks** for bold emphasis.
            </p>
            {(form.paragraphs || []).map((p, idx) => (
              <div key={idx} style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#94A3B8', marginTop: '0.5rem', minWidth: '24px' }}>
                  #{idx + 1}
                </span>
                <textarea
                  className="admin-textarea"
                  rows={3}
                  value={p}
                  onChange={(e) => {
                    const list = [...(form.paragraphs || [])];
                    list[idx] = e.target.value;
                    setForm((prev) => ({ ...prev, paragraphs: list }));
                  }}
                />
                <button
                  type="button"
                  onClick={() => {
                    const list = (form.paragraphs || []).filter((_, i) => i !== idx);
                    setForm((prev) => ({ ...prev, paragraphs: list }));
                  }}
                  className="admin-btn-danger"
                  style={{ alignSelf: 'flex-start', padding: '0.4rem 0.6rem' }}
                  title="Remove paragraph"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => setForm((prev) => ({ ...prev, paragraphs: [...(prev.paragraphs || []), ''] }))}
              className="admin-btn-secondary"
              style={{ fontSize: '0.8rem', marginTop: '0.25rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}
            >
              <Plus size={14} /> Add Paragraph
            </button>
          </div>
        </div>
      )}

      {/* TAB 3: VISION & MISSION */}
      {activeTab === 'vision-mission' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Vision Block */}
          <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '8px', padding: '1.25rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '1rem', marginBottom: '1rem' }}>
              <div>
                <label className="admin-label">Vision Badge</label>
                <input
                  type="text"
                  className="admin-input"
                  value={form.visionBadge || ''}
                  onChange={(e) => setForm((p) => ({ ...p, visionBadge: e.target.value }))}
                  placeholder="Vision"
                />
              </div>
              <div>
                <label className="admin-label">Vision Title</label>
                <input
                  type="text"
                  className="admin-input"
                  value={form.visionTitle || ''}
                  onChange={(e) => setForm((p) => ({ ...p, visionTitle: e.target.value }))}
                  placeholder="Our Vision"
                />
              </div>
            </div>
            <div>
              <label className="admin-label">Vision Statement</label>
              <textarea
                className="admin-textarea"
                rows={3}
                value={form.vision || ''}
                onChange={(e) => setForm((p) => ({ ...p, vision: e.target.value }))}
                placeholder="Our vision is to enable researchers to undertake cutting-edge computation science..."
              />
            </div>
          </div>

          {/* Mission Block */}
          <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '8px', padding: '1.25rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '1rem', marginBottom: '1rem' }}>
              <div>
                <label className="admin-label">Mission Badge</label>
                <input
                  type="text"
                  className="admin-input"
                  value={form.missionBadge || ''}
                  onChange={(e) => setForm((p) => ({ ...p, missionBadge: e.target.value }))}
                  placeholder="Mission"
                />
              </div>
              <div>
                <label className="admin-label">Mission Title</label>
                <input
                  type="text"
                  className="admin-input"
                  value={form.missionTitle || ''}
                  onChange={(e) => setForm((p) => ({ ...p, missionTitle: e.target.value }))}
                  placeholder="Our Mission"
                />
              </div>
            </div>
            <div>
              <label className="admin-label">Mission Points</label>
              {(form.mission || []).map((m, idx) => (
                <div key={idx} style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem', alignItems: 'center' }}>
                  <CheckCircle2 size={16} color="#008080" />
                  <input
                    type="text"
                    className="admin-input"
                    value={m}
                    onChange={(e) => {
                      const list = [...(form.mission || [])];
                      list[idx] = e.target.value;
                      setForm((p) => ({ ...p, mission: list }));
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const list = (form.mission || []).filter((_, i) => i !== idx);
                      setForm((p) => ({ ...p, mission: list }));
                    }}
                    className="admin-btn-danger"
                    style={{ padding: '0.4rem 0.6rem' }}
                    title="Remove point"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => setForm((p) => ({ ...p, mission: [...(p.mission || []), ''] }))}
                className="admin-btn-secondary"
                style={{ fontSize: '0.8rem', marginTop: '0.25rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}
              >
                <Plus size={14} /> Add Mission Point
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: STRATEGIC OBJECTIVES */}
      {activeTab === 'objectives' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '1rem' }}>
            <div>
              <label className="admin-label">Badge Label</label>
              <input
                type="text"
                className="admin-input"
                value={form.objectivesBadge || ''}
                onChange={(e) => setForm((p) => ({ ...p, objectivesBadge: e.target.value }))}
                placeholder="Key Objectives"
              />
            </div>
            <div>
              <label className="admin-label">Section Title</label>
              <input
                type="text"
                className="admin-input"
                value={form.objectivesTitle || ''}
                onChange={(e) => setForm((p) => ({ ...p, objectivesTitle: e.target.value }))}
                placeholder="Strategic Objectives"
              />
            </div>
          </div>

          <div>
            <label className="admin-label">Strategic Objectives List</label>
            <p style={{ fontSize: '0.8rem', color: '#64748B', margin: '0 0 0.5rem 0' }}>
              Displayed on the website as numbered objective cards (01, 02, 03...).
            </p>
            {(form.objectives || []).map((obj, idx) => (
              <div key={idx} style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem', alignItems: 'flex-start' }}>
                <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#008080', background: '#E6FFFA', padding: '0.35rem 0.6rem', borderRadius: '4px', minWidth: '36px', textAlign: 'center' }}>
                  {String(idx + 1).padStart(2, '0')}
                </span>
                <textarea
                  className="admin-textarea"
                  rows={2}
                  value={obj}
                  onChange={(e) => {
                    const list = [...(form.objectives || [])];
                    list[idx] = e.target.value;
                    setForm((p) => ({ ...p, objectives: list }));
                  }}
                />
                <button
                  type="button"
                  onClick={() => {
                    const list = (form.objectives || []).filter((_, i) => i !== idx);
                    setForm((p) => ({ ...p, objectives: list }));
                  }}
                  className="admin-btn-danger"
                  style={{ padding: '0.4rem 0.6rem', alignSelf: 'flex-start' }}
                  title="Remove objective"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => setForm((p) => ({ ...p, objectives: [...(p.objectives || []), ''] }))}
              className="admin-btn-secondary"
              style={{ fontSize: '0.8rem', marginTop: '0.25rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}
            >
              <Plus size={14} /> Add Objective
            </button>
          </div>
        </div>
      )}

      {/* TAB 5: FUNDED RESEARCH PROJECTS */}
      {activeTab === 'funded-projects' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '1rem' }}>
            <div>
              <label className="admin-label">Badge Label</label>
              <input
                type="text"
                className="admin-input"
                value={form.fundedProjectsBadge || ''}
                onChange={(e) => setForm((p) => ({ ...p, fundedProjectsBadge: e.target.value }))}
                placeholder="DST Sponsored R&D"
              />
            </div>
            <div>
              <label className="admin-label">Section Heading</label>
              <input
                type="text"
                className="admin-input"
                value={form.fundedProjectsTitle || ''}
                onChange={(e) => setForm((p) => ({ ...p, fundedProjectsTitle: e.target.value }))}
                placeholder="Funded Research Projects"
              />
            </div>
          </div>

          <div>
            <label className="admin-label">Funded Projects Roster</label>
            {(form.fundedProjects || []).map((proj, idx) => {
              const isObj = typeof proj === 'object' && proj !== null;
              const tag = isObj ? proj.tag || '' : 'DST Sponsored Project';
              const grantNo = isObj ? proj.grantNo || '' : '';
              const desc = isObj ? proj.description : String(proj);

              return (
                <div
                  key={idx}
                  style={{
                    background: '#F8FAFC',
                    border: '1px solid #E2E8F0',
                    borderRadius: '8px',
                    padding: '1rem',
                    marginBottom: '0.75rem',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.5rem',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#008080' }}>
                      Funded Project #{idx + 1}
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        const list = (form.fundedProjects || []).filter((_, i) => i !== idx);
                        setForm((p) => ({ ...p, fundedProjects: list }));
                      }}
                      className="admin-btn-danger"
                      style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}
                    >
                      <Trash2 size={12} /> Remove
                    </button>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                    <div>
                      <label className="admin-label" style={{ fontSize: '0.75rem' }}>Sponsor / Tag</label>
                      <input
                        type="text"
                        className="admin-input"
                        value={tag}
                        placeholder="DST Sponsored Project"
                        onChange={(e) => {
                          const list = [...(form.fundedProjects || [])];
                          list[idx] = { tag: e.target.value, grantNo, description: desc };
                          setForm((p) => ({ ...p, fundedProjects: list }));
                        }}
                      />
                    </div>
                    <div>
                      <label className="admin-label" style={{ fontSize: '0.75rem' }}>Grant / Sanction No.</label>
                      <input
                        type="text"
                        className="admin-input"
                        value={grantNo}
                        placeholder="DST /SEED/SCSP/STI/ 2019/140/G"
                        onChange={(e) => {
                          const list = [...(form.fundedProjects || [])];
                          list[idx] = { tag, grantNo: e.target.value, description: desc };
                          setForm((p) => ({ ...p, fundedProjects: list }));
                        }}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="admin-label" style={{ fontSize: '0.75rem' }}>Project Description / Outcome</label>
                    <textarea
                      className="admin-textarea"
                      rows={2}
                      value={desc}
                      placeholder="Project description or outcomes..."
                      onChange={(e) => {
                        const list = [...(form.fundedProjects || [])];
                        list[idx] = { tag, grantNo, description: e.target.value };
                        setForm((p) => ({ ...p, fundedProjects: list }));
                      }}
                    />
                  </div>
                </div>
              );
            })}
            <button
              type="button"
              onClick={() =>
                setForm((p) => ({
                  ...p,
                  fundedProjects: [
                    ...(p.fundedProjects || []),
                    { tag: 'DST Sponsored Project', grantNo: '', description: '' },
                  ],
                }))
              }
              className="admin-btn-secondary"
              style={{ fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}
            >
              <Plus size={14} /> Add Funded Project
            </button>
          </div>
        </div>
      )}

      {/* TAB 6: FACULTY RESEARCH INITIATIVES */}
      {activeTab === 'faculty-research' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '1rem' }}>
            <div>
              <label className="admin-label">Badge Label</label>
              <input
                type="text"
                className="admin-input"
                value={form.facultyResearchBadge || ''}
                onChange={(e) => setForm((p) => ({ ...p, facultyResearchBadge: e.target.value }))}
                placeholder="Deep Learning & Computer Vision"
              />
            </div>
            <div>
              <label className="admin-label">Section Heading</label>
              <input
                type="text"
                className="admin-input"
                value={form.facultyResearchTitle || ''}
                onChange={(e) => setForm((p) => ({ ...p, facultyResearchTitle: e.target.value }))}
                placeholder="Faculty Research Initiatives"
              />
            </div>
          </div>

          <div>
            <label className="admin-label">Faculty Research Initiatives</label>
            <p style={{ fontSize: '0.8rem', color: '#64748B', margin: '0 0 0.5rem 0' }}>
              Specific research topics and DL/ML implementations carried out by faculty members.
            </p>
            {(form.facultyResearch || []).map((res, idx) => (
              <div key={idx} style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#94A3B8', marginTop: '0.5rem', minWidth: '24px' }}>
                  #{idx + 1}
                </span>
                <textarea
                  className="admin-textarea"
                  rows={2}
                  value={res}
                  onChange={(e) => {
                    const list = [...(form.facultyResearch || [])];
                    list[idx] = e.target.value;
                    setForm((p) => ({ ...p, facultyResearch: list }));
                  }}
                />
                <button
                  type="button"
                  onClick={() => {
                    const list = (form.facultyResearch || []).filter((_, i) => i !== idx);
                    setForm((p) => ({ ...p, facultyResearch: list }));
                  }}
                  className="admin-btn-danger"
                  style={{ alignSelf: 'flex-start', padding: '0.4rem 0.6rem' }}
                  title="Remove initiative"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => setForm((p) => ({ ...p, facultyResearch: [...(p.facultyResearch || []), ''] }))}
              className="admin-btn-secondary"
              style={{ fontSize: '0.8rem', marginTop: '0.25rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}
            >
              <Plus size={14} /> Add Faculty Research Topic
            </button>
          </div>
        </div>
      )}

      {/* TAB 7: OUTCOMES & PUBLICATIONS */}
      {activeTab === 'outcomes' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '1rem' }}>
            <div>
              <label className="admin-label">Badge Label</label>
              <input
                type="text"
                className="admin-input"
                value={form.outcomesBadge || ''}
                onChange={(e) => setForm((p) => ({ ...p, outcomesBadge: e.target.value }))}
                placeholder="Research Output"
              />
            </div>
            <div>
              <label className="admin-label">Section Heading</label>
              <input
                type="text"
                className="admin-input"
                value={form.outcomesTitle || ''}
                onChange={(e) => setForm((p) => ({ ...p, outcomesTitle: e.target.value }))}
                placeholder="Outcomes & Publications"
              />
            </div>
          </div>

          <div>
            <label className="admin-label">Section Subtitle / Description</label>
            <input
              type="text"
              className="admin-input"
              value={form.outcomesSubtext || ''}
              onChange={(e) => setForm((p) => ({ ...p, outcomesSubtext: e.target.value }))}
              placeholder="High-impact research publications in reputed IEEE conferences and indexed journals."
            />
          </div>

          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
              <label className="admin-label" style={{ margin: 0 }}>Publications & Papers List</label>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#008080' }}>
                {(form.outcomes || []).length} Papers Total
              </span>
            </div>
            <p style={{ fontSize: '0.8rem', color: '#64748B', margin: '0 0 0.5rem 0' }}>
              Publications containing "IEEE" are automatically marked as IEEE Proceedings; "Journal" as Scopus Journals; and others as Book Chapters/Conferences.
            </p>
            {(form.outcomes || []).map((paper, idx) => (
              <div key={idx} style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#94A3B8', marginTop: '0.5rem', minWidth: '24px' }}>
                  #{idx + 1}
                </span>
                <textarea
                  className="admin-textarea"
                  rows={2}
                  value={paper}
                  onChange={(e) => {
                    const list = [...(form.outcomes || [])];
                    list[idx] = e.target.value;
                    setForm((p) => ({ ...p, outcomes: list }));
                  }}
                />
                <button
                  type="button"
                  onClick={() => {
                    const list = (form.outcomes || []).filter((_, i) => i !== idx);
                    setForm((p) => ({ ...p, outcomes: list }));
                  }}
                  className="admin-btn-danger"
                  style={{ alignSelf: 'flex-start', padding: '0.4rem 0.6rem' }}
                  title="Remove publication"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => setForm((p) => ({ ...p, outcomes: [...(p.outcomes || []), ''] }))}
              className="admin-btn-secondary"
              style={{ fontSize: '0.8rem', marginTop: '0.25rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}
            >
              <Plus size={14} /> Add Publication Paper
            </button>
          </div>
        </div>
      )}

      {/* TAB 8: LAB TEAM & LEADERSHIP */}
      {activeTab === 'team' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '1rem' }}>
            <div>
              <label className="admin-label">Badge Label</label>
              <input
                type="text"
                className="admin-input"
                value={form.teamBadge || ''}
                onChange={(e) => setForm((p) => ({ ...p, teamBadge: e.target.value }))}
                placeholder="Academic Experts"
              />
            </div>
            <div>
              <label className="admin-label">Section Heading</label>
              <input
                type="text"
                className="admin-input"
                value={form.teamTitle || ''}
                onChange={(e) => setForm((p) => ({ ...p, teamTitle: e.target.value }))}
                placeholder="HPC Lab Team & Leadership"
              />
            </div>
          </div>

          {/* Lab In-Charge Group */}
          <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '8px', padding: '1.25rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h4 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 800, color: '#0B1E42' }}>
                1. Lab In-Charge
              </h4>
              <button
                type="button"
                onClick={() => {
                  const inCharge = [...(form.team?.inCharge || [])];
                  inCharge.push({ name: '', designation: 'Professor', email: '', mobile: '', interests: '' });
                  setForm((p) => ({ ...p, team: { ...p.team, inCharge } }));
                }}
                className="admin-btn-secondary"
                style={{ fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}
              >
                <Plus size={12} /> Add Lab In-Charge
              </button>
            </div>

            {(form.team?.inCharge || []).map((m, idx) => (
              <div key={idx} style={{ background: '#fff', border: '1px solid #CBD5E1', borderRadius: '6px', padding: '1rem', marginBottom: '0.75rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#0F766E' }}>In-Charge #{idx + 1}</span>
                  <button
                    type="button"
                    onClick={() => {
                      const inCharge = (form.team?.inCharge || []).filter((_, i) => i !== idx);
                      setForm((p) => ({ ...p, team: { ...p.team, inCharge } }));
                    }}
                    className="admin-btn-danger"
                    style={{ padding: '0.2rem 0.5rem', fontSize: '0.75rem' }}
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.75rem' }}>
                  <div>
                    <label className="admin-label" style={{ fontSize: '0.75rem' }}>Name</label>
                    <input
                      type="text"
                      className="admin-input"
                      value={m.name}
                      placeholder="Dr. A Senthil Kumar"
                      onChange={(e) => {
                        const inCharge = [...(form.team?.inCharge || [])];
                        inCharge[idx] = { ...inCharge[idx], name: e.target.value };
                        setForm((p) => ({ ...p, team: { ...p.team, inCharge } }));
                      }}
                    />
                  </div>
                  <div>
                    <label className="admin-label" style={{ fontSize: '0.75rem' }}>Designation</label>
                    <input
                      type="text"
                      className="admin-input"
                      value={m.designation || ''}
                      placeholder="Professor"
                      onChange={(e) => {
                        const inCharge = [...(form.team?.inCharge || [])];
                        inCharge[idx] = { ...inCharge[idx], designation: e.target.value };
                        setForm((p) => ({ ...p, team: { ...p.team, inCharge } }));
                      }}
                    />
                  </div>
                  <div>
                    <label className="admin-label" style={{ fontSize: '0.75rem' }}>Specialization / Domain</label>
                    <input
                      type="text"
                      className="admin-input"
                      value={m.interests || ''}
                      placeholder="Deep Learning, Computer Networks"
                      onChange={(e) => {
                        const inCharge = [...(form.team?.inCharge || [])];
                        inCharge[idx] = { ...inCharge[idx], interests: e.target.value };
                        setForm((p) => ({ ...p, team: { ...p.team, inCharge } }));
                      }}
                    />
                  </div>
                  <div>
                    <label className="admin-label" style={{ fontSize: '0.75rem' }}>Email</label>
                    <input
                      type="email"
                      className="admin-input"
                      value={m.email || ''}
                      placeholder="drsenthilkumar@svecw.edu.in"
                      onChange={(e) => {
                        const inCharge = [...(form.team?.inCharge || [])];
                        inCharge[idx] = { ...inCharge[idx], email: e.target.value };
                        setForm((p) => ({ ...p, team: { ...p.team, inCharge } }));
                      }}
                    />
                  </div>
                  <div>
                    <label className="admin-label" style={{ fontSize: '0.75rem' }}>Mobile / Phone</label>
                    <input
                      type="text"
                      className="admin-input"
                      value={m.mobile || ''}
                      placeholder="99651 02017"
                      onChange={(e) => {
                        const inCharge = [...(form.team?.inCharge || [])];
                        inCharge[idx] = { ...inCharge[idx], mobile: e.target.value };
                        setForm((p) => ({ ...p, team: { ...p.team, inCharge } }));
                      }}
                    />
                  </div>
                  <div>
                    <label className="admin-label" style={{ fontSize: '0.75rem' }}>IRINS Profile Link</label>
                    <input
                      type="url"
                      className="admin-input"
                      value={m.profileLink || ''}
                      placeholder="https://svecw.irins.org/profile/..."
                      onChange={(e) => {
                        const inCharge = [...(form.team?.inCharge || [])];
                        inCharge[idx] = { ...inCharge[idx], profileLink: e.target.value };
                        setForm((p) => ({ ...p, team: { ...p.team, inCharge } }));
                      }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Faculty Members Group */}
          <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '8px', padding: '1.25rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h4 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 800, color: '#0B1E42' }}>
                2. Faculty Members
              </h4>
              <button
                type="button"
                onClick={() => {
                  const facultyMembers = [...(form.team?.facultyMembers || [])];
                  facultyMembers.push({ name: '', designation: 'Assistant Professor', email: '', mobile: '', interests: '' });
                  setForm((p) => ({ ...p, team: { ...p.team, facultyMembers } }));
                }}
                className="admin-btn-secondary"
                style={{ fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}
              >
                <Plus size={12} /> Add Faculty Member
              </button>
            </div>

            {(form.team?.facultyMembers || []).map((m, idx) => (
              <div key={idx} style={{ background: '#fff', border: '1px solid #CBD5E1', borderRadius: '6px', padding: '1rem', marginBottom: '0.75rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#0F766E' }}>Faculty Member #{idx + 1}</span>
                  <button
                    type="button"
                    onClick={() => {
                      const facultyMembers = (form.team?.facultyMembers || []).filter((_, i) => i !== idx);
                      setForm((p) => ({ ...p, team: { ...p.team, facultyMembers } }));
                    }}
                    className="admin-btn-danger"
                    style={{ padding: '0.2rem 0.5rem', fontSize: '0.75rem' }}
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.75rem' }}>
                  <div>
                    <label className="admin-label" style={{ fontSize: '0.75rem' }}>Name</label>
                    <input
                      type="text"
                      className="admin-input"
                      value={m.name}
                      placeholder="Dr. G Durga Prasad"
                      onChange={(e) => {
                        const facultyMembers = [...(form.team?.facultyMembers || [])];
                        facultyMembers[idx] = { ...facultyMembers[idx], name: e.target.value };
                        setForm((p) => ({ ...p, team: { ...p.team, facultyMembers } }));
                      }}
                    />
                  </div>
                  <div>
                    <label className="admin-label" style={{ fontSize: '0.75rem' }}>Designation</label>
                    <input
                      type="text"
                      className="admin-input"
                      value={m.designation || ''}
                      placeholder="Professor"
                      onChange={(e) => {
                        const facultyMembers = [...(form.team?.facultyMembers || [])];
                        facultyMembers[idx] = { ...facultyMembers[idx], designation: e.target.value };
                        setForm((p) => ({ ...p, team: { ...p.team, facultyMembers } }));
                      }}
                    />
                  </div>
                  <div>
                    <label className="admin-label" style={{ fontSize: '0.75rem' }}>Specialization / Domain</label>
                    <input
                      type="text"
                      className="admin-input"
                      value={m.interests || ''}
                      placeholder="Machine Learning applications"
                      onChange={(e) => {
                        const facultyMembers = [...(form.team?.facultyMembers || [])];
                        facultyMembers[idx] = { ...facultyMembers[idx], interests: e.target.value };
                        setForm((p) => ({ ...p, team: { ...p.team, facultyMembers } }));
                      }}
                    />
                  </div>
                  <div>
                    <label className="admin-label" style={{ fontSize: '0.75rem' }}>Email</label>
                    <input
                      type="email"
                      className="admin-input"
                      value={m.email || ''}
                      placeholder="faculty@svecw.edu.in"
                      onChange={(e) => {
                        const facultyMembers = [...(form.team?.facultyMembers || [])];
                        facultyMembers[idx] = { ...facultyMembers[idx], email: e.target.value };
                        setForm((p) => ({ ...p, team: { ...p.team, facultyMembers } }));
                      }}
                    />
                  </div>
                  <div>
                    <label className="admin-label" style={{ fontSize: '0.75rem' }}>Mobile / Phone</label>
                    <input
                      type="text"
                      className="admin-input"
                      value={m.mobile || ''}
                      placeholder="9833409326"
                      onChange={(e) => {
                        const facultyMembers = [...(form.team?.facultyMembers || [])];
                        facultyMembers[idx] = { ...facultyMembers[idx], mobile: e.target.value };
                        setForm((p) => ({ ...p, team: { ...p.team, facultyMembers } }));
                      }}
                    />
                  </div>
                  <div>
                    <label className="admin-label" style={{ fontSize: '0.75rem' }}>IRINS Profile Link</label>
                    <input
                      type="url"
                      className="admin-input"
                      value={m.profileLink || ''}
                      placeholder="https://svecw.irins.org/profile/..."
                      onChange={(e) => {
                        const facultyMembers = [...(form.team?.facultyMembers || [])];
                        facultyMembers[idx] = { ...facultyMembers[idx], profileLink: e.target.value };
                        setForm((p) => ({ ...p, team: { ...p.team, facultyMembers } }));
                      }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 9: WORKSHOPS & ACTIVITIES */}
      {activeTab === 'activities' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '1rem' }}>
            <div>
              <label className="admin-label">Badge Label</label>
              <input
                type="text"
                className="admin-input"
                value={form.activitiesBadge || ''}
                onChange={(e) => setForm((p) => ({ ...p, activitiesBadge: e.target.value }))}
                placeholder="Specialized Events"
              />
            </div>
            <div>
              <label className="admin-label">Section Heading</label>
              <input
                type="text"
                className="admin-input"
                value={form.activitiesTitle || ''}
                onChange={(e) => setForm((p) => ({ ...p, activitiesTitle: e.target.value }))}
                placeholder="Workshops & Training Activities"
              />
            </div>
          </div>

          <div>
            <label className="admin-label">Conducted Workshops, Expert Talks & Training Activities</label>
            <p style={{ fontSize: '0.8rem', color: '#64748B', margin: '0 0 0.5rem 0' }}>
              Displayed on the website as an interactive timeline under Capacity Building Events.
            </p>
            {(form.activities || []).map((act, idx) => (
              <div key={idx} style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#94A3B8', marginTop: '0.5rem', minWidth: '24px' }}>
                  #{idx + 1}
                </span>
                <textarea
                  className="admin-textarea"
                  rows={2}
                  value={act}
                  onChange={(e) => {
                    const list = [...(form.activities || [])];
                    list[idx] = e.target.value;
                    setForm((p) => ({ ...p, activities: list }));
                  }}
                />
                <button
                  type="button"
                  onClick={() => {
                    const list = (form.activities || []).filter((_, i) => i !== idx);
                    setForm((p) => ({ ...p, activities: list }));
                  }}
                  className="admin-btn-danger"
                  style={{ alignSelf: 'flex-start', padding: '0.4rem 0.6rem' }}
                  title="Remove activity"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => setForm((p) => ({ ...p, activities: [...(p.activities || []), ''] }))}
              className="admin-btn-secondary"
              style={{ fontSize: '0.8rem', marginTop: '0.25rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}
            >
              <Plus size={14} /> Add Workshop / Event
            </button>
          </div>
        </div>
      )}

      {/* TAB 10: KEY HIGHLIGHTS */}
      {activeTab === 'highlights' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '1rem' }}>
            <div>
              <label className="admin-label">Badge Label</label>
              <input
                type="text"
                className="admin-input"
                value={form.highlightsBadge || ''}
                onChange={(e) => setForm((p) => ({ ...p, highlightsBadge: e.target.value }))}
                placeholder="Core Highlights"
              />
            </div>
            <div>
              <label className="admin-label">Section Heading</label>
              <input
                type="text"
                className="admin-input"
                value={form.highlightsTitle || ''}
                onChange={(e) => setForm((p) => ({ ...p, highlightsTitle: e.target.value }))}
                placeholder="Key Highlights"
              />
            </div>
          </div>

          <div>
            <label className="admin-label">Key Highlights Points</label>
            <p style={{ fontSize: '0.8rem', color: '#64748B', margin: '0 0 0.5rem 0' }}>
              Displayed on the website in the Key Highlights accordion item.
            </p>
            {(form.highlights || []).map((h, idx) => (
              <div key={idx} style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem', alignItems: 'center' }}>
                <CheckCircle2 size={16} color="#008080" />
                <input
                  type="text"
                  className="admin-input"
                  value={h}
                  onChange={(e) => {
                    const list = [...(form.highlights || [])];
                    list[idx] = e.target.value;
                    setForm((p) => ({ ...p, highlights: list }));
                  }}
                />
                <button
                  type="button"
                  onClick={() => {
                    const list = (form.highlights || []).filter((_, i) => i !== idx);
                    setForm((p) => ({ ...p, highlights: list }));
                  }}
                  className="admin-btn-danger"
                  style={{ padding: '0.4rem 0.6rem' }}
                  title="Remove highlight"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => setForm((p) => ({ ...p, highlights: [...(p.highlights || []), ''] }))}
              className="admin-btn-secondary"
              style={{ fontSize: '0.8rem', marginTop: '0.25rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}
            >
              <Plus size={14} /> Add Key Highlight
            </button>
          </div>
        </div>
      )}

      {/* TAB 11: FACILITIES & EQUIPMENT */}
      {activeTab === 'facilities' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '1rem' }}>
            <div>
              <label className="admin-label">Badge Label</label>
              <input
                type="text"
                className="admin-input"
                value={form.facilitiesBadge || ''}
                onChange={(e) => setForm((p) => ({ ...p, facilitiesBadge: e.target.value }))}
                placeholder="Infrastructure"
              />
            </div>
            <div>
              <label className="admin-label">Section Heading</label>
              <input
                type="text"
                className="admin-input"
                value={form.facilitiesTitle || ''}
                onChange={(e) => setForm((p) => ({ ...p, facilitiesTitle: e.target.value }))}
                placeholder="Facilities & Equipment"
              />
            </div>
          </div>

          <div>
            <label className="admin-label">Facilities & Infrastructure Items</label>
            <p style={{ fontSize: '0.8rem', color: '#64748B', margin: '0 0 0.5rem 0' }}>
              Displayed on the website in the Facilities & Equipment accordion item.
            </p>
            {(form.facilities || []).map((f, idx) => (
              <div key={idx} style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem', alignItems: 'center' }}>
                <CheckCircle2 size={16} color="#008080" />
                <input
                  type="text"
                  className="admin-input"
                  value={f}
                  onChange={(e) => {
                    const list = [...(form.facilities || [])];
                    list[idx] = e.target.value;
                    setForm((p) => ({ ...p, facilities: list }));
                  }}
                />
                <button
                  type="button"
                  onClick={() => {
                    const list = (form.facilities || []).filter((_, i) => i !== idx);
                    setForm((p) => ({ ...p, facilities: list }));
                  }}
                  className="admin-btn-danger"
                  style={{ padding: '0.4rem 0.6rem' }}
                  title="Remove facility"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => setForm((p) => ({ ...p, facilities: [...(p.facilities || []), ''] }))}
              className="admin-btn-secondary"
              style={{ fontSize: '0.8rem', marginTop: '0.25rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}
            >
              <Plus size={14} /> Add Facility Item
            </button>
          </div>
        </div>
      )}

      {/* TAB 12: PARTNERS */}
      {activeTab === 'partners' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '1rem' }}>
            <div>
              <label className="admin-label">Badge Label</label>
              <input
                type="text"
                className="admin-input"
                value={form.partnersBadge || ''}
                onChange={(e) => setForm((p) => ({ ...p, partnersBadge: e.target.value }))}
                placeholder="Industry & Research"
              />
            </div>
            <div>
              <label className="admin-label">Section Heading</label>
              <input
                type="text"
                className="admin-input"
                value={form.partnersTitle || ''}
                onChange={(e) => setForm((p) => ({ ...p, partnersTitle: e.target.value }))}
                placeholder="Partners"
              />
            </div>
          </div>

          <div>
            <label className="admin-label">Partners & Collaborators List</label>
            <p style={{ fontSize: '0.8rem', color: '#64748B', margin: '0 0 0.5rem 0' }}>
              Displayed on the website in the Partners accordion item.
            </p>
            {(form.partners || []).map((part, idx) => (
              <div key={idx} style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem', alignItems: 'center' }}>
                <CheckCircle2 size={16} color="#008080" />
                <input
                  type="text"
                  className="admin-input"
                  value={part}
                  onChange={(e) => {
                    const list = [...(form.partners || [])];
                    list[idx] = e.target.value;
                    setForm((p) => ({ ...p, partners: list }));
                  }}
                />
                <button
                  type="button"
                  onClick={() => {
                    const list = (form.partners || []).filter((_, i) => i !== idx);
                    setForm((p) => ({ ...p, partners: list }));
                  }}
                  className="admin-btn-danger"
                  style={{ padding: '0.4rem 0.6rem' }}
                  title="Remove partner"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => setForm((p) => ({ ...p, partners: [...(p.partners || []), ''] }))}
              className="admin-btn-secondary"
              style={{ fontSize: '0.8rem', marginTop: '0.25rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}
            >
              <Plus size={14} /> Add Partner
            </button>
          </div>
        </div>
      )}

      {/* TAB 13: CUSTOM ADDITIONAL SECTIONS */}
      {activeTab === 'custom-sections' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h4 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 800, color: '#0B1E42' }}>
                Custom Additional Sections
              </h4>
              <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.8rem', color: '#64748B' }}>
                Add extra dynamic sections to appear at the bottom of the High Performance Computing Lab page.
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                const newId = `section-${Date.now()}`;
                setForm((p) => ({
                  ...p,
                  additionalSections: [
                    ...(p.additionalSections || []),
                    {
                      id: newId,
                      title: 'New Section',
                      badge: 'Supercomputing / AI Research',
                      paragraphs: ['Write section content here...'],
                      bulletPoints: [],
                    },
                  ],
                }));
              }}
              className="admin-btn-secondary"
              style={{ fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}
            >
              <Plus size={14} /> Add Section
            </button>
          </div>

          {(form.additionalSections || []).length === 0 ? (
            <div style={{ padding: '2rem', background: '#F8FAFC', borderRadius: '8px', textAlign: 'center', color: '#64748B', fontSize: '0.85rem' }}>
              No extra custom sections created yet. Click "+ Add Section" to add new blocks.
            </div>
          ) : (
            (form.additionalSections || []).map((sec, idx) => (
              <div key={sec.id} style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '8px', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontWeight: 800, fontSize: '0.85rem', color: '#0B1E42' }}>Section #{idx + 1}</span>
                  <button
                    type="button"
                    onClick={() => {
                      setForm((p) => ({
                        ...p,
                        additionalSections: (p.additionalSections || []).filter((_, i) => i !== idx),
                      }));
                    }}
                    className="admin-btn-danger"
                    style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem' }}
                  >
                    <Trash2 size={12} /> Delete Section
                  </button>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                  <div>
                    <label className="admin-label">Section Title</label>
                    <input
                      type="text"
                      className="admin-input"
                      value={sec.title}
                      onChange={(e) => {
                        const list = [...(form.additionalSections || [])];
                        list[idx] = { ...list[idx], title: e.target.value };
                        setForm((p) => ({ ...p, additionalSections: list }));
                      }}
                    />
                  </div>
                  <div>
                    <label className="admin-label">Badge Label</label>
                    <input
                      type="text"
                      className="admin-input"
                      value={sec.badge || ''}
                      onChange={(e) => {
                        const list = [...(form.additionalSections || [])];
                        list[idx] = { ...list[idx], badge: e.target.value };
                        setForm((p) => ({ ...p, additionalSections: list }));
                      }}
                    />
                  </div>
                </div>
                <div>
                  <label className="admin-label">Paragraphs (one per line)</label>
                  <textarea
                    className="admin-textarea"
                    rows={3}
                    value={(sec.paragraphs || []).join('\n')}
                    onChange={(e) => {
                      const list = [...(form.additionalSections || [])];
                      list[idx] = { ...list[idx], paragraphs: e.target.value.split('\n') };
                      setForm((p) => ({ ...p, additionalSections: list }));
                    }}
                  />
                </div>
                <div>
                  <label className="admin-label">Bullet Points (one per line, optional)</label>
                  <textarea
                    className="admin-textarea"
                    rows={2}
                    value={(sec.bulletPoints || []).join('\n')}
                    placeholder="Enter bullet points (optional)..."
                    onChange={(e) => {
                      const list = [...(form.additionalSections || [])];
                      list[idx] = { ...list[idx], bulletPoints: e.target.value.split('\n').filter(Boolean) };
                      setForm((p) => ({ ...p, additionalSections: list }));
                    }}
                  />
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Bottom Save Bar */}
      <div style={{ marginTop: '2rem', paddingTop: '1rem', borderTop: '1px solid #E2E8F0', display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
        <button type="button" onClick={save} disabled={saving} className="admin-btn-primary" style={{ padding: '0.6rem 1.5rem', background: '#008080', borderColor: '#008080', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <Save size={16} /> {saving ? 'Saving...' : 'Save HPC Lab Content'}
        </button>
      </div>
    </div>
  );
}
