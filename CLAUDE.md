# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- `npm run dev` — start the Vite dev server
- `npm run build` — type-check (`tsc`) then build for production
- `npm run preview` — preview the production build locally
- `npm run lint` — ESLint over `.ts`/`.tsx` (zero warnings allowed). Note: no ESLint config file currently exists at the repo root, so this script will fail until one is added.
- No test runner is configured in this repo.

## Architecture

This is a Vite + React + TypeScript marketing/CMS site for Vishnu Womens University (VWU). Routing is via `react-router-dom` (`BrowserRouter`), with the `@` path alias mapped to `src/` (see [vite.config.ts](vite.config.ts) and [tsconfig.json](tsconfig.json)).

### Public site vs. Admin split

[src/App.tsx](src/App.tsx) has a `RootRouter` that branches on the URL before anything else renders:
- `/admin/*` → `AdminLayout`, a completely separate SPA-in-an-SPA (its own auth gate, sidebar nav, no public `Header`/`Footer`).
- Everything else → `PublicApp` (shared `Header` + `Footer` wrapping all public routes), unless `VITE_MAINTENANCE_MODE=true`, in which case a static `MaintenancePage` is shown instead for all non-admin routes.

New public pages must be added both as a file under `src/pages/<PageName>/` and as a `<Route>` in `App.tsx` — there is no file-based routing.

### Content model: static data vs. Firestore-backed content

Two different content sources coexist, and it matters which one a given page/feature uses:
1. **Static/hardcoded data** — most page copy, and structured content like `src/pages/Placements/placements.data.ts` (the placement *hub-page* cards, e.g. "Placement Details" — page-navigation scaffolding, not day-to-day content), `src/pages/Governance/governance.data.ts`, `src/pages/Differentiators/differentiators.data.ts`. `src/pages/NewsAwards/news-awards.data.ts` also holds a static text archive (`happenings`, `awards`, `galleryAlbums`/`galleryYears` — a historical year-by-year index of past event titles with no images) rendered further down the Gallery page, below the live photo grid.
2. **Firestore-backed content** — hero banners, news/events (`news` collection), gallery photos (`gallery` collection), programs (`programs` collection — full department/program detail including highlights/labs/outcomes/semester-wise syllabus, an `icon` string field resolved via [src/lib/programIcons.ts](src/lib/programIcons.ts), and a `department` field used to look up that program's faculty), faculty (`faculty` collection, tagged by `department`), core executives (`coreExecutives` collection), placements/recruiters (`placements` collection — individual company/package/year records, distinct from the static hub-page cards above), announcements, and Alumni & Giving (`alumniImpact`, `givingLevels`, `alumniStories`, `alumniEvents`, `alumniCompanies` collections, managed from the admin's single "Alumni & Giving" section via internal tabs in [AlumniAdmin.tsx](src/pages/Admin/sections/AlumniAdmin.tsx)). These are editable at runtime from `/admin` and read on the public site via real-time listeners:
   - `useCollection` / `useOrderedCollection` ([src/hooks/useCollection.ts](src/hooks/useCollection.ts)) — live Firestore collection subscriptions. [News.tsx](src/pages/News/News.tsx), the Home page's "Latest from VWU" strip (only items with `featured: true`), the Photo Gallery section of [Gallery.tsx](src/pages/NewsAwards/Gallery.tsx), [AlumniGiving.tsx](src/pages/AlumniGiving/AlumniGiving.tsx), [Academics.tsx](src/pages/Academics/Academics.tsx)/[ProgramDetail.tsx](src/pages/Academics/ProgramDetail.tsx), [Faculty.tsx](src/pages/Academics/Faculty.tsx), the "Our Recruiters" section of [Placements.tsx](src/pages/Placements/Placements.tsx), and [AnnouncementsTicker.tsx](src/components/AnnouncementsTicker/AnnouncementsTicker.tsx) all consume these directly — there is no static fallback, so an empty collection means that section is simply hidden (or shows an empty state) on the public site until an admin adds content. Each Alumni & Giving sub-admin has a one-click "Add starter …" button that seeds the collection with the original hardcoded content, since these collections start empty.
   - `useDocument` ([src/hooks/useDocument.ts](src/hooks/useDocument.ts)) — live single-document subscription.
   - `usePageBanner` / `usePageBanners` — fetch the `banners` collection filtered by a `page` slug; consumed by `PageHero` ([src/components/PageHero/PageHero.tsx](src/components/PageHero/PageHero.tsx)) so admins can override the hero image/title/subtitle/CTA per page without a deploy. `PageHero` always shows the hardcoded default image immediately, then swaps in Firestore data once loaded (avoids a flash of the wrong title).

