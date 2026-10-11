import { useState, useEffect } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { setDoc, updateDoc } from '../../../lib/auditLog';
import { db } from '../../../lib/firebase';
import {
  assistiveTechLab,
  defaultAtlCustomSections,
  type AtlMember,
  type AtlYearTraining,
  type AtlDevice,
  type AtlCommunityEvent,
  type AtlStudentRosterYear,
  type AtlExhibitionYear,
  type AtlExhibitionShowcase,
  type AtlProjectOutcome,
  type AtlClientVisitYear,
  type AtlInnovationFair,
  type AtlBlock,
} from '../../Differentiators/assistiveTechLab.data';
import {
  Plus,
  Trash2,
  Save,
  RotateCcw,
  Check,
  Sparkles,
  BookOpen,
  Users,
  Cpu,
  Calendar,
  Wrench,
  Globe2,
  Layers,
  ChevronUp,
  ChevronDown,
} from 'lucide-react';
import CustomSectionEditor from './CustomSectionEditor';
import { replaceAtPath, getAtPath, type CustomSection } from '../../../lib/customSections';
import { deleteFile, type UploadResult } from '../../../lib/storage';

export type AssistiveTechLabDoc = typeof assistiveTechLab & {
  studentRosters?: AtlStudentRosterYear[];
  exhibitionReports?: AtlExhibitionYear[];
  exhibitionShowcases?: AtlExhibitionShowcase[];
  atlOutcomes?: AtlProjectOutcome[];
  clientVisits?: AtlClientVisitYear[];
  innovationFairs?: AtlInnovationFair[];
  customSections?: CustomSection[];
};

