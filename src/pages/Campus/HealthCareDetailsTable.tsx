import { CheckCircle2, Clock, Building2, PhoneCall } from 'lucide-react';
import './HealthCare.css';

// Medical Services Checklist Data
export const MEDICAL_SERVICES_CHECKLIST = [
  'General OPD & Medical Consultation',
  'First Aid & Emergency Care',
  'Basic Laboratory & Diagnostic Services',
  'ECG & Vital Monitoring',
  'Inpatient & Sick Bay Facilities',
  'Pharmacy & Essential Medicines',
  'Ambulance Support',
  'Specialist Consultations',
];

// Campus Medical Facilities Table Data
export const CAMPUS_FACILITIES_TABLE = [
  {
    facility: 'Medical OPD',
    location: 'CSSD Block, VDC',
    timings: '8:30 AM – 5:00 PM',
    medicalOfficer: 'Dr. V. Deepika, MBBS',
    staff: [
      { role: 'Nursing Staff', name: 'Mr. I. Kiran, B.Sc. (N)' },
      { role: 'Laboratory Technician', name: 'Mr. Ramu Narayana Rao' },
    ],
  },
  {
    facility: 'Sick Bay',
    location: 'Near Medha Hostel',
    timings: '8:30 AM – 6:00 PM',
    medicalOfficer: 'On-Duty Medical Staff',
    staff: [
      { role: 'Nursing Staff', name: 'Mrs. M. Shanthi, B.Sc. (N)' },
    ],
  },
  {
    facility: 'First Aid Centre',
    location: 'Near Warden’s Office',
    timings: '8:30 AM – 6:00 PM',
    medicalOfficer: 'Dr. S. P. Vadana, MD (Physician)',
    staff: [
      { role: 'Nursing Staff', name: 'Mrs. M. Anitha, GNM' },
    ],
  },
  {
    facility: 'Specialist Consultation',
    location: 'OBGY Clinic Desk',
    timings: 'Tuesdays, 5:00 – 6:00 PM',
    medicalOfficer: 'Dr. M. Jagadeeshwari, DNB (OBGY)',
    staff: [
      { role: 'Specialist Visit', name: 'Obstetrics & Gynecology' },
    ],
  },
];

export default function HealthCareDetailsTable() {
  return (
    <section className="hc-section hc-details-section">
      <div className="hc-container">
        <div className="hc-section-header">
          <div className="hc-badge">FACILITIES & SCHEDULE</div>
          <h2 className="hc-section-title">
            Quality Healthcare, <span>Close to Campus</span>
          </h2>
          <p className="hc-section-subtitle">
            Vishnu Women’s University provides accessible and reliable healthcare support to students and staff through dedicated medical facilities across the campus. Services include medical consultation, first aid, basic diagnostics, inpatient care, specialist consultations, pharmacy and emergency support.
          </p>
        </div>

        {/* Medical Services Checklist Grid */}
        <div style={{ marginBottom: '1rem', fontWeight: 800, fontSize: '1.2rem', color: '#0f172a' }}>
          Medical Services Offered
        </div>
        <div className="hc-checklist-grid">
          {MEDICAL_SERVICES_CHECKLIST.map((serviceName, idx) => (
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
            <span>Campus Medical Facilities & Staff Schedule</span>
          </div>
          <div className="hc-table-scroll">
            <table className="hc-table">
              <thead>
                <tr>
                  <th>Facility & Location</th>
                  <th>Working Hours</th>
                  <th>Medical Officer</th>
                  <th>Nursing & Technical Staff</th>
                </tr>
              </thead>
              <tbody>
                {CAMPUS_FACILITIES_TABLE.map((row, idx) => (
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
                      {row.staff.map((st, sIdx) => (
                        <div key={sIdx} className="hc-staff-person">
                          <span className="hc-staff-role">{st.role}</span>
                          <span className="hc-staff-name">{st.name}</span>
                        </div>
                      ))}
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
            <div className="hc-info-title">On-Campus Dental Care & 24×7 Emergency Support</div>
            <div className="hc-info-text">
              Students and staff also have access to on-campus dental care at <strong>Vishnu Dental College & Hospital</strong>, supported by <strong>24×7 emergency medical assistance and ambulance services</strong>.
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
