// Fallback content for the Research Publications item, sourced from
// https://svecw.edu.in/research-publications/. Firestore's researchItems
// doc for this slug may not have its accordionText field filled in yet from
// the admin panel — this constant is used by ResearchDetail.tsx so the page
// renders the full year-by-year list out of the box instead of staying
// blank until someone pastes it in manually. Once an admin does fill in the
// Firestore field, that value takes over (see ResearchDetail.tsx).
//
// Each year links to a PDF hosted locally under public/downloads/ (not the
// original svecw.edu.in URL) so clicking it downloads the file directly from
// our own site instead of navigating elsewhere.
export const DEFAULT_RESEARCH_PUBLICATIONS_TEXT = `### 2025
Click Here to download | /downloads/ResearchPublications2025.pdf
### 2024
Click Here to download | /downloads/ResearchPublications2024.pdf
### 2023
Click Here to download | /downloads/ResearchPublications2023.pdf
### 2022
Click Here to download | /downloads/ResearchPublications2022.pdf
### 2021
Click Here to download | /downloads/ResearchPublications2021.pdf
### 2020
Click Here to download | /downloads/ResearchPublications2020.pdf`;
