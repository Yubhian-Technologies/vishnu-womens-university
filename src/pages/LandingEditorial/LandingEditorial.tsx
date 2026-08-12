import { useEffect } from 'react';
import { useDocument } from '../../hooks/useDocument';
import { LANDING_PAGE_REGISTRY } from '../../lib/landingPageRegistry';
import type { LandingPageDoc } from '../Admin/sections/LandingPagesAdmin';
import Hero from './sections/Hero';
import About from './sections/About';
import Impact from './sections/Impact';
import Research from './sections/Research';
import ResearchStory from './sections/ResearchStory';
import CampusLife from './sections/CampusLife';
import Placements from './sections/Placements';
import News from './sections/News';
import CampusCinematic from './sections/CampusCinematic';
import Events from './sections/Events';
import Stories from './sections/Stories';
import Community from './sections/Community';
import Testimonials from './sections/Testimonials';
import FinalVideo from './sections/FinalVideo';
import FinalCTA from './sections/FinalCTA';
import './LandingEditorial.css';

const ENTRY = LANDING_PAGE_REGISTRY.find((e) => e.id === 'editorial')!;
const IMAGE_SLOTS = ENTRY.imageSlots ?? [];
const defaultUrlFor = (key: string) => IMAGE_SLOTS.find((s) => s.key === key)?.defaultUrl ?? '';

export default function LandingEditorial() {
  const { data: doc } = useDocument<LandingPageDoc>('landingPages', 'editorial');
  const img = (key: string) => doc?.images?.[key]?.url || defaultUrlFor(key);
  const alt = (key: string, fallback: string) => doc?.images?.[key]?.alt || fallback;
  const video = (key: string) => doc?.videos?.[key]?.url || undefined;

  useEffect(() => {
    document.title = "VWU | Vishnu Women's University — Editorial Experience";
  }, []);

  const campusLifeImages = {
    hero: { url: img('campus-life-hero'), alt: alt('campus-life-hero', 'VWU campus life') },
    story1: { url: img('campus-life-story1'), alt: alt('campus-life-story1', 'VWU student clubs') },
    story2: { url: img('campus-life-story2'), alt: alt('campus-life-story2', 'VWU hostel life') },
    story3: { url: img('campus-life-story3'), alt: alt('campus-life-story3', 'VWU sports and fitness') },
  };

  const storyImages: Record<string, string> = {
    'stories-student': img('stories-student'),
    'stories-faculty': img('stories-faculty'),
    'stories-research': img('stories-research'),
    'stories-entrepreneurship': img('stories-entrepreneurship'),
    'stories-community': img('stories-community'),
  };

  return (
    <main className="lpe-page">
      <Hero imageUrl={img('hero')} imageAlt={alt('hero', 'Vishnu Women’s University campus')} videoUrl={video('hero')} />
      <About imageUrl={img('about')} imageAlt={alt('about', 'VWU students')} />
      <News />
      <CampusCinematic
        imageUrl={img('campus-aerial')}
        imageAlt={alt('campus-aerial', 'Aerial view of the VWU campus')}
        videoUrl={video('campus-aerial')}
      />
      <Impact />
      <Research
        featureImageUrl={img('research-feature')}
        featureImageAlt={alt('research-feature', 'VWU research faculty')}
        spotlightVideoUrl={video('research-spotlight')}
        spotlightPosterUrl={img('research-spotlight')}
        spotlightPosterAlt={alt('research-spotlight', 'VWU research spotlight')}
      />
      <ResearchStory />
      <CampusLife images={campusLifeImages} />
      <Placements />
      <Events />
      <Stories images={storyImages} />
      <Community imageUrl={img('community')} imageAlt={alt('community', 'VWU community outreach')} />
      <Testimonials />
      <FinalVideo
        videoUrl={video('final-cinematic')}
        posterUrl={img('final-cinematic')}
        posterAlt={alt('final-cinematic', 'Vishnu Women’s University campus')}
      />
      <FinalCTA />
    </main>
  );
}
