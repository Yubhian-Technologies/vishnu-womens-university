import { useEffect, useState } from 'react';
import { doc, serverTimestamp } from 'firebase/firestore';
import { setDoc } from '../../../lib/auditLog';
import { db } from '../../../lib/firebase';
import { useDocument } from '../../../hooks/useDocument';
import {
  vsac,
  type TrainingResearchItem,
} from '../../Differentiators/vsac.data';

export interface CustomVsacSection {
  id: string;
  title: string;
  badge?: string;
  paragraphs?: string[];
  bulletPoints?: string[];
}

export interface VsacDoc {
  hero?: {
    category?: string;
    title?: string;
    subtitle?: string;
  };
  aboutTitle?: string;
  paragraphs?: string[];
  visionTitle?: string;
  vision?: string;
  missionTitle?: string;
  mission?: string[];
  objectivesTitle?: string;
  objectives?: string[];
  trainingResearch?: TrainingResearchItem[];
  industryCollaboration?: {
    title: string;
    paragraphs: string[];
  };
  additionalSections?: CustomVsacSection[];
}

const DEFAULT_STATE: VsacDoc = {
  hero: {
    category: vsac.heroCategory,
    title: vsac.heroTitle,
    subtitle: vsac.heroSubtitle,
  },
  aboutTitle: vsac.aboutTitle,
  paragraphs: [...vsac.paragraphs],
  visionTitle: vsac.visionTitle,
  vision: vsac.vision,
  missionTitle: vsac.missionTitle,
  mission: [...vsac.mission],
  objectivesTitle: vsac.objectivesTitle,
  objectives: [...vsac.objectives],
  trainingResearch: vsac.trainingResearch.map((t) => ({ ...t })),
  industryCollaboration: {
    title: vsac.industryCollaboration.title,
    paragraphs: [...vsac.industryCollaboration.paragraphs],
  },
  additionalSections: [],
};

type ActiveSubSection =
  | 'overview'
  | 'vision-mission'
  | 'objectives'
  | 'research-activities'
  | 'collaborations'
  | 'custom-sections';

