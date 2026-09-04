import './AccreditationsStrip.css';

type Accreditation = {
  code: string;
  title: string;
  logo: string;
};

const ACCREDITATIONS: Accreditation[] = [
  { code: 'NBA', title: 'National Board of Accreditation', logo: '/images/accreditations/nba.png' },
  { code: 'NAAC', title: 'National Assessment & Accreditation Council', logo: '/images/accreditations/naac.png' },
  { code: 'UGC', title: 'University Grants Commission', logo: '/images/accreditations/ugc.png' },
  { code: 'AICTE', title: 'All India Council for Technical Education', logo: '/images/accreditations/aicte.png' },
];

export default function AccreditationsStrip() {
  return (
    <section className="accreditations-strip" aria-label="Accreditations and Affiliations">
      <div className="container">
        <div className="accreditations-strip-header">
          <p className="accreditations-strip-eyebrow">Recognised &amp; Approved</p>
          <h2 className="accreditations-strip-title">Accreditations &amp; Affiliations</h2>
        </div>

        <div className="accreditations-strip-row">
          {ACCREDITATIONS.map(({ code, title, logo }) => (
            <div className="accreditations-strip-card" key={code} title={title}>
              <div className="accreditations-strip-logo">
                <img src={logo} alt={`${code} — ${title} logo`} loading="lazy" />
              </div>
              <span className="accreditations-strip-code">{code}</span>
              <span className="accreditations-strip-desc">{title}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
