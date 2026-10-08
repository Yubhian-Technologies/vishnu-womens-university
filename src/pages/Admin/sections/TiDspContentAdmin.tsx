import { useEffect, useState } from 'react';
import { doc, serverTimestamp } from 'firebase/firestore';
import { setDoc } from '../../../lib/auditLog';
import { db } from '../../../lib/firebase';
import { useDocument } from '../../../hooks/useDocument';
import {
  tiDspCoe,
  type YearTab,
  type TiDspFacultyMember,
} from '../../Differentiators/tiDspCoe.data';

export interface CustomTiDspSection {
  id: string;
  title: string;
  badge?: string;
  paragraphs?: string[];
  bulletPoints?: string[];
}

export interface TiDspDoc {
  hero?: {
    title?: string;
    subtitle?: string;
  };
  aboutTitle?: string;
  overview?: string[];
  stats?: {
    dskValue?: string;
    dskLabel?: string;
    aicteValue?: string;
    aicteLabel?: string;
    dstValue?: string;
    dstLabel?: string;
    matlabValue?: string;
    matlabLabel?: string;
  };
  vision?: string;
  mission?: string[];
  objectives?: string[];
  labDevelopment?: string[];
  societalImpact?: string[];
  researchOutputs?: {
    title?: string;
    intro?: string;
    areas?: string[];
    publications?: string[];
  };
  trainingActivities?: {
    title?: string;
    activities?: { title: string }[];
  };
  keyHighlights?: string[];
  facilitiesEquipment?: string[];
  industryAssociation?: {
    title?: string;
    partner?: string;
    description?: string;
  };
  trainingResearch?: {
    title?: string;
    paragraphs?: string[];
    archiveTitle?: string;
    workshopTitle?: string;
    years?: YearTab[];
  };
  team?: {
    inCharge?: TiDspFacultyMember;
    facultyMembers?: TiDspFacultyMember[];
  };
  additionalSections?: CustomTiDspSection[];
}

const DEFAULT_STATE: TiDspDoc = {
  hero: {
    title: 'TI-DSP Centre of Excellence',
    subtitle: 'Advancing digital signal processing, speech and image processing, and application-oriented research through specialised DSP platforms, MATLAB-enabled learning and hands-on technical training.',
  },
  aboutTitle: tiDspCoe.aboutTitle,
  overview: [...tiDspCoe.overview],
  stats: {
    dskValue: 'TMS320C6713 DSKs',
    dskLabel: 'DSP Development Platforms',
    aicteValue: '₹10 Lakh',
    aicteLabel: 'AICTE-MODROBS Lab Modernisation Funding',
    dstValue: '₹53 Lakh',
    dstLabel: 'DST-Funded Telephony Speech Enhancement Research',
    matlabValue: 'MATLAB',
    matlabLabel: 'Campus-Wide Academic Access',
  },
  vision: tiDspCoe.vision,
  mission: [...tiDspCoe.mission],
  objectives: [...tiDspCoe.objectives],
  labDevelopment: [...tiDspCoe.labDevelopment],
  societalImpact: [...tiDspCoe.societalImpact],
  researchOutputs: {
    title: tiDspCoe.researchOutputs.title,
    intro: tiDspCoe.researchOutputs.intro,
    areas: [...tiDspCoe.researchOutputs.areas],
    publications: [...tiDspCoe.researchOutputs.publications],
  },
  trainingActivities: {
    title: tiDspCoe.trainingActivities.title,
    activities: tiDspCoe.trainingActivities.activities.map((a) => ({ ...a })),
  },
  keyHighlights: [...tiDspCoe.keyHighlights],
  facilitiesEquipment: [...tiDspCoe.facilitiesEquipment],
  industryAssociation: { ...tiDspCoe.industryAssociation },
  trainingResearch: {
    title: tiDspCoe.trainingResearch.title,
    paragraphs: [...tiDspCoe.trainingResearch.paragraphs],
    archiveTitle: tiDspCoe.trainingResearch.archiveTitle,
    workshopTitle: tiDspCoe.trainingResearch.workshopTitle,
    years: tiDspCoe.trainingResearch.years.map((y) => ({ ...y })),
  },
  team: {
    inCharge: { ...tiDspCoe.team.inCharge },
    facultyMembers: tiDspCoe.team.facultyMembers.map((m) => ({ ...m })),
  },
  additionalSections: [],
};

type ActiveSubSection =
  | 'overview'
  | 'vision'
  | 'objectives'
  | 'lab-support'
  | 'societal-impact'
  | 'research-outputs'
  | 'training-workshops'
  | 'highlights-facilities'
  | 'team'
  | 'custom-sections';

