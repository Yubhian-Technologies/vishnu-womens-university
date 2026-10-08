import { useEffect, useState } from 'react';
import { doc, serverTimestamp } from 'firebase/firestore';
import { setDoc } from '../../../lib/auditLog';
import { db } from '../../../lib/firebase';
import { useDocument } from '../../../hooks/useDocument';
import {
  chipsToStartup,
  type ProjectOutlay,
  type EdaToolsTable,
  type StatCard,
  type ResourcesData,
  type FacilitiesData,
} from '../../Differentiators/chipsToStartup.data';

export interface CustomChipsSection {
  id: string;
  title: string;
  badge?: string;
  paragraphs?: string[];
  bulletPoints?: string[];
}

export interface ChipsToStartupDoc {
  heroTitle?: string;
  heroSubtitle?: string;
  aboutTitle?: string;
  aboutParagraphs?: string[];
  statCards?: StatCard[];
  objectives?: string[];
  projectOutlay?: Partial<ProjectOutlay>;
  resources?: Partial<ResourcesData>;
  edaTools?: Partial<EdaToolsTable>;
  facilities?: Partial<FacilitiesData>;
  additionalSections?: CustomChipsSection[];
}

const DEFAULT_STATE: ChipsToStartupDoc = {
  heroTitle: chipsToStartup.heroTitle,
  heroSubtitle: chipsToStartup.heroSubtitle,
  aboutTitle: chipsToStartup.aboutTitle,
  aboutParagraphs: [...chipsToStartup.aboutParagraphs],
  statCards: chipsToStartup.statCards.map((s) => ({ ...s })),
  objectives: [...chipsToStartup.objectives],
  projectOutlay: { ...chipsToStartup.projectOutlay },
  resources: { ...chipsToStartup.resources },
  edaTools: { ...chipsToStartup.edaTools },
  facilities: { ...chipsToStartup.facilities },
  additionalSections: [],
};

type ActiveSubSection =
  | 'overview'
  | 'stats'
  | 'objectives'
  | 'project-outlay'
  | 'resources-eda'
  | 'custom-sections';

