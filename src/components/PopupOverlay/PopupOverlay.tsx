import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import './PopupOverlay.css';

const POPUP_SEEN_KEY = 'vwu:popup-seen';

export default function PopupOverlay() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    // Only show once per session
    const hasSeenPopup = sessionStorage.getItem(POPUP_SEEN_KEY);
    
    if (!hasSeenPopup) {
      // Wait for the intro video sequence to finish (approx 2.6s) before showing popup
      const timer = setTimeout(() => {
        setShow(true);
      }, 2800); 
      return () => clearTimeout(timer);
    }
  }, []);

  const dismiss = () => {
    sessionStorage.setItem(POPUP_SEEN_KEY, '1');
    setShow(false);
  };

  if (!show || typeof document === 'undefined') return null;

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
          src="/images/popup-image.jpeg" 
          alt="Announcement" 
          className="popup-image" 
        />
      </div>
    </div>,
    document.body
  );
}
