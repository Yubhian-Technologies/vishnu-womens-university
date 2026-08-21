import { useEffect, useState } from 'react';
import { Link, useParams, Navigate } from 'react-router-dom';
import { Mail, ExternalLink } from 'lucide-react';
import PageHero from '../../components/PageHero/PageHero';
import SmoothImage from '../../components/SmoothImage/SmoothImage';
import { useCollection, useOrderedCollection } from '../../hooks/useCollection';
import { linkify } from '../../lib/linkify';
import { getSectionBlocks } from '../../lib/facultySections';
import { getFacultyOverrideSections, isHiddenFacultyRecord } from './facultyContentOverrides.data';
import FacultySectionContent from '../../components/FacultySectionContent/FacultySectionContent';
import type { FacultyDoc } from './Faculty';
import type { ProgramDoc } from '../Admin/sections/ProgramsAdmin';
import '../detail-layout.css';

function getInitials(name: string) {
  const cleaned = name.replace(/\b(Dr|Sri|Prof|Mr|Mrs|Ms)\.?\s*/gi, '');
  const parts = cleaned.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return '';
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

/**
 * One faculty member's full profile — photo, basic details, and an
 * admin-defined set of "sections" (Research Papers Published, Awards, HOD
 * Professional Affiliations, ...) that vary from person to person, since a
 * fixed schema can't cover every department's idea of what belongs on a
 * profile. Reused from both the main Academics → Faculty grid (CSE, ECE, …)
 * and the Freshman Engineering page's own Faculty tab (Mathematics,
 * Physics, Chemistry, English) — both read the same `faculty` collection,
 * this page doesn't care which list linked to it.
 */
export default function FacultyProfile() {
  const { id } = useParams<{ id: string }>();
  const { docs: allFaculty, loading } = useOrderedCollection<FacultyDoc>('faculty', 'order');
  const { docs: programs } = useCollection<ProgramDoc>('programs');
  const [activeSection, setActiveSection] = useState<string | null>(null);

  const person = allFaculty.find((f) => f.id === id);
  const overrideSections = person ? getFacultyOverrideSections(person.name, person.department) : null;
  const sections = (overrideSections ?? person?.sections ?? []).filter((s) => s.title);

  useEffect(() => {
    if (sections.length > 0) setActiveSection((prev) => prev ?? sections[0].title);
  }, [sections.length]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (person) document.title = `${person.name} | Vishnu Womens University`;
  }, [person]);

  if (!loading && !person) return <Navigate to="/faculty" replace />;
  if (!person) return null;
  if (isHiddenFacultyRecord(person.name, person.department)) return <Navigate to="/faculty" replace />;

  const isHod = person.designation.toLowerCase().includes('hod') || person.designation.toLowerCase().includes('head');
  const program = programs.find((p) => p.department === person.department);
  const hodMatches = isHod && program && program.hod?.trim() === person.name.trim();

  const active = sections.find((s) => s.title === activeSection) ?? sections[0];

  return (
    <main className="page-wrapper">
      <PageHero
        page="faculty-profile"
        defaultTitle={person.name}
        defaultSubtitle={person.designation}
        breadcrumb={[{ label: 'Home', to: '/' }, { label: 'Academics', to: '/academics' }, { label: 'Faculty', to: '/faculty' }, { label: person.name }]}
        size="small"
      />

      <section className="section bg-white">
        <div className="container">
          <div style={{ display: 'flex', gap: 'var(--space-8)', flexWrap: 'wrap', marginBottom: 'var(--space-10)' }}>
            {person.imageUrl ? (
              <SmoothImage src={person.imageUrl} alt={person.name} style={{ width: 200, height: 240, objectFit: 'cover', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-light-gray)', flexShrink: 0 }} />
            ) : (
              <div style={{ width: 200, height: 240, borderRadius: 'var(--radius-md)', background: 'var(--color-off-white)', border: '1px solid var(--color-light-gray)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.5rem', fontWeight: 800, color: 'var(--color-primary)', flexShrink: 0 }}>
                {getInitials(person.name)}
              </div>
            )}
            <div style={{ flex: 1, minWidth: 260 }}>
              <h1 style={{ marginBottom: 'var(--space-1)' }}>{person.name}</h1>
              <p style={{ fontSize: 'var(--text-base)', color: 'var(--color-text-light)', marginBottom: 'var(--space-3)' }}>
                {person.designation}{person.department && ` · ${person.department}`}
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-2)', marginBottom: 'var(--space-4)' }}>
                {person.qualification && (
                  <span style={{ fontSize: 'var(--text-xs)', fontWeight: 700, background: 'var(--color-off-white)', border: '1px solid var(--color-light-gray)', borderRadius: 'var(--radius-full)', padding: '0.3rem 0.9rem', color: 'var(--color-text)' }}>
                    {person.qualification}
                  </span>
                )}
                {person.specialization && (
                  <span style={{ fontSize: 'var(--text-xs)', fontWeight: 700, background: 'rgba(201,168,76,0.12)', border: '1px solid rgba(201,168,76,0.4)', borderRadius: 'var(--radius-full)', padding: '0.3rem 0.9rem', color: 'var(--color-accent)' }}>
                    {person.specialization}
                  </span>
                )}
              </div>
              {person.email && (
                <a href={`mailto:${person.email}`} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', fontSize: 'var(--text-sm)', color: 'var(--color-primary)', fontWeight: 700, marginBottom: 'var(--space-3)' }}>
                  <Mail size={15} strokeWidth={1.75} /> {person.email}
                </a>
              )}
              {(person.facts ?? []).length > 0 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-1)', fontSize: 'var(--text-sm)', color: 'var(--color-text)', marginTop: 'var(--space-2)' }}>
                  {person.facts!.map((f) => (
                    <div key={f.label}><strong style={{ color: 'var(--color-primary)' }}>{f.label}:</strong> {linkify(f.value)}</div>
                  ))}
                </div>
              )}

              {hodMatches && program?.hodMessage && (
                <p style={{ fontSize: 'var(--text-base)', color: 'var(--color-text)', lineHeight: 1.7, marginTop: 'var(--space-4)', paddingTop: 'var(--space-4)', borderTop: '1px solid var(--color-light-gray)' }}>
                  {program.hodMessage}
                </p>
              )}
              {hodMatches && program?.hodResearchProfiles && program.hodResearchProfiles.length > 0 && (
                <div style={{ marginTop: 'var(--space-3)', display: 'flex', flexWrap: 'wrap', gap: 'var(--space-3)' }}>
                  {program.hodResearchProfiles.map((link) => (
                    <a key={link.label} href={link.url} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', fontSize: 'var(--text-sm)', color: 'var(--color-primary)', fontWeight: 700 }}>
                      {link.label} <ExternalLink size={13} strokeWidth={2} />
                    </a>
                  ))}
                </div>
              )}
              {hodMatches && program?.slug && (
                <Link to={`/academics/${program.slug}#hod`} className="btn btn-accent" style={{ marginTop: 'var(--space-4)' }}>
                  View Full Department Page →
                </Link>
              )}
            </div>
          </div>

          {sections.length > 0 && (
            <div className="faculty-sections-grid">
              <div className="faculty-sections-nav">
                <div style={{ position: 'sticky', top: '110px' }}>
                  <p style={{ fontSize: 'var(--text-xs)', fontWeight: 700, color: 'var(--color-text-light)', textTransform: 'uppercase', letterSpacing: '0.05em', margin: '0 0 var(--space-2) var(--space-1)' }}>
                    Profile Sections
                  </p>
                  <div style={{ background: 'var(--color-off-white)', border: '1.5px solid var(--color-light-gray)', borderRadius: 'var(--radius-md)', overflow: 'hidden' }}>
                    {sections.map((s) => {
                      const isActive = active?.title === s.title;
                      return (
                        <button
                          key={s.title}
                          onClick={() => setActiveSection(s.title)}
                          style={{
                            display: 'block', width: '100%', textAlign: 'left',
                            padding: 'var(--space-3) var(--space-5)', border: 'none',
                            borderBottom: '1px solid var(--color-light-gray)',
                            background: isActive ? 'var(--color-primary)' : 'transparent',
                            color: isActive ? 'var(--color-white)' : 'var(--color-primary)',
                            fontWeight: isActive ? 700 : 600, fontSize: 'var(--text-sm)', cursor: 'pointer',
                          }}
                        >
                          {s.title}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
              <div>
                {active && <FacultySectionContent blocks={getSectionBlocks(active)} />}
              </div>
            </div>
          )}

          {!person.imageUrl && !person.qualification && !person.specialization && !person.email && (person.facts ?? []).length === 0 && sections.length === 0 && !hodMatches && (
            <p style={{ color: 'var(--color-text-light)' }}>No further details have been added for this faculty member yet.</p>
          )}
        </div>
      </section>
    </main>
  );
}