function AtlBlockListEditor({
  blocks,
  onChange,
}: {
  blocks: AtlBlock[];
  onChange: (nextBlocks: AtlBlock[]) => void;
}) {
  const updateBlock = (idx: number, patch: Partial<AtlBlock>) => {
    const next = [...blocks];
    next[idx] = { ...next[idx], ...patch } as AtlBlock;
    onChange(next);
  };

  const removeBlock = (idx: number) => {
    onChange(blocks.filter((_, i) => i !== idx));
  };

  const moveBlock = (idx: number, dir: -1 | 1) => {
    const target = idx + dir;
    if (target < 0 || target >= blocks.length) return;
    const next = [...blocks];
    const tmp = next[idx];
    next[idx] = next[target];
    next[target] = tmp;
    onChange(next);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
        <span style={{ fontWeight: 700, fontSize: '0.9rem', color: '#0f172a' }}>
          Report Content Blocks ({blocks.length}):
        </span>
        <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
          <button
            type="button"
            onClick={() => onChange([...blocks, { type: 'paragraph', text: '' }])}
            className="admin-btn admin-btn--secondary"
            style={{ fontSize: '0.75rem', padding: '0.3rem 0.55rem' }}
          >
            <Plus size={12} /> Add Paragraph
          </button>
          <button
            type="button"
            onClick={() => onChange([...blocks, { type: 'heading', text: '' }])}
            className="admin-btn admin-btn--secondary"
            style={{ fontSize: '0.75rem', padding: '0.3rem 0.55rem' }}
          >
            <Plus size={12} /> Add Heading
          </button>
          <button
            type="button"
            onClick={() => onChange([...blocks, { type: 'meta', items: [{ label: 'Date', value: '' }, { label: 'Location', value: '' }] }])}
            className="admin-btn admin-btn--secondary"
            style={{ fontSize: '0.75rem', padding: '0.3rem 0.55rem' }}
          >
            <Plus size={12} /> Add Meta Details
          </button>
          <button
            type="button"
            onClick={() => onChange([...blocks, { type: 'bullets', items: [''] }])}
            className="admin-btn admin-btn--secondary"
            style={{ fontSize: '0.75rem', padding: '0.3rem 0.55rem' }}
          >
            <Plus size={12} /> Add Bullets
          </button>
          <button
            type="button"
            onClick={() => onChange([...blocks, { type: 'numbered', items: [''] }])}
            className="admin-btn admin-btn--secondary"
            style={{ fontSize: '0.75rem', padding: '0.3rem 0.55rem' }}
          >
            <Plus size={12} /> Add Numbered
          </button>
        </div>
      </div>

      {blocks.map((blk, bIdx) => (
        <div
          key={bIdx}
          style={{
            background: '#f8fafc',
            border: '1px solid #cbd5e1',
            borderRadius: '8px',
            padding: '0.85rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.6rem',
          }}
        >
          {/* Header Bar for Block */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.4rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ fontWeight: 700, fontSize: '0.8rem', color: '#475569' }}>
                Block #{bIdx + 1}
              </span>
              <select
                className="admin-input"
                style={{ fontSize: '0.8rem', padding: '0.2rem 0.4rem', fontWeight: 600, color: '#0284c7' }}
                value={blk.type}
                onChange={(e) => {
                  const newType = e.target.value as AtlBlock['type'];
                  if (newType === 'paragraph') updateBlock(bIdx, { type: 'paragraph', text: '' } as AtlBlock);
                  else if (newType === 'heading') updateBlock(bIdx, { type: 'heading', text: '' } as AtlBlock);
                  else if (newType === 'meta') updateBlock(bIdx, { type: 'meta', items: [{ label: 'Label', value: 'Value' }] } as AtlBlock);
                  else if (newType === 'bullets') updateBlock(bIdx, { type: 'bullets', items: ['Item 1'] } as AtlBlock);
                  else if (newType === 'numbered') updateBlock(bIdx, { type: 'numbered', items: ['Item 1'] } as AtlBlock);
                }}
              >
                <option value="paragraph">Paragraph</option>
                <option value="heading">Heading</option>
                <option value="meta">Meta Information (Date / Location)</option>
                <option value="bullets">Bullet List</option>
                <option value="numbered">Numbered List</option>
              </select>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
              <button
                type="button"
                disabled={bIdx === 0}
                onClick={() => moveBlock(bIdx, -1)}
                className="admin-btn admin-btn--secondary"
                style={{ padding: '0.2rem 0.4rem' }}
                title="Move Block Up"
              >
                <ChevronUp size={12} />
              </button>
              <button
                type="button"
                disabled={bIdx === blocks.length - 1}
                onClick={() => moveBlock(bIdx, 1)}
                className="admin-btn admin-btn--secondary"
                style={{ padding: '0.2rem 0.4rem' }}
                title="Move Block Down"
              >
                <ChevronDown size={12} />
              </button>
              <button
                type="button"
                onClick={() => removeBlock(bIdx)}
                className="admin-btn-danger"
                style={{ padding: '0.25rem 0.45rem', fontSize: '0.75rem' }}
                title="Delete Block"
              >
                <Trash2 size={12} />
              </button>
            </div>
          </div>

          {/* Block Editor Content */}
          {blk.type === 'paragraph' && (
            <textarea
              rows={5}
              className="admin-textarea"
              value={blk.text}
              onChange={(e) => updateBlock(bIdx, { text: e.target.value })}
              placeholder="Enter paragraph text..."
            />
          )}

          {blk.type === 'heading' && (
            <input
              type="text"
              className="admin-input"
              style={{ fontWeight: 700 }}
              value={blk.text}
              onChange={(e) => updateBlock(bIdx, { text: e.target.value })}
              placeholder="Enter Section Heading (e.g. Objectives, Itinerary)..."
            />
          )}

          {blk.type === 'meta' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label className="admin-field__hint" style={{ margin: 0, fontWeight: 600 }}>Key Meta Items (e.g. Date, Location, Participants):</label>
              {(blk.items || []).map((mItem, mIdx) => (
                <div key={mIdx} style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                  <input
                    type="text"
                    className="admin-input"
                    style={{ flex: 1, fontWeight: 600 }}
                    value={mItem.label}
                    onChange={(e) => {
                      const nextItems = [...(blk.items || [])];
                      nextItems[mIdx] = { ...nextItems[mIdx], label: e.target.value };
                      updateBlock(bIdx, { items: nextItems });
                    }}
                    placeholder="Meta Label (e.g. Date)"
                  />
                  <input
                    type="text"
                    className="admin-input"
                    style={{ flex: 2 }}
                    value={mItem.value}
                    onChange={(e) => {
                      const nextItems = [...(blk.items || [])];
                      nextItems[mIdx] = { ...nextItems[mIdx], value: e.target.value };
                      updateBlock(bIdx, { items: nextItems });
                    }}
                    placeholder="Meta Value (e.g. 26-08-2023)"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const nextItems = (blk.items || []).filter((_, i) => i !== mIdx);
                      updateBlock(bIdx, { items: nextItems });
                    }}
                    className="admin-btn-danger"
                    style={{ padding: '0.35rem' }}
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => {
                  const nextItems = [...(blk.items || []), { label: 'Field', value: '' }];
                  updateBlock(bIdx, { items: nextItems });
                }}
                className="admin-btn admin-btn--secondary"
                style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem', alignSelf: 'flex-start' }}
              >
                <Plus size={12} /> Add Meta Item
              </button>
            </div>
          )}

          {(blk.type === 'bullets' || blk.type === 'numbered') && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
              <label className="admin-field__hint" style={{ margin: 0, fontWeight: 600 }}>List Items (enter one item per line):</label>
              <textarea
                rows={5}
                className="admin-textarea"
                value={(blk.items || []).join('\n')}
                onChange={(e) => {
                  const lines = e.target.value.split('\n');
                  updateBlock(bIdx, { items: lines });
                }}
                placeholder="Enter list items (one per line)..."
              />
            </div>
          )}

          {blk.type === 'boldBullets' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label className="admin-field__hint" style={{ margin: 0, fontWeight: 600 }}>Bold Lead & Text Items:</label>
              {(blk.items || []).map((bItem, bIdx2) => (
                <div key={bIdx2} style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                  <input
                    type="text"
                    className="admin-input"
                    style={{ flex: 1, fontWeight: 700 }}
                    value={bItem.lead}
                    onChange={(e) => {
                      const nextItems = [...(blk.items || [])];
                      nextItems[bIdx2] = { ...nextItems[bIdx2], lead: e.target.value };
                      updateBlock(bIdx, { items: nextItems });
                    }}
                    placeholder="Lead (e.g. 9:00 AM:)"
                  />
                  <input
                    type="text"
                    className="admin-input"
                    style={{ flex: 2 }}
                    value={bItem.text}
                    onChange={(e) => {
                      const nextItems = [...(blk.items || [])];
                      nextItems[bIdx2] = { ...nextItems[bIdx2], text: e.target.value };
                      updateBlock(bIdx, { items: nextItems });
                    }}
                    placeholder="Text..."
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const nextItems = (blk.items || []).filter((_, i) => i !== bIdx2);
                      updateBlock(bIdx, { items: nextItems });
                    }}
                    className="admin-btn-danger"
                    style={{ padding: '0.35rem' }}
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => {
                  const nextItems = [...(blk.items || []), { lead: '', text: '' }];
                  updateBlock(bIdx, { items: nextItems });
                }}
                className="admin-btn admin-btn--secondary"
                style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem', alignSelf: 'flex-start' }}
              >
                <Plus size={12} /> Add Item
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export default function AssistiveTechContentAdmin() {
  const [data, setData] = useState<AssistiveTechLabDoc>({
    ...assistiveTechLab,
    studentRosters: [],
    exhibitionReports: assistiveTechLab.exhibitionReports || [],
    exhibitionShowcases: assistiveTechLab.exhibitionShowcases || [],
    atlOutcomes: assistiveTechLab.atlOutcomes || [],
    clientVisits: assistiveTechLab.clientVisits || [],
    innovationFairs: assistiveTechLab.innovationFairs || [],
    customSections: [],
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [activeAdminStudentTab, setActiveAdminStudentTab] = useState(0);
  const [activeAdminExhibitionTab, setActiveAdminExhibitionTab] = useState(0);
  const [activeAdminShowcaseTab, setActiveAdminShowcaseTab] = useState(0);
  const [activeAdminOutcomeTab, setActiveAdminOutcomeTab] = useState(0);
  const [activeAdminClientVisitTab, setActiveAdminClientVisitTab] = useState(0);
  const [activeAdminInnovationTab, setActiveAdminInnovationTab] = useState(0);

  const [eightSections, setEightSections] = useState<{
    collaborations: CustomSection;
    clients: CustomSection;
    testimonials: CustomSection;
    seminars: CustomSection;
    people: CustomSection;
    publications: CustomSection;
    outcomes: CustomSection;
    partners: CustomSection;
  }>({
    collaborations: defaultAtlCustomSections.find((s) => s.id === 'collaborations') || { id: 'collaborations', label: 'Collaborations', contentType: 'text', textContent: '' },
    clients: defaultAtlCustomSections.find((s) => s.id === 'clients') || { id: 'clients', label: 'Clients', contentType: 'list', listText: '' },
    testimonials: defaultAtlCustomSections.find((s) => s.id === 'testimonials') || { id: 'testimonials', label: 'Testimonials', contentType: 'list', listText: '' },
    seminars: defaultAtlCustomSections.find((s) => s.id === 'seminars') || { id: 'seminars', label: 'Seminars', contentType: 'list', listText: '' },
    people: defaultAtlCustomSections.find((s) => s.id === 'people') || { id: 'people', label: 'People / Institutions Involved', contentType: 'text', textContent: '' },
    publications: defaultAtlCustomSections.find((s) => s.id === 'publications') || { id: 'publications', label: 'Publications', contentType: 'list', listText: '' },
    outcomes: defaultAtlCustomSections.find((s) => s.id === 'outcomes') || { id: 'outcomes', label: 'Outcomes & Achievements', contentType: 'text', textContent: '' },
    partners: defaultAtlCustomSections.find((s) => s.id === 'partners') || { id: 'partners', label: 'Partners', contentType: 'text', textContent: '' },
  });

  useEffect(() => {
    async function loadData() {
      try {
        const snap = await getDoc(doc(db, 'settings', 'assistiveTechLab'));
        if (snap.exists()) {
          const remote = snap.data() as Partial<AssistiveTechLabDoc>;
          const defaultRosters: AtlStudentRosterYear[] = (remote.studentRosters && remote.studentRosters.length > 0)
            ? remote.studentRosters
            : [
                { id: '2023-24', yearLabel: remote.studentsBenefitted?.yearLabel || assistiveTechLab.studentsBenefitted.yearLabel, type: 'batches', batches: remote.studentsBenefitted?.batches || assistiveTechLab.studentsBenefitted.batches },
                { id: '2024-25', yearLabel: remote.studentsBenefitted2024?.yearLabel || assistiveTechLab.studentsBenefitted2024.yearLabel, type: 'batches', batches: remote.studentsBenefitted2024?.batches || assistiveTechLab.studentsBenefitted2024.batches },
                { id: '2025-26', yearLabel: 'ATL Selected Students (2025-26)', type: 'table', table: remote.selectedStudents2025 || assistiveTechLab.selectedStudents2025 },
              ];

          const rawCustom: CustomSection[] = (remote.customSections && remote.customSections.length > 0)
            ? remote.customSections
            : (assistiveTechLab.customSections || defaultAtlCustomSections || []);

          const findSection = (id: string, defaultSec?: CustomSection): CustomSection => {
            const match = rawCustom.find((s) => s.id === id || (s.label || '').trim().toLowerCase() === (defaultSec?.label || '').toLowerCase());
            return match || defaultSec || { id, label: id, contentType: 'text', textContent: '' };
          };

          setEightSections({
            collaborations: findSection('collaborations', defaultAtlCustomSections.find((s) => s.id === 'collaborations')),
            clients: findSection('clients', defaultAtlCustomSections.find((s) => s.id === 'clients')),
            testimonials: findSection('testimonials', defaultAtlCustomSections.find((s) => s.id === 'testimonials')),
            seminars: findSection('seminars', defaultAtlCustomSections.find((s) => s.id === 'seminars')),
            people: findSection('people', defaultAtlCustomSections.find((s) => s.id === 'people')),
            publications: findSection('publications', defaultAtlCustomSections.find((s) => s.id === 'publications')),
            outcomes: findSection('outcomes', defaultAtlCustomSections.find((s) => s.id === 'outcomes')),
            partners: findSection('partners', defaultAtlCustomSections.find((s) => s.id === 'partners')),
          });

          setData({
            ...assistiveTechLab,
            ...remote,
            paragraphs: remote.paragraphs || assistiveTechLab.paragraphs,
            vision: remote.vision !== undefined ? remote.vision : assistiveTechLab.vision,
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
            studentRosters: defaultRosters,
            exhibitionReports: (remote.exhibitionReports && remote.exhibitionReports.length > 0)
              ? remote.exhibitionReports
              : (assistiveTechLab.exhibitionReports || []),
            exhibitionShowcases: (remote.exhibitionShowcases && remote.exhibitionShowcases.length > 0)
              ? remote.exhibitionShowcases
              : (assistiveTechLab.exhibitionShowcases || []),
            atlOutcomes: (remote.atlOutcomes && remote.atlOutcomes.length > 0)
              ? remote.atlOutcomes
              : (assistiveTechLab.atlOutcomes || []),
            clientVisits: (remote.clientVisits && remote.clientVisits.length > 0)
              ? remote.clientVisits
              : (assistiveTechLab.clientVisits || []),
            innovationFairs: (remote.innovationFairs && remote.innovationFairs.length > 0)
              ? remote.innovationFairs
              : (assistiveTechLab.innovationFairs || []),
            customSections: rawCustom.filter((s) => {
              const title = (s.label || '').trim().toLowerCase();
              const id = (s.id || '').trim().toLowerCase();
              const isEight =
                id === 'collaborations' || title === 'collaborations' ||
                id === 'clients' || title === 'clients' ||
                id === 'testimonials' || title === 'testimonials' ||
                id === 'seminars' || title === 'seminars' ||
                id === 'people' || title.includes('people') || title.includes('institutions involved') ||
                id === 'publications' || title === 'publications' ||
                id === 'outcomes' || title.includes('outcomes') ||
                id === 'partners' || title === 'partners';

              const isExcluded =
                isEight ||
                title === 'team' ||
                title.startsWith('atl activities') ||
                title === 'key highlights' ||
                title === 'highlights' ||
                s.id === 'highlights' ||
                title.startsWith('students benefitted') ||
                title.startsWith('atl selected students') ||
                title.includes('selected students') ||
                title.includes('international day of persons with disabilities') ||
                title.includes('exhibition day') ||
                title.includes('kl university') ||
                title.includes('iit madras') ||
                title.includes('telangana') ||
                title.includes('projects exhibiting') ||
                title.includes('trance') ||
                title.includes('iic regional') ||
                title.includes('zion') ||
                title.includes('client visit') ||
                title.includes('jntu kakinada') ||
                title.includes('avishkandhra') ||
                title.includes('rtih') ||
                title.includes('incubation center inauguration') ||
                title.includes('project expo at rajahmundry') ||
                title.includes('innovation project fair');
              return !isExcluded;
            }),
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
      const fullCustomSections = [
        eightSections.collaborations,
        eightSections.clients,
        eightSections.testimonials,
        eightSections.seminars,
        eightSections.people,
        eightSections.publications,
        eightSections.outcomes,
        eightSections.partners,
        ...(data.customSections || []),
      ];

      const dataToSave = {
        ...data,
        customSections: fullCustomSections,
      };

      await setDoc(doc(db, 'settings', 'assistiveTechLab'), dataToSave);
      try {
        await updateDoc(doc(db, 'differentiators', 'assistive-tech-lab'), {
          customSections: fullCustomSections,
        });
      } catch (e) {
        // Ignored if differentiator doc key doesn't exist
      }
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      console.error('Failed to save Assistive Tech Lab data:', err);
      alert('Failed to save changes. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    if (confirm('Reset all Assistive Technology Lab content to original defaults?')) {
      const defaultEight = {
        collaborations: defaultAtlCustomSections.find((s) => s.id === 'collaborations') || { id: 'collaborations', label: 'Collaborations', contentType: 'text', textContent: '' },
        clients: defaultAtlCustomSections.find((s) => s.id === 'clients') || { id: 'clients', label: 'Clients', contentType: 'list', listText: '' },
        testimonials: defaultAtlCustomSections.find((s) => s.id === 'testimonials') || { id: 'testimonials', label: 'Testimonials', contentType: 'list', listText: '' },
        seminars: defaultAtlCustomSections.find((s) => s.id === 'seminars') || { id: 'seminars', label: 'Seminars', contentType: 'list', listText: '' },
        people: defaultAtlCustomSections.find((s) => s.id === 'people') || { id: 'people', label: 'People / Institutions Involved', contentType: 'text', textContent: '' },
        publications: defaultAtlCustomSections.find((s) => s.id === 'publications') || { id: 'publications', label: 'Publications', contentType: 'list', listText: '' },
        outcomes: defaultAtlCustomSections.find((s) => s.id === 'outcomes') || { id: 'outcomes', label: 'Outcomes & Achievements', contentType: 'text', textContent: '' },
        partners: defaultAtlCustomSections.find((s) => s.id === 'partners') || { id: 'partners', label: 'Partners', contentType: 'text', textContent: '' },
      };
      setEightSections(defaultEight);
      setData({
        ...assistiveTechLab,
        customSections: [],
      });
    }
  };

  // Upload handlers for Custom Sections
  const handleCustomSectionFileUploaded = (sectionPath: number[], fileIndex: number, r: UploadResult) => {
    setData((p) => ({
      ...p,
      customSections: replaceAtPath(p.customSections || [], sectionPath, (s) => ({
        ...s,
        files: (s.files || []).map((f, i) => (i === fileIndex ? { ...f, fileUrl: r.url, storagePath: r.path } : f)),
      })),
    }));
  };

  const handleCustomSectionFileRemoved = async (sectionPath: number[], fileIndex: number) => {
    const file = getAtPath(data.customSections || [], sectionPath)?.files?.[fileIndex];
    if (!file) return;
    if (file.fileUrl && !confirm('Remove this file? This cannot be undone.')) return;
    try {
      if (file.storagePath) await deleteFile(file.storagePath);
    } catch (e) {
      alert(`Couldn't delete the file from storage: ${(e as Error).message}`);
      return;
    }
    setData((p) => ({
      ...p,
      customSections: replaceAtPath(p.customSections || [], sectionPath, (s) => ({
        ...s,
        files: (s.files || []).filter((_, i) => i !== fileIndex),
      })),
    }));
  };

  const handleCustomSectionPhotoUploaded = (sectionPath: number[], r: UploadResult) => {
    setData((p) => ({
      ...p,
      customSections: replaceAtPath(p.customSections || [], sectionPath, (s) => ({
        ...s,
        photo: { imageUrl: r.url, storagePath: r.path },
      })),
    }));
  };

  const handleCustomSectionPhotoRemoved = async (sectionPath: number[]) => {
    const photo = getAtPath(data.customSections || [], sectionPath)?.photo;
    if (!photo?.imageUrl) return;
    if (!confirm('Remove this photo? This cannot be undone.')) return;
    try {
      if (photo.storagePath) await deleteFile(photo.storagePath);
    } catch (e) {
      alert(`Couldn't delete the photo from storage: ${(e as Error).message}`);
      return;
    }
    setData((p) => ({
      ...p,
      customSections: replaceAtPath(p.customSections || [], sectionPath, (s) => {
        const next = { ...s };
        delete next.photo;
        return next;
      }),
    }));
  };

  const handleCustomSectionGalleryPhotoUploaded = (sectionPath: number[], photoIndex: number, r: UploadResult) => {
    setData((p) => ({
      ...p,
      customSections: replaceAtPath(p.customSections || [], sectionPath, (s) => ({
        ...s,
        galleryPhotos: (s.galleryPhotos || []).map((ph, i) => (i === photoIndex ? { imageUrl: r.url, storagePath: r.path } : ph)),
      })),
    }));
  };

  const handleCustomSectionGalleryPhotoRemoved = async (sectionPath: number[], photoIndex: number) => {
    const photo = getAtPath(data.customSections || [], sectionPath)?.galleryPhotos?.[photoIndex];
    if (!photo) return;
    if (photo.imageUrl && !confirm('Remove this photo? This cannot be undone.')) return;
    try {
      if (photo.storagePath) await deleteFile(photo.storagePath);
    } catch (e) {
      alert(`Couldn't delete the photo from storage: ${(e as Error).message}`);
      return;
    }
    setData((p) => ({
      ...p,
      customSections: replaceAtPath(p.customSections || [], sectionPath, (s) => ({
        ...s,
        galleryPhotos: (s.galleryPhotos || []).filter((_, i) => i !== photoIndex),
      })),
    }));
  };

  if (loading) {
    return (
      <div className="admin-card" style={{ textAlign: 'center', padding: '2rem', color: '#64748b' }}>
        Loading Assistive Technology Lab Content Editor...
      </div>
    );
  }

  return (
    <div className="admin-section" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {/* Sticky Header Bar */}
      <div className="admin-card" style={{ position: 'sticky', top: '0.5rem', zIndex: 20, boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div
              style={{
                display: 'inline-block',
                padding: '0.2rem 0.6rem',
                borderRadius: '4px',
                background: '#fef3c7',
                color: '#92400e',
                fontSize: '0.75rem',
                fontWeight: 700,
                textTransform: 'uppercase',
                marginBottom: '0.35rem',
              }}
            >
              Unified Differentiator Page Editor
            </div>
            <h2 style={{ margin: 0, fontSize: '1.4rem', fontWeight: 700, color: '#0f172a' }}>
              Assistive Technology Lab (ATL)
            </h2>
            <p style={{ margin: '0.25rem 0 0', fontSize: '0.85rem', color: '#64748b' }}>
              Single unified page editor in <strong>exact top-to-bottom layout order</strong> as displayed on the live public site.
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
      </div>

      {/* SECTION 1: OVERVIEW, MISSION & OBJECTIVES */}
      <div className="admin-card" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        <div style={{ borderBottom: '2px solid #b45309', paddingBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <BookOpen size={18} color="#b45309" />
          <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 700, color: '#0f172a' }}>
            1. Overview, Mission & Core Objectives
          </h3>
        </div>

        {/* Overview Paragraphs */}
        <div className="admin-field">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <label className="admin-label" style={{ margin: 0 }}>Overview Paragraphs</label>
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

        {/* Mission List */}
        <div style={{ paddingTop: '1rem', borderTop: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <label className="admin-label" style={{ margin: 0 }}>Mission Points</label>
            <button
              type="button"
              onClick={() => setData({ ...data, mission: [...data.mission, ''] })}
              className="admin-btn admin-btn--secondary"
              style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.8rem', padding: '0.35rem 0.75rem' }}
            >
              <Plus size={14} /> Add Mission Point
            </button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {data.mission.map((m, idx) => (
              <div key={idx} style={{ display: 'flex', gap: '0.5rem' }}>
                <input
                  type="text"
                  value={m}
                  onChange={(e) => {
                    const updated = [...data.mission];
                    updated[idx] = e.target.value;
                    setData({ ...data, mission: updated });
                  }}
                  className="admin-input"
                  style={{ flex: 1 }}
                />
                <button
                  type="button"
                  onClick={() => setData({ ...data, mission: data.mission.filter((_, i) => i !== idx) })}
                  className="admin-btn-danger"
                  style={{ padding: '0.5rem 0.65rem' }}
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Core Objectives */}
        <div style={{ paddingTop: '1rem', borderTop: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <label className="admin-label" style={{ margin: 0 }}>Core Objectives</label>
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
              <div key={idx} style={{ display: 'flex', gap: '0.5rem' }}>
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
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* SECTION 2: GLOBAL COLLABORATION SPOTLIGHT (UMASS LOWELL) */}
      <div className="admin-card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div style={{ borderBottom: '2px solid #b45309', paddingBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Globe2 size={18} color="#b45309" />
          <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 700, color: '#0f172a' }}>
            2. Collaboration with UMass Lowell, USA & Prof. Alan Rux
          </h3>
        </div>
        <p className="admin-field__hint" style={{ margin: 0 }}>
          This international partnership section highlights Professor Alan Rux's annual July mentorship and service learning collaboration since 2009.
        </p>
      </div>

      {/* SECTION 3: ASSISTIVE DEVICES & TECHNOLOGIES */}
      <div className="admin-card" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        <div style={{ borderBottom: '2px solid #b45309', paddingBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Cpu size={18} color="#b45309" />
          <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 700, color: '#0f172a' }}>
            3. Assistive Devices & Innovations Portfolio
          </h3>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <label className="admin-label" style={{ margin: 0 }}>Assistive Devices</label>
          <button
            type="button"
            onClick={() =>
              setData({
                ...data,
                assistiveDevices: [
                  ...data.assistiveDevices,
                  { title: 'New Device Title', category: 'Category', description: 'Device description and specifications', tag: 'Tag', icon: 'eye' } as AtlDevice,
                ],
              })
            }
            className="admin-btn admin-btn--secondary"
            style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.8rem', padding: '0.35rem 0.75rem' }}
          >
            <Plus size={14} /> Add Device
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1rem' }}>
          {data.assistiveDevices.map((d, idx) => (
            <div key={idx} style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '0.5rem' }}>
                <input
                  type="text"
                  value={d.category}
                  onChange={(e) => {
                    const updated = [...data.assistiveDevices];
                    updated[idx] = { ...updated[idx], category: e.target.value };
                    setData({ ...data, assistiveDevices: updated });
                  }}
                  className="admin-input"
                  style={{ fontWeight: 600, color: '#b45309', flex: 1 }}
                  placeholder="Category (e.g. Visual & Tactile Aids)"
                />
                <button
                  type="button"
                  onClick={() => setData({ ...data, assistiveDevices: data.assistiveDevices.filter((_, i) => i !== idx) })}
                  className="admin-btn-danger"
                  style={{ padding: '0.4rem 0.55rem' }}
                >
                  <Trash2 size={14} />
                </button>
              </div>
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

      {/* SECTION 4: ACADEMIC BRIDGE COURSES & ANNUAL STUDENT PROJECTS */}
      <div className="admin-card" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        <div style={{ borderBottom: '2px solid #b45309', paddingBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Layers size={18} color="#b45309" />
          <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 700, color: '#0f172a' }}>
            4. Academic Bridge Courses & Annual Student Project Teams
          </h3>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <label className="admin-label" style={{ margin: 0 }}>Trainings & Projects by Academic Year</label>
          <button
            type="button"
            onClick={() =>
              setData({
                ...data,
                trainingByYear: [
                  ...data.trainingByYear,
                  {
                    yearLabel: 'Academic Year 2025-26',
                    bridgeCourse: { headers: ['S. No.', 'Course Title', 'Facilitator', 'Duration / Date'], rows: [] },
                    projects: [],
                  } as AtlYearTraining,
                ],
              })
            }
            className="admin-btn admin-btn--secondary"
            style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.85rem' }}
          >
            <Plus size={14} /> Add Academic Year
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {data.trainingByYear.map((prog, idx) => (
            <div key={idx} style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <input
                  type="text"
                  value={prog.yearLabel}
                  onChange={(e) => {
                    const updated = [...data.trainingByYear];
                    updated[idx] = { ...updated[idx], yearLabel: e.target.value };
                    setData({ ...data, trainingByYear: updated });
                  }}
                  className="admin-input"
                  style={{ fontWeight: 700, maxWidth: '340px' }}
                  placeholder="Academic Year Label (e.g. Academic Year 2024-25)"
                />
                <button
                  type="button"
                  onClick={() => {
                    const updated = data.trainingByYear.filter((_, i) => i !== idx);
                    setData({ ...data, trainingByYear: updated });
                  }}
                  className="admin-btn-danger"
                  style={{ padding: '0.45rem 0.65rem' }}
                >
                  <Trash2 size={14} /> Remove Year
                </button>
              </div>

              {/* Projects list inside this year */}
              <div style={{ borderTop: '1px solid #cbd5e1', paddingTop: '0.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                  <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#334155' }}>Projects Developed in {prog.yearLabel}:</span>
                  <button
                    type="button"
                    onClick={() => {
                      const updated = [...data.trainingByYear];
                      updated[idx] = {
                        ...updated[idx],
                        projects: [...updated[idx].projects, { title: 'New Project Title', description: 'Project details' }],
                      };
                      setData({ ...data, trainingByYear: updated });
                    }}
                    className="admin-btn admin-btn--secondary"
                    style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem' }}
                  >
                    <Plus size={12} /> Add Project
                  </button>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {prog.projects.map((proj, pIdx) => (
                    <div key={pIdx} style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                      <input
                        type="text"
                        placeholder="Project Title"
                        value={proj.title}
                        onChange={(e) => {
                          const updatedYears = [...data.trainingByYear];
                          const updatedProjects = [...updatedYears[idx].projects];
                          updatedProjects[pIdx] = { ...updatedProjects[pIdx], title: e.target.value };
                          updatedYears[idx] = { ...updatedYears[idx], projects: updatedProjects };
                          setData({ ...data, trainingByYear: updatedYears });
                        }}
                        className="admin-input"
                        style={{ fontWeight: 600, flex: 1 }}
                      />
                      <input
                        type="text"
                        placeholder="Description"
                        value={proj.description}
                        onChange={(e) => {
                          const updatedYears = [...data.trainingByYear];
                          const updatedProjects = [...updatedYears[idx].projects];
                          updatedProjects[pIdx] = { ...updatedProjects[pIdx], description: e.target.value };
                          updatedYears[idx] = { ...updatedYears[idx], projects: updatedProjects };
                          setData({ ...data, trainingByYear: updatedYears });
                        }}
                        className="admin-input"
                        style={{ flex: 2 }}
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const updatedYears = [...data.trainingByYear];
                          const updatedProjects = updatedYears[idx].projects.filter((_, i) => i !== pIdx);
                          updatedYears[idx] = { ...updatedYears[idx], projects: updatedProjects };
                          setData({ ...data, trainingByYear: updatedYears });
                        }}
                        className="admin-btn-danger"
                        style={{ padding: '0.4rem 0.5rem' }}
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

      {/* SECTION 5: COMMUNITY ENGAGEMENT & EVENTS TIMELINE */}
      <div className="admin-card" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        <div style={{ borderBottom: '2px solid #b45309', paddingBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Calendar size={18} color="#b45309" />
          <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 700, color: '#0f172a' }}>
            5. Community Engagement & Exhibitions
          </h3>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <label className="admin-label" style={{ margin: 0 }}>Community Events & Fairs</label>
          <button
            type="button"
            onClick={() =>
              setData({
                ...data,
                communityEvents: [
                  ...data.communityEvents,
                  { title: 'New Event', badge: 'Community Outreach', description: 'Event description', date: 'Date' } as AtlCommunityEvent,
                ],
              })
            }
            className="admin-btn admin-btn--secondary"
            style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.8rem', padding: '0.35rem 0.75rem' }}
          >
            <Plus size={14} /> Add Event
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {data.communityEvents.map((ev, idx) => (
            <div key={idx} style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '0.85rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <input
                  type="text"
                  value={ev.badge}
                  onChange={(e) => {
                    const updated = [...data.communityEvents];
                    updated[idx] = { ...updated[idx], badge: e.target.value };
                    setData({ ...data, communityEvents: updated });
                  }}
                  className="admin-input"
                  style={{ fontWeight: 600, color: '#b45309', flex: 1 }}
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
                  style={{ flex: 1 }}
                  placeholder="Date"
                />
                <button
                  type="button"
                  onClick={() => setData({ ...data, communityEvents: data.communityEvents.filter((_, i) => i !== idx) })}
                  className="admin-btn-danger"
                  style={{ padding: '0.45rem 0.6rem' }}
                >
                  <Trash2 size={14} />
                </button>
              </div>
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
          ))}
        </div>
      </div>

      {/* SECTION 6: FACULTY MENTORS & LABORATORY LEADERSHIP */}
      <div className="admin-card" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        <div style={{ borderBottom: '2px solid #b45309', paddingBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Users size={18} color="#b45309" />
          <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 700, color: '#0f172a' }}>
            6. Faculty Mentors & Laboratory Leadership
          </h3>
        </div>

        {/* Dean */}
        <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <label className="admin-label" style={{ margin: 0 }}>Dean & Faculty Advisor</label>
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
              style={{ fontWeight: 700 }}
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
        <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <label className="admin-label" style={{ margin: 0 }}>Laboratory In-Charge</label>
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
              style={{ fontWeight: 700 }}
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
        <div style={{ paddingTop: '0.5rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <label className="admin-label" style={{ margin: 0 }}>Faculty Mentors</label>
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
              className="admin-btn admin-btn--secondary"
              style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.8rem', padding: '0.35rem 0.75rem' }}
            >
              <Plus size={14} /> Add Faculty Mentor
            </button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {data.team.facultyMembers.map((m, idx) => (
              <div key={idx} style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
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
                    style={{ fontWeight: 700 }}
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
                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <button
                    type="button"
                    onClick={() => {
                      const updated = data.team.facultyMembers.filter((_, i) => i !== idx);
                      setData({ ...data, team: { ...data.team, facultyMembers: updated } });
                    }}
                    className="admin-btn-danger"
                    style={{ padding: '0.4rem 0.6rem' }}
                  >
                    <Trash2 size={14} /> Remove Mentor
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* SECTION 7: FACILITIES & KEY HIGHLIGHTS */}
      <div className="admin-card" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        <div style={{ borderBottom: '2px solid #b45309', paddingBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Wrench size={18} color="#b45309" />
          <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 700, color: '#0f172a' }}>
            7. Facilities & Key Highlights
          </h3>
        </div>

        {/* Key Highlights */}
        <div className="admin-field">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <label className="admin-label" style={{ margin: 0 }}>Key Highlights</label>
            <button
              type="button"
              onClick={() => setData({ ...data, highlightsList: [...data.highlightsList, ''] })}
              className="admin-btn admin-btn--secondary"
              style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.8rem', padding: '0.35rem 0.75rem' }}
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
                  style={{ flex: 1 }}
                />
                <button
                  type="button"
                  onClick={() => setData({ ...data, highlightsList: data.highlightsList.filter((_, i) => i !== idx) })}
                  className="admin-btn-danger"
                  style={{ padding: '0.5rem 0.65rem' }}
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Facilities & Equipment */}
        <div style={{ paddingTop: '1rem', borderTop: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <label className="admin-label" style={{ margin: 0 }}>Facilities & Equipment</label>
            <button
              type="button"
              onClick={() => setData({ ...data, equipmentList: [...data.equipmentList, ''] })}
              className="admin-btn admin-btn--secondary"
              style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.8rem', padding: '0.35rem 0.75rem' }}
            >
              <Plus size={14} /> Add Equipment Item
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
                  style={{ flex: 1 }}
                />
                <button
                  type="button"
                  onClick={() => setData({ ...data, equipmentList: data.equipmentList.filter((_, i) => i !== idx) })}
                  className="admin-btn-danger"
                  style={{ padding: '0.5rem 0.65rem' }}
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* SECTION 8: STUDENTS BENEFITTED & SELECTED STUDENTS ROSTER (DYNAMIC YEARS) */}
      <div className="admin-card" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        <div style={{ borderBottom: '2px solid #b45309', paddingBottom: '0.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Users size={18} color="#b45309" />
            <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 700, color: '#0f172a' }}>
              8. Students Benefitted & Selected Students Roster ({(data.studentRosters || []).length} Academic Years)
            </h3>
          </div>
          <button
            type="button"
            onClick={() => {
              const newRoster: AtlStudentRosterYear = {
                id: Date.now().toString(),
                yearLabel: 'Academic Year 2026-27',
                type: 'batches',
                batches: [],
                table: { headers: ['S. No', 'Roll No', 'Branch', 'Student Name'], rows: [] },
              };
              const updated = [...(data.studentRosters || []), newRoster];
              setData({ ...data, studentRosters: updated });
              setActiveAdminStudentTab(updated.length - 1);
            }}
            className="admin-btn admin-btn--secondary"
            style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.85rem' }}
          >
            <Plus size={14} /> Add Academic Year / Student Roster
          </button>
        </div>

        {/* Sub-tabs selector for admin */}
        {(data.studentRosters || []).length > 0 && (
          <div style={{ display: 'flex', gap: '0.5rem', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.5rem', flexWrap: 'wrap' }}>
            {(data.studentRosters || []).map((roster, idx) => (
              <button
                key={roster.id || idx}
                type="button"
                onClick={() => setActiveAdminStudentTab(idx)}
                className="admin-btn"
                style={{
                  background: activeAdminStudentTab === idx ? '#0b1e42' : '#f1f5f9',
                  color: activeAdminStudentTab === idx ? '#ffffff' : '#475569',
                  fontSize: '0.85rem',
                  fontWeight: 700,
                  padding: '0.45rem 0.85rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                }}
              >
                <span>{roster.yearLabel || `Roster Year ${idx + 1}`}</span>
              </button>
            ))}
          </div>
        )}

        {/* Active Roster Year Editor */}
        {data.studentRosters && data.studentRosters[activeAdminStudentTab] && (() => {
          const rIdx = activeAdminStudentTab;
          const roster = data.studentRosters[rIdx];

          const updateCurrentRoster = (patch: Partial<AtlStudentRosterYear>) => {
            const updated = [...data.studentRosters!];
            updated[rIdx] = { ...updated[rIdx], ...patch };
            setData({ ...data, studentRosters: updated });
          };

          return (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '8px', padding: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.75rem' }}>
                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', flex: 1, minWidth: '280px' }}>
                  <label className="admin-label" style={{ margin: 0, minWidth: 90 }}>Year Label:</label>
                  <input
                    type="text"
                    value={roster.yearLabel}
                    onChange={(e) => updateCurrentRoster({ yearLabel: e.target.value })}
                    className="admin-input"
                    style={{ fontWeight: 700 }}
                  />
                </div>

                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                  <label className="admin-label" style={{ margin: 0 }}>Layout Type:</label>
                  <select
                    value={roster.type}
                    onChange={(e) => updateCurrentRoster({ type: e.target.value as 'batches' | 'table' })}
                    className="admin-input"
                    style={{ width: 'auto', fontWeight: 600 }}
                  >
                    <option value="batches">Project Batches Roster</option>
                    <option value="table">Single Student Table</option>
                  </select>
                </div>

                <div style={{ display: 'flex', gap: '0.25rem', alignItems: 'center' }}>
                  {rIdx > 0 && (
                    <button
                      type="button"
                      onClick={() => {
                        const next = [...data.studentRosters!];
                        [next[rIdx - 1], next[rIdx]] = [next[rIdx], next[rIdx - 1]];
                        setData({ ...data, studentRosters: next });
                        setActiveAdminStudentTab(rIdx - 1);
                      }}
                      className="admin-btn admin-btn--secondary"
                      style={{ padding: '0.35rem 0.5rem' }}
                      title="Move Up"
                    >
                      <ChevronUp size={14} />
                    </button>
                  )}
                  {rIdx < data.studentRosters!.length - 1 && (
                    <button
                      type="button"
                      onClick={() => {
                        const next = [...data.studentRosters!];
                        [next[rIdx], next[rIdx + 1]] = [next[rIdx + 1], next[rIdx]];
                        setData({ ...data, studentRosters: next });
                        setActiveAdminStudentTab(rIdx + 1);
                      }}
                      className="admin-btn admin-btn--secondary"
                      style={{ padding: '0.35rem 0.5rem' }}
                      title="Move Down"
                    >
                      <ChevronDown size={14} />
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => {
                      if (!confirm(`Remove "${roster.yearLabel}" roster?`)) return;
                      const next = data.studentRosters!.filter((_, i) => i !== rIdx);
                      setData({ ...data, studentRosters: next });
                      setActiveAdminStudentTab(Math.max(0, rIdx - 1));
                    }}
                    className="admin-btn-danger"
                    style={{ padding: '0.35rem 0.65rem' }}
                  >
                    <Trash2 size={14} /> Remove Year Roster
                  </button>
                </div>
              </div>

              {/* Roster Type 1: Project Batches */}
              {roster.type === 'batches' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontWeight: 700, fontSize: '0.9rem', color: '#0f172a' }}>
                      Project Batches ({(roster.batches || []).length}):
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        const updatedBatches = [...(roster.batches || [])];
                        updatedBatches.push({
                          batchNo: updatedBatches.length + 1,
                          batchName: 'Batch Name',
                          mentors: 'Mentors list',
                          selectedProject: 'Project Title',
                          members: [{ regdNo: '22B01A0400', name: 'Student Name', department: 'ECE' }],
                        });
                        updateCurrentRoster({ batches: updatedBatches });
                      }}
                      className="admin-btn admin-btn--secondary"
                      style={{ fontSize: '0.8rem', padding: '0.35rem 0.65rem' }}
                    >
                      <Plus size={14} /> Add Batch
                    </button>
                  </div>

                  {(roster.batches || []).map((b, bIdx) => (
                    <div key={bIdx} style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '0.85rem', display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontWeight: 800, color: '#0b1e42' }}>Batch #{b.batchNo}</span>
                        <button
                          type="button"
                          onClick={() => {
                            const updatedBatches = (roster.batches || []).filter((_, i) => i !== bIdx);
                            updateCurrentRoster({ batches: updatedBatches });
                          }}
                          className="admin-btn-danger"
                          style={{ padding: '0.3rem 0.5rem' }}
                        >
                          <Trash2 size={12} /> Remove Batch
                        </button>
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr 1fr', gap: '0.5rem' }}>
                        <input
                          type="text"
                          value={b.batchName || ''}
                          onChange={(e) => {
                            const updatedBatches = [...(roster.batches || [])];
                            updatedBatches[bIdx] = { ...updatedBatches[bIdx], batchName: e.target.value };
                            updateCurrentRoster({ batches: updatedBatches });
                          }}
                          className="admin-input"
                          placeholder="Batch Name (e.g. Anikitos)"
                        />
                        <input
                          type="text"
                          value={b.selectedProject || ''}
                          onChange={(e) => {
                            const updatedBatches = [...(roster.batches || [])];
                            updatedBatches[bIdx] = { ...updatedBatches[bIdx], selectedProject: e.target.value };
                            updateCurrentRoster({ batches: updatedBatches });
                          }}
                          className="admin-input"
                          placeholder="Selected Project"
                        />
                        <input
                          type="text"
                          value={b.mentors || ''}
                          onChange={(e) => {
                            const updatedBatches = [...(roster.batches || [])];
                            updatedBatches[bIdx] = { ...updatedBatches[bIdx], mentors: e.target.value };
                            updateCurrentRoster({ batches: updatedBatches });
                          }}
                          className="admin-input"
                          placeholder="Mentors"
                        />
                      </div>

                      {/* Members table inside this batch */}
                      <div style={{ borderTop: '1px solid #cbd5e1', paddingTop: '0.5rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                          <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#475569' }}>Members ({(b.members || []).length}):</span>
                          <button
                            type="button"
                            onClick={() => {
                              const updatedBatches = [...(roster.batches || [])];
                              updatedBatches[bIdx] = {
                                ...updatedBatches[bIdx],
                                members: [...(updatedBatches[bIdx].members || []), { regdNo: '', name: '', department: '' }],
                              };
                              updateCurrentRoster({ batches: updatedBatches });
                            }}
                            className="admin-btn admin-btn--secondary"
                            style={{ fontSize: '0.75rem', padding: '0.2rem 0.45rem' }}
                          >
                            <Plus size={12} /> Add Student
                          </button>
                        </div>

                        {(b.members || []).map((m, mIdx) => (
                          <div key={mIdx} style={{ display: 'grid', gridTemplateColumns: '120px 1fr 100px 36px', gap: '0.4rem', marginBottom: '0.35rem' }}>
                            <input
                              type="text"
                              value={m.regdNo}
                              onChange={(e) => {
                                const updatedBatches = [...(roster.batches || [])];
                                const members = [...(updatedBatches[bIdx].members || [])];
                                members[mIdx] = { ...members[mIdx], regdNo: e.target.value };
                                updatedBatches[bIdx] = { ...updatedBatches[bIdx], members };
                                updateCurrentRoster({ batches: updatedBatches });
                              }}
                              className="admin-input"
                              placeholder="Regd. No"
                            />
                            <input
                              type="text"
                              value={m.name}
                              onChange={(e) => {
                                const updatedBatches = [...(roster.batches || [])];
                                const members = [...(updatedBatches[bIdx].members || [])];
                                members[mIdx] = { ...members[mIdx], name: e.target.value };
                                updatedBatches[bIdx] = { ...updatedBatches[bIdx], members };
                                updateCurrentRoster({ batches: updatedBatches });
                              }}
                              className="admin-input"
                              placeholder="Student Name"
                            />
                            <input
                              type="text"
                              value={m.department}
                              onChange={(e) => {
                                const updatedBatches = [...(roster.batches || [])];
                                const members = [...(updatedBatches[bIdx].members || [])];
                                members[mIdx] = { ...members[mIdx], department: e.target.value };
                                updatedBatches[bIdx] = { ...updatedBatches[bIdx], members };
                                updateCurrentRoster({ batches: updatedBatches });
                              }}
                              className="admin-input"
                              placeholder="Dept"
                            />
                            <button
                              type="button"
                              onClick={() => {
                                const updatedBatches = [...(roster.batches || [])];
                                const members = (updatedBatches[bIdx].members || []).filter((_, i) => i !== mIdx);
                                updatedBatches[bIdx] = { ...updatedBatches[bIdx], members };
                                updateCurrentRoster({ batches: updatedBatches });
                              }}
                              className="admin-btn-danger"
                              style={{ padding: '0.3rem' }}
                            >
                              <Trash2 size={12} />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Roster Type 2: Single Student Table */}
              {roster.type === 'table' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontWeight: 700, fontSize: '0.9rem', color: '#0f172a' }}>
                      Student Table ({(roster.table?.rows || []).length} Rows):
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        const currentTable = roster.table || { headers: ['S. No', 'Roll No', 'Branch', 'Student Name'], rows: [] };
                        const nextRows = [
                          ...(currentTable.rows || []),
                          { cells: [String((currentTable.rows || []).length + 1), '', '', ''] },
                        ];
                        updateCurrentRoster({ table: { ...currentTable, rows: nextRows } });
                      }}
                      className="admin-btn admin-btn--secondary"
                      style={{ fontSize: '0.8rem', padding: '0.35rem 0.65rem' }}
                    >
                      <Plus size={14} /> Add Student Row
                    </button>
                  </div>

                  {((roster.table && roster.table.rows) || []).map((row, rIdx) => (
                    <div key={rIdx} style={{ display: 'grid', gridTemplateColumns: '60px 130px 100px 1fr 36px', gap: '0.4rem', alignItems: 'center' }}>
                      <input
                        type="text"
                        value={row.cells[0] || ''}
                        onChange={(e) => {
                          const currentTable = roster.table || { headers: ['S. No', 'Roll No', 'Branch', 'Student Name'], rows: [] };
                          const nextRows = [...currentTable.rows];
                          const cells = [...(nextRows[rIdx].cells || [])];
                          cells[0] = e.target.value;
                          nextRows[rIdx] = { cells };
                          updateCurrentRoster({ table: { ...currentTable, rows: nextRows } });
                        }}
                        className="admin-input"
                        placeholder="S.No"
                      />
                      <input
                        type="text"
                        value={row.cells[1] || ''}
                        onChange={(e) => {
                          const currentTable = roster.table || { headers: ['S. No', 'Roll No', 'Branch', 'Student Name'], rows: [] };
                          const nextRows = [...currentTable.rows];
                          const cells = [...(nextRows[rIdx].cells || [])];
                          cells[1] = e.target.value;
                          nextRows[rIdx] = { cells };
                          updateCurrentRoster({ table: { ...currentTable, rows: nextRows } });
                        }}
                        className="admin-input"
                        placeholder="Roll No"
                      />
                      <input
                        type="text"
                        value={row.cells[2] || ''}
                        onChange={(e) => {
                          const currentTable = roster.table || { headers: ['S. No', 'Roll No', 'Branch', 'Student Name'], rows: [] };
                          const nextRows = [...currentTable.rows];
                          const cells = [...(nextRows[rIdx].cells || [])];
                          cells[2] = e.target.value;
                          nextRows[rIdx] = { cells };
                          updateCurrentRoster({ table: { ...currentTable, rows: nextRows } });
                        }}
                        className="admin-input"
                        placeholder="Branch"
                      />
                      <input
                        type="text"
                        value={row.cells[3] || ''}
                        onChange={(e) => {
                          const currentTable = roster.table || { headers: ['S. No', 'Roll No', 'Branch', 'Student Name'], rows: [] };
                          const nextRows = [...currentTable.rows];
                          const cells = [...(nextRows[rIdx].cells || [])];
                          cells[3] = e.target.value;
                          nextRows[rIdx] = { cells };
                          updateCurrentRoster({ table: { ...currentTable, rows: nextRows } });
                        }}
                        className="admin-input"
                        placeholder="Student Name"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const currentTable = roster.table || { headers: ['S. No', 'Roll No', 'Branch', 'Student Name'], rows: [] };
                          const nextRows = currentTable.rows.filter((_, i) => i !== rIdx);
                          updateCurrentRoster({ table: { ...currentTable, rows: nextRows } });
                        }}
                        className="admin-btn-danger"
                        style={{ padding: '0.35rem' }}
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })()}
      </div>

      {/* SECTION 8.1: INTERNATIONAL DAY OF PERSONS WITH DISABILITIES — EXHIBITION DAYS & EVENT REPORTS */}
      <div className="admin-card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div style={{ borderBottom: '2px solid #0284c7', paddingBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Sparkles size={18} color="#0284c7" />
          <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 700, color: '#0f172a' }}>
            International Day of Persons with Disabilities — Exhibition Days & Event Reports ({(data.exhibitionReports || []).length})
          </h3>
        </div>
        <p className="admin-field__hint" style={{ margin: 0 }}>
          Manage annual exhibition day event reports, distribution lists, keynote speeches, and proceedings. All reports are rendered in a unified collapsible tab bar on the site.
        </p>

        {/* Tab Buttons for Admin Year Selection */}
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', background: '#f8fafc', padding: '0.4rem', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
          {(data.exhibitionReports || []).map((rep, idx) => (
            <button
              key={rep.id || idx}
              type="button"
              onClick={() => setActiveAdminExhibitionTab(idx)}
              className={`admin-btn ${activeAdminExhibitionTab === idx ? 'admin-btn--primary' : 'admin-btn--secondary'}`}
              style={{ fontSize: '0.85rem', padding: '0.35rem 0.75rem' }}
            >
              {rep.yearLabel || `Year ${idx + 1}`}
            </button>
          ))}
          <button
            type="button"
            onClick={() => {
              const newYearStr = prompt('Enter Academic Year (e.g. 2026-27):', '2026-27');
              if (!newYearStr) return;
              const newYear: AtlExhibitionYear = {
                id: Date.now().toString(),
                yearLabel: newYearStr,
                title: `International Day of Persons with Disabilities — Exhibition Day (${newYearStr})`,
                blocks: [
                  {
                    type: 'meta',
                    items: [
                      { label: 'Date', value: '03-12-2026' },
                      { label: 'Venue', value: 'SVECW Bhimavaram' },
                    ],
                  },
                  {
                    type: 'paragraph',
                    text: 'Event report overview text...',
                  },
                ],
              };
              setData((p) => {
                const next = [...(p.exhibitionReports || []), newYear];
                setActiveAdminExhibitionTab(next.length - 1);
                return { ...p, exhibitionReports: next };
              });
            }}
            className="admin-btn admin-btn--secondary"
            style={{ fontSize: '0.85rem', padding: '0.35rem 0.75rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}
          >
            <Plus size={14} /> Add Exhibition Year
          </button>
        </div>

        {/* Selected Exhibition Year Form */}
        {(data.exhibitionReports || [])[activeAdminExhibitionTab] && (
          <div style={{ background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '10px', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flex: 1, minWidth: '240px' }}>
                <span className="admin-field__label" style={{ margin: 0, whiteSpace: 'nowrap' }}>Year Label:</span>
                <input
                  type="text"
                  className="admin-input"
                  value={(data.exhibitionReports || [])[activeAdminExhibitionTab].yearLabel}
                  onChange={(e) => {
                    const val = e.target.value;
                    setData((p) => {
                      const next = [...(p.exhibitionReports || [])];
                      next[activeAdminExhibitionTab] = { ...next[activeAdminExhibitionTab], yearLabel: val };
                      return { ...p, exhibitionReports: next };
                    });
                  }}
                  style={{ fontWeight: 700, flex: 1 }}
                />
              </div>

              <div style={{ display: 'flex', gap: '0.4rem' }}>
                <button
                  type="button"
                  disabled={activeAdminExhibitionTab === 0}
                  onClick={() => {
                    setData((p) => {
                      const next = [...(p.exhibitionReports || [])];
                      const tmp = next[activeAdminExhibitionTab];
                      next[activeAdminExhibitionTab] = next[activeAdminExhibitionTab - 1];
                      next[activeAdminExhibitionTab - 1] = tmp;
                      setActiveAdminExhibitionTab(activeAdminExhibitionTab - 1);
                      return { ...p, exhibitionReports: next };
                    });
                  }}
                  className="admin-btn admin-btn--secondary"
                  title="Move Up"
                >
                  <ChevronUp size={14} />
                </button>
                <button
                  type="button"
                  disabled={activeAdminExhibitionTab === (data.exhibitionReports || []).length - 1}
                  onClick={() => {
                    setData((p) => {
                      const next = [...(p.exhibitionReports || [])];
                      const tmp = next[activeAdminExhibitionTab];
                      next[activeAdminExhibitionTab] = next[activeAdminExhibitionTab + 1];
                      next[activeAdminExhibitionTab + 1] = tmp;
                      setActiveAdminExhibitionTab(activeAdminExhibitionTab + 1);
                      return { ...p, exhibitionReports: next };
                    });
                  }}
                  className="admin-btn admin-btn--secondary"
                  title="Move Down"
                >
                  <ChevronDown size={14} />
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (!confirm('Are you sure you want to delete this exhibition report year?')) return;
                    setData((p) => {
                      const next = (p.exhibitionReports || []).filter((_, i) => i !== activeAdminExhibitionTab);
                      setActiveAdminExhibitionTab(Math.max(0, activeAdminExhibitionTab - 1));
                      return { ...p, exhibitionReports: next };
                    });
                  }}
                  className="admin-btn admin-btn--danger"
                  title="Delete Year"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>

            <div className="admin-field">
              <label className="admin-field__label">Full Exhibition / Event Title</label>
              <input
                type="text"
                className="admin-input"
                value={(data.exhibitionReports || [])[activeAdminExhibitionTab].title}
                onChange={(e) => {
                  const val = e.target.value;
                  setData((p) => {
                    const next = [...(p.exhibitionReports || [])];
                    next[activeAdminExhibitionTab] = { ...next[activeAdminExhibitionTab], title: val };
                    return { ...p, exhibitionReports: next };
                  });
                }}
              />
            </div>

            {/* Blocks Editor */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '0.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h4 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 700, color: '#0f172a' }}>
                  Content Blocks ({(data.exhibitionReports || [])[activeAdminExhibitionTab].blocks.length})
                </h4>
                <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                  <button
                    type="button"
                    onClick={() => {
                      setData((p) => {
                        const next = [...(p.exhibitionReports || [])];
                        const blocks = [...next[activeAdminExhibitionTab].blocks, { type: 'paragraph', text: '' } as AtlBlock];
                        next[activeAdminExhibitionTab] = { ...next[activeAdminExhibitionTab], blocks };
                        return { ...p, exhibitionReports: next };
                      });
                    }}
                    className="admin-btn admin-btn--secondary"
                    style={{ fontSize: '0.75rem', padding: '0.2rem 0.5rem' }}
                  >
                    + Paragraph
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setData((p) => {
                        const next = [...(p.exhibitionReports || [])];
                        const blocks = [...next[activeAdminExhibitionTab].blocks, { type: 'heading', text: '' } as AtlBlock];
                        next[activeAdminExhibitionTab] = { ...next[activeAdminExhibitionTab], blocks };
                        return { ...p, exhibitionReports: next };
                      });
                    }}
                    className="admin-btn admin-btn--secondary"
                    style={{ fontSize: '0.75rem', padding: '0.2rem 0.5rem' }}
                  >
                    + Heading
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setData((p) => {
                        const next = [...(p.exhibitionReports || [])];
                        const blocks = [...next[activeAdminExhibitionTab].blocks, { type: 'boldBullets', items: [{ lead: 'Lead:', text: 'Detail text' }] } as AtlBlock];
                        next[activeAdminExhibitionTab] = { ...next[activeAdminExhibitionTab], blocks };
                        return { ...p, exhibitionReports: next };
                      });
                    }}
                    className="admin-btn admin-btn--secondary"
                    style={{ fontSize: '0.75rem', padding: '0.2rem 0.5rem' }}
                  >
                    + Bold Bullets
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setData((p) => {
                        const next = [...(p.exhibitionReports || [])];
                        const blocks = [...next[activeAdminExhibitionTab].blocks, { type: 'numbered', items: [''] } as AtlBlock];
                        next[activeAdminExhibitionTab] = { ...next[activeAdminExhibitionTab], blocks };
                        return { ...p, exhibitionReports: next };
                      });
                    }}
                    className="admin-btn admin-btn--secondary"
                    style={{ fontSize: '0.75rem', padding: '0.2rem 0.5rem' }}
                  >
                    + Numbered
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setData((p) => {
                        const next = [...(p.exhibitionReports || [])];
                        const blocks = [...next[activeAdminExhibitionTab].blocks, { type: 'meta', items: [{ label: 'Date', value: '' }] } as AtlBlock];
                        next[activeAdminExhibitionTab] = { ...next[activeAdminExhibitionTab], blocks };
                        return { ...p, exhibitionReports: next };
                      });
                    }}
                    className="admin-btn admin-btn--secondary"
                    style={{ fontSize: '0.75rem', padding: '0.2rem 0.5rem' }}
                  >
                    + Meta
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setData((p) => {
                        const next = [...(p.exhibitionReports || [])];
                        const blocks = [...next[activeAdminExhibitionTab].blocks, { type: 'table', title: 'Distribution Projects', table: { headers: ['S.No', 'Project Name', 'Remarks'], rows: [{ cells: ['1', '', ''] }] } } as AtlBlock];
                        next[activeAdminExhibitionTab] = { ...next[activeAdminExhibitionTab], blocks };
                        return { ...p, exhibitionReports: next };
                      });
                    }}
                    className="admin-btn admin-btn--secondary"
                    style={{ fontSize: '0.75rem', padding: '0.2rem 0.5rem' }}
                  >
                    + Table
                  </button>
                </div>
              </div>

              {((data.exhibitionReports || [])[activeAdminExhibitionTab].blocks || []).map((blk, bIdx) => (
                <div key={bIdx} style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '0.75rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', color: '#0284c7' }}>
                      Block #{bIdx + 1} — {blk.type}
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        setData((p) => {
                          const next = [...(p.exhibitionReports || [])];
                          const blocks = next[activeAdminExhibitionTab].blocks.filter((_, i) => i !== bIdx);
                          next[activeAdminExhibitionTab] = { ...next[activeAdminExhibitionTab], blocks };
                          return { ...p, exhibitionReports: next };
                        });
                      }}
                      style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer' }}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>

                  {blk.type === 'paragraph' && (
                    <textarea
                      className="admin-textarea"
                      rows={3}
                      value={blk.text}
                      onChange={(e) => {
                        const val = e.target.value;
                        setData((p) => {
                          const next = [...(p.exhibitionReports || [])];
                          const blocks = [...next[activeAdminExhibitionTab].blocks];
                          blocks[bIdx] = { ...blk, text: val };
                          next[activeAdminExhibitionTab] = { ...next[activeAdminExhibitionTab], blocks };
                          return { ...p, exhibitionReports: next };
                        });
                      }}
                    />
                  )}

                  {blk.type === 'heading' && (
                    <input
                      type="text"
                      className="admin-input"
                      value={blk.text}
                      onChange={(e) => {
                        const val = e.target.value;
                        setData((p) => {
                          const next = [...(p.exhibitionReports || [])];
                          const blocks = [...next[activeAdminExhibitionTab].blocks];
                          blocks[bIdx] = { ...blk, text: val };
                          next[activeAdminExhibitionTab] = { ...next[activeAdminExhibitionTab], blocks };
                          return { ...p, exhibitionReports: next };
                        });
                      }}
                    />
                  )}

                  {blk.type === 'bullets' && (
                    <textarea
                      className="admin-textarea"
                      rows={4}
                      placeholder="One bullet point per line"
                      value={blk.items.join('\n')}
                      onChange={(e) => {
                        const items = e.target.value.split('\n');
                        setData((p) => {
                          const next = [...(p.exhibitionReports || [])];
                          const blocks = [...next[activeAdminExhibitionTab].blocks];
                          blocks[bIdx] = { ...blk, items };
                          next[activeAdminExhibitionTab] = { ...next[activeAdminExhibitionTab], blocks };
                          return { ...p, exhibitionReports: next };
                        });
                      }}
                    />
                  )}

                  {blk.type === 'boldBullets' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                      <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#475569' }}>Lead & Detail Items:</span>
                      {blk.items.map((item, iIdx) => (
                        <div key={iIdx} style={{ display: 'flex', gap: '0.4rem' }}>
                          <input
                            type="text"
                            className="admin-input"
                            style={{ width: '150px' }}
                            placeholder="Lead Label"
                            value={item.lead}
                            onChange={(e) => {
                              const val = e.target.value;
                              setData((p) => {
                                const next = [...(p.exhibitionReports || [])];
                                const blocks = [...next[activeAdminExhibitionTab].blocks];
                                const items = [...(blk.items || [])];
                                items[iIdx] = { ...item, lead: val };
                                blocks[bIdx] = { ...blk, items };
                                next[activeAdminExhibitionTab] = { ...next[activeAdminExhibitionTab], blocks };
                                return { ...p, exhibitionReports: next };
                              });
                            }}
                          />
                          <input
                            type="text"
                            className="admin-input"
                            style={{ flex: 1 }}
                            placeholder="Detail Text"
                            value={item.text}
                            onChange={(e) => {
                              const val = e.target.value;
                              setData((p) => {
                                const next = [...(p.exhibitionReports || [])];
                                const blocks = [...next[activeAdminExhibitionTab].blocks];
                                const items = [...(blk.items || [])];
                                items[iIdx] = { ...item, text: val };
                                blocks[bIdx] = { ...blk, items };
                                next[activeAdminExhibitionTab] = { ...next[activeAdminExhibitionTab], blocks };
                                return { ...p, exhibitionReports: next };
                              });
                            }}
                          />
                          <button
                            type="button"
                            onClick={() => {
                              setData((p) => {
                                const next = [...(p.exhibitionReports || [])];
                                const blocks = [...next[activeAdminExhibitionTab].blocks];
                                const items = (blk.items || []).filter((_, i) => i !== iIdx);
                                blocks[bIdx] = { ...blk, items };
                                next[activeAdminExhibitionTab] = { ...next[activeAdminExhibitionTab], blocks };
                                return { ...p, exhibitionReports: next };
                              });
                            }}
                            className="admin-btn-danger"
                            style={{ padding: '0.3rem' }}
                          >
                            <Trash2 size={12} />
                          </button>
                        </div>
                      ))}
                      <button
                        type="button"
                        onClick={() => {
                          setData((p) => {
                            const next = [...(p.exhibitionReports || [])];
                            const blocks = [...next[activeAdminExhibitionTab].blocks];
                            const items = [...(blk.items || []), { lead: 'Key:', text: 'Value' }];
                            blocks[bIdx] = { ...blk, items };
                            next[activeAdminExhibitionTab] = { ...next[activeAdminExhibitionTab], blocks };
                            return { ...p, exhibitionReports: next };
                          });
                        }}
                        className="admin-btn admin-btn--secondary"
                        style={{ fontSize: '0.75rem', padding: '0.2rem 0.5rem', alignSelf: 'flex-start' }}
                      >
                        + Add Bullet Pair
                      </button>
                    </div>
                  )}

                  {blk.type === 'numbered' && (
                    <textarea
                      className="admin-textarea"
                      rows={4}
                      placeholder="One numbered item per line"
                      value={blk.items.join('\n')}
                      onChange={(e) => {
                        const items = e.target.value.split('\n');
                        setData((p) => {
                          const next = [...(p.exhibitionReports || [])];
                          const blocks = [...next[activeAdminExhibitionTab].blocks];
                          blocks[bIdx] = { ...blk, items };
                          next[activeAdminExhibitionTab] = { ...next[activeAdminExhibitionTab], blocks };
                          return { ...p, exhibitionReports: next };
                        });
                      }}
                    />
                  )}

                  {blk.type === 'meta' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                      <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#475569' }}>Meta Key / Value Pairs:</span>
                      {blk.items.map((m, mIdx) => (
                        <div key={mIdx} style={{ display: 'flex', gap: '0.4rem' }}>
                          <input
                            type="text"
                            className="admin-input"
                            style={{ width: '130px' }}
                            value={m.label}
                            onChange={(e) => {
                              const val = e.target.value;
                              setData((p) => {
                                const next = [...(p.exhibitionReports || [])];
                                const blocks = [...next[activeAdminExhibitionTab].blocks];
                                const metaItems = [...(blk.items || [])];
                                metaItems[mIdx] = { ...m, label: val };
                                blocks[bIdx] = { ...blk, items: metaItems };
                                next[activeAdminExhibitionTab] = { ...next[activeAdminExhibitionTab], blocks };
                                return { ...p, exhibitionReports: next };
                              });
                            }}
                          />
                          <input
                            type="text"
                            className="admin-input"
                            style={{ flex: 1 }}
                            value={m.value}
                            onChange={(e) => {
                              const val = e.target.value;
                              setData((p) => {
                                const next = [...(p.exhibitionReports || [])];
                                const blocks = [...next[activeAdminExhibitionTab].blocks];
                                const metaItems = [...(blk.items || [])];
                                metaItems[mIdx] = { ...m, value: val };
                                blocks[bIdx] = { ...blk, items: metaItems };
                                next[activeAdminExhibitionTab] = { ...next[activeAdminExhibitionTab], blocks };
                                return { ...p, exhibitionReports: next };
                              });
                            }}
                          />
                          <button
                            type="button"
                            onClick={() => {
                              setData((p) => {
                                const next = [...(p.exhibitionReports || [])];
                                const blocks = [...next[activeAdminExhibitionTab].blocks];
                                const metaItems = (blk.items || []).filter((_, i) => i !== mIdx);
                                blocks[bIdx] = { ...blk, items: metaItems };
                                next[activeAdminExhibitionTab] = { ...next[activeAdminExhibitionTab], blocks };
                                return { ...p, exhibitionReports: next };
                              });
                            }}
                            className="admin-btn-danger"
                            style={{ padding: '0.3rem' }}
                          >
                            <Trash2 size={12} />
                          </button>
                        </div>
                      ))}
                      <button
                        type="button"
                        onClick={() => {
                          setData((p) => {
                            const next = [...(p.exhibitionReports || [])];
                            const blocks = [...next[activeAdminExhibitionTab].blocks];
                            const metaItems = [...(blk.items || []), { label: 'Meta Key', value: 'Meta Value' }];
                            blocks[bIdx] = { ...blk, items: metaItems };
                            next[activeAdminExhibitionTab] = { ...next[activeAdminExhibitionTab], blocks };
                            return { ...p, exhibitionReports: next };
                          });
                        }}
                        className="admin-btn admin-btn--secondary"
                        style={{ fontSize: '0.75rem', padding: '0.2rem 0.5rem', alignSelf: 'flex-start' }}
                      >
                        + Add Meta Item
                      </button>
                    </div>
                  )}

                  {blk.type === 'table' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                      <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center' }}>
                        <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#475569', whiteSpace: 'nowrap' }}>Table Title:</span>
                        <input
                          type="text"
                          className="admin-input"
                          style={{ flex: 1 }}
                          value={blk.title || ''}
                          onChange={(e) => {
                            const val = e.target.value;
                            setData((p) => {
                              const next = [...(p.exhibitionReports || [])];
                              const blocks = [...next[activeAdminExhibitionTab].blocks];
                              blocks[bIdx] = { ...blk, title: val };
                              next[activeAdminExhibitionTab] = { ...next[activeAdminExhibitionTab], blocks };
                              return { ...p, exhibitionReports: next };
                            });
                          }}
                        />
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#475569' }}>
                          Rows ({(blk.table.rows || []).length}):
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            setData((p) => {
                              const next = [...(p.exhibitionReports || [])];
                              const blocks = [...next[activeAdminExhibitionTab].blocks];
                              const table = { ...blk.table };
                              const rows = [...(table.rows || []), { cells: Array(table.headers.length).fill('') }];
                              blocks[bIdx] = { ...blk, table: { ...table, rows } };
                              next[activeAdminExhibitionTab] = { ...next[activeAdminExhibitionTab], blocks };
                              return { ...p, exhibitionReports: next };
                            });
                          }}
                          className="admin-btn admin-btn--secondary"
                          style={{ fontSize: '0.75rem', padding: '0.2rem 0.5rem' }}
                        >
                          + Add Row
                        </button>
                      </div>
                      {(blk.table.rows || []).map((row, rIdx) => (
                        <div key={rIdx} style={{ display: 'flex', gap: '0.4rem', alignItems: 'center' }}>
                          {(row.cells || []).map((cell, cIdx) => (
                            <input
                              key={cIdx}
                              type="text"
                              className="admin-input"
                              style={{ flex: 1 }}
                              placeholder={blk.table.headers[cIdx] || `Col ${cIdx + 1}`}
                              value={cell}
                              onChange={(e) => {
                                const val = e.target.value;
                                setData((p) => {
                                  const next = [...(p.exhibitionReports || [])];
                                  const blocks = [...next[activeAdminExhibitionTab].blocks];
                                  const table = { ...blk.table };
                                  const rows = [...table.rows];
                                  const cells = [...rows[rIdx].cells];
                                  cells[cIdx] = val;
                                  rows[rIdx] = { cells };
                                  blocks[bIdx] = { ...blk, table: { ...table, rows } };
                                  next[activeAdminExhibitionTab] = { ...next[activeAdminExhibitionTab], blocks };
                                  return { ...p, exhibitionReports: next };
                                });
                              }}
                            />
                          ))}
                          <button
                            type="button"
                            onClick={() => {
                              setData((p) => {
                                const next = [...(p.exhibitionReports || [])];
                                const blocks = [...next[activeAdminExhibitionTab].blocks];
                                const table = { ...blk.table };
                                const rows = table.rows.filter((_, i) => i !== rIdx);
                                blocks[bIdx] = { ...blk, table: { ...table, rows } };
                                next[activeAdminExhibitionTab] = { ...next[activeAdminExhibitionTab], blocks };
                                return { ...p, exhibitionReports: next };
                              });
                            }}
                            className="admin-btn-danger"
                            style={{ padding: '0.3rem' }}
                          >
                            <Trash2 size={12} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* SECTION 8.2: NATIONAL & REGIONAL PROJECT EXHIBITIONS & SUMMITS */}
      <div className="admin-card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div style={{ borderBottom: '2px solid #0284c7', paddingBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Globe2 size={18} color="#0284c7" />
          <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 700, color: '#0f172a' }}>
            National & Regional Project Exhibitions & Summits ({(data.exhibitionShowcases || []).length})
          </h3>
        </div>
        <p className="admin-field__hint" style={{ margin: 0 }}>
          Manage regional & national exhibition showcases (e.g. KL University, IIT Madras Makeathon, Telangana AT Summit). Rendered in a unified collapsible tab bar on the public website.
        </p>

        {/* Tab Buttons for Admin Showcase Selection */}
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', background: '#f8fafc', padding: '0.4rem', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
          {(data.exhibitionShowcases || []).map((sc, idx) => (
            <button
              key={sc.id || idx}
              type="button"
              onClick={() => setActiveAdminShowcaseTab(idx)}
              className={`admin-btn ${activeAdminShowcaseTab === idx ? 'admin-btn--primary' : 'admin-btn--secondary'}`}
              style={{ fontSize: '0.85rem', padding: '0.35rem 0.75rem' }}
            >
              {sc.tabLabel || `Showcase ${idx + 1}`}
            </button>
          ))}
          <button
            type="button"
            onClick={() => {
              const tabName = prompt('Enter Short Tab Name (e.g. National Summit 2026):', 'National Summit 2026');
              if (!tabName) return;
              const newShowcase: AtlExhibitionShowcase = {
                id: Date.now().toString(),
                tabLabel: tabName,
                title: `Projects Exhibiting at ${tabName}`,
                type: 'batches',
                batches: [
                  {
                    batchNo: 1,
                    selectedProject: 'Sample Project Name',
                    members: [
                      { regdNo: '21B01A0401', name: 'Sample Student Name', department: 'ECE' },
                    ],
                  },
                ],
              };
              setData((p) => {
                const next = [...(p.exhibitionShowcases || []), newShowcase];
                setActiveAdminShowcaseTab(next.length - 1);
                return { ...p, exhibitionShowcases: next };
              });
            }}
            className="admin-btn admin-btn--secondary"
            style={{ fontSize: '0.85rem', padding: '0.35rem 0.75rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}
          >
            <Plus size={14} /> Add Exhibition Showcase
          </button>
        </div>

        {/* Selected Showcase Form */}
        {((data.exhibitionShowcases || [])[activeAdminShowcaseTab]) && (() => {
          const sc = (data.exhibitionShowcases || [])[activeAdminShowcaseTab];
          const updateCurrentShowcase = (patch: Partial<AtlExhibitionShowcase>) => {
            setData((p) => {
              const next = [...(p.exhibitionShowcases || [])];
              next[activeAdminShowcaseTab] = { ...next[activeAdminShowcaseTab], ...patch };
              return { ...p, exhibitionShowcases: next };
            });
          };

          return (
            <div style={{ background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '10px', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flex: 1, minWidth: '240px' }}>
                  <span className="admin-field__label" style={{ margin: 0, whiteSpace: 'nowrap' }}>Tab Pill Label:</span>
                  <input
                    type="text"
                    className="admin-input"
                    value={sc.tabLabel}
                    onChange={(e) => updateCurrentShowcase({ tabLabel: e.target.value })}
                    style={{ fontWeight: 700, flex: 1 }}
                  />
                </div>

                <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#475569' }}>Display Type:</span>
                  <button
                    type="button"
                    onClick={() => updateCurrentShowcase({ type: 'batches', batches: sc.batches || [] })}
                    className={`admin-btn ${sc.type === 'batches' ? 'admin-btn--primary' : 'admin-btn--secondary'}`}
                    style={{ fontSize: '0.75rem', padding: '0.2rem 0.5rem' }}
                  >
                    Batches Grid
                  </button>
                  <button
                    type="button"
                    onClick={() => updateCurrentShowcase({ type: 'table', table: sc.table || { headers: ['S.No', 'Regd. No.', 'Student Name', 'Branch', 'Project'], rows: [] } })}
                    className={`admin-btn ${sc.type === 'table' ? 'admin-btn--primary' : 'admin-btn--secondary'}`}
                    style={{ fontSize: '0.75rem', padding: '0.2rem 0.5rem' }}
                  >
                    Single Table
                  </button>
                  <button
                    type="button"
                    disabled={activeAdminShowcaseTab === 0}
                    onClick={() => {
                      setData((p) => {
                        const next = [...(p.exhibitionShowcases || [])];
                        const tmp = next[activeAdminShowcaseTab];
                        next[activeAdminShowcaseTab] = next[activeAdminShowcaseTab - 1];
                        next[activeAdminShowcaseTab - 1] = tmp;
                        setActiveAdminShowcaseTab(activeAdminShowcaseTab - 1);
                        return { ...p, exhibitionShowcases: next };
                      });
                    }}
                    className="admin-btn admin-btn--secondary"
                    title="Move Up"
                  >
                    <ChevronUp size={14} />
                  </button>
                  <button
                    type="button"
                    disabled={activeAdminShowcaseTab === (data.exhibitionShowcases || []).length - 1}
                    onClick={() => {
                      setData((p) => {
                        const next = [...(p.exhibitionShowcases || [])];
                        const tmp = next[activeAdminShowcaseTab];
                        next[activeAdminShowcaseTab] = next[activeAdminShowcaseTab + 1];
                        next[activeAdminShowcaseTab + 1] = tmp;
                        setActiveAdminShowcaseTab(activeAdminShowcaseTab + 1);
                        return { ...p, exhibitionShowcases: next };
                      });
                    }}
                    className="admin-btn admin-btn--secondary"
                    title="Move Down"
                  >
                    <ChevronDown size={14} />
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (!confirm('Are you sure you want to delete this exhibition showcase?')) return;
                      setData((p) => {
                        const next = (p.exhibitionShowcases || []).filter((_, i) => i !== activeAdminShowcaseTab);
                        setActiveAdminShowcaseTab(Math.max(0, activeAdminShowcaseTab - 1));
                        return { ...p, exhibitionShowcases: next };
                      });
                    }}
                    className="admin-btn admin-btn--danger"
                    title="Delete Showcase"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>

              <div className="admin-field">
                <label className="admin-field__label">Full Exhibition Showcase Title</label>
                <input
                  type="text"
                  className="admin-input"
                  value={sc.title}
                  onChange={(e) => updateCurrentShowcase({ title: e.target.value })}
                />
              </div>

              {/* Batches Display Mode */}
              {sc.type === 'batches' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontWeight: 700, fontSize: '0.9rem', color: '#0f172a' }}>
                      Batches ({(sc.batches || []).length}):
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        const nextBatches = [
                          ...(sc.batches || []),
                          {
                            batchNo: (sc.batches || []).length + 1,
                            selectedProject: 'New Project',
                            members: [{ regdNo: '', name: '', department: '' }],
                          },
                        ];
                        updateCurrentShowcase({ batches: nextBatches });
                      }}
                      className="admin-btn admin-btn--secondary"
                      style={{ fontSize: '0.8rem', padding: '0.35rem 0.65rem' }}
                    >
                      <Plus size={14} /> Add Batch
                    </button>
                  </div>

                  {(sc.batches || []).map((b, bIdx) => (
                    <div key={bIdx} style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '0.75rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '0.5rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <span style={{ fontWeight: 700, fontSize: '0.85rem', color: '#0284c7' }}>Batch {b.batchNo}</span>
                          <input
                            type="number"
                            value={b.batchNo}
                            onChange={(e) => {
                              const updatedBatches = [...(sc.batches || [])];
                              updatedBatches[bIdx] = { ...updatedBatches[bIdx], batchNo: Number(e.target.value) };
                              updateCurrentShowcase({ batches: updatedBatches });
                            }}
                            className="admin-input"
                            style={{ width: '70px', padding: '0.2rem 0.4rem' }}
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            const updatedBatches = (sc.batches || []).filter((_, i) => i !== bIdx);
                            updateCurrentShowcase({ batches: updatedBatches });
                          }}
                          className="admin-btn-danger"
                          style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem' }}
                        >
                          <Trash2 size={12} /> Remove Batch
                        </button>
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                        <input
                          type="text"
                          value={b.selectedProject || ''}
                          onChange={(e) => {
                            const updatedBatches = [...(sc.batches || [])];
                            updatedBatches[bIdx] = { ...updatedBatches[bIdx], selectedProject: e.target.value };
                            updateCurrentShowcase({ batches: updatedBatches });
                          }}
                          className="admin-input"
                          placeholder="Selected Project"
                        />
                        <input
                          type="text"
                          value={b.mentors || ''}
                          onChange={(e) => {
                            const updatedBatches = [...(sc.batches || [])];
                            updatedBatches[bIdx] = { ...updatedBatches[bIdx], mentors: e.target.value };
                            updateCurrentShowcase({ batches: updatedBatches });
                          }}
                          className="admin-input"
                          placeholder="Mentors"
                        />
                      </div>

                      {/* Members list */}
                      <div style={{ borderTop: '1px solid #cbd5e1', paddingTop: '0.5rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                          <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#475569' }}>Members ({(b.members || []).length}):</span>
                          <button
                            type="button"
                            onClick={() => {
                              const updatedBatches = [...(sc.batches || [])];
                              updatedBatches[bIdx] = {
                                ...updatedBatches[bIdx],
                                members: [...(updatedBatches[bIdx].members || []), { regdNo: '', name: '', department: '' }],
                              };
                              updateCurrentShowcase({ batches: updatedBatches });
                            }}
                            className="admin-btn admin-btn--secondary"
                            style={{ fontSize: '0.75rem', padding: '0.2rem 0.45rem' }}
                          >
                            <Plus size={12} /> Add Student
                          </button>
                        </div>

                        {(b.members || []).map((m, mIdx) => (
                          <div key={mIdx} style={{ display: 'grid', gridTemplateColumns: '120px 1fr 100px 36px', gap: '0.4rem', marginBottom: '0.35rem' }}>
                            <input
                              type="text"
                              value={m.regdNo}
                              onChange={(e) => {
                                const updatedBatches = [...(sc.batches || [])];
                                const members = [...(updatedBatches[bIdx].members || [])];
                                members[mIdx] = { ...members[mIdx], regdNo: e.target.value };
                                updatedBatches[bIdx] = { ...updatedBatches[bIdx], members };
                                updateCurrentShowcase({ batches: updatedBatches });
                              }}
                              className="admin-input"
                              placeholder="Regd. No"
                            />
                            <input
                              type="text"
                              value={m.name}
                              onChange={(e) => {
                                const updatedBatches = [...(sc.batches || [])];
                                const members = [...(updatedBatches[bIdx].members || [])];
                                members[mIdx] = { ...members[mIdx], name: e.target.value };
                                updatedBatches[bIdx] = { ...updatedBatches[bIdx], members };
                                updateCurrentShowcase({ batches: updatedBatches });
                              }}
                              className="admin-input"
                              placeholder="Student Name"
                            />
                            <input
                              type="text"
                              value={m.department}
                              onChange={(e) => {
                                const updatedBatches = [...(sc.batches || [])];
                                const members = [...(updatedBatches[bIdx].members || [])];
                                members[mIdx] = { ...members[mIdx], department: e.target.value };
                                updatedBatches[bIdx] = { ...updatedBatches[bIdx], members };
                                updateCurrentShowcase({ batches: updatedBatches });
                              }}
                              className="admin-input"
                              placeholder="Dept"
                            />
                            <button
                              type="button"
                              onClick={() => {
                                const updatedBatches = [...(sc.batches || [])];
                                const members = (updatedBatches[bIdx].members || []).filter((_, i) => i !== mIdx);
                                updatedBatches[bIdx] = { ...updatedBatches[bIdx], members };
                                updateCurrentShowcase({ batches: updatedBatches });
                              }}
                              className="admin-btn-danger"
                              style={{ padding: '0.3rem' }}
                            >
                              <Trash2 size={12} />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Table Display Mode */}
              {sc.type === 'table' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontWeight: 700, fontSize: '0.9rem', color: '#0f172a' }}>
                      Table Rows ({(sc.table?.rows || []).length}):
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        const currentTable = sc.table || { headers: ['S.No', 'Regd. No.', 'Student Name', 'Branch', 'Project', 'YouTube Video Link'], rows: [] };
                        const nextRows = [
                          ...(currentTable.rows || []),
                          { cells: [String((currentTable.rows || []).length + 1), '', '', '', '', ''] },
                        ];
                        updateCurrentShowcase({ table: { ...currentTable, rows: nextRows } });
                      }}
                      className="admin-btn admin-btn--secondary"
                      style={{ fontSize: '0.8rem', padding: '0.35rem 0.65rem' }}
                    >
                      <Plus size={14} /> Add Row
                    </button>
                  </div>

                  {((sc.table && sc.table.rows) || []).map((row, rIdx) => (
                    <div key={rIdx} style={{ display: 'grid', gridTemplateColumns: '50px 110px 140px 90px 1fr 36px', gap: '0.4rem', alignItems: 'center' }}>
                      <input
                        type="text"
                        value={row.cells[0] || ''}
                        onChange={(e) => {
                          const currentTable = sc.table || { headers: ['S.No', 'Regd. No.', 'Student Name', 'Branch', 'Project', 'YouTube Video Link'], rows: [] };
                          const nextRows = [...currentTable.rows];
                          const cells = [...(nextRows[rIdx].cells || [])];
                          cells[0] = e.target.value;
                          nextRows[rIdx] = { cells };
                          updateCurrentShowcase({ table: { ...currentTable, rows: nextRows } });
                        }}
                        className="admin-input"
                        placeholder="S.No"
                      />
                      <input
                        type="text"
                        value={row.cells[1] || ''}
                        onChange={(e) => {
                          const currentTable = sc.table || { headers: ['S.No', 'Regd. No.', 'Student Name', 'Branch', 'Project', 'YouTube Video Link'], rows: [] };
                          const nextRows = [...currentTable.rows];
                          const cells = [...(nextRows[rIdx].cells || [])];
                          cells[1] = e.target.value;
                          nextRows[rIdx] = { cells };
                          updateCurrentShowcase({ table: { ...currentTable, rows: nextRows } });
                        }}
                        className="admin-input"
                        placeholder="Regd No"
                      />
                      <input
                        type="text"
                        value={row.cells[2] || ''}
                        onChange={(e) => {
                          const currentTable = sc.table || { headers: ['S.No', 'Regd. No.', 'Student Name', 'Branch', 'Project', 'YouTube Video Link'], rows: [] };
                          const nextRows = [...currentTable.rows];
                          const cells = [...(nextRows[rIdx].cells || [])];
                          cells[2] = e.target.value;
                          nextRows[rIdx] = { cells };
                          updateCurrentShowcase({ table: { ...currentTable, rows: nextRows } });
                        }}
                        className="admin-input"
                        placeholder="Student Name"
                      />
                      <input
                        type="text"
                        value={row.cells[3] || ''}
                        onChange={(e) => {
                          const currentTable = sc.table || { headers: ['S.No', 'Regd. No.', 'Student Name', 'Branch', 'Project', 'YouTube Video Link'], rows: [] };
                          const nextRows = [...currentTable.rows];
                          const cells = [...(nextRows[rIdx].cells || [])];
                          cells[3] = e.target.value;
                          nextRows[rIdx] = { cells };
                          updateCurrentShowcase({ table: { ...currentTable, rows: nextRows } });
                        }}
                        className="admin-input"
                        placeholder="Branch"
                      />
                      <input
                        type="text"
                        value={row.cells[4] || ''}
                        onChange={(e) => {
                          const currentTable = sc.table || { headers: ['S.No', 'Regd. No.', 'Student Name', 'Branch', 'Project', 'YouTube Video Link'], rows: [] };
                          const nextRows = [...currentTable.rows];
                          const cells = [...(nextRows[rIdx].cells || [])];
                          cells[4] = e.target.value;
                          nextRows[rIdx] = { cells };
                          updateCurrentShowcase({ table: { ...currentTable, rows: nextRows } });
                        }}
                        className="admin-input"
                        placeholder="Project Name"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const currentTable = sc.table || { headers: ['S.No', 'Regd. No.', 'Student Name', 'Branch', 'Project', 'YouTube Video Link'], rows: [] };
                          const nextRows = currentTable.rows.filter((_, i) => i !== rIdx);
                          updateCurrentShowcase({ table: { ...currentTable, rows: nextRows } });
                        }}
                        className="admin-btn-danger"
                        style={{ padding: '0.35rem' }}
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  ))}
                </div>
              )}

            </div>
          );
        })()}
      </div>

      {/* SECTION 8.3: ATL PROJECT OUTCOMES & TECH FESTS */}
      <div className="admin-card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div style={{ borderBottom: '2px solid #0284c7', paddingBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Sparkles size={18} color="#0284c7" />
          <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 700, color: '#0f172a' }}>
            ATL Project Outcomes & Tech Fests ({(data.atlOutcomes || []).length})
          </h3>
        </div>
        <p className="admin-field__hint" style={{ margin: 0 }}>
          Manage specialized project outcomes, tech fest achievements, and competition awards (e.g. TRANCE-2K25, IIC Regional Meet Vijayawada). Rendered in a separate collapsible pill tab section on the public website.
        </p>

        {/* Tab Buttons for Admin Outcome Selection */}
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', background: '#f8fafc', padding: '0.4rem', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
          {(data.atlOutcomes || []).map((out, idx) => (
            <button
              key={out.id || idx}
              type="button"
              onClick={() => setActiveAdminOutcomeTab(idx)}
              className={`admin-btn ${activeAdminOutcomeTab === idx ? 'admin-btn--primary' : 'admin-btn--secondary'}`}
              style={{ fontSize: '0.85rem', padding: '0.35rem 0.75rem' }}
            >
              {out.tabLabel || `Outcome ${idx + 1}`}
            </button>
          ))}
          <button
            type="button"
            onClick={() => {
              const tabName = prompt('Enter Short Tab Name (e.g. Tech Fest 2026):', 'Tech Fest 2026');
              if (!tabName) return;
              const newOutcome: AtlProjectOutcome = {
                id: Date.now().toString(),
                tabLabel: tabName,
                title: `ATL Project Outcome — ${tabName}`,
                blocks: [
                  { type: 'paragraph', text: 'Enter outcome details here...' },
                ],
              };
              setData((p) => {
                const next = [...(p.atlOutcomes || []), newOutcome];
                setActiveAdminOutcomeTab(next.length - 1);
                return { ...p, atlOutcomes: next };
              });
            }}
            className="admin-btn admin-btn--secondary"
            style={{ fontSize: '0.85rem', padding: '0.35rem 0.75rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}
          >
            <Plus size={14} /> Add Outcome Item
          </button>
        </div>

        {/* Selected Outcome Form */}
        {((data.atlOutcomes || [])[activeAdminOutcomeTab]) && (() => {
          const out = (data.atlOutcomes || [])[activeAdminOutcomeTab];
          const updateCurrentOutcome = (patch: Partial<AtlProjectOutcome>) => {
            setData((p) => {
              const next = [...(p.atlOutcomes || [])];
              next[activeAdminOutcomeTab] = { ...next[activeAdminOutcomeTab], ...patch };
              return { ...p, atlOutcomes: next };
            });
          };

          return (
            <div style={{ background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '10px', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flex: 1, minWidth: '240px' }}>
                  <span className="admin-field__label" style={{ margin: 0, whiteSpace: 'nowrap' }}>Tab Pill Label:</span>
                  <input
                    type="text"
                    className="admin-input"
                    value={out.tabLabel}
                    onChange={(e) => updateCurrentOutcome({ tabLabel: e.target.value })}
                    style={{ fontWeight: 700, flex: 1 }}
                  />
                </div>

                <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center' }}>
                  <button
                    type="button"
                    disabled={activeAdminOutcomeTab === 0}
                    onClick={() => {
                      setData((p) => {
                        const next = [...(p.atlOutcomes || [])];
                        const tmp = next[activeAdminOutcomeTab];
                        next[activeAdminOutcomeTab] = next[activeAdminOutcomeTab - 1];
                        next[activeAdminOutcomeTab - 1] = tmp;
                        setActiveAdminOutcomeTab(activeAdminOutcomeTab - 1);
                        return { ...p, atlOutcomes: next };
                      });
                    }}
                    className="admin-btn admin-btn--secondary"
                    title="Move Up"
                  >
                    <ChevronUp size={14} />
                  </button>
                  <button
                    type="button"
                    disabled={activeAdminOutcomeTab === (data.atlOutcomes || []).length - 1}
                    onClick={() => {
                      setData((p) => {
                        const next = [...(p.atlOutcomes || [])];
                        const tmp = next[activeAdminOutcomeTab];
                        next[activeAdminOutcomeTab] = next[activeAdminOutcomeTab + 1];
                        next[activeAdminOutcomeTab + 1] = tmp;
                        setActiveAdminOutcomeTab(activeAdminOutcomeTab + 1);
                        return { ...p, atlOutcomes: next };
                      });
                    }}
                    className="admin-btn admin-btn--secondary"
                    title="Move Down"
                  >
                    <ChevronDown size={14} />
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (!confirm('Are you sure you want to delete this project outcome item?')) return;
                      setData((p) => {
                        const next = (p.atlOutcomes || []).filter((_, i) => i !== activeAdminOutcomeTab);
                        setActiveAdminOutcomeTab(Math.max(0, activeAdminOutcomeTab - 1));
                        return { ...p, atlOutcomes: next };
                      });
                    }}
                    className="admin-btn admin-btn--danger"
                    title="Delete Outcome Item"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>

              <div className="admin-field">
                <label className="admin-field__label">Full Outcome Item Title</label>
                <input
                  type="text"
                  className="admin-input"
                  value={out.title}
                  onChange={(e) => updateCurrentOutcome({ title: e.target.value })}
                />
              </div>

              {/* Paragraphs Editor */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontWeight: 700, fontSize: '0.9rem', color: '#0f172a' }}>
                    Paragraph Blocks ({(out.blocks || []).length}):
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      const nextBlocks: AtlBlock[] = [
                        ...(out.blocks || []),
                        { type: 'paragraph', text: '' },
                      ];
                      updateCurrentOutcome({ blocks: nextBlocks });
                    }}
                    className="admin-btn admin-btn--secondary"
                    style={{ fontSize: '0.8rem', padding: '0.35rem 0.65rem' }}
                  >
                    <Plus size={14} /> Add Paragraph
                  </button>
                </div>

                {(out.blocks || []).map((blk, bIdx) => (
                  <div key={bIdx} style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '0.75rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontWeight: 700, fontSize: '0.8rem', color: '#475569' }}>Paragraph {bIdx + 1}</span>
                      <button
                        type="button"
                        onClick={() => {
                          const nextBlocks = (out.blocks || []).filter((_, i) => i !== bIdx);
                          updateCurrentOutcome({ blocks: nextBlocks });
                        }}
                        className="admin-btn-danger"
                        style={{ padding: '0.25rem 0.45rem', fontSize: '0.75rem' }}
                      >
                        <Trash2 size={12} /> Remove Paragraph
                      </button>
                    </div>

                    {blk.type === 'paragraph' && (
                      <textarea
                        rows={6}
                        className="admin-textarea"
                        value={blk.text}
                        onChange={(e) => {
                          const nextBlocks = [...(out.blocks || [])];
                          nextBlocks[bIdx] = { type: 'paragraph', text: e.target.value };
                          updateCurrentOutcome({ blocks: nextBlocks });
                        }}
                        placeholder="Enter paragraph text..."
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>
          );
        })()}
      </div>

      {/* SECTION 8.4: ZION SCHOOL & CLIENT FIELD VISITS */}
      <div className="admin-card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div style={{ borderBottom: '2px solid #0284c7', paddingBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Globe2 size={18} color="#0284c7" />
          <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 700, color: '#0f172a' }}>
            Zion School & Client Field Visits ({(data.clientVisits || []).length})
          </h3>
        </div>
        <p className="admin-field__hint" style={{ margin: 0 }}>
          Manage Zion School ATL visits and client consultation field visit reports (e.g. ZION School Visit 2023-24, Client Visit Report Zion School Rajahmundry 2025-26). Rendered in a single collapsible pill tab section on the public website.
        </p>

        {/* Tab Buttons for Admin Client Visit Selection */}
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', background: '#f8fafc', padding: '0.4rem', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
          {(data.clientVisits || []).map((visit, idx) => (
            <button
              key={visit.id || idx}
              type="button"
              onClick={() => setActiveAdminClientVisitTab(idx)}
              className={`admin-btn ${activeAdminClientVisitTab === idx ? 'admin-btn--primary' : 'admin-btn--secondary'}`}
              style={{ fontSize: '0.85rem', padding: '0.35rem 0.75rem' }}
            >
              {visit.tabLabel || `Visit ${idx + 1}`}
            </button>
          ))}
          <button
            type="button"
            onClick={() => {
              const tabName = prompt('Enter Short Tab Name (e.g. Zion School Visit 2026-27):', 'Zion Visit 2026-27');
              if (!tabName) return;
              const newVisit: AtlClientVisitYear = {
                id: Date.now().toString(),
                tabLabel: tabName,
                title: `Client Visit Report — ${tabName}`,
                blocks: [
                  { type: 'paragraph', text: 'Enter visit report details here...' },
                ],
              };
              setData((p) => {
                const next = [...(p.clientVisits || []), newVisit];
                setActiveAdminClientVisitTab(next.length - 1);
                return { ...p, clientVisits: next };
              });
            }}
            className="admin-btn admin-btn--secondary"
            style={{ fontSize: '0.85rem', padding: '0.35rem 0.75rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}
          >
            <Plus size={14} /> Add Visit Item
          </button>
        </div>

        {/* Selected Client Visit Form */}
        {((data.clientVisits || [])[activeAdminClientVisitTab]) && (() => {
          const visit = (data.clientVisits || [])[activeAdminClientVisitTab];
          const updateCurrentVisit = (patch: Partial<AtlClientVisitYear>) => {
            setData((p) => {
              const next = [...(p.clientVisits || [])];
              next[activeAdminClientVisitTab] = { ...next[activeAdminClientVisitTab], ...patch };
              return { ...p, clientVisits: next };
            });
          };

          return (
            <div style={{ background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '10px', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flex: 1, minWidth: '240px' }}>
                  <span className="admin-field__label" style={{ margin: 0, whiteSpace: 'nowrap' }}>Tab Pill Label:</span>
                  <input
                    type="text"
                    className="admin-input"
                    value={visit.tabLabel}
                    onChange={(e) => updateCurrentVisit({ tabLabel: e.target.value })}
                    style={{ fontWeight: 700, flex: 1 }}
                  />
                </div>

                <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center' }}>
                  <button
                    type="button"
                    disabled={activeAdminClientVisitTab === 0}
                    onClick={() => {
                      setData((p) => {
                        const next = [...(p.clientVisits || [])];
                        const tmp = next[activeAdminClientVisitTab];
                        next[activeAdminClientVisitTab] = next[activeAdminClientVisitTab - 1];
                        next[activeAdminClientVisitTab - 1] = tmp;
                        setActiveAdminClientVisitTab(activeAdminClientVisitTab - 1);
                        return { ...p, clientVisits: next };
                      });
                    }}
                    className="admin-btn admin-btn--secondary"
                    title="Move Up"
                  >
                    <ChevronUp size={14} />
                  </button>
                  <button
                    type="button"
                    disabled={activeAdminClientVisitTab === (data.clientVisits || []).length - 1}
                    onClick={() => {
                      setData((p) => {
                        const next = [...(p.clientVisits || [])];
                        const tmp = next[activeAdminClientVisitTab];
                        next[activeAdminClientVisitTab] = next[activeAdminClientVisitTab + 1];
                        next[activeAdminClientVisitTab + 1] = tmp;
                        setActiveAdminClientVisitTab(activeAdminClientVisitTab + 1);
                        return { ...p, clientVisits: next };
                      });
                    }}
                    className="admin-btn admin-btn--secondary"
                    title="Move Down"
                  >
                    <ChevronDown size={14} />
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (!confirm('Are you sure you want to delete this client visit item?')) return;
                      setData((p) => {
                        const next = (p.clientVisits || []).filter((_, i) => i !== activeAdminClientVisitTab);
                        setActiveAdminClientVisitTab(Math.max(0, activeAdminClientVisitTab - 1));
                        return { ...p, clientVisits: next };
                      });
                    }}
                    className="admin-btn admin-btn--danger"
                    title="Delete Visit Item"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>

              <div className="admin-field">
                <label className="admin-field__label">Full Visit Report Title</label>
                <input
                  type="text"
                  className="admin-input"
                  value={visit.title}
                  onChange={(e) => updateCurrentVisit({ title: e.target.value })}
                />
              </div>

              {/* Full Featured Block Editor */}
              <AtlBlockListEditor
                blocks={visit.blocks || []}
                onChange={(nextBlocks) => updateCurrentVisit({ blocks: nextBlocks })}
              />
            </div>
          );
        })()}
      </div>

      {/* SECTION 8.5: INNOVATION PROJECT FAIRS & REGIONAL EXPOS */}
      <div className="admin-card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div style={{ borderBottom: '2px solid #0284c7', paddingBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Sparkles size={18} color="#0284c7" />
          <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 700, color: '#0f172a' }}>
            Innovation Project Fairs & Regional Expos ({(data.innovationFairs || []).length})
          </h3>
        </div>
        <p className="admin-field__hint" style={{ margin: 0 }}>
          Manage state-level innovation fairs, regional technology hub showcases, and incubation center inauguration expos (e.g. JNTU Kakinada Fair, AVISHKANDHRA RTIH, IIC Rajahmundry Expo). Rendered in a single collapsible pill tab section on the public website.
        </p>

        {/* Tab Buttons for Admin Innovation Fair Selection */}
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', background: '#f8fafc', padding: '0.4rem', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
          {(data.innovationFairs || []).map((fair, idx) => (
            <button
              key={fair.id || idx}
              type="button"
              onClick={() => setActiveAdminInnovationTab(idx)}
              className={`admin-btn ${activeAdminInnovationTab === idx ? 'admin-btn--primary' : 'admin-btn--secondary'}`}
              style={{ fontSize: '0.85rem', padding: '0.35rem 0.75rem' }}
            >
              {fair.tabLabel || `Fair ${idx + 1}`}
            </button>
          ))}
          <button
            type="button"
            onClick={() => {
              const tabName = prompt('Enter Short Tab Name (e.g. Project Fair 2026):', 'Project Fair 2026');
              if (!tabName) return;
              const newFair: AtlInnovationFair = {
                id: Date.now().toString(),
                tabLabel: tabName,
                title: `Innovation Project Fair — ${tabName}`,
                blocks: [
                  { type: 'paragraph', text: 'Enter project fair details here...' },
                ],
              };
              setData((p) => {
                const next = [...(p.innovationFairs || []), newFair];
                setActiveAdminInnovationTab(next.length - 1);
                return { ...p, innovationFairs: next };
              });
            }}
            className="admin-btn admin-btn--secondary"
            style={{ fontSize: '0.85rem', padding: '0.35rem 0.75rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}
          >
            <Plus size={14} /> Add Fair Item
          </button>
        </div>

        {/* Selected Innovation Fair Form */}
        {((data.innovationFairs || [])[activeAdminInnovationTab]) && (() => {
          const fair = (data.innovationFairs || [])[activeAdminInnovationTab];
          const updateCurrentFair = (patch: Partial<AtlInnovationFair>) => {
            setData((p) => {
              const next = [...(p.innovationFairs || [])];
              next[activeAdminInnovationTab] = { ...next[activeAdminInnovationTab], ...patch };
              return { ...p, innovationFairs: next };
            });
          };

          return (
            <div style={{ background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '10px', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flex: 1, minWidth: '240px' }}>
                  <span className="admin-field__label" style={{ margin: 0, whiteSpace: 'nowrap' }}>Tab Pill Label:</span>
                  <input
                    type="text"
                    className="admin-input"
                    value={fair.tabLabel}
                    onChange={(e) => updateCurrentFair({ tabLabel: e.target.value })}
                    style={{ fontWeight: 700, flex: 1 }}
                  />
                </div>

                <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center' }}>
                  <button
                    type="button"
                    disabled={activeAdminInnovationTab === 0}
                    onClick={() => {
                      setData((p) => {
                        const next = [...(p.innovationFairs || [])];
                        const tmp = next[activeAdminInnovationTab];
                        next[activeAdminInnovationTab] = next[activeAdminInnovationTab - 1];
                        next[activeAdminInnovationTab - 1] = tmp;
                        setActiveAdminInnovationTab(activeAdminInnovationTab - 1);
                        return { ...p, innovationFairs: next };
                      });
                    }}
                    className="admin-btn admin-btn--secondary"
                    title="Move Up"
                  >
                    <ChevronUp size={14} />
                  </button>
                  <button
                    type="button"
                    disabled={activeAdminInnovationTab === (data.innovationFairs || []).length - 1}
                    onClick={() => {
                      setData((p) => {
                        const next = [...(p.innovationFairs || [])];
                        const tmp = next[activeAdminInnovationTab];
                        next[activeAdminInnovationTab] = next[activeAdminInnovationTab + 1];
                        next[activeAdminInnovationTab + 1] = tmp;
                        setActiveAdminInnovationTab(activeAdminInnovationTab + 1);
                        return { ...p, innovationFairs: next };
                      });
                    }}
                    className="admin-btn admin-btn--secondary"
                    title="Move Down"
                  >
                    <ChevronDown size={14} />
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (!confirm('Are you sure you want to delete this innovation fair item?')) return;
                      setData((p) => {
                        const next = (p.innovationFairs || []).filter((_, i) => i !== activeAdminInnovationTab);
                        setActiveAdminInnovationTab(Math.max(0, activeAdminInnovationTab - 1));
                        return { ...p, innovationFairs: next };
                      });
                    }}
                    className="admin-btn admin-btn--danger"
                    title="Delete Fair Item"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>

              <div className="admin-field">
                <label className="admin-field__label">Full Fair Report Title</label>
                <input
                  type="text"
                  className="admin-input"
                  value={fair.title}
                  onChange={(e) => updateCurrentFair({ title: e.target.value })}
                />
              </div>

              {/* Paragraphs Editor */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontWeight: 700, fontSize: '0.9rem', color: '#0f172a' }}>
                    Paragraph Blocks ({(fair.blocks || []).length}):
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      const nextBlocks: AtlBlock[] = [
                        ...(fair.blocks || []),
                        { type: 'paragraph', text: '' },
                      ];
                      updateCurrentFair({ blocks: nextBlocks });
                    }}
                    className="admin-btn admin-btn--secondary"
                    style={{ fontSize: '0.8rem', padding: '0.35rem 0.65rem' }}
                  >
                    <Plus size={14} /> Add Paragraph
                  </button>
                </div>

                {(fair.blocks || []).map((blk, bIdx) => (
                  <div key={bIdx} style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '0.75rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontWeight: 700, fontSize: '0.8rem', color: '#475569' }}>Paragraph {bIdx + 1}</span>
                      <button
                        type="button"
                        onClick={() => {
                          const nextBlocks = (fair.blocks || []).filter((_, i) => i !== bIdx);
                          updateCurrentFair({ blocks: nextBlocks });
                        }}
                        className="admin-btn-danger"
                        style={{ padding: '0.25rem 0.45rem', fontSize: '0.75rem' }}
                      >
                        <Trash2 size={12} /> Remove Paragraph
                      </button>
                    </div>

                    {blk.type === 'paragraph' && (
                      <textarea
                        rows={6}
                        className="admin-textarea"
                        value={blk.text}
                        onChange={(e) => {
                          const nextBlocks = [...(fair.blocks || [])];
                          nextBlocks[bIdx] = { type: 'paragraph', text: e.target.value };
                          updateCurrentFair({ blocks: nextBlocks });
                        }}
                        placeholder="Enter paragraph text..."
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>
          );
        })()}
      </div>

      {/* SECTION 8.5: CORE LAB SECTIONS (01 to 08) */}
      <div className="admin-card" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        <div style={{ borderBottom: '2px solid #0284c7', paddingBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Layers size={18} color="#0284c7" />
          <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 700, color: '#0f172a' }}>
            8.5 Core Lab Sections (Collaborations, Clients, Testimonials, Seminars, People, Publications, Outcomes, Partners)
          </h3>
        </div>
        <p className="admin-field__hint" style={{ margin: 0 }}>
          Manage content for the 8 core sections below as dedicated structured admin inputs instead of custom sections.
        </p>

        {/* 01 Collaborations */}
        <div style={{ background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '8px', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ background: '#fef3c7', color: '#92400e', fontWeight: 700, fontSize: '0.85rem', padding: '0.2rem 0.6rem', borderRadius: '4px' }}>01</span>
            <label className="admin-label" style={{ margin: 0, fontWeight: 700, fontSize: '1rem', color: '#0f172a' }}>Collaborations</label>
          </div>
          <textarea
            rows={4}
            className="admin-textarea"
            value={eightSections.collaborations.textContent || eightSections.collaborations.listText || ''}
            onChange={(e) => setEightSections((prev) => ({ ...prev, collaborations: { ...prev.collaborations, contentType: 'text', textContent: e.target.value } }))}
            placeholder="Enter Collaborations details..."
          />
        </div>

        {/* 02 Clients */}
        <div style={{ background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '8px', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ background: '#fef3c7', color: '#92400e', fontWeight: 700, fontSize: '0.85rem', padding: '0.2rem 0.6rem', borderRadius: '4px' }}>02</span>
            <label className="admin-label" style={{ margin: 0, fontWeight: 700, fontSize: '1rem', color: '#0f172a' }}>Clients</label>
            <span className="admin-field__hint" style={{ margin: 0 }}>(List items — one per line)</span>
          </div>
          <textarea
            rows={5}
            className="admin-textarea"
            value={eightSections.clients.listText || eightSections.clients.textContent || ''}
            onChange={(e) => setEightSections((prev) => ({ ...prev, clients: { ...prev.clients, contentType: 'list', listText: e.target.value } }))}
            placeholder="Enter Client names (one per line)..."
          />
        </div>

        {/* 03 Testimonials */}
        <div style={{ background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '8px', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ background: '#fef3c7', color: '#92400e', fontWeight: 700, fontSize: '0.85rem', padding: '0.2rem 0.6rem', borderRadius: '4px' }}>03</span>
            <label className="admin-label" style={{ margin: 0, fontWeight: 700, fontSize: '1rem', color: '#0f172a' }}>Testimonials</label>
            <span className="admin-field__hint" style={{ margin: 0 }}>(List of feedback & quotes — one per line)</span>
          </div>
          <textarea
            rows={6}
            className="admin-textarea"
            value={eightSections.testimonials.listText || eightSections.testimonials.textContent || ''}
            onChange={(e) => setEightSections((prev) => ({ ...prev, testimonials: { ...prev.testimonials, contentType: 'list', listText: e.target.value } }))}
            placeholder="Enter Testimonials (one per line)..."
          />
        </div>

        {/* 04 Seminars */}
        <div style={{ background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '8px', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ background: '#fef3c7', color: '#92400e', fontWeight: 700, fontSize: '0.85rem', padding: '0.2rem 0.6rem', borderRadius: '4px' }}>04</span>
            <label className="admin-label" style={{ margin: 0, fontWeight: 700, fontSize: '1rem', color: '#0f172a' }}>Seminars</label>
            <span className="admin-field__hint" style={{ margin: 0 }}>(List of seminars/workshops — one per line)</span>
          </div>
          <textarea
            rows={5}
            className="admin-textarea"
            value={eightSections.seminars.listText || eightSections.seminars.textContent || ''}
            onChange={(e) => setEightSections((prev) => ({ ...prev, seminars: { ...prev.seminars, contentType: 'list', listText: e.target.value } }))}
            placeholder="Enter Seminars details (one per line)..."
          />
        </div>

        {/* 05 People / Institutions Involved */}
        <div style={{ background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '8px', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ background: '#fef3c7', color: '#92400e', fontWeight: 700, fontSize: '0.85rem', padding: '0.2rem 0.6rem', borderRadius: '4px' }}>05</span>
            <label className="admin-label" style={{ margin: 0, fontWeight: 700, fontSize: '1rem', color: '#0f172a' }}>People / Institutions Involved</label>
          </div>
          <textarea
            rows={6}
            className="admin-textarea"
            value={eightSections.people.textContent || eightSections.people.listText || ''}
            onChange={(e) => setEightSections((prev) => ({ ...prev, people: { ...prev.people, contentType: 'text', textContent: e.target.value } }))}
            placeholder="Enter People & Institutions Involved details..."
          />
        </div>

        {/* 06 Publications */}
        <div style={{ background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '8px', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ background: '#fef3c7', color: '#92400e', fontWeight: 700, fontSize: '0.85rem', padding: '0.2rem 0.6rem', borderRadius: '4px' }}>06</span>
            <label className="admin-label" style={{ margin: 0, fontWeight: 700, fontSize: '1rem', color: '#0f172a' }}>Publications</label>
            <span className="admin-field__hint" style={{ margin: 0 }}>(List of published papers — one per line)</span>
          </div>
          <textarea
            rows={6}
            className="admin-textarea"
            value={eightSections.publications.listText || eightSections.publications.textContent || ''}
            onChange={(e) => setEightSections((prev) => ({ ...prev, publications: { ...prev.publications, contentType: 'list', listText: e.target.value } }))}
            placeholder="Enter Publications (one per line)..."
          />
        </div>

        {/* 07 Outcomes & Achievements */}
        <div style={{ background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '8px', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ background: '#fef3c7', color: '#92400e', fontWeight: 700, fontSize: '0.85rem', padding: '0.2rem 0.6rem', borderRadius: '4px' }}>07</span>
            <label className="admin-label" style={{ margin: 0, fontWeight: 700, fontSize: '1rem', color: '#0f172a' }}>Outcomes & Achievements</label>
          </div>
          <textarea
            rows={5}
            className="admin-textarea"
            value={eightSections.outcomes.textContent || eightSections.outcomes.listText || ''}
            onChange={(e) => setEightSections((prev) => ({ ...prev, outcomes: { ...prev.outcomes, contentType: 'text', textContent: e.target.value } }))}
            placeholder="Enter Outcomes & Achievements..."
          />
        </div>

        {/* 08 Partners */}
        <div style={{ background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '8px', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ background: '#fef3c7', color: '#92400e', fontWeight: 700, fontSize: '0.85rem', padding: '0.2rem 0.6rem', borderRadius: '4px' }}>08</span>
            <label className="admin-label" style={{ margin: 0, fontWeight: 700, fontSize: '1rem', color: '#0f172a' }}>Partners</label>
          </div>
          <textarea
            rows={4}
            className="admin-textarea"
            value={eightSections.partners.textContent || eightSections.partners.listText || ''}
            onChange={(e) => setEightSections((prev) => ({ ...prev, partners: { ...prev.partners, contentType: 'text', textContent: e.target.value } }))}
            placeholder="Enter Partners details..."
          />
        </div>
      </div>

      <div className="admin-card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div style={{ borderBottom: '2px solid #0284c7', paddingBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Sparkles size={18} color="#0284c7" />
          <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 700, color: '#0f172a' }}>
            9. Custom Sections / Additional Content ({data.customSections?.length || 0})
          </h3>
        </div>
        <p className="admin-field__hint" style={{ margin: 0 }}>
          Add any custom sections needed — extra paragraphs, tables, checklists, photo galleries, file downloads, or contacts. Any custom section added here will automatically render on the Assistive Technology Lab page.
        </p>

        <CustomSectionEditor
          sections={data.customSections || []}
          onChange={(next) => setData((p) => ({ ...p, customSections: next }))}
          rootSections={data.customSections || []}
          parentPath={[]}
          onFileUploaded={handleCustomSectionFileUploaded}
          onFileRemoved={handleCustomSectionFileRemoved}
          onPhotoUploaded={handleCustomSectionPhotoUploaded}
          onPhotoRemoved={handleCustomSectionPhotoRemoved}
          onGalleryPhotoUploaded={handleCustomSectionGalleryPhotoUploaded}
          onGalleryPhotoRemoved={handleCustomSectionGalleryPhotoRemoved}
          showPlacementToggle
        />
      </div>

      {/* Bottom Save Bar */}
      <div className="admin-card" style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
        <button
          type="button"
          onClick={handleReset}
          className="admin-btn admin-btn--secondary"
          style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}
        >
          <RotateCcw size={14} /> Reset Defaults
        </button>
        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className="admin-btn admin-btn--primary"
          style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}
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
  );
}
