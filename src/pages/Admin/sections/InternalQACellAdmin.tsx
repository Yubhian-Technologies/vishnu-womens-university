import { useState, useEffect } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { setDoc } from '../../../lib/auditLog';
import { db } from '../../../lib/firebase';
import { Plus, Trash2, Save, RotateCcw, Users } from 'lucide-react';
import { IQAC_CELL_MEMBERS, IQAC_CELL_FUNCTIONS, type IQACCellMember } from '../../Governance/internalQACellDefault';

export type { IQACCellMember };

export interface InternalQACellDoc {
  members: IQACCellMember[];
  functions: string[];
}

// Mirrors IQAC_CELL_MEMBERS / IQAC_CELL_FUNCTIONS (the hardcoded 25-member
// roster + functions list on the Internal Quality Assurance Cell governance
// page) so the public page renders identically until an admin saves a change.
export const DEFAULT_INTERNAL_QA_CELL: InternalQACellDoc = {
  members: IQAC_CELL_MEMBERS,
  functions: IQAC_CELL_FUNCTIONS,
};

export const INTERNAL_QA_CELL_COLLECTION = 'settings';
export const INTERNAL_QA_CELL_DOC_ID = 'internalQACell';

const EMPTY_MEMBER: IQACCellMember = { name: '', designation: '', membershipType: '', position: 'Member' };

export default function InternalQACellAdmin() {
  const [data, setData] = useState<InternalQACellDoc>(DEFAULT_INTERNAL_QA_CELL);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    async function loadData() {
      try {
        const snap = await getDoc(doc(db, INTERNAL_QA_CELL_COLLECTION, INTERNAL_QA_CELL_DOC_ID));
        if (snap.exists()) {
          const remote = snap.data() as Partial<InternalQACellDoc>;
          setData({
            members: remote.members?.length ? remote.members : DEFAULT_INTERNAL_QA_CELL.members,
            functions: remote.functions?.length ? remote.functions : DEFAULT_INTERNAL_QA_CELL.functions,
          });
        }
      } catch (err) {
        console.error('Failed to load Internal QA Cell data:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      await setDoc(doc(db, INTERNAL_QA_CELL_COLLECTION, INTERNAL_QA_CELL_DOC_ID), data);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch (err) {
      console.error('Failed to save Internal QA Cell data:', err);
      alert('Failed to save changes. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    if (confirm('Reset members and functions to original defaults?')) setData(DEFAULT_INTERNAL_QA_CELL);
  };

  const updateMember = (idx: number, patch: Partial<IQACCellMember>) => {
    const members = [...data.members];
    members[idx] = { ...members[idx], ...patch };
    setData({ ...data, members });
  };

  if (loading) {
    return <p className="admin-loading">Loading Internal QA Cell Editor...</p>;
  }

  return (
    <div className="admin-section">
      <div className="admin-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '1.25rem', borderBottom: '1px solid #e5e7eb', paddingBottom: '1rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Users size={18} color="#c8a03c" />
              <h2 className="admin-card__title" style={{ margin: 0, padding: 0, border: 'none' }}>Internal Quality Assurance Cell</h2>
            </div>
            <p className="admin-field__hint" style={{ margin: '0.35rem 0 0' }}>
              Drives the "IQAC" / "Functions" tabs on Governance → Internal Quality Assurance Cell.
            </p>
          </div>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button type="button" onClick={handleReset} className="admin-btn admin-btn--sm admin-btn--ghost"><RotateCcw size={14} /> Reset Defaults</button>
            <button type="button" onClick={handleSave} disabled={saving} className="admin-btn admin-btn--sm admin-btn--primary"><Save size={14} /> {saving ? 'Saving...' : 'Save All Changes'}</button>
          </div>
        </div>

        {savedSuccess && (
          <div style={{ background: '#ecfdf5', border: '1px solid #a7f3d0', padding: '0.75rem 1rem', borderRadius: '8px', color: '#065f46', fontSize: '0.85rem', marginBottom: '1.25rem' }}>
            Saved and published live!
          </div>
        )}

        <h3 className="admin-card__title" style={{ fontSize: '0.95rem', marginTop: 0 }}>Members ({data.members.length})</h3>
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '0.6rem' }}>
          <button type="button" onClick={() => setData({ ...data, members: [...data.members, { ...EMPTY_MEMBER }] })} className="admin-btn admin-btn--sm admin-btn--secondary">
            <Plus size={14} /> Add Member
          </button>
        </div>
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Designation</th>
                <th>Type of Membership</th>
                <th>Position</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {data.members.map((m, idx) => (
                <tr key={idx}>
                  <td><input type="text" value={m.name} onChange={(e) => updateMember(idx, { name: e.target.value })} className="admin-input" /></td>
                  <td><input type="text" value={m.designation} onChange={(e) => updateMember(idx, { designation: e.target.value })} className="admin-input" /></td>
                  <td><input type="text" value={m.membershipType} onChange={(e) => updateMember(idx, { membershipType: e.target.value })} className="admin-input" /></td>
                  <td><input type="text" value={m.position} onChange={(e) => updateMember(idx, { position: e.target.value })} className="admin-input" /></td>
                  <td><button type="button" onClick={() => setData({ ...data, members: data.members.filter((_, i) => i !== idx) })} className="admin-btn-danger"><Trash2 size={13} /></button></td>
                </tr>
              ))}
              {data.members.length === 0 && (
                <tr><td colSpan={5} className="admin-empty">No members yet.</td></tr>
              )}
            </tbody>
          </table>
        </div>

        <h3 className="admin-card__title" style={{ fontSize: '0.95rem', marginTop: '1.5rem' }}>Functions (one per line)</h3>
        <textarea
          value={data.functions.join('\n')}
          onChange={(e) => setData({ ...data, functions: e.target.value.split('\n') })}
          className="admin-input"
          rows={8}
          style={{ width: '100%', fontFamily: 'inherit', resize: 'vertical' }}
        />
      </div>
    </div>
  );
}
