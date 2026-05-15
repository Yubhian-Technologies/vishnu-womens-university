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

export interface WithId extends DocumentData {
  id: string;
}

/** Real-time listener for a Firestore collection */
export function useCollection<T extends WithId>(
  collectionName: string,
  constraints: QueryConstraint[] = []
) {
  const [docs, setDocs] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const q = query(collection(db, collectionName), ...constraints);
    const unsub = onSnapshot(
      q,
      (snap) => {
        setDocs(snap.docs.map((d) => ({ id: d.id, ...d.data() } as T)));
        setLoading(false);
      },
      (err) => {
        setError(err.message);
        setLoading(false);
      }
    );
    return unsub;
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
