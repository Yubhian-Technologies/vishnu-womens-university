// The single source of truth for the "grouped" academic departments — AI,
// CSE, ECE and Mechanical — each of which shares its overview, HOD, faculty
// and laboratories across its program(s), differing only in curriculum and
// News & Events. (ECE has three: B.Tech ECE, B.Tech EVT, and M.Tech VLSI —
// the toggle and every per-programme section below it already render
// generically for any number of programSlugs. Mechanical currently has just
// one program, so the toggle collapses to a single entry — it's grouped
// anyway so its department page matches the same "About / Vision & Mission /
// About HOD / Faculty / Laboratories / Choose a Programme / R & D /
// Placements / News & Events" quick-links layout as the others.)
//
// A program slug listed here makes /academics/<slug> render the grouped
// DepartmentDetail view (with that slug as the active toggle) instead of the
// standalone ProgramDetail. Every other program slug is unaffected.
//
// NOTE: `programSlugs` MUST match the real `slug` values in the `programs`
// Firestore collection (Admin -> Programs). This file is the only place to
// change if a slug differs or a future department needs grouping.

export interface DepartmentGroup {
  /** Internal key, e.g. 'ai' | 'cse' | 'ece'. */
  key: string;
  /** Matches the `shortCode` of the department's `departments` doc. */
  deptShortCode: string;
  /** Ordered program slugs; [0] is the default when opening from the department card. */
  programSlugs: string[];
  /**
   * `faculty` docs whose `department` is one of these belong to this department.
   * Needed because the two programs share one faculty list but their own
   * `department` fields don't line up with the faculty tags (e.g. the AI
   * programs are `department: "AI"` while faculty are tagged "AI&ML" / "AI&DS").
   */
  facultyDepartments: string[];
}

/**
 * A department with NO programs of its own (e.g. Freshman Engineering's
 * Mathematics/Physics/Chemistry/English — foundation subjects every
 * engineering student takes, not a degree any one of them grants). There's
 * no program slug to route through the way DEPARTMENT_GROUPS above does, so
 * `slug` is the literal /academics/<slug> segment that opens
 * StandaloneDepartmentDetail.tsx directly for this department instead.
 */
export interface StandaloneDepartment {
  key: string;
  /** Matches the `shortCode` of the department's `departments` doc. */
  deptShortCode: string;
  /** The /academics/<slug> URL segment. */
  slug: string;
  /** Same purpose as DepartmentGroup.facultyDepartments above. */
  facultyDepartments: string[];
}

export const STANDALONE_DEPARTMENTS: StandaloneDepartment[] = [
  { key: 'fe-mathematics', deptShortCode: 'Mathematics', slug: 'mathematics', facultyDepartments: ['Mathematics'] },
  { key: 'fe-physics', deptShortCode: 'Physics', slug: 'physics', facultyDepartments: ['Physics'] },
  { key: 'fe-chemistry', deptShortCode: 'Chemistry', slug: 'chemistry', facultyDepartments: ['Chemistry'] },
  { key: 'fe-english', deptShortCode: 'English', slug: 'english', facultyDepartments: ['English'] },
];

/** The standalone department a given /academics/<slug> URL segment opens, or undefined for a normal program/grouped-department slug. */
export function standaloneDepartmentForSlug(slug?: string): StandaloneDepartment | undefined {
  if (!slug) return undefined;
  return STANDALONE_DEPARTMENTS.find((d) => d.slug === slug);
}

// Slugs verified against the live `programs` collection. Note EVT's slug is
// uppercase. `facultyDepartments` verified against the `faculty` collection.
export const DEPARTMENT_GROUPS: DepartmentGroup[] = [
  { key: 'ai', deptShortCode: 'AI', programSlugs: ['ai-ds', 'ai-ml'], facultyDepartments: ['AI&DS', 'AI&ML'] },
  { key: 'cse', deptShortCode: 'CSE', programSlugs: ['cse', 'cyber-security', 'mtech-cse', 'mtech-software-engineering'], facultyDepartments: ['CSE'] },
  { key: 'ece', deptShortCode: 'ECE', programSlugs: ['ece', 'EVT', 'mtech-vlsi'], facultyDepartments: ['ECE'] },
  { key: 'mechanical', deptShortCode: 'ME', programSlugs: ['me'], facultyDepartments: ['Mechanical', 'ME'] },
  // Single-program departments grouped purely to get the same
  // DepartmentDetail.tsx page (About / Vision & Mission / HOD / Faculty /
  // Laboratories / R&D / Placements / News & Events) as the others above,
  // same reasoning as Mechanical — the "Choose a Programme" toggle just
  // collapses to a single entry. facultyDepartments lists a couple of
  // plausible variants defensively (matches this file's existing pattern);
  // if a department's `faculty` docs use a different `department` tag,
  // its Faculty section will simply stay hidden until that's corrected here.
  { key: 'eee', deptShortCode: 'EEE', programSlugs: ['eee'], facultyDepartments: ['EEE', 'Electrical & Electronics Engineering'] },
  { key: 'ce', deptShortCode: 'CE', programSlugs: ['ce'], facultyDepartments: ['CE', 'Civil', 'Civil Engineering'] },
  { key: 'it', deptShortCode: 'IT', programSlugs: ['IT'], facultyDepartments: ['IT', 'Information Technology'] },
  { key: 'mba', deptShortCode: 'MBA', programSlugs: ['mba'], facultyDepartments: ['MBA', 'Management Studies'] },
];

/** Every program slug that belongs to a grouped department. */
export const GROUPED_PROGRAM_SLUGS = new Set(
  DEPARTMENT_GROUPS.flatMap((g) => g.programSlugs)
);

/** The group a given program slug belongs to, or undefined for a normal program. */
export function groupForProgramSlug(slug?: string): DepartmentGroup | undefined {
  if (!slug) return undefined;
  return DEPARTMENT_GROUPS.find((g) => g.programSlugs.includes(slug));
}

/** The group whose department card carries the given `shortCode`. */
export function groupForDeptShortCode(code?: string): DepartmentGroup | undefined {
  if (!code) return undefined;
  const norm = code.trim().toUpperCase();
  return DEPARTMENT_GROUPS.find((g) => g.deptShortCode.toUpperCase() === norm);
}
