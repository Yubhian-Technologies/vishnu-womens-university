import { useEffect, useState } from 'react';
import { doc, onSnapshot, type DocumentData } from 'firebase/firestore';
import { db } from '../lib/firebase';

/** Real-time listener for a single Firestore document */
export function useDocument<T extends DocumentData>(
  collectionName: string,
  docId: string | undefined
) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!docId) {
      setLoading(false);
      return;
    }
    const unsub = onSnapshot(
      doc(db, collectionName, docId),
      (snap) => {
        setData(snap.exists() ? ({ id: snap.id, ...snap.data() } as unknown as T) : null);
        setLoading(false);
      },
      (err) => {
        setError(err.message);
        setLoading(false);
      }
    );
    return unsub;
  }, [collectionName, docId]);

  return { data, loading, error };
}
