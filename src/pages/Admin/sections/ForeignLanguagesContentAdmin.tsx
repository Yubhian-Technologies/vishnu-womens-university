import { useState, useEffect } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../../../lib/firebase';
import { foreignLanguages } from '../../Differentiators/foreignLanguages.data';
import { Plus, Trash2, Save, RotateCcw, Check } from 'lucide-react';

export type ForeignLanguagesDoc = typeof foreignLanguages;

export default function ForeignLanguagesContentAdmin() {
  const [data, setData] = useState<ForeignLanguagesDoc>(foreignLanguages);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'visionObjectives' | 'coordinator' | 'languages'>('overview');

  useEffect(() => {
    async function loadData() {
      try {
        const snap = await getDoc(doc(db, 'settings', 'foreignLanguages'));
        if (snap.exists()) {
          const remote = snap.data() as Partial<ForeignLanguagesDoc>;
          setData({
            ...foreignLanguages,
            ...remote,
            paragraphs: remote.paragraphs || foreignLanguages.paragraphs,
            objectives: remote.objectives || foreignLanguages.objectives,
            coordinator: { ...foreignLanguages.coordinator, ...(remote.coordinator || {}) },
            languages: remote.languages || foreignLanguages.languages,
          });
        }
      } catch (err) {
        console.error('Failed to load Foreign Languages data:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      await setDoc(doc(db, 'settings', 'foreignLanguages'), data);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      console.error('Failed to save Foreign Languages data:', err);
      alert('Failed to save changes. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    if (confirm('Reset all content to original defaults?')) {
      setData(foreignLanguages);
    }
  };

  if (loading) {
    return <div className="admin-card" style={{ textAlign: 'center', padding: '2rem', color: '#64748b' }}>Loading Foreign Languages Content Editor...</div>;
  }

  return (
    <div className="admin-section">
      {/* Header Card */}
      <div className="admin-card" style={{ marginBottom: '1.25rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ display: 'inline-block', padding: '0.2rem 0.6rem', borderRadius: '4px', background: '#ffe4e6', color: '#be123c', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '0.35rem' }}>
              Differentiator Editor
            </div>
            <h2 style={{ margin: 0, fontSize: '1.4rem', fontWeight: 700, color: '#0f172a' }}>Foreign Languages Program Content</h2>
            <p style={{ margin: '0.25rem 0 0', fontSize: '0.875rem', color: '#64748b' }}>
              Edit overview, banner quotes, vision, objectives, faculty coordinator, and each language program module (French, German, Spanish, Japanese, Korean) with certification statistics.
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
            { id: 'overview', label: 'Quote Banner & Intro' },
            { id: 'visionObjectives', label: 'Vision & Objectives' },
            { id: 'coordinator', label: 'Coordinator Details' },
            { id: 'languages', label: 'Language Modules (5)' },
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
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1rem' }}>
            <div className="admin-field">
              <label className="admin-label">Quote Text</label>
              <input
                type="text"
                value={data.quote?.text || ''}
                onChange={(e) => setData({ ...data, quote: { ...data.quote, text: e.target.value } })}
                className="admin-input"
              />
            </div>
            <div className="admin-field">
              <label className="admin-label">Quote Author</label>
              <input
                type="text"
                value={data.quote?.author || ''}
                onChange={(e) => setData({ ...data, quote: { ...data.quote, author: e.target.value } })}
                className="admin-input"
              />
            </div>
          </div>

          <div className="admin-field">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
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

          <div className="admin-field">
            <label className="admin-label">Languages Offered Banner Text</label>
            <textarea
              rows={3}
              value={data.languagesOffered}
              onChange={(e) => setData({ ...data, languagesOffered: e.target.value })}
              className="admin-textarea"
            />
          </div>
        </div>
      )}

      {/* Tab 2: Vision & Objectives */}
      {activeTab === 'visionObjectives' && (
        <div className="admin-card" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div className="admin-field">
            <label className="admin-label">Vision Statement</label>
            <textarea
              rows={3}
              value={data.vision}
              onChange={(e) => setData({ ...data, vision: e.target.value })}
              className="admin-textarea"
            />
          </div>

          <div className="admin-field">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
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
                <div key={idx} style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#64748b', width: '1.5rem', textAlign: 'right' }}>{idx + 1}.</span>
                  <input
                    type="text"
                    value={obj}
                    onChange={(e) => {
                      const updated = [...data.objectives];
                      updated[idx] = e.target.value;
                      setData({ ...data, objectives: updated });
                    }}
                    className="admin-input"
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
        </div>
      )}

      {/* Tab 3: Coordinator */}
      {activeTab === 'coordinator' && (
        <div className="admin-card">
          <h3 style={{ margin: '0 0 1rem 0', fontSize: '1.1rem', fontWeight: 600, color: '#0f172a' }}>Coordinator Information</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1rem' }}>
            <div className="admin-field">
              <label className="admin-label">Coordinator Name</label>
              <input
                type="text"
                value={data.coordinator?.name || ''}
                onChange={(e) => setData({ ...data, coordinator: { ...data.coordinator, name: e.target.value } })}
                className="admin-input"
              />
            </div>
            <div className="admin-field">
              <label className="admin-label">Designation</label>
              <input
                type="text"
                value={data.coordinator?.designation || ''}
                onChange={(e) => setData({ ...data, coordinator: { ...data.coordinator, designation: e.target.value } })}
                className="admin-input"
              />
            </div>
            <div className="admin-field">
              <label className="admin-label">Email Address</label>
              <input
                type="email"
                value={data.coordinator?.email || ''}
                onChange={(e) => setData({ ...data, coordinator: { ...data.coordinator, email: e.target.value } })}
                className="admin-input"
              />
            </div>
            <div className="admin-field">
              <label className="admin-label">Phone Number</label>
              <input
                type="text"
                value={data.coordinator?.mobile || ''}
                onChange={(e) => setData({ ...data, coordinator: { ...data.coordinator, mobile: e.target.value } })}
                className="admin-input"
              />
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: Languages */}
      {activeTab === 'languages' && (
        <div className="admin-card" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 600, color: '#0f172a' }}>Language Modules & Certification Statistics</h3>
            <button
              type="button"
              onClick={() =>
                setData({
                  ...data,
                  languages: [
                    ...data.languages,
                    {
                      name: 'New Language',
                      quote: 'Language quote...',
                      paragraphs: ['Description of language program'],
                      reportLabel: 'Annual Certification Report',
                      table: [{ year: '2024-25', count: '100' }],
                    },
                  ],
                })
              }
              className="admin-btn admin-btn--secondary"
              style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem' }}
            >
              <Plus size={14} /> Add Language Module
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {data.languages.map((lang, lIdx) => (
              <div key={lIdx} style={{ padding: '1.25rem', border: '1px solid #e2e8f0', borderRadius: '8px', background: '#f8fafc', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#be123c', background: '#ffe4e6', padding: '0.2rem 0.5rem', borderRadius: '4px' }}>
                      #{lIdx + 1}
                    </span>
                    <input
                      type="text"
                      value={lang.name}
                      onChange={(e) => {
                        const updated = [...data.languages];
                        updated[lIdx] = { ...updated[lIdx], name: e.target.value };
                        setData({ ...data, languages: updated });
                      }}
                      className="admin-input"
                      style={{ fontWeight: 700, width: '220px' }}
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => setData({ ...data, languages: data.languages.filter((_, i) => i !== lIdx) })}
                    className="admin-btn-danger"
                    style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.8rem', padding: '0.35rem 0.75rem' }}
                  >
                    <Trash2 size={14} /> Remove Module
                  </button>
                </div>

                <div className="admin-field">
                  <label className="admin-label">Quote</label>
                  <input
                    type="text"
                    value={lang.quote}
                    onChange={(e) => {
                      const updated = [...data.languages];
                      updated[lIdx] = { ...updated[lIdx], quote: e.target.value };
                      setData({ ...data, languages: updated });
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
                        const updated = [...data.languages];
                        updated[lIdx] = { ...updated[lIdx], paragraphs: [...updated[lIdx].paragraphs, ''] };
                        setData({ ...data, languages: updated });
                      }}
                      className="admin-btn admin-btn--secondary"
                      style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.75rem', padding: '0.25rem 0.5rem' }}
                    >
                      <Plus size={12} /> Add Paragraph
                    </button>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    {lang.paragraphs.map((p, pIdx) => (
                      <div key={pIdx} style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-start' }}>
                        <textarea
                          rows={2}
                          value={p}
                          onChange={(e) => {
                            const updated = [...data.languages];
                            const updatedParas = [...updated[lIdx].paragraphs];
                            updatedParas[pIdx] = e.target.value;
                            updated[lIdx] = { ...updated[lIdx], paragraphs: updatedParas };
                            setData({ ...data, languages: updated });
                          }}
                          className="admin-textarea"
                          style={{ flex: 1 }}
                        />
                        <button
                          type="button"
                          onClick={() => {
                            const updated = [...data.languages];
                            updated[lIdx] = {
                              ...updated[lIdx],
                              paragraphs: updated[lIdx].paragraphs.filter((_, i) => i !== pIdx),
                            };
                            setData({ ...data, languages: updated });
                          }}
                          className="admin-btn-danger"
                          style={{ padding: '0.5rem 0.6rem' }}
                          title="Remove paragraph"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Table Stats */}
                <div style={{ paddingTop: '0.75rem', borderTop: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <label className="admin-label" style={{ margin: 0 }}>Report Heading:</label>
                      <input
                        type="text"
                        value={lang.reportLabel}
                        onChange={(e) => {
                          const updated = [...data.languages];
                          updated[lIdx] = { ...updated[lIdx], reportLabel: e.target.value };
                          setData({ ...data, languages: updated });
                        }}
                        className="admin-input"
                        style={{ width: '250px' }}
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        const updated = [...data.languages];
                        updated[lIdx] = {
                          ...updated[lIdx],
                          table: [...updated[lIdx].table, { year: '2024-25', count: '0' }],
                        };
                        setData({ ...data, languages: updated });
                      }}
                      className="admin-btn admin-btn--secondary"
                      style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.75rem', padding: '0.35rem 0.6rem' }}
                    >
                      <Plus size={12} /> Add Year Row
                    </button>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '0.5rem' }}>
                    {lang.table.map((row, rIdx) => (
                      <div key={rIdx} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: '#ffffff', padding: '0.5rem', borderRadius: '6px', border: '1px solid #cbd5e1' }}>
                        <input
                          type="text"
                          placeholder="Year"
                          value={row.year}
                          onChange={(e) => {
                            const updated = [...data.languages];
                            const updatedTable = [...updated[lIdx].table];
                            updatedTable[rIdx] = { ...updatedTable[rIdx], year: e.target.value };
                            updated[lIdx] = { ...updated[lIdx], table: updatedTable };
                            setData({ ...data, languages: updated });
                          }}
                          className="admin-input"
                          style={{ width: '85px', padding: '0.25rem 0.4rem', fontSize: '0.8rem' }}
                        />
                        <input
                          type="text"
                          placeholder="Count"
                          value={row.count}
                          onChange={(e) => {
                            const updated = [...data.languages];
                            const updatedTable = [...updated[lIdx].table];
                            updatedTable[rIdx] = { ...updatedTable[rIdx], count: e.target.value };
                            updated[lIdx] = { ...updated[lIdx], table: updatedTable };
                            setData({ ...data, languages: updated });
                          }}
                          className="admin-input"
                          style={{ flex: 1, padding: '0.25rem 0.4rem', fontSize: '0.8rem', fontWeight: 600 }}
                        />
                        <button
                          type="button"
                          onClick={() => {
                            const updated = [...data.languages];
                            updated[lIdx] = {
                              ...updated[lIdx],
                              table: updated[lIdx].table.filter((_, i) => i !== rIdx),
                            };
                            setData({ ...data, languages: updated });
                          }}
                          className="admin-btn-danger"
                          style={{ padding: '0.3rem 0.4rem' }}
                          title="Remove row"
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
