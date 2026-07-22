// Fallback content for the Research Centers item, sourced from
// https://svecw.edu.in/research-centers/. Firestore's researchItems doc for
// this slug may not have its tableText field filled in yet from the admin
// panel — this constant is used by ResearchDetail.tsx so the page renders
// the full recognition/renewal and guides/scholars tables out of the box
// instead of staying blank until someone pastes the same text into the
// admin panel. Once an admin does fill in the Firestore field, that value
// takes over (see ResearchDetail.tsx).
export const DEFAULT_RESEARCH_CENTERS_TABLE_TEXT = `## Recognition & Validity
Department | Year of Recognition & Validity | First Renewal | Second Renewal
Electronics and Communication Engineering | 2019-20 & 2020-21 | 2021-22 & 2022-23 | 2023-24 & 2024-25
Electrical and Electronics Engineering | 2019-20 & 2020-21 | 2021-22 & 2022-23 | 2023-24 & 2024-25
Computer Science Engineering | 2019-20 & 2020-21 | 2021-22 & 2022-23 | 2023-24 & 2024-25

## Research Guides and Scholars
Department | No. of Guides | No. of Scholars
ECE | 7 | 13
EEE | 2 | 3
CSE | 4 | 12
AI | 2 | 4
ME | 1 | 1
BS | 1 | 2
Total | 17 | 35`;
