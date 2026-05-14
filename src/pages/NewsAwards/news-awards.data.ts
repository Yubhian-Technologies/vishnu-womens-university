export interface HappeningEvent {
  title: string;
  date: string;
  type: 'recent' | 'upcoming';
  dept?: string;
}

export interface AwardItem {
  name: string;
  issuedBy: string;
  year?: string;
  details?: string;
  category: 'ranking' | 'award' | 'accreditation';
}

export interface GalleryAlbum {
  title: string;
  date: string;
  year: number;
}

export const happenings: HappeningEvent[] = [
  { title: 'Team Ziba Racers secured five prestigious awards @ mBAJA SAEINDIA 2026', date: 'February 25, 2026', type: 'recent' },
  { title: 'Cyber Shield 2.1', date: 'January 31, 2026', type: 'recent' },
  { title: 'MoU signing ceremony between VWU & Metey Engineering & Consultancy Pvt Ltd.', date: 'December 27, 2025', type: 'recent' },
  { title: 'Guest Lecture on Construction Technologies for Rapid Delivery of Structures', date: 'December 27, 2025', type: 'recent', dept: 'Dept. of Civil Engineering with ASCE Students Chapter' },
  { title: '138th Birth Anniversary Celebrations of Srinivasa Ramanujan', date: 'December 22, 2025', type: 'recent' },
  { title: 'Empowering Women in Civil Engineering through Geospatial Engineering Techniques (WICE-GEO 2025)', date: 'December 12–13, 2025', type: 'recent' },
  { title: '150 Years of Vande Mataram: Celebrating the Song of the Motherland', date: 'November 7, 2025', type: 'recent' },
  { title: 'Team E-Ziba Racers Excel at SAE-India Autonomous BAJA 2025', date: 'October 6–13, 2025', type: 'recent' },
  { title: 'Training Program on Data Structures using JAVA', date: 'September 8–20, 2025', type: 'recent' },
  { title: 'Workshop on Hands-on Training: Microcontrollers and Sensor Interfacing', date: 'September 8–13, 2025', type: 'recent' },
  { title: 'Commencement of I B.Tech. Classes for Academic Year 2025-26', date: 'August 4, 2025', type: 'recent' },
  { title: 'Technova2026 – A National Level Technical Symposium for Women', date: 'March 6–7, 2026', type: 'upcoming' },
  { title: 'Online FDP on "Foundations of Quantum Computing and Machine Learning"', date: 'June 2–6, 2026', type: 'upcoming', dept: 'CSE Department' },
];

