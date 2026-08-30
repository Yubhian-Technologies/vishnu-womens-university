import { useEffect, useState } from 'react';
import {
  collection,
  onSnapshot,
  query,
  orderBy,
  type QueryConstraint,
  type DocumentData,
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { reportFirestoreError, clearFirestoreError } from './firestoreErrorStore';

export interface WithId extends DocumentData {
  id: string;
}

/** Real-time listener for a Firestore collection */
export function useCollection<T extends WithId>(
  collectionName: string,
  constraints: QueryConstraint[] = [],
  options?: {
    /** Skip the site-wide "some content couldn't be loaded" banner for this
     *  listener's errors — for collections with their own graceful fallback
     *  (e.g. PlacementYearAccordion falling back to its built-in data), a
     *  blocked/failed read is already handled and isn't worth alarming a
     *  visitor about. */
    silent?: boolean;
  }
) {
  const [docs, setDocs] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!db) {
      setLoading(false);
      return;
    }
    const q = query(collection(db, collectionName), ...constraints);
    const unsub = onSnapshot(
      q,
      (snap) => {
        setDocs(snap.docs.map((d) => ({ id: d.id, ...d.data() } as T)));
        setLoading(false);
        clearFirestoreError(collectionName);
      },
      (err) => {
        setError(err.message);
        setLoading(false);
        if (!options?.silent) reportFirestoreError(collectionName, err.message);
      }
    );
    return () => {
      unsub();
      clearFirestoreError(collectionName);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [collectionName]);

  return { docs, loading, error };
}

/** Convenience: collection ordered by a field */
export function useOrderedCollection<T extends WithId>(
  collectionName: string,
  orderField: string,
  dir: 'asc' | 'desc' = 'asc'
) {
  return useCollection<T>(collectionName, [orderBy(orderField, dir)]);
}
