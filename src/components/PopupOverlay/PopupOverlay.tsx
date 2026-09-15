import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import { useDocument } from '../../hooks/useDocument';
import './PopupOverlay.css';

const POPUP_SEEN_KEY = 'vwu:popup-seen';

interface FeaturePopupDoc {
  isImage: boolean;
  imageUrl: string;
  storagePath: string;
}

export default function PopupOverlay() {
  const [show, setShow] = useState(false);
  const { data, loading } = useDocument<FeaturePopupDoc>('settings', 'featurePopup');

  useEffect(() => {
    if (loading) return;
    const docExists = !!data;
    const isEnabled = docExists ? !!data?.isImage && !!data?.imageUrl : true;
    if (!isEnabled) return;

    const hasSeenPopup = sessionStorage.getItem(POPUP_SEEN_KEY);
    if (hasSeenPopup) return;

    // Helper to show popup immediately (no extra delay)
    const showNow = () => {
      if (sessionStorage.getItem(POPUP_SEEN_KEY)) return;
      setShow(true);
    };

    // If intro already finished (seen flag set or reduced-motion skipped), show immediately
    try {
      const introSeen = sessionStorage.getItem('vwu:intro-video-seen') === '1';
      const prefersReduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
      if (introSeen || prefersReduced) {
        showNow();
        return;
      }
    } catch { /* ignore */ }

    // Otherwise wait for intro to finish — no extra delay after it
    const handler = () => showNow();
    window.addEventListener('vwu:intro-finished', handler as EventListener);
    return () => window.removeEventListener('vwu:intro-finished', handler as EventListener);
  }, [data, loading]);

  const dismiss = () => {
    sessionStorage.setItem(POPUP_SEEN_KEY, '1');
    setShow(false);
  };

  if (!show || typeof document === 'undefined') return null;

  const imageSrc = data?.imageUrl || '/images/popup-image.jpeg';
  // Safety: if doc exists and isImage is explicitly false, don't render
  if (data && !data.isImage) return null;
  // If doc says isImage true but no imageUrl, also don't render (admin hasn't uploaded yet)
  if (data && data.isImage && !data.imageUrl) return null;

  return createPortal(
    <div className="popup-overlay" onClick={dismiss}>
      <button
        className="popup-close-btn"
        onClick={dismiss}
        aria-label="Close popup"
      >
        <X size={24} />
      </button>
      <div className="popup-content" onClick={(e) => e.stopPropagation()}>
        <img
          src={imageSrc}
          alt="Announcement"
          className="popup-image"
        />
      </div>
    </div>,
    document.body
  );
}
