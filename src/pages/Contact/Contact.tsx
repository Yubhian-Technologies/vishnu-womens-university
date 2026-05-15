import { useEffect, useRef, useState } from 'react';
import './Contact.css';

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

export default function Contact() {
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

      {/* Info Cards */}
      <section className="contact-info-section">
        <div className="contact-container">
          <div className="contact-info-grid">
            {/* Main Campus */}
            <div
              className="contact-info-card reveal"
              ref={(el) => addReveal(el, 0)}
              data-delay="0"
            >
              <div className="contact-info-icon">📍</div>
              <h3>Main Campus</h3>
              <p>
                Vishnupur, Bhimavaram – 534&nbsp;202<br />
                West Godavari District<br />
                Andhra Pradesh, India
              </p>
              <div className="contact-info-meta">
                <span>📞 08816-250864</span>
                <span>📠 08816-250099</span>
              </div>
            </div>

            {/* Email */}
            <div
              className="contact-info-card reveal"
              ref={(el) => addReveal(el, 1)}
              data-delay="100"
            >
              <div className="contact-info-icon">✉️</div>
              <h3>Email Us</h3>
              <p>
                <a href="mailto:info@svecw.edu.in">info@svecw.edu.in</a><br />
                <a href="mailto:principal@svecw.edu.in">principal@svecw.edu.in</a>
              </p>
              <div className="contact-info-meta">
                <span>🕘 Mon–Sat: 9 AM – 5 PM</span>
              </div>
            </div>

            {/* Society HQ */}
            <div
              className="contact-info-card reveal"
              ref={(el) => addReveal(el, 2)}
              data-delay="200"
            >
              <div className="contact-info-icon">🏢</div>
              <h3>Society Headquarters</h3>
              <p>
                Plot 7 &amp; 8, Nagarjuna Hills<br />
                Punjagutta Main Road<br />
                Hyderabad – 500&nbsp;082, Telangana
              </p>
              <div className="contact-info-meta">
                <span>📞 040-40334899 / 897 / 866 / 829</span>
                <span>📠 040-40334818 / 4848</span>
              </div>
            </div>

            {/* Quick Info */}
            <div
              className="contact-info-card reveal"
              ref={(el) => addReveal(el, 3)}
              data-delay="300"
            >
              <div className="contact-info-icon">🎓</div>
              <h3>Admissions Quick Info</h3>
              <p>
                EAPCET Code: <strong>VISW</strong><br />
                Autonomous Institution under JNT University Kakinada<br />
                NAAC Accredited
              </p>
              <div className="contact-info-meta">
                <span>📞 08816-250864</span>
              </div>
            </div>
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
                  <a
                    href="https://www.youtube.com/@SVECW-B0"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="contact-social-link contact-social-link--yt"
                  >
                    ▶ YouTube
                  </a>
                  <a
                    href="https://www.facebook.com/svecwcollege"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="contact-social-link contact-social-link--fb"
                  >
                    f Facebook
                  </a>
                  <a
                    href="https://www.instagram.com/vishnu_svecw/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="contact-social-link contact-social-link--ig"
                  >
                    ◎ Instagram
                  </a>
                  <a
                    href="https://twitter.com/svecw2"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="contact-social-link contact-social-link--tw"
                  >
                    𝕏 Twitter
                  </a>
                  <a
                    href="https://www.linkedin.com/school/vishnusvecw/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="contact-social-link contact-social-link--li"
                  >
                    in LinkedIn
                  </a>
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
                  <div className="contact-success__icon">✓</div>
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
            {[
              { dept: 'CSE', hod: 'Dr. P. Kiran Sree', phone: '08816-250864', email: 'hod.cse@svecw.edu.in' },
              { dept: 'AI & ML / AI & DS', hod: 'Dr. P. Kiran Sree', phone: '08816-250864', email: 'hod.aiml@svecw.edu.in' },
              { dept: 'Information Technology', hod: 'Dr. D. Venkata Naga Raju', phone: '08816-250864', email: 'hod.it@svecw.edu.in' },
              { dept: 'Electronics & Communication', hod: 'Dr. K. Padma Vasavi', phone: '08816-250864', email: 'hod.ece@svecw.edu.in' },
              { dept: 'Electrical & Electronics', hod: 'Dr. S. M. Padmaja', phone: '08816-250864', email: 'hod.eee@svecw.edu.in' },
              { dept: 'Civil Engineering', hod: 'Dr. Pala Gireesh Kumar', phone: '08816-250864', email: 'hod.civil@svecw.edu.in' },
              { dept: 'Mechanical Engineering', hod: 'Dr. Ch. Hari Krishna', phone: '08816-250864', email: 'hod.mech@svecw.edu.in' },
              { dept: 'MBA', hod: 'Head of Department', phone: '08816-250864', email: 'hod.mba@svecw.edu.in' },
            ].map((d, i) => (
              <div
                key={d.dept}
                className="contact-dept-card reveal"
                ref={(el) => addReveal(el, 7 + i)}
                data-delay={`${(i % 4) * 100}`}
              >
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
