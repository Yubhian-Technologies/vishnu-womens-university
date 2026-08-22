// The 16 real "Discover > Campus Life" header dropdown items (see
// src/components/Header/Header.tsx navItems). Slugs match the sub-section
// keys already used for these facilities in src/pages/Admin/sections/
// SitePhotosAdmin.tsx's DEFAULT_SECTIONS.campus, so useSitePhotos('campus',
// slug, ...) on the detail page pulls the exact same admin-editable photos.
export interface CampusFacility {
  slug: string;
  title: string;
  desc: string;
  heroSubtitle?: string;
  body?: string;
}

export const campusFacilities: CampusFacility[] = [
  { slug: 'smart-classrooms', title: 'Smart Class Rooms', heroSubtitle: "VWU's smart classrooms are equipped with interactive displays and modern audio-visual systems, creating an engaging, technology-enabled learning environment for every session.", desc: `The classrooms are architecturally designed to create a comfortable, inspiring, and student-friendly learning environment. Spacious interiors, large windows, and scientifically planned ventilation ensure an abundance of natural light and fresh air throughout the day. This thoughtfully designed atmosphere promotes concentration, creativity, and overall well-being, providing students with the ideal setting to learn, collaborate, relax, and grow both academically and personally.

Each classroom is equipped with state-of-the-art technological facilities that support modern teaching methodologies. Advanced digital teaching aids, including LCD projectors, interactive presentation systems, video players, high-speed internet connectivity, and audio-visual equipment, enable teachers to deliver engaging and effective lessons. These smart classroom facilities make learning more interactive, helping students understand concepts through visual demonstrations, multimedia presentations, educational videos, and real-time digital resources.

The integration of technology into everyday classroom instruction allows teachers to adopt innovative and student-centered teaching practices. Lessons become more dynamic through presentations, animations, virtual demonstrations, and collaborative learning activities, encouraging active participation and critical thinking among students. With access to digital resources at the click of a button, teachers can seamlessly incorporate the latest educational content into their lessons, making learning more relevant and meaningful.

The classrooms are also designed to facilitate group discussions, project-based learning, seminars, and interactive sessions that nurture communication skills, teamwork, and problem-solving abilities. Comfortable seating arrangements and a well-organized layout ensure that every student enjoys an inclusive and distraction-free learning experience.

Our technologically advanced classrooms create an environment where teaching and learning go beyond traditional methods. By blending modern infrastructure with innovative educational practices, the institution ensures that students remain actively involved in the learning process. This not only enhances the pace and quality of education but also fosters curiosity, confidence, creativity, and a lifelong passion for learning, preparing students to meet the challenges of a rapidly evolving world.` },
  {
    slug: 'state-of-the-art-labs',
    title: 'State-of-the-art Labs',
    heroSubtitle: 'Specialised laboratories across every department give students hands-on access to modern equipment and tools, supporting practical learning alongside classroom instruction.',
    body: `# State-of-the-art Labs

#### State-of-the-art laboratories are the back bone of any Engineering college. Practical exposure brings real value to an engineering degree.

- Vishnu Women's University believes in imparting strong practical exposure to its students.
- Modern laboratories are an integral part of the various departments of the college.
- Each department maintains its specialized labs, equipped with modern equipment of industry standards.
- Vishnu Women's University keeps upgrading the facilities and equipment in the laboratories to the latest industry standards, from time to time.

#### Apart from regular experiments, all departments conduct additional experiments in all laboratories to train the students in the cutting edge technologies.

- Electrical & Electronics
- Engineering Labs
- Electronics & Communication
- Engineering Labs
- Computer Science &
- Engineering Labs
- Information Technology Labs
- Mechanical Engineering Labs
- Civil Engineering Labs
- Master of Business
- Administration Labs
- Basic Science Labs`,
    desc: 'Specialised laboratories across every department give students hands-on access to modern equipment and tools, supporting practical learning alongside classroom instruction.',
  },
  {
    slug: 'central-library',
    title: 'Central Library',
    heroSubtitle: 'The Central Library offers a spacious reading environment along with a wide collection of academic texts, journals, and digital resources to support student and faculty research.',
    body: `### Discover > Campus Life

# Central Library

The Library of Shri Vishnu Engineering College for Women(Autonomous) was built to keep up International Standards. The air conditioned library has three floors with an area of 1083 Sq.m. and well-protected with security system. Specialized collections of Books, Journals & Non-book materials are available in Engineering & Technology, Basic Sciences, and Management Sciences. It is replete with 59721 volumes of books, 1380 Journal Back Volumes, 4000 CDs, and 250 audio cassettes.

The Library contributes to the fulfillment of Our Institution’s mission by selecting, acquiring, organizing, maintaining and making accessible a collection of printed and non-printed, primary and secondary materials that will support the educational, research and public service programmes of both students and faculty.

- Responding to the varying needs of the academic community by involving the faculty, the students and the administration in the development and periodic assessment of the library services and resources.
- Providing library users with point-of-use instruction, personal assistance in conducting literature research and other reference services.
- Providing an environment conducive to the optimum use of library materials and an appropriate schedule of hours of service and professional assistance.
- Participating in overall computing resources plan and providing for full library utilization of automation technology, physical facilities and equipment adequate to process, catalogue and store the materials.
- Enhancing the library’s resources and services through cooperative relationship with other libraries and agencies.

#### LIBRARY TIMINGS

**Monday – Saturday**

- Working Hours – 8.00 A.M. to 12.00 Night
- Transactions – 8.00 A.M. to 6.00 P.M.
- Digital Library – 8.00 A.M. to 12.00 Night

**Sunday & Other Holidays**

- Working Hours 10.00 a.m. to 10.00 p.m.`,
    desc: 'The Central Library offers a spacious reading environment along with a wide collection of academic texts, journals, and digital resources to support student and faculty research.',
  },
  {
    slug: 'auditoriums',
    title: 'Auditoriums',
    heroSubtitle: "VWU's auditoriums host seminars, conferences, cultural events, and convocations, providing a large, well-equipped venue for campus-wide gatherings.",
    body: `# Auditoriums

Considering that a variety of events like cultural programmes, seminars, debates, plays and other programmes are conducted throughout the year, Vishnu Women's University houses an **Indoor Auditorium, Open-air-Auditorium, Mini-Auditorium** and numerous **Seminar Halls** which facilitate the students to carry on their activities smoothly and with ease. They attract students to flock together to share, discuss and explore knowledge in their areas of learning.

**Smt. B. Seetha Indoor Auditorium** is centrally air-conditioned with a fully sound proof setup and equipped with latest technology for all types of audio/video presentations.

In addition to the Indoor Auditorium, Vishnu Women's University has an Open-air-Auditorium and Mini-Auditorium, where a vast variety of student activities are regularly arranged.

Vishnu Women's University has well equipped **air conditioned Seminar Halls** which can accommodate 250 members each. They are centers for knowledge acquisition since right ambiance is created with a podium, a computer system with internet facility, an LCD projector and a sound system.`,
    desc: "VWU's auditoriums host seminars, conferences, cultural events, and convocations, providing a large, well-equipped venue for campus-wide gatherings.",
  },
  {
    slug: 'campus-book-stores',
    title: 'Campus Book Stores',
    heroSubtitle: 'The on-campus book store stocks textbooks, stationery, and academic essentials, making it convenient for students to get what they need without leaving campus.',
    body: `# Campus Book Stores

The greatest essayist of England Francis Bacon believed that books are the best companions in a student’s life and quoted aptly about the significance of books:

**“Some books should be tasted, some devoured, but only a few should be chewed and digested thoroughly.”**

With all the right ambiance, the addition of a well-known book shop ‘Higginbotham” creates even better environment for all the students here. The shop is situated very close to the temple complex and is accessible to students.
`,
    desc: 'The on-campus book store stocks textbooks, stationery, and academic essentials, making it convenient for students to get what they need without leaving campus.',
  },
  {
    slug: 'wifi-campus',
    title: 'Wi-Fi Campus',
    heroSubtitle: 'High-speed Wi-Fi connectivity spans the entire campus, keeping students and faculty connected for coursework, research, and communication at all times.',
    body: `# Wi-Fi Campus

Vishnu Women's University is one of the few Colleges, which can boast of its state-of-the-art computing resources and network across the campus. It has IT Infrastructure that can support 3000+ computer terminals, probably one of the largest wi-fi infrastructure. Following are a few highlighting features:

- Completely Wi-Fi Campus with 20+ access point, supported on the technology from RUCKUS
- 86 Mbps of bandwidth for internet with dedicated leased line
- 1000 + workstations supported by Xeon based Rack Servers
- Powerful servers from IBM for 100% redundancy and efficient data management
- 10 Km fibre backbone for providing 1GB seamless connectivity
- D-Link 3627G core switch to provide the needed scalability and traffic control
- Cyberome High end firewall security featured network
- 24hrs Power Back Up -320 KVA of online uninterrupted power supply(UPS)
- 30+ CCTV cameras for 24 hours surveillance to ensure on campus safety and security
- High end Biometric systems for attendance`,
    desc: 'High-speed Wi-Fi connectivity spans the entire campus, keeping students and faculty connected for coursework, research, and communication at all times.',
  },
  {
    slug: 'campus-hostels',
    title: 'Campus Hostels',
    heroSubtitle: 'Secure, comfortable hostel accommodation is available for resident students, with modern amenities designed to make campus life convenient and safe.',
    body: `The objective of the Hostel is to provide suitable and comfortable accommodation for deserving students from Andhra Pradesh and outside the State. The Hostel has a number of blocks to accommodate exclusively for girl students.

Ideal hostel facility with homely atmosphere is provided within the campus. Mess with a modern kitchen and spacious air-conditioned dining halls are attached to the hostel. Many recreation facilities are also provided.

To improve their general knowledge, newspapers and educative periodicals are provided in the reading room. The selection of newspapers and periodicals shall be done by the Boarders but approved by the Warden.

A reading room / T.V. room is provided separately in each block. It will be operated during stipulated hours.

Indoor / outdoor games are provided in the hostel. Pictures are screened regularly in the auditorium.`,
    desc: 'Secure, comfortable hostel accommodation is available for resident students, with modern amenities designed to make campus life convenient and safe.',
  },
  {
    slug: 'food-courts',
    title: 'Food Courts',
    heroSubtitle: "VWU's food courts serve hygienic, freshly prepared meals throughout the day, offering a variety of options for students and staff.",
    body: `Eating a variety of healthy foods is the key to a well-balanced diet and good nutrition. It keeps our bodies working well and helps prevent diseases such as diabetes, cancer and cardiovascular disease. On the other hand, youth would like to have a variety of modern food items to satisfy their love for food.

Food Courts offer both modern and traditional food items in the campus. The huge campus has got Food Courts at twelve different locations, occasionally alluring students and faculty for taste of food items. Thus, these places provide them an opportunity to eat out just to deviate from their monotonous routine. These food courts are open from 6.30a.m. to 8.30p.m. They are:

- Bakers Treat
- Tasty Corner
- Nescafe Coffee Shops
- Fresh Choice Bakery at Lake View
- Lake View Court
- Jercy Juicy Shop and Fast Food Items
- Annapurna Fast Food Items
- Fresh Choice at Temple Square
- Snacks Corner
- Juice Shop and Fast Foods
- Annapurna Canteen
- Sita Mess
- Vishnu Canteen`,
    desc: "VWU's food courts serve hygienic, freshly prepared meals throughout the day, offering a variety of options for students and staff.",
  },
  {
    slug: 'fitness-centre',
    title: 'VISHNU Fitness Centre',
    heroSubtitle: 'The VISHNU Fitness Centre gives students access to fitness equipment and facilities to support their physical health alongside academic life.',
    body: `**“Physical fitness is not only one of the most important keys to a healthy body; it is the basis of dynamic and creative intellectual activity.”**

These words were uttered by the former American President, John F. Kennedy.

A strong mind resides in a healthy body. This saying had never been more significant. The fast pace of modern lifestyle has led to an unimaginable amount of physical and psychological stress on human body and mind. Consequently, demand for trained fitness instructors has increased manifold. Vishnu Fitness Center with its sophisticated modern equipment improves the physical fitness for sound health.

Students often compete in Inter Collegiate, Inter University and State Level tournaments and win prizes and medals. Vishnu Fitness Center is a source of health generation and physical stamina. All types of sports and games have a place in this campus. Even, Yoga training is provided emphasizing physical and mental fitness of students.`,
    desc: 'The VISHNU Fitness Centre gives students access to fitness equipment and facilities to support their physical health alongside academic life.',
  },
  {
    slug: 'staff-quarters',
    title: 'Staff Quarters',
    heroSubtitle: 'On-campus staff quarters provide residential accommodation for faculty and staff within the university campus.',
    body: `Of three basic human needs, accommodation has got the highest priority in this modern world of high standards of living. Green Meadows is the creation of our beloved chairman with the very idea of providing own houses to the faculty. Green Meadows is a cluster of about hundred houses. With the beautiful scenery around and a pond in front of the Green Meadows add more beauty and pleasantness to all the inmates.

The Green Meadows has security personnel who patrol 24 hours. Water and current are supplied without creating any inconvenience. In every aspect Green Meadows is a modern abode with all the conveniences.`,
    desc: 'On-campus staff quarters provide residential accommodation for faculty and staff within the university campus.',
  },
  {
    slug: 'travel-desk',
    title: 'Travel Desk',
    heroSubtitle: 'The campus travel desk assists students and staff with transport arrangements, making local and outstation travel simpler to coordinate.',
    body: `A dedicated Travel Desk is now available on campus, conveniently located opposite Central Square and adjacent to the ICICI ATM. It offers a wide range of services including ticket bookings (bus, train, air), passport and visa assistance, holiday packages, hotel bookings, attestation services, and overseas education guidance.

The desk operates daily from **4:00 PM to 7:00 PM**, and on **Sundays from 11:00 AM to 7:00 PM**. For assistance outside working hours, you can contact **9624 123 123** or email **support@ushodayaholidays.in**.

This facility is designed to simplify travel and documentation needs for students, faculty, and staff.`,
    desc: 'The campus travel desk assists students and staff with transport arrangements, making local and outstation travel simpler to coordinate.',
  },
  {
    slug: 'temples',
    title: 'Temples',
    heroSubtitle: 'On-campus temples provide a space for reflection and spiritual practice, reflecting the cultural values that are part of everyday campus life.',
    body: `Worship is putting the spotlight on God. This whole idea is to engage our Vishnu Women's University students in an atmosphere and attitude of reverence and joy. Vishnu Women's University engage students from varied faith and religious traditions as well as students without religious affiliation. So, Vishnu Women's University holds a place for temple of gods in the campus. The temple is built on a high foundation covering an area of 25,000 square feet.`,
    desc: 'On-campus temples provide a space for reflection and spiritual practice, reflecting the cultural values that are part of everyday campus life.',
  },
  {
    slug: 'health-care',
    title: 'Health Care',
    heroSubtitle: 'The campus health centre offers basic medical care and support, helping ensure the wellbeing of students and staff throughout the academic year.',
    body: `Health Care Centre is available with all types of medical advice, clinical tests and inpatient facility with two beds. The centre is monitored by a resident general physician Dr. Varaprasad, a psychiatrist Dr. Ramakrishnam Raju and a gynaecologist Dr. Jayakumari visit the centre during their appointed hours. Students and Staff also have free access to dental hospital located in the campus to get their dental problems treated.`,
    desc: 'The campus health centre offers basic medical care and support, helping ensure the wellbeing of students and staff throughout the academic year.',
  },
  {
    slug: 'swimming-pool',
    title: 'Swimming Pool',
    heroSubtitle: "VWU's swimming pool facility supports student fitness and recreation as part of the university's broader sports and wellness offerings.",
    body: `Whether you want to relax after a long day at studies are maintain a healthy life style, the newly opened swimming pool, next the sports complex is the ideal place for swimming enthusiasts. A world class pool with 80 feet length 40 feet width six lanes containing 4,05,000 liters of water provides excellent opportunities.

The latest technological features, round the clock water circulation and purification plants, life saving apparatus and pool side equipment is an superb facility that only Vishnu Women's University has. Individualized assistance in developing skills in all the four strokes by the coach is available. In addition the well equipped Eat Out provides the right ambiance for a pool side party.`,
    desc: "VWU's swimming pool facility supports student fitness and recreation as part of the university's broader sports and wellness offerings.",
  },
  {
    slug: 'campus-security',
    title: 'Campus Security',
    heroSubtitle: 'Round-the-clock campus security, including CCTV monitoring, helps maintain a safe and secure environment for everyone on campus.',
    body: `It gives utmost importance to safety and security of students. A special wing is established for patrolling the campus in all aspects. Round the clock, security personnel are vigilant throughout the day. These security guards create peace of mind by providing safety to the inmate of the campus.`,
    desc: 'Round-the-clock campus security, including CCTV monitoring, helps maintain a safe and secure environment for everyone on campus.',
  },
  {
    slug: 'other-facilities',
    title: 'Other Facilities',
    heroSubtitle: 'Beyond the facilities listed here, VWU continues to invest in additional infrastructure and amenities that support a well-rounded campus experience.',
    body: `Bank services are very important for the modern society. Since the campus is huge and team with more than ten thousand students and employees, it need to meet lots of banking transactions.

Indian Bank was exclusively runs for the students and employees of Vishnu Women's University.

Apart from it, there are two ATMs. One of which is located at the entrance of the Main Gate of the campus and another near the Dental College in order to meet their banking needs hassle free.`,
    desc: 'Beyond the facilities listed here, VWU continues to invest in additional infrastructure and amenities that support a well-rounded campus experience.',
  },
];

