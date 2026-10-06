import { useState, useEffect, Fragment } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { setDoc } from '../../../lib/auditLog';
import { db } from '../../../lib/firebase';
import { Plus, Trash2, Save, RotateCcw, BarChart3, CalendarRange } from 'lucide-react';

export interface RankYearValues {
  beginRank: string;
  endingRank: string;
}

export interface RankAnalysisRow {
  code: string;
  course: string;
  collegeCode: 'VISW' | 'VISWPU';
  // Keyed by exactly whatever's in `years` below (e.g. "2026-27") — a row
  // missing an entry for a given year (e.g. a college code not yet allotted
  // that year) just renders '---', same as the original hardcoded data did.
  ranks: Record<string, RankYearValues>;
}

export interface AdmissionsRanksDoc {
  // Ordered newest-first — this order drives both the admin table's column
  // order and the public page's "Academic Year" dropdown order. Admins add
  // a new counselling year here once it's published; every row then gets an
  // empty entry for it to fill in.
  years: string[];
  rows: RankAnalysisRow[];
}

// Mirrors the eapcetRanksData hardcoded in Admissions.tsx before this editor
// existed — the public page falls back to this until an admin saves
// anything, so it renders identically.
export const DEFAULT_ADMISSIONS_RANKS: AdmissionsRanksDoc = {
  years: ['2026-27', '2025-26'],
  rows: [
    { code: 'CIV', course: 'CIVIL ENGINEERING', collegeCode: 'VISW', ranks: { '2026-27': { beginRank: '10,350', endingRank: '30,914' }, '2025-26': { beginRank: '11,298', endingRank: '51,609' } } },
    { code: 'CSE', course: 'COMPUTER SCIENCE AND ENGINEERING', collegeCode: 'VISW', ranks: { '2026-27': { beginRank: '375', endingRank: '4,020' }, '2025-26': { beginRank: '681', endingRank: '4,325' } } },
    { code: 'CSC', course: 'COMPUTER SCIENCE AND ENGINEERING (CYBER SECURITY)', collegeCode: 'VISW', ranks: { '2026-27': { beginRank: '2,647', endingRank: '5,705' }, '2025-26': { beginRank: '1,962', endingRank: '7,152' } } },
    { code: 'CSM', course: 'CSE (ARTIFICIAL INTELLIGENCE AND MACHINE LEARNING)', collegeCode: 'VISW', ranks: { '2026-27': { beginRank: '1,733', endingRank: '4,814' }, '2025-26': { beginRank: '523', endingRank: '5,256' } } },
    { code: 'CAD', course: 'CSE (ARTIFICIAL INTELLIGENCE & DATA SCIENCE)', collegeCode: 'VISW', ranks: { '2026-27': { beginRank: '1,481', endingRank: '5,475' }, '2025-26': { beginRank: '1,466', endingRank: '6,284' } } },
    { code: 'EEE', course: 'ELECTRICAL AND ELECTRONICS ENGINEERING', collegeCode: 'VISW', ranks: { '2026-27': { beginRank: '9,353', endingRank: '16,183' }, '2025-26': { beginRank: '13,282', endingRank: '20,962' } } },
    { code: 'ECE', course: 'ELECTRONICS AND COMMUNICATION ENGINEERING', collegeCode: 'VISW', ranks: { '2026-27': { beginRank: '2,484', endingRank: '6,978' }, '2025-26': { beginRank: '3,684', endingRank: '9,659' } } },
    { code: 'INF', course: 'INFORMATION TECHNOLOGY', collegeCode: 'VISW', ranks: { '2026-27': { beginRank: '5,297', endingRank: '8,023' }, '2025-26': { beginRank: '6,126', endingRank: '10,089' } } },
    { code: 'MEC', course: 'MECHANICAL ENGINEERING', collegeCode: 'VISW', ranks: { '2026-27': { beginRank: '7,904', endingRank: '20,739' }, '2025-26': { beginRank: '18,156', endingRank: '33,395' } } },
    { code: 'CSM', course: 'CSE (ARTIFICIAL INTELLIGENCE AND MACHINE LEARNING)', collegeCode: 'VISWPU', ranks: { '2026-27': { beginRank: '1,242', endingRank: '9,991' }, '2025-26': { beginRank: '---', endingRank: '---' } } },
    { code: 'EVT', course: 'ELECTRONICS ENGINEERING (VLSI DESIGN AND TECHNOLOGY)', collegeCode: 'VISWPU', ranks: { '2026-27': { beginRank: '2,331', endingRank: '7,756' }, '2025-26': { beginRank: '---', endingRank: '---' } } },
  ],
};

