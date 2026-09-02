import { useState, useMemo, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useOrderedCollection } from '../../hooks/useCollection';
import type { SchoolDoc } from '../../pages/Admin/sections/SchoolsAdmin';
import type { DepartmentDoc } from '../../pages/Admin/sections/DepartmentsAdmin';
import type { ProgramDoc } from '../../pages/Admin/sections/ProgramsAdmin';
import { findDeptProgramSlug } from '../../pages/Academics/Academics';
import './ProgramsShowcase.css';

interface SchoolCardData {
  id: string;
  title: string;
  link: string;
  iconType: 'code' | 'cpu' | 'briefcase' | 'flask' | 'pill';
}

const defaultSchoolsData: SchoolCardData[] = [
  {
    id: 'engineering',
    title: 'School of Engineering',
    link: '/academics/schools',
    iconType: 'cpu'
  },
  {
    id: 'computing',
    title: 'School of Computing',
    link: '/academics/cse',
    iconType: 'code'
  },
  {
    id: 'business',
    title: 'School of Business',
    link: '/academics/mba',
    iconType: 'briefcase'
  },
  {
    id: 'sciences',
    title: 'School of Sciences',
    link: '/academics/freshman-engineering',
    iconType: 'flask'
  },
  {
    id: 'pharmacy',
    title: 'School of Pharmacy',
    link: '/academics/schools',
    iconType: 'pill'
  }
];

function SchoolIcon({ type }: { type: string }) {
  if (type === 'cpu') {
    return (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="4" y="4" width="16" height="16" rx="2" />
        <rect x="9" y="9" width="6" height="6" />
        <path d="M9 1v3M15 1v3M9 20v3M15 20v3M20 9h3M20 14h3M1 9h3M1 14h3" />
      </svg>
    );
  }
  if (type === 'briefcase') {
    return (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
        <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
      </svg>
    );
  }
  if (type === 'flask') {
    return (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M10 2v7.527a2 2 0 0 1-.211.896L4.72 20.55a1 1 0 0 0 .9 1.45h12.76a1 1 0 0 0 .9-1.45l-5.069-10.127A2 2 0 0 1 14 9.527V2" />
        <path d="M8.5 2h7M7 16h10" />
      </svg>
    );
  }
  if (type === 'pill') {
    return (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="m10.5 20.5 10-10a4.95 4.95 0 1 0-7-7l-10 10a4.95 4.95 0 1 0 7 7Z" />
        <path d="m8.5 8.5 7 7" />
      </svg>
    );
  }
  // Default code/computing
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="16 18 22 12 16 6" />
      <polyline points="8 6 2 12 8 18" />
    </svg>
  );
}

