import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import SEO from '../../components/SEO/SEO';
import { usePageBanners } from '../../hooks/usePageBanners';
import { useSitePhotos } from '../../hooks/useSitePhotos';
import PhotoGrid from '../../components/PhotoGrid/PhotoGrid';
import { PHOTO_NEEDED_PLACEHOLDER } from '../../lib/photoPlaceholder';
import '../detail-layout.css';

const DEFAULT_HERO_TITLE = 'Smart Classrooms at Vishnu Women’s University';
const DEFAULT_HERO_SUBTITLE = 'Technology-enabled learning spaces designed for interaction, collaboration and active participation.';

import PageHero from '../../components/PageHero/PageHero';

export default function SmartClassrooms() {
  const { slides: heroSlides } = usePageBanners('campus-smart-classrooms');

  const heroSlide = heroSlides[0];
  const heroTitle = heroSlide?.title || DEFAULT_HERO_TITLE;
  const heroSubtitle = heroSlide?.subtitle || DEFAULT_HERO_SUBTITLE;

  const defaultPhotos = Array.from({ length: 5 }, (_, i) => ({
    src: PHOTO_NEEDED_PLACEHOLDER, alt: `Smart Classrooms — Photo ${i + 1}`, caption: '',
  }));
  const photos = useSitePhotos('campus', 'smart-classrooms', defaultPhotos);

  useEffect(() => {
    document.title = 'Smart Classrooms | Campus Life | VWU';
  }, []);

  return (
    <main className="page-wrapper">
      <SEO
        title="Smart Classrooms | Vishnu Women's University"
        description="Technology-enabled learning spaces designed for interaction, collaboration and active participation."
        canonicalPath="/campus/smart-classrooms"
      />

      <PageHero
        page="campus-smart-classrooms"
        defaultTitle={heroTitle}
        defaultSubtitle={heroSubtitle}
        hideCta={true}
      />

      <section className="section bg-white">
        <div className="container">
          <h2 className="section-title" style={{ fontSize: '1.75rem', marginBottom: '1.5rem' }}>
            Designed for Active and Collaborative Learning
          </h2>
          <div style={{ maxWidth: '800px', lineHeight: 1.7, fontSize: '1.1rem', color: 'var(--color-text)' }}>
            <p style={{ marginBottom: '1.5rem' }}>
              Vishnu Women’s University’s smart classrooms combine digital teaching tools, multimedia systems, high-speed internet and audio-visual facilities to support interactive and collaborative learning. These well-equipped spaces encourage active participation, presentations, discussions and project-based learning.
            </p>
          </div>

          <h3 style={{ fontSize: '1.5rem', color: 'var(--color-primary)', marginTop: '2.5rem', marginBottom: '1.5rem' }}>
            Smart Learning Facilities
          </h3>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <li style={{ padding: '1.25rem', background: 'var(--color-off-white)', borderRadius: '8px', borderLeft: '4px solid var(--color-primary)' }}>
              <strong style={{ display: 'block', fontSize: '1.15rem', marginBottom: '0.25rem', color: 'var(--color-heading)' }}>Interactive Teaching Tools</strong>
              <span style={{ color: 'var(--color-text-light)' }}>Digital resources support demonstrations, classroom interaction and engaging academic sessions.</span>
            </li>
            <li style={{ padding: '1.25rem', background: 'var(--color-off-white)', borderRadius: '8px', borderLeft: '4px solid var(--color-primary)' }}>
              <strong style={{ display: 'block', fontSize: '1.15rem', marginBottom: '0.25rem', color: 'var(--color-heading)' }}>Multimedia & Audio-Visual Support</strong>
              <span style={{ color: 'var(--color-text-light)' }}>Presentation and multimedia facilities enable faculty and students to communicate ideas clearly and effectively.</span>
            </li>
            <li style={{ padding: '1.25rem', background: 'var(--color-off-white)', borderRadius: '8px', borderLeft: '4px solid var(--color-primary)' }}>
              <strong style={{ display: 'block', fontSize: '1.15rem', marginBottom: '0.25rem', color: 'var(--color-heading)' }}>High-Speed Connectivity</strong>
              <span style={{ color: 'var(--color-text-light)' }}>Internet-enabled classrooms provide convenient access to digital learning resources during academic activities.</span>
            </li>
            <li style={{ padding: '1.25rem', background: 'var(--color-off-white)', borderRadius: '8px', borderLeft: '4px solid var(--color-primary)' }}>
              <strong style={{ display: 'block', fontSize: '1.15rem', marginBottom: '0.25rem', color: 'var(--color-heading)' }}>Comfortable Learning Spaces</strong>
              <span style={{ color: 'var(--color-text-light)' }}>Spacious, air-conditioned classrooms create an environment suited to focused learning, discussion and collaboration.</span>
            </li>
          </ul>
        </div>
      </section>

      {photos.length > 0 && photos[0].src !== PHOTO_NEEDED_PLACEHOLDER && (
        <section className="section bg-off-white">
          <div className="container">
            <PhotoGrid 
              images={photos} 
              title="Inside Our Smart Classrooms" 
              subtitle="Explore the technology-enabled classrooms where students learn, collaborate, present ideas and participate in academic activities."
              columns={3} 
              layout="default" 
            />
          </div>
        </section>
      )}

      <section style={{ background: 'var(--color-primary)', padding: 'var(--space-14) 0' }}>
        <div className="container" style={{ textAlign: 'center', color: 'var(--color-white)' }}>
          <h2 style={{ color: 'var(--color-white)', marginBottom: 'var(--space-2)' }}>
            Explore More at Vishnu Women’s University
          </h2>
          <p style={{ fontSize: '1.1rem', opacity: 0.9, maxWidth: '600px', margin: '0 auto var(--space-6)' }}>
            Discover the facilities, academic spaces and student experiences that support learning beyond the classroom.
          </p>
          <div style={{ display: 'flex', gap: 'var(--space-4)', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/student-life" className="btn btn-secondary">Discover Student Life</Link>
          </div>
        </div>
      </section>
    </main>
  );
}
