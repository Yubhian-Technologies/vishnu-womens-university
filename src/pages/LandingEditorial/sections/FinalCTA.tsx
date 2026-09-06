import { Link } from 'react-router-dom';
import Reveal from '../Reveal';

export default function FinalCTA() {
  return (
    <section className="lpe-final-cta" aria-label="Explore Vishnu Women's University">
      <div className="lpe-container">
        <Reveal index={0}>
          <span className="lpe-eyebrow">Your Future, Engineered Here</span>
        </Reveal>
        <Reveal index={1}>
          <h2 className="lpe-final-cta__headline">
            Explore Vishnu Women&rsquo;s<br /><span className="lpe-italic">University.</span>
          </h2>
        </Reveal>
        <Reveal index={2} className="lpe-btn-row">
          <Link to="/apply-now" className="lpe-btn lpe-btn--gold">Apply Now</Link>
          <Link to="/academics" className="lpe-btn lpe-btn--outline-dark">Explore Programs</Link>
          <Link to="/campus" className="lpe-btn lpe-btn--outline-dark">Visit Campus</Link>
          <Link to="/contact" className="lpe-btn lpe-btn--text">Contact Admissions →</Link>
        </Reveal>
      </div>
    </section>
  );
}
