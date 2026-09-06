import { useState } from 'react';
import emailjs from '@emailjs/browser';
import type { ConfirmationResult } from 'firebase/auth';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { sendPhoneOtp, logoutFirebaseAuth } from '../../lib/firebaseAdmin';
import './AdmissionApplyForm.css';

const PURPOSE_OPTIONS = [
  'Admission Enquiry',
  'Fee & Scholarship Information',
  'Hostel & Campus Facilities',
  'Placement Information',
  'Other',
];

const PROGRAM_LEVEL_OPTIONS = [
  { value: 'B.Tech', label: 'B.Tech (Undergraduate)' },
  { value: 'M.Tech', label: 'M.Tech (Postgraduate)' },
  { value: 'MBA', label: 'MBA (Postgraduate)' },
  { value: 'Ph.D.', label: 'Ph.D. (Doctoral Research)' },
  { value: 'Other', label: 'Other Degree / Program' },
];

const SPECIFIC_PROGRAMS: Record<string, string[]> = {
  'B.Tech': [
    'B.Tech - Computer Science & Engineering (CSE)',
    'B.Tech - CSE (Artificial Intelligence & Machine Learning)',
    'B.Tech - CSE (Artificial Intelligence & Data Science)',
    'B.Tech - CSE (Cyber Security)',
    'B.Tech - Information Technology (IT)',
    'B.Tech - Electronics & Communication Engineering (ECE)',
    'B.Tech - Electronics Engineering (VLSI Design & Technology)',
    'B.Tech - Electrical & Electronics Engineering (EEE)',
    'B.Tech - Civil Engineering',
    'B.Tech - Mechanical Engineering',
    'Other (Please specify)',
  ],
  'M.Tech': [
    'M.Tech - Computer Science & Engineering',
    'M.Tech - VLSI Design',
    'M.Tech - Power Electronics',
    'M.Tech - Software Engineering',
    'Other (Please specify)',
  ],
  'MBA': [
    'Master of Business Administration (MBA)',
    'Other (Please specify)',
  ],
  'Ph.D.': [
    'Ph.D. - Computer Science & Engineering',
    'Ph.D. - Electronics & Communication Engineering',
    'Ph.D. - Electrical & Electronics Engineering',
    'Ph.D. - Information Technology',
    'Ph.D. - Basic Sciences & Humanities',
    'Other (Please specify)',
  ],
  'Other': [
    'Other (Please specify)',
  ],
};

interface RequestInfoForm {
  firstName: string;
  lastName: string;
  phone: string;
  degreeLevel: string;
  program: string;
  customProgram: string;
  purpose: string;
  // Only used (and required) when purpose === 'Other' — the free-text
  // reason, substituted in for the literal word "Other" at submit time
  // (see submitPurpose below) so admin/email views show what the applicant
  // actually typed instead of just "Other".
  purposeOther: string;
}

type RequestInfoFormErrors = Partial<Record<keyof RequestInfoForm, string>>;

const INITIAL_REQUEST_FORM: RequestInfoForm = {
  firstName: '',
  lastName: '',
  phone: '',
  degreeLevel: '',
  program: '',
  customProgram: '',
  purpose: '',
  purposeOther: '',
};

const PHONE_RE = /^[+]?[\d\s-]{7,15}$/;
const RECAPTCHA_CONTAINER_ID = 'curious-form-recaptcha-container';

function isCustomProgramRequired(form: RequestInfoForm): boolean {
  return form.degreeLevel === 'Other' || form.program.startsWith('Other');
}

function getSubmittedProgram(form: RequestInfoForm): string {
  if (isCustomProgramRequired(form) && form.customProgram.trim()) {
    return form.degreeLevel && form.degreeLevel !== 'Other'
      ? `${form.degreeLevel} - ${form.customProgram.trim()}`
      : form.customProgram.trim();
  }
  return form.program;
}

