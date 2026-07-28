// Rich hardcoded content for the Nirvahana (Department of Management
// Studies) differentiator page (slug: nirvahana) — overrides that item's
// generic Firestore intro/about text in DifferentiatorDetail.tsx. Event
// banner photos are admin-uploadable (see NirvahanaEventPhotosAdmin.tsx /
// the `nirvahanaEventPhotos` collection) since none were available as
// static assets.
export interface NirvahanaActivity {
  title: string;
  description: string;
}

export interface NirvahanaMember {
  name: string;
  designation?: string;
  email?: string;
  mobile?: string;
  interests?: string;
}

export interface NirvahanaEvent {
  id: string;
  caption: string;
}

export const nirvahana = {
  paragraphs: [
    'In the ever-evolving landscape of business, where change is constant and innovation is paramount, the Nirvahana stands as a beacon of excellence and leadership within the Department of Management Studies.',
    'Through a range of engaging workshops, stimulating seminars, and challenging case competitions, we cultivate strategic thinking skills for navigating today’s complex business environment. From analysing market trends to crafting bold strategies, our members are equipped with the tools and insights needed to excel in any industry.',
    'But we’re not just about theories and concepts, we’re about action and impact. Our Nirvahana provides ample opportunities for networking with industry leaders, collaboration on innovative projects, and making a difference through community initiatives. Whether it’s launching a startup venture or spearheading a sustainability campaign, the Nirvahana empowers you to turn your vision into reality.',
  ],
  vision: 'To establish a dynamic ecosystem within the MBA community, where aspiring leaders harness strategic insights, embrace innovation, and champion ethical practices, elevating businesses and society alike.',
  mission: 'To cultivate a community of forward-thinking leaders within the MBA program, equipped with strategic insights and innovative approaches to tackle global business challenges.',
  objectives: [
    'Provide workshops, seminars, and case competitions aimed at developing strategic thinking capabilities among MBA students.',
    'Facilitate networking opportunities with industry leaders, alumni, and peers to encourage collaboration and exchange of ideas.',
    'Offer resources and support for career development, including resume workshops, interview preparation, and access to internship and job opportunities.',
    'Promote an entrepreneurial mindset by organizing events, guest lectures, and incubator programs focused on innovation and startup ventures.',
    'Encourage participation in community service projects and sustainability initiatives to instill a sense of social responsibility and ethical leadership among MBA students.',
  ],
  events: [
    { id: 'leadership-talk', caption: 'Virtual Talk on “LEADERSHIP” by Sri. Ashwani Kumar' },
    { id: 'hr-dimensions-talk', caption: 'Virtual Talk on “Emerging HR Dimensions” by Mr. Naresh Devi' },
  ] as NirvahanaEvent[],
  activitiesIntro: 'Here’s a glimpse of each activity performed under the name of “Nirvahana”:',
  activities: [
    { title: 'Art of Story telling', description: 'Explore the power of narrative in business contexts, learning how to craft compelling stories to effectively communicate ideas, inspire action, and engage stakeholders.' },
    { title: 'Redesigning the Logo', description: 'Engage in creative design processes to revitalize and modernize the identity, reflecting its evolving mission and values.' },
    { title: 'Union Budget Live Analysis', description: 'Delve into the intricacies of the annual Union Budget, analyzing its impact on various sectors, and economic indicators in real-time discussions and workshops.' },
    { title: 'Interactive Session', description: 'Participate in dynamic discussions, brainstorming sessions, and problem-solving sessions, critical thinking, and innovative solutions to business challenges.' },
    { title: 'Role Play', description: 'Immerse yourself in simulated business scenarios, taking on different roles to gain practical experience, enhance decision-making skills, and develop empathy for diverse perspectives.' },
    { title: 'Entrepreneurial Talks', description: 'Engage with seasoned leaders and industry experts through inspirational talks, Guest lectures, and panel discussions aimed at honing leadership skills, fostering personal growth gaining firsthand knowledge and industry perspectives to inform career decisions and aspirations from experienced professionals.' },
    { title: 'Workshop on Career Building', description: 'Equip yourself with the tools and strategies needed to navigate the job market, build a strong personal brand, and advance your career through workshops, mock interviews, resume reviews, and networking opportunities.' },
    { title: 'Session on Stock Markets', description: 'Dive into the world of finance and investment with sessions focused on understanding stock markets, analyzing market trends, evaluating investment opportunities, and managing risk effectively.' },
    { title: 'Daily Business News Hour', description: 'Stay informed and up-to-date with the latest developments in the business world through dedicated daily sessions covering breaking news, market updates, and insightful analysis of current events impacting global business landscape.' },
    { title: 'Case Study Analysis', description: 'Engage in in-depth analysis and discussion of real-world business cases spanning various industries and functional areas. Through facilitated sessions, participants delve into the complexities of each case, applying theoretical knowledge and critical thinking skills to identify key issues, analyze data, and develop strategic recommendations.' },
    { title: 'Activity-Based Learning', description: 'Embrace a dynamic and immersive approach to education that goes beyond traditional lectures and textbooks, empowering MBA students to actively engage with course material, develop practical skills, and apply theoretical concepts in real-world contexts.' },
    { title: 'Industry Immersion Programs', description: 'Take advantage of industry immersion programs that provide opportunities for internships, company visits, and networking events with industry professionals. These experiences not only enhance your understanding of industry practices but also help you build valuable connections and gain insights into potential career paths.' },
    { title: 'Entrepreneurship Initiatives', description: 'Explore your entrepreneurial ambitions through entrepreneurship initiatives that provide support, resources, and mentorship for aspiring business founders. Whether it’s developing a business plan, pitching to investors, or launching a startup venture, you’ll have the opportunity to turn your ideas into reality.' },
    { title: 'Experiential Learning Workshops', description: 'Engage in hands-on workshops and experiential learning activities that take you outside the classroom and into the field. Whether it’s conducting market research, analyzing financial statements, or developing marketing campaigns, you’ll gain valuable practical experience that complements your academic studies.' },
    { title: 'Group Projects and Presentations', description: 'Collaborate with your peers or group projects that require you to apply course concepts to solve practical business challenges. Through teamwork, research, and presentations, you’ll develop communication skills, leadership abilities, and a deeper understanding of course material.' },
  ] as NirvahanaActivity[],
  team: {
    inCharge: {
      name: 'Dr. K.V. Rama Murthy',
      designation: 'Asst. Prof',
      email: 'kvrmurthymba@svecw.edu.in',
      mobile: '9603932174',
      interests: 'Innovation, Entrepreneurship, Finance, Operations',
    } as NirvahanaMember,
    facultyMembers: [
      {
        name: 'Mr. Ch. Anudeep',
        designation: 'Asst. Prof',
        email: 'ch.anudeep@svecw.edu.in',
        mobile: '9705339933',
        interests: 'Innovation, Entrepreneurship, Marketing',
      },
      {
        name: 'Mrs. M.H. Keerthi',
        designation: 'Asst. Prof',
        email: 'mkeerthimba@svecw.edu.in',
        mobile: '9492032259',
        interests: 'Innovation, Entrepreneurship, HR',
      },
    ] as NirvahanaMember[],
  },
};
