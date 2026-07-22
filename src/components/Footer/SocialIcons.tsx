// Simple, monochrome brand marks for the footer's social row — filled with
// currentColor so they pick up .social-link's existing color/hover styling
// automatically, same as any lucide icon would.
type IconProps = { size?: number };

export function InstagramIcon({ size = 18 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="2" y="2" width="20" height="20" rx="5" stroke="currentColor" strokeWidth="2" />
      <circle cx="12" cy="12" r="4.5" stroke="currentColor" strokeWidth="2" />
      <circle cx="17.5" cy="6.5" r="1.25" fill="currentColor" />
    </svg>
  );
}

export function FacebookIcon({ size = 18 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M15 3h-2.5A4.5 4.5 0 0 0 8 7.5V10H5.5v3.5H8V21h3.5v-7.5h2.7l.5-3.5h-3.2V7.8c0-.99.32-1.8 1.6-1.8H15V3Z"
        fill="currentColor"
      />
    </svg>
  );
}

export function TwitterIcon({ size = 18 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M4 4l7.2 9.4L4.4 20H6.9l5.6-5.5L16.9 20H20l-7.5-9.9L19.1 4h-2.5l-5.2 5.1L7.1 4H4Zm2.9 1.6h1.5l9.7 12.8h-1.5L6.9 5.6Z"
        fill="currentColor"
      />
    </svg>
  );
}

export function LinkedInIcon({ size = 18 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="2" y="2" width="20" height="20" rx="3" stroke="currentColor" strokeWidth="2" />
      <circle cx="7.5" cy="8" r="1.4" fill="currentColor" />
      <path d="M7.5 11v7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M12 18v-4.2c0-1.6 1-2.8 2.4-2.8 1.3 0 2.1 1 2.1 2.7V18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M12 11v7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

export function YouTubeIcon({ size = 18 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="2" y="5" width="20" height="14" rx="4" stroke="currentColor" strokeWidth="2" />
      <path d="M10.5 9.3v5.4l4.7-2.7-4.7-2.7Z" fill="currentColor" />
    </svg>
  );
}
