// Fallback content for the About R&D item. Firestore's researchItems doc for
// this slug already has a tableText value for the R&D governance team (the
// unnamed first section below, reproduced as-is) but doesn't yet list the
// per-department R&D Coordinators — this constant is used by
// ResearchDetail.tsx so the page renders both tables out of the box instead
// of only the governance team until someone pastes the same text into the
// admin panel. Once an admin does fill in the Firestore field, that value
// takes over (see ResearchDetail.tsx).
export const DEFAULT_ABOUT_RD_TABLE_TEXT = `S.No | Name | Role
1 | Dr. G. Srinivasa Rao | Principal & Professor
2 | Prof. P. Venkata Rama Raju | Vice-Principal & Professor
3 | Dr. G R L V N Srinivasa Raju | Professor & Dean R&D
4 | Dr. G. Durga Prasad | Professor & Institute R&D Coordinator

## Department Coordinators
Name | Designation | Department
Dr. R. Anuj | Asst. Professor | Department of Computer Science & Engineering
Mr. K. Dileep Kumar | Asst. Professor | Department of Information & Technology
Dr. P. S. Charani | Professor | Department of Artificial Intelligence
Dr. R. Sahoo | Assoc. Professor | Department of Electronics & Communication Engineering
Dr. K Kalyan Sagar | Assoc. Professor | Department of Electrical & Electronics Engineering
Dr. B N Malleswara Rao | Assoc. Professor | Department of Mechanical Engineering
Mr. N Haripavan | Asst. Professor | Department of Civil Engineering
Dr. P. S. Brahmanandam | Professor | Department of Basic Science
Dr. M. Karthik | Assoc. Professor | Department of Management Studies`;
