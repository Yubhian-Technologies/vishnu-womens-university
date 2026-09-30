import { useEffect, useState } from 'react';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../../lib/firebase';
import { useDocument } from '../../../hooks/useDocument';
import { highPerformanceComputingLab } from '../../Differentiators/highPerformanceComputingLab.data';

export interface CustomHpcSection {
  id: string;
  title: string;
  badge?: string;
  paragraphs?: string[];
  bulletPoints?: string[];
}

export interface HpcLabDoc {
  paragraphs?: string[];
  vision?: string;
  mission?: string[];
  objectives?: string[];
  fundedProjects?: string[];
  facultyResearch?: string[];
  outcomes?: string[];
  activities?: string[];
  additionalSections?: CustomHpcSection[];
}

const DEFAULT_STATE: HpcLabDoc = {
  paragraphs: [...highPerformanceComputingLab.paragraphs],
  vision: highPerformanceComputingLab.vision,
  mission: [...highPerformanceComputingLab.mission],
  objectives: [...highPerformanceComputingLab.objectives],
  fundedProjects: [...highPerformanceComputingLab.fundedProjects],
  facultyResearch: [...highPerformanceComputingLab.facultyResearch],
  outcomes: [...highPerformanceComputingLab.outcomes],
  activities: [...highPerformanceComputingLab.activities],
  additionalSections: [],
};

type ActiveSubSection =
  | 'overview'
  | 'vision-mission'
  | 'objectives'
  | 'funded-projects'
  | 'faculty-research'
  | 'outcomes'
  | 'activities'
  | 'custom-sections';

