// Note: happenings and awards used to live here too, but both are now
// Firestore-backed (see NewsAwardsDataAdmin.tsx / the `happenings` and
// `awards` collections) since they're day-to-day editable content. This
// file now only holds the gallery album archive — a historical, rarely-
// changing year-by-year index of past event titles (no images; the actual
// photo grid is the separate Firestore-backed `gallery` collection).
export interface GalleryAlbum {
  title: string;
  date: string;
  year: number;
  link?: string;
}

export const galleryAlbums: GalleryAlbum[] = [
  // 2026
  { title: "A New Era of Excellence – Inauguration Ceremony 2026 – Vishnu Women's University", date: 'August 23, 2026', year: 2026, link: 'https://photos.google.com/share/AF1QipP0Ar72PZx_r1xt_Q28fSBLhCwl-ORbdn0qdcZe61YHOQn_tKH53VDukqx4E5G0PA?key=dVh2QXp4aVRxUmpleVJrWTBJTld1QXB0MzBNOFJB' },
  { title: 'Celebrations of Remarkable Achievement in Admissions of AP EAPCET 2026', date: 'August 13, 2026', year: 2026, link: 'https://photos.google.com/share/AF1QipOau71Q74yxB1523N2s3o8frrKECBgweDZttE9jxvhl187xPv9CSrBQAVChN_je8w?key=TUw2OEJ6WVBmY21NNmVpZDg0cGVaYTZLeGdJSUx3' },
  { title: 'Celebrations of International Yoga Day 2026', date: 'June 21, 2026', year: 2026, link: 'https://photos.google.com/share/AF1QipO7UiK_TwuZsP7lYi-hPH5hnVczktU4jPVvKJNSx7YG6qf8dDD4IIcTTqMJNSoVkg?key=ODJRRFhTc1h6MmFyT09TX3B0cFhmYWQzdndmVDBR' },
  { title: 'Celebrations of World Environment Day 2026', date: 'June 5, 2026', year: 2026, link: 'https://photos.google.com/share/AF1QipNnZu9ZRjSeuXjfJlgklnIuj7ckGEf2GWMgWKol3MM1YKzAC1xh_c1TqevNeI3xsA?key=ZXlLSDZ0WjdhaGg3ZWtzQzRPcWU1cmlGQkFUeDBB' },
  { title: 'Signed MoU with Mahindra & Mahindra', date: 'March 9, 2026', year: 2026, link: 'https://photos.google.com/share/AF1QipM3saryVvRfxS-HmZ-fT253Eono47Nd-pXkQ5m9aAlULmtBU6LjCloGdK1XkP5DPg?key=WFdQTXlxNmVlRHFOZnFFaWc2b1R1ekZKXzdYelNB' },
  { title: 'Annual Day 2026 – Celebrations', date: 'March 7, 2026', year: 2026, link: 'https://photos.google.com/share/AF1QipNCSN5HovBKZFPZzJUoVvszrIh5rfsPz7_F3De65lti0FFOb2w5cdPwFP73zXPdEQ?key=QnR6eExmZHVyWGpTYkdnVk45cW5NRFFSMUpsWFpR' },
  { title: 'TECHNOVA 2026 – Valedictory', date: 'March 7, 2026', year: 2026, link: 'https://photos.google.com/share/AF1QipObyzciMC4Jt3bBQsPHqyL9-O1LtBWKea6cMAeOz0ZeaqUP3dBOwgh0l9SJU5jzoQ?key=cGN3aGJGWXFldmZtcWdadGlET1Z1WEk0eHBtM3h3' },
  { title: 'TECHNOVA 2026 – Culturals', date: 'March 6, 2026', year: 2026, link: 'https://photos.google.com/share/AF1QipMbhqnpiaWXZcdWjeh1oWCDvNzGV9_F76YNmCPiyCU4OBi7m6kcRB5I-CyXrE8pSQ?key=VU9sU2VqZ0d2Vlo1UzNjNHI3dzM5UW1abW9XVDFn' },
  { title: 'TECHNOVA 2026 – Events', date: 'March 6, 2026', year: 2026, link: 'https://photos.google.com/share/AF1QipPMoA4uE1RPQ-XleJ_Pnz5QbwQD5-USbnXyIGxvLeqvQVOuB6-A2D4iJRy5x5-nqA?key=eTRBSm1BaWJTQmd3NTh5WURoM25STEdibk4wQTJn' },
  { title: 'TECHNOVA 2026 – Inauguration', date: 'March 6, 2026', year: 2026, link: 'https://photos.google.com/share/AF1QipOXeVWodMh8grYXRuPryHvzVqzagLGsOcOe-llHm7TQZ9nwFSNiihYAwSPkznUDeQ?key=WUVRUkt1OUlZdDFmMzFEaVI1WThvdzhuTWQwRWF3' },
  { title: 'Celebration of Ethnic Day @ VWU', date: 'March 2, 2026', year: 2026, link: 'https://photos.google.com/share/AF1QipOvdiK9iOcu14VHYKU42075EPXvVEXGRD4sUqFtJjbLkAF1HFATSVQZCL2xByY6dg?key=dXR6aEkwdzJVWUNCRkNjNXF1by16bFc3T01PTTBR' },
  { title: 'Congratulations to Awardees of the Aegis Graham Bell Awards', date: 'March 1, 2026', year: 2026, link: 'https://photos.google.com/share/AF1QipMLbioZF-s__aUKvbqBy-swYpGZv6nzBh1C9dFspHwRbM4Iy2NcCvX0x6gXHWOgEg?key=dkQ3VmkyN0dyeFNMakQ2dUpWdWJodmJrWkpEcHNB' },
  { title: 'Team Ziba Racers – Five Awards @ mBAJA SAEINDIA 2026', date: 'February 25, 2026', year: 2026, link: 'https://photos.google.com/share/AF1QipP9d5_dluQ5gLuL61LIcy0PAeYJ1hY-CwuzCIj8lXlw_LDP_MLT_ztmYy3u2YHxCQ?key=SmRqNC1PRGExOVZCeWdVcUd6LXlQOHhtTm1sZ29B' },
  { title: 'Chart Presentation on "Drug Free Environment" @ EAGLE Club', date: 'February 11, 2026', year: 2026, link: 'https://photos.google.com/share/AF1QipNTG0aM4-CbP4BIHwg1bf-oESTrgS2zDoSUsPTnhqlfDjBAEhN8f-5LSwh4uJOP8Q?key=Y2dFcDBKMjNlUDgzLWFoV25CSkhLUnV2dWVfanFn' },
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
