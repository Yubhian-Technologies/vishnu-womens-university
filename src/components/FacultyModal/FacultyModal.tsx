import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { X, Mail, ExternalLink } from 'lucide-react';
import SmoothImage from '../SmoothImage/SmoothImage';
import type { FacultyDoc } from '../../pages/Academics/Faculty';
import type { ProgramDoc } from '../../pages/Admin/sections/ProgramsAdmin';
import './FacultyModal.css';

interface FacultyModalProps {
  faculty: FacultyDoc;
  program?: ProgramDoc;
  onClose: () => void;
}

function getInitials(name: string) {
  const cleaned = name.replace(/\b(Dr|Sri|Prof|Mr|Mrs|Ms)\.?\s*/gi, '');
  const parts = cleaned.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return '';
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export default function FacultyModal({ faculty, program, onClose }: FacultyModalProps) {
  const isHod = faculty.designation.includes('HOD');
  // Only trust the programme's HOD bio/research links when it actually names this
  // person — a stale program.hod value from before a department changed heads
  // shouldn't be attributed to whoever is currently tagged "HOD" in Faculty admin.
  const hodMatches = isHod && program && program.hod?.trim() === faculty.name.trim();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  return (
    <div className="faculty-modal-overlay" onClick={onClose}>
      <div className="faculty-modal" data-lenis-prevent onClick={(e) => e.stopPropagation()}>
        <button className="faculty-modal-close" onClick={onClose} aria-label="Close">
          <X size={18} />
        </button>

        <div className="faculty-modal-header">
          {faculty.imageUrl ? (
            <SmoothImage src={faculty.imageUrl} alt={faculty.name} className="faculty-modal-photo" />
          ) : (
            <div className="faculty-modal-avatar">{getInitials(faculty.name)}</div>
          )}
          <div>
            <h2 className="faculty-modal-name">{faculty.name}</h2>
            <p className="faculty-modal-designation">{faculty.designation}</p>
            <div className="faculty-modal-badges">
              {faculty.department && <span className="faculty-modal-badge">{faculty.department}</span>}
              {faculty.qualification && <span className="faculty-modal-badge faculty-modal-badge--outline">{faculty.qualification}</span>}
            </div>
          </div>
        </div>

        <dl className="faculty-modal-details">
          {faculty.specialization && (
            <div className="faculty-modal-row">
              <dt>Specialization</dt>
              <dd>{faculty.specialization}</dd>
            </div>
          )}
          {faculty.email && (
            <div className="faculty-modal-row">
              <dt>Email</dt>
              <dd>
                <a href={`mailto:${faculty.email}`} className="faculty-modal-link">
                  <Mail size={14} strokeWidth={1.75} /> {faculty.email}
                </a>
              </dd>
            </div>
          )}
        </dl>

        {hodMatches && program?.hodMessage && (
          <p className="faculty-modal-bio">{program.hodMessage}</p>
        )}

        {hodMatches && program?.hodResearchProfiles && program.hodResearchProfiles.length > 0 && (
          <div className="faculty-modal-research">
            <span className="faculty-modal-research__label">Research Profiles</span>
            <div className="faculty-modal-research__links">
              {program.hodResearchProfiles.map((link) => (
                <a key={link.label} href={link.url} target="_blank" rel="noopener noreferrer" className="faculty-modal-link">
                  {link.label} <ExternalLink size={12} strokeWidth={2} />
                </a>
              ))}
            </div>
          </div>
        )}

        {hodMatches && program?.slug && (
          <Link to={`/academics/${program.slug}#hod`} className="btn btn-accent faculty-modal-cta" onClick={onClose}>
            View Full Department Page →
          </Link>
        )}

        {!faculty.imageUrl && !faculty.specialization && !faculty.email && !hodMatches && (
          <p className="faculty-modal-empty">No further details have been added for this faculty member yet.</p>
        )}
      </div>
    </div>
  );
}
