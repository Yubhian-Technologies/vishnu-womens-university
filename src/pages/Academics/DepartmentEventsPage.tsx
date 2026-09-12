import { useEffect } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import SEO from '../../components/SEO/SEO';
import { useOrderedCollection } from '../../hooks/useCollection';
import type { DepartmentDoc } from '../Admin/sections/DepartmentsAdmin';
import { DEPARTMENT_GROUPS, STANDALONE_DEPARTMENTS } from '../../lib/departmentGroups';
import { hasCustomSectionContent, type CustomSection } from '../../lib/customSections';
import type { NewsEventsCategory } from '../../components/NewsEventsTabs/NewsEventsTabs';
import { ArrowLeft } from 'lucide-react';
import '../detail-layout.css';

export default function DepartmentEventsPage() {
  const { slug, categorySlug } = useParams<{ slug: string; categorySlug: string }>();

  // Determine which department (grouped or standalone) we are dealing with.
  const group = Object.values(DEPARTMENT_GROUPS).find((g) => g.key === slug) || Object.values(STANDALONE_DEPARTMENTS).find((g) => g.key === slug);

  const { docs: allDepartments, loading } = useOrderedCollection<DepartmentDoc>('departments', 'order');
  const dept = allDepartments.find((d: DepartmentDoc) => group && d.shortCode?.trim().toLowerCase() === group.deptShortCode.trim().toLowerCase());

  useEffect(() => {
    if (dept) {
      document.title = `Events | ${dept.title} | Vishnu Women's University`;
    }
  }, [dept]);

  if (loading) return null;
  if (!group || !dept) return <Navigate to="/academics" replace />;

  const deptName = dept.title;

  // Extract events categories the exact same way as DepartmentDetail
  const newsEventsSubSections = (dept?.newsEventsSections || []).filter(hasCustomSectionContent);
  const newsEventsCategories: NewsEventsCategory[] = [];

  if (newsEventsSubSections.length > 0) {
    newsEventsCategories.push(...newsEventsSubSections.map((sec: CustomSection) => ({
      key: sec.id,
      label: sec.label,
      years: (() => {
        const ownOnly = { ...sec, subSections: undefined };
        const out = [];
        if (hasCustomSectionContent(ownOnly)) {
          out.push({ year: sec.label.replace(/^Academic Year\s*(::|:|-)?\s*/i, '').trim() || sec.label, columns: [], rows: [], section: ownOnly });
        }
        (sec.subSections || []).filter(hasCustomSectionContent).forEach((sub: CustomSection) => {
          out.push({ year: sub.label.replace(/^Academic Year\s*(::|:|-)?\s*/i, '').trim() || sub.label, columns: [], rows: [], section: sub });
        });
        return out;
      })(),
    })).filter((c: any) => c.years.length > 0));
  }

  const category = newsEventsCategories.find(c => c.key === categorySlug);
  
  if (!category) {
    return <Navigate to={`/academics/departments/${slug}`} replace />;
  }

  // Flatten all cards from all years in this category
  const allCards = category.years.flatMap(y => 
    y.section && y.section.contentType === 'imageCards' && y.section.imageCards 
      ? y.section.imageCards.filter((c) => c.imageUrl || c.title.trim() || c.description.trim()) 
      : []
  );

  return (
    <main className="page-wrapper bg-off-white">
      <SEO
        title={`Events | ${deptName} | Vishnu Women's University`}
        description={`All events and happenings for the ${deptName} at Vishnu Women's University.`}
      />
      
      <div className="container" style={{ padding: 'var(--space-8) 0' }}>
        <Link 
          to={`/academics/departments/${slug}`} 
          style={{ display: 'inline-flex', alignItems: 'center', gap: 'var(--space-2)', color: 'var(--color-text-light)', fontWeight: 600, textDecoration: 'none', marginBottom: 'var(--space-6)', transition: 'color 0.2s' }}
          className="hover-color-primary"
        >
          <ArrowLeft size={16} strokeWidth={2.5} />
          Back to {deptName}
        </Link>
        
        <h1 className="page-title" style={{ color: 'var(--color-primary-dark)', marginBottom: 'var(--space-2)', fontSize: '2.5rem' }}>
          {category.label}
        </h1>
        <p style={{ color: 'var(--color-text-light)', fontSize: 'var(--text-lg)', marginBottom: 'var(--space-8)' }}>
          {deptName}
        </p>

        {allCards.length === 0 ? (
          <p style={{ color: 'var(--color-text-light)' }}>No events found.</p>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 'var(--space-6)' }}>
            {allCards.map((card, ci) => (
              <div key={ci} style={{ border: '1px solid var(--color-light-gray)', borderRadius: 'var(--radius-lg)', overflow: 'hidden', background: 'var(--color-white)', display: 'flex', flexDirection: 'column', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}>
                {card.imageUrl ? (
                  <img src={card.imageUrl} alt={card.title} style={{ width: '100%', aspectRatio: '16 / 10', objectFit: 'cover', display: 'block' }} />
                ) : (
                  <div style={{ width: '100%', aspectRatio: '16 / 10', background: 'var(--color-light-gray)' }} />
                )}
                <div style={{ padding: 'var(--space-5)', flex: 1, display: 'flex', flexDirection: 'column' }}>
                  {card.title && (
                    <h3 style={{ fontFamily: 'var(--font-sans)', fontSize: '1.25rem', fontWeight: 800, color: 'var(--color-primary-dark)', margin: '0 0 var(--space-2)', lineHeight: 1.3 }}>
                      {card.title}
                    </h3>
                  )}
                  {card.description && (
                    <p style={{ color: 'var(--color-text)', lineHeight: 1.6, margin: 0, whiteSpace: 'pre-line', fontSize: '0.95rem' }}>
                      {card.description}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
