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
import TableImportButton from '../../../components/TableImportButton/TableImportButton';

type PlacementYearDoc = WithId & PlacementYear;

interface FormState {
  batch: string;
  total: string;
  salaryLabel: string;
  companiesVisited: string;
  note: string;
  rowsText: string;
  branchOffersText: string;
  averageSalaryLPA: string;
  medianSalaryLPA: string;
  highestPackageLPA: string;
  offersAbove50LPA: string;
  offersAbove30LPA: string;
  offersAbove10LPA: string;
}

const EMPTY: FormState = {
  batch: '', total: '', salaryLabel: 'CTC (LPA)', companiesVisited: '', note: '', rowsText: '', branchOffersText: '',
  averageSalaryLPA: '', medianSalaryLPA: '', highestPackageLPA: '', offersAbove50LPA: '', offersAbove30LPA: '', offersAbove10LPA: '',
};

function rowsToText(rows: PlacementRow[]): string {
  return rows.map((r) => r.sector ? `${r.company} | ${r.selects} | ${r.salary} | ${r.sector}` : `${r.company} | ${r.selects} | ${r.salary}`).join('\n');
}
function textToRows(text: string): PlacementRow[] {
  return text.split('\n').map((l) => l.trim()).filter(Boolean).map((line) => {
    const [company = '', selects = '0', salary = '', sector] = line.split('|').map((p) => p.trim());
    return { company, selects: Number(selects) || 0, salary, ...(sector ? { sector } : {}) };
  });
}
// Catches the #1 way this textarea silently corrupts data: a line typed
// with spaces instead of "|" separators. Without this check, textToRows
// happily accepts a line with no pipes at all — the whole line becomes the
// company name, selects defaults to 0, and CTC/sector are silently dropped
// (each field just shifts left by one for every missing pipe). Requiring at
// least 2 pipes (3 fields: company | selects | CTC) turns that into an
// up-front alert naming the bad line instead of a garbled row nobody
// notices until the public page renders it wrong.
function findMalformedRowLine(text: string): { lineNumber: number; content: string } | null {
  const lines = text.split('\n');
  for (let i = 0; i < lines.length; i++) {
    const trimmed = lines[i].trim();
    if (!trimmed) continue;
    if (trimmed.split('|').length < 3) return { lineNumber: i + 1, content: trimmed };
  }
  return null;
}

