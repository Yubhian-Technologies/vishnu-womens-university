import { collection, deleteDoc, doc, getDocs, query, setDoc, where } from 'firebase/firestore';
import type { User } from 'firebase/auth';
import { db } from './firebase';

// ── Resource catalog (legacy — Placements only) ─────────────────────────
// Predates the generic per-module `modules` permission map below. Kept as-is
// so BannersAdmin/SitePhotosAdmin/ContentBlocksAdmin's existing scoped
// canEdit() checks (a Placements account editing only Placements' hero
// banners out of every page's banners) keep working unchanged.
export const RESOURCES = {
  PLACEMENTS_HERO_BANNERS: 'placements.heroBanners',
  PLACEMENTS_WEBSITE_PHOTOS: 'placements.websitePhotos',
  PLACEMENTS_PAGE_CONTENT: 'placements.pageContent',
  PLACEMENTS_DOCUMENTS: 'placements.documents',
  PLACEMENTS_GALLERY: 'placements.gallery',
  PLACEMENTS_BLOCKS: 'placements.blocks',
} as const;

export type ResourceKey = (typeof RESOURCES)[keyof typeof RESOURCES];

// ── Roles ────────────────────────────────────────────────────────────────
// 'superadmin' — every module, plus Users & Roles (account/permission
//   management). Falls back to this for any signed-in Firebase Auth user
//   with no `department_users` doc, so the original account keeps working
//   with zero setup.
// 'admin' — every module (same CMS access as superadmin) but can't manage
//   other accounts.
// 'department' | 'placements' | 'rnd' — the three built-in scoped presets
//   requested for department admins / placement office / R&D office logins.
//   Functionally identical to 'custom' (both are driven entirely by the
//   `modules` map below) — kept as distinct labels only so the Users & Roles
//   screen can show a recognizable role name instead of every scoped account
//   just saying "Custom".
// 'custom' — any other admin-defined role.
export type AdminRole = 'superadmin' | 'admin' | 'department' | 'placements' | 'rnd' | 'custom';

export type ModuleLevel = 'read' | 'write';

// ── Session ──────────────────────────────────────────────────────────────
export interface AdminSession {
  uid: string;
  email: string | null;
  department: string;
  role: AdminRole;
  isAdmin: boolean;
  isSuperAdmin: boolean;
  permissions: Record<string, boolean>;
  resources: string[];
  // Section id (see AdminLayout's SECTIONS) -> 'read' | 'write'. Ignored for
  // isAdmin sessions (they implicitly hold 'write' on every module) — only
  // consulted for scoped (department/placements/rnd/custom) sessions.
  modules: Record<string, ModuleLevel>;
}

function superAdminSessionFor(user: User): AdminSession {
  return {
    uid: user.uid,
    email: user.email,
    department: 'Admin',
    role: 'superadmin',
    isAdmin: true,
    isSuperAdmin: true,
    permissions: {},
    resources: [],
    modules: {},
  };
}

// Looks up `department_users` by email (the account's Firebase Auth email
// doubles as its lookup key — no password or secret ever lives in this
// collection). A signed-in user with no matching, active doc is treated as
// the unrestricted Super Admin — this is what keeps the original Admin
// account working exactly as before with zero setup.
export async function resolveAdminSession(user: User): Promise<AdminSession> {
  if (!user.email) return superAdminSessionFor(user);
  try {
    const snap = await getDocs(query(collection(db, 'department_users'), where('email', '==', user.email)));
    const userDoc = snap.docs.find((d) => d.data().active !== false);
    if (!userDoc) return superAdminSessionFor(user);
    const data = userDoc.data();
    const role = (data.role as AdminRole) ?? 'department';
    const isAdmin = role === 'admin';
    return {
      uid: user.uid,
      email: user.email,
      department: data.department ?? userDoc.id,
      role,
      isAdmin,
      isSuperAdmin: false,
      permissions: data.permissions ?? {},
      resources: Array.isArray(data.resources) ? data.resources : [],
      modules: data.modules ?? {},
    };
  } catch {
    // Firestore unreachable — fail closed to the unrestricted Super Admin
    // session rather than locking the real admin out over a transient read error.
    return superAdminSessionFor(user);
  }
}

// Every distinct department name currently provisioned in `department_users`
// (plus the always-available "Admin"), for the login screen's dropdown.
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
// The only place resource/module permissions are ever evaluated. Every CMS
// module should check access through these instead of comparing
// `session.department`/`session.role` directly, so the RBAC rule set stays
// centralised in this one file.

/** True if the session holds the given legacy resource at all. */
export function hasPermission(session: AdminSession | null | undefined, resource: ResourceKey): boolean {
  if (!session) return false;
  if (session.isAdmin) return true;
  return session.resources.includes(resource);
}

/** Same scoping idea as before — see the original comment on this export. */
export function canEdit(session: AdminSession | null | undefined, resource: ResourceKey, scopeOk = true): boolean {
  if (!session) return false;
  if (session.isAdmin) return true;
  return scopeOk && session.resources.includes(resource);
}

