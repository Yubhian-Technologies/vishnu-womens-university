import { useState, useEffect } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../../../lib/firebase';
import { concreteCanoeLab, type CanoeCompetition } from '../../Differentiators/concreteCanoeLab.data';
import { Plus, Trash2, Save, RotateCcw, Sparkles, BookOpen, Users, Award, Trophy } from 'lucide-react';

export type ConcreteCanoeDoc = typeof concreteCanoeLab;

export default function ConcreteCanoeContentAdmin() {
  const [data, setData] = useState<ConcreteCanoeDoc>(concreteCanoeLab);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState<
    'overview' | 'visionMission' | 'objectives' | 'inCharge' | 'academicProject' | 'teams' | 'competitions'
  >('overview');

  useEffect(() => {
    async function loadData() {
      try {
        const snap = await getDoc(doc(db, 'settings', 'concreteCanoeLab'));
        if (snap.exists()) {
          const remote = snap.data() as Partial<ConcreteCanoeDoc>;
          setData({
            ...concreteCanoeLab,
            ...remote,
            paragraphs: remote.paragraphs || concreteCanoeLab.paragraphs,
            mission: remote.mission || concreteCanoeLab.mission,
            objectives: remote.objectives || concreteCanoeLab.objectives,
            inCharge: { ...concreteCanoeLab.inCharge, ...(remote.inCharge || {}) },
            academicProject: {
              ...concreteCanoeLab.academicProject,
              ...(remote.academicProject || {}),
              team: remote.academicProject?.team || concreteCanoeLab.academicProject.team,
            },
            studentsBenefited: remote.studentsBenefited || concreteCanoeLab.studentsBenefited,
            competitions: remote.competitions || concreteCanoeLab.competitions,
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
      await setDoc(doc(db, 'settings', 'concreteCanoeLab'), data);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch (err) {
      console.error('Failed to save Concrete Canoe Lab data:', err);
      alert('Failed to save changes. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    if (confirm('Reset all content to original defaults?')) {
      setData(concreteCanoeLab);
    }
  };

  if (loading) {
    return <p className="admin-loading">Loading Concrete Canoe Lab Content Editor...</p>;
  }

  return (
    <div className="admin-section">
      <div className="admin-card">
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '1.25rem', borderBottom: '1px solid #e5e7eb', paddingBottom: '1rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Sparkles size={18} color="#c8a03c" />
              <h2 className="admin-card__title" style={{ margin: 0, padding: 0, border: 'none' }}>
                Concrete Canoe Laboratory Content Editor
              </h2>
            </div>
            <p className="admin-field__hint" style={{ margin: '0.35rem 0 0' }}>
              Edit overview, vision, mission, objectives, research projects, student teams, and national competitions.
            </p>
          </div>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button type="button" onClick={handleReset} className="admin-btn admin-btn--sm admin-btn--ghost">
              <RotateCcw size={14} /> Reset Defaults
            </button>
            <button type="button" onClick={handleSave} disabled={saving} className="admin-btn admin-btn--sm admin-btn--primary">
              <Save size={14} /> {saving ? 'Saving...' : 'Save All Changes'}
            </button>
          </div>
        </div>

        {savedSuccess && (
          <div style={{ background: '#ecfdf5', border: '1px solid #a7f3d0', padding: '0.75rem 1rem', borderRadius: '8px', color: '#065f46', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
            <span>Concrete Canoe Lab content successfully saved and published live!</span>
          </div>
        )}

        {/* Tabs */}
        <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.75rem', marginBottom: '1.5rem' }}>
          {[
            { id: 'overview', label: 'Overview Paragraphs', icon: BookOpen },
            { id: 'visionMission', label: 'Vision & Mission', icon: Sparkles },
            { id: 'objectives', label: 'Objectives', icon: Sparkles },
            { id: 'inCharge', label: 'Faculty In-Charge', icon: Users },
            { id: 'academicProject', label: 'Academic Project', icon: Award },
            { id: 'teams', label: 'Student Teams', icon: Users },
            { id: 'competitions', label: 'Competitions', icon: Trophy },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as any)}
                className={`admin-btn admin-btn--sm ${isActive ? 'admin-btn--primary' : 'admin-btn--ghost'}`}
              >
                <Icon size={14} /> {tab.label}
              </button>
            );
          })}
        </div>

        {/* Content */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {/* Tab 1: Overview */}
          {activeTab === 'overview' && (
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
                      style={{ padding: '0.5rem' }}
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tab 2: Vision & Mission */}
          {activeTab === 'visionMission' && (
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
                    <div key={idx} style={{ display: 'flex', gap: '0.5rem' }}>
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
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Tab 3: Objectives */}
          {activeTab === 'objectives' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <label className="admin-label" style={{ margin: 0 }}>Objectives</label>
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
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tab 4: In Charge */}
          {activeTab === 'inCharge' && (
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
                  <label>Interests</label>
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

          {/* Tab 5: Academic Project */}
          {activeTab === 'academicProject' && (
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
              <div style={{ paddingTop: '0.75rem', borderTop: '1px solid #e5e7eb' }}>
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
                          const updated = [...(data.academicProject?.paragraphs || [])];
                          updated[idx] = e.target.value;
                          setData({ ...data, academicProject: { ...data.academicProject, paragraphs: updated } });
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const updated = (data.academicProject?.paragraphs || []).filter((_, i) => i !== idx);
                          setData({ ...data, academicProject: { ...data.academicProject, paragraphs: updated } });
                        }}
                        className="admin-btn-danger"
                        style={{ padding: '0.5rem' }}
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Tab 6: Teams */}
          {activeTab === 'teams' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <label className="admin-label" style={{ margin: 0 }}>Student Teams</label>
                <button
                  type="button"
                  onClick={() =>
                    setData({
                      ...data,
                      studentsBenefited: [
                        ...(data.studentsBenefited || []),
                        { label: 'NEW TEAM', students: ['Student 1'] },
                      ],
                    })
                  }
                  className="admin-btn admin-btn--sm admin-btn--secondary"
                >
                  <Plus size={14} /> Add Team
                </button>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '0.85rem' }}>
                {(data.studentsBenefited || []).map((team, tIdx) => (
                  <div key={tIdx} style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '0.85rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                      <input
                        type="text"
                        value={team.label}
                        onChange={(e) => {
                          const updated = [...(data.studentsBenefited || [])];
                          updated[tIdx] = { ...updated[tIdx], label: e.target.value };
                          setData({ ...data, studentsBenefited: updated });
                        }}
                        className="admin-input"
                        style={{ fontWeight: 700 }}
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const updated = (data.studentsBenefited || []).filter((_, i) => i !== tIdx);
                          setData({ ...data, studentsBenefited: updated });
                        }}
                        className="admin-btn-danger"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                      {team.students.map((st, sIdx) => (
                        <div key={sIdx} style={{ display: 'flex', gap: '0.4rem' }}>
                          <input
                            type="text"
                            value={st}
                            onChange={(e) => {
                              const updated = [...(data.studentsBenefited || [])];
                              const updatedStudents = [...updated[tIdx].students];
                              updatedStudents[sIdx] = e.target.value;
                              updated[tIdx] = { ...updated[tIdx], students: updatedStudents };
                              setData({ ...data, studentsBenefited: updated });
                            }}
                            className="admin-input"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              const updated = [...(data.studentsBenefited || [])];
                              updated[tIdx] = {
                                ...updated[tIdx],
                                students: updated[tIdx].students.filter((_, i) => i !== sIdx),
                              };
                              setData({ ...data, studentsBenefited: updated });
                            }}
                            className="admin-btn-danger"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      ))}
                      <button
                        type="button"
                        onClick={() => {
                          const updated = [...(data.studentsBenefited || [])];
                          updated[tIdx] = { ...updated[tIdx], students: [...updated[tIdx].students, ''] };
                          setData({ ...data, studentsBenefited: updated });
                        }}
                        className="admin-btn admin-btn--sm admin-btn--ghost"
                        style={{ alignSelf: 'flex-start', marginTop: '0.25rem' }}
                      >
                        <Plus size={12} /> Add Student
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tab 7: Competitions */}
          {activeTab === 'competitions' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <label className="admin-label" style={{ margin: 0 }}>Competitions & Achievements</label>
                <button
                  type="button"
                  onClick={() =>
                    setData({
                      ...data,
                      competitions: [
                        ...(data.competitions || []),
                        { name: 'New Competition', date: '', students: [], year: '', remarks: '' } as CanoeCompetition,
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
                          const updated = [...(data.competitions || [])];
                          updated[idx] = { ...updated[idx], name: e.target.value };
                          setData({ ...data, competitions: updated });
                        }}
                        className="admin-input"
                        style={{ fontWeight: 700 }}
                        placeholder="Competition Name"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const updated = (data.competitions || []).filter((_, i) => i !== idx);
                          setData({ ...data, competitions: updated });
                        }}
                        className="admin-btn-danger"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.6rem' }}>
                      <input
                        type="text"
                        value={comp.date}
                        onChange={(e) => {
                          const updated = [...(data.competitions || [])];
                          updated[idx] = { ...updated[idx], date: e.target.value };
                          setData({ ...data, competitions: updated });
                        }}
                        className="admin-input"
                        placeholder="Date (e.g. 07-03-2024)"
                      />
                      <input
                        type="text"
                        value={comp.year}
                        onChange={(e) => {
                          const updated = [...(data.competitions || [])];
                          updated[idx] = { ...updated[idx], year: e.target.value };
                          setData({ ...data, competitions: updated });
                        }}
                        className="admin-input"
                        placeholder="Year (e.g. III Year)"
                      />
                      <input
                        type="text"
                        value={comp.remarks}
                        onChange={(e) => {
                          const updated = [...(data.competitions || [])];
                          updated[idx] = { ...updated[idx], remarks: e.target.value };
                          setData({ ...data, competitions: updated });
                        }}
                        className="admin-input"
                        placeholder="Award / Remarks"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
