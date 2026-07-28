// Rich hardcoded content for the Foreign Languages differentiator page
// (slug: foreign-languages) — overrides that item's generic Firestore
// intro/about text in DifferentiatorDetail.tsx.
export interface FlCoordinator {
  name: string;
  designation?: string;
  email?: string;
  mobile?: string;
}

export interface FlYearCount {
  year: string;
  count: string;
}

export interface FlLanguage {
  name: string;
  quote: string;
  paragraphs: string[];
  reportLabel: string;
  table: FlYearCount[];
}

export const foreignLanguages = {
  quote: { text: 'A different language is a different vision of life.', author: 'Federico Fellini' },
  paragraphs: [
    'The importance of learning any foreign language transcends the acquisition of linguistic skills; it opens doorways to new cultures, perspectives and opportunities. In this modern world, proficiency in a foreign language fosters effective communication, breaking down barriers and promoting understanding among diverse communities. Beyond the practical utility in global business and diplomacy, learning a foreign language enhances cognitive abilities, encouraging adaptability and creativity. Furthermore, mastering a second language instills cultural empathy, fostering relationships and collaboration on a global scale.',
  ],
  vision: 'Empower individuals to communicate basic language skills in different languages confidently through the foreign languages program.',
  objectives: [
    'Enhance Communication Skills in languages',
    'Prepare for International Careers',
    'Support Study Abroad Programs',
    'Increase Employability',
    'Enrich Personal and Professional Growth',
  ],
  languagesOffered: 'SVECW always takes a step forward in fulfilling students’ needs. As a new step, foreign languages program was introduced in the year 2012 and has been continuing to date. The languages are: French, German, Spanish, Japanese, and Korean. Trainers from Global Language Solutions, Chennai, conduct classes at the institution for certification.',
  coordinator: {
    name: 'Dr. G.J.V. Prasad',
    designation: 'Assistant Professor of English',
    email: 'Prasad.g.jv@svecw.edu.in',
    mobile: '9912999946',
  } as FlCoordinator,
  languages: [
    {
      name: 'French',
      quote: 'French is the language that turns the ordinary into extraordinary.',
      paragraphs: [
        'Acquisition of French language enhances opportunities for engineering students by providing access to research, collaborations, and job opportunities in French-speaking industries, fostering a global perspective and communication skills crucial in the international engineering landscape. With this intent, SVECW introduced French Basic Level, a sixty hours course in 2012.',
        'Students follow a specific material which covers fundamental language components essential for communication in everyday situations. It encompasses vocabulary acquisition, basic grammar structures such as verb conjugations, sentence formation and common expressions. Emphasis is on practical language skills, including greetings, introductions, numbers, telling time and describing oneself and others. Cultural elements such as customs, traditions and etiquette are also integrated to provide context and enrich learning. Additionally, listening, speaking, reading, and writing exercises are incorporated to better basic communication skills.',
        'By the end of the course, students will have a solid foundation in French language basics which enables them to engage in simple conversations and comprehend basic written texts. 879 B.Tech students have been trained and certified to date, since 2012. At the end of the course, students take the test and receive certificates in Grades as per their performance.',
      ],
      reportLabel: 'French 2024-25 Report',
      table: [
        { year: '2024-25', count: '260' },
        { year: '2023-24', count: '258' },
        { year: '2022-23', count: '237' },
        { year: '2019-20', count: '180' },
        { year: '2018-19', count: '114' },
        { year: '2017-18', count: '52' },
        { year: '2016-17', count: '38' },
        { year: '2015-16', count: '18' },
        { year: '2012-13', count: '02' },
      ],
    },
    {
      name: 'German',
      quote: 'In the symphony of languages, German stands as a powerful note, echoing the harmonies of history, literature, and engineering brilliance.',
      paragraphs: [
        'German language skills open doors to a wealth of knowledge, technological advancements, and global career prospects, enhancing the versatility and success of aspiring engineers in an international context. With this objective, SVECW introduced German Basic Level, a sixty hours course in 2012.',
        'Students studying German at the basic level adhere to a specific curriculum that focuses on foundational language skills for everyday situations. Basic sentence construction, present and past tense verb conjugations and simple prepositions are all covered in grammar education. Pronunciation, comprehension and conversational skills are developed through speaking and listening activities. Vocabulary and grammatical principles are reinforced through reading and writing tasks. Students will be able to follow simple instructions, comprehend simple written materials and interact effectively with others in everyday settings during the training period.',
        'German training and certification has been given to 691 B.Tech students since 2012. Students are trained by the faculty of Global Language Solutions, Chennai. Students get certificates in Grades as per their performance at the end of the course.',
      ],
      reportLabel: 'German 2024-25 Report',
      table: [
        { year: '2024-25', count: '395' },
        { year: '2023-24', count: '263' },
        { year: '2022-23', count: '94' },
        { year: '2019-20', count: '109' },
        { year: '2018-19', count: '69' },
        { year: '2017-18', count: '32' },
        { year: '2016-17', count: '42' },
        { year: '2015-16', count: '42' },
        { year: '2014-15', count: '37' },
        { year: '2012-13', count: '03' },
      ],
    },
    {
      // The write-up for this tab was transcribed from a low-resolution
      // source image and is the least legible of the five — worth an
      // admin's review/replacement against the original report if possible.
      name: 'Spanish',
      quote: 'Learning Spanish is not just acquiring a language; it’s gaining entry to a vibrant tapestry of culture, literature, and the warmth of human connection.',
      paragraphs: [
        'Mastering Spanish in engineering education fosters cross-cultural communication skills, enabling students to engage in diverse projects, contribute to international teams, and navigate a globalized engineering landscape. With this purpose in mind, SVECW introduced Spanish Basic Level in the Foreign Language Training Program in 2012, a sixty hours course covering fundamental language components essential for communication in everyday situations.',
        'The course covers vocabulary essential for communication in everyday situations — family, professions, hobbies, and interactions. Grammar instruction includes fundamental concepts such as present tense, articles, and pronouns. Listening and speaking activities focus on pronunciation, comprehension, and conversational abilities, while reading and writing exercises reinforce vocabulary and grammar comprehension. Cultural aspects and customs of Spanish-speaking countries are also incorporated to provide context and enrich learning.',
        'By the end of the course, students will be able to communicate in simple conversations and comprehend basic written texts. 508 B.Tech students have been trained and certified in Spanish course to date. Students take a test at the end of the course and receive certificates in Grades as per their performance.',
      ],
      reportLabel: 'Spanish 2024-25 Report',
      table: [
        { year: '2024-25', count: '330' },
        { year: '2023-24', count: '252' },
        { year: '2022-23', count: '60' },
        { year: '2019-20', count: '30' },
        { year: '2018-19', count: '14' },
        { year: '2017-18', count: '24' },
        { year: '2016-17', count: '24' },
        { year: '2015-16', count: '20' },
        { year: '2014-15', count: '21' },
        { year: '2012-13', count: '03' },
      ],
    },
    {
      name: 'Japanese',
      quote: 'In the language of cherry blossoms and precision, mastering Japanese unveils the profound beauty of a culture deeply rooted in discipline, respect, and technological mastery.',
      paragraphs: [
        'Proficiency in Japanese language equips engineering students with a unique advantage, enabling seamless communication, cultural understanding and participation in global engineering projects, fostering a well-rounded and globally competitive skill set for great career prospects. In order to achieve this, SVECW introduced Japanese Basic Level, a sixty hour course in 2012.',
        'Learners study a prescribed curriculum that includes basic writing systems, such as Hiragana and Katakana, as well as vocabulary and expressions for greetings, self-introductions, and everyday activities. Basic sentence patterns, present and past tense verb conjugations and necessary particles are all covered in grammar education, while reading and writing exercises reinforce vocabulary and grammar comprehension. Speaking and listening activities concentrate on improving pronunciation, comprehension, and conversational skills. In order to give context and foster cultural awareness, cultural subjects are interwoven — Japanese customs, traditions and etiquette. By the end of the course, students will be able to communicate simply in Japanese, comprehend simple written materials and communicate effectively in simple situations.',
        '348 B.Tech students have received Japanese basic level training between 2012 and to date. Students receive training from the trainer of Global Language Solutions, Chennai. The final test is at the end of the course.',
      ],
      reportLabel: 'Japanese 2024-25 Report',
      table: [
        { year: '2024-25', count: '259' },
        { year: '2023-24', count: '195' },
        { year: '2022-23', count: '57' },
        { year: '2019-20', count: '10' },
        { year: '2018-19', count: '08' },
        { year: '2017-18', count: '14' },
        { year: '2016-17', count: '11' },
        { year: '2015-16', count: '15' },
        { year: '2014-15', count: '20' },
        { year: '2012-13', count: '02' },
      ],
    },
    {
      name: 'Korean',
      quote: 'Learning Korean is like unlocking a door to a world where tradition meets technology, and each syllable carries the echo of a resilient and dynamic culture.',
      paragraphs: [
        'Mastery of Korean for any engineering student opens up avenues to technological advancements, collaborations, and job opportunities in South Korea’s thriving industries, contributing to a globalized lucrative employment. With this objective, SVECW introduced Korean Basic Level, a sixty hours course in 2018.',
        'For Korean basic level, students follow a particular curriculum, learning the Korean writing system, Hangul, alongside introductory vocabulary and expressions for greetings, self-introductions, and basic daily interactions. Grammar instruction includes foundational concepts such as sentence structure, verb conjugations, basic particles and honorifics. Listening and speaking activities focus on pronunciation, comprehension and grammar comprehension. Cultural elements, including customs, traditions, and social norms in Korean society, are integrated to provide context and cultural understanding. By the end of the course, students will be able to engage in simple conversations, understand basic texts and communicate effectively in simple situations in Korean.',
        '167 B.Tech students have been certified in Korean basic level since 2018. Trainers from Global Language Solutions, Chennai train the students and certificates are issued as per their performance in the test at the end of the course.',
      ],
      reportLabel: 'Korean 2024-25 Report',
      table: [
        { year: '2023-24', count: '66' },
        { year: '2022-23', count: '62' },
        { year: '2019-20', count: '23' },
        { year: '2018-19', count: '15' },
      ],
    },
  ] as FlLanguage[],
};
