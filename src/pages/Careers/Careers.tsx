import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import PageHero from '../../components/PageHero/PageHero';
import { GraduationCap, CheckCircle2, AlertCircle } from 'lucide-react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { useOrderedCollection } from '../../hooks/useCollection';
import { useContentBlocks } from '../../hooks/useContentBlocks';
import { resolveContentIcon } from '../../lib/contentIcons';
import type { JobOpeningDoc } from '../Admin/sections/JobOpeningsAdmin';

type FormData = {
  name: string; email: string; phone: string; dept: string; position: string; experience: string; message: string;
};

type FormErrors = Partial<Record<keyof FormData, string>>;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_RE = /^[+]?[\d\s-]{7,15}$/;

function validateCareerForm(form: FormData): FormErrors {
  const errors: FormErrors = {};
  if (!form.name.trim()) errors.name = 'Please enter your full name.';
  if (!form.email.trim()) errors.email = 'Please enter your email address.';
  else if (!EMAIL_RE.test(form.email.trim())) errors.email = 'Please enter a valid email address.';
  if (!form.phone.trim()) errors.phone = 'Please enter your phone number.';
  else if (!PHONE_RE.test(form.phone.trim())) errors.phone = 'Please enter a valid phone number.';
  if (!form.dept) errors.dept = 'Please select a department.';
  if (!form.position) errors.position = 'Please select a position.';
  if (!form.experience) errors.experience = 'Please select your years of experience.';
  return errors;
}

const MAX_RESUME_BYTES = 5 * 1024 * 1024; // 5MB — well under Gmail's 25MB attachment cap

// Google Apps Script Web App URL — see scripts/careers-application-apps-script.gs.txt
// for the script source and deployment steps. Sent with a text/plain content
// type (not application/json) to avoid triggering a CORS preflight, which
// Apps Script Web Apps don't reliably handle.
const CAREERS_SCRIPT_URL = import.meta.env.VITE_CAREERS_APPLICATION_SCRIPT_URL;

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve((reader.result as string).split(',')[1] ?? '');
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

