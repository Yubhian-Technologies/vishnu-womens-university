# VWU Admissions Pages — Proposed Redesign Report

**Status:** Proposal — not yet implemented. The only implementation attempted (a small nav cleanup in `Header.tsx` / `Footer.tsx`) was reverted; the working tree's admission files are back to their pre-proposal state.

**Scope:** all public Admission pages + the Admissions nav in `Header.tsx`.

---

## 1. Why redesign

The current admissions section works but mixes four different user intents into one flat nav list, and buries the single most important action.

**Current Admissions nav (Header.tsx, as of today):**

| Label | Route / Link | Intent |
|---|---|---|
| Admissions Overview | `/admissions` | Decide |
| Programmes & Fee Structure | `/programmes-fee-structure` | Decide (cost) |
| Admission Procedure | `/admission-procedure` | Apply (how) |
| Results Analysis | `/result-analysis` | Trust / decide |
| Fee Payment Portal | external `svecw.ac.in` | **Pay (wrong audience — current students, misplaced here)** |
| How to Reach Campus | `/contact` | Visit |
| — | **Apply Now `/apply-now` exists but is absent from this nav** | Apply |

Problems:
- **Apply Now is not in the Admissions menu.** The only path to it is the global header CTA pill/mobile drawer CTA. A prospective student exploring the Admissions section never sees the application affordance in context.
- **Fee Payment Portal sits among prospect-facing links.** It is a current/continuing-student portal (RTGS/NEFT fee payment on `svecw.ac.in`); it has no place in a decide/apply flow for new applicants.
- **Results Analysis is duplicated** — it appears under both Admissions and Academics navs (same route). Duplication dilutes each menu's clarity; it belongs to the admissions decision path only.
- **Flat six-item list** forces equal weight on unequal actions: decide vs. pay vs. visit vs. apply. New applicants get no sense of "where do I start."
- **No staging/step-by-step guidance.** The five real decision points — *which programme, what does it cost, am I eligible, how do I apply, what's the outcome* — exist as pages but are never sequenced.

## 2. Research basis

Design decisions below rest on a **thrivemattic 2025 audit of 194 Indian university admission pages** (plus standard UX/convnet patterns for high-stakes application funnels):

- **Hub-and-spoke IA:** one Admissions hub as a launchpad; each spoke page has exactly one job.
- **≥2-click access:** eligibility, fees, deadlines, and the application action must be reachable within two clicks of the hub.
- **Two content clusters** successful pages converge on:
  1. *Essential info* — programmes, fees, eligibility, scholarships, deadlines.
  2. *Application process* — the form, a step-by-step walkthrough, documents, entrance exam, timeline.
- **Few-field pre-application inquiry:** high-converting pages collect ≤5 fields (name, phone, email, interested programme) before the full form.
- **One dominant, verb-led CTA** above the fold and repeated at decision points.
- **Fee transparency** is a stated top-two deciding factor; pages that published clear fees (incl. intake seats) converted better.
- **Avoid dead-end/placeholder pages** — they erode trust. (Exception: VWUNET stays a placeholder by explicit product decision; it is kept out of the primary nav.)

## 3. Proposed information architecture

One hub, five spokes, a primary action, and two "outsider" links relocated.

```
Admissions (hub — /admissions)
│
├── Start here: "Who are you applying for?" pathway chooser
│     └── (filters the procedure timeline + surfaces the right fees/scholarships)
│
├── Apply Now              → /apply-now            (primary action, dominant CTA everywhere)
├── Admission Procedure    → /admission-procedure (step-by-step how-to-apply)
├── Programme Admission Rules → (anchors inside programmes-fee-structure via param/hash)
│     └── B.Tech. | B.Tech. (Lateral) | M.Tech. | MBA | Ph.D.
├── Programmes & Fee Structure → /programmes-fee-structure (cost/eligibility/intake)
├── Results Analysis       → /result-analysis      (proof: pass rates + success factors)
├── Scholarships & Aid     → (new section — lives on hub + fee page until a full page is built)
│
└── Visit / Contact        → /contact   (secondary)
```

**Proposed Admissions menu** (order = journey, one entry per intent):

1. Admissions Overview — `/admissions`
2. Apply Now — `/apply-now` _(new in menu, first-class)_
3. Programmes & Fee Structure — `/programmes-fee-structure`
4. Admission Procedure — `/admission-procedure`
5. Results Analysis — `/result-analysis`
6. How to Reach Campus — `/contact`

**Moved out:**
- *Fee Payment Portal* (external `svecw.ac.in`) → Footer **Academic Links** column, next to Examinations Portal (it is a student/payment portal, not an applications link).
- *Results Analysis* removed from the **Academics** dropdown (kept only under Admissions).

