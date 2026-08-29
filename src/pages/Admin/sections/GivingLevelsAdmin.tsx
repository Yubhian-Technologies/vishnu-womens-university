import { useState } from 'react';
import {
  collection, addDoc, deleteDoc, doc, updateDoc, serverTimestamp,
} from 'firebase/firestore';
import { db } from '../../../lib/firebase';
import { useOrderedCollection } from '../../../hooks/useCollection';

interface GivingLevel {
  id: string;
  level: string;
  amount: string;
  perksText: string; // one perk per line, joined/split for editing
  featured: boolean;
  order: number;
}

const EMPTY: Omit<GivingLevel, 'id'> = { level: '', amount: '', perksText: '', featured: false, order: 0 };

const DEFAULTS: Omit<GivingLevel, 'id'>[] = [
  { level: 'Vishnu Patron Circle', amount: '₹5,00,000+/year', perksText: "Named scholarship opportunity\nInvitation to exclusive alumni events\nAnnual Principal's dinner\nRecognition in Prathibha magazine", featured: true, order: 0 },
  { level: 'Gold Alumni Society', amount: '₹1,00,000–₹4,99,999', perksText: 'Named award opportunity\nPriority access to alumni events\nQuarterly campus newsletter\nRecognition in annual report', featured: false, order: 1 },
  { level: 'Silver Alumni Club', amount: '₹25,000–₹99,999', perksText: 'Annual giving recognition\nInvitation to Graduation Day\nPrathibha Alumni magazine\nTax-exempt donation receipt', featured: false, order: 2 },
  { level: 'Vishnu Alumni Fund', amount: 'Any amount', perksText: 'Direct student scholarship impact\nAcknowledgment of your gift\nAnnual impact report\nVWU alumni community access', featured: false, order: 3 },
];

export default function GivingLevelsAdmin() {
  const { docs: items, loading } = useOrderedCollection<GivingLevel>('givingLevels', 'order');
  const [form, setForm] = useState<Omit<GivingLevel, 'id'>>(EMPTY);
  const [editing, setEditing] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const set = (k: string, v: string | number | boolean) => setForm((p) => ({ ...p, [k]: v }));

  const save = async () => {
    if (!form.level || !form.amount) return alert('Level name and amount are required.');
    setSaving(true);
    try {
      if (editing) {
        await updateDoc(doc(db, 'givingLevels', editing), { ...form });
      } else {
        await addDoc(collection(db, 'givingLevels'), { ...form, createdAt: serverTimestamp() });
      }
      setForm(EMPTY); setEditing(null);
    } catch (e) {
      alert(`Couldn't save: ${(e as Error).message}`);
    } finally {
      setSaving(false);
    }
  };

  const startEdit = (l: GivingLevel) => {
    setEditing(l.id);
    setForm({ level: l.level, amount: l.amount, perksText: l.perksText, featured: l.featured, order: l.order });
  };

  const remove = async (id: string) => {
    if (!confirm('Delete this giving level?')) return;
    try {
      await deleteDoc(doc(db, 'givingLevels', id));
    } catch (e) {
      alert(`Couldn't delete: ${(e as Error).message}`);
    }
  };

  const seedDefaults = async () => {
    if (!confirm('Add the original set of giving levels as a starting point?')) return;
    try {
      for (const d of DEFAULTS) {
        await addDoc(collection(db, 'givingLevels'), { ...d, createdAt: serverTimestamp() });
      }
    } catch (e) {
      alert(`Couldn't add starter levels: ${(e as Error).message}`);
    }
  };

  return (
    <div className="admin-section">
      <div className="admin-card">
        <h2 className="admin-card__title">{editing ? 'Edit Giving Level' : 'Add Giving Level'}</h2>
        <div className="admin-form-grid">
          <div className="admin-field">
            <label htmlFor="field-level-name">Level Name *</label>
            <input id="field-level-name" value={form.level} onChange={(e) => set('level', e.target.value)} placeholder="Gold Alumni Society" />
          </div>
          <div className="admin-field">
            <label htmlFor="field-amount">Amount *</label>
            <input id="field-amount" value={form.amount} onChange={(e) => set('amount', e.target.value)} placeholder="₹1,00,000–₹4,99,999" />
          </div>
          <div className="admin-field">
            <label htmlFor="field-display-order">Display Order</label>
            <input id="field-display-order" type="number" value={form.order} onChange={(e) => set('order', +e.target.value)} min={0} />
          </div>
          <div className="admin-field">
            <label>Featured (shown as "Most Prestigious")</label>
            <label className="admin-toggle">
              <input type="checkbox" checked={form.featured} onChange={(e) => set('featured', e.target.checked)} />
              <span>Highlight this tier</span>
            </label>
          </div>
          <div className="admin-field admin-field--full">
            <label htmlFor="field-perks-one-per-line">Perks (one per line)</label>
            <textarea id="field-perks-one-per-line" rows={5} value={form.perksText} onChange={(e) => set('perksText', e.target.value)}
              placeholder={'Named scholarship opportunity\nInvitation to exclusive alumni events\nAnnual Principal\'s dinner'} />
          </div>
        </div>
        <div className="admin-form-actions">
          {editing && <button className="admin-btn admin-btn--ghost" onClick={() => { setEditing(null); setForm(EMPTY); }}>Cancel</button>}
          <button className="admin-btn admin-btn--primary" onClick={save} disabled={saving}>
            {saving ? 'Saving…' : editing ? 'Update' : 'Add Level'}
          </button>
        </div>
      </div>

      <div className="admin-card">
        <h2 className="admin-card__title">All Giving Levels ({items.length})</h2>
        {loading ? <p className="admin-loading">Loading…</p> : (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead><tr><th>Level</th><th>Amount</th><th>Perks</th><th>Featured</th><th>Actions</th></tr></thead>
              <tbody>
                {items.map((l) => (
                  <tr key={l.id}>
                    <td>{l.level}</td>
                    <td>{l.amount}</td>
                    <td>{l.perksText.split('\n').filter(Boolean).length} perks</td>
                    <td>{l.featured ? '✅' : '—'}</td>
                    <td>
                      <button className="admin-btn admin-btn--sm" onClick={() => startEdit(l)}>Edit</button>
                      <button className="admin-btn admin-btn--sm admin-btn--danger" onClick={() => remove(l.id)}>Delete</button>
                    </td>
                  </tr>
                ))}
                {items.length === 0 && (
                  <tr>
                    <td colSpan={5} className="admin-empty">
                      No giving levels yet.{' '}
                      <button className="admin-btn admin-btn--sm" onClick={seedDefaults}>Add starter levels</button>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
