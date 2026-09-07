import { Target } from 'lucide-react';
import { useContentBlocks } from '../../hooks/useContentBlocks';
import { resolveContentIcon } from '../../lib/contentIcons';
import '../../pages/StudentLife/StudentLife.css';

/**
 * "Sports & Games at VWU" — the athletics cards (Content Blocks:
 * student-life/athletics). Shown on the /sports-games activity page.
 * Renders nothing until an admin adds athletics content blocks.
 * No `.reveal` class here — the /sports-games page has no scroll-reveal
 * observer, and gating it on Firestore data is discouraged anyway.
 */
export default function VwuSportsSection() {
  const athletics = useContentBlocks('student-life', 'athletics');

  if (athletics.length === 0) return null;

  return (
    <section className="section bg-off-white">
      <div className="container">
        <div className="sl-sports-grid">
          {athletics.map((s) => {
            const Icon = resolveContentIcon(s.icon) || Target;
            return (
              <div key={s.id} className="sl-sport-card">
                <span className="sl-sport-icon"><Icon size={32} strokeWidth={1.75} /></span>
                <div className="sl-sport-name">{s.title}</div>
                <span className="sl-sport-season">{s.value}</span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
