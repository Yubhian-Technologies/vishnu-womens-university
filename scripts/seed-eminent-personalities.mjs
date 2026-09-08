// One-off seed script: uploads every portrait in public/eminent-personalities/
// to Firebase Storage and upserts a matching doc into the `honouredGuests`
// Firestore collection — the data behind the Home page's scrolling
// "Eminent Personalities at VWU" section (see
// src/components/HonouredGuests/HonouredGuestsSection.tsx and
// src/pages/Admin/sections/HonouredGuestsAdmin.tsx).
//
// The "title metadata" for each person lives in the FILENAME, not EXIF:
//     "<order> <Name>, <Role>.<ext>"
//   e.g. "6 Sri N. Chandrababu Naidu, Chief Minister of Andhra Pradesh.jpg"
//        -> order 6, name "Sri N. Chandrababu Naidu",
//           role "Chief Minister of Andhra Pradesh"
// Files whose name doesn't start with "<digits> " are skipped.
//
// Upsert key is the name (case-insensitive): re-running updates role/order/
// image in place instead of creating duplicates, and won't touch entries an
// admin added by hand. Pass --purge to wipe the collection first.
//
// Usage:
//   node scripts/seed-eminent-personalities.mjs --service-account "C:/path/to/serviceAccountKey.json"
//   node scripts/seed-eminent-personalities.mjs --service-account "..." --dry-run
//   node scripts/seed-eminent-personalities.mjs --service-account "..." --purge
//
// Requires a Firebase service-account key (Console -> Project Settings ->
// Service Accounts -> Generate new private key). Never commit it —
// scripts/*serviceAccount*.json / *service-account*.json are gitignored.

import { readFileSync, readdirSync, existsSync, statSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join, parse as parsePath } from 'node:path';
import { randomUUID } from 'node:crypto';
import { initializeApp, cert } from 'firebase-admin/app';
import { getStorage } from 'firebase-admin/storage';
import { getFirestore, FieldValue } from 'firebase-admin/firestore';

const __dirname = dirname(fileURLToPath(import.meta.url));

// Same fallback project config as src/lib/firebase.ts.
const DEFAULT_STORAGE_BUCKET = 'vishnu-womens-university.firebasestorage.app';
const COLLECTION = 'honouredGuests';
const STORAGE_PREFIX = 'vwu/honoured-guests';
const IMAGE_EXT = new Set(['.jpg', '.jpeg', '.png', '.webp']);
const CONTENT_TYPE = {
  '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.png': 'image/png', '.webp': 'image/webp',
};
const BIG_FILE_BYTES = 1.5 * 1024 * 1024;

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

/** "<order> <Name>, <Role>" -> { order, name, role } | null */
function parseEntry(filename) {
  const base = parsePath(filename).name; // strips only the real extension
  const m = base.match(/^(\d+)\s+(.+)$/);
  if (!m) return null;
  const order = Number(m[1]);
  const rest = m[2].trim();
  const ci = rest.indexOf(',');
  const name = (ci === -1 ? rest : rest.slice(0, ci)).trim();
  const role = (ci === -1 ? '' : rest.slice(ci + 1)).trim();
  return { order, name, role };
}

