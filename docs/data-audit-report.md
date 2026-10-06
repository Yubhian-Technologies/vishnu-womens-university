# VWU Data Audit Report

**Scope**: Complete data-storage audit of the Vishnu Womens University (VWU) marketing/CMS site.
**Engine**: Firebase Firestore (NoSQL) + Firebase Auth + Cloudinary media. No SQL database, no ORM, no server/API layer, no Cloud Functions.
**Method**: Static analysis of the entire repo (all `src/`, `scripts/`, root config, `firestore.rules`). No live DB access (no credentials in-repo) — anything requiring console/DB introspection is marked **UNVERIFIED**. All file:line citations are from the current branch (`feature/eminent-personalities-speed`, fast-forwarded to `origin/main` `f0a5003`).
**Date**: 2026-09-25.

---

## 1. Executive Summary

The site is a **pure client-side SPA** talking directly to Firestore and Cloudinary (unsigned preset) from the browser. There is no back-end, so there is no place to run retention jobs, TTLs, deletes, or aggregation — everything that governs storage volume and cost lives in the client's collection queries and the `firestore.rules` file.

**Overall health: functional, but "write-everything-never-delete" is baked in, and two things can actually bite.**

### Top bloat risks (summary)
| # | Risk | Severity | One-line takeaway |
|---|------|----------|-------------------|
| 1 | **`deleteFile` is a no-op** → every replaced/removed media asset is orphaned in Cloudinary forever | **P0** | Deleting a photo removes the Firestore doc but *never* the Cloudinary file (`src/lib/storage.ts:35-42`). Orphaned original + every cropped variant accumulate. |
| 2 | **`firestore.rules` PII/anon-write gap** on `campusVisitRequests` + `careerGuidanceInterest` | **P0** | These two anonymous-visitor form collections are **not** in the private list → they are **publicly readable**, and anonymous `create` is **denied** → the forms 404-silently fail when rules deploy. |
| 3 | **Unlimited whole-collection `onSnapshot`** from 215 files / 148 hook call sites | P1 | Every public page pulls entire collections with no `limit()`. Two pre-existing shared-listener fixes (`useSitePhotos.ts`, `useContentBlocks.ts`) prove the pattern and point to the fix. |
| 4 | **Header opens 4 whole-collection listeners on every page** | P1 | `differentiatorItems`, `placementItems`, `campusLifeItems`, `campusLifeQuickLinks` fetched in full per page load (`Header.tsx:421-448`). |
| 5 | **Unbounded public-write collections with no retention/TTL/archival** | P1 | `admissionInquiries`, `contactSubmissions`, `careerApplications`, `campusVisitRequests`, `careerGuidanceInterest` grow forever; admin lists fetch them in full. |
| 6 | **Whole-collection fetch + client-side filter** in `DepartmentDetail.tsx` | P1 | Fetches all departments, all programs, all recruiter logos, all MoU logos, then filters in JS (`:417-439`). |

### Quick wins (low effort, ~all benefit)
- Remove or fix the `deleteFile` no-op with a Cloudinary signed-delete endpoint (or storage cleanup script).
- Add the two missing collections to `firestore.rules` private list **and** give them `allow create: if true` blocks.
- Batch the `gallery` upload loop (`GalleryAdmin.tsx:126-141`) with `writeBatch` (currently 1 `addDoc` round-trip per image).
- Archive/validate on write instead of letting `placementYears` grow into one wide doc per batch.

### What's healthy
- **No secrets committed** — service-account JSONs are git-ignored (verified via `git check-ignore`, exit 0). `.env` only carries public Cloudinary keys.
- Complicated composite-read queries are **rare** — most collection reads are single-field `orderBy`, so composite indexes are largely unnecessary.
- `formDiff` minimizes update payloads (`src/lib/formDiff.ts:4-39`) — good write hygiene already present.
- Shared reference-counted listeners already dedupe `sitePhotos` + `contentBlocks` downloads on busy pages → precedent to extend.

---

## 2. Database Inventory

