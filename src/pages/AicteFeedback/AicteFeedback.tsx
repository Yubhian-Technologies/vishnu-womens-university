import { useEffect } from 'react';
import { Megaphone, ExternalLink } from 'lucide-react';
import PageHero from '../../components/PageHero/PageHero';
import SEO from '../../components/SEO/SEO';
import { getBreadcrumbSchema } from '../../lib/seo/schemas';
import '../detail-layout.css';

const feedbackLinks = [
  { label: 'AICTE Feedback Portal', href: 'https://www.aicte-india.org/feedback/' },
  { label: 'For Students', href: 'https://www.aicte-india.org/feedback/students.php' },
  { label: 'For Staff', href: 'https://www.aicte-india.org/feedback/faculty.php' },
];

export default function AicteFeedback() {
  useEffect(() => {
    document.title = "AICTE Feedback Facility | Vishnu Women's University";
  }, []);

  return (
    <main className="page-wrapper">
      <SEO
        title="AICTE Feedback Facility | Vishnu Women's University"
        description="Notice and links for the AICTE Feedback Facility for students and faculty of Vishnu Women's University."
        canonicalPath="/aicte-feedback-facility"
        jsonLd={getBreadcrumbSchema([{ name: 'AICTE Feedback Facility', url: '/aicte-feedback-facility' }])}
      />
      <PageHero
        page="aicte-feedback-facility"
        defaultTitle="AICTE Feedback Facility"
        breadcrumb={[{ label: 'Home', to: '/' }, { label: 'Quick Links' }, { label: 'AICTE Feedback Facility' }]}
      />

      <section className="section bg-white">
        <div className="container">
          <div
            style={{
              maxWidth: 780,
              margin: '0 auto',
              background: 'var(--color-off-white)',
              border: '1.5px solid var(--color-light-gray)',
              borderLeft: '4px solid var(--color-accent)',
              borderRadius: 'var(--radius-md)',
              padding: 'var(--space-8)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', marginBottom: 'var(--space-4)' }}>
              <Megaphone size={24} strokeWidth={1.75} style={{ color: 'var(--color-primary)', flexShrink: 0 }} />
              <h2 style={{ margin: 0, fontSize: 'var(--text-xl)', color: 'var(--color-primary)' }}>Notice</h2>
            </div>

            <p style={{ color: 'var(--color-text)', lineHeight: 1.75, marginBottom: 'var(--space-6)' }}>
              This is to inform all the faculty, staff and students that the feedback facility of
              students and faculty is available in the AICTE Web-Portal. You may use the below
              links to use this facility.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
              {feedbackLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: 'var(--space-3)',
                    background: 'var(--color-white)',
                    border: '1.5px solid var(--color-light-gray)',
                    borderRadius: 'var(--radius-sm)',
                    padding: 'var(--space-4) var(--space-5)',
                    color: 'var(--color-primary)',
                    fontWeight: 700,
                    textDecoration: 'none',
                    transition: 'border-color var(--transition-base), box-shadow var(--transition-base)',
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--color-accent)'; e.currentTarget.style.boxShadow = 'var(--shadow-sm)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--color-light-gray)'; e.currentTarget.style.boxShadow = 'none'; }}
                >
                  <span>
                    {link.label}: <span style={{ fontWeight: 500, color: 'var(--color-text-light)' }}>{link.href}</span>
                  </span>
                  <ExternalLink size={16} strokeWidth={2} style={{ color: 'var(--color-accent)', flexShrink: 0 }} />
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
