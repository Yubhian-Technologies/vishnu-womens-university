import { useState, useEffect } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { setDoc } from '../../../lib/auditLog';
import { db } from '../../../lib/firebase';
import { dreamHouseConstructionLab } from '../../Differentiators/dreamHouseConstructionLab.data';
import { Plus, Trash2, Save, RotateCcw, Check } from 'lucide-react';

export type DreamHouseLabDoc = typeof dreamHouseConstructionLab;

export default function DreamHouseLabContentAdmin() {
  const [data, setData] = useState<DreamHouseLabDoc>(dreamHouseConstructionLab);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [activeTab, setActiveTab] = useState<
    'overview' | 'visionMission' | 'objectives' | 'inCharge' | 'academicProject' | 'studentsBenefited'
  >('overview');

  useEffect(() => {
    async function loadData() {
      try {
        const snap = await getDoc(doc(db, 'settings', 'dreamHouseLab'));
        if (snap.exists()) {
          const remote = snap.data() as Partial<DreamHouseLabDoc>;
          setData({
            ...dreamHouseConstructionLab,
            ...remote,
            paragraphs: remote.paragraphs || dreamHouseConstructionLab.paragraphs,
            mission: remote.mission || dreamHouseConstructionLab.mission,
            objectives: remote.objectives || dreamHouseConstructionLab.objectives,
            inCharge: { ...dreamHouseConstructionLab.inCharge, ...(remote.inCharge || {}) },
            academicProject: {
              ...dreamHouseConstructionLab.academicProject,
              ...(remote.academicProject || {}),
              team: remote.academicProject?.team || dreamHouseConstructionLab.academicProject.team,
              paragraphs: remote.academicProject?.paragraphs || dreamHouseConstructionLab.academicProject.paragraphs,
            },
            studentsBenefited: remote.studentsBenefited || dreamHouseConstructionLab.studentsBenefited,
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
      setData(dreamHouseConstructionLab);
    }
  };

  if (loading) {
    return <div className="admin-card" style={{ textAlign: 'center', padding: '2rem', color: '#64748b' }}>Loading Dream House Lab Content Editor...</div>;
  }

  return (
    <div className="admin-section">
      {/* Header */}
      <div className="admin-card" style={{ marginBottom: '1.25rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ display: 'inline-block', padding: '0.2rem 0.6rem', borderRadius: '4px', background: '#dcfce7', color: '#15803d', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '0.35rem' }}>
              Differentiator Editor
            </div>
            <h2 style={{ margin: 0, fontSize: '1.4rem', fontWeight: 700, color: '#0f172a' }}>Dream House Construction Lab (DHCL) Content</h2>
            <p style={{ margin: '0.25rem 0 0', fontSize: '0.875rem', color: '#64748b' }}>
              Edit overview paragraphs, vision, mission, objectives, research projects, in-charge and student cohorts.
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
            { id: 'overview', label: 'Overview Paragraphs' },
            { id: 'visionMission', label: 'Vision & Mission' },
            { id: 'objectives', label: 'Objectives' },
            { id: 'inCharge', label: 'Coordinator / In-Charge' },
            { id: 'academicProject', label: 'Academic Project & Team' },
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
        <div className="admin-card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
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
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
              <label className="admin-label" style={{ margin: 0 }}>Mission Statements</label>
              <button
                type="button"
                onClick={() => setData({ ...data, mission: [...data.mission, ''] })}
                className="admin-btn admin-btn--secondary"
                style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.8rem', padding: '0.35rem 0.75rem' }}
              >
                <Plus size={14} /> Add Mission Bullet
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

      {/* Tab 3: Objectives */}
      {activeTab === 'objectives' && (
        <div className="admin-card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <label className="admin-label" style={{ margin: 0 }}>Objectives</label>
            <button
              type="button"
              onClick={() => setData({ ...data, objectives: [...data.objectives, ''] })}
              className="admin-btn admin-btn--secondary"
              style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.8rem', padding: '0.35rem 0.75rem' }}
            >
              <Plus size={14} /> Add Objective
            </button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {data.objectives.map((obj, idx) => (
              <div key={idx} style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-start' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#64748b', width: '1.5rem', textAlign: 'right', marginTop: '0.5rem' }}>{idx + 1}.</span>
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

      {/* Tab 4: In-Charge */}
      {activeTab === 'inCharge' && (
        <div className="admin-card">
          <h3 style={{ margin: '0 0 1rem 0', fontSize: '1.1rem', fontWeight: 600, color: '#0f172a' }}>In-Charge Profile</h3>
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
              <label className="admin-label">Interests</label>
              <input
                type="text"
                value={data.inCharge?.interests || ''}
                onChange={(e) => setData({ ...data, inCharge: { ...data.inCharge, interests: e.target.value } })}
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
          </div>
        </div>
      )}

      {/* Tab 5: Academic Project */}
      {activeTab === 'academicProject' && (
        <div className="admin-card" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div className="admin-field">
            <label className="admin-label">Project Heading</label>
            <textarea
              rows={2}
              value={data.academicProject?.heading || ''}
              onChange={(e) =>
                setData({
                  ...data,
                  academicProject: { ...data.academicProject, heading: e.target.value },
                })
              }
              className="admin-textarea"
            />
          </div>

          {/* Team Table */}
          <div className="admin-field">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
              <label className="admin-label" style={{ margin: 0 }}>Project Team Members</label>
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
                      const updatedRows = [...(data.academicProject?.team?.rows || [])];
                      updatedRows[rIdx] = { cells: [e.target.value, row.cells[1], row.cells[2], row.cells[3]] };
                      setData({
                        ...data,
                        academicProject: {
                          ...data.academicProject,
                          team: { ...data.academicProject.team, rows: updatedRows },
                        },
                      });
                    }}
                    className="admin-input"
                    style={{ width: '60px', textAlign: 'center', padding: '0.4rem' }}
                  />
                  <input
                    type="text"
                    placeholder="Regd No"
                    value={row.cells[1] || ''}
                    onChange={(e) => {
                      const updatedRows = [...(data.academicProject?.team?.rows || [])];
                      updatedRows[rIdx] = { cells: [row.cells[0], e.target.value, row.cells[2], row.cells[3]] };
                      setData({
                        ...data,
                        academicProject: {
                          ...data.academicProject,
                          team: { ...data.academicProject.team, rows: updatedRows },
                        },
                      });
                    }}
                    className="admin-input"
                    style={{ width: '130px', fontFamily: 'monospace', padding: '0.4rem' }}
                  />
                  <input
                    type="text"
                    placeholder="Student Name"
                    value={row.cells[2] || ''}
                    onChange={(e) => {
                      const updatedRows = [...(data.academicProject?.team?.rows || [])];
                      updatedRows[rIdx] = { cells: [row.cells[0], row.cells[1], e.target.value, row.cells[3]] };
                      setData({
                        ...data,
                        academicProject: {
                          ...data.academicProject,
                          team: { ...data.academicProject.team, rows: updatedRows },
                        },
                      });
                    }}
                    className="admin-input"
                    style={{ flex: 1, padding: '0.4rem' }}
                  />
                  <input
                    type="text"
                    placeholder="Faculty Guide"
                    value={row.cells[3] || ''}
                    onChange={(e) => {
                      const updatedRows = [...(data.academicProject?.team?.rows || [])];
                      updatedRows[rIdx] = { cells: [row.cells[0], row.cells[1], row.cells[2], e.target.value] };
                      setData({
                        ...data,
                        academicProject: {
                          ...data.academicProject,
                          team: { ...data.academicProject.team, rows: updatedRows },
                        },
                      });
                    }}
                    className="admin-input"
                    style={{ flex: 1, padding: '0.4rem' }}
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const updatedRows = (data.academicProject?.team?.rows || []).filter((_, i) => i !== rIdx);
                      setData({
                        ...data,
                        academicProject: {
                          ...data.academicProject,
                          team: { ...data.academicProject.team, rows: updatedRows },
                        },
                      });
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
        </div>
      )}

      {/* Tab 6: Students Benefited */}
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
    </div>
  );
}
