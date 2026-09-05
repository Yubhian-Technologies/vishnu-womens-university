import type { Auth, ConfirmationResult } from 'firebase/auth';
import type { FirebaseStorage } from 'firebase/storage';
import { app } from './firebase';

// firebase/auth and firebase/storage used to be needed only by /admin (login
// gate + image/PDF uploads); AdmissionApplyForm's mobile-OTP verification
// (the public "Curious to Know More?" form) now uses the auth half too.
// Loading it via a genuine dynamic import() — rather than a static top-level
// import — is what keeps it out of every OTHER public page's bundle: a
// static import gets pulled into whatever manualChunks bucket Rollup assigns
// it to, and that bucket then gets statically referenced from every page
// chunk that shares any build-time link to it. A dynamic import() always
// creates its own load-on-demand chunk regardless of manualChunks config, so
// this only ever downloads once something that actually needs auth (an
// /admin page, or the apply/admissions forms) calls one of these functions.
let authPromise: Promise<Auth> | null = null;
export function getFirebaseAuth(): Promise<Auth> {
  if (!authPromise) {
    authPromise = import('firebase/auth').then(({ getAuth }) => getAuth(app));
  }
  return authPromise;
}

/**
 * Sends a real SMS OTP to `phoneE164` (e.g. "+919876543210") via Firebase
 * Phone Auth, using an invisible reCAPTCHA bound to the element with id
 * `containerId`. Requires the "Phone" sign-in provider to be turned on in
 * the Firebase console (Authentication → Sign-in method) — until then this
 * rejects with `auth/operation-not-allowed`.
 */
export async function sendPhoneOtp(phoneE164: string, containerId: string): Promise<ConfirmationResult> {
  const [{ RecaptchaVerifier, signInWithPhoneNumber }, auth] = await Promise.all([
    import('firebase/auth'),
    getFirebaseAuth(),
  ]);
  const verifier = new RecaptchaVerifier(auth, containerId, { size: 'invisible' });
  try {
    return await signInWithPhoneNumber(auth, phoneE164, verifier);
  } finally {
    // The widget's job is done once signInWithPhoneNumber resolves/rejects —
    // confirming the code later needs only the ConfirmationResult, not the
    // verifier. Clearing it now (rather than leaving it mounted) avoids
    // "reCAPTCHA has already been rendered in this element" if the applicant
    // has to resend or retry with a different number.
    verifier.clear();
  }
}

/** Ends the phone-auth session Firebase creates once an OTP is confirmed —
 *  this form only ever needed that as a one-time ownership check, not a
 *  standing account, so nothing stays signed in after a submission. */
export async function logoutFirebaseAuth(): Promise<void> {
  const [{ signOut }, auth] = await Promise.all([import('firebase/auth'), getFirebaseAuth()]);
  return signOut(auth);
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
