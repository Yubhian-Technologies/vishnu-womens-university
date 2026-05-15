import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const positions = [
  {
    dept: 'Computer Science & Engineering',
    roles: [
      { title: 'Professor / Associate Professor', type: 'Teaching', qual: 'Ph.D. in CSE / IT / AI & related fields' },
      { title: 'Assistant Professor', type: 'Teaching', qual: 'M.Tech. in CSE / IT / AI (Ph.D. pursuing preferred)' },
    ],
  },
  {
    dept: 'Electronics & Communication Engineering',
    roles: [
      { title: 'Professor / Associate Professor', type: 'Teaching', qual: 'Ph.D. in ECE / VLSI / Signal Processing' },
      { title: 'Assistant Professor', type: 'Teaching', qual: 'M.Tech. in ECE / Embedded Systems (Ph.D. pursuing preferred)' },
    ],
  },
  {
    dept: 'Electrical & Electronics Engineering',
    roles: [
      { title: 'Professor / Associate Professor', type: 'Teaching', qual: 'Ph.D. in EEE / Power Electronics / Power Systems' },
      { title: 'Assistant Professor', type: 'Teaching', qual: 'M.Tech. in EEE / Power Systems (Ph.D. pursuing preferred)' },
    ],
  },
  {
    dept: 'Civil Engineering',
    roles: [
      { title: 'Professor / Associate Professor', type: 'Teaching', qual: 'Ph.D. in Civil Engineering / Structural Engineering' },
      { title: 'Assistant Professor', type: 'Teaching', qual: 'M.Tech. in Civil / Structural / Environmental Engg.' },
    ],
  },
  {
    dept: 'Mechanical Engineering',
    roles: [
      { title: 'Professor / Associate Professor', type: 'Teaching', qual: 'Ph.D. in Mechanical Engineering / CAD / Manufacturing' },
      { title: 'Assistant Professor', type: 'Teaching', qual: 'M.Tech. in ME / Thermal / Manufacturing (Ph.D. pursuing preferred)' },
    ],
  },
  {
    dept: 'Master of Business Administration',
    roles: [
      { title: 'Professor / Associate Professor', type: 'Teaching', qual: 'Ph.D. in Management / Finance / Marketing / HR' },
      { title: 'Assistant Professor', type: 'Teaching', qual: 'MBA with Ph.D. / UGC-NET qualified' },
    ],
  },
  {
    dept: 'Non-Teaching / Administrative',
    roles: [
      { title: 'Lab Technician / Lab Assistant', type: 'Technical', qual: 'B.Sc. / Diploma in relevant field' },
      { title: 'Administrative Officer', type: 'Administrative', qual: 'Graduate / Post-graduate with administrative experience' },
      { title: 'Librarian', type: 'Technical', qual: 'M.Lib.Sc. / B.Lib.Sc. with relevant experience' },
    ],
  },
];

const perks = [
  { icon: '🎓', title: 'Research Support', desc: 'Funding for research projects, conference attendance, and journal publications.' },
  { icon: '💰', title: 'Competitive Pay', desc: 'Pay scales as per AICTE/UGC norms with performance-linked increments.' },
  { icon: '🏥', title: 'Health & Wellness', desc: 'Medical facility, insurance coverage, and access to the Vishnu Wellness Centre.' },
  { icon: '🏠', title: 'Staff Quarters', desc: 'On-campus residential quarters within the Green Meadows campus network.' },
  { icon: '📚', title: 'Professional Development', desc: 'FDPs, workshops, certifications, and sabbatical leave for higher studies.' },
  { icon: '🤝', title: 'Inclusive Culture', desc: 'A women-first, diverse, and collaborative academic community.' },
];

type FormData = {
  name: string; email: string; phone: string; dept: string; position: string; experience: string; message: string;
};

