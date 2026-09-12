import { useCallback, useEffect, useState } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import type { CustomSectionImageCard } from '../../lib/customSections';
import { Link } from 'react-router-dom';
import './HorizontalEventsShowcase.css';

interface Props {
  cards: CustomSectionImageCard[];
  departmentSlug: string;
  categorySlug: string;
}

export default function HorizontalEventsShowcase({ cards, departmentSlug, categorySlug }: Props) {
  const topCards = cards.slice(0, 5);
  const hasMore = cards.length > 5;

  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: false, align: 'start' });
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

  if (cards.length === 0) return null;

  return (
    <div className="horizontal-events-showcase">
      <div className="horizontal-events-carousel" ref={emblaRef}>
        <div className="horizontal-events-container">
          {topCards.map((card, i) => (
             // @ts-ignore
             // Embla sets opacity and transform inline; we add a class to let CSS do transitions if needed
            <div className="horizontal-events-slide" key={i}>
              <div className="events-showcase-card">
                {card.imageUrl ? (
                  <img src={card.imageUrl} alt={card.title} className="events-showcase-img" />
                ) : (
                  <div className="events-showcase-img-placeholder" />
                )}
                <div className="events-showcase-overlay">
                  <div className="events-showcase-content">
                    {card.title && <h3 className="events-showcase-title">{card.title}</h3>}
                    {card.description && <p className="events-showcase-desc">{card.description}</p>}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="events-showcase-footer">
        <div className="events-showcase-controls">
          <button 
            type="button" 
            className="events-showcase-nav" 
            onClick={scrollPrev} 
            disabled={!prevBtnEnabled}
            aria-label="Previous event"
          >
            <ChevronLeft size={20} strokeWidth={2.5} />
          </button>
          <button 
            type="button" 
            className="events-showcase-nav" 
            onClick={scrollNext} 
            disabled={!nextBtnEnabled}
            aria-label="Next event"
          >
            <ChevronRight size={20} strokeWidth={2.5} />
          </button>
        </div>
        {hasMore && (
          <Link to={`/academics/departments/${departmentSlug}/events/${categorySlug}`} className="events-showcase-view-all">
            <span>View All Events</span>
            <ArrowRight size={16} strokeWidth={2.5} />
          </Link>
        )}
      </div>
    </div>
  );
}
