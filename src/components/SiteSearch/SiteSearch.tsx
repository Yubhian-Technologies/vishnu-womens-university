import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search } from 'lucide-react';
import { findAcademicMatch } from '../../lib/academicSearchTerms';

/** Hero search — courses/programs/schools/departments only. No live-typing
 *  dropdown: looks up the query against the hardcoded academic search terms
 *  (see lib/academicSearchTerms.ts) on submit and jumps straight there. If
 *  nothing in that list matches, falls back to the Programs page's own
 *  substring search over live Firestore program data, so an unmatched query
 *  still goes somewhere useful instead of a dead end. */
export default function SiteSearch() {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = query.trim();
    if (!trimmed) return;
    const match = findAcademicMatch(trimmed);
    navigate(match ? match.path : `/academics/programs?search=${encodeURIComponent(trimmed)}`);
  };

  return (
    <form className="home-search-form" onSubmit={handleSubmit} role="search" autoComplete="off">
      <div className="home-search-box">
        <Search className="home-search-icon" size={19} strokeWidth={2} />
        <input
          type="text"
          className="home-search-input"
          placeholder="Search courses, programs, schools…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          aria-label="Search courses, programs, schools and departments"
        />
        <button type="submit" className="home-search-submit">Search</button>
      </div>
    </form>
  );
}
