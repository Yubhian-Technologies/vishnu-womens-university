// Recruiter logos: Firebase Storage -> WebP -> Cloudinary -> Firestore.
// Reads `recruiterLogos` (the collection RecruitersSection.tsx reads `imageUrl` from),
// converts each logo to WebP, uploads to Cloudinary in batches, verifies the new URL
// serves an image, then rewrites `imageUrl` (old value kept in `originalImageUrl`
// so it can be rolled back). Idempotent: docs already on Cloudinary are skipped.
//
// Usage:
//   node scripts/recruiter-logos-to-webp-cloudinary.mjs \
//     --service-account scripts/<key>.service-account.json \
//     --cloudinary-url "cloudinary://<key>:<secret>@<cloud>" \
//     [--dry-run] [--limit 3] [--batch 5] [--rollback]
//   (--cloudinary-url can be replaced by the CLOUDINARY_URL env var)
//
// Recommended: --dry-run --limit 3, then --limit 3, then the full run.

import { readFileSync, writeFileSync, appendFileSync, mkdirSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore, FieldValue } from 'firebase-admin/firestore';
import { v2 as cloudinary } from 'cloudinary';
import sharp from 'sharp';

const __dirname = dirname(fileURLToPath(import.meta.url));
const COLLECTION = 'recruiterLogos';
const FOLDER = 'vwu/recruiter-logos';

const args = {};
const argv = process.argv.slice(2);
for (let i = 0; i < argv.length; i++) {
  if (!argv[i].startsWith('--')) continue;
  const next = argv[i + 1];
  args[argv[i].slice(2)] = next && !next.startsWith('--') ? argv[++i] : 'true';
}
const dryRun = args['dry-run'] === 'true';
const limit = args.limit ? Number(args.limit) : Infinity;
const batchSize = Number(args.batch || 5);
const cloudinaryUrl = args['cloudinary-url'] || process.env.CLOUDINARY_URL;

if (!args['service-account'] || !existsSync(args['service-account'])) {
  console.error('Missing/invalid --service-account <path to key json>');
  process.exit(1);
}
initializeApp({ credential: cert(JSON.parse(readFileSync(args['service-account'], 'utf8'))) });
const db = getFirestore();

const isCloudinary = (u) => typeof u === 'string' && u.includes('res.cloudinary.com');

async function retry(fn, tries = 3) {
  for (let i = 1; ; i++) {
    try { return await fn(); }
    catch (e) { if (i >= tries) throw e; await new Promise((r) => setTimeout(r, 1000 * i)); }
  }
}

async function rollback() {
  const snap = await db.collection(COLLECTION).get();
  let n = 0;
  for (const d of snap.docs) {
    const { originalImageUrl } = d.data();
    if (!originalImageUrl) continue;
    if (!dryRun) await d.ref.update({ imageUrl: originalImageUrl, originalImageUrl: FieldValue.delete() });
    n++;
  }
  console.log(`${dryRun ? 'Would roll back' : 'Rolled back'} ${n} doc(s).`);
}

async function migrateOne(doc) {
  const { imageUrl } = doc.data();
  // 1. download
  const res = await retry(async () => {
    const r = await fetch(imageUrl);
    if (!r.ok) throw new Error(`download HTTP ${r.status}`);
    return r;
  });
  const input = Buffer.from(await res.arrayBuffer());
  if (!input.length) throw new Error('downloaded 0 bytes');

  // 2. convert (density 300 rasterizes SVG logos crisply; animated keeps GIF frames)
  const webp = await sharp(input, { animated: true, density: 300 })
    .webp({ quality: 90, alphaQuality: 100 })
    .toBuffer();
  const meta = await sharp(webp).metadata();
  if (meta.format !== 'webp' || !meta.width) throw new Error('conversion produced invalid webp');

  if (dryRun) return { newUrl: '(dry-run)', from: input.length, to: webp.length };

  // 3. upload (deterministic public_id = doc id -> reruns overwrite, never duplicate)
  const up = await retry(() =>
    cloudinary.uploader.upload(`data:image/webp;base64,${webp.toString('base64')}`, {
      folder: FOLDER,
      public_id: doc.id,
      overwrite: true,
      invalidate: true,
      resource_type: 'image',
    })
  );

  // 4. verify the URL serves before touching Firestore
  const check = await retry(async () => {
    const r = await fetch(up.secure_url);
    if (!r.ok) throw new Error(`verify HTTP ${r.status}`);
    return r;
  });
  const ct = check.headers.get('content-type') || '';
  if (!ct.startsWith('image/')) throw new Error(`verify bad content-type ${ct}`);

  // 5. write back
  await doc.ref.update({ imageUrl: up.secure_url, originalImageUrl: imageUrl });
  return { newUrl: up.secure_url, from: input.length, to: webp.length };
}

