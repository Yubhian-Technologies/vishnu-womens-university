import { useState, useMemo, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useOrderedCollection } from '../../hooks/useCollection';
import type { ProgramDoc } from '../../pages/Admin/sections/ProgramsAdmin';
import './ProgramsShowcase.css';

export default function ProgramsShowcase() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('ug');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const searchWrapRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // ── Real Dynamic Firestore Collections ──
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
    // ‌ (ZWNJ) after "(" stops fonts substituting "(5)"/"(3)" with a circled-digit ligature
    { id: 'ug', label: `Undergraduate Programs${btechCount > 0 ? ` (‌${btechCount})` : ''}`, link: '/academics?tab=btech' },
    { id: 'pg', label: `Postgraduate Programs${pgCount > 0 ? ` (‌${pgCount})` : ''}`, link: '/academics?tab=mtech' },
    { id: 'phd', label: `Ph.D Programs${phdCount > 0 ? ` (‌${phdCount})` : ''}`, link: '/academics?tab=phd' },
  ];

  return (
    <section className="programs-showcase-section programs-showcase--light" aria-label="Future-focused education programs and schools">
      <div className="programs-showcase-split-wrapper">
        
        {/* ── Left Column: Programs Overview & Filter Navigation ── */}
        <div className="programs-showcase-left-container">
          <div className="programs-showcase-left">
            <span className="programs-showcase-eyebrow">Programs</span>
            <h2 className="programs-showcase-heading">
              A Spectrum of Programmes. A World of Possibilities.
            </h2>
            <div className="programs-showcase-desc">
              <p>VWU offers a diverse portfolio of academic programmes that bring together rigorous learning, research, global perspectives, and meaningful industry engagement. From undergraduate to doctoral study, every programme is designed to nurture curiosity, build future-ready capabilities, and empower students to transform ideas into innovation and impact.</p>
              <p>With opportunities to learn across disciplines, engage in research, gain global exposure, and connect with industry, students are prepared not just for successful careers, but to become confident leaders, thoughtful innovators, and lifelong learners in an ever-evolving world.</p>
            </div>

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

        {/* ── Right Column: Campus Photo ── */}
        <div className="programs-showcase-right">
          <img
            src="/images/future-focussed.jpeg"
            alt="Vishnu Women's University campus"
            className="programs-showcase-right-bg-img"
          />
        </div>

      </div>
    </section>
  );
}
