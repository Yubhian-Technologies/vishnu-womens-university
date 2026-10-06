import { useState, useEffect } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { setDoc } from '../../../lib/auditLog';
import { db } from '../../../lib/firebase';
import { Plus, Trash2, Save, RotateCcw, GraduationCap, BookOpen, Award, Landmark } from 'lucide-react';

export interface ProgramFeeRow {
  name: string;
  code: string;
  intake: number;
}

export interface MbaFeeRow {
  name: string;
  code: string;
  intake: number;
  entrance: string;
}

export interface ProgrammesFeeDoc {
  btechDuration: string;
  btechFee: string;
  viswpuBtechFee: string;
  btechViswPrograms: ProgramFeeRow[];
  viswpuBtechPrograms: ProgramFeeRow[];
  mtechDuration: string;
  mtechFee: string;
  mtechPrograms: ProgramFeeRow[];
  mbaDuration: string;
  mbaFee: string;
  mba: MbaFeeRow;
  pmVidyalaxmiText: string;
}

// Mirrors the content that was hardcoded directly in ProgrammesFee.tsx
// before this admin editor existed — used both as the public page's
// fallback (so it renders identically until an admin saves anything) and
// as this editor's starting point / "Reset Defaults" target.
export const DEFAULT_PROGRAMMES_FEE: ProgrammesFeeDoc = {
  btechDuration: '4 Years',
  btechFee: '₹ 1,05,000',
  viswpuBtechFee: '₹ 47,000',
  btechViswPrograms: [
    { name: 'Computer Science & Engineering', code: 'B.Tech CSE', intake: 180 },
    { name: 'CSE [Artificial Intelligence & Machine Learning]', code: 'B.Tech CSE(AI & ML)', intake: 120 },
    { name: 'CSE [Artificial Intelligence & Data Science]', code: 'B.Tech CSE(AI & DS)', intake: 120 },
    { name: 'CSE [Cyber Security]', code: 'B.Tech Cyber Security', intake: 60 },
    { name: 'Information Technology', code: 'B.Tech IT', intake: 180 },
    { name: 'Electronics & Communication Engineering', code: 'B.Tech ECE', intake: 120 },
    { name: 'Electrical & Electronics Engineering', code: 'B.Tech EEE', intake: 60 },
    { name: 'Civil Engineering', code: 'B.Tech CE', intake: 60 },
    { name: 'Mechanical Engineering', code: 'B.Tech ME', intake: 60 },
  ],
  viswpuBtechPrograms: [
    { name: 'CSE [Artificial Intelligence & Machine Learning]', code: 'CSM', intake: 120 },
    { name: 'Electronics Engineering (VLSI Design & Technology)', code: 'EVT', intake: 60 },
  ],
  mtechDuration: '2 Years',
  mtechFee: '₹ 55,800',
  mtechPrograms: [
    { name: 'M.Tech – Computer Science & Engineering', code: 'M.Tech CSE', intake: 27 },
    { name: 'M.Tech – VLSI Design', code: 'M.Tech VLSI', intake: 18 },
    { name: 'M.Tech – Power Electronics', code: 'M.Tech Power Electronics', intake: 9 },
    { name: 'M.Tech – Software Engineering', code: 'M.Tech Software Engg.', intake: 9 },
  ],
  mbaDuration: '2 Years',
  mbaFee: '₹ 55,000',
  mba: { name: 'Master of Business Administration', code: 'MBA', intake: 60, entrance: 'ICET' },
  // **double asterisks** render as accent-colored bold on the public page
  // (see splitBold in lib/boldText.ts) — matches the original hardcoded
  // <strong style={{ color: 'var(--color-accent)' }}> treatment exactly.
  pmVidyalaxmiText:
    'Meritorious students can avail financial assistance through the **PM Vidyalaxmi Scheme**, making quality engineering education accessible to all deserving students regardless of financial background.',
};

export const PROGRAMMES_FEE_COLLECTION = 'settings';
export const PROGRAMMES_FEE_DOC_ID = 'programmesFee';

