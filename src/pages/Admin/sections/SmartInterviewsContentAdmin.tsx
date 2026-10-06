import { useState, useEffect } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { setDoc } from '../../../lib/auditLog';
import { db } from '../../../lib/firebase';
import { smartInterviews } from '../../Differentiators/smartInterviews.data';
import { Plus, Trash2, Save, RotateCcw, Check } from 'lucide-react';

export type SmartInterviewsDoc = typeof smartInterviews;

export default function SmartInterviewsContentAdmin() {
  const [data, setData] = useState<SmartInterviewsDoc>(smartInterviews);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'phases' | 'moreInfo' | 'batches'>('overview');

  useEffect(() => {
    async function loadData() {
      try {
        const snap = await getDoc(doc(db, 'settings', 'smartInterviews'));
        if (snap.exists()) {
          const remote = snap.data() as Partial<SmartInterviewsDoc>;
          setData({
            ...smartInterviews,
            ...remote,
            paragraphs: remote.paragraphs || smartInterviews.paragraphs,
            phases: remote.phases || smartInterviews.phases,
            moreParagraphs: remote.moreParagraphs || smartInterviews.moreParagraphs,
            batches: remote.batches || smartInterviews.batches,
          });
        }
      } catch (err) {
        console.error('Failed to load Smart Interviews data:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      await setDoc(doc(db, 'settings', 'smartInterviews'), data);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      console.error('Failed to save Smart Interviews data:', err);
      alert('Failed to save changes. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    if (confirm('Reset all content to original defaults?')) {
      setData(smartInterviews);
    }
  };

  if (loading) {
    return <div className="admin-card" style={{ textAlign: 'center', padding: '2rem', color: '#64748b' }}>Loading Smart Interviews Content Editor...</div>;
  }

  return (
    <div className="admin-section">
      {/* Header */}
      <div className="admin-card" style={{ marginBottom: '1.25rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ display: 'inline-block', padding: '0.2rem 0.6rem', borderRadius: '4px', background: '#dbeafe', color: '#1d4ed8', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '0.35rem' }}>
              Differentiator Editor
            </div>
            <h2 style={{ margin: 0, fontSize: '1.4rem', fontWeight: 700, color: '#0f172a' }}>Smart Interviews (C&DS) Content</h2>
            <p style={{ margin: '0.25rem 0 0', fontSize: '0.875rem', color: '#64748b' }}>
              Edit training overview, 3-phase curriculum syllabus, methodology paragraphs, and batch placement statistics.
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
            { id: 'overview', label: 'Intro & Overview' },
            { id: 'phases', label: '3-Phase Syllabus' },
            { id: 'moreInfo', label: 'Methodology & Support' },
            { id: 'batches', label: 'Placed Batches Table' },
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
            <label className="admin-label" style={{ margin: 0 }}>Intro Paragraphs</label>
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
      )}

      {/* Tab 2: Phases */}
      {activeTab === 'phases' && (
        <div className="admin-card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <label className="admin-label" style={{ margin: 0 }}>Training Phases / Syllabus</label>
            <button
              type="button"
              onClick={() =>
                setData({
                  ...data,
                  phases: [
                    ...data.phases,
                    { label: `Phase-${data.phases.length + 1}:`, content: 'Curriculum topics...' },
                  ],
                })
              }
              className="admin-btn admin-btn--secondary"
              style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.8rem', padding: '0.35rem 0.75rem' }}
            >
              <Plus size={14} /> Add Phase
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {data.phases.map((phase, idx) => (
              <div key={idx} style={{ padding: '1rem', border: '1px solid #e2e8f0', borderRadius: '8px', background: '#f8fafc', display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                <div style={{ width: '130px' }}>
                  <input
                    type="text"
                    value={phase.label}
                    onChange={(e) => {
                      const updated = [...data.phases];
                      updated[idx] = { ...updated[idx], label: e.target.value };
                      setData({ ...data, phases: updated });
                    }}
                    className="admin-input"
                    style={{ fontWeight: 700, fontSize: '0.85rem' }}
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <textarea
                    rows={2}
                    value={phase.content}
                    onChange={(e) => {
                      const updated = [...data.phases];
                      updated[idx] = { ...updated[idx], content: e.target.value };
                      setData({ ...data, phases: updated });
                    }}
                    className="admin-textarea"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => setData({ ...data, phases: data.phases.filter((_, i) => i !== idx) })}
                  className="admin-btn-danger"
                  style={{ padding: '0.55rem 0.65rem' }}
                  title="Remove phase"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: More Info */}
      {activeTab === 'moreInfo' && (
        <div className="admin-card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <label className="admin-label" style={{ margin: 0 }}>Methodology & Execution Details</label>
            <button
              type="button"
              onClick={() => setData({ ...data, moreParagraphs: [...data.moreParagraphs, ''] })}
              className="admin-btn admin-btn--secondary"
              style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.8rem', padding: '0.35rem 0.75rem' }}
            >
              <Plus size={14} /> Add Paragraph
            </button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {data.moreParagraphs.map((p, idx) => (
              <div key={idx} style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-start' }}>
                <textarea
                  rows={3}
                  value={p}
                  onChange={(e) => {
                    const updated = [...data.moreParagraphs];
                    updated[idx] = e.target.value;
                    setData({ ...data, moreParagraphs: updated });
                  }}
                  className="admin-textarea"
                  style={{ flex: 1 }}
                />
                <button
                  type="button"
                  onClick={() => setData({ ...data, moreParagraphs: data.moreParagraphs.filter((_, i) => i !== idx) })}
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

      {/* Tab 4: Batches */}
      {activeTab === 'batches' && (
        <div className="admin-card" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', maxWidth: '700px' }}>
          <div className="admin-field">
            <label className="admin-label">Batches Table Heading</label>
            <input
              type="text"
              value={data.batchesHeading}
              onChange={(e) => setData({ ...data, batchesHeading: e.target.value })}
              className="admin-input"
              style={{ fontWeight: 600 }}
            />
          </div>

          <div className="admin-field">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
              <label className="admin-label" style={{ margin: 0 }}>Batch Statistics</label>
              <button
                type="button"
                onClick={() =>
                  setData({
                    ...data,
                    batches: [...data.batches, { years: '2021-2025', count: '100' }],
                  })
                }
                className="admin-btn admin-btn--secondary"
                style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.8rem', padding: '0.35rem 0.75rem' }}
              >
                <Plus size={14} /> Add Batch
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {data.batches.map((batch, idx) => (
                <div key={idx} style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', padding: '0.75rem', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '6px' }}>
                  <input
                    type="text"
                    placeholder="Batch Years (e.g. 2020-2024)"
                    value={batch.years}
                    onChange={(e) => {
                      const updated = [...data.batches];
                      updated[idx] = { ...updated[idx], years: e.target.value };
                      setData({ ...data, batches: updated });
                    }}
                    className="admin-input"
                    style={{ width: '180px', fontWeight: 600 }}
                  />
                  <input
                    type="text"
                    placeholder="Students Count"
                    value={batch.count}
                    onChange={(e) => {
                      const updated = [...data.batches];
                      updated[idx] = { ...updated[idx], count: e.target.value };
                      setData({ ...data, batches: updated });
                    }}
                    className="admin-input"
                    style={{ width: '140px', fontWeight: 700, color: '#1d4ed8' }}
                  />
                  <button
                    type="button"
                    onClick={() => setData({ ...data, batches: data.batches.filter((_, i) => i !== idx) })}
                    className="admin-btn-danger"
                    style={{ padding: '0.5rem 0.65rem' }}
                    title="Remove batch"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
