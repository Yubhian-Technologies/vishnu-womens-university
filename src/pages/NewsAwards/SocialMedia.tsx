import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import PageHero from '../../components/PageHero/PageHero';
import { InstagramIcon, FacebookIcon, TwitterIcon, LinkedInIcon, YouTubeIcon } from '../../components/Footer/SocialIcons';
import { useDocument } from '../../hooks/useDocument';
import { DEFAULT_SOCIAL_HANDLES, SOCIAL_HANDLES_COLLECTION, SOCIAL_HANDLES_DOC_ID, type SocialHandlesDoc } from '../Admin/sections/SocialHandlesAdmin';

// Icon per slot is structural/position-matched -- shared with Footer.tsx's
// social strip via the same settings/socialHandles doc, so the two can't
// drift out of sync.
const SOCIAL_ICONS = [InstagramIcon, FacebookIcon, TwitterIcon, LinkedInIcon, YouTubeIcon];

export default function SocialMedia() {
  const { data: remoteSocialHandles } = useDocument<SocialHandlesDoc>(SOCIAL_HANDLES_COLLECTION, SOCIAL_HANDLES_DOC_ID);
  const socialHandles = (remoteSocialHandles?.platforms?.length === DEFAULT_SOCIAL_HANDLES.platforms.length ? remoteSocialHandles.platforms : DEFAULT_SOCIAL_HANDLES.platforms)
    .map((p, idx) => ({ ...p, Icon: SOCIAL_ICONS[idx % SOCIAL_ICONS.length] }));

  useEffect(() => {
    document.title = "Social Media Handles | Vishnu Women's University";
  }, []);

  return (
    <main className="page-wrapper">
      {/* Hero */}
      <PageHero
        page="news-awards-social-media"
        defaultTitle="Social Media Handles"
        defaultSubtitle="Follow VWU across our official channels for the latest news, events, and campus life."
        breadcrumb={[{ label: 'Home', to: '/' }, { label: 'News & Awards', to: '/news-awards' }, { label: 'Social Media Handles' }]}
      />

      {/* Handles grid */}
      <section className="section bg-white">
        <div className="container">
          <div className="card-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(260px, 100%), 1fr))', gap: 'var(--space-5)' }}>
            {socialHandles.map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'var(--space-4)',
                  background: 'var(--color-off-white)',
                  border: '1.5px solid var(--color-light-gray)',
                  borderRadius: 'var(--radius-md)',
                  padding: 'var(--space-5)',
                  textDecoration: 'none',
                  transition: 'all var(--transition-base)',
                }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--color-accent)'; (e.currentTarget as HTMLElement).style.boxShadow = 'var(--shadow-md)'; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--color-light-gray)'; (e.currentTarget as HTMLElement).style.boxShadow = 'none'; }}
              >
                <span style={{ flexShrink: 0, width: 48, height: 48, borderRadius: '50%', background: 'var(--color-primary)', color: 'var(--color-white)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <s.Icon size={22} />
                </span>
                <span>
                  <span style={{ display: 'block', fontFamily: 'var(--font-sans)', fontSize: 'var(--text-base)', fontWeight: 700, color: 'var(--color-primary)' }}>
                    {s.label}
                  </span>
                  <span style={{ display: 'block', fontSize: 'var(--text-sm)', color: 'var(--color-text-light)' }}>
                    {s.handle}
                  </span>
                </span>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ background: 'var(--color-primary)', padding: 'var(--space-14) 0' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <h2 style={{ color: 'var(--color-white)', marginBottom: 'var(--space-4)' }}>Explore More at VWU</h2>
          <div style={{ display: 'flex', gap: 'var(--space-4)', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/news-awards/happenings" className="btn btn-accent">Happenings at VWU</Link>
            <Link to="/news-awards/gallery" className="btn btn-secondary">Gallery</Link>
            <Link to="/news-awards" className="btn btn-secondary">Back to News & Awards</Link>
          </div>
        </div>
      </section>
    </main>
  );
}
