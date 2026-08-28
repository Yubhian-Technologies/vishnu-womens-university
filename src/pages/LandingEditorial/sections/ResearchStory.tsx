import { Link } from 'react-router-dom';
import { useOrderedCollection } from '../../../hooks/useCollection';
import { PHOTO_NEEDED_PLACEHOLDER } from '../../../lib/photoPlaceholder';
import SmoothImage from '../../../components/SmoothImage/SmoothImage';
import ParallaxMedia from '../ParallaxMedia';
import Reveal from '../Reveal';

interface ResearchItemDoc {
  id: string;
  slug: string;
  title: string;
  intro: string;
  heroImage?: string;
  category: 'governance' | 'output' | 'engagement';
}

interface Story { title: string; desc: string; image: string; slug?: string; }

interface ImageOverride { url: string; alt: string; }

interface Props {
  /** Admin-uploaded overrides for the 3 story images, keyed by position
   *  (Landing Page 3 → Manage Images → "Featured Research — Story N Photo").
   *  Each entry's `.url` is PHOTO_NEEDED_PLACEHOLDER until an admin uploads
   *  one — in that case the research item's own heroImage (or the
   *  placeholder) is used instead, so this never hides already-real data. */
  imageOverrides?: ImageOverride[];
}

const PLACEHOLDER_STORIES: Story[] = [
  { title: '[Research story to be provided]', desc: '[Content to be provided by Admin — a featured research narrative will appear here.]', image: PHOTO_NEEDED_PLACEHOLDER },
  { title: '[Research story to be provided]', desc: '[Content to be provided by Admin — a featured research narrative will appear here.]', image: PHOTO_NEEDED_PLACEHOLDER },
  { title: '[Research story to be provided]', desc: '[Content to be provided by Admin — a featured research narrative will appear here.]', image: PHOTO_NEEDED_PLACEHOLDER },
];

/**
 * Featured research narratives, presented as plain in-flow editorial rows
 * that fade up as they scroll into view — no pinning/scroll-jacking, no
 * step rail. Matches how stanford.edu actually animates its content: simple
 * reveal-on-scroll, nothing scroll-linked or viewport-locked.
 */
export default function ResearchStory({ imageOverrides }: Props) {
  const { docs } = useOrderedCollection<ResearchItemDoc>('researchItems', 'order');
  const real = docs.filter((d) => d.category === 'output').slice(0, 3);
  const stories: Story[] = real.length >= 3
    ? real.map((d) => ({ title: d.title, desc: d.intro || d.title, image: d.heroImage || PHOTO_NEEDED_PLACEHOLDER, slug: d.slug }))
    : PLACEHOLDER_STORIES;

  return (
    <section className="lpe-section lpe-section--dark" aria-label="Featured research stories">
      <div className="lpe-container">
        <Reveal index={0}>
          <span className="lpe-eyebrow">Featured Research</span>
          <h2 className="lpe-h2">Thrust Areas<br /><span className="lpe-italic">of Research.</span></h2>
        </Reveal>

        <div className="lpe-research-stories">
          {stories.map((story, i) => {
            const override = imageOverrides?.[i];
            const hasOverride = !!override && override.url !== PHOTO_NEEDED_PLACEHOLDER;
            const image = hasOverride ? override.url : story.image;
            const imageAlt = hasOverride ? override.alt : story.title;
            return (
            <div key={story.title + i} className={`lpe-feature lpe-research-story-row${i % 2 === 1 ? ' lpe-feature--reverse' : ''}`}>
              <Reveal index={0} variant="media" className="lpe-feature__media">
                <ParallaxMedia strength={8}>
                  <SmoothImage src={image} alt={imageAlt} loading="lazy" />
                </ParallaxMedia>
              </Reveal>
              <Reveal index={1} className="lpe-feature__body">
                <h3 className="lpe-h3">{story.title}</h3>
                <p className="lpe-lede">{story.desc}</p>
                {story.slug && (
                  <Link to={`/research/${story.slug}`} className="lpe-btn lpe-btn--outline-light">Read More</Link>
                )}
              </Reveal>
            </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
