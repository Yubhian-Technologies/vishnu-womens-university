// Club descriptions (the `desc` field on `studentClubs` Firestore docs,
// shown on both Campus > Clubs and Student Clubs) are admin-editable
// content, but the currently-saved text needed a one-time rewrite that
// wasn't practical to do live in Admin at the time. Keyed by the club's
// exact `name` field — a club whose name isn't listed here still reads its
// description straight from Firestore as normal, and any FUTURE Firestore
// edit to a listed club's description has no effect until this map is
// updated or removed for that club.
export const CLUB_DESCRIPTION_OVERRIDES: Record<string, string> = {
  'Amateur Astronomy Association (AAA)': 'Explore astronomy through telescope observations, sky-watching sessions and related scientific learning activities.',
  'TECHXTREME Coding Club': 'Develop programming, logical thinking and problem-solving skills through coding activities and collaborative technical challenges.',
  'Mathletes Club': 'Explore mathematics through puzzles, competitions and engaging problem-solving activities beyond the classroom.',
  'IDEA Club': 'Nurture innovation and creative thinking by developing ideas into practical initiatives and solutions.',
  'MECOW Club': 'Explore global cultures, traditions and international observances through engaging student-led activities.',
  'Rhythmic Thunders: Dance Club': 'Learn, practise and perform diverse dance forms while building creativity, confidence and stage presence.',
  'Rock Me Fab Club: Music & Performance': 'Explore vocal and instrumental music through practice, performance and collaborative musical activities.',
  'Photography Club: Visual Arts': 'Develop photography and visual storytelling skills while documenting campus life, events and experiences.',
  'Splash Out Club: Skits & Acting': 'Explore theatre, acting and skits through performances that encourage creativity, expression and teamwork.',
  'Page Turners: Literature & Reading': 'Build a culture of reading through literature, discussions and activities centred on books, authors and ideas.',
  'Tattva: Philosophy, Culture & Literary Expression': 'Explore philosophy, culture and ideas through discussion, reflection and creative literary expression.',
  'BlogBuzz: Blogging & Creative Writing': 'Develop creative writing and digital storytelling skills through blogs, articles and student-led content.',
  'Hobby Horses – Techni Safoos': 'Explore crafts, creative hobbies and cultural activities through hands-on learning and artistic expression.',
  'V-Pod: Audio Broadcasting, Jockeying & Storytelling': 'Build audio communication skills through broadcasting, radio jockeying, storytelling and voice-based content creation.',
  'Eco-Friendly Association': 'Promote environmental awareness and sustainable practices through student-led activities and green campus initiatives.',
  'Organic Farmerettes: Agriculture & Sustainability': 'Explore sustainable agriculture, organic practices and environmental responsibility through practical learning activities.',
  'SDGs: Sustainable Development Goals': 'Build awareness of the Sustainable Development Goals through activities that encourage responsible action and social participation.',
  'Sahaya Club: Community Help & Social Service': 'Participate in community outreach, volunteering and social-service initiatives that encourage empathy and civic responsibility.',
  'Happy Club: Psychology & Mental Wellbeing': 'Promote psychological wellbeing through awareness activities, conversations and positive mental-health initiatives.',
  'Empathy Club: Emotional Intelligence & Social Support': 'Develop empathy, emotional awareness and supportive interpersonal skills through collaborative student activities.',
  'The Hindu – Future India Club': 'Encourage informed citizenship, communication and awareness of current affairs through discussions and learning activities.',
  'Toastmasters Club: Public Speaking & Leadership': 'Build confidence, public-speaking and leadership skills through structured speaking and communication activities.',
  'Style and Slay: Fashion & Grooming': 'Explore personal style, grooming and self-presentation while developing creativity and confidence.',
  'Sparta: Sports, Fitness & Competitive Activities': 'Promote fitness, teamwork and competitive spirit through sports, physical activities and student participation.',
  'Synergy: Team Building, General Awareness, GD & Interviews': 'Strengthen teamwork, general awareness, group-discussion and interview skills for academic and career readiness.',
};

export function clubDesc(club: { name: string; desc: string }): string {
  return CLUB_DESCRIPTION_OVERRIDES[club.name] ?? club.desc;
}
