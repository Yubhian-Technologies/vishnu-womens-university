import { useEffect } from 'react';
import { Link } from 'react-router-dom';

interface DiffItem {
  title: string;
  desc: string;
  url: string;
  highlights?: string[];
}

interface Category {
  id: string;
  label: string;
  icon: string;
  items: DiffItem[];
}

const categories: Category[] = [
  {
    id: 'innovation',
    label: 'Innovation & Entrepreneurship',
    icon: '🚀',
    items: [
      {
        title: 'Vishnu Technology Business Incubator (TBI)',
        desc: 'NSTEDB-recognised incubator (VISHVA) fostering student and faculty startups with mentorship, seed funding, and industry connect to transform ideas into enterprises.',
        url: 'https://www.vishva.co/',
      },
      {
        title: 'Science Technology & Innovation Hub (STI Hub)',
        desc: 'A state-of-the-art interdisciplinary hub for cutting-edge research, prototype development, and student-driven technology innovations.',
        url: 'https://svecwstihub.com/',
      },
      {
        title: 'AICTE IDEA Lab',
        desc: "AICTE's Idea Development, Evaluation & Application Lab providing facilities to transform ideas into prototypes under one roof. Follows a 'Learn while make' philosophy emphasising green initiatives and proof-of-concept development.",
        url: 'https://svecw.edu.in/aicte-idea-lab/',
        highlights: [
          'AQIS Application ID: IDEA202000128',
          'Emphasises green initiatives and proof-of-concept development',
          'Guided by faculty coordinators across ME and ECE',
          'Located in Bhimavaram, West Godavari District, AP',
        ],
      },
      {
        title: 'Institution Innovation Cell',
        desc: "MoE IIC-recognised cell fostering innovation and entrepreneurship. Partners with VISHVA TBI and the EDC to organise workshops, idea contests, and project exhibitions. Rated 4/5 stars in IIC 5.0 and ranked in the 151–300 band for NIRF Innovation 2023.",
        url: 'https://svecw.edu.in/institution-innovation-cell/',
        highlights: [
          '4 out of 5 stars in IIC 5.0',
          'NIRF Innovation 2023 — 151–300 band',
          'Active since Academic Year 2018–2019',
          'Partners with VISHVA TBI and EDC',
        ],
      },
      {
        title: 'TEDxSVECW',
        desc: 'Licensed independently organised TED event bringing together speakers to share innovative ideas. Inaugural event "Sea of Voices" (December 14, 2024) featured eleven speakers spanning healthcare, entrepreneurship, and food technology.',
        url: 'https://svecw.edu.in/tedxsvecw/',
        highlights: [
          'Inaugural event: "Sea of Voices" — December 14, 2024',
          'Eleven speakers from diverse fields',
          'Topics: eye care, entrepreneurship, food innovation',
          'Fosters intellectual growth and innovation culture',
        ],
      },
    ],
  },
  {
    id: 'industry',
    label: 'Industry Centres of Excellence',
    icon: '🏭',
    items: [
      {
        title: 'MEDA & PLM CoE',
        desc: 'Capgemini-partnered Centre of Excellence for Mechanical Engineering Design Automation and Product Life Cycle Management. Trains students on CATIA, Siemens NX, and ANSYS with internship and placement opportunities at Capgemini for top performers.',
        url: 'https://svecw.edu.in/plm-meda-coe/',
        highlights: [
          'Industry partnership with Capgemini',
          'Training in CATIA, Siemens NX, and ANSYS',
          'Covers 3D modelling, parametric design, and FEA',
          'Internship and placement opportunities with Capgemini',
        ],
      },
      {
        title: 'NASSCOM Embedded Systems Training',
        desc: 'NASSCOM-partnered programme aligned with the FutureSkills Prime framework under MeitY, Government of India. Trains ECE students in embedded C, RTOS, device drivers, and software validation. Industry clients include MicroChip Technologies and KPIT Technologies.',
        url: 'https://svecw.edu.in/nasscom-embedded-systems-training/',
        highlights: [
          'Aligned to FutureSkills Prime framework — MeitY, GoI',
          'Covers embedded C, RTOS, device drivers, validation',
          'Partners: MicroChip Technologies and KPIT Technologies',
          'Six specialised faculty instructors',
        ],
      },
      {
        title: 'HCL Tech VLSI Training',
        desc: 'HCL Tech-partnered VLSI design and verification training covering ASIC/FPGA design flows through SDL modules, VILT sessions, lab experiments, and chip design puzzles. Equips ECE students with industry-relevant semiconductor expertise.',
        url: 'https://svecw.edu.in/hcl-tech-vlsi-training/',
        highlights: [
          'Industry partnership with HCL Technologies',
          'Covers VLSI fundamentals and ASIC/FPGA design flows',
          'SDL modules, VILT sessions, and chip design puzzles',
          'Digital circuit design and verification training',
        ],
      },
      {
        title: 'Microchip Embedded System',
        desc: 'Centre of Excellence with Eduskills providing embedded systems training on PIC microcontroller boards (8-bit to 32-bit). Serves ECE, EEE, and CSE disciplines with project-based learning in IoT, automation, and communication protocols. Supports AICTE ATAL faculty development.',
        url: 'https://svecw.edu.in/microchip/',
        highlights: [
          'PIC microcontroller boards from 8-bit to 32-bit',
          'Partnership with Eduskills; AICTE ATAL faculty development',
          'Serves ECE, EEE, and CSE disciplines',
          'Focus on IoT, automation, and communication protocols',
        ],
      },
      {
        title: 'TI-DSP Centre of Excellence',
        desc: 'Texas Instruments DSP CoE advancing research in telecommunications, audio, video, and image processing. Campus MATLAB licence with unlimited student access. Winners of TI India Analog Maker Competition 2014. DST-sponsored research (Rs. 53 lakhs) on telephony speech enhancement for hearing-impaired individuals.',
        url: 'https://svecw.edu.in/ti-dsp-centre-of-excellence/',
        highlights: [
          'Campus MATLAB licence — unlimited student access',
          '233 students trained across 60 batches',
          'Winners: TI India Analog Maker Competition 2014',
          'DST research grant: Rs. 53 lakhs for speech enhancement',
        ],
      },
      {
        title: 'UltraTech CoE',
        desc: 'Collaboration between SVECW Civil Engineering and UltraTech Cement Ltd (est. March 20, 2024) advancing sustainable construction practices and materials through R&D, education, training, industry collaboration, and consultancy. Promotes women in civil engineering.',
        url: 'https://svecw.edu.in/ultra-tech-coe/',
        highlights: [
          'Partnership with UltraTech Cement Ltd — March 20, 2024',
          '50 students benefited in first cohort',
          'Focus: R&D, Training, Industry Collaboration, Tech Transfer',
          'Promotes women in sustainable civil engineering',
        ],
      },
      {
        title: 'Chips to Startup (C2S)',
        desc: "MEITy-funded programme (Rs. 64.5 Lakhs) under India's semiconductor self-reliance mission. SVECW secured the project 'Memory Optimised Co-Processor for Enhanced Edge AI'. Equipped with EDA tools from AMD Xilinx, Cadence, Synopsys, and Siemens. Patent already filed.",
        url: 'https://svecw.edu.in/chips-to-startup-c2s/',
        highlights: [
          'Funding: Rs. 64.5 Lakhs over 5 years — MEITy',
          'EDA tools: AMD Xilinx, Cadence, Synopsys, Siemens, Ansys',
          'Focus: memory-optimised co-processor for Edge AI',
          'Patent filed based on preliminary research outcomes',
        ],
      },
    ],
  },
  {
    id: 'research',
    label: 'Research & Specialised Labs',
    icon: '🔬',
    items: [
      {
        title: 'Vishnu Space Application Center (VSAC)',
        desc: 'S-band ground station with Dhruva Space Pvt Ltd, featuring a 3-metre parabolic mesh reflector at 2200–2290 MHz (35.4 dBi gain). 21 students have qualified for HAM radio licences. Offers satellite data acquisition, CubeSat design, and High Altitude Balloon payload training.',
        url: 'https://svecw.edu.in/vishnu-space-application-center-vsac/',
        highlights: [
          '3-metre antenna · 2200–2290 MHz · 35.4 dBi gain',
          '21 students hold HAM radio licences',
          'CubeSat design and HAB payload development',
          'Partnership with Dhruva Space Private Limited',
        ],
      },
      {
        title: 'AR / VR Studio',
        desc: 'CSE Centre of Excellence (est. August 7, 2024) equipped with Meta Quest 3 devices, 30 Core i7 13th-gen PCs, dual 4K projectors, and Mac systems. Supports AR/VR, XR, and Deep Learning development using Unity, Unreal Engine, and Blender.',
        url: 'https://svecw.edu.in/ar-vr-studio/',
        highlights: [
          'Meta Quest 3 + 30 Core i7 13th-gen PCs',
          'Dual 4K/2K projectors and Mac OS systems',
          'Focus: AR/VR, XR, and Deep Learning',
          'Tools: Unity, Unreal Engine, Blender',
        ],
      },
      {
        title: 'Vehicle Design Lab',
        desc: 'Mechanical Engineering CoE inaugurated by Kamal Bali, MD of Volvo India (March 2019). Prepares students for SAE BAJA-ATV, SUPRA-F1, Go-kart, and ESVC-Solar car competitions through simulation, power-train systems, stability analysis, and fabrication training.',
        url: 'https://svecw.edu.in/vehicle-design-lab/',
        highlights: [
          'Inaugurated by MD of Volvo India — March 2019',
          'Competitions: SAE BAJA-ATV, SUPRA-F1, Go-kart, ESVC',
          'Training: simulation, power-train, stability, fabrication',
          'Industry collaboration for BAJA and EFFICYCLE motorsport',
        ],
      },
      {
        title: 'Assistive Technology Lab (ATL)',
        desc: 'Established 2009 in collaboration with University of Massachusetts Lowell, USA. Around 70 students and 15 faculty mentors design prosthetics, mobility aids, currency detectors for visually impaired, and communication devices for the deaf. Devices distributed to 6 partner organisations annually.',
        url: 'https://svecw.edu.in/assistive-technology-lab-atl/',
        highlights: [
          'Est. 2009 · UMass Lowell, USA collaboration',
          '~70 students and 15 faculty mentors per year',
          'Devices distributed to 6 partner institutions',
          'Projects: prosthetics, mobility aids, deaf communication devices',
        ],
      },
      {
        title: 'High Performance Computing Lab',
        desc: 'GPU computing CoE (est. 2021) in the Department of AI for ML, deep learning, and data science research. Research outputs include publications on stroke recognition, chronic disease prediction, IoT-based ECG analysis, and shrimp disease detection.',
        url: 'https://svecw.edu.in/high-performance-computing-lab/',
        highlights: [
          'Established 2021 — Department of Artificial Intelligence',
          'GPU infrastructure for ML, deep learning, computer vision',
          'Research: stroke recognition, chronic disease prediction, IoT ECG',
          'Led by Dr. A Senthil Kumar and Dr. G Durga Prasad',
        ],
      },
      {
        title: 'Concrete Canoe Laboratory',
        desc: "Organised India's first National Concrete Canoe Competition exclusively for female civil engineers (August 2023). Team WAKA selected among 75 iTIC BUILD winners at IIT Hyderabad with seed funding. Five completed canoe projects: WAKA, WAKA 1.0 & 2.0, KANU, AIKYAM, and CANOA.",
        url: 'https://svecw.edu.in/concrete-canoe-laboratory/',
        highlights: [
          "India's first National Concrete Canoe Competition for women — 2023",
          'iTIC BUILD winner at IIT Hyderabad with seed funding',
          'Five canoe projects: WAKA, KANU, AIKYAM, CANOA',
          'Covers concrete tech, structural design, and project management',
        ],
      },
      {
        title: 'Dream House Construction Lab',
        desc: 'Specialised research facility for sustainable construction innovation. Team SMB selected among 75 iTIC BUILD winners at IIT Hyderabad TIC with Rs. 1 lakh seed funding for stabilised mud block research. 42+ students across II–IV year civil engineering in active projects.',
        url: 'https://svecw.edu.in/dream-house-construction-lab/',
        highlights: [
          'iTIC BUILD Winner — Team SMB, IIT Hyderabad TIC',
          'Rs. 1 lakh seed funding for stabilised mud block research',
          '42+ students in active hands-on research',
          'Focus: eco-friendly, cost-effective construction materials',
        ],
      },
    ],
  },
  {
    id: 'global',
    label: 'International & Global Outreach',
    icon: '🌏',
    items: [
      {
        title: 'Vishnu Japan Outreach Centre – VJOC',
        desc: 'Strategic outreach centre fostering India-Japan academic and industrial partnerships — facilitating student exchange, Japanese language training, and joint research collaborations.',
        url: 'https://vjoc.in/',
      },
      {
        title: 'Graduate Study Abroad Center – GSAC',
        desc: 'Dedicated centre guiding students on higher education abroad across 7 destinations: USA, Canada, UK, China, Germany, Australia, and Spain. Provides counselling, education loan facilitation, scholarship information, and pre-departure orientation on cultural adaptation, financial management, and safety.',
        url: 'https://svecw.edu.in/graduate-study-abroad-center-gsac/',
        highlights: [
          '7 destinations: USA, Canada, UK, Germany, Australia & more',
          'Education loan facilitation and scholarship support',
          'Pre-departure orientation: cultural adaptation and safety',
          'Comprehensive university shortlisting and SOP guidance',
        ],
      },
      {
        title: 'Foreign Languages',
        desc: 'Since 2012, offering 60-hour certified courses in French, German, Spanish, Japanese, and Korean delivered by Global Language Solutions, Chennai. 879 certified in French · 691 in German · 508 in Spanish · 348 in Japanese · 167 in Korean.',
        url: 'https://svecw.edu.in/foreign-languages/',
        highlights: [
          '879 students certified in French; 260 enrolled 2024–25',
          '691 students certified in German; 395 enrolled 2024–25',
          '508 Spanish · 348 Japanese · 167 Korean certified',
          'Delivered by Global Language Solutions, Chennai',
        ],
      },
    ],
  },
  {
    id: 'student',
    label: 'Student Development & Social Impact',
    icon: '🎓',
    items: [
      {
        title: 'Vishnu Student Success Centre',
        desc: 'Holistic student support hub offering academic counselling, mental wellness, career guidance, and skill development services under one roof for all VWU students.',
        url: 'https://vishnussc.in',
      },
      {
        title: 'TalentSprint – WISE',
        desc: "Women in Software Engineering programme with TalentSprint — running parallel to the regular curriculum and combining the ELITE Program, Microsoft Mentoring Program, and placement support to equip women engineers for top multinational software organisations.",
        url: 'https://svecw.edu.in/talentsprint-wise/',
        highlights: [
          'Collaboration with TalentSprint Private Limited',
          'Includes ELITE Program and Microsoft Mentoring Program',
          'Dedicated placement support for MNC software roles',
          'Experiential learning to develop mid-size software systems',
        ],
      },
      {
        title: 'Smart Interviews – C&DS Programme',
        desc: 'Data Structures and Algorithms training running since 2017 across 3 structured phases over 3 semesters. 142 students placed at Amazon, Flipkart, Adobe, and Palo Alto Networks with packages ranging 10–50 LPA. Up to 400 students selected annually via HackerRank.',
        url: 'https://svecw.edu.in/smart-interviews-cds-programme/',
        highlights: [
          '142 students placed — packages 10 to 50 LPA',
          'Up to 400 students selected via HackerRank annually',
          'Three phases: fundamentals → advanced DP and graph theory',
          'Placements: Amazon, Flipkart, Adobe, Palo Alto Networks',
        ],
      },
      {
        title: 'Rural Women Technology Park – WTP',
        desc: 'Since 2015, the WTP has trained 1,200+ rural women in Bhimavaram across five skill areas: Virgin Coconut Oil production, CAD stitching, handloom weaving, food processing, and health & nutrition. Several graduates have established their own businesses.',
        url: 'https://svecw.edu.in/rural-women-technology-park-wtp/',
        highlights: [
          '1,200+ rural women trained (2015–2018)',
          '5 areas: VCO, CAD stitching, handloom, food processing, health',
          'Graduates launched own businesses or found employment',
          'Government-recognised technology park',
        ],
      },
      {
        title: 'Radio Vishnu 90.4',
        desc: 'Campus community radio station providing students real-world broadcasting experience in content creation, RJ skills, live production, and radio journalism.',
        url: 'http://radiovishnu.com/',
      },
      {
        title: 'Nirvahana',
        desc: "Management Studies flagship initiative cultivating strategic thinking and leadership among MBA students through workshops, case competitions, daily business news hours, stock market sessions, union budget analyses, and industry networking under dedicated faculty mentorship.",
        url: 'https://svecw.edu.in/nirvahana/',
        highlights: [
          'Daily business news hours and stock market sessions',
          'Strategic workshops, seminars, and case competitions',
          'Entrepreneurship support and career building programmes',
          'Overseen by three dedicated faculty members',
        ],
      },
      {
        title: 'Vishnu School of Music',
        desc: 'A dedicated school nurturing musical talent and providing professional music education, continuing the Vishnu tradition of holistic arts and cultural development alongside engineering excellence.',
        url: 'https://svesschoolofmusic.in/',
      },
    ],
  },
];

