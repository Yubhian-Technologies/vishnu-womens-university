import { useState, useEffect } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { setDoc } from '../../../lib/auditLog';
import { db } from '../../../lib/firebase';
import { ultraTechCoe } from '../../Differentiators/ultraTechCoe.data';
import { Plus, Trash2, Save, RotateCcw, Check } from 'lucide-react';

export type UltraTechDoc = typeof ultraTechCoe;

export default function UltraTechContentAdmin() {
  const [data, setData] = useState<UltraTechDoc>(ultraTechCoe);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [activeTab, setActiveTab] = useState<
    'overview' | 'focusDomains' | 'visionMission' | 'objectives' | 'activities' | 'inCharge' | 'studentsBenefited'
  >('overview');

  useEffect(() => {
    async function loadData() {
      try {
        const snap = await getDoc(doc(db, 'settings', 'ultraTechCoe'));
        if (snap.exists()) {
          const remote = snap.data() as Partial<UltraTechDoc>;
          setData({
            ...ultraTechCoe,
            ...remote,
            focusDomains: remote.focusDomains || ultraTechCoe.focusDomains,
            overview: remote.overview || ultraTechCoe.overview,
            mission: remote.mission || ultraTechCoe.mission,
            objectives: remote.objectives || ultraTechCoe.objectives,
            activitiesList: remote.activitiesList || ultraTechCoe.activitiesList,
            keyHighlights: remote.keyHighlights || ultraTechCoe.keyHighlights,
            outcomes: remote.outcomes || ultraTechCoe.outcomes,
            inCharge: { ...ultraTechCoe.inCharge, ...(remote.inCharge || {}) },
            studentsBenefited: remote.studentsBenefited || ultraTechCoe.studentsBenefited,
          });
        }
      } catch (err) {
        console.error('Failed to load UltraTech CoE content:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      await setDoc(doc(db, 'settings', 'ultraTechCoe'), data);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      console.error('Failed to save UltraTech CoE data:', err);
      alert('Failed to save changes. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    if (confirm('Are you sure you want to reset all content to the original defaults?')) {
      setData(ultraTechCoe);
    }
  };

  if (loading) {
    return <div className="admin-card" style={{ textAlign: 'center', padding: '2rem', color: '#64748b' }}>Loading UltraTech CoE Content Editor...</div>;
  }

  return (
    <div className="admin-section">
      {/* Header */}
      <div className="admin-card" style={{ marginBottom: '1.25rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ display: 'inline-block', padding: '0.2rem 0.6rem', borderRadius: '4px', background: '#fef3c7', color: '#b45309', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '0.35rem' }}>
              Differentiator Editor
            </div>
            <h2 style={{ margin: 0, fontSize: '1.4rem', fontWeight: 700, color: '#0f172a' }}>UltraTech Centre of Excellence Content</h2>
            <p style={{ margin: '0.25rem 0 0', fontSize: '0.875rem', color: '#64748b' }}>
              Edit all sections, focus domains, objectives, activities, coordinators, and students list for the UltraTech CoE page.
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
            { id: 'overview', label: 'Overview & Tagline' },
            { id: 'focusDomains', label: 'Focus Domains (4)' },
            { id: 'visionMission', label: 'Vision & Mission' },
            { id: 'objectives', label: 'Objectives' },
            { id: 'activities', label: 'Activities & Highlights' },
            { id: 'inCharge', label: 'Faculty In-Charge' },
            { id: 'studentsBenefited', label: 'Students Benefited' },
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

      {/* Tab 1: Overview */}
      {activeTab === 'overview' && (
        <div className="admin-card" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div className="admin-field">
            <label className="admin-label">Page Title</label>
            <input
              type="text"
              value={data.pageTitle}
              onChange={(e) => setData({ ...data, pageTitle: e.target.value })}
              className="admin-input"
            />
          </div>

          <div className="admin-field">
            <label className="admin-label">Hero Subtitle</label>
            <textarea
              rows={3}
              value={data.heroSubtitle}
              onChange={(e) => setData({ ...data, heroSubtitle: e.target.value })}
              className="admin-textarea"
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
            <div className="admin-field">
              <label className="admin-label">Tagline Title</label>
              <input
                type="text"
                value={data.taglineTitle}
                onChange={(e) => setData({ ...data, taglineTitle: e.target.value })}
                className="admin-input"
              />
            </div>
            <div className="admin-field">
              <label className="admin-label">Tagline Description</label>
              <textarea
                rows={2}
                value={data.taglineDesc}
                onChange={(e) => setData({ ...data, taglineDesc: e.target.value })}
                className="admin-textarea"
              />
            </div>
          </div>

          <div className="admin-field">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
              <label className="admin-label" style={{ margin: 0 }}>Overview Paragraphs</label>
              <button
                type="button"
                onClick={() => setData({ ...data, overview: [...data.overview, ''] })}
                className="admin-btn admin-btn--secondary"
                style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.8rem', padding: '0.35rem 0.75rem' }}
              >
                <Plus size={14} /> Add Paragraph
              </button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {data.overview.map((p, idx) => (
                <div key={idx} style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-start' }}>
                  <textarea
                    rows={3}
                    value={p}
                    onChange={(e) => {
                      const updated = [...data.overview];
                      updated[idx] = e.target.value;
                      setData({ ...data, overview: updated });
                    }}
                    className="admin-textarea"
                    style={{ flex: 1 }}
                  />
                  <button
                    type="button"
                    onClick={() => setData({ ...data, overview: data.overview.filter((_, i) => i !== idx) })}
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
        </div>
      )}

      {/* Tab 2: Focus Domains */}
      {activeTab === 'focusDomains' && (
        <div className="admin-card" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 600, color: '#0f172a' }}>Focus Domains</h3>
            <button
              type="button"
              onClick={() =>
                setData({
                  ...data,
                  focusDomains: [...data.focusDomains, { title: 'New Domain', desc: 'Description of domain' }],
                })
              }
              className="admin-btn admin-btn--secondary"
              style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.85rem' }}
            >
              <Plus size={14} /> Add Focus Domain
            </button>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
            {data.focusDomains.map((domain, idx) => (
              <div key={idx} style={{ padding: '1.25rem', border: '1px solid #e2e8f0', borderRadius: '8px', background: '#f8fafc', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#b45309', background: '#fef3c7', padding: '0.2rem 0.5rem', borderRadius: '4px' }}>
                    Domain #{idx + 1}
                  </span>
                  <button
                    type="button"
                    onClick={() =>
                      setData({ ...data, focusDomains: data.focusDomains.filter((_, i) => i !== idx) })
                    }
                    className="admin-btn-danger"
                    style={{ padding: '0.35rem 0.5rem' }}
                    title="Remove domain"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
                <div className="admin-field">
                  <label className="admin-label">Title</label>
                  <input
                    type="text"
                    value={domain.title}
                    onChange={(e) => {
                      const updated = [...data.focusDomains];
                      updated[idx] = { ...updated[idx], title: e.target.value };
                      setData({ ...data, focusDomains: updated });
                    }}
                    className="admin-input"
                  />
                </div>
                <div className="admin-field">
                  <label className="admin-label">Description</label>
                  <textarea
                    rows={2}
                    value={domain.desc}
                    onChange={(e) => {
                      const updated = [...data.focusDomains];
                      updated[idx] = { ...updated[idx], desc: e.target.value };
                      setData({ ...data, focusDomains: updated });
                    }}
                    className="admin-textarea"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: Vision & Mission */}
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
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
              <label className="admin-label" style={{ margin: 0 }}>Mission Statements</label>
              <button
                type="button"
                onClick={() => setData({ ...data, mission: [...data.mission, ''] })}
                className="admin-btn admin-btn--secondary"
                style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.8rem', padding: '0.35rem 0.75rem' }}
              >
                <Plus size={14} /> Add Bullet
              </button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {data.mission.map((bullet, idx) => (
                <div key={idx} style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#64748b', width: '1.5rem', textAlign: 'right' }}>{idx + 1}.</span>
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

      {/* Tab 4: Objectives */}
      {activeTab === 'objectives' && (
        <div className="admin-card" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div className="admin-field">
            <label className="admin-label">Objectives Intro</label>
            <textarea
              rows={2}
              value={data.objectivesIntro}
              onChange={(e) => setData({ ...data, objectivesIntro: e.target.value })}
              className="admin-textarea"
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h4 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 600, color: '#0f172a' }}>Objective Cards</h4>
            <button
              type="button"
              onClick={() =>
                setData({
                  ...data,
                  objectives: [
                    ...data.objectives,
                    { index: `0${data.objectives.length + 1}`, badge: 'Core', title: `0${data.objectives.length + 1}. Objective`, desc: '' },
                  ],
                })
              }
              className="admin-btn admin-btn--secondary"
              style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.85rem' }}
            >
              <Plus size={14} /> Add Objective
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
            {data.objectives.map((obj, idx) => (
              <div key={idx} style={{ padding: '1.25rem', border: '1px solid #e2e8f0', borderRadius: '8px', background: '#f8fafc', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#b45309', background: '#fef3c7', padding: '0.2rem 0.5rem', borderRadius: '4px' }}>
                    Objective #{obj.index || idx + 1}
                  </span>
                  <button
                    type="button"
                    onClick={() =>
                      setData({ ...data, objectives: data.objectives.filter((_, i) => i !== idx) })
                    }
                    className="admin-btn-danger"
                    style={{ padding: '0.35rem 0.5rem' }}
                    title="Remove objective"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '0.5rem' }}>
                  <div>
                    <label className="admin-label" style={{ fontSize: '0.75rem' }}>Badge</label>
                    <input
                      type="text"
                      value={obj.badge}
                      onChange={(e) => {
                        const updated = [...data.objectives];
                        updated[idx] = { ...updated[idx], badge: e.target.value };
                        setData({ ...data, objectives: updated });
                      }}
                      className="admin-input"
                    />
                  </div>
                  <div>
                    <label className="admin-label" style={{ fontSize: '0.75rem' }}>Title</label>
                    <input
                      type="text"
                      value={obj.title}
                      onChange={(e) => {
                        const updated = [...data.objectives];
                        updated[idx] = { ...updated[idx], title: e.target.value };
                        setData({ ...data, objectives: updated });
                      }}
                      className="admin-input"
                    />
                  </div>
                </div>
                <div className="admin-field">
                  <label className="admin-label">Description</label>
                  <textarea
                    rows={2}
                    value={obj.desc}
                    onChange={(e) => {
                      const updated = [...data.objectives];
                      updated[idx] = { ...updated[idx], desc: e.target.value };
                      setData({ ...data, objectives: updated });
                    }}
                    className="admin-textarea"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 5: Activities & Highlights */}
      {activeTab === 'activities' && (
        <div className="admin-card" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Activities List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h4 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 600, color: '#0f172a' }}>Activities & Events</h4>
              <button
                type="button"
                onClick={() =>
                  setData({
                    ...data,
                    activitiesList: [
                      ...data.activitiesList,
                      { eventTag: 'Webinar', dateStr: 'Recent', desc: 'Activity description' },
                    ],
                  })
                }
                className="admin-btn admin-btn--secondary"
                style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.85rem' }}
              >
                <Plus size={14} /> Add Activity
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {data.activitiesList.map((act, idx) => (
                <div key={idx} style={{ padding: '1rem', border: '1px solid #e2e8f0', borderRadius: '8px', background: '#f8fafc', display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.75rem', flex: 1 }}>
                    <div>
                      <label className="admin-label" style={{ fontSize: '0.75rem' }}>Event Tag / Badge</label>
                      <input
                        type="text"
                        value={act.eventTag}
                        onChange={(e) => {
                          const updated = [...data.activitiesList];
                          updated[idx] = { ...updated[idx], eventTag: e.target.value };
                          setData({ ...data, activitiesList: updated });
                        }}
                        className="admin-input"
                      />
                    </div>
                    <div>
                      <label className="admin-label" style={{ fontSize: '0.75rem' }}>Date / Period</label>
                      <input
                        type="text"
                        value={act.dateStr}
                        onChange={(e) => {
                          const updated = [...data.activitiesList];
                          updated[idx] = { ...updated[idx], dateStr: e.target.value };
                          setData({ ...data, activitiesList: updated });
                        }}
                        className="admin-input"
                      />
                    </div>
                    <div style={{ gridColumn: '1 / -1' }}>
                      <label className="admin-label" style={{ fontSize: '0.75rem' }}>Description</label>
                      <textarea
                        rows={2}
                        value={act.desc}
                        onChange={(e) => {
                          const updated = [...data.activitiesList];
                          updated[idx] = { ...updated[idx], desc: e.target.value };
                          setData({ ...data, activitiesList: updated });
                        }}
                        className="admin-textarea"
                      />
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      setData({ ...data, activitiesList: data.activitiesList.filter((_, i) => i !== idx) })
                    }
                    className="admin-btn-danger"
                    style={{ padding: '0.5rem 0.65rem' }}
                    title="Remove activity"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Key Highlights */}
          <div style={{ paddingTop: '1rem', borderTop: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h4 style={{ margin: 0, fontSize: '1rem', fontWeight: 600, color: '#0f172a' }}>Key Highlights</h4>
              <button
                type="button"
                onClick={() => setData({ ...data, keyHighlights: [...data.keyHighlights, ''] })}
                className="admin-btn admin-btn--secondary"
                style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.8rem', padding: '0.35rem 0.75rem' }}
              >
                <Plus size={14} /> Add Highlight
              </button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {data.keyHighlights.map((hl, idx) => (
                <div key={idx} style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                  <input
                    type="text"
                    value={hl}
                    onChange={(e) => {
                      const updated = [...data.keyHighlights];
                      updated[idx] = e.target.value;
                      setData({ ...data, keyHighlights: updated });
                    }}
                    className="admin-input"
                    style={{ flex: 1 }}
                  />
                  <button
                    type="button"
                    onClick={() => setData({ ...data, keyHighlights: data.keyHighlights.filter((_, i) => i !== idx) })}
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

          {/* Outcomes */}
          <div style={{ paddingTop: '1rem', borderTop: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h4 style={{ margin: 0, fontSize: '1rem', fontWeight: 600, color: '#0f172a' }}>Outcomes</h4>
              <button
                type="button"
                onClick={() => setData({ ...data, outcomes: [...data.outcomes, ''] })}
                className="admin-btn admin-btn--secondary"
                style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.8rem', padding: '0.35rem 0.75rem' }}
              >
                <Plus size={14} /> Add Outcome
              </button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {data.outcomes.map((oc, idx) => (
                <div key={idx} style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-start' }}>
                  <textarea
                    rows={2}
                    value={oc}
                    onChange={(e) => {
                      const updated = [...data.outcomes];
                      updated[idx] = e.target.value;
                      setData({ ...data, outcomes: updated });
                    }}
                    className="admin-textarea"
                    style={{ flex: 1 }}
                  />
                  <button
                    type="button"
                    onClick={() => setData({ ...data, outcomes: data.outcomes.filter((_, i) => i !== idx) })}
                    className="admin-btn-danger"
                    style={{ padding: '0.5rem 0.65rem' }}
                    title="Remove outcome"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab 6: Faculty In-Charge */}
      {activeTab === 'inCharge' && (
        <div className="admin-card">
          <h3 style={{ margin: '0 0 1rem 0', fontSize: '1.1rem', fontWeight: 600, color: '#0f172a' }}>In-Charge Details</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1rem' }}>
            <div className="admin-field">
              <label className="admin-label">Name</label>
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
              <label className="admin-label">Areas of Interest / Specialisation</label>
              <input
                type="text"
                value={data.inCharge?.interests || ''}
                onChange={(e) => setData({ ...data, inCharge: { ...data.inCharge, interests: e.target.value } })}
                className="admin-input"
              />
            </div>
          </div>
        </div>
      )}

      {/* Tab 7: Students Benefited */}
      {activeTab === 'studentsBenefited' && (
        <div className="admin-card" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 600, color: '#0f172a' }}>Cohort Groups</h3>
            <button
              type="button"
              onClick={() =>
                setData({
                  ...data,
                  studentsBenefited: [
                    ...data.studentsBenefited,
                    { yearLabel: 'NEW YEAR', students: [{ regdNo: '', name: '' }] },
                  ],
                })
              }
              className="admin-btn admin-btn--secondary"
              style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.85rem' }}
            >
              <Plus size={14} /> Add Year Cohort
            </button>
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
                          style={{ flex: 1, padding: '0.25rem 0.4rem', fontSize: '0.75rem', textTransform: 'uppercase' }}
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
    </div>
  );
}
