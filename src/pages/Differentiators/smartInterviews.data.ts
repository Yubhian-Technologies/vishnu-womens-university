// Rich hardcoded content for the Smart Interviews – C&DS Programme
// differentiator page (slug: smart-interviews) — overrides that item's
// generic Firestore intro/about text in DifferentiatorDetail.tsx.
export interface SmartInterviewsPhase {
  label: string;
  content: string;
}

export interface SmartInterviewsBatch {
  years: string;
  count: string;
}

export const smartInterviews = {
  paragraphs: [
    'Shri Vishnu Engineering College for Women in collaboration with Smart Interviews Conducting a High-End Programming Development Training called as Problem Solving with Data Structures and Algorithms (C&DS) since 2017 for the students. Today all Product Based MNC Companies looking for good programmers for development of software products so they were coming with coding contests and hackathons to recruit graduates.',
    'We are in SVECW motivating students to participate in all the coding contests by doing lot of practice along with the smart interviews training sessions. Many of Our SVECW Students Placed with high pay package ranging from 10 Lakh to 50 Lakh per Annum from Top Tech Companies like Amazon, Flipkart, Adobe, Paloalto etc... This training program divided into three different phases they are listed below',
  ],
  phases: [
    {
      label: 'Phase-1:',
      content: 'Basics of Programming, Data types & operators, Complexity Analysis, Bit-Manipulation & Applications, Recursion / Backtracking.',
    },
    {
      label: 'Phase-2:',
      content: 'Sorting / Searching Techniques & Applications, Hashing Implementation & Libraries, Subarrays & Subsequence’s, Strings & Rolling Hash, Mixed-bag Concepts.',
    },
    {
      label: 'Phase-3:',
      content: 'Stacks & Queues, Linked Lists, LRU Cache, Trees / Binary Trees / Binary Search Trees, Priority Queues, Trie DS & Applications, Dynamic Programming, Graph Theory.',
    },
  ] as SmartInterviewsPhase[],
  moreParagraphs: [
    'Every year we are selecting a maximum of 400 students from all the branches by conducting a coding contest of 2 to 3 hours in Hackerrank online platform. Smart Interviews trainers will give training in 3 phases like II Year II Semester 6 classes, III Year I Semester 10 classes and III Year II Semester 10 classes. The complete program is of 26 classes in 3 semesters.',
    'We encourage and motivate students to participate in different coding contests conducted by different organizations like TCS (Code Vita), Infosys (Hack with Infy) etc. and also platforms like code chef (Seasonal Contests) and codeforces.',
    'As we are continuously monitoring the score sheets of each batch, we can identify the performance of each student in solving problems. In between the training program schedule, we used to conduct the practice sessions for the students to better understand and to solve set of problems to excel in different languages like C, C++, JAVA and Python.',
    'Based on the leader board scores target were fixed and students will reach the given target scores based on the performance. Our college management will give financial support to the students in participation of coding contests like ACM-ICPC etc.',
    'Students of SVECW will come up with optimized better solutions for the problems through which they can understand different set of questions they may get in the interview process through online coding contests.',
    'All these students were placed at the end of the program with good pay package this process we are doing from the past 7 years. Every year the package and number of placements with good package is improving. We are encouraging students of final year who placed in good companies with good packages will be coming and explaining the interview experience and types of questions interviewer is asking all will be discussed, by which all the students of next years were benefitted.',
  ],
  batchesHeading: 'Training (3-Phases) Completed & Placed students Batch wise with high packages.',
  batches: [
    { years: '2020-2024', count: '142' },
    { years: '2019-2023', count: '95' },
    { years: '2018-2022', count: '174' },
    { years: '2017-2021', count: '209' },
    { years: '2016-2020', count: '155' },
    { years: '2015-2019', count: '161' },
    { years: '2014-2018', count: '36' },
  ] as SmartInterviewsBatch[],
};