async function main() {
  if (args.rollback === 'true') return rollback();
  if (!cloudinaryUrl) {
    console.error('Missing --cloudinary-url or CLOUDINARY_URL');
    process.exit(1);
  }
  process.env.CLOUDINARY_URL = cloudinaryUrl;
  cloudinary.config({ secure: true });

  const snap = await db.collection(COLLECTION).get();
  const skipped = [];
  const todo = [];
  for (const d of snap.docs) {
    const u = d.data().imageUrl;
    if (!u || typeof u !== 'string') skipped.push({ id: d.id, reason: 'no imageUrl' });
    else if (isCloudinary(u)) skipped.push({ id: d.id, reason: 'already cloudinary' });
    else todo.push(d);
  }
  const work = todo.slice(0, limit);
  console.log(`${snap.size} docs: ${work.length} to migrate, ${skipped.length} skipped${dryRun ? ' [DRY RUN]' : ''}`);

  // backup originals before any write
  mkdirSync(join(__dirname, 'backups'), { recursive: true });
  const stamp = Date.now();
  const backup = join(__dirname, 'backups', `recruiterLogos-${stamp}.json`);
  writeFileSync(backup, JSON.stringify(snap.docs.map((d) => ({ id: d.id, ...d.data() })), null, 2));
  console.log(`Backup: ${backup}`);

  // per-logo log: one JSON line per logo, appended as soon as it finishes
  // (survives a crash mid-run). Fields: time, id, status, oldUrl, newUrl, bytes, error.
  const logPath = join(__dirname, 'backups', `recruiterLogos-${stamp}.log`);
  // every logged entry is also echoed to the console, with a running counter
  let n = 0;
  const total = skipped.length + work.length;
  const log = (entry) => {
    appendFileSync(logPath, JSON.stringify({ time: new Date().toISOString(), dryRun, ...entry }) + '\n');
    const tag = `[${++n}/${total}] ${entry.status.toUpperCase().padEnd(7)} ${entry.id}`;
    if (entry.status === 'ok') console.log(`${tag}  ${entry.bytesBefore}B -> ${entry.bytesAfter}B  ${entry.newUrl}`);
    else if (entry.status === 'failed') console.warn(`${tag}  ${entry.error}`);
    else console.log(`${tag}  (${entry.reason})`);
  };
  console.log(`Log: ${logPath}`);
  skipped.forEach((s) => log({ id: s.id, status: 'skipped', reason: s.reason }));

  const ok = [];
  const failed = [];
  for (let i = 0; i < work.length; i += batchSize) {
    const batch = work.slice(i, i + batchSize);
    const results = await Promise.allSettled(batch.map(migrateOne));
    results.forEach((r, j) => {
      const id = batch[j].id;
      const oldUrl = batch[j].data().imageUrl;
      if (r.status === 'fulfilled') {
        ok.push({ id, ...r.value });
        log({ id, status: 'ok', oldUrl, newUrl: r.value.newUrl, bytesBefore: r.value.from, bytesAfter: r.value.to });
      } else {
        const error = String(r.reason?.message ?? r.reason);
        failed.push({ id, error });
        log({ id, status: 'failed', oldUrl, error });
      }
    });
  }

  const report = join(__dirname, 'backups', `recruiterLogos-report-${Date.now()}.json`);
  writeFileSync(report, JSON.stringify({ ok, failed, skipped }, null, 2));
  console.log(`\nDone: ${ok.length} ok, ${failed.length} failed, ${skipped.length} skipped. Report: ${report}`);
  if (failed.length) console.log('Re-run the same command to retry only the failed ones.');
}

main().catch((e) => { console.error(e); process.exit(1); });
