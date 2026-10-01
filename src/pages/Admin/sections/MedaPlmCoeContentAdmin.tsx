import { useEffect, useState } from 'react';
import { doc, serverTimestamp } from 'firebase/firestore';
import { setDoc } from '../../../lib/auditLog';
import { db } from '../../../lib/firebase';
import { useDocument } from '../../../hooks/useDocument';
import {
  medaPlmCoe,
  type MedaSoftwarePlatform,
  type MedaGlanceItem,
} from '../../Differentiators/medaPlmCoe.data';

export interface CustomMedaSection {
  id: string;
  title: string;
  badge?: string;
  paragraphs?: string[];
  bulletPoints?: string[];
}

export interface MedaPlmCoeDoc {
  hero?: {
    category?: string;
    title?: string;
    subtitle?: string;
  };
  glance?: MedaGlanceItem[];
  collaboration?: {
    title?: string;
    paragraphs?: string[];
  };
  meda?: {
    heading?: string;
    intro?: string;
    softwarePlatformsHeading?: string;
    softwarePlatforms?: MedaSoftwarePlatform[];
    learningAreasHeading?: string;
    learningAreas?: string[];
    closing?: string;
  };
  plm?: {
    heading?: string;
    intro?: string;
    trainingHeading?: string;
    trainingItems?: string[];
    teamcenter?: {
      heading?: string;
      description?: string;
    };
  };
  outcomes?: {
    heading?: string;
    intro?: string;
    opportunitiesHeading?: string;
    opportunities?: string[];
    closing?: string;
  };
  additionalSections?: CustomMedaSection[];
}

const DEFAULT_STATE: MedaPlmCoeDoc = {
  hero: { ...medaPlmCoe.hero },
  glance: medaPlmCoe.glance.map((g) => ({ ...g })),
  collaboration: {
    title: medaPlmCoe.collaboration.title,
    paragraphs: [...medaPlmCoe.collaboration.paragraphs],
  },
  meda: {
    heading: medaPlmCoe.meda.heading,
    intro: medaPlmCoe.meda.intro,
    softwarePlatformsHeading: medaPlmCoe.meda.softwarePlatformsHeading,
    softwarePlatforms: medaPlmCoe.meda.softwarePlatforms.map((s) => ({ ...s })),
    learningAreasHeading: medaPlmCoe.meda.learningAreasHeading,
    learningAreas: [...medaPlmCoe.meda.learningAreas],
    closing: medaPlmCoe.meda.closing,
  },
  plm: {
    heading: medaPlmCoe.plm.heading,
    intro: medaPlmCoe.plm.intro,
    trainingHeading: medaPlmCoe.plm.trainingHeading,
    trainingItems: [...medaPlmCoe.plm.trainingItems],
    teamcenter: { ...medaPlmCoe.plm.teamcenter },
  },
  outcomes: {
    heading: medaPlmCoe.outcomes.heading,
    intro: medaPlmCoe.outcomes.intro,
    opportunitiesHeading: medaPlmCoe.outcomes.opportunitiesHeading,
    opportunities: [...medaPlmCoe.outcomes.opportunities],
    closing: medaPlmCoe.outcomes.closing,
  },
  additionalSections: [],
};

type ActiveSubSection =
  | 'overview'
  | 'meda-module'
  | 'plm-module'
  | 'outcomes'
  | 'custom-sections';

