import { useState, useEffect } from 'react';
import { doc, getDoc, serverTimestamp } from 'firebase/firestore';
import { setDoc } from '../../../lib/auditLog';
import { db } from '../../../lib/firebase';
import {
  concreteCanoeLab,
  type CanoeMember,
  type CanoeCompetition,
  type CanoeSimpleTable,
  type CanoeStudentTeam,
} from '../../Differentiators/concreteCanoeLab.data';
import {
  Plus,
  Trash2,
  Save,
  RotateCcw,
  Sparkles,
  BookOpen,
  Users,
  Award,
  Trophy,
  Compass,
  Target,
  FlaskConical,
  Layers,
  Calendar,
  Image as ImageIcon,
  CheckCircle2,
  Wrench,
  Zap,
} from 'lucide-react';
import ImageUploader from '../../../components/ImageUploader/ImageUploader';
import type { UploadResult } from '../../../lib/storage';

export interface CanoeGalleryPhoto {
  imageUrl: string;
  caption?: string;
  storagePath?: string;
}

export interface CustomCanoeSection {
  id: string;
  title: string;
  badge?: string;
  paragraphs?: string[];
  bulletPoints?: string[];
}

export interface ConcreteCanoeDoc {
  // 1. Overview & Purpose
  overviewBadge?: string;
  overviewTitle?: string;
  paragraphs: string[];
  // 2. Vision & Mission
  vision: string;
  mission: string[];
  // 3. Objectives
  objectives: string[];
  // 4. Startup Incubation (ITIC BUILD)
  outcomes: {
    heading: string;
    subheading: string;
    paragraphs: string[];
    brief: string;
    team: CanoeSimpleTable;
  };
  // 5. Academic Research Project
  academicProject: {
    heading: string;
    paragraphs: string[];
    team: CanoeSimpleTable;
  };
  // 6. Fleet Evolution Matrix
  previousProjects: {
    table: CanoeSimpleTable;
  };
  // 7. Competitions & Accolades
  competitions: CanoeCompetition[];
  // 8. National Event (NCCC)
  activities: string[];
  // 9. Faculty Leadership & Mentors
  inCharge: CanoeMember;
  facultyMentors: string[];
  // 10. Student Cohorts Benefited
  studentsBenefited: CanoeStudentTeam[];
  // 11. Photo Gallery
  gallery?: CanoeGalleryPhoto[];
  // 12. Key Highlights & Facilities
  highlights?: string[];
  facilities?: string[];
  // 13. Dynamic Custom Sections
  additionalSections?: CustomCanoeSection[];
}

const DEFAULT_HIGHLIGHTS = [
  'First-ever concrete canoe engineering initiative in Andhra Pradesh and Telangana dedicated to women engineers.',
  'Pioneering sustainable aquaculture boat designs using lightweight concrete and eco-friendly additives.',
  'National Concrete Canoe Competition (NCCC) host institution with over 10 collegiate teams participating.',
  'Winners of IIT Hyderabad ITIC BUILD incubation grant (₹1 Lakh) for industry-ready marine prototype.',
];

const DEFAULT_FACILITIES = [
  'Dedicated Concrete Technology & Materials Characterization Lab',
  'Lightweight composite mix design, cenosphere & metakaolin testing tanks',
  'Marine 3D Hull Modelling & Hydrodynamic Stabilizer Suite (Maxsurf, AutoCAD, STAAD Pro, Bearcat SP)',
  'Casting moulds & specialized fibre mesh reinforcement fabrication facilities',
];

const DEFAULT_STATE: ConcreteCanoeDoc = {
  overviewBadge: 'Center of Excellence',
  overviewTitle: 'About the Concrete Canoe Laboratory',
  paragraphs: [...concreteCanoeLab.paragraphs],
  vision: concreteCanoeLab.vision,
  mission: [...concreteCanoeLab.mission],
  objectives: [...concreteCanoeLab.objectives],
  outcomes: {
    heading: concreteCanoeLab.outcomes.heading,
    subheading: concreteCanoeLab.outcomes.subheading,
    paragraphs: [...concreteCanoeLab.outcomes.paragraphs],
    brief: concreteCanoeLab.outcomes.brief,
    team: {
      headers: [...concreteCanoeLab.outcomes.team.headers],
      rows: concreteCanoeLab.outcomes.team.rows.map((r) => ({ cells: [...r.cells] })),
    },
  },
  academicProject: {
    heading: concreteCanoeLab.academicProject.heading,
    paragraphs: [...concreteCanoeLab.academicProject.paragraphs],
    team: {
      headers: [...concreteCanoeLab.academicProject.team.headers],
      rows: concreteCanoeLab.academicProject.team.rows.map((r) => ({ cells: [...r.cells] })),
    },
  },
  previousProjects: {
    table: {
      headers: [...concreteCanoeLab.previousProjects.table.headers],
      rows: concreteCanoeLab.previousProjects.table.rows.map((r) => ({ cells: [...r.cells] })),
    },
  },
  competitions: concreteCanoeLab.competitions.map((c) => ({ ...c, students: [...c.students] })),
  activities: [...concreteCanoeLab.activities],
  inCharge: { ...concreteCanoeLab.inCharge },
  facultyMentors: [...concreteCanoeLab.facultyMentors],
  studentsBenefited: concreteCanoeLab.studentsBenefited.map((t) => ({ ...t, students: [...t.students] })),
  gallery: [],
  highlights: [...DEFAULT_HIGHLIGHTS],
  facilities: [...DEFAULT_FACILITIES],
  additionalSections: [],
};

