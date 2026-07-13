# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- `npm run dev` — start the Vite dev server
- `npm run build` — type-check (`tsc`) then build for production
- `npm run preview` — preview the production build locally
- `npm run lint` — ESLint over `.ts`/`.tsx` (zero warnings allowed). Note: no ESLint config file currently exists at the repo root, so this script will fail until one is added.
- No test runner is configured in this repo.

## Architecture

This is a Vite + React + TypeScript marketing/CMS site for Vishnu Womens University (VWU), a rebrand of SVECW. Routing is via `react-router-dom` (`BrowserRouter`), with the `@` path alias mapped to `src/` (see [vite.config.ts](vite.config.ts) and [tsconfig.json](tsconfig.json)).

### Public site vs. Admin split

[src/App.tsx](src/App.tsx) has a `RootRouter` that branches on the URL before anything else renders:
- `/admin/*` → `AdminLayout`, a completely separate SPA-in-an-SPA (its own auth gate, sidebar nav, no public `Header`/`Footer`).
- Everything else → `PublicApp` (shared `Header` + `Footer` wrapping all public routes), unless `VITE_MAINTENANCE_MODE=true`, in which case a static `MaintenancePage` is shown instead for all non-admin routes.

New public pages must be added both as a file under `src/pages/<PageName>/` and as a `<Route>` in `App.tsx` — there is no file-based routing.

### Content model: static data vs. Firestore-backed content

Two different content sources coexist, and it matters which one a given page/feature uses:
1. **Static/hardcoded data** — most page copy, and structured content like `src/pages/Academics/programs.data.ts`, `src/pages/Placements/placements.data.ts`, `src/pages/Governance/governance.data.ts`, `src/pages/Differentiators/differentiators.data.ts`, `src/data/news.ts`. Edited directly in code.
2. **Firestore-backed content** — hero banners, news/events, gallery, faculty, placements, announcements. These are editable at runtime from `/admin` and read on the public site via real-time listeners:
   - `useCollection` / `useOrderedCollection` ([src/hooks/useCollection.ts](src/hooks/useCollection.ts)) — live Firestore collection subscriptions.
   - `useDocument` ([src/hooks/useDocument.ts](src/hooks/useDocument.ts)) — live single-document subscription.
   - `usePageBanner` / `usePageBanners` — fetch the `banners` collection filtered by a `page` slug; consumed by `PageHero` ([src/components/PageHero/PageHero.tsx](src/components/PageHero/PageHero.tsx)) so admins can override the hero image/title/subtitle/CTA per page without a deploy. `PageHero` always shows the hardcoded default image immediately, then swaps in Firestore data once loaded (avoids a flash of the wrong title).

Firebase is initialized in [src/lib/firebase.ts](src/lib/firebase.ts) from `VITE_FIREBASE_*` env vars (`.env`), wrapped in a try/catch so a misconfigured/missing Firebase project doesn't crash the whole app — `db`/`auth` are just `undefined` in that case, and dependent hooks fail through their own error state.

### Admin CMS pattern

`AdminLayout` ([src/pages/Admin/AdminLayout.tsx](src/pages/Admin/AdminLayout.tsx)) gates on Firebase Auth (`onAuthStateChanged`) and shows `AdminLogin` (email/password sign-in) until authenticated, then renders `AdminDashboard`, which switches between section components in `src/pages/Admin/sections/` based on the `SECTIONS` list (Overview, Hero Banners, News & Events, Gallery, Programs, Faculty, Placements, Announcements).

Each section component (e.g. [src/pages/Admin/sections/NewsAdmin.tsx](src/pages/Admin/sections/NewsAdmin.tsx)) follows the same shape: local form state → `useOrderedCollection` to list existing docs → `addDoc`/`updateDoc`/`deleteDoc` directly against Firestore → `CloudinaryUploader` for image fields. There is no server/API layer — all reads/writes go straight from the browser to Firestore and Cloudinary using client-side SDK calls guarded only by Firestore security rules (not present in this repo) and Firebase Auth.

### Image uploads

`CloudinaryUploader` ([src/components/CloudinaryUploader/CloudinaryUploader.tsx](src/components/CloudinaryUploader/CloudinaryUploader.tsx)) uploads directly to Cloudinary's unsigned upload API using `VITE_CLOUDINARY_CLOUD_NAME` / `VITE_CLOUDINARY_UPLOAD_PRESET`, via `uploadToCloudinary` in [src/lib/cloudinary.ts](src/lib/cloudinary.ts). `cloudinaryUrl()` builds transformed delivery URLs (`f_auto,q_auto` plus optional width/height/quality) for rendering images elsewhere in the app.

### Styling

No CSS framework — each component/page has a co-located `.css` file (e.g. `Header.css` next to `Header.tsx`) plus shared tokens in `src/styles/variables.css` and global rules in `src/styles/global.css`. Detail pages (program/governance/differentiator/placement detail) share `src/pages/detail-layout.css`.

### One-off scripts

`scripts/replace-heroes.mjs` is a codemod (not part of the build) that was used to bulk-replace hardcoded `<section className="page-hero">` blocks across pages with `<PageHero />` components; it contains the canonical per-page hero title/subtitle/breadcrumb data if that ever needs to be regenerated or referenced.

### Deployment

Deploys to Vercel; [vercel.json](vercel.json) rewrites all paths to `/index.html` for client-side routing.