export default function MedaPlmCoeContentAdmin() {
  const { data, loading } = useDocument<MedaPlmCoeDoc>('settings', 'medaPlmCoe');
  const [form, setForm] = useState<MedaPlmCoeDoc>(DEFAULT_STATE);
  const [hasInitialized, setHasInitialized] = useState(false);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<ActiveSubSection>('overview');

  useEffect(() => {
    if (!loading && !hasInitialized) {
      if (data) {
        setForm({
          hero: { ...DEFAULT_STATE.hero, ...data.hero },
          glance: data.glance && data.glance.length > 0 ? data.glance : DEFAULT_STATE.glance,
          collaboration: {
            title: data.collaboration?.title || DEFAULT_STATE.collaboration?.title,
            paragraphs: data.collaboration?.paragraphs && data.collaboration.paragraphs.length > 0 ? data.collaboration.paragraphs : DEFAULT_STATE.collaboration?.paragraphs,
          },
          meda: {
            heading: data.meda?.heading || DEFAULT_STATE.meda?.heading,
            intro: data.meda?.intro || DEFAULT_STATE.meda?.intro,
            softwarePlatformsHeading: data.meda?.softwarePlatformsHeading || DEFAULT_STATE.meda?.softwarePlatformsHeading,
            softwarePlatforms: data.meda?.softwarePlatforms && data.meda.softwarePlatforms.length > 0 ? data.meda.softwarePlatforms : DEFAULT_STATE.meda?.softwarePlatforms,
            learningAreasHeading: data.meda?.learningAreasHeading || DEFAULT_STATE.meda?.learningAreasHeading,
            learningAreas: data.meda?.learningAreas && data.meda.learningAreas.length > 0 ? data.meda.learningAreas : DEFAULT_STATE.meda?.learningAreas,
            closing: data.meda?.closing || DEFAULT_STATE.meda?.closing,
          },
          plm: {
            heading: data.plm?.heading || DEFAULT_STATE.plm?.heading,
            intro: data.plm?.intro || DEFAULT_STATE.plm?.intro,
            trainingHeading: data.plm?.trainingHeading || DEFAULT_STATE.plm?.trainingHeading,
            trainingItems: data.plm?.trainingItems && data.plm.trainingItems.length > 0 ? data.plm.trainingItems : DEFAULT_STATE.plm?.trainingItems,
            teamcenter: { ...DEFAULT_STATE.plm?.teamcenter, ...data.plm?.teamcenter },
          },
          outcomes: {
            heading: data.outcomes?.heading || DEFAULT_STATE.outcomes?.heading,
            intro: data.outcomes?.intro || DEFAULT_STATE.outcomes?.intro,
            opportunitiesHeading: data.outcomes?.opportunitiesHeading || DEFAULT_STATE.outcomes?.opportunitiesHeading,
            opportunities: data.outcomes?.opportunities && data.outcomes.opportunities.length > 0 ? data.outcomes.opportunities : DEFAULT_STATE.outcomes?.opportunities,
            closing: data.outcomes?.closing || DEFAULT_STATE.outcomes?.closing,
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
      await setDoc(doc(db, 'settings', 'medaPlmCoe'), {
        ...form,
        updatedAt: serverTimestamp(),
      }, { merge: true });
      alert('MEDA & PLM CoE content updated successfully!');
    } catch (e) {
      alert(`Couldn't save: ${(e as Error).message}`);
    } finally {
      setSaving(false);
    }
  };

  const resetToDefaults = () => {
    if (confirm('Reset all MEDA & PLM text to default starting values? You can still edit before saving.')) {
      setForm(DEFAULT_STATE);
    }
  };

  return (
    <div style={{ background: '#fff', borderRadius: '12px', border: '1px solid #E2E8F0', padding: '1.5rem', marginTop: '1.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem', borderBottom: '1px solid #E2E8F0', paddingBottom: '1rem' }}>
        <div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0B1E42', margin: 0 }}>
            MEDA & PLM Centre of Excellence — All Page Content & Sections
          </h2>
          <p style={{ fontSize: '0.85rem', color: '#64748B', margin: '0.25rem 0 0 0' }}>
            Edit Capgemini collaboration info, MEDA modules, PLM training topics, software tools, and outcomes.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button type="button" onClick={resetToDefaults} className="admin-btn-secondary" style={{ fontSize: '0.8rem', padding: '0.45rem 0.85rem' }}>
            Reset to Defaults
          </button>
          <button type="button" onClick={save} disabled={saving} className="admin-btn-primary" style={{ fontSize: '0.8rem', padding: '0.45rem 1.1rem', background: '#008080', borderColor: '#008080' }}>
            {saving ? 'Saving...' : 'Save MEDA & PLM Content'}
          </button>
        </div>
      </div>

      {/* Subtabs Navigation */}
      <div style={{ display: 'flex', gap: '0.4rem', overflowX: 'auto', paddingBottom: '0.75rem', marginBottom: '1.5rem', borderBottom: '2px solid #F1F5F9' }}>
        {[
          { key: 'overview', label: '1. Overview & Collaboration' },
          { key: 'meda-module', label: '2. MEDA Design Automation' },
          { key: 'plm-module', label: '3. PLM & Teamcenter' },
          { key: 'outcomes', label: '4. Outcomes & Opportunities' },
          { key: 'custom-sections', label: '5. Custom Extra Sections' },
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

      {/* TAB 1: OVERVIEW & COLLABORATION */}
      {activeTab === 'overview' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div>
            <label className="admin-label">Hero Banner Subtitle</label>
            <textarea
              className="admin-textarea"
              rows={2}
              value={form.hero?.subtitle || ''}
              onChange={(e) => setForm((p) => ({ ...p, hero: { ...p.hero, subtitle: e.target.value } }))}
            />
          </div>

          <div style={{ background: '#F8FAFC', padding: '1rem', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
            <h4 style={{ margin: '0 0 0.75rem 0', fontWeight: 800, color: '#0B1E42' }}>
              Collaboration Title & Paragraphs
            </h4>
            <div style={{ marginBottom: '0.75rem' }}>
              <label className="admin-label">Title</label>
              <input
                type="text"
                className="admin-input"
                value={form.collaboration?.title || ''}
                onChange={(e) => setForm((p) => ({ ...p, collaboration: { ...p.collaboration, title: e.target.value } }))}
              />
            </div>
            <div>
              <label className="admin-label">Paragraphs</label>
              {(form.collaboration?.paragraphs || []).map((p, idx) => (
                <div key={idx} style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
                  <textarea
                    className="admin-textarea"
                    rows={3}
                    value={p}
                    onChange={(e) => {
                      const list = [...(form.collaboration?.paragraphs || [])];
                      list[idx] = e.target.value;
                      setForm((prev) => ({ ...prev, collaboration: { ...prev.collaboration, paragraphs: list } }));
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const list = (form.collaboration?.paragraphs || []).filter((_, i) => i !== idx);
                      setForm((prev) => ({ ...prev, collaboration: { ...prev.collaboration, paragraphs: list } }));
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
                onClick={() => {
                  setForm((prev) => ({ ...prev, collaboration: { ...prev.collaboration, paragraphs: [...(prev.collaboration?.paragraphs || []), ''] } }));
                }}
                className="admin-btn-secondary"
                style={{ fontSize: '0.8rem' }}
              >
                + Add Paragraph
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: MEDA MODULE */}
      {activeTab === 'meda-module' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div>
            <label className="admin-label">Section Heading</label>
            <input
              type="text"
              className="admin-input"
              value={form.meda?.heading || ''}
              onChange={(e) => setForm((p) => ({ ...p, meda: { ...p.meda, heading: e.target.value } }))}
            />
          </div>
          <div>
            <label className="admin-label">Introduction</label>
            <textarea
              className="admin-textarea"
              rows={2}
              value={form.meda?.intro || ''}
              onChange={(e) => setForm((p) => ({ ...p, meda: { ...p.meda, intro: e.target.value } }))}
            />
          </div>
          <div>
            <label className="admin-label">Software Platforms</label>
            {(form.meda?.softwarePlatforms || []).map((tool, idx) => (
              <div key={idx} style={{ background: '#F8FAFC', padding: '0.75rem', borderRadius: '8px', border: '1px solid #E2E8F0', marginBottom: '0.5rem', display: 'grid', gridTemplateColumns: '180px 1fr auto', gap: '0.5rem', alignItems: 'center' }}>
                <input
                  type="text"
                  className="admin-input"
                  value={tool.name}
                  onChange={(e) => {
                    const list = [...(form.meda?.softwarePlatforms || [])];
                    list[idx] = { ...list[idx], name: e.target.value };
                    setForm((p) => ({ ...p, meda: { ...p.meda, softwarePlatforms: list } }));
                  }}
                />
                <input
                  type="text"
                  className="admin-input"
                  value={tool.description}
                  onChange={(e) => {
                    const list = [...(form.meda?.softwarePlatforms || [])];
                    list[idx] = { ...list[idx], description: e.target.value };
                    setForm((p) => ({ ...p, meda: { ...p.meda, softwarePlatforms: list } }));
                  }}
                />
                <button
                  type="button"
                  onClick={() => {
                    const list = (form.meda?.softwarePlatforms || []).filter((_, i) => i !== idx);
                    setForm((p) => ({ ...p, meda: { ...p.meda, softwarePlatforms: list } }));
                  }}
                  className="admin-btn-danger"
                >
                  ✕
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => {
                setForm((p) => ({ ...p, meda: { ...p.meda, softwarePlatforms: [...(p.meda?.softwarePlatforms || []), { name: '', description: '' }] } }));
              }}
              className="admin-btn-secondary"
              style={{ fontSize: '0.8rem' }}
            >
              + Add Software Platform
            </button>
          </div>

          <div>
            <label className="admin-label">Key Areas of Learning</label>
            {(form.meda?.learningAreas || []).map((area, idx) => (
              <div key={idx} style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.4rem' }}>
                <input
                  type="text"
                  className="admin-input"
                  value={area}
                  onChange={(e) => {
                    const list = [...(form.meda?.learningAreas || [])];
                    list[idx] = e.target.value;
                    setForm((p) => ({ ...p, meda: { ...p.meda, learningAreas: list } }));
                  }}
                />
                <button
                  type="button"
                  onClick={() => {
                    const list = (form.meda?.learningAreas || []).filter((_, i) => i !== idx);
                    setForm((p) => ({ ...p, meda: { ...p.meda, learningAreas: list } }));
                  }}
                  className="admin-btn-danger"
                >
                  ✕
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => {
                setForm((p) => ({ ...p, meda: { ...p.meda, learningAreas: [...(p.meda?.learningAreas || []), ''] } }));
              }}
              className="admin-btn-secondary"
              style={{ fontSize: '0.8rem' }}
            >
              + Add Learning Area
            </button>
          </div>
        </div>
      )}

      {/* TAB 3: PLM MODULE */}
      {activeTab === 'plm-module' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div>
            <label className="admin-label">Section Heading</label>
            <input
              type="text"
              className="admin-input"
              value={form.plm?.heading || ''}
              onChange={(e) => setForm((p) => ({ ...p, plm: { ...p.plm, heading: e.target.value } }))}
            />
          </div>
          <div>
            <label className="admin-label">Introduction</label>
            <textarea
              className="admin-textarea"
              rows={2}
              value={form.plm?.intro || ''}
              onChange={(e) => setForm((p) => ({ ...p, plm: { ...p.plm, intro: e.target.value } }))}
            />
          </div>
          <div>
            <label className="admin-label">Training Topics</label>
            {(form.plm?.trainingItems || []).map((item, idx) => (
              <div key={idx} style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.4rem' }}>
                <input
                  type="text"
                  className="admin-input"
                  value={item}
                  onChange={(e) => {
                    const list = [...(form.plm?.trainingItems || [])];
                    list[idx] = e.target.value;
                    setForm((p) => ({ ...p, plm: { ...p.plm, trainingItems: list } }));
                  }}
                />
                <button
                  type="button"
                  onClick={() => {
                    const list = (form.plm?.trainingItems || []).filter((_, i) => i !== idx);
                    setForm((p) => ({ ...p, plm: { ...p.plm, trainingItems: list } }));
                  }}
                  className="admin-btn-danger"
                >
                  ✕
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => {
                setForm((p) => ({ ...p, plm: { ...p.plm, trainingItems: [...(p.plm?.trainingItems || []), ''] } }));
              }}
              className="admin-btn-secondary"
              style={{ fontSize: '0.8rem' }}
            >
              + Add Training Item
            </button>
          </div>

          <div style={{ background: '#F8FAFC', padding: '1rem', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
            <h4 style={{ margin: '0 0 0.5rem 0', fontWeight: 800, color: '#0B1E42' }}>
              {form.plm?.teamcenter?.heading || 'Siemens Teamcenter'}
            </h4>
            <textarea
              className="admin-textarea"
              rows={2}
              value={form.plm?.teamcenter?.description || ''}
              onChange={(e) => setForm((p) => ({ ...p, plm: { ...p.plm, teamcenter: { ...p.plm?.teamcenter, description: e.target.value } } }))}
            />
          </div>
        </div>
      )}

      {/* TAB 4: OUTCOMES */}
      {activeTab === 'outcomes' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div>
            <label className="admin-label">Outcomes Heading</label>
            <input
              type="text"
              className="admin-input"
              value={form.outcomes?.heading || ''}
              onChange={(e) => setForm((p) => ({ ...p, outcomes: { ...p.outcomes, heading: e.target.value } }))}
            />
          </div>
          <div>
            <label className="admin-label">Introductory Statement</label>
            <textarea
              className="admin-textarea"
              rows={2}
              value={form.outcomes?.intro || ''}
              onChange={(e) => setForm((p) => ({ ...p, outcomes: { ...p.outcomes, intro: e.target.value } }))}
            />
          </div>
          <div>
            <label className="admin-label">Opportunities & Outcomes Checklist</label>
            {(form.outcomes?.opportunities || []).map((opp, idx) => (
              <div key={idx} style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.4rem' }}>
                <input
                  type="text"
                  className="admin-input"
                  value={opp}
                  onChange={(e) => {
                    const list = [...(form.outcomes?.opportunities || [])];
                    list[idx] = e.target.value;
                    setForm((p) => ({ ...p, outcomes: { ...p.outcomes, opportunities: list } }));
                  }}
                />
                <button
                  type="button"
                  onClick={() => {
                    const list = (form.outcomes?.opportunities || []).filter((_, i) => i !== idx);
                    setForm((p) => ({ ...p, outcomes: { ...p.outcomes, opportunities: list } }));
                  }}
                  className="admin-btn-danger"
                >
                  ✕
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => {
                setForm((p) => ({ ...p, outcomes: { ...p.outcomes, opportunities: [...(p.outcomes?.opportunities || []), ''] } }));
              }}
              className="admin-btn-secondary"
              style={{ fontSize: '0.8rem' }}
            >
              + Add Opportunity
            </button>
          </div>
        </div>
      )}

      {/* TAB 5: CUSTOM SECTIONS */}
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
                      badge: 'MEDA & PLM Initiative',
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
              No extra custom sections created yet. Click "+ Add Section" to create new blocks.
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
          {saving ? 'Saving...' : 'Save MEDA & PLM Content'}
        </button>
      </div>
    </div>
  );
}
