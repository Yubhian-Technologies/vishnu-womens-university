import { useEffect, useState } from 'react';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '../../../lib/firebase';
import { useDocument } from '../../../hooks/useDocument';

interface SiteContactDoc {
  phone?: string;
  email?: string;
}

/**
 * The single site-wide phone number and email shown in the Footer and on
 * the Admissions/Careers/Information pages (see hooks/useSiteContact.ts) —
 * one Firestore doc (`settings/siteContact`), no list, nothing to add or
 * remove. Leaving a field blank falls back to the site's built-in default
 * rather than showing empty.
 */
export default function SiteContactAdmin() {
  const { data, loading } = useDocument<SiteContactDoc>('settings', 'siteContact');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (data) {
      setPhone(data.phone || '');
      setEmail(data.email || '');
    }
  }, [data]);

  const save = async () => {
    setSaving(true);
    try {
      await setDoc(doc(db, 'settings', 'siteContact'), { phone: phone.trim(), email: email.trim() });
    } catch (e) {
      alert(`Couldn't save: ${(e as Error).message}`);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="admin-card">
      <h2 className="admin-card__title">Site Contact Info</h2>
      <p className="admin-field__hint" style={{ marginBottom: '1rem' }}>
        The phone number and email shown site-wide — in the Footer, and on the Admissions, Careers, and Information
        pages. Leave a field blank to fall back to the site's built-in default value.
      </p>
      {loading ? <p className="admin-loading">Loading…</p> : (
        <>
          <div className="admin-field">
            <label htmlFor="field-site-phone">Phone Number</label>
            <input id="field-site-phone" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="08816-250864" />
          </div>
          <div className="admin-field">
            <label htmlFor="field-site-email">Email Address</label>
            <input id="field-site-email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="info@vwu.edu.in" />
          </div>
          <div className="admin-form-actions">
            <button className="admin-btn admin-btn--primary" onClick={save} disabled={saving}>{saving ? 'Saving…' : 'Save'}</button>
          </div>
        </>
      )}
    </div>
  );
}