export function findCampusFacilityBySlug(slug: string): CampusFacility | undefined {
  return campusFacilities.find((f) => f.slug === slug);
}

// Facilities on the public Campus page come from the freely admin-entered
// `contentBlocks` collection, so an admin can title/slug a card however
// they like — it won't always line up with one of the 16 canonical slugs
// above. Known real-world title variants are mapped here so those tiles
// still link to the right dedicated page even when their stored slug
// doesn't match (e.g. an admin-entered "Specialised Laboratories" card
// should open the "State-of-the-art Labs" page).
const FACILITY_TITLE_ALIASES: Record<string, string> = {
  'specialised laboratories': 'state-of-the-art-labs',
  'specialized laboratories': 'state-of-the-art-labs',
  'specialised labs': 'state-of-the-art-labs',
  'specialized labs': 'state-of-the-art-labs',
  'laboratories': 'state-of-the-art-labs',
  'labs': 'state-of-the-art-labs',
};

/** Resolves an admin-entered facility card to its dedicated page, trying
 *  the stored slug first and falling back to a known title alias. */
export function resolveCampusFacility(title: string, slug?: string): CampusFacility | undefined {
  if (slug) {
    const bySlug = findCampusFacilityBySlug(slug);
    if (bySlug) return bySlug;
  }
  const aliasSlug = FACILITY_TITLE_ALIASES[title.trim().toLowerCase()];
  return aliasSlug ? findCampusFacilityBySlug(aliasSlug) : undefined;
}
