export const SITE_CONFIG = {
  name: "Vishnu Women's University",
  shortName: 'VWU',
  description: 'First private university for women in Telugu states. Empowering women through knowledge, innovation, and technology.',
  url: typeof window !== 'undefined'
    ? (import.meta.env.VITE_SITE_URL || window.location.origin)
    : (import.meta.env.VITE_SITE_URL || 'https://www.vwu.edu.in'),
  productionOrigin: 'https://www.vwu.edu.in',
  defaultImage: 'https://res.cloudinary.com/dljzfysft/image/upload/v1777358383/download_u6eeyl.jpg',
  twitterHandle: '@VishnuWomensUni',
  facebookAppId: '',
  contact: {
    phone: '+91-8816-250864',
    email: 'info@vwu.edu.in',
    address: {
      street: 'Vishnupur',
      city: 'Bhimavaram',
      state: 'Andhra Pradesh',
      postalCode: '534202',
      country: 'IN',
    },
  },
  socialLinks: [
    'https://www.facebook.com/VishnuWomensUni',
    'https://twitter.com/VishnuWomensUni',
    'https://www.linkedin.com/school/vishnu-womens-university/',
    'https://www.youtube.com/@VishnuWomensUniversity',
    'https://www.instagram.com/vishnuwomensuni/',
  ],
};

