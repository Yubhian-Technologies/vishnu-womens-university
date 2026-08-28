import { useMemo, useState } from 'react';
import {
  collection, addDoc, deleteDoc, doc, updateDoc, serverTimestamp,
} from 'firebase/firestore';
import { db } from '../../../lib/firebase';
import { useOrderedCollection } from '../../../hooks/useCollection';
import ImageUploader from '../../../components/ImageUploader/ImageUploader';
import type { UploadResult } from '../../../lib/storage';
import {
  type FacultyFact, type FacultySection,
  factsToText, textToFacts, sectionsToText, textToSections, getSectionBlocks,
} from '../../../lib/facultySections';
import type { ProgramDoc } from './ProgramsAdmin';

export type { FacultyFact, FacultySection };

export interface FacultyDoc {
  id: string;
  name: string;
  designation: string;
  department: string;
  qualification: string;
  specialization: string;
  email: string;
  imageUrl: string;
  storagePath: string;
  order: number;
  /** Optional richer profile — shown on that person's own full profile
   *  page (FacultyProfile.tsx) below the basic card fields above. Free-
   *  form because different people (and different departments — a CSE
   *  professor's profile looks nothing like a Mathematics HOD's) need
   *  different sections; a fixed schema can't cover that. Both are
   *  optional so existing simple faculty records (just name/designation/
   *  qualification/photo) keep working unchanged. */
  facts?: FacultyFact[];
  sections?: FacultySection[];
}

const EMPTY: Omit<FacultyDoc, 'id'> = {
  name: '', designation: 'Assistant Professor', department: 'CSE',
  qualification: '', specialization: '', email: '', imageUrl: '', storagePath: '', order: 0,
  facts: [], sections: [],
};

const DESIGNATIONS = ['Professor & HOD', 'Professor & Head', 'Professor', 'Associate Professor', 'Assoc. Professor', 'Assistant Professor', 'Asst. Professor'];

// First-year foundation subjects (Freshman Engineering page) have no
// Program entry of their own — always offered here regardless of Program
// or current-faculty data. Keep in sync with Faculty.tsx's matching set.
const FOUNDATION_DEPARTMENTS = ['Mathematics', 'Physics', 'Chemistry', 'English'];

interface FormState extends Omit<FacultyDoc, 'id' | 'facts' | 'sections'> {
  factsText: string;
  sectionsText: string;
}

const EMPTY_FORM: FormState = { ...EMPTY, factsText: '', sectionsText: '' };

