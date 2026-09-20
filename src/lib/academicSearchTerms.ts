// Hardcoded "mini search engine" for the hero search bar — courses,
// programs, schools and departments only. Deliberately NOT driven by live
// Firestore data: admin-entered `shortName`/`shortCode` fields are
// inconsistent (often blank, or spelled differently per record), so a
// fuzzy match against them was unreliable — typing "aiml" found nothing
// even though the AI & ML program exists. This file is the authoritative,
// hand-verified list of every department/program someone is likely to type
// a code or short term for, each pointing at its real route.
//
// Source of truth for department shortCodes/program slugs:
// src/lib/departmentGroups.ts (DEPARTMENT_GROUPS / STANDALONE_DEPARTMENTS) —
// keep this file in sync with that one if a program slug ever changes there.
//
// Add a new entry here whenever a new program/department is added that
// people would reasonably search for by code or synonym — this list is not
// meant to be exhaustive on day one, just correct for what's in it.

export interface AcademicSearchEntry {
  title: string;
  path: string;
  /** Short codes/abbreviations typed verbatim — "aiml", "cse", "vlsi"... */
  codes: string[];
  /** Longer search phrases/synonyms — "computer science", "machine learning"... */
  terms: string[];
}

export const ACADEMIC_SEARCH_TERMS: AcademicSearchEntry[] = [
  // ── AI Department (grouped — /academics/ai-ds opens the shared department
  //    view with a toggle between its two programs; see departmentGroups.ts) ──
  { title: 'Artificial Intelligence Department', path: '/academics/ai-ds', codes: ['ai'], terms: ['artificial intelligence department'] },
  { title: 'B.Tech CSE — AI & Data Science', path: '/academics/ai-ds', codes: ['aids', 'ai&ds'], terms: ['artificial intelligence and data science', 'ai and data science', 'data science'] },
  { title: 'B.Tech CSE — AI & Machine Learning', path: '/academics/ai-ml', codes: ['aiml', 'ai&ml'], terms: ['artificial intelligence and machine learning', 'ai and machine learning', 'machine learning'] },

  // ── CSE Department ──
  { title: 'Computer Science & Engineering', path: '/academics/cse', codes: ['cse'], terms: ['computer science', 'computer science and engineering', 'computer science engineering'] },
  { title: 'Cyber Security', path: '/academics/cyber-security', codes: ['cyber'], terms: ['cyber security', 'cybersecurity', 'information security'] },
  { title: 'M.Tech Computer Science & Engineering', path: '/academics/mtech-cse', codes: ['mtechcse'], terms: ['mtech computer science', 'm.tech cse'] },
  { title: 'M.Tech Software Engineering', path: '/academics/mtech-software-engineering', codes: ['mtechse'], terms: ['software engineering', 'm.tech software engineering'] },

  // ── ECE Department ──
  { title: 'Electronics & Communication Engineering', path: '/academics/ece', codes: ['ece'], terms: ['electronics and communication engineering', 'electronics communication'] },
  { title: 'Electronics & VLSI Technology', path: '/academics/EVT', codes: ['evt'], terms: ['electronics and vlsi technology'] },
  { title: 'M.Tech VLSI Design', path: '/academics/mtech-vlsi', codes: ['vlsi', 'mtechvlsi'], terms: ['vlsi design', 'very large scale integration'] },

  // ── Mechanical ──
  { title: 'Mechanical Engineering', path: '/academics/me', codes: ['me', 'mech'], terms: ['mechanical engineering'] },

  // ── EEE Department ──
  { title: 'Electrical & Electronics Engineering', path: '/academics/eee', codes: ['eee'], terms: ['electrical and electronics engineering', 'electrical engineering'] },
  { title: 'M.Tech Power Electronics', path: '/academics/mtech-power-electronics', codes: ['mtechpe'], terms: ['power electronics'] },

  // ── Civil Department ──
  { title: 'Civil Engineering', path: '/academics/ce', codes: ['ce'], terms: ['civil engineering'] },
  { title: 'M.Tech Structural Engineering', path: '/academics/mtech-structural-engineering', codes: ['mtechstructural'], terms: ['structural engineering'] },

  // ── IT Department ──
  { title: 'Information Technology', path: '/academics/IT', codes: ['it'], terms: ['information technology'] },

  // ── MBA ──
  { title: 'MBA', path: '/academics/mba', codes: ['mba'], terms: ['master of business administration', 'business administration'] },

  // ── Freshman Engineering (standalone, no programs of their own) ──
  { title: 'Mathematics', path: '/academics/mathematics', codes: ['maths', 'math'], terms: ['mathematics department'] },
  { title: 'Physics', path: '/academics/physics', codes: ['phy'], terms: ['physics department'] },
  { title: 'Chemistry', path: '/academics/chemistry', codes: ['chem'], terms: ['chemistry department'] },
  { title: 'English', path: '/academics/english', codes: [], terms: ['english department', 'communication skills'] },

  // ── General Academics navigation ──
  { title: 'All Programs', path: '/academics/programs', codes: [], terms: ['programs', 'courses', 'all courses', 'degree programs'] },
  { title: 'Academic Departments', path: '/academics/departments', codes: [], terms: ['departments'] },
  { title: 'Schools', path: '/academics/schools', codes: [], terms: ['schools'] },
  { title: 'Curriculum Matrix', path: '/academics/curriculum', codes: [], terms: ['curriculum', 'syllabus structure'] },
  { title: 'Academic Downloads', path: '/academics/downloads', codes: [], terms: ['syllabus', 'timetable', 'academic calendar download'] },
  { title: 'Freshman Engineering', path: '/academics/freshman-engineering', codes: ['fe'], terms: ['first year engineering'] },
  { title: 'Faculty Directory', path: '/faculty', codes: [], terms: ['faculty', 'professors', 'teachers'] },
];

// Strips everything but letters/digits and lowercases — "AI & ML", "ai-ml"
// and "AIML" all normalize to "aiml", so a code/term match doesn't depend
// on the exact punctuation/spacing someone types.
function normalize(s: string): string {
  return s.toLowerCase().replace(/[^a-z0-9]/g, '');
}

/**
 * Resolves a typed query to a single best entry, or undefined if nothing in
 * this hardcoded list matches. Checked in order of confidence: an exact code
 * match wins outright (so "aiml" can't be shadowed by a looser match on
 * something else), then an exact term match, then a substring match either
 * direction (query inside a title/term, or a short code inside the query).
 */
export function findAcademicMatch(query: string): AcademicSearchEntry | undefined {
  const q = normalize(query);
  if (!q) return undefined;

  const exactCode = ACADEMIC_SEARCH_TERMS.find((e) => e.codes.some((c) => normalize(c) === q));
  if (exactCode) return exactCode;

  const exactTerm = ACADEMIC_SEARCH_TERMS.find((e) => e.terms.some((t) => normalize(t) === q));
  if (exactTerm) return exactTerm;

  return ACADEMIC_SEARCH_TERMS.find((e) =>
    normalize(e.title).includes(q) ||
    e.terms.some((t) => normalize(t).includes(q) || q.includes(normalize(t))) ||
    e.codes.some((c) => q.includes(normalize(c)))
  );
}
