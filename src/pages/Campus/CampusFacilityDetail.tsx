import { useEffect } from 'react';
import { Link, useParams, Navigate } from 'react-router-dom';
import PageHero from '../../components/PageHero/PageHero';
import PhotoGrid from '../../components/PhotoGrid/PhotoGrid';
import CampusFacilitiesNav from './CampusFacilitiesNav';
import { useSitePhotos } from '../../hooks/useSitePhotos';
import { PHOTO_NEEDED_PLACEHOLDER } from '../../lib/photoPlaceholder';
import { findCampusFacilityBySlug } from './campusFacilities.data';
import '../detail-layout.css';

type DetailBlock =
  | { type: 'heading'; text: string; level: 1 | 2 | 3 | 4 }
  | { type: 'paragraph'; text: string }
  | { type: 'list'; items: string[] };

function formatInlineText(text: string) {
  return text.split(/(\*\*[^*]+\*\*)/g).map((part, index) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={index}>{part.slice(2, -2)}</strong>;
    }
    return <span key={index}>{part}</span>;
  });
}

function parseDetailContent(text: string): DetailBlock[] {
  const blocks: DetailBlock[] = [];
  let paragraphLines: string[] = [];
  let listItems: string[] = [];

  const flushParagraph = () => {
    if (paragraphLines.length > 0) {
      blocks.push({ type: 'paragraph', text: paragraphLines.join(' ') });
      paragraphLines = [];
    }
  };

  const flushList = () => {
    if (listItems.length > 0) {
      blocks.push({ type: 'list', items: listItems });
      listItems = [];
    }
  };

  for (const rawLine of (text || '').split('\n')) {
    const line = rawLine.trim();
    if (!line) {
      flushParagraph();
      flushList();
      continue;
    }
    if (line.startsWith('#### ')) {
      flushParagraph();
      flushList();
      blocks.push({ type: 'heading', level: 4, text: line.slice(5).trim() });
      continue;
    }
    if (line.startsWith('### ')) {
      flushParagraph();
      flushList();
      blocks.push({ type: 'heading', level: 3, text: line.slice(4).trim() });
      continue;
    }
    if (line.startsWith('## ')) {
      flushParagraph();
      flushList();
      blocks.push({ type: 'heading', level: 2, text: line.slice(3).trim() });
      continue;
    }
    if (line.startsWith('# ')) {
      flushParagraph();
      flushList();
      blocks.push({ type: 'heading', level: 1, text: line.slice(2).trim() });
      continue;
    }
    if (line.startsWith('- ')) {
      flushParagraph();
      listItems.push(line.slice(2).trim());
      continue;
    }
    flushList();
    paragraphLines.push(line);
  }

  flushParagraph();
  flushList();
  return blocks;
}

export default function CampusFacilityDetail() {
  const { slug } = useParams<{ slug: string }>();
  const facility = slug ? findCampusFacilityBySlug(slug) : undefined;
  const facilityContentBlocks = parseDetailContent(facility?.body ?? facility?.desc ?? '');

  const defaultPhotos = facility
    ? Array.from({ length: 5 }, (_, i) => ({
        src: PHOTO_NEEDED_PLACEHOLDER,
        alt: `${facility.title} — Photo ${i + 1}`,
        caption: '',
      }))
    : [];
  // Safe even when `facility` is undefined below (Navigate redirects before
  // this value is ever read) — hooks must still run unconditionally.
  const photos = useSitePhotos('campus', slug ?? '', defaultPhotos);

  useEffect(() => {
    if (facility) document.title = `${facility.title} | Campus Life | VWU`;
  }, [facility]);

  if (!facility) return <Navigate to="/campus" replace />;

  return (
    <main className="page-wrapper">
      <PageHero
        page={`campus-${facility.slug}`}
        defaultImage="https://images.unsplash.com/photo-1607237138185-eedd9c632b0b?w=1920&q=60&auto=format"
        defaultTitle={facility.title}
        defaultSubtitle={facility.heroSubtitle ?? facility.desc}
        breadcrumb={[
          { label: 'Home', to: '/' },
          { label: 'Campus Life', to: '/campus' },
          { label: facility.title },
        ]}
      />

      <section className="section bg-white">
        <div className="container">
          <div className="detail-grid">
            <div>
              <span className="section-label">Campus Life</span>
              <h2 className="section-title" style={{ fontSize: '1.75rem' }}>About {facility.title}</h2>
              <div style={{ fontSize: 'var(--text-lg)', color: 'var(--color-text)', lineHeight: 1.75, maxWidth: 760 }}>
                {facilityContentBlocks.map((block, index) => {
                  if (block.type === 'heading') {
                    const HeadingTag = `h${block.level}` as const;
                    const headingStyle =
                      block.level === 1
                        ? { fontSize: '2rem', margin: index === 0 ? '0 0 1rem' : '1.5rem 0 1rem' }
                        : block.level === 2
                          ? { fontSize: '1.6rem', margin: '1.5rem 0 1rem' }
                          : block.level === 3
                            ? { fontSize: '1.2rem', margin: '1.25rem 0 0.75rem' }
                            : { fontSize: '1rem', margin: '1rem 0 0.75rem' };
                    return (
                      <HeadingTag key={index} style={{ fontFamily: 'var(--font-sans)', fontWeight: 800, color: 'var(--color-primary)', ...headingStyle }}>
                        {block.text}
                      </HeadingTag>
                    );
                  }
                  if (block.type === 'list') {
                    return (
                      <ul key={index} style={{ paddingLeft: '1.25rem', margin: '0 0 1rem' }}>
                        {block.items.map((item, itemIndex) => (
                          <li key={itemIndex} style={{ marginBottom: '0.6rem' }}>
                            {formatInlineText(item)}
                          </li>
                        ))}
                      </ul>
                    );
                  }
                  return (
                    <p key={index} style={{ margin: '0 0 1rem' }}>
                      {formatInlineText(block.text)}
                    </p>
                  );
                })}
              </div>
            </div>

            <div className="detail-sidebar">
              <div style={{ position: 'sticky', top: 'calc(var(--topbar-height) + var(--header-height) + 1.5rem)' }}>
                <CampusFacilitiesNav activeSlug={facility.slug} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {photos.length > 0 && (
        <section className="section bg-off-white">
          <div className="container">
            <PhotoGrid
              images={photos}
              label={facility.title}
              title={`${facility.title} in Pictures`}
              columns={3}
              layout="default"
            />
          </div>
        </section>
      )}

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
