// Audit trail for every admin write.
//
// Admin sections import addDoc / setDoc / updateDoc / deleteDoc / writeBatch
// from THIS module instead of 'firebase/firestore'. Each one has the same
// signature as the Firebase original and does exactly the same write — it just
// also records (in the `auditLogs` collection) who made the change, where
// (admin section + document), what changed, and what each changed field held
// BEFORE the write.
//
// Guarantees:
//  - Auditing never blocks or breaks a save: the "before" read is time-boxed
//    and every audit step is wrapped, so a failure there only logs a console
//    warning and the real write still goes through exactly as before.
//  - Before/after values are stored as JSON *strings* (not nested maps), so
//    Firestore's nested-array / field-name restrictions can never reject an
//    audit entry that the real write itself was allowed to make.
//  - Public-site form submissions don't use this module and aren't logged.
import {
  addDoc as fsAddDoc,
  setDoc as fsSetDoc,
  updateDoc as fsUpdateDoc,
  deleteDoc as fsDeleteDoc,
  writeBatch as fsWriteBatch,
  getDoc,
  doc,
  collection,
  serverTimestamp,
  type CollectionReference,
  type DocumentData,
  type DocumentReference,
  type FieldPath,
  type Firestore,
  type SetOptions,
  type UpdateData,
  type WithFieldValue,
  type WriteBatch,
} from 'firebase/firestore';
import { db } from './firebase';

export const AUDIT_COLLECTION = 'auditLogs';

export type AuditAction = 'create' | 'update' | 'delete';

export interface AuditChange {
  field: string;
  /** JSON text of the value before the write, or null if the field didn't exist. */
  before: string | null;
  /** JSON text of the value after the write, or null if the field was removed. */
  after: string | null;
}

export interface AuditEntry {
  createdAtMs: number;
  actorEmail: string;
  actorUid: string;
  actorRole: string;
  actorDepartment: string;
  action: AuditAction;
  /** Admin section id (the `?section=` of the admin URL), e.g. 'faculty'. */
  section: string;
  collection: string;
  docId: string;
  docPath: string;
  /** Best-effort human title of the document (name / title / text …). */
  docLabel: string;
  changes: AuditChange[];
  truncated?: boolean;
}

// ── Who is making the change ────────────────────────────────────────────
interface AuditActor {
  uid: string;
  email: string;
  role: string;
  department: string;
}

let currentActor: AuditActor | null = null;

export function setAuditActor(actor: AuditActor | null) {
  currentActor = actor;
}

// ── Value serialisation ─────────────────────────────────────────────────
const MAX_STRING = 3000;
const MAX_VALUE_JSON = 20000;
const MAX_TOTAL_JSON = 600000;
const REMOVED = '⟨field removed⟩';

function sentinelLabel(name: string): string {
  if (name === 'deleteField') return REMOVED;
  if (name === 'serverTimestamp') return '⟨server time⟩';
  return `⟨${name}⟩`;
}

/** Converts any Firestore value into plain JSON-safe data. */
function toPlain(v: unknown, depth = 0): unknown {
  if (v === undefined) return undefined;
  if (v === null || typeof v === 'boolean' || typeof v === 'number') return v;
  if (typeof v === 'string') {
    return v.length > MAX_STRING ? `${v.slice(0, MAX_STRING)}… (+${v.length - MAX_STRING} more characters)` : v;
  }
  if (typeof v === 'bigint') return v.toString();
  if (depth > 12) return '[…]';
  if (typeof v !== 'object') return String(v);
  const o = v as Record<string, unknown>;
  if (Array.isArray(v)) return v.map((x) => toPlain(x, depth + 1) ?? null);
  if (typeof o._methodName === 'string') return sentinelLabel(o._methodName);
  if (typeof o.toDate === 'function' && typeof o.seconds === 'number') {
    try { return (o.toDate as () => Date).call(o).toISOString(); } catch { return '[timestamp]'; }
  }
  if (typeof o.path === 'string' && typeof o.id === 'string' && 'firestore' in o) return `ref:${o.path}`;
  if (typeof o.latitude === 'number' && typeof o.longitude === 'number') return { latitude: o.latitude, longitude: o.longitude };
  if (typeof o.toUint8Array === 'function' || v instanceof Uint8Array) return '[binary data]';
  const out: Record<string, unknown> = {};
  for (const [k, val] of Object.entries(o)) {
    const p = toPlain(val, depth + 1);
    if (p !== undefined) out[k] = p;
  }
  return out;
}