Firebase is initialized in [src/lib/firebase.ts](src/lib/firebase.ts) from `VITE_FIREBASE_*` env vars (`.env`), wrapped in a try/catch so a misconfigured/missing Firebase project doesn't crash the whole app — `db`/`auth` are just `undefined` in that case, and dependent hooks fail through their own error state.

**Gotcha — scroll-reveal animations (`.reveal`/`.revealed` classes, driven by a page-level `IntersectionObserver` in a `useEffect`) do not mix safely with Firestore-derived content.** Each Firestore snapshot delivery (even a redundant cache-then-server re-delivery of identical data) hands back a new array/object reference, and `useCollection`'s callers often have independent, unpredictably-ordered load timing (e.g. `ProgramDetail.tsx` loads a `programs` doc and a separate `faculty` collection query). A `useEffect(..., [firestoreData])` observer setup can end up torn down and recreated at the wrong moment and permanently miss elements that render in between — and this only reproduces intermittently (React.StrictMode's dev-only double-invoke of effects makes it worse, but it isn't the whole story; it also happens in ordinary use). The fix applied throughout this codebase: don't put `.reveal`/`.reveal-left`/etc. classes on elements whose rendering is gated behind Firestore data — render them plainly (always visible, no fade-in). Static, always-present content (page headers, section labels not gated behind a data check) can keep the animation safely with the original simple mount-only observer pattern.

### Admin CMS pattern

`AdminLayout` ([src/pages/Admin/AdminLayout.tsx](src/pages/Admin/AdminLayout.tsx)) gates on Firebase Auth (`onAuthStateChanged`) and shows `AdminLogin` (email/password sign-in) until authenticated, then renders `AdminDashboard`, which switches between section components in `src/pages/Admin/sections/` based on the `SECTIONS` list (Overview, Hero Banners, News & Events, Gallery, Programs, Faculty, Governing Body, Core Executives, Placements, Alumni & Giving, Announcements).

Each section component (e.g. [src/pages/Admin/sections/NewsAdmin.tsx](src/pages/Admin/sections/NewsAdmin.tsx)) follows the same shape: local form state → `useOrderedCollection` to list existing docs → `addDoc`/`updateDoc`/`deleteDoc` directly against Firestore → `ImageUploader` for image fields. There is no server/API layer — all reads/writes go straight from the browser to Firestore and Firebase Storage using client-side SDK calls guarded only by Firestore/Storage security rules (not present in this repo) and Firebase Auth.

### Image uploads

`ImageUploader` ([src/components/ImageUploader/ImageUploader.tsx](src/components/ImageUploader/ImageUploader.tsx)) crops the selected image client-side, then uploads the resulting blob to Firebase Storage via `uploadImage` in [src/lib/storage.ts](src/lib/storage.ts), which writes to the `VITE_FIREBASE_STORAGE_BUCKET` bucket (configured in [src/lib/firebase.ts](src/lib/firebase.ts)) and returns the `getDownloadURL()` result plus the storage path (saved as `imageUrl`/`storagePath` on the Firestore doc).

### Styling

No CSS framework — each component/page has a co-located `.css` file (e.g. `Header.css` next to `Header.tsx`) plus shared tokens in `src/styles/variables.css` and global rules in `src/styles/global.css`. Detail pages (program/governance/differentiator/placement detail) share `src/pages/detail-layout.css`.

### One-off scripts

`scripts/replace-heroes.mjs` is a codemod (not part of the build) that was used to bulk-replace hardcoded `<section className="page-hero">` blocks across pages with `<PageHero />` components; it contains the canonical per-page hero title/subtitle/breadcrumb data if that ever needs to be regenerated or referenced.

### Deployment

Deploys to Vercel; [vercel.json](vercel.json) rewrites all paths to `/index.html` for client-side routing.
