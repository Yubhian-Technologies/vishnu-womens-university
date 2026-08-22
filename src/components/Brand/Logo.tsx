import type { CSSProperties } from 'react';
import './Logo.css';

interface LogoProps {
  /** Height of the crest mark, in px. Wordmark scales proportionally. */
  size?: number;
  /** 'full' = crest + wordmark block. 'mark' = crest only (favicons, compact nav, loading states). */
  variant?: 'full' | 'mark';
  /** 'light' = white wordmark for dark/maroon backgrounds. 'dark' = maroon wordmark for light backgrounds. */
  theme?: 'light' | 'dark';
  /** Override the subtitle line. Pass `false` to omit it entirely. */
  tagline?: string | false;
  /** Primary crest color (shield fill). */
  crestColor?: string;
  /** Secondary crest color (trim, emblem, rule lines). */
  goldColor?: string;
  className?: string;
}

const DEFAULT_TAGLINE = 'First Private State University for Women in the Telugu States';

export default function Logo({
  size = 52,
  variant = 'full',
  theme = 'dark',
  tagline = DEFAULT_TAGLINE,
  crestColor = '#58111a',
  goldColor = '#d4af37',
  className = '',
}: LogoProps) {
  return (
    <div
      className={`vwu-logo vwu-logo--${theme} ${className}`}
      style={{ '--vwu-logo-crest': crestColor, '--vwu-logo-gold': goldColor } as CSSProperties}
    >
      <svg
        className="vwu-logo__crest"
        style={{ height: size, width: size * (100 / 120) }}
        viewBox="0 0 100 120"
        role="img"
        aria-label="Vishnu Women's University crest"
      >
        {/* Shield body */}
        <path
          d="M14,10 H86 V58 C86,86 70,100 50,112 C30,100 14,86 14,58 Z"
          fill={crestColor}
          stroke={goldColor}
          strokeWidth="2.5"
        />
        {/* Inner trim line */}
        <path
          d="M20,16 H80 V56 C80,80 66,93 50,104 C34,93 20,80 20,56 Z"
          fill="none"
          stroke={goldColor}
          strokeWidth="1.25"
          opacity="0.9"
        />
        {/* Chief band */}
        <rect x="14" y="10" width="72" height="15" fill={goldColor} />
        <circle cx="32" cy="17.5" r="2.4" fill={crestColor} />
        <circle cx="50" cy="17.5" r="2.4" fill={crestColor} />
        <circle cx="68" cy="17.5" r="2.4" fill={crestColor} />

        {/* Laurel flourishes */}
        <path d="M22,90 Q13,79 17,63" fill="none" stroke={goldColor} strokeWidth="2" strokeLinecap="round" />
        <path d="M17,72 L11,70 M18,80 L12,79" stroke={goldColor} strokeWidth="1.5" strokeLinecap="round" />
        <path d="M78,90 Q87,79 83,63" fill="none" stroke={goldColor} strokeWidth="2" strokeLinecap="round" />
        <path d="M83,72 L89,70 M82,80 L88,79" stroke={goldColor} strokeWidth="1.5" strokeLinecap="round" />

        {/* Five-point star */}
        <path
          d="M50,35 L52.4,42.2 L60,42.2 L53.8,46.7 L56.1,54 L50,49.5 L43.9,54 L46.2,46.7 L40,42.2 L47.6,42.2 Z"
          fill={goldColor}
        />

        {/* Open book emblem */}
        <path
          d="M50,62 C39,57.5 27,59.5 20,65.5 L20,84 C27,79.5 39,77.5 50,82 Z"
          fill={goldColor}
        />
        <path
          d="M50,62 C61,57.5 73,59.5 80,65.5 L80,84 C73,79.5 61,77.5 50,82 Z"
          fill={goldColor}
        />
        <line x1="50" y1="60" x2="50" y2="83" stroke={crestColor} strokeWidth="1.5" />
      </svg>

      {variant === 'full' && (
        <div className="vwu-logo__wordmark">
          <span className="vwu-logo__title">Vishnu Women's University</span>
          {tagline !== false && <span className="vwu-logo__tagline">{tagline}</span>}
        </div>
      )}
    </div>
  );
}
