import { useState, useEffect } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../../../lib/firebase';
import { vehicleDesignLab } from '../../Differentiators/vehicleDesignLab.data';
import { Plus, Trash2, Save, RotateCcw, Check } from 'lucide-react';

export type VehicleDesignLabDoc = typeof vehicleDesignLab;

export default function VehicleDesignLabContentAdmin() {
  const [data, setData] = useState<VehicleDesignLabDoc>(vehicleDesignLab);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [activeTab, setActiveTab] = useState<
    'overview' | 'visionMission' | 'objectives' | 'facilities' | 'projects' | 'endowments' | 'outcomes'
  >('overview');

  useEffect(() => {
    async function loadData() {
      try {
        const snap = await getDoc(doc(db, 'settings', 'vehicleDesignLab'));
        if (snap.exists()) {
          const remote = snap.data() as Partial<VehicleDesignLabDoc>;
          setData({
            ...vehicleDesignLab,
            ...remote,
            paragraphs: remote.paragraphs || vehicleDesignLab.paragraphs,
            fundamentals: remote.fundamentals || vehicleDesignLab.fundamentals,
            objectives: remote.objectives || vehicleDesignLab.objectives,
            facilities: {
              ...vehicleDesignLab.facilities,
              ...(remote.facilities || {}),
              activitiesPrograms: remote.facilities?.activitiesPrograms || vehicleDesignLab.facilities.activitiesPrograms,
              campusUtilityProjects: remote.facilities?.campusUtilityProjects || vehicleDesignLab.facilities.campusUtilityProjects,
            },
            industryCollaborations: {
              ...vehicleDesignLab.industryCollaborations,
              ...(remote.industryCollaborations || {}),
              endowments: remote.industryCollaborations?.endowments || vehicleDesignLab.industryCollaborations.endowments,
            },
            outcomes: remote.outcomes || vehicleDesignLab.outcomes,
          });
        }
      } catch (err) {
        console.error('Failed to load Vehicle Design Lab data:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      await setDoc(doc(db, 'settings', 'vehicleDesignLab'), data);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      console.error('Failed to save Vehicle Design Lab data:', err);
      alert('Failed to save changes. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    if (confirm('Reset all content to original defaults?')) {
      setData(vehicleDesignLab);
    }
  };

  if (loading) {
    return <div className="admin-card" style={{ textAlign: 'center', padding: '2rem', color: '#64748b' }}>Loading Vehicle Design Lab Content Editor...</div>;
  }

  return (
    <div className="admin-section">
      {/* Header */}
      <div className="admin-card" style={{ marginBottom: '1.25rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ display: 'inline-block', padding: '0.2rem 0.6rem', borderRadius: '4px', background: '#fee2e2', color: '#b91c1c', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '0.35rem' }}>
              Differentiator Editor
            </div>
            <h2 style={{ margin: 0, fontSize: '1.4rem', fontWeight: 700, color: '#0f172a' }}>Vehicle Design Lab (VDL) Content</h2>
            <p style={{ margin: '0.25rem 0 0', fontSize: '0.875rem', color: '#64748b' }}>
              Edit overview paragraphs, vehicle fundamentals, vision, mission, objectives, facilities, design projects, and endowments.
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
              style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem' }}
            >
              {saving ? (
                <span>Saving...</span>
              ) : saved ? (
                <>
                  <Check size={16} /> Saved!
                </>
              ) : (
                <>
                  <Save size={16} /> Save All Changes
                </>
              )}
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: '0.5rem', borderBottom: '1px solid #e2e8f0', marginTop: '1.25rem', paddingBottom: '0.25rem', overflowX: 'auto' }}>
          {[
            { id: 'overview', label: 'Overview & Fundamentals' },
            { id: 'visionMission', label: 'Vision & Mission' },
            { id: 'objectives', label: 'Objectives' },
            { id: 'facilities', label: 'Facilities & Phases' },
            { id: 'projects', label: 'Design Projects' },
            { id: 'endowments', label: 'Endowments' },
            { id: 'outcomes', label: 'Outcomes' },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id as any)}
              className="admin-btn"
              style={{
                background: activeTab === tab.id ? '#0f766e' : '#f1f5f9',
                color: activeTab === tab.id ? '#ffffff' : '#475569',
                border: 'none',
                fontWeight: 600,
                fontSize: '0.85rem',
                padding: '0.5rem 1rem',
                borderRadius: '6px',
                cursor: 'pointer'
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab 1: Overview & Fundamentals */}
      {activeTab === 'overview' && (
        <div className="admin-card" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
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
                    rows={3}
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

          <div style={{ paddingTop: '1rem', borderTop: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <label className="admin-label" style={{ margin: 0 }}>Fundamentals Learned</label>
              <button
                type="button"
                onClick={() => setData({ ...data, fundamentals: [...data.fundamentals, ''] })}
                className="admin-btn admin-btn--secondary"
                style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.8rem', padding: '0.35rem 0.75rem' }}
              >
                <Plus size={14} /> Add Fundamental
              </button>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '0.5rem' }}>
              {data.fundamentals.map((f, idx) => (
                <div key={idx} style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                  <input
                    type="text"
                    value={f}
                    onChange={(e) => {
                      const updated = [...data.fundamentals];
                      updated[idx] = e.target.value;
                      setData({ ...data, fundamentals: updated });
                    }}
                    className="admin-input"
                    style={{ flex: 1 }}
                  />
                  <button
                    type="button"
                    onClick={() => setData({ ...data, fundamentals: data.fundamentals.filter((_, i) => i !== idx) })}
                    className="admin-btn-danger"
                    style={{ padding: '0.5rem 0.65rem' }}
                    title="Remove fundamental"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Vision & Mission */}
      {activeTab === 'visionMission' && (
        <div className="admin-card" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div className="admin-field">
            <label className="admin-label">Vision Statement</label>
            <textarea
              rows={4}
              value={data.vision}
              onChange={(e) => setData({ ...data, vision: e.target.value })}
              className="admin-textarea"
            />
          </div>
          <div className="admin-field">
            <label className="admin-label">Mission Statement</label>
            <textarea
              rows={4}
              value={data.mission}
              onChange={(e) => setData({ ...data, mission: e.target.value })}
              className="admin-textarea"
            />
          </div>
        </div>
      )}

      {/* Tab 3: Objectives */}
      {activeTab === 'objectives' && (
        <div className="admin-card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <label className="admin-label" style={{ margin: 0 }}>Objectives</label>
            <button
              type="button"
              onClick={() =>
                setData({
                  ...data,
                  objectives: [...data.objectives, { lead: 'New Objective:', text: ' Description here.' }],
                })
              }
              className="admin-btn admin-btn--secondary"
              style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.8rem', padding: '0.35rem 0.75rem' }}
            >
              <Plus size={14} /> Add Objective
            </button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {data.objectives.map((obj, idx) => (
              <div key={idx} style={{ padding: '1rem', border: '1px solid #e2e8f0', borderRadius: '8px', background: '#f8fafc', display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <input
                    type="text"
                    placeholder="Lead (e.g. Hands-on Learning:)"
                    value={obj.lead}
                    onChange={(e) => {
                      const updated = [...data.objectives];
                      updated[idx] = { ...updated[idx], lead: e.target.value };
                      setData({ ...data, objectives: updated });
                    }}
                    className="admin-input"
                    style={{ fontWeight: 700 }}
                  />
                  <textarea
                    rows={2}
                    placeholder="Details"
                    value={obj.text}
                    onChange={(e) => {
                      const updated = [...data.objectives];
                      updated[idx] = { ...updated[idx], text: e.target.value };
                      setData({ ...data, objectives: updated });
                    }}
                    className="admin-textarea"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => setData({ ...data, objectives: data.objectives.filter((_, i) => i !== idx) })}
                  className="admin-btn-danger"
                  style={{ padding: '0.55rem 0.65rem' }}
                  title="Remove objective"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 4: Facilities */}
      {activeTab === 'facilities' && (
        <div className="admin-card" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div className="admin-field">
            <label className="admin-label">Facilities Overview</label>
            <textarea
              rows={3}
              value={data.facilities?.overview || ''}
              onChange={(e) =>
                setData({
                  ...data,
                  facilities: { ...data.facilities, overview: e.target.value },
                })
              }
              className="admin-textarea"
            />
          </div>

          {/* Facility Phases */}
          <div style={{ paddingTop: '1rem', borderTop: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h4 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 600, color: '#0f172a' }}>Facility Phases & Activities</h4>
              <button
                type="button"
                onClick={() =>
                  setData({
                    ...data,
                    facilities: {
                      ...data.facilities,
                      activitiesPrograms: [
                        ...(data.facilities?.activitiesPrograms || []),
                        { title: 'New Phase', paragraph: 'Description', mediaType: 'photo' },
                      ],
                    },
                  })
                }
                className="admin-btn admin-btn--secondary"
                style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.85rem' }}
              >
                <Plus size={14} /> Add Phase
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {(data.facilities?.activitiesPrograms || []).map((phase, idx) => (
                <div key={idx} style={{ padding: '1rem', border: '1px solid #e2e8f0', borderRadius: '8px', background: '#f8fafc', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <input
                      type="text"
                      value={phase.title}
                      onChange={(e) => {
                        const updated = [...(data.facilities?.activitiesPrograms || [])];
                        updated[idx] = { ...updated[idx], title: e.target.value };
                        setData({ ...data, facilities: { ...data.facilities, activitiesPrograms: updated } });
                      }}
                      className="admin-input"
                      style={{ fontWeight: 700, width: '250px' }}
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const updated = (data.facilities?.activitiesPrograms || []).filter((_, i) => i !== idx);
                        setData({ ...data, facilities: { ...data.facilities, activitiesPrograms: updated } });
                      }}
                      className="admin-btn-danger"
                      style={{ padding: '0.35rem 0.5rem' }}
                      title="Remove phase"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                  <textarea
                    rows={2}
                    value={phase.paragraph}
                    onChange={(e) => {
                      const updated = [...(data.facilities?.activitiesPrograms || [])];
                      updated[idx] = { ...updated[idx], paragraph: e.target.value };
                      setData({ ...data, facilities: { ...data.facilities, activitiesPrograms: updated } });
                    }}
                    className="admin-textarea"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab 5: Projects */}
      {activeTab === 'projects' && (
        <div className="admin-card" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div className="admin-field">
            <label className="admin-label">Campus Utility & Innovation Projects Intro</label>
            <textarea
              rows={2}
              value={data.facilities?.campusUtilityIntro || ''}
              onChange={(e) =>
                setData({
                  ...data,
                  facilities: {
                    ...data.facilities,
                    campusUtilityIntro: e.target.value,
                  },
                })
              }
              className="admin-textarea"
            />
          </div>

          <div style={{ paddingTop: '1rem', borderTop: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h4 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 600, color: '#0f172a' }}>Fabricated Vehicles & Campus Utility Projects</h4>
              <button
                type="button"
                onClick={() =>
                  setData({
                    ...data,
                    facilities: {
                      ...data.facilities,
                      campusUtilityProjects: [
                        ...(data.facilities?.campusUtilityProjects || []),
                        { lead: 'New Vehicle Project –', text: ' Description and specs' },
                      ],
                    },
                  })
                }
                className="admin-btn admin-btn--secondary"
                style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.85rem' }}
              >
                <Plus size={14} /> Add Project
              </button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {(data.facilities?.campusUtilityProjects || []).map((proj, idx) => (
                <div key={idx} style={{ padding: '1rem', border: '1px solid #e2e8f0', borderRadius: '8px', background: '#f8fafc', display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <input
                      type="text"
                      placeholder="Project Title (Lead text)"
                      value={proj.lead}
                      onChange={(e) => {
                        const updated = [...(data.facilities?.campusUtilityProjects || [])];
                        updated[idx] = { ...updated[idx], lead: e.target.value };
                        setData({ ...data, facilities: { ...data.facilities, campusUtilityProjects: updated } });
                      }}
                      className="admin-input"
                      style={{ fontWeight: 700 }}
                    />
                    <textarea
                      rows={2}
                      placeholder="Details"
                      value={proj.text}
                      onChange={(e) => {
                        const updated = [...(data.facilities?.campusUtilityProjects || [])];
                        updated[idx] = { ...updated[idx], text: e.target.value };
                        setData({ ...data, facilities: { ...data.facilities, campusUtilityProjects: updated } });
                      }}
                      className="admin-textarea"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      const updated = (data.facilities?.campusUtilityProjects || []).filter((_, i) => i !== idx);
                      setData({ ...data, facilities: { ...data.facilities, campusUtilityProjects: updated } });
                    }}
                    className="admin-btn-danger"
                    style={{ padding: '0.55rem 0.65rem' }}
                    title="Remove project"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab 6: Endowments */}
      {activeTab === 'endowments' && (
        <div className="admin-card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <label className="admin-label" style={{ margin: 0 }}>Endowments & Equipment</label>
            <button
              type="button"
              onClick={() =>
                setData({
                  ...data,
                  industryCollaborations: {
                    ...data.industryCollaborations,
                    endowments: [
                      ...(data.industryCollaborations?.endowments || []),
                      { id: `endow-${Date.now()}`, title: 'Award/Equipment Title', bestowedBy: 'Bestowed by...', contribution: 'Details of contribution' },
                    ],
                  },
                })
              }
              className="admin-btn admin-btn--secondary"
              style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.8rem', padding: '0.35rem 0.75rem' }}
            >
              <Plus size={14} /> Add Endowment
            </button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {(data.industryCollaborations?.endowments || []).map((endow, idx) => (
              <div key={idx} style={{ padding: '1rem', border: '1px solid #e2e8f0', borderRadius: '8px', background: '#f8fafc', display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.5rem', flex: 1 }}>
                  <input
                    type="text"
                    placeholder="Title"
                    value={endow.title}
                    onChange={(e) => {
                      const updated = [...(data.industryCollaborations?.endowments || [])];
                      updated[idx] = { ...updated[idx], title: e.target.value };
                      setData({ ...data, industryCollaborations: { ...data.industryCollaborations, endowments: updated } });
                    }}
                    className="admin-input"
                    style={{ fontWeight: 700 }}
                  />
                  <input
                    type="text"
                    placeholder="Bestowed by"
                    value={endow.bestowedBy}
                    onChange={(e) => {
                      const updated = [...(data.industryCollaborations?.endowments || [])];
                      updated[idx] = { ...updated[idx], bestowedBy: e.target.value };
                      setData({ ...data, industryCollaborations: { ...data.industryCollaborations, endowments: updated } });
                    }}
                    className="admin-input"
                  />
                  <input
                    type="text"
                    placeholder="Contribution"
                    value={endow.contribution}
                    onChange={(e) => {
                      const updated = [...(data.industryCollaborations?.endowments || [])];
                      updated[idx] = { ...updated[idx], contribution: e.target.value };
                      setData({ ...data, industryCollaborations: { ...data.industryCollaborations, endowments: updated } });
                    }}
                    className="admin-input"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => {
                    const updated = (data.industryCollaborations?.endowments || []).filter((_, i) => i !== idx);
                    setData({ ...data, industryCollaborations: { ...data.industryCollaborations, endowments: updated } });
                  }}
                  className="admin-btn-danger"
                  style={{ padding: '0.55rem 0.65rem' }}
                  title="Remove endowment"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 7: Outcomes */}
      {activeTab === 'outcomes' && (
        <div className="admin-card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <label className="admin-label" style={{ margin: 0 }}>Outcomes & Achievements</label>
            <button
              type="button"
              onClick={() =>
                setData({
                  ...data,
                  outcomes: [...data.outcomes, { title: 'Outcome Title', text: 'Outcome description' }],
                })
              }
              className="admin-btn admin-btn--secondary"
              style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.8rem', padding: '0.35rem 0.75rem' }}
            >
              <Plus size={14} /> Add Outcome
            </button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {data.outcomes.map((oc, idx) => (
              <div key={idx} style={{ padding: '1rem', border: '1px solid #e2e8f0', borderRadius: '8px', background: '#f8fafc', display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <input
                    type="text"
                    placeholder="Title"
                    value={oc.title}
                    onChange={(e) => {
                      const updated = [...data.outcomes];
                      updated[idx] = { ...updated[idx], title: e.target.value };
                      setData({ ...data, outcomes: updated });
                    }}
                    className="admin-input"
                    style={{ fontWeight: 700 }}
                  />
                  <textarea
                    rows={2}
                    placeholder="Details"
                    value={oc.text}
                    onChange={(e) => {
                      const updated = [...data.outcomes];
                      updated[idx] = { ...updated[idx], text: e.target.value };
                      setData({ ...data, outcomes: updated });
                    }}
                    className="admin-textarea"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => setData({ ...data, outcomes: data.outcomes.filter((_, i) => i !== idx) })}
                  className="admin-btn-danger"
                  style={{ padding: '0.55rem 0.65rem' }}
                  title="Remove outcome"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
