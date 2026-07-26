// Rich hardcoded content for the Vishnu Space Application Center (VSAC)
// differentiator page (slug: vsac) — overrides that item's generic
// Firestore intro/about text in DifferentiatorDetail.tsx.
export interface VsacMember {
  name: string;
  designation?: string;
  email?: string;
  mobile?: string;
  callSign?: string;
  interests?: string;
  profileLink?: string;
}

export interface SimpleTable {
  headers: string[];
  rows: string[][];
}

export interface TrainingResearchItem {
  title: string;
  paragraphs: string[];
  table?: SimpleTable;
  secondParagraph?: string;
  secondTable?: SimpleTable;
}

export interface CollaborationBullet {
  lead: string;
  text: string;
}

export interface CollaborationItem {
  title: string;
  paragraphs?: string[];
  intro?: string;
  bullets?: CollaborationBullet[];
  isGallery?: boolean;
}

export const vsac = {
  paragraphs: [
    'The Vishnu Space Application Center–VSAC (call sign VU2VEP), established in the Department of Electronics and Communication Engineering at Shri Vishnu Engineering College for Women, Bhimavaram, is a collaborative effort between Sri Vishnu Educational Society (SVES) and Dhruva Space Private Limited. The initiative began with the signing of a Memorandum of Understanding (MOU) between the two entities, facilitated by the presence of esteemed leaders including Sri K. Phani Raj, Chairman of SVES, and Sri Ravikrishnan Rajagopal, Vice Chairman of SVES.',
    'At its core, the Vishnu Space Application Center serves as an S-band ground station dedicated to tracking data from satellites operating under the S-band frequency. The Lab possesses a state-of-the-art 3-meter parabolic mesh reflector antenna with an operating frequency range of 2200-2290 MHz and a gain of 35.4 dBi, ensuring precise and efficient satellite tracking capabilities. Along with the hardware setup, the advanced tracking software helps students and faculty efficiently decode and encrypt the data received from the antenna. The center is empowering students and faculty to design and launch CubeSats, none satellites that hold immense potential for scientific research and exploration endeavours.',
    'In addition to CubeSat design and satellite tracking, the Vishnu Space Application Center offers students the opportunity to participate in the design of payloads for High Altitude Balloon (HAB) experiments. This hands-on experience exposes students to real-world challenges and encourages innovative problem-solving in the pursuit of scientific discovery.',
  ],
  vision: 'To pioneer advancements in space technology and foster a culture of innovation and excellence in satellite tracking and CubeSat design at the Vishnu Space Application Center, led by the students of Shri Vishnu Engineering College for Women.',
  mission: [
    'Empower students to lead pioneering advancements in space technology.',
    'Create an environment of innovation and excellence in satellite tracking and CubeSat design.',
    'Provide students with the resources and mentorship needed to excel in satellite technology research and development.',
    'Foster a collaborative and inclusive community that drives continuous progress and contributes significantly to the field of space exploration.',
  ],
  objectives: [
    'Acquire, decode, and analyse satellite data to contribute to scientific research and space exploration efforts.',
    'Provide hands-on training and practical experience for students in satellite tracking techniques and CubeSat design.',
    'Collaborate with industry partners and space agencies to enhance knowledge sharing and technological advancements.',
    'Conduct research and development projects aimed at improving satellite communication and tracking systems.',
    'Inspire and support students to pursue careers in fields related to space technology and exploration.',
    'To attain HAM radio license for students and knowledge on Morse code.',
  ],
  team: {
    inCharge: [
      {
        name: 'Dr. Ratikanta Sahoo',
        designation: 'Associate Professor',
        email: 'rsahoo@svecw.edu.in',
        mobile: '8339856756',
        callSign: 'VU2TEU',
        interests: 'RF & Microwave',
        profileLink: 'https://svecw.irins.org/',
      },
      {
        name: 'G. Challa Ram',
        designation: 'Assistant Professor',
        email: 'challaram.grandhi@svecw.edu.in',
        mobile: '8019129124',
        callSign: 'VU2AXW',
        interests: 'THz, RF & Microwave',
        profileLink: 'https://svecw.irins.org/',
      },
    ] as VsacMember[],
    facultyMembers: [
      {
        name: 'Dr. K. Padma Vasavi',
        designation: 'Professor & HoD',
        email: 'hodece@svecw.edu.in',
        mobile: '9441414651',
        callSign: 'VU2TTM',
        interests: 'Digital Image Processing, VLSI.',
        profileLink: 'https://svecw.irins.org/',
      },
      {
        name: 'Dr. M. V. Subba Rao',
        designation: 'Associate Professor',
        email: 'mvsubbarao@svecw.edu.in',
        mobile: '9160444150',
        callSign: 'VU2AZN',
        interests: 'Machine Learning & Deep Learning.',
        profileLink: 'https://svecw.irins.org/',
      },
      {
        name: 'Dr. S. Hanumantha Rao',
        designation: 'Professor',
        email: 'hanumanth.s@svecw.edu.in',
        mobile: '9849782622',
        callSign: 'VU2AZM',
        interests: 'RF & Microwave',
        profileLink: 'https://svecw.irins.org/',
      },
      {
        name: 'Mr. P. Narsimha Rao',
        designation: 'Technician',
        email: 'narasimharaopeyyala@svecw.edu.in',
        mobile: '9160444150',
        callSign: 'VU3NLZ',
      },
      {
        name: 'D. Ramesh Varma',
        designation: 'Assistant Professor',
        email: 'varmaramesh422@svecw.edu.in',
        mobile: '9963630435',
        callSign: 'VU2AZU',
        interests: 'RF & Microwave',
        profileLink: 'https://svecw.irins.org/',
      },
    ] as VsacMember[],
  },
  trainingResearch: [
    {
      title: 'One week training programme on Ham Radio Morse Code',
      paragraphs: [
        'During 17th-23rd July, 2023, the Department of Electronics and Communication Engineering organized a one-week training programme on "Ham Radio Morse Code" for students and faculty at VSAC. This initiative aimed to provide faculty members seeking to explore HAM radio knowledge with hands-on experience and training in Morse code. The programme covered basic concepts of communication protocols as well as Morse key transmission and reception techniques. A total of 7 faculty members and 28 students participated in the training programme, enriching their understanding of HAM radio technology.',
      ],
      table: {
        headers: ['S.No', 'Name', 'Designation'],
        rows: [
          ['1', 'Ratikanta Sahoo', 'Asst. Prof'],
          ['2', 'K Padma Vasavi', 'Prof'],
          ['3', 'S. Hanumantha Rao', 'Prof'],
          ['4', 'D Ramesh Varma', 'Asst. Prof'],
          ['5', 'Venkata Subbarao Mandava', 'Assoc. Prof'],
          ['6', 'Grandhi Challa Ram', 'Asst. Prof'],
          ['7', 'Narasimharao Peyyala', 'Asst. Prof'],
          ['8', 'Komatlapalli Padma Satya Sri', 'Student'],
          ['9', 'Simhadri Likitha Sai Durga', 'Student'],
          ['10', 'Vijaya Durga Manne', 'Student'],
          ['11', 'Geetha Sree Kondeti', 'Student'],
          ['12', 'Kallagunta Siva Gayathri', 'Student'],
          ['13', 'Munnangi Deepthi', 'Student'],
          ['14', 'Ummadisetty Vaishnavi', 'Student'],
          ['15', 'Gorre Sowmya Sri', 'Student'],
          ['16', 'Ketha Poornima', 'Student'],
          ['17', 'Penke Deepthi Sri Kavya', 'Student'],
          ['18', 'S.S. Sriranga Nayaki', 'Student'],
          ['19', 'Reguri Naga Sai Sireesha', 'Student'],
          ['20', 'Palaparthi Dwarka', 'Student'],
          ['21', 'Taluri Mary Suvarna', 'Student'],
          ['22', 'Jakkampudi Jaitra Manavi', 'Student'],
          ['23', 'Rapolu Keerthi Sri', 'Student'],
          ['24', 'Shaik Nazeema Begum', 'Student'],
          ['25', 'Yerramsetti Priyusha Madhavi', 'Student'],
          ['26', 'Jaddu Santha Kumari', 'Student'],
          ['27', 'D. Anusha', 'Student'],
          ['28', 'M. Naveena', 'Student'],
        ],
      },
    },
    {
      title: 'Training programme on Antenna Calibration',
      paragraphs: [
        'On 4th April 2024, the training session on antenna calibration in the S-band ground station was a highly informative and hands-on experience for the faculty members by Dhruva Space Private Limited, Hyderabad. The primary objective of the training was to equip faculty members with the knowledge and skills necessary to accurately calibrate antennas used for S-band communication. The session began with an overview of the importance of antenna calibration in ensuring optimal performance and reliability of communication systems, especially in the S-band frequency range.',
      ],
      table: {
        headers: ['S.No', 'Name', 'Designation'],
        rows: [
          ['1', 'Dr. S. Hanumantha Rao', 'Prof'],
          ['2', 'Dr. Ratikanta Sahoo', 'Assoc. Prof'],
          ['3', 'Mr. Grandhi Challa Ram', 'Asst. Prof'],
          ['4', 'Dr. Venkata Subbarao Mandava', 'Assoc. Prof'],
          ['5', 'K Padma Vasavi', 'Prof'],
          ['6', 'D Ramesh Varma', 'Asst. Prof'],
          ['7', 'Narasimharao Peyyala', 'Asst. Prof'],
        ],
      },
    },
    {
      title: 'Students Benefited',
      paragraphs: [
        'On July 31, 2023, the Wireless Planning and Coordination (WPC) Wing conducted the HAM radio exam at Shri Vishnu Engineering College for Women. The exam aimed to assess participants knowledge and proficiency in this field. A total of 21 students successfully qualified for the HAM radio license exam, demonstrating their dedication and proficiency in radio communication. The exam covered various aspects of amateur radio, including regulations, operating procedures, technical knowledge, and emergency communication protocols.',
      ],
      table: {
        headers: ['No', 'Name'],
        rows: [
          ['1', 'Komatlapalli Padma Satya Sri'],
          ['2', 'Simhadri Likitha Sai Durga'],
          ['3', 'Vijaya Durga Manne'],
          ['4', 'Geetha Sree Kondeti'],
          ['5', 'Kallagunta Siva Gayathri'],
          ['6', 'Munnangi Deepthi'],
          ['7', 'Ummadisetty Vaishnavi'],
          ['8', 'Gorre Sowmya Sri'],
          ['9', 'Ketha Poornima'],
          ['10', 'Penke Deepthi Sri Kavya'],
          ['11', 'Sami. Susmitha Sriranga Nayaki'],
          ['12', 'Reguri Naga Sai Sireesha'],
          ['13', 'Palaparthi Dwarka'],
          ['14', 'Taluri Mary Suvarna'],
          ['15', 'Jakkampudi Jaitra Manavi'],
          ['16', 'Rapolu Keerthi Sri'],
          ['17', 'Shaik Nazeema Begum'],
          ['18', 'Yerramsetti Priyusha Madhavi'],
          ['19', 'Jaddu Santha Kumari'],
          ['20', 'D. Anusha'],
          ['21', 'M. Naveena'],
        ],
      },
      secondParagraph: 'The training session by the faculty members Dr. Ratikanta Sahoo and Mr. G. Challa Ram for the HAM radio license exam during 20th to 25th Feb, 2024 was a comprehensive and engaging experience for all participating students. Throughout the program, students were introduced to fundamental concepts of amateur radio, including frequency bands, modulation techniques, study guides, and practice exams, to ensure a well-rounded preparation. Additionally, interactive sessions and hands-on exercises on Morse Code provided students with practical experience. As a result of diligent study and regular practice, students demonstrated significant progress in their understanding of HAM radio principles and regulations.',
      secondTable: {
        headers: ['Sl. No', 'Name of the Student', 'Roll No', 'Section', 'Batch No'],
        rows: [
          ['1', 'B. Jyothi Sri', '23B05A0402', 'II ECE-A', 'Batch-1'],
          ['2', 'Dasari Kiranmai', '23B05A0403', 'II ECE-A', ''],
          ['3', 'D. Lalitha', '23B05A0404', 'II ECE-A', ''],
          ['4', 'Guggella Sai Sreeja', '23B05A0405', 'II ECE-A', ''],
          ['5', 'Kandrekula Lakshmi Nandini', '23B05A0410', 'II ECE-B', ''],
          ['6', 'Lakku Abhinayasri', '23B05A0411', 'II ECE-B', ''],
          ['7', 'Matta Lahari', '23B05A0412', 'II ECE-B', ''],
          ['8', 'P. Munni Bharathi', '23B05A0414', 'II ECE-B', ''],
          ['9', 'Thirupathi. Dharmila', '23B05A0418', 'II ECE-B', ''],
          ['10', 'Veipula. Srivalli', '23B05A0419', 'II ECE-B', ''],
          ['11', 'Bolla Tiruselvi', '22B01A0408', 'II ECE-A', 'Batch-2'],
          ['12', 'Challa Lakshmi Sindhuja', '22B01A0409', 'II ECE-A', ''],
          ['13', 'Ch. Gnanasri', '22B01A0413', 'II ECE-A', ''],
          ['14', 'Gariganti Dhatri Gayatri', '22B01A0425', 'II ECE-A', ''],
          ['15', 'G. Pavana Sri Aaritha', '22B01A0431', 'II ECE-A', ''],
          ['16', 'Padma Sri', '22B01A0439', 'II ECE-A', ''],
          ['17', 'Maka. Mouvya Sree', '22B01A0461', 'II ECE-B', ''],
          ['18', 'Nallam Manaswini Sai Saranya', '22B01A0478', 'II ECE-B', ''],
          ['19', 'Potu Pranathi Priya', '22B01A0488', 'II ECE-B', ''],
          ['20', 'Sabbarapu Devi Sri Ramya', '22B01A0493', 'II ECE-B', ''],
          ['21', 'Shaik Hafiza', '22B01A0496', 'II ECE-B', ''],
          ['22', 'S. Tripura', '22B01A0498', 'II ECE-B', ''],
          ['23', 'Vadali. Susmitha Sri Ramani', '22B01A04A8', 'II ECE-B', ''],
          ['24', 'Vegi Hema Sri Lakshmi', '22B01A04B4', 'II ECE-B', ''],
          ['25', 'V. Alekhya', '22B01A04C0', 'II ECE-B', ''],
        ],
      },
    },
  ] as TrainingResearchItem[],
  collaborations: [
    {
      title: 'Dhruva Space Private Limited, Hyderabad',
      paragraphs: [
        'Dhruva Space Private Limited is a National Award-winning space technology company focused on building full-stack space engineering solutions. The company is based out of Hyderabad, India, and is actively building application-agnostic satellite platforms. Dhruva Space offers Satellites coupled with Earth stations and Launch services as an integrated solution or individually as a technology solution to power Space-based applications, on Earth and beyond. The founding team are business & technology leaders, who formerly worked with Exseed Space, ams AG, Cisco, and KPMG. The whole team sees close to 80 members, from a variety of backgrounds: engineering, business development, research, marketing, legal, and more.',
      ],
    },
    {
      title: 'Social Impacts',
      intro: 'The Vishnu Space Application Center at Shri Vishnu Engineering College for Women has several social impacts:',
      bullets: [
        { lead: 'Empowering Women in STEM:', text: ' By offering hands-on experience and training in satellite technology and space exploration, the Lab empowers women to pursue careers in STEM fields.' },
        { lead: 'Advancing Space Education:', text: ' The Lab contributes to advancing space education within the local community and beyond. By engaging students and faculty in satellite tracking, CubeSat design, and other space-related activities, the Lab inspires interest and enthusiasm for space exploration among young learners and the wider community.' },
        { lead: 'Community Engagement and Awareness:', text: ' The activities and initiatives of the Lab raise awareness about space technology and its applications among the local community. This enhances public understanding of the significance of space research and its impact on various aspects of modern life, including communication, weather forecasting, disaster management, and more.' },
        { lead: 'Encouraging Innovation and Entrepreneurship:', text: ' Through collaboration with industry partners and space agencies, the Lab fosters innovation and entrepreneurship in space technology. This can lead to the development of new technologies, startups, and solutions that benefit society and contribute to economic growth.' },
        { lead: 'Scientific Advancement and Research:', text: ' The Lab focus on acquiring, analyzing, and applying satellite data for scientific research contributes to broader scientific knowledge and understanding. This knowledge can be used to address global challenges such as climate change, natural disasters, and environmental monitoring.' },
      ],
    },
    {
      title: 'Outcomes',
      intro: 'The Vishnu Space Application Center at Shri Vishnu Engineering College for Women, established through collaboration with Dhruva Space Private Limited, is driving significant outcomes in space technology education.',
      bullets: [
        { lead: 'Hands-on Learning:', text: ' The VSAC offers students practical experience in satellite tracking techniques, CubeSat design, and payload development. Through hands-on activities and projects, students gain valuable skills and insights into space technology and engineering.' },
        { lead: 'Scientific Research Contribution:', text: ' The Lab acquires, decodes, and analyzes satellite data, contributing to scientific research and space exploration efforts. By studying the data received from satellite tracking, students and faculty advance knowledge in space-related phenomena and satellite communication.' },
        { lead: 'Technological Advancements:', text: ' Collaborating with industry partners and space agencies, the Lab drives technological advancements in satellite communication and tracking systems. This collaboration enhances knowledge sharing and promotes innovation in space technology.' },
        { lead: 'Skill Development:', text: ' The Lab empowers students to pursue careers in fields related to space technology and exploration by providing resources, mentorship, and hands-on training. Students develop technical expertise and problem-solving skills essential for success in the space industry.' },
        { lead: 'Community Engagement:', text: ' Engaging the community in discussions about space exploration, the Lab raises awareness and interest in space science. By fostering dialogue and collaboration, the Lab contributes to a broader understanding of space-related topics and their societal impact.' },
      ],
    },
    {
      title: 'Gallery',
      isGallery: true,
    },
  ] as CollaborationItem[],
};
