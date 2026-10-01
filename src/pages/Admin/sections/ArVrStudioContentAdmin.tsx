import { useState, useEffect } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { setDoc } from '../../../lib/auditLog';
import { db } from '../../../lib/firebase';
import { arVrStudio, type TechInfrastructure, type ConceptExperience, type FormattedObjective } from '../../Differentiators/arVrStudio.data';
import { Plus, Trash2, Save, RotateCcw, Sparkles, BookOpen, Layers, Lightbulb, UserCheck } from 'lucide-react';

export type ArVrStudioDoc = typeof arVrStudio;

export default function ArVrStudioContentAdmin() {
  const [data, setData] = useState<ArVrStudioDoc>(arVrStudio);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState<
    'overview' | 'visionMission' | 'objectives' | 'infrastructure' | 'concepts' | 'highlights' | 'faculty'
  >('overview');

  useEffect(() => {
    async function loadData() {
      try {
        const snap = await getDoc(doc(db, 'settings', 'arVrStudio'));
        if (snap.exists()) {
          const remote = snap.data() as Partial<ArVrStudioDoc>;
          setData({
            ...arVrStudio,
            ...remote,
            aboutParagraphs: remote.aboutParagraphs || arVrStudio.aboutParagraphs,
            mission: remote.mission || arVrStudio.mission,
            objectivesFormatted: remote.objectivesFormatted || arVrStudio.objectivesFormatted,
            techInfrastructure: {
              ...arVrStudio.techInfrastructure,
              ...(remote.techInfrastructure || {}),
              groups: remote.techInfrastructure?.groups || arVrStudio.techInfrastructure.groups,
            },
            conceptExperience: {
              ...arVrStudio.conceptExperience,
              ...(remote.conceptExperience || {}),
              cards: remote.conceptExperience?.cards || arVrStudio.conceptExperience.cards,
            },
            keyHighlights: remote.keyHighlights || arVrStudio.keyHighlights,
            facultyInCharge: { ...arVrStudio.facultyInCharge, ...(remote.facultyInCharge || {}) },
            contact: { ...arVrStudio.contact, ...(remote.contact || {}) },
          });
        }
      } catch (err) {
        console.error('Failed to load AR/VR Studio data:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      await setDoc(doc(db, 'settings', 'arVrStudio'), data);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch (err) {
      console.error('Failed to save AR/VR Studio data:', err);
      alert('Failed to save changes. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    if (confirm('Reset all content to original defaults?')) {
      setData(arVrStudio);
    }
  };

  if (loading) {
    return <p className="admin-loading">Loading AR / VR Studio Content Editor...</p>;
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
                AR / VR Studio Content Editor
              </h2>
            </div>
            <p className="admin-field__hint" style={{ margin: '0.35rem 0 0' }}>
              Edit overview, vision, mission, structured objectives, tech infrastructure, experiences, highlights, and faculty in-charge.
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
            <span>AR / VR Studio content successfully saved and published live!</span>
          </div>
        )}

        {/* Tabs */}
        <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.75rem', marginBottom: '1.5rem' }}>
          {[
            { id: 'overview', label: 'Overview Paragraphs', icon: BookOpen },
            { id: 'visionMission', label: 'Vision & Mission', icon: Sparkles },
            { id: 'objectives', label: 'Formatted Objectives', icon: Lightbulb },
            { id: 'infrastructure', label: 'Tech Infrastructure', icon: Layers },
            { id: 'concepts', label: 'Concept Experiences', icon: Lightbulb },
            { id: 'highlights', label: 'Key Highlights', icon: Sparkles },
            { id: 'faculty', label: 'Faculty & Contact', icon: UserCheck },
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
                  onClick={() => setData({ ...data, aboutParagraphs: [...data.aboutParagraphs, ''] })}
                  className="admin-btn admin-btn--sm admin-btn--secondary"
                >
                  <Plus size={14} /> Add Paragraph
                </button>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                {data.aboutParagraphs.map((p, idx) => (
                  <div key={idx} style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-start' }}>
                    <textarea
                      rows={2}
                      className="admin-textarea"
                      value={p}
                      onChange={(e) => {
                        const updated = [...data.aboutParagraphs];
                        updated[idx] = e.target.value;
                        setData({ ...data, aboutParagraphs: updated });
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => setData({ ...data, aboutParagraphs: data.aboutParagraphs.filter((_, i) => i !== idx) })}
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
                  rows={2}
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

          {/* Tab 3: Formatted Objectives */}
          {activeTab === 'objectives' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <label className="admin-label" style={{ margin: 0 }}>Formatted Objectives</label>
                <button
                  type="button"
                  onClick={() =>
                    setData({
                      ...data,
                      objectivesFormatted: [
                        ...data.objectivesFormatted,
                        {
                          code: `0${data.objectivesFormatted.length + 1}`,
                          title: 'New Objective',
                          desc: 'Objective description here',
                        } as FormattedObjective,
                      ],
                    })
                  }
                  className="admin-btn admin-btn--sm admin-btn--secondary"
                >
                  <Plus size={14} /> Add Objective
                </button>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {data.objectivesFormatted.map((obj, idx) => (
                  <div key={idx} style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '0.85rem' }}>
                    <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
                      <input
                        type="text"
                        value={obj.code}
                        onChange={(e) => {
                          const updated = [...data.objectivesFormatted];
                          updated[idx] = { ...updated[idx], code: e.target.value };
                          setData({ ...data, objectivesFormatted: updated });
                        }}
                        style={{ width: '70px' }}
                        className="admin-input"
                        placeholder="Code"
                      />
                      <input
                        type="text"
                        value={obj.title}
                        onChange={(e) => {
                          const updated = [...data.objectivesFormatted];
                          updated[idx] = { ...updated[idx], title: e.target.value };
                          setData({ ...data, objectivesFormatted: updated });
                        }}
                        className="admin-input"
                        placeholder="Title"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const updated = data.objectivesFormatted.filter((_, i) => i !== idx);
                          setData({ ...data, objectivesFormatted: updated });
                        }}
                        className="admin-btn-danger"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                    <textarea
                      rows={2}
                      value={obj.desc}
                      onChange={(e) => {
                        const updated = [...data.objectivesFormatted];
                        updated[idx] = { ...updated[idx], desc: e.target.value };
                        setData({ ...data, objectivesFormatted: updated });
                      }}
                      className="admin-textarea"
                      placeholder="Description"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tab 4: Tech Infrastructure */}
          {activeTab === 'infrastructure' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <label className="admin-label" style={{ margin: 0 }}>Infrastructure Categories</label>
                <button
                  type="button"
                  onClick={() =>
                    setData({
                      ...data,
                      techInfrastructure: {
                        ...data.techInfrastructure,
                        groups: [
                          ...data.techInfrastructure.groups,
                          { category: 'New Category', items: ['Item 1'] } as TechInfrastructure,
                        ],
                      },
                    })
                  }
                  className="admin-btn admin-btn--sm admin-btn--secondary"
                >
                  <Plus size={14} /> Add Category
                </button>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {data.techInfrastructure.groups.map((grp, gIdx) => (
                  <div key={gIdx} style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '0.85rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                      <input
                        type="text"
                        value={grp.category}
                        onChange={(e) => {
                          const updated = [...data.techInfrastructure.groups];
                          updated[gIdx] = { ...updated[gIdx], category: e.target.value };
                          setData({
                            ...data,
                            techInfrastructure: { ...data.techInfrastructure, groups: updated },
                          });
                        }}
                        className="admin-input"
                        style={{ fontWeight: 700 }}
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const updated = data.techInfrastructure.groups.filter((_, i) => i !== gIdx);
                          setData({
                            ...data,
                            techInfrastructure: { ...data.techInfrastructure, groups: updated },
                          });
                        }}
                        className="admin-btn-danger"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', marginTop: '0.5rem' }}>
                      {grp.items.map((item, iIdx) => (
                        <div key={iIdx} style={{ display: 'flex', gap: '0.4rem' }}>
                          <input
                            type="text"
                            value={item}
                            onChange={(e) => {
                              const updated = [...data.techInfrastructure.groups];
                              const updatedItems = [...updated[gIdx].items];
                              updatedItems[iIdx] = e.target.value;
                              updated[gIdx] = { ...updated[gIdx], items: updatedItems };
                              setData({
                                ...data,
                                techInfrastructure: { ...data.techInfrastructure, groups: updated },
                              });
                            }}
                            className="admin-input"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              const updated = [...data.techInfrastructure.groups];
                              updated[gIdx] = {
                                ...updated[gIdx],
                                items: updated[gIdx].items.filter((_, i) => i !== iIdx),
                              };
                              setData({
                                ...data,
                                techInfrastructure: { ...data.techInfrastructure, groups: updated },
                              });
                            }}
                            className="admin-btn-danger"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      ))}
                      <button
                        type="button"
                        onClick={() => {
                          const updated = [...data.techInfrastructure.groups];
                          updated[gIdx] = { ...updated[gIdx], items: [...updated[gIdx].items, ''] };
                          setData({
                            ...data,
                            techInfrastructure: { ...data.techInfrastructure, groups: updated },
                          });
                        }}
                        className="admin-btn admin-btn--sm admin-btn--ghost"
                        style={{ alignSelf: 'flex-start', marginTop: '0.25rem' }}
                      >
                        <Plus size={12} /> Add Item
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tab 5: Concept Experiences */}
          {activeTab === 'concepts' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <label className="admin-label" style={{ margin: 0 }}>Concept Experiences</label>
                <button
                  type="button"
                  onClick={() =>
                    setData({
                      ...data,
                      conceptExperience: {
                        ...data.conceptExperience,
                        cards: [
                          ...data.conceptExperience.cards,
                          { title: 'New Experience', desc: 'Description of experience' } as ConceptExperience,
                        ],
                      },
                    })
                  }
                  className="admin-btn admin-btn--sm admin-btn--secondary"
                >
                  <Plus size={14} /> Add Experience
                </button>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '0.75rem' }}>
                {data.conceptExperience.cards.map((exp, idx) => (
                  <div key={idx} style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '0.85rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                      <strong>Experience #{idx + 1}</strong>
                      <button
                        type="button"
                        onClick={() => {
                          const updated = data.conceptExperience.cards.filter((_, i) => i !== idx);
                          setData({
                            ...data,
                            conceptExperience: { ...data.conceptExperience, cards: updated },
                          });
                        }}
                        className="admin-btn-danger"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                    <div className="admin-field" style={{ marginBottom: '0.5rem' }}>
                      <input
                        type="text"
                        value={exp.title}
                        onChange={(e) => {
                          const updated = [...data.conceptExperience.cards];
                          updated[idx] = { ...updated[idx], title: e.target.value };
                          setData({
                            ...data,
                            conceptExperience: { ...data.conceptExperience, cards: updated },
                          });
                        }}
                        className="admin-input"
                        placeholder="Title"
                      />
                    </div>
                    <div className="admin-field">
                      <textarea
                        rows={2}
                        value={exp.desc}
                        onChange={(e) => {
                          const updated = [...data.conceptExperience.cards];
                          updated[idx] = { ...updated[idx], desc: e.target.value };
                          setData({
                            ...data,
                            conceptExperience: { ...data.conceptExperience, cards: updated },
                          });
                        }}
                        className="admin-textarea"
                        placeholder="Description"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tab 6: Highlights */}
          {activeTab === 'highlights' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <label className="admin-label" style={{ margin: 0 }}>Key Highlights</label>
                <button
                  type="button"
                  onClick={() => setData({ ...data, keyHighlights: [...data.keyHighlights, ''] })}
                  className="admin-btn admin-btn--sm admin-btn--secondary"
                >
                  <Plus size={14} /> Add Highlight
                </button>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {data.keyHighlights.map((hl, idx) => (
                  <div key={idx} style={{ display: 'flex', gap: '0.5rem' }}>
                    <input
                      type="text"
                      value={hl}
                      onChange={(e) => {
                        const updated = [...data.keyHighlights];
                        updated[idx] = e.target.value;
                        setData({ ...data, keyHighlights: updated });
                      }}
                      className="admin-input"
                    />
                    <button
                      type="button"
                      onClick={() => setData({ ...data, keyHighlights: data.keyHighlights.filter((_, i) => i !== idx) })}
                      className="admin-btn-danger"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tab 7: Faculty & Contact */}
          {activeTab === 'faculty' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div>
                <label className="admin-label">Faculty In-Charge Profile</label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '0.75rem' }}>
                  <div className="admin-field">
                    <label>Name</label>
                    <input
                      type="text"
                      value={data.facultyInCharge?.name || ''}
                      onChange={(e) => setData({ ...data, facultyInCharge: { ...data.facultyInCharge, name: e.target.value } })}
                      className="admin-input"
                    />
                  </div>
                  <div className="admin-field">
                    <label>Designation</label>
                    <input
                      type="text"
                      value={data.facultyInCharge?.designation || ''}
                      onChange={(e) => setData({ ...data, facultyInCharge: { ...data.facultyInCharge, designation: e.target.value } })}
                      className="admin-input"
                    />
                  </div>
                  <div className="admin-field">
                    <label>Email</label>
                    <input
                      type="email"
                      value={data.facultyInCharge?.email || ''}
                      onChange={(e) => setData({ ...data, facultyInCharge: { ...data.facultyInCharge, email: e.target.value } })}
                      className="admin-input"
                    />
                  </div>
                  <div className="admin-field">
                    <label>Mobile</label>
                    <input
                      type="text"
                      value={data.facultyInCharge?.mobile || ''}
                      onChange={(e) => setData({ ...data, facultyInCharge: { ...data.facultyInCharge, mobile: e.target.value } })}
                      className="admin-input"
                    />
                  </div>
                  <div className="admin-field" style={{ gridColumn: '1 / -1' }}>
                    <label>Interests / Research Areas</label>
                    <input
                      type="text"
                      value={data.facultyInCharge?.interests || ''}
                      onChange={(e) => setData({ ...data, facultyInCharge: { ...data.facultyInCharge, interests: e.target.value } })}
                      className="admin-input"
                    />
                  </div>
                </div>
              </div>

              <div style={{ paddingTop: '1rem', borderTop: '1px solid #e5e7eb' }}>
                <label className="admin-label">Contact Information</label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '0.75rem' }}>
                  <div className="admin-field">
                    <label>Contact Email</label>
                    <input
                      type="email"
                      value={data.contact?.email || ''}
                      onChange={(e) => setData({ ...data, contact: { ...data.contact, email: e.target.value } })}
                      className="admin-input"
                    />
                  </div>
                  <div className="admin-field">
                    <label>Contact Phone</label>
                    <input
                      type="text"
                      value={data.contact?.phone || ''}
                      onChange={(e) => setData({ ...data, contact: { ...data.contact, phone: e.target.value } })}
                      className="admin-input"
                    />
                  </div>
                  <div className="admin-field" style={{ gridColumn: '1 / -1' }}>
                    <label>Location / Address</label>
                    <input
                      type="text"
                      value={(data.contact?.address || []).join(', ')}
                      onChange={(e) => setData({ ...data, contact: { ...data.contact, address: e.target.value ? [e.target.value] : [] } })}
                      className="admin-input"
                      placeholder="e.g. Shri Vishnu Engineering College for Women, Vishnupur, Bhimavaram, Andhra Pradesh, India"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
