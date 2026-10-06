import { useState } from 'react';
import { collection, doc, serverTimestamp } from 'firebase/firestore';
import { addDoc, deleteDoc, updateDoc } from '../../../lib/auditLog';
import { db } from '../../../lib/firebase';
import { useOrderedCollection } from '../../../hooks/useCollection';

export interface IloOfficeDetailDoc {
  id: string;
  officeName: string;
  address: string[];
  bullets: string[];
  order: number;
}

const EMPTY: Omit<IloOfficeDetailDoc, 'id'> = { officeName: '', address: [], bullets: [], order: 0 };

// Mirrors industryLiaisonOffices.data.ts -- shown as the fallback (matched
// by office name) until an admin adds real entries here.
export const DEFAULT_ILO_OFFICE_DETAILS: Omit<IloOfficeDetailDoc, 'id'>[] = [
  {
    officeName: 'Chennai',
    address: ['Sri Vishnu Educational Society,', 'Thapar House, Ground Floor,', '37, Monteith Road, Egmore,', 'Chennai- 600008.'],
    bullets: [
      'Our ILO Office in Chennai closely work with core manufacturing companies like Caterpillar, Mahindra & Mahindra, Renault Nissan, Ashok Leyland, Hyundai, Brakes India Ltd (R&D), Robert Bosch, Rane, Kone Elevator, Siemens, Nokia Solutions & Networks Pvt Ltd and Schwing Stetter for Placement, Internship & Industrial Visit.',
      "We have 400 Alumni working in Chennai. Our ILO take care of Facilitation, Finding accommodation for new joining students in Chennai, Every year we organize event to gather alumni's. Helping to find new job for experienced alumni. Our strong alumni base makes new students to feel comfort & our ILO help to solve all their problems.",
      'To further strengthen the knowledge of our mechanical students in Automobile Engineering, Chennai core companies BMW sponsored Engines and Ford sponsored vehicles (Ford Eco Sport & Ford Figo), students get hands-on training on advanced technologies of Engines and Transmissions.',
      'We motivate students to participate in National level competitions like Caterpillar Tech Challenge, Hero Motor campus challenge, IIT Madras E-summit, Gokarting race in Coimbatore (Karimotor speedway – Prestigious competition) and get opportunities for placement & internship.',
    ],
    order: 1,
  },
  {
    officeName: 'Pune',
    address: ['Sri Vishnu Educational Society,', 'Office No. 302, 3rd Floor,', 'Landmark Avenue, Deepa Society,', 'Opp. Sant Tukaram School,', 'Baner Pashan Link Road,', 'Pune – 411045.'],
    bullets: [
      'Pune placement office was started in the year 2012, the strategy to start the Pune office was to have a strong local connect with Industries of Maharashtra, as Pune, Mumbai, Nashik & Aurangabad have a very large number of Automobile Manufacturing Companies like Tata, Bajaj, JCB, Mahindra & Mahindra, Johndeere, Hyundai Excavators, Skoda, Sany Excavators, Volkswagen, Fiat and their ancillaries as well as large number of IT Companies in Mumbai & Pune region.',
      'The advantage of having an office in Pune is to have connect with Industry, where in we can have a core engineering employment job opportunities for the students as well as we can have many core Internships throughout the year wherein students have rich industrial experience before their final placement.',
      'We do different activities from the Pune office like we organize guest lectures of the Industry experts to our students as well as we organize Industry visits for the students with different companies.',
      'The Pune office have done lot of activities and have placed good number of students in Manufacturing and IT Companies.',
      'Now Pune office plays a major role in getting placements and Internship of Sri Vishnu Educational Society’s Students.',
    ],
    order: 2,
  },
];

export const ILO_OFFICE_DETAILS_COLLECTION = 'iloOfficeDetails';

