import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import './AlumniGiving.css';
import PageHero from '../../components/PageHero/PageHero';

const givingImpact = [
  { icon: '🎓', stat: '13,100+', label: 'Engineers Graduated', desc: 'VWU alumni are making an impact across India and globally.' },
  { icon: '🏛️', stat: '1,400+', label: 'Annual Placements', desc: 'A strong placement record powered by alumni mentoring and recruiter networks.' },
  { icon: '🌍', stat: '50+', label: 'Companies Recruiting', desc: 'Top firms from Amazon to Infosys actively recruit VWU graduates every year.' },
  { icon: '📈', stat: '52 LPA', label: 'Highest Package', desc: 'Alumni-driven industry connect helps students land top-tier placements.' },
];

const givingLevels = [
  { level: "Vishnu Patron Circle", amount: '₹5,00,000+/year', perks: ['Named scholarship opportunity', 'Invitation to exclusive alumni events', 'Annual Principal\'s dinner', 'Recognition in Prathibha magazine'] },
  { level: 'Gold Alumni Society', amount: '₹1,00,000–₹4,99,999', perks: ['Named award opportunity', 'Priority access to alumni events', 'Quarterly campus newsletter', 'Recognition in annual report'] },
  { level: 'Silver Alumni Club', amount: '₹25,000–₹99,999', perks: ['Annual giving recognition', 'Invitation to Graduation Day', 'Prathibha Alumni magazine', 'Tax-exempt donation receipt'] },
  { level: 'Vishnu Alumni Fund', amount: 'Any amount', perks: ['Direct student scholarship impact', 'Acknowledgment of your gift', 'Annual impact report', 'VWU alumni community access'] },
];

const alumniEvents = [
  { title: 'Annual Alumni Meet', date: 'January 2027', desc: 'Our signature alumni reunion bringing graduates back to the VWU campus for networking, reunions, and celebrations.' },
  { title: 'Alumni Career Talk Series', date: 'Ongoing 2026', desc: 'Connect with current students and share your career journey. Inspire the next generation of VWU engineers.' },
  { title: 'Regional Alumni Meetups', date: 'Ongoing', desc: 'Join VWU alumni gatherings in cities across India — from Hyderabad to Bangalore to Chennai.' },
  { title: 'Graduation Day Felicitation', date: 'December 2026', desc: 'Celebrate and honour outstanding alumni achievements at the annual Graduation Day ceremony.' },
];

const alumniStories = [
  {
    name: 'Priya Reddy',
    year: "Class of '18",
    role: 'Senior Software Engineer, Amazon Web Services',
    quote: 'VWU gave me the technical depth and the confidence to crack a top-tier product company. I owe my career to the faculty and placement team here.',
    img: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&q=80',
  },
  {
    name: 'Sravani Devi',
    year: "Class of '20",
    role: 'VLSI Design Engineer, Intel Corporation',
    quote: 'The ECE labs and research mentoring at VWU prepared me for a global career. The Vishnu Japan Outreach Centre opened incredible international doors.',
    img: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&q=80',
  },
  {
    name: 'Lakshmi Prasanna',
    year: "Class of '22",
    role: 'Data Scientist, Microsoft India',
    quote: 'The AI & Data Science program at VWU is cutting-edge. The hands-on project exposure and industry connections made all the difference in my placement.',
    img: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&q=80',
  },
];

