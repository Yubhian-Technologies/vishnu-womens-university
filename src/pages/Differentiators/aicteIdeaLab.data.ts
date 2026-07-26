// Rich hardcoded content for the AICTE IDEA Lab differentiator page
// (slug: aicte-idea-lab), sourced from the site owner's AICTE AQIS
// application document — overrides that item's generic Firestore
// intro/about text in DifferentiatorDetail.tsx.
export interface InfoField {
  label: string;
  value: string[];
}

export const aicteIdeaLab = {
  tagline: 'AICTE-Idea Development, Evaluation & Application (IDEA) Lab',
  paragraphs: [
    'The purpose of IDEA Lab is to provide all facilities under one roof, for conversion of an idea into a prototype. With these facilities in the campus, more students and faculty will be encouraged to take up creative work and in the process, get training on creative thinking, problem solving, collaboration etc. which conventional labs are not able to. The focus will be on training students so that they become imaginative and creative and stay so at the workplaces they join. The whole idea is to transform engineering education with such a Lab in all colleges and for this they must proactively expose all students to the IDEA Lab, organize training sessions for interested students as well as support projects and by providing online learning materials.',
    'Teachers must also get trained in these Labs to know their scope and opportunities in teaching learning processes as well as research and development projects. They should encourage the students to take up and themselves get involved in activities, projects, internships which involve utilization of such Labs. They must strive for creating problems/ projects/ internships in their own subjects/disciplines and mentor the students.',
  ],
  fields: [
    { label: 'AQIS Application ID', value: ['IDEA202000128'] },
    { label: 'Name of Institute, City and State', value: ['Shri Vishnu Engineering College for Women,', 'Bhimavaram, West Godavari District, Andhra Pradesh.'] },
    { label: 'Head of the Institution', value: ['Dr. G. Srinivasa Rao (Ph.D. from Faculty of Mechanical Engg.)'] },
    { label: 'Faculty Coordinator', value: ['Dr. P. Srinivasa Raju (Ph.D. from Faculty of Mechanical Engg.)'] },
    { label: 'Faculty Coordinator', value: ['Dr. S. Hanumanth Rao (Ph.D. from Faculty of ECE.)'] },
    { label: 'Guru', value: ['Dr. T. Sudheer Kumar'] },
    { label: 'Guru', value: ['Dr. M. Prem Kumar'] },
    { label: 'Guru', value: ['Dr. B. Satya Krishna'] },
    { label: 'Guru', value: ['Mr. N. Kalyana Chakravarthy'] },
  ] as InfoField[],
  vision: [
    'To Provide Agile Platform for Students to make their idea to work and engage well in their education program',
    'To build effective network between institutes and inculcate cooperative and project based learning culture to students',
    'To provide echo system for faculty to experiment / practice the "Learn while make" teaching philosophy.',
    'To provide platform for faculty to interact with other Idea labs and network with them for disseminating knowledge to students.',
    'To try and get insights in to their research activities by preparing proof of concept in faculty research journey',
    'To practice GREEN initiatives in all the activities of proposed IDEA Lab',
  ],
};
