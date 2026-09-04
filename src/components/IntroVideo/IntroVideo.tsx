import { useCallback, useEffect, useRef, useState } from 'react';
import './IntroVideo.css';

// Full-screen intro video shown once per browser session when the site first
// opens (see the "Loading — Intro video" request). The overlay renders on top
// of the PublicApp while everything else — code-split JS chunks, images,
// Firestore reads, fonts — loads and hydrates in parallel beneath it, so by
// the time the video finishes the page is already rendered and there is no
// visible lag or second loading screen.
//
// Behaviors:
//   - Plays `/loading-videos/0903.mp4` full-screen (object-fit: cover).
//   - Only shows once per session — `sessionStorage` keeps it from replaying
//     on subsequent client-side navigations, but it will return on the next
//     fresh browser session, which is what "when the user opens the website"
//     means here.
//   - Runs to completion, then fades out and unmounts.
//   - Tapping / clicking anywhere (or the visible "Skip" hint) reveals the
//     page immediately.
//   - Respects `prefers-reduced-motion` by skipping straight past the video.
const INTRO_VIDEO_KEY = 'vwu:intro-video-seen';
const INTRO_VIDEO_SRC = '/loading-videos/0903.mp4';

function hasSeenIntro() {
  try {
    return sessionStorage.getItem(INTRO_VIDEO_KEY) === '1';
  } catch {
    return false;
  }
}

export default function IntroVideo() {
  const [show, setShow] = useState(() => !hasSeenIntro());
  const [fading, setFading] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const dismiss = useCallback(() => {
    if (fading) return;
    setFading(true);
    // Keep the flag write out of the branch below so a session still
    // only ever stamps it once.
    try {
      sessionStorage.setItem(INTRO_VIDEO_KEY, '1');
    } catch {
      /* ignore quota/private-mode errors */
    }
    // Match the --transition-smooth fade defined in IntroVideo.css.
    window.setTimeout(() => setShow(false), 600);
  }, [fading]);

  // Respect users who prefer reduced motion — skip the intro outright.
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      dismiss();
    }
  }, [dismiss]);

  const onEnded = useCallback(() => dismiss(), [dismiss]);

  if (!show) return null;

  return (
    <div
      className={`intro-video${fading ? ' intro-video--fading' : ''}`}
      role="dialog"
      aria-modal="true"
      aria-label="Welcome to Vishnu Women's University"
    >
      <video
        ref={videoRef}
        className="intro-video__media"
        src={INTRO_VIDEO_SRC}
        autoPlay
        muted
        playsInline
        preload="auto"
        onEnded={onEnded}
      />
    </div>
  );
}