| Item | Detail | Evidence |
|---|---|---|
| Database engine | **Firestore** (NoSQL, document) via `firebase ^12.16.0` | `package.json:23` |
| Project ID | `vishnu-womens-university` (env-overridable) | `.firebaserc:3`, `src/lib/firebase.ts:7` |
| Media store | **Cloudinary** (unsigned upload preset `vishnu-womens-university`), browser-direct | `.env:2`, `src/lib/storage.ts:6-30` |
| Auth | Firebase Auth email/password (admin-only, lazy-loaded) | `src/lib/firebaseAdmin.ts`, `AdminLayout.tsx` |
| Server/API layer | **None** — no Cloud Functions, no Express, no cron, no TTL triggers | full-repo grep |
| SQL/schema files | **None** — no `schema.sql`, no migrations; `firestore.indexes.json` **does not exist** in repo | glob `**/firestore*` → only `firestore.rules` |
| Legacy index files | `scripts/migrate-images-to-cloudinary.mjs` (walks every collection), `scripts/migrate-downloads-to-storage.mjs`, `scripts/seed-eminent-personalities.mjs` (bulk `honouredGuests` upserts), `scripts/generate-sitemap.mjs` | `scripts/` |
| Deployment | Vercel (static SPA); all paths rewritten to `/index.html` | `vercel.json` |

### Collection census (from `git grep` of `collection(db, '…')` + `collectionName="…"`)

> ~90 collections found. Categorised below. **(UNVERIFIED: live sizes, doc counts, growth rates.)**

**Public marketing content (read-heavy, admin-written)**
`banners`, `news`, `events`, `gallery`, `galleryAlbums`, `happenings`, `happeningsShowcase`, `programs`, `departments`, `schools`, `faculty`, `curriculum`, `governanceItems`, `governingBody`, `coreExecutives`, `honouredGuests`, `differentiatorItems`, `placementItems`, `placementMenuColumns`, `placementHighlights`, `recruiterLogos`, `mousPartnerLogos`, `announcements`, `campusLifeItems`, `campusLifeQuickLinks`, `contentBlocks`, `sitePhotos`, `settings` (siteContact / featurePopup docs), `landingPages`, `navLinkOverrides`, `theme*`, `academicCalendar`, `holidays`, `jobOpenings`, `faqs`, `contacts`, `insights`, `professionalBodies`, `researchItems`, `eapcet*`, `iic*` (7 link/activity sub-collections via `IicDocumentsAdmin`), `aicteIdeaLab*` (3), `vdl*` (2), `rwtpReportLinks`, `nbaDataDocs`, `nirfReportsDocs`, `annualReportsDocs`, `complianceDocs`, `institutionalPolicies`, `patentCertificates`, `consultancyReports`, `downloads`, `sports*` (`sportsPageSettings`, `sportsCategories`, `sportsFacilities`, `sportsTournaments`, `sportsAchievements`), `svesCampuses`, `studentClubs`, `tpoTeamBios`, `placementCrtDocsList`, `gsacPhotos`… plus per-page `contentBlocks` `page:` partitions (wellness, auditoriums, health-care, travel-desk, …).

**Alumni & Giving**
`alumniImpact`, `givingLevels`, `alumniStories`, `alumniEvents`, `alumniCompanies`.

**Visitor-submitted PII / CRM (unbounded, admin-inbox)**
`admissionInquiries`, `contactSubmissions`, `careerApplications`, `campusVisitRequests`, `careerGuidanceInterest`.

**Admin/RBAC**
`department_users` (RBAC, `src/lib/rbac.ts`).

**Legacy / possibly-dead**
`placements` — the old per-company placement collection is **no longer read**; the UI now uses `placementYears` (wide batch docs) + `placementItems` + `placementHighlights`. (`PlacementYearsAdmin.tsx:391-398` documents this.)

---

## 3. Schema Audit

No formal schema exists; the de-facto schema is the TypeScript interfaces in each admin section + seed data. Key documents reviewed:

