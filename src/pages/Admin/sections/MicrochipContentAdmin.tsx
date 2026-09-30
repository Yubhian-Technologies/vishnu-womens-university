import { useEffect, useState } from 'react';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../../lib/firebase';
import { useDocument } from '../../../hooks/useDocument';
import { microchipEmbedded } from '../../Differentiators/microchipEmbedded.data';

export interface CustomMicrochipSection {
  id: string;
  title: string;
  badge?: string;
  paragraphs?: string[];
  bulletPoints?: string[];
}

export interface MicrochipDoc {
  hero?: {
    category?: string;
    title?: string;
    subtitle?: string;
  };
  about?: {
    title?: string;
    paragraphs?: string[];
  };
  vision?: {
    title?: string;
    statement?: string;
  };
  mission?: {
    title?: string;
    intro?: string;
    points?: string[];
  };
  learningAreas?: {
    number: string;
    title: string;
    description: string;
  }[];
  trainingAndActivities?: {
    title?: string;
    programmeName?: string;
    description?: string;
  };
  programmeOutcome?: {
    title?: string;
    description?: string;
  };
  technicalHighlights?: {
    title?: string;
    items?: string[];
  };
  facilities?: {
    title?: string;
    intro?: string;
    items?: string[];
  };
  learningPartners?: {
    title?: string;
    partners?: { name: string; description: string }[];
  };
  additionalSections?: CustomMicrochipSection[];
}

const DEFAULT_STATE: MicrochipDoc = {
  hero: { ...microchipEmbedded.hero },
  about: {
    title: microchipEmbedded.about.title,
    paragraphs: [...microchipEmbedded.about.paragraphs],
  },
  vision: { ...microchipEmbedded.vision },
  mission: {
    title: microchipEmbedded.mission.title,
    intro: microchipEmbedded.mission.intro,
    points: [...microchipEmbedded.mission.points],
  },
  learningAreas: microchipEmbedded.learningAreas.map((l) => ({ ...l })),
  trainingAndActivities: { ...microchipEmbedded.trainingAndActivities },
  programmeOutcome: { ...microchipEmbedded.programmeOutcome },
  technicalHighlights: {
    title: microchipEmbedded.technicalHighlights.title,
    items: [...microchipEmbedded.technicalHighlights.items],
  },
  facilities: {
    title: microchipEmbedded.facilities.title,
    intro: microchipEmbedded.facilities.intro,
    items: [...microchipEmbedded.facilities.items],
  },
  learningPartners: {
    title: microchipEmbedded.learningPartners.title,
    partners: microchipEmbedded.learningPartners.partners.map((p) => ({ ...p })),
  },
  additionalSections: [],
};

type ActiveSubSection =
  | 'overview'
  | 'vision'
  | 'learning-areas'
  | 'training-outcome'
  | 'highlights-facilities'
  | 'partners'
  | 'custom-sections';

