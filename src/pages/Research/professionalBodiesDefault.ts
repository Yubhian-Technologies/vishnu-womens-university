// Fallback content for the Professional Bodies item, sourced from
// https://svecw.edu.in/professional-bodies/. Firestore's researchItems doc
// for this slug currently only has a short one-line-per-body summary table
// (tableText) — far shorter than the source site's actual per-body content
// (full descriptions, chapter/advisor details, and activity logs), so
// ProfessionalBodiesSection.tsx renders this richer structure directly
// instead of going through the generic tableText/accordionText/projectsText
// parsers in ResearchDetail.tsx, none of which support this much structure
// (mixed paragraphs, labeled people, and a data table) inside a single
// collapsible item. Once an admin has a way to edit this from the CMS, this
// file can be retired.
export interface ProfessionalBodyBullet {
  label?: string;
  text: string;
}

export interface ProfessionalBodyPerson {
  role: string;
  name: string;
  details?: string[];
}

export interface ProfessionalBodyActivity {
  name: string;
  date: string;
}

export interface ProfessionalBody {
  key: string;
  shortName: string;
  fullName: string;
  paragraphs: string[];
  bullets?: ProfessionalBodyBullet[];
  people?: ProfessionalBodyPerson[];
  chapterInfo?: { label: string; value: string }[];
  activitiesTitle?: string;
  activities?: ProfessionalBodyActivity[];
}

