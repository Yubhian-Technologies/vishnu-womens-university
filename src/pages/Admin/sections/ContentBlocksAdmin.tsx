import { useState, useMemo } from 'react';
import { collection, addDoc, deleteDoc, doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../../lib/firebase';
import { useOrderedCollection } from '../../../hooks/useCollection';
import { CONTENT_ICON_NAMES } from '../../../lib/contentIcons';

// A single flexible content type used across many pages for their small
// repeating text blocks (stat bars, icon+title+desc feature lists, highlight
// cards, simple bullet lists). "value" / "title" / "desc" are deliberately
// generic — each page's own rendering code decides what to do with them for
// a given `section` (e.g. render as a big-number stat, or an icon card).
// page + section together identify exactly one list on one page. "icon" and
// "slug" are optional — only some sections use them (icon for feature-card
// lists, slug for items with an in-page anchor link).
export interface ContentBlockDoc {
  id: string;
  page: string;
  section: string;
  value: string;
  title: string;
  desc: string;
  icon: string;
  slug: string;
  order: number;
}

const EMPTY: Omit<ContentBlockDoc, 'id'> = { page: '', section: '', value: '', title: '', desc: '', icon: '', slug: '', order: 0 };

// Every (page, section) pair currently wired up to read from this
// collection. Add a new entry here first when wiring a new list.
export const CONTENT_BLOCK_SECTIONS: { page: string; section: string; label: string }[] = [
  { page: 'about', section: 'quickStats', label: 'About — Quick Stats' },
  { page: 'about', section: 'academicSnapshotStats', label: 'About — Academic Snapshot Stats' },
  { page: 'about', section: 'differentiators', label: 'About — Differentiators (use Value field for category name)' },
  { page: 'about', section: 'discoverCards', label: 'About — Discover Sub-pages' },
  { page: 'academics', section: 'quickStats', label: 'Academics — Quick Stats' },
  { page: 'academics', section: 'studentActivities', label: 'Academics — Student Activities Nav' },
  { page: 'academics', section: 'careerOutcomeStats', label: 'Academics — Career Outcome Stats' },
  { page: 'campus', section: 'stats', label: 'Campus — Stats Bar' },
  { page: 'information', section: 'ictPlatforms', label: 'Information — ICT Platforms' },
  { page: 'information', section: 'howToReach', label: 'Information — How to Reach' },
  { page: 'information', section: 'counsellingScheme', label: 'Information — Counselling Scheme' },
  { page: 'information', section: 'otherPractices', label: 'Information — Other Practices' },
  { page: 'campus', section: 'facilities', label: 'Campus — Facilities' },
  { page: 'governance', section: 'stats', label: 'Governance — Stats Bar' },
  { page: 'result-analysis', section: 'highlights', label: 'Result Analysis — Highlights' },
  { page: 'result-analysis', section: 'departmentStats', label: 'Result Analysis — Department Stats' },
  { page: 'result-analysis', section: 'factors', label: 'Result Analysis — Success Factors' },
  { page: 'student-clubs', section: 'stats', label: 'Student Clubs — Stats Bar' },
  { page: 'student-life', section: 'clubs', label: 'Student Life — Clubs & Orgs' },
  { page: 'student-life', section: 'housing', label: 'Student Life — Housing' },
  { page: 'student-life', section: 'services', label: 'Student Life — Support Services' },
  { page: 'student-life', section: 'athletics', label: 'Student Life — Athletics/Sports' },
  { page: 'student-life', section: 'diningFeatures', label: 'Student Life — Dining Features' },
  { page: 'news-awards', section: 'highlights', label: 'News & Awards — Highlights' },
  { page: 'about-sves', section: 'stats', label: 'About SVES — Stats' },
  { page: 'about-sves', section: 'milestones', label: 'About SVES — Milestones' },
  { page: 'home', section: 'counters', label: 'Home — Key Statistics (animated counters)' },
  { page: 'home', section: 'recognitions', label: 'Home — Recognitions' },
  { page: 'home', section: 'campusFeatures', label: 'Home — Campus Features' },
  { page: 'home', section: 'testimonials', label: 'Home — Testimonials' },
  { page: 'home', section: 'studyCards', label: 'Home — Study at VWU Cards' },
  { page: 'home', section: 'popularPrograms', label: 'Home — Popular Programs Tags' },
  { page: 'vision-mission', section: 'missionPoints', label: 'Vision & Mission — Mission Points' },
  { page: 'vision-mission', section: 'values', label: 'Vision & Mission — Core Values' },
  { page: 'vision-mission', section: 'qualityPolicy', label: 'Vision & Mission — Quality Policy' },
  { page: 'careers', section: 'perks', label: 'Careers — Perks' },
  { page: 'contact', section: 'infoCards', label: 'Contact — Info Cards (Campus/Email/HQ/Admissions)' },
  { page: 'contact', section: 'socialLinks', label: 'Contact — Social Media Links' },
  { page: 'admissions', section: 'scholarships', label: 'Admissions — Scholarships' },
  { page: 'admissions', section: 'tuitionData', label: 'Admissions — Tuition Summary Table' },
  { page: 'admissions', section: 'steps', label: 'Admissions — How to Apply Steps' },
  { page: 'admissions', section: 'admissionHub', label: 'Admissions — Hub Cards' },
  { page: 'admissions', section: 'visitOptions', label: 'Admissions — Campus Visit Options' },
  { page: 'admission-procedure', section: 'stats', label: 'Admission Procedure — Stats' },
  { page: 'admission-procedure', section: 'btechSteps', label: 'Admission Procedure — B.Tech Steps' },
  { page: 'admission-procedure', section: 'mtechSteps', label: 'Admission Procedure — M.Tech Steps' },
  { page: 'admission-procedure', section: 'mbaSteps', label: 'Admission Procedure — MBA Steps' },
  { page: 'admission-procedure', section: 'documents', label: 'Admission Procedure — Documents Checklist' },
  { page: 'arts-culture', section: 'initiatives', label: 'Arts & Culture — Initiatives' },
  { page: 'arts-culture', section: 'events', label: 'Arts & Culture — Signature Events' },
  { page: 'social-services', section: 'communities', label: 'Social Services — Communities' },
  { page: 'social-services', section: 'values', label: 'Social Services — NSS Values' },
  { page: 'sports-games', section: 'facilities', label: 'Sports & Games — Facilities' },
  { page: 'sports-games', section: 'program', label: 'Sports & Games — Program Highlights' },
  { page: 'sports-games', section: 'achievements', label: 'Sports & Games — Achievements' },
  { page: 'vishnu-tv', section: 'focusAreas', label: 'Vishnu TV — Focus Areas' },
  { page: 'vishnu-tv', section: 'docTopics', label: 'Vishnu TV — Documentary Topics' },
  { page: 'vishnu-tv', section: 'productions', label: 'Vishnu TV — Productions' },
];

export default function ContentBlocksAdmin() {
  const { docs: blocks, loading } = useOrderedCollection<ContentBlockDoc>('contentBlocks', 'order');
  const [form, setForm] = useState<Omit<ContentBlockDoc, 'id'>>({ ...EMPTY, page: CONTENT_BLOCK_SECTIONS[0].page, section: CONTENT_BLOCK_SECTIONS[0].section });
  const [editing, setEditing] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [filterKey, setFilterKey] = useState(`${CONTENT_BLOCK_SECTIONS[0].page}::${CONTENT_BLOCK_SECTIONS[0].section}`);

  const set = (k: string, v: string | number) => setForm((p) => ({ ...p, [k]: v }));
  const filtered = useMemo(() => {
    const [page, section] = filterKey.split('::');
    return blocks.filter((b) => b.page === page && b.section === section);
  }, [blocks, filterKey]);

  const save = async () => {
    if (!form.page || !form.section || !form.title) return alert('Page, section, and title are required.');
    setSaving(true);
    try {
      if (editing) {
        await updateDoc(doc(db, 'contentBlocks', editing), { ...form });
      } else {
        await addDoc(collection(db, 'contentBlocks'), { ...form, order: form.order || filtered.length + 1, createdAt: serverTimestamp() });
      }
      setForm({ ...EMPTY, page: form.page, section: form.section }); setEditing(null);
    } catch (e) {
      alert(`Couldn't save: ${(e as Error).message}`);
    } finally { setSaving(false); }
  };

  const startEdit = (b: ContentBlockDoc) => {
    setEditing(b.id);
    setForm({ page: b.page, section: b.section, value: b.value, title: b.title, desc: b.desc, icon: b.icon || '', slug: b.slug || '', order: b.order });
  };

  const remove = async (id: string) => {
    if (!confirm('Delete this item?')) return;
    try {
      await deleteDoc(doc(db, 'contentBlocks', id));
    } catch (e) {
      alert(`Couldn't delete: ${(e as Error).message}`);
    }
  };

  return (
    <div className="admin-section">
      <div className="admin-card">
        <h2 className="admin-card__title">{editing ? 'Edit Item' : 'Add Item'}</h2>
        <p className="admin-lead" style={{ marginBottom: '1rem' }}>
          Used for small repeating content across many pages — stat bars, feature lists, highlights. Pick which
          page/section this item belongs to; fields not needed for that section (e.g. "Value") can be left blank.
        </p>
        <div className="admin-form-grid">
          <div className="admin-field admin-field--full">
            <label>Page / Section *</label>
            <select value={`${form.page}::${form.section}`} onChange={(e) => {
              const [page, section] = e.target.value.split('::');
              setForm((p) => ({ ...p, page, section }));
            }}>
              {CONTENT_BLOCK_SECTIONS.map((s) => (
                <option key={`${s.page}::${s.section}`} value={`${s.page}::${s.section}`}>{s.label}</option>
              ))}
            </select>
          </div>
          <div className="admin-field">
            <label>Value (number/short value if a stat; a URL for Social Links; a meta line like a phone number for Contact Info Cards)</label>
            <input value={form.value} onChange={(e) => set('value', e.target.value)} placeholder="100 Acres" />
          </div>
          <div className="admin-field">
            <label>Icon (if this section uses icon cards)</label>
            <select value={form.icon} onChange={(e) => set('icon', e.target.value)}>
              <option value="">None</option>
              {CONTENT_ICON_NAMES.map((n) => <option key={n} value={n}>{n}</option>)}
            </select>
          </div>
          <div className="admin-field">
            <label>Anchor Slug / Extra field (only if this item needs a #link — or the avatar URL for Home Testimonials, a second meta line for Contact Info Cards, or the click-through link for Student Life Clubs — an external https:// URL or an internal /path)</label>
            <input value={form.slug} onChange={(e) => set('slug', e.target.value)} placeholder="smart-classrooms" />
          </div>
          <div className="admin-field">
            <label>Display Order</label>
            <input type="number" value={form.order} onChange={(e) => set('order', +e.target.value)} min={0} />
          </div>
          <div className="admin-field admin-field--full">
            <label>Title *</label>
            <input value={form.title} onChange={(e) => set('title', e.target.value)} placeholder="Campus Area" />
          </div>
          <div className="admin-field admin-field--full">
            <label>Description (if this item needs one — for Contact Info Cards, put each address line on its own line)</label>
            <textarea rows={3} value={form.desc} onChange={(e) => set('desc', e.target.value)} placeholder="Optional longer text…" />
          </div>
        </div>
        <div className="admin-form-actions">
          {editing && <button className="admin-btn admin-btn--ghost" onClick={() => { setEditing(null); setForm({ ...EMPTY, page: form.page, section: form.section }); }}>Cancel</button>}
          <button className="admin-btn admin-btn--primary" onClick={save} disabled={saving}>{saving ? 'Saving…' : editing ? 'Update' : 'Add Item'}</button>
        </div>
      </div>

      <div className="admin-card">
        <div className="admin-card__toolbar">
          <h2 className="admin-card__title">Items ({filtered.length})</h2>
          <select value={filterKey} onChange={(e) => setFilterKey(e.target.value)} className="admin-select-sm">
            {CONTENT_BLOCK_SECTIONS.map((s) => (
              <option key={`${s.page}::${s.section}`} value={`${s.page}::${s.section}`}>{s.label}</option>
            ))}
          </select>
        </div>
        {loading ? <p className="admin-loading">Loading…</p> : (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead><tr><th>Order</th><th>Value</th><th>Title</th><th>Actions</th></tr></thead>
              <tbody>
                {filtered.map((b) => (
                  <tr key={b.id}>
                    <td>{b.order}</td>
                    <td>{b.value || '—'}</td>
                    <td>{b.title}</td>
                    <td>
                      <button className="admin-btn admin-btn--sm" onClick={() => startEdit(b)}>Edit</button>
                      <button className="admin-btn admin-btn--sm admin-btn--danger" onClick={() => remove(b.id)}>Delete</button>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && <tr><td colSpan={4} className="admin-empty">No items for this section yet.</td></tr>}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
