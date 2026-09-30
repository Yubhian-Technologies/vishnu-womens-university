import { useEffect, useState } from 'react';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../../lib/firebase';
import { useDocument } from '../../../hooks/useDocument';
import {
  aicteIdeaLab,
  type IdeaLabProcessStep,
  type IdeaLabPillar,
  type IdeaLabEquipmentItem,
} from '../../Differentiators/aicteIdeaLab.data';

export interface CustomIdeaLabSection {
  id: string;
  title: string;
  badge?: string;
  paragraphs?: string[];
  bulletPoints?: string[];
}

export interface AicteIdeaLabDoc {
  hero?: {
    category?: string;
    title?: string;
    tagline?: string;
    ctaPrimary?: string;
    ctaSecondary?: string;
  };
  telemetry?: { value: string; label: string }[];
  overview?: {
    title?: string;
    paragraphs?: string[];
  };
  process?: {
    title?: string;
    intro?: string;
    steps?: IdeaLabProcessStep[];
  };
  pillars?: IdeaLabPillar[];
  team?: {
    title?: string;
    intro?: string;
    contactNotice?: string;
  };
  ambassadors?: {
    title?: string;
    intro?: string;
    contactNotice?: string;
  };
  facilities?: {
    title?: string;
    paragraphs?: string[];
    defaultEquipment?: IdeaLabEquipmentItem[];
  };
  officialInfo?: {
    title?: string;
    aqisId?: string;
    institution?: string;
    headOfInstitution?: string;
    facultyCoordinators?: string[];
    email?: string;
  };
  cta?: {
    title?: string;
    description?: string;
    primaryBtn?: string;
    secondaryBtn?: string;
  };
  additionalSections?: CustomIdeaLabSection[];
}

const DEFAULT_STATE: AicteIdeaLabDoc = {
  hero: { ...aicteIdeaLab.hero },
  telemetry: aicteIdeaLab.telemetry.map((t) => ({ ...t })),
  overview: {
    title: aicteIdeaLab.overview.title,
    paragraphs: [...aicteIdeaLab.overview.paragraphs],
  },
  process: {
    title: aicteIdeaLab.process.title,
    intro: aicteIdeaLab.process.intro,
    steps: aicteIdeaLab.process.steps.map((s) => ({ ...s })),
  },
  pillars: aicteIdeaLab.pillars.map((p) => ({ ...p })),
  team: { ...aicteIdeaLab.team },
  ambassadors: { ...aicteIdeaLab.ambassadors },
  facilities: {
    title: aicteIdeaLab.facilities.title,
    paragraphs: [...aicteIdeaLab.facilities.paragraphs],
    defaultEquipment: aicteIdeaLab.facilities.defaultEquipment.map((e) => ({ ...e })),
  },
  officialInfo: {
    title: aicteIdeaLab.officialInfo.title,
    aqisId: aicteIdeaLab.officialInfo.aqisId,
    institution: aicteIdeaLab.officialInfo.institution,
    headOfInstitution: aicteIdeaLab.officialInfo.headOfInstitution,
    facultyCoordinators: [...aicteIdeaLab.officialInfo.facultyCoordinators],
    email: aicteIdeaLab.officialInfo.email,
  },
  cta: { ...aicteIdeaLab.cta },
  additionalSections: [],
};

type ActiveSubSection =
  | 'telemetry'
  | 'overview'
  | 'vision'
  | 'team-copy'
  | 'ambassadors-copy'
  | 'facilities-copy'
  | 'official-info'
  | 'custom-sections'
  | 'hero-cta';

