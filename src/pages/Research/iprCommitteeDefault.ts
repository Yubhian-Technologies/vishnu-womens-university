// Fallback content for the IPR Committee item's Overview section.
// Firestore's researchItems doc for this slug already has a short one-line
// intro — this constant is used by ResearchDetail.tsx so the page renders
// the fuller committee description and Key Objectives list out of the box.
// DEFAULT_IPR_INTRO takes priority over the existing (shorter) item.intro;
// DEFAULT_IPR_ABOUT fills in item.about, which is currently empty (see
// ResearchDetail.tsx).
export const DEFAULT_IPR_INTRO = `The Intellectual Property Rights (IPR) Committee at Shri Vishnu Engineering College for Women (Vishnu Womens University), Bhimavaram, is committed to encourage innovation and creativity while safeguarding individual intellectual property across all research and academic endeavors. Recognizing the significance of intellectual property in driving economic growth, technological advancement, and societal progress, the IPR Committee plays a pivotal role in promoting a culture of innovation and entrepreneurship within our institution.`;

export const DEFAULT_IPR_ABOUT = `The committee comprises experts in intellectual property law, technology transfer, innovation management, and industry collaboration. The IPR Committee serves as a strategic advisor and facilitator in matters related to intellectual property rights and commercialization.

## Key Objectives of the Intellectual Property Rights Committee:
- IPR Policy Formulation and Implementation: The IPR Committee is responsible for formulating comprehensive intellectual property rights policies that align with the institutional objectives. This policy governs the identification, protection, ownership, and commercialization of intellectual property generated within the institution.
- Promotion of Innovation and Technology Transfer: The IPR Committee actively promotes innovation, technology transfer, and commercialization of research outcomes by facilitating collaborations between academia and industry. Through strategic partnerships and licensing agreements, the committee aims to maximize the societal impact and economic value of intellectual property assets.
- IPR Awareness and Education: The IPR Committee conducts awareness programs, workshops, and training sessions to educate researchers, faculty, and students about the importance of intellectual property rights, patents, copyrights, trademarks, and trade secrets. These initiatives aim to foster a culture of respect for intellectual property and encourage researchers to protect and leverage their innovative ideas and creations.
- IPR Management and Support Services: The IPR Committee provides guidance, assistance, and support to researchers in navigating the intellectual property landscape, including patent filing, copyright registration, licensing negotiations, and commercialization strategies.
- Compliance and Legal Oversight: The committee provides legal counsel and assistance in resolving disputes related to intellectual property ownership, infringement, and licensing agreements.
- MoU Partnerships: The IPR Committee facilitates the establishment of Memoranda of Understanding (MoU) with industry partners, research institutions, and government agencies to enhance collaborative research and technology transfer efforts.`;
