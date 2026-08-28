import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import './CampusVisit.css';
import PageHero from '../../components/PageHero/PageHero';
import { db } from '../../lib/firebase';
import { useOrderedCollection } from '../../hooks/useCollection';
import { useContentBlocks } from '../../hooks/useContentBlocks';
import type { ProgramDoc } from '../Admin/sections/ProgramsAdmin';
import { Users, User, Video, GraduationCap } from 'lucide-react';

type VisitType = 'group' | 'individual' | 'virtual' | 'openday';

const VISIT_TYPES: { key: VisitType; title: string; desc: string; icon: typeof Users }[] = [
  { key: 'group', title: 'Group Campus Tour', desc: 'For schools, colleges, or any group of prospective students visiting together.', icon: Users },
  { key: 'individual', title: 'Individual Visit Day', desc: 'A personalised campus visit for a single prospective student and family.', icon: User },
  { key: 'virtual', title: 'Virtual Campus Tour', desc: 'Explore VWU from anywhere — watch our virtual campus tour video.', icon: Video },
  { key: 'openday', title: 'Open Day for Admitted Students', desc: 'A full-day department interaction day for students who have already been admitted.', icon: GraduationCap },
];

const PERSON_COUNTS = ['2-5', '6-10', '11-20', '20+'];

interface VisitForm {
  fullName: string;
  email: string;
  phone: string;
  preferredDate: string;
  numberOfPersons: string;
  department: string;
  program: string;
  message: string;
}

type VisitFormErrors = Partial<Record<keyof VisitForm, string>>;