export default function IloOfficeDetailsAdmin() {
  const { docs, loading } = useOrderedCollection<IloOfficeDetailDoc>(ILO_OFFICE_DETAILS_COLLECTION, 'order');
  const [form, setForm] = useState<Omit<IloOfficeDetailDoc, 'id'>>(EMPTY);
  const [editing, setEditing] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [seeding, setSeeding] = useState(false);

  const save = async () => {
    if (!form.officeName) return alert('Office name is required.');
    setSaving(true);
    try {
      if (editing) {
        await updateDoc(doc(db, ILO_OFFICE_DETAILS_COLLECTION, editing), { ...form });
      } else {
        await addDoc(collection(db, ILO_OFFICE_DETAILS_COLLECTION), { ...form, order: form.order || docs.length + 1, createdAt: serverTimestamp() });
      }
      setForm(EMPTY); setEditing(null);
    } catch (e) {
      alert(`Couldn't save: ${(e as Error).message}`);
    } finally { setSaving(false); }
  };

  const startEdit = (d: IloOfficeDetailDoc) => {
    setEditing(d.id);
    setForm({ officeName: d.officeName, address: d.address, bullets: d.bullets, order: d.order });
  };

  const remove = async (id: string) => {
    if (!confirm('Delete this office detail?')) return;
    try {
      await deleteDoc(doc(db, ILO_OFFICE_DETAILS_COLLECTION, id));
    } catch (e) {
      alert(`Couldn't delete: ${(e as Error).message}`);
    }
  };

  const seedDefaults = async () => {
    if (!confirm('Add the original Chennai & Pune office details to this (currently empty) list?')) return;
    setSeeding(true);
    try {
      await Promise.all(DEFAULT_ILO_OFFICE_DETAILS.map((d) => addDoc(collection(db, ILO_OFFICE_DETAILS_COLLECTION), { ...d, createdAt: serverTimestamp() })));
    } catch (e) {
      alert(`Couldn't seed defaults: ${(e as Error).message}`);
    } finally { setSeeding(false); }
  };

  return (
    <div className="admin-section">
      <div className="admin-card">
        <h2 className="admin-card__title">{editing ? 'Edit Office Detail' : 'Add Office Detail'}</h2>
        <p className="admin-lead" style={{ marginBottom: '1rem' }}>
          Powers the expanded address + description shown on the Industry Liaison Offices page's Regional
          Offices accordion. The office name must exactly match the row name in that table (Placement
          Sub-pages → Industry Liaison Offices) to attach to the right row.
        </p>
        <div className="admin-form-grid">
          <div className="admin-field">
            <label htmlFor="field-office-name">Office Name *</label>
            <input id="field-office-name" value={form.officeName} onChange={(e) => setForm((p) => ({ ...p, officeName: e.target.value }))} placeholder="Chennai" />
          </div>
          <div className="admin-field">
            <label htmlFor="field-display-order">Display Order</label>
            <input id="field-display-order" type="number" value={form.order} onChange={(e) => setForm((p) => ({ ...p, order: Number(e.target.value) }))} min={0} />
          </div>
          <div className="admin-field admin-field--full">
            <label htmlFor="field-address">Address (one line per row)</label>
            <textarea id="field-address" rows={4} value={form.address.join('\n')} onChange={(e) => setForm((p) => ({ ...p, address: e.target.value.split('\n') }))} placeholder={'Sri Vishnu Educational Society,\nThapar House, Ground Floor,\nChennai- 600008.'} />
          </div>
          <div className="admin-field admin-field--full">
            <label htmlFor="field-bullets">Description Points (one per line)</label>
            <textarea id="field-bullets" rows={6} value={form.bullets.join('\n')} onChange={(e) => setForm((p) => ({ ...p, bullets: e.target.value.split('\n') }))} placeholder="One paragraph per line…" />
          </div>
        </div>
        <div className="admin-form-actions">
          {editing && <button className="admin-btn admin-btn--ghost" onClick={() => { setEditing(null); setForm(EMPTY); }}>Cancel</button>}
          <button className="admin-btn admin-btn--primary" onClick={save} disabled={saving}>
            {saving ? 'Saving…' : editing ? 'Update' : 'Add Office Detail'}
          </button>
        </div>
      </div>

      <div className="admin-card">
        <div className="admin-card__toolbar">
          <h2 className="admin-card__title">Office Details ({docs.length})</h2>
          {docs.length === 0 && (
            <button className="admin-btn admin-btn--sm admin-btn--secondary" onClick={seedDefaults} disabled={seeding}>
              {seeding ? 'Adding…' : 'Add Starter Offices (Chennai & Pune)'}
            </button>
          )}
        </div>
        {loading ? <p className="admin-loading">Loading…</p> : (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead><tr><th>Order</th><th>Office</th><th>Address Lines</th><th>Points</th><th>Actions</th></tr></thead>
              <tbody>
                {docs.map((d) => (
                  <tr key={d.id}>
                    <td>{d.order}</td>
                    <td>{d.officeName}</td>
                    <td>{d.address.length}</td>
                    <td>{d.bullets.length}</td>
                    <td>
                      <button className="admin-btn admin-btn--sm" onClick={() => startEdit(d)}>Edit</button>
                      <button className="admin-btn admin-btn--sm admin-btn--danger" onClick={() => remove(d.id)}>Delete</button>
                    </td>
                  </tr>
                ))}
                {docs.length === 0 && <tr><td colSpan={5} className="admin-empty">No office details yet — the page currently falls back to the original Chennai &amp; Pune detail. Click "Add Starter Offices" to make them editable, or add new ones above.</td></tr>}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
