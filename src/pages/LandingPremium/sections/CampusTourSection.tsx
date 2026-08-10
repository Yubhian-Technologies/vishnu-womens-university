import { Link } from 'react-router-dom';

// Mirrors lpu.in's "Take a 360° Campus Tour" band: description on the left,
// a row of pill buttons on the right. LPU's version offers dubbed-language
// video variants VWU doesn't have, so this offers real equivalents instead
// (watch the tour video, or jump to the live Campus Life / Student Life pages).
export default function CampusTourSection() {
  return (
    <section className="lph-tour">
      <div className="container lph-tour__row">
        <div>
          <h2>Take a Campus Tour</h2>
          <p>
            Discover state-of-the-art classrooms, central libraries, sports facilities, hostels, and
            food courts — all within one integrated campus in Bhimavaram, Andhra Pradesh.
          </p>
        </div>
        <div className="lph-tour__pills">
          <Link to="/campus" className="lph-tour__pill lph-tour__pill--primary">Campus Tour ▶</Link>
          <Link to="/student-life" className="lph-tour__pill">Student Life</Link>
          <Link to="/admissions" className="lph-tour__pill">Schedule a Visit</Link>
        </div>
      </div>
    </section>
  );
}
