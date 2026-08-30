import { useEffect, useState } from 'react';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../../lib/firebase';
import { useDocument } from '../../../hooks/useDocument';
import FileUploader from '../../../components/FileUploader/FileUploader';
import type { UploadResult } from '../../../lib/storage';

interface NavLinkOverrideDoc {
  targetUrl?: string;
}

// Each entry here must use the same `id` as the matching useNavLinkOverride(id, ...)
// call in Header.tsx — that's what ties an admin edit to a specific nav item.
// `upload`, when set, swaps the plain URL field for a real upload button
// (a file this link should point straight at, e.g. a document image) —
// `accept`/`isValidFile` narrow FileUploader's default PDF-only behavior.
const NAV_LINK_OVERRIDES: {
  id: string;
  label: string;
  defaultPath: string;
  upload?: { folder: string; accept: string; isValidFile: (file: File) => boolean; buttonLabel: string };
}[] = [
  {
    id: 'alumni-success-stories',
    label: 'Alumni & Giving → Success Stories',
    defaultPath: '/alumni-giving#successstories',
  },
  {
    id: 'header-apply-now',
    label: 'Header → Apply Now button',
    defaultPath: '/admissions',
  },
  {
    id: 'header-organizational-chart',
    label: 'Header → About Us → Organizational Chart',
    defaultPath: '/downloads/SVECWOrganizationChart.jpg',
    upload: {
      folder: 'vwu/governance',
      accept: 'image/*',
      isValidFile: (file) => file.type.startsWith('image/'),
      buttonLabel: 'Upload Chart Image',
    },
  },
];

function isValidTarget(url: string) {
  const trimmed = url.trim();
  return trimmed === '' || trimmed.startsWith('/') || /^https?:\/\//i.test(trimmed);
}

function NavLinkOverrideRow({ id, label, defaultPath, upload }: {
  id: string;
  label: string;
  defaultPath: string;
  upload?: { folder: string; accept: string; isValidFile: (file: File) => boolean; buttonLabel: string };
}) {
  const { data, loading } = useDocument<NavLinkOverrideDoc>('navLinkOverrides', id);
  const [value, setValue] = useState('');
  const [touched, setTouched] = useState(false);
  const [saving, setSaving] = useState(false);

  // Only take the live value until the admin starts typing — otherwise every
  // Firestore snapshot would stomp on what they're mid-edit on.
  useEffect(() => {
    if (!touched && !loading) setValue(data?.targetUrl ?? '');
  }, [data, loading, touched]);

  const invalid = touched && !isValidTarget(value);
  const effectivePath = value.trim() && isValidTarget(value) ? value.trim() : defaultPath;

  const saveUrl = async (url: string) => {
    setSaving(true);
    try {
      await setDoc(doc(db, 'navLinkOverrides', id), {
        targetUrl: isValidTarget(url) ? url.trim() : '',
        updatedAt: serverTimestamp(),
      });
      setTouched(false);
    } catch (e) {
      alert(`Couldn't save: ${(e as Error).message}`);
    } finally {
      setSaving(false);
    }
  };
  const save = () => saveUrl(value);
  const handleUploaded = (r: UploadResult) => { setValue(r.url); saveUrl(r.url); };

  const reset = async () => {
    if (!confirm(`Reset this link back to its default (${defaultPath})?`)) return;
    setSaving(true);
    try {
      await setDoc(doc(db, 'navLinkOverrides', id), { targetUrl: '', updatedAt: serverTimestamp() });
      setValue('');
      setTouched(false);
    } catch (e) {
      alert(`Couldn't reset: ${(e as Error).message}`);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="admin-card">
      <h3 className="admin-card__title" style={{ fontSize: '1rem' }}>{label}</h3>
      <p className="admin-field__hint">
        Currently goes to: <strong>{effectivePath}</strong>{!data?.targetUrl && ' (default — not overridden)'}
      </p>
      {upload && (
        <div className="admin-field" style={{ marginBottom: '1rem' }}>
          <label>{upload.buttonLabel}</label>
          <FileUploader
            folder={upload.folder}
            currentUrl={value}
            accept={upload.accept}
            isValidFile={upload.isValidFile}
            invalidFileMessage="Please select an image file."
            onUploaded={handleUploaded}
            label={upload.buttonLabel}
          />
        </div>
      )}
      <div className="admin-form-grid">
        <div className="admin-field admin-field--full">
          <label htmlFor="field-redirect-url">{upload ? 'Or paste a URL directly' : 'Redirect URL'}</label>
          <input id="field-redirect-url"
            value={value}
            onChange={(e) => { setValue(e.target.value); setTouched(true); }}
            placeholder={`Leave blank to use the default: ${defaultPath}`}
          />
          {invalid && (
            <span className="admin-field__hint" style={{ color: '#dc2626' }}>
              Must start with "/" (an internal page) or "http://"/"https://" (an external link).
            </span>
          )}
        </div>
      </div>
      <div className="admin-form-actions">
        <button className="admin-btn admin-btn--ghost" onClick={reset} disabled={saving}>Reset to Default</button>
        <button className="admin-btn admin-btn--primary" onClick={save} disabled={saving || invalid}>
          {saving ? 'Saving…' : 'Save'}
        </button>
      </div>
    </div>
  );
}

export default function NavLinkOverridesAdmin() {
  return (
    <div className="admin-section">
      <div className="admin-card">
        <h2 className="admin-card__title">Navigation Link Redirects</h2>
        <p className="admin-field__hint">
          Change where a specific navigation menu item points, without a code deploy.
          Updates apply immediately for every visitor. Leave a field blank and save to restore the original destination.
        </p>
      </div>
      {NAV_LINK_OVERRIDES.map((o) => (
        <NavLinkOverrideRow key={o.id} {...o} />
      ))}
    </div>
  );
}
