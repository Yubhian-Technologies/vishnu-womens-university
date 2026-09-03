// Rich hardcoded content for the Institution Innovation Cell differentiator
// page (slug: institution-innovation-cell) — overrides that item's generic
// Firestore intro/about text in DifferentiatorDetail.tsx.
export const institutionInnovationCell = {
  about: "The MHRD's National Innovation and Startup Policy is a guiding framework that needs to be put into place in institutions to help with actions related to innovation and entrepreneurship. According to this framework, the Institution Innovation Council of SVECW takes on the task of building an environment for innovation and entrepreneurship. This is made possible by VISHVA TBI, which was started at the college under NIDHI TBI, and the Entrepreneurship Development Cell.",
  vision: [
    'To be recognized as a leading institution in the environment for promoting innovation and to spread the spirit of entrepreneurship in the campus.',
    'To make products and technologies that meet the needs of society by offering the innovative minds to be job providers.',
  ],
  mission: [
    'Organise regular workshops, seminars, and interactive sessions with entrepreneurs, investors, and professionals to facilitate the dissemination and cultivation of creative ideas.',
    'Engage in professional networking activities with professionals and established national organisations focused on fostering entrepreneurship.',
    'Organize idea contests and Project Exhibitions to showcase the innovative ideas.',
    'Create an ecosystem that will foster entrepreneurial spirit among Faculty and Students.',
    'Offer mentorship to translate ideas into products and services that cater to the needs of the society.',
  ],
  journeyTitle: 'Journey of IIC established at the Institute',
  journey: "The Institution's Innovation Council (IIC) is one of the Unique Initiatives of MoE's Innovation Cell, Govt. of India to promote Innovation, Start-up and Entrepreneurship activities. Our college registered for IIC in A.Y: 2018-2019, to promote the vision of IIC in terms of Innovation, Start-up and Entrepreneurship among faculty members and students. College got a star rating of 4 out of 5 in IIC 5.0 and ranked in the band of 151-300 in the category of NIRF Innovation ranking 2023. Faculty and Students actively take part in various programs conducted by MIC, IIC and the college also conducts related activities on its own as self-driven activities.",
  constitution: {
    intro: 'As per the Institutions Innovation Council, Ministry of Education guidelines the institute has formulated the IIC council. The IIC council is comprised up with the following members.',
    heading: 'Key Functionaries of the IIC',
    chairman: { name: 'Sri K. V. Vishnu Raju', role: 'Chairman' },
    leadership: [
      { name: 'Dr. G. Srinivasa Rao', role: 'Head of the Institute (HOI)' },
      { name: 'Prof. P. Venkata Rama Raju', role: 'President' },
      { name: 'Dr. G.R.L.V.N. S. Raju', role: 'Convener' },
    ],
    coordinators: [
      { name: 'Dr. V.V.R. Maheswara Rao', role: 'NIRF Coordinator' },
      { name: 'Dr. K. Padma Vasavi', role: 'IPR Activity Coordinator' },
      { name: 'Dr. S.M. Padmaja', role: 'Innovation Activity Coordinator' },
      { name: 'Dr. P. Kiran Sree', role: 'Social Media Coordinator' },
      { name: 'Dr. S. Hanumantha Rao', role: 'Internship Activity Coordinator' },
      { name: 'Dr. G. Durga Prasad', role: 'NISP Coordinator' },
      { name: 'Mr. Ch. Anudeep', role: 'Startup Activity Coordinator' },
    ],
    // The "Click here to view" council members PDF link is now
    // admin-editable — see IicDocumentsAdmin.tsx (iicCouncilMembersLinks).
  },
  // Innovation Ambassadors' role description, responsibilities, and the
  // caption above the PDF links are now admin-editable Custom Sections on
  // that tab (Admin -> Differentiators -> Institution Innovation Cell ->
  // Tabs -> Innovation Ambassadors) — the Faculty/Student PDF links
  // themselves were already admin-editable, see IicDocumentsAdmin.tsx
  // (iicInnovationAmbassadorLinks).
  activities: {
    intro: 'The Institute Innovation Council (IIC) plays a pivotal role in fostering an inclusive environment that actively engages faculty, students, and staff in a diverse array of innovation and entrepreneurship initiatives. These encompass ideation, problem-solving, proof of concept development, design thinking, intellectual property rights (IPR) considerations, and adept project handling and management, particularly during the critical pre-incubation and incubation stages. Through these multifaceted activities, the IIC cultivates a dynamic ecosystem conducive to the exploration and realization of innovative ideas within our college community.',
    // Year-by-year IIC Activities PDFs are now admin-editable — see
    // IicDocumentsAdmin.tsx (iicActivities).
  },
  atalTinkeringSchools: {
    intro: 'We are proud to announce our partnership with Atal Tinkering Labs as part of the AICTE Institution Innovation Councils (IICs) initiative. Through this collaboration, we are dedicated to empowering and mentoring school student innovators. Atal Tinkering Labs serve as vibrant centers of creativity and innovation, where young minds are encouraged to explore, experiment, and create. By providing guidance, resources, and mentorship through our IICs, we aim to inspire and support the next generation of innovators. Together, we are fostering a culture of innovation and entrepreneurship, ensuring that students have the tools and support they need to transform their ideas into impactful solutions',
    listHeading: 'List of ATL Schools',
    schools: [
      {
        sno: 1,
        schoolCode: '25141275',
        schoolName: 'D N R E M HIGH SCHOOL BHIMAVARAM',
        address: 'D.N.R.E.M.High School Bhimavaram D.N.R.College Association DNR College Road West Godavari',
        email: 'dnremhighschool@gmail.com',
        mobile: '9912883311',
        coordinator: 'Dr. S.Dileep Kumar Verma',
      },
      {
        sno: 2,
        schoolCode: '16055813',
        schoolName: 'ST ANNS ENGLISH MEDIUM SCHOOL WEST GODAVARI',
        address: 'S.P Street Bhimavaram West Godavari',
        email: 'venkatramanap69@gmail.com',
        mobile: '6281744732',
        coordinator: 'Mr. Ch. Anudeep',
      },
      {
        sno: 3,
        schoolCode: '31168295',
        schoolName: 'VISHNU SCHOOL',
        address: 'Kovvada, Andhra Pradesh-534206 West Godavari District',
        email: 'vishnupublicschool@yahoo.co.in',
        mobile: '8816222957',
        coordinator: 'Mr. L Ramgopal',
      },
    ],
  },
  // Rating Certificates, IIC Annual Reports, SIH Internal Hackathon Reports,
  // and NISP policy links are now admin-editable (label + PDF) — see
  // IicDocumentsAdmin.tsx — rather than hardcoded here. Only the NISP tab's
  // heading text remains static.
  nisp: {
    heading: 'NISP - National Innovation Start-Up Policy',
  },
};