function stringify(v: unknown): string | null {
  if (v === undefined) return null;
  let s = JSON.stringify(v);
  if (s === undefined) return null;
  if (s.length > MAX_VALUE_JSON) s = JSON.stringify(`${s.slice(0, MAX_VALUE_JSON)}… [truncated]`);
  return s;
}

function getPath(obj: Record<string, unknown> | undefined, path: string): unknown {
  if (!obj) return undefined;
  if (path in obj) return obj[path];
  let cur: unknown = obj;
  for (const part of path.split('.')) {
    if (cur && typeof cur === 'object' && part in (cur as Record<string, unknown>)) {
      cur = (cur as Record<string, unknown>)[part];
    } else return undefined;
  }
  return cur;
}

function sameValue(a: unknown, b: unknown): boolean {
  return JSON.stringify(a) === JSON.stringify(b);
}

function buildChange(field: string, beforeVal: unknown, afterVal: unknown): AuditChange | null {
  const afterIsRemoval = afterVal === REMOVED;
  if (afterIsRemoval && beforeVal === undefined) return null;
  if (!afterIsRemoval && afterVal !== undefined && sameValue(beforeVal, afterVal)) return null;
  return {
    field,
    before: stringify(beforeVal),
    after: afterIsRemoval || afterVal === undefined ? null : stringify(afterVal),
  };
}

// ── Reading the "before" state ──────────────────────────────────────────
type Plain = Record<string, unknown>;

/** Current doc data (plain) or null if missing / unreadable. Time-boxed so a
 *  slow or offline read can never hold a save up. */
async function readBefore(ref: DocumentReference<DocumentData>): Promise<{ data: Plain | null; ok: boolean }> {
  try {
    const snap = await Promise.race([
      getDoc(ref),
      new Promise<null>((resolve) => setTimeout(() => resolve(null), 4000)),
    ]);
    if (!snap) return { data: null, ok: false };
    return { data: snap.exists() ? (toPlain(snap.data()) as Plain) : null, ok: true };
  } catch {
    return { data: null, ok: false };
  }
}

const LABEL_KEYS = ['name', 'title', 'label', 'heading', 'question', 'studentName', 'company', 'text', 'department', 'email', 'batch', 'year', 'category'];

function labelFor(...sources: (Plain | null | undefined)[]): string {
  for (const src of sources) {
    if (!src) continue;
    for (const k of LABEL_KEYS) {
      const v = src[k];
      if (typeof v === 'string' && v.trim()) return v.trim().slice(0, 120);
    }
  }
  return '';
}

function sectionNow(): string {
  try {
    return new URLSearchParams(window.location.search).get('section') || 'overview';
  } catch {
    return 'overview';
  }
}

// ── Diff builders ───────────────────────────────────────────────────────
function diffUpdate(before: Plain | null, patch: Record<string, unknown>): AuditChange[] {
  const changes: AuditChange[] = [];
  for (const [field, raw] of Object.entries(patch)) {
    const c = buildChange(field, getPath(before ?? undefined, field), toPlain(raw));
    if (c) changes.push(c);
  }
  return changes;
}

/** Normalises updateDoc's two call shapes ((data) or (field, value, …)) to one patch object. */
function patchFromArgs(args: unknown[]): Record<string, unknown> {
  if (args.length === 1 && args[0] && typeof args[0] === 'object') return args[0] as Record<string, unknown>;
  const patch: Record<string, unknown> = {};
  for (let i = 0; i + 1 < args.length; i += 2) {
    const f = args[i];
    patch[typeof f === 'string' ? f : (f as FieldPath).toString()] = args[i + 1];
  }
  return patch;
}

