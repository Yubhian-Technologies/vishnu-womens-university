import { useEffect } from 'react';
import { useContentBlocks } from '../../hooks/useContentBlocks';
import { useHashScroll } from '../../hooks/useHashScroll';
import './AlumniGiving.css';
import PageHero from '../../components/PageHero/PageHero';

// Mirrors Home.tsx's defaultTestimonials fallback so this page shows the same
// cards as the Home page carousel until an admin adds real entries to
// /admin → Page Content Blocks → "Home — Testimonials".
const defaultTestimonials = [
  { id: 'default-1', title: 'Lakshmi R., Class of 2024', value: 'Computer Science Engineering — Software Engineer at Google', desc: 'VWU faculty genuinely invest in each student — they know your name, your ambitions, and they hold you to a high standard. The skills and confidence I gained here led directly to my placement at Google.', slug: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=200&q=80' },
  { id: 'default-2', title: 'Anusha P., Class of 2022', value: 'M.Tech ECE — Research Scholar at IIT Hyderabad', desc: 'VWU is a true launchpad. The research infrastructure, the labs, and the guidance I received here built the academic foundation that made my Ph.D. at IIT Hyderabad possible.', slug: 'https://images.unsplash.com/photo-1607746882042-944635dfe10e?w=200&q=80' },
  { id: 'default-3', title: 'Divya K., Class of 2023', value: 'CSE — Co-founder at TechFemme Startup', desc: 'Studying in an all-women environment gave me real confidence in my abilities. I led several national-level projects at VWU — and that leadership mindset is what drives my startup today.', slug: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&q=80' },
];

export default function AlumniGiving() {
  const liveTestimonials = useContentBlocks('home', 'testimonials');
  const testimonials = liveTestimonials.length > 0 ? liveTestimonials : defaultTestimonials;

  useHashScroll();

  useEffect(() => {
    document.title = "Alumni & Giving | Vishnu Women's University";
  }, []);

  return (
    <main className="page-wrapper">
      {/* Hero */}
      <PageHero
        page="alumni-giving"
        defaultTitle="Always a Vishnu Engineer"
        defaultSubtitle="Graduation is not the end of your VWU story. Stay engaged, give back, and help shape the next generation of women engineers."
        breadcrumb={[{ label: 'Home', to: '/' }, { label: 'Alumni & Giving' }]}
      />

      {/* Alumni Voices */}
      <section id="network" className="section bg-off-white">
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: 'var(--space-10)' }}>
            <span className="section-label">Alumni Voices</span>
            <h2 className="section-title">What Our Graduates Say</h2>
          </div>
          <div className="ag-stories-grid">
            {testimonials.map((t) => (
              <div key={t.id} className="ag-story-card">
                {t.slug && <img src={t.slug} alt={t.title} className="ag-story-img" />}
                <div className="ag-story-body">
                  <blockquote className="ag-story-quote">"{t.desc}"</blockquote>
                  <div className="ag-story-author">
                    <strong>{t.title}</strong>
                    <span className="ag-story-role">{t.value}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
