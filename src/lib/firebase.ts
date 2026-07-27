import { initializeApp, type FirebaseOptions } from 'firebase/app';
import { initializeFirestore } from 'firebase/firestore';

const firebaseConfig: FirebaseOptions = {
  apiKey: (import.meta.env.VITE_FIREBASE_API_KEY || 'AIzaSyBx7QuCoFweGI5BCbSRL2hu6yX97CFAXxs').trim() || '',
  authDomain: (import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'vishnu-womens-university.firebaseapp.com').trim() || '',
  projectId: (import.meta.env.VITE_FIREBASE_PROJECT_ID || 'vishnu-womens-university').trim() || '',
  storageBucket: (import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || 'vishnu-womens-university.firebasestorage.app').trim() || '',
  messagingSenderId: (import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '1098841377665').trim() || '',
  appId: (import.meta.env.VITE_FIREBASE_APP_ID || '1:1098841377665:web:1c8b1802d0cfcac619f680').trim() || '',
};

// Typed `any` deliberately: every call site across ~50 files (hooks, admin
// sections) treats db as always-initialized, matching how this app actually
// runs — the try/catch below is a defensive fallback for a misconfigured
// local .env, not an expected production state. Typing this as
// `Firestore | undefined` would force null-checks into every one of those
// call sites for a case that in practice doesn't happen; not worth that
// blast radius for what's a real but low-severity gap.
/* eslint-disable @typescript-eslint/no-explicit-any */
let app: any;
let db: any;
/* eslint-enable @typescript-eslint/no-explicit-any */

try {
  app = initializeApp(firebaseConfig);
  // Some networks/antivirus/proxies reset Firestore's default WebChannel transport
  // (visible as net::ERR_CONNECTION_RESET); auto-detect falls back to long-polling.
  db = initializeFirestore(app, { experimentalAutoDetectLongPolling: true });
} catch (error) {
  console.warn('Firebase initialization failed:', error);
}

// `auth`/`storage` deliberately live in a separate module (see firebaseAdmin.ts)
// rather than being initialized here — they're only used by /admin (login +
// image/PDF uploads), and every public page imports `db` from this file.
// Keeping firebase/auth and firebase/storage out of this module is what keeps
// them out of the public bundle too, since AdminLayout is the only thing that
// pulls in firebaseAdmin.ts and it's already lazy-loaded behind /admin.
export { app, db };
