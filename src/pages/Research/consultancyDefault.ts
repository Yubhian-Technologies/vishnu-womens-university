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
Click Here to download | https://firebasestorage.googleapis.com/v0/b/vishnu-womens-university.firebasestorage.app/o/downloads%2FConsultancy2023-24.pdf?alt=media&token=07c99ffe-2ec2-47d0-8b88-e764a978a6e4
### 2022-23
Click Here to download | https://firebasestorage.googleapis.com/v0/b/vishnu-womens-university.firebasestorage.app/o/downloads%2FConsultancy2022-23.pdf?alt=media&token=a869d6c1-44b6-49e7-ae75-8d7e4c94b28d
### 2021-22
Click Here to download | https://firebasestorage.googleapis.com/v0/b/vishnu-womens-university.firebasestorage.app/o/downloads%2FConsultancy2021-22.pdf?alt=media&token=f91dda70-94ad-4036-8417-e59d8455de58
### 2020-21
Click Here to download | https://firebasestorage.googleapis.com/v0/b/vishnu-womens-university.firebasestorage.app/o/downloads%2FConsultancy2020-21.pdf?alt=media&token=a62af289-4452-4c1a-b705-96da8899501e`;
