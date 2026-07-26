// Rich hardcoded content for the TI-DSP Centre of Excellence
// differentiator page (slug: ti-dsp-coe) — overrides that item's generic
// Firestore intro/about text in DifferentiatorDetail.tsx.
export interface TiDspFacultyMember {
  name: string;
  designation?: string;
  email?: string;
  mobile?: string;
  interests?: string;
}

export type ContentBlock =
  | { type: 'paragraph'; text: string }
  | { type: 'bullets'; items: string[] }
  | { type: 'numbered'; items: string[] }
  | { type: 'heading'; text: string }
  | { type: 'table'; headers: string[]; rows: string[][] }
  | { type: 'iicdcBatches' };

export interface YearTab {
  label: string;
  blocks: ContentBlock[];
}

export interface IicdcBatch {
  batchNo: number;
  title: string;
  members: { regdNo: string; name: string }[];
}

export const tiDspCoe = {
  overview: 'The Texas Instruments (TI) Digital Signal Processing (DSP) Lab is a pioneering facility focused on advancing DSP research and innovation. It serves as a hub for developing cutting-edge algorithms, processors, and systems in telecommunications, audio, Video, and image processing. Equipped with state-of-the-art tools, the Lab fosters collaborations with academia and industry, helps Students to drive breakthroughs in signal processing theory and practice.',
  vision: 'Transforming academia through pioneering research, collaboration, and education in digital signal processing',
  mission: [
    'Advance DSP research through interdisciplinary collaboration.',
    'Empower students with DSP expertise for industry.',
    'Innovate DSP solutions for societal challenges.',
  ],
  objectives: [
    'Advance DSP algorithms: Develop novel algorithms to enhance signal processing efficiency and performance across various applications.',
    'Collaborative research: Foster partnerships with academia and industry to address emerging challenges and push the boundaries of DSP technology.',
    'Educational outreach: Offer workshops, seminars, and resources to educate students, professionals, and the broader community about DSP theory and applications.',
  ],
  team: {
    inCharge: {
      name: 'E. R. Praveen Kumar',
      designation: 'Assistant Professor',
      email: 'emani3815@svecw.edu.in',
      mobile: '9700963994',
      interests: 'Signal Processing, IOT',
    } as TiDspFacultyMember,
    facultyMembers: [
      {
        name: 'Dr. K. Padmavasavi',
        designation: 'Professor & HoD',
        email: 'hodece@svecw.edu.in',
        mobile: '9441414651',
        interests: 'Signal Processing, ML & DL',
      },
      {
        name: 'Dr. M. Prema Kumar',
        designation: 'Professor',
        email: 'mpremkumar@svecw.edu.in',
        mobile: '9494226462',
        interests: 'Signal Processing, ML & DL',
      },
      {
        name: 'Dr. M. V. Subba Rao',
        designation: 'Associate Professor',
        email: 'mvsubbarao@svecw.edu.in',
        mobile: '9160444150',
        interests: 'Signal Processing, ML, DL & Computer Vision',
      },
    ] as TiDspFacultyMember[],
  },
  accordionSections: [
    'Training / Research or Academic Projects [Completed / Ongoing]',
    'Collaborations [National / International]',
    'Social Impacts',
    'Outcomes',
    'Activities',
    'Gallery',
  ] as string[],
  accordionContent: {
    'Collaborations [National / International]': [
      'The TI- DSP lab initially consisted of Five TMS320C6713 DSK kits along with accessories and then it received six Analog Starter Kits from Texas Instruments, India as donation. The Lab had thirty six Personal Computers a Cathode Ray Oscilloscope and Function generator other than the boards. Later, the Lab received a funding of Rs10 Lakhs in MODROBS from AICTE, New Delhi for modernizing the laboratory. Then, the following boards are purchased from Texas Instruments, India to enhance the lab facilities along with improving the research and development status of the lab.',
    ],
    'Social Impacts': [
      'The DST-sponsored lab, with a 53 lakh budget, researching Telephony Speech Enhancement for Hearing Impaired individuals, promises significant social impact. By improving communication accessibility, it empowers the hearing impaired, fostering inclusion and enhancing their quality of life. This innovative initiative bridges gaps in technology and societal needs.',
    ],
    'Outcomes': [
      'M.Venkata Subbarao, Chinimilli Pravallika, D.Ramesh Varma and M.Prema Kumar "Power Quality Event Classification using Wavelets, Decision Trees and SVM Classifiers", 9th International Conference on Innovations in Electronics and Communication Engineering, Organized by Guru Nanak Institutions Technical Campus, Hyderabad during August 13-14, 2021.',
      'D.Girish Kumar and M.Venkata Subbarao "Real-Time Image Enhancement using DCT Techniques for Video Surveillance" in 6th International Conference on Micro-Electronics, Electromagnetics and Telecommunications(ICMEET – 2021) Organized by Bhubaneswar Engineering College, Bhubaneswar, Odisha, India during 27-28 August, 2021.',
      'M. Prema Kumar, V. Veer Raju, M.Venkata Subbarao and P. Rajesh Kumar "Weighted Averaging PSO Based SWT Method of Image Fusion for X-ray Mammograms" in 6th International Conference on Micro-Electronics, Electromagnetics and Telecommunications(ICMEET – 2021) Organized by Bhubaneswar Engineering College, Bhubaneswar, Odisha, India during 27-28 August, 2021.',
      'et.al, N P. (2021). Adaptive Data Hiding Based Telephony Speech Enhancement. Turkish Journal of Computer and Mathematics Education, 12(3), 3913–3923. Retrieved from https://turkomat.org/index.php/turkbilmat/article/view/1680.',
      'N Prasad., E. Praveen Kumar., P. Sitaramanjaneyulu. and G. R. L. V. N. Srinivasa Raju., "Telephony Speech Enhancement for Hearing-Impaired People," 2020 5th International Conference on Computing, Communication and Security (ICCCS), Patna, India, 2020.',
      'R. P. K. Emani, P. Telagathoti and N. Prasad, "Telephony Speech Enhancement for Elderly People," 2020 4th International Conference on Computer, Communication and Signal Processing (ICCCSP), Chennai, India, 2020, pp. 1-4, doi: 10.1109/ICCCSP49186.2020.9315269.',
      'R. P. K Emani, P. Telagathoti and N. Prasad, "Performance Assessment of Simulink Based Speech Radio Band Extension Technique on Elderly People," 2022 International Conference on Inventive Computation Technologies (ICICT), Nepal, 2022, pp. 800-804, doi: 10.1109/ICICT54344.2022.9850946.',
      'R. P. K. Emani, P. Telagathoti and N. Prasad, "Performance Evaluation of Speech Radio band extension technique using Simulink," 2022 2nd International Conference on Artificial Intelligence and Signal Processing (AISP), Vijayawada, India, 2022, pp. 1-5, doi: 10.1109/AISP53593.2022.9760573.',
      'Kotipalli, P., Praveen Kumar, E.R., Mohan Raju, M.A.S., Murali Krishna, D. (2019). Supportive Communication System for the Elderly Disabled People. In: Satapathy, S., Bhateja, V., Das, S. (eds) Smart Intelligent Computing and Applications. Smart Innovation, Systems and Technologies, vol 104. Springer, Singapore. https://doi.org/10.1007/978-981-13-1921-1_45',
    ],
    'Activities': [
      'A One Day Training Program on DSP Processors and their Applications',
      'A Two Day workshop on Analog Electronics Application Tools.',
      'A Two day student-workshop-on-speech-processing',
      'A Two day workshop on speech recognition hands on experience.',
    ],
  } as Record<string, string[]>,
  trainingResearch: {
    workshopTitle: 'Student Workshop on Speech Processing and Machine learning for Speech Processing using MATLAB',
    intro: 'The TI Lab is now equipped with a campus license of MATLAB, offering unlimited access to users. This resource enriches student projects, with most undergraduate major projects leveraging its capabilities for enhanced outcomes. The students are carrying out some projects in TI DSP lab at our institution. The Post graduate students are also doing projects in this lab along with the under graduate students. The lab is equipped with TI DSP Starter Kits which include heterogeneous and medical imaging platforms, RFID Evaluation Kits, Bluetooth Transceivers, MSP430F microcontroller boards and also Launch Pads. So, there is a large scope of areas for the students to take up their projects.',
    years: [
      {
        label: 'AY- 2011-2012',
        blocks: [
          { type: 'paragraph', text: 'The projects that are taken up in the lab are listed below:' },
          {
            type: 'bullets',
            items: [
              'Artificial Hand Gripper using Bluetooth Technology',
              'RFID Based Door Opening and Closing System',
              'Voice Activated Dental Chair',
              'Speech Compression and Water Marking of speech using Heterogeneous Platforms',
              'Implementation of Super Resolution Algorithms for Medical Imaging',
            ],
          },
          { type: 'paragraph', text: 'Among the five projects listed above, the first three projects are the UG projects and are submitted for TI India Analog Design Contest 2011 and the remaining two projects are the projects taken up by the Post Graduate students.' },
          { type: 'paragraph', text: 'As a part of the contest the students made maximum utilization of TI support, documentation material and the forums to solve their issues. This exposure really made the students to learn more than what they learn from their text books.' },
          { type: 'paragraph', text: 'The two PG projects were completed and the students are learning to work with medical imaging and heterogeneous platforms.' },
        ],
      },
      {
        label: 'AY 2012-2013',
        blocks: [
          { type: 'paragraph', text: 'The listed UG projects are submitted for TI India Analog Design Contest 2013' },
          {
            type: 'bullets',
            items: [
              'Intelligent home security system',
              'Pattern identification & calculation training system for students with autism(PICTS)',
              'System for monitoring drowsiness using eye movement',
            ],
          },
          { type: 'paragraph', text: 'As a part of the contest the students were received approximately $200 cost of equipment. The students made maximum utilization of TI support, documentation material and the forums to solve their issues. This exposure really made the students to learn more than what they are learning from their text books.' },
          { type: 'paragraph', text: 'The first two batches were selected for a consolation prize of Rs. 10,000/- and they presented a paper in TIIEC -2013. The third batch was selected for a poster presentation in TIIEC – 2013.' },
        ],
      },
      {
        label: '2013-14',
        blocks: [
          { type: 'paragraph', text: 'Total Number of students participated in the Analog Design Contest 2014 is 200. Total number of batches is 50 i.e. each batch consists of four students. This program was conducted during 08-07-2013 to 29-07-2013 at TI DSP lab.' },
          { type: 'paragraph', text: 'In the 1st stage of TI Innovators Challenge India Analog Design Contest 2014(College Level) a two day training program on TINA Software was provided for III B.Tech ECE students and IV B.Tech ECE students.' },
          { type: 'paragraph', text: 'In the 2nd stage two days classes were provided on the basics of Op Amp for both III B.Tech ECE students and IV B.Tech ECE students.' },
          { type: 'paragraph', text: 'Finally Five batches were short listed in that 3 Batches stood 3rd and the remaining batches stood 2nd and 1st finally four students got selected as winners.' },
          {
            type: 'numbered',
            items: [
              'Ms. A Ramya (11B01A0411)',
              'Ms. A Vasavi Knayaka Parameswari (11B01A0409)',
              'Ms. B.Renuka (11B01A0413)',
              'Ms. A. Manju Lavanya (11B01A0404)',
            ],
          },
        ],
      },
      {
        label: '2014-2015',
        blocks: [
          { type: 'heading', text: 'Details of TI Innovation Challenge: TI India Analog Maker Competition 2014 (College Level)' },
          { type: 'paragraph', text: 'Total Number of students participated in the TI India Analog Maker Competition 2014 is 233. Total number of batches is 60 i.e. each batch consists of four students. This program was conducted during 28-07-2014 to 16-08-2014 at TI DSP lab.' },
          { type: 'heading', text: 'TEXAS INSTRUMENTS INDIA ANALOG MAKER COMPETITION (TIIAMC 2014) WINNERS' },
          {
            type: 'table',
            headers: ['S.No', 'Batch No', 'Branch', 'Year/Sem', 'Regd.No', 'Name of the student', 'Result'],
            rows: [
              ['1', '6', 'ECE', 'IV/I', '11B01A0485', 'M.Dharani', 'Winners'],
              ['2', '', '', 'IV/I', '11B01A0413', 'B.Renuka', ''],
              ['3', '', '', 'IV/I', '11B01A0449', 'G.Swethapriyanka', ''],
              ['4', '', '', 'IV/I', '12B05A0416', 'K.Durgaprasanna', ''],
              ['5', '18', 'ECE', 'IV/I', '11B01A04B3', 'P.Samatha', '1st Runner up'],
              ['6', '', '', 'IV/I', '11B01A04C8', 'P.Jyothi', ''],
              ['7', '', '', 'IV/I', '11B01A0489', 'Mohamad.Ashrafunnisa', ''],
              ['8', '', '', 'IV/I', '11B01A04D5', 'S.Reshma', ''],
              ['9', '61', 'ECE', 'IV/I', '11B01A04C4', 'P.RAMA', '2nd Runner up'],
              ['10', '', '', 'IV/I', '11A1A0417', 'K.VYSHNAVI', ''],
              ['11', '', '', 'IV/I', '11B01A0466', 'K.REKHA', ''],
              ['12', '', '', 'IV/I', '11B01A04A4', 'N.ANUSHA', ''],
            ],
          },
        ],
      },
      {
        label: '2015-2016',
        blocks: [
          { type: 'heading', text: 'Details of Texas Instruments Innovation Challenge India Design Contest' },
          { type: 'paragraph', text: 'In Texas Instruments Innovation Challenge India Design Contest 2015 around 27 batches (batch consists of around 4 members) were applied in that 12 batches got selected for phase I.' },
          {
            type: 'table',
            headers: ['S.No', 'Project Name', 'Domain', 'Mentor'],
            rows: [
              ['1', 'Robotic Meal Feeder for Elderly', 'Medical/Assistive Technology', 'Dr. K. Padma Vasavi'],
              ['2', 'Interactive Snoezelen Bubble Tube', '', 'Mr. Ch. Samba Siva Rao Mr. M. Pradeep'],
              ['3', 'Versatile Wheel Chair', '', 'Mrs. S. M. Padmaja Mr. S. Hanumantha Rao'],
              ['4', 'Sound Alert System for Hearing Challenged', '', 'Mr. V. S. R. Pavan Kumar'],
              ['5', 'Third Eye for Visually Challenged', '', 'Dr. K. Padma Vasavi'],
              ['6', 'Succor for Elderly People', '', 'Mr. K. Ramu Mr. E. R. Praveen Kumar'],
              ['7', 'Block-D: A Game for Visually Challenged', '', 'Mr. D. Narasimha Raju'],
              ['8', 'Fall Detector for Elderly People', '', 'Mr. V. S. R. Pavan Kumar'],
              ['9', 'Medicine Identifier', '', 'Dr. K. Padma Vasavi'],
              ['10', 'PC Based Data Logging System for Exhaust Gas Temperature Monitoring of an IC Engine', '', 'Mr. P. Devi Kiran Mr. Sekhar'],
              ['11', 'Interactive alphabet learning system for mentally challenged children', '', 'Dr. K. Pushpa'],
              ['12', 'System for behavioral therapy to children with attention deficit hyper active disorder', '', 'Dr. K. Pushpa'],
            ],
          },
        ],
      },
      {
        label: '2018-2019',
        blocks: [
          { type: 'heading', text: 'Details of finalists of Finalists. Texas Instruments Innovation Challenge India Design Contest.' },
          {
            type: 'table',
            headers: ['S.No', 'Name of Student', 'Contest'],
            rows: [
              ['1', 'Alapati Modaka Priya', 'DST & Texas Instruments India Innovation Challenge Design Contest 2018'],
              ['2', 'Ravuri Rupa Devi Sri', ''],
              ['3', 'Balla Ganga Harika', ''],
              ['4', 'Appari Lalitha Neeharika', ''],
              ['5', 'Potti Sirisha', ''],
            ],
          },
          { type: 'heading', text: 'Details of Participants in Texas Instruments Innovation Challenge India Design Contest.' },
          { type: 'heading', text: 'IICDC 2020 Project Batches' },
          { type: 'iicdcBatches' },
        ],
      },
    ] as YearTab[],
    iicdc2019: {
      collegeName: 'SHRI VISHNU ENGINEERING COLLEGE FOR WOMEN (A) :: BHIMAVARAM',
      department: 'DEPARTMENT OF ELECTRONICS AND COMMUNICATION ENGINEERING',
      tableTitle: 'IICDC 2019 REGISTERED PROJECT BATCHES',
      batches: [
        {
          batchNo: 1,
          title: 'accident detector in foggy areas',
          members: [
            { regdNo: '17B01A04G4', name: 'SUNKARA GRISHMA SRI SATYA SAI TEJASWI' },
            { regdNo: '17B01A04E3', name: 'PUTCHAKAYALA NANDINI' },
            { regdNo: '17B01A0431', name: 'BOMMU BHAVYA' },
            { regdNo: '17B01A04A1', name: 'MIRTHIPATI V V V N M SS S NAVYA' },
          ],
        },
        {
          batchNo: 2,
          title: 'stress Relief by controlling Vestibular stimulation in students',
          members: [
            { regdNo: '17B01A0432', name: 'CHEBROLU PAVYA SREE' },
            { regdNo: '17B01A04G1', name: 'SHAIK SHAHANA' },
            { regdNo: '17B01A0417', name: 'CHALAMALASETTI USHASRI' },
            { regdNo: '18B05A0401', name: 'ARNEPALLI CHANDRALEKHA' },
          ],
        },
        {
          batchNo: 3,
          title: 'wireless power shoe',
          members: [
            { regdNo: '17B01A0457', name: 'GUNNAM JNANA PRASUNA' },
            { regdNo: '17B01A0405', name: 'ANDE PUJITHA' },
            { regdNo: '17B01A04H8', name: 'PUDI SAI LAVANYA' },
            { regdNo: '17B01A0466', name: 'KALIDINDI RAMYA' },
          ],
        },
        {
          batchNo: 4,
          title: 'SMART AQUA PROTECTION SYSTEM',
          members: [
            { regdNo: '17B01A0420', name: 'CHERUKURU SAILAKSHMI' },
            { regdNo: '17B01A04A0', name: 'MENTE PHANI SATYA HARSHITHA' },
            { regdNo: '17B01A0468', name: 'KANTIPUDI SRAVANTHI' },
            { regdNo: '17B01A0474', name: 'KODAVATI R S DURGA' },
          ],
        },
        {
          batchNo: 5,
          title: 'Automatic humidity and temperature control of cold storages',
          members: [
            { regdNo: '17B01A0406', name: 'ARAVEETI VYSHNAVI' },
            { regdNo: '17B01A04E6', name: 'VALLURI DURGA NAGA SAI SIREESHA' },
            { regdNo: '17B01A0430', name: 'BATHULA VIJAYA' },
            { regdNo: '17B01A0492', name: 'LAKSHMI TULASI KALYANAM' },
          ],
        },
        {
          batchNo: 6,
          title: 'Automatic seed placer',
          members: [
            { regdNo: '17B01A0465', name: 'KADIYAMSETTI ESWARI' },
            { regdNo: '17B01A04E9', name: 'PUNATI VENKATA SWETHA' },
            { regdNo: '17B01A0440', name: 'DUVVAPU SAI SRILEKHA' },
            { regdNo: '18B05A0411', name: 'KOLLI CHANDANA' },
          ],
        },
        {
          batchNo: 7,
          title: 'pollution free india',
          members: [
            { regdNo: '17B01A0443', name: 'GAMINI GNANASRI' },
            { regdNo: '17B01A0433', name: 'DASARI TEJASWI' },
            { regdNo: '17B01A0452', name: 'GORIPARTHI SUMASRI' },
            { regdNo: '17B01A04C4', name: 'PALACHARLA ALEKHYA' },
          ],
        },
        {
          batchNo: 8,
          title: 'Data Loger of Oxygen level in Aqua culture ponds',
          members: [
            { regdNo: '17B01A0418', name: 'Ch.Dhana Lakshmi' },
            { regdNo: '18B05A0420', name: 'SHAIK SHAFIYA' },
            { regdNo: '17B01A04C1', name: 'PADALA VIJAYA BHARGAVI' },
            { regdNo: '17B01A04E7', name: 'B.SANDHYA DEVI' },
          ],
        },
        {
          batchNo: 9,
          title: 'Object Spotter',
          members: [
            { regdNo: '17B01A0419', name: 'CHAMARTHY SRIDURGA SATYA KEERTHANA' },
            { regdNo: '17B01A0485', name: 'TATAPUDI AMRUTHA' },
            { regdNo: '17B01A04E0', name: 'PRAGADA SAHITHI' },
            { regdNo: '17B01A04F4', name: 'SANISETTY RISHITHA' },
          ],
        },
        {
          batchNo: 10,
          title: 'CROP PROTECTION AND ESTABLISHMENT OF E- FARMERS MARKET',
          members: [
            { regdNo: '17B01A0490', name: 'KUSU BABY PRIYANKA' },
            { regdNo: '17B01A0479', name: 'KONAKALLA CHANDRA SAI' },
            { regdNo: '17B01A0446', name: 'GANTI UMA SURYA REKHA' },
            { regdNo: '18B05A0426', name: 'VEGESNA KAVYA' },
          ],
        },
        {
          batchNo: 11,
          title: 'detection and display of methane in paddy crop',
          members: [
            { regdNo: '17B01A04C2', name: 'PADAVALA RAVALI' },
            { regdNo: '17B01A04E4', name: 'RALLAPALLI GNANA SAI SREE' },
            { regdNo: '17B01A04D2', name: 'PAVULURI SRAVANI' },
            { regdNo: '17B01A0451', name: 'GOLTHI DEEPIKA' },
          ],
        },
        {
          batchNo: 12,
          title: 'automatic mobile control robot for spraying pesticides',
          members: [
            { regdNo: '17B01A0498', name: 'MANDA MEGHANA' },
            { regdNo: '17B01A0415', name: 'BORRA JALADURGA' },
            { regdNo: '18B05A0403', name: 'CHANDA PRASANTHI' },
            { regdNo: '17B01A04H2', name: 'VYTLA AISHWARYA' },
          ],
        },
        {
          batchNo: 13,
          title: 'automatic tracking of location and protection for women safety',
          members: [
            { regdNo: '17B01A04C6', name: 'PAMIDI BHAVANA' },
            { regdNo: '17B01A0480', name: 'KONATHAM DIVYA SRI' },
            { regdNo: '17B01A0407', name: 'ARIMILLI HINDU RAJA SREE' },
            { regdNo: '18B05A0422', name: 'SUNKARA CHINNARI' },
          ],
        },
        {
          batchNo: 14,
          title: 'automatic rotation of paddle wheel aerator with the help of surveillance of dissolved oxygen',
          members: [
            { regdNo: '17B01A0460', name: 'CHINIMILLI PRAVALLIKA' },
            { regdNo: '17B01A04B7', name: 'TUTTAGUNTA NARASA LAKSHMI SREYA' },
            { regdNo: '17B01A04D7', name: 'POLISETTY SATYA SRI' },
            { regdNo: '17B01A0403', name: 'ALLADA SATYA SAI LAKSHMI' },
          ],
        },
        {
          batchNo: 15,
          title: 'LPG DETECTION AND SHILDING FROM OXIDATION',
          members: [
            { regdNo: '17B01A0408', name: 'ARJA CHANDINI' },
            { regdNo: '17B01A0404', name: 'ANANTA HEMA LATHA' },
            { regdNo: '17B01A0482', name: 'KOTHEM HIMAJA' },
            { regdNo: '16P31A0409', name: 'C VEERA VENKATA SRI ANUSHA' },
          ],
        },
        {
          batchNo: 16,
          title: 'air purifier for farmer',
          members: [
            { regdNo: '17B01A0424', name: 'CHODE PAVITHRA' },
            { regdNo: '17B01A0494', name: 'LINGAM VEDA SAI SRI PRATYUSHA' },
            { regdNo: '17B01A0477', name: 'KOKKIRIGADDA SAI NAGA SRI' },
            { regdNo: '17B01A0449', name: 'GOGULA SAI TUSHARA' },
          ],
        },
        {
          batchNo: 17,
          title: 'use smart bus save time : it is used for finding location of the bus and identify the no of seats availability',
          members: [
            { regdNo: '17B01A0471', name: 'KETHA SAHITYA' },
            { regdNo: '17B01A0463', name: 'JALLEPALLI SNEHA SANDHYA' },
            { regdNo: '17B01A04H7', name: 'POSIMSETTI DEVIKA SRI' },
            { regdNo: '17B01A0409', name: 'BALE WINCY' },
          ],
        },
        {
          batchNo: 18,
          title: 'Kavach-the nextgeneration smart helmet',
          members: [
            { regdNo: '17B01A04A5', name: 'MUPARTHY JANAKI ALEKHYA' },
            { regdNo: '17B01A0401', name: 'AISHWARYA S' },
            { regdNo: '18B05A0423', name: 'TANNEEDI V D PAVANA SUBRAHMANYA SANTHI' },
            { regdNo: '17B01A0475', name: 'KODAVATI VENKATA DEEPTHI' },
          ],
        },
        {
          batchNo: 19,
          title: 'Driver Debility Protection System',
          members: [
            { regdNo: '17B01A04E5', name: 'R.S.S.D.A.SUSHMA' },
            { regdNo: '17B01A04D5', name: 'PERLA.HEMAPAVANI' },
            { regdNo: '17B01A04G2', name: 'SHEIK.JAHIRUNNISHA' },
            { regdNo: '17B01A04F9', name: 'SHAIK.GOUSIYA' },
          ],
        },
        {
          batchNo: 20,
          title: 'Detection of cracks in pipelines using robot',
          members: [
            { regdNo: '17B01A04C5', name: 'P.RAMYA' },
            { regdNo: '17B01A04C0', name: 'P.SAIDURGABHAVANI' },
            { regdNo: '17B01A04A8', name: 'N.KEERTHISWAR' },
          ],
        },
        {
          batchNo: 21,
          title: 'SOIL FERTILITY ANALYZER',
          members: [
            { regdNo: '18B01A0474', name: 'N.VYSHNAVI' },
            { regdNo: '18B01A0498', name: 'SK.HASHMA' },
            { regdNo: '19B05A0410', name: 'K.ANUSHA' },
            { regdNo: '18B01A0470', name: 'L.MONI HARSHA SRI' },
          ],
        },
      ] as IicdcBatch[],
    },
  },
};
