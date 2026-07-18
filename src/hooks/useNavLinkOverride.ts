import { useDocument } from './useDocument';

interface NavLinkOverrideDoc {
  targetUrl?: string;
}

function isValidTarget(url: string | undefined | null): url is string {
  if (!url) return false;
  const trimmed = url.trim();
  if (!trimmed) return false;
  return trimmed.startsWith('/') || /^https?:\/\//i.test(trimmed);
}

/**
 * Live-editable redirect target for one specific nav link, stored at
 * navLinkOverrides/{id}. Falls back to `fallbackPath` whenever no override
 * doc exists yet, or an admin clears the field / enters something that
 * isn't an internal path or an http(s) URL.
 */
export function useNavLinkOverride(id: string, fallbackPath: string): { path: string; external: boolean } {
  const { data } = useDocument<NavLinkOverrideDoc>('navLinkOverrides', id);
  const targetUrl = data?.targetUrl;
  const path = isValidTarget(targetUrl) ? targetUrl.trim() : fallbackPath;
  return { path, external: /^https?:\/\//i.test(path) };
}