export default function Differentiators() {
  useEffect(() => {
    document.title = 'Differentiators | Vishnu Womens University';
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const el = entry.target as HTMLElement;
            setTimeout(() => el.classList.add('revealed'), parseInt(el.dataset.delay || '0'));
            observer.unobserve(el);
          }
        });
      },
      { threshold: 0.1 }
    );
    document.querySelectorAll('.reveal, .reveal-left, .reveal-right').forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const totalItems = categories.reduce((sum, c) => sum + c.items.length, 0);

  return (
    <main className="page-wrapper">
      {/* Hero */}
      <section className="page-hero" style={{ minHeight: 400 }}>
        <img
          src="https://images.unsplash.com/photo-1531482615713-2afd69097998?w=1920&q=80"
          alt="Differentiators"
          className="page-hero-image"
        />
        <div className="page-hero-overlay" />
        <div className="container page-hero-content">
          <div className="breadcrumb animate-fade-in">
            <Link to="/" className="breadcrumb-item">Home</Link>
            <span className="breadcrumb-sep">›</span>
            <span className="breadcrumb-item active">Differentiators</span>
          </div>
          <h1 className="animate-fade-in-up">What Sets VWU Apart</h1>
          <p className="animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            {totalItems} unique initiatives spanning innovation, industry, research, global outreach, and student development — built to prepare women engineers for the world.
          </p>
        </div>
      </section>

      {/* Stats bar */}
      <section style={{ background: 'var(--color-primary)', padding: 'var(--space-6) 0' }}>
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'center', gap: 'var(--space-14)', flexWrap: 'wrap' }}>
            {[
              { num: `${totalItems}+`, label: 'Unique Initiatives' },
              { num: `${categories.length}`, label: 'Focus Areas' },
              { num: '15+', label: 'Industry Partners' },
              { num: '3', label: 'International Centres' },
            ].map((s) => (
              <div key={s.label} style={{ textAlign: 'center' }}>
                <div style={{ fontFamily: 'var(--font-serif)', fontSize: '2rem', fontWeight: 900, color: 'var(--color-accent)' }}>{s.num}</div>
                <div style={{ fontSize: 'var(--text-sm)', color: 'rgba(255,255,255,0.7)' }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Quick-jump nav */}
      <section style={{ background: 'var(--color-off-white)', borderBottom: '1px solid var(--color-light-gray)', padding: 'var(--space-4) 0' }}>
        <div className="container">
          <div style={{ display: 'flex', gap: 'var(--space-3)', flexWrap: 'wrap', justifyContent: 'center' }}>
            {categories.map((cat) => (
              <a
                key={cat.id}
                href={`#${cat.id}`}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 'var(--space-2)',
                  padding: '0.4rem 1rem',
                  borderRadius: 'var(--radius-full)',
                  border: '1.5px solid var(--color-primary)',
                  color: 'var(--color-primary)',
                  fontSize: 'var(--text-sm)',
                  fontWeight: 600,
                  textDecoration: 'none',
                  transition: 'all var(--transition-base)',
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.background = 'var(--color-primary)';
                  (e.currentTarget as HTMLElement).style.color = 'var(--color-white)';
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.background = 'transparent';
                  (e.currentTarget as HTMLElement).style.color = 'var(--color-primary)';
                }}
              >
                <span>{cat.icon}</span> {cat.label}
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Category sections */}
      {categories.map((cat, ci) => (
        <section
          key={cat.id}
          id={cat.id}
          className={`section ${ci % 2 === 0 ? 'bg-off-white' : 'bg-white'}`}
          style={{ scrollMarginTop: '100px' }}
        >
          <div className="container">
            <div className="reveal" style={{ marginBottom: 'var(--space-10)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', marginBottom: 'var(--space-2)' }}>
                <span style={{ fontSize: '2rem' }}>{cat.icon}</span>
                <span className="section-label" style={{ position: 'static', marginBottom: 0 }}>{cat.label}</span>
              </div>
              <h2 className="section-title">{cat.label}</h2>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 'var(--space-5)' }}>
              {cat.items.map((item, i) => (
                <div
                  key={item.title}
                  className="reveal"
                  data-delay={`${i * 60}`}
                  style={{
                    background: ci % 2 === 0 ? 'var(--color-white)' : 'var(--color-off-white)',
                    border: '1.5px solid var(--color-light-gray)',
                    borderRadius: 'var(--radius-md)',
                    padding: 'var(--space-5)',
                    display: 'flex',
                    flexDirection: 'column',
                    transition: 'all var(--transition-base)',
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.borderColor = 'var(--color-accent)';
                    (e.currentTarget as HTMLElement).style.boxShadow = 'var(--shadow-md)';
                    (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)';
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.borderColor = 'var(--color-light-gray)';
                    (e.currentTarget as HTMLElement).style.boxShadow = 'none';
                    (e.currentTarget as HTMLElement).style.transform = 'none';
                  }}
                >
                  {/* Accent dot */}
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--color-accent)', marginBottom: 'var(--space-3)', flexShrink: 0 }} />

                  {/* Title */}
                  <h3 style={{ fontFamily: 'var(--font-sans)', fontSize: 'var(--text-base)', fontWeight: 700, color: 'var(--color-primary)', marginBottom: 'var(--space-2)', lineHeight: 1.35 }}>
                    {item.title}
                  </h3>

                  {/* Description */}
                  <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-light)', lineHeight: 1.65, marginBottom: item.highlights ? 'var(--space-3)' : 'auto', flex: item.highlights ? 'none' : 1 }}>
                    {item.desc}
                  </p>

                  {/* Highlights */}
                  {item.highlights && (
                    <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 var(--space-4)', flex: 1, display: 'flex', flexDirection: 'column', gap: 'var(--space-1)' }}>
                      {item.highlights.map((h) => (
                        <li key={h} style={{ display: 'flex', alignItems: 'flex-start', gap: 'var(--space-2)', fontSize: 'var(--text-xs)', color: 'var(--color-text-light)' }}>
                          <span style={{ color: 'var(--color-accent)', fontWeight: 700, flexShrink: 0, marginTop: 1 }}>›</span>
                          {h}
                        </li>
                      ))}
                    </ul>
                  )}

                  {/* Visit link */}
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      marginTop: 'auto',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.3rem',
                      fontSize: 'var(--text-sm)',
                      fontWeight: 600,
                      color: 'var(--color-primary)',
                      textDecoration: 'none',
                      paddingTop: 'var(--space-3)',
                      borderTop: '1px solid var(--color-light-gray)',
                    }}
                    onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = 'var(--color-accent)'; }}
                    onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = 'var(--color-primary)'; }}
                  >
                    Visit Website
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                      <path d="M2.5 9.5l7-7M4 2.5h5.5V8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </a>
                </div>
              ))}
            </div>
          </div>
        </section>
      ))}

      {/* CTA */}
      <section style={{ background: 'var(--color-primary)', padding: 'var(--space-14) 0' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <div className="reveal">
            <h2 style={{ color: 'var(--color-white)', marginBottom: 'var(--space-4)' }}>
              Experience the VWU Difference
            </h2>
            <p style={{ color: 'rgba(255,255,255,0.75)', maxWidth: 560, margin: '0 auto var(--space-6)' }}>
              Come see these world-class initiatives in person. Schedule a campus visit and explore the ecosystem built for India's next generation of women technologists.
            </p>
            <div style={{ display: 'flex', gap: 'var(--space-4)', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link to="/admissions" className="btn btn-accent">Apply Now</Link>
              <Link to="/campus" className="btn btn-secondary">Campus Life</Link>
              <Link to="/academics" className="btn btn-secondary">Academics</Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
