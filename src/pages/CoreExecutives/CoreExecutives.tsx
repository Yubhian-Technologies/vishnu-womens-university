import { useEffect, useMemo, useState } from 'react';
// Reuses the exec-card / exec-detail-banner styles the About page's Core
// Executive Body section already uses, so this page looks identical to it.
import '../About/About.css';
import SmoothImage from '../../components/SmoothImage/SmoothImage';
import { useOrderedCollection } from '../../hooks/useCollection';
import { renderBold } from '../../lib/boldText';
import { defaultExecutives, type CoreExecutiveMember } from '../About/About';
import { useDocument } from '../../hooks/useDocument';
import { DEFAULT_ABOUT_CONTENT, ABOUT_CONTENT_COLLECTION, ABOUT_CONTENT_DOC_ID, type AboutContentDoc } from '../Admin/sections/AboutContentAdmin';

// Admin-entered links may omit the scheme — see the same helper in About.tsx.
function toAbsoluteUrl(url: string) {
  return /^[a-z][a-z0-9+.-]*:/i.test(url) ? url : `//${url.replace(/^\/+/, '')}`;
}

function getInitials(name: string) {
  const cleaned = name.replace(/\b(Dr|Sri|Prof|Mr|Mrs|Ms)\.?\s*/gi, '');
  const parts = cleaned.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return '';
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

/** Standalone page showing only the Core Executive Body section of /about —
 *  same data (the admin-managed `coreExecutives` collection), same cards. */
export default function CoreExecutives() {
  const [activeExec, setActiveExec] = useState<CoreExecutiveMember | Omit<CoreExecutiveMember, 'id'> | null>(null);
  const [execBannerOpen, setExecBannerOpen] = useState(false);

  useEffect(() => {
    document.title = "Core Executive Body | Vishnu Women's University";
  }, []);

  // Detail banner stays open (hovering another card swaps its content) and is
  // dismissed only by Escape or a click outside any card / the banner.
  useEffect(() => {
    if (!execBannerOpen) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setExecBannerOpen(false); };
    const onDown = (e: MouseEvent) => {
      if (!(e.target as Element).closest('.exec-card, .exec-detail-banner')) setExecBannerOpen(false);
    };
    document.addEventListener('keydown', onKey);
    document.addEventListener('mousedown', onDown);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('mousedown', onDown);
    };
  }, [execBannerOpen]);

  const { data: remoteAboutContent } = useDocument<AboutContentDoc>(ABOUT_CONTENT_COLLECTION, ABOUT_CONTENT_DOC_ID);
  const content = { ...DEFAULT_ABOUT_CONTENT, ...remoteAboutContent };
  const { docs: execDocs, loading: execLoading } = useOrderedCollection<CoreExecutiveMember>('coreExecutives', 'order');
  const executives = !execLoading && execDocs.length > 0 ? execDocs : defaultExecutives;
  const executivesByLevel = useMemo(() => {
    const groups = new Map<number, typeof executives>();
    executives.forEach((exec) => {
      const level = exec.level || 1;
      if (!groups.has(level)) groups.set(level, []);
      groups.get(level)!.push(exec);
    });
    return [...groups.entries()].sort(([a], [b]) => a - b);
  }, [executives]);

  return (
    <main className="page-wrapper">
      <section id="core-executive" className="section bg-off-white" style={{ scrollMarginTop: 'calc(var(--topbar-height) + var(--header-height) + 1rem)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: 'var(--space-10)' }}>
            <h1 className="section-title">{content.execHeading}</h1>
            <p className="section-desc" style={{ margin: '0 auto' }}>
              {content.execSubtitle}
            </p>
          </div>
          {executivesByLevel.map(([level, members]) => (
            <div key={level} className="exec-level">
              <div className="exec-grid">
                {members.map((exec) => {
                  const hasDetails = !!(exec.qualification || exec.experience || exec.email || exec.bio || exec.description);
                  return (
                    <div
                      key={exec.name}
                      className={`exec-card${activeExec?.name === exec.name && execBannerOpen ? ' is-active' : ''}`}
                      onMouseEnter={() => { if (hasDetails) { setActiveExec(exec); setExecBannerOpen(true); } }}
                      onFocus={() => { if (hasDetails) { setActiveExec(exec); setExecBannerOpen(true); } }}
                      onClick={() => {
                        if (hasDetails) {
                          if (activeExec?.name === exec.name && execBannerOpen) {
                            setExecBannerOpen(false);
                          } else {
                            setActiveExec(exec);
                            setExecBannerOpen(true);
                          }
                        }
                      }}
                      tabIndex={hasDetails ? 0 : undefined}
                    >
                      <div className="exec-card__media">
                        {exec.photoUrl ? (
                          <SmoothImage src={exec.photoUrl} alt={exec.name} className="exec-card__photo" />
                        ) : (
                          <div className="exec-card__avatar">{getInitials(exec.name)}</div>
                        )}
                      </div>
                      <div className="exec-card__info">
                        <h3 className="exec-card__name">{exec.name}</h3>
                      </div>
                      <p className="exec-card__role">{exec.role}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
        <div className={`exec-detail-banner${execBannerOpen && activeExec ? ' is-open' : ''}`}>
          {activeExec && (
            <div className="container exec-detail-banner__inner">
              <div className="exec-detail-banner__body">
                <h3 className="exec-detail-banner__name">{activeExec.name}</h3>
                <p className="exec-detail-banner__role">{activeExec.role}</p>
                <div className="exec-detail-banner__facts">
                  {activeExec.qualification && (
                    <div className="exec-detail-banner__fact"><span>Qualification</span>{activeExec.qualification}</div>
                  )}
                  {activeExec.experience && (
                    <div className="exec-detail-banner__fact"><span>Experience</span>{activeExec.experience}</div>
                  )}
                  {activeExec.email && (
                    <div className="exec-detail-banner__fact"><span>Email</span><a href={`mailto:${activeExec.email}`}>{activeExec.email}</a></div>
                  )}
                </div>
                {activeExec.bio && <p className="exec-detail-banner__bio">{renderBold(activeExec.bio)}</p>}
                {(activeExec.description || activeExec.linkUrl) && (
                  <div className="exec-detail-banner__description">
                    {activeExec.linkUrl && (
                      <a
                        className="exec-detail-banner__link"
                        href={toAbsoluteUrl(activeExec.linkUrl)}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {activeExec.linkUrl}
                      </a>
                    )}
                    {activeExec.description && activeExec.description.split(/\n\s*\n/).map((para, i) => (
                      <p key={i}>{para.trim()}</p>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
