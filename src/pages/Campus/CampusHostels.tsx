import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ClipboardList, BedDouble, Sparkles, ShieldCheck } from 'lucide-react';
import PageHero from '../../components/PageHero/PageHero';
import { useContentBlocks } from '../../hooks/useContentBlocks';
import { resolveContentIcon } from '../../lib/contentIcons';
import { findCampusFacilityBySlug } from './campusFacilities.data';
import type { ContentBlockDoc } from '../Admin/sections/ContentBlocksAdmin';
import './tabbed-section.css';

// Shown until an admin adds real entries in Page Content Blocks — same
// fallback pattern used throughout this codebase (e.g. defaultTestimonials
// in Home.tsx). Reasonable starting content for a real hostel, not
// placeholder-looking filler text.
const defaultAdmissionProcedure: ContentBlockDoc[] = [
  { id: 'd1', page: 'campus-hostels', section: 'admissionProcedure', value: 'Step 1', title: 'Submit Hostel Application', desc: 'Fill out the hostel application form available at the hostel office or through the admissions portal after admission is confirmed.', icon: '', slug: '', order: 0 },
  { id: 'd2', page: 'campus-hostels', section: 'admissionProcedure', value: 'Step 2', title: 'Document Verification', desc: 'Submit ID proof, address proof, and admission confirmation documents for verification at the hostel office.', icon: '', slug: '', order: 1 },
  { id: 'd3', page: 'campus-hostels', section: 'admissionProcedure', value: 'Step 3', title: 'Fee Payment', desc: 'Pay the hostel and mess fees as per the fee structure to confirm your seat allotment.', icon: '', slug: '', order: 2 },
  { id: 'd4', page: 'campus-hostels', section: 'admissionProcedure', value: 'Step 4', title: 'Room Allotment', desc: 'Rooms are allotted based on availability and preference; students receive their room and roommate details before check-in.', icon: '', slug: '', order: 3 },
];

const defaultAccommodation: ContentBlockDoc[] = [
  { id: 'd1', page: 'campus-hostels', section: 'accommodation', value: '', title: 'Single Sharing', desc: 'A private room for students who prefer to stay independently, with a bed, study table, and wardrobe.', icon: '', slug: '', order: 0 },
  { id: 'd2', page: 'campus-hostels', section: 'accommodation', value: '', title: 'Double Sharing', desc: 'A shared room for two students, each with their own bed, study table, and wardrobe space.', icon: '', slug: '', order: 1 },
  { id: 'd3', page: 'campus-hostels', section: 'accommodation', value: '', title: 'Triple Sharing', desc: 'A shared room for three students — the most economical option, with individual storage for each resident.', icon: '', slug: '', order: 2 },
];

const defaultAmenities: ContentBlockDoc[] = [
  { id: 'd1', page: 'campus-hostels', section: 'amenities', value: '', title: 'Mess & Dining Hall', desc: 'A mess with a modern kitchen and spacious, air-conditioned dining halls is attached to the hostel.', icon: 'Utensils', slug: '', order: 0 },
  { id: 'd2', page: 'campus-hostels', section: 'amenities', value: '', title: 'Reading Room', desc: 'Newspapers and educative periodicals are provided in the reading room, with selections approved by the Warden.', icon: 'Newspaper', slug: '', order: 1 },
  { id: 'd3', page: 'campus-hostels', section: 'amenities', value: '', title: 'Reading Room / TV Room', desc: 'A reading room / T.V. room is provided separately in each block, operated during stipulated hours.', icon: 'Tv', slug: '', order: 2 },
  { id: 'd4', page: 'campus-hostels', section: 'amenities', value: '', title: 'Indoor & Outdoor Games', desc: 'Indoor and outdoor games are provided in the hostel for residents.', icon: 'Dumbbell', slug: '', order: 3 },
  { id: 'd5', page: 'campus-hostels', section: 'amenities', value: '', title: 'Auditorium Screenings', desc: 'Pictures are screened regularly in the auditorium for hostel residents.', icon: 'Clapperboard', slug: '', order: 4 },
];

const defaultDisciplinePolicies: ContentBlockDoc[] = [
  { id: 'd1', page: 'campus-hostels', section: 'disciplinePolicies', value: '', title: 'Entry & Exit Timings', desc: 'Residents must be back in the hostel by the prescribed curfew time; late entries require prior permission from the warden.', icon: '', slug: '', order: 0 },
  { id: 'd2', page: 'campus-hostels', section: 'disciplinePolicies', value: '', title: 'Visitor Policy', desc: 'Visitors are permitted only in designated common areas during specified hours, and must be registered at the entrance.', icon: '', slug: '', order: 1 },
  { id: 'd3', page: 'campus-hostels', section: 'disciplinePolicies', value: '', title: 'Ragging-Free Zone', desc: 'VWU maintains a strict zero-tolerance policy toward ragging in and around all hostel premises.', icon: '', slug: '', order: 2 },
  { id: 'd4', page: 'campus-hostels', section: 'disciplinePolicies', value: '', title: 'Attendance & Roll Call', desc: 'Residents are expected to be present for scheduled roll calls; repeated absence is reported to the hostel warden.', icon: '', slug: '', order: 3 },
];

