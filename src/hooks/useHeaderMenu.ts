import { useMemo } from 'react';
import { useDocument } from './useDocument';
import { DEFAULT_HEADER_MENU, parseHeaderMenu, type HeaderMenuItem } from '../lib/headerMenu';

/**
 * The header's menu, admin-editable via Admin → Header Menu and stored as the
 * single `settings/headerMenu` doc. Shows DEFAULT_HEADER_MENU until that doc
 * loads — and whenever it's missing or unusable — so the header never
 * renders empty.
 */
export function useHeaderMenu(): { items: HeaderMenuItem[]; isCustom: boolean } {
  const { data } = useDocument<Record<string, unknown>>('settings', 'headerMenu');
  return useMemo(() => {
    const saved = parseHeaderMenu(data);
    return saved ? { items: saved, isCustom: true } : { items: DEFAULT_HEADER_MENU, isCustom: false };
  }, [data]);
}
