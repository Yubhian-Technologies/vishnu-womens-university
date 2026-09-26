import type { WithId } from '../hooks/useCollection';

// Shared between Footer.tsx (public, loaded on every page) and
// FooterLinksAdmin.tsx (admin-only) — kept in this dependency-free leaf
// module rather than either of those two importing from the other, since
// Footer.tsx also needs FooterLinksAdmin.tsx's DEFAULT_FOOTER_COLUMNS import
// and a Footer <-> FooterLinksAdmin cycle would risk pulling the admin
// section's Firestore-write/FileUploader code into the public bundle.
export const FOOTER_COLUMNS_COLLECTION = 'footerColumns';
export const FOOTER_LINKS_COLLECTION = 'footerLinks';

export interface FooterColumnDoc extends WithId {
  label: string;
  order: number;
}

export type FooterLinkType = 'internal' | 'external' | 'pdf' | 'image';

export interface FooterLinkDoc extends WithId {
  columnId: string;
  label: string;
  linkType: FooterLinkType;
  // 'internal' (a path on this site, e.g. "/about") or 'external' (a full
  // http(s) URL) store their destination here.
  url?: string;
  // 'pdf' / 'image' store their uploaded file here instead.
  fileUrl?: string;
  storagePath?: string;
  // Shown greyed out and not clickable — matches a couple of the original
  // hardcoded links (e.g. "Governance & Leadership") that were placeholders
  // for a page that isn't ready yet.
  disabled?: boolean;
  order: number;
}
