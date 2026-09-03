# Vishnu Women's University (VWU) Web Platform

A modern, responsive, high-performance web platform and Content Management System (CMS) for Vishnu Women's University built with **React**, **TypeScript**, **Vite**, and **Firebase Firestore / Storage**.

---

## 🎨 Google UI & Material Design 3 Principles

The VWU web platform adheres to **Google UI Design Principles** and the **Material Design 3 (M3 / Material You)** framework to deliver an elegant, fast, and accessible user experience.

### Core Design Pillars
- **Focus on the User**: Clear visual hierarchy, intuitive navigation, and instant information discovery across academic programs, admissions, placements, and campus life.
- **Radical Simplicity & Visual Delight**: Curated color palette (`#1b4332` Forest Green brand identity paired with `#C9A84C` Warm Gold accents), Product Sans typography, and clean surface layering.
- **Tonal Elevation & State Layers**: Subtle depth achieved through surface tinting (`--color-off-white`, `--color-light-gray`) and smooth elevation shadows rather than harsh borders.
- **Responsive & Adaptive Layouts**: Seamlessly scalable across compact mobile (bottom sheets / drawer navigation), tablet rails, and desktop 12-column grid containers.
- **Performance as a Feature**: Fast Core Web Vitals (<2.5s LCP, <200ms INP), smooth CSS cubic-bezier transitions (`600ms cubic-bezier(0.4, 0, 0.2, 1)`), and robust skeleton/optimistic loading patterns.

> 📖 **Full Architectural Report**: See [docs/google-ui-design-principles.md](docs/google-ui-design-principles.md) for the complete design system and specification guidelines.

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm / yarn / pnpm

### Installation & Development
```bash
# Install dependencies
npm install

# Start Vite local development server
npm run dev

# Run TypeScript type check and production build
npm run build

# Preview production build locally
npm run preview
```

---

## 🏗️ Architecture Overview

- **Routing**: `react-router-dom` with `@/` path alias mapped to `src/`.
- **Public Site vs. Admin Split**:
  - `/` → `PublicApp` (Public marketing pages, header, footer, dynamic academic explorer).
  - `/admin/*` → `AdminLayout` (Role-gated CMS powered by Firebase Auth, Firestore real-time queries, and storage uploader).
- **Styling Architecture**: Co-located Vanilla CSS modules paired with global design tokens in `src/styles/variables.css` and `src/styles/global.css`.
- **Backend & Database**: Firebase Firestore (live data subscriptions via custom React hooks `useCollection` & `useDocument`) and Firebase Cloud Storage for high-resolution media.

---

## 📂 Project Structure

```
vishnu-womens-university/
├── docs/                             # Documentation & Design Reports
│   ├── google-ui-design-principles.md # Complete Google UI & M3 Design Guide
│   └── uncommitted-changes.md        # Branch work log
├── public/                           # Static assets, fonts, icons
├── src/
│   ├── assets/                       # Images, logos, media
│   ├── components/                   # Reusable UI components (PageHero, Header, Footer, ImageUploader...)
│   ├── hooks/                        # Custom Firestore hooks (useCollection, useDocument, usePageBanner)
│   ├── lib/                          # Firebase config, storage helpers, icon resolvers
│   ├── pages/                        # Public pages (Home, Academics, Placements, Governance, etc.)
│   │   └── Admin/                    # CMS Admin Portal & Data Managers
│   ├── styles/                       # Design tokens (variables.css) & base styles (global.css)
│   ├── App.tsx                       # Main router & app layout entry
│   └── main.tsx                      # Root DOM mounting
├── CLAUDE.md                         # LLM & Claude Code agent guidelines
├── vite.config.ts                    # Vite build configuration
└── package.json                      # Dependencies and scripts
```

---

## 📜 Documentation Links
- [Google UI / Material 3 Design Principles Report](docs/google-ui-design-principles.md)
- [Agent & Claude Engineering Guide](CLAUDE.md)
