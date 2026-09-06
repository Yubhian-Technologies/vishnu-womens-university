import { AlertTriangle, X } from 'lucide-react';
import { clearAllFirestoreErrors, useFirestoreErrors } from '../../hooks/firestoreErrorStore';
import './FirestoreErrorBanner.css';

export default function FirestoreErrorBanner() {
  const errors = useFirestoreErrors();
  if (errors.length === 0) return null;

  return (
    <div className="firestore-error-banner" role="alert">
      <AlertTriangle size={16} className="firestore-error-banner__icon" aria-hidden="true" />
      <div className="firestore-error-banner__content">
        <strong>Some content couldn&apos;t load</strong>
        <span>We couldn&apos;t reach our servers for part of this page. Please check your connection and refresh shortly.</span>
      </div>
      <button
        type="button"
        className="firestore-error-banner__dismiss"
        onClick={() => clearAllFirestoreErrors()}
        aria-label="Dismiss error banner"
      >
        <X size={16} aria-hidden="true" />
      </button>
    </div>
  );
}