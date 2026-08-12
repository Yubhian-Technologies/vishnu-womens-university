import { Link } from 'react-router-dom';
import SmoothImage from '../../../components/SmoothImage/SmoothImage';
import ParallaxMedia from '../ParallaxMedia';
import Reveal from '../Reveal';

interface Props { imageUrl: string; imageAlt: string; }

export default function Community({ imageUrl, imageAlt }: Props) {
  return (
    <section className="lpe-section lpe-section--dark" aria-label="Community and social impact">
      <div className="lpe-container">
        <div className="lpe-feature">
          <Reveal className="lpe-feature__media" index={0}>
            <ParallaxMedia>
              <SmoothImage src={imageUrl} alt={imageAlt} loading="lazy" />
            </ParallaxMedia>
          </Reveal>
          <Reveal className="lpe-feature__body" index={1}>
            <span className="lpe-eyebrow">Community &amp; Social Impact</span>
            <h2 className="lpe-h2">Educating women,<br /><span className="lpe-italic">strengthening communities.</span></h2>
            <p className="lpe-lede">
              Through NSS service programs, outreach initiatives, and a mission built
              around women&rsquo;s empowerment, VWU&rsquo;s impact reaches beyond its own
              graduates into the communities they come from.
            </p>
            <p className="lpe-placeholder" style={{ marginBottom: '1.5rem' }}>
              [Content to be provided by Admin — detailed outreach and sustainability programs will appear here.]
            </p>
            <Link to="/social-services" className="lpe-btn lpe-btn--outline-light">Social Services (NSS)</Link>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
