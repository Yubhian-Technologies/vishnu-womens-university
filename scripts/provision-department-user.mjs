// One-off provisioning script for the RBAC "department account" system
// (see src/lib/rbac.ts). Run this once per new department — it's the entire
// "add a department" workflow: creates the Firebase Authentication user for
// that department's login, then writes its `department_users` Firestore
// document (metadata + granted resource keys only — no password is ever
// stored in Firestore, Firebase Auth is the sole credential store).
//
// No component code needs to change to add a future department this way;
// only the login dropdown (which reads `department_users` live) and
// whichever admin sections already understand that department's granted
// resource keys will reflect it.
//
// Usage:
//   node scripts/provision-department-user.mjs \
//     --department "Placements" \
//     --email "placements@vwu.edu.in" \
//     --password "placements@vwu" \
//     --resources "placements.heroBanners,placements.websitePhotos,placements.pageContent,placements.documents,placements.gallery,placements.blocks"
//
// Optional: --docId (defaults to the department name, lowercased/slugified)
//           --role (defaults to "department")

import { readFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { initializeApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { getFirestore, doc, setDoc, serverTimestamp } from 'firebase/firestore';

const __dirname = dirname(fileURLToPath(import.meta.url));

function loadEnv() {
  const envPath = join(__dirname, '..', '.env');
  const env = {};
  if (existsSync(envPath)) {
    for (const line of readFileSync(envPath, 'utf8').split('\n')) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) continue;
      const eq = trimmed.indexOf('=');
      if (eq === -1) continue;
      env[trimmed.slice(0, eq).trim()] = trimmed.slice(eq + 1).trim();
    }
  }
  return env;
}

function parseArgs(argv) {
  const args = {};
  for (let i = 0; i < argv.length; i++) {
    if (argv[i].startsWith('--')) {
      const key = argv[i].slice(2);
      const value = argv[i + 1] && !argv[i + 1].startsWith('--') ? argv[++i] : 'true';
      args[key] = value;
    }
  }
  return args;
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const { department, email, password, resources, role = 'department' } = args;
  const docId = args.docId || (department ?? '').toLowerCase().trim().replace(/\s+/g, '-');

  if (!department || !email || !password || !resources) {
    console.error('Usage: node scripts/provision-department-user.mjs --department "Placements" --email "placements@vwu.edu.in" --password "..." --resources "placements.heroBanners,placements.gallery"');
    process.exit(1);
  }

  const env = loadEnv();
  const firebaseConfig = {
    apiKey: env.VITE_FIREBASE_API_KEY,
    authDomain: env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: env.VITE_FIREBASE_APP_ID,
  };

  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);
  const db = getFirestore(app);

  console.log(`Creating Firebase Auth user for ${email}...`);
  const { user } = await createUserWithEmailAndPassword(auth, email, password);
  console.log(`Created auth user uid=${user.uid}`);

  const permissions = {};
  for (const key of resources.split(',').map((r) => r.trim()).filter(Boolean)) {
    // e.g. "placements.heroBanners" -> permissions.placements = true
    const [group] = key.split('.');
    if (group) permissions[group] = true;
  }

  console.log(`Writing department_users/${docId}...`);
  await setDoc(doc(db, 'department_users', docId), {
    department,
    role,
    email,
    active: true,
    permissions,
    resources: resources.split(',').map((r) => r.trim()).filter(Boolean),
    createdAt: serverTimestamp(),
  });

  console.log('Done.');
  process.exit(0);
}

main().catch((err) => {
  console.error('Provisioning failed:', err.message ?? err);
  process.exit(1);
});
