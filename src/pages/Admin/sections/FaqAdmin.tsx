import { useState } from 'react';
import { collection, addDoc, deleteDoc, doc, updateDoc, serverTimestamp } from 'firebase/firestore';
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

  const set = (k: string, v: string | number) => setForm((p) => ({ ...p, [k]: v }));
  const filtered = faqs.filter((f) => f.page === filterPage);

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
