// Rich hardcoded content for the Assistive Technology Lab (ATL)
// differentiator page (slug: assistive-tech-lab) — overrides that item's
// generic Firestore intro/about text in DifferentiatorDetail.tsx.
export interface AtlMember {
  name: string;
  designation?: string;
  email?: string;
  mobile?: string;
  interests?: string;
  profileLink?: string;
}

export interface AtlSimpleTable {
  headers: string[];
  rows: string[][];
}

export interface AtlProject {
  title: string;
  description: string;
}

export interface AtlYearTraining {
  yearLabel: string;
  bridgeCourse: AtlSimpleTable;
  projects: AtlProject[];
}

export interface AtlBatchRow {
  regdNo: string;
  name: string;
  department: string;
}

export interface AtlBatchGroup {
  batchNo: number;
  batchName?: string;
  mentors?: string;
  selectedProject?: string;
  members: AtlBatchRow[];
}

export interface AtlTestimonial {
  quote: string;
  author: string;
}

export interface AtlSeminarYear {
  year: string;
  items: string[];
}

export type AtlBlock =
  | { type: 'meta'; items: { label: string; value: string }[] }
  | { type: 'paragraph'; text: string }
  | { type: 'heading'; text: string }
  | { type: 'bullets'; items: string[] }
  | { type: 'boldBullets'; items: { lead: string; text: string }[] }
  | { type: 'numbered'; items: string[] }
  | { type: 'table'; title?: string; table: AtlSimpleTable };

export interface AtlActivity {
  title: string;
  blocks: AtlBlock[];
}

export interface AtlOutcomeEvent {
  title: string;
  headers: string[];
  batches: AtlBatchGroup[];
  simpleTable?: AtlSimpleTable;
}

