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
  pillarsTag: 'CAMPUS FITNESS FOCUS',
  pillarsTitle: 'Four Pillars of Vishnu Fitness Centre',
  pillarsSubtitle: 'Building endurance, competitive excellence, and long-term wellness for every student.',
  pillars: [
    { icon: 'Dumbbell', title: 'Modern Equipment', desc: 'Sophisticated gym machines' },
    { icon: 'Award', title: 'Trained Instructors', desc: 'Professional supervision' },
    { icon: 'Trophy', title: 'Tournament Champions', desc: 'Inter-collegiate triumph' },
    { icon: 'Sparkles', title: 'Yoga & Mind Balance', desc: 'Flexibility & stress relief' },
  ],
  polaroidPhotos: [
    { imageUrl: '', alt: 'Fitness Centre Facility 1' },
    { imageUrl: '', alt: 'Fitness Centre Facility 2' },
    { imageUrl: '', alt: 'Fitness Centre Facility 3' },
    { imageUrl: '', alt: 'Fitness Centre Facility 4' },
  ],

  // Health & Vitality
  vitalityTag: 'HEALTH & VITALITY',
  vitalityTitle: 'A Strong Mind Resides in a Healthy Body',
  vitalityParagraph1:
    'A strong mind resides in a healthy body. This saying has never been more significant. The fast pace of modern lifestyle has led to an unimaginable amount of physical and psychological stress on human body and mind. Consequently, demand for trained fitness instructors has increased manifold. Vishnu Fitness Center with its sophisticated modern equipment improves physical fitness for sound health.',
  vitalityParagraph2:
    'Students often compete in Inter-Collegiate, Inter-University and State Level tournaments and win prizes and medals. Vishnu Fitness Center is a source of health generation and physical stamina. All types of sports and games have a place on this campus. Even Yoga training is provided, emphasizing the physical and mental fitness of students.',
  vitalityImageUrl: '',
  vitalityStoragePath: '',

  // Facility Gallery
  galleryTag: 'FACILITY GALLERY',
  galleryTitle: 'Fitness Centre in Action',
  gallerySubtitle: 'VISHNU Fitness Centre',
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
