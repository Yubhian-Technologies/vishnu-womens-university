import { useEffect, useState } from 'react';
import { 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  Building2, 
  GraduationCap, 
  Briefcase, 
  ShieldAlert, 
  Navigation, 
  Plane, 
  Train, 
  Bus, 
  CheckCircle2, 
  AlertCircle, 
  Sparkles, 
  Send, 
  Copy, 
  Check, 
  ExternalLink, 
  Search, 
  Headphones, 
  Compass,
  FileCheck2,
  PhoneCall
} from 'lucide-react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { useOrderedCollection } from '../../hooks/useCollection';
import { useContentBlocks } from '../../hooks/useContentBlocks';
import { usePageBanner } from '../../hooks/usePageBanner';
import { resolveContentIcon } from '../../lib/contentIcons';
import type { ContactDoc } from '../Admin/sections/ContactsAdmin';
import SEO from '../../components/SEO/SEO';
import './Contact.css';

interface ContactForm {
  name: string;
  email: string;
  phone: string;
  subject: string;
  category: string;
  message: string;
}

type ContactFormErrors = Partial<Record<keyof ContactForm, string>>;

const INITIAL_FORM: ContactForm = {
  name: '',
  email: '',
  phone: '',
  // Matches the "Admissions Enquiry" category below, which starts pre-selected
  // (see the chip grid's `form.category === cat` check) — so the Subject
  // Summary is in sync with the selected category from the very first render,
  // not just after a chip is clicked (same subjectForCategory() text, inlined
  // here since it's declared further down and this runs at module-load time).
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
  if (!form.subject.trim()) errors.subject = 'Please enter a subject or summary.';
  if (!form.message.trim()) errors.message = 'Please enter your message or query.';
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

// Avoids a doubled-up "Admissions Enquiry Enquiry" for the categories that
// already end in "Enquiry" — every other category gets " Enquiry" appended
// so the Subject Summary always reads as a full sentence-like subject line.
const subjectForCategory = (category: string) => (/enquiry$/i.test(category) ? category : `${category} Enquiry`);

const DEFAULT_INFO_CARDS = [
  {
    id: 'default-info-1',
    title: 'Admissions Office',
    desc: 'Vishnu Women\'s University Admissions Cell\nEmail: admissions@vishnu.edu.in\nHelpline: +91 8816 250864, +91 91212 14411',
    value: 'Mon – Sat: 9:00 AM – 5:00 PM IST',
    slug: 'Admissions Desk, Admin Block',
    icon: 'GraduationCap',
  },
  {
    id: 'default-info-2',
    title: 'Main Campus & Administration',
    desc: 'Vishnavathi, Kovvada, Bhimavaram,\nWest Godavari District, Andhra Pradesh – 534202, India',
    value: 'Landmark: Near Pedatadepalli Road',
    slug: 'Campus Main Gate 1',
    icon: 'MapPin',
  },
  {
    id: 'default-info-3',
    title: 'Career Guidance & Placements',
    desc: 'Training & Corporate Placement Division\nEmail: placements@vishnu.edu.in\nPhone: +91 8816 250867',
    value: 'Recruiter Liaison & MoUs',
    slug: 'Placement Hub, Ground Floor',
    icon: 'Briefcase',
  },
  {
    id: 'default-info-4',
    title: 'Registrar & Student Affairs',
    desc: 'Office of the Registrar\nEmail: info@vishnu.edu.in, registrar@vishnu.edu.in\nPhone: +91 8816 250860',
    value: 'Academic & Institutional Affairs',
    slug: 'Central Administration Block',
    icon: 'Building2',
  },
];

const DEFAULT_DEPT_CONTACTS: ContactDoc[] = [
  { id: 'dept-1', dept: 'Computer Science & Engineering (CSE)', hod: 'Dr. P. Kiran Sree', phone: '+91 8816 250871', email: 'hod_cse@vishnu.edu.in', order: 1 },
  { id: 'dept-2', dept: 'Artificial Intelligence & Data Science (AI & DS)', hod: 'Dr. M. Sridevi', phone: '+91 8816 250872', email: 'hod_aids@vishnu.edu.in', order: 2 },
  { id: 'dept-3', dept: 'Electronics & Communication Engineering (ECE)', hod: 'Dr. J. Somlal', phone: '+91 8816 250873', email: 'hod_ece@vishnu.edu.in', order: 3 },
  { id: 'dept-4', dept: 'Electrical & Electronics Engineering (EEE)', hod: 'Dr. K. Rayudu', phone: '+91 8816 250874', email: 'hod_eee@vishnu.edu.in', order: 4 },
  { id: 'dept-5', dept: 'Information Technology (IT)', hod: 'Dr. Ch. Srinivas', phone: '+91 8816 250875', email: 'hod_it@vishnu.edu.in', order: 5 },
  { id: 'dept-6', dept: 'Basic Sciences & Humanities (BS&H)', hod: 'Dr. V. Rama Devi', phone: '+91 8816 250876', email: 'hod_bsh@vishnu.edu.in', order: 6 },
  { id: 'dept-7', dept: 'Department of Management Studies (MBA)', hod: 'Dr. T. Sudha', phone: '+91 8816 250877', email: 'hod_mba@vishnu.edu.in', order: 7 },
  { id: 'dept-8', dept: 'Examinations & Student Evaluation Cell', hod: 'Controller of Examinations', phone: '+91 8816 250878', email: 'ce@vishnu.edu.in', order: 8 },
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
  const banner = usePageBanner('contact');

  const infoCards = liveInfoCards.length > 0 ? liveInfoCards : DEFAULT_INFO_CARDS;
  const deptContacts = liveDeptContacts.length > 0 ? liveDeptContacts : DEFAULT_DEPT_CONTACTS;
  const socialLinks = liveSocialLinks.length > 0 ? liveSocialLinks : DEFAULT_SOCIAL_LINKS;

  const [form, setForm] = useState<ContactForm>(INITIAL_FORM);
  const [errors, setErrors] = useState<ContactFormErrors>({});
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTransitTab, setActiveTransitTab] = useState<'train' | 'air' | 'road'>('train');

  useEffect(() => {
    document.title = "Contact Us & Campus Directions | Vishnu Women's University";
  }, []);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => (prev[name as keyof ContactForm] ? { ...prev, [name]: undefined } : prev));
  };

  const handleCategorySelect = (category: string) => {
    setForm((prev) => ({ ...prev, category, subject: subjectForCategory(category) }));
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
      setSubmitError((err as Error).message || "Couldn't send your message. Please try again or email us directly at info@vishnu.edu.in.");
    } finally {
      setSubmitting(false);
    }
  };

  // Filtered department contacts
  const filteredDepts = deptContacts.filter((d) => {
    const q = searchTerm.toLowerCase();
    return (
      d.dept.toLowerCase().includes(q) ||
      d.hod.toLowerCase().includes(q) ||
      d.email.toLowerCase().includes(q) ||
      (d.phone && d.phone.toLowerCase().includes(q))
    );
  });

  return (
    <main className="contact-page">
      <SEO 
        title="Contact Us & Campus Directions | Vishnu Women's University" 
        description="Get in touch with Vishnu Women's University (VWU). Admissions helpline, department phone directory, campus address in Bhimavaram, email support, and interactive Google map directions."
        canonicalPath="/contact"
      />

      {/* ── Google M3 Hero Section ── */}
      <section className="contact-hero-m3">
        <div className="contact-hero-glow-1" aria-hidden="true" />
        <div className="contact-hero-glow-2" aria-hidden="true" />

        <div className="container contact-hero-m3__inner">
          <div className="contact-hero-chip">
            <Sparkles size={14} className="contact-chip-icon" />
            <span>Official University Helpdesk &amp; Directory</span>
          </div>

          <h1 className="contact-hero-m3__title">
            {banner?.title || 'Connect with Vishnu Women\'s University'}
          </h1>
          <p className="contact-hero-m3__subtitle">
            {banner?.subtitle || "We are here to guide you. Reach out to our admissions counselors, administrative offices, and academic departments, or plan your visit to our scenic campus."}
          </p>

          {/* Jump Quick-Action Bar */}
          <div className="contact-quick-bar">
            <a href="#primary-desks" className="contact-quick-pill">
              <Headphones size={15} />
              <span>Primary Helpdesks</span>
            </a>
            <a href="#send-message" className="contact-quick-pill">
              <Send size={15} />
              <span>Send a Message</span>
            </a>
            <a href="#campus-map" className="contact-quick-pill">
              <Compass size={15} />
              <span>Map &amp; Directions</span>
            </a>
            <a href="#department-directory" className="contact-quick-pill">
              <Building2 size={15} />
              <span>Department Directory</span>
            </a>
            <a href="#emergency-contacts" className="contact-quick-pill contact-quick-pill--emergency">
              <ShieldAlert size={15} />
              <span>24x7 Helplines</span>
            </a>
          </div>
        </div>
      </section>

      {/* ── Primary Helpdesk Cards Grid ── */}
      <section className="contact-info-m3" id="primary-desks" aria-label="Primary University Desks">
        <div className="container">
          <div className="section-head-center">
            <span className="section-label">Key Contact Points</span>
            <h2 className="section-title">Primary Support Desks</h2>
            <p className="section-subtitle">
              Direct channels for student admissions, corporate placements, administrative records, and campus visits.
            </p>
          </div>

          <div className="contact-card-grid-m3">
            {infoCards.map((c, i) => {
              const Icon = resolveContentIcon(c.icon) || (i === 0 ? GraduationCap : i === 1 ? MapPin : i === 2 ? Briefcase : Building2);
              return (
                <div key={c.id || i} className="contact-m3-card">
                  <div className="contact-m3-card__header">
                    <div className="contact-m3-card__icon-box">
                      <Icon size={24} strokeWidth={2} />
                    </div>
                    {c.slug && (
                      <span className="contact-m3-card__badge">{c.slug}</span>
                    )}
                  </div>

                  <h3 className="contact-m3-card__title">{c.title}</h3>

                  <div className="contact-m3-card__desc">
                    {c.desc.split('\n').map((line, idx) => {
                      const trimmed = line.trim();
                      const emailMatch = trimmed.match(/([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/);
                      const phoneMatch = trimmed.match(/(\+91\s*[\d\s-]{10,15})/);

                      if (emailMatch) {
                        const email = emailMatch[1];
                        return (
                          <div key={idx} className="contact-desc-line">
                            <span>{trimmed.replace(email, '')}</span>
                            <a href={`mailto:${email}`} className="contact-link contact-link--email">
                              <Mail size={13} /> {email}
                            </a>
                          </div>
                        );
                      }
                      if (phoneMatch) {
                        const phone = phoneMatch[1];
                        return (
                          <div key={idx} className="contact-desc-line">
                            <span>{trimmed.replace(phone, '')}</span>
                            <a href={`tel:${phone.replace(/\s+/g, '')}`} className="contact-link contact-link--phone">
                              <PhoneCall size={13} /> {phone}
                            </a>
                          </div>
                        );
                      }
                      return <p key={idx} className="contact-desc-plain">{line}</p>;
                    })}
                  </div>

                  {c.value && (
                    <div className="contact-m3-card__timing">
                      <Clock size={14} className="timing-icon" />
                      <span>{c.value}</span>
                    </div>
                  )}

                  <div className="contact-m3-card__footer">
                    <button 
                      type="button" 
                      className="contact-copy-btn"
                      onClick={() => copyToClipboard(`${c.title}\n${c.desc}\n${c.value || ''}`, c.id)}
                      title="Copy details"
                    >
                      {copiedId === c.id ? (
                        <>
                          <Check size={14} color="#1b4332" />
                          <span style={{ color: '#1b4332' }}>Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy size={14} />
                          <span>Copy Info</span>
                        </>
                      )}
                    </button>

                    {c.title.toLowerCase().includes('admissions') && (
                      <a href="tel:+918816250864" className="contact-action-btn">
                        <span>Call Desk</span>
                        <Phone size={13} />
                      </a>
                    )}
                    {c.title.toLowerCase().includes('placement') && (
                      <a href="mailto:placements@vishnu.edu.in" className="contact-action-btn">
                        <span>Email T&amp;P</span>
                        <Mail size={13} />
                      </a>
                    )}
                    {c.title.toLowerCase().includes('campus') && (
                      <a href="#campus-map" className="contact-action-btn">
                        <span>Directions</span>
                        <Navigation size={13} />
                      </a>
                    )}
                    {c.title.toLowerCase().includes('registrar') && (
                      <a href="mailto:registrar@vishnu.edu.in" className="contact-action-btn">
                        <span>Write Registrar</span>
                        <Mail size={13} />
                      </a>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Emergency & Campus Safety Helpline Strip ── */}
      <section className="contact-emergency-strip" id="emergency-contacts" aria-label="Campus Safety Helplines">
        <div className="container">
          <div className="emergency-box">
            <div className="emergency-box__left">
              <div className="emergency-icon-circle">
                <ShieldAlert size={28} />
              </div>
              <div>
                <h3 className="emergency-title">24x7 Women's Safety, Health &amp; Anti-Ragging Helplines</h3>
                <p className="emergency-sub">
                  Immediate assistance is available round-the-clock for campus security, health emergencies, and grievance redressal.
                </p>
              </div>
            </div>

            <div className="emergency-box__numbers">
              <a href="tel:18004250000" className="emergency-pill">
                <span className="emergency-pill__label">Anti-Ragging Toll-Free</span>
                <span className="emergency-pill__num">1800-180-5522</span>
              </a>
              <a href="tel:+918816250864" className="emergency-pill">
                <span className="emergency-pill__label">Campus Security &amp; Safety</span>
                <span className="emergency-pill__num">+91 8816 250864</span>
              </a>
              <a href="tel:+918816250869" className="emergency-pill">
                <span className="emergency-pill__label">Health Centre &amp; Ambulance</span>
                <span className="emergency-pill__num">+91 8816 250869</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── Map, Transit & Form Section ── */}
      <section className="contact-main-grid-section" id="send-message">
        <div className="container">
          <div className="contact-split-grid">
            
            {/* Left Column: Interactive Map & Transit Guide */}
            <div className="contact-left-col" id="campus-map">
              <div className="contact-col-header">
                <span className="section-label">Visit Our Campus</span>
                <h2 className="section-title">Location &amp; Travel Guide</h2>
                <p className="section-subtitle">
                  Situated in the lush green, serene environment of Bhimavaram, West Godavari District, Andhra Pradesh.
                </p>
              </div>

              {/* Map Embed Card */}
              <div className="contact-map-card">
                <div className="contact-map-top">
                  <div className="contact-map-address">
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
                    className="contact-map-btn"
                  >
                    <span>Open in Google Maps</span>
                    <ExternalLink size={14} />
                  </a>
                </div>

                <div className="contact-iframe-container">
                  <iframe
                    title="Vishnu Women's University Google Map"
                    src="https://maps.google.com/maps?q=16.568119,81.522098&z=15&output=embed"
                    width="100%"
                    height="320"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                </div>
              </div>

              {/* Transit & Reach Guide Tabs */}
              <div className="contact-transit-box">
                <h3 className="transit-heading">How to Reach VWU Campus</h3>
                
                <div className="transit-tabs">
                  <button 
                    type="button" 
                    className={`transit-tab ${activeTransitTab === 'train' ? 'transit-tab--active' : ''}`}
                    onClick={() => setActiveTransitTab('train')}
                  >
                    <Train size={16} />
                    <span>By Train</span>
                  </button>
                  <button 
                    type="button" 
                    className={`transit-tab ${activeTransitTab === 'air' ? 'transit-tab--active' : ''}`}
                    onClick={() => setActiveTransitTab('air')}
                  >
                    <Plane size={16} />
                    <span>By Air</span>
                  </button>
                  <button 
                    type="button" 
                    className={`transit-tab ${activeTransitTab === 'road' ? 'transit-tab--active' : ''}`}
                    onClick={() => setActiveTransitTab('road')}
                  >
                    <Bus size={16} />
                    <span>By Bus &amp; Road</span>
                  </button>
                </div>

                <div className="transit-content">
                  {activeTransitTab === 'train' && (
                    <div className="transit-panel">
                      <p>
                        <strong>Bhimavaram Town Station (BVRM)</strong> &amp; <strong>Bhimavaram Junction (BVRT)</strong> are located just <strong>3.8 km and 4.2 km</strong> from the campus. 
                      </p>
                      <ul className="transit-list">
                        <li>Frequent trains from Vijayawada (BZA), Visakhapatnam (VSKP), Hyderabad, and Chennai.</li>
                        <li>Auto-rickshaws, cabs, and campus shuttle services run continuously from both railway stations.</li>
                      </ul>
                    </div>
                  )}

                  {activeTransitTab === 'air' && (
                    <div className="transit-panel">
                      <p>
                        The campus is conveniently accessible via two major regional airports:
                      </p>
                      <ul className="transit-list">
                        <li><strong>Vijayawada International Airport (VGA):</strong> ~92 km (approx. 2 hours via NH-16 / NH-216A).</li>
                        <li><strong>Rajahmundry Domestic Airport (RJA):</strong> ~78 km (approx. 1.8 hours drive).</li>
                        <li>Airport taxi and direct inter-city cabs are readily available round-the-clock.</li>
                      </ul>
                    </div>
                  )}

                  {activeTransitTab === 'road' && (
                    <div className="transit-panel">
                      <p>
                        Bhimavaram is well-linked by standard state highways (SH-63, NH-216A) and express bus corridors.
                      </p>
                      <ul className="transit-list">
                        <li>Direct APSRTC Ultra-Deluxe, Super-Luxury, and Express buses run from Vijayawada, Guntur, Rajahmundry, Eluru, and Tanuku.</li>
                        <li>The university operates a dedicated fleet of 60+ GPS-tracked buses connecting all major towns in West &amp; East Godavari.</li>
                      </ul>
                    </div>
                  )}
                </div>
              </div>

              {/* Social Channels Strip */}
              <div className="contact-social-m3">
                <h4 className="social-m3-title">Official Social Media Communities</h4>
                <div className="social-m3-grid">
                  {socialLinks.map((s) => {
                    const meta = SOCIAL_META[s.title] || { label: s.title, color: '#1b4332', glyph: '●' };
                    return (
                      <a
                        key={s.id}
                        href={s.value}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="social-m3-pill"
                        style={{ '--hover-color': meta.color } as React.CSSProperties}
                      >
                        <span className="social-m3-glyph">{meta.glyph}</span>
                        <span>{meta.label}</span>
                        <ExternalLink size={12} className="social-ext-icon" />
                      </a>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Right Column: Google Material 3 Form */}
            <div className="contact-right-col">
              <div className="contact-form-card-m3">
                <div className="form-header-m3">
                  <span className="section-label">Direct Communication</span>
                  <h2 className="form-title-m3">Send Us a Message</h2>
                  <p className="form-sub-m3">
                    Have questions about admissions, programs, eligibility, or campus life? Submit your enquiry below and our team will get back to you promptly.
                  </p>
                </div>

                {submitted ? (
                  <div className="form-success-m3">
                    <div className="form-success-icon-box">
                      <CheckCircle2 size={44} strokeWidth={2.2} />
                    </div>
                    <h3 className="form-success-title">Message Received!</h3>
                    <p className="form-success-desc">
                      Thank you for contacting Vishnu Women's University. Your enquiry has been routed to the respective department desk. One of our counselors will contact you within <strong>1–2 business days</strong>.
                    </p>

                    <div className="form-success-info">
                      <div className="form-success-row">
                        <span>Submitted By:</span>
                        <strong>{form.name}</strong>
                      </div>
                      <div className="form-success-row">
                        <span>Email Address:</span>
                        <strong>{form.email}</strong>
                      </div>
                      <div className="form-success-row">
                        <span>Category:</span>
                        <strong>{form.category}</strong>
                      </div>
                    </div>

                    <button
                      type="button"
                      className="m3-btn m3-btn--primary"
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
                  <form className="contact-form-m3" onSubmit={handleSubmit} noValidate>
                    {/* Category Selection Chips */}
                    <div className="form-group-m3">
                      <label className="form-label-m3">Inquiry Category *</label>
                      <div className="category-chip-grid">
                        {CATEGORY_OPTIONS.map((cat) => (
                          <button
                            key={cat}
                            type="button"
                            className={`category-chip ${form.category === cat ? 'category-chip--selected' : ''}`}
                            onClick={() => handleCategorySelect(cat)}
                          >
                            {form.category === cat && <Check size={13} strokeWidth={2.5} />}
                            <span>{cat}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="form-row-2col">
                      {/* Name */}
                      <div className="form-group-m3">
                        <label htmlFor="cf-name" className="form-label-m3">Full Name *</label>
                        <input
                          id="cf-name"
                          name="name"
                          type="text"
                          placeholder="e.g. Ananya Sharma"
                          value={form.name}
                          onChange={handleChange}
                          className={`form-input-m3 ${errors.name ? 'form-input--error' : ''}`}
                          aria-invalid={!!errors.name}
                        />
                        {errors.name && <span className="form-error-msg">{errors.name}</span>}
                      </div>

                      {/* Email */}
                      <div className="form-group-m3">
                        <label htmlFor="cf-email" className="form-label-m3">Email Address *</label>
                        <input
                          id="cf-email"
                          name="email"
                          type="email"
                          placeholder="ananya@example.com"
                          value={form.email}
                          onChange={handleChange}
                          className={`form-input-m3 ${errors.email ? 'form-input--error' : ''}`}
                          aria-invalid={!!errors.email}
                        />
                        {errors.email && <span className="form-error-msg">{errors.email}</span>}
                      </div>
                    </div>

                    <div className="form-row-2col">
                      {/* Phone */}
                      <div className="form-group-m3">
                        <label htmlFor="cf-phone" className="form-label-m3">Phone / Mobile</label>
                        <input
                          id="cf-phone"
                          name="phone"
                          type="tel"
                          placeholder="+91 98765 43210"
                          value={form.phone}
                          onChange={handleChange}
                          className={`form-input-m3 ${errors.phone ? 'form-input--error' : ''}`}
                          aria-invalid={!!errors.phone}
                        />
                        {errors.phone && <span className="form-error-msg">{errors.phone}</span>}
                      </div>

                      {/* Subject */}
                      <div className="form-group-m3">
                        <label htmlFor="cf-subject" className="form-label-m3">Subject Summary *</label>
                        <input
                          id="cf-subject"
                          name="subject"
                          type="text"
                          placeholder="e.g. B.Tech CSE Admission 2026 Details"
                          value={form.subject}
                          onChange={handleChange}
                          className={`form-input-m3 ${errors.subject ? 'form-input--error' : ''}`}
                          aria-invalid={!!errors.subject}
                        />
                        {errors.subject && <span className="form-error-msg">{errors.subject}</span>}
                      </div>
                    </div>

                    {/* Message */}
                    <div className="form-group-m3">
                      <label htmlFor="cf-message" className="form-label-m3">Message Details *</label>
                      <textarea
                        id="cf-message"
                        name="message"
                        rows={5}
                        placeholder="Please describe your enquiry, current qualification, or questions..."
                        value={form.message}
                        onChange={handleChange}
                        className={`form-input-m3 form-textarea-m3 ${errors.message ? 'form-input--error' : ''}`}
                        aria-invalid={!!errors.message}
                      />
                      {errors.message && <span className="form-error-msg">{errors.message}</span>}
                    </div>

                    {submitError && (
                      <div className="form-alert-error">
                        <AlertCircle size={18} className="alert-icon" />
                        <span>{submitError}</span>
                      </div>
                    )}

                    <button 
                      type="submit" 
                      className="m3-btn m3-btn--primary m3-btn--full" 
                      disabled={submitting}
                    >
                      {submitting ? (
                        <>
                          <div className="m3-spinner" />
                          <span>Sending Inquiry…</span>
                        </>
                      ) : (
                        <>
                          <span>Submit Message</span>
                          <Send size={16} />
                        </>
                      )}
                    </button>

                    <div className="form-privacy-note">
                      <FileCheck2 size={14} />
                      <span>Your information is protected by our privacy policy and will only be used for responding to your inquiry.</span>
                    </div>
                  </form>
                )}
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── Searchable Department Directory ── */}
      <section className="contact-dept-directory-section" id="department-directory">
        <div className="container">
          <div className="dept-directory-header">
            <div>
              <span className="section-label">Academic &amp; Operational Heads</span>
              <h2 className="section-title">Department Directory</h2>
              <p className="section-subtitle">
                Find contact details for Heads of Departments (HODs), academic cells, and administrative offices.
              </p>
            </div>

            {/* Live Search Filter */}
            <div className="dept-search-box">
              <Search size={18} className="dept-search-icon" />
              <input
                type="text"
                placeholder="Search department, HOD, email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="dept-search-input"
                aria-label="Search departments"
              />
              {searchTerm && (
                <button 
                  type="button" 
                  className="dept-search-clear" 
                  onClick={() => setSearchTerm('')}
                  aria-label="Clear search"
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          <div className="dept-directory-grid">
            {filteredDepts.map((d) => (
              <div key={d.id} className="dept-m3-card">
                <div className="dept-m3-card__top">
                  <div className="dept-avatar">
                    {d.dept.slice(0, 2).toUpperCase()}
                  </div>
                  <div className="dept-title-box">
                    <h3 className="dept-m3-card__title">{d.dept}</h3>
                    <p className="dept-m3-card__hod">
                      <strong>HOD / Lead:</strong> {d.hod}
                    </p>
                  </div>
                </div>

                <div className="dept-m3-card__links">
                  <a href={`mailto:${d.email}`} className="dept-link-btn" title={`Email ${d.email}`}>
                    <Mail size={14} />
                    <span>{d.email}</span>
                  </a>

                  {d.phone && (
                    <a href={`tel:${d.phone.replace(/\s+/g, '')}`} className="dept-link-btn dept-link-btn--phone" title={`Call ${d.phone}`}>
                      <Phone size={14} />
                      <span>{d.phone}</span>
                    </a>
                  )}
                </div>
              </div>
            ))}

            {filteredDepts.length === 0 && (
              <div className="dept-empty-state">
                <Search size={32} className="empty-icon" />
                <p>No departments matched "<strong>{searchTerm}</strong>". Try clearing your search.</p>
                <button 
                  type="button" 
                  className="m3-btn m3-btn--tonal m3-btn--sm"
                  onClick={() => setSearchTerm('')}
                >
                  Clear Search Filter
                </button>
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