export const assistiveTechLab = {
  paragraphs: [
    'The Assistive Technology Lab (ATL) in Shri Vishnu Engineering College for Women (SVECW), Bhimavaram, W. G. Dt, Andhra Pradesh is a vision of Sri K. V. Vishnu Raju, the Chairman of Sri Vishnu Educational Society, to utilize the skills of every engineering department of the college for the development of Assistive Technology. It was set up in 2009 and works in collaboration with University of Massachusetts (UMass), Lowell, USA.',
    'Assistive Technology Lab (ATL) works for a very unique and a noble cause of designing projects by the students of SVECW to benefit the differently-abled. This is a small but definite step to mainstream people with disabilities into society. Professor Alan Rux, founder of the Assistive Technology Program at the University of Massachusetts, Lowell, USA, visits SVECW every year in the month of July and guides students in developing projects related to Assistive Technology.',
    'ATL provides a rich, authentic learning experience for the students. It is a real time platform for the students to learn and experience engineering design process, to apply their academic skills in a real-world context, and to develop important workplace skills not usually taught in the classroom. Each project team has to brainstorm and analyse alternative design solutions, and justify their chosen design; they must work within a budget, analyze the cost of various design alternatives, and in the end, make a presentation outlining their design work and final solution.',
    'ATL engages students in real service learning, which not only benefits members of their local communities, but also helps students distinguish themselves among their peers in their future endeavours.',
  ],
  // No Vision statement was legible/present under the "Vision:" heading in
  // the source screenshot (it went straight from "Vision:" to "Mission:"
  // with no body text) — left blank rather than invented.
  vision: '',
  mission: [
    'Collaborative projects and community partnerships at ATL nurture a sense of social responsibility among students and faculty, driving them to actively address societal challenges.',
    'By employing state-of-the-art engineering design principles, ATL develops assistive devices that address specific needs, thereby enhancing the overall quality of life for people with disabilities.',
    "ATL's encouragement of student and faculty involvement in competitions fosters a culture of innovation and excellence, driving participants to push the boundaries of their capabilities.",
  ],
  objectives: [
    'Encourage students to collaborate across disciplines to tackle real-world societal issues.',
    'Foster the creation of innovative, impactful, and affordable products.',
    'Promote global participation in competitions and hackathons to showcase student talent.',
  ],
  team: {
    dean: {
      name: 'Dr. K. Padma Vasavi',
      designation: 'Professor & HOD of ECE',
      email: 'hodece@svecw.edu.in',
      mobile: '9441414651',
      interests: 'Digital Image Processing, VLSI.',
      profileLink: 'https://svecw.irins.org/',
    } as AtlMember,
    inCharge: {
      name: 'D. Girish Kumar',
      designation: 'Assistant Professor',
      email: 'girishkumar.d@svecw.edu.in',
      mobile: '8500123609',
      interests: 'Digital Image Processing',
      profileLink: 'https://svecw.irins.org/profile/149596',
    } as AtlMember,
    facultyMembers: [
      {
        name: 'D. Ramesh Varma',
        designation: 'Assistant Professor',
        email: 'varmaramesh422@svecw.edu.in',
        mobile: '9963630435',
        interests: 'RF & Microwave',
        profileLink: 'https://svecw.irins.org/',
      },
      {
        name: 'G. Challa Ram',
        designation: 'Assistant Professor',
        email: 'challaram.grandhi@svecw.edu.in',
        mobile: '8019129124',
        interests: 'THz, RF & Microwave',
        profileLink: 'https://svecw.irins.org/',
      },
      {
        name: 'M. Hemalatha',
        designation: 'Assistant Professor',
        email: 'mhemalathaece@svecw.edu.in',
        mobile: '6302016121',
        interests: 'VLSI and Image Processing',
        profileLink: 'https://vidwan.inflibnet.ac.in/profile/474669',
      },
      {
        name: 'Siva Asapu',
        designation: 'Assistant Professor',
        email: 'asivaeee@svecw.edu.in',
        mobile: '9440800048',
        interests: 'Raspberry Pi controller based Projects',
        profileLink: 'https://vidwan.inflibnet.ac.in/profile/149718',
      },
      {
        name: 'Mahendra Chand Bade',
        designation: 'Assistant Professor',
        email: 'mahendrachandu.b@svecw.edu.in',
        mobile: '9949707102',
        interests: 'Grid connected PV system',
      },
      {
        name: 'Dr Anuj Rapaka',
        designation: 'Assistant Professor',
        email: 'anujcse@svecw.edu.in',
        mobile: '9493106914',
        interests: 'Machine Learning and Image Processing',
        profileLink: 'https://vidwan.inflibnet.ac.in/profile/149688',
      },
      {
        name: 'Mr. V.V. Rama Rao',
        designation: 'Assistant Professor',
        email: 'ramaraocse@svecw.edu.in',
        mobile: '9493106914',
        interests: 'Machine Learning',
      },
      {
        name: 'N. Rajasekhar',
        designation: 'Assistant Professor',
        email: 'nrajasekharme@svecw.edu.in',
        mobile: '94937 95865',
        interests: 'Surface enhancement of structural materials, Metal additive manufacturing and Friction stir welding.',
      },
    ] as AtlMember[],
  },
  trainingByYear: [
    {
      yearLabel: 'ATL Activities 2025-26',
      bridgeCourse: {
        headers: ['S. No.', 'Course', 'Facilitator', 'Department', 'Date', 'Venue'],
        rows: [
          ['1.', 'About ATL', 'Dr. K. Padma Vasavi', 'ECE', '29-07-2025', 'ATL LAB'],
          ['2.', 'Design Thinking and Innovation', 'Dr. D. Ramesh Varma', 'ECE', '30-07-2025', 'ATL LAB'],
          ['', 'Digital Electronics', 'Dr. G. Challaram', 'ECE', '31-07-2025', 'ATL LAB'],
          ['3', 'Arduino Programming', 'Mrs. M. Hema Latha, M. Prashanth Kumar, Ch. Santhosh', 'ECE', '01-08-2025, 02-08-2025', 'ATL LAB'],
          ['5.', 'Basics of Electronics', 'Mr. D. Girish Kumar', 'ECE', '04-08-2025', 'ATL LAB'],
          ['6.', 'Actuators, Batteries and Power Management', 'Dr. A. Siva, Mr. B. Mahendra Chand', 'EEE', '05-08-2025, 06-08-2025', 'ATL LAB'],
          ['7.', 'CAD for Packaging (2D CAD, 3D CAD)', 'Mrs. P. Lavanya, Mr. A.S.V. Prasad', 'CE, ME', '07-08-2025, 09-08-2025', 'ATL LAB'],
          ['8.', 'Product Development', 'Dr. K. Padma Vasavi', 'ECE', '11-08-2025', 'ATL LAB'],
          ['9.', 'Web Page Development', 'Mr. A. Nageswara Rao & Mr. T. Rajesh', 'CSE', '12-08-2025', 'ATL LAB'],
          ['10.', 'Mobile App Development', 'Mrs G Kalyani, Mr K. Ram Kumar', 'AI, IT', '13-08-2025', 'ATL LAB'],
        ],
      },
      projects: [
        { title: 'ECHOMAT', description: 'A kabaddi Game for Visually Challenged People.' },
        { title: 'PAGE VOICE', description: 'Convert text in page into voice for Visually Challenged People.' },
        { title: 'CURRENCY DETECTION', description: 'Detect currency notes to help visually Challenged People.' },
        { title: 'SPELLMATE', description: 'Interactive Spelling Game for visually challenged students.' },
        { title: 'BRAILLINK', description: 'Braille training for visually challenged students.' },
        { title: 'BRAILLE EASE', description: 'Refreshable Braille display.' },
        { title: 'EYENOVA', description: 'Object detection for visually Challenged people.' },
        { title: 'BAROVOICE', description: 'Barcode and QR Code reader for visually challenged people.' },
        { title: 'MEDI SENSE', description: 'Medicine name recognizer for visually challenged people.' },
        { title: 'BEEP BASE BALL', description: 'Beep Baseball game for visually challenged people.' },
        { title: 'EDUPLAY BOARD', description: 'Interactive board game for training Braille to visually challenged people.' },
      ] as AtlProject[],
    },
    {
      yearLabel: 'ATL Activities 2024-25',
      bridgeCourse: {
        headers: ['S. No.', 'Course', 'Facilitator', 'Department', 'Date', 'Venue'],
        rows: [
          ['1.', 'About ATL', 'Dr. K. Padma Vasavi', 'ECE', '11-7-2024', 'B-203'],
          ['2.', 'Design Thinking and Innovation', 'Dr. D. Ramesh Varma', 'ECE', '12-7-2024, 13-7-2024', 'B-203'],
          ['3.', 'Basics of Electronics', 'Mr. D. Gireesh Kumar', 'ECE', '15-7-2024', 'B-203'],
          ['4.', 'Digital Electronics', 'Mr. G. Challaram', 'ECE', '16-7-2024', 'B-203'],
          ['5.', 'Arduino Programming', 'Mrs. M. Hema Latha, M. Prashanth Kumar, Ch. Santhosh', 'ECE/ATL', '18-7-2024, 19-7-2024, 20-7-2024', 'TI DSP Lab, Projects Lab'],
          ['6.', 'Actuators, Batteries and Power Management', 'Mr. A. Siva, Mr. B. Mahendra CHand', 'EEE', '22-7-2024, 23-7-2024', ''],
          ['7.', 'CAD for Packaging (2D CAD, 3D CAD)', 'Mrs. P. Lavanya, Mr. N. Rajasekhar', 'CE, ME', '24-7-2024, 25-7-2024', 'C-319'],
          ['8.', 'Product Development', 'Dr. K. Padma Vasavi', 'ECE', '26-7-2024, 27-7-2024', 'B-203'],
          ['9.', 'Web Page Development', 'Mr. A. Nageswara Rao', 'CSE', '29-7-2024', 'B-203'],
          ['10.', 'Mobile App Development', 'Mr. T. Rajesh', 'CSE', '30-7-2024', 'B-203'],
        ],
      },
      projects: [
        { title: 'Tactile Gloves', description: 'Gloves designed to assist visually impaired users in recognizing touch feedback.' },
        { title: 'Smart Assistive Clothing', description: 'Clothing with fall detection and GPS-based alert system for elderly safety.' },
        { title: 'E-Stylus', description: 'Braille writing device for visually impaired individuals using a button-operated stylus.' },
        { title: 'Vitality Visionaries – Luggage Identifier', description: 'Smart system for identifying personal luggage using Bluetooth and sensors.' },
        { title: 'Myosync', description: 'Assistive muscle interaction device.' },
        { title: 'Auto Braille', description: 'Accessible way for visually impaired individuals to convert spoken words into braille.' },
        { title: 'Drip Track', description: 'IoT-based monitoring system for saline levels to prevent overflow or delays.' },
        { title: 'Medicine Identifier', description: 'Visual/audio-based system for blind users to identify medicines accurately.' },
        { title: 'Diabetic Foot Ulcer Monitoring System', description: 'Health monitoring system to detect ulcers early in diabetic patients.' },
        { title: 'Smart Assistive Glasses', description: 'Object detection system using camera and audio output for the visually impaired.' },
        { title: 'Temperature-Controlled Wearable Blanket', description: 'Adaptive blanket for patients with neurological or thermal regulation conditions.' },
      ] as AtlProject[],
    },
    {
      yearLabel: 'ATL Activities 2023-24',
      bridgeCourse: {
        headers: ['S. No', 'Course', 'Facilitator', 'Department', 'Date'],
        rows: [
          ['1', 'Project Development & Design Thinking', 'Dr. K. Padma Vasavi', 'ECE', '20-07-2023'],
          ['2', 'Project Development & Design Thinking', 'Dr. K. Padma Vasavi', 'ECE', '21-07-2023'],
          ['3', 'Project Development & Design Thinking', 'Dr. K. Padma Vasavi', 'ECE', '22-07-2023'],
          ['4', 'Digital Electronics', 'Mr. G. Challa Ram', 'ECE', '24-07-2023'],
          ['5', 'Digital Electronics', 'Mr. D. Ramesh Varma', 'ECE', '25-07-2023'],
          ['6', 'Analog Electronics', 'Mr. D. Girish Kumar', 'ECE', '26-07-2023'],
          ['7', 'Analog Electronics', 'Mr. D. Girish Kumar', 'ECE', '27-07-2023'],
          ['8', 'Arduino', 'Ms. M. Hemalatha & Mr. Santosh', 'ECE', '28-07-2023'],
          ['9', 'Arduino', 'Ms. M. Hemalatha & Mr. Santosh', 'ECE', '31-07-2023'],
          ['10', 'Webpage development', 'Mr. VV. Rama Rao & Mr. Anuj', 'CSE', '01-08-2023'],
          ['11', 'Webpage development', 'Mr. VV. Rama Rao & Mr. R Anuj', 'CSE', '02-08-2023'],
          ['12', 'Mobile App development', 'Dr. A. Senthil', 'AI & DS', '03-08-2023'],
          ['13', 'Mobile App development', 'Dr. A. Senthil', 'AI & DS', '04-08-2023'],
          ['14', '2D CAD', 'Mrs. A Tripura', 'CIVIL', '05-08-2023'],
          ['15', '3D CAD', 'Mr. N. Raja Sekhar', 'MECH', '07-08-2023'],
          ['16', 'Power Management & Actuators', 'Mr. Mahendra', 'EEE', '08-08-2023'],
          ['17', 'Battery and Drivers', 'Mr. A. Siva', 'EEE', '09-08-2023'],
          ['18', 'Entrepreneurship', 'Mr. K. Ashwin', 'TBI', '10-08-2023'],
        ],
      },
      projects: [
        { title: 'Smart Sole – Supportive System Squad', description: 'The aging population and individuals with disabilities face significant challenges related to mobility, falls, and chronic conditions affecting foot health. Enhancing mobility and preventing falls are paramount for the elderly and disabled individuals to maintain an independent and active lifestyle.' },
        { title: 'Currency Detector', description: 'Currency detection device or visually impaired individuals using Raspberry Pi involves creating a system that utilizes image recognition to identify and announce the denominations of various currency notes.' },
        { title: 'Prosthetic Fore Arm For People with Limited Hand Dexterity', description: "Motivated by the challenges faced by individuals with limited hand dexterity in performing daily tasks independently, we're developing a specialized prosthetic forearm. Our design integrates remote-controlled functionality for enhanced user control and convenience. Through collaboration and advanced technology utilization, we aim to improve grip strength, precision, comfort, and affordability, ultimately empowering individuals to lead more fulfilling lives." },
        { title: 'Tactile Ups and Downs', description: 'Limited outdoor play opportunities for visually impaired individuals, especially children, hinder social interaction, physical exercise, and cognitive development. This exclusion leads to feeling of exclusion, emphasizing the need for tailored solutions.' },
        { title: 'A Blind-Friendly Interactive Ball Game', description: 'The challenges blind children face in playing out door games can lead to significant social isolation. The inability to readily access games due to limited infrastructure or adapted equipment creates a barrier as a result, these children might not have the opportunity to engage with their peers in the same way as sighted children.' },
        { title: 'Sign Math', description: 'Sign Math an innovative educational game designed exclusively for individuals with hearing and speech impairments. "SignMath" is an interactive game play that teaches essential arithmetic operations such as addition, subtraction, multiplication and division. The game consists of an LCD which gives a random equation like "5+? =10". The players need to press the value in the place of question mark to win the game.' },
        { title: 'Sign Language to Audio Converter for Deaf and Dumb', description: 'Many people with hearing loss experience a drop in self-esteem and confidence because of the impaired ability to communicate with other people. Hearing impaired people find difficulty in responding to others’ commands. It becomes more challenging to react in emergency and dangerous situations.' },
        { title: 'Vision Assist', description: "In today's modern world, technology has become a powerful tool for solving everyday challenges. For visually impaired people, Advanced E-Stick is our remarkable innovation. This device aims to empower them to navigate easily and independently. This device captures the images and gives output as audio." },
        { title: 'SHESHIELD', description: 'The safety and security of women, especially those who may be physically or mentally challenged, stand as a critical societal concern. Instances of harassment, assault, or abuse continue to pose significant threats to their well-being. The safety of women, including those with physical and mental challenges, remains a pressing concern. SHESHIELD addresses this by offering a multifaceted solution, integrating technology to combat threats and ensure their well-being.' },
        { title: 'Seizure Detection and Alert System for Physically Challenged', description: 'Seizures affect 65 million people worldwide and carry significant risks including severe injuries, breathing difficulties, and brain damage. Continuous monitoring helps in the timely identification of any seizure activity. This continuous monitoring can be discreet and non-intrusive, enabling individuals to maintain independence while ensuring their safety.' },
      ] as AtlProject[],
    },
  ] as AtlYearTraining[],
  studentsBenefitted: {
    yearLabel: 'Students Benefitted: Academic Year 2023-24',
    batches: [
      { batchNo: 1, mentors: 'Mr. G. Challa Ram & Mr. N. Raja Sekhar', selectedProject: 'Smart Sole – Supportive System Squad', members: [
        { regdNo: '21B01A0457', name: 'M. Siva Ranjani', department: 'ECE' },
        { regdNo: '21B01A0437', name: 'J.T.S. Sindhu', department: 'ECE' },
        { regdNo: '22B05A0303', name: 'M. Deepthi', department: 'MECH' },
        { regdNo: '21B01A0544', name: 'Dudekula Masrath', department: 'CSE' },
        { regdNo: '21B01A0579', name: 'Kommana Sathvika', department: 'CSE' },
      ] },
      { batchNo: 2, mentors: 'Mr. D. Girish Kumar & Mr. Mahendra', selectedProject: 'Currency Detector', members: [
        { regdNo: '21B01A04A8', name: 'Toluchuri Navya Yasaswini', department: 'ECE' },
        { regdNo: '22B05A0301', name: 'CH. Swathi Durga', department: 'MECH' },
        { regdNo: '21B01A0240', name: 'P. Sri Harshitha', department: 'EEE' },
        { regdNo: '21B01A0567', name: 'K. S. V. A. Sathvika', department: 'CSE' },
        { regdNo: '21B01A0577', name: 'K Devi Chandini', department: 'CSE' },
      ] },
      { batchNo: 3, mentors: 'Mr. D. Ramesh Varma & Dr. A. Senthil', selectedProject: 'Food Feeder', members: [
        { regdNo: '22B05A0406', name: 'K Sai Vardhini', department: 'ECE' },
        { regdNo: '21B01A0401', name: 'Adapa Hari Priya', department: 'ECE' },
        { regdNo: '21B01A0252', name: 'S. Usha Sree', department: 'EEE' },
        { regdNo: '21B01A0515', name: 'Bandi Geetha Priyanka', department: 'CSE' },
        { regdNo: '21B01A0419', name: 'Gangireddy Loshmi', department: 'ECE' },
      ] },
      { batchNo: 4, mentors: 'Ms. M. Hemalatha & Mr. A. Siva', selectedProject: 'Tactile Ups and Downs', members: [
        { regdNo: '21B01A0478', name: 'Palipe Joswitha', department: 'ECE' },
        { regdNo: '21B01A0420', name: 'G. SNL Mounika', department: 'ECE' },
        { regdNo: '21B01A0255', name: 'T. Veda Sushma Sri', department: 'EEE' },
        { regdNo: '21B01A6134', name: 'Kakarla Maanasa', department: 'AI & DS' },
        { regdNo: '22B05A0302', name: 'K. Charitha', department: 'MECH' },
      ] },
      { batchNo: 5, mentors: 'Mr. V.V. Rama Rao & Mr. D. Girish Kumar', selectedProject: 'A Blind-Friendly Interactive Ball Game', members: [
        { regdNo: '22B05A0413', name: 'Simhadri Likitha Sai Durga', department: 'ECE' },
        { regdNo: '21B01A0434', name: 'Gurugu Sai Girija', department: 'ECE' },
        { regdNo: '22B05A0204', name: 'N. Sravani', department: 'EEE' },
        { regdNo: '21B01A5484', name: 'Perla Sri Vyshnavi', department: 'AI & DS' },
        { regdNo: '21B01A0403', name: 'Aluri Durga Sri Nanditha', department: 'ECE' },
      ] },
      { batchNo: 6, mentors: 'Mr. Mahendra & Mr. A. Siva', selectedProject: 'Sign Math: Bridging the Educational Gap for Deaf and Mute Learners', members: [
        { regdNo: '21B01A0429', name: 'Goka. Pravallika', department: 'ECE' },
        { regdNo: '21B01A0484', name: 'Vannemsetty Vaili Suvarna', department: 'ECE' },
        { regdNo: '21B01A5459', name: 'Kuchipudi Keerthika', department: 'AI & DS' },
        { regdNo: '21B01A5482', name: 'Pallabothula Amulya', department: 'AI & DS' },
        { regdNo: '21B01A04B1', name: 'Ungarala Leela Soujanya Rani', department: 'ECE' },
      ] },
      { batchNo: 7, mentors: 'Mr. N. Rajasekhar & Mr. R. Anuj', selectedProject: 'Sign Language to Audio Converter for Deaf And Dumb', members: [
        { regdNo: '21B01A0451', name: 'Kesanakurthi Sri Subhanjili', department: 'ECE' },
        { regdNo: '21B01A0426', name: 'G. Jyothi Sri Priya', department: 'ECE' },
        { regdNo: '21B01A54C9', name: 'Yeluri Mahima Divya', department: 'AI & DS' },
        { regdNo: '22B05A6103', name: 'Kadapana Uma Maheswari', department: 'AI & DS' },
      ] },
      { batchNo: 8, mentors: 'Dr. A. Senthil & Mr. G. Challa Ram', selectedProject: 'Vision Assist', members: [
        { regdNo: '21B01A0452', name: 'Koiluru Sri Harshitha', department: 'ECE' },
        { regdNo: '21B01A0456', name: 'Lokku Rishitha', department: 'ECE' },
        { regdNo: '21B01A6135', name: 'Kancharla Bhavani Keerthi', department: 'AI & DS' },
        { regdNo: '21B01A04C5', name: 'Rangu Bhuvaneswari', department: 'ECE' },
        { regdNo: '21B01A5424', name: 'Dangeti Sravya', department: 'AI & DS' },
      ] },
      { batchNo: 9, mentors: 'Mrs. A Tripura & Ms. M. Hemalatha', selectedProject: 'Transfer information to authorized persons using sensors', members: [
        { regdNo: '21B01A0499', name: 'Seelam Gowthami', department: 'ECE' },
        { regdNo: '21B01A04A7', name: 'Tanniru Naga Sharmila', department: 'ECE' },
        { regdNo: '21B01A6155', name: 'Shaik Mahaboob Sazna', department: 'AI & DS' },
        { regdNo: '21B01A5493', name: 'Reddy Charishma', department: 'AI & DS' },
      ] },
      { batchNo: 10, mentors: 'Mr. D. Ramesh Varma & Mr. R. Anuj', selectedProject: 'Seizure Detection and Alert System for Physically Challenged', members: [
        { regdNo: '21B01A12C7', name: 'N. Keerthi', department: 'IT' },
        { regdNo: '21B01A0487', name: 'Vlavalapalli Hema Mythreya', department: 'ECE' },
        { regdNo: '21B01A02F4', name: 'R. Kavya Sri', department: 'IT' },
        { regdNo: '21B01A0241', name: 'P. Dharani Satya', department: 'EEE' },
        { regdNo: '21B01A0227', name: 'M. Rishmitha Sai', department: 'EEE' },
      ] },
    ] as AtlBatchGroup[],
  },
  studentsBenefitted2024: {
    yearLabel: 'Students Benefitted: Academic Year 2024-25',
    batches: [
      { batchNo: 1, batchName: 'Anikitos', selectedProject: 'FLEX TALK', mentors: 'Dr. D. Ramesh Varma, Dr. G. Challa Ram', members: [
        { regdNo: '22B01A0475', name: 'Jhansi Nainavarapu', department: 'ECE' },
        { regdNo: '23B05A0419', name: 'V. Srivalli', department: 'ECE' },
        { regdNo: '22B01A4250', name: 'K. Jyothirmai', department: 'AIML' },
      ] },
      { batchNo: 2, batchName: 'VisionForge', selectedProject: 'Smart assistive Clothing', mentors: 'Mr. D. Girish Kumar, Dr. D. Ramesh Varma', members: [
        { regdNo: '22B01A4275', name: 'P. Gayathri', department: 'AIML' },
        { regdNo: '22B01A4542', name: 'K. Jyoshna Manjula', department: 'AI&DS' },
        { regdNo: '22B01A4274', name: 'N. Likhitha', department: 'AIML' },
        { regdNo: '22B01A0211', name: 'B. Deepthi', department: 'EEE' },
      ] },
      { batchNo: 3, batchName: 'Team Fit', selectedProject: 'E-Stylus', mentors: 'Mr. N. Rajasekhar, Dr. A. Siva', members: [
        { regdNo: '22B01A0488', name: 'Potu Pranathi Priya', department: 'ECE' },
        { regdNo: '22B01A04B3', name: 'V. Deepthi', department: 'ECE' },
      ] },
      { batchNo: 4, batchName: 'Vitality Visionaries', selectedProject: 'Identification of luggage', mentors: 'Ms. G. Kalyani, Mr. Mahendra Chand', members: [
        { regdNo: '22B01A4224', name: 'D. Pravallika', department: 'AIML' },
        { regdNo: '22B01A0471', name: 'Md Rahamathunnisa', department: 'ECE' },
        { regdNo: '22B01A4297', name: 'Shaik. Alfiya', department: 'AIML' },
        { regdNo: '22B01A0485', name: 'Pati Priyambica', department: 'ECE' },
      ] },
      { batchNo: 5, batchName: 'Anantah Aavishkar', selectedProject: 'Myosync', mentors: 'Ms. G. Kalyani, Dr. K. Padma Vasavi', members: [
        { regdNo: '22B01A4251', name: 'K. Sai Sahithi', department: 'AIML-A' },
        { regdNo: '22B01A04C0', name: 'V. Alekhya', department: 'ECE' },
        { regdNo: '22B01A0241', name: 'N. Hemasri', department: 'EEE' },
        { regdNo: '22B01A0301', name: 'A. Bhavana Ratnam', department: 'MEC' },
      ] },
      { batchNo: 6, batchName: 'InnovAid', selectedProject: 'Voice to Braille', mentors: 'Ms. M. Hemalatha, Mr. Nageswara Rao', members: [
        { regdNo: '23B05A0407', name: 'K. Keerthi', department: 'ECE' },
        { regdNo: '22B01A0104', name: 'C. Vamsi Lakshmi Prasanna', department: 'CIVIL' },
        { regdNo: '23B05A0405', name: 'G. Sai Sreeja', department: 'ECE' },
      ] },
      { batchNo: 7, batchName: 'Disability Disruptors', selectedProject: 'Drip Track', mentors: 'Mr. Nageswara Rao, Mr. Rajesh', members: [
        { regdNo: '22B01A0455', name: 'K. Keerthana', department: 'ECE' },
        { regdNo: '22B01A0457', name: 'K. Vidya Sowmika', department: 'ECE' },
        { regdNo: '22B01A0461', name: 'M. Mouvya Sree', department: 'ECE' },
        { regdNo: '23B05A0402', name: 'B. Jyothi Sri', department: 'ECE' },
      ] },
      { batchNo: 8, batchName: 'Believers', selectedProject: 'Medicine Identifier', mentors: 'Mr. Mahendra Chand, Ms. M. Hemalatha', members: [
        { regdNo: '22B01A0433', name: 'G. Lavanya', department: 'ECE' },
        { regdNo: '22B01A0413', name: 'Ch. Gnana Sri', department: 'ECE' },
        { regdNo: '22B01A0425', name: 'G. Dhathri Gayatri', department: 'ECE' },
        { regdNo: '22B01A0324', name: 'K. Bhargavi', department: 'MECH' },
      ] },
      { batchNo: 9, batchName: 'Ability Achievers', selectedProject: 'Diabetic foot ulcer monitoring system', mentors: 'Dr. K. Padma Vasavi, Ms. P. Lavanya', members: [
        { regdNo: '22B01A04A1', name: 'Tallapenta Yasaswini', department: 'ECE' },
        { regdNo: '22B01A0205', name: 'Arava Durga Sree', department: 'EEE' },
        { regdNo: '23B05A0205', name: 'Kuppili Lavanya', department: 'EEE' },
        { regdNo: '22B01A0462', name: 'Marri Prasanna', department: 'ECE' },
      ] },
      { batchNo: 10, batchName: 'Galaxy Girls', selectedProject: 'Smart assistive glasses', mentors: 'Dr. G. Challa Ram, Mr. D. Girish Kumar', members: [
        { regdNo: '22B01A4539', name: 'Katakam Lakshmi Sandeepa', department: 'AI&DS-A' },
        { regdNo: '22B01A0408', name: 'B. Tiruselvi', department: 'ECE' },
        { regdNo: '23B05A0204', name: 'K.N.S. Nehanvitha', department: 'EEE' },
        { regdNo: '23B05A0108', name: 'N.Y.D. Rajyalakshmi', department: 'CIVIL' },
      ] },
      { batchNo: 11, batchName: 'Prerana', selectedProject: 'Temperature Controlled Wearable Blanket', mentors: 'Dr. A. Siva, Mr. N. Rajasekhar', members: [
        { regdNo: '22B01A4506', name: 'Bajinki Komali', department: 'AI&DS-A' },
        { regdNo: '22B01A4530', name: 'Gudimetla Varshini Reddy', department: 'AI&DS-A' },
        { regdNo: '23B05A0203', name: 'Kandukuri Lakshmi Sravani', department: 'EEE' },
        { regdNo: '22B01A0322', name: 'K. Mrudula Venkata Sai Sri', department: 'MECH' },
      ] },
    ] as AtlBatchGroup[],
  },
  selectedStudents2025: {
    headers: ['S. No', 'Roll No', 'Branch', 'Student Name'],
    rows: [
      ['1', '23B01A0424', 'ECE', 'Chitrada Rupasri Valli Sai Deepthi'],
      ['2', '23B01A0458', 'ECE', 'Kola Naga Sushma Sri'],
      ['3', '23B01A04B0', 'ECE', 'Venkata Sujitha Singaraju'],
      ['4', '23B01A04C0', 'ECE', 'Valluri Sravya Lakshmi Tulasi'],
      ['5', '23B01A0404', 'ECE', 'Alluri Varshitha Varma'],
      ['6', '23B01A0426', 'ECE', 'Davala Manasa'],
      ['7', '23B01A0446', 'ECE', 'Kambhampati Sohana N P L Sri Lalitha'],
      ['8', '23B01A0480', 'ECE', 'Nelakurthi Navya'],
      ['9', '23B01A0487', 'ECE', 'P. Jaya Lakshmi Kala'],
      ['10', '24B05A0409', 'ECE', 'Pragada Likhitha Bhavani'],
      ['11', '23B01A0432', 'ECE', 'Garikipati Bhavadharani'],
      ['12', '23B01A0439', 'ECE', 'I Supraja'],
      ['13', '23B01A0473', 'ECE', 'Masina Padmini Chowdary'],
      ['14', '23B01A04C3', 'ECE', 'V Damini Siri'],
      ['15', '23B01A0431', 'ECE', 'G. Geetha Sri'],
      ['16', '23B01A0455', 'ECE', 'Satya Gayathri Kaveti'],
      ['17', '23B01A0479', 'ECE', 'Neelima Tammineni'],
      ['18', '23B01A0493', 'ECE', 'Penumatsa Aasritha Ramani'],
      ['19', '23B01A0447', 'ECE', 'Kancharala Yamini Satya Ganga Bhavani'],
      ['20', '24B05A0412', 'ECE', 'Verramalla Anitha'],
      ['21', '23B01A0148', 'CE', 'Uttaragiri Bhavani Venkata Naga Lakshmi'],
      ['22', '23B01A0317', 'MECH', 'J. Eekshitha Sai'],
      ['23', '23B01A12A4', 'IT', 'Chaturya Maragani'],
      ['24', '24B05A1211', 'IT', 'Oruganti Jhansi'],
      ['25', '23B01A1295', 'IT', 'Machavarapu Devi Nagatulasi'],
      ['26', '23B01A0204', 'EEE', 'Bade Devi Latha'],
      ['27', '23B01A0208', 'EEE', 'Chavakula Divya Surya Teja Sri'],
      ['28', '23B01A0215', 'EEE', 'Sivani Eepuri'],
      ['29', '23B01A0220', 'EEE', 'Sowjanya Kadali'],
      ['30', '23B01A0238', 'EEE', 'Penmetsa Amruthavarshini'],
      ['31', '23B01A0207', 'EEE', 'Challa Sri Bharathi Amulya'],
      ['32', '23B01A4528', 'AI&DS-A', 'Eeli Udaya Lakshmi'],
      ['33', '23B01A4524', 'AI&DS-A', 'Dekka Jahnvavi'],
      ['34', '24B05A4504', 'AI&DS-A', 'Chavvakula Jyothi Sri'],
      ['35', '23B01A4245', 'AI&ML-A', 'Gudivaka Veda Bhavishya'],
      ['36', '23B01A42B9', 'AI&ML-B', 'Sirvisetti D L T S S Samhita'],
      ['37', '23B01A4269', 'AI&ML-B', 'Malapati Thanushka'],
      ['38', '23B01A0554', 'CSE', 'Gangavarapu Jaya Sri Durga'],
      ['39', '23B01A0562', 'CSE', 'Gundemeda Bindu'],
      ['40', '23B01A0549', 'CSE', 'Evali Harshitha'],
      ['41', '24B05A4601', 'CSE-CS', 'Chaitanya Mani Buddigina'],
      ['42', '23B01A4631', 'CSE-CS', 'Kondapalli. Amrutha Valli'],
      ['43', '23B01A4651', 'CSE-CS', 'Sade Madhurima'],
    ],
  } as AtlSimpleTable,
  collaborations: 'Established in 2009, the Assistive Technology Lab collaborates with the University of Massachusetts (UMass), Lowell, USA. It focuses on empowering SVECW students to design projects benefiting the differently-abled, aiming to integrate them into mainstream society.',
  clients: [
    'Center for Visually Challenged, Bhimavaram',
    'Sri Venkateswara Deaf and Dumb School, Bhimavaram',
    'Arunodaya Manovikasa Kendram, Bhimavaram',
    'Anjali School for Physically and Mentally Challenged, Palakollu',
    'Andhra Blind School, Narsapuram',
    'Zion School for Visually and Physically Challenged, Rajahmundry',
  ],
  testimonials: [
    { quote: 'I simply got surprised to see so many projects which are distributed for social cause. It benefits to the most needy people (blind dumb hearing impaired mentally handicapped). I particularly wish all the students involved in these projects. I heartily wish them all the best.', author: 'Anupam Datta, Carnegie Mellon University' },
    { quote: 'Impressed by the enthusiasm of the students. Look forward to a team converting this to beauty. Very nice projects. Good luck.', author: 'M. Sandeep, CII Vice President' },
    { quote: 'Incredible machine with lovely presentation.', author: 'Francis Fage, INRIA' },
    { quote: 'An outstanding effort by students and faculty. Keep it up.', author: 'Dr. U. Chandra Sekhar, Director ESCI, Hyderabad' },
    { quote: 'Applications of technology for the social cause are something that you have innovated in this lab with passion for society welfare.', author: 'Prof. P. Thrimurthy, past president, CSI' },
    { quote: 'Thrilled to see the development and progress by undergraduate students is marvelous. Suggest to work with DRDO.', author: 'Dr. K. Trinath, Associate Director, NSTL Vizag' },
    { quote: 'This lab is totally dedicated for the society. It is a unique lab which works for social cause. This should be encouraged and spread its message all over India.', author: 'Dr. Ranjan Kumar Beshra, Asst. Prof, IIT Patna' },
    { quote: "This lab has excelled in developing very humane and generally useful instruments — students have tremendous passion in learning needful things and helping the society in general. Keep the good work going and reach new heights. That's my wish to this great lab.", author: 'Datla Ravi Prasad Raju, Sr. Scientist, Texas Instruments USA' },
    { quote: 'I am delighted by looking at the great application of technical knowledge useful to the needs of the differently challenged people by the participation of the students — that is really great of this institution.', author: 'Dr. G. Tulasi Ram Das, VC, JNTUK' },
    { quote: 'Excellent. Hope the tools can be put to use and popularized. Best Wishes.', author: 'B. Gopala Krishna, TCS, Hyderabad' },
    { quote: 'Already highly ignited young minds. Highly appreciable work, R&D and performance.', author: 'J.P. Shivhare, prof ITMU, Sector-23A, Gurgaon, Ex-Scientist-ISRO/DOS/GOI' },
    { quote: 'Great concept and will go a long way in improving the conditions of people with disability in our country.', author: 'Harish, Mysore, Director India DPS, IEEE' },
    { quote: 'Excellent examples of technology for humanity. Thanks and congratulations.', author: 'Peter Stacker, 2012 IEEE Pres Elect' },
  ] as AtlTestimonial[],
  seminars: [
    { year: '2014', items: [
      'A faculty development programme was conducted from 12-17th of May, 2014 for the benefit of ATL mentors.',
      'A bridge course is offered to the ATL students by the ATL mentors from 11-30th of Sep, 2014.',
    ] },
    { year: '2013', items: [
      'A bridge course is offered to the ATL students by the ATL mentors two weeks before the commencement of ATL workshop by Prof. Alan Rux from 15-30th July, 2013.',
    ] },
    { year: '2012', items: [
      'Systems Perspective of Open Innovation: Open Source Hardware and Applications : A Case Study, 3rd Feb, 2012, Mr. Maruthi Pathapati, CEO and Founder Director, Vidcentum R&D Pvt Ltd, Hyderabad.',
      'Patent Based Projects And Patenting Process, 4th Feb, 2012, Dr. Ch. Kameswara Rao, Dean R&D, TKR Engineering College, Hyderabad.',
    ] },
    { year: '2011', items: [
      'Workshop on Microcontrollers, 14th July, 2010 to 20th July, 2010, Dr. K. Pushpa, K. Padma Vasavi, SVECW, Bhimavaram.',
      'Workshop on Assistive Technology, 20th July 2011 to 27th July, 2011, Prof. Alan Rux, UMASS Lowell, USA.',
      'Workshop on Microcontroller for Faculty involved in ATL, K. Padma Vasavi, M. V. Ganeswara Rao, SVECW, Bhimavaram.',
    ] },
    { year: '2010', items: [
      'Summer Camp on Assistive Technology, 8th May, 2010 to 16th May, 2010, Dr. P. Rajesh Kumar, K. Padma Vasavi, SVECW, Bhimavaram.',
      'Workshop on Microcontrollers, 14th July, 2010 to 20th July, 2010, Dr. P. Rajesh Kumar, SVECW, Bhimavaram.',
      'Workshop on Assistive Technology, 20th July 2010 to 27th July, 2010, Prof. Alan Rux, UMASS Lowell, USA.',
    ] },
    { year: '2009', items: [
      'Workshop on Microcontrollers, 6th August, 2009 to 12th August, 2009 by Mr. G. Satyanarayana, IGIAT, Visakhapatnam.',
      'Workshop on Assistive Technology, 14th August 2009 to 21st August, 2009, Prof. Alan Rux, UMASS Lowell, USA.',
    ] },
  ] as AtlSeminarYear[],
  activities: [
    {
      title: 'ZION School Visit for ATL Students (2023-24)',
      blocks: [
        { type: 'meta', items: [
          { label: 'Date', value: '26-08-2023' },
          { label: 'Location', value: 'Zion School, Rajahmundry' },
          { label: 'Participants', value: 'ATL 48 students, 13 ATL Mentors and 2 supporting staff from ATL' },
        ] },
        { type: 'paragraph', text: 'The purpose of this visit was to gain a deeper understanding of the challenges faced by individuals with disabilities and make a real time project.' },
        { type: 'heading', text: 'Objectives' },
        { type: 'paragraph', text: 'The primary objectives of our visit were as follows:' },
        { type: 'bullets', items: [
          'To interact with the students and staff of the disabled school.',
          'To understand the challenges and obstacles faced by disabled individuals.',
          'To learn about the various disabilities and the support systems in place to assist individuals with disabilities.',
        ] },
        { type: 'heading', text: 'Itinerary' },
        { type: 'paragraph', text: 'The visit took place on 26-08-2023 and lasted for approximately 6 hours. The itinerary for the day was as follows:' },
        { type: 'bullets', items: [
          '9:00 AM: Students assembled at C Block parking and departed for the Zion disabled school.',
          '12:30 PM: Arrived at the disabled school and received a warm welcome by the school staff.',
          '01:00 PM: Interactive sessions with differently-abled children.',
          '2:00 PM: Farewell and departure.',
          '5:30 PM: Reached college.',
        ] },
        { type: 'heading', text: 'Interaction Activities' },
        { type: 'paragraph', text: 'Upon arrival, we were warmly welcomed by the school staff and students. We had the opportunity to interact with the disabled students, who showed us around the school and shared their experiences with us. We were deeply moved by their resilience and determination to overcome challenges. We visited various classrooms and observed the teaching methods and activities tailored to suit the needs of the disabled students. The teachers and support staff demonstrated immense dedication and patience in providing education and care to these students.' },
        { type: 'paragraph', text: 'It reminded us of the importance of inclusivity and the need to create a society where everyone, regardless of their abilities, can thrive. We would like to express our gratitude to the school staff and students for their warm hospitality and for allowing us to be a part of their community for a day.' },
      ],
    },
    {
      title: 'International Day of Persons with Disabilities — Assistive Technology Project Exhibition Day (2023-24)',
      blocks: [
        { type: 'meta', items: [
          { label: 'Date', value: '03-12-2023' },
          { label: 'Location', value: 'B-Block Seminar Hall, ECE Department, SVECW' },
          { label: 'Chief Guest', value: 'Dr. U.V. Ramana Raju, Managing Trustee, Centre for Visually Challenged, Bhimavaram' },
          { label: 'Participants', value: 'ATL Dean, Vice Principal, ATL 50 students, 13 ATL Mentors and 2 supporting staff from ATL' },
        ] },
        { type: 'paragraph', text: 'On December 3, 2023, the B-Block Seminar Hall hosted the following program: The event commenced with a prayer, followed by the ceremonial lighting of the lamp. A welcoming address was delivered to all attendees, setting the stage for the proceedings. ATL Dean Dr. K. Padma Vasavi shared her insights on the Assistive Technology Lab (ATL), emphasizing its significance and impact. The Vice Principal extended felicitations to Chief Guest Dr. U.V. Ramana Raju, acknowledging his distinguished presence. Dr. U.V. Ramana Raju then delivered an enlightening address, sharing valuable perspectives with the audience. ATL products were distributed among beneficiaries, showcasing the tangible outcomes of the lab\'s initiatives. The program concluded with a vote of thanks, expressing gratitude to all participants and supporters for their contributions.' },
        { type: 'table', title: 'ATL Day Distribution Projects', table: {
          headers: ['S.No', 'Name of the Project', 'Qty', 'Beneficiary'],
          rows: [
            ['1', 'Talking Box', '2', 'Sri Venkateswara Deaf & Dumb School'],
            ['2', 'Blind Stick', '5', 'U.V. Ramana Raju Blind School'],
            ['3', 'Braille Tutor', '2', 'U.V. Ramana Raju Blind School'],
            ['4', 'India Map', '2', 'U.V. Ramana Raju Blind School'],
            ['5', 'Medicine Reminder', '1', 'U.V. Ramana Raju Blind School'],
            ['6', 'Currency Note Identifier', '1', 'U.V. Ramana Raju Blind School'],
          ],
        } },
      ],
    },
    {
      title: 'International Day of Persons with Disabilities — Assistive Technology Project Exhibition Day (2024-25)',
      blocks: [
        { type: 'meta', items: [
          { label: 'Date', value: '3rd December 2024' },
          { label: 'Venue', value: 'B-Block Seminar Hall, Department of ECE, SVECW' },
          { label: 'Organized by', value: 'Assistive Technology Lab (ATL), SVECW' },
          { label: 'Chief Guest', value: 'Dr. U.V. Ramana Raju, Managing Trustee, Centre for Visually Challenged, Bhimavaram' },
          { label: 'Participants', value: 'Dr. G. Srinivasa Rao (Principal, SVECW), Prof. P. Venkata Rama Raju (Vice-Principal), ATL Dean, 40 ATL Students, 12 ATL Mentors, and 2 Supporting Staff' },
        ] },
        { type: 'heading', text: 'Event Overview' },
        { type: 'paragraph', text: 'Shri Vishnu Engineering College for Women (SVECW) proudly hosted the Assistive Technology Project Exhibition Day on 3rd December 2024 in observance of the International Day of Persons with Disabilities. Organized by the Assistive Technology Lab (ATL) of the ECE Department, the event showcased student innovations aimed at empowering individuals with disabilities through affordable and user-friendly technological solutions.' },
        { type: 'heading', text: 'Inaugural Session' },
        { type: 'paragraph', text: "The event opened with a prayer and ceremonial lamp lighting. Dr. K. Padmavasavi, ATL Dean, welcomed the dignitaries and highlighted ATL's impact. Prof. P. Venkata Rama Raju, Vice-Principal, congratulated the teams for socially relevant innovations. Dr. G. Srinivasa Rao, Principal, SVECW, emphasized ATL's role in integrating technology with empathy." },
        { type: 'heading', text: 'Keynote Address' },
        { type: 'paragraph', text: 'Dr. U.V. Ramana Raju, Chief Guest and Managing Trustee, Centre for Visually Challenged, delivered a powerful keynote emphasizing the importance of technology in improving the quality of life for persons with disabilities. He appreciated the tangible efforts made by the ATL students.' },
        { type: 'table', title: 'ATL Product Distribution', table: {
          headers: ['S.No', 'Project Name', 'Remarks'],
          rows: [
            ['1', 'Trike (Scooter)', 'Directly Distributed to an Individual Client'],
            ['2', 'Datura Flower (Tactile Botany Model)', 'Distributed to U.V. Ramana Raju Blind School'],
            ['3', 'E-Sticks (Smart Walking Sticks)', 'Distributed to U.V. Ramana Raju Blind School'],
            ['4', 'Human Heart (3D Printed Model)', 'Distributed to U.V. Ramana Raju Blind School'],
          ],
        } },
        { type: 'paragraph', text: 'The program ended with a vote of thanks from the ATL Coordinator, appreciating the involvement of 40 students, 12 mentors, and the support from college management. The event exemplified how engineering education can be transformed into a socially impactful journey, creating a strong foundation for empathetic and inclusive innovations.' },
      ],
    },
    {
      title: 'ATL 2024-25 Outcomes — TRANCE-2K25',
      blocks: [
        { type: 'paragraph', text: 'The Department of ECE at S.R.K.R. Engineering College hosted its flagship tech fest, TRANCE-2K25, on February 15, 2025. The event featured a dynamic blend of technical innovation and creative expression through segments like T-Techathon, Art Spark, NexGen, Caliber Clash, and more. Students showcased exceptional skills in coding, gaming, quizzes, art, and IoT. Among the highlights, Jhansi Nainavarapu (22B01A0475) earned First Prize in the T-Techathon, demonstrating the project FLEX-TALK for her outstanding problem-solving and programming abilities.' },
      ],
    },
    {
      title: 'Client Visit Report — Zion School, Rajahmundry (2025-26)',
      blocks: [
        { type: 'meta', items: [
          { label: 'Date', value: '23-08-2025' },
          { label: 'Location', value: 'Zion School, Rajahmundry, A.P' },
          { label: 'Participants', value: 'ATL 43 students, 5 ATL Mentors and 2 supporting staff from ATL' },
        ] },
        { type: 'paragraph', text: 'The purpose of this visit was to provide students with real-time exposure to community-based learning and to identify potential assistive technology needs in educational and healthcare environments. The visit helped students understand real-world challenges and develop empathy-driven design thinking skills.' },
        { type: 'heading', text: 'Objectives' },
        { type: 'paragraph', text: 'The primary objectives of our visit were as follows:' },
        { type: 'numbered', items: [
          'To understand the challenges and needs faced by individuals in real-life learning and rehabilitation settings.',
          'To explore opportunities for developing assistive projects to improve accessibility and learning outcomes.',
        ] },
        { type: 'heading', text: 'Itinerary' },
        { type: 'paragraph', text: 'The visit took place on 23-08-2025 and lasted for approximately 6 hours. The itinerary for the day was as follows:' },
        { type: 'bullets', items: [
          '9:00 AM: Students assembled at C Block parking area and departed for Rajahmundry.',
          '12:30 PM: Arrival at the destination and warm welcome by the host institution.',
          '1:00 PM: Interaction sessions with faculty, staff, and students.',
          '2:30 PM: Group discussion on assistive technology project opportunities.',
          '5:30 PM: Departure and return to college.',
        ] },
        { type: 'heading', text: 'Interaction Activities' },
        { type: 'paragraph', text: "Upon arrival, the team was greeted warmly by the staff and students. The participants had the opportunity to interact with the students, observe their learning environment, and understand the kind of challenges they face in daily life. The mentors guided the students in identifying project themes that align with the Assistive Technology Lab's objectives." },
        { type: 'paragraph', text: 'The visit was highly insightful, fostering awareness and compassion among students while encouraging them to apply their engineering knowledge to real-world social impact.' },
      ],
    },
    {
      title: 'International Day of Persons with Disabilities Day – Event Report (2025-26)',
      blocks: [
        { type: 'meta', items: [
          { label: 'Date', value: '03-12-2025' },
          { label: 'Venue', value: 'Smt. B. Seetha Indoor Auditorium, SVECW, Bhimavaram' },
          { label: 'Participants', value: 'ATL student teams, ATL mentors, faculty members, supporting staff, beneficiaries, and invited guests' },
        ] },
        { type: 'heading', text: 'Purpose of the Event' },
        { type: 'paragraph', text: 'The event was organized on the occasion of the International Day of Persons with Disabilities to showcase and distribute assistive technology solutions developed by ATL students. The programme aimed to promote inclusion, accessibility, and social responsibility through technology-driven solutions addressing real-life challenges faced by persons with disabilities.' },
        { type: 'heading', text: 'Objectives' },
        { type: 'bullets', items: [
          'To create awareness about assistive technologies and their societal impact.',
          'To provide practical, user-centric assistive solutions to beneficiaries.',
          'To encourage students to design empathy-driven and inclusive engineering solutions.',
          'To facilitate interaction between beneficiaries, experts, and student innovators.',
        ] },
        { type: 'heading', text: 'Programme Schedule' },
        { type: 'bullets', items: [
          'Prayer',
          'Lighting of the Lamp',
          'Welcome Address',
          'Felicitation to the Chief Guest',
          'Address by the Chief Guest',
          'Felicitation to the Guest of Honor',
          'Address by the Guest of Honor',
          'Cultural Programmes by beneficiary school students',
          'Distribution of ATL Assistive Products to beneficiaries',
          'Vote of Thanks',
        ] },
        { type: 'heading', text: 'Chief Guest and Dignitaries' },
        { type: 'boldBullets', items: [
          { lead: 'Chief Guest:', text: ' Dr. K. Madhu Murthy, Chairman, AP State Council for Higher Education' },
          { lead: 'Guest of Honor:', text: ' Dr. U. V. Ramana Raju, Managing Trustee, Centre for Visually Challenged, Bhimavaram' },
          { lead: 'Presided by:', text: ' Sri. K. V. Vishnu Raju, Chairman, Sri Vishnu Educational Society, Bhimavaram' },
        ] },
        { type: 'heading', text: 'Event Proceedings' },
        { type: 'paragraph', text: 'The programme commenced with a prayer followed by the ceremonial lighting of the lamp by the dignitaries. The welcome address highlighted the role of the Centre for Assistive Technology in developing inclusive solutions. The Chief Guest and Guest of Honor addressed the gathering, emphasizing the importance of empathy-driven innovation and the responsibility of engineers toward society.' },
        { type: 'paragraph', text: 'Cultural programmes performed by beneficiary school students added vibrancy to the event and reflected the spirit of inclusion. The key highlight of the programme was the distribution of assistive technology products designed and developed by ATL student teams.' },
        { type: 'heading', text: 'Assistive Technology Projects Distributed' },
        { type: 'numbered', items: [
          'E-Sticks – 10',
          'India Map – 2',
          'World Map – 2',
          'State Map – 2',
          'AP Districts Map – 2',
          'Medical Dispenser',
          'Object Detection System (for visually impaired)',
          'Assistive Bike',
        ] },
        { type: 'paragraph', text: 'These projects were developed by ATL students with continuous guidance from ATL mentors, focusing on usability, safety, and real-world application.' },
        { type: 'heading', text: 'Media Coverage' },
        { type: 'paragraph', text: "The event received media attention and was covered by a leading regional newspaper (Eenadu — ఈనాడు), highlighting the distribution of assistive devices and the institution's commitment toward empowering persons with disabilities. (Edition: Andhra Pradesh – West Godavari, published 04/12/2025)" },
        { type: 'heading', text: 'Outcome of the Event' },
        { type: 'bullets', items: [
          'Beneficiaries received functional assistive devices addressing mobility, learning, and daily living challenges.',
          'Students gained hands-on experience in designing solutions with social impact.',
          'The event strengthened collaboration between the institution, community organizations, and beneficiaries.',
          'Awareness on inclusive technology and accessibility was enhanced among participants.',
        ] },
        { type: 'paragraph', text: "The Assistive Technology Day event organized on 03-12-2025 was a meaningful and impactful initiative. It successfully combined technical innovation with social responsibility, reinforcing the institution's commitment to inclusive education and community engagement. The event inspired students to continue developing assistive solutions that improve quality of life for persons with disabilities." },
      ],
    },
    {
      title: 'ATL Outcomes (2025-26) — IIC Regional Meet 2025 Vijayawada',
      blocks: [
        { type: 'paragraph', text: 'VoxDot is an assistive technology project developed to improve accessibility and independence for visually impaired individuals. Many visually impaired students rely on Braille for learning, but existing Braille printers are expensive, bulky, and not easily available in schools or rural areas. Because of this, users often depend on teachers, friends, or volunteers to convert information into Braille, which delays access to study materials and limits independent learning. To address this problem, VoxDot is designed as an affordable voice-controlled Braille printing device that converts spoken words directly into printed Braille. The system captures voice input through a Bluetooth-enabled Android application, converts it into text, and then translates it into Braille. An Arduino-based microcontroller system controls a solenoid-based mechanism and motor driver to generate Braille dot patterns on paper. This allows users to instantly convert voice into Braille and print notes independently. The device is portable, easy to operate, and cost-effective, enabling visually impaired users to access information without relying on others. It supports inclusive education by helping students receive learning materials quickly and independently. The primary users include visually impaired individuals, blind schools, special education institutions, NGOs, libraries, and caregivers. The estimated production cost per unit is around ₹15,853, with additional recurring costs of about ₹1,660, while the device can be sold for approximately ₹20,750, making it more affordable than many existing Braille printers. The project also has potential partnerships with blind schools, NGOs, and government initiatives such as AICTE and CSR programs to expand its reach.' },
      ],
    },
    {
      title: 'Innovation Project Fair at JNTU Kakinada',
      blocks: [
        { type: 'paragraph', text: 'An Innovation Project Fair was organized at Jawaharlal Nehru Technological University Kakinada to encourage students to showcase creative ideas and technological innovations. The event brought together students from various engineering colleges to present projects addressing real-world problems through technology and research. Our team participated in the fair by presenting the project "BrailleEase", a device designed to convert digital text into Braille characters to make digital content accessible for visually challenged individuals.' },
        { type: 'paragraph', text: 'The chief guest of the event was Nara Lokesh, Minister for Information Technology, Electronics & Communications and Human Resource Development, Government of Andhra Pradesh. During the event, he interacted with students, observed the innovative projects, and appreciated the efforts of young engineers in developing solutions that can benefit society. His presence motivated students to focus on innovation, entrepreneurship, and technology-driven development.' },
        { type: 'paragraph', text: 'The exhibition provided a valuable platform for students to demonstrate their technical skills, creativity, and problem-solving abilities. Our project BrailleEase received positive feedback from visitors and faculty members for its social impact and potential to improve accessibility for visually challenged people.' },
        { type: 'paragraph', text: 'Overall, the Innovation Project Fair was an inspiring experience that encouraged students to pursue innovative ideas and contribute to technological advancement for societal benefit.' },
      ],
    },
    {
      title: 'AVISHKANDHRA — RTIH, Rajamahendravaram',
      blocks: [
        { type: 'paragraph', text: 'ATL teams visited the Regional Technology and Innovation Hub (RTIH), Rajamahendravaram to present and demonstrate our innovative projects aimed at solving real-world societal problems using technology. The visit provided us with an opportunity to interact with experts, present our ideas, and receive valuable feedback that could help us improve our projects and explore their real-world applications. During the visit presented two projects developed by our team: DripTrack – Smart Saline Monitoring System and SheShield – Women Safety Wearable Device.' },
        { type: 'paragraph', text: "DripTrack is a smart healthcare monitoring system designed to improve patient safety in hospitals. In hospital wards, nurses and medical staff often have to monitor the saline bottles of multiple patients simultaneously. Manually checking the saline level every few minutes can be difficult and time-consuming. If a saline bottle becomes empty and it is not noticed in time, air may enter the patient's bloodstream, which can lead to serious health complications. To overcome this issue, DripTrack continuously monitors the weight of the saline bottle using a load cell sensor. When the saline level reaches a critical low point, the system automatically activates an alert using a buzzer and LED indicator so that nurses can replace the bottle in time. This system helps prevent potential risks and reduces the workload of healthcare staff." },
        { type: 'paragraph', text: "The second project, SheShield, is a women's safety wearable device specially designed to protect mentally challenged women. It acts as a personal safety device that provides an instant response when there is unwanted physical contact in sensitive areas associated with bad touch. The device immediately sends the live GPS location of the victim along with captured images of the situation, which can also serve as evidence. For immediate attention, the device activates a flash and buzzer sound to alert nearby people. The special feature of this device is that it can be triggered by a simple touch without requiring any manual interaction from the user. Although it is primarily designed for mentally challenged women, it can be useful for every woman in today's society." },
        { type: 'paragraph', text: 'The experts and mentors at RTIH appreciated the practical applications and social relevance of both projects. They also provided valuable suggestions regarding improvements and future implementation. The visit was a highly informative and motivating experience that encouraged us to further develop our ideas and work towards creating innovative solutions for society.' },
      ],
    },
    {
      title: 'Innovation & Incubation Center Inauguration — Project Expo at Rajahmundry',
      blocks: [
        { type: 'paragraph', text: 'Our team had the valuable opportunity to present our innovative student projects during an interaction with Nara Lokesh Sir in Rajamahendravaram. The meeting provided us with a platform to showcase our ideas and explain how technology can be used to solve real-world societal problems. It was an inspiring experience that allowed us to receive encouragement and recognition for our innovative work. During the interaction, we presented two of our projects: DripTrack – Smart Saline Monitoring System and SheShield – Women Safety Wearable Device.' },
        { type: 'paragraph', text: "DripTrack is designed to enhance patient safety in hospitals by continuously monitoring the saline bottle level. In hospital wards, nurses often need to monitor multiple patients at the same time, which makes it difficult to manually check every saline bottle regularly. If a saline bottle becomes empty and it is not noticed in time, air may enter the patient's bloodstream and lead to serious health complications. DripTrack addresses this issue by using a load cell sensor to measure the weight of the saline bottle and continuously monitor the fluid level. When the saline reaches a critical low level, the system automatically activates a buzzer and LED alert so that medical staff can replace the bottle immediately, thereby preventing possible risks." },
        { type: 'paragraph', text: "The second project, SheShield, is a women's safety wearable device specially designed to protect mentally challenged women. It acts as a personal safety device that provides an instant response when there is unwanted physical contact in sensitive areas associated with bad touch. The device immediately sends the live GPS location of the victim along with captured images of the situation, which can serve as evidence. To attract immediate attention, the system also generates a flash and buzzer sound. The special feature of this device is that it can be triggered by a simple touch without requiring any manual interaction from the user. Although it is primarily designed for mentally challenged women, it can also serve as a protective device for women in general." },
        { type: 'paragraph', text: 'During the interaction, Nara Lokesh Sir appreciated the innovative ideas and the social relevance of our projects. He encouraged students to focus on developing practical technological solutions that address real societal challenges. The meeting was highly motivating and inspired us to continue working on innovative projects that can contribute positively to society.' },
      ],
    },
  ] as AtlActivity[],
  people: {
    institutionsIntro: 'Every year around seventy students from various disciplines of different institutions are selected to the ATL. The students are of different institutions selected within the campus, which are listed below:',
    institutions: [
      'Shri Vishnu Engineering College for Women',
      'Vishnu Institute of Technology',
      'Padmasri B. V. Raju Institute of Computer Education',
      'Smt. B. Seetha Polytechnic',
    ],
    facultyParagraph: "Similarly, around fifteen faculty members from these institutions are selected to guide the students to make the projects. Apart from the faculty guides and student members involved in making the projects, around ten faculty members are selected as faculty coordinators to monitor that the students and faculty guides interact actively with the team of Prof. Alan Rux (ATP Coordinator, UMASS Lowell, USA) from U.S.A.\nThe team of students, faculty guides and co-ordinators, under the guidance of Prof. Alan Rux, work with commitment and dedication towards making projects that assist the physically and mentally challenged people.",
  },
  publications: [
    'K. Padma Vasavi et al, "An RFID and E-Compass Based Navigation System for the Blind", BEATS 2010 (International Conference on Assistive Technology), NIT Jalandhar, Punjab.',
    'K. Padma Vasavi et al, "A helping Aid for Visually Challenged by RFID Technology", Book Chapter in "Projects using MSP430 Microcontrollers" by Texas Instruments India, 2011.',
    'K. Padma Vasavi, R. Susmitha, "Pattern Identification Training System for Students with Autism", International Journal in Engineering Research and Technology, vol1 Issue 3, July 2012.',
    'R. Susmitha, "An Artificial Hand Gripper using Different Technologies", National Conference on Assistive Technology, 2011, BVRIT, Hyderabad.',
    'M. V. Ganeswara Rao, "A Microcontroller Based Intelligent Stick", National Conference on Assistive Technology, 2011, BVRIT, Hyderabad.',
    'P. Ravikumar, "Talking Box for Speech Challenged", National Conference on Assistive Technology, 2011, BVRIT, Hyderabad.',
    'D. Murali Krishna, A. Krishna Chaitanya, "Speech Training System", National Conference on Assistive Technology, 2011, BVRIT, Hyderabad.',
    'P.V.V. Rama Rao, M. Pradeep, "Voice Activated Wheel Chair", National Conference on Assistive Technology, 2011, BVRIT, Hyderabad.',
    'G.R.L.V.N. Srinivasa Raju, "An RFID Based Door Opening and Closing System for Physically Challenged", National Conference on Assistive Technology, 2011, BVRIT, Hyderabad.',
    'V. Srinivasa Rao, "Voice Activated Dental Chair equipment for Physically Challenged Doctors", National Conference on Assistive Technology, 2011, BVRIT, Hyderabad.',
    'B. Surya Prasada Rao, "Gait Training System for Mentally Challenged", National Conference on Assistive Technology, 2011, BVRIT, Hyderabad.',
    'K. Padma Vasavi, "An Overview of Brain Computer Interface Systems for Communication and Control", International Journal of Engineering Technology and Research, ISSN:2321-0869, volume-1, Issue-1, April 2014.',
  ],
  outcomes: [
    {
      title: 'Projects Exhibiting at Regional Meet KL University Vijayawada on 06-01-2024',
      headers: ['Batch No.', 'Regd.No', 'Name of the Student', 'Department', 'Selected Project'],
      batches: [
        { batchNo: 1, selectedProject: 'Vibro Tactile Alert', members: [
          { regdNo: '21B01A0419', name: 'Gangireddy Loshmi', department: 'ECE' },
          { regdNo: '21B01A0411', name: 'Ch. Lehsrike Sri', department: 'ECE' },
          { regdNo: '22B01A04C0', name: 'V. Akshaya', department: 'ECE' },
        ] },
        { batchNo: 2, selectedProject: 'Autoclave Hiss Indicator (AHI)', members: [
          { regdNo: '21B01A0425', name: 'G. Pujitha Devi', department: 'ECE' },
          { regdNo: '21B01A0452', name: 'Koluru Sri Harshithe', department: 'ECE' },
          { regdNo: '21B01A0403', name: 'V. Deepthi', department: 'ECE' },
        ] },
        { batchNo: 3, selectedProject: 'Sequel Aegis Latch (SAL)', members: [
          { regdNo: '21B01A0478', name: 'Palipe Joswitha', department: 'ECE' },
          { regdNo: '21B01A04A8', name: 'V. Susmitha', department: 'ECE' },
          { regdNo: '21B01A0425', name: 'G. Dhatri Gayatri', department: 'ECE' },
        ] },
        { batchNo: 4, selectedProject: 'Buzzing Bend', members: [
          { regdNo: '21B01A0431', name: 'G. Tripura TejaSri Gowri', department: 'ECE' },
          { regdNo: '21B01A0432', name: 'G. Gnese AruSaisthi', department: 'ECE' },
          { regdNo: '21B01A0433', name: 'G. Lavanya', department: 'ECE' },
        ] },
        { batchNo: 5, selectedProject: 'Auto Braille', members: [
          { regdNo: '21B01A0494', name: 'R. Naga Kavya', department: 'ECE' },
          { regdNo: '21B01A0491', name: 'Rokkam Baveena Sri Santhoshi', department: 'ECE' },
          { regdNo: '22B05A0461', name: 'M. Mouya Sri', department: 'ECE' },
        ] },
      ] as AtlBatchGroup[],
    },
    {
      title: 'Projects Exhibiting at IIT Madras for AT MAKEATHON event on 07-01-2024',
      headers: ['Batch No.', 'Regd.No', 'Name of the Student', 'Department', 'Selected Project'],
      batches: [
        { batchNo: 1, selectedProject: 'A Blind-Friendly Interactive Ball Game', members: [
          { regdNo: '21B01A0434', name: 'Gurugu Sai Girija', department: 'ECE' },
          { regdNo: '22B05A0413', name: 'Simhadri Likitha Sai Durga', department: 'ECE' },
          { regdNo: '21B01A0403', name: 'Aluri Durga Sri Nanditha', department: 'ECE' },
        ] },
        { batchNo: 2, selectedProject: 'Prosthetic Fore Arm For People with Limited Hand Dexterity', members: [
          { regdNo: '21B01A0401', name: 'Adapa Hari Priya', department: 'ECE' },
          { regdNo: '21B01A0426', name: 'G. Jyothi Sri Priya', department: 'ECE' },
          { regdNo: '21B01A0451', name: 'Kesanakurthi Sri Subhanjili', department: 'ECE' },
        ] },
      ] as AtlBatchGroup[],
    },
  ] as AtlOutcomeEvent[],
  summitTable: {
    title: 'Projects Exhibiting at Telangana Assistive Technology Summit 4.0 at T-Hub on 4th Jan 2024',
    headers: ['S.No', 'Regd. No.', 'Student Name', 'Branch', 'Project', 'YouTube Video Link'],
    rows: [
      ['1', '21B01A0457', 'Megapu Siva Renjani', 'ECE-A', 'SHE SHIELD', ''],
      ['2', '22B05A0406', 'K Sai Vardhini', 'ECE-A', '', ''],
      ['3', '21B05A0484', 'Vennemsetty Vaili Suvarna', 'ECE-B', '', ''],
      ['4', '22B05A0413', 'Simhadri Likitha Sai Durga', 'ECE-B', '', ''],
      ['5', '22B05A0204', 'Nandem Sravani', 'EEE', '', ''],
      ['6', '22B05A0302', 'Kekarie Charitha', 'Mechanical', '', ''],
    ],
  } as { title: string; headers: string[]; rows: string[][] },
  atlInNewsCaption: 'Students at Telangana Assistive Technology Summit 4.0 at T-Hub, telecasted in ETV YUVA programme on 4th Jan 2024.',
};
