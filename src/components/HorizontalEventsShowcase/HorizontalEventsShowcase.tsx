import { useCallback, useEffect, useState } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { CustomSectionImageCard } from '../../lib/customSections';
import { renderBold } from '../../lib/boldText';
import './HorizontalEventsShowcase.css';

interface Props {
  cards: CustomSectionImageCard[];
}

// Every event card scrolls here — no 5-card cap/"View All" page, since the
// arrows already let a viewer reach every card directly (see NewsEventsTabs,
// the only caller: department "Events & Happenings"). `loop: true` plus the
// auto-advance effect below make it behave like a real carousel (cycles on
// its own, and Next from the last card continues into the first) rather than
// a scroll strip that dead-ends — same rhythm as the department "Pioneers of
// Research & Innovation" slider (ResearchSection in DepartmentDetail.tsx).
export default function HorizontalEventsShowcase({ cards }: Props) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: 'start' });
  const [prevBtnEnabled, setPrevBtnEnabled] = useState(false);
  const [nextBtnEnabled, setNextBtnEnabled] = useState(false);

  const scrollPrev = useCallback(() => emblaApi && emblaApi.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi && emblaApi.scrollNext(), [emblaApi]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setPrevBtnEnabled(emblaApi.canScrollPrev());
    setNextBtnEnabled(emblaApi.canScrollNext());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on('select', onSelect);
    emblaApi.on('reInit', onSelect);
  }, [emblaApi, onSelect]);

  // Auto-advance every 4.5s, same interval as the Research & Innovation
  // slider — nothing to cycle through with 0 or 1 card.
  useEffect(() => {
    if (!emblaApi || cards.length <= 1) return;
    const t = setInterval(() => emblaApi.scrollNext(), 4500);
    return () => clearInterval(t);
  }, [emblaApi, cards.length]);

  if (cards.length === 0) return null;

  return (
    <div className="horizontal-events-showcase">
      <div className="horizontal-events-carousel" ref={emblaRef}>
        <div className="horizontal-events-container">
          {cards.map((card, i) => (
             // @ts-ignore
             // Embla sets opacity and transform inline; we add a class to let CSS do transitions if needed
            <div className="horizontal-events-slide" key={i}>
              <div className="events-showcase-card">
                {card.imageUrl ? (
                  <img loading="lazy" src={card.imageUrl} alt={card.title} className="events-showcase-img" />
                ) : (
                  <div className="events-showcase-img-placeholder" />
                )}
                <div className="events-showcase-overlay">
                  <div className="events-showcase-content">
                    {card.title && <h3 className="events-showcase-title">{card.title}</h3>}
                    {card.description && <p className="events-showcase-desc">{renderBold(card.description)}</p>}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Arrows sit on the card's own left/right edges (not below it) —
          same "circle over the photo" convention as every other photo
          carousel on this site. */}
      <button
        type="button"
        className="events-showcase-nav events-showcase-nav--prev"
        onClick={scrollPrev}
        disabled={!prevBtnEnabled}
        aria-label="Previous event"
      >
        <ChevronLeft size={20} strokeWidth={2.5} />
      </button>
      <button
        type="button"
        className="events-showcase-nav events-showcase-nav--next"
        onClick={scrollNext}
        disabled={!nextBtnEnabled}
        aria-label="Next event"
      >
        <ChevronRight size={20} strokeWidth={2.5} />
      </button>
    </div>
  );
}
