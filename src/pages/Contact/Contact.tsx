import { useEffect, useRef, useState } from 'react';
import { MapPin, CheckCircle2 } from 'lucide-react';
import './Contact.css';
import { useOrderedCollection } from '../../hooks/useCollection';
import { useContentBlocks } from '../../hooks/useContentBlocks';
import { resolveContentIcon } from '../../lib/contentIcons';
import type { ContactDoc } from '../Admin/sections/ContactsAdmin';

interface ContactForm {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
}

const INITIAL_FORM: ContactForm = {
  name: '',
  email: '',
  phone: '',
  subject: '',
  message: '',
};

const SOCIAL_GLYPHS: Record<string, { glyph: string; className: string }> = {
  YouTube: { glyph: '▶', className: 'contact-social-link--yt' },
  Facebook: { glyph: 'f', className: 'contact-social-link--fb' },
  Instagram: { glyph: '◎', className: 'contact-social-link--ig' },
  Twitter: { glyph: '𝕏', className: 'contact-social-link--tw' },
  LinkedIn: { glyph: 'in', className: 'contact-social-link--li' },
};

export default function Contact() {
  const { docs: deptContacts } = useOrderedCollection<ContactDoc>('contacts', 'order');
  const infoCards = useContentBlocks('contact', 'infoCards');
  const socialLinks = useContentBlocks('contact', 'socialLinks');
  const [form, setForm] = useState<ContactForm>(INITIAL_FORM);
  const [submitted, setSubmitted] = useState(false);
  const revealRefs = useRef<(HTMLElement | null)[]>([]);

  useEffect(() => {
    document.title = 'Contact Us | Vishnu Womens University';
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );
    revealRefs.current.forEach((el) => el && observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const addReveal = (el: HTMLElement | null, i: number) => {
    revealRefs.current[i] = el;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <main className="contact-page">
      {/* Hero */}
      <section className="contact-hero">
        <div className="contact-hero__overlay" />
        <div className="contact-hero__content">
          <p className="contact-hero__eyebrow">Get in Touch</p>
          <h1 className="contact-hero__title">Contact Us</h1>
          <p className="contact-hero__sub">
            We're happy to assist. Contact us for admissions information, general enquiries, or anything else on your mind.
          </p>
        </div>
      </section>

      {/* Info Cards — Firestore-derived, so no scroll-reveal animation
          on the cards themselves (see the gotcha documented in CLAUDE.md). */}
      <section className="contact-info-section">
        <div className="contact-container">
          <div className="contact-info-grid">
            {infoCards.map((c) => {
              const Icon = resolveContentIcon(c.icon) || MapPin;
              return (
                <div key={c.id} className="contact-info-card">
                  <div className="contact-info-icon"><Icon size={32} strokeWidth={1.75} /></div>
                  <h3>{c.title}</h3>
                  <p>
                    {c.desc.split('\n').map((line, i, arr) => (
                      <span key={i}>
                        {/^\S+@\S+\.\S+$/.test(line.trim()) ? <a href={`mailto:${line.trim()}`}>{line.trim()}</a> : line}
                        {i < arr.length - 1 && <br />}
                      </span>
                    ))}
                  </p>
                  {(c.value || c.slug) && (
                    <div className="contact-info-meta">
                      {c.value && <span>{c.value}</span>}
                      {c.slug && <span>{c.slug}</span>}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Map + Form */}
      <section className="contact-main-section">
        <div className="contact-container">
          <div className="contact-main-grid">
            {/* Map */}
            <div
              className="contact-map-col reveal"
              ref={(el) => addReveal(el, 4)}
              data-delay="0"
            >
              <h2 className="contact-section-title">Find Us</h2>
              <div className="contact-map-wrapper">
                <iframe
                  title="Vishnu Womens University Location"
                  src="https://maps.google.com/maps?q=16.568119,81.522098&z=15&output=embed"
                  width="100%"
                  height="400"
                  style={{ border: 0, borderRadius: '12px' }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>

              {/* Social Media */}
              <div className="contact-social">
                <h3>Follow Us</h3>
                <div className="contact-social-links">
                  {socialLinks.map((s) => {
                    const meta = SOCIAL_GLYPHS[s.title] || { glyph: '●', className: '' };
                    return (
                      <a
                        key={s.id}
                        href={s.value}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`contact-social-link ${meta.className}`}
                      >
                        {meta.glyph} {s.title}
                      </a>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div
              className="contact-form-col reveal"
              ref={(el) => addReveal(el, 5)}
              data-delay="150"
            >
              <h2 className="contact-section-title">Send a Message</h2>

              {submitted ? (
                <div className="contact-success">
                  <div className="contact-success__icon"><CheckCircle2 size={36} strokeWidth={2} /></div>
                  <h3>Message Sent!</h3>
                  <p>
                    Thank you for writing to us. A member of our team will respond within 1–2 working days.
                  </p>
                  <button
                    className="btn btn-primary"
                    onClick={() => {
                      setForm(INITIAL_FORM);
                      setSubmitted(false);
                    }}
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form className="contact-form" onSubmit={handleSubmit} noValidate>
                  <div className="contact-form-row">
                    <div className="contact-form-group">
                      <label htmlFor="cf-name">Full Name *</label>
                      <input
                        id="cf-name"
                        name="name"
                        type="text"
                        placeholder="Your full name"
                        value={form.name}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="contact-form-group">
                      <label htmlFor="cf-email">Email Address *</label>
                      <input
                        id="cf-email"
                        name="email"
                        type="email"
                        placeholder="you@example.com"
                        value={form.email}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>

                  <div className="contact-form-row">
                    <div className="contact-form-group">
                      <label htmlFor="cf-phone">Phone Number</label>
                      <input
                        id="cf-phone"
                        name="phone"
                        type="tel"
                        placeholder="+91 XXXXX XXXXX"
                        value={form.phone}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="contact-form-group">
                      <label htmlFor="cf-subject">Subject *</label>
                      <select
                        id="cf-subject"
                        name="subject"
                        value={form.subject}
                        onChange={handleChange}
                        required
                      >
                        <option value="">Select a subject</option>
                        <option value="Admissions Enquiry">Admissions Enquiry</option>
                        <option value="Academic Information">Academic Information</option>
                        <option value="Fee & Scholarships">Fee &amp; Scholarships</option>
                        <option value="Placements">Placements</option>
                        <option value="Hostel & Facilities">Hostel &amp; Facilities</option>
                        <option value="Research Collaboration">Research Collaboration</option>
                        <option value="Media & Press">Media &amp; Press</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                  </div>

                  <div className="contact-form-group">
                    <label htmlFor="cf-message">Message *</label>
                    <textarea
                      id="cf-message"
                      name="message"
                      rows={6}
                      placeholder="How can we help you?"
                      value={form.message}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <button type="submit" className="btn btn-primary btn-full">
                    Send Message →
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Departments Directory */}
      <section className="contact-dept-section">
        <div className="contact-container">
          <h2
            className="contact-section-title contact-section-title--center reveal"
            ref={(el) => addReveal(el, 6)}
            data-delay="0"
          >
            Department Contacts
          </h2>
          <div className="contact-dept-grid">
            {deptContacts.map((d) => (
              <div key={d.id} className="contact-dept-card">
                <h4>{d.dept}</h4>
                <p className="contact-dept-hod">{d.hod}</p>
                <a href={`mailto:${d.email}`} className="contact-dept-email">{d.email}</a>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