export const ADMISSIONS_RANKS_COLLECTION = 'settings';
export const ADMISSIONS_RANKS_DOC_ID = 'admissionsRanks';

export default function AdmissionsRanksAdmin() {
  const [data, setData] = useState<AdmissionsRanksDoc>(DEFAULT_ADMISSIONS_RANKS);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [newYear, setNewYear] = useState('');

  useEffect(() => {
    async function loadData() {
      try {
        const snap = await getDoc(doc(db, ADMISSIONS_RANKS_COLLECTION, ADMISSIONS_RANKS_DOC_ID));
        if (snap.exists()) {
          const remote = snap.data() as Partial<AdmissionsRanksDoc>;
          setData({
            years: remote.years?.length ? remote.years : DEFAULT_ADMISSIONS_RANKS.years,
            rows: remote.rows?.length ? remote.rows : DEFAULT_ADMISSIONS_RANKS.rows,
          });
        }
      } catch (err) {
        console.error('Failed to load Admissions Ranks data:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      await setDoc(doc(db, ADMISSIONS_RANKS_COLLECTION, ADMISSIONS_RANKS_DOC_ID), data);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch (err) {
      console.error('Failed to save Admissions Ranks data:', err);
      alert('Failed to save changes. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    if (confirm('Reset all years and rows to original defaults?')) setData(DEFAULT_ADMISSIONS_RANKS);
  };

  const addYear = () => {
    const year = newYear.trim();
    if (!year) return;
    if (data.years.includes(year)) { alert('That academic year is already in the table.'); return; }
    setData({
      years: [year, ...data.years],
      rows: data.rows.map((r) => ({ ...r, ranks: { ...r.ranks, [year]: { beginRank: '', endingRank: '' } } })),
    });
    setNewYear('');
  };

  const removeYear = (year: string) => {
    if (!confirm(`Remove "${year}" from every row? This can't be undone until you save again.`)) return;
    setData({
      years: data.years.filter((y) => y !== year),
      rows: data.rows.map((r) => {
        const ranks = { ...r.ranks };
        delete ranks[year];
        return { ...r, ranks };
      }),
    });
  };

  const moveYear = (idx: number, dir: -1 | 1) => {
    const years = [...data.years];
    const target = idx + dir;
    if (target < 0 || target >= years.length) return;
    [years[idx], years[target]] = [years[target], years[idx]];
    setData({ ...data, years });
  };

  const addRow = () => {
    const ranks: Record<string, RankYearValues> = {};
    data.years.forEach((y) => { ranks[y] = { beginRank: '', endingRank: '' }; });
    setData({ ...data, rows: [...data.rows, { code: '', course: '', collegeCode: 'VISW', ranks }] });
  };

  const updateRow = (idx: number, patch: Partial<RankAnalysisRow>) => {
    const rows = [...data.rows];
    rows[idx] = { ...rows[idx], ...patch };
    setData({ ...data, rows });
  };

  const updateRank = (idx: number, year: string, patch: Partial<RankYearValues>) => {
    const rows = [...data.rows];
    const current = rows[idx].ranks[year] || { beginRank: '', endingRank: '' };
    rows[idx] = { ...rows[idx], ranks: { ...rows[idx].ranks, [year]: { ...current, ...patch } } };
    setData({ ...data, rows });
  };

  if (loading) {
    return <p className="admin-loading">Loading Admissions Rank Analysis Editor...</p>;
  }

  return (
    <div className="admin-section">
      <div className="admin-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '1.25rem', borderBottom: '1px solid #e5e7eb', paddingBottom: '1rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <BarChart3 size={18} color="#c8a03c" />
              <h2 className="admin-card__title" style={{ margin: 0, padding: 0, border: 'none' }}>AP EAPCET Rank Analysis</h2>
            </div>
            <p className="admin-field__hint" style={{ margin: '0.35rem 0 0' }}>
              The opening/closing AP EAPCET rank table on the Admissions page, including its "Academic Year" toggle.
              Add a new counselling year below when it's published — every row gets a blank entry for it to fill in,
              and it appears as a new option in the public page's year toggle automatically.
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

        {/* Academic Years — this list IS the public page's "Academic Year" toggle */}
        <div style={{ marginBottom: '1.5rem', paddingBottom: '1.5rem', borderBottom: '1px solid #e2e8f0' }}>
          <label className="admin-label" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <CalendarRange size={16} /> Academic Years (toggle options, newest first)
          </label>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '0.5rem', marginBottom: '0.75rem' }}>
            {data.years.map((y, idx) => (
              <div key={y} style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '9999px', padding: '0.3rem 0.4rem 0.3rem 0.85rem' }}>
                <span style={{ fontWeight: 700, fontSize: '0.85rem' }}>{y}</span>
                <button type="button" onClick={() => moveYear(idx, -1)} disabled={idx === 0} className="admin-btn admin-btn--sm" title="Move earlier in the list" style={{ padding: '2px 6px' }}>↑</button>
                <button type="button" onClick={() => moveYear(idx, 1)} disabled={idx === data.years.length - 1} className="admin-btn admin-btn--sm" title="Move later in the list" style={{ padding: '2px 6px' }}>↓</button>
                <button type="button" onClick={() => removeYear(y)} className="admin-btn-danger" style={{ padding: '2px 6px' }}><Trash2 size={12} /></button>
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <input
              type="text"
              placeholder="e.g. 2027-28"
              value={newYear}
              onChange={(e) => setNewYear(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') addYear(); }}
              className="admin-input"
              style={{ maxWidth: 200 }}
            />
            <button type="button" onClick={addYear} className="admin-btn admin-btn--sm admin-btn--secondary"><Plus size={14} /> Add Year</button>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '0.75rem' }}>
          <button type="button" onClick={addRow} className="admin-btn admin-btn--sm admin-btn--secondary">
            <Plus size={14} /> Add Row
          </button>
        </div>

        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>College</th><th>Code</th><th>Course</th>
                {data.years.map((y) => (
                  <th key={y} colSpan={2} style={{ textAlign: 'center' }}>{y}</th>
                ))}
                <th></th>
              </tr>
              <tr>
                <th></th><th></th><th></th>
                {data.years.map((y) => (
                  <Fragment key={y}>
                    <th style={{ fontWeight: 400, fontSize: '0.7rem' }}>Begin</th>
                    <th style={{ fontWeight: 400, fontSize: '0.7rem' }}>End</th>
                  </Fragment>
                ))}
                <th></th>
              </tr>
            </thead>
            <tbody>
              {data.rows.map((r, idx) => (
                <tr key={idx}>
                  <td>
                    <select value={r.collegeCode} onChange={(e) => updateRow(idx, { collegeCode: e.target.value as 'VISW' | 'VISWPU' })} className="admin-input" style={{ minWidth: 90 }}>
                      <option value="VISW">VISW</option>
                      <option value="VISWPU">VISWPU</option>
                    </select>
                  </td>
                  <td><input type="text" value={r.code} onChange={(e) => updateRow(idx, { code: e.target.value })} className="admin-input" style={{ width: 70 }} /></td>
                  <td><input type="text" value={r.course} onChange={(e) => updateRow(idx, { course: e.target.value })} className="admin-input" style={{ minWidth: 220 }} /></td>
                  {data.years.map((y) => (
                    <Fragment key={y}>
                      <td>
                        <input
                          type="text"
                          value={r.ranks[y]?.beginRank || ''}
                          onChange={(e) => updateRank(idx, y, { beginRank: e.target.value })}
                          className="admin-input"
                          style={{ width: 80 }}
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          value={r.ranks[y]?.endingRank || ''}
                          onChange={(e) => updateRank(idx, y, { endingRank: e.target.value })}
                          className="admin-input"
                          style={{ width: 80 }}
                        />
                      </td>
                    </Fragment>
                  ))}
                  <td>
                    <button type="button" onClick={() => setData({ ...data, rows: data.rows.filter((_, i) => i !== idx) })} className="admin-btn-danger"><Trash2 size={14} /></button>
                  </td>
                </tr>
              ))}
              {data.rows.length === 0 && <tr><td colSpan={3 + data.years.length * 2 + 1} className="admin-empty">No rows yet.</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
