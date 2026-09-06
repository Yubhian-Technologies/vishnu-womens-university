import { useEffect } from 'react';
import { CheckCircle2, X, AlertCircle, Info } from 'lucide-react';
import './Toast.css';

export interface ToastProps {
  show: boolean;
  type?: 'success' | 'error' | 'info';
  title: string;
  message: string;
  onClose: () => void;
  duration?: number;
}

export default function Toast({
  show,
  type = 'success',
  title,
  message,
  onClose,
  duration = 6000,
}: ToastProps) {
  useEffect(() => {
    if (!show) return;
    const timer = setTimeout(() => {
      onClose();
    }, duration);
    return () => clearTimeout(timer);
  }, [show, duration, onClose]);

  if (!show) return null;

  return (
    <div className={`toast-container toast-${type}`} role="alert">
      <div className="toast-icon">
        {type === 'success' && <CheckCircle2 size={24} className="toast-icon-svg" />}
        {type === 'error' && <AlertCircle size={24} className="toast-icon-svg" />}
        {type === 'info' && <Info size={24} className="toast-icon-svg" />}
      </div>

      <div className="toast-content">
        <div className="toast-title">{title}</div>
        <div className="toast-message">{message}</div>
      </div>

      <button type="button" className="toast-close-btn" onClick={onClose} aria-label="Close notification">
        <X size={16} />
      </button>

      <div className="toast-progress-bar" style={{ animationDuration: `${duration}ms` }} />
    </div>
  );
}
