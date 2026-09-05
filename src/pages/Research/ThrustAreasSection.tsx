import { useState } from 'react';
import {
  Cpu, Radio, Zap, Cog, Building2, FlaskConical, Briefcase, Layers, ChevronDown, LayoutGrid,
  type LucideIcon,
} from 'lucide-react';
import type { AccordionCategory } from '../../lib/structuredTable';

// Maps the department-level category titles in thrustAreasDefault.ts to a
// representative icon. Falls back to a generic icon for any department an
// admin adds later that isn't in this list.
const DEPT_ICONS: Record<string, LucideIcon> = {
  'Computer Science & Engineering': Cpu,
  'Electronics & Communication Engineering': Radio,
  'Electrical & Electronics Engineering': Zap,
  'Mechanical Engineering': Cog,
  'Civil Engineering': Building2,
  'Science & Humanities': FlaskConical,
  Management: Briefcase,
};

function initials(name: string) {
  const cleaned = name.replace(/\b(Dr|Sri|Prof|Mr|Mrs|Ms)\.?\s*/gi, '');
  const parts = cleaned.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return '';
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

// A dedicated redesign of the Thrust Areas of Research accordion: faculty
// specialize across 8 departments and 25+ research areas, which reads as one
// long undifferentiated list under the generic category accordion used by
// every other Research sub-page (see the shared render path in
// ResearchDetail.tsx). This groups areas under a browsable department-tab
// filter instead, so a visitor can jump straight to their department.
export default function ThrustAreasSection({ categories }: { categories: AccordionCategory[] }) {
  const [activeDept, setActiveDept] = useState('All');
  const [openKeys, setOpenKeys] = useState<Set<string>>(new Set());

  const toggle = (key: string) => {
    setOpenKeys((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  const visibleCategories = activeDept === 'All' ? categories : categories.filter((c) => c.title === activeDept);

  return (
    <>
      <div className="thrust-dept-tabs" role="tablist">
        <button
          type="button"
          className={`thrust-dept-tab${activeDept === 'All' ? ' active' : ''}`}
          onClick={() => setActiveDept('All')}
          aria-pressed={activeDept === 'All'}
        >
          <LayoutGrid size={14} strokeWidth={2.25} /> All Departments
        </button>
        {categories.map((cat) => {
          const Icon = DEPT_ICONS[cat.title] || Layers;
          return (
            <button
              key={cat.title}
              type="button"
              className={`thrust-dept-tab${activeDept === cat.title ? ' active' : ''}`}
              onClick={() => setActiveDept(cat.title)}
              aria-pressed={activeDept === cat.title}
            >
              <Icon size={14} strokeWidth={2.25} /> {cat.title}
              <span className="thrust-dept-tab-count">{cat.areas.length}</span>
            </button>
          );
        })}
      </div>

      {visibleCategories.map((cat) => {
        const Icon = DEPT_ICONS[cat.title] || Layers;
        const catIndex = categories.indexOf(cat);
        return (
          <div key={cat.title || catIndex} className="thrust-dept-group">
            <div className="thrust-dept-heading">
              <span className="thrust-dept-heading-icon">
                <Icon size={18} strokeWidth={2} />
              </span>
              <h3>{cat.title}</h3>
              <span className="thrust-dept-heading-count">
                {cat.areas.length} area{cat.areas.length === 1 ? '' : 's'}
              </span>
            </div>
            <div className="thrust-area-grid">
              {cat.areas.map((area, ai) => {
                const key = `${catIndex}-${ai}`;
                const isOpen = openKeys.has(key);
                const hasSubAreas = Boolean(area.subAreas && area.subAreas.length > 0);
                return (
                  <div key={ai} className={`thrust-area-card${isOpen ? ' open' : ''}`}>
                    <button
                      type="button"
                      className="thrust-area-card-head"
                      onClick={() => toggle(key)}
                      aria-expanded={isOpen}
                    >
                      <span className="thrust-area-card-name">{area.name}</span>
                      <span className="thrust-area-card-meta">
                        <span className="thrust-area-card-count">{hasSubAreas ? area.subAreas!.length : area.items.length}</span>
                        <ChevronDown size={16} strokeWidth={2.25} className="thrust-area-card-chevron" />
                      </span>
                    </button>
                    <div className="thrust-area-card-body">
                      <div className="thrust-area-card-body-inner">
                        {hasSubAreas ? (
                          <div className="thrust-subarea-list">
                            {area.subAreas!.map((sub, si) => {
                              const subKey = `${key}-${si}`;
                              const subOpen = openKeys.has(subKey);
                              return (
                                <div key={si} className={`thrust-area-card thrust-subarea-card${subOpen ? ' open' : ''}`}>
                                  <button
                                    type="button"
                                    className="thrust-area-card-head"
                                    onClick={() => toggle(subKey)}
                                    aria-expanded={subOpen}
                                  >
                                    <span className="thrust-area-card-name">{sub.name}</span>
                                    <span className="thrust-area-card-meta">
                                      <span className="thrust-area-card-count">{sub.items.length}</span>
                                      <ChevronDown size={16} strokeWidth={2.25} className="thrust-area-card-chevron" />
                                    </span>
                                  </button>
                                  <div className="thrust-area-card-body">
                                    <div className="thrust-area-card-body-inner">
                                      <ul className="thrust-faculty-list">
                                        {sub.items.map((it, ii) => (
                                          <li key={ii}>
                                            <span className="thrust-faculty-avatar">{initials(it.label)}</span>
                                            {it.href ? (
                                              <a href={it.href} target="_blank" rel="noopener noreferrer" className="thrust-faculty-link">
                                                {it.label}
                                              </a>
                                            ) : (
                                              <span className="thrust-faculty-link">{it.label}</span>
                                            )}
                                          </li>
                                        ))}
                                      </ul>
                                    </div>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        ) : (
                          <ul className="thrust-faculty-list">
                            {area.items.map((it, ii) => (
                              <li key={ii}>
                                <span className="thrust-faculty-avatar">{initials(it.label)}</span>
                                {it.href ? (
                                  <a href={it.href} target="_blank" rel="noopener noreferrer" className="thrust-faculty-link">
                                    {it.label}
                                  </a>
                                ) : (
                                  <span className="thrust-faculty-link">{it.label}</span>
                                )}
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </>
  );
}