Optionally (if approved): the Admissions dropdown's promo/"Join VWU" highlight card CTA switches from *Fee Structure* to *Apply Now*, making the single dominant action literal inside the menu itself.

## 4. Page-by-page

### 4.1 Admissions hub — `/admissions` (redesign; exists)

**Purpose:** one page that tells every visitor *where to go next*. No deep content of its own — it is a launcher + trust builder.

**Contents / sections (top → bottom):**

1. **Hero (`PageHero`)** — existing headline/copy; CTA stack: *Apply Now* (primary) + *View Programmes & Fees* (secondary). Hero image stays the default crowd/campus image (Firestore banner swap is already wired).
2. **Pathway chooser — "Who are you applying for?"** — 4–5 large cards:
   - Class X → B.Tech. (UG direct)
   - Diploma / B.Sc. → B.Tech. lateral entry
   - Bachelor's → M.Tech. / MBA (PG)
   - Master's → Ph.D.
   - *International / transfer* — a slim "NRI / transfer candidates" tile
   Each card: one-line eligibility gloss + "View admission rules →" *and* "Apply →". Selecting a card filters the procedure timeline (hub mirrors `admission-procedure` tab state) and pre-highlights the matching fee rows.
3. **Decision strip (2-click essentials)** — 4 stat-style quick cards: *Application window*, *EAPCET/VISW code* (e.g. VISW / VISWPU), *First-year fee from ₹—* (pulled from fee page), *Scholarships available*. Each links into the relevant spoke.
4. **"How to apply — 4 steps"** condensed timeline (from the admission-procedure data) with the single CTA *Go to Admission Procedure*.
5. **Why VWU / proof** — compact trust band (accreditation, placements highlight) + link to Results Analysis.
6. **Scholarships & Aid teaser** — 2–3 lines + amounts; "See fee structure →".
7. **Admissions contact card + pre-application form (closed for now)** — optional 4-field inquiry (name, phone, email, programme) that opens the existing `/apply-now` form pre-filled via query params (`?program=B.Tech`). Ships only if the form wiring is greenlit.
8. **Campus visit link** — "How to Reach Campus →".

