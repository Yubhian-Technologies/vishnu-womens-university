import { useState } from 'react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../lib/firebase';

// Interested-student sign-up shown on the Career Guidance Cell sub-page.
// Writes to the `careerGuidanceInterest` collection, read from
// /admin → Career Guidance Interest (CareerGuidanceInterestAdmin).

const YEAR_OPTIONS = ['1st Year', '2nd Year', '3rd Year', '4th Year', 'Passed Out'];

const DEFAULT_TRACKS = ['GRE / TOEFL', 'GATE', 'IES, IFS & IAS', 'SVES–NS-IAS Civil Services Coaching Programme'];

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

interface FormState {
  fullName: string;
  email: string;
  phone: string;
  branch: string;
  year: string;
  track: string;
  message: string;
}

const INITIAL: FormState = { fullName: '', email: '', phone: '', branch: '', year: '', track: '', message: '' };

type Errors = Partial<Record<keyof FormState, string>>;

const fieldStyle: React.CSSProperties = {
  width: '100%',
  padding: 'var(--space-3) var(--space-4)',
  border: '1.5px solid var(--color-light-gray)',
  borderRadius: 'var(--radius-sm)',
  fontSize: 'var(--text-base)',
  fontFamily: 'inherit',
  background: 'var(--color-white)',
  color: 'var(--color-text)',
};
const labelStyle: React.CSSProperties = {
  display: 'block',
  fontSize: 'var(--text-sm)',
  fontWeight: 700,
  color: 'var(--color-primary)',
  marginBottom: 'var(--space-2)',
};
const errStyle: React.CSSProperties = { display: 'block', marginTop: 4, fontSize: 'var(--text-xs)', color: '#b3261e' };

export default function CareerGuidanceInterestForm({ tracks = DEFAULT_TRACKS }: { tracks?: string[] }) {
  const [form, setForm] = useState<FormState>(INITIAL);
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');

  const change = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
    setErrors((p) => (p[name as keyof FormState] ? { ...p, [name]: undefined } : p));
  };

  const validate = (): Errors => {
    const e: Errors = {};
    if (!form.fullName.trim()) e.fullName = 'Please enter your name.';
    if (!form.email.trim()) e.email = 'Please enter your email address.';
    else if (!EMAIL_RE.test(form.email.trim())) e.email = 'Please enter a valid email address.';
    if (!form.phone.trim()) e.phone = 'Please enter a phone number.';
    return e;
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const v = validate();
    if (Object.keys(v).length > 0) { setErrors(v); return; }
    setStatus('submitting');
    try {
      await addDoc(collection(db, 'careerGuidanceInterest'), {
        fullName: form.fullName.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        branch: form.branch.trim(),
        year: form.year,
        track: form.track,
        message: form.message.trim(),
        status: 'new',
        createdAt: serverTimestamp(),
      });
      setStatus('success');
      setForm(INITIAL);
    } catch {
      setStatus('error');
    }
  };

  return (
    <div
      style={{
        marginTop: 'var(--space-10)',
        border: '1px solid var(--color-light-gray)',
        borderRadius: 'var(--radius-md)',
        background: 'var(--color-off-white)',
        padding: 'var(--space-6)',
      }}
    >
      <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: 'var(--text-xl)', fontWeight: 700, color: 'var(--color-primary)', margin: 0 }}>
        Interested? Register with the Career Guidance Cell
      </h3>
      <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-light)', margin: 'var(--space-2) 0 var(--space-5)' }}>
        Fill in your details and the Career Guidance Cell will get in touch about the training track you're interested in.
      </p>

      <form onSubmit={submit} noValidate style={{ display: 'grid', gap: 'var(--space-4)' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 'var(--space-4)' }}>
          <div>
            <label style={labelStyle} htmlFor="cgi-name">Full Name *</label>
            <input id="cgi-name" name="fullName" style={fieldStyle} value={form.fullName} onChange={change} placeholder="Your full name" aria-invalid={!!errors.fullName} />
            {errors.fullName && <span style={errStyle}>{errors.fullName}</span>}
          </div>
          <div>
            <label style={labelStyle} htmlFor="cgi-phone">Phone Number *</label>
            <input id="cgi-phone" name="phone" type="tel" style={fieldStyle} value={form.phone} onChange={change} placeholder="10-digit mobile number" aria-invalid={!!errors.phone} />
            {errors.phone && <span style={errStyle}>{errors.phone}</span>}
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 'var(--space-4)' }}>
          <div>
            <label style={labelStyle} htmlFor="cgi-email">Email Address *</label>
            <input id="cgi-email" name="email" type="email" style={fieldStyle} value={form.email} onChange={change} placeholder="your@email.com" aria-invalid={!!errors.email} />
            {errors.email && <span style={errStyle}>{errors.email}</span>}
          </div>
          <div>
            <label style={labelStyle} htmlFor="cgi-branch">Branch / Department</label>
            <input id="cgi-branch" name="branch" style={fieldStyle} value={form.branch} onChange={change} placeholder="e.g. CSE, ECE, MBA" />
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 'var(--space-4)' }}>
          <div>
            <label style={labelStyle} htmlFor="cgi-year">Year of Study</label>
            <select id="cgi-year" name="year" style={fieldStyle} value={form.year} onChange={change}>
              <option value="">Select…</option>
              {YEAR_OPTIONS.map((y) => <option key={y} value={y}>{y}</option>)}
            </select>
          </div>
          <div>
            <label style={labelStyle} htmlFor="cgi-track">Interested Track</label>
            <select id="cgi-track" name="track" style={fieldStyle} value={form.track} onChange={change}>
              <option value="">Select…</option>
              {tracks.map((t) => <option key={t} value={t}>{t}</option>)}
              <option value="Not sure yet">Not sure yet</option>
            </select>
          </div>
        </div>

        <div>
          <label style={labelStyle} htmlFor="cgi-msg">Message (optional)</label>
          <textarea id="cgi-msg" name="message" rows={3} style={{ ...fieldStyle, resize: 'vertical' }} value={form.message} onChange={change} placeholder="Anything you'd like the Career Guidance Cell to know" />
        </div>

        <button type="submit" className="btn btn-primary" style={{ justifySelf: 'start' }} disabled={status === 'submitting'}>
          {status === 'submitting' ? 'Submitting…' : 'Submit Interest'}
        </button>

        {status === 'success' && (
          <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-primary)', margin: 0 }}>
            Thanks! Your details have been recorded — the Career Guidance Cell will reach out to you soon.
          </p>
        )}
        {status === 'error' && (
          <p style={{ fontSize: 'var(--text-sm)', color: '#b3261e', margin: 0 }}>
            Something went wrong. Please try again in a moment.
          </p>
        )}
      </form>
    </div>
  );
}
