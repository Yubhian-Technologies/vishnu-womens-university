import { useState, useEffect } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { setDoc } from '../../../lib/auditLog';
import { db } from '../../../lib/firebase';
import {
  smartInterviews,
  type SmartInterviewsDoc,
  type CustomSmartInterviewsSection,
} from '../../Differentiators/smartInterviews.data';
import {
  Plus,
  Trash2,
  Save,
  RotateCcw,
  Sparkles,
  Layers,
  Award,
  Users,
  Check,
  ArrowUp,
  ArrowDown,
  BookOpen,
  Briefcase,
  Building,
  Handshake,
  TrendingUp,
} from 'lucide-react';

export type { SmartInterviewsDoc };

type ActiveTab =
  | 'hero-overview'
  | 'phases'
  | 'details'
  | 'batches'
  | 'highlights'
  | 'facilities'
  | 'outcomes'
  | 'partners'
  | 'banners'
  | 'custom-sections';

export default function SmartInterviewsContentAdmin() {
  const [data, setData] = useState<SmartInterviewsDoc>(smartInterviews);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [activeTab, setActiveTab] = useState<ActiveTab>('hero-overview');

  useEffect(() => {
    async function loadData() {
      try {
        const snap = await getDoc(doc(db, 'settings', 'smartInterviews'));
        if (snap.exists()) {
          const remote = snap.data() as Partial<SmartInterviewsDoc>;
          setData({
            ...smartInterviews,
            ...remote,
            phases: remote.phases && remote.phases.length > 0 ? remote.phases : smartInterviews.phases,
            moreParagraphs:
              remote.moreParagraphs && remote.moreParagraphs.length > 0
                ? remote.moreParagraphs
                : smartInterviews.moreParagraphs,
            batches: remote.batches && remote.batches.length > 0 ? remote.batches : smartInterviews.batches,
            highlightsList:
              remote.highlightsList && remote.highlightsList.length > 0
                ? remote.highlightsList
                : remote.highlightsContent
                ? remote.highlightsContent
                    .split('\n')
                    .map((s) => s.trim())
                    .filter(Boolean)
                : smartInterviews.highlightsList,
            additionalSections: remote.additionalSections || [],
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
    if (confirm('Reset all Smart Interviews content to defaults?')) {
      setData(smartInterviews);
    }
  };

  // Helper reorder array
  const moveItem = <T,>(arr: T[], index: number, direction: 'up' | 'down'): T[] => {
    const next = [...arr];
    const target = direction === 'up' ? index - 1 : index + 1;
    if (target < 0 || target >= arr.length) return arr;
    const temp = next[index];
    next[index] = next[target];
    next[target] = temp;
    return next;
  };

  if (loading) {
    return (
      <div className="admin-card" style={{ textAlign: 'center', padding: '2rem', color: '#64748b' }}>
        Loading Smart Interviews Content Editor...
      </div>
    );
  }

  const tabs: { id: ActiveTab; label: string; icon: any }[] = [
    { id: 'hero-overview', label: '1. Hero & Overview', icon: Sparkles },
    { id: 'phases', label: '2. Training Phases', icon: Layers },
    { id: 'details', label: '3. Program Details (02)', icon: BookOpen },
    { id: 'batches', label: '4. Placements Batch Wise (03)', icon: TrendingUp },
    { id: 'highlights', label: '5. Key Highlights (04)', icon: Award },
    { id: 'facilities', label: '6. Facilities & Equipment (05)', icon: Building },
    { id: 'outcomes', label: '7. Outcomes & Achievements (06)', icon: Briefcase },
    { id: 'partners', label: '8. Partners (07)', icon: Handshake },
    { id: 'banners', label: '9. Stats & CTA Banners', icon: Users },
    { id: 'custom-sections', label: '10. Custom Sections', icon: Plus },
  ];

  return (
    <div className="admin-section" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Top Header Card */}
      <div className="admin-card">
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '1rem',
          }}
        >
          <div>
            <div
              style={{
                display: 'inline-block',
                padding: '0.2rem 0.6rem',
                borderRadius: '4px',
                background: '#dbeafe',
                color: '#1d4ed8',
                fontSize: '0.75rem',
                fontWeight: 700,
                textTransform: 'uppercase',
                marginBottom: '0.35rem',
              }}
            >
              Unified Differentiator Content Editor
            </div>
            <h2 style={{ margin: 0, fontSize: '1.4rem', fontWeight: 700, color: '#0f172a' }}>
              Smart Interviews – C&DS Programme
            </h2>
            <p style={{ margin: '0.25rem 0 0', fontSize: '0.875rem', color: '#64748b' }}>
              Edit all public sections top-to-bottom: Hero Banner, Dark Overview, Training Phases Roadmap, Accordion Details (02-07), Stats Banner, and Dynamic Custom Sections.
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

        {/* Tab Navigation */}
        <div
          style={{
            display: 'flex',
            gap: '0.4rem',
            borderBottom: '1px solid #e2e8f0',
            marginTop: '1.25rem',
            paddingBottom: '0.4rem',
            overflowX: 'auto',
            flexWrap: 'wrap',
          }}
        >
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className="admin-btn"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  background: isActive ? '#0f766e' : '#f1f5f9',
                  color: isActive ? '#ffffff' : '#334155',
                  border: 'none',
                  fontWeight: isActive ? 700 : 500,
                  fontSize: '0.82rem',
                  padding: '0.45rem 0.85rem',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                }}
              >
                <Icon size={14} />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* 1. HERO & OVERVIEW */}
      {activeTab === 'hero-overview' && (
        <div className="admin-card" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div style={{ borderBottom: '1px solid #e2e8f0', paddingBottom: '0.75rem' }}>
            <h3 style={{ margin: 0, fontSize: '1.1rem', color: '#0f172a' }}>Top Hero Banner</h3>
            <p style={{ margin: '0.25rem 0 0', fontSize: '0.85rem', color: '#64748b' }}>
              Displayed at the very top of the page over the hero background image.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
            <div className="admin-field">
              <label className="admin-label">Hero Badge Text</label>
              <input
                type="text"
                value={data.heroBadge || ''}
                onChange={(e) => setData({ ...data, heroBadge: e.target.value })}
                className="admin-input"
                placeholder="STUDENT EMPLOYMENT & PLACEMENT"
              />
            </div>
            <div className="admin-field">
              <label className="admin-label">Page Title</label>
              <input
                type="text"
                value={data.pageTitle || ''}
                onChange={(e) => setData({ ...data, pageTitle: e.target.value })}
                className="admin-input"
                placeholder="Smart Interviews – C&DS Programme"
              />
            </div>
          </div>

          <div className="admin-field">
            <label className="admin-label">Hero Subtitle / Lead Paragraph</label>
            <textarea
              rows={2}
              value={data.heroSubtitle || ''}
              onChange={(e) => setData({ ...data, heroSubtitle: e.target.value })}
              className="admin-textarea"
              placeholder="Intensive Data Structures and Algorithms training..."
            />
          </div>

          <div style={{ borderBottom: '1px solid #e2e8f0', paddingBottom: '0.75rem', marginTop: '0.5rem' }}>
            <h3 style={{ margin: 0, fontSize: '1.1rem', color: '#0f172a' }}>Hero Overview Block (Dark Navy Section)</h3>
            <p style={{ margin: '0.25rem 0 0', fontSize: '0.85rem', color: '#64748b' }}>
              The high-contrast dark section containing the main narrative, path header, and 4 metric cards.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
            <div className="admin-field">
              <label className="admin-label">Section Tag</label>
              <input
                type="text"
                value={data.aboutTag || ''}
                onChange={(e) => setData({ ...data, aboutTag: e.target.value })}
                className="admin-input"
                placeholder="CAREER PREPARATION"
              />
            </div>
            <div className="admin-field">
              <label className="admin-label">Title Prefix</label>
              <input
                type="text"
                value={data.aboutTitle || ''}
                onChange={(e) => setData({ ...data, aboutTitle: e.target.value })}
                className="admin-input"
                placeholder="Smart"
              />
            </div>
            <div className="admin-field">
              <label className="admin-label">Title Highlight (Blue)</label>
              <input
                type="text"
                value={data.aboutTitleBlue || ''}
                onChange={(e) => setData({ ...data, aboutTitleBlue: e.target.value })}
                className="admin-input"
                placeholder="Interviews"
              />
            </div>
          </div>

          <div className="admin-field">
            <label className="admin-label">Narrative Description (About Text)</label>
            <textarea
              rows={4}
              value={data.aboutDesc || ''}
              onChange={(e) => setData({ ...data, aboutDesc: e.target.value })}
              className="admin-textarea"
              placeholder="The curriculum spans three phases across three semesters..."
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
            <div className="admin-field">
              <label className="admin-label">Keywords / Sub-tagline</label>
              <input
                type="text"
                value={data.aboutKeywords || ''}
                onChange={(e) => setData({ ...data, aboutKeywords: e.target.value })}
                className="admin-input"
                placeholder="PRACTICE / PROBLEM SOLVE / GET PLACED"
              />
            </div>
            <div className="admin-field">
              <label className="admin-label">Bottom Tagline</label>
              <input
                type="text"
                value={data.aboutTagline || ''}
                onChange={(e) => setData({ ...data, aboutTagline: e.target.value })}
                className="admin-input"
                placeholder="SAME LEARNERS. BIGGER TOMORROWS."
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="admin-field">
              <label className="admin-label">Structured Path Tag</label>
              <textarea
                rows={2}
                value={data.pathTag || ''}
                onChange={(e) => setData({ ...data, pathTag: e.target.value })}
                className="admin-textarea"
                placeholder="A STRUCTURED PATH&#10;FROM LEARNING TO PLACEMENT"
              />
            </div>
            <div className="admin-field">
              <label className="admin-label">Code Comments Tag</label>
              <textarea
                rows={2}
                value={data.codeComments || ''}
                onChange={(e) => setData({ ...data, codeComments: e.target.value })}
                className="admin-textarea"
                placeholder="// CODE&#10;// LEARN&#10;// GROW&#10;// SUCCEED"
              />
            </div>
          </div>

          <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '1rem' }}>
            <h4 style={{ margin: '0 0 0.75rem', fontSize: '0.95rem', color: '#1e293b' }}>4 Metric Cards (2x2 Grid)</h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
              {/* Card 1 */}
              <div style={{ padding: '0.85rem', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px' }}>
                <div style={{ fontWeight: 700, fontSize: '0.85rem', color: '#1d4ed8', marginBottom: '0.5rem' }}>Card 1 (Phases)</div>
                <div className="admin-field" style={{ marginBottom: '0.5rem' }}>
                  <label className="admin-label">Value</label>
                  <input
                    type="text"
                    value={data.metricPhasesValue || ''}
                    onChange={(e) => setData({ ...data, metricPhasesValue: e.target.value })}
                    className="admin-input"
                  />
                </div>
                <div className="admin-field" style={{ marginBottom: '0.5rem' }}>
                  <label className="admin-label">Label</label>
                  <input
                    type="text"
                    value={data.metricPhasesLabel || ''}
                    onChange={(e) => setData({ ...data, metricPhasesLabel: e.target.value })}
                    className="admin-input"
                  />
                </div>
                <div className="admin-field">
                  <label className="admin-label">Subtext</label>
                  <input
                    type="text"
                    value={data.metricPhasesSubtext || ''}
                    onChange={(e) => setData({ ...data, metricPhasesSubtext: e.target.value })}
                    className="admin-input"
                  />
                </div>
              </div>

              {/* Card 2 */}
              <div style={{ padding: '0.85rem', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px' }}>
                <div style={{ fontWeight: 700, fontSize: '0.85rem', color: '#d97706', marginBottom: '0.5rem' }}>Card 2 (Semesters)</div>
                <div className="admin-field" style={{ marginBottom: '0.5rem' }}>
                  <label className="admin-label">Value</label>
                  <input
                    type="text"
                    value={data.metricSemestersValue || ''}
                    onChange={(e) => setData({ ...data, metricSemestersValue: e.target.value })}
                    className="admin-input"
                  />
                </div>
                <div className="admin-field" style={{ marginBottom: '0.5rem' }}>
                  <label className="admin-label">Label</label>
                  <input
                    type="text"
                    value={data.metricSemestersLabel || ''}
                    onChange={(e) => setData({ ...data, metricSemestersLabel: e.target.value })}
                    className="admin-input"
                  />
                </div>
                <div className="admin-field">
                  <label className="admin-label">Subtext</label>
                  <input
                    type="text"
                    value={data.metricSemestersSubtext || ''}
                    onChange={(e) => setData({ ...data, metricSemestersSubtext: e.target.value })}
                    className="admin-input"
                  />
                </div>
              </div>

              {/* Card 3 */}
              <div style={{ padding: '0.85rem', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px' }}>
                <div style={{ fontWeight: 700, fontSize: '0.85rem', color: '#d97706', marginBottom: '0.5rem' }}>Card 3 (Students)</div>
                <div className="admin-field" style={{ marginBottom: '0.5rem' }}>
                  <label className="admin-label">Value</label>
                  <input
                    type="text"
                    value={data.metricStudentsValue || ''}
                    onChange={(e) => setData({ ...data, metricStudentsValue: e.target.value })}
                    className="admin-input"
                  />
                </div>
                <div className="admin-field" style={{ marginBottom: '0.5rem' }}>
                  <label className="admin-label">Label</label>
                  <input
                    type="text"
                    value={data.metricStudentsLabel || ''}
                    onChange={(e) => setData({ ...data, metricStudentsLabel: e.target.value })}
                    className="admin-input"
                  />
                </div>
                <div className="admin-field">
                  <label className="admin-label">Subtext</label>
                  <input
                    type="text"
                    value={data.metricStudentsSubtext || ''}
                    onChange={(e) => setData({ ...data, metricStudentsSubtext: e.target.value })}
                    className="admin-input"
                  />
                </div>
              </div>

              {/* Card 4 */}
              <div style={{ padding: '0.85rem', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px' }}>
                <div style={{ fontWeight: 700, fontSize: '0.85rem', color: '#0f766e', marginBottom: '0.5rem' }}>Card 4 (Mentorship)</div>
                <div className="admin-field" style={{ marginBottom: '0.5rem' }}>
                  <label className="admin-label">Label</label>
                  <input
                    type="text"
                    value={data.metricMentorshipLabel || ''}
                    onChange={(e) => setData({ ...data, metricMentorshipLabel: e.target.value })}
                    className="admin-input"
                  />
                </div>
                <div className="admin-field">
                  <label className="admin-label">Subtext</label>
                  <input
                    type="text"
                    value={data.metricMentorshipSubtext || ''}
                    onChange={(e) => setData({ ...data, metricMentorshipSubtext: e.target.value })}
                    className="admin-input"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. TRAINING PHASES ROADMAP */}
      {activeTab === 'phases' && (
        <div className="admin-card" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div style={{ borderBottom: '1px solid #e2e8f0', paddingBottom: '0.75rem' }}>
            <h3 style={{ margin: 0, fontSize: '1.1rem', color: '#0f172a' }}>Training Phases Roadmap</h3>
            <p style={{ margin: '0.25rem 0 0', fontSize: '0.85rem', color: '#64748b' }}>
              The step-by-step roadmap cards displayed horizontally across the training timeline.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
            <div className="admin-field">
              <label className="admin-label">Section Tag</label>
              <input
                type="text"
                value={data.roadmapTag || ''}
                onChange={(e) => setData({ ...data, roadmapTag: e.target.value })}
                className="admin-input"
                placeholder="LEARNING ROADMAP"
              />
            </div>
            <div className="admin-field">
              <label className="admin-label">Section Title</label>
              <input
                type="text"
                value={data.roadmapTitle || ''}
                onChange={(e) => setData({ ...data, roadmapTitle: e.target.value })}
                className="admin-input"
                placeholder="Training Phases"
              />
            </div>
            <div className="admin-field">
              <label className="admin-label">Right Tag</label>
              <input
                type="text"
                value={data.roadmapRightTag || ''}
                onChange={(e) => setData({ ...data, roadmapRightTag: e.target.value })}
                className="admin-input"
                placeholder="BUILDING PROBLEM SOLVERS FOR TOMORROW"
              />
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.5rem' }}>
            <label className="admin-label" style={{ margin: 0, fontSize: '0.95rem' }}>
              Phases List ({data.phases.length})
            </label>
            <button
              type="button"
              onClick={() =>
                setData({
                  ...data,
                  phases: [
                    ...data.phases,
                    {
                      label: `Phase-${data.phases.length + 1}:`,
                      content: 'Syllabus curriculum details...',
                    },
                  ],
                })
              }
              className="admin-btn admin-btn--secondary"
              style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.8rem' }}
            >
              <Plus size={14} /> Add Phase
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            {data.phases.map((phase, idx) => (
              <div
                key={idx}
                style={{
                  padding: '1rem',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                  background: '#f8fafc',
                  display: 'flex',
                  gap: '0.75rem',
                  alignItems: 'flex-start',
                }}
              >
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                  <button
                    type="button"
                    onClick={() => setData({ ...data, phases: moveItem(data.phases, idx, 'up') })}
                    disabled={idx === 0}
                    className="admin-btn"
                    style={{ padding: '0.3rem 0.4rem', background: '#e2e8f0', border: 'none', cursor: 'pointer' }}
                    title="Move Up"
                  >
                    <ArrowUp size={13} />
                  </button>
                  <button
                    type="button"
                    onClick={() => setData({ ...data, phases: moveItem(data.phases, idx, 'down') })}
                    disabled={idx === data.phases.length - 1}
                    className="admin-btn"
                    style={{ padding: '0.3rem 0.4rem', background: '#e2e8f0', border: 'none', cursor: 'pointer' }}
                    title="Move Down"
                  >
                    <ArrowDown size={13} />
                  </button>
                </div>

                <div style={{ width: '140px' }}>
                  <label className="admin-label" style={{ fontSize: '0.75rem' }}>Phase Label</label>
                  <input
                    type="text"
                    value={phase.label}
                    onChange={(e) => {
                      const updated = [...data.phases];
                      updated[idx] = { ...updated[idx], label: e.target.value };
                      setData({ ...data, phases: updated });
                    }}
                    className="admin-input"
                    style={{ fontWeight: 700 }}
                  />
                </div>

                <div style={{ flex: 1 }}>
                  <label className="admin-label" style={{ fontSize: '0.75rem' }}>Curriculum Content / Syllabus</label>
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
                  style={{ padding: '0.55rem 0.65rem', marginTop: '1.25rem' }}
                  title="Remove phase"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. 02 - PROGRAM DETAILS */}
      {activeTab === 'details' && (
        <div className="admin-card" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div style={{ borderBottom: '1px solid #e2e8f0', paddingBottom: '0.75rem' }}>
            <h3 style={{ margin: 0, fontSize: '1.1rem', color: '#0f172a' }}>02 — Program Details</h3>
            <p style={{ margin: '0.25rem 0 0', fontSize: '0.85rem', color: '#64748b' }}>
              Detailed execution methodology paragraphs displayed under the 02 explore card.
            </p>
          </div>

          <div className="admin-field" style={{ maxWidth: '400px' }}>
            <label className="admin-label">Card Title</label>
            <input
              type="text"
              value={data.details02Title || ''}
              onChange={(e) => setData({ ...data, details02Title: e.target.value })}
              className="admin-input"
              placeholder="Program Details"
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <label className="admin-label" style={{ margin: 0, fontSize: '0.95rem' }}>
              Paragraphs List ({data.moreParagraphs.length})
            </label>
            <button
              type="button"
              onClick={() => setData({ ...data, moreParagraphs: [...data.moreParagraphs, ''] })}
              className="admin-btn admin-btn--secondary"
              style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.8rem' }}
            >
              <Plus size={14} /> Add Paragraph
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            {data.moreParagraphs.map((p, idx) => (
              <div
                key={idx}
                style={{
                  padding: '0.85rem',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                  background: '#f8fafc',
                  display: 'flex',
                  gap: '0.75rem',
                  alignItems: 'flex-start',
                }}
              >
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                  <button
                    type="button"
                    onClick={() => setData({ ...data, moreParagraphs: moveItem(data.moreParagraphs, idx, 'up') })}
                    disabled={idx === 0}
                    className="admin-btn"
                    style={{ padding: '0.3rem 0.4rem', background: '#e2e8f0', border: 'none', cursor: 'pointer' }}
                    title="Move Up"
                  >
                    <ArrowUp size={13} />
                  </button>
                  <button
                    type="button"
                    onClick={() => setData({ ...data, moreParagraphs: moveItem(data.moreParagraphs, idx, 'down') })}
                    disabled={idx === data.moreParagraphs.length - 1}
                    className="admin-btn"
                    style={{ padding: '0.3rem 0.4rem', background: '#e2e8f0', border: 'none', cursor: 'pointer' }}
                    title="Move Down"
                  >
                    <ArrowDown size={13} />
                  </button>
                </div>

                <div style={{ flex: 1 }}>
                  <label className="admin-label" style={{ fontSize: '0.75rem' }}>Paragraph {idx + 1}</label>
                  <textarea
                    rows={3}
                    value={p}
                    onChange={(e) => {
                      const updated = [...data.moreParagraphs];
                      updated[idx] = e.target.value;
                      setData({ ...data, moreParagraphs: updated });
                    }}
                    className="admin-textarea"
                  />
                </div>

                <button
                  type="button"
                  onClick={() => setData({ ...data, moreParagraphs: data.moreParagraphs.filter((_, i) => i !== idx) })}
                  className="admin-btn-danger"
                  style={{ padding: '0.55rem 0.65rem', marginTop: '1.25rem' }}
                  title="Remove paragraph"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. 03 - PLACEMENTS BATCH WISE */}
      {activeTab === 'batches' && (
        <div className="admin-card" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div style={{ borderBottom: '1px solid #e2e8f0', paddingBottom: '0.75rem' }}>
            <h3 style={{ margin: 0, fontSize: '1.1rem', color: '#0f172a' }}>03 — Placements Batch Wise</h3>
            <p style={{ margin: '0.25rem 0 0', fontSize: '0.85rem', color: '#64748b' }}>
              Batch wise placement numbers displayed under the 03 explore card.
            </p>
          </div>

          <div className="admin-field">
            <label className="admin-label">Section Heading / Title</label>
            <input
              type="text"
              value={data.batchesHeading || ''}
              onChange={(e) => setData({ ...data, batchesHeading: e.target.value })}
              className="admin-input"
              placeholder="Training (3-Phases) Completed & Placed students Batch wise with high packages."
            />
          </div>

          <div className="admin-field" style={{ maxWidth: '400px' }}>
            <label className="admin-label">Subheading / Note</label>
            <input
              type="text"
              value={data.batchesSubHeading || ''}
              onChange={(e) => setData({ ...data, batchesSubHeading: e.target.value })}
              className="admin-input"
              placeholder="Placements Batch Wise (10 LPA – 50 LPA):"
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.5rem' }}>
            <label className="admin-label" style={{ margin: 0, fontSize: '0.95rem' }}>
              Batches List ({data.batches.length})
            </label>
            <button
              type="button"
              onClick={() =>
                setData({
                  ...data,
                  batches: [...data.batches, { years: '2021-2025', count: '100' }],
                })
              }
              className="admin-btn admin-btn--secondary"
              style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.8rem' }}
            >
              <Plus size={14} /> Add Batch
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
            {data.batches.map((batch, idx) => (
              <div
                key={idx}
                style={{
                  display: 'flex',
                  gap: '0.75rem',
                  alignItems: 'center',
                  padding: '0.75rem',
                  background: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  borderRadius: '6px',
                }}
              >
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                  <button
                    type="button"
                    onClick={() => setData({ ...data, batches: moveItem(data.batches, idx, 'up') })}
                    disabled={idx === 0}
                    className="admin-btn"
                    style={{ padding: '0.2rem 0.35rem', background: '#e2e8f0', border: 'none', cursor: 'pointer' }}
                  >
                    <ArrowUp size={12} />
                  </button>
                  <button
                    type="button"
                    onClick={() => setData({ ...data, batches: moveItem(data.batches, idx, 'down') })}
                    disabled={idx === data.batches.length - 1}
                    className="admin-btn"
                    style={{ padding: '0.2rem 0.35rem', background: '#e2e8f0', border: 'none', cursor: 'pointer' }}
                  >
                    <ArrowDown size={12} />
                  </button>
                </div>

                <div style={{ width: '200px' }}>
                  <label className="admin-label" style={{ fontSize: '0.75rem', marginBottom: '0.25rem' }}>Batch Years</label>
                  <input
                    type="text"
                    placeholder="2020-2024"
                    value={batch.years}
                    onChange={(e) => {
                      const updated = [...data.batches];
                      updated[idx] = { ...updated[idx], years: e.target.value };
                      setData({ ...data, batches: updated });
                    }}
                    className="admin-input"
                    style={{ fontWeight: 600 }}
                  />
                </div>

                <div style={{ width: '160px' }}>
                  <label className="admin-label" style={{ fontSize: '0.75rem', marginBottom: '0.25rem' }}>Placed Count</label>
                  <input
                    type="text"
                    placeholder="142"
                    value={batch.count}
                    onChange={(e) => {
                      const updated = [...data.batches];
                      updated[idx] = { ...updated[idx], count: e.target.value };
                      setData({ ...data, batches: updated });
                    }}
                    className="admin-input"
                    style={{ fontWeight: 700, color: '#1d4ed8' }}
                  />
                </div>

                <div style={{ flex: 1, fontSize: '0.85rem', color: '#64748b' }}>
                  Preview: <strong>{batch.years}</strong> — <span style={{ color: '#1d4ed8', fontWeight: 600 }}>{batch.count} Placed</span>
                </div>

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
      )}

      {/* 5. 04 - KEY HIGHLIGHTS */}
      {activeTab === 'highlights' && (
        <div className="admin-card" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div style={{ borderBottom: '1px solid #e2e8f0', paddingBottom: '0.75rem' }}>
            <h3 style={{ margin: 0, fontSize: '1.1rem', color: '#0f172a' }}>04 — Key Highlights (Bullet Points)</h3>
            <p style={{ margin: '0.25rem 0 0', fontSize: '0.85rem', color: '#64748b' }}>
              Displayed as clean bullet points when the user expands the 04 Key Highlights card on the website.
            </p>
          </div>

          <div className="admin-field" style={{ maxWidth: '400px' }}>
            <label className="admin-label">Section Title</label>
            <input
              type="text"
              value={data.highlightsTitle || ''}
              onChange={(e) => setData({ ...data, highlightsTitle: e.target.value })}
              className="admin-input"
              placeholder="Key Highlights"
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.25rem' }}>
            <label className="admin-label" style={{ margin: 0, fontSize: '0.95rem' }}>
              Bullet Points ({(data.highlightsList || []).length})
            </label>
            <button
              type="button"
              onClick={() => {
                const current = data.highlightsList && data.highlightsList.length > 0
                  ? data.highlightsList
                  : data.highlightsContent
                  ? data.highlightsContent.split('\n').map((s) => s.trim()).filter(Boolean)
                  : [];
                const updated = [...current, ''];
                setData({
                  ...data,
                  highlightsList: updated,
                  highlightsContent: updated.join('\n\n'),
                });
              }}
              className="admin-btn admin-btn--secondary"
              style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.8rem' }}
            >
              <Plus size={14} /> Add Bullet Point
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {((data.highlightsList && data.highlightsList.length > 0)
              ? data.highlightsList
              : (data.highlightsContent ? data.highlightsContent.split('\n').map((s) => s.trim()).filter(Boolean) : [])
            ).map((point, idx, arr) => (
              <div
                key={idx}
                style={{
                  padding: '0.85rem',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                  background: '#f8fafc',
                  display: 'flex',
                  gap: '0.75rem',
                  alignItems: 'flex-start',
                }}
              >
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                  <button
                    type="button"
                    onClick={() => {
                      const moved = moveItem(arr, idx, 'up');
                      setData({
                        ...data,
                        highlightsList: moved,
                        highlightsContent: moved.join('\n\n'),
                      });
                    }}
                    disabled={idx === 0}
                    className="admin-btn"
                    style={{ padding: '0.25rem 0.35rem', background: '#e2e8f0', border: 'none', cursor: 'pointer' }}
                    title="Move Up"
                  >
                    <ArrowUp size={12} />
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      const moved = moveItem(arr, idx, 'down');
                      setData({
                        ...data,
                        highlightsList: moved,
                        highlightsContent: moved.join('\n\n'),
                      });
                    }}
                    disabled={idx === arr.length - 1}
                    className="admin-btn"
                    style={{ padding: '0.25rem 0.35rem', background: '#e2e8f0', border: 'none', cursor: 'pointer' }}
                    title="Move Down"
                  >
                    <ArrowDown size={12} />
                  </button>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', paddingTop: '0.5rem', color: '#3b82f6', fontWeight: 800 }}>
                  •
                </div>

                <div style={{ flex: 1 }}>
                  <textarea
                    rows={2}
                    value={point}
                    placeholder="Enter highlight text..."
                    onChange={(e) => {
                      const updated = [...arr];
                      updated[idx] = e.target.value;
                      setData({
                        ...data,
                        highlightsList: updated,
                        highlightsContent: updated.join('\n\n'),
                      });
                    }}
                    className="admin-textarea"
                  />
                </div>

                <button
                  type="button"
                  onClick={() => {
                    const updated = arr.filter((_, i) => i !== idx);
                    setData({
                      ...data,
                      highlightsList: updated,
                      highlightsContent: updated.join('\n\n'),
                    });
                  }}
                  className="admin-btn-danger"
                  style={{ padding: '0.55rem 0.65rem' }}
                  title="Remove point"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>

          <div className="admin-field" style={{ marginTop: '0.5rem' }}>
            <label className="admin-label" style={{ fontSize: '0.8rem', color: '#64748b' }}>
              Quick Bulk Edit (One bullet point per line)
            </label>
            <textarea
              rows={4}
              value={(data.highlightsList || (data.highlightsContent ? data.highlightsContent.split('\n').map((s) => s.trim()).filter(Boolean) : [])).join('\n')}
              onChange={(e) => {
                const lines = e.target.value.split('\n').map((s) => s.trim()).filter(Boolean);
                setData({
                  ...data,
                  highlightsList: lines,
                  highlightsContent: lines.join('\n\n'),
                });
              }}
              className="admin-textarea"
              placeholder="High success rates in top product companies...&#10;Programme running since 2017&#10;972 total placements across seven batches"
            />
          </div>
        </div>
      )}

      {/* 6. 05 - FACILITIES & EQUIPMENT */}
      {activeTab === 'facilities' && (
        <div className="admin-card" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div style={{ borderBottom: '1px solid #e2e8f0', paddingBottom: '0.75rem' }}>
            <h3 style={{ margin: 0, fontSize: '1.1rem', color: '#0f172a' }}>05 — Facilities & Equipment</h3>
            <p style={{ margin: '0.25rem 0 0', fontSize: '0.85rem', color: '#64748b' }}>
              Displayed when the user expands the 05 Facilities & Equipment card.
            </p>
          </div>

          <div className="admin-field" style={{ maxWidth: '400px' }}>
            <label className="admin-label">Section Title</label>
            <input
              type="text"
              value={data.facilitiesTitle || ''}
              onChange={(e) => setData({ ...data, facilitiesTitle: e.target.value })}
              className="admin-input"
              placeholder="Facilities & Equipment"
            />
          </div>

          <div className="admin-field">
            <label className="admin-label">Facilities Content Text</label>
            <textarea
              rows={4}
              value={data.facilitiesContent || ''}
              onChange={(e) => setData({ ...data, facilitiesContent: e.target.value })}
              className="admin-textarea"
              placeholder="High-speed computing labs, online contest platforms (HackerRank, CodeChef, Codeforces)..."
            />
          </div>
        </div>
      )}

      {/* 7. 06 - OUTCOMES & ACHIEVEMENTS */}
      {activeTab === 'outcomes' && (
        <div className="admin-card" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div style={{ borderBottom: '1px solid #e2e8f0', paddingBottom: '0.75rem' }}>
            <h3 style={{ margin: 0, fontSize: '1.1rem', color: '#0f172a' }}>06 — Outcomes & Achievements</h3>
            <p style={{ margin: '0.25rem 0 0', fontSize: '0.85rem', color: '#64748b' }}>
              Displayed when the user expands the 06 Outcomes & Achievements card.
            </p>
          </div>

          <div className="admin-field" style={{ maxWidth: '400px' }}>
            <label className="admin-label">Section Title</label>
            <input
              type="text"
              value={data.outcomesTitle || ''}
              onChange={(e) => setData({ ...data, outcomesTitle: e.target.value })}
              className="admin-input"
              placeholder="Outcomes & Achievements"
            />
          </div>

          <div className="admin-field">
            <label className="admin-label">Outcomes Content Text</label>
            <textarea
              rows={4}
              value={data.outcomesContent || ''}
              onChange={(e) => setData({ ...data, outcomesContent: e.target.value })}
              className="admin-textarea"
              placeholder="Over 970+ students placed in top MNCs over the past 7 years..."
            />
          </div>
        </div>
      )}

      {/* 8. 07 - PARTNERS */}
      {activeTab === 'partners' && (
        <div className="admin-card" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div style={{ borderBottom: '1px solid #e2e8f0', paddingBottom: '0.75rem' }}>
            <h3 style={{ margin: 0, fontSize: '1.1rem', color: '#0f172a' }}>07 — Partners</h3>
            <p style={{ margin: '0.25rem 0 0', fontSize: '0.85rem', color: '#64748b' }}>
              Displayed when the user expands the 07 Partners card.
            </p>
          </div>

          <div className="admin-field" style={{ maxWidth: '400px' }}>
            <label className="admin-label">Section Title</label>
            <input
              type="text"
              value={data.partnersTitle || ''}
              onChange={(e) => setData({ ...data, partnersTitle: e.target.value })}
              className="admin-input"
              placeholder="Partners"
            />
          </div>

          <div className="admin-field">
            <label className="admin-label">Partners Content Text</label>
            <textarea
              rows={4}
              value={data.partnersContent || ''}
              onChange={(e) => setData({ ...data, partnersContent: e.target.value })}
              className="admin-textarea"
              placeholder="Smart Interviews, HackerRank, TCS (CodeVita), Infosys (HackWithInfy), CodeChef, and Codeforces."
            />
          </div>
        </div>
      )}

      {/* 9. STATS & CTA BANNERS */}
      {activeTab === 'banners' && (
        <div className="admin-card" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div style={{ borderBottom: '1px solid #e2e8f0', paddingBottom: '0.75rem' }}>
            <h3 style={{ margin: 0, fontSize: '1.1rem', color: '#0f172a' }}>Highlight Stats Banner</h3>
            <p style={{ margin: '0.25rem 0 0', fontSize: '0.85rem', color: '#64748b' }}>
              The high-impact banner between the detailed accordion grid and custom sections.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
            <div className="admin-field">
              <label className="admin-label">Left Column Line 1</label>
              <input
                type="text"
                value={data.bannerCol1Line1 || ''}
                onChange={(e) => setData({ ...data, bannerCol1Line1: e.target.value })}
                className="admin-input"
                placeholder="TALENT TODAY"
              />
            </div>
            <div className="admin-field">
              <label className="admin-label">Left Column Line 2</label>
              <input
                type="text"
                value={data.bannerCol1Line2 || ''}
                onChange={(e) => setData({ ...data, bannerCol1Line2: e.target.value })}
                className="admin-input"
                placeholder="OPPORTUNITIES TOMORROW"
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '150px 1fr', gap: '1rem' }}>
            <div className="admin-field">
              <label className="admin-label">Stat Number</label>
              <input
                type="text"
                value={data.bannerStatNum || ''}
                onChange={(e) => setData({ ...data, bannerStatNum: e.target.value })}
                className="admin-input"
                placeholder="400"
                style={{ fontWeight: 700, fontSize: '1.1rem', color: '#1d4ed8' }}
              />
            </div>
            <div className="admin-field">
              <label className="admin-label">Stat Label</label>
              <input
                type="text"
                value={data.bannerStatLabel || ''}
                onChange={(e) => setData({ ...data, bannerStatLabel: e.target.value })}
                className="admin-input"
                placeholder="STUDENTS ANNUALLY"
              />
            </div>
          </div>

          <div className="admin-field">
            <label className="admin-label">Stat Description</label>
            <textarea
              rows={2}
              value={data.bannerStatDesc || ''}
              onChange={(e) => setData({ ...data, bannerStatDesc: e.target.value })}
              className="admin-textarea"
              placeholder="Selected via HackerRank coding contests, and students are mentored by previously placed graduates."
            />
          </div>

          <div className="admin-field" style={{ maxWidth: '400px' }}>
            <label className="admin-label">Right Column Text (Newlines separated)</label>
            <textarea
              rows={3}
              value={data.bannerCol3Text || ''}
              onChange={(e) => setData({ ...data, bannerCol3Text: e.target.value })}
              className="admin-textarea"
              placeholder="SKILLS&#10;OPPORTUNITIES&#10;GLOBAL CAREERS"
            />
          </div>

          <div style={{ borderBottom: '1px solid #e2e8f0', paddingBottom: '0.75rem', marginTop: '1rem' }}>
            <h3 style={{ margin: 0, fontSize: '1.1rem', color: '#0f172a' }}>University CTA Banner</h3>
            <p style={{ margin: '0.25rem 0 0', fontSize: '0.85rem', color: '#64748b' }}>
              The bottom conversion banner leading visitors to explore more differentiators.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
            <div className="admin-field">
              <label className="admin-label">CTA Tag</label>
              <input
                type="text"
                value={data.ctaTag || ''}
                onChange={(e) => setData({ ...data, ctaTag: e.target.value })}
                className="admin-input"
                placeholder="YOUR NEXT OPPORTUNITY AWAITS"
              />
            </div>
            <div className="admin-field">
              <label className="admin-label">CTA Title</label>
              <input
                type="text"
                value={data.ctaTitle || ''}
                onChange={(e) => setData({ ...data, ctaTitle: e.target.value })}
                className="admin-input"
                placeholder="Explore More Differentiators"
              />
            </div>
          </div>

          <div className="admin-field">
            <label className="admin-label">CTA Description</label>
            <textarea
              rows={2}
              value={data.ctaDesc || ''}
              onChange={(e) => setData({ ...data, ctaDesc: e.target.value })}
              className="admin-textarea"
              placeholder="Discover all the unique initiatives, labs, and centres that make VWU an extraordinary place to learn and grow."
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
            <div className="admin-field">
              <label className="admin-label">Button Text</label>
              <input
                type="text"
                value={data.ctaButtonText || ''}
                onChange={(e) => setData({ ...data, ctaButtonText: e.target.value })}
                className="admin-input"
                placeholder="All Differentiators"
              />
            </div>
            <div className="admin-field">
              <label className="admin-label">Button Link</label>
              <input
                type="text"
                value={data.ctaButtonLink || ''}
                onChange={(e) => setData({ ...data, ctaButtonLink: e.target.value })}
                className="admin-input"
                placeholder="/differentiators"
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="admin-field">
              <label className="admin-label">Tech Box Text</label>
              <textarea
                rows={4}
                value={data.ctaTechBox || ''}
                onChange={(e) => setData({ ...data, ctaTechBox: e.target.value })}
                className="admin-textarea"
                placeholder="BETTER&#10;LEARNERS&#10;BRIGHTER&#10;FUTURES"
              />
            </div>
            <div className="admin-field">
              <label className="admin-label">Keywords Text</label>
              <textarea
                rows={4}
                value={data.ctaKeywords || ''}
                onChange={(e) => setData({ ...data, ctaKeywords: e.target.value })}
                className="admin-textarea"
                placeholder="LEARN&#10;EXPLORE&#10;GROW&#10;BELONG"
              />
            </div>
          </div>
        </div>
      )}

      {/* 10. CUSTOM SECTIONS */}
      {activeTab === 'custom-sections' && (
        <div className="admin-card" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.75rem' }}>
            <div>
              <h3 style={{ margin: 0, fontSize: '1.1rem', color: '#0f172a' }}>Dynamic Custom Sections</h3>
              <p style={{ margin: '0.25rem 0 0', fontSize: '0.85rem', color: '#64748b' }}>
                Add extra bespoke sections (with paragraphs & bullet points) rendered directly on the public page.
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                const newSec: CustomSmartInterviewsSection = {
                  id: `sec-${Date.now()}`,
                  title: 'New Section',
                  badge: 'Special Feature',
                  paragraphs: ['Section description...'],
                  bulletPoints: [],
                };
                setData({
                  ...data,
                  additionalSections: [...(data.additionalSections || []), newSec],
                });
              }}
              className="admin-btn admin-btn--secondary"
              style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.8rem' }}
            >
              <Plus size={14} /> Add Custom Section
            </button>
          </div>

          {(!data.additionalSections || data.additionalSections.length === 0) ? (
            <div style={{ textAlign: 'center', padding: '2rem', color: '#94a3b8', background: '#f8fafc', borderRadius: '8px', border: '1px dashed #cbd5e1' }}>
              No custom sections added yet. Click &ldquo;Add Custom Section&rdquo; above if you want to add additional bespoke content.
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {data.additionalSections.map((sec, idx) => (
                <div
                  key={sec.id || idx}
                  style={{
                    padding: '1.25rem',
                    border: '1px solid #cbd5e1',
                    borderRadius: '8px',
                    background: '#f8fafc',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '1rem',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontWeight: 700, fontSize: '0.95rem', color: '#1e293b' }}>
                      Section #{idx + 1}: {sec.title || 'Untitled'}
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        setData({
                          ...data,
                          additionalSections: (data.additionalSections || []).filter((_, i) => i !== idx),
                        })
                      }
                      className="admin-btn-danger"
                      style={{ padding: '0.4rem 0.6rem', fontSize: '0.8rem' }}
                    >
                      <Trash2 size={13} /> Remove Section
                    </button>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div className="admin-field">
                      <label className="admin-label">Section Title</label>
                      <input
                        type="text"
                        value={sec.title}
                        onChange={(e) => {
                          const updated = [...(data.additionalSections || [])];
                          updated[idx] = { ...updated[idx], title: e.target.value };
                          setData({ ...data, additionalSections: updated });
                        }}
                        className="admin-input"
                        placeholder="Section Title"
                      />
                    </div>
                    <div className="admin-field">
                      <label className="admin-label">Section Badge / Subtitle</label>
                      <input
                        type="text"
                        value={sec.badge || ''}
                        onChange={(e) => {
                          const updated = [...(data.additionalSections || [])];
                          updated[idx] = { ...updated[idx], badge: e.target.value };
                          setData({ ...data, additionalSections: updated });
                        }}
                        className="admin-input"
                        placeholder="e.g. Highlights"
                      />
                    </div>
                  </div>

                  <div className="admin-field">
                    <label className="admin-label">Paragraphs (Separate by empty line)</label>
                    <textarea
                      rows={3}
                      value={(sec.paragraphs || []).join('\n\n')}
                      onChange={(e) => {
                        const updated = [...(data.additionalSections || [])];
                        updated[idx] = {
                          ...updated[idx],
                          paragraphs: e.target.value.split('\n\n').map((p) => p.trim()).filter(Boolean),
                        };
                        setData({ ...data, additionalSections: updated });
                      }}
                      className="admin-textarea"
                      placeholder="Write paragraphs here..."
                    />
                  </div>

                  <div className="admin-field">
                    <label className="admin-label">Bullet Points (One per line)</label>
                    <textarea
                      rows={3}
                      value={(sec.bulletPoints || []).join('\n')}
                      onChange={(e) => {
                        const updated = [...(data.additionalSections || [])];
                        updated[idx] = {
                          ...updated[idx],
                          bulletPoints: e.target.value.split('\n').map((b) => b.trim()).filter(Boolean),
                        };
                        setData({ ...data, additionalSections: updated });
                      }}
                      className="admin-textarea"
                      placeholder="Point 1&#10;Point 2&#10;Point 3"
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
