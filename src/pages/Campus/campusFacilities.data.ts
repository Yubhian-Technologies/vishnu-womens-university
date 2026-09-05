// The real "Discover > Campus Life" header dropdown items (see
// src/components/Header/Header.tsx navItems). Slugs match the sub-section
// keys already used for these facilities in src/pages/Admin/sections/
// SitePhotosAdmin.tsx's DEFAULT_SECTIONS.campus, so useSitePhotos('campus',
// slug, ...) on the detail page pulls the exact same admin-editable photos.
//
// Smart Class Rooms (slug 'smart-classrooms') and State-of-the-art Labs
// (slug 'state-of-the-art-labs') used to be listed here too — their header
// nav entries now live under Academics > Information instead of Campus
// Life, so they're deliberately absent from this array (and therefore from
// CampusFacilitiesNav's "Quick Navigation" sidebar shown on every remaining
// Campus Life page). Their pages still exist at /campus/smart-classrooms and
// /campus/state-of-the-art-labs — this only affects what's listed as
// Campus Life.
export interface CampusFacility {
  slug: string;
  title: string;
  desc: string;
  heroSubtitle?: string;
  body?: string;
}

export const campusFacilities: CampusFacility[] = [
  {
    slug: 'central-library',
    title: 'Central Library',
    heroSubtitle: 'A Rich Learning Resource for Knowledge, Research, and Discovery.',
    body: `### Discover > Campus Life

# Central Library

The Library of Vishnu Women's University (VWU) was built to keep up International Standards. The air conditioned library has three floors with an area of 1083 Sq.m. and well-protected with security system. Specialized collections of Books, Journals & Non-book materials are available in Engineering & Technology, Basic Sciences, and Management Sciences. It is replete with 59721 volumes of books, 1380 Journal Back Volumes, 4000 CDs, and 250 audio cassettes.

The Library contributes to the fulfillment of Our University’s mission by selecting, acquiring, organizing, maintaining and making accessible a collection of printed and non-printed, primary and secondary materials that will support the educational, research and public service programmes of both students and faculty.

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
    desc: 'A Rich Learning Resource for Knowledge, Research, and Discovery.',
  },
  {
    slug: 'auditoriums',
    title: 'Auditoriums',
    heroSubtitle: 'Versatile Spaces for Academic, Cultural, and Institutional Events',
    body: `# Auditoriums

Considering that a variety of events like cultural programmes, seminars, debates, plays and other programmes are conducted throughout the year, Vishnu Women's University houses an **Indoor Auditorium, Open-air-Auditorium, Mini-Auditorium** and numerous **Seminar Halls** which facilitate the students to carry on their activities smoothly and with ease. They attract students to flock together to share, discuss and explore knowledge in their areas of learning.

**Smt. B. Seetha Indoor Auditorium** is centrally air-conditioned with a fully sound proof setup and equipped with latest technology for all types of audio/video presentations.

In addition to the Indoor Auditorium, Vishnu Women's University has an Open-air-Auditorium and Mini-Auditorium, where a vast variety of student activities are regularly arranged.

Vishnu Women's University has well equipped **air conditioned Seminar Halls** which can accommodate 250 members each. They are centers for knowledge acquisition since right ambiance is created with a podium, a computer system with internet facility, an LCD projector and a sound system.`,
    desc: 'Versatile Spaces for Academic, Cultural, and Institutional Events',
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
    heroSubtitle: 'Seamless Connectivity for Learning, Research, and Communication.',
    body: `# Wi-Fi Campus

Vishnu Women's University is one of the few Universities, which can boast of its state-of-the-art computing resources and network across the campus. It has IT Infrastructure that can support 3000+ computer terminals, probably one of the largest wi-fi infrastructure. Following are a few highlighting features:

- Completely Wi-Fi Campus with 250+ access point, supported on the technology from RUCKUS
- 1500 Mbps of bandwidth for internet with dedicated leased line
- 1700 + workstations supported by Xeon based Rack Servers
- Powerful servers from Lenovo for 100% redundancy and efficient data management
- 20 Km fibre backbone for providing 10GB seamless connectivity
- ARUNA 8320G core switch to provide the needed scalability and traffic control
- SOPHOS High end firewall security featured network
- 24hrs Power Back Up -320 KVA of online uninterrupted power supply(UPS)
- 700+ CCTV cameras for 24 hours surveillance to ensure on campus safety and security
- High end Biometric systems for attendance`,
    desc: 'Seamless Connectivity for Learning, Research, and Communication.',
  },
  {
    slug: 'campus-hostels',
    title: 'Campus Hostels',
    heroSubtitle: 'Safe, Comfortable Living for a Connected Campus Experience.',
    body: `The objective of the Hostel is to provide suitable and comfortable accommodation for deserving students from Andhra Pradesh and outside the State. The Hostel has a number of blocks to accommodate exclusively for girl students.

Ideal hostel facility with homely atmosphere is provided within the campus. Mess with a modern kitchen and spacious air-conditioned dining halls are attached to the hostel. Many recreation facilities are also provided.

To improve their general knowledge, newspapers and educative periodicals are provided in the reading room. The selection of newspapers and periodicals shall be done by the Boarders but approved by the Warden.

A reading room / T.V. room is provided separately in each block. It will be operated during stipulated hours.

Indoor / outdoor games are provided in the hostel. Pictures are screened regularly in the auditorium.`,
    desc: 'Safe, Comfortable Living for a Connected Campus Experience.',
  },
  {
    slug: 'food-courts',
    title: 'Food Courts',
    heroSubtitle: 'Hygienic Dining with Variety and Convenience.',
    body: `Eating a variety of healthy foods is the key to a well-balanced diet and good nutrition. It keeps our bodies working well and helps prevent diseases such as diabetes, cancer and cardiovascular disease. On the other hand, youth would like to have a variety of modern food items to satisfy their love for food.

Food Courts offer both modern and traditional food items in the campus. The huge campus has got Food Courts at seventeen different locations, occasionally alluring students and faculty for taste of food items. Thus, these places provide them an opportunity to eat out just to deviate from their monotonous routine. These food courts are open from 6.30a.m. to 8.30p.m. They are:

- Canoe & Cusine
- Brewista
- Tea leaf
- Central Square
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
    desc: 'Hygienic Dining with Variety and Convenience.',
  },
  {
    slug: 'fitness-centre',
    title: 'Vishnu Fitness Centre',
    heroSubtitle: 'Supporting Fitness, Wellness, and an Active Lifestyle.',
    body: `**“Physical fitness is not only one of the most important keys to a healthy body; it is the basis of dynamic and creative intellectual activity.”**

These words were uttered by the former American President, John F. Kennedy.

A strong mind resides in a healthy body. This saying had never been more significant. The fast pace of modern lifestyle has led to an unimaginable amount of physical and psychological stress on human body and mind. Consequently, demand for trained fitness instructors has increased manifold. Vishnu Fitness Center with its sophisticated modern equipment improves the physical fitness for sound health.

Students often compete in Inter Collegiate, Inter University and State Level tournaments and win prizes and medals. Vishnu Fitness Center is a source of health generation and physical stamina. All types of sports and games have a place in this campus. Even, Yoga training is provided emphasizing physical and mental fitness of students.`,
    desc: 'Supporting Fitness, Wellness, and an Active Lifestyle.',
  },
  {
    slug: 'staff-quarters',
    title: 'Staff Quarters',
    heroSubtitle: 'Comfortable On-Campus Living for Faculty and Staff.',
    body: `Of three basic human needs, accommodation has got the highest priority in this modern world of high standards of living. Green Meadows is the creation of our beloved chairman with the very idea of providing own houses to the faculty. Green Meadows is a cluster of about hundred houses. With the beautiful scenery around and a pond in front of the Green Meadows add more beauty and pleasantness to all the inmates.

The Green Meadows has security personnel who patrol 24 hours. Water and current are supplied without creating any inconvenience. In every aspect Green Meadows is a modern abode with all the conveniences.`,
    desc: 'Comfortable On-Campus Living for Faculty and Staff.',
  },
  {
    slug: 'travel-desk',
    title: 'Travel Desk',
    heroSubtitle: 'Convenient Travel Support for Local and Outstation Journeys.',
    body: `A dedicated Travel Desk is now available on campus, conveniently located opposite Central Square and adjacent to the ICICI ATM. It offers a wide range of services including ticket bookings (bus, train, air), passport and visa assistance, holiday packages, hotel bookings, attestation services, and overseas education guidance.

The desk operates daily from **4:00 PM to 7:00 PM**, and on **Sundays from 11:00 AM to 7:00 PM**. For assistance outside working hours, you can contact **9624 123 123** or email **support@ushodayaholidays.in**.

This facility is designed to simplify travel and documentation needs for students, faculty, and staff.`,
    desc: 'Convenient Travel Support for Local and Outstation Journeys.',
  },
  {
    slug: 'temples',
    title: 'Temples of God',
    heroSubtitle: 'A Space for Reflection, Reverence, and Inner Peace.',
    body: `Worship is putting the spotlight on God. This whole idea is to engage our Vishnu Women's University students in an atmosphere and attitude of reverence and joy. Vishnu Women's University engage students from varied faith and religious traditions as well as students without religious affiliation. So, Vishnu Women's University holds a place for temple of gods in the campus. The temple is built on a high foundation covering an area of 25,000 square feet.`,
    desc: 'A Space for Reflection, Reverence, and Inner Peace.',
  },
  {
    slug: 'health-care',
    title: 'Health Care',
    heroSubtitle: 'Quality Healthcare, Close to Campus — accessible medical care and essential health support for students and staff throughout the academic year.',
    body: `The Health Care Centre at Vishnu Women's University provides accessible medical care and essential health support to students and staff throughout the academic year. The Centre offers medical consultation, first aid, basic clinical testing, emergency support, and inpatient care.

- General Medical Consultation and OPD Services
- First Aid and Emergency Care
- Basic Clinical Laboratory Services
- ECG and Vital Signs Monitoring
- Inpatient and Sick Bay Facilities
- Pharmacy with Essential Medicines
- Ambulance and Emergency Support
- Specialist Medical Consultations

The University maintains dedicated healthcare and first-aid facilities at key locations across the campus, ensuring prompt access to medical assistance.

Medical OPD – CSSD Block, VDC. Timings: 8:30 AM – 5:00 PM. Medical Officer: Dr. V. Deepika, MBBS. The facility includes a clinical laboratory with cell counter, semi-auto analyser, and centrifuge, along with ECG, oxygen support, IV stands, BP apparatus, wheelchair, stretcher, pulse oximeter, nebulizer, steam inhalation facility, and other essential medical equipment. Nursing Staff: Mr. I. Kiran, B.Sc. (N). Laboratory Technician: Mr. Ramu Narayana Rao, Intermediate (MLT). Pharmacy: An on-campus medical shop provides essential medicines.

Sick Bay – Near Medha Hostel. Timings: 8:30 AM – 6:00 PM. The Sick Bay provides inpatient and first-aid care, with four hospital cots and four general cots, along with essential emergency and medical equipment. Nursing Staff: Mrs. M. Shanthi, B.Sc. (N). Specialist Consultation: Dr. M. Jagadeeshwari, MBBS, DNB (OBGY), every Tuesday, 5:00 PM – 6:00 PM.

First Aid Centre – Near Warden's Office. Timings: 8:30 AM – 6:00 PM. The facility provides first-aid and emergency care with hospital cots, ECG, bedside monitoring, medicines, dressing materials, oxygen and essential medical equipment. Ambulance support is also available. Medical Officer: Dr. S. P. Vadana, MD (Physician). Nursing Staff: Mrs. M. Anitha, GNM.

Specialist doctors visit the campus at scheduled times to provide additional healthcare support, including general medical and gynecological consultations. Students and staff also have access to dental care at the on-campus Vishnu Dental College & Hospital.

Medical and nursing personnel are available round the clock for emergency assistance, ensuring timely healthcare support beyond regular consultation hours.

The University is committed to maintaining a safe, healthy, and supportive campus environment, with healthcare facilities designed to meet the everyday and emergency medical needs of its students and staff.`,
    desc: 'Quality Healthcare, Close to Campus — accessible medical care and essential health support for students and staff throughout the academic year.',
  },
  {
    slug: 'swimming-pool',
    title: 'Swimming Pool',
    heroSubtitle: 'Fitness, Recreation, and Wellness Through Swimming.',
    body: `Whether you want to relax after a long day at studies are maintain a healthy life style, the newly opened swimming pool, next the sports complex is the ideal place for swimming enthusiasts. A world class pool with 80 feet length 40 feet width six lanes containing 4,05,000 liters of water provides excellent opportunities.

The latest technological features, round the clock water circulation and purification plants, life saving apparatus and pool side equipment is an superb facility that only Vishnu Women's University has. Individualized assistance in developing skills in all the four strokes by the coach is available. In addition the well equipped Eat Out provides the right ambiance for a pool side party.`,
    desc: 'Fitness, Recreation, and Wellness Through Swimming.',
  },
  {
    slug: 'campus-security',
    title: 'Campus Security',
    heroSubtitle: 'Safe, Secure, and Vigilant Campus Environment.',
    body: `It gives utmost importance to safety and security of students. A special wing is established for patrolling the campus in all aspects. Round the clock, security personnel are vigilant throughout the day. These security guards create peace of mind by providing safety to the inmate of the campus.`,
    desc: 'Safe, Secure, and Vigilant Campus Environment.',
  },
  {
    slug: 'other-facilities',
    title: 'Other Facilities',
    heroSubtitle: 'More Facilities for a Complete Campus Experience.',
    body: `Bank services are very important for the modern society. Since the campus is huge and team with more than ten thousand students and employees, it need to meet lots of banking transactions.

Indian Bank was exclusively runs for the students and employees of Vishnu Women's University.

Apart from it, there are two ATMs. One of which is located at the entrance of the Main Gate of the campus and another near the Dental College in order to meet their banking needs hassle free.`,
    desc: 'More Facilities for a Complete Campus Experience.',
  },
];

