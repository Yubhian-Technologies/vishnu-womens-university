// Shared by every admin section that edits one Firestore doc through a big
// local `form` object loaded once when "Edit" is clicked (ProgramsAdmin,
// DifferentiatorsAdmin, DepartmentsAdmin, ...). Saving used to always spread
// the *entire* form into updateDoc(), which silently reverts whatever
// anyone else (or you, in another tab) saved on that same doc in the
// meantime, since it overwrites every field with this session's now-stale
// copy — not just the one(s) actually edited here.
//
// diffChangedFields reduces a save down to just the top-level fields that
// differ from a snapshot taken at edit-start (see each admin's
// `originalForm`), so updateDoc() only ever touches what this session
// actually changed.
export function diffChangedFields<T extends Record<string, unknown>>(current: T, original: T): Partial<T> {
  const changed: Partial<T> = {};
  for (const key of Object.keys(current) as (keyof T)[]) {
    if (JSON.stringify(current[key]) !== JSON.stringify(original[key])) {
      changed[key] = current[key];
    }
  }
  return changed;
}
