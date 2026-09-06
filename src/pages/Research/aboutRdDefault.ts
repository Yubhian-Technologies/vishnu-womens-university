// Fallback content for the About R&D item's "Research Team" table — one
// continuous S.No table: Dean R&D, Functional Coordinator, then the
// per-department R&D Coordinators. Firestore's researchItems doc for this
// slug still holds the older governance-team table; once an admin updates
// that field to match, it takes over (see ResearchDetail.tsx).
export const DEFAULT_ABOUT_RD_TABLE_TEXT = `S.No | Name | Role
1 | Dr. G R L V N Srinivasa Raju | Professor & Dean R&D
2 | Dr. G. Durga Prasad | Professor & Functional Coordinator - R&D
3 | Dr. Anuj Rapaka | Asst. Professor, Department of Computer Science & Engineering
4 | Dr. N D S S Kiran Relangi | Asst. Professor, Department of Information & Technology
5 | Mr. D V H Venu Kumar | Asst. Professor, Department of Artificial Intelligence
6 | Dr. B. Murali Krishna | Asst. Professor, Department of Electronics & Communication Engineering
7 | Dr. K Kalyan Sagar | Assoc. Professor, Department of Electrical & Electronics Engineering
8 | Dr. K.Benarji | Asst. Professor, Department of Mechanical Engineering
9 | Mr. N Hari pavan | Asst. Professor, Department of Civil Engineering
10 | Dr. Potula Sree Brahmanandam | Professor, Department of Basic Science
11 | Dr. M. Karthik | Assoc. Professor, Department of Management Studies`;