export function isReadOnly(session: AdminSession | null | undefined, resource: ResourceKey, scopeOk = true): boolean {
  return !canEdit(session, resource, scopeOk);
}

/** True if the session can at least view the given admin section (sidebar visibility). */
export function canReadModule(session: AdminSession | null | undefined, sectionId: string): boolean {
  if (!session) return false;
  if (session.isAdmin) return true;
  return !!session.modules[sectionId];
}

/** True if the session can edit the given admin section. */
export function canWriteModule(session: AdminSession | null | undefined, sectionId: string): boolean {
  if (!session) return false;
  if (session.isAdmin) return true;
  return session.modules[sectionId] === 'write';
}

// ── Users & Roles management (Super Admin only — see UsersRolesAdmin.tsx) ─
export interface AdminUserDoc {
  id: string;
  email: string;
  department: string;
  role: AdminRole;
  // Admin-typed label shown instead of "Custom Role" wherever this account's
  // role is displayed — only meaningful (and only shown in the form) when
  // role === 'custom'; ignored for the five built-in roles, which already
  // have a fixed name (see ROLE_PRESETS/ROLE_LABELS).
  roleName?: string;
  active: boolean;
  modules: Record<string, ModuleLevel>;
  resources: string[];
}

export async function listAdminUsers(): Promise<AdminUserDoc[]> {
  const snap = await getDocs(collection(db, 'department_users'));
  return snap.docs.map((d) => {
    const data = d.data();
    return {
      id: d.id,
      email: data.email ?? '',
      department: data.department ?? '',
      role: (data.role as AdminRole) ?? 'custom',
      roleName: data.roleName ?? '',
      active: data.active !== false,
      modules: data.modules ?? {},
      resources: Array.isArray(data.resources) ? data.resources : [],
    };
  });
}

/** Creates (id omitted) or updates (id given) an admin user's account/permissions record. Never touches Firebase Auth — the account itself must already exist there (create it in the Firebase Console first, using the same email). */
export async function saveAdminUser(id: string | null, data: Omit<AdminUserDoc, 'id'>): Promise<void> {
  const docId = id || data.email.trim().toLowerCase();
  await setDoc(doc(db, 'department_users', docId), data);
}

/**
 * Creates a brand-new admin login end to end: the actual Firebase Auth
 * sign-in (email + password, via createFirebaseAuthAccount's secondary-app
 * trick so it doesn't disturb the Super Admin's own session) plus its
 * `department_users` permissions record. `auth/email-already-in-use` is
 * treated as non-fatal (the sign-in already exists — just [re]write the
 * permissions record for it) so re-adding a Firebase Auth account created
 * outside this screen still works.
 */
export async function createAdminLogin(email: string, password: string, data: Omit<AdminUserDoc, 'id' | 'email'>): Promise<void> {
  const { createFirebaseAuthAccount } = await import('./firebaseAdmin');
  try {
    await createFirebaseAuthAccount(email, password);
  } catch (e) {
    if ((e as { code?: string }).code !== 'auth/email-already-in-use') throw e;
  }
  await saveAdminUser(null, { ...data, email });
}

export async function deleteAdminUser(id: string): Promise<void> {
  await deleteDoc(doc(db, 'department_users', id));
}

// ── Role presets (Users & Roles "New User" form) ────────────────────────
// Departments Admin / Placements Login / R&D Login are the three built-in
// scoped roles asked for alongside Super Admin/Admin/fully-custom — each
// just a starting `modules` selection an admin can still hand-adjust.
// R&D and Placements both currently live as tabs/fields inside the single
// "Academic Departments" module (see DepartmentsAdmin.tsx) rather than their
// own admin sections, so granting either preset grants that whole module —
// there's no way yet to scope down to just its R&D or Placements tab within
// that shared form.
export const ROLE_PRESETS: { role: AdminRole; label: string; modules: string[] }[] = [
  // 'admin' already gets every module via the isAdmin bypass (see
  // canReadModule/canWriteModule above) regardless of `modules`, so this
  // preset doesn't need — and deliberately avoids — importing the full
  // SECTIONS list here, which would create a circular import with
  // AdminLayout.tsx (SECTIONS lives there; AdminLayout also imports rbac.ts).
  { role: 'admin', label: 'Admin — full CMS access', modules: [] },
  { role: 'department', label: 'Departments Admin', modules: ['departments', 'programs', 'faculty', 'curriculum'] },
  { role: 'placements', label: 'Placements Login', modules: ['placements', 'placement-items', 'tpo-team-info', 'placement-crt-docs', 'tpo-team-photos', 'ilo-office-photos', 'recruiter-logos', 'gsac-photos', 'departments'] },
  { role: 'rnd', label: 'R&D Login', modules: ['research-items', 'departments'] },
  { role: 'custom', label: 'Custom Role', modules: [] },
];
