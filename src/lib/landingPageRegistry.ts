import { lazy } from 'react';
import { PHOTO_NEEDED_PLACEHOLDER } from './photoPlaceholder';

// A calmer, brand-toned placeholder (soft diagonal ink-to-green gradient,
// no icon/caption) for image slots where an obvious "Photo Needed" card
// would undercut an otherwise-finished editorial layout — e.g. Campus Life,
// which is meant to read as art-directed even before real photography is
// uploaded. Self-hosted inline SVG, same reasoning as PHOTO_NEEDED_PLACEHOLDER
// (never 404s), just visually quieter.
const NEUTRAL_IMAGE_PLACEHOLDER =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='800' height='600'%3E%3Cdefs%3E%3ClinearGradient id='g' x1='0' y1='0' x2='1' y2='1'%3E%3Cstop offset='0%25' stop-color='%23081c15'/%3E%3Cstop offset='100%25' stop-color='%232d6a4f'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='800' height='600' fill='url(%23g)'/%3E%3C/svg%3E";

// A landing page's admin-editable image slots. `home` (the original
// homepage) has none here — its photos are already managed entirely by the
// existing Website Photos admin section, untouched by this feature.
export interface LandingPageImageSlot {
  key: string;
  label: string;
  defaultUrl: string;
  aspect?: number;
}

// Admin-editable video slots (Firebase Storage-backed, uploaded via
// VideoUploader in LandingPagesAdmin). `posterSlotKey`, when set, points at
// an imageSlots key whose image is used as the <video poster> / fallback
// while no video has been uploaded yet (or on browsers/connections where
// video playback is skipped).
export interface LandingPageVideoSlot {
  key: string;
  label: string;
  posterSlotKey?: string;
}

export interface LandingPageRegistryEntry {
  id: string;
  fallbackName: string;
  fallbackDescription: string;
  fallbackPreviewImage: string;
  component: React.LazyExoticComponent<() => React.ReactElement>;
  imageSlots?: LandingPageImageSlot[];
  videoSlots?: LandingPageVideoSlot[];
}

