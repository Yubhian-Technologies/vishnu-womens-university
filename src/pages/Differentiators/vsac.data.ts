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
  // Array of { cells } objects rather than a plain string[][] because
  // Firestore rejects arrays nested directly inside arrays (the admin
  // editor's save() writes this whole object straight to Firestore).
  rows: { cells: string[] }[];
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
  heroCategory: 'RESEARCH & SPECIALISED LABS',
  heroTitle: 'Vishnu Space Application Center (VSAC)',
  heroSubtitle:
    'Connecting students with space technology through satellite tracking, CubeSat design, High-Altitude Balloon payload development, and hands-on ground-station operations.',

  aboutTitle: 'ABOUT VSAC',
  paragraphs: [
    'The Vishnu Space Application Center (VSAC), established in the Department of Electronics and Communication Engineering at Shri Vishnu Engineering College for Women, is a dedicated platform for experiential learning, research, and skill development in space technology. Developed in collaboration with Dhruva Space Private Limited, the Centre connects academic learning with practical applications in satellite communication and space systems.',
    'At the heart of VSAC is an S-band ground station equipped with a 3-metre parabolic mesh reflector antenna operating in the 2200–2290 MHz frequency range. The facility enables students and faculty to receive, decode, and analyse satellite data while developing an understanding of satellite tracking, communication systems, and ground-station operations.',
    'The Centre also supports learning in CubeSat design and development and High-Altitude Balloon payload experimentation, enabling students to move beyond theoretical study and engage with real engineering challenges. Through training, projects, research, and industry interaction, VSAC creates opportunities for students to explore emerging areas of space technology and develop relevant technical and problem-solving skills.',
  ],

  visionTitle: 'Our Vision',
  vision:
    'To foster a vibrant centre for learning, research, and innovation in satellite and space technologies, enabling students to contribute meaningfully to the evolving space ecosystem.',

  missionTitle: 'Our Mission',
  mission: [
    'Empower students with practical knowledge and experience in satellite communication, tracking, CubeSat systems, and related space technologies.',
    'Create opportunities for project-based learning, experimentation, research, and interdisciplinary collaboration.',
    'Provide students with mentorship, technical resources, and industry exposure to strengthen their readiness for emerging careers in the space sector.',
    'Build an inclusive learning environment that encourages curiosity, innovation, problem-solving, and sustained engagement with space science and engineering.',
  ],

  objectivesTitle: 'Objectives',
  objectives: [
    'Acquire, decode, analyse, and interpret satellite data for academic learning and research.',
    'Provide practical training in satellite tracking, ground-station operations, CubeSat development, and related communication technologies.',
    'Facilitate collaborative projects with industry, research organisations, and space-sector partners.',
    'Encourage research aimed at improving satellite communication, tracking, data interpretation, and associated technologies.',
    'Inspire students to pursue advanced study, research, entrepreneurship, and careers related to space technology.',
    'Provide relevant technical exposure, including HAM radio communication and Morse code, where applicable to programme activities.',
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
      title: 'One-Week Training Programme on HAM Radio and Morse Code',
      paragraphs: [
        'From 17–23 July 2023, the Department of Electronics and Communication Engineering organised a one-week training programme on HAM Radio and Morse Code for VSAC students and faculty.',
        'The programme introduced participants to the fundamentals of amateur radio communication, operating practices, and Morse code. Through guided sessions and hands-on exposure, participants gained practical insight into radio communication systems and their relevance to satellite and space-related applications.',
        'Seven faculty members and 28 students participated in the programme.',
      ],
      table: {
        headers: ['S.No', 'Name', 'Designation'],
        rows: [
          { cells: ['1', 'Ratikanta Sahoo', 'Asst. Prof'] },
          { cells: ['2', 'K Padma Vasavi', 'Prof'] },
          { cells: ['3', 'S. Hanumantha Rao', 'Prof'] },
          { cells: ['4', 'D Ramesh Varma', 'Asst. Prof'] },
          { cells: ['5', 'Venkata Subbarao Mandava', 'Assoc. Prof'] },
          { cells: ['6', 'Grandhi Challa Ram', 'Asst. Prof'] },
          { cells: ['7', 'Narasimharao Peyyala', 'Asst. Prof'] },
          { cells: ['8', 'Komatlapalli Padma Satya Sri', 'Student'] },
          { cells: ['9', 'Simhadri Likitha Sai Durga', 'Student'] },
          { cells: ['10', 'Vijaya Durga Manne', 'Student'] },
          { cells: ['11', 'Geetha Sree Kondeti', 'Student'] },
          { cells: ['12', 'Kallagunta Siva Gayathri', 'Student'] },
          { cells: ['13', 'Munnangi Deepthi', 'Student'] },
          { cells: ['14', 'Ummadisetty Vaishnavi', 'Student'] },
          { cells: ['15', 'Gorre Sowmya Sri', 'Student'] },
          { cells: ['16', 'Ketha Poornima', 'Student'] },
          { cells: ['17', 'Penke Deepthi Sri Kavya', 'Student'] },
          { cells: ['18', 'S.S. Sriranga Nayaki', 'Student'] },
          { cells: ['19', 'Reguri Naga Sai Sireesha', 'Student'] },
          { cells: ['20', 'Palaparthi Dwarka', 'Student'] },
          { cells: ['21', 'Taluri Mary Suvarna', 'Student'] },
          { cells: ['22', 'Jakkampudi Jaitra Manavi', 'Student'] },
          { cells: ['23', 'Rapolu Keerthi Sri', 'Student'] },
          { cells: ['24', 'Shaik Nazeema Begum', 'Student'] },
          { cells: ['25', 'Yerramsetti Priyusha Madhavi', 'Student'] },
          { cells: ['26', 'Jaddu Santha Kumari', 'Student'] },
          { cells: ['27', 'D. Anusha', 'Student'] },
          { cells: ['28', 'M. Naveena', 'Student'] },
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
          { cells: ['1', 'Dr. S. Hanumantha Rao', 'Prof'] },
          { cells: ['2', 'Dr. Ratikanta Sahoo', 'Assoc. Prof'] },
          { cells: ['3', 'Mr. Grandhi Challa Ram', 'Asst. Prof'] },
          { cells: ['4', 'Dr. Venkata Subbarao Mandava', 'Assoc. Prof'] },
          { cells: ['5', 'K Padma Vasavi', 'Prof'] },
          { cells: ['6', 'D Ramesh Varma', 'Asst. Prof'] },
          { cells: ['7', 'Narasimharao Peyyala', 'Asst. Prof'] },
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
          { cells: ['1', 'Komatlapalli Padma Satya Sri'] },
          { cells: ['2', 'Simhadri Likitha Sai Durga'] },
          { cells: ['3', 'Vijaya Durga Manne'] },
          { cells: ['4', 'Geetha Sree Kondeti'] },
          { cells: ['5', 'Kallagunta Siva Gayathri'] },
          { cells: ['6', 'Munnangi Deepthi'] },
          { cells: ['7', 'Ummadisetty Vaishnavi'] },
          { cells: ['8', 'Gorre Sowmya Sri'] },
          { cells: ['9', 'Ketha Poornima'] },
          { cells: ['10', 'Penke Deepthi Sri Kavya'] },
          { cells: ['11', 'Sami. Susmitha Sriranga Nayaki'] },
          { cells: ['12', 'Reguri Naga Sai Sireesha'] },
          { cells: ['13', 'Palaparthi Dwarka'] },
          { cells: ['14', 'Taluri Mary Suvarna'] },
          { cells: ['15', 'Jakkampudi Jaitra Manavi'] },
          { cells: ['16', 'Rapolu Keerthi Sri'] },
          { cells: ['17', 'Shaik Nazeema Begum'] },
          { cells: ['18', 'Yerramsetti Priyusha Madhavi'] },
          { cells: ['19', 'Jaddu Santha Kumari'] },
          { cells: ['20', 'D. Anusha'] },
          { cells: ['21', 'M. Naveena'] },
        ],
      },
      secondParagraph:
        'The training session by the faculty members Dr. Ratikanta Sahoo and Mr. G. Challa Ram for the HAM radio license exam during 20th to 25th Feb, 2024 was a comprehensive and engaging experience for all participating students. Throughout the program, students were introduced to fundamental concepts of amateur radio, including frequency bands, modulation techniques, study guides, and practice exams, to ensure a well-rounded preparation.',
      secondTable: {
        headers: ['Sl. No', 'Name of the Student', 'Roll No', 'Section', 'Batch No'],
        rows: [
          { cells: ['1', 'B. Jyothi Sri', '23B05A0402', 'II ECE-A', 'Batch-1'] },
          { cells: ['2', 'Dasari Kiranmai', '23B05A0403', 'II ECE-A', ''] },
          { cells: ['3', 'D. Lalitha', '23B05A0404', 'II ECE-A', ''] },
          { cells: ['4', 'Guggella Sai Sreeja', '23B05A0405', 'II ECE-A', ''] },
          { cells: ['5', 'Kandrekula Lakshmi Nandini', '23B05A0410', 'II ECE-B', ''] },
          { cells: ['6', 'Lakku Abhinayasri', '23B05A0411', 'II ECE-B', ''] },
          { cells: ['7', 'Matta Lahari', '23B05A0412', 'II ECE-B', ''] },
          { cells: ['8', 'P. Munni Bharathi', '23B05A0414', 'II ECE-B', ''] },
          { cells: ['9', 'Thirupathi. Dharmila', '23B05A0418', 'II ECE-B', ''] },
          { cells: ['10', 'Veipula. Srivalli', '23B05A0419', 'II ECE-B', ''] },
          { cells: ['11', 'Bolla Tiruselvi', '22B01A0408', 'II ECE-A', 'Batch-2'] },
          { cells: ['12', 'Challa Lakshmi Sindhuja', '22B01A0409', 'II ECE-A', ''] },
          { cells: ['13', 'Ch. Gnanasri', '22B01A0413', 'II ECE-A', ''] },
          { cells: ['14', 'Gariganti Dhatri Gayatri', '22B01A0425', 'II ECE-A', ''] },
          { cells: ['15', 'G. Pavana Sri Aaritha', '22B01A0431', 'II ECE-A', ''] },
          { cells: ['16', 'Padma Sri', '22B01A0439', 'II ECE-A', ''] },
          { cells: ['17', 'Maka. Mouvya Sree', '22B01A0461', 'II ECE-B', ''] },
          { cells: ['18', 'Nallam Manaswini Sai Saranya', '22B01A0478', 'II ECE-B', ''] },
          { cells: ['19', 'Potu Pranathi Priya', '22B01A0488', 'II ECE-B', ''] },
          { cells: ['20', 'Sabbarapu Devi Sri Ramya', '22B01A0493', 'II ECE-B', ''] },
          { cells: ['21', 'Shaik Hafiza', '22B01A0496', 'II ECE-B', ''] },
          { cells: ['22', 'S. Tripura', '22B01A0498', 'II ECE-B', ''] },
          { cells: ['23', 'Vadali. Susmitha Sri Ramani', '22B01A04A8', 'II ECE-B', ''] },
          { cells: ['24', 'Vegi Hema Sri Lakshmi', '22B01A04B4', 'II ECE-B', ''] },
          { cells: ['25', 'V. Alekhya', '22B01A04C0', 'II ECE-B', ''] },
        ],
      },
    },
  ] as TrainingResearchItem[],

  industryCollaboration: {
    title: 'Industry Collaboration with Dhruva Space',
    paragraphs: [
      'VSAC collaborates with Dhruva Space Private Limited to strengthen student exposure to satellite communication, ground-station systems, CubeSat technologies, and the wider space-engineering ecosystem.',
      'The collaboration supports the Centre in connecting academic learning with industry practices, providing students with opportunities to understand real-world systems, emerging technologies, and professional pathways within the space sector.',
      'Through such industry engagement, VSAC aims to strengthen experiential learning, technical capability, research orientation, and innovation among students.',
    ],
  },

  socialImpacts: {
    title: 'Extending the Impact of Space Education',
    bullets: [
      {
        lead: 'Empowering Women in STEM',
        text: 'VSAC gives women engineering students direct exposure to satellite communication, tracking systems, CubeSat development, and space-related technologies, helping broaden participation in emerging STEM fields.',
      },
      {
        lead: 'Advancing Space Education',
        text: 'Training programmes, laboratory activities, projects, and demonstrations help students connect classroom concepts with practical applications in satellite and communication technologies.',
      },
      {
        lead: 'Building Awareness and Curiosity',
        text: 'The Centre encourages students to explore space science, satellite systems, radio communication, and related technologies beyond the conventional curriculum.',
      },
      {
        lead: 'Encouraging Innovation',
        text: 'Hands-on experimentation and industry interaction provide students with opportunities to investigate problems, develop ideas, and undertake technology-oriented projects.',
      },
      {
        lead: 'Supporting Research',
        text: 'Satellite data, communication systems, and associated facilities create opportunities for faculty and students to pursue applied research and interdisciplinary exploration.',
      },
    ],
  },

  learningOutcomes: {
    title: 'Learning Outcomes',
    bullets: [
      {
        lead: 'Hands-on Technical Experience',
        text: 'Students gain practical exposure to satellite tracking, ground-station operations, communication systems, CubeSat concepts, and payload-related activities.',
      },
      {
        lead: 'Applied Data Skills',
        text: 'Working with satellite signals and data helps students understand acquisition, decoding, interpretation, and analysis in real-world contexts.',
      },
      {
        lead: 'Research Exposure',
        text: 'The Centre provides an environment in which students and faculty can explore projects and research related to communication, satellite systems, data processing, and associated technologies.',
      },
      {
        lead: 'Industry Awareness',
        text: 'Interaction with space-sector partners helps students understand contemporary technologies, professional practices, and emerging opportunities in the industry.',
      },
      {
        lead: 'Career-oriented Skill Development',
        text: 'Projects, technical training, mentorship, and laboratory experience strengthen problem-solving, experimentation, teamwork, and specialised technical competencies.',
      },
    ],
  },

  galleryTitle: 'VSAC in Action',
  galleryCaption: 'Satellite Ground Station • Training • Projects • Student Exploration',

  cta: {
    title: 'There’s More to Explore',
    subtitle:
      'From space technology and advanced research to industry-led learning and innovation, discover more places at VWU where curiosity becomes capability.',
    btn1: 'Explore All Differentiators',
    btn2: 'Discover Academics',
    btn3: 'Apply to VWU',
  },
};
