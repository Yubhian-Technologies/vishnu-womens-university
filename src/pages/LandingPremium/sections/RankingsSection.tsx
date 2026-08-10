import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { RANKINGS } from '../landingPremium.data';

// Mirrors lpu.in's "Rising Beyond Standards" band exactly: a circular CTA
// beside a bold multi-line heading + description in the top row, then a
// second row pairing one giant badge + caption against the awarding body's
// name + description, stepped through with prev/next arrows.
export default function RankingsSection() {
  const [active, setActive] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    timerRef.current = setInterval(() => setActive((p) => (p + 1) % RANKINGS.length), 4000);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, []);

  const goTo = (i: number) => {
    setActive(i);
    if (timerRef.current) clearInterval(timerRef.current);
  };

  const r = RANKINGS[active];

  return (
    <section className="lph-rankings">
      <div className="container">
        <div className="lph-rankings__intro">
          <Link to="/news-awards/accreditations-awards" className="lph-rankings__cta">
            Explore<br />Rankings
          </Link>
          <div>
            <p className="lph-eyebrow-label">Rising Beyond Standards</p>
            <h2 className="lph-rankings__heading">Our Journey of Recognition, Rankings, and Remarkable Achievements</h2>
            <p className="lph-rankings__desc">
              VWU is one of Andhra Pradesh's leading private universities, recognized by the University
              Grants Commission (UGC) and accredited with an A++ grade by NAAC, with consistent
              recognition across national rankings and accreditation bodies.
            </p>
          </div>
        </div>

        <div className="lph-rankings__row">
          <div>
            <div className="lph-rankings__big">{r.big}</div>
            <p className="lph-rankings__caption">{r.caption}</p>
          </div>
          <div className="lph-rankings__body">
            <p className="lph-rankings__label">{r.title}</p>
            <span>{r.desc}</span>
            <div className="lph-rankings__arrows">
              <button onClick={() => goTo((active - 1 + RANKINGS.length) % RANKINGS.length)} aria-label="Previous"><ChevronLeft size={18} /></button>
              <button onClick={() => goTo((active + 1) % RANKINGS.length)} aria-label="Next"><ChevronRight size={18} /></button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
