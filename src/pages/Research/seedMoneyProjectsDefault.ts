// Fallback content for the Seed Money Projects item, sourced from
// https://svecw.edu.in/seed-money-projects/. Firestore's researchItems doc
// for this slug may not have its tableText field filled in yet from the
// admin panel — this constant is used by ResearchDetail.tsx so the page
// renders the full year-by-year project tables out of the box instead of
// staying blank until someone pastes the same text into the admin panel.
// Once an admin does fill in the Firestore field, that value takes over
// (see ResearchDetail.tsx).
export const DEFAULT_SEED_MONEY_PROJECTS_TABLE_TEXT = `## Projects by Academic Year
Year | Projects | Amount Sanctioned (₹)
2024-25 | 4 | 7,23,706
2023-24 | 4 | 2,46,530
2022-23 | 5 | 3,65,690
2021-22 | 6 | 2,62,483

## 2024-25 Projects
Sl. No. | Faculty Name | Dept. | Project Title | Amount (₹)
1 | Dr. J Rohith Balaji | EEE | Design for Smart Solar Aerator System for Prawn/Fish Ponds | 2,20,706
2 | Dr. G Durga Prasad | AI | Solar Based Water Pumping System using 15 level Symmetrical Inverter | 3,27,000
3 | Dr. K. Hari Krishna | ME | Fabrication and Characterization of Novel SiC and High-Entropy Alloy Reinforced Aluminium Metal Matrix Composites | 80,000
4 | Dr. K Benerjee | ME | Design and Fabrication of Drones Frames with Lattice structure using additive Manufacturing | 96,000

## 2023-24 Projects
Sl. No. | Faculty Name | Dept. | Project Title | Amount (₹)
1 | Dr. J Rohith Balaji | EEE | 3-phase Rectifier unit with over current protection for internal lab usage | 33,330
2 | Dr. K. Ganesh Kadiyala, Dr. P. Sree Brahmanandam | BS | Analysis of Water Samples | 45,000
3 | Dr. B. N. Malleshwara Rao, Mr. N. Raja Sekhar | ME | Effect of Surface Treatment on Formability and Corrosion behaviours of Aluminium Tailor Welded Blanks Produced by Different Welding Techniques | 89,700
4 | Mr. N. Raja Sekhar, Dr. B. N. Malleshwara Rao | ME | Effect of Surface Treatment on Metallurgical and Mechanical Behaviours of Aluminium Tailor Welded Blanks Produced by Different Welding Techniques | 78,500

## 2022-23 Projects
Sl. No. | Faculty Name | Dept. | Project Title | Amount (₹)
1 | Mr. L Ram Gopal | CE | Preparing Concrete Canoes for the Canoe Competition | 73,750
2 | Mr. N Srinivasa Rao, Dr. B N Malleswara Rao | ME | Metallurgical and mechanical behaviors of shielded metal arc, friction stir and tungsten inert gas welded dissimilar aluminum alloy joints | 84,250
3 | Mr. B N Satya Krishna, Dr. B N Malleswara Rao | ME | Fatigue crack growth behavior of shielded metal arc, friction stir and tungsten inert gas welded dissimilar aluminum alloy joints | 84,250
4 | Mr. U D S Prathap Varma, Dr. B N Malleswara Rao | ME | Influence of pin profile on fatigue crack growth behavior of friction stir welded aluminum tailor welded blanks | 79,500
5 | Dr. K Ganesh Kadiyala, Dr. P S Brahmanandam | BS | Water Sample Analysis in the Yanamaduru Village | 43,940
Total | | | | 3,65,690

## 2021-22 Projects
Sl. No. | Faculty Name | Dept. | Project Title | Amount (₹)
1 | Dr. J Rohith Balaji | EEE | Hybrid Drive Controller for Induction Machine and BLDC Motor (Phase -I) | 23,100
2 | Dr. S M Padmaja | EEE | Voice Activated Autonomous Chess Board for Disable (Phase -I) | 34,969
3 | Mr. B N Malleswara Rao | ME | Influence of pin profile on Mechanical, metallurgical and formability behaviors of friction stir welded aluminium tailor welded blanks | 72,500
4 | Dr. P S Brhamanandham | Physics | Establishment of a low-cost Particulate Matter (PM) sensor in SVECW campus, Bhimavaram | 25,000
5 | Dr. J Rohith Balaji | EEE | Automatic Guided Robot for Floor Chess (Phase -I) | 41,864
6 | Dr. P Gireesh Kumar | CE | Experimental Investigation of Sustainability of Pervious Concrete Pavement (PCP) with the Inclusion of GGBS w.r.t Alternative Mixes | 65,050
Total | | | | 2,62,483`;
