import { useEffect, useState } from 'react';

// Tiny module-level pub/sub so useCollection/useDocument can report a read
// failure once, and any number of UI components (just FirestoreErrorBanner,
// today) can surface it — without threading error state through every one
// of the ~50 pages that call those hooks. Keyed by a caller-supplied id
// (collection name, or "collection/docId") so one failing listener doesn't
// clobber another's message, and clears itself once that listener recovers
// or unmounts.
type Listener = () => void;

const errors = new Map<string, string>();
const listeners = new Set<Listener>();

function notify() {
  listeners.forEach((l) => l());
}

export function reportFirestoreError(id: string, message: string) {
  errors.set(id, message);
  notify();
}

export function clearFirestoreError(id: string) {
  if (errors.delete(id)) notify();
}

/** Clears all current Firestore error banner notices. */
export function clearAllFirestoreErrors() {
  if (errors.size === 0) return;
  errors.clear();
  notify();
}

export function useFirestoreErrors(): string[] {
  const [, setTick] = useState(0);
  useEffect(() => {
    const listener = () => setTick((t) => t + 1);
    listeners.add(listener);
    return () => { listeners.delete(listener); };
  }, []);
  return Array.from(new Set(errors.values()));
}
