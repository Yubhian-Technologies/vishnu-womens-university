import { Link } from 'react-router-dom';
import { Play, Volume2, Maximize2, Share2 } from 'lucide-react';
import { useOrderedCollection } from '../../../hooks/useCollection';
import { PHOTO_NEEDED_PLACEHOLDER } from '../../../lib/photoPlaceholder';
import { RESEARCH_STATS } from '../landingEditorial.data';
import SmoothImage from '../../../components/SmoothImage/SmoothImage';
import ParallaxMedia from '../ParallaxMedia';
import Reveal from '../Reveal';

interface ResearchItemDoc {
  id: string;
  slug: string;
  title: string;
  desc: string;
  heroImage?: string;
  category: 'governance' | 'output' | 'engagement';
}

interface Props {
  featureImageUrl: string;
  featureImageAlt: string;
  spotlightVideoUrl?: string;
  spotlightPosterUrl: string;
  spotlightPosterAlt: string;
}

const TEXT_CARD_FALLBACKS = [
  { title: '[Research headline to be provided]', desc: '[Content to be provided by Admin.]' },
  { title: '[Research headline to be provided]', desc: '[Content to be provided by Admin.]' },
];

export default function Research({ featureImageUrl, featureImageAlt, spotlightVideoUrl, spotlightPosterUrl, spotlightPosterAlt }: Props) {
  const { docs } = useOrderedCollection<ResearchItemDoc>('researchItems', 'order');
  const imageStory = docs.find((d) => d.category === 'output' && d.heroImage);
  const textStories = docs.filter((d) => d.id !== imageStory?.id).slice(0, 2);
  const textCards = textStories.length > 0 ? textStories : TEXT_CARD_FALLBACKS;

  return (
    <section className="lpe-section lpe-section--dark" id="research" aria-label="Research and innovation">
      <div className="lpe-container">
        {/* Stat tile band */}
        <div className="lpe-research-stat-band">
          {RESEARCH_STATS.map((s, i) => (
            <Reveal key={s.label} index={i} className="lpe-research-stat-tile">
              <span className="lpe-research-stat-tile__num">{s.big}</span>
              <span className="lpe-research-stat-tile__label">{s.label}</span>
            </Reveal>
          ))}
        </div>

        {/* Editorial feature: left headline+photo, right intro+quote+card grid */}
        <div className="lpe-research-feature">
          <div className="lpe-research-feature__left">
            <Reveal index={0}>
              <h2 className="lpe-h2">Achieving the promise<br />of women-led research.</h2>
              <Link to="/research" className="lpe-research-pill">Our Research</Link>
            </Reveal>
            <Reveal index={1} variant="media" className="lpe-research-feature__photo">
              <ParallaxMedia>
                <SmoothImage src={featureImageUrl} alt={featureImageAlt} loading="lazy" />
              </ParallaxMedia>
            </Reveal>
          </div>

          <div className="lpe-research-feature__right">
            <Reveal index={0}>
              <p className="lpe-research-feature__intro">
                Vishnu Women&rsquo;s University established its Research &amp; Development cell to give
                faculty and students a real pathway from classroom to publication, from lab to patent.
              </p>
            </Reveal>
            <Reveal index={1}>
              <blockquote className="lpe-research-quote">
                Today, the university continues to invest in research infrastructure — supporting
                faculty inquiry, funding student projects, and building the labs that turn
                curiosity into published, patented work.
              </blockquote>
            </Reveal>

            <div className="lpe-research-cards-grid">
              <Reveal index={2} variant="media" className="lpe-research-video-card">
                {spotlightVideoUrl ? (
                  <video src={spotlightVideoUrl} poster={spotlightPosterUrl} controls playsInline aria-label={spotlightPosterAlt} />
                ) : (
                  <>
                    <img src={spotlightPosterUrl} alt={spotlightPosterAlt} />
                    <span className="lpe-research-video-card__play" aria-hidden="true"><Play size={20} fill="currentColor" /></span>
                    <div className="lpe-research-video-card__chrome">
                      <span className="lpe-research-video-card__label">Research Spotlight</span>
                      <div className="lpe-research-video-card__icons">
                        <Volume2 size={15} />
                        <Share2 size={15} />
                        <Maximize2 size={15} />
                      </div>
                    </div>
                    <div className="lpe-research-video-card__bar"><span /></div>
                  </>
                )}
              </Reveal>

              {imageStory && (
                <Reveal index={3} variant="media" className="lpe-card lpe-card--on-dark lpe-research-story-card">
                  <Link to={`/research/${imageStory.slug}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                    <div className="lpe-card__media">
                      <SmoothImage src={imageStory.heroImage || PHOTO_NEEDED_PLACEHOLDER} alt={imageStory.title} loading="lazy" />
                    </div>
                    <div className="lpe-card__body">
                      <h3 className="lpe-card__title">{imageStory.title}</h3>
                      <p className="lpe-card__desc">{imageStory.desc}</p>
                    </div>
                  </Link>
                </Reveal>
              )}

              {textCards.map((item, i) => {
                const isReal = 'slug' in item;
                const body = (
                  <>
                    <h3 className="lpe-card__title">{item.title}</h3>
                    <p className="lpe-card__desc">{item.desc}</p>
                  </>
                );
                return (
                  <Reveal key={item.title + i} index={i + 4} className="lpe-card lpe-card--on-dark lpe-research-text-card">
                    {isReal ? (
                      <Link to={`/research/${(item as ResearchItemDoc).slug}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                        <div className="lpe-card__body">{body}</div>
                      </Link>
                    ) : (
                      <div className="lpe-card__body">{body}</div>
                    )}
                  </Reveal>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