export const awards: AwardItem[] = [
  // Rankings
  { name: 'IEI Engineering Education Excellence Award 2025', issuedBy: 'Indian Engineering Institute (IEI)', year: '2025', details: 'Excellence in Overall Performance among Women Engineering Colleges/Institutions', category: 'ranking' },
  { name: 'MHW Ranking 2024 – Diamond Band', issuedBy: 'MHW Ranking', year: '2024', details: 'Ranked in Diamond Band across India for excellence in well-being of Faculty, Staff and Students', category: 'ranking' },
  { name: 'India Today Best Engineering College', issuedBy: 'India Today Magazine', year: '2023', details: 'Listed as Best Engineering College', category: 'ranking' },
  { name: 'Green Institutional Rankings 2022 – Rank 47', issuedBy: 'Sustainable Institutions of India', year: '2022', details: 'Ranked No. 47 across India', category: 'ranking' },
  { name: 'ARIIA – Atal Ranking on Innovation Achievements', issuedBy: 'Ministry of Education', details: 'Ranked in innovation achievements category', category: 'ranking' },
  { name: 'MHRD NIRF Ranking', issuedBy: 'Ministry of Education (MHRD)', details: 'Ranked in National Institutional Ranking Framework', category: 'ranking' },
  { name: 'Outlook Magazine Top 100 Colleges – Rank 92', issuedBy: 'Outlook Magazine', year: '2017', details: "Ranked 92 in India's Top 100 Professional Colleges", category: 'ranking' },
  { name: 'Careers 360 AAA+ Rating', issuedBy: 'Careers 360', details: 'AAA+ institutional quality rating', category: 'ranking' },
  { name: 'THE WEEK – Best Engineering College', issuedBy: 'THE WEEK Magazine / Hansa Research', year: '2023', details: 'Listed as Best Engineering College', category: 'ranking' },
  // Awards
  { name: 'National Level Engineering Education Excellence Award', issuedBy: 'Indian Engineering Congress (37th IEC, Chennai)', year: '2022', details: 'Best Engineering College award', category: 'award' },
  { name: 'ISTE A.P. Section Best Engineering College Award', issuedBy: 'Indian Society for Technical Education (ISTE), A.P. Section', year: '2022', category: 'award' },
  { name: 'IIC 4-Star Rating', issuedBy: 'Ministry of Education (MoE)', year: '2022–23', details: '4-star rating for promoting innovation and startups on campus', category: 'award' },
  { name: 'APQO Global Performance Excellence Award', issuedBy: 'Asia Pacific Quality Organization (APQO)', category: 'award' },
  { name: 'IMC Ramkrishna Bajaj National Quality Awards', issuedBy: 'Indian Management Council (IMC)', year: '2017', category: 'award' },
  { name: 'AICTE USVA 2020 – Winner', issuedBy: 'AICTE', year: '2020', category: 'award' },
  { name: 'Radio Vishnu 90.4 – Best Community Radio Award', issuedBy: 'UNICEF – For Every Child', year: '2022', details: 'Award for Best Community Radio', category: 'award' },
  { name: 'Best Consumer Award – Alternative Energy', issuedBy: 'APEPDCL (Andhra Pradesh Eastern Power Distribution Company)', details: 'Best consumer in West Godavari District for use of alternative energy resources', category: 'award' },
  { name: 'Distinguished Alumnus Award', issuedBy: 'NIT Trichy', details: 'Recipient: Sri K V Vishnu Raju, Chairman SVES', category: 'award' },
  // Accreditations
  { name: 'NAAC Accreditation', issuedBy: 'National Assessment and Accreditation Council', year: '2022', category: 'accreditation' },
  { name: 'NBA Accreditation', issuedBy: 'National Board of Accreditation', details: 'Engineering programs accredited', category: 'accreditation' },
  { name: 'UGC Autonomous Status', issuedBy: 'University Grants Commission', category: 'accreditation' },
  { name: 'UGC 2(f) & 12(B) Recognition', issuedBy: 'University Grants Commission', category: 'accreditation' },
  { name: 'AICTE Recognition', issuedBy: 'All India Council for Technical Education', category: 'accreditation' },
  { name: 'AICTE-CII Survey Recognition', issuedBy: 'AICTE and Confederation of Indian Industry', category: 'accreditation' },
  { name: 'TEQIP-II', issuedBy: 'Technical Education Quality Improvement Program', category: 'accreditation' },
  { name: 'JNTUK Affiliation', issuedBy: 'Jawaharlal Nehru Technological University Kakinada', category: 'accreditation' },
  { name: 'JNTUK Autonomous Approval', issuedBy: 'JNTUK', details: 'Autonomous status from JNTUK', category: 'accreditation' },
  { name: 'EduSkills Foundation – Institutional Member', issuedBy: 'EduSkills Foundation', category: 'accreditation' },
];