export const RELOCATED_FACILITIES: CampusFacility[] = [
  {
    slug: 'smart-classrooms',
    title: 'Smart Class Rooms',
    heroSubtitle: 'Technology-Enabled Classrooms for Engaging Learning.',
    desc: 'Technology-Enabled Classrooms for Engaging Learning.',
  },
  {
    slug: 'state-of-the-art-labs',
    title: 'State-of-the-art Labs',
    heroSubtitle: 'Hands-on Learning with Advanced Laboratory Facilities.',
    desc: 'Hands-on Learning with Advanced Laboratory Facilities.',
  },
];

export const allCampusFacilities: CampusFacility[] = [...campusFacilities, ...RELOCATED_FACILITIES];

export function findCampusFacilityBySlug(slug: string): CampusFacility | undefined {
  return allCampusFacilities.find((f) => f.slug === slug);
}

// Facilities on the public Campus page come from the freely admin-entered
// `contentBlocks` collection, so an admin can title/slug a card however
// they like — it won't always line up with one of the canonical slugs
// above. Known real-world title variants are mapped here so those tiles
// still link to the right dedicated page even when their stored slug
// doesn't match.
const FACILITY_TITLE_ALIASES: Record<string, string> = {
  'smart class rooms': 'smart-classrooms',
  'smart classrooms': 'smart-classrooms',
  'state-of-the-art labs': 'state-of-the-art-labs',
  'state of the art labs': 'state-of-the-art-labs',
  'specialised laboratories': 'state-of-the-art-labs',
  'vishnu fitness centre': 'fitness-centre',
  'fitness centre': 'fitness-centre',
  'temples of god': 'temples',
  'temple of god': 'temples',
  'temples': 'temples',
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
