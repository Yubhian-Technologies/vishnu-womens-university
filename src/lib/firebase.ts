import { initializeApp, type FirebaseOptions } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig: FirebaseOptions = {
  apiKey: (import.meta.env.VITE_FIREBASE_API_KEY || 'AIzaSyBx7QuCoFweGI5BCbSRL2hu6yX97CFAXxs').trim(),
  authDomain: (import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'vishnu-womens-university.firebaseapp.com').trim(),
  projectId: (import.meta.env.VITE_FIREBASE_PROJECT_ID || 'vishnu-womens-university').trim(),
  storageBucket: (import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || 'vishnu-womens-university.firebasestorage.app').trim(),
  messagingSenderId: (import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '1098841377665').trim(),
  appId: (import.meta.env.VITE_FIREBASE_APP_ID || '1:1098841377665:web:1c8b1802d0cfcac619f680').trim(),
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);
