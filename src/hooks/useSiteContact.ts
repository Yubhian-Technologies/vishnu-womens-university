import { useDocument } from './useDocument';

// Falls back to these until the `settings/siteContact` doc loads (or if an
// admin leaves a field blank) — the same "always show the hardcoded default
// first, then swap in Firestore data" convention PageHero uses, so nothing
// ever flashes blank while the listener connects.
export const DEFAULT_PHONE = '08816-250864';
export const DEFAULT_EMAIL = 'info@vwu.edu.in';

interface SiteContactDoc {
  phone?: string;
  email?: string;
}

/**
 * Site-wide primary phone/email — shown in the Footer and on the
 * Admissions/Careers/Information pages. Admin-editable via
 * Admin → Site Contact Info (see SiteContactAdmin.tsx), stored as the single
 * `settings/siteContact` doc.
 */
export function useSiteContact() {
  const { data } = useDocument<SiteContactDoc>('settings', 'siteContact');
  return {
    phone: data?.phone?.trim() || DEFAULT_PHONE,
    email: data?.email?.trim() || DEFAULT_EMAIL,
  };
}

/** `tel:` href value for the current phone number (digits only). */
export function telHref(phone: string): string {
  return `tel:${phone.replace(/[^0-9+]/g, '')}`;
}
