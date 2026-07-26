// Full bios for TPO Team members — keyed by the exact name string as it
// appears in the Team Roster table (item.tableText), so a matching row's
// accordion expands to show this instead of just Role/Notes. Only members
// with a bio provided so far are listed here; others fall back to the
// plain Role/Notes view.
export interface TpoTeamBio {
  photo: string;
  paragraphs: string[];
  /** Optional bulleted list of accomplishments, with its own intro line. */
  accomplishmentsIntro?: string;
  accomplishments?: string[];
  email?: string;
  phone?: string;
}

export const tpoTeamBios: Record<string, TpoTeamBio> = {
  'Mr. Satish Paruchuri': {
    photo: '',
    paragraphs: [
      'Satish Paruchuri, is currently the Director (Industry Relations) at Sri Vishnu Educational Society.',
      'He, along with his team members, looks after Placements, Internships and Industry Interaction. Before his arrival to SVES, Mr. Paruchuri had been with Institute for Electronic Governance (IEG), Government of AP as Program Manager on a mission to enhance employability of young engineers. In this direction, he worked very hard in helping 20,000 students from 200 engineering colleges to get employment in more than 30 IT Companies. IBM, CSC, CA, Mahindra Satyam, TCS and Infosys are a few to name among them.',
      'He has a big success story. On behalf of the Government, he signed MoUs with Microsoft, IBM, CSC and Infosys that have enabled a lakh or more students with opportunities through training in the latest technology. Prior to IEG, he was with Center for Good Governance as Systems Designer, architecting IT applications for Government Programs. Mr Paruchuri managed offshore IT projects for INCOMP Technologies and a Dallas, US based organization at Hyderabad.',
    ],
  },
  'Mr. Ravikiran Saili': {
    photo: '',
    paragraphs: [
      'Mr. Ravikiran Saili completed his Masters in Information Systems from Arts & Science College, Kakatiya University, Warangal in 2003. Upon completion of his masters, he joined Institute for Electronic Governance in the year 2004 as IT Trainer and held various positions such as IT Associate and Project Manager.',
      'At present he is Manager (Industry Relations) at Sri Vishnu Educational Society. He has over 8 years of experience in the areas of HR Functions, Operations, Process Management, Administration, Project Management, Data Management and Report Generation. With all this expertise, he is able to provide mentorship and coaching to team members for better results. During his tenure with JKC, he was responsible for overseeing the relations with the JKC registered institutions, coordinating the recruitment activities for JKC students, leading the team which is looking after the JKC portal, the backbone of all the JKC activities.',
    ],
    accomplishmentsIntro: 'Some of the remarkable accomplishments during his stint with JKC are',
    accomplishments: [
      'Succeeded in driving the novel concept of JKC to the fore of Engineering Colleges across the state during its initial stages.',
      'Essayed a major role in buying the JKC concept by most of engineering institutions across the state and streamlining the entire process of registrations, training activities, workshops and recruitment events.',
      'Part of the top 5% in the organization to develop the strategies for JKC registration process, training activities, recruitment events etc.,',
      'Played a key role in developing the JKC Portal – An online portal for all the JKC registered colleges and students across the state with a daily load of more than 5000 hits.',
      'Coordinated more than 400 on campus, off campus or pooled campus recruitment events for JKC students across the state.',
      'Played a key role in placing more than 15,000 JKC students at various MNCs and Indian companies.',
    ],
  },
  'Dr. K Vamshi Krishna Varma': {
    photo: '',
    paragraphs: [
      'Dr.K Vamshi Krishna Varma has an overall 23.5 years of experience with 13.5 years of industry experience & 10 years as Head Training & placements/Industry Relations along with international exposure, expertise in multiple domains is at the helm of affairs.',
      'Worked in ECIL, NPTI, Access company LTD (Japan), Texas Instruments (Israel), Sasken communications, NEC Electronics, Samsung India, LG electronics, University of Tokyo, ST Microelectronics in various cutting edge technologies. Played Program manager, Principal Engineer, Architect, Business development, Center Head Roles in different organizations.',
      'Worked in G.Pullareddy & G.Narayanamma Engg colleges, MGIT Hyderabad as Head Training & Placements. Building Technical teams. Completed B.Tech(EEE) from S.V University Tirupati in 1998, M.Tech(Power Electronics) from JNTU A in 2013, PGDM(HR & GM) from MIT School Pune in 2016, Received Ph D(EEE) degree from Kalasalingam Academy of Research and Education in 2022.',
    ],
    email: 'vamshivarma.k@srivishnu.edu.in',
    phone: '9618274392',
  },
  'Ms. D. Pushpa': {
    photo: '',
    paragraphs: [
      'Pushpa Diddi has an overall experience of 7 Years in HR and Administration with qualified Masters Degree in Business Administration from Kakatiya University, Warangal. Experience span across important functions like Induction, HR Generalist role and Admin role.',
      'Prior to joining Sri Vishnu, Pushpa worked in Atlanta Systems Pvt Ltd as a HR Personnel, played an active role in Manpower Planning, Talent Acquisition, Induction, Training and Development areas. Then she joined IEG now called TASK, a society run by the State Government and worked for 4 years in the capacity of Team Lead.',
      'As a Team Lead, she played a key role of HR Generalist involved in induction for the new recruits joining formalities, Formalities of Resignation, Experience letters, Exit Interviews, Handling employee issues, Organizing weekly team meetings, Preparing the minutes of the same and sending it across to all the team members. Knowledge of ISO 9001:2008 (QMS). Maintain HRMS (employee data), Online enrollment and relieving process of the employee.',
    ],
  },
  'Mr. Atul Kirdant': {
    photo: '',
    paragraphs: [
      'Mr. Atul Kirdant has been with Sri Vishnu Educational Society since 2012 as Industry Liaison Officer (Pune Region)',
      'He did his B.Sc. from BAMU, Pune and MBA in marketing from IIPM.',
      'Presently, he is looking after internships and placements. He is visiting IT & Core sector companies of Pune region and meeting Corporate HR Heads in the process of on campus and off campus recruitments.',
      'Previously, he worked for Seed Infotech & ICFAI University Pune in the areas of Promotional and branding activities in Pune region.',
    ],
  },
  'Mr. Arokiadoss': {
    photo: '',
    paragraphs: [
      'Mr. Arokiadoss took the position of an Industry Liaison Officer for Tamil Nadu Region in 2013.',
      'Regarding his formal schooling, he succeeded in his Bachelor of Engineering from Annai Teresa college of Engineering, Madras University in 2003 and Master of Business Administration from Alagappa University in 2006.',
      'He has more than 6 years of industrial experience which has helped him hone his skills in the area of general administration, personnel management, facility management, man management. His deftness in maintaining harmonious employee relations has sustained strong cultural and imbibing values of the organization where he worked. He is good at the entire corporate recruitment process and a counselor in giving suggestions to HR related problems.',
      'He believes in the fact that life has a variety of experiences to offer and one should learn from it in every aspect and deliver the goods efficiently.',
    ],
  },
  'Mr. Ramesh T.S': {
    photo: '',
    paragraphs: [
      'Mr. Ramesh T.S joined the SVES family as the Industry liaison officer at Bangalore. He holds a bachelor’s degree in Mechanical engineering and a P.G diploma in Business Administration.',
      'He brings to the table a vast experience from the Industry where he was involved in Brand building, business development and training activities among many others.',
      'He joined the HMS group of Institution as the training and placement officer. Apart from imparting employability skills to the students, he has liaised with industries. SVES welcomes Mr. Ramesh T.S into its fold.',
    ],
  },
  'Mr. Saurabh Mishra': {
    photo: '',
    paragraphs: [
      'MBA From welinker Inst. Mumbai and worked with Vodafone as HR, then Times of India, IPEM group, Sparsh Education Group, Sharda & Amity University',
      'Corporate Relations as a strategic business partner and meeting them by aligning and integrating human resource pillars with current and strategic business needs for a professionally managed company. Handling a wide range of assignments for campus Placement & recruitment & Corporate Relations, CSR, Job fairs, Outreach Activity, MOU, HR Conclave etc.',
    ],
  },
  'Ms. Venkata Swathi R': {
    photo: '',
    paragraphs: [
      'Ms. Venkata Swathi R, Training and Placement Officer (TPO) and Assistant Professor in the Department of Computer Science Engineering, is pursuing a Ph.D. in Computer Science and Engineering at JNTUK. She holds an M. Tech and a B. Tech in Computer Science disciplines, both from JNTUK, having 16 years of teaching experience.',
      'She oversees student training and placement activities, maintaining strong industry connections to facilitate placements. She collaborates with the industry-Institute Interaction Coordinator to organize guest lectures by industry experts. Additionally, she gathers feedback from recruiting companies and arranges soft skills and interview training programs using both institutional and external resources.',
    ],
  },
  'Mr. K. P. Swaroop': {
    photo: '',
    paragraphs: [
      'Mr. K. P. Swaroop is the Assistant Training and Placement Officer and an Assistant Professor in the Department of Electrical and Electronics Engineering. He is currently pursuing a Ph.D. from JNTUK Kakinada and holds an M. Tech. from JNTUH and a B.E. from Andhra University in the same field. With 15 years of teaching experience, he plays an active role in academics and student engagement.',
      'He is responsible for managing a range of training and placement activities, including coordinating placement drives, overseeing logistics, and conducting Campus Recruitment Training (CRT) by utilizing both institutional resources and external expertise. He actively tracks student performance and develops strategies to improve their career readiness.',
    ],
  },
  'Dr. C. P. Pavan Kumar Hota': {
    photo: '',
    paragraphs: [
      'Dr. C. P. Pavan Kumar Hota is an accomplished academician and researcher, currently serving as the Assistant Training and Placement Officer and Assistant Professor in the Department of Artificial Intelligence at Shri Vishnu Engineering College for Women, Andhra Pradesh. He holds a Ph.D. in Computer Science and Engineering from Annamalai University, an M. Tech in Computer Science and Engineering from JNTUK, and a B. Tech in Computer Science and Engineering from Andhra University.',
      'With over 10 years of teaching experience and a strong research background in Educational Data Mining, Learner Behaviour, Educational Psychology, and Cognition, Dr. Hota is committed to enhancing student learning outcomes through data-driven insights. His expertise lies in Data analytics, student performance evaluation, and cognitive ability prediction, helping to refine training and placement strategies for improved employability. As the Assistant Training and Placement Officer, he plays a pivotal role in Overseeing training and placement activities, continuous monitoring of student performance, to enhance student career readiness. His professional development includes certifications in Outcome-Based Education, NBA Accreditation, and Teaching-Learning in Engineering (NATE), along with expertise in Psychology and Machine Learning. Passionate about Educational research and continuous learning, Dr. Hota actively seeks collaborations to advance training initiatives.',
    ],
  },
};
