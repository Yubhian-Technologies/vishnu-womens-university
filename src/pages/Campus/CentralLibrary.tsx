import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { BookOpen, Globe, Database, Newspaper } from 'lucide-react';
import PageHero from '../../components/PageHero/PageHero';
import { useContentBlocks } from '../../hooks/useContentBlocks';
import { resolveContentIcon } from '../../lib/contentIcons';
import { findCampusFacilityBySlug } from './campusFacilities.data';
import type { ContentBlockDoc } from '../Admin/sections/ContentBlocksAdmin';
import './tabbed-section.css';

// Real counts from the library's own description (campusFacilities.data.ts)
// — shown until an admin adds real entries in Page Content Blocks, same
// fallback pattern used throughout this codebase (e.g. defaultTestimonials
// in Home.tsx).
const defaultResourceList: ContentBlockDoc[] = [
  { id: 'd1', page: 'central-library', section: 'resourceList', value: '59,721', title: 'Books', desc: 'Volumes covering Engineering & Technology, Basic Sciences, and Management Sciences.', icon: 'BookOpen', slug: '', order: 0 },
  { id: 'd2', page: 'central-library', section: 'resourceList', value: '1,380', title: 'Journal Back Volumes', desc: 'Bound back volumes of journals and periodicals preserved for reference.', icon: 'Layers', slug: '', order: 1 },
  { id: 'd3', page: 'central-library', section: 'resourceList', value: '4,000', title: 'CDs', desc: 'Digital and multimedia resources supporting coursework and research.', icon: 'Library', slug: '', order: 2 },
  { id: 'd4', page: 'central-library', section: 'resourceList', value: '250', title: 'Audio Cassettes', desc: 'Archived audio materials held as part of the library collection.', icon: 'Newspaper', slug: '', order: 3 },
];

const libraryResponsibilities = [
  'Responding to the varying needs of the academic community by involving the faculty, the students and the administration in the development and periodic assessment of the library services and resources.',
  'Providing library users with point-of-use instruction, personal assistance in conducting literature research and other reference services.',
  'Providing an environment conducive to the optimum use of library materials and an appropriate schedule of hours of service and professional assistance.',
  'Participating in overall computing resources plan and providing for full library utilization of automation technology, physical facilities and equipment adequate to process, catalogue and store the materials.',
  "Enhancing the library's resources and services through cooperative relationship with other libraries and agencies.",
];

const defaultDigitalLibrary: ContentBlockDoc[] = [
  { id: 'd1', page: 'central-library', section: 'digitalLibrary', value: '', title: 'NDLI — National Digital Library of India', desc: 'A single-window platform for digital learning resources from schools to research, hosted by IIT Kharagpur.', icon: '', slug: 'https://ndl.iitkgp.ac.in', order: 0 },
  { id: 'd2', page: 'central-library', section: 'digitalLibrary', value: '', title: 'NPTEL', desc: 'Video and web courses in engineering, science, and humanities from the IITs and IISc.', icon: '', slug: 'https://nptel.ac.in', order: 1 },
  { id: 'd3', page: 'central-library', section: 'digitalLibrary', value: '', title: 'SWAYAM', desc: "India's national MOOC platform offering free online courses across disciplines.", icon: '', slug: 'https://swayam.gov.in', order: 2 },
  { id: 'd4', page: 'central-library', section: 'digitalLibrary', value: '', title: 'DELNET', desc: 'A resource-sharing network connecting libraries across India for inter-library loan and reference.', icon: '', slug: 'https://delnet.nic.in', order: 3 },
];

