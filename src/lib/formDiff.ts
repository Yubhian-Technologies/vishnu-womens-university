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
// Turns a raw save error into something an admin (not a developer) can
// actually act on. Firestore's own messages are technical enough to look
// broken/scary in a plain alert() ("Function updateDoc() called with
// invalid data. Unsupported field value: undefined (found in document
// departments/...)") even though the fix is usually just "try again" — this
// recognizes the couple of error shapes that actually occur here and gives
// each a one-sentence explanation, falling back to the raw message (still
// shown, just appended) for anything unrecognized so nothing is hidden from
// someone who does need the detail.
export function describeSaveError(e: unknown): string {
  const message = e instanceof Error ? e.message : String(e);
  if (/unsupported field value: undefined/i.test(message)) {
    return "Couldn't save: one of the fields had no value to save (a leftover empty field, not something you did wrong). This has been fixed — please try saving again.";
  }
  if (/permission[- ]denied/i.test(message)) {
    return "Couldn't save: you don't have permission to edit this. Try signing out and back in, or check with an admin.";
  }
  if (/network|offline|unavailable/i.test(message)) {
    return "Couldn't save: no connection to the server. Check your internet connection and try again.";
  }
  return `Couldn't save. ${message}`;
}

export function diffChangedFields<T extends Record<string, unknown>>(current: T, original: T): Partial<T> {
  const changed: Partial<T> = {};
  for (const key of Object.keys(current) as (keyof T)[]) {
    // Firestore's updateDoc() rejects `undefined` outright (use deleteField()
    // to actually clear a field, which nothing here does) — a field that's
    // undefined on `current` almost always means "never set" rather than
    // "just cleared", e.g. an `a || b` fallback chain where both sides are
    // unset. Skipping it here is what keeps a stray undefined from crashing
    // the whole save instead of just that one field silently not writing.
    if (current[key] === undefined) continue;
    if (JSON.stringify(current[key]) !== JSON.stringify(original[key])) {
      changed[key] = current[key];
    }
  }
  return changed;
}
