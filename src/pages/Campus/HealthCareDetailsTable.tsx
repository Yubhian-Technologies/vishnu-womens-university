import { CheckCircle2, Clock, Building2, PhoneCall } from 'lucide-react';
import { useContentBlocks } from '../../hooks/useContentBlocks';
import {
  DEFAULT_HC_ABOUT,
  DEFAULT_HC_SERVICES,
  DEFAULT_HC_FACILITIES,
} from '../Admin/sections/HealthCareAdmin';
import './HealthCare.css';

export default function HealthCareDetailsTable() {
  const aboutDocs = useContentBlocks('health-care', 'about');
  const servicesDocs = useContentBlocks('health-care', 'servicesChecklist');
  const facilityDocs = useContentBlocks('health-care', 'medicalFacilities');

  const aboutDoc = aboutDocs[0];
  const servicesDoc = servicesDocs[0];

  const aboutData = {
    badge: aboutDoc?.value || DEFAULT_HC_ABOUT.badge,
    title: aboutDoc?.title || DEFAULT_HC_ABOUT.title,
    subtitle: aboutDoc?.desc || DEFAULT_HC_ABOUT.subtitle,
  };

  const servicesList = (servicesDoc?.desc || DEFAULT_HC_SERVICES.join('\n'))
    .split('\n')
    .map((s) => s.trim())
    .filter(Boolean);

  const facilitiesList = facilityDocs.length > 0
    ? facilityDocs.map((d) => ({
        facility: d.title || '',
        location: d.slug || '',
        timings: d.value || '',
        medicalOfficer: d.desc || '',
        nursingStaff: d.icon || '',
        otherStaff: d.storagePath || '',
      }))
    : DEFAULT_HC_FACILITIES;

  return (
    <section className="hc-section hc-details-section">
      <div className="hc-container">
        <div className="hc-section-header">
          <div className="hc-badge">{aboutData.badge}</div>
          <h2 className="hc-section-title">
            {aboutData.title}
          </h2>
          <p className="hc-section-subtitle">
            {aboutData.subtitle}
          </p>
        </div>

        {/* Medical Services Checklist Grid */}
        <div style={{ marginBottom: '1rem', fontWeight: 800, fontSize: '1.2rem', color: '#0f172a' }}>
          Medical Services Offered
        </div>
        <div className="hc-checklist-grid">
          {servicesList.map((serviceName, idx) => (
            <div key={idx} className="hc-checklist-item">
              <div className="hc-check-icon">
                <CheckCircle2 size={18} />
              </div>
              <div className="hc-checklist-text">{serviceName}</div>
            </div>
          ))}
        </div>

        {/* Campus Medical Facilities Structured Table */}
        <div className="hc-table-wrapper">
          <div className="hc-table-title-bar">
            <Building2 size={22} />
            <span>Campus Medical Facilities &amp; Staff Schedule</span>
          </div>
          <div className="hc-table-scroll">
            <table className="hc-table">
              <thead>
                <tr>
                  <th>Facility &amp; Location</th>
                  <th>Working Hours</th>
                  <th>Medical Officer</th>
                  <th>Nursing &amp; Technical Staff</th>
                </tr>
              </thead>
              <tbody>
                {facilitiesList.map((row, idx) => (
                  <tr key={idx}>
                    <td>
                      <div className="hc-facility-name">{row.facility}</div>
                      <div className="hc-facility-loc">{row.location}</div>
                    </td>
                    <td>
                      <div className="hc-badge-timing">
                        <Clock size={12} style={{ display: 'inline', marginRight: '4px', verticalAlign: 'middle' }} />
                        {row.timings}
                      </div>
                    </td>
                    <td>
                      <div className="hc-staff-person">
                        <span className="hc-staff-role">Physician / Doctor</span>
                        <span className="hc-staff-name">{row.medicalOfficer}</span>
                      </div>
                    </td>
                    <td>
                      {row.nursingStaff && (
                        <div className="hc-staff-person">
                          <span className="hc-staff-role">Nursing Staff</span>
                          <span className="hc-staff-name">{row.nursingStaff}</span>
                        </div>
                      )}
                      {row.otherStaff && (
                        <div className="hc-staff-person">
                          <span className="hc-staff-role">Staff / Specialist</span>
                          <span className="hc-staff-name">{row.otherStaff}</span>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Dental Care & 24x7 Ambulance Emergency Info Banner */}
        <div className="hc-info-banner">
          <div className="hc-info-icon">
            <PhoneCall size={26} />
          </div>
          <div>
            <div className="hc-info-title">On-Campus Dental Care &amp; 24×7 Emergency Support</div>
            <div className="hc-info-text">
              Students and staff also have access to on-campus dental care at <strong>Vishnu Dental College &amp; Hospital</strong>, supported by <strong>24×7 emergency medical assistance and ambulance services</strong>.
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

