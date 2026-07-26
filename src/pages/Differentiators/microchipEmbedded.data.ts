// Rich hardcoded content for the Microchip Embedded System differentiator
// page (slug: microchip-embedded) — overrides that item's generic
// Firestore intro/about text in DifferentiatorDetail.tsx.
export interface TeamMember {
  name: string;
  designation?: string;
  email?: string;
  mobile?: string;
  callSign?: string;
  interests?: string;
  profileLink?: string;
}

export const microchipEmbedded = {
  paragraphs: [
    'The Microchip Center of Excellence, established in collaboration with EduSkills, is a cutting-edge facility aimed at bridging the gap between academic knowledge and industry-relevant skills in embedded systems. Equipped with the latest PIC microcontroller-based development boards, the lab offers students hands-on experience in designing, programming, and testing real-time embedded applications. The lab features a wide range of PIC microcontrollers, from basic 8-bit to advanced 16-bit and 32-bit variants, along with development tools and hardware debugging kits. This comprehensive setup allows students to explore various applications, including IoT, automation, sensor-based systems, and communication protocols.',
    "Through this initiative, students gain valuable exposure to real-world project environments. Regular workshops, training sessions, and project-based learning activities help them build technical competencies and improve problem-solving skills. The center also supports online certification programs via EduSkills, enhancing students' resumes and job readiness. Faculty members are trained under the program to ensure continuous mentoring and guidance. This knowledge-sharing model ensures the long-term sustainability and growth of embedded systems learning within the institution. The lab benefits students across multiple disciplines such as electronics, electrical, and computer science, serving as a hub for interdisciplinary innovation and entrepreneurship. In essence, the Microchip Center of Excellence provides students with a platform to build practical skills, develop industry-ready projects, and prepare for careers in core technologies, all while working on the latest PIC microcontroller platforms.",
  ],
  vision: [
    'Through collaborative research initiatives and partnerships with industry and academia, the COE fosters a culture of leadership in microchip innovation, positioning itself as a nationally and internationally recognized hub of excellence.',
    'By addressing pressing societal challenges through the development of cutting-edge microchip technologies, the COE drives meaningful technological advancements that benefit communities and industries alike.',
    "The COE's commitment to global collaboration and forward-thinking research contributes to the evolution of the microchip industry, reinforcing its role in shaping the future of technology on a worldwide scale.",
  ],
  mission: [
    'The COE is dedicated to advancing microchip research, development, and innovation through interdisciplinary collaboration, cutting-edge technology, and academic excellence. We aim to empower students, researchers, and industry partners to create high-impact solutions that address real-world challenges, foster sustainable development, and contribute to the growth of a resilient and globally competitive microchip ecosystem.',
  ],
  objectives: [
    'Advance Research and Innovation: Promote cutting-edge research in microchip design, fabrication, and testing, fostering breakthroughs that address emerging technological and societal needs.',
    'Develop Skilled Talent: Provide high-quality education, hands-on training, and mentorship to cultivate a new generation of engineers and researchers with expertise in microchip technologies.',
    'Strengthen Industry-Academia Collaboration: Establish strong partnerships with industry, academia, and government to facilitate knowledge exchange, joint projects, and the commercialization of microchip solutions.',
    'Promote Sustainable and Inclusive Technologies: Design and develop microchip solutions that are energy-efficient, cost-effective, and accessible, contributing to sustainable development and inclusive technological growth.',
  ],
  team: {
    heading: 'Team (Microchip Embedded System)',
    inCharge: {
      name: 'E. R. Praveen Kumar',
      designation: 'Assistant Professor',
      email: 'emani3815@svecw.edu.in',
      mobile: '9700963994',
      interests: 'Signal Processing, Embedded & IOT',
      profileLink: 'https://svecw.irins.org/profile/145727',
    } as TeamMember,
    facultyMembers: [
      {
        name: 'Dr. M. V. Ganeswara Rao',
        designation: 'Associate Professor',
        email: 'mgr_ganesh@svecw.edu.in',
        mobile: '9497123439',
        interests: 'VLSI, Image Processing, Embedded & IOT, ML & DL',
        profileLink: 'https://svecw.irins.org/profile/196149',
      },
      {
        name: 'Ms. M. Hemalatha',
        designation: 'Assistant Professor',
        email: 'mhemalathaece@svecw.edu.in',
        mobile: '6302016121',
        interests: 'Image Processing, Embedded & IOT, ML & DL',
        profileLink: 'https://vidwan.inflibnet.ac.in/profile/513272',
      },
      {
        name: 'Ms. T. Pavani Varma',
        designation: 'Assistant Professor',
        email: 'pavaniece@svecw.edu.in',
        mobile: '7780442623',
        interests: 'Image Processing, Embedded & IOT, ML & DL',
        profileLink: 'https://svecw.irins.org/profile/149729',
      },
      {
        name: 'Mr. D. Murali Krishna',
        designation: 'Assistant Professor',
        email: 'ece_krishnad@svecw.edu.in',
        mobile: '9490145567',
        interests: 'Image Processing, Embedded & IOT, ML & DL',
        profileLink: 'https://svecw.irins.org/profile/196149',
      },
      {
        name: 'D. Ramesh Varma',
        designation: 'Assistant Professor',
        email: 'varmaramesh422@svecw.edu.in',
        mobile: '9963630435',
        callSign: 'VU2AZU',
        interests: 'RF & Microwave',
      },
    ] as TeamMember[],
  },
  activities: [
    'AICTE ATAL – EduSkills Microchip Embedded Systems Developer',
  ],
  outcomes: [
    'Conducted an AICTE ATAL – EduSkills Microchip Embedded Systems Developer Faculty Development Program.',
  ],
};
