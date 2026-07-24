import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import emailjs from '@emailjs/browser';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import './Admissions.css';
import PageHero from '../../components/PageHero/PageHero';
import PhotoGrid from '../../components/PhotoGrid/PhotoGrid';
import { db } from '../../lib/firebase';
import { useOrderedCollection } from '../../hooks/useCollection';
import { useContentBlocks } from '../../hooks/useContentBlocks';
import { useSitePhotos, useSectionHasPhotos } from '../../hooks/useSitePhotos';
import { PHOTO_NEEDED_PLACEHOLDER } from '../../lib/photoPlaceholder';
import type { FaqDoc } from '../Admin/sections/FaqAdmin';
import { NotebookPen, ClipboardList, Users, Phone, Mail, MapPin } from 'lucide-react';
import { resolveContentIcon } from '../../lib/contentIcons';

interface RequestInfoForm {
  firstName: string;
  lastName: string;
  email: string;
  program: string;
  term: string;
}

type RequestInfoFormErrors = Partial<Record<keyof RequestInfoForm, string>>;

const INITIAL_REQUEST_FORM: RequestInfoForm = {
  firstName: '',
  lastName: '',
  email: '',
  program: '',
  term: 'Fall 2026',
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validateRequestInfoForm(form: RequestInfoForm): RequestInfoFormErrors {
  const errors: RequestInfoFormErrors = {};
  if (!form.firstName.trim()) errors.firstName = 'Please enter your first name.';
  if (!form.lastName.trim()) errors.lastName = 'Please enter your last name.';
  if (!form.email.trim()) errors.email = 'Please enter your email address.';
  else if (!EMAIL_RE.test(form.email.trim())) errors.email = 'Please enter a valid email address.';
  if (!form.program) errors.program = 'Please select a program.';
  return errors;
}

// EmailJS is frontend-only, so the "to" address for each template must be fixed
// in the EmailJS dashboard rather than passed from the client — otherwise this
// form could be used to relay email to any address a visitor supplies.
//   - VITE_EMAILJS_TEMPLATE_ID_ADMISSIONS: "To Email" set to the VWU admissions inbox.
//   - VITE_EMAILJS_TEMPLATE_ID_CONFIRMATION: an autoreply template with
//     "To Email" set to the {{email}} template variable, so it only ever
//     reaches the address the visitor themselves typed in.
const EMAILJS_SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID;
const EMAILJS_TEMPLATE_ID_ADMISSIONS = import.meta.env.VITE_EMAILJS_TEMPLATE_ID_ADMISSIONS;
const EMAILJS_TEMPLATE_ID_CONFIRMATION = import.meta.env.VITE_EMAILJS_TEMPLATE_ID_CONFIRMATION;
const EMAILJS_PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

const defaultAdmissionsPhotos = [
  { src: 'https://images.unsplash.com/photo-1562774053-701939374585?w=800&q=80', alt: 'VWU campus buildings', caption: 'VWU Campus' },
  { src: 'https://images.unsplash.com/photo-1498243691581-b145c3f54a5a?w=800&q=80', alt: 'Smart classrooms', caption: 'Smart Classrooms' },
  { src: 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=800&q=80', alt: 'Research labs', caption: 'Specialised Labs' },
  { src: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=800&q=80', alt: 'Sports court', caption: 'Sports Facilities' },
  { src: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=800&q=80', alt: 'Central library', caption: 'Central Library' },
];

const defaultUgPhotos = [
  { src: PHOTO_NEEDED_PLACEHOLDER, alt: 'B.Tech Counseling', caption: '' },
  { src: PHOTO_NEEDED_PLACEHOLDER, alt: 'UG Orientation', caption: '' },
  { src: PHOTO_NEEDED_PLACEHOLDER, alt: 'UG Lab Demos', caption: '' },
  { src: PHOTO_NEEDED_PLACEHOLDER, alt: 'Classroom Culture', caption: '' },
  { src: PHOTO_NEEDED_PLACEHOLDER, alt: 'Campus Life Preview', caption: '' },
];

const defaultPgPhotos = [
  { src: PHOTO_NEEDED_PLACEHOLDER, alt: 'PG Seminar & Orientation', caption: '' },
  { src: PHOTO_NEEDED_PLACEHOLDER, alt: 'Specialization Research', caption: '' },
  { src: PHOTO_NEEDED_PLACEHOLDER, alt: 'PG Industry Meetups', caption: '' },
  { src: PHOTO_NEEDED_PLACEHOLDER, alt: 'Advanced Computing', caption: '' },
  { src: PHOTO_NEEDED_PLACEHOLDER, alt: 'Graduation Day Prep', caption: '' },
];

export default function Admissions() {
  const { docs: allFaqs } = useOrderedCollection<FaqDoc>('faqs', 'order');
  const faqs = allFaqs.filter((f) => f.page === 'admissions');
  const scholarships = useContentBlocks('admissions', 'scholarships');
  const tuitionData = useContentBlocks('admissions', 'tuitionData');
  const steps = useContentBlocks('admissions', 'steps');
  const admissionHub = useContentBlocks('admissions', 'admissionHub');
  const visitOptions = useContentBlocks('admissions', 'visitOptions');
  const admissionsPhotos = useSitePhotos('admissions', 'main', defaultAdmissionsPhotos);
  const ugPhotos = useSitePhotos('admissions', 'ug', defaultUgPhotos);
  const hasUgPhotos = useSectionHasPhotos('admissions', 'ug');
  const pgPhotos = useSitePhotos('admissions', 'pg', defaultPgPhotos);
  const hasPgPhotos = useSectionHasPhotos('admissions', 'pg');
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [requestForm, setRequestForm] = useState<RequestInfoForm>(INITIAL_REQUEST_FORM);
  const [requestErrors, setRequestErrors] = useState<RequestInfoFormErrors>({});
  const [requestStatus, setRequestStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');

  const handleRequestFormChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setRequestForm((prev) => ({ ...prev, [name]: value }));
    setRequestErrors((prev) => (prev[name as keyof RequestInfoForm] ? { ...prev, [name]: undefined } : prev));
  };

  const handleRequestInfoSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validateRequestInfoForm(requestForm);
    if (Object.keys(validationErrors).length > 0) {
      setRequestErrors(validationErrors);
      return;
    }

    setRequestStatus('submitting');
    try {
      // Firestore is the system of record for these inquiries — this must
      // succeed for the submission to count. Emailing admissions/the visitor
      // (below) via EmailJS is a best-effort convenience on top of it.
      await addDoc(collection(db, 'admissionInquiries'), {
        ...requestForm,
        status: 'new',
        createdAt: serverTimestamp(),
      });

      if (EMAILJS_SERVICE_ID && EMAILJS_TEMPLATE_ID_ADMISSIONS && EMAILJS_TEMPLATE_ID_CONFIRMATION && EMAILJS_PUBLIC_KEY) {
        const templateParams = {
          first_name: requestForm.firstName,
          last_name: requestForm.lastName,
          email: requestForm.email,
          program: requestForm.program,
          term: requestForm.term,
        };
        try {
          await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID_ADMISSIONS, templateParams, EMAILJS_PUBLIC_KEY);
          await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID_CONFIRMATION, templateParams, EMAILJS_PUBLIC_KEY);
        } catch {
          // Non-fatal — the inquiry is already saved above.
        }
      }

      setRequestStatus('success');
      setRequestForm(INITIAL_REQUEST_FORM);
      setRequestErrors({});
    } catch {
      setRequestStatus('error');
    }
  };

  useEffect(() => {
    document.title = 'Admissions | Vishnu Womens University';
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const el = entry.target as HTMLElement;
            const delay = el.dataset.delay || '0';
            setTimeout(() => el.classList.add('revealed'), parseInt(delay));
            observer.unobserve(el);
          }
        });
      },
      { threshold: 0.1 }
    );
    document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale').forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <main className="page-wrapper">
      {/* Hero */}
      <PageHero
        page="admissions"
        defaultImage="https://images.unsplash.com/photo-1607237138185-eedd9c632b0b?w=1920&q=80"
        defaultTitle="Your Journey Starts Here"
  defaultSubtitle="Choosing VWU sets you on a path to a fulfilling engineering career, a strong professional network, and a future built on real achievement."
        breadcrumb={[{ label: 'Home', to: '/' }, { label: 'Admissions' }]}
        scrollCtaTargetId="admissions-content"
      />

      {/* Admissions Hub */}
      <section id="admissions-content" className="section bg-off-white" style={{ paddingBottom: 0, scrollMarginTop: 'calc(var(--topbar-height) + var(--header-height) + 1rem)' }}>
        <div className="container">
          <div className="reveal" style={{ textAlign: 'center', marginBottom: 'var(--space-8)' }}>
            <span className="section-label">Admissions</span>
            <h2 className="section-title">Everything You Need to Apply</h2>
            <p className="section-desc" style={{ margin: '0 auto' }}>
              Everything you need to apply — fees, step-by-step procedure, results, and the payment portal — in one place.
            </p>
          </div>
          <div className="adm-hub-grid">
            {admissionHub.map((item) => {
              const Icon = resolveContentIcon(item.icon) || ClipboardList;
              // A content block's "slug" is normally an internal route, but admins
              // can also paste a full external URL (e.g. the fee payment gateway) —
              // route those through <a target="_blank"> instead of React Router's
              // <Link>, which can't navigate to an off-site address.
              const isExternal = /^https?:\/\//.test(item.slug);
              const cardBody = (
                <>
                  <div className="adm-hub-icon"><Icon size={38} strokeWidth={1.75} /></div>
                  <div className="adm-hub-highlight">{item.value}</div>
                  <h3 className="adm-hub-title">{item.title}</h3>
                  <p className="adm-hub-desc">{item.desc}</p>
                  <span className="adm-hub-arrow">View Details →</span>
                </>
              );
              return isExternal ? (
                <a href={item.slug} key={item.id} target="_blank" rel="noopener noreferrer" className="adm-hub-card">
                  {cardBody}
                </a>
              ) : (
                <Link to={item.slug || '/admissions'} key={item.id} className="adm-hub-card">
                  {cardBody}
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Steps to Enroll */}
      <section id="apply" className="section bg-off-white">
        <div className="container">
          <div className="reveal" style={{ textAlign: 'center', maxWidth: 600, margin: '0 auto var(--space-12)' }}>
            <span className="section-label">How to Apply</span>
            <h2 className="section-title">5 Steps to Join VWU</h2>
          </div>
          <div className="adm-steps">
            {steps.map((s, i) => {
              const Icon = resolveContentIcon(s.icon) || NotebookPen;
              return (
                <div key={s.id} className="adm-step">
                  <div className="adm-step-number">{i + 1}</div>
                  <div className="adm-step-icon"><Icon size={32} strokeWidth={1.75} /></div>
                  <h3 className="adm-step-title">{s.title}</h3>
                  <p className="adm-step-desc">{s.desc}</p>
                </div>
              );
            })}
          </div>
          <div style={{ textAlign: 'center', marginTop: 'var(--space-10)' }}>
            <button
              type="button"
              className="btn btn-primary btn-lg"
              onClick={() => document.getElementById('admissions-contact')?.scrollIntoView({ behavior: 'smooth' })}
            >
              Start Your Application
            </button>
          </div>
        </div>
      </section>

      {/* Scholarships */}
      <section className="section bg-white">
        <div className="container">
          <div className="reveal" style={{ marginBottom: 'var(--space-10)' }}>
            <span className="section-label">Financial Support</span>
            <h2 className="section-title">Make VWU Accessible</h2>
            <p className="section-desc">
              VWU helps students access government scholarships, fee reimbursement schemes, and
              merit-based awards so that quality engineering education is genuinely within reach.
            </p>
          </div>

          <div className="adm-scholarship-grid">
            {scholarships.map((s) => (
              <div key={s.id} className="adm-scholarship-card">
                <div className="adm-scholarship-header">
                  <h3>{s.title}</h3>
                  <div className="adm-scholarship-amount">{s.value}</div>
                </div>
                <p className="adm-scholarship-criteria">{s.desc}</p>
              </div>
            ))}
          </div>

          <div className="adm-fafsa-cta reveal" data-delay="200">
            <div className="adm-fafsa-icon"><ClipboardList size={44} strokeWidth={1.75} /></div>
            <div>
              <h3>Apply for AP Scholarships</h3>
              <p>Submit applications for AP government scholarships, SC/ST/BC fee reimbursement, and central government scholarship schemes through the National Scholarship Portal.</p>
            </div>
            <a href="https://scholarships.gov.in/" target="_blank" rel="noopener noreferrer" className="btn btn-accent">Check Scholarship Eligibility</a>
          </div>
        </div>
      </section>

      {/* Tuition */}
      <section className="section" style={{ background: 'var(--color-primary)' }}>
        <div className="container">
          <div className="adm-tuition-grid">
            <div className="reveal-left">
              <span className="section-label" style={{ color: 'var(--color-accent)' }}>Fee Structure</span>
              <h2 className="section-title" style={{ color: 'var(--color-white)' }}>Understanding the Investment</h2>
              <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 'var(--text-lg)', lineHeight: 1.7, marginBottom: 'var(--space-6)' }}>
                B.Tech tuition is ₹1,05,000 per year. M.Tech is ₹55,800 and MBA is ₹55,000 annually.
                Through government scholarships, SC/ST/BC fee reimbursement, and the PM Vidyalaxmi Scheme,
                a VWU education is financially accessible to every deserving student.
              </p>
              <Link to="/programmes-fee-structure" className="btn btn-accent">View Full Fee Structure</Link>
            </div>
            <div className="adm-tuition-table">
              {tuitionData.map((row, i) => (
                <div key={row.id} className="adm-tuition-row" style={{ borderTop: i === tuitionData.length - 2 ? '2px solid rgba(201,168,76,0.4)' : undefined }}>
                  <span>{row.title}</span>
                  <strong style={{ color: i >= tuitionData.length - 2 ? 'var(--color-accent)' : 'var(--color-white)' }}>{row.value}</strong>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Campus Visit */}
      <section id="visit" className="section bg-off-white">
        <div className="container">
          <div className="reveal" style={{ textAlign: 'center', maxWidth: 600, margin: '0 auto var(--space-12)' }}>
            <span className="section-label">Campus Visits</span>
            <h2 className="section-title">Come See VWU for Yourself</h2>
            <p className="section-desc" style={{ margin: '0 auto' }}>
              Seeing VWU in person is the best way to know if it is the right fit for you. Choose the visit format that suits you best.
            </p>
          </div>
          <div className="adm-visit-grid">
            {visitOptions.map((v) => {
              const Icon = resolveContentIcon(v.icon) || Users;
              return (
                <div key={v.id} className="adm-visit-card">
                  <div className="adm-visit-icon"><Icon size={40} strokeWidth={1.75} /></div>
                  <h3>{v.title}</h3>
                  <p>{v.desc}</p>
                  <Link to="/admissions" className="btn btn-outline" style={{ marginTop: 'auto' }}>Schedule Now</Link>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Campus Photos */}
      <section className="section bg-off-white">
        <div className="container">
          <PhotoGrid
            images={admissionsPhotos}
            label="Why VWU"
            title="Experience the VWU Difference"
            subtitle="From modern labs and smart classrooms to hostels, sports grounds, and a buzzing placement season — see what awaits you at VWU."
            highlights={[
              'EAPCET college code: VISW',
              '1,400+ placements in 2024–25 alone',
              'Highest package: ₹59.28 LPA',
              '100% scholarship coverage available for eligible students',
              'Campus visit & virtual tour options available',
            ]}
            columns={2}
            layout="side-text"
          />
        </div>
      </section>

      {/* Undergraduate (UG) — hidden until real photos are added */}
      {hasUgPhotos && (
        <section className="section bg-off-white">
          <div className="container">
            <PhotoGrid
              images={ugPhotos}
              label="Undergraduate (UG)"
              title="Your B.Tech Journey Starts Here"
              columns={3}
              layout="default"
            />
          </div>
        </section>
      )}

      {/* Postgraduate (PG) — hidden until real photos are added */}
      {hasPgPhotos && (
        <section className="section bg-white">
          <div className="container">
            <PhotoGrid
              images={pgPhotos}
              label="Postgraduate (PG)"
              title="Advance Your Career with a PG Degree"
              columns={3}
              layout="default"
            />
          </div>
        </section>
      )}

      {/* Contact Admissions */}
      <section id="admissions-contact" className="section bg-white">
        <div className="container">
          <div className="adm-contact-grid">
            <div className="reveal-left">
              <span className="section-label">Contact Us</span>
              <h2 className="section-title">Talk to Our Admissions Team</h2>
              <p className="section-desc" style={{ marginBottom: 'var(--space-6)' }}>
                Our admissions team is ready to answer your questions, walk you through each step,
                and help you find your path at VWU.
              </p>
              <div className="adm-contact-info">
                <div className="adm-contact-item">
                  <Phone size={22} strokeWidth={1.75} />
                  <div>
                    <strong>Phone</strong>
                    <a href="tel:08816250864">08816-250864</a>
                  </div>
                </div>
                <div className="adm-contact-item">
                  <Mail size={22} strokeWidth={1.75} />
                  <div>
                    <strong>Email</strong>
                    <a href="mailto:info@svecw.edu.in">info@svecw.edu.in</a>
                  </div>
                </div>
                <div className="adm-contact-item">
                  <MapPin size={22} strokeWidth={1.75} />
                  <div>
                    <strong>Office Location</strong>
                    <span>Bhimavaram, West Godavari Dist., AP – 534 202</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="adm-form-card reveal-right">
              <h3>Request Information</h3>
              <form onSubmit={handleRequestInfoSubmit} className="adm-form" noValidate>
                <div className="adm-form-row">
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
                </div>
                <div className="adm-form-group">
                  <label>Email Address</label>
                  <input
                    type="email" name="email" placeholder="your@email.com"
                    value={requestForm.email} onChange={handleRequestFormChange}
                    className={requestErrors.email ? 'has-error' : undefined}
                    aria-invalid={!!requestErrors.email}
                  />
                  {requestErrors.email && <span className="adm-form-error">{requestErrors.email}</span>}
                </div>
                <div className="adm-form-group">
                  <label>Program Interest</label>
                  <select
                    name="program" value={requestForm.program} onChange={handleRequestFormChange}
                    className={requestErrors.program ? 'has-error' : undefined}
                    aria-invalid={!!requestErrors.program}
                  >
                    <option value="">Select a program...</option>
                    <option>B.Tech – CSE / AI&ML / AI&DS / Cyber Security</option>
                    <option>B.Tech – ECE / EEE / IT</option>
                    <option>B.Tech – Civil / Mechanical Engineering</option>
                    <option>M.Tech Programs</option>
                    <option>MBA</option>
                    <option>Ph.D. Programs</option>
                  </select>
                  {requestErrors.program && <span className="adm-form-error">{requestErrors.program}</span>}
                </div>
                <div className="adm-form-group">
                  <label>Expected Start Term</label>
                  <select name="term" value={requestForm.term} onChange={handleRequestFormChange}>
                    <option>Fall 2026</option>
                    <option>Spring 2027</option>
                    <option>Fall 2027</option>
                  </select>
                </div>
                <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={requestStatus === 'submitting'}>
                  {requestStatus === 'submitting' ? 'Sending…' : 'Request Information'}
                </button>
                {requestStatus === 'success' && (
                  <p style={{ marginTop: 'var(--space-3)', fontSize: 'var(--text-sm)', color: 'var(--color-primary)' }}>
                    Thanks! We've received your request. Our admissions team will be in touch shortly.
                  </p>
                )}
                {requestStatus === 'error' && (
                  <p style={{ marginTop: 'var(--space-3)', fontSize: 'var(--text-sm)', color: '#b3261e' }}>
                    Something went wrong sending your request. Please try again or email us directly.
                  </p>
                )}
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="section bg-off-white">
        <div className="container">
          <div className="reveal" style={{ textAlign: 'center', maxWidth: 600, margin: '0 auto var(--space-12)' }}>
            <span className="section-label">FAQ</span>
            <h2 className="section-title">Frequently Asked Questions</h2>
            <p className="section-desc" style={{ margin: '0 auto' }}>
              Common questions about joining VWU, answered. If you do not find what you are looking for, contact our admissions team directly.
            </p>
          </div>
          <div className="adm-faq-list">
            {/* Items render from Firestore, so no scroll-reveal animation here
                (see the gotcha documented in CLAUDE.md). */}
            {faqs.map((faq, i) => (
              <div key={faq.id} className={`adm-faq-card${openFaq === i ? ' open' : ''}`}>
                <button
                  className="adm-faq-question"
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  aria-expanded={openFaq === i}
                >
                  <span>{faq.question}</span>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0, transition: 'transform 0.3s', transform: openFaq === i ? 'rotate(180deg)' : 'rotate(0deg)' }}>
                    <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
                {/* Always mounted — collapse is done purely with CSS (grid-template-rows),
                    so the answer animates open/closed instead of hard-mounting/unmounting. */}
                <div className="adm-faq-collapse" aria-hidden={openFaq !== i}>
                  <div className="adm-faq-collapse-inner">
                    <div className="adm-faq-answer">{faq.answer}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div style={{ textAlign: 'center', marginTop: 'var(--space-10)' }}>
            <p style={{ color: 'var(--color-text-light)', marginBottom: 'var(--space-4)' }}>Still have questions?</p>
            <a href="tel:08816250864" className="btn btn-primary btn-lg">Call Admissions: 08816-250864</a>
          </div>
        </div>
      </section>
    </main>
  );
}
