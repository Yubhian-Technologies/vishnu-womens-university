import { useState, useEffect } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { setDoc } from '../../../lib/auditLog';
import { db } from '../../../lib/firebase';
import { Plus, Trash2, Save, RotateCcw, TrendingUp } from 'lucide-react';

export interface BatchPassRate {
  batch: string;
  passPercent: number;
}

export interface ResultAnalysisDoc {
  batchPassRates: BatchPassRate[];
}

// Mirrors the batchPassRates hardcoded in ResultAnalysis.tsx before this
// admin editor existed — the public page falls back to this until an admin
// saves anything, so it renders identically.
export const DEFAULT_RESULT_ANALYSIS: ResultAnalysisDoc = {
  batchPassRates: [
    { batch: '2001 - 05', passPercent: 99.48 },
    { batch: '2002 - 06', passPercent: 94.47 },
    { batch: '2003 - 07', passPercent: 97.59 },
    { batch: '2004 - 08', passPercent: 99.16 },
    { batch: '2005 - 09', passPercent: 97.26 },
    { batch: '2006 - 10', passPercent: 96.80 },
    { batch: '2007 - 11', passPercent: 95.83 },
    { batch: '2008 - 12', passPercent: 94.74 },
    { batch: '2009 - 13', passPercent: 91.36 },
    { batch: '2010 - 14', passPercent: 91.94 },
    { batch: '2011 - 15', passPercent: 87.58 },
    { batch: '2012 - 16', passPercent: 88.68 },
    { batch: '2013 - 17', passPercent: 92.74 },
    { batch: '2014 - 18', passPercent: 94.42 },
    { batch: '2015 - 19', passPercent: 92.83 },
    { batch: '2016 - 20', passPercent: 88.61 },
    { batch: '2017-21', passPercent: 89.56 },
    { batch: '2018-22', passPercent: 92.86 },
    { batch: '2019-23', passPercent: 95.53 },
    { batch: '2020-24', passPercent: 97.16 },
    { batch: '2021-25', passPercent: 96.58 },
    { batch: '2022-26', passPercent: 97.88 },
  ],
};

export const RESULT_ANALYSIS_COLLECTION = 'settings';
export const RESULT_ANALYSIS_DOC_ID = 'resultAnalysis';

export default function ResultAnalysisAdmin() {
  const [data, setData] = useState<ResultAnalysisDoc>(DEFAULT_RESULT_ANALYSIS);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    async function loadData() {
      try {
        const snap = await getDoc(doc(db, RESULT_ANALYSIS_COLLECTION, RESULT_ANALYSIS_DOC_ID));
        if (snap.exists()) {
          const remote = snap.data() as Partial<ResultAnalysisDoc>;
          setData({ batchPassRates: remote.batchPassRates?.length ? remote.batchPassRates : DEFAULT_RESULT_ANALYSIS.batchPassRates });
        }
      } catch (err) {
        console.error('Failed to load Result Analysis data:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      await setDoc(doc(db, RESULT_ANALYSIS_COLLECTION, RESULT_ANALYSIS_DOC_ID), data);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch (err) {
      console.error('Failed to save Result Analysis data:', err);
      alert('Failed to save changes. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    if (confirm('Reset all batches to original defaults?')) setData(DEFAULT_RESULT_ANALYSIS);
  };

  const updateRow = (idx: number, patch: Partial<BatchPassRate>) => {
    const batchPassRates = [...data.batchPassRates];
    batchPassRates[idx] = { ...batchPassRates[idx], ...patch };
    setData({ batchPassRates });
  };

  if (loading) {
    return <p className="admin-loading">Loading Result Analysis Editor...</p>;
  }

  return (
    <div className="admin-section">
      <div className="admin-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '1.25rem', borderBottom: '1px solid #e5e7eb', paddingBottom: '1rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <TrendingUp size={18} color="#c8a03c" />
              <h2 className="admin-card__title" style={{ margin: 0, padding: 0, border: 'none' }}>Results Analysis — Batch Pass Rates</h2>
            </div>
            <p className="admin-field__hint" style={{ margin: '0.35rem 0 0' }}>
              Drives the bar chart, summary stats (highest/average/lowest/latest), and the exact-figures grid on the
              Results Analysis page. Keep batches in chronological order — the last row is treated as "Latest".
              The "Supporting Student Achievement" cards further down the page are edited separately under Page
              Content Blocks → "Results Analysis — Success Factors".
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

        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '0.75rem' }}>
          <button
            type="button"
            onClick={() => setData({ batchPassRates: [...data.batchPassRates, { batch: '', passPercent: 0 }] })}
            className="admin-btn admin-btn--sm admin-btn--secondary"
          >
            <Plus size={14} /> Add Batch
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '0.6rem' }}>
          {data.batchPassRates.map((b, idx) => (
            <div key={idx} style={{ display: 'flex', gap: '0.4rem', alignItems: 'center', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '0.5rem' }}>
              <input type="text" placeholder="e.g. 2022-26" value={b.batch} onChange={(e) => updateRow(idx, { batch: e.target.value })} className="admin-input" style={{ flex: 1 }} />
              <input type="number" step="0.01" value={b.passPercent} onChange={(e) => updateRow(idx, { passPercent: +e.target.value })} className="admin-input" style={{ width: 70 }} />
              <button type="button" onClick={() => setData({ batchPassRates: data.batchPassRates.filter((_, i) => i !== idx) })} className="admin-btn-danger"><Trash2 size={13} /></button>
            </div>
          ))}
          {data.batchPassRates.length === 0 && <p className="admin-field__hint">No batches yet.</p>}
        </div>
      </div>
    </div>
  );
}