type TabId = 'about' | 'admission' | 'accommodation' | 'amenities' | 'discipline';

const TABS: { id: TabId; label: string }[] = [
  { id: 'about', label: 'About Hostel' },
  { id: 'admission', label: 'Admission Procedure' },
  { id: 'accommodation', label: 'Accommodation' },
  { id: 'amenities', label: 'Amenities' },
  { id: 'discipline', label: 'Discipline Policies' },
];

const hashToTab: Record<string, TabId> = {
  '#about': 'about',
  '#admission': 'admission',
  '#accommodation': 'accommodation',
  '#amenities': 'amenities',
  '#discipline': 'discipline',
};

export default function CampusHostels() {
  const facility = findCampusFacilityBySlug('campus-hostels');
  const [activeTab, setActiveTab] = useState<TabId>('about');
  const location = useLocation();

  const liveAdmissionProcedure = useContentBlocks('campus-hostels', 'admissionProcedure');
  const admissionProcedure = liveAdmissionProcedure.length > 0 ? liveAdmissionProcedure : defaultAdmissionProcedure;
  const liveAccommodation = useContentBlocks('campus-hostels', 'accommodation');
  const accommodation = liveAccommodation.length > 0 ? liveAccommodation : defaultAccommodation;
  const liveAmenities = useContentBlocks('campus-hostels', 'amenities');
  const amenities = liveAmenities.length > 0 ? liveAmenities : defaultAmenities;
  const liveDisciplinePolicies = useContentBlocks('campus-hostels', 'disciplinePolicies');
  const disciplinePolicies = liveDisciplinePolicies.length > 0 ? liveDisciplinePolicies : defaultDisciplinePolicies;

  useEffect(() => {
    document.title = 'Campus Hostels | Campus Life | VWU';
  }, []);

  useEffect(() => {
    const tab = hashToTab[location.hash];
    if (tab) setActiveTab(tab);
  }, [location.hash]);

  if (!facility) return null;

  return (
    <main className="page-wrapper">
      <PageHero
        page="campus-campus-hostels"
        defaultImage="https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=1920&q=80"
        defaultTitle={facility.title}
        defaultSubtitle={facility.desc}
        breadcrumb={[
          { label: 'Home', to: '/' },
          { label: 'Campus Life', to: '/campus' },
          { label: facility.title },
        ]}
      />

      <section className="section bg-white">
        <div className="container">
          <div className="section-tabs">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`section-tab-btn${activeTab === tab.id ? ' active' : ''}`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* About Hostel */}
          {activeTab === 'about' && (
            <div>
              <span className="section-label">Campus Life</span>
              <h2 className="section-title" style={{ fontSize: '1.75rem' }}>About {facility.title}</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)', maxWidth: 760 }}>
                <p style={{ fontSize: 'var(--text-lg)', color: 'var(--color-text)', lineHeight: 1.75 }}>
                  The objective of the Hostel is to provide suitable and comfortable accommodation for deserving students from Andhra Pradesh and outside the State. The Hostel has a number of blocks to accommodate exclusively for girl students.
                </p>
                <p style={{ fontSize: 'var(--text-base)', color: 'var(--color-text)', lineHeight: 1.75 }}>
                  Ideal hostel facility with a homely atmosphere is provided within the campus. Mess with a modern kitchen and spacious air-conditioned dining halls are attached to the hostel. Many recreation facilities are also provided.
                </p>
                <p style={{ fontSize: 'var(--text-base)', color: 'var(--color-text)', lineHeight: 1.75 }}>
                  To improve their general knowledge, newspapers and educative periodicals are provided in the reading room. The selection of newspapers and periodicals is done by the Boarders but approved by the Warden.
                </p>
                <p style={{ fontSize: 'var(--text-base)', color: 'var(--color-text)', lineHeight: 1.75 }}>
                  A reading room / T.V. room is provided separately in each block, operated during stipulated hours. Indoor / outdoor games are provided in the hostel, and pictures are screened regularly in the auditorium.
                </p>
              </div>
            </div>
          )}

          {/* Admission Procedure */}
          {activeTab === 'admission' && (
            <div>
              <h2 className="section-title" style={{ marginBottom: 'var(--space-4)' }}>Admission Procedure</h2>
              <p style={{ color: 'var(--color-text-light)', marginBottom: 'var(--space-8)', maxWidth: 680 }}>
                Steps to secure hostel accommodation after your admission to VWU is confirmed.
              </p>
              <div className="mobile-stack-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 'var(--space-5)' }}>
                {admissionProcedure.map((s) => (
                  <div key={s.id} style={{ background: 'var(--color-white)', border: '1.5px solid var(--color-light-gray)', borderRadius: 'var(--radius-md)', padding: 'var(--space-6)', display: 'flex', gap: 'var(--space-4)', alignItems: 'flex-start' }}>
                    <ClipboardList size={32} strokeWidth={1.75} color="var(--color-accent)" style={{ flexShrink: 0 }} />
                    <div>
                      <h3 style={{ fontFamily: 'var(--font-sans)', fontWeight: 900, color: 'var(--color-primary)', marginBottom: 'var(--space-1)' }}>
                        {s.title}{s.value && <span style={{ color: 'var(--color-accent)' }}> — {s.value}</span>}
                      </h3>
                      <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-light)', lineHeight: 1.6 }}>{s.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Accommodation */}
          {activeTab === 'accommodation' && (
            <div>
              <h2 className="section-title" style={{ marginBottom: 'var(--space-4)' }}>Accommodation</h2>
              <p style={{ color: 'var(--color-text-light)', marginBottom: 'var(--space-8)', maxWidth: 680 }}>
                Room types available to resident students, to suit different preferences and budgets.
              </p>
              <div className="mobile-stack-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 'var(--space-5)' }}>
                {accommodation.map((a) => (
                  <div key={a.id} style={{ background: 'var(--color-white)', border: '1.5px solid var(--color-light-gray)', borderRadius: 'var(--radius-md)', padding: 'var(--space-6)', display: 'flex', gap: 'var(--space-4)', alignItems: 'flex-start' }}>
                    <BedDouble size={32} strokeWidth={1.75} color="var(--color-accent)" style={{ flexShrink: 0 }} />
                    <div>
                      <h3 style={{ fontFamily: 'var(--font-sans)', fontWeight: 900, color: 'var(--color-primary)', marginBottom: 'var(--space-2)' }}>{a.title}</h3>
                      <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-light)', lineHeight: 1.6 }}>{a.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Amenities */}
          {activeTab === 'amenities' && (
            <div>
              <h2 className="section-title" style={{ marginBottom: 'var(--space-4)' }}>Amenities</h2>
              <p style={{ color: 'var(--color-text-light)', marginBottom: 'var(--space-8)', maxWidth: 680 }}>
                Facilities and services available to every hostel resident.
              </p>
              <div className="mobile-stack-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 'var(--space-5)' }}>
                {amenities.map((a) => {
                  const Icon = resolveContentIcon(a.icon) || Sparkles;
                  return (
                    <div key={a.id} style={{ background: 'var(--color-white)', border: '1.5px solid var(--color-light-gray)', borderRadius: 'var(--radius-md)', padding: 'var(--space-6)', display: 'flex', gap: 'var(--space-4)', alignItems: 'flex-start' }}>
                      <Icon size={32} strokeWidth={1.75} color="var(--color-accent)" style={{ flexShrink: 0 }} />
                      <div>
                        <h3 style={{ fontFamily: 'var(--font-sans)', fontWeight: 900, color: 'var(--color-primary)', marginBottom: 'var(--space-2)' }}>{a.title}</h3>
                        <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-light)', lineHeight: 1.6 }}>{a.desc}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Discipline Policies */}
          {activeTab === 'discipline' && (
            <div>
              <h2 className="section-title" style={{ marginBottom: 'var(--space-4)' }}>Discipline Policies</h2>
              <p style={{ color: 'var(--color-text-light)', marginBottom: 'var(--space-8)', maxWidth: 680 }}>
                Rules every hostel resident is expected to follow to keep the hostel community safe and orderly.
              </p>
              <div className="mobile-stack-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 'var(--space-5)' }}>
                {disciplinePolicies.map((p) => (
                  <div key={p.id} style={{ background: 'var(--color-white)', border: '1.5px solid var(--color-light-gray)', borderRadius: 'var(--radius-md)', padding: 'var(--space-6)', display: 'flex', gap: 'var(--space-4)', alignItems: 'flex-start' }}>
                    <ShieldCheck size={32} strokeWidth={1.75} color="var(--color-accent)" style={{ flexShrink: 0 }} />
                    <div>
                      <h3 style={{ fontFamily: 'var(--font-sans)', fontWeight: 900, color: 'var(--color-primary)', marginBottom: 'var(--space-2)' }}>{p.title}</h3>
                      <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-light)', lineHeight: 1.6 }}>{p.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      <section style={{ background: 'var(--color-primary)', padding: 'var(--space-14) 0' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <h2 style={{ color: 'var(--color-white)', marginBottom: 'var(--space-4)' }}>
            Explore More of Campus Life
          </h2>
          <div style={{ display: 'flex', gap: 'var(--space-4)', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/campus" className="btn btn-accent">Back to Campus Life</Link>
            <Link to="/student-life" className="btn btn-secondary">Student Life</Link>
          </div>
        </div>
      </section>
    </main>
  );
}