function offersToText(offers: BranchOfferCount[]): string {
  return offers.map((o) => o.highestLPA != null ? `${o.branch} | ${o.offers} | ${o.highestLPA}` : `${o.branch} | ${o.offers}`).join('\n');
}
function textToOffers(text: string): BranchOfferCount[] {
  return text.split('\n').map((l) => l.trim()).filter(Boolean).map((line) => {
    const [branch = '', offers = '0', highestLPA] = line.split('|').map((p) => p.trim());
    return { branch, offers: Number(offers) || 0, ...(highestLPA ? { highestLPA: Number(highestLPA) || 0 } : {}) };
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
    const badRow = findMalformedRowLine(form.rowsText);
    if (badRow) {
      return alert(
        `Line ${badRow.lineNumber} of Company Rows is missing its "|" separators, so it can't be split into Company / Selects / CTC:\n\n"${badRow.content}"\n\nFix that line (use "|" between each value, e.g. "Company | 4 | 53.35 | IT Sector") and save again. Nothing was saved.`
      );
    }
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
        averageSalaryLPA: form.averageSalaryLPA ? Number(form.averageSalaryLPA) : null,
        medianSalaryLPA: form.medianSalaryLPA ? Number(form.medianSalaryLPA) : null,
        highestPackageLPA: form.highestPackageLPA ? Number(form.highestPackageLPA) : null,
        offersAbove50LPA: form.offersAbove50LPA ? Number(form.offersAbove50LPA) : null,
        offersAbove30LPA: form.offersAbove30LPA ? Number(form.offersAbove30LPA) : null,
        offersAbove10LPA: form.offersAbove10LPA ? Number(form.offersAbove10LPA) : null,
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
      averageSalaryLPA: y.averageSalaryLPA != null ? String(y.averageSalaryLPA) : '',
      medianSalaryLPA: y.medianSalaryLPA != null ? String(y.medianSalaryLPA) : '',
      highestPackageLPA: y.highestPackageLPA != null ? String(y.highestPackageLPA) : '',
      offersAbove50LPA: y.offersAbove50LPA != null ? String(y.offersAbove50LPA) : '',
      offersAbove30LPA: y.offersAbove30LPA != null ? String(y.offersAbove30LPA) : '',
      offersAbove10LPA: y.offersAbove10LPA != null ? String(y.offersAbove10LPA) : '',
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
          averageSalaryLPA: y.averageSalaryLPA ?? null,
          medianSalaryLPA: y.medianSalaryLPA ?? null,
          highestPackageLPA: y.highestPackageLPA ?? null,
          offersAbove50LPA: y.offersAbove50LPA ?? null,
          offersAbove30LPA: y.offersAbove30LPA ?? null,
          offersAbove10LPA: y.offersAbove10LPA ?? null,
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
          Details sub-page. List each company one per line as <code>Company | Selects | CTC</code> (add a 4th <code>| Sector</code> if you want a Sector column).
        </p>
        <div className="admin-form-grid">
          <div className="admin-field">
            <label htmlFor="field-batch">Batch *</label>
            <input id="field-batch" value={form.batch} onChange={(e) => set('batch', e.target.value)} placeholder="2025–2026" disabled={!!editing} />
          </div>
          <div className="admin-field">
            <label htmlFor="field-total-placements">Total Placements</label>
            <input id="field-total-placements" type="number" value={form.total} onChange={(e) => set('total', e.target.value)} min={0} />
          </div>
          <div className="admin-field">
            <label htmlFor="field-salary-column-label">CTC Column Label</label>
            <input id="field-salary-column-label" value={form.salaryLabel} onChange={(e) => set('salaryLabel', e.target.value)} placeholder="CTC (LPA)" />
          </div>
          <div className="admin-field">
            <label htmlFor="field-companies-visited-optional">Companies Visited (optional)</label>
            <input id="field-companies-visited-optional" type="number" value={form.companiesVisited} onChange={(e) => set('companiesVisited', e.target.value)} min={0} />
          </div>
          <div className="admin-field">
            <label htmlFor="field-average-salary-lpa">Average Salary — LPA (optional)</label>
            <input id="field-average-salary-lpa" type="number" step="0.01" value={form.averageSalaryLPA} onChange={(e) => set('averageSalaryLPA', e.target.value)} min={0} placeholder="8.3" />
          </div>
          <div className="admin-field">
            <label htmlFor="field-median-salary-lpa">Median Salary — LPA (optional)</label>
            <input id="field-median-salary-lpa" type="number" step="0.01" value={form.medianSalaryLPA} onChange={(e) => set('medianSalaryLPA', e.target.value)} min={0} placeholder="5.5" />
          </div>
          <div className="admin-field">
            <label htmlFor="field-highest-package-lpa">Highest Package — LPA (optional)</label>
            <input id="field-highest-package-lpa" type="number" step="0.01" value={form.highestPackageLPA} onChange={(e) => set('highestPackageLPA', e.target.value)} min={0} placeholder="59.28" />
          </div>
          <div className="admin-field">
            <label htmlFor="field-offers-above-50-lpa">Offers Above 50 LPA (optional)</label>
            <input id="field-offers-above-50-lpa" type="number" value={form.offersAbove50LPA} onChange={(e) => set('offersAbove50LPA', e.target.value)} min={0} placeholder="9" />
          </div>
          <div className="admin-field">
            <label htmlFor="field-offers-above-30-lpa">Offers Above 30 LPA (optional)</label>
            <input id="field-offers-above-30-lpa" type="number" value={form.offersAbove30LPA} onChange={(e) => set('offersAbove30LPA', e.target.value)} min={0} placeholder="43" />
          </div>
          <div className="admin-field">
            <label htmlFor="field-offers-above-10-lpa">Offers Above 10 LPA (optional)</label>
            <input id="field-offers-above-10-lpa" type="number" value={form.offersAbove10LPA} onChange={(e) => set('offersAbove10LPA', e.target.value)} min={0} placeholder="93" />
          </div>
          <div className="admin-field admin-field--full">
            <label htmlFor="field-note-optional">Note (optional)</label>
            <input id="field-note-optional" value={form.note} onChange={(e) => set('note', e.target.value)} placeholder="Shown in italics above the table, if set" />
          </div>
          <div className="admin-field admin-field--full">
            <label htmlFor="field-branch-wise-offers-optional-one">Department-wise Offers (optional — one per line, "Department | Offers | Highest LPA". Highest LPA is optional per line — when set, that department's tile/donut also shows its highest package.)</label>
            <textarea id="field-branch-wise-offers-optional-one" rows={4} value={form.branchOffersText} onChange={(e) => set('branchOffersText', e.target.value)} placeholder={'CSE Offers | 268 | 46.38\nECE Offers | 97 | 32.02'} />
            <div style={{ marginTop: '0.4rem' }}>
              <TableImportButton onImport={(text) => set('branchOffersText', text)} label="Import Branch Offers from Excel/CSV" />
            </div>
          </div>
          <div className="admin-field admin-field--full">
            <label htmlFor="field-company-rows-one-per-line">Company Rows — one per line, "Company | Selects | CTC | Sector". Sector is optional per line — when at least one row has it, the table shows a Sector column.</label>
            <textarea id="field-company-rows-one-per-line" rows={14} value={form.rowsText} onChange={(e) => set('rowsText', e.target.value)} placeholder={'Google | 3 | 59.15 | IT Sector\nAdobe | 4 | 53.35 | IT Sector'} />
            <div style={{ marginTop: '0.4rem' }}>
              <TableImportButton onImport={(text) => set('rowsText', text)} label="Import Company Rows from Excel/CSV" />
            </div>
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
