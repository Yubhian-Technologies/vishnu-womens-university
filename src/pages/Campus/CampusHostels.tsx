import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import SEO from '../../components/SEO/SEO';
import PageHero from '../../components/PageHero/PageHero';
import { usePageBanners } from '../../hooks/usePageBanners';
import { useSitePhotos } from '../../hooks/useSitePhotos';
import PhotoGrid from '../../components/PhotoGrid/PhotoGrid';
import { PHOTO_NEEDED_PLACEHOLDER } from '../../lib/photoPlaceholder';
import '../Campus/tabbed-section.css';

const DEFAULT_HERO_TITLE = 'Campus Hostels at Vishnu Women’s University';
const DEFAULT_HERO_SUBTITLE = 'Safe, comfortable and well-equipped residential spaces designed to support student life on campus.';

export default function CampusHostels() {
  const { slides: heroSlides } = usePageBanners('campus-hostels');
  const heroSlide = heroSlides[0];
  const heroTitle = heroSlide?.title || DEFAULT_HERO_TITLE;
  const heroSubtitle = heroSlide?.subtitle || DEFAULT_HERO_SUBTITLE;

  const defaultPhotos = Array.from({ length: 5 }, (_, i) => ({
    src: PHOTO_NEEDED_PLACEHOLDER, alt: `Campus Hostels — Photo ${i + 1}`, caption: '',
  }));
  const photos = useSitePhotos('campus', 'campus-hostels', defaultPhotos);

  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    document.title = 'Campus Hostels | Campus Life | VWU';
  }, []);

  return (
    <main className="page-wrapper">
      <SEO
        title="Campus Hostels | Vishnu Women's University"
        description="Safe, comfortable and well-equipped residential spaces designed to support student life on campus."
        canonicalPath="/campus/campus-hostels"
      />

      <PageHero
        page="campus-campus-hostels"
        defaultTitle={heroTitle}
        defaultSubtitle={heroSubtitle}
        hideCta={true}
      />

      <section className="section bg-white">
        <div className="container">
          {/* Navigation Tabs */}
          <div className="section-tabs">
            <button className={`section-tab-btn ${activeTab === 'overview' ? 'active' : ''}`} onClick={() => setActiveTab('overview')}>Hostel Overview</button>
            <button className={`section-tab-btn ${activeTab === 'admission' ? 'active' : ''}`} onClick={() => setActiveTab('admission')}>Admission Procedure</button>
            <button className={`section-tab-btn ${activeTab === 'accommodation' ? 'active' : ''}`} onClick={() => setActiveTab('accommodation')}>Accommodation</button>
            <button className={`section-tab-btn ${activeTab === 'amenities' ? 'active' : ''}`} onClick={() => setActiveTab('amenities')}>Amenities</button>
            <button className={`section-tab-btn ${activeTab === 'rules' ? 'active' : ''}`} onClick={() => setActiveTab('rules')}>Hostel Rules</button>
          </div>

          <div style={{ padding: '2rem 0' }}>
            {activeTab === 'overview' && (
              <div>
                <span className="section-label" style={{ color: 'var(--color-primary)' }}>A Comfortable Campus Community</span>
                <h2 className="section-title" style={{ fontSize: '1.75rem', marginBottom: '1.5rem' }}>Hostel Overview</h2>
                
                <div style={{ fontSize: '1.1rem', color: 'var(--color-text)', lineHeight: 1.7, marginBottom: '2.5rem' }}>
                  <p style={{ marginBottom: '1rem' }}>
                    Vishnu Women’s University provides residential accommodation for 6,000+ students, with spaces designed for comfortable living, study and community life.
                  </p>
                  <p>
                    The hostels bring together accommodation, dining, recreation, security and student support within the campus, helping residents stay connected to both academic and campus activities.
                  </p>
                </div>

                <h3 style={{ fontSize: '1.5rem', color: 'var(--color-primary)', marginBottom: '1.5rem' }}>Hostel Facilities at a Glance</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', marginBottom: '2.5rem' }}>
                  <div style={{ padding: '1.25rem', background: 'var(--color-off-white)', borderRadius: '8px', borderLeft: '4px solid var(--color-primary)' }}>
                    <strong style={{ display: 'block', fontSize: '1.15rem', marginBottom: '0.25rem', color: 'var(--color-heading)' }}>Air-Conditioned Accommodation</strong>
                    <span style={{ color: 'var(--color-text-light)' }}>Dedicated air-conditioned hostel facilities are available for enhanced comfort.</span>
                  </div>
                  <div style={{ padding: '1.25rem', background: 'var(--color-off-white)', borderRadius: '8px', borderLeft: '4px solid var(--color-primary)' }}>
                    <strong style={{ display: 'block', fontSize: '1.15rem', marginBottom: '0.25rem', color: 'var(--color-heading)' }}>Dining & Mess Facilities</strong>
                    <span style={{ color: 'var(--color-text-light)' }}>Hygienic kitchens, air-conditioned messes and canteens support students’ everyday dining needs.</span>
                  </div>
                  <div style={{ padding: '1.25rem', background: 'var(--color-off-white)', borderRadius: '8px', borderLeft: '4px solid var(--color-primary)' }}>
                    <strong style={{ display: 'block', fontSize: '1.15rem', marginBottom: '0.25rem', color: 'var(--color-heading)' }}>24×7 Security</strong>
                    <span style={{ color: 'var(--color-text-light)' }}>Hostel areas are supported by CCTV surveillance, security personnel and lady security staff.</span>
                  </div>
                  <div style={{ padding: '1.25rem', background: 'var(--color-off-white)', borderRadius: '8px', borderLeft: '4px solid var(--color-primary)' }}>
                    <strong style={{ display: 'block', fontSize: '1.15rem', marginBottom: '0.25rem', color: 'var(--color-heading)' }}>Round-the-Clock Support</strong>
                    <span style={{ color: 'var(--color-text-light)' }}>Caretakers and support staff are available to assist residents with day-to-day requirements.</span>
                  </div>
                  <div style={{ padding: '1.25rem', background: 'var(--color-off-white)', borderRadius: '8px', borderLeft: '4px solid var(--color-primary)' }}>
                    <strong style={{ display: 'block', fontSize: '1.15rem', marginBottom: '0.25rem', color: 'var(--color-heading)' }}>Digital Hostel Management</strong>
                    <span style={{ color: 'var(--color-text-light)' }}>Admission, room allotment, outings and related hostel processes are managed digitally.</span>
                  </div>
                  <div style={{ padding: '1.25rem', background: 'var(--color-off-white)', borderRadius: '8px', borderLeft: '4px solid var(--color-primary)' }}>
                    <strong style={{ display: 'block', fontSize: '1.15rem', marginBottom: '0.25rem', color: 'var(--color-heading)' }}>Student-Centred Residential Life</strong>
                    <span style={{ color: 'var(--color-text-light)' }}>Study, dining and recreational spaces create opportunities for students to live, learn and connect on campus.</span>
                  </div>
                </div>

                <h3 style={{ fontSize: '1.5rem', color: 'var(--color-primary)', marginBottom: '1rem' }}>Student-Led Dining Experience</h3>
                <p style={{ fontSize: '1.1rem', color: 'var(--color-text)', lineHeight: 1.7 }}>
                  Dining at VWU goes beyond everyday meals. Through the Tasting Kitchen initiative, students can explore new flavours, suggest recipes and contribute ideas for the canteen menu, making dining a more participative part of campus life.
                </p>
              </div>
            )}

            {activeTab === 'admission' && (
              <div>
                <span className="section-label" style={{ color: 'var(--color-primary)' }}>Simple, Digital and Paperless</span>
                <h2 className="section-title" style={{ fontSize: '1.75rem', marginBottom: '1.5rem' }}>Admission Procedure</h2>
                
                <div style={{ fontSize: '1.1rem', color: 'var(--color-text)', lineHeight: 1.7, marginBottom: '2.5rem' }}>
                  <p style={{ marginBottom: '1rem' }}>
                    Hostel admission and related services are managed through the Smart Campus App, providing students with a streamlined digital process.
                  </p>
                  <p>
                    Students can use the platform to apply for hostel accommodation, select available hostel and room preferences, complete payments, manage room allotment, request outing permissions and initiate hostel-vacating procedures.
                  </p>
                </div>

                <h3 style={{ fontSize: '1.5rem', color: 'var(--color-primary)', marginBottom: '1.5rem' }}>Hostel Admission Process</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2.5rem' }}>
                  <div style={{ padding: '1.25rem', background: 'var(--color-off-white)', borderRadius: '8px' }}>
                    <strong style={{ display: 'block', fontSize: '1.15rem', marginBottom: '0.25rem', color: 'var(--color-heading)' }}>1. Apply for accommodation</strong>
                    <span style={{ color: 'var(--color-text-light)' }}>Submit the hostel application through the Smart Campus App.</span>
                  </div>
                  <div style={{ padding: '1.25rem', background: 'var(--color-off-white)', borderRadius: '8px' }}>
                    <strong style={{ display: 'block', fontSize: '1.15rem', marginBottom: '0.25rem', color: 'var(--color-heading)' }}>2. Select preferences</strong>
                    <span style={{ color: 'var(--color-text-light)' }}>Choose available hostel, room type and accommodation preferences.</span>
                  </div>
                  <div style={{ padding: '1.25rem', background: 'var(--color-off-white)', borderRadius: '8px' }}>
                    <strong style={{ display: 'block', fontSize: '1.15rem', marginBottom: '0.25rem', color: 'var(--color-heading)' }}>3. Complete payment</strong>
                    <span style={{ color: 'var(--color-text-light)' }}>Pay the applicable hostel fees through the designated process.</span>
                  </div>
                  <div style={{ padding: '1.25rem', background: 'var(--color-off-white)', borderRadius: '8px' }}>
                    <strong style={{ display: 'block', fontSize: '1.15rem', marginBottom: '0.25rem', color: 'var(--color-heading)' }}>4. Room allotment</strong>
                    <span style={{ color: 'var(--color-text-light)' }}>Accommodation is allotted according to availability and hostel guidelines.</span>
                  </div>
                  <div style={{ padding: '1.25rem', background: 'var(--color-off-white)', borderRadius: '8px' }}>
                    <strong style={{ display: 'block', fontSize: '1.15rem', marginBottom: '0.25rem', color: 'var(--color-heading)' }}>5. Manage hostel services</strong>
                    <span style={{ color: 'var(--color-text-light)' }}>Outing requests and other hostel-related processes can be accessed digitally.</span>
                  </div>
                </div>

                <div>
                  <a href="#" className="btn btn-primary" onClick={(e) => e.preventDefault()}>View Hostel Admission Guidelines</a>
                </div>
              </div>
            )}

            {activeTab === 'accommodation' && (
              <div>
                <span className="section-label" style={{ color: 'var(--color-primary)' }}>Comfortable Spaces for Everyday Living</span>
                <h2 className="section-title" style={{ fontSize: '1.75rem', marginBottom: '1.5rem' }}>Accommodation</h2>
                
                <div style={{ fontSize: '1.1rem', color: 'var(--color-text)', lineHeight: 1.7, marginBottom: '2.5rem' }}>
                  <p style={{ marginBottom: '1rem' }}>
                    Hostel rooms are generally shared by three students and are furnished with essential facilities including beds, tables, chairs, storage racks, ceiling fans and lighting.
                  </p>
                  <p>
                    Room allotment is managed by the hostel administration according to availability and applicable guidelines. Students are expected to maintain their rooms and use the facilities responsibly throughout their stay.
                  </p>
                </div>

                <h3 style={{ fontSize: '1.5rem', color: 'var(--color-primary)', marginBottom: '1rem' }}>Room Essentials</h3>
                <ul style={{ paddingLeft: '1.5rem', color: 'var(--color-text)', fontSize: '1.1rem', lineHeight: 1.8 }}>
                  <li>Beds and study tables</li>
                  <li>Chairs and storage racks</li>
                  <li>Ceiling fans and lighting</li>
                  <li>Essential electrical fittings</li>
                  <li>Shared residential facilities</li>
                </ul>
              </div>
            )}

            {activeTab === 'amenities' && (
              <div>
                <span className="section-label" style={{ color: 'var(--color-primary)' }}>Facilities for Study, Recreation and Daily Life</span>
                <h2 className="section-title" style={{ fontSize: '1.75rem', marginBottom: '1.5rem' }}>Amenities</h2>
                
                <p style={{ fontSize: '1.1rem', color: 'var(--color-text)', lineHeight: 1.7, marginBottom: '2.5rem' }}>
                  VWU hostels provide essential facilities that support students’ academic needs, recreation and everyday living.
                </p>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
                  <div style={{ padding: '1.25rem', background: 'var(--color-off-white)', borderRadius: '8px' }}>
                    <strong style={{ display: 'block', fontSize: '1.15rem', marginBottom: '0.25rem', color: 'var(--color-heading)' }}>Wi-Fi Connectivity</strong>
                    <span style={{ color: 'var(--color-text-light)' }}>Internet access is available for academic and learning purposes in accordance with university guidelines.</span>
                  </div>
                  <div style={{ padding: '1.25rem', background: 'var(--color-off-white)', borderRadius: '8px' }}>
                    <strong style={{ display: 'block', fontSize: '1.15rem', marginBottom: '0.25rem', color: 'var(--color-heading)' }}>24-Hour Power Supply</strong>
                    <span style={{ color: 'var(--color-text-light)' }}>Hostel facilities are supported by round-the-clock power availability.</span>
                  </div>
                  <div style={{ padding: '1.25rem', background: 'var(--color-off-white)', borderRadius: '8px' }}>
                    <strong style={{ display: 'block', fontSize: '1.15rem', marginBottom: '0.25rem', color: 'var(--color-heading)' }}>Reading Spaces</strong>
                    <span style={{ color: 'var(--color-text-light)' }}>Dedicated reading areas provide students with space for focused study and access to newspapers and periodicals.</span>
                  </div>
                  <div style={{ padding: '1.25rem', background: 'var(--color-off-white)', borderRadius: '8px' }}>
                    <strong style={{ display: 'block', fontSize: '1.15rem', marginBottom: '0.25rem', color: 'var(--color-heading)' }}>Recreation Facilities</strong>
                    <span style={{ color: 'var(--color-text-light)' }}>Indoor and outdoor games provide opportunities for recreation beyond academic hours.</span>
                  </div>
                  <div style={{ padding: '1.25rem', background: 'var(--color-off-white)', borderRadius: '8px' }}>
                    <strong style={{ display: 'block', fontSize: '1.15rem', marginBottom: '0.25rem', color: 'var(--color-heading)' }}>Common & TV Rooms</strong>
                    <span style={{ color: 'var(--color-text-light)' }}>Designated common spaces are available within hostel blocks for relaxation and recreation.</span>
                  </div>
                  <div style={{ padding: '1.25rem', background: 'var(--color-off-white)', borderRadius: '8px' }}>
                    <strong style={{ display: 'block', fontSize: '1.15rem', marginBottom: '0.25rem', color: 'var(--color-heading)' }}>Dining Facilities</strong>
                    <span style={{ color: 'var(--color-text-light)' }}>Mess and canteen facilities provide convenient access to meals within the residential campus.</span>
                  </div>
                  <div style={{ padding: '1.25rem', background: 'var(--color-off-white)', borderRadius: '8px' }}>
                    <strong style={{ display: 'block', fontSize: '1.15rem', marginBottom: '0.25rem', color: 'var(--color-heading)' }}>Safety & Support</strong>
                    <span style={{ color: 'var(--color-text-light)' }}>Security monitoring and residential support staff are available to help maintain a safe and well-managed environment.</span>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'rules' && (
              <div>
                <span className="section-label" style={{ color: 'var(--color-primary)' }}>Living Together Responsibly</span>
                <h2 className="section-title" style={{ fontSize: '1.75rem', marginBottom: '1.5rem' }}>Hostel Rules & Discipline</h2>
                
                <p style={{ fontSize: '1.1rem', color: 'var(--color-text)', lineHeight: 1.7, marginBottom: '2rem' }}>
                  Hostel regulations are designed to maintain a safe, respectful and comfortable residential environment for all students.
                </p>

                <h3 style={{ fontSize: '1.25rem', color: 'var(--color-primary)', marginBottom: '1rem' }}>Residents are expected to:</h3>
                <ul style={{ paddingLeft: '1.5rem', color: 'var(--color-text)', fontSize: '1.1rem', lineHeight: 1.8, marginBottom: '2.5rem' }}>
                  <li>Follow hostel entry, exit and outing procedures.</li>
                  <li>Maintain cleanliness in rooms and shared spaces.</li>
                  <li>Respect fellow residents, hostel staff and university property.</li>
                  <li>Follow prescribed hostel and dining timings.</li>
                  <li>Use Wi-Fi and other university facilities responsibly.</li>
                  <li>Obtain permission for visitors, outings and room changes where required.</li>
                  <li>Observe university policies related to safety, conduct and prohibited activities.</li>
                  <li>Report maintenance concerns or grievances through the appropriate hostel channels.</li>
                </ul>

                <div>
                  <a href="#" className="btn btn-primary" onClick={(e) => e.preventDefault()}>View Complete Hostel Rules & Regulations</a>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {photos.length > 0 && photos[0].src !== PHOTO_NEEDED_PLACEHOLDER && (
        <section className="section bg-off-white">
          <div className="container">
            <PhotoGrid 
              images={photos} 
              title="Inside Our Campus Hostels" 
              subtitle="Explore the residential spaces and facilities that support everyday student life at Vishnu Women’s University."
              columns={3} 
              layout="default" 
            />
            <div style={{ textAlign: 'center', marginTop: '3rem' }}>
              <a href="#" className="btn btn-outline" onClick={(e) => e.preventDefault()}>View Full Gallery</a>
            </div>
          </div>
        </section>
      )}

      <section style={{ background: 'var(--color-primary)', padding: 'var(--space-14) 0' }}>
        <div className="container" style={{ textAlign: 'center', color: 'var(--color-white)' }}>
          <h2 style={{ color: 'var(--color-white)', marginBottom: 'var(--space-2)' }}>
            Explore More Campus Facilities
          </h2>
          <p style={{ fontSize: '1.1rem', opacity: 0.9, maxWidth: '600px', margin: '0 auto var(--space-6)' }}>
            Discover the learning spaces, services and facilities that support academic and residential life at Vishnu Women’s University.
          </p>
          <div style={{ display: 'flex', gap: 'var(--space-4)', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/campus" className="btn btn-accent">Explore Campus Facilities</Link>
            <Link to="/student-life" className="btn btn-secondary">Discover Student Life</Link>
          </div>
        </div>
      </section>
    </main>
  );
}
