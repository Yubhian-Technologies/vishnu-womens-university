import { useEffect, useState } from 'react';
import { collection, addDoc, deleteDoc, doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../../lib/firebase';
import { useOrderedCollection } from '../../../hooks/useCollection';
import type { ContentBlockDoc } from './ContentBlocksAdmin';
import { CONTENT_ICON_NAMES } from '../../../lib/contentIcons';

const PAGE = 'travel-desk';

export const DEFAULT_TRAVEL_CONTACTS = {
  location: 'Opposite Central Square',
  locationSub: 'Adjacent to ICICI ATM',
  timings: '4:00 PM – 7:00 PM',
  timingsSub: 'Daily & Sunday Hours',
  phone: '9624 123 123',
  email: 'support@ushodayaholidays.in',
  partner: 'Ushodaya Holidays',
};

export const DEFAULT_TRAVEL_ABOUT = {
  badge: 'CONVENIENT SERVICES',
  title: 'About the Travel Desk',
  subtitle: 'Designed to simplify travel and documentation needs for students, faculty, and staff.',
  paragraph1: 'A dedicated Travel Desk is now available on campus, conveniently located opposite Central Square and adjacent to the ICICI ATM. It offers a wide range of services including ticket bookings (bus, train, air), passport and visa assistance, holiday packages, hotel bookings, attestation services, and overseas education guidance.',
  paragraph2: 'This facility is designed to simplify travel and documentation needs for students, faculty, and staff, ensuring safe, hassle-free journey planning without needing to leave the campus.',
  timingMonSat: '4:00 PM to 7:00 PM',
  timingSun: '11:00 AM to 7:00 PM',
};

export const DEFAULT_TRAVEL_SERVICES = [
  {
    icon: 'Ticket',
    title: 'Ticket Bookings',
    desc: 'Hassle-free reservations for Bus, Train, and Flight tickets for local and outstation journeys.',
  },
  {
    icon: 'Globe',
    title: 'Passport & Visa Assistance',
    desc: 'Complete documentation support and guidance for new passport applications and visa processing.',
  },
  {
    icon: 'Compass',
    title: 'Holiday Packages',
    desc: 'Customized vacation and holiday packages designed for individuals, families, and student groups.',
  },
  {
    icon: 'Building',
    title: 'Hotel Bookings',
    desc: 'Verified hotel reservations and budget-friendly stay arrangements across major destinations.',
  },
  {
    icon: 'FileCheck',
    title: 'Attestation Services',
    desc: 'Professional document verification and attestation support for official travel requirements.',
  },
  {
    icon: 'GraduationCap',
    title: 'Overseas Education Guidance',
    desc: 'Expert guidance for international travel, university visits, and overseas education procedures.',
  },
];

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

export default function TravelDeskAdmin() {
  const { docs: allBlocks, loading } = useOrderedCollection<ContentBlockDoc>('contentBlocks', 'order');
  const blocks = allBlocks.filter((b) => b.page === PAGE);
  const contactsDoc = blocks.find((b) => b.section === 'contacts');
  const aboutDoc = blocks.find((b) => b.section === 'about');
  const serviceDocs = blocks.filter((b) => b.section === 'services');

  const [contactsForm, setContactsForm] = useLoadedState(loading, () => {
    const parts = (contactsDoc?.storagePath || '').split(';;');
    return {
      location: contactsDoc?.title || DEFAULT_TRAVEL_CONTACTS.location,
      locationSub: contactsDoc?.slug || DEFAULT_TRAVEL_CONTACTS.locationSub,
      timings: contactsDoc?.value || DEFAULT_TRAVEL_CONTACTS.timings,
      timingsSub: contactsDoc?.desc || DEFAULT_TRAVEL_CONTACTS.timingsSub,
      phone: contactsDoc?.icon || DEFAULT_TRAVEL_CONTACTS.phone,
      email: parts[0] || DEFAULT_TRAVEL_CONTACTS.email,
      partner: parts[1] || DEFAULT_TRAVEL_CONTACTS.partner,
    };
  });
  const [contactsSaving, setContactsSaving] = useState(false);

  const [aboutForm, setAboutForm] = useLoadedState(loading, () => ({
    badge: aboutDoc?.value || DEFAULT_TRAVEL_ABOUT.badge,
    title: aboutDoc?.title || DEFAULT_TRAVEL_ABOUT.title,
    subtitle: aboutDoc?.slug || DEFAULT_TRAVEL_ABOUT.subtitle,
    paragraph1: (aboutDoc?.desc || '').split('\n\n')[0] || DEFAULT_TRAVEL_ABOUT.paragraph1,
    paragraph2: (aboutDoc?.desc || '').split('\n\n')[1] || DEFAULT_TRAVEL_ABOUT.paragraph2,
    timingMonSat: aboutDoc?.icon || DEFAULT_TRAVEL_ABOUT.timingMonSat,
    timingSun: aboutDoc?.storagePath || DEFAULT_TRAVEL_ABOUT.timingSun,
  }));
  const [aboutSaving, setAboutSaving] = useState(false);

  const [services, setServices] = useLoadedState(loading, () =>
    serviceDocs.length > 0
      ? serviceDocs.map((d) => ({ icon: d.icon || 'Ticket', title: d.title, desc: d.desc }))
      : DEFAULT_TRAVEL_SERVICES
  );
  const [servicesSaving, setServicesSaving] = useState(false);

  const saveContacts = async () => {
    setContactsSaving(true);
    try {
      const fields = {
        title: contactsForm.location,
        slug: contactsForm.locationSub,
        value: contactsForm.timings,
        desc: contactsForm.timingsSub,
        icon: contactsForm.phone,
        storagePath: `${contactsForm.email.trim()};;${contactsForm.partner.trim()}`,
      };
      if (contactsDoc) {
        await updateDoc(doc(db, 'contentBlocks', contactsDoc.id), fields);
      } else {
        await addDoc(collection(db, 'contentBlocks'), {
          page: PAGE,
          section: 'contacts',
          order: 0,
          ...fields,
          createdAt: serverTimestamp(),
        });
      }
      alert('Travel Desk contact & timings saved successfully!');
    } catch (e) {
      alert(`Couldn't save: ${(e as Error).message}`);
    } finally {
      setContactsSaving(false);
    }
  };

  const saveAbout = async () => {
    setAboutSaving(true);
    try {
      const fullDesc = `${aboutForm.paragraph1.trim()}\n\n${aboutForm.paragraph2.trim()}`;
      const fields = {
        value: aboutForm.badge,
        title: aboutForm.title,
        slug: aboutForm.subtitle,
        desc: fullDesc,
        icon: aboutForm.timingMonSat,
        storagePath: aboutForm.timingSun,
      };
      if (aboutDoc) {
        await updateDoc(doc(db, 'contentBlocks', aboutDoc.id), fields);
      } else {
        await addDoc(collection(db, 'contentBlocks'), {
          page: PAGE,
          section: 'about',
          order: 0,
          ...fields,
          createdAt: serverTimestamp(),
        });
      }
      alert('Travel Desk about text saved successfully!');
    } catch (e) {
      alert(`Couldn't save: ${(e as Error).message}`);
    } finally {
      setAboutSaving(false);
    }
  };

  const saveServices = async () => {
    setServicesSaving(true);
    try {
      await Promise.all([
        ...services.map((s, i) => {
          const existing = serviceDocs[i];
          const payload = {
            title: s.title,
            desc: s.desc,
            icon: s.icon,
            page: PAGE,
            section: 'services',
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
        ...serviceDocs.slice(services.length).map((d) => deleteDoc(doc(db, 'contentBlocks', d.id))),
      ]);
      alert('Travel Desk services saved successfully!');
    } catch (e) {
      alert(`Couldn't save: ${(e as Error).message}`);
    } finally {
      setServicesSaving(false);
    }
  };

  return (
    <div className="admin-card">
      <h2 className="admin-card__title">Travel Desk — Page Content</h2>
      <p className="admin-field__hint">
        Edit the on-campus Travel Desk helpline, working hours, about paragraphs, and services list displayed on{' '}
        <code>/campus/travel-desk</code>.
      </p>

      {loading ? (
        <p className="admin-loading">Loading…</p>
      ) : (
        <>
          <hr />
          <h3>Contact Info, Location &amp; Hours</h3>
          <div className="admin-form-grid">
            <div className="admin-field">
              <label htmlFor="td-loc">Location Title</label>
              <input
                id="td-loc"
                value={contactsForm.location}
                onChange={(e) => setContactsForm((p) => ({ ...p, location: e.target.value }))}
                placeholder="Opposite Central Square"
              />
            </div>
            <div className="admin-field">
              <label htmlFor="td-loc-sub">Location Subtitle / Landmark</label>
              <input
                id="td-loc-sub"
                value={contactsForm.locationSub}
                onChange={(e) => setContactsForm((p) => ({ ...p, locationSub: e.target.value }))}
                placeholder="Adjacent to ICICI ATM"
              />
            </div>
            <div className="admin-field">
              <label htmlFor="td-timings">Quick Timings Text</label>
              <input
                id="td-timings"
                value={contactsForm.timings}
                onChange={(e) => setContactsForm((p) => ({ ...p, timings: e.target.value }))}
                placeholder="4:00 PM – 7:00 PM"
              />
            </div>
            <div className="admin-field">
              <label htmlFor="td-timings-sub">Timings Subtext</label>
              <input
                id="td-timings-sub"
                value={contactsForm.timingsSub}
                onChange={(e) => setContactsForm((p) => ({ ...p, timingsSub: e.target.value }))}
                placeholder="Daily & Sunday Hours"
              />
            </div>
            <div className="admin-field">
              <label htmlFor="td-phone">Helpline Phone Number</label>
              <input
                id="td-phone"
                value={contactsForm.phone}
                onChange={(e) => setContactsForm((p) => ({ ...p, phone: e.target.value }))}
                placeholder="9624 123 123"
              />
            </div>
            <div className="admin-field">
              <label htmlFor="td-email">Support Email</label>
              <input
                id="td-email"
                value={contactsForm.email}
                onChange={(e) => setContactsForm((p) => ({ ...p, email: e.target.value }))}
                placeholder="support@ushodayaholidays.in"
              />
            </div>
            <div className="admin-field admin-field--full">
              <label htmlFor="td-partner">Travel Partner Name</label>
              <input
                id="td-partner"
                value={contactsForm.partner}
                onChange={(e) => setContactsForm((p) => ({ ...p, partner: e.target.value }))}
                placeholder="Ushodaya Holidays"
              />
            </div>
          </div>
          <div className="admin-form-actions">
            <button className="admin-btn admin-btn--primary" onClick={saveContacts} disabled={contactsSaving}>
              {contactsSaving ? 'Saving…' : 'Save Contact & Timings'}
            </button>
          </div>

          <hr />
          <h3>About Section &amp; Working Hours</h3>
          <div className="admin-form-grid">
            <div className="admin-field">
              <label htmlFor="td-abt-badge">Badge</label>
              <input
                id="td-abt-badge"
                value={aboutForm.badge}
                onChange={(e) => setAboutForm((p) => ({ ...p, badge: e.target.value }))}
                placeholder="CONVENIENT SERVICES"
              />
            </div>
            <div className="admin-field">
              <label htmlFor="td-abt-title">Section Title</label>
              <input
                id="td-abt-title"
                value={aboutForm.title}
                onChange={(e) => setAboutForm((p) => ({ ...p, title: e.target.value }))}
                placeholder="About the Travel Desk"
              />
            </div>
            <div className="admin-field admin-field--full">
              <label htmlFor="td-abt-sub">Section Subtitle</label>
              <input
                id="td-abt-sub"
                value={aboutForm.subtitle}
                onChange={(e) => setAboutForm((p) => ({ ...p, subtitle: e.target.value }))}
                placeholder="Designed to simplify travel and documentation needs..."
              />
            </div>
            <div className="admin-field admin-field--full">
              <label htmlFor="td-p1">Body Paragraph 1</label>
              <textarea
                id="td-p1"
                rows={3}
                value={aboutForm.paragraph1}
                onChange={(e) => setAboutForm((p) => ({ ...p, paragraph1: e.target.value }))}
              />
            </div>
            <div className="admin-field admin-field--full">
              <label htmlFor="td-p2">Body Paragraph 2</label>
              <textarea
                id="td-p2"
                rows={3}
                value={aboutForm.paragraph2}
                onChange={(e) => setAboutForm((p) => ({ ...p, paragraph2: e.target.value }))}
              />
            </div>
            <div className="admin-field">
              <label htmlFor="td-wh-ms">Mon – Sat Working Hours</label>
              <input
                id="td-wh-ms"
                value={aboutForm.timingMonSat}
                onChange={(e) => setAboutForm((p) => ({ ...p, timingMonSat: e.target.value }))}
                placeholder="4:00 PM to 7:00 PM"
              />
            </div>
            <div className="admin-field">
              <label htmlFor="td-wh-sun">Sunday Working Hours</label>
              <input
                id="td-wh-sun"
                value={aboutForm.timingSun}
                onChange={(e) => setAboutForm((p) => ({ ...p, timingSun: e.target.value }))}
                placeholder="11:00 AM to 7:00 PM"
              />
            </div>
          </div>
          <div className="admin-form-actions">
            <button className="admin-btn admin-btn--primary" onClick={saveAbout} disabled={aboutSaving}>
              {aboutSaving ? 'Saving…' : 'Save About Section'}
            </button>
          </div>

          <hr />
          <h3>Services Offered ({services.length})</h3>
          <p className="admin-field__hint">The service cards shown in the 6-grid on the page.</p>
          {services.map((s, idx) => (
            <div
              key={idx}
              className="admin-form-grid"
              style={{
                gridTemplateColumns: '160px 1fr 2fr auto',
                alignItems: 'end',
                marginBottom: '0.75rem',
                border: '1px solid #e5e7eb',
                borderRadius: '6px',
                padding: '0.75rem',
              }}
            >
              <div className="admin-field">
                <label>Icon</label>
                <select
                  value={s.icon}
                  onChange={(e) =>
                    setServices((prev) => prev.map((item, i) => (i === idx ? { ...item, icon: e.target.value } : item)))
                  }
                >
                  <option value="Ticket">Ticket</option>
                  <option value="Globe">Globe</option>
                  <option value="Compass">Compass</option>
                  <option value="Building">Building</option>
                  <option value="FileCheck">FileCheck</option>
                  <option value="GraduationCap">GraduationCap</option>
                  {CONTENT_ICON_NAMES.map((name) => (
                    <option key={name} value={name}>
                      {name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="admin-field">
                <label>Service Title</label>
                <input
                  value={s.title}
                  onChange={(e) =>
                    setServices((prev) => prev.map((item, i) => (i === idx ? { ...item, title: e.target.value } : item)))
                  }
                  placeholder="Ticket Bookings"
                />
              </div>
              <div className="admin-field">
                <label>Description</label>
                <input
                  value={s.desc}
                  onChange={(e) =>
                    setServices((prev) => prev.map((item, i) => (i === idx ? { ...item, desc: e.target.value } : item)))
                  }
                  placeholder="Hassle-free reservations..."
                />
              </div>
              <button
                type="button"
                className="admin-btn admin-btn--sm admin-btn--danger"
                onClick={() => setServices((prev) => prev.filter((_, i) => i !== idx))}
              >
                Remove
              </button>
            </div>
          ))}
          <div style={{ marginTop: '0.5rem', marginBottom: '1rem' }}>
            <button
              type="button"
              className="admin-btn admin-btn--sm"
              onClick={() => setServices((prev) => [...prev, { icon: 'Ticket', title: '', desc: '' }])}
            >
              + Add Service Card
            </button>
          </div>
          <div className="admin-form-actions">
            <button className="admin-btn admin-btn--primary" onClick={saveServices} disabled={servicesSaving}>
              {servicesSaving ? 'Saving…' : 'Save Services List'}
            </button>
          </div>
        </>
      )}
    </div>
  );
}