export const PROFESSIONAL_BODIES: ProfessionalBody[] = [
  {
    key: 'iste',
    shortName: 'ISTE',
    fullName: 'Indian Society For Technical Education',
    paragraphs: [
      'ISTE is the premier membership association for educators and education leaders engaged in improving and teaching by advancing the effective use of technology in PK-12 and teacher education.',
      'ISTE membership for students and faculty is a powerful and meaningful way for educators to connect with peers, to gather in a variety of forums to share the challenges and excitement of teaching, and to be a part of the community that leads the transformation of education.',
    ],
  },
  {
    key: 'ieee',
    shortName: 'IEEE',
    fullName: 'Institute of Electrical and Electronics Engineers',
    paragraphs: [
      "IEEE — stands for the Institute of Electrical and Electronics Engineers. IEEE is the world's largest professional association dedicated to advancing technological innovation and excellence for the benefit of humanity.",
      "IEEE and its members inspire a global community through IEEE's highly cited publications, conferences, technology standards, and professional and educational activities. IEEE creates an environment where members collaborate on world-changing technologies — from computing and sustainable energy systems, to aerospace, communications, robotics, healthcare, and more.",
      'The IEEE Brand Identity Toolkit explains the basic usage rules for all corporate identity elements and how to utilize them to create a powerful and consistent communications pieces.',
    ],
  },
  {
    key: 'iete',
    shortName: 'IETE',
    fullName: 'Institution of Electronics and Telecommunication Engineers',
    paragraphs: [
      'Founded in 1953, The Institution of Electronics and Telecommunication Engineers (IETE) is a leading professional society devoted to the advancement of science and technology of "Electronics, Telecommunications and IT". IETE serves its 45,000 members both individuals and industries / organizations through its 41 centers spread all over India and abroad.',
      'In a big way, all these various individual societies facilitate our students to do research work in their professional education through Student Chapters. Our students participate various activities for their better stand among other engineering graduates.',
    ],
  },
  {
    key: 'iet',
    shortName: 'IET',
    fullName: 'Institution of Engineering and Technology',
    paragraphs: [
      'Shri Vishnu Engineering College for Women takes pride in inaugurating its vibrant IET On Campus on 22 November 2018. SVECW is the leading institution in student memberships, with around 200 students in the IET Hyderabad Local network.',
      'SVECW On Campus has been a hub of Learning and innovation, thanks to its fruitful collaboration with IET. We have organized numerous Seminars, Workshops, and Invited Lectures, providing our students with unique learning opportunities. Our students have also reaped the benefits of hands-on workshops, field competitions, and article presentation competitions, all organized in collaboration with IET (UK). These experiences have enhanced their technical skills and broadened their horizons, preparing them for a successful career in engineering.',
    ],
    people: [{ role: 'Faculty Advisor', name: 'Dr. K. Kalyan Sagar', details: ['Associate Professor — EEE Department'] }],
    activitiesTitle: 'List of Activities',
    activities: [
      { name: 'One Day Workshop on College to Corporate', date: '15 April 2024' },
      { name: 'A Two Day Workshop on AI Mastery Deep Dive: Unveiling Comprehensive Horizons', date: '15–16 March 2024' },
      { name: 'A Two Day Workshop on Modern Development Toolkit: Mastering Git, Jenkins, Docker, and AWS Deployment', date: '15–16 March 2024' },
      { name: 'A Two Day Workshop on Digital Design Using Verilog HDL', date: '3–4 August 2023' },
      { name: 'One Day Workshop on Artificial Intelligence & Machine Learning', date: '9 June 2023' },
      { name: 'One Day Workshop on DC-DC Converter Design for Smart Vehicles', date: '29 December 2021' },
      { name: 'One Day Workshop on Motor Control For Smart Vehicles', date: '26 August 2021' },
      { name: 'A Two Day Workshop on Industrial IOT', date: '1–2 March 2019' },
      { name: 'One Day Workshop on LaTeX — An Efficient Documentation Tool', date: '2 March 2019' },
      { name: 'A Two Day Workshop on Augmented Reality & Artificial Intelligence', date: '7–8 December 2018' },
    ],
  },
  {
    key: 'sae',
    shortName: 'SAE',
    fullName: 'Society of Automotive Engineers',
    paragraphs: [
      'The SAE Collegiate Club at Shri Vishnu Engineering College for Women has had a remarkable journey since its establishment in September 2015. Having Dr. U. Chandra Sekhar, Program Advisor-Director at Wipro-3D, as the Chief Guest for the inauguration program was indeed a great honor for the club. His expertise and experience in the field of mechanical engineering would have undoubtedly inspired and motivated the members.',
      "Dr. Chandra Sekhar's technical talk on the latest happenings in Mechanical engineering would have provided valuable insights into the industry's trends, challenges, and opportunities. Such talks not only enrich students' knowledge but also ignite their passion for the subject and encourage them to explore new avenues in their academic and professional journey.",
      "This inaugural event likely set a high standard for the club's future activities, fostering a culture of learning, innovation, and collaboration among its members. It's clear that the club has been successful in creating a platform for students to engage with industry experts, learn from their experiences, and stay updated with the advancements in the automotive engineering field.",
      "The increase in membership from 55 to approximately 350 members demonstrates the growing interest and participation in the club's activities. It's also noteworthy that 72 students are registered with SAE-INDIA for the academic year 2023-2024, showing a continued commitment to the automotive engineering field.",
      "SAE Collegiate Clubs engage in various activities aimed at enhancing students' knowledge, skills, and networking opportunities in the field of automotive engineering, some of these activities include:",
    ],
    people: [
      { role: 'Faculty Advisor', name: 'Dr. P. Srinivasa Raju', details: ['PhD, Professor'] },
      { role: 'Faculty Advisor', name: 'Mr. Manoneet Kumar', details: ['(PhD), Asst. Professor'] },
      { role: 'Faculty Advisor', name: 'Mr. A. S. V. Prasad', details: ['(PhD), Asst. Professor'] },
    ],
    bullets: [
      { label: 'Hands-on Projects', text: 'Participating in hands-on projects like designing, building, and testing vehicles for competitions such as Baja SAE, Formula SAE, and Aero Design.' },
      { label: 'Competitions', text: 'Participating in SAE-sponsored competitions and challenges to apply theoretical knowledge in practical scenarios and develop teamwork and leadership skills.' },
      { label: 'Networking Events', text: 'Hosting networking events where students can interact with professionals from the automotive industry, potential employers, and alumni.' },
      { label: 'Technical Workshops and Seminars', text: 'Organizing workshops and seminars on topics related to automotive engineering, such as vehicle dynamics, powertrain technology, autonomous vehicles, etc.' },
      { label: 'Guest Lectures', text: 'Inviting industry professionals and experts to give talks and presentations on the latest trends and developments in automotive technology.' },
      { label: 'Tours and Visits', text: 'Organizing visits to automotive companies, research labs, and manufacturing facilities to provide students with real-world exposure to the industry.' },
      { label: 'Skill Development Workshops', text: 'Conducting workshops focused on developing practical skills like CAD modeling, simulation software usage, and prototyping techniques.' },
      { label: 'Community Outreach', text: 'Engaging in outreach activities such as STEM education programs, mentoring high school students interested in engineering, and participating in community service projects.' },
      { label: 'Professional Development', text: 'Providing resources and guidance for resume building, interview preparation, and career development.' },
    ],
    activitiesTitle: 'List of Events, Seminars, Guest Lectures Conducted under SAE',
    activities: [
      { name: 'Vishnu Karting Championship-2015', date: '22–25 Jan 2016 at Shri Vishnu Engineering College for women' },
      { name: 'Team Juno Racers Participation in Indian Karting Race-2016', date: 'Shri Krishna College of Engineering & Technology, Coimbatore, 25–28 August 2016' },
      { name: 'Team Z1ba Racers Participation in Baja-2016', date: '15–20 February 2016, Pithampur, Indore' },
      { name: 'Team Z1ba Racers Participation in Baja-2017', date: '16–20 February 2017, Pithampur, Indore' },
      { name: 'Vishnu Karting Championship-2017', date: '27–30 January 2017 at Shri Vishnu Engineering College for women' },
      { name: 'ISIE — Electric solar vehicle championship in association with ISIE', date: '26 March – 02 April 2017 at Shri Vishnu Engineering College for Women' },
      { name: 'Workshop on Vehicle Dynamics', date: '7–10 June 2018' },
      { name: 'Workshop on CAE Workshop', date: '15–20 Sep 2018, organized by ATOM Motors' },
      { name: 'Team Z1ba Racers Participation in Baja-2019', date: '6–10 March 2019 at IIT Ropar' },
      { name: 'Guest talk by ARAI/SAE Southern region — Dr. Sanjay Nibandhe on ATV team motivation and Lecture on Validation of Automobile in Industry', date: '5–6 Dec 2019' },
      { name: 'Conducted one week EV & Lithium Technology Workshop at SVECW', date: '21–26 Dec 2019, by Elfer Megacorp Pvt. Ltd.' },
      { name: 'Team Z1ba Racers Participation in Baja-2019', date: '22–26 Jan 2020, Pithampur, Indore' },
      { name: 'Industrial Visit to Caterpillar India Pvt Ltd', date: '11–12 Mar 2020, Chennai' },
      { name: 'A Ten-Day Workshop on "Advanced CATIA"', date: '02–04 March 2020 at Shri Vishnu Engineering College for Women' },
      { name: 'A One Week Workshop on "EV & Lithium Technology with Hands-on session"', date: '21–27 December 2019 at Shri Vishnu Engineering College for Women' },
      { name: 'A Two-Day Talk on "Validation of Automobile in Industry"', date: '05–06 December 2019 at Shri Vishnu Engineering College for women' },
      { name: 'Guest Lecture series on "Skill requirements and job opportunities for women empowerment in Mechanical Engineering"', date: '24 Apr, 01 May & 08 May 2021' },
      { name: 'A 1-Week online short-training program on "Product Design and Drafting using CATIA"', date: '03–08 February 2021' },
      { name: 'One week student workshop on "Optimization and its Relevance in Additive Manufacturing"', date: '25–31 January 2021 at Shri Vishnu Engineering College for Women' },
      { name: 'Webinar on "Automotive and New Mobility Design"', date: '18 March 2022 at Bhimavaram' },
      { name: 'Development of "Baja Track" at Yenemduru', date: '12 March 2022, Bhimavaram' },
      { name: 'A Six Day Workshop on "Product Design and Drafting by CATIA"', date: '22–27 November 2021 at Shri Vishnu Engineering College for women' },
      { name: 'A Webinar on "Geometric Dimensioning and Tolerancing"', date: '23 October 2021 at Shri Vishnu Engineering College for women' },
      { name: 'Virtual talk on "IPR, Patent and Entrepreneurship"', date: '05 June 2021 at Shri Vishnu Engineering College for women' },
      { name: 'Internship opportunity in association with Brakes India Pvt. Ltd', date: '27 April – 06 May 2022' },
      { name: 'Team Z1ba Racers Participation in Baja-2022', date: '23 Jan, Indore Institute of Science and Technology, Pithampur Road, Rau, Indore, Madhya Pradesh' },
      { name: 'One Week student workshop on "Problem Solving using Finite Element Analysis"', date: '12–18 June 2023 at SVECW' },
      { name: 'A Ten-day STTP on "Digital Manufacturing 2k23"', date: '03–05 May 2023 at Shri Vishnu Engineering College for women' },
      { name: 'A One Week Workshop on CATIA', date: '20–26 March 2023 at Shri Vishnu Engineering College for women' },
      { name: 'An Expert Talk on "Geometric Dimensioning and Tolerancing"', date: '21 June 2023 at SVECW' },
      { name: 'Two-Day Talk on "Innovative Trends in Automobile and Farm Equipment Machinery"', date: '24–25 2023 at Shri Vishnu Engineering College for women' },
      { name: 'Team Z1ba Racers Participation in M-Baja & E-Baja-2023', date: '6–11 March 2024, BVRIT-Narsapur' },
      { name: 'Team Z1ba Racers Participation in AGKC-2024', date: '26–29 February 2024, AITAM-Tekkali' },
    ],
  },
  {
    key: 'acm',
    shortName: 'ACM',
    fullName: 'Association for Computing Machinery',
    paragraphs: [
      'In pursuit of cultivating skilled professionals in artificial intelligence through premier education and gaining global recognition as a hub, the Department of Artificial Intelligence at SVECW started the ACM-W Student Chapter exclusively for women students. This initiative aims to promote collaboration and research among women students, offering access to valuable resources including papers, journals, and magazines on cutting-edge technologies.',
      'Membership in ACM connects students to a global community of researchers, fostering networking opportunities and keeping members abreast of technological research trends.',
    ],
    chapterInfo: [
      { label: 'Chapter Name', value: 'SVECW-ACM-W' },
      { label: 'Chapter Group ID', value: '194312' },
    ],
  },
  {
    key: 'csi',
    shortName: 'CSI',
    fullName: 'Computer Society of India',
    paragraphs: [
      "Formed in 1965, the CSI has been instrumental in guiding the Indian IT industry down the right path since its formative years. Today, the CSI has 70 chapters all over India, 418 student branches, and more than 90000 members including India's most famous IT industry leaders, brilliant scientists and dedicated academicians.",
      'CSI offers a range of services and networking opportunities through workshops, seminars, conventions and courses, participated by industry majors sharing best practices and digital opportunities for development, exchanging knowledge and ideas.',
    ],
  },
  {
    key: 'ici',
    shortName: 'ICI',
    fullName: 'Indian Concrete Institute @ CE Dept',
    paragraphs: [
      'Indian Concrete Institute (ICI) — Student Chapter was established in the Department of Civil Engineering from 2019 through taking a Life Institutional Membership in 2016. This ICI Student Chapter is known for its activities at Regional Level and National Level through its versatile programs for students, faculty, local engineers and masons. ICI — Student chapter in association with UltraTech Cement Limited, Infra Support, Transheight Consultants Pvt. Ltd., and many other Industries have organized notable programs/workshops/seminars etc., have benefited students in learning emerging technologies and Industry Ready.',
      "The Department of Civil Engineering at SVECW (A), Bhimavaram, has received notable recognition for ICI Student Chapter under the ICI UltraTech Concrete Day and Construction Excellence Award's (2020 till date):",
    ],
    bullets: [
      { label: 'Outstanding Student Chapter Award', text: 'at the regional level (Vijayawada and Vizag Centre) for the years 2020, 2022, and 2023.' },
      { label: 'Best Student Chapter Performance Appreciation Award', text: 'for the year 2022 (National Level).' },
      { label: 'Best Student Chapter Award', text: 'for the year 2023 (National Level).' },
    ],
  },
  {
    key: 'asce',
    shortName: 'ASCE',
    fullName: 'American Society of Civil Engineers @ CE Dept.',
    paragraphs: [
      'American Society of Civil Engineers (ASCE), an engineering society for the advancement of the science & profession of Civil engineering & enhancement of human welfare through the activities of society members.',
      'ASCE — Student Chapter has started in the department of Civil Engineering from 2024 and is under Probation period. Through this forum, students have been given industry connect globally which makes them understand and adopt versatile technologies that can drive their passion in the Core Sector. Aiming to participate in the National Concrete Canoe Competition that will be hosted under ASCE, the forum focuses to nurture the young women talent through training & equipping them with resources.',
    ],
  },
  {
    key: 'ieee-cis',
    shortName: 'IEEE CIS',
    fullName: 'IEEE Computational Intelligence Society',
    paragraphs: [
      'The IEEE Computational Intelligence Society (CIS) is a vibrant student community dedicated to the exploration of artificial intelligence, machine learning, and intelligent systems. Our society fosters innovation, research, and technical excellence through workshops, seminars, hands-on projects, and global competitions.',
      'As a part of IEEE, CIS focuses on the theory, design, application, and development of biologically and linguistically inspired computational paradigms, including neural networks, genetic algorithms, evolutionary programming, fuzzy systems, and hybrid intelligent systems.',
      'We connect students with industry professionals, academic leaders, and mentors, creating opportunities for networking, skill development, and career advancement in AI-driven industries. Whether you are a beginner or an AI enthusiast, CIS provides the perfect platform to learn, collaborate, and lead in the ever-evolving field of computational intelligence.',
    ],
    chapterInfo: [{ label: 'IEEE Student Branch Identification Code', value: 'SBC08731A' }],
  },
  {
    key: 'ieee-pes',
    shortName: 'IEEE PES',
    fullName: 'IEEE Power and Energy Society',
    paragraphs: [
      'The SVECW IEEE Power & Energy Society (PES) Chapter (SBC08731) was established on 27 Feb 2021 — a dynamic technical chapter under the IEEE umbrella, dedicated to the advancement and dissemination of knowledge in the fields of electric power and energy. Focused on promoting innovation and technical excellence, the PES Chapter provides a platform for professionals, researchers, and students to collaborate, share insights, and stay abreast of the latest developments in power systems, renewable energy, smart grids, and sustainable energy technologies.',
      'Through technical talks, workshops, industry expert lectures, and hands-on events, the chapter aims to foster academic and professional growth while contributing to global energy solutions.',
    ],
    people: [
      {
        role: 'Chapter Advisor',
        name: 'Dr. S. Dileep Kumar Varma',
        details: ['IEEE Membership Number: 95656674', 'IEEE Email: varma8332@ieee.org', 'Alternate Email: ahaarticles@gmail.com', 'Mobile: +91-9441171542'],
      },
      {
        role: 'Chapter Chair',
        name: 'Ms. Himaja Lingampalli',
        details: ['IEEE Membership Number: 101209432', 'IEEE Email: himajalingampalli99@gmail.com', 'Mobile: +91-7780595684'],
      },
    ],
  },
];