**UI / layout:** column of full-width bands, generous whitespace. Pathway chooser = horizontal card grid (4 columns desktop / 1-column stack mobile) with a visual "selected" tint (M3 selected state). Decision strip = 4 compact tiles with icon + number. Whole page must render without scroll-triggered reveal on any Firestore-gated block (per the repo's Firestore/reveal gotcha).

### 4.2 Admission Procedure — `/admission-procedure` (tighten; exists)

**Purpose:** the *only* page that explains *how to apply*, per programme route.

**Contents:**
- **Route awareness:** first screen reflects the route chosen on the hub (`?route=` param or session). Default: UG (EAPCET).
- Keep existing tab structure (UG / Lateral / PG / Ph.D.) as the primary navigation on the page — it already maps 1:1 to the pathways.
- **Eligibility + intake always visible** at top of each tab (currently eligibility is inside a collapsible; promote to a plain always-visible block for each route).
- **Numbered step timeline** replacing prose stages, each step with expected duration/timing:
  1. Register & pay application fee
  2. Upload documents (link to checklist)
  3. Counselling / entrance (EAPCET / unit-test / interview, per route)
  4. Seat allotment & confirmation
  5. Reporting & fee payment at campus
- Frequently-asked questions (currently buried in a details block) promoted to a visible FAQ strip.
- **Category A / B footnote** and **institution codes** stay (already dot-normalized).
- End-of-page CTA: *Start your application →* (/apply-now).

**UI / layout:** sticky sub-tabs (or left rail on desktop) so eligibility→steps→documents stay navigable; numbered chevrons for steps; the documents checklist remains Firestore-backed (`contentBlocks` section `admission-procedure/documents`) — renders plainly, no reveal animation on that block.

### 4.3 Programmes & Fee Structure — `/programmes-fee-structure` (tighten; exists)

**Purpose:** cost + intake + route rules. The single source of admission-truth numbers.

**Contents:**
- Intake tables (B.Tech. VISW, B.Tech. VISWPU, M.Tech., MBA, Ph.D.) — keep, already dot-normalized.
- **Promote "Admission rules" to the page's own top** (the 5-route matrix: eligibility checks + seat matrix), so fees and rules live together — removes the need for a separate "Programme Admission Rules" page.
- **Scholarships/fee-concession band** — visible line items per route, not a page.
- Note on VISWPU as a distinct institution in fee/structure context (kept).
- Sticky, slim "Fee + Apply" action: one-line "*Annual fee from ₹—* • *Apply Now*" pinned during scroll on desktop.

**UI / layout:** tables grouped by level into cards with a mini table-of-contents at top (5 anchors). Totals emphasised (bold inline `₹` figures, larger type for annual fee).

### 4.4 Results Analysis — `/result-analysis` (mostly keep)

**Purpose:** proof. Evidence-centered, no navigation-role changes.

**Contents:** existing pass-rate visual + batch selection; success-factor explainer (already Firestore content-block-driven, fetch on route link).
**UI / layout:** chart-first. Stat tiles above the chart (overall pass rate, stream best), prose below. No new sections. Page remains the dedicated "how students fare here" answer.

### 4.5 Apply Now — `/apply-now` (redesign the landing; form stays)

**Purpose:** convert. One job — start an application.

**Contents / sections:**
1. Split hero: left = *what happens next* (3-micro-steps: fill details → one-time OTP verify → counsellor call), right = the form card itself (existing `AdmissionApplyForm`, field-reduced to ≤5 fields up front).
2. **Reassurance strip under the form:** data-safety note, admissions desk phone + email, hours.
3. Programme summary mini-cards (from Firestore `programs`) — "what you're applying to".
4. Existing scaled M.Tech. labels (already dot-normalized) — keep.
5. No other content. This page must stay short.

**UI / layout:** two-column split on desktop (text / form), single column on mobile with form first. Full visual focus on the one CTA inside the form card.

### 4.6 VWUNET — `/vwunet` (unchanged placeholder)

Kept exactly as-is by product decision. Not promoted in the nav; not linked from the Admissions menu. (It can be reachable from content blocks elsewhere if needed later.)

### 4.7 Scholarships & Financial Aid — new section (not a page, for now)

Deliberately **not** a new route in v1 of the redesign — it is a section on the hub + fee page, because a thin standalone page would repeat what those two already cover. If the admin needs a full page later, the section is promoted to `/scholarships-aid` and added to the Admissions menu.

## 5. Design principles for this section

- **One job per page** — a visitor arriving from anywhere never has to choose between "decide / apply / pay / visit" on the same screen.
- **Single dominant CTA** — *Apply Now*; verb-led, primary-styled, repeated at the end of every spoke. No second primary competing on the same screen.
- **≤2 clicks to facts** — eligibility, fees, deadline, and apply are each one click from the hub's decision strip.
- **Journey, not list** — nav order mirrors the applicant's order (overview → apply → fee → procedure → result → visit).
- **Fee transparency** — rupee figures visible on hub, fee page, and apply card; links always labeled with what they are.
- **Consistent hero** — all spokes share `PageHero` defaults ('Admissions' family), only the hub keeps the ability to override via the `banners` collection.
- **Firestore-safety** — every Firestore-backed block (checklist, fees, pass-rate factors, program cards) renders without `.reveal` animations; only static scaffolding (hero text, section labels) may animate.
- **Material 3 tokens** — existing `--color-*`, `--shadow-*`, `--transition-smooth` variables; selected/tinted card states per M3; 48 px touch targets; AA contrast.

## 6. What is already in place (do not redo)

- B.Tech. / M.Tech. dot normalization across all admission pages (`src/lib/academicDegreeNames.ts`, applied).
- `hideCta` on the Admission Procedure hero (no redundant "Explore" CTA on that page) + its `id="admission-procedure-content"` scroll anchor.
- EAPCET code defaults (VISW, VISWPU) via `useEapcetCode`; the fee/eligibility content is otherwise Firestore-driven with the existing content-block fallback behaviour.

## 7. Implementation plan (post-approval)

| # | Task | Files |
|---|---|---|
| 1 | Restructure Admissions nav (add Apply Now, drop portal, keep Results Analysis only here) | `src/components/Header/Header.tsx` |
| 2 | Move Fee Payment Portal to footer Academic Links | `src/components/Footer/Footer.tsx` |
| 3 | Rebuild hub: pathway chooser + decision strip + condensed steps | `src/pages/Admissions/Admissions.tsx` (+ `.css`) |
| 4 | Procedure: promote tabs to rails, numbered timeline, visible eligibility per route | `src/pages/Admissions/AdmissionProcedure.tsx` (+ `.css`) |
| 5 | Fee page: internal TOC, scholarship band, sticky Fee+Apply | `src/pages/Admissions/ProgrammesFee.tsx` (+ `.css`) |
| 6 | Apply landing: split hero + reassurance strip + programme cards | `src/pages/ApplyNow/ApplyNow.tsx` (+ `.css`) |
| 7 | Results Analysis: stat tiles above chart | `src/pages/Admissions/ResultAnalysis.tsx` (+ `.css`) |
| 8 | Optional: hub→apply prefill (`?program=`) | `src/components/AdmissionApplyForm/AdmissionApplyForm.tsx` |
| 9 | Verify: `npx tsc --noEmit` + `npm run build`; manual nav walk-through at all breakpoints | — |

**Out of scope (flagged, not planned):** VWUNET placeholder stays; separate `/scholarships-aid` page not built; NRI/transfer pathway not deep-linked until a source of truth exists.