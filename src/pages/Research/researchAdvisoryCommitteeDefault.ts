// Fallback content for the Research Advisory Committee item's Overview
// section. Firestore's researchItems doc for this slug already has a short
// one-line intro — this constant is used by ResearchDetail.tsx so the page
// renders the fuller committee description and Key Objectives list out of
// the box. DEFAULT_RAC_INTRO takes priority over the existing (shorter)
// item.intro; DEFAULT_RAC_ABOUT fills in item.about, which is currently
// empty (see ResearchDetail.tsx).
export const DEFAULT_RAC_INTRO = `The Research Advisory Committee (RAC) at Shri Vishnu Engineering College for Women (A) (Vishnu Womens University), Bhimavaram is a pivotal body dedicated to fostering and enhancing research endeavors across various disciplines. Recognizing the significance of research in academic excellence and societal advancement and impact, the RAC plays a vital role in guiding, supporting, and promoting research activities within our institution.`;

export const DEFAULT_RAC_ABOUT = `Comprising distinguished members from diverse academic backgrounds and professional expertise, the RAC functions as a strategic think tank, providing valuable insights and recommendations to uphold the highest standards of research integrity and innovation. The committee diligently works towards aligning research initiatives with the institutional vision and Mission, thereby contributing to the enhancement of academic excellence and research culture.

## Key Objectives of the Research Advisory Committee:
- Advise on Research Policies and Strategies: The RAC provides guidance on the formulation and implementation of research policies, strategies, and initiatives to meet the institution's research objectives.
- Promote Interdisciplinary Research Collaborations: Facilitating interdisciplinary collaborations and partnerships is a core focus of the RAC, fostering synergies across departments and research centers to address complex challenges and derive impactful research outcomes.
- Ensure Research Quality and Ethical Standards: Ensuring research integrity and upholding ethical standards are of utmost importance. The RAC plays a pivotal role in ensuring adherence to ethical guidelines, promoting responsible conduct of research, and enhancing research quality through rigorous review mechanisms. The committee actively seeks input from the Research Ethics Committee to ensure that ethical considerations are thoroughly addressed and upheld throughout the research process.
- Support Research Funding and Grants: The RAC assists researchers in identifying external funding opportunities, securing research grants, and optimizing resources to facilitate cutting-edge research projects and initiatives. The Institute also provide Seed grant to kick-start innovative research endeavours.
- Consultancy Opportunities: The RAC promotes consultancy opportunities for researchers to collaborate with industries and other organizations, facilitating knowledge exchange and real-world application of research findings.
- Enhance Research Infrastructure and Facilities: In support of a conducive research environment, the RAC actively promotes the enhancement of research infrastructure, facilities, and resources. This ensures that researchers have access to cutting-edge equipment, laboratories, and technological platforms, fostering innovation and excellence in their work.
- Incentives: The committee offers incentives for publications, patents and External Funded Projects, recognizing and rewarding researchers for their scholarly contributions and intellectual property achievements.`;