export default function Careers() {
  const { docs: allOpenings } = useOrderedCollection<JobOpeningDoc>('jobOpenings', 'order');
  const perks = useContentBlocks('careers', 'perks');
  const positions = useMemo(() => {
    const byDept = new Map<string, JobOpeningDoc[]>();
    allOpenings.forEach((o) => {
      if (!byDept.has(o.department)) byDept.set(o.department, []);
      byDept.get(o.department)!.push(o);
    });
    return Array.from(byDept.entries()).map(([dept, roles]) => ({ dept, roles }));
  }, [allOpenings]);

  const [form, setForm] = useState<FormData>({ name: '', email: '', phone: '', dept: '', position: '', experience: '', message: '' });
  const [errors, setErrors] = useState<FormErrors>({});
  const [resume, setResume] = useState<File | null>(null);
  const [resumeError, setResumeError] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const setField = (key: keyof FormData, value: string) => {
    setForm((f) => ({ ...f, [key]: value }));
    setErrors((prev) => (prev[key] ? { ...prev, [key]: undefined } : prev));
  };

  useEffect(() => {
    document.title = "Careers | Vishnu Women's University";
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const el = entry.target as HTMLElement;
            setTimeout(() => el.classList.add('revealed'), parseInt(el.dataset.delay || '0'));
            observer.unobserve(el);
          }
        });
      },
      { threshold: 0.1 }
    );
    document.querySelectorAll('.reveal, .reveal-left, .reveal-right').forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const handleResumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    if (file && file.size > MAX_RESUME_BYTES) {
      setResumeError('File is too large — please upload a resume under 5MB.');
      setResume(null);
      e.target.value = '';
      return;
    }
    setResumeError('');
    setResume(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validateCareerForm(form);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setSubmitting(true);
    setSubmitError('');
    try {
      // Firestore is the system of record for applications — this must
      // succeed for the submission to count. Emailing HR (below) is a
      // best-effort convenience on top of it, not a requirement.
      await addDoc(collection(db, 'careerApplications'), {
        ...form,
        resumeFileName: resume?.name || '',
        status: 'new',
        createdAt: serverTimestamp(),
      });

      if (CAREERS_SCRIPT_URL) {
        try {
          const payload: Record<string, string> = { ...form };
          if (resume) {
            payload.resumeBase64 = await fileToBase64(resume);
            payload.resumeName = resume.name;
            payload.resumeMimeType = resume.type;
          }
          await fetch(CAREERS_SCRIPT_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'text/plain;charset=utf-8' },
            body: JSON.stringify(payload),
          });
        } catch {
          // Non-fatal — the application is already saved above.
        }
      }

      setSubmitted(true);
      setForm({ name: '', email: '', phone: '', dept: '', position: '', experience: '', message: '' });
      setResume(null);
    } catch (err) {
      setSubmitError((err as Error).message || "Couldn't submit your application. Please try again or email info@vwu.edu.in directly.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="page-wrapper">
      {/* Hero */}
      <PageHero
        page="careers"
        defaultTitle="Careers at VWU"
  defaultSubtitle="Build your career alongside a community of educators and professionals who are genuinely invested in advancing women in engineering and technology."
        breadcrumb={[{ label: 'Home', to: '/' }, { label: 'Careers' }]}
        scrollCtaTargetId="careers-content"
      />

      {/* Why Join */}
      <section id="careers-content" className="section bg-off-white" style={{ scrollMarginTop: 'calc(var(--topbar-height) + var(--header-height) + 1rem)' }}>
        <div className="container">
          <div className="reveal" style={{ textAlign: 'center', marginBottom: 'var(--space-12)' }}>
            <span className="section-label">Why VWU</span>
            <h2 className="section-title">Why Work With Us</h2>
            <p className="section-desc" style={{ margin: '0 auto' }}>
              VWU is a place where faculty and staff grow alongside students — in a focused, research-oriented academic environment.
            </p>
          </div>
          <div className="grid-3">
            {perks.map((p) => {
              const Icon = resolveContentIcon(p.icon) || GraduationCap;
              return (
                <div key={p.id}
                  style={{ background: 'var(--color-white)', border: '1.5px solid var(--color-light-gray)', borderRadius: 'var(--radius-md)', padding: 'var(--space-6)', borderLeft: '4px solid var(--color-accent)' }}>
                  <div style={{ marginBottom: 'var(--space-3)' }}><Icon size={32} strokeWidth={1.75} /></div>
                  <h3 style={{ fontFamily: 'var(--font-sans)', fontSize: 'var(--text-base)', fontWeight: 800, color: 'var(--color-primary)', marginBottom: 'var(--space-2)' }}>{p.title}</h3>
                  <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-light)', lineHeight: 1.6 }}>{p.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Open Positions */}
      <section className="section bg-white">
        <div className="container">
          <div className="reveal" style={{ marginBottom: 'var(--space-10)' }}>
            <span className="section-label">Openings</span>
            <h2 className="section-title">Current Openings</h2>
            <p className="section-desc">Applications from qualified candidates across all departments are accepted throughout the year.</p>
          </div>
          {/* Rendered from Firestore, so no scroll-reveal animation here
              (see the gotcha documented in CLAUDE.md). */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
            {positions.map((dept) => (
              <div key={dept.dept}
                style={{ border: '1.5px solid var(--color-light-gray)', borderRadius: 'var(--radius-md)', overflow: 'hidden' }}>
                <div style={{ background: 'var(--color-primary)', padding: 'var(--space-4) var(--space-6)' }}>
                  <h3 style={{ color: 'var(--color-white)', fontFamily: 'var(--font-sans)', fontWeight: 800, fontSize: 'var(--text-base)' }}>{dept.dept}</h3>
                </div>
                <div style={{ padding: 'var(--space-4) 0' }}>
                  {dept.roles.map((role) => (
                    <div key={role.id} style={{ display: 'grid', gridTemplateColumns: '1fr auto auto', gap: 'var(--space-4)', alignItems: 'center', padding: 'var(--space-3) var(--space-6)', borderBottom: '1px solid var(--color-off-white)' }}>
                      <div>
                        <div style={{ fontFamily: 'var(--font-sans)', fontWeight: 700, color: 'var(--color-primary)', fontSize: 'var(--text-sm)' }}>{role.title}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--color-text-light)', marginTop: 2 }}>{role.qualification}</div>
                      </div>
                      <span style={{ fontSize: '0.68rem', fontWeight: 700, padding: '2px 10px', borderRadius: 'var(--radius-full)', background: 'rgba(201,168,76,0.12)', border: '1px solid rgba(201,168,76,0.35)', color: 'var(--color-accent)', whiteSpace: 'nowrap' }}>
                        {role.type}
                      </span>
                      <a href="#apply" style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--color-primary)', fontFamily: 'var(--font-sans)', textTransform: 'uppercase', letterSpacing: '0.05em', whiteSpace: 'nowrap' }}>Apply →</a>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Application Form */}
      <section id="apply" className="section bg-off-white" style={{ scrollMarginTop: 'calc(var(--topbar-height) + var(--header-height) + 1rem)' }}>
        <div className="container">
          <div style={{ maxWidth: 720, margin: '0 auto' }}>
            <div className="reveal" style={{ textAlign: 'center', marginBottom: 'var(--space-10)' }}>
              <span className="section-label">Apply</span>
              <h2 className="section-title">Submit Your Application</h2>
              <p className="section-desc">Complete the form below and a member of our HR team will be in contact within 5–7 working days.</p>
            </div>

            {submitted ? (
              <div className="reveal" style={{ textAlign: 'center', background: 'var(--color-white)', border: '1.5px solid var(--color-light-gray)', borderRadius: 'var(--radius-md)', padding: 'var(--space-12)', borderTop: '4px solid var(--color-accent)' }}>
                <div style={{ marginBottom: 'var(--space-4)', display: 'flex', justifyContent: 'center' }}><CheckCircle2 size={48} strokeWidth={1.75} color="#22c55e" /></div>
                <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.5rem', color: 'var(--color-primary)', marginBottom: 'var(--space-3)' }}>Application Submitted!</h3>
                <p style={{ color: 'var(--color-text-light)', lineHeight: 1.7 }}>Thank you for applying to VWU. Our HR team will review your application and follow up with you within 5–7 working days.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="reveal" noValidate style={{ background: 'var(--color-white)', border: '1.5px solid var(--color-light-gray)', borderRadius: 'var(--radius-md)', padding: 'var(--space-8)', display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}>
                <div className="grid-2">
                  {([['name', 'Full Name', 'text'], ['email', 'Email Address', 'email'], ['phone', 'Phone Number', 'tel']] as const).map(([key, label, type]) => (
                    <div key={key} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
                      <label style={{ fontSize: 'var(--text-sm)', fontWeight: 700, color: 'var(--color-primary)', fontFamily: 'var(--font-sans)' }}>{label} *</label>
                      <input type={type} value={form[key]} onChange={e => setField(key, e.target.value)}
                        style={{ padding: 'var(--space-3) var(--space-4)', border: `1.5px solid ${errors[key] ? '#dc2626' : 'var(--color-light-gray)'}`, borderRadius: 'var(--radius-sm)', fontSize: 'var(--text-sm)', fontFamily: 'var(--font-sans)', outline: 'none', color: 'var(--color-text)' }} />
                      {errors[key] && <span style={{ fontSize: 'var(--text-xs)', color: '#dc2626' }}>{errors[key]}</span>}
                    </div>
                  ))}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
                    <label style={{ fontSize: 'var(--text-sm)', fontWeight: 700, color: 'var(--color-primary)', fontFamily: 'var(--font-sans)' }}>Years of Experience *</label>
                    <select value={form.experience} onChange={e => setField('experience', e.target.value)}
                      style={{ padding: 'var(--space-3) var(--space-4)', border: `1.5px solid ${errors.experience ? '#dc2626' : 'var(--color-light-gray)'}`, borderRadius: 'var(--radius-sm)', fontSize: 'var(--text-sm)', fontFamily: 'var(--font-sans)', outline: 'none', color: 'var(--color-text)', background: 'var(--color-white)' }}>
                      <option value="">Select</option>
                      {['Fresher', '1–3 years', '3–5 years', '5–10 years', '10+ years'].map(o => <option key={o} value={o}>{o}</option>)}
                    </select>
                    {errors.experience && <span style={{ fontSize: 'var(--text-xs)', color: '#dc2626' }}>{errors.experience}</span>}
                  </div>
                </div>
                <div className="grid-2">
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
                    <label style={{ fontSize: 'var(--text-sm)', fontWeight: 700, color: 'var(--color-primary)', fontFamily: 'var(--font-sans)' }}>Department *</label>
                    <select value={form.dept} onChange={e => setField('dept', e.target.value)}
                      style={{ padding: 'var(--space-3) var(--space-4)', border: `1.5px solid ${errors.dept ? '#dc2626' : 'var(--color-light-gray)'}`, borderRadius: 'var(--radius-sm)', fontSize: 'var(--text-sm)', fontFamily: 'var(--font-sans)', outline: 'none', color: 'var(--color-text)', background: 'var(--color-white)' }}>
                      <option value="">Select Department</option>
                      {positions.map(d => <option key={d.dept} value={d.dept}>{d.dept}</option>)}
                    </select>
                    {errors.dept && <span style={{ fontSize: 'var(--text-xs)', color: '#dc2626' }}>{errors.dept}</span>}
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
                    <label style={{ fontSize: 'var(--text-sm)', fontWeight: 700, color: 'var(--color-primary)', fontFamily: 'var(--font-sans)' }}>Position Applied For *</label>
                    <select value={form.position} onChange={e => setField('position', e.target.value)}
                      style={{ padding: 'var(--space-3) var(--space-4)', border: `1.5px solid ${errors.position ? '#dc2626' : 'var(--color-light-gray)'}`, borderRadius: 'var(--radius-sm)', fontSize: 'var(--text-sm)', fontFamily: 'var(--font-sans)', outline: 'none', color: 'var(--color-text)', background: 'var(--color-white)' }}>
                      <option value="">Select Position</option>
                      {['Professor', 'Associate Professor', 'Assistant Professor', 'Lab Technician', 'Administrative Staff', 'Other'].map(o => <option key={o} value={o}>{o}</option>)}
                    </select>
                    {errors.position && <span style={{ fontSize: 'var(--text-xs)', color: '#dc2626' }}>{errors.position}</span>}
                  </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
                  <label style={{ fontSize: 'var(--text-sm)', fontWeight: 700, color: 'var(--color-primary)', fontFamily: 'var(--font-sans)' }}>Cover Letter / Message</label>
                  <textarea rows={4} value={form.message} onChange={e => setField('message', e.target.value)}
                    placeholder="Briefly describe your qualifications, research interests, and why you'd like to join VWU..."
                    style={{ padding: 'var(--space-3) var(--space-4)', border: '1.5px solid var(--color-light-gray)', borderRadius: 'var(--radius-sm)', fontSize: 'var(--text-sm)', fontFamily: 'var(--font-sans)', outline: 'none', color: 'var(--color-text)', resize: 'vertical' }} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
                  <label style={{ fontSize: 'var(--text-sm)', fontWeight: 700, color: 'var(--color-primary)', fontFamily: 'var(--font-sans)' }}>Upload CV / Resume (PDF)</label>
                  <input type="file" accept=".pdf,.doc,.docx" onChange={handleResumeChange}
                    style={{ padding: 'var(--space-2)', border: '1.5px solid var(--color-light-gray)', borderRadius: 'var(--radius-sm)', fontSize: 'var(--text-sm)', fontFamily: 'var(--font-sans)' }} />
                  {resume && !resumeError && (
                    <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-light)' }}>Selected: {resume.name}</span>
                  )}
                  {resumeError && (
                    <span style={{ fontSize: 'var(--text-xs)', color: '#dc2626' }}>{resumeError}</span>
                  )}
                </div>
                {submitError && (
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: 'var(--space-2)', padding: 'var(--space-3) var(--space-4)', background: 'rgba(220,38,38,0.06)', border: '1px solid rgba(220,38,38,0.25)', borderRadius: 'var(--radius-sm)' }}>
                    <AlertCircle size={16} strokeWidth={2} color="#dc2626" style={{ flexShrink: 0, marginTop: 2 }} />
                    <span style={{ fontSize: 'var(--text-sm)', color: '#dc2626' }}>{submitError}</span>
                  </div>
                )}
                <button type="submit" className="btn btn-primary btn-lg" style={{ alignSelf: 'flex-start' }} disabled={submitting}>
                  {submitting ? 'Submitting…' : 'Submit Application →'}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ background: 'var(--color-primary)', padding: 'var(--space-14) 0' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <div className="reveal">
            <span className="section-label" style={{ color: 'var(--color-accent)' }}>Questions?</span>
            <h2 style={{ color: 'var(--color-white)', marginBottom: 'var(--space-4)' }}>Reach Out to HR</h2>
            <p style={{ color: 'rgba(255,255,255,0.8)', maxWidth: 480, margin: '0 auto var(--space-6)', lineHeight: 1.7 }}>
              For questions about available roles, eligibility requirements, or the selection process, write to us at <strong style={{ color: 'var(--color-accent)' }}>info@vwu.edu.in</strong> or call <strong style={{ color: 'var(--color-accent)' }}>08816-250864</strong>.
            </p>
            <Link to="/contact" className="btn btn-accent btn-lg">Contact Us</Link>
          </div>
        </div>
      </section>
    </main>
  );
}
