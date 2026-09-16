import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import SEO from '../../components/SEO/SEO';
import PageHero from '../../components/PageHero/PageHero';
import { usePageBanners } from '../../hooks/usePageBanners';
import { useSitePhotos } from '../../hooks/useSitePhotos';
import PhotoGrid from '../../components/PhotoGrid/PhotoGrid';
import { PHOTO_NEEDED_PLACEHOLDER } from '../../lib/photoPlaceholder';
import '../detail-layout.css';

const DEFAULT_HERO_TITLE = 'Engineering Laboratories at Vishnu Women’s University';
const DEFAULT_HERO_SUBTITLE = 'Hands-on learning spaces equipped to support practical training, experimentation and project-based learning.';

export default function StateOfTheArtLabs() {
  const { slides: heroSlides } = usePageBanners('campus-state-of-the-art-labs');

  const heroSlide = heroSlides[0];
  const heroTitle = heroSlide?.title || DEFAULT_HERO_TITLE;
  const heroSubtitle = heroSlide?.subtitle || DEFAULT_HERO_SUBTITLE;

  const defaultPhotos = Array.from({ length: 5 }, (_, i) => ({
    src: PHOTO_NEEDED_PLACEHOLDER, alt: `Engineering Laboratories — Photo ${i + 1}`, caption: '',
  }));
  const photos = useSitePhotos('campus', 'state-of-the-art-labs', defaultPhotos);

  useEffect(() => {
    document.title = 'Engineering Laboratories | Campus Life | VWU';
  }, []);

  return (
    <main className="page-wrapper">
      <SEO
        title="Engineering Laboratories | Vishnu Women's University"
        description="Hands-on learning spaces equipped to support practical training, experimentation and project-based learning."
        canonicalPath="/campus/state-of-the-art-labs"
      />

      <PageHero
        page="campus-state-of-the-art-labs"
        defaultTitle={heroTitle}
        defaultSubtitle={heroSubtitle}
        hideCta={true}
      />

      <section className="section bg-white">
        <div className="container">
          <div style={{ marginBottom: '4rem' }}>
            <h2 className="section-title" style={{ fontSize: '1.75rem', marginBottom: '1.5rem' }}>
              Practical Learning Beyond the Classroom
            </h2>
            <div style={{ fontSize: '1.1rem', color: 'var(--color-text)', lineHeight: 1.7, maxWidth: '900px' }}>
              <p style={{ marginBottom: '1.5rem' }}>
                Vishnu Women’s University provides specialised laboratories that support the practical requirements of its academic programmes. Students gain hands-on experience using contemporary tools, technologies and equipment relevant to their areas of study.
              </p>
              <p>
                These laboratories support experiments, practical sessions, projects and applied learning, helping students strengthen technical skills, problem-solving abilities and their understanding of concepts learned in the classroom.
              </p>
            </div>
          </div>

          <div style={{ marginBottom: '4rem' }}>
            <h3 style={{ fontSize: '1.5rem', color: 'var(--color-primary)', marginBottom: '2rem' }}>
              Learning Through Practice
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(280px, 100%), 1fr))', gap: '1.5rem' }}>
              <div style={{ padding: '1.5rem', background: 'var(--color-off-white)', borderRadius: '8px', borderLeft: '4px solid var(--color-primary)' }}>
                <strong style={{ display: 'block', fontSize: '1.25rem', marginBottom: '0.5rem', color: 'var(--color-heading)' }}>Specialised Laboratories</strong>
                <span style={{ color: 'var(--color-text-light)', lineHeight: 1.6, display: 'block' }}>Department-specific facilities designed to support practical and technical learning.</span>
              </div>
              <div style={{ padding: '1.5rem', background: 'var(--color-off-white)', borderRadius: '8px', borderLeft: '4px solid var(--color-primary)' }}>
                <strong style={{ display: 'block', fontSize: '1.25rem', marginBottom: '0.5rem', color: 'var(--color-heading)' }}>Modern Tools & Equipment</strong>
                <span style={{ color: 'var(--color-text-light)', lineHeight: 1.6, display: 'block' }}>Access to contemporary equipment and technologies used for laboratory work and experimentation.</span>
              </div>
              <div style={{ padding: '1.5rem', background: 'var(--color-off-white)', borderRadius: '8px', borderLeft: '4px solid var(--color-primary)' }}>
                <strong style={{ display: 'block', fontSize: '1.25rem', marginBottom: '0.5rem', color: 'var(--color-heading)' }}>Project-Based Learning</strong>
                <span style={{ color: 'var(--color-text-light)', lineHeight: 1.6, display: 'block' }}>Spaces that enable students to apply concepts through projects, experiments and practical activities.</span>
              </div>
              <div style={{ padding: '1.5rem', background: 'var(--color-off-white)', borderRadius: '8px', borderLeft: '4px solid var(--color-primary)' }}>
                <strong style={{ display: 'block', fontSize: '1.25rem', marginBottom: '0.5rem', color: 'var(--color-heading)' }}>Skill Development</strong>
                <span style={{ color: 'var(--color-text-light)', lineHeight: 1.6, display: 'block' }}>Hands-on learning that strengthens technical competence, analytical thinking and problem-solving skills.</span>
              </div>
            </div>
          </div>

          <div style={{ 
            background: 'var(--color-off-white)', 
            padding: '3rem', 
            borderRadius: '12px',
            textAlign: 'center',
            maxWidth: '900px',
            margin: '0 auto'
          }}>
            <h3 style={{ fontSize: '1.5rem', color: 'var(--color-primary)', marginBottom: '1rem' }}>
              Beyond the Curriculum
            </h3>
            <p style={{ fontSize: '1.15rem', color: 'var(--color-text)', lineHeight: 1.7, fontStyle: 'italic' }}>
              Students are encouraged to use laboratory facilities not only for prescribed practical work but also for projects, experimentation and additional technical activities. This provides opportunities to explore ideas, test concepts and gain greater confidence in applying academic knowledge.
            </p>
          </div>
        </div>
      </section>

      {photos.length > 0 && photos[0].src !== PHOTO_NEEDED_PLACEHOLDER && (
        <section className="section bg-off-white">
          <div className="container">
            <PhotoGrid 
              images={photos} 
              title="Inside Our Laboratories" 
              subtitle="Explore the laboratory spaces where students experiment, build, test and apply what they learn."
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
            Discover the academic spaces and facilities that support practical learning and student development at Vishnu Women’s University.
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
