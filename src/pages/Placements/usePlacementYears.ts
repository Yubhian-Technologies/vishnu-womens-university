import { useCollection, type WithId } from '../../hooks/useCollection';
import { placementYearData as staticPlacementYearData, type PlacementYear } from './placementStats.data';

export type PlacementYearDoc = WithId & PlacementYear;

/**
 * Shared by PlacementYearAccordion and the Our Recruiters year-by-year view
 * — both need the same batch-wise data. Falls back to the original built-in
 * data whenever Firestore hasn't been seeded yet (or its read is blocked,
 * e.g. firestore.rules not yet deployed with 'placementYears' allow-listed)
 * so neither section ever regresses to blank on the public site. Once an
 * admin adds years from the Placement Year Data admin section, those take
 * over automatically.
 */
export function usePlacementYears() {
  const { docs: allYears } = useCollection<PlacementYearDoc>('placementYears', [], { silent: true });
  return allYears.length > 0
    ? [...allYears].sort((a, b) => b.batch.localeCompare(a.batch))
    : staticPlacementYearData;
}
