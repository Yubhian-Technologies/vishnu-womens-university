import { Link } from 'react-router-dom';
import { Target } from 'lucide-react';
import { useContentBlocks } from '../../hooks/useContentBlocks';
import { useSitePhotos } from '../../hooks/useSitePhotos';
import { resolveContentIcon } from '../../lib/contentIcons';
import '../../pages/StudentLife/StudentLife.css';

/**
 * "Sports & Games at VWU" — the athletics cards (Content Blocks:
 * student-life/athletics) plus a short intro and an optional image
 * (Site Photos: student-life/main, slot 6). Previously rendered inline on
 * /student-life; now shown on the /sports-games activity page instead.
 * Renders nothing until an admin adds athletics content blocks.
 * No `.reveal` class here — the /sports-games page has no scroll-reveal
 * observer, and gating it on Firestore data is discouraged anyway.
 */
export default function VwuSportsSection() {
  const athletics = useContentBlocks('student-life', 'athletics');
  const mainPhotos = useSitePhotos('student-life', 'main', []);
  const athleticsImg = mainPhotos[6];

  if (athletics.length === 0) return null;

  return (
    <section className="section bg-off-white">
      <div className="container">
        <div className="sl-athletics-header">
          <div>
            <span className="section-label">VWU Sports</span>
            <h2 className="section-title">Sports &amp; Games at VWU</h2>
            <p className="section-desc">
              VWU actively promotes physical development through diverse sports facilities,
              inter-college competitions, and participation in state-level tournaments.
            </p>
          </div>
          {athleticsImg && (
            <img
              src={athleticsImg.src}
              alt={athleticsImg.alt}
              className="sl-athletics-image"
            />
          )}
        </div>
        <div className="sl-sports-grid">
          {athletics.map((s) => {
            const Icon = resolveContentIcon(s.icon) || Target;
            return (
              <Link key={s.id} to="/news-awards/gallery#photo-gallery" className="sl-sport-card sl-sport-card--link">
                <span className="sl-sport-icon"><Icon size={32} strokeWidth={1.75} /></span>
                <div className="sl-sport-name">{s.title}</div>
                <span className="sl-sport-season">{s.value}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
