import { useState, useEffect } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { setDoc } from '../../../lib/auditLog';
import { db } from '../../../lib/firebase';
import { Save, RotateCcw, ScrollText } from 'lucide-react';

export interface UGCDisclosureItemCopy {
  label: string;
  status: string;
}

export interface UGCDisclosureSectionCopy {
  title: string;
  items: UGCDisclosureItemCopy[];
}

export interface UGCDisclosureContentDoc {
  intro: string;
  sections: UGCDisclosureSectionCopy[];
}

// Mirrors the hardcoded `sections` checklist UGCDisclosure.tsx shipped with
// before this admin editor existed -- same section/item order, label, and
// status text, so the public page renders identically until an admin saves
// a change. The Link for each item (which real page it points to) stays
// structural/code-only, since these are wired to actual app routes and a
// couple already resolve dynamically via Compliance Documents -- only the
// item label and status/availability text are editable here.
export const DEFAULT_UGC_DISCLOSURE_CONTENT: UGCDisclosureContentDoc = {
  intro: 'We hereby give an undertaking that all the Regulations notified by the University Grants Commission, New Delhi, will be followed in letter and spirit by Shri Vishnu Engineering College for Women (Autonomous), Bhimavaram, West Godavari District, Andhra Pradesh, from time to time.',
  sections: [
    {
      title: 'a) About HEI',
      items: [
        { label: 'About us: Overview', status: 'Available' },
        { label: 'Act and Statutes or MoA', status: 'Not Applicable' },
        { label: 'Institutional Development Plan', status: 'Available' },
        { label: 'Constituent Units / Affiliated Colleges, Affiliating University (in case of Colleges), Off-campus / Off-shore campus / Learning Support Centres under ODL mode (wherever applicable)', status: 'UGC Approved Private State University' },
        { label: 'Accreditation / Ranking status (NAAC, NBA, NIRF)', status: 'Available' },
        { label: 'Recognition / Approval (2(f), 12B, etc. as applicable)', status: 'Available' },
        { label: 'Annual Reports', status: 'Available' },
        { label: 'Annual Accounts including Balance Sheet, Income and Expenditure Account, Receipts and Payments Account along with Audit Report', status: 'Available' },
        { label: 'Sponsoring body details, if any', status: 'Sri Vishnu Educational Society' },
      ],
    },
    {
      title: 'b) Administration (Profiles with photographs and contact details)',
      items: [
        { label: 'Chancellor', status: 'Sri K. V. Vishnu Raju' },
        { label: 'Pro Chancellor', status: 'Sri Ravichandran Rajagopal' },
        { label: 'Vice-Chancellor', status: 'Sri K. Aditya Vissam' },
        { label: 'Pro-Vice-Chancellor (wherever applicable)', status: 'Sri K. Sai Sumant' },
        { label: 'Registrar', status: 'Not Applicable' },
        { label: 'Principal', status: 'Dr. G. Srinivasa Rao' },
        { label: 'Finance Officer', status: 'Mr. SSS Varma' },
        { label: 'Controller of Examination', status: 'Dr. K. S. N. Raju' },
        { label: 'Chief Vigilance Officer', status: 'Mr. P. Venkata Rama Raju, Vice Principal' },
        { label: 'Ombudsperson', status: 'Justice B. V. Ranga Raju, JNTUK Ombudsman' },
        { label: 'Executive Council / Board of Governors (by whatever name called), Board of Management, Academic Council, Board of Studies, Finance Committee — composition and members with particulars', status: 'Available' },
        { label: 'Internal Complaint Committee', status: 'Available' },
        { label: 'Academic Leadership (Dean / HoD of Schools / Departments / Centres)', status: 'HoD information published on each department page' },
      ],
    },
    {
      title: 'c) Academics',
      items: [
        { label: 'Details of Academic Programs', status: 'Available' },
        { label: 'Academic Calendar', status: 'Available' },
        { label: 'Statutes / Ordinances pertaining to Academics / Examinations', status: 'Available' },
        { label: 'Schools / Departments / Centres', status: 'Available' },
        { label: 'Department / School / Centre wise faculty / staff details with photographs', status: 'Available' },
        { label: 'List of UGC-recognized ODL / Online programs, if any', status: 'No' },
        { label: 'Internal Quality Assurance Cell (IQAC)', status: 'Available' },
        { label: 'Library', status: 'Available' },
        { label: 'Academic collaborations', status: 'Available' },
      ],
    },
    {
      title: 'd) Admissions & Fee',
      items: [
        { label: 'Prospectus (including fee structure for various programs)', status: 'Available' },
        { label: 'Admission process and guidelines', status: 'Available' },
        { label: 'Fee refund policy', status: 'As per Andhra Pradesh State Govt. Norms' },
      ],
    },
    {
      title: 'e) Research',
      items: [
        { label: 'Research and Development Cell (including Research and Consultancy Projects, Foreign Collaboration)', status: 'Available' },
        { label: 'Industry Collaborations / Incubation Centre / Start-ups / Entrepreneurship Cell', status: 'Available' },
        { label: 'Central facilities', status: 'Published under Differentiators' },
      ],
    },
    {
      title: 'f) Student Life',
      items: [
        { label: 'Sports facilities', status: 'Available' },
        { label: 'NCC / NSS — Details', status: 'Available' },
        { label: 'Hostel details (wherever applicable)', status: 'Available' },
        { label: 'Placement Cell and its activities', status: 'Available' },
        { label: 'Details of Student Grievance Redressal Committee (SGRC) and Ombudsperson', status: 'Available' },
        { label: 'Health facilities', status: 'Available' },
        { label: 'Internal Complaint Committee', status: 'Available' },
        { label: 'Anti-Ragging Cell', status: 'Available' },
        { label: 'Equal Opportunity Cell', status: 'Available' },
        { label: 'Socio-Economically Disadvantaged Groups Cell (SEDG)', status: 'Available' },
        { label: 'Facilities for differently-abled (e.g. barrier-free environment)', status: 'Available' },
      ],
    },
    {
      title: 'g) Alumni',
      items: [
        { label: 'Alumni Association with details', status: 'Available' },
      ],
    },
    {
      title: 'h) Information Corner',
      items: [
        { label: 'RTI: Details of Central Public Information Officer (CPIO) and Appellate Authority (wherever applicable)', status: 'Available' },
        { label: 'Circulars and Notices', status: 'Available in Flash News on the Home Page' },
        { label: 'Announcements', status: 'Available under "Latest happenings" on the Home Page' },
        { label: 'Newsletters', status: 'Available' },
        { label: 'News, Recent events & Achievements', status: 'Available' },
        { label: 'Job openings', status: 'Available' },
        { label: 'Reservation Roster (wherever applicable)', status: 'Admission details sent to APSCHE' },
        { label: 'Study in India', status: 'Not Applicable' },
        { label: 'Admission procedure and facilities provided to International Students', status: 'Available' },
      ],
    },
    {
      title: 'i) Picture Gallery',
      items: [
        { label: 'Photographs of all events', status: 'Available' },
      ],
    },
    {
      title: 'j) Contact Us',
      items: [
        { label: 'Details with Phone Number, Official Email ID and Address, Location map', status: 'Available' },
        { label: 'Telephone Directory', status: 'Available' },
      ],
    },
  ],
};