export default function HpcLabContentAdmin() {
  const { data, loading } = useDocument<HpcLabDoc>('settings', 'hpcLab');
  const [form, setForm] = useState<HpcLabDoc>(DEFAULT_STATE);
  const [hasInitialized, setHasInitialized] = useState(false);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<ActiveSubSection>('overview');

  useEffect(() => {
    if (!loading && !hasInitialized) {
      if (data) {
        setForm({
          paragraphs: data.paragraphs && data.paragraphs.length > 0 ? data.paragraphs : DEFAULT_STATE.paragraphs,
          vision: data.vision || DEFAULT_STATE.vision,
          mission: data.mission && data.mission.length > 0 ? data.mission : DEFAULT_STATE.mission,
          objectives: data.objectives && data.objectives.length > 0 ? data.objectives : DEFAULT_STATE.objectives,
          fundedProjects: data.fundedProjects && data.fundedProjects.length > 0 ? data.fundedProjects : DEFAULT_STATE.fundedProjects,
          facultyResearch: data.facultyResearch && data.facultyResearch.length > 0 ? data.facultyResearch : DEFAULT_STATE.facultyResearch,
          outcomes: data.outcomes && data.outcomes.length > 0 ? data.outcomes : DEFAULT_STATE.outcomes,
          activities: data.activities && data.activities.length > 0 ? data.activities : DEFAULT_STATE.activities,
          additionalSections: data.additionalSections || [],
        });
      }
      setHasInitialized(true);
    }
  }, [data, loading, hasInitialized]);

  const save = async () => {
    setSaving(true);
    try {
      await setDoc(doc(db, 'settings', 'hpcLab'), {
        ...form,
        updatedAt: serverTimestamp(),
      }, { merge: true });
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

  return (
    <div style={{ background: '#fff', borderRadius: '12px', border: '1px solid #E2E8F0', padding: '1.5rem', marginTop: '1.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem', borderBottom: '1px solid #E2E8F0', paddingBottom: '1rem' }}>
        <div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0B1E42', margin: 0 }}>
            High Performance Computing (HPC) Lab — All Page Content & Sections
          </h2>
          <p style={{ fontSize: '0.85rem', color: '#64748B', margin: '0.25rem 0 0 0' }}>
            Edit GPU supercomputing overviews, DST funded projects, deep learning research, publications, and workshops.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button type="button" onClick={resetToDefaults} className="admin-btn-secondary" style={{ fontSize: '0.8rem', padding: '0.45rem 0.85rem' }}>
            Reset to Defaults
          </button>
          <button type="button" onClick={save} disabled={saving} className="admin-btn-primary" style={{ fontSize: '0.8rem', padding: '0.45rem 1.1rem', background: '#008080', borderColor: '#008080' }}>
            {saving ? 'Saving...' : 'Save HPC Lab Content'}
          </button>
        </div>
      </div>

      {/* Subtabs Navigation */}
      <div style={{ display: 'flex', gap: '0.4rem', overflowX: 'auto', paddingBottom: '0.75rem', marginBottom: '1.5rem', borderBottom: '2px solid #F1F5F9' }}>
        {[
          { key: 'overview', label: '1. Overview' },
          { key: 'vision-mission', label: '2. Vision & Mission' },
          { key: 'objectives', label: '3. Objectives' },
          { key: 'funded-projects', label: '4. Funded Projects' },
          { key: 'faculty-research', label: '5. Faculty Research' },
          { key: 'outcomes', label: '6. Publications / Outcomes' },
          { key: 'activities', label: '7. Workshops & Activities' },
          { key: 'custom-sections', label: '8. Custom Extra Sections' },
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

      {/* TAB 1: OVERVIEW */}
      {activeTab === 'overview' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div>
            <label className="admin-label">Overview Paragraphs</label>
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
          <label className="admin-label">Key Objectives</label>
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

      {/* TAB 4: FUNDED PROJECTS */}
      {activeTab === 'funded-projects' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <label className="admin-label">Funded Research Projects (DST Sponsored, etc.)</label>
          {(form.fundedProjects || []).map((proj, idx) => (
            <div key={idx} style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.4rem' }}>
              <textarea
                className="admin-textarea"
                rows={2}
                value={proj}
                onChange={(e) => {
                  const list = [...(form.fundedProjects || [])];
                  list[idx] = e.target.value;
                  setForm((p) => ({ ...p, fundedProjects: list }));
                }}
              />
              <button
                type="button"
                onClick={() => {
                  const list = (form.fundedProjects || []).filter((_, i) => i !== idx);
                  setForm((p) => ({ ...p, fundedProjects: list }));
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
            onClick={() => setForm((p) => ({ ...p, fundedProjects: [...(p.fundedProjects || []), ''] }))}
            className="admin-btn-secondary"
            style={{ fontSize: '0.8rem' }}
          >
            + Add Funded Project
          </button>
        </div>
      )}

      {/* TAB 5: FACULTY RESEARCH */}
      {activeTab === 'faculty-research' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <label className="admin-label">Faculty Research Initiatives (AI/ML Models & Implementations)</label>
          {(form.facultyResearch || []).map((res, idx) => (
            <div key={idx} style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.4rem' }}>
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
                style={{ alignSelf: 'flex-start' }}
              >
                ✕
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => setForm((p) => ({ ...p, facultyResearch: [...(p.facultyResearch || []), ''] }))}
            className="admin-btn-secondary"
            style={{ fontSize: '0.8rem' }}
          >
            + Add Faculty Research Topic
          </button>
        </div>
      )}

      {/* TAB 6: OUTCOMES / PUBLICATIONS */}
      {activeTab === 'outcomes' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <label className="admin-label">Publications & Research Outcomes (IEEE / Journal papers)</label>
          {(form.outcomes || []).map((paper, idx) => (
            <div key={idx} style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.4rem' }}>
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
                style={{ alignSelf: 'flex-start' }}
              >
                ✕
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => setForm((p) => ({ ...p, outcomes: [...(p.outcomes || []), ''] }))}
            className="admin-btn-secondary"
            style={{ fontSize: '0.8rem' }}
          >
            + Add Publication Paper
          </button>
        </div>
      )}

      {/* TAB 7: ACTIVITIES */}
      {activeTab === 'activities' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <label className="admin-label">Conducted Workshops, Expert Talks & Training Activities</label>
          {(form.activities || []).map((act, idx) => (
            <div key={idx} style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.4rem' }}>
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
                style={{ alignSelf: 'flex-start' }}
              >
                ✕
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => setForm((p) => ({ ...p, activities: [...(p.activities || []), ''] }))}
            className="admin-btn-secondary"
            style={{ fontSize: '0.8rem' }}
          >
            + Add Workshop / Event
          </button>
        </div>
      )}

      {/* TAB 8: CUSTOM SECTIONS */}
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
                      badge: 'Supercomputing / AI Research',
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
          {saving ? 'Saving...' : 'Save HPC Lab Content'}
        </button>
      </div>
    </div>
  );
}