export default function VsacContentAdmin() {
  const { data, loading } = useDocument<VsacDoc>('settings', 'vsac');
  const [form, setForm] = useState<VsacDoc>(DEFAULT_STATE);
  const [hasInitialized, setHasInitialized] = useState(false);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<ActiveSubSection>('overview');

  useEffect(() => {
    if (!loading && !hasInitialized) {
      if (data) {
        setForm({
          hero: { ...DEFAULT_STATE.hero, ...data.hero },
          aboutTitle: data.aboutTitle || DEFAULT_STATE.aboutTitle,
          paragraphs: data.paragraphs && data.paragraphs.length > 0 ? data.paragraphs : DEFAULT_STATE.paragraphs,
          visionTitle: data.visionTitle || DEFAULT_STATE.visionTitle,
          vision: data.vision || DEFAULT_STATE.vision,
          missionTitle: data.missionTitle || DEFAULT_STATE.missionTitle,
          mission: data.mission && data.mission.length > 0 ? data.mission : DEFAULT_STATE.mission,
          objectivesTitle: data.objectivesTitle || DEFAULT_STATE.objectivesTitle,
          objectives: data.objectives && data.objectives.length > 0 ? data.objectives : DEFAULT_STATE.objectives,
          trainingResearch: data.trainingResearch && data.trainingResearch.length > 0 ? data.trainingResearch : DEFAULT_STATE.trainingResearch,
          industryCollaboration: data.industryCollaboration || DEFAULT_STATE.industryCollaboration,
          additionalSections: data.additionalSections || [],
        });
      }
      setHasInitialized(true);
    }
  }, [data, loading, hasInitialized]);

  const save = async () => {
    setSaving(true);
    try {
      await setDoc(doc(db, 'settings', 'vsac'), {
        ...form,
        updatedAt: serverTimestamp(),
      }, { merge: true });
      alert('Vishnu Space Application Center content updated successfully!');
    } catch (e) {
      alert(`Couldn't save: ${(e as Error).message}`);
    } finally {
      setSaving(false);
    }
  };

  const resetToDefaults = () => {
    if (confirm('Reset all VSAC text to default starting values? You can still edit before saving.')) {
      setForm(DEFAULT_STATE);
    }
  };

  return (
    <div style={{ background: '#fff', borderRadius: '12px', border: '1px solid #E2E8F0', padding: '1.5rem', marginTop: '1.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem', borderBottom: '1px solid #E2E8F0', paddingBottom: '1rem' }}>
        <div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0B1E42', margin: 0 }}>
            Vishnu Space Application Center (VSAC) — All Page Content & Sections
          </h2>
          <p style={{ fontSize: '0.85rem', color: '#64748B', margin: '0.25rem 0 0 0' }}>
            Edit satellite tracking information, CubeSat modules, vision, mission, objectives, and industry collaborations.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button type="button" onClick={resetToDefaults} className="admin-btn-secondary" style={{ fontSize: '0.8rem', padding: '0.45rem 0.85rem' }}>
            Reset to Defaults
          </button>
          <button type="button" onClick={save} disabled={saving} className="admin-btn-primary" style={{ fontSize: '0.8rem', padding: '0.45rem 1.1rem', background: '#008080', borderColor: '#008080' }}>
            {saving ? 'Saving...' : 'Save VSAC Content'}
          </button>
        </div>
      </div>

      {/* Subtabs Navigation */}
      <div style={{ display: 'flex', gap: '0.4rem', overflowX: 'auto', paddingBottom: '0.75rem', marginBottom: '1.5rem', borderBottom: '2px solid #F1F5F9' }}>
        {[
          { key: 'overview', label: '1. Overview & Hero' },
          { key: 'vision-mission', label: '2. Vision & Mission' },
          { key: 'objectives', label: '3. Objectives' },
          { key: 'research-activities', label: '4. Research & Training' },
          { key: 'collaborations', label: '5. Collaborations' },
          { key: 'custom-sections', label: '6. Custom Extra Sections' },
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

      {/* TAB 1: OVERVIEW & HERO */}
      {activeTab === 'overview' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div>
            <label className="admin-label">Hero Subtitle</label>
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
            <label className="admin-label">About Paragraphs</label>
            {(form.paragraphs || []).map((p, idx) => (
              <div key={idx} style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
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
                  style={{ alignSelf: 'flex-start' }}
                >
                  ✕
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => setForm((prev) => ({ ...prev, paragraphs: [...(prev.paragraphs || []), ''] }))}
              className="admin-btn-secondary"
              style={{ fontSize: '0.8rem' }}
            >
              + Add Paragraph
            </button>
          </div>
        </div>
      )}

      {/* TAB 2: VISION & MISSION */}
      {activeTab === 'vision-mission' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div>
            <label className="admin-label">Vision Statement</label>
            <textarea
              className="admin-textarea"
              rows={3}
              value={form.vision || ''}
              onChange={(e) => setForm((p) => ({ ...p, vision: e.target.value }))}
            />
          </div>
          <div>
            <label className="admin-label">Mission Points</label>
            {(form.mission || []).map((m, idx) => (
              <div key={idx} style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.4rem' }}>
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
                >
                  ✕
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => setForm((p) => ({ ...p, mission: [...(p.mission || []), ''] }))}
              className="admin-btn-secondary"
              style={{ fontSize: '0.8rem' }}
            >
              + Add Mission Point
            </button>
          </div>
        </div>
      )}

      {/* TAB 3: OBJECTIVES */}
      {activeTab === 'objectives' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <label className="admin-label">Core Objectives</label>
          {(form.objectives || []).map((obj, idx) => (
            <div key={idx} style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.4rem' }}>
              <input
                type="text"
                className="admin-input"
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
              >
                ✕
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => setForm((p) => ({ ...p, objectives: [...(p.objectives || []), ''] }))}
            className="admin-btn-secondary"
            style={{ fontSize: '0.8rem' }}
          >
            + Add Objective
          </button>
        </div>
      )}

      {/* TAB 4: RESEARCH & TRAINING */}
      {activeTab === 'research-activities' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {(form.trainingResearch || []).map((item, idx) => (
            <div key={idx} style={{ background: '#F8FAFC', padding: '1rem', borderRadius: '8px', border: '1px solid #E2E8F0', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              <label className="admin-label" style={{ fontWeight: 800 }}>Program #{idx + 1} Title</label>
              <input
                type="text"
                className="admin-input"
                value={item.title}
                onChange={(e) => {
                  const list = [...(form.trainingResearch || [])];
                  list[idx] = { ...list[idx], title: e.target.value };
                  setForm((p) => ({ ...p, trainingResearch: list }));
                }}
              />
              <label className="admin-label">Paragraphs (one per line)</label>
              <textarea
                className="admin-textarea"
                rows={3}
                value={(item.paragraphs || []).join('\n')}
                onChange={(e) => {
                  const list = [...(form.trainingResearch || [])];
                  list[idx] = { ...list[idx], paragraphs: e.target.value.split('\n') };
                  setForm((p) => ({ ...p, trainingResearch: list }));
                }}
              />
            </div>
          ))}
        </div>
      )}

      {/* TAB 5: COLLABORATIONS */}
      {activeTab === 'collaborations' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div style={{ background: '#F8FAFC', padding: '1rem', borderRadius: '8px', border: '1px solid #E2E8F0', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
            <label className="admin-label" style={{ fontWeight: 800 }}>Collaboration Section Title</label>
            <input
              type="text"
              className="admin-input"
              value={form.industryCollaboration?.title || ''}
              onChange={(e) => {
                setForm((p) => ({
                  ...p,
                  industryCollaboration: {
                    title: e.target.value,
                    paragraphs: p.industryCollaboration?.paragraphs || [],
                  },
                }));
              }}
            />
            <label className="admin-label">Collaboration Paragraphs (one per line)</label>
            <textarea
              className="admin-textarea"
              rows={4}
              value={(form.industryCollaboration?.paragraphs || []).join('\n')}
              onChange={(e) => {
                setForm((p) => ({
                  ...p,
                  industryCollaboration: {
                    title: p.industryCollaboration?.title || '',
                    paragraphs: e.target.value.split('\n'),
                  },
                }));
              }}
            />
          </div>
        </div>
      )}

      {/* TAB 6: CUSTOM SECTIONS */}
      {activeTab === 'custom-sections' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h4 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 800, color: '#0B1E42' }}>
              Custom Additional Sections
            </h4>
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
                      badge: 'VSAC Initiative',
                      paragraphs: ['Write section content here...'],
                      bulletPoints: [],
                    },
                  ],
                }));
              }}
              className="admin-btn-secondary"
              style={{ fontSize: '0.8rem' }}
            >
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
                  <button
                    type="button"
                    onClick={() => {
                      setForm((p) => ({
                        ...p,
                        additionalSections: (p.additionalSections || []).filter((_, i) => i !== idx),
                      }));
                    }}
                    className="admin-btn-danger"
                  >
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
              </div>
            ))
          )}
        </div>
      )}

      {/* Bottom Save Bar */}
      <div style={{ marginTop: '2rem', paddingTop: '1rem', borderTop: '1px solid #E2E8F0', display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
        <button type="button" onClick={save} disabled={saving} className="admin-btn-primary" style={{ padding: '0.6rem 1.5rem', background: '#008080', borderColor: '#008080' }}>
          {saving ? 'Saving...' : 'Save VSAC Content'}
        </button>
      </div>
    </div>
  );
}