// The single place a landing page's existence is declared in code. Adding a
// future landing page means: build its page component, add one entry here
// (plus a Firestore doc — auto-seeded by LandingPagesAdmin on first load) —
// nothing in App.tsx, the admin section, or the public loader ever changes.
export const LANDING_PAGE_REGISTRY: LandingPageRegistryEntry[] = [
  {
    id: 'home',
    fallbackName: 'Landing Page 1 — Classic',
    fallbackDescription: 'The original VWU homepage.',
    fallbackPreviewImage: 'https://images.unsplash.com/photo-1607237138185-eedd9c632b0b?w=800&q=80',
    component: lazy(() => import('../pages/Home/Home')),
  },
  {
    id: 'premium',
    fallbackName: 'Landing Page 2 — Premium',
    fallbackDescription: 'Modern, premium homepage inspired by LPU’s layout and interactions.',
    fallbackPreviewImage: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&q=80',
    component: lazy(() => import('../pages/LandingPremium/LandingPremium')),
    imageSlots: [
      { key: 'hero', label: 'Hero Photo', defaultUrl: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1200&q=80', aspect: 3 / 4 },
      { key: 'highlights-main', label: 'Highlights — Main Story Photo', defaultUrl: 'https://images.unsplash.com/photo-1523580494863-6f3031224c94?w=1400&q=80', aspect: 16 / 9 },
      { key: 'highlights-card-1', label: 'Highlights — Card 1 (Recognition)', defaultUrl: 'https://images.unsplash.com/photo-1607237138185-eedd9c632b0b?w=700&q=80', aspect: 4 / 3 },
      { key: 'highlights-card-2', label: 'Highlights — Card 2 (Event)', defaultUrl: 'https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=700&q=80', aspect: 4 / 3 },
      { key: 'ecosystem-1', label: 'Campus Ecosystem — Student Clubs', defaultUrl: 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?w=1000&q=80', aspect: 4 / 3 },
      { key: 'ecosystem-2', label: 'Campus Ecosystem — Hostels', defaultUrl: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=1000&q=80', aspect: 4 / 3 },
      { key: 'ecosystem-3', label: 'Campus Ecosystem — AR/VR Studio', defaultUrl: 'https://images.unsplash.com/photo-1592478411213-6153e4ebc07d?w=1000&q=80', aspect: 4 / 3 },
      { key: 'ecosystem-4', label: 'Campus Ecosystem — Incubator', defaultUrl: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1000&q=80', aspect: 4 / 3 },
      { key: 'research-photo', label: 'Research Spotlight Photo', defaultUrl: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=900&q=80', aspect: 4 / 3 },
      { key: 'gallery-1', label: 'Spotlight Gallery — Photo 1', defaultUrl: 'https://images.unsplash.com/photo-1498243691581-b145c3f54a5a?w=800&q=80', aspect: 4 / 3 },
      { key: 'gallery-2', label: 'Spotlight Gallery — Photo 2', defaultUrl: 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=800&q=80', aspect: 4 / 3 },
      { key: 'gallery-3', label: 'Spotlight Gallery — Photo 3', defaultUrl: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=800&q=80', aspect: 4 / 3 },
      { key: 'gallery-4', label: 'Spotlight Gallery — Photo 4', defaultUrl: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&q=80', aspect: 4 / 3 },
      { key: 'gallery-5', label: 'Spotlight Gallery — Photo 5', defaultUrl: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&q=80', aspect: 4 / 3 },
      { key: 'gallery-6', label: 'Spotlight Gallery — Photo 6', defaultUrl: 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?w=800&q=80', aspect: 4 / 3 },
      { key: 'campus-experience', label: 'Campus Experience — Aerial Photo', defaultUrl: 'https://images.unsplash.com/photo-1498243691581-b145c3f54a5a?w=1600&q=80', aspect: 21 / 9 },
    ],
  },
  {
    id: 'editorial',
    fallbackName: 'Landing Page 3 — Editorial',
    fallbackDescription: "Vishnu Women's University — Editorial University Experience",
    fallbackPreviewImage: PHOTO_NEEDED_PLACEHOLDER,
    component: lazy(() => import('../pages/LandingEditorial/LandingEditorial')),
    // Self-hosted "Photo Needed" placeholders (no external hotlinks) —
    // every image on this page is admin-uploaded from a clean slate rather
    // than shipping with unrelated stock photography standing in for VWU's
    // actual campus.
    imageSlots: [
      { key: 'hero', label: 'Hero — Full-bleed Photo/Video Poster', defaultUrl: PHOTO_NEEDED_PLACEHOLDER, aspect: 16 / 9 },
      { key: 'about', label: 'About — University Story Photo', defaultUrl: PHOTO_NEEDED_PLACEHOLDER, aspect: 4 / 5 },
      { key: 'campus-aerial', label: 'Campus Aerial — Full-bleed Photo/Video Poster', defaultUrl: PHOTO_NEEDED_PLACEHOLDER, aspect: 16 / 9 },
      { key: 'research-feature', label: 'Research — Feature Photo', defaultUrl: PHOTO_NEEDED_PLACEHOLDER, aspect: 4 / 5 },
      { key: 'research-spotlight', label: 'Research — Spotlight Video Poster', defaultUrl: PHOTO_NEEDED_PLACEHOLDER, aspect: 4 / 3 },
      { key: 'campus-life-hero', label: 'Campus Life — Large Feature Photo', defaultUrl: NEUTRAL_IMAGE_PLACEHOLDER, aspect: 16 / 9 },
      { key: 'campus-life-story1', label: 'Campus Life — Student Clubs Photo', defaultUrl: NEUTRAL_IMAGE_PLACEHOLDER, aspect: 4 / 5 },
      { key: 'campus-life-story2', label: 'Campus Life — Hostel Life Photo', defaultUrl: NEUTRAL_IMAGE_PLACEHOLDER, aspect: 16 / 10 },
      { key: 'campus-life-story3', label: 'Campus Life — Sports & Fitness Photo', defaultUrl: NEUTRAL_IMAGE_PLACEHOLDER, aspect: 3 / 4 },
      { key: 'stories-student', label: 'University Stories — Student Success', defaultUrl: PHOTO_NEEDED_PLACEHOLDER, aspect: 4 / 3 },
      { key: 'stories-faculty', label: 'University Stories — Faculty Achievement', defaultUrl: PHOTO_NEEDED_PLACEHOLDER, aspect: 4 / 3 },
      { key: 'stories-research', label: 'University Stories — Research Breakthrough', defaultUrl: PHOTO_NEEDED_PLACEHOLDER, aspect: 4 / 3 },
      { key: 'stories-entrepreneurship', label: 'University Stories — Entrepreneurship', defaultUrl: PHOTO_NEEDED_PLACEHOLDER, aspect: 4 / 3 },
      { key: 'stories-community', label: 'University Stories — Community Impact', defaultUrl: PHOTO_NEEDED_PLACEHOLDER, aspect: 4 / 3 },
      { key: 'community', label: 'Community & Social Impact Photo', defaultUrl: PHOTO_NEEDED_PLACEHOLDER, aspect: 4 / 5 },
      { key: 'final-cinematic', label: 'Closing Cinematic — Full-bleed Photo/Video Poster', defaultUrl: PHOTO_NEEDED_PLACEHOLDER, aspect: 16 / 9 },
    ],
    videoSlots: [
      { key: 'hero', label: 'Hero — Background Video', posterSlotKey: 'hero' },
      { key: 'campus-aerial', label: 'Campus Aerial — Full-bleed Video (after News)', posterSlotKey: 'campus-aerial' },
      { key: 'research-spotlight', label: 'Research — Spotlight Video', posterSlotKey: 'research-spotlight' },
      { key: 'final-cinematic', label: 'Closing Cinematic Video (before footer)', posterSlotKey: 'final-cinematic' },
    ],
  },
];

export const DEFAULT_LANDING_PAGE_ID = 'home';