function slug(s) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 60);
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const keyPath = args['service-account'];
  const sourceDir = join(__dirname, '..', args.dir || 'public/eminent-personalities');
  const bucketName = args.bucket || DEFAULT_STORAGE_BUCKET;
  const dryRun = args['dry-run'] === 'true';
  const purge = args.purge === 'true';

  if (!existsSync(sourceDir)) {
    console.error(`Source folder not found: ${sourceDir}`);
    process.exit(1);
  }

  // Build filename -> parsed entry, sorted by the leading order number.
  const files = readdirSync(sourceDir)
    .filter((f) => IMAGE_EXT.has(parsePath(f).ext.toLowerCase()))
    .map((f) => ({ file: f, entry: parseEntry(f) }))
    .sort((a, b) => (a.entry?.order ?? 1e9) - (b.entry?.order ?? 1e9));

  const skipped = files.filter((x) => !x.entry).map((x) => x.file);
  const valid = files.filter((x) => x.entry);

  console.log(`Folder: ${sourceDir}`);
  console.log(`Parsed ${valid.length} personalities; skipped ${skipped.length} non-matching file(s).`);
  if (skipped.length) console.log(`  skipped: ${skipped.join(', ')}`);

  const big = valid.filter((x) => statSync(join(sourceDir, x.file)).size > BIG_FILE_BYTES);
  if (big.length) {
    console.log(`\n!  ${big.length} image(s) are >1.5 MB and will be uploaded full-size (no resize here).`);
    console.log(`   They display in a ~230px card — re-crop later via /admin if the Home page feels heavy.`);
  }

  console.log('\nPreview:');
  for (const { entry } of valid) {
    console.log(`  ${String(entry.order).padStart(2)}  ${entry.name}${entry.role ? `  -  ${entry.role}` : '  (no role)'}`);
  }

  if (dryRun) {
    console.log('\n--dry-run: nothing written.');
    return;
  }

  if (!keyPath || !existsSync(keyPath)) {
    console.error('\nNeed a key to write. Usage: node scripts/seed-eminent-personalities.mjs --service-account "C:/path/to/serviceAccountKey.json" [--dry-run] [--purge]');
    process.exit(1);
  }
  const serviceAccount = JSON.parse(readFileSync(keyPath, 'utf8'));
  initializeApp({ credential: cert(serviceAccount), storageBucket: bucketName });
  const bucket = getStorage().bucket();
  const dbc = getFirestore();

  // Existing docs, keyed by lowercased name for idempotent upsert.
  const existingSnap = await dbc.collection(COLLECTION).get();
  if (purge) {
    console.log(`\n--purge: deleting ${existingSnap.size} existing ${COLLECTION} doc(s)...`);
    for (const d of existingSnap.docs) {
      const sp = d.get('storagePath');
      if (sp) await bucket.file(sp).delete().catch(() => {});
      await d.ref.delete();
    }
  }
  const byName = new Map();
  if (!purge) {
    for (const d of existingSnap.docs) {
      const n = (d.get('name') || '').trim().toLowerCase();
      if (n) byName.set(n, d);
    }
  }

  let added = 0;
  let updated = 0;
  for (const { file, entry } of valid) {
    const ext = parsePath(file).ext.toLowerCase();
    const destPath = `${STORAGE_PREFIX}/${entry.order}-${slug(entry.name)}${ext}`;
    const token = randomUUID();
    await bucket.upload(join(sourceDir, file), {
      destination: destPath,
      metadata: {
        contentType: CONTENT_TYPE[ext] || 'application/octet-stream',
        metadata: { firebaseStorageDownloadTokens: token },
      },
    });
    const imageUrl = `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${encodeURIComponent(destPath)}?alt=media&token=${token}`;

    const existing = byName.get(entry.name.toLowerCase());
    if (existing) {
      const oldPath = existing.get('storagePath');
      if (oldPath && oldPath !== destPath) await bucket.file(oldPath).delete().catch(() => {});
      await existing.ref.update({
        name: entry.name,
        role: entry.role,
        order: entry.order,
        imageUrl,
        storagePath: destPath,
      });
      updated++;
      console.log(`  ~ updated  ${entry.name}`);
    } else {
      await dbc.collection(COLLECTION).add({
        name: entry.name,
        role: entry.role,
        order: entry.order,
        imageUrl,
        storagePath: destPath,
        createdAt: FieldValue.serverTimestamp(),
      });
      added++;
      console.log(`  + added    ${entry.name}`);
    }
  }

  console.log(`\nDone. ${added} added, ${updated} updated. Collection "${COLLECTION}" now drives the Home page section live.`);
}

main().catch((err) => {
  console.error('Seed failed:', err.message ?? err);
  process.exit(1);
});
