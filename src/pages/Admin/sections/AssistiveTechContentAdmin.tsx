import { useState, useEffect } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { setDoc } from '../../../lib/auditLog';
import { db } from '../../../lib/firebase';
import {
  assistiveTechLab,
  type AtlMember,
  type AtlYearTraining,
  type AtlOutcomeEvent,
  type AtlDevice,
  type AtlCommunityEvent,
} from '../../Differentiators/assistiveTechLab.data';
import { Plus, Trash2, Save, RotateCcw, Sparkles, BookOpen, Users, Award, FileText, Cpu, Calendar, Wrench } from 'lucide-react';

export type AssistiveTechLabDoc = typeof assistiveTechLab;

export default function AssistiveTechContentAdmin() {
  const [data, setData] = useState<AssistiveTechLabDoc>(assistiveTechLab);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState<
    'overview' | 'visionMission' | 'objectives' | 'devices' | 'events' | 'team' | 'training' | 'highlights' | 'facilities' | 'outcomes' | 'publications'
  >('overview');

  useEffect(() => {
    async function loadData() {
      try {
        const snap = await getDoc(doc(db, 'settings', 'assistiveTechLab'));
        if (snap.exists()) {
          const remote = snap.data() as Partial<AssistiveTechLabDoc>;
          setData({
            ...assistiveTechLab,
            ...remote,
            paragraphs: remote.paragraphs || assistiveTechLab.paragraphs,
            mission: remote.mission || assistiveTechLab.mission,
            objectives: remote.objectives || assistiveTechLab.objectives,
            assistiveDevices: remote.assistiveDevices || assistiveTechLab.assistiveDevices,
            communityEvents: remote.communityEvents || assistiveTechLab.communityEvents,
            equipmentList: remote.equipmentList || assistiveTechLab.equipmentList,
            highlightsList: remote.highlightsList || assistiveTechLab.highlightsList,
            team: {
              dean: { ...assistiveTechLab.team.dean, ...(remote.team?.dean || {}) },
              inCharge: { ...assistiveTechLab.team.inCharge, ...(remote.team?.inCharge || {}) },
              facultyMembers: remote.team?.facultyMembers || assistiveTechLab.team.facultyMembers,
            },
            trainingByYear: remote.trainingByYear || assistiveTechLab.trainingByYear,
            outcomes: remote.outcomes || assistiveTechLab.outcomes,
          });
        }
      } catch (err) {
        console.error('Failed to load Assistive Tech Lab data:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      await setDoc(doc(db, 'settings', 'assistiveTechLab'), data);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch (err) {
      console.error('Failed to save Assistive Tech Lab data:', err);
      alert('Failed to save changes. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    if (confirm('Reset all content to original defaults?')) {
      setData(assistiveTechLab);
    }
  };

  if (loading) {
    return <p className="admin-loading">Loading Assistive Technology Lab Content Editor...</p>;
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
                Assistive Technology Lab (ATL) Content Editor
              </h2>
            </div>
            <p className="admin-field__hint" style={{ margin: '0.35rem 0 0' }}>
              Edit overview, vision, mission, objectives, coordinators, training by year, outcomes, and publications.
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
            <span>ATL content successfully saved and published live!</span>
          </div>
        )}

        {/* Tabs */}
        <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.75rem', marginBottom: '1.5rem' }}>
          {[
            { id: 'overview', label: 'Overview Paragraphs', icon: BookOpen },
            { id: 'visionMission', label: 'Vision & Mission', icon: Sparkles },
            { id: 'objectives', label: 'Objectives', icon: Sparkles },
            { id: 'devices', label: 'Assistive Devices', icon: Cpu },
            { id: 'events', label: 'Community Events', icon: Calendar },
            { id: 'team', label: 'Faculty & Mentors', icon: Users },
            { id: 'training', label: 'Trainings & Projects', icon: Award },
            { id: 'highlights', label: 'Key Highlights', icon: Sparkles },
            { id: 'facilities', label: 'Facilities & Equipment', icon: Wrench },
            { id: 'outcomes', label: 'Outcomes & Makeathons', icon: Award },
            { id: 'publications', label: 'Publications', icon: FileText },
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
                      rows={2}
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
                  rows={2}
                  className="admin-textarea"
                  value={data.vision}
                  onChange={(e) => setData({ ...data, vision: e.target.value })}
                  placeholder="Enter vision statement..."
                />
              </div>
              <div style={{ paddingTop: '1rem', borderTop: '1px solid #e5e7eb' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                  <label className="admin-label" style={{ margin: 0 }}>Mission Statements</label>
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

          {/* Assistive Devices & Technologies */}
          {activeTab === 'devices' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <label className="admin-label" style={{ margin: 0 }}>Assistive Devices & Technologies</label>
                <button
                  type="button"
                  onClick={() =>
                    setData({
                      ...data,
                      assistiveDevices: [
                        ...data.assistiveDevices,
                        { title: 'Device Title', category: 'Category', description: 'Device description', tag: 'Tag', icon: 'eye' } as AtlDevice,
                      ],
                    })
                  }
                  className="admin-btn admin-btn--sm admin-btn--secondary"
                >
                  <Plus size={14} /> Add Device
                </button>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '0.85rem' }}>
                {data.assistiveDevices.map((d, idx) => (
                  <div key={idx} style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '0.85rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem', gap: '0.5rem' }}>
                      <input
                        type="text"
                        value={d.category}
                        onChange={(e) => {
                          const updated = [...data.assistiveDevices];
                          updated[idx] = { ...updated[idx], category: e.target.value };
                          setData({ ...data, assistiveDevices: updated });
                        }}
                        className="admin-input"
                        style={{ fontWeight: 600, color: '#b45309' }}
                        placeholder="Category"
                      />
                      <button
                        type="button"
                        onClick={() => setData({ ...data, assistiveDevices: data.assistiveDevices.filter((_, i) => i !== idx) })}
                        className="admin-btn-danger"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                    <div className="admin-field" style={{ marginBottom: '0.5rem' }}>
                      <input
                        type="text"
                        value={d.title}
                        onChange={(e) => {
                          const updated = [...data.assistiveDevices];
                          updated[idx] = { ...updated[idx], title: e.target.value };
                          setData({ ...data, assistiveDevices: updated });
                        }}
                        className="admin-input"
                        style={{ fontWeight: 700 }}
                        placeholder="Device Title"
                      />
                    </div>
                    <div className="admin-field" style={{ marginBottom: '0.5rem' }}>
                      <textarea
                        rows={2}
                        value={d.description}
                        onChange={(e) => {
                          const updated = [...data.assistiveDevices];
                          updated[idx] = { ...updated[idx], description: e.target.value };
                          setData({ ...data, assistiveDevices: updated });
                        }}
                        className="admin-textarea"
                        placeholder="Device Description"
                      />
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                      <input
                        type="text"
                        value={d.tag}
                        onChange={(e) => {
                          const updated = [...data.assistiveDevices];
                          updated[idx] = { ...updated[idx], tag: e.target.value };
                          setData({ ...data, assistiveDevices: updated });
                        }}
                        className="admin-input"
                        placeholder="Tag (e.g. Visual Impairment)"
                      />
                      <select
                        value={d.icon}
                        onChange={(e) => {
                          const updated = [...data.assistiveDevices];
                          updated[idx] = { ...updated[idx], icon: e.target.value };
                          setData({ ...data, assistiveDevices: updated });
                        }}
                        className="admin-input"
                      >
                        <option value="eye">Eye (Visual)</option>
                        <option value="compass">Compass (Navigation)</option>
                        <option value="message-square">Message (Communication)</option>
                        <option value="activity">Activity (Mobility/Motor)</option>
                        <option value="wrench">Wrench (Daily Living)</option>
                        <option value="heart-handshake">Heart-Handshake (Community)</option>
                      </select>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Community Events & Exhibitions */}
          {activeTab === 'events' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <label className="admin-label" style={{ margin: 0 }}>Community Events & Exhibitions</label>
                <button
                  type="button"
                  onClick={() =>
                    setData({
                      ...data,
                      communityEvents: [
                        ...data.communityEvents,
                        { title: 'Event Title', badge: 'Badge', description: 'Event description', date: 'Date' } as AtlCommunityEvent,
                      ],
                    })
                  }
                  className="admin-btn admin-btn--sm admin-btn--secondary"
                >
                  <Plus size={14} /> Add Event
                </button>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {data.communityEvents.map((ev, idx) => (
                  <div key={idx} style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '0.85rem' }}>
                    <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
                      <input
                        type="text"
                        value={ev.badge}
                        onChange={(e) => {
                          const updated = [...data.communityEvents];
                          updated[idx] = { ...updated[idx], badge: e.target.value };
                          setData({ ...data, communityEvents: updated });
                        }}
                        className="admin-input"
                        style={{ fontWeight: 600, color: '#b45309' }}
                        placeholder="Badge"
                      />
                      <input
                        type="text"
                        value={ev.date}
                        onChange={(e) => {
                          const updated = [...data.communityEvents];
                          updated[idx] = { ...updated[idx], date: e.target.value };
                          setData({ ...data, communityEvents: updated });
                        }}
                        className="admin-input"
                        placeholder="Date"
                      />
                      <button
                        type="button"
                        onClick={() => setData({ ...data, communityEvents: data.communityEvents.filter((_, i) => i !== idx) })}
                        className="admin-btn-danger"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                    <div className="admin-field" style={{ marginBottom: '0.5rem' }}>
                      <input
                        type="text"
                        value={ev.title}
                        onChange={(e) => {
                          const updated = [...data.communityEvents];
                          updated[idx] = { ...updated[idx], title: e.target.value };
                          setData({ ...data, communityEvents: updated });
                        }}
                        className="admin-input"
                        style={{ fontWeight: 700 }}
                        placeholder="Event Title"
                      />
                    </div>
                    <div className="admin-field">
                      <textarea
                        rows={2}
                        value={ev.description}
                        onChange={(e) => {
                          const updated = [...data.communityEvents];
                          updated[idx] = { ...updated[idx], description: e.target.value };
                          setData({ ...data, communityEvents: updated });
                        }}
                        className="admin-textarea"
                        placeholder="Event Description"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tab 4: Team */}
          {activeTab === 'team' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {/* Dean */}
              <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '0.85rem' }}>
                <label className="admin-label">Dean / Head of Department</label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.6rem' }}>
                  <input
                    type="text"
                    placeholder="Name"
                    value={data.team.dean.name}
                    onChange={(e) =>
                      setData({
                        ...data,
                        team: { ...data.team, dean: { ...data.team.dean, name: e.target.value } },
                      })
                    }
                    className="admin-input"
                  />
                  <input
                    type="text"
                    placeholder="Designation"
                    value={data.team.dean.designation || ''}
                    onChange={(e) =>
                      setData({
                        ...data,
                        team: { ...data.team, dean: { ...data.team.dean, designation: e.target.value } },
                      })
                    }
                    className="admin-input"
                  />
                  <input
                    type="email"
                    placeholder="Email"
                    value={data.team.dean.email || ''}
                    onChange={(e) =>
                      setData({
                        ...data,
                        team: { ...data.team, dean: { ...data.team.dean, email: e.target.value } },
                      })
                    }
                    className="admin-input"
                  />
                  <input
                    type="text"
                    placeholder="Mobile"
                    value={data.team.dean.mobile || ''}
                    onChange={(e) =>
                      setData({
                        ...data,
                        team: { ...data.team, dean: { ...data.team.dean, mobile: e.target.value } },
                      })
                    }
                    className="admin-input"
                  />
                </div>
              </div>

              {/* In-Charge */}
              <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '0.85rem' }}>
                <label className="admin-label">Faculty In-Charge</label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.6rem' }}>
                  <input
                    type="text"
                    placeholder="Name"
                    value={data.team.inCharge.name}
                    onChange={(e) =>
                      setData({
                        ...data,
                        team: { ...data.team, inCharge: { ...data.team.inCharge, name: e.target.value } },
                      })
                    }
                    className="admin-input"
                  />
                  <input
                    type="text"
                    placeholder="Designation"
                    value={data.team.inCharge.designation || ''}
                    onChange={(e) =>
                      setData({
                        ...data,
                        team: { ...data.team, inCharge: { ...data.team.inCharge, designation: e.target.value } },
                      })
                    }
                    className="admin-input"
                  />
                  <input
                    type="email"
                    placeholder="Email"
                    value={data.team.inCharge.email || ''}
                    onChange={(e) =>
                      setData({
                        ...data,
                        team: { ...data.team, inCharge: { ...data.team.inCharge, email: e.target.value } },
                      })
                    }
                    className="admin-input"
                  />
                  <input
                    type="text"
                    placeholder="Mobile"
                    value={data.team.inCharge.mobile || ''}
                    onChange={(e) =>
                      setData({
                        ...data,
                        team: { ...data.team, inCharge: { ...data.team.inCharge, mobile: e.target.value } },
                      })
                    }
                    className="admin-input"
                  />
                </div>
              </div>

              {/* Faculty Members */}
              <div style={{ paddingTop: '0.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                  <label className="admin-label" style={{ margin: 0 }}>Faculty Mentors & Team</label>
                  <button
                    type="button"
                    onClick={() =>
                      setData({
                        ...data,
                        team: {
                          ...data.team,
                          facultyMembers: [
                            ...data.team.facultyMembers,
                            { name: '', designation: '', email: '', mobile: '' } as AtlMember,
                          ],
                        },
                      })
                    }
                    className="admin-btn admin-btn--sm admin-btn--secondary"
                  >
                    <Plus size={14} /> Add Faculty Member
                  </button>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {data.team.facultyMembers.map((m, idx) => (
                    <div key={idx} style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '0.85rem' }}>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.6rem' }}>
                        <input
                          type="text"
                          placeholder="Name"
                          value={m.name}
                          onChange={(e) => {
                            const updated = [...data.team.facultyMembers];
                            updated[idx] = { ...updated[idx], name: e.target.value };
                            setData({ ...data, team: { ...data.team, facultyMembers: updated } });
                          }}
                          className="admin-input"
                        />
                        <input
                          type="text"
                          placeholder="Designation"
                          value={m.designation || ''}
                          onChange={(e) => {
                            const updated = [...data.team.facultyMembers];
                            updated[idx] = { ...updated[idx], designation: e.target.value };
                            setData({ ...data, team: { ...data.team, facultyMembers: updated } });
                          }}
                          className="admin-input"
                        />
                        <input
                          type="email"
                          placeholder="Email"
                          value={m.email || ''}
                          onChange={(e) => {
                            const updated = [...data.team.facultyMembers];
                            updated[idx] = { ...updated[idx], email: e.target.value };
                            setData({ ...data, team: { ...data.team, facultyMembers: updated } });
                          }}
                          className="admin-input"
                        />
                        <input
                          type="text"
                          placeholder="Mobile"
                          value={m.mobile || ''}
                          onChange={(e) => {
                            const updated = [...data.team.facultyMembers];
                            updated[idx] = { ...updated[idx], mobile: e.target.value };
                            setData({ ...data, team: { ...data.team, facultyMembers: updated } });
                          }}
                          className="admin-input"
                        />
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
                        <button
                          type="button"
                          onClick={() => {
                            const updated = data.team.facultyMembers.filter((_, i) => i !== idx);
                            setData({ ...data, team: { ...data.team, facultyMembers: updated } });
                          }}
                          className="admin-btn-danger"
                        >
                          <Trash2 size={14} /> Remove Member
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Tab 5: Training */}
          {activeTab === 'training' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <label className="admin-label" style={{ margin: 0 }}>Annual Training & Projects</label>
                <button
                  type="button"
                  onClick={() =>
                    setData({
                      ...data,
                      trainingByYear: [
                        ...data.trainingByYear,
                        {
                          yearLabel: 'New Academic Year',
                          bridgeCourse: { headers: ['S. No.', 'Course', 'Facilitator', 'Date'], rows: [] },
                          projects: [],
                        } as AtlYearTraining,
                      ],
                    })
                  }
                  className="admin-btn admin-btn--sm admin-btn--secondary"
                >
                  <Plus size={14} /> Add Year Training
                </button>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {data.trainingByYear.map((prog, idx) => (
                  <div key={idx} style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '0.85rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                      <input
                        type="text"
                        value={prog.yearLabel}
                        onChange={(e) => {
                          const updated = [...data.trainingByYear];
                          updated[idx] = { ...updated[idx], yearLabel: e.target.value };
                          setData({ ...data, trainingByYear: updated });
                        }}
                        className="admin-input"
                        style={{ fontWeight: 700, maxWidth: '300px' }}
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const updated = data.trainingByYear.filter((_, i) => i !== idx);
                          setData({ ...data, trainingByYear: updated });
                        }}
                        className="admin-btn-danger"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                    <p className="admin-field__hint" style={{ margin: 0 }}>
                      Courses configured: {prog.bridgeCourse.rows.length} | Projects: {prog.projects.length}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Key Highlights */}
          {activeTab === 'highlights' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <label className="admin-label" style={{ margin: 0 }}>Key Highlights</label>
                <button
                  type="button"
                  onClick={() => setData({ ...data, highlightsList: [...data.highlightsList, ''] })}
                  className="admin-btn admin-btn--sm admin-btn--secondary"
                >
                  <Plus size={14} /> Add Highlight
                </button>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {data.highlightsList.map((hl, idx) => (
                  <div key={idx} style={{ display: 'flex', gap: '0.5rem' }}>
                    <input
                      type="text"
                      value={hl}
                      onChange={(e) => {
                        const updated = [...data.highlightsList];
                        updated[idx] = e.target.value;
                        setData({ ...data, highlightsList: updated });
                      }}
                      className="admin-input"
                    />
                    <button
                      type="button"
                      onClick={() => setData({ ...data, highlightsList: data.highlightsList.filter((_, i) => i !== idx) })}
                      className="admin-btn-danger"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Facilities & Equipment */}
          {activeTab === 'facilities' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <label className="admin-label" style={{ margin: 0 }}>Facilities & Equipment</label>
                <button
                  type="button"
                  onClick={() => setData({ ...data, equipmentList: [...data.equipmentList, ''] })}
                  className="admin-btn admin-btn--sm admin-btn--secondary"
                >
                  <Plus size={14} /> Add Item
                </button>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {data.equipmentList.map((eq, idx) => (
                  <div key={idx} style={{ display: 'flex', gap: '0.5rem' }}>
                    <input
                      type="text"
                      value={eq}
                      onChange={(e) => {
                        const updated = [...data.equipmentList];
                        updated[idx] = e.target.value;
                        setData({ ...data, equipmentList: updated });
                      }}
                      className="admin-input"
                    />
                    <button
                      type="button"
                      onClick={() => setData({ ...data, equipmentList: data.equipmentList.filter((_, i) => i !== idx) })}
                      className="admin-btn-danger"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tab 6: Outcomes & Events */}
          {activeTab === 'outcomes' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <label className="admin-label" style={{ margin: 0 }}>Outcomes & Events</label>
                <button
                  type="button"
                  onClick={() =>
                    setData({
                      ...data,
                      outcomes: [
                        ...data.outcomes,
                        { title: 'New Event Title', headers: ['Batch No.', 'Regd.No', 'Name', 'Department', 'Project'], batches: [] } as AtlOutcomeEvent,
                      ],
                    })
                  }
                  className="admin-btn admin-btn--sm admin-btn--secondary"
                >
                  <Plus size={14} /> Add Event
                </button>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {data.outcomes.map((ev, idx) => (
                  <div key={idx} style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '0.85rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '0.5rem' }}>
                      <input
                        type="text"
                        value={ev.title}
                        onChange={(e) => {
                          const updated = [...data.outcomes];
                          updated[idx] = { ...updated[idx], title: e.target.value };
                          setData({ ...data, outcomes: updated });
                        }}
                        className="admin-input"
                        style={{ fontWeight: 600 }}
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const updated = data.outcomes.filter((_, i) => i !== idx);
                          setData({ ...data, outcomes: updated });
                        }}
                        className="admin-btn-danger"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                    <p className="admin-field__hint" style={{ margin: '0.35rem 0 0' }}>
                      Batches configured: {ev.batches?.length || 0}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tab 7: Publications */}
          {activeTab === 'publications' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <label className="admin-label" style={{ margin: 0 }}>Journal & Conference Publications</label>
                <button
                  type="button"
                  onClick={() => setData({ ...data, publications: [...(data.publications || []), ''] })}
                  className="admin-btn admin-btn--sm admin-btn--secondary"
                >
                  <Plus size={14} /> Add Publication
                </button>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {(data.publications || []).map((pub, idx) => (
                  <div key={idx} style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-start' }}>
                    <textarea
                      rows={2}
                      className="admin-textarea"
                      value={pub}
                      onChange={(e) => {
                        const updated = [...(data.publications || [])];
                        updated[idx] = e.target.value;
                        setData({ ...data, publications: updated });
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => setData({ ...data, publications: (data.publications || []).filter((_, i) => i !== idx) })}
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
        </div>
      </div>
    </div>
  );
}
