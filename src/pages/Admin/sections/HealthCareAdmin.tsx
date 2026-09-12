import { useEffect, useState } from 'react';
import { collection, addDoc, deleteDoc, doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../../lib/firebase';
import { useOrderedCollection } from '../../../hooks/useCollection';
import type { ContentBlockDoc } from './ContentBlocksAdmin';
import { CONTENT_ICON_NAMES } from '../../../lib/contentIcons';

const PAGE = 'health-care';

export const DEFAULT_HC_PILLS = [
  { title: 'Better', desc: 'Health', icon: 'Heart' },
  { title: 'Stronger', desc: 'Community', icon: 'Users' },
  { title: 'Safe', desc: 'Campus', icon: 'ShieldCheck' },
  { title: 'Quality', desc: 'Care', icon: 'Star' },
];

export const DEFAULT_HC_SERVICES = [
  'General OPD & Medical Consultation',
  'First Aid & Emergency Care',
  'Basic Laboratory & Diagnostic Services',
  'ECG & Vital Monitoring',
  'Inpatient & Sick Bay Facilities',
  'Pharmacy & Essential Medicines',
  'Ambulance Support',
  'Specialist Consultations',
];

export const DEFAULT_HC_FACILITIES = [
  {
    facility: 'Medical OPD',
    location: 'CSSD Block, VDC',
    timings: '8:30 AM – 5:00 PM',
    medicalOfficer: 'Dr. V. Deepika, MBBS',
    nursingStaff: 'Mr. I. Kiran, B.Sc. (N)',
    otherStaff: 'Mr. Ramu Narayana Rao (Lab Tech)',
  },
  {
    facility: 'Sick Bay',
    location: 'Near Medha Hostel',
    timings: '8:30 AM – 6:00 PM',
    medicalOfficer: 'On-Duty Medical Staff',
    nursingStaff: 'Mrs. M. Shanthi, B.Sc. (N)',
    otherStaff: '',
  },
  {
    facility: 'First Aid Centre',
    location: 'Near Warden’s Office',
    timings: '8:30 AM – 6:00 PM',
    medicalOfficer: 'Dr. S. P. Vadana, MD (Physician)',
    nursingStaff: 'Mrs. M. Anitha, GNM',
    otherStaff: '',
  },
  {
    facility: 'Specialist Consultation',
    location: 'OBGY Clinic Desk',
    timings: 'Tuesdays, 5:00 – 6:00 PM',
    medicalOfficer: 'Dr. M. Jagadeeshwari, DNB (OBGY)',
    nursingStaff: 'Obstetrics & Gynecology Specialist Visit',
    otherStaff: '',
  },
];

export const DEFAULT_HC_ABOUT = {
  badge: 'FACILITIES & SCHEDULE',
  title: 'Quality Healthcare, Close to Campus',
  subtitle:
    'Vishnu Women’s University provides accessible and reliable healthcare support to students and staff through dedicated medical facilities across the campus. Services include medical consultation, first aid, basic diagnostics, inpatient care, specialist consultations, pharmacy and emergency support.',
};

function useLoadedState<T>(loading: boolean, computeInitial: () => T) {
  const [state, setState] = useState<T>(computeInitial);
  const [initialized, setInitialized] = useState(false);
  useEffect(() => {
    if (!initialized && !loading) {
      setState(computeInitial());
      setInitialized(true);
    }
  }, [loading, initialized, computeInitial]);
  return [state, setState] as const;
}

export default function HealthCareAdmin() {
  const { docs: allBlocks, loading } = useOrderedCollection<ContentBlockDoc>('contentBlocks', 'order');
  const blocks = allBlocks.filter((b) => b.page === PAGE);
  const pillDocs = blocks.filter((b) => b.section === 'heroPills');
  const aboutDoc = blocks.find((b) => b.section === 'about');
  const servicesDoc = blocks.find((b) => b.section === 'servicesChecklist');
  const facilityDocs = blocks.filter((b) => b.section === 'medicalFacilities');

  const [pills, setPills] = useLoadedState(loading, () =>
    pillDocs.length > 0
      ? pillDocs.map((d) => ({ title: d.title || '', desc: d.desc || '', icon: d.icon || 'Heart' }))
      : DEFAULT_HC_PILLS
  );
  const [pillsSaving, setPillsSaving] = useState(false);

  const [aboutForm, setAboutForm] = useLoadedState(loading, () => ({
    badge: aboutDoc?.value || DEFAULT_HC_ABOUT.badge,
    title: aboutDoc?.title || DEFAULT_HC_ABOUT.title,
    subtitle: aboutDoc?.desc || DEFAULT_HC_ABOUT.subtitle,
  }));
  const [aboutSaving, setAboutSaving] = useState(false);

  const [servicesText, setServicesText] = useLoadedState(loading, () =>
    servicesDoc?.desc || DEFAULT_HC_SERVICES.join('\n')
  );
  const [servicesSaving, setServicesSaving] = useState(false);

  const [facilities, setFacilities] = useLoadedState(loading, () =>
    facilityDocs.length > 0
      ? facilityDocs.map((d) => ({
          facility: d.title || '',
          location: d.slug || '',
          timings: d.value || '',
          medicalOfficer: d.desc || '',
          nursingStaff: d.icon || '',
          otherStaff: d.storagePath || '',
        }))
      : DEFAULT_HC_FACILITIES
  );
  const [facilitiesSaving, setFacilitiesSaving] = useState(false);

  const savePills = async () => {
    setPillsSaving(true);
    try {
      await Promise.all([
        ...pills.map((p, i) => {
          const existing = pillDocs[i];
          const payload = {
            title: p.title,
            desc: p.desc,
            icon: p.icon,
            page: PAGE,
            section: 'heroPills',
            order: i,
          };
          return existing
            ? updateDoc(doc(db, 'contentBlocks', existing.id), payload)
            : addDoc(collection(db, 'contentBlocks'), {
                ...payload,
                value: '',
                slug: '',
                storagePath: '',
                createdAt: serverTimestamp(),
              });
        }),
        ...pillDocs.slice(pills.length).map((d) => deleteDoc(doc(db, 'contentBlocks', d.id))),
      ]);
      alert('Health Care feature pills saved successfully!');
    } catch (e) {
      alert(`Couldn't save: ${(e as Error).message}`);
    } finally {
      setPillsSaving(false);
    }
  };

  const saveAbout = async () => {
    setAboutSaving(true);
    try {
      const fields = {
        value: aboutForm.badge,
        title: aboutForm.title,
        desc: aboutForm.subtitle,
      };
      if (aboutDoc) {
        await updateDoc(doc(db, 'contentBlocks', aboutDoc.id), fields);
      } else {
        await addDoc(collection(db, 'contentBlocks'), {
          page: PAGE,
          section: 'about',
          order: 0,
          ...fields,
          icon: '',
          slug: '',
          storagePath: '',
          createdAt: serverTimestamp(),
        });
      }
      alert('Health Care overview saved successfully!');
    } catch (e) {
      alert(`Couldn't save: ${(e as Error).message}`);
    } finally {
      setAboutSaving(false);
    }
  };

  const saveServices = async () => {
    setServicesSaving(true);
    try {
      if (servicesDoc) {
        await updateDoc(doc(db, 'contentBlocks', servicesDoc.id), { desc: servicesText });
      } else {
        await addDoc(collection(db, 'contentBlocks'), {
          page: PAGE,
          section: 'servicesChecklist',
          title: 'Medical Services Checklist',
          desc: servicesText,
          value: '',
          icon: '',
          slug: '',
          storagePath: '',
          order: 0,
          createdAt: serverTimestamp(),
        });
      }
      alert('Health Care services checklist saved successfully!');
    } catch (e) {
      alert(`Couldn't save: ${(e as Error).message}`);
    } finally {
      setServicesSaving(false);
    }
  };

  const saveFacilities = async () => {
    setFacilitiesSaving(true);
    try {
      await Promise.all([
        ...facilities.map((f, i) => {
          const existing = facilityDocs[i];
          const payload = {
            title: f.facility,
            slug: f.location,
            value: f.timings,
            desc: f.medicalOfficer,
            icon: f.nursingStaff,
            storagePath: f.otherStaff,
            page: PAGE,
            section: 'medicalFacilities',
            order: i,
          };
          return existing
            ? updateDoc(doc(db, 'contentBlocks', existing.id), payload)
            : addDoc(collection(db, 'contentBlocks'), {
                ...payload,
                createdAt: serverTimestamp(),
              });
        }),
        ...facilityDocs.slice(facilities.length).map((d) => deleteDoc(doc(db, 'contentBlocks', d.id))),
      ]);
      alert('Health Care medical facilities & doctors table saved successfully!');
    } catch (e) {
      alert(`Couldn't save: ${(e as Error).message}`);
    } finally {
      setFacilitiesSaving(false);
    }
  };

  return (
    <div className="admin-card">
      <h2 className="admin-card__title">Health Care — Page Content</h2>
      <p className="admin-field__hint">
        Edit hero feature badges, medical services checklist, and on-campus clinic &amp; doctors schedules on{' '}
        <code>/campus/health-care</code>.
      </p>

      {loading ? (
        <p className="admin-loading">Loading…</p>
      ) : (
        <>
          <hr />
          <h3>Hero Feature Pills ({pills.length})</h3>
          <div className="admin-form-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))' }}>
            {pills.map((p, idx) => (
              <div key={idx} style={{ border: '1px solid #e5e7eb', borderRadius: 6, padding: '0.75rem' }}>
                <div className="admin-field">
                  <label>Icon</label>
                  <select
                    value={p.icon}
                    onChange={(e) =>
                      setPills((prev) => prev.map((item, i) => (i === idx ? { ...item, icon: e.target.value } : item)))
                    }
                  >
                    <option value="Heart">Heart</option>
                    <option value="Users">Users</option>
                    <option value="ShieldCheck">ShieldCheck</option>
                    <option value="Star">Star</option>
                    {CONTENT_ICON_NAMES.map((name) => (
                      <option key={name} value={name}>
                        {name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="admin-field">
                  <label>Line 1</label>
                  <input
                    value={p.title}
                    onChange={(e) =>
                      setPills((prev) => prev.map((item, i) => (i === idx ? { ...item, title: e.target.value } : item)))
                    }
                    placeholder="Better"
                  />
                </div>
                <div className="admin-field">
                  <label>Line 2</label>
                  <input
                    value={p.desc}
                    onChange={(e) =>
                      setPills((prev) => prev.map((item, i) => (i === idx ? { ...item, desc: e.target.value } : item)))
                    }
                    placeholder="Health"
                  />
                </div>
              </div>
            ))}
          </div>
          <div className="admin-form-actions">
            <button className="admin-btn admin-btn--primary" onClick={savePills} disabled={pillsSaving}>
              {pillsSaving ? 'Saving…' : 'Save Feature Pills'}
            </button>
          </div>

          <hr />
          <h3>Facilities &amp; Schedule Overview Heading</h3>
          <div className="admin-form-grid">
            <div className="admin-field">
              <label htmlFor="hc-abt-badge">Badge</label>
              <input
                id="hc-abt-badge"
                value={aboutForm.badge}
                onChange={(e) => setAboutForm((p) => ({ ...p, badge: e.target.value }))}
                placeholder="FACILITIES & SCHEDULE"
              />
            </div>
            <div className="admin-field">
              <label htmlFor="hc-abt-title">Section Title</label>
              <input
                id="hc-abt-title"
                value={aboutForm.title}
                onChange={(e) => setAboutForm((p) => ({ ...p, title: e.target.value }))}
                placeholder="Quality Healthcare, Close to Campus"
              />
            </div>
            <div className="admin-field admin-field--full">
              <label htmlFor="hc-abt-desc">Overview Description</label>
              <textarea
                id="hc-abt-desc"
                rows={4}
                value={aboutForm.subtitle}
                onChange={(e) => setAboutForm((p) => ({ ...p, subtitle: e.target.value }))}
              />
            </div>
          </div>
          <div className="admin-form-actions">
            <button className="admin-btn admin-btn--primary" onClick={saveAbout} disabled={aboutSaving}>
              {aboutSaving ? 'Saving…' : 'Save Overview Heading'}
            </button>
          </div>

          <hr />
          <h3>Medical Services Checklist</h3>
          <p className="admin-field__hint">Enter one medical service item per line.</p>
          <div className="admin-field admin-field--full">
            <textarea
              rows={6}
              value={servicesText}
              onChange={(e) => setServicesText(e.target.value)}
              placeholder="General OPD & Medical Consultation..."
            />
          </div>
          <div className="admin-form-actions">
            <button className="admin-btn admin-btn--primary" onClick={saveServices} disabled={servicesSaving}>
              {servicesSaving ? 'Saving…' : 'Save Services Checklist'}
            </button>
          </div>

          <hr />
          <h3>On-Campus Medical Facilities Table ({facilities.length})</h3>
          {facilities.map((f, idx) => (
            <div
              key={idx}
              className="admin-form-grid"
              style={{
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr)) auto',
                alignItems: 'end',
                marginBottom: '1rem',
                border: '1px solid #e5e7eb',
                borderRadius: '6px',
                padding: '0.85rem',
                background: '#fafafa',
              }}
            >
              <div className="admin-field">
                <label>Facility Name</label>
                <input
                  value={f.facility}
                  onChange={(e) =>
                    setFacilities((prev) =>
                      prev.map((item, i) => (i === idx ? { ...item, facility: e.target.value } : item))
                    )
                  }
                  placeholder="Medical OPD"
                />
              </div>
              <div className="admin-field">
                <label>Location</label>
                <input
                  value={f.location}
                  onChange={(e) =>
                    setFacilities((prev) =>
                      prev.map((item, i) => (i === idx ? { ...item, location: e.target.value } : item))
                    )
                  }
                  placeholder="CSSD Block, VDC"
                />
              </div>
              <div className="admin-field">
                <label>Timings</label>
                <input
                  value={f.timings}
                  onChange={(e) =>
                    setFacilities((prev) =>
                      prev.map((item, i) => (i === idx ? { ...item, timings: e.target.value } : item))
                    )
                  }
                  placeholder="8:30 AM – 5:00 PM"
                />
              </div>
              <div className="admin-field">
                <label>Medical Officer / Doctor</label>
                <input
                  value={f.medicalOfficer}
                  onChange={(e) =>
                    setFacilities((prev) =>
                      prev.map((item, i) => (i === idx ? { ...item, medicalOfficer: e.target.value } : item))
                    )
                  }
                  placeholder="Dr. V. Deepika, MBBS"
                />
              </div>
              <div className="admin-field">
                <label>Nursing Staff</label>
                <input
                  value={f.nursingStaff}
                  onChange={(e) =>
                    setFacilities((prev) =>
                      prev.map((item, i) => (i === idx ? { ...item, nursingStaff: e.target.value } : item))
                    )
                  }
                  placeholder="Mr. I. Kiran, B.Sc. (N)"
                />
              </div>
              <div className="admin-field">
                <label>Other Staff (optional)</label>
                <input
                  value={f.otherStaff}
                  onChange={(e) =>
                    setFacilities((prev) =>
                      prev.map((item, i) => (i === idx ? { ...item, otherStaff: e.target.value } : item))
                    )
                  }
                  placeholder="Lab Tech / Support Staff"
                />
              </div>
              <button
                type="button"
                className="admin-btn admin-btn--sm admin-btn--danger"
                style={{ height: '38px', marginBottom: '0.5rem' }}
                onClick={() => setFacilities((prev) => prev.filter((_, i) => i !== idx))}
              >
                Remove
              </button>
            </div>
          ))}
          <div style={{ marginTop: '0.5rem', marginBottom: '1rem' }}>
            <button
              type="button"
              className="admin-btn admin-btn--sm"
              onClick={() =>
                setFacilities((prev) => [
                  ...prev,
                  {
                    facility: 'Clinic Centre',
                    location: 'Campus Block',
                    timings: '9:00 AM – 5:00 PM',
                    medicalOfficer: 'Doctor on duty',
                    nursingStaff: 'Nursing Staff',
                    otherStaff: '',
                  },
                ])
              }
            >
              + Add Facility Row
            </button>
          </div>
          <div className="admin-form-actions">
            <button className="admin-btn admin-btn--primary" onClick={saveFacilities} disabled={facilitiesSaving}>
              {facilitiesSaving ? 'Saving…' : 'Save Facilities Table'}
            </button>
          </div>
        </>
      )}
    </div>
  );
}
