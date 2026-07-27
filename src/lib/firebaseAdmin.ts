import type { Auth } from 'firebase/auth';
import type { FirebaseStorage } from 'firebase/storage';
import { app } from './firebase';

// firebase/auth and firebase/storage are only needed by /admin (login gate +
// image/PDF uploads), never by the public site. Loading them via a genuine
// dynamic import() — rather than a static top-level import — is what
// actually keeps them out of the public bundle: a static import gets pulled
// into whatever manualChunks bucket Rollup assigns it to, and that bucket
// then gets statically referenced from every page chunk that shares any
// build-time link to it. A dynamic import() always creates its own
// load-on-demand chunk regardless of manualChunks config, so these only ever
// download once something under /admin actually calls one of these getters.
let authPromise: Promise<Auth> | null = null;
export function getFirebaseAuth(): Promise<Auth> {
  if (!authPromise) {
    authPromise = import('firebase/auth').then(({ getAuth }) => getAuth(app));
  }
  return authPromise;
}

let storagePromise: Promise<FirebaseStorage> | null = null;
export function getFirebaseStorage(): Promise<FirebaseStorage> {
  if (!storagePromise) {
    storagePromise = import('firebase/storage').then(({ getStorage }) => getStorage(app));
  }
  return storagePromise;
}