export const galleryAlbums: GalleryAlbum[] = [
  // 2026
  { title: 'Signed MoU with Mahindra & Mahindra', date: 'March 9, 2026', year: 2026 },
  { title: 'Annual Day 2026 – Celebrations', date: 'March 7, 2026', year: 2026 },
  { title: 'TECHNOVA 2026 – Valedictory', date: 'March 7, 2026', year: 2026 },
  { title: 'TECHNOVA 2026 – Culturals', date: 'March 6, 2026', year: 2026 },
  { title: 'TECHNOVA 2026 – Events', date: 'March 6, 2026', year: 2026 },
  { title: 'TECHNOVA 2026 – Inauguration', date: 'March 6, 2026', year: 2026 },
  { title: 'Celebration of Ethnic Day @ VWU', date: 'March 2, 2026', year: 2026 },
  { title: 'Congratulations to Awardees of the Aegis Graham Bell Awards', date: 'March 1, 2026', year: 2026 },
  { title: 'Team Ziba Racers – Five Awards @ mBAJA SAEINDIA 2026', date: 'February 25, 2026', year: 2026 },
  { title: 'Chart Presentation on "Drug Free Environment" @ EAGLE Club', date: 'February 11, 2026', year: 2026 },
  // 2025
  { title: "Ramanujan's 138th Birth Anniversary – Treasure Hunt", date: 'December 12, 2025', year: 2025 },
  { title: "Ramanujan's 138th Birth Anniversary – Riddle Master", date: 'December 9, 2025', year: 2025 },
  { title: "Ramanujan's 138th Birth Anniversary – Math Project Expo", date: 'December 8, 2025', year: 2025 },
  { title: 'Celebrating the Spirit of Semi-Christmas at VWU', date: 'December 20, 2025', year: 2025 },
  { title: 'Soil to Soul – National Farmers Day Event', date: 'December 23, 2025', year: 2025 },
  { title: 'SWARNA ANDHRA – SWACHHA ANDHRA Awareness Programme', date: 'December 20, 2025', year: 2025 },
  { title: 'International Day of Personalities with Disabilities', date: 'December 3, 2025', year: 2025 },
  { title: 'Celebrating the Legacy of Dr. B. V. Raju Garu', date: 'October 15, 2025', year: 2025 },
  { title: 'Session on Storytelling for Enigmatic Communication by Ms. Deepa Kiran', date: 'September 18, 2025', year: 2025 },
  { title: "Freshers' Day – VISHNOVA 2K25", date: 'September 13, 2025', year: 2025 },
  { title: '8th Graduation Day – VISHNOTSAV 2K25', date: 'September 13, 2025', year: 2025 },
  { title: 'Yoga Day Celebrations 2025', date: 'June 26, 2025', year: 2025 },
  { title: 'FDP on Microchip Embedded Systems Developer', date: 'April 28 – May 3, 2025', year: 2025 },
  { title: 'The Illuminaries Association – Annual Day 2024-25', date: 'March 24, 2025', year: 2025 },
  { title: 'Eco Splash (Water Day Event)', date: 'March 22, 2025', year: 2025 },
  { title: 'VISHVATECH 3.0', date: 'March 17–19, 2025', year: 2025 },
  { title: '2nd Edition of R&D Showcase', date: 'March 18, 2025', year: 2025 },
  { title: 'Annual Day 2025 – Celebrations', date: 'March 8, 2025', year: 2025 },
  { title: 'TECHNOVA 2025 – Valedictory', date: 'March 8, 2025', year: 2025 },
  { title: 'TECHNOVA 2025 – Culturals', date: 'March 7, 2025', year: 2025 },
  { title: 'TECHNOVA 2025 – Events', date: 'March 7, 2025', year: 2025 },
  { title: 'Inauguration of TECHNOVA 2025', date: 'March 7–8, 2025', year: 2025 },
  { title: "VWU IDEA LAB honored with 'Participation Cup' – AICTE IDEA LAB Tech Fest 2025", date: 'March 7, 2025', year: 2025 },
  { title: 'National Concrete Canoe Competition & Phoenix 2K25', date: 'February 19, 2025', year: 2025 },
  { title: 'InnovateX: Institutional Innovation Challenge & Expo', date: 'February 21, 2025', year: 2025 },
  { title: 'Alumni Meet @ Bengaluru', date: 'February 15, 2025', year: 2025 },
  { title: 'AICTE ATAL Academy One-Week Online Faculty Development Program', date: 'February 10–15, 2025', year: 2025 },
  { title: 'Industry Oriented Training on JAVA Programming for II-EEE Students', date: 'February 3–19, 2025', year: 2025 },
  { title: 'Road Safety Awareness Program – Civil Engineering', date: 'January 24, 2025', year: 2025 },
  // 2024
  { title: 'TEDx VWU', date: 'December 14, 2024', year: 2024 },
  { title: 'Inauguration of "MAHILA PRAJWALAN"', date: 'December 6, 2024', year: 2024 },
  { title: 'FAILATHON 2024', date: 'November 30, 2024', year: 2024 },
  { title: "Fresher's Day Celebrations 2024", date: 'September 14, 2024', year: 2024 },
  { title: 'Success Meet @ VWU', date: 'September 13, 2024', year: 2024 },
  { title: 'Inauguration of Rifle Shooting Facility', date: 'August 28, 2024', year: 2024 },
  { title: 'Inauguration of AR-VR Studio', date: 'August 28, 2024', year: 2024 },
  { title: 'INDEPENDENCE DAY Celebrations @ VWU', date: 'August 15, 2024', year: 2024 },
  { title: '7th Graduation Day – VISHNOTSAV 2K24', date: 'August 10, 2024', year: 2024 },
  { title: '24-Hour MAKEATHON "PIVOT – Change is Constant"', date: 'July 20, 2024', year: 2024 },
  { title: 'Interaction Program with UPSC Topper Koyye Chitti Raju', date: 'June 28, 2024', year: 2024 },
  { title: 'MoU Signing and Exchange with Capgemini 2024', date: 'July 12, 2024', year: 2024 },
  { title: 'Inauguration of ACM-W Student Chapter', date: 'July 12, 2024', year: 2024 },
  { title: 'Technical Talk on "AI & Privacy" – Prof. Ponnurangam Kumaraguru, IIT Hyderabad', date: 'March 22, 2024', year: 2024 },
  { title: 'MOU Signing – CoE for Sustainable Construction Materials', date: 'March 20, 2024', year: 2024 },
  { title: 'TECHNOVA 2024', date: 'March 11–12, 2024', year: 2024 },
  { title: 'R&D Showcase 2024', date: 'February 29, 2024', year: 2024 },
  { title: "14th National Voters' Day Celebrations @ VWU", date: 'January 25, 2024', year: 2024 },
  { title: 'New Year Celebrations @ VWU 2024', date: 'January 1, 2024', year: 2024 },
  // 2023
  { title: 'International Conference ICRAAE-2023', date: 'December 22–23, 2023', year: 2023 },
  { title: '24 Hours FAILATHON @ VWU', date: 'November 1, 2023', year: 2023 },
  { title: 'Workshop on Large Language Models, Transformers & Generative AI', date: 'October 30, 2023', year: 2023 },
  { title: "Freshers' Day Celebrations @ VWU 2023", date: 'October 7, 2023', year: 2023 },
  { title: '6th Graduation Day – VISHNOTSAV 2K23', date: 'September 17, 2023', year: 2023 },
  { title: 'Webinar: Women in Software Industry – Leaders for Sustainable Future', date: 'August 5, 2023', year: 2023 },
  { title: 'International Yoga Day 2023 @ VWU', date: 'June 21, 2023', year: 2023 },
  { title: "International Women's Day and Annual Day Celebrations 2023", date: 'March 8, 2023', year: 2023 },
  { title: 'Sankranthi Celebrations @ VWU', date: 'January 7–8, 2023', year: 2023 },
  // 2022
  { title: 'Graduation Day – Vishnotsav 2022', date: 'November 19, 2022', year: 2022 },
  { title: 'VISHNOVA 2K22 – Freshers Day Celebrations', date: 'November 12, 2022', year: 2022 },
  { title: 'E-Ziba Racers won 12 Awards – BAJA SAE INDIA 2022', date: 'June 5, 2022', year: 2022 },
  { title: 'Tiranga Rally @ VWU', date: 'August 12, 2022', year: 2022 },
  { title: 'Students Interaction with Prof. Chetan Singh Solanki, IIT-Bombay', date: 'May 21, 2022', year: 2022 },
  { title: 'AICTE Sponsored Online International Conference on AI & Sustainable Engineering', date: 'March 29, 2022', year: 2022 },
  // 2021
  { title: 'Inauguration of I B.Tech. Class Work 2021-22', date: 'December 11, 2021', year: 2021 },
  { title: 'VISHNU IMPETUS – Placements Focus Program (Multiple Cities)', date: 'July 2021', year: 2021 },
  // 2020
  { title: 'E-Ziba Racers – Overall Championship @ BAJA SAE India-2020', date: 'January 25, 2020', year: 2020 },
  { title: "International Women's Day and Annual Day Celebrations 2020", date: 'March 8, 2020', year: 2020 },
  { title: 'Vikram Sarabhai Centenary Programme @ VWU', date: 'January 21–24, 2020', year: 2020 },
  { title: 'Students Interaction with Nandini Sarkar, Boeing Global Equity Leader', date: 'January 6, 2020', year: 2020 },
  // 2019
  { title: '14th National Symposium for Women – Medha Milan 2019', date: 'September 27, 2019', year: 2019 },
  { title: "International Women's Day and Annual Day Celebrations 2019", date: 'March 8, 2019', year: 2019 },
  { title: 'Vishnu Khel 2K19 – Sports Celebrations', date: 'March 6, 2019', year: 2019 },
  { title: 'Gala of Placement Celebrations 2019', date: 'February 12, 2019', year: 2019 },
  // 2018
  { title: 'Electric Solar Vehicle Championship ESVC 2018 @ VWU', date: 'March 27 – April 2, 2018', year: 2018 },
  { title: "International Women's Day and Annual Day Celebrations 2018", date: 'March 8, 2018', year: 2018 },
  { title: 'Medha Milan 2018 – National Symposium for Women', date: 'March 7–8, 2018', year: 2018 },
  // 2017
  { title: "Asia's Biggest Electric-Solar Vehicle Championship Season 4.0 @ VWU", date: 'March 28 – April 2, 2017', year: 2017 },
  { title: "16th Annual Day & International Women's Day Celebrations", date: 'March 8, 2017', year: 2017 },
  { title: 'Medha Milan 2017 – National Symposium for Women', date: 'March 6–8, 2017', year: 2017 },
  { title: 'VKC-2017 – Vishnu Kart Challenge', date: 'January 27–30, 2017', year: 2017 },
];

export const galleryYears = Array.from(new Set(galleryAlbums.map(a => a.year))).sort((a, b) => b - a);
