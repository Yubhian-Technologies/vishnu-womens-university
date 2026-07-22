// Fallback content for the Consultancy item, sourced from
// https://svecw.edu.in/consultancy-2/. Firestore's researchItems doc for
// this slug may not have its accordionText field filled in yet from the
// admin panel — this constant is used by ResearchDetail.tsx so the page
// renders the full year-by-year list out of the box instead of staying
// blank until someone pastes it in manually. Once an admin does fill in the
// Firestore field, that value takes over (see ResearchDetail.tsx).
//
// Each year links to a PDF hosted locally under public/downloads/ (not the
// original svecw.edu.in URL) so clicking it downloads the file directly from
// our own site instead of navigating elsewhere.
export const DEFAULT_CONSULTANCY_TEXT = `### 2023-24
Click Here to download | /downloads/Consultancy2023-24.pdf
### 2022-23
Click Here to download | /downloads/Consultancy2022-23.pdf
### 2021-22
Click Here to download | /downloads/Consultancy2021-22.pdf
### 2020-21
Click Here to download | /downloads/Consultancy2020-21.pdf`;
