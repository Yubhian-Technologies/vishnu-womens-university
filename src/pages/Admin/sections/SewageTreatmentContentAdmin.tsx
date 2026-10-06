import { useState, useEffect } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { setDoc } from '../../../lib/auditLog';
import { db } from '../../../lib/firebase';
import { Save, RotateCcw, Droplets } from 'lucide-react';

export interface StatItem { value: string; label: string; }
export interface SpecItem { label: string; value: string; }
export interface ProcessStep { title: string; body: string; }
export interface ImpactSpotlight { tag: string; title: string; desc: string; }

export interface SewageTreatmentContentDoc {
  campusStats: StatItem[]; // fixed 6
  visionHeading: string;
  visionSubtitle: string;
  visionQuote: string;
  visionParagraph1: string; // supports **bold**
  visionParagraph2: string; // supports **bold**
  loopSteps: string[]; // fixed 3 (icon structural)
  dstHeading: string;
  dstSubtitle: string;
  dstParagraph: string; // supports **bold**
  projectFacts: SpecItem[]; // fixed 6 (icon structural)
  methodHeading: string;
  methodSubtitle: string;
  processSteps: ProcessStep[]; // fixed 3 (body supports **bold**)
  impactHeading: string;
  impactSubtitle: string;
  impactSpotlights: ImpactSpotlight[]; // fixed 2 (desc supports **bold**)
  ctaHeading: string;
  ctaParagraph: string;
}

// Mirrors the hardcoded copy SewageTreatment.tsx shipped with before this
// admin editor existed, so the public page renders identically until an
// admin saves a change.
export const DEFAULT_SEWAGE_TREATMENT_CONTENT: SewageTreatmentContentDoc = {
  campusStats: [
    { value: '80', label: 'Acre Campus' },
    { value: '7', label: 'Constituent Institutes' },
    { value: '~17,000', label: 'Students' },
    { value: '~6,000', label: 'Hostel Residents' },
    { value: '~9 Lakh L', label: 'Daily Water Requirement' },
    { value: '~7 Lakh L', label: 'Daily Sewage Generated' },
  ],
  visionHeading: 'Water is a Precious Natural Resource',
  visionSubtitle: 'Pioneering natural resource conservation as an integral part of institutional vision.',
  visionQuote: '“Water is a precious natural resource gifted by God to mankind, and one of the five powerful elements of life creation. A resource this precious needs careful consumption.”',
  visionParagraph1: "Knowing this, Vishnu Women’s University has incorporated **sustainable environmental protection into its Vision Statement**, and the management consistently encourages natural-resource-conservative practices across the campus.",
  visionParagraph2: 'The campus extends across a serene **80 acres**, three kilometres from the outskirts of Bhimavaram town. It houses **7 constituent institutes** with a total strength of about **17,000 students**, of whom around **6,000 stay in the hostels**. Meeting the daily needs of a campus this size requires roughly **9 lakh litres of water per day** — and the sewage generated is correspondingly high, estimated at about **7 lakh litres per day**, all of which would ultimately reach a natural drain without intervention.',
  loopSteps: [
    '9 Lakh Litres Daily Campus Demand',
    '7 Lakh Litres Daily Sewage Channeled',
    '100% Zero Discharge Into Public Drains',
  ],
  dstHeading: 'DST-Funded Treatment Plants',
  dstSubtitle: 'Sanctioned by the Department of Science & Technology to achieve 100% zero-discharge campus operations.',
  dstParagraph: 'To provide an eco-friendly environment and ensure **zero discharge into the drain**, the University — with extended help from the management — applied to the **Department of Science & Technology (DST), New Delhi** to construct a sewage treatment plant for the sewage generated on campus. On a kind perusal of the proposal, DST sanctioned the project, and sewage collected from the various zones of activity across the campus is now channelled through a network of drainages into the treatment plants.',
  projectFacts: [
    { label: 'Plants Commissioned', value: '2 Sewage Treatment Plants' },
    { label: 'Capacity (each)', value: '200 KLD' },
    { label: 'DST Grant Sanctioned', value: 'Rs. 59.866 Lakhs' },
    { label: 'Total Project Cost', value: 'Rs. 170.536 Lakhs' },
    { label: 'Sanctioned With Effect From', value: '28 / 11 / 2014 — for 2 years' },
    { label: 'Treatment Technology', value: 'Improved Moving Bed Bio-film Reactor (MBBR)' },
  ],
  methodHeading: 'MBBR Technology with Probiotics',
  methodSubtitle: 'Integrating bio-film reactors and biological probiotics for high-efficiency effluent purification.',
  processSteps: [
    { title: 'Zonal Sewage Collection', body: 'Sewage collected from hostels, academic blocks, mess facilities, and residential quarters across the 80-acre campus is channelled through an integrated network of underground drainages into the treatment plants.' },
    { title: 'MBBR & Probiotic Dosing', body: 'Treatment is carried out using an **Improved Moving Bed Bio-film Reactor (MBBR)**. The methodology includes the strategic use of **probiotics along with MBBR technology** for bio-degradation of waste water.' },
    { title: 'BIS Standard Analysis', body: 'Samples are collected periodically **before and after treatment** and analysed for various important physio-chemical parameters, with results strictly verified against standards prescribed by the **Bureau of Indian Standards**.' },
  ],
  impactHeading: 'Treated Water, Put Back to Work',
  impactSubtitle: 'Recycling 100% of treated effluent to nourish campus landscaping and public highway greenery.',
  impactSpotlights: [
    { tag: 'ON-CAMPUS IRRIGATION', title: 'Campus Greenery & Botanical Lawns', desc: 'The treated sewage (effluent) is used for gardening purposes across the campus, saving a substantial quantity of fresh water demand and supporting rich greenery development throughout the 80-acre university grounds.' },
    { tag: 'COMMUNITY HIGHWAY ADOPTION', title: '2.5 KM Adopted National Highway Greenery', desc: 'Sri Vishnu Educational Society has long been invested in societal problems. In that spirit, the Society has adopted the maintenance of nearly **2.5 km of the proposed National Highway road** passing in front of the campus — with treated water consumed in the road-partition greenery and other adopted sites.' },
  ],
  ctaHeading: 'Explore More Campus Life Facilities',
  ctaParagraph: 'Discover our central library, hosteller amenities, health care, and sustainability initiatives across VWU.',
};

