import { Link } from 'react-router-dom';
import SmoothImage from '../../../components/SmoothImage/SmoothImage';
import Reveal from '../Reveal';

interface Props {
  imageUrl: string;
  imageAlt: string;
}

export default function About({ imageUrl, imageAlt }: Props) {
  return (
    <section className="lpe-section lpe-section--paper lpe-intro" id="about" aria-label="About the university">
      <div className="lpe-container lpe-intro__text">
        <Reveal index={0}>
          <h2 className="lpe-intro__headline">Advancing Every Ambition</h2>
        </Reveal>
        <Reveal index={1}>
          <p className="lpe-intro__lede">
            At Vishnu Women&rsquo;s University, a spirit of ambition and possibility drives
            everything we do. Here you&rsquo;ll find rigorous engineering programs, research-active
            faculty, and a campus culture built entirely around one goal — giving every woman who
            studies here the technical depth and the confidence to lead.
          </p>
        </Reveal>
        <Reveal index={2}>
          <Link to="/about" className="lpe-btn lpe-btn--pill">About VWU</Link>
        </Reveal>
      </div>

      <Reveal index={3} variant="media" className="lpe-intro__media">
        <SmoothImage src={imageUrl} alt={imageAlt} loading="lazy" />
      </Reveal>
    </section>
  );
}
