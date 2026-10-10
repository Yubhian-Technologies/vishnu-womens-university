import { useState, useEffect } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { setDoc } from '../../../lib/auditLog';
import { db } from '../../../lib/firebase';
import {
  dreamHouseConstructionLab,
  type DhclMember,
  type DhclSimpleTable,
  type DhclStudentGroup,
  type DhclStat,
} from '../../Differentiators/dreamHouseConstructionLab.data';
import {
  Plus,
  Trash2,
  Save,
  RotateCcw,
  Sparkles,
  BookOpen,
  Users,
  Award,
  Building,
  Target,
  Compass,
  Calendar,
  Image as ImageIcon,
  CheckCircle2,
  GraduationCap,
  Zap,
  Wrench,
  Handshake,
} from 'lucide-react';
import ImageUploader from '../../../components/ImageUploader/ImageUploader';
import type { UploadResult } from '../../../lib/storage';

export interface DhclGalleryPhoto {
  imageUrl: string;
  caption?: string;
  storagePath?: string;
}

export interface CustomDhclSection {
  id: string;
  title: string;
  badge?: string;
  paragraphs?: string[];
  bulletPoints?: string[];
}

export interface DreamHouseLabDoc {
  // 1. Stats Strip
  stats?: {
    stat1: DhclStat;
    stat2: DhclStat;
    stat3: DhclStat;
    stat4: DhclStat;
  };
  // 2. Overview & Purpose
  overviewBadge?: string;
  overviewTitle?: string;
  paragraphs: string[];
  inCharge: DhclMember;
  // 3. Vision & Mission
  visionSubtitle?: string;
  visionTitle?: string;
  vision: string;
  missionSubtitle?: string;
  missionTitle?: string;
  mission: string[];
  // 4. Objectives
  objectivesTitle?: string;
  objectives: string[];
  // 5. Incubation & Startup Outcomes (ITIC BUILD)
  outcomes: {
    heading: string;
    subheading: string;
    badgePill?: string;
    paragraphs: string[];
    briefHeading?: string;
    brief: string;
    teamTitle?: string;
    team: DhclSimpleTable;
  };
  // 6. Academic Research Project
  academicProject: {
    badge?: string;
    heading: string;
    paragraphs: string[];
    teamTitle?: string;
    team: DhclSimpleTable;
  };
  // 7. Students Benefited Directory
  beneficiariesTag?: string;
  beneficiariesTitle?: string;
  studentsBenefited: DhclStudentGroup[];
  // 8. Department Expos & Exposure Visits
  activitiesTitle?: string;
  activities: string[];
  // 9. Photo Gallery
  gallery?: DhclGalleryPhoto[];
  // 10. Key Highlights
  highlightsTitle?: string;
  highlights?: string[];
  // 11. Facilities & Equipment
  facilitiesTitle?: string;
  facilities?: string[];
  // 12. Partners
  partnersTitle?: string;
  partners?: string[];
  // 13. Dynamic Custom Sections
  additionalSections?: CustomDhclSection[];
}

const DEFAULT_DOC: DreamHouseLabDoc = {
  stats: {
    stat1: { value: '4+', label: 'Years of Innovation' },
    stat2: { value: '37+', label: 'Students Benefited' },
    stat3: { value: '₹1 Lakh', label: 'ITIC Seed Funding' },
    stat4: { value: 'Top 75', label: 'ITIC BUILD Winner' },
  },
  overviewBadge: 'Overview & Purpose',
  overviewTitle: 'Dream House Construction Lab (DHCL)',
  paragraphs: [...dreamHouseConstructionLab.paragraphs],
  inCharge: { ...dreamHouseConstructionLab.inCharge },
  visionSubtitle: 'Our Architectural Blueprint',
  visionTitle: 'Vision',
  vision: dreamHouseConstructionLab.vision,
  missionSubtitle: 'Strategic Pillars',
  missionTitle: 'Mission',
  mission: [...dreamHouseConstructionLab.mission],
  objectivesTitle: 'Core Objectives',
  objectives: [...dreamHouseConstructionLab.objectives],
  outcomes: {
    heading: dreamHouseConstructionLab.outcomes.heading,
    subheading: dreamHouseConstructionLab.outcomes.subheading,
    badgePill: 'IIT Hyderabad Incubation (ITIC)',
    paragraphs: [...dreamHouseConstructionLab.outcomes.paragraphs],
    briefHeading: 'Eco-Housing & Sustainability Impact',
    brief: dreamHouseConstructionLab.outcomes.brief,
    teamTitle: 'ITIC BUILD Incubated Student Innovators Team (SMB)',
    team: {
      headers: [...dreamHouseConstructionLab.outcomes.team.headers],
      rows: dreamHouseConstructionLab.outcomes.team.rows.map((r) => ({ cells: [...r.cells] })),
    },
  },
  academicProject: {
    badge: 'Academic Research Project Spotlight',
    heading: dreamHouseConstructionLab.academicProject.heading,
    paragraphs: [...dreamHouseConstructionLab.academicProject.paragraphs],
    teamTitle: 'Project Research Team',
    team: {
      headers: [...dreamHouseConstructionLab.academicProject.team.headers],
      rows: dreamHouseConstructionLab.academicProject.team.rows.map((r) => ({ cells: [...r.cells] })),
    },
  },
  beneficiariesTag: 'Skill & Research Training',
  beneficiariesTitle: 'Students Benefited Directory',
  studentsBenefited: dreamHouseConstructionLab.studentsBenefited.map((g) => ({
    yearLabel: g.yearLabel,
    students: g.students.map((s) => ({ ...s })),
  })),
  activitiesTitle: 'Department Expos & Exposure Visits',
  activities: [...dreamHouseConstructionLab.activities],
  gallery: [],
  highlightsTitle: 'Key Highlights',
  highlights: [...(dreamHouseConstructionLab.highlights || [])],
  facilitiesTitle: 'Facilities & Equipment',
  facilities: [...(dreamHouseConstructionLab.facilities || [])],
  partnersTitle: 'Partners',
  partners: [...(dreamHouseConstructionLab.partners || [])],
  additionalSections: [],
};

type TabKey =
  | 'stats'
  | 'overview'
  | 'visionMission'
  | 'objectives'
  | 'outcomes'
  | 'academicProject'
  | 'studentsBenefited'
  | 'activities'
  | 'gallery'
  | 'highlights'
  | 'facilities'
  | 'partners'
  | 'customSections';