| Collection | Shape snapshot (fields observed) | Authority file |
|---|---|---|
| `contentBlocks` | `{ page, section, order, title, desc/value, imageUrl, storagePath, createdAt }` | `ContentBlocksAdmin.tsx:24-35`, `useContentBlocks.ts` |
| `sitePhotos` | `{ page, section, order, imageUrl, alt, caption }` | `SitePhotosAdmin.tsx:15-24`, `useSitePhotos.ts` |
| `settings` | mixed-doc config bag: `settings/siteContact`, `settings/featurePopup` | `SiteContactAdmin.tsx:34`, `FeaturePopupAdmin.tsx:15-19` |
| `banners` | `{ page, title, subtitle, imageUrl, … }` | `usePageBanners.ts`, `BannersAdmin.tsx` |
| `placedmentYears` | **wide**: whole placement year as a single doc keyed by `batch` (set as the doc ID), 100+ pipe-delimited company rows | `PlacementYearsAdmin.tsx:401,454` |
| `admissionInquiries` | `{ name, email, phone, program, dept, course, status, createdAt, … }` | `AdmissionInquiriesAdmin.tsx:24`, `AdmissionApplyForm.tsx:297,371` |
| `contentBlocks`-based tiles | multiple page-specific sections all in one collection, filtered client-side by `page:section` | `AuditoriumsAdmin.tsx:72`, `HealthCareAdmin.tsx:83` |

