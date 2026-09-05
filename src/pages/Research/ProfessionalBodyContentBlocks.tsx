import { Check, User } from 'lucide-react';
import type { ParsedProfessionalBody } from '../../lib/professionalBodyContent';

// The actual paragraphs/bullets/people/chapter-info/activities content for
// one Professional Body — shared between... nowhere else yet, but pulled
// out of ProfessionalBodiesSection (which used to render this inline inside
// each accordion item) so ProfessionalBodyDetail's own page can render the
// exact same content once a logo is clicked through to it.
export default function ProfessionalBodyContentBlocks({ body }: { body: ParsedProfessionalBody }) {
  return (
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
  );
}