export default function MicrochipContentAdmin() {
  const { data, loading } = useDocument<MicrochipDoc>('settings', 'microchipEmbedded');
  const [form, setForm] = useState<MicrochipDoc>(DEFAULT_STATE);
  const [hasInitialized, setHasInitialized] = useState(false);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<ActiveSubSection>('overview');

  useEffect(() => {
    if (!loading && !hasInitialized) {
      if (data) {
        setForm({
          hero: { ...DEFAULT_STATE.hero, ...data.hero },
          about: {
            title: data.about?.title || DEFAULT_STATE.about?.title,
            paragraphs: data.about?.paragraphs && data.about.paragraphs.length > 0 ? data.about.paragraphs : DEFAULT_STATE.about?.paragraphs,
          },
          vision: { ...DEFAULT_STATE.vision, ...data.vision },
          mission: {
            title: data.mission?.title || DEFAULT_STATE.mission?.title,
            intro: data.mission?.intro || DEFAULT_STATE.mission?.intro,
            points: data.mission?.points && data.mission.points.length > 0 ? data.mission.points : DEFAULT_STATE.mission?.points,
          },
          learningAreas: data.learningAreas && data.learningAreas.length > 0 ? data.learningAreas : DEFAULT_STATE.learningAreas,
          trainingAndActivities: { ...DEFAULT_STATE.trainingAndActivities, ...data.trainingAndActivities },
          programmeOutcome: { ...DEFAULT_STATE.programmeOutcome, ...data.programmeOutcome },
          technicalHighlights: {
            title: data.technicalHighlights?.title || DEFAULT_STATE.technicalHighlights?.title,
            items: data.technicalHighlights?.items && data.technicalHighlights.items.length > 0 ? data.technicalHighlights.items : DEFAULT_STATE.technicalHighlights?.items,
          },
          facilities: {
            title: data.facilities?.title || DEFAULT_STATE.facilities?.title,
            intro: data.facilities?.intro || DEFAULT_STATE.facilities?.intro,
            items: data.facilities?.items && data.facilities.items.length > 0 ? data.facilities.items : DEFAULT_STATE.facilities?.items,
          },
          learningPartners: {
            title: data.learningPartners?.title || DEFAULT_STATE.learningPartners?.title,
            partners: data.learningPartners?.partners && data.learningPartners.partners.length > 0 ? data.learningPartners.partners : DEFAULT_STATE.learningPartners?.partners,
          },
          additionalSections: data.additionalSections || [],
        });
      }
      setHasInitialized(true);
    }
  }, [data, loading, hasInitialized]);

  const save = async () => {
    setSaving(true);
    try {
      await setDoc(doc(db, 'settings', 'microchipEmbedded'), {
        ...form,
        updatedAt: serverTimestamp(),
      }, { merge: true });
      alert('Microchip Embedded Systems Centre content updated successfully!');
    } catch (e) {
      alert(`Couldn't save: ${(e as Error).message}`);
    } finally {
      setSaving(false);
    }
  };

  const resetToDefaults = () => {
    if (confirm('Reset all Microchip Centre text to default starting values? You can still edit before saving.')) {
      setForm(DEFAULT_STATE);
    }
  };

  return (
    <div style={{ background: '#fff', borderRadius: '12px', border: '1px solid #E2E8F0', padding: '1.5rem', marginTop: '1.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem', borderBottom: '1px solid #E2E8F0', paddingBottom: '1rem' }}>
        <div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0B1E42', margin: 0 }}>
            Microchip Embedded Systems Centre — All Page Content & Sections
          </h2>
          <p style={{ fontSize: '0.85rem', color: '#64748B', margin: '0.25rem 0 0 0' }}>
            Edit all texts, vision/mission, learning areas, training outcomes, technical highlights, facilities, and partners.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button type="button" onClick={resetToDefaults} className="admin-btn-secondary" style={{ fontSize: '0.8rem', padding: '0.45rem 0.85rem' }}>
            Reset to Defaults
          </button>
          <button type="button" onClick={save} disabled={saving} className="admin-btn-primary" style={{ fontSize: '0.8rem', padding: '0.45rem 1.1rem', background: '#008080', borderColor: '#008080' }}>
            {saving ? 'Saving...' : 'Save Microchip Content'}
          </button>
        </div>
      </div>

      {/* Subtabs Navigation */}
      <div style={{ display: 'flex', gap: '0.4rem', overflowX: 'auto', paddingBottom: '0.75rem', marginBottom: '1.5rem', borderBottom: '2px solid #F1F5F9' }}>
        {[
          { key: 'overview', label: '1. Overview & Hero' },
          { key: 'vision', label: '2. Vision & Mission' },
          { key: 'learning-areas', label: '3. Learning Areas' },
          { key: 'training-outcome', label: '4. Training & Outcomes' },
          { key: 'highlights-facilities', label: '5. Highlights & Facilities' },
          { key: 'partners', label: '6. Learning Partners' },
          { key: 'custom-sections', label: '7. Custom Extra Sections' },
        ].map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => setActiveTab(tab.key as ActiveSubSection)}
            style={{
              padding: '0.45rem 0.9rem',
              fontSize: '0.825rem',
              fontWeight: 700,
              borderRadius: '6px',
              border: 'none',
              background: activeTab === tab.key ? '#0B1E42' : '#F1F5F9',
              color: activeTab === tab.key ? '#fff' : '#475569',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* TAB 1: OVERVIEW & HERO */}
      {activeTab === 'overview' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div>
            <label className="admin-label">Hero Subtitle</label>
            <textarea
              className="admin-textarea"
              rows={2}
              value={form.hero?.subtitle || ''}
              onChange={(e) => setForm((p) => ({ ...p, hero: { ...p.hero, subtitle: e.target.value } }))}
            />
          </div>
          <div>
            <label className="admin-label">About Card Heading</label>
            <input
              type="text"
              className="admin-input"
              value={form.about?.title || ''}
              onChange={(e) => setForm((p) => ({ ...p, about: { ...p.about, title: e.target.value } }))}
            />
          </div>
          <div>
            <label className="admin-label">About Paragraphs</label>
            {(form.about?.paragraphs || []).map((para, idx) => (
              <div key={idx} style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <textarea
                  className="admin-textarea"
                  rows={3}
                  value={para}
                  onChange={(e) => {
                    const list = [...(form.about?.paragraphs || [])];
                    list[idx] = e.target.value;
                    setForm((p) => ({ ...p, about: { ...p.about, paragraphs: list } }));
                  }}
                />
                <button
                  type="button"
                  onClick={() => {
                    const list = (form.about?.paragraphs || []).filter((_, i) => i !== idx);
                    setForm((p) => ({ ...p, about: { ...p.about, paragraphs: list } }));
                  }}
                  className="admin-btn-danger"
                  style={{ alignSelf: 'flex-start' }}
                >
                  ✕
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => setForm((p) => ({ ...p, about: { ...p.about, paragraphs: [...(p.about?.paragraphs || []), ''] } }))}
              className="admin-btn-secondary"
              style={{ fontSize: '0.8rem' }}
            >
              + Add Paragraph
            </button>
          </div>
        </div>
      )}

      {/* TAB 2: VISION & MISSION */}
      {activeTab === 'vision' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div>
            <label className="admin-label">Vision Statement</label>
            <textarea
              className="admin-textarea"
              rows={3}
              value={form.vision?.statement || ''}
              onChange={(e) => setForm((p) => ({ ...p, vision: { ...p.vision, statement: e.target.value } }))}
            />
          </div>
          <div>
            <label className="admin-label">Mission Introduction</label>
            <input
              type="text"
              className="admin-input"
              value={form.mission?.intro || ''}
              onChange={(e) => setForm((p) => ({ ...p, mission: { ...p.mission, intro: e.target.value } }))}
            />
          </div>
          <div>
            <label className="admin-label">Mission Points</label>
            {(form.mission?.points || []).map((pt, idx) => (
              <div key={idx} style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <input
                  type="text"
                  className="admin-input"
                  value={pt}
                  onChange={(e) => {
                    const list = [...(form.mission?.points || [])];
                    list[idx] = e.target.value;
                    setForm((p) => ({ ...p, mission: { ...p.mission, points: list } }));
                  }}
                />
                <button
                  type="button"
                  onClick={() => {
                    const list = (form.mission?.points || []).filter((_, i) => i !== idx);
                    setForm((p) => ({ ...p, mission: { ...p.mission, points: list } }));
                  }}
                  className="admin-btn-danger"
                >
                  ✕
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => setForm((p) => ({ ...p, mission: { ...p.mission, points: [...(p.mission?.points || []), ''] } }))}
              className="admin-btn-secondary"
              style={{ fontSize: '0.8rem' }}
            >
              + Add Mission Point
            </button>
          </div>
        </div>
      )}

      {/* TAB 3: LEARNING AREAS */}
      {activeTab === 'learning-areas' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {(form.learningAreas || []).map((area, idx) => (
            <div key={idx} style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '8px', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '80px 1fr', gap: '0.75rem' }}>
                <div>
                  <label className="admin-label">Number</label>
                  <input
                    type="text"
                    className="admin-input"
                    value={area.number}
                    onChange={(e) => {
                      const list = [...(form.learningAreas || [])];
                      list[idx] = { ...list[idx], number: e.target.value };
                      setForm((p) => ({ ...p, learningAreas: list }));
                    }}
                  />
                </div>
                <div>
                  <label className="admin-label">Area Title</label>
                  <input
                    type="text"
                    className="admin-input"
                    value={area.title}
                    onChange={(e) => {
                      const list = [...(form.learningAreas || [])];
                      list[idx] = { ...list[idx], title: e.target.value };
                      setForm((p) => ({ ...p, learningAreas: list }));
                    }}
                  />
                </div>
              </div>
              <div>
                <label className="admin-label">Description</label>
                <textarea
                  className="admin-textarea"
                  rows={2}
                  value={area.description}
                  onChange={(e) => {
                    const list = [...(form.learningAreas || [])];
                    list[idx] = { ...list[idx], description: e.target.value };
                    setForm((p) => ({ ...p, learningAreas: list }));
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB 4: TRAINING & OUTCOMES */}
      {activeTab === 'training-outcome' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div style={{ background: '#F8FAFC', padding: '1rem', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
            <h4 style={{ margin: '0 0 0.75rem 0', fontWeight: 800, color: '#0B1E42' }}>
              {form.trainingAndActivities?.title || 'Training & Activities'}
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              <div>
                <label className="admin-label">Programme Name</label>
                <input
                  type="text"
                  className="admin-input"
                  value={form.trainingAndActivities?.programmeName || ''}
                  onChange={(e) => setForm((p) => ({ ...p, trainingAndActivities: { ...p.trainingAndActivities, programmeName: e.target.value } }))}
                />
              </div>
              <div>
                <label className="admin-label">Description</label>
                <textarea
                  className="admin-textarea"
                  rows={3}
                  value={form.trainingAndActivities?.description || ''}
                  onChange={(e) => setForm((p) => ({ ...p, trainingAndActivities: { ...p.trainingAndActivities, description: e.target.value } }))}
                />
              </div>
            </div>
          </div>

          <div style={{ background: '#F8FAFC', padding: '1rem', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
            <h4 style={{ margin: '0 0 0.75rem 0', fontWeight: 800, color: '#0B1E42' }}>
              {form.programmeOutcome?.title || 'Programme Outcome'}
            </h4>
            <div>
              <label className="admin-label">Outcome Description</label>
              <textarea
                className="admin-textarea"
                rows={3}
                value={form.programmeOutcome?.description || ''}
                onChange={(e) => setForm((p) => ({ ...p, programmeOutcome: { ...p.programmeOutcome, description: e.target.value } }))}
              />
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: HIGHLIGHTS & FACILITIES */}
      {activeTab === 'highlights-facilities' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div>
            <label className="admin-label">Technical Highlights</label>
            {(form.technicalHighlights?.items || []).map((item, idx) => (
              <div key={idx} style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.4rem' }}>
                <input
                  type="text"
                  className="admin-input"
                  value={item}
                  onChange={(e) => {
                    const list = [...(form.technicalHighlights?.items || [])];
                    list[idx] = e.target.value;
                    setForm((p) => ({ ...p, technicalHighlights: { ...p.technicalHighlights, items: list } }));
                  }}
                />
                <button
                  type="button"
                  onClick={() => {
                    const list = (form.technicalHighlights?.items || []).filter((_, i) => i !== idx);
                    setForm((p) => ({ ...p, technicalHighlights: { ...p.technicalHighlights, items: list } }));
                  }}
                  className="admin-btn-danger"
                >
                  ✕
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => setForm((p) => ({ ...p, technicalHighlights: { ...p.technicalHighlights, items: [...(p.technicalHighlights?.items || []), ''] } }))}
              className="admin-btn-secondary"
              style={{ fontSize: '0.8rem' }}
            >
              + Add Highlight
            </button>
          </div>

          <div>
            <label className="admin-label">Facilities & Development Resources</label>
            {(form.facilities?.items || []).map((item, idx) => (
              <div key={idx} style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.4rem' }}>
                <input
                  type="text"
                  className="admin-input"
                  value={item}
                  onChange={(e) => {
                    const list = [...(form.facilities?.items || [])];
                    list[idx] = e.target.value;
                    setForm((p) => ({ ...p, facilities: { ...p.facilities, items: list } }));
                  }}
                />
                <button
                  type="button"
                  onClick={() => {
                    const list = (form.facilities?.items || []).filter((_, i) => i !== idx);
                    setForm((p) => ({ ...p, facilities: { ...p.facilities, items: list } }));
                  }}
                  className="admin-btn-danger"
                >
                  ✕
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => setForm((p) => ({ ...p, facilities: { ...p.facilities, items: [...(p.facilities?.items || []), ''] } }))}
              className="admin-btn-secondary"
              style={{ fontSize: '0.8rem' }}
            >
              + Add Facility Item
            </button>
          </div>
        </div>
      )}

      {/* TAB 6: PARTNERS */}
      {activeTab === 'partners' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {(form.learningPartners?.partners || []).map((partner, idx) => (
            <div key={idx} style={{ background: '#F8FAFC', padding: '1rem', borderRadius: '8px', border: '1px solid #E2E8F0', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              <div>
                <label className="admin-label">Partner Name</label>
                <input
                  type="text"
                  className="admin-input"
                  value={partner.name}
                  onChange={(e) => {
                    const list = [...(form.learningPartners?.partners || [])];
                    list[idx] = { ...list[idx], name: e.target.value };
                    setForm((p) => ({ ...p, learningPartners: { ...p.learningPartners, partners: list } }));
                  }}
                />
              </div>
              <div>
                <label className="admin-label">Description</label>
                <textarea
                  className="admin-textarea"
                  rows={2}
                  value={partner.description}
                  onChange={(e) => {
                    const list = [...(form.learningPartners?.partners || [])];
                    list[idx] = { ...list[idx], description: e.target.value };
                    setForm((p) => ({ ...p, learningPartners: { ...p.learningPartners, partners: list } }));
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB 7: CUSTOM SECTIONS */}
      {activeTab === 'custom-sections' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h4 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 800, color: '#0B1E42' }}>
              Custom Additional Sections
            </h4>
            <button
              type="button"
              onClick={() => {
                const newId = `section-${Date.now()}`;
                setForm((p) => ({
                  ...p,
                  additionalSections: [
                    ...(p.additionalSections || []),
                    {
                      id: newId,
                      title: 'New Section',
                      badge: 'Microchip Initiative',
                      paragraphs: ['Write section content here...'],
                      bulletPoints: [],
                    },
                  ],
                }));
              }}
              className="admin-btn-secondary"
              style={{ fontSize: '0.8rem' }}
            >
              + Add Section
            </button>
          </div>

          {(form.additionalSections || []).length === 0 ? (
            <div style={{ padding: '1.5rem', background: '#F8FAFC', borderRadius: '8px', textAlign: 'center', color: '#64748B', fontSize: '0.85rem' }}>
              No extra custom sections created yet. Click "+ Add Section" to add new blocks.
            </div>
          ) : (
            (form.additionalSections || []).map((sec, idx) => (
              <div key={sec.id} style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '8px', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontWeight: 800, fontSize: '0.85rem', color: '#0B1E42' }}>Section #{idx + 1}</span>
                  <button
                    type="button"
                    onClick={() => {
                      setForm((p) => ({
                        ...p,
                        additionalSections: (p.additionalSections || []).filter((_, i) => i !== idx),
                      }));
                    }}
                    className="admin-btn-danger"
                  >
                    Delete Section
                  </button>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                  <div>
                    <label className="admin-label">Section Title</label>
                    <input
                      type="text"
                      className="admin-input"
                      value={sec.title}
                      onChange={(e) => {
                        const list = [...(form.additionalSections || [])];
                        list[idx] = { ...list[idx], title: e.target.value };
                        setForm((p) => ({ ...p, additionalSections: list }));
                      }}
                    />
                  </div>
                  <div>
                    <label className="admin-label">Badge Label</label>
                    <input
                      type="text"
                      className="admin-input"
                      value={sec.badge || ''}
                      onChange={(e) => {
                        const list = [...(form.additionalSections || [])];
                        list[idx] = { ...list[idx], badge: e.target.value };
                        setForm((p) => ({ ...p, additionalSections: list }));
                      }}
                    />
                  </div>
                </div>
                <div>
                  <label className="admin-label">Paragraphs (one per line)</label>
                  <textarea
                    className="admin-textarea"
                    rows={3}
                    value={(sec.paragraphs || []).join('\n')}
                    onChange={(e) => {
                      const list = [...(form.additionalSections || [])];
                      list[idx] = { ...list[idx], paragraphs: e.target.value.split('\n') };
                      setForm((p) => ({ ...p, additionalSections: list }));
                    }}
                  />
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Bottom Save Bar */}
      <div style={{ marginTop: '2rem', paddingTop: '1rem', borderTop: '1px solid #E2E8F0', display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
        <button type="button" onClick={save} disabled={saving} className="admin-btn-primary" style={{ padding: '0.6rem 1.5rem', background: '#008080', borderColor: '#008080' }}>
          {saving ? 'Saving...' : 'Save Microchip Content'}
        </button>
      </div>
    </div>
  );
}
