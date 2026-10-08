import { useDocument } from '../../hooks/useDocument';
import { HOME_CONTENT_COLLECTION, HOME_CONTENT_DOC_ID, type HomeContentDoc, DEFAULT_HOME_CONTENT, DEFAULT_ACCREDITATIONS, type Accreditation } from '../../constants/homeContentDefaults';
import './AccreditationsStrip.css';

export type { Accreditation };
export { DEFAULT_ACCREDITATIONS };

export default function AccreditationsStrip() {
  const { data: remoteHomeContent } = useDocument<HomeContentDoc>(HOME_CONTENT_COLLECTION, HOME_CONTENT_DOC_ID);

  const eyebrow = remoteHomeContent?.accreditationsEyebrow || DEFAULT_HOME_CONTENT.accreditationsEyebrow || 'Academic Recognition';
  const title = remoteHomeContent?.accreditationsTitle || DEFAULT_HOME_CONTENT.accreditationsTitle || 'Accreditations & Affiliations';
  const subtitle = remoteHomeContent?.accreditationsSubtitle || DEFAULT_HOME_CONTENT.accreditationsSubtitle || 'Recognized by leading academic and regulatory bodies in India.';
  const accreditations = (remoteHomeContent?.accreditationsList && remoteHomeContent.accreditationsList.length > 0)
    ? remoteHomeContent.accreditationsList
    : DEFAULT_ACCREDITATIONS;

  return (
    <section className="accreditations-strip" aria-label="Accreditations and Affiliations">
      <div className="container">
        <div className="accreditations-strip-header">
          <span className="accreditations-strip-eyebrow">{eyebrow}</span>
          <h2 className="accreditations-strip-title">{title}</h2>
          <p className="accreditations-strip-subtitle">{subtitle}</p>
        </div>

        <div className="accreditations-strip-row">
          {accreditations.map(({ code, title: accTitle, logo, years }, idx) => (
            <div className="accreditations-strip-card" key={`${code}-${idx}`} title={accTitle}>
              <div className="accreditations-strip-logo">
                <img src={logo} alt={`${code} — ${accTitle} logo`} loading="lazy" />
              </div>
              <span className="accreditations-strip-code">{code}</span>
              <span className="accreditations-strip-rule" aria-hidden="true" />
              <span className="accreditations-strip-desc">{accTitle}</span>
              <span className="accreditations-strip-years">{years}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

