export interface GovTableRow { [key: string]: string | number }

export interface GovItem {
  slug: string;
  title: string;
  category: 'governance' | 'committees' | 'iqac';
  icon: string;
  desc: string;
  intro?: string;
  about?: string;
  highlights?: string[];
  outcomes?: string[];
  tableData?: GovTableRow[];
}

export const govItems: GovItem[] = [

  // ─── GOVERNANCE ────────────────────────────────────────────────────────────
  {
    slug: 'governing-body',
    title: 'Governing Body',
    category: 'governance',
    icon: '🏛️',
    desc: 'The apex body of VWU constituted as per AICTE norms, comprising representatives from management, faculty, industry, government, and regulatory bodies.',
    intro: 'The Governing Body is the highest decision-making authority of Vishnu Womens University. Constituted as per AICTE and UGC guidelines, it provides strategic direction, oversees institutional policy, approves budgets, and ensures compliance with regulatory norms.',
    about: 'The Governing Body meets at least twice a year and includes the Chairman of Sri Vishnu Educational Society, the Principal as Ex-Officio member, faculty representatives nominated by the Principal, nominees from the State Government, JNTUK, and UGC, and distinguished experts from industry and academia. It approves the annual budget, considers reports of the IQAC, and takes decisions on all major institutional matters.',
    highlights: [
      'Constituted as per AICTE and UGC norms',
      'Includes State Government and JNTUK nominees',
      'UGC nominee from JNU, New Delhi',
      'Meets at least twice annually',
      'Approves annual budget and institutional policies',
      'Oversees IQAC reports and quality initiatives',
    ],
    tableData: [
      { 'S.No': 1,  Name: 'Sri K.V. Vishnu Raju',       Designation: 'Chairperson',                       Organisation: 'Chairman, Sri Vishnu Educational Society' },
      { 'S.No': 2,  Name: 'Sri Ravichandran Rajagopal',  Designation: 'Member – Management',               Organisation: 'Vice Chairman, SVES' },
      { 'S.No': 3,  Name: 'Sri Aditya Vissam',           Designation: 'Member – Management',               Organisation: 'Secretary, SVES' },
      { 'S.No': 4,  Name: 'Sri K. Sai Sumant',           Designation: 'Member – Management',               Organisation: 'Joint Secretary, SVES' },
      { 'S.No': 5,  Name: 'Sri JVSSRD Prasada Raju',     Designation: 'Member – Management',               Organisation: 'Director, SVES' },
      { 'S.No': 6,  Name: 'Prof. P. Venkata Rama Raju',  Designation: 'Member – Faculty (Nominated)',      Organisation: 'Vice-Principal, VWU' },
      { 'S.No': 7,  Name: 'Dr. S.M. Padmaja',            Designation: 'Member – Faculty',                  Organisation: 'Professor & Head, Dept. of EEE' },
      { 'S.No': 8,  Name: 'Dr. U. Chandra Sekhar',       Designation: 'Educationalist / Industrialist',    Organisation: 'WIPRO, Bengaluru' },
      { 'S.No': 9,  Name: 'Dr. Buddha Singh',            Designation: 'UGC Nominee',                       Organisation: 'School of Computer & Systems Sciences, JNU, New Delhi' },
      { 'S.No': 10, Name: 'Mr. J. Satyanarayana Murthy', Designation: 'State Government Nominee',          Organisation: 'RJD, Technical Education, Kakinada' },
      { 'S.No': 11, Name: 'Prof. GVR Prasada Raju',      Designation: 'University Nominee',                Organisation: 'Professor of Civil Engineering, UCEK, JNTUK, Kakinada' },
      { 'S.No': 12, Name: 'Dr. G. Srinivasa Rao',        Designation: 'Ex-Officio (Principal)',            Organisation: 'Principal, VWU' },
    ],
  },

  {
    slug: 'academic-council',
    title: 'Academic Council',
    category: 'governance',
    icon: '🎓',
    desc: 'The highest academic authority of VWU, chaired by the Vice-Chancellor/Principal, responsible for regulating and promoting academic activities.',
    intro: 'The Academic Council is the supreme academic body of Vishnu Womens University. It is chaired by the Principal and is responsible for laying down policies on academic matters including curriculum, examination regulations, and academic calendar.',
    about: 'The Academic Council comprises all Heads of Departments, senior professors, and external academic experts. It reviews and approves syllabi recommended by the Boards of Studies, considers proposals for new programmes, and ensures academic standards are maintained across all departments. The Council also recommends the conferment of degrees and honorary degrees.',
    highlights: [
      'Chaired by the Principal (Vice-Chancellor equivalent)',
      'All Heads of Departments are members',
      'Approves syllabi and academic regulations',
      'Considers proposals for new programmes',
      'Reviews academic calendar and examination schedules',
      'Recommends conferment of degrees to the Governing Body',
    ],
    outcomes: [
      'Approved curriculum updates for 2020–24 and 2021–25 batches',
      'Introduced Choice Based Credit System (CBCS)',
      'Approved Minor and Honour specialisations across departments',
      'Recommended integration of industry certifications in curriculum',
    ],
  },

  {
    slug: 'board-of-studies',
    title: 'Board of Studies',
    category: 'governance',
    icon: '📚',
    desc: 'Department-wise academic bodies that design and recommend curriculum, syllabi, and teaching methodologies to the Academic Council.',
    intro: 'Each department of Vishnu Womens University has a Board of Studies (BoS) constituted to ensure curriculum relevance and academic excellence. The Board recommends the courses of study, syllabi, and books/materials for each programme offered by the department.',
    about: 'The Board of Studies includes the Head of Department as Chairman, all professors of the department, two external experts from industry or academia, and a nominated student or alumni representative. Boards meet at least once per academic year to review and update curricula in line with industry trends, technological advancements, and AICTE/UGC guidelines. Recommendations are forwarded to the Academic Council for approval.',
    highlights: [
      'Constituted separately for each department',
      'Chaired by the Head of Department',
      'Includes industry experts and external academics',
      'Meets at least once per academic year',
      'Recommends syllabus revisions and new electives',
      'Integrates latest industry tools and emerging technologies',
    ],
    outcomes: [
      'Introduced 100+ new electives across departments since 2018',
      'Integrated Python, ML, IoT, and Cloud Computing into core curricula',
      'Added mandatory industry certification modules across all branches',
      'Aligned syllabi with NASSCOM, Microsoft, Amazon, and TCS frameworks',
    ],
  },

  {
    slug: 'finance-committee',
    title: 'Finance Committee',
    category: 'governance',
    icon: '💰',
    desc: 'The statutory financial oversight committee of VWU responsible for budget preparation, financial planning, and expenditure approval.',
    intro: 'The Finance Committee of Vishnu Womens University is a statutory body constituted under the University Act. It is responsible for examining the annual budget, advising on financial matters, and ensuring prudent financial management of institutional resources.',
    about: 'The Finance Committee prepares and recommends the annual budget to the Governing Body, examines proposals involving significant expenditure, and reviews the annual accounts and audit reports. It includes the Principal, Finance Officer, and members nominated by the Governing Body including external financial experts. The committee ensures transparency, accountability, and regulatory compliance in all financial operations of the university.',
    highlights: [
      'Statutory committee under the University Act',
      'Prepares and approves the annual budget',
      'Examines all proposals involving major expenditure',
      'Reviews annual accounts and statutory audit reports',
      'Advises on fee structure and scholarship disbursement',
      'Includes external financial experts for independent review',
    ],
    outcomes: [
      'Consistent unqualified audit reports',
      'Timely disbursement of SC/ST/BC government scholarships',
      'Approved infrastructure investments exceeding ₹50 crore',
      'Zero pending audit objections for consecutive years',
    ],
  },

  {
    slug: 'idp',
    title: 'Institutional Development Plan',
    category: 'governance',
    icon: '📈',
    desc: 'VWU\'s long-term strategic roadmap (2020–2035) outlining five core objectives for academic excellence, employability, faculty development, research culture, and community service.',
    intro: "VWU's Institutional Development Plan (IDP) 2020–2035 is a comprehensive strategic document that charts the university's growth across five dimensions: educational quality, employment and higher education opportunities, faculty excellence, research culture, and societal commitment.",
    about: 'The IDP was developed through a participatory process involving faculty, students, industry partners, and alumni. It is reviewed annually by the IQAC and the Governing Body to track progress against measurable targets. The plan aligns with national priorities including the National Education Policy 2020, AICTE guidelines, and NAAC accreditation requirements.',
    highlights: [
      'Five strategic objectives covering all institutional dimensions',
      'Aligned with National Education Policy 2020',
      'Reviewed annually by IQAC and Governing Body',
      'Developed with input from faculty, students, and industry',
      '15-year horizon (2020–2035) with annual milestones',
      'Linked to NAAC and NBA accreditation criteria',
    ],
    outcomes: [
      'Objective 1: Enhanced educational quality through innovative curricula and industry engagement',
      'Objective 2: Strengthened placement and higher education pathways via metropolitan liaison offices',
      'Objective 3: Faculty excellence through awards, research grants, and professional development',
      'Objective 4: Research culture via theme labs, funded projects, and research centre applications',
      'Objective 5: Community commitment through Radio Vishnu, NSS, and green campus initiatives',
    ],
  },

  // ─── COMMITTEES ────────────────────────────────────────────────────────────
  {
    slug: 'college-academic-committee',
    title: 'College Academic Committee',
    category: 'committees',
    icon: '🏫',
    desc: 'The primary academic monitoring committee of VWU, overseeing academic standards, teaching quality, and student performance across all departments.',
    intro: 'The College Academic Committee (CAC) is the central academic oversight body at VWU, responsible for monitoring the academic progress of students, reviewing departmental performance, and ensuring adherence to the academic calendar and prescribed syllabus.',
    about: 'The Committee meets monthly and reviews key academic indicators including attendance, internal assessment results, and course completion. It coordinates with all Heads of Departments to identify academic challenges early and implement remedial measures. The CAC also reviews feedback from students on teaching quality and takes appropriate corrective action.',
    highlights: [
      'Monthly meetings with Heads of all Departments',
      'Monitors student attendance and academic performance',
      'Reviews internal assessment results each cycle',
      'Coordinates remedial classes for academically at-risk students',
      'Processes student feedback on teaching effectiveness',
      'Reports to the Academic Council and Principal',
    ],
  },

  {
    slug: 'internal-quality-assurance-cell',
    title: 'Internal Quality Assurance Cell',
    category: 'committees',
    icon: '✅',
    desc: 'The IQAC coordinates quality assurance activities across the institution, maintains records for NAAC accreditation, and drives continuous improvement initiatives.',
    intro: "VWU's Internal Quality Assurance Cell (IQAC) was established as per UGC and NAAC guidelines to institutionalise quality consciousness and maintain standards across all academic and administrative functions.",
    about: "The IQAC prepares the Annual Quality Assurance Report (AQAR), coordinates academic audits, and ensures that quality benchmarks are maintained in teaching, research, and governance. It facilitates the adoption of best practices from peer institutions and industry, and tracks progress against NAAC criteria. The Cell is chaired by the Principal and includes senior faculty, administrative staff, and external stakeholders.",
    highlights: [
      'Established as per UGC and NAAC guidelines',
      'Prepares Annual Quality Assurance Report (AQAR)',
      'Coordinates internal and external academic audits',
      'Tracks progress against NAAC seven criteria',
      'Facilitates best practice adoption from peer institutions',
      'Chaired by the Principal with faculty and external members',
    ],
  },

  {
    slug: 'academic-administrative-audit',
    title: 'Academic and Administrative Audit Committee',
    category: 'committees',
    icon: '🔍',
    desc: 'Conducts periodic audits of academic and administrative processes to identify gaps, ensure compliance, and recommend improvements.',
    intro: 'The Academic and Administrative Audit Committee (AAAC) of VWU is responsible for conducting systematic, periodic audits of all academic and administrative activities to ensure compliance with institutional policies, regulatory requirements, and quality standards.',
    about: 'The Committee audits departmental academic plans, teaching records, examination processes, and administrative procedures at least once per semester. Findings are reported to the Principal and IQAC, and action taken reports (ATRs) are reviewed in subsequent audits. This process has significantly improved documentation quality and process adherence across the institution.',
    highlights: [
      'Minimum one audit per semester per department',
      'Covers both academic and administrative processes',
      'Reports submitted to Principal and IQAC',
      'Action Taken Reports reviewed in follow-up audits',
      'Ensures compliance with AICTE, UGC, and JNTUK norms',
      'Contributes to NAAC criterion 6 (Governance & Leadership)',
    ],
  },

  {
    slug: 'freshmen-committee',
    title: 'Freshmen Committee',
    category: 'committees',
    icon: '🌱',
    desc: 'Dedicated committee ensuring a smooth, supportive transition for first-year students into university life through orientation, counselling, and monitoring.',
    intro: "VWU's Freshmen Committee is specifically constituted to facilitate the successful academic and social integration of first-year (I B.Tech) students into university life, with a focus on orientation, mentoring, and early identification of students needing additional support.",
    about: 'The Committee organises a comprehensive orientation programme at the start of each academic year, covering academic regulations, available facilities, student clubs, career resources, and campus safety. It designates faculty mentors for groups of freshmen and conducts monthly monitoring reviews during the first year. The Committee works closely with the Counselling & Monitoring Committee for students who require additional guidance.',
    highlights: [
      'Organises induction programme at start of each academic year',
      'Assigns dedicated faculty mentors to first-year groups',
      'Monthly progress reviews for I B.Tech students',
      'Coordinates with Counselling & Monitoring Committee',
      'Facilitates transition from school to university environment',
      'Supports social and academic integration of new students',
    ],
  },

  {
    slug: 'infrastructure-management',
    title: 'Infrastructure Management Committee',
    category: 'committees',
    icon: '🏗️',
    desc: 'Oversees the planning, development, maintenance, and optimal utilisation of all physical infrastructure and facilities at VWU.',
    intro: "VWU's Infrastructure Management Committee is responsible for the systematic planning, development, and maintenance of all physical infrastructure including academic buildings, laboratories, hostels, sports facilities, and campus amenities.",
    about: "The Committee reviews infrastructure requirements submitted by departments and administrative units, prioritises development projects, oversees construction and renovation works, and ensures maintenance of existing facilities. It coordinates with the Finance Committee on capital expenditure approvals and monitors the quality and timely completion of infrastructure projects. The Committee also ensures compliance with accessibility, safety, and environmental norms.",
    highlights: [
      'Plans and prioritises all campus infrastructure projects',
      'Coordinates with Finance Committee on capital expenditure',
      'Monitors quality and timely completion of construction works',
      'Ensures compliance with safety and accessibility norms',
      'Oversees maintenance of laboratories and ICT infrastructure',
      'Manages green campus and sustainability initiatives',
    ],
  },

  {
    slug: 'faculty-grievance',
    title: 'Faculty Grievance Redressal Committee',
    category: 'committees',
    icon: '🤝',
    desc: 'Provides a formal, confidential mechanism for faculty members to raise and resolve service-related grievances in a fair and time-bound manner.',
    intro: "VWU's Faculty Grievance Redressal Committee ensures that all faculty members have access to a transparent, confidential, and time-bound mechanism for raising service-related grievances, ensuring a supportive and equitable work environment.",
    about: 'The Committee receives grievances related to service conditions, workload, appraisal, promotions, and workplace conduct. All complaints are treated with strict confidentiality, investigated impartially, and resolved within a stipulated timeframe. The Committee reports unresolved matters to the Principal and Governing Body. Its functioning contributes to faculty retention and institutional satisfaction.',
    highlights: [
      'Formal, confidential grievance mechanism for all faculty',
      'Covers service conditions, appraisal, workload, and promotions',
      'Time-bound resolution with defined escalation path',
      'Reports to Principal and Governing Body on unresolved cases',
      'Supports faculty retention and institutional well-being',
    ],
  },

  {
    slug: 'student-grievance',
    title: 'Student Grievance Redressal Committee',
    category: 'committees',
    icon: '📣',
    desc: 'Ensures every student has access to a fair, time-bound grievance mechanism for academic, administrative, and campus life concerns.',
    intro: "VWU's Student Grievance Redressal Committee (SGRC) is constituted as per UGC regulations to provide students with a fair, confidential, and efficient mechanism to address academic and non-academic grievances.",
    about: "Students may submit grievances related to examination results, attendance, fee matters, campus facilities, or any academic irregularity. The Committee investigates each complaint within 15 working days and communicates the resolution in writing. Appeals may be escalated to the Principal. An online grievance portal is also available to allow anonymous submissions. The SGRC reports grievance statistics to the IQAC for monitoring trends.",
    highlights: [
      'Constituted as per UGC Grievance Redressal Regulations',
      'Covers academic, administrative, and campus life grievances',
      'Online portal available for anonymous submissions',
      'Resolution communicated within 15 working days',
      'Escalation mechanism to Principal for unresolved cases',
      'Grievance statistics reported to IQAC annually',
    ],
  },

  {
    slug: 'central-purchase',
    title: 'Central Purchase Committee',
    category: 'committees',
    icon: '🛒',
    desc: 'Ensures transparent, competitive, and value-for-money procurement of equipment, materials, and services across all departments.',
    intro: "VWU's Central Purchase Committee is responsible for the transparent and efficient procurement of academic equipment, laboratory instruments, consumables, software licences, and other institutional supplies in accordance with procurement guidelines.",
    about: 'The Committee follows a structured procurement process including requirement assessment, vendor empanelment, competitive quotation/tender, technical evaluation, and financial approval. It ensures that all purchases are aligned with the approved budget, deliver value for money, and meet quality specifications. The Committee also maintains vendor records and manages warranty and AMC obligations for critical equipment.',
    highlights: [
      'Structured procurement process with competitive quotations',
      'Transparent vendor empanelment and evaluation criteria',
      'All purchases aligned with approved budget',
      'Maintains records of warranties and AMC contracts',
      'Compliant with government procurement guidelines',
      'Coordinates with departmental technical teams for specifications',
    ],
  },

  {
    slug: 'counselling-monitoring',
    title: 'Counselling & Monitoring Committee',
    category: 'committees',
    icon: '💬',
    desc: 'Provides academic and personal counselling support to students, with regular monitoring to ensure holistic student well-being and academic progress.',
    intro: "VWU's Counselling & Monitoring Committee provides structured support to students facing academic difficulty, personal challenges, or adjustment issues, ensuring that every student has access to guidance and mentoring throughout their academic journey.",
    about: 'The Committee maintains a faculty mentor system where each faculty member is assigned a group of 15–20 students. Mentors conduct regular one-on-one meetings, review academic progress, and refer students with serious concerns to professional counsellors. The Committee coordinates with the Department of Psychology for specialist support. Monthly monitoring reports are submitted to the Principal and flagged students receive targeted intervention.',
    highlights: [
      'Faculty mentor system: 15–20 students per mentor',
      'Regular one-on-one meetings with assigned students',
      'Department of Psychology provides specialist counselling',
      'Monthly monitoring reports to Principal',
      'Targeted intervention for at-risk students',
      'Confidential support for personal and family challenges',
    ],
  },

  {
    slug: 'anti-ragging',
    title: 'Anti Ragging Committee',
    category: 'committees',
    icon: '🛡️',
    desc: 'Ensures a ragging-free campus environment through awareness, prevention, monitoring, and strict enforcement as per UGC Anti-Ragging Regulations.',
    intro: "VWU maintains a zero-tolerance policy against ragging. The Anti Ragging Committee is constituted as per UGC Anti-Ragging Regulations 2009 and is responsible for prevention, monitoring, and redressal of any ragging-related incidents on campus.",
    about: 'The Committee conducts awareness programmes for students and parents at the start of each academic year, maintains a 24×7 anti-ragging helpline, and ensures all students submit anti-ragging undertakings online through the UGC portal. CCTV surveillance covers all critical areas of the campus. Any complaint is investigated immediately with strict consequences including suspension or expulsion for confirmed incidents.',
    highlights: [
      'Zero-tolerance anti-ragging policy',
      'Constituted as per UGC Anti-Ragging Regulations 2009',
      '24×7 anti-ragging helpline available to students',
      'All students submit online anti-ragging undertakings',
      'CCTV surveillance across all critical campus areas',
      'Immediate investigation and strict consequences for violations',
    ],
  },

  {
    slug: 'internal-committee',
    title: 'Internal Committee',
    category: 'committees',
    icon: '⚖️',
    desc: 'Statutory committee under the Prevention, Prohibition and Redressal of Sexual Harassment (POSH) Act, ensuring a safe and dignified campus environment for all.',
    intro: "VWU's Internal Committee (IC) is constituted as per the Sexual Harassment of Women at Workplace (Prevention, Prohibition and Redressal) Act, 2013 (POSH Act). It ensures a safe, respectful, and dignified environment for all students, faculty, and staff on campus.",
    about: 'The Committee is chaired by a senior woman faculty member and includes members from faculty, administration, and an external NGO representative as required by law. It conducts awareness sessions, processes complaints in a confidential and time-bound manner, and submits an annual report to the Governing Body. All members receive regular training on POSH compliance and investigation procedures.',
    highlights: [
      'Constituted under the POSH Act, 2013',
      'Chaired by a senior woman faculty member',
      'Includes external NGO representative as per statute',
      'Processes complaints within prescribed legal timeframes',
      'Annual report submitted to Governing Body',
      'Regular awareness and sensitisation programmes on campus',
    ],
  },

  {
    slug: 'sc-st-cell',
    title: 'SC/ST Cell',
    category: 'committees',
    icon: '🤲',
    desc: 'Provides dedicated support, grievance redressal, and welfare facilitation for SC/ST students and staff in accordance with Government of India guidelines.',
    intro: "VWU's SC/ST Cell is constituted as per UGC guidelines to safeguard the interests of Scheduled Caste and Scheduled Tribe students and employees, facilitate access to government welfare schemes, and address any discrimination or grievance promptly.",
    about: "The Cell assists SC/ST students in applying for government scholarships and fee reimbursement schemes, facilitates mentoring and academic support programmes, and provides a platform for raising caste-based discrimination grievances. The Cell Coordinator is a designated senior faculty member from the SC/ST community. The Cell submits an annual report to the UGC and coordinates with the District SC/ST Welfare Office.",
    highlights: [
      'Constituted as per UGC SC/ST Cell guidelines',
      'Facilitates government scholarship and fee reimbursement',
      'Dedicated grievance mechanism for caste-based discrimination',
      'Cell Coordinator from SC/ST community',
      'Annual report submitted to UGC',
      'Coordinates with District SC/ST Welfare Office',
    ],
  },

  {
    slug: 'rd-committee',
    title: 'R&D Committee',
    category: 'committees',
    icon: '🔬',
    desc: 'Promotes and coordinates research and development activities across VWU, facilitating funded projects, publications, patents, and industry collaborations.',
    intro: "VWU's Research & Development Committee drives the institution's research agenda by promoting funded research, facilitating industry-academia collaborations, supporting faculty in pursuing patents, and fostering a research culture among students and faculty.",
    about: "The Committee identifies potential funding agencies, assists faculty in submitting research proposals to DST, SERB, AICTE, DRDO, and other bodies, and maintains a register of all ongoing funded projects. It reviews the research output of each department, recognises faculty with research incentives, and facilitates the filing of patents through the IIPR cell. The Committee also coordinates Mission R&D — VWU's flagship initiative for training students in cutting-edge research domains.",
    highlights: [
      'Facilitates proposals to DST, SERB, AICTE, and DRDO',
      'Maintains register of all ongoing funded research projects',
      'Supports patent filing through IIPR cell',
      'Coordinates Mission R&D student research programme',
      'Recognises faculty with annual research excellence awards',
      'Promotes industry-sponsored research and consultancy',
    ],
  },

  // ─── IQAC ──────────────────────────────────────────────────────────────────
  {
    slug: 'about-iqac',
    title: 'About IQAC',
    category: 'iqac',
    icon: '🏅',
    desc: 'VWU\'s Internal Quality Assurance Cell — established to institutionalise a culture of quality in all academic and administrative activities and maintain NAAC accreditation standards.',
    intro: "VWU's Internal Quality Assurance Cell (IQAC) was established in compliance with NAAC guidelines to develop and apply mechanisms to ensure quality and relevance in all academic, administrative, and outreach activities of the institution.",
    about: "The IQAC functions as a nodal agency for quality-related activities at VWU. It promotes conscious and consistent improvement in the performance and functioning of the institution. The Cell is headed by the Principal as Chairperson, with a senior faculty member as Director/Coordinator, and includes Heads of Departments, administrative officers, and external stakeholders from industry and alumni. The IQAC prepares Annual Quality Assurance Reports (AQAR), coordinates NAAC activities, and drives continuous improvement across all NAAC criteria.",
    highlights: [
      'Established as per NAAC guidelines',
      'Chaired by the Principal; coordinated by senior faculty',
      'Includes HoDs, admin staff, industry, and alumni members',
      'Prepares Annual Quality Assurance Reports (AQAR)',
      'Coordinates all NAAC accreditation activities',
      'Drives continuous improvement in teaching, research, and governance',
    ],
  },

  {
    slug: 'iqac-worksystem',
    title: 'IQAC Worksystem',
    category: 'iqac',
    icon: '⚙️',
    desc: 'The structured workflow, processes, and responsibilities that govern how the IQAC plans, monitors, reports, and continuously improves institutional quality.',
    intro: "The IQAC Worksystem at VWU defines the systematic processes, responsibilities, and timelines through which the Cell plans quality activities, collects and analyses data, coordinates audits, and drives institutional improvement across all NAAC criteria.",
    about: "The worksystem operates on an annual cycle aligned with the academic year. At the start of each year, the IQAC prepares a Quality Improvement Plan (QIP) in consultation with all departments. Throughout the year, it collects data, monitors progress, conducts mid-year reviews, and coordinates internal academic audits. At year-end, the IQAC compiles the AQAR for submission to NAAC, conducts feedback analysis, and shares findings with the Governing Body. Best practices are documented and disseminated institution-wide.",
    highlights: [
      'Annual Quality Improvement Plan (QIP) prepared each year',
      'Continuous data collection and progress monitoring',
      'Mid-year and end-year review cycles',
      'Coordinates internal academic audits each semester',
      'Annual AQAR submitted to NAAC',
      'Best practices documented and shared across departments',
    ],
  },

  {
    slug: 'quality-parameters',
    title: 'Quality Parameters',
    category: 'iqac',
    icon: '📊',
    desc: 'The key quality benchmarks and performance indicators tracked by VWU\'s IQAC across NAAC\'s seven criteria for institutional excellence.',
    intro: "VWU's IQAC monitors institutional quality using a comprehensive set of parameters aligned with NAAC's seven criteria: Curricular Aspects, Teaching-Learning & Evaluation, Research & Outreach, Infrastructure, Student Support, Governance, and Institutional Values.",
    about: "Each parameter has defined targets and is reviewed quarterly. Key metrics include student-to-faculty ratio, pass rates, research publications per faculty, funded projects, placement rates, student satisfaction scores, and infrastructure utilisation. The IQAC uses a data-driven approach to identify underperforming areas and implement targeted improvements. All parameters are reported in the AQAR and benchmarked against peer institutions.",
    highlights: [
      'Aligned with NAAC seven criteria framework',
      'Quarterly review of all quality metrics',
      'Benchmarked against peer institutions nationally',
      'Tracks publications, funded projects, and placements',
      'Student satisfaction surveys conducted twice per year',
      'Data reported in AQAR and reviewed by Governing Body',
    ],
    outcomes: [
      'Criterion 1 (Curricular): 100% programmes with updated syllabi every 2 years',
      'Criterion 2 (Teaching-Learning): 90%+ results in university examinations',
      'Criterion 3 (Research): 200+ publications annually; 10+ funded projects active',
      'Criterion 4 (Infrastructure): 99% lab utilisation; 1 Gbps internet connectivity',
      'Criterion 5 (Student Support): 95%+ placement rate; 100+ scholarships disbursed',
      'Criterion 6 (Governance): All statutory committees functional; 2 Governing Body meetings/year',
    ],
  },

  {
    slug: 'iqac-committee',
    title: 'IQAC Committee',
    category: 'iqac',
    icon: '👥',
    desc: 'The composition and roles of the IQAC Committee members who drive quality assurance at VWU.',
    intro: "The IQAC Committee at VWU comprises senior faculty, administrative staff, external industry experts, and alumni representatives — collectively responsible for planning, coordinating, and reviewing quality assurance activities across the institution.",
    about: "The Committee is constituted as per NAAC guidelines and includes: the Principal as Chairperson, the IQAC Director/Coordinator (senior faculty), one senior administrative officer, at least three Heads of Departments on rotation, two external members from industry or notable alumni, and one student representative. The Committee meets quarterly and its decisions are binding on all academic and administrative units for quality-related matters.",
    highlights: [
      'Constituted as per NAAC guidelines',
      'Principal serves as Chairperson',
      'Includes industry and alumni external members',
      'Student representative included in committee',
      'Quarterly meetings with recorded decisions',
      'Decisions binding on all departments for quality matters',
    ],
    tableData: [
      { Role: 'Chairperson',          Profile: 'Principal, VWU' },
      { Role: 'Director / Coordinator', Profile: 'Senior Professor (nominated by Principal)' },
      { Role: 'Administrative Officer', Profile: 'Senior Admin Staff' },
      { Role: 'HoD Member 1',          Profile: 'Head of Department (rotation)' },
      { Role: 'HoD Member 2',          Profile: 'Head of Department (rotation)' },
      { Role: 'HoD Member 3',          Profile: 'Head of Department (rotation)' },
      { Role: 'External Expert',        Profile: 'Industry / Corporate Representative' },
      { Role: 'Alumni Representative',  Profile: 'Distinguished VWU Alumna' },
      { Role: 'Student Representative', Profile: 'Elected student representative' },
    ],
  },

  {
    slug: 'policies-procedures',
    title: 'Policies & Procedures',
    category: 'iqac',
    icon: '📋',
    desc: 'The institutional policies and standard operating procedures established by VWU\'s IQAC for academic, administrative, and quality management functions.',
    intro: "VWU has established a comprehensive set of policies and standard operating procedures (SOPs) covering all major academic and administrative functions, developed and maintained by the IQAC in collaboration with the relevant committees and departments.",
    about: "Key policies include the Teaching and Learning Policy, Examination and Evaluation Policy, Research and Publication Policy, Student Grievance Policy, Anti-Ragging Policy, POSH Policy, Procurement Policy, and Green Campus Policy. Each policy document includes objectives, scope, responsibilities, procedures, and review mechanisms. All policies are reviewed annually by the IQAC and updated as required to reflect changes in regulatory guidelines, best practices, or institutional context.",
    highlights: [
      'Comprehensive policy framework covering all functions',
      'Teaching, Examination, Research, and Grievance policies',
      'POSH, Anti-Ragging, and Procurement policies in place',
      'Each policy includes clear objectives and responsibilities',
      'Annual review by IQAC and relevant committees',
      'All policies available to staff and students in the intranet',
    ],
  },

  {
    slug: 'annual-reports',
    title: 'Annual Reports & Reforms',
    category: 'iqac',
    icon: '📰',
    desc: 'Annual Quality Assurance Reports (AQAR) submitted to NAAC, along with key institutional reforms initiated in each academic year.',
    intro: "VWU's IQAC prepares and submits the Annual Quality Assurance Report (AQAR) to NAAC every year, documenting the institution's academic achievements, quality initiatives, best practices, and improvement actions taken during the year.",
    about: "The AQAR captures data across all seven NAAC criteria and includes qualitative write-ups on best practices, institutional achievements, student performance, research output, and governance milestones. Annual reforms documented in recent AQARs include the introduction of the Choice Based Credit System, blended learning models, NEP-aligned programme structures, and expanded industry partnerships. The reports are reviewed by the Governing Body and serve as the foundation for NAAC re-accreditation.",
    highlights: [
      'Annual AQAR submitted to NAAC for each academic year',
      'Covers all seven NAAC criteria with data and analysis',
      'Documents best practices and institutional achievements',
      'Reviewed by Governing Body each year',
      'Foundation for NAAC re-accreditation preparation',
      'Recent reforms: CBCS, blended learning, NEP alignment',
    ],
    outcomes: [
      'NAAC Accreditation maintained with consistent quality',
      'CBCS introduced across all UG and PG programmes',
      'Blended learning infrastructure set up for hybrid delivery',
      'NEP-compliant programme structures introduced from 2022-23',
      'Industry certification integrated as credit-bearing courses',
    ],
  },

  {
    slug: 'nirf-reports',
    title: 'MHRD NIRF Reports',
    category: 'iqac',
    icon: '🇮🇳',
    desc: 'VWU\'s submissions and rankings under the Ministry of Education\'s National Institutional Ranking Framework (NIRF), reporting key performance metrics nationally.',
    intro: "VWU participates in the Ministry of Education's National Institutional Ranking Framework (NIRF) annually, submitting detailed data across five parameters: Teaching, Learning & Resources; Research & Professional Practice; Graduation Outcomes; Outreach & Inclusivity; and Perception.",
    about: "The NIRF submission is coordinated by the IQAC and involves data collection from all departments on faculty qualifications, research publications, funded projects, student outcomes, placements, and diversity indicators. VWU's NIRF ranking reflects its strong placement record, industry engagement, and research activity. The data submitted for NIRF also informs strategic planning and benchmarking against peer institutions.",
    highlights: [
      'Annual NIRF submission coordinated by IQAC',
      'Covers five parameters: TLR, RP, GO, OI, and Perception',
      'Data collected from all departments and the TPO Cell',
      'Used for benchmarking against peer institutions',
      'Reflects strong placement, research, and diversity performance',
      'Submission reviewed and approved by Principal before submission',
    ],
  },

  {
    slug: 'nba-data',
    title: 'NBA – Data Capturing Points',
    category: 'iqac',
    icon: '🏆',
    desc: 'Programme-level quality documentation maintained for NBA (National Board of Accreditation) accreditation across VWU\'s engineering programmes.',
    intro: "VWU maintains comprehensive NBA accreditation documentation for its engineering programmes. The NBA Data Capturing Points (DCP) system ensures that all programme outcomes (POs), course outcomes (COs), and programme educational objectives (PEOs) are defined, assessed, and attainment is measured systematically.",
    about: "NBA accreditation is outcome-based and requires extensive data on curriculum mapping, CO-PO attainment levels, student exit surveys, employer surveys, and alumni feedback. VWU's departments maintain semester-wise DCP files documenting CO attainment for each course, PO attainment at programme level, and actions taken to bridge attainment gaps. The IQAC reviews DCP files annually and coordinates NBA submission for eligible programmes.",
    highlights: [
      'Outcome-Based Education (OBE) framework implemented',
      'Programme Outcomes (POs) defined for all UG programmes',
      'Course Outcomes (COs) mapped to POs for all courses',
      'CO and PO attainment measured every semester',
      'Student, employer, and alumni surveys conducted annually',
      'IQAC coordinates NBA documentation and submission',
    ],
    outcomes: [
      'Multiple programmes NBA accredited across CSE, ECE, EEE, and Mechanical Engineering',
      'CO attainment targets set and achieved annually',
      'OBE framework adopted across all departments from 2018',
      'Annual gap analysis leads to targeted curriculum improvements',
    ],
  },
];

export const govCategories = [
  {
    key: 'governance' as const,
    label: 'Governance',
    icon: '🏛️',
    desc: 'Apex statutory bodies governing the academic, financial, and strategic direction of VWU.',
  },
  {
    key: 'committees' as const,
    label: 'Committees',
    icon: '🏫',
    desc: 'Standing committees ensuring quality, welfare, compliance, and transparency across all institutional functions.',
  },
  {
    key: 'iqac' as const,
    label: 'IQAC',
    icon: '✅',
    desc: 'Internal Quality Assurance Cell — driving continuous quality improvement and NAAC accreditation at VWU.',
  },
];

export function findGovItemBySlug(slug: string): GovItem | null {
  return govItems.find(i => i.slug === slug) ?? null;
}