function diffSet(before: Plain | null, data: Record<string, unknown>, merge: boolean): AuditChange[] {
  const after = toPlain(data) as Plain;
  const changes: AuditChange[] = [];
  const keys = new Set(Object.keys(after));
  if (!merge && before) Object.keys(before).forEach((k) => keys.add(k));
  for (const field of keys) {
    const c = buildChange(field, before?.[field], field in after ? after[field] : REMOVED);
    if (c) changes.push(c);
  }
  return changes;
}

function diffDelete(before: Plain | null): AuditChange[] {
  if (!before) return [];
  return Object.entries(before).map(([field, val]) => ({ field, before: stringify(val), after: null }));
}

// ── Writing the audit entry ─────────────────────────────────────────────
interface PendingLog {
  action: AuditAction;
  ref: DocumentReference<DocumentData>;
  changes: AuditChange[];
  label: string;
}

function buildEntry(p: PendingLog, section: string): Record<string, unknown> {
  let total = 0;
  let truncated = false;
  const kept: AuditChange[] = [];
  for (const c of p.changes) {
    const size = (c.before?.length ?? 0) + (c.after?.length ?? 0) + c.field.length;
    if (total + size > MAX_TOTAL_JSON) { truncated = true; break; }
    total += size;
    kept.push(c);
  }
  const path = p.ref.path;
  const actor = currentActor;
  return {
    createdAt: serverTimestamp(),
    createdAtMs: Date.now(),
    actorEmail: actor?.email ?? 'unknown',
    actorUid: actor?.uid ?? '',
    actorRole: actor?.role ?? '',
    actorDepartment: actor?.department ?? '',
    action: p.action,
    section,
    collection: path.split('/').slice(0, -1).join('/'),
    docId: p.ref.id,
    docPath: path,
    docLabel: p.label,
    changes: kept,
    ...(truncated ? { truncated: true } : {}),
  };
}

function isAuditPath(ref: DocumentReference<DocumentData>): boolean {
  return ref.path.startsWith(`${AUDIT_COLLECTION}/`);
}

async function writeLogs(logs: PendingLog[]) {
  try {
    const section = sectionNow();
    const entries = logs.filter((l) => !isAuditPath(l.ref) && l.changes.length > 0).map((l) => buildEntry(l, section));
    if (entries.length === 0) return;
    if (entries.length === 1) {
      await fsAddDoc(collection(db, AUDIT_COLLECTION), entries[0]);
      return;
    }
    for (let i = 0; i < entries.length; i += 400) {
      const batch = fsWriteBatch(db);
      entries.slice(i, i + 400).forEach((e) => batch.set(fsDocRef(), e));
      await batch.commit();
    }
  } catch (e) {
    console.warn('[audit] could not record audit entry:', e);
  }
}

function fsDocRef() {
  return doc(collection(db, AUDIT_COLLECTION));
}

// ── Audited drop-in replacements ────────────────────────────────────────
export async function addDoc<AppModelType, DbModelType extends DocumentData>(
  reference: CollectionReference<AppModelType, DbModelType>,
  data: WithFieldValue<AppModelType>
): Promise<DocumentReference<AppModelType, DbModelType>> {
  const ref = await fsAddDoc(reference, data);
  try {
    const after = toPlain(data) as Plain;
    const changes = Object.entries(after).map(([field, val]) => ({ field, before: null, after: stringify(val) }));
    void writeLogs([{ action: 'create', ref: ref as unknown as DocumentReference<DocumentData>, changes, label: labelFor(after) }]);
  } catch (e) {
    console.warn('[audit] addDoc:', e);
  }
  return ref;
}

