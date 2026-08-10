import { useEffect } from 'react';
import { useDocument } from '../../hooks/useDocument';
import { LANDING_PAGE_REGISTRY } from '../../lib/landingPageRegistry';
import type { LandingPageDoc } from '../Admin/sections/LandingPagesAdmin';
import HeroSection from './sections/HeroSection';
import StickyChrome from './sections/StickyChrome';
import RankingsSection from './sections/RankingsSection';
import HighlightsSection from './sections/HighlightsSection';
import PlacementStatsSection from './sections/PlacementStatsSection';
import EcosystemSection from './sections/EcosystemSection';
import LeadershipGallerySection from './sections/LeadershipGallerySection';
import ResearchStatsSection from './sections/ResearchStatsSection';
import ResearchSpotlightSection from './sections/ResearchSpotlightSection';
import CampusGallerySection from './sections/CampusGallerySection';
import NewsEventsSection from './sections/NewsEventsSection';
import ProgramsSection from './sections/ProgramsSection';
import TestimonialsSection from './sections/TestimonialsSection';
import CampusExperienceSection from './sections/CampusExperienceSection';
import CampusTourSection from './sections/CampusTourSection';
import './LandingPremium.css';

const PREMIUM_ENTRY = LANDING_PAGE_REGISTRY.find((e) => e.id === 'premium')!;
const IMAGE_SLOTS = PREMIUM_ENTRY.imageSlots ?? [];
const defaultUrlFor = (key: string) => IMAGE_SLOTS.find((s) => s.key === key)?.defaultUrl ?? '';

export default function LandingPremium() {
  const { data: doc } = useDocument<LandingPageDoc>('landingPages', 'premium');
  const img = (key: string) => doc?.images?.[key]?.url || defaultUrlFor(key);
  const alt = (key: string, fallback: string) => doc?.images?.[key]?.alt || fallback;

  useEffect(() => {
    document.title = 'VWU | A Premium Path to Excellence';
  }, []);

  const ecosystemImages: Record<string, string> = {
    'ecosystem-1': img('ecosystem-1'),
    'ecosystem-2': img('ecosystem-2'),
    'ecosystem-3': img('ecosystem-3'),
    'ecosystem-4': img('ecosystem-4'),
  };

  const galleryImages = ['gallery-1', 'gallery-2', 'gallery-3', 'gallery-4', 'gallery-5', 'gallery-6'].map((key) => ({
    url: img(key),
    alt: alt(key, 'VWU campus life'),
  }));

  return (
    <main className="lph-page">
      <HeroSection imageUrl={img('hero')} imageAlt={alt('hero', 'VWU student')} />
      <RankingsSection />
      <HighlightsSection
        mainImage={img('highlights-main')}
        mainAlt={alt('highlights-main', 'VWU campus')}
        cardImages={[img('highlights-card-1'), img('highlights-card-2')]}
      />
      <PlacementStatsSection />
      <EcosystemSection images={ecosystemImages} />
      <LeadershipGallerySection />
      <ResearchStatsSection />
      <ResearchSpotlightSection imageUrl={img('research-photo')} imageAlt={alt('research-photo', 'VWU research')} />
      <CampusGallerySection images={galleryImages} />
      <NewsEventsSection />
      <ProgramsSection />
      <TestimonialsSection />
      <CampusExperienceSection imageUrl={img('campus-experience')} imageAlt={alt('campus-experience', 'VWU campus aerial view')} />
      <CampusTourSection />
      <StickyChrome />
    </main>
  );
}
