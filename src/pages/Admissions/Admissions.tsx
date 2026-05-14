import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Admissions.css';

const steps = [
  { step: 1, icon: '📝', title: 'Appear for EAPCET / ECET', desc: 'Qualify in AP EAPCET for B.Tech, AP ECET for lateral entry, or AP PGECET / ICET for PG programs. VWU Code: VISW.' },
  { step: 2, icon: '📄', title: 'Submit Your Documents', desc: 'Provide your qualifying exam rank card, academic certificates, transfer certificate, and passport-size photographs.' },
  { step: 3, icon: '💰', title: 'Explore Scholarships', desc: 'Check eligibility for SC/ST/BC scholarships, merit scholarships, and central government fee reimbursement schemes.' },
  { step: 4, icon: '🏫', title: 'Visit Our Campus', desc: 'Schedule a personalized campus visit to meet faculty, tour world-class labs, and experience VWU firsthand.' },
  { step: 5, icon: '🎉', title: 'Confirm Admission & Enroll', desc: 'Complete fee payment, submit original documents, and begin your engineering journey at VWU!' },
];

const scholarships = [
  { name: 'SC/ST Fee Reimbursement', amount: 'Full Tuition', criteria: 'SC/ST students with family income < ₹2.5 LPA' },
  { name: 'BC Scholarship', amount: 'Partial Fee Waiver', criteria: 'BC category students as per government norms' },
  { name: 'Merit Scholarship', amount: 'Up to ₹50,000/year', criteria: 'Top rank holders in EAPCET' },
  { name: 'EBC Scholarship', amount: 'Partial Fee Support', criteria: 'Economically Backward Classes students' },
  { name: 'Sports Scholarship', amount: 'Varies', criteria: 'Students with outstanding sports achievements' },
  { name: 'Management Scholarship', amount: 'Up to ₹30,000/year', criteria: 'Academic excellence in previous semester' },
];

const tuitionData = [
  { label: 'B.Tech Tuition (per year)', value: 'As per AP Govt.' },
  { label: 'Hostel Fee (per year)', value: '₹60,000 – ₹80,000' },
  { label: 'Books & Supplies', value: '₹10,000 (approx.)' },
  { label: 'Total Cost of Attendance', value: 'Govt. Regulated' },
  { label: 'Scholarship Coverage', value: 'Up to 100%' },
  { label: 'Average Net Price', value: 'Very Affordable' },
];

const visitOptions = [
  { icon: '👥', title: 'Group Campus Tour', desc: 'Join a guided tour of VWU\'s campus — visit cutting-edge labs, smart classrooms, hostels, and student life facilities in Bhimavaram.' },
  { icon: '🎯', title: 'Individual Visit Day', desc: 'Schedule a personalized visit with our admissions team, attend a demo class, and meet faculty in your area of interest.' },
  { icon: '🌐', title: 'Virtual Campus Tour', desc: 'Can\'t make it to Bhimavaram? Explore our campus virtually and connect with our admissions team via video call.' },
  { icon: '🏫', title: 'Open Day for Admitted Students', desc: 'Spend a full day at VWU after your admission — meet your future batchmates, faculty, and explore student activities.' },
];