export default function ChipsToStartupContentAdmin() {
  const { data, loading } = useDocument<ChipsToStartupDoc>('settings', 'chipsToStartup');
  const [form, setForm] = useState<ChipsToStartupDoc>(DEFAULT_STATE);
  const [hasInitialized, setHasInitialized] = useState(false);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<ActiveSubSection>('overview');

  useEffect(() => {
    if (!loading && !hasInitialized) {
      if (data) {
        setForm({
          heroTitle: data.heroTitle || DEFAULT_STATE.heroTitle,
          heroSubtitle: data.heroSubtitle || DEFAULT_STATE.heroSubtitle,
          aboutTitle: data.aboutTitle || DEFAULT_STATE.aboutTitle,
          aboutParagraphs: data.aboutParagraphs && data.aboutParagraphs.length > 0 ? data.aboutParagraphs : DEFAULT_STATE.aboutParagraphs,
          statCards: data.statCards && data.statCards.length > 0 ? data.statCards : DEFAULT_STATE.statCards,
          objectives: data.objectives && data.objectives.length > 0 ? data.objectives : DEFAULT_STATE.objectives,
          projectOutlay: { ...DEFAULT_STATE.projectOutlay, ...(data.projectOutlay || {}) } as ProjectOutlay,
          resources: { ...DEFAULT_STATE.resources, ...(data.resources || {}) } as ResourcesData,
          edaTools: { ...DEFAULT_STATE.edaTools, ...(data.edaTools || {}) } as EdaToolsTable,
          facilities: { ...DEFAULT_STATE.facilities, ...(data.facilities || {}) } as FacilitiesData,
          additionalSections: data.additionalSections || [],
        });
      }
      setHasInitialized(true);
    }
  }, [data, loading, hasInitialized]);

  const save = async () => {
    setSaving(true);
    try {
      await setDoc(doc(db, 'settings', 'chipsToStartup'), {
        ...form,
        updatedAt: serverTimestamp(),
      }, { merge: true });
      alert('Chips to Startup (C2S) content updated successfully!');
    } catch (e) {
      alert(`Couldn't save: ${(e as Error).message}`);
    } finally {
      setSaving(false);
    }
  };

  const resetToDefaults = () => {
    if (confirm('Reset all Chips to Startup text to default starting values? You can still edit before saving.')) {
      setForm(DEFAULT_STATE);
    }
  };

  return (
    <div style={{ background: '#fff', borderRadius: '12px', border: '1px solid #E2E8F0', padding: '1.5rem', marginTop: '1.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem', borderBottom: '1px solid #E2E8F0', paddingBottom: '1rem' }}>
        <div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0B1E42', margin: 0 }}>
            Chips to Startup (C2S) — All Page Content & Sections
          </h2>
          <p style={{ fontSize: '0.85rem', color: '#64748B', margin: '0.25rem 0 0 0' }}>
            Edit MeitY project funding details, Edge AI coprocessor research, EDA tools list, and stats.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button type="button" onClick={resetToDefaults} className="admin-btn-secondary" style={{ fontSize: '0.8rem', padding: '0.45rem 0.85rem' }}>
            Reset to Defaults
          </button>
          <button type="button" onClick={save} disabled={saving} className="admin-btn-primary" style={{ fontSize: '0.8rem', padding: '0.45rem 1.1rem', background: '#008080', borderColor: '#008080' }}>
            {saving ? 'Saving...' : 'Save C2S Content'}
          </button>
        </div>
      </div>

      {/* Subtabs Navigation */}
      <div style={{ display: 'flex', gap: '0.4rem', overflowX: 'auto', paddingBottom: '0.75rem', marginBottom: '1.5rem', borderBottom: '2px solid #F1F5F9' }}>
        {[
          { key: 'overview', label: '1. Overview & Hero' },
          { key: 'stats', label: '2. Metrics & Stats' },
          { key: 'objectives', label: '3. Objectives' },
          { key: 'project-outlay', label: '4. Project Outlay' },
          { key: 'resources-eda', label: '5. EDA Tools & Resources' },
          { key: 'custom-sections', label: '6. Custom Extra Sections' },
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

      {/* TAB 1: OVERVIEW */}
      {activeTab === 'overview' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div>
            <label className="admin-label">Hero Title</label>
            <input
              type="text"
              className="admin-input"
              value={form.heroTitle || ''}
              onChange={(e) => setForm((p) => ({ ...p, heroTitle: e.target.value }))}
            />
          </div>
          <div>
            <label className="admin-label">Hero Subtitle</label>
            <textarea
              className="admin-textarea"
              rows={2}
              value={form.heroSubtitle || ''}
              onChange={(e) => setForm((p) => ({ ...p, heroSubtitle: e.target.value }))}
            />
          </div>
          <div>
            <label className="admin-label">About Heading</label>
            <input
              type="text"
              className="admin-input"
              value={form.aboutTitle || ''}
              onChange={(e) => setForm((p) => ({ ...p, aboutTitle: e.target.value }))}
            />
          </div>
          <div>
            <label className="admin-label">About Paragraphs</label>
            {(form.aboutParagraphs || []).map((p, idx) => (
              <div key={idx} style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <textarea
                  className="admin-textarea"
                  rows={3}
                  value={p}
                  onChange={(e) => {
                    const list = [...(form.aboutParagraphs || [])];
                    list[idx] = e.target.value;
                    setForm((prev) => ({ ...prev, aboutParagraphs: list }));
                  }}
                />
                <button
                  type="button"
                  onClick={() => {
                    const list = (form.aboutParagraphs || []).filter((_, i) => i !== idx);
                    setForm((prev) => ({ ...prev, aboutParagraphs: list }));
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
              onClick={() => setForm((prev) => ({ ...prev, aboutParagraphs: [...(prev.aboutParagraphs || []), ''] }))}
              className="admin-btn-secondary"
              style={{ fontSize: '0.8rem' }}
            >
              + Add Paragraph
            </button>
          </div>
        </div>
      )}

      {/* TAB 2: STATS */}
      {activeTab === 'stats' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
          {(form.statCards || []).map((card, idx) => (
            <div key={idx} style={{ background: '#F8FAFC', padding: '1rem', borderRadius: '8px', border: '1px solid #E2E8F0', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label className="admin-label" style={{ fontWeight: 800 }}>Stat #{idx + 1} Title</label>
              <input
                type="text"
                className="admin-input"
                value={card.title}
                onChange={(e) => {
                  const list = [...(form.statCards || [])];
                  list[idx] = { ...list[idx], title: e.target.value };
                  setForm((p) => ({ ...p, statCards: list }));
                }}
              />
              <label className="admin-label">Value</label>
              <input
                type="text"
                className="admin-input"
                value={card.val}
                onChange={(e) => {
                  const list = [...(form.statCards || [])];
                  list[idx] = { ...list[idx], val: e.target.value };
                  setForm((p) => ({ ...p, statCards: list }));
                }}
              />
              <label className="admin-label">Description</label>
              <textarea
                className="admin-textarea"
                rows={2}
                value={card.desc}
                onChange={(e) => {
                  const list = [...(form.statCards || [])];
                  list[idx] = { ...list[idx], desc: e.target.value };
                  setForm((p) => ({ ...p, statCards: list }));
                }}
              />
            </div>
          ))}
        </div>
      )}

      {/* TAB 3: OBJECTIVES */}
      {activeTab === 'objectives' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <label className="admin-label">Programme Objectives</label>
          {(form.objectives || []).map((obj, idx) => (
            <div key={idx} style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.4rem' }}>
              <input
                type="text"
                className="admin-input"
                value={obj}
                onChange={(e) => {
                  const list = [...(form.objectives || [])];
                  list[idx] = e.target.value;
                  setForm((p) => ({ ...p, objectives: list }));
                }}
              />
              <button
                type="button"
                onClick={() => {
                  const list = (form.objectives || []).filter((_, i) => i !== idx);
                  setForm((p) => ({ ...p, objectives: list }));
                }}
                className="admin-btn-danger"
              >
                ✕
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => setForm((p) => ({ ...p, objectives: [...(p.objectives || []), ''] }))}
            className="admin-btn-secondary"
            style={{ fontSize: '0.8rem' }}
          >
            + Add Objective
          </button>
        </div>
      )}

      {/* TAB 4: PROJECT OUTLAY */}
      {activeTab === 'project-outlay' && (
        <div style={{ background: '#F8FAFC', padding: '1.25rem', borderRadius: '8px', border: '1px solid #E2E8F0', display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
          <div>
            <label className="admin-label">Project Title</label>
            <input
              type="text"
              className="admin-input"
              value={form.projectOutlay?.projectTitle || ''}
              onChange={(e) => setForm((p) => ({ ...p, projectOutlay: { ...p.projectOutlay, projectTitle: e.target.value } }))}
            />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
            <div>
              <label className="admin-label">Total Outlay</label>
              <input
                type="text"
                className="admin-input"
                value={form.projectOutlay?.totalOutlay || ''}
                onChange={(e) => setForm((p) => ({ ...p, projectOutlay: { ...p.projectOutlay, totalOutlay: e.target.value } }))}
              />
            </div>
            <div>
              <label className="admin-label">Duration</label>
              <input
                type="text"
                className="admin-input"
                value={form.projectOutlay?.duration || ''}
                onChange={(e) => setForm((p) => ({ ...p, projectOutlay: { ...p.projectOutlay, duration: e.target.value } }))}
              />
            </div>
          </div>
          <div>
            <label className="admin-label">Investigators (one per line)</label>
            <textarea
              className="admin-textarea"
              rows={4}
              value={(form.projectOutlay?.investigators || []).join('\n')}
              onChange={(e) => setForm((p) => ({ ...p, projectOutlay: { ...p.projectOutlay, investigators: e.target.value.split('\n') } }))}
            />
          </div>
        </div>
      )}

      {/* TAB 5: RESOURCES & EDA */}
      {activeTab === 'resources-eda' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div>
            <label className="admin-label">EDA Tools Table Rows (S.No | Tool Name | Description)</label>
            {(form.edaTools?.rows || []).map((row, idx) => (
              <div key={idx} style={{ display: 'grid', gridTemplateColumns: '50px 180px 1fr auto', gap: '0.5rem', marginBottom: '0.4rem', alignItems: 'center' }}>
                <input
                  type="text"
                  className="admin-input"
                  value={row.cells[0] || `${idx + 1}`}
                  onChange={(e) => {
                    const list = [...(form.edaTools?.rows || [])];
                    list[idx] = { cells: [e.target.value, row.cells[1] || '', row.cells[2] || ''] };
                    setForm((p) => ({ ...p, edaTools: { ...p.edaTools, rows: list } }));
                  }}
                />
                <input
                  type="text"
                  className="admin-input"
                  value={row.cells[1] || ''}
                  onChange={(e) => {
                    const list = [...(form.edaTools?.rows || [])];
                    list[idx] = { cells: [row.cells[0] || `${idx + 1}`, e.target.value, row.cells[2] || ''] };
                    setForm((p) => ({ ...p, edaTools: { ...p.edaTools, rows: list } }));
                  }}
                />
                <input
                  type="text"
                  className="admin-input"
                  value={row.cells[2] || ''}
                  onChange={(e) => {
                    const list = [...(form.edaTools?.rows || [])];
                    list[idx] = { cells: [row.cells[0] || `${idx + 1}`, row.cells[1] || '', e.target.value] };
                    setForm((p) => ({ ...p, edaTools: { ...p.edaTools, rows: list } }));
                  }}
                />
                <button
                  type="button"
                  onClick={() => {
                    const list = (form.edaTools?.rows || []).filter((_, i) => i !== idx);
                    setForm((p) => ({ ...p, edaTools: { ...p.edaTools, rows: list } }));
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
                const count = (form.edaTools?.rows || []).length + 1;
                setForm((p) => ({ ...p, edaTools: { ...p.edaTools, rows: [...(p.edaTools?.rows || []), { cells: [`${count}`, '', ''] }] } }));
              }}
              className="admin-btn-secondary"
              style={{ fontSize: '0.8rem' }}
            >
              + Add Tool Row
            </button>
          </div>
        </div>
      )}

      {/* TAB 6: CUSTOM SECTIONS */}
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
                      badge: 'Semiconductor / C2S Initiative',
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
          {saving ? 'Saving...' : 'Save C2S Content'}
        </button>
      </div>
    </div>
  );
}
