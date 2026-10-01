import { useState, useEffect } from 'react';
import { Save, RotateCcw, Plus, Trash2, CheckCircle, Sparkles, Users, School, Layers, BookOpen, Award } from 'lucide-react';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '../../../lib/firebase';
import { useDocument } from '../../../hooks/useDocument';
import { institutionInnovationCell } from '../../Differentiators/institutionInnovationCell.data';

export type IicDoc = typeof institutionInnovationCell;

export default function IicContentAdmin() {
  const { data: remoteData, loading } = useDocument<IicDoc>('settings', 'iicContent');
  const [data, setData] = useState<IicDoc>(institutionInnovationCell);
  const [activeTab, setActiveTab] = useState<'about' | 'constitution' | 'ambassadors' | 'ecosystem' | 'atlSchools' | 'reports'>('about');
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    if (remoteData) {
      setData({
        ...institutionInnovationCell,
        ...remoteData,
        about: remoteData.about || institutionInnovationCell.about,
        vision: remoteData.vision || institutionInnovationCell.vision,
        mission: remoteData.mission || institutionInnovationCell.mission,
        journey: remoteData.journey || institutionInnovationCell.journey,
        constitution: {
          ...institutionInnovationCell.constitution,
          ...(remoteData.constitution || {}),
          chairman: remoteData.constitution?.chairman || institutionInnovationCell.constitution.chairman,
          leadership: remoteData.constitution?.leadership || institutionInnovationCell.constitution.leadership,
          coordinators: remoteData.constitution?.coordinators || institutionInnovationCell.constitution.coordinators,
        },
        ambassadors: {
          ...institutionInnovationCell.ambassadors,
          ...(remoteData.ambassadors || {}),
          roles: remoteData.ambassadors?.roles || institutionInnovationCell.ambassadors.roles,
        },
        activities: {
          ...institutionInnovationCell.activities,
          ...(remoteData.activities || {}),
          paragraphs: remoteData.activities?.paragraphs || institutionInnovationCell.activities.paragraphs,
        },
        supportsInnovation: {
          ...institutionInnovationCell.supportsInnovation,
          ...(remoteData.supportsInnovation || {}),
          items: remoteData.supportsInnovation?.items || institutionInnovationCell.supportsInnovation.items,
        },
        atalTinkeringSchools: {
          ...institutionInnovationCell.atalTinkeringSchools,
          ...(remoteData.atalTinkeringSchools || {}),
          paragraphs: remoteData.atalTinkeringSchools?.paragraphs || institutionInnovationCell.atalTinkeringSchools.paragraphs,
          schools: remoteData.atalTinkeringSchools?.schools || institutionInnovationCell.atalTinkeringSchools.schools,
        },
      });
    }
  }, [remoteData]);

  const handleSave = async () => {
    setSaving(true);
    try {
      await setDoc(doc(db, 'settings', 'iicContent'), data, { merge: true });
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch (err) {
      console.error('Failed to save IIC content:', err);
      alert('Failed to save content. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    if (confirm('Are you sure you want to reset to default content? Unsaved changes will be lost.')) {
      setData(institutionInnovationCell);
    }
  };

  if (loading) {
    return <p className="admin-loading">Loading Institution Innovation Cell content editor...</p>;
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
                Institution Innovation Cell (IIC) Page Editor
              </h2>
            </div>
            <p className="admin-field__hint" style={{ margin: '0.35rem 0 0' }}>
              Customize the About, Vision, Mission, Council Roster, Innovation Ambassadors, Support Pillars, and ATL School Mentorship entries.
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
            <CheckCircle size={16} color="#059669" />
            <span>IIC content successfully saved and published live!</span>
          </div>
        )}

        {/* Navigation Sub-Tabs */}
        <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.75rem', marginBottom: '1.5rem' }}>
          {[
            { id: 'about', label: 'About, Vision & Mission', icon: BookOpen },
            { id: 'constitution', label: 'Council Roster', icon: Users },
            { id: 'ambassadors', label: 'Innovation Ambassadors', icon: Award },
            { id: 'ecosystem', label: 'Ecosystem & Activities', icon: Layers },
            { id: 'atlSchools', label: `ATL School Mentorship (${data.atalTinkeringSchools?.schools?.length || 0})`, icon: School },
            { id: 'reports', label: 'Policy & Report Headings', icon: Sparkles },
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

        {/* TAB 1: ABOUT, VISION, MISSION */}
        {activeTab === 'about' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div className="admin-field">
              <label>About Title</label>
              <input
                type="text"
                className="admin-input"
                value={data.aboutTitle || ''}
                onChange={(e) => setData({ ...data, aboutTitle: e.target.value })}
              />
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <label className="admin-label" style={{ margin: 0 }}>About Paragraphs</label>
                <button
                  type="button"
                  onClick={() => setData({ ...data, about: [...(data.about || []), ''] })}
                  className="admin-btn admin-btn--sm admin-btn--secondary"
                >
                  <Plus size={14} /> Add Paragraph
                </button>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                {(data.about || []).map((p, idx) => (
                  <div key={idx} style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-start' }}>
                    <textarea
                      rows={2}
                      className="admin-textarea"
                      value={p}
                      onChange={(e) => {
                        const next = [...(data.about || [])];
                        next[idx] = e.target.value;
                        setData({ ...data, about: next });
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const next = (data.about || []).filter((_, i) => i !== idx);
                        setData({ ...data, about: next });
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

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem', paddingTop: '1rem', borderTop: '1px solid #e5e7eb' }}>
              {/* Vision */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                  <label className="admin-label" style={{ margin: 0 }}>Vision Points</label>
                  <button
                    type="button"
                    onClick={() => setData({ ...data, vision: [...(data.vision || []), ''] })}
                    className="admin-btn admin-btn--sm admin-btn--secondary"
                  >
                    <Plus size={14} /> Add Point
                  </button>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {(data.vision || []).map((v, idx) => (
                    <div key={idx} style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-start' }}>
                      <textarea
                        rows={2}
                        className="admin-textarea"
                        value={v}
                        onChange={(e) => {
                          const next = [...(data.vision || [])];
                          next[idx] = e.target.value;
                          setData({ ...data, vision: next });
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const next = (data.vision || []).filter((_, i) => i !== idx);
                          setData({ ...data, vision: next });
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

              {/* Mission */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                  <label className="admin-label" style={{ margin: 0 }}>Mission Points</label>
                  <button
                    type="button"
                    onClick={() => setData({ ...data, mission: [...(data.mission || []), ''] })}
                    className="admin-btn admin-btn--sm admin-btn--secondary"
                  >
                    <Plus size={14} /> Add Point
                  </button>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {(data.mission || []).map((m, idx) => (
                    <div key={idx} style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-start' }}>
                      <textarea
                        rows={2}
                        className="admin-textarea"
                        value={m}
                        onChange={(e) => {
                          const next = [...(data.mission || [])];
                          next[idx] = e.target.value;
                          setData({ ...data, mission: next });
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const next = (data.mission || []).filter((_, i) => i !== idx);
                          setData({ ...data, mission: next });
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

            {/* Journey */}
            <div style={{ paddingTop: '1rem', borderTop: '1px solid #e5e7eb' }}>
              <div className="admin-field" style={{ marginBottom: '0.75rem' }}>
                <label>Journey Section Title</label>
                <input
                  type="text"
                  className="admin-input"
                  value={data.journeyTitle || ''}
                  onChange={(e) => setData({ ...data, journeyTitle: e.target.value })}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <label className="admin-label" style={{ margin: 0 }}>Our Journey / Evolution Paragraphs</label>
                <button
                  type="button"
                  onClick={() => setData({ ...data, journey: [...(data.journey || []), ''] })}
                  className="admin-btn admin-btn--sm admin-btn--secondary"
                >
                  <Plus size={14} /> Add Paragraph
                </button>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {(data.journey || []).map((j, idx) => (
                  <div key={idx} style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-start' }}>
                    <textarea
                      rows={2}
                      className="admin-textarea"
                      value={j}
                      onChange={(e) => {
                        const next = [...(data.journey || [])];
                        next[idx] = e.target.value;
                        setData({ ...data, journey: next });
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const next = (data.journey || []).filter((_, i) => i !== idx);
                        setData({ ...data, journey: next });
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

        {/* TAB 2: CONSTITUTION & COUNCIL ROSTER */}
        {activeTab === 'constitution' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
              <div className="admin-field">
                <label>Council Title</label>
                <input
                  type="text"
                  className="admin-input"
                  value={data.constitution?.title || ''}
                  onChange={(e) => setData({ ...data, constitution: { ...data.constitution, title: e.target.value } })}
                />
              </div>
              <div className="admin-field">
                <label>Key Functionaries Sub-heading</label>
                <input
                  type="text"
                  className="admin-input"
                  value={data.constitution?.heading || ''}
                  onChange={(e) => setData({ ...data, constitution: { ...data.constitution, heading: e.target.value } })}
                />
              </div>
            </div>

            <div className="admin-field">
              <label>Constitution Intro Text</label>
              <textarea
                rows={2}
                className="admin-textarea"
                value={data.constitution?.intro || ''}
                onChange={(e) => setData({ ...data, constitution: { ...data.constitution, intro: e.target.value } })}
              />
            </div>

            {/* Chairman */}
            <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '1rem' }}>
              <label className="admin-label" style={{ marginBottom: '0.5rem' }}>Chairman</label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div className="admin-field">
                  <label>Name</label>
                  <input
                    type="text"
                    className="admin-input"
                    value={data.constitution?.chairman?.name || ''}
                    onChange={(e) =>
                      setData({
                        ...data,
                        constitution: {
                          ...data.constitution,
                          chairman: {
                            role: data.constitution?.chairman?.role || 'Chairman',
                            name: e.target.value,
                          },
                        },
                      })
                    }
                  />
                </div>
                <div className="admin-field">
                  <label>Role</label>
                  <input
                    type="text"
                    className="admin-input"
                    value={data.constitution?.chairman?.role || ''}
                    onChange={(e) =>
                      setData({
                        ...data,
                        constitution: {
                          ...data.constitution,
                          chairman: {
                            name: data.constitution?.chairman?.name || '',
                            role: e.target.value,
                          },
                        },
                      })
                    }
                  />
                </div>
              </div>
            </div>

            {/* Leadership */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <label className="admin-label" style={{ margin: 0 }}>Council Leadership</label>
                <button
                  type="button"
                  onClick={() =>
                    setData({
                      ...data,
                      constitution: {
                        ...data.constitution,
                        leadership: [
                          ...(data.constitution?.leadership || []),
                          { name: '', role: '' },
                        ],
                      },
                    })
                  }
                  className="admin-btn admin-btn--sm admin-btn--secondary"
                >
                  <Plus size={14} /> Add Leader
                </button>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                {(data.constitution?.leadership || []).map((m, idx) => (
                  <div key={idx} style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '0.75rem' }}>
                    <div style={{ flex: 1 }}>
                      <input
                        type="text"
                        placeholder="Leader Name (e.g. Dr. G. Srinivasa Rao)"
                        className="admin-input"
                        value={m.name}
                        onChange={(e) => {
                          const updated = [...(data.constitution?.leadership || [])];
                          updated[idx] = { ...updated[idx], name: e.target.value };
                          setData({ ...data, constitution: { ...data.constitution, leadership: updated } });
                        }}
                      />
                    </div>
                    <div style={{ flex: 1 }}>
                      <input
                        type="text"
                        placeholder="Role / Title (e.g. Head of the Institute (HOI))"
                        className="admin-input"
                        value={m.role}
                        onChange={(e) => {
                          const updated = [...(data.constitution?.leadership || [])];
                          updated[idx] = { ...updated[idx], role: e.target.value };
                          setData({ ...data, constitution: { ...data.constitution, leadership: updated } });
                        }}
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        const updated = (data.constitution?.leadership || []).filter((_, i) => i !== idx);
                        setData({ ...data, constitution: { ...data.constitution, leadership: updated } });
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

            {/* Coordinators */}
            <div style={{ paddingTop: '1rem', borderTop: '1px solid #e5e7eb' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <label className="admin-label" style={{ margin: 0 }}>Faculty Coordinators</label>
                <button
                  type="button"
                  onClick={() =>
                    setData({
                      ...data,
                      constitution: {
                        ...data.constitution,
                        coordinators: [
                          ...(data.constitution?.coordinators || []),
                          { name: '', role: '' },
                        ],
                      },
                    })
                  }
                  className="admin-btn admin-btn--sm admin-btn--secondary"
                >
                  <Plus size={14} /> Add Coordinator
                </button>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                {(data.constitution?.coordinators || []).map((m, idx) => (
                  <div key={idx} style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '0.75rem' }}>
                    <div style={{ flex: 1 }}>
                      <input
                        type="text"
                        placeholder="Coordinator Name (e.g. Dr. V.V.R. Maheswara Rao)"
                        className="admin-input"
                        value={m.name}
                        onChange={(e) => {
                          const updated = [...(data.constitution?.coordinators || [])];
                          updated[idx] = { ...updated[idx], name: e.target.value };
                          setData({ ...data, constitution: { ...data.constitution, coordinators: updated } });
                        }}
                      />
                    </div>
                    <div style={{ flex: 1 }}>
                      <input
                        type="text"
                        placeholder="Coordinator Role (e.g. NIRF Coordinator)"
                        className="admin-input"
                        value={m.role}
                        onChange={(e) => {
                          const updated = [...(data.constitution?.coordinators || [])];
                          updated[idx] = { ...updated[idx], role: e.target.value };
                          setData({ ...data, constitution: { ...data.constitution, coordinators: updated } });
                        }}
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        const updated = (data.constitution?.coordinators || []).filter((_, i) => i !== idx);
                        setData({ ...data, constitution: { ...data.constitution, coordinators: updated } });
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

        {/* TAB 3: INNOVATION AMBASSADORS */}
        {activeTab === 'ambassadors' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
              <div className="admin-field">
                <label>Ambassadors Section Title</label>
                <input
                  type="text"
                  className="admin-input"
                  value={data.ambassadors?.title || ''}
                  onChange={(e) => setData({ ...data, ambassadors: { ...data.ambassadors, title: e.target.value } })}
                />
              </div>
              <div className="admin-field">
                <label>Roles Sub-heading</label>
                <input
                  type="text"
                  className="admin-input"
                  value={data.ambassadors?.rolesTitle || ''}
                  onChange={(e) => setData({ ...data, ambassadors: { ...data.ambassadors, rolesTitle: e.target.value } })}
                />
              </div>
            </div>

            <div className="admin-field">
              <label>Introductory Paragraph</label>
              <textarea
                rows={2}
                className="admin-textarea"
                value={data.ambassadors?.intro || ''}
                onChange={(e) => setData({ ...data, ambassadors: { ...data.ambassadors, intro: e.target.value } })}
              />
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <label className="admin-label" style={{ margin: 0 }}>Ambassador Roles & Responsibilities</label>
                <button
                  type="button"
                  onClick={() =>
                    setData({
                      ...data,
                      ambassadors: {
                        ...data.ambassadors,
                        roles: [...(data.ambassadors?.roles || []), ''],
                      },
                    })
                  }
                  className="admin-btn admin-btn--sm admin-btn--secondary"
                >
                  <Plus size={14} /> Add Role
                </button>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {(data.ambassadors?.roles || []).map((role, idx) => (
                  <div key={idx} style={{ display: 'flex', gap: '0.5rem' }}>
                    <input
                      type="text"
                      className="admin-input"
                      value={role}
                      onChange={(e) => {
                        const updated = [...(data.ambassadors?.roles || [])];
                        updated[idx] = e.target.value;
                        setData({ ...data, ambassadors: { ...data.ambassadors, roles: updated } });
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const updated = (data.ambassadors?.roles || []).filter((_, i) => i !== idx);
                        setData({ ...data, ambassadors: { ...data.ambassadors, roles: updated } });
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

        {/* TAB 4: ECOSYSTEM & ACTIVITIES */}
        {activeTab === 'ecosystem' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div>
              <div className="admin-field" style={{ marginBottom: '0.75rem' }}>
                <label>Support Pillars Section Title</label>
                <input
                  type="text"
                  className="admin-input"
                  value={data.supportsInnovation?.title || ''}
                  onChange={(e) =>
                    setData({
                      ...data,
                      supportsInnovation: { ...data.supportsInnovation, title: e.target.value },
                    })
                  }
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <label className="admin-label" style={{ margin: 0 }}>Support Pillars (Title & Description)</label>
                <button
                  type="button"
                  onClick={() =>
                    setData({
                      ...data,
                      supportsInnovation: {
                        ...data.supportsInnovation,
                        items: [
                          ...(data.supportsInnovation?.items || []),
                          { title: '', description: '' },
                        ],
                      },
                    })
                  }
                  className="admin-btn admin-btn--sm admin-btn--secondary"
                >
                  <Plus size={14} /> Add Pillar
                </button>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {(data.supportsInnovation?.items || []).map((item, idx) => (
                  <div key={idx} style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '0.85rem' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                      <div className="admin-field">
                        <label>Pillar Title</label>
                        <input
                          type="text"
                          className="admin-input"
                          value={item.title}
                          onChange={(e) => {
                            const updated = [...(data.supportsInnovation?.items || [])];
                            updated[idx] = { ...updated[idx], title: e.target.value };
                            setData({ ...data, supportsInnovation: { ...data.supportsInnovation, items: updated } });
                          }}
                        />
                      </div>
                      <div className="admin-field">
                        <label>Description</label>
                        <textarea
                          rows={2}
                          className="admin-textarea"
                          value={item.description}
                          onChange={(e) => {
                            const updated = [...(data.supportsInnovation?.items || [])];
                            updated[idx] = { ...updated[idx], description: e.target.value };
                            setData({ ...data, supportsInnovation: { ...data.supportsInnovation, items: updated } });
                          }}
                        />
                      </div>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
                      <button
                        type="button"
                        onClick={() => {
                          const updated = (data.supportsInnovation?.items || []).filter((_, i) => i !== idx);
                          setData({ ...data, supportsInnovation: { ...data.supportsInnovation, items: updated } });
                        }}
                        className="admin-btn-danger"
                      >
                        <Trash2 size={14} /> Remove Pillar
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ paddingTop: '1rem', borderTop: '1px solid #e5e7eb' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem', marginBottom: '0.75rem' }}>
                <div className="admin-field">
                  <label>Activities Section Title</label>
                  <input
                    type="text"
                    className="admin-input"
                    value={data.activities?.title || ''}
                    onChange={(e) => setData({ ...data, activities: { ...data.activities, title: e.target.value } })}
                  />
                </div>
                <div className="admin-field">
                  <label>Activities Sub-heading</label>
                  <input
                    type="text"
                    className="admin-input"
                    value={data.activities?.subheading || ''}
                    onChange={(e) => setData({ ...data, activities: { ...data.activities, subheading: e.target.value } })}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <label className="admin-label" style={{ margin: 0 }}>Activities Paragraphs</label>
                <button
                  type="button"
                  onClick={() =>
                    setData({
                      ...data,
                      activities: {
                        ...data.activities,
                        paragraphs: [...(data.activities?.paragraphs || []), ''],
                      },
                    })
                  }
                  className="admin-btn admin-btn--sm admin-btn--secondary"
                >
                  <Plus size={14} /> Add Paragraph
                </button>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {(data.activities?.paragraphs || []).map((p, idx) => (
                  <div key={idx} style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-start' }}>
                    <textarea
                      rows={2}
                      className="admin-textarea"
                      value={p}
                      onChange={(e) => {
                        const updated = [...(data.activities?.paragraphs || [])];
                        updated[idx] = e.target.value;
                        setData({ ...data, activities: { ...data.activities, paragraphs: updated } });
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const updated = (data.activities?.paragraphs || []).filter((_, i) => i !== idx);
                        setData({ ...data, activities: { ...data.activities, paragraphs: updated } });
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

        {/* TAB 5: ATL SCHOOLS */}
        {activeTab === 'atlSchools' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
              <div className="admin-field">
                <label>ATL Section Title</label>
                <input
                  type="text"
                  className="admin-input"
                  value={data.atalTinkeringSchools?.title || ''}
                  onChange={(e) =>
                    setData({
                      ...data,
                      atalTinkeringSchools: { ...data.atalTinkeringSchools, title: e.target.value },
                    })
                  }
                />
              </div>
              <div className="admin-field">
                <label>List Heading</label>
                <input
                  type="text"
                  className="admin-input"
                  value={data.atalTinkeringSchools?.listHeading || ''}
                  onChange={(e) =>
                    setData({
                      ...data,
                      atalTinkeringSchools: { ...data.atalTinkeringSchools, listHeading: e.target.value },
                    })
                  }
                />
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <label className="admin-label" style={{ margin: 0 }}>ATL School Mentorship Paragraphs</label>
                <button
                  type="button"
                  onClick={() =>
                    setData({
                      ...data,
                      atalTinkeringSchools: {
                        ...data.atalTinkeringSchools,
                        paragraphs: [...(data.atalTinkeringSchools?.paragraphs || []), ''],
                      },
                    })
                  }
                  className="admin-btn admin-btn--sm admin-btn--secondary"
                >
                  <Plus size={14} /> Add Paragraph
                </button>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {(data.atalTinkeringSchools?.paragraphs || []).map((p, idx) => (
                  <div key={idx} style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-start' }}>
                    <textarea
                      rows={2}
                      className="admin-textarea"
                      value={p}
                      onChange={(e) => {
                        const updated = [...(data.atalTinkeringSchools?.paragraphs || [])];
                        updated[idx] = e.target.value;
                        setData({ ...data, atalTinkeringSchools: { ...data.atalTinkeringSchools, paragraphs: updated } });
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const updated = (data.atalTinkeringSchools?.paragraphs || []).filter((_, i) => i !== idx);
                        setData({ ...data, atalTinkeringSchools: { ...data.atalTinkeringSchools, paragraphs: updated } });
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

            <div style={{ paddingTop: '1rem', borderTop: '1px solid #e5e7eb' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                <label className="admin-label" style={{ margin: 0 }}>Mentored Schools List</label>
                <button
                  type="button"
                  onClick={() => {
                    const schools = data.atalTinkeringSchools?.schools || [];
                    const nextSno = schools.length > 0 ? Math.max(...schools.map((s) => s.sno || 0)) + 1 : 1;
                    setData({
                      ...data,
                      atalTinkeringSchools: {
                        ...data.atalTinkeringSchools,
                        schools: [
                          ...schools,
                          {
                            sno: nextSno,
                            schoolCode: '',
                            schoolName: '',
                            address: '',
                            email: '',
                            mobile: '',
                            coordinator: '',
                          },
                        ],
                      },
                    });
                  }}
                  className="admin-btn admin-btn--sm admin-btn--secondary"
                >
                  <Plus size={14} /> Add School
                </button>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {(data.atalTinkeringSchools?.schools || []).map((sch, idx) => (
                  <div key={idx} style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '0.85rem' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '0.6rem' }}>
                      <div className="admin-field">
                        <label>School Name</label>
                        <input
                          type="text"
                          className="admin-input"
                          value={sch.schoolName}
                          onChange={(e) => {
                            const updated = [...(data.atalTinkeringSchools?.schools || [])];
                            updated[idx] = { ...updated[idx], schoolName: e.target.value };
                            setData({ ...data, atalTinkeringSchools: { ...data.atalTinkeringSchools, schools: updated } });
                          }}
                        />
                      </div>
                      <div className="admin-field">
                        <label>School Code</label>
                        <input
                          type="text"
                          className="admin-input"
                          value={sch.schoolCode}
                          onChange={(e) => {
                            const updated = [...(data.atalTinkeringSchools?.schools || [])];
                            updated[idx] = { ...updated[idx], schoolCode: e.target.value };
                            setData({ ...data, atalTinkeringSchools: { ...data.atalTinkeringSchools, schools: updated } });
                          }}
                        />
                      </div>
                      <div className="admin-field">
                        <label>Coordinator / Mentor</label>
                        <input
                          type="text"
                          className="admin-input"
                          value={sch.coordinator}
                          onChange={(e) => {
                            const updated = [...(data.atalTinkeringSchools?.schools || [])];
                            updated[idx] = { ...updated[idx], coordinator: e.target.value };
                            setData({ ...data, atalTinkeringSchools: { ...data.atalTinkeringSchools, schools: updated } });
                          }}
                        />
                      </div>
                      <div className="admin-field">
                        <label>Mobile</label>
                        <input
                          type="text"
                          className="admin-input"
                          value={sch.mobile}
                          onChange={(e) => {
                            const updated = [...(data.atalTinkeringSchools?.schools || [])];
                            updated[idx] = { ...updated[idx], mobile: e.target.value };
                            setData({ ...data, atalTinkeringSchools: { ...data.atalTinkeringSchools, schools: updated } });
                          }}
                        />
                      </div>
                      <div className="admin-field">
                        <label>Email</label>
                        <input
                          type="email"
                          className="admin-input"
                          value={sch.email}
                          onChange={(e) => {
                            const updated = [...(data.atalTinkeringSchools?.schools || [])];
                            updated[idx] = { ...updated[idx], email: e.target.value };
                            setData({ ...data, atalTinkeringSchools: { ...data.atalTinkeringSchools, schools: updated } });
                          }}
                        />
                      </div>
                      <div className="admin-field">
                        <label>Address</label>
                        <input
                          type="text"
                          className="admin-input"
                          value={sch.address}
                          onChange={(e) => {
                            const updated = [...(data.atalTinkeringSchools?.schools || [])];
                            updated[idx] = { ...updated[idx], address: e.target.value };
                            setData({ ...data, atalTinkeringSchools: { ...data.atalTinkeringSchools, schools: updated } });
                          }}
                        />
                      </div>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
                      <button
                        type="button"
                        onClick={() => {
                          const updated = (data.atalTinkeringSchools?.schools || []).filter((_, i) => i !== idx);
                          setData({ ...data, atalTinkeringSchools: { ...data.atalTinkeringSchools, schools: updated } });
                        }}
                        className="admin-btn-danger"
                      >
                        <Trash2 size={14} /> Remove School
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 6: POLICY & REPORT HEADINGS */}
        {activeTab === 'reports' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '1rem' }}>
              <label className="admin-label" style={{ marginBottom: '0.5rem' }}>NISP Policy Section</label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div className="admin-field">
                  <label>Heading</label>
                  <input
                    type="text"
                    className="admin-input"
                    value={data.nisp?.heading || ''}
                    onChange={(e) => setData({ ...data, nisp: { ...data.nisp, heading: e.target.value } })}
                  />
                </div>
                <div className="admin-field">
                  <label>Subheading</label>
                  <input
                    type="text"
                    className="admin-input"
                    value={data.nisp?.subheading || ''}
                    onChange={(e) => setData({ ...data, nisp: { ...data.nisp, subheading: e.target.value } })}
                  />
                </div>
              </div>
            </div>

            <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '1rem' }}>
              <label className="admin-label" style={{ marginBottom: '0.5rem' }}>Recognition & Rating Section</label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div className="admin-field">
                  <label>Heading</label>
                  <input
                    type="text"
                    className="admin-input"
                    value={data.rating?.heading || ''}
                    onChange={(e) => setData({ ...data, rating: { ...data.rating, heading: e.target.value } })}
                  />
                </div>
                <div className="admin-field">
                  <label>Subheading</label>
                  <input
                    type="text"
                    className="admin-input"
                    value={data.rating?.subheading || ''}
                    onChange={(e) => setData({ ...data, rating: { ...data.rating, subheading: e.target.value } })}
                  />
                </div>
              </div>
            </div>

            <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '1rem' }}>
              <label className="admin-label" style={{ marginBottom: '0.5rem' }}>Annual Reports Section</label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div className="admin-field">
                  <label>Heading</label>
                  <input
                    type="text"
                    className="admin-input"
                    value={data.annualReports?.heading || ''}
                    onChange={(e) => setData({ ...data, annualReports: { ...data.annualReports, heading: e.target.value } })}
                  />
                </div>
                <div className="admin-field">
                  <label>Subheading</label>
                  <input
                    type="text"
                    className="admin-input"
                    value={data.annualReports?.subheading || ''}
                    onChange={(e) => setData({ ...data, annualReports: { ...data.annualReports, subheading: e.target.value } })}
                  />
                </div>
              </div>
            </div>

            <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '1rem' }}>
              <label className="admin-label" style={{ marginBottom: '0.5rem' }}>Smart India Hackathon (SIH) Section</label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div className="admin-field">
                  <label>Heading</label>
                  <input
                    type="text"
                    className="admin-input"
                    value={data.sih?.heading || ''}
                    onChange={(e) => setData({ ...data, sih: { ...data.sih, heading: e.target.value } })}
                  />
                </div>
                <div className="admin-field">
                  <label>Subheading</label>
                  <input
                    type="text"
                    className="admin-input"
                    value={data.sih?.subheading || ''}
                    onChange={(e) => setData({ ...data, sih: { ...data.sih, subheading: e.target.value } })}
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
