import { useState } from 'react';
import { ChevronDown, Check } from 'lucide-react';
import { QUALITY_PARAMETER_CATEGORIES } from './qualityParametersDefault';

// A single-level accordion (A. Quality Education, B. Academic
// Infrastructure, ...), each holding a flat checklist of parameters — reuses
// the .pb-* accordion styles first built for Research's Professional
// Bodies section, since the visual shape (header bar + expand/collapse +
// checkmark bullet list) is identical, just without that page's
// paragraphs/people/table blocks.
export default function QualityParametersSection() {
  const [openKey, setOpenKey] = useState<string | null>(QUALITY_PARAMETER_CATEGORIES[0]?.key ?? null);

  const toggle = (key: string) => {
    setOpenKey((prev) => (prev === key ? null : key));
  };

  return (
    <div className="pb-list">
      {QUALITY_PARAMETER_CATEGORIES.map((cat) => {
        const isOpen = openKey === cat.key;
        return (
          <div key={cat.key} className={`pb-item${isOpen ? ' open' : ''}`}>
            <button
              type="button"
              className="pb-item-head"
              onClick={() => toggle(cat.key)}
              aria-expanded={isOpen}
            >
              <span className="pb-item-head-text">
                <span className="pb-item-short">{cat.title}</span>
              </span>
              <ChevronDown size={18} strokeWidth={2.25} className="pb-item-chevron" />
            </button>
            <div className="pb-item-body">
              <div className="pb-item-body-inner">
                <div className="pb-item-content">
                  <ul className="pb-bullets">
                    {cat.items.map((it, ii) => (
                      <li key={ii}>
                        <Check size={13} strokeWidth={2.5} className="pb-bullet-icon" />
                        <span>{it}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
