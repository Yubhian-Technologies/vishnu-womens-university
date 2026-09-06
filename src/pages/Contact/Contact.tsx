import { useState, useEffect } from 'react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import SEO from '../../components/SEO/SEO';
import {
  Mail,
  MapPin,
  GraduationCap,
  Briefcase,
  Building2,
  Clock,
  Send,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  ShieldAlert,
  Train,
  Plane,
  Bus,
  Sparkles,
  FileCheck2,
  PhoneCall,
  Headphones,
} from 'lucide-react';
import { useOrderedCollection } from '../../hooks/useCollection';
import { useContentBlocks } from '../../hooks/useContentBlocks';
import { usePageBanner } from '../../hooks/usePageBanner';
import { useSiteContact, DEFAULT_PHONE } from '../../hooks/useSiteContact';
import { resolveContentIcon } from '../../lib/contentIcons';
import type { ContactDoc } from '../Admin/sections/ContactsAdmin';
import './Contact.css';

interface ContactForm {
  name: string;
  email: string;
  phone: string;
  subject: string;
  category: string;
  message: string;
}

interface ContactFormErrors {
  name?: string;
  email?: string;
  phone?: string;
  subject?: string;
  category?: string;
  message?: string;
}

const INITIAL_FORM: ContactForm = {
  name: '',
  email: '',
  phone: '',
  // Matches the "Admissions Enquiry" category below, which starts pre-selected,
  // so the Subject Summary is in sync with the selected category from the
  // very first render, not just after the category dropdown changes.
  subject: 'Admissions Enquiry',
  category: 'Admissions Enquiry',
  message: '',
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_RE = /^[+]?[\d\s-]{7,15}$/;

function validateContactForm(form: ContactForm): ContactFormErrors {
  const errors: ContactFormErrors = {};
  if (!form.name.trim()) errors.name = 'Please enter your full name.';
  if (!form.email.trim()) errors.email = 'Please enter your email address.';
  else if (!EMAIL_RE.test(form.email.trim())) errors.email = 'Please enter a valid email address.';
  if (form.phone.trim() && !PHONE_RE.test(form.phone.trim())) errors.phone = 'Please enter a valid phone number.';
  if (!form.subject.trim()) errors.subject = 'Please enter a subject.';
  if (!form.message.trim()) errors.message = 'Please enter your message.';
  else if (form.message.trim().length < 10) errors.message = 'Message should be at least 10 characters.';
  return errors;
}

const CATEGORY_OPTIONS = [
  'Admissions Enquiry',
  'Academic Information',
  'Fee & Scholarships',
  'Placements & Careers',
  'Hostel & Campus Facilities',
  'Examinations & Transcripts',
  'Research & Collaboration',
  'General Enquiry',
  'Others',
];

const DEFAULT_INFO_CARDS = [
  {
    id: 'default-info-1',
    title: 'Green Meadows Campus',
    desc: 'Vishnupur, Bhimavaram\nPincode - 534202, West Godavari District, AP, India\nPhone: 08816-250864',
    value: 'Main Campus',
    slug: '08816-250864',
    icon: 'MapPin',
  },
  {
    id: 'default-info-2',
    title: 'Email Us',
    desc: 'Email: info@vwu.edu.in\nGeneral Enquiry & Support',
    value: 'Mon – Sat: 9:00 AM – 5:00 PM IST',
    slug: 'info@vwu.edu.in',
    icon: 'Mail',
  },
  {
    id: 'default-info-3',
    title: 'Society Headquarters',
    desc: 'Plot 7 & 8, Nagarjuna Hills, Punjagutta Main Road\nHyderabad - 500 082, Telangana\nPhones: 040-40334899 / 897 / 866 / 829',
    value: 'SVES Central Office',
    slug: '040-40334818 / 4848',
    icon: 'Building2',
  },
  {
    id: 'default-info-4',
    title: 'Admissions Quick Info',
    desc: 'EAPCET Code: VISW, VISWPU\nEmail: admissions@vwu.edu.in\nHelpline: +91 8816 250864',
    value: 'Mon – Sat: 9:00 AM – 5:00 PM IST',
    slug: 'Admissions Desk',
    icon: 'GraduationCap',
  },
];

const DEFAULT_DEPT_CONTACTS: ContactDoc[] = [
  { id: 'dept-1', dept: 'Computer Science & Engineering (CSE)', hod: 'DR. P. KIRAN SREE', phone: '', email: 'hod_cse@vwu.edu.in', order: 1 },
  { id: 'dept-2', dept: 'Artificial Intelligence & Data Science (AI & DS)', hod: 'DR. M. SRIDEVI', phone: '', email: 'hod_aids@vwu.edu.in', order: 2 },
  { id: 'dept-3', dept: 'Electronics & Communication Engineering (ECE)', hod: 'DR. J. SOMLAL', phone: '', email: 'hod_ece@vwu.edu.in', order: 3 },
  { id: 'dept-4', dept: 'Electrical & Electronics Engineering (EEE)', hod: 'DR. K. RAYUDU', phone: '', email: 'hod_eee@vwu.edu.in', order: 4 },
  { id: 'dept-5', dept: 'Information Technology (IT)', hod: 'DR. CH. SRINIVAS', phone: '', email: 'hod_it@vwu.edu.in', order: 5 },
  { id: 'dept-6', dept: 'Basic Sciences & Humanities (BS&H)', hod: 'DR. V. RAMA DEVI', phone: '', email: 'hod_bsh@vwu.edu.in', order: 6 },
  { id: 'dept-7', dept: 'Department of Management Studies (MBA)', hod: 'DR. T. SUDHA', phone: '', email: 'hod_mba@vwu.edu.in', order: 7 },
  { id: 'dept-8', dept: 'Examinations & Student Evaluation Cell', hod: 'CONTROLLER OF EXAMINATIONS', phone: '', email: 'ce@vwu.edu.in', order: 8 },
];

const DEFAULT_SOCIAL_LINKS = [
  { id: 'soc-1', title: 'LinkedIn', value: 'https://www.linkedin.com/school/vishnu-womens-university', icon: 'linkedin' },
  { id: 'soc-2', title: 'YouTube', value: 'https://youtube.com/@vishnuwomensuniversity', icon: 'youtube' },
  { id: 'soc-3', title: 'Instagram', value: 'https://instagram.com/vishnu_womens_univ', icon: 'instagram' },
  { id: 'soc-4', title: 'Facebook', value: 'https://facebook.com/vishnuwomensuniversity', icon: 'facebook' },
  { id: 'soc-5', title: 'Twitter', value: 'https://twitter.com/vishnuuniv', icon: 'twitter' },
];

const SOCIAL_META: Record<string, { label: string; color: string; glyph: string }> = {
  LinkedIn: { label: 'LinkedIn', color: '#0077b5', glyph: 'in' },
  YouTube: { label: 'YouTube', color: '#ff0000', glyph: '▶' },
  Instagram: { label: 'Instagram', color: '#e1306c', glyph: '◎' },
  Facebook: { label: 'Facebook', color: '#1877f2', glyph: 'f' },
  Twitter: { label: 'X (Twitter)', color: '#111827', glyph: '𝕏' },
};

export default function Contact() {
  const { docs: liveDeptContacts } = useOrderedCollection<ContactDoc>('contacts', 'order');
  const liveInfoCards = useContentBlocks('contact', 'infoCards');
  const liveSocialLinks = useContentBlocks('contact', 'socialLinks');
  const { email: siteEmail, phone: sitePhone } = useSiteContact();
  const defaultPhoneDigits = DEFAULT_PHONE.replace(/\D/g, '');
  const banner = usePageBanner('contact');

  // Two independent info-card fixes compose here, in order: legacy email
  // domains and a missing admissions address get normalized first (our
  // guardrails below), then the live Site Contact Info substitution
  // (origin/main, further down) runs on top of that already-normalized
  // text — so a card can be both "fixed up" and still track the
  // admin-managed phone/email as the single source of truth.
  const rawInfoCards = liveInfoCards.length > 0 ? liveInfoCards : DEFAULT_INFO_CARDS;
  const infoCardsLegacyNormalized = rawInfoCards.map((c) => {
    let desc = c.desc ? c.desc.replace(/@vishnu\.edu\.in|@srivishnu\.edu\.in|@svecw\.edu\.in/gi, '@vwu.edu.in') : '';
    if ((c.title.toLowerCase().includes('admission') || c.title.toLowerCase().includes('quick info')) && !desc.includes('admissions@vwu.edu.in')) {
      desc = desc ? `Email: admissions@vwu.edu.in\n${desc}` : 'Email: admissions@vwu.edu.in';
    }
    return {
      ...c,
      desc,
    };
  });

  const rawDeptContacts = liveDeptContacts.length > 0 ? liveDeptContacts : DEFAULT_DEPT_CONTACTS;
  const deptContacts = rawDeptContacts.map((d) => {
    let email = d.email ? d.email.trim() : '';
    if (email.includes('@')) {
      email = email.replace(/@[^@]+$/, '@vwu.edu.in');
    } else if (email) {
      email = `${email}@vwu.edu.in`;
    }
    return {
      ...d,
      hod: d.hod ? d.hod.toUpperCase() : '',
      phone: '', // Guardrail: Mobile numbers removed
      email,
    };
  });
  const socialLinks = liveSocialLinks.length > 0 ? liveSocialLinks : DEFAULT_SOCIAL_LINKS;
  // These info cards are admin-typed freeform text (title/desc), but any
  // line that's exactly an email address or exactly the site's old default
  // phone number is meant to always track Admin → Site Contact Info instead
  // of whatever was typed here — matched line-by-line (not a wholesale
  // desc replace) so unrelated lines survive untouched, e.g. "Mon–Sat: 9 AM
  // – 5 PM" under the email, or the distinct Society Headquarters numbers
  // (different digits entirely, so they never match and are left alone).
  const infoCards = infoCardsLegacyNormalized.map((c) => {
    const isEmailCard = c.title.toLowerCase().includes('email');
    const desc = c.desc
      .split('\n')
      .map((line) => {
        const trimmed = line.trim();
        if (isEmailCard && /^\S+@\S+\.\S+$/.test(trimmed)) return siteEmail;
        if (trimmed.replace(/\D/g, '') === defaultPhoneDigits) return sitePhone;
        return line;
      })
      .join('\n');
    return { ...c, desc };
  });

  const [form, setForm] = useState<ContactForm>(INITIAL_FORM);
  const [errors, setErrors] = useState<ContactFormErrors>({});
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [activeTransitTab, setActiveTransitTab] = useState<'train' | 'air' | 'road'>('train');

  useEffect(() => {
    document.title = "Contact Us & Campus Directions | Vishnu Women's University";
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => (prev[name as keyof ContactForm] ? { ...prev, [name]: undefined } : prev));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validateContactForm(form);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setSubmitting(true);
    setSubmitError('');
    try {
      await addDoc(collection(db, 'contactSubmissions'), {
        name: form.name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        category: form.category,
        subject: form.subject.trim(),
        message: form.message.trim(),
        status: 'new',
        createdAt: serverTimestamp(),
      });
      setSubmitted(true);
    } catch (err) {
      setSubmitError((err as Error).message || "Couldn't send your message. Please try again or email us directly at info@vwu.edu.in.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="contact-page">
      <SEO 
        title="Contact Us & Campus Directions | Vishnu Women's University" 
        description="Get in touch with Vishnu Women's University (VWU). Admissions helpline, department directory, campus address in Bhimavaram, email support, and Google map directions."
        canonicalPath="/contact"
      />

      {/* ── Sleek Hero Banner ── */}
      <section className="contact-hero-clean">
        <div className="contact-hero-glow" aria-hidden="true" />
        <div className="container contact-hero-clean__inner">
          <div className="contact-chip">
            <Sparkles size={14} className="contact-chip-icon" />
            <span>Official University Helpdesk</span>
          </div>

          <h1 className="contact-hero-clean__title">
            {banner?.title || "We're Here to Help"}
          </h1>
          <p className="contact-hero-clean__subtitle">
            Have a question about admissions, academic programmes, campus life, or the University? Our team is here to assist you.
          </p>
          <p className="contact-hero-clean__subtitle">
            For admission enquiries, general information, or any other assistance, please get in touch with us. We look forward to hearing from you and helping you find the information you need.
          </p>

          <nav className="contact-hero-quicknav" aria-label="Contact page sections">
            <a href="#primary-helpdesks" className="contact-hero-quicknav-pill">
              <Headphones size={15} />
              <span>Primary Helpdesks</span>
            </a>
            <a href="#send-message" className="contact-hero-quicknav-pill">
              <Send size={15} />
              <span>Send a Message</span>
            </a>
            <a href="#map-directions" className="contact-hero-quicknav-pill">
              <MapPin size={15} />
              <span>Map &amp; Directions</span>
            </a>
            <a href="#department-directory" className="contact-hero-quicknav-pill">
              <Building2 size={15} />
              <span>Department Directory</span>
            </a>
            <a href="#helplines" className="contact-hero-quicknav-pill contact-hero-quicknav-pill--alert">
              <ShieldAlert size={15} />
              <span>24&times;7 Helplines</span>
            </a>
          </nav>
        </div>
      </section>

      {/* ── Key Contact Points (Primary Support Desks) ── */}
      <section id="primary-helpdesks" className="contact-info-section" aria-label="Primary Support Desks" style={{ scrollMarginTop: 'calc(var(--topbar-height) + var(--header-height) + 1rem)' }}>
        <div className="container">
          <div className="section-head-center">
            <span className="section-label">Key Contact Points</span>
            <h2 className="section-title">Connect with the Right Team</h2>
            <p className="section-subtitle">
              Dedicated support desks for <strong>admissions, administrative services, and campus visits</strong>, providing timely assistance and guidance.
            </p>
          </div>

          <div className="contact-card-grid-clean">
            {infoCards.map((c, i) => {
              const Icon = resolveContentIcon(c.icon) || (i === 0 ? GraduationCap : i === 1 ? MapPin : i === 2 ? Briefcase : Building2);
              return (
                <div key={c.id || i} className="contact-card-clean">
                  <div className="contact-card-clean__top">
                    <div className="contact-card-clean__icon">
                      <Icon size={22} strokeWidth={2} />
                    </div>
                    {c.slug && <span className="contact-card-clean__badge">{c.slug}</span>}
                  </div>

                  <h3 className="contact-card-clean__title">{c.title}</h3>

                  <div className="contact-card-clean__body">
                    {c.desc.split('\n').map((line, idx) => {
                      const trimmed = line.trim();
                      const emailMatch = trimmed.match(/([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/);
                      const phoneMatch = trimmed.match(/(\+91\s*[\d\s-]{10,15})/);

                      if (emailMatch) {
                        const email = emailMatch[1];
                        return (
                          <div key={idx} className="contact-line">
                            <Mail size={13} className="contact-line-icon" />
                            <a href={`mailto:${email}`} className="contact-link">
                              {email}
                            </a>
                          </div>
                        );
                      }
                      if (phoneMatch) {
                        const phone = phoneMatch[1];
                        return (
                          <div key={idx} className="contact-line">
                            <PhoneCall size={13} className="contact-line-icon" />
                            <a href={`tel:${phone.replace(/\s+/g, '')}`} className="contact-link">
                              {phone}
                            </a>
                          </div>
                        );
                      }
                      return <p key={idx} className="contact-text">{line}</p>;
                    })}
                  </div>

                  {c.value && (
                    <div className="contact-card-clean__timing">
                      <Clock size={13} />
                      <span>{c.value}</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Emergency & Safety Helplines Strip ── */}
      <section id="helplines" className="contact-emergency-strip" aria-label="Campus Safety Helplines" style={{ scrollMarginTop: 'calc(var(--topbar-height) + var(--header-height) + 1rem)' }}>
        <div className="container">
          <div className="emergency-box">
            <div className="emergency-box__left">
              <div className="emergency-icon-circle">
                <ShieldAlert size={26} />
              </div>
              <div>
                <h3 className="emergency-title">24x7 Women's Safety &amp; Helplines</h3>
                <p className="emergency-sub">
                  Round-the-clock emergency support for student security, health, and campus safety.
                </p>
              </div>
            </div>

            <div className="emergency-box__numbers">
              <a href="tel:18001805522" className="emergency-pill">
                <span className="emergency-pill__label">Anti-Ragging Toll-Free</span>
                <span className="emergency-pill__num">1800-180-5522</span>
              </a>
              <a href="tel:18005990599" className="emergency-pill">
                <span className="emergency-pill__label">University Toll-Free</span>
                <span className="emergency-pill__num">1800 599 0599</span>
              </a>
              <a href="tel:+918816250864" className="emergency-pill">
                <span className="emergency-pill__label">Campus Security</span>
                <span className="emergency-pill__num">+91 8816 250864</span>
              </a>
              <a href="tel:+918816250869" className="emergency-pill">
                <span className="emergency-pill__label">Health Centre</span>
                <span className="emergency-pill__num">+91 8816 250869</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── Location, Travel & Message Form ── */}
      <section className="contact-main-section">
        <div className="container">
          <div className="contact-grid-2col">
            
            {/* Left Column: Location & Travel Guide */}
            <div id="map-directions" className="contact-left-card" style={{ scrollMarginTop: 'calc(var(--topbar-height) + var(--header-height) + 1rem)' }}>
              <div className="section-head-left">
                <span className="section-label">Visit Our Campus</span>
                <h2 className="section-title">Location &amp; Travel Guide</h2>
                <p className="section-subtitle">
                  Vishnu Women’s University is situated in the serene, green surroundings of Bhimavaram, West Godavari District, Andhra Pradesh. The University is located on the Bhimavaram–Tadepalligudem Road, with convenient access from Bhimavaram town via B. V. Raju Marg.
                </p>
              </div>

              {/* Map Embed Box */}
              <div className="contact-map-box">
                <div className="contact-map-header">
                  <div className="contact-map-info">
                    <MapPin size={18} className="map-pin-icon" />
                    <div>
                      <strong>Vishnu Women's University</strong>
                      <span>Vishnavathi, Kovvada, Bhimavaram, AP 534202</span>
                    </div>
                  </div>
                  <a 
                    href="https://maps.google.com/?q=16.568119,81.522098" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="contact-map-link-btn"
                  >
                    <span>Google Maps</span>
                    <ExternalLink size={13} />
                  </a>
                </div>

                <div className="contact-iframe-wrap">
                  <iframe
                    title="VWU Campus Location Map"
                    src="https://maps.google.com/maps?q=16.568119,81.522098&z=15&output=embed"
                    width="100%"
                    height="280"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                  />
                </div>
              </div>

              {/* How to Reach Tabs */}
              <div className="contact-transit-container">
                <h3 className="transit-heading">How to Reach VWU Campus</h3>
                
                <div className="transit-tabs">
                  <button 
                    type="button" 
                    className={`transit-tab ${activeTransitTab === 'train' ? 'active' : ''}`}
                    onClick={() => setActiveTransitTab('train')}
                  >
                    <Train size={15} />
                    <span>By Train</span>
                  </button>
                  <button 
                    type="button" 
                    className={`transit-tab ${activeTransitTab === 'air' ? 'active' : ''}`}
                    onClick={() => setActiveTransitTab('air')}
                  >
                    <Plane size={15} />
                    <span>By Air</span>
                  </button>
                  <button 
                    type="button" 
                    className={`transit-tab ${activeTransitTab === 'road' ? 'active' : ''}`}
                    onClick={() => setActiveTransitTab('road')}
                  >
                    <Bus size={15} />
                    <span>By Road</span>
                  </button>
                </div>

                <div className="transit-body">
                  {activeTransitTab === 'train' && (
                    <div className="transit-info">
                      <p>
                        <strong>Bhimavaram Town (BVRM)</strong> &amp; <strong>Junction (BVRT)</strong> stations are <strong>3.8 km and 4.2 km</strong> away. Autos and cabs operate continuously to campus.
                      </p>
                    </div>
                  )}

                  {activeTransitTab === 'air' && (
                    <div className="transit-info">
                      <p>
                        <strong>Vijayawada International Airport (VGA):</strong> ~92 km (2 hrs drive).<br />
                        <strong>Rajahmundry Domestic Airport (RJA):</strong> ~78 km (1.8 hrs drive).
                      </p>
                    </div>
                  )}

                  {activeTransitTab === 'road' && (
                    <div className="transit-info">
                      <p>
                        Located on SH-63 / NH-216A. Direct APSRTC buses connect from Vijayawada, Guntur, Rajahmundry, Eluru, and Tanuku.
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Social Channels */}
              <div className="contact-social-section">
                <h4 className="social-heading">Connect via Official Channels</h4>
                <div className="social-pills-wrap">
                  {socialLinks.map((s) => {
                    const meta = SOCIAL_META[s.title] || { label: s.title, color: '#1b4332', glyph: '●' };
                    return (
                      <a
                        key={s.id}
                        href={s.value}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="social-pill"
                      >
                        <span>{meta.label}</span>
                        <ExternalLink size={11} />
                      </a>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Right Column: Send Us a Message Form */}
            <div id="send-message" className="contact-right-card" style={{ scrollMarginTop: 'calc(var(--topbar-height) + var(--header-height) + 1rem)' }}>
              <div className="form-header-clean">
                <span className="section-label">Direct Communication</span>
                <h2 className="form-title-clean">Send Us a Message</h2>
                <p className="form-sub-clean">
                  Have questions regarding admissions, academics, or campus facilities? Submit your query below.
                </p>
              </div>

              {submitted ? (
                <div className="form-success-clean">
                  <div className="success-icon-box">
                    <CheckCircle2 size={40} />
                  </div>
                  <h3>Message Received!</h3>
                  <p>
                    Thank you for contacting VWU. Your message has been routed. Our admissions team will reach out within <strong>1–2 business days</strong>.
                  </p>
                  <button
                    type="button"
                    className="clean-btn clean-btn--primary"
                    onClick={() => {
                      setForm(INITIAL_FORM);
                      setErrors({});
                      setSubmitError('');
                      setSubmitted(false);
                    }}
                  >
                    <span>Send Another Inquiry</span>
                  </button>
                </div>
              ) : (
                <form className="contact-form-clean" onSubmit={handleSubmit} noValidate>
                  {/* Category Dropdown */}
                  <div className="form-group-clean">
                    <label htmlFor="cf-category" className="form-label-clean">Inquiry Category *</label>
                    <select
                      id="cf-category"
                      name="category"
                      value={form.category}
                      onChange={handleChange}
                      className="form-select-clean"
                    >
                      {CATEGORY_OPTIONS.map((cat) => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>

                  <div className="form-row-2col">
                    {/* Name */}
                    <div className="form-group-clean">
                      <label htmlFor="cf-name" className="form-label-clean">Full Name *</label>
                      <input
                        id="cf-name"
                        name="name"
                        type="text"
                        placeholder="e.g. Ananya Sharma"
                        value={form.name}
                        onChange={handleChange}
                        className={`form-input-clean ${errors.name ? 'form-input--error' : ''}`}
                      />
                      {errors.name && <span className="form-error-text">{errors.name}</span>}
                    </div>

                    {/* Email */}
                    <div className="form-group-clean">
                      <label htmlFor="cf-email" className="form-label-clean">Email Address *</label>
                      <input
                        id="cf-email"
                        name="email"
                        type="email"
                        placeholder="ananya@example.com"
                        value={form.email}
                        onChange={handleChange}
                        className={`form-input-clean ${errors.email ? 'form-input--error' : ''}`}
                      />
                      {errors.email && <span className="form-error-text">{errors.email}</span>}
                    </div>
                  </div>

                  <div className="form-row-2col">
                    {/* Phone */}
                    <div className="form-group-clean">
                      <label htmlFor="cf-phone" className="form-label-clean">Phone / Mobile</label>
                      <input
                        id="cf-phone"
                        name="phone"
                        type="tel"
                        placeholder="+91 98765 43210"
                        value={form.phone}
                        onChange={handleChange}
                        className={`form-input-clean ${errors.phone ? 'form-input--error' : ''}`}
                      />
                      {errors.phone && <span className="form-error-text">{errors.phone}</span>}
                    </div>

                    {/* Subject */}
                    <div className="form-group-clean">
                      <label htmlFor="cf-subject" className="form-label-clean">Subject *</label>
                      <input
                        id="cf-subject"
                        name="subject"
                        type="text"
                        placeholder="e.g. Admission Query"
                        value={form.subject}
                        onChange={handleChange}
                        className={`form-input-clean ${errors.subject ? 'form-input--error' : ''}`}
                      />
                      {errors.subject && <span className="form-error-text">{errors.subject}</span>}
                    </div>
                  </div>

                  {/* Message */}
                  <div className="form-group-clean">
                    <label htmlFor="cf-message" className="form-label-clean">Message Details *</label>
                    <textarea
                      id="cf-message"
                      name="message"
                      rows={4}
                      placeholder="Write your questions or message details here..."
                      value={form.message}
                      onChange={handleChange}
                      className={`form-input-clean form-textarea-clean ${errors.message ? 'form-input--error' : ''}`}
                    />
                    {errors.message && <span className="form-error-text">{errors.message}</span>}
                  </div>

                  {submitError && (
                    <div className="form-alert-error">
                      <AlertCircle size={16} />
                      <span>{submitError}</span>
                    </div>
                  )}

                  <button 
                    type="submit" 
                    className="clean-btn clean-btn--primary clean-btn--full" 
                    disabled={submitting}
                  >
                    {submitting ? (
                      <span>Sending Message…</span>
                    ) : (
                      <>
                        <span>Submit Inquiry</span>
                        <Send size={15} />
                      </>
                    )}
                  </button>

                  <div className="form-privacy-note">
                    <FileCheck2 size={13} />
                    <span>Your details are protected under our university privacy policy.</span>
                  </div>
                </form>
              )}
            </div>

          </div>
        </div>
      </section>

      {/* ── Searchable Department Directory ── */}
      <section id="department-directory" className="contact-dept-section" style={{ scrollMarginTop: 'calc(var(--topbar-height) + var(--header-height) + 1rem)' }}>
        <div className="container">
          <div className="dept-directory-header">
            <div>
              <span className="section-label">Academic &amp; Operational Heads</span>
              <h2 className="section-title">Department Directory</h2>
              <p className="section-subtitle">
                Contact information for Heads of Departments and evaluation cells.
              </p>
            </div>
          </div>

          <div className="dept-grid-clean">
            {deptContacts.map((d) => (
              <div key={d.id} className="dept-card-clean">
                <div className="dept-card-clean__header">
                  <div className="dept-avatar">
                    {d.dept.slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="dept-card-clean__title">{d.dept}</h3>
                    <p className="dept-card-clean__hod">
                      <strong>HOD / Lead:</strong> {d.hod?.toUpperCase()}
                    </p>
                  </div>
                </div>

                <div className="dept-card-clean__footer">
                  <a href={`mailto:${d.email}`} className="dept-email-btn" title={`Email ${d.email}`}>
                    <Mail size={13} />
                    <span>{d.email}</span>
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