function RowsEditor({
  title,
  rows,
  onChange,
}: {
  title: string;
  rows: ProgramFeeRow[];
  onChange: (rows: ProgramFeeRow[]) => void;
}) {
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
        <label className="admin-label" style={{ margin: 0 }}>{title}</label>
        <button
          type="button"
          onClick={() => onChange([...rows, { name: '', code: '', intake: 0 }])}
          className="admin-btn admin-btn--sm admin-btn--secondary"
        >
          <Plus size={14} /> Add Row
        </button>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
        {rows.map((r, idx) => (
          <div key={idx} style={{ display: 'grid', gridTemplateColumns: '2fr 1.2fr 0.8fr auto', gap: '0.5rem', alignItems: 'center' }}>
            <input
              type="text"
              placeholder="Programme name"
              value={r.name}
              onChange={(e) => {
                const updated = [...rows];
                updated[idx] = { ...updated[idx], name: e.target.value };
                onChange(updated);
              }}
              className="admin-input"
            />
            <input
              type="text"
              placeholder="Branch code"
              value={r.code}
              onChange={(e) => {
                const updated = [...rows];
                updated[idx] = { ...updated[idx], code: e.target.value };
                onChange(updated);
              }}
              className="admin-input"
            />
            <input
              type="number"
              placeholder="Intake"
              value={r.intake}
              onChange={(e) => {
                const updated = [...rows];
                updated[idx] = { ...updated[idx], intake: +e.target.value };
                onChange(updated);
              }}
              className="admin-input"
              min={0}
            />
            <button type="button" onClick={() => onChange(rows.filter((_, i) => i !== idx))} className="admin-btn-danger">
              <Trash2 size={15} />
            </button>
          </div>
        ))}
        {rows.length === 0 && <p className="admin-field__hint">No rows yet.</p>}
      </div>
    </div>
  );
}

