// Rich hardcoded content for the AR / VR Studio differentiator page
// (slug: ar-vr-studio) — overrides that item's generic Firestore
// intro/about text in DifferentiatorDetail.tsx.
export interface ArVrFacultyInCharge {
  name: string;
  designation?: string;
  email?: string;
  mobile?: string;
  interests?: string;
}

export const arVrStudio = {
  pageTitle: 'Augmented Reality and Virtual Reality Studio',
  overview: 'The AR/VR Studio at Shri Vishnu Engineering College for Women is a state-of-the-art facility dedicated to exploring, developing, and applying Augmented Reality (AR) and Virtual Reality (VR) technologies. Established as a Centre of Excellence by the department of Computer Science and Engineering on 7th of August 2024, the studio fosters innovation and provides a collaborative environment for students, faculty, and researchers to design cutting-edge solutions in education, healthcare, entertainment, and industrial domains.',
  vision: 'To be a leading hub for AR/VR innovation, empowering students and researchers to create immersive experiences that revolutionize industries and enrich human life.',
  mission: [
    'To provide comprehensive training and resources in AR/VR technologies.',
    'To bridge the gap between academic learning and industry demands by fostering collaborations and real-world applications.',
    'To encourage creativity and innovation by promoting interdisciplinary research and development.',
    'To contribute to the advancement of AR/VR technology through research and development.',
  ],
  objectives: [
    'Develop practical expertise among students in AR/VR development tools and platforms like Unity, Unreal Engine, and Blender.',
    'Facilitate industry-oriented projects, workshops, and hackathons to enhance student engagement and skill-building.',
    'Promote AR/VR applications in education, healthcare, and rural development.',
    'Establish partnerships with industry leaders to provide internships and career opportunities.',
    'Encourage research publications and patents in AR/VR technologies.',
  ],
  features: [
    "2 Meta Quest 3 128gb Devices",
    "2 Samsung S7 FE Galaxy Tab",
    "30 High Performance PC's",
    'Core i7 13th gen 16gb ram 512gb hard disk and 4gb graphics card',
    '2 Highly Configured Dedicated Servers',
    'Core i7 13th gen 32gb ram 512gb hard disk and 16gb graphics card',
    '2 Mac OS systems',
    'Sony 65-inch 4K LED TV',
    'Sony 5.1 home theatre',
    'One 2K projector',
    'One 4K projector',
    'Unity licensed for 1 year for 30 systems',
  ],
  contact: {
    name: 'AR/VR Studio',
    address: [
      'Shri Vishnu Engineering College for Women',
      'Vishnupur, Bhimavaram, Andhra Pradesh, India',
    ],
    email: 'avrcoe@svecw.edu.in',
    phone: '+91-9948055566',
    website: 'https://www.svecw.edu.in',
  },
  facultyInCharge: {
    name: 'Mr. Phaneendra Varma Chintalapati',
    designation: 'Assistant Professor',
    email: 'chpvarmacse@svecw.edu.in',
    mobile: '9948055566',
    interests: 'AR/VR, XR and Deep Learning',
  } as ArVrFacultyInCharge,
};
