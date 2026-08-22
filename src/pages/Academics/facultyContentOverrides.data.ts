import { textToSections, type FacultySection } from '../../lib/facultySections';

/**
 * Per-person overrides for a faculty profile's "Sections" content, written
 * directly in code instead of through /admin → Faculty. Keyed by
 * "name::department" (case-insensitive) since that's the only stable match
 * available — Firestore doc IDs aren't known ahead of time.
 *
 * An entry here always wins over whatever that same person's Firestore
 * `faculty` doc has for `sections`, on both the Faculty profile page
 * (FacultyProfile.tsx) and the Freshman Engineering "About HOD" tab
 * (FreshmanEngineering.tsx). If an admin later edits this same person's
 * Sections in /admin, that edit will have no visible effect on the public
 * site while their entry here still exists — remove the entry to hand
 * control back to Firestore/admin for that person.
 */
const MATH_HOD_SECTIONS_TEXT = `
## Professional Affiliations
- Life member of "The Indian Society for Technical Education (ISTE)", with LM-53969 in 2007
- Member of "International Association of Engineers (I A E N G)", with 169367 in 2016

## Research Papers Published
- T. S. R. Murthy et al., published paper on "Single server Queuing Model with Inverse Gaussian Service Times" in Proceedings of the INTERNATIONAL CONFERENCE ON EMERGING TRENDS IN COMPUTATIONAL MATHEMATICS AND DATA SCIENCE – (ICETCMDS-24), Organised by DEPARTMENT OF MATHEMATICS, Sri Krishna Arts and Science College (Autonomous), Coimbatore – 641008, Tamil Nadu, India. 10 & 11th January, 2024, ISBN 978-81-962641-6-1.
- T. S. R. Murthy, etal, published paper on "Single Server Interdependent Queueing Model using Bailey's Bulk Service" in the "International Journal of Recent and Innovation Trends in Computing and Communication, (IJRITCC), Vol.3, No.5, 2015 p.3450-3455
- T. S. R. Murthy, etal. Published paper on "Bailey's Bulk Service Rule Using Interdependence Parameter" in the "International Journal of Scientific and Innovative Mathematical Research (IJSIMR)" Vol.3, Spl. Issue, No.2, 2015, p.680-685
- T. S. R. Murthy. Published paper on "Maximal Ideal and Filters of ADLS" in the "International Journal of Scientific and Innovative Mathematical Research (IJSIMR)", Vol.3, Spl. Issue, No.2, 2015, p.704-709
- T. S. R. Murthy. Published paper on "M / M(k) / 1 Queueing Model with Varying Service Rate" in the "International Journal of Mathematics and soft Computing, (IJMSC)", Vol.2, No.1, 2012 January issue, p.109-117
- T. S. R. Murthy. Published paper on "The Influence of Various Factors for the use in the mobile phones" in the International Journal of Computer Information Systems (IJCIS), Vol. 3, No. 6, 2011, December, P.81-95
- T. S. R. Murthy and D. Siva Rama Krishna Published paper on "Single Server Interdependent Queueing System with Fixed Batch Service" in International Journal of Mathematical Sciences and Applications (IJMSA), Vol.1, No.3, September 2011, p.1065-1077
- T. S. R. Murthy and D. Siva Rama Krishna Published paper on "Analysis of cell phone usage using correlation techniques" in International Journal of Wireless and Mobile Networks (IJWMN), Vol.3, No.2, April 2011, p.91-100
- T. S. R. Murthy and D. Siva Rama Krishna Published paper on "On Single Server Interdependent Queueing Model with Varying Service Rate" in the "International Journal of Mathematical Sciences and Applications", Vol.2, Jan-April 2012, p. 283-288
- T. S. R. Murthy and D. Siva Rama Krishna Published paper on "Interdependent Queueing Model with Fixed Size Service" in the "International Journal of Computer Science and its Applications", page 191-199, 2012 issue
- T Sri Rama Murthy, etal, Published paper on "Varying Bulk-Service Queueing Model with Phase Wise Service" in the Bull. Cal. Math. Soc., Vol.104 No.2, p175-182, 2012
- T Sri Rama Murthy, etal, published paper on "A Study on Multiple Factors Involved in the Use of Mobile Phones" in the International Journal of Advances in Science and Technology, Vol.5, No.4, p.72-103
- T Sri Rama Murthy, R. John Mathew and J. Lakshmi Narayana Published paper on "Perishable inventory model with finite rate of replenishment having Weibull lifetime and price dependent demand" in Assam Statistical Review, Vol.21 No.1, March 2007, pp 91-102
- T Sri Rama Murthy, etal., paper on "Two-server inter-dependent Queuing Model using Bailey's service Rule" Journal of Research Administration, Vol. 6 No. 1 (2024) ISSN:1539-1590 | E-ISSN:2573-7104, P. 1644-1654

## Papers Presented
- T. S. R. Murthy et al., "Single server Queuing Model with Inverse Gaussian Service Times" in INTERNATIONAL CONFERENCE ON EMERGING TRENDS IN COMPUTATIONAL MATHEMATICS AND DATA SCIENCE – (ICETCMDS-24), Organised by DEPARTMENT OF MATHEMATICS, Sri Krishna Arts and Science College (Autonomous), Coimbatore – 641008, Tamil Nadu, India, On 10 & 11th January, 2024
- Participated in the "INTERNATIONAL CONFERENCE ON EMERGING TRENDS IN COMPUTATIONAL MATHEMATICS AND DATA SCIENCE – (ICETCMDS-24), Organised by DEPARTMENT OF MATHEMATICS, Sri Krishna Arts and Science College (Autonomous), Coimbatore – 641008, Tamil Nadu, India, On 10 & 11th January, 2024
- T. S. R. Murthy and N. Rajasekhar, "Two Server Interdependent Queueing Model using Bailey's Service Rule" in the International Conference on Advances in Mathematical Sciences, (ICAMS2017), Organized by School of Mathematics, Department of Statistics, Vellore Institute of Technology, Vellore during 4-6 December 2017
- Participated in the National Conference on "Leadership in Higher Education (Building Tomorrow's Leaders)" at Engineering Staff College of India (Autonomous Organ of the Institution of Engineers (India), Hyderabad, on 4th July, 2014.
- T. S. R. Murthy and D. Siva Rama Krishna "Single Server Interdependent Queueing Processes with varying Service" in the "1st International Conference on Mathematical Sciences and Applications (ICMSA-2011)" organized by "Mind Reader Publications" to be held in December 18, 2011.
- T. S. R. Murthy and D. Siva Rama Krishna Presented paper on "Interdependent Queueing Model with Varying Bulk service" in the National Conference Recent Trends in applications of Mathematics in Science and Technology (RTAMST), held at Gitam University, Visakhapatnam, during April 15th-16th, 2011.
- T. S. R. Murthy and D. Siva Rama Krishna, "Interdependent Queueing Model with Bailey's service" in the "International Conference on Recent Advances in Mathematical Sciences and Applications (ICRAMSA-2011)" organized by "Calcutta Mathematical Society" during December 09-11, 2011 in the society campus.
- T. S. R. Murthy and D. Siva Rama Krishna, "Varying bulk-service queueing model with phase wise service" in the "International Conference on Recent Advances in Mathematical Sciences and Applications (ICRAMSA-2011)" organized by "Calcutta Mathematical Society" during December 09-11, 2011 in the society campus.
- T. S. R. Murthy and D. Siva Rama Krishna, "Effective Study of cell phone usage using Statistical techniques" in International Conference on Nano Science Engineering and Advanced Computing (ICNEAC) of July 8-10, 2011 at Swarnandhra College of Engineering and Technology, Narsapur.
- T. S. R. Murthy and D. Siva Rama Krishna, "Interdependent Queueing Model with fixed Size Service" in the International Conference on "Advanced Computing, Communication and Networks" (ICACCN'11), Sponsored by International Neural Network Society (INNS), India Regional Chapter organized by Universal Association of Computer and Electronics Engineers at Chandigarh, during June, 2-3, 2011 and published in the International Journal of Computer Science and its Applications.
- T. S. R. Murthy and D. Siva Rama Krishna, "Interdependent Queueing Model with Constant Service Rate" in the National Conference on "Applications of Mathematics in Engineering Sciences", (NCAMES-2011), Andhra University, Visakhapatnam during, June, 29th-30th, 2011.

## Workshops / Seminars/ FDP / Conferences attended
- A 12-week Faculty Development Program on "Foundations of R software" organized by NPTEL-AICTE from July to October 2023
- One-week International online Faculty Development Program on "Multidisciplinary Approach in Research Methodology", Organized by Departments of Biotechnology, History, Physics, Electronics & Chemistry of Sri Y. N. College (A), Narsapur, W. G. Dt., Andhra Pradesh, India, from 13-09-2023 to 17-09-2023
- National web-level Faculty Development Program on "Number theory and its Applications", organized by Department of Humanities and Science, Gates Institute of Technology, Anathapuram, from June 14th, 2021, to June 15th, 2021.
- National level Faculty Development Program on "ROLE OF MATHEMATICS IN LATEST ENGINEERING TRENDS", organized by Department of Mathematics and Humanities, Lords Institute of Engineering and Technology, from June 4th, 2021, to June 10th, 2021
- Online International Faculty Development Program on "Recent Advances in Mathematics and Statistics" (FDPRAMS-2020), jointly organized by Department of Mathematics, Centre for Learning & Sustainability and GITAM (Deemed to be University), from August 3rd, 2020, to August 8th, 2020.
- Online Faculty Development Program on "Applications of Mathematics in Science & Engineering", Organized by Department of Basic Sciences (Mathematics) Vishnu Institute of Technology, from July 7th, 2020, to July 11th, 2020.
- One-week Faculty Development Program on "R Programming", organized by Department of Computer Science at St. Joseph's College (Autonomous), Irinjalakuda, in association with Spoken tutorial project, IIT Bombay, from April 27th to May 2, 2020.
- National Faculty Development Program and Online Training on "LaTeX", organized by Sanjay Ghodawat, Kolhapur, in association with Spoken tutorial project, IIT Bombay, from April 27th to May 2, 2020.
- Online International Faculty Development Program on "Statistical Trends and Practices in Science and Technology," organized by the Department of Basic Sciences and Humanities (Mathematics), Aditya Institute of Technology and Management (AITAM), from July 4th, 2020, to July 8th, 2020.
- Workshop on "How to Write a Funded Project Proposal and Research Paper," organized by VEDIC (Vishnu Educational and Innovation Research Centre) Hyderabad, on June 7, 2016.
- Role of Mathematics in Technical Education 2016 (RMTE-16), conducted by S. R. K. R Engineering College, Bhimavaram, on January 6, 2016.
- National Level Workshop on "IPR and PATENTS," organized by Research and Development Centre Shri Vishnu Engineering College for Women (SVECW), Autonomous, on October 25, 2014.
- A workshop on "Management Capacity Enhancement Program for Administrative Heads of Higher Education Institutions" was conducted by the Indian Institute of Management, Bangalore (IIM B) from March 11 to 23, 2013.
- An interactive discussion on "Sustaining Student Learning" was organized by IIT Hyderabad, India, on February 6, 2013.
- A Two-Day Workshop on "Cyber Security & Malware Analysis," organized by the Computer Society of India Student Branch (SVECW), SVECW, Vishnupur, BVRM, from January 3 to 4, 2012.
- Workshop on "Teaching Engineering using MATLAB & Simulink" as part of the Indo-US Engineering Faculty Leadership Institute, organized by Jaipur Engineering College for Girls, Jaipur, from July 5 to 7, 2011.
- A five-day workshop on "Effective Teaching of Engineering" as part of the 2010 Indo-US Engineering Faculty Leadership Institute, organized by JNTU Kakinada, Andhra Pradesh, from July 12 to 16, 2010.
- International workshop on "Data Mining and Stochastic Modeling (IWDMSM-2008)," sponsored by DST, New Delhi, conducted by the Department of Statistics, Andhra University, Visakhapatnam, from January 29th to February 1st, 2008.
- A 7-day international workshop on "Business Data Mining," organized by the CR Rao Advanced Institute of Mathematics, Statistics, and Computer Science (AMSCS), was held at the University of Hyderabad Campus, Hyderabad, from December 22–27, 2008.
- A 6-day "Faculty Enablement Program-Aptitude" from 10-12-07 to 15-12-07, conducted by IEG-JKC and Globerena Technologies Private Limited, at CRR College of Engineering, Eluru.
- A 3-day symposium on "Recent Advances in Mathematics Applied in Engineering," organized by Swarnandhra College of Engineering and Technology, Narsapur, India, from May 6-8, 2007.
- A two-day refresher course on "soft computing applications in data engineering" was conducted by Shri Vishnu Engineering College for Women, Bhimavaram, from April 5-6, 2007.
- Two-week All India Refresher Course in "Applied Stochastic Processes" in New Delhi, organized by the Indian Academy of Sciences, Bangalore, in collaboration with the Indian Statistical Institute, New Delhi, India, from December 5th to December 17th, 2005.
- A 6-day Short course of Quality Improvement Program on "INSTRUCTIONAL DESIGN AND DELIVERY," Conducted by Technical Teachers Training Institute, Chennai, from 12.05.2003 to 17.05.2003.

## Certificate Courses
- NPTEL-ONLINE CERTIFICATION, on "Foundations of R software" in July-Oct.2023, 12 Weeks

## Administrative Experience
- Worked as Head of the department of Basic Science, Shri Vishnu Engineering College for Women, Bhimavaram, from January 2012 to December 2020.
- Coordinator, Anti-ragging committee from 2010 to till date, in Shri Vishnu Engineering College for Women, Bhimavaram.
- Student Outings for Hostel students, outing Permissions from 2010 to 2018 in Shri Vishnu Engineering College for Women, Bhimavaram.
- Scrutinize and recommend for the monitory incentives to the faculty for research incentives in the college level in Shri Vishnu engineering College for Women, Bhimavaram from 2013 to 2016.

## Achievements
- Chaired a technical session at the International Conference on "RECENT ADVANCES IN APPLIED SCIENCES AND ENGINEERING" (ICRAAE-2023) held at Shri Vishnu Engineering College for Women, Bhimavaram, A.P. on DECEMBER 22nd-23rd 2023.
- Nominated as an expert panel member for Assistant Professor Ratification interviews at DNR College of Engg. & Tech. Bhimavaram, Ref: LTNo.JNTUK/DAA/Assistant Professors Ratification/2023 Dt:05-03-2023. On 05-03-2023.
- Chaired a technical session at the International Conference on Recent Developments in Mathematics (ICRDM 2022) held at Canadian University Dubai, Dubai, UAE on 24-26 August 2022.
- Got "Best Guest Lecture Award" for the year 2014 from Padmasri Shri Dr. B. V. Raju Institute of Computer Education (BVRICE), Bhimavaram, Affiliated to Adikavi Nannayya University, in 2014.
- Got "Best seminar award" for year 2012, in Padmasri Dr. B.V. Raju Institute of Computer Education (BVRICE), Bhimavaram, Affiliated to Adikavi Nannayya University in 2012.
- Got "Best Guest Lecture Award" for the year 2016 in the field of Operations Research, from Padmasri Dr. B.V. Raju Institute of Computer Education (BVRICE), Bhimavaram, Affiliated to Adikavi Nannayya University in 2016.
- Got the Best Teacher Award for the year 2004 conferred by Lenora College of Engineering, Rampachodavaram, with a cash prize as a token of appreciation.
- Acted as a Judge of State level Science Exhibition at Visakhapatnam English medium School, Bhimavaram, West Godavari District, A.P. from 28-12-2015 to 30-12-2015.

## Awards & Recognitions
- Resource Person for a One Week online International Workshop on "Enhancing Computational Skills of Mathematics in Various Fields of Engineering (ECSMVFE-23)" organized by the department of Mathematics, Bapatla Engineering College, Bapatla, from 18 to 23rd December, 2023.
- Resource Person for the Three-Day workshop on "Research Methodology in Science & Technology" organized by the department of Mathematics, Shri Vishnu Engineering College for Women, Bhimavaram, from 28th to 30th July, 2022.
- Resource Person for the Two-Day Faculty Development Program on "Linear Regression Analysis" organized by the department of Mathematics, Bapatla Engineering College, Bapatla, from 25th to 26th October, 2019.
- Resource Person for the Two-Day workshop for students on "Linear Regression Analysis" organized by Bapatla Engineering College, Bapatla, from 25th to 26th October, 2019.
- Resource Person for the Three-Day Faculty Development Program on "Applications of Mathematics in Engineering" organized by the department of Basic Science & Humanities, Sri Vasavi Engineering College, Tadepalligudem, from 17th to 19th December, 2018.
- Expert member from Academia on the Board of Studies in Basic Sciences & Humanities (Statistics & Mathematics) of Sri Vasavi Engineering College, Tadepalligudem, in 2018.
- Expert member from Academia on the Board of Studies in Basic Sciences & Humanities (Statistics & Mathematics) of Bonam Venkata Chalamayya Engineering College (Autonomous) in 2018.
- Acted as an Observer of AP EAMCET-2017 to Regional Center: Bhimavaram in 2017.
- Subject Expert for the preparation of Question Bank for Final Examinations (8 semesters) appointed by JNTU Kakinada, in 2012.
- As a Convener, organized "5th National Symposium for Women, Medhamilan-2014" (Student Techno Fest), at Shri Vishnu Engineering College for Women, Bhimavaram, from 6th-7th March, 2014.
- Acted as a Panel Member in the faculty interview boards of various Engineering Colleges.
- Guest Lecturers were given at different Engineering and Degree colleges.

## Events Organized
- Co-coordinator for a 3-day workshop on "Research Methodology in Science & Technology", Sponsored by Shri Vishnu Engineering College for Women, Bhimavaram, from 28th July 2022 to 30th July 2022.
- As member & HoD, Conducting Short term Training Program on Integral Transforms and their Applications (ITTA-2020), Sponsored by AICTE, from 30th November, 2020 to 5th December, 2020.
- As a Convener, National Level Workshop on "English for writing Ph.D Thesis and Journal Papers" Sponsored by Shri Vishnu Engineering College for Women, from 19th October, 2016 to 23rd October, 2016.
- As a Convener, National Level Workshop on "Recent Advances in Nano materials and Applications (RANA)" Sponsored by Shri Vishnu Engineering College for Women, from 03rd October, 2016 to 07th October, 2016.
- As a Convener, National Level Workshop on "Real time Engineering Applications of Mathematics (REAM-2014)" Sponsored by Shri Vishnu Engineering College for Women, Bhimavaram, from 25th November, 2014 to 29th November, 2014.
- As a Convener, National Level Workshop on "Real time Engineering Applications of Mathematics (REAM-2007)" Sponsored by Shri Vishnu Engineering College for Women, Bhimavaram, from 1st September 2007 to 2nd September 2007.

## Books / Book Chapters
- Written a book Chapter published on "Queueing Models" in 2008 published by VGS Publishers
- Written a book on "Probability and Statistics" in 2010 published by I K International, publisher with ISBN 978-93-8144-08-3, 2010.
- Written along with Dr. B. Prabhakarao, a book on "Probability Theory and Stochastic Processes" in 2012 published by B.S. Publications, with ISBN 978-93-81075-98-2, 2012.
- Second edition of the book "Probability and Statistics" is under processing
- Second edition of the book "Probability Theory and Stochastic Processes" is under processing
- A book on "Complex Variables and Statistical Methods (CVSM)" is under processing and 95% of the book completed
- A book on "Numerical Methods (Engineering Mathematics-II)" is under processing and 95% of the book completed
`;

const MATH_VASU_BABU_TEXT = `
## Recognitions & Awards
- Crack AP SET-2019
- "Incredible Researcher of India" award in 2024

## Professional Affiliations
- International Association of Engineers (IAENG) Hong Kong membership
- Institute of Mathematical Statistics (IMS) membership

## Reviewer Experience
- Mathematical Reviewer for American Mathematical Society (Asian-European Journal Mathematics) since 2016
- Reviewed 3 manuscripts for international conferences

## Research Papers Published
- "D-Divisibility of Almost Distributive Lattices" - Asia Pacific Journal of Mathematics, Issue 40, March 2024
- "On Fuzzy Closure Filters of Decomposable Stone Almost Distributive Lattices" - Asia Pacific Journal of Mathematics, Issue 40, November 2023
- "Dufour and heat source effects on radiative MHD slip flow of a viscous fluid in a parallel porous plate channel" - Journal of the Korean Society for Industrial and Applied Mathematics, Vol. 21, Issue 4, 2017
- "On Prime and Maximal Subalgebras" - International Journal of Modern Trends in Engineering and Research, Vol. 04, Issue 12, December 2017
- "Initial and final segments in ADL's" - South-East Asian Bulletin of Mathematics, Vol. 41, March 2017
- "Irreducible elements in ADL's" - Palestine Journal of Mathematics, Vol. 5(1), 2016
- "Stereographic-l-axial Exponential and Stereographic Circular Exponential Distributions" - International Journal of Scientific and Innovative Mathematical Research, Vol. 3, Special Issue 5, November 2015
- "Maximal Ideals and Filters of an ADLs" - International Journal of Scientific and Innovative Mathematical Research, Vol. 3, Special Issue 2, July 2015
- "The C (X, D), a characterization of a Stone almost distributive lattice" - Asian-European Journal of Mathematics, Vol. 8, No. 3, August 2015
- "Associate elements in ADL's" - Asian-European Journal of Mathematics, Vol. 7, No. 4, December 2014
- "Irreducible Ideals in Rings" - Italian Journal of Pure and Applied Mathematics, No. 32, 2014
- "The Stonity of a pseudo-complemented ADL" - Asian-European Journal of Mathematics, Vol. 7, No. 3, August 2014
- "Weak pseudo-complemented on ADL's" - Archivum Mathematicum (BRNO), Tomus 50, July 2014
- "Morphisms on closure spaces and moore spaces" - International Journal of Pure and Applied Mathematics, Vol. 91, No. 2, March 2014
- "Varying bulk-service queueing model with phase wise service" - Bulletin of the Calcutta Mathematical Society, Vol. 104, No. 2, October 2012

## Papers Presented at Conferences
- Three-Day International Online Conference "Advancing Innovations Through Mathematics: A Journey Across Disciplines (AITM-2025)" - Paper: "A Review on Coherent Almost Distributive Lattices" - September 8-10, 2025 - Bapatla Engineering College
- Second International Conference on Recent Advances In Applied Sciences And Engineering (ICRAAE-2024) - Paper: "Beta-Irreducible Elements of Almost Distributive Lattices" - December 6-7, 2024 - SVECW, Bhimavaram
- International Conference on Recent Advances In Applied Sciences And Engineering (ICRAAE-2023) - Paper: "D-divisibility of Almost Distributive Lattices" - December 22-23, 2023 - SVECW, Bhimavaram
- International Conference ON APPLIED SCIENCE AND TECHOLOGY (ICAST-2019) - Paper: "On Prime Spectrum Of An ADL's" - March 27-28, 2019 - Sri Sagi Rama Krishna Raju Engineering College, Bhimavaram
- International Conference ON APPLIED SCIENCE AND TECHOLOGY (ICAST-2018) - Paper: "On Lattice of Ideals In Almost Distributive Lattices" - January 24-25, 2018 - Sri Sagi Rama Krishna Raju Engineering College, Bhimavaram
- International Conference On Algebra and applications-2015 (ICAA-2015) - Paper: "Maximal ideals and filters of an ADL's" - August 13-15, 2015 - Sri Venkateswara University, Tirupathi
- National Conference On Advances In Mathematical Sciences-2015 (AIMS-2015) - Paper: "Weak-pseudo complementation's on ADL" - November 28, 2015 - K.B.N. College, Vijayawada
- Two-Day National Workshop on "Recent Trends in Algebra and Its Applications" (RTIAA-2015) - Paper: "Irreducible elements in ADL's" - February 19-20, 2015 - K.B.N. College, Vijayawada
- National Seminar on "Recent Developments in Mathematics and Its Applications" (ICAA-2014) - Paper: "Associate elements in ADL's" - December 2-3, 2014 - Acharya Nagarjuna University, Guntur
- International Conference On Algebra and applications-2014 (ICAA-2014) - Paper: "Initial and final segments in ADL's" - April 29-May 1, 2014 - Andhra University, Visakhapatnam
- International Conference On Recent Advances In Mathematical Applications (ICRAMSA-2011) - Paper: "Varying Bulk Service Queueing Model with phase wise service" - December 9-11, 2011 - Calcutta Mathematical Society, Kolkata

## Book Chapters Published
- "On Prime Spectrum of an ADL's" - Mortal Publications, ISBN: 978-93-5779-832-7, Pages 125-136, February 2023
- "FS-Subsets Under the FS-Complement Operator" - Mortal Publications, ISBN: 978-93-5779-832-7, Pages 125-136, February 2023

## Workshops, Seminars, and Faculty Development Programs Attended
- Two Day National Workshop "Bridging Math & Code- A Python Approach (BMCPA-2025)" - Department of Mathematics, Siddhartha Academy of Higher Education, Vijayawada - November 27-28, 2025
- One Week International Methodology Workshop "Predictive Statistics and AI Approaches in Social & Engineering Sciences" - Department of Mathematics, Vishnu Institute of Technology, Bhimavaram - October 13-19, 2025
- One Month Online Faculty Induction Programme (GURU DAKSHTA) - Malaviya Mission Teacher Training Centre, Central University of South Bihar, Gaya - November 19-December 16, 2024 - Grade 'A'
- One-week online Faculty Development Program "Data Science and Machine Learning Applications For Engineering and Sciences" - SVECW, Bhimavaram - October 21-27, 2024
- Online Short-Term Training Programme (STTP) "On Mathematical Methods" - UGC-MMTTC, Shri Mata Vaishno Devi University, Katra, J&K - October 14-19, 2024
- One-Week National Level Faculty Development Programme "Assimilation of Indian Knowledge Systems with NEP-2020: Prospect and Retrospect" - BVRIT Hyderabad College of Engineering for Women, Hyderabad
- Two-week Pre-Conference Online Workshop "Asymptotic Analysis of Algorithms" - NIT Warangal - October 19-29, 2023
- AICTE Training and Learning (ATAL) Academy Faculty Development Program "AI Tools for Educators in line with OBE" - Bapatla Engineering College - November 20-25, 2023
- Five-Day Interdisciplinary online Faculty Development Program "Institutional Initiatives for Effective Assessment and Accreditation in the context of NEP-2020" - S.S& N College, Narasaraopet - August 7-11, 2023
- One-week online Faculty Development Program "Innovative Mathematical Techniques in Research" - Sathyabama Institute of Science and Technology, Chennai - August 1-6, 2022
- One week virtual National Faculty Development Program "Scientific Documentation using LATEX (SDL-2021)" - SRKR Engineering College, Bhimavaram - August 9-14, 2021
- Six Day Faculty Development Program "Mathematics and Statistics in Engineering Field" - KPR Institute of Engineering and Technology, Coimbatore - July 5-10, 2021
- One week National Level Online Faculty Development Program "Number Theory & Its Applications" - GATES Institute of Technology, Ananthapuram - June 14-19, 2021
- One week FDP on "ICT Tools" - Sree Vidynikethan Engineering College, Tirupati - May 11-16, 2020
- Two Weeks FDP "Managing Online Classes and Co-Creating MOOCs 2.0" - Ramanujan College, University of Delhi - May 18-June 3, 2020
- Five-day Online FDP on "PYTHON programming" - Guru Nanak Institutions - May 18-22, 2020
- One Week Faculty Development Program on "LaTeX" - Sanjay Ghodawat University, Kolhapur - April 27-May 2, 2020
- One Week Faculty Development Programme on "R-Programming" - St. Joseph's College, Irinjalakuda - May 4-9, 2020
- Two-Day National Level Workshop "Modern Methods for Remote Teaching-Learning Practices" - Krishna University, Machilipatnam - May 12-13, 2020
- Three-day Faculty Development Programme "Applications of Mathematics in Engineering" - Sri Vasavi Engineering College - December 17-19, 2018
- ESCI Professional Development Programme "Entrepreneurship Development" - AU College of Engineering, Visakhapatnam - December 16-18, 2015
- Workshop on "Supply Chain Management" - VEDIC, Hyderabad - March 6-8, 2017
- National Workshop "Scope of Sciences & Maths in Engineering" - Gudavalleru Engineering College - August 11-13, 2011
- National Workshop "Recent Advances In Data Mining And Its Applications" - Andhra University, Visakhapatnam - March 11-14, 2011
- National Seminar "Discrete Mathematics and Its Applications (DMAA-11)" - Gayatri Vidya Parished College of Engineering for Women, Visakhapatnam - February 10-12, 2011
- SDP on "Inspiring ways of Imparting Education" - SVECW, Bhimavaram - July 5, 2009
- National Workshop "Uniform Hyper Graphs and their applications" - Sir CRR Institute of Mathematics, Eluru - January 30-February 5, 2008
- National Seminar on "Global warming Education" - K.G.R.L. PG College, Bhimavaram - July 5, 2008

## Online Certification Courses Completed
- Certification course on Scopus Academy Module on Basic Research - June 14, 2025
- Two weeks Online Refresher Course "Research Methodology using Time Series & Panel Data Analysis" - Malaviya Mission Teacher training Center, Shri Mata Vaishno Devi University - October 6-18, 2025
- Refresher Course "Mathematics for AI/ML and Data Science" - Malaviya Mission Teacher training Center, IIT(ISM) Dhanbad, Jharkhand - December 1-12, 2025
- NPTEL Online Certification - "Foundations of R-Software" - October 2023 (12 Weeks)
- Coursera Course - "Mathematics for Machine Learning: PCA" - May 19, 2020
- Coursera Course - "Vector Calculus for Engineers" - April 19, 2020
- Coursera Course - "Mathematics for Machine Learning: Multivariate Calculus" - April 5, 2020
- Coursera Course - "Mathematics for Machine Learning: Linear Algebra" - April 9, 2019
- NPTEL Online Certification - "Advanced Engineering Mathematics" - January-April 2019 (12 Weeks)
- NPTEL Online Certification - "Discrete Mathematics" - January-April 2019 (12 Weeks)
- Coursera Course - "Introduction to Graph Theory" - July 31, 2019
- Coursera Course - "Differential Equations for Engineers" - September 9, 2019

## Administrative Experience
- NBA Department Coordinator - 2023-2024
- NBA Department Coordinator - 2018 & 2022-2023
- Academic Audit Committee Member - 2017-2023
- Outing Principal for 3rd & 4th year Hostel Students - 2017-2022
- Teaching Education Quality Improvement Program (TEQIP) Departmental Coordinator - 2009-2012
- Head of Department (HoD) of Mathematics - K.G.R.L. PG College, Bhimavaram - 2005-2009
- NBA Coordinator - K.G.R.L. PG College, Bhimavaram - 2007-2008
- Actively involved in NAAC Accreditation work

## Achievements
- NEET Exam Observer - Appointed by NTA, Visakhapatnam, Andhra Pradesh - 2019
- Sub-Inspector Exam Observer - Appointed by NTA, Bhimavaram, Andhra Pradesh - 2018
- Ratified as Assistant Professor in JNTUK, Kakinada - 2011
- Assistant Presiding Officer (APO) - Appointed by the Election Department - 2010
- Presiding Officer (PO) - Appointed by the Election Department - 2005
`;

const MATH_KAMESWARI_TEXT = `
## Professional Affiliations
- Life Member of "Andhra Pradesh and Telangana Society for Mathematical Sciences"

## Research Papers Published
- L.R.Kameswari, Dr.P.R.Sudha Rani "Multilingual Spam Classification Using Advanced Deep Learning Techniques", 2024 International Conference on Sustainable Communication Networks and Application (ICSCNA), 10 February 2025. DOI: 10.1109/ICSCNA63714.2024.10864311
- P.R.Sudha Rani, P.L.R.Kameswari, "A Exploring Hybrid Classifiers Through Stacking and Voting Ensembles for Robust Multilingual Spam Classification", 2025 Fifth International Conference on Advances in Electrical, Computing, Communication and Sustainable Technologies (ICAECT), 17 April 2025. DOI: 10.1109/ICAECT63952.2025.10958858
- P.L.R.Kameswari, V.S. Bhagavan, "GROUP THEORETIC ORIGINS OF CERTAIN GENERATING FUNCTIONS OF LEGENDRE POLYNOMIALS", International Journal of Chemical Sciences, 13(4), 2015
- P.L.R.Kameswari, V.S. Bhagavan, "SPECIAL LINEAR GROUP SL(2,C) AND GENERATING FUNCTIONS FOR TWO VARIABLE LEGENDRE POLYNOMIALS", Global Journal of Pure and Applied Mathematics, 11(2), 2015
- P.L.R.Kameswari, V.S. Bhagavan, "CERTAIN GENERAING FUTNCTIONS OF GENERALISED HYPERGEOMETRIC 2D POLYNOMIALS FROM LIE-GROUP THEORETIC POINT OF VIEW", International Journal for Pure and Applied Mathematics, 115(1), 2017, pages 59-66
- P.L.R.Kameswari, V.S. Bhagavan, "GROUP-THEORETIC GENERATING FUNCTIONS OF GENERALIZED HYPERGEOMETRIC 2D POLYNOMIALS", International Journal for Pure and Applied Mathematics, 113(6), 2017, pages 147-155
- P.L.R.Kameswari, V.S. Bhagavan, "GENERATING FUNCTIONS FOR TWO VARIABLE LEGENDRE POLYNOMIAL BY TRUESDELL METHOD", International Journal for Pure and Applied Mathematics, 113(6), 2017, pages 156-164
- P.L.R.Kameswari, V.S. Bhagavan, "BILATERAL GENERATING FUNCTIONS INVOLVING GENERALIZED HYPERGEOMETRIC POLYNOMIALS OF TWO VARIABLES", Indian Journal of Science and Technology, 10(12), March 2017
- P.L.R.Kameswari, V.S. Bhagavan, "SOME GENERATING FUNCTIONS OF GENERALIZED HYPERGEOMETRIC 2D POLYNOMIALS BY LIE GROUP THEORETIC METHOD", International Journal for Pure and Applied Mathematics, 119(11), 2018, pages 403-411
- P.L.R.Kameswari, V.S. Bhagavan, "CERTAIN GENERATING FUNCTIONS OF GENERALIZED HYPERGEOMETRIC 2D POLYNOMIALS FROM TRUESDELL METHOD", Italian Journal of Pure and Applied Mathematics, 40, 2018, pages 277-285
- P.L.R.Kameswari, V.S. Bhagavan, "GENERATING RELATIONS OF TWO VARIABLE GENERALIZED HYPERGEOMETRIC In(alpha,beta;X,Y) BY LIE GROUP-THEORETIC METHOD", Journal of Advanced Research in Dynamical & Control Systems, 10(7), 2018, pages 413-420
- P.L.R.Kameswari, V.S. Bhagavan, G.N.V.Kishore, I.V.Ravi Kumar, "CERTAIN CLASSILCAL PROPERTIES OF TWO VARIABLE GENERALIZED HYPERGEOMETRIC POLYNOMIALS", International Journal of Recent Technology and Engineering (IJRTE), 8, 2019
- Ch.J.L.Padmaja, B.Sriniva, V.S. Bhagavan, P.L.R.Kameswari, "ENHAANCING THE PERFORMANCE OF RSA TYPE CRYPTOSYSTEMS", 8(12), 2019
- P.L.R.Kameswari, V.S. Bhagavan, "SOME PROPERTIES OF GENERALIZED HYPERGEOMETRIC POLYNOMIALS IN TWO VARIABLES", Advances in Mathematics: Scientific Journal, 9(10), 2020, pages 8861-8868
- P.L.R.Kameswari, V.S. Bhagavan, "Some Generating Relations of Generalized Hypergeometric 2D polynomials by Lie Group - Theoretic Method", International Journal of Disaster Recovery and Business Continuity, 11(1), 2020, pages 1463-1470
- Tadikonda Srinivasulu, P.L.R.Kameswari, V. S. Bhagavan, "Group-Theoretical study of Certain Generating Functions for Two variable Hypergeometric Polynomials", International Journal of Advanced Science and Technology, 29(5), 2020, pages 3520-3528
- V. S. Bhagavan, P.L.R.Kameswari, Tadikonda Srinivasulu, "Certain Classical Properties of Generalized Hypergeometric Polynomials", AIP Conference Proceedings, 2702, 020005, 2023
- P.L.R.Kameswari, V.S. Bhagavan, V.L.V.S.K.B.Kasyap, "Certain Integral representations of Hypergeometric polynomials", AIP Conference Proceedings, 2707, 020004, 2023
- S. Bhagavan, P.L.R.Kameswari, Tadikonda Srinivasulu, "Bilateral generating relations associated with two variable generalized hypergeometric polynomials", AIP Conference Proceedings, 2512, 020099, 2024

## Papers Presented at Conferences
- "A Exploring Hybrid Classifiers Through Stacking and Voting Ensembles for Robust Multilingual Spam Classification" at 2025 Fifth International Conference on Advances in Electrical, Computing, Communication and Sustainable Technologies (ICAECT), 9-10 January 2025, Shankaracharya Technical Campus, Bhilai, Chhattisgarh, India
- "Multilingual Spam Classification Using Advanced Deep Learning Techniques" at 2024 International Conference on Sustainable Communication Networks and Application (ICSCNA), December 11-13, 2024
- Paper presentation at "XXIV Congress of Andhra Pradesh Society for Mathematical Sciences National Conference on Recent Developments in Mathematical Sciences and their Applications to Science and technology", 11-13 December 2015, Vignana Bharathi Institute of Technology, Hyderabad
- Paper presentation at "International Conference on Mathematical Computer Engineering (ICMCE 2016)", 16-17 December 2016, VIT University, Chennai
- Paper presentation at "3rd International Conference on Recent Advances in Mathematical Sciences and Applications RAMSA-2017", 19-22 December 2017, Gayarthri Vidya Parishad College of Engineering, Vizag
- Paper presentation at "Essence of Mathematics and Engineering Applications EMEA 17", 17-18 November 2017, K.L.University, Vijayawada
- Paper presentation at "National Conference on Mathematical Techniques and their Applications (NCMTA 2017)", 27-28 January 2017, SRM University, Kattankulathur, Tamilnadu
- Paper presentation at "Essence of Mathematics and Engineering Applications (EMEA 2018)", 14-15 December 2018, K.L.University, Vijayawada
- Paper presentation at "International Conference on Applied Science and Technology (ICAST-2019)", 27-28 March 2019, SRKR Engineering College, Bhimavaram
- Paper presentation at "Essence of Mathematics and Engineering Applications (EMEA 2021)", 29-30 December 2021, K.L.University, Vijayawada
- Paper titled "Lie Algebra & Generalized hyper geometric matrix polynomials of one variable" at 1st International Conference on Recent Advances in Applied Sciences and Engineering (online) (ICRAAE-2023), 22-23 December 2023, Shri Vishnu Engineering College for Women, Bhimavaram, Andhra Pradesh, India
- Paper titled "Multilingual Spam Classification Using Advanced Deep Learning Techniques" at Fifth IEEE international conference on Sustainable Communication Networks and Application (ICSCNA 2024), 11-13 December 2024, Bharath Nikethan Engineering College, India
- Paper titled "Exploring Hybrid Classifier Through Stacking and Voting Ensemble for Robust Multilingual Spam Classification" at Fifth IEEE international conference on Advances in Electrical, Computing, Communications, and Sustainable Technologies (ICAECT 2025), 9-10 January 2025, Shankaracharya Technical Campus, Bhilai, Chhattisgarh, India

## Workshops, Seminars, and Faculty Development Programs Attended
- 2 day National workshop on "Bridging Math & Code- A Python Approach (BMCPA-2025)", Department of Mathematics, Siddhartha Academy of Higher Education, Vijayawada, 27-28 November 2025
- One Week International Faculty Development Program on "Innovative Applications of Mathematics (IAM-2025)", Department of Mathematics in association with Institution's Innovation Council (IIC), BEC
- One-week International Methodology Workshop on "Predictive Statistics and AI Approaches in Social & Engineering Sciences", Department of Mathematics, Vishnu Institute of Technology (Autonomous), Bhimavaram, 13-19 October 2025
- Capacity-building program on STEM (Mathematics), Teaching Learning Centre (TLC), IIT Madras, 19-27 July 2025, organized under Malaviya Mission Teacher Training Programme (MMTTP)
- One week international FDP on "Innovative Applications of Mathematics", Department of Mathematics, Bapatla Engineering College, 18-23 November 2024
- One week online FDP on "Innovations in Machine Learning AI data Science and Modelling", Electronics and ICT Academy, IIT Roorkee, 16-23 December 2024
- One Week national level online FDP "Assimilation of Indian Knowledge systems with NEP-2020 Prospect and Retrospect", Department of Basic Science and IQAC, BVRIT College of Engineering for Women, Hyderabad, 30 July-4 August
- "Essence of Mathematics and Engineering Applications EMEA 2015", 26-27 March 2015, K.L.University, Vijayawada
- "2nd Andhra Pradesh Science Congress", 7-9 November 2016, P.B.Siddhartha College of Arts & Science, Vijayawada
- Faculty Development Programme "Igniting Genius within Student through Effecting Teaching", 1-5 December 2015, Swarnandhra College of Engineering and Technology, Narsapur
- Workshop on "Research Methodology", 6-9 July 2013, K.L.University, Vijayawada
- One Week national level online FDP "Mathematical and Statistical Modelling", 26-30 May 2020, GIET, Rajahmundry
- International Webinar Series "Advances in Mathematics", 22-27 June 2020, TATA Institute of Sciences, Tuljapur
- One Week international level online FDP "Applications of Mathematics in Science and Engineering", 7-11 July 2020, Vishnu Institute of Technology, Bhimavaram
- One Week national level online FDP "Number Theory and its Applications", 14-19 June 2021
- Five day International (Online) FDP on "Applications of Mathematics in Various Fields with Innovative Approaches" (AMVFIA-23), Bapatla, 21-25 November 2023
- Online short-term course on "Mathematical modelling and Numerical Simulation" (MMNS 2023), 24-28 July 2023
- 7 Day FDP on "Practical Aspects of ICT Tools & Online Teaching in Current Scenario", Research Foundation on India & RFI-CARE, 2-11 October 2023
- One week National Level FDP on "Assimilation of Indian Knowledge System with NEP-2020", BVRIT Hyderabad, 30 July-4 August 2024
- Five Day International FDP on "Exploring Recent Trends In Applied Mathematics and Machine Learning", 20-24 May 2024
- FDP on "Innovations in Machine Learning AI, Data Science and Modelling", Electronics and ICT Academy, IIT Roorkee in association with Vignan's Foundation for Science Technology and Research, 16-23 December 2025

## NPTEL and Online Courses Completed
- Python Essentials-1, Cisco Networking Academy
- Mathematics for Data Science, Simplilearn
- Complete Python Developer, Udemy
- Certification course on Scopus Academy Module on Basic Research, June 14 2025
- Certification course on Scopus Academy Module On Research Collaborations, June 14 2025
- NPTEL Course: Discrete Mathematics, IIT Madras, 12 weeks, July-October 2024
- 12 Week course on "Essential Mathematics for Machine Learning", IIT Roorkee, July-October 2022
- 12 week Course on "Foundations of R software", IIT Madras, July-October 2023

## Administrative Experience
- Actively involved in NBA and NAAC Accreditation work
- Club Coordinator: Mathematics club "Mathletes"

## Patents
- Indian Patent on "Bayesian Inference for Stochastic Differential Equations with Uncertainty Quantification and Parameter Estimation", Filing date: 8/3/2024, Publication date: 22/3/2024, Application No.: 202441016939
- Indian Patent on "Optimizing Heat Transfer in Hybrid Nano-Fluids using Fractional Calculus and Numerical Simulations", Filing date: 16/12/2024, Publication date: 20/12/2024, Application No.: 202441099611
`;

const MATH_VIJAYA_PRASHANTHI_TEXT = `
## Research Papers Published
- "Cosmological evolution of Sharma-Mittal holographic dark energy in self creation theory of gravitation," AIP Conf. Proc. 3298, 040034 (2025) (Scopus)
- "Cosmological Dynamics of Anisotropic Kaniadakis Holographic Dark Energy Model in Brans-Dicke Gravity," East European Journal Of Physics. 2. 10-20 (2024)(Scopus)
- "Dynamics of Anisotropic Sharma-Mittal Holographic Dark Energy Model In Brans-Dicke Theory," Proceedings on Engineering, Vol. 06, No. 4 (2024) (Scopus)
- "Five Dimensional Kaluza-Klein Dark Energy Model with strings in Brans-Dicke Theory of Gravity" in 1st National Conference on Design Thinking: Trans-Disciplinary Challenges & Opportunities, 7-8 july 2023

## Papers Presented
- Cosmological evolution of Sharma-Mittal holographic dark energy in self creation theory of gravitation, AIP Conference (International Conference July 5th-6th 2025, GMRIT, Rajam)
- Dynamics of Anisotropic Sharma-Mittal Holographic Dark Energy Model In Brans-Dicke Theory (International Conference December 22nd-23th 2023, SVECW, Bhimavaram)
- "Five Dimensional Kaluza-Klein Dark Energy Model with strings in Brans-Dicke Theory of Gravity" in First National Conference on Design Thinking: Trans-Disciplinary Challenges & Opportunities-7th and 8th july, 2023, Organized by Andhra University, Visakhapatnam

## Workshops / Seminars / FDP / Conferences Attended
- International Seminar on Computational Techniques in Mathematics organized by the department of Mathematics Adikavi Nannaya University Rajamahendravaram on 25th &26th September 2025
- One Week National Level Faculty Development Programme on "Connecting Indian Knowledge systems to Engineering Practices A way towards VIKSIT BHARAT2047(Hybrid MODE) FROM 13TH-18TH October 2025, BVRIT Hyderabad
- Five day online FDP on Transformative Teaching and Research: using AI Tools and Adaptive Technologies, Organized by GMR Institute of Technology, Rajam
- Five-Day international Online Faculty Development Program on Exploring Recent Trends in Applied Mathematics and Machine Learning from 20-24 May 2024
- FDP/ Training Programme(online) on Research paper writing from 25 November to 02 December 2023, Jointly Organized by B K Birla Institute of Higher Education Pilani-Rajasthan Research Foundation of India & RFI-CARE
- Five day International (Online) FDP on "Applications of Mathematics in Various Fields with Innovative Approaches" (AMVFIA-23), Bapatla from 21/11/23 to 25/11/23
- Workshop on "Scientific Educational Practices" held during 12-14 June 2017 at Vishnu Educational development and innovation center(VEDIC-Hyderabad)
- Workshop on "Simulation & Modeling" held during 18-19 November 2016 at Vishnu Educational development and innovation center(VEDIC-Hyderabad)
- Workshop on "Advanced Engineering Optimization through Intelligent Techniques" held during 21-22 October 2016 at Vishnu Educational development and innovation center (VEDIC-Hyderabad)
- Workshop on "Real time Engineering Applications of Mathematics"(REAM-2014) held during 25-29 November 2014 organized by Department of Basic Science, Shri Vishnu Engineering College for Women, Bhimavaram
- Workshop on "Igniting Genius with in every student program" organized on 17th August 2012 at SRKR Engineering college, Bhimavaram
- Faculty Development Programme on "Expert Guidelines in Teaching & Reasearch Methods" in Engineering Mathematics on 8th September, 2011 organized by Department of Humanities & Sciences, Vignana Bharathi Institue of Technology, Hyderabad

## Online Courses
- 16-weeks NPTEL Course on Research Methodology And Statistical Analysis July-November 2023
`;

const MATH_GANGA_BHAVANI_TEXT = `
## Papers Presented
- Presented "Lie Algebra & Generalized hyper geometric matrix polynomials of one variable" at the 1st International Conference on Recent Advances in Applied Sciences and Engineering (ICRAAE-2023), December 22-23, 2023, hosted by Shri Vishnu Engineering College for Women, Bhimavaram

## Workshops/Seminars/FDP/Conferences Attended
- Refresher Course on Research Methods and Data Analysis (December 22, 2025 - January 5, 2026) - MMTTC Bhagat Phool Singh Mahila Vishwavidyalaya, Khanpur
- Two-day National Seminar on "Expedition to the Matrix World" (December 24-25, 2025) - Department of Mathematics, Seshadripuram Institute of Technology, Mysuru (virtual)
- National Workshop "Bridging Math & Code- A Python Approach" (November 27-28, 2025) - Dept of Mathematics, Siddhartha Academy of Higher Education, Vijayawada
- One Week International Faculty Development Program "Innovative Applications of Mathematics" (November 17-22, 2025) - Department of Mathematics, BEC
- International Methodology Workshop "Predictive Statistics and AI Approaches in Social & Engineering Sciences" (October 13-19, 2025) - Vishnu Institute of Technology
- International Seminar on Computational Techniques in Mathematics (September 25-26, 2025)
- FDP "Innovations in Machine Learning, Artificial Intelligence, Data Science and Modelling" (December 16-23, 2024) - EICT Academy, IIT Roorkee
- One-Week Online Faculty Development Program "Data Science and Machine Learning Applications for Engineering and Sciences" (October 10-27, 2024) - Department of Information Technology, SVECW
- Five-day International FDP "Applications of Mathematics in Various Fields with Innovative Approaches" (November 21-25, 2023) - Bapatla
- Online Short-Term Course "Mathematics with Computational Learning for Engineering and Technological Application" (November 20-24, 2023)
- Online Short-Term Course "Mathematical Modelling and Numerical Simulation" (July 24-28, 2023)
- One-week Online FDP "Taxonomy of Software's Related to Mathematical Sciences" (June 9-14, 2020) - Gokaraju Rangaraju Institute of Engineering and Technology, Hyderabad
- Workshop "Scientific Educational Practices" (June 12-14, 2017) - VEDIC
- Workshop "Supply Chain Management" (March 6-8, 2017) - VEDIC
- One-day Workshop "Role of Mathematics in Technical Education" (2016) - S.R.K.R. College of Engineering, Bhimavaram

## Online Courses
- Certification Course on Scopus Academy Module: Basic Research (June 14, 2025)
- Certification Course on Scopus Academy Module: Research Collaborations (June 14, 2025)
- Online Course in Udemy: "Complete Python Developer" (December 2025)
- Online Course in Simplilearn: "Mathematics for Data Science" (December 2025)
- NPTEL Course "Discrete Mathematics" - IIT Madras (12 weeks, July-October 2025)
- NPTEL Course "Deep Learning" - IIT Kharagpur (12 weeks, January-April 2025)
- NPTEL Course "Data Analytics with Python" - IIT Roorkee (12 weeks, January-April 2025)
- NPTEL Course "Essentials Mathematics for Machine Learning" - IIT Roorkee (12 weeks, July-October 2022)
- NPTEL Course "Foundations of R-Software" - IIT Madras (12 weeks, July-October 2023)
- Coursera Course "Differential Equations for Engineers" (June 2020)
- Coursera Course "Matrix Algebra for Engineers" (September 2020)

## Administrative Experience
- Actively involved in NBA and NAAC Accreditation work
`;

const MATH_JOEL_MATHEWS_TEXT = `
## Professional Affiliations
- Life Member in Indian Society Of Theoretical and Applied Mechanics L/1289
- Life Member of Andhra Pradesh and Telangana Society for Mathematical Sciences

## Research Papers Published
- Joel Mathews and Talla Hymavathi (2025). "Unsteady Magnetohydrodynamic Free convection Flow of Al2O3-Cu/ Water Nanofluid Over a Permeable Linear Stretching Sheet" Journal of Thermal Engineering, Vol. 11, No. 2, pp. 344-356. (Scopus indexed, Q3 Journal)
- Joel Mathews and Hymavathi Talla. "Unsteady magnetohydrodynamic free convection and heat transfer flow of Al2O3-Cu/water nanofluid over a non-linear stretching sheet in a porous medium." Archives of Thermodynamics (2023)
- Hymavathi, T., Joel Mathews, and R. V. M. S. S. Kiran Kumar. "Heat transfer and inclined magnetic field effects on unsteady free convection flow of MoS2 and MgO-water based nanofluids over a porous stretching sheet." International Journal of Ambient Energy 43.1 (2022): 5855-5863
- Mathews, Joel, and T. Hymavathi. "Magnetohydrodynamic stagnation point flow and heat transfer effects of Al2O3-Cu/water hybrid nanofluid over a porous stretching surface." Proceedings of the Institution of Mechanical Engineers, Part E: Journal of Process Mechanical Engineering 237.3 (2023): 1064-1072

## Papers Presented
- 27th International Conference of International Academy of Physical Sciences (CONIAPS XXVII), October 26-28, 2021 (Online), Kuvempu University, Karnataka. Presented: "Heat transfer and inclined magnetic field effects on unsteady free convection flow of MoS2 and MgO-water based nanofluids over a porous stretching sheet."
- RELEVANCY OF ANCIENT MATHEMATICS TO THE CURRENT DIGITAL TRENDS (ICRAMCDT2022), December 9-11, 2022. Presented: "Magnetohydrodynamic stagnation point flow and heat transfer effects of Al2O3-Cu/water hybrid nanofluid over a porous stretching surface."
- 32nd Congress of APTSMS with International Conference on Computational Modeling in Science and Engineering (ICCMSE-2023), October 28-30, 2023, NIT Warangal, Telangana. Presented: "Unsteady magnetohydrodynamic free convection flow of Al2O3-cu/ water nanofluid over a permeable linear stretching sheet through a porous medium with viscous dissipation."
- 68th Conference of Indian Society of Theoretical and Applied Mechanics (ISTAM-2023), NIT Warangal, December 7-9, 2023. Presented: "Unsteady Magnetohydrodynamic Free Convection and Heat Transfer Flow of Al2O3Cu/Water Nanofluid Over a Non-linear Stretching Sheet in a Porous Medium."

## Workshops / Seminars / FDP / Conferences Attended
- One Week International Methodology Workshop on "Predictive Statistics and AI Approaches in Social & Engineering Sciences," October 13-19, 2025, Department of Mathematics, VIT, Bhimavaram
- International Seminar on "Computational Techniques in Mathematics," September 25-26, 2025, Department of Mathematics, AKNU, Rajamahendravaram
- Capacity-building program on STEM (Mathematics), July 19-27, 2025, Teaching Learning Centre (TLC), IIT Madras, under Malaviya Mission Teacher Training Programme (MMTTP)
- One Week International Faculty Development Program on "Innovative Applications of Mathematics," November 18-23, 2024 (virtual mode), Department of Mathematics
- One-Week National Level Faculty Development Programme on "Assimilation of Indian Knowledge Systems with NEP-2020: Prospect and Retrospect," July 30-August 4, 2024 (Hybrid Mode), BVRIT Hyderabad College of Engineering for Women
- Five Day Faculty Development Program on "Applications of Mathematics in Various fields with innovation approaches," November 21-25, 2023, Department of Mathematics, Bapatla Engineering College
- One week FDP on "Research Opportunities & Funding Agencies," June 27-July 2, 2022, Research & Development Cell, Krishna University, Machilipatnam
- One week FDP on "Enhancing the academic and intellectual environment in the higher educational institutes," July 11-16, 2022 (online), Research & Development & Department of Mathematics, Krishna University
- One week FDP on "Intellectual Property Rights: Emerging Issues & Challenges," June 20-24, 2022, Research & Development Cell, Krishna University, Machilipatnam
- Three Day International Webinar on "Non-Linear Differential Equations & Fluid Dynamics Applications in Engineering Sciences," May 12-14, 2022, CVR College of Engineering, Ibrahimpatan, Telangana
- One Week Online International Faculty Development Program on "Mathematical Prototypes and their Applications in Engineering and Science (MPAES-2020)," July 27-August 1, 2020, Department of Engineering Mathematics and Humanities, Sagi Rama Krishnam Raju Engineering College, Bhimavaram
- One Week Online National Faculty Development Program on e-Contents and ICT Tools for innovative and Effective Teaching, July 15-21, 2020, KS Jain Institute of Engineering and Technology, Modinagar, Ghaziabad
- Outcome Based Education and Accreditation, September 14, 2015, JNYU(H), Hyderabad
- NPTEL Workshop, July 9, 2016, Vardhaman College of Engineering, Hyderabad
- Two day Workshop on Modelling ideas from Mathematics for advancements in Science and Technology, October 12-13, 2012, Vijaya Engineering College, Khammam
- Short-term Course by National Institute of Technical Teachers Training & Research, Chennai on Instructional Design & Delivery Systems, Quality Improvement Programme, January 7-11, 2011
- Two-Day Workshop on Applications of Mathematics & Statistics for Engineering, July 23-24, 2010, JNYU(H), Hyderabad
- One-Day Orientation program on revised B.Tech 1 Year Mathematics Syllabus, September 19, 2009, JNTU (H), Hyderabad
- National Level Conference on National Workshop on Numerical Methods in engineering, April 4-5, 2008, NIT, Warangal
- Faculty Enablement program - Aptitude, November 19-24, 2007, Swami Ramanandateerdha Institute of Science & Technology, Nalgonda
- National Level Conference on Number Theory, Fixed Point Theorem and their Applications, August 30-31, 2007, Osmania Campus

## Online Courses
- NPTEL Course on "Discrete Mathematics," July-October 2025 (12 weeks)
- NPTEL Course on "Data Analytics with Python," January-April 2025 (12 weeks)
- NPTEL Course on "Essential Mathematics For Machine Learning," July-October 2022 (12 weeks)
- NPTEL Course on "Advanced Engineering Mathematics," January-April 2019 (12 weeks)
- Coursera Course, "Introduction to Calculus," July 13, 2020
- Coursera Course, "Mathematics for Machine Learning: Multivariate Calculus," April 21, 2020
- Coursera Course, "Matrix Algebra for Engineers," April 15, 2020
- Coursera Course, "Vector Calculus for Engineers," April 14, 2020
- Coursera Course, "Introduction to Graph Theory," July 29, 2019
- Coursera Course, "Mathematical Thinking in Computer Science," July 3, 2019

## Administrative Experience
- Head of Department, H&S Department, Sree Kavitha Engineering College, Karepally, Khammam, 2008-2017
- Diploma Coordinator, Sree Kavitha Engineering College, Karepally, Khammam, 2014-2017
- Joint Chief Superintendent for SBTET Exams
- IEG faculty under Jawahar Knowledge Centre (JKC) training program
- Active involvement in NBA and NAAC Accreditation work
`;

const MATH_PRATHIBHA_TEXT = `
## Workshops / Seminars / FDP / Conferences Attended
- Short-Term Programme 2025 under MMTTC by IIT Hyderabad (29/9/2025 to 4/10/2025)
- International Seminar on "Computational Techniques in Mathematics" at Adikavi Nannaya University (25th & 26th September 2025)
- One week International Methodology workshop on "Predictive Statistics and AI Approaches in Social & Engineering Sciences," Department of Mathematics, VIT, Bhimavaram (13th to 19th October)
- One day FDP on Generative AI for Teaching, Department of Mathematics, VIT, Bhimavaram (9th August 2025)
- NBA Awareness Workshop on "Outcome Based Education and Accreditation" in collaboration with JNTUK Kakinada & APSCHE (16th November 2025)
- Capacity-building program on STEM (Mathematics), Teaching Learning Centre, IIT Madras (19-27 July 2025)
- Faculty Development Program on AI Mastery for Educators, Vishlesan i-Hub IIT Patna (15th May to 7th June 2025)
- One Week National Level FDP on Assimilation of Indian Knowledge System with NEP-2020, BVRIT Hyderabad (30th July to 4th August 2024)
- Five-Day International Online Faculty Development Program on "Exploring Recent Trends in Applied Mathematics and Machine Learning" (20th-24th May 2024)
- 3 Days Workshop IDEATE-3, SVES, Bhimavaram (13th-15th February 2022)
- Five day International FDP on "Applications of Mathematics in Various Fields with Innovative Approaches," Bapatla (21st-25th November 2023)
- 7 Days FDP on "Practical Aspects of ICT Tools & Online Teaching in Current Scenario," organized by Research Foundation on India & RFI-CARE (2nd-11th October 2023)
- Five day FDP on "Basic Statistical Analysis and its Interpretation Using SPSS" (24th-26th August 2023)
- Five day FDP on "Mathematical Modelling and Numerical Simulation" (24th-28th July 2023)
- Five day VEDIC Faculty Induction Program Batch-3, SVES, Bhimavaram (10th-14th July 2023)

## Online Courses
- NPTEL Course: 12-weeks on Discrete Mathematics (July-October 2025)
- Python Essentials-1, Cisco Networking Academy
- NPTEL Course: 12-weeks on Foundation of R-Software (July-October 2023)

## Professional Affiliations
- "Life Member of Andhra Pradesh and Telangana Society for Mathematical Sciences"

## Published Papers
- "Multiclass Classification of DDoS attacks Using HSOFS Algorithm in IoT Networks" (with M. Ramesh Babu), published in Algorithms in Advanced Artificial Intelligence (1st ed.), DOI: 10.1201/9781003641537-74

## Presented Papers
- "Multiclass Classification of DDoS attacks Using HSOFS Algorithm in IoT Networks," 2nd International Conference on Algorithms in Advanced Artificial Intelligence (ICAAI-2024), SRKR Engineering College, Bhimavaram
- "A Hierarchical Adaptive Approach for Feature Selection in Multiclass Classification of DDoS Attacks," International Conference on Information and Communication Systems (ICICS-2025)

## Administrative Role
- Session Coordinator for "First International Conference on Recent Advances in Applied Science and Engineering," SVECW, Bhimavaram (22nd-23rd December 2023)
`;

const MATH_APARNA_TEXT = `
## Workshops / Seminars / FDP / Conferences Attended
- One day FDP on Generative AI for Teaching (9th August) organized by the Department of Basic Science, VIT, Bhimavaram, AP
- One Week International Faculty Development Program (Virtual Mode) on "Innovative Applications of Mathematics (IAM-2025)" (17-11-2025 to 22-11-2025) organized by Department of Mathematics in association with Institution's Innovation Council (IIC), BEC
- Faculty Development Program (Virtual Mode) on "Computational Techniques in Mathematics" (25-26 September) organized by Department of Mathematics, Adikavi Nannaya University, Rajamahendravaram, AP
- Faculty Development Program (Offline) under the Malaviya Mission Teacher Training Programme (MM-TTP) of the University Grants Commission (UGC), organized by Teaching Learning Center (TLC), IIT Madras (9 days: 19-07-2025 to 27-07-2025)
- Five day International (Online) FDP on "Applications of Mathematics in Various Fields with Innovative Approaches" (AMVFIA-23), Bapatla (21-25 November)
- Online Short-Term Course on "Mathematics with Computational Learning for Engineering and Technological Application" (MCET: November 20-24, 2023)
- A 12 weeks NPTEL SWAYAM Course on "Foundations of R Software" (July-October 2024)
- One week International Faculty Development Program on "Innovative Applications of Mathematics" (18-23 November 2024)
- One-Week National Level Faculty Development Program (Hybrid model) on "Assimilation of Indian Knowledge Systems with NEP-2020: Prospect and Retrospect" (30-07-2024 to 04-08-2024)

## Professional Affiliations
- Life Membership in Andhra Pradesh and Telangana Society for Mathematical Sciences (APTSMS) - LM No. 1644

## Online Courses / Certifications
- Certification course on Scopus Academy Module on Basic Research (June 14, 2025)
- Certification course on Scopus Academy Module on Research Collaborations (June 14, 2025)
- 12 weeks NPTEL SWAYAM Course on "Data Analytics with Python" (January-April 2025)
`;

const MATH_SAGIRAJU_TEXT = `
## Professional Affiliations
- International Association of Engineers (IAENG): Hong Kong - Life member No. 258967 (Physical Sciences)

## Workshops / Seminars / FDP / Conferences Attended
- "Artificial Intelligence Machine Learning and Deep Learning applications" - Five-day online short-term course organized by NIT-Warangal & VIT-Hyderabad (10-14 October 2023)
- "Applications of Mathematics in Various Fields with Innovative Approaches" (AMVFIA-23) - Five-day international offline FDP, Bapatla (21-25 November 2023)
- "Exploring Recent Trends in Applied Mathematics and Machine Learning" - Five-day international online faculty development program (20-24 May 2024)

## Certificate Courses
- NPTEL Course: Essential Mathematics For Machine Learning (July-October 2022) - 12 weeks
- NPTEL Course: Data Analytics with Python (January-April 2025) - 12 weeks

## Research Papers Published
- "Statistical Analysis on Migration levels on public in coastal districts-AP"

## Administrative Experience
- Examination Branch Member
`;

const MATH_MADASU_APPANNA_TEXT = `
## Professional Affiliations
- Life Member, ISTE

## Papers Presented
- Presented paper titled "Statistical Analysis of students speaking skills in Engineering colleges by using AI" at 2nd International Conference on Recent Advances in Applied Science & Engineering (ICRAEE-2024)

## Workshops/Seminars/FDP/Conferences Attended
- One Week National Level FDP on "Assimilation of Indian Knowledge System with NEP-2020," organized by BVRIT Hyderabad (July 30 - August 4, 2024)
- 7-Day FDP on "Practical Aspects of ICT Tools & Online Teaching in Current Scenario," organized by Research Foundation on India & RFI-CARE (October 2-11, 2023)

## Certificate Courses
- NPTEL Course on "DATA ANALYTICS WITH PYTHON" (January-April 2025, 12 weeks)

## Administrative Experience
- Placement Team Member
`;

const MATH_DURGA_RAO_NBNV_TEXT = `
## Professional Affiliations
- Life Member, ISTE

## Workshops/Seminars/FDP/Conferences Attended
- Attended 2nd International Conference on Algorithms in Advanced Artificial Intelligence (ICAAI-2024) at SRKR Engineering College, Bhimavaram
- 12-week Course on "Foundations of R software" - IIT Madras (July - October 2023)
`;

const MATH_KVN_RAVI_TEXT = `
## Professional Affiliations
- Life Member, ISTE

## Training & Development
- "One Week National level FDP on Recent advances in Electronics and Communication Engineering" (VIGNAN Institute, Aug 21-26, 2023)
- Successfully Completed NPTEL Course on "Introduction to IoT" (Nov-Dec 2023)
`;

const MATH_S_VENKATA_DURGA_RAO_TEXT = `
## Professional Affiliations
- Life Member, ISTE

## Papers Presented
- "Numerical solutions of Time_Fractional NWS and Burger's Equations" at 2nd International Conference on Recent Advances in Applied Science & Engineering (ICRAEE-2024)

## Workshops/Seminars/FDP/Conferences Attended
- Five-day FDP on "Modern Research Convergence in Next Generation Computing," Department of CSE, Sri Krishna College of Engineering and Technology, Coimbatore (Online), December 18-22, 2023
`;

const MATH_P_ANURADHA_TEXT = `
## Workshops / Seminars / FDP / Conferences Attended
- A certification course on Scopus Academy Module On Basic Research on June 14 2025
- A certification course on Scopus Academy Module On Research Collaborations on June 14 2025
- A Five day Faculty Development Programme (offline) on FRONTIERS IN EDTECH:WHAT'S NEXT? (16-06-2025 TO 20-06-2025)
- One day FDP on Generative AI for Teaching (9TH AUGUST) Organized by the Department of Basic Science VIT, Bhimavaram, AP
- One Week International Faculty Development Program (Virtual Mode) on "Innovative Applications of Mathematics (IAM-2025)" (17-11-2025 TO 22-11-2025) organized by department of Mathematics in association with Institution's Innovation Council (IIC), BEC
- One Week International Faculty Development Program (Virtual Mode) on "Methodology workshop on predictive statistics and AI Approaches in social & engineering sciences" 13th to 19th October organized by department of Mathematics VIT, Bhimavaram
- One Week national Faculty Development Program (Virtual Mode) on "Connecting Indian Knowledge systems to Engineering Practicals-A way towards VIKSIT BHARAT 2047" 13th to 18th October organized by department of Mathematics BVRIT HYDERABAD
- Faculty Development Program (Virtual Mode) on "Computational Techniques in Mathematics" 25th to 26th September organized by department of Mathematics, Adikavi Nannaya University, Rajamahendravaram, AP
- One week International Faculty Development Program on "Innovative Applications of Mathematics" (18th-23rd Nov 2024)
- A One-Week National Level Faculty Development Program (Hybrid mode) on "Assimilation of Indian Knowledge Systems with NEP-2020: prospect and Retrospect" (30-07-2024 to 04-08-2024)
`;

const MATH_V_LAHARI_TEXT = `
## Workshops / Seminars / FDP / Conferences Attended
- A certification course on Scopus Academy Module On Basic Research on June 14 2025
- A certification course on Scopus Academy Module On Research Collaborations on June 14 2025
- One day FDP on Generative AI for Teaching (9TH AUGUST) Organized by the Department of Basic Science VIT, Bhimavaram, AP
- One Week International Faculty Development Program (Virtual Mode) on "Innovative Applications of Mathematics (IAM-2025)" (17-11-2025 TO 22-11-2025) organized by department of Mathematics in association with Institution's Innovation Council (IIC), BEC
- One Week International Faculty Development Program (Virtual Mode) on "Methodology workshop on predictive statistics and AI Approaches in social & engineering sciences" 13th to 19th October organized by department of Mathematics VIT, Bhimavaram
- One Week national Faculty Development Program (Virtual Mode) on "Connecting Indian Knowledge systems to Engineering Practicals-A way towards VIKSIT BHARAT 2047" 13th to 18th October organized by department of Mathematics BVRIT HYDERABAD
- A Faculty Development program (offline) under the Malaviya Mission Teacher Training Programme (MM-TTP) of the University Grants Commission (UGC), organized by Teaching Learning Center (TLC), IIT Madras, 9 days from 19-07-2025 to 27-07-2025
- A Faculty Development program (offline) on Frontiers in EdTech: What's Next? "Innovative Teaching and Learning Pedagogy: Empowering Educators for NEP 2020" (16th to 20th June 2025) organised by Department of CSE, JNTUK, Kakinada
`;

const PHYSICS_HOD_TEXT = `
## Research Papers Published
- "Non-Linearity Parameter B/A and Available Volume VA of Binary Liquid Mixtures: Thermo-Acoustical Approach" - Proceedings of Engineering Sciences, Volume 06, January 2024, pp. 1719-1730
- "Study of thermophysical properties of binary mixtures of 1,4-Butanediol+Cresols at different temperatures" - Asian Journal of Chemistry, Volume 36, February 2024, pp. 717-724
- "Non Linearity Parameter B/A and Available Volume VA of Binary Liquid Mixtures: Thermo-Acoustical Approach" - Proceedings on Engineering Sciences, Vol. 06, No. 4, 2024
- "Viscometric Properties of Binary Mixtures of 1,4-Butanediol + Cresols at Different Temperatures" - Physical Chemistry Research Volume 9, Issue 4, December 2021, Pages 579-590
- "Elucidation of H-bond and molecular interactions of 1,4-butanediol with cresols" - Journal of Molecular Liquids Volume 236, June 2017, pp. 27-37
- "Densities and Speeds of Sound of Binary Liquid Mixtures of 1,4-Butanediol with 2-Methoxyethanol and 2-Propoxyethanol" - Journal of Solution Chemistry, Volume 46, November 2017, pp. 2066-2090
- "Temperature dependent study of thermophysical properties of binary mixtures of 1,4-butanediol + picolines" - Indian Journal of Pure & Applied Physics, Volume 55, November 2017, pp. 797-805
- "Molecular interaction in binary mixtures of 1, 4-butanediol+ picolines: Viscometric approach" - Indian Journal of Chemistry-Section A, Volume 56, October 2020, Issue 11, pp. 1154-1160
- "Study of volumetric and thermodynamic properties of binary mixtures 1,4-butanediol with methylpyridine isomers at different temperatures" - Journal of Molecular Liquids, Volume 216, April 2016, pp. 455-465
- "Theoretical Evaluation of Speed of Sound in Binary Liquid Mixtures" - International Journal of Advanced Research in Physical Science, Volume 3, 2016, Issue 6, pp. 7-14
- "Refractive Properties of Binary Mixtures of 1,4-Butanediol with Methylpyridine Isomers" - ISROSET, February 2016, Volume 3, Issue 1, Pages 1-12
- "Refractive index studies of binary liquid mixtures containing 1, 4-butanediol+ o-cresol/m-cresol/p-cresol"
- "Molecular interactions in binary liquid mixtures - an ultrasonic study" - Journal of Pure and Applied Physics, 2017, Volume 39, pp. 35-39

## Workshops/Seminars/FDP/Conferences Attended
- Presented paper in "International conference on Advances in Computational Mathematics and Applied Physical Sciences" - G Pullareddy Engineering College, Kurnool, 10-11 January 2025
- Participated in one week online FDP on "Innovations in High Performance Materials for Sustainable Energy and Environmental Impacts" - Department of Physics, BVRIT Hyderabad College of Engineering, 29 April - 4 May 2024
- Participated in five day online FDP on "Sustainable Nanomaterials Engineering for Environmental Applications" - Physics Division, Department of BS&H, GMRIT in collaboration with Center for Nanotechnology, IIT-Guwahati, 22-26 April 2024
- Acts as Organizing Committee member in "International Conference on Recent Advances in Applied Sciences & Engineering (ICRAAE-2023)" - Department of Physics, SVECW, 22-23 December 2023
- Attended 12 week FDP on "Physics of Functional materials and Devices" - NPTEL-AICTE, IIT-Kharaghpur, July-October 2023
- Presented paper in "International conference on Materials Engineering, Materials Chemistry and Materials Physics (MECAP-2023)" - SRKR Engineering College, Bhimavaram, 25-26 September 2023
- Presented paper in "International Conference on Multidisciplinary Research in Science & Humanities (ICMRSH-2022)" - Department of Physics, VVIT, Nambur, 17-18 February 2022
- Attended online International FDP on "Frontiers of Physics in Bio Medical Applications" - 19-21 October 2020
- Attended five day FDP on "Synthesis in Advanced Materials and Its Applications (SAMA-2020)" - 15-19 October 2020
- Presented paper in "Forays of Nanotechnology Research Into Multidiscipline" - Department of Physics and Chemistry, Government Degree College, Ravulapalem, 3-4 March 2020
- Presented paper in "National Seminar on Advances in Biomaterials & Characterization Techniques (ABCT17)" - Department of Physics, Andhra Loyola College, Vijayawada, 20-21 February 2017
- Presented poster in "International Conference on Engineering Physics, Materials and Ultrasonics" - North Cap University, Gurgaon, 3-4 June 2016
- Attended workshop on "Simulation & Modeling" - Vedic, Hyderabad, 18-19 November 2016
- Attended workshop on "Advanced Engineering Optimization Through Intelligent Techniques" - Vedic, Hyderabad, 21-22 October 2016
- Attended National Conference on "Advanced Research Concepts in Physics" - Department of Physics, Government Degree College, Rajamundry, 24-25 November 2011
- Attended workshop on "Igniting Genius Within Every Student" - SRKR Engineering College, Bhimavaram, 17 August 2011
- Attended workshop on "Physics Lab Course" - Department of Science and Humanities, Potti Sriramulu College of Engineering and Technology, Vijayawada, 8 September 2010

## Online Courses
- NPTEL Course: Physics of Functional Devices
- Quantum Optics 1: Single Photon - Coursera
- Quantum Mechanics - Coursera

## Administrative Experience
- Working as HoD of Physics Department since December 2020
- Worked as Department Time Table Coordinator
- Involved in accreditation works related to NAAC and NBA
- Prepared course content for Physics-related subjects for I.B.Tech. students

## Projects
- Completed AICTE-SPICES project - Rs. 1.00 Lac
`;

const PHYSICS_BRAHMANANDAM_TEXT = `
## Research Metrics
- Research Papers Published: 103 (H-index: 16)
- General Articles: 2
- Books Authored: 2
- Songs Written: 18

## Workshops/Seminars Conducted
- International Conference on "Recent Advances in Applied Sciences & Engineering," Dec 2024
- Two-day XILINX EMBEDDED DESIGN FLOW workshop, Dec 3-4, 2011
- Two-day National Seminar on "Role of Radars in Atmospheric and Ionospheric Studies," Jan 4-5, 2012
- Two-day PNMSats Intensive Workshop, May 27-28, 2015
- Five-day Workshop on "Recent Advances in Nanomaterials and Applications," Oct 3-7, 2016
- International Conference on "Recent Advances in Applied Sciences and Engineering," Dec 22-23, 2023

## Online Courses Completed
- Nanoscience & Nanosensor-Level 1 and 2 (Technion - Israel Institute of Technology)
- Quantum Mechanics (Coursera)

## Administrative Experience
- R & D Coordinator (NAAC, NBA, NIRF, FCC and others)
- AAA Club Coordinator
- TechPost Club Coordinator

## Awards & Recognitions
- Senior Research Fellowship - CSIR, Government of India, 2003
- Best Research Paper Award - National Space Science Symposium, 2004
- Best Doctoral Thesis Award & Prof. TVR Award - Andhra University, 2006
- Research project under Fast-track Scheme for Young Researchers - DST, 2011
- Outstanding Reviewer Award - ASR journal, 2014
- Outstanding Reviewer Award - JASTP, 2015
- International Travel Support (ITS) - SERB, 2015
- Best Researcher Award - National Central University, Taiwan, 2015
- Reviewer Award - J Geophys. Res., 2016
- Translation appointment for "Electromagnetism" in Telugu - AICTE SWAYAM project, 2020
- Ph.D. Guide recognition - JNTUK and KL University, 2021

## Ph.D. Guidance
- Completed: 2
- Pursuing: 2 (JNTUK-1 & KLU-1)

## Sponsored Projects
- DST-sponsored three-year research project on ionospheric studies: Rs. 27,00,000
- DST-sponsored global ionospheric density irregularities study: Rs. 6,83,000
- DST-sponsored ionospheric morphological studies using COSMIC technique: Rs. 25,14,000
- AICTE-SPICES student clubs promotion: Rs. 1,00,000
- In-house project: Rs. 37,000

## Achievements at SVECW
- Five B. Tech students selected for Government of India-sponsored summer research fellowships
- Facilitated telescope purchase and installation at AAA Club
- Installed low-cost pollution monitoring system for ambient air quality measurement
`;

const PHYSICS_KRISHNA_KUMAR_TEXT = `
## Professional Affiliations
- Life membership Indian society for Technical Education

## Research Publications
- "Force interactions and energy evaluation of Multi walled nanotubes" by Srinivas Ch. and Krishna Kumar J.V., published in Nagarjuna University Journal

## Papers Presented
- Paper on force interactions and energy evaluation in multi walled nano tubes, sponsored by UGC at SKBR college Amalapuram (January 9-10, 2010)

## Workshops/Seminars/FDP/Conferences Attended
- Course on Materials and Nano Technology (July 12-16, 2010) at SV National Institute of Technology, Surat
- 6th National Convention of ISTE students (October 10-11, 2003) at JNTUH Hyderabad
- "Pxlab 10" workshop on Physics lab course (September 8-9, 2010) at Potti Sriramulu College
- FDP on Characterization of Nano Materials (April 27, 2012) at Siddharatha Engineering College
- National Conference on Advanced Research concepts in Physics (November 24-25, 2015) at Government College Rajahmundry
- Two-day workshop on Fundamentals and Applications of Nano Fibers (July 4-5, 2014) at Indian Institute of Technology, Hyderabad
- National Seminar on Nano Materials in Engineering Chemistry (September 13, 2010) at V.R.Siddhartha Engineering College
- National Conference on recent Trends in Nano Science and Technology (April 4-5, 2013) at KL University Guntur
- Training of teachers for student induction programme by UGC (May 16-18, 2019) at IIIT Hyderabad

## Online Courses
- Online courses on Quantum Mechanics Physics for Engineers from Edux

## Administrative Experience
- HOD Science and Humanities at Mother Theressa Engineering College (December 13, 1999 to August 11, 2008)
- Student outings permissions coordinator (2010-2021)
- I B.Tech Incharge (2010 onwards)
- Coordinator student affairs (2020-2023)

## Awards & Recognitions
- Participated as jury member at district-level INSPIRE science exhibition at Vishnu School Bhimavaram (August 12-14, 2014)
`;

const PHYSICS_NAVEEN_KUMAR_TEXT = `
## Research Papers Published
- "Comparative study on visible-infrared and upconversion luminescence of Er3+,Yb3+ Co-doped La2Zr2O7 and Y2Zr2O7 phosphors for optical thermometry and latent fingerprint detection" (October 2025)
- "Synthesis And Photoluminescence Studies Of Yttrium Zirconate (Yzo) Phosphors Powders Doped With Bi3+ Ions" (2025)
- "Upconversion luminescence of pyrochlore structured (A2B2O7) phosphors" (December 2024)
- "Synergistic Integration of Mn-Doped ZnO Nanoparticles with Hibiscus Nano-Host Matrix" (2024)
- "Influence Of Synthesis Method On Microstructure And Luminescence Of La2zr2o7: Bi, Tb Pyrochlore Phosphors" (2024)
- "Comparison of synthesis techniques for La2Zr2O7:Bi,Tb phosphor" (April 2025)
- "Structural and optical characteristics of undoped and Eu3+ doped MgZn2(PO4)2 nanopowder" (2024)
- "Structural, morphological and photoluminescence properties of Eu3+ doped Cd2Sr(PO4)2 nanopowder" (2023)
- "Enhanced Luminescence and Energy Transfer of Bi3+/Dy3+ Co-doped La2Zr2O7 Nanophosphors for pc-LED Applications" (2023)
- "Realization of effective energy transfer and color tunability between Tb3+ and Eu3+ ions in LaAlO3 host for LED display applications" (2022)
- "Structural, morphological and luminescent studies on Sm3+ doped strontium tin phosphate nanopowder" (2022)
- "Bright Blue Emissions on UV-Excitation of LaBO3 (B= In, Ga, Al) Perovskite Structured Phosphors for Commercial Solid-State Lighting Applications" (2022)
- "Tunable Luminescence from Bi3+ Sensitized La2Zr2O7: Eu3+ Red Nanophosphors for Display Applications" (2022)
- "Structural and Morphological Studies on Strontium Tin Phosphate SrSn(PO4)2 Nanopowder" (2022)
- "Optical insights of indium-doped beta-Ga2O3 nanoparticles and its luminescence mechanism" (2020)
- "Synthesis, IR and optical absorption studies of MAlO3 (M=La,Y) doped with Tb3+, Eu3+ nano phosphors" (2020)
- "Synthesis and characterization of copper particles decorated reduced graphene oxide nano composites for the application of super capacitors" (2018)
- "Nano casting fabrication of porous N-doped carbon using melamine formaldehyde resins" (2018)

## Workshops / Seminars / FDP / Conferences Attended
- Presented poster and talk on "Optimization and Photoluminescence Studies of Yttrium Gallium Oxide Phosphor Powder doped with Tb3+ ions" at National Conference on Advanced Functional Device Materials (NCAFDM-2023) held at Acharya Nagarjuna University, Guntur, India during 27th-28th Feb'2023
- Presented oral talk on "Structural and Optical Studies of La2-x-yZr2O7: x%Bi3+Co-doped with y%Tb3+ ions for Field Emission Display Devices" at National Seminar on Recent Trends in Nanoscience and Nanotechnology (NSRTN-2020) held at Acharya Nagarjuna University, Guntur during Jan 30-31'2020
- Presented oral talk on "Blue luminescence from Bi3+ Activated in Lanthanum Indium, Lanthanum Aluminum and Lanthanum Gallium Oxide Nanophosphors for Solid-state Lightning Applications" at International Conference on Science and Engineering of Materials (ICSEM)-2019 held at Sharda University, Greater Noida during July 19-21'2019
- Presented oral talk on "Luminescence Properties of Bi3+ Activated and Dy3+ Co-doped Lanthanum Indium Oxide Nanophosphors for Solid-state Lightning Applications" in International Conference on Applied Sciences and Technology (ICAST)-2019 held at SRKR Engineering College, Bhimavaram during Mar 27-28'2019

## Online Courses
- Completed four-week NPTEL Online Certificate Course cum FDP (Funded by MHRD, Govt of India) with consolidated score of 80% on "Structural Analysis of Nano Materials" in Oct-2021
- Completed online FDP on Nano Technology Advances in Engineering Materials and Manufacturing through AICTE-ATAL program from 21-06-2021 to 25-06-2021
- Completed one-week online FDP on Internet of Things (IoT) through Andhra Pradesh Skill Development Corporation (APSSDC) from 24-08-2020 to 05-09-2020
- Completed four-week NPTEL Online Certificate Course (Funded by MHRD, Govt of India) with consolidated score of 60% on "Optical Sensors" in April-2020
- Completed twelve-week NPTEL Online Certificate Course cum FDP (Funded by MHRD, Govt of India) with consolidated score of 90% on "Non-Conventional Energy Resources" in Oct-2018
- Completed four-week NPTEL Online Certificate Course (Funded by MHRD, Govt of India) with consolidated score of 60% on "Research Writing" in April-2018

## Administrative Experience
- Website Coordinator
- AAA Club Co-Coordinator
- Time Table Coordinator

## Awards & Recognitions
- Qualified in Andhra Pradesh State Eligibility Test (APSET) - 2018
- Best Presentation at National Conference on Advanced Functional Device Materials (NCAFDM-2023) held at Acharya Nagarjuna University, Guntur, India during 27th-28th Feb'2023
- Guest Lecturer, GVN Secondary School, Nepalgunj, NEPAL during 20th-29th Feb'2020
`;

const PHYSICS_KARTHIK_SAIRAM_TEXT = `
## Online Courses
- NPTEL Course: Introduction to Classical Mechanics, Awarded: Elite (29-10-2023)

## Workshops / Conference / FDP
- Participated "INUP-i2i Online Familiarization Workshop on Nanodevice Fabrication & Characterization Techniques" organised by Centre for Nanotechnology, IIT Guwahati from 30 April to 2 May 2025
- Attended offline "Two Day Awareness Session on Quantum Science and Technology" Organised by the Department of Science and Engineering, JNTUK from 26th and 27th April, 2025
- Participated in one week online FDP on "Innovations in High Performance Materials for Sustainable Energy and Environmental Impacts" Organized by Department of Physics, BVRIT Hyderabad College of Engineering, Hyderabad, During 29th Apr -4th May 2024
- Participated in a Five day online FDP on "Sustainable Nanomaterials Engineering for Environmental Applications" Organized by Physics Division, Department of BS&H, GMRIT in Collaboration with Center for Nanotechnology, IIT-Guwahati under INUPi2i Program, During 22-26 Apr 2024

## Achievements
- Qualified APSET-2021
`;

const PHYSICS_MADUGULA_TEXT = `
## Papers Published
- "Increased Degradation of Zinc Sulfide Thin Films under Visible Light Irradiation due to Increased Annealing Temperature" - Co-authored with Dr. Shaik Meera Saheb and P. Sailaja, International Journal of Analytical and Experimental Modal Analysis, Volume XIV, Issue VI, June 2022

## Workshops/Seminars/FDPs/Conferences Attended
- Impactful classroom series, BVRIT Narasapur campus, Hyderabad, 07-09-2025
- "Frontiers in EdTech: What next (FDP4CET-09)," 16-20 June 2025
- Two-day workshop on Research Methodology, 17-18 March 2025
- "Application of MIMO in Healthcare Industry," SSIT College, Sattupally, Khammam, 05-06 June 2023
- "Contemporary Research Trends, Innovation in Materials and Technology," Jeppiaar Institute of Technology, 26-31 August 2024
- "Developing AI-Powered AR/VR in Metaverse Applications," D.N.R. College of Engineering & Technology, Bhimavaram, 21-25 October 2024
- "Innovations in High-performance Materials for Sustainable Energy and Environmental Impacts," BVRIT, Hyderabad, 26 April - 4 May 2024
- "AI&ML Applications to EVs and Electrical Engineering," CVR College, Ranga Reddy, 11-16 March 2024
- "Quantum Signal Processing," Department of ECE, LBRCE, Mylavaram, 14-20 December 2023
- "Learning to be Emotionally Intelligent," The Institution of Electronics and Telecommunications Engineers, Hyderabad Centre, 9 October 2022
- "Recent Advances and Applied Science & Engineering Applications," Vaagdevi College of Engineering, Warangal, 2 September 2022
- "GSM Antenna and Its Development Strategies," IETE, Hyderabad Centre, 7 August 2022
- "Research Advances in Mathematical Modelling and Numerical Techniques," IETE, Hyderabad Centre, 30 July 2022
- "Vedic Mathematics and Its Applications," Knowledge and Skills Pvt Ltd, 20-25 June 2022
- "Ways of Effective Wealth Creation," Vijaya Institute of Technology for Women, Vijayawada, 29 June 2022
- "Fostering Machine Learning for Smart Society," IETE, Hyderabad Centre, 3 July 2022
- "Emerging Trends in Artificial Intelligence," Bhimavaram Institute of Engineering & Technology, 25-31 May 2022
- "Recent Trends on Smart Materials and their Applications," Vardhaman College of Engineering, Hyderabad, 7-11 February 2022
- "EV-Technology," Sai Spurthi Institute of Technology, Sathupally, 25 July 2020
- "Digital Image Processing and Its Applications," Sai Spurthi Institute of Technology, Sathupally, 9-11 July 2020
- "Advances In Optics and Photonics," MLR Institute of Technology, Hyderabad, 4-8 August 2020
- "Roll of Surface Characterization in Materials Research and Failure Analysis," AAR Mahaveer Engineering College, Hyderabad, 1 August 2020
- "Virtual Physics Labs," Malla Reddy Institute of Engineering and Technology, Hyderabad, 4-5 June 2020
- "Art of Effective Teaching," Vidya Jyothi Institute of Technology, Hyderabad, 3-8 August 2020
- "Innovative Teaching Strategies," AAR Mahaveer Engineering College, Hyderabad, 12 August 2020

## Online Courses (Coursera)
- Astro 101: Black Holes - University of Alberta, 14 August 2020
- Introduction to Acoustics - Korea Advanced Institute of Science & Technology, 16 August 2020
- Quantum Optics 2-Two Photons and More - Ecole Polytechnique, 10 August 2020
- Introduction to Ordinary Differential Equations - Korea Advanced Institute of Science & Technology, 11 August 2020
- How Things Work: An Introduction to Physics - University of Virginia, 10 August 2020
`;

const PHYSICS_N_RAMU_TEXT = `
## Publications
- Correlation analysis of land surface temperature on landsat-8 data of Visakhapatnam Urban Area
- Studies on the Dielectric and Structural Properties of Chromium Doped Samarium Ferrite
- Life Cycle Assessment of Samarium Ferrite Materials for Electronic Devices
- The Role of B-site Substitution on the Structural and Dielectric Properties of Samarium Orthoferrite Polycrystals
- Tailoring the magnetic and magnetoelectric properties of rare earth orthoferrites
- Influence of Particle Fracture on the slurry Abrasion Behavior of Weld deposited Martensitic steel
- The Performance of Single Cylinder Diesel Engine by using Schleicher Oleosa Methyl Ester
- Methyl Ester Production from Schlichera oleosa
- Impact of Air Pollutants on Land Surface Temperature in Visakhapatnam Urban Area

## Conference Papers & Presentations
- Life Cycle Assessment of Samarium Ferrite Materials (SME'21, November 2021)
- Structural and Dielectric Properties of Chromium Doped Samarium Ferrite (KMRSE'21, July 2021)
- Structural, Dielectric and Impedance studies on B-site modified Samarium Orthoferrite (NSCGA-2019)
- Structural and Dielectric Studies on B-site doped rare earth Orthoferrites (NCRTPM-2018, February 2018)
- Structural, Dielectric and Magnetic studies of rare earth Orthoferrites (ICMAGMA-2017)
- Investigation of Dielectric and Magnetic properties on rare earth Orthoferrites (ICAFM-2017)
- Dielectric and magnetic studies on rare earth Orthoferrites (ICMRA-2016)
- Influence of Particle Fracture on slurry Abrasion Behaviour (ICAMME'14, December 2014)
- Room temperature multiferroics through rare earth orthoferrites (XVII national conference, February 2014)
- Slurry abrasion behavior of weld deposited steel (AIMTDR-2010)
- Methyl Ester Production from Schlichera oleosa (CTCAB-2011)

## Workshops & Seminars Attended
- NRB Research Dissemination workshop on Titanium Matrix Composites (IIT-Madras)
- Modern Trends on Surface Engineering (VIT University Chennai)
- Challenges in micro and nano manufacturing (Andhra University)
- Engineering physics-II Faculty Development Training (Anna University)
- Functionalized Nano materials workshop (Vel tech University)
- Polymer waste management workshop (JNTU, Hyderabad)

## Faculty Development Programs (FDPs)
- NPTEL Two-month FDP on Laser Based Manufacturing (August-October 2024, IIT Madras)
- NPTEL Two-month FDP on Nanotechnology, Science and Applications (July-September 2023, IIT Madras)
- Application training on Characterization Technique of Material and Devices (CSIR-National Physical Laboratory, March 2022)
- Application training on Scientific Communications (CSIR-National Physical Laboratory, March 2022)
- SEM, FESEM, AFM, XRD training (BARC AEACI, October 2021)
- UGC refresher course at IISC (22 November - 12 December 2019)
- SEM, FESEM, AFM, XRD training (Satyabhama University)
- ASNT level-II certification in multiple testing methods
- Two-week FDP on Contemporary Advances in Materials and Manufacturing Engineering (JNTUK, October-November 2017)
- AICTE-sponsored FDP on Applications of Nanotechnology (November 2013)

## Online Courses (Coursera)
- Astro 101: Black Holes (University of Alberta, August 2020)
- Introduction to Acoustics (Korea Advanced Institute of Science & Technology, August 2020)
- Quantum Optics 2-Two Photons and more (Ecole Polytechnique, August 2020)
- Introduction to Ordinary Differential Equations (Korea Advanced Institute of Science & Technology, August 2020)
- How Things Work: An Introduction to Physics (University of Virginia, August 2020)

## Professional Memberships
- Life member, Indian Science Congress Association (ISCA), Kolkata (Membership: L 33531u)
- Life member, Indian Crystallographic Association (ICA), IISC Bangalore (Membership: LM 533)
- Life member, International Association of Engineers (IAENG), Hong Kong (Membership: 151515)

## Achievements
- GATE Physics 2007 (All India Rank 283)
`;

const PHYSICS_HARI_BABU_TEXT = `
## Papers Published
- Zainab Hussain, S. Hari Babu, V. Raghavendra Reddy - "Appearance of Inverted Hysteresis, Pinning Effect in Amorphous FeCoB Ribbon with Annealing: A Kerr Microscopy Investigation" - J. Non-Crystalline Solids 571, 121073 (2021)
- V. Raghavendra Reddy, Zaineb Hussain, S. Hari Babu, et al. - "Mossbauer and Kerr Microscopy Investigation of Crystallization in FeCoB Ribbons" - AIP Conf. Proc. 1731, 130014 (2016)
- S. Hari Babu, K. V. Rajkumar, S. Hussain, et al. - "Characterizing Microstructural Changes in Ferritic Steels by Positron Annihilation Spectroscopy" - J. Nucl. Mater. 432, 266 (2012)
- S. Hari Babu, G. Amarendra, R. Rajaraman, C.S. Sundar - "Microstructural Characterization of Ferritic/Martensitic Steels by Positron Annihilation Spectroscopy" - J. Phys.: Conf. Ser. 443, 012010 (2013)
- S. Hari Babu, R. Rajaraman, G. Amarendra, et al. - "Dislocation Driven Chromium Precipitation in Fe-9Cr Binary Alloy: A Positron Lifetime Study" - Philos. Mag. 92, 2848 (2012)
- L. Herojitsingh, S. Hari Babu, R. Govindaraj, et al. - "Annealing Effects in Eurofer-97 Steel as Studied by Mossbauer Spectroscopy" - AIP Conf. Proc. 1447, 1321 (2012)
- S. Hari Babu, R. Rajaraman, R. Govindaraj, et al. - "Positron Annihilation Studies in Search of Fine Precipitates in Fe-9Cr alloys" - AIP Conf. Proc. 1349, 1275 (2011)
- V. Ragunanthan, S. Hari Babu, Varghese AntoChirayath, et al. - "Positron annihilation studies on 9Cr reduced activation ferritic - martensitic steels" - Phys. Status Solidi C 6, 2307 (2009)
- O. Annalakshmi, Varghese AntoChirayath, S. Hari Babu, et al. - "Positron lifetime studies of CaSO4:Dythermoluminescence phosphors" - Phys. Status Solidi C 6, 2516 (2009)

## Courses Taught
- Laser Physics and Coherent Optics (PG)
- Nuclear Radiation Detection and Measurements (PG)
- Experimental Techniques in Physics / Material Science (PG)
- Engineering Physics (UG)
- Applied Physics (UG)

## Workshops / Seminars / Conferences Attended
- National Space Science Symposium (NSSS-14), Andhra University, Visakhapatnam (9-12th February, 2006)
- International School on Positron Studies, Saha Institute of Nuclear Physics, Kolkata (14-16th January, 2009)
- International Conference of Positron Annihilation (ICPA-15), Saha Institute of Nuclear Physics, Kolkata (19-23rd January, 2009)
- DAE - Solid State Physics Symposium (55th), M. S. University of Baroda, Vadodara (14-18th December, 2009)
- DAE - Solid State Physics Symposium (54th), Manipal University, Manipal (26-30th December, 2010)
- Trombay Meeting on Positrons in Materials, Medicine and Industry (Positron-2012), Bhabha Atomic Research Centre, Mumbai (12-14th March, 2012)
- Interaction Meeting on Photoelectron Spectroscopy, Raja Ramanna Centre for Advanced Technology, Indore (29-30th August, 2013)
- Thematic Workshop on Physics of Phase Transitions, UGC-DAE Consortium for Scientific Research, Indore (24-25th October, 2013)
- DAE - Solid State Physics Symposium (58th), Thapar University, Patiala (17-21st December, 2013)
- Research Scholars' Workshop on Physics of Materials, UGC-DAE Consortium for Scientific Research, Indore (23-24th December, 2013)
- International Conference on Structural Integrity (ICONS-2014), Indira Gandhi Centre for Atomic Research, Kalapakkam (4-7th February, 2014)
- CSR Lecture Series, UGC-DAE Consortium for Scientific Research, Indore (1-26th September, 2014)
- One Day E-Content Workshop, Central University of Karnataka, Kalaburagi (19th January, 2016)
- International Conference on Recent Trends in Physics (ICRTP-2016), Devi AhilyaVishwavidhyalay, Indore (13-14th February, 2016)
- Condensed Matter Physics under Extreme Conditions (CoMPEC-2016), Bhabha Atomic Research Centre, Mumbai (13-16th April, 2016)

## FDP/Refreshment Courses Attended
- Science Academies' Refresher Course in Experimental Physics, K. L. University, Guntur (14-29th June, 2016)
- Know-Nano workshop, Central University of Karnataka, Kalaburagi (19-21st April, 2016)

## Invited Talks
- Invited talk at SRM-AP University, Amaravati, Andhra Pradesh (March 18th, 2026)
- Invited talk at VIT-AP University, Amaravati, Andhra Pradesh (June 18th, 2022)
- Invited talk in Positron Theme meeting (Positron-2017), BARC, Mumbai (23-24 March 2018)
- Oral talk in International Conference on Structural Integrity (ICONS-2014), IGCAR, Kalpakkam (4-7 February 2014)
- Oral talk in Positron Theme meeting (Positron-2012), BARC, Mumbai (12-14 March 2012)
- Eminent lecture at PM Shri Kendriya Vidyalaya, Ongole, A. P. (September 9th, 2025)

## Memberships
- Life member of India Physics Association (IPA) since 2009 (LM-2009-KAL-12565)
- Life member in Materials Research Society of India (MRSI) since 2010 (LMB1499)

## Technical Skills
- Positron annihilation Spectroscopy: Lifetime (Fast-Fast detector mode with coincidence), Doppler broadening Spectroscopy, Coincidence Doppler broadening Spectroscopy
- Mossbauer Spectroscopy: Transmission mode (4-300 K and 7 T magnetic field)
- MOKE Microscopy (5 K to 800 K and 1 T magnetic field) for domain analysis
- Scanning Electron Microscopy with SE, BSE and EDX analysis
- Electron Microscopy analysis and sample preparation
- Working experience with high vacuum systems, cryogenics and high magnetic fields
`;

const CHEM_HOD_TEXT = `
## Fields of Specialization
- Organic Chemistry
- HPLC
- Environmental Studies & Nanomaterials

## Areas of Interest
- Organic Chemistry
- Pharmaceutical Chemistry

## Research Papers Published
- Hydrotalcite and Hydrotalcite-Based Materials (2024)
- Management of Validation of Stability Indicating HPLC Approach for Determination of Estradiol, Elagolix, and Norethindrone
- Synthesis, characterization, and evaluation of antioxidant, antimicrobial and drug likeness properties of indole containing 1,3,4-oxadiazoles
- Determination of four dry cough medications in fixed dose form by developed stability indicating liquid chromatography
- A comparative study on water quality parameters from rural Indian location (October 2024)
- Structure based drug design method - Molecular docking study on androgenic receptor and prostate specific antigen
- A New Series of Indole and Azaindole Derivatives with Oxo-dihydropyridines: Synthesis, Characterization and Cytotoxicity Studies
- Quality control assessment of dutasteride and silodosin in capsules and tablets
- Molecular docking studies of beta-amyloid protein with natural multiple ligands
- Synthesis and Characterization of New Secretory Phospholipase A2-Inhibitor compounds
- Stability indicating method to analyze benidipine and chlorthalidone using HPLC
- Stability indicating HPLC method for quantification of ubidecarenone and piperine
- Stability Indicating Method Development and Validation of Metformin and Ertugliflozin
- Quantification of Prochlorperazine and Paracetamol Using HPLC
- Synthesis & Bio-Evaluation of M-(Mercapto Acetamido) Phenol Capped Silver Nano Particles (2017)

## Presentations at Conferences
- Quantification of Prochlorperazine and Paracetamol Using HPLC at international conference on Engineering, Technology, pharmacy and management
- Stability Indicating Method Development and Validation of Metformin and Ertugliflozin at ICAST-2019
- Participated in International Conference on Materials Engineering, Materials Chemistry and Materials Physics (MECAP2023), September 25-26, 2023

## Workshops/Seminars/FDP/Courses
- UGC-Malviya Mission Teacher Training Centre Online Refresher Course in Chemistry (October 31 - November 13, 2025)
- FDP on Emerging Trends & Research in Chemistry (May 6-10, 2025)
- Indoor Air Pollution: Sources, Effects, Monitoring, Control and Modelling (12-week course)
- Two-day National workshop on water and sustainable development (March 22-23, 2015)
- Basics in chromatography (May 18-27, 2020)
- Teach online course (June 11-13, 2020)
- Six-day FDP on Recent Development in Chemical Research for Social Applications (August 3-8, 2020)
- Faculty development program on Nano materials - Technologies for Energy & Sensor Applications (June 7-11, 2021)
- National level faculty development program for digital learning (May 25-29, 2021)
- One-week STTP on Innovations in Physics & Chemistry (May 18-23, 2021)
- International one-week FDP on research methodology (May 2-7, 2022)
- One-week online international workshop on Contemporary trends and fundamentals of scientific Research (January 8-12, 2024)
- Virtual one-day international seminar on Unveiling the nano horizons (January 4, 2024)

## NPTEL Courses
- NPTEL Elite in Physico Chemical Processes for Wastewater Treatment (Completed November 2023)
- Environmental Science (Completed November 2023)

## Coursera Courses
- Municipal solid waste management in developed countries
- Work smarter, not harder: time management for personal and professional productivity
- Advance chemistry
- Introduction to Google docs

## Achievements
- APSET qualified in 2017

## Projects
- Science technology and innovation hub funded by DST (Completed September 2023)
- Establishment of Community Resilience Resource Centre CRRC in Bhimavaram Block, West Godavari District, Andhra Pradesh (DST-funded, ongoing)

## Current Research Projects
- Sustainable Groundwater Management
- Physico-chemical processes for wastewater treatment
- Indoor Air Pollution: Sources, Effects, Monitoring, Control and Modeling
`;

const CHEM_GANESH_KADIYALA_TEXT = `
## Fields of Specialization
- Organic Synthesis
- Molecular Modelling
- Molecular Imaging

## Areas of Interest
- Organic Chemistry
- Pharmaceutical Chemistry

## Research Papers Published
- K Ganesh Kadiyala et. al "Zinc (II) metal appended Artificial Nucleases as Anticancer Agents: A Brief Review," Asia-Pacific Journal of Science and Technology, 2025, 30(6), APST-30-06-04
- K Ganesh Kadiyala et. al "Molecular docking simulations on epidermal growth factor receptor (EGFR) with potential lead molecules," Proceedings on Engineering Sciences, 2025, Volume 7, Issue 1, Pages 233-240, DOI: 10.24874/PES07.01B.002
- K Ganesh Kadiyala et. al "Gold catalyzed synthesis of small sized Carbo and Heterocyclic compounds: A Review," Heterocyclic Communications, 2024, 30(1), 20220172, DOI: 10.1515/hc-2022-0172
- K Ganesh Kadiyala et. al "Structure Based Drug Design Method: Molecular Docking Study on Androgenic Receptor and Prostate Specific Antigen with Potential Lead Molecules," Proceedings on Engineering Sciences, 2024, 6(3), pp. 1317-1326, DOI: 10.24874/PES.SI.24.03.005
- K. Ganesh Kadiyala et. al. "A New Series of Indole and Azaindole Derivatives with Oxo-dihydropyridines: Synthesis, Characterization and Cytotoxicity Studies against Breast Malignant Cell Lines," Asian Journal of Chemistry, 2024, 36(3), pp. 669-676, DOI: 10.14233/ajchem.2024.30317
- K Ganesh Kadiyala et al. "Quality control assessment of dutasteride and silodosin in capsules and tablets employing a novel developed HPLC technique," International Journal of Applied Pharmaceutics, 15(6), 2023, 98-107, DOI: 10.22159/ijap.2023v15i6.49036
- K Ganesh Kadiyala et al. "Physicochemical, phytochemical, spectroscopic (lcms, and h1-nmr) analysis of extracts of plumbago zeylanica," Asian Journal of Pharmaceutical and Clinical Research, Vol 17 Issue 2, February 2024, DOI: 10.22159/ajpcr.2024.v17i2.48757
- K. Ganesh Kadiyala et al. "Polymeric and electrospun patches for drug delivery through buccal route: Formulation and biointerface evaluation," Journal of Drug Delivery Science and Technology, Volume 68, February 2022, 103030, DOI: 10.1016/j.jddst.2021.103030
- K. Ganesh Kadiyala et al. "Receptor mapping using methoxy phenyl piperazine derivative: Preclinical PET imaging," Bioorganic Chemistry, Volume 117, December 2021, 105429, DOI: 10.1016/j.bioorg.2021.105429
- K Ganesh Kadiyala et al. "Antimicrobial and Cytotoxicity Studies of Extracts of Plumbago zeylanica," International Journal of Pharmaceutical Sciences Review and Research, May 2021, 12(12):6668
- K. Ganesh Kadiyala et al. "Feasible Solutions and Role of Nanomaterials in Combating the COVID-19 Pandemic: A Preliminary Study," Trends in Biomaterials and Artificial Organs, 34, S2, 2020
- Dr. K Ganesh Kadiyala et al. "Synthesis & Bio-Evaluation Of M-(Mercapto Acetamido) Phenol Capped Silver Nano Particles," International Journal of Multidisciplinary Advanced Research Trends, ISSN: 2349-7408, Volume IV, Issue I(1), January 2017, 27-38
- K Ganesh Kadiyala et al. "Picolinic Acid based Acyclic Bifunctional Chelating Agent and its Methionine Conjugate as Potential SPECT Imaging Agents," RSC Advances, 2015, 5, 33963-33973, DOI: 10.1039/C4RA13690J
- K Ganesh Kadiyala et al. "Metal Based Imaging Probes of DO3A-Act-Met for LAT1 Mediated Methionine Specific Tumor Imaging," Pharmaceutical Research, 2015, 32, 955-967, DOI: 10.1007/s11095-014-1509-x
- K Ganesh Kadiyala et al. "Design and synthesis of calcium responsive magnetic resonance imaging agent," European Journal of Medicinal Chemistry, 82, 2014, 225-232, DOI: 10.1016/j.ejmech.2014.05.046

## Conference Presentations
- Water quality parameter studies (2024)
- Molecular docking studies on androgenic receptor (2023)
- Alzheimer's disease drug design research (2023)
- SPECT imaging agents evaluation (2012)

## International Conferences Attended
- 3rd International Conference on Algorithms in Advanced Artificial Intelligence (2025)
- International Conference on Water Resources, Ocean and Environmental Engineering (2024)
- Virtual International Conference on Multifunctional Advanced Materials (2021)

## Workshops Completed
- National Online Workshop on Research Methodology in Chemical Sciences (2021)
- Intellectual Property Protection and Innovation Management (2021)
- ChemDraw & ChemSketch Software Learning (2022)

## Faculty Development Programs (FDPs)
- Five-Day International FDP on Green Chemistry (2024)
- One-week National Level FDP on Indian Knowledge Systems and NEP-2020 (2024)
- Data Science and Machine Learning Applications (2024)
- Indoor Air Pollution: Sources, Effects, Monitoring, Controlling and Modelling (2024)
- AICTE ATAL Academy Programs on AI/Machine Learning in Chemistry and Healthcare (2024)
- AICTE ATAL Academy Program on Design Thinking and Prototyping for Industry 4.0 (2023)
- Cloud Infrastructure (AWS) Faculty Development (2023)
- Recent Advances in Medicinal Chemistry and Material Science (2023)
- Research Methodology: Tools and Techniques (2022)
- Green Chemistry for Sustainable Development (2022)
- Nanomaterials-Technologies for Energy & Sensor Applications (2021)
- Web Apps & E-Content Development for Digital Learning (2021)
- Chemistry for Societal Advancements (2021)
- Character Building in Modern Human Life (2021)
- Applied Chemistry: A Catalyst for Scientific Transformations (2021)
- Emerging Trends in Nanotechnology (2021)

## Online Courses Completed (NPTEL)
- Physico Chemical Processes for Wastewater Treatment (Elite)
- Indoor Air Pollution: Sources, Effects, Monitoring, Control and Modeling
- Organometallic Chemistry
- Organic Farming for Sustainable Agricultural Production
- Electrochemical Technology in Pollution Control
- Environmental Science (2023)
- Sustainable Groundwater Management (Elite Gold, 2025)

## Achievements
- Ratified as Associate Professor by JNTUK (10 February 2025)
- NPTEL Topper in Indoor Air Pollution course
- Qualified CSIR-NET
- Qualified GATE

## Ongoing Projects
- Establishment of Community Resilience Resource Centre (CRRC) in Bhimavaram Block, West Godavari District (Funded by DST/SEED), Project Duration: 2024-2027
`;

const CHEM_SURESH_VARMA_TEXT = `
## Fields of Specialization
- Physical chemistry
- Environmental Studies & Nanomaterials

## Areas of Interest
- Environmental Chemistry

## Research Papers Published
- "Nanoparticles in treatment of waste water free from P-Nitrophenol and microbes" in International Journal of Environmental Sciences
- Synthesis, characterization, and evaluation of antioxidant, antimicrobial and drug likeness properties of indole containing 1,3,4-oxadiazoles, Results in Chemistry, 17th July 2024
- Structure based drug design method: molecular docking study on androgenic receptor and prostate specific antigen with potential lead molecules, Proceedings on Engineering Sciences, 5th January 2024
- Determination of four dry cough medications in fixed dose form by developed stability indicating liquid chromatography-photodiode array detection, Acta Chromatographica, 8th Aug 2024
- Physical Organic Chemistry, Infinite Research, 26/11/2024
- Molecular docking simulations on epidermal growth factor receptor (EGFR) with potential lead molecules, Proceedings on Engineering Sciences, 2025
- Quality Control Assessment of Dutasteride and Silodosin in Capsules and Tablets Employing a Novel Developed HPLC Technique
- Catalytic Effect of TX-100/SDS Mixed Micelles on the Hydrolysis of [Fe (tpy)2] 2+ Complex
- Adsorptive Micellar Flocculation And Cloud Point Extraction As Pre-Concentration Methods For The Determination Of Phenosafranine Dye In Aqueous Solutions
- A New Series of Indole and Azaindole Derivatives with Oxo-dihydropyridines: Synthesis, Characterization and Cytotoxicity Studies against Breast Malignant Cell Lines

## Presentations at Conferences
- Presented "Evaluation of Predictive Models and Framework for Format Verification" at ICAAAI-2025, organized by CSE Department, SRKR Engineering College, BVRM
- Presented paper "Facile Green synthesis of reduced Graphene oxide by Dioscoreaceae family plant extract and its application for super capacitors" at International Conference on Materials Engineering, Materials Chemistry and Materials Physics (ME CAP2023), Sagi Ramakrishnam Raju Engineering College, Bhimavaram, 25-26 September 2023

## Workshops/Seminars/FDP/Courses
- FDP on AI Tools organized by Brain Vision Solutions & AICTE, New Delhi, 17-21 February 2025
- FDP on Emerging Trends & Research in Chemistry organized by B V Raju College, Bhimavaram, 6-10 May 2025
- FDP on Innovative Materials for Sustainable Development-2025 by Chemistry Research Centre and Centre for Sustainability, KCG College of Technology, 9-11 June 2025
- Hands on Training on e-Tools for Research (Online), 12-13 March 2024
- One Week Online Program, IP MAXIMA-2023 organized by Innovative Technology Enabling Centre-Intec, CSIR-Institute of Minerals and Material Technology (IMMT), Bhubaneswar, 11-16 December 2023
- 6 Day Faculty Development Program on Indian Knowledge Systems conducted by UGC-HRD, 21-26 August 2023
- National level faculty development program for digital learning conducted by Institute of Advance Studies of Agartala, 25-29 May 2021
- "Basics in Chromatography" jointly organized by DIPAM Foundation & M.N Science College, Patan, 18-27 May 2020
- 2 week course on "Digital Transformation in Teaching Learning Process" from 16-20 March 2020 under TEQIP III
- Organometallic Chemistry, 4 week course cum FDP
- Hands on training on Instrumental Methods of Analysis organised by Satyabhama University and IIT Madras, 5-10 January 2026

## Training Programs
- Google Prompting Essentials offered by Google (completed)
- Green Audit Program from RUA, EcoSpaces LLP Mumbai (completed)
- ELITE Silver certification in 8-week NPTEL course on "Accreditation and Outcomes"
- ELITE certification in 12-week NPTEL course on "Sustainable Groundwater Management"
- NPTEL Elite Silver in course Physico Chemical Processes for Waste Water Treatment
- 12 Week NPTEL Course on Air Pollution and Control with Elite Silver (completed)
- Indoor Air Pollution: Sources, Effects, Monitoring, Control and Modeling, 12 weeks course cum FDP

## NPTEL
- Environmental Science (completed November 2023)
`;

const CHEM_KIRANMAI_DEVI_TEXT = `
## Fields of Specialization
- Organic chemistry
- Environmental studies

## Areas of Interest
- Environmental Chemistry

## Research Papers Published
- "Molecular docking simulations on epidermal growth factor receptor (EGFR) with potential lead molecules," Proceedings on Engineering Sciences, 2025, Volume 7, Issue 1, Pages 233-240
- "Structure based drug design method: molecular docking study on androgenic receptor and prostate specific antigen with potential lead molecules"

## NPTEL Certifications & Workshops
- ELITE certification in "Sustainable Groundwater Management" (12-week course)
- NPTEL Elite Gold in "Physico Chemical Processes for Waste Water Treatment"
- NPTEL Elite in "Indoor Air Pollution: Sources, Effects, Monitoring, Control and Modelling"
- Environmental Science course (completed November 2023)
- "Nanomaterials for Clean and Sustainable Environment" short-term course (July 17-22, 2023)
- International webinar on green chemistry innovations (September 10-14, 2024)
- National workshop on "Frontiers in Chemical Research" (February 17-21, 2025)
- International faculty development program on "Innovations in High-Performance Materials" (April 29 - May 4, 2024)
`;

const CHEM_KANAKA_DURGA_TEXT = `
## Fields of Specialization
- Organic Chemistry
- Environmental Studies

## Areas of Interest
- Food chemistry

## Research Publications
- Published book chapter on cyclodextrin UV-absorbing molecular complexes for photodynamic therapy applications
- "Molecular docking simulations on epidermal growth factor receptor (EGFR) with potential lead molecules" in Proceedings on Engineering Sciences (2025)
- "Structure based drug design method: molecular docking study on androgenic receptor and prostate specific antigen with potential lead molecules"

## NPTEL Courses & Certifications
- Completed 12-week NPTEL course on sustainable groundwater management
- NPTEL Elite Gold in Physico-Chemical Processes for wastewater treatment
- NPTEL Elite in Indoor Air Pollution course (12 weeks)
- Environmental Science course completed November 2023

## Workshops & Faculty Development Programs
- National workshop on "Frontiers in Chemical Research: Innovations and Applications" (February 17-21, 2025)
- National one-week FDP on Research Methodology (July 22-27, 2024)
- International webinar on innovative green chemistry approaches (September 10-14, 2024)
- IP Awareness program under National Intellectual Property Awareness Mission (March 18, 2024)
- International online FDP on high-performance materials (April 29 - May 4, 2024)
- Short-term course on nanomaterials for clean environment (July 17-22, 2023)
`;

const CHEM_MURALI_KRISHNA_MADASU_TEXT = `
## Professional Certifications
- APSET: Andhra Pradesh State Eligibility Test qualified (2019)

## Fields of Specialization
- Organic Synthesis
- Synthesis of Hybrid Nano Composites
- Synthesis and Characterization of Graphene oxide and graphene oxide quantum dots
- Development of multi-functional nano composites for photocatalytic degradation

## Areas of Interest
- Organic Chemistry
- Engineering Chemistry
- Nano Chemistry

## Research Publications
- "Sulfonated grapheneoxide as a sustainable metal free acid catalyst" (2025) - DOI: 10.1007/s44344-025-00018-3
- "Synthesis of flourine substituted benzimidazole-pyrazole molecules" in African Journal of Biological Sciences (2025)
- "Reduction Of P-Nitroaniline Using Plant Mediated Co-Nps" in Journal of Chemistry and Technologies (2022)
- "Phytochemical Screening and Study of Antioxidant, Antibacterial, Antifungal activities" in African Journal of Biological Sciences (2024)
- "Biologically Active Benzofused Bioisosters" in Advanced Research in Chemistry (book chapter)

## Paper Presentations at International Conferences
- Presented paper on "Synthesis, Characterization, Photocatalysis, and Magnetic Study of Magnetic-Semiconductor Hybrids Nanocomposites" at ME CAP2023 (September 2023)

## Workshops/Seminars/FDP/Courses Attended
- 5-Day Faculty Development Program on "Role of Modern Tools and Techniques in Chemistry" (May-June 2024)
- National Conference on "Nano Materials for Next Generation" (January 2024)
- Two-Day International Seminar on "Research methodology in Environmental Science" (January 2024)
- 6-Day "Orientation & Teacher Retraining Programme" sponsored by UGC (March 2020)
- 7-Day "Teacher Training Programme on Usage of ICT in Teaching Learning Process" under RUSA 2.0 (December 2019)
- 3-Day National Level Workshop on "Research Methodology - Mechanism for Effective Implementation" (November 2019)
- One-Day State level Symposium "ASPIRE -2018" (December 2018)
- One-Day District Level Workshop on "Instrumentation-Chemistry Practical, Paper-IV" (November 2014)
- One-Day District Level Workshop on "Stratospheric Ozone" (September 2014)
- State Level Competition on "Challenges And Applications of Chemistry" (November 2013)
- Six Days FDP Training Programme for Degree College Teachers on Chemistry (December 2011)

## Online Courses Completed
- Sustainable Groundwater Management, Elite (July-October 2025)
- NPTEL Elite Gold in Physico Chemical Processes for waste water treatment
- Indoor Air Pollution: Sources, Effects, Monitoring, Control and Modeling (12 weeks)

## Achievements
- APSET-2019 Qualified
`;

const CHEM_KISHORE_MALLELA_TEXT = `
## Fields of Specialization
- Organic chemistry
- Polymer Chemistry
- Materials Science and Engineering

## Areas of Interest
- Organic Chemistry
- Polymer Chemistry
- Solid Polymer Electrolytes
- Lithium Batteries

## Research Papers Published
- "Precise Synthesis of Acrylate-Terminated Poly(Triethylene Oxide Glycidyl Ether) via Anionic ROP for Enhanced Lithium-Ion Conductivity in Hybrid Solid Electrolytes," DOI: 10.1021/acs.macromol.5c02312
- Yadagiri LNK Mallela, Sohyeon Kim, Gyuwon Seo, Jin Won Kim, Santosh Kumar, Jaeyoung Lee, Jae Suk Lee. "Crosslinked poly (allyl glycidyl ether) with pendant nitrile groups as solid polymer electrolytes for Li-S batteries." Electrochimica Acta 2020, 362, 137141. DOI: 10.1016/j.electacta.2020.137141
- Yadagiri LNK Mallela, Se Young Jeong, Santosh Kumar, Jae Suk Lee. "Hyperbranched Poly(glycidol)-Grafted Silica Nanoparticles for Enhancing Li-ion Conductivity of Poly(Ethylene Oxide)." Macromol. Mater. Eng. 2020, 2000572. DOI: 10.1002/mame.202000572
- Chang-Geun Chae, Yong-Guen Yu, Ho-Bin Seo, Myung-Jin Kim, Y. L. N. Kishore Mallela, Jae-Suk Lee. "Molecular design of an interfacially active POSS-bottlebrush block copolymer for fabrication of three-dimensional porous films." Macromolecules 2019, 52, 1912-1922. DOI: 10.1021/acs.macromol.9b00089
- Myung-Jin Kim, Yong-Guen Yu, Chang-Geun Chae, Ho-Bin Seo, In-Gyu Bak, Y. L. N. Kishore Mallela, Jae-Suk Lee. "Omega-Norbornenyl Macromonomers: In Situ Synthesis and ROMP." Macromolecules 2019, 52, 103-112. DOI: 10.1021/acs.macromol.8b02223
- Chang-Geun Chae, Yong-Guen Yu, Ho-Bin Seo, Myung-Jin Kim, Mallela Y. L. N. Kishore and Jae-Suk Lee. "Molecular and kinetic design for expanded control of molecular weights in ring-opening metathesis polymerization." Polym. Chem., 2018, 9, 5179-5189. DOI: 10.1039/C8PY00870A
- Hyeri Lee, Byunggyu In, Pramod Kumar Mehta, Mallela YLN Kishore, KeunHyeung Lee. "Dual role of a fluorescent peptidyl probe based on self-assembly for detection of heparin." ACS Appl. Mater. Interfaces 2018, 10, 2282-2290. DOI: 10.1021/acsami.7b15411
- Ponnaboina Thirupathi, Joo-Young Park, Lok Nath Neupane, Mallela YLN Kishore, Keun-Hyeung Lee. "Pyrene excimer-based peptidyl chemosensors for sensitive detection of low levels of heparin." ACS Appl. Mater. Interfaces 2015, 7, 14243-14253. DOI: 10.1021/acsami.5b01932

## Conference Presentations
- Polymerization of 2-(2-(2-methoxyethoxy)ethoxy)ethyl glycidyl ether
- Bottlebrush Block Copolymers of POSS-poly(benzyl methacrylate)
- Photonic crystals from brush block copolymers

## Professional Development
- FDP on "Frontiers in Edtech: What's Next?" (June 16-20, 2025)
- "Quantum Science and Technology" awareness sessions (April 26-27, 2025)
- NPTEL course completion in "Processing of Polymers and Polymer Composites"

## Achievements
- Ratified as Assistant Professor by JNTUK (February 10, 2025)
`;

const CHEM_MADHURI_VERMA_TEXT = `
## Fields of Specialization
- Aerosol monitoring
- Environmental science
- Atmospheric Sciences
- Risk Assessment
- Tropical Metrology
- Precipitation Chemistry
- Climatology

## Areas of Interest
- Aerosol monitoring
- Environmental science
- Atmospheric Sciences
- Risk Assessment
- Tropical Metrology
- Precipitation Chemistry
- Climatology

## Research Papers Published
- Princy Dugga, Shamsh Pervez, Rakesh Sahu, Madhuri Verma, Shahina Bano, Manas Kanti Deb (2017) - Journal of Ravishankar Shukla University-B
- Shamsh Pervez, Madhuri Verma, Suresh Tiwari, Y. F. Pervez (2018) - Science of the Total Environment
- Madhuri Verma, Dipanjali Majumdar, Shamsh Pervez (2018) - International Journal of Environmental Science and Technology
- Madhuri Verma, Shamsh Pervez, Manas Kanti Deb, Dipanjali Majumdar (2018) - Asian Journal of Chemistry
- Archi Mishra, Madhuri Verma, Shahina Bano, Princy Dugga, Sushant Ranjan Verma, Aishwaryashri Tamrakar, Sheeba Shafi, Vineeta Gupta (2021) - Journal of Indian Chemical Society
- Shamsh Pervez, Princy Dugga, Mohammad Nahid Siddiqui, Shahina Bano, Madhuri Verma, Carla Candeias, Rakesh Kumar Jha (2021) - Groundwater for Sustainable Development
- Madhuri Verma, S. Pervez, Judith Noor A. Khan, P. Mandal, Rajan K.Chakrabarty (2021) - Atmospheric Pollution Research
- Aishwaryashri Tamrakar, Shamsh Pervez, Madhuri Verma, Dipanjali Majumdar, Yasmeen Fatima Pervez, Carla Candeias, Indrapal Karbhal (2022) - Water Air Soil Pollution
- Archi Mishra, Shamsh Pervez, Madhuri Verma, Aishwaryashri Tamrakar (2022) - Science of The Total Environment
- S. R. Verma, Madhuri Verma, Princy Dugga, Noor Afshan Khan, Manmohan Lal Sharma (2022) - ACS Earth and Space Chemistry
- S. R. Verma, S. Pervez, P. Khan, N.A., Tiwari, S., Chandra Dumka, M. Verma (2023) - ACS Earth and Space Chemistry
- A. Mishra, S. Pervez, Madhuri Verma, P. Dugga, S. R. Verma, I. Karbhal (2025) - Environmental Geochemistry and Health
- A. Gangwar, S. K. Alla, Ankur Sharma, Madhuri Verma, Shubham Shaw, Tapas Das (2025) - Solid State Sciences
- A. Gangwar, Madhuri Verma, S. K. Alla (2025) - "Advanced Functional ceramic membranes and Applications, Wiley Library"

## Conferences
- AICON'2016 - Clean & Green Technology (April 22-23, 2016)
- National Conference on Soil Quality & Public Health (January 17-18, 2017)
- UGC-SAP National Conference on Advances in Environmental & Chemical Sciences (March 17-18, 2017)
- AICON'2016 - Transformation in Chemical Science (April 22-23, 2016)
- International Conference on Environmental Health and Sustainable Development (November 14-16, 2017)
- 22nd CRSI National Symposium in Chemistry (February 2-4, 2018)
- UGC-SAP National Conference on Advances (March 22-23, 2018)

## Workshops/Seminars/FDP
- Attended NEP 2020 Orientation & Sensitization Programme under Malaviya Mission Teacher Training Programme of UGC at Pt. Ravishankar Shukla University Raipur

## Achievements
- Test of analytical quality assurance (AQA) and statistical analysis
- Varimax principal component analysis (PCA)
- Positive matrix factorization (PMF)

## Subjects Handled
- Environmental science
- Spectroscopy and analytical techniques
- Remote sensing
- Instrumentation

## Memberships
- Served as a member of the Working Group on Environmental Management, State Planning Commission Task Force (CECB) (June 2022-June 2023)
- Lifetime member of Chemical Research Society of India: LM 2026
`;

const ENGLISH_HOD_TEXT = `
## Research Papers Published
- "Road Map to Basic Communication" - International Journal of English and Literature (IJEL) ISSN 2249-6912 Vol. 3, Issue 4, Oct 2013, 129-136
- "Internet - A Multifaceted Teacher" - International Journal of Educational Science and Research (IJESR) ISSN(P): 2249-6947; ISSN(E): 2249-8052 Vol. 4, Issue 1, Feb 2014, 47-52
- "Improving English Writing Skills of Undergraduate Students from Engineering Colleges in Andhra Pradesh Region" - Turkish Online Journal of Qualitative Inquiry, Volume 12 No.8 (2021)
- "Performance and Assessment of Undergraduate Students in Effective English Writing Skills" - Elementary Education Online, 2021; Vol 20 (Issue 6): pp. 1085-1095

## Workshops/Seminars/FDP/Conferences Attended
- International Conference on Calamity and Catastrophe in World Literature in English, Andhra University, Vizag, 28-29 March 2022
- Three Day Workshop on "English for Writing Ph.D Thesis and Journal Papers," National Institute of Technology Tiruchirapalli, 20-22 January 2016
- Cambridge English Language Assessment Certificate, Cambridge English Teachers Support Workshop, 30-31 July 2014
- Four Hour Creative Writing Workshop "Field Guide to Reality," British Council, Hyderabad, 9 December 2013
- "Challenges Behind Technical English Teaching," St. Stanley College of Engineering & Technology, 10 August 2007
- Quality Improvement Programme - Student Counselling and Career Guidance, NITTT&R Chennai, 20-21 June 2008
- Six Day Faculty Enablement Program - Softskills, IEG-JKC & Globarena Technologies Pvt. Ltd., 11-16 February 2008
- Quality Improvement Programme, NITTT&R Chennai, 27 June - 2 July 2005
- Refresher Course on "Communication Skills in English," College of Engineering Gudlavalleru/UGC-Academic Staff College, 15-20 September 2005
- Quality Improvement Programme, NITTT&R, 21-26 June 2004
- Quality Improvement Programme, TTTI Chennai, 15-18 May 2000

## Administrative Experience
- Head of Department, Department of English, 2020

## Awards & Recognitions
- "Best Teacher Award" given by Padmabhushan Dr. B.V. Raju (Founder Chairman), 1999
`;

const ENGLISH_PRASANTHI_TEXT = `
## Professional Affiliations
- Life Member of ISTE

## Research Papers Published
- "A case study of women's entrepreneurship dynamics in three rural districts of Andhra Pradesh, a south indian state" (journal of infrastructure, policy & development, Q2, Enpress Publisher-2024)
- "Role of Advanced English in Engineering Colleges" (Proceedings of Engineering Sciences)
- "English Language Teaching through Innovative Teaching Methods" (Scopus) Journal of Xidian University DOI:10.37896/jxu17.9/078 ISSN No:1001-2400, 2023
- "A Literary Activity in Language Class: Identification of Rhetorical Devices Used by Steve Job's in his Speech 'Stay Hungry Stay Foolish'" (A PLETHORA OF THOUGHTS A Compilation of Research Papers, ISBN, pg no:113 (WOS), 2022)
- "Reflective teaching Practices in English language classroom" (English Studies, International Research Journal (WOS), Vol-3, Issue-2, 2015)
- "Language through literature: Paulo Cohelo's The Alchemist" (International Research Journal (WOS), Vol-2, Issue-1, 2015)

## Papers Presented
- English Language in Journalism (International Conference on English Language and Literature: Readings and Reflections at GITAM University, Hyderabad, 7th & 8th August 2015)
- 'Reflective teaching Practice in English language classroom' (International Conference on Advances in English Studies & Women Empowerment, August 21 & 22, 2015 at KL University, Vaddeswaram, Guntur)
- Language through literature: Paulo Cohelo's The Alchemist (International Conference at K L University, 28th & 29th March 2015)
- 'Speaking Skills a Key Element of Employability' (International conference on Teaching English for Employability conducted by English Language teachers Association of India Thoothukudi (ACE) Chapter, 21st & 22nd November 2013)

## Workshops/Seminars/FDP/Conferences Attended
- Five day FDP on "Transformative Teaching and Research: using AI Tools and Adaptive Technologies" (02-09-2024 to 06-09-2024, in collaboration with Andhra University, Department of Basic Sciences & Humanities, GMRIT, Vizianagaram)
- Five day FDP on "ELT - Innovative Approaches and Methods" (18-04-2024 to 23-04-2024, Department of English & Humanities, ANITS, Visakhapatnam)
- One-week international level virtual faculty development program on Inter disciplinary Concepts (SR University, Warangal, Nov 27-Dec 2, 2023)
- One-week National level virtual Faculty Development Programme on "Innovative teaching strategies and tools in the Digital age" (Ministry of Education's Institution Innovation Council (IIC GGI Ludhiana), Nov 20-26, 2023)
- British Council Spoken English Course & Career and Personality Development Course seminar (Dec 30, 2022)
- Three-day National level FDP on Online Teaching using ICT Tools (23-6-20 to 25-6-20, Dr. K.S. Raju & Science College, Penugonda, WG.Dt)
- Online workshop on Basic English Communication skills (SVECW, 4th June to 6th June 2020)
- Workshop on "English for Writing Ph.D Thesis Writing & Journal paper" (Department of English, SVECW Bhimavaram, 19th to 23rd October 2016)
- Workshop on Language Laboratory Systems (Dr. K.S. Raju & Science College, Penugonda, WG.Dt, 23-11-2006)
- Five day training program on Listening and Speaking Skills (APSCHE, 15th August to 19th August 2006, Andhra University, Vishakapatnam)
- Staff development program on student counseling and career guidance (National Institute of Technical Teachers Training and Research, 20-06-2008 to 21-06-2008)
- AICTE sponsored staff development program "Teacher and the Taught" (SVECW, 24th March to 30th March 2010)
- One Day Workshop on 'Women Empowerment thro' awareness of health hygiene & nutrition' (26th April 2011, JNTUK)
- UGC sponsored National Seminar on communication skills and English Literature (D.N.R College, 25th February 2011)
- UGC Sponsored National Seminar on Teaching of Spoken English in Rural Colleges (SVKP and Dr. K.S. Raju Arts and Science College, Penugonda, 28th and 29th Nov 2008)
- Two Day workshop on Making English Classes Learner-Centered (JNTUK University college of Engineering, Vizianagaram, 10th & 11th March 2014)
- Cambridge English Teachers Support workshop (SVECW, 30th and 31st July 2014)
- Two Day National Seminar on Powerful Pedagogical Practices (BVRIT Hyderabad, 31st October and 1st November 2014)

## Online Courses
- NPTEL - Soft Skill Development - 8 weeks

## Administrative Experience
- Coordinator - Anti Ragging
- Coordinator - Graduate Study Abroad Centre
- Coordinator - Arts - Presentation Movement
- Co-Coordinator - IET Student Chapter
- Member - Academic Council, SVECW
- Department Coordinator - Prathibha Magazine
- Department Coordinator - Internal Audit Committee
- Department Coordinator - NAAC
- Overall Coordinator for Clubs activities

## Projects
- ECHO - Building Environment Conservation Heroes 2021 Project
`;

const ENGLISH_KISHORE_VARMA_TEXT = `
## Workshops / Seminars / FDP / Conferences Attended
- Completed one-week National level Faculty Development Program on "Financial Econometrics Using E-Views" organized by Department of Management Studies, Vardhaman College of Engineering, Shamshabad, Hyderabad from 20th to 26th November, 2023
- Participated in one-week Online Multi-Disciplinary Faculty Development Programme on "MOOCs, E-Content Development and OER", Government of Karnataka, Department of Collegiate Education, Government First Grade College, Hungund
- Attended a Workshop on Andhra Pradesh Higher Education English Communication Skills Project organized by APSCHE & British Council
- Attended an international Conference on "Imaging the post corona virus world Virtual International Conference"
`;

const ENGLISH_PRASAD_TEXT = `
## Research Publications
- Paper in Inspira Journal on "An Innovative Teaching of English Language through Flipped Classroom", June 2022
- Paper in PARISHODH Journal, Volume IX, Issue VI on "Tradition and Modernity in Girish Karnad's Plays" (June 2022)
- Book chapter on English Language Teaching, "The Present Scenario of Indian Education" (January 2024)

## Conference Presentations
- International conference on Languages, Innovation, Culture and Education (October 23-24, 2021)
- International virtual conference on perspectives from Basic Sciences and Humanities (May 26-27, 2023)

## Professional Certifications & Recognitions
- English for IT 1 certification from Cisco Networking Academy
- Grade A in Refresher Course on Research Methodology and Data Analysis (December 2025 - January 2026)
- NEP 2020 Orientation Programme, NIT Warangal (November 21-29, 2025)
- VIP Member of International Teachers Association
- CEFR B2 certification in English
- Best Faculty Award, 2009

## Professional Development Workshops
- Eight-day NEP 2020 Orientation Programme (November 2025)
- Five-day Faculty Development Program on "Enhancing Teaching Excellence" (April 21-25, 2025)
- ELTAI Webinar 138 on Research and Publication (September 28, 2025)

## Administrative Experience
- Coordinator for Foreign Languages Training (since 2015)
`;

const ENGLISH_DEVAKI_DEVI_TEXT = `
## Professional Affiliations
- E24M00205 - English Language Teachers Association of India

## Research Papers Published
- "Unwrapping Symbols: Exploring O. Henry's Message in 'The Gift of the Magi'" published in "International Journal of Research (IJR)" e-ISSN: 2348-6848, p-ISSN: 2348-795X Vol. 10 Issue 11, November 2023

## Workshops / Seminars / FDP / Conferences Attended
- National Seminar on "Emerging Trends in English Language Pedagogy" at Andhra Loyola Institute of Engineering & Technology on 11&12 March 2016
- Workshop on "English for Writing Ph.D Thesis Writing & Journal paper"
- Online workshop on Basic English Communication skills workshop
- National webinar on "Teaching English & Literature online in the post covid-19 scenario" organized by Y.N College on 20th June 2020
- One day International Webinar at Velammal College of Engineering and Technology, Madhurai on 23 & 24 2021
- One day National Webinar on creative writing on 20th November 2021
- One Week Online Faculty Development Programme on "Major Literary Theories" organized by Department of English, Krishna University held from 26th July, 2022 to 02nd August, 2022
- Six day FDP research methodology for English Literature and Language at Bharathiar university, Coimbatore, Tamilnadu from 11-07-2022 to 16-07-2022
- One week FDP on "Contemporary Trends and Approaches of English Language Teaching & Soft skills" at SRM, Delhi from 16th to 21st May 2022
- Three day National Webinar on "Project/ Research Synopsis and Proposal Writing" at Andhra Loyola college, Vijayawada on 23, 24 & 25 May 2022
- TOFEL program on "Teaching the TOFEL test" on 10 August 2023
- One week FDP on "Recent Trends in English Studies" at Pillaiyanmanai from 23 to 29 November 2023

## Online Courses
- Verb Tenses & Passives
- Conjunctions, Connectives & adverb clauses
- Perfect tenses & Models
- Professional Emails Speak English Professionally: In Person, Online on the Phone

## Administrative Experience
- Actively involved in NBA and NAAC Accreditation work
`;

const ENGLISH_ARUN_KUMAR_TEXT = `
## Professional Affiliations
- E21M00848 - English Language Teachers Association of India

## Papers Presented
- "Struggle for Preserving Dalit Identity" at UGC Interdisciplinary Global seminar, Department of English, Acharya Nagarjuna University (7-9 September 2009)

## Workshops/Seminars/FDP/Conferences Attended
- One-day national workshop on "English Accent training: A Trainer Training Program," Department of English, KBN College (Autonomous) (25 November 2017)
- One-day National Workshop on "ESL Classrooms: Meeting Curricular and Corporate Goals," Department of English, KBN College (Autonomous) (21 August 2018)
- One-day Symposium on "Classroom Communication in Digital Era: Approaches and Challenges," Department of English, KL University (31 August 2018)
- ELTAI Workshop on "Continuous Professional Development," Visakha Government Degree College for Women (2019)
- EFLU Seminar on "ELT-Issues and challenges"
- ELTAI workshop on "The impact of process based learning on students' Cognitive Engagement"
- Yogi Vemana University seminar on "Current Perspectives in Indian English Literature"
- St. Peter College seminar on "Climate of Non Belonging and Gender distaste"
- ELTAI workshop on "Questioning Skills for the Classroom"
- ELTAI workshop on "Four Simple Principles to Improve Academic Writing"
- VSR&NVR workshop on "Employability Skills: Steps to Success"
- Krishna University seminar on "Elucidating the Ancient Wisdom and Universalism in Fourth World Literature"
- Sreesankara College seminar on "Engaging Theory"
- ELTAI workshop on "The Teaching of Tenses"
- Post Graduate Department of English, Mahatma Gandhi College seminar on "Introducing Medical Humanities"

## NPTEL Achievements
- "Advanced Instructional Methods" online certification course from NITTTR Bhopal (January-May 2025)
- "Phonetics And Phonology: A Broad Overview" NPTEL FDP online certification course from IIT Guwahati (January-March 2025)
- "Mastering Speaking and Presentations: A case Based Approach" NPTEL FDP online certification course from IIT Kharagpur (February-April 2025)
- "Communication Skills in English" online certification course from NITTR Chennai (January-May 2025)
- "Basic Instructional Methods" online certification course from NITTTR Bhopal (July-December 2024)
- "Technical English for Engineers" online FDP certification course from IIT Madras (July-September 2019)
- "Effective Writing" NPTEL online certification course from IIT Roorkee (January-February 2020)
- "Enhancing Soft Skill and Personality" course from IIT Kharagpur (February-April 2020)
- "English for Career Development" online course from Coursera (May 2020)
- Technical English for Engineers (NPTEL-FDP)
- ARPIT-2020 (UGC-FDP)
- ARPIT-2021 (UGC-FDP)
- Effective Writing (NPTEL-FDP)
- Soft Skills and Personality Development (NPTEL-FDP)
- Student Psychology (SWAYAM-FDP)
- Teaching Learning in General Programmes (SWAYAM-FDP)
- Innovative Strategies of Teaching and Learning (SWAYAM-FDP)
- Communication Skills Modes & Knowledge Dissemination (SWAYAM-FDP)

## Recognitions
- Recognized as "NPTEL DISCIPLINE STAR" by IIT-Madras (January-April 2025)
- Recognized as "NPTEL BELIEVER" by IIT-Madras (July-December 2025)
`;

const ENGLISH_MA_KHAN_TEXT = `
## Research Publications
- "English language teaching through infotainment activities" published in Journal of Data Acquisition and Processing. ISSN 1004-9037, DOI: 10.5281/Zenodo. 7778415
`;

const ENGLISH_SUNITHA_TEXT = `
## Professional Affiliations
- Association of Physical Education

## Publications
- "An Analysis of School Education in West Godavari district, Bhimavaram Division: A study" ISSN 2277-7881, IGMER, November 2023, Suchartha Publications
- "An Analysis of School Education in Andhra Pradesh: A Study in West Godavari District" ISSN 2277-7881, IGMER, December 2023, Suchartha Publications
- "Comparison of Blood sugar levels among physically active and inactive members" ISBN 978-1-5175-0353-6
- "Comparison of Blood Sugar among Physically active and inactive male and female faculty member" (2nd Author), ISBN: 978-93-83729-26-5, published by Sucharitha Publication, Visakhapatnam, 2014

## Professional Development
- Participated in Refresher Course on Physical Education at JNTU Kakinada
`;

const ENGLISH_PUSHPA_TEXT = `
## Administrative Experience
- Actively involved in NBA and NAAC Accreditation work
- Participated in "7 DAYS ONLINE FACULTY DEVELOPMENT PROGRAM ON ESSENTIAL" skills development program (01.07.2024 - 07.07.2024), organized by Star International Foundation for Research and Education
`;

const ENGLISH_MD_SIDDIQ_TEXT = `
## Administrative Experience
- Actively involved in NBA and NAAC Accreditation work
`;

const ENGLISH_SARADA_DEVI_TEXT = `
## Professional Affiliations
- E24M00203 - English Language Teachers Association of India

## Research Papers Published
- "AI-Driven Cross-Cultural Communication Enhancer for English Learners: Bridging Language and Cultural Understanding" in 4th International Conference on Innovative Sustainable Computational Technologies (CISCT), IEEE
- "Enhancing Speaking Skills among Engineering Students Using Role-Play Activities" in Journal of Critical Reviews (JCR)
- "Unwrapping Symbols: Exploring O. Henry's Message in 'The Gift of the Magi'" in International Journal of Research (IJR), Vol. 10 Issue 11, November 2023
- "Urmila: An Unsung Myth of an Outstanding Woman" in Kavita Kane's Sita's Sister, published in A PLETHORA OF THOUGHTS compilation

## Workshops / Seminars / FDP / Conferences Attended
- Completed "Refresher Course" under Malaviya Mission Teacher Training Programme (MM-TTP), UGC, organized by MMTTC, IIT Patna (17-29 November 2025)
- Participated in Short Term Course on Feminist Research Methodology (27 October - 1 November 2025)
- Completed "Short Term Programme on Teacher Effectiveness and Professional Development" under MMTTP, UGC, organized by Malaviya Mission Teacher Training Centre, Indira Gandhi National Tribal University, Amarkantak (3-8 February 2025)
- Participated in Refresher Course in Teaching & Research in Social Sciences (14-27 January 2025)
- Presented "Social Conventions and Identity Crisis in Kavita Kane's Novels: A Study" at Two-Day International Conference on Revisiting History, Ethnicity and Myth in Literature, Amity University Rajasthan, Jaipur (19-20 October 2023)
- Presented "Rediscovering Women in Myths: A Critical Analysis on Kavitha Kane Novels" at National Seminar on Confluence of Tales, Myths and Culture in Literature (4 August 2023)
- Participated and presented "The Mahabharata: A Compendium of Ancient Indian Culture and History" at Interdisciplinary International Conference on Mahabharata Epic Across Asia, sponsored by ICSSR (29-31 May 2023)
- Presented "Rediscovering Women in Myths: Study of Kavita Kane's Karna's Wife: An Outcast Queen" at International Virtual Conference on Perspectives from Basic Sciences and Humanities-NEC-IVCPBSH-2023, Narasaraopeta Engineering College (26-27 May 2023)
- Presented "Revisualizing Myth in Indian Writings in English" at UGC Sponsored Virtual Conference on Contemporary Trends in World Literatures, Language and Cultural Studies in English, organized jointly by Department of English (BSSS) and Christ College, Kerala (29-30 September 2023)
- Presented "Spectate the character through the lens of Kavitha Kane's Outcaste Queen: Karna's Wife" at International Conference on Multidisciplinary Research in Sciences & Humanities (ICMRSH-2022) (17-18 February 2022)
- Participated in one-day International virtual conference on Research Methodologies of Contemporary Times: Exploring English Language, Literature and Teaching, SRR & CVR Government Degree College (Autonomous), Vijayawada (5 February 2022)
- Presented "Re-visualizing Myths In Indian Writings in English" at UGC-sponsored two-day virtual International Conference on Contemporary Trends in World Literatures, Languages and Cultural Studies in English, Departments of English, BSSS and Christ College (A) Kerala (29-30 September 2021)
- Participated in 4-Day Online Faculty Development Programme on Revised Manual of SSR, organized by IQAC Immanuel College, Dimapur in collaboration with IQAC Cluster India (8-11 June 2022)
- Participated in One Week FDP on Contemporary Trends and Approaches of English Language Teaching & Soft Skills, Department of English & Foreign Languages and Department of CDC & Placement, SRMIST, Delhi-NCR Campus, Ghaziabad (16-21 May 2022)
- Participated in International Seminar on "Recent Research Trends in Language and Literature" at Vellore Institute of Technology, Chennai (26-27 May 2022)
- Participated in Five Day National Level Workshop "Unfolding Vistas In The Research Of Language, Literature And Psychology" organized by SRM Institute Of Science And Technology Ramapuram, Chennai (14-18 February 2022)
- Attended National Level Five-Day Virtual Workshop "From Writing to Publication: A Workshop on Research Paper Writing in English Literature and ELT" organized by Department of English in association with IQAC, Jain College (17-21 January 2022)
- Participated in 3-Day Online Workshop "How Teachers Can Make a Difference" organized by Teaching Learning Center (TLC), Indian Institute of Technology Madras (22-24 December 2021)
- Attended Workshop on Andhra Pradesh Higher Education English Communication Skills Project organized by APSCHE & British Council
- Attended International Conference on "Imaging the post corona virus world Virtual International Conference"
- Attended Five-Day International Faculty Training Programme on "Online Teaching Tools for Video Lecturing and Digital e-Learning," coordinated by IQAC, Sir C.R Reddy (A) College, Eluru
- Attended Online Research Lectures on Language Literature and Linguistics, Division of English, Department of Sciences and Humanities, VFSTR Deemed to be University
- Attended Three Day National Level Online FDP on "COVID-19 as Global Crisis: Appreciation of Language and Literature," Andhra Loyola Institute Of Engineering And Technology, Vijayawada
- Attended "Teaching English Online" Five-Day Online FDP with Hands-on Experience, organized by Lendi Institute of Engineering And Technology (A), Vizianagaram
- Attended Virtual Summit on "Covid-19: Impact on Education, Technology, Environment & Mankind," Andhra Loyola Institute Of Engineering
- Participated in one week Online Multi-Disciplinary Faculty Development Programme on "MOOCs, E-Content Development and OER," Government of Karnataka, Department of Collegiate Education, Government First Grade College, Hungund
- Completed one week STTP on Advanced Research Methodology, organized by Rest Society For Research International

## Online Courses Completed
- English for Research Paper Writing (8-week course)
- Academic Writing (With Research & Publication Ethics Part A & Part B) (12 weeks)
- Research Methodology (12 weeks)
- Online certification course in "Speaking effectively" from IIT Kanpur (12-week course)
- NPTEL Online certification course "History of English Language & Literature" conducted by IIT Madras (12-week course)
- Coursera certification course on "Strategies for Teaching Perfect tenses and Models"

## Administrative Experience
- Actively involved in NBA and NAAC Accreditation work
`;

const ENGLISH_VASUMATHY_SRINIVAS_TEXT = `
## Research Papers Published
- "English Language Teaching through Infotainment Activities" Journal of Data Acquisition and Processing 2023, 38 (3): 6917-6937
- "Advancing Grammar Correction in ESL Writing through Deep Learning Techniques: A Comprehensive Approach" - 2025 3rd International Conference on Integrated Circuits and Communication Systems (ICICACS) - 979-8-3315-0845-6/25 (C)2025 IEEE

## Workshops/Seminars/FDP/Conferences Attended
- Five-day online Faculty Development Program "Transformative Teaching and Research: Using AI Tools and Adaptive Technologies" (02-06 September 2024)
- 5-day faculty development program "ELT - Innovative Approaches and Methods" (18-04-2024 to 23-04-2024)
- Paper presentation at 3rd International Conference on Integrated Circuits and Communication Systems (21-22 February 2025)
- Seven-Day National online FDP on "Recent Trends in English Studies" (23-29 November 2023)
- Teaching the TOEFL Test Certification programme (10.8.23)
- 1-week online FDP on "Contemporary Trends and Significance of English Language Communication" (10-15 October 2022)
- Six-Day online FDP on "Research Methodology for English Literature and Language" (11-16 July 2022)
- 1-week online FDP on "Major Literary Theories" (26 July-2 August 2022)
- Three-Day National Seminar on "Project/Research Synopsis and Proposal Writing" (23-25 May 2022)
- 1-Week National online FDP on "Contemporary Trends and Approaches of English Language Teaching and Soft Skills" (16-21 May 2021)
- Five-Day National Workshop on "English for Writing Ph.D. Thesis and Journal Papers" (19-23 October 2016)
- Ten-Day Teacher Training Programme conducted by APSCHE and British Council (10-14 July 2017 & 24-28 July 2017)
- 3-Day VEDIC workshop on Scientific Educational Practices (12-14 June 2017)
- 3-Day "Pedagogic and Personal Effectiveness Workshop" in Hyderabad (7-9 March 2016)
- Two-Day National Seminar on "Emerging Trends in English Language Pedagogy" (11-12 March 2016)
- Workshop on "Pedagogic & Teaching Effectiveness" (22 January 2016)
- Seminar on "Challenges in Teaching English for Engineering & Non-Engineering Students" (06-10-2012)

## Administrative Experience
- Served as Head of Department of H&BS and Vice Principal at Sri Sivani Institute of Technology, Chilakapalem, Srikakulam (2008-2014)
- Actively involved in NBA and NAAC Accreditation work

## NPTEL/Online Certifications
- SWAYAM Online Course Certification for Communicative English (University of Calicut, May 2024)
- NPTEL Online Course Certification for Soft Skills (IIT Roorkee, October 2024)
`;

const ENGLISH_DEVIKA_BABU_TEXT = `
## Workshops / Seminars / FDP / Conferences Attended
- Presented a paper in 3rd International Conference on Solution Focused Practices (ICSFP)
- Attended a Workshop on Psychological Stress in Adolescents & Teenagers
- Attended a Workshop on Applied Behavior Analysis
- Attended a Seminar on Marital Counselling
- Attended a Seminar on CBT- Core Skills & Techniques

## Online Courses
- Trauma Informed Counselling
- Telephonic Suicide Prevention

## Achievements / Awards
- 2nd Rank Holder University in BSc Psychology
- UGC NET Qualified
- Honors Student - MSc Psychology
`;

const ENGLISH_RAJESH_BATTU_TEXT = `
## Faculty Development Programs (FDPs)
- Participation in Five-Day online FDP on Teaching English Online organized by Department of English, Lendi Institute of Engineering & Technology Vizanagaram
- Three-Day National Level FDP on online Teaching Using ICT Tools organized by Department of Electronics & Computer Science in association with IQAC, SVKP & Dr K S RAJU ARTS & SCIENCE COLLEGE Penugonda
- One-week FDP on "Literary Criticism" for Faculty and Research Scholars, organized by PG Department of English, Thiruvalluvar University Constituent College of Arts & Science, Kallakurichi, Tamil Nadu
- Seven-Day Online International FDP: Language and Literature - A Pragmatic Approach organized by Development of English, VET Institute of Arts and Science, Erode
- One-week International FDP on Research strategies and Promotion of Teaching Learning Process organized by Department of English from Bharat Institute of Engineering and Technology, Hyderabad, Telangana
- UGC (Paramarsh) Online One-Week FDP On "E-Content Development" organized by Shri Shivaji College, Parbhani
- Five-Days International FDP on "Digital Mind Mapping For Online Teaching and Learning & G-Tools" organized by Department of Basic Science & Humanities, Vignan's Institute of Management & Technology for Women, Hyderabad
- Five-Days National Faculty Enrichment Programme on "Digital Technology for Teaching of Life Sciences and Humanities" organized by PG and Research Department of Zoology in collaboration with Indian Science Congress Association, Dr. Ambedkar Government Arts College, Vysarpadi, Chennai
- Three-day Online FDP on "E-Learning Management System" organized by Yogi Vemana University Kadapa
- Three-Day National Level FDP on "online Teaching using ICT Tools" organized by Department of Electronics & Computer Science in association with IQAC, SVK & K S RAJU ARTS & SCIENCE College Penugonda
- Online FDP on "Interactive Online Teaching" organized by Nesamony Memorial Christian College, Marthandam, Tamil Nadu
- Two-Days National Level Online FDP on "Online Teaching Tools and Development of E-Content" organized by Department of Management Studies, Sri Sivani College of Engineering, Chilakapalem, Srikakulam
- Three-Days National Level Online FDP on "Enriching English and Communication Skills for Professionals" organized by Department of Humanities and Science Bharati Vidyapeeth's Jawaharlal Nehru Institute of Technology (poly) Dhanakawadi, Pune
- Two-Days National Level Online FDP on "Professional Ethics in Teaching" organized by Department of Humanities and Basic Sciences, Sri Sivani College of Engineering, Chilakapalem, Srikakulam
- One-Day Online FDP on "Communication & Presentation Techniques" organized by K.B College of Arts & Commerce For Women
- One-Day Online FDP on "Dynamics of e-learning and strategies: Skill oriented tools in 21st century" organized by Department of Basic Sciences, Bonam Venkata Chalamayya Engineering College, Odalarevu

## Conferences
- Participated in 1st E-Learning workshop on "Design, Development & Delivery Of Online Course" organized online by special Center for E-Learning (SCEL) Jawaharlal Nehru University, New Delhi
- Participated in mini conference on Covid-19: A scope for Remote Learning & Innovative Teaching organized by ELTA Warangal Urban, Telangana
- Participated in National Level E-Conference on "Contemporary Trends In Literature" organized by Munger University, Bihar
- Participated in International E-Conference on "Language, Literature and Media in Contemporary Times" organized by school of studies in Literature and Language, Pt Ravishankar Shukla University, Raipur, Chhattisgarh
- Participated and completed Assignments and Assessments in 10-days National level FDP on "Pedagogy of Teaching and Tools on E-Content Development for Effective Teaching" organized by IQAC, Christopher Arts and Science College, Soorangudi, Via-Nanguneri, Tirunelveli, Tamil Nadu, India
- Certificate of participation in NEP2020 ORIENTATION & SENSITIZATION PROGRAMME organized by UGC-MMTTC, Maulana Azad National Urdu University, Hyderabad (2nd to 11th January, 2024)

## International Webinars
- Three-Days International Webinar on "Communicative English Skills For Engineering Students And Faculty" organized by Mar Baselios Institute Of technology And Science (MBITS) in association with ASAP & TCS, Nellimattom, Kothamangalam, Kerala
- Two-Days International Webinar on "Problems and Prospects Of Online Language Teaching" organized by Department Of English, Anurag University, Venkatapur, Hyderabad
- Two-days International Webinar on "Recent Trends In Teaching English Language and Literature to Digital Natives" organized by PG and Research Department of English, Idhaya College For Women, Kumbakonam, Tamil Nadu
- Nine-Days International Webinar on "Ethnoliterature and Environment: Northeast Indian And Southeast Asian Literature In Context" organized by Post Graduate Department Of English, Sree Narayana College for Women, Kollam, Kerala
- One-Day International Webinar on "Embracing Wordsworth: A Quarter-millennial Commemoration" organized by Department Of English, Kamaraj College, Thoothukudi, Tamil Nadu
- One-Day International Webinar on "Post Corona Higher Education Initiatives VS Academic challenges: Winners & Losers" organized by Gayatri College For PG Courses under management Gurajada Educational Society, Munasabpeta, Srikakulam
- One-Day International Webinar on "Developing Core Skills In Classroom" organized by IQAC & Alumni association of Department OF English & Research, Nesamony Memorial Christian College, Marthandam, Kanyakumari District, Tamil Nadu
- One-Day International Webinar on "Using e Tools To Teach English During Covid-19 And After" organized by SG Govt. Degree College, Piler
- One-Day International Webinar on "Nuances Of Indian Literature And Translation: Home And Abroad" organized by Department of English, Nowgong College
- Five-Days International Webinar Series "Beyond the Covid-19 pandemic: Development and Challenges" jointly organized by Social work-wing Directorate of Distance Education, Alagappa University and Department Of Social Work, Central University of Tamil Nadu

## National Webinars
- Webinar titled "Linguistics and Phonetics" organized by Amurtha Varshini's Instructor, Aid Virtual
- One-Day Webinar on "The Importance Of Pronunciation And Functional English In Communication" organized by Department OF Basic Sciences & humanities, Vignan Institute Of technology & Science, Telangana
- One-Day National level Webinar on "Learning Vocabulary is the Crux Of Language Learning" organized by Department OF Basic Sciences & humanities, Nasaraopeta Engineering College, Guntur
- One-Day Webinar on "Verbal And Non-Verbal Communication Skills In Modernity" organized by Department OF humanities and Sciences, Pallavi Engineering College, Hyderabad
- One-Day Webinar on "Online Tools For Building Communication Skills" organized by Department OF English, Government Degree College For Women, Srikalahasti, Andhra Pradesh
- One-Day National Webinar on "Speaking Skills For A successful Teaching" organized by Center for Capacity Building Programme For School Teachers, Tamil Nadu Teachers Education University
- One-Day Webinar on "Communicative Approach In English" organized by Department OF Science & humanities, P.T Lee Chengalvaraya Naicker College of Engineering And technology
- One-Day National Webinar entitled "Teaching English as a Second Language: Problems and Possibilities" organized by Department of English, Government Degree College, Seethanagaram, East Godavari
- Two-Days National Webinar on "Teaching English Language And Literature Through Online Resources" organized by Department of English, Adikavi Nannaya University MSN Campus, Kakinada
- National Webinar on "Blended Learning and Task Based Learning: An Integrated Approach to English Language Learning" organized by PG Department of English, Saraswathi Narayanan college, Perungudi, Madurai, Tamil Nadu
- Webinar on "Academic Writing" organized by Department of English, Kumaraguru College of Technology, Coimbatore
- National Webinar on "Teaching English Language Online in the Post Covid-19 Scenario" organized by Department of English, Sri Y N College Narsapur, Andhra Pradesh
- Interactive Webinar on "Contemporary Trends In Literature and culture" organized by Department of English and other foreign Languages, SRM Institute of Science and Technology, Ramapuram campus, Chennai
- One-Day National Level Webinar on "Simplification of Literary Theories" organized by Department of English, Nanjai Edayar Sankara Kandaswami Kandar's College, P. Velur, Tamil Nadu
- National Level Webinar on "Introduction To Indian English Literature And Short Fiction In Indian English Literature: An Overview" organized by PG Department of English, Thiruvalluvar University Constituent College Of Arts & Science, Kallakurichi, Tamil Nadu
- One-Day National Webinar on "New Directions In English Literary Studies: Texts And Contexts" organized by St. Francis De Sales College, Nagapur, Maharashtra
- Webinar on "Career Opportunities In the Corporate Sector For Language Connoisseurs" organized by Department of English, Bengaluru North University, Kolar
- Online Course On "Quarantine Literature" organized by Department of English, A.P.C Mahalaxmi College For Women, Thoothukudi, a registered online course under Graduate student association, University of Waterloo, Canada
- Webinar "Scope of An Actor In Theater Webinar 2020," organized by Department of English, Tagore college of Arts and science, Chennai
- National Webinar on "The Language Of Literature: Role Of Modern Linguistics In Literary Interpretation" organized by Department of English and sponsored by Department of Higher Education, Govt. Of M.P under MPHEQIP-Academic Excellence, Jawaharlal Nehru Smriti Govt. P.G College, Shujalpur, Madhya Pradesh
- National Webinar on "Drama: What can the first Scene Tell us?" organized by Department of English, Indian Academy degree College -Autonomous, Kalyan Nagar, Bangalore
- National Webinar on "Research Methodology" organized by Loyola College, Chennai
- Five-Day National Level Webinar Knowledge series on "Horizons in Research" organized by Tamil Nadu teacher Education University, Chennai, Lady Willigdon Institute of Advanced study in education, Chennai and stella Matutina College of Education, Chennai
- Two-Day National Webinar on "Re-Reading and Re-contextualising Literary Text in Times of Pandemic" organized by Department of English in collaboration with IQAC, Amdanga Jugal Kishore Mahavidyalaya, West Bengal
- Four-Day Webinar on "Strategies for Effective Assessing and Teaching" organized by Department of English, Gudlavalleru Engineering College, Gudlavalleru, Andhra Pradesh
- Webinar "ICT In Education During And After Covid-19" organized by Department of English, SNM Training College, Moothakunnam in collaboration with Christ College, Irinjalakuda
- National Webinar on "Blended Mode of Learning is Compulsion or Choice" organized by Sri GCSR College, Rajam, Srikakulam
- Two-Day State level online workshop on "Learning Management System (LMS) An Introduction to Google Classroom" organized by VSM College, Ramachandrapuram
- Webinar on "Online Tools for Effective Virtual Teaching And Learning" organized by Stella Matutina College of Education Chennai
- Two-Day National Webinar on "Demonstration of Online Educational Tools" organized by University College of Engineering Adikavi Nannaya University, Rajamahendravaram
- National Webinar on "Teaching, Learning And Evaluation In Post Covid Era-Introduction to Google Classroom" organized by Department of Physics & Mathematics, SVKP & K S RAJU ARTS & SCIENCE College, Penugonda
- Webinar on "Virtual Classroom Series1: ICT In Teaching -Learning Process in Covid times" organized by Department of Basic Science and Humanities, Christ College Of Engineering, Irinjalakuda
- Webinar on "Virtual Classroom Series2: Moodle & Video tutorials using open Broadcasters" organized by Department of Basic Science and Humanities, Christ College Of Engineering, Irinjalakuda
- Webinar on "Virtual Classroom Series3: Google Classroom- A learning Management System" organized by Department of Basic Science and Humanities, Christ College Of Engineering, Irinjalakuda
- Webinar on "Web 2.0 Tools for Teachers" organized by IQAC, Nesamony Memorial Christian College, Marthandam, Tamil Nadu
- National Level Webinar on the topics "Digital Humanities and Netiquette" organized by PG Department of English TVUCAS, Kallakurichi, Tamil Nadu
- One-Day National Level Webinar on "Technological and Pedagogical innovations through Steam education to foster creative in a digital era" organized by Department of Mathematics and Computer Science, Mizoram university
- One-Day National Webinar On "Steps For better Life Style" organized by Adikavi Nannaya University MSN Campus, Kakinada
- Webinar On "Ethics And Values in Teaching and Learning" organized by Department of English, Kumaraguru college of Technology, Coimbatore
- National Webinar On "The Philosophical foundation of education: An overview" organized by Department of Philosophy in collaboration with IQAC, Karmashree Hiteswar Saikia College, Assam
- Webinar "The Journey Within-Know yourself & Know the World" organized by IQAC, St. Joseph's College, Tiruchirappalli
- Webinar On "Precautions of Covid-19" organized by Department of History & Sociology, S. K. R. College For Women, Rajamahendravaram
- Webinar On "Significance of Social work Profession in the Context of New social Environment" organized by Department of Social Work, Adikavi Nannaya University, Rajamahendravaram
- Webinar On "In Sync With Industry" organized by Department of English, Chaitanya Bharathi Institute of Technology, Hyderabad
- Two-day I.C.P.R sponsored International Seminar on "Yoga For Health, Happiness And Harmony" organized by Department of Sanskrit, philosophy
- Webinar On "New Education Policy - New Opportunities" jointly organized by Department of Journalism and Mass Communication, Dr. BRAU-SKLM and Regional Outreach Bureau, Vijayawada
- National Webinar On "National Education Policy 2020-Impact & Implications" organized by Department of Commerce, University College of Commerce and Business Management, Osmania University, Hyderabad, Telangana
- National Webinar On "New National Education Policy - Implications To HR" organized by National HRD Network, Vijayawada Chapter powered by P.B. Siddhartha College of Arts & Science, Vijayawada
- Webinar On "New Education Policy - Its Importance & Impact on India" organized by SG Govt Degree College Piler
- National Webinar On "Impact Of Government's Innovative and PathBreaking Policies Of Education In Andhra Pradesh" organized by College Department Council and Media Cell Nannaya University, Rajamahendravaram, A.P
- National Webinar On "The Role Of Teacher Education In Implementation Of National Education Policy" organized by IQAC & Innovation and Best practices Center of Tamil Nadu teachers Education University, Chennai in Collaboration with IQAC of Annammal College of Education For Women, Thoothukudi
- International Lecture-series on "Understanding NEP-2020: An Evening With The Intellectuals" organized by Department of English in Collaboration with IQAC, Netaji Subhash Mahavidyalaya, Udaipur, Gomati District, Tripura

## Online Quizzes
- Successfully Completed An International E-Quiz On "Life and Works Of William Shakespeare" organized by Department of English, Govt. College Khilchipur, Rajgarh, Madhya Pradesh
- Successfully qualified in National Level Quiz On "English Literature" Part-I (Poetry: From Age Of Chaucer to Present Day) organized by Department of English, Govt. T.C.L. P.G College Janjgir, Chhattisgarh, Rajgarh
- Successfully qualified in National Level Quiz On "English Literature" Part-III (Prose) organized by Department of English, Govt. T.C.L. P.G College Janjgir, Chhattisgarh, Rajgarh
- Successfully Completed National Level E-Quiz On "Historical Perspective" organized by Department of History and IQAC, Besant Women's College, Mangaluru, Karnataka
- Participated in National Level Online quiz on "Effective Communication" organized by Department of Basic Science & Humanities Of S.S.G.B College Of Engg. & Tech Bhusawal
- Successfully Completed National Level Online Quiz On "English Literature" organized by Department of English, Poompuhar College Nagapattinam, Tamil Nadu
- Participated in National Level E-Quiz of English On "Synonyms" organized by Department of English, School Of Humanities And Social Sciences, Shri Guru Ram Rai University, Dehradun, Uttarakhand
- Participated in National Level Online Quiz On "English Language & Literature" organized by Department of English, K.B.N College, Vijayawada
- Successfully Completed National Level Online Quiz On "English Literature" organized by Department of English, Balaji Institute Of Technology & Science, Laknepally, Narsampet, Warangal, Telangana
- Successfully qualified in National Level 'English Language Proficiency Test' organized by Aurora's Technological and Research Institute, Uppal, Hyderabad
- Successfully Completed the Quiz On "Basic Grammar" organized by Department of English, Arulmigu Kalasalingam Polytechnic College, Anand Nagar, Krishnankoil
- Participated in Online Quiz On "Articles" organized by Department of English, B.S.S.B. Degree College, Tadikonda, Guntur
- Successfully Participated in Online Quiz On "Teaching Aptitude And Professional Commitment" organized by Department of English, S.C.I.M Government Degree College, Tanuku, West Godavari, Andhra Pradesh
- Successfully Completed Online Quiz On "Active and Passive Voice" organized by Department of English, P.A.C Ramasamy Raja Polytechnic College, Rajapalayam
- Successfully Completed the GyaanELL E-Litzz Quiz On "African Literature" organized by Department of English and Research & IQAC Of NMCC, Marthandam, Tamil Nadu
- Successfully Completed Online Quiz On "Arts, Culture and Entertainment" organized by Fine arts Committee, Kandaswami Kandar's College, Velur, Tamil Nadu
- Successfully Completed the GyaanELL E-Litzz Quiz On "History of English Literature" organized by Department of English and Research & IQAC Of NMCC, Marthandam, Tamil Nadu
- Successfully Completed online Quiz entitled "English Literature" organized by Department of Humanities & Sciences (English), Guru Nanak Institutions
- Successfully Completed Online Quiz On "English Language & Literature 'Unlock Your Knowledge'" organized by School of Social Sciences & Humanities, CMR University
- Successfully Participated in Online Quiz On "English Grammar" organized by Department of English, D.S. Government Degree College, Ongole Tanuku, Prakasam dist.
- Successfully Participated in Online E-Quiz-II On "Tense" organized by Department of English, GSSS Bhuna, Fatehabad, Haryana
- Successfully Participated in National Level Online Quiz On "Communication & Soft Skills" organized by Department of English, Govt, Degree College, Jaggampeta, East Godavari District, Andhra Pradesh
- Successfully Participated in Online E-Quiz On "Article" Conducted by Department of English, GSSS Bhuna, Haryana
- Successfully Participated in Online E-Quiz On "Modern Literature" organized by PG Research Department of English, Bharathiar University Arts And Science College, Modakkurichi, Tamil Nadu
- Successfully Participated in Online Quiz On "Tenses" organized by Department of English, B.S.S.B Degree College, Tadikonda, Guntur
- Successfully Participated in Online Quiz On "English Grammar And Vocabulary" organized by Department of English, Government College For Women Srikakulam
- Successfully Participated in Online Quiz entitled "A Proficiency Test in Communicative English" organized by Department of humanities & Sciences (English), Guru Nanak Institutions Technical Campus, Ibrahimpatnam, Hyderabad
- Successfully Participated in E-Quiz On "Vocabulary as a part of English Quiz Series-I" Conducted by English Faculty, Department of Humanities & Basic Sciences, GPREC, Kurnool, Andhra Pradesh
- Successfully Participated in Online E-Quiz On "English Literature" organized by Department of English, Madurai Kamaraj University Constituent College, Vedasandur, Tamil Nadu
- Successfully Participated in Online Quiz On "IDIOMS" organized by S.V.K.P College, Markapur, Prakasam Dt.
- Successfully Participated in Online Quiz On "Jane Austen" organized by Department of English, Swami Shukdevanand PG College, Shahjahanpur, U.P.
- Successfully Participated in Online Quiz On "English Grammar" organized by Mahaveer Institute Of Science and Technology, Bandlaguda, Hyderabad
- Successfully Participated in Online Quiz On "English Literature & Grammar" organized by Department of English, The Hindu College, Machilipatnam
- Successfully Participated in English literary E-quiz-2020-III "American Literature" organized by Department of English, Kalasalingam Academy of Research and Education
- Participated in National Level Online Quiz on "English Grammar" organized by Department of Humanities & Sciences, K.S.R.M College, Kadapa
- Successfully Participated in Online Quiz On "Indian Polity" organized by Department of Political Science, S.K.B.R. Govt Degree College, Macherala, Guntur
- Successfully completed National Level Online Quiz On "ICT TOOLS IN EDUCATION" organized by Department of Mathematics, Dr. S.R.K. Govt. Arts College, Yanam
- Successfully Participated in National Wide Online Quiz On "Psychology" organized by Young Researchers Forum, Mumbai and Administrative office, Central Tribal University Of Andhra Pradesh, Vizianagram
- Successfully Participated in National Level E-Quiz On "Women's Excellence" organized by Women Grievance Redressal Cell, IQAC In collaboration With UGC-New Delhi, Government of Karnataka, Govt First Grade College & PG Studies In Commerce, Narasimharajapura, Chikamagalur
- Successfully Participated in National Level Online E-Quiz On "the Occasion of Teacher's Day" organized by Department of Environmental Science, Balaji Institute of technology & Sciences, Narsampet, Warangal
`;

const CSE_HOD_TEXT = `
## Educational Qualifications
TABLE:
Degree | Organization | Specialization | Year
PDF | University of Louisiana at Lafayette, USA | Artificial Intelligence | 2024
Ph.D. | JNTU Hyderabad | Artificial Intelligence | February 2015
M.E | Anna University | C.S.E | 2006
B.Tech | JNTU | C.S.E | 2002

## Professional Affiliations
- Life Member CSE, ISTE, IEI

## Publications in National/International Journals
- "Enhancing rainwater harvesting and groundwater recharge efficiency with multi-dimensional LSTM and clonal selection algorithm" - Groundwater for Sustainable Development (2024) (SCI)
- "SLA based Workflow Scheduling algorithm in Cloud Computing using Haris Hawks optimization" - EAI Endorsed Transactions on Scalable Information Systems (2023)
- "Crowd Counting and Anomaly Detection from CCTV footages using deep learning augmented with cellular automata" - Journal of Theoretical and Applied Information Technology (2023)
- "Crop Disease Prediction with Convolution Neural Network (CNN) Augmented With Cellular Automata" - Int. Arab J. Inf. Technol (2022) (SCIE)
- "A secure cellular automata integrated deep learning mechanism for health informatics" - Int. Arab J. Inf. Technol (2021) (SCIE)
- "NTCA: A novel text clustering algorithm built on Cellular Automata based Local Search and K-Means algorithm" - Research Journal of Biotechnology (2008) (SCIE)
- "Identification of Protein Coding Regions in Genomic DNA Using Unsupervised FMACA Based Pattern Classifier" - IJCSNS International Journal of Computer Science and Network Security (2008) (ESCI)
- "Exploring a novel approach for providing software security using soft computing systems" - International Journal of Security and Its Applications (2008) (ESCI)

## Book Chapters Published
- "DLHAP: A Novel Deep Learning with Hybrid CA Mechanism for Heart Attack Prediction" - Innovations in Computer Science and Engineering, Lecture Notes in Networks and Systems, vol 385, Springer, Singapore (2022)
- "DLCP: A Robust Deep Learning with Non-linear CA Mechanism for Lung Cancer Prediction" - Innovations in Computer Science and Engineering, Lecture Notes in Networks and Systems, vol 385, Springer, Singapore (2022)
- "Usage of AI Techniques for Cyberthreat Security System in Android Mobile Devices" - International Conference on Innovative Computing and Communications, ICICC 2023, Lecture Notes in Networks and Systems, vol 703, Springer, Singapore (2023)
- "Visual Learning with Dynamic Recall" - Soft Computing and Signal Processing, ICSCSP 2022, Smart Innovation, Systems and Technologies, vol 313, Springer, Singapore (2023)
- "Usage of Classifier Ensemble for Security Enrichment in IDS" - 2022 International Conference on Automation, Computing and Renewable Systems (ICACRS), IEEE (2022)
- "A Declarative Systematic Approach to Machine Learning" - 2022 International Conference on Smart and Sustainable Technologies in Energy and Power Sectors (SSTEPS), IEEE (2022)
- "A Context Sensitive with Effective Task Migration in Mobile Cloud Computing Services" - 2023 3rd International Conference on Computing and Information Technology (ICCIT), IEEE (2023)
- "Waste Management Detection Using Deep Learning" - 2023 3rd International Conference on Computing and Information Technology (ICCIT), IEEE (2023)
- "Cloud Computing and Virtualization" - Convergence of Cloud with AI for Big Data Analytics: Foundations and Innovation, Wiley, USA (2023)
- "Revolutionizing Agriculture: Exploring Advanced Technologies for Plant Protection" - Handbook of Research on AI-Equipped IoT Applications in High-Tech Agriculture, IGI Global (2023)
- "DLCDI: A Novel Deep Learning Mechanism for Chronic Diseases Identification" - Intelligent Information Retrieval for Healthcare Systems, NOVA Science Publishers, USA (2021)

## Published Books
- Fundamentals of Deep Learning: Theory and Applications (2023) - Academic Guru Publishing House, ISBN: 8119152530, 9788119152537
- Essentials to the Secret of Cyber Security (2022) - Walnut Publication, ISBN: 9355743939
- Fundamentals of IoT & BigData (2023) - Scientific International Publishing House, ISBN: 9789357574693
- Software Engineering (2023) - AASANS Publications, ISBN: 9788119313136

## Research Scholars Awarded
- Two Scholars from JNTU Kakinada pursuing Ph.D

## Patents
- Two Patents are granted
- Fourteen patents filed and published in Artificial Intelligence and Deep Learning

## Courses Taught
- Undergraduate: Artificial Intelligence, Data Structure, Theory of Computation
- Postgraduate: Secure Software Engineering, Advanced DS

## Achievements & Awards
- Bibliography listed in Marquis Who's Who in the World, 29th Edition (2012), USA
- Bharat Excellence Award from Dr. G.V. Krishna Murthy (Former Election Commissioner of India) - Two times
- Rashtrya Ratan Award
- Best Regius Professor of the Year (AI & BI)
- Veteran Scholar of Excellence Award
- Bharat Education Excellence Award
- Dr. A.P.J. Abdul Kalam National Pratibha Award
- Best Teacher Award from SERF India
- Global Supervisor Award (2026)
- Various best paper awards from international conferences

## Research Funding Secured
- Rs. 17 lakh DST-TIDE Innovation Project (PI, 2025-2027)
- Rs. 97,000 under ATAL Programme for Faculty Development Programme (FDP)
- Rs. 55,000 in conference funding

## Career Overview
- Current Position: Professor & HOD, CSE Department, SVECW
- Previous: Principal, N.B.K.R. Institute of Science and Technology
- Previous: Vice Principal, KITS Engineering College
- Previous: Head of Department CSEIT, Aditya Engineering College
- Over 20 years of teaching experience
- Board of Studies Member: AI, ML, and Computer Science Engineering programs under JNTU Kakinada and Vikrama Simhapuri University
- Faculty Champion: University Innovation Fellows (UIF) program, Stanford University's d.school
- Global Position: Vice President, World Statistical Data Analysis Research Association

## Research Metrics
- 181 Scopus-indexed publications
- 163 Web of Science-indexed publications
- 5 Scopus-indexed publications from postdoctoral research

## Research Interests
- Artificial Intelligence, Machine Learning, Deep Learning, Big Data Analytics, Bioinformatics, Cloud Computing, Data Science

## Professional Activities
- Delivered over 200 keynote addresses, FDPs, workshops, seminars, and webinars
- Active mentor for faculty, researchers, and students in AI research
- Strong focus on innovation and entrepreneurship
`;

const CSE_PURUSHOTHAMA_RAJU_TEXT = `
## Educational Qualifications
TABLE:
Degree | Institution | Specialization | Year
Ph.D. | Acharya Nagarjuna University | Data Mining | 2017
M.Tech | JNTU College of Engineering, Anantapur | Software Engineering | 2003
B.Tech | GKM College of Engineering & Technology, Chennai | CSE | 2001

## Fields of Specialization
- Data Mining
- Data Science

## Professional Affiliations
- Life Member in CSI
- Life Member in ISTE
- Life Member in IE

## Publications in National/International Journals
- Sandhya Potturi and V. Purushothama Raju, "Efficient Privacy Control Approach for Cloud Based Healthcare Systems", International Journal of Research, vol. 12, no. 6, June 2023.
- G Ganga Bhavani and V. Purushothama Raju, "Collaborative Service Recommendations for Data Sharing using Block Chain", International Journal of Research, vol. 12, no. 7, July 2023.
- V.S.A. Padmini and V. Purushothama Raju, "A Systematic Approach for Crop Prediction using Deep Learning", International Journal of Engineering Research & Technology (IJERT), vol. 11, no. 11, Nov. 2022.
- V. Uma Sreya and V. Purushothama Raju, "Intelligent Tutoring System for Personalized Feedback", Journal of the Maharaja Sayajirao University of Baroda, vol. 55, no. 2, Sept. 2021.
- Kurada Uma Keerthi and V. Purushothama Raju, "Diabetic Retinopathy Detection Using Convolutional Neural Networks", Journal of the Maharaja Sayajirao University of Baroda, vol. 55, no. 2, Sept. 2021.
- Kodati Divya and V. Purushothama Raju, "K-means++ Clustering Using MapReduce Framework for Large Datasets", International Journal of Computer Science and Mobile Computing, vol. 9, no. 10, Oct. 2020.
- Alluri Neethika and V. Purushothama Raju, "Integrated Approach for Semantic Image Segmentation", International Journal of Research in Advanced Computer Science Engineering, vol. 5, no. 5, Oct. 2019.
- K. Ganesh Reddy and V. Purushothama Raju, et al., "Simulation analysis on network layer attacks in wireless mesh Networks", International Journal of Engineering & Technology, Vol. 7, July 2018.
- V. Purushothama Raju and G. P. Saradhi Varma, "A Novel Algorithm for Mining Closed Sequential patterns," International Journal of Data Mining & Knowledge Management Process (IJDKP), vol. 5, no. 1, pp. 41-50, Jan. 2015. DOI: 10.5121/ijdkp.2015.5104
- V. Purushothama Raju and G. P. Saradhi Varma, "Mining Closed Sequential Patterns in Large Sequence Databases," International Journal of Database Management Systems(IJDMS), vol. 7, no. 1, pp. 29-39, Feb. 2015. DOI: 10.5121/ijdms.2015.7103
- V. Purushothama Raju and G. P. Saradhi Varma, "A Genetic Algorithm Based Approach to Closed Sequential Pattern Mining," Elixir International Journal, vol. 81, pp. 31915-31919, Apr. 2015.
- V. Purushothama Raju and G. P. Saradhi Varma, "A Framework for Mining Closed Sequential patterns," International Journal of Computer Science and Information Technologies, vol. 5, no. 2, pp. 1864-1866, Mar. 2014.
- V. Purushothama Raju and G. P. Saradhi Varma, "An Integrated Approach for Mining Closed Sequential patterns," International Journal of Computer Science & Engineering Technology, vol. 5, no. 5, pp. 511-515, May 2014.
- V. Purushothama Raju and G. P. Saradhi Varma, "Finding Closed Sequential Patterns in Sequence Databases," Elixir International Journal, vol. 76, pp. 28702-28704, Nov. 2014.

## Journal Publications in National/International Conferences
- M. S. Sudheer and V Purushothama Raju, et al., "An effective analysis on various scheduling algorithms in cloud computing", International Conference on Inventive Computing and Informatics (ICICI), May 2018, DOI: 10.1109/ICICI.2017.8365274 (Published in IEEE Explore)
- K. Ganesh Reddy and V Purushothama Raju, "An Effective Analysis on Intrusion Detection Systems in Wireless Mesh Networks", International Conference on Advances in Computing, Communications and Informatics (ICACCI), December 2017, DOI: 10.1109/ICACCI.2017.8126174 (Published in IEEE Explore)
- V. Purushothama Raju and G. P. Saradhi Varma, "A Survey on Closed Sequential Pattern Mining," Proceedings of IEEE International Conference on Information Communication & Embedded Systems (ICICES), Feb. 2014. DOI: 10.1109/ICICES.2014.7033795 (Published in IEEE Explore)
- V. Purushothama Raju and G.P.S. Varma, "Comparative Study of Closed Sequential Pattern Mining Algorithms," Proceedings of IEEE International Conference on Computation of Power, Energy, Information and Communication (ICCPEIC), pp. 777-780, Apr. 2014.
- V. Purushothama Raju and G. P. Saradhi Varma, "Mining Closed Sequential Patterns Using Genetic Algorithm," Proceedings of IEEE International Conference on Advanced Communication Control and Computing Technologies (ICACCCT), pp. 634-637, May 2014. DOI: 10.1109/ICACCCT.2014.7019165 (Published in IEEE Explore)
- V. Purushothama Raju and G. P. Saradhi Varma, "An Approach for Mining Web Click Streams using Closed Sequential Pattern Mining," Proceedings of ELSEVIER International Conference on Communication and Computing(ICC 2014), pp. 508-514, June 2014.
- V. Purushothama Raju and G. P. Saradhi Varma, "An Approach for Mining Weighted Closed Sequential Patterns", Proceedings of IEEE International Conference on Networks & Soft Computing, pp. 158-161, Aug. 2014. DOI: 10.1109/CNSC.2014.6906722 (Published in IEEE Explore)

## FDPs / Workshops / Seminars / Training Programs
Attended:
- Attended a "Patent Analytics Course" organized by Turnip Innovations Private Ltd, Kolkata from 18-2-2022 to 27-2-2022.
- Attended a FDP on "Emergence of Blockchain Technology and cryptocurrencies" organized by IITM, New Delhi from 9-8-2021 to 14-8-2021.
- Attended a FDP on "Emerging Research Trends in Computer Science and Engineering (ERTCSE-2020)" organized by Department of Computer Science and Engineering, GMR Institute of Technology, Rajam during 19th – 23rd October 2020.
- Attended a FDP on "Mobile Robotics & Internet of Things" held from 16/09/2020 to 19/09/2020 at Poornima College of Engineering, Jaipur.
- Attended a FDP on "Emerging Research Trends in Computer Science and IT" organized by BVICAM, New Delhi during 11th – 15th May 2020.
- Attended a Workshop on "TEQIP-II Management Capacity Enhancement Programme" organized by IIM Tiruchirappalli during 6th – 10th Feb 2017.
- Attended a Workshop on "GPU Programming and Applications" organized by IIT Madras during 17th – 19th July 2014.

Organized:
- Organized a One Week National Level Online FDP on "Recent Advancements in Artificial Intelligence" during 23rd June 2020 to 27th June 2020.
- Organized a three day Workshop on "Computer Hardware, Installing Software & Networking" for the Supporting Staff during 15th to 17th June 2020.
- Organized a workshop on "Machine learning" from 13-2-19 to 16-2-19.
- Organized a workshop on "Cyber Security" from 28-8-17 to 1-9-17.
- Organized a One Week National Level FDP on "Web Technologies" from 14th October to 18th October
- Organized a One Week National Level FDP on "Software Testing" from 7th September 2016 to 11th September 2016
- Organized a One Week National Level FDP on "Cyber Security" from 16th August 2016 to 20th August 2016
- Organized a One Week National Level FDP on "BIG DATA ANALYTICS" from 2-8-2016 to 6-8-2016

## Roles and Responsibilities
- Working as Dean Academics from 2021 to till date
- Worked as Dean R&D from 2018 to 2020
- Worked as HOD-CSE from 2009 to 2010 and 2014 to 2020
- Worked as BOS chairman from 2014 to 2020
- Worked as JKC Coordinator from 2005 to 2020

## Achievements
- Received Best Teacher award from Sri C.S. Venugopala Krishna, Honourable Minister of BC welfare, Govt. of A.P. in Ideal teaching award program organized by Tutors Pride and Raja Ratna group on 2-10-2022.

## Patents
- Published a patent on "An IOT based system for instinctive stopping alert to drivers using on passenger ticket" in 2021 (Application No.202141012346 A)

## Courses Taught
- UG: DBMS, Data Warehousing & Data Mining, Software Engineering, Java Programming, Computer Organization, C&DS, Computer Networks, Visual Programming Techniques, Real Time Systems, Unix Programming
- PG: DBMS, Data Warehousing & Data Mining, ERP & SCM

## Research Profiles
TABLE:
Profile | Link
Google Scholar | https://scholar.google.com/citations?hl=en&authuser=1&user=SkX8XOoAAAAJ
Vidwan | https://svecw.irins.org/profile/148150
Research Gate | https://www.researchgate.net/profile/V_Purushothama_Raju
ORCID | https://orcid.org/my-orcid?orcid=0000-0003-0475-3918
Scopus | https://www.scopus.com/authid/detail.uri?authorId=56405222900
Publons | https://www.webofscience.com/wos/author/record/L-9817-2014


## Identifiers & Contact
- Email: praju@svecw.edu.in
- SVECW Emp ID: 502
- AICTE Unique ID: 1-457793037
`;

const CSE_MAHESWARA_RAO_TEXT = `
## Professional Summary
Dr. V. V. R. Maheswara Rao is a distinguished Professor in the Department of Computer Science and Engineering. He completed his M.Tech. from JNTUK and earned his Ph.D. from Acharya Nagarjuna University, specializing in Web Mining using Soft Computing Techniques. A prolific researcher, Dr. Rao has 95 Scopus and 81 Web of Science indexed publications, including 31 Journals article including 15 SCI, 27 book chapters, and 41 IEEE Xplore papers. His research focuses on Edge Computing, Cloud Computing, AI, Data Science, Machine Learning, and Deep Learning, and he has successfully guided 2 scholars to their Ph.D. degrees. In his administrative capacity, Dr. Rao serves as Dean, Statutory Bodies and IQAC Coordinator, provides strategic leadership to statutory bodies, ensures regulatory compliance, oversees quality benchmarks, coordinates IQAC initiatives to strengthen institutional governance and academic excellence.

With an illustrious career encompassing 22 years of teaching, 15 years of research, and 5 years of industry experience, Dr. Rao stands as an accomplished academician and a dedicated mentor who continues to inspire students and researchers through his vision, expertise, and commitment to excellence.

## Research Metrics
- Scopus Publications: 95
- Web of Science Publications: 81
- Journal Articles: 31 (15 SCI, 16 Scopus)
- Book Chapters: 27
- IEEE Xplore Papers: 41
- Ph.D. Scholars Guided: 2 completed; 2 pursuing

## Professional Memberships
- Senior Member, IEEE
- Member, IEEE Computational Intelligence Society
- Associate Member, IE
- Life Member, CSI
- Life Member, ISTE

## Ph.D. Degree Awardees
- Dr. N Silpa (Centurion University, 2024) - "A Comprehensive Big Data Analytics Framework to Investigate Web User Behaviour with Machine Learning Approach"
- Dr. A. Kranthi (James Cook University, Australia, 2024) - "Enhancing Management Systems to Support Online Learning Using Academagogy"

## Ph.D. Pursuing Students
- Mr. M Venkata Durga Rao (JNTUK Kakinada, 2023)
- Ms. B Revathi (JNTUK Kakinada, 2024)

## SCI Journal Publications
- "Hybrid Secretary Bird – Botox Optimization Algorithm for Load Balancing in Cloud Edge Environment" - J. Syst. Sci. Syst. Eng. (2026)
- "A dependency-aware task offloading in IoT-based edge computing system using an optimized deep learning approach" - Parallel Computing (2025)
- "An AI-Driven Approach for Real-Time Noise Level Monitoring and Analysis" - IJACSA (2025)
- "Hybrid DRL-Enhanced ACO-WWO for Efficient Resource Allocation and Load-Balancing in Cloud Computing" - International Journal of Computational Intelligence Systems (2025)
- "A Flawless QoS Aware Task Offloading in IoT Driven Edge Computing System using Chebyshev Based Sand Cat Swarm Optimization" - J Grid Computing (2025)
- "Workload prioritization and optimal task scheduling in cloud" - Wireless Networks (2025)
- "Decoding Human Facial Emotions: A Ranking Approach using Explainable AI" - IEEE Access (2025)
- "ProtienCNN‐BLSTM: An efficient deep neural network with amino acid embedding‐based model of protein sequence classification" - Computational Intelligence (2024)
- "AI-driven drowned-detection system for rapid coastal rescue operations" - Inf. Res. (2024)
- "Prevalence and risk factors analysis of postpartum depression at early stage using hybrid deep learning model" - Scientific Reports (2024)
- "A precise model for skin cancer diagnosis using hybrid U-Net and improved MobileNet-V3" - Sci Rep (2024)
- "Classify and predict web user behaviour using butterfly optimization and recurrent neural network" - Multimed Tools Appl (2024)
- "A hybrid cloud load balancing and host utilization prediction method using deep learning" - Sci Rep (2024)
- "A Novel Approach for Prediction of Gestational Diabetes based on Clinical Signs and Risk Factors" - ICST Transactions on Scalable Information Systems (2023)
- "Intelligent exploration strategy for a mobile robot to reduce the repeated searches in an unknown environment" - Int J Syst Assur Eng Manag (2022)

## Scopus Indexed Journal Publications
- "Hybrid Machine Learning Approach for Phishing URL Detection" - Aut. Control Comp. Sci. (2026)
- "Quantum cryptography for secure cloud data storage and transmission" - Journal of Theoretical and Applied Information Technology (2025)
- "Design and implementation of assistive technologies utilizing brain-computer interfaces" - Journal of Theoretical and Applied Information Technology (2025)
- "Transfer Learning Strategies for Optimising Facial Recognition Accuracy" - Journal of Theoretical and Applied Information Technology (2025)
- "Optimization of Neural Network Classifiers by Leveraging Sequential Feature Engineering for Robust Water Quality Prediction System" - Proceedings on Engineering Sciences (2025)
- "Optimizing hyperparameters for credit card fraud detection with nature-inspired metaheuristic algorithms" - J. Inst. Eng. India Ser. B (2025)
- "Image quality evaluation: evaluation of the image quality of actual images by using machine learning models" - Bulletin of Electrical Engineering and Informatics (2024)
- "You only look once model-based object identification in computer vision" - IAES International Journal of Artificial Intelligence (2024)
- "Revolutionizing Feature Engineering for Robust Ensemble Machine Learning" - Proceedings on Engineering Sciences (2024)
- "Identity-Based Privacy-Preserving Anonymous Authentication Access Control for Secure Cloud Computing" - Proceedings on Engineering Sciences (2024)
- "Secure User Authentication in the Cloud: Leveraging Face Recognition Technology" - Proceedings on Engineering Sciences (2024)
- "Smart Hybrid Models for Improved Breast Cancer Detection" - Proceedings on Engineering Sciences (2024)
- "An Optimal Machine Learning Model Based on Selective Reinforced Markov Decision to Predict Web Browsing Patterns" - Journal of Theoretical and Applied Information Technology (2023)
- "Machine Learning-Based Optimal Segmentation System for Web Data Using Genetic Approach" - Journal of Theoretical and Applied Information Technology (2022)
- "Enriched Big Data Pre-Processing Model with Machine Learning Approach to Investigate Web User Usage Behaviour" - Vol. 12 No. 5 (2021)
- "A Complete Research on Techniques & Technologies of Big Web Data Preparation to Web User Usage Behaviour" - IJRTE (2009)

## Books & Book Chapters
- "Enhancing victim detection in disaster scenarios: A YOLOv7 and YOLOv8 performance study" - Springer (2026)
- "Integrating facial indicators for enhanced road safety using deep learning models" - Springer (2026)
- "MRI-based classification of glioma, meningioma, and pituitary tumors using deep learning approaches" - Springer (2026)
- "Quantum-Inspired Fermionic Operator Representation for Interpreting Human Cognition Through Smile Classification" - Springer (2026)
- "A light gradient boosting model for identification of coronary artery disease" - Intelligent Data-Driven Systems (2025)
- "Enforcing the Machine Learning Algorithms to Contemplate on Cough Sound Codification" - Springer (2025)
- "Deep Learning Strategies for Multiclass Skin Disease Classification" - Springer (2025)
- "Leveraging the Power of MRMR in Machine Learning Models for Multi Class Classification of Rice" - Springer (2025)
- "Construction of Cascaded Deep Neural Network with Optimization-Based Feature Selection in CT Images for Detecting Laryngeal Cancer" - Springer (2025)
- "Preeminent Sign Language System by Employing Mining Techniques" - Springer (2024)
- "An Optimized Ensemble Machine Learning Framework for Multi-class Classification of Date Fruits" - Springer (2024)
- "TextRank – Based Keyword Extraction for Constructing a Domain-Specific Dictionary" - Springer (2024)
- "Exploring Public Perception and Opinion Trends on Agnipath Scheme Through Sentiment Analysis" - Springer (2024)
- "Developing Preeminent Model Based on Empirical Approach to Prognose Liver Metastasis" - Springer (2022)
- "An Enhanced Machine Learning Classification System to Investigate the Status of Micronutrients in Rural Women" - Springer (2022)
- "Analyzing Student Reviews on Teacher Performance Using Long Short-Term Memory" - Springer (2022)
- "An Intelligent System for Web Usage Data Preprocessing" - Springer (2011)
- "A Novel Lattice Based Research Frame Work for Identifying Web User's Behavior with Web Usage Mining" - Springer (2010)
- "Study of Visitor Behavior by Web Usage Mining" - Springer (2010)
- Srinivas, L. V., et al. "Empowering Inclusive Communication: Advancements in Wearable Technology with GloSign" - CRC Press (2024)
- Shankar, R. S., et al. "Mitigating Misinformation: An advanced analytics framework for proactive detection of fake news" - CRC Press (2024)
- Srinivas, L. V., et al. (co-authored) - CRC Press (2024)
- "Data Science for Engineers" - Scientific International Publishing House, ISBN 978-93-5757-914-8 (2024)

## IEEE Conference Publications
- "Smart Farming Through a Sustainable Crop Guidance System Powered by Predictive Machine Learning" - ICITCON (2025)
- "A Robust Inception-V3 Deep Learning Framework for Accurate Multiclass Classification of Medicinal Plant Leaves" - NMITCON (2025)
- "A Resilient Water Quality Investigation System using Support Vector Machines" - ICSCDS (2025)
- "Efficient Alzheimer's Classification Leveraging Deep Learning Models on MRI Data" - AMATHE (2025)
- "Unified Model for Crop Optimization: Leveraging Deep Learning and XGBoost" - ICECCC (2025)
- "Robust Hybrid CNN-BiGRU based Surveillance System for Wild Animal Detection" - ICDCECE (2025)
- "Mitigating security challenges in edge computing: Attacks, defence strategies, and algorithms" - IDCIoT (2025)
- "Optimizing Multiclass Classification for Obesity Type Prediction" - SCOPES (2024)
- "A Robust Multi-Class Obesity Classification and Risk Analysis System" - SCOPES (2024)
- "A Potential Research for Maximizing Predictive Power in Neural Networks through Feature Engineering in Diabetes Prediction" - GCAT (2024)
- "Investigation on Leveraging Optimal Machine Learning Models for Air Quality Assessment" - ICSCSA (2024)
- "A Reliable Ensemble Machine Learning Framework to Predict MBTI Personality Trait" - ICSCAI (2024)
- "An Innovative Machine Learning System for Optimal Multi-Class Classification of Date Fruits" - ICIICS (2024)
- "Face and Hand Gesture Recognition for Sign Languages to Support Non-Verbal Expressions" - ICACCS (2024)
- "Deep Learning-Based Classification of Skin Lesions for Enhanced Dermatological Diagnosis" - NMITCON (2024)
- "Investigating the Efficacy of Ensemble Machine Learning Models in Multi-Class Categorization of Web Pages" - WCONF (2024)
- "Fine-Tuning Student Success Prediction Through Ensemble Models Intertwined with Feature Engineering" - ICDSNS (2024)
- "Federated Learning on Blockchain Networks" - INCET (2024)
- "Ensemble Learning Applications and Visualizations Taxonomy of Blockchain Data" - ICDSIS (2024)
- "An Object Detection Framework and Deep Learning Models Used to Detect Potholes on Streets" - AMATHE (2024)
- "A Plausible RNN-LSTM based Profession Recommendation System" - ICCMC (2023)
- "An Enriched Employee Retention Analysis System with a Combination Strategy" - ICICCS (2023)
- "Raitu Vrudhi – An Android based Mobile Application for Agro-Marketing" - INCET (2023)
- "An Innovative Machine Learning based Heart Disease Assessment System" - CONIT (2023)
- "A Robust Team Building Recommendation System by Leveraging Personality Traits Through MBTI" - ICICAT (2023)
- "Story Telling with Basic and Advanced Data Visualizations of Blockchain Technologies" - ICAISS (2023)
- "Empowering Diabetic Prediction through MRMR-Driven Feature Selection" - ICIICS (2023)
- "A Robust XG-Boost Machine Learning Model for Water Quality Estimation System" - AIKIIE (2023)
- "An Optimized Ensemble Machine Learning Framework for Water Quality Assessment System" - ICSES (2023)
- "Multi-label and Multi-class Classification on a Custom Dataset using Convolution Neural Networks" - ICICCS (2023)
- "Primal-Dual Parallel Algorithm for Optimal Content Delivery in Cloud CDNs" - ICCIC (2017)
- "An Efficient Hybrid Predictive Model to Analyze the Visiting Characteristics of Web User using Web Usage Mining" - ARTCom (2010)

## Funded Projects
- "A Comprehensive Approach to Analyze and Stimulate outcomes of Research and Development activities in Universities" - DST funded, Rs. 32 Lakhs, 2018-2021
- "Nutritional Security And Economic Empowerment Of Rural Women Through Food Based Interventions" - DST funded, Rs. 27 Lakhs, 2015-2018
- "Implementation of improved KNN classification and clustering algorithm as a tools using mining" - DST funded, Rs. 17 Lakhs, 2012-2015

## Patents
- "IoT Garbage Segregator & Bin Level Indicator Device" - Design No: 399499-001
- "Sun Tracking Solar Panel Device" - Application No: 6356605
- "Voice Controlled Purifier Device" - Application No: 412327-007
- "Feature Extraction and Analysis of Natural Language Processing (NLP) for Deep Learning English Language" - Application No: 202441093177
- "A Combined Approach of DWT-DCT for Blind Medical Image Watermarking" - Application No: 202441102259
- "Autonomous Hybrid CNN-Bi GRU Deep Learning System For Real-Time Wild Animal Surveillance" - Application No: 202541033794
- "An Intelligent Herbal Leaf Identification System Using Deep Convolutional Inception Architecture" - Application No: 202641010335
- "A Convolutional Neural Network-Based System for Automated Multi-Class Air Quality Index Classification" - Application No: 202641010333
- "A Machine Learning-Based System for Multi-Vitamin Deficiency Assessment" - Application No: 202641013400
- "A Machine Learning–Based System for Thyroid Disorder Prediction with Generative AI" - Application No: 202641010635
- "An Intelligent Career Recommendation System using Machine Learning" - Application No: 202641010654
- "An Intelligent Adaptive Agricultural Decision Support System for Dynamic Crop Planning" - Application No: 202641010633

## Reviewer Roles
- Springer's "International Journal of Wireless Information Networks"
- "International Journal of Innovative Research in Advanced Engineering" (IJIRAE)
- "Asian Journal of Current Research"
- "Evolving Systems"

## Administrative Responsibilities
- Dean, Statutory Bodies and IQAC Coordinator
- Oversees statutory bodies' functioning and regulatory compliance
- Formulates quality benchmarks and conducts academic audits
- Manages AICTE, UGC, and JNTUK affiliations
- Leads accreditation processes (NBA, NAAC)
- Coordinates NIRF and other institutional rankings
- Web Master of Institute Website

## Research Focus Areas
- Edge Computing, Cloud Computing, Artificial Intelligence, Data Science, Machine Learning, Deep Learning

## Research Profiles
TABLE:
Profile | Link
ORCID Profile | https://orcid.org/0000-0002-0503-7211
Google Scholar Profile | https://scholar.google.co.in/citations?user=-BjqQ00AAAAJ&hl=en
SCOPUS Profile | https://www.scopus.com/authid/detail.uri?authorId=57314360500
Web of Science Profile | https://www.webofscience.com/wos/?mode=Nextgen&path=%2Fwos%2Fauthor%2Frecord%2FAAR-2806-2020&IsProductCode=Yes&Init=Yes&DestApp=UA&Func=Frame&action=transfer&SrcApp=CR&SID=EUW1ED0E84dlPqazYMUx7bi5rfMow
ResearchGate | https://www.researchgate.net/profile/Maheswara-Rao-V-V-R?ev=hdr_xprf
Vidwan-ID : 148183 | https://svecw.irins.org/profile/148183


## Identifiers & Contact
- Email: deansb@svecw.edu.in
`;

const CSE_KURADA_TEXT = `
## Educational Qualifications
TABLE:
Degree | Institution | Specialization | Year
Ph.D. | Acharya Nagarjuna University, Nagarjuna Nagar, Guntur | Data Mining, Computational Intelligence | 2019
M.Tech | SSAIST, Surampalem, JNTUK, Kakinada | CSE | 2012
M.Sc. CS | VSM College, Ramachandrapuram | Computer Science | 1999

## Fields of Specialization
- AI
- Blockchain
- Data Science

## Professional Affiliations
- Life Member CSE, ISTE, IEI

## Recent Publications (Conference Papers 2023-2024)
- M. R. V V R, S. N, S. S. Reddy, S. Bonthu, R. Rao Kurada and V. Vaishalini, "An Optimized Ensemble Machine Learning Framework" (ICSES 2023)
- N. Silpa, V. Vaishalini, S. V. S. S. Lakshmi, M. R. V V R, R. R. Kurada and S. Bonthu, "Empowering Diabetic Prediction through MRMR" (ICIICS 2023)
- M. R. V. V. R, S. N, S. Shankar Reddy, R. Rao Kurada, S. Mahaboob Hussain and E. L Sameera, "A Robust XG-Boost Machine Learning Model" (AIKIIE 2023)
- Ramachandra Rao Kurada, Karteeka Pavan Kanadam, Y. Ramu, N. Silpa, VVR Maheswara Rao, Sunil Pattem, "Story Telling with Basic and Advanced Data Visualizations" (ICAISS 2023)
- Ramachandra Rao Kurada, Sunil Pattem, Y. Ramu, Maheswara Rao VVR, N Silpa, Sridevi Bonthu, "RaituVrudhi – An Android based Mobile Application" (INCET 2023)
- Silpa N, Maheswara Rao V V R, M. VekataSubbarao, Ramachandra Rao Kurada, Shiva Shankar Reddy, Padma JyothiUppalapati, "An Enriched Employee Retention Analysis System" (ICICCS 2023)
- Maheswara Rao VVR, N Silpa, Mahesh Gadiraju, Shiva Shankar Reddy, Sridevi Bonthu, Ramachandra Rao Kurada, "A Plausible RNN-LSTM based Profession Recommendation System" (ICCMC 2023)
- Ramachandra Rao Kurada, Y. Ramu and S. Pattem, "Lessoning Geospatial Visualizations" (CSITSS 2021)
- Ramachandra Rao Kurada, RamuYadavalli, Sunil Pattem, "Intelligent animal tracking system using IoT" (ICETMCCT 2021)
- Ramachandra Rao Kurada, RamuYadavalli, Sunil Pattem, Kiran Sree P "A Case Study to Exhibit Instructional Planning" (NCEE-2021)
- G.Madhuri, K. Ramachandra Rao, "Heart Disease Prediction System Based on Hybrid Machine Learning Techniques" (ICRIEIT-2021)
- Ramachandra Rao Kurada, Dr. KarteekaPavanKanadam and Dr. R.C. Tripathi, "A Short Study in Formulation of TLBO" (ICACEA 2015)
- Ramachandra Rao Kurada, et.al. "Modeling Uncertain Spatial Data Sets using Uncertain Partitioning Clustering" (AAMT-2013)
- Ramachandra Rao Kurada, et.al. "A Novel Approach by Applying Partitioning Clustering" (ICCCE 2012)

## Journal Publications
- K. Ramachandra Rao et al., "Dish Recognition and Nutrition using Deep Learning", Industrial Engineering Journal, Vol. 53, Iss 2, Feb 2024
- Ramu Y, Ramachandra Rao Kurada, SunilPattem, "An Approach To Identify Accurate Machine Learning Model", International Journal for Innovative Engineering and Management Research, Vol. 12, Issue 02, Feb 2023
- Ramachandra Rao Kurada, RamuYadavalli, Sunil Pattem, KarteekaPavanKanadam, "A Comparative Study on Prejudiced Measurements", Natural Volatiles and Essential Oils (NVEO), Vol. 8, Issue 4, Nov 2021
- K. Jaya Sri, and K. Ramachandra Rao, "Automated Solution for Normalization of Duplicate Records", International Journals of Advanced Research in Computer Science and Software Engineering, Vol. 9, Issue 9, Sept 2019
- RudraHarika, and K. Ramachandra Rao, "An Enhanced Top-K Approximate Queries", International Journal of Modern Electronics and Communication Engineering (IJMECE), Vol. 6, Issue 5, Sept 2018
- Ramachandra Rao Kurada and Dr. KarteekaPavanKanadam, "An Epitomized Approach to Possess Promising Predictions", Helix The Scientific Explorer, Vol. 8, No. 3, May 2018
- Ramachandra Rao Kurada and Dr. KarteekaPavanKanadam, "A Novel Evolutionary Automatic Data Clustering Algorithm", International Journal of Intelligent Systems and Applications (IJISA), Vol. 10, No. 5, May 2018
- Ramachandra Rao Kurada and Dr. KarteekaPavanKanadam, "A Novel Evolutionary Automatic Clustering Technique", Springer Briefs, 2018
- Ramachandra Rao Kurada and Dr. KarteekaPavanKanadam, "Sentimental Analysis on Cognitive Data Using R", Springer Briefs, 2017
- G. Sushma, and K. Ramachandra Rao, "Influencing Unique Data to Boost the Performance", International Journal of Computer Science & Communication Network, Vol. 7, Iss. 5, Oct-Dec 2017
- S.Kanaka Lakshmi, and K.Ramachandra Rao, "H2Hadoop: Improving Hadoop Performance", International Journal of Computer Science and Technology, Vol. 8, Iss. 4, Oct-Dec 2017
- Bh. Bhargavi and K. Ramachandra Rao, "Distributed Development Environment", International Journal of Merging Technologies and Advanced Research in Computing (IJMTARC), Vol. IV, Iss. 16, Dec 2016
- Ramachandra Rao Kurada, et al., "Channelizing Audio Functions in a Smart Mobile", International Journal of Engineering Research & Technology (IJERT), Vol. 4, Iss. 34, Nov 2016
- Ramachandra Rao Kurada and Dr. KarteekaPavanKanadam, "Automatic Unsupervised Data Classification Using Jaya Evolutionary Algorithm", Advanced Computational Intelligence: An International Journal (ACII), Vol. 3, No. 2, April 2016
- Ramachandra Rao Kurada and Dr. KarteekaPavanKanadam, "A Generalized Automatic Clustering Algorithm", International Journal of Applied Sciences and Engineering Research, Vol. 4, Iss. 4, Aug 2015
- Ramachandra Rao Kurada, Dr. KarteekaPavanKanadam, and Dr. Appa Rao Allam, "Automatic Teaching Learning Based Optimization", Springer Briefs, 2015
- Ramachandra Rao Kurada and Dr. K KarteekaPavan, "Teaching-Learning-Based Optimization State-of-the-Art", CiiT International Journal of Data Mining and Knowledge Engineering (IJDMKE), Vol. 7, No. 2, 2015
- Ramachandra Rao Kurada and Dr. K KarteekaPavan, "Exemplifying Workflow Sequencing and Analysis", International Journal of Advanced Research in Computer Science (IJARCS), Vol. 5, No. 2, March 2014
- Ramachandra Rao Kurada, Dr. K KarteekaPavan, "Novel Text Categorization By Amalgamation", International Journal of Computational Science and Information Technology (IJCSITY), Vol. 1, No. 4, Nov 2013
- Ramachandra Rao Kurada, Dr. K KarteekaPavan, and Dr. AV Dattareya Rao, "A Preliminary Survey On Optimized Multiobjective Metaheuristic Methods", International Journal of Computer Science & Information Technology (IJCSIT), Vol. 5, No. 5, 2013
- Ramachandra Rao Kurada, et al. "An Integrated Approach to Model Uncertain Spatial Data", Engineering Sciences International Research Journal (ESIRJ), Vol. 1, Issue 1, Feb 2013
- Ramachandra Rao Kurada, et al. "Unsupervised Classification of Uncertain Data Objects", International Journal of Engineering Research and Applications (IJERA), Vol. 2, Issue 2, March-April 2012

## NPTEL Courses
- "Business Analytics & Text Mining Modeling Using Python" - 3 Credits (July-Sept 2023) - IIT Roorkee
- DBMS course - 2 Credits (Feb-April 2019) - IIT Kharagpur

## Certifications
- Coursera: Python Data Structures; Using Python to Access Web Data; Using Databases with Python; Capstone: Retrieving, Processing, and Visualizing Data with Python; Introduction to Data Science in Python; Applied Machine Learning in Python; Applied Plotting, Charting & Data Representation in Python; Applied Text Mining in Python; Artificial Intelligence for Everyone; Introduction to HTML 5; Advanced Styling with Responsive Design; Introduction to CSS3; Interactivity with Javascript; Deep Learning and Neural Networks; Convolutional Neural Networks deeplearning.ai; Machine Learning Foundations: A Case Study Approach; Machine Learning: Regression; Machine Learning: Clustering & Retrieval; Machine Learning: Classification; Blockchain Basics - State University of New York; Responsive Web Design - University of London and Goldsmiths; The Blockchain - University of California, Irvine
- EdX: Data Science: R Basics - HarvardX
- IIT Bombay X: LaTeX101x: LaTeX for Students, Engineers, and Scientists (15 July 2020 - 15 Dec 2020)
- Nasscom Future Skills: Introduction to Data Analytics
- IBM Cognitive Classes.ai: Python for Data Science; Data Analytics with Python; Machine Learning with Python; Data Visualization with Python; Big Data; Hadoop

## Patents
- Ramachandrarao Kurada et al., 2021, "An IOT based system for Instinctive stopping alert to drivers using on passenger ticket", 202141012346 A, 26/03/2021

## FDPs/Workshops/Seminars/Training Programs
Attended:
- One week National FDP on Blockchain Technology - Ramrao Adik Institute of Technology (8-12 Jan 2024)
- FDP on Large Language Models in AI (4-7 Oct 2023)
- Certificate of appreciation from KodNest for education and industry connect (Aug 2023)
- One Week National Level FDP on "Cloud Infrastructure (AWS)" - AICTE (21-25 Aug 2023)
- Five day FDP on Power of Visualization in Analytics - BVRIT (16-21 Aug 2023)
- Workshop on Application of eye tracking in Cognitive Science Research - Center for Linguistic Science & Technology, III, Guwahati Assam (Aug 2023)
- Five days Faculty Development Program on "Research Methodology on Machine Learning and Data Science" - BVRIT-Narasapur (10-14 July 2023)
- Professional development work on Digital Creativity Skills - Adobe Academic Essentials (July 2023)
- One month course on "Quantum Computing using Indigenous Quantum Simulator QSim" - IIT Roorkee and C-DAC Hyderabad (6-28 May 2023)
- One week National Level Online FDP "Recent Advances in Data Science, Data Analytics and Cyber Security" - CSE-SVECW (1-5 March 2023)
- Five day FDP on Ethical Hacking - Blackbuck Engineers, KKR&KSR Institute (27 March - 3 April 2023)
- One week FDP on Natural Language Processing - VNR VJIET (13-17 Feb 2023)
- One Week National Level Online FDP on "Recent Trends in Cyber Security and Machine Learning" - CSE-SVECW (1-5 June 2022)
- One Week National Level Online FDP on "Recent Trends in AI, IOT and Data Analytics" - CSE-SVECW (9-13 Feb 2022)
- One Week National Level Online FDP on "Societal Applications of AI, Blockchain and IoT" - CSE-SVECW (1-5 Sep 2021)
- One Week National Level Online FDP on "Applications on Machine Learning" - CSE-SVECW (15-19 June 2021)
- One week online FDP on "Transforming teachers for a sustainable post covid-19 world" - IITM (16-20 Aug 2021)
- Five Day National Level online FDP on "Recent Advancements in Artificial Intelligence and Robotics" - AICTE-ATAL (23-27 Feb 2021)
- Online FDP on Applications of Machine learning - SVECW (15-19 June 2021)
- Online FDP on Data Science and its Applications - SRKR (10-15 June 2021)
- Online Workshop on React JS - SASI (5-10 July 2021)
- Online FDP on multi Technology - Vasavi Engineering College (28 June - 3 July 2021)
- 5 Day Online FDP on Emerging Research Trends in CSE - GMR Institute of Technology (19-23 Oct 2020)
- 5 Day Online FDP Outcome based Education – A continuous Quality Improvement - SRKR (17-21 Aug 2020)
- Online Faculty Development Program On Cyber Security - GEC, Gudlavalleru (22-26 July 2020)
- 5 Day Online FDP "5G Technologies with Application for IOT" - VKR VNB & AGK (10-16 Aug 2020)
- Faculty Development Program On Data Science - ExcelR & APSSDC (June 1 - June 30, 2020)
- Webinar on "gnomio Moodle – Open Source Learning Platform" - Vignan Pharmacy College (2 June 2020)
- Webinar on AI Agents & Environment - SVECW (3 June 2020)
- Webinar on "Patent Act, Drafting, Filing system and challenges in India" - RMD Engineering College (10 June 2020)
- Online FDP on "Blockchain Technologies" - Gudlavalleru Engineering College (9-13 June 2020)
- 7-day online FDP on "Data Science and Cloud Computing" - Chebrolu Engineering College (18-22 May 2020)
- 5-day online FDP on "R Programming" - Prakasam Engineering College (22-28 May 2020)
- 5-day national online FDP on "Artificial Intelligence" - BVRIT Hyderabad College of Engineering (22-26 May 2020)
- Online Web Development Bootcamp Workshop - Vedic-Dev (28 April - 7 May 2020)
- 5-day online FDP on "Python 3" - Prakasam Engineering College (25-31 May 2020)
- Two-Week FDP on "Data Science and Data Analytics through Python and R Programming" - Gudlavalleru Engineering College (27 Jan - 8 Feb 2020)
- 8 day workshop on "Nasscom Associate Analytics" - Vedic, Hyderabad (18-24 Nov 2019)
- Two Week AICTE sponsored FDP on "Next Generation Wireless Systems and Networks – Theory to Practice" - ECE Department, SVECW (1-14 Aug 2019)
- NPTEL Online Certification in DBMS - IIT Kharagpur (Feb-April 2019)
- 6 Days Faculty Enablement Program on "InfyTQ based Foundation Program in Python" - Infosys Limited (6-13 May 2019)
- Four day training on "Machine Learning with Python" - SVECW (13-16 Feb 2019)
- One week FDP on "Artificial Intelligence using Machine Learning & Deep Learning" - SCET (7-11 Jan 2019)
- 6 day FDP on "Research Methodology and Statistical Analysis" - SRKR (9-14 June 2018)
- Two day workshop on "Artificial Intelligence and Machine Learning" - BVRICE (27-28 April 2018)
- One week national level FDP on "Evolutionary and Nature Inspired Meta-Heuristic Algorithms" - ECE Department, SVECW (13-17 April 2018)
- 5 day Nasscom workshop on "Data Analytics using R" - VEDIC (20-24 March 2018)
- Three day workshop on "Artificial Intelligence using Python" - CSE & IT Department, SVECW (6-8 March 2018)
- Two day workshop on "Block Chain Technologies" - VIT, Bhimavaram (27-28 Feb 2018)
- Workshop on "Instructional Design Strategies for NAAC Accreditation" - Vedic (20-22 March 2017)
- FIP on "IBM Business Analytics" - APSSDC, SRKREC (21-26 Nov 2016)
- Certificate Course in "Advanced Business Analytics using R" - IIT-Hyderabad (Oct 2016)
- FDP on "Web Technologies" - CSE Department, SVECW (14-18 Oct 2016)
- 1 day workshop on "APAT-2016" - CDAC-Bangalore (27 Aug 2016)
- 5 day FDP on "Python & Django" - SVECW (10-14 Aug 2016)
- Workshop on "Scientific Educational Practices at VEDIC" - Hyderabad (24-26 July 2016)
- Two Day Workshop on "Big Data and Hadoop" - SVECW (July 2016)
- 5 day FDP on "Big Data Analytics" - SVECW (July 2016)
- Workshop on "HADOOP and BIG DATA" - Chirala Engineering College (23-28 May 2016)
- Two-Day National Workshop on "Evolutionary Computing" - RVR&JC College of Engineering (27-28 Nov 2015)
- Two-Day workshop on "Applications of Soft Computing Techniques using MATLAB" - Vishnu Institute of Technology (9-10 Oct 2015)
- Two day National Workshop on "Matlab and its applications in Computational Intelligence" - SRM University (8-9 Feb 2014)
- Four day National Workshop on "Mobile Application Development" - SVECW (8-12 Jan 2014)
- Mentoring Programme - SVECW (5 Dec 2013)
- Two day AICTE sponsored National Seminar on "Mobile Computing & Mobile Application Development (NSMCMAD-2013)" - SRKR (7-9 Nov 2013)
- International Workshop on "Image Processing & Visualization" - VelTech University (16-19 April 2012)
- Workshop on "Cyber Security & Malware Analysis" - CSI, SVECW (3-4 Jan 2012)
- AICTE sponsored SDP on "Recent trends on Data ware Housing and Data Mining" - Vishnu Institute of Technology (5-17 Dec 2011)
- Workshop on "IMC Ramkrishna Bajaj National Quality Award" - SIPS, Hyderabad (4-9 May 2011)
- Course on "IPR & E" - SIPS, Hyderabad (15-17 April 2011)
- Course on "Software Engineering" - 2010 Indo-US Engineering Faculty Leadership Institute (28 June - 2 July 2010)
- Refresher Course on "Essential Foundations of Teaching and Researching Artificial Neural Networks" - AITAM (8-10 Jan 2010)
- AICTE sponsored "Staff Development Program on Data Mining Technologies and Methodologies" - Swarnandra College of Engineering & Technology (8-21 June 2009)
- Two day workshop on "Data Mining Application through Clementine" - JNTU-Kakinada (18-19 March 2009)
- Three Day Seminars on "Frontiers in Classification Algorithms for Data Mining" - AITAM (26-28 Dec 2008)
- Two day Workshop on "Multimedia Application Development with Action Script" - MIC (30-31 Aug 2008)
- Three Day Course on "Research Methodologies in Engineering" - AITAM (23-25 Aug 2008)
- Two Day Workshop on "Business Intelligent Tool – COGNAS" - DVR & HS MIC College (24-25 Jan 2008)
- Two Day Refresher Course on "WEKA – A Data Mining Tool" - AITAM (28-29 Dec 2007)
- Faculty Development Programme on "Instructional Design and Delivery" - NITTTR, Chennai at SVECW (3-8 Sep 2007)
- Refresher Course on "Soft Computing Applications in Data Engineering" - SVECW (5-6 April 2007)
- Training at Oracle University – Mumbai (2-13 July 2007)
- Three Day Refresher Course on "Mathematical Foundation on Data Mining Research" - Ritch Center, Visakhapatnam (29-31 Dec 2006)
- Three Day Workshop on "Software Project Management" - Gudlavalleru Engineering College (28-30 April 2006)

Organized:
- Three day workshop on "Artificial Intelligence using Python" (6-8 March 2018)
- One Day Guest Lecture on "Cloud Computing and its Trends" (17 July 2017)
- Two Day Workshop on "Big Data and Hadoop" (July 2016)
- One Day Guest Lecture on "Confronting Security Issues in Operating Systems and Computer Networks" (26 Feb 2016)
- One Day Workshop "Big Data and Unified communications :: Rotary Workshop" (20 Feb 2016)
- Coordinator for department level Workshop on "Coordination among Stakeholders in Software Project Management" (Nov 2008)
- Coordinator for "Soft Computing Applications in Data Engineering" workshop (May 2007)

## Papers Reviewed From UGC/Scopus/IEEE & Springer
- ICDCOT-2024 - SJB Institute of Technology, Bengaluru (15-16 March 2024)
- IEEE International Conference on Integrated Intelligence and Communications Systems (ICIICS-2023) - Sharnbasva University (24-25 Nov 2023)
- 3rd IEEE International Conference on Mobile Networks and Wireless Communications (ICMNWC-2023) - Sri Siddhartha Institute (4-5 Dec 2023)
- IEEE International Conference on Ambient Intelligence, Knowledge Informatics and Industrial Electronics (AIKIIE-2023) - Ballari (2-3 Nov 2023)
- AICTE Sponsored IEEE International Conference on Networks, Multimedia and Information Technology (NMITCON) - Nitte Meenakshi Institute (1-2 Sep 2023)
- EASCT-2023 - RV Institute of Technology and Management (20-21 Oct 2023)

## Session Chair for Conferences
- International Conference on Intelligent Healthcare and Computational Neural Modelling (ICIHCNM-2024) - BVC Engineering College (24-25 Jan 2024)

## Roles and Responsibilities
- Placement Coordinator – Department of CSE (CRT, Placement Activities & Internships)
- Coordinator for Mobhisure Full Stack Machine Learning & Cloud Internship programme
- Arrangement of Virtual Alumni Interactions
- Students – Higher Education
- Student Mentoring/Counselling for Placements & Personality Development
- NAAC – Criteria 7 College Coordinator
- NBA – Criteria 3 CSE Department Coordinator
- IQAC Coordinator – Department of CSE
- CSE Department Budget Preparations
- Project PRC members for Main/Mini Projects
- Curriculum Content Development

## Courses Taught
- UG: Data Science, Machine Learning, Python, R, Operating Systems, DBMS, Data Mining, Cloud Computing, MPMC, Computer Networks, Big Data, Information Security, Blockchain, Computer Organization, SNSW, Weka, Julia, SQL, Software Engineering
- PG: Data Science, Operating Systems, DBMS
- Others: 6 Operating System classes in ECET-CME at Smt. B. Seetha Polytechnic (2023)

## Research Profiles
TABLE:
Profile | Link
Google Scholar | https://scholar.google.com/citations?user=KmMJTjUAAAAJ&hl=en
Vidwan | https://vidwan.inflibnet.ac.in//profile/148103
Research Gate | https://www.researchgate.net/profile/Ramachandra-Rao-Kurada
ORCID | https://orcid.org/0000-0002-7014-8313
Scopus | https://www.scopus.com/authid/detail.uri?authorId=56974356300

## YouTube Channel
- CSE Core Subjects – Around 300+ Video Lectures (Data Science, Data Warehousing & Data Mining, R-Language, Operating Systems Theory & Lab, DBMS Theory & Lab, Microprocessors): https://www.youtube.com/channel/UCJ8jQFdgnfpMdwVRuVfOF2g


## Identifiers & Contact
- Email: kcrao@svecw.edu.in
- SVECW Emp ID: 603
- AICTE Unique ID: 1-456653757
`;

const CSE_Y_RAMU_TEXT = `
## Fields of Specialization
- Data Science & Machine Learning

## Educational Qualifications
TABLE:
Degree | Organization/Institution | Specialization | Year
M.Tech (CSE) | Bharath Institute of Higher Education & Research (BIHER), Chennai | Computer Science & Engineering | 2005
M.Sc (CS) | Sri Chaitanya PG College – Kakinada (Andhra University) | Computer Science | 2000
B.Sc (CS) | A.N.R. College – Guidivada (Nagarujuna University) | Maths, Physics, & Computer Science | 1998

## Professional Affiliations
- Life Member – Computer Society of India (CSI)
- Life Member – Indian Society of Technical Education (ISTE)
- Life Member – Institute of Engineers (IE)

## Publications in Conferences (National/International)
- B. V. Subba Rao; Pachipala Yellamma; Y. Ramu; Bh. Dasaradharam – "Selenium tool for automatic fault diagnosis framework on web applications" – International Conference on Signal Processing & Communication Engineering Systems (SPACES-2021) – AIP Conference Proceedings, AIP Conf. Proc. 2512, 020058 (2024) – Jan 2024 (Scopus)
- Ramachandra Rao Kurada, Karteeka Pavan Kanadam, Y. Ramu, N. Silpa, VVR Maheswara Rao, Sunil Pattem, "Story Telling with Basic and Advanced Data Visualizations of Blockchain Technologies", Second IEEE International Conference on Augmented Intelligence and Sustainable Systems (ICAISS 2023), 23-25 August 2023, CARE College of Engineering, Trichy, DOI: 10.1109/ICAISS58487.2023.10250661
- Ramachandra Rao Kurada, Sunil Pattem, Y. Ramu, Maheswara Rao VVR, N Silpa, Sridevi Bonthu, "RaituVrudhi – An Android based Mobile Application for Agro-Marketing", 2023 4th International Conference for Emerging Technology (INCET), Belgaum, 2023, DOI: 10.1109/INCET57972.2023.10170078 (Scopus)
- Ramachandra Rao Kurada, Ramu Yadavalli, Sunil Pattem, Kiran Sree P, "A Case Study to Exhibit Instructional Planning, Design, Execution and Assessment with Measurable Student Learning Outcomes in Outcome-Based Education", NCEE-2021, NITTTR Kolkata, Proceedings of Engineering Education, 2022, pp. 58-68, ISBN: 978-81-956423-0-4
- Ramachandra Rao Kurada, Y. Ramu and S. Pattem, "Lessoning Geospatial Visualizations on Real-Time Data", 2021 IEEE CSITSS, DOI: 10.1109/CSITSS54238.2021.9683776 (Scopus)

## Publications in Journals (National / International)
- Sunil Pattem, Ramachandra Rao Kurada, Y Ramu, "Intelligent animal tracking system using IoT and machine learning scheme", AIP Conference Proceedings, ICETMCCT 2021, AIP Conf. Proc. 2587, 020001 (2023) (Scopus)
- Ramu Y, Ramachandra Rao Kurada, Sunil Pattem, "An Approach To Identify Accurate Machine Learning Model To Build Human Stress Level Prediction System", International Journal for Innovative Engineering & Management Research, Vol 12, Issue 02, Feb 2023, DOI: 10.48047/IJIEMR/V12/ISSUE 02/09
- Ramachandra Rao Kurada, Ramu Yadavalli, Sunil Pattem, Karteeka Pavan Kanadam, "A Comparative Study on Prejudiced Measurements of Datasets in three variants of Automatic Evolutionary Clustering using Teaching-Learning-Based Optimization", Natural Volatiles and Essential Oils (NVEO), Volume 8, Issue 4, pp. 1321-1337, Nov 2021 (Scopus)
- Dr B V Subba Rao, Mr. Raja Kondaveeti, Mr. Y. Ramu, Dr V. Shanmukha Rao, Dr G. Siva Nageswara Rao, "The Probability of Microblog Forwarding using Multi-Message Interaction-Driving Mechanism", Turkish Journal of Computer and Mathematics Education, Vol.12 No.9 (2021), 434-437 (Scopus)
- Deepika M, Y. Ramu, "Sentiment Analysis of Online Reviews", International Journal of All Research Education and Scientific Methods (IJARESM), Volume 9, Issue 8, August 2021
- Dr P. Kiran Sree, Y. Ramu, "Gold Price Prediction using Eight Neighborhood Non Linear Cellular Automata", International Journal of Innovative Technology and Exploring Engineering (IJITEE), Volume 9 Issue 2, December 2019 (Elsevier Scopus)
- M.V.T. Siva Sahiti, Y. Ramu, "Short Text Understanding through Probability Model and Qualitative Analysis", International Journals of Advanced Research in Computer Science and Software Engineering, Volume-9, Issue-10, Oct 2019
- Ch. Sravani, Y. Ramu, "Hybrid Learning Approach Based Aspect Category Detection for Sentiment Summarization with Co-Occurrence Data", International Journals of Advanced Research in Computer Science and Software Engineering, Volume-9, Issue-9, Sept 2019
- Kothapalli. Sirisha, Y. Ramu, "Enhancing of Efficient Fuzzy Keyword Search Over Encoded Cloud Multi-User Environment", IJARCSSE, Volume-7, Issue-10, October 2017
- Loya. Lakshmi Praneetha, Y. Ramu, "Improved Macro-clusters Generation Using Top-k Shared Micro-clusters in Data Streams", IJARCSSE, Volume-7, Issue-10, October 2017
- M. Naga Divya, Y. Ramu, "Load Balancing Model for Performance, Accuracy, and Precision for Secure Cloud Transactions", IJMTARC, Vol IV, Issue 16, December 2016
- Nanda Priyanka, Y. Ramu, "Secure Classification of Data Sharing in Cloud", International Journal of Scientific Engineering & Technology Research, Vol.05, Issue.48, December 2016
- Y. Ramu, DNSB Kavitha, RV Swathi, "A framework to identify node-load by decision tree in dynamic load balancing mechanism", International Journal of Advanced Research in Computer Science and Software Engineering, Volume 6, Issue 3, March 2016
- Y. Ramu, HC Pavan Kumar, Dr. B.V. Subba Rao, "A Relative Study on Traditional ETL and ETL with Apache Hadoop", International Journal of Advanced Research in Computer Science and Software Engineering, Volume 6, Issue 3, March 2016
- R.G. Vyshnavi, Y. Ramu, "An Improved Method for Document Retrieval by using Correlation Preserving Indexing with TF/IDF", International Journal of Research in Computer Science & Engineering, Vol-5, Issue-6, Nov-Dec 2015
- GK Soujanya, Y. Ramu, "Improved Query Based Web Image Retrieval with K-Means Clustering & SVM", International Journal of Research in Computer Science & Engineering, Vol-5, Issue-6, Nov-Dec 2015
- P. Kirnamai, Y. Ramu, "Secured Multi-Owner Data Sharing for the Dynamic groups in the Cloud", International Journal of Advanced Research in Computer Science and Software Engineering, Volume 4, Issue 12, December 2014

## Patents
- "A System And Method Of Long-Range Package Delivering Drones With Instant On-Path Recharging Technique" - Application No. 202141012254 A, Publication Date: 26/03/2021, The Patent Office Journal No. 13/2021

## NPTEL Courses
- Emotional Intelligence – 08 Weeks – Jan-March 2017
- Educational Leadership – 08 Weeks – July-Sept 2017
- Effective Engineering Teaching in Practice – 04 Weeks – Feb-March 2018
- Outcome Based Pedagogic Principles for Effective Teaching – 04 Weeks – Feb-March 2018
- Teaching And Learning in Engineering (TALE) – 04 Weeks – Feb-April 2019
- Joy of Computing using Python – 12 Weeks – Feb-April 2019
- TALE 2: Course Design and Instruction of Engineering Course – 08 Weeks – July-Sept 2019
- Digital Transformation in Teaching Learning Process (DTITLP) – TEQIP-III (NPIU) & IIT-B – 02 Weeks – March 2020
- Learning Analytics Tools – 12 Weeks – Oct 2023
- Object Oriented System Development Using UML Java And Patterns – 12 Weeks – April 2024

## Certifications with Assessment
- Mentor – Inductee Teachers in Technical Education – AICTE NITTT under Ministry of Education, GoI, Jan 2021
- Online Pedagogy – IIIT, Hyderabad, Nov-Dec 2020
- Trainer – Associate Analytics (SSC/Q2101)-v1.0, NSDC & NASSCOM, 2019 (Trainer ID – TR81384)
- Mission 10xian (Level-1 & Level-2) – High Impact Teaching Skills – Wipro, 2009

## Additional Certifications (Online)
- Introduction to Data Science in Python – Coursera, May 2020
- AI For Everyone – Coursera, May 2020
- Programming for Everybody (Getting Started with Python) – Coursera, June 2020
- Python Data Structures – Coursera, June 2020
- Machine Learning for All – Coursera, June 2020
- Machine Learning Foundations: A Case Study Approach – Coursera, June 2020
- Data Science Ethics – Coursera, July 2020
- Introduction to Artificial Intelligence (AI) – Coursera, Aug 2020
- Using Databases with Python – Coursera, Aug 2020

## Faculty Training Programs (VEDIC @ SVES)
- Pedagogy & Personal Effectiveness — Mar 2016
- Advanced Engineering Optimization through Intelligent Techniques — Oct 2016
- Scientific Educational Practice Train the Trainers Program — Nov 2016
- Train the Trainer – Google Classroom — Feb 2017
- Scientific Educational Practice — Feb 2017
- Train the Trainer – Career Aspirations in Science & Technology (CAST) — July 2017
- Leadership Program — Oct 2017
- Think-Technology-Transform (TTT) — May 2018
- Workshop on Leadership in Teaching Learning — Jul-Aug 2018
- Inspire-Impact-Introspect Level 1 — Nov 2018
- Competency Based Transformation :: Leveraging on Human Performance for Growth — Dec 2018
- Unconscious Bias at Workplace — Mar 2019
- Leadership Team workshop — Jun 2019
- Closing the loop on OBE — Aug 2019

## FDPs – Technical Domain
- Online FDP on Internet of Things (IoT), St. Martin's Engineering College, Hyderabad, May 2020
- One Week Online FDP "Emerging Research Trends in Computer Science & IT", BVICAM New Delhi with IEEE & IIPC-AICTE, May 2020
- Online FDP on "Data Science with Python", LBRCE Mylavaram, May 2020
- FDP on Applied ML & DL, APSSDC, June 2020
- AICTE-ATAL FDP on Recent Advancements in Artificial Intelligence and Robotics, SVECW, Feb 2021
- FDP on "Applications of Machine Learning", Dept of CSE SVECW, June 2021
- FDP on Societal Applications of AI, Blockchain and IOT, Dept of CSE SVECW, Sept 2021
- NPTEL Workshop on Data Visualization with R, Jan 2023
- FDP on Data Analytics using Power BI, GNITS Hyderabad, Mar 2023
- FDP on Natural Language Processing and Semantic Modelling, ANITS Visakhapatnam, Apr 2023
- VEDIC FDP – Faculty Induction Program Batch-2, June 2023
- VEDIC FDP – Faculty Induction Program Batch-3, July 2023

## Webinars and Technical Talks
- Webinar on Happy Minds — Dec 2021
- Webinar on National Educational Policy – 2020 – Guidelines & Implementation Practices in Engineering Education — Jun 2021
- Technical Talk on Research work in the area of nanotechnology and nanomaterials — Mar 2022
- Webinar on Career Guidance for Industry Readiness & Profile Building — Jul 2020
- Webinar on Introduction to IoT & Applications — Jul 2020
- Webinar on Introduction to AI & Applications — Jul 2020
- Webinar on Cyber Security & Ethical Hacking — Apr 2020
- CSI TECH TALK on Machine Learning — Mar 2020
- Workshop on "Web Application Development" — Mar 2020

## Roles and Responsibilities
- Institution Level – VEDIC Coordinator (Learning & Development Division of SVES)
- Institution Level – Student Branch Coordinator (SBC) of Computer Society of India (C.S.I.) at SVECW
- Department Level – NBA-Criteria 2 – Program Curriculum & Teaching Learning Process
- Department Level – Students Alumni, & Parents meetings for NBA & NAAC
- Department Level – Member of BoS Team in Dept of CSE, SVECW
- Department Level – Project Guide & PRC Member – Mini & Major Projects
- Department Level – Counselling – Students for Academics & Personality Development
- Department Level – Mentoring – Students for Campus Placements
- Previously: Coordinator – Dean of Academics
- Previously: Core Team Member – World Bank Funded TEQIP-II Project Implementation worth Rs. 4 crores
- Previously: Coordinator – Press & Media Relations
- Previously: Coordinator – Centre for Teaching Learning (CTL)
- Previously: Content Presenter & Facilitator – Diploma Course in Audio Visual Communications (AVC), Radio Vishnu 90.4

## Courses Taught
- UG: Introduction to Computers & Problem Solving, C-Programming, Object Oriented Programming through Java, Design & Analysis of Algorithms, Data Warehousing & Data Mining, Information Retrieval Systems, Social Networks & Semantic Web, Data Science with R programming, Software Engineering, Software Project Management, Cloud Computing, Professional Ethics & Human Values
- PG: Software Requirements Engineering, Software Project Management, Cloud Computing, Data Warehousing & Data Mining

## Research Profiles
TABLE:
Profile | Link
Google Scholar | https://scholar.google.com/citations?user=l4eNvVcAAAAJ&hl=en
Vidwan | 148510
Research Gate | https://www.researchgate.net/profile/Ramu_Y
ORCID | 0000-0003-4336-005X
Scopus | https://www.scopus.com/authid/detail.uri?authorId=57477665800


## Identifiers & Contact
- Email: yramu@svecw.edu.in
- SVECW Emp ID: 504
- AICTE Unique ID: 1-457776155
`;

const CSE_SHALEM_RAJU_TEXT = `
## Fields of Specialization
- Distributed Computing

## Educational Qualifications
TABLE:
Degree | Institution | Specialization | Year
Ph.D. | JNTU Anantapur | Distributed Computing | Pursuing
M.Tech | Koneru Lakshmaiah College of Engineering, Vijayawada | CSE | 2007
B.Tech | Sir C.R.Reddy College of Engineering | CSE | 2004

## Professional Affiliations
- Life Member CSI
- Life Member ISTE
- Life Member IEI

## Publications in National/International Journals
- "Digital Image Watermarking based on Hybrid FRT-HD-DWT Domain and Flamingo Search Optimization" — IJCVR, 2023
- "Performance Analysis of automation monitoring system shifting from devops to devsecops" — IJETER, 2020
- "Efficient nutshell concise representation of range queries in wireless communication network" — WJES, 2013
- "Architectural Level of study of ArcGIS Server" — IJERT, 2012

## Books Published
- Fundamentals of Deep Learning: Theory and Applications

## Achievements
- Qualified in GATE-2005
- Qualified in GATE-2016
- Qualified in GATE-2017
- Qualified in APRCET-2018

## Patents
- "AN IOT BASED SYSTEM FOR INSTINCTIVE STOPPING ALERT TO DRIVERS USING ON PASSENGER TICKET" — Patent No: 202141012346A

## NPTEL Courses
- Cryptography and Network Security — 12 weeks
- Discrete Mathematics — 12 weeks

## Certifications
- COURSERA – AI for Everyone — 4 weeks
- COURSERA – Spatial Data Science and Applications — 4 weeks
- COURSERA – Algorithmic Toolbox — 4 weeks

## FDPs / Workshops / Seminars / Training Programs
- 6-day online FDP on "Data Analytics using R language" — Bhopal School of Social Sciences (June 2021)
- 6-day Induction Programme on "Research Methodology and Statistical Analysis" — SRKR Engineering College, Bhimavaram (July 2018)
- One week national workshop on "21st century teaching methodologies" — JNTUK (October 2016)
- One week FDP on "Mobile communication" — BVRIT, Narsapur (May 2013)
- One week workshop on "Microcontrollers" — ATL, SVECW (August 2011)
- One week FDP on "Instructional Design and Delivery" — NITTTR, Chennai at SVECW (September 2007)

## Roles and Responsibilities
- Department Course files coordinator
- III year Mini Projects coordinator
- II year Mini Projects coordinator
- Students counsellor
- Students Mentor
- PG Project PRC panel member
- B.Tech Project guide

## Courses Taught
- UG: Principles of Programming Languages, Database Management Systems, Computer Graphics, Mathematical Foundations of Computer Science, Multimedia and Applications Development, Human Computer Interaction, Data Structures, Object oriented Analysis and Design, Cryptography and Network Security, Compiler Design, Operating Systems, Formal Languages and Automata Theory, Computer Organization and Architecture, Digital Logic Design, Discrete Mathematics, Professional Ethics, Artificial Intelligence, Advanced Database Management Systems, UML and Design Patterns
- PG: Mathematical Foundations of Computer Science, Advanced Data Structures, Human Computer Interaction

## Research Profiles
TABLE:
Platform | Profile Identifier
Google Scholar | flhC9psAAAAJ
Vidwan | 148190
Research Gate | https://www.researchgate.net/profile/Shalem-Raju/research
ORCID | 0000-0002-5007-2016
Scopus | https://www.scopus.com/authid/detail.uri?authorId=58668435400


## Identifiers & Contact
- Email: jesuratnashalemraju@svecw.edu.in
- SVECW Emp ID: 509
- AICTE Unique ID: 1-456553571
`;

const CSE_M_PRASAD_TEXT = `
## Fields of Specialization
- MANET Routing
- WSN
- ML & DL

## Educational Qualifications
TABLE:
Degree | Institution | Specialization | Year
Ph.D. | SRU | MANET Routing | 2018
M.Tech | JNTUCE, Ananthapuram | CSE | 2008
B.Tech | NEC, Narasaraopeta | IT | 2005

## Professional Affiliations
- ISTE
- CSI
- IEEE
- IFERP

## Research Profiles
TABLE:
Platform | Profile ID
Google Scholar | Zlwl_SwAAAAJ
Vidwan | 328447
ResearchGate | Maddula-Prasad
ORCID | 0000-0002-5092-9032
Scopus | 57394291700

## Journal Publications (National/International)
- "Fog-Based Data Analytics Scheme using Edge Affinity based Management" - Neuroquantology, Sep 2022, Vol 20, Issue 11, pp 1674-1682
- "ICN Scheme and Proxy re-encryption for Privacy Data Sharing on the Block Chain" - International Journal of Computer Engineering in Research Trends (IJCERT), Vol 10, Issue 4, 2023, pp 172-176
- "A Comprehensive Analysis on Risk Prediction of Heart Disease using Machine Learning Models" - International Journal on Recent and Innovation Trends in Computing and Communication, 11(11s), pp 605-610
- "Block chain-Enabled On-Path Caching for Efficient and Reliable Content Delivery in Information-Centric Networks" - International Journal on Recent and Innovation Trends in Computing and Communication, 11(9), pp 358-363

## Conference Publications
- "Enhancing the MANET AODV Forecast of a Broken Link with LBP" - ICISSC 2022, Springer
- "COVID-19 prediction with Chest X-Ray images using CNN" - IEEE Sponsored ICIITCEE 2023, Jan 2023
- "Mobile Application-Based Blood Donation System With Augmented Features" - ICRICEIT-23, Feb 2023
- "A Machine Learning Agriculture Crop Recommendation System Using Soil Composition And Weather Properties" - ICRATESM 2023, Mar 2023
- "ICN scheme and proxy re-encryption for privacy data sharing on the block chain" - CCODE-2023, Mar 2023
- "A Hybrid Intelligent Cryptography Algorithm for Distributed Big Data Storage in Cloud Computing Security" - MIWAI-23, Jul 2023
- "Deep Learning For Cancer Prediction: A Comprehensive Review" - 5th International Anatolian Scientific Research Congress, Jul 2023
- "Performance Analysis of Supervised Learning Models for Laptop Price Prediction" - ICCM-2023, Aug 2023
- "Voice Enabled Deep Learning based Image Captioning Solution for Guided Navigation" - NMITCON-23, Sep 2023
- "Waste Management Detection Using Deep Learning" - ICCIT 2023, IEEE
- "Fake News Detection using Cellular Automata Based Deep Learning" - ICCIT 2023, IEEE
- "Image Caption Generation using ResNET50 and LSTM" - SILCON-23, Nov 2023
- "Tomato Plant Leaf Diseases Detection with Deep Learning" - CSEAi 2023, Nov 2023
- "A study on Fatty Liver Segmentation and Classification as revealed by CT Scans" - ICISSC-2023, Dec 2023
- "A Novel ALU Using Distributed Arithmetic For Real Time Signal Processing Applications" - ICRAAE-2023, Dec 2023
- "Robust Strategies for Authenticating and Exchanging Secret Keys in Machine-to-Machine Communications with Enhanced Security" - ISDIA-2024, Jan 2024
- "A CNN and TF Techniques Development for Efficient Identification of Floral Recognition" - IC2PCT-24, Feb 2024
- "A Hybrid Intelligent Cryptography Algorithm for Distributed Big Data Storage in Cloud Computing Security" - MIWAI-23, Springer LNAI Volume 14078, June 2023, pp 637-648

## Books Published
- "Software Engineering" - Global Aaasan Research Publications, ISBN: 978-81-19313-13-6

## Awards & Achievements
- Best Paper Award of the Session - NCRTCST-12, Jan 2012, CMR College of Engineering and Technology
- Second Prize - NCACTA-2018, Jul 2018, BVC EC, Odalarevu
- "Bharath Vidya Sri Award" - BTA, India, 2019
- "Best teacher award" - TRP, India, 2020
- Google Developers Educator Recognition - Android Educator Program, 2021-22
- Appreciation certificate for mentoring NPTEL's Cyber Security and Privacy Online Course

## Patents
- "License Plate Recognition with an Intelligent Camera" - Copyright Office India, Application No 12110/2022-CO/L, Publication Date: 07/06/2022
- "Paper Scanning Machine based on Internet of Things" - Design patent Application Number: 367333-001, Applied: 06/07/2022, Registered: 12/04/2023
- "A System and Apparatus for AI based Multifunction mixer grinder with automatic soaking and food ingredient preparation techniques" - Indian patent application 202341065950, Filed: 30/09/2023

## NPTEL Certifications
- Elite certification - Cyber Security & Privacy Course (Jul-Oct 2023)
- Elite certification - Cloud Computing Course (Feb-Mar 2018)
- Elite certification - Demystifying Networking Course (Jul-Aug 2019)

## Online Certifications
- "Fundamentals of Network Communication" - University of California, Irvine via Coursera, Apr 2020
- "Introduction to the Internet of Things and Embedded Systems" - University of California, Irvine via Coursera, Jun 2020
- CISCO Networking Academy - "Introduction to Packet Tracer", Oct 2023

## Faculty Development Programs Attended
- One Week National Level Online FDP on "Recent Trends in Cyber Security and Machine Learning" - SVECW, Jun 2022
- Online Bootcamp - "Basics of Android App Development with Kotlin" - L4G & Google Developer Team, Jun 2022
- One Week National Level Online FDP on "Amazon Web Services" - BVC CE Rajamundry with AICTE, Aug 2022
- National Level Online FDP on "How Teachers Can Make a Difference" - IIT-M Chennai Teaching Learning Center, Dec 2022
- FDP on "IDEATE 3.0" - VEDIC Lake View Campus Hyderabad, Dec 2022
- One Week FDP on "Data Science for Engineers" - VNR Vignana Jyothi Institute, Jan 2023
- Online Training Program on "Master Data Analytics" - EXCELR, Jul-Aug 2023
- Technical skills enrichment program on "Networking & Cyber Security" - Nettur Technical Training Foundation Bangalore, Oct 2023
- Virtual Faculty Buildathon on "Data Analytics with Cognos" - SmartInternz and IBM, Jul-Aug 2023
- 12 Weeks NPTEL-AICTE FDP Certificate - Cyber Security & Privacy course, 64% score
- One week Online FDP on "Role of Bigdata and Cloud in the Era of Transformation" - GATES Institute Gooty, Jan-Feb 2024
- National level one week FDP on "Python Programming with DJango Framework for Building Web Applications" - CMR Engineering College Hyderabad with SAK Informatics, Feb 2024

## Workshops & Seminars
Attended:
- One day webinar on "Blockchain Technology: Insights and Applications" - SR K R Engineering College Bhimavaram, Aug 2022
- IP Awareness/Training program - Intellectual Property Office India, Sep 2022
- One day online workshop on "Intellectual Property Commercialization" (TIF-2023) - TurnIP Innovations Pvt. Ltd Kolkata, Jan 2023
- One day Online AICTE sponsored "Adobe – AICTE Digital Creativity Skills Workshop for Faculty Development", Jun 2023

Organized:
- One-day workshop on "Countering Cyber Attacks & Cyber Frauds" - SVECW with DMC JNTUK and CERT, Sep 2022
- Paper Presentation Contest coordination for CSE Students - SVECW, Sep 2022
- One-day workshop on Cyber Security Awareness - "Preventive Measures and Reporting Mechanisms" - SVECW with DMC JNTUK and CERT-In, Oct 2022
- 24-Hours Mobile Android Application Development Contest "APPATHON-22" - SVECW, Nov 2022
- One Week National Level online FDP on "Recent trends in Artificial Intelligence and Cyber Security" - SVECW CSE, Nov 2022
- One Week National Level Online Faculty Development Program on "Societal Applications of Machine Learning" - SVECW CSE, Dec 2022
- One Week National Level Online Faculty Development Program on "Recent Advances in Data Science, Data Analytics and Cyber Security" - SVECW CSE, Mar 2023
- Two Days Boot Camp on "Android Application Development" - SVECW, Mar 2023
- 24-Hours Mobile Android Application Development Contest "APPATHON-23" - SVECW, Apr 2023
- One Week National Level Online Faculty Development Program on "Societal Applications of Machine Learning" - SVECW CSE, Jul 2023
- Online Webinar on "Women in Software Industry: Leaders for a Sustainable Future" - SVECW, Aug 2023
- Three Days Hands-on Workshop on "Ethical Hacking" - SVECW with Spypro Security Solution Pvt. Ltd., Aug 2023
- Three Days Hands-on Workshop on "Ethical Hacking & Information Security" - SVECW with Spypro Security Solution Pvt. Ltd., Aug-Sep 2023
- Two Days Hands-on Workshop on "Machine Learning with Python" - SVECW with Purple IT Solutions Vijayawada, Nov 2023
- Coding Contest "OSCODE-24" - SVECW, Feb 2024

## Editorial Board Memberships
- International Journal of Science Research and Innovation Engineering (IJSRIE)
- International Journal of Advanced Research in Computer Science and Engineering (IJOARCSE)
- Journal of International Journal of Artificial intelligence (IJAI)
- Mathematics and Computer Science

## Reviewer Roles
- International Journal of Advanced Computer Science and Applications (IJACSA)
- International Journal of Blockchains and Cryptocurrencies
- Optical and Quantum Electronics (SCIE)
- Entertainment Computing (SCIE)
- American Journal of Computer Science and Technology

## Conference Review Experience
- International Conference on Cognitive Internet of Things Technologies ICCITT 2023, Barcelona, Spain
- IEEE Sponsored 3rd International Conference on Computing and Information Technology (ICCIT), Tabuk, Saudi Arabia
- International Conference on Internet of Things, Communication, Intelligence and Computing (IC-ICIC-2023), Shridevi Institute
- International Conference on Computational Sciences and Sustainable Technologies ICCSST-2023, CHRIST & Modern College Business Science
- 4th EAI International Conference on Cognitive Computing and Cyber Physical Systems EAI IC4S 2023, Vishnu Institute
- AICTE Sponsored IEEE International Conference on Networks, Multimedia and Information Technology 2023 NMITCON 2023, Nitte Meenakshi Institute
- IEEE International Conference on Integrated Intelligence and Communication Systems 2023 ICIICS 2023, Sharnbasva University
- Springer 5th International Conference on Computer & Communication Technologies (IC3T) 2023, Kakatiya Institute
- Springer First IEEE International Conference on Data Science and Network Security (ICDSNS-2023), Kalpataru Institute
- International Conference on Advanced Computing & Communication Technologies (ICACCTech23), Swami Vivekanand Institute
- IEEE Xplore "International Conference on Ambient Intelligence, Knowledge Informatics and Industrial Electronics (AIKIIE-2023)", Rao Bahadur Y. Mahabaleswarappa Engineering College
- MDPI "International Conference On Recent Advances In Science And Engineering (RAiSE-2023)", Manipal Institute
- IEEE Xplore "3rd International Conference on Mobile Networks and Wireless Communications (ICMNWC-2023)", Sri Siddhartha Institute
- IEEE Xplore "International Conference on Evolutionary Algorithms and Soft Computing Techniques (EASCT-2023)", RV Institute
- "4th International Conference on Microelectronics, Computing Systems, Machine Learning & Internet of Things (MCMI-2023)", ISVE Ranchi
- IEEE Xplore 3rd Edition Flagship International Conference Series, Malnad College of Engineering
- Springer ICCAIML'24 - Technical Program Committee Member/Reviewer, Manipal University Jaipur
- Springer "First International Conference on Algorithms and Computational Theory for Engineering Applications (ICACTEA-24)", Aditya Engineering College

## Conference Session Chair Roles
- Chief guest for DIGI-2K22 and judge for paper presentation at VEDA 2022, Aditya Engineering College Surampalem
- Session Chair - ISVE Ranchi Centre "3rd International Conference on Microelectronics, Computing Systems, Machine Learning & Internet of Things (MCMI-2022)"
- Session Chair - ISVE Ranchi Centre "8th International Conference on Nano Electronics, Computational Intelligence & Communication Systems (NCCS-2022)"
- Chair for Special Session on "Big Data Analytics in IoT-Based Smart Healthcare and Former Engineering Applications" - ICDAM-2023
- Session Chair - ISVE Ranchi Centre "4th International Conference on Microelectronics, Computing Systems, Machine Learning & Internet of Things (MCMI-2023)"

## Administrative Roles & Responsibilities
- Department R & D Coordinator
- Department CSP Coordinator
- Department Major & Mini Project Coordinator
- Department NAAC Criteria III & VI Coordinator

## Courses Taught
- UG: Python Programming, Problem Solving Skills, Data Visualization through Tableau, Mobile Android Application Development, C & Data Structures, Embedded Systems, Computer Organization, Operating Systems, Human Computer Interaction, Internet Technologies, Object-Oriented Programming through JAVA, Computer Graphics, Information Retrieval Systems, Distributed Databases, Software Testing Methodologies, Software Project Management, Network Programming and Biometrics
- PG: Network Project Management, Distributed Systems, Advanced Communication and Networking, Data Communications, Computer Networks


## Identifiers & Contact
- Email: drmprasadcse@svecw.edu.in
- SVECW Emp ID: 504
- AICTE Unique ID: 1-1597240743
`;

const CSE_SRIKANTH_TEXT = `
## Fields of Specialization
- Networks
- ML

## Educational Qualifications
TABLE:
Degree | Organization/Institution | Specialization | Year
Ph.D. | AUCE(A), Andhra University | Internet of Things | 2022
M.Tech | Aditya Engineering College, Surampalem | CSE | 2013
B.Tech | Sri Vasavi Engineering College | CSE | 2010

## Professional Affiliations
- Life Member CSE, ISTE, IEI

## Journal Publications
- Pala, Srikanth & Rani, T. (2013). "Optimistic Query Refresh"
- P. Srikanth, Prof. S. Pallam Shetty, "A Review on RPL for Low Power Lossy Networks" (UGC)
- P. Srikanth, S.Pallam Shetty, K.Venkata Krishna R, "Taguchi Design of Experiments..." (UGC)
- P.Srikanth, S.Pallam Shetty "Investigate the impact of ICMP on the performance..." (UGC)
- P Srikanth, Prof S Pallam Shetty, Venkata Krishna Rao K, "Fuzzy Based ICMP-RPL..." (Scopus)
- P Srikanth, Prof S Pallam Shetty, Venkata Krishna Rao K, "ANFIS Based ICMP-RPL..." (Scopus)
- P Srikanth, Prof S Pallam Shetty, Venkata Krishna Rao K, "Analysing the impact of ICMP..." (Scopus)
- Katakamsetty, V.R., Rajani, D. and Srikanth, P. (2023). "A study on community detection..."

## Achievements
- Qualified SET-2018

## NPTEL Courses
- Internet of Things
- Industrial Internet of Things
- Introduction to Research

## Certifications
- CCNA Instructor Training by CISCO Network Academy

## Courses Taught
- UG: C Programming, Computer Organization & Architecture, Information Security, Design & Analysis of Algorithms, Discrete Mathematics, Machine Learning, Computer Networks, Java Programming, E-commerce, Social Networks and Semantic Web, Theory of Computing
- PG: Computer Organization, Information Security, Mobile Computing, Discrete Mathematics, Software Project Management

## Research Profile Links
- Google Scholar: http://scholar.google.co.in/citations?user=T_ucl8MAAAAJ
- Web of Science: https://www.webofscience.com/wos/author/rid/A-9837-2019
- ORCID: https://orcid.org/0000-0002-4914-8415
- Scopus: http://www.scopus.com/authid/detail.url?authorId=58285019400


## Identifiers & Contact
- Email: Sreekanth.pala@svecw.edu.in
- SVECW Emp ID: 567
- AICTE Unique ID: 1-2642703039
`;

const CSE_RAJA_RAO_TEXT = `
## Fields of Specialization
- MANET
- Cloud Computing
- DL

## Educational Qualifications
TABLE:
Degree | Organization/Institution | Specialization | Year of Passing
Ph.D. | SSSUTMS, Sehore, Bhopal | CSE | 2021
M.Tech | JNTUK, Kakinada | CSE | 2013
B.Tech | Dr NNCE, Tholudur, (T.N) | CSE | 2005

## Professional Affiliations
- MISTE
- IAENG

## Publications in National/International Journals
- Pilli, B.V.R., et al. "Detecting the Vehicle's Number Plate in the Video Using Deep Learning Performance" Review of International Geographical Education Online, 2021
- Josphineleela, R., Raja Rao, P.B.V., et al. "A Multi-Stage Faster RCNN-Based iSPLInception for Skin Disease Classification Using Novel Optimization" Journal of Digital Imaging, 2023
- M.Prasad, P R Sudha Rani, Raja Rao PBV, et al. "Block chain-Enabled On-Path Caching for Efficient and Reliable Content Delivery in Information-Centric Networks" International Journal on Recent and Innovation Trends in Computing and Communication, 2023
- M. Prasad, Raja Rao PBV "Fog-Based Data Analytics Scheme using Edge Affinity based Management" Neuroquantology, 2022
- Raju, P. J. R. S., et al. "Deep Insights into Data Analysis in Multi-Core Active Flash Arrays" International Journal of Intelligent Systems and Applications in Engineering, 2024
- Sree, P. K., et al. "A Comprehensive Analysis on Risk Prediction of Heart Disease using Machine Learning Models" International Journal on Recent and Innovation Trends in Computing and Communication, 2023
- Veera V Rama Rao M, et al. "Enhancing Network Security: Leveraging Machine Learning for Intrusion Detection" J. Electrical Systems, 2024
- Raja Rao PBV, et al. "Generic Framework for Vehicle Identification System with Deep Learning Models" J. Electrical Systems, 2024
- Thotakura Venkata Sai Krishna, et al. "A novel ensemble approach for Twitter sentiment classification with ML and LSTM algorithms for real-time tweets analysis" Indonesian Journal of Electrical Engineering and Computer Science, 2024

## Conference Publications
- "COVID-19 prediction with Chest X-Ray images using CNN" ICIITCEE 2023
- "A Hybrid Intelligent Cryptography Algorithm for Distributed Big Data Storage in Cloud Computing Security" LNAI 2023
- "Enhancing the MANET AODV Forecast of a Broken Link with LBP" SIST-2023
- "Waste Management Detection Using Deep Learning" ICCIT-2023
- "Fake News Detection using Cellular Automata Based Deep Learning" ICCIT-2023
- "Creating a Protected Virtual Learning Space" LNICST 2024
- "Drug Recommendations Using a Reviews and Sentiment Analysis by RNN" LNICST 2024
- "A CNN and TF Techniques Development for Efficient Identification of Floral Recognition" IC2PCT-24, 2024
- "An Efficient Cancer Detection Model using ML and Transfer Learning Techniques" ICDCOT 2024
- "Leveraging Machine Learning and Data Imaging for Vehicle Number Plate Recognition with CNPR System" ICASSCT 2024
- "An Efficient Sentiment Classification Model using Fusion of BERT and Deep Learning RNN Variants" IC4S-2024
- "Auto Encoders with Cellular Automata for Anomaly Detection" IC4S-2024
- "Ensemble Fusion for Enhanced Malicious URL Detection by Integrating Machine Learning and Deep Learning Techniques" IC4S-2024
- "Crime Detection using Variational Encoders" IC4S-2024
- "Identification of Different Medical Plants using Machine Learning and Image Processing" IC4S-2024
- "Phishing Website Detection through Ensemble Machine Learning Techniques" IC4, 2024
- "Hate Speech Detection using RNN (Recurrent Neural Networks)" IC4S-2024
- "Fake News Detection using ML algorithms" IC4S-2024
- "Power Prediction in CCPP through ML Based Probabilistic Regression Model and Ensemble Techniques" ICSPER-2024

## Books Published
- Fundamentals of Deep Learning-Theory and applications
- Software Engineering
- Understanding Machine Learning Concepts
- Recent Advances in Cloud Computing

## Patents
- A System and Apparatus for AI based Multifunction mixer grinder with automatic soaking and food ingredient preparation techniques (Indian patent application number 202341065950, filed 30/09/2023, published 20/10/2023)
- A SYSTEM FOR SECURITY OF IOT DEVICES (application number 202141032498 A, filed 20/07/2021, published 30/07/2021)

## NPTEL Courses
- Elite certification "Introduction to Internet of Things" (July-October 2018, 12 Weeks)
- Certification "Cloud Computing" (February-March 2018, 8 Weeks)
- Certification "Big Data Computing" (February-April 2019, 8 Weeks)
- Certification "Cyber Security and Privacy" (July-October 2023, 12 Weeks)

## FDPs / Workshops / Seminars / Training Programs
- ATAL FDP on AI: A Deep Drive into Computer Vision and Natural Language Processing (Nov 2025)
- FDP on "Cyber Security" Sponsored by Ministry of Electronics and Information Technology (Aug-Sept 2023, 10 Days)
- FDP on "Internet of Things (IoT)" (April 2020)
- One Week FDP on "Artificial Intelligence and machine Learning" (April-May 2019)
- One Week FDP on "Data Science and Big Data Analytics" (August 2018)
- One Week FDP on "Data Science and Big Data Analytics" (Oct-Nov 2017)

## Workshops/Seminars and Training Programs Organized
- One-day workshop on "Countering Cyber Attacks & Cyber Frauds" (Sept 2022)
- Paper Presentation Contest for CSE Students (Sept 2022)
- One-day workshop on Cyber Security Awareness Programme (Oct 2022)
- 24-Hours Mobile Android Application Development Contest "APPATHON-22" (Nov 2022)
- One-week National Level online FDP On "Recent trends in Artificial Intelligence and Cyber Security" (Nov 2022)
- One Week National Level Online Faculty Development Program on "Societal Applications of Machine Learning" (Dec 2022)
- One Week National Level Online Faculty Development Program on "Recent Advances in Data Science, Data Analytics and Cyber Security" (Mar 2023)
- 2 Days Boot Camp on "Android Application Development" (Mar 2023)
- 24-Hours Mobile Android Application Development Contest "APPATHON-23" (Apr 2023)
- One Week National Level Online Faculty Development Program on "Societal Applications of Machine Learning" (Jul 2023)
- Online Webinar on "Women in Software Industry: Leaders for a Sustainable Future" (Aug 2023)
- 3 Days Hands-on Workshop on "Ethical Hacking" (Aug 2023)
- 3 Days Hands-on Workshop on "Ethical Hacking & Information Security" (Aug-Sept 2023)
- 2 Days Hands-on Workshop on "Machine Learning with Python" (Nov 2023)

## Editor-in-Chief for Various UGC Journals
- International Journal of Wireless Security and Computer Networks
- Asian Journal of Research in Computer Science

## Reviewer in Various UGC/Scopus Indexed Journals
- International Conference on Social and Sustainable Innovations in Technology and Engineering SASI-ITE-2024
- International Conference on Computing for Science, Engineering & Artificial Intelligence CSE Ai-2023
- International Conference on Algorithms and Computational Theory for Engineering and Applications ICACTEA-2024

## Session Chair for Conferences
- Session Chair for International Conference on Algorithms and Computational Theory for Engineering and Applications ICACTEA-2024
- Session chair for International Conference on Intelligent Healthcare and Computational Neural Modelling (ICIHCNM-2024)

## Roles and Responsibilities
- R & D Consultancy Coordinator
- M.Tech Project Coordinator
- III-Year Mini project Coordinator
- III-C Class In charge
- II-Student Consular
- IV-Student Mentor

## Courses Taught
- UG: CN, DBMS, Cloud Computing, DLD, COA, E-Commerce, SE, DC, MFCS, STM, SPM, HCI, Mobile Computing, OOAD, MAD, OS, PE
- PG: IOT, ML, Cloud Computing, Mobile Computing, MFCS, ACN

## Research Profiles
TABLE:
Profile | Link
Google Scholar | https://scholar.google.co.in/citations?user=xsD28rgAAAAJ&hl=en&authuser=1
Vidwan | https://vidwan.inflibnet.ac.in/profile/328450
Research Gate | https://www.webofscience.com/wos/author/record/32535264
ORCID | https://orcid.org/0000-0002-2054-6567
Scopus | https://www.scopus.com/authid/detail.uri?authorId=57216160958

## Achievements
- Received the Dr. APJ Abdul Kalam National Pratibha Award – 2025 from the Southern Private Lecturers Teachers Organisation (SPLTO), Guntur, on 26th October 2025


## Identifiers & Contact
- Email: drpbvrajaraocse@svecw.edu.in
- SVECW Emp ID: SVECW00644
- AICTE Unique ID: 1-490602742
`;

const CSE_VEERARAGHAVAN_TEXT = `
## Fields of Specialization
- Machine Learning
- Data Science

## Educational Qualifications
TABLE:
Degree | Organization/Institution | Specialization | Year of Passing
Ph.D. | NIT-Trichy | Data Analytics | 2017
M.Tech | Anna University | CSE | 2008

## Publications in Conferences (National/International)
- "Long-term and short-term rainfall forecasting using deep neural network optimized with flamingo search optimization algorithm" (SCIE)
- "Optimized deep learning system for smart maize leaf disease detection in IoT platform via routing algorithm" (SCIE)
- "Bayesian Probability and Tanimoto Based Recurrent Neural Network for Question Answering System" (SCIE)
- "A modified approach for information systems success in the context of internet banking using structural equation modelling with R: an empirical study from India" (Scopus)
- "Information systems success in the context of internet banking: Scale development" (Scopus)

## Conference Presentations
- "A Signature and Anomaly Based Intrusion Detection System" at Rajarajeswari Engineering College, Chennai (April 2008)

## Book Chapters Published
- "An extension to the Delone and Mclean information systems success model and validation in the internet banking context" (IGI Global, 2019)

## Patents
- "Smart fruit picker for fruit categorization and quality identification" (Published 11/09/2020)

## Certifications (Coursera)
- Introduction to Artificial Intelligence
- TensorFlow for Machine Learning
- Deep Learning
- Python Data Structures
- Neural Networks and Deep Learning (Part of Deep Learning.ai Specialization)
- Programming for Everybody
- Processing Data with Python
- Linear Regression with Numpy and Python
- Improving Deep Neural Networks: Hyperparameter

## FDPs / Workshops / Seminars / Training Programs Attended
- Five-day FDP on Artificial and Machine Learning at CMR Technical Campus, Hyderabad (May 2020)
- One-week FDP on Big Data tools at St. Martyn's Engineering College, Hyderabad (May 2020)
- One-week FDP on Art of Writing Papers at Gokha Raju Rengaraju Institute of Technology, Hyderabad (May 2020)
- Five-day workshop on Artificial Intelligence and Deep Learning at Bennett University, New Delhi (May 2020)
- 6-day FDP on Soft Computing techniques for Analysis of Large Datasets at NIT-Andhra Pradesh (February 2019)
- 6-day workshop on Computer Oriented Optimization Techniques at Sri Vasavi Engineering College (November 2017)
- 6-day Workshop on Cloud computing using VMware at CSG, NIT, Trichy (June 2013)

## Roles and Responsibilities
- Teaching advanced courses in Machine Learning and Data Science
- Internal Board of Studies Member, Department of CSE
- Mentoring B.Tech and M.Tech students in final year projects

## Courses Taught
- UG: Machine Learning, Data Structures and Algorithms, DBMS, Operating Systems, Computer Networks, Computer Organization and Architecture, Microprocessor 8086 Programming and Interfacing, Digital Logic Design, Cryptography and Network Security, Mobile Computing, Web Technologies
- Programming Languages (UG): C, Java, Python, JavaScript
- PG: Advanced Data Structures, Advanced Operating Systems, Cloud Computing

## Research Profiles
TABLE:
Platform | Link
Google Scholar | https://scholar.google.com/citations?hl=en&user=k2dNVecAAAAJ
Scopus | https://www.scopus.com/authid/detail.uri?authorId=56506778100
ORCID | https://www.scopus.com/authid/detail.uri?authorId=56506778100


## Identifiers & Contact
- Email: drjveeraraghavancse@svecw.edu.in
- SVECW Emp ID: 50008
`;

const CSE_SUNIL_PATTEM_TEXT = `
## Fields of Specialization
- Deep Learning

## Educational Qualifications
TABLE:
Degree | Institution | Specialization | Year
Ph.D. | Andhra University | Deep Learning | Pursuing
M.Tech | Nova College of Engineering & Technology, JNTU, Kakinada | CSE | 2009
M.Sc (CS) | Akkineni Nageswarara Rao College, ANU, Guntur | Computer Science | 2001

## Professional Affiliations
- Life Member CSI
- Life Member ISTE

## Publications in Conferences (National/International)
- "Intelligent animal tracking system using IoT and machine learning scheme" - ICETMCCT 2021, AIP Conference Proceedings, Vol. 2587, Issue 1
- "Story Telling with Basic and Advanced Data Visualizations of Blockchain Technologies" - IEEE ICAISS 2023
- "RaituVrudhi – An Android based Mobile Application for Agro-Marketing" - INCET 2023
- "Lessoning Geospatial Visualizations on Real-Time Data" - IEEE CSITSS 2021
- "A Case Study to Exhibit Instructional Planning, Design, Execution and Assessment with Measurable Student Learning Outcomes in Outcome-Based Education" - NCEE-2021

## Publications in Journals (National/International)
- "An Approach To Identify Accurate Machine Learning Model To Build Human Stress Level Prediction System" - International Journal for Innovative Engineering and Management Research, Volume 12, Issue 02, Feb 2023
- "A Comparative Study on Prejudiced Measurements of Datasets in three variants of Automatic Evolutionary Clustering using Teaching-Learning-Based Optimization" - Natural Volatiles and Essential Oils (NVEO), Volume 8, Issue 4, Nov 2021

## Certifications
- 3D Models for Virtual Reality (University of London, June 2020)
- Introduction to Augmented Reality and ARCore (Daydream, May-June 2020)
- Introduction to Virtual Reality (University of London, April-May 2020)
- VR and 360 Video Production (Daydream, April-May 2020)
- Programming for Everybody (Getting Started with Python) (University of Michigan, May-June 2020)
- Introduction to Data Science in Python (University of Michigan, April-May 2020)
- Python Data Structures (University of Michigan, May-June 2020)
- Introduction to Html5 (University of Michigan, April-May 2020)
- Interactivity with JavaScript (University of Michigan, April-May 2020)
- AI for Everyone (Deeplearning.ai, April-May 2020)
- Machine Learning for All (University of London, June 2020)
- Machine Learning Foundations: A Case Study Approach (University of Washington, June 2020)
- BlockChain Basics (State University of New York, June 2020)
- 3D Interaction Design in Virtual Reality (University of London, June 2020)
- Handheld AR App Development with Unity (Unity, June 2020)
- Using Python to Access Web Data (University of Michigan, June-July 2020)
- Data Science Ethics (University of Michigan, June-July 2020)
- Introduction to Artificial Intelligence (IBM, July-August 2020)
- AR & Video Streaming Services Emerging Technologies (Yonsei University, June-July 2020)

## FDPs / Workshops / Seminars / Training Programs
- Five-day online Faculty Development Program on Software Test Automation with Selenium (TCS, Nov-Dec 2023)
- Five-day FDP on Power of Visualization in Analytics (BVRIT, Hyderabad, Aug 2023)
- Five-day Faculty Development Program on "Research Methodology on Machine Learning and Data Science" (BVRIT-Narasapur, July 2023)
- One-week National Level Online FDP on Recent Advances in Data Science, Data Analytics and Cyber Security (CSE-SVECW, March 2023)
- Five-day FDP on Ethical Hacking (Blackbuck Engineers, KKR&KSR Institute, March 2023)
- One-week FDP on Natural Language Processing (VNR VJIET, Hyderabad, Feb 2023)
- One-week National Level Online FDP on Recent Trends in Cyber Security and Machine Learning (SVECW, June 2022)
- Five-day National Level online FDP on "Recent Advancements in Artificial Intelligence and Robotics" (AICTE-ATAL, Feb 2021)
- Five-day online ATAL Faculty Development Program on "Android App Development" (July 2021)
- Five-day online ATAL Faculty Development Program on "Data Sciences" (June 2021)
- Five-day online ATAL Faculty Development Program on "Robotics" (Feb 2021)
- Five-day online ATAL Faculty Development Program on "Augmented Reality (AR) / Virtual Reality (VR)" (Jan 2021)
- Five-day online ATAL Faculty Development Program on "Immersive Virtual Reality" (Oct 2020)
- Five-day online ATAL Faculty Development Program on "Augmented Reality (AR) / Virtual Reality (VR)" (Sep 2020)
- Online FDP on Data Science and its Applications (SRKR, Bhimavaram, June 2021)
- Online Workshop on React JS (SASI, Tadepalligudem, July 2021)
- One-week National Level Online FDP on "Societal Applications of AI, Blockchain, and IoT" (CSE/SVECW, Sep 2021)
- Five-day FDP on Blockchain Technology with Hands on (Department of IT, S.R.K.R. Engineering College, Feb 2021)
- Five-day Online FDP on Emerging Research Trends in CSE (GMR Institute of Technology, Rajam, Oct 2020)
- Webinar on "Patent Act, Drafting, Filing system and challenges in India" (RMD Engg College, Kavaraipettai, June 2020)
- Five-day online FDP on "R Programming" (Prakasam Engineering College, Kandukulr, May 2020)
- Five-day national online FDP on "Artificial Intelligence" (BVRIT Hyderabad, May 2020)
- Online Web Development Bootcamp Workshop (Vedic-Dev, April-May 2020)
- Eight-day workshop on "Nasscom Associate Analytics" (VEDIC, Hyderabad, Nov 2019)
- Five-day NassCom workshop on "Data Analytics using R" (VEDIC, March 2018)

## Roles and Responsibilities
- WISE (Women In Software Engineering) program coordinator
- NAAC overall coordinator
- NBA Coordinator
- B.Tech Projects PRC member

## Courses Taught
- UG: DBMS, Data Mining, Cloud Computing, C, C++, Java, Web Technologies, DAA, SE
- PG: Python Programming for 1st M.Tech Students

## Research Profiles
- Google Scholar: https://scholar.google.com/citations?user=nSV6fNUAAAAJ&hl=en&oi=ao
- Vidwan: https://vidwan.inflibnet.ac.in/profile/148210D
- ResearchGate: https://www.researchgate.net/profile/Sunil-Satvik-2
- ORCID: https://orcid.org/0000-0002-0095-0693
- Scopus: https://www.scopus.com/authid/detail.uri?authorId=57477917300


## Identifiers & Contact
- Email: sunilp@svecw.edu.in
- SVECW Emp ID: 605
- AICTE Unique ID: 1-456553785
`;

const CSE_NARASIMHA_RAJU_TEXT = `
## Areas of Interest
- Software Engineering
- Computer Vision

## Educational Qualifications
TABLE:
Degree | Organization/Institution | Specialization | Year of Passing
Ph.D. | Annamalai University | CSE | 2024
M.Tech | Swarnandhra College of Engineering & Technology | CSE | 2011
B.Tech | Swarnandhra College of Engineering & Technology | IT | 2009

## Courses Taught
- UG: Operating Systems, Digital Logic Design, Software Engineering, Unix Programming, Computer Networks, Software Project Management, Human-Computer Interaction, Management Science, Information Retrieval Systems, Data Science with R
- PG: Operating Systems, User Interface Design, Object Oriented Analysis and Design, Software Requirements Estimation, Service Oriented Architecture, Software Quality Assurance and Testing

## Research Profile Summary
- Journals: 09
- International Conferences: 06
- National Conferences: 02
- Books/Chapters: 01
- Patents Granted: 01

## Publications in National/International Journals
- "Efficient Search Technique for Sensitive Metric Data in Cloud" - International Journal of Computer Science and Technology (IJCST), Vol. 4, Issue 3, July–September 2013
- "Solving Optimality and Storage Constraint Problem in Data Staging using Dynamic Programming" - International Journal of Research in Computer Science Engineering (IJRCSE), Vol. 4, Issue 4, July–August 2014
- "A Feasible Solution Towards Encoded Data Store Strategy In Cloud" - International Journal of Reviews on Recent Electronics and Computer Science (IJRRECS), October 2016, Volume 4, Issue 10
- "Scientific Workflow Management among Distributed Sites with Big Data" - International Journal of Advanced Research in Computer Science & Technology (IJARCST 2017), Vol. 5, Issue 4, October–December 2017
- "Systematically recognizing potential process-related threats in SCBDA" - International Journal of Research, Volume 05, Issue 07, March 2018
- "Exploratory Data Analysis on Blueberry yield through Bayes and Function Models" - International Journal on Recent and Innovation Trends in Computing and Communication (IJRITCC), 10-10-2023
- Springer Book Chapter: "IoMT with Cloud-Based Disease Diagnosis Healthcare Framework for Heart Disease Prediction Using Simulated Annealing with SVM" - Smart Sensors for Industrial Internet of Things
- "Object Recognition in Remote Sensing Images Based on Modified Backpropagation Neural Network" - Traitement du Signal
- "Remote Sensing Image Classification Using CNN-LSTM Model" - Revue d'Intelligence Artificielle
- "Optimizing Breast Cancer Diagnosis with Advanced Deep Learning Techniques in Medical Imaging" - Journal of Electrical Systems, Vol. 20, No. 2, 2024

## Journal Publications in National/International Conferences
- "Dynamic Strategies of location management in mobile networks" - NCATCCSA-2014, March 2014
- "Survey on Remote sensing Image classification using advanced computing models" - VCANDO–2020, August 2020
- "Key Based Decentralized Access Control Using Cipher text Policy Scheme in Cloud" - ICASEM-2015, December 2015
- "360 Degree Fish Eye Time Lapped Image Motion Using Multi Grand Image Seeker Technique" - ICACIT-19, September 2019
- "Local Information and Kernel Metric fuzzy C-means Segmentation and Hybrid CNN-LSTM network architecture for Skin cancer Classification" - CIRH-2021, December 2021
- "IoT based smart class room monitoring system using convolutional neural network algorithm" - ICEEMS-2021, July 2021
- "Remote Sensing Image Data Classification Using CNN-Deep Q Model" - ICCINS-2022, March 2022
- "An Innovative Machine Learning based Heart Disease Assessment System by Sequential Feature Selection Approach" - CONIT, June 2023

## Research Profile Links
TABLE:
Profile | Link
Google Scholar | https://scholar.google.com/citations?user=Mr1ZeN0AAAAJ&hl=en
Vidwan | https://vidwan.inflibnet.ac.in/myprofile
Research Gate | https://www.researchgate.net/profile/Manthena/research
ORCID | https://orcid.org/0000-0002-8564-0087
Scopus | https://www.scopus.com/authid/detail.uri?authorId=57222052883
Publons | https://www.webofscience.com/wos/author/record/AAR-2894-2020

## Supervision/Guidance
- M.Tech: 05
- B.Tech: 16

## Professional Development Activities - FDP Attendance
- Six-day training program in "Computer Programming" - July 2012 at SVECW
- Training Programme on "Research Methodology & IBM SPSS Statistics 21.0" - July 2013 at JNTU Hyderabad and IB-SPSS South Asia Pvt Ltd
- AICTE recognized (TEQIP-II Sponsored) short-term course on "Pedagogy Training (Module-I)" - Oct-Nov 2013 at NITTR Chandigarh
- National workshop on "Mobile Application Development" - January 2014 at SVECW
- One-day workshop on "Environmental Management Framework" - August 2014 at Government College of Technology, Coimbatore
- TEQIP-II sponsored one-day workshop on "Procurement Practices" - August 2014 at PSG College of Technology, Coimbatore
- Two-day workshop on "IT Integrated Management Services" - November 2014 at SVECW
- National workshop on "Cryptography, Applications and Foundations of Data Science" - October 2015 at NIT Goa
- Two-day workshop on "Big Data & Hadoop" - July 2016 at SVECW
- Five-day workshop on "English for Writing Ph.D Thesis and Journal papers" - October 2016 at SVECW
- FDP on "Cloud Infrastructure & Services" - December 2016 at Swarnandhra College of Engineering and Technology
- Online Course on "Examination Reforms" - April 2020, AICTE
- Three-Day FDP on "Recent Trends in Research Methodology" - May 2020
- Five-Day FDP on "Artificial Intelligence" - May 2020 by BVRIT
- Five-Day FDP on "Blockchain Technologies" - June 2020 at Gudlavalleru Engineering College
- One-week FDP on "Advanced Data Science and Applications" - June 2020 at BVRIT Hyderabad College of Engineering for Women
- Faculty Development Program on "Recent Advancements in Artificial Intelligence" - June 2020 at SVECW
- Faculty Development Program on "Data Science" - June 2020, APSSDC & EXCELR
- Three-Day Virtual Workshop on "Applications of Deep Learning" - July 2020 at Annamalai University
- FDP on "Cyber Security" - July 2020 at Gudlavalleru Engineering College
- Workshop on "Data Analysis with Python (Pandas and Numpy)" - July 2020, School of IT
- One-week online FDP on "Exploring Data Mining and Machine Learning Applications" - May 2021 at G. Pulla Reddy Engineering College, Kurnool
- Online FDP on "Data Science and its Applications" - June 2021 at SRKR, Bhimavaram
- Five-days Online International Faculty Development Program on Data Analytics - June 2023 with APSSDC
- Five-Days Live National Faculty Development Program (NFDP) on "NLP, Computer Vision and Artificial Intelligence" - December 2023, APSSDC
- Five-Days Live National Faculty Development Program (NFDP) on "ChatGPT and Prompt Engineering" - December 2023
- Five-Days FDP on "Software Test Automation with Selenium" - Nov-Dec 2023

## NPTEL Courses
- "Ethics" (04 Week) - Feb-March 2017
- "Introduction to Operating Systems" (08 Week) - July-Sept 2017
- "Introduction to Research" (08 Week) - Feb-March 2018
- NPTEL-AICTE FDP "Software Engineering" (12 Week) - July-Oct 2018
- NPTEL-AICTE FDP "Joy of Computing using Python" (12 Week) - Jan-April 2019
- NPTEL-AICTE FDP "Human Computer Interactions" (8 Week) - Aug-Oct 2019
- NPTEL-AICTE FDP "Cloud Computing" (8 Week) - Jan-April 2020
- NPTEL-AICTE FDP "Effective Engineering Teaching in Practice" (4 Week) - Jan-Feb 2021
- NPTEL-AICTE FDP "Teaching And Learning in General Programs_TALG" (4 Week) - July-Aug 2021
- NPTEL-AICTE FDP "Ethics in Engineering Practice" (8 Week) - Aug-Oct 2021
- NPTEL-AICTE FDP "Introduction to Professional Scientific Communication" (4 Week) - Jan-Feb 2022
- NPTEL-AICTE FDP "Intellectual Property" (12 Week) - Jan-April 2022
- NPTEL-AICTE FDP "Patent Drafting for Beginners" (4 Week) - July-Aug 2022
- NPTEL-AICTE FDP "Accreditation and Outcome Based Learning" (8 Week) - July-Sept 2022
- NPTEL-AICTE FDP "User Centric Computing for Human-Computer Interaction" (8 Week) - Jan-Feb 2024
- NPTEL-AICTE FDP "Software Testing" (4 Week) - Jan-Feb 2024
- NPTEL-AICTE FDP "Python for Data Science" (4 Week) - Jan-Feb 2024

## Certifications - Coursera
- Programming for Everybody (Getting Started with Python) – 7 weeks
- Introduction to Data Science in Python – 4 weeks
- Object-Oriented Programming with Java – 1 week
- AI For Everyone – 4 weeks
- Introduction to Software Product Management – 2 weeks
- Software Processes and Agile Practices – 4 weeks
- Software Design as an Element of the Software Development Lifecycle – 5 weeks
- Software Design as an Abstraction – 7 weeks

## Certifications - EDX
- PH125.1x: Data Science: R Basics

## Professional Memberships
- Computer Society of India (CSI) - I1501630
- Indian Society of Technical Education
- Institution of Engineers - AM174067-1
- International Association of Engineers

## Administrative Roles
- Additional Controller of Examinations

## Other Achievements
- Completed SWAYAM-NPTEL Domain Certification in "Faculty Domain-Advanced" by NPTEL, IIT Madras (October 2022)


## Identifiers & Contact
- Email: mnarasimharajucse@svecw.edu.in
- SVECW Emp ID: 533
- AICTE Unique ID: 1-1507894772
`;

const CSE_GVSS_PRASAD_RAJU_TEXT = `
## Fields of Specialization
- Software Engineering
- Data Science

## Educational Qualifications
TABLE:
Degree | Institution | Specialization | Year
Ph.D. | FEAT, Annamalai University | CSE | 2024
M.Tech | Sri Vasavi Engineering College | CSE | 2012
B.Tech | Swarnandhra College of Engineering & Technology | CSIT | 2008

## Professional Affiliations
- Computer Society of India (CSI) - L1502914 Life Member
- Indian Society of Technical Education - I1501628 Life Member
- Institution of Engineers - AM1740701

## Publications in National/International Journals
- "Predictive Modeling of Lung Cancer Disease Outcomes Using Ensemble Learning" (2025)
- "IRFNet: Skin Lesion Detection and Classification Using Unified Intuitive and Object Classifier" (2022)
- "BLSNet: Skin lesion detection and classification using broad learning system" (2022)

## Publications in National/International Conferences
- "Enhancing Network Security: ML-Based Anomaly Detection" (2024)
- "Machine Learning Approaches for Anomaly Detection in Network Security" (2024)
- "An Innovative Machine Learning based Heart Disease Assessment System" (2023)
- "IoT based smart class room monitoring system using CNN algorithm" (2023)
- "Medical Image Contrast Enhancement using Tuned Fuzzy Logic Intensification" (2022)
- "Skin Lesion Segmentation Using SCU-Net with FNLM Preprocessing" (2022)
- "Image Steganography Security using Hyper Key" (2019)
- "A Review on detection of skin cancers by using machine learning and deep learning" (2020)

## Books
- "Cloud Computing for Business Applications" - Scientific International Publishing House (2024)

## Book Chapters
- "Feature Extraction from Radiographic Skin Cancer Data Using LRCS" (2022)

## NPTEL Certifications
TABLE:
Course | Certificate Type | Duration | Period
Advanced R Programming for Data Analytics in Business | Elite | 12 Weeks | Jul-Oct 2025
Introduction to Machine Learning | Elite | 8 Weeks | Jul-Sep 2025
Business Intelligence & Analytics | Elite | 12 Weeks | Jan-Apr 2025
Introduction to Internet of Things | Elite | 12 Weeks | Jul-Oct 2024
Learning Analytics Tools | Elite | 12 Weeks | Jul-Oct 2024
Cloud Computing | Elite+Silver | 12 Weeks | Jan-Apr 2024
Python for Data Science | Elite | 4 Weeks | Jan-Feb 2024
Systems and Usable Security | Elite | 4 Weeks | Jan-Feb 2024
Software Testing | Successful | 4 Weeks | Jan-Feb 2024
Patent Drafting for Beginners | Successful | 4 Weeks | Jul-Aug 2022
Introduction to Professional Scientific Communication | Elite | 4 Weeks | Jan-Feb 2022
Effective Engineering Teaching In Practice | Elite | 4 Weeks | Jan-Feb 2022
Ethics in Engineering Practice | Elite | 8 Weeks | Aug-Oct 2021
Accreditation and Outcome Based Learning | Elite | 8 Weeks | Jul-Sep 2021
Intellectual Property | Elite | 12 Weeks | Jan-Apr 2021
Teaching and Learning in General Programs | Elite | 4 Weeks | Sep-Oct 2020
Designing learner-centric e-learning in STEM disciplines | Elite | 4 Weeks | Sep-Oct 2020
User-centric Computing for Human-Computer Interaction | Elite | 8 Weeks | Jan-Mar 2020
Human Computer Interactions | Elite | 8 Weeks | Aug-Oct 2019
Joy of computing using Python | Elite | 12 Weeks | Jan-Apr 2019
Software Engineering | Successful | 12 Weeks | Jul-Oct 2018
Introduction to Research | Elite | 8 Weeks | Feb-Mar 2018
Introduction to operating systems | Elite | 8 Weeks | Jul-Sep 2017
Ethics | Elite | - | Feb-Mar 2017

## Other Online Certifications
- IITBombayX: LaTeX101x: LaTeX for Students, Engineers, and Scientists (A+ Grade, Jul-Dec 2020)
- EdX: Data Science: R Basics (HarvardX)
- Coursera: Software Design as an Element of the Software Development Life cycle (University of Colorado System)
- Coursera: Software Processes and Agile Practices (University of Alberta)
- Coursera: Continuous Delivery & DevOps (University of Virginia)
- Coursera: Software Design as an Abstraction (University of Colorado System)
- Coursera: Introduction to Software Product Management (University of Alberta)
- Coursera: Introduction to Data Science in Python (University of Michigan)

## Achievements
- Recognized as NPTEL STAR in NPTEL Motivated Learner category (Jul-Dec 2025)
- Recognized as NPTEL STAR in NPTEL Discipline Star in Computer Science and Engineering category (Jan-Apr 2024)
- Recognized as NPTEL STAR in NPTEL Believer category (Jan-Apr 2024)
- Recognized as NPTEL Domain Scholar in "Faculty Domain-Advanced" (April 2022)
- Received Best Paper Award at IEEE ICDSIS for "Skin Lesion Segmentation Using SCU-Net" (Jul 2022)

## FDPs/Workshops/Seminars/Training Programs
Attended:
- AICTE Training & Learning (ATAL) Academy – EduSkills FDP on Juniper Mist – AI (Nov 2025)
- Capacity Building Programme on Cybersecurity – Basic Course, IIT Madras (Sep 2025)
- NEP 2020 Orientation & Sensitization Programme under Malaviya Mission (Aug-Sep 2025)
- AICTE 5-day Online FDP on "Inculcating Universal Human Values in Technical Education" (Aug 2024)
- Five Days National Level Faculty On "Exploring Computational Intelligence," VIT-AP University (Jul 2024)
- Online FDP on "Recent Trends in Artificial Intelligence and Machine Learning," BVC Engineering College (Jun 2024)
- Online FDP on "Software Test Automation with Selenium," TCS Telangana (Nov-Dec 2023)
- Adobe – AICTE Professional Development Workshop on "Digital Creativity Skills" (Jun 2023)
- Five Day Online FDP on "Power of Visualization in Analytics," BVRIT Hyderabad College (Aug 2023)
- 3 Days Professional Development Programme on "NBA Accreditation," NITTTR Chennai (Nov 2022)
- 3 Days Faculty Development Program on "How Teachers Can Make a Difference," IIT Madras TLC (Dec 2022)
- One Week National Level Online FDP on "Recent Trends in AI and Cyber Security," SVECW (Nov 2022)
- AICTE ATAL Academy Online Elementary FDP on "NBA Accreditation Process," JNTUA (Jun-Jul 2021)
- One Week Online FDP on "An Academic Perspective on Research," S R K R Engineering College (Aug 2020)
- One Week Online FDP on "Outcome Based Education," S R K R Engineering College (Aug 2020)
- AICTE sponsored STTP on "Writing and publishing high impact research publications," Rajalakshmi Engineering College (Sep 2020)
- Five Day Online National FDP on "Emerging Research Trends in Computer Science and Engineering," GMR Institute of Technology (Oct 2020)
- 5-Day National Level Online FDP on "Artificial Intelligence," BVRIT Hyderabad (May 2020)
- Six Day TEQIP Workshop on "Deep Learning for Visual Computing," IIT Hyderabad (Jun 2016)
- One Day National Level Workshop on "Startups and Entrepreneurship Orientation," UCEK JNTUK (Mar 2016)
- Two Week ISTE Workshop on "Pedagogy for Effective use of ICT in Engineering Education," IIT Bombay (Jun-Aug 2014)
- TEQIP-II Sponsored One Day National Level Workshop on "IPR and Patents," SVECW R&D Center (Oct 2014)
- Two Days Workshop on "IT Integrated Management Services," ESCI SVECW (Nov 2014)
- One Day Faculty Development Programme on "Software Project Management," UCEK JNTUK (Jan 2014)
- National Workshop on "Mobile Application Development," SVECW CSE & IT (Jan 2014)
- Faculty Development Programme on "Communication and Presentation Skills for Faculty," CFBT Education Services JNTUK (Jun 2012)
- Two Day Faculty Development Programme on "Knowledge Discovery Practices & Emerging Applications in Data Mining," BVC Institute (Mar 2013)

Organized:
- Co-ordinator for Five Day National Level online ATAL FDP on Recent Advancements in Artificial Intelligence and Robotics (Feb 2021)

## Roles and Responsibilities
- Department Criteria 4 Co-ordinator for NBA (2024-2026)
- Department Co-ordinator for Research Center Inspection (2024-25)
- Department Scholarship Attendance Jnanabhumi Co-ordinator
- Department Co-ordinator for JNTUK Academic Audit (2023-24)
- Department Co-ordinator for Internal Academic Audit (2021-22, 2022-23)
- Department Website Co-ordinator (2012-2023)
- Department Co-ordinator for Research Center Inspection (2021-22, 2022-23)
- Department Autonomous Co-ordinator (2020-21)
- Department NBA Co-ordinator under Tier-I (2018-19)
- Department Co-ordinator for JNTUK FFC

## Research Profiles
TABLE:
Profile | Link
Google Scholar | https://scholar.google.co.in/citations?user=xsD28rgAAAAJ
Vidwan | https://vidwan.inflibnet.ac.in/profile/328450
Web of Science Researcher ID | https://www.webofscience.com/wos/author/record/32535264
ORCID | https://orcid.org/0000-0002-2054-6567
Scopus | https://www.scopus.com/authid/detail.uri?authorId=57216160958


## Identifiers & Contact
- Email: gvssprasadrajucse@svecw.edu.in
- SVECW Emp ID: 538
- AICTE Unique ID: 1-1507894784
`;

const CSE_P_RAJU_TEXT = `
## Fields of Specialization
- CSE – Machine Learning
- Deep Learning
- Data Science
- Cyber Security
- Cryptography and Network Security
- Information Security
- Cloud Computing
- IoT

## Educational Qualifications
- Ph.D. (CSSE): Pursuing from Andhra University
- M.Tech (CSE): Ramappa Engineering College, Warangal, Telangana, 2010
- B.Tech (CSE): Dr Paul Raj Engineering College, Bhadrachalam, Telangana, 2005

## Professional Affiliations
- IEI – Life Member

## International Journal Publications
- "Decoding Hand Gestures for Individuals with Different Abilities Using the Convolutional Neural Network" in IJCRT, Vol. 10, Issue 11, Nov 2022
- "ORUTA Privacy Preserving Mechanism to Support Dynamic Operations on Multiple Blocks" in IJESTR, Vol. 4, Issue 49
- "Expending Fuzzy Logic Control System to Contribute Quality of Service Management" in IJESTR, Vol. 3, Issue 26
- "Selected Approach for Hiding the Packets from Jamming Attacks" in IARJCS, Vol. 5, No. 2, Mar 2014
- "Shackle Restriction System" in IJARCSSE, Vol. 3, Issue 8, 2013

## International Conference Publications
- "Telecom Customer Churn Prediction Using Machine Learning" at EAI IC4S 2024, VITB, Apr 2024
- "Segmentation and Classification of Lung Tumor Analysis using LU-Net with BBH Optimizer," 14th Confluence, Noida, 2024
- "Dynamic Load Balancing Framework for Context Sensitive Offloading Scheme in Mobile Cloud Computing," ICACCTech 2023
- "An Advanced Artificial Intelligence Driven Smart Home Towards Ontology Based Energy Efficiency Management System" at ICIDA 2023
- "A Process of Developing a Fog Computing System for Green Renewable Energy Source" in 10th IEEE CCEM Oct 2022
- "Serverless Architecture Solution to Automate Educational Organizations" in IJERT ICRADL 2021

## National Conference Publications
- "Diagnosis of Dental cavities using Optimization-driven Deep Convolutional Neural Network" at NCDT-2023, Andhra University, Jul 2023
- "Detection of Pneumonia Using Chest X-Rays" at FACET-23, KITS, Telangana, May 2023
- "Energy Efficient VM Consolidation Technique in Cloud Computing Using Cat Swarm Optimization" in MIDAS 2021
- "Comparison Of Two Data Pre-Processing Techniques for Efficient Data Cleaning" in Shod Samhita Journal, Vol. 6, 2022

## Achievements
- All India Rank 6571 in GATE 2007
- "Aegis Graham Bell Award" for Guided Project – "Partograph Tracer to Detect Foetal Condition Using ML" in National Talent Hunt 2023

## Patents
- "An IoT-Based System for Instinctive Stopping Alert to Drivers Using On Passenger Ticket" - Inventor(s): Pothuraju Raju et al., Applicant: Shri Vishnu Engineering College For Women, Application Number: 202141012346, Filing Date: 2021-03-23, Publication Date: 2021-03-26

## NPTEL Courses
- "Joy of Computing Using Python" (IIT Madras, Jan-Apr 2019, 12 weeks)
- "Internetwork Security" (IIT Kharagpur, Jan-Apr 2017, 12 weeks)

## Coursera Certifications
- Software Security (Oct 2020, Grade 89.32%)
- Cryptography (Oct 2020, Grade 93.00%)
- Usable Security (Jul 2020, Grade 96.40%)
- Machine Learning Foundations: A Case Study Approach (Apr 2020, Grade 97.14%)
- Machine Learning: Regression (Jul 2020, Grade 97.77%)
- Machine Learning: Classification (Jul 2020, Grade 97.14%)
- Machine Learning: Clustering & Retrieval (Apr 2020, Grade 96.12%)
- Programming for Everybody (Getting Started with Python) (Apr 2020, Grade 98.25%)
- Python Data Structures (Jul 2020, Grade 97.60%)
- AI For Everyone (May 2020, Grade 93.75%)

## NASSCOM Future Skills Certifications
- JAVA Course (Jan 2022, Co-Branded Certificate with Coding Ninjas)
- PYTHON Course (Dec 2021, Co-Branded Certificate with Coding Ninjas)

## FDPs / Workshops / Seminars / Training Programs
Attended:
- "ChatGPT & AI Hacks with MS Office" (May 2023, Skill Nation)
- "Business Intelligence Using Power BI" (Feb 2023, Skill Nation)
- "Design and Development of Industry-led Curriculum in Technological Era" (Dec 2022, AMET University Chennai)
- "Cryptography and Blockchain" (Nov 2022, Chandigarh University)
- "Data Science and its Applications" (Jun 2021, S.R.K.R. Engineering College)
- "Machine Learning and Artificial Intelligence in Data Science" (May-Jun 2021, PACE Institute)
- Microsoft Power BI (Jun 2020, APSSDC)
- "Technologies For Health Care" (Jun 2020, GMR Institute of Technology)
- "Python Web Application Framework Using Flask and Django" (Jun 2020, Pragati Engineering College)
- "Descriptive Statistics through R-Programming" (May 2020, KPR Institute)
- "R Programming" (May 2020, Sree Vidyanikethan Engineering College)
- "Hadoop and Machine Learning" (May 2020, Malla Reddy Institute of Technology)
- "Python for Data Science" (May 2020, Bennett University)
- Bootcamp Web Development (Apr-May 2020, SVES)
- "Mobile Application Development" (Jan 2019, SVECW)
- "Unconscious Bias in the Workplace" (Mar 2019, SVECW)
- "Think Technology Transform" (Nov 2018, SVECW)
- "IUCEE AP chapter-EPICS" (Apr 2018, APSSDC)
- "Research Readiness" (Dec 2017, VEDIC)
- "Software Testing & Quality Assurance" (Aug 2016, ESCI)
- "Cyber Security and Forensics" (Aug 2016, SVECW)
- "Scientific Educational Practices" (Oct 2016, VEDIC)
- "Web Technologies" (Oct 2016, SVECW)
- "Quality Initiative in Tech. and Higher Education Institutions" (Oct 2015, ESCI)
- "Recent trends in Big data Analytics" (Aug 2015, KLU)
- "Research Methodologies" (Jul 2015, KLU)
- "Advanced Computer Networking" (Jul 2014, MIC)
- "Embedded Systems" (Feb 2014, VIT)
- "Knowledge Discovery Practices & Emerging Applications" in Data Mining (Mar 2013, BVC)
- "Advanced Data Structures" (May 2013, BVRIT)
- "Data Communications and Computer Networks" (Jun 2013, BVRIT)
- "Safety Data Analytics" (Apr 2013, IIT Kharagpur)
- "Assistive Technology" (Jul 2012, SVECW & UMASS Lowell)
- Faculty Enablement Program (Jun 2012, Infosys)
- "National Convention for Academics & Software Workshop" (Dec 2010, SWECHA)
- "Mission10X Workshop" (Apr 2012, Wipro)
- Faculty Enablement Program (Jul 2013, Infosys)

Organized:
- Coordinator for Five Day National Level FDP on "Design Thinking" (Feb 2018, ECE Department)

## Roles and Responsibilities
- ISTE Coordinator for the Department of CSE
- NAAC Criteria 1 Coordinator for Cyber Security
- NBA Coordinator for PG Program 2015-16 for M Tech CSE
- PRC Member for Major Projects
- Mini Project Coordinator
- Class In-charge
- Department Coordinator for the UBA Program
- Placement Mentoring
- Students Counselling
- Mentor for "Braille Learning System" project in ATL


## Identifiers & Contact
- Email: rajupcse@svecw.edu.in
- SVECW Emp ID: 535
- AICTE Unique ID: 1-1507894792
`;

const CSE_ANUJ_RAPAKA_TEXT = `
## Fields of Specialization
- Machine Learning
- Image Processing

## Educational Qualifications
TABLE:
Degree | Institution | Specialization | Year
Ph.D. | Presidency University, Bangalore | Machine Learning & Image Processing | 2023
M.Tech | GITAM University, Vishakapatnam | IT | 2011
B.Tech | Sir CRR College of Engineering, Andhra University | CSE | 2009

## Professional Affiliations
- Life Member CSE, IEI

## Publications in National/International Journals
- "An intelligent convolution-based graph cut segmentation for potato leaf disease severity prediction" (2023)
- "Classification of Disease from the Potato Leaves Using Lstm" (2023)
- "An Optimized Hyper Parameter Tuned Convolution Neural Frame for Potato Leaves Disease Prediction" (2023)
- "An Efficient Workflow Scheduling Algorithm in cloud computing using Cuckoo search and PSO Algorithm" (2022)
- "Different Types of Data Analytics using Big Data" (2018)
- "User Data Recovery and Secure Data Distribution in the Cloud" (2017)
- "A Combitorial Approach for New Generic Malware Detection Technique" (2014)

## Journal Publications in Conferences
- "An Efficient Workflow Scheduling Algorithm in cloud computing using Cuckoo search and PSO Algorithm" (2022)
- "Prioritized Load Balancer for Minimization of VM and Data Transfer cost in cloud computing" (2022)
- "Feature Extraction Techniques in Hyperspectral Data sets for classification purpose" (2019)

## Books Published
- "Essentials to the Secret of Cyber Security" (2022, ISBN: 9789355743930)

## Patents
- "AWS-Cloud Data (EC2) Performance improvement using Machine and Deep Learning Programming" - Patent number 2021101322, granted March 14, 2021, Patent term: Eight years

## NPTEL Courses
- "Computer Vision and Image Processing-Fundamentals and Applications" (12 weeks, January-April 2022)

## Certifications
- "AI for Everyone," Coursera (May 2020)
- "Python Data Structures," Coursera (April 2020)

## FDPs/Workshops/Seminars/Training Programs
- 2-day webinar on "Learn to Build IOT Projects using NodeMCU" (July 2020)
- Online FDP on "IOT & Wireless Sensor Networks" (July 2020)
- Online webinar on Optical Communication by APSSDC (July 2020)
- "Student Solar Ambassador Workshop 2019" by IITBombayX (2019)
- 3-day FDP on "Recent trends in Wireless communication Technologies" (August 2020)
- Online webinar on "Building Dynamic web applications" (July 2020)
- One-week online training on "Matlab-Statistics and Data Science" (August 2020)
- Online webinar on "Cloud computing: Industry Applications" (June 2020)
- 5-day online FDP on Blockchain Technologies (June 2020)
- 2-day FDP on "Research Project Grant & Patent filing" (October 2020)
- 1-week International FDP on "Interdisciplinary Insights: Data Science, Machine Learning and Cyber Security" (February 2024)

## Roles and Responsibilities
- R&D Department Coordinator
- Time Table Coordinator
- NAAC Criteria Coordinator

## Courses Taught
- UG: Operating Systems, Compiler Design, Computer Organization and Architecture, Machine Learning, Mobile Applications & Development, Cloud Computing, Open-Source Software, Digital Logic Design, E-Commerce
- PG: Cloud Computing, Software Architecture and Design Patterns, Software Metrics & Reuse

## Research Profiles
- ORCID: 0000-0002-5240-0693
- Scopus: Author ID 57219443843


## Identifiers & Contact
- Email: anujcse@svecw.edu.in
- SVECW Emp ID: 542
- AICTE Unique ID: 1-2196455391
`;

const CSE_VEERA_RAMA_RAO_TEXT = `
## Fields of Specialization
- Computer Science & Engineering

## Educational Qualifications
TABLE:
Degree | Institution | Specialization | Year
Ph.D. | VELS Institute of Science, Technology & Advanced Studies, Pallavaram | CSE | 2024
M.Tech | JNTU Kakinada | Information Technology | 2012
B.Tech | JNTU Hyderabad | Computer Science & Engineering | 2008

## Publications in National/International Journals
- "Optimizing Breast Cancer Diagnosis with Advanced Deep Learning Techniques in Medical Imaging," Journal of Electrical Systems
- "Enhancing Network Security: Leveraging Machine Learning for Intrusion Detection," Journal of Electrical Systems
- "Analysis of Speaker Adaptation Techniques in automatic Speech Recognition systems using Deep Neural Networks and Gaussian Mixture Models," Journal of Theoretical and Applied Information Technology, 2023, Vol. 101, No. 12
- "Development of efficient techniques for ASR System for Speech Detection and Recognition system using Gaussian Mixture Model-Universal Background Model," International Journal on Recent and Innovation Trends in Computing and Communication, Volume 11, Issue 10, 2023

## Journal Publications in National/International Conferences
- "Potato Disease Detection Using Deep Learning," 2023 4th International Conference on Computation, Automation and Knowledge Management (ICCAKM)

## Achievements
- IUCEE International Engineering Educator Certificate

## Book Chapters Published
- "Impact of COVID-19 on IIoT" - Priyadarsini, K., Karthik, S., Malathi, K., Rao, M.V.V.R. in Industrial Internet of Things (IIoT): Intelligent Analytics for Predictive Maintenance, 2021, pp. 321-348

## NPTEL Courses
- Joy of computing using Python

## Certifications
- IUCEE International Engineering Educator Certificate (2019, APSSDC)
- AI For Everyone, Coursera
- Algorithmic Toolbox, Coursera
- Python Basics, Coursera
- Wireless Communications for Everybody, Coursera
- Peer-to-Peer Protocols and Local Area Networks, Coursera
- Introduction to Data Science in Python, Coursera
- Blockchain Basics, Coursera
- Fundamentals of Network Communication, Coursera

## FDPs / Workshops / Seminars / Training Programs
- Deep Learning using big data Analytics, SRKR Engineering College
- Hands-on Practice on LaTeX, SVNIT Surat
- Internet of Things, NIT Warangal
- Open Source Technology, NITTTR Chandigarh

## Workshops/Seminars and Training Programs Organized
- Futurise; an innovative talk on entrepreneurs
- Innovating the future

## Roles and Responsibilities
- Sahaya club coordinator
- IIC Coordinator
- R&D cell member
- Moodle Coordinator

## Courses Taught
- UG: Linux Programming, Web Technologies, Digital Logic Design, Professional Ethics & Human Values, Intellectual Property Rights & Patents, Microprocessor & Microcontrollers, Indian Constitution
- PG: Software Project Management, Full Stack Development

## Research Profiles
TABLE:
Platform | Link
Google Scholar | https://scholar.google.com/citations?user=u03JY70AAAAJ&hl=en
ResearchGate | https://www.researchgate.net/profile/Ramarao-Malisetty
ORCID | https://orcid.org/0000-0002-7501-2538
Scopus | https://www.scopus.com/authid/detail.uri?authorId=58484333600


## Identifiers & Contact
- Email: ramaraocse@svecw.edu.in
- SVECW Emp ID: 545
- AICTE Unique ID: 1-2197072483
`;

const CSE_RAMESH_BABU_MALLELA_TEXT = `
## Fields of Specialization
- IoT-DDoS attacks

## Educational Qualifications
TABLE:
Degree | Institution | Specialization | Year
Ph.D. | NIT, Silchar, Assam | IoT-DDoS attacks | Pursuing
M.Tech | Pydah College of Engineering & Technology | CSE | 2012
B.Tech | Narasaraopeta Engineering College | CSE | 2009

## Publications in National/International Journals
- "An Effective VM Consolidation Mechanism by Using the Hybridization of PSO and Cuckoo Search Algorithms" - Computational Intelligence in Data Mining, 477-487
- "Shackle Restriction System" - IJARCSSE Volume-3 Issue 8, Aug 2013
- "Grading Spatial Data By Value Preferences using N2S2 Algorithm" - IJCST Vol. 3, Issue 2, April-June 2012

## Achievements
- Qualified GATE in 2012
- Patent Granted on "A Counting Bloom Filter" (25/01/2023)

## NPTEL Courses Completed
- "Joy of Computing using Python" (Jan-Apr 2019)
- "Design and Analysis of Algorithm" (Jan-May 2017)
- "Introduction to Algorithms" (Nov-Dec 2023)
- "Introduction to IoT" (Nov-Dec 2023)

## Online Certifications
- "Fundamental of Network Communication" - University of Colorado (6/12/2020)
- "Information Security: Context and Introduction" - University of London (7/1/2020)
- "Classical Cryptosystems and Core Concepts" - University of Colorado (5/29/2020)
- "Introduction to Cybersecurity Tools and Cyber Attacks" - IBM (5/22/2020)
- "Programming for Everybody (Getting Started with Python)" - University of Michigan (5/24/2020)
- "AI for Everyone" - DeepLearning.AI (7/28/2020)

## FDPs / Workshops / Seminars / Training Programs
- One-week FDP on "Network Security and Computer Forensics" - VRSEC, Vijayawada (April-May 2013)
- Two-day FDP on "Trends in Soft Computing and Its Tools" - VIT, Bhimavaram (February 2014)
- One-week national-level FDP on "Software Testing" - Innovians Technologies, SVECW Bhimavaram (September 2016)
- One-day National Level FDP on "Block Chain - the Modern Internet" - JNTU, Kakinada (August 2018)
- Three-day online FDP on "Excerpts of Research Methodology and Process" - Tirumala Engineering College (July 2020)
- Faculty Development Program on "Block Chain Technology" - APSSDC (July 2020)
- One-week online hands-on FDP on "Artificial Intelligence using Python" - Department of CSE with Braino Vision Solutions India Pvt. Ltd. & National Youth Council of India (September 2020)
- Two-week National level Online FDP on "NBA ACCREDITATION: Regulations & Procedure" - Priyadarshini Institute of Science and Technology For Women, Khammam (July 2020)
- Five-day Online National Faculty Development Programme on "Emerging Research Trends in Computer Science and Engineering (ERTCSE-2020)" - GMR Institute of Technology, Rajam (October 2020)
- One-week online International Faculty Development Programme on "Emerging Trends & Technologies in Data Science" - GMR Institute of Technology, Rajam (August 2020)
- One-week online FDP on "Python 3.4.3" - Pragati Engineering College, Surampalem (June 2020)
- Five-day online FDP on "Recent Trends and Advances in Computational Intelligences 2020" - GMRIT, Rajam (October 2020)
- Five-day Online FDP on "Data Handling and Data Visualization using Python" - Swarnandra Institute of Engineering & Technology (June 2020)
- Five-day National Level Online Faculty Development Program on "Applications of Machine Learning" - SVECW (June 2021)
- One-week online Faculty Development Programme on "Deep Learning & Machine Learning Application in Computer Vision" - GMR Institute of Technology, Rajam (July 2021)

## Roles and Responsibilities
- Class Charge (from 2014 onwards)
- Department VEDIC Coordinator
- Department Lab Records and Books Coordinator
- Department 4th Criteria NAAC Coordinator

## Courses Taught
- UG: Computer Graphics, UML, Object-Oriented Programming Through JAVA, Principles of Programming Language, Distributed Systems, Parallel Programming, Digital Logic Design, Operating System, Data Structures, Computer Networks, Cryptography and Network Security, Design Patterns, Microprocessor and Multicore Systems, Microprocessor and Microcontroller, Design and Analysis of Algorithms, Web Technology Lab, DBMS Lab, C Programming Lab
- PG: Data Structures, Distributed Systems

## Research Profile Links
TABLE:
Profile | ID/Link
Google Scholar | 2mSFHYsAAAAJ
Vidwan | 148166
ORCID | 0000-0002-1212-1526
Scopus | 57698766000


## Identifiers & Contact
- Email: rameshbabucse@svecw.edu.in
- AICTE Unique ID: 1-2196141679
`;

const CSE_N_SILPA_TEXT = `
## Research Interests
- Data Mining
- Web Mining
- Big Data Analytics
- Data Science
- Artificial Intelligence
- Machine Learning

## Professional Memberships
- Life Member of CSI, ISTE and IE
- Member in CII – IWN

## DST Funded R&D Projects
- File No: SR/WOS-A/ET-82/2011, PI: N Silpa, Co-PI: Dr. V V R Maheswara Rao, Area: Text Mining, "Implementation of Improved KNN Classification and Clustering algorithms as Tool using Mining", Status: Completed (2012-2015)
- File No: DST/NSTMIS/05/159/2017-18, PI: Dr. V V R Maheswara Rao, Co-PI: N Silpa, Area: Big Data Analytics, "A Comprehensive approach to Analyze and stimulate Outcomes of Research and Development Activities in Universities", Status: Sanctioned

## Patents
- "AN IOT GARBAGE SEGREGATOR & BIN LEVEL INDICATOR DEVICE" - Design No. 399499-001, Filed 08/11/2023, Inventors: SVECW, Dr. V V R Maheswara Rao, Dr. G Durga Prasad, N Silpa, Dr. S M Padmaja, N Praveen Kumar
- "DETECTION AND CLASSIFICATION OF BRAIN TUMORS USING CNN-BASED MODEL" - Application Number 202441093178, Filed 28/11/2024, Field: Bio-Medical Engineering, Inventors: SVECW, Dr. M. Prasad, Dr. N. Silpa, Mr. G. Surendra Kumar

## SCI Publications
- N. Silpa and V. M. Rao, "Classify and predict web user behaviour using butterfly optimization and recurrent neural network," Multimedia Tools and Applications, vol. 1, pp. 1-23, 2024
- V. V. R. M. Rao, S. S. Reddy, S. Nrusimhadri, et al., "A Flawless QoS Aware Task Offloading in IoT Driven Edge Computing System using Chebyshev Based Sand Cat Swarm Optimization," Journal of Grid Computing, vol. 23, no. 7, 2025

## SCOPUS Journals
- N. Sethi, V. Rama Raju, V. Lokavarapu, R. Devareddi, S. Reddy, and S. Nrusimhadri, "A novel model to detect and categorize objects from images by using a hybrid machine learning model," IAES International Journal of Artificial Intelligence (IJ-AI), vol. 14, no. 1, pp. 667-679, 2025
- N. Silpa, S. K. Swain, and M. R. V. VVR, "Revolutionizing feature engineering for robust ensemble machine learning by hybridizing mRMR insight and Chi2 independence," Proceedings on Engineering, vol. 6, no. 3, pp. 1337-1348, 2024
- Karrar S. Mohsin, Jhansilakshmi Mettu, Chinnam Madhuri, Gude Usharani, Silpa N and Pachipala Yellamma, "Enhancing Urban Traffic Management Through Hybrid Convolutional and Graph Neural Network Integration," pp. 360-370, April 2024
- S. S. Reddy, V. V. M. Rao, K. Sravani, and S. Nrusimhadri, "Image quality evaluation: evaluation of the image quality of actual images by using machine learning models," Bulletin of Electrical Engineering and Informatics, vol. 13, no. 2, pp. 1172-1182, 2024
- S. S. Reddy, V. V. M. Rao, V. Priyadarshini, and S. Nrusimhadri, "You only look once model-based object identification in computer vision," IAES International Journal of Artificial Intelligence, vol. 13, no. 1, pp. 827-838, 2024
- V. M. Rao, N. Silpa, M. Gadiraju, R. S. Shankar, V. Kumar, and D. K. B. Rao, "An optimal machine learning model based on selective reinforced Markov decision to predict web browsing patterns," Journal of Theoretical and Applied Information Technology, vol. 101, no. 2, pp. 859-873, 2023
- N. Silpa and V. M. Rao, "Machine learning-based optimal segmentation system for web data using Genetic approach," Journal of Theoretical and Applied Information Technology, vol. 100, no. 11, pp. 3552-3561, 2022
- N. Silpa and V. M. Rao, "Enriched big data pre-processing model with machine learning approach to investigate web user usage behaviour," Indian Journal of Computer Science and Engineering, vol. 12, no. 5, pp. 1248-1256, 2021
- N. Silpa and V. M. Rao, "A Complete Research on Techniques & Technologies of Big Web Data Preparation to Web User Usage Behavior," International Journal of Recent Technology and Engineering (IJRTE), vol. 8, no. 2S11, 2019

## Springer Book Chapters
- R. S. Shankar, G. Mahesh, V. Maheswararao, N. Silpa, and K. V. S. Murthy, "Mitigating Misinformation: An Advanced Analytics Framework for Proactive Detection of Fake News to Minimize Misrepresentation Risks," in Algorithms in Advanced Artificial Intelligence: ICAAAI-2023, vol. 289, 2024
- V. V. R. Maheswara Rao, N. Silpa, S. S. Reddy, S. M. Hussain, S. Bonthu, and P. J. Uppalapati, "An Optimized Ensemble Machine Learning Framework for Multi-class Classification of Date Fruits by Integrating Feature Selection Techniques," in International Conference on Cognitive Computing and Cyber Physical Systems, pp. 12-27, Springer Nature Switzerland, December 2023
- G. Mahesh, S. Shankar Reddy, V. V. R. Maheswara Rao, and N. Silpa, "Preeminent Sign Language System by Employing Mining Techniques," in International Conference on IoT Based Control Networks and Intelligent Systems, pp. 571-588, Springer Nature Singapore, June 2023
- V. V. R. Maheswara Rao, N. Silpa, G. Mahesh, and S. S. Reddy, "An enhanced machine learning classification system to investigate the status of micronutrients in rural women," in Proceedings of International Conference on Recent Trends in Computing: ICRTC 2021, pp. 51-60, Springer Singapore, 2022

## IEEE Conferences
- R. S. Rani, N. Silpa, G. N. Satish, N. Amrutha and G. N. Reddy, "Optimizing Phishing Detection: Leveraging URL Features with Machine Learning," 2024 10th ICACCS, Coimbatore, India, 2024, pp. 2094-2099
- R. R. Kurada, V. Vunnam, R. Vasanthawada, L. Saranya Thondapu, N. Silpa and V. V. R. M. Rao, "Face and Hand Gesture Recognition for Sign Languages to Support Non-Verbal Expressions using Convolutional Neural Network," 2024 10th ICACCS, Coimbatore, India, 2024, pp. 1140-1146
- S. N, R. S. Rani, M. R. V V R, A. N, S. S. Reddy and R. R. Kurada, "Investigating the Efficacy of Ensemble Machine Learning Models in Multi-Class Categorization of Web Pages for Spotlighting User Interests," 2024 WCONF, RAIPUR, India, 2024, pp. 1-7
- N. Lakshmi Devi, D. Vasanth Kumar, N. Silpa, V. V. R. Maheswara Rao, S. M. Padmaja and S. S. Reddy, "Deep Learning-Based Classification of Skin Lesions for Enhanced Dermatological Diagnosis," 2024 NMITCON, Bengaluru, India, 2024, pp. 1-6
- S. N, P. Devireddy, L. D. N, M. R. V V R, S. S. Reddy and A. N, "Fine-Tuning Student Success Prediction Through Ensemble Models Intertwined with Feature Engineering to Leverage Academic Interventions," 2024 ICDSNS, Tiptur, India, 2024, pp. 1-7
- R. R. Kurada, S. Pattem, V. M. Rao, N. Silpa, Y. Ramu, and P. Srikanth, "Federated Learning on Blockchain Networks," 2024 5th INCET, May 2024, pp. 1-6
- R. R. Kurada, Y. Ramu, N. Silpa, V. M. Rao, S. Pattem, and L. Pallavi, "Ensemble Learning Applications and Visualizations Taxonomy of Blockchain Data," 2024 Second ICDSIS, May 2024, pp. 1-8
- G. Mahesh, R. S. Shankar, V. M. Rao, and N. Silpa, "An Object Detection Framework and Deep Learning Models Used to Detect the Potholes on the Streets," 2024 AMATHE, May 2024, pp. 1-7
- C. Ram, S. Yuvaraj, M. Anitha, D. G. Kumar, N. K. Maurya, and N. Shilpa, "SSP based Coplanar Waveguide Filter for Sensing Applications," 2024 ICDCOT, Mar. 2024, pp. 1-5
- M. R. V V R, S. N, M. Gadiraju, S. S. Reddy, S. Bonthu and R. R. Kurada, "A Plausible RNN-LSTM based Profession Recommendation System by Predicting Human Personality Types on Social Media Forums," 2023 7th ICCMC, Erode, India, 2023, pp. 850-855
- N. Silpa, V. V. R. Maheswara Rao, M. V. Subbarao, R. R. Kurada, S. S. Reddy and P. J. Uppalapati, "An Enriched Employee Retention Analysis System with a Combination Strategy of Feature Selection and Machine Learning Techniques," 2023 7th ICICCS, Madurai, India, 2023, pp. 142-149
- S. S. Ahmed, P. J. Uppalapati, S. Ayesha, S. M. Hussain, K. Narasimharao and N. Silpa, "Assessing Public Sentiment towards Digital India through Twitter Sentiment Analysis: A Comparative Study," 2023 7th ICICCS, Madurai, India, 2023, pp. 955-959
- R. R. Kurada, S. Pattem, R. Y, M. R. VVR, S. N and S. Bonthu, "Raitu Vrudhi – An Android based Mobile Application for Agro-Marketing," 2023 4th INCET, Belgaum, India, 2023, pp. 1-7
- M. V. Subbarao, U. L. S. Rani, J. T. S. Sindhu, G. P. Kumar, V. Ravuri and S. N, "A Comprehensive Study of Machine Learning Algorithms for Date Fruit Genotype Classification," 2023 ICAISC, Dharwad, India, 2023, pp. 1-7
- M. Rao V V R, M. K, S. N, V. S. S. P. R. Gottumukkala, N. R. M and N. Pamarthi, "An Innovative Machine Learning based Heart Disease Assessment System by Sequential Feature Selection Approach," 2023 3rd CONIT, Hubli, India, 2023, pp. 1-7
- S. N, M. R. V. V. R, M. V. Subbarao, M. Pradeep, C. R. Grandhi and A. Karunasri, "A Robust Team Building Recommendation System by Leveraging Personality Traits Through MBTI and Deep Learning Frameworks," 2023 ICICAT, Gorakhpur, India, 2023, pp. 1-6
- R. R. Kurada, K. Pavan Kanadam, Y. Ramu, N. Silpa, V. V. R. M. Rao and S. Pattem, "Story Telling with Basic and Advanced Data Visualizations of Blockchain Technologies," 2023 Second ICAISS, Trichy, India, 2023, pp. 1254-1259
- N. Silpa, V. Vaishalini, S. V. S. S. Lakshmi, M. R. V V R, R. R. Kurada and S. Bonthu, "Empowering Diabetic Prediction through MRMR-Driven Feature Selection and Robustness of Ensemble Machine Learning," 2023 ICIICS, Kalaburagi, India, 2023, pp. 1-7
- M. R. V. V. R, S. N, S. Shankar Reddy, R. Rao Kurada, S. Mahaboob Hussain and E. L Sameera, "A Robust XG-Boost Machine Learning Model for Water Quality Estimation System by Leveraging with Chi-Square Forward Sequential Feature Selection Technique," 2023 AIKIIE, Ballari, India, 2023, pp. 1-7
- M. R. V V R, S. N, S. S. Reddy, S. Bonthu, R. Rao Kurada and V. Vaishalini, "An Optimized Ensemble Machine Learning Framework for Water Quality Assessment System by Leveraging Forward Sequential Minimum Redundancy Maximum Relevance Feature Selection Method," 2023 ICSES, Chennai, India, 2023, pp. 1-8

## Research Profiles
TABLE:
Profile | Link
ORCID | 0000-0003-3411-0358
Scopus ID | 57211574487
Google Scholar | aDqm00MAAAAJ


## Identifiers & Contact
- Email: nrusimhadri.silpa@gmail.com
- Orcid Profile: 0000-0003-34ff-0358
- Scopus Profile: 57215574487
- Google Scholar Profile: aDqm00MAAAAJ
`;

const CSE_RATNA_KUMARI_TEXT = `
## Fields of Specialization
- Machine Learning
- Deep Learning

## Educational Qualifications
TABLE:
Degree | Institution | Specialization | Year
Ph.D. | VelTech University, Chennai | CSE | Pursuing
M.Tech | SRKR Engineering College | CST | 2014
B.Tech | Bhimavaram Institute of Engineering & Technology | IT | 2011

## Journal Publications in National/International Conferences
- "Machine Learning Technique with Spider Monkey Optimization for COVID-19 Sentiment Analysis" (IC3P, January 2022, PP 303-307)
- "A Prediction of breast cancer based on Mayfly Optimized CNN" (IC3P, January 2022, PP 176-180)
- "Clustering Based Hybrid Optimized Model for Effective Data Transmission" (Cognitive Computing and Cyber Physical Systems, Volume 537, January 2024, PP 338-351)
- "Segmentation and Classification of Lung Tumor Analysis using LU-Net with BBH Optimizer" (14th Confluence, January 2024, PP 834-839)
- "Advanced NID-VGG16 with Orca Predation Optimization based 1DCNN-BiLSTM for Network Intrusion Detection" (14th Confluence, January 2024, PP 840-845)

## NPTEL Courses
- Computer Organization & Architecture
- Joy of Computing

## Certifications
- Coursera: "Programming for everybody Python"
- Coursera: "AI for everybody"
- Coursera: "AWS Fundamentals"
- Coursera: "Cyber-attacks and threats"

## FDPs/Workshops/Seminars/Training Programs
- FDP on "Deep learning and AI" (APSSDC, Feb-Mar 2024)
- 21-day master classes on "Deep learning" (Pantech, Sep-Oct 2023)
- One Week National Level Online FDP on "Recent Trends in Artificial Intelligence and Cyber Security" (Nov 2022)
- ATL FDP on "Cyber Security" (Feb 2021)
- FDP on "Cyber Security" (Jul 2020, GEC Gudlavalleru)
- Workshop on "Python 3.4.3" (Jun 2020)
- Workshop on "Blockchain Technology" (Jul 2020, APSSDC)
- One Week Online FDP on "Data structures using python" (Aug 2020, Sri Vasavi Engineering College)
- Two Weeks FDP on "Data Science and Its Applications in STEM" (Sep 2020, APSCHE)
- FDP on "Developing Cyber Security models using Statistical and Deep learning" (Jan 2021, VIT Bhimavaram)

## Roles and Responsibilities
- NACC Criteria-2 Coordinator
- Department Counselling Coordinator
- Department Students Achievements Coordinator

## Courses Taught
- UG: CD, CN, OS, DBMS, DWDM, COA, JP, Data visualization, SNSW, HCI, IPRP, Automata Design
- PG: DBMS, DWDM, COA

## Research Profiles
TABLE:
Platform | Profile Link
Google Scholar | https://scholar.google.com/citations?user=Uvh_x3EAAAAJ&hl=en
Vidwan | https://svecw.irins.org/profile/148219
ResearchGate | https://www.researchgate.net/profile/Ratna-Kanumuri
ORCID | https://orcid.org/0000-0002-84724692
Scopus | https://www.scopus.com/authid/detail.uri?authorId=57782306800


## Identifiers & Contact
- Email: kratnacse@svecw.edu.in
- SVECW Emp ID: 564
`;

const CSE_RV_SWATHI_TEXT = `
## Fields of Specialization
- Machine Learning
- Deep Learning

## Educational Qualifications
TABLE:
Degree | Organization/Institution | Specialization | Year of Passing
Ph.D. | JNTUK | Deep Learning | -
M.Tech | JNTUK | CSE | 2010
B.Tech | JNTUK | CSE | 2005

## NPTEL Courses
- Python Programming
- Deep Learning

## Roles and Responsibilities
- Placement Coordinator


## Identifiers & Contact
- Email: venkataswathir@svecw.edu.in
- SVECW Emp ID: 563
- AICTE Unique ID: 1-2640224367
`;

const CSE_N_DURGA_TEXT = `
## Fields of Specialization
- Machine Learning

## Educational Qualifications
TABLE:
Degree | Organization/Institution | Specialization | Year of Passing
Ph.D. | JNTUK | Machine Learning | Pursuing
M.Tech | AU | CST | 2015
B.Tech | JNTUK | CSE | 2013

## Journal Publications in National/International Conferences
- A Novel Deep Learning Framework with Global Attention Mechanism for Enhanced Heart Disease Detection and Prediction (Durga N., Gayathri T., Ratna Kumari K., Lecture Notes in Networks and Systems 1343 LNNS, 2025)
- Enhanced Lung Cancer Detection via Modified U-Net and Deep Learning Classifiers (Durga N., Gayathri T., Ratna Kumari K., Sricharani P., Kavitha D.N.S.B., Lecture Notes in Networks and Systems 1343 LNNS, 2025)
- A Hybrid Deep Learning Framework for HER2-Stained Breast Cancer Image Classification with Swin Transformer and YOLOv4 (Durga N., Kumari K.R., Gayathri T., Sekharam M.Y., Uppalapati P.J., Lecture Notes in Networks and Systems 1343 LNNS, 2025)
- Prediction of Daily Cow's Milk Yield Using IGHOA-Based Convolutional Neural Network in Smart Farming System (Durga N., Gayathri T., Ratna Kumari K., 2nd International Conference on Signal Processing Communication Power and Embedded Systems Scopes, 2024)
- Clustering Based Hybrid Optimized Model for Effective Data Transmission (International Conference on Cognitive Computing and Cyber Physical Systems, Volume 537, January 2024, PP. 338-351)
- Segmentation and Classification of Lung Tumor Analysis using LU-Net with BBH Optimizer (14th Confluence, January 2024, PP. 834-839)
- Advanced NID-VGG16 with Orca Predation Optimization based 1DCNN-BiLSTM for Network Intrusion Detection (14th Confluence, January 2024, PP. 840-845)

## NPTEL Courses
- Data Analytics with Python
- Cloud Computing
- Introduction to Machine Learning

## Work Shops/Seminars and Training Programs Organized
- Attended Faculty Development Program (FDP) on Deep Learning and Artificial Intelligence organized by Andhra Pradesh State Skill Development Corporation (APSSDC) in Collaboration with ExcelR Edtech Pvt. Ltd. (Feb-Mar 2024)

## Roles and Responsibilities
- Department NAAC Criteria-1 Coordinator

## Courses Taught
- UG: Compiler design, C programming, Data structures, Julia programming, Advanced databases, DBMS, Data warehouse & Data mining

## Research Profiles
TABLE:
Profile | Link
ORCID | 0009-0008-2844-3096
Scopus | 58671106500


## Identifiers & Contact
- Email: ndurgacse@svecw.edu.in
- SVECW Emp ID: 572
- AICTE Unique ID: 1-11318970803
`;

const CSE_M_ASMA_TEXT = `
## Educational Qualifications
TABLE:
Degree | Organization/Institution | Specialization | Year of Passing
M.Tech | JNTUK | CSE | 2017
B.Tech | JNTUK | CSE | 2015

## Fields of Specialization
- Machine Learning

## NPTEL Courses
- Python Programming
- Deep Learning

## FDPs / Workshops / Seminars / Training Programs
- 5 Day's Online International Faculty Development Program on Data Analyst
- Recent Trends in Artificial Intelligence and Cyber Security
- Recent Advances in Data Science, Data Analytics and Cyber Security

## Roles and Responsibilities
- Student Mentor

## Courses Taught
- UG: Compiler Design, Data Structures


## Identifiers & Contact
- Email: asmamdcse@svecw.edu.in
- SVECW Emp ID: 582
- AICTE Unique ID: 1-4486306495
`;

const CSE_K_SATHISH_KUMAR_TEXT = `
## Educational Qualifications
TABLE:
Degree | Organization/Institution | Specialization | Year of Passing
Ph.D | Amrita University | Machine Learning | Pursuing
M.Tech | AU | CSE | 2012
B.Tech | JNTUK | CSE | 2009

## Fields of Specialization
- Machine Learning

## NPTEL Courses
- Python Programming
- Deep Learning


## Identifiers & Contact
- Email: asathishkumarcse@svecw.edu.in
- AICTE Unique ID: 1-7504301506
`;

const CSE_T_NEELIMA_TEXT = `
## Educational Qualifications
TABLE:
Degree | Organization/Institution | Specialization | Year of Passing
M.Tech | JNTUK | CSE | 2019
B.Tech | JNTUK | CSE | 2016

## Fields of Specialization
- Data mining
- Data structures

## NPTEL Courses
- Recent Advances in Data Science Data Analytics and Cyber Security

## FDPs / Workshops / Seminars / Training Programs
- Innovative Teaching Learning Practices for Preparation
- National Faculty Development Program on Deep Learning and Artificial Intelligence (Andhra Pradesh State Skill Development Corporation)

## Courses Taught
- UG: C programming, Data structures, Compiler Design

## Roles and Responsibilities
- Project Guide
- Student Mentor


## Identifiers & Contact
- Email: neelima.cse@svecw.edu.in
- SVECW Emp ID: 587
- AICTE Unique ID: 1-7505442672
`;

const CSE_K_JAYA_SRI_TEXT = `
## Educational Qualifications
TABLE:
Degree | Institution | Specialization | Year
M.Tech | JNTUK | CSE | 2019
B.Tech | JNTUK | CSE | 2015

## Fields of Specialization
- Image processing

## NPTEL Courses
- Introduction to machine learning

## FDPs / Workshops / Seminars / Training Programs
- Eight Days Faculty Development Programme on Cyber Security & Hacking
- Faculty Development Program (FDP) on Deep Learning and Artificial Intelligence (APSSDC in collaboration with ExcelR EdTech Pvt. Ltd.)
- 5 Days online FDP on Societal Applications of Machine Learning
- Recent Advances in Data Science Data Analytics and Cyber Security
- Innovative Teaching Learning Practices for Preparation

## Courses Taught
- OOPs through JAVA, Data Structures, Management Science

## Roles and Responsibilities
- Student Counselling / Mentor


## Identifiers & Contact
- Email: jayasri.cse@svecw.edu.in
- AICTE Unique ID: 1-7586448861
`;

const CSE_NAGARAJU_PAMARTHI_TEXT = `
## Areas of Interest
- Cloud Computing
- Information Security
- Cyber Security

## Educational Qualifications
TABLE:
Degree | Organization/Institution | Specialization | Year
Ph.D. | A.N.U | Information Security | -
M.Tech | Andhra University Campus, Visakhapatnam | CST with Bio-Informatics | 2009
B.Tech | Gudlavalleru Engineering College | CSE | 2007

## Professional Experience
TABLE:
Period | Designation | Institution
12-10-2021 to Till Date | Assistant Professor | Shri Vishnu Engineering College for Women
12-05-2009 to 10-10-2021 | Assistant Professor | GMR Institute of Technology, Rajam

## Courses Taught
- UG: Fundamentals of Computer Programming, Java Programming, Data Structures, Digital Logic Design, Software Engineering, Unified Modelling Language, Computer Networks, Operating Systems, Information Security, Artificial Intelligence, Cloud Computing
- PG: Computer Networks, Cryptography & Network Security, Multimedia Application Development, Artificial Intelligence, Cloud Computing

## Research Profile
- Journals: 09
- International Conferences: 02
- Books/Chapters: 01
- Patents Granted: 01

## Journal Publications
- "Impacts of Cloud Computing on E-Commerce Businesses and Industry", International Journal of Advanced Research in Computer Science and Software Engineering, Volume 3, Issue 9, September 2013
- "Intrusion Detection System Using Pattern Matching Algorithms", Journal of Environmental Science, Computer Science and Engineering & Technology (JECET), Vol.4.No.2, 149-157, March 2015
- "A Detailed Study of Security Aspects in Cloud Computing", International Journal of Emerging Technologies in Engineering Research (IJETER), Vol. No.4, Issue No.6, pp 172-176, June 2016
- "Enhanced Algorithm for Data Security in Smart Cities using TSFS", International Journal of Innovative Engineering and Emerging Technology (IJIEET), Vol. No.3, Issue No.4, pp 21-30, July 2016
- "A Privacy Preserving cloud Storage Framework by using Server Re-encryption Mechanism (SRM)", International Journal of Computer Sciences and Engineering, Vol.6, Issue.7, pp.306-313, 2018
- "Obfuscation Techniques in Cloud Computing: A Systematic Survey", International Journal of Scientific and Technology Research, Vol.10, Issue.8, pp.1097-1102, 2019 (Scopus)
- "Data Confidentiality and Security Enhancement for Cloud Storage utilizing OB-MECC Encryption", Journal of Cyber Security and Mobility, Vol.9, Issue 4, pp.577-600, 2021 (Scopus)
- "A Data Obfuscation method using Ant-Lion Optimization for Privacy Preservation in the cloud", International Journal of Distributed Systems and Technologies, Vol.13., Issue 5, 2022 (Scopus)
- "Exponential Ant-Lion Rider Optimization for Privacy Preservation in Cloud Computing", Web Intelligence, vol. 19, no. 4, pp. 275-293, 2021 (Web of Science, Scopus)

## Conference Publications
- "An Innovative Machine Learning based Heart disease assessment system by sequential feature selection approach", 3rd International Conference On Intelligent Technologies (CONIT), June 23-25, 2023 (Scopus)
- "A Research Study Of Heart Health Monitoring Using Deep Learning And Iot", 1ST DMIHER International Conference On Artificial Intelligence In Education And Industry 4.0 (IDICAIEI), 27-28 Nov, 2023 (Scopus)

## Research Profile Links
TABLE:
Profile | Link
Google Scholar | http://scholar.google.co.in/citations?user=exhH0a8AAAAJ
Vidwan | https://vidwan.inflibnet.ac.in/profile/328397
Research Gate | http://www.researcherid.com/rid/HGA-2042-2022
ORCID | http://www.orcid.org/0000-0001-8318-8325
Scopus | http://www.scopus.com/authid/detail.url?authorId=57211443164

## Professional Development Activities - FDPs Attended
- "Rational Application Developer for Web sphere Software V6.0" - IBM at GMRIT (Aug 2011)
- IBM Certified Associate Developer Rational Application Developer for WebSphere Software V6.0 (Mar 2011)
- 1 day workshop on "Microsoft Office Tools & Latex" - GMRIT (May 2010)
- Mission 10X workshop - GMRIT, RAJAM (Jul 2012)
- 5 day workshop on "IoT and Advanced Analytics" - JNTU Kakinada (Dec 2017)
- 5 day workshop on "Cloud Computing & Open Stack" - GMRIT (Mar 2018)
- Online course "Introduction to cyber security: stay safe online" (May 2018)
- 2 weeks summer FDP on "Important Engineering Subjects" - JNTU Kakinada (May-Jun 2019)
- Online course "Introducing ethics in Information and Computer Science" (Jul 2019)
- 1 week FDP on "Artificial Intelligence and its Applications" - Ramachandra College of Engineering, A.P. (May 2020)
- 1 week FDP on "Big Data Tools" - St. Martin's Engineering College, Telangana (May 2020)
- 1 week FDP on "PHP & MYSQL" - JNTUHCE, Jagitiyala, Telangana (May 2020)
- 1 week FDP on "Cloud Computing" - Mahendra Engineering College, Tamil Nadu (May 2020)
- 1 week FDP on "IoT with Artificial Intelligence" - CRR College of Engineering, A.P. (May 2020)
- 1 week FDP on "Cyber Security" - Bennett University, U.P. (May 2020)
- 1 week FDP on "Data Science & Machine Learning" - GMRIT, A.P. (May 2020)
- 1 week FDP on "Artificial Intelligence" - Lendi Institute of Engineering, A.P. (May 2020)
- 1 week FDP on "Improving Your Research Visibility – Research Impact and Metrics" - Velalar College of Engineering and Technology, Tamil Nadu (May 2020)
- Online course "Foundational Artificial Intelligence" (May 2020)
- 1 week FDP (ATAL) on "Cyber Security" - Hyderabad Institute of Technology and Management, Telangana (Sep 2020)
- 1 week FDP (ATAL) on "Artificial Intelligence and Robotics" - Tripura University, Tripura (Jan 2021)
- 1 week FDP (ATAL) on "IoT" - ITM (Jun 2021)
- 1 week FDP (ATAL) on "Robotics" - Defence Institute of Advanced Technology, Pune (Nov 2021)

## Conducted FDPs
- Conducted a Five Day Online Faculty Development Programme on Information Security & Privacy in Cyberspace, Department of CSE GMR Institute of Technology, Rajam (Jul 2020)

## Certifications
- Certification courses on Cyber Security, AI, Cloud Computing in Coursera, Udemy, OpenLearn

## Administrative Roles
- Coordinator for Department Time-Tables
- Guided U.G. and P.G students
- Department Placement Coordinator
- Mentoring 1st, 2nd, 3rd and 4th year students
- Member in Admissions Team
- Member of NAAC & NBA works
- Acted as Class-In charge


## Identifiers & Contact
- Email: pnagarajucse@svecw.edu.in
- SVECW Emp ID: 588
- AICTE Unique ID: 1-10646600111
`;

const CSE_G_RAMESH_BABU_TEXT = `
## Fields of Specialization
- Machine Learning & IOT

## Educational Qualifications
TABLE:
Degree | Institution | Specialization | Year
Ph.D. | Veltech University | Machine Learning & IOT | 2025
M.Tech | JNTUK | CSE | 2012
B.Tech | JNTUH | CSE | 2007

## Books Published
- "Understanding Machine Learning Concepts" (ISBN: 9789359110622, WALNUT Publications)
- "Essentials to the Secret of Cyber Security" (ISBN: 9789355743930, WALNUT Publications)

## Patents
- Machine Learning Based Approach To Detect Anomalies In IoT Devices (Indian Patent, 04/03/2022, Application: 202241008733)
- Paper Scanning Machine based on Internet of Things (Indian Design Patent, 14/04/2023, Application: 3637333-001)

## Roles and Responsibilities
- Class In-charge
- Student Mentoring

## Courses Taught
- UG: COA, DAA, IRS, PPL, DWDM, Cloud Computing, OS
- PG: Cloud Computing, SADp, COA, ML, CN

## Recent Publications (Conference Proceedings)
- Drug Recommendations Using Reviews and Sentiment Analysis by RNN (LNICST, 2024)
- A Context Sensitive with Effective Task Migration in Mobile Cloud Computing Services (ICCIT 2023)
- Fake News Detection using Cellular Automata Based Deep Learning (ICCIT 2023)
- Waste Management Detection Using Deep Learning (ICCIT 2023)
- Usage of AI Techniques for Cyberthreat Security System in Android Mobile Devices (LNNS, 2023)
- A Hybrid Intelligent Cryptography Algorithm for Distributed Big Data Storage in Cloud Computing Security (LNAI, 2023)
- A Declarative Systematic Approach to Machine Learning (SSTEPS 2022)
- Usage of Classifier Ensemble for Security Enrichment in IDS (ICACRS 2022)

## Journal Publications
- EDLNet: ensemble deep learning network model for automatic brain tumor classification and segmentation (Journal of Biomolecular Structure and Dynamics, SCIE, 2024)
- Medical Image Segmentation using Grey Wolf Based U-Net with Bi-Directional Convolutional LSTM (International Journal of Pattern Recognition and Artificial Intelligence, SCIE, 2024)
- High Accuracy Classification Of Parkinson's Disease Detection Using RNN-Graph-LSTM (Proceedings On Engineering Sciences, 2024)

## Research Profiles
- ORCID: https://orcid.org/0000-0002-4655-5496
- Scopus: Author ID 58107337300


## Identifiers & Contact
- Email: grameshcse@svecw.edu.in
- SVECW Emp ID: 589
- AICTE Unique ID: 1-7587254855
`;

const CSE_PHANEENDRA_VARMA_TEXT = `
## Fields of Specialization
- Machine Learning
- Deep Learning

## Educational Qualifications
TABLE:
Degree | Institution | Specialization | Year
Ph.D. (Pursuing) | Veltech University, Chennai | Machine Learning & Deep Learning | -
M.Tech | JNTUK | CSE | 2016
B.Tech | Andhra University | CSE | 2012

## Publications in National/International Conferences
- Drug Recommendations Using Reviews and Sentiment Analysis by RNN (2024)
- Context Sensitive Task Migration in Mobile Cloud Computing Services (2023)
- Fake News Detection using Cellular Automata Based Deep Learning (2023)
- Waste Management Detection Using Deep Learning (2023)
- AI Techniques for Cyberthreat Security in Android Mobile Devices (2023)
- Hybrid Intelligent Cryptography for Distributed Big Data Storage (2023)
- Declarative Systematic Approach to Machine Learning (2022)
- Classifier Ensemble for Security Enrichment in IDS (2022)

## Journal Publications (SCIE/International)
- EDLNet: Ensemble Deep Learning Network for Brain Tumor Classification (2024)
- Medical Image Segmentation using Grey Wolf Based U-Net (2024)
- Parkinson's Disease Detection Using RNN-Graph-LSTM (2024)

## Book Chapters
- "Exploring Digital Twin Technologies in Healthcare Systems" (2024)

## Published Books
- Understanding Machine Learning Concepts (ISBN: 9789359110622)
- Essentials to the Secret of Cyber Security (ISBN: 9789355743930)

## Patents
- Machine Learning Based Anomaly Detection in IoT Devices (Indian Patent, 2022)
- Paper Scanning Machine based on IoT (Indian Design Patent, 2023)
- Artificial Intelligence Based Nerve Activation Device (German Utility Model, 2023)
- Smart Leaf Detection Device (UK Design Patent, 2023)

## Certifications
- Java Top Performer Certification - EPAM (2022)

## FDPs/Workshops/Training
- International Faculty Development on NLP and ChatGPT (August 2023)
- Master Class on REACT JS (April-May 2023)
- International Faculty Development on Data Analysis (June 2023)

## Roles and Responsibilities
- College Level Techxtreme Coding Club Coordinator
- EPAM (COE) SPOC - Certified Faculty
- Department NAAC Criteria 6 Coordinator
- Department APSCHE LMS Coordinator
- Department Smart Interviews C&DS Coordinator

## Courses Taught
- UG: Full Stack Development, Java Programming, Software Engineering, Operating Systems, DBMS, Game Development
- PG: Full Stack Development, Machine Learning

## Research Profiles
TABLE:
Profile | ID
Google Scholar | XDEuBd4AAAAJ
Vidwan | 328453
Research Gate | HLP-3949-2023
ORCID | 0000-0001-7243-8974
Scopus | 58308275900


## Identifiers & Contact
- Email: chpvarmacse@svecw.edu.in
- SVECW Emp ID: 50007
- AICTE Unique ID: 1-3314367171
`;

const CSE_VENKATA_SRI_ASHA_TEXT = `
## Fields of Specialization
- Machine Learning

## Educational Qualifications
TABLE:
Degree | Organization/Institution | Specialization | Year of Passing
Ph.D. | Pondicherry University | Artificial Intelligence | Pursuing
M.Tech | SRKR | CSE | 2020
B.Tech | GVIT | CSE | 2018

## Journal Publications in National/International Conferences
- "To Explore Dynamic Misuse-ability Score using Machine Learning Model" - International Journal of Innovative Technology and Exploring Engineering, Volume 8, 2019, Pages 4013-4017
- "Single Image Dehazing Through Feed Forward Artificial Neural Network" - Social-Informatics and Telecommunications Engineering, LNICST, Volume 472 LNICST, 2023, Pages 115-124

## Certifications
- Wipro Certified faculty program on Java Full Stack conducted by TalentNext

## FDPs / Workshops / Seminars / Training Programs
- Societal Applications of Machine Learning
- Recent Advances in Data Science Data Analytics and Cyber Security
- Innovative Teaching Learning Practices for Preparation
- National Faculty Development Program on Deep Learning and Artificial Intelligence (APSSDC)
- Faculty Development Program (FDP) on Future Trends & Advances in Emerging Technologies (School of Computer Applications)

## Roles and Responsibilities
- Class Incharge
- Student counsellor

## Courses Taught
- UG: Fundamentals of Data Structures, Amazon Web Services, Management Science, Full Stack Development, Compiler Design
- PG: Advanced Data Structures

## Research Profiles
TABLE:
Profile | Link
Google Scholar | http://scholar.google.co.in/citations?user=tX7f_ysAAAAJ
Vidwan | 328430
Research Gate | http://www.researcherid.com/rid/IYL-4903-2023
ORCID | http://www.orcid.org/0000-0002-7246-6526
Scopus | http://www.scopus.com/authid/detail.url?authorId=57211387523


## Identifiers & Contact
- Email: avsashacse@svecw.edu.in
- SVECW Emp ID: 590
- AICTE Unique ID: 1-1832166859
`;

const CSE_SONI_SHARMILA_TEXT = `
## Fields of Specialization
- Deep Learning
- Machine Learning

## Educational Qualifications
TABLE:
Degree | Institution | Specialization | Year
Ph.D. (pursuing) | SRM University, Chennai | Deep Learning for Healthcare Informatics | Pursuing
M.Tech | SRKR Engineering College, Bhimavaram | CST | 2012
B.Tech | SVECW, Bhimavaram | CSE | 2010

## Book Chapters
- Sharma, P. K., Ramesh, B., Arslan, F., Parashar, A., Malarvizhi, N., & Sharmila, K. S. (2024). "Securing Privacy in the Metaverse" in Federated Learning and Privacy-Preserving in Healthcare AI, IGI Global Scientific Publishing, pp. 58-76.
- Soni Sharmila, K., et al. "Enhanced Bone Image Segmentation Using Adamax Optimizer." EAI International Conference on Advanced Technologies in Electronics, Communications and Signal Processing, Springer Nature Switzerland, 2024.
- Basamsetti, Anusha, et al. "Advancing Image Synthesis: Deep Laplacian Pyramid Networks." EAI International Conference on Advanced Technologies in Electronics, Communications and Signal Processing, Springer Nature Switzerland, 2024.

## Published Books
- Computer Graphics, Publisher: Notion Press

## Patents
- A system and Method For Enhancing Crowd Image Analysis Through Facial Landmark Recognition - 202541120717
- AI-Driven Real Time Object Recognition and Voice Guided Navigation system for Visually Impaired Individuals - 202541100585
- Computer Vision Based Face Mask Scanning and Detecting Device - 434803-001
- Artificial Intelligence based System and Method for Portable Solar Food Dryer - 20254115132
- A System and Method for Deep learning Techniques in Digital Image Processing to Improve Medical Image Analysis - 20254115363
- Paper scanning machine based on internet of things - Patent No. 367333-001

## NPTEL Courses
- Research Methodology
- Python for data science
- Introduction to Operating Systems
- Deep learning
- Introduction to Machine Learning
- Medical image Analysis
- The joy of computing using python
- Roadmap for patents creation

## Certifications
- Citizen Data Science using Python Certification by Infosys Springboard
- Faculty Enablement Program on Generative AI series by Infosys Springboard
- NPTEL online certification on "The joy of computing using python"

## Faculty Development Programs (FDPs)
- Societal Applications of Machine Learning
- Recent Trends in Artificial Intelligence and Cyber Security
- The joy of computing using python
- Deep learning
- Introduction to Machine Learning
- Medical image Analysis
- Roadmap for patents creation

## Roles and Responsibilities
- Project coordinator
- Counsellor and mentor
- Project Guide

## Courses Taught
- UG: Python programming, Computer Networks, Database Management System, Computer Graphics, Computer organization, Full Stack Development, Software project Management, Web technology, Design and analysis of algorithms, Operating systems
- PG: Operating systems, Full Stack Development, Software Requirements and estimation

## Recent Publications (Conference Papers)
- K. S. Sharmila, K. N. S. K. Santhosh, A. R. Shaik, P. Gudipudi, G. P. Kumar and K. R. Chandra (2024). "Performance Evaluation of Medical Image Denoising based on Deep Neural Network." 2024 International Conference on Integrated Circuits and Communication Systems (ICICACS), Raichur, India, pp. 1-4.
- K. S. Sharmila and K. R. Chandra (2024). "Predicting Adverse Interactions: A Comprehensive Review of AI-Driven Drug-Drug Interaction Models for Enhanced Patient Safety." 2024 International Conference on IoT Based Control Networks and Intelligent Systems (ICICNIS), Bengaluru, India, pp. 1098-1102.
- Soni Sharmila, K., S. Thanga Revathi, and Pokkuluri Kiran Sree (2024). "A Systematic Review on Drug-to-Drug Interaction Prediction and Cryptographic Mechanism for Secure Drug Discovery Using AI Techniques." International Journal on Artificial Intelligence Tools 33.08: 2450003.
- K. S. Sharmila, R. Thriveni and T. M. Priya (2024). "Enhancing Crowd Image Analysis Through Facial Landmark Recognition." 2024 International Conference on Recent Innovation in Smart and Sustainable Technology (ICRISST), Bengaluru, India, pp. 1-5.
- K. S. Sharmila, T. R. S and P. K. Sree (2023). "Enhancing Drug-Drug Interaction Prediction: An Unified Similarity-Based Neural Network Approach." 2023 Global Conference on Information Technologies and Communications (GCITC), Bangalore, India, pp. 1-5.
- K. R. Chandra, B. Supraja, M. Bhargavi, S. B. Ojha, N. P. Tirumani and K. S. Sharmila (2025). "AI-Driven Intelligent Image Processing: a Novel Framework for Real-Time Image Enhancement and Analysis." 2025 3rd International Conference on Inventive Computing and Informatics (ICICI), Bangalore, India, pp. 1-6.
- S. Nagarajan, G. Nagaraju, K. R. Chandra, K. S. Sharmila, K. N. S. K. Santhosh and K. Vanaja (2024). "Improving Multispectral Image Classification with Convolutional Networks and Hyperspectral Band." 2024 4th International Conference on Ubiquitous Computing and Intelligent Information Systems (ICUIS), Gobichettipalayam, India, pp. 225-230.
- G. S. Babu, G. Asha, K. Sridevi, K. S. Sharmila, P. P and K. R. Chandra (2024). "Advancing Imperceptible Data Hiding: A Novel GAN-Based Framework." 2024 First International Conference on Innovations in Communications, Electrical and Computer Engineering (ICICEC), Davangere, India, pp. 1-6.
- T. Balaji, K. S. Sharmila, B. T. Sree, K. Satyanarayana, K. Balasubramanyam and K. R. Chandra (2024). "Image Generation using Deep learning based Vector Autoencoders." 2024 3rd International Conference for Advancement in Technology (ICONAT), GOA, India, pp. 1-4.
- K. S. Sharmila, P. Bhavya, P. Manaswi, S. N. S. Sri, V. M. S. S. Vasavi and V. Rakshitha (2024). "Integrative Approach for Epileptic Seizure Detection: A Comparative Analysis." 2024 International Conference on Emerging Technologies in Computer Science for Interdisciplinary Applications (ICETCS), Bengaluru, India, pp. 1-6.
- K. S. Sharmila, N. Murty Y, S. Nagarajan, K. Sridevi, K. N. S. K. Santhosh and K. Ramesh Chandra (2025). "A Cloud-Enabled Smart Marketplace for Fresh Produce using MERN Stack." 2025 5th International Conference on Soft Computing for Security Applications (ICSCSA), Salem, India, pp. 1024-1029.
- K. Kiran, S. Manne, B. Satyanarayana, K. R. Chandra, K. S. Sharmila and S. Swathi (2025). "Deep Learning-Based Intelligent Image Processing for Automated Feature Extraction and Pattern Recognition." 2025 International Conference on Information, Implementation, and Innovation in Technology (I2ITCON), Pune, India, pp. 1-5.
- K. S. Sharmila, A. R. Shaik, K. R. Chandra, K. Balasubramanyam, K. Satyanarayana and R. Devi (2025). "Substantial Image Deraining with Realistic Generalization Through Gaussian Process-Driven Semi-Supervised Analysis." 2025 8th International Conference on Trends in Electronics and Informatics (ICOEI), Tirunelveli, India, pp. 1466-1470.
- K. S. Sharmila, D. L. N. Likitha, D. Masrath, D. H. Hruthika, A. N. Raji and B. Sruthi (2025). "Real Time Object Recognition with Voice Guided Navigation for Visually Impaired using OpenCV." 2025 5th International Conference on Expert Clouds and Applications (ICOECA), Bengaluru, India, pp. 551-555.
- Soni Sharmila K, Revathi S T, Sree PK (2025). "DDINet: Drug-drug interaction prediction network based on multi-molecular fingerprint features and multi-head attention centered weighted autoencoder." Journal of Bioinformatics and Computational Biology 23(1):2550003.
- Babu, Gurujukota Ramesh, et al. (2024). "Design And Implementation Of An Dynamic IoT Cloud Based Processing Platform." Proceedings on Engineering 6.4: 1813-1820.
- P. R. Budumuru, A. R. Shaik, B. V. V. Satyanarayana, S. P. Manikanta, K. S. Sharmila and D. Durga Prasad (2022). "Normalized Algorithm with Image Processing Methods for Estimation of Crack Length." 2022 6th International Conference on Electronics, Communication and Aerospace Technology, Coimbatore, India, pp. 1436-1439.
- K. S. Sharmila, S. Thanga Revathi and P. K. Sree (2023). "Convolution Neural Networks based lungs disease detection and Severity classification." 2023 International Conference on Computer Communication and Informatics (ICCCI), Coimbatore, India, pp. 1-9.
- Sharmila, K. Soni, and Pokkuluri Kiran Sree (2023). "Drug-Drug Interaction: An Improved Prediction Approach Based on Convolutional Neural Networks." 2023 International Conference on Sustainable Communication Networks and Application (ICSCNA). IEEE.

## Journal Publications
- Raman, R., Mewada, B., Meenakshi, R., Jayaseelan, G. M., Sharmila, K. S., Taqui, S. N., et al. (2024). "Forecasting the PV Power Utilizing a Combined Convolutional Neural Network and Long Short-Term Memory Model." Electric Power Components and Systems 52(2): 233-249.
- Sharmila, K.S., Asha, A.V.S., Archana, P., Chandra, K.R. (2023). "Single Image Dehazing Through Feed Forward Artificial Neural Network." Cognitive Computing and Cyber Physical Systems, IC4S 2022, Springer, Cham.
- Soni Sharmila, K., Manikanta, S.P., Santosh Kumar Patra, P., Satyanarayana, K., Ramesh Chandra, K. (2024). "An Efficient Denoising of Medical Images Through Convolutional Neural Network." Cognitive Computing and Cyber Physical Systems, IC4S 2023, Springer, Cham.

## Research Profiles
TABLE:
Profile | Link
Google Scholar | http://scholar.google.co.in/citations?user=kh3zl-sAAAAJ
Vidwan | 373469
Research Gate | http://www.researcherid.com/rid/HLP-4102-2023
ORCID | http://www.orcid.org/0000-0002-7386-0963
Scopus | http://www.scopus.com/authid/detail.url?authorId=58092723600


## Identifiers & Contact
- Email: kssharmilacse@svecw.edu.in
- SVECW Emp ID: 592
`;

const CSE_GRLM_TAYARU_TEXT = `
## Areas of Interest
- Machine Learning
- Big Data

## Educational Qualifications
TABLE:
Degree | Organization/Institution | Specialization | Year
Ph.D. | Amrita University | Machine Learning | Pursuing
M.Tech | Acharya Nagarjuna University | CSE | 2010
B.Tech | Regency Institute Of Technology, Pondicherry University | CSE | 2008

## Courses Taught
- UG: Computer programming language, Data structures using 'C', Operating system, Data base management system, Software Engineering, Computer Organization, Java programming, Hadoop Techniques, Big Data analytics (+ associated labs)
- PG: Data base management system, Big Data analytics, Computer Organization and Architecture, Data base management system lab

## Publications - National/International Journals
- "Cyber Security and Its Challenges" - International Research Journal of Innovations in Engineering and Technology, ISSN 2581-3048, Volume 6, Issue 1, pp 129-131, January 2022
- "Personal Voice Assistant Using Python" - International Journal of Advanced Research in Science, Communication and Technology, ISSN 2581-9429, Volume 2, Issue 1, January 2022
- "A Frequent Subgraph Identification Approach Through Binary Estimation And A Conditional Exponential Method" - DogoRangsang Research Journal UGC Care Group I Journal, ISSN 2347-7180, Vol-10 Issue-07 No. 14, July 2020, pp 205-210

## Conference Publications
- "Transformer Based Lightweight Model For Punctuation Restoration And Truecasing" - 2024 IEEE International Conference for Women in Innovation, Technology & Entrepreneurship (ICWITE 2024)
- "An Efficient Lung Cancer Detection Model using Convnets and Residual Neural Networks" - 2024 Fourth IEEE ICAECT 2024, January 2024
- "An Advanced Artificial Intelligence Driven Smart Home Towards Ontology Based Energy Efficiency Management System" - 2nd International Conference on Innovations in Data Analytics (ICIDA 2023), November 2023
- "The Most Trending Articles Every Year Using Natural Language Processing (NLP) Technique" - Advances and Applications in Mathematical Sciences, Vol. 20, Issue 11, pp 2825-2829, September 2021
- "Artificial Intelligence And IoT Based Smart Agriculture Management System For Efficient Irrigation And Crop Monitoring Using Machine Learning Algorithms"

## Research Profiles
TABLE:
Profile | Link/ID
Google Scholar | http://scholar.google.co.in/citations?user=RV6rPLIAAAAJ
Vidwan | 328466
ORCID | http://www.orcid.org/0000-0002-5843-7366

## Faculty Development Programs Attended
- One Week National Level Online FDP on "Cloud Infrastructure (AWS)" - BVRIT Hyderabad with AICTE and Brainovision, August 2023
- One Week National Level Online FDP on "Machine Learning & Deep Learning Using Python"
- One Week National Level Online FDP on "Recent Trends in Artificial Intelligence and Cyber Security" - Department of CSE, SVECW, November 2022
- Faculty Development Program on "Cryptography and Block-chain" - Chandigarh University, Gharuan, November 2022
- APSSDC sponsored "30 Days Master Class on Artificial Intelligence" - Dec 2021-Jan 2022
- AICTE Training And Learning (ATAL) Academy Online Elementary FDP on "Futuristic Trends In Modern Machine Learning & Data Analytics" - December 2021
- FDP on "Artificial Intelligence And Deep Learning" - E&ICT Academy, NIT Warangal at Pragati Engineering College, November 2019
- 2 Week Summer FDP on "PYTHON Programming" - Directorate Of The Faculty Development Center, JNTUK, Kakinada, May-June 2019
- Workshop on "Big Data Analytics using Hadoop" - Department of CSE, Pragati Engineering College, November 2018
- 1 week FDP on "Machine learning and its applications" - E&ICT Academy, NIT Warangal at Pragati Engineering College, August-September 2018

## NPTEL Certifications
- NPTEL "Elite" Certificate on "Introduction to Internet of Things (12 weeks Course)" - IIT Madras, January-April 2019
- NPTEL "Elite" Certificate on "Joy of Computing using Python (12 weeks)" - IIT Madras, January-April 2019

## Roles and Responsibilities
- Department NAAC Criterion 2 Coordinator
- Department level internships Coordinator
- Department IUCEE Student Coordinator
- Department IUCEE Faculty Coordinator
- Salesforce Coordinator
- Department Faculty Paper Publication Coordinator
- Department Student Paper Publication Coordinator
- Department Transport Coordinator
- Student Technical Club (PragSoft) Coordinator
- Department Library Coordinator
- NSS Programme Officer
- Class teacher and student counselor
- Year Coordinator for II CSE


## Identifiers & Contact
- Email: grlmayarucse@svecw.edu.in
- SVECW Emp ID: 593
- AICTE Unique ID: 1-4624033954
`;

const CSE_VENKATA_RAMANA_TEXT = `
## Fields of Specialization
- Machine Learning

## Educational Qualifications
TABLE:
Degree | Institution | Specialization | Year
Ph.D. | Veltech, Chennai | Machine Learning | Pursuing
M.Tech | Bonam Venkata Chalamaiah Engineering College, Odalarevu | CSE | 2016
B.Tech | Swarnandhra College of Engineering and Technology | CSE | 2012

## Publications in National/International
- MongoDB integration with Python and Node.js, Express.js
- A Comprehensive Analysis on Risk Prediction of Heart Disease using Machine Learning Models
- Block Chain Enable on Path Caching for Efficient and Reliable Content Delivery in Information-Centric Networks
- A Context Sensitive with Effective Task Migration in Mobile Cloud Computing Services
- Enhancing the MANET AODV Forecast of a Broken Link with LBP
- High Accuracy Classification of Parkinson's Disease Detection using RNN-Graph-LSTM
- Design and Implementation of an Dynamic IOT Cloud Based Processing Platform
- Advances in Electrical, Computing, Communications and Sustainable Technologies (ICAECT 2024)
- Tomato Disease Prediction Using Deep Learning
- Fog-Based Analytics Scheme using Edge Affinity Based Management

## Achievements
- Scored top 5% in NPTEL course on Big Data Computing

## NPTEL Courses
- Big Data Computing
- Edge Computing

## Certifications
- NPTEL FDP course on "Edge Computing" (Jan-Mar 2024, 8 Weeks)
- NPTEL FDP course on "Big Data Computing" (Aug-Oct 2023, 8 Weeks)

## FDPs / Workshops / Seminars / Training Programs
- One Week FDP on "Cloud Infrastructures" at Pragati Engineering College (Aug 2023)
- One Week FDP on "Recent Advances in Electronics and Communication Engineering – An approach through AI&ML" (Aug 2023)
- One Week FDP on "Data Science and ChatGPT" at K L Deemed to be University (May 2023)
- One Week FDP on "Ethical Hacking" at Black Buck Engineers K L Deemed to be University (Feb-Mar 2023)

## Workshops/Seminars and Training Programs Organized
- Seminar on "DBMS" at Seetha Polytechnic

## Roles and Responsibilities
- III B.Tech II sem - Class Teacher for CSE-A section
- III B.Tech I Sem - Class Teacher for CSE-C section
- Mentor for II CSE (Cyber Security)

## Courses Taught
- UG: C Programming, Data Structures, Information Retrieval System, Database Management System, Theory of Computation, Design and Analysis of Algorithms
- PG: Mathematical Foundations of Computer Science, Machine Learning

## Research Profile Links
TABLE:
Platform | ID
Google Scholar | y0zUQCoAAAAJ
Vidwan | 328508
ORCID | 0009-0000-8558-5260
Scopus | 58654251300


## Identifiers & Contact
- Email: chvramanacse@svecw.edu.in
- SVECW Emp ID: 598
- AICTE Unique ID: 1-4616145744
`;

const CSE_TARAKA_SATYANARAYANA_MURTHY_TEXT = `
## Fields of Specialization
- Artificial Intelligence
- Explainable AI

## Educational Qualifications
TABLE:
Degree | Organization/Institution | Specialization | Year of Passing
Ph.D. (Pursuing) | NIT Puducherry | Artificial Intelligence, Explainable AI | Pursuing
M.Tech | JNTU K | Computer Science and Engineering | 2014
B.Tech | JNTU K | Information Technology | 2012

## Publications in National/International Conferences
- "A Hybrid Intelligent Cryptography Algorithm for Distributed Big Data Storage in Cloud Computing" (Springer, 2023)
- "COVID-19 prediction with Chest X-Ray images using CNN" (IEEE, 2023)
- "Enhancing the MANET AODV Forecast of a Broken Link with LBP" (Springer, 2023)
- "Creating a Protected Virtual Learning Space: A Comprehensive Strategy for Security" (Springer, 2024)
- "Smart System for Early Detection of Agricultural Plant Diseases" (IEEE, 2023)
- "A Research Study of Heart Health Monitoring Using Deep Learning and IoT" (IEEE, 2023)

## Books Published
- "Fundamentals of IoT & Big Data" - ISBN: 978-93-5757-469-3, Scientific International Publishing House, Mannargudi, Tamil Nadu

## Achievements
- NPTEL Certificate in "Big Data Computing" with 96% (ELITE+GOLD), 8-week course (Aug-Oct 2023)
- NPTEL Certificate in "Programming in Java" with 75% (ELITE+SILVER), 12-week course (Jul-Oct 2019)

## Patents
- "A System and Apparatus for AI based Multifunction Mixer Grinder with automatic soaking and food ingredient preparation techniques" - Co-Author, Application Number: 202341065950, Status: Published in Patent Journal & Awaiting Examination

## NPTEL Courses
- "Edge Computing" with 56%, 8-week course (Jan-Mar 2024)
- "Big Data Computing" with 96% (ELITE+GOLD), 8-week course (Aug-Oct 2023)
- "Programming in Java" with 75% (ELITE+SILVER), 12-week course (Jul-Oct 2019)

## Certifications
- Image Processing Using OpenCV Masterclass (Pantech e Learning, Oct-Nov 2022)
- "Inculcating Universal Human Values in Technical Education" FDP (AICTE, Sep 2022)
- "Artificial Intelligence with Machine Learning in Java" (Oracle Academy, Oct 2022)
- Programming for Everybody (Getting Started with Python) (Coursera)
- Machine Learning for All Certification (Coursera)
- Java Programming (Code Tantra)
- C Programming (Code Tantra)
- Python Programming (Code Tantra)
- Online C Programming Quiz (Santhiram Engineering College, May 2020, 75% score)

## FDPs / Workshops / Seminars / Training Programs
- "Recent Trends in Artificial Intelligence" FDP (Bhupal Nobles University, Udaipur, Jan 2024)
- 5-day International Faculty Development Program on NLP and ChatGPT Applications (Excelr Edtech, Aug 2023)
- 4-day Faculty Development Program on "Large Language Models in Artificial Intelligence" (Oct 2023)
- 3-day Offline Workshop on "Emerging Learning Methods and Systems" (IIT Tirupati, Jul 2022)
- Offline Faculty Development Program on "Full Stack Development" (Blackbuck Engineers & S.R.K.R. Engineering College, Aug 2022)

## Reviewed Papers From UGC/Scopus/IEEE & Springer
- Reviewer for "1st International Conference of CSEAi 2023" (Lendi Institute of Engineering and Technology, Nov 2023)
- Reviewer for "Algorithms and Computational Theory for Engineering Applications (ICACTEA-2024)" (Adithya Engineering College, Feb 2024)
- Reviewer for "2024 International Conference on Social and Sustainable Innovations in Technology and Engineering – SASI-ITE'24" (Feb 2024)

## Roles and Responsibilities
- Students Counsellor
- Students Mentor
- B.Tech Project Guide
- Class Incharge for III B.Tech I Semester (R20) CSE-B Students

## Courses Taught
- UG: Java Programming, Database Management Systems, Data Structures, Cryptography and Network Security, Operating Systems, Natural Language Processing, Spring Boot
- PG: Mathematical Foundations of Computer Science, Advanced Data Structures

## Research Profiles
TABLE:
Profile | Link/ID
Google Scholar | IbKLpngAAAAJ
Vidwan | 288673
ORCID | https://orcid.org/0000-0002-5943-9822
Scopus | 58221107000


## Identifiers & Contact
- Email: ptsmurtycse@svecw.edu.in
- SVECW Emp ID: 599
`;

const CSE_GOTTALA_SURENDRA_KUMAR_TEXT = `
## Fields of Specialization
- Machine Learning
- IOT

## Educational Qualifications
TABLE:
Degree | Organization/Institution | Specialization | Year of Passing
Ph.D. | NIT, Silchar Assam | Machine Learning | Pursuing
M.Tech | JNTUK | IT | 2021
B.Tech | Pragati Engineering College | CSE | 2017

## Journal Publications in National/International Conferences
- "Adaptive Knowledge-Guided Pruning Algorithm AKGP with Dynamic Weight Allocation for Model Compression," International Journal of Computational and Experimental Science and Engineering, Vol. 11-No.1 (2025) pp. 1402-1410, DOI: 10.22399/ijcesen.944
- Chintalapati, P.V., Babu, G.R., Sree, P.K., Kode, S.K., Kumar, G.S. (2023). "Usage of AI Techniques for Cyberthreat Security System in Android Mobile Devices." International Conference on Innovative Computing and Communications, ICICC 2023, Lecture Notes in Networks and Systems, vol 703, Springer, Singapore

## NPTEL Courses
- Introduction to Machine learning
- Deep Learning

## FDPs / Workshops / Seminars / Training Programs
- One Week National level FDP on "Recent advances in Electronics and Communication Engineering-An Approach through AI&ML" - VIGNAN Institute (Aug 2023)
- One Week FDP on "Data Science and ChatGPT" - K L Deemed to be University (May 2023)
- One Week FDP on "Cloud Infrastructures" - Pragati Engineering College with BRAIN O VISION & AICTE (Aug 2023)
- 10 Hours National FDP on Machine Learning and Artificial Intelligence - APSSCDC with ExcelR Edtech Pvt. Ltd. (Nov 2023)
- 5 Day's Online International Faculty Development Program on Data Analyst
- Introduction to IOT by Skill up (Sep 2023)
- Recent Trends in Artificial Intelligence and Cyber Security
- Recent Advances in Data Science, Data Analytics and Cyber Security
- 7 days online international FDP on "Latest Trend and Techniques in Software Engineering: An industry perspective" - Department of Computer Science, CHRIST (deemed to be university), Bangalore (Jan 2024)
- 10 Hours National FDP on Blockchain Technology - Ramrao Adik Institute of Technology, D. Y Patil Deemed to be University, Bishop Heber College and SR University with ExcelR Edtech Pvt. Ltd. (Jan 2024)
- 10 Hours National FDP on Deep Learning and Artificial Intelligence - APSSDC with ExcelR Edtech Pvt. Ltd. (Feb-Mar 2024)

## Work Shops/Seminars and Training Programs Organized
- Guest lecture on "Software Engineering" - Seetha Polytechnic college, Bhimavaram
- One week Short term program on Data structures and algorithms

## Roles and Responsibilities
- Website Coordinator
- Student Mentoring
- Project guide Major/Minor

## Courses Taught
- UG: Dark Net and Deep Web, Information Security, Operating System, Theory of Computation, Artificial Intelligence, Python Programming, Computer Networks

## Research Profiles
TABLE:
Profile | Link/ID
Google Scholar | https://scholar.google.com/citations?user=5G52K2AAAAAJ&hl=en
Vidwan | 328465
ORCID | 0000-0001-6882-8160
Scopus ID | 0000-0001-6882-8160


## Identifiers & Contact
- Email: gsurendrakumarcse@svecw.edu.in
- SVECW Emp ID: 50001
- AICTE Unique ID: 1-9508698770
`;

const CSE_G_SUJATHA_TEXT = `
## Fields of Specialization
- Machine Learning

## Educational Qualifications
TABLE:
Degree | Institution | Specialization | Year
Ph.D | SRU, Warangal | Machine Learning | Pursuing
M.Tech | SRKR | CSE | 2021
B.Tech | SCET | CSE | 2017

## NPTEL Courses
- Programming through JAVA

## Certifications
- Programming through JAVA
- NLP, Computer Vision and Artificial Intelligence

## FDPs / Workshops / Seminars / Training Programs
- 5 Day's Online International Faculty Development Program on Data Analyst
- Recent Trends in Artificial Intelligence and Cyber Security
- Recent Advances in Data Science, Data Analytics and Cyber Security
- Eight Days Faculty Development Programme on Cyber Security & Hacking

## Roles and Responsibilities
- Class Incharge

## Courses Taught
- UG: OOPs through JAVA, Compiler Design, Data Structures, Management Science
- PG: Software Project and Process Management, Software Quality Assurance and Testing

## Research Profiles
TABLE:
Platform | Link/ID
Google Scholar | scholar.google.co.in/citations?user=JDLT7hIAAAAJ
Vidwan | 328521
Research Gate | researcherid.com/rid/IYJ-7875-2023
ORCID | orcid.org/0009-0000-8166-2142
Scopus | scopus.com/authid/detail.url?authorId=57211914432


## Identifiers & Contact
- Email: gsujathacse@svecw.edu.in
- SVECW Emp ID: 50003
`;

const CSE_NAGESWARA_RAO_TEXT = `
## Fields of Specialization
- Machine Learning
- AI

## Educational Qualifications
TABLE:
Degree | Institution | Specialization | Year
Ph.D | Vel Tech Rangarajan Dr. Sagunthala R&D Institute of Science and Technology, Chennai | CSE | Pursuing
M.Tech | Koneru Lakshmaiah College of Engineering, Vaddeswaram | CSE | 2009
B.Tech | Godavari Institute of Engineering and Technology, Rajahmundry | CSE | 2007

## Publications in National/International Journals
- Automating Fish Detection and Species Classification in Underwaters Using Deep Learning Model
- "Predict The Accuracy of Crop Yield Production using Neural Network Model" (2022), Journal of Education: Rabhindra Bharati
- "Comparison of two Data Pre-Processing Techniques for Efficient Data Cleaning" (2022), Journal of Fundamental & comparative Research, Shodhsamhita
- "Detection of New Emerging Concepts in Social networks Via-Link Anomoly" (2017), IJARSE Vol 8 Issue 08
- "Public Auditing for Shared Data in the Cloud" (2015), IJSETR Vol 4 Issue 51
- "Cloud Assisted Mobile – Access of Audited Health Data" (2015), IJR Vol 2 Issue 12

## Achievements
- GATE Qualified in 2007
- Ranked 3rd in 10th Class (2001)

## Books Published
- Understanding Machine Learning Concepts (ISBN13: 9789359110622, Published 17-Jul-2023)
- Fundamentals of IoT & Big Data (ISBN: 9789357574693)

## NPTEL Courses
- Programming in C
- Big Data Computing

## Certifications
- NPTEL Certification Course on "Problem Solving Through Programming in C" (Jan-Apr 2021), IIT Kharagpur
- NPTEL FDP course on "Big Data Computing" (Aug-Oct 2023, 8 Weeks)

## FDPs/Workshops/Seminars/Training Programs
- NPTEL Certification Course on "Problem Solving Through Programming in C" (Jan-Apr 2021), IIT Kharagpur, Ministry of HRD
- NPTEL FDP course on "Big Data Computing" (Aug-Oct 2023)

## Workshops/Seminars and Training Programs Organized
- Guest lecture on "Programming in C++" at Seetha Polytechnic College, Bhimavaram

## Roles and Responsibilities
- IV B.Tech II Sem: Class Teacher for CSE-A section
- IV B.Tech I Sem: Class Teacher for CSE-C section
- Mentor for II Sem (AI & ML)

## Courses Taught
- UG: Programming in C, OOPS through C++, Principles of Programming Languages, Computer Organization and Architecture, Design and Analysis of Algorithms, Compiler Design, Formal Languages and Automata Theory, Data Warehousing and Data Mining, Software Engineering, Software Project Management, Data Structures, Advanced Data Structures, UNIX and Shell Programming
- PG: Computer Organization and Architecture, Software Engineering

## Research Profiles
TABLE:
Platform | Link
Google Scholar | https://scholar.google.co.in/citations?user=oBNhr8MAAAAJ
Vidwan | https://svecw.irins.org/profile/328580
ORCID | https://orcid.org/0000-0003-1336-1027
Scopus | https://www.scopus.com/authid/detail.uri?authorId=57204727312


## Identifiers & Contact
- Email: anageswaraocse@svecw.edu.in
- SVECW Emp ID: 50004
- AICTE Unique ID: 1-3558155073
`;

const CSE_SATYA_MALLESH_TEXT = `
## Fields of Specialization
- Machine Learning
- Deep Learning

## Educational Qualifications
TABLE:
Degree | Institution | Specialization | Year
M.Tech | SRKR Engineering College, Bhimvaram | Information Technology | 2008
B.Tech | Sri Prakash College of Engineering, Tuni | Computer Science and Engineering | 2006

## Professional Affiliations
- Life Member ISTE (LM 77865)

## Journal Publications in National/International Conferences
- "Malware Detection Using a Novel Machine Learning Dynamic Ensemble Classification Approach" (Co-Author), 2024 International Conference on E-mobility, Power Control and Smart Systems (ICEMPS), April 2024
- "Smart System for Early Detection of Agricultural Plant Diseases in the Vegetation Period" (1st Author), 2023 1st DMIHER International Conference on Artificial Intelligence in Education and Industry 4.0, November 2023
- "A Research Study of Heart Health Monitoring Using Deep Learning and IoT" (Co-Author), 2023 1st DMIHER International Conference on Artificial Intelligence in Education and Industry 4.0, November 2023
- "Low Birth Weight Prediction Using Machine Learning" (Co-Author), 1st CSEAi 2023 International Conference on Computing For Science, Engineering and Artificial Intelligence, November 2023
- "An Efficient Cancer Detection Model Using ML and Transfer Learning Techniques" (Co-Author), International Conference on Distributed Computing and Optimization Techniques (ICDCOT-2024), March 2024
- "Generic Framework for Vehicle Identification System with Deep Learning Models" (Co-Author), Journal of Electrical Systems, Volume 20, No. 2, 2024

## Books Published
- "Fundamentals of IoT and Bigdata" (Co-Author), Scientific International Publishing House, 2023, ISBN: 978-93-5757-469-3

## Achievements
- "Topper 1%" in NPTEL Course "Big Data Computing" with 99% (8-week course, Aug-Oct 2023)

## Patents
- "A System and Apparatus for AI based Multifunction Mixer Grinder with automatic soaking and food ingredient preparation techniques" (Co-Author), Application Number: 202341065950

## NPTEL Courses
- "Elite-Silver" in "Business Analytics & Text Mining Modeling using Python" with 88% (8-week course, Jul-Sep 2024)
- "Elite-Silver" in "Fundamental Algorithms: Design and Analysis" with 77% (4-week course, Jan-Feb 2025)
- "Edge Computing" with 56% (8-week course, Jan-Mar 2024)
- "Big Data Computing" with 99% (8-week course, Aug-Oct 2023)
- "Programming, Data Structures and Algorithms Using Python" with 60% (8-week course, Feb-Mar 2018)

## Certifications
- Oracle Academy: "Application Development Fundamentals" (Jan 2024)
- Oracle Academy: "Artificial Intelligence and Machine Learning" (Jan 2024)
- Oracle Academy: "Artificial Intelligence and Machine Learning in Java" (Jan 2024)
- Oracle Academy: "Oracle Cloud Infrastructure Foundation I" (Jan 2024)
- Oracle Academy: "Database Foundations" (Feb 2022)
- Oracle Academy: "Java Foundations" (Feb 2022)
- Oracle Academy: "Java Fundamentals" (Jan 2022)
- Oracle Academy: "Java Programming" (Feb 2022)
- "Python Fundamentals for Beginners" - Great Learning (Aug 2023)
- "Basics of Python" - Infosys Springboard (Jan 2024)
- "Introduction to Deep Learning" - Infosys Springboard (Jan 2024)
- "Introduction to Machine Learning" - Infosys Springboard (Feb 2024)
- "Introduction to Artificial Intelligence" - Skillup by Simplilearn (Aug 2024)
- "AI For Everyone" - Coursera (Mar 2020)
- "Support Vector Machines in Python" - Coursera (Apr 2020)
- "Data Structures" - Coursera (Jul 2020)
- "Introduction to the Internet of Things and Embedded Systems" - Coursera (Jul 2020)
- "Get Started with Figma" - Coursera (Jan 2024)
- "Python Programming: A Concise Introduction" - Coursera (Jul 2020)
- "Python Basics" - Coursera (Apr 2020)
- "Python Classes and Inheritance" - Coursera (Jul 2020)
- "Python Programming Essentials" - Coursera (Apr 2020)
- "Programming for Everybody (Getting Started with Python)" - Coursera (Apr 2020)
- "Python Data Structures" - Coursera (Apr 2020)
- "Introduction to Big Data" - Coursera (Apr 2020)
- "Logistic Regression with NumPy and Python" - Coursera (Apr 2020)
- "Introduction to Python: Master Python Basics" - Bitdegree (Apr 2020)
- "Learn Python From Scratch: Basics and Projects for Practice" - Bitdegree (Apr 2020)

## FDPs / Workshops / Seminars / Training Programs
- One week FDP on Exploring NLP Applications in AI&ML - Panimalar Engineering College (Dec 2024)
- One day Webinar on Cloud Enabled Internet of Things - SRKR Engineering College (Mar 2024)
- One week FDP on Strategic Hoops: NBA Accreditation and OBE Mastery - Madanapalle Institute of Technology and Science (Feb-Mar 2024)
- One week FDP on Generative AI - D Y Patil College of Engineering, Pune (Feb 2024)
- One week FDP on Recent Trends in Artificial Intelligence - Bhupal Nobles University, Udaipur (Jan 2024)
- Two week Online Workshop on Asymptotic Analysis of Algorithms - NIT Warangal (Oct 2024)
- 5 Days FDP on Data Visualization Tools Using R, Power BI and Tableau - Mahatma Gandhi Institute of Technology (Sep 2023)
- One week National Level FDP on Cloud Infrastructure (AWS) - Brainovision Solutions with AICTE (Aug 2023)
- Five days FDP on Salesforce Platform Developer 1 - ICT Academy at Vignana Bharathi Institute of Technology (Jun 2023)
- Machine Learning with Deployment FDP - Sri Vasavi Engineering College, Tadepalligudem (Jul 2020)
- One day FDP on Post Covid 19 - Lokmanya Tilak College of Engineering, Navi Mumbai (Jul 2020)
- Emerging Trends in Information Technology FDP - Karpagam College of Engineering, Coimbatore (Jun 2020)
- Python 3.4.3 FDP - Pragathi Engineering College, Surampalem (Jun 2020)
- Cyber Security FDP - Anurag University (Jun 2020)
- Innovative Trends in Data Analysis and AI FDP - Malineni Lakshmaiah Women's Engineering College, Guntur (May 2020)
- Advanced Python Programming using Django FDP - Malineni Lakshmaiah Women's Engineering College, Guntur (May 2020)
- Google Applications FDP - Pitapur Rajah's Govt. College, Kakinada (May 2020)
- National workshop on R-Programming - S K N Sinhgad College of Engineering, Bombay (Apr-May 2020)

## Reviewed Papers From UGC/Scopus/IEEE & Springer
- Reviewer on 1st International Conference of CSEAi 2023 (Computing for Science, Engineering and Artificial Intelligence) at Lendi Institute of Engineering and Technology (Nov 2023)

## Roles and Responsibilities
- Class Incharge for III B.Tech I Semester(R20) Students
- Project Coordinator for II B.Tech II Semester(R22) Students

## Courses Taught
- UG: Data Structures, Advanced Data Structures, Design and Analysis of Algorithms, Object Oriented Programming Through C++, Python Programming, Unified Modeling Language, Multimedia and Web Development, Computer Organization
- PG: Advanced Data Structures and Algorithm Analysis, Cloud Computing, Big Data Analytics

## Research Profiles
TABLE:
Platform | Profile ID
Google Scholar | arjXkSIAAAAJ
Vidwan | https://vidwan.inflibnet.ac.in/profile/410507
Research Gate | JHT-3708-2023
ORCID | 0009-0007-9109-002X
Scopus | 58909349100


## Identifiers & Contact
- Email: asmalleshcse@svecw.edu.in
- SVECW Emp ID: 50005
`;

const CSE_RAJESH_THAMMULURI_TEXT = `
## Fields of Specialization
- Machine Learning

## Educational Qualifications
TABLE:
Degree | Organization/Institution | Specialization | Year of Passing
Ph.D. | Pondicherry University | Machine Learning | Pursuing
M.Tech | Andhra University College of Engineering(A), Vizag | CST with Bioinformatics | 2014
B.Tech | Narasaraopeta Engineering College, Narasaraopet | CSE | 2012

## Publications in National/International
- Certificate of paper presentation on "Low Birth Weight Prediction using Machine Learning" at 1st International Conference on CSEAi 2023, Lendi Institute of Engineering & Technology(A), Viziyanagaram, with California State University USA, IAASSE, Nov 2023
- Paper presentation on "Systems Of Group Recommendation Based On Opinion Dynamics," Dogo Rangsang Research Journal, UGC Care Group I Journal, Vol-11 Issue-01 – 2021

## Achievements
- Qualified in GATE 2009
- Qualified in GATE 2012

## FDPs / Workshops / Seminars / Training Programs
- One week FDP on Salesforce Platform Developer 1, ICT Academy, Sagi Rama Krishnam Raju Engineering College, Bhimavaram (Feb 2024)
- AICTE Training And Learning (ATAL) Academy FDP on Design Thinking and Prototyping for Industry 4.0, SVECW (Nov 2023)
- 10 Hours National FDP on Business Analytics, AISSMS College of Engineering, SJC Institute of Technology and Matrusri Engineering College with ExcelR Edtech Pvt. Ltd. (Feb 2024)
- 7 days online international FDP on "Latest Trend and Techniques in Software Engineering: An industry perspective," Department of Computer Science, CHRIST (deemed to be university), Bangalore (Jan 2024)
- 10 Hours National FDP on Blockchain Technology, Ramrao Adik Institute of Technology, D. Y Patil Deemed to be University, Bishop Heber College and SR University with ExcelR Edtech Pvt. Ltd. (Jan 2024)
- 10 Hours National FDP on Deep Learning and Artificial Intelligence, APSSDC with ExcelR Edtech Pvt. Ltd. (Feb-Mar 2024)

## Roles and Responsibilities
- Mentor

## Courses Taught
- UG: TOC, OS, CN, CO, DS, ADS, CG, OOPS through JAVA, OOPS through C++, Machine Learning, Distributed Systems
- PG: Machine Learning, Distributed Systems, CN

## Research Profile
- ORCID: 0009-0000-4693-1992


## Identifiers & Contact
- Email: trajeshcse@svecw.edu.in
- SVECW Emp ID: 50006
- AICTE Unique ID: 1-457001153
`;

const CSE_V_RAJESH_BABU_TEXT = `
## Educational Qualifications
TABLE:
Degree | Institution | Specialization | Year
Ph.D. | Amrita Deemed to be University, Amaravati | Computer Networks | Pursuing
M.Tech | RCE, Eluru | CSE | 2014
MCA | AMACE, Vadamavandal | CS | 2001

## Fields of Specialization
- Deep learning

## Professional Affiliations
- Life Member ISTE

## NPTEL Courses
- Statistical Learning for Reliability Analysis

## Certifications & FDPs
- Statistical Learning for Reliability Analysis
- KPIT FDP PUNE
- KPIT SPARKLE FDP
- JAVA CERTIFIED FDP
- BIG DATA CERTIFIED FDP

## Roles and Responsibilities
- Class In Charge
- UG Project Coordinator

## Courses Taught
- UG: Full stack Development, Principles of Programming languages, Electronic Commerce, UML & DP, Embedded Systems, Software Engineering, OOAD and Secure Coding, Web Application Development, Microprocessors, C and Java languages, Computer Networks, Object Oriented Analysis and Design, Operating Systems, Advanced Java Web Technologies, Web Technologies, Ruby-on-Rails/php/perl, Hadoop and Big Data, Data Structures, Software Testing Methodologies, Python, Node js Express js


## Identifiers & Contact
- Email: vrajeshbabucse@svecw.edu.in
- SVECW Emp ID: 50009
`;

const CSE_BELLAMGUBBA_ANOCH_TEXT = `
## Educational Qualifications
TABLE:
Degree | Institution | Specialization | Year
Ph.D. (Pursuing) | Pondicherry Central University | Deep Learning | -
M.Tech | Narasaraopeta Institute of Technology | CSE | 2018
B.Tech | Narasaraopeta Engineering College | CSE | 2013

## Fields of Specialization
- Machine Learning
- Deep Learning

## Publications - National/International Conference
- "Rice leaf diseases classification using CNN with transfer learning" in International Conference on Sustainable Advanced Computing 2024

## Publications - Journal
- "Optimizing breast cancer diagnosis with advanced deep learning techniques" in Medical Imaging, Journal of Electrical Systems Vol. 20, No. 2, 2024

## FDPs/Workshops/Seminars/Training Programs
- 7-day online international FDP on "Latest Trends and Techniques in Software Engineering: An industry perspective" (CHRIST University, Bangalore; Jan 2024)
- 10-hour National FDP on Blockchain Technology (Ramrao Adik Institute; Jan 2024)
- 10-hour National FDP on Deep Learning and Artificial Intelligence (APSSDC with ExcelR Edtech; Feb-Mar 2024)
- One-week FDP on Salesforce Platform Developer 1 (ICT Academy; Feb 2024)
- AICTE ATAL Academy FDP on Design Thinking and Prototyping for Industry 4.0 (SVECW; Nov 2023)
- 10-hour National FDP on Business Analytics (AISSMS College; Feb 2024)

## Roles and Responsibilities
- Student Mentor
- Project Guide

## Courses Taught
- UG: OOAD, Computer Graphics, DBMS, Java Programming, Statistics with R Programming, Python, Unix, DAA, SA&DP, CN, UML & DP, Machine Learning


## Identifiers & Contact
- Email: banochcse@svecw.edu.in
- SVECW Emp ID: 500011
`;

const CSE_UMA_MAHESWARA_RAO_TEXT = `
## Fields of Specialization
- Big Data Analytics
- Machine Learning
- Software Testing

## Educational Qualifications
TABLE:
Degree | Organization/Institution | Specialization | Year
Ph.D. | Andhra University | Big Data | 2024
M.Tech | GIET, JNTUK | CSE | 2008
B.Tech | TPIST, JNTU | CSE | 2005

## Publications - National/International Journals
- "Task Failure Prediction in Cloud Data Centers using Deep Learning" - Journal of Survey in Fisheries Sciences, Vol. 10, No. 1, 2023 (Scopus)
- "Medical Big Data Analysis using Binary Moth-Flame with Whale Optimization Approach" - International Journal of Advanced Computer Science and Applications, Vol. 13, No. 8, 2022 (Scopus)
- "Medical Big Data Analysis using LSTM based Co-Learning Model with Whale Optimization Approach" - International Journal of Intelligent Engineering and Systems, Vol. 15, No. 4, 2022 (Scopus)
- "Skin disease detection and multi-class classification using convolution neural network model" - Journal of Fundamental & Comparative Research, Vol. VIII, No. 1, 2022
- "Comprehensive Survey of Classification, Streaming Techniques in Big Data Analytics" - Design Engineering, Issue 5 (Scopus)
- "A study on the Methods of Software Testing based on the Design Models" - International Journal of Research in Electronics and Computer Engineering, Vol. 6, Issue 4, 2018
- "Integration of Artificial Neural Networks for Stock Price Prediction" - International Journal of Research in Electronics and Computer Engineering, Vol. 02, Issue 2, April 2018
- "Investigating of Data Mining with Big Data" - International Journal of Scientific Engineering Technology Research, Vol. 05, Issue 40, November 2016
- "Generating Efficiency and Robustness Dynamic Query Forms for Advanced Database Queries" - International Journal of Research in Information Technology, Vol. 4, Issue 9, September 2016
- "An Enhanced Security in Wireless Sensor Networks by Using Contingent Delivery Algorithm" - International Journal & Magazine of Engineering, Technology, Management and Research, Vol. 2, Issue 9, September 2015
- "Providing Security and Minimizing Data Management Cost in the Cloud" - International Journal of Research in Computer and Communication Technology, Vol. 2, Issue 11, November 2013
- "Object Tracking in Real Time Scene Using SPARCE Coding" - International Journal of Research in Computer Science & Engineering, Vol. 2, Issue 2, September 2013
- "Top-k keyword search using Skyline Sweeping and Improved Rank Function" - International Journal of Computer Science and Technology, Vol. 3, Issue 3, July-September 2012
- "Different Types of Layouts in SQL to Prepare Datasets & Reports" - International Journal of Computer Science and Technology, Vol. 3, Issue 3, July-September 2012

## Conference Publications
- "Power Prediction in Combined Cycle Power Plant through ML and DL Regression Techniques" - 2024 International Conference on Cognitive Robotics and Intelligent Systems (ICC-ROBINS), IEEE
- "Data Stream Association Rule Mining Based on Sliding Window Model" - International Conference on Recent Advances in Computer Sciences, 2012

## Achievements
- Received "Best Researcher award" from IJIEMR in 2022
- Qualified GATE-2008 with percentile score 62.7%

## NPTEL Courses Completed
- "Introduction To Machine Learning" - Score: 54%
- "Big Data Computing" - Score: 57%
- "Data Base Management System" - Score: 50%
- "Introduction to Automata, Languages and Computation" - Score: 66%

## Certifications
- "Azure Fundamentals" from Microsoft - Certification Number 1692-6879 (April 2023)
- "Data Science and Big Data Analytics" from EMC Academic Associate (Sep 2017)
- "Java Fundamentals and Programming" from Oracle Academy (Nov 2016)
- "Microsoft Office Specialist (MOS) Word-2010" from Microsoft (Jun 2014)
- "Microsoft Certified Professional (MCP)" from Microsoft (Nov 2014)

## FDPs/Workshops/Seminars/Training Programs
- Five Day FDP on "Advanced Natural Language Processing" (Oct 2023) - Bapatla Engineering College
- One Week FDP on "Overview of AI & Applications in Speech Processing" (Jun 2020) - Chebrolu Engineering College
- FDP on "Microsoft Azure & Training Methodology" (May 2022) - CEMCA and AP Information Technology Academy
- Three Day National Workshop on "Start Your Own Startups Using Software & Social Networks" (Jun 2020) - Swarnandhra College of Engineering and Technology, Narsapur
- One Day Webinar on "Moodle–Open-Source Learning Platform" (Jun 2020) - Vignan Pharmacy College
- Four Day FDP on "Webinar on Machine Learning for Real World Applications" (May 2020) - NRI Institute of Technology
- Five Day FDP on "LaTeX" (May 2020) - Anand International College of Engineering
- Three Day FDP on "Recent Threads in Research Methodology" (May 2020) - Bhimavaram Institute of Engineering & Technology
- Two Day FDP on "Cyber Security" (May 2020) - Swarnandhra College of Engineering & Technology
- One Day Faculty Awareness Program on "NBA to keep touch with NBA Accreditation" (May 2020) - PACE Institute of Technology and Sciences
- One Day Faculty Awareness Program on "Outcome Based Education (OBE) and NBA Accreditation" (May 2020) - Sinhgad Institute of Technology and Science
- Five Days FDP on "Artificial Intelligence Using Machine Learning and Deep Learning" (Jan 2019) - Swarnandhra College of Engineering and Technology
- Two Week Faculty Awareness Program on "Effective coding skills Through problem solving and Algorithm Analysis" (Oct-Nov 2018) - Swarnandhra College of Engineering and Technology
- One Day Workshop on "Free and Open-Source Software (FOSS)" (Oct 2018) - Spoken Tutorial/IIT Bombay
- Five Days FDP on "Java Fundamentals and Java Programming" (Nov 2016) - Swarnandhra College of Engineering and Technology
- One Day Workshop on "Why Entrepreneurship" (Jan 2016) - Swarnandhra College of Engineering and Technology
- Six Days FDP on "Core Java Program" (Nov 2014) - Swarnandhra College of Engineering and Technology
- One Day Conference on "Green Energy Solutions" (Nov 2014) - Swarnandhra College of Engineering and Technology
- One Day Workshop on "Recent Trends in Research Methodologies" (Jul 2013) - Swarnandhra College of Engineering and Technology
- Four Days Workshop on "Software Testing and Techniques & Tools" (Dec 2011) - Swarnandhra College of Engineering and Technology
- Three Days International Conference on "Nanoscience Engineering & Advanced Computing (ICNEAC-2011)" (Jul 2011) - Swarnandhra College of Engineering and Technology
- Twelve Day Staff Development Program on "Importing soft skills and Modern Teaching Methods" (Apr 2010) - Sasi Institute of Technology & Engineering

## Roles and Responsibilities
- NAAC Coordinator for Criterion-III
- Department Placement Coordinator
- NBA Coordinator for Criterion-V
- BOS member at department level for academic years 2018 and 2019
- Anti-ragging committee member
- Course file Coordinator
- Counselling file In charge

## Courses Taught
- UG: Formal Languages and Automata Theory, Compiler Design, Network Security & Cryptography, Information Retrieval systems, Data base Management systems, Computer Organization and Architecture, C and Data structures, Computer Networks, Software Engineering, Software Testing Methodologies, Software Project management
- PG: Network Security & Cryptography, Big Data Analytics, Advanced Computer Architecture, Data warehousing and data mining, Machine Learning

## Research Profiles
TABLE:
Profile | Link
Google Scholar | https://scholar.google.com/citations?user=4p3OX60AAAAJ&hl=en
Research Gate | https://www.researchgate.net/profile/Saka-Uma-Maheswara-Rao
ORCID | https://orcid.org/0000-0003-3971-3924
Scopus | https://www.scopus.com/authid/detail.uri?authorId=57767759500


## Identifiers & Contact
- Email: Saka.mahi@gmail.com
- SVECW Emp ID: 500013
`;

const CSE_S_NAGARAJAN_TEXT = `
## Educational Qualifications
TABLE:
Degree | Institution | Specialization | Year
Ph.D | Gideon Robert University | Image Processing | 2021
M.E | Anna University | Networking | 2013
B.Tech | Anna University | Networking | 2007

## Fields of Specialization
- Image Processing

## Research Publications (Journals)
- "Solar Charged Automated Drones Using Recognition Of The Institution In Zambia" - Journal on Intelligent Systems & Robotics Insights & Transformations
- "The Great Escape Video Game In Ai For Npcs" - International Journal of Emerging Technologies and Innovative Research
- "Electric Vehicle Charging Station Locater And Slot Booking System Using Artificial Intelligence"
- "Evaluating Fake News Detection Models" - South Asian Research Journal of Engineering and Technology
- "Image Numerification Processor Measurement using AI" - International Journal of Multimedia, Image Processing and Pattern Recognition
- "Help Advertise Its Products And Services To A Wider Market Using Email, Server & Client Communication" - International Journal on Wireless, Networking & Mobile Communication Innovations
- "Technology And Innovation For Autism Students In Primary Level" - International Journal of Multimedia, Image Processing and Pattern Recognition
- "A Study On Multimedia Tools For Reducing Stress Of Working People After Retirement" - International Journal of Multimedia, Image Processing and Pattern Recognition
- "Cyber Security Mini-Toolkit Application"
- "Android Video Calling Application-Less Costly Than Most of The Other Types of Video" - International Journal of Recent Development in Computer Technology
- "A Study on Multimedia Tool For Autism Students for the Improvement of Education in Primary Level" - International Journal of Recent Development in Computer Technology & Software Application
- "Authentication and Identification Smart Kit Using Biometric System Technology For School Student" - International Journal of Current Research in Embedded System & VLSI Technology
- "Virtual Classroom Using Multimedia Tool" - International Journal of Multimedia, Image Processing And Pattern Recognition
- "Zambia Shopping Cart" - Global Journal on Application of Data Science and Iot
- "Automatic Classification for Accurate Representation of Defected Region of a Medical Image Segmentation" - International Journal of Multimedia, Image Processing and Pattern Recognition
- "An Optimized deep Reinforcement Learning for Rice Disease Prediction" - jCSTb journal of Data Acquisition and Processing
- "Mobile Auto Silent Mode App(Triggerinfence)" - International Journal on Wireless, Networking & Mobile Communication Innovations

## Conference Publications
- "Automated Business Bot – Ai" - International Conference on Emerging Innovative Technologies in Engineering (ICEITE-22)
- "Image Numerification Processor Measurement using AI" - International Conference on Emerging Innovative Technologies in Engineering (ICEITE-22)
- "Smart Modernistic in Electronics and Communication" - International Conference organized by St. Martin's Engineering College
- "Iot Unite Smart School Application For Special Technology In Security Purpose" - International Conference on Innovations in Business and Management
- "Jointly Optimal Congestion And Power Control to Increase Reliability in Wireless Network" - International Conference on Advances in Computer, Communication and Management (ICACCM 2013)

## Books Published
- Beginners in Computer Studies – Skyfox publishing Group

## Awards & Recognition
- "Technological Innovation of The Year" – Sarojini Research And Development Council (IGWCMRD-2020) & Global Professional Awards Convocation 2020 (Oct 2020)
- "Technology And Innovation For Autism" published in Volume 1 – Issue 2 of International Journal of Multimedia, Image Processing and Pattern Recognition

## Faculty Development Programs / Workshops / Seminars
- One week FDP in "Program on Machine Learning"
- One week National Level FDP of Cloud infrastructure (AWS) - Brain vision Solution Limited
- Six days online FDP on "Latest Development in RF Technologies in 5G and Beyond"

## NPTEL Courses
- Python Programming
- Theory of Computation

## Courses Taught
- UG: Cloud Computing, Mobile Computing, Computer Networks, Software Engineering, Design and analysis of Algorithm, Data structure and algorithms, Multimedia, Data Communication and Networking (+ labs), OOAD, DBMS (+ labs)
- PG: Multimedia, Software Engineering, Computer Networks, Data communication

## Research Profiles
TABLE:
Profile | Link
Google Scholar | https://scholar.google.com/citations?user=RNNOHeQAAAAJ&hl=en&oi=sra
ORCID | https://orcid.org/0009-0001-5299-8277?lang=en


## Identifiers & Contact
- Email: snagarajancse@svecw.edu.in
- SVECW Emp ID: 50014
`;

const CSE_BRAHMA_RAMESH_TEXT = `
## Educational Qualifications
TABLE:
Degree | Organization/Institution | Specialization | Year
Ph.D | Godavari Global University | Quantum Cryptography | Pursuing
M.Tech | Bonam Venkata chalamayya Engineering College, Odalarevu | CSE | 2015
B.Tech | KIMS Engineering College, Amalapuram | IT | 2012

## Fields of Specialization
- Network Security
- Image Processing

## Publications in National/International Conferences
- "Novel Elliptic Curve-based Generalized ElGamal Framework for Enhancing Security in M2M Communications", 2nd International Conference on Electronic Circuits and Signaling Technologies (ICECST 2025), Lincoln University College, Malaysia, October 2025 (IEEE)
- "Quantum Computing: Implications for Artificial Intelligence and Machine Learning", Metallurgical and Materials Engineering, Vol. 31 (1), 2025, pp. 329-337
- "Face Recognition Using Discriminate Analysis and Canonical Correlations" in International Journal of Computer Science and Telecommunications (IJCST), 2015
- "High Secured E-Voting System" in International Journal of Research (IJR), 2019
- "Prediction of Various Crops in Agricultural Field Using Decision Tree and Naviebayes Algorithm in Machine Learning" in International Journal of Engineering Research & Technology (IJERT), 2021
- "Video Content Analysis Using Deep Learning Models" in 3rd International Conference on Advancement in Electronics & Communication Engineering (IEEE)

## Patents
- Quantum Key Generation Device for Secured Cloud Communication
- "A Novel Method for Identifying Hidden Patterns in Large Datasets Using Deep Learning Techniques," Application No. 202441043129 A, Publication Date: 03/06/2024

## Achievements & Certifications
- Certificate for "Programming for Everybody (Getting Started with Python)" by Coursera
- Certificate for "AI For Everyone" by Coursera

## FDPs/Workshops/Seminars/Training Programs
- Two-day workshop on "Necessity Of Optimizing Big Data," Adikavi Nannaya University, Rajamahendravaram (Aug 2016)
- One-week FDP on "Data Science And Big Data Analytics," BVC Engineering College (autonomous) with E&ICT Academy, NIT Warangal
- One-day workshop on "Block-chain: The modern internet" at JNTUK Kakinada
- One-week National Workshop on "Improving Teaching Skills In Computer Programming," JNTUK, Kakinada (Jan-Feb 2018)
- 10-hour FDP on Blockchain Technology, IDS with APSSDC, A.P. (Jul 2020)
- FDP on AI and Deep Learning, 360 DigiTMG with APSSDC, A.P. (Jul 2020)
- Five-day National Level Online FDP on Applications Of Machine Learning, SVECW (Jun 2021)
- Webinar on "Introduction to Deep Learning Using Convolutional Neural Network (CNN)-hands on using Keras" (Aug 2022)
- One-week FDP on Microsoft Azure AI Engineer Associate, ICT Academy (Mar 2024)
- One-week National Level Online FDP on Generative AI Model and Applications of Machine Learning (May 2024)

## NPTEL Courses
- Introduction to Quantum Computing: Quantum Algorithms and Qiskit
- Certificate for "Introduction To Internet Of Things"
- Certificate for "Java Programming" (Jan-Apr 2024, 12-week course)

## Courses Taught
- UG: Java Programming, Python Programming, Design and Analysis of Algorithms, Computer Organization, Object Oriented Programming through C++, Formal Languages and Automata Theory, Artificial Intelligence

## Research Profiles
TABLE:
Profile | Link
Google Scholar | https://scholar.google.com/citations?hl=en&user=cBVduyMAAAAJ
Vidwan | https://vidwan.inflibnet.ac.in/profile/590549
Research Gate | https://www.researchgate.net/profile/Kallakuri-N-V-P-S-Ramesh
ORCID | 0009-0006-2654-0517


## Identifiers & Contact
- Email: knvpsbrameshcse@svecw.edu.in
- SVECW Emp ID: 50016
`;

const CSE_PANTHANI_RAMESH_TEXT = `
## Educational Qualifications
TABLE:
Degree | Organization/Institution | Specialization | Year of Passing
Ph.D | Godavari Global University | Machine Learning | Pursuing
M.Tech | B V C Engineering College Odalarevu | CSE | 2020
B.Tech | B V C Engineering College Odalarevu | CSE | 2013

## Fields of Specialization
- Machine Learning

## Publications in National/International Conferences
- "Enhance Image Quality By Implementing Deep Residual Neural Network" (IEEE)
- "Provably Secure And Light weight Personality Based Verified Information Sharing Convention For Digital Physical Cloud Condition" (STD)
- "Ecg-Based Driver's Stress Detection Using Deep Transfer Learning And Fuzzy Logic Approaches" (Atlantis)

## Book Chapters Published
- A system by Using Neural Networks For 3d Surface Structure Estimation Based On Real-World Data For Autonomous Systems And Applications
- A system For Detecting and classification of machine anomalies using Convolution Neural Network And Method Thereof

## Certifications
- NPTEL Certification: Introduction to Machine learning

## FDPs Attended
- "Applications of Machine Learning" - Five Day National Level Online FDP, Department of Computer Science & Engineering, SVECW (June 2021)
- "Research Challenges and Opportunities Post COVID-19 (RECOP2020)" - FDP, Sri Vasavi Engineering College (May 2020)
- "Networking Simulation using Qualnet Software" – FDP, DELLSOFT Technologies Pvt. Ltd, BVC Engineering College, Odalarevu (Sep 2017)

## Workshops Attended
- "AI For Everyone" online non-credit course, deeplearning.ai via Coursera (May 2020)
- "Introduction to Big Data" online non-credit course, deeplearning.ai via Coursera (Apr 2020)

## Courses Taught
- UG: Formal Languages and Automata Theory, Compiler Design, Secure Coding Techniques, Mathematical Foundation of Computer Science, JAVA, Digital Logic Design


## Identifiers & Contact
- Email: prameshcse@svecw.edu.in
- SVECW Emp ID: 5020
`;

const CSE_SATYANARAYANA_REDDY_MARRI_TEXT = `
## Educational Qualifications
TABLE:
Degree | Institution | Specialization | Year
Ph.D | JNTU A | Machine Learning | Pursuing
M.Tech | Acharya Nagarjuna University (ANU) Campus | CSE | 2013
MCA | Akula Gopayya College of Engineering & Technology | CS Applications | 2010

## Fields of Specialization
- Machine Learning
- Deep Learning
- Computer Networks
- Artificial Intelligence

## Publications in National/International Journals
- "Adaptive P2P Live Streaming Model Using Connection Switching to Enhance the QoS" (2023, International Journal of Intelligent Systems and Applications in Engineering)
- "Adaptive Scheduling Algorithm for Live Video Streaming in P2P Network" (2024, International Journal of Communication Networks and Information Security)
- "QoS based meta-heuristic algorithm for path selection in the peer-to-peer network video streaming" (2024, Journal of Autonomous Intelligence)
- "Deep Temporal LSTM Regression Network (DTLR-Net) Model for Optimizing Quality of Video Streaming Quality in CDN-P2P Model" (2025, IEEE Access)

## Conference Publications
- "A Survey on Streaming Adaptation Techniques for QoS and QoE in Real-Time Video Streaming" (2021, Smart Computing and Informatics)
- "A Survey On Complex Precautions: An Advance towards Secure Computing" (2022, International Journal of Advanced Research in Computer and Communication Engineering)

## Books Published
- "Introduction to Machine Learning and Natural Language Processing" (2025, SK Research Group of Companies, ISBN: 978-93-6492-660-7)

## Professional Affiliations
- AMIE(IE)

## FDPs/Workshops/Seminars/Training Programs Attended
- Virtual FDP on Simulation and Emulation of Self Organized Networks (SEASON 2020) - Kongu Engineering College
- Online FDP on Python 3.4.3 - Pragati Engineering College (Jun 2020)
- Instructor Led Live Online FDP on Artificial Intelligence & Machine Learning Using Python - Finland Labs/IIT Roorkee (May 2020)
- Five-Day Online FDP on Cyber Security - Vikas College of Engineering & Technology (May 2020)
- One Month Internship in Python Programming - APSSDC/Pantech e Learning (Aug-Sep 2022)
- One Month Internship in Web Development Full Stack-React Js - APSSDC/Pantech e Learning (Jan-Feb 2023)
- One Week Online FDP on Cloud Computing for Innovative Solutions - SVECW (May 2024)
- One Week International FDP on Python Programming - Department of CSE/Anurag Center (Jun 2024)

## Certifications
- Theory of Computation (NPTEL)

## Courses Taught
- UG: C Programming, Python, Java, Data Structures & Design and Analysis of Algorithms, Formal Languages & Automata Theory and Compiler Design, Operating Systems, Computer Networks, Database Management Systems, Computer Organization

## Research Profiles
TABLE:
Profile | Link
Google Scholar | https://scholar.google.com/citations?hl=en&user=b8W_mWYAAAAJ
ORCID | https://orcid.org/0009-0005-1035-8238
Scopus | https://www.scopus.com/authid/detail.uri?authorId=57226643096


## Identifiers & Contact
- Email: msreddycse@svecw.edu.in
- SVECW Emp ID: 500021
`;

const CSE_ASHOK_KOUJALAGI_TEXT = `
## Educational Qualifications
TABLE:
Degree | Institution | Specialization | Year
Ph.D | Central University of Allahabad | CSE | 2016
M.E | Anna University | CSE | 2019
M.Sc | Bangalore Central University | CS | 2013
BCA | Bangalore Central University | CSA | 2011

## Fields of Specialization
- Cloud Computing and Cyber Security

## Research Interest
- Cloud Computing
- Software Engineering
- Cyber Security

## Publications in National/International Conferences
- "Health Fitness Tracker System Using Machine Learning Based on Data Analytics"
- "Tourism Enhancer App: User-Friendliness of a Map with Relevant Features"
- "Smart Instant Charging of Power Banks"
- "Internet of Things (IoT) Enabling Technologies and Applications—A Study"
- "Investigating Scope of Real-time Data Processing for IoT in 5G Revolution"
- "Smart Lung Cancer Detector Using a Novel Hybrid for Early Detection"
- "Smart Gas Monitoring System for Home and Industries"
- "Challenges of International Online Shopping from Customers and Merchants View"
- "Application of Machine Learning in Classification of Data over Social Media"
- "Proposed Omnipresent Learning for Rising Students Persistence through Learning Network"
- "Intelligent Tool Wear Monitoring: Confluence of Improved Dragonfly Optimization and Deep Belief Networks"
- "Sky Sage: Revolutionizing Airfare Prediction with Advanced Machine Learning Integration"
- "Smart Railway Gate Timings App: Monitoring Indian Railway Gates Through Novel App"
- "An In-Depth Convolution Neural Network for Chest X-Ray Image Assessment Using CXRIA-Net"

## Journal Publications in National/International Conferences
- "Establishing Context Awareness for a Mathematical Expression Recognizer"
- "Security mechanisms, attacks and security enhancements for IEEE 802.11 WLANs"
- "Information Processing & Information Diffusion in Computing Citation Networks"
- "Determine Word Relevance in Document Queries Using TF-IDF"
- "The WannaCry Ransomware, A Mega Cyber Attack and Consequences on Modern India"
- "Security Threats in Indian Cyberspace by Social Media and Cyberhoaxes"
- "Corroborative Computational Network Using Specknet in Wireless Routing Algorithm"
- "Considerable Detection of Black Hole Attack and Analyzing Performance on AODV"
- "Locating and Accessing Scientific Data through Digital Library Technology"
- "Improving Learning in Science and Mathematics Using Interactive Computational Modeling"

## Book Chapters Published
- "Impact of Call Drop Ratio Over 5G Network" (IGI Global)
- "Application of AI-based Learning in Automated Applications and Soft Computing Mechanism" (Taylor & Francis – CRC Press)
- "Role of Artificial Intelligence in Making Wearable Robotics Smarter" (Taylor & Francis – CRC Press)
- "Health Fitness Tracker System Using Machine Learning based on Data Analytics" (Springer)
- "Applying Generative AI in Global Language School to Improve Curriculum Planning" (IGI Global)
- "Novel Efficient Approach Enhancing Security over Biometric Systems Using Computer Vision" (Taylor & Francis)

## Books Published
- "Securing Routing Protocols Through Information Corroboration" (Research India publication)
- "Security Issues in Router" (Edupedia Publications)
- "Applications of Field-based Routing to Wireless Ad Hoc Networks" (Edupedia Publications)
- "Detection of Black Hole Attack in Mobile AdHoc Network" (Lambert Academic Publishing)
- "Prototype for Device Monitoring Through Wireless LAN" (Lambert Academic Publishing)
- "Trees in Data Structures: Non-linear Data Structures" (Lambert Academic Publishing)

## Professional Affiliations
- Institute of Research Engineers and Doctors – California, USA
- World Academy of Science, Engineering and Technology – Connecticut, USA
- Science and Engineering Institute – USA
- International Association of Engineers – Canada
- International Association of Computer Science and Technology – Singapore
- International Economics Development Research Center – Hong Kong
- Society of Digital Information and Wireless Communications – USA
- American Educational Research Association – USA
- European Alliance for Innovation – Belgium
- Indian Academicians and Researchers Association – India
- International Computer Science and Engineering Society – USA
- The Asia Society of Researchers – Hong Kong
- Experts of Academic Excellence Research Centre – Jordan
- Institute for Engineering and Research Publication – India
- International Journal of Scientific Research in Computer Science, Engineering & IT
- American International Association for Higher Education – USA
- Teaching and Education Research Association – India
- Common Ground Research Networks University of Illinois – USA
- Scientific and Technical Research Association – India

## Achievements
- Fellow of Computer Science Research Council – USA

## Reviewed Papers From UGC/Scopus
- "Mechanical view of corrosion phenomenon in concrete quadrangular of power transmission"
- "Introduction to 3G and IoT Understanding the Paradigm Shift in Connectivity"
- "Smart Cities Leveraging 4G and IoT for Sustainable Urban Development"
- "Factors Influencing Acceptance of Smartphones Among Vietnamese In-Service Mathematics Teachers"
- "Decentralized Autonomous Organizations (DAOs) in Cognitive IoT"
- "4G and IoT for Next Generation Connectivity"
- "Predicting Stock Market Trends Using Deep Learning: LSTM and Transformer Models"
- "Machine Learning Approaches for Macroeconomic Forecasting"
- "The Impact of AI on Economic Forecasting: Currency Exchange Rate Prediction"
- "Entropic Information & Black Hole: Black Hole Information Entropy"
- "Catheter-related thrombosis of Superior Vena Cava in patient with Superior Vena Cava Syndrome"
- "Machine Learning for Credit Scoring: Traditional and AI-Based Models"
- "Artificial Intelligence in Automated Trading Systems"
- "Utilizing Reinforcement Learning for Portfolio Optimization"
- "Explainable AI in Economic Analysis"
- "Leveraging Big Data and Machine Learning for Real-Time Economic Monitoring"
- "Machine Learning in Economic Impact Analysis of COVID-19"
- "Predictive Modeling of Consumer Behavior Using AI"
- "AI-Based Models for Forecasting Inflation"
- "Optimizing Monetary Policy with Machine Learning"
- "A Machine Learning Method for Spam Detection in Twitter"
- "Understanding Patterns of Terrorism in India (2007-2017) Using AI"
- "Nasal Colonization of Methicillin Resistant Staphylococcus aureus among Slaughterhouse Workers"

## Reviewer in Various UGC/Scopus Indexed Journals
- International Journal of Management, Information Technology and Engineering
- International Journal of Network Security
- International Journal of Advanced in Science, Technology and Engineering
- International Journal of Engineering Science and Technology
- International Journal of Information and Communication Engineering
- Oriental Journal of Computer Science and Technology
- International Journal for Research and development in technology
- International Open Journal of COJ Electronics & Communications
- International Journal of Engineering Research in Computer Science Engineering
- Applied Science and Computer Science Publications
- Global Research and Development Journal for Engineering
- International Journal of Computational Sciences and Information Technology
- International Journal of Engineering Research and Technology
- Common Ground Research Networks – University of Illinois
- Med-Crave Open Access Journal of Science
- Open Access Journal of Computer Science and Research
- International Research Journal of Computer Science
- International Journal of Computers & Technology
- Physical Science International Journal
- International Science and Information Organization
- International Journal of Creative Research Thoughts
- International Journal of Cloud Applications and Computing

## Indian Design Patent Grants
- "IoT Weather Reporting System" (Application No. 407331-001, Granted 13/02/2024)
- "Speed Trap gun" (Application No. 400654-001, Granted 07-03-2024)
- "IOT Based Automatic Robotic Waste Bin" (Application No. 433108-001, Accepted 07/10/2024)

## United Kingdom (UK) Design Patent Grants
- "Sensor-Based Security Device Embedded with Cloud Connectivity" (Design application number: 6411404, Grant date: 19 December 2024)
- "Cloud Based Indoor Interactive Kiosk" (Design application number: 6411402, Grant date: 19 December 2024)
- "Medicinal Plant Active Constituent Analyzer" (Design application number: 6410081, Grant date: 27 December 2024)
- "Lung Cancer Testing Device" (Design application number: 6420520, Grant date: 05 February 2025)
- "AI-Enabled Stress Monitoring and Alert Device" (Design application number: 6438984, Filed at UK IPO)

## Canada Patent Grants
- "Machine Learning in Action: Practical Applications and Advanced Techniques" (Application number: 1229966, Granted 21 Jan 2025)
- "Energy Consumption Forecasting System Utilizing Machine Learning for Smart Grids" (Application number: 1229865, Granted 18 Jan 2025)

## Indian Patent Publications
- "Concrete Crack Detection and Quality Monitoring System on GSM-IoT Sensors"
- "An Innovative Method for Improving Online Education System and Education Skill Teaching"
- "Smart Management System for Online Technical Learning and Advanced Training"
- "A Smart Health Care System to Recognize Fruits, Vegetables and Calorie Estimation"
- "An Intelligent System and Method for Automatic Target Identification and Tracking"
- "An Intelligent Management System for Reaching Mass Audiences Through YouTube Ads"
- "Artificial Intelligence and IoT based Self-driving Car for Path Planning and Road Lane Detection"
- "Early Detection And Classification Of Breast Cancer Using Image Processing, IOT, and Machine Learning"

## FDPs Attended
- Faculty Development Program on Teaching Techniques with Gamification (May 2020)
- FDP on Contemporary tools and techniques for teachers and researchers (May 2020)
- FDP on Swift(ios) Programming Language (May 2020)
- e-FDP on Global Pandemic: COVID-19 – Challenges and Opportunities (May 2020)
- FDP on R Programming (May 2020)
- FDP on Deep Learning and its Applications (May 2020)
- FDP on Cyber Security & Malware Analysis (May 2020)
- FDP on Internet of Things (Dec 2020)
- FDP on Recent Advances in VLSI & Embedded Systems (Sep 2020)
- FDP on Amazon Web Services (Aug 2022)
- FDP on Recent advancements in Machine learning & Artificial intelligence (Jan 2023)
- 8 weeks FDP on Cloud Computing and Distributed Systems (Feb-May 2023)
- FDP on Outcome-based education for effective learning & Teaching (Jul 2023)
- 3-day FDP on Inculcating Universal Human Values in Technical Education (Jun 2023)
- FDP on Cloud Computing Using AWS (Jul 2024)

## Workshops Organized
- National level training on Intellectual Property Awareness Program (Oct 2022)
- Faculty Development Programme on Instructional Design and Delivery System (Jun-Jul 2020)
- National level training on Intellectual Property Awareness Program (Apr 2023)
- National level training on LaTex (May 2020)
- Faculty Development Programme on How to Deliver the Lecturing (Jul 2024)

## Webinars Attended
- Webinar on How to publish a Book with ISBN (Oct 2022)
- Webinar on Online Safety & Cyber Crimes (May 2020)
- World Intellectual Property Day Quiz (Scored 19/20)
- Sky Campus Session series on VUCA World, Business, IT, AI, Vital Technologies, Industries, Research, Future Technologies, and Future of Education (Apr-May 2020)
- National-level Online Webinar on Artificial Intelligence & Machine Learning Using Python (Oct 2020)
- National-level Online Webinar on National Education Policy-2020 (Oct 2020)
- National-level Online Webinar on Cyber Virus During Coronavirus (Aug 2020)
- National Level Online Webinar on Virtual Interactive Classroom (Jun 2020)
- Webinar on Need Of IoT For Modern Electrical Engineers (May 2020)
- Intellectual Property Rights quiz (May 2020)
- Webinar on IoT (May 2020)
- National Level Webinar on Impact of COVID on Entrepreneurship (May 2020)
- National-level Online Webinar on Optical Wireless Communication (Oct 2020)
- National-level Online Webinar on Learning path to data science (Sep 2020)
- National-level Online Webinar on Cognitive Radio-Wireless Sensor Networks (Sep 2020)
- National-level Online Webinar on Latest Trends in Nanotechnology (Sep 2020)
- National level webinar on Fine Tuning Your Research Papers (May 2020)
- Webinar on How to be an effective Teacher (May 2020)
- Web Colloquium on Corona as Unwanted Companion (May 2020)
- Webinar on YouTube Management (Jun 2020)
- Webinar on Importance of Information Literacy Skills During Pandemic (May 2020)
- Webinar on Preparing and Publishing Scientific Manuscript (May 2020)
- International Webinar on Cyber Security in Online Education (May 2020)
- National-level Online Webinar on Modelling of Biomedical applications (Sep 2020)
- National level Online Webinar on National Educational Policy (Sep 2020)
- National level Online Webinar on E-Vehicle in India (Sep 2020)
- National-level Online Webinar on Scope Technology-Based Teaching (Sep 2020)
- Three days National Level webinar on Covid-19 & Indian Economy (Jun 2020)
- Online Technical E-Quiz on DBMS (Jul 2020, Scored 96%)
- National-level Online Webinar on ASIC Design Flow (Jan)
- 2-Days National Virtual Conference on Quality in Higher Education (Jan 2021)
- National-level Online Webinar on Transformation of Business operations (Oct 2020)
- National-level Online Webinar on Renewable Energy System (Oct 2020)
- National-level Online Webinar on Computing and Signal Processing in IOT (Oct 2020)

## Seminars, Workshops & Conferences
- National Science Day 2013 (Oxford College of Science, Bangalore)
- IT.BT International Conference on IoT (2012, Bangalore)
- One-day seminar on Cloud Computing (Sambhram Institutions, Bangalore, 2008)
- One-day seminar on Open systems (IBM and INTEL, Bangalore)
- Workshop on Artificial Intelligence (BVS, 2018, Bagalkot)
- International seminar on Microsoft Windows Embedded (Microsoft Corporation India)
- 3-day workshop on Electrical and Computer Science (CSI, 2009, Bangalore)
- International Conference on VLSI, Communication, Advanced Devices, Signals & Systems (2014, Allahabad)
- Workshop on Emerging Trends on Soft Computing (2014, Delhi)
- National Conference on Next Generation Networks-NCNGN 2013 (Allahabad)
- Workshop on Research Directions in Computer Science (Allahabad)
- Workshop on Cyber Security (BVS, 2018, Bagalkot)
- Workshop on Latex (Central University campus, 2013, Allahabad)
- Workshop on Computer Network Simulator (2013, Allahabad)
- Seminar on Big Data (BVS, 2017, Bagalkot)
- Seminar on Advances in operating Systems (A.I.T, 2007, Bangalore)
- State level one day seminar on Intellectual Property Rights (2020, Bagalkot)
- DST-SERB Sponsored National Conference on Smart Grid Technologies (Feb 2020)
- Workshop on 5G Network (BVS, 2018, Bagalkot)
- International Virtual Conference on Smart Advanced Material Science (Dec 2020)
- National Workshop on Innovative mechanisms & standards for Assuring Quality (Jan 2021)
- Workshop on Innovations in Electronics, Communication, Computing & Automation (Nov 2020)
- Seminar on AWS (Central University campus, 2013, Allahabad)
- One day Workshop on Research Methodology (BVS, 2019, Bagalkot)
- One day Workshop on Next-gen apps (BVS, 2017, Bagalkot)
- One day Workshop on Data Science (BVS, 2018, Bagalkot)
- One-day seminar on Blockchain Technology (BVS, 2019, Bagalkot)
- One day Workshop on Screenless Display (K L University, 2020, Vijayawada)
- One-day seminar on Li-Fi Technology (K L University, 2020, Vijayawada)
- One-day Seminar on Green Computing (K L University, 2020, Vijayawada)
- Artificial Intelligence Workshop (Apr 2024)
- Two-days seminar on Outcome based education (Godavari Global University, 2024)
- International Conference on AI & its Engineering Applications (Godavari Global University, Apr 2024)

## Invited Talks
- International Conference on Recent Advancements in Medicine and Medical Science – USA
- International Healthcare Simulation Conference – London, UK
- Innovative Future Research in Wireless Communication and Printing Technology – Portugal
- International Conference on Epidemiology and Public Health – Abu Dhabi, UAE
- 3rd World Congress on Cancer Biology and Immunology – Milan, Italy
- 2nd International Conference on Clinical and Medical Case Reports – Boston, USA
- Global Conference on Nursing and Healthcare Management – Valencia, Spain
- Global Biopolymers & Polymer Chemistry Congress – Las Vegas, USA
- International Conference on Artificial Intelligence – San Francisco, USA
- 7th International Congress & Expo on Bioscience and Biotechnology – Paris
- International Conference on Artificial Intelligence in Berlin – Germany
- 2nd International conference on Medical Sciences – Colorado, USA
- 4th World Congress on Cancer Biology and Immunology – Barcelona, Spain
- 3rd International Conference on Computer Science & Cloud Computing – Canada
- World Summit on Robotics – Dubai, UAE
- 10th World Congress on Healthcare Using Advanced Technologies – Toronto, Canada
- 2nd Global Summit and Expo on Robot Intelligence Technology and Applications
- Global Summit and Expo on Robot Intelligence Technology and Applications – Spain
- International Forum on Artificial Intelligence and Robotics – Las Vegas, USA
- 5th Inter. Conference on Future of Preventive Medicine & Public Health – UK
- 6th Edition of Advanced Chemistry World Congress – UK
- 7th Edition of Advanced Materials Science World Congress

## NPTEL Certifications
- Cloud Computing & Distributed Systems
- Software Engineering

## Microsoft, Cisco & Aviatrix Global Certifications
- Microsoft Certified Azure Fundamentals
- Microsoft Certified Azure AI Fundamental
- Microsoft Certified in Networking Fundamentals
- Microsoft Certified in Security Fundamentals
- Microsoft Certified in Mobility and Device Fundamentals
- Cisco Certified in Cyber Security Essentials
- Aviatrix Certified Engineer – Multi-Cloud Network Design

## MOOC Courses
- The Data Scientist's Toolbox
- Usable Security
- Machine Learning for All
- Cyber Security and the IoT
- Aviatrix Certified Engineer
- Cyber Security Essential
- AWS Certified Architect
- AWS for DevOps
- Data Science Engineering
- Microsoft Azure Technologies
- IoT and the Cloud
- Blockchain Essentials
- Prompt Engineering for all
- Microsoft System Configuration Manager
- Microsoft Azure Security Technologies
- CompTIA A+: Internet and Cloud
- Artificial Intelligence for Cybersecurity
- Artificial Intelligence for Project Managers
- IBM Cloud Essentials V3
- Data Science Foundation's: Data Engineering
- Ethereum: Building Block chain Decentralized Apps
- Linux System Engineer
- Cloud Platform for Developers

## Courses Taught
- UG: Cloud Computing, Software Engineering, Linux Shell and Shell Scripting, Big Data Analytics, Introduction to Data Science, Computer Network, Software Testing, Data Wrangling, Cyber Security, System Software
- PG: Digital Forensics, Computer Networks & Security

## Professional Profiles
TABLE:
Profile | Link
Google Scholar | https://scholar.google.co.in/citations?user=Ad0QaCEAAAAJ&hl=en
Vidwan | https://vidwan.inflibnet.ac.in/profile/367094
ORCID | https://orcid.org/my-orcid?orcid=0000-0002-0195-3976
Scopus | https://www.scopus.com/authid/detail.uri?authorId=57211543256


## Identifiers & Contact
- Email: drkashokcse@svecw.edu.in
- SVECW Emp ID: 500022
`;

const AI_HOD_TEXT = `
## Educational Qualifications
TABLE:
Degree | Field | Institution | Year
Ph.D. | Data Privacy, CS&SE | Andhra University | 2015
P.G (M.Tech / M.E) | IT | Andhra University | 2009
U.G (B.Tech / B.E) | IT | JNTU Hyderabad | 2007

## Fields of Specialization
- Data Privacy
- Machine Learning
- Deep Learning
- Natural Language Processing

## Research Scholars
- Ph.D. Awarded: 2
- Ph.D. Pursuing: 2

## Professional Affiliations
- ACM Membership
- IE Membership

## Certifications
- PG Diploma in Data Science from IIIT Bangalore, 2017-2018

## Publications
- "A Study of Privacy Attacks on Social Network Data," International Journal of Global Research in Computer Science, Volume 5(7):12-18, July 2014
- "PBLR: Priority Based Local Recoding Anonymization," International Journal of Computer Technology and Applications, Volume 5(3), pp. 1236-1243, May 2014
- "A Survey on Personal Privacy Preserving Data Publication in IoT," International Journal of Innovative Technology and Exploring Engineering, Issue-6C2, pp. 249-253, 2019
- "Handling emotional speech: a prosody based data augmentation technique," International Journal of Speech Technology, 25, 197-204 (2022)
- "Transfer Learning-based Optimal Feature Selection with DLCNN for Shrimp Recognition," International Journal of Intelligent Engineering & Systems, v. 15, n. 5, p. 91-102, 2022

## Conference Proceedings
- "Checking Anonymity Levels for Anonymized data," Seventh International Conference on Distributed Computing and Internet Technology, Springer-LNCS, Volume 6536/2011, pp.278-289, 2011
- "Attribute Based Anonymity for Preserving Privacy," First International Conference on Advances in Computing and Communications, Springer-CCIS 193, pp. 572-579, 2011
- "An Efficient and Dynamic Concept Hierarchy Generation for Data Anonymization," Ninth International Conference on Distributed Computing and Internet Technology, Springer-LNCS, Volume 7753/2013, pp. 488-499, 2013
- "SDNet: Integrated Unsupervised Learning with DLCNN for Shrimp Disease Detection," IEEE International Conference on Data Science and Information System (ICDSIS), 2022
- "Shrimp Surfacing Recognition System in the Pond Using Deep Computer Vision," Intelligent Computing and Applications, Springer, 2023
- "Sign Language Recognition for Needy People Using Machine Learning Model," Intelligent Computing and Applications, Springer, 2023
- "Detection of Retinal Degeneration via High-Resolution Fundus Images," International Conference on Electronics and Renewable Systems (ICEARS), 2023
- "Enhanced Deep Convolutional Neural Network for Identifying Silicon Wafer Faults," International Conference on Wireless Communications Signal Processing and Networking (WiSPNET), 2023
- "Detection of Leaf Black Sigatoka Disease in Enset Using CNN," Soft Computing and Signal Processing (ICSCSP 2023), Springer, 2024

## FDPs / Workshops / Seminars / Training Programs
Attended:
- Two days Online Master Class Training on Design Thinking, 02-01-2021 to 03-01-2021, Upgrade Rise
- Two days Online Training on Accelerated Data Science, 20-02-2021 to 21-02-2021, IIT Kharagpur & NVIDIA
- Two days Online Master Class on Intellectual Property, 15-06-2021 to 16-06-2021, BananaIP Counsels & NASSCOM
- One Week Online ATAL FDP on Data Science, 14-12-2020 to 18-12-2020, Amity Institute of Information Technology
- One Week Online ATAL FDP on Big Data Analytics, 25-01-2021 to 29-01-2021, Siddhartha Institute of Engineering & Technology
- Two Week Online ATAL FDP on Machine Learning for Computer Vision, 01-02-2021 to 12-02-2021, Electronics & ICT Academies
- One Week Online FDP on Introduction to Cyber Security & Penetration Testing, 09-03-2021 to 14-03-2021, Andhra University College of Engineering
- Two Week Online ATAL FDP on Social Robotics & AI, 28-06-2021 to 04-07-2021, Electronics & ICT Academies
- FDP on Essentials Of Statistical Analysis And Data Science with AWS Sagemaker, 18-10-2021 to 25-10-2021, Deep Tech Virtual Labs & AWS

Organized:
- Virtual expert talk on Software Development Standards, 17-07-2021, Speaker: Shameer Pulikkal (Microsoft)
- Expert talk on "Artificial Intelligence," 18-12-2021, Speaker: Prasanna Murthy Gurajapu (Honeywell)
- CODEFIESTA::2021 - National Level Online Quiz and Coding Competition, 15-09-2021, 77 participants
- Datathon 1.0 (36hrs collaborative Analytical Hackathon), 18-06-2022 to 19-06-2022, Industry expert: Snehith Allamraju (Envista Holdings Corporation)
- Webinar on "Dive into Opensource," 08-12-2022, Speakers: Vasanth Gopa (SAP Labs India) and Mani Kishan (Schlumberger)
- Two Days Online Bootcamp on Data Science Foundations, 5-6 April 2023, 200+ students, Sabudh Foundation
- Expert Talk on Competitive Market Landscape, 05-07-2023, Speaker: Supreet Kaur (Morgan Stanley)
- Statistical training program, 10-09-2023, Prof. R. Venkeswarulu (Andhra University)
- One day student contest on "Generating Diwali Greeting Cards using Generative AI," 26 October 2023, 300+ students, BVRITN collaboration
- Technova 2K24 - National Level Technical Symposium, 11-12 March 2024
- Session on Responsible and Safe AI, 22-03-2024, Dr. Punnarangam Kumaraguru (IIITH)

## NPTEL Courses Completed
- Introduction to programming in C (8 weeks), 91.5% score, Elite tag
- Programming, Data Structures and Algorithms using Python (8 weeks), 70% score, Elite tag


## Identifiers & Contact
- Email: hodai@svecw.edu.in
`;

const AI_SRICHARANI_TEXT = `
## Qualifications
TABLE:
Degree | Field | Institution | Year
Ph.D. | Statistical inference | ANU | 2021
P.G (M.Tech/M.E) | Statistics | Andhra University | 2005
U.G (B.Tech/B.E) | M.S. Computer applications | Kakatiya University | 2002

## Publications
- Statistical Framework For Enhancing Process Control And Reliability Using Autoencoders Random Survival Forests And NHPP Modeling, Reliability: Theory & Applications, 2025
- Enhanced Lung Cancer Detection via Modified U-Net and Deep Learning Classifiers, Lecture Notes in Networks and Systems, vol 1343, Springer, September 2025
- A Cutting-Edge System for Real-Time Detection and Prevention of Driver Fatigue using Computer Vision and Machine Learning, ZKG International, October 2024
- Intuitive Model Development and Data Preprocessing with Web and Command-Line Interfaces, Grenz Journal of Engineering and Technology, June 2024
- Statistical Perspectives in Machine Learning for Crop Recommendations, 4th International Conference on Intelligent Technologies (CONIT), August 2024
- Estimation of Reliability in Multi Component Stress Strength Based on Dagum Distribution, AIP Conference Proceedings, May 2023
- Variable control charts based on Dagum distribution, Research Journal of Mathematical and Statistical Sciences, Vol. 7(3), 2019
- Discriminating Between Dagum Distribution and Burr-III Distribution, International Journal of Scientific Research to Mathematical and Statistical Sciences, Volume 5, Issue 5, 2018
- Limited Failure Censored Life Test Sampling Plan In Dagum Distribution, American Journal of Applied Mathematics and Statistics, Vol. 5, No. 5, 2018
- Dagum Distribution - A Two Step Parametric Estimation, Journal Of Statistics Advance In Theory And Applications, Volume 20, No. 1, 2018
- Time Control Charts Through NHPP Base On Dagum Distribution, International Journal Of Analysis And Application, Volume 16, No. 3, 2018
- Extreme Value Charts And Analysis Of Means Based On Dagum Distribution, International Journal of Statistics and Applied Mathematics, Vol. 3, No. 2, 2018

## Conference Presentations
- "Smart Evaluation System for Subjective Answers Using NLP and Fuzzy Logic" (ICSSA 2025), Kuppam Engineering College, October 2025
- "An Innovative Deep Learning Framework for Identifying Skin Types and Condition" (ICSSA 2025), Kuppam Engineering College, October 2025
- "A Hybrid AI & Time Series Framework for Dynamic Pricing and Demand Prediction in E-Commerce" (ICMVRCET-2025), March 21-22, 2025
- "Statistical Perspectives in Machine Learning for Crop Recommendations", 4th International Conference on Intelligent Technologies (CONIT), IEEE, June 21-23, 2024
- "Intuitive Model Development and Data Preprocessing with Web and Command Line Interfaces", Second International Conference on Control System and Signal Processing (CSSP-2024), April 27-28, 2024
- "Time control charts through NHPP based on Frechett Distribution", International Conference on Knowledge Discoveries on Statistical Innovations and Recent Advances in Optimization, December 29-30, 2022
- "Two step estimation in dagum distribution", International Conference on Applied Science and Technology (ICAST-2018), January 24-25, 2018
- "Discriminating between Dagum distribution and Burr-III distribution", National Seminar on SQC, Reliability, Design of Experiments and Operations Research, February 23-24, 2017

## Achievements
- Excellence in Research Reviewer award
- Publications: 7
- Conferences: 1

## Research Profiles
TABLE:
Profile | ID
Google Scholar | 1VTIsIwAAAAJ
Scopus | 862c40903eb37c49f8d205dc0e364777
ORCID | 0000-0003-1036-9875

## NPTEL Courses
- Natural Language Processing, IITKGP (Elite), May 2025
- Data Mining, IITKGP (silver medal, Top-5), May 2025
- Introduction To Machine Learning, IITKGP (Top-5, silver medal), October 2024
- Machine Learning for Engineering and Science Applications (silver medal), IITM, April 2024
- Data Analytics Using Python (Gold medal, Topper 1), April 2024
- Data Science for Engineers (Topper 5), October 2023
- Essentials of Data Science with R Software (Gold medal, Topper 1), April 2023
- Descriptive Statistics with R Software (Gold medal), October 2022

## Certifications
- Six Sigma Advanced Analyze Phase, Kennesaw University, September 2020
- Six Sigma Advanced Define and Measure, Kennesaw University, July 2020
- Matrix Algebra For Engineers, The Hong Kong University of Science And Technology, April 2020
- Differential Equations for Engineers, The Hong Kong University of Science And Technology, April 2020
- Vector Calculus for Engineers, The Hong Kong University of Science And Technology, May 2020
- Matrix Methods, University of Minnesota Driven to Discover, May 2020
- Six Sigma Tools for Define And Measure, Kennesaw University, May 2020
- Six Sigma Tools for Analyze, Kennesaw University, May 2020
- Introduction to Ordinary Differential Equations, KAIST, May 2020
- Fundamentals of Scalable Data Science, IBM, May 2020
- Lecture Series for Preventing and Controlling COVID-19, May 2020
- Six Sigma and the Organization (Advanced), Kennesaw University, July 2020
- Six Sigma Principles, Kennesaw University, May 2020

## Workshops/STTP's/FDP's
- Faculty Development Programme on Natural Language Processing, IITKGP, NPTEL, May 2025
- Faculty Development Programme on Data Mining, IITKGP, NPTEL, May 2025
- Faculty Development Programme on Introduction To Machine Learning, IITKGP, NPTEL, October 2024
- Faculty Development Programme on Machine Learning for Engineering and Science Applications, IITM, NPTEL, April 2024
- Faculty Development Programme on Data Analytics Using Python, NPTEL, April 2024
- Faculty Development Programme on Data Science for Engineers, NPTEL, October 2023
- Faculty Development Programme on Essentials of Data Science with R Software, NPTEL, April 2023
- Faculty Development Programme on Descriptive Statistics with R Software, NPTEL, October 2022
- Six day online short term training program (STTP) "Integral Transforms and their Applications (ITTA-2020)", October 26-31, 2020
- One Week online FDP on "Outcome Based Education and Accreditation", ISTE Telangana Section, October 5-9, 2020
- Two day online FDP on "Effective Technical Report Writing using LATEX", MGIT, Hyderabad, June 8-9, 2020
- National Level One-week FDP on "RUBY & PERL PROGRAMMING", St. Peter's Engineering College, June 3-8, 2020
- Two day international Virtual FDP on "Innovative Techniques for Effective Teaching Online and Offline", MGIT, June 12-13, 2020
- Online workshop on "Social Responsibility and Community Engagement", CBIT, June 17, 2020
- Six days online FDP "Latest Trends and Challenging in IT Industry", R.M.D. Engineering College, June 15-20, 2020
- One week National Level Online Workshop on "Yoga - A Science of Breath and Meditation for Subtle Energy Channeling", July 6-10, 2020
- Two days Online Workshop on "Free and Open Source Alternative for Web Conferencing and Teaching Learning", July 15-16, 2020
- Energy Literacy Drive, Energy Swaraj Foundations, June 24, 2020
- "Moodle Learning Management System", JNTUH College of Engineering Sultanpur, June 10-15, 2020
- National Workshop on Statistical Computation With R, ANU Department of Statistics, February 22, 2017
- Workshop on Scientific Educational Practices, VEDIC, December 12-14, 2016
- Workshop on Multivariate Analysis through R-software, Gudlavalleru Engineering College, November 12-13, 2016
- Workshop on 'Real Time Engineering Applications of Mathematics (REAM-14)', Shri Vishnu Engineering College for Women, November 2014

## Professional Affiliations
- NAAC 6th Criteria Department Co-ordinator
- Workshops/FDPs/Conferences/Professional Development/Department Faculty Activities
- NBA Works
- GATE Classes


## Identifiers & Contact
- Email: cherani.yashu@svecw.edu.in
- SVECW ID: 730
- AICTE Registration ID: 1-1507894870
`;

const AI_DURGA_PRASAD_TEXT = `
## Qualifications
TABLE:
Degree | Field | Institution | Year
Ph.D. | Power Electronics | Karunya University | 2017
M.Tech (P.G) | Power Electronics | VIT University | 2008
B.Tech (U.G) | Electronics & Instrumentation Engineering | Pondicherry University | 2006

## Fields of Specialization
- Multilevel Inverters
- Machine Learning

## Patents
- Indian Design Patent: "An IOT Garbage Segregator & Bin Level Indicator Device" (Application #399499-001)
- Patent: "Implementation of identification system using Multilevel Converters for active filters" (Application #202341021299)
- Patent: "Smart Grids for localizing abnormal Conditions detection system and method" (Application #202341014287)

## Funded R&D Projects
- Completed Project (PI): "A Comprehensive Performance Analysis on Multicarrier PWM Based Hybrid Multilevel Inverter" under RPS Scheme, AQIS-AICTE (Reference: 1-4136736086)
- Completed Project (Co-PI): "Photovoltaic based Pumping system using multi-level inverter" for DST 2016 (Reference: 242016000523)

## Select Publications (Scopus Indexed)
- "A First-Time Study On Long-Term Performance Analysis Of Photovoltaic (PV) Plants at Bhimavaram" (2024)
- "An Analysis of power system fault Classifier using neural network" (2024)
- "Adaptive Solar Power Generation Forecasting using Enhanced Hybrid Function Networks with Weather Modulation" (2024)
- "Enhancing MANET security: A watch dog routing algorithm approach for intruder and black hole attack detection" (2024)
- "Enhancing Electrical Power Demand Prediction Using LSTM-Based Deep Learning Models for Local Energy Communities" (2024)
- "Effect of junction temperature on system level reliability of Grid connected PV inverter" (2023)
- "Implementation of Integer Factor based Space Vector PWM through Digital Approach for Grid Connected Multilevel Inverters" (2022)
- "Minimization of Power Loss in Newfangled Cascaded H-Bridge Multilevel Inverter using In-Phase Disposition PWM and Wavelet Transform Based Fault Diagnosis" (2018)

## Book Chapters
- "Teaching and Assessment of Course Outcomes in Switching Theory and Logic Design Course: A Case Study" (2020)
- "Technology in Engineering Pedagogy to Progress the Excellence of Teaching" (2020)
- "Performance of the Multicarrier Sinusoidal PWM based Multilevel Inverter with reduced power loss and fault diagnosis using Wavelets Transformation" (2018)

## Key Conference Papers (2023-2024)
- "A Comparative Analysis of Logistic Regression, Support Vector Machines, and Random Forest for Phishing Website Identification" (2024)
- "Comparative Study of Deep Learning Techniques for Detecting Tomato Plant Leaf Diseases Using Transfer Learning" (2024)
- "Comprehensive Analysis and Performance Investigation of Non-Isolated DC-DC Converters in Solar Photovoltaic Applications" (2024)
- "Modified Firefly Algorithm with Quasi-Oppositional Initialization for Selective Harmonic Elimination in Cascaded H-Bridge Multilevel Inverter" (2024)
- "Trash and Recycled Material Classification Revolutionized with Advanced Transfer Learning with Pre-trained Models" (2024)
- "Comparative Analysis of Regression Algorithms in Solar Power Production Forecasting" (2024)
- "Performance Analysis of Pre-Trained Deep Learning Architectures for Classification of Corn Leaf Diseases" (2023)
- "Absolute Sinewave Based Modulation Technique for Reduced Switch Multilevel Inverter for better Total Harmonic Distortion" (2023)

## Additional Conference Papers (2021-2023)
- "Service Restoration in Distribution System Using Breadth-First Search Technique" (2021)
- "Experimental Validation for A Nine-Switched 3-phase Multilevel Inverter (MLI) with a Photovoltaic (PV) Source" (2021)
- "Parameter Sensitivity Analysis for 3-Phi Synchronous Reluctance Motor: A Critical Evaluation" (2021)
- "Performance Analysis of Multi-level Inverter Using Phase Disposition with various Carrier Signal Arrangements" (2020)

## Earlier Conference Presentations (2018-2020)
- "Newfangled Multilevel Inverter fed V/f Controlled Induction Motor Drive with Multicarrier PWM Strategy" (2018)
- "Fault Diagnosis of the Newfangled Cascaded H-Bridge Multilevel Inverter" (2018)
- "Performance Analysis of cascaded Multilevel Inverter with Reduced Switched Topology" (2018)
- "State Estimation for Wound Rotor Induction Motor using Discrete-time Extended Kalman Filter" (2018)
- "A Jigsaw based and lab oriented teaching methodology to educate in Digital controller subject" (2018)
- "Generalized Cascaded Multi Level Inverter Using Reduced Number of Components with PV Systems" (2016)
- "Multilevel Inverter Fed 1-Phi Asynchronous Motor Based Water Pumping System" (2022)
- "Fish Feeding Boat using BLDC Motor for Aqua Applications" (2022)
- "SHE-PWM Low Cost Multi Level Inverter For PV Based Water Pumping Applications" (2021)

## Textbooks
- "Power Electronics" published by Scientific International Publishing House (SIPH), New Delhi (ISBN: 978-93-5757-269-9)

## Online Profiles
TABLE:
Profile | Link
Google Scholar | https://scholar.google.co.in/citations?user=tWFAhHAAAAAJ
Scopus | https://www.scopus.com/authid/detail.uri?authorId=57192238182
ORCID | https://orcid.org/0000-0002-6972-7801

## NPTEL Courses
- "A Twelve Week course on NBA Accreditation and Teaching - Learning in Engineering (NATE)" (Jan-April 2020)
- "A Four week course on Effective Engineering Teaching in Practice" (Jan-Feb 2020)

## International FDPs/Workshops Attended
- "Emerging Tools & Techniques in Machine Learning and Data Science" at Madanapalle Institute of Technology & Science (Feb 5-10, 2024)
- "AI Enabled AR/VR in Communications & Signal Processing Application" (Oct 3-7, 2023)
- "Recent Advancements In Electric Vehicle Technology" (July 24-28, 2023)
- "Research Methodology on Machine Learning and Data Science" at B V Raju Institute of Technology (July 10-14, 2023)
- "Data Analytics with Python" at IndiZeal Academy (June 7-16, 2023)
- "Scientific Communication E-Workshop for Researchers" at BMS College of Engineering (May 29-June 2, 2023)
- "Python for Electrical & Electronics Engineering" at Rajeev Gandhi Memorial College (March 27-31, 2023)
- "Research Information Management System" organized by Inflibnet Center (Feb 20-22, 2023)
- "Machine Learning for Data Science" organized by NIT Warangal (Nov 14-29, 2022)
- "Structured Query Language (SQL)" organized by Skill Nation (Aug 15-20, 2023)
- "Insights of Control Systems and Signal Processing: Theory to Practice" at Sasi Engineering College (July 2-6, 2020)
- "Introduction to PLECS tool for Power Electronics Applications" organized by VRSEC (July 2-6, 2020)
- "Recent Trends in Hybrid and Electric Vehicle Technologies" AICTE Sponsored Program (July 6-11, 2020)
- "Power Electronic Converters & It's Real Time Applications" at Sri Vasavi Engineering College (July 21-25, 2020)
- "Advanced Simulation Tools for Power Electronics, Electromagnetics and Power Systems" at Vignan's Institute (June 1-5, 2020)
- "Recent Trends in Electrical Engineering" at VIT Bhimavaram (June 8-12, 2020)
- "Artificial Intelligence, Machine Learning, Internet of Things & Big Data Applications in Power Electronics" (June 1-6, 2020)
- "Research Aspects in the development of Sustainable Energy Solutions" at Stella Marry's College (June 23-25, 2020)
- "AI, Machine Learning, Deep Learning and Automation Applications in Electrical Datasets: Theory and Hands on Practice" (July 5-10, 2020)
- "IUCEE Annual Leadership Summit" (July 10-12, 2020)
- "Faculty Hands on workshop on IoT" organized by VEDIC, Bangalore (Dec 13-15, 2019)
- "NAAC's New Framework for Accreditation and Assessment of HEIs: Opportunities & Challenges" at G. Narayanamma Institute (Sep 19-20, 2019)
- "Think Technology Transformation training" at VEDIC (July 19-21, 2018)
- "Management Development Program for Improved R&D" at TEQIP-II (Sep 19-23, 2016)
- "Implementation of space vector pulse width modulation for multi-level inverters using FPGA" at Osmania University (Oct 16-17, 2016)
- "Academic leadership program" at IIM Kozhikode (Nov 23-28, 2015)
- "Application of Optimization Techniques to Electrical Systems" at SVECW (Sep 7-12, 2015)
- "FPGA based control of Permanent Magnet & Reluctance Motors for Energy Efficient Industrial Drives" at PSG College (Aug 6-8, 2015)
- "Outcome Based Education" at BMS College of Engineering
- "Knowledge Management, Memory Training, Mechatronics, Robotics and Automation" at SVECW (Feb 18-28, 2015)
- "Role of Power Electronics Converters for Renewable Energy Sources" at Karunya University (Aug 7-8, 2014)
- "IPR and Patents" at SVECW (Oct 25, 2014)
- "Research Challenges in Solar Photovoltaic Technologies" at Karunya University (Aug 2-3, 2013)
- "Research Challenges of Renewable Energy in Smart Grid" at Karunya University (Sep 13-14, 2012)
- "Outcome based Emerging Education" at Vignan University (Jan 28, 2012)

## Certifications
- Java Test: Spoken Tutorial Project, IIT Bombay (Nov 9, 2023) - Score: 85%
- Python Essentials Course: Cisco Networking Academy (July 17, 2023)
- "Inculcating Universal Human Values in Technical Education" online workshop (July 12-16, 2021)
- "Online Teaching" course from IUCEE (July 27-Sep 4, 2020) - Score: 91%
- "Foundations of Teaching for learning: Curriculum" via Coursera (Jan 2020)
- "New Learning: Principles and Patterns of Pedagogy" via Coursera (June 2020)
- "Digital Transformation in Teaching Learning Process" TEQIP sponsored (March 16-30, 2020)
- Webinar on Metacognitive Hybrid Learning Model using ICT tools (Oct 30, 2019)

## Administrative Roles/Responsibilities
- Coordinator - Ministries of Education Innovation Cell (MIC)
- Coordinator - i-Stem portal maintenance
- Coordinator - NIRF Criteria-II
- Coordinator - NAAC Criteria III under New Framework
- Coordinator - IRINS Nodal Officer
- Coordinator - Institutional Research & Development Center
- Coordinator - Azadi Ka Amrit Mahotsav (2022-23)
- IEEE - CIS Student Branch Advisor

## Achievements
- Best Paper Award


## Identifiers & Contact
- Email: durgaprasad_garapati@svecw.edu.in
- SVECW ID: 227
- AICTE Registration ID: 1-2379813184
`;

const AI_MADHAVI_THOTAKURA_TEXT = `
## Qualifications
TABLE:
Degree | Field | Institution | Year
Ph.D. | ML | ANU | Pursuing
M.Tech (P.G) | CSE | JNTUH | 2012
MCA (P.G) | MCA | AU | 2010

## Fields of Specialization
- DS, ML

## Research Profiles
TABLE:
Profile | ID
Google Scholar | I8YjYOkAAAAJ
Scopus | 57782306700
ORCID | 0000-0002-4596-7376

## Achievements
- Publications: 3
- Conferences: 3
- NPTEL Courses: 1
- FDPs / Workshops / Seminars / Training Programs Attended: 10
- Certifications: 1

## Roles and Responsibilities
- NAAC Criteria-1 Department Coordinator
- Time Table Coordinator
- ACM-W Student chapter - Faculty Coordinator
- GATE Club Department coordinator
- ECAP Coordinator
- Vishnu LMS Department Coordinator


## Identifiers & Contact
- Email: madhavitv@svecw.edu.in
- SVECW ID: 608
- AICTE Registration ID: 1-761755827
`;

const AI_PRAVEEN_KUMAR_NALLI_TEXT = `
## Education
TABLE:
Degree | Field | Institution | Year
Ph.D. | Pursuing | Andhra University | Pursuing
M.Tech | Power Electronics & Industrial Drives | Satyabhama University | 2006
B.Tech | Electrical & Electronics Engineering | Andhra University | 2001

## Fields of Specialization
- Interval Arithmetics & Affine Arithmetic for Large Order Systems
- Machine Learning

## Patents
- Indian Design Patent: "An IOT Garbage Segregator & Bin Level Indicator Device" (Application number 399499-001)

## Recent Publications
- Area and Power Efficient Least Mean Square Adaptive Filter Using Approximate Arithmetic (2024)
- Machine Learning Algorithms for Erythemato-Squamous Disease Classification (2024)
- Comparative Study of Deep Learning Techniques for Detecting Tomato Plant Leaf Diseases (2024)
- Evaluation of Machine Learning Classifiers in Identifying Erythemato-Squamous Diseases (2024)
- Performance Analysis of Pre-Trained Deep Learning Architectures for Corn Leaf Disease Classification (2023)
- Analysis and Appropriate Choice of Power Converters for Electric Vehicle Charging Infrastructure (2022)
- Design of Exponentially Weighted Median Filter Cascaded with Adaptive Median Filter (2021)
- SHE-PWM Low Cost Multi Level Inverter For PV Based Water Pumping Applications (2021)
- Service Restoration in Distribution System Using Breadth-First Search Technique (2021)
- Experimental Validation for A Nine-Switched 3-phase Multilevel Inverter with PV Source (2021)
- Designing Lithium-Ion Battery Pack Rechargeable on Hybrid System with BMS (2020)
- Newfangled Multilevel Inverter Fed V/f Controlled Induction Motor Drive (2018)
- Fault Diagnosis of Cascaded H-Bridge Multilevel Inverter (2018)
- Performance Analysis of Cascaded Multilevel Inverter with Reduced Switched Topology (2018)
- Fish Feeding Boat using BLDC Motor for Aqua Applications (2022)

## Scholar IDs
TABLE:
Profile | Link
Google Scholar | https://scholar.google.co.in/citations?user=LZRPlsgAAAAJ
Scopus | https://www.scopus.com/authid/detail.uri?authorId=57208795960
ORCID | https://orcid.org/0000-0002-7443-7841

## Faculty Development Programs & Workshops
- Twelve Week NBA Accreditation and Teaching-Learning in Engineering (NPTEL, Jan-Apr 2020)
- Four Week Effective Engineering Teaching in Practice (NPTEL, Jan-Feb 2020)
- One Week International FDP on Emerging Tools & Techniques in ML and Data Science (Feb 5-10, 2024)
- FDP on Introduction to Machine Learning (IIT Kharagpur, NPTEL-AICTE)
- One Week FDP on AI & ML Applications to EVs and Electrical Engineering (Mar 11-16, 2024)
- Three Week Online Training on Java Full Stack (Jun 26-Jul 14, 2023)
- Five Day FDP on Research Methodology in ML and Data Science (Jul 10-14, 2023)
- 30 Hour Online Course on Data Analytics with Python (Jun 7-16, 2023)
- AICTE ATAL One Week FDP on Electric Vehicles (Nov 16-20, 2020)
- One Week National Online FDP on Online Teaching-Learning Using ICT Tools (Jun 8-13, 2020)
- Online Quiz on Science and Nature Quest (Jun 22-27, 2020, scored 60%)
- Webinar on Tools for Making Your Thesis Complete (Jun 7, 2020)
- Three Day Technical Webinar Series on Recent Trends in EEE (Jun 1-3, 2020)
- Five Day FDP on Recent Trends in Electrical & Electronics Engineering (Jun 8-12, 2020)
- Five Day FDP on Renewable Energy Systems (Jun 8-12, 2020)
- Two Week Course on Digital Transformation in Teaching Learning (Mar 16-30, 2020)
- Two Day e-FDP on Virtual Teaching-Learning MOODLE (May 29-30, 2020)
- One Week National Online FDP on Innovations to Academicians (May 11-16, 2020)
- Two Week Online FDP on Research Opportunities in Electrical Engineering (May 7-16, 2020)

## Certifications
- NPTEL certification on Introduction to Machine Learning (78%, Elite-Silver)
- NPTEL certification on Operating Systems Fundamentals (69%)
- Five Day Online Workshop on Inculcating Universal Human Values (Jul 12-16, 2021)
- Three Week Java Full Stack Training (78%, recognized as mentor)

## Roles and Responsibilities
- Coordinator - NAAC Criteria I under New Framework (SVECW)
- Department Level Web Master (SVECW)


## Identifiers & Contact
- Email: Praveenkumar.nalli@svecw.edu.in
- SVECW ID: 232
`;

const AI_PRIYA_MADDIPATI_TEXT = `
## Educational Qualifications
TABLE:
Degree | Field | Institution | Year
P.G (M.Tech / M.E) | Computer Science Engineering | JNTUK University | 2014
P.G (MCA) | Computer Science Applications | Osmania University | 2008
U.G (BSc) | Computer Science | Andhra University | 2005

## Fields of Specialization
- Machine Learning

## Academic Profiles
TABLE:
Profile | Link
Google Scholar | https://scholar.google.co.in/citations?user=lXDYWMgAAAAJ
ORCID | https://orcid.org/0009-0009-6691-2321

## Research Publications
- "Performance Analysis of Machine Learning Techniques for Multi-Organ Cancer Detection and Classification: A Comparative Study," 2023 International Conference on Emerging Research in Computational Science (ICERCS), Coimbatore, India, 2023, pp. 1-7

## Certifications
- Completed 12 Weeks Course on Operating Systems
- "Practice with ReFramework (v2020.10)" - UiPath Academy
- "RPA Developer Advanced (v2020.10)" - UiPath Academy
- "RPA Developer Foundation" - UiPath Academy

## Roles and Responsibilities
- Department NAAC Criteria II Coordinator
- Department Monthly Report Coordinator


## Identifiers & Contact
- Email: mlvapriyaai@svecw.edu.in
- SVECW ID: 5411
- AICTE Registration ID: 1-9507869972
`;

const AI_JANAKI_SIVA_RAMA_RAJU_TEXT = `
## Qualifications
- P.G (M.Tech): Computer Science & Engineering, JNTU Hyderabad, 2015

## Fields of Specialization
- Windows Internals
- Software Project Management
- Software Testing


## Identifiers & Contact
- Email: kjsrrajuai@svecw.edu.in
- SVECW ID: 5403
`;

const AI_CH_SRAVANI_TEXT = `
## Educational Qualifications
- Postgraduate: B.Tech (Computer Science & Engineering), JNTUK, 09-2019
- Undergraduate: B.Tech (Computer Science & Engineering), JNTUK, 05-2017


## Identifiers & Contact
- Email: chsravaniai@svecw.edu.in
`;

const AI_P_ARCHANA_TEXT = `
## Educational Qualifications
- P.G (M.Tech): Computer Science & Engineering, Swarnandhra Engineering College, 2012
- U.G (MCA): V.R. Siddhartha Engineering College, Acharya Nagarjuna University

## Professional Experience
- Teaching Experience: 7 Years

## Areas of Specialization
- Windows Internals
- Software Project Management
- Software Testing


## Identifiers & Contact
- SVECW ID: 597
- AICTE Registration ID: 1-7492315069
`;

const AI_K_RAJA_SEKHAR_TEXT = `
## Educational Qualifications
- Ph.D. in ML, Vel Tech Rangarajan Dr. Sagunthala R&D Institute of Science and Technology (Pursuing)
- M.Tech. CSE, JNTUK, 2017
- M.Sc. IT, NU, 2010
- B.Sc. MPE, AU, 2000

## Professional Background
- Teaching Experience: 7+ years

## Areas of Specialization
- Programming
- Web Technologies
- Machine Learning

## Notable Achievements
- HackerRank 4-star rating
- Sports recognition: Represented AU in five All India Inter University long-run events; earned AU gold medals in 5KM, 10KM, and 20KM races

## Patent
- "Artificial Intelligence and Machine Learning based Detection and prevention of Malarial Parasites in Blood using CNN-Deep Learning Algorithms for Health care Management Systems"

## Publications
- "An Efficient Lung Cancer Detection Model using Convnets and Residual Neural Networks" presented at IEEE's 2024 Fourth International Conference on Advances in Electrical, Computing, Communications and Sustainable Technologies (ICAECT 2024)

## Professional Certifications
- NPTEL Programming in Java certification
- JNCIA-Cloud Educator Training Certificate (Juniper Networks)
- Oracle Academy Java Programming certification
- C Advanced/Expert Online Test certification (jobtest.com)
- TechGig C language certification (2017)
- Google India challenge scholarship from Udacity (2018)
- Cisco Networking Academy: IT Essentials, Cyber Security Learn-A-Thon, Cyber security Essentials

## Faculty Development Programs & Workshops
- FDP on Software Testing Automation with Selenium (27 Nov-1 Dec 2023)
- 12-week NPTEL Programming in Java course (2023)
- 21-day Data Science Master Class and Coordinator role (Pantech E-Learning, Nov-Dec 2023)
- Deep Learning Master Class participation and Coordinator role (Pantech E-Learning, 28 Sep-18 Oct 2023)
- Webinar: "Filing National and International Patents" (MHRD Innovations Cell, 06-08-2022)
- One-week FDP on Machine Learning & Deep Learning using Python (MET Institute)
- Webinar: "Identifying Real Time Societal Problems for Research" (MHRD Innovations Cell, 30-7-22)

## Institutional Roles & Responsibilities
- NAAC Criteria 7 Coordinator (department level)
- AI Department III-Year Internship Coordinator
- AI Department IDEA LAB Coordinator
- AI Department JnanaBhumi Coordinator
- Class teacher and student counselor


## Identifiers & Contact
- Email: krajasekharai@svecw.edu.in
- SVECW ID: 596
`;

const AI_P_VINOD_BABU_TEXT = `
## Educational Qualifications
- Ph.D.: Soft Computing, ANUCE, Acharya Nagarjuna University (Pursuing)
- M.Tech: Computer Science & Technology, Andhra University (2008)
- B.Tech: Computer Science and Engineering, JNTUH (2006)

## Professional Experience
- Teaching Experience: 16 years
- Research Experience: 9 years

## Areas of Specialization
- Soft Computing, Deep Learning, Machine Learning and Artificial Intelligence

## Key Achievements
- UGC-NET qualified (June 2012)
- GATE 2006 qualified
- Ratified Faculty: Andhra University and JNTU Kakinada
- Reviewer for IEEE Transactions on Games and International Journal of Computer Theory and Engineering

## Notable Publications
Mr. Babu has authored 13 publications including peer-reviewed journal articles and three books on Deep Learning, Machine Learning, and Computer Vision, with work indexed in Google Scholar, Scopus, and other academic databases.

## Research Identifiers
TABLE:
Profile | Link
Google Scholar | https://scholar.google.com/citations?hl=en&user=ywbgPJoAAAAJ
Scopus ID | 57222982856
ORCID | https://orcid.org/0000-0003-0875-8847
Web of Science ID | HRB-6612-2023


## Identifiers & Contact
- Email: vinodbabup.ai@svecw.edu.in
- SVECW ID: 5418
- AICTE Registration ID: 1-7527847642
`;

const AI_K_SWETHA_TEXT = `
## Educational Qualifications
- M.Tech (CSE): Shri Vishnu Engineering College for Women, JNTUK, 2024
- B.Tech (CSE): Godavari Institute of Engineering & Technology, JNTUK, 2014

## Professional Experience
- Teaching Experience: 7 Months
- Research Experience: Nil

## Areas of Specialization
- Machine Learning


## Identifiers & Contact
- Email: kswethai@svecw.edu.in
- SVECW ID: 5426
`;

const AI_PAVAN_KUMAR_HOTA_TEXT = `
## Educational Qualifications
- Ph.D.: Machine Learning, Annamalai University, 2024
- M.Tech (CSE): JNTUK, 2013
- B.Tech (CSE): Andhra University, 2009

## Experience
- Teaching Experience: 8 years
- Research Experience: 5 years

## Fields of Specialization
- Machine Learning
- Educational Data Mining
- Educational Psychology & Cognitive Science

## Key Achievements
- Session Chair for IEEE Conference: "2nd International Conference on Signal Processing, Communication, Power, Embedded Systems (SCOPES-2024)"
- Patent Published: "Cognitive Profiling system for enhancing placement opportunities in Higher Education"
- Received appreciation for "Outstanding Teaching Practices" from VEDIC

## Scholar IDs
TABLE:
Profile | ID
Google Scholar | XsUwwCUAAAAJ
Scopus | 57991619700
ORCID | 0000-0002-7246-5443

## Current Roles and Responsibilities
- Subject Handler for Natural Language Processing
- Data Visualization, Data Warehousing & Data Mining (Theory)
- Advance SQL & Data Mining Lab (AI&ML II year II Semester)
- Placement Coordinator


## Identifiers & Contact
- Email: hotapavankumar@svecw.edu.in
- SVECW ID: 1225
- AICTE Registration ID: 1-43363004758
`;

const AI_R_SARADA_TEXT = `
## Education
- M.Tech: JNTUK, 2012
- MCA: Acharya Nagarjuna University
- B.Sc. Computers: Nagarjuna University, 2002

## Professional Experience
- Teaching Experience: 13 years

## Research Interests
- Field of Specialization: Mobile Computing


## Identifiers & Contact
- Email: rsarada.ai@svecw.edu.in
- SVECW ID: 5421
- AICTE Registration ID: 1-44421218891
`;

const AI_G_KALYANI_TEXT = `
## Educational Qualifications
- M.Tech in Computer Science & Engineering, D.N.R Engineering College, 2020
- M.Tech in Computer Science and Engineering, JNTUK
- B.Tech in Information Technology, Andhra University

## Professional Experience
- 3 years of teaching experience

## Specialization Areas
- Windows Internals
- Software Project Management
- Software Testing


## Identifiers & Contact
- Email: gkalyaniai@svecw.edu.in
- SVECW ID: 5422
`;

const AI_YANDAMURI_GAYATRI_TEXT = `
## Education
- M.Tech in CST (2021)
- B.Tech in CSE (2015)


## Identifiers & Contact
- Email: ygayatriai@svecw.edu.in
- SVECW ID: 5423
`;

const AI_K_SRIKANTH_TEXT = `
## Educational Qualifications
- M.Tech: Power Systems & Automation, Acharya Nagarjuna University, 2008
- B.Tech: B.E, S R K R Engineering College, Acharya Nagarjuna University, 2006

## Areas of Specialization
- Data Science, Machine Learning

## Publications
- "Combined Economic and Emission Dispatch using Particle Swarm Optimization Method" - Srikanth, K; Reddy, Ch VVS Bhaskara; Murthy, KS Linga, presented at 95th Indian Science Congress
- "Modified TLBO technique for economic dispatch problem" - Valluru, Hari Vamsi; Khandavilli, Srikanth; Sela, NVSK Chaitanya; rao Thota, Purnachnadra; Muktevi, LN Vital; 2018 Second International Conference on Intelligent Computing and Control Systems (ICICCS)
- "Emission Constrained Optimal power flow using Binary and real coded genetic algorithms" - Murthy, KS Linga; Rao, K Malleswara; Srikanth, K; Journal of the Institution of Engineers (India)
- "Particle swarm optimization technique for dynamic economic dispatch" - Srikanth, K; HariVamsi; International Journal of Research in Engineering and Technology
- "Emission Constrained Economic Dispatch considering Valve Point Effects" - Srikanth, K; S Linga Murty; National Conference on Power Systems Today - 2010, Andhra University College of Engineering, Visakhapatnam

## Research Scholar IDs
- Google Scholar ID: vvJGAv4AAAAJ


## Identifiers & Contact
- Email: ksrikanthai@svecw.edu.in
- SVECW ID: 5428
`;

const AI_VEERENDRA_BETHINEEDI_TEXT = `
## Experience Summary
- Teaching Experience: 12 Years
- Research Experience: 5 Years
- Industry Experience: 1 Year

## Education Qualifications
- Ph.D: Deep Learning, GITAM (Pursuing)
- M.Tech: Computer Science & Engineering, JNTU Kakinada, 2013
- B.Tech: Computer Science & Engineering, JNTU Hyderabad, 2011

## Fields of Specialization
- Deep Learning, Machine Learning, Database Management Systems, Automata Theory, Cyber Security

## Research Identifiers
TABLE:
Profile | Link
Google Scholar | https://scholar.google.com/citations?user=qdwZcGcAAAAJ&hl=en
Scopus | https://www.scopus.com/authid/detail.uri?authorId=58637451100
ORCID | https://orcid.org/my-orcid?orcid=0009-0005-7302-2029
ResearchGate | https://www.researchgate.net/profile/VeerendraBethineedi

## Key Credentials
Mr. Bethineedi holds 14 published research articles across journals like IJRAR and Journal of Engineering Sciences, attended 13+ faculty development programs, and completed NPTEL/SWAYAM courses in research methodology and ethics, plus multiple Coursera certifications in programming and cloud technologies.


## Identifiers & Contact
- Email: bveerendraai@svecw.edu.in
- SVECW ID: 5429
`;

const AI_DVH_VENU_KUMAR_TEXT = `
## Experience
- Teaching Experience: 12 Years
- Research Experience: 5 Years
- Industry Experience: None

## Education Qualifications
- Ph.D.: Specialized in SNA and ML, Andhra University (Thesis Submitted)
- M.Tech: Computer Science and Engineering, JNTUK, 2012
- MCA: Andhra University, 2008

## Fields of Specialization
- Cloud Computing, DBMS, Machine Learning, Data Warehouse

## Certifications
- Java Wipro Certified Faculty & Java Trainer Certificate (January 2025)

## Roles and Responsibilities
- Member of Timetable Committee (Department Level)
- Member of Sports Committee (Department Level)
- AMRITA University Virtual Labs Nodal Center Co-Ordinator in GIST, Nellore
- R&D Co-ordinator of the department
- Placement Coordinator of the department

## Research Scholar IDs
- Google Scholar: BPpkk8AAAAAJ
- ORCID: 0009-0004-2425-7748


## Identifiers & Contact
- Email: dvhvenukumarai@svecw.edu.in
- SVECW ID: 5431
`;

const AI_S_VENKATA_RAO_TEXT = `
## Experience
- Teaching Experience: 12 Years
- Research Experience: 5 Years
- Industry Experience: Nil

## Education Qualifications
- Ph.D.: Specialized in Social Network Analysis and Machine Learning, Andhra University, Thesis Submitted
- M.Tech: Computer Science and Engineering, JNTUK, 2012
- MCA: Andhra University, 2008

## Fields of Specialization
- Social Network Analysis, Machine Learning

## Publications
- "Efficient Algorithms for Fuzzy Centrality Measures in Large Scale Social Networks," Journal of Cybersecurity and Information Management, Volume 16(1), 2025 [SCOPUS Indexed]
- Indian Patent: "Method and System for identifying influential nodes in directed weighted networks using Pythagorean fuzzy sets," April 2024, Application Number: 202441030370
- "Identifying Influential Nodes in Directed Weighted Networks Using Pythagorean Fuzzy Sets," Journal of Theoretical and Applied Information Technology, 102(1), pages 374-385 [SCOPUS Indexed]
- "Effective Utilization Technique for Simplified Navigation through Website Structure Improvement," International Journal of Advanced and Innovative Research, 2(12), pages 471-477 [SCOPUS Indexed]
- "A Dynamic Approach to Multicast Communications using Decentralized Key Management," International Journal of Engineering Inventions, 1(3), pages 27-31 [ESCI - Web of Science]
- "Secured Communication Protocol via Encrypted Key Ensuring Message Integrity," International Journal of Science and Advanced Technology, 2(2), pages 103-107
- "5G Software Modem Using Quantum Cryptography," International Conference on Nanotechnology and Biosensors (ICNB-2)

## Professional Development Programs
Workshops/Seminars/Training:
- International Workshop on Deep Learning (five-day program), BITS
- "Next Generation Computing Technologies and their Role on Nation Development," National Conference by AICTE
- AICTE-sponsored Faculty Development Program on 'NextGen AI & ML,' NSRIT
- AICTE Sponsored FDP on "Artificial Intelligence," ATAL-IIT Roper
- AICTE Sponsored FTP on "Machine Learning Technology," IIT Guwahati
- AICTE Sponsored FDP on "Block Chain Technology," NIT-NAGALAND
- AICTE Sponsored FDP on "Data Sciences," ATAL-TIT Tripura

## Certifications
- Certified Intern, Virtusa Pvt. Ltd., 30/06/2020


## Identifiers & Contact
- Email: svenkatai@svecw.edu.in
- SVECW ID: 5431
`;

const AI_SINDHUJA_TEXT = `
## Educational Qualifications
- Postgraduate: M.Tech in Computer Science & Engineering, Shri Vishnu Engineering for Women, 2025
- Undergraduate: B.Tech in Electronics & Communication Engineering, Vishnu Institute of Technology, 2023

## Experience
- Teaching Experience: 10 Months
- Research Experience: None
- Industry Experience: None

## Fields of Specialization
- Machine Learning, Deep Learning, Artificial Intelligence

## Publications
- "Efficient Algorithms for Fuzzy Centrality Measures in Large Scale Social Networks" (SCOPUS-indexed)
- "Identifying Influential Nodes in Directed Weighted Networks Using Pythagorean Fuzzy Sets" (SCOPUS-indexed)

## Patents
- Indian Patent filed April 2024 (Application Number: 202441030370) regarding influential node identification in directed weighted networks

## Professional Development
- Five-day International Workshop on Deep Learning
- AICTE-sponsored Faculty Development Programs covering NextGen AI & ML, Machine Learning Technology, Blockchain Technology, and Data Sciences

## Current Role
- C & DS Department Coordinator

## Research Identifiers
TABLE:
Profile | Link
Google Scholar | https://scholar.google.com/citations?user=L3L1CDUAAAAJ&hl=en
ORCID | 0009-0005-8498-897X


## Identifiers & Contact
- Email: gsindhujaai@svecw.edu.in
- SVECW ID: 5433
`;

const AI_R_DAVENCY_PRIYANKA_TEXT = `
## Professional Experience
- Teaching Experience: 6 Months
- Research Experience: None
- Industry Experience: None

## Educational Qualifications
- Master's Degree (M.Tech): Computer Science & Engineering, Sir C R Reddy College of Engineering, Completed 2025
- Bachelor's Degree (B.Tech): Computer Science & Engineering, Sir C R Reddy College of Engineering, Completed 2022

## Areas of Specialization
- Machine Learning, Python

## Professional Development
Workshops/Training Attended:
- Juniper Mist-AI (AICTE - ATAL)

Committee Roles:
- Acting Committee Member for NAAC

## Research Identifiers
- Google Scholar ID: https://scholar.google.com/citations?user=vZm3WcgAAAAJ&hl=en&authuser=3


## Identifiers & Contact
- Email: rdpriyankaai@svecw.edu.in
- SVECW ID: 5434
`;

const AI_KALIDINDI_SOMARAJU_TEXT = `
## Experience Summary
- Teaching Experience: 4.8 Years
- Research Experience: Nil
- Industry Experience: 4.1 Years

## Educational Qualifications
- Postgraduate: M.Tech in Computer Science & Engineering, AIMS Engineering College, 2015
- Undergraduate: B.Tech in Computer Science & Engineering, BVC Engineering College, 2005

## Areas of Expertise
- Machine Learning and Data Visualization

## Professional Development
Workshops/Training Attended:
- Emerging Trends and Challenges in Cyber Security
- Juniper MIST AI

## Current Role
- Data Analytic Lab Incharge

## Research Identifiers
- ORCID ID: 0009-0000-1880-4953


## Identifiers & Contact
- Email: ksrajuai@svecw.edu.in
- SVECW ID: 5435
`;

const AI_HARSHAVARDHAN_TEXT = `
## Experience Summary
- Teaching Experience: 5 Months
- Research Experience: Nil
- Industry Experience: Nil

## Education
- P.G (INT M.Tech): Vellore Institute of Technology

## Specialization
- Project Management, Software Testing

## Training & Development
- Certifications: Java Spring Boot

## Current Role
- Placement Coordinator


## Identifiers & Contact
- Email: tharshaai@svecw.edu.in
- SVECW ID: 5436
`;

const AI_JULURI_PRADEEP_TEXT = `
## Experience Summary
- Teaching Experience: 8 Months
- Research Experience: Nil
- Industry Experience: 19 Years 7 Months

## Education Qualifications
- U.G (B.Tech): Electrical & Electronics Engineering, S.R.K.R Engineering College, 2006

## Fields of Specialization
- Full Stack Development
- Java
- J2EE
- Struts
- Cloud Computing
- SQL/NoSQL
- Web Architecture
- Spring
- Node.js
- CI/CD
- Docker
- HTTP Rest

## FDPs/Workshops/Seminars/Training Programs Attended
- "A Systematic Way of Research Paper Writing"
- "Java Demystified" (5 days Faculty Development Program)

## Certifications
- SCJP
- FSD
- Cloud Security and DevSecOps Automation (SANS)


## Identifiers & Contact
- Email: jpradeepai@svecw.edu.in
- SVECW ID: 5437
`;

const AI_MHR_NALINI_TEXT = `
## Experience Summary
- Teaching Experience: 2.6 Years
- Research Experience: 8 Months
- Industry Experience: None

## Education Qualifications
- Postgraduate: M.Tech in Computer Science & Technology, Sir C R Reddy College of Engineering, 2025
- Undergraduate: B.Tech in Computer Science & Engineering, Sir C R Reddy College of Engineering, 2023

## Fields of Specialization
- Machine Learning
- Deep Learning
- Artificial Intelligence

## FDPs/Workshops/Seminars/Training Programs Attended
- "A Systematic Way of Research Paper Writing, Java Demystified" - 5-day Faculty Development Program

## Current Role and Responsibilities
- Placement Coordinator


## Identifiers & Contact
- Email: mhrnaliniai@svecw.edu.in
- SVECW ID: 5438
`;

const AI_N_ANUSHA_TEXT = `
## Educational Qualifications
- Postgraduate: M.Tech - CSE, Eluru College of Engineering, JNTUK, 2017
- Undergraduate: B.Tech - IT, Vasireddy Venkatadri Institute of Technology, JNTUK, 2011

## Professional Experience
- Teaching Experience: 7 Months
- Research Experience: Nil

## Fields of Specialization
- Deep Learning
- Machine Learning and Artificial Intelligence

## Publications
- "An Optimized Model to Create Teams in Fantasy Cricket" (SSRN Electronic Journal, May 2021)
- "Prediction of Pneumonia using deep learning" (International Journal of Advance Research, April 2019)
- "Detecting Bots inside a Host using Network Behavior Analysis" (International Journal of Computer Applications, June 2018)
- Multiple books published through LAP LAMBERT Academic Publishing on deep learning, machine learning, and computer vision

## Training & Development Programs Attended
- AR/VR Training (November 2024)
- Data Science with Python certification (Elite 67%)
- Data Science and its applications (May 2022, NIT Warangal/GITAM)
- Webinar on Randomization Based Deep Learning (March 2022)
- Universal Human Values in Technical Education (February-March 2022)
- Cricket Analytics using Python (February 2022)
- Publishing Scientific Papers workshop (October 2021)
- Data Science & Analytics Using Python (November-December 2020)
- Cloud Technology training (November 2020)
- IEEE Virtual Authorship Workshop (October 2020)
- Python with Machine Learning Workshop (November 2019)
- NPTEL Workshop (December 2018)
- Internet of Things FDP (June 2018)
- Machine Learning training (December 2017)
- Soft Computing & Optimization Techniques (October 2017)
- Instructional Design and Delivery Systems (June 2015)

## Certifications
- Data Science With Python
- Universal Human Values (UHV)

## Roles and Responsibilities
- Department LMS coordinator
- NAAC criteria 2 coordinator
- Placement coordinator


## Identifiers & Contact
- Email: sanushaai@svecw.edu.in
- SVECW ID: 5424
`;

const AI_DEEPAK_PHANI_KRISHNA_TEXT = `
## Experience
- Teaching Experience: 3 Months
- Research Experience: Nil
- Industry Experience: Nil

## Education Qualifications
- Postgraduate: M.Tech in Computer Science Engineering, KL University (2026)
- Undergraduate: B.Tech in Computer Science & Engineering, RMK College of Engineering and Technology (2023)

## Fields of Specialization
- DevOps
- AWS Services
- Cyber Security Tools


## Identifiers & Contact
- Email: pdpkrishnaai@svecw.edu.in
- SVECW ID: 5439
`;

const AI_J_SAI_DIVYA_TEXT = `
## Experience
- Teaching Experience: 2 Years
- Research Experience: Nil
- Industry Experience: Nil

## Education Qualifications
- P.G (M.Tech): Computer Science & Technology, Shri Vishnu Engineering College for Women(A), Bhimavaram, 2025
- U.G (B.Tech): Computer Science & Engineering, DNR College of Engineering and Technology, Bhimavaram, 2023

## Fields of Specialization
- Block Chain


## Identifiers & Contact
- Email: jsdivyaai@svecw.edu.in
- SVECW ID: 5440
`;

const AI_S_P_SUDHA_TEXT = `
## Experience
- Teaching Experience: 10 Years
- Research Experience: 4 Months
- Industry Experience: Nil

## Education Qualifications
- Ph.D.: Pursuing in Computer Science and Engineering at Anna University (from July 2024)
- M.E (P.G): Computer Science & Technology, PSN College of Engineering and Technology, Tirunelveli District, 2016
- B.E (U.G): Computer Science & Engineering, Marthandam College of Engineering and Technology, Kanyakumari District, 2011

## Fields of Specialization
- Cloud Computing
- Deep Learning


## Identifiers & Contact
- Email: spsudhaai@svecw.edu.in
- SVECW ID: 5441
`;

const AI_M_P_PRAVEEN_KUMAR_TEXT = `
## Experience
- Teaching Experience: 7 Years
- Research Experience: 0
- Industry Experience: 5 Years

## Education Qualifications
- Postgraduate: M.Tech in Computer Science & Engineering, Hindustan University, 2013
- Undergraduate: B.Tech in Computer Science & Engineering, JNTU Ananthpur, 2011

## Fields of Specialization
- Power BI, DAX, M Language


## Identifiers & Contact
- Email: mpkumarai@svecw.edu.in
- SVECW ID: 5442
`;

const AI_LALITHA_RAJA_RAJESWARI_TEXT = `
## Experience
- Teaching Experience: 8 Years
- Research Experience: 0
- Industry Experience: Nil

## Education
- P.G (M.Tech): Computer Science & Technology, Chirala Engineering College, JNTUK, 2014
- U.G (B.Tech): Computer Science & Engineering, Chirala Engineering College, JNTUK, 2011

## Fields of Specialization
- Machine Learning, IoT

## Professional Development
- Emerging Trends in Artificial Intelligence (May 25-31, 2022)
- Internet of Things with Machine Learning and Artificial Intelligence, NIT Warangal (December 6-10, 2021)
- Applications of Machine Learning, SVECW (June 2021)


## Identifiers & Contact
- Email: plalitharajarajeswariai@svecw.edu.in
- SVECW ID: 5443
`;

const AI_TOWQEER_UL_HAQ_TEXT = `
## Experience Summary
- Teaching Experience: 0 Years
- Research Experience: 0
- Industry Experience: 3 Years

## Education Qualifications
- Postgraduate: M.Tech in Computer Science & Technology, Punjab Technical University, 2023
- Undergraduate: B.Tech in Computer Science & Engineering, Punjab Technical University, 2021

## Fields of Specialization
- Docker
- AWS
- Generative AI


## Identifiers & Contact
- Email: towqeerai@svecw.edu.in
- SVECW ID: 5444
`;

const AI_SAMPARTHI_KUMAR_TEXT = `
## Educational Background
- Ph.D.: Computer Science and Engineering, VIT-AP University, Amaravathi (2026)
- M.Tech: Computer Science and Engineering, NIT Jalandhar, 2010
- B.Tech: Information Technology, JNTUH (2026)

## Experience Summary
- Teaching: 13 years
- Research: 3 years
- Industry: 0 years

## Research Specializations
- Machine Learning, Deep Learning, Image Processing, Explainable AI (XAI)

## Professional Affiliations
- Life Member of the Institution of Engineers (MIE)

## Publications
Journal Articles:
- "Bird Species Recognition using Transfer Learning with a Hybrid Hyperparameter Optimization Scheme" - Ecological Informatics, 80, 102510 (2024). Impact Factor: 8.5, Q1
- "Towards Transparency in AI: Explainable Bird Species Image Classification for Ecological Research" - Ecological Indicators, 169, 112886 (2024). Impact Factor: 8.7, Q1
- "A Computational Heuristics Approach for Classroom Scheduling using Genetic Algorithm Technique" - International Journal of Pure and Applied Mathematics, 119(14), 167-172 (2018)
- "Outlier Detection of Data in Wireless Sensor Networks Using Kernel Density Estimation" - International Journal of Computer Applications, 5(7), 28-32 (2010)

Conference Papers (SCOPUS Indexed):
- "Enhancing Sentiment Analysis in Under-Resourced Languages using Cross-Lingual Transfer Learning and Contextual Adaptation" - 2025 4th International Conference on Innovative Mechanisms for Industry Applications (ICIMIA), IEEE (2025)
- "A Comparative Study on Deep Learning Techniques for Bird Species Recognition" - 2023 3rd International Conference on Intelligent Communication and Computational Techniques (ICCT), IEEE (2023)
- "Automatic Bird Species Recognition using Audio and Image Data: A Short Review" - 2023 IEEE International Conference on Contemporary Computing and Communications (InC4), Vol. 1 (2023)
- "A Transfer Learning Approach to Bird Species Recognition using MobileNetV2" - 2023 7th International Conference on Intelligent Computing and Control Systems (ICICCS), pp. 787-794, IEEE (2023)
- "Bird Species Recognition using Deep Learning" - 2023 3rd International Conference on Artificial Intelligence and Signal Processing (AISP), pp. 1-6, IEEE (2023)
- "Transfer Learning for Bird Species Identification" - 2023 2nd International Conference on Computational Systems and Communication (ICCSC), pp. 1-6, IEEE (2023)
- "Dynamic Design and Implementation of Security Intelligence for Industry" - Journal of Physics: Conference Series, Vol. 1228, No. 1, p. 012025, IOP Publishing (2019)
- "A Novel Approach to Compress DNA Repetitive Sequences in Bioinformatics" - Journal of Physics: Conference Series, Vol. 1228, No. 1, p. 012026, IOP Publishing (2019)

Book Chapter:
- "Role of AI in Academic Research" - In Utilizing AI Tools in Academic Research Writing, pp. 1-17, IGI Global Scientific Publishing (2024)

## Faculty Development Programs (FDPs) / Workshops / Seminars / Training
- Online FDP on "Role of Responsible Artificial Intelligence (AI) in Driving Global Progress Towards Sustainable Development Goals (SDG)" - Chandigarh College of Engineering & Technology (CCET), 10-11-2025 to 15-11-2025
- Online FDP on "Robotic Process Automation: Tools and Techniques" - Sri Venkateswara College of Engineering, 01-04-2021 to 08-01-2021
- Online FDP on "Artificial Intelligence" - NIT Tiruchirappalli, 28-12-2020 to 01-01-2021
- Online FDP on "Cloud Technology" - INFLIBNET Center, 09-11-2020 to 13-11-2020
- Online FDP on "Computer Science & Biology" - SRM Institute of Science and Technology, Chennai, 19-10-2020 to 23-10-2020
- APSSDC 60 Contact Hours Faculty Development Program on "AI and Deep Learning" - 01-07-2020 to 28-07-2020
- APSSDC 24 Contact Hours Faculty Development Program on "Applied Machine Learning and Deep Learning" - 15-06-2020 to 20-06-2020
- APSSDC 10 Contact Hours Faculty Development Program on "AWS Cloud Computing" - 22-06-2020 to 26-06-2020

## Current Role
- Placement Coordinator

## Research Scholar IDs
TABLE:
Profile | Link
Google Scholar | https://ln.run/9xB6y
Scopus | https://ln.run/2IC5_


## Identifiers & Contact
- Email: drsvskumarai@svecw.edu.in
- SVECW ID: 5447
`;

const AI_LAKSHMI_SUNDARI_TEXT = `
## Experience
- Teaching Experience: 3 Months
- Research Experience: Nil
- Industry Experience: Nil

## Education Qualifications
- P.G (M.Tech): Software Engineering, Shri Vishnu Engineering College for Women, Bhimavaram (2026)
- U.G (B.Tech): Information Technology, Shri Vishnu Engineering College for Women, Bhimavaram, 2019

## Fields of Specialization
- Python, Machine Learning


## Identifiers & Contact
- Email: glakshmiai@svecw.edu.in
- SVECW ID: 5445
`;

const AI_DARAM_ANAND_TEXT = `
## Experience
- Teaching Experience: 3 Years
- Research Experience: 1 Year
- Industry Experience: 4.5 Years

## Education
- P.G (M.Tech): Computer Science & Technology, Parul University, Vadodara, 2025
- U.G (B.Tech): Computer Science & Engineering, S R K R Engineering College, 2016

## Fields of Specialization
- MongoDB, Spring Boot, JAVA


## Identifiers & Contact
- Email: danandai@svecw.edu.in
- SVECW ID: 5446
`;

const AI_M_BHARGAVI_TEXT = `
## Experience
- Teaching Experience: 5 Years
- Research Experience: 0 Year
- Industry Experience: 0 Years

## Education Qualifications
- P.G (M.Tech): Computer Science & Technology, Shri Vishnu Engineering College for Women, 2025
- U.G (B.Tech): Information Technology, Shri Vishnu Engineering College for Women, 2023

## Fields of Specialization
- Deep Learning

## FDPs/Workshops/Seminars/Training Programs Attended
- FDP on Blockchain


## Identifiers & Contact
- Email: mbhargaviai@svecw.edu.in
- SVECW ID: 5448
`;

const IT_HOD_TEXT = `
## Academic Credentials
- PhD: Acharya Nagarjuna University, 2014
- M.Tech: Information Technology, 2004
- M.Sc: Computer Science, KGRL College, Bhimavaram
- Teaching Experience: 21 years

## Research Focus
- Network Security

## Professional Affiliations
- Life Member, Institute of Engineers

## Recent Publications in National/International Journals
- "Exploring the Potential of Federated Learning to Empower Credit Card Fraudulent Transaction Detection with Deep Learning Techniques" - Proceedings on Engineering Sciences, Faculty of Engineering, University of Kragujevac, March 2025
- "SYSTEMATIC SURVEY ON CREDIT CARD FRAUD TRANSACTION DETECTION TECHNIQUES" (with Krishna, G.V., Lanka, M.D., Mohan, R.C., Burra, L.R., Tata, B) - Journal of Theoretical and Applied Information Technology, Volume 102, Issue 18, September 2024
- "Efficient Conference key Distribution Using Hybrid key Trees" - IEEE Workshop on Collaborative Security Technologies (Cosec'09)
- "TRING: A New Framework for Efficient Group key Distribution for Dynamic Groups"
- "Efficient Group key Distribution Mechanism for Dynamic Groups Using Public key Broadcast Ring"
- "Secure Group key Distribution Using Hybrid Cryptosystem"
- "Efficient Conference key Distribution for Dynamic Groups"
- "Scalable Rekeying for Dynamic Groups Using Key Path Compression"
- "Scalable rekeying limited to subgroup using Hybrid key Trees" - International Journal of Computer Applications (0975-8887), Vol.1-No.17
- "Efficient Distribution of Conference key for Dynamic Groups" - International Journal of Computer Theory and Engineering, Vol.2, No.4
- "A Novel Hybrid Cryptosystem Based Approach for Secure Multicasting for Dynamic Groups" - IACSIT International Journal of Engineering and Technology, Vol.2, No.4
- "A Novel Decentralized Approach for Conference Key Distribution Using A One-Way Hash Function" - International Journal of Computer Networks and Security, Vol.23, Issue-2

## Patents
- "System and Method for Intelligent Network Traffic Management Using AI-Based Routing Algorithms" - Published 18 October 2024, Application No. 202441075551
- "Method for Secure Cloud Data Storage with Multi-Factor Authentication and AI Monitoring" - Published 18 October 2024, Application No. 202441075561

## Textbooks Authored
- "Data mining techniques using R" - Shree Publications House, ISBN 978-93-95250-29-0, 2024
- "Python Programming" - Shree Publications House, ISBN 978-93-95250-64-1, 2024
- "Fraud Detection in Banking: AI Strategies for Financial Institutions" - Lambert Academic, ISBN 978-62-0745-283-5, 2023

## Recent Conference Papers
- "Cluster Query Optimization Technique Using Blockchain" - Proceedings of the 2nd International Conference on Cognitive and Intelligent Computing (ICCIC 2022), Springer, Singapore, 2023
- "Diagnosis of Epileptic Seizures Using Deep Learning and Optimization Technique" - International Conference on Augmented Reality, Intelligent Systems, and Industrial Automation (ARIIA 2024), IEEE, December 2024
- "Evaluation of Machine Learning and Genetic Algorithms for Water Quality Prediction" - International Conference on Augmented Reality, Intelligent Systems, and Industrial Automation (ARIIA 2024), IEEE, December 2024
`;

const IT_VENKATA_RAMA_RAJU_TEXT = `
## Education
- M. Tech: Computer Science, Jawaharlal Nehru Technological University, Hyderabad, 2005
- B. Tech: Computer Science and Engineering, SRKR Engineering College, Andhra University, 1996

## Experience
- Teaching Experience: 22 years
- Industry Experience: 5 years

## Research Area
- Data Mining

## Professional Affiliations
- Life member, Computer Society of India (CSI)
- Life member, Indian Society for Technical Education (IST)
- Institute of Engineers

## Workshops and Faculty Development Programs
- Workshop on "Role of National Education Policy 2020 in Swarna Andhra and Viksit Bharat 2047" (17-18 July 2025)
- Faculty Development Program on "GEN AI and AGENTIC AI" (09-27 June 2025)
- Online FDP on "Machine Learning Applications for Engineers," Chaitanya Bharathi Institute of Technology (03-07 June 2024)
- One Week National Level FDP on "Cloud Infrastructure (AWS)," JNTUK Narasaraopet (21-25 August 2023)
- ISTE Approved One Week FDP on "The role of Teachers in NEP 2020 Implementation," D.Y. Patil College of Engineering Akurdi (21-25 August 2023)
- One Week Virtual FDP on "Outcome Based Education," PPG Institute of Technology, Coimbatore (01-09 February 2023)
- Five day faculty development program on "Power of Visualization in Analytics," BVRIT Hyderabad (16-21 August 2023)

## Publications in National/International Journals
- Venkata Rama Raju, Santhosh Kumar S. V. N., M. Selvi, and R. Shanmugapriya. "RL-BOT-Reinforcement Learning Based Billfish Optimization Technique for Secured Data Aggregation in Internet of Things." Peer-to-Peer Networking and Applications, Springer, April 2025
- P. Venkata Rama Raju, Mrs. J. Hymavathi, Ane Ashok Babu, Sajja Radharani, Yalanati Ayyappa, S Sindhura. "Multiclass Membrane Gash Uncovering and Taxonomy Using Amalgam Features Selection Based on Deep CNN." Journal of Theoretical and Applied Information Technology, 15 October 2024, Vol. 102, No. 19
- Challa NP, Shyam Mohan JS, Naga Badra Kali M, Venkata Rama Raju P. "Intelligent disease analysis using machine learning." Smart Innovation Systems and Technology 2023;315:119-26
- P. Venkata Rama Raju, Dr. P. Srinivasa Rao, Dr. G. Partha Sarathi Varma. "A Supervised Diversity Database Alignment In Intrusion Detection System." International Journal of Advanced Research in Dynamical and Control Systems, Vol. 10, 04-Special Issue
- P. Venkata Rama Raju, Dr. P. Srinivasa Rao, Dr. G. Partha Sarathi Varma. "Distributed Coding For Intrusion Detection Using Resource Segmentation." IOSR Journal of Computer Engineering (IOSR-JCE), Volume 19, Issue 2, Ver. II (March-April 2017), pp. 47-55

## Book Chapters
- D., Venkata Rama Raju, P. (2023). "Cluster Query Optimization Technique Using Blockchain." In Kumar, A., Ghinea, G., Merugu, S. (eds) Proceedings of the 2nd International Conference on Cognitive and Intelligent Computing. ICCIC 2022. Cognitive Science and Technology. Springer, Singapore
- Shyam Mohan J.S, Challa N.P, Raju P.V.R. "Recent Trends and Challenges in Blockchain Technology." Lecture Notes in Electrical Engineering (Scopus indexed) 2021
- Dr. Nagendra Panini Challa, P. Venkata Rama Raju. "Intelligent Computing and Applications." Proceedings of ICDIC 2020. Smart Innovation, Systems and Technologies, Springer publication 2023, 315, pp. 119-126

## Conference Papers
- P. Venkata Rama Raju, Dr. P. Srinivasa Rao, Dr. G. Partha Sarathi Varma. "Distributed Coding For Intrusion Detection Using Resource Segmentation." IEEE sponsored International Conference On Intelligent Computing and Control (I2C2) (23-24 June 2017)
- Kadali, D.K., Venkata Naga Raju, D., Venkata Rama Raju, P. "Cluster Query Optimization Technique Using Blockchain." Second International Conference on Cognitive and Intelligent Computing (27-28 December 2022), published in Cognitive Science and Technology, 2023, Part F1466, pp. 631-638

## Patents
- "Method for Secure Cloud Data Storage with Multi-Factor Authentication and AI Monitoring" - Published 18 October 2024, Application no: 202441075561
- "System and Method for Privacy-Preserving Data Analytics in Distributed Cloud Environments" - Published 18 October 2024, Application no: 202441075547
`;

const IT_RATNA_KANTH_TEXT = `
## Educational Qualifications
- Ph.D.: ICE, Anna University, Chennai, 2023
- M.Tech: IT, Bharath University, Chennai, 2006
- B.Tech: IT, Madras University, Chennai, 2003

## Professional Details
- Teaching Experience: 17 Years

## Specialization & Research Areas
- Machine Learning
- Deep Learning

## Professional Affiliations
- ISTE Life Member
- CSI
- IEI

## Key Publications
Journal Publications:
- "Design of Smart Tourism Systems to Forecast Foreign Tourist Arrival Rate" in Proceedings on Engineering Sciences, vol. 7, no. 1, March 2025
- "Sentiment Classification of Indian tourist reviews for sustainable tourism development" - accepted for Journal of Environmental Protection and Ecology, vol. 22, no. 6 (SCI indexed, Impact Factor 0.657)

Conference Papers:
- "Unsupervised sentiment classification for hotel review rating using LSTM autoencoder" - ICDSA2021, April 10-11, 2021
- "Indian tourism recommendation system using collaborative filtering and Deep auto encoder" - ICTCS 2021, December 17, 2021
- "Prediction of flight fare using deep learning techniques" - IC3P 2022
- "Blog Popularity Mining Based on Conceptual Clustering" with Y. Krishna Bhargavi and Y.S.S.R. Murthy - ICNEAC 2011, pp. 191-195

## Awards & Recognition
- Distinguished Alumni award in "Alumni Teaching Excellence" category - Rajalakshmi Engineering College, Chennai
- IBM TGMC Mentor Award - IBM (The Great Mind Challenge) 2013
- IGIP-International Engineering Educator award - IUCEE and IGIP Austria
- Jury Member for PRAJWALAN-2K24 - SRKREC Bhimavaram

## Professional Development Programs
- AICTE ATAL FDP "Juniper Mist - AI" (November 24-29, 2025)
- AICTE ATAL FDP "Quantum Artificial Intelligence and High Performance Computing for Industrial Digital Twins" - Amrita Vishwa Vidyapeetham (September 9-14, 2024)
- 5-day online FDP on Data Analytics - APSSDC with ExcelR (June 19-23, 2023)
- 5-day Guest Lecture series "A Saga of Technologies" - Sathyabama Institute (March 16-21, 2022)

## Patents
- "AI-Powered System for Dynamic Resource Allocation in Cloud Networks" - Application no. 202441075546 (October 18, 2024)
- "AI-Driven System for Real-Time Intrusion Detection in Cloud Infrastructure" - Application no. 202441075549 (October 18, 2024)

## Other Contributions
- Reviewer for "KSII Transactions on Internet and Information Systems"
- Guest lecture on "Impact of Data Analytics on Tourism" - Rajalakshmi Engineering College, Chennai
`;

const IT_PAVAN_KUMAR_VADREVU_TEXT = `
## Educational Qualifications
- Ph.D.: CSE, Centurion University of Technology and Management, Orissa, 2021
- M. Tech.: IT, Guru Nanak Engineering College, JNTUH, Hyderabad, 2011
- B. Tech.: IT, Swarnandhra College of Engineering and Technology, JNTUH, 2008
- DEEE: EEE, State Board of Technical Education, Hyderabad, 2004
- Teaching Experience: 15 Years

## Research & Specialization Areas
- Data Privacy
- Machine Learning
- Software Engineering

## Professional Memberships
- ISTE Life Member
- Institute of Engineers (IE) Life Member

## Notable Achievements
- "Best IT Associate Professor of the Year Award 2022" (RR KITS ITAP Awards, October 2, 2022)
- "Academic Excellence Award" from I2OR National Science Day Awards 2022
- Board of Studies Member at Srinivasa Institute of Engineering and Technology (2023-24 to 2026-27)
- Editorial Board Member, "Medicon Engineering Themes" (ISSN: 2834-7218)

## Patent Portfolio
- "System and Method for Privacy-Preserving Data Analytics in Distributed Cloud Environments" - Published 18.10.2024, Application no: 202441075547
- "Microgravity Electromagnetic Tool Stabilization Device" - Published 18.10.2024, Application no: 437191-001
- "A Blockchain-Based Smart Contract System for Automated Crop Insurance and A Method Thereof" - Published 29.05.2024, Application no: 202441091789
- "AI-Based Method for Anomaly Detection in High-Speed Networks and Data Centers" - Published 18.10.2024, Application no: 202441075544
- "System and Method for Automated Index Generation for Answer Booklets Using Deep Learning" - Published 22.11.2024, Application no: 202441088721
- "IoT Based Safeguard System for Patients with Neurological Disorders and Dementia" (pending)
`;

const IT_RAVI_KUMAR_SUGGALA_TEXT = `
## Educational Qualifications
- Ph.D. in CSE, Centurion University of Technology and Management, Odisha, 2023
- M.Tech. in CSE, Jawaharlal Nehru Technological University, Kakinada, 2012
- M.Sc. in Information Systems, Andhra University College of Engineering, 2004
- B.C.A. in Computer Science, Nagarjuna University, 2002

## Professional Details
- Teaching Experience: 19 years

## Research Areas
- Machine Learning, Deep Learning, Security, Full Stack Application Development

## Professional Memberships
- ISTE Life Member, CSI, IEI

## Recent Recognition
- Elected as the Leading Professor and Academician of 2024 by BusinessTalkz Magazine

## Journal Publications
- "Optimized Disease Recognition in Tomato Plants Using Attention-Driven Neural Networks and YOLOv7 for Precision Agriculture." Progress in Artificial Intelligence, Springer, Nov. 2025
- "Blockchain Technology for Digital Twin Security in Smart Grids Using Peer-to-Peer." Peer-to-Peer Networking and Applications, Springer, May 2025
- "Design of Smart Tourism Systems to Forecast Foreign Tourist Arrival Rate." Proceedings on Engineering Sciences, vol. 7, no. 1, University of Kragujevac, Mar. 2025
- "Effective Scheduling Algorithm for Workload Forecasting in Fog Environment Utilizing Dual Interactive Wasserstein Generative Adversarial Network." IEIE Transactions on Smart Processing & Computing, Oct. 2024
- Ravi Kumar Suggala, Suma Bharathi. M, P.L.V.D. Ravi Kumar, NVS. Pavan Kumar. "Effective Scheduling Algorithm for Workload Forecasting in Fog Environment Utilizing Dual Interactive Wasserstein Generative Adversarial Network." IEIE Transactions on Smart Processing & Computing, pp. 435-442, Vol. 13 No. 05, 2024
- Ravi Kumar Suggala, Dr. M. Vamsi Krishna. "A survey on prediction approaches for epidemic disease outbreaks based on social media data." International Journal of Advanced Trends in Computer Science and Engineering, vol. 8, no. 3, pp. 897-908, 2019
- Ravi Kumar Suggala, M. Vamsi Krishna, Swain, S.K. "Reliable Epidemic Outbreak Prevention in Opportunistic IOT Based On Optimized Block Chain." International Journal of Automation and Smart Technology, vol. 13, no. 1, 2023
- Ravi Kumar Suggala, Krishna, M.V., Swain, S.K. "Health monitoring jeopardy prophylaxis model based on machine learning in fog computing." Transactions on Emerging Telecommunications Technologies, 2022
- Ravi Kumar Suggala, Dr. Vamsi Krishna, Dr. Swain Sangram K. "Discover the New Factor for Dengue Fever Outbreaks and Predicted using Bayes Network-PSO (BN-PSO)." Journal of Information Science and Engineering, vol. 39, no. 6, pp. 1383-1401, 2023
- Ravi Kumar Suggala, Krishna, M. Vamsi, Swain, S.K. "Automated outbreak prediction of epidemic diseases using Machine Learning based Global pre-emptive scheme." European Chemical Bulletin, vol. 12, no. 10, pp. 1468-1489, 2023
- Ravi Kumar Suggala, Swain, S.K., M. Vamsi Krishna, Ramchandrapur. "Time Series Data based COVID-19 Prognostic using Support Vector Machine." International Journal of Engineering Research and Technology, vol. 9, no. 5, 2021
- Ravi Kumar Suggala, Vamsi, K., Sangram Keshari, S. "Deep Belief Neural Network (DBN) and Whale Optimization Algorithm (WOA) for the Prediction of Disease from EHR." TEST Engineering and Management, vol. 83, pp. 14268-14276, May-June 2020
- Ravi Kumar Suggala, Vadrevu. P.K., Gadiraju, T.V. "Big Data Expansion and Challenges." International Journal of Engineering Research and Technology, vol. 4, no. 34, pp. 58-68
- Ravi Kumar Suggala, Vadrevu. P.K., Gadiraju, T.V. "Contemporary Energy Optimization for Mobile and Cloud Environment." International Journal of Computational Engineering Research, vol. 6, no. 9, pp. 6-16

## Conference Publications
- "Exploiting Random Forest Algorithm Toward Forecasting Chronic Obstructive Pulmonary Disease Exacerbations." Lecture Notes in Networks and Systems, Springer, Sept. 2025
- "Stereoscopic Scalable Quantum Convolutional Neural Networks with Banyan Tree Growth Optimization for Predicting IoT Security Attacks by Mirai Malware." Proceedings of the 9th International Conference on Smart Trends in Computing and Communications (SmartCom 2025), Springer, Jan. 2026
- "Multi-relational Graph Attention-Based Depth Wise Separable Convolutional Neural Network for Spatio-Temporal Epidemic Forecasting." Proceedings of the 9th International Conference on Smart Trends in Computing and Communications (SmartCom 2025), Springer, Jan. 2026
- "Enhanced Dental Cavity Detection Using Riemannian Residual Networks and Improved Sooty Tern Optimization." Proceedings of the 9th International Conference on Smart Trends in Computing and Communications (SmartCom 2025), Springer, Jan. 2026
- Suggala, Ravi Kumar, Srinivasa Rao Dangeti, Pavan Kumar Vadrevu. "Secure Pool Mining through SVM-Based Miner Classification and Computation Validation in Blockchain Networks." 22nd OITS International Conference on Information Technology (OCIT 2024), IEEE, Dec. 2024
- "Strategic Miner Selection for Optimizing Block Generation Time in PoW-Based Blockchain Pool." 22nd OITS International Conference on Information Technology (OCIT 2024), IEEE, Dec. 2024
`;

const IT_SREENIVASU_TEXT = `
## Educational Qualifications
- PhD: Andhra University, Visakhapatnam, 2026
- M.E (CSE): Anna University, Chennai, 2004
- FIE (CSE): Institution of Engineers (India), Kolkata, 1998

## Professional Information
- Teaching Experience: 22 years

## Research Areas
- Network Security
- Cryptography

## Professional Affiliations
- Life Member of Institution of Engineers (India), Kolkata
- Life Member ISTE

## Recent Publications in International Journals
- "Privacy-enhanced course recommendations through deep learning in federated learning environments" - International Journal of Information Technology, Springer, January 2025
- "DAR Model" for symmetric key security in wireless sensor networks - International Journal on Recent and Innovation Trends in Computing and Communication, 11(10)
- "FELZMACS" data compression model in wireless sensor networks - International Journal of Intelligent Systems and Applications in Engineering, 12(2)
- Survey on key management schemes in wireless sensor networks - Journal of Engineering Sciences

## Patents
- "Method for Secure Data Transmission in IoT Networks" (Application: 202441075550, filed 18.10.2024)
- "Smart Privacy Management in IoT Healthcare Devices" (Application: 202441075548, filed 06.10.2024)
- "Machine Learning Based System for Optimized Cluster Head Selection in WSNs" (Application: 202341043083, filed 01.09.2023)

## Professional Development
- FDP on Machine Learning Applications (Chaitanya Bharathi Institute, June 2024)
- Two-week workshop on Asymptotic Analysis of Algorithms (NIT Warangal, October 2023)

## Conference Publications
- "Enhancing Data Sharing Security with Insider Threat Detection: A Hybrid Key Management Approach" (Lecture Notes in Networks and Systems, Springer, June 2025)
- "Hybrid Multi-stage Network for Comprehensive Lung X-Ray Analysis" (ICT for Intelligent Systems: Proceedings of ICTIS 2025, Volume 7, Lecture Notes in Networks and Systems, Springer Singapore, January 2026)
- "Video Transcript Condenser System" (Lecture Notes in Networks and Systems, Springer, January 2026)
- "Automated Currency Validator" (Lecture Notes in Networks and Systems, Springer, January 2026)
- "Comprehensive Exploration of Generative Pre-trained Transformer" (Lecture Notes in Networks and Systems, Springer, July 2025)
`;

const IT_VEERA_RAGHAVA_RAO_TEXT = `
## Educational Qualifications
- Ph.D.: Computer Science and Engineering, Nagarjuna University, Guntur, 2021
- M.Tech.: Computer Science and Engineering, JNTUH, Hyderabad, 2008
- B.Tech.: Computer Science and Engineering, Nagarjuna University, Guntur, 2005

## Professional Experience
- Teaching Experience: 17 years

## Fields of Specialization
- Cloud Computing
- Network Security

## Professional Development Activities
- Faculty Enablement Program (FEP) Phase-3 on "Machine Learning & NLP using Python" via Infosys Springboard Platform (June 24-28, 2024)
- Workshop on "Machine Learning & NLP using Python" via Infosys Springboard Platform (July 24-28, 2024)
- Faculty Development Program on "Large Language Models in Artificial Intelligence," organized by Andhra Pradesh Information Technology Academy & Blackbuck Engineers Pvt. Ltd. (October 4-7, 2023)
- 3-Day workshop on NBA Accreditation Process
- Workshop on "Emerging Trends in Artificial Intelligence" (May 25-31, 2022)
`;

const IT_K_RAMU_TEXT = `
## Education
- Ph.D.: Computer Science & Engineering, VELS (Deemed to be University), Chennai, 2024
- M.Tech.: CSE, Osmania University, Hyderabad, 2009
- B.Tech: Adams Engineering College, JNTUH, 2006

## Professional Experience
- Teaching Experience: 14 Years 6 Months

## Fields of Specialization & Research Areas
- Machine Learning
- Deep Learning

## Professional Affiliations
- IEI Life Member

## Faculty Development Programs & Workshops
- Participated in Faculty Enablement Program (FEP) Phase-3 on Machine Learning & NLP using Python via Infosys Springboard Platform from 24.06.2024-28.06.2024
- Attended workshop on Sustainable AI applications & LLM Technologies for Health Data Analytics from 22.04.2024-26.04.2024
- Participated in 5-day online FDP on "Sustainable AI applications & LLM Technologies for Health Data Analytics," GMR Institute of Technology-Rajam, Vizianagaram, from 26.12.2023-30.12.2023
- Participated in workshop on Inculcating Universal Human Values in Technical Education from 05.12.2022 to 09.12.2022
- Attended Workshop on Essential Dimensions of High Quality Research from 24.02.2022 to 03.03.2022
`;

const IT_RAVICHANDRA_SRIRAM_TEXT = `
## Educational Qualifications
- PhD: Completed October 2025, Pondicherry University
- M.Tech: Computer Science and Technology (AI & Robotics), Andhra University College of Engineering, Visakhapatnam, 2010
- B.Tech: Information Technology, Swarnandhra College of Engineering & Technology, JNTUH, 2007
- Diploma: Mechanical Engineering, Col. D.S. Raju Polytechnic, Poduru, 2002
- Teaching Experience: 14 years, 6 months

## Research Areas
- Computer Vision
- Natural Language Processing

## Professional Affiliations
- Life Member, Institute of Engineers

## Publications in National/International Journals
- Ravichandra, S., Siva Sathya, S., Lourdu Marie Sophie, S. (2022). "Deep Learning Based Document Layout Analysis on Historical Documents." Advances in Distributed Computing and Machine Learning, Lecture Notes in Networks and Systems, vol 427, Springer Singapore (Scopus)
- Ravichandra, S., Sundaram, S.S., Sophie, S.L. (2023). "Deep Learning Models for Automatic De-identification of Clinical Text." Computer, Communication, and Signal Processing. AI, Knowledge Engineering and IoT for Smart Systems. ICCCSP 2023, IFIP Advances in Information and Communication Technology, vol 670, Springer Cham (Scopus)
- Raju, PRSS Venkatapathi, Y. Vamsidhar, and Ravi Chandra Sriram. "Edge Adaptive Image Steganography on LSB using Godel numbering." IJCST Vol. 2, SP 1, December 2011
- Ravi chandra. "Machine Learning Approaches for 5G Coverage Prediction: A Comparative Study of Algorithms and Feature Contributions." Lecture Notes in Networks and Systems, Springer Science and Business Media Deutschland GmbH, 26 Jan. 2026

## NPTEL Certifications
- Completed 12 weeks: "Problem Solving Through Programming in Java," IIT Kharagpur, January-April 2025
- Completed 12 weeks: "Problem Solving Through Programming in C," IIT Kharagpur, July-October 2024
- 8-week course on Design and analysis of algorithms, July-September 2017
- 8-week course on Programming, data structures and algorithms using python, July-September 2017

## FDP/Workshops/Training Programs
- 5-day STC on Data Mining and Image Analytics for Medical Informatics, IIT Kharagpur, 8-12 April 2013
- One-week STTP on Applications of Artificial Intelligence Techniques in Engineering and Research, Birla Institute of Technology Mesra Ranchi, 23-27 September 2013
- 5-day STTP on Audio and Speech Signal Processing (ASSP 2014), NIT Surat, 7-11 July 2014
- International Workshop on Soft Computing and Applications (ISCA'15), ISI-Kolkata with South Asian University New Delhi, 25-27 March 2015
- AICTE-sponsored two-week FDP on Machine Learning, VR Siddhartha Engineering College Vijayawada, 16-27 November 2015
- One-week workshop on Deep Learning, IIT Hyderabad, 20 June 2016-26 June 2017
- One-week workshop on Research Trends in Machine Learning (RTML-17), Dept of IT JNTUK - University College of Engineering Vizianagaram, 9-11 October 2017 and 16-18 November 2017
- Five-day National Level FDP on Machine Learning & Deep Learning, Aditya Engineering College in association with Computer Society of India, 26-30 December 2023
- Five-day workshop on Deep-Learning Approaches for Inverse Problems in Imaging (Online), NIT Goa, 20-24 November 2023
- Completed course on Deep Learning Specialization, Coursera by deeplearning.ai
- Completed course on Natural Language Processing Specialization, Coursera by deeplearning.ai
- Participated in Faculty Enablement Program (FEP) Phase-3 on Machine Learning & NLP using Python, Infosys Springboard Platform, 24-28 June 2024
- Participated in one-week online FDP on "Exploring Generative AI: Foundations, Models and Real-World Applications in Vision and Language," 9-13 February 2026

## Patents
- "System and Method for Intelligent Network Traffic Management Using AI-Based Routing Algorithms," inventor, published 18 October 2024, Application no: 202441075551
- "AI-Based Method for Anomaly Detection in High-Speed Networks and Data Centers," inventor, published 18 October 2024, Application no: 202441075544
`;

const IT_LEELA_PRASAD_TEXT = `
## Education
- M.Tech: Computer Science and Engineering, Adams Engineering College, JNTUH, January 2013
- B.Tech: Computer Science and Engineering, Adams Engineering College, JNTUH, 2006

## Experience
- Teaching Experience: 15 Years 8 Months

## Specialization
- Web application
- Data Science

## Professional Affiliations
- Life Member, Institute of Engineers
- Life Member, ISTE

## Publications
- "A study of Learners in Information Retrieval System in relation to learning parameters" with H C P Pavan Kumar, IJERMT, ISSN: 2278-9359 (Volume-6, Issue-6)
- "Data Mining in Cognitive Science: An Interdisciplinary approach" with H C P Pavan Kumar, IJIRSET, ISSN(Online): 2319-8753, ISSN (Print): 2347-6710, Vol.6, Issue 7, July 2017
- "Empathy of Diabetics through Supervised Machine Learning Models," 15th International Conference on Advances in Computing, Control, and Telecommunication Technologies (ACT 2024), November 2024

## Patents
- "Method for Secure Data Transmission in IoT Networks Using Block chain and Encryption Techniques" (Application no: 202441075550, Published 18.10.2024)
- "Method for End-to-End Encryption and Secure Key Distribution in IoT-Based Smart Grids" (Application no: 202441075545, Published 18.10.2024)

## Professional Development
- One Week Online FDP on "Exploring Generative AI: Foundations, Models and Real-World Applications in Vision and Language" (25.08.2025 to 30.08.2025)
- One Week National Level FDP on "Recent Trends on AI-Text, Vision & Hardware Implementation Models" (28.08.2025 to 02.09.2025)
- Faculty Enablement Program (FEP) Phase-3 on Machine Learning & NLP using Python via Infosys Springboard Platform (24.06.2024-28.06.2024)
- Five day National Level FDP on "Machine Learning & Deep Learning," Aditya Engineering College in association with Computer Society of India (26.12.2023-30.12.2023)
- Five-day workshop on "NASSCOM Security analytics" organized at VEDIC (20-03-2018 to 24-03-2018)
- Two-day workshop on "Certified Cyber Security Professional (CCSP) Workshop"
- Six-day workshop on "Inspire - Impact - Introspect" organized by VEDIC
- FDP on "Google Android Developer Fundamentals" organized by APSSDC at VVIT Institute of Technology (6-10 September 2016)
- One Week Workshop on "Mobile Application Development using Android," Department of IT, SVECW (16-21 November 2016)
- Three-Day program on "Scientific Educational Practices (SEP)" organized by VEDIC (8-10 August 2016)
- Two-Day Workshop on "IT Integrated Management Services" at SVECW (28-29 November 2014)
`;

const IT_SUMA_BHARATHI_TEXT = `
## Education
- PhD (pursuing): Amrita Vishwa Vidyapeetham, Chennai
- M.Tech.: CSE, JNTU H., 2014
- B.Tech.: CSE, JNTU H., 2009

## Experience
- Teaching Experience: 9 Years

## Field of Specialization & Research Area
- Artificial Intelligence
- Machine Learning
- Deep Learning

## Professional Affiliations
- IEI Life Member

## Publications in National/International Journals
- Suma Bharati M., Yesujyothi Yerramsetti, and Yeddu Sabitha. "Malware Detection Using a Novel Machine Learning Dynamic Ensemble Classification Approach." IEEE conference, June 2024.
- M. Suma Bharathi. "Energy Forecasting and Optimization for a Greener Grid." IOP Conference Series: Earth and Environmental Science, September 2025, vol. 1529, no. 1, p. 012011.
- Ravi Kumar Suggala, Suma Bharathi M., P.L.V.D. Ravi Kumar, NVS Pavan Kumar. "Effective Scheduling Algorithm for Workload Forecasting in Fog Environment Utilizing Dual Interactive Wasserstein Generative Adversarial Network." IEIE Transactions on Smart Processing & Computing, 2024.
- Dr. Harika B., M. Suma Bharathi, C. Rama Krishna. "Location-Based Energy-Aware and Anonymous Routing Protocol." International Journal of Analytical and Experimental Modal Analysis, Volume XV, Issue 1, January 2023.

## Publications in National/International Conferences
- Nagendra Panini Challa, Suma Bharathi T., Padma B., Manikanta Sirigineedi, JS Shyam Mohan. "Recent Trends, Challenges and Applications of Cyber Physical Systems and Internet of Things." International Conference on Intelligent Computing in Information Technology for Engineering System (ICICITES-2021), SKN Singhad College of Engineering, Pandharpur, Maharashtra, June 25-26, 2021.

## FDPs/Workshops/Seminars/Training Programs
- Participated and completed AICTE - VAANI workshop on "HPC and Quantum Technology for Next-Generation Smart Cities & Intelligent Mobility Applications" (September 23-25, 2025)
- Completed "Capacity Building Programme on Cybersecurity - Basic Course" under Ministry of Education, Govt of India (September 4-8, 2025)
- Participated and completed AICTE ATAL Academy FDP on Quantum Artificial Intelligence and High Performance Computing for Industrial Digital Twins at Amrita Viswa Vidyapeetham Chennai (September 9-14, 2024)
- Completed WordPress Website Training Program by Reinaphics Creatives, Chennai (August 1-21, 2024)
- Participated in 5-day online FDP on "Sustainable AI applications & LLM Technologies for Health Data Analytics," GMR Institute of Technology-Rajam (April 22-26, 2024)
- Five-Day Faculty Development Program on "Power of Visualization in Analytics," BVRIT Hyderabad College of Engineering for Women (August 16-21, 2023)
- One Week FDP on "Natural Language Processing (NLP)," VNR Vignana Jyothi Institute of Engineering and Technology (February 13-17, 2023)
- One Week FDP on "Data Science for Engineers," VNR Vignana Jyothi Institute of Engineering and Technology (January 23-28, 2023)
- One Week Online Faculty Development Program on "Emerging Trends in Artificial Intelligence," Bhimavaram Institute of Engineering & Technology and Blackbuck Engineers Pvt Ltd (May 25-31, 2022)
- AICTE ATAL Academy Online FDP on "Predictive Intelligence Models and its Applications," National Engineering College (July 12-16, 2021)
- AICTE ATAL Academy Online FDP on "Artificial Intelligence," National Institute of Technology Puducherry (September 21-25, 2020)
`;

const IT_SASI_KUMAR_TEXT = `
## Educational Qualifications
- PhD (pursuing): Amrita Vishwa Vidyapeetham, Chennai
- M.Tech: Information Security, National Institute of Technology-Warangal, 2010
- B.Tech: Information Technology, SRKR Engineering College, Bhimavaram, 2008

## Professional Details
- Teaching Experience: 14 Years

## Research Specialization
- Network Security
- Wireless Sensor Networks

## Professional Affiliations
- IEI (Institution of Engineers India)

## Publications in National/International Journals
- Sasi Kumar Bunga, "Sign Language Recognition for Needy People Using Machine Learning Model," Intelligent Computing and Applications. Smart Innovation, Systems and Technologies, vol 315, Springer, Singapore, ISBN: 978-981-19-4161-0, November 14, 2022
- Sasi Kumar.B, "Systematizing Big Data Analytics Applications and Analytics Solutions to the Cloud," South Asian Journal of Engineering and Technology, Vol.2, No.48 (2016): 7-11, ISSN (online): 2454-9614

## Professional Development Programs Completed
- 40-hour FDP on "QT-05 Quantum Computation" funded by MeitY and endorsed by DST-NQM/AICTE/UGC (July 11, 2025 - August 2, 2025)
- AICTE Training and Learning (ATAL) Academy FDP on Quantum Artificial Intelligence and High Performance Computing for Industrial Digital Twins, Amrita Viswa Vidyapeetham Chennai Campus (September 9-14, 2024)
- Educator Training Certificate for Cisco Networking Academy completion
- DevNet Associate Instructor Training
- Educator Training Certificate for Cisco Networking Academy CCNA Instructor Training
- National Level Online Quiz recognition for "Teaching & Research Aptitude of NET/SET"
- National Level Online Quiz recognition for "Test your skills of Internet of Things (IoT)"
- NPTEL Online Certification on Wireless Ad Hoc and Sensor Networks
- NPTEL Online Certification on Cloud Computing
- 2-Week Course on "Digital Transformation in Teaching Learning Process"
- Coursera course on Cyber security Roles, Processes and Operating System Security
- Coursera course on AI for Everyone
- Coursera course on Introduction to HTML5
- Coursera course on Security and Privacy for Big Data - Part 1

## Patents
- "AI-Based Method for Anomaly Detection in High-Speed Networks and Data Centers" (Inventor), published October 18, 2024, Application no: 202441075544
- "System and Method for Privacy-Preserving Data Analytics in Distributed Cloud Environments" (Inventor), published October 18, 2024, Application no: 202441075547
`;

const IT_B_PADMA_TEXT = `
## Academic Credentials
- PhD (Pursuing): CSE - GIET University, Odisha
- M.Tech: CSE - Swarnandhra Institute of Engineering and Technology, JNTUK, 2015
- B.Tech: CSE - Jogaiah Institute of Engineering and Technology, JNTUK, 2013
- Teaching Experience: 8 Years

## Research Specializations
- Machine Learning
- Deep Learning
- Artificial Intelligence

## Publications in National/International Journals
- M. Srikanth, Padma Bellapukonda, Manikanta Sirigineedi: "Protecting tribal peoples nearby patient care centres use a hybrid techniques based on a distribution network," International Journal of Health Sciences, 2022
- M. Srikanth, Bhanurangarao M, Manikanta Sirigineedi, Padma Bellapukonda: "Integrated Technologies for Proactive Bridge-Related Suicide Prevention," Journal of Namibian Studies, Volume 1, Issue 33, Pages 2117-2136, Sep 2023
- Padma Bellapukonda, Manikanta Sirigineedi, M. Srikanth: "The Early Detection of Alzheimer's Illness Using Machine Learning and Deep Learning Algorithms," Journal of Pharmaceutical Negative Results, vol. 13, issue 9, pp. 4852-4859, Nov. 2022
- Srikanth Mandela, Padma Bellapukonda, Manikanta Sirigineedi: "Using Machine Learning and Neural Networks Technologies, a Bottom-Up Water Process Is Being Used To Reduce All Water Pollution Diseases," Journal of Artificial Intelligence, Machine Learning and Neural Network (JAIMLNN), vol. 2, Oct. 2022
- Manikanta Sirigineedi, Padma Bellapukonda, R N V Jagan Mohan: "Predictive Disease Data Analysis of Air Pollution Using Supervised Learning," International Journal of Scientific Research in Computer Science Engineering and Information Technology, Volume 8 Issue 4, July-August-2022

## Publications in National/International Conferences
- Padma, B. "Diabetic Foot Ulcer Identification Using Deep CNN Models on Visual Image Datasets," 2025 2nd International Conference on Intelligent Algorithms for Computational Intelligence Systems (IACIS), IEEE Inc., Dec. 2025
- P. Bellapukonda, R. N. V. J. Mohan and B. Sahu: "Predicting Sweat Levels to Detect Hyperhidrosis: A Logistic Regression Approach," 2023 14th International Conference on Computing Communication and Networking Technologies (ICCCNT), Delhi, India, 2023
- Nagendra Panini Challa, Suma Bharathi T, Padma B, Manikanta Sirigineedi and JS Shyam Mohan, "Recent Trends, Challenges and Applications of Cyber Physical Systems and Internet of Things," International Conference on Intelligent Computing in Information Technology for Engineering System (ICICITES-2021), SKN Singhad College of Engineering, Pandharpur, Maharashtra, 25-26 June 2021

## Book Chapters
- Mrs. B. Padma: "Enhancing Network Analysis Through Computational Intelligence in GANs," Enhancing Security in Public Spaces Through Generative Adversarial Networks (GANs), IGI Global, Apr. 2024
- Mrs. B. Padma: "Design of Next-Generation Field-Effect Transistors Using Machine Learning," Field Effect Transistors, Wiley, Mar. 2025

## Books Published
- Mrs Padma Bellapukonda: "Information and Communication Technology," Shree Publishing House, ISBN No: 5760319789357, November 2020

## Patents
- "Method for Secure Cloud Data Storage with Multi-Factor Authentication and AI Monitoring" - Published 18.10.2024, Application no: 202441075561
- "System and Method for Privacy-Preserving Data Analytics in Distributed Cloud Environments" - Published 18.10.2024, Application no: 202441075547
- "IOT Based Integrated aquaculture management system" - German Patent, Application Number: 202023105674, Granted: November 30, 2023

## FDPs/Workshops/Seminars/Training Programs
- Participated and Completed 6 days AICTE Training & Learning (ATAL) Academy-EduSkills FDP on "Juniper Mist - AI," 24.11.2025 to 29.11.2025
- Participated in a 40 hours offline Faculty Development Program on "Machine Learning Operations," 23.06.2025 to 28.06.2025
- Participated & Completed AICTE Training And Learning (ATAL) Academy Faculty Development Program on "AI-Powered Cyber Threat Intelligence: The Role of Generative AI in Modern Security," 18.08.2025 to 23.08.2025
- Participated in 5 days online FDP on "Cyber Security and Ethical Hacking," Organized by D Y Patil College of Engineering, Akurdi, 26.08.2024-30.08.2024
- Attended Five-Day Faculty Development Programme on "Building Advanced Data Analytics Applications With Cloud" Under Next Gen Employability Program, 08th to 12th Jan 2024, Organized by Edunet Foundation
- Attended One Week Faculty Development Programme on "Natural Language Processing (NLP)," Department of CSE, 13th to 17th Feb 2023, Organized by VNR Vignana Jyothi Institute of Engineering and Technology
- Attended One-Week Faculty Development Programme on "Scientific Documentation using Latex (SDL-2021)," Department of Engineering Mathematics and Humanities, SRKR Engineering College (A), Bhimavaram, 09 August 2021 to 14 August 2021
- Attended Three-Day Faculty Development Programme on "Cyber Security," Conducted by Anurag University, 03rd to 05th June 2020, Hosted by Department of ECE, in Association with ISTE and India Servers
- Attended Five-Day Faculty Development Programme on "Artificial Intelligence," Conducted by BVRIT College, 22nd to 26th May 2020, Organized by Department of CSE & IT
- Attended One-Week Professional Development Course on "Data Science And Big Data Analytics," Conducted by ICT Academy, 1st to 6th May 2017 at Swarnandhra College of Engineering & Technology, Seetharampuram, Narsapur, W. G. Dt.
- Attended One-Week Professional Development Course on "Advantage Pro Certified LINUX Professional," Conducted by Vectra Techno soft Pvt. Ltd., 12th to 16th May 2017 at Swarnandhra Institute of Engineering & Technology, Seetharampuram, Narsapur, W. G. Dt.
- Attended Six-Day Training Programme on "Internet Of Things Using Arduino And Raspberry Pi," Conducted by SVEC College, 17th to 22nd October 2016, Organized at Shri Vishnu Engineering College for Women, Bhimavaram
- Attended Five-Day Faculty Development Programme on "Igniting Genius Within Student Through Effective Teaching," Conducted by SCET College, 01st to 05th December 2015, Organized at Swarnandhra College of Engineering & Technology, Seetharampuram, Narsapur, W. G. Dt.
`;

const IT_SRI_LAKSHMI_DEVI_TEXT = `
## Educational Qualifications
- M.Tech in Software Engineering from Shri Vishnu Engineering College for Women, JNTUK, 2011
- B.Tech in Computer Science and Engineering from Shri Vishnu Engineering College for Women, JNTUK, 2009

## Professional Details
- Teaching Experience: 3 years 9 months

## Research Focus Areas
- Machine Learning
- Deep Learning
- Artificial Intelligence

## Professional Development Activities
- Completed 5-day online FDP on "Cyber Security and Ethical Hacking" (August 26-30, 2024) from D Y Patil College of Engineering
- Attended 5-day workshop on Sustainable AI applications and LLM Technologies for Health Data Analytics (April 22-26, 2024)
- Completed workshop on IoT and Framework implementation (June 24-30, 2021)
`;

const IT_PRASANTHI_TEXT = `
## Educational Qualifications
- M.Tech: Computer Science and Engineering, JNTUK, 2016
- B.Tech: Computer Science and Engineering, JNTUK, 2011

## Professional Information
- Teaching Experience: 3 years 9 months

## Areas of Specialization
- Machine Learning
- Deep Learning

## Professional Development Activities
- Cyber Security and Ethical Hacking (5 days, D Y Patil College of Engineering, Akurdi, 26-30 August 2024)
- Revolutionary AI: Blending Generative Power with Learning Machines (5 days, 16-20 December 2024)
- Power of Visualization in Analytics (16-21 August 2023)
- Natural Language Processing workshop (13-17 February 2023)
- Software Testing: Emerging Trends (26-30 July 2021)
`;

const IT_GRACE_PRIYANKA_TEXT = `
## Education
- M.Tech: CSE, Swarnandhra College of Engineering, JNTUK, 2015
- B.Tech: IT, Shri Vishnu Engineering College for Women, JNTUK, 2013

## Experience
- Teaching Experience: 1 Year 8 Months

## Specialization & Research Areas
- Machine Learning
- Deep Learning

## Professional Development
FDP/Workshops Attended:
- Online FDP on "Machine Learning Applications for Engineers" - Chaitanya Bharathi Institute of Technology, Hyderabad (03.06.2024-07.06.2024)
- Workshop on Machine Learning Applications for Engineers (03.06.2024-07.06.2024)
- Workshop on Mathematical Modeling for Data Science (19.06.2023-24.06.2023)
- Workshop on Business Intelligence Using Power BI (10.12.2022-11.12.2022)
- Workshop on IoT and its Framework-Hands on (24.06.2021-30.06.2021)
`;

const IT_LAKSHMI_TEJASWI_TEXT = `
## Educational Qualifications
- M.Tech: Software Engineering, Shri Vishnu Engineering College for Women, JNTU K, 2016
- B.Tech: Computer Science and Engineering, Swarnandhra College of Engineering, JNTU K, 2013

## Professional Details
- Teaching Experience: 3 Years

## Specialization & Research Areas
- Machine Learning
- Data Science

## Professional Development Activities
Faculty Development Programs/Workshops:
- Participated in 5-day online FDP on "Cyber Security and Ethical Hacking" (D Y Patil College of Engineering, Akurdi, 26-30 August 2024)
- Workshop: Cyber Security and Ethical Hacking (26-30 August 2024)
- Workshop: Natural Language Processing (NLP) (20-25 February 2023)
- Workshop: Power of Visualization in Analytics (16-21 August 2023)
- Workshop: Software Testing: Emerging Trends (26-30 July 2021)
`;

const IT_DILEEP_KUMAR_TEXT = `
## Educational Qualifications
- Ph.D.: GIET University, Gunupur, Odisha, 2025
- M.Tech: CSE, Swarnandhra College of Engineering and Technology (JNTUK), Narasapuram, 2012
- B.Tech: CSE, Swarnandhra College of Engineering and Technology (JNTUH), Narasapuram, 2007

## Experience Summary
- Total Experience: 17 Years
- Teaching Experience: 15 Years
- Research Experience: 10 Years
- Industry Experience: 2 Years (Software Developer)

## Research & Specialization Areas
- Machine Learning, Artificial Intelligence, Evaluation Metrics, Optimization, Game Theory & Neutrosophic Logics, Programming, Web Technologies, Internet of Things

## Textbooks Authored
- "Applications of Artificial Intelligence" - Shree Publishing House, ISBN: 978-93-47167-68-3 (2026)
- "Machine Learning" - Shree Publishing House, ISBN: 978-93-95250-72-6 (2025)
- "Advanced Data Analysis Using Python" - Shree Publishing House, ISBN: 978-93-95250-48-1 (2025)
- "Application Development Using Python" - Shree Publishing House, ISBN: 978-93-95250-67-2 (2025)
- "Web Scraping with Python" - Shree Publishing House, ISBN: 978-93-95250-85-6 (2025)
- "Data mining techniques using R" - Shree Publications House, ISBN: 978-93-95250-29-0 (2024)
- "Python Programming" - Shree Publications House, ISBN: 978-93-95250-64-1 (2024)
- "Data Mining and Data warehousing" - Vedashree Publisher's, ISBN: 978-81-982327-4-8 (2024)
- "Digital Literacy" - Shree Publications House, ISBN: 978-93-95250-24-5 (2024)
- "Introduction to Data Science and R Programming" - Shree Publications House, ISBN: 978-93-88196-94-9 (2023)
- "Big Data Analytics Using Spark" - Shree Publications House, ISBN: 978-93-88196-62-8 (2023)
- "Data Visualization" - Shree Publications House, ISBN: 978-93-95250-11-5 (2023)
- "Fundamentals of IOT and Robotics" - Shree Publications House, ISBN: 978-93-95250-09-2 (2023)
- "OOPS through JAVA" - Shree Publications House, ISBN: 978-93-91117-26-9 (2022)
- "Web Technologies" - Shree Publications House, ISBN: 978-93-91117-32-0 (2021)
- "Database Management Systems" - Shree Publications House, ISBN: 978-93-88196-52-9 (2020)

## Research Articles & Publications
- Kadali, Dileep Kumar. "MapReduce-Based Crime Data Analysis in Machine Learning." Journal of Computer Science and Engineering Research (JCSER), vol. 2, no. 1, June 30, 2025
- Dr.K.Dileep Kumar. "Uncertain Crime Data Analysis Using Hybrid Approach." Discover Artificial Intelligence, Springer Nature, Feb. 2025
- Dr.K. Dileep Kumar. "Crime Data Analysis Using Naive Bayes Classification and Least Square Estimation with MapReduce." International Journal of Computational Methods and Experimental Measurements, Sept. 2024
- Kadali, Dileep Kumar. "Machine Learning Approach for Corona Virus Disease Extrapolation: A Case Study." International Journal of Knowledge-Based and Intelligent Engineering Systems, vol. 26, 2022, pp. 219-227
- "Enhancing Crime Cluster Reliability Using Neutrosophic Logic and a Three-Stage Model" in Journal of Engineering Science and Technology Review (JESTR), Oct-2023 (Scopus)
- "Improving Air Quality in the Environment Using IoT and Drones" in European Chemical Bulletin, Oct-2023
- "Crime data optimization using neutrosophic logic based on game theory" in Concurrence Computat Pract Expert by Willey, Mar-2022 (SCI & Scopus)
- "Unsupervised based Crimes Cluster Data Using Decision Tree Classification" in Solid State Technology, Volume 63, Issue 5, page 5387-5394, Nov-2020
- "Precise Vehicle Tracking Ways Exhausting Arduino" in Journal for Research, Volume 07, Issue 12, Nov 2018
- "Intensification of Home Automation using IoT" in Journal for Research, Volume 03, Issue 01, March 2017
- "Cluster Optimization for Similarity Process Using De-Duplication" in IJSRD - International Journal for Scientific Research & Development, VOL. 4, Issue 06, AUG-2016
- "Optimizing the Duplication of Cluster Data for Similarity Process" in ANU Journal of Physical Science, VOL-2, JUN-DEC, 2014
- "Similarity based Query Optimization on Map Reduce using Euler Angle Oriented Approach" in International Journal of Scientific & Engineering Research, Volume 3, Issue 8, August-2012

## Book Chapters
- Kadali, Dileep Kumar. "Cluster Query Optimization Technique Using Blockchain" In: Proceedings of the 2nd International Conference on Cognitive and Intelligent Computing. ICCIC 2022. Springer, Singapore (Scopus)
- Kadali, Dileep Kumar. "Estimation of Data Parameters Using Cluster Optimization" In: Data Management, Analytics and Innovation. ICDMAI 2022. Springer, Singapore (Scopus)
- Kadali, Dileep Kumar. "Shortest Route Analysis for High-Level Slotting Using Peer-to-Peer" in The Role of IoT and Blockchain, 1st Edition, Apple Academic Press (Taylor Francis Group), Mar-2022 (Scopus)

## Patents
- "Method for End-to-End Encryption and Secure Key Distribution in IoT-Based Smart Grids" - Published 18.10.2024, Application no: 202441075545
- "System and Method for Smart Privacy Management in IoT Healthcare Devices" - Published 06.10.2024, Application no: 202441075548
- "System and Method for Cluster Optimization for Crime Analysis" - Published 10-Mar-2022, Application no: 202231012957
- "Artificial Intelligence Approach to Health Care Monitoring System using Internet of Things" - Published 26-Feb-2021, Application no: 202141006202
- "A Modern Analysis of Autism Spectral Disorder of Electronic Health Records" - Published 25-Dec-2020, Application no: 202041005601
`;

const IT_CH_THARAK_TEXT = `
## Educational Qualifications
- M.Tech in CSE from Mallineni Lakshmaiah Engineering College, JNTU K, 2014
- B.Tech in IT from AM Reddy Memorial College of Engineering & Technology, JNTU K, 2012

## Professional Details
- Teaching Experience: 3 years

## Specializations & Research Areas
- Cloud Computing
- DevOps in AWS
- Computer Networks

## Professional Affiliations
- Life Membership in CSI

## Certifications
- AWS Solutions Architect-Associate (September 2020; recertified December 2023)
- Cisco Certified Network Professional (CCNP) - July 2021
- Cisco Certified Network Associate (CCNA) - July 2021

## FDPs/Workshops/Seminars/Training Programs
- 5 days online FDP on "Cyber Security and Ethical Hacking" - Organized by D Y Patil College of Engineering, Akurdi (26.08.2024-30.08.2024)
- One Week FDP on Power of Visualization in Analytics (August 2023)
- One Week FDP on "Cloud Infrastructure (AWS)" (August 2023)
- Workshop on Natural Language Processing (NLP) (13.02.2023-17.02.2023)
`;

const IT_CH_RAJA_RAJESWARI_TEXT = `
## Educational Qualifications
- M.Tech in Computer Science, Jagruti Institute of Engineering & Technology, Hyderabad, 2016
- B.E in Computer Science, M.V.S.R Engineering College, Hyderabad, 2006

## Experience
- Teaching experience of one year and six months

## Publications
Journal Publication:
- "Identity-Based Encryption with Outsourced Revocation in Cloud Computing" (co-authored with Mr. G. Lakpathi), published in International Journal of Research, Volume 03 Issue 10, June 2016

Conference Publication:
- "Colour Analysis and Classification Based on Deep Learning Technique," presented at the 9th International Conference on Information and Communication Technology for Intelligent Systems (ICTIS 2025), Springer, January 2026

## Patents Filed
- "AI-Based Method for Anomaly Detection in High-Speed Networks and Data Centers" (Application no: 202441075544)
- "System and Method for Smart Privacy Management in IoT Healthcare Devices" (Application no: 202441075548)
- "System and Method for Privacy-Preserving Data Analytics in Distributed Cloud Environments" (Application no: 202441075547)

## FDPs/Workshops/Seminars/Training Programs
- 6 days AICTE Training & Learning (ATAL) Academy-EduSkills FDP on "Juniper Mist - AI" (24.11.2025 to 29.11.2025)
- "Capacity Building Programme on Cybersecurity" - Basic Course (04.09.2025 to 08.09.2025)
- Faculty Development Programme on QT-07 Quantum Sensing - 40 hours, funded by MeitY and endorsed by DST-NQM/AICTE/UGC (26.09.2025 to 17.10.2025)
- AICTE Training And Learning (ATAL) Academy Faculty Development Program on "AI-Powered Cyber Threat Intelligence: The Role of Generative AI in Modern Security" (18.08.2025 onwards)
- Faculty Development Program on "AI Mastery for Educators" (15.05.2025 to 07.06.2025)
- Online FDP on "Full Stack Java" conducted by Skill Dzire in collaboration with AICTE (03.10.2024 to 03.11.2024)
- Online FDP on "Machine Learning Applications for Engineers" conducted by Chaitanya Bharathi Institute of Technology, Hyderabad, in Technical Association with ACM Hyderabad Deccan Chapter (03.06.2024 to 07.06.2024)
- One week national level FDP on "Emerging Research Trends in Computer Science" organized by Chaitanya Bharathi Institute of Technology (A), Hyderabad, in Technical Association with ACM Hyderabad Deccan Chapter (22.04.2024 to 26.04.2024)
- 4-day workshop on NLP, Computer Vision And Artificial Intelligence organized by Andhra Pradesh State Skill Development Corporation in Collaboration with ExcelR Edtech Pvt. Ltd. (04.12.2023 to 08.12.2023)
`;

const IT_D_SRINIVASA_RAO_TEXT = `
## Education & Credentials
- Ph.D. (Pursuing): GIET University, Gunupur, Odisha
- M.Tech: CSE, Srinivasa Institute of Engineering and Technology, 2015
- B.Tech: IT, AMReddy Memorial College of Engineering and Technology, 2012
- Teaching Experience: 8 years

## Research Specialization
- Machine Learning and Deep Learning

## Publications in Journals
- "Exploring the Potential of Federated Learning to Empower Credit Card Fraudulent Transaction Detection with Deep Learning Techniques," Proceedings on Engineering Sciences, University of Kragujevac, Mar. 2025
- Kadali et al., "Empathy of Diabetics through Supervised Machine Learning Model," Grenze International Journal of Engineering and Technology, Jan 2024
- "A research study of Heart Health Monitoring using Deep Learning and IOT" - IEEE Xplore
- "A Framework for smart & secure Vehicle Intelligence Life Monitoring System" - IEEE Xplore

## Books Published
- Kadali, D. Srinivasa Rao, and PLVD Ravi Kumar, Data Visualization, Sree Publications, Nov 2023, ISBN: 978-93-88196-44-4
- "The Impact of Cloud Computing on Organisational Agility and Competitive Advantage in Management Information Systems," Interdisciplinary Approaches to AI, Internet of Everything, and Machine Learning, IGI Global, Dec. 2024

## FDPs/Workshops/Seminars Attended
- AICTE ATAL Academy FDP on "International Trends in AI and Supercomputing for Climate, Energy & Health" at Srinivasa Institute of Engineering and Technology (08.09.2025-13.09.2025)
- AICTE ATAL Academy FDP on "AI-Powered Cyber Threat Intelligence: The Role of Generative AI in Modern Security" (18.08.2025-23.08.2025)
- Faculty Development Program on "Quantum Computing" (11.08.2025-18.08.2025)
- Online FDP on "Data Science" conducted by Skill Dzire in collaboration with AICTE (03.10.2024-03.11.2024)
- Virtual Hands-on FDP on "Cloud Computing Using AWS" by Mohan Babu University and APSSDC (08.07.2024-13.07.2024)
- 5-Day Online International FDP on "Data Analyst- Everyday Learning Program" by APSSDC and ExcelR (19.06.2023-23.06.2023)
- One-Week FDP on "IoT with Machine Learning" by PVKK Institute of Technology and Pantech E Learning (27.11.2023-02.12.2023)
- Five-Day FDP on "Research Methodology on Machine Learning and Data Science" by B.V. Raju Institute of Technology
- Five-Day FDP on "Power of Visualization Analysis" by B.V. Raju Institute of Technology
- Co-coordinator in masterclass on battery management system
- One-Week FDP on "Cloud Infrastructures (AWS)" by IT Department, SRKR Engineering College with Braino Vision Solution and AICTE
- 12-Week course on "Research Methodology" from IIT Kharagpur (Jan-Apr 2025)

## Conference Publications
- Dangeti, Suma Bharati M., Yesujyothi Yerramsetti, and Yeddu Sabitha, "Malware Detection Using a Novel Machine Learning Dynamic Ensemble Classification Approach," International Conference on E-Mobility, Power Control and Smart Systems (ICEMPS 2024), IEEE, June 2024
- "Empathy of Diabetics through Supervised Machine Learning Models," 15th International Conference on Advances in Computing, Control, and Telecommunication Technologies (ACT 2024), Grenze Scientific Society, Nov. 2024
- "Secure Pool Mining through SVM-Based Miner Classification and Computation Validation in Blockchain Networks," 22nd OITS International Conference on Information Technology (OCIT 2024), IEEE, Dec. 2024
- "A Framework for Smart & Secure Vehicle Intelligent Life Monitoring System," 2023 1st DMIHER International Conference on Artificial Intelligence in Education and Industry 4.0 (IDICAIEI), Wardha, India, 2023
- S. R. Dangeti et al., "Malware Detection Using a Novel Machine Learning Dynamic Ensemble Classification Approach," 2024 International Conference on E-mobility, Power Control and Smart Systems (ICEMPS), Thiruvananthapuram, India, 2024
- R. Dhulipudi, S. R. Dangeti, and colleagues, "A Framework for Smart & Secure Vehicle Intelligent Life Monitoring System," 2023 1st DMIHER International Conference on Artificial Intelligence in Education and Industry 4.0 (IDICAIEI), Wardha, India, 2023

## Patents
- "AI-Powered System for Dynamic Resource Allocation in Cloud Networks" (Published 18.10.2024, Application no: 202441075546)
- "AI-Driven System for Real-Time Intrusion Detection in Cloud Infrastructure" (Published 18.10.2024, Application no: 202441075549)
`;

const IT_PLVD_RAVI_KUMAR_TEXT = `
## Educational Qualifications
- M.Tech: CSE, Sri Rama Institute of Technology & Sciences, Penuballi, Khammam (JNTU Hyderabad affiliation), 2015
- B.Tech: CSE, AnuBose Institute of Technology, New Palvoncha, Khammam (JNTU Hyderabad affiliation), 2013
- Teaching Experience: 8 Years

## Publications in Journals & Conferences
- "Integrating IoT and Blockchain for Seamless Accounting Systems," AIP Conference Proceedings: 2024 International, American Institute of Physics, July 2025
- "Empathy of Diabetics through Supervised Machine Learning Models," 15th International Conference on Advances in Computing, Control, and Telecommunication Technologies (ACT 2024), Grenze Scientific Society, November 2024
- "Simulate the Machine Learning Algorithm to Organize the CRAHN Network System," 2023 3rd International Conference on Advancement in Electronics & Communication Engineering (AECE), Ghaziabad, India, 2023, pp. 613-617
- "Integrity of Code and IoT Validation of Resource Utilization in Micro Control Unit," 2023 International Conference on New Frontiers in Communication, Automation, Management and Security (ICCAMS), Bangalore, India, 2023, pp. 1-6
- P. Prabakaran, L. Chandra Sekhar Reddy, L. Ravikumar and M. K. Verma, "Simulate the Machine Learning Algorithm to Organize the CRAHN Network System," 2023 3rd International Conference on Advancement in Electronics & Communication Engineering (AECE), Ghaziabad, India, 2023, pp. 613-617
- R. K. Kushwaha, P. L. Ravikumar, M. H. Mohammed and C. Sasthi Kumar, "Integrity of Code and IoT Validation of Resource Utilization in Micro Control Unit," 2023 International Conference on New Frontiers in Communication, Automation, Management and Security (ICCAMS), Bangalore, India, 2023, pp. 1-6
- "Effective Scheduling Algorithm for Workload Forecasting in Fog Environment Utilizing Dual Interactive Wasserstein Generative Adversarial Network," IEIE Transactions on Smart Processing & Computing, Institute of Electronics Engineers of Korea, October 2024

## Faculty Development Programs (FDPs) & Training
- AICTE Training & Learning (ATAL) Academy-EduSkills FDP on "Juniper Mist - AI," 24-29 November 2025
- FDP on "Smart Solution and Digital Innovation in Engineering," 8-12 December 2025
- One Week Online FDP on "Exploring Generative AI: Foundations, Models and Real-World Applications in Vision and Language," 25-30 August 2025
- National Level Short Term Training Program-2K24 on JAVA Full Stack with React JS & AI, Conducted by Brainovision Solutions, Hyderabad, and AICTE, 2-22 December 2024
- ISTE Approved One Week FDP on "The role of Teachers in NEP 2020 Implementation" with 'A' Grade, D.Y.Patil College of Engineering Akurdi, Pune, 21-25 August 2023
- One Week National Level FDP on "Cloud Infrastructure (AWS)," AISSMS Institute of Information Technology, Pune, in collaboration with Brain vision Solutions Pvt Ltd & AICTE, 21-25 August 2023
- One week NBA Accreditation Programme through NITTR, Chennai, November 2022
- One week BootCamp on Internet of Things through Pantech E-Learning
- FDP on "Data Analytics using Power BI," Saint Bishop Institute of Technology and Science, Chennai, March-April 2022
- One month online Artificial Intelligence organized by Pantech e-Learning Pvt Ltd, 23 November - 22 December 2022
- One week FDP on "Cloud computing and its applications," GPREC, 28 November - 3 December 2022
- One month online Advanced python programming organized by Pantech e-Learning Pvt Ltd, 2023
- APSSDC Conducted FDP program for Advanced Web Technologies and Springs, October-December 2015
- One Week National Level Faculty Development Program on "Secure cyber space using machine learning & block chain Tech.," Department of Information Technology, Vardhaman College of Engineering, Hyderabad, Telangana, 11-17 September 2023
- One Week National Level Faculty Development Program on "Cloud Infrastructure (AWS)," Department of Information Technology, AISSMS, in collaboration with Brain O Vision Solutions India Pvt Ltd, 21-25 August 2023

## Books Published
- "Cloud Based Security Management," ISBN No: 978-81-964397-8-1, Publisher: San International Scientific Publications (SISP), Government of India, Published 30 July 2023
- "Data Visualization," ISBN No: 978-93-95250-11-5, Publisher: Shree Publishing House, Visakhapatnam, India, Published 2023

## Patents
- "Device for Modulation Techniques," Inventor, Published 26 November 2023, Application No: 39651-001
- "Method for End-to-End Encryption and Secure Key Distribution in IoT-Based Smart Grids," Inventor, Published 18 October 2024, Application No: 202441075545
- "System and Method for Smart Privacy Management in IoT Healthcare Devices," Inventor, Published 6 October 2024, Application No: 202441075548
- Indian Design Patent "Device For Modulation Techniques," Patent Number: 396519-001, Filing Date 3 January 2023, Published 24 December 2023
`;

const IT_M_SRINIVASA_RAO_TEXT = `
## Education
- PhD (pursuing): Amrita Vishwa Vidyapeetham, Chennai
- M.Tech: CSE, JNTU K, 2014
- M.Sc.: Computer Science, Andhra University, 2007

## Professional Details
- Teaching Experience: 12 years

## Specializations
- Deep Learning
- Computer Vision
- Retrieval Augmented Generation

## Professional Affiliations
- Member of Computer Society of India (ID: 5081240001) since February 2024

## Recent Patents
- "Intelligent Network Traffic Management Using AI-Based Routing Algorithms" (Published October 2024)
- "Secure Cloud Data Storage with Multi-Factor Authentication and AI Monitoring" (Published October 2024)

## Recent NPTEL Courses Completed
- "Programming in Java" (IIT Kharagpur, 2024)
- "Introduction to Internet of Things" (IIT Kharagpur, 2024)
- "Operating System Fundamentals" (IIT Kharagpur, 2025)
`;

const IT_Y_SABITHA_TEXT = `
## Education
- M.Tech: Computer Science and Engineering, University College of Engineering-Vizianagaram, 2022
- B.Tech: Computer Science and Engineering, Shri Vishnu Engineering College for Women, Bhimavaram, 2019

## Professional Details
- Teaching Experience: 1 year

## Specialization
- Network Security

## Publications
- "Malware Detection Using a Novel Machine Learning Dynamic Ensemble Classification Approach" (2024 International Conference on E-mobility, Power Control and Smart Systems)

## Professional Development
- AICTE ATAL Academy FDP on AI-Powered Cyber Threat Intelligence (August 2023)
- One-week National FDP on AI Tools, SRKR Engineering College (February 2025)
- Five-day FDP on Power of Visualization in Analytics, BVRIT Hyderabad (August 2023)

## Patents
- "AI-Based Method for Anomaly Detection in High-Speed Networks and Data Centers" (Application no: 202441075544, October 2024)
`;

const IT_RAJEEV_KUMAR_TEXT = `
## Educational Qualifications
- M.Tech: CSE, Kakinada Institute of Technology & Science, JNTU Kakinada, 2014
- B.Tech: CSE, Pragati Engineering College, Surampalem, JNTUK Kakinada, 2008

## Professional Details
- Teaching Experience: 8 years

## Specializations
- Cloud Computing
- Network Security

## Faculty Development Programs
- Five-day FDP on "Cloud Infrastructure (AWS)" at AISSMS Institute of Information Technology, Pune (21-25 August 2023)
- AICTE ATAL Academy five-day FDP on "Design Thinking and Prototyping for Industry 4.0" at Shri Vishnu Engineering College for Women (20-25 November 2023)
- One-week FDP on "LATEX" organized by CSE and CSBS departments, VNRVJIET, with CSI collaboration (4-9 April 2023)
- Faculty Development Program on "Large Language Models in artificial Intelligence" via AP Information Technology Academy and Blackbuck Engineers (4-7 October 2023)
- One-week FDP on "Mathematical Modelling for Data Science" organized by VNR Vignana Jyothi Institute (19-24 June 2023)
- Five-day FDP on "Power of Visualization in Analytics" at BVRIT Hyderabad College of Engineering for Women (16-21 August 2023)
- AICTE-VAANI workshop on "HPC and Quantum Technology for Next-Generation Smart Cities & Intelligent Mobility Applications" in Tamil (23-25 September 2025)
- AICTE ATAL Academy FDP on "Quantum Artificial Intelligence and High Performance Computing for Industrial Digital Twins" at Amrita Viswa Vidyapeetham Chennai Campus (9-14 September 2024)
- One-week national-level FDP on "Cloud Infrastructure (AWS)" at AISSMS Institute of Information Technology, Pune, with Brain Vision Solutions and AICTE (21-25 August 2023)

## NPTEL Courses
- Successfully completed "Internet of Things (8 Weeks Course)" conducted by IIT Kharagpur (July-December 2020)

## Publications
- Rajeev Kumar, GAKS. "Develop an AI-Driven Interview Optimization: For Enhancing Interview Skills." 9th International Conference on Information and Communication Technology for Intelligent Systems (ICTIS 2025), Springer, January 2026
- Rajeev Kumar, G. A. K. S. "Harvesting Growth: Leveraging Random Forests for Advancing Agricultural Productivity with Machine Learning." Advances in Science, Technology and Innovation, Springer Nature, February 2025
- S. Kolli, S. Faiz Ahamed, G. A. K. S. R. Kumar, S. K. Maddila, Y. Komali, and S. Rao Bheesetty. "Underwater Image Quality Enhancement using Multiscale Image Fusion." 2023 Second International Conference on Augmented Intelligence and Sustainable Systems (ICAISS), Trichy, India, pp. 1064-1070
- Chandra Sekhar Kolli, Dr. D. Venkata Naga Raju, V. Pavan Kumar, D. Srinivasa Rao, P. Vinay, G. A. K. S. Rajeev Kumar. "Exploring The Potential of Federated Learning to Empower Credit Card Fraudulent Transaction Detection with Deep Learning Techniques." Proceedings on Engineering Sciences, Faculty of Engineering, University of Kragujevac, March 2025
- Kolli, Chandra Sekhar, and Kumar, G. A. K. S. Rajeev. "Underwater Image Quality Enhancement using Multiscale Image Fusion." Proceedings of the 2023 2nd International Conference on Augmented Intelligence and Sustainable Systems (ICAISS2023), pp. 1064-1070 (Scopus Indexed)
`;

const IT_VINAY_TEXT = `
## Education
- M.Tech: CSE, JNTU, Kakinada, 2014
- MSc: Computer Science, Andhra University, 2010
- BSc: Computer Science, Andhra University, 2008
- Teaching Experience: 09 Years

## Specialization & Research Areas
- Machine Learning
- Deep Learning

## Publications
- Vinay. "Exploring the Potential of Federated Learning to Empower Credit Card Fraudulent Transaction Detection with Deep Learning Techniques." Proceedings on Engineering Sciences, Faculty of Engineering, University of Kragujevac, Mar. 2025
- P. Vinay and Raja Rajeswari Jetti. "Query based Video Analysis of Frames Using Support Vector Machine." Caribbean Journal of Science and Technology, Volume 3, Issue 8, August 2015

## Books Published
- Artificial Intelligence and ChatGPT (Scientific International Publishing House, ISBN: 9789357576031, November 2023)
- Introduction to Data Science and R Programming (Shree Publishing House, ISBN: 978-93-88196-94-9, 2024)

## Patents
- "Method for Secure Cloud Data Storage with Multi-Factor Authentication and AI Monitoring" (Application no: 202441075561, 18.10.2024)
- "AI-Powered System for Dynamic Resource Allocation in Cloud Networks" (Application no: 202441075546, 18.10.2024)

## Professional Development
Courses Completed:
- Programming in Java (IIT Kharagpur, 12 weeks, Jan-Apr 2024)
- Introduction to Internet of Things (IIT Kharagpur, 12 weeks, Jan-Apr 2025)
- Java Language Features (Infosys)

FDPs/Workshops:
- Machine Learning Applications for Engineers (Chaitanya Bharathi Institute of Technology, 03.06.2024-07.06.2024)
- Mathematical Modelling for Data Science (VNR Vignana Jyothi Institute, June 19-24, 2023)
- Digital Creativity Skills (Adobe Academic Essentials, June 2023)
`;

const IT_OM_SRI_SAI_KRISHNA_TEXT = `
## Educational Qualifications
- M.Tech in CSE from Kakinada Institute of Engineering & Technology, JNTU K, 2016
- B.Tech in IT from AM Reddy Memorial College of Engineering & Technology, JNTU K, 2012

## Professional Details
- Teaching Experience: 2 years

## Specialization & Research Areas
- Machine Learning
- Deep Learning

## Professional Development
- Completed 5-day online FDP on "Cyber Security and Ethical Hacking" (August 26-30, 2024)
- Participated in One Week National Level FDP on "Cloud Infrastructure (AWS)" (August 21-25, 2023)
- Completed online FDP on "Machine Learning Applications for Engineers" (June 3-7, 2024)
`;

const IT_BHANU_RANGA_RAO_TEXT = `
## Academic Credentials
- Ph.D.: CSE, Saveetha University, 2025
- M.Tech: CSE, Swarnandhra College of Engineering and Technology, JNTU Kakinada, 2019
- B.Tech: IT, Swarnandhra College of Engineering and Technology, JNTU Kakinada, 2011

## Professional Experience
- Teaching: 6 years
- Industry: 4 years

## Specialization
- Machine Learning

## Publications (International Conferences & Journals)
- "Sentiment Analysis and Population-Based Optimization for Estimating Human Lifespan Using Daily Activities" - 8th International Conference on I-SMAC (IoT in Social, Mobile, Analytics and Cloud), IEEE, November 2024
- "Automatic Multiple-Choice Question and Answer (MCQA) Generation Using Deep Learning Model" - Proceedings of the 2nd International Conference on Cognitive and Intelligent Computing (ICCIC 2022), Springer Singapore
- Co-authored with Mamillapalli Chilaka Rao and P. Sreedhar on MCQA Generation using Deep Learning - Cognitive Science and Technology book series
- "Urban Object Detection in UAV Imagery for Healthcare Applications: Leveraging IoT in Smart Cities" - 2023 International Conference on Sustainable Emerging Innovations in Engineering and Technology (ICSEIET)

## Online Courses Completed
- Programming in Java (12 weeks) - IIT Kharagpur, January-April 2024
- Introduction to Machine Learning (12 weeks) - IIT Madras
- Deep Learning (12 weeks) - IIT Madras
- Digital Image Processing (12 weeks) - IIT Kharagpur
- Data Science for Engineers (8 weeks) - IIT Madras

## Faculty Development Programs
- Machine Learning Applications for Engineers - Chaitanya Bharathi Institute of Technology, Hyderabad with ACM (June 3-7, 2024)
- Power of Visualization in Analytics - BVRIT, Hyderabad (August 16-21, 2023)
- Cloud Infrastructure (AWS) - Pragati Engineering College, Surampalem with Brainovision Solutions and AICTE (August 21-25, 2023)
- SPSS in Research - Star International Foundation for Research and Education (December 26-30, 2023)
- Data Science and Its Applications - Cyber Security and Data Science, Bapatla Engineering College (August 7-9, 2023)
- Power of Visualization in Analytics - IT/CSE/CSE(AI&ML), BVRIT Hyderabad College of Engineering for Women
- Artificial Intelligence and Machine Learning - Department of Computer Science and Engineering, CMR Technical Campus, Hyderabad
- Introduction to Data Analytics Using R: Hands-on Approach - Indore Institute of Management & Research
- Artificial Intelligence and its Applications - Department of Computer Science and Engineering, Ramachandra College of Engineering, Eluru
- Cyber Security - Swarnandhra College of Engineering & Technology with Indian Servers

## Patents
- "System and Method for Intelligent Network Traffic Management Using AI-Based Routing Algorithms" - Published October 18, 2024, Application No. 202441075551
- "Method for Secure Cloud Data Storage with Multi-Factor Authentication and AI Monitoring" - Published October 18, 2024, Application No. 202441075561

## Book Chapters
- "Machine Learning-Augmented Blockchain-Based Graphene Field-Effect Transistor Sensor Platform for Biomarker Detection" - Field Effect Transistors, Wiley, March 2025

## Published Textbook
- Introduction to Data Science and R Programming - Shree Publishing House, ISBN: 978-93-88196-94-9, 2024
`;

const IT_YESU_JYOTHI_TEXT = `
## Educational Qualifications
- Ph.D.: Pursuing at GIET University, Gunupur, Odisha
- M.Tech: CSE, Kakinada Institute of Engineering & Technology, JNTUK, Kakinada, 2013
- M.Sc.: CSE, Aurora's P.G. College, Osmania University, Hyderabad, 2006
- B.Sc.: CSE, Annie Besant Women's College, Osmania University, Hyderabad, 2004
- Teaching Experience: 14 years 8 months

## Research Areas
- Image Processing
- Big Data
- Data Science
- Explainable AI

## Research Papers
- "Sentiment Analysis and Population-based Optimization for Estimating Human Lifespan using Daily Activities," 2024 8th International Conference on I-SMAC (IoT in Social, Mobile, Analytics and Cloud), Kirtipur, Nepal, 2024, pp. 764-768
- "AutoCodeEval: A Web-Based Automatic Programming Assignment Evaluator," Journal of Harbin Engineering University (Scopus Indexed), August 2023
- "Multimodal Sign Language Translation System," Lecture Notes in Networks and Systems, Springer, January 2026
- "A PCM Framework for Quantum Computing: Insights in Key Models and Algorithms," 5th International Conference on Sustainable Communication Networks and Application (ICSCNA 2024), IEEE, December 2024
- "Malware Detection Using a Novel Machine Learning Dynamic Ensemble Classification Approach," International Conference on E-Mobility, Power Control and Smart Systems (ICEMPS 2024), IEEE, June 2024

## Patents
- "AI-Based Method for Anomaly Detection in High-Speed Networks and Data Centers" - Published 18.10.2024, Application no: 202441075544
- "System and Method for Intelligent Network Traffic Management Using AI-Based Routing Algorithms" - Published 18.10.2024, Application no: 202441075551
- "An Automated Iris Recognition Based Authentication and Gender Classification Using Neural Network for Cyber Security Investigation" - Patent number: 2021104108, Australian Patent Office, Grant Date: 23-03-2022

## Books Published
- "Principles of Data Science" - ISBN: 978-93-5757-535-5, Published by Scientific International Publishing House (SIPH), 2023

## FDPs and Workshops
- 12-week FDP on "Artificial Intelligence: Concepts and Techniques" (July-October 2025)
- AICTE ATAL Academy FDP on "International Trends in AI and Supercomputing for Climate, Energy & Health" - Srinivasa Institute of Engineering and Technology (08.09.2025-13.09.2025)
- AICTE ATAL Academy FDP on "AI-Powered Cyber Threat Intelligence: The Role of Generative AI in Modern Security" (18.08.2025-23.08.2025)
- 3-Day online FDP on "Bridging Academia and Industry: Strategic Synergies for Multidisciplinary Excellence" (28.07.2025-30.07.2025)
- Online FDP on "Data Science" - Skill Dzire in collaboration with AICTE (03.10.2024-03.11.2024)
- Online FDP on "Machine Learning Applications for Engineers" - Chaitanya Bharathi Institute of Technology, Hyderabad with ACM Hyderabad Deccan Chapter (03.06.2024-07.06.2024)
- One-Day Workshop on "Mastering the Art of Article & Research Proposal Writing" - SRKR Engineering College (28.09.2024)
- One-Week National-Level online Workshop on "Learning Methods in Artificial Intelligence" - ACM Hyderabad Deccan Professional Chapter at Chaitanya Bharathi Institute of Technology (12.04.2025-17.05.2025)
- 3-Day National Level Workshop on "AI-Augmented Scientific Writing and Publishing" - Vardaman College of Engineering, Hyderabad (14.02.2024-16.02.2024)
- Five-Day Faculty Development Program on "NLP, Computer Vision and Artificial Intelligence" - Andhra Pradesh State Skill Development Corporation (APSSDC) in collaboration with Excel Edtech Pvt. Ltd (04.12.2023-08.12.2023)
- One-Week National Level FDP on "AI TOOLS AND PROMPT ENGINEERING" - Department of CSE, Anil Neerukonda Institute of Technology and Sciences (27.11.2023-02.12.2023)
- One-Week National Level FDP on "Statistical and Probability Insights for Data Science: Applications and Use cases" - Vardhaman College of Engineering (06.11.2023-10.11.2023)
- One-Week National Level FDP on "Secure cyber space using machine learning & block chain Technology" - Vardhaman College of Engineering (11.09.2023-15.09.2023)
- Five-Day FDP on "Power of Visualization in Analytics" - BVRIT Hyderabad College Of Engineering For Women (16.08.2023-21.08.2023)
- One-Week National Level FDP on "Cloud Infrastructure (AWS)" - SRKR Engineering College in collaboration with Braino Vision Solutions India Pvt Ltd (21.08.2023-25.08.2023)
`;

const IT_RAGHU_CHANDRA_TEXT = `
## Educational Qualifications
- PhD (pursuing): M G R University, Chennai
- M.Tech: CSE, Eluru College of Engineering and Technology, JNTU Kakinada, 2016
- B.Tech: CSE, Ramachandra College of Engineering, JNTU Kakinada, 2013

## Professional Information
- Teaching Experience: 8 Years

## Research Interests
- Big Data Analytics
- Machine Learning

## Professional Affiliations
- Life Membership for IARA

## FDP Participation
- One Week National Level FDP on "AI Tools" - SRKR Engineering College, Bhimavaram with Brainovision Solutions India (Feb 17-21, 2025)
- One Week National Level FDP on "Impact of Emerging Technologies in AI/ML and Data Science" - Madanapalle Institute of Technology & Science with CSI (Feb 26-Mar 2, 2024)
- 1 Week FDP on "Cloud Infrastructure (AWS)" (August 2023)
- 5 day FDP on "Power of Visualization in Analytics" (August 2023)
- 30 Hours Online course on "Machine Learning for Data Science Using Python" (May 2023)
- 1 Week FDP on "Machine Learning in Big Data Applications and Security Challenges" (April 2023)
- 5 day FDP on "Emerging Trends in Artificial Intelligent Systems" (April 2023)
- 30 days Pantech E Learning course on "Java Fullstack Masterclass" (August 2022)
- 5 day ATAL FDP on "Data Science and Its Applications" (December 2021)
- 1 Week AICTE-ISTE approved refresher programme on "Role of Computational Intelligence" (Dec 2021)
- 1 Week Hands-on FDP on "Artificial Intelligence using Python" (September 2020)
- 1 Week STTP on "How to Research" (August 2020)
- 5 day FDP on "Blockchain Technology and Its Applications" (July 2020)
- 5 day FDP on "Machine Learning" (May 2020)
- 5 day FDP on "IPR Awareness and Patent Prosecution" (May 2020)
- 5 day National Level FDP on "Artificial Intelligence" (May 2020)

## NPTEL Certifications
- "Problem Solving through Programming in C" (12 weeks) - IIT Kharagpur (Jan-April 2024)
- "Introduction To Internet Of Things" (12 weeks) - IIT Madras (Jul-Oct 2022)
- "The Joy of Computing using Python" ELITE certificate (12 weeks) - IIT Kharagpur (Jul-Oct 2019)

## Patents
- "Method for End-to-End Encryption and Secure Key Distribution in IoT-Based Smart Grids" - Published 18.10.2024, Application No: 202441075545
- "Method for Secure Data Transmission in IoT Networks Using Block chain and Encryption Techniques" - Published 18.10.2024, Application No: 202441075550

## Publications
Book Chapter:
- "Estimating Human Life Expectancy through Sentiment Analysis, Population-Based Optimisation, and Machine Learning Models" by Meduri, Raghu Chandra, and Kotla Lakshmaji - published in Algorithms in Advanced Artificial Intelligence, CRC Press, July 2024

Conference Paper:
- "Sentiment Analysis and Population-Based Optimization for Estimating Human Lifespan Using Daily Activities" by Meduri Raghu Chandra - presented at the 8th International Conference on I-SMAC (IoT in Social, Mobile, Analytics and Cloud), I-SMAC 2024, IEEE, November 2024
`;

const IT_KIRAN_RELANGI_TEXT = `
## Professional Information
- Teaching Experience: 10 years

## Educational Qualifications
- Ph.D. (CSE): Acharya Nagarjuna University, 2023
- M.Tech. (CSE): Swarnandhra College of Engineering & Technology, JNTU Kakinada, 2013
- MCA: SVKP & Dr K S Raju A & S College, Andhra University, 2007

## Research Specialization
- Data Science
- Machine Learning

## Professional Affiliation
- Associate Member, Institute of Engineers India (AMIE)

## Publications
- "Optimizing CPU Scheduling for Real-Time Applications Using Mean Difference Round Robin (MDRR) algorithm" - ICT and Critical Infrastructure proceedings, CSI 48th Annual Convention, Advances in Intelligent Systems and Computing 248, Springer International Publishing, 2014
- "Mean Interleaved Round Robin Algorithm: A Novel CPU Scheduling Algorithm for Time Sharing Systems" - Proceedings of Third International Conference on Frontiers of Intelligent Computing: Theory and Applications (FICTA14)
- "Advanced Data Encryption/Decryption using Multi Codes for One Character" - International Journal of Computer Science and Engineering
- "Perspectives in Water Quality Assessment: A Review" - ICAIECES2019, SRM Institute of Science and Technology, Chennai (Springer AISC series, in processing)
- "Perspectives in Water Quality Assessment" - International Journal of Recent Technology and Engineering (IJRTE), Volume 8, Issue 2S4, July 2019
- "Classification of Groundwater by Applying Simplified Fuzzy Adaptive Resonance Theory" - IJDNE (SCOPUS INDEXED)
- "An Enhanced Weight Update Method for Simplified ARTMAP to Classify Groundwater Data" - IJDNE (SCOPUS INDEXED)
- "Stock Price Prediction Using LSTM" - Mukt Shabd Journal, Volume X, Issue VI, June 2021, pp. 436-442 (UGC CARE LIST)
- "Effective Groundwater Quality Classification Using Enhanced Whale Optimization Algorithm with Ensemble Classifier" - International Journal of Intelligent Engineering & Systems, Vol. 16, No. 1, 2023
- "Identification of Potential Quality of Groundwater Using Improved Fuzzy C Means Clustering Method" - Mathematical Modelling of Engineering Problems, 9(5), 1369-1377
- "Genetic Disorder and Subclass Prediction Based on Machine Learning Approaches" - 7th International Conference on Intelligent Sustainable Systems (ICISS), August 2025, IEEE
- "Evaluation of Machine Learning and Genetic Algorithms for Water Quality Prediction" - International Conference on Augmented Reality, Intelligent Systems, and Industrial Automation (ARIIA 2024), IEEE, December 2024

## Patents
- "System and Method for Automated Index Generation for Answer Booklets Using Deep Learning" - Published 22.11.2024, Application No. 202441088721
- "Method for Secure Data Transmission in IoT Networks Using Blockchain and Encryption Techniques" - Published 18.10.2024, Application No. 202441075550
- "System and Method for Smart Privacy Management in IoT Healthcare Devices" - Published 06.10.2024, Application No. 202441075548

## Faculty Development Programs & Workshops
- 40-hour FDP on "AI and ML for Science and Engineering Applications" - NIT Warangal, 22.07.2024-02.08.2024
- AICTE-sponsored Staff Development Program on "Data Mining Techniques and Methodologies" - Swarnandhra College of Engineering & Technology, 8-21 June 2009
- AICTE-sponsored Seminar on "Latest Trends in Embedded Systems" - Swarnandhra College of Engineering & Technology, 26-27 February 2010
- Five-day FDP on "Java Fundamentals - Java Programming" - Department of CSE, Swarnandhra College (Autonomous), in association with APITA-AKC & Oracle Academy, 14-18 November 2016
- Two-day FDP on "Introduction to Machine Learning" - IIT Kharagpur at RVR & JC Engineering College, Guntur, 17-18 December 2017
- Three-day Workshop on "Artificial Intelligence and Machine Learning" - Bennett University & SRKR Engineering College (Autonomous), Bhimavaram, 28-30 June 2018
- One-week FDP (Online) on "Mobile Application Development using Android" - ICT Academy, 14-20 May 2020
- One-day seminar on "Current Trends and Applications of Artificial Intelligence" - Department of Computer Science and Engineering, RVR & JC College of Engineering, Guntur, 29 May 2020
- One-week FDP (Online) on "Data Science and Its Applications" - Department of Computer Science and Engineering, SRKR Engineering College, Bhimavaram, 10-15 June 2021
- One-week FDP (Online) on "Machine Learning using Python Programming" - Department of Information Technology, AITAM, Tekkali, 10-16 June 2021
- Four-day webinar on "Current Trends in Research & Innovation, Research Paper Publications, IPR and Patents, Research Projects & Fundraising" - Institute for Academic Excellence
- Five-day FDP (Online) on "Advancements in Security using Deep Learning" - Department of Computer Science and Engineering, GMR Institute of Technology and Velagapudi Ramakrishna Siddhartha Engineering College, 21-25 March 2022
- One-week FDP (Online) on "Introduction to Machine Learning and Deep Learning" - Department of CSE, JNTUGV, 31 July-7 August 2023
- Two-week FDP (Online) on "Machine Learning for Data Science using Python" - National Institute of Technology Warangal, 16-31 May 2023
- Four-day FDP (Online) on "Geodata Processing using Python" - ISRO/Indian Institute of Remote Sensing, Dehradun, 20-24 February 2023
- Two-week FDP (Online) on "Advances in Remote Sensing Techniques for Geological Applications" - ISRO/Indian Institute of Remote Sensing, Dehradun, 13-24 March 2023
- 10-hour National Faculty Development Program on "Deep Learning and Artificial Intelligence" - Andhra Pradesh State Skill Development Corporation (APSSDC) in collaboration with ExcelR Edtech Pvt. Ltd, 26 February-1 March 2024
- 12-week course on "Mathematical Foundations for Machine Learning" - Skill India & Indian Institute of Science Bangalore, July-October 2025
`;

const IT_LAKSHMAJI_TEXT = `
## Educational Qualifications
- M.Tech. Computer Science & Engineering, Sri Vasavi Engineering College, Tadepalligudem (JNTUK), 2011
- M.Sc. Computer Science, Sri Gowri PG College, Visakhapatnam (Andhra University), 2005

## Professional Information
- Teaching Experience: 12 years

## Publications
- R. Arabelli, M. Buradkar, K. Lakshmaji, A. P. Dube, C. Mary Shiba and B. T. Geetha, "Machine Learning-Based Cybersecurity Framework" (2024 International Conference on Advances in Computing, Communication and Applied Informatics, Chennai)
- "E-SRA: Ensemble selfish routing algorithm" (Journal of Physics: Conference Series, 2019)
- "An ensemble integrated mailing system for detecting spam mails" (Journal of Physics: Conference Series, 2019)
- "Visualization Based Scheduling Algorithm for Parallel Distribution computing" (AIJREAS, 2016)
- "A point to point based cloud workflow system" (AIJREAS, 2016)
- "Strategies for optimal traffic flow in multi node ad-hoc wireless sensor networks" (AIJREAS, 2016)
- "A Novel Application to Spam filtering" (IJCST, 2011)

## Professional Development & Certifications
- "Computer Networks and Internet Protocol" (IIT Madras, Jan-March 2024, 70% score)
- "Database Management Systems" (IIT Madras, Jan-March 2024, 49% score)
- NPTEL ELITE + SILVER certification "Introduction to Internet of Things" (July-October 2023, 80% score)
- NPTEL ELITE + SILVER certification "The Joy of Computing Using Python" (July-October 2023, 81% score)
- NPTEL course "Theory of computation" (July-September 2019, 57% score)
- FDP "Machine Learning Applications for Engineers" (Chaitanya Bharathi Institute, 17-21 February 2025)
- National Level FDP "Impact of Emerging Technologies in AI/ML and Data Science" (Madanapalle Institute, 26 February-2 March 2024)
- AICTE Recognized FDP "Data Science using Python" (NITTTR Chandigarh, 19-23 February 2024)
- FDP "Data Analytics using Power BI" (G Narayanamma Institute, 20-24 March 2023)
- "Artificial Intelligence" online course (Pantech e-Learning, 23 November-22 December 2022)
- FDP "Cloud computing and its applications" (GPREC, 28 November-3 December 2022)
- "Advanced python programming" online course (Pantech e-Learning, 27 October-27 November 2022)
- "Space Dynamics" National Workshop (APSARC, July 2017)
- FDP "Advanced Web Technologies and Springs" (APSSDC, October-December 2015)
- "Ethical Hacking" workshop (15-16 February 2012)
- "Data warehousing Concepts & Informatica" workshop (12-13 March 2012)
- "IBM Rational Rose" workshop (30-31 August, 1 September 2012)

## Patents
- "System for Autonomous Network Configuration and Optimization Using Machine Learning Algorithms" (Published 18 October 2024, Application No: 202441075542)
- "AI-Driven System for Real-Time Intrusion Detection in Cloud Infrastructure" (Published 18 October 2024, Application No: 202441075549)
`;

const IT_RAMBABU_TEXT = `
## Education
- M.Tech in CSE from Swarnandhra College of Engineering & Technology, 2020
- M.C.A from Swarnandhra College of Engineering & Technology, 2014
- B.Sc. from Sri Y.N College, 2011

## Professional Background
- Teaching Experience: 3.5 Years

## Specialization & Research Areas
- Internet of Things
- Full stack application Developer
- Machine Learning

## Achievements
- Ratified as Assistant Professor under JNTUK in 2022

## Professional Development Activities
- One Week Online FDP on "Exploring Generative AI: Foundations, Models and Real-World Applications in Vision and Language" (09.02.2026-13.02.2026)
- AICTE ATAL Academy FDP on AI-Powered Cyber Threat Intelligence (18.08.2025-23.08.2025)
- National Level FDP on "AI Tools" from SRKR Engineering College (17.02.2025-21.02.2025)
- IDEATE-14 Workshop by VEDIC (20.05.2025-22.05.2025)
- 3-Day National Workshop on "AI-Augmented Scientific Writing and Publishing" (14.02.2024-16.02.2024)
- Workshop on "Python in Data Processing" (11-13 May 2020)
- 2-Day FDP on Cyber Security (15-16 May 2020)
- 5-Day FDP on "Internet of Things" (11-15 November 2021)
- One Week FDP on "Cloud Infrastructure and AWS" (21-25 August 2023)

## Patents
- "System and Method for Smart Privacy Management in IoT Healthcare Devices" (Application no: 202441075548, published 06.10.2024)
- "Method for Secure Data Transmission in IoT Networks Using Blockchain and Encryption Techniques" (Application no: 202441075550, published 18.10.2024)

## Publications
- Author of textbook "Applications of Artificial Intelligence" published by Shree Publishing House (ISBN: 978-93-47167-68-3, 2026)
`;

const IT_KALIVARAPRASANNA_BABU_TEXT = `
## Educational Qualifications
- PhD: Computer Science, Central University of Tamil Nadu, Thiruvarur, Tamil Nadu, 2024
- MSc: Computer Science, Osmania University, Hyderabad, Telangana, 2016
- BSc: Computer Science, Gangadhar Meher College, Sambalpur, Odisha, 2013

## Professional Details
- Teaching Experience: 00 Years

## Research & Specialization
- Block Chain

## Publications in International/National Journals
- G Kalivaraprasanna Babu, P Thiyagarajan, and R Saranya. "A blockchain based scheme for distributed storage of nuclear power plant images." Kerntechnik, volume 89, pages 67-76. DeGruyter (SCIE IF: 0.4), 2024
- G Kalivaraprasanna Babu and P Thiyagarajan. "Broadening of horizons: a review of blockchains' influence on ehrs development trend." International Journal of Electronic Healthcare, volume 13, pages 134-157. Inderscience Publishers, 2023

## Publications in International/National Conferences
- G Kalivaraprasanna Babu, P Thiyagarajan, and R Saranya. "Proactive public healthcare solution based on blockchain for covid-19." In International Conference on Advanced Communications and Machine Intelligence, pages 125-134. Springer, 2022
- G Kalivaraprasanna Babu and P Thiyagarajan. "The current state of prescriptions and potential enhancements using blockchain." In 2021 12th International Conference on Computing Communication and Networking Technologies (ICCCNT), pages 1-6. IEEE, 2021

## Professional Development
- Participated in One Week National Level FDP on "AI Tools" organized by SRKR Engineering College, Bhimavaram in association with Brainovision Solutions India Pvt. Ltd in collaboration with AICTE from 17.02.2025-21.02.2025
`;

const IT_N_AMULYA_TEXT = `
## Education
- M.Tech: CSE, Andhra University, 2023
- B.Tech: CSE, Nova College of Engineering & Technology, JNTU K, 2018

## Professional Details
- Teaching Experience: 01 Years

## Field of Specialization
- Machine Learning

## Professional Development & Certifications
NPTEL Courses Completed:
- "Introduction to Internet of Things" - IIT Kharagpur (Jul-Oct 2024)
- "Cloud Computing" - IIT Kharagpur (Jul-Oct 2024)

Patents:
- "AI-Based Method for Anomaly Detection in High-Speed Networks" (Published 18.10.2024, Application no: 202441075544)

Faculty Development Programs:
- 5-day FDP on "Artificial Intelligence and Machine Learning" (15.09.2025-19.09.2025)
- Capacity Building Programme on Cybersecurity - Basic Course, Malaviya Mission Teacher Training Programme (04.09.2025-08.09.2025)
- AICTE ATAL Academy FDP on AI-Powered Cyber Threat Intelligence (18.08.2025-23.08.2025)
- One Week National Level FDP on "AI Tools" - SRKR Engineering College (17.02.2025-21.02.2025)
`;

const IT_VIMALA_VICTORIA_TEXT = `
## Educational Qualifications
- Ph.D.: CSE, Research Scholar, Woxsen International University, Hyderabad, 2024
- M.Tech: CSE, Shri Vishnu Engineering College For Women, Bhimavaram, 2021
- B.Tech: CSE, SRK Institute of Technology, Vijayawada, 2018

## Professional Details
- Teaching Experience: 03 Years

## Areas of Expertise
- Machine Learning
- Deep Learning
- Software Testing

## Publications & Presentations
- Book chapter in Alpha International publication on "Machine Learning" (ISBN: 9789357621489)
- Presented at international conference on advancing sustainable solutions for micro and nano plastics through interdisciplinary research at IISER Kolkata (February 15-16, 2025): "Real time detection of microplastics in water using AI based deep learning" (co-convener: IIT Indore)

## Professional Development Activities
- "Deep Learning-IIT Ropar" (12 weeks, Jan-Apr 2025)
- "Artificial Intelligence: Concepts and Techniques" via Skill India & Indian Institute of Science Bangalore (12 weeks, Jul-Oct 2025)
- "Artificial Intelligence" FDP (12 weeks, Jul-Oct 2025)
- "Juniper Mist - AI" AICTE Training & Learning Academy-EduSkills FDP (6 days, 24.11.2025-29.11.2025)
- National Level Professional Development Programme on Quantum Computing via VNR Vignana Jyothi Institute (5 days, 21.10.2025-25.10.2025)
- Online Refresher Course: "Recent Advances in Smart Materials for Energy, Environment and Biomedical Applications" (01.08.2025-12.08.2025, earned B Grade)
- Faculty Development Program: "Cutting Edge Technology Frontiers in EdTech: What's Next?" (16-20 June 2025, score 10/10)
- "AI & ML" FDP (30.06.2025-07.07.2025)
`;

const IT_K_RAM_KUMAR_TEXT = `
## Education
- M.Tech (2019): Dr. Paul Raj Engineering College, JNTUK Kakinada
- B.Tech (2016): BVC College of Engineering, JNTUK Kakinada

## Professional Information
- Teaching Experience: 5 Years

## Specialization Areas
- Cyber Security
- Artificial Intelligence
- Machine Learning

## Professional Memberships
- Life member of ISTE
- Life member of IAENG

## Publications
- "Cyber Security Challenges in the Post-Pandemic Digital Landscape" - International journal of basic and applied research, June 2024
- "Software Vulnerability Detection Tool Using Machine Learning Algorithm" - International journal of basic and applied research, April 2024
- "Convolutional Neural Network based Fruit Image Classification" - Journal of Interdisciplinary Cycle Research, December 2021
- "Fast Nearest Neighbor Search with Keywords" - December 2019 (M-Tech thesis work)

## Faculty Development Programs and Workshops
- 12-week FDP on "Programming in Java," IIT Kharagpur, July-October 2025
- 12-week NPTEL course on "Database Management Systems," IIT Kharagpur, January-April 2024
- 12-week NPTEL course on "Deep Learning," IIT Kharagpur, January-April 2023
- 12-week NPTEL course on "Cloud Computing," IIT Madras, January-April 2022
- AICTE Training and Learning (ATAL) Academy FDP on "International Trends in AI and Supercomputing for Climate, Energy & Health," Srinivasa Institute of Engineering and Technology, September 8-13, 2025
- One-week National Level FDP on "Recent Trends on AI-Text, Vision & Hardware Implementation Models," August 28 - September 2, 2025
- One-week FDP on "Frontiers in EdTech: What's Next?" organized by JNTUK Kakinada in collaboration with UCEK and Department of AI at SVECW, June 16-20, 2025
- One-week ATAL FDP on "Recent Trends in High Performance Computing using AI," Bonam Venkatachalamayya Institute of Technology & Science, February 17-22, 2025
- One-week FDP on "Cyber Security," organized by Department of MBA & Research Centre at Sapthagiri NPS University Bangalore, MCA Department at Indira College of Engineering & Management Pune, Annasaheb Dange College of Engineering & Technology Ashta Maharashtra, Nist University Odisha in collaboration with ExcelR Edtech Pvt. Ltd., February 14-20, 2025
- One-week ATAL FDP on "Next Gen Solutions For Medical Challenges Powered By AI Based Intelligent Systems," Malla Reddy College of Engineering & Technology, December 16-21, 2024
- One-week FDP on "Data Science and Machine Learning Applications for Engineering and Sciences," Sri Vishnu Engineering College for Women, October 21-27, 2024
- One-week FDP on "Cloud Computing using AWS," Mohan Babu University Tirupati in collaboration with APSSDC, July 8-13, 2024
- Five-day Advance Entrepreneurship Skill Development Program on "Cyber Security," JNTU Kakinada, February 26 - March 1, 2024
- Knowledge sharing program on "Embedding the Innovation Process in Achieving the Learning Outcomes," conducted by ICFAI Group, July 30, 2024
- Workshop on "Big Data Computing," VNR Vignana Jyothi Institute of Engineering and Technology, February 2-4, 2023
- "IP awareness/training program" under National Intellectual Property Awareness Mission, January 4, 2023
- NPTEL workshop on "Cloud Architecture - Design Patterns & PC on Cloud," December 17, 2022
- Two-week FDP on "ICT Tools for Teaching and Research," PDPM Indian Institute of Information Technology, Design and Manufacturing Jabalpur, December 5-17, 2022
- NPTEL "E-Awareness" workshop, November 17, 2021
- Six-day FDP on "Advanced Problem-Solving using Machine Learning and Deep Learning," Department of CSE at IAE, April 25-30, 2022
- Seven-day FDP "EQIP-2022," jointly organized by IQAC Mannar Tirumalai Naicker College Madhurai and APC Mahalaxmi College with IQAC cluster, April 18-24, 2022
- Five-day FDP on "NBA Accreditation and Teaching-Learning Process in Engineering," Swami Keshvanad Institute of Technology, Management & Gramothan Jaipur, November 15-19, 2021
`;

const IT_MOUNICA_DEVI_TEXT = `
## Educational Qualifications
- Ph.D (Pursuing): KLU University, Vijayawada
- M.Tech: SRKR Engineering college Bhimavaram, 2018
- B.Tech: Shri Vishnu engineering college for women, Bhimavaram, 2016

## Professional Details
- Teaching Experience: 5 Years

## Specialization and Research Areas
- Artificial Intelligence
- Machine Learning

## Professional Development Activities
Faculty Development Programs (FDPs)/Workshops Completed:
- Participated and Completed 6 days AICTE Training & Learning (ATAL) Academy-EduSkills FDP on "Juniper Mist - AI" (24.11.2025 to 29.11.2025)
- Participated in Online FDP on An Academic Perspective on Research (SRKR Engineering College)
- Participated in Online FDP on Internet of Things (SRKR Engineering)
- Participated in Online FDP on Communication Skills, Modes and Knowledge Dissemination (GRIET, HYD)
- Participated in Online AICTE Recognized FDP on Data Analytics using Python (NITTTR, Chandigarh)
- Attended webinar on Cyber Threats and Data Breaches (Chandigarh)
- Participated in Academic Writing in Research Workshop
`;

const IT_MADHURI_NAKKELLA_TEXT = `
## Educational Qualifications
- Ph.D. (Pursuing): CSE, JNTU Kakinada
- M.Tech: CSE, Jawaharlal Nehru Technological University, Kakinada, 2013
- MCA: Andhra University, 2008
- Teaching Experience: 16 years

## Research & Specialization Areas
- Internet of Things
- Machine Learning
- Deep Learning
- Computer Vision
- Large Language Models

## Professional Memberships
- International Association for Engineers (IAENG)
- Indian Association of Educators & Professional Trainers (IAEPT)
- Institute for Educational Research and Publication (IFERP)

## Journal Publications
- "Local Ternary Pattern Alphabet Shape Features for Stone Texture Classification" (Springer Professional)
- "A Secure Group Communication Using Mod-Encoder Compression Algorithm" (International Journal for Research in Science & Advanced Technologies)
- "Stone Image Classification Based on Overlapped 5-bit T-Patterns Occurrence on 5-by-5 Sub Images" (International Journal of Electrical and Computer Engineering)
- "Social Closeness Based Private Coordinating Conventions for Online Informal Organizations" (International Journal of Science Engineering and Advance Technology)
- "AI-Enabled Early Detection of Preeclampsia: A Predictive Model Based on Multivariate Biomarker Analysis"
- "An effective Face Emotion Recognition using Augmented Physics Informed Neural Networks with Leaf in Wind Optimization"
- "MVM2: A Neuro-Symbolic Multi-Agent Framework for Mathematical Reasoning Verification"
- "Language Induced Structural Efficiency Modeling in Multilingual Prompt Code Generation"
- "Multilingual Natural Language Prompts and Code Generation: A Study on Large Language Model Cross-Linguistic Performance"
- "Mathematical reasoning enhancement in large language models using MVM2 model"

## Conference Publications
- Kumar, Pullela S.V.V.S.R., D. J. Nagendra Kumar, Nakkella Madhuri and Ayanavalli Ramadevi. "Local Ternary Pattern Alphabet Shape Features for Stone Texture Classification." Lecture Notes in Electrical Engineering (2018)
- K. Chakravarthy, S. L. Krishna, Madhuri Nakkella, S. Srinivas and N. K, "An effective Face Emotion Recognition using Augmented Physics Informed Neural Networks with Leaf in Wind Optimization," 2025 6th International Conference for Emerging Technology (INCET), Belgaum, India, 2025, pp. 1-9

## Certifications & Achievements
- UGC NET (2018) qualified
- APSET (2016) qualified
- SnowPro Certified Data Engineering Professional
- NPTEL Discipline Star Award (January 2026)
- APRCET 2024 State Rank 13

## NPTEL Certifications (Elite Level)
- Programming Data Structures and Algorithms Using Python (IIT Madras)
- Python Programming (IIT Kanpur)
- Introduction to Internet of Things (IIT Kharagpur)
- Database Management Systems (IIT Kharagpur)
- Business Intelligence & Analytics (IIT Madras)
- Introduction to Machine Learning (IIT Madras)
- Data Science for Engineers (IIT Madras)

## Professional Development Programs
- Fundamentals of Publishing (Elsevier Researcher Academy)
- Research Data Management (Elsevier Researcher Academy)
- Technical Writing Skills (Elsevier Researcher Academy)
- Writing Skills (Elsevier Researcher Academy)
- Geodata Sharing and Cyber Security (Indian Institute of Remote Sciences)
- Geodata Processing Using Python and Machine Learning (Indian Institute of Remote Sciences)
- Wearable Devices - AI for Digital Health (AICTE)

## Patents
- "The Paperspotter: A Dielectric Sensing Module for Detection of Concealed Paper-Based Contraband in Examination Halls" (Application: 202541134718 A, Published: 09/01/2026)
- "An IoT and AI Based Hybrid System for Vegetable Spoilage Detection and Monitoring"
- "Dynamic Load Balancing Algorithm for Distributed Cloud Systems" (Application: 202541053881A, Published: 13/06/2025)
- "A System & Method for Dynamic QR Code Based Metro Fare Adjustment Using Real-time Travel Distance" (Application: 202541057358A, Published: 27/06/2025)
- "A System & Method for Predictive Health Monitoring Using IoT-Enabled Wearable Devices and AI" (Application: 202541057367A, Published: 27/06/2025)
- "System and Method for Predictive Cooked Food Freshness Assessment Using Dynamic Volatile Organic Compound (VOC) Ratio Analysis" (Application: 202541057367A, Published: 27/06/2026)
- "Method for Identifying Food Spoilage by Monitoring Specific Volatile Organic Compound (VOC) Ratio Metrics and Their Temporal Evolution"
- "Smart Blue-Light Sensor System for Real-time Monitoring and Eye Safety" (Application: 202541114024 A, Published: 05/12/2025)
`;

const IT_Y_PHANI_TEXT = `
## Educational Qualifications
- Ph.D. from Acharya Nagarjuna University, 2013
- M.Phil. from JNTU-Hyderabad, 2007
- MSc from Andhra University, 1997

## Experience
- 27 years of teaching experience

## Professional Memberships
- Life Member, Andhra Pradesh and Telangana Society for Mathematical Sciences (LM APMS: 381)
- Life Member, International Association of Engineers (IAENG), Hong Kong (No: 168767)
- Institute for Engineering Research and Publication (PM83290654)

## Research Focus
- Circular and semicircular statistical distributions, fixed point theory in metric spaces, and mathematical modeling

## Notable Recognition
- Best Academician Award from Sahasra Research Foundation in association with Society for Learning Technologies, India

## Research Profiles
- APSET Qualified with active profiles on Scopus, Web of Science, ORCID, Google Scholar, and Vidwan (ID: 149672)

## Publications
- "Wrapped size biased gamma Lindley distribution with application" - Sigma Journal of Engineering and Natural Sciences, Vol. 43(4), pp. 1124-1131 (2025)
- "Existence & uniqueness solutions of a pair of maps via different types of Suzuki-Geraghty contractions in Ab-Metric spaces" - AIP Conference Proceedings (2025)
- "New Semicircular Distribution with Applications" - Journal of Mechanics of Continua and Mathematical Science, Vol. 21(3), pp. 89-103 (2026)
- "Wrapped Length Biased Exponential Distribution" - Thailand Statistician, Thai Statistical Association (July 2024)
- "On Stereographic Semicircular Erlang Distribution with Application" - Proceedings on Engineering Sciences, Faculty of Engineering, University of Kragujevac (Sept. 2024)
- "Toward Enhanced Geological Analysis: A Novel Approach Based on Transmuted Semicircular Distribution" - Symmetry, Vol. 15(11), Article 2030 (2023)
- "Geometry in A-Metric Space" - Southeast Asian Bulletin of Mathematics, Vol. 47(6), pp. 845-853 (2023)
- "Representable Autometrized Algebra and MV Algebra" - Thai Journal of Mathematics, Vol. 20(2), pp. 937-943 (2022)
- "Wrapped l-axial Marshall-Olkin Logistic Distribution" - Dickensian Journal, Vol. 22, pp. 627-633 (2022)
- "Marshall-Olkin Stereographic Circular Logistic distribution" - YMER Digital, Vol. 21, pp. 664-668 (2022)
- "Representable Autometrized Semi algebra" - Thai Journal of Mathematics, Vol. 19(4), pp. 1267-1272 (2021)
- "A new family of Semicircular and Circular arc tan-exponential type distributions" - Thai Journal of Mathematics, Vol. 18(2), pp. 277-281 (2020)
- "A Note on Representable Autometrized Algebras" - Thai Journal of Mathematics, Vol. 17(1), pp. 277-281 (2019)
- "On Semicircular Extreme-Value distribution" - International Journal of Applied Engineering Research, Vol. 14(9), pp. 2182-2187 (2019)
- "On Stereographic Semicircular Quasi Lindley Distribution" - Journal of New Results in Science, Vol. 8(1), pp. 6-13 (2019)
- "Metric Spaces with Distances in Representable Autometrized Algebras" - Southeast Asian Bulletin of Mathematics, Vol. 42(3), pp. 543-462 (2018)
- "Semicircular Logistic Distribution induced by Simple Projection Method" - Mathematical Theory and Modeling, Vol. 8(5), pp. 30-41 (2018)
- "Stereographic l-axial Half Logistic Distribution" - International Journal of Applied Engineering Research, Vol. 13(12), pp. 10627-10634 (2018)
- "Stereographic l-axial Reflected Log-logistic Distribution" - International Journal of Mathematical Archive, Vol. 9(7), pp. 134-141 (2018)
- "On l-Axial Chi-Square Distribution" - i-manager's Journal on Mathematics, Vol. 6(4), pp. 51-58 (2017)
- "On Trigonometric Moments of the Stereographic Semicircular Gamma Distribution" - European Journal of Pure and Applied Mathematics, Vol. 10(5), pp. 1124-1134 (2017)
- "Stereographic Semicircular Half Logistic Distribution" - International Journal of Pure and Applied Mathematics, Vol. 113(11), pp. 142-150 (2017)
- "Suzuki type unique common fixed point theorem in partial metric spaces using (C)-condition" - Mathematical Sciences, Vol. 11, pp. 39-45 (2016)
- "New Semicircular Model: The Stereographic Semicircular Rayleigh Distribution" - International Journal of Computational Science, Mathematics and Engineering, Vol. 1 (2016)
- "On Stereographic Circular Weibull Distribution" - Journal of New Theory, Vol. 1(14), pp. 1-9 (2016)
- "Stereographic Logistic Model-Application to Noisy Scrub Birds Data" - Chilean Journal of Statistics, Vol. 7(2), pp. 69-79 (2016)
- "The Semicircular Reflected Gamma Distribution" - i-manager's Journal on Mathematics, Vol. 5(1), pp. 39-46 (2016)
- "L-Axial Wrapped Exponential Distribution" - International Journal of Scientific and Innovative Mathematical Research (2015)
- "Stereographic-l-axial Exponential and Stereographic Circular exponential Distribution" - International Journal of Scientific and Innovative Mathematical Research (2015)
- "Stereographic Circular model induced by Inverse Stereographic Project on double Weibull Distribution with Application" - International Journal of Soft Computing, Mathematics and Control, Vol. 4(1), pp. 67-74 (2015)
- "New Circular Models induced by modified inverse Stereographic Projection on Arc tan Exponential-Type distribution" - Journal of Applied Mathematics, Statistics, and Informatics, Vol. 10(1), pp. 5-17 (2014)
- "On Stereographic Semicircular Gamma Model" - National Conference on Recent Trends in Mathematical Computing (2014)
- "Order Topology and Uniformity on A-Metric Space" - International Research Journal of Pure Algebra, Vol. 4(4), pp. 488-494 (2014)
- "Stereographic Circular Normal Moment Distribution" - Applied Mathematics and Sciences: An International Journal, Vol. 1(3), pp. 65-72 (2014)
- "New Circular model induced by inverse Stereographic projection on Double Exponential model-Application to Birds Migration Data" - Journal of Applied Mathematics, Statistics, and Informatics, Vol. 10(1), pp. 5-17 (2014)
- "On Construction of Stereographic Semicircular models" - Journal of Applied Probability and Statistics, Vol. 8(1), pp. 75-90 (2013)
- "On Stereographic Lognormal Distribution" - International Journal of Advances in Applied Sciences, Vol. 2(3), pp. 125-132 (2013)
- "Arc Tan-Exponential Type Distribution Induced by Stereographic Projection/Bilinear Transformation on Modified Wrapped Exponential Distribution" - Journal of Applied Mathematics, Statistics, and Informatics, Vol. 9(1), pp. 69-74 (2013)
- "Circular model induced by inverse Stereographic Projection on Extreme Value Distribution" - IRACST-Engineering Science and Technology: An International Journal, Vol. 2(5), pp. 881-888 (2012)
- "Modeling Ants Data Using Stereographic Reflected Gamma Distribution" - ANU Journal of Physical Sciences (2012)
- "Differential Approach to Cardioid Distribution" - Computer Engineering and Intelligent Systems, Vol. 2(8), pp. 1-6 (2011)
- "On Stereographic Logistic Model" - Proceedings of NCAMES, A.U Engineering College, Visakhapatnam (2011)
`;

const IT_CHANDRA_SEKHARA_RAO_TEXT = `
## Education
- MSc: Acharya Nagarjuna University, 2009
- M.Tech (CSE): JNTU(K), 2023

## Professional Affiliations
- Life Member, ISTE

## Presentations
- Presented paper titled "Numerical solutions of Time Fractional NWS and Burger's Equations" at 2nd International Conference on Recent Advances in Applied Science & Engineering (ICRAEE-2024)
`;

const MBA_RAMA_MURTHY_TEXT = `
## Educational Qualifications
- Ph.D. - Faculty of Commerce and Management Studies, Acharya Nagarjuna University (ANU), Guntur, 2014
- M.B.A. - Finance & HR, Jawaharlal Nehru Technological University Hyderabad (JNTUH), 2009
- B.Com - Computers and Commerce, Kakatiya University (KU), June 2006

## Professional Experience
- Teaching Experience: 16 Years
- Research Experience: 15 Years

## Professional Affiliations
- Life Member, Indian Academic Researchers Association (IARA) - ID: M3034
- Member, i-Explore International Research Journal Consortium (IIRJC) - ID: 14012
- Professional Member, Institute for Exploring Advances in Engineering (IEAE) - ID: 1EAE20176282
- Life Member, Institute for Engineering Research and Publication - ID: PM50293741
- International Association of Engineers (IAENG) - ID: 302935

## Journal Articles
- "The Stress level: A Study on Working Women in Khammam District, A.P." International Journal of Advances in Arts, Sciences and Engineering (IJOAASE), Volume 1 Issue 2, 2012
- "Impact of Commercial Advertisements on TV Viewers: A Study in Telangana Region," International Journal of Research, Computer Technology (IJRCT), Nov 2013
- "Employees' Health and Safety in Singareni Collieries Company Limited (SCCL) With Reference to Khammam District Coal Mines," International Journal of Management, Information Technology and Engineering (IJMITE), Vol. 2, Issue 1, Jan 2014
- "Industrial Relations Practices Influence on Maintaining Productivity in Power Sector - A Case of NTPC," International Journal of Research in Business Management IJRBM, Vol. 2, Issue 5, May 2014
- "Employees' Association in Police Department With Reference to Khammam District, Telangana State," IOSR Journal of Business and Management (IOSR - JBM), Volume 18, Issue 8, Aug 2016
- "A Study on work-life balance: An Emerging Need with winning strategy," commo'N'man Indian Journal of Commerce and Management, Volume 3, Issue 6, Jan 2017
- "Employee's Career Planning and Development in Regional Rural Banks With Reference to APGVB," Journal of Advance Management Research, Vol.05 Issue-05, December 2017
- "A study on Agriculture loan impact on socio and economic conditions of farmers' in North costal districts of Andhra Pradesh," SJI - Journal of Interdisciplinary and Multidisciplinary Research, Volume XII Issue XI, November 2019
- "HR Data Analytics in the Time of the Covid-19 Pandemic," International Journal of Biology, Pharmacy and Allied Sciences (IJHPAS), Special Issue, September 2021, 10(9)
- "Financial Problems of Small and Medium Enterprises in Telengana," Science, Technology and Development Journal, Volume X, Issue XII, December 2021
- "Modeling BSE and Future Derivative Market Volatility in India," IUT Journal of Advanced Research and Development, Volume 8, No. 2 (October 2022-March 2023)

## Book Chapters
- "Human Resource Development Issues, Challenges and Strategies, HRD issues in Regional Rural Banks in Andhra Pradesh," PPH Publications, ISBN: 978-81-922783-3-9, pp.86-98, 2012
- "Foreign Reserves: Text and Applied Research, Impact of Foreign Exchange Reserves on Indian Economy," Shashwat Publication, ISBN: 978-81-19517-52-7, pp. 129-145, 2023

## Conference Papers
- "Training practices: in RRBs with reference to APGVB," National Level Conference on Contemporary Practices in Management, 27 September 2014, Archers and Elevators Publishing House, Bangalore
- "A study on employees' performance appraisal system with reference to APGVB," 2nd International Conference on Management, Engineering, Science, Humanities and Technology ICMESHT-2015, Technical Research Organization India, Bangalore
- "A Study On Employee Job Satisfaction in PEC in Khammam Region, Telangana State," UGC National Seminar on Human Resource Management: exploring new dimensions, Guntur, 12-13 December 2015
- "Financial Inclusion in India- A Review of Initiatives and Achievements," UGC Sponsored Two Day National Seminar, Department of Commerce, Pithapur Rajah's Government College, Kakinada, 23-24 September 2016
- "Innovation Management - A Strategic Imperative For Growth," UGC Sponsored Two Day National Seminar, Department of Commerce and Business Administration, P.B.Siddhartha College of Arts and Science, Vijayawada, 22-23 August 2017
- "Women Entrepreneurs: Problems and Challenges," UGC Sponsored Two Day National Seminar on Recent Innovations In Commerce, Management, Skill Development and E-Commerce, Department of Commerce, Pithapur Rajah's Government College, Kakinada, 5-6 December 2017


## Identifiers & Contact
- Email: kvrmurthymba@svecw.edu.in
`;

const MBA_KARTHIK_TEXT = `
## Education
- Ph.D.: Human Resource Management, Annamalai University, Tamil Nadu, India, 2019
- MBA: Human Resource Management & Marketing, Anna University-Coimbatore, Tamil Nadu, 2010
- B.Sc.: Zoology, Bharathidasan University, Trichy, Tamil Nadu, 2008

## Experience
- Teaching Experience: 7.5 years
- Research Experience: 7 years
- Industrial Experience: 5 years

## Professional Affiliations
- Life time member of Education Research and Development Association (ERDA)
- Member of International Association of Academic Plus Corporate (IAAC)
- Member under the category of Research Advisor, Referee and Professor in International Management Research and Technology Consortium (IMRTC)
- Member of Executive Council of Indian Association of Social Sciences Research (IASSR)

## Scopus Journals
- Dr. M. Karthik et al (2023), "Impact of Digital Marketing on Sales Growth" - Journal of Research Administration, Vol. 5 No. 2 pp.2047-2058
- Dr. M. Karthik et al (2023), "Effect of Relational Connections and Cooperation of Chief Managers V/S Team Members Concerning IT/ITES Organizations in India - A Study" - The Seybold Report, V18.104 pp. 1510-1519

## International Journals
- Dr. M. Karthik (2023), "Upshots of E-Recruitment towards Green HRM: Current Literature and Future Opportunities for Recruiters" - PRERANA: Journal of Management Thought and Practice, Vol.15, Issue:2 pp.22-30
- Dr.M. Karthik and GV Sravya (2022), "A Study on Impact of Social Media Marketing From Customer's Perspective" - Shodhsamhita: Journal of Fundamental & Comparative Research, Vol. VII, No. 1 (XIX), pp. 37-46
- M.Karthik and Dr. G. Udayasuriyan (2019), "Intentions towards Social Entrepreneurship among University Students in Tamilnadu" - Pramana Research Journal, Vol.9, Issue 6, pp.106-114
- M.Karthik and Dr. G. Udayasuriyan (2019), "Entrepreneurial Intention among Management Students" - International Journal of Research in Social Sciences, Vol. 9 Issue 4(1), pp.11-18
- Dr. K.Sivakumar and Dr.M.Karthik (2019), "Effectiveness of Selection Process of Self Help Groups in Namakkal District, Tamil Nadu" - Journal of Emerging Technologies and Innovative Research (JETIR), Vol.6, Is.6, pp.503-510
- Dr. K. Sivakumar and Dr. M. Karthik (2019), "Influence of Training and Development of SHG Members' Performance- A Path Analysis Approach" - International journal of analytical and experimental modal analysis (IJAEMA), Vol XI, Issue XI, pp.2394-2406
- M.Karthik and Dr. K. Sivakumar (2018), "Multiple Group Path Analysis Approach: Influence of Training and Development on Organizational Performance in Co-operative and Private Milk Dairy Sector" - Shanlax International Journal of Arts, Science and Humanities, Vol.5 (1), pp.26-33
- M.Karthik and Dr. K. Sivakumar (2018), "A Comparative Study of Training Practices Adopted in Co-Operative and Private Dairy Plants" - Emperor International Journal of Finance and Management Research (EIJFMR), Vol-IV, Issue-6, pp.237-243
- Sr. A. Fatima Mary & Dr. M. Karthik (2021), "The Impact of Satisfaction through Online Teaching in Zambia Educational Context during Covid-19 Pandemic" - NOLEGEIN Journal of Consumer Behavior & Market Research, Vol.4 No.2, pp.30-38
- M.Karthik and Dr. K. Sivakumar (2017), "Employees Reactions in Predicting Motivational Training provided by The Dairy Plant Owners" - SUMEDHA Journal of Management, Vol.6 (3), pp.70-77
- M.Karthik and Dr. K. Sivakumar (2016), "Instructional strategies for Dairy Farmers Training and Development in Tamil Nadu" - Annamalai Journal of Management, Special issue, pp. 30-35

## Book Chapters
- Mr. Ch.Anudeep, Dr. M. Karthik and Dr. V P Thirulogasundaram (2023), "Indian Telecom Sector: The Future Destination" - Transition from Industry 4.0 to Industry 5.0: Radical Changes in Indian Business Environment, First Edition, Pp-287-295
- M.Karthik and Dr. K. Sivakumar (2017), "Common property Resources and Grazing Dairy Cows: Strengthening Explanations" - Common Property Resources: Issues and Challenges, Vol.2, pp 86-97

## Conference Proceedings
- "Financial Literacy & Financial Independence for Smart Investment Decisions: An Analysis" - Published in proceedings of National Conference on "E-Commerce, Management and Social Innovation-Embracing, Changes, Transformation 2023" by Department of Commerce, SRM Institute of Science and Technology, Chennai, 25-08-2023

## Patent
- Indian Patent - "A System for Providing Mediating Effect of Management Information System on Effective HRM in an Organization," Application No.202221058963A, Publication Date: 21/10/2022

## Resource Person Roles
- Invited Lecture on "Future Skilled Needed in 2030 to Emerging Professionals" - Periyar Government Arts College, Cuddalore, Tamil Nadu, 25-10-2023
- Topic "Stress Management Techniques for Healthy Mind & Body: Copping with Modern Pressure" - National Level 7 days FDP on "Emerging Trends & Challenges in Commerce & Management Education," Hindusthan College of Arts & Science, Coimbatore, 25-09-2023
- Lecture and Resource Person "Implementing Ethics and Values through Outcome Based Education Framework" - National Level Online FDP on "Outcome Based Education," Karpagam Academy of Higher Education, Coimbatore, 31-07-2021
- Keynote Address "Trends & Challenges in Online Education" - One Week Virtual FDP on "Teaching Pedagogies for Virtual Classrooms," 25-31 May 2021
- Resource Person in National Webinar "Enhance Leadership Qualities & Team Building Skills" - Annai Violet Arts & Science College, Ambattur, Chennai, 11-10-2021
- Speaker on webinar "Changing Business Models in Covid-19" - Departments of Commerce and Management Studies, St.Joseph University, Nagaland, 18-08-2020
- Workshop on "Role of Personality Development for Effective Career Development" - Placement Cell, St.Joseph University, Nagaland, 10-11-2019
- Keynote Address "Impact of Time Management on Health and Wellbeing" - Mind Care Foundation, Portonova, Cuddalore, Tamil Nadu, 22-12-2018

## Seminar/Conference Papers Presented
- "Social Inclusion and Human Development in Emerging India: Addressing Caste-Based Discrimination and Inequalities" - ICSSR Sponsored National Seminar, PSG College of Arts & Science, Coimbatore, 04-08-2023
- "Financial Literacy & Financial Independence for Smart Investment Decisions: An Analysis" - National Level Conference, SRM Institute of Science and Technology, Ramapuram-Chennai, 25-08-2023
- "A Study on Impact of Social Media Marketing from Customer's Perspective" - International Conference, School of Commerce and Management with IDE, Madras University & IARA, 11-12 April 2022
- "Motivational Patterns of Women Entrepreneurs in Ramnad District" - UGC-SAP-DRS-I Sponsored National Seminar, Department of Business Administration, Annamalai University, 13-14 March 2018
- "Influence of Training and Development of SHG Members' Performance- A Path Analysis Approach" - UGC-SAP-DRS-I Sponsored National Seminar, Department of Business Administration, Annamalai University, 13-14 March 2018
- "A Comparative Study of Training Practices Adopted in Co-Operative and Private Dairy Plants" - 6th International Conference, Vivekanandha College of Arts & Sciences for Women, 1-2 February 2018
- "Employees Reactions in Predicting Motivational Training provided by The Dairy Plant Owners" - National Seminar on "Research & Development in SMEs," Department of Business Administration, Annamalai University, 21-22 September 2017
- "Common property Resources and Grazing Dairy Cows: Strengthening Explanations" - ICSSR Sponsored National Seminar, Centre for Rural Development, Annamalai University, 23-24 March 2017
- "Effectiveness of Selection Process of Self Help Groups in Namakkal District, Tamil Nadu" - UGC-SAP-DRS-I Sponsored National Seminar, Department of Business Administration, Annamalai University, 29-30 March 2016

## Professional Roles & Honors
- Reviewer for International Journal of Latest Technology in Engineering, Management & Applied Science (IJLTEMAS), from 2024
- Reviewer for International Journal of Research and Innovation in Social Science (IJRISS), from 2024
- Reviewer for International Journal of Innovation in Social Sciences (IJISS), 2020
- Secretary for Management Research Forum (MRF), Department of Business Administration, Annamalai University
- Head of Department (i/c), Department of Management Studies, St. Joseph University

## Professional Development Summary
- International Conference/Webinars Participated: 14
- National Seminars/Webinars Participated: 39
- Research Methodology Workshops Attended: 11
- Other Training Programmes Attended: 16
- Faculty Development Programmes (FDP) Participated: 22
- Programmes/Webinars Organized: 12
- NPTEL/Swayam Courses Completed: 2


## Identifiers & Contact
- Email: mkarthikmba@svecw.edu.in
`;

const MBA_SWARNA_JYOTHI_TEXT = `
## Educational Qualifications
- MBA in HRM & Marketing from Acharya Nagarjuna University, Guntur, Andhra Pradesh, 1993
- B.Sc in BZC from Siddhartha Mahila Kalasala, Vijayawada, 1991

## Professional Experience
Teaching Experience: 31 years
- D.N.R. College, Bhimavaram: 16 years, 6 months
- SVECW, Bhimavaram: 14 years

## Additional Qualifications
- SLET qualification (1999)
- NET qualification (2000)

## Seminars Attended
- Quality Development Programme by AICTE & Institute of Public Sector Management, Andhra University, Vizag (March 14-28, 2003)
- Citizens Charter seminar, Consumer Awareness Rural Research Centre & D.N.R. College Association, Bhimavaram (September 27, 2003)
- Consumer Education seminar, Consumer Awareness Rural Research Centre & D.N.R. College Association, Bhimavaram (December 21, 2003)
- Rapporteur at seminar on "WTO and Agricultural Sector in India - Challenges and Prospects," P.G. Department of Economics, D.N.R. College, Bhimavaram
- Faculty development program on pedagogy by VEDIC, Hyderabad (March 7-8, 2016)

## Workshops
- ISO-9000 workshop, SRKR Engineering College, Bhimavaram (December 14, 1996)
- National Workshop on Case Development, Vellore Engineering College, Vellore (March 21-25, 1997)
- Teacher Training Programme in Strategic Management, Indian Institute of Management, Bangalore (December 24-29, 2007)
- UGC-SAM Workshop, UGC Delhi at Andhra University, Visakhapatnam (November 3-7, 2008)
- Capacity building for faculty in Management, NIT Rourkela (February 14-28, 2016)
- Workshop on advanced optimization techniques, VEDIC, Hyderabad (October 21-22, 2016)

## Conferences
- Delegate at XLVIII All India Commerce Conference, Kakatiya University, Warangal
- Participant in XXIInd A.P. Economic Annual Conference, Andhra Pradesh Economic Association, D.N.R. College, Bhimavaram
- Paper presentation on "A Brief Insight into CRM in India," National Conference, TJPS College, Guntur (August 29, 2006)
- Paper publication titled "Empowerment of women technocrats in Science and technology in India," International Seminar on Negotiating Socio-cultural Spaces: Rethinking Dynamics of Gender (November 2018)
- Project Proposal presentation on "Empowerment of Women Technocrats in R&D - A Study in the Manufacturing Sector" to DST, Government of India, Kerala (2018)
- Participant in Social Leadership Summit by CII - Development agenda for 2022 (2019)

## Teaching Innovations
- Designed a certificate course on communication and personality development (40 days duration) and issued certificates to 25 candidates
- Applying the concept of Peer Teaching

## Co-Curricular Activities
- Member of organizing committee for Seminar on Citizen Charter, Seminar on Consumer Education, and 22nd Annual Conference, D.N.R. College Association
- Co-coordinating personality development forum, PARINATI, with two organized programs
- Designed placement brochure for MBA, 2006-2010 Batches
- Convener for IQAC for MBA & Maths departments
- Continuously involved in role plays, group discussions, management games, seminars, short and long presentations

## Professional Memberships
- Member in Editorial Board of Half Yearly Journal of Social Research - Human Endeavor

## Extension and Community Work
- Resource Person and Interview Panel member, VELUGU Project, DRDA & A.P.R.P.A. Programme, A.P. State Government (January 2002)
- Resource Person and Interview Panel member, VELUGU Project, DRDA & A.P.R.P.A. Programme, A.P. State Government (June 2002)
- Participated in two Passport Camps service, D.N.R. College, Bhimavaram
- Participated twice in Prime Minister's Rojgar Yojana (PMRY) Program as resource person
- Offered four-day training at M.D.O. Office, Bhimavaram to PMRY beneficiaries
- Resource person in MARPU Program, A.P. State Government
- Visiting faculty, ICFAI, Bhimavaram Center (2007-2009)
- Part-time faculty, IGNOU center, D.N.R. College, Bhimavaram
- Visiting faculty for Acharya Nagarjuna University distant mode M.B.A program
- Resource person at Community Network Center, Department of Social Work, D.N.R. College, Bhimavaram


## Identifiers & Contact
- Email: swarnajyothi@svecw.edu.in
`;

const MBA_ANUDEEP_TEXT = `
## Qualifications
- Ph.D.: Pursuing from Gitam University in Marketing (since 2018)
- MBA: HRM & Marketing from Andhra University, Andhra Pradesh, 2011
- B.Sc: Mathematics, Physics, Chemistry from Andhra University, 2009

## Experience
- Teaching: 12 years
- Research: 6 years

## Research Publications
SCOPUS Journal Articles:
- "Female buying behaviour towards cosmetics in west Godavari districts" (European Chemical Bulletin, 2023)
- "Disaster Management in India" - International Research Journal (2015)
- "Employee involvement schemes" - Asian Journal of Multidisciplinary Studies (2015)
- "A Study of Awareness on E-Banking Services in India" (2015)
- "A Conceptual Study Of Organized Retail Industry In India" (2016)
- "Digital India stratagem" conceptual contribution (2016)
- "Is GST A Boon or Guilt to Indian Economy" - The International Manager (2017)
- "Digital Marketing and Its Remonstrance" - Anveshana Journal (2017)

## Conference Papers Presented
- "Consumer Behavior in Post-Pandemic Era" - ICAECT 2025 (January 9-10)
- "Blockchain-Based Loyalty Program Model" - CSNT (April 6-7, 2024)
- "Predicting Customer Churn in E-Commerce" - ICCSNT (June 24-27, 2024)
- "Female buying behaviour" - SSN Conference (February 24-25, 2023)
- "Female buying behaviour" - HSABEE-2023 Bangkok (April 11-12, 2023)

## Professional Development
- 10 International Conference/Webinars Participated
- 40+ National Seminars/Webinars Participated
- 41 Online Courses Completed
- 06 Faculty Development Programs Participated
- 03 Research Methodology Workshops Attended

## Notable Achievements
- Gold Medal recipient in MBA for academic merit
- NIIT Certificate holder for Software Engineering Diploma
- Innovation ambassador since 2018
- Business plan mentor for BAJA SAEINDIA teams (6+ years)
- Mentor for VISHVA-Technology Business Innovation initiative
- Managed Department of Management Studies at SVECW


## Identifiers & Contact
- Email: ch.anudeep@svecw.edu.in
`;

const MBA_HARSHITHA_KEERTHI_TEXT = `
## Educational Qualifications
- Ph.D.: Pursuing at SR University, Warangal
- MBA: Finance & HRM from DNR College of Management Studies, 2018
- BSc: Mathematics, Physics, and Chemistry, 2016

## Professional Experience
- Teaching Experience: 6 years

## Professional Development
National Seminars/Webinars Participated:
- "Managing Digital Disruption: The New Mantra Of Business" (December 6, 2023)
- National Webinar on Consumer Rights and Education (October 19, 2023)

Workshops Attended:
- AI Hacks in MS Office by Skill Nation (December 9, 2023)
- Microsoft AI Tools Workshop (November 22, 2023)

Training Programmes:
- Vedic Training Programs on Teaching Learning Practices
- SAP Support System Module and SAP SD

Faculty Development Programmes:
- One-week National FDP on "Financial Econometrics" (November 20-26, 2023)
- Eight-day National FDP on "Case Based Learning, Teaching, Writing And Publication" by VIGNAN's University (September 25 - October 2)

## Additional Certifications & Experience
- SAP S4 HANA Certification
- Freelance HR recruiter experience
- Project management in SAP HANA


## Identifiers & Contact
- Email: mkeerthimba@svecw.edu.in
`;

const MBA_PRABHAVATHI_TEXT = `
## Education
- Ph.D. Faculty of Management Studies, Visvesvaraya Technological University, Belagavi, 2024
- MBA Finance, Visvesvaraya Technological University, Belagavi, 2013
- BBM Finance, Gulbarga University, 2007

## Experience
- Teaching Experience: 4.5 Years
- Research Experience: 5 Years

## Journal Publications
- Prabhavathi, K., & Dinesh, G. P. (2023). "Performance of social good in the Indian banking sector and its impact." Prabandhan: Indian Journal of Management, 16(4), 28-45 (Q2 Journal)
- Prabhavathi, K., & Dinesh, G. P. (2018). "Banking: Definition and evolution." International Journal of Scientific & Engineering Research, 9(8), 745-753
- Prabhavathi, K., & Dinesh, G. P. (2017). "The study of CSR spent in Indian banking industry." International Journal of Research and Scientific Innovation, 4(9), 32-37

## Conference & Seminar Publications
- Khare, S., Gupta, D., Prabhavathi, K., Deepika, M. G., & Jyotishi, A. (2017, December). "Health and nutritional status of children: survey, challenges and directions." International Conference on Cognitive Computing and Information Processing, Singapore: Springer Singapore, pp. 93-104
- Kumar, M. S., Babu, S., & Prabhavathi, K. (2019). "Willful default or socially responsible-A study of Indian banks and companies." Proceedings of the International Conference on Industrial Engineering and Operations, Management, pp. 3632-3633
- Prabhavathi, K., Dinesh, G. P., Kanth, B. R., & Rao, C. S. P. (2021). "Customer convenience: a cause for technological changes in banking sector." Proceedings of the International Conference on Industrial Engineering and Operations Management, pp. 530-540
- Manasaa, S., Prabhavathi, K., & Babu, S. (2018, September). "Performance of mandated Corporate Social Responsibility of Indian Companies." 2018 International Conference on Advances in Computing, Communications and Informatics (ICACCI), IEEE, pp. 1998-2004
- Prabhavathi K., Babu S. & Dinesh, G.P. (March, 2020). "Evaluation of Pre versus Post Merger of Indian Banks." 2018 International Conference on Advances in Computing, Communications and Informatics (ICACCI), IEEE, pp. 1998-2004
- Kalshetty, P., Sundararajan, R., Babu, S., & Dinesh, G. P. (2020). "Comparison of Social Good versus NPA of Indian Banks." Proceedings of the International Conference on Industrial Engineering and Operations Management, pp. 854-60
- Prabhavathi K., Amalendu Jyothishi, Deepika M G. (2015). "Influence of Mother's Physical Condition on Malnutrition among Children." National Conference on Doctoral Research, Christ University, Bengaluru

## Reviewer Roles
- Zagreb International Review of Economics and Business

## Professional Roles
- Acted as Coordinator for MBA-MS (University of Buffalo) at Amrita University, Bengaluru

## Workshops & FDPs Organized
- Coordinator for five-day virtual FDP on "Research Tools and Techniques in Business Management"
- Coordinated and organized Alumni engagement talks & Expert talks as part of SCAIR

## Seminars, Conferences, FDP & Seminars Attended
- Workshop on "Business Analytics and Machine Learning," NIT, Calicut (September 25-29, 2021)
- ATAL FDP "Data Analytics and Machine Learning," Central University of Jharkhand (September 20-24, 2021)
- ATAL FDP "Nurturing today's learners to become tomorrow's leaders to face global challenges," MSRIT, Bengaluru (September 13-17, 2021)
- ATAL FDP "Sustainable Change Management," Internal Management Institute, Kolkata (September 6-10, 2021)
- Workshop "Two Day Workshop on Master the Communication Processes Using Gmail," Scrollwell (September 4-5, 2021)
- 7-Days Virtual FDP on "Writing and Publishing Quality Research Papers," Reva University (August 16-22, 2021)
- Workshop on "Artificial Intelligence," DST-Amrita Technology Enabling Center, Amrita University (August 7, 2021)
- 10-day FDP on "online teaching platforms and tools," Scrollwell (August 6-15, 2021)
- Paper presentation titled "Customer Convenience- A Cause for Technological Changes in Banking Sector," First Indian International Conference of Industrial Engineering and Operations Management (August 2021)
- Workshop on "How to write a research paper for an international journal- Tips, Traps and Tricks," Springer nature in collaboration with Amrita University (July 30, 2021)
- Virtual workshop on "Recent Research Trends in Literature" (March 2021)
- FDP "Nurturing Innovation leading to Patent Generation," Andhra Pradesh (October 19-21, 2020)
- FDP "Research Methodology in Management," NIT Andhra Pradesh (September 19-25, 2020)
- Online webinar "Questionnaire Design, Data Preparation and Basics of SPSS," Anant Education Foundation (September 24-27, 2020)
- Online webinar "Exploratory Factor Analysis using SPSS," Anant Education Foundation (August 29-30, 2020)
- Online webinar "Qualitative Analysis using NVIVO software," Anant Education Foundation (August 14-16, 2020)
- Workshop "Data Analysis using R Programme," Vijayanagara Sri Krishnadevaraya University (July 6-7, 2020)


## Identifiers & Contact
- Email: drkprabhavathimba@svecw.edu.in
`;

const MBA_SATISH_TEXT = `
## Educational Qualifications
- MBA in Finance - Jawaharlal Nehru Technological University, Kakinada, 2020
- M.Com in Finance and Accountancy - Andhra University, 2016
- MA in Economics - GITAM University, 2021
- B.Com - AKRG Degree College, Andhra University, 2014
- AP-SET in Commerce - Qualified, 2024

## Professional Experience
- Teaching Experience: 7 years

## National Seminars/Webinars Participated
- Webinar on "Securing Smart Contracts: A Comprehensive Study of Blockchain Security Risk" - Nueva Ecija University of Science and Technology, Cabanatuan City, Philippines (2 December 2023)
- "Importance of Trust in Leadership" session - Association of Indian Management Schools (29 September 2023)
- "Consequences COVID-19 on Indian Economy in Banking and Retail Sectors" webinar (27 May 2020)
- Two-day International Webinar on "Impact of COVID-19 on Environment and Science & Technology" (26-27 May 2020)
- "Customer Relationship Management" webinar (23 May 2020)
- "Corona Pandemic and Indian Economy" webinar (22 May 2020)
- "Entrepreneurial Challenges and Opportunities" webinar (20 May 2020)

## Faculty Development Programs
- Completed FDP on Indian Knowledge System under Malaviya Mission-Teacher Training Programme, UGC - JNV University, Jodhpur, Rajasthan (3-10 July 2024)
- International Faculty Development Program on "Research Writing, Proposal Writing and Research Grants" - Andhra Loyola Institute of Engineering and Technology with Mindanao State University-Sulu, Philippines (23-29 February 2024)
- Eight-Day National FDP on "Case-Learning, Teaching, Writing and Publication" - VFSTR Deemed to be University, Vadlamudi, Guntur District (25 September - 2 October 2023)
- Five-Day National Level Online FDP on "Promoting Innovations in Business Management" - Andhra Loyola Institute of Engineering and Technology (26-31 May 2022)
- Vedic Training Programs on Teaching Learning Practice (participated)

## Workshops
- ICSSR-SRC sponsored Two-Day Workshop on "Data Analysis for Social Science Research" - SRR & CVR Government Degree College (Autonomous), Vijayawada (20-21 June 2024)
- IP Awareness Program under National Intellectual Property Awareness Mission (13 September 2023)
- NPTEL E-Awareness Workshop - NPTEL, IIT Madras (14 August 2023)
- NPTEL E-Awareness Workshop - NPTEL, IIT Madras (11 August 2023)

## Achievements
- UGC merit scholarship holder 2011-2016
- First rank in intermediate at college level (2010)


## Identifiers & Contact
- Email: msatishmba@svecw.edu.in
`;

const MECH_HOD_TEXT = `
## Educational Qualifications
- Ph.D.: NIT Warangal, 2015
- M.Tech: NIT Warangal, 2007
- B.Tech: V.R. Siddhartha Engineering College, 2005

## Professional Experience
- Teaching: 15 years 5 months
- Research: 9 years
- Industry: 1 year

## Research Specializations
- Manufacturing-Metal forming, Friction stir welding, Additive manufacturing, Surface modification, Material characterization, Machine learning

## Subjects Taught
- Materials & Manufacturing, Robotics, Metrology, Operations Research, 3D printing, Python programming

## Administrative Roles
- Head of Department; NBA program coordinator; Manufacturing Technology Lab in charge; Applied Robotics Lab coordinator; Teaching-Learning Committee coordinator

## Funded Research Projects
- DST Project: "Ultrasonic nanocrystal surface modification of SS316 components manufactured through selective laser melting and assessment of fatigue characteristics" (TAR/2021/000118) - 18.3 lakhs, collaborating with Dr R. Vijay, Scientist-G, ARCI Hyderabad
- AICTE Project: Additive Manufacturing for Medical and Aerospace applications (File NO: 34-66/I54/FDC/STTP/Policy-1/2019-20) - 4 lakhs
- DST Project: 2-day seminar on Smart materials and structures (F.No: sB/ss/9L/15-16) - 75,000 rupees

## Patents
- Indian Patent Application No.201941036277 A: "EXHAUST" filed 10/09/2019

## Professional Certifications
- Yellow belt Six Sigma certification

## Journal Reviewer Positions
- Journal of Mechanical Science and Technology (Springer); Materials Design (Elsevier); Journal of Testing and Evaluation (ASTM); Part E: Journal of Process Mechanical Engineering (SAGE); Part B: Journal of Engineering Manufacture (SAGE); Part C: Journal of Mechanical Engineering Science (SAGE); Experimental Mechanics (Elsevier); Mechanics of Materials; Journal of Institution of Engineer India-C (Springer); Journal of Brazilian Society of Mechanical Sciences and Engineering; SN Applied Sciences (Springer); Advances in Civil Engineering (Hindawi); Journal of Magnesium and Alloys (Elsevier); Materials Today Proceedings (Elsevier)

## Research Collaborators
- Dr R. Vijay (ARCI); Dr U. Chandra Sekhar (Wipro 3D); Dr Chandan Mandal (DMRL); Taraknath De (ASL, DRDO); Dr MJ Davidson (NIT Warangal); Dr D Ravi Kumar (VNIT Nagpur); Dr B Anil Kumar (NIT Manipur); Dr Ch Nagaraju (V.R. Siddhartha Engineering College)

## International Exposure
- Visited NUS Singapore for international conference; attended training program on Applied Robotic Control in Germany

## Student Mentoring Achievements
- CATERPILLAR Manufacturing Challenge: 1st prize
- HeroMotor Corp Challenge: 2nd prize
- L&T TechGium Challenge: reached finals among 20,000 teams
- Ferucia Novus Challenge: reached finals among 500+ teams
- BAJA GoGreen Award: exhaust system design and development
- BAJA lightweight component development mentoring


## Identifiers & Contact
- Email: hodmechanical@svecw.edu.in
- SVECW ID: 328
- Google Scholar Id: zTS7Z3sAAAAJ&hl
- Scopus Id: 55681818700
- ORCID Id: 0000-0002-3055-3314
- Vidwan ID: 149710
`;

const MECH_P_SRINIVASA_RAJU_TEXT = `
## Educational Qualifications
- Ph.D.: Rayalaseema University, 2011
- M.Tech: Machine Design, JNTU Kakinada, 2004
- B.E.: Mechanical Engineering, Andhra University, 1997

## Teaching Experience
- 25 years

## Specialization Areas
- Design and fuel cell technologies

## Courses Taught
- Engineering Drawing, Basic Mechanical Engineering, Mechanics of Solids, Management Science, Design of Machine Members I & II, Power Plant Engineering, Fluid Mechanics and Hydraulic Machinery, Engineering Workshop, Production Technology Lab, Mechanics of Solids Lab

## Key Administrative Roles
- Director - Student Affairs (SVES); Department Head (2009-2020); Faculty Advisor for Team Ziba Racers (SAE BAJA); TEQIP-II Coordinator; Co-PI for Women Technology Park

## Professional Memberships
- Life Member, Indian Society for Technical Education (LM 37568)
- Life Member, Computer Society of India (ID: 01120440)
- Life Member, Institute of Engineers (MIE-M148573-8)
- Fellow, Institution of Engineers (F-1214426)
- Society of Automotive Engineers (7180410250)


## Identifiers & Contact
- Email: viceprincipal@svecw.edu.in
- SVECW ID: 301
- AICTE Registration ID: 1-459196329
- Google Scholar Id: mfn4zxQAAAAJ
- Scopus Id: 57208338507
- ORCID Id: 0000-0002-1309-5796
- Vidwan ID: 149711
`;

const MECH_G_SRINIVASA_RAO_TEXT = `
## Educational Background
- Ph.D.: VTU Belgaum, 2009
- M.Tech: Manufacturing Technology, NIT Calicut, 1992
- B.Tech: S.V. University College of Engineering, Tirupathi, 1990
- Polytechnic: SV Government Polytechnic, Tirupati, 1986

## Experience
- Teaching: 32 years
- Research: 15 years

## Research Specializations
- Fracture Mechanics, Mech. Engg - CAD/CAM, FEM, CFM, with expertise spanning mechanics of solids, design, and manufacturing processes

## International Exposure
- Countries visited for educational collaboration: Germany, France, Singapore, Dubai, Abu Dhabi

## Key Institutional Contributions
- Oversaw NBA accreditation cycles, directed UGC autonomous status achievement (2014, 2021), managed NAAC accreditation processes, and established the Institutional Innovation Council in 2018-19

## Professional Memberships
- Life Member ISTE (LM19646), Member SAE, Member ASEE (83698), Fellow Member Institute of Engineers India (F-1209384)


## Identifiers & Contact
- Email: principal@svecw.edu.in
- SVECW ID: 888
- AICTE Registration ID: 1-458702649
- Google Scholar Id: vGAK4h4AAAAJ
- Scopus Id: 56993036000
- ORCID Id: 0000-0001-9523-9986
- Vidwan ID: 45712
`;

const MECH_SURYA_PRAKASH_VARMA_TEXT = `
## Educational Qualifications
- Ph.D.: Pursuing from AU College of Engineering
- M.Tech: Thermal Engineering (Graduated 2006)
- B.E: Mechanical Engineering (Graduated 1997)

## Professional Experience
- Teaching Experience: 18 years
- Industry Experience: 3 years

## Specializations
- Thermal engineering and internal combustion engines

## Administrative Roles
- Coordinator for GATE examinations in ME Department
- Controller of Examinations (December 2017 to November 2021)

## Professional Memberships
- Member of The Institution of Engineers - India (MIE)
- Member of Oracle Academy

## Recent Publications
Faculty has published peer-reviewed articles addressing biofuel sustainability and machining analysis in recognized journals including IOP Publishing and Canadian Science Publishing.


## Identifiers & Contact
- Email: spvarmap@svecw.edu.in
- SVECW ID: 320
- AICTE Registration ID: 1-2379929619
- Google Scholar Id: MyB1KqEAAAAJ
- Scopus Id: 57222353638
- ORCID Id: 0000-0003-2101-0374
- Vidwan ID: 149709
`;

const MECH_N_SRINIVASA_RAO_TEXT = `
## Education
- Ph.D.: Pursuing from Andhra University, Vizag
- M.Tech: Automobile Engineering, NIT-W, 2010
- B.Tech: Mechanical Engineering, 2008

## Professional Details
- Teaching Experience: 12 years

## Specialization Areas
- Heat Transfer
- Refrigeration & Air-Conditioning

## Courses Taught
- Thermodynamics, Fluid Mechanics & Hydraulic Machines, Thermal Systems, Heat Transfer, Mechanics of Solids, Dynamics of Machinery, Mechanics of Machines, Refrigeration & Air Conditioning, Automotive Prime Movers, plus associated laboratory courses and BCME

## Administrative Roles
- Coordinator for NBA Criteria-4 and NAAC Criteria-2; Class Incharge-III; HT Lab supervision

## Professional Development Programs
- "Sustainable energy systems and applications" (one week) - Velagapudi Ramakrishna Siddhartha Engineering College, 11-16 December 2023
- "Finite Element Methods - Theory and Practice (Ansys)" (five days) - IIT Tirupati, 19-23 June 2023
- "Trends & Challenges in the Development of Electric Vehicles & Hybrid Electric Vehicles (SERIES-2)" (one week online) - Lendi Institute of Engineering & Technology, 14-18 November 2022
- "Trends & Challenges in the Development of Electric Vehicles & Hybrid Electric Vehicles (SERIES-1)" (one week online) - Lendi Institute of Engineering & Technology, 26-30 September 2022
- "Emerging Trends In Mechanical Engineering" (one week online) - Seshadri Rao Gudlavalleru Engineering College, 20-25 June 2022
- "Artificial Intelligence/Machine Learning for Mechanical Engineering Problems" (one week online) - SVECW, 21-26 March 2022
- "Learning through Virtual Labs for Technical Institutions" (one week online) - Lendi Institute, 18-22 October 2021
- "Research Tools & Methodologies" (one week online) - Lendi Institute, 27 September-1 October 2021
- "Emerging Research Opportunities for Mechanical Engineers" (one week online) - CMR Engineering College, 10-14 August 2020
- "Recent Developments in Mechanical Engineering" (one week online) - PVP Siddhartha Engineering College, 10-14 August 2020
- "Advanced Automation in Metal Industry" (three days online) - Raghu Engineering College, 21-23 July 2020
- "Fuel Cell Technologies for Hybrid and Electric Vehicles" (one week online) - MVGR Engineering College, 17-22 August 2020

## Professional Membership
- AMIE (Associate Member, The Institution of Engineers India)

## Research Publications
Journal Publications:
- "Performance Estimation of Self-Circulating Fluidized Bed Gasification with mixtures of Biomass" - Journal of Physics: Conference Series
- "An investigation on the mechanical and corrosion characteristics of magnesium-zinc alloy nanocomposites manufactured via ultrasound-assisted stir squeeze casting" - Journal of Metallurgical Research & Technology
- "Microstructure, mechanical properties of dissimilar friction stir welded AA6063/AA5052 alloys, and optimization of process parameters using Box Behnken-TOPSIS approach" - Kovove Materialy-Metallic Materials
- K. Srividya, S. Ravichandran, M. Thirunavukkarasu, Itha Veeranjaneyulu, P. Satishkumar, K. Bharadwaja, N. Srinivasa Rao, Ram Subbiah, Javvadi Eswara Manikanta: "Examination of electrochemical machining parameters for AA6082/ZrSiO4/SiC composite using Taguchi-ANN approach" - International Journal on Interactive Design and Manufacturing (IJIDeM)
- Gugulothu, B., Saminathan, R., Pradeep, A., Sharma, A., Vijayakumar, S., Paramasivam, P., Srinivasa Rao, N.: "Investigating the strength of butt-welded joints of AA6082 and AA5052 alloys through friction stir welding; the impact of tool tilt angle and feed rate" - Journal of Adhesion Science and Technology (2023)
- Satish, G., Ashok Kumar, K. and Srinivasa Rao, N., 2019: "Fabrication and Characterization of CNT-Based Hybrid Composite" - Recent Advances in Material Sciences: Select Proceedings of ICLIET 2018, Springer Singapore

Conference Proceedings:
- Gugulothu, B., Kumar, P.S., Rao, N.S., Vijayakumar, S., Rajkumar, D.R., Rao, T.J. and Naga Swapna Sri, M., August 2023: "Friction Stir Welded Magnesium AZ31B Alloy Used to Evaluate Mechanical Properties at Various Rotational Speeds" - International Conference on Smart Sustainable Materials and Technologies
- Mahesh, G., Domakonda, V.K., Farooq, S., Subbiah, R., Rajkumar, D.R., Rao, N.S. and Vijayakumar, S., August 2023: "Evaluation of Hardness Properties of Al7475/B4C/Fly Ash Hybrid Composites Using Friction Stir Process" - International Conference on Smart Sustainable Materials and Technologies


## Identifiers & Contact
- Email: srinivasaraon@svecw.edu.in
- SVECW ID: 313
- Google Scholar Id: P6Okj1sAAAAJ
- ORCID Id: 0000-0003-0481-0943
- Vidwan ID: 149702
`;

const MECH_JV_NARASIMHA_RAJU_TEXT = `
## Educational Qualifications
- Ph.D. from Centurion University, Visakhapatnam (Graduated 2024)
- P.G. from SRKR Engineering College, Bhimavaram (Graduated 2012)
- B. Tech (Graduated 2008)

## Experience
- Teaching Experience: 12 Years
- Research Experience: 6 Years

## Areas of Specialization
- Manufacturing, Production Technology, Metal Cutting and Machine Tools, Unconventional Machining Processes, Non Destructive Evaluation, Basic Mechanical Engineering, Management Science

## Roles and Responsibilities
- SVECW Hostel In-charge Coordinator
- Dean Administration Coordinator

## Professional Development
- FDPs Attended: 55
- Coursera Certifications: 56
- NPTEL: 1

## Publications and Recognition
- SCI: 2 publications
- Scopus: 1 publication
- UGC: 3 publications

## Professional Membership
- Institute of Engineers (INDIA)


## Identifiers & Contact
- Email: vnrajujampana@svecw.edu.in
- SVECW ID: 3001
- Google Scholar Id: http://scholar.google.co.in/citations?user=7jgJsThejAAAAJ
- Scopus ID: 57273385600
- ORCID: https://orcid.org/0000-0001-9231-6704
- Vidwan ID: https://vidwan.inflibnet.ac.in/profile/149707
`;

const MECH_SATYA_KRISHNA_TEXT = `
## Education
- Diploma: Mechanical Engineering, SMVM Polytechnic, Tanuku
- B.E.: Mechanical Engineering (2011)
- M.E.: Automobile Engineering, Madras Institute of Technology, Anna University (2013)
- Ph.D.: Pursuing from Andhra University, Visakhapatnam

## Professional Information
- Teaching Experience: 10 years

## Specialization Areas
- Automobile Engineering
- Refrigeration and Air Conditioning

## Subjects Taught
- Automobile Engineering, Basic Mechanical Engineering, Engineering Drawing, Power Plant Engineering, Thermodynamics, IC Engines, Refrigeration & Air Conditioning, Machine Drawing, Kinematics of Machines, Thermal Engineering Lab, Machine Tools Lab, Production Lab, Heat Transfer Lab, Fluid Mechanics & Hydraulic Machinery Lab, Matlab Programming, Design Thinking

## Key Roles
- Thermal Engineering Lab In-charge
- Tech Guru, AICTE IDEA Lab
- Department Timetable Coordinator
- Innovation Ambassador
- IIC, ARIIA, NAAC and NBA Criteria-1 Coordinator

## Professional Development Activities
Faculty Development Programs:
- "Artificial Intelligence/Machine Learning for Mechanical Engineering Problems" (one-week online FDP, organized)
- "Design Thinking and Prototyping for Industry 4.0" (one-week ATAL Basic Idea Lab FDP, organized)
- "CATIA Toolbox for Emerging Industrial Applications" (one-week student training, organized)
- "Advances in Modeling using CATIA with Hands-on Experience" (2018)
- "Additive Manufacturing (3D Printing)" (one-week, October 16-20, 2023)
- "Basic FDP on IDEA Lab" (2022, AKGEC, New Delhi)

Conferences & Seminars:
- Young Scientist Conference - India International Science Festival 2018, Lucknow, U.P.
- Hybrid Electric Vehicle Technology 2018, MVGR, Vizianagaram
- Regional Research Symposium - Project Based Learning 2019, KLE Technological University, Hubli
- "Recent Advances in Renewable Energy" (2020)
- "Refrigerants Progression" (2020)
- "Smart Manufacturing" (2022, Dr. D. Y. Patil University, Pune)

Online Certifications:
- "Introduction to IoT" (NASSCOM Future Skills - Cisco Networking Academy)
- "Entrepreneurship Awareness Program" (AICTE Evaluated, 16-day, Turnip Innovations)
- "Six Sigma Principles" (Coursera)
- "Design Thinking - A Hands-on Course" (Udemy)
- "Fundamentals of Macroscopic and Microscopic Thermodynamics" (Coursera)
- "Introduction to Thermodynamics" (Coursera)
- "Quantum Mechanics" (Coursera)
- "Six Sigma" (Coursera)
- "MATLAB onramp course" (Mathworks)
- "Innovation Ambassador training Foundation Level" (MoE innovation cell & AICTE)

## Research Publications
- "Performance and Emission Characterization of Brown Gas Based Petrol Engine" - IJAER, Vol. 9, No. 23
- "Random Vibration Analysis of Mechanical Hardware of Flight Data Recorder" - ARPN, Vol. 11, No. 8

## Design Patents
- Wheel Rim - Design patent no. 316255-001
- Organic Waste Compost Machine for Home Purpose - Design patent no. 331815-001
- Aero Solid Tyre for Motor Cycle - Design patent no. 332810-001
- Airless Tyre for Motor Cycle - Design patent no. 332808-001
- Integrated Airless Wheel - Design patent no. 348726-001
- PILL BOTTLE - Design patent no. 341591-001


## Identifiers & Contact
- Email: satya.krishna02@svecw.edu.in
- SVECW ID: 329
- Google Scholar ID: nmorn8YAAAAJ
- ORCID ID: 0000-0003-2035-989X
- Vidwan ID: 153057
`;

const MECH_MANONEET_KUMAR_TEXT = `
## Educational Qualifications
- Ph.D.: Lithium Battery Thermal Management at JNTU - Ananthapuram
- M.Tech: CAD/CAM from SRKR Engineering College (Graduated 2018)
- B.Tech: Mechanical Engineering from LPU-Punjab (Graduated 2014)

## Professional Details
- Teaching Experience: 10 years

## Specialization Areas
- Automobile Engineering
- Electric Vehicles
- Autonomous Vehicles

## Subjects Taught
- Automobile Engineering
- Hybrid Vehicles
- Manufacturing Technology (Welding, Casting, Metal Cutting, Machining)
- Metrology
- Engineering Workshop
- Production Technology Lab

## Key Responsibilities
- Incharge: Vehicle Design Lab
- Incharge: Student Hub
- Faculty advisor for SAE activities and events

## Professional Development (Training/FDP)
- 3-day training on Hybrid & Electric Vehicles, Devise Electronics-Pune (April 8-10, 2019)
- 1-week ANSYS Workbench 14.0 training, Bhimavaram
- 2-day Metal 3D printing additive technology training, Bangalore (December 20-21, 2019)
- 5-day FDP on Electric and Hybrid Vehicle Design/Development, COEP Pune (SAE India)
- 1-week EV Technology FDP, IIT-BHU

## Professional Memberships
- AMIE (Associate Member, Institution of Engineers India)
- SAE Member

## Publications
- Research paper presented at 5th International Conference on Applied Science Engineering and Technology (ICASET-18): "Design, Analysis, Simulation and Fabrication of a High Torque & Light weight Gearbox for ATV"
- "Hubless Rim Concept in Driven Wheels" published in International Journal of Science Technology & Engineering

## Guest Lectures Delivered
- 3-day lecture series on "Advancements, Current Trends of Automobile & EV Technology," Pimpri Chinchwad Polytechnic (August 28-30, 2019)
- 2-day lecture on "Automobile Prototyping," KL University, Vijayawada (October 18-19, 2019)
- Online lecture on "Future mobility & Vehicle Design" for SRMU-Lucknow (October 15, 2020)
- Online lecture on "Motors in EV" for GITS-Udaipur (February 8, 2021)
- 3-day workshop on "Product Development Strategies and concepts in Motorsport Engineering," Aditya Institute of Technology & Management-Tekkali (February 11-13, 2024)

## Recognition and Achievements
- Marshal for 1st and 4th Round of e-Formula F1 Race, Hyderabad (February 2023)
- Best Team Advisor (Dronacharya) award, BAJA SAE-India (2019, 2022)
- Recognition for introducing Electric Bike Race event at university
- Certificate of Appreciation for judging National Gokart Championship
- International recognition for designing and fabricating in-house Electric Smart Car with "Hubless Rim Concept" and "Low space parking Technology"

## Events Organized
- Organizing committee head and administrator for national events
- Organizer: Electric Solar Vehicle Championship (2017, 2018)
- Organizer: Vishnu Karting Championship (2016 with 21 teams; 2017 with 28 teams)
- Organizer: Vishnu E-Motor Championship (2016 with 22 teams)
- Organizing committee member: REEV (SAE India)
- Co-Convener: e-BAJA2024


## Identifiers & Contact
- Email: manoneet.kumar@svecw.edu.in
- SVECW ID: 326
- AICTE Registration ID: 1-4489892499
- Google Scholar ID: 2yPovi8AAAAJ
- ORCID ID: 0000-0001-7334-0178
- Vidwan ID: 149703
`;

const MECH_PRATHAP_VARMA_TEXT = `
## Education Qualifications
- Ph.D.: Pursuing from Anna University, Tamil Nadu
- M.Tech: CAD/CAM from SRKR Engineering College (2018)
- B.Tech: Mechanical Engineering (2014)
- Teaching Experience: 5 years

## Specialization
- Design and Manufacturing

## Courses Taught
- Engineering Drawing, Computer Aided Design, Computer Aided Manufacturing, Automation in Manufacturing, Measurements and GD&T, Operations Research, Universal Human Values, Engineering Workshop Lab, Design Analysis Lab, CAM and 3D Printing Lab, Part Modeling and Assembly Lab, Surface Modeling and Sheet Metal Working Lab

## Administrative Roles
- Department-level Placement Coordinator, Internal Academic Audit Coordinator, Library Coordinator, CAM/3D Printing Lab In-charge, CAD Lab In-charge, MOUs Coordinator, IMTMA Coordinator

## Professional Memberships
- IAENG (International Association of Engineers)
- IOV Registered Valuers Foundation

## Peer-Reviewed Publications
- "Enhancing Data Security Solutions for Smart Energy Systems in IoT-Enabled Cloud Computing Environments through Lightweight Cryptographic Techniques" - Uddarraju Dhana Satya Prathap Varma, Kantheti Prasadaraju, S Sugumaran
- "Experimental investigations on coated copper wire and annealed copper wire electrodes in wire EDM machining through a comparative assessment employing the TOPSIS technique" - Uddarraju Dhana Satya Prathap Varma, Ippile Harish, N Mallappaswararao Battina, Kantheti Prasadaraju, S Chandu Prasad, Engineering Research Express
- "Mechanical, water absorption, efflorescence, soundness and morphological analysis of hybrid brick composites" - Materia (Rio de Janeiro), 2024, Volume 29, N. 3
- "Modeling and Finite Element Analysis on knee joint prosthesis" - Global Journal of Engineering Science and Researches, presented at ICESTM-2018

## Conference Presentations
- "Enhancing data security in IoT Enabled cloud computing environments through lightweight cryptographic techniques" - International Conference on Smart and Sustainable Energy Systems, Vishnu Institute of Technology, Andhra Pradesh, February 16-17, 2024
- "IoT based remote access mechatronics lab platform for educational institutions with open API for A.R & ROS implementation" - International Conference on Contemporary Innovations in Engineering & Management in Data Sciences IoT and Computational Techniques, April 22-23, 2022
- "Modeling and Finite Element Analysis on Knee joint prosthesis" - International Conference on Engineering, Science & Technology and Management, Vikas College of Engineering and Technology, Vijayawada, 2018


## Identifiers & Contact
- Email: prathap9varma@svecw.edu.in
- SVECW ID: 336
- Google Scholar ID: 9aeAKaQAAAAJ
- ORCID ID: 0000-0003-3945-4803
- Vidwan ID: 149700
`;

const MECH_MANIKANTA_TEXT = `
## Education
- Ph.D. Andhra University, Visakhapatnam (2025)
- M.Tech Advanced Manufacturing Systems, BVC Engineering College, Odalarevu (2015)
- B.Tech Mechanical Engineering, BVC Engineering College, Odalarevu (2012)

## Experience
- Teaching Experience: 7 years

## Research Interests
- Vegetable-based cutting fluids, nanofluids, tribology, machining, optimization

## Courses Taught
- Engineering Mechanics, Elements of Mechanical Engineering, Material Science and Metallurgy, Mechanics of Solids, Design of Machine Members, Metrology, Advanced Materials, Manufacturing Technology, Engineering Graphics

## Administrative Roles
- Coordinator for NBA Criteria 1, NAAC Criteria 1, and Feedback Coordination

## FDPs/Workshops/Seminars/Training Programs Attended
- Five-day offline workshop on "Sustainable Machining for Tomorrow: Machine Learning Based Approach" - Madanapalle Institute of Technology & Science (11-16 December 2023)
- Five-day online workshop on "Smart Manufacturing & Industry 4.0" - IIT (BHU) Varanasi (11-15 October 2022)
- One-week online FDP on "Artificial intelligence/Machine Learning for Mechanical Engineering problems" - SVECW (21-26 March 2022)
- Seven-day hands-on training on "Integrative Research in various fields of Engineering" - SRKR in collaboration with Gitam (21-27 September 2022)
- One-week online workshop on "Advance in Mechanical Engineering for Bio Medical Applications" - NIT Karnataka (11-15 July 2022)
- One-week practical training on "Materials processing & Advanced material characterization techniques" - NIT Warangal (27 May - 2 June 2022)
- Two-week online FDP on "Recent advances in materials and challenges in Manufacturing techniques" - JNTU K (22 March - 3 April 2021)
- Two-week online FDP on "Frontier of 3D Printing Technology" - LBRCE (25 January - 6 February 2021)
- Five-day National Workshop on Mechanical and Tribological behavior of Advanced Composites - NIT Warangal (21-25 January 2019)
- ATAL one-week online FDP on "Global Warming and impacts of power electronics towards green technologies" - SRM (24-28 May 2021)
- One-week short-term training on "Automated Manufacturing Systems" - NITTR (1-5 July 2019)
- One-week AICTE-ISTE Sponsored Induction Program on "Research Methodology, Design and Analysis of Experiments" - RVR&JC College of Engineering (12-17 November 2018)
- One-week faculty Quality Improvement Training Program on "Instructional Design and Delivery Systems" - NITTR at BVC Engineering College (6-11 November 2017)
- One-week short-term training on "Effective Teaching" - NITTR (15-19 July 2019)
- Five-day faculty development program on "Recent Developments in Sustainable Developments" - A J E T College of Engineering, Karnataka (12-16 July 2021)
- One-week online short-term training on "Innovations and Challenges in Industry" - KHIT, Guntur (12-16 July 2021)
- One-week online FDP on "Modern Industrial Technology in Mechanical Engineering" - Aditya Engineering College (2-8 July 2021)
- One-week online program on "Recent Innovations Developments in Thermal Engineering" - National Institute of Foundry, Ranchi (25-29 September 2020)
- One-week short-term course on "Advanced and Futuristic Manufacturing process" - Malla Reddy Engineering College, Karnataka (28 June - 3 July 2021)
- One-week online FDP on "Emerging Technologies in Robotics" - Malla Reddy Engineering College (26-30 May 2020)
- One-week online FDP on "Strategic methods for Product Development" - SRKR Engineering College (22-26 February 2020)

## Patents Published
- Fixture For Square Guided Apparatus
- Guided Cutting Tool
- Height Adjustable Fixture Table

## Papers Published
- "Machining performance of SS 304 steel with hybrid nanocutting fluids using Taguchi-based gray relational analysis" - Journal of Mechanical Engineering and Sciences, Vol. 18(4), pp. 10290-10302 (2024)
- "Machine Learning and Artificial Intelligence Supported Machining: A Review and Insights for Future Research" - J. Inst. Eng. India Ser. C, Vol. 105, pp. 1653-1663 (2024)
- "Development and Characterization of Novel Green Cutting Fluids with Nano-additives" - Periodica Polytechnica Mechanical Engineering, Vol. 68(4), pp. 304-311 (2024)
- "Optimization of tribological behavior of Aluminium (A356) composites using TGRA technique" - Materia (Rio de Janeiro), Vol. 29(3), e20240129 (2024)
- "Application of sustainable techniques in grinding process for enhanced machinability: a review" - J Braz. Soc. Mech. Sci. Eng., Vol. 46, p. 199 (2024)
- "Performance Evaluation of Eco-friendly Cutting Fluid in Machining Process-An Approach towards Environmentally Friendly Production" - Journal of Polymer & Composites (2024)
- "Examination of electrochemical machining parameters for AA6082/ZrSiO4/SiC composite using Taguchi-ANN approach" - Int J Interact Des Manuf (2024)
- "Optimizing sustainable machining processes: a comparative study of multi-objective optimization techniques for minimum quantity lubrication with natural material derivatives in turning SS304" - International Journal on Interactive Design and Manufacturing (IJIDeM) (2024)
- "Optimization parameters for electro discharge machining on Nimonic 80A alloy using grey relational analysis" - International Journal on Interactive Design and Manufacturing (IJIDeM) (2023)
- "Machining performance on SS304 using nontoxic, biodegradable vegetable-based cutting fluids" - Chemical Data Collections, Vol. 42, 100961 (2022)
- "Experimental and finite element investigations on formability of friction stir welded tailor welded blanks of AA6061 and AA2017" - Materials Today: Proceedings (2023)
- "Hybrid polymer nano fillers on mechanical properties for current applications: An overview" - Materials Today: Proceedings (2023)
- "A review on mechanical properties of hybrid polymer composites" - Materials Today: Proceedings (2023)
- "An overview of mechanical properties of biodegradable polymers and natural fibre materials" - Materials Today: Proceedings (2023)
- "Biodegradable polymer reinforced natural fiber composition for mechanical properties: A review" - Materials Today: Proceedings (2023)
- "Performance Assessment of Nano Alumina Mixed Corn Oil in Stainless Steel Machining" - European Chemical Bulletin, Vol. 12(8), pp. 5723-5734 (2023)
- "Enhancing Sustainability in Machining: Performance Evaluation of Graphene-Based Green Cutting Fluids in Minimum Quantity Lubrication (MQL) Turning" - Journal of Propulsion Technology, Vol. 44(4), pp. 3432-3440 (2023)
- "Design of Solar Power Plant for One Megawatt Power with Central Cavity Receiver" - International Transaction Journal of Engineering, Management, & Applied Sciences & Technologies (February 2022)
- "Nanoparticle enriched cutting fluids in Metal cutting operations: A Review" - Recent advances in Mechanical Engineering, Lecture notes in Mechanical Engineering, Springer (2022)
- "Fabrication and Characterization of E-Glass/Chopped Strand Mat E450gsm/Sic Reinforced Polymer Composite" - Design Engineering (June 2021)
- "Mechanical and Microstructural behavior of Aluminium /TiB2 composites fabricated through multi pass friction stir processing" - Materials Today Proceedings (September 2020)
- "Conversion of waste plastic to fuel products" - Materials Today Proceedings (February 2020)
- "The performance of alumina mixed coconut oil in turning of SS304 alloy" - International Journal of Mechanical and Production Engineering Research and Development, Vol. 9, Issue 4 (August 2019)
- "Integrality Characterization of Machining with Nano cutting Fluids" - International Journal of Mechanical Engineering & Technology (IJMET), Vol. 9, Issue 10, pp. 1033-1042 (October 2018)
- "Experimental investigation and optimization of process parameters in CNC milling of Aluminum 6082 alloy" - International Journal of Research and Analytical Reviews (IJRAR), Vol. 6, Issue 1 (March 2019)
- "Fabrication and Characterization of rice husk ash aluminium composite" - International Journal of Emerging Technologies and Innovative Research (January 2019)
- "Self-textured cutting tools in dry machining" - International Journal of Research and Analytical Reviews (IJRAR), Vol. 5, Issue 4 (December 2018)
- "Analysis of Defects and Mechanical Properties of E-Glass/Chopped Stand mat Reinforced Polymer Composite" - International Journal of Emerging Technologies and Innovative Research (April 2019)
- "Building Information Modelling and Analysis for MEP Services" - International Journal of Research and Analytical Reviews (IJRAR), Vol. 5, Issue 3 (July 2018)
- "Effect of Nano Cutting Fluid & Process Parameters on Material Removal Rate and Surface Finish of SS304 Alloy on Turning Operation" - IJETER, Vol. 5, Issue 12 (December 2017)
- "Effects of hybrid nano cutting fluid and process parameters on material removal rate and surface finish in turning of ss304 alloy" - IJIEMR, Vol. 8, Issue 8 (September 2019)

## Conferences Attended
- National conference on "Design Thinking: Trans-Displinary Challenges & Opportunities" (7-8 July 2023) - Presentation on "Review paper on Minimum Quantity Lubrication"
- Conference on "Frontiers of Innovative Research in Smart materials for Tech. applications" (24-25 March 2023) - Presentation on "Review of sustainable lubrication in Metal Cutting Operations"
- National conference (ETME 2019) - NIT Warangal, sponsored by TEQIP-III - Presentation on "Effect of turning parameters on material removal rate and surface finish of fly ash reinforced aluminium composite"
- National conference (ETME 2019) - NIT Warangal, sponsored by TEQIP-III - Presentation on "Effect of Inlet air swirl generation on performance and emission characteristics of Diesel engine"
- International conference (ICERTT 2021) - Bulehora University, Ethiopia (14-15 May 2021) - Presentation on "Investigation of Mechanical and Machining characteristics of Coconut shell reinforced Aluminium composites"
- National conference (NCRTEBS 2020) - BVCEC, Odalarevu (16 July 2020) - Presentation on "Mechanical and Microstructural properties of AA 6061/ Baggase ash and rice husk ash composites fabricated by stir casting"
- International conference (ICETEM 2020) - Sri Vasavi Engineering College (19-20 February 2021) - Presentation on "Investigation of Mechanical and Microstructural characteristics of Bagasse ash reinforced aluminium composites"
- International conference (ICETEM 2020) - Sri Vasavi Engineering College, Tadepalligudem (19-20 February 2021) - Presentation on "Experimental Investigation on Mechanical properties of angle oriented natural & hybrid fiber reinforced epoxy composite"

## Reviewer for Journals
- Tribology International - Published by Elsevier (Indexed in SCI, SCOPUS)
- International Journal on Interactive Design and Manufacturing (IJIDeM) - Published by Springer (Indexed in ESCI, SCOPUS)
- Sustainable Manufacturing and Service Economics - Published by Elsevier (Indexed in SCI, SCOPUS)
- International Journal of Engineering and Technology Innovation (SCOPUS)
- International Conference on Recent Trends in Engineering and Technology - Reviewer in Vishwacon 2023


## Identifiers & Contact
- Email: manikantame@svecw.edu.in
- SVECW ID: 338
- Google Scholar: https://scholar.google.com/citations?user=TCA-5nYAAAAJ&hl=en
- Scopus ID: 57223316697
- ORCID: 0000-0002-0881-4899
- Vidwan ID: 316541
`;

const MECH_ASV_PRASAD_TEXT = `
## Education Qualifications
- Ph.D.: Pursuing from JNTUK, Kakinada
- M.Tech.: Thermal Engineering (Graduated 2017)
- B.Tech.: Mechanical Engineering (Graduated 2013)

## Professional Information
- Teaching Experience: 07 years
- Industry Experience: 06 months

## Areas of Specialization
- Alternate fuels, electric vehicles, heat transfer

## Subjects Taught
- Automobile Engineering, Heat Transfer, Power Plant Engineering, Thermal Engineering I & II, Design for Manufacturing, Fluid Mechanics & Hydraulic Machinery, Basic Mechanical Engineering

## Current Roles
- Coordinator for IIC, VEDIC, and MOODLE

## Professional Development Programs & Training
- ATAL FDP on Emerging Technologies in Optimizing Renewable Energy Systems with Smart Materials and Storage Solutions at University College of Engineering Kakinada (20/01/2025 to 25/01/2025)
- ATAL FDP on AI & ML Empowerment in Energy Storage and Advanced Robotics at Aditya Engineering College (09/12/2024 to 14/12/2024)
- One Week Online FDP on "Artificial intelligence and Machine learning for Mechanical Engineering Problems" at Shri Vishnu Engineering College for Women (21-03-2022 to 26-03-2022)
- Online course on "Python Fundamentals for Beginners" from Great Learning Academy (September 2022)
- Innovation Ambassador training - Foundation level by MOE's Innovation Cell & AICTE (13-08-2022)
- One-week Short Term Training Programme on "Thesis and Research Paper Writing" at NITTTR (06-12-2021 to 10-12-2021)
- One Week Faculty Development Programme on "Research Methodology: Design and Technology" by ATAL Academy at Banasthali Vidyapith (02-06-2021 to 06-06-2021)
- One Week Faculty Development Programme on "Energy Engineering" by ATAL Academy (17-09-2020 to 21-09-2020)
- Two Weeks Online FDP on "Python Programming" by APSSDC (24-08-2020 to 05-09-2020)
- Two Weeks Online Training Programme on "Product Design and Drafting by CATIA" by APSSDC (17-08-2020 to 29-08-2020)
- Two Day Faculty Development Programme on "Innovative Methods of Teaching in Mechanical Engineering" at Sri Vasavi Engineering College (4th & 5th June 2019)
- One Week Faculty Development Programme on "Computational Fluid Dynamics" at B V C Engineering College (29-10-2018 to 03-10-2018)
- One Week Training Programme on "INSTRUCTIONAL DESIGN AND DELIVERY SYSTEMS" at NITTTR (06-11-2017 to 11-11-2017)

## Professional Memberships
- SAE India member
- International Association of Engineers (IAENG) lifetime member
- Institute of Research Engineers and Doctors (IRED) associate member

## Publications
- "A Comprehensive Review of the Effect of Additives on Microalgae Biodiesel Performance and Emissions" by Adina Srinivasa Vara Prasad, K V Murali Krishnam Raju, Krishna Bhaskar K, and Tarun Kumar Kotteda - IOP Conference Series: Journal of Physics
- "Analysis of Wear Behavior of AA5052 Alloy Composite by Addition of Alumina with Zirconium dioxide Using Taguchi-grey Relational Method" - Advances in Material Science and Engineering, Volume 2022, Article ID 4545531


## Identifiers & Contact
- Email: asvprasadme@svecw.edu.in
- SVECW ID: 339
- AICTE Registration ID: 1-2287273213
- Google Scholar ID: RuOsp5QAAAAJ
- Scopus ID: 57650539800
- ORCID ID: 0000-0003-4210-9891
- Vidwan ID: 316860
`;

const MECH_SHAIK_MADHAR_PASHA_TEXT = `
## Educational Qualifications
- Ph.D.: Pursuing from JNTUK, Kakinada
- M.E.: CAD/CAM from SRKR Engineering College (2015)
- B.E.: Mechanical Engineering (2007)

## Experience
- Teaching: 10 years
- Industry: 3 years

## Specialization
- Design and Manufacturing

## Subjects Taught
- Engineering Drawing, Engineering Mechanics, Fluid Mechanics, Manufacturing Technology, Metrology, Engineering Workshop, Production Technology Lab, Metrology Lab, Fluid Mechanics and Hydraulic Machines Lab, C-Programming, Python Programming

## Key Roles
- Coordinator of Jnanabhumi, Department Website, Class Teacher, Magazine Data Provider, Newsletter Editor

## Professional Memberships
- AMIE (Associate Member, Institution of Engineers India)
- Oracle Academy Member

## Papers Published
- "Design and Analysis of Thick Walled Cylinders with Holes" - International Journal of Scientific Research and Review, Volume 07, Issue 03, March 2019, pp. 1166-1172
- "Design and Analysis of Brake Pads for Hydraulic Circuit" - International Journal of Scientific Research and Review, Volume 07, Issue 03, March 2019, pp. 1173-1178
- "Fabrication of Coconut Dehusking Machine" - International Journal Of Mechanical Engineering & Computer Applications, Vol. 4, No. 3, May-June 2016, pp. 229-242
- "Comparison of flow analysis of a sudden and gradual change of pipe diameter using fluent software" - IJRET: International Journal of Research in Engineering and Technology
- "An Experimental Study on A CI Engine Fuelled With Soapnut Oil-Diesel Blend with Different Piston Bowl Geometries" - International Journal of Engineering Research & Technology (IJERT) Vol. 2 Issue 12, December 2013

## Conferences Attended
- 3rd International Conference on New Frontiers of Engineering, Management, Social Science and Humanities (March 16, 2019) - Osmania University, Hyderabad - presented two papers on thick-walled cylinders and brake pad design

## Training & Development
- FDP on "Lean Manufacturing & 7QC Tools" - Roots Industries India Limited, Coimbatore (November 15-17, 2018)
- Five-Day FDP in "Engineering Drawing" - JNTUK, Kakinada
- Five-Day FDP on "Advanced Vibration Analysis" - JNTUK, Kakinada
- Three-Day Workshop on "Engineering Mechanics" - BVRIT, Hyderabad
- Five-Day Workshop on "Autodesk Inventor & Fusion360" - SVECW, Bhimavaram
- Five-Day Workshop on "Ansys Work bench" - SVECW, Bhimavaram
- Five-Day Workshop on "Non Destructive Testing" - SVECW, Bhimavaram
- One-Week Training on "Pedagogy" - B V Raju Institute Of Technology, Hyderabad
- Three-Day Training on "Scientific Educational Practices" - VEDIC, Hyderabad

## Certifications
- Certificate course in Microsoft SQL from Simplilearn


## Identifiers & Contact
- Email: Pasha@svecw.edu.in
- SVECW ID: 309
- Google Scholar ID: YeY5Ce8AAAAJ
- ORCID ID: 0000-0001-7962-231X
- Vidwan ID: 328085
`;

const MECH_G_MOUNICA_TEXT = `
## Education Qualification
- Postgraduate: M.Tech in CAD/CAM, SRKR Engineering College (2022)
- Undergraduate: B.Tech in Mechanical Engineering (2020)

## Professional Background
- Teaching Experience: 1 year

## Areas of Specialization
- Design and Manufacturing

## Courses Taught
- Engineering Drawing
- Engineering Workshop Lab
- CAM and 3D Printing Lab
- Part Modeling and Assembly Lab

## Professional Development
Faculty Development Programs:
- One-week ATAL program on "Design Thinking for Industry 4.0" (November 20-25, 2023)
- Four-week NPTEL program on "Inspection and Quality Control in Manufacturing" (January-February 2024)

## Certifications
- Inspection and Quality Control in Manufacturing (NPTEL)


## Identifiers & Contact
- Email: gmounikame@svecw.edu.in
- SVECW ID: 310
`;

const MECH_N_RAJA_SEKHAR_TEXT = `
## Education Qualification
- Ph.D.: Pursuing from Andhra University, Visakhapatnam
- P.G: Graduated 2014
- U.G (B. Tech): Graduated 2011

## Experience
- Teaching Experience: 7 years
- Industry Experience: 2 years

## Fields of Specialization / Areas of Interest
- Multi-pass Friction stir welding
- Metal additive manufacturing
- Surface enhancement for structural materials

## Subjects Handled
- Basics of Civil and Mechanical Engineering
- Engineering Mechanics
- Biology for Engineers
- Engineering Graphics
- Computer Aided Engineering Graphics
- Manufacturing Processes
- Fluid mechanics and Hydraulic Machines
- Metal cutting & Machine Tools
- Advanced materials
- Green Engineering Systems
- Non Destructive Testing of Evaluation
- Unconventional machining processes
- IC Engines & Gas Turbines
- Applied Thermodynamics

## Roles and Responsibilities
- Worked on Criteria 2 for Accreditation by the NBA
- Class teacher
- Lab in charge of Manufacturing Technology Lab
- Coordinator - Project Coordinator
- Department-level ATL Coordinator

## FDPs / Workshops / Seminars / Training Programs Attended
- Attended ATAL online FDP on "Smart materials" by NIT Meghalaya
- Attended ATAL online FDP on "Additive Manufacturing in Industry 4.0 Strategy" by NIT AP, Tadepalligudem
- Attended in AICTE sponsored Two-Week FDP on "Strategic Methods and Tools For Product Development" organized by Sagi Rama Krishna Raju Engineering College
- Attended a six-day FDP on "Recent Innovations in Design & Manufacturing" organized by Malla Reddy Engineering College
- Attended a one week FDP on Research Methodology & Design of Experiments at RVR&JC College of Engineering, Guntur
- Attended a two-day workshop on OBE (Outcome Based Education) at NRIIT (A)
- Attended a three-day FDP on Advances in Materials and Composites at ALIET
- Attended a four-day FDP on Instructional Design & Development Systems (IDDS) at NRIIT by NITTTR, Chennai
- Attended a one-week AICTE-approved FDP on TALE by NPTEL
- Attended a one-week AICTE-approved FDP on Fundamentals of Manufacturing Process by NPTEL

## Membership of Professional Bodies
- The International Association of Engineers (IAENG) - 177750, 2016

## Certifications
- Certificate course in Computer Aided Engineering (CAE) from Central Institute of Tool Design (CITD), Hyderabad
- NPTEL certification course on TALE with Elite certificate
- NPTEL certification course on Fundamentals of Manufacturing Process with Elite certificate
- NPTEL certification course on Fundamentals of Metal Additive Manufacturing with Elite certificate


## Identifiers & Contact
- Email: nrajasekharme@svecw.edu.in
- SVECW ID: 340
- Google Scholar: https://scholar.google.com/citations?view_op=new_articles&hl=en&imq=Rajasekhar+Nukathoti&authuser=5
- Scopus: https://www.scopus.com/authid/detail.uri?authorId=58203969700
- ORCID: https://orcid.org/0009-0004-2096-711X
`;

const MECH_MADDIPATI_RAJESH_TEXT = `
## Education Qualifications
- Ph.D: Pursuing from Andhra University, Visakhapatnam
- M.E (Design for Manufacturing): Osmania University, Hyderabad (2019)
- B.Tech: SITE, Tadepalligudem (2016)

## Professional Experience
- Teaching Experience: 2 years 11 months
- Industry Experience: 1 year

## Areas of Specialization
- Additive Manufacturing, Manufacturing Technology, Material Science

## Courses Taught
- Basic and Manufacturing Engineering, Engineering Graphics, Design for Manufacturing, Engineering Mechanics, Material Science, Fluid Mechanics

## Administrative Roles
- Department Coordinator for VEDIC, IIC Department Coordinator, NAAC Criteria 6 coordinator

## Professional Memberships
- IAENG-272272, IFERP

## Publications
- Peer-reviewed article in International Journal on Interactive Design and Manufacturing (2023) on EDM optimization
- Book chapter in Springer's Lecture Notes in Mechanical Engineering (2022) on cutting fluids

## Certifications
- PG-Diploma in Mechanical CAD, AutoCAD


## Identifiers & Contact
- Email: mrajeshme@svecw.edu.in
- SVECW ID: 341
- Google Scholar ID: p7TPQZMAAAAJ
- Scopus ID: 58714379000
`;

const MECH_K_BENARJI_TEXT = `
## Education
- Ph.D. from NIT Warangal (2021)
- M.Tech from NIT Rourkela (2015)
- B.Tech from Avanthi Institute of Engineering and Technology (2011)

## Experience
- Teaching: 6 years
- Research: 4 years
- Industry: 1 year

## Specialization Areas
- Manufacturing-metal cutting, additive manufacturing, surface modification, material characterization, machine learning

## Teaching Subjects
- Materials & Manufacturing, Mechanics of Solids, Fluid Mechanics, Engineering Mechanics, Engineering Drawing, Java Programming, Metrology, Operations Research, 3D Printing

## Peer-Reviewed Journal Articles
- "Comparative evaluation of machinability characteristics of Nimonic C-263 using CVD and PVD coated tools" - B. Koyilada, S. Gangopadhyay, A. Thakur, Measurement, 2016, 85, 152-163 (SCI, IF: 5.6)
- "Parametric Investigation and Characterization on SS316 built by Laser assisted Directed Energy Deposition" - K. Benarji, Y. Ravi Kumar, C. P. Paul, A. N. Jinoop, K. S. Bindra, Proceedings of the Institution of Mechanical Engineers, Part L, 2019, 234(3), 452-466 (SCI, IF: 2.311)
- "Effect of Heat-Treatment on the Microstructure, Mechanical Properties and Corrosion Behaviour of SS 316 Structures Built by Laser melting deposition Based Additive Manufacturing" - K. Benarji, Y. Ravi Kumar, A. N. Jinoop, C. P. Paul, K. S. Bindra, Metals and Materials International, 2020, 27, 488-499 (SCI, IF: 3.6)
- "Effect of WC composition on the Microstructure and Surface Properties of Laser Directed Energy Deposited SS 316-WC Composites" - K. Benarji, Y. Ravi Kumar, A. N. Jinoop, C. P. Paul, K. S. Bindra, Journal of Materials Engineering and Performance, 2021, 30, 6732-6742 (SCI, IF: 1.883)
- "Understanding the Influence of Tool Coating and Cutting Environment on the Machinability of Nimonic C-263" - K. Benarji, S. Gangopadhyay, A. N. Jinoop, International Journal on Interactive Design and Manufacturing, 2023 (SCI, IF: 2.3)

## Conference Proceedings
- "Numerical Simulation and Experimental Study on SS316 by Laser Assisted Direct Metal Deposition (L-DMD)" - K. Benarji, Y. Ravi Kumar, P. Ashwin, Materials Today: Proceedings, 2021, 39, 1497-1502 (Scopus)
- "Single Track Analysis of Additive Manufactured SS 316L Based Composites Using Powder Bed Fusion" - K. Benarji, Y. Ravi Kumar, A. N. Jinoop, C. P. Paul, Materials Today: Proceedings, 2023 (Scopus)

## Additional Conference Presentations
- "The microstructure evaluation and mechanical properties of aluminum metal matrix composite (AA2024+10% B4C)" - K. Benarji, Y. Ravi Kumar, International Conference on Advanced Functional Materials and Devices (ICAFMD), NIT Warangal, February 26-28, 2019
- "Study on chip characteristics and tool wear of NIMONIC C-263" - K. Benarji, S. Gangopadhyay, A. Thakur, International Conference on Applied Engineering and Technology, April 13, 2015, Madurai Institute of Engineering and Technology
- "Design and fabrication of strut stabilizer" - Sunil Gudala, Bheesetti Dinesh Kumar, Gedala Harith, Katila Yuvaraju Reddy, K. Benarji, 2nd Indian International Conference on Industrial Engineering and Operations Management, July 20, 2022, NIT Warangal


## Identifiers & Contact
- Email: drkbenarjime@svecw.edu.in
- SVECW ID: 345
- Google Scholar: https://scholar.google.com/citations?user=bcVlcW4AAAAJ&hl=en
- ORCID: https://orcid.org/my-orcid?orcid=0000-0002-5667-3461
`;

const MECH_ASNIT_GANGWAR_TEXT = `
## Education Qualification
- Ph.D.: Department of Metallurgical Engineering, IIT(BHU) Varanasi, Uttar Pradesh (2020)
- M.Tech.: Department of Metallurgical Engineering, IIT(BHU) Varanasi, Uttar Pradesh (2014)
- B.Tech.: Mechanical Engineering from ITS Engineering College, Greater Noida, U.P. (2012)

## Experience
- Teaching Experience: 2 years
- Research Experience: 4 years

## Fields of Specialization / Areas of Interest
- Materials science
- Magnetic materials
- Nanocomposites
- Biomaterials
- Battery & supercapacitors electrodes materials

## Subjects Handled
- Engineering Mechanics
- Fluid Mechanics
- Manufacturing Technology (Welding, Casting, Metal Cutting and Machining)
- Metrology
- Engineering Workshop
- Production Technology Lab
- Thermodynamics
- Power Plant Engineering
- Strength of materials

## Roles and Responsibilities
- Research Design
- Data Collection and Analysis
- Documentation and Reporting
- National and international Collaboration
- Professional Development
- Reviewer of many materials and inorganic chemistry journals

## FDPs / Workshops / Seminars / Training Programs Attended
- Summer internship workshop on "Functional magnetic materials for biomedical applications" at Thapar Institute of Engineering and Technology, Patiala, Punjab (4-8 August 2016)

## Membership of Professional Bodies
- International society for materials chemistry (ISMC): Life time member (LM-1410)

## Papers Published
- Ankur Sharma, Asnit Gangwar, Santhosh K. Alla, "Nanofillers in electronics industries," Handbook of nanofillers, Springer Nature, 2024, 1-17
- Asnit Gangwar, K. C. Barick, P. A. Hassan, "Fundamentals aspects of nanomagnetism and its versatile applications," Handbook of Materials Science, Springer Nature, 2024, 269-291
- A. Gangwar, K. C. Barick, P. A. Hassan, "Growth of dendritic CuS nanostructures for Photoacoustic image guided chemo-photothermal therapy," J Photochem Photobiol A Chem., 459, 116084 (I.F. = 4.1)
- S. Pradhan, N. S. Anuraag, S. K. Shaw, A. Gangwar, K. Sandeep Rao, A. Sharma, B. P. Mandal and N. K. Prasad, "MnNCN@C nanocomposite as an anode for Li-ion battery," Materials Sci. Engg. B, 298, 116894 (2023) (I.F = 3.7)
- S. K. Shaw, Puja Kumari, A. Sharma, Neha Jatav, A. Gangwar, N. S. Anuraag, P. Rajput, S. Kavita, Sher Singh Meena, M. Vasundhara, Indrajit Sinha, N. K. Prasad, "Assessment of ionic site distributions in magnetic high entropy oxide of (Mn0.2Fe0.2Co0.2Ni0.2Zr0.2)3O4 and its catalytic behavior," Physica B: Condensed Matter, 652, 414653, (2023) (I.F. = 2.98)
- M. Suthar, D. Khare, A. Gangwar, S. Banerjee, N.K. Prasad, A.K. Dubey, P. Roy, "Structural, magnetic, and biocompatibility evaluations of chromium substituted barium hexaferrite (Co2-Y) for hyperthermia application," Mater. Chem. Phys., 127348, (2023) (I.F= 4.8)
- A. Gangwar, S. K. Shaw, A. Sharma, S. Kavita, V. Mutta, J. Gupta, K. C. Barick, P. A. Hassan, and N. K. Prasad, "Ferrimagnetic (a-Mn3O4/MnO)@rGO nanocomposite as a potential adsorbent for organic pollutant dye," Appl. Surf Sci., 612, 155778 (2022) (I.F = 7.4)
- S. K. Alla, Pradeep V, A. Sharma, V. Muuta, A. Gangwar, S. K. Shaw, N. K. Prasad, "Synthesis and Characterization of FexCo3-xO4 Nanoparticles for Sensor Applications," Inorg. Chem. Commun. 142, 109698, (2022) (I.F = 3.43)
- V. Kumar, V. S. Rai, M. K. Verma, S. Pandey, S. Singh, D. Prajapati, C. L. Prajapat, A. Gangwar, K. Mandal, "Observation of Microstructural and Magnetic properties of CaCu3Ti4-xMnxO12 (x = 0.0 and 0.1) ceramic synthesized through Semi-wet route," J. Aust. Ceram. Soc. (2022) (I.F = 1.9)
- A. Gangwar, T. Das, S. K. Shaw, N. K. Prasad, "Nanocomposite (a-Mn3O4/MnO)@rGO as an excellent energy storage supercapacitors electrode material," Electrochem acta, 390, 138823 (2021) (I.F = 7.34)
- S. K. Shaw, A. Gangwar, A. Sharma, S. K. Alla, S. Kavita, V. Mutta, S. S. Meena, P. Maiti, N.K. Prasad, "Structural and magnetic properties of nanocrystalline equi-atomic spinel high-entropy oxide (AlCoFeMnNi)3O4 synthesized by microwave assisted co-precipitation technique," J. Alloys Compd. 878:160269: (2021) (I.F = 6.4)
- S. K. Shaw, J. Kailashiya, A. Gangwar, S. Alla, S. Gupta, C.L. Prajapat, S.S. Meena, D. Dash, P. Maiti, N. K. Prasad, "y-Fe2O3 Nanoflowers as exceptional Magnetic Hyperthermia and Photothermal agent," Appl. Surf Sci., 560, 150025 (2021) (I.F = 7.4)
- Asnit Gangwar, S. K. Alla, N. K. Prasad, "RF induction heating and in-vitro efficacy of citrate capped ZrxFe3-xO4 nanoparticles for bioapplications," Physica B Condens. Matter. 611, 412970-412977 (2021) (I.F = 2.98)
- A. Gangwar, A. Singh, S. Pal, I. Sinha, S. S. Meena, N. K. Prasad, "Magnetic nanocomposites of Fe3C or Ni-substituted (Fe3C/Fe3O4) with carbon for degradation of methylene orange and p-nitrophenol," J. clean. Prod. 309, 127372 (2021) (I.F = 11.1)
- S. K. Alla, A. Gangwar, S. K. Shaw, M. K. Viswanadh, S. S. Meena, P. Kollu, R. K. Mandal, N. K. Prasad, "Physical and in-vitro evaluation of pure and substituted MxCe1-xO2 (M = Co, Fe or Ti and x = 0.05) magnetic nanoparticles," Ceramic Int. 47, 8812-8819 (2020) (I.F = 5.53)
- A. Gangwar, A. Sharma, S. K. Shaw, S. S. Meena, N. K. Prasad, "Structural and Electrochemical studies of nanocomposites of Fe3C or Mn-Substituted (Fe3C/Fe3O4) with carbon as anode for Li-batteries," Appl. Surf Sci. 533 147474 (2020) (I.F = 7.4)
- V. Kumar, S. Pandey, A. Kumar, M. K. Verma, S. Singh, V. S. Rai, D. Prajapati, T. Das, A. Sharma, C. L. Prajapat, A. Gangwar, K. D. Mandal, "Investigation of dielectric, magnetic and impedance spectroscopic properties of CaCu3-xMnxTi4-xMnxO12 (x =0.10) nano-ceramic synthesized through semi-wet route," J. Mater. Res. Technol 9, 12936-12945 (2020) (I.F = 6.3)
- Asnit Gangwar, S. S. Varghese, A. sharma, S. S. Meena, C. L. Prajapat, M. K.Viswanadh, K. Neogi, M. S. Muthu and N. K. Prasad, "Physical and in-vitro evaluation of e-Fe3N@Fe3O4 nanoparticles for bioapplications," Ceramic Int. 46, 10952-10962 (2020) (I.F= 5.53)
- Darson, Jaison, Asnit Gangwar, N. K. Prasad, G. Chandrasekaran, and M. Mothilal, "Effect of Gd3+ substitution on proton relaxation and magnetic hyperthermia efficiency of cobalt ferrite nanoparticle," Mat. R. Exp. 7 064009 (2020) (I.F = 2.02)
- A. Gangwar, S. Kumar, S. S. Meena, A. Sharma M. K. Neogi, M. S. Muthu, N. K. Prasad, "Structural and in-vitro assessment of ZnxFe3-xC (0 <= x <= 1) nanoparticles as magnetic biomaterials," Appl Surf Sci, 509, 144891 (2020) (I.F = 7.4)
- Asnit Gangwar, S. S. Varghese, M. K. Viswanadh, K. Neogi, M. S. Muthu, S. S. Meena, N. K. Prasad, "Physical and in-vitro evaluation of iron carbide (Fe3C) nanoparticles for bioapplications," J. Mater. Sci.: Mater. Electron, 31, 10772-10782 (2020) (I.F = 2.6)
- K. Y. Salkar, R. B Tangsali, R. S. Gad, Asnit Gangwar, N. K. Prasad, "Electrical Properties of Zn(1-x)CoxO Dilute Magnetic Semiconductor Nanoparticles," J. Mater. Sci.: Mater. Electron 30, 18374-18383 (2019) (I.F = 2.6)
- Pinki Singh, P. Bharti, Asnit Gangwar, N. K. Prasad, C. Upadhyay, "Janus shaped plasmonic magnetic silver magnetite nanostructures for multimodal Applications," JPN J APPL PHYS, 5 105001 (2019) (I.F = 2.5)
- V. Ramya, A. Gangwar, S. K. Shaw, N. K. Mukhopadhyay, N. K. Prasad, "Fe/Fe3O4 Nanocomposite powders with giant magnetization values by high energy ball milling," Bull. Mater. Sci. 42:43, 1809-1816 (2019) (I.F = 2.7)
- S. K. Shaw, A. Biswas, Asnit Gangwar, P. Maiti, S. S. Meena, C. L. Prajapat, N. K. Prasad, "Synthesis of exchange coupled nanoflowers for efficient magnetic hyperthermia," J. Magn. Magn. Mater. 484, 437-444 (2019) (I.F = 3.1)
- A. Gangwar, Saby Varghese, S. S. Meena, C. L. Prajapat, Nidhi Gupta, N. K. Prasad, "Fe3C nanoparticles for magnetic hyperthermia application," J. Magn. Magn. Mater. 481, 251-256 (2019) (I.F = 3.1)
- A. Gangwar, G. Singh, S. K. Shaw, R. K. Mandal, S. S. Meena, A. Sharma, C. L. Prajapat N. K. Prasad, "Synthesis and structural characterization of CoxFe3-xC (0 <= x <= 0.3) magnetic nanoparticles for biomedical applications," New J. Chem. 43, 3536-3544 (2019) (I.F = 3.93)
- M. M. Kothawale, R. B. Tangsali, S. S. Meena, N. K. Prasad, Asnit Gangwar, "Mossbaur study and Curie temperature configuration on sintering nano Ni-Zn ferrite powder," J supercond Nov Magn. 018, 4935-4941 (2018) (I.F = 1.5)
- A. Gangwar, S.K. Alla, M. Srivastava, S.S. Meena, E. V. Prasadarao, R. K. Mandal, S.M. Yusuf, N. K. Prasad, "Structural and magnetic characterization of Zr-Substituted magnetite (ZrxFe3-xO4, 0 <= x <= 1)," J. Magn. Magn. Mater. 401, 559-566 (2016) (I.F = 3.1)

## Conferences Attended
- A. Gangwar, Jagriti Gupta, K. C. Barick, International society for the materials chemistry, Department of Atomic Energy (DAE), Bhabha Atomic Research Center (BARC) Mumbai, 7-10/12/2022
- A. Gangwar, S. K. Alla, N. K. Prasad, International Online Conference on Emerging Materials for Technological Applications (ICEMTA-2022), Vignan's Institute of Information Technology (A), Visakhapatnam
- A. Gangwar, S. Kumar, S. S. Meena, A. Sharma M. K. Neogi, M. S. Muthu, N. K. Prasad, International Conference of magnetism and magnetic materials, Las Vegas, Nevada, U.S.A., 4-8/11/2019
- A. Gangwar, G. singh, S. K. Shaw, R. K. Mandal, A. Sharma, S. S. Meena, C. L. Prajapat, N. K. Prasad, International conference on functional nanomaterials, Department of Physics IIT(BHU), Varanasi, 22-25/02/2019
- Asnit Gangwar, S. S. Varghese, M. K. Viswanadh, K. Neogi, M. S. Muthu, Sher Singh Meena, N. K. Prasad, International conference on magnetic materials, NISER Bhubaneswar, Odisha, 12-14/11/2018
- Asnit Gangwar, R. Jha, N. K. Prasad, International conference on Advances in Biological System and Materials Science in Nanoworld, Department of Physics IIT(BHU), Varanasi, 19-23/02/2017
- A. Gangwar, National conference on Iron and Steel Technologies-Research and Application (ISTRA-2012), Department of Metallurgical Engineering IIT(BHU), Varanasi, 14-15/02/2012

## Certifications
- Data Analysis Software Certification: Versa studio, ImageJ, GATAN, eRing, Fullprof, Graphpadprism5, etc.


## Identifiers & Contact
- Email: asnitgme@svecw.edu.in
- SVECW ID: 343
- Google Scholar Id: a4u-v8AAAAJ
- Scopus Id: 56926467100
- ORCID Id: 0000-0001-5154-6140
- Vidwan ID: 511932
`;

const MECH_K_HARI_KRISHNA_TEXT = `
## Education Qualifications
- Ph.D. National Institute of Technology, Warangal (2024)
- P.G. (Manufacturing Engineering) National Institute of Technology, Warangal (2019)
- B.Tech BV Raju Institute of Technology, Narsapur (2016)

## Specialization Areas
- Metal Forming
- Powder Metallurgy
- Machine Learning
- Corrosion Science

## Workshops & Training Programs Attended
- "Recent Advances in Metal Forming: Microstructure, Modelling and Materials for Future Automotive Applications" (NIT Warangal, March 25-31, 2024)
- "Advanced Composite Materials" (NIT Warangal, February 26 - March 1, 2024)
- "High-End Research Training Programme on Current Trends and Future Aspects on Microwave Processing of Metallic Materials" (NIT Warangal, March 18-24, 2024)
- "High-End Workshop on Artificial Intelligence for Robots" (IIITDM Kurnool, March 11-17, 2024)

## Research Publications
As Primary Author:
- "Evaluation of Machine Learning Models for Predicting the Hot Deformation Flow Stress of Sintered Al-Zn-Mg Alloy" (SCI/Scopus indexed)
- "Evaluation of constitutive equations for modeling and characterization of microstructure during hot deformation of sintered Al-Zn-Mg alloy" - Journal of Materials Research and Technology 28, 1523-1537 (2024)
- "Characteristics of Work Hardening and Constitutive Models Comparisons of Powder Metallurgy Al-5.6%Zn-2%Mg Alloy During Hot Compression" - Journal of Central South University (2023/2024)
- "Overcoming Optical Image Challenges in Automatic Grain Size Measurement Using a Novel Computer Vision Algorithm Applied to Hot Deformation of Al-Zn-Mg Powder Metallurgy Alloy" - Materials Letters 357, 135743 (2023)
- "Unravelling the Hot working Behavior, Constitutive Modeling, and Processing Map for controlling the microstructure of sintered Al-Zn-Mg alloy" - Arabian Journal for Science and Engineering (2023)
- "New Method for Microstructure Segmentation and Automatic Grain Size Determination Using Computer Vision Technology during the Hot Deformation of an Al-Zn-Mg Powder Metallurgy Alloy" - Journal of Materials Engineering and Performance (2023)
- "Role of pre-strain on the corrosion behaviour of Al-Zn-Mg P/M alloy" - Proceedings of the Institution of Mechanical Engineers, Part L 237, 218-233 (2023)
- "Investigating the effects of deformation-induced densification on the constitutive behavior and corrosion resistance of Al-Zn-Mg powder metallurgy alloy during hot deformation" - Proceedings of the Institution of Mechanical Engineers, Part L (2023)
- "Influence of incremental pre-strain on corrosion behavior of Al-Zn-Mg powder metallurgy alloy during hot forging" - Proceedings of the Institution of Mechanical Engineers, Part C 237, 2990-3008 (2022)
- "The effect of plastic strain and temperature on the corrosion resistance of the Al-5.6Zn-2Mg powder metallurgy alloy during hot upsetting" - Engineering Research Express 5, 045009 (2023)
- "Decision-Making System for Accepting/Rejecting an Order in MTO Environment" - Advances in Simulation, Product Design and Development (Book chapter, Scopus indexed)

As Co-Author:
- "Corrosion Behavior Analysis and Characterization of AA7178 Matrix Alloy Reinforced with Nano TiO2 Particles" (Nikhil Bharat et al.) - Surface Topography: Metrology and Properties (2024)
- "Optimization of wire-electric discharge machining process and metallurgical characteristics of Ti-16Al-14Nb (a/ss, ML-grade) alloy" (K. Veera Venkata Nagaraju et al.) - Journal of Materials Engineering and Performance (2023)
- "Machinability and pulse characteristics of Ti-16Al-14Nb (a/ss) alloy in wire-electric discharge machining process: A surface integrity study" (K. Veera Venkata Nagaraju et al.) - Proceedings of the Institution of Mechanical Engineers, Part E (2024)
- "Influence of Interlayer Material on Softening and Wear Behavior of Friction Stir Welded AA6061-T6 alloy" (Korra Nagu et al.) - Transactions of the Indian Institute of Metals (2023)

## Conferences Attended
- International Conference on Additive Manufacturing (ICAM 2024) - NIT Warangal, March 4-6, 2024
- All India Manufacturing Technology, Design, and Research Conference (AIMTDR-2023) - IIT (BHU) Varanasi, December 8-10, 2023
- International Conference on Recent Advances in Materials and Manufacturing Technologies (IMMT-2023) - BITS Pilani Dubai, November 20-23, 2023
- All India Manufacturing Technology, Design, and Research Conference (AIMTDR-2019) - Anna University Chennai, December 13-15, 2019
- International Conference on Materials and Manufacturing Methods (MMM-2019) - NIT Trichy, July 13-15, 2019

## Journal Peer Review Activities
- The Journal of The Minerals, Metals & Materials Society (JOM) - 2 reviews
- Journal of Materials Engineering and Performance - 1 review
- Materials Characterization - 1 review
- Advanced Engineering Materials - 1 review
- Cogent Engineering - 1 review


## Identifiers & Contact
- Email: kharikrishname@svecw.edu.in
- SVECW ID: 344
- Google Scholar: https://scholar.google.com/citations?user=7zKJ6T4AAAAJ&hl=en&authuser=6
- Scopus ID: 57225802998
- ORCID: 0000-0002-4624-396X
- Personal website: https://sites.google.com/student.nitw.ac.in/katteharikrishna?usp=sharing
`;

const MECH_P_PHANI_KUMAR_TEXT = `
## Education Qualification
- Postgraduate: M.Tech. in CAD/CAM, VR Sidhartha Engineering College, Graduated 2011
- Undergraduate: B.Tech in Mechanical Engineering, VEC, Graduated 2009

## Experience
- Teaching Experience: 11 Years

## Areas of Specialization
- Design & Analysis

## Subjects Taught
- Engineering Mechanics
- Kinematics of Machinery
- Dynamics of Machinery
- CAD/CAM
- Machine Drawing
- Production Technology
- MC & MT
- BC & ME
- CAEDP
- Engineering Workshop
- Production Technology Lab

## Professional Development
- "5 Day Workshop on 'Autodesk Inventor and Fusion 360'" (09-13 December 2015) at SVECW under TEQIP-II
- "One Day Workshop on 'Improving the presentation Skills in Teaching'" (17-09-2016) at JNTUK
- One-week program on "Advances in Manufacturing of Composite (AMC-2017)" (27 November - 2 December 2017) at Sasi Institute of Technology and Engineering, Tadepalligudem
- One-week "Pedagogy" program (13-11-17 to 17-11-17) at Sasi Institute of Technology and Engineering under NITTTR
- "5 days faculty development Program on 'Recent advancements in Thermal Energy Systems (Rates-2k19)'" (11-15 November 2019) at Sasi Institute of Technology and Engineering, Tadepalligudem
- "One Week Online FDP on 'Research Opportunities and Challenges in Manufacturing Sector'" (01-06 June 2021) at SVERI's College of Engineering, Pandharpur, Maharashtra
- "5Days Online FDP on 'Emerging Trends in Mechanical Engineering'" (02-06 June 2021) at St. Peter's Engineering College, Hyderabad

## Professional Membership
- IE (I) The Institution of Engineers (India)


## Identifiers & Contact
- Email: pphanikumarme@svecw.edu.in
- SVECW ID: 342
`;

const FACULTY_CONTENT_OVERRIDES: Record<string, FacultySection[]> = {
  'dr. t. sree rama murthy::mathematics': textToSections(MATH_HOD_SECTIONS_TEXT),
  'dr. r.vasu babu::mathematics': textToSections(MATH_VASU_BABU_TEXT),
  'dr. p. l r kameswari::mathematics': textToSections(MATH_KAMESWARI_TEXT),
  'mrs. a. vijaya prashanthi::mathematics': textToSections(MATH_VIJAYA_PRASHANTHI_TEXT),
  'mrs. ch.g.bhavani::mathematics': textToSections(MATH_GANGA_BHAVANI_TEXT),
  'dr. joel mathews::mathematics': textToSections(MATH_JOEL_MATHEWS_TEXT),
  'mrs.p.prathiba::mathematics': textToSections(MATH_PRATHIBHA_TEXT),
  'ms.a.aparna::mathematics': textToSections(MATH_APARNA_TEXT),
  'mr. s.murali krishnam reju::mathematics': textToSections(MATH_SAGIRAJU_TEXT),
  'mr. m. chinna appanna::mathematics': textToSections(MATH_MADASU_APPANNA_TEXT),
  'mr. n. b. nv.durgarao::mathematics': textToSections(MATH_DURGA_RAO_NBNV_TEXT),
  'mr.k v n ravi::mathematics': textToSections(MATH_KVN_RAVI_TEXT),
  'mr.s. venkata durgarao::mathematics': textToSections(MATH_S_VENKATA_DURGA_RAO_TEXT),
  'mrs. p. anuradha::mathematics': textToSections(MATH_P_ANURADHA_TEXT),
  'ms. v. lahari::mathematics': textToSections(MATH_V_LAHARI_TEXT),
  'dr. j. v. srinivasu::physics': textToSections(PHYSICS_HOD_TEXT),
  'dr. p. s. brahmanandam::physics': textToSections(PHYSICS_BRAHMANANDAM_TEXT),
  'mr. j.v .krishna kumar::physics': textToSections(PHYSICS_KRISHNA_KUMAR_TEXT),
  'dr. b. v. naveen kumar::physics': textToSections(PHYSICS_NAVEEN_KUMAR_TEXT),
  'mr. t. karthik sai ram::physics': textToSections(PHYSICS_KARTHIK_SAIRAM_TEXT),
  'mr. m. krishna rao::physics': textToSections(PHYSICS_MADUGULA_TEXT),
  'dr. n.remu::physics': textToSections(PHYSICS_N_RAMU_TEXT),
  'dr. hari babu sata::physics': textToSections(PHYSICS_HARI_BABU_TEXT),
  'jagadeesh kadali::chemistry': textToSections(CHEM_HOD_TEXT),
  'dr. k. ganesh kadiyala::chemistry': textToSections(CHEM_GANESH_KADIYALA_TEXT),
  'mr. d. b. n. suresh varma::chemistry': textToSections(CHEM_SURESH_VARMA_TEXT),
  'mrs. k. kiranmai devi::chemistry': textToSections(CHEM_KIRANMAI_DEVI_TEXT),
  'mrs. b. kanaka durga::chemistry': textToSections(CHEM_KANAKA_DURGA_TEXT),
  'mr v murali krishna madasu::chemistry': textToSections(CHEM_MURALI_KRISHNA_MADASU_TEXT),
  'dr. y. l. n. kishore mallela::chemistry': textToSections(CHEM_KISHORE_MALLELA_TEXT),
  'dr. madhuri verma::chemistry': textToSections(CHEM_MADHURI_VERMA_TEXT),
  'dr. p. sreehari raju::english': textToSections(ENGLISH_HOD_TEXT),
  'mrs. p. prasanthi::english': textToSections(ENGLISH_PRASANTHI_TEXT),
  'mr. a. s. kishore varma::english': textToSections(ENGLISH_KISHORE_VARMA_TEXT),
  'dr. g. j. v prasad::english': textToSections(ENGLISH_PRASAD_TEXT),
  'mrs. s. devaki devi::english': textToSections(ENGLISH_DEVAKI_DEVI_TEXT),
  'mr. rajesh battu::english': textToSections(ENGLISH_RAJESH_BATTU_TEXT),
  'mr. p. arun kumar::english': textToSections(ENGLISH_ARUN_KUMAR_TEXT),
  'mr. m. a. khan::english': textToSections(ENGLISH_MA_KHAN_TEXT),
  'dr. g.sunitha::english': textToSections(ENGLISH_SUNITHA_TEXT),
  'mrs. d. pushpa::english': textToSections(ENGLISH_PUSHPA_TEXT),
  'mr. md siddiq::english': textToSections(ENGLISH_MD_SIDDIQ_TEXT),
  'dr. m. sarada devi::english': textToSections(ENGLISH_SARADA_DEVI_TEXT),
  'mrs. k. vasumathy srinivas::english': textToSections(ENGLISH_VASUMATHY_SRINIVAS_TEXT),
  'ms. devika babu::english': textToSections(ENGLISH_DEVIKA_BABU_TEXT),
  'dr. pokkuluri kiran sree::cse': textToSections(CSE_HOD_TEXT),
  'dr. v. purushothama raju::cse': textToSections(CSE_PURUSHOTHAMA_RAJU_TEXT),
  'dr. v v r maheswara rao::cse': textToSections(CSE_MAHESWARA_RAO_TEXT),
  'dr. ramachandra rao kurada::cse': textToSections(CSE_KURADA_TEXT),
  'mr. y. ramu::cse': textToSections(CSE_Y_RAMU_TEXT),
  'mr. p.j.r. shalem raju::cse': textToSections(CSE_SHALEM_RAJU_TEXT),
  'dr. m. prasad::cse': textToSections(CSE_M_PRASAD_TEXT),
  'dr. p. srikanth::cse': textToSections(CSE_SRIKANTH_TEXT),
  'dr raja rao pbv::cse': textToSections(CSE_RAJA_RAO_TEXT),
  'dr. veeraraghavan jagannathan::cse': textToSections(CSE_VEERARAGHAVAN_TEXT),
  'mr. sunil pattem::cse': textToSections(CSE_SUNIL_PATTEM_TEXT),
  'dr. m. narasimha raju::cse': textToSections(CSE_NARASIMHA_RAJU_TEXT),
  'dr. g.v.s.s. prasad raju::cse': textToSections(CSE_GVSS_PRASAD_RAJU_TEXT),
  'mr. p. raju::cse': textToSections(CSE_P_RAJU_TEXT),
  'dr. anuj rapaka::cse': textToSections(CSE_ANUJ_RAPAKA_TEXT),
  'dr. veera v rama rao m::cse': textToSections(CSE_VEERA_RAMA_RAO_TEXT),
  'mr. ramesh babu mallela::cse': textToSections(CSE_RAMESH_BABU_MALLELA_TEXT),
  'dr. n. silpa::cse': textToSections(CSE_N_SILPA_TEXT),
  'mrs. k. ratna kumari::cse': textToSections(CSE_RATNA_KUMARI_TEXT),
  'ms. r.v. swathi::cse': textToSections(CSE_RV_SWATHI_TEXT),
  'mrs. n. durga::cse': textToSections(CSE_N_DURGA_TEXT),
  'ms. m. asma::cse': textToSections(CSE_M_ASMA_TEXT),
  'mr. k.sathish kumar::cse': textToSections(CSE_K_SATHISH_KUMAR_TEXT),
  'ms. t. neelima::cse': textToSections(CSE_T_NEELIMA_TEXT),
  'ms. k. jaya sri::cse': textToSections(CSE_K_JAYA_SRI_TEXT),
  'mr. nagaraju pamarthi::cse': textToSections(CSE_NAGARAJU_PAMARTHI_TEXT),
  'dr. g. ramesh babu::cse': textToSections(CSE_G_RAMESH_BABU_TEXT),
  'mr. ch. phaneendra varma::cse': textToSections(CSE_PHANEENDRA_VARMA_TEXT),
  'ms. a. venkata sri asha::cse': textToSections(CSE_VENKATA_SRI_ASHA_TEXT),
  'mrs. k. soni sharmila::cse': textToSections(CSE_SONI_SHARMILA_TEXT),
  'mrs. g.r.l.m. tayaru::cse': textToSections(CSE_GRLM_TAYARU_TEXT),
  'mr. chintha venkata ramana::cse': textToSections(CSE_VENKATA_RAMANA_TEXT),
  'mr. p. taraka satyanarayana murthy::cse': textToSections(CSE_TARAKA_SATYANARAYANA_MURTHY_TEXT),
  'mr. gottala surendra kumar::cse': textToSections(CSE_GOTTALA_SURENDRA_KUMAR_TEXT),
  'mrs. g. sujatha::cse': textToSections(CSE_G_SUJATHA_TEXT),
  'mr. a. nageswara rao::cse': textToSections(CSE_NAGESWARA_RAO_TEXT),
  'mr. a. satya mallesh::cse': textToSections(CSE_SATYA_MALLESH_TEXT),
  'mr. rajesh thammuluri::cse': textToSections(CSE_RAJESH_THAMMULURI_TEXT),
  'mr. v. rajesh babu::cse': textToSections(CSE_V_RAJESH_BABU_TEXT),
  'mr. bellamgubba anoch::cse': textToSections(CSE_BELLAMGUBBA_ANOCH_TEXT),
  'dr. s. uma maheswara rao::cse': textToSections(CSE_UMA_MAHESWARA_RAO_TEXT),
  'dr. s. nagarajan::cse': textToSections(CSE_S_NAGARAJAN_TEXT),
  'k n v p s brahma ramesh::cse': textToSections(CSE_BRAHMA_RAMESH_TEXT),
  'mr. panthani ramesh::cse': textToSections(CSE_PANTHANI_RAMESH_TEXT),
  'dr. satyanarayana reddy marri::cse': textToSections(CSE_SATYANARAYANA_REDDY_MARRI_TEXT),
  'dr. ashok koujalagi::cse': textToSections(CSE_ASHOK_KOUJALAGI_TEXT),
  'dr. a. sri krishna::ai&ds': textToSections(AI_HOD_TEXT),
  'dr. a. sri krishna::ai&ml': textToSections(AI_HOD_TEXT),
  'dr. p. sricharani::ai&ds': textToSections(AI_SRICHARANI_TEXT),
  'dr. p. sricharani::ai&ml': textToSections(AI_SRICHARANI_TEXT),
  'dr. g. durga prasad::ai&ds': textToSections(AI_DURGA_PRASAD_TEXT),
  'dr. g. durga prasad::ai&ml': textToSections(AI_DURGA_PRASAD_TEXT),
  'mrs. t. madhavi::ai&ds': textToSections(AI_MADHAVI_THOTAKURA_TEXT),
  'mrs. t. madhavi::ai&ml': textToSections(AI_MADHAVI_THOTAKURA_TEXT),
  'mr. n. praveen kumar::ai&ds': textToSections(AI_PRAVEEN_KUMAR_NALLI_TEXT),
  'mr. n. praveen kumar::ai&ml': textToSections(AI_PRAVEEN_KUMAR_NALLI_TEXT),
  'mrs. m. l.v.a. priya::ai&ds': textToSections(AI_PRIYA_MADDIPATI_TEXT),
  'mrs. m. l.v.a. priya::ai&ml': textToSections(AI_PRIYA_MADDIPATI_TEXT),
  'mr. k. janaki siva rama raju::ai&ds': textToSections(AI_JANAKI_SIVA_RAMA_RAJU_TEXT),
  'mr. k. janaki siva rama raju::ai&ml': textToSections(AI_JANAKI_SIVA_RAMA_RAJU_TEXT),
  'ms. ch. sravani::ai&ds': textToSections(AI_CH_SRAVANI_TEXT),
  'ms. ch. sravani::ai&ml': textToSections(AI_CH_SRAVANI_TEXT),
  'mrs. p. archana::ai&ds': textToSections(AI_P_ARCHANA_TEXT),
  'mrs. p. archana::ai&ml': textToSections(AI_P_ARCHANA_TEXT),
  'mr. k. raja sekhar::ai&ds': textToSections(AI_K_RAJA_SEKHAR_TEXT),
  'mr. k. raja sekhar::ai&ml': textToSections(AI_K_RAJA_SEKHAR_TEXT),
  'mr. p. vinod babu::ai&ds': textToSections(AI_P_VINOD_BABU_TEXT),
  'mr. p. vinod babu::ai&ml': textToSections(AI_P_VINOD_BABU_TEXT),
  'ms. k swetha::ai&ds': textToSections(AI_K_SWETHA_TEXT),
  'ms. k swetha::ai&ml': textToSections(AI_K_SWETHA_TEXT),
  'dr. h.c.p. pavan kumar::ai&ds': textToSections(AI_PAVAN_KUMAR_HOTA_TEXT),
  'dr. h.c.p. pavan kumar::ai&ml': textToSections(AI_PAVAN_KUMAR_HOTA_TEXT),
  'dr. h. c. p. pavan kumar::ai&ml': textToSections(AI_PAVAN_KUMAR_HOTA_TEXT),
  'ms. r. sarada::ai&ds': textToSections(AI_R_SARADA_TEXT),
  'mrs. r. sarada::ai&ml': textToSections(AI_R_SARADA_TEXT),
  'ms. g. kalyani::ai&ds': textToSections(AI_G_KALYANI_TEXT),
  'ms. g. kalyani::ai&ml': textToSections(AI_G_KALYANI_TEXT),
  'ms. y gayathri::ai&ds': textToSections(AI_YANDAMURI_GAYATRI_TEXT),
  'ms. y gayathri::ai&ml': textToSections(AI_YANDAMURI_GAYATRI_TEXT),
  'mr. k srikanth::ai&ds': textToSections(AI_K_SRIKANTH_TEXT),
  'mr. k srikanth::ai&ml': textToSections(AI_K_SRIKANTH_TEXT),
  'mr. veerendra bethineedi::ai&ds': textToSections(AI_VEERENDRA_BETHINEEDI_TEXT),
  'mr. veerendra bethineedi::ai&ml': textToSections(AI_VEERENDRA_BETHINEEDI_TEXT),
  'mr. d. v. h. venu kumar::ai&ds': textToSections(AI_DVH_VENU_KUMAR_TEXT),
  'mr. d. v. h. venu kumar::ai&ml': textToSections(AI_DVH_VENU_KUMAR_TEXT),
  'mr. s. venkata rao::ai&ds': textToSections(AI_S_VENKATA_RAO_TEXT),
  'mr. s. venkata rao::ai&ml': textToSections(AI_S_VENKATA_RAO_TEXT),
  'g.s.l.n.v.s sindhuja::ai&ds': textToSections(AI_SINDHUJA_TEXT),
  'g.s.l.n.v.s sindhuja::ai&ml': textToSections(AI_SINDHUJA_TEXT),
  'r. davency priyanka::ai&ds': textToSections(AI_R_DAVENCY_PRIYANKA_TEXT),
  'r. davency priyanka::ai&ml': textToSections(AI_R_DAVENCY_PRIYANKA_TEXT),
  'kalidindi somaraju::ai&ds': textToSections(AI_KALIDINDI_SOMARAJU_TEXT),
  'kalidindi somaraju::ai&ml': textToSections(AI_KALIDINDI_SOMARAJU_TEXT),
  't.v.n harsha vardhan::ai&ds': textToSections(AI_HARSHAVARDHAN_TEXT),
  't.v.n harsha vardhan::ai&ml': textToSections(AI_HARSHAVARDHAN_TEXT),
  'mr. juluri pradeep::ai&ds': textToSections(AI_JULURI_PRADEEP_TEXT),
  'mr. juluri pradeep::ai&ml': textToSections(AI_JULURI_PRADEEP_TEXT),
  'm.h.r nalini::ai&ds': textToSections(AI_MHR_NALINI_TEXT),
  'm.h.r nalini::ai&ml': textToSections(AI_MHR_NALINI_TEXT),
  'ms. n. anusha::ai&ds': textToSections(AI_N_ANUSHA_TEXT),
  'ms. n. anusha::ai&ml': textToSections(AI_N_ANUSHA_TEXT),
  'mr. p. deepak phani krishna::ai&ds': textToSections(AI_DEEPAK_PHANI_KRISHNA_TEXT),
  'mr. p. deepak phani krishna::ai&ml': textToSections(AI_DEEPAK_PHANI_KRISHNA_TEXT),
  'ms. j. sai divya::ai&ds': textToSections(AI_J_SAI_DIVYA_TEXT),
  'ms. j. sai divya::ai&ml': textToSections(AI_J_SAI_DIVYA_TEXT),
  'ms. s. p sudha::ai&ds': textToSections(AI_S_P_SUDHA_TEXT),
  'ms. s. p sudha::ai&ml': textToSections(AI_S_P_SUDHA_TEXT),
  'mr. m. p. praveen kumar::ai&ds': textToSections(AI_M_P_PRAVEEN_KUMAR_TEXT),
  'mr. m. p. praveen kumar::ai&ml': textToSections(AI_M_P_PRAVEEN_KUMAR_TEXT),
  'ms. p. lalitha raja rajeswari::ai&ds': textToSections(AI_LALITHA_RAJA_RAJESWARI_TEXT),
  'ms. p. lalitha raja rajeswari::ai&ml': textToSections(AI_LALITHA_RAJA_RAJESWARI_TEXT),
  'mr. mohammad towqeer ul haq::ai&ds': textToSections(AI_TOWQEER_UL_HAQ_TEXT),
  'mr. mohammad towqeer ul haq::ai&ml': textToSections(AI_TOWQEER_UL_HAQ_TEXT),
  'dr. samparthi v s kumar::ai&ds': textToSections(AI_SAMPARTHI_KUMAR_TEXT),
  'dr. samparthi v s kumar::ai&ml': textToSections(AI_SAMPARTHI_KUMAR_TEXT),
  'ms. g. lakshmi sundari::ai&ds': textToSections(AI_LAKSHMI_SUNDARI_TEXT),
  'ms. g. lakshmi sundari::ai&ml': textToSections(AI_LAKSHMI_SUNDARI_TEXT),
  'mr. daram anand::ai&ds': textToSections(AI_DARAM_ANAND_TEXT),
  'mr. daram anand::ai&ml': textToSections(AI_DARAM_ANAND_TEXT),
  'ms. m. bhargavi::ai&ds': textToSections(AI_M_BHARGAVI_TEXT),
  'ms. m. bhargavi::ai&ml': textToSections(AI_M_BHARGAVI_TEXT),
  'dr. d. venkata naga raju::it': textToSections(IT_HOD_TEXT),
  'mr. p. venkata rama raju::it': textToSections(IT_VENKATA_RAMA_RAJU_TEXT),
  'dr. g. ratnakanth::it': textToSections(IT_RATNA_KANTH_TEXT),
  'dr. v. pavan kumar::it': textToSections(IT_PAVAN_KUMAR_VADREVU_TEXT),
  'dr. s. ravi kumar::it': textToSections(IT_RAVI_KUMAR_SUGGALA_TEXT),
  'mr. s. sreenivasu::it': textToSections(IT_SREENIVASU_TEXT),
  'dr. s. sreenivasu::it': textToSections(IT_SREENIVASU_TEXT),
  'dr. a. veera raghava rao::it': textToSections(IT_VEERA_RAGHAVA_RAO_TEXT),
  'dr. k. ramu::it': textToSections(IT_K_RAMU_TEXT),
  'mr. k. ramu::it': textToSections(IT_K_RAMU_TEXT),
  'mr. s. ravi chandra::it': textToSections(IT_RAVICHANDRA_SRIRAM_TEXT),
  'dr. s. ravi chandra::it': textToSections(IT_RAVICHANDRA_SRIRAM_TEXT),
  'mr. v. leela prasad::it': textToSections(IT_LEELA_PRASAD_TEXT),
  'mrs. m. suma bharathi::it': textToSections(IT_SUMA_BHARATHI_TEXT),
  'mr. b. sasi kumar::it': textToSections(IT_SASI_KUMAR_TEXT),
  'mrs. b. padma::it': textToSections(IT_B_PADMA_TEXT),
  'mrs. b. sri lakshmi devi::it': textToSections(IT_SRI_LAKSHMI_DEVI_TEXT),
  'mrs. e. prasanthi::it': textToSections(IT_PRASANTHI_TEXT),
  'mrs. d. grace priyanka::it': textToSections(IT_GRACE_PRIYANKA_TEXT),
  'mrs. v. lakshmi tejaswi::it': textToSections(IT_LAKSHMI_TEJASWI_TEXT),
  'ms. v. lakshmi tejaswi::it': textToSections(IT_LAKSHMI_TEJASWI_TEXT),
  'dr. k. dileep kumar::it': textToSections(IT_DILEEP_KUMAR_TEXT),
  'mr. k. dileep kumar::it': textToSections(IT_DILEEP_KUMAR_TEXT),
  'mr. ch. tharak::it': textToSections(IT_CH_THARAK_TEXT),
  'mrs. ch. raja rajeswari::it': textToSections(IT_CH_RAJA_RAJESWARI_TEXT),
  'mr. d. srinivasa rao::it': textToSections(IT_D_SRINIVASA_RAO_TEXT),
  'mr. p l v d. ravi kumar::it': textToSections(IT_PLVD_RAVI_KUMAR_TEXT),
  'mr. m. srinivasa rao::it': textToSections(IT_M_SRINIVASA_RAO_TEXT),
  'ms. y. sabitha::it': textToSections(IT_Y_SABITHA_TEXT),
  'mr. g a k s. rajeev kumar::it': textToSections(IT_RAJEEV_KUMAR_TEXT),
  'mr. g.a.k.s. rajeev kumar::it': textToSections(IT_RAJEEV_KUMAR_TEXT),
  'mr. p. vinay::it': textToSections(IT_VINAY_TEXT),
  'mr. s. om sri sai krishna::it': textToSections(IT_OM_SRI_SAI_KRISHNA_TEXT),
  'dr. m. bhanu ranga rao::it': textToSections(IT_BHANU_RANGA_RAO_TEXT),
  'mr. m. bhanu ranga rao::it': textToSections(IT_BHANU_RANGA_RAO_TEXT),
  'mrs. y. yesu jyothi::it': textToSections(IT_YESU_JYOTHI_TEXT),
  'mr. m. raghu chandra::it': textToSections(IT_RAGHU_CHANDRA_TEXT),
  'dr. r n d s s. kiran::it': textToSections(IT_KIRAN_RELANGI_TEXT),
  'dr. r. n. d. s. s. kiran::it': textToSections(IT_KIRAN_RELANGI_TEXT),
  'mr. k. lakshmaji::it': textToSections(IT_LAKSHMAJI_TEXT),
  'mr. k. rambabu::it': textToSections(IT_RAMBABU_TEXT),
  'dr. g. kalivaraprasanna babu::it': textToSections(IT_KALIVARAPRASANNA_BABU_TEXT),
  'ms. n. amulya::it': textToSections(IT_N_AMULYA_TEXT),
  'mrs. b. vimala victoria::it': textToSections(IT_VIMALA_VICTORIA_TEXT),
  'mr. k. ram kumar::it': textToSections(IT_K_RAM_KUMAR_TEXT),
  'mrs. m. mounica devi::it': textToSections(IT_MOUNICA_DEVI_TEXT),
  'mrs. madhuri nakkella::it': textToSections(IT_MADHURI_NAKKELLA_TEXT),
  'dr. y. phani::it': textToSections(IT_Y_PHANI_TEXT),
  'mr. s. chandra sekhar rao::it': textToSections(IT_CHANDRA_SEKHARA_RAO_TEXT),
  'dr. k. v. rama murthy::mba': textToSections(MBA_RAMA_MURTHY_TEXT),
  'dr. m. karthik::mba': textToSections(MBA_KARTHIK_TEXT),
  'mrs. j. swarna jyothi::mba': textToSections(MBA_SWARNA_JYOTHI_TEXT),
  'mr. ch. anudeep::mba': textToSections(MBA_ANUDEEP_TEXT),
  'mrs. m. harshitha keerthi::mba': textToSections(MBA_HARSHITHA_KEERTHI_TEXT),
  'dr. k. prabhavathi::mba': textToSections(MBA_PRABHAVATHI_TEXT),
  'mr. mullapudi satish::mba': textToSections(MBA_SATISH_TEXT),
  'dr. ch. hari krishna::mechanical': textToSections(MECH_HOD_TEXT),
  'dr. p. srinivasa raju::mechanical': textToSections(MECH_P_SRINIVASA_RAJU_TEXT),
  'dr. g. srinivasa rao::mechanical': textToSections(MECH_G_SRINIVASA_RAO_TEXT),
  'mr. p. surya prakash varma::mechanical': textToSections(MECH_SURYA_PRAKASH_VARMA_TEXT),
  'mr. n. srinivasa rao::mechanical': textToSections(MECH_N_SRINIVASA_RAO_TEXT),
  'dr. j. v. narasimha raju::mechanical': textToSections(MECH_JV_NARASIMHA_RAJU_TEXT),
  'mr. b. satya krishna::mechanical': textToSections(MECH_SATYA_KRISHNA_TEXT),
  'mr. manoneet kumar::mechanical': textToSections(MECH_MANONEET_KUMAR_TEXT),
  'mr. u.d.s. prathap varma::mechanical': textToSections(MECH_PRATHAP_VARMA_TEXT),
  'mr. j e manikanta::mechanical': textToSections(MECH_MANIKANTA_TEXT),
  'mr. a s v prasad::mechanical': textToSections(MECH_ASV_PRASAD_TEXT),
  'mr. shaik madhar pasha::mechanical': textToSections(MECH_SHAIK_MADHAR_PASHA_TEXT),
  'ms. g. mounica::mechanical': textToSections(MECH_G_MOUNICA_TEXT),
  'mr. n. raja sekhar::mechanical': textToSections(MECH_N_RAJA_SEKHAR_TEXT),
  'mr. maddipati rajesh::mechanical': textToSections(MECH_MADDIPATI_RAJESH_TEXT),
  'dr. k. benarji::mechanical': textToSections(MECH_K_BENARJI_TEXT),
  'dr. asnit gangwar::mechanical': textToSections(MECH_ASNIT_GANGWAR_TEXT),
  'dr. k. hari krishna::mechanical': textToSections(MECH_K_HARI_KRISHNA_TEXT),
  'mr. p. phani kumar::mechanical': textToSections(MECH_P_PHANI_KUMAR_TEXT),
};

function overrideKey(name: string, department: string): string {
  return `${name.trim().toLowerCase()}::${department.trim().toLowerCase()}`;
}

export function getFacultyOverrideSections(name: string, department: string): FacultySection[] | null {
  return FACULTY_CONTENT_OVERRIDES[overrideKey(name, department)] ?? null;
}

/**
 * Faculty records hidden from the public site (grid + profile page) while
 * the underlying Firestore documents are still pending manual deletion in
 * /admin — either duplicates of someone already listed under a different
 * spelling (Mr./Dr., Mrs./Ms., inconsistent initial spacing), or people
 * with no corresponding page anywhere on the department's source roster.
 */
const HIDDEN_FACULTY_RECORDS = new Set<string>([
  'mr. k. ramu::it',
  'mr. s. ravi chandra::it',
  'mr. s. sreenivasu::it',
  'mr. k. dileep kumar::it',
  'mr. m. bhanu ranga rao::it',
  'ms. v. lakshmi tejaswi::it',
  'mr. g a k s. rajeev kumar::it',
  'dr. r n d s s. kiran::it',
  'dr. g. subba raju::mba',
  'mr. j. v. narasimha raju::mechanical',
  'mr. j. e. manikanta::mechanical',
  'mr. a. s. v. prasad::mechanical',
  'ms. g. mounika::mechanical',
  'dr. sivakumar krishnan::mechanical',
  'dr. b. n. malleswara rao::mechanical',
]);

export function isHiddenFacultyRecord(name: string, department: string): boolean {
  return HIDDEN_FACULTY_RECORDS.has(overrideKey(name, department));
}
