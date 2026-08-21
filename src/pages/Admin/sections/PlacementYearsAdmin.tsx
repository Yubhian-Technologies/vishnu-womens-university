import { useState } from 'react';
import { deleteDoc, doc, serverTimestamp, setDoc } from 'firebase/firestore';
import { db } from '../../../lib/firebase';
import { useCollection, type WithId } from '../../../hooks/useCollection';
import {
  placementYearData,
  type BranchOfferCount,
  type PlacementRow,
  type PlacementYear,
} from '../../Placements/placementStats.data';

type PlacementYearDoc = WithId & PlacementYear;

interface FormState {
  batch: string;
  total: string;
  salaryLabel: string;
  companiesVisited: string;
  note: string;
  rowsText: string;
  branchOffersText: string;
}

const EMPTY: FormState = {
  batch: '', total: '', salaryLabel: 'Salary (₹)', companiesVisited: '', note: '', rowsText: '', branchOffersText: '',
};

function rowsToText(rows: PlacementRow[]): string {
  return rows.map((r) => `${r.company} | ${r.selects} | ${r.salary}`).join('\n');
}
function textToRows(text: string): PlacementRow[] {
  return text.split('\n').map((l) => l.trim()).filter(Boolean).map((line) => {
    const [company = '', selects = '0', salary = ''] = line.split('|').map((p) => p.trim());
    return { company, selects: Number(selects) || 0, salary };
  });
}
function offersToText(offers: BranchOfferCount[]): string {
  return offers.map((o) => o.eligible != null ? `${o.branch} | ${o.offers} | ${o.eligible}` : `${o.branch} | ${o.offers}`).join('\n');
}
function textToOffers(text: string): BranchOfferCount[] {
  return text.split('\n').map((l) => l.trim()).filter(Boolean).map((line) => {
    const [branch = '', offers = '0', eligible] = line.split('|').map((p) => p.trim());
    return { branch, offers: Number(offers) || 0, ...(eligible ? { eligible: Number(eligible) || 0 } : {}) };
  });
}

/**
 * Manages the "Placements, Year by Year" batch data (placementYears
 * collection) that PlacementYearAccordion.tsx renders on both the main
 * Placements page and the Placement Details sub-page. Replaces the old
 * "Placements" admin section, which wrote to a `placements` collection
 * nothing on the public site reads anymore (that Our Recruiters section was
 * removed). Company rows and branch-offer breakdowns are edited as plain
 * pipe-delimited text — one line per row — since a batch can have 100+
 * companies and a one-field-per-row form would be unusable at that size.
 */