export default function ProgrammesFeeAdmin() {
  const [data, setData] = useState<ProgrammesFeeDoc>(DEFAULT_PROGRAMMES_FEE);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState<'btech' | 'mtech' | 'mba' | 'scholarship'>('btech');

  useEffect(() => {
    async function loadData() {
      try {
        const snap = await getDoc(doc(db, PROGRAMMES_FEE_COLLECTION, PROGRAMMES_FEE_DOC_ID));
        if (snap.exists()) {
          const remote = snap.data() as Partial<ProgrammesFeeDoc>;
          setData({
            ...DEFAULT_PROGRAMMES_FEE,
            ...remote,
            btechViswPrograms: remote.btechViswPrograms || DEFAULT_PROGRAMMES_FEE.btechViswPrograms,
            viswpuBtechPrograms: remote.viswpuBtechPrograms || DEFAULT_PROGRAMMES_FEE.viswpuBtechPrograms,
            mtechPrograms: remote.mtechPrograms || DEFAULT_PROGRAMMES_FEE.mtechPrograms,
            mba: { ...DEFAULT_PROGRAMMES_FEE.mba, ...(remote.mba || {}) },
          });
        }
      } catch (err) {
        console.error('Failed to load Programmes & Fee data:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      await setDoc(doc(db, PROGRAMMES_FEE_COLLECTION, PROGRAMMES_FEE_DOC_ID), data);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch (err) {
      console.error('Failed to save Programmes & Fee data:', err);
      alert('Failed to save changes. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    if (confirm('Reset all content to original defaults?')) {
      setData(DEFAULT_PROGRAMMES_FEE);
    }
  };

  if (loading) {
    return <p className="admin-loading">Loading Programmes & Fee Structure Editor...</p>;
  }

  return (
    <div className="admin-section">
      <div className="admin-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '1.25rem', borderBottom: '1px solid #e5e7eb', paddingBottom: '1rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <GraduationCap size={18} color="#c8a03c" />
              <h2 className="admin-card__title" style={{ margin: 0, padding: 0, border: 'none' }}>
                Programmes & Fee Structure
              </h2>
            </div>
            <p className="admin-field__hint" style={{ margin: '0.35rem 0 0' }}>
              Edit B.Tech, M.Tech, and MBA programme rows (name, branch code, intake), each table's tuition fee, and
              the scholarship note. Ph.D. programmes are managed separately under Admin → Programs.
            </p>
          </div>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button type="button" onClick={handleReset} className="admin-btn admin-btn--sm admin-btn--ghost">
              <RotateCcw size={14} /> Reset Defaults
            </button>
            <button type="button" onClick={handleSave} disabled={saving} className="admin-btn admin-btn--sm admin-btn--primary">
              <Save size={14} /> {saving ? 'Saving...' : 'Save All Changes'}
            </button>
          </div>
        </div>

        {savedSuccess && (
          <div style={{ background: '#ecfdf5', border: '1px solid #a7f3d0', padding: '0.75rem 1rem', borderRadius: '8px', color: '#065f46', fontSize: '0.85rem', marginBottom: '1.25rem' }}>
            Saved and published live!
          </div>
        )}

        <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.75rem', marginBottom: '1.5rem' }}>
          {[
            { id: 'btech', label: 'B.Tech', icon: BookOpen },
            { id: 'mtech', label: 'M.Tech', icon: Award },
            { id: 'mba', label: 'MBA', icon: Landmark },
            { id: 'scholarship', label: 'Scholarship Note', icon: GraduationCap },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={`admin-btn admin-btn--sm ${isActive ? 'admin-btn--primary' : 'admin-btn--ghost'}`}
              >
                <Icon size={14} /> {tab.label}
              </button>
            );
          })}
        </div>

        {activeTab === 'btech' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.85rem' }}>
              <div className="admin-field">
                <label>Duration</label>
                <input type="text" className="admin-input" value={data.btechDuration} onChange={(e) => setData({ ...data, btechDuration: e.target.value })} />
              </div>
              <div className="admin-field">
                <label>Tuition Fee — VISW</label>
                <input type="text" className="admin-input" value={data.btechFee} onChange={(e) => setData({ ...data, btechFee: e.target.value })} />
              </div>
              <div className="admin-field">
                <label>Tuition Fee — VISWPU</label>
                <input type="text" className="admin-input" value={data.viswpuBtechFee} onChange={(e) => setData({ ...data, viswpuBtechFee: e.target.value })} />
              </div>
            </div>
            <RowsEditor
              title="B.Tech — VISW Programmes"
              rows={data.btechViswPrograms}
              onChange={(rows) => setData({ ...data, btechViswPrograms: rows })}
            />
            <RowsEditor
              title="B.Tech — VISWPU Programmes"
              rows={data.viswpuBtechPrograms}
              onChange={(rows) => setData({ ...data, viswpuBtechPrograms: rows })}
            />
          </div>
        )}

        {activeTab === 'mtech' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.85rem' }}>
              <div className="admin-field">
                <label>Duration</label>
                <input type="text" className="admin-input" value={data.mtechDuration} onChange={(e) => setData({ ...data, mtechDuration: e.target.value })} />
              </div>
              <div className="admin-field">
                <label>Tuition Fee</label>
                <input type="text" className="admin-input" value={data.mtechFee} onChange={(e) => setData({ ...data, mtechFee: e.target.value })} />
              </div>
            </div>
            <RowsEditor
              title="M.Tech Programmes"
              rows={data.mtechPrograms}
              onChange={(rows) => setData({ ...data, mtechPrograms: rows })}
            />
          </div>
        )}

        {activeTab === 'mba' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.85rem' }}>
              <div className="admin-field">
                <label>Duration</label>
                <input type="text" className="admin-input" value={data.mbaDuration} onChange={(e) => setData({ ...data, mbaDuration: e.target.value })} />
              </div>
              <div className="admin-field">
                <label>Tuition Fee</label>
                <input type="text" className="admin-input" value={data.mbaFee} onChange={(e) => setData({ ...data, mbaFee: e.target.value })} />
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.6rem' }}>
              <div className="admin-field">
                <label>Programme name</label>
                <input type="text" className="admin-input" value={data.mba.name} onChange={(e) => setData({ ...data, mba: { ...data.mba, name: e.target.value } })} />
              </div>
              <div className="admin-field">
                <label>Branch code</label>
                <input type="text" className="admin-input" value={data.mba.code} onChange={(e) => setData({ ...data, mba: { ...data.mba, code: e.target.value } })} />
              </div>
              <div className="admin-field">
                <label>Total intake</label>
                <input type="number" className="admin-input" min={0} value={data.mba.intake} onChange={(e) => setData({ ...data, mba: { ...data.mba, intake: +e.target.value } })} />
              </div>
              <div className="admin-field">
                <label>Entrance</label>
                <input type="text" className="admin-input" value={data.mba.entrance} onChange={(e) => setData({ ...data, mba: { ...data.mba, entrance: e.target.value } })} />
              </div>
            </div>
          </div>
        )}

        {activeTab === 'scholarship' && (
          <div className="admin-field">
            <label>PM Vidyalaxmi Scheme — Note</label>
            <p className="admin-field__hint" style={{ marginTop: '-0.25rem' }}>
              Wrap any phrase in **double asterisks** to show it in bold accent colour, e.g. "the **PM Vidyalaxmi Scheme**".
            </p>
            <textarea
              rows={4}
              className="admin-textarea"
              value={data.pmVidyalaxmiText}
              onChange={(e) => setData({ ...data, pmVidyalaxmiText: e.target.value })}
            />
          </div>
        )}
      </div>
    </div>
  );
}
