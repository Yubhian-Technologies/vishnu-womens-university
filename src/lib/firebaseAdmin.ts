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

// A second, independently-named Firebase App (same project config, via
// `app.options`) purely so Users & Roles can create a new sign-in for
// someone else (Placements, R&D, a department admin, …) without disturbing
// the signed-in Super Admin's own session — `createUserWithEmailAndPassword`
// on the client SDK signs in AS the account it just created, which on the
// primary `auth` instance would immediately log the admin out of their own
// session. Running it against this separate instance instead means that
// side effect lands over here, not on the admin's real session, and it's
// signed out again right after — see createAdminLogin in lib/rbac.ts.
let secondaryAuthPromise: Promise<Auth> | null = null;
function getSecondaryAuth(): Promise<Auth> {
  if (!secondaryAuthPromise) {
    secondaryAuthPromise = Promise.all([import('firebase/app'), import('firebase/auth')]).then(
      ([{ initializeApp, getApps }, { getAuth }]) => {
        const name = 'AdminUserCreation';
        const secondaryApp = getApps().find((a) => a.name === name) ?? initializeApp(app.options, name);
        return getAuth(secondaryApp);
      }
    );
  }
  return secondaryAuthPromise;
}

/** Creates a new Firebase Auth sign-in (email + password) via the secondary app instance above, then immediately signs that instance back out. Throws if the email is already registered (caller should treat that as non-fatal — see createAdminLogin). */
export async function createFirebaseAuthAccount(email: string, password: string): Promise<void> {
  const [{ createUserWithEmailAndPassword, signOut }, secondaryAuth] = await Promise.all([
    import('firebase/auth'),
    getSecondaryAuth(),
  ]);
  try {
    await createUserWithEmailAndPassword(secondaryAuth, email, password);
  } finally {
    await signOut(secondaryAuth);
  }
}
