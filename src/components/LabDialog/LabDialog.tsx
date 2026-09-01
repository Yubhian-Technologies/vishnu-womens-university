import { useEffect } from 'react';
import { X, Microscope, FileText } from 'lucide-react';
import type { LabItem } from '../../pages/Admin/sections/ProgramsAdmin';
import './LabDialog.css';

interface Props {
  lab: LabItem | null;
  onClose: () => void;
}

/** Detail dialog opened by tapping a laboratory tile on the Department/
 *  Programme page — shows the lab's description (a paragraph or one point
 *  per line, whitespace preserved exactly as the admin typed it) and, if
 *  one's been uploaded, a link to its PDF. Replaces the old behaviour of a
 *  tile just being a direct link to the PDF, since a lab with a description
 *  but no PDF had nothing to tap through to. */
export default function LabDialog({ lab, onClose }: Props) {
  useEffect(() => {
    if (!lab) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [lab, onClose]);

  if (!lab) return null;

  return (
    <div className="lab-dialog-overlay" onClick={onClose}>
      <div className="lab-dialog" role="dialog" aria-modal="true" aria-label={lab.name} onClick={(e) => e.stopPropagation()}>
        <button className="lab-dialog-close" onClick={onClose} aria-label="Close">
          <X size={18} />
        </button>
        <div className="lab-dialog-body">
          <div className="lab-dialog-icon"><Microscope size={22} strokeWidth={1.75} /></div>
          <h3 className="lab-dialog-title">{lab.name}</h3>
          {lab.description
            ? <p className="lab-dialog-desc">{lab.description}</p>
            : <p className="lab-dialog-desc lab-dialog-desc--empty">No description added yet.</p>}
          {lab.pdfUrl ? (
            <a href={lab.pdfUrl} target="_blank" rel="noopener noreferrer" className="lab-dialog-pdf-link">
              <FileText size={16} strokeWidth={2} /> View PDF
            </a>
          ) : (
            <p className="lab-dialog-pdf-note">PDF not available</p>
          )}
        </div>
      </div>
    </div>
  );
}
