import { useEffect, useState } from 'react';
import { collection, limit, onSnapshot, query, where } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { reportFirestoreError, clearFirestoreError } from './firestoreErrorStore';

/**
 * Which landing page (by its `landingPages/{id}` doc id) is currently live —
 * a single field equality query, no composite index needed. Used once, at
 * the public app's root, to decide which registered landing page component
 * to render. Falls back to `activeId: null` (caller decides the default)
 * while loading, on error, or if no landing page has been activated yet.
 */
export function useActiveLandingPage(): { activeId: string | null; loading: boolean } {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, 'landingPages'), where('active', '==', true), limit(1));
    const unsub = onSnapshot(
      q,
      (snap) => {
        setActiveId(snap.empty ? null : snap.docs[0].id);
        setLoading(false);
        clearFirestoreError('landingPages');
      },
      (err) => {
        setActiveId(null);
        setLoading(false);
        reportFirestoreError('landingPages', err.message);
      }
    );
    return () => {
      unsub();
      clearFirestoreError('landingPages');
    };
  }, []);

  return { activeId, loading };
}