export default function FacultyAdmin() {
  const { docs: faculty, loading } = useOrderedCollection<FacultyDoc>('faculty', 'order');
  // Departments aren't a separate managed list — this is the union of every
  // Program's `department` field (/admin → Programs), every department
  // that already has faculty tagged to it, and the fixed set of first-year
  // foundation subjects (which have no Program of their own, so without
  // this they'd vanish from the picker the moment their last faculty
  // member was removed, making it impossible to add a replacement). A
  // Program's department pointing elsewhere (e.g. a shared HOD across two
  // programs) can never make an existing faculty department disappear.
  const { docs: programs } = useOrderedCollection<ProgramDoc>('programs', 'order');
  const departmentNames = useMemo(() => {
    const seen = new Set<string>();
    const names: string[] = [];
    const add = (d: string) => { if (d && !seen.has(d)) { seen.add(d); names.push(d); } };
    programs.forEach((p) => add(p.department));
    faculty.forEach((f) => add(f.department));
    FOUNDATION_DEPARTMENTS.forEach(add);
    return names;
  }, [programs, faculty]);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [editing, setEditing] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [filterDept, setFilterDept] = useState('All');

  const [bulkDept, setBulkDept] = useState('CSE');
  const [bulkText, setBulkText] = useState('');
  const [bulkImporting, setBulkImporting] = useState(false);

  const [importing, setImporting] = useState(false);
  const [importResult, setImportResult] = useState<string | null>(null);

  const set = (k: keyof FormState, v: string | number) => setForm((p) => ({ ...p, [k]: v }));
  const handleImage = (r: UploadResult) => setForm((p) => ({ ...p, imageUrl: r.url, storagePath: r.path }));

  // Pastes a whole roster at once — "Name | Designation | Qualification | Specialization | Email"
  // per line (trailing fields optional) — instead of one add-doc round trip per person.
  const bulkImport = async () => {
    const rows = bulkText.split('\n').map((l) => l.trim()).filter(Boolean);
    if (rows.length === 0) return;
    setBulkImporting(true);
    try {
      let order = faculty.filter((f) => f.department === bulkDept).length;
      for (const row of rows) {
        const [name, designation, qualification, specialization, email] = row.split('|').map((s) => (s || '').trim());
        if (!name) continue;
        await addDoc(collection(db, 'faculty'), {
          name,
          designation: designation || 'Assistant Professor',
          department: bulkDept,
          qualification: qualification || '',
          specialization: specialization || '',
          email: email || '',
          imageUrl: '', storagePath: '',
          facts: [], sections: [],
          order: order++,
          createdAt: serverTimestamp(),
        });
      }
      setBulkText('');
    } catch (e) {
      alert(`Couldn't import: ${(e as Error).message}`);
    } finally { setBulkImporting(false); }
  };

  // Bulk-loads Profile Sections content for many existing faculty members at
  // once from a JSON file ([{ name, department, sectionsText }]) — matches
  // each entry to an existing record by name+department (case-insensitive)
  // and fills in just its `sections` field, leaving everything else on that
  // record untouched. Entries with no matching record are reported, not
  // created — a base record (name/department/photo) has to exist first.
  const importFile = async (file: File) => {
    setImporting(true);
    setImportResult(null);
    try {
      const text = await file.text();
      const entries: { name: string; department: string; sectionsText: string }[] = JSON.parse(text);
      let updated = 0;
      const unmatched: string[] = [];
      for (const entry of entries) {
        const match = faculty.find(
          (f) => f.name.trim().toLowerCase() === entry.name.trim().toLowerCase()
            && f.department.trim().toLowerCase() === entry.department.trim().toLowerCase()
        );
        if (!match) { unmatched.push(`${entry.name} (${entry.department})`); continue; }
        await updateDoc(doc(db, 'faculty', match.id), { sections: textToSections(entry.sectionsText) });
        updated++;
      }
      setImportResult(
        `Updated ${updated} of ${entries.length} record${entries.length === 1 ? '' : 's'}.`
        + (unmatched.length ? ` No matching faculty record for ${unmatched.length}: ${unmatched.join('; ')}` : '')
      );
    } catch (e) {
      setImportResult(`Couldn't import: ${(e as Error).message}`);
    } finally { setImporting(false); }
  };

  const save = async () => {
    if (!form.name) return alert('Name is required.');
    setSaving(true);
    try {
      const payload = {
        name: form.name, designation: form.designation, department: form.department,
        qualification: form.qualification, specialization: form.specialization,
        email: form.email, imageUrl: form.imageUrl, storagePath: form.storagePath, order: form.order,
        facts: textToFacts(form.factsText),
        sections: textToSections(form.sectionsText),
      };
      if (editing) {
        await updateDoc(doc(db, 'faculty', editing), payload);
      } else {
        await addDoc(collection(db, 'faculty'), { ...payload, createdAt: serverTimestamp() });
      }
      setForm(EMPTY_FORM); setEditing(null);
    } catch (e) {
      alert(`Couldn't save: ${(e as Error).message}`);
    } finally { setSaving(false); }
  };

  const startEdit = (f: FacultyDoc) => {
    setEditing(f.id);
    setForm({
      name: f.name, designation: f.designation, department: f.department,
      qualification: f.qualification, specialization: f.specialization,
      email: f.email, imageUrl: f.imageUrl, storagePath: f.storagePath, order: f.order,
      factsText: factsToText(f.facts), sectionsText: sectionsToText(f.sections),
    });
  };

  const remove = async (id: string) => {
    if (!confirm('Remove this faculty member?')) return;
    try {
      await deleteDoc(doc(db, 'faculty', id));
    } catch (e) {
      alert(`Couldn't delete: ${(e as Error).message}`);
    }
  };

  const filtered = filterDept === 'All' ? faculty : faculty.filter((f) => f.department === filterDept);

  return (
    <div className="admin-section">
      <div className="admin-card">
        <h2 className="admin-card__title">Import Faculty Profile Content</h2>
        <p className="admin-lead" style={{ marginBottom: '1rem' }}>
          Loads Profile Sections content for many existing faculty members at once from a JSON file
          (an array of <code>{'{ name, department, sectionsText }'}</code>). Each entry is matched to an
          existing record by name + department and only its Profile Sections field is filled in — nothing
          is created, and nothing else on the record is touched. Entries with no matching record are
          listed afterward so a base record can be added for them first.
        </p>
        <div className="admin-form-actions">
          <input
            type="file"
            accept="application/json"
            disabled={importing}
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) importFile(file);
              e.target.value = '';
            }}
          />
        </div>
        {importing && <p className="admin-loading">Importing…</p>}
        {importResult && <p className="admin-field__hint">{importResult}</p>}
      </div>

      <div className="admin-card">
        <h2 className="admin-card__title">Bulk Import Faculty</h2>
        <div className="admin-form-grid">
          <div className="admin-field">
            <label>Department</label>
            <select value={bulkDept} onChange={(e) => setBulkDept(e.target.value)}>
              {departmentNames.map((d) => <option key={d}>{d}</option>)}
            </select>
          </div>
          <div className="admin-field admin-field--full">
            <label>Paste one faculty member per line: "Name | Designation | Qualification | Specialization | Email" (last three optional)</label>
            <textarea
              rows={8}
              value={bulkText}
              onChange={(e) => setBulkText(e.target.value)}
              placeholder={'Dr. Pokkuluri Kiran Sree | Professor & HOD | Ph.D.\nDr. V. Purushothama Raju | Professor | Ph.D.\nMr. Y. Ramu | Associate Professor | M.Tech.(Ph.D.)'}
            />
          </div>
        </div>
        <div className="admin-form-actions">
          <button className="admin-btn admin-btn--primary" onClick={bulkImport} disabled={bulkImporting || !bulkText.trim()}>
            {bulkImporting ? 'Importing…' : `Import ${bulkText.split('\n').filter((l) => l.trim()).length || ''} Faculty`}
          </button>
        </div>
      </div>

      <div className="admin-card">
        <h2 className="admin-card__title">{editing ? 'Edit Faculty' : 'Add Faculty Member'}</h2>
        <div className="admin-form-grid">
          <div className="admin-field" style={{ gridColumn: '1 / -1', maxWidth: 200 }}>
            <label>Photo</label>
            <ImageUploader folder="vwu/faculty" currentUrl={form.imageUrl} onUploaded={handleImage} label="Upload Photo" />
          </div>
          <div className="admin-field">
            <label>Full Name *</label>
            <input value={form.name} onChange={(e) => set('name', e.target.value)} placeholder="Dr. Name" />
          </div>
          <div className="admin-field">
            <label>Designation</label>
            <select value={form.designation} onChange={(e) => set('designation', e.target.value)}>
              {DESIGNATIONS.map((d) => <option key={d}>{d}</option>)}
            </select>
          </div>
          <div className="admin-field">
            <label>Department</label>
            <select value={form.department} onChange={(e) => set('department', e.target.value)}>
              {departmentNames.map((d) => <option key={d}>{d}</option>)}
            </select>
          </div>
          <div className="admin-field">
            <label>Qualification</label>
            <input value={form.qualification} onChange={(e) => set('qualification', e.target.value)} placeholder="Ph.D., M.Tech" />
          </div>
          <div className="admin-field">
            <label>Specialization</label>
            <input value={form.specialization} onChange={(e) => set('specialization', e.target.value)} placeholder="Machine Learning" />
          </div>
          <div className="admin-field">
            <label>Email</label>
            <input type="email" value={form.email} onChange={(e) => set('email', e.target.value)} placeholder="faculty@svecw.edu.in" />
          </div>
          <div className="admin-field admin-field--full">
            <label>Profile Facts</label>
            <p className="admin-field__hint">
              Optional. One per line, as "Label | Value" — shown at the top of this person's full profile page.
              e.g. Ph.D, Teaching Experience, Employee ID, Contact Number, Website.
            </p>
            <textarea rows={5} value={form.factsText} onChange={(e) => set('factsText', e.target.value)} placeholder={'Ph.D | Andhra University, 1994\nTeaching Experience | 34 years\nContact Number | 9440240530'} />
          </div>
          <div className="admin-field admin-field--full">
            <label>Profile Sections</label>
            <p className="admin-field__hint">
              Optional. Give each section a title on its own line as "## Section Title" (e.g. Professional
              Affiliations, Research Papers Published, Awards &amp; Recognitions — every person can have a different
              set), then write the content underneath in whatever mix you need: plain paragraphs, bullet points
              (start the line with "- "), and tables (start with a line "TABLE:", then one row per line as
              "Column | Column | Column", the first row being the headers). A pasted URL becomes a clickable link
              automatically. Leave a section's title with nothing underneath to show it as "coming soon" for now.
            </p>
            <textarea
              rows={14}
              value={form.sectionsText}
              onChange={(e) => set('sectionsText', e.target.value)}
              placeholder={[
                '## Professional Affiliations',
                'Life member of "The Indian Society for Technical Education (ISTE)", with LM-53969 in 2007.',
                '',
                '## Research Papers Published',
                'TABLE:',
                'Title | Journal | Year',
                'Deep Learning for X | IEEE Access | 2023',
                'A Study on Y | Springer | 2022',
                '',
                '## Awards & Recognitions',
                '- Best Faculty Award, 2022',
                '- Outstanding Reviewer, IEEE, 2021',
              ].join('\n')}
            />
          </div>
        </div>
        <div className="admin-form-actions">
          {editing && <button className="admin-btn admin-btn--ghost" onClick={() => { setEditing(null); setForm(EMPTY_FORM); }}>Cancel</button>}
          <button className="admin-btn admin-btn--primary" onClick={save} disabled={saving}>
            {saving ? 'Saving…' : editing ? 'Update' : 'Add Faculty'}
          </button>
        </div>
      </div>

      <div className="admin-card">
        <div className="admin-card__toolbar">
          <h2 className="admin-card__title">Faculty ({filtered.length})</h2>
          <select value={filterDept} onChange={(e) => setFilterDept(e.target.value)} className="admin-select-sm">
            <option value="All">All Departments</option>
            {departmentNames.map((d) => <option key={d}>{d}</option>)}
          </select>
        </div>
        {loading ? <p className="admin-loading">Loading…</p> : (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead><tr><th>Photo</th><th>Name</th><th>Designation</th><th>Department</th><th>Qualification</th><th>Profile</th><th>Actions</th></tr></thead>
              <tbody>
                {filtered.map((f) => (
                  <tr key={f.id}>
                    <td>{f.imageUrl ? <img src={f.imageUrl} alt="" className="admin-table__avatar" /> : '👤'}</td>
                    <td>{f.name}</td>
                    <td><span className="admin-badge admin-badge--sm">{f.designation}</span></td>
                    <td>{f.department}</td>
                    <td>{f.qualification}</td>
                    <td>{(f.sections?.length ?? 0) > 0 ? `${f.sections!.filter((s) => getSectionBlocks(s).length > 0).length}/${f.sections!.length} sections` : '—'}</td>
                    <td>
                      <button className="admin-btn admin-btn--sm" onClick={() => startEdit(f)}>Edit</button>
                      <button className="admin-btn admin-btn--sm admin-btn--danger" onClick={() => remove(f.id)}>Delete</button>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && <tr><td colSpan={7} className="admin-empty">No faculty records.</td></tr>}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
