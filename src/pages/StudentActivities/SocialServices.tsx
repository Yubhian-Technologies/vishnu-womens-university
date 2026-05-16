import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import PageHero from '../../components/PageHero/PageHero';

const communities = [
  { icon: '📚', title: 'Rural Students', desc: 'Extending educational support and skills programs to economically disadvantaged students from rural backgrounds.' },
  { icon: '🏥', title: 'Leprosy Care', desc: 'Offering care, compassion, and dignity to individuals affected by leprosy through regular visits and welfare activities.' },
  { icon: '🏘️', title: 'Village Communities', desc: 'Working with nearby villages on technical literacy, nutritional awareness, and broader community welfare initiatives.' },
  { icon: '♿', title: 'Persons with Disabilities', desc: 'Supporting individuals with physical disabilities through awareness programs, assistive technology exposure, and inclusive campus activities.' },
  { icon: '🏨', title: 'Hospital Patients', desc: 'Serving hospital patients through welfare visits, blood donation drives, and coordination with partner organisations.' },
  { icon: '🏆', title: 'Academic Excellence', desc: 'Acknowledging and supporting high-achieving students from nearby institutions through mentoring and motivational programs.' },
];

const nssValues = [
  'Not Me But You',
  'Service before Self',
  'Education through Community',
  'Nation Building through Youth',
  'Inclusive Development',
  'Rural Empowerment',
];

export default function SocialServices() {
  useEffect(() => {
    document.title = 'Social Services | VWU';
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
    document.querySelectorAll('.reveal, .reveal-left, .reveal-right').forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <main className="page-wrapper">
      {/* Hero */}
      <PageHero
        page="social-services"
        defaultImage="https://images.unsplash.com/photo-1593113598332-cd288d649433?w=1920&q=80"
        defaultTitle="Social Services"
  defaultSubtitle="The National Service Scheme at VWU shapes engineers who are equally committed to their craft and to the communities they serve."
        breadcrumb={[{ label: 'Home', to: '/' }, { label: 'Student Life', to: '/student-life' }, { label: 'Social Services' }]}
      />

      {/* NSS Philosophy */}
      <section className="section bg-white">
        <div className="container">
          <div className="grid-img-text">
            <div className="reveal-left">
              <span className="section-label">NSS at VWU</span>
              <h2 className="section-title">Serving the Nation Through Education</h2>
              <div className="divider" />
              <blockquote style={{ borderLeft: '4px solid var(--color-accent)', paddingLeft: 'var(--space-5)', marginBottom: 'var(--space-5)', fontFamily: 'var(--font-serif)', fontSize: '1.15rem', color: 'var(--color-primary)', fontStyle: 'italic', lineHeight: 1.7 }}>
                "National integrity should flow from the heart of every citizen. Apart from academics, every student must involve in serving her country."
              </blockquote>
              <p style={{ lineHeight: 1.8, marginBottom: 'var(--space-4)', color: 'var(--color-text-light)' }}>
                At VWU, the <strong>National Service Scheme (NSS)</strong> is a meaningful part of student formation.
                The programme rests on the conviction that <em>"Education and Service to the community and by the community"</em>
                is the true basis of a complete education.
              </p>
              <p style={{ lineHeight: 1.8, color: 'var(--color-text-light)' }}>
                Through NSS, students take part in nation-building work, strengthen their interpersonal abilities,
                and help foster a <strong>Technocratic Environment</strong> in rural communities — continuing
                the humanitarian values that our founder Dr. B. V. Raju embodied throughout his life.
              </p>
            </div>
            <div className="reveal-right">
              <img
                src="https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=900&q=80"
                alt="NSS community service"
                style={{ width: '100%', height: '400px', objectFit: 'cover', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-xl)' }}
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Communities We Serve */}
      <section className="section bg-off-white">
        <div className="container">
          <div className="reveal" style={{ textAlign: 'center', marginBottom: 'var(--space-12)' }}>
            <span className="section-label">Outreach</span>
            <h2 className="section-title">Communities We Serve</h2>
            <p className="section-desc" style={{ margin: '0 auto' }}>
              The VWU NSS programme directs its efforts toward six key communities, creating tangible impact well beyond the campus.
            </p>
          </div>
          <div className="grid-3">
            {communities.map((c, i) => (
              <div key={c.title} className="reveal" data-delay={`${i * 80}`}
                style={{ background: 'var(--color-white)', border: '1.5px solid var(--color-light-gray)', borderRadius: 'var(--radius-md)', padding: 'var(--space-6)', transition: 'all var(--transition-base)' }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--color-accent)'; (e.currentTarget as HTMLElement).style.boxShadow = 'var(--shadow-md)'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--color-light-gray)'; (e.currentTarget as HTMLElement).style.boxShadow = 'none'; }}
              >
                <div style={{ fontSize: '2.2rem', marginBottom: 'var(--space-3)' }}>{c.icon}</div>
                <h3 style={{ fontFamily: 'var(--font-sans)', fontSize: 'var(--text-base)', fontWeight: 900, color: 'var(--color-primary)', marginBottom: 'var(--space-2)' }}>{c.title}</h3>
                <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-light)', lineHeight: 1.6 }}>{c.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* NSS Values + Founder Legacy */}
      <section className="section" style={{ background: 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-secondary) 100%)' }}>
        <div className="container">
          <div className="grid-2">
            <div className="reveal-left">
              <span className="section-label" style={{ color: 'var(--color-accent)' }}>Our Values</span>
              <h2 style={{ color: 'var(--color-white)', marginBottom: 'var(--space-6)' }}>NSS Core Values</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                {nssValues.map((v) => (
                  <div key={v} style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                    <span style={{ color: 'var(--color-accent)', fontWeight: 900, fontSize: '1.2rem' }}>✦</span>
                    <span style={{ color: 'rgba(255,255,255,0.85)', fontFamily: 'var(--font-sans)', fontSize: 'var(--text-base)', fontWeight: 600 }}>{v}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="reveal-right">
              <span className="section-label" style={{ color: 'var(--color-accent)' }}>Founder's Legacy</span>
              <h2 style={{ color: 'var(--color-white)', marginBottom: 'var(--space-4)' }}>Dr. B. V. Raju Foundation</h2>
              <p style={{ color: 'rgba(255,255,255,0.8)', lineHeight: 1.8, marginBottom: 'var(--space-4)' }}>
                VWU's ethos of service has deep roots in the life of our founder, the late <strong style={{ color: 'var(--color-accent)' }}>Padma Bhushan Dr. B. V. Raju</strong>,
                who devoted his later years to humanitarian causes — building leprosy care centres, schools,
                women's associations, community halls, and veterinary facilities in surrounding villages, all without government support.
              </p>
              <p style={{ color: 'rgba(255,255,255,0.7)', lineHeight: 1.8 }}>
                The <strong style={{ color: 'rgba(255,255,255,0.9)' }}>Dr. B. V. Raju Foundation</strong> continues this tradition today.
                VWU students take an active part in this mission, channelling their technical knowledge, empathy, and sense of purpose into communities that genuinely need both.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ background: 'var(--color-primary)', padding: 'var(--space-12) 0' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <div className="reveal">
            <h2 style={{ color: 'var(--color-white)', marginBottom: 'var(--space-4)' }}>Explore More Student Activities</h2>
            <div style={{ display: 'flex', gap: 'var(--space-4)', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link to="/student-clubs" className="btn btn-accent">Student Clubs</Link>
              <Link to="/campus-magazines" className="btn btn-secondary">Campus Magazines</Link>
              <Link to="/sports-games" className="btn btn-secondary">Sports & Games</Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
