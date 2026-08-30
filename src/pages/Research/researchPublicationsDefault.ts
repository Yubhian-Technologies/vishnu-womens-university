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
Click Here to download | https://firebasestorage.googleapis.com/v0/b/vishnu-womens-university.firebasestorage.app/o/downloads%2FResearchPublications2025.pdf?alt=media&token=9279ec3b-db19-475a-bdd9-0d71228f5ab1
### 2024
Click Here to download | https://firebasestorage.googleapis.com/v0/b/vishnu-womens-university.firebasestorage.app/o/downloads%2FResearchPublications2024.pdf?alt=media&token=0f30bc83-c733-4fc3-9aee-e0ecf9c6050e
### 2023
Click Here to download | https://firebasestorage.googleapis.com/v0/b/vishnu-womens-university.firebasestorage.app/o/downloads%2FResearchPublications2023.pdf?alt=media&token=eee41f5b-de38-4fa7-b353-0bd6dd7a79cd
### 2022
Click Here to download | https://firebasestorage.googleapis.com/v0/b/vishnu-womens-university.firebasestorage.app/o/downloads%2FResearchPublications2022.pdf?alt=media&token=35247590-f3d9-4559-b4ae-38abc0417789
### 2021
Click Here to download | https://firebasestorage.googleapis.com/v0/b/vishnu-womens-university.firebasestorage.app/o/downloads%2FResearchPublications2021.pdf?alt=media&token=5c4864a0-6f64-4f18-97a2-19a1e8df77d2
### 2020
Click Here to download | https://firebasestorage.googleapis.com/v0/b/vishnu-womens-university.firebasestorage.app/o/downloads%2FResearchPublications2020.pdf?alt=media&token=5a53a264-7edd-4ff5-8867-dcbf529fb851`;
