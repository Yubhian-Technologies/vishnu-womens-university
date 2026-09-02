import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight, faBuilding } from '@fortawesome/free-solid-svg-icons';
import { useCollection, type WithId } from '../../hooks/useCollection';
import { Marquee } from '../ui/marquee-01-utils/marquee';
import './RecruitersSection.css';

export const PARTNER_DOMAINS: Record<string, string> = {
  'Amazon': 'amazon.com',
  'Adobe': 'adobe.com',
  'Microsoft': 'microsoft.com',
  'Google': 'google.com',
  'Flipkart': 'flipkart.com',
  'PayPal': 'paypal.com',
  'Palo Alto Networks': 'www.paloaltonetworks.com',
  'VISA': 'visa.com',
  'D.E. Shaw': 'deshaw.com',
  'Walmart': 'walmart.com',
  'NXP': 'nxp.com',
  'Expedia': 'expedia.com',
  'Myntra': 'myntra.com',
  'Optum': 'www.optum.com',
  'IBM': 'ibm.com',
  'Providence': 'providence.org',
  'Publicis Sapient': 'publicissapient.com',
  'State Street': 'statestreet.com',
  'Athena Health': 'athenahealth.com',
  'TCS': 'www.tcs.com',
  'Infosys': 'infosys.com',
  'Capgemini': 'capgemini.com',
  'Accenture': 'accenture.com',
  'HCL': 'www.hcltech.com',
  'Cognizant': 'cognizant.com',
  'Mahindra & Mahindra': 'mahindra.com',
  'Hyundai Motors': 'hyundai.com',
  'TVS Motors': 'tvsmotor.com',
  'Hero MotoCorp': 'heromotocorp.com',
  'Renault Nissan': 'renault.com',
  'Daimler Truck': 'daimlertruck.com',
  'Caterpillar': 'caterpillar.com',
  'Robert Bosch': 'bosch.com',
  'DBS Bank': 'dbs.com',
  'EPAM': 'epam.com',
  'Zenoti': 'zenoti.com',
  'Persistent Systems': 'persistent.com',
  'Intuit': 'intuit.com',
  'OpenText': 'opentext.com',
  'F5 Networks': 'f5.com',
  'Cloudera': 'cloudera.com',
  'Verizon': 'verizon.com',
};

export const PARTNER_LOGO_OVERRIDES: Record<string, string> = {
  'IBM': 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/51/IBM_logo.svg/250px-IBM_logo.svg.png',
};

const ALL_COMPANIES = Object.keys(PARTNER_DOMAINS);

function RecruiterLogoCard({ name, uploadedUrl }: { name: string; uploadedUrl?: string }) {
  const domain = PARTNER_DOMAINS[name];
  const logoOverride = uploadedUrl || PARTNER_LOGO_OVERRIDES[name];
  const [failed, setFailed] = useState(!domain && !logoOverride);

  const imgSrc = logoOverride || (domain ? `https://www.google.com/s2/favicons?domain=${domain}&sz=128` : '');

  return (
    <div className="recruiter-logo-badge" title={name} aria-label={name}>
      {failed || !imgSrc ? (
        <div className="recruiter-logo-fallback">
          <FontAwesomeIcon icon={faBuilding} style={{ fontSize: 18 }} />
          <span className="recruiter-logo-name-text">{name}</span>
        </div>
      ) : (
        <div className="recruiter-logo-img-wrapper">
          <img
            src={imgSrc}
            alt={name}
            className="recruiter-logo-img"
            loading="lazy"
            onError={() => setFailed(true)}
          />
        </div>
      )}
    </div>
  );
}