const INITIAL_FORM: VisitForm = {
  fullName: '', email: '', phone: '', preferredDate: '',
  numberOfPersons: '', department: '', program: '', message: '',
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validate(type: VisitType, form: VisitForm): VisitFormErrors {
  const errors: VisitFormErrors = {};
  if (!form.fullName.trim()) errors.fullName = 'Please enter your name.';
  if (!form.email.trim()) errors.email = 'Please enter your email address.';
  else if (!EMAIL_RE.test(form.email.trim())) errors.email = 'Please enter a valid email address.';
  if (!form.phone.trim()) errors.phone = 'Please enter a phone number.';
  if (!form.preferredDate) errors.preferredDate = 'Please choose a preferred date.';
  if (type === 'group' && !form.numberOfPersons) errors.numberOfPersons = 'Please select the number of visitors.';
  if (type === 'openday') {
    if (!form.department) errors.department = 'Please select a department.';
    if (!form.program) errors.program = 'Please select a program.';
  }
  return errors;
}

export default function CampusVisit() {
  const [searchParams] = useSearchParams();
  const requestedType = searchParams.get('type');
  const initialType = VISIT_TYPES.some((t) => t.key === requestedType) ? (requestedType as VisitType) : 'group';
  const [activeType, setActiveType] = useState<VisitType>(initialType);

  const { docs: programs } = useOrderedCollection<ProgramDoc>('programs', 'order');
  const videoBlocks = useContentBlocks('campus-visit', 'video');
  const video = videoBlocks[0];

  const departments = useMemo(() => {
    const seen = new Set<string>();
    programs.forEach((p) => { if (p.department) seen.add(p.department); });
    return Array.from(seen);
  }, [programs]);

  const [form, setForm] = useState<VisitForm>(INITIAL_FORM);
  const [errors, setErrors] = useState<VisitFormErrors>({});
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');

  // Switching visit type resets the form — each type's own required fields
  // (and any error/success banner from the previous type) shouldn't carry over.
  useEffect(() => {
    setForm(INITIAL_FORM);
    setErrors({});
    setStatus('idle');
  }, [activeType]);

  useEffect(() => {
    document.title = "Campus Visit | Vishnu Women's University";
  }, []);

  const programsInDepartment = useMemo(
    () => programs.filter((p) => p.department === form.department),
    [programs, form.department]
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value, ...(name === 'department' ? { program: '' } : {}) }));
    setErrors((prev) => (prev[name as keyof VisitForm] ? { ...prev, [name]: undefined } : prev));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validate(activeType, form);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setStatus('submitting');
    try {
      await addDoc(collection(db, 'campusVisitRequests'), {
        type: activeType,
        fullName: form.fullName.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        preferredDate: form.preferredDate,
        numberOfPersons: activeType === 'group' ? form.numberOfPersons : '',
        department: activeType === 'openday' ? form.department : '',
        program: activeType === 'openday' ? form.program : '',
        message: form.message.trim(),
        status: 'new',
        createdAt: serverTimestamp(),
      });
      setStatus('success');
      setForm(INITIAL_FORM);
    } catch {
      setStatus('error');
    }
  };

  return (
    <main className="page-wrapper">
      <PageHero
        page="campus-visit"
        defaultTitle="Come See VWU for Yourself"
        defaultSubtitle="Seeing VWU in person is the best way to know if it is the right fit for you. Choose the visit format that suits you best."
        breadcrumb={[{ label: 'Home', to: '/' }, { label: 'Admissions', to: '/admissions' }, { label: 'Campus Visit' }]}
        scrollCtaTargetId="visit-picker"
      />

      <section id="visit-picker" className="section bg-off-white" style={{ scrollMarginTop: 'calc(var(--topbar-height) + var(--header-height) + 1rem)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: 600, margin: '0 auto var(--space-10)' }}>
            <span className="section-label">Campus Visits</span>
            <h2 className="section-title">Choose Your Visit</h2>
          </div>

          <div className="cv-type-grid">
            {VISIT_TYPES.map((t) => {
              const Icon = t.icon;
              return (
                <button
                  key={t.key}
                  type="button"
                  className={`cv-type-card${activeType === t.key ? ' active' : ''}`}
                  onClick={() => setActiveType(t.key)}
                >
                  <div className="cv-type-icon"><Icon size={32} strokeWidth={1.75} /></div>
                  <h3>{t.title}</h3>
                  <p>{t.desc}</p>
                </button>
              );
            })}
          </div>

          {activeType === 'virtual' ? (
            <div className="cv-video-card">
              {video?.value ? (
                <div className="cv-video-embed">
                  <iframe
                    src={video.value}
                    title="VWU Virtual Campus Tour"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              ) : (
                <p className="cv-video-empty">Our virtual campus tour video is coming soon. Please check back shortly.</p>
              )}
            </div>
          ) : (
            <div className="cv-form-card">
              <h3>{VISIT_TYPES.find((t) => t.key === activeType)?.title}</h3>
              <form onSubmit={handleSubmit} className="cv-form" noValidate>
                <div className="cv-form-row">
                  <div className="cv-form-group">
                    <label>Full Name</label>
                    <input
                      type="text" name="fullName" placeholder="Your full name"
                      value={form.fullName} onChange={handleChange}
                      className={errors.fullName ? 'has-error' : undefined}
                      aria-invalid={!!errors.fullName}
                    />
                    {errors.fullName && <span className="cv-form-error">{errors.fullName}</span>}
                  </div>
                  <div className="cv-form-group">
                    <label>Phone Number</label>
                    <input
                      type="tel" name="phone" placeholder="10-digit mobile number"
                      value={form.phone} onChange={handleChange}
                      className={errors.phone ? 'has-error' : undefined}
                      aria-invalid={!!errors.phone}
                    />
                    {errors.phone && <span className="cv-form-error">{errors.phone}</span>}
                  </div>
                </div>

                <div className="cv-form-row">
                  <div className="cv-form-group">
                    <label>Email Address</label>
                    <input
                      type="email" name="email" placeholder="your@email.com"
                      value={form.email} onChange={handleChange}
                      className={errors.email ? 'has-error' : undefined}
                      aria-invalid={!!errors.email}
                    />
                    {errors.email && <span className="cv-form-error">{errors.email}</span>}
                  </div>
                  <div className="cv-form-group">
                    <label>Preferred Visit Date</label>
                    <input
                      type="date" name="preferredDate"
                      value={form.preferredDate} onChange={handleChange}
                      className={errors.preferredDate ? 'has-error' : undefined}
                      aria-invalid={!!errors.preferredDate}
                    />
                    {errors.preferredDate && <span className="cv-form-error">{errors.preferredDate}</span>}
                  </div>
                </div>

                {activeType === 'group' && (
                  <div className="cv-form-group">
                    <label>Number of Visitors</label>
                    <select
                      name="numberOfPersons" value={form.numberOfPersons} onChange={handleChange}
                      className={errors.numberOfPersons ? 'has-error' : undefined}
                      aria-invalid={!!errors.numberOfPersons}
                    >
                      <option value="">Select…</option>
                      {PERSON_COUNTS.map((c) => <option key={c} value={c}>{c} people</option>)}
                    </select>
                    {errors.numberOfPersons && <span className="cv-form-error">{errors.numberOfPersons}</span>}
                  </div>
                )}

                {activeType === 'openday' && (
                  <div className="cv-form-row">
                    <div className="cv-form-group">
                      <label>Department</label>
                      <select
                        name="department" value={form.department} onChange={handleChange}
                        className={errors.department ? 'has-error' : undefined}
                        aria-invalid={!!errors.department}
                      >
                        <option value="">Select a department...</option>
                        {departments.map((d) => <option key={d} value={d}>{d}</option>)}
                      </select>
                      {errors.department && <span className="cv-form-error">{errors.department}</span>}
                    </div>
                    <div className="cv-form-group">
                      <label>Program</label>
                      <select
                        name="program" value={form.program} onChange={handleChange}
                        disabled={!form.department}
                        className={errors.program ? 'has-error' : undefined}
                        aria-invalid={!!errors.program}
                      >
                        <option value="">{form.department ? 'Select a program...' : 'Select a department first'}</option>
                        {programsInDepartment.map((p) => <option key={p.id} value={p.name}>{p.name}</option>)}
                      </select>
                      {errors.program && <span className="cv-form-error">{errors.program}</span>}
                    </div>
                  </div>
                )}

                <div className="cv-form-group">
                  <label>Additional Notes (optional)</label>
                  <textarea
                    name="message" rows={3} value={form.message} onChange={handleChange}
                    placeholder="Anything else we should know — group/institution name, accessibility needs, preferred time, etc."
                  />
                </div>

                <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={status === 'submitting'}>
                  {status === 'submitting' ? 'Sending…' : 'Request This Visit'}
                </button>
                {status === 'success' && (
                  <p style={{ marginTop: 'var(--space-3)', fontSize: 'var(--text-sm)', color: 'var(--color-primary)' }}>
                    Thanks! We've received your request. Our admissions team will be in touch shortly to confirm.
                  </p>
                )}
                {status === 'error' && (
                  <p style={{ marginTop: 'var(--space-3)', fontSize: 'var(--text-sm)', color: '#b3261e' }}>
                    Something went wrong sending your request. Please try again or contact admissions directly.
                  </p>
                )}
              </form>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