export default function PlacementYearsAdmin() {
  const { docs: years, loading } = useCollection<PlacementYearDoc>('placementYears');
  const sortedYears = [...years].sort((a, b) => b.batch.localeCompare(a.batch));

  const [form, setForm] = useState<FormState>(EMPTY);
  const [editing, setEditing] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [seeding, setSeeding] = useState(false);

  const set = (k: keyof FormState, v: string) => setForm((p) => ({ ...p, [k]: v }));

  const save = async () => {
    const batch = form.batch.trim();
    if (!batch) return alert('Batch (e.g. 2025–2026) is required.');
    setSaving(true);
    try {
      await setDoc(doc(db, 'placementYears', batch), {
        batch,
        total: form.total ? Number(form.total) : null,
        salaryLabel: form.salaryLabel.trim(),
        companiesVisited: form.companiesVisited ? Number(form.companiesVisited) : null,
        branchOffers: textToOffers(form.branchOffersText),
        rows: textToRows(form.rowsText),
        note: form.note.trim() || null,
        updatedAt: serverTimestamp(),
      });
      setForm(EMPTY);
      setEditing(null);
    } catch (e) {
      alert(`Couldn't save: ${(e as Error).message}`);
    } finally {
      setSaving(false);
    }
  };

  const startEdit = (y: PlacementYearDoc) => {
    setEditing(y.batch);
    setForm({
      batch: y.batch,
      total: y.total != null ? String(y.total) : '',
      salaryLabel: y.salaryLabel || '',
      companiesVisited: y.companiesVisited != null ? String(y.companiesVisited) : '',
      note: y.note || '',
      rowsText: rowsToText(y.rows || []),
      branchOffersText: offersToText(y.branchOffers || []),
    });
  };

  const remove = async (batchId: string) => {
    if (!confirm(`Delete the ${batchId} batch? This removes all its company and offer data.`)) return;
    try {
      await deleteDoc(doc(db, 'placementYears', batchId));
    } catch (e) {
      alert(`Couldn't delete: ${(e as Error).message}`);
    }
  };

  const seedFromSiteData = async () => {
    if (!confirm(`Load the original ${placementYearData.length} batch years (2003–2007 through 2022–2026) from the site's built-in data? This overwrites any existing entries that share the same batch label.`)) return;
    setSeeding(true);
    try {
      for (const y of placementYearData) {
        await setDoc(doc(db, 'placementYears', y.batch), {
          batch: y.batch,
          total: y.total,
          salaryLabel: y.salaryLabel,
          companiesVisited: y.companiesVisited ?? null,
          branchOffers: y.branchOffers ?? [],
          rows: y.rows,
          note: y.note ?? null,
          updatedAt: serverTimestamp(),
        });
      }
    } catch (e) {
      alert(`Couldn't load site data: ${(e as Error).message}`);
    } finally {
      setSeeding(false);
    }
  };

  return (
    <div className="admin-section">
      <div className="admin-card">
        <h2 className="admin-card__title">{editing ? `Edit ${editing}` : 'Add Placement Year'}</h2>
        <p className="admin-lead" style={{ marginBottom: '1rem' }}>
          Powers the "Placements, Year by Year" accordion on the Placements page and the Placement
          Details sub-page. List each company one per line as <code>Company | Selects | Salary</code>.
        </p>
        <div className="admin-form-grid">
          <div className="admin-field">
            <label>Batch *</label>
            <input value={form.batch} onChange={(e) => set('batch', e.target.value)} placeholder="2025–2026" disabled={!!editing} />
          </div>
          <div className="admin-field">
            <label>Total Placements</label>
            <input type="number" value={form.total} onChange={(e) => set('total', e.target.value)} min={0} />
          </div>
          <div className="admin-field">
            <label>Salary Column Label</label>
            <input value={form.salaryLabel} onChange={(e) => set('salaryLabel', e.target.value)} placeholder="Salary (₹)" />
          </div>
          <div className="admin-field">
            <label>Companies Visited (optional)</label>
            <input type="number" value={form.companiesVisited} onChange={(e) => set('companiesVisited', e.target.value)} min={0} />
          </div>
          <div className="admin-field admin-field--full">
            <label>Note (optional)</label>
            <input value={form.note} onChange={(e) => set('note', e.target.value)} placeholder="Shown in italics above the table, if set" />
          </div>
          <div className="admin-field admin-field--full">
            <label>Branch-wise Offers (optional — one per line, "Branch | Offers | Eligible". Eligible is optional per line — when set, that branch's tile/donut label shows its own placement rate (offers ÷ eligible); when left off, it falls back to that branch's share of the batch total, same as before.)</label>
            <textarea rows={4} value={form.branchOffersText} onChange={(e) => set('branchOffersText', e.target.value)} placeholder={'CSE Offers | 268 | 207\nECE Offers | 97 | 127'} />
          </div>
          <div className="admin-field admin-field--full">
            <label>Company Rows — one per line, "Company | Selects | Salary"</label>
            <textarea rows={14} value={form.rowsText} onChange={(e) => set('rowsText', e.target.value)} placeholder={'Google | 3 | ₹59,14,620\nAdobe | 4 | ₹53,35,000'} />
          </div>
        </div>
        <div className="admin-form-actions">
          {editing && <button className="admin-btn admin-btn--ghost" onClick={() => { setEditing(null); setForm(EMPTY); }}>Cancel</button>}
          <button className="admin-btn admin-btn--primary" onClick={save} disabled={saving}>
            {saving ? 'Saving…' : editing ? 'Update' : 'Add Year'}
          </button>
        </div>
      </div>

      <div className="admin-card">
        <h2 className="admin-card__title">All Batch Years ({sortedYears.length})</h2>
        {loading ? <p className="admin-loading">Loading…</p> : (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead><tr><th>Batch</th><th>Total</th><th>Companies Visited</th><th>Rows</th><th>Actions</th></tr></thead>
              <tbody>
                {sortedYears.map((y) => (
                  <tr key={y.id}>
                    <td>{y.batch}</td>
                    <td>{y.total != null ? y.total.toLocaleString('en-IN') : '—'}</td>
                    <td>{y.companiesVisited ?? '—'}</td>
                    <td>{y.rows?.length ?? 0}</td>
                    <td>
                      <button className="admin-btn admin-btn--sm" onClick={() => startEdit(y)}>Edit</button>
                      <button className="admin-btn admin-btn--sm admin-btn--danger" onClick={() => remove(y.batch)}>Delete</button>
                    </td>
                  </tr>
                ))}
                {sortedYears.length === 0 && (
                  <tr>
                    <td colSpan={5} className="admin-empty">
                      No batch years yet.{' '}
                      <button className="admin-btn admin-btn--sm" onClick={seedFromSiteData} disabled={seeding}>
                        {seeding ? 'Loading…' : 'Load original site data'}
                      </button>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
        {sortedYears.length > 0 && (
          <button className="admin-btn admin-btn--sm admin-btn--ghost" style={{ marginTop: '1rem' }} onClick={seedFromSiteData} disabled={seeding}>
            {seeding ? 'Loading…' : 'Re-load original site data'}
          </button>
        )}
      </div>
    </div>
  );
}
