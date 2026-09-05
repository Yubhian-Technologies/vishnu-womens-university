import { Building2, Sparkles } from "lucide-react";
import { Marquee } from "./marquee-01-utils/marquee";

export interface PlacementItem {
  name: string;
  company: string;
  package: string;
}

interface PlacementMarqueeProps {
  records: PlacementItem[];
  year?: string;
}

export const PlacementRecordCard = ({
  name,
  company,
  package: pkg,
}: PlacementItem) => {
  return (
    <div className="placement-marquee-card">
      <div className="placement-card-header-row">
        <span className="placement-card-company-tag">
          <Building2 size={12} strokeWidth={2.4} style={{ flexShrink: 0 }} />
          <span>{company}</span>
        </span>
        {pkg && (
          <span className="placement-card-package-badge">
            <Sparkles size={11} strokeWidth={2.4} style={{ flexShrink: 0 }} />
            <span>{pkg}</span>
          </span>
        )}
      </div>
      <div>
        <h4 className="placement-card-student-name">{name}</h4>
        <p className="placement-card-company-name">Placed at {company}</p>
      </div>
    </div>
  );
};

// The marquee animation always translates 100% of one row's width over
// --duration, so a fixed duration meant the scroll visibly sped up on any
// department/program with more placement records (same time, wider track).
// A per-card pace keeps it at the same readable speed regardless of count.
const SECONDS_PER_CARD = 5;
const MIN_DURATION_S = 45;
const rowDuration = (cardCount: number) => `${Math.max(MIN_DURATION_S, cardCount * SECONDS_PER_CARD)}s`;

export default function TestimonialMarquee({ records = [] }: PlacementMarqueeProps) {
  if (!records || records.length === 0) return null;

  // Ensure enough items to create seamless infinite scrolling on wide screens
  const safeRecords = records.length < 8 ? [...records, ...records, ...records, ...records] : records;
  const half = Math.ceil(safeRecords.length / 2);
  const firstRow = safeRecords.slice(0, half);
  const secondRow = safeRecords.slice(half);

  return (
    <div className="marquee-container">
      {/* Row 1: Left to Right / Normal */}
      <Marquee pauseOnHover style={{ ['--duration' as string]: rowDuration(firstRow.length) }}>
        {firstRow.map((rec, idx) => (
          <PlacementRecordCard key={`row1-${idx}-${rec.name}`} {...rec} />
        ))}
      </Marquee>

      {/* Row 2: Reverse Direction */}
      <Marquee reverse pauseOnHover style={{ ['--duration' as string]: rowDuration(secondRow.length) }}>
        {secondRow.map((rec, idx) => (
          <PlacementRecordCard key={`row2-${idx}-${rec.name}`} {...rec} />
        ))}
      </Marquee>

      {/* Gradient Fades for Google UI polish */}
      <div className="marquee-fade-left" aria-hidden="true" />
      <div className="marquee-fade-right" aria-hidden="true" />
    </div>
  );
}