export const UGC_DISCLOSURE_CONTENT_COLLECTION = 'settings';
export const UGC_DISCLOSURE_CONTENT_DOC_ID = 'ugcDisclosureContent';

export default function UGCDisclosureContentAdmin() {
  const [data, setData] = useState<UGCDisclosureContentDoc>(DEFAULT_UGC_DISCLOSURE_CONTENT);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [openSection, setOpenSection] = useState<number | null>(0);

  useEffect(() => {
    async function loadData() {
      try {
        const snap = await getDoc(doc(db, UGC_DISCLOSURE_CONTENT_COLLECTION, UGC_DISCLOSURE_CONTENT_DOC_ID));
        if (snap.exists()) {
          const remote = snap.data() as Partial<UGCDisclosureContentDoc>;
          setData({
            intro: remote.intro || DEFAULT_UGC_DISCLOSURE_CONTENT.intro,
            sections: remote.sections?.length === DEFAULT_UGC_DISCLOSURE_CONTENT.sections.length ? remote.sections : DEFAULT_UGC_DISCLOSURE_CONTENT.sections,
          });
        }
      } catch (err) {
        console.error('Failed to load UGC Disclosure content:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const updateItem = (sIdx: number, iIdx: number, patch: Partial<UGCDisclosureItemCopy>) => {
    const sections = data.sections.map((s, si) => si !== sIdx ? s : {
      ...s,
      items: s.items.map((it, ii) => ii !== iIdx ? it : { ...it, ...patch }),
    });
    setData({ ...data, sections });
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await setDoc(doc(db, UGC_DISCLOSURE_CONTENT_COLLECTION, UGC_DISCLOSURE_CONTENT_DOC_ID), data);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch (err) {
      console.error('Failed to save UGC Disclosure content:', err);
      alert('Failed to save changes. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    if (confirm('Reset the entire disclosure checklist to original defaults?')) setData(DEFAULT_UGC_DISCLOSURE_CONTENT);
  };

  if (loading) {
    return <p className="admin-loading">Loading UGC Disclosure Editor...</p>;
  }

  return (
    <div className="admin-section">
      <div className="admin-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '1.25rem', borderBottom: '1px solid #e5e7eb', paddingBottom: '1rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <ScrollText size={18} color="#c8a03c" />
              <h2 className="admin-card__title" style={{ margin: 0, padding: 0, border: 'none' }}>UGC Public Self-Disclosure Checklist</h2>
            </div>
            <p className="admin-field__hint" style={{ margin: '0.35rem 0 0' }}>
              Edit each item's label and availability/status text. The "Link" column (which page each row
              points to) is fixed and isn't editable here — several already resolve their PDF automatically
              from Compliance Documents.
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

        <div className="admin-field" style={{ marginBottom: '1.25rem' }}>
          <label>Undertaking Paragraph</label>
          <textarea value={data.intro} onChange={(e) => setData({ ...data, intro: e.target.value })} className="admin-input" rows={3} style={{ width: '100%', fontFamily: 'inherit' }} />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {data.sections.map((section, sIdx) => {
            const isOpen = openSection === sIdx;
            return (
              <div key={section.title} style={{ border: '1px solid #e2e8f0', borderRadius: '8px', overflow: 'hidden' }}>
                <button
                  type="button"
                  onClick={() => setOpenSection(isOpen ? null : sIdx)}
                  style={{ width: '100%', textAlign: 'left', padding: '0.6rem 0.9rem', background: '#f8fafc', border: 'none', fontWeight: 600, cursor: 'pointer', display: 'flex', justifyContent: 'space-between' }}
                >
                  <span>{section.title}</span>
                  <span style={{ color: 'var(--color-text-light, #9ca3af)' }}>{section.items.length} items {isOpen ? '▲' : '▼'}</span>
                </button>
                {isOpen && (
                  <div style={{ padding: '0.7rem 0.9rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    {section.items.map((item, iIdx) => (
                      <div key={iIdx} style={{ display: 'grid', gridTemplateColumns: '1.3fr 1fr', gap: '0.5rem' }}>
                        <textarea value={item.label} onChange={(e) => updateItem(sIdx, iIdx, { label: e.target.value })} className="admin-input" rows={2} style={{ fontFamily: 'inherit', resize: 'vertical' }} />
                        <textarea value={item.status} onChange={(e) => updateItem(sIdx, iIdx, { status: e.target.value })} className="admin-input" rows={2} style={{ fontFamily: 'inherit', resize: 'vertical' }} />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
