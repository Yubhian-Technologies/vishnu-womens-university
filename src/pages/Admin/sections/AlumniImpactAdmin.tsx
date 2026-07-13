import { useState } from 'react';
import {
  collection, addDoc, deleteDoc, doc, updateDoc, serverTimestamp,
} from 'firebase/firestore';
import { db } from '../../../lib/firebase';
import { useOrderedCollection } from '../../../hooks/useCollection';

interface ImpactStat {
  id: string;
  icon: string;
  stat: string;
  label: string;
  desc: string;
  order: number;
}

interface Company {
  id: string;
  name: string;
  order: number;
}

const EMPTY_STAT: Omit<ImpactStat, 'id'> = { icon: '🎓', stat: '', label: '', desc: '', order: 0 };
const EMPTY_COMPANY: Omit<Company, 'id'> = { name: '', order: 0 };

const DEFAULT_STATS: Omit<ImpactStat, 'id'>[] = [
  { icon: '🎓', stat: '13,100+', label: 'Engineers Graduated', desc: 'VWU alumni are contributing meaningfully to industry and research across India and internationally.', order: 0 },
  { icon: '🏛️', stat: '1,400+', label: 'Annual Placements', desc: 'A consistent placement record strengthened by alumni mentoring and active recruiter relationships.', order: 1 },
  { icon: '🌍', stat: '50+', label: 'Companies Recruiting', desc: 'Leading firms from Amazon to Infosys recruit VWU graduates on campus every year.', order: 2 },
  { icon: '📈', stat: '59.28 LPA', label: 'Highest Package', desc: 'Strong alumni-industry connections help students secure top-tier offers.', order: 3 },
];

const DEFAULT_COMPANIES: Omit<Company, 'id'>[] = [
  'Amazon', 'Microsoft', 'Google', 'Intel', 'TCS', 'Infosys', 'Wipro', 'Cognizant',
  'Accenture', 'IBM', 'Capgemini', 'HCL Technologies', 'Tech Mahindra', 'Samsung R&D', 'Qualcomm',
].map((name, order) => ({ name, order }));

