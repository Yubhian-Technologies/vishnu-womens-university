// One-off migration: walks every Firestore collection, finds any field value
// that is a Firebase Storage download URL (string, or inside arrays/nested
// objects — schema-agnostic, so it doesn't need to know every admin
// section's field names), downloads it locally, uploads it to Cloudinary,
// and writes the new secure_url back onto the same field. Mirrors
// scripts/migrate-downloads-to-storage.mjs's service-account pattern.
//
// Usage:
//   node scripts/migrate-images-to-cloudinary.mjs \
//     --service-account "C:/path/to/serviceAccountKey.json" \
//     --cloudinary-url "cloudinary://<api_key>:<api_secret>@<cloud_name>" \
//     [--dir scripts/cloudinary-migration-downloads] \
//     [--collections news,gallery,faculty] \
//     [--dry-run] \
//     [--delete-source]
//
// --dry-run still downloads + uploads to Cloudinary (so you can inspect the
// mapping file / Cloudinary media library first) but skips the Firestore
// write. --delete-source removes the original Firebase Storage object once
// its Firestore doc has been updated — omit it on the first real run and
// verify the site before re-running with it.
//
// Requires a Firebase service-account key (Console -> Project Settings ->
// Service Accounts) and a Cloudinary account (Dashboard -> API Environment
// variable, the "cloudinary://..." string). Never commit either.

import { readFileSync, mkdirSync, writeFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join, basename, extname } from 'node:path';
import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { getStorage } from 'firebase-admin/storage';
import { v2 as cloudinary } from 'cloudinary';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DEFAULT_STORAGE_BUCKET = 'vishnu-womens-university.firebasestorage.app';

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

function isFirebaseStorageUrl(value) {
  if (typeof value !== 'string') return false;
  return value.includes('firebasestorage.googleapis.com') || value.includes('storage.googleapis.com');
}

function extractStoragePath(url) {
  try {
    const u = new URL(url);
    if (u.hostname === 'firebasestorage.googleapis.com') {
      const m = u.pathname.match(/\/o\/(.+)$/);
      if (m) return decodeURIComponent(m[1]);
    }
    if (u.hostname === 'storage.googleapis.com') {
      const parts = u.pathname.split('/').filter(Boolean);
      return parts.slice(1).join('/'); // drop leading bucket segment
    }
  } catch {
    // fall through
  }
  return null;
}