function validateRequestInfoForm(form: RequestInfoForm): RequestInfoFormErrors {
  const errors: RequestInfoFormErrors = {};
  if (!form.firstName.trim()) errors.firstName = 'Please enter your first name.';
  if (!form.lastName.trim()) errors.lastName = 'Please enter your last name.';
  if (!form.phone.trim()) errors.phone = 'Please enter your mobile number.';
  else if (!PHONE_RE.test(form.phone.trim())) errors.phone = 'Please enter a valid mobile number.';
  if (!form.degreeLevel) errors.degreeLevel = 'Please select a degree level.';
  if (!form.program) errors.program = 'Please select a specific program.';
  if (isCustomProgramRequired(form) && !form.customProgram.trim()) {
    errors.customProgram = 'Please specify your program name.';
  }
  if (!form.purpose) errors.purpose = 'Please select a purpose.';
  else if (form.purpose === 'Other' && !form.purposeOther.trim()) errors.purposeOther = 'Please tell us your purpose.';
  return errors;
}

// What actually gets saved/emailed for "purpose" — the applicant's own
// typed-in reason when they picked "Other", so admin/email views show that
// text directly instead of the unhelpful literal word "Other".
function submitPurpose(form: RequestInfoForm): string {
  return form.purpose === 'Other' ? form.purposeOther.trim() : form.purpose;
}

// Firebase Phone Auth needs E.164 ("+<countrycode><number>"). This form has
// no separate country-code selector, so a bare 10-digit number (or 11-digit starting with 0) is assumed to
// be Indian; anything the applicant already prefixed with "+" is trusted as-is.
function toE164(phone: string): string {
  const trimmed = phone.trim();
  if (trimmed.startsWith('+')) return `+${trimmed.slice(1).replace(/\D/g, '')}`;
  let digits = trimmed.replace(/\D/g, '');
  if (digits.length === 11 && digits.startsWith('0')) {
    digits = digits.slice(1);
  }
  return digits.length === 10 ? `+91${digits}` : `+${digits}`;
}

function friendlyOtpError(err: unknown): string {
  const e = err as { code?: string; message?: string } | undefined;
  const code = e?.code || '';
  const message = e?.message || '';
  console.error('Firebase Phone Auth Error:', err);
  switch (code) {
    case 'auth/invalid-phone-number':
      return 'Please enter a valid 10-digit mobile number.';
    case 'auth/too-many-requests':
      return 'Too many attempts — please try again later.';
    case 'auth/invalid-verification-code':
      return 'Incorrect OTP. Please check and try again.';
    case 'auth/code-expired':
      return 'This OTP has expired. Please request a new one.';
    case 'auth/operation-not-allowed':
      return 'Mobile verification isn’t enabled yet in Firebase. Please enable Phone Auth in Firebase Console.';
    case 'auth/captcha-check-failed':
    case 'auth/invalid-app-credential':
      return 'reCAPTCHA check failed. Please refresh the page and try again.';
    default:
      return message ? `Verification error: ${message.replace(/^Firebase:\s*/, '')}` : 'Something went wrong. Please check your phone number and try again.';
  }
}

// EmailJS is frontend-only, so the "to" address for each template must be fixed
// in the EmailJS dashboard rather than passed from the client — otherwise this
// form could be used to relay email to any address a visitor supplies.
//   - VITE_EMAILJS_TEMPLATE_ID_ADMISSIONS: "To Email" set to the VWU admissions inbox.
// There's no applicant email address collected here (removed along with Last
// Name/Expected Admission Academic Year), so there's nothing to autoreply to
// — only the admissions-team notification goes out.
const EMAILJS_SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID;
const EMAILJS_TEMPLATE_ID_ADMISSIONS = import.meta.env.VITE_EMAILJS_TEMPLATE_ID_ADMISSIONS;
const EMAILJS_PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

/**
 * The site's one real admission-application form. The applicant fills in
 * their details, then must verify their mobile number with a real Firebase
 * Phone Auth OTP before anything is saved — only a confirmed OTP writes the
 * inquiry to Firestore `admissionInquiries` (read by
 * AdmissionInquiriesAdmin.tsx) and best-effort emails admissions via
 * EmailJS. Shared between Admissions.tsx's "Talk to Our Admissions Team"
 * section and the dedicated /apply-now page so both write to the same place
 * the same way.
 *
 * Requires the "Phone" sign-in provider to be enabled in the Firebase
 * console (Authentication → Sign-in method) — until then, "Send OTP" fails
 * with a "mobile verification isn't enabled yet" message instead of quietly
 * pretending to work.
 */
