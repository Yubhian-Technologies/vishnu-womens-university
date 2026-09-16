export interface FitnessPillarItem {
  icon: string;
  title: string;
  desc: string;
}

export interface FitnessPolaroidPhoto {
  imageUrl: string;
  storagePath?: string;
  alt?: string;
}

export interface FitnessCentreData {
  // 1. Four Pillars Section (Ethos / Focus)
  pillarsTag: string;
  pillarsTitle: string;
  pillarsSubtitle: string;
  pillars: FitnessPillarItem[];
  polaroidPhotos: FitnessPolaroidPhoto[];

  // 2. Health & Vitality Section
  vitalityTag: string;
  vitalityTitle: string;
  vitalityParagraph1: string;
  vitalityParagraph2: string;
  vitalityImageUrl: string;
  vitalityStoragePath?: string;

  // 3. Facility Gallery Section
  galleryTag: string;
  galleryTitle: string;
  gallerySubtitle: string;
}

export const FITNESS_PILLAR_ICONS = [
  'Dumbbell',
  'Award',
  'Trophy',
  'Sparkles',
  'Flame',
  'Activity',
  'Heart',
  'ShieldCheck',
  'Target',
  'Zap',
  'Users',
] as const;

export const DEFAULT_FITNESS_CENTRE_DATA: FitnessCentreData = {
  // Four Pillars
  pillarsTag: 'FITNESS & WELLNESS AT A GLANCE',
  pillarsTitle: 'Fitness & Wellness at a Glance',
  pillarsSubtitle: 'Supporting fitness, wellness and an active lifestyle at Vishnu Women\u2019s University.',
  pillars: [
    { icon: 'Dumbbell', title: 'Modern Fitness Equipment', desc: 'Training equipment for strength, cardio and general fitness.' },
    { icon: 'Award', title: 'Trained Instructors', desc: 'Guidance and supervision to support safe and effective workouts.' },
    { icon: 'Trophy', title: 'Sports & Competitive Fitness', desc: 'Facilities that complement students\u2019 participation in inter-collegiate, inter-university and state-level competitions.' },
    { icon: 'Sparkles', title: 'Yoga & Wellness', desc: 'Yoga and wellness activities that support flexibility, balance and overall well-being.' },
  ],
  polaroidPhotos: [
    { imageUrl: '', alt: 'Fitness Centre Facility 1' },
    { imageUrl: '', alt: 'Fitness Centre Facility 2' },
    { imageUrl: '', alt: 'Fitness Centre Facility 3' },
    { imageUrl: '', alt: 'Fitness Centre Facility 4' },
  ],

  // Health & Vitality
  vitalityTag: 'FITNESS FOR AN ACTIVE CAMPUS LIFE',
  vitalityTitle: 'Fitness for an Active Campus Life',
  vitalityParagraph1:
    'The Vishnu Fitness Centre provides students with a dedicated space to stay active, build physical fitness and make wellness part of everyday campus life.\n\nEquipped with modern training facilities and supported by trained instructors, the centre caters to different fitness needs while complementing the University\u2019s wider sports and wellness initiatives.',
  vitalityParagraph2:
    'More Than a Workout\n\nRegular physical activity supports endurance, strength and overall well-being. Along with fitness training, students can participate in yoga and wellness activities, creating opportunities to balance physical activity with relaxation and mental well-being.\n\nThe fitness environment also supports students involved in competitive sports, including participation in inter-collegiate, inter-university and state-level events.',
  vitalityImageUrl: '',
  vitalityStoragePath: '',

  // Facility Gallery
  galleryTag: 'FACILITY GALLERY',
  galleryTitle: 'Inside the Vishnu Fitness Centre',
  gallerySubtitle: 'Explore the equipment, training spaces and fitness activities available to students at Vishnu Women\u2019s University.',
};

export function toFitnessCentreForm(data?: Partial<FitnessCentreData>): FitnessCentreData {
  if (!data) return { ...DEFAULT_FITNESS_CENTRE_DATA };

  const defaultPillars = DEFAULT_FITNESS_CENTRE_DATA.pillars;
  const rawPillars = Array.isArray(data.pillars) && data.pillars.length > 0 ? data.pillars : defaultPillars;
  const pillars: FitnessPillarItem[] = [0, 1, 2, 3].map((i) => ({
    icon: rawPillars[i]?.icon || defaultPillars[i]?.icon || 'Dumbbell',
    title: rawPillars[i]?.title ?? defaultPillars[i]?.title ?? '',
    desc: rawPillars[i]?.desc ?? defaultPillars[i]?.desc ?? '',
  }));

  const defaultPolaroids = DEFAULT_FITNESS_CENTRE_DATA.polaroidPhotos;
  const rawPolaroids = Array.isArray(data.polaroidPhotos) && data.polaroidPhotos.length > 0 ? data.polaroidPhotos : defaultPolaroids;
  const polaroidPhotos: FitnessPolaroidPhoto[] = [0, 1, 2, 3].map((i) => ({
    imageUrl: rawPolaroids[i]?.imageUrl || '',
    storagePath: rawPolaroids[i]?.storagePath || '',
    alt: rawPolaroids[i]?.alt || defaultPolaroids[i]?.alt || `Fitness Centre Facility ${i + 1}`,
  }));

  return {
    pillarsTag: data.pillarsTag !== undefined && data.pillarsTag !== '' ? data.pillarsTag : DEFAULT_FITNESS_CENTRE_DATA.pillarsTag,
    pillarsTitle: data.pillarsTitle !== undefined && data.pillarsTitle !== '' ? data.pillarsTitle : DEFAULT_FITNESS_CENTRE_DATA.pillarsTitle,
    pillarsSubtitle: data.pillarsSubtitle !== undefined && data.pillarsSubtitle !== '' ? data.pillarsSubtitle : DEFAULT_FITNESS_CENTRE_DATA.pillarsSubtitle,
    pillars,
    polaroidPhotos,

    vitalityTag: data.vitalityTag !== undefined && data.vitalityTag !== '' ? data.vitalityTag : DEFAULT_FITNESS_CENTRE_DATA.vitalityTag,
    vitalityTitle: data.vitalityTitle !== undefined && data.vitalityTitle !== '' ? data.vitalityTitle : DEFAULT_FITNESS_CENTRE_DATA.vitalityTitle,
    vitalityParagraph1: data.vitalityParagraph1 !== undefined && data.vitalityParagraph1 !== '' ? data.vitalityParagraph1 : DEFAULT_FITNESS_CENTRE_DATA.vitalityParagraph1,
    vitalityParagraph2: data.vitalityParagraph2 !== undefined && data.vitalityParagraph2 !== '' ? data.vitalityParagraph2 : DEFAULT_FITNESS_CENTRE_DATA.vitalityParagraph2,
    vitalityImageUrl: data.vitalityImageUrl || '',
    vitalityStoragePath: data.vitalityStoragePath || '',

    galleryTag: data.galleryTag !== undefined && data.galleryTag !== '' ? data.galleryTag : DEFAULT_FITNESS_CENTRE_DATA.galleryTag,
    galleryTitle: data.galleryTitle !== undefined && data.galleryTitle !== '' ? data.galleryTitle : DEFAULT_FITNESS_CENTRE_DATA.galleryTitle,
    gallerySubtitle: data.gallerySubtitle !== undefined && data.gallerySubtitle !== '' ? data.gallerySubtitle : DEFAULT_FITNESS_CENTRE_DATA.gallerySubtitle,
  };
}
