// Rich hardcoded content for the Vehicle Design Lab differentiator page
// (slug: vehicle-design-lab) — overrides that item's generic Firestore
// intro/about text in DifferentiatorDetail.tsx.
export interface VdlMember {
  name: string;
  designation?: string;
  email?: string;
  mobile?: string;
  interests?: string;
}

export interface VdlObjective {
  lead: string;
  text: string;
}

export interface VdlFacilityPhase {
  title: string;
  paragraph: string;
  mediaType: 'video' | 'photo';
  videoUrl?: string;
}

export interface VdlProjectBullet {
  lead: string;
  text: string;
}

export interface VdlEndowment {
  id: string;
  title: string;
  bestowedBy: string;
  contribution: string;
}

export interface VdlAccordionItem {
  title: string;
  text: string;
}

export interface VdlOutcomeItem {
  title: string;
  text: string;
}

export const vehicleDesignLab = {
  paragraphs: [
    'Department of Mechanical Engineering established Vehicle Design Lab, Centre of excellence under Shri Vishnu Engineering college for Women(A), Bhimavaram, Andhra Pradesh. The COE is inaugurated by Mr. Kamal Bali - Managing Director of Volvo Eicher Pvt Ltd on 11-03-2019.',
    'The primary objective of this lab is to enable students to design and fabricate vehicles for various national-level competitions like SAE BAJA-ATV, SUPRA-F1, Go-kart, and ESVC-Solar car. Prior to its inception, our students were actively participating in the national-level BAJA SAEINDIA competition organized by SAEINDIA.',
    'Equipped with all essential computing and software facilities, the Vehicle Design Lab (VDL) provides students with the necessary tools for modeling, analysis, design, and drafting during the vehicle design process. VDL offers comprehensive facilities to Mechanical Engineering students involved in the design and development of automotive systems, particularly for all-terrain vehicles and campus utility vehicles.',
    'VDL provides all the facilities to Mechanical Engineering students involved in design and development of automotive systems for all terrain vehicles. VDL regularly trains the students in collaboration with industries to make students industry ready. In VDL, students learn the fundamentals of:',
  ],
  fundamentals: [
    'Vehicle Design & Simulation',
    'Vehicle Power-Train systems',
    'Vehicle Stability',
    'Vehicle Servicing',
    'Vehicle fabrication',
    'Vehicle Testing',
  ],
  vision: 'To meet the current challenges of the Automotive Industries, this program emphasizes ethical values and enhances personal skills through hands-on practices, developing students at various levels.',
  mission: 'Our mission is to develop and use novel, quantitative integrated design methods that can facilitate the best overall vehicle design solutions, complementing qualitative methods for integrated vehicle design.',
  objectives: [
    { lead: 'Hands-on Learning:', text: ' Providing students with practical experience in designing, building, and testing various vehicle components and systems.' },
    { lead: 'Motorsport Engineering:', text: ' Students are trained and encouraged to participate in different Motorsport Events like BAJA, EFFICYCLE, REEV, SUPRA, GOKART, etc. where the students get national exposure by competing with other teams and thus making students learn vehicle dynamics and Applications of Automobile Engineering.' },
    { lead: 'Interdisciplinary Education:', text: ' Fostering collaboration between students from different engineering disciplines such as mechanical engineering, computer science to simulate real-world design environments.' },
    { lead: 'Innovation and Research:', text: ' Encouraging students and faculty to conduct research and develop innovative solutions to current challenges in vehicle design, such as improving fuel efficiency, enhancing safety features, or integrating new technologies.' },
    { lead: 'Industry Collaboration:', text: ' Partnering with automotive companies and research institutions to gain access to cutting-edge technologies, industry expertise, and potential internships or job opportunities for students.' },
    { lead: 'Ethical and Sustainable Design:', text: ' Promoting ethical practices and emphasizing the importance of sustainability in vehicle design, including reducing environmental impact and considering societal needs.' },
    { lead: 'Professional Development:', text: " Offering workshops, seminars, and training sessions to enhance students' technical skills, project management abilities, and communication skills, preparing them for careers in the automotive industry or further academic pursuits." },
    { lead: 'Community Engagement:', text: ' Engaging with the local community through outreach programs, educational initiatives, and collaborative projects to address transportation challenges and contribute to societal welfare.' },
  ] as VdlObjective[],
  team: {
    labHead: {
      name: 'P. Srinivasa Raju',
      designation: 'Professor',
      mobile: '9949433561',
      interests: 'Design and Fuel cells',
    } as VdlMember,
    facultyMembers: [
      {
        name: 'Manoneet Kumar',
        designation: 'Assistant Professor',
        email: 'manoneet.kumar@svecw.edu.in',
        mobile: '9100212043',
        interests: 'Automobile engineering',
      },
      {
        name: 'A.S.V. Prasad',
        designation: 'Assistant Professor',
        email: 'asvprasadme@svecw.edu.in',
        mobile: '8179097633',
        interests: 'Thermal engineering',
      },
    ] as VdlMember[],
  },
  facilities: {
    overview: 'The Vehicle Design Lab is equipped with state-of-the-art tools, equipment and software necessary for vehicle design and fabrication. The facility encompasses designated areas for design workstations, fabrication workshops, testing tracks, and storage spaces for vehicle components and prototypes. Additionally the lab also has additional equipment like Fein-Pipe Notch making machine, Power tools, TIG welding machine, etc. which helps the students to work more smarter and faster to meet their project deadlines.',
    activitiesPrograms: [
      {
        title: '1. Design Phase',
        paragraph: 'Students engage in conceptualizing and designing vehicles using Computer-Aided Design (CAD) software. They work on creating detailed 3D models that encompass aspects such as Driver Ergonomics, aerodynamics, structural integrity, and performance optimization by using the software like Solidworks, CATIA, Hypermesh, Ansys, Lotus shark, MATLAB-Simulink, Carmaker, etc.',
        mediaType: 'photo',
      },
      {
        title: '2. Fabrication Phase',
        paragraph: 'After finalizing the designs, students move on to the fabrication phase. The lab is equipped with machinery such as Pipe Notch making machine, 3D printers, welding stations, and assembly areas where students fabricate vehicle components and assemble prototypes.',
        mediaType: 'photo',
      },
      {
        title: '3. Testing Phase',
        paragraph: 'The lab features a dedicated testing area at South campus of Sri Vishnu Educational Society where students evaluate the performance of their vehicles. This includes dynamic testing on test tracks for assessing speed, handling, and durability. Additionally, students conduct static tests to evaluate structural integrity and safety features. This is a very unique facility named "Vishnu ATV & Gokart Track" which is spread over 2.5 acres of land.',
        mediaType: 'photo',
      },
      {
        title: '4. Motorsport Vehicle Projects',
        paragraph: 'Students undertake projects focused on designing and fabricating motorsport vehicles such as Formula SAE cars, Baja off-road vehicles, Gokarts and electric race cars. These projects involve competition participation where students showcase their vehicles and compete with teams from other institutions like IITs, NITs, Private Universities etc. We have a record of being top team in SAEINDIA BAJA for last 05 continuous years.',
        mediaType: 'photo',
      },
    ] as VdlFacilityPhase[],
    campusUtilityIntro: 'In addition to motorsport vehicles, students also work on designing and fabricating campus utility vehicles. These projects focus on developing efficient and sustainable vehicles for campus transportation, maintenance, and logistics purposes.',
    campusUtilityProjects: [
      { lead: 'Electric Cargo Vehicle –', text: ' The vehicle is completely fabricated in-house with 5kW PMSM motor and 72V power supply having a battery capacity of 7.2kW. The vehicle is currently used for in-campus utility purposes with a maximum payload capacity of 950kg.' },
      { lead: 'Electric Gokart –', text: ' Design and Fabrication is done in-house of college and the vehicle is used for different national motorsport competitions and has bagged a series of awards since 2019. Gokart is having a 2kW motor nominal power and battery pack of 2.88kW.' },
      { lead: 'Electric Bike for Campus Utility –', text: ' A double seater capacity electric bike is designed and fabricated at college campus with a hub motor of 1kW capacity and is used for in-campus utility purposes and having a range of 40km at normal Indian temperature conditions.' },
      { lead: 'Electric Bicycle for Railway Track Inspection (Gangman Electric Cycle) –', text: " We have designed and Fabricated India's First Gangman Electric Cycle which is used for Railway Track Inspection by Gangman and the project is successfully tested and donated to Bhimavaram Town Railway station. For the same we have also received an appreciation certificate from Railways." },
      { lead: 'Fish Feed Electric Boat (consultancy project for Uno Feeds company) –', text: ' We have designed and manufactured a fish feed electric propulsion system for UNO FEEDS Company which is a Fish Feed Company at Komarada, Bhimavaram. The project is successfully tested at the company location.' },
      { lead: 'Campus Shuttle Solar Vehicle –', text: " We have modified a 11 Seater Campus Shuttle BEV (Battery Electric Vehicle) into a Solar-Electric vehicle which can be charged while it's running." },
      { lead: 'Retrofitment of TATA ACE Campus Vehicle –', text: ' We are Retrofitting an existing TATA Ace vehicle with L5 kit for Electric Vehicles and the vehicle is fitted with 10kW PMSM motor and battery pack of 10.8kW. The vehicle is having a payload capacity of 1.5 Tons.' },
      { lead: 'Hybrid Activa –', text: ' We have converted an existing Honda Activa to hybrid vehicle where the vehicle has 09kW of motor and 1.5kW battery pack, reaches a maximum speed of 45kmph with 02 seating capacity and range of 40 km in a single charge.' },
      { lead: 'Electric Splendor –', text: ' We have converted an existing Hero Splendor to electric vehicle where the vehicle has 1.5kW of motor and 3.2kW of battery pack, reaches a maximum speed of 73kmph with 02 seating capacity and range of 90 km in a single charge.' },
      { lead: 'Retrofitment of Maruti ECCO Campus Vehicle –', text: ' We are Retrofitting an existing Maruti ECCO vehicle with L5 kit for Electric Vehicles and the vehicle will be fitted with 10kW PMSM motor and battery pack of 09 kW. The vehicle is 08 seater capacity with max speed limited to 30kmph and range is 60km in a single charge.' },
    ] as VdlProjectBullet[],
  },
  industryCollaborations: {
    intro: "In an exemplary demonstration of corporate collaboration and support for academic institutions, several esteemed automotive companies have bestowed valuable equipment and vehicles. These generous contributions serve to enhance the educational experience of students and facilitate hands-on learning opportunities in the field of automotive engineering. Here's a brief overview of the notable endowments received.",
    endowments: [
      {
        id: 'ford-figo-vehicle',
        title: 'Ford Figo Vehicle',
        bestowedBy: 'Ford India Pvt Ltd',
        contribution: 'Ford India Pvt Ltd graciously gifted a Ford Figo vehicle. This vehicle serves as a valuable asset for students studying automotive engineering, providing them with a practical platform for learning about vehicle dynamics, systems integration, and performance analysis.',
      },
      {
        id: 'volvo-powertrain-cut-section',
        title: 'Cut Section of Volvo Powertrain',
        bestowedBy: 'Volvo India Pvt Ltd',
        contribution: 'Volvo India Pvt Ltd generously provided a cut section of a Volvo powertrain. This specialized equipment offers students a unique opportunity to gain insights into the intricate workings of modern powertrain systems, including engines, transmissions, and drivetrain components.',
      },
      {
        id: 'mg-hector-plus-vehicle',
        title: 'MG Hector Plus Vehicle and MG Powertrain Cut Section',
        bestowedBy: 'MG Motors',
        contribution: 'MG Motors, a leading automotive manufacturer, has bestowed both a MG Hector Plus vehicle and a cut section of an MG powertrain. These contributions are invaluable assets for students, enabling them to explore the latest automotive technologies and gain practical experience in vehicle design, analysis, and maintenance.',
      },
    ] as VdlEndowment[],
    closing: 'These endowed equipment and vehicles represent a significant investment in the education and training of future automotive engineers. By providing students with access to real-world automotive components and vehicles, these contributions contribute to the enhancement of the academic curriculum and the development of skilled professionals in the automotive industry. The partnership between SVECW and these esteemed automotive companies exemplifies a commitment to fostering innovation, collaboration, and excellence in engineering education.',
  },
  studentsAchievements: {
    intro: 'At Shri Vishnu Engineering College for Women, we take immense pride in nurturing talent and empowering our students to achieve remarkable feats in the field of engineering. Our women students have consistently demonstrated their prowess and innovation in various national competitions, leaving an indelible mark on the engineering landscape. Join us as we celebrate the remarkable achievements of our students in prestigious competitions such as e-Baja, m-Baja, Karting Championship, and Electric Solar Vehicle Championships conducted by SAE.',
    competitions: [
      {
        title: 'e-Baja and m-Baja Competitions',
        text: 'Our women students have showcased exceptional skills and innovation in the e-Baja and m-Baja competitions organized by the Society of Automotive Engineers (SAE). These competitions test the engineering capabilities and design prowess of participants in building off-road vehicles capable of enduring harsh terrains. With their ingenuity and dedication, our students have consistently clinched top positions, demonstrating their ability to overcome technical challenges and push the boundaries of conventional engineering.',
      },
      {
        title: 'Karting Championship',
        text: 'In the high-speed world of karting, our women students have proven themselves as formidable competitors. With a passion for speed and precision, they have competed in national karting championships, showcasing their racing skills and engineering acumen. Through rigorous training and relentless pursuit of excellence, our students have stood on the podium numerous times, cementing their reputation as some of the brightest talents in the realm of motorsports.',
      },
      {
        title: 'Electric Solar Vehicle Championships',
        text: 'In an era where sustainability and innovation reign supreme, our women students have embraced the challenge of designing and building electric solar vehicles. These competitions, which focus on harnessing renewable energy and promoting eco-friendly transportation solutions, provide a platform for students to showcase their commitment to a greener future. With their cutting-edge designs and forward-thinking approach, our students have emerged as frontrunners in the Electric Solar Vehicle Championships, gaining accolades for their innovative and sustainable engineering practices.',
      },
    ] as VdlAccordionItem[],
    closing: 'The achievements of our women students in national competitions like e-Baja, m-Baja, Karting Championship, and Electric Solar Vehicle Championships stand as a testament to their talent, dedication, and unwavering spirit. At Shri Vishnu Engineering College for Women, we are committed to providing a nurturing environment where students can unleash their potential and realize their dreams. Join us in celebrating the remarkable accomplishments of our students as they continue to inspire and redefine the possibilities in the field of engineering.',
    placementsParagraphs: [
      'At Shri Vishnu Engineering College, we believe in providing our students with practical, hands-on experience that goes beyond the confines of traditional learning. Through our state-of-the-art Vehicle Design Lab and active participation in various national competitions, our students have not only honed their skills but also secured coveted placements in leading organizations.',
      'The synergy between our Vehicle Design Lab and participation in national competitions has been instrumental in shaping the career paths of our students. By immersing themselves in real-world engineering challenges and pushing the boundaries of innovation, our students have gained invaluable experience that has caught the attention of top recruiters. Through their achievements in competitions such as e-Baja, m-Baja Championship, and Electric Solar Vehicle Championships, our students have demonstrated their ability to excel in dynamic environments and tackle complex engineering problems. This hands-on experience, coupled with the guidance of our expert faculty, has empowered our students to secure placements in renowned companies, paving the way for promising careers in the field of engineering.',
      'Many graduates from the program have secured positions in leading automotive companies and research institutions like Caterpillar, Hero Motocorp, John Deere, Bosch, Renault Nissan, Eproc, Honda 2-Wheeler, Mercedes Benz, Daimler Trucks, Mahindra & Mahindra, Saint Gobain, Thermax Global, etc.',
      "The lab's activities contribute to the institution's reputation as a center for excellence in engineering education and research. It serves as a platform for showcasing students' talents and capabilities in the field of vehicle design and fabrication, several vehicle projects from the lab have received recognition in national and international competitions and also Vehicle Design Lab holds 02 patent applications in the field of Electric vehicle.",
    ],
    achievementReports: [
      { label: 'ME-VDL Achievements 2024-25', href: 'https://firebasestorage.googleapis.com/v0/b/vishnu-womens-university.firebasestorage.app/o/downloads%2Fvdl-achievements-2024-25.pdf?alt=media&token=b5840960-1b7a-4604-b81f-69572d52e56d' },
      { label: 'ME-VDL Achievements 2023-24', href: 'https://firebasestorage.googleapis.com/v0/b/vishnu-womens-university.firebasestorage.app/o/downloads%2Fvdl-achievements-2023-24.pdf?alt=media&token=35e55793-25c8-48ba-832c-e635b4af4df8' },
      { label: 'ME-VDL Achievements 2022-23', href: 'https://firebasestorage.googleapis.com/v0/b/vishnu-womens-university.firebasestorage.app/o/downloads%2Fvdl-achievements-2022-23.pdf?alt=media&token=b02ede7b-8328-4fe9-b789-5ef723dc4827' },
      { label: 'ME-VDL Achievements 2021-22', href: 'https://firebasestorage.googleapis.com/v0/b/vishnu-womens-university.firebasestorage.app/o/downloads%2Fvdl-achievements-2021-22.pdf?alt=media&token=546c5a0b-716e-42f5-b66d-36bf8a2c742c' },
      { label: 'ME-VDL Achievements 2020-21', href: 'https://firebasestorage.googleapis.com/v0/b/vishnu-womens-university.firebasestorage.app/o/downloads%2Fvdl-achievements-2020-21.pdf?alt=media&token=6558cf1f-1d8f-4a25-85b6-99d05b5876f2' },
      { label: 'ME-VDL Achievements 2019-20', href: 'https://firebasestorage.googleapis.com/v0/b/vishnu-womens-university.firebasestorage.app/o/downloads%2Fvdl-achievements-2019-20.pdf?alt=media&token=11435a11-c3ab-4f21-9c06-7586f81d3aea' },
      { label: 'ME-VDL Achievements 2018-19', href: 'https://firebasestorage.googleapis.com/v0/b/vishnu-womens-university.firebasestorage.app/o/downloads%2Fvdl-achievements-2018-19.pdf?alt=media&token=c106e2c3-3469-4041-80b6-404a5870afd2' },
      { label: 'ME-VDL Achievements 2017-18', href: 'https://firebasestorage.googleapis.com/v0/b/vishnu-womens-university.firebasestorage.app/o/downloads%2Fvdl-achievements-2017-18.pdf?alt=media&token=726a88d1-ce8b-438c-975b-5781c1f840e5' },
      { label: 'ME-VDL Achievements 2016-17', href: 'https://firebasestorage.googleapis.com/v0/b/vishnu-womens-university.firebasestorage.app/o/downloads%2Fvdl-achievements-2016-17.pdf?alt=media&token=6a702ec6-fb9f-47c3-98c0-206995732970' },
    ] as { label: string; href: string }[],
  },
  outcomes: [
    { title: '1. Job opportunities', text: 'Helps to develop practical engineering skills that are highly valuable in job market by enhancing practical experience and the ability to apply theoretical knowledge to real world problems.' },
    { title: '2. Higher education', text: 'Assists students in pursuing higher education in a variety of fields, including business, the automotive etc.' },
    { title: '3. Knowledge on emerging technologies', text: 'Provides insights on new technologies like ADAS, 3D printing etc. and shapes the future of engineering by making it more dynamic, efficient, and innovative.' },
    { title: '4. Enlarging spectrum in technical and practical approaches', text: 'Increases problem-solving and planning skills, enhance the managing capability, along with core technical knowledge.' },
    { title: '5. Networking', text: 'Provides OEM level engagement and connects students with automotive industry experts, opening doors to internships, jobs and valuable connections.' },
    { title: '6. Advanced software learning', text: 'Teams gain valuable experience in advanced software learning with IPG Carmaker, MATLAB. This simulation software enables testing and refinement of vehicle dynamics, aiding teams in optimizing the performance, safety, and overall design of their off-road vehicles.' },
    { title: '7. Personality development', text: 'This improves working as teams, which enhances ability to collaborate effectively, communicate ideas, and manage group dynamics. These soft skills are crucial in any professional setting and are highly regarded by employers.' },
  ] as VdlOutcomeItem[],
};