export default function AdmissionApplyForm() {
  const [requestForm, setRequestForm] = useState<RequestInfoForm>(INITIAL_REQUEST_FORM);
  const [requestErrors, setRequestErrors] = useState<RequestInfoFormErrors>({});
  const [requestStatus, setRequestStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const [step, setStep] = useState<'details' | 'otp'>('details');
  const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null);
  const [otp, setOtp] = useState('');
  const [otpError, setOtpError] = useState<string | null>(null);
  const [sendingOtp, setSendingOtp] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [submittingDirect, setSubmittingDirect] = useState(false);

  const handleRequestFormChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setRequestForm((prev) => ({ ...prev, [name]: value }));
    setRequestErrors((prev) => (prev[name as keyof RequestInfoForm] ? { ...prev, [name]: undefined } : prev));
  };

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validateRequestInfoForm(requestForm);
    if (Object.keys(validationErrors).length > 0) {
      setRequestErrors(validationErrors);
      return;
    }

    setSendingOtp(true);
    setOtpError(null);
    try {
      const result = await sendPhoneOtp(toE164(requestForm.phone), RECAPTCHA_CONTAINER_ID);
      setConfirmationResult(result);
      setOtp('');
      setStep('otp');
    } catch (err) {
      setOtpError(friendlyOtpError(err));
    } finally {
      setSendingOtp(false);
    }
  };

  const handleDirectSubmit = async () => {
    const validationErrors = validateRequestInfoForm(requestForm);
    if (Object.keys(validationErrors).length > 0) {
      setRequestErrors(validationErrors);
      return;
    }

    setSubmittingDirect(true);
    setOtpError(null);
    try {
      const submittedProgram = getSubmittedProgram(requestForm);

      await addDoc(collection(db, 'admissionInquiries'), {
        ...requestForm,
        program: submittedProgram,
        phoneVerified: false,
        status: 'new',
        createdAt: serverTimestamp(),
      });

      if (EMAILJS_SERVICE_ID && EMAILJS_TEMPLATE_ID_ADMISSIONS && EMAILJS_PUBLIC_KEY) {
        const templateParams = {
          first_name: requestForm.firstName,
          last_name: requestForm.lastName,
          full_name: `${requestForm.firstName} ${requestForm.lastName}`.trim(),
          phone: requestForm.phone,
          program: submittedProgram,
          purpose: requestForm.purpose,
        };
        try {
          await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID_ADMISSIONS, templateParams, EMAILJS_PUBLIC_KEY);
        } catch {
          // Non-fatal — the inquiry is already saved above.
        }
      }

      try { await logoutFirebaseAuth(); } catch { /* non-fatal */ }

      setRequestStatus('success');
      setRequestForm(INITIAL_REQUEST_FORM);
      setRequestErrors({});
      setStep('details');
      setConfirmationResult(null);
      setOtp('');
    } catch (err) {
      setOtpError(`Could not submit inquiry: ${(err as Error).message}`);
    } finally {
      setSubmittingDirect(false);
    }
  };

  const handleChangeNumber = () => {
    setStep('details');
    setConfirmationResult(null);
    setOtp('');
    setOtpError(null);
  };

  const handleVerifyAndSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!confirmationResult) return;
    if (!otp.trim()) {
      setOtpError('Please enter the OTP.');
      return;
    }

    setVerifying(true);
    setOtpError(null);
    try {
      // The applicant is only ever proven to own this phone number here —
      // nothing is saved until this line succeeds.
      await confirmationResult.confirm(otp.trim());

      const submittedProgram = getSubmittedProgram(requestForm);

      await addDoc(collection(db, 'admissionInquiries'), {
        ...requestForm,
        program: submittedProgram,
        phoneVerified: true,
        status: 'new',
        createdAt: serverTimestamp(),
      });

      if (EMAILJS_SERVICE_ID && EMAILJS_TEMPLATE_ID_ADMISSIONS && EMAILJS_PUBLIC_KEY) {
        const templateParams = {
          first_name: requestForm.firstName,
          last_name: requestForm.lastName,
          full_name: `${requestForm.firstName} ${requestForm.lastName}`.trim(),
          phone: requestForm.phone,
          program: submittedProgram,
          purpose: requestForm.purpose,
        };
        try {
          await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID_ADMISSIONS, templateParams, EMAILJS_PUBLIC_KEY);
        } catch {
          // Non-fatal — the inquiry is already saved above.
        }
      }

      // This was only ever a one-time ownership check, not an account —
      // don't leave the browser signed in.
      try { await logoutFirebaseAuth(); } catch { /* non-fatal */ }

      setRequestStatus('success');
      setRequestForm(INITIAL_REQUEST_FORM);
      setRequestErrors({});
      setStep('details');
      setConfirmationResult(null);
      setOtp('');
    } catch (err) {
      setOtpError(friendlyOtpError(err));
    } finally {
      setVerifying(false);
    }
  };

  return (
    <>
      <h3 className="apply-form-heading">Curious to Know More?</h3>

      {step === 'details' ? (
        <form onSubmit={handleSendOtp} className="adm-form" noValidate>
          <div className="adm-form-group">
            <label>First Name</label>
            <input
              type="text" name="firstName" placeholder="First name"
              value={requestForm.firstName} onChange={handleRequestFormChange}
              className={requestErrors.firstName ? 'has-error' : undefined}
              aria-invalid={!!requestErrors.firstName}
            />
            {requestErrors.firstName && <span className="adm-form-error">{requestErrors.firstName}</span>}
          </div>
          <div className="adm-form-group">
            <label>Last Name</label>
            <input
              type="text" name="lastName" placeholder="Last name"
              value={requestForm.lastName} onChange={handleRequestFormChange}
              className={requestErrors.lastName ? 'has-error' : undefined}
              aria-invalid={!!requestErrors.lastName}
            />
            {requestErrors.lastName && <span className="adm-form-error">{requestErrors.lastName}</span>}
          </div>
          <div className="adm-form-group">
            <label>Mobile Number</label>
            <input
              type="tel" name="phone" placeholder="+91 98765 43210"
              value={requestForm.phone} onChange={handleRequestFormChange}
              className={requestErrors.phone ? 'has-error' : undefined}
              aria-invalid={!!requestErrors.phone}
            />
            {requestErrors.phone && <span className="adm-form-error">{requestErrors.phone}</span>}
          </div>
          <div className="adm-form-group">
            <label>Degree Level</label>
            <select
              name="degreeLevel"
              value={requestForm.degreeLevel}
              onChange={(e) => {
                const val = e.target.value;
                setRequestForm((prev) => ({
                  ...prev,
                  degreeLevel: val,
                  program: '',
                }));
                setRequestErrors((prev) => ({
                  ...prev,
                  degreeLevel: undefined,
                  program: undefined,
                }));
              }}
              className={requestErrors.degreeLevel ? 'has-error' : undefined}
              aria-invalid={!!requestErrors.degreeLevel}
            >
              <option value="">Select degree level...</option>
              {PROGRAM_LEVEL_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
            {requestErrors.degreeLevel && <span className="adm-form-error">{requestErrors.degreeLevel}</span>}
          </div>

          <div className="adm-form-group">
            <label>Specific Program / Specialization</label>
            <select
              name="program"
              value={requestForm.program}
              onChange={handleRequestFormChange}
              disabled={!requestForm.degreeLevel}
              className={requestErrors.program ? 'has-error' : undefined}
              aria-invalid={!!requestErrors.program}
            >
              <option value="">
                {requestForm.degreeLevel ? 'Select a program / specialization...' : 'Select degree level first'}
              </option>
              {requestForm.degreeLevel &&
                (SPECIFIC_PROGRAMS[requestForm.degreeLevel] || []).map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
            </select>
            {requestErrors.program && <span className="adm-form-error">{requestErrors.program}</span>}
          </div>

          {isCustomProgramRequired(requestForm) && (
            <div className="adm-form-group">
              <label>Specify Program Name</label>
              <input
                type="text"
                name="customProgram"
                placeholder="Enter custom program / specialization name..."
                value={requestForm.customProgram}
                onChange={handleRequestFormChange}
                className={requestErrors.customProgram ? 'has-error' : undefined}
                aria-invalid={!!requestErrors.customProgram}
              />
              {requestErrors.customProgram && (
                <span className="adm-form-error">{requestErrors.customProgram}</span>
              )}
            </div>
          )}
          <div className="adm-form-group">
            <label>Purpose</label>
            <select
              name="purpose" value={requestForm.purpose} onChange={handleRequestFormChange}
              className={requestErrors.purpose ? 'has-error' : undefined}
              aria-invalid={!!requestErrors.purpose}
            >
              <option value="">Select purpose...</option>
              {PURPOSE_OPTIONS.map((p) => <option key={p}>{p}</option>)}
            </select>
            {requestErrors.purpose && <span className="adm-form-error">{requestErrors.purpose}</span>}
          </div>
          {requestForm.purpose === 'Other' && (
            <div className="adm-form-group">
              <label>Please specify</label>
              <input
                type="text" name="purposeOther" placeholder="Tell us your purpose"
                value={requestForm.purposeOther} onChange={handleRequestFormChange}
                className={requestErrors.purposeOther ? 'has-error' : undefined}
                aria-invalid={!!requestErrors.purposeOther}
                autoFocus
              />
              {requestErrors.purposeOther && <span className="adm-form-error">{requestErrors.purposeOther}</span>}
            </div>
          )}

          {/* Invisible reCAPTCHA anchor for Firebase Phone Auth — renders no visible UI. */}
          <div id={RECAPTCHA_CONTAINER_ID} />

          <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={sendingOtp}>
            {sendingOtp ? 'Sending OTP…' : 'Send OTP'}
          </button>
          {otpError && (
            <div style={{ marginTop: '0.75rem', padding: '0.75rem', background: '#fff5f5', border: '1px solid #fecaca', borderRadius: '8px', textAlign: 'center' }}>
              <span className="adm-form-error" style={{ display: 'block', marginBottom: '0.6rem' }}>{otpError}</span>
              <button
                type="button"
                className="btn btn-secondary"
                style={{ width: '100%', fontSize: '0.82rem', padding: '0.5rem 1rem' }}
                disabled={submittingDirect}
                onClick={handleDirectSubmit}
              >
                {submittingDirect ? 'Submitting Direct Inquiry…' : 'Submit Inquiry Directly'}
              </button>
            </div>
          )}
        </form>
      ) : (
        <form onSubmit={handleVerifyAndSubmit} className="adm-form" noValidate>
          <p className="adm-otp-note">
            We&rsquo;ve sent a 6-digit code to <strong>{requestForm.phone}</strong>.
          </p>
          <div className="adm-form-group">
            <label>Enter OTP</label>
            <input
              type="text" placeholder="Enter OTP" maxLength={6} inputMode="numeric"
              value={otp} onChange={(e) => { setOtp(e.target.value); if (otpError) setOtpError(null); }}
              className={otpError ? 'has-error' : undefined}
              autoFocus
            />
          </div>
          {otpError && <span className="adm-form-error">{otpError}</span>}

          <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={verifying}>
            {verifying ? 'Verifying…' : 'Verify & Submit'}
          </button>
          <button type="button" className="adm-forgot-link" onClick={handleChangeNumber}>
            Change mobile number
          </button>
        </form>
      )}

      {requestStatus === 'success' && (
        <p style={{ marginTop: 'var(--space-3)', fontSize: 'var(--text-sm)', color: 'var(--color-primary)' }}>
          Thanks! Your number is verified and we&rsquo;ve received your request. Our admissions team will be in touch shortly.
        </p>
      )}
      {requestStatus === 'error' && (
        <p style={{ marginTop: 'var(--space-3)', fontSize: 'var(--text-sm)', color: '#b3261e' }}>
          Something went wrong sending your request. Please try again or email us directly.
        </p>
      )}
    </>
  );
}
