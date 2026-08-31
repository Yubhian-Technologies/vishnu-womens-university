import { useState } from 'react';
import { collection, addDoc, deleteDoc, doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../../lib/firebase';
import { useOrderedCollection } from '../../../hooks/useCollection';
import ImageUploader from '../../../components/ImageUploader/ImageUploader';
import type { UploadResult } from '../../../lib/storage';
import { PROGRAM_ICON_NAMES } from '../../../lib/programIcons';
import type { LibrarySection, LibraryItem } from './ProgramsAdmin';

// Backs the "Academic Departments" card grid on Academics.tsx — independent
// of the `programs` collection, so a department's card copy doesn't have to
// borrow one specific program's name/about text (which broke down once a
// department groups more than one program, e.g. AI&ML + AI&DS under "AI").
//
// The extra fields below (about / hod* / labs / vision …) power the grouped
// department pages (AI, CSE, ECE — see src/lib/departmentGroups.ts): the
// shared top of /academics/<grouped-slug> reads from this doc, matched by
// `shortCode`. They're all optional — a plain department card ignores them.
export interface ProgramLevelRow {
  program: string;
  intake: string;
}

export interface ProgramLevel {
  title: string;
  intro: string;
  rows: ProgramLevelRow[];
}

export interface DepartmentDoc {
  id: string;
  title: string;
  shortCode: string;
  description: string;
  icon: string;
  order: number;
  // Grouped-department page (shared top) content — all optional.
  heroImage?: string;
  storagePath?: string;
  about?: string;
  established?: string;
  accreditation?: string;
  hod?: string;
  hodImage?: string;
  hodImageStoragePath?: string;
  hodEmail?: string;
  hodMessage?: string;
  vision?: string;
  mission?: string[];
  coreValues?: string[];
  labs?: string[];
  // Digital Library — same shape as a programme's own (see ProgramsAdmin),
  // shown as a shared section before the program toggle on the grouped
  // department page.
  libraryIntro?: string;
  libraryInCharge?: string;
  librarySections?: LibrarySection[];
  // Programme Levels (e.g. "B.Tech.", "M.Tech.") — each a heading + intro
  // paragraph + an intake table, shown right below "About the Department".
  programLevels?: ProgramLevel[];
  // Placements — shared across the department's programmes. placementStats
  // reuses the { label, value } shape (e.g. "Highest Package" / "₹12 LPA").
  placementIntro?: string;
  placementStats?: LibraryItem[];
  placementRecruiters?: string[];
}

const EMPTY: Omit<DepartmentDoc, 'id'> = {
  title: '', shortCode: '', description: '', icon: 'GraduationCap', order: 0,
  heroImage: '', storagePath: '', about: '', established: '', accreditation: '',
  hod: '', hodImage: '', hodImageStoragePath: '', hodEmail: '', hodMessage: '',
  vision: '', mission: [], coreValues: [], labs: [],
  libraryIntro: '', libraryInCharge: '', librarySections: [],
  programLevels: [],
  placementIntro: '', placementStats: [], placementRecruiters: [],
};

function linesToArray(text: string): string[] {
  return text.split('\n').map((s) => s.trim());
}
function arrayToLines(arr: string[] = []): string {
  return arr.join('\n');
}

export default function DepartmentsAdmin() {
  const { docs: departments, loading } = useOrderedCollection<DepartmentDoc>('departments', 'order');
  const [form, setForm] = useState<Omit<DepartmentDoc, 'id'>>(EMPTY);
  const [editing, setEditing] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const set = (k: string, v: string | number | string[] | LibrarySection[] | ProgramLevel[] | LibraryItem[]) => setForm((p) => ({ ...p, [k]: v }));
  const handleHero = (r: UploadResult) => setForm((p) => ({ ...p, heroImage: r.url, storagePath: r.path }));
  const handleHodImage = (r: UploadResult) => setForm((p) => ({ ...p, hodImage: r.url, hodImageStoragePath: r.path }));

  // Digital Library section editor — same add/reorder/remove pattern as the
  // per-programme one in ProgramsAdmin.
  const librarySections = form.librarySections || [];
  const addLibrarySection = () => {
    set('librarySections', [...librarySections, { heading: `Section ${librarySections.length + 1}`, items: [] }]);
  };
  const updateLibrarySectionHeading = (si: number, heading: string) => {
    set('librarySections', librarySections.map((s, i) => (i === si ? { ...s, heading } : s)));
  };
  const moveLibrarySection = (si: number, dir: -1 | 1) => {
    const next = [...librarySections];
    const target = si + dir;
    if (target < 0 || target >= next.length) return;
    [next[si], next[target]] = [next[target], next[si]];
    set('librarySections', next);
  };
  const removeLibrarySection = (si: number) => {
    set('librarySections', librarySections.filter((_, i) => i !== si));
  };
  const addLibraryItem = (si: number) => {
    set('librarySections', librarySections.map((s, i) => (i === si ? { ...s, items: [...s.items, { label: '', value: '' }] } : s)));
  };
  const updateLibraryItem = (si: number, ji: number, patch: Partial<LibraryItem>) => {
    set('librarySections', librarySections.map((s, i) => (i !== si ? s : {
      ...s,
      items: s.items.map((it, j) => (j === ji ? { ...it, ...patch } : it)),
    })));
  };
  const moveLibraryItem = (si: number, ji: number, dir: -1 | 1) => {
    set('librarySections', librarySections.map((s, i) => {
      if (i !== si) return s;
      const items = [...s.items];
      const target = ji + dir;
      if (target < 0 || target >= items.length) return s;
      [items[ji], items[target]] = [items[target], items[ji]];
      return { ...s, items };
    }));
  };
  const removeLibraryItem = (si: number, ji: number) => {
    set('librarySections', librarySections.map((s, i) => (i === si ? { ...s, items: s.items.filter((_, j) => j !== ji) } : s)));
  };

  // Programme Levels editor (B.Tech / M.Tech) — same add/reorder/remove
  // pattern as the Digital Library sections above.
  const programLevels = form.programLevels || [];
  const addProgramLevel = () => {
    set('programLevels', [...programLevels, { title: `Level ${programLevels.length + 1}`, intro: '', rows: [] }]);
  };
  const updateProgramLevel = (li: number, patch: Partial<ProgramLevel>) => {
    set('programLevels', programLevels.map((l, i) => (i === li ? { ...l, ...patch } : l)));
  };
  const moveProgramLevel = (li: number, dir: -1 | 1) => {
    const next = [...programLevels];
    const target = li + dir;
    if (target < 0 || target >= next.length) return;
    [next[li], next[target]] = [next[target], next[li]];
    set('programLevels', next);
  };
  const removeProgramLevel = (li: number) => {
    set('programLevels', programLevels.filter((_, i) => i !== li));
  };
  const addProgramLevelRow = (li: number) => {
    set('programLevels', programLevels.map((l, i) => (i === li ? { ...l, rows: [...l.rows, { program: '', intake: '' }] } : l)));
  };
  const updateProgramLevelRow = (li: number, ri: number, patch: Partial<ProgramLevelRow>) => {
    set('programLevels', programLevels.map((l, i) => (i !== li ? l : {
      ...l,
      rows: l.rows.map((r, j) => (j === ri ? { ...r, ...patch } : r)),
    })));
  };
  const moveProgramLevelRow = (li: number, ri: number, dir: -1 | 1) => {
    set('programLevels', programLevels.map((l, i) => {
      if (i !== li) return l;
      const rows = [...l.rows];
      const target = ri + dir;
      if (target < 0 || target >= rows.length) return l;
      [rows[ri], rows[target]] = [rows[target], rows[ri]];
      return { ...l, rows };
    }));
  };
  const removeProgramLevelRow = (li: number, ri: number) => {
    set('programLevels', programLevels.map((l, i) => (i === li ? { ...l, rows: l.rows.filter((_, j) => j !== ri) } : l)));
  };

  // Placement Stats editor — a flat list of { label, value } tiles (e.g.
  // "Highest Package" / "₹12 LPA").
  const placementStats = form.placementStats || [];
  const addPlacementStat = () => {
    set('placementStats', [...placementStats, { label: '', value: '' }]);
  };
  const updatePlacementStat = (si: number, patch: Partial<LibraryItem>) => {
    set('placementStats', placementStats.map((s, i) => (i === si ? { ...s, ...patch } : s)));
  };
  const movePlacementStat = (si: number, dir: -1 | 1) => {
    const next = [...placementStats];
    const target = si + dir;
    if (target < 0 || target >= next.length) return;
    [next[si], next[target]] = [next[target], next[si]];
    set('placementStats', next);
  };
  const removePlacementStat = (si: number) => {
    set('placementStats', placementStats.filter((_, i) => i !== si));
  };

  const save = async () => {
    if (!form.title || !form.shortCode) return alert('Title and Short Code are required.');
    setSaving(true);
    try {
      const payload = {
        ...form,
        mission: (form.mission || []).filter(Boolean),
        coreValues: (form.coreValues || []).filter(Boolean),
        labs: (form.labs || []).filter(Boolean),
      };
      if (editing) {
        await updateDoc(doc(db, 'departments', editing), { ...payload });
      } else {
        await addDoc(collection(db, 'departments'), { ...payload, order: form.order || departments.length, createdAt: serverTimestamp() });
      }
      setForm(EMPTY); setEditing(null);
    } catch (e) {
      alert(`Couldn't save: ${(e as Error).message}`);
    } finally { setSaving(false); }
  };

  const startEdit = (d: DepartmentDoc) => {
    setEditing(d.id);
    setForm({
      title: d.title, shortCode: d.shortCode, description: d.description || '',
      icon: d.icon || 'GraduationCap', order: d.order,
      heroImage: d.heroImage || '', storagePath: d.storagePath || '',
      about: d.about || '', established: d.established || '', accreditation: d.accreditation || '',
      hod: d.hod || '', hodImage: d.hodImage || '', hodImageStoragePath: d.hodImageStoragePath || '',
      hodEmail: d.hodEmail || '', hodMessage: d.hodMessage || '',
      vision: d.vision || '', mission: d.mission || [], coreValues: d.coreValues || [], labs: d.labs || [],
      libraryIntro: d.libraryIntro || '', libraryInCharge: d.libraryInCharge || '',
      librarySections: (d.librarySections || []).map((s) => ({ heading: s.heading, items: s.items || [] })),
      programLevels: (d.programLevels || []).map((l) => ({ title: l.title, intro: l.intro || '', rows: l.rows || [] })),
      placementIntro: d.placementIntro || '', placementStats: d.placementStats || [], placementRecruiters: d.placementRecruiters || [],
    });
  };

  const remove = async (id: string) => {
    if (!confirm('Delete this department card?')) return;
    try {
      await deleteDoc(doc(db, 'departments', id));
    } catch (e) {
      alert(`Couldn't delete: ${(e as Error).message}`);
    }
  };

  return (
    <div className="admin-section">
      <div className="admin-card">
        <h2 className="admin-card__title">{editing ? 'Edit Department' : 'Add Department'}</h2>
        <p className="admin-field__hint" style={{ marginBottom: '1rem' }}>
          Controls the cards in the "Academic Departments" grid on the public Academics page — separate from the
          individual B.Tech/M.Tech programs listed above it.
        </p>
        <div className="admin-form-grid">
          <div className="admin-field">
            <label htmlFor="field-title">Title *</label>
            <input id="field-title" value={form.title} onChange={(e) => set('title', e.target.value)} placeholder="Computer Science & Engineering" />
          </div>
          <div className="admin-field">
            <label htmlFor="field-short-code">Short Code *</label>
            <input id="field-short-code" value={form.shortCode} onChange={(e) => set('shortCode', e.target.value)} placeholder="CSE" />
          </div>
          <div className="admin-field">
            <label htmlFor="field-icon">Icon</label>
            <select id="field-icon" value={form.icon} onChange={(e) => set('icon', e.target.value)}>
              {PROGRAM_ICON_NAMES.map((n) => <option key={n} value={n}>{n}</option>)}
            </select>
          </div>
          <div className="admin-field">
            <label htmlFor="field-display-order">Display Order</label>
            <input id="field-display-order" type="number" value={form.order} onChange={(e) => set('order', +e.target.value)} min={0} />
          </div>
          <div className="admin-field admin-field--full">
            <label htmlFor="field-description">Description</label>
            <textarea id="field-description" rows={4} value={form.description} onChange={(e) => set('description', e.target.value)} placeholder="The Department of Computer Science & Engineering, established in…" />
          </div>

          <div className="admin-field admin-field--full"><hr /><h3>Department Page — Shared Content</h3>
            <p className="admin-field__hint" style={{ marginTop: '0.25rem' }}>
              Only used for the grouped departments <strong>AI</strong>, <strong>CSE</strong> and <strong>ECE</strong>,
              whose <code>/academics/&lt;program&gt;</code> pages show this at the top (above the program toggle),
              matched to this card by <strong>Short Code</strong>. Leave blank for every other department.
            </p>
          </div>
          <div className="admin-field admin-field--full">
            <label>Hero Image</label>
            <ImageUploader folder="vwu/departments" currentUrl={form.heroImage} onUploaded={handleHero} label="Upload Hero Image" />
          </div>
          <div className="admin-field">
            <label htmlFor="field-established">Established</label>
            <input id="field-established" value={form.established} onChange={(e) => set('established', e.target.value)} placeholder="2020" />
          </div>
          <div className="admin-field">
            <label htmlFor="field-accreditation">Accreditation</label>
            <input id="field-accreditation" value={form.accreditation} onChange={(e) => set('accreditation', e.target.value)} placeholder="NBA Accredited" />
          </div>
          <div className="admin-field admin-field--full">
            <label htmlFor="field-about">Overview</label>
            <textarea id="field-about" rows={5} value={form.about} onChange={(e) => set('about', e.target.value)} placeholder="About the department…" />
          </div>

          <div className="admin-field admin-field--full"><hr /><h3>Department Page — Programme Levels (B.Tech / M.Tech)</h3>
            <p className="admin-field__hint" style={{ marginTop: '0.25rem' }}>
              Shown right below "About the Department" as headed subsections, each with its own intro paragraph
              and an intake table (e.g. a "B.Tech." block listing each B.Tech programme's intake).
            </p>
          </div>
          <div className="admin-field admin-field--full">
            {programLevels.map((level, li) => (
              <div key={li} style={{ border: '1.5px solid var(--color-light-gray)', borderRadius: 8, padding: '0.75rem', marginBottom: '0.75rem' }}>
                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginBottom: '0.5rem' }}>
                  <input
                    value={level.title}
                    onChange={(e) => updateProgramLevel(li, { title: e.target.value })}
                    placeholder="B.Tech."
                    style={{ flex: 1, fontWeight: 700 }}
                  />
                  <button type="button" className="admin-btn admin-btn--sm" onClick={() => moveProgramLevel(li, -1)} disabled={li === 0} title="Move up">↑</button>
                  <button type="button" className="admin-btn admin-btn--sm" onClick={() => moveProgramLevel(li, 1)} disabled={li === programLevels.length - 1} title="Move down">↓</button>
                  <button type="button" className="admin-btn admin-btn--sm admin-btn--danger" onClick={() => removeProgramLevel(li)}>Remove Level</button>
                </div>
                <textarea
                  rows={3}
                  value={level.intro}
                  onChange={(e) => updateProgramLevel(li, { intro: e.target.value })}
                  placeholder="B.Tech. in Computer Science & Allied courses includes study of…"
                  style={{ width: '100%', marginBottom: '0.5rem' }}
                />
                {level.rows.map((row, ri) => (
                  <div key={ri} style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.4rem' }}>
                    <input
                      value={row.program}
                      onChange={(e) => updateProgramLevelRow(li, ri, { program: e.target.value })}
                      placeholder="Computer Science & Engineering"
                      style={{ flex: 2 }}
                    />
                    <input
                      value={row.intake}
                      onChange={(e) => updateProgramLevelRow(li, ri, { intake: e.target.value })}
                      placeholder="180"
                      style={{ flex: 1 }}
                    />
                    <button type="button" className="admin-btn admin-btn--sm" onClick={() => moveProgramLevelRow(li, ri, -1)} disabled={ri === 0} title="Move up">↑</button>
                    <button type="button" className="admin-btn admin-btn--sm" onClick={() => moveProgramLevelRow(li, ri, 1)} disabled={ri === level.rows.length - 1} title="Move down">↓</button>
                    <button type="button" className="admin-btn admin-btn--sm admin-btn--danger" onClick={() => removeProgramLevelRow(li, ri)}>✕</button>
                  </div>
                ))}
                <button type="button" className="admin-btn admin-btn--sm" onClick={() => addProgramLevelRow(li)}>+ Add Row</button>
              </div>
            ))}
            <button type="button" className="admin-btn admin-btn--primary" onClick={addProgramLevel}>+ Add Level</button>
            {programLevels.length === 0 && (
              <p className="admin-field__hint">No levels yet — click "Add Level" to add a B.Tech./M.Tech. block.</p>
            )}
          </div>

          <div className="admin-field admin-field--full">
            <label htmlFor="field-vision">Vision</label>
            <textarea id="field-vision" rows={3} value={form.vision} onChange={(e) => set('vision', e.target.value)} />
          </div>
          <div className="admin-field admin-field--full">
            <label htmlFor="field-mission">Mission (one per line)</label>
            <textarea id="field-mission" rows={4} value={arrayToLines(form.mission)} onChange={(e) => set('mission', linesToArray(e.target.value))} />
          </div>
          <div className="admin-field admin-field--full">
            <label htmlFor="field-core-values">Core Values (one per line)</label>
            <textarea id="field-core-values" rows={3} value={arrayToLines(form.coreValues)} onChange={(e) => set('coreValues', linesToArray(e.target.value))} />
          </div>
          <div className="admin-field admin-field--full">
            <label htmlFor="field-labs">Laboratories (one per line)</label>
            <textarea id="field-labs" rows={4} value={arrayToLines(form.labs)} onChange={(e) => set('labs', linesToArray(e.target.value))} />
          </div>

          <div className="admin-field admin-field--full"><hr /><h3>Department Page — Placements</h3>
            <p className="admin-field__hint" style={{ marginTop: '0.25rem' }}>
              Shown as a shared "Placements" section, before the program toggle.
            </p>
          </div>
          <div className="admin-field admin-field--full">
            <label htmlFor="field-placement-intro">Placements Overview</label>
            <textarea id="field-placement-intro" rows={3} value={form.placementIntro} onChange={(e) => set('placementIntro', e.target.value)} placeholder="Graduates of the department are placed in leading IT and core engineering companies…" />
          </div>
          <div className="admin-field admin-field--full">
            <label>Placement Stats</label>
            {placementStats.map((stat, si) => (
              <div key={si} style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.4rem' }}>
                <input
                  value={stat.label}
                  onChange={(e) => updatePlacementStat(si, { label: e.target.value })}
                  placeholder="Highest Package"
                  style={{ flex: 2 }}
                />
                <input
                  value={stat.value}
                  onChange={(e) => updatePlacementStat(si, { value: e.target.value })}
                  placeholder="₹12 LPA"
                  style={{ flex: 1 }}
                />
                <button type="button" className="admin-btn admin-btn--sm" onClick={() => movePlacementStat(si, -1)} disabled={si === 0} title="Move up">↑</button>
                <button type="button" className="admin-btn admin-btn--sm" onClick={() => movePlacementStat(si, 1)} disabled={si === placementStats.length - 1} title="Move down">↓</button>
                <button type="button" className="admin-btn admin-btn--sm admin-btn--danger" onClick={() => removePlacementStat(si)}>✕</button>
              </div>
            ))}
            <button type="button" className="admin-btn admin-btn--sm" onClick={addPlacementStat}>+ Add Stat</button>
          </div>
          <div className="admin-field admin-field--full">
            <label htmlFor="field-placement-recruiters">Recruiters (one per line)</label>
            <textarea id="field-placement-recruiters" rows={4} value={arrayToLines(form.placementRecruiters)} onChange={(e) => set('placementRecruiters', linesToArray(e.target.value))} placeholder="TCS&#10;Infosys&#10;Wipro" />
          </div>

          <div className="admin-field admin-field--full"><hr /><h3>Department Page — Digital Library</h3>
            <p className="admin-field__hint" style={{ marginTop: '0.25rem' }}>
              Shown as a shared "Digital Library" section, before the program toggle. Each section below becomes
              its own table on the public page.
            </p>
          </div>
          <div className="admin-field admin-field--full">
            <label htmlFor="field-library-intro">Library Overview</label>
            <textarea id="field-library-intro" rows={3} value={form.libraryIntro} onChange={(e) => set('libraryIntro', e.target.value)} placeholder="The Department Library occupies a unique place in academic and research activities of the Department…" />
          </div>
          <div className="admin-field admin-field--full">
            <label htmlFor="field-library-in-charge">In-charge of Department Library</label>
            <input id="field-library-in-charge" value={form.libraryInCharge} onChange={(e) => set('libraryInCharge', e.target.value)} placeholder="Dr. P. Ravi Kumar, Ph.D. Associate Professor" />
          </div>
          <div className="admin-field admin-field--full">
            {librarySections.map((sec, si) => (
              <div key={si} style={{ border: '1.5px solid var(--color-light-gray)', borderRadius: 8, padding: '0.75rem', marginBottom: '0.75rem' }}>
                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginBottom: '0.5rem' }}>
                  <input
                    value={sec.heading}
                    onChange={(e) => updateLibrarySectionHeading(si, e.target.value)}
                    placeholder="Number of Books"
                    style={{ flex: 1, fontWeight: 700 }}
                  />
                  <button type="button" className="admin-btn admin-btn--sm" onClick={() => moveLibrarySection(si, -1)} disabled={si === 0} title="Move up">↑</button>
                  <button type="button" className="admin-btn admin-btn--sm" onClick={() => moveLibrarySection(si, 1)} disabled={si === librarySections.length - 1} title="Move down">↓</button>
                  <button type="button" className="admin-btn admin-btn--sm admin-btn--danger" onClick={() => removeLibrarySection(si)}>Remove Section</button>
                </div>

                {sec.items.map((item, ji) => (
                  <div key={ji} style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.4rem' }}>
                    <input
                      value={item.label}
                      onChange={(e) => updateLibraryItem(si, ji, { label: e.target.value })}
                      placeholder="Item name"
                      style={{ flex: 2 }}
                    />
                    <input
                      value={item.value}
                      onChange={(e) => updateLibraryItem(si, ji, { value: e.target.value })}
                      placeholder="Count"
                      style={{ flex: 1 }}
                    />
                    <button type="button" className="admin-btn admin-btn--sm" onClick={() => moveLibraryItem(si, ji, -1)} disabled={ji === 0} title="Move up">↑</button>
                    <button type="button" className="admin-btn admin-btn--sm" onClick={() => moveLibraryItem(si, ji, 1)} disabled={ji === sec.items.length - 1} title="Move down">↓</button>
                    <button type="button" className="admin-btn admin-btn--sm admin-btn--danger" onClick={() => removeLibraryItem(si, ji)}>✕</button>
                  </div>
                ))}
                <button type="button" className="admin-btn admin-btn--sm" onClick={() => addLibraryItem(si)}>+ Add Item</button>
              </div>
            ))}
            <button type="button" className="admin-btn admin-btn--primary" onClick={addLibrarySection}>+ Add Section</button>
            {librarySections.length === 0 && (
              <p className="admin-field__hint">No sections yet — click "Add Section" to start building this department's Digital Library.</p>
            )}
          </div>

          <div className="admin-field admin-field--full"><hr /><h3>Department Page — Head of Department</h3></div>
          <div className="admin-field admin-field--full">
            <label>HOD Photo</label>
            <ImageUploader folder="vwu/departments" currentUrl={form.hodImage} onUploaded={handleHodImage} label="Upload HOD Photo" />
          </div>
          <div className="admin-field">
            <label htmlFor="field-hod">HOD Name</label>
            <input id="field-hod" value={form.hod} onChange={(e) => set('hod', e.target.value)} placeholder="Dr. …" />
          </div>
          <div className="admin-field">
            <label htmlFor="field-hod-email">HOD Email</label>
            <input id="field-hod-email" value={form.hodEmail} onChange={(e) => set('hodEmail', e.target.value)} placeholder="hod.cse@vishnu.edu.in" />
          </div>
          <div className="admin-field admin-field--full">
            <label htmlFor="field-hod-message">HOD Message</label>
            <textarea id="field-hod-message" rows={5} value={form.hodMessage} onChange={(e) => set('hodMessage', e.target.value)} />
          </div>
        </div>

        <div className="admin-form-actions">
          {editing && <button className="admin-btn admin-btn--ghost" onClick={() => { setEditing(null); setForm(EMPTY); }}>Cancel</button>}
          <button className="admin-btn admin-btn--primary" onClick={save} disabled={saving}>
            {saving ? 'Saving…' : editing ? 'Update' : 'Add Department'}
          </button>
        </div>
      </div>

      <div className="admin-card">
        <h2 className="admin-card__title">Departments ({departments.length})</h2>
        {loading ? <p className="admin-loading">Loading…</p> : (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead><tr><th>Title</th><th>Short Code</th><th>Order</th><th>Actions</th></tr></thead>
              <tbody>
                {departments.map((d) => (
                  <tr key={d.id}>
                    <td><strong>{d.title}</strong></td>
                    <td><span className="admin-badge" style={{ textTransform: 'none' }}>{d.shortCode}</span></td>
                    <td>{d.order}</td>
                    <td>
                      <button className="admin-btn admin-btn--sm" onClick={() => startEdit(d)}>Edit</button>
                      <button className="admin-btn admin-btn--sm admin-btn--danger" onClick={() => remove(d.id)}>Delete</button>
                    </td>
                  </tr>
                ))}
                {departments.length === 0 && <tr><td colSpan={4} className="admin-empty">No departments yet — add one using the form above.</td></tr>}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
