// Fallback content for the About IQAC item, sourced from
// https://svecw.edu.in/about-iqac/. Firestore's governanceItems doc for
// this slug currently only has a short synthesized intro/about summary —
// much thinner than the source site's actual Vision/Mission/Objectives/
// Functions structure — so this always wins over item.intro/item.about
// (see GovernanceDetail.tsx) until an admin replaces it with the fuller
// content below.
export const DEFAULT_IQAC_INTRO = 'An Internal Quality Assurance Cell (IQAC) has been established during the academic year 2013.';

export const DEFAULT_IQAC_ABOUT = `## Vision of IQAC
SVECW IQAC aims to develop a system for conscious, consistent and catalytic action to improve the academic and administrative performance of the institution.

## Mission of IQAC
- To develop and maintain quality benchmarks that promotes continuous improvement and innovation in teaching-learning and governance.
- To strengthen feedback systems from all stakeholders to support evidence-based decision-making and quality enhancement.
- To encourage the adoption and dissemination of best practices across academic and administrative domains.
- To build robust information systems for quality monitoring, evaluation, and reporting to foster transparency and accountability.

## Objectives of IQAC
The prime task of the IQAC is:
- To develop a system for conscious, consistent and catalytic action to improve the performance of academic, research and administrative activities in the institution.
- To impart strategies and mechanisms for quality enhancement and set bench marks through the institutionalization of best practices and the internalization of quality culture.
- To serve as a potential channel for strengthening the institution's reputation among stakeholders by maintaining efficient support systems and services.

## Functions of IQAC
- Development and application of quality benchmarks/parameters for various academic and administrative activities of the institution
- Facilitating the creation of a learner-centric environment conducive to quality education and faculty maturation to adopt the required knowledge and technology for participatory teaching and learning process
- Arrangement for feedback from students, parents and other stakeholders on quality-related institutional processes
- Dissemination of information on various quality parameters of higher education
- Organization of inter & intra workshops, seminars on quality related themes & promotion of quality circles
- Documentation of the various programmes /activities leading to quality improvement
- Acting as a nodal agency for the Institution for coordinating quality-related activities, including adoption and dissemination of best practices
- Development and maintenance of institutional database through MIS for the purpose of maintaining/enhancing the institutional quality
- Preparation of the Annual Quality Assurance Report (AQAR) as per guidelines and parameters of NAAC`;
