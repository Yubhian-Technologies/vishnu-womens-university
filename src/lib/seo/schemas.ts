import { SITE_CONFIG } from './config';

export interface BreadcrumbItem {
  name: string;
  url: string;
}

export interface ProgramSchemaProps {
  name: string;
  description: string;
  degreeName?: string;
  duration?: string;
  department?: string;
  url: string;
}

export interface FacultySchemaProps {
  name: string;
  designation?: string;
  department?: string;
  email?: string;
  image?: string;
  url: string;
}

export interface EventSchemaProps {
  name: string;
  description: string;
  startDate: string;
  endDate?: string;
  location?: string;
  image?: string;
  url: string;
}

export interface ArticleSchemaProps {
  title: string;
  description: string;
  publishedDate?: string;
  modifiedDate?: string;
  image?: string;
  url: string;
  authorName?: string;
}

export interface FAQItem {
  question: string;
  answer: string;
}

function toAbsoluteUrl(pathOrUrl: string): string {
  if (!pathOrUrl) return SITE_CONFIG.productionOrigin;
  if (pathOrUrl.startsWith('http://') || pathOrUrl.startsWith('https://')) {
    return pathOrUrl;
  }
  const cleanPath = pathOrUrl.startsWith('/') ? pathOrUrl : `/${pathOrUrl}`;
  return `${SITE_CONFIG.productionOrigin}${cleanPath}`;
}

/**
 * Global EducationalOrganization / University Schema
 */
export function getUniversitySchema() {
  const absoluteOrigin = SITE_CONFIG.productionOrigin;
  return {
    '@context': 'https://schema.org',
    '@type': 'EducationalOrganization',
    '@id': `${absoluteOrigin}/#university`,
    name: SITE_CONFIG.name,
    alternateName: SITE_CONFIG.shortName,
    url: absoluteOrigin,
    logo: SITE_CONFIG.defaultImage,
    description: SITE_CONFIG.description,
    address: {
      '@type': 'PostalAddress',
      streetAddress: SITE_CONFIG.contact.address.street,
      addressLocality: SITE_CONFIG.contact.address.city,
      addressRegion: SITE_CONFIG.contact.address.state,
      postalCode: SITE_CONFIG.contact.address.postalCode,
      addressCountry: SITE_CONFIG.contact.address.country,
    },
    telephone: SITE_CONFIG.contact.phone,
    email: SITE_CONFIG.contact.email,
    sameAs: SITE_CONFIG.socialLinks,
  };
}

/**
 * BreadcrumbList Schema
 */
export function getBreadcrumbSchema(items: BreadcrumbItem[]) {
  const absoluteOrigin = SITE_CONFIG.productionOrigin;
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: absoluteOrigin,
      },
      ...items.map((item, index) => ({
        '@type': 'ListItem',
        position: index + 2,
        name: item.name,
        item: toAbsoluteUrl(item.url),
      })),
    ],
  };
}

/**
 * Course / EducationalOccupationalProgram Schema
 */
export function getProgramSchema(props: ProgramSchemaProps) {
  const absoluteOrigin = SITE_CONFIG.productionOrigin;
  return {
    '@context': 'https://schema.org',
    '@type': 'EducationalOccupationalProgram',
    name: props.name,
    description: props.description,
    educationalCredentialAwarded: props.degreeName || 'Bachelor of Technology (B.Tech)',
    timeToComplete: props.duration || 'P4Y',
    provider: {
      '@type': 'EducationalOrganization',
      name: SITE_CONFIG.name,
      url: absoluteOrigin,
    },
    url: toAbsoluteUrl(props.url),
    department: props.department
      ? {
          '@type': 'Organization',
          name: props.department,
        }
      : undefined,
  };
}

/**
 * Faculty Person Schema
 */
export function getFacultySchema(props: FacultySchemaProps) {
  const absoluteOrigin = SITE_CONFIG.productionOrigin;
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: props.name,
    jobTitle: props.designation || 'Faculty Member',
    worksFor: {
      '@type': 'EducationalOrganization',
      name: SITE_CONFIG.name,
      url: absoluteOrigin,
    },
    email: props.email,
    image: props.image,
    url: toAbsoluteUrl(props.url),
    department: props.department,
  };
}

/**
 * Event Schema
 */
export function getEventSchema(props: EventSchemaProps) {
  const absoluteOrigin = SITE_CONFIG.productionOrigin;
  return {
    '@context': 'https://schema.org',
    '@type': 'Event',
    name: props.name,
    description: props.description,
    startDate: props.startDate,
    endDate: props.endDate || props.startDate,
    eventStatus: 'https://schema.org/EventScheduled',
    eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
    location: {
      '@type': 'Place',
      name: props.location || 'Vishnu Womens University Campus',
      address: {
        '@type': 'PostalAddress',
        addressLocality: SITE_CONFIG.contact.address.city,
        addressRegion: SITE_CONFIG.contact.address.state,
        addressCountry: SITE_CONFIG.contact.address.country,
      },
    },
    image: props.image || SITE_CONFIG.defaultImage,
    url: toAbsoluteUrl(props.url),
    organizer: {
      '@type': 'EducationalOrganization',
      name: SITE_CONFIG.name,
      url: absoluteOrigin,
    },
  };
}

/**
 * News / Article Schema
 */
export function getArticleSchema(props: ArticleSchemaProps) {
  return {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    headline: props.title,
    description: props.description,
    datePublished: props.publishedDate,
    dateModified: props.modifiedDate || props.publishedDate,
    image: props.image || SITE_CONFIG.defaultImage,
    url: toAbsoluteUrl(props.url),
    author: {
      '@type': 'Organization',
      name: props.authorName || SITE_CONFIG.name,
    },
    publisher: {
      '@type': 'EducationalOrganization',
      name: SITE_CONFIG.name,
      logo: {
        '@type': 'ImageObject',
        url: SITE_CONFIG.defaultImage,
      },
    },
  };
}

/**
 * FAQ Schema
 */
export function getFAQSchema(faqs: FAQItem[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };
}

