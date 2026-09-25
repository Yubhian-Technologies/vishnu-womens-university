import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import SEO from '../../components/SEO/SEO';
import PageHero from '../../components/PageHero/PageHero';
import { usePageBanners } from '../../hooks/usePageBanners';
import { useSitePhotos } from '../../hooks/useSitePhotos';
import PhotoGrid from '../../components/PhotoGrid/PhotoGrid';
import { PHOTO_NEEDED_PLACEHOLDER } from '../../lib/photoPlaceholder';
import '../Campus/tabbed-section.css';

const DEFAULT_HERO_TITLE = 'Central Library at Vishnu Women’s University';
const DEFAULT_HERO_SUBTITLE = 'A well-equipped learning and research hub with print, digital and academic resources for students and faculty.';

export default function CentralLibrary() {
  const { slides: heroSlides } = usePageBanners('campus-central-library');
  const heroSlide = heroSlides[0];
  const heroTitle = heroSlide?.title || DEFAULT_HERO_TITLE;
  const heroSubtitle = heroSlide?.subtitle || DEFAULT_HERO_SUBTITLE;

  const defaultPhotos = Array.from({ length: 5 }, (_, i) => ({
    src: PHOTO_NEEDED_PLACEHOLDER, alt: `Central Library — Photo ${i + 1}`, caption: '',
  }));
  const photos = useSitePhotos('campus', 'central-library', defaultPhotos);

  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    document.title = 'Central Library | Campus Life | VWU';
  }, []);

  return (
    <main className="page-wrapper">
      <SEO
        title="Central Library | Vishnu Women's University"
        description="A well-equipped learning and research hub with print, digital and academic resources for students and faculty."
        canonicalPath="/campus/central-library"
      />

      <PageHero
        page="campus-central-library"
        defaultTitle={heroTitle}
        defaultSubtitle={heroSubtitle}
        hideCta={true}
      />

      <section className="section bg-white">
        <div className="container">
          {/* About Section */}
          <div style={{ marginBottom: '3rem' }}>
            <h2 className="section-title" style={{ fontSize: '1.75rem', marginBottom: '1.5rem' }}>
              Central Library
            </h2>
            <div style={{ fontSize: '1.1rem', color: 'var(--color-text)', lineHeight: 1.7, maxWidth: '900px' }}>
              <p style={{ marginBottom: '1rem' }}>
                The Central Library at Vishnu Women’s University provides a comfortable and well-resourced environment for study, research and collaborative learning. Spread across three air-conditioned floors covering 1,083 sq. m., it offers dedicated spaces for reading, academic work and access to information resources.
              </p>
              <p>
                The library supports students and faculty with an extensive collection of books, journals, e-resources and digital learning materials across Engineering & Technology, Basic Sciences, Management Sciences and related disciplines.
              </p>
            </div>
          </div>

          {/* Library at a Glance - Quick Stat Cards */}
          <div style={{ marginBottom: '4rem' }}>
            <h3 style={{ fontSize: '1.5rem', color: 'var(--color-primary)', marginBottom: '1.5rem' }}>
              Library at a Glance
            </h3>
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
              gap: '1.5rem' 
            }}>
              <div style={{ background: 'var(--color-off-white)', padding: '2rem 1.5rem', borderRadius: '8px', textAlign: 'center' }}>
                <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: 'var(--color-accent)', marginBottom: '0.5rem' }}>3</div>
                <div style={{ color: 'var(--color-text)', fontSize: '1.1rem' }}>Air-conditioned floors</div>
              </div>
              <div style={{ background: 'var(--color-off-white)', padding: '2rem 1.5rem', borderRadius: '8px', textAlign: 'center' }}>
                <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: 'var(--color-accent)', marginBottom: '0.5rem' }}>1,083 <span style={{ fontSize: '1.25rem' }}>sq. m.</span></div>
                <div style={{ color: 'var(--color-text)', fontSize: '1.1rem' }}>Library area</div>
              </div>
              <div style={{ background: 'var(--color-off-white)', padding: '2rem 1.5rem', borderRadius: '8px', textAlign: 'center' }}>
                <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: 'var(--color-accent)', marginBottom: '0.5rem' }}>59,751</div>
                <div style={{ color: 'var(--color-text)', fontSize: '1.1rem' }}>Books</div>
              </div>
              <div style={{ background: 'var(--color-off-white)', padding: '2rem 1.5rem', borderRadius: '8px', textAlign: 'center' }}>
                <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: 'var(--color-accent)', marginBottom: '0.5rem' }}>10,098</div>
                <div style={{ color: 'var(--color-text)', fontSize: '1.1rem' }}>Titles</div>
              </div>
              <div style={{ background: 'var(--color-off-white)', padding: '2rem 1.5rem', borderRadius: '8px', textAlign: 'center' }}>
                <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: 'var(--color-accent)', marginBottom: '0.5rem' }}>5,200</div>
                <div style={{ color: 'var(--color-text)', fontSize: '1.1rem' }}>Journal back volumes</div>
              </div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="section-tabs">
            <button className={`section-tab-btn ${activeTab === 'overview' ? 'active' : ''}`} onClick={() => setActiveTab('overview')}>Library Overview</button>
            <button className={`section-tab-btn ${activeTab === 'collections' ? 'active' : ''}`} onClick={() => setActiveTab('collections')}>Library Collections</button>
            <button className={`section-tab-btn ${activeTab === 'digital' ? 'active' : ''}`} onClick={() => setActiveTab('digital')}>Digital Library</button>
            <button className={`section-tab-btn ${activeTab === 'eresources' ? 'active' : ''}`} onClick={() => setActiveTab('eresources')}>e-Resources & Databases</button>
            <button className={`section-tab-btn ${activeTab === 'journals' ? 'active' : ''}`} onClick={() => setActiveTab('journals')}>Journals and Magazines</button>
          </div>

          <div style={{ padding: '2rem 0' }}>
            {activeTab === 'overview' && (
              <div>
                <h3 style={{ fontSize: '1.5rem', color: 'var(--color-primary)', marginBottom: '1.5rem' }}>Library Services</h3>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                  <li style={{ padding: '1.25rem', background: 'var(--color-off-white)', borderRadius: '8px', borderLeft: '4px solid var(--color-primary)' }}>
                    <strong style={{ display: 'block', fontSize: '1.15rem', marginBottom: '0.25rem', color: 'var(--color-heading)' }}>Reading & Study Spaces</strong>
                    <span style={{ color: 'var(--color-text-light)' }}>Comfortable spaces for focused study, reading and academic work.</span>
                  </li>
                  <li style={{ padding: '1.25rem', background: 'var(--color-off-white)', borderRadius: '8px', borderLeft: '4px solid var(--color-primary)' }}>
                    <strong style={{ display: 'block', fontSize: '1.15rem', marginBottom: '0.25rem', color: 'var(--color-heading)' }}>Research & Reference Support</strong>
                    <span style={{ color: 'var(--color-text-light)' }}>Assistance in locating information, academic resources and reference materials.</span>
                  </li>
                  <li style={{ padding: '1.25rem', background: 'var(--color-off-white)', borderRadius: '8px', borderLeft: '4px solid var(--color-primary)' }}>
                    <strong style={{ display: 'block', fontSize: '1.15rem', marginBottom: '0.25rem', color: 'var(--color-heading)' }}>Print & Digital Resources</strong>
                    <span style={{ color: 'var(--color-text-light)' }}>Access to books, journals, e-books, databases and other learning resources.</span>
                  </li>
                  <li style={{ padding: '1.25rem', background: 'var(--color-off-white)', borderRadius: '8px', borderLeft: '4px solid var(--color-primary)' }}>
                    <strong style={{ display: 'block', fontSize: '1.15rem', marginBottom: '0.25rem', color: 'var(--color-heading)' }}>Digital Learning Access</strong>
                    <span style={{ color: 'var(--color-text-light)' }}>Online platforms and electronic resources that support learning and research.</span>
                  </li>
                  <li style={{ padding: '1.25rem', background: 'var(--color-off-white)', borderRadius: '8px', borderLeft: '4px solid var(--color-primary)' }}>
                    <strong style={{ display: 'block', fontSize: '1.15rem', marginBottom: '0.25rem', color: 'var(--color-heading)' }}>Library Assistance</strong>
                    <span style={{ color: 'var(--color-text-light)' }}>Guidance from library staff in accessing and using available resources effectively.</span>
                  </li>
                </ul>
              </div>
            )}

            {activeTab === 'collections' && (
              <div>
                <h3 style={{ fontSize: '1.5rem', color: 'var(--color-primary)', marginBottom: '1rem' }}>Library Collections</h3>
                <p style={{ fontSize: '1.1rem', color: 'var(--color-text)', lineHeight: 1.7, marginBottom: '1.5rem' }}>
                  The Central Library provides print and digital resources across Engineering & Technology, Basic Sciences, Management Sciences and allied disciplines. Explore the collection by resource type.
                </p>
                <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', fontWeight: 'bold', color: 'var(--color-accent)' }}>
                  <span>Books</span> <span style={{ color: 'var(--color-text-light)' }}>|</span>
                  <span>Periodicals</span> <span style={{ color: 'var(--color-text-light)' }}>|</span>
                  <span>e-Journals</span> <span style={{ color: 'var(--color-text-light)' }}>|</span>
                  <span>Media Resources</span>
                </div>
              </div>
            )}

            {activeTab === 'digital' && (
              <div>
                <h3 style={{ fontSize: '1.5rem', color: 'var(--color-primary)', marginBottom: '1rem' }}>Digital Library</h3>
                <p style={{ fontSize: '1.1rem', color: 'var(--color-text)', lineHeight: 1.7 }}>
                  Access online learning platforms, academic repositories, e-books, lectures and research resources that complement the library's print collection.
                </p>
              </div>
            )}

            {activeTab === 'eresources' && (
              <div>
                <h3 style={{ fontSize: '1.5rem', color: 'var(--color-primary)', marginBottom: '1rem' }}>e-Resources & Databases</h3>
                <p style={{ fontSize: '1.1rem', color: 'var(--color-text)', lineHeight: 1.7 }}>
                  Explore academic databases, e-books, open-access journals, reference resources, video lectures and online course materials available through the Central Library.
                </p>
              </div>
            )}

            {activeTab === 'journals' && (
              <div>
                <h3 style={{ fontSize: '1.5rem', color: 'var(--color-primary)', marginBottom: '1rem' }}>Journals & Magazines</h3>
                <p style={{ fontSize: '1.1rem', color: 'var(--color-text)', lineHeight: 1.7, marginBottom: '1.5rem' }}>
                  Explore the Central Library's collection of print and electronic journals and magazines across academic disciplines. Browse resources by department, title and publication frequency.
                </p>
                <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', fontWeight: 'bold', color: 'var(--color-accent)' }}>
                  <span>Journals</span> <span style={{ color: 'var(--color-text-light)' }}>|</span>
                  <span>Magazines</span>
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
              title="Inside the Central Library" 
              subtitle="Explore the reading spaces, collections and learning environment at Vishnu Women’s University."
              columns={3} 
              layout="default" 
            />
          </div>
        </section>
      )}

      <section style={{ background: 'var(--color-primary)', padding: 'var(--space-14) 0' }}>
        <div className="container" style={{ textAlign: 'center', color: 'var(--color-white)' }}>
          <h2 style={{ color: 'var(--color-white)', marginBottom: 'var(--space-2)' }}>
            Explore More Learning Spaces
          </h2>
          <p style={{ fontSize: '1.1rem', opacity: 0.9, maxWidth: '600px', margin: '0 auto var(--space-6)' }}>
            Discover the academic facilities and learning environments that support student life at Vishnu Women’s University.
          </p>
          <div style={{ display: 'flex', gap: 'var(--space-4)', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/student-life" className="btn btn-secondary">Discover Student Life</Link>
          </div>
        </div>
      </section>
    </main>
  );
}