const defaultEDatabases: ContentBlockDoc[] = [
  { id: 'd1', page: 'central-library', section: 'eDatabases', value: '', title: 'IEEE Xplore', desc: 'Full-text access to IEEE journals, conference proceedings, and standards in engineering and technology.', icon: '', slug: 'https://ieeexplore.ieee.org', order: 0 },
  { id: 'd2', page: 'central-library', section: 'eDatabases', value: '', title: 'Scopus', desc: "Elsevier's abstract and citation database covering peer-reviewed literature across disciplines.", icon: '', slug: 'https://www.scopus.com', order: 1 },
  { id: 'd3', page: 'central-library', section: 'eDatabases', value: '', title: 'ScienceDirect', desc: 'Full-text scientific and technical research from Elsevier journals and books.', icon: '', slug: 'https://www.sciencedirect.com', order: 2 },
  { id: 'd4', page: 'central-library', section: 'eDatabases', value: '', title: 'SpringerLink', desc: 'Access to Springer journals, books, and reference works across science and engineering.', icon: '', slug: 'https://link.springer.com', order: 3 },
];

const defaultJournals: ContentBlockDoc[] = [
  { id: 'd1', page: 'central-library', section: 'journals', value: '120+', title: 'International Journals', desc: 'Subscribed print and online international journals across all engineering and science departments.', icon: '', slug: '', order: 0 },
  { id: 'd2', page: 'central-library', section: 'journals', value: '60+', title: 'National Journals', desc: 'Journals published by Indian professional bodies and academic institutions.', icon: '', slug: '', order: 1 },
  { id: 'd3', page: 'central-library', section: 'journals', value: '9,000+', title: 'e-Journals (Consortium Access)', desc: 'Journal titles accessible through INFLIBNET N-LIST and other consortium subscriptions.', icon: '', slug: '', order: 2 },
];

type TabId = 'about' | 'resources' | 'digital' | 'databases' | 'journals';

const TABS: { id: TabId; label: string }[] = [
  { id: 'about', label: 'About Library' },
  { id: 'resources', label: 'Library Resource List' },
  { id: 'digital', label: 'Digital Library' },
  { id: 'databases', label: 'e-Databases' },
  { id: 'journals', label: 'Journals' },
];

const hashToTab: Record<string, TabId> = {
  '#about': 'about',
  '#resources': 'resources',
  '#digital': 'digital',
  '#databases': 'databases',
  '#journals': 'journals',
};

