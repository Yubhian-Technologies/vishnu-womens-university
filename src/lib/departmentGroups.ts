// The single source of truth for the three "grouped" academic departments —
// AI, CSE and ECE — each of which contains two programs that share their
// overview, HOD, faculty and laboratories, and differ only in curriculum and
// their News & Events feed.
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

// Slugs verified against the live `programs` collection. Note EVT's slug is
// uppercase. `facultyDepartments` verified against the `faculty` collection.
export const DEPARTMENT_GROUPS: DepartmentGroup[] = [
  { key: 'ai', deptShortCode: 'AI', programSlugs: ['ai-ds', 'ai-ml'], facultyDepartments: ['AI&DS', 'AI&ML'] },
  { key: 'cse', deptShortCode: 'CSE', programSlugs: ['cse', 'cyber-security'], facultyDepartments: ['CSE'] },
  { key: 'ece', deptShortCode: 'ECE', programSlugs: ['ece', 'EVT'], facultyDepartments: ['ECE'] },
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
