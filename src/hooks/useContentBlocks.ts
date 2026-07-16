import { useOrderedCollection } from './useCollection';
import type { ContentBlockDoc } from '../pages/Admin/sections/ContentBlocksAdmin';

/** Live content blocks for one (page, section) pair, already filtered and ordered. */
export function useContentBlocks(page: string, section: string): ContentBlockDoc[] {
  const { docs } = useOrderedCollection<ContentBlockDoc>('contentBlocks', 'order');
  return docs.filter((b) => b.page === page && b.section === section);
}