// ponytail: recursion has no depth guard — fine, Firestore docs here never
// nest more than a few levels (arrays of {url, caption} objects at most).
function isPlainObject(value) {
  return value !== null && typeof value === 'object' && Object.getPrototypeOf(value) === Object.prototype;
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const keyPath = args['service-account'];
  const cloudinaryUrl = args['cloudinary-url'] || process.env.CLOUDINARY_URL;
  const downloadDir = join(__dirname, '..', args.dir || 'scripts/cloudinary-migration-downloads');
  const collectionsFilter = args.collections ? args.collections.split(',').map((s) => s.trim()) : null;
  const dryRun = args['dry-run'] === 'true';
  const deleteSource = args['delete-source'] === 'true';

  if (!keyPath || !existsSync(keyPath)) {
    console.error('Missing --service-account "C:/path/to/serviceAccountKey.json"');
    process.exit(1);
  }
  if (!cloudinaryUrl) {
    console.error('Missing --cloudinary-url "cloudinary://<api_key>:<api_secret>@<cloud_name>" (or set CLOUDINARY_URL)');
    process.exit(1);
  }

  const serviceAccount = JSON.parse(readFileSync(keyPath, 'utf8'));
  initializeApp({ credential: cert(serviceAccount), storageBucket: args.bucket || DEFAULT_STORAGE_BUCKET });
  const db = getFirestore();
  getStorage().bucket(); // sanity-check bucket access before we start

  process.env.CLOUDINARY_URL = cloudinaryUrl;
  cloudinary.config({ secure: true });

  mkdirSync(downloadDir, { recursive: true });

  const urlCache = new Map(); // firebaseUrl -> Promise<newUrl-or-original-on-failure>
  const mappingLog = [];
  let migratedCount = 0;
  let failedCount = 0;

  async function doMigrate(url) {
    const storagePath = extractStoragePath(url);
    if (!storagePath) {
      console.warn(`  ! could not parse storage path, leaving as-is: ${url}`);
      failedCount++;
      return url;
    }
    try {
      const localPath = join(downloadDir, storagePath);
      mkdirSync(dirname(localPath), { recursive: true });

      const res = await fetch(url);
      if (!res.ok) throw new Error(`download failed: HTTP ${res.status}`);
      writeFileSync(localPath, Buffer.from(await res.arrayBuffer()));

      const publicId = basename(storagePath, extname(storagePath));
      const folder = `vwu-migrated/${dirname(storagePath)}`.replace(/\\/g, '/');
      const uploadRes = await cloudinary.uploader.upload(localPath, {
        folder,
        public_id: publicId,
        use_filename: true,
        unique_filename: false,
        overwrite: false,
        resource_type: 'auto',
      });

      migratedCount++;
      mappingLog.push({ firebaseUrl: url, storagePath, cloudinaryUrl: uploadRes.secure_url, publicId: uploadRes.public_id });
      console.log(`  [${migratedCount}] ${storagePath} -> ${uploadRes.secure_url}`);
      return uploadRes.secure_url;
    } catch (err) {
      console.warn(`  ! failed, leaving original URL: ${storagePath} (${err.message ?? err})`);
      failedCount++;
      return url;
    }
  }

  function migrateUrl(url, stats) {
    if (!urlCache.has(url)) urlCache.set(url, doMigrate(url));
    return urlCache.get(url).then((result) => {
      if (result !== url) stats.changed = true;
      return result;
    });
  }

  async function transformValue(value, stats) {
    if (isFirebaseStorageUrl(value)) return migrateUrl(value, stats);
    if (Array.isArray(value)) return Promise.all(value.map((v) => transformValue(v, stats)));
    if (isPlainObject(value)) {
      const entries = await Promise.all(
        Object.entries(value).map(async ([k, v]) => [k, await transformValue(v, stats)])
      );
      return Object.fromEntries(entries);
    }
    return value; // Timestamp, GeoPoint, DocumentReference, primitives, null
  }

  const collections = await db.listCollections();
  let docsChanged = 0;

  for (const collRef of collections) {
    if (collectionsFilter && !collectionsFilter.includes(collRef.id)) continue;
    const snap = await collRef.get();
    if (snap.empty) continue;
    console.log(`\n${collRef.id} (${snap.size} docs)`);

    for (const doc of snap.docs) {
      const stats = { changed: false };
      const newData = await transformValue(doc.data(), stats);
      if (!stats.changed) continue;
      docsChanged++;
      if (dryRun) {
        console.log(`  [dry-run] would update ${collRef.id}/${doc.id}`);
      } else {
        await doc.ref.set(newData);
        console.log(`  updated ${collRef.id}/${doc.id}`);
      }
    }
  }

  const mapPath = join(__dirname, 'cloudinary-migration-map.json');
  writeFileSync(mapPath, JSON.stringify(mappingLog, null, 2));

  console.log(`\nDone. ${migratedCount} image(s) migrated, ${failedCount} failed, ${docsChanged} doc(s) ${dryRun ? 'would be updated' : 'updated'}.`);
  console.log(`Mapping written to ${mapPath}`);

  if (deleteSource && !dryRun) {
    console.log('\nDeleting migrated originals from Firebase Storage...');
    const bucket = getStorage().bucket();
    for (const entry of mappingLog) {
      try {
        await bucket.file(entry.storagePath).delete();
        console.log(`  deleted ${entry.storagePath}`);
      } catch (err) {
        console.warn(`  ! could not delete ${entry.storagePath} (${err.message ?? err})`);
      }
    }
  } else if (deleteSource && dryRun) {
    console.log('\n--delete-source ignored during --dry-run.');
  }
}

main().catch((err) => {
  console.error('Migration failed:', err.message ?? err);
  process.exit(1);
});