type ActiveSubSection =
  | 'overview'
  | 'vision-mission'
  | 'objectives'
  | 'incubation'
  | 'academic-project'
  | 'fleet'
  | 'competitions'
  | 'events'
  | 'leadership'
  | 'students'
  | 'gallery'
  | 'highlights'
  | 'custom-sections';

export default function ConcreteCanoeContentAdmin() {
  const [data, setData] = useState<ConcreteCanoeDoc>(DEFAULT_STATE);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<ActiveSubSection>('overview');

  useEffect(() => {
    async function loadData() {
      try {
        const snap = await getDoc(doc(db, 'settings', 'concreteCanoeLab'));
        if (snap.exists()) {
          const remote = snap.data() as Partial<ConcreteCanoeDoc>;
          setData({
            ...DEFAULT_STATE,
            ...remote,
            paragraphs: remote.paragraphs && remote.paragraphs.length > 0 ? remote.paragraphs : DEFAULT_STATE.paragraphs,
            vision: remote.vision || DEFAULT_STATE.vision,
            mission: remote.mission && remote.mission.length > 0 ? remote.mission : DEFAULT_STATE.mission,
            objectives: remote.objectives && remote.objectives.length > 0 ? remote.objectives : DEFAULT_STATE.objectives,
            outcomes: {
              ...DEFAULT_STATE.outcomes,
              ...(remote.outcomes || {}),
              paragraphs: remote.outcomes?.paragraphs || DEFAULT_STATE.outcomes.paragraphs,
              team: remote.outcomes?.team || DEFAULT_STATE.outcomes.team,
            },
            academicProject: {
              ...DEFAULT_STATE.academicProject,
              ...(remote.academicProject || {}),
              paragraphs: remote.academicProject?.paragraphs || DEFAULT_STATE.academicProject.paragraphs,
              team: remote.academicProject?.team || DEFAULT_STATE.academicProject.team,
            },
            previousProjects: {
              ...DEFAULT_STATE.previousProjects,
              ...(remote.previousProjects || {}),
              table: remote.previousProjects?.table || DEFAULT_STATE.previousProjects.table,
            },
            competitions: remote.competitions && remote.competitions.length > 0 ? remote.competitions : DEFAULT_STATE.competitions,
            activities: remote.activities && remote.activities.length > 0 ? remote.activities : DEFAULT_STATE.activities,
            inCharge: { ...DEFAULT_STATE.inCharge, ...(remote.inCharge || {}) },
            facultyMentors: remote.facultyMentors && remote.facultyMentors.length > 0 ? remote.facultyMentors : DEFAULT_STATE.facultyMentors,
            studentsBenefited: remote.studentsBenefited && remote.studentsBenefited.length > 0 ? remote.studentsBenefited : DEFAULT_STATE.studentsBenefited,
            gallery: remote.gallery || [],
            highlights: remote.highlights && remote.highlights.length > 0 ? remote.highlights : DEFAULT_STATE.highlights,
            facilities: remote.facilities && remote.facilities.length > 0 ? remote.facilities : DEFAULT_STATE.facilities,
            additionalSections: remote.additionalSections || [],
          });
        }
      } catch (err) {
        console.error('Failed to load Concrete Canoe Lab data:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      await setDoc(doc(db, 'settings', 'concreteCanoeLab'), {
        ...data,
        updatedAt: serverTimestamp(),
      }, { merge: true });
      alert('Concrete Canoe Laboratory content updated successfully!');
    } catch (err) {
      console.error('Failed to save Concrete Canoe Lab data:', err);
      alert(`Failed to save changes: ${(err as Error).message}`);
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    if (confirm('Reset all Concrete Canoe Lab content to default values?')) {
      setData(DEFAULT_STATE);
    }
  };

  if (loading) {
    return <p className="admin-loading">Loading Concrete Canoe Lab Content Editor...</p>;
  }

  const navTabs = [
    { id: 'overview', label: '1. Overview & Purpose', icon: Compass },
    { id: 'vision-mission', label: '2. Vision & Mission', icon: Target },
    { id: 'objectives', label: '3. Objectives', icon: Sparkles },
    { id: 'incubation', label: '4. Startup Incubation (ITIC)', icon: Award },
    { id: 'academic-project', label: '5. Academic Project', icon: FlaskConical },
    { id: 'fleet', label: '6. Fleet Evolution Matrix', icon: Layers },
    { id: 'competitions', label: '7. Competitions & Awards', icon: Trophy },
    { id: 'events', label: '8. National Event (NCCC)', icon: Calendar },
    { id: 'leadership', label: '9. Leadership & Mentors', icon: Users },
    { id: 'students', label: '10. Student Cohorts Benefited', icon: BookOpen },
    { id: 'gallery', label: '11. Photo Gallery', icon: ImageIcon },
    { id: 'highlights', label: '12. Key Highlights & Facilities', icon: Zap },
    { id: 'custom-sections', label: '13. Custom Section', icon: Layers },
  ];

  return (
    <div style={{ background: '#fff', borderRadius: '12px', border: '1px solid #E2E8F0', padding: '1.5rem', marginTop: '1.5rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '1.25rem', borderBottom: '1px solid #e5e7eb', paddingBottom: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
            <span style={{ display: 'inline-flex', padding: '0.2rem 0.5rem', background: '#0F766E', color: '#fff', fontSize: '0.75rem', fontWeight: 700, borderRadius: '4px' }}>
              Differentiators
            </span>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0B1E42', margin: 0 }}>
              Concrete Canoe Laboratory — Page Content & Sections
            </h2>
          </div>
          <p style={{ fontSize: '0.85rem', color: '#64748B', margin: 0 }}>
            Dynamically edit all sections in the exact order they appear on the public page from top to bottom.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button type="button" onClick={handleReset} className="admin-btn-secondary" style={{ fontSize: '0.8rem', padding: '0.45rem 0.85rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <RotateCcw size={14} /> Reset Defaults
          </button>
          <button type="button" onClick={handleSave} disabled={saving} className="admin-btn-primary" style={{ fontSize: '0.8rem', padding: '0.45rem 1.1rem', background: '#008080', borderColor: '#008080', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <Save size={14} /> {saving ? 'Saving...' : 'Save All Changes'}
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '0.35rem', overflowX: 'auto', paddingBottom: '0.75rem', marginBottom: '1.5rem', borderBottom: '2px solid #F1F5F9' }}>
        {navTabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id as ActiveSubSection)}
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

      {/* Content */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        {/* TAB 1: OVERVIEW */}
        {activeTab === 'overview' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '1rem' }}>
              <div>
                <label className="admin-label">Badge Label</label>
                <input
                  type="text"
                  className="admin-input"
                  value={data.overviewBadge || ''}
                  onChange={(e) => setData({ ...data, overviewBadge: e.target.value })}
                  placeholder="Center of Excellence"
                />
              </div>
              <div>
                <label className="admin-label">Section Heading</label>
                <input
                  type="text"
                  className="admin-input"
                  value={data.overviewTitle || ''}
                  onChange={(e) => setData({ ...data, overviewTitle: e.target.value })}
                  placeholder="About the Concrete Canoe Laboratory"
                />
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <label className="admin-label" style={{ margin: 0 }}>Overview Paragraphs</label>
                <button
                  type="button"
                  onClick={() => setData({ ...data, paragraphs: [...data.paragraphs, ''] })}
                  className="admin-btn admin-btn--sm admin-btn--secondary"
                >
                  <Plus size={14} /> Add Paragraph
                </button>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                {data.paragraphs.map((p, idx) => (
                  <div key={idx} style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-start' }}>
                    <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#94A3B8', marginTop: '0.5rem', minWidth: '24px' }}>#{idx + 1}</span>
                    <textarea
                      rows={3}
                      className="admin-textarea"
                      value={p}
                      onChange={(e) => {
                        const updated = [...data.paragraphs];
                        updated[idx] = e.target.value;
                        setData({ ...data, paragraphs: updated });
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => setData({ ...data, paragraphs: data.paragraphs.filter((_, i) => i !== idx) })}
                      className="admin-btn-danger"
                      style={{ padding: '0.4rem 0.6rem' }}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: VISION & MISSION */}
        {activeTab === 'vision-mission' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div className="admin-field">
              <label>Vision Statement</label>
              <textarea
                rows={3}
                className="admin-textarea"
                value={data.vision}
                onChange={(e) => setData({ ...data, vision: e.target.value })}
              />
            </div>
            <div style={{ paddingTop: '1rem', borderTop: '1px solid #e5e7eb' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <label className="admin-label" style={{ margin: 0 }}>Mission Points</label>
                <button
                  type="button"
                  onClick={() => setData({ ...data, mission: [...data.mission, ''] })}
                  className="admin-btn admin-btn--sm admin-btn--secondary"
                >
                  <Plus size={14} /> Add Mission Point
                </button>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {data.mission.map((m, idx) => (
                  <div key={idx} style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                    <CheckCircle2 size={16} color="#008080" />
                    <input
                      type="text"
                      className="admin-input"
                      value={m}
                      onChange={(e) => {
                        const updated = [...data.mission];
                        updated[idx] = e.target.value;
                        setData({ ...data, mission: updated });
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => setData({ ...data, mission: data.mission.filter((_, i) => i !== idx) })}
                      className="admin-btn-danger"
                      style={{ padding: '0.4rem 0.6rem' }}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: OBJECTIVES */}
        {activeTab === 'objectives' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
              <label className="admin-label" style={{ margin: 0 }}>Laboratory Objectives</label>
              <button
                type="button"
                onClick={() => setData({ ...data, objectives: [...data.objectives, ''] })}
                className="admin-btn admin-btn--sm admin-btn--secondary"
              >
                <Plus size={14} /> Add Objective
              </button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {data.objectives.map((obj, idx) => (
                <div key={idx} style={{ display: 'flex', gap: '0.5rem' }}>
                  <input
                    type="text"
                    className="admin-input"
                    value={obj}
                    onChange={(e) => {
                      const updated = [...data.objectives];
                      updated[idx] = e.target.value;
                      setData({ ...data, objectives: updated });
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setData({ ...data, objectives: data.objectives.filter((_, i) => i !== idx) })}
                    className="admin-btn-danger"
                    style={{ padding: '0.4rem 0.6rem' }}
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: STARTUP INCUBATION (ITIC BUILD) */}
        {activeTab === 'incubation' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <label className="admin-label">Section Heading</label>
                <input
                  type="text"
                  className="admin-input"
                  value={data.outcomes?.heading || ''}
                  onChange={(e) => setData({ ...data, outcomes: { ...data.outcomes, heading: e.target.value } })}
                  placeholder="Startup Under Incubation"
                />
              </div>
              <div>
                <label className="admin-label">Subheading / Award Tag</label>
                <input
                  type="text"
                  className="admin-input"
                  value={data.outcomes?.subheading || ''}
                  onChange={(e) => setData({ ...data, outcomes: { ...data.outcomes, subheading: e.target.value } })}
                  placeholder="ITIC BUILD Winners"
                />
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <label className="admin-label" style={{ margin: 0 }}>Incubation Story Paragraphs</label>
                <button
                  type="button"
                  onClick={() =>
                    setData({
                      ...data,
                      outcomes: {
                        ...data.outcomes,
                        paragraphs: [...(data.outcomes?.paragraphs || []), ''],
                      },
                    })
                  }
                  className="admin-btn admin-btn--sm admin-btn--secondary"
                >
                  <Plus size={14} /> Add Paragraph
                </button>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {(data.outcomes?.paragraphs || []).map((p, idx) => (
                  <div key={idx} style={{ display: 'flex', gap: '0.5rem' }}>
                    <textarea
                      rows={2}
                      className="admin-textarea"
                      value={p}
                      onChange={(e) => {
                        const list = [...(data.outcomes?.paragraphs || [])];
                        list[idx] = e.target.value;
                        setData({ ...data, outcomes: { ...data.outcomes, paragraphs: list } });
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const list = (data.outcomes?.paragraphs || []).filter((_, i) => i !== idx);
                        setData({ ...data, outcomes: { ...data.outcomes, paragraphs: list } });
                      }}
                      className="admin-btn-danger"
                      style={{ padding: '0.4rem 0.6rem' }}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <label className="admin-label">Innovation Brief</label>
              <textarea
                rows={2}
                className="admin-textarea"
                value={data.outcomes?.brief || ''}
                onChange={(e) => setData({ ...data, outcomes: { ...data.outcomes, brief: e.target.value } })}
              />
            </div>

            {/* Student Founders Table */}
            <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <label className="admin-label" style={{ margin: 0 }}>Student Innovators & Founders Table (Team WAKA)</label>
                <button
                  type="button"
                  onClick={() => {
                    const rows = [...(data.outcomes?.team?.rows || [])];
                    rows.push({ cells: [String(rows.length + 1), '', ''] });
                    setData({
                      ...data,
                      outcomes: {
                        ...data.outcomes,
                        team: {
                          headers: data.outcomes?.team?.headers || ['S.No', 'Regd. No.', 'Name'],
                          rows,
                        },
                      },
                    });
                  }}
                  className="admin-btn admin-btn--sm admin-btn--secondary"
                >
                  <Plus size={12} /> Add Student Founder
                </button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {(data.outcomes?.team?.rows || []).map((row, rIdx) => (
                  <div key={rIdx} style={{ display: 'grid', gridTemplateColumns: '60px 1fr 2fr 40px', gap: '0.5rem', alignItems: 'center' }}>
                    <input
                      type="text"
                      className="admin-input"
                      value={row.cells[0]}
                      onChange={(e) => {
                        const rows = [...(data.outcomes?.team?.rows || [])];
                        rows[rIdx].cells[0] = e.target.value;
                        setData({ ...data, outcomes: { ...data.outcomes, team: { ...data.outcomes.team, rows } } });
                      }}
                    />
                    <input
                      type="text"
                      className="admin-input"
                      placeholder="Regd No."
                      value={row.cells[1]}
                      onChange={(e) => {
                        const rows = [...(data.outcomes?.team?.rows || [])];
                        rows[rIdx].cells[1] = e.target.value;
                        setData({ ...data, outcomes: { ...data.outcomes, team: { ...data.outcomes.team, rows } } });
                      }}
                    />
                    <input
                      type="text"
                      className="admin-input"
                      placeholder="Student Name"
                      value={row.cells[2]}
                      onChange={(e) => {
                        const rows = [...(data.outcomes?.team?.rows || [])];
                        rows[rIdx].cells[2] = e.target.value;
                        setData({ ...data, outcomes: { ...data.outcomes, team: { ...data.outcomes.team, rows } } });
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const rows = (data.outcomes?.team?.rows || []).filter((_, i) => i !== rIdx);
                        setData({ ...data, outcomes: { ...data.outcomes, team: { ...data.outcomes.team, rows } } });
                      }}
                      className="admin-btn-danger"
                      style={{ padding: '0.35rem' }}
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: ACADEMIC RESEARCH PROJECT */}
        {activeTab === 'academic-project' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div className="admin-field">
              <label>Academic Project Heading</label>
              <input
                type="text"
                value={data.academicProject?.heading || ''}
                onChange={(e) => setData({ ...data, academicProject: { ...data.academicProject, heading: e.target.value } })}
                className="admin-input"
              />
            </div>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <label className="admin-label" style={{ margin: 0 }}>Project Paragraphs</label>
                <button
                  type="button"
                  onClick={() =>
                    setData({
                      ...data,
                      academicProject: {
                        ...data.academicProject,
                        paragraphs: [...(data.academicProject?.paragraphs || []), ''],
                      },
                    })
                  }
                  className="admin-btn admin-btn--sm admin-btn--secondary"
                >
                  <Plus size={14} /> Add Paragraph
                </button>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {(data.academicProject?.paragraphs || []).map((p, idx) => (
                  <div key={idx} style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-start' }}>
                    <textarea
                      rows={2}
                      className="admin-textarea"
                      value={p}
                      onChange={(e) => {
                        const list = [...(data.academicProject?.paragraphs || [])];
                        list[idx] = e.target.value;
                        setData({ ...data, academicProject: { ...data.academicProject, paragraphs: list } });
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const list = (data.academicProject?.paragraphs || []).filter((_, i) => i !== idx);
                        setData({ ...data, academicProject: { ...data.academicProject, paragraphs: list } });
                      }}
                      className="admin-btn-danger"
                      style={{ padding: '0.4rem 0.6rem' }}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Research Team Table */}
            <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <label className="admin-label" style={{ margin: 0 }}>Project Research Team Table</label>
                <button
                  type="button"
                  onClick={() => {
                    const rows = [...(data.academicProject?.team?.rows || [])];
                    rows.push({ cells: [String(rows.length + 1), '', '', ''] });
                    setData({
                      ...data,
                      academicProject: {
                        ...data.academicProject,
                        team: {
                          headers: data.academicProject?.team?.headers || ['S.No', 'Regd No.', 'Name', 'Faculty'],
                          rows,
                        },
                      },
                    });
                  }}
                  className="admin-btn admin-btn--sm admin-btn--secondary"
                >
                  <Plus size={12} /> Add Team Member
                </button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {(data.academicProject?.team?.rows || []).map((row, rIdx) => (
                  <div key={rIdx} style={{ display: 'grid', gridTemplateColumns: '50px 1.5fr 2fr 2fr 40px', gap: '0.5rem', alignItems: 'center' }}>
                    <input
                      type="text"
                      className="admin-input"
                      value={row.cells[0]}
                      onChange={(e) => {
                        const rows = [...(data.academicProject?.team?.rows || [])];
                        rows[rIdx].cells[0] = e.target.value;
                        setData({ ...data, academicProject: { ...data.academicProject, team: { ...data.academicProject.team, rows } } });
                      }}
                    />
                    <input
                      type="text"
                      className="admin-input"
                      placeholder="Regd No."
                      value={row.cells[1]}
                      onChange={(e) => {
                        const rows = [...(data.academicProject?.team?.rows || [])];
                        rows[rIdx].cells[1] = e.target.value;
                        setData({ ...data, academicProject: { ...data.academicProject, team: { ...data.academicProject.team, rows } } });
                      }}
                    />
                    <input
                      type="text"
                      className="admin-input"
                      placeholder="Student Name"
                      value={row.cells[2]}
                      onChange={(e) => {
                        const rows = [...(data.academicProject?.team?.rows || [])];
                        rows[rIdx].cells[2] = e.target.value;
                        setData({ ...data, academicProject: { ...data.academicProject, team: { ...data.academicProject.team, rows } } });
                      }}
                    />
                    <input
                      type="text"
                      className="admin-input"
                      placeholder="Faculty Guide"
                      value={row.cells[3] || ''}
                      onChange={(e) => {
                        const rows = [...(data.academicProject?.team?.rows || [])];
                        rows[rIdx].cells[3] = e.target.value;
                        setData({ ...data, academicProject: { ...data.academicProject, team: { ...data.academicProject.team, rows } } });
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const rows = (data.academicProject?.team?.rows || []).filter((_, i) => i !== rIdx);
                        setData({ ...data, academicProject: { ...data.academicProject, team: { ...data.academicProject.team, rows } } });
                      }}
                      className="admin-btn-danger"
                      style={{ padding: '0.35rem' }}
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 6: FLEET EVOLUTION MATRIX */}
        {activeTab === 'fleet' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '1rem' }}>
              <label className="admin-label">Previous Project Works & Canoe Fleet Technical Matrix</label>
              <p style={{ fontSize: '0.8rem', color: '#64748B', margin: '0 0 1rem 0' }}>
                Technical specs for WAKA, WAKA 1.2, KANU, AIKYAM, and CANOE models (Dimensions, Materials, Hull Shape, Mix Design, Modelling Tool, Mould).
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {(data.previousProjects?.table?.rows || []).map((row, rIdx) => (
                  <div key={rIdx} style={{ background: '#fff', border: '1px solid #cbd5e1', borderRadius: '6px', padding: '0.75rem' }}>
                    <span style={{ fontWeight: 800, fontSize: '0.85rem', color: '#008080', display: 'block', marginBottom: '0.5rem' }}>
                      Row #{rIdx + 1}: {row.cells[0]}
                    </span>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.5rem' }}>
                      {(data.previousProjects?.table?.headers || []).map((header, cIdx) => (
                        <div key={cIdx}>
                          <label style={{ fontSize: '0.75rem', fontWeight: 600, color: '#475569' }}>{header}</label>
                          <textarea
                            rows={2}
                            className="admin-textarea"
                            style={{ fontSize: '0.8rem' }}
                            value={row.cells[cIdx] || ''}
                            onChange={(e) => {
                              const rows = [...(data.previousProjects?.table?.rows || [])];
                              rows[rIdx].cells[cIdx] = e.target.value;
                              setData({ ...data, previousProjects: { table: { ...data.previousProjects.table, rows } } });
                            }}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 7: COMPETITIONS & AWARDS */}
        {activeTab === 'competitions' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
              <label className="admin-label" style={{ margin: 0 }}>Competitions & Awards Record</label>
              <button
                type="button"
                onClick={() =>
                  setData({
                    ...data,
                    competitions: [
                      ...(data.competitions || []),
                      { name: 'New Competition', date: '', students: ['Student 1'], year: 'III Year', remarks: 'First Prize' },
                    ],
                  })
                }
                className="admin-btn admin-btn--sm admin-btn--secondary"
              >
                <Plus size={14} /> Add Competition
              </button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {(data.competitions || []).map((comp, idx) => (
                <div key={idx} style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '0.85rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                    <input
                      type="text"
                      value={comp.name}
                      onChange={(e) => {
                        const list = [...(data.competitions || [])];
                        list[idx] = { ...list[idx], name: e.target.value };
                        setData({ ...data, competitions: list });
                      }}
                      className="admin-input"
                      style={{ fontWeight: 700 }}
                      placeholder="Competition Name"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const list = (data.competitions || []).filter((_, i) => i !== idx);
                        setData({ ...data, competitions: list });
                      }}
                      className="admin-btn-danger"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.6rem', marginBottom: '0.5rem' }}>
                    <input
                      type="text"
                      value={comp.date}
                      onChange={(e) => {
                        const list = [...(data.competitions || [])];
                        list[idx] = { ...list[idx], date: e.target.value };
                        setData({ ...data, competitions: list });
                      }}
                      className="admin-input"
                      placeholder="Date (e.g. 07-03-2024)"
                    />
                    <input
                      type="text"
                      value={comp.year}
                      onChange={(e) => {
                        const list = [...(data.competitions || [])];
                        list[idx] = { ...list[idx], year: e.target.value };
                        setData({ ...data, competitions: list });
                      }}
                      className="admin-input"
                      placeholder="Cohort / Year (e.g. III Year)"
                    />
                    <input
                      type="text"
                      value={comp.remarks}
                      onChange={(e) => {
                        const list = [...(data.competitions || [])];
                        list[idx] = { ...list[idx], remarks: e.target.value };
                        setData({ ...data, competitions: list });
                      }}
                      className="admin-input"
                      placeholder="Award / Remarks (e.g. First Prize)"
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.75rem', fontWeight: 600, color: '#475569' }}>Student Participants (comma-separated)</label>
                    <input
                      type="text"
                      className="admin-input"
                      value={comp.students.join(', ')}
                      onChange={(e) => {
                        const list = [...(data.competitions || [])];
                        list[idx] = { ...list[idx], students: e.target.value.split(',').map((s) => s.trim()).filter(Boolean) };
                        setData({ ...data, competitions: list });
                      }}
                      placeholder="Student 1, Student 2, Student 3..."
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 8: NATIONAL EVENT (NCCC) */}
        {activeTab === 'events' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
              <label className="admin-label" style={{ margin: 0 }}>National Concrete Canoe Competition (NCCC) Details</label>
              <button
                type="button"
                onClick={() => setData({ ...data, activities: [...data.activities, ''] })}
                className="admin-btn admin-btn--sm admin-btn--secondary"
              >
                <Plus size={14} /> Add Paragraph
              </button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {data.activities.map((act, idx) => (
                <div key={idx} style={{ display: 'flex', gap: '0.5rem' }}>
                  <textarea
                    rows={2}
                    className="admin-textarea"
                    value={act}
                    onChange={(e) => {
                      const list = [...data.activities];
                      list[idx] = e.target.value;
                      setData({ ...data, activities: list });
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setData({ ...data, activities: data.activities.filter((_, i) => i !== idx) })}
                    className="admin-btn-danger"
                    style={{ padding: '0.4rem 0.6rem' }}
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 9: FACULTY LEADERSHIP & MENTORS */}
        {activeTab === 'leadership' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '1rem' }}>
              <label className="admin-label">Faculty In-Charge Profile</label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '0.75rem' }}>
                <div className="admin-field">
                  <label>Name</label>
                  <input
                    type="text"
                    value={data.inCharge?.name || ''}
                    onChange={(e) => setData({ ...data, inCharge: { ...data.inCharge, name: e.target.value } })}
                    className="admin-input"
                  />
                </div>
                <div className="admin-field">
                  <label>Designation</label>
                  <input
                    type="text"
                    value={data.inCharge?.designation || ''}
                    onChange={(e) => setData({ ...data, inCharge: { ...data.inCharge, designation: e.target.value } })}
                    className="admin-input"
                  />
                </div>
                <div className="admin-field">
                  <label>Email</label>
                  <input
                    type="email"
                    value={data.inCharge?.email || ''}
                    onChange={(e) => setData({ ...data, inCharge: { ...data.inCharge, email: e.target.value } })}
                    className="admin-input"
                  />
                </div>
                <div className="admin-field">
                  <label>Mobile</label>
                  <input
                    type="text"
                    value={data.inCharge?.mobile || ''}
                    onChange={(e) => setData({ ...data, inCharge: { ...data.inCharge, mobile: e.target.value } })}
                    className="admin-input"
                  />
                </div>
                <div className="admin-field" style={{ gridColumn: '1 / -1' }}>
                  <label>Research & Domain Interests</label>
                  <input
                    type="text"
                    value={data.inCharge?.interests || ''}
                    onChange={(e) => setData({ ...data, inCharge: { ...data.inCharge, interests: e.target.value } })}
                    className="admin-input"
                  />
                </div>
              </div>
            </div>

            {/* Faculty Mentors */}
            <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <label className="admin-label" style={{ margin: 0 }}>Faculty Mentors List</label>
                <button
                  type="button"
                  onClick={() => setData({ ...data, facultyMentors: [...(data.facultyMentors || []), ''] })}
                  className="admin-btn admin-btn--sm admin-btn--secondary"
                >
                  <Plus size={14} /> Add Faculty Mentor
                </button>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {(data.facultyMentors || []).map((mentor, idx) => (
                  <div key={idx} style={{ display: 'flex', gap: '0.5rem' }}>
                    <input
                      type="text"
                      className="admin-input"
                      value={mentor}
                      onChange={(e) => {
                        const list = [...(data.facultyMentors || [])];
                        list[idx] = e.target.value;
                        setData({ ...data, facultyMentors: list });
                      }}
                      placeholder="e.g. Dr. Pala Gireesh Kumar — Professor"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const list = (data.facultyMentors || []).filter((_, i) => i !== idx);
                        setData({ ...data, facultyMentors: list });
                      }}
                      className="admin-btn-danger"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 10: STUDENT COHORTS BENEFITED */}
        {activeTab === 'students' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
              <label className="admin-label" style={{ margin: 0 }}>Student Cohorts & Teams Benefited</label>
              <button
                type="button"
                onClick={() =>
                  setData({
                    ...data,
                    studentsBenefited: [
                      ...(data.studentsBenefited || []),
                      { label: 'New Team (Batch)', students: ['Student 1'] },
                    ],
                  })
                }
                className="admin-btn admin-btn--sm admin-btn--secondary"
              >
                <Plus size={14} /> Add Team Cohort
              </button>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '0.85rem' }}>
              {(data.studentsBenefited || []).map((team, tIdx) => (
                <div key={tIdx} style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '0.85rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                    <input
                      type="text"
                      value={team.label}
                      onChange={(e) => {
                        const list = [...(data.studentsBenefited || [])];
                        list[tIdx] = { ...list[tIdx], label: e.target.value };
                        setData({ ...data, studentsBenefited: list });
                      }}
                      className="admin-input"
                      style={{ fontWeight: 700 }}
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const list = (data.studentsBenefited || []).filter((_, i) => i !== tIdx);
                        setData({ ...data, studentsBenefited: list });
                      }}
                      className="admin-btn-danger"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>

                  <div>
                    <label style={{ fontSize: '0.75rem', fontWeight: 600, color: '#475569' }}>Student Members (comma-separated)</label>
                    <textarea
                      rows={3}
                      className="admin-textarea"
                      value={team.students.join(', ')}
                      onChange={(e) => {
                        const list = [...(data.studentsBenefited || [])];
                        list[tIdx] = {
                          ...list[tIdx],
                          students: e.target.value.split(',').map((s) => s.trim()).filter(Boolean),
                        };
                        setData({ ...data, studentsBenefited: list });
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 11: PHOTO GALLERY */}
        {activeTab === 'gallery' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
              <div>
                <label className="admin-label" style={{ margin: 0 }}>Laboratory & Field Testing Photo Gallery</label>
                <p style={{ fontSize: '0.8rem', color: '#64748B', margin: '0.2rem 0 0' }}>
                  Upload photos of canoe construction, hull testing, lake trials, and awards.
                </p>
              </div>
              <button
                type="button"
                onClick={() =>
                  setData({
                    ...data,
                    gallery: [
                      ...(data.gallery || []),
                      { imageUrl: '', caption: 'New photo caption' },
                    ],
                  })
                }
                className="admin-btn admin-btn--sm admin-btn--secondary"
              >
                <Plus size={14} /> Add Photo Slot
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem', marginTop: '0.5rem' }}>
              {(data.gallery || []).map((photo, idx) => (
                <div key={idx} style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '0.75rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#0F766E' }}>Photo #{idx + 1}</span>
                    <button
                      type="button"
                      onClick={() => {
                        const list = (data.gallery || []).filter((_, i) => i !== idx);
                        setData({ ...data, gallery: list });
                      }}
                      className="admin-btn-danger"
                      style={{ padding: '0.2rem 0.5rem' }}
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>

                  <ImageUploader
                    folder="vwu/differentiators/concrete-canoe/gallery"
                    currentUrl={photo.imageUrl}
                    label="Upload Photo"
                    onUploaded={(r: UploadResult) => {
                      const list = [...(data.gallery || [])];
                      list[idx] = { ...list[idx], imageUrl: r.url, storagePath: r.path };
                      setData({ ...data, gallery: list });
                    }}
                  />

                  <div>
                    <label style={{ fontSize: '0.75rem', fontWeight: 600, color: '#475569' }}>Caption</label>
                    <input
                      type="text"
                      className="admin-input"
                      value={photo.caption || ''}
                      onChange={(e) => {
                        const list = [...(data.gallery || [])];
                        list[idx] = { ...list[idx], caption: e.target.value };
                        setData({ ...data, gallery: list });
                      }}
                      placeholder="e.g. WAKA Concrete Canoe at the lakeside test trials"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 12: KEY HIGHLIGHTS & FACILITIES */}
        {activeTab === 'highlights' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {/* Highlights */}
            <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '1.25rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                <h4 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 800, color: '#0B1E42', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <Zap size={16} color="#008080" /> Key Highlights Points
                </h4>
                <button
                  type="button"
                  onClick={() => setData({ ...data, highlights: [...(data.highlights || []), ''] })}
                  className="admin-btn admin-btn--sm admin-btn--secondary"
                >
                  <Plus size={14} /> Add Highlight
                </button>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {(data.highlights || []).map((h, idx) => (
                  <div key={idx} style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                    <CheckCircle2 size={16} color="#008080" />
                    <input
                      type="text"
                      className="admin-input"
                      value={h}
                      onChange={(e) => {
                        const list = [...(data.highlights || [])];
                        list[idx] = e.target.value;
                        setData({ ...data, highlights: list });
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const list = (data.highlights || []).filter((_, i) => i !== idx);
                        setData({ ...data, highlights: list });
                      }}
                      className="admin-btn-danger"
                      style={{ padding: '0.4rem 0.6rem' }}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Facilities */}
            <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '1.25rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                <h4 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 800, color: '#0B1E42', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <Wrench size={16} color="#008080" /> Facilities & Equipment List
                </h4>
                <button
                  type="button"
                  onClick={() => setData({ ...data, facilities: [...(data.facilities || []), ''] })}
                  className="admin-btn admin-btn--sm admin-btn--secondary"
                >
                  <Plus size={14} /> Add Facility Item
                </button>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {(data.facilities || []).map((f, idx) => (
                  <div key={idx} style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                    <CheckCircle2 size={16} color="#008080" />
                    <input
                      type="text"
                      className="admin-input"
                      value={f}
                      onChange={(e) => {
                        const list = [...(data.facilities || [])];
                        list[idx] = e.target.value;
                        setData({ ...data, facilities: list });
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const list = (data.facilities || []).filter((_, i) => i !== idx);
                        setData({ ...data, facilities: list });
                      }}
                      className="admin-btn-danger"
                      style={{ padding: '0.4rem 0.6rem' }}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 13: CUSTOM SECTIONS */}
        {activeTab === 'custom-sections' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h4 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 800, color: '#0B1E42' }}>
                  Custom Additional Sections
                </h4>
                <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.8rem', color: '#64748B' }}>
                  Add extra dynamic sections to appear at the bottom of the Concrete Canoe Laboratory page.
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  const newId = `section-${Date.now()}`;
                  setData({
                    ...data,
                    additionalSections: [
                      ...(data.additionalSections || []),
                      {
                        id: newId,
                        title: 'New Section',
                        badge: 'Research & Innovation',
                        paragraphs: ['Write section content here...'],
                        bulletPoints: [],
                      },
                    ],
                  });
                }}
                className="admin-btn-secondary"
                style={{ fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}
              >
                <Plus size={14} /> Add Section
              </button>
            </div>

            {(data.additionalSections || []).length === 0 ? (
              <div style={{ padding: '2rem', background: '#F8FAFC', borderRadius: '8px', textAlign: 'center', color: '#64748B', fontSize: '0.85rem' }}>
                No extra custom sections created yet. Click "+ Add Section" to add new blocks.
              </div>
            ) : (
              (data.additionalSections || []).map((sec, idx) => (
                <div key={sec.id} style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '8px', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontWeight: 800, fontSize: '0.85rem', color: '#0B1E42' }}>Section #{idx + 1}</span>
                    <button
                      type="button"
                      onClick={() => {
                        setData({
                          ...data,
                          additionalSections: (data.additionalSections || []).filter((_, i) => i !== idx),
                        });
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
                          const list = [...(data.additionalSections || [])];
                          list[idx] = { ...list[idx], title: e.target.value };
                          setData({ ...data, additionalSections: list });
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
                          const list = [...(data.additionalSections || [])];
                          list[idx] = { ...list[idx], badge: e.target.value };
                          setData({ ...data, additionalSections: list });
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
                        const list = [...(data.additionalSections || [])];
                        list[idx] = { ...list[idx], paragraphs: e.target.value.split('\n') };
                        setData({ ...data, additionalSections: list });
                      }}
                    />
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {/* Bottom Save Bar */}
      <div style={{ marginTop: '2rem', paddingTop: '1rem', borderTop: '1px solid #E2E8F0', display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
        <button type="button" onClick={handleSave} disabled={saving} className="admin-btn-primary" style={{ padding: '0.6rem 1.5rem', background: '#008080', borderColor: '#008080', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <Save size={16} /> {saving ? 'Saving...' : 'Save All Changes'}
        </button>
      </div>
    </div>
  );
}