export default function TiDspContentAdmin() {
  const { data, loading } = useDocument<TiDspDoc>('settings', 'tiDspCoe');
  const [form, setForm] = useState<TiDspDoc>(DEFAULT_STATE);
  const [hasInitialized, setHasInitialized] = useState(false);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<ActiveSubSection>('overview');

  useEffect(() => {
    if (!loading && !hasInitialized) {
      if (data) {
        setForm({
          hero: { ...DEFAULT_STATE.hero, ...data.hero },
          aboutTitle: data.aboutTitle || DEFAULT_STATE.aboutTitle,
          overview: data.overview && data.overview.length > 0 ? data.overview : DEFAULT_STATE.overview,
          stats: { ...DEFAULT_STATE.stats, ...data.stats },
          vision: data.vision || DEFAULT_STATE.vision,
          mission: data.mission && data.mission.length > 0 ? data.mission : DEFAULT_STATE.mission,
          objectives: data.objectives && data.objectives.length > 0 ? data.objectives : DEFAULT_STATE.objectives,
          labDevelopment: data.labDevelopment && data.labDevelopment.length > 0 ? data.labDevelopment : DEFAULT_STATE.labDevelopment,
          societalImpact: data.societalImpact && data.societalImpact.length > 0 ? data.societalImpact : DEFAULT_STATE.societalImpact,
          researchOutputs: {
            title: data.researchOutputs?.title || DEFAULT_STATE.researchOutputs?.title,
            intro: data.researchOutputs?.intro || DEFAULT_STATE.researchOutputs?.intro,
            areas: data.researchOutputs?.areas && data.researchOutputs.areas.length > 0 ? data.researchOutputs.areas : DEFAULT_STATE.researchOutputs?.areas,
            publications: data.researchOutputs?.publications && data.researchOutputs.publications.length > 0 ? data.researchOutputs.publications : DEFAULT_STATE.researchOutputs?.publications,
          },
          trainingActivities: {
            title: data.trainingActivities?.title || DEFAULT_STATE.trainingActivities?.title,
            activities: data.trainingActivities?.activities && data.trainingActivities.activities.length > 0 ? data.trainingActivities.activities : DEFAULT_STATE.trainingActivities?.activities,
          },
          keyHighlights: data.keyHighlights && data.keyHighlights.length > 0 ? data.keyHighlights : DEFAULT_STATE.keyHighlights,
          facilitiesEquipment: data.facilitiesEquipment && data.facilitiesEquipment.length > 0 ? data.facilitiesEquipment : DEFAULT_STATE.facilitiesEquipment,
          industryAssociation: { ...DEFAULT_STATE.industryAssociation, ...data.industryAssociation },
          trainingResearch: {
            title: data.trainingResearch?.title || DEFAULT_STATE.trainingResearch?.title,
            paragraphs: data.trainingResearch?.paragraphs && data.trainingResearch.paragraphs.length > 0 ? data.trainingResearch.paragraphs : DEFAULT_STATE.trainingResearch?.paragraphs,
            archiveTitle: data.trainingResearch?.archiveTitle || DEFAULT_STATE.trainingResearch?.archiveTitle,
            workshopTitle: data.trainingResearch?.workshopTitle || DEFAULT_STATE.trainingResearch?.workshopTitle,
            years: data.trainingResearch?.years && data.trainingResearch.years.length > 0 ? data.trainingResearch.years : DEFAULT_STATE.trainingResearch?.years,
          },
          team: {
            inCharge: { ...DEFAULT_STATE.team?.inCharge, ...data.team?.inCharge },
            facultyMembers: data.team?.facultyMembers && data.team.facultyMembers.length > 0 ? data.team.facultyMembers : DEFAULT_STATE.team?.facultyMembers,
          },
          additionalSections: data.additionalSections || [],
        });
      }
      setHasInitialized(true);
    }
  }, [data, loading, hasInitialized]);

  const save = async () => {
    setSaving(true);
    try {
      await setDoc(doc(db, 'settings', 'tiDspCoe'), {
        ...form,
        updatedAt: serverTimestamp(),
      }, { merge: true });
      alert('TI-DSP Centre of Excellence content updated successfully! All changes are live on the website.');
    } catch (e) {
      alert(`Couldn't save: ${(e as Error).message}`);
    } finally {
      setSaving(false);
    }
  };

  const resetToDefaults = () => {
    if (confirm('Reset all TI-DSP text to default starting values? You can still edit them before saving.')) {
      setForm(DEFAULT_STATE);
    }
  };

  // Helper functions for paragraphs/lists
  const updateOverviewPara = (idx: number, text: string) => {
    const list = [...(form.overview || [])];
    list[idx] = text;
    setForm((p) => ({ ...p, overview: list }));
  };

  const addOverviewPara = () => {
    setForm((p) => ({ ...p, overview: [...(p.overview || []), ''] }));
  };

  const removeOverviewPara = (idx: number) => {
    setForm((p) => ({ ...p, overview: (p.overview || []).filter((_, i) => i !== idx) }));
  };

  const updateMissionItem = (idx: number, text: string) => {
    const list = [...(form.mission || [])];
    list[idx] = text;
    setForm((p) => ({ ...p, mission: list }));
  };

  const addMissionItem = () => {
    setForm((p) => ({ ...p, mission: [...(p.mission || []), ''] }));
  };

  const removeMissionItem = (idx: number) => {
    setForm((p) => ({ ...p, mission: (p.mission || []).filter((_, i) => i !== idx) }));
  };

  const updateObjective = (idx: number, text: string) => {
    const list = [...(form.objectives || [])];
    list[idx] = text;
    setForm((p) => ({ ...p, objectives: list }));
  };

  const addObjective = () => {
    setForm((p) => ({ ...p, objectives: [...(p.objectives || []), ''] }));
  };

  const removeObjective = (idx: number) => {
    setForm((p) => ({ ...p, objectives: (p.objectives || []).filter((_, i) => i !== idx) }));
  };

  const updateLabDevPara = (idx: number, text: string) => {
    const list = [...(form.labDevelopment || [])];
    list[idx] = text;
    setForm((p) => ({ ...p, labDevelopment: list }));
  };

  const addLabDevPara = () => {
    setForm((p) => ({ ...p, labDevelopment: [...(p.labDevelopment || []), ''] }));
  };

  const removeLabDevPara = (idx: number) => {
    setForm((p) => ({ ...p, labDevelopment: (p.labDevelopment || []).filter((_, i) => i !== idx) }));
  };

  const updateSocietalPara = (idx: number, text: string) => {
    const list = [...(form.societalImpact || [])];
    list[idx] = text;
    setForm((p) => ({ ...p, societalImpact: list }));
  };

  const addSocietalPara = () => {
    setForm((p) => ({ ...p, societalImpact: [...(p.societalImpact || []), ''] }));
  };

  const removeSocietalPara = (idx: number) => {
    setForm((p) => ({ ...p, societalImpact: (p.societalImpact || []).filter((_, i) => i !== idx) }));
  };

  const addCustomSection = () => {
    const newId = `section-${Date.now()}`;
    setForm((p) => ({
      ...p,
      additionalSections: [
        ...(p.additionalSections || []),
        {
          id: newId,
          title: 'New Section',
          badge: 'DSP Research & Development',
          paragraphs: ['Write section content here...'],
          bulletPoints: [],
        },
      ],
    }));
  };

  const updateCustomSection = (idx: number, field: keyof CustomTiDspSection, val: unknown) => {
    const list = [...(form.additionalSections || [])];
    if (list[idx]) {
      list[idx] = { ...list[idx], [field]: val };
      setForm((p) => ({ ...p, additionalSections: list }));
    }
  };

  const removeCustomSection = (idx: number) => {
    setForm((p) => ({
      ...p,
      additionalSections: (p.additionalSections || []).filter((_, i) => i !== idx),
    }));
  };

  return (
    <div style={{ background: '#fff', borderRadius: '12px', border: '1px solid #E2E8F0', padding: '1.5rem', marginTop: '1.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem', borderBottom: '1px solid #E2E8F0', paddingBottom: '1rem' }}>
        <div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0B1E42', margin: 0 }}>
            TI-DSP Centre of Excellence — All Page Content & Sections
          </h2>
          <p style={{ fontSize: '0.85rem', color: '#64748B', margin: '0.25rem 0 0 0' }}>
            Edit all texts, statistics, lab development notes, societal research, publications, and custom sections.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button type="button" onClick={resetToDefaults} className="admin-btn-secondary" style={{ fontSize: '0.8rem', padding: '0.45rem 0.85rem' }}>
            Reset to Defaults
          </button>
          <button type="button" onClick={save} disabled={saving} className="admin-btn-primary" style={{ fontSize: '0.8rem', padding: '0.45rem 1.1rem', background: '#008080', borderColor: '#008080' }}>
            {saving ? 'Saving...' : 'Save TI-DSP Content'}
          </button>
        </div>
      </div>

      {/* Subtabs Navigation */}
      <div style={{ display: 'flex', gap: '0.4rem', overflowX: 'auto', paddingBottom: '0.75rem', marginBottom: '1.5rem', borderBottom: '2px solid #F1F5F9' }}>
        {[
          { key: 'overview', label: '1. Overview & Stats' },
          { key: 'vision', label: '2. Vision & Mission' },
          { key: 'objectives', label: '3. Objectives' },
          { key: 'lab-support', label: '4. Modernisation & Support' },
          { key: 'societal-impact', label: '5. Societal Impact' },
          { key: 'research-outputs', label: '6. Publications & Outputs' },
          { key: 'training-workshops', label: '7. Training & Workshops' },
          { key: 'highlights-facilities', label: '8. Highlights & Facilities' },
          { key: 'team', label: '9. Team & Faculty' },
          { key: 'custom-sections', label: '10. Custom Extra Sections' },
        ].map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => setActiveTab(tab.key as ActiveSubSection)}
            style={{
              padding: '0.45rem 0.9rem',
              fontSize: '0.825rem',
              fontWeight: 700,
              borderRadius: '6px',
              border: 'none',
              background: activeTab === tab.key ? '#0B1E42' : '#F1F5F9',
              color: activeTab === tab.key ? '#fff' : '#475569',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* TAB 1: OVERVIEW & STATS */}
      {activeTab === 'overview' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div>
            <label className="admin-label">Hero Banner Subtitle / Tagline</label>
            <textarea
              className="admin-textarea"
              rows={2}
              value={form.hero?.subtitle || ''}
              onChange={(e) => setForm((p) => ({ ...p, hero: { ...p.hero, subtitle: e.target.value } }))}
            />
          </div>

          <div>
            <label className="admin-label">About Card Heading</label>
            <input
              type="text"
              className="admin-input"
              value={form.aboutTitle || ''}
              onChange={(e) => setForm((p) => ({ ...p, aboutTitle: e.target.value }))}
            />
          </div>

          <div>
            <label className="admin-label">Overview Paragraphs</label>
            {(form.overview || []).map((p, idx) => (
              <div key={idx} style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.6rem' }}>
                <textarea
                  className="admin-textarea"
                  rows={3}
                  value={p}
                  onChange={(e) => updateOverviewPara(idx, e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => removeOverviewPara(idx)}
                  className="admin-btn-danger"
                  style={{ alignSelf: 'flex-start' }}
                >
                  ✕
                </button>
              </div>
            ))}
            <button type="button" onClick={addOverviewPara} className="admin-btn-secondary" style={{ fontSize: '0.8rem' }}>
              + Add Paragraph
            </button>
          </div>

          <div style={{ background: '#F8FAFC', padding: '1rem', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
            <h4 style={{ margin: '0 0 0.75rem 0', fontSize: '0.95rem', fontWeight: 800, color: '#0B1E42' }}>
              Stat Highlights Strip
            </h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '0.75rem' }}>
              <div>
                <label className="admin-label">Stat 1 Value</label>
                <input
                  type="text"
                  className="admin-input"
                  value={form.stats?.dskValue || ''}
                  onChange={(e) => setForm((p) => ({ ...p, stats: { ...p.stats, dskValue: e.target.value } }))}
                />
                <label className="admin-label" style={{ marginTop: '0.3rem' }}>Stat 1 Label</label>
                <input
                  type="text"
                  className="admin-input"
                  value={form.stats?.dskLabel || ''}
                  onChange={(e) => setForm((p) => ({ ...p, stats: { ...p.stats, dskLabel: e.target.value } }))}
                />
              </div>
              <div>
                <label className="admin-label">Stat 2 Value (Funding)</label>
                <input
                  type="text"
                  className="admin-input"
                  value={form.stats?.aicteValue || ''}
                  onChange={(e) => setForm((p) => ({ ...p, stats: { ...p.stats, aicteValue: e.target.value } }))}
                />
                <label className="admin-label" style={{ marginTop: '0.3rem' }}>Stat 2 Label</label>
                <input
                  type="text"
                  className="admin-input"
                  value={form.stats?.aicteLabel || ''}
                  onChange={(e) => setForm((p) => ({ ...p, stats: { ...p.stats, aicteLabel: e.target.value } }))}
                />
              </div>
              <div>
                <label className="admin-label">Stat 3 Value (Research)</label>
                <input
                  type="text"
                  className="admin-input"
                  value={form.stats?.dstValue || ''}
                  onChange={(e) => setForm((p) => ({ ...p, stats: { ...p.stats, dstValue: e.target.value } }))}
                />
                <label className="admin-label" style={{ marginTop: '0.3rem' }}>Stat 3 Label</label>
                <input
                  type="text"
                  className="admin-input"
                  value={form.stats?.dstLabel || ''}
                  onChange={(e) => setForm((p) => ({ ...p, stats: { ...p.stats, dstLabel: e.target.value } }))}
                />
              </div>
              <div>
                <label className="admin-label">Stat 4 Value</label>
                <input
                  type="text"
                  className="admin-input"
                  value={form.stats?.matlabValue || ''}
                  onChange={(e) => setForm((p) => ({ ...p, stats: { ...p.stats, matlabValue: e.target.value } }))}
                />
                <label className="admin-label" style={{ marginTop: '0.3rem' }}>Stat 4 Label</label>
                <input
                  type="text"
                  className="admin-input"
                  value={form.stats?.matlabLabel || ''}
                  onChange={(e) => setForm((p) => ({ ...p, stats: { ...p.stats, matlabLabel: e.target.value } }))}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: VISION & MISSION */}
      {activeTab === 'vision' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div>
            <label className="admin-label">Strategic Vision Statement</label>
            <textarea
              className="admin-textarea"
              rows={3}
              value={form.vision || ''}
              onChange={(e) => setForm((p) => ({ ...p, vision: e.target.value }))}
            />
          </div>

          <div>
            <label className="admin-label">Institutional Mission Points</label>
            {(form.mission || []).map((m, idx) => (
              <div key={idx} style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <input
                  type="text"
                  className="admin-input"
                  value={m}
                  onChange={(e) => updateMissionItem(idx, e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => removeMissionItem(idx)}
                  className="admin-btn-danger"
                >
                  ✕
                </button>
              </div>
            ))}
            <button type="button" onClick={addMissionItem} className="admin-btn-secondary" style={{ fontSize: '0.8rem' }}>
              + Add Mission Point
            </button>
          </div>
        </div>
      )}

      {/* TAB 3: OBJECTIVES */}
      {activeTab === 'objectives' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <label className="admin-label">Core Objectives (Format: Title: Description)</label>
          {(form.objectives || []).map((obj, idx) => (
            <div key={idx} style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <input
                type="text"
                className="admin-input"
                value={obj}
                onChange={(e) => updateObjective(idx, e.target.value)}
              />
              <button
                type="button"
                onClick={() => removeObjective(idx)}
                className="admin-btn-danger"
              >
                ✕
              </button>
            </div>
          ))}
          <button type="button" onClick={addObjective} className="admin-btn-secondary" style={{ fontSize: '0.8rem' }}>
            + Add Objective
          </button>
        </div>
      )}

      {/* TAB 4: LAB MODERNISATION & SUPPORT */}
      {activeTab === 'lab-support' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div>
            <label className="admin-label">Lab Development & External Support Paragraphs</label>
            <p style={{ fontSize: '0.8rem', color: '#64748B', margin: '0 0 0.5rem 0' }}>
              Details about AICTE-MODROBS ₹10 lakh grant, Texas Instruments hardware, and development platforms.
            </p>
            {(form.labDevelopment || []).map((p, idx) => (
              <div key={idx} style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.6rem' }}>
                <textarea
                  className="admin-textarea"
                  rows={3}
                  value={p}
                  onChange={(e) => updateLabDevPara(idx, e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => removeLabDevPara(idx)}
                  className="admin-btn-danger"
                  style={{ alignSelf: 'flex-start' }}
                >
                  ✕
                </button>
              </div>
            ))}
            <button type="button" onClick={addLabDevPara} className="admin-btn-secondary" style={{ fontSize: '0.8rem' }}>
              + Add Paragraph
            </button>
          </div>
        </div>
      )}

      {/* TAB 5: SOCIETAL IMPACT */}
      {activeTab === 'societal-impact' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div>
            <label className="admin-label">Societal Impact Research Paragraphs</label>
            <p style={{ fontSize: '0.8rem', color: '#64748B', margin: '0 0 0.5rem 0' }}>
              Details about ₹53 Lakh DST grant, speech enhancement for hearing impairment, and social relevance.
            </p>
            {(form.societalImpact || []).map((p, idx) => (
              <div key={idx} style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.6rem' }}>
                <textarea
                  className="admin-textarea"
                  rows={3}
                  value={p}
                  onChange={(e) => updateSocietalPara(idx, e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => removeSocietalPara(idx)}
                  className="admin-btn-danger"
                  style={{ alignSelf: 'flex-start' }}
                >
                  ✕
                </button>
              </div>
            ))}
            <button type="button" onClick={addSocietalPara} className="admin-btn-secondary" style={{ fontSize: '0.8rem' }}>
              + Add Paragraph
            </button>
          </div>
        </div>
      )}

      {/* TAB 6: RESEARCH OUTPUTS & PUBLICATIONS */}
      {activeTab === 'research-outputs' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div>
            <label className="admin-label">Section Heading</label>
            <input
              type="text"
              className="admin-input"
              value={form.researchOutputs?.title || ''}
              onChange={(e) => setForm((p) => ({ ...p, researchOutputs: { ...p.researchOutputs, title: e.target.value } }))}
            />
          </div>
          <div>
            <label className="admin-label">Introductory Text</label>
            <textarea
              className="admin-textarea"
              rows={2}
              value={form.researchOutputs?.intro || ''}
              onChange={(e) => setForm((p) => ({ ...p, researchOutputs: { ...p.researchOutputs, intro: e.target.value } }))}
            />
          </div>
          <div>
            <label className="admin-label">Research Focus Areas (Checklist)</label>
            {(form.researchOutputs?.areas || []).map((area, idx) => (
              <div key={idx} style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.4rem' }}>
                <input
                  type="text"
                  className="admin-input"
                  value={area}
                  onChange={(e) => {
                    const list = [...(form.researchOutputs?.areas || [])];
                    list[idx] = e.target.value;
                    setForm((p) => ({ ...p, researchOutputs: { ...p.researchOutputs, areas: list } }));
                  }}
                />
                <button
                  type="button"
                  onClick={() => {
                    const list = (form.researchOutputs?.areas || []).filter((_, i) => i !== idx);
                    setForm((p) => ({ ...p, researchOutputs: { ...p.researchOutputs, areas: list } }));
                  }}
                  className="admin-btn-danger"
                >
                  ✕
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => {
                setForm((p) => ({ ...p, researchOutputs: { ...p.researchOutputs, areas: [...(p.researchOutputs?.areas || []), ''] } }));
              }}
              className="admin-btn-secondary"
              style={{ fontSize: '0.8rem' }}
            >
              + Add Research Area
            </button>
          </div>

          <div>
            <label className="admin-label">Selected Publications (Full IEEE / Journal citations)</label>
            {(form.researchOutputs?.publications || []).map((pub, idx) => (
              <div key={idx} style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <textarea
                  className="admin-textarea"
                  rows={2}
                  value={pub}
                  onChange={(e) => {
                    const list = [...(form.researchOutputs?.publications || [])];
                    list[idx] = e.target.value;
                    setForm((p) => ({ ...p, researchOutputs: { ...p.researchOutputs, publications: list } }));
                  }}
                />
                <button
                  type="button"
                  onClick={() => {
                    const list = (form.researchOutputs?.publications || []).filter((_, i) => i !== idx);
                    setForm((p) => ({ ...p, researchOutputs: { ...p.researchOutputs, publications: list } }));
                  }}
                  className="admin-btn-danger"
                  style={{ alignSelf: 'flex-start' }}
                >
                  ✕
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => {
                setForm((p) => ({ ...p, researchOutputs: { ...p.researchOutputs, publications: [...(p.researchOutputs?.publications || []), ''] } }));
              }}
              className="admin-btn-secondary"
              style={{ fontSize: '0.8rem' }}
            >
              + Add Publication Citation
            </button>
          </div>
        </div>
      )}

      {/* TAB 7: TRAINING & WORKSHOPS */}
      {activeTab === 'training-workshops' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div>
            <label className="admin-label">Training Activities Section Title</label>
            <input
              type="text"
              className="admin-input"
              value={form.trainingActivities?.title || ''}
              onChange={(e) => setForm((p) => ({ ...p, trainingActivities: { ...p.trainingActivities, title: e.target.value } }))}
            />
          </div>
          <div>
            <label className="admin-label">Conducted Workshops & Training List</label>
            {(form.trainingActivities?.activities || []).map((act, idx) => (
              <div key={idx} style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <input
                  type="text"
                  className="admin-input"
                  value={act.title}
                  onChange={(e) => {
                    const list = [...(form.trainingActivities?.activities || [])];
                    list[idx] = { title: e.target.value };
                    setForm((p) => ({ ...p, trainingActivities: { ...p.trainingActivities, activities: list } }));
                  }}
                />
                <button
                  type="button"
                  onClick={() => {
                    const list = (form.trainingActivities?.activities || []).filter((_, i) => i !== idx);
                    setForm((p) => ({ ...p, trainingActivities: { ...p.trainingActivities, activities: list } }));
                  }}
                  className="admin-btn-danger"
                >
                  ✕
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => {
                setForm((p) => ({ ...p, trainingActivities: { ...p.trainingActivities, activities: [...(p.trainingActivities?.activities || []), { title: '' }] } }));
              }}
              className="admin-btn-secondary"
              style={{ fontSize: '0.8rem' }}
            >
              + Add Workshop
            </button>
          </div>
        </div>
      )}

      {/* TAB 8: HIGHLIGHTS & FACILITIES */}
      {activeTab === 'highlights-facilities' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div>
            <label className="admin-label">Key Highlights Bullet Points</label>
            {(form.keyHighlights || []).map((hl, idx) => (
              <div key={idx} style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.4rem' }}>
                <input
                  type="text"
                  className="admin-input"
                  value={hl}
                  onChange={(e) => {
                    const list = [...(form.keyHighlights || [])];
                    list[idx] = e.target.value;
                    setForm((p) => ({ ...p, keyHighlights: list }));
                  }}
                />
                <button
                  type="button"
                  onClick={() => {
                    const list = (form.keyHighlights || []).filter((_, i) => i !== idx);
                    setForm((p) => ({ ...p, keyHighlights: list }));
                  }}
                  className="admin-btn-danger"
                >
                  ✕
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => setForm((p) => ({ ...p, keyHighlights: [...(p.keyHighlights || []), ''] }))}
              className="admin-btn-secondary"
              style={{ fontSize: '0.8rem' }}
            >
              + Add Highlight
            </button>
          </div>

          <div>
            <label className="admin-label">Facilities & Hardware Equipment</label>
            {(form.facilitiesEquipment || []).map((eq, idx) => (
              <div key={idx} style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.4rem' }}>
                <input
                  type="text"
                  className="admin-input"
                  value={eq}
                  onChange={(e) => {
                    const list = [...(form.facilitiesEquipment || [])];
                    list[idx] = e.target.value;
                    setForm((p) => ({ ...p, facilitiesEquipment: list }));
                  }}
                />
                <button
                  type="button"
                  onClick={() => {
                    const list = (form.facilitiesEquipment || []).filter((_, i) => i !== idx);
                    setForm((p) => ({ ...p, facilitiesEquipment: list }));
                  }}
                  className="admin-btn-danger"
                >
                  ✕
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => setForm((p) => ({ ...p, facilitiesEquipment: [...(p.facilitiesEquipment || []), ''] }))}
              className="admin-btn-secondary"
              style={{ fontSize: '0.8rem' }}
            >
              + Add Facility / Hardware Kit
            </button>
          </div>

          <div style={{ background: '#F8FAFC', padding: '1rem', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
            <h4 style={{ margin: '0 0 0.75rem 0', fontSize: '0.95rem', fontWeight: 800, color: '#0B1E42' }}>
              Industry Association Partner
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              <div>
                <label className="admin-label">Partner Name</label>
                <input
                  type="text"
                  className="admin-input"
                  value={form.industryAssociation?.partner || ''}
                  onChange={(e) => setForm((p) => ({ ...p, industryAssociation: { ...p.industryAssociation, partner: e.target.value } }))}
                />
              </div>
              <div>
                <label className="admin-label">Collaboration Summary</label>
                <textarea
                  className="admin-textarea"
                  rows={2}
                  value={form.industryAssociation?.description || ''}
                  onChange={(e) => setForm((p) => ({ ...p, industryAssociation: { ...p.industryAssociation, description: e.target.value } }))}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 9: TEAM & FACULTY */}
      {activeTab === 'team' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div>
            <h4 style={{ margin: '0 0 0.75rem', fontSize: '0.95rem', fontWeight: 800, color: '#0B1E42' }}>
              Faculty In-Charge
            </h4>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              <div>
                <label className="admin-label">Name</label>
                <input
                  type="text"
                  className="admin-input"
                  value={form.team?.inCharge?.name || ''}
                  onChange={(e) => setForm((p) => ({ ...p, team: { ...p.team, inCharge: { ...p.team?.inCharge, name: e.target.value } } }))}
                />
              </div>
              <div>
                <label className="admin-label">Designation</label>
                <input
                  type="text"
                  className="admin-input"
                  value={form.team?.inCharge?.designation || ''}
                  onChange={(e) => setForm((p) => ({ ...p, team: { ...p.team, inCharge: { ...p.team?.inCharge, designation: e.target.value } } }))}
                />
              </div>
              <div>
                <label className="admin-label">Email</label>
                <input
                  type="text"
                  className="admin-input"
                  value={form.team?.inCharge?.email || ''}
                  onChange={(e) => setForm((p) => ({ ...p, team: { ...p.team, inCharge: { ...p.team?.inCharge, email: e.target.value } } }))}
                />
              </div>
              <div>
                <label className="admin-label">Mobile</label>
                <input
                  type="text"
                  className="admin-input"
                  value={form.team?.inCharge?.mobile || ''}
                  onChange={(e) => setForm((p) => ({ ...p, team: { ...p.team, inCharge: { ...p.team?.inCharge, mobile: e.target.value } } }))}
                />
              </div>
              <div style={{ gridColumn: '1 / -1' }}>
                <label className="admin-label">Interests</label>
                <input
                  type="text"
                  className="admin-input"
                  value={form.team?.inCharge?.interests || ''}
                  onChange={(e) => setForm((p) => ({ ...p, team: { ...p.team, inCharge: { ...p.team?.inCharge, interests: e.target.value } } }))}
                />
              </div>
            </div>
          </div>

          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
              <h4 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 800, color: '#0B1E42' }}>
                Faculty Members
              </h4>
              <button
                type="button"
                onClick={() => {
                  setForm((p) => ({ ...p, team: { ...p.team, facultyMembers: [...(p.team?.facultyMembers || []), { name: '', designation: '', email: '', mobile: '', interests: '' }] } }));
                }}
                className="admin-btn-secondary"
                style={{ fontSize: '0.8rem' }}
              >
                + Add Faculty Member
              </button>
            </div>
            {(form.team?.facultyMembers || []).map((member, idx) => (
              <div key={idx} style={{ border: '1px solid #e2e8f0', borderRadius: '10px', padding: '0.9rem', marginBottom: '0.75rem', background: '#f8fafc' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.6rem' }}>
                  <div>
                    <label className="admin-label">Name</label>
                    <input
                      type="text"
                      className="admin-input"
                      value={member.name}
                      onChange={(e) => {
                        const list = [...(form.team?.facultyMembers || [])];
                        list[idx] = { ...list[idx], name: e.target.value };
                        setForm((p) => ({ ...p, team: { ...p.team, facultyMembers: list } }));
                      }}
                    />
                  </div>
                  <div>
                    <label className="admin-label">Designation</label>
                    <input
                      type="text"
                      className="admin-input"
                      value={member.designation || ''}
                      onChange={(e) => {
                        const list = [...(form.team?.facultyMembers || [])];
                        list[idx] = { ...list[idx], designation: e.target.value };
                        setForm((p) => ({ ...p, team: { ...p.team, facultyMembers: list } }));
                      }}
                    />
                  </div>
                  <div>
                    <label className="admin-label">Email</label>
                    <input
                      type="text"
                      className="admin-input"
                      value={member.email || ''}
                      onChange={(e) => {
                        const list = [...(form.team?.facultyMembers || [])];
                        list[idx] = { ...list[idx], email: e.target.value };
                        setForm((p) => ({ ...p, team: { ...p.team, facultyMembers: list } }));
                      }}
                    />
                  </div>
                  <div>
                    <label className="admin-label">Mobile</label>
                    <input
                      type="text"
                      className="admin-input"
                      value={member.mobile || ''}
                      onChange={(e) => {
                        const list = [...(form.team?.facultyMembers || [])];
                        list[idx] = { ...list[idx], mobile: e.target.value };
                        setForm((p) => ({ ...p, team: { ...p.team, facultyMembers: list } }));
                      }}
                    />
                  </div>
                  <div style={{ gridColumn: '1 / -1' }}>
                    <label className="admin-label">Interests</label>
                    <input
                      type="text"
                      className="admin-input"
                      value={member.interests || ''}
                      onChange={(e) => {
                        const list = [...(form.team?.facultyMembers || [])];
                        list[idx] = { ...list[idx], interests: e.target.value };
                        setForm((p) => ({ ...p, team: { ...p.team, facultyMembers: list } }));
                      }}
                    />
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    const list = (form.team?.facultyMembers || []).filter((_, i) => i !== idx);
                    setForm((p) => ({ ...p, team: { ...p.team, facultyMembers: list } }));
                  }}
                  className="admin-btn-danger"
                  style={{ marginTop: '0.6rem', fontSize: '0.8rem' }}
                >
                  ✕ Remove
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 10: CUSTOM SECTIONS */}
      {activeTab === 'custom-sections' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h4 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 800, color: '#0B1E42' }}>
              Custom Additional Sections
            </h4>
            <button type="button" onClick={addCustomSection} className="admin-btn-secondary" style={{ fontSize: '0.8rem' }}>
              + Add Section
            </button>
          </div>

          {(form.additionalSections || []).length === 0 ? (
            <div style={{ padding: '1.5rem', background: '#F8FAFC', borderRadius: '8px', textAlign: 'center', color: '#64748B', fontSize: '0.85rem' }}>
              No extra custom sections created yet. Click "+ Add Section" to create new dynamic blocks.
            </div>
          ) : (
            (form.additionalSections || []).map((sec, idx) => (
              <div key={sec.id} style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '8px', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontWeight: 800, fontSize: '0.85rem', color: '#0B1E42' }}>Section #{idx + 1}</span>
                  <button type="button" onClick={() => removeCustomSection(idx)} className="admin-btn-danger">
                    Delete Section
                  </button>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                  <div>
                    <label className="admin-label">Section Title</label>
                    <input
                      type="text"
                      className="admin-input"
                      value={sec.title}
                      onChange={(e) => updateCustomSection(idx, 'title', e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="admin-label">Badge Label</label>
                    <input
                      type="text"
                      className="admin-input"
                      value={sec.badge || ''}
                      onChange={(e) => updateCustomSection(idx, 'badge', e.target.value)}
                    />
                  </div>
                </div>
                <div>
                  <label className="admin-label">Paragraphs (one per line)</label>
                  <textarea
                    className="admin-textarea"
                    rows={3}
                    value={(sec.paragraphs || []).join('\n')}
                    onChange={(e) => updateCustomSection(idx, 'paragraphs', e.target.value.split('\n'))}
                  />
                </div>
                <div>
                  <label className="admin-label">Bullet Points (Optional, one per line)</label>
                  <textarea
                    className="admin-textarea"
                    rows={2}
                    value={(sec.bulletPoints || []).join('\n')}
                    onChange={(e) => updateCustomSection(idx, 'bulletPoints', e.target.value.split('\n').filter(Boolean))}
                  />
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Bottom Save Bar */}
      <div style={{ marginTop: '2rem', paddingTop: '1rem', borderTop: '1px solid #E2E8F0', display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
        <button type="button" onClick={save} disabled={saving} className="admin-btn-primary" style={{ padding: '0.6rem 1.5rem', background: '#008080', borderColor: '#008080' }}>
          {saving ? 'Saving...' : 'Save TI-DSP Content'}
        </button>
      </div>
    </div>
  );
}