export default function AlumniGiving() {
  useEffect(() => {
    document.title = 'Alumni & Giving | Vishnu Womens University';
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
        page="alumni-giving"
        defaultImage="https://images.unsplash.com/photo-1523580494863-6f3031224c94?w=1920&q=80"
        defaultTitle="Always a Vishnu Engineer"
  defaultSubtitle="Your VWU journey doesn't end at graduation. Stay connected, give back, and help shape the next generation of women engineers."
        breadcrumb={[{ label: 'Home', to: '/' }, { label: 'Alumni & Giving' }]}
      />

      {/* Impact Stats */}
      <section style={{ background: 'var(--color-primary)', padding: 'var(--space-16) 0' }}>
        <div className="container">
          <div className="ag-impact-grid">
            {givingImpact.map((item, i) => (
              <div key={item.label} className="ag-impact-card reveal" data-delay={`${i * 100}`}>
                <div className="ag-impact-icon">{item.icon}</div>
                <div className="ag-impact-stat">{item.stat}</div>
                <div className="ag-impact-label">{item.label}</div>
                <div className="ag-impact-desc">{item.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Giving Levels */}
      <section id="give" className="section bg-off-white">
        <div className="container">
          <div className="reveal" style={{ textAlign: 'center', maxWidth: 600, margin: '0 auto var(--space-12)' }}>
            <span className="section-label">Ways to Give</span>
            <h2 className="section-title">Your Gift Makes a Difference</h2>
            <p className="section-desc" style={{ margin: '0 auto' }}>
              Every contribution — no matter the size — directly supports VWU students. Choose the giving level that's right for you.
            </p>
          </div>
          <div className="ag-giving-grid">
            {givingLevels.map((level, i) => (
              <div key={level.level} className={`ag-giving-card reveal${i === 0 ? ' ag-giving-card--featured' : ''}`} data-delay={`${i * 80}`}>
                {i === 0 && <div className="ag-giving-badge">Most Prestigious</div>}
                <h3>{level.level}</h3>
                <div className="ag-giving-amount">{level.amount}</div>
                <ul className="ag-giving-perks">
                  {level.perks.map(perk => (
                    <li key={perk}>
                      <span className="ag-perk-check">✓</span>
                      {perk}
                    </li>
                  ))}
                </ul>
                <a href="#" className="btn btn-primary" style={{ marginTop: 'auto' }}>Give Now</a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Alumni Stories */}
      <section id="alumni" className="section bg-white">
        <div className="container">
          <div className="reveal" style={{ textAlign: 'center', marginBottom: 'var(--space-12)' }}>
            <span className="section-label">Alumni Success</span>
            <h2 className="section-title">Where VWU Engineers Go</h2>
          </div>
          <div className="ag-stories-grid">
            {alumniStories.map((story, i) => (
              <div key={story.name} className="ag-story-card reveal" data-delay={`${i * 100}`}>
                <img src={story.img} alt={story.name} className="ag-story-img" loading="lazy" />
                <div className="ag-story-body">
                  <blockquote className="ag-story-quote">"{story.quote}"</blockquote>
                  <div className="ag-story-author">
                    <strong>{story.name}</strong>
                    <span className="ag-story-year">{story.year}</span>
                    <span className="ag-story-role">{story.role}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Events */}
      <section className="section" style={{ background: 'var(--color-primary)' }}>
        <div className="container">
          <div className="reveal" style={{ marginBottom: 'var(--space-10)' }}>
            <span className="section-label" style={{ color: 'var(--color-accent)' }}>Events</span>
            <h2 className="section-title" style={{ color: 'var(--color-white)' }}>Stay Connected with VWU</h2>
          </div>
          <div className="ag-events-grid">
            {alumniEvents.map((event, i) => (
              <div key={event.title} className="ag-event-card reveal" data-delay={`${i * 80}`}>
                <div className="ag-event-date">{event.date}</div>
                <h3>{event.title}</h3>
                <p>{event.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Where Alumni Work */}
      <section className="section bg-off-white">
        <div className="container">
          <div className="reveal" style={{ textAlign: 'center', marginBottom: 'var(--space-10)' }}>
            <span className="section-label">Our Alumni Network</span>
            <h2 className="section-title">VWU Engineers Power the World's Best Companies</h2>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-4)', justifyContent: 'center', marginBottom: 'var(--space-10)' }}>
            {['Amazon', 'Microsoft', 'Google', 'Intel', 'TCS', 'Infosys', 'Wipro', 'Cognizant',
              'Accenture', 'IBM', 'Capgemini', 'HCL Technologies', 'Tech Mahindra', 'Samsung R&D', 'Qualcomm'].map((co, i) => (
              <span key={co} className="reveal" data-delay={`${i * 30}`} style={{ background: 'var(--color-white)', border: '1px solid var(--color-light-gray)', borderRadius: 'var(--radius-sm)', padding: '0.5rem 1.2rem', fontFamily: 'var(--font-sans)', fontWeight: 700, fontSize: 'var(--text-sm)', color: 'var(--color-primary)', boxShadow: 'var(--shadow-sm)' }}>
                {co}
              </span>
            ))}
          </div>
          <div style={{ textAlign: 'center' }}>
            <Link to="/academics" className="btn btn-primary">View Placement Details</Link>
          </div>
        </div>
      </section>

      {/* Alumni Magazine */}
      <section className="section bg-off-white">
        <div className="container">
          <div className="ag-magazine-block reveal">
            <div>
              <span className="section-label">Publications</span>
              <h2 className="section-title">Prathibha – The VWU Campus Magazine</h2>
              <p className="section-desc" style={{ marginBottom: 'var(--space-6)' }}>
                Stay connected to your alma mater with the latest issue of Prathibha — VWU's
                campus magazine featuring alumni profiles, research highlights, and campus news.
              </p>
              <div style={{ display: 'flex', gap: 'var(--space-4)', flexWrap: 'wrap' }}>
                <a href="#" className="btn btn-primary">Read Latest Issue</a>
                <a href="#" className="btn btn-outline">Update Your Info</a>
              </div>
            </div>
            <img
              src="https://images.unsplash.com/photo-1607237138185-eedd9c632b0b?w=800&q=80"
              alt="VWU campus aerial view"
              className="ag-magazine-img"
              loading="lazy"
            />
          </div>
        </div>
      </section>
    </main>
  );
}
