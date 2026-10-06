import { useState, useEffect } from 'react';
import { Save, RotateCcw, Plus, Trash2, CheckCircle } from 'lucide-react';
import { doc } from 'firebase/firestore';
import { setDoc } from '../../../lib/auditLog';
import { db } from '../../../lib/firebase';
import { useDocument } from '../../../hooks/useDocument';
import { ruralWomenTechPark } from '../../Differentiators/ruralWomenTechPark.data';

export type RuralWomenTechParkDoc = typeof ruralWomenTechPark;

export default function RuralWomenTechParkContentAdmin() {
  const { data: remoteData, loading } = useDocument<RuralWomenTechParkDoc>('settings', 'ruralWomenTechPark');
  const [data, setData] = useState<RuralWomenTechParkDoc>(ruralWomenTechPark);
  const [activeTab, setActiveTab] = useState<'overview' | 'interventions' | 'activities'>('overview');
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    if (remoteData) {
      setData({
        ...ruralWomenTechPark,
        ...remoteData,
        paragraphs: remoteData.paragraphs || ruralWomenTechPark.paragraphs,
        interventions: remoteData.interventions || ruralWomenTechPark.interventions,
        activities: remoteData.activities || ruralWomenTechPark.activities,
      });
    }
  }, [remoteData]);

  const handleSave = async () => {
    setSaving(true);
    try {
      await setDoc(doc(db, 'settings', 'ruralWomenTechPark'), data, { merge: true });
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch (err) {
      console.error('Failed to save RWTP content:', err);
      alert('Failed to save content. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    if (confirm('Are you sure you want to reset to default content? Unsaved changes will be lost.')) {
      setData(ruralWomenTechPark);
    }
  };

  if (loading) {
    return <div className="admin-card" style={{ textAlign: 'center', padding: '2rem', color: '#64748b' }}>Loading Rural Women Technology Park content editor...</div>;
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
            <h2 style={{ margin: 0, fontSize: '1.4rem', fontWeight: 700, color: '#0f172a' }}>Rural Women Technology Park (RWTP) Page Editor</h2>
            <p style={{ margin: '0.25rem 0 0', fontSize: '0.875rem', color: '#64748b' }}>
              Customize all content sections, interventions, training activity metrics, and impact numbers for the RWTP differentiator page.
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
              <Save size={16} /> {saving ? 'Saving...' : 'Save All Changes'}
            </button>
          </div>
        </div>

        {savedSuccess && (
          <div style={{ marginTop: '1rem', padding: '0.75rem 1rem', background: '#ecfdf5', border: '1px solid #a7f3d0', borderRadius: '6px', display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#065f46', fontSize: '0.875rem' }}>
            <CheckCircle size={16} color="#059669" />
            <span>Rural Women Technology Park content successfully saved and published live!</span>
          </div>
        )}

        {/* Navigation Sub-Tabs */}
        <div style={{ display: 'flex', gap: '0.5rem', borderBottom: '1px solid #e2e8f0', marginTop: '1.25rem', paddingBottom: '0.25rem', overflowX: 'auto' }}>
          {[
            { id: 'overview', label: 'Overview & Intro Paragraphs' },
            { id: 'interventions', label: `Key Interventions Identified (${data.interventions?.length || 0})` },
            { id: 'activities', label: `Training Activities & Impact Metrics (${data.activities?.length || 0})` },
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

      {/* TAB 1: OVERVIEW */}
      {activeTab === 'overview' && (
        <div className="admin-card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <label className="admin-label" style={{ margin: 0 }}>Introductory & Context Paragraphs</label>
            <button
              type="button"
              onClick={() => setData({ ...data, paragraphs: [...(data.paragraphs || []), ''] })}
              className="admin-btn admin-btn--secondary"
              style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.8rem', padding: '0.35rem 0.75rem' }}
            >
              <Plus size={14} /> Add Paragraph
            </button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {(data.paragraphs || []).map((p, idx) => (
              <div key={idx} style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-start' }}>
                <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#94a3b8', marginTop: '0.5rem', width: '25px' }}>P{idx + 1}</span>
                <textarea
                  rows={3}
                  value={p}
                  onChange={(e) => {
                    const next = [...(data.paragraphs || [])];
                    next[idx] = e.target.value;
                    setData({ ...data, paragraphs: next });
                  }}
                  className="admin-textarea"
                  style={{ flex: 1 }}
                />
                <button
                  type="button"
                  onClick={() => {
                    const next = (data.paragraphs || []).filter((_, i) => i !== idx);
                    setData({ ...data, paragraphs: next });
                  }}
                  className="admin-btn-danger"
                  style={{ padding: '0.6rem 0.75rem' }}
                  title="Delete paragraph"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: INTERVENTIONS */}
      {activeTab === 'interventions' && (
        <div className="admin-card" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div className="admin-field">
            <label className="admin-label">Interventions Section Heading</label>
            <input
              type="text"
              value={data.interventionsHeading || ''}
              onChange={(e) => setData({ ...data, interventionsHeading: e.target.value })}
              className="admin-input"
              style={{ maxWidth: '500px' }}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 600, color: '#0f172a' }}>Interventions List</h3>
            <button
              type="button"
              onClick={() =>
                setData({
                  ...data,
                  interventions: [
                    ...(data.interventions || []),
                    { title: 'New Intervention', paragraphs: [''] },
                  ],
                })
              }
              className="admin-btn admin-btn--secondary"
              style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.85rem' }}
            >
              <Plus size={14} /> Add Intervention
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {(data.interventions || []).map((item, idx) => (
              <div key={idx} style={{ padding: '1.25rem', border: '1px solid #e2e8f0', borderRadius: '8px', background: '#f8fafc', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#15803d', background: '#dcfce7', padding: '0.2rem 0.5rem', borderRadius: '4px' }}>
                    Intervention #{idx + 1}
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      const next = (data.interventions || []).filter((_, i) => i !== idx);
                      setData({ ...data, interventions: next });
                    }}
                    className="admin-btn-danger"
                    style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.8rem', padding: '0.35rem 0.75rem' }}
                  >
                    <Trash2 size={14} /> Remove
                  </button>
                </div>
                <div className="admin-field">
                  <label className="admin-label">Title</label>
                  <input
                    type="text"
                    value={item.title}
                    onChange={(e) => {
                      const next = [...(data.interventions || [])];
                      next[idx] = { ...next[idx], title: e.target.value };
                      setData({ ...data, interventions: next });
                    }}
                    className="admin-input"
                  />
                </div>
                <div className="admin-field">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                    <label className="admin-label" style={{ margin: 0 }}>Paragraphs</label>
                    <button
                      type="button"
                      onClick={() => {
                        const next = [...(data.interventions || [])];
                        next[idx] = { ...next[idx], paragraphs: [...next[idx].paragraphs, ''] };
                        setData({ ...data, interventions: next });
                      }}
                      className="admin-btn admin-btn--secondary"
                      style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.75rem', padding: '0.25rem 0.5rem' }}
                    >
                      <Plus size={12} /> Add Paragraph
                    </button>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    {item.paragraphs.map((p, pIdx) => (
                      <div key={pIdx} style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-start' }}>
                        <textarea
                          rows={2}
                          value={p}
                          onChange={(e) => {
                            const next = [...(data.interventions || [])];
                            const nextParas = [...next[idx].paragraphs];
                            nextParas[pIdx] = e.target.value;
                            next[idx] = { ...next[idx], paragraphs: nextParas };
                            setData({ ...data, interventions: next });
                          }}
                          className="admin-textarea"
                          style={{ flex: 1 }}
                        />
                        <button
                          type="button"
                          onClick={() => {
                            const next = [...(data.interventions || [])];
                            const nextParas = next[idx].paragraphs.filter((_, i) => i !== pIdx);
                            next[idx] = { ...next[idx], paragraphs: nextParas };
                            setData({ ...data, interventions: next });
                          }}
                          className="admin-btn-danger"
                          style={{ padding: '0.5rem 0.6rem' }}
                          title="Delete paragraph"
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

      {/* TAB 3: ACTIVITIES */}
      {activeTab === 'activities' && (
        <div className="admin-card" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
            <div className="admin-field">
              <label className="admin-label">Activities Section Heading</label>
              <input
                type="text"
                value={data.activitiesHeading || ''}
                onChange={(e) => setData({ ...data, activitiesHeading: e.target.value })}
                className="admin-input"
              />
            </div>
            <div className="admin-field">
              <label className="admin-label">Total Beneficiaries Number Badge</label>
              <input
                type="text"
                value={data.activitiesTotalBeneficiaries || ''}
                onChange={(e) => setData({ ...data, activitiesTotalBeneficiaries: e.target.value })}
                placeholder="e.g. 1421"
                className="admin-input"
              />
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 600, color: '#0f172a' }}>Training Activity Breakdown Rows</h3>
            <button
              type="button"
              onClick={() =>
                setData({
                  ...data,
                  activities: [
                    ...(data.activities || []),
                    { activity: 'New Training Activity', trainings: '10', beneficiaries: '50', shgs: '5' },
                  ],
                })
              }
              className="admin-btn admin-btn--secondary"
              style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.85rem' }}
            >
              <Plus size={14} /> Add Activity Row
            </button>
          </div>

          <div style={{ overflowX: 'auto', border: '1px solid #e2e8f0', borderRadius: '8px' }}>
            <table className="admin-table" style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
              <thead style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0', fontSize: '0.75rem', fontWeight: 700, color: '#475569', textTransform: 'uppercase' }}>
                <tr>
                  <th style={{ padding: '0.75rem 1rem' }}>Training Activity</th>
                  <th style={{ padding: '0.75rem 1rem', width: '120px' }}>No. of Trainings</th>
                  <th style={{ padding: '0.75rem 1rem', width: '120px' }}>Beneficiaries</th>
                  <th style={{ padding: '0.75rem 1rem', width: '120px' }}>SHGs Covered</th>
                  <th style={{ padding: '0.75rem 1rem', width: '60px', textAlign: 'center' }}>Action</th>
                </tr>
              </thead>
              <tbody style={{ background: '#ffffff' }}>
                {(data.activities || []).map((row, idx) => (
                  <tr key={idx} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '0.5rem 1rem' }}>
                      <input
                        type="text"
                        value={row.activity}
                        onChange={(e) => {
                          const next = [...(data.activities || [])];
                          next[idx] = { ...next[idx], activity: e.target.value };
                          setData({ ...data, activities: next });
                        }}
                        className="admin-input"
                        style={{ padding: '0.35rem 0.5rem', fontSize: '0.85rem' }}
                      />
                    </td>
                    <td style={{ padding: '0.5rem 1rem' }}>
                      <input
                        type="text"
                        value={row.trainings}
                        onChange={(e) => {
                          const next = [...(data.activities || [])];
                          next[idx] = { ...next[idx], trainings: e.target.value };
                          setData({ ...data, activities: next });
                        }}
                        className="admin-input"
                        style={{ padding: '0.35rem 0.5rem', fontSize: '0.85rem', textAlign: 'center' }}
                      />
                    </td>
                    <td style={{ padding: '0.5rem 1rem' }}>
                      <input
                        type="text"
                        value={row.beneficiaries}
                        onChange={(e) => {
                          const next = [...(data.activities || [])];
                          next[idx] = { ...next[idx], beneficiaries: e.target.value };
                          setData({ ...data, activities: next });
                        }}
                        className="admin-input"
                        style={{ padding: '0.35rem 0.5rem', fontSize: '0.85rem', textAlign: 'center' }}
                      />
                    </td>
                    <td style={{ padding: '0.5rem 1rem' }}>
                      <input
                        type="text"
                        value={row.shgs}
                        onChange={(e) => {
                          const next = [...(data.activities || [])];
                          next[idx] = { ...next[idx], shgs: e.target.value };
                          setData({ ...data, activities: next });
                        }}
                        className="admin-input"
                        style={{ padding: '0.35rem 0.5rem', fontSize: '0.85rem', textAlign: 'center' }}
                      />
                    </td>
                    <td style={{ padding: '0.5rem 1rem', textAlign: 'center' }}>
                      <button
                        type="button"
                        onClick={() => {
                          const next = (data.activities || []).filter((_, i) => i !== idx);
                          setData({ ...data, activities: next });
                        }}
                        className="admin-btn-danger"
                        style={{ padding: '0.35rem 0.5rem' }}
                        title="Delete row"
                      >
                        <Trash2 size={13} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
