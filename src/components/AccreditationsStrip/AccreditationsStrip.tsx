import './AccreditationsStrip.css';

type Accreditation = {
  code: string;
  title: string;
  logo: string;
  years: string;
};

const ACCREDITATIONS: Accreditation[] = [
  { code: 'NBA', title: 'National Board of Accreditation', logo: '/images/accreditations/nba.png', years: 'Accredited 2008–2028' },
  { code: 'NAAC', title: 'National Assessment & Accreditation Council', logo: '/images/accreditations/naac.png', years: 'Accredited 2015–2027' },
  { code: 'UGC', title: 'University Grants Commission', logo: '/images/accreditations/ugc.png', years: 'Approved 2014–2035' },
  { code: 'AICTE', title: 'All India Council for Technical Education', logo: '/images/accreditations/aicte.png', years: 'Approved 2001–Present' },
];

export default function AccreditationsStrip() {
  return (
    <section className="accreditations-strip" aria-label="Accreditations and Affiliations">
      <div className="container">
        <div className="accreditations-strip-header">
          <span className="accreditations-strip-eyebrow">Academic Recognition</span>
          <h2 className="accreditations-strip-title">Accreditations &amp; Affiliations</h2>
          <p className="accreditations-strip-subtitle">Recognized by leading academic and regulatory bodies in India.</p>
        </div>

        <div className="accreditations-strip-row">
          {ACCREDITATIONS.map(({ code, title, logo, years }) => (
            <div className="accreditations-strip-card" key={code} title={title}>
              <div className="accreditations-strip-logo">
                <img src={logo} alt={`${code} — ${title} logo`} loading="lazy" />
              </div>
              <span className="accreditations-strip-code">{code}</span>
              <span className="accreditations-strip-rule" aria-hidden="true" />
              <span className="accreditations-strip-desc">{title}</span>
              <span className="accreditations-strip-years">{years}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