export default function RecruitersSection() {
  // Pull live recruiter logos uploaded via /admin -> Recruiter Logos
  const { docs: recruiterLogoDocs } = useCollection<WithId & { imageUrl: string }>(
    'recruiterLogos',
    [],
    { silent: true }
  );

  const logoMap = new Map(recruiterLogoDocs.map((d) => [d.id, d.imageUrl]));

  // Combine uploaded logos + default known list to ensure comprehensive coverage
  const uploadedCompanyNames = recruiterLogoDocs.map((d) => d.id);
  const combinedCompanies = Array.from(new Set([...uploadedCompanyNames, ...ALL_COMPANIES]));

  // Distribute companies into 3 distinct rows
  const chunkSize = Math.ceil(combinedCompanies.length / 3);
  const row1 = combinedCompanies.slice(0, chunkSize);
  const row2 = combinedCompanies.slice(chunkSize, chunkSize * 2);
  const row3 = combinedCompanies.slice(chunkSize * 2);

  // Guarantee seamless infinite loops by padding each row if short
  const makeSeamless = (list: string[]) => (list.length < 8 ? [...list, ...list, ...list] : list);
  const safeRow1 = makeSeamless(row1);
  const safeRow2 = makeSeamless(row2);
  const safeRow3 = makeSeamless(row3);

  return (
    <section className="recruiters-home-section" aria-label="Our Recruiters">
      <div className="container">
        {/* Section Header */}
        <div className="recruiters-home-header reveal">
          <div className="recruiters-header-text">
            <span className="section-label">Placement Partners</span>
            <h2 className="section-title gradient-text">Our Prominent Recruiters</h2>
            <p className="section-desc">
              Over 150+ industry leaders and Fortune 500 corporations trust and recruit VWU engineers every year.
            </p>
          </div>

          <Link to="/placements/our-recruiters" className="btn btn-outline recruiters-view-all-btn">
            <span>View All Recruiters</span>
            <FontAwesomeIcon icon={faArrowRight} style={{ fontSize: 16 }} />
          </Link>
        </div>
      </div>

      {/* 3 Auto-Scrolling Marquee Rows (Non-Synchronized, Zero Gap) */}
      <div className="recruiters-marquee-container">
        {/* Left & Right Black Rectangular Slits (Origination/Destination Effect) */}
        <div className="recruiter-slit recruiter-slit--left" aria-hidden="true">
          <div className="slit-inner-aperture" />
        </div>
        <div className="recruiter-slit recruiter-slit--right" aria-hidden="true">
          <div className="slit-inner-aperture" />
        </div>

        {/* Row 1: Leftward (Slower pace: 85s) */}
        <Marquee
          pauseOnHover
          repeat={3}
          style={{ ['--duration' as string]: '85s', ['--gap' as string]: '0.75rem' }}
          className="recruiters-marquee-row"
        >
          {safeRow1.map((company, idx) => (
            <RecruiterLogoCard
              key={`r1-${company}-${idx}`}
              name={company}
              uploadedUrl={logoMap.get(company)}
            />
          ))}
        </Marquee>

        {/* Row 2: Rightward (Reverse direction, Slower pace: 105s) */}
        <Marquee
          reverse
          pauseOnHover
          repeat={3}
          style={{ ['--duration' as string]: '105s', ['--gap' as string]: '0.75rem' }}
          className="recruiters-marquee-row"
        >
          {safeRow2.map((company, idx) => (
            <RecruiterLogoCard
              key={`r2-${company}-${idx}`}
              name={company}
              uploadedUrl={logoMap.get(company)}
            />
          ))}
        </Marquee>

        {/* Row 3: Leftward (Normal direction, Slower pace: 75s) */}
        <Marquee
          pauseOnHover
          repeat={3}
          style={{ ['--duration' as string]: '75s', ['--gap' as string]: '0.75rem' }}
          className="recruiters-marquee-row"
        >
          {safeRow3.map((company, idx) => (
            <RecruiterLogoCard
              key={`r3-${company}-${idx}`}
              name={company}
              uploadedUrl={logoMap.get(company)}
            />
          ))}
        </Marquee>
      </div>
    </section>
  );
}
