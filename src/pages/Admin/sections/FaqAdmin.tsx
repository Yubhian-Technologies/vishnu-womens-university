import { useState, type ChangeEvent } from 'react';
import { collection, addDoc, deleteDoc, doc, updateDoc, serverTimestamp, writeBatch } from 'firebase/firestore';
import { db } from '../../../lib/firebase';
import { useOrderedCollection } from '../../../hooks/useCollection';

export interface FaqDoc {
  id: string;
  page: string;
  question: string;
  answer: string;
  order: number;
}

const EMPTY: Omit<FaqDoc, 'id'> = { page: 'admissions', question: '', answer: '', order: 0 };

// Pages that currently render an FAQ accordion. Add here first when wiring
// up a new page's FAQ section.
const PAGES = [
  { value: 'admissions', label: 'Admissions' },
];

export default function FaqAdmin() {
  const { docs: faqs, loading } = useOrderedCollection<FaqDoc>('faqs', 'order');
  const [form, setForm] = useState<Omit<FaqDoc, 'id'>>(EMPTY);
  const [editing, setEditing] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [filterPage, setFilterPage] = useState('admissions');
  const [importText, setImportText] = useState('');
  const [importing, setImporting] = useState(false);

  const set = (k: string, v: string | number) => setForm((p) => ({ ...p, [k]: v }));
  const filtered = faqs.filter((f) => f.page === filterPage);

  const exportJson = () => {
    const data = faqs.map(({ id, page, question, answer, order }) => ({ id, page, question, answer, order }));
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'faqs.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  const loadFile = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) file.text().then(setImportText);
    e.target.value = '';
  };

  const importJson = async () => {
    let parsed: unknown;
    try {
      parsed = JSON.parse(importText);
    } catch {
      return alert('That is not valid JSON.');
    }
    if (!Array.isArray(parsed)) return alert('Expected a JSON array of FAQ objects.');
    const rows = parsed as Array<Partial<FaqDoc>>;
    const bad = rows.findIndex((r) => !r || typeof r.question !== 'string' || typeof r.answer !== 'string');
    if (bad !== -1) return alert(`Entry ${bad + 1} is missing a "question" or "answer" string.`);
    // ponytail: single writeBatch caps at 500 rows; FAQs won't approach that.
    if (!confirm(`Import ${rows.length} FAQ(s)? Rows with an existing "id" overwrite that entry; the rest are added. Nothing is deleted.`)) return;
    setImporting(true);
    try {
      const batch = writeBatch(db);
      rows.forEach((r, i) => {
        const ref = r.id ? doc(db, 'faqs', r.id) : doc(collection(db, 'faqs'));
        batch.set(ref, {
          page: r.page || filterPage,
          question: r.question,
          answer: r.answer,
          order: typeof r.order === 'number' ? r.order : i + 1,
          createdAt: serverTimestamp(),
        });
      });
      await batch.commit();
      setImportText('');
      alert('Import complete.');
    } catch (e) {
      alert(`Import failed: ${(e as Error).message}`);
    } finally {
      setImporting(false);
    }
  };

  const save = async () => {
    if (!form.question || !form.answer) return alert('Question and answer are required.');
    setSaving(true);
    try {
      if (editing) {
        await updateDoc(doc(db, 'faqs', editing), { ...form });
      } else {
        await addDoc(collection(db, 'faqs'), { ...form, order: form.order || filtered.length + 1, createdAt: serverTimestamp() });
      }
      setForm({ ...EMPTY, page: form.page }); setEditing(null);
    } catch (e) {
      alert(`Couldn't save: ${(e as Error).message}`);
    } finally { setSaving(false); }
  };

  const startEdit = (f: FaqDoc) => { setEditing(f.id); setForm({ page: f.page, question: f.question, answer: f.answer, order: f.order }); };

  const remove = async (id: string) => {
    if (!confirm('Delete this FAQ?')) return;
    try {
      await deleteDoc(doc(db, 'faqs', id));
    } catch (e) {
      alert(`Couldn't delete: ${(e as Error).message}`);
    }
  };

  return (
    <div className="admin-section">
      <div className="admin-card">
        <h2 className="admin-card__title">{editing ? 'Edit FAQ' : 'Add FAQ'}</h2>
        <div className="admin-form-grid">
          <div className="admin-field">
            <label htmlFor="field-page">Page</label>
            <select id="field-page" value={form.page} onChange={(e) => set('page', e.target.value)}>
              {PAGES.map((p) => <option key={p.value} value={p.value}>{p.label}</option>)}
            </select>
          </div>
          <div className="admin-field">
            <label htmlFor="field-display-order">Display Order</label>
            <input id="field-display-order" type="number" value={form.order} onChange={(e) => set('order', +e.target.value)} min={0} />
          </div>
          <div className="admin-field admin-field--full">
            <label htmlFor="field-question">Question *</label>
            <input id="field-question" value={form.question} onChange={(e) => set('question', e.target.value)} placeholder="What is the VWU college code for EAPCET?" />
          </div>
          <div className="admin-field admin-field--full">
            <label htmlFor="field-answer">Answer *</label>
            <textarea id="field-answer" rows={3} value={form.answer} onChange={(e) => set('answer', e.target.value)} placeholder="The college code for VWU in AP EAPCET is VISW…" />
          </div>
        </div>
        <div className="admin-form-actions">
          {editing && <button className="admin-btn admin-btn--ghost" onClick={() => { setEditing(null); setForm(EMPTY); }}>Cancel</button>}
          <button className="admin-btn admin-btn--primary" onClick={save} disabled={saving}>{saving ? 'Saving…' : editing ? 'Update' : 'Add FAQ'}</button>
        </div>
      </div>

      <div className="admin-card">
        <h2 className="admin-card__title">Bulk Import / Export (JSON)</h2>
        <div className="admin-form-grid">
          <div className="admin-field admin-field--full">
            <label>Export</label>
            <button className="admin-btn admin-btn--ghost" type="button" onClick={exportJson}>
              Download all FAQs as JSON ({faqs.length})
            </button>
          </div>
          <div className="admin-field admin-field--full">
            <label htmlFor="field-faq-import">Import — paste a JSON array, or choose a file</label>
            <input id="field-faq-import-file" type="file" accept="application/json,.json" onChange={loadFile} />
            <textarea
              id="field-faq-import"
              rows={6}
              value={importText}
              onChange={(e) => setImportText(e.target.value)}
              placeholder={'[{ "page": "admissions", "question": "…", "answer": "…", "order": 1 }]'}
            />
          </div>
        </div>
        <div className="admin-form-actions">
          <button className="admin-btn admin-btn--primary" type="button" onClick={importJson} disabled={importing || !importText.trim()}>
            {importing ? 'Importing…' : 'Import'}
          </button>
        </div>
      </div>

      <div className="admin-card">
        <div className="admin-card__toolbar">
          <h2 className="admin-card__title">FAQs ({filtered.length})</h2>
          <select value={filterPage} onChange={(e) => setFilterPage(e.target.value)} className="admin-select-sm">
            {PAGES.map((p) => <option key={p.value} value={p.value}>{p.label}</option>)}
          </select>
        </div>
        {loading ? <p className="admin-loading">Loading…</p> : (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead><tr><th>Order</th><th>Question</th><th>Actions</th></tr></thead>
              <tbody>
                {filtered.map((f) => (
                  <tr key={f.id}>
                    <td>{f.order}</td>
                    <td>{f.question}</td>
                    <td>
                      <button className="admin-btn admin-btn--sm" onClick={() => startEdit(f)}>Edit</button>
                      <button className="admin-btn admin-btn--sm admin-btn--danger" onClick={() => remove(f.id)}>Delete</button>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && <tr><td colSpan={3} className="admin-empty">No FAQs for this page yet.</td></tr>}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