export default function AlumniImpactAdmin() {
  const { docs: stats, loading: statsLoading } = useOrderedCollection<ImpactStat>('alumniImpact', 'order');
  const [statForm, setStatForm] = useState<Omit<ImpactStat, 'id'>>(EMPTY_STAT);
  const [editingStat, setEditingStat] = useState<string | null>(null);

  const { docs: companies, loading: companiesLoading } = useOrderedCollection<Company>('alumniCompanies', 'order');
  const [companyForm, setCompanyForm] = useState<Omit<Company, 'id'>>(EMPTY_COMPANY);
  const [editingCompany, setEditingCompany] = useState<string | null>(null);

  const setStat = (k: string, v: string | number) => setStatForm((p) => ({ ...p, [k]: v }));
  const setCompany = (k: string, v: string | number) => setCompanyForm((p) => ({ ...p, [k]: v }));

  const [savingStat, setSavingStat] = useState(false);
  const [savingCompany, setSavingCompany] = useState(false);

  const saveStat = async () => {
    if (!statForm.stat || !statForm.label) return alert('Stat and label are required.');
    setSavingStat(true);
    try {
      if (editingStat) {
        await updateDoc(doc(db, 'alumniImpact', editingStat), { ...statForm });
      } else {
        await addDoc(collection(db, 'alumniImpact'), { ...statForm, createdAt: serverTimestamp() });
      }
      setStatForm(EMPTY_STAT); setEditingStat(null);
    } catch (e) {
      alert(`Couldn't save: ${(e as Error).message}`);
    } finally {
      setSavingStat(false);
    }
  };

  const startEditStat = (s: ImpactStat) => {
    setEditingStat(s.id);
    setStatForm({ icon: s.icon, stat: s.stat, label: s.label, desc: s.desc, order: s.order });
  };

  const removeStat = async (id: string) => {
    if (!confirm('Delete this stat?')) return;
    try {
      await deleteDoc(doc(db, 'alumniImpact', id));
    } catch (e) {
      alert(`Couldn't delete: ${(e as Error).message}`);
    }
  };

  const seedStats = async () => {
    if (!confirm('Add the original set of impact stats as a starting point?')) return;
    try {
      for (const d of DEFAULT_STATS) await addDoc(collection(db, 'alumniImpact'), { ...d, createdAt: serverTimestamp() });
    } catch (e) {
      alert(`Couldn't add starter stats: ${(e as Error).message}`);
    }
  };

  const saveCompany = async () => {
    if (!companyForm.name) return alert('Company name is required.');
    setSavingCompany(true);
    try {
      if (editingCompany) {
        await updateDoc(doc(db, 'alumniCompanies', editingCompany), { ...companyForm });
      } else {
        await addDoc(collection(db, 'alumniCompanies'), { ...companyForm, createdAt: serverTimestamp() });
      }
      setCompanyForm(EMPTY_COMPANY); setEditingCompany(null);
    } catch (e) {
      alert(`Couldn't save: ${(e as Error).message}`);
    } finally {
      setSavingCompany(false);
    }
  };

  const startEditCompany = (c: Company) => {
    setEditingCompany(c.id);
    setCompanyForm({ name: c.name, order: c.order });
  };

  const removeCompany = async (id: string) => {
    if (!confirm('Delete this company?')) return;
    try {
      await deleteDoc(doc(db, 'alumniCompanies', id));
    } catch (e) {
      alert(`Couldn't delete: ${(e as Error).message}`);
    }
  };

  const seedCompanies = async () => {
    if (!confirm('Add the original set of recruiting companies as a starting point?')) return;
    try {
      for (const d of DEFAULT_COMPANIES) await addDoc(collection(db, 'alumniCompanies'), { ...d, createdAt: serverTimestamp() });
    } catch (e) {
      alert(`Couldn't add starter companies: ${(e as Error).message}`);
    }
  };

  return (
    <div className="admin-section">
      {/* Impact stats */}
      <div className="admin-card">
        <h2 className="admin-card__title">{editingStat ? 'Edit Impact Stat' : 'Add Impact Stat'}</h2>
        <div className="admin-form-grid">
          <div className="admin-field">
            <label>Icon (emoji)</label>
            <input value={statForm.icon} onChange={(e) => setStat('icon', e.target.value)} placeholder="🎓" />
          </div>
          <div className="admin-field">
            <label>Stat *</label>
            <input value={statForm.stat} onChange={(e) => setStat('stat', e.target.value)} placeholder="13,100+" />
          </div>
          <div className="admin-field">
            <label>Label *</label>
            <input value={statForm.label} onChange={(e) => setStat('label', e.target.value)} placeholder="Engineers Graduated" />
          </div>
          <div className="admin-field">
            <label>Display Order</label>
            <input type="number" value={statForm.order} onChange={(e) => setStat('order', +e.target.value)} min={0} />
          </div>
          <div className="admin-field admin-field--full">
            <label>Description</label>
            <textarea rows={2} value={statForm.desc} onChange={(e) => setStat('desc', e.target.value)} />
          </div>
        </div>
        <div className="admin-form-actions">
          {editingStat && <button className="admin-btn admin-btn--ghost" onClick={() => { setEditingStat(null); setStatForm(EMPTY_STAT); }}>Cancel</button>}
          <button className="admin-btn admin-btn--primary" onClick={saveStat} disabled={savingStat}>
            {savingStat ? 'Saving…' : editingStat ? 'Update' : 'Add Stat'}
          </button>
        </div>
      </div>

      <div className="admin-card">
        <h2 className="admin-card__title">All Impact Stats ({stats.length})</h2>
        {statsLoading ? <p className="admin-loading">Loading…</p> : (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead><tr><th>Icon</th><th>Stat</th><th>Label</th><th>Actions</th></tr></thead>
              <tbody>
                {stats.map((s) => (
                  <tr key={s.id}>
                    <td>{s.icon}</td>
                    <td>{s.stat}</td>
                    <td>{s.label}</td>
                    <td>
                      <button className="admin-btn admin-btn--sm" onClick={() => startEditStat(s)}>Edit</button>
                      <button className="admin-btn admin-btn--sm admin-btn--danger" onClick={() => removeStat(s.id)}>Delete</button>
                    </td>
                  </tr>
                ))}
                {stats.length === 0 && (
                  <tr>
                    <td colSpan={4} className="admin-empty">
                      No impact stats yet.{' '}
                      <button className="admin-btn admin-btn--sm" onClick={seedStats}>Add starter stats</button>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Recruiting companies */}
      <div className="admin-card">
        <h2 className="admin-card__title">{editingCompany ? 'Edit Company' : 'Add Recruiting Company'}</h2>
        <div className="admin-form-grid">
          <div className="admin-field">
            <label>Company Name *</label>
            <input value={companyForm.name} onChange={(e) => setCompany('name', e.target.value)} placeholder="Amazon" />
          </div>
          <div className="admin-field">
            <label>Display Order</label>
            <input type="number" value={companyForm.order} onChange={(e) => setCompany('order', +e.target.value)} min={0} />
          </div>
        </div>
        <div className="admin-form-actions">
          {editingCompany && <button className="admin-btn admin-btn--ghost" onClick={() => { setEditingCompany(null); setCompanyForm(EMPTY_COMPANY); }}>Cancel</button>}
          <button className="admin-btn admin-btn--primary" onClick={saveCompany} disabled={savingCompany}>
            {savingCompany ? 'Saving…' : editingCompany ? 'Update' : 'Add Company'}
          </button>
        </div>
      </div>

      <div className="admin-card">
        <h2 className="admin-card__title">All Companies ({companies.length})</h2>
        {companiesLoading ? <p className="admin-loading">Loading…</p> : (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
            {companies.map((c) => (
              <span key={c.id} className="admin-badge admin-badge--clickable" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
                {c.name}
                <button className="admin-btn admin-btn--sm" style={{ padding: '0.1rem 0.4rem' }} onClick={() => startEditCompany(c)}>✎</button>
                <button className="admin-btn admin-btn--sm admin-btn--danger" style={{ padding: '0.1rem 0.4rem' }} onClick={() => removeCompany(c.id)}>✕</button>
              </span>
            ))}
            {companies.length === 0 && (
              <p className="admin-empty">
                No companies yet.{' '}
                <button className="admin-btn admin-btn--sm" onClick={seedCompanies}>Add starter companies</button>
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
