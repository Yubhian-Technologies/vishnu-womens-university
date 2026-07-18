import { useState } from 'react';
import { AlertTriangle, X } from 'lucide-react';
import { useFirestoreErrors } from '../../hooks/firestoreErrorStore';
import './FirestoreErrorBanner.css';

// Surfaces a visible notice when any live Firestore listener on the page
// fails (blocked read, offline, misconfigured rule) — previously these
// failed silently and a broken section just looked like "no content yet."
// Dismissing hides the banner for the rest of the session; it reappears if
// a *new* error comes in afterwards.
export default function FirestoreErrorBanner() {
  const errors = useFirestoreErrors();
  const [dismissed, setDismissed] = useState<string[]>([]);

  const visible = errors.filter((e) => !dismissed.includes(e));
  if (visible.length === 0) return null;

  return (
    <div className="firestore-error-banner" role="alert">
      <AlertTriangle size={16} strokeWidth={2} />
      <span>Some content on this page couldn&apos;t be loaded. Please refresh, or try again shortly.</span>
      <button onClick={() => setDismissed((d) => [...d, ...visible])} aria-label="Dismiss">
        <X size={16} strokeWidth={2} />
      </button>
    </div>
  );
}