export default function DreamHouseLabContentAdmin() {
  const [data, setData] = useState<DreamHouseLabDoc>(DEFAULT_DOC);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [activeTab, setActiveTab] = useState<TabKey>('stats');

  useEffect(() => {
    async function loadData() {
      try {
        const snap = await getDoc(doc(db, 'settings', 'dreamHouseLab'));
        if (snap.exists()) {
          const remote = snap.data() as Partial<DreamHouseLabDoc>;
          setData({
            ...DEFAULT_DOC,
            ...remote,
            stats: {
              stat1: remote.stats?.stat1?.value ? remote.stats.stat1 : DEFAULT_DOC.stats!.stat1,
              stat2: remote.stats?.stat2?.value ? remote.stats.stat2 : DEFAULT_DOC.stats!.stat2,
              stat3: remote.stats?.stat3?.value ? remote.stats.stat3 : DEFAULT_DOC.stats!.stat3,
              stat4: remote.stats?.stat4?.value ? remote.stats.stat4 : DEFAULT_DOC.stats!.stat4,
            },
            inCharge: { ...DEFAULT_DOC.inCharge, ...(remote.inCharge || {}) },
            outcomes: {
              ...DEFAULT_DOC.outcomes,
              ...(remote.outcomes || {}),
              paragraphs: remote.outcomes?.paragraphs || DEFAULT_DOC.outcomes.paragraphs,
              team: remote.outcomes?.team || DEFAULT_DOC.outcomes.team,
            },
            academicProject: {
              ...DEFAULT_DOC.academicProject,
              ...(remote.academicProject || {}),
              paragraphs: remote.academicProject?.paragraphs || DEFAULT_DOC.academicProject.paragraphs,
              team: remote.academicProject?.team || DEFAULT_DOC.academicProject.team,
            },
            studentsBenefited: remote.studentsBenefited || DEFAULT_DOC.studentsBenefited,
            activities: remote.activities || DEFAULT_DOC.activities,
            gallery: remote.gallery || [],
            highlights: remote.highlights || DEFAULT_DOC.highlights,
            facilities: remote.facilities || DEFAULT_DOC.facilities,
            partners: remote.partners || DEFAULT_DOC.partners,
            additionalSections: remote.additionalSections || [],
          });
        }
      } catch (err) {
        console.error('Failed to load Dream House Lab content:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      await setDoc(doc(db, 'settings', 'dreamHouseLab'), data);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      console.error('Failed to save Dream House Lab data:', err);
      alert('Failed to save changes. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    if (confirm('Reset all content to original defaults?')) {
      setData(DEFAULT_DOC);
    }
  };

  if (loading) {
    return (
      <div className="admin-card" style={{ textAlign: 'center', padding: '2rem', color: '#64748b' }}>
        Loading Dream House Construction Lab Editor...
      </div>
    );
  }

  const tabs: { id: TabKey; label: string; icon: any }[] = [
    { id: 'stats', label: '1. Stats Strip', icon: Building },
    { id: 'overview', label: '2. Overview & In-Charge', icon: Users },
    { id: 'visionMission', label: '3. Vision & Mission', icon: Target },
    { id: 'objectives', label: '4. Objectives', icon: Compass },
    { id: 'outcomes', label: '5. Startup Incubation (ITIC)', icon: Award },
    { id: 'academicProject', label: '6. Academic Project', icon: BookOpen },
    { id: 'studentsBenefited', label: '7. Students Benefited', icon: GraduationCap },
    { id: 'activities', label: '8. Expos & Exposure Visits', icon: Calendar },
    { id: 'gallery', label: '9. Photo Gallery', icon: ImageIcon },
    { id: 'highlights', label: '10. Key Highlights', icon: Zap },
    { id: 'facilities', label: '11. Facilities & Equipment', icon: Wrench },
    { id: 'partners', label: '12. Partners', icon: Handshake },
    { id: 'customSections', label: '13. Custom Section', icon: Sparkles },
  ];

  return (
    <div className="admin-section" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Top Action Bar */}
      <div className="admin-card" style={{ padding: '1.25rem', marginBottom: 0 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', padding: '0.25rem 0.65rem', borderRadius: '4px', background: '#f0fdf4', color: '#16a34a', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '0.35rem' }}>
              <Building size={14} /> Differentiator Editor
            </div>
            <h2 style={{ margin: 0, fontSize: '1.4rem', fontWeight: 800, color: '#0f172a' }}>
              Dream House Construction Lab (DHCL) Content Admin
            </h2>
            <p style={{ margin: '0.25rem 0 0', fontSize: '0.875rem', color: '#64748b' }}>
              All sections strictly follow the public page top-to-bottom flow. Edit any section dynamically.
            </p>
          </div>
          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
            <button
              type="button"
              onClick={handleReset}
              className="admin-btn admin-btn--secondary"
              style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem' }}
            >
              <RotateCcw size={14} /> Reset Defaults
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={saving}
              className="admin-btn admin-btn--primary"
              style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem', background: '#0f766e', color: '#ffffff' }}
            >
              {saving ? 'Saving...' : saved ? <><CheckCircle2 size={16} /> Saved Live!</> : <><Save size={16} /> Save All Changes</>}
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div style={{ display: 'flex', gap: '0.4rem', borderBottom: '1px solid #e2e8f0', marginTop: '1.25rem', paddingBottom: '0.25rem', overflowX: 'auto' }}>
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className="admin-btn"
                style={{
                  background: isActive ? '#0f766e' : '#f8fafc',
                  color: isActive ? '#ffffff' : '#475569',
                  border: isActive ? '1px solid #0f766e' : '1px solid #e2e8f0',
                  fontWeight: 600,
                  fontSize: '0.82rem',
                  padding: '0.5rem 0.85rem',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  whiteSpace: 'nowrap',
                }}
              >
                <Icon size={14} />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* 1. Stats Strip */}
      {activeTab === 'stats' && (
        <div className="admin-card" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 700, color: '#0f172a' }}>
            1. Structural Stats Strip (Top Highlight Cards)
          </h3>
          <p style={{ margin: 0, fontSize: '0.85rem', color: '#64748b' }}>
            Configure the 4 key statistical metric cards displayed directly below the hero banner.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
            {[
              { key: 'stat1' as const, label: 'Stat 1 (Years of Innovation)', icon: Building },
              { key: 'stat2' as const, label: 'Stat 2 (Students Benefited)', icon: GraduationCap },
              { key: 'stat3' as const, label: 'Stat 3 (ITIC Seed Funding)', icon: Award },
              { key: 'stat4' as const, label: 'Stat 4 (ITIC BUILD Winner)', icon: Sparkles },
            ].map(({ key, label, icon: StatIcon }) => (
              <div key={key} style={{ padding: '1rem', border: '1px solid #e2e8f0', borderRadius: '8px', background: '#f8fafc', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700, fontSize: '0.85rem', color: '#0f766e' }}>
                  <StatIcon size={16} /> {label}
                </div>
                <div>
                  <label className="admin-label" style={{ fontSize: '0.75rem' }}>Metric Value</label>
                  <input
                    type="text"
                    value={data.stats?.[key]?.value || ''}
                    onChange={(e) =>
                      setData({
                        ...data,
                        stats: {
                          ...(data.stats || DEFAULT_DOC.stats!),
                          [key]: { ...(data.stats?.[key] || DEFAULT_DOC.stats![key]), value: e.target.value },
                        },
                      })
                    }
                    className="admin-input"
                    placeholder="e.g. 4+"
                  />
                </div>
                <div>
                  <label className="admin-label" style={{ fontSize: '0.75rem' }}>Metric Label</label>
                  <input
                    type="text"
                    value={data.stats?.[key]?.label || ''}
                    onChange={(e) =>
                      setData({
                        ...data,
                        stats: {
                          ...(data.stats || DEFAULT_DOC.stats!),
                          [key]: { ...(data.stats?.[key] || DEFAULT_DOC.stats![key]), label: e.target.value },
                        },
                      })
                    }
                    className="admin-input"
                    placeholder="e.g. Years of Innovation"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 2. Overview & Purpose + In-Charge */}
      {activeTab === 'overview' && (
        <div className="admin-card" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div>
            <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 700, color: '#0f172a' }}>
              2. Main Overview & Faculty In-Charge Spotlight
            </h3>
            <p style={{ margin: '0.25rem 0 0', fontSize: '0.85rem', color: '#64748b' }}>
              Edit the overview narrative paragraphs and the Faculty In-Charge spotlight profile card.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
            <div className="admin-field">
              <label className="admin-label">Badge Label</label>
              <input
                type="text"
                value={data.overviewBadge || ''}
                onChange={(e) => setData({ ...data, overviewBadge: e.target.value })}
                className="admin-input"
                placeholder="Overview & Purpose"
              />
            </div>
            <div className="admin-field">
              <label className="admin-label">Section Heading</label>
              <input
                type="text"
                value={data.overviewTitle || ''}
                onChange={(e) => setData({ ...data, overviewTitle: e.target.value })}
                className="admin-input"
                placeholder="Dream House Construction Lab (DHCL)"
              />
            </div>
          </div>

          {/* Overview Paragraphs */}
          <div className="admin-field">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
              <label className="admin-label" style={{ margin: 0 }}>Overview Paragraphs</label>
              <button
                type="button"
                onClick={() => setData({ ...data, paragraphs: [...data.paragraphs, ''] })}
                className="admin-btn admin-btn--secondary"
                style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.8rem', padding: '0.35rem 0.75rem' }}
              >
                <Plus size={14} /> Add Paragraph
              </button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {data.paragraphs.map((p, idx) => (
                <div key={idx} style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-start' }}>
                  <textarea
                    rows={4}
                    value={p}
                    onChange={(e) => {
                      const updated = [...data.paragraphs];
                      updated[idx] = e.target.value;
                      setData({ ...data, paragraphs: updated });
                    }}
                    className="admin-textarea"
                    style={{ flex: 1 }}
                  />
                  <button
                    type="button"
                    onClick={() => setData({ ...data, paragraphs: data.paragraphs.filter((_, i) => i !== idx) })}
                    className="admin-btn-danger"
                    style={{ padding: '0.6rem 0.75rem' }}
                    title="Remove paragraph"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <hr style={{ border: 'none', borderTop: '1px solid #e2e8f0', margin: '0.5rem 0' }} />

          {/* Faculty In-Charge Spotlight */}
          <div>
            <h4 style={{ margin: '0 0 1rem 0', fontSize: '1rem', fontWeight: 700, color: '#0f766e', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Users size={16} /> Faculty In-Charge Profile Card
            </h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1rem' }}>
              <div className="admin-field">
                <label className="admin-label">Faculty Name</label>
                <input
                  type="text"
                  value={data.inCharge?.name || ''}
                  onChange={(e) => setData({ ...data, inCharge: { ...data.inCharge, name: e.target.value } })}
                  className="admin-input"
                />
              </div>
              <div className="admin-field">
                <label className="admin-label">Designation</label>
                <input
                  type="text"
                  value={data.inCharge?.designation || ''}
                  onChange={(e) => setData({ ...data, inCharge: { ...data.inCharge, designation: e.target.value } })}
                  className="admin-input"
                />
              </div>
              <div className="admin-field">
                <label className="admin-label">Email</label>
                <input
                  type="email"
                  value={data.inCharge?.email || ''}
                  onChange={(e) => setData({ ...data, inCharge: { ...data.inCharge, email: e.target.value } })}
                  className="admin-input"
                />
              </div>
              <div className="admin-field">
                <label className="admin-label">Mobile</label>
                <input
                  type="text"
                  value={data.inCharge?.mobile || ''}
                  onChange={(e) => setData({ ...data, inCharge: { ...data.inCharge, mobile: e.target.value } })}
                  className="admin-input"
                />
              </div>
              <div className="admin-field" style={{ gridColumn: '1 / -1' }}>
                <label className="admin-label">Website</label>
                <input
                  type="text"
                  value={data.inCharge?.website || ''}
                  onChange={(e) => setData({ ...data, inCharge: { ...data.inCharge, website: e.target.value } })}
                  className="admin-input"
                />
              </div>
              <div className="admin-field" style={{ gridColumn: '1 / -1' }}>
                <label className="admin-label">Research Focus & Interests (comma-separated)</label>
                <input
                  type="text"
                  value={data.inCharge?.interests || ''}
                  onChange={(e) => setData({ ...data, inCharge: { ...data.inCharge, interests: e.target.value } })}
                  className="admin-input"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3. Vision & Mission */}
      {activeTab === 'visionMission' && (
        <div className="admin-card" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div>
            <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 700, color: '#0f172a' }}>
              3. Vision & Mission Quad-Grid
            </h3>
            <p style={{ margin: '0.25rem 0 0', fontSize: '0.85rem', color: '#64748b' }}>
              Edit the Vision card and the numbered Mission pillars.
            </p>
          </div>

          {/* Vision */}
          <div style={{ padding: '1rem', border: '1px solid #e2e8f0', borderRadius: '8px', background: '#f8fafc', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <h4 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 700, color: '#0f766e', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Compass size={16} /> Vision Section
            </h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1rem' }}>
              <div className="admin-field">
                <label className="admin-label">Subtitle</label>
                <input
                  type="text"
                  value={data.visionSubtitle || ''}
                  onChange={(e) => setData({ ...data, visionSubtitle: e.target.value })}
                  className="admin-input"
                  placeholder="Our Architectural Blueprint"
                />
              </div>
              <div className="admin-field">
                <label className="admin-label">Title</label>
                <input
                  type="text"
                  value={data.visionTitle || ''}
                  onChange={(e) => setData({ ...data, visionTitle: e.target.value })}
                  className="admin-input"
                  placeholder="Vision"
                />
              </div>
            </div>
            <div className="admin-field">
              <label className="admin-label">Vision Statement</label>
              <textarea
                rows={4}
                value={data.vision}
                onChange={(e) => setData({ ...data, vision: e.target.value })}
                className="admin-textarea"
              />
            </div>
          </div>

          {/* Mission */}
          <div style={{ padding: '1rem', border: '1px solid #e2e8f0', borderRadius: '8px', background: '#f8fafc', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
              <h4 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 700, color: '#0f766e', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Target size={16} /> Mission Statements
              </h4>
              <button
                type="button"
                onClick={() => setData({ ...data, mission: [...data.mission, ''] })}
                className="admin-btn admin-btn--secondary"
                style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.8rem', padding: '0.35rem 0.75rem' }}
              >
                <Plus size={14} /> Add Mission Bullet
              </button>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1rem' }}>
              <div className="admin-field">
                <label className="admin-label">Subtitle</label>
                <input
                  type="text"
                  value={data.missionSubtitle || ''}
                  onChange={(e) => setData({ ...data, missionSubtitle: e.target.value })}
                  className="admin-input"
                  placeholder="Strategic Pillars"
                />
              </div>
              <div className="admin-field">
                <label className="admin-label">Title</label>
                <input
                  type="text"
                  value={data.missionTitle || ''}
                  onChange={(e) => setData({ ...data, missionTitle: e.target.value })}
                  className="admin-input"
                  placeholder="Mission"
                />
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {data.mission.map((bullet, idx) => (
                <div key={idx} style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#64748b', width: '2rem', textAlign: 'right' }}>
                    0{idx + 1}.
                  </span>
                  <input
                    type="text"
                    value={bullet}
                    onChange={(e) => {
                      const updated = [...data.mission];
                      updated[idx] = e.target.value;
                      setData({ ...data, mission: updated });
                    }}
                    className="admin-input"
                    style={{ flex: 1 }}
                  />
                  <button
                    type="button"
                    onClick={() => setData({ ...data, mission: data.mission.filter((_, i) => i !== idx) })}
                    className="admin-btn-danger"
                    style={{ padding: '0.5rem 0.65rem' }}
                    title="Remove bullet"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 4. Objectives */}
      {activeTab === 'objectives' && (
        <div className="admin-card" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
            <div>
              <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 700, color: '#0f172a' }}>
                4. Core Objectives
              </h3>
              <p style={{ margin: '0.25rem 0 0', fontSize: '0.85rem', color: '#64748b' }}>
                Manage the laboratory core objectives displayed in the bulleted grid.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setData({ ...data, objectives: [...data.objectives, ''] })}
              className="admin-btn admin-btn--secondary"
              style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.8rem', padding: '0.35rem 0.75rem' }}
            >
              <Plus size={14} /> Add Objective
            </button>
          </div>

          <div className="admin-field">
            <label className="admin-label">Objectives Title</label>
            <input
              type="text"
              value={data.objectivesTitle || ''}
              onChange={(e) => setData({ ...data, objectivesTitle: e.target.value })}
              className="admin-input"
              placeholder="Core Objectives"
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {data.objectives.map((obj, idx) => (
              <div key={idx} style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-start' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#64748b', width: '1.5rem', textAlign: 'right', marginTop: '0.5rem' }}>
                  {idx + 1}.
                </span>
                <textarea
                  rows={2}
                  value={obj}
                  onChange={(e) => {
                    const updated = [...data.objectives];
                    updated[idx] = e.target.value;
                    setData({ ...data, objectives: updated });
                  }}
                  className="admin-textarea"
                  style={{ flex: 1 }}
                />
                <button
                  type="button"
                  onClick={() => setData({ ...data, objectives: data.objectives.filter((_, i) => i !== idx) })}
                  className="admin-btn-danger"
                  style={{ padding: '0.5rem 0.65rem' }}
                  title="Remove objective"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 5. Incubation & Startup Outcomes (ITIC BUILD) */}
      {activeTab === 'outcomes' && (
        <div className="admin-card" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div>
            <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 700, color: '#0f172a' }}>
              5. Incubation & Startup Outcomes Showcase (ITIC BUILD)
            </h3>
            <p style={{ margin: '0.25rem 0 0', fontSize: '0.85rem', color: '#64748b' }}>
              Edit the startup spotlight, seed grant announcement, sustainability impact brief, and the student innovator founder team table.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
            <div className="admin-field">
              <label className="admin-label">Tag / Heading</label>
              <input
                type="text"
                value={data.outcomes.heading}
                onChange={(e) => setData({ ...data, outcomes: { ...data.outcomes, heading: e.target.value } })}
                className="admin-input"
              />
            </div>
            <div className="admin-field">
              <label className="admin-label">Main Subheading</label>
              <input
                type="text"
                value={data.outcomes.subheading}
                onChange={(e) => setData({ ...data, outcomes: { ...data.outcomes, subheading: e.target.value } })}
                className="admin-input"
              />
            </div>
            <div className="admin-field">
              <label className="admin-label">Badge Pill</label>
              <input
                type="text"
                value={data.outcomes.badgePill || ''}
                onChange={(e) => setData({ ...data, outcomes: { ...data.outcomes, badgePill: e.target.value } })}
                className="admin-input"
                placeholder="IIT Hyderabad Incubation (ITIC)"
              />
            </div>
          </div>

          {/* Alert Paragraphs */}
          <div className="admin-field">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
              <label className="admin-label" style={{ margin: 0 }}>Announcement / Alert Paragraphs</label>
              <button
                type="button"
                onClick={() =>
                  setData({
                    ...data,
                    outcomes: {
                      ...data.outcomes,
                      paragraphs: [...data.outcomes.paragraphs, ''],
                    },
                  })
                }
                className="admin-btn admin-btn--secondary"
                style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.8rem', padding: '0.35rem 0.75rem' }}
              >
                <Plus size={14} /> Add Paragraph
              </button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {data.outcomes.paragraphs.map((p, idx) => (
                <div key={idx} style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-start' }}>
                  <textarea
                    rows={3}
                    value={p}
                    onChange={(e) => {
                      const updated = [...data.outcomes.paragraphs];
                      updated[idx] = e.target.value;
                      setData({ ...data, outcomes: { ...data.outcomes, paragraphs: updated } });
                    }}
                    className="admin-textarea"
                    style={{ flex: 1 }}
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const updated = data.outcomes.paragraphs.filter((_, i) => i !== idx);
                      setData({ ...data, outcomes: { ...data.outcomes, paragraphs: updated } });
                    }}
                    className="admin-btn-danger"
                    style={{ padding: '0.55rem 0.7rem' }}
                    title="Remove paragraph"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Sustainability Impact Brief */}
          <div style={{ padding: '1rem', border: '1px solid #e2e8f0', borderRadius: '8px', background: '#f8fafc', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <label className="admin-label" style={{ margin: 0, color: '#0f766e', fontWeight: 700 }}>
              Eco-Housing & Sustainability Impact Brief
            </label>
            <input
              type="text"
              value={data.outcomes.briefHeading || ''}
              onChange={(e) => setData({ ...data, outcomes: { ...data.outcomes, briefHeading: e.target.value } })}
              className="admin-input"
              placeholder="Eco-Housing & Sustainability Impact"
            />
            <textarea
              rows={4}
              value={data.outcomes.brief}
              onChange={(e) => setData({ ...data, outcomes: { ...data.outcomes, brief: e.target.value } })}
              className="admin-textarea"
            />
          </div>

          {/* Team Table */}
          <div style={{ padding: '1rem', border: '1px solid #e2e8f0', borderRadius: '8px', background: '#f8fafc', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
              <div>
                <label className="admin-label" style={{ margin: 0, color: '#0f766e', fontWeight: 700 }}>
                  Incubated Student Innovators Team Table
                </label>
                <input
                  type="text"
                  value={data.outcomes.teamTitle || ''}
                  onChange={(e) => setData({ ...data, outcomes: { ...data.outcomes, teamTitle: e.target.value } })}
                  className="admin-input"
                  placeholder="ITIC BUILD Incubated Student Innovators Team (SMB)"
                  style={{ marginTop: '0.35rem' }}
                />
              </div>
              <button
                type="button"
                onClick={() => {
                  const currentRows = data.outcomes.team?.rows || [];
                  const nextNo = (currentRows.length + 1).toString();
                  setData({
                    ...data,
                    outcomes: {
                      ...data.outcomes,
                      team: {
                        headers: data.outcomes.team?.headers || ['S.No', 'Regd. No.', 'Name'],
                        rows: [...currentRows, { cells: [nextNo, '', ''] }],
                      },
                    },
                  });
                }}
                className="admin-btn admin-btn--secondary"
                style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.8rem', padding: '0.35rem 0.75rem' }}
              >
                <Plus size={14} /> Add Founder Row
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {(data.outcomes.team?.rows || []).map((row, rIdx) => (
                <div key={rIdx} style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                  <input
                    type="text"
                    placeholder="S.No"
                    value={row.cells[0] || ''}
                    onChange={(e) => {
                      const updated = [...(data.outcomes.team?.rows || [])];
                      updated[rIdx] = { cells: [e.target.value, row.cells[1], row.cells[2]] };
                      setData({ ...data, outcomes: { ...data.outcomes, team: { ...data.outcomes.team, rows: updated } } });
                    }}
                    className="admin-input"
                    style={{ width: '60px', textAlign: 'center', padding: '0.4rem' }}
                  />
                  <input
                    type="text"
                    placeholder="Regd No."
                    value={row.cells[1] || ''}
                    onChange={(e) => {
                      const updated = [...(data.outcomes.team?.rows || [])];
                      updated[rIdx] = { cells: [row.cells[0], e.target.value, row.cells[2]] };
                      setData({ ...data, outcomes: { ...data.outcomes, team: { ...data.outcomes.team, rows: updated } } });
                    }}
                    className="admin-input"
                    style={{ width: '140px', fontFamily: 'monospace', padding: '0.4rem' }}
                  />
                  <input
                    type="text"
                    placeholder="Name & Year"
                    value={row.cells[2] || ''}
                    onChange={(e) => {
                      const updated = [...(data.outcomes.team?.rows || [])];
                      updated[rIdx] = { cells: [row.cells[0], row.cells[1], e.target.value] };
                      setData({ ...data, outcomes: { ...data.outcomes, team: { ...data.outcomes.team, rows: updated } } });
                    }}
                    className="admin-input"
                    style={{ flex: 1, padding: '0.4rem' }}
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const updated = (data.outcomes.team?.rows || []).filter((_, i) => i !== rIdx);
                      setData({ ...data, outcomes: { ...data.outcomes, team: { ...data.outcomes.team, rows: updated } } });
                    }}
                    className="admin-btn-danger"
                    style={{ padding: '0.4rem 0.55rem' }}
                    title="Remove row"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 6. Academic Research Project */}
      {activeTab === 'academicProject' && (
        <div className="admin-card" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div>
            <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 700, color: '#0f172a' }}>
              6. Academic Research Project Spotlight
            </h3>
            <p style={{ margin: '0.25rem 0 0', fontSize: '0.85rem', color: '#64748b' }}>
              Edit final year research project title, narrative paragraphs, and student research team table.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
            <div className="admin-field">
              <label className="admin-label">Badge</label>
              <input
                type="text"
                value={data.academicProject.badge || ''}
                onChange={(e) => setData({ ...data, academicProject: { ...data.academicProject, badge: e.target.value } })}
                className="admin-input"
                placeholder="Academic Research Project Spotlight"
              />
            </div>
            <div className="admin-field">
              <label className="admin-label">Project Heading</label>
              <input
                type="text"
                value={data.academicProject.heading || ''}
                onChange={(e) => setData({ ...data, academicProject: { ...data.academicProject, heading: e.target.value } })}
                className="admin-input"
              />
            </div>
          </div>

          {/* Project Paragraphs */}
          <div className="admin-field">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
              <label className="admin-label" style={{ margin: 0 }}>Project Narrative Paragraphs</label>
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
                className="admin-btn admin-btn--secondary"
                style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.8rem', padding: '0.35rem 0.75rem' }}
              >
                <Plus size={14} /> Add Paragraph
              </button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {(data.academicProject?.paragraphs || []).map((p, idx) => (
                <div key={idx} style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-start' }}>
                  <textarea
                    rows={3}
                    value={p}
                    onChange={(e) => {
                      const updated = [...(data.academicProject?.paragraphs || [])];
                      updated[idx] = e.target.value;
                      setData({
                        ...data,
                        academicProject: { ...data.academicProject, paragraphs: updated },
                      });
                    }}
                    className="admin-textarea"
                    style={{ flex: 1 }}
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const updated = (data.academicProject?.paragraphs || []).filter((_, i) => i !== idx);
                      setData({
                        ...data,
                        academicProject: { ...data.academicProject, paragraphs: updated },
                      });
                    }}
                    className="admin-btn-danger"
                    style={{ padding: '0.55rem 0.7rem' }}
                    title="Remove paragraph"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Team Table */}
          <div style={{ padding: '1rem', border: '1px solid #e2e8f0', borderRadius: '8px', background: '#f8fafc', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
              <div>
                <label className="admin-label" style={{ margin: 0, color: '#0f766e', fontWeight: 700 }}>
                  Project Research Team Table
                </label>
                <input
                  type="text"
                  value={data.academicProject.teamTitle || ''}
                  onChange={(e) => setData({ ...data, academicProject: { ...data.academicProject, teamTitle: e.target.value } })}
                  className="admin-input"
                  placeholder="Project Research Team"
                  style={{ marginTop: '0.35rem' }}
                />
              </div>
              <button
                type="button"
                onClick={() => {
                  const currentRows = data.academicProject?.team?.rows || [];
                  const nextNo = (currentRows.length + 1).toString();
                  setData({
                    ...data,
                    academicProject: {
                      ...data.academicProject,
                      team: {
                        headers: data.academicProject?.team?.headers || ['S.No', 'Regd No.', 'Name', 'Faculty'],
                        rows: [...currentRows, { cells: [nextNo, '', '', ''] }],
                      },
                    },
                  });
                }}
                className="admin-btn admin-btn--secondary"
                style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.8rem', padding: '0.35rem 0.75rem' }}
              >
                <Plus size={14} /> Add Member Row
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {(data.academicProject?.team?.rows || []).map((row, rIdx) => (
                <div key={rIdx} style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                  <input
                    type="text"
                    placeholder="S.No"
                    value={row.cells[0] || ''}
                    onChange={(e) => {
                      const updated = [...(data.academicProject?.team?.rows || [])];
                      updated[rIdx] = { cells: [e.target.value, row.cells[1], row.cells[2], row.cells[3]] };
                      setData({ ...data, academicProject: { ...data.academicProject, team: { ...data.academicProject.team, rows: updated } } });
                    }}
                    className="admin-input"
                    style={{ width: '60px', textAlign: 'center', padding: '0.4rem' }}
                  />
                  <input
                    type="text"
                    placeholder="Regd No."
                    value={row.cells[1] || ''}
                    onChange={(e) => {
                      const updated = [...(data.academicProject?.team?.rows || [])];
                      updated[rIdx] = { cells: [row.cells[0], e.target.value, row.cells[2], row.cells[3]] };
                      setData({ ...data, academicProject: { ...data.academicProject, team: { ...data.academicProject.team, rows: updated } } });
                    }}
                    className="admin-input"
                    style={{ width: '130px', fontFamily: 'monospace', padding: '0.4rem' }}
                  />
                  <input
                    type="text"
                    placeholder="Student Name"
                    value={row.cells[2] || ''}
                    onChange={(e) => {
                      const updated = [...(data.academicProject?.team?.rows || [])];
                      updated[rIdx] = { cells: [row.cells[0], row.cells[1], e.target.value, row.cells[3]] };
                      setData({ ...data, academicProject: { ...data.academicProject, team: { ...data.academicProject.team, rows: updated } } });
                    }}
                    className="admin-input"
                    style={{ flex: 1, padding: '0.4rem' }}
                  />
                  <input
                    type="text"
                    placeholder="Faculty Guide"
                    value={row.cells[3] || ''}
                    onChange={(e) => {
                      const updated = [...(data.academicProject?.team?.rows || [])];
                      updated[rIdx] = { cells: [row.cells[0], row.cells[1], row.cells[2], e.target.value] };
                      setData({ ...data, academicProject: { ...data.academicProject, team: { ...data.academicProject.team, rows: updated } } });
                    }}
                    className="admin-input"
                    style={{ flex: 1, padding: '0.4rem' }}
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const updated = (data.academicProject?.team?.rows || []).filter((_, i) => i !== rIdx);
                      setData({ ...data, academicProject: { ...data.academicProject, team: { ...data.academicProject.team, rows: updated } } });
                    }}
                    className="admin-btn-danger"
                    style={{ padding: '0.4rem 0.55rem' }}
                    title="Remove member"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 7. Students Benefited Directory */}
      {activeTab === 'studentsBenefited' && (
        <div className="admin-card" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
            <div>
              <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 700, color: '#0f172a' }}>
                7. Students Benefited Directory (Cohort Groups)
              </h3>
              <p style={{ margin: '0.25rem 0 0', fontSize: '0.85rem', color: '#64748b' }}>
                Manage student engineer cohorts (IV Years, III Years, II Years) with their registered numbers.
              </p>
            </div>
            <button
              type="button"
              onClick={() =>
                setData({
                  ...data,
                  studentsBenefited: [
                    ...data.studentsBenefited,
                    { yearLabel: 'New Cohort', students: [{ regdNo: '', name: '' }] },
                  ],
                })
              }
              className="admin-btn admin-btn--secondary"
              style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.85rem' }}
            >
              <Plus size={14} /> Add Year Cohort
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1rem' }}>
            <div className="admin-field">
              <label className="admin-label">Tag</label>
              <input
                type="text"
                value={data.beneficiariesTag || ''}
                onChange={(e) => setData({ ...data, beneficiariesTag: e.target.value })}
                className="admin-input"
                placeholder="Skill & Research Training"
              />
            </div>
            <div className="admin-field">
              <label className="admin-label">Title</label>
              <input
                type="text"
                value={data.beneficiariesTitle || ''}
                onChange={(e) => setData({ ...data, beneficiariesTitle: e.target.value })}
                className="admin-input"
                placeholder="Students Benefited Directory"
              />
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {data.studentsBenefited.map((cohort, cIdx) => (
              <div key={cIdx} style={{ padding: '1.25rem', border: '1px solid #e2e8f0', borderRadius: '8px', background: '#f8fafc', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <label className="admin-label" style={{ margin: 0 }}>Cohort Label:</label>
                    <input
                      type="text"
                      value={cohort.yearLabel}
                      onChange={(e) => {
                        const updated = [...data.studentsBenefited];
                        updated[cIdx] = { ...updated[cIdx], yearLabel: e.target.value };
                        setData({ ...data, studentsBenefited: updated });
                      }}
                      className="admin-input"
                      style={{ fontWeight: 700, width: '200px' }}
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      setData({
                        ...data,
                        studentsBenefited: data.studentsBenefited.filter((_, i) => i !== cIdx),
                      })
                    }
                    className="admin-btn-danger"
                    style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.8rem', padding: '0.35rem 0.75rem' }}
                  >
                    <Trash2 size={14} /> Delete Cohort
                  </button>
                </div>

                {/* Students list */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#475569' }}>Students ({cohort.students.length}):</span>
                    <button
                      type="button"
                      onClick={() => {
                        const updated = [...data.studentsBenefited];
                        updated[cIdx] = {
                          ...updated[cIdx],
                          students: [...updated[cIdx].students, { regdNo: '', name: '' }],
                        };
                        setData({ ...data, studentsBenefited: updated });
                      }}
                      className="admin-btn admin-btn--secondary"
                      style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.75rem', padding: '0.25rem 0.5rem' }}
                    >
                      <Plus size={12} /> Add Student
                    </button>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '0.5rem', maxHeight: '320px', overflowY: 'auto', padding: '0.5rem', background: '#ffffff', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
                    {cohort.students.map((st, sIdx) => (
                      <div key={sIdx} style={{ display: 'flex', gap: '0.35rem', alignItems: 'center', background: '#f8fafc', padding: '0.35rem', borderRadius: '4px', border: '1px solid #cbd5e1' }}>
                        <span style={{ fontSize: '0.75rem', color: '#94a3b8', width: '20px', textAlign: 'right' }}>{sIdx + 1}.</span>
                        <input
                          type="text"
                          placeholder="Regd No"
                          value={st.regdNo}
                          onChange={(e) => {
                            const updated = [...data.studentsBenefited];
                            const updatedStudents = [...updated[cIdx].students];
                            updatedStudents[sIdx] = { ...updatedStudents[sIdx], regdNo: e.target.value };
                            updated[cIdx] = { ...updated[cIdx], students: updatedStudents };
                            setData({ ...data, studentsBenefited: updated });
                          }}
                          className="admin-input"
                          style={{ width: '100px', padding: '0.25rem 0.4rem', fontSize: '0.75rem', textTransform: 'uppercase', fontFamily: 'monospace' }}
                        />
                        <input
                          type="text"
                          placeholder="Student Name"
                          value={st.name}
                          onChange={(e) => {
                            const updated = [...data.studentsBenefited];
                            const updatedStudents = [...updated[cIdx].students];
                            updatedStudents[sIdx] = { ...updatedStudents[sIdx], name: e.target.value };
                            updated[cIdx] = { ...updated[cIdx], students: updatedStudents };
                            setData({ ...data, studentsBenefited: updated });
                          }}
                          className="admin-input"
                          style={{ flex: 1, padding: '0.25rem 0.4rem', fontSize: '0.75rem' }}
                        />
                        <button
                          type="button"
                          onClick={() => {
                            const updated = [...data.studentsBenefited];
                            updated[cIdx] = {
                              ...updated[cIdx],
                              students: updated[cIdx].students.filter((_, i) => i !== sIdx),
                            };
                            setData({ ...data, studentsBenefited: updated });
                          }}
                          className="admin-btn-danger"
                          style={{ padding: '0.25rem 0.35rem' }}
                          title="Remove student"
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 8. Expos & Exposure Visits */}
      {activeTab === 'activities' && (
        <div className="admin-card" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
            <div>
              <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 700, color: '#0f172a' }}>
                8. Department Expos & Exposure Visits
              </h3>
              <p style={{ margin: '0.25rem 0 0', fontSize: '0.85rem', color: '#64748b' }}>
                Add and manage department expos, student technical visits, and outreach events.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setData({ ...data, activities: [...data.activities, ''] })}
              className="admin-btn admin-btn--secondary"
              style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.8rem', padding: '0.35rem 0.75rem' }}
            >
              <Plus size={14} /> Add Event Point
            </button>
          </div>

          <div className="admin-field">
            <label className="admin-label">Section Title</label>
            <input
              type="text"
              value={data.activitiesTitle || ''}
              onChange={(e) => setData({ ...data, activitiesTitle: e.target.value })}
              className="admin-input"
              placeholder="Department Expos & Exposure Visits"
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {data.activities.map((act, idx) => (
              <div key={idx} style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-start' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#64748b', width: '1.5rem', textAlign: 'right', marginTop: '0.5rem' }}>
                  {idx + 1}.
                </span>
                <textarea
                  rows={2}
                  value={act}
                  onChange={(e) => {
                    const updated = [...data.activities];
                    updated[idx] = e.target.value;
                    setData({ ...data, activities: updated });
                  }}
                  className="admin-textarea"
                  style={{ flex: 1 }}
                />
                <button
                  type="button"
                  onClick={() => setData({ ...data, activities: data.activities.filter((_, i) => i !== idx) })}
                  className="admin-btn-danger"
                  style={{ padding: '0.5rem 0.65rem' }}
                  title="Remove event point"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 9. Photo Gallery */}
      {activeTab === 'gallery' && (
        <div className="admin-card" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div>
            <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 700, color: '#0f172a' }}>
              9. Laboratory Photo Gallery
            </h3>
            <p style={{ margin: '0.25rem 0 0', fontSize: '0.85rem', color: '#64748b' }}>
              Upload laboratory pictures, construction models, and student field testing photos.
            </p>
          </div>

          <div style={{ padding: '1.25rem', border: '2px dashed #cbd5e1', borderRadius: '8px', background: '#f8fafc', textAlign: 'center' }}>
            <ImageUploader
              folder="differentiators/dream-house-lab"
              onUploaded={(res: UploadResult) => {
                const newPhoto: DhclGalleryPhoto = {
                  imageUrl: res.url,
                  caption: 'Dream House Lab Activity',
                  storagePath: res.path,
                };
                setData({ ...data, gallery: [...(data.gallery || []), newPhoto] });
              }}
              label="Upload New Gallery Photo"
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '1rem', marginTop: '0.5rem' }}>
            {(data.gallery || []).map((photo, idx) => (
              <div key={idx} style={{ border: '1px solid #e2e8f0', borderRadius: '8px', overflow: 'hidden', background: '#ffffff', display: 'flex', flexDirection: 'column' }}>
                <img
                  src={photo.imageUrl}
                  alt={photo.caption || 'Dream House Lab'}
                  style={{ width: '100%', height: '160px', objectFit: 'cover' }}
                />
                <div style={{ padding: '0.75rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', flex: 1 }}>
                  <input
                    type="text"
                    value={photo.caption || ''}
                    placeholder="Photo caption..."
                    onChange={(e) => {
                      const updated = [...(data.gallery || [])];
                      updated[idx] = { ...updated[idx], caption: e.target.value };
                      setData({ ...data, gallery: updated });
                    }}
                    className="admin-input"
                    style={{ fontSize: '0.8rem' }}
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const updated = (data.gallery || []).filter((_, i) => i !== idx);
                      setData({ ...data, gallery: updated });
                    }}
                    className="admin-btn-danger"
                    style={{ width: '100%', padding: '0.35rem', fontSize: '0.75rem', marginTop: 'auto' }}
                  >
                    <Trash2 size={12} /> Remove Photo
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 10. Key Highlights */}
      {activeTab === 'highlights' && (
        <div className="admin-card" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
            <div>
              <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 700, color: '#0f172a' }}>
                10. Key Highlights
              </h3>
              <p style={{ margin: '0.25rem 0 0', fontSize: '0.85rem', color: '#64748b' }}>
                Manage the Key Highlights bullet points displayed on the public page.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setData({ ...data, highlights: [...(data.highlights || []), ''] })}
              className="admin-btn admin-btn--secondary"
              style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.8rem', padding: '0.35rem 0.75rem' }}
            >
              <Plus size={14} /> Add Highlight
            </button>
          </div>

          <div className="admin-field">
            <label className="admin-label">Accordion Title</label>
            <input
              type="text"
              value={data.highlightsTitle || ''}
              onChange={(e) => setData({ ...data, highlightsTitle: e.target.value })}
              className="admin-input"
              placeholder="Key Highlights"
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {(data.highlights || []).map((item, idx) => (
              <div key={idx} style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-start' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#64748b', width: '1.5rem', textAlign: 'right', marginTop: '0.5rem' }}>
                  {idx + 1}.
                </span>
                <textarea
                  rows={2}
                  value={item}
                  onChange={(e) => {
                    const updated = [...(data.highlights || [])];
                    updated[idx] = e.target.value;
                    setData({ ...data, highlights: updated });
                  }}
                  className="admin-textarea"
                  style={{ flex: 1 }}
                />
                <button
                  type="button"
                  onClick={() => setData({ ...data, highlights: (data.highlights || []).filter((_, i) => i !== idx) })}
                  className="admin-btn-danger"
                  style={{ padding: '0.5rem 0.65rem' }}
                  title="Remove highlight"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 11. Facilities & Equipment */}
      {activeTab === 'facilities' && (
        <div className="admin-card" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
            <div>
              <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 700, color: '#0f172a' }}>
                11. Facilities & Equipment
              </h3>
              <p style={{ margin: '0.25rem 0 0', fontSize: '0.85rem', color: '#64748b' }}>
                Manage laboratory equipment, testing machinery, and computational tools.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setData({ ...data, facilities: [...(data.facilities || []), ''] })}
              className="admin-btn admin-btn--secondary"
              style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.8rem', padding: '0.35rem 0.75rem' }}
            >
              <Plus size={14} /> Add Facility Point
            </button>
          </div>

          <div className="admin-field">
            <label className="admin-label">Accordion Title</label>
            <input
              type="text"
              value={data.facilitiesTitle || ''}
              onChange={(e) => setData({ ...data, facilitiesTitle: e.target.value })}
              className="admin-input"
              placeholder="Facilities & Equipment"
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {(data.facilities || []).map((item, idx) => (
              <div key={idx} style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-start' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#64748b', width: '1.5rem', textAlign: 'right', marginTop: '0.5rem' }}>
                  {idx + 1}.
                </span>
                <textarea
                  rows={2}
                  value={item}
                  onChange={(e) => {
                    const updated = [...(data.facilities || [])];
                    updated[idx] = e.target.value;
                    setData({ ...data, facilities: updated });
                  }}
                  className="admin-textarea"
                  style={{ flex: 1 }}
                />
                <button
                  type="button"
                  onClick={() => setData({ ...data, facilities: (data.facilities || []).filter((_, i) => i !== idx) })}
                  className="admin-btn-danger"
                  style={{ padding: '0.5rem 0.65rem' }}
                  title="Remove facility point"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 12. Partners */}
      {activeTab === 'partners' && (
        <div className="admin-card" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
            <div>
              <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 700, color: '#0f172a' }}>
                12. Partners & Industry Collaborations
              </h3>
              <p style={{ margin: '0.25rem 0 0', fontSize: '0.85rem', color: '#64748b' }}>
                Manage institutional, academic, and research partners.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setData({ ...data, partners: [...(data.partners || []), ''] })}
              className="admin-btn admin-btn--secondary"
              style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.8rem', padding: '0.35rem 0.75rem' }}
            >
              <Plus size={14} /> Add Partner
            </button>
          </div>

          <div className="admin-field">
            <label className="admin-label">Accordion Title</label>
            <input
              type="text"
              value={data.partnersTitle || ''}
              onChange={(e) => setData({ ...data, partnersTitle: e.target.value })}
              className="admin-input"
              placeholder="Partners"
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {(data.partners || []).map((item, idx) => (
              <div key={idx} style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-start' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#64748b', width: '1.5rem', textAlign: 'right', marginTop: '0.5rem' }}>
                  {idx + 1}.
                </span>
                <textarea
                  rows={2}
                  value={item}
                  onChange={(e) => {
                    const updated = [...(data.partners || [])];
                    updated[idx] = e.target.value;
                    setData({ ...data, partners: updated });
                  }}
                  className="admin-textarea"
                  style={{ flex: 1 }}
                />
                <button
                  type="button"
                  onClick={() => setData({ ...data, partners: (data.partners || []).filter((_, i) => i !== idx) })}
                  className="admin-btn-danger"
                  style={{ padding: '0.5rem 0.65rem' }}
                  title="Remove partner"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 13. Dynamic Custom Section */}
      {activeTab === 'customSections' && (
        <div className="admin-card" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
            <div>
              <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 700, color: '#0f172a' }}>
                13. Dynamic Custom Sections
              </h3>
              <p style={{ margin: '0.25rem 0 0', fontSize: '0.85rem', color: '#64748b' }}>
                Add custom content blocks that render cleanly on the public Dream House Construction Lab page.
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                const newSec: CustomDhclSection = {
                  id: `custom-${Date.now()}`,
                  title: 'New Custom Section',
                  badge: 'Special Initiative',
                  paragraphs: [''],
                  bulletPoints: [''],
                };
                setData({
                  ...data,
                  additionalSections: [...(data.additionalSections || []), newSec],
                });
              }}
              className="admin-btn admin-btn--secondary"
              style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.85rem' }}
            >
              <Plus size={14} /> Add Custom Section
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {(data.additionalSections || []).map((sec, sIdx) => (
              <div key={sec.id} style={{ padding: '1.25rem', border: '1px solid #cbd5e1', borderRadius: '8px', background: '#f8fafc', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
                  <span style={{ fontSize: '0.9rem', fontWeight: 700, color: '#0f766e' }}>
                    Custom Section #{sIdx + 1}
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      const updated = (data.additionalSections || []).filter((_, i) => i !== sIdx);
                      setData({ ...data, additionalSections: updated });
                    }}
                    className="admin-btn-danger"
                    style={{ padding: '0.35rem 0.75rem', fontSize: '0.8rem' }}
                  >
                    <Trash2 size={14} /> Delete Section
                  </button>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
                  <div className="admin-field">
                    <label className="admin-label">Section Title</label>
                    <input
                      type="text"
                      value={sec.title}
                      onChange={(e) => {
                        const updated = [...(data.additionalSections || [])];
                        updated[sIdx] = { ...updated[sIdx], title: e.target.value };
                        setData({ ...data, additionalSections: updated });
                      }}
                      className="admin-input"
                    />
                  </div>
                  <div className="admin-field">
                    <label className="admin-label">Badge Label (optional)</label>
                    <input
                      type="text"
                      value={sec.badge || ''}
                      onChange={(e) => {
                        const updated = [...(data.additionalSections || [])];
                        updated[sIdx] = { ...updated[sIdx], badge: e.target.value };
                        setData({ ...data, additionalSections: updated });
                      }}
                      className="admin-input"
                    />
                  </div>
                </div>

                {/* Paragraphs */}
                <div className="admin-field">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                    <label className="admin-label" style={{ margin: 0, fontSize: '0.8rem' }}>Paragraphs</label>
                    <button
                      type="button"
                      onClick={() => {
                        const updated = [...(data.additionalSections || [])];
                        updated[sIdx] = {
                          ...updated[sIdx],
                          paragraphs: [...(updated[sIdx].paragraphs || []), ''],
                        };
                        setData({ ...data, additionalSections: updated });
                      }}
                      className="admin-btn admin-btn--secondary"
                      style={{ padding: '0.2rem 0.5rem', fontSize: '0.75rem' }}
                    >
                      <Plus size={12} /> Add Paragraph
                    </button>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    {(sec.paragraphs || []).map((p, pIdx) => (
                      <div key={pIdx} style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-start' }}>
                        <textarea
                          rows={2}
                          value={p}
                          onChange={(e) => {
                            const updated = [...(data.additionalSections || [])];
                            const updatedParas = [...(updated[sIdx].paragraphs || [])];
                            updatedParas[pIdx] = e.target.value;
                            updated[sIdx] = { ...updated[sIdx], paragraphs: updatedParas };
                            setData({ ...data, additionalSections: updated });
                          }}
                          className="admin-textarea"
                          style={{ flex: 1 }}
                        />
                        <button
                          type="button"
                          onClick={() => {
                            const updated = [...(data.additionalSections || [])];
                            const updatedParas = (updated[sIdx].paragraphs || []).filter((_, i) => i !== pIdx);
                            updated[sIdx] = { ...updated[sIdx], paragraphs: updatedParas };
                            setData({ ...data, additionalSections: updated });
                          }}
                          className="admin-btn-danger"
                          style={{ padding: '0.45rem 0.6rem' }}
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Bullet Points */}
                <div className="admin-field">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                    <label className="admin-label" style={{ margin: 0, fontSize: '0.8rem' }}>Checklist / Bullet Points</label>
                    <button
                      type="button"
                      onClick={() => {
                        const updated = [...(data.additionalSections || [])];
                        updated[sIdx] = {
                          ...updated[sIdx],
                          bulletPoints: [...(updated[sIdx].bulletPoints || []), ''],
                        };
                        setData({ ...data, additionalSections: updated });
                      }}
                      className="admin-btn admin-btn--secondary"
                      style={{ padding: '0.2rem 0.5rem', fontSize: '0.75rem' }}
                    >
                      <Plus size={12} /> Add Bullet
                    </button>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                    {(sec.bulletPoints || []).map((b, bIdx) => (
                      <div key={bIdx} style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                        <input
                          type="text"
                          value={b}
                          onChange={(e) => {
                            const updated = [...(data.additionalSections || [])];
                            const updatedBullets = [...(updated[sIdx].bulletPoints || [])];
                            updatedBullets[bIdx] = e.target.value;
                            updated[sIdx] = { ...updated[sIdx], bulletPoints: updatedBullets };
                            setData({ ...data, additionalSections: updated });
                          }}
                          className="admin-input"
                          style={{ flex: 1 }}
                        />
                        <button
                          type="button"
                          onClick={() => {
                            const updated = [...(data.additionalSections || [])];
                            const updatedBullets = (updated[sIdx].bulletPoints || []).filter((_, i) => i !== bIdx);
                            updated[sIdx] = { ...updated[sIdx], bulletPoints: updatedBullets };
                            setData({ ...data, additionalSections: updated });
                          }}
                          className="admin-btn-danger"
                          style={{ padding: '0.45rem 0.6rem' }}
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
