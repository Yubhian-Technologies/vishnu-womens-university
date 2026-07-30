import { useState } from 'react';
import { ChevronDown, Check, User } from 'lucide-react';
import { PROFESSIONAL_BODIES } from './professionalBodiesDefault';

// A dedicated redesign of the Professional Bodies list: each body (ISTE,
// IEEE, IETE, ...) carries a different mix of content — plain paragraphs,
// labeled bullet lists, one or more named people (advisors/chairs with
// contact details), a small chapter-info panel, and/or a dated activity log
// — which is more structure than the shared tableText/accordionText/
// projectsText parsers in ResearchDetail.tsx support in one collapsible
// item, so this renders the richer PROFESSIONAL_BODIES data directly.
export default function ProfessionalBodiesSection() {
  const [openKey, setOpenKey] = useState<string | null>(PROFESSIONAL_BODIES[0]?.key ?? null);

  const toggle = (key: string) => {
    setOpenKey((prev) => (prev === key ? null : key));
  };

  return (
    <div className="pb-list">
      {PROFESSIONAL_BODIES.map((body) => {
        const isOpen = openKey === body.key;
        return (
          <div key={body.key} className={`pb-item${isOpen ? ' open' : ''}`}>
            <button
              type="button"
              className="pb-item-head"
              onClick={() => toggle(body.key)}
              aria-expanded={isOpen}
            >
              <span className="pb-item-head-text">
                <span className="pb-item-short">{body.shortName}</span>
                <span className="pb-item-full">{body.fullName}</span>
              </span>
              <ChevronDown size={18} strokeWidth={2.25} className="pb-item-chevron" />
            </button>
            <div className="pb-item-body">
              <div className="pb-item-body-inner">
                <div className="pb-item-content">
                  {body.paragraphs.map((p, pi) => (
                    <p key={pi} className="pb-paragraph">{p}</p>
                  ))}

                  {body.bullets && body.bullets.length > 0 && (
                    <ul className="pb-bullets">
                      {body.bullets.map((b, bi) => (
                        <li key={bi}>
                          <Check size={13} strokeWidth={2.5} className="pb-bullet-icon" />
                          <span>
                            {b.label && <strong>{b.label}: </strong>}
                            {b.text}
                          </span>
                        </li>
                      ))}
                    </ul>
                  )}

                  {body.people && body.people.length > 0 && (
                    <div className="pb-people">
                      {body.people.map((person, pi) => (
                        <div key={pi} className="pb-person-card">
                          <span className="pb-person-icon"><User size={15} strokeWidth={2} /></span>
                          <div>
                            <span className="pb-person-role">{person.role}</span>
                            <span className="pb-person-name">{person.name}</span>
                            {person.details?.map((d, di) => (
                              <span key={di} className="pb-person-detail">{d}</span>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {body.chapterInfo && body.chapterInfo.length > 0 && (
                    <div className="pb-chapter-info">
                      {body.chapterInfo.map((row, ri) => (
                        <div key={ri} className="pb-chapter-info-row">
                          <span>{row.label}</span>
                          <strong>{row.value}</strong>
                        </div>
                      ))}
                    </div>
                  )}

                  {body.activities && body.activities.length > 0 && (
                    <div className="pb-activities">
                      {body.activitiesTitle && <h4>{body.activitiesTitle}</h4>}
                      <div className="pb-activities-scroll">
                        <table>
                          <thead>
                            <tr>
                              <th className="pb-activities-num">S.No</th>
                              <th>Name of the Event</th>
                              <th>Dates</th>
                            </tr>
                          </thead>
                          <tbody>
                            {body.activities.map((a, ai) => (
                              <tr key={ai}>
                                <td className="pb-activities-num">{ai + 1}</td>
                                <td>{a.name}</td>
                                <td>{a.date}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
