import { collection, getDocs, query, where } from 'firebase/firestore';
import type { User } from 'firebase/auth';
import { db } from './firebase';

// ── Resource catalog ─────────────────────────────────────────────────────
// The single source of truth for every editable CMS "resource" a
// department account can be granted. A department's Firestore doc
// (see `department_users` below) lists which of these keys it holds —
// adding a future department never requires adding a new key here unless
// that department needs a genuinely new kind of resource.
export const RESOURCES = {
  PLACEMENTS_HERO_BANNERS: 'placements.heroBanners',
  PLACEMENTS_WEBSITE_PHOTOS: 'placements.websitePhotos',
  PLACEMENTS_PAGE_CONTENT: 'placements.pageContent',
  PLACEMENTS_DOCUMENTS: 'placements.documents',
  PLACEMENTS_GALLERY: 'placements.gallery',
  PLACEMENTS_BLOCKS: 'placements.blocks',
} as const;

export type ResourceKey = (typeof RESOURCES)[keyof typeof RESOURCES];

// ── Session ──────────────────────────────────────────────────────────────
export interface AdminSession {
  uid: string;
  email: string | null;
  department: string;
  role: 'admin' | 'department';
  isAdmin: boolean;
  permissions: Record<string, boolean>;
  resources: string[];
}

function adminSessionFor(user: User): AdminSession {
  return {
    uid: user.uid,
    email: user.email,
    department: 'Admin',
    role: 'admin',
    isAdmin: true,
    permissions: {},
    resources: [],
  };
}

// Looks up `department_users` by email (the account's Firebase Auth email
// doubles as its lookup key — no password or secret ever lives in this
// collection). A signed-in user with no matching, active department doc is
// treated as the existing, unrestricted Admin — this is what keeps the
// original Admin account working exactly as before with zero setup.
export async function resolveAdminSession(user: User): Promise<AdminSession> {
  if (!user.email) return adminSessionFor(user);
  try {
    const snap = await getDocs(query(collection(db, 'department_users'), where('email', '==', user.email)));
    const deptDoc = snap.docs.find((d) => d.data().active !== false);
    if (!deptDoc) return adminSessionFor(user);
    const data = deptDoc.data();
    return {
      uid: user.uid,
      email: user.email,
      department: data.department ?? deptDoc.id,
      role: (data.role as AdminSession['role']) ?? 'department',
      isAdmin: false,
      permissions: data.permissions ?? {},
      resources: Array.isArray(data.resources) ? data.resources : [],
    };
  } catch {
    // Firestore unreachable — fail closed to the unrestricted Admin session
    // rather than locking the real Admin out over a transient read error.
    return adminSessionFor(user);
  }
}

// Every distinct department name currently provisioned in `department_users`
// (plus the always-available "Admin"), for the login screen's dropdown.
// Reading this list live means adding a new department is purely a data
// change — creating a Firebase Auth user and a Firestore document — with no
// change to this file or any component.
export async function listDepartments(): Promise<string[]> {
  try {
    const snap = await getDocs(collection(db, 'department_users'));
    const names = snap.docs
      .map((d) => d.data())
      .filter((d) => d.active !== false)
      .map((d) => d.department as string)
      .filter((name): name is string => typeof name === 'string' && name.length > 0);
    return Array.from(new Set(names));
  } catch {
    return [];
  }
}

// ── Permission helpers ───────────────────────────────────────────────────
// The only place resource permissions are ever evaluated. Every CMS module
// should check access through these instead of comparing `session.department`
// directly, so the RBAC rule set stays centralised in this one file.

/** True if the session holds the given resource at all (ignoring any extra scope check). */
export function hasPermission(session: AdminSession | null | undefined, resource: ResourceKey): boolean {
  if (!session) return false;
  if (session.isAdmin) return true;
  return session.resources.includes(resource);
}

/**
 * True if the session may edit the given resource. `scopeOk` lets a caller
 * narrow a broad resource to the specific item being rendered — e.g. a Hero
 * Banner resource is only actually editable for banners whose `page` is one
 * of the Placements pages, even though the admin's Hero Banners section
 * itself covers every page on the site. Defaults to true for resources that
 * aren't further scoped.
 */
export function canEdit(session: AdminSession | null | undefined, resource: ResourceKey, scopeOk = true): boolean {
  if (!session) return false;
  if (session.isAdmin) return true;
  return scopeOk && session.resources.includes(resource);
}

export function isReadOnly(session: AdminSession | null | undefined, resource: ResourceKey, scopeOk = true): boolean {
  return !canEdit(session, resource, scopeOk);
}
