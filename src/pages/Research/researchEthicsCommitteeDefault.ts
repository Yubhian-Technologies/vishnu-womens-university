// Fallback content for the Research Ethics Committee item's Overview
// section. Firestore's researchItems doc for this slug already has a short
// one-line intro — this constant is used by ResearchDetail.tsx so the page
// renders the fuller committee description and Key Objectives list out of
// the box. DEFAULT_REC_INTRO takes priority over the existing (shorter)
// item.intro; DEFAULT_REC_ABOUT fills in item.about, which is currently
// empty (see ResearchDetail.tsx).
export const DEFAULT_REC_INTRO = `The Research Ethics Committee (REC) at Shri Vishnu Engineering College for Women (A), (Vishnu Women's University) Bhimavaram is a vital body committed to upholding the highest standards of ethical conduct in research practices across all disciplines. Recognizing the paramount importance of ethical considerations in research, the REC serves as a cornerstone in ensuring the integrity, credibility, and societal impact of our institution's research endeavors.`;

export const DEFAULT_REC_ABOUT = `Comprising esteemed members representing diverse academic disciplines, professional backgrounds, and ethical expertise, the REC functions as a vigilant guardian, overseeing and guiding research activities to ensure adherence to ethical principles.

## Key Objectives of the Research Ethics Committee:
- Review of Ethical compliance of Research Proposals: The REC meticulously reviews research proposals to assess the ethical implications of the proposed studies. The REC monitors of ongoing research projects to ensure compliance with ethical guidelines, regulations, and institutional policies throughout the research lifecycle.
- Training on Research Ethics: The REC conducts educational programs, workshops, and training sessions to raise awareness among researchers, faculty, and students about ethical principles, responsible conduct of research, and best practices in research ethics.
- Resolution of Ethical Concerns: In cases of ethical concerns or disputes arising during the course of research activities, the REC serves as a resource for consultation, and resolution, promoting fair and ethical practices in research.
- Promotion of Research Integrity: Upholding research integrity and fostering a culture of ethical conduct are central to the mission of the REC. The committee actively promotes honesty, transparency, and accountability in all aspects of research endeavors.
- Plagiarism Check and Software Availability: The REC facilitates necessary tools for researchers and provides access to these tools and assist researchers in ensuring the originality and integrity of their work, thereby upholding academic honesty and integrity.`;