export default function AicteIdeaLabContentAdmin() {
  const { data, loading } = useDocument<AicteIdeaLabDoc>('settings', 'aicteIdeaLab');
  const [form, setForm] = useState<AicteIdeaLabDoc>(DEFAULT_STATE);
  const [hasInitialized, setHasInitialized] = useState(false);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<ActiveSubSection>('overview');

  useEffect(() => {
    if (!loading && !hasInitialized) {
      if (data) {
        setForm({
          hero: { ...DEFAULT_STATE.hero, ...data.hero },
          telemetry: data.telemetry && data.telemetry.length > 0 ? data.telemetry : DEFAULT_STATE.telemetry,
          overview: {
            title: data.overview?.title || DEFAULT_STATE.overview?.title || '',
            paragraphs: data.overview?.paragraphs && data.overview.paragraphs.length > 0
              ? data.overview.paragraphs
              : DEFAULT_STATE.overview?.paragraphs || [],
          },
          process: {
            title: data.process?.title || DEFAULT_STATE.process?.title || '',
            intro: data.process?.intro || DEFAULT_STATE.process?.intro || '',
            steps: data.process?.steps && data.process.steps.length > 0
              ? data.process.steps
              : DEFAULT_STATE.process?.steps || [],
          },
          pillars: data.pillars && data.pillars.length > 0 ? data.pillars : DEFAULT_STATE.pillars,
          team: { ...DEFAULT_STATE.team, ...data.team },
          ambassadors: { ...DEFAULT_STATE.ambassadors, ...data.ambassadors },
          facilities: {
            title: data.facilities?.title || DEFAULT_STATE.facilities?.title || '',
            paragraphs: data.facilities?.paragraphs && data.facilities.paragraphs.length > 0
              ? data.facilities.paragraphs
              : DEFAULT_STATE.facilities?.paragraphs || [],
            defaultEquipment: data.facilities?.defaultEquipment && data.facilities.defaultEquipment.length > 0
              ? data.facilities.defaultEquipment
              : DEFAULT_STATE.facilities?.defaultEquipment || [],
          },
          officialInfo: {
            title: data.officialInfo?.title || DEFAULT_STATE.officialInfo?.title || '',
            aqisId: data.officialInfo?.aqisId || DEFAULT_STATE.officialInfo?.aqisId || '',
            institution: data.officialInfo?.institution || DEFAULT_STATE.officialInfo?.institution || '',
            headOfInstitution: data.officialInfo?.headOfInstitution || DEFAULT_STATE.officialInfo?.headOfInstitution || '',
            facultyCoordinators: data.officialInfo?.facultyCoordinators || DEFAULT_STATE.officialInfo?.facultyCoordinators || [],
            email: data.officialInfo?.email || DEFAULT_STATE.officialInfo?.email || '',
          },
          cta: { ...DEFAULT_STATE.cta, ...data.cta },
          additionalSections: data.additionalSections || [],
        });
      }
      setHasInitialized(true);
    }
  }, [data, loading, hasInitialized]);

  const save = async () => {
    setSaving(true);
    try {
      await setDoc(doc(db, 'settings', 'aicteIdeaLab'), {
        ...form,
        updatedAt: serverTimestamp(),
      }, { merge: true });
      alert('AICTE IDEA Lab content updated successfully! All changes are live on the website.');
    } catch (e) {
      alert(`Couldn't save: ${(e as Error).message}`);
    } finally {
      setSaving(false);
    }
  };

  const resetToDefaults = () => {
    if (confirm('Reset all IDEA Lab text to the default starting values? You can still edit them before saving.')) {
      setForm(DEFAULT_STATE);
    }
  };

  // Helper setters
  const updateTelemetry = (idx: number, field: 'value' | 'label', val: string) => {
    const list = [...(form.telemetry || [])];
    if (list[idx]) {
      list[idx] = { ...list[idx], [field]: val };
      setForm((p) => ({ ...p, telemetry: list }));
    }
  };

  const addTelemetryItem = () => {
    setForm((p) => ({
      ...p,
      telemetry: [...(p.telemetry || []), { value: '', label: '' }],
    }));
  };

  const removeTelemetryItem = (idx: number) => {
    setForm((p) => ({
      ...p,
      telemetry: (p.telemetry || []).filter((_, i) => i !== idx),
    }));
  };

  // Process Step Helpers
  const updateProcessStep = (idx: number, field: keyof IdeaLabProcessStep, val: string) => {
    const steps = [...(form.process?.steps || [])];
    if (steps[idx]) {
      steps[idx] = { ...steps[idx], [field]: val };
      setForm((p) => ({ ...p, process: { ...p.process, steps } }));
    }
  };

  const addProcessStep = () => {
    const count = (form.process?.steps || []).length + 1;
    const num = count < 10 ? `0${count}` : `${count}`;
    setForm((p) => ({
      ...p,
      process: {
        ...p.process,
        steps: [
          ...(p.process?.steps || []),
          { number: num, title: 'New Step', description: 'Step description...' },
        ],
      },
    }));
  };

  const removeProcessStep = (idx: number) => {
    setForm((p) => ({
      ...p,
      process: {
        ...p.process,
        steps: (p.process?.steps || []).filter((_, i) => i !== idx),
      },
    }));
  };

  // Pillars Helpers
  const updatePillar = (idx: number, field: keyof IdeaLabPillar, val: string) => {
    const pillars = [...(form.pillars || [])];
    if (pillars[idx]) {
      pillars[idx] = { ...pillars[idx], [field]: val };
      setForm((p) => ({ ...p, pillars }));
    }
  };

  const addPillar = () => {
    const count = (form.pillars || []).length + 1;
    const num = count < 10 ? `0${count}` : `${count}`;
    setForm((p) => ({
      ...p,
      pillars: [
        ...(p.pillars || []),
        { number: num, title: 'New Academic Pillar', description: 'Pillar description...' },
      ],
    }));
  };

  const removePillar = (idx: number) => {
    setForm((p) => ({
      ...p,
      pillars: (p.pillars || []).filter((_, i) => i !== idx),
    }));
  };

  // Additional Custom Sections Helpers
  const addCustomSection = () => {
    const newId = `section-${Date.now()}`;
    setForm((p) => ({
      ...p,
      additionalSections: [
        ...(p.additionalSections || []),
        {
          id: newId,
          title: 'New Section',
          badge: 'IDEA Lab Section',
          paragraphs: ['Write section content here...'],
          bulletPoints: [],
        },
      ],
    }));
  };

  const updateCustomSection = (idx: number, field: keyof CustomIdeaLabSection, val: unknown) => {
    const list = [...(form.additionalSections || [])];
    if (list[idx]) {
      list[idx] = { ...list[idx], [field]: val };
      setForm((p) => ({ ...p, additionalSections: list }));
    }
  };

  const removeCustomSection = (idx: number) => {
    if (!confirm('Delete this section?')) return;
    setForm((p) => ({
      ...p,
      additionalSections: (p.additionalSections || []).filter((_, i) => i !== idx),
    }));
  };

  if (loading && !hasInitialized) {
    return <p className="admin-loading">Loading AICTE IDEA Lab content…</p>;
  }

  return (
    <div className="admin-section">
      <div className="admin-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '1rem' }}>
          <div>
            <h2 className="admin-card__title" style={{ margin: 0 }}>AICTE IDEA Lab — Dynamic Page Content</h2>
            <p className="admin-field__hint" style={{ margin: '0.25rem 0 0' }}>
              Edit and manage every section, paragraph, telemetry stat, vision pillar, and official record on the live page.
            </p>
          </div>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button type="button" className="admin-btn admin-btn--sm admin-btn--ghost" onClick={resetToDefaults}>
              Reset to Defaults
            </button>
            <button type="button" className="admin-btn admin-btn--sm admin-btn--primary" onClick={save} disabled={saving}>
              {saving ? 'Saving…' : 'Save All Changes'}
            </button>
          </div>
        </div>

        {/* Inner Subtabs */}
        <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.75rem', marginBottom: '1.5rem' }}>
          <button
            type="button"
            className={`admin-btn admin-btn--sm ${activeTab === 'telemetry' ? 'admin-btn--primary' : 'admin-btn--ghost'}`}
            onClick={() => setActiveTab('telemetry')}
          >
            Telemetry Badges ({form.telemetry?.length || 0})
          </button>
          <button
            type="button"
            className={`admin-btn admin-btn--sm ${activeTab === 'overview' ? 'admin-btn--primary' : 'admin-btn--ghost'}`}
            onClick={() => setActiveTab('overview')}
          >
            From Idea to Prototype
          </button>
          <button
            type="button"
            className={`admin-btn admin-btn--sm ${activeTab === 'vision' ? 'admin-btn--primary' : 'admin-btn--ghost'}`}
            onClick={() => setActiveTab('vision')}
          >
            Vision & Pillars ({form.pillars?.length || 0})
          </button>
          <button
            type="button"
            className={`admin-btn admin-btn--sm ${activeTab === 'team-copy' ? 'admin-btn--primary' : 'admin-btn--ghost'}`}
            onClick={() => setActiveTab('team-copy')}
          >
            Team Info & Intro
          </button>
          <button
            type="button"
            className={`admin-btn admin-btn--sm ${activeTab === 'ambassadors-copy' ? 'admin-btn--primary' : 'admin-btn--ghost'}`}
            onClick={() => setActiveTab('ambassadors-copy')}
          >
            Ambassadors Info & Intro
          </button>
          <button
            type="button"
            className={`admin-btn admin-btn--sm ${activeTab === 'facilities-copy' ? 'admin-btn--primary' : 'admin-btn--ghost'}`}
            onClick={() => setActiveTab('facilities-copy')}
          >
            Facilities Copy
          </button>
          <button
            type="button"
            className={`admin-btn admin-btn--sm ${activeTab === 'official-info' ? 'admin-btn--primary' : 'admin-btn--ghost'}`}
            onClick={() => setActiveTab('official-info')}
          >
            Official Info & Registry
          </button>
          <button
            type="button"
            className={`admin-btn admin-btn--sm ${activeTab === 'custom-sections' ? 'admin-btn--primary' : 'admin-btn--ghost'}`}
            onClick={() => setActiveTab('custom-sections')}
          >
            + Add More Sections ({form.additionalSections?.length || 0})
          </button>
          <button
            type="button"
            className={`admin-btn admin-btn--sm ${activeTab === 'hero-cta' ? 'admin-btn--primary' : 'admin-btn--ghost'}`}
            onClick={() => setActiveTab('hero-cta')}
          >
            Hero & CTA Buttons
          </button>
        </div>

        {/* TAB 1: Telemetry Stats */}
        {activeTab === 'telemetry' && (
          <div className="admin-form-grid" style={{ gridTemplateColumns: '1fr' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 600, margin: '0 0 0.5rem' }}>Top Stat Cards (Telemetry Strip)</h3>
            <p className="admin-field__hint">
              Shown in the 4 prominent stat cards directly beneath the hero header.
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem', marginTop: '0.5rem' }}>
              {(form.telemetry || []).map((t, idx) => (
                <div key={idx} style={{ background: '#f8fafc', padding: '1rem', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                    <strong>Card #{idx + 1}</strong>
                    <button type="button" className="admin-btn admin-btn--sm admin-btn--danger" onClick={() => removeTelemetryItem(idx)}>
                      Remove
                    </button>
                  </div>
                  <div className="admin-field" style={{ marginBottom: '0.5rem' }}>
                    <label>Main Value / Text</label>
                    <input
                      value={t.value}
                      onChange={(e) => updateTelemetry(idx, 'value', e.target.value)}
                      placeholder="e.g. IDEA202000128"
                    />
                  </div>
                  <div className="admin-field">
                    <label>Subtitle / Label</label>
                    <input
                      value={t.label}
                      onChange={(e) => updateTelemetry(idx, 'label', e.target.value)}
                      placeholder="e.g. AQIS APPLICATION ID"
                    />
                  </div>
                </div>
              ))}
            </div>
            <div style={{ marginTop: '0.75rem' }}>
              <button type="button" className="admin-btn admin-btn--sm admin-btn--secondary" onClick={addTelemetryItem}>
                + Add Stat Card
              </button>
            </div>
          </div>
        )}

        {/* TAB 2: Overview & Process */}
        {activeTab === 'overview' && (
          <div>
            <div className="admin-field admin-field--full">
              <label>Overview Tab Title</label>
              <input
                value={form.overview?.title || ''}
                onChange={(e) => setForm((p) => ({ ...p, overview: { ...p.overview, title: e.target.value } }))}
                placeholder="From Idea to Prototype"
              />
            </div>

            <div className="admin-field admin-field--full" style={{ marginTop: '1rem' }}>
              <label>Overview Paragraphs</label>
              <p className="admin-field__hint">Separate each paragraph with a blank line.</p>
              <textarea
                rows={6}
                value={(form.overview?.paragraphs || []).join('\n\n')}
                onChange={(e) => {
                  const paras = e.target.value.split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean);
                  setForm((p) => ({ ...p, overview: { ...p.overview, paragraphs: paras } }));
                }}
                placeholder="Write the lead overview paragraphs..."
              />
            </div>

            <hr style={{ margin: '1.5rem 0', borderColor: '#e2e8f0' }} />

            <h3 style={{ fontSize: '1.1rem', fontWeight: 600, margin: '0 0 0.5rem' }}>Innovation Process Section</h3>
            <div className="admin-form-grid" style={{ marginBottom: '1rem' }}>
              <div className="admin-field">
                <label>Process Subheading / Title</label>
                <input
                  value={form.process?.title || ''}
                  onChange={(e) => setForm((p) => ({ ...p, process: { ...p.process, title: e.target.value } }))}
                  placeholder="Learn. Build. Test. Improve."
                />
              </div>
              <div className="admin-field admin-field--full">
                <label>Process Intro Text</label>
                <textarea
                  rows={2}
                  value={form.process?.intro || ''}
                  onChange={(e) => setForm((p) => ({ ...p, process: { ...p.process, intro: e.target.value } }))}
                  placeholder="The IDEA Lab encourages students to move beyond theoretical understanding..."
                />
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
              <h4 style={{ margin: 0, fontSize: '1rem', fontWeight: 600 }}>Process Steps ({form.process?.steps?.length || 0})</h4>
              <button type="button" className="admin-btn admin-btn--sm admin-btn--secondary" onClick={addProcessStep}>
                + Add Step
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
              {(form.process?.steps || []).map((step, idx) => (
                <div key={idx} style={{ background: '#f8fafc', padding: '1rem', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                    <input
                      style={{ maxWidth: 60, fontWeight: 700 }}
                      value={step.number}
                      onChange={(e) => updateProcessStep(idx, 'number', e.target.value)}
                      placeholder="01"
                    />
                    <button type="button" className="admin-btn admin-btn--sm admin-btn--danger" onClick={() => removeProcessStep(idx)}>
                      Delete
                    </button>
                  </div>
                  <div className="admin-field" style={{ marginBottom: '0.5rem' }}>
                    <label>Step Title</label>
                    <input
                      value={step.title}
                      onChange={(e) => updateProcessStep(idx, 'title', e.target.value)}
                      placeholder="e.g. Explore an Idea"
                    />
                  </div>
                  <div className="admin-field">
                    <label>Step Description</label>
                    <textarea
                      rows={3}
                      value={step.description}
                      onChange={(e) => updateProcessStep(idx, 'description', e.target.value)}
                      placeholder="Step description..."
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: Vision & Academic Pillars */}
        {activeTab === 'vision' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 600, margin: 0 }}>Vision & Academic Pillars</h3>
                <p className="admin-field__hint" style={{ margin: '0.25rem 0 0' }}>
                  Cards displayed in the "Vision & Academic Pillars" tab.
                </p>
              </div>
              <button type="button" className="admin-btn admin-btn--sm admin-btn--secondary" onClick={addPillar}>
                + Add Academic Pillar
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1rem' }}>
              {(form.pillars || []).map((pillar, idx) => (
                <div key={idx} style={{ background: '#f8fafc', padding: '1rem', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                    <input
                      style={{ maxWidth: 60, fontWeight: 700 }}
                      value={pillar.number}
                      onChange={(e) => updatePillar(idx, 'number', e.target.value)}
                      placeholder="01"
                    />
                    <button type="button" className="admin-btn admin-btn--sm admin-btn--danger" onClick={() => removePillar(idx)}>
                      Delete
                    </button>
                  </div>
                  <div className="admin-field" style={{ marginBottom: '0.5rem' }}>
                    <label>Pillar Title</label>
                    <input
                      value={pillar.title}
                      onChange={(e) => updatePillar(idx, 'title', e.target.value)}
                      placeholder="e.g. Student Innovation"
                    />
                  </div>
                  <div className="admin-field">
                    <label>Pillar Description</label>
                    <textarea
                      rows={3}
                      value={pillar.description}
                      onChange={(e) => updatePillar(idx, 'description', e.target.value)}
                      placeholder="Pillar description..."
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: Team Copy */}
        {activeTab === 'team-copy' && (
          <div className="admin-form-grid" style={{ gridTemplateColumns: '1fr' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 600, margin: '0 0 0.5rem' }}>People Behind IDEA Lab — Header & Copy</h3>
            <p className="admin-field__hint">
              Note: You can add and edit the individual faculty team members in the "Team Members Roster" subtab.
            </p>

            <div className="admin-field admin-field--full">
              <label>Section Title</label>
              <input
                value={form.team?.title || ''}
                onChange={(e) => setForm((p) => ({ ...p, team: { ...p.team, title: e.target.value } }))}
                placeholder="People Behind the IDEA Lab"
              />
            </div>

            <div className="admin-field admin-field--full">
              <label>Intro Paragraph</label>
              <textarea
                rows={3}
                value={form.team?.intro || ''}
                onChange={(e) => setForm((p) => ({ ...p, team: { ...p.team, intro: e.target.value } }))}
                placeholder="The IDEA Lab is supported by academic leadership, faculty coordinators and technical mentors..."
              />
            </div>

            <div className="admin-field admin-field--full">
              <label>Official Coordinator Contact Email</label>
              <input
                value={form.officialInfo?.email || ''}
                onChange={(e) => {
                  const val = e.target.value;
                  setForm((p) => ({
                    ...p,
                    officialInfo: { ...p.officialInfo, email: val },
                  }));
                }}
                placeholder="idealab@svecw.edu.in"
              />
            </div>
          </div>
        )}

        {/* TAB 5: Ambassadors Copy */}
        {activeTab === 'ambassadors-copy' && (
          <div className="admin-form-grid" style={{ gridTemplateColumns: '1fr' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 600, margin: '0 0 0.5rem' }}>Student Ambassadors — Header & Copy</h3>
            <p className="admin-field__hint">
              Note: You can add and edit individual student ambassadors in the "Student Ambassadors Roster" subtab.
            </p>

            <div className="admin-field admin-field--full">
              <label>Section Title</label>
              <input
                value={form.ambassadors?.title || ''}
                onChange={(e) => setForm((p) => ({ ...p, ambassadors: { ...p.ambassadors, title: e.target.value } }))}
                placeholder="Student Ambassadors"
              />
            </div>

            <div className="admin-field admin-field--full">
              <label>Intro Paragraph</label>
              <textarea
                rows={3}
                value={form.ambassadors?.intro || ''}
                onChange={(e) => setForm((p) => ({ ...p, ambassadors: { ...p.ambassadors, intro: e.target.value } }))}
                placeholder="Student Ambassadors help strengthen student participation in IDEA Lab activities..."
              />
            </div>

            <div className="admin-field admin-field--full">
              <label>Contact Notice Card Text</label>
              <textarea
                rows={2}
                value={form.ambassadors?.contactNotice || ''}
                onChange={(e) => setForm((p) => ({ ...p, ambassadors: { ...p.ambassadors, contactNotice: e.target.value } }))}
                placeholder="For student ambassador inquiries or to connect with lab representatives..."
              />
            </div>
          </div>
        )}

        {/* TAB 6: Facilities Copy */}
        {activeTab === 'facilities-copy' && (
          <div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 600, margin: '0 0 0.5rem' }}>Facilities for Making & Prototyping</h3>
            <p className="admin-field__hint" style={{ marginBottom: '1rem' }}>
              Note: Upload real photos in the "Facility Photos" subtab. The list below acts as default equipment cards when photos are not yet uploaded.
            </p>

            <div className="admin-field admin-field--full">
              <label>Section Title</label>
              <input
                value={form.facilities?.title || ''}
                onChange={(e) => setForm((p) => ({ ...p, facilities: { ...p.facilities, title: e.target.value } }))}
                placeholder="Facilities for Making & Prototyping"
              />
            </div>

            <div className="admin-field admin-field--full" style={{ marginTop: '1rem' }}>
              <label>Facilities Intro Paragraphs</label>
              <p className="admin-field__hint">Separate each paragraph with a blank line.</p>
              <textarea
                rows={4}
                value={(form.facilities?.paragraphs || []).join('\n\n')}
                onChange={(e) => {
                  const paras = e.target.value.split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean);
                  setForm((p) => ({ ...p, facilities: { ...p.facilities, paragraphs: paras } }));
                }}
                placeholder="Write facilities lead paragraphs..."
              />
            </div>
          </div>
        )}

        {/* TAB 7: Official Information */}
        {activeTab === 'official-info' && (
          <div className="admin-form-grid">
            <div className="admin-field admin-field--full">
              <label>Section Title</label>
              <input
                value={form.officialInfo?.title || ''}
                onChange={(e) => setForm((p) => ({ ...p, officialInfo: { ...p.officialInfo, title: e.target.value } }))}
                placeholder="Official IDEA Lab Information"
              />
            </div>

            <div className="admin-field">
              <label>AQIS Application ID</label>
              <input
                value={form.officialInfo?.aqisId || ''}
                onChange={(e) => setForm((p) => ({ ...p, officialInfo: { ...p.officialInfo, aqisId: e.target.value } }))}
                placeholder="IDEA202000128"
              />
            </div>

            <div className="admin-field">
              <label>Head of Institution</label>
              <input
                value={form.officialInfo?.headOfInstitution || ''}
                onChange={(e) => setForm((p) => ({ ...p, officialInfo: { ...p.officialInfo, headOfInstitution: e.target.value } }))}
                placeholder="Dr. G. Srinivasa Rao"
              />
            </div>

            <div className="admin-field admin-field--full">
              <label>Institution Name & Address</label>
              <input
                value={form.officialInfo?.institution || ''}
                onChange={(e) => setForm((p) => ({ ...p, officialInfo: { ...p.officialInfo, institution: e.target.value } }))}
                placeholder="Shri Vishnu Engineering College for Women, Bhimavaram, West Godavari District, Andhra Pradesh"
              />
            </div>

            <div className="admin-field admin-field--full">
              <label>Faculty Coordinators (one per line)</label>
              <textarea
                rows={3}
                value={(form.officialInfo?.facultyCoordinators || []).join('\n')}
                onChange={(e) => {
                  const list = e.target.value.split('\n').map((s) => s.trim()).filter(Boolean);
                  setForm((p) => ({ ...p, officialInfo: { ...p.officialInfo, facultyCoordinators: list } }));
                }}
                placeholder="Dr. P. Srinivasa Raju&#10;Dr. S. Hanumantha Rao"
              />
            </div>

            <div className="admin-field admin-field--full">
              <label>Official Contact Email</label>
              <input
                value={form.officialInfo?.email || ''}
                onChange={(e) => setForm((p) => ({ ...p, officialInfo: { ...p.officialInfo, email: e.target.value } }))}
                placeholder="idealab@svecw.edu.in"
              />
            </div>
          </div>
        )}

        {/* TAB 8: Additional Custom Sections */}
        {activeTab === 'custom-sections' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 600, margin: 0 }}>Additional Custom Sections</h3>
                <p className="admin-field__hint" style={{ margin: '0.25rem 0 0' }}>
                  Create additional sections anytime in the future. They will appear in the Quick Navigation menu and content pane automatically.
                </p>
              </div>
              <button type="button" className="admin-btn admin-btn--sm admin-btn--secondary" onClick={addCustomSection}>
                + Add New Section
              </button>
            </div>

            {(!form.additionalSections || form.additionalSections.length === 0) ? (
              <div style={{ padding: '2rem', textAlign: 'center', background: '#f8fafc', borderRadius: 8, border: '1px dashed #cbd5e1' }}>
                <p style={{ color: '#64748b', margin: '0 0 0.75rem' }}>No additional custom sections added yet.</p>
                <button type="button" className="admin-btn admin-btn--sm admin-btn--primary" onClick={addCustomSection}>
                  + Add First Custom Section
                </button>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                {form.additionalSections.map((sec, idx) => (
                  <div key={sec.id || idx} style={{ background: '#f8fafc', padding: '1.25rem', borderRadius: 8, border: '1px solid #e2e8f0' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.5rem' }}>
                      <strong style={{ fontSize: '1.05rem', color: '#0B1E42' }}>Section #{idx + 1}: {sec.title || 'Untitled'}</strong>
                      <button type="button" className="admin-btn admin-btn--sm admin-btn--danger" onClick={() => removeCustomSection(idx)}>
                        Delete Section
                      </button>
                    </div>

                    <div className="admin-form-grid" style={{ marginBottom: '0.75rem' }}>
                      <div className="admin-field">
                        <label>Section Title * (Shown in Quick Navigation & Heading)</label>
                        <input
                          value={sec.title}
                          onChange={(e) => updateCustomSection(idx, 'title', e.target.value)}
                          placeholder="e.g. Events & Hackathons"
                        />
                      </div>
                      <div className="admin-field">
                        <label>Badge / Eyebrow Text (Optional)</label>
                        <input
                          value={sec.badge || ''}
                          onChange={(e) => updateCustomSection(idx, 'badge', e.target.value)}
                          placeholder="e.g. Upcoming Activities"
                        />
                      </div>
                    </div>

                    <div className="admin-field admin-field--full" style={{ marginBottom: '0.75rem' }}>
                      <label>Paragraphs</label>
                      <p className="admin-field__hint">Separate each paragraph with a blank line.</p>
                      <textarea
                        rows={4}
                        value={(sec.paragraphs || []).join('\n\n')}
                        onChange={(e) => {
                          const paras = e.target.value.split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean);
                          updateCustomSection(idx, 'paragraphs', paras);
                        }}
                        placeholder="Write detailed information for this section..."
                      />
                    </div>

                    <div className="admin-field admin-field--full">
                      <label>Key Highlights / Bullet Points (Optional)</label>
                      <p className="admin-field__hint">One bullet point per line.</p>
                      <textarea
                        rows={3}
                        value={(sec.bulletPoints || []).join('\n')}
                        onChange={(e) => {
                          const points = e.target.value.split('\n').map((p) => p.trim()).filter(Boolean);
                          updateCustomSection(idx, 'bulletPoints', points);
                        }}
                        placeholder="• Annual Prototyping Challenge&#10;• Industry Mentorship Programs&#10;• Inter-college Hackathons"
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 9: Hero & CTA Buttons */}
        {activeTab === 'hero-cta' && (
          <div className="admin-form-grid">
            <h3 style={{ fontSize: '1.1rem', fontWeight: 600, margin: '0 0 0.5rem', gridColumn: '1 / -1' }}>Hero Tagline & CTA Buttons</h3>

            <div className="admin-field admin-field--full">
              <label>Hero Tagline / Subtitle</label>
              <textarea
                rows={2}
                value={form.hero?.tagline || ''}
                onChange={(e) => setForm((p) => ({ ...p, hero: { ...p.hero, tagline: e.target.value } }))}
                placeholder="Turn ideas into working prototypes through hands-on experimentation..."
              />
            </div>

            <div className="admin-field">
              <label>Primary Hero Button Text</label>
              <input
                value={form.hero?.ctaPrimary || ''}
                onChange={(e) => setForm((p) => ({ ...p, hero: { ...p.hero, ctaPrimary: e.target.value } }))}
                placeholder="Explore the IDEA Lab →"
              />
            </div>

            <div className="admin-field">
              <label>Secondary Hero Button Text</label>
              <input
                value={form.hero?.ctaSecondary || ''}
                onChange={(e) => setForm((p) => ({ ...p, hero: { ...p.hero, ctaSecondary: e.target.value } }))}
                placeholder="View Facilities →"
              />
            </div>

            <hr style={{ gridColumn: '1 / -1', margin: '1rem 0', borderColor: '#e2e8f0' }} />

            <h3 style={{ fontSize: '1.1rem', fontWeight: 600, margin: '0 0 0.5rem', gridColumn: '1 / -1' }}>Bottom CTA Banner</h3>

            <div className="admin-field admin-field--full">
              <label>CTA Section Title</label>
              <input
                value={form.cta?.title || ''}
                onChange={(e) => setForm((p) => ({ ...p, cta: { ...p.cta, title: e.target.value } }))}
                placeholder="Explore Innovation at VWU"
              />
            </div>

            <div className="admin-field admin-field--full">
              <label>CTA Section Description</label>
              <textarea
                rows={2}
                value={form.cta?.description || ''}
                onChange={(e) => setForm((p) => ({ ...p, cta: { ...p.cta, description: e.target.value } }))}
                placeholder="Discover the labs, centres and initiatives that extend learning beyond the classroom..."
              />
            </div>
          </div>
        )}

        <div className="admin-form-actions" style={{ marginTop: '1.5rem', borderTop: '1px solid #e2e8f0', paddingTop: '1rem' }}>
          <button type="button" className="admin-btn admin-btn--primary" onClick={save} disabled={saving}>
            {saving ? 'Saving…' : 'Save All IDEA Lab Changes'}
          </button>
        </div>
      </div>
    </div>
  );
}