export async function setDoc<AppModelType, DbModelType extends DocumentData>(
  reference: DocumentReference<AppModelType, DbModelType>,
  data: WithFieldValue<AppModelType>
): Promise<void>;
export async function setDoc<AppModelType, DbModelType extends DocumentData>(
  reference: DocumentReference<AppModelType, DbModelType>,
  data: WithFieldValue<AppModelType>,
  options: SetOptions
): Promise<void>;
export async function setDoc(reference: unknown, data: unknown, options?: SetOptions): Promise<void> {
  const ref = reference as DocumentReference<DocumentData>;
  const fsSet = fsSetDoc as (r: unknown, d: unknown, o?: SetOptions) => Promise<void>;
  let before: Awaited<ReturnType<typeof readBefore>> = { data: null, ok: false };
  if (!isAuditPath(ref)) before = await readBefore(ref);
  await (options ? fsSet(reference, data, options) : fsSet(reference, data));
  try {
    const merge = !!(options && ('merge' in options ? options.merge : 'mergeFields' in options));
    const plain = data as unknown as Record<string, unknown>;
    const changes = diffSet(before.data, plain, merge);
    // Without a readable "before" we can't claim which fields changed — fall
    // back to listing every written field as the new value.
    const finalChanges = before.ok ? changes : Object.entries(toPlain(plain) as Plain).map(([field, val]) => ({ field, before: null, after: stringify(val) }));
    void writeLogs([{
      action: before.ok && before.data ? 'update' : 'create',
      ref,
      changes: finalChanges,
      label: labelFor(toPlain(plain) as Plain, before.data),
    }]);
  } catch (e) {
    console.warn('[audit] setDoc:', e);
  }
}

export async function updateDoc<AppModelType, DbModelType extends DocumentData>(
  reference: DocumentReference<AppModelType, DbModelType>,
  data: UpdateData<DbModelType>
): Promise<void>;
export async function updateDoc(
  reference: DocumentReference<unknown, DocumentData>,
  field: string | FieldPath,
  value: unknown,
  ...moreFieldsAndValues: unknown[]
): Promise<void>;
export async function updateDoc(reference: unknown, ...args: unknown[]): Promise<void> {
  const ref = reference as DocumentReference<DocumentData>;
  const before = isAuditPath(ref) ? { data: null, ok: false } : await readBefore(ref);
  await (fsUpdateDoc as (r: unknown, ...a: unknown[]) => Promise<void>)(reference, ...args);
  try {
    const patch = patchFromArgs(args);
    const changes = before.ok
      ? diffUpdate(before.data, patch)
      : Object.entries(patch).map(([field, val]) => ({ field, before: null, after: stringify(toPlain(val)) }));
    void writeLogs([{ action: 'update', ref, changes, label: labelFor(before.data, toPlain(patch) as Plain) }]);
  } catch (e) {
    console.warn('[audit] updateDoc:', e);
  }
}

export async function deleteDoc(reference: DocumentReference<unknown, DocumentData>): Promise<void> {
  const ref = reference as unknown as DocumentReference<DocumentData>;
  const before = isAuditPath(ref) ? { data: null, ok: false } : await readBefore(ref);
  await fsDeleteDoc(reference);
  try {
    void writeLogs([{
      action: 'delete',
      ref,
      // A doc that was already gone has nothing to record.
      changes: before.ok ? diffDelete(before.data) : [],
      label: labelFor(before.data),
    }]);
  } catch (e) {
    console.warn('[audit] deleteDoc:', e);
  }
}

// ── Batched writes ──────────────────────────────────────────────────────
type BatchOp =
  | { kind: 'set'; ref: DocumentReference<DocumentData>; data: Record<string, unknown>; merge: boolean }
  | { kind: 'update'; ref: DocumentReference<DocumentData>; patch: Record<string, unknown> }
  | { kind: 'delete'; ref: DocumentReference<DocumentData> };

/** Same API as Firestore's WriteBatch; on commit() it also records one audit
 *  entry per document written. */
export class AuditedWriteBatch {
  private inner: WriteBatch;
  private ops: BatchOp[] = [];

  constructor(firestore: Firestore) {
    this.inner = fsWriteBatch(firestore);
  }

  set<AppModelType, DbModelType extends DocumentData>(
    reference: DocumentReference<AppModelType, DbModelType>,
    data: WithFieldValue<AppModelType>
  ): AuditedWriteBatch;
  set<AppModelType, DbModelType extends DocumentData>(
    reference: DocumentReference<AppModelType, DbModelType>,
    data: WithFieldValue<AppModelType>,
    options: SetOptions
  ): AuditedWriteBatch;
  set(reference: DocumentReference<never, never>, data: never, options?: SetOptions): AuditedWriteBatch {
    if (options) this.inner.set(reference, data, options);
    else this.inner.set(reference, data);
    const merge = !!(options && ('merge' in options ? options.merge : 'mergeFields' in options));
    this.ops.push({ kind: 'set', ref: reference as unknown as DocumentReference<DocumentData>, data: data as unknown as Record<string, unknown>, merge });
    return this;
  }