export default function ProgramsShowcase() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('ug');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const searchWrapRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // ── Real Dynamic Firestore Collections ──
  const { docs: liveSchools } = useOrderedCollection<SchoolDoc>('schools', 'order');
  const { docs: departments } = useOrderedCollection<DepartmentDoc>('departments', 'order');
  const { docs: programs } = useOrderedCollection<ProgramDoc>('programs', 'order');

  // Close search suggestions on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchWrapRef.current && !searchWrapRef.current.contains(event.target as Node)) {
        setIsSearchFocused(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Compute live program counts per category
  const btechCount = useMemo(() => programs.filter(p => p.category === 'btech').length, [programs]);
  const pgCount = useMemo(() => programs.filter(p => p.category === 'mtech' || p.category === 'mba').length, [programs]);
  const phdCount = useMemo(() => programs.filter(p => p.category === 'phd').length, [programs]);

  // Real-time live search suggestions
  const searchSuggestions = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return [];
    return programs
      .filter(p => 
        (p.name && p.name.toLowerCase().includes(q)) ||
        (p.shortName && p.shortName.toLowerCase().includes(q)) ||
        (p.department && p.department.toLowerCase().includes(q))
      )
      .slice(0, 5);
  }, [searchQuery, programs]);

  // Combine dynamic schools from Firestore or rich fallback
  const displaySchools = useMemo<SchoolCardData[]>(() => {
    if (liveSchools && liveSchools.length > 0) {
      const validSchools = liveSchools.filter(s => s && typeof s.title === 'string' && s.title.trim().length > 0);
      if (validSchools.length > 0) {
        const departmentById = new Map(departments.map(d => [d.id, d]));
        const icons: ('code' | 'cpu' | 'briefcase' | 'flask' | 'pill')[] = ['cpu', 'code', 'briefcase', 'flask', 'pill'];
        return validSchools.map((school, idx) => {
          let link = '/academics/schools';
          if (school.departmentIds && school.departmentIds.length > 0) {
            const firstDept = departmentById.get(school.departmentIds[0]);
            if (firstDept) {
              const slug = findDeptProgramSlug(firstDept, programs);
              if (slug) link = `/academics/${slug}`;
            }
          }
          return {
            id: school.id,
            title: school.title,
            link,
            iconType: icons[idx % icons.length]
          };
        });
      }
    }
    return defaultSchoolsData;
  }, [liveSchools, departments, programs]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSearchFocused(false);
    if (searchQuery.trim()) {
      navigate(`/academics?search=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      navigate('/academics');
    }
  };

  const categories = [
    { id: 'ug', label: `UG\nPrograms${btechCount > 0 ? ` (${btechCount})` : ''}`, link: '/academics?tab=btech' },
    { id: 'pg', label: `PG\nPrograms${pgCount > 0 ? ` (${pgCount})` : ''}`, link: '/academics?tab=mtech' },
    { id: 'phd', label: `Ph.D\nPrograms${phdCount > 0 ? ` (${phdCount})` : ''}`, link: '/academics?tab=phd' },
    { id: 'diploma', label: 'Corporate PG Diploma\nPrograms', link: '/academics' },
    { id: 'executive', label: 'Executive Education\nPrograms', link: '/academics' },
  ];

  return (
    <section className="programs-showcase-section programs-showcase--light" aria-label="Future-focused education programs and schools">
      <div className="programs-showcase-split-wrapper">
        
        {/* ── Left Column: Programs Overview & Filter Navigation ── */}
        <div className="programs-showcase-left-container">
          <div className="programs-showcase-left">
            <span className="programs-showcase-eyebrow">Programs</span>
            <h2 className="programs-showcase-heading">
              Future-focused education across disciplines
            </h2>

            {/* Interactive Live Search Bar */}
            <div ref={searchWrapRef} className="programs-showcase-search-container">
              <form onSubmit={handleSearch} className="programs-showcase-search-form" role="search">
                <div className="programs-showcase-search-wrap">
                  <input
                    type="text"
                    placeholder="Search Programs (e.g. CSE, AI & ML, VLSI, MBA...)"
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setIsSearchFocused(true);
                    }}
                    onFocus={() => setIsSearchFocused(true)}
                    className="programs-showcase-search-input"
                    aria-label="Search Programs"
                  />
                  <button type="submit" className="programs-showcase-search-btn" aria-label="Submit program search">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="11" cy="11" r="8" />
                      <line x1="21" y1="21" x2="16.65" y2="16.65" />
                    </svg>
                  </button>
                </div>
              </form>

              {/* Live Search Predictive Results Dropdown */}
              {isSearchFocused && searchSuggestions.length > 0 && (
                <div className="programs-showcase-dropdown">
                  <div className="programs-showcase-dropdown-header">
                    <span>Matching Programs ({searchSuggestions.length})</span>
                  </div>
                  <div className="programs-showcase-dropdown-list">
                    {searchSuggestions.map((prog) => (
                      <Link
                        key={prog.id}
                        to={`/academics/${prog.slug}`}
                        className="programs-showcase-dropdown-item"
                        onClick={() => {
                          setIsSearchFocused(false);
                          setSearchQuery('');
                        }}
                      >
                        <div className="programs-showcase-dropdown-item-title">
                          {prog.name || prog.shortName}
                        </div>
                        <span className="programs-showcase-dropdown-item-badge">
                          {prog.category.toUpperCase()}
                        </span>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Category Nav Links Grid */}
            <div className="programs-showcase-nav-grid">
              {categories.map((cat) => (
                <Link
                  key={cat.id}
                  to={cat.link}
                  className={`programs-showcase-nav-item ${activeCategory === cat.id ? 'active' : ''}`}
                  onClick={() => setActiveCategory(cat.id)}
                >
                  <span className="programs-showcase-nav-text">{cat.label}</span>
                  <span className="programs-showcase-nav-line" aria-hidden="true" />
                </Link>
              ))}
            </div>

            {/* Action CTA */}
            <div className="programs-showcase-cta-wrap">
              <Link to="/academics" className="btn programs-showcase-action-btn">
                View All Programs
              </Link>
            </div>
          </div>
        </div>

        {/* ── Right Column: Schools Full Right-Side Slit / Split ── */}
        <div className="programs-showcase-right">
          {/* Right Side Background Image Overlay */}
          <div className="programs-showcase-right-bg" aria-hidden="true">
            <img
              src="https://specials-images.forbesimg.com/imageserve/667ade7a0e285c814a7eb466/960x0.jpg"
              alt=""
              className="programs-showcase-right-bg-img"
            />
            <div className="programs-showcase-right-bg-scrim" />
          </div>

          <div className="programs-showcase-schools-content-inner">
            <div className="programs-showcase-schools-header">
              <span className="programs-showcase-schools-eyebrow">Faculties &amp; Departments</span>
              <h3 className="programs-showcase-schools-title">Schools at Vishnu Women's University</h3>
            </div>

            <div className="programs-showcase-school-cards-grid">
              {displaySchools.map((school) => (
                <Link
                  key={school.id}
                  to={school.link}
                  className="programs-school-box-card"
                  aria-label={`Learn more about ${school.title}`}
                >
                  <div className="programs-school-box-icon">
                    <SchoolIcon type={school.iconType} />
                  </div>

                  <h4 className="programs-school-box-title">{school.title}</h4>

                  <span className="programs-school-box-learn-more">
                    <span>Learn More</span>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
