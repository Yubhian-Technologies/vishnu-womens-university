// One-off migration script: uploads every PDF in public/downloads/ to Firebase
// Storage, then writes an old-path -> new-URL mapping to
// scripts/downloads-url-map.json for the follow-up code find/replace pass.
//
// Usage:
//   node scripts/migrate-downloads-to-storage.mjs --service-account "C:/path/to/serviceAccountKey.json"
//
// Requires a Firebase service-account key (Console -> Project Settings ->
// Service Accounts -> Generate new private key). Never commit that file —
// scripts/*serviceAccount*.json and scripts/*service-account*.json are gitignored.

import { readFileSync, readdirSync, writeFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join, extname } from 'node:path';
import { randomUUID } from 'node:crypto';
import { initializeApp, cert } from 'firebase-admin/app';
import { getStorage } from 'firebase-admin/storage';

const __dirname = dirname(fileURLToPath(import.meta.url));

// Same fallback project config as src/lib/firebase.ts, so this script works
// against the live project without needing a local .env.
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

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const keyPath = args['service-account'];
  const sourceDir = join(__dirname, '..', args.dir || 'public/downloads');
  const destPrefix = args.prefix || 'downloads';
  const bucketName = args.bucket || DEFAULT_STORAGE_BUCKET;

  if (!keyPath || !existsSync(keyPath)) {
    console.error('Usage: node scripts/migrate-downloads-to-storage.mjs --service-account "C:/path/to/serviceAccountKey.json" [--dir public/downloads] [--prefix downloads]');
    process.exit(1);
  }

  const serviceAccount = JSON.parse(readFileSync(keyPath, 'utf8'));
  initializeApp({ credential: cert(serviceAccount), storageBucket: bucketName });
  const bucket = getStorage().bucket();

  const files = readdirSync(sourceDir).filter((f) => extname(f).toLowerCase() === '.pdf');
  console.log(`Found ${files.length} PDFs in ${sourceDir}`);

  const mapping = {};
  let done = 0;
  for (const filename of files) {
    const localPath = join(sourceDir, filename);
    const destPath = `${destPrefix}/${filename}`;
    const token = randomUUID();
    await bucket.upload(localPath, {
      destination: destPath,
      metadata: {
        contentType: 'application/pdf',
        metadata: { firebaseStorageDownloadTokens: token },
      },
    });
    const url = `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${encodeURIComponent(destPath)}?alt=media&token=${token}`;
    mapping[`/downloads/${filename}`] = { url, storagePath: destPath };
    done++;
    console.log(`[${done}/${files.length}] ${filename}`);
  }

  const outPath = join(__dirname, 'downloads-url-map.json');
  writeFileSync(outPath, JSON.stringify(mapping, null, 2));
  console.log(`\nDone. Wrote ${done} entries to ${outPath}`);
}

main().catch((err) => {
  console.error('Migration failed:', err.message ?? err);
  process.exit(1);
});