export const SEWAGE_TREATMENT_CONTENT_COLLECTION = 'settings';
export const SEWAGE_TREATMENT_CONTENT_DOC_ID = 'sewageTreatmentContent';

function TextField({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div className="admin-field" style={{ gridColumn: '1 / -1' }}>
      <label>{label}</label>
      <input type="text" value={value} onChange={(e) => onChange(e.target.value)} className="admin-input" />
    </div>
  );
}

function AreaField({ label, value, onChange, rows = 3 }: { label: string; value: string; onChange: (v: string) => void; rows?: number }) {
  return (
    <div className="admin-field" style={{ gridColumn: '1 / -1' }}>
      <label>{label} (use **text** for bold)</label>
      <textarea value={value} onChange={(e) => onChange(e.target.value)} className="admin-input" rows={rows} style={{ width: '100%', fontFamily: 'inherit', resize: 'vertical' }} />
    </div>
  );
}

export default function SewageTreatmentContentAdmin() {
  const [data, setData] = useState<SewageTreatmentContentDoc>(DEFAULT_SEWAGE_TREATMENT_CONTENT);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    async function loadData() {
      try {
        const snap = await getDoc(doc(db, SEWAGE_TREATMENT_CONTENT_COLLECTION, SEWAGE_TREATMENT_CONTENT_DOC_ID));
        if (snap.exists()) {
          const remote = snap.data() as Partial<SewageTreatmentContentDoc>;
          setData({ ...DEFAULT_SEWAGE_TREATMENT_CONTENT, ...remote });
        }
      } catch (err) {
        console.error('Failed to load Sewage Treatment content:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const set = <K extends keyof SewageTreatmentContentDoc>(k: K, v: SewageTreatmentContentDoc[K]) => setData((p) => ({ ...p, [k]: v }));

  const handleSave = async () => {
    setSaving(true);
    try {
      await setDoc(doc(db, SEWAGE_TREATMENT_CONTENT_COLLECTION, SEWAGE_TREATMENT_CONTENT_DOC_ID), data);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch (err) {
      console.error('Failed to save Sewage Treatment content:', err);
      alert('Failed to save changes. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    if (confirm('Reset all Sewage Treatment copy to original defaults?')) setData(DEFAULT_SEWAGE_TREATMENT_CONTENT);
  };

  if (loading) {
    return <p className="admin-loading">Loading Sewage Treatment Editor...</p>;
  }

  return (
    <div className="admin-section">
      <div className="admin-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '1.25rem', borderBottom: '1px solid #e5e7eb', paddingBottom: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Droplets size={18} color="#c8a03c" />
            <h2 className="admin-card__title" style={{ margin: 0, padding: 0, border: 'none' }}>Sewage Treatment Plants — Copy</h2>
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

        <h3 className="admin-card__title" style={{ fontSize: '0.95rem', marginTop: 0 }}>Campus Stats (6 tiles)</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '0.5rem' }}>
          {data.campusStats.map((s, idx) => (
            <div key={idx} style={{ display: 'flex', gap: '0.4rem', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '0.5rem' }}>
              <input type="text" value={s.value} onChange={(e) => { const next = [...data.campusStats]; next[idx] = { ...next[idx], value: e.target.value }; set('campusStats', next); }} className="admin-input" style={{ width: 90 }} placeholder="Value" />
              <input type="text" value={s.label} onChange={(e) => { const next = [...data.campusStats]; next[idx] = { ...next[idx], label: e.target.value }; set('campusStats', next); }} className="admin-input" style={{ flex: 1 }} placeholder="Label" />
            </div>
          ))}
        </div>

        <h3 className="admin-card__title" style={{ fontSize: '0.95rem', marginTop: '1.25rem' }}>Vision & Water Conservation</h3>
        <div className="admin-form-grid">
          <TextField label="Heading" value={data.visionHeading} onChange={(v) => set('visionHeading', v)} />
          <TextField label="Subtitle" value={data.visionSubtitle} onChange={(v) => set('visionSubtitle', v)} />
          <AreaField label="Quote" value={data.visionQuote} onChange={(v) => set('visionQuote', v)} rows={2} />
          <AreaField label="Paragraph 1" value={data.visionParagraph1} onChange={(v) => set('visionParagraph1', v)} />
          <AreaField label="Paragraph 2" value={data.visionParagraph2} onChange={(v) => set('visionParagraph2', v)} rows={4} />
          <div className="admin-field" style={{ gridColumn: '1 / -1' }}>
            <label>Closed-Loop steps (3, one per line, icons fixed)</label>
            <textarea value={data.loopSteps.join('\n')} onChange={(e) => set('loopSteps', e.target.value.split('\n'))} className="admin-input" rows={3} style={{ width: '100%', fontFamily: 'inherit' }} />
          </div>
        </div>

        <h3 className="admin-card__title" style={{ fontSize: '0.95rem', marginTop: '1.25rem' }}>DST-Funded Treatment Plants</h3>
        <div className="admin-form-grid">
          <TextField label="Heading" value={data.dstHeading} onChange={(v) => set('dstHeading', v)} />
          <TextField label="Subtitle" value={data.dstSubtitle} onChange={(v) => set('dstSubtitle', v)} />
          <AreaField label="Narrative" value={data.dstParagraph} onChange={(v) => set('dstParagraph', v)} rows={4} />
        </div>
        <p className="admin-field__hint" style={{ margin: '0.5rem 0 0.3rem' }}>Project facts (6 tiles, icons fixed)</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '0.5rem' }}>
          {data.projectFacts.map((s, idx) => (
            <div key={idx} style={{ display: 'flex', gap: '0.4rem', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '0.5rem' }}>
              <input type="text" value={s.label} onChange={(e) => { const next = [...data.projectFacts]; next[idx] = { ...next[idx], label: e.target.value }; set('projectFacts', next); }} className="admin-input" style={{ flex: 1 }} placeholder="Label" />
              <input type="text" value={s.value} onChange={(e) => { const next = [...data.projectFacts]; next[idx] = { ...next[idx], value: e.target.value }; set('projectFacts', next); }} className="admin-input" style={{ flex: 1 }} placeholder="Value" />
            </div>
          ))}
        </div>

        <h3 className="admin-card__title" style={{ fontSize: '0.95rem', marginTop: '1.25rem' }}>MBBR Technology Process (3 steps)</h3>
        <div className="admin-form-grid">
          <TextField label="Heading" value={data.methodHeading} onChange={(v) => set('methodHeading', v)} />
          <TextField label="Subtitle" value={data.methodSubtitle} onChange={(v) => set('methodSubtitle', v)} />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '0.4rem' }}>
          {data.processSteps.map((step, idx) => (
            <div key={idx} style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '0.5rem' }}>
              <input type="text" value={step.title} onChange={(e) => { const next = [...data.processSteps]; next[idx] = { ...next[idx], title: e.target.value }; set('processSteps', next); }} className="admin-input" style={{ width: '100%', marginBottom: '0.3rem', fontWeight: 600 }} placeholder="Step title" />
              <textarea value={step.body} onChange={(e) => { const next = [...data.processSteps]; next[idx] = { ...next[idx], body: e.target.value }; set('processSteps', next); }} className="admin-input" rows={2} style={{ width: '100%', fontFamily: 'inherit', resize: 'vertical' }} placeholder="Body (use **text** for bold)" />
            </div>
          ))}
        </div>

        <h3 className="admin-card__title" style={{ fontSize: '0.95rem', marginTop: '1.25rem' }}>Impact & Application (2 spotlights)</h3>
        <div className="admin-form-grid">
          <TextField label="Heading" value={data.impactHeading} onChange={(v) => set('impactHeading', v)} />
          <TextField label="Subtitle" value={data.impactSubtitle} onChange={(v) => set('impactSubtitle', v)} />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '0.4rem' }}>
          {data.impactSpotlights.map((s, idx) => (
            <div key={idx} style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '0.5rem' }}>
              <input type="text" value={s.tag} onChange={(e) => { const next = [...data.impactSpotlights]; next[idx] = { ...next[idx], tag: e.target.value }; set('impactSpotlights', next); }} className="admin-input" style={{ width: '100%', marginBottom: '0.3rem' }} placeholder="Tag" />
              <input type="text" value={s.title} onChange={(e) => { const next = [...data.impactSpotlights]; next[idx] = { ...next[idx], title: e.target.value }; set('impactSpotlights', next); }} className="admin-input" style={{ width: '100%', marginBottom: '0.3rem', fontWeight: 600 }} placeholder="Title" />
              <textarea value={s.desc} onChange={(e) => { const next = [...data.impactSpotlights]; next[idx] = { ...next[idx], desc: e.target.value }; set('impactSpotlights', next); }} className="admin-input" rows={2} style={{ width: '100%', fontFamily: 'inherit', resize: 'vertical' }} placeholder="Description (use **text** for bold)" />
            </div>
          ))}
        </div>

        <h3 className="admin-card__title" style={{ fontSize: '0.95rem', marginTop: '1.25rem' }}>Closing CTA</h3>
        <div className="admin-form-grid">
          <TextField label="Heading" value={data.ctaHeading} onChange={(v) => set('ctaHeading', v)} />
          <TextField label="Paragraph" value={data.ctaParagraph} onChange={(v) => set('ctaParagraph', v)} />
        </div>
      </div>
    </div>
  );
}
