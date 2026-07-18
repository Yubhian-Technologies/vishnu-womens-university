import { initializeApp, type FirebaseOptions } from 'firebase/app';
import { initializeFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';

const firebaseConfig: FirebaseOptions = {
  apiKey: (import.meta.env.VITE_FIREBASE_API_KEY || 'AIzaSyBx7QuCoFweGI5BCbSRL2hu6yX97CFAXxs').trim() || '',
  authDomain: (import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'vishnu-womens-university.firebaseapp.com').trim() || '',
  projectId: (import.meta.env.VITE_FIREBASE_PROJECT_ID || 'vishnu-womens-university').trim() || '',
  storageBucket: (import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || 'vishnu-womens-university.firebasestorage.app').trim() || '',
  messagingSenderId: (import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '1098841377665').trim() || '',
  appId: (import.meta.env.VITE_FIREBASE_APP_ID || '1:1098841377665:web:1c8b1802d0cfcac619f680').trim() || '',
};

// Typed `any` deliberately: every call site across ~50 files (hooks, admin
// sections) treats db/auth/storage as always-initialized, matching how this
// app actually runs — the try/catch below is a defensive fallback for a
// misconfigured local .env, not an expected production state. Typing these
// as `Firestore | undefined` etc. would force null-checks into every one of
// those call sites for a case that in practice doesn't happen; not worth
// that blast radius for what's a real but low-severity gap.
/* eslint-disable @typescript-eslint/no-explicit-any */
let app: any;
let db: any;
let auth: any;
let storage: any;
/* eslint-enable @typescript-eslint/no-explicit-any */

try {
  app = initializeApp(firebaseConfig);
  // Some networks/antivirus/proxies reset Firestore's default WebChannel transport
  // (visible as net::ERR_CONNECTION_RESET); auto-detect falls back to long-polling.
  db = initializeFirestore(app, { experimentalAutoDetectLongPolling: true });
  auth = getAuth(app);
  storage = getStorage(app);
} catch (error) {
  console.warn('Firebase initialization failed:', error);
}

export { db, auth, storage };