export default function Admissions() {
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
      <section className="page-hero">
        <img
          src="https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=1920&q=80"
          alt="Students at DWU graduation ceremony"
          className="page-hero-image"
        />
        <div className="page-hero-overlay" />
        <div className="container page-hero-content">
          <div className="breadcrumb animate-fade-in">
            <Link to="/" className="breadcrumb-item">Home</Link>
            <span className="breadcrumb-sep">›</span>
            <span className="breadcrumb-item active">Admissions</span>
          </div>
          <h1 className="animate-fade-in-up">Your Journey Starts Here</h1>
          <p className="animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            Joining VWU is the first step toward a rewarding engineering career, a powerful network, and a future you'll be proud of.
          </p>
          <div style={{ display: 'flex', gap: 'var(--space-4)', marginTop: 'var(--space-6)', flexWrap: 'wrap' }} className="animate-fade-in-up">
            <a href="#apply" className="btn btn-accent btn-lg">Apply for Free</a>
            <a href="#visit" className="btn btn-secondary btn-lg">Schedule a Visit</a>
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
            {steps.map((s, i) => (
              <div key={s.step} className="adm-step reveal" data-delay={`${i * 100}`}>
                <div className="adm-step-number">{s.step}</div>
                <div className="adm-step-icon">{s.icon}</div>
                <h3 className="adm-step-title">{s.title}</h3>
                <p className="adm-step-desc">{s.desc}</p>
              </div>
            ))}
          </div>
          <div style={{ textAlign: 'center', marginTop: 'var(--space-10)' }}>
            <a href="#" className="btn btn-primary btn-lg">Start Your Application</a>
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
              VWU supports students through government scholarships, fee reimbursement, and
              merit-based awards to ensure quality engineering education is within reach for all.
            </p>
          </div>

          <div className="adm-scholarship-grid">
            {scholarships.map((s, i) => (
              <div key={s.name} className="adm-scholarship-card reveal" data-delay={`${i * 80}`}>
                <div className="adm-scholarship-header">
                  <h3>{s.name}</h3>
                  <div className="adm-scholarship-amount">{s.amount}</div>
                </div>
                <p className="adm-scholarship-criteria">{s.criteria}</p>
              </div>
            ))}
          </div>

          <div className="adm-fafsa-cta reveal" data-delay="200">
            <div className="adm-fafsa-icon">📋</div>
            <div>
              <h3>Apply for AP Scholarships</h3>
              <p>Apply for AP government scholarships, SC/ST/BC fee reimbursement, and central government scholarship schemes via the National Scholarship Portal.</p>
            </div>
            <a href="#" className="btn btn-accent">Check Scholarship Eligibility</a>
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
                VWU follows the AP government's regulated fee structure. With generous scholarships
                and government reimbursement schemes, engineering education here is highly affordable.
              </p>
              <Link to="/admissions" className="btn btn-accent">Estimate Your Cost</Link>
            </div>
            <div className="adm-tuition-table reveal-right">
              {tuitionData.map((row, i) => (
                <div key={row.label} className="adm-tuition-row" style={{ borderTop: i === tuitionData.length - 2 ? '2px solid rgba(201,168,76,0.4)' : undefined }}>
                  <span>{row.label}</span>
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
              The best way to decide if VWU is your home is to visit. Choose the experience that works best for you.
            </p>
          </div>
          <div className="adm-visit-grid">
            {visitOptions.map((v, i) => (
              <div key={v.title} className="adm-visit-card reveal" data-delay={`${i * 80}`}>
                <div className="adm-visit-icon">{v.icon}</div>
                <h3>{v.title}</h3>
                <p>{v.desc}</p>
                <Link to="/admissions" className="btn btn-outline" style={{ marginTop: 'auto' }}>Schedule Now</Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Admissions */}
      <section className="section bg-white">
        <div className="container">
          <div className="adm-contact-grid">
            <div className="reveal-left">
              <span className="section-label">Contact Us</span>
              <h2 className="section-title">Talk to Our Admissions Team</h2>
              <p className="section-desc" style={{ marginBottom: 'var(--space-6)' }}>
                Our admissions team is here to answer your questions, guide you through the process,
                and help you find your place at VWU.
              </p>
              <div className="adm-contact-info">
                <div className="adm-contact-item">
                  <span>📞</span>
                  <div>
                    <strong>Phone</strong>
                    <a href="tel:08816250864">08816-250864</a>
                  </div>
                </div>
                <div className="adm-contact-item">
                  <span>📧</span>
                  <div>
                    <strong>Email</strong>
                    <a href="mailto:info@svecw.edu.in">info@svecw.edu.in</a>
                  </div>
                </div>
                <div className="adm-contact-item">
                  <span>📍</span>
                  <div>
                    <strong>Office Location</strong>
                    <span>Bhimavaram, West Godavari Dist., AP – 534 202</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="adm-form-card reveal-right">
              <h3>Request Information</h3>
              <form onSubmit={e => e.preventDefault()} className="adm-form">
                <div className="adm-form-row">
                  <div className="adm-form-group">
                    <label>First Name</label>
                    <input type="text" placeholder="First name" />
                  </div>
                  <div className="adm-form-group">
                    <label>Last Name</label>
                    <input type="text" placeholder="Last name" />
                  </div>
                </div>
                <div className="adm-form-group">
                  <label>Email Address</label>
                  <input type="email" placeholder="your@email.com" />
                </div>
                <div className="adm-form-group">
                  <label>Program Interest</label>
                  <select>
                    <option>Select a program...</option>
                    <option>B.Tech – CSE / AI&ML / AI&DS / Cyber Security</option>
                    <option>B.Tech – ECE / EEE / IT</option>
                    <option>B.Tech – Civil / Mechanical Engineering</option>
                    <option>M.Tech Programs</option>
                    <option>MBA</option>
                    <option>Ph.D. Programs</option>
                  </select>
                </div>
                <div className="adm-form-group">
                  <label>Expected Start Term</label>
                  <select>
                    <option>Fall 2026</option>
                    <option>Spring 2027</option>
                    <option>Fall 2027</option>
                  </select>
                </div>
                <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
                  Request Information
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
