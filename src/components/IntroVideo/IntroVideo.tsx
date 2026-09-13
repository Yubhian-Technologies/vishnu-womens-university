import { useCallback, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import './IntroVideo.css';

const INTRO_VIDEO_KEY = 'vwu:intro-video-seen';

function hasSeenIntro() {
  try {
    return sessionStorage.getItem(INTRO_VIDEO_KEY) === '1';
  } catch {
    return false;
  }
}

export default function IntroVideo() {
  const [show, setShow] = useState(() => !hasSeenIntro());

  const dismiss = useCallback(() => {
    try {
      sessionStorage.setItem(INTRO_VIDEO_KEY, '1');
    } catch {
      /* ignore quota/private-mode errors */
    }
    setShow(false);
  }, []);

  // Respect users who prefer reduced motion — skip the intro outright.
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      dismiss();
    }
  }, [dismiss]);

  // Auto-dismiss the splash screen after the animation sequence finishes
  useEffect(() => {
    if (show) {
      const timer = setTimeout(() => {
        dismiss();
      }, 3700); // 3.7 seconds total duration
      return () => clearTimeout(timer);
    }
  }, [show, dismiss]);

  if (typeof document === 'undefined') return null;

  const host = document.getElementById('root') || document.body;

  return createPortal(
    <AnimatePresence>
      {show && (
        <motion.div
          className="intro-video"
          role="status"
          aria-label="Loading Vishnu Women's University"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
        >
          <motion.div
            layout
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 'clamp(1rem, 3vw, 2.5rem)',
              flexWrap: 'wrap', // allow wrapping on extremely small screens
              padding: '0 1rem',
            }}
          >
            <motion.img
              layout
              src="/images/logo.png"
              alt="Vishnu Women's University Logo"
              style={{ height: 'clamp(80px, 12vw, 157px)', width: 'auto' }}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
            />
            <motion.h1
              initial={{ opacity: 0, maxWidth: 0 }}
              animate={{ opacity: 1, maxWidth: '1200px' }}
              transition={{ delay: 1.2, duration: 2.2, ease: [0.16, 1, 0.3, 1] }}
              style={{
                color: '#ffffff',
                fontFamily: 'var(--font-serif)',
                fontSize: 'clamp(1.5rem, 5vw, 4.375rem)', // Scaled by ~1.75x
                fontWeight: 500,
                margin: 0,
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                letterSpacing: '-0.02em',
                textAlign: 'center',
              }}
            >
              Vishnu Women's University
            </motion.h1>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    host
  );
}
