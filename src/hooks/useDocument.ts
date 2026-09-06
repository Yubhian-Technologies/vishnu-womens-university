import { useEffect, useState } from 'react';
import { doc, onSnapshot, type DocumentData } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { reportFirestoreError, clearFirestoreError } from './firestoreErrorStore';

/** Real-time listener for a single Firestore document */
export function useDocument<T extends DocumentData>(
  collectionName: string,
  docId: string | undefined
) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!db) {
      setLoading(false);
      setError('Firestore is not configured.');
      return;
    }
    if (!docId) {
      setLoading(false);
      return;
    }
    const errorKey = `${collectionName}/${docId}`;
    const unsub = onSnapshot(
      doc(db, collectionName, docId),
      (snap) => {
        setData(snap.exists() ? ({ id: snap.id, ...snap.data() } as unknown as T) : null);
        setLoading(false);
        clearFirestoreError(errorKey);
      },
      (err) => {
        setError(err.message);
        setLoading(false);
        reportFirestoreError(errorKey, err.message);
      }
    );
    return () => {
      unsub();
      clearFirestoreError(errorKey);
    };
  }, [collectionName, docId]);

  return { data, loading, error };
}
