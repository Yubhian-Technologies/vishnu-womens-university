import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { SITE_CONFIG } from '../../lib/seo/config';

export interface SEOProps {
  title?: string;
  description?: string;
  canonicalPath?: string;
  noindex?: boolean;
  ogType?: 'website' | 'article';
  ogImage?: string;
  twitterCard?: 'summary' | 'summary_large_image';
  jsonLd?: Record<string, unknown> | Array<Record<string, unknown>>;
}

export function SEO({
  title,
  description,
  canonicalPath,
  noindex = false,
  ogType = 'website',
  ogImage,
  twitterCard = 'summary_large_image',
  jsonLd,
}: SEOProps) {
  const location = useLocation();

  // Compute canonical URL using production domain
  const path = canonicalPath || location.pathname;
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  const canonicalUrl = `${SITE_CONFIG.productionOrigin}${normalizedPath}`;

  const formattedTitle = title
    ? title.includes(SITE_CONFIG.shortName) || title.includes(SITE_CONFIG.name)
      ? title
      : `${title} | ${SITE_CONFIG.name}`
    : `${SITE_CONFIG.name} | First Private University for Women in Telugu States`;

  const metaDescription = description || SITE_CONFIG.description;
  const image = ogImage || SITE_CONFIG.defaultImage;

  useEffect(() => {
    // 1. Update Title
    document.title = formattedTitle;

    // Helper to create or update meta tags
    const setMetaTag = (nameAttr: 'name' | 'property', attrValue: string, contentValue: string) => {
      let element = document.querySelector(`meta[${nameAttr}="${attrValue}"]`);
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(nameAttr, attrValue);
        document.head.appendChild(element);
      }
      element.setAttribute('content', contentValue);
    };

    // 2. Standard Meta Tags
    setMetaTag('name', 'description', metaDescription);
    setMetaTag('name', 'robots', noindex ? 'noindex, nofollow' : 'index, follow');

    // 3. Open Graph Tags
    setMetaTag('property', 'og:site_name', SITE_CONFIG.name);
    setMetaTag('property', 'og:type', ogType);
    setMetaTag('property', 'og:title', formattedTitle);
    setMetaTag('property', 'og:description', metaDescription);
    setMetaTag('property', 'og:url', canonicalUrl);
    setMetaTag('property', 'og:image', image);
    setMetaTag('property', 'og:locale', 'en_IN');

    // 4. Twitter Tags
    setMetaTag('name', 'twitter:card', twitterCard);
    setMetaTag('name', 'twitter:title', formattedTitle);
    setMetaTag('name', 'twitter:description', metaDescription);
    setMetaTag('name', 'twitter:image', image);
    if (SITE_CONFIG.twitterHandle) {
      setMetaTag('name', 'twitter:site', SITE_CONFIG.twitterHandle);
    }

    // 5. Canonical Link Tag
    let canonicalLink = document.querySelector('link[rel="canonical"]');
    if (!canonicalLink) {
      canonicalLink = document.createElement('link');
      canonicalLink.setAttribute('rel', 'canonical');
      document.head.appendChild(canonicalLink);
    }
    canonicalLink.setAttribute('href', canonicalUrl);

    // 6. JSON-LD Structured Data
    const JSON_LD_SCRIPT_ID = 'seo-jsonld-schema';
    let scriptElement = document.getElementById(JSON_LD_SCRIPT_ID) as HTMLScriptElement | null;
    if (jsonLd) {
      if (!scriptElement) {
        scriptElement = document.createElement('script');
        scriptElement.id = JSON_LD_SCRIPT_ID;
        scriptElement.type = 'application/ld+json';
        document.head.appendChild(scriptElement);
      }
      scriptElement.textContent = JSON.stringify(jsonLd, null, 2);
    } else if (scriptElement) {
      scriptElement.remove();
    }
  }, [formattedTitle, metaDescription, canonicalUrl, noindex, ogType, image, twitterCard, jsonLd]);

  return null;
}

export default SEO;