export default function CentralLibrary() {
  const facility = findCampusFacilityBySlug('central-library');
  const [activeTab, setActiveTab] = useState<TabId>('about');
  const location = useLocation();

  const liveResourceList = useContentBlocks('central-library', 'resourceList');
  const resourceList = liveResourceList.length > 0 ? liveResourceList : defaultResourceList;
  const liveDigitalLibrary = useContentBlocks('central-library', 'digitalLibrary');
  const digitalLibrary = liveDigitalLibrary.length > 0 ? liveDigitalLibrary : defaultDigitalLibrary;
  const liveEDatabases = useContentBlocks('central-library', 'eDatabases');
  const eDatabases = liveEDatabases.length > 0 ? liveEDatabases : defaultEDatabases;
  const liveJournals = useContentBlocks('central-library', 'journals');
  const journals = liveJournals.length > 0 ? liveJournals : defaultJournals;

  useEffect(() => {
    document.title = 'Central Library | Campus Life | VWU';
  }, []);

  useEffect(() => {
    const tab = hashToTab[location.hash];
    if (tab) setActiveTab(tab);
  }, [location.hash]);

  if (!facility) return null;

  return (
    <main className="page-wrapper">
      <PageHero
        page="campus-central-library"
        defaultImage="https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=1920&q=80"
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

          {/* About Library */}
          {activeTab === 'about' && (
            <div>
              <span className="section-label">Campus Life</span>
              <h2 className="section-title" style={{ fontSize: '1.75rem' }}>About {facility.title}</h2>
              <p style={{ fontSize: 'var(--text-lg)', color: 'var(--color-text)', lineHeight: 1.75, maxWidth: 760, marginBottom: 'var(--space-5)' }}>
                The Library of Shri Vishnu Engineering College for Women (Autonomous) was built to keep up international standards. The air-conditioned library has three floors with an area of 1,083 Sq.m. and is well-protected with a security system. Specialised collections of books, journals, and non-book materials are available in Engineering & Technology, Basic Sciences, and Management Sciences.
              </p>
              <p style={{ fontSize: 'var(--text-base)', color: 'var(--color-text)', lineHeight: 1.75, maxWidth: 760, marginBottom: 'var(--space-6)' }}>
                The Library contributes to the fulfilment of the Institution's mission by selecting, acquiring, organising, maintaining, and making accessible a collection of printed and non-printed, primary and secondary materials that support the educational, research, and public service programmes of both students and faculty:
              </p>
              <ul style={{ maxWidth: 760, marginBottom: 'var(--space-8)', paddingLeft: '1.25rem', display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                {libraryResponsibilities.map((r) => (
                  <li key={r} style={{ color: 'var(--color-text-light)', lineHeight: 1.7 }}>{r}</li>
                ))}
              </ul>
              <div style={{ background: 'var(--color-off-white)', borderRadius: 'var(--radius-md)', padding: 'var(--space-6)', maxWidth: 500 }}>
                <h3 style={{ fontFamily: 'var(--font-sans)', fontWeight: 900, color: 'var(--color-primary)', marginBottom: 'var(--space-4)', textTransform: 'uppercase', letterSpacing: '0.04em', fontSize: 'var(--text-sm)' }}>Library Timings</h3>
                <p style={{ fontWeight: 700, color: 'var(--color-primary)', marginBottom: 'var(--space-2)' }}>Monday – Saturday</p>
                <ul style={{ paddingLeft: '1.1rem', marginBottom: 'var(--space-4)', color: 'var(--color-text-light)', fontSize: 'var(--text-sm)', display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                  <li>Working Hours — 8:00 A.M. to 12:00 Midnight</li>
                  <li>Transactions — 8:00 A.M. to 6:00 P.M.</li>
                  <li>Digital Library — 8:00 A.M. to 12:00 Midnight</li>
                </ul>
                <p style={{ fontWeight: 700, color: 'var(--color-primary)', marginBottom: 'var(--space-2)' }}>Sunday & Other Holidays</p>
                <ul style={{ paddingLeft: '1.1rem', color: 'var(--color-text-light)', fontSize: 'var(--text-sm)' }}>
                  <li>Working Hours — 10:00 A.M. to 10:00 P.M.</li>
                </ul>
              </div>
            </div>
          )}

          {/* Library Resource List */}
          {activeTab === 'resources' && (
            <div>
              <h2 className="section-title" style={{ marginBottom: 'var(--space-4)' }}>Library Resource List</h2>
              <p style={{ color: 'var(--color-text-light)', marginBottom: 'var(--space-8)', maxWidth: 680 }}>
                A snapshot of the collection available at the Central Library, across formats and subjects.
              </p>
              <div className="mobile-stack-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 'var(--space-5)' }}>
                {resourceList.map((r) => {
                  const Icon = resolveContentIcon(r.icon) || BookOpen;
                  return (
                    <div key={r.id} style={{ background: 'var(--color-white)', border: '1.5px solid var(--color-light-gray)', borderRadius: 'var(--radius-md)', padding: 'var(--space-6)', display: 'flex', gap: 'var(--space-4)', alignItems: 'flex-start' }}>
                      <Icon size={32} strokeWidth={1.75} color="var(--color-accent)" style={{ flexShrink: 0 }} />
                      <div>
                        <h3 style={{ fontFamily: 'var(--font-sans)', fontWeight: 900, color: 'var(--color-primary)', marginBottom: 'var(--space-1)' }}>
                          {r.title}{r.value && <span style={{ color: 'var(--color-accent)' }}> — {r.value}</span>}
                        </h3>
                        <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-light)', lineHeight: 1.6 }}>{r.desc}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Digital Library */}
          {activeTab === 'digital' && (
            <div>
              <h2 className="section-title" style={{ marginBottom: 'var(--space-4)' }}>Digital Library</h2>
              <p style={{ color: 'var(--color-text-light)', marginBottom: 'var(--space-8)', maxWidth: 680 }}>
                Free, open digital learning platforms available to every VWU student and faculty member.
              </p>
              <div className="mobile-stack-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 'var(--space-5)' }}>
                {digitalLibrary.map((p) => (
                  <div key={p.id} style={{ background: 'var(--color-white)', border: '1.5px solid var(--color-light-gray)', borderRadius: 'var(--radius-md)', padding: 'var(--space-6)', display: 'flex', gap: 'var(--space-4)', alignItems: 'flex-start' }}>
                    <Globe size={32} strokeWidth={1.75} color="var(--color-accent)" style={{ flexShrink: 0 }} />
                    <div>
                      <h3 style={{ fontFamily: 'var(--font-sans)', fontWeight: 900, color: 'var(--color-primary)', marginBottom: 'var(--space-2)' }}>{p.title}</h3>
                      <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-light)', lineHeight: 1.6, marginBottom: 'var(--space-3)' }}>{p.desc}</p>
                      <a href={p.slug || '#'} target="_blank" rel="noopener noreferrer" className="btn btn-outline" style={{ fontSize: 'var(--text-xs)', padding: '0.35rem 0.9rem' }}>Visit Platform</a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* e-Databases */}
          {activeTab === 'databases' && (
            <div>
              <h2 className="section-title" style={{ marginBottom: 'var(--space-4)' }}>e-Databases</h2>
              <p style={{ color: 'var(--color-text-light)', marginBottom: 'var(--space-8)', maxWidth: 680 }}>
                Subscribed research databases available on-campus for faculty and student research.
              </p>
              <div className="mobile-stack-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 'var(--space-5)' }}>
                {eDatabases.map((p) => (
                  <div key={p.id} style={{ background: 'var(--color-white)', border: '1.5px solid var(--color-light-gray)', borderRadius: 'var(--radius-md)', padding: 'var(--space-6)', display: 'flex', gap: 'var(--space-4)', alignItems: 'flex-start' }}>
                    <Database size={32} strokeWidth={1.75} color="var(--color-accent)" style={{ flexShrink: 0 }} />
                    <div>
                      <h3 style={{ fontFamily: 'var(--font-sans)', fontWeight: 900, color: 'var(--color-primary)', marginBottom: 'var(--space-2)' }}>{p.title}</h3>
                      <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-light)', lineHeight: 1.6, marginBottom: 'var(--space-3)' }}>{p.desc}</p>
                      <a href={p.slug || '#'} target="_blank" rel="noopener noreferrer" className="btn btn-outline" style={{ fontSize: 'var(--text-xs)', padding: '0.35rem 0.9rem' }}>Access Database</a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Journals */}
          {activeTab === 'journals' && (
            <div>
              <h2 className="section-title" style={{ marginBottom: 'var(--space-4)' }}>Journals</h2>
              <p style={{ color: 'var(--color-text-light)', marginBottom: 'var(--space-8)', maxWidth: 680 }}>
                Print and electronic journal subscriptions held by the Central Library.
              </p>
              <div className="mobile-stack-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 'var(--space-5)' }}>
                {journals.map((j) => (
                  <div key={j.id} style={{ background: 'var(--color-white)', border: '1.5px solid var(--color-light-gray)', borderRadius: 'var(--radius-md)', padding: 'var(--space-6)', display: 'flex', gap: 'var(--space-4)', alignItems: 'flex-start' }}>
                    <Newspaper size={32} strokeWidth={1.75} color="var(--color-accent)" style={{ flexShrink: 0 }} />
                    <div>
                      <h3 style={{ fontFamily: 'var(--font-sans)', fontWeight: 900, color: 'var(--color-primary)', marginBottom: 'var(--space-1)' }}>
                        {j.title}{j.value && <span style={{ color: 'var(--color-accent)' }}> — {j.value}</span>}
                      </h3>
                      <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-light)', lineHeight: 1.6 }}>{j.desc}</p>
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