**Schema observations**
- **No timestamps discipline**: `createdAt: serverTimestamp()` appears on admin-created docs and inbox docs, but TTL/can-snooze eligibility needs it on *every* doc; several seeds set `order` but no date. TTL on inbox collections would automatically delete docs — a benefit and a risk (see §6#5).
- **Free-form arrays in docs**: `placementYears` embedded arrays on `departments`/`programs` docs (`DepartmentDetail.tsx:617`, `DepartmentsAdmin.tsx:150`) duplicate the same placement data that also lives in `placementYears` — dual-write drift risk.
- **Config bag pattern**: `settings` mixes unrelated configs; `sportsPageSettings`, `landingPages`, `navLinkOverrides`, `theme*` are single-doc configs — all fine, but they're spread across collections with no registry.
- **No client-side validation on shapes** — writes are `addDoc(payload)` with whatever the form produced; rules don't validate fields. Schema drift creeps in via forgotten mandatory fields.

---

## 4. Query Audit

### Read paths
214 files import/extract the data hooks; 148 hook call sites counted. Most are **unconstrained** `useOrderedCollection(name, 'order')` = `query(col, orderBy('order'))` with **no `limit()`** (`useCollection.ts:39`).

| Query | Pattern | Count/severity |
|---|---|---|
| Whole collection, no limit | `useOrderedCollection('x','order')` across ~90 collections | Dominant pattern |
| Shared whole-collection (deduped) | `sitePhotos`, `contentBlocks` — single ref-counted listener (`useSitePhotos.ts:17-48`, `useContentBlocks.ts:14-45`) | ✓ already fixed |
| Filtered, single-field | `banners where('page',==)` (`usePageBanners.ts:30`); `landingPages where('active',==)+limit(1)` (`useActiveLandingPage.ts:18`); `happenings where type` | Best-practice examples |
| Whole ×4 on every page | Header: `differentiatorItems`, `placementItems`, `campusLifeItems`, `campusLifeQuickLinks` (`Header.tsx:421-448`) | Worst hotspot |
| Whole + client-side filter | `DepartmentDetail.tsx:417-439` (allDepartments + allPrograms + recruiterLogos + mousPartnerLogos then `.find()`/filter); AnnouncementsTicker full `announcements` (`:23`); Overview doc counts by fetching whole collections (`Overview.tsx:10-31`) | High-cost |
| Document get | `useDocument` (single doc) — `HappeningDetail`, `SportsDetail`, `Settings`, theme, landing pages, `navLinkOverrides` | ✓ fine |

### Write paths
~470 `updateDoc|deleteDoc|setDoc|addDoc|writeBatch` references. Highlights:

| Write | Pattern | Notes |
|---|---|---|
| Gallery upload | `for…:  uploadImage → addDoc` sequential (**1 RTT per image**) | `GalleryAdmin.tsx:126-141` — should be `writeBatch` chunked |
| Gallery seed/delete-all | already uses `writeBatch` (400/batch) | `GalleryAdmin.tsx:293-383` ✓ |
| Placement years | `setDoc(doc(db,'placementYears', batch), …)` overwrite whole year | `PlacementYearsAdmin.tsx:454` — wide doc rewrite |
| Inbox forms | single `addDoc` with PII, `status:'new'` | anonymous create (see §6#2) |
| Logos seed | `addDoc` loop | `MousPartnerLogosAdmin.tsx:104` |
| Program/faculty/dept admin | `updateDoc` subset via `formDiff` | `formDiff.ts:4-39` ✓ |

### Missing capabilities identified
- ❌ **No `limit()`/`orderBy` pagination** anywhere on list reads.
- ❌ **No aggregation**: doc counts are computed by downloading full collections (`Overview.tsx`).
- ❌ **No server-side aggregation/pre-computed counters** (a `stats` doc updated by a Cloud Function is absent; there is no server at all).
- ❌ **No scheduled/retention deletes** — nothing ever removes an inbox row or an old placement year.
- ❌ **No `where(status)` on inbox admin reads** — admin lists fetch every submission ever, then filter in memory.
- ❌ Anonymous writes to two collections are **blocked by rules** (see §6#2).

---

## 5. Index Audit

- **`firestore.indexes.json` does not exist** (glob confirm). Firestore will auto-create single-field index entries; composite indexes are being added manually in console (unknown set — **UNVERIFIED**, no way to see them from repo).
- **Repo-visible query shapes needing composite indexes**: essentially **none** — every query is single-field equality (`where('page',==)`) + single-field `orderBy`, which Firestore serves with document-level indexes automatically.
  - Potential composite need if you add `where('type',==) + orderBy('date')` on `happenings` or `where('status',==) + orderBy('createdAt')` on inbox collections in the future → **add an `indexes` export + `firestore.indexes.json` now** so it's versioned.
- Net: index bloat is not the current problem; the current problem is *fan-out of unconstrained reads*, which no index fixes.

---

## 6. Bloat Risks (ranked)

#### R1 — `deleteFile` no-op → orphaned media (P0)
`deleteFile` is literally `return;` (`src/lib/storage.ts:40-42`). Every `removeEntry`/replace flow (docs, gallery, banners, logos, sports, placements assets — ~50 call sites) deletes the Firestore doc but never the Cloudinary asset. **Every replaced upload accumulates**: the original + `upload_preset`'s cropped/transformed variants stay in the `vwu/` folder forever. Storage cost grows monotonically with admin churn. UNVERIFIED real bill, but structurally certain.

#### R2 — Rules gap: 2 PII collections public + anonymous create denied (P0)
`firestore.rules:18` lists only 3 private collections. `campusVisitRequests` and `careerGuidanceInterest` both carry PII (name/email/phone, `CampusVisit.tsx:111-123`, `CareerGuidanceInterestForm.tsx:77-86`) but:
1. **Readable by the public** (not in the exclusion list) — a data-exposure defect.
2. **Anonymous create denied** — the catch-all write rule requires `request.auth != null` (`firestore.rules:19`), so these two visitor forms **fail at write time** the moment rules deploy. The repo's own rules are internally inconsistent with the app's anonymous-write surface.

#### R3 — Unbounded inbox/CRM collections (P1)
5 collections grow with every visitor submit, forever. No retention, no TTL, no archival, no pagination, and the admin readers download them **in full** (`AdmissionInquiriesAdmin.tsx:24`, `ContactMessagesAdmin.tsx:23`, `CareerApplicationsAdmin.tsx:26`, `CampusVisitRequestsAdmin.tsx:39`, `CareerGuidanceInterestAdmin.tsx:25`). At a university's traffic this is months-to-years before it matters — but it's the one place doc count genuinely grows without bound.

#### R4 — Whole-collection listener fan-out (P1)
148 unconstrained listener call sites. Header alone (present on **every** public page) keeps 4 whole collections live (`Header.tsx:421-448`). `DepartmentDetail` pulls 4 whole collections to satisfy one page (`:417-439`). Managed-growth collections stay small, but each new page adds new whole-collection reads; the shared-listener precedent exists and should be the norm.

#### R5 — Wide `placementYears` docs (P2)
One doc per batch holds the full company list as pipe-delimited strings (`PlacementYearsAdmin.tsx:454-480`); rewrites overwrite the entire doc. As years accumulate they stay bounded (a few MB per year max) — acceptable today, ugly for any future relational/reporting need.

#### R6 — Legacy `placements` collection (P2)
Writes happened historically; nothing in `src/` reads it now (`PlacementYearsAdmin.tsx:391-398`). It's dead weight + stale-confusing. UNVERIFIED whether it still holds many docs.

---

## 7. Prioritized Fixes Table

Sort: P0 → P2, then ROI.

| ID | Category | Severity | Location | Evidence | Bloat/risk mechanism | Recommended fix | Expected impact | Effort | Risk | Priority |
|---|---|---|---|---|---|---|---|---|---|---|
| F1 | **Storage leakage** | **P0 / High** | `src/lib/storage.ts:40-42`; ~50 call sites | `deleteFile(_path){return;}` | Orphaned Cloudinary originals + variants never freed | Add Cloudinary **signed** delete endpoint (Vercel serverless fn using secret) OR batch cleanup script (`scripts/delete-cloudinary-orphans.mjs` walking storagePaths); keep UI path but wire real delete | Stops monotonic media-cost growth; frees `vwu/` clutter | S (fn) / M (script) | Low-Med (must not sign user-generated content silently) | **P0** |
| F2 | **Data exposure / broken form** | **P0 / High** | `firestore.rules:17-40` | Rules list omits 2 anonymous-write collections | PII (`campusVisitRequests`, `careerGuidanceInterest`) **publicly readable**; anonymous create **denied** → forms silently fail | Add both to private list **and** `allow create: if true` blocks (mirror `contactSubmissions` shape); optionally add `status`/`createdAt` TTL | Stops PII leak; fixes 2 broken public forms | XS | Low | **P0** |
| F3 | **Inbox unbounded growth** | P1 / Medium | `AdmissionInquiriesAdmin.tsx:24`, `ContactMessagesAdmin.tsx:23`, `CareerApplicationsAdmin.tsx:26`, `CampusVisitRequestsAdmin.tsx:39`, `CareerGuidanceInterestAdmin.tsx:25`; rule files | `addDoc` on every form submit, no TTL/deletion policy, admin reads all rows | Rows accumulate forever; admin list cost grows linearly | (a) Add `createdAt` everywhere it's missing; (b) Firestore **TTL policy** auto-expiring 6–12 mo; or (c) `where('status',…)`+`limit(100)` paginated admin reads + "archive" status; (d) Cloud Function cron for the delete. Any two of these stops worst case | Bounded inbox; faster admin panel | M | Med (TTL deletes are permanent — need archive first) | **P1** |
| F4 | **Listener fan-out** | P1 / Medium | `useCollection.ts:39`; `Header.tsx:421-448`; `DepartmentDetail.tsx:417-439`; `AnnouncementsTicker.tsx:23`; `Overview.tsx:10-31` | 148 un-bounded listener call sites | Every page load re-downloads whole collections; multiple listeners per page | Extend the shared-subscription pattern to the hot collections (`differentiatorItems`, `placementItems`, `campusLifeItems`, `campusLifeQuickLinks`, `placementHighlights`…); add `limit()` where a page only shows a slice; move Header menu data to one shared on-demand nav query | Big win on slow networks; fewer forged connections | M | Low-Med (shared-subscription pattern already proven) | **P1** |
| F5 | **Gallery upload RTT** | P1 / Low-Med | `GalleryAdmin.tsx:126-141` | `for… await addDoc` per image | 1 round-trip per image; 50 images = 50 writes | `writeBatch` in chunks of 400; compute `order` ahead (mirror `deleteAllImages` batched delete at `:364`) | Faster bulk upload; fewer writes | S | Low | **P1** |
| F6 | **Versioned indexes** | P1 / Low | none | no `firestore.indexes.json` | Composite indexes live only in console, invisible to repo | Add `firestore.indexes.json` (even empty `indexes: []`) + note future composite needs inline | Repo is single source of truth for index config | XS | Low | **P1** |
| F7 | **Wide placementYears** | P2 / Low | `PlacementYearsAdmin.tsx:454-516`; `DepartmentsAdmin.tsx:150` | `setDoc` whole-year doc, pipe-joined rows; dupe arrays on `departments`/`programs` | Wide-doc rewrites; dual-source drift | Normalize into `placementYears/{year}/companies/{id}` or keep doc but store companies as array not delimited string; pick **one** source (embedded vs standalone) | Smaller writes; reliable exports/reporting | M | Med (data-model change touches admin + `PlacementYearAccordion`) | **P2** |
| F8 | **Legacy `placements` collection** | P2 / Info | collection `placements` (unread) | `PlacementYearsAdmin.tsx:391-398` | Dead data, stale confusion | Verify emptiness in console; then delete collection (or keep as archive export) | Removes dead weight | S | Low | **P2** |
| F9 | **Static sitemap** | P2 / Info | `scripts/generate-sitemap.mjs`, build hook `package.json:8` | sitemap generated from hardcoded route list | No DB involvement today; fine | Revisit only if SEO on Firestore-sourced pages becomes a priority; otherwise no-op | — | — | — | **P2 (informational)** |

**Notes**: (1) F1 & F2 are interdependent with deployment — F2 must ship with the rules update, since rules deploy is manual (`firebase deploy --only firestore:rules`) and may already be live with the current file. (2) F3's TTL option is destructive; ship archival before TTL. (3) F4's shared listener work must respect the Firestore-gotcha rule in `CLAUDE.md` (don't gate `.reveal` animations behind Firestore-timed renders).

---

## 8. Migration / Code Suggestions

> All snippets are *suggestions requiring review* — not applied.

**S1 — `firestore.rules` closure (F2)**
```
match /campusVisitRequests/{docId} {
  allow create: if request.resource.data.keys().hasOnly(['type','fullName','email','phone','preferredDate','numberOfPersons','department','program','message','status','createdAt']);
  allow read, update, delete: if request.auth != null;
}
match /careerGuidanceInterest/{docId} {
  allow create: if request.resource.data.keys().hasOnly(['fullName','email','phone','branch','year','track','message','status','createdAt']);
  allow read, update, delete: if request.auth != null;
}
```

**S2 — Cloudinary orphan sweeper (F1)** — `scripts/delete-cloudinary-orphans.mjs`
1. List every `storagePath` (public_id) referenced in Firestore across all admin-written collections (`git grep` shows the field is consistently `storagePath`).
2. `cloudinary.api.resources({type:'upload', max_results:500, prefix:'vwu/'})` paginated.
3. Delete assets whose public_id is not in the referenced set (dry-run by default).

**S3 — Bounded inbox reads (F3)** — change admin list hooks
`useOrderedCollection<Doc>('contactSubmissions', 'createdAt', 'desc')` → a new `useOrderedCollection(..., {limit: 100})` or `usePaginatedCollection` with "load more"; keep full count via `count()` aggregation.

**S4 — Batched gallery upload (F5)**
Collect `uploadImage` results in chunks of 400, then `writeBatch` each chunk instead of sequential `addDoc`.

**S5 — Versioned index baseline (F6)**
% `firestore.indexes.json`
```
{ "indexes": [], "fieldOverrides": [] }
```
Add composite entries when the future queries in §5 land.

---

## 9. Verification Plan

After implementing any fix set:

| Fix | Verify by |
|---|---|
| F1 | Dry-run sweeper shows expected orphan set; then delete 1 known asset; re-check Cloudinary console |
| F2 | From a signed-out browser: submit both forms → doc lands; confirm `firestore.rules` preview denies anonymous **read**; `firebase emulators:exec` rules tests |
| F3 | `useCollection` counts/lists respect the limit; TTL emulator test on a `createdAt`-classed doc |
| F4 | Network tab on Home/Program pages shows 1 connection per shared collection; Explorer page renders from one shared `programs` listener |
| F5 | Upload 50 images → one batch write; `order` contiguous |
| F6 | `firebase deploy --only firestore:indexes` succeeds; no breaking console drift |
| Global | `npx tsc --noEmit` clean; `/admin` full CRUD smoke on every touched collection; no `.reveal`-gated Firestore content regressions per `CLAUDE.md` gotcha |

---

## 10. Open Questions (need volunteer input / console access)

1. **Live doc counts per collection** — which collections are actually large today (esp. `placements`, `placementYears`, inbox 5)? (UNVERIFIED)
2. **Current Cloudinary bill / asset count** — is the orphan accumulation already costly, or is it early-stage? (UNVERIFIED)
3. **Are the repo `firestore.rules` actually deployed?** The current file would break 2 public forms if live (F2).
4. **Any composite indexes already created in console** that we should fold into `firestore.indexes.json`? (UNVERIFIED)
5. **Retention policy preference** for inboxes: keep forever (small site), archive-to-BigQuery, or TTL-expire after N months? Drives F3's design.
6. **Is the legacy `placements` data needed for anything** (old Excel reports, compliance) before we treat it as deletable? Drives F8.
7. **Uploader variants** — does the `upload_preset` generate eager/transformed variants beyond the original? That multiplies F1's orphan count.
8. **Should placement offers move to a relational-ish model** (per-company docs) for future reporting, or stay batch-docs for simplicity? Drives F7.