export default function Careers() {
  const [form, setForm] = useState<FormData>({ name: '', email: '', phone: '', dept: '', position: '', experience: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    document.title = 'Careers | Vishnu Womens University';
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <main className="page-wrapper">
      {/* Hero */}
      <section className="page-hero">
        <img src="https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=1920&q=80" alt="Careers at VWU" className="page-hero-image" />
        <div className="page-hero-overlay" />
        <div className="container page-hero-content">
          <div className="breadcrumb animate-fade-in">
            <Link to="/" className="breadcrumb-item">Home</Link>
            <span className="breadcrumb-sep">›</span>
            <span className="breadcrumb-item active">Careers</span>
          </div>
          <h1 className="animate-fade-in-up">Build Your Career at VWU</h1>
          <p className="animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            Join a thriving community of educators, researchers, and administrators shaping the future of women's engineering education in India.
          </p>
        </div>
      </section>

      {/* Why Join */}
      <section className="section bg-off-white">
        <div className="container">
          <div className="reveal" style={{ textAlign: 'center', marginBottom: 'var(--space-12)' }}>
            <span className="section-label">Why VWU</span>
            <h2 className="section-title">Why Work With Us</h2>
            <p className="section-desc" style={{ margin: '0 auto' }}>
              VWU offers a supportive, research-driven environment where faculty and staff thrive alongside students.
            </p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 'var(--space-5)' }}>
            {perks.map((p, i) => (
              <div key={p.title} className="reveal" data-delay={`${i * 60}`}
                style={{ background: 'var(--color-white)', border: '1.5px solid var(--color-light-gray)', borderRadius: 'var(--radius-md)', padding: 'var(--space-6)', borderLeft: '4px solid var(--color-accent)' }}>
                <div style={{ fontSize: '2rem', marginBottom: 'var(--space-3)' }}>{p.icon}</div>
                <h3 style={{ fontFamily: 'var(--font-sans)', fontSize: 'var(--text-base)', fontWeight: 800, color: 'var(--color-primary)', marginBottom: 'var(--space-2)' }}>{p.title}</h3>
                <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-light)', lineHeight: 1.6 }}>{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Open Positions */}
      <section className="section bg-white">
        <div className="container">
          <div className="reveal" style={{ marginBottom: 'var(--space-10)' }}>
            <span className="section-label">Openings</span>
            <h2 className="section-title">Current Openings</h2>
            <p className="section-desc">We welcome applications from qualified candidates across all departments on a rolling basis.</p>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
            {positions.map((dept, i) => (
              <div key={dept.dept} className="reveal" data-delay={`${i * 40}`}
                style={{ border: '1.5px solid var(--color-light-gray)', borderRadius: 'var(--radius-md)', overflow: 'hidden' }}>
                <div style={{ background: 'var(--color-primary)', padding: 'var(--space-4) var(--space-6)' }}>
                  <h3 style={{ color: 'var(--color-white)', fontFamily: 'var(--font-sans)', fontWeight: 800, fontSize: 'var(--text-base)' }}>{dept.dept}</h3>
                </div>
                <div style={{ padding: 'var(--space-4) 0' }}>
                  {dept.roles.map((role) => (
                    <div key={role.title} style={{ display: 'grid', gridTemplateColumns: '1fr auto auto', gap: 'var(--space-4)', alignItems: 'center', padding: 'var(--space-3) var(--space-6)', borderBottom: '1px solid var(--color-off-white)' }}>
                      <div>
                        <div style={{ fontFamily: 'var(--font-sans)', fontWeight: 700, color: 'var(--color-primary)', fontSize: 'var(--text-sm)' }}>{role.title}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--color-text-light)', marginTop: 2 }}>{role.qual}</div>
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
              <p className="section-desc">Fill in the form below and our HR team will get in touch within 5–7 working days.</p>
            </div>

            {submitted ? (
              <div className="reveal" style={{ textAlign: 'center', background: 'var(--color-white)', border: '1.5px solid var(--color-light-gray)', borderRadius: 'var(--radius-md)', padding: 'var(--space-12)', borderTop: '4px solid var(--color-accent)' }}>
                <div style={{ fontSize: '3rem', marginBottom: 'var(--space-4)' }}>✅</div>
                <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.5rem', color: 'var(--color-primary)', marginBottom: 'var(--space-3)' }}>Application Submitted!</h3>
                <p style={{ color: 'var(--color-text-light)', lineHeight: 1.7 }}>Thank you for your interest in VWU. Our HR team will review your application and reach out within 5–7 working days.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="reveal" style={{ background: 'var(--color-white)', border: '1.5px solid var(--color-light-gray)', borderRadius: 'var(--radius-md)', padding: 'var(--space-8)', display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-5)' }}>
                  {([['name', 'Full Name', 'text'], ['email', 'Email Address', 'email'], ['phone', 'Phone Number', 'tel']] as const).map(([key, label, type]) => (
                    <div key={key} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
                      <label style={{ fontSize: 'var(--text-sm)', fontWeight: 700, color: 'var(--color-primary)', fontFamily: 'var(--font-sans)' }}>{label} *</label>
                      <input type={type} required value={form[key]} onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
                        style={{ padding: 'var(--space-3) var(--space-4)', border: '1.5px solid var(--color-light-gray)', borderRadius: 'var(--radius-sm)', fontSize: 'var(--text-sm)', fontFamily: 'var(--font-sans)', outline: 'none', color: 'var(--color-text)' }} />
                    </div>
                  ))}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
                    <label style={{ fontSize: 'var(--text-sm)', fontWeight: 700, color: 'var(--color-primary)', fontFamily: 'var(--font-sans)' }}>Years of Experience *</label>
                    <select required value={form.experience} onChange={e => setForm(f => ({ ...f, experience: e.target.value }))}
                      style={{ padding: 'var(--space-3) var(--space-4)', border: '1.5px solid var(--color-light-gray)', borderRadius: 'var(--radius-sm)', fontSize: 'var(--text-sm)', fontFamily: 'var(--font-sans)', outline: 'none', color: 'var(--color-text)', background: 'var(--color-white)' }}>
                      <option value="">Select</option>
                      {['Fresher', '1–3 years', '3–5 years', '5–10 years', '10+ years'].map(o => <option key={o} value={o}>{o}</option>)}
                    </select>
                  </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-5)' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
                    <label style={{ fontSize: 'var(--text-sm)', fontWeight: 700, color: 'var(--color-primary)', fontFamily: 'var(--font-sans)' }}>Department *</label>
                    <select required value={form.dept} onChange={e => setForm(f => ({ ...f, dept: e.target.value }))}
                      style={{ padding: 'var(--space-3) var(--space-4)', border: '1.5px solid var(--color-light-gray)', borderRadius: 'var(--radius-sm)', fontSize: 'var(--text-sm)', fontFamily: 'var(--font-sans)', outline: 'none', color: 'var(--color-text)', background: 'var(--color-white)' }}>
                      <option value="">Select Department</option>
                      {positions.map(d => <option key={d.dept} value={d.dept}>{d.dept}</option>)}
                    </select>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
                    <label style={{ fontSize: 'var(--text-sm)', fontWeight: 700, color: 'var(--color-primary)', fontFamily: 'var(--font-sans)' }}>Position Applied For *</label>
                    <select required value={form.position} onChange={e => setForm(f => ({ ...f, position: e.target.value }))}
                      style={{ padding: 'var(--space-3) var(--space-4)', border: '1.5px solid var(--color-light-gray)', borderRadius: 'var(--radius-sm)', fontSize: 'var(--text-sm)', fontFamily: 'var(--font-sans)', outline: 'none', color: 'var(--color-text)', background: 'var(--color-white)' }}>
                      <option value="">Select Position</option>
                      {['Professor', 'Associate Professor', 'Assistant Professor', 'Lab Technician', 'Administrative Staff', 'Other'].map(o => <option key={o} value={o}>{o}</option>)}
                    </select>
                  </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
                  <label style={{ fontSize: 'var(--text-sm)', fontWeight: 700, color: 'var(--color-primary)', fontFamily: 'var(--font-sans)' }}>Cover Letter / Message</label>
                  <textarea rows={4} value={form.message} onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                    placeholder="Briefly describe your qualifications, research interests, and why you'd like to join VWU..."
                    style={{ padding: 'var(--space-3) var(--space-4)', border: '1.5px solid var(--color-light-gray)', borderRadius: 'var(--radius-sm)', fontSize: 'var(--text-sm)', fontFamily: 'var(--font-sans)', outline: 'none', color: 'var(--color-text)', resize: 'vertical' }} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
                  <label style={{ fontSize: 'var(--text-sm)', fontWeight: 700, color: 'var(--color-primary)', fontFamily: 'var(--font-sans)' }}>Upload CV / Resume (PDF)</label>
                  <input type="file" accept=".pdf,.doc,.docx"
                    style={{ padding: 'var(--space-2)', border: '1.5px solid var(--color-light-gray)', borderRadius: 'var(--radius-sm)', fontSize: 'var(--text-sm)', fontFamily: 'var(--font-sans)' }} />
                </div>
                <button type="submit" className="btn btn-primary btn-lg" style={{ alignSelf: 'flex-start' }}>
                  Submit Application →
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
              For queries about positions, eligibility, or the selection process, write to us at <strong style={{ color: 'var(--color-accent)' }}>info@svecw.edu.in</strong> or call <strong style={{ color: 'var(--color-accent)' }}>08816-250864</strong>.
            </p>
            <Link to="/contact" className="btn btn-accent btn-lg">Contact Us</Link>
          </div>
        </div>
      </section>
    </main>
  );
}
