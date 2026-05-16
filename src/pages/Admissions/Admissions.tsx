import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './Admissions.css';
import PageHero from '../../components/PageHero/PageHero';
import PhotoGrid from '../../components/PhotoGrid/PhotoGrid';

const admissionsPhotos = [
  { src: 'https://images.unsplash.com/photo-1562774053-701939374585?w=800&q=80', alt: 'VWU campus buildings', caption: 'VWU Campus' },
  { src: 'https://images.unsplash.com/photo-1498243691581-b145c3f54a5a?w=800&q=80', alt: 'Smart classrooms', caption: 'Smart Classrooms' },
  { src: 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=800&q=80', alt: 'Research labs', caption: 'Specialised Labs' },
  { src: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=800&q=80', alt: 'Campus hostel', caption: 'Student Hostels' },
  { src: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=800&q=80', alt: 'Sports court', caption: 'Sports Facilities' },
  { src: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&q=80', alt: 'Graduation day', caption: 'Placement Season' },
  { src: 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?w=800&q=80', alt: 'Technical workshops', caption: 'Industry Workshops' },
  { src: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=800&q=80', alt: 'Central library', caption: 'Central Library' },
];

const steps = [
  { step: 1, icon: '📝', title: 'Appear for EAPCET / ECET', desc: 'Qualify in AP EAPCET for B.Tech, AP ECET for lateral entry, or AP PGECET / ICET for PG programs. VWU Code: VISW.' },
  { step: 2, icon: '📄', title: 'Submit Your Documents', desc: 'Bring your qualifying exam rank card, academic certificates, transfer certificate, and passport-size photographs.' },
  { step: 3, icon: '💰', title: 'Explore Scholarships', desc: 'Review your eligibility for SC/ST/BC scholarships, merit-based awards, and central government fee reimbursement schemes.' },
  { step: 4, icon: '🏫', title: 'Visit Our Campus', desc: 'Book a personalised campus visit to meet faculty, see the facilities, and get a true sense of life at VWU.' },
  { step: 5, icon: '🎉', title: 'Confirm Admission & Enroll', desc: 'Complete your fee payment, submit original documents, and officially begin your engineering journey at VWU.' },
];

const scholarships = [
  { name: 'SC/ST Fee Reimbursement', amount: 'Full Tuition', criteria: 'SC/ST students with family income < ₹2.5 LPA' },
  { name: 'BC Scholarship', amount: 'Partial Fee Waiver', criteria: 'BC category students as per government norms' },
  { name: 'Merit Scholarship', amount: 'Up to ₹50,000/year', criteria: 'Top rank holders in EAPCET' },
  { name: 'EBC Scholarship', amount: 'Partial Fee Support', criteria: 'Economically Backward Classes students' },
  { name: 'Sports Scholarship', amount: 'Varies', criteria: 'Students with outstanding sports achievements' },
  { name: 'Management Scholarship', amount: 'Up to ₹30,000/year', criteria: 'Academic excellence in previous semester' },
];

const admissionHub = [
  { icon: '📋', title: 'Programmes & Fee Structure', desc: 'B.Tech, M.Tech, MBA, and Ph.D. programmes listed with intake numbers and annual fee details.', path: '/programmes-fee-structure', highlight: 'B.Tech: ₹1,05,000/yr' },
  { icon: '📝', title: 'Admission Procedure', desc: 'A step-by-step guide covering EAPCET (Code: VISW), GATE, ICET, and ECET eligibility and processes.', path: '/admission-procedure', highlight: 'EAPCET Code: VISW' },
  { icon: '📊', title: 'Result Analysis', desc: 'Ranked among the Top 5 JNTUK-affiliated colleges. 90%+ annual pass rate. University Gold Medallists.', path: '/result-analysis', highlight: 'Top 5 in JNTUK' },
  { icon: '💳', title: 'Fee Payment Portal', desc: 'Secure online portal for paying tuition, hostel, and examination fees.', path: '/admissions', highlight: 'Pay Online' },
];

const tuitionData = [
  { label: 'B.Tech (per year)', value: '₹ 1,05,000' },
  { label: 'M.Tech (per year)', value: '₹ 55,800' },
  { label: 'MBA (per year)', value: '₹ 55,000' },
  { label: 'Hostel Fee (per year)', value: '₹ 60,000 – ₹ 80,000' },
  { label: 'PM Vidyalaxmi Scheme', value: 'Available' },
  { label: 'Scholarship Coverage', value: 'Up to 100%' },
];

const faqs = [
  { q: 'What is the VWU college code for EAPCET?', a: 'The college code for VWU in AP EAPCET (B.Tech admissions) is VISW. Enter this code when selecting college preferences during the AP EAPCET counselling process.' },
  { q: 'Is VWU an autonomous college?', a: 'Yes. VWU has held Autonomous Status granted by the University Grants Commission (UGC) since 2014. This enables VWU to frame its own curriculum and conduct independent examinations.' },
  { q: 'What is the hostel fee at VWU?', a: 'Hostel fees at VWU range between ₹60,000 and ₹80,000 per year, based on the type of accommodation. Dedicated mess facilities are available for students residing in the hostel.' },
  { q: 'Are government scholarships available at VWU?', a: 'Yes. SC/ST/BC/EBC students may qualify for full or partial fee reimbursement under AP government scholarship programs. Applications are submitted through the AP scholarship portal.' },
  { q: 'What documents are required for admission?', a: 'Required documents include: EAPCET rank card, Class 10 and 12 mark sheets and certificates, transfer certificate, conduct certificate, Aadhaar card, caste certificate (if applicable), and 8 passport-size photographs.' },
  { q: 'Is VWU affiliated to JNTUK?', a: 'Yes. Vishnu Womens University is affiliated to Jawaharlal Nehru Technological University Kakinada (JNTUK) for all its engineering programmes.' },
  { q: 'What are the placement opportunities at VWU?', a: 'VWU\'s Training & Placement Cell recorded 1,400+ placements in 2024–25. Regular recruiters include Amazon, TCS, Infosys, Wipro, and 150+ other companies. The highest package in 2024–25 was 52 LPA.' },
  { q: 'Can I take a campus tour before applying?', a: 'Yes, and we actively encourage it. Prospective students and their families are welcome to visit the campus in Bhimavaram. You can book a group tour, an individual visit, or a virtual walkthrough by reaching out to our admissions office.' },
];

const visitOptions = [
  { icon: '👥', title: 'Group Campus Tour', desc: 'Join a guided walkthrough of the VWU campus — see the labs, smart classrooms, hostels, and student facilities in Bhimavaram.' },
  { icon: '🎯', title: 'Individual Visit Day', desc: 'Arrange a one-on-one visit with our admissions team, sit in on a demo class, and meet faculty from your preferred department.' },
  { icon: '🌐', title: 'Virtual Campus Tour', desc: 'Unable to travel to Bhimavaram? Take an online tour of the campus and speak with our admissions team via video call.' },
  { icon: '🏫', title: 'Open Day for Admitted Students', desc: 'Spend a full day at VWU after confirming your admission — meet your future classmates, faculty, and student activity groups.' },
];

export default function Admissions() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

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
        defaultImage="https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=1920&q=80"
        defaultTitle="Your Journey Starts Here"
  defaultSubtitle="Choosing VWU sets you on a path to a fulfilling engineering career, a strong professional network, and a future built on real achievement."
        breadcrumb={[{ label: 'Home', to: '/' }, { label: 'Admissions' }]}
      />

      {/* Admissions Hub */}
      <section className="section bg-off-white" style={{ paddingBottom: 0 }}>
        <div className="container">
          <div className="reveal" style={{ textAlign: 'center', marginBottom: 'var(--space-8)' }}>
            <span className="section-label">Admissions</span>
            <h2 className="section-title">Everything You Need to Apply</h2>
            <p className="section-desc" style={{ margin: '0 auto' }}>
              Everything you need to apply — fees, step-by-step procedure, results, and the payment portal — in one place.
            </p>
          </div>
          <div className="adm-hub-grid">
            {admissionHub.map((item, i) => (
              <Link to={item.path} key={item.title} className="adm-hub-card reveal" data-delay={`${i * 80}`}>
                <div className="adm-hub-icon">{item.icon}</div>
                <div className="adm-hub-highlight">{item.highlight}</div>
                <h3 className="adm-hub-title">{item.title}</h3>
                <p className="adm-hub-desc">{item.desc}</p>
                <span className="adm-hub-arrow">View Details →</span>
              </Link>
            ))}
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
              VWU helps students access government scholarships, fee reimbursement schemes, and
              merit-based awards so that quality engineering education is genuinely within reach.
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
              <p>Submit applications for AP government scholarships, SC/ST/BC fee reimbursement, and central government scholarship schemes through the National Scholarship Portal.</p>
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
                B.Tech tuition is ₹1,05,000 per year. M.Tech is ₹55,800 and MBA is ₹55,000 annually.
                Through government scholarships, SC/ST/BC fee reimbursement, and the PM Vidyalaxmi Scheme,
                a VWU education is financially accessible to every deserving student.
              </p>
              <Link to="/programmes-fee-structure" className="btn btn-accent">View Full Fee Structure</Link>
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
              Seeing VWU in person is the best way to know if it is the right fit for you. Choose the visit format that suits you best.
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

      {/* Campus Photos */}
      <section className="section bg-off-white">
        <div className="container">
          <PhotoGrid
            images={admissionsPhotos}
            label="Why VWU"
            title="Experience the VWU Difference"
            subtitle="From modern labs and smart classrooms to hostels, sports grounds, and a buzzing placement season — see what awaits you."
            columns={4}
          />
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
                Our admissions team is ready to answer your questions, walk you through each step,
                and help you find your path at VWU.
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
            {faqs.map((faq, i) => (
              <div key={i} className={`adm-faq-item reveal${openFaq === i ? ' open' : ''}`} data-delay={`${i * 50}`}>
                <button
                  className="adm-faq-question"
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  aria-expanded={openFaq === i}
                >
                  <span>{faq.q}</span>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0, transition: 'transform 0.3s', transform: openFaq === i ? 'rotate(180deg)' : 'rotate(0deg)' }}>
                    <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
                {openFaq === i && (
                  <div className="adm-faq-answer">{faq.a}</div>
                )}
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
