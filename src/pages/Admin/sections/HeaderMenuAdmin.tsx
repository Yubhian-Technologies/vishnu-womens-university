import { useEffect, useState } from 'react';
import { doc, setDoc, deleteDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../../lib/firebase';
import { useDocument } from '../../../hooks/useDocument';
import { useOrderedCollection } from '../../../hooks/useCollection';
import type { PlacementItemDoc } from './PlacementItemsAdmin';
import {
  DEFAULT_HEADER_MENU, AUTO_SOURCE_INFO, parseHeaderMenu,
  type HeaderMenuItem, type HeaderMenuLink, type HeaderMenuGroup,
} from '../../../lib/headerMenu';

const clone = <T,>(v: T): T => JSON.parse(JSON.stringify(v));

function move<T>(list: T[], from: number, to: number) {
  if (to < 0 || to >= list.length) return;
  const [x] = list.splice(from, 1);
  list.splice(to, 0, x);
}

function isValidPath(p: string) {
  const t = p.trim();
  return t.startsWith('/') || /^https?:\/\//i.test(t);
}

/** Lists what's wrong with a draft menu, in plain language; empty = OK to save. */
function findProblems(items: HeaderMenuItem[]): string[] {
  const problems: string[] = [];
  const names = new Set<string>();
  const checkLinks = (links: HeaderMenuLink[], where: string) => {
    links.forEach((l, i) => {
      const name = l.label.trim() || `link ${i + 1}`;
      if (!l.label.trim()) problems.push(`${where}: link ${i + 1} has no name.`);
      if (!l.path.trim()) problems.push(`${where}: "${name}" has no link.`);
      else if (!isValidPath(l.path)) problems.push(`${where}: "${name}" link must start with / (a page on this site) or http:// / https://.`);
    });
  };
  items.forEach((item, i) => {
    const menu = item.label.trim() || `Menu ${i + 1}`;
    if (!item.label.trim()) problems.push(`Menu ${i + 1} has no name.`);
    else if (names.has(item.label.trim().toLowerCase())) problems.push(`Two menus are both named "${item.label.trim()}" — menu names must be different.`);
    names.add(item.label.trim().toLowerCase());
    if (item.highlight?.linkPath?.trim() && !isValidPath(item.highlight.linkPath)) problems.push(`${menu}: highlight card button link must start with / or http(s)://.`);
    if (item.auto) return;
    item.children && checkLinks(item.children, menu);
    item.groups?.forEach((g, gi) => {
      const col = `${menu} → ${g.groupLabel.trim() || `column ${gi + 1}`}`;
      if (!g.groupLabel.trim()) problems.push(`${menu}: column ${gi + 1} has no heading.`);
      if (g.groupPath?.trim() && !isValidPath(g.groupPath)) problems.push(`${col}: heading link must start with / or http(s)://.`);
      checkLinks(g.items, col);
    });
  });
  return problems;
}

/** Drops blank optional fields so the saved doc stays tidy. */
function tidy(items: HeaderMenuItem[]): HeaderMenuItem[] {
  const link = (l: HeaderMenuLink): HeaderMenuLink => {
    const out: HeaderMenuLink = { label: l.label.trim(), path: l.path.trim() };
    if (l.external) out.external = true;
    if (l.download) out.download = true;
    if (l.disabled) out.disabled = true;
    if (l.hideExternalIcon) out.hideExternalIcon = true;
    return out;
  };
  return items.map((item) => {
    const out: HeaderMenuItem = { key: item.key, label: item.label.trim() };
    if (item.path?.trim()) out.path = item.path.trim();
    if (item.hidden) out.hidden = true;
    if (item.auto) out.auto = item.auto;
    const h = item.highlight;
    if (h && (h.title.trim() || h.description.trim())) {
      out.highlight = { title: h.title.trim(), description: h.description.trim() };
      if (h.badge?.trim()) out.highlight.badge = h.badge.trim();
      if (h.linkText?.trim()) out.highlight.linkText = h.linkText.trim();
      if (h.linkPath?.trim()) out.highlight.linkPath = h.linkPath.trim();
    }
    if (item.groups) {
      out.groups = item.groups.map((g) => ({
        groupLabel: g.groupLabel.trim(),
        ...(g.groupPath?.trim() ? { groupPath: g.groupPath.trim() } : {}),
        items: g.items.map(link),
      }));
    } else {
      out.children = (item.children || []).map(link);
    }
    return out;
  });
}

const smallBtn = 'admin-btn admin-btn--sm';
const rowStyle: React.CSSProperties = { display: 'flex', flexWrap: 'wrap', gap: '0.5rem', alignItems: 'flex-end', padding: '0.6rem 0', borderBottom: '1px solid var(--color-light-gray, #e5e7eb)' };
const checkStyle: React.CSSProperties = { display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.85rem', whiteSpace: 'nowrap' };

function LinksEditor({ links, onChange, idPrefix }: { links: HeaderMenuLink[]; onChange: (fn: (links: HeaderMenuLink[]) => void) => void; idPrefix: string }) {
  return (
    <div>
      {links.length === 0 && <p className="admin-field__hint">No links yet.</p>}
      {links.map((l, i) => (
        <div key={i} style={rowStyle}>
          <div className="admin-field" style={{ flex: '1 1 200px', margin: 0 }}>
            <label htmlFor={`${idPrefix}-l${i}-label`}>Link name</label>
            <input id={`${idPrefix}-l${i}-label`} value={l.label} onChange={(e) => onChange((ls) => { ls[i].label = e.target.value; })} placeholder="e.g. Anti-Ragging Committee" />
          </div>
          <div className="admin-field" style={{ flex: '2 1 260px', margin: 0 }}>
            <label htmlFor={`${idPrefix}-l${i}-path`}>Goes to</label>
            <input id={`${idPrefix}-l${i}-path`} value={l.path} onChange={(e) => onChange((ls) => { ls[i].path = e.target.value; })} placeholder="/governance/anti-ragging or https://…" />
          </div>
          <label style={checkStyle} title="Opens in a new browser tab — use for other websites">
            <input type="checkbox" checked={!!l.external} onChange={(e) => onChange((ls) => { ls[i].external = e.target.checked; })} /> New tab
          </label>
          <label style={checkStyle} title="Downloads the file instead of opening a page">
            <input type="checkbox" checked={!!l.download} onChange={(e) => onChange((ls) => { ls[i].download = e.target.checked; })} /> Download
          </label>
          <label style={checkStyle} title="Shown greyed out and not clickable — for pages that aren't ready yet">
            <input type="checkbox" checked={!!l.disabled} onChange={(e) => onChange((ls) => { ls[i].disabled = e.target.checked; })} /> Greyed out
          </label>
          <div style={{ display: 'flex', gap: '0.25rem' }}>
            <button type="button" className={smallBtn} aria-label={`Move ${l.label || 'link'} up`} disabled={i === 0} onClick={() => onChange((ls) => move(ls, i, i - 1))}>↑</button>
            <button type="button" className={smallBtn} aria-label={`Move ${l.label || 'link'} down`} disabled={i === links.length - 1} onClick={() => onChange((ls) => move(ls, i, i + 1))}>↓</button>
            <button type="button" className={`${smallBtn} admin-btn--danger`} aria-label={`Remove ${l.label || 'link'}`} onClick={() => onChange((ls) => { ls.splice(i, 1); })}>✕</button>
          </div>
        </div>
      ))}
      <button type="button" className={`${smallBtn} admin-btn--ghost`} style={{ marginTop: '0.5rem' }} onClick={() => onChange((ls) => { ls.push({ label: '', path: '' }); })}>+ Add link</button>
    </div>
  );
}

/**
 * Admin → Header Menu: edits the whole top navigation of the public site —
 * menu names and order, each dropdown's columns and links, and the highlight
 * card shown on the right of every dropdown. Saved as one Firestore doc,
 * `settings/headerMenu` (read by hooks/useHeaderMenu.ts). Until something is
 * saved the site uses the built-in DEFAULT_HEADER_MENU, which is also what
 * this editor starts from. Differentiators, Placements and Campus Life fill
 * their links in automatically from their own admin sections, so only their
 * name, visibility, order and highlight card are edited here.
 */
export default function HeaderMenuAdmin() {
  const { data, loading } = useDocument<Record<string, unknown>>('settings', 'headerMenu');
  const saved = parseHeaderMenu(data);
  const [draft, setDraft] = useState<HeaderMenuItem[]>(() => clone(DEFAULT_HEADER_MENU));
  const [dirty, setDirty] = useState(false);
  const [saving, setSaving] = useState(false);
  const [problems, setProblems] = useState<string[]>([]);
  const [message, setMessage] = useState('');

  // Take the live menu until the admin starts editing — a Firestore snapshot
  // must never stomp on unsaved edits.
  useEffect(() => {
    if (!loading && !dirty) setDraft(clone(saved ?? DEFAULT_HEADER_MENU));
  }, [data, loading]); // eslint-disable-line react-hooks/exhaustive-deps

  // Placements used to fill its links automatically from Placement
  // Sub-pages; its links are now edited here instead. A menu that still has
  // the automatic flag (the built-in default, or a menu saved before this
  // change) opens pre-filled with exactly the links the header shows today,
  // so the first save keeps the dropdown unchanged. Not marked as an unsaved
  // change on its own — the website keeps its automatic list until saved.
  const { docs: placementItems, loading: placementsLoading } = useOrderedCollection<PlacementItemDoc>('placementItems', 'order');
  useEffect(() => {
    if (placementsLoading || !draft.some((it) => it.auto === 'placements')) return;
    setDraft((d) => d.map((it) => {
      if (it.auto !== 'placements') return it;
      const { auto: _auto, groups: _groups, ...rest } = it;
      return {
        ...rest,
        children: placementItems.map((p): HeaderMenuLink =>
          p.external && p.url
            ? { label: p.title, path: p.url, external: true, hideExternalIcon: true }
            : { label: p.title, path: `/placements/${p.slug}` }
        ),
      };
    }));
  }, [draft, placementsLoading, placementItems]);

  const update = (fn: (items: HeaderMenuItem[]) => void) => {
    setDraft((d) => { const c = clone(d); fn(c); return c; });
    setDirty(true);
    setMessage('');
  };

  const save = async () => {
    const found = findProblems(draft);
    setProblems(found);
    if (found.length) return;
    setSaving(true);
    try {
      await setDoc(doc(db, 'settings', 'headerMenu'), { items: tidy(draft), updatedAt: serverTimestamp() });
      setDirty(false);
      setMessage('Saved — the header on the website now shows this menu.');
    } catch (e) {
      alert(`Couldn't save: ${(e as Error).message}`);
    } finally {
      setSaving(false);
    }
  };

  const discard = () => {
    setDraft(clone(saved ?? DEFAULT_HEADER_MENU));
    setDirty(false);
    setProblems([]);
    setMessage('');
  };

  const resetToDefault = async () => {
    if (!confirm('Reset the header menu to the built-in default? Every change made here will be removed from the website.')) return;
    setSaving(true);
    try {
      await deleteDoc(doc(db, 'settings', 'headerMenu'));
      setDraft(clone(DEFAULT_HEADER_MENU));
      setDirty(false);
      setProblems([]);
      setMessage('Reset — the website now uses the built-in default menu.');
    } catch (e) {
      alert(`Couldn't reset: ${(e as Error).message}`);
    } finally {
      setSaving(false);
    }
  };

  const setLayout = (i: number, layout: 'list' | 'columns') => update((items) => {
    const item = items[i];
    if (layout === 'columns' && !item.groups) {
      item.groups = [{ groupLabel: item.label, items: item.children || [] }];
      delete item.children;
    } else if (layout === 'list' && item.groups) {
      item.children = item.groups.flatMap((g) => g.items);
      delete item.groups;
    }
  });

  const actions = (
    <div className="admin-form-actions" style={{ justifyContent: 'flex-start', flexWrap: 'wrap' }}>
      <button type="button" className="admin-btn admin-btn--primary" onClick={save} disabled={saving || !dirty}>{saving ? 'Saving…' : 'Save Menu'}</button>
      <button type="button" className="admin-btn admin-btn--ghost" onClick={discard} disabled={saving || !dirty}>Discard Changes</button>
      <button type="button" className="admin-btn admin-btn--danger" onClick={resetToDefault} disabled={saving || (!saved && !dirty)}>Reset to Default</button>
      {dirty && <span className="admin-badge admin-badge--gray">Unsaved changes</span>}
    </div>
  );

  if (loading) return <div className="admin-card"><p className="admin-loading">Loading…</p></div>;

  return (
    <div>
      <div className="admin-card" style={{ marginBottom: '1.5rem' }}>
        <h2 className="admin-card__title">Header Menu</h2>
        <p className="admin-field__hint" style={{ marginBottom: '0.75rem' }}>
          Edit the website&apos;s top menu: menu names and order, the columns and links inside each dropdown, and the card on
          the right of each dropdown. Changes appear on the website as soon as you click <strong>Save Menu</strong>.
          {' '}{saved ? 'The website is using a customised menu.' : 'The website is currently using the built-in default menu.'}
        </p>
        {actions}
        {message && <p className="admin-success" role="status" style={{ marginTop: '0.75rem' }}>{message}</p>}
        {problems.length > 0 && (
          <div className="admin-error" role="alert" style={{ marginTop: '0.75rem' }}>
            <strong>Please fix these before saving:</strong>
            <ul style={{ margin: '0.4rem 0 0 1.1rem' }}>{problems.map((p) => <li key={p}>{p}</li>)}</ul>
          </div>
        )}
      </div>

      {draft.map((item, i) => {
        const id = `hm-${i}`;
        const layout = item.groups ? 'columns' : 'list';
        return (
          <details key={item.key} className="admin-accordion" style={{ marginBottom: '0.75rem' }}>
            <summary className="admin-accordion__summary">
              {item.label || '(unnamed menu)'}
              {item.hidden && <span className="admin-badge admin-badge--gray admin-badge--sm" style={{ marginLeft: '0.5rem' }}>Hidden</span>}
              {item.auto && <span className="admin-badge admin-badge--green admin-badge--sm" style={{ marginLeft: '0.5rem' }}>Automatic links</span>}
            </summary>
            <div style={{ padding: '0.75rem 0' }}>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', alignItems: 'flex-end', marginBottom: '0.75rem' }}>
                <div className="admin-field" style={{ flex: '1 1 220px', margin: 0 }}>
                  <label htmlFor={`${id}-label`}>Menu name (shown in the header)</label>
                  <input id={`${id}-label`} value={item.label} onChange={(e) => update((items) => { items[i].label = e.target.value; })} />
                </div>
                <label style={checkStyle}>
                  <input type="checkbox" checked={!item.hidden} onChange={(e) => update((items) => { items[i].hidden = !e.target.checked; })} /> Show in header
                </label>
                <div style={{ display: 'flex', gap: '0.25rem' }}>
                  <button type="button" className={smallBtn} disabled={i === 0} onClick={() => update((items) => move(items, i, i - 1))}>↑ Move left</button>
                  <button type="button" className={smallBtn} disabled={i === draft.length - 1} onClick={() => update((items) => move(items, i, i + 1))}>↓ Move right</button>
                  <button
                    type="button"
                    className={`${smallBtn} admin-btn--danger`}
                    onClick={() => { if (confirm(`Delete the "${item.label || 'unnamed'}" menu? (Untick "Show in header" instead to just hide it.)`)) update((items) => { items.splice(i, 1); }); }}
                  >Delete menu</button>
                </div>
              </div>

              <h3 style={{ fontSize: '0.95rem', margin: '0.5rem 0' }}>Dropdown links</h3>
              {item.key === 'placements' && (
                <p className="admin-field__hint">
                  A new page added in Admin → Placement Sub-pages won&apos;t appear here by itself — add a link to it
                  below (e.g. <code>/placements/its-slug</code>).
                </p>
              )}
              {item.auto ? (
                <p className="admin-info-box">
                  The links in this menu are added automatically from <strong>{AUTO_SOURCE_INFO[item.auto]}</strong>.
                  Add, rename or remove them there.
                </p>
              ) : (
                <>
                  <div className="admin-field" style={{ maxWidth: 320 }}>
                    <label htmlFor={`${id}-layout`}>Layout</label>
                    <select id={`${id}-layout`} value={layout} onChange={(e) => setLayout(i, e.target.value as 'list' | 'columns')}>
                      <option value="list">Single list of links</option>
                      <option value="columns">Columns with headings</option>
                    </select>
                  </div>
                  {layout === 'list' ? (
                    <LinksEditor idPrefix={id} links={item.children || []} onChange={(fn) => update((items) => { items[i].children = items[i].children || []; fn(items[i].children!); })} />
                  ) : (
                    <>
                      {(item.groups || []).map((g: HeaderMenuGroup, gi) => (
                        <div key={gi} style={{ border: '1px solid var(--color-light-gray, #e5e7eb)', borderRadius: 8, padding: '0.75rem', marginBottom: '0.75rem' }}>
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', alignItems: 'flex-end' }}>
                            <div className="admin-field" style={{ flex: '1 1 200px', margin: 0 }}>
                              <label htmlFor={`${id}-g${gi}-label`}>Column heading</label>
                              <input id={`${id}-g${gi}-label`} value={g.groupLabel} onChange={(e) => update((items) => { items[i].groups![gi].groupLabel = e.target.value; })} />
                            </div>
                            <div className="admin-field" style={{ flex: '2 1 240px', margin: 0 }}>
                              <label htmlFor={`${id}-g${gi}-path`}>Heading links to (optional)</label>
                              <input id={`${id}-g${gi}-path`} value={g.groupPath || ''} onChange={(e) => update((items) => { items[i].groups![gi].groupPath = e.target.value; })} placeholder="/about" />
                            </div>
                            <div style={{ display: 'flex', gap: '0.25rem' }}>
                              <button type="button" className={smallBtn} disabled={gi === 0} onClick={() => update((items) => move(items[i].groups!, gi, gi - 1))}>← Column</button>
                              <button type="button" className={smallBtn} disabled={gi === (item.groups || []).length - 1} onClick={() => update((items) => move(items[i].groups!, gi, gi + 1))}>Column →</button>
                              <button
                                type="button"
                                className={`${smallBtn} admin-btn--danger`}
                                onClick={() => { if (confirm(`Remove the "${g.groupLabel || 'unnamed'}" column and its links?`)) update((items) => { items[i].groups!.splice(gi, 1); }); }}
                              >Remove column</button>
                            </div>
                          </div>
                          <LinksEditor idPrefix={`${id}-g${gi}`} links={g.items} onChange={(fn) => update((items) => fn(items[i].groups![gi].items))} />
                        </div>
                      ))}
                      <button type="button" className={`${smallBtn} admin-btn--ghost`} onClick={() => update((items) => { (items[i].groups = items[i].groups || []).push({ groupLabel: '', items: [] }); })}>+ Add column</button>
                    </>
                  )}
                </>
              )}

              <h3 style={{ fontSize: '0.95rem', margin: '1.25rem 0 0.5rem' }}>Highlight card (right side of the dropdown)</h3>
              <p className="admin-field__hint">Leave the title and description empty to hide the card.</p>
              <div className="admin-form-grid">
                <div className="admin-field">
                  <label htmlFor={`${id}-hl-badge`}>Badge</label>
                  <input id={`${id}-hl-badge`} value={item.highlight?.badge || ''} onChange={(e) => update((items) => { items[i].highlight = { title: '', description: '', ...items[i].highlight, badge: e.target.value }; })} placeholder="About VWU" />
                </div>
                <div className="admin-field">
                  <label htmlFor={`${id}-hl-title`}>Title</label>
                  <input id={`${id}-hl-title`} value={item.highlight?.title || ''} onChange={(e) => update((items) => { items[i].highlight = { description: '', ...items[i].highlight, title: e.target.value }; })} />
                </div>
                <div className="admin-field admin-field--full">
                  <label htmlFor={`${id}-hl-desc`}>Description (wrap words in **double asterisks** for bold)</label>
                  <textarea id={`${id}-hl-desc`} rows={3} value={item.highlight?.description || ''} onChange={(e) => update((items) => { items[i].highlight = { title: '', ...items[i].highlight, description: e.target.value }; })} />
                </div>
                <div className="admin-field">
                  <label htmlFor={`${id}-hl-text`}>Button text</label>
                  <input id={`${id}-hl-text`} value={item.highlight?.linkText || ''} onChange={(e) => update((items) => { items[i].highlight = { title: '', description: '', ...items[i].highlight, linkText: e.target.value }; })} placeholder="Learn More" />
                </div>
                <div className="admin-field">
                  <label htmlFor={`${id}-hl-path`}>Button goes to</label>
                  <input id={`${id}-hl-path`} value={item.highlight?.linkPath || ''} onChange={(e) => update((items) => { items[i].highlight = { title: '', description: '', ...items[i].highlight, linkPath: e.target.value }; })} placeholder="/about" />
                </div>
              </div>
            </div>
          </details>
        );
      })}

      <div className="admin-card">
        <button
          type="button"
          className="admin-btn admin-btn--ghost"
          onClick={() => update((items) => { items.push({ key: `menu-${Date.now()}`, label: 'New Menu', children: [] }); })}
        >+ Add menu</button>
        {actions}
      </div>
    </div>
  );
}