  update<AppModelType, DbModelType extends DocumentData>(
    reference: DocumentReference<AppModelType, DbModelType>,
    data: UpdateData<DbModelType>
  ): AuditedWriteBatch;
  update(
    reference: DocumentReference<unknown, DocumentData>,
    field: string | FieldPath,
    value: unknown,
    ...moreFieldsAndValues: unknown[]
  ): AuditedWriteBatch;
  update(reference: DocumentReference<never, never>, ...args: unknown[]): AuditedWriteBatch {
    (this.inner.update as (r: unknown, ...a: unknown[]) => WriteBatch)(reference, ...args);
    this.ops.push({ kind: 'update', ref: reference as unknown as DocumentReference<DocumentData>, patch: patchFromArgs(args) });
    return this;
  }

  delete(reference: DocumentReference<unknown, DocumentData>): AuditedWriteBatch {
    this.inner.delete(reference);
    this.ops.push({ kind: 'delete', ref: reference as unknown as DocumentReference<DocumentData> });
    return this;
  }

  async commit(): Promise<void> {
    const ops = this.ops;
    this.ops = [];
    // Snapshot every touched doc's current state first (in parallel, in
    // chunks so a 400-doc bulk delete doesn't open 400 reads at once).
    const befores = new Map<string, Awaited<ReturnType<typeof readBefore>>>();
    try {
      const refs = [...new Map(ops.filter((o) => !isAuditPath(o.ref)).map((o) => [o.ref.path, o.ref])).values()];
      for (let i = 0; i < refs.length; i += 25) {
        const chunk = refs.slice(i, i + 25);
        const res = await Promise.all(chunk.map((r) => readBefore(r)));
        chunk.forEach((r, j) => befores.set(r.path, res[j]));
      }
    } catch (e) {
      console.warn('[audit] batch pre-read:', e);
    }

    await this.inner.commit();

    try {
      // Ops are applied in order, so a doc touched twice diffs against the
      // state left by its previous op, not the pre-batch snapshot.
      const logs: PendingLog[] = [];
      for (const op of ops) {
        const b = befores.get(op.ref.path) ?? { data: null, ok: false };
        const state = b.data;
        if (op.kind === 'delete') {
          logs.push({ action: 'delete', ref: op.ref, changes: b.ok ? diffDelete(state) : [], label: labelFor(state) });
          befores.set(op.ref.path, { data: null, ok: b.ok });
        } else if (op.kind === 'update') {
          const changes = b.ok
            ? diffUpdate(state, op.patch)
            : Object.entries(op.patch).map(([field, val]) => ({ field, before: null, after: stringify(toPlain(val)) }));
          logs.push({ action: 'update', ref: op.ref, changes, label: labelFor(state, toPlain(op.patch) as Plain) });
          if (b.ok && state) {
            const next = { ...state };
            for (const c of changes) next[c.field] = c.after === null ? undefined : JSON.parse(c.after);
            befores.set(op.ref.path, { data: next, ok: true });
          }
        } else {
          const afterPlain = toPlain(op.data) as Plain;
          const changes = b.ok
            ? diffSet(state, op.data, op.merge)
            : Object.entries(afterPlain).map(([field, val]) => ({ field, before: null, after: stringify(val) }));
          logs.push({ action: b.ok && state ? 'update' : 'create', ref: op.ref, changes, label: labelFor(afterPlain, state) });
          befores.set(op.ref.path, { data: op.merge && state ? { ...state, ...afterPlain } : afterPlain, ok: true });
        }
      }
      void writeLogs(logs);
    } catch (e) {
      console.warn('[audit] batch log:', e);
    }
  }
}

export function writeBatch(firestore: Firestore): AuditedWriteBatch {
  return new AuditedWriteBatch(firestore);
}
