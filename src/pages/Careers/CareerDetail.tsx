import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import PageHero from '../../components/PageHero/PageHero';
import { CheckCircle2, AlertCircle, Download } from 'lucide-react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { useDocument } from '../../hooks/useDocument';
import { useSiteContact } from '../../hooks/useSiteContact';
import { uploadFile } from '../../lib/storage';
import type { JobOpeningDoc } from '../Admin/sections/JobOpeningsAdmin';

type FormData = { name: string; email: string; phone: string; experience: string; message: string };
const EMPTY: FormData = { name: '', email: '', phone: '', experience: '', message: '' };
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_RE = /^[+]?[\d\s-]{7,15}$/;
const MAX_BYTES = 5 * 1024 * 1024;
const CAREERS_SCRIPT_URL = import.meta.env.VITE_CAREERS_APPLICATION_SCRIPT_URL;

const fileToBase64 = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => resolve((r.result as string).split(',')[1] ?? '');
    r.onerror = () => reject(r.error);
    r.readAsDataURL(file);
  });

const label = { fontSize: 'var(--text-sm)', fontWeight: 700, color: 'var(--color-primary)', fontFamily: 'var(--font-sans)' } as const;
const field = (err?: string) => ({ padding: 'var(--space-3) var(--space-4)', border: `1.5px solid ${err ? '#dc2626' : 'var(--color-light-gray)'}`, borderRadius: 'var(--radius-sm)', fontSize: 'var(--text-sm)', fontFamily: 'var(--font-sans)', color: 'var(--color-text)', background: 'var(--color-white)' }) as const;
const col = { display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' } as const;
const errText = { fontSize: 'var(--text-xs)', color: '#dc2626' } as const;

export default function CareerDetail() {
  const { id } = useParams();
  const { data: job, loading } = useDocument<JobOpeningDoc>('jobOpenings', id);
  const { email: hrEmail } = useSiteContact();
  const [form, setForm] = useState<FormData>(EMPTY);
  const [errors, setErrors] = useState<Partial<Record<keyof FormData | 'resume' | 'dataFile', string>>>({});
  const [resume, setResume] = useState<File | null>(null);
  const [dataFile, setDataFile] = useState<File | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  useEffect(() => { document.title = "Apply | Careers | Vishnu Women's University"; }, []);

  const setField = (k: keyof FormData, v: string) => {
    setForm((f) => ({ ...f, [k]: v }));
    setErrors((p) => ({ ...p, [k]: undefined }));
  };

  const pick = (kind: 'resume' | 'dataFile', ok: (n: string) => boolean, msg: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0] ?? null;
    const set = kind === 'resume' ? setResume : setDataFile;
    const bad = f && (f.size > MAX_BYTES ? 'File is too large — please keep it under 5MB.' : !ok(f.name.toLowerCase()) ? msg : '');
    if (bad) { setErrors((p) => ({ ...p, [kind]: bad })); set(null); e.target.value = ''; return; }
    setErrors((p) => ({ ...p, [kind]: undefined }));
    set(f);
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!job) return;
    const errs: typeof errors = {};
    if (!form.name.trim()) errs.name = 'Please enter your full name.';
    if (!EMAIL_RE.test(form.email.trim())) errs.email = 'Please enter a valid email address.';
    if (!PHONE_RE.test(form.phone.trim())) errs.phone = 'Please enter a valid phone number.';
    if (!form.experience) errs.experience = 'Please select your years of experience.';
    if (!dataFile) errs.dataFile = 'Please upload the completed data format (.docx).';
    if (Object.keys(errs).length) { setErrors(errs); return; }

    setSubmitting(true);
    setSubmitError('');
    try {
      let resumeUp: { url: string; path: string } | null = null;
      let dataUp: { url: string; path: string };
      try {
        if (resume) resumeUp = await uploadFile(resume, 'vwu/career-applications');
        dataUp = await uploadFile(dataFile!, 'vwu/career-applications');
      } catch {
        setSubmitError(`Your files could not be uploaded. Please try again, or email them to ${hrEmail} directly.`);
        return;
      }

      await addDoc(collection(db, 'careerApplications'), {
        ...form,
        dept: job.department,
        position: job.title,
        jobOpeningId: job.id,
        resumeFileName: resume?.name || '',
        resumeUrl: resumeUp?.url || '',
        resumeStoragePath: resumeUp?.path || '',
        dataFileName: dataFile!.name,
        dataFileUrl: dataUp.url,
        dataFileStoragePath: dataUp.path,
        status: 'new',
        createdAt: serverTimestamp(),
      });

      if (CAREERS_SCRIPT_URL) {
        try {
          const payload: Record<string, string> = { ...form, dept: job.department, position: job.title, dataFileUrl: dataUp.url };
          if (resume) {
            payload.resumeBase64 = await fileToBase64(resume);
            payload.resumeName = resume.name;
            payload.resumeMimeType = resume.type;
          }
          await fetch(CAREERS_SCRIPT_URL, { method: 'POST', headers: { 'Content-Type': 'text/plain;charset=utf-8' }, body: JSON.stringify(payload) });
        } catch { /* non-fatal — saved above */ }
      }
      setSubmitted(true);
    } catch (err) {
      setSubmitError((err as Error).message || `Couldn't submit your application. Please email ${hrEmail} directly.`);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="page-wrapper">
      <PageHero
        page="careers"
        defaultTitle={job?.title || 'Careers at VWU'}
        defaultSubtitle={job?.department || ''}
        breadcrumb={[{ label: 'Home', to: '/' }, { label: 'Careers', to: '/careers' }, { label: job?.title || 'Apply' }]}
      />
      <section className="section bg-off-white">
        <div className="container" style={{ maxWidth: 760 }}>
          {loading ? null : !job ? (
            <p style={{ textAlign: 'center' }}>This opening is no longer available. <Link to="/careers">View current openings</Link></p>
          ) : (
            <>
              <div style={{ background: 'var(--color-white)', border: '1.5px solid var(--color-light-gray)', borderRadius: 'var(--radius-md)', padding: 'var(--space-8)', borderLeft: '4px solid var(--color-accent)', marginBottom: 'var(--space-8)' }}>
                <h2 style={{ color: 'var(--color-primary)', marginBottom: 'var(--space-2)' }}>{job.title}</h2>
                <p style={{ color: 'var(--color-text-light)', marginBottom: 'var(--space-3)' }}>{job.department} · {job.type}</p>
                {job.qualification && <p><strong>Qualification:</strong> {job.qualification}</p>}
                {job.description && <p style={{ marginTop: 'var(--space-3)', whiteSpace: 'pre-line', lineHeight: 1.7 }}>{job.description}</p>}
              </div>

              {submitted ? (
                <div style={{ textAlign: 'center', background: 'var(--color-white)', border: '1.5px solid var(--color-light-gray)', borderRadius: 'var(--radius-md)', padding: 'var(--space-12)', borderTop: '4px solid var(--color-accent)' }}>
                  <CheckCircle2 size={48} strokeWidth={1.75} color="#22c55e" />
                  <h3 style={{ color: 'var(--color-primary)', margin: 'var(--space-3) 0' }}>Application Submitted!</h3>
                  <p style={{ color: 'var(--color-text-light)' }}>Our HR team will follow up within 5–7 working days.</p>
                </div>
              ) : (
                <form onSubmit={submit} noValidate style={{ background: 'var(--color-white)', border: '1.5px solid var(--color-light-gray)', borderRadius: 'var(--radius-md)', padding: 'var(--space-8)', display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}>
                  <h3 style={{ color: 'var(--color-primary)' }}>Apply for this position</h3>
                  <div className="grid-2">
                    {([['name', 'Full Name', 'text'], ['email', 'Email Address', 'email'], ['phone', 'Phone Number', 'tel']] as const).map(([k, l, t]) => (
                      <div key={k} style={col}>
                        <label style={label}>{l} *</label>
                        <input type={t} value={form[k]} onChange={(e) => setField(k, e.target.value)} style={field(errors[k])} />
                        {errors[k] && <span style={errText}>{errors[k]}</span>}
                      </div>
                    ))}
                    <div style={col}>
                      <label style={label}>Years of Experience *</label>
                      <select value={form.experience} onChange={(e) => setField('experience', e.target.value)} style={field(errors.experience)}>
                        <option value="">Select</option>
                        {['Fresher', '1–3 years', '3–5 years', '5–10 years', '10+ years'].map((o) => <option key={o}>{o}</option>)}
                      </select>
                      {errors.experience && <span style={errText}>{errors.experience}</span>}
                    </div>
                  </div>
                  <div style={col}>
                    <label style={label}>Cover Letter / Message</label>
                    <textarea rows={4} value={form.message} onChange={(e) => setField('message', e.target.value)} style={{ ...field(), resize: 'vertical' }} />
                  </div>
                  <div style={col}>
                    <label style={label}>Upload CV / Resume (PDF or DOCX)</label>
                    <input type="file" accept=".pdf,.doc,.docx" onChange={pick('resume', (n) => /\.(pdf|docx?)$/.test(n), 'Please upload a PDF or Word file.')} style={field()} />
                    {errors.resume && <span style={errText}>{errors.resume}</span>}
                  </div>
                  <div style={col}>
                    <label style={label}>Upload Data Format (DOCX) *</label>
                    {job.templateUrl && (
                      <a href={job.templateUrl} download={job.templateName || 'data-format.docx'} target="_blank" rel="noopener noreferrer"
                        style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 'var(--text-sm)', fontWeight: 700, color: 'var(--color-primary)', minHeight: 48 }}>
                        <Download size={16} /> Download the data format template
                      </a>
                    )}
                    <input type="file" accept=".docx" onChange={pick('dataFile', (n) => n.endsWith('.docx'), 'Please upload a .docx file.')} style={field(errors.dataFile)} />
                    {errors.dataFile && <span style={errText}>{errors.dataFile}</span>}
                  </div>
                  {submitError && (
                    <div style={{ display: 'flex', gap: 'var(--space-2)', padding: 'var(--space-3) var(--space-4)', background: 'rgba(220,38,38,0.06)', border: '1px solid rgba(220,38,38,0.25)', borderRadius: 'var(--radius-sm)' }}>
                      <AlertCircle size={16} color="#dc2626" style={{ flexShrink: 0, marginTop: 2 }} />
                      <span style={{ fontSize: 'var(--text-sm)', color: '#dc2626' }}>{submitError}</span>
                    </div>
                  )}
                  <button type="submit" className="btn btn-primary btn-lg" style={{ alignSelf: 'flex-start' }} disabled={submitting}>
                    {submitting ? 'Submitting…' : 'Submit Application →'}
                  </button>
                </form>
              )}
            </>
          )}
        </div>
      </section>
    </main>
  );
}
