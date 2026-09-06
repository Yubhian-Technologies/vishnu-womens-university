import { useMemo, useRef, useState } from 'react';
import { addDoc, collection, deleteDoc, doc, serverTimestamp, writeBatch } from 'firebase/firestore';
import { db } from '../../../lib/firebase';
import { useOrderedCollection } from '../../../hooks/useCollection';
import { uploadImage } from '../../../lib/storage';
import { galleryAlbums as STATIC_ALBUMS } from '../../NewsAwards/news-awards.data';

interface GalleryImage {
  id: string;
  title: string;
  category: string;
  imageUrl: string;
  storagePath: string;
  order: number;
}

/** One event album on the public "Milestones by Year" grid (/news-awards/gallery). */
export interface GalleryAlbumDoc {
  id: string;
  year: number;
  title: string;
  /** Optional poster/cover image shown on the card. */
  imageUrl: string;
  /** The "VIEW" CTA target — a Google Photos share link. */
  link: string;
  /** Free-text display date, e.g. "March 7, 2025" or "March 7–8, 2025". */
  date: string;
  order: number;
}

const CATEGORIES = ['Campus', 'Events', 'Academics', 'Sports', 'Clubs', 'Cultural', 'Placements', 'Infrastructure'];

const CURRENT_YEAR = new Date().getFullYear();

type BulkRow = { title: string; imageUrl: string; link: string; date: string; endDate: string };

// Header-name → field, so a pasted spreadsheet's own header row maps
// columns by name (any order) instead of forcing a fixed column order.
const HEADER_ALIASES: Record<string, keyof BulkRow> = {
  title: 'title', name: 'title', event: 'title',
  'image url': 'imageUrl', image: 'imageUrl', imageurl: 'imageUrl', cover: 'imageUrl', 'image link': 'imageUrl', poster: 'imageUrl',
  'google photos link': 'link', 'google photos': 'link', link: 'link', 'photos link': 'link', url: 'link', googlephotoslink: 'link',
  date: 'date', 'start date': 'date', 'from': 'date',
  'end date': 'endDate', enddate: 'endDate', 'date end': 'endDate', to: 'endDate', 'display date': 'endDate',
};
const norm = (s: string) => s.toLowerCase().trim().replace(/[_\s]+/g, ' ');

// Pull a 4-digit year (1900–2099) out of any free-text date — "Oct 15, 2025",
// "Aug/23/2026", "March 7–8, 2025", "2025-10-15", or a bare "2025" all work.
export function yearFromDateText(s: string): number | null {
  const m = (s || '').match(/\b(19|20)\d{2}\b/);
  return m ? parseInt(m[0], 10) : null;
}

// Single-day events repeat the date in the End Date column — collapse that
// back to one string; a real range shows as "start – end".
function displayDate(row: BulkRow): string {
  const d = row.date.trim();
  const e = row.endDate.trim();
  if (!e || e === d) return d;
  if (!d) return e;
  return `${d} – ${e}`;
}

/** Split one CSV line, honouring "quoted, fields" and "" escapes. */
function splitCsvLine(line: string): string[] {
  const out: string[] = [];
  let cur = '';
  let q = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (q) {
      if (ch === '"' && line[i + 1] === '"') { cur += '"'; i++; }
      else if (ch === '"') q = false;
      else cur += ch;
    } else if (ch === '"') q = true;
    else if (ch === ',') { out.push(cur); cur = ''; }
    else cur += ch;
  }
  out.push(cur);
  return out.map((c) => c.trim());
}

function rowsFromDelimited(text: string, kind: 'tab' | 'csv'): BulkRow[] {
  const lines = text.split('\n').map((l) => l.replace(/\r$/, '')).filter((l) => l.trim());
  const cells = lines.map((l) => (kind === 'csv' ? splitCsvLine(l) : l.split('\t').map((c) => c.trim())));
  if (cells.length === 0) return [];
  const head = cells[0].map(norm);
  const isHeader = head.some((c) => c in HEADER_ALIASES) && head.every((c) => !c || c in HEADER_ALIASES);
  const cols: (keyof BulkRow | null)[] = isHeader
    ? head.map((c) => HEADER_ALIASES[c] ?? null)
    : ['title', 'imageUrl', 'link', 'date', 'endDate'];
  return cells
    .slice(isHeader ? 1 : 0)
    .map((row) => {
      const r: BulkRow = { title: '', imageUrl: '', link: '', date: '', endDate: '' };
      row.forEach((val, i) => { const k = cols[i]; if (k) r[k] = val; });
      return r;
    })
    .filter((r) => r.title);
}

function rowsFromJson(text: string): BulkRow[] {
  const data = JSON.parse(text);
  const arr = Array.isArray(data) ? data : [data];
  return arr
    .map((o: Record<string, unknown>): BulkRow => {
      const by: Record<string, string> = {};
      Object.keys(o || {}).forEach((k) => { by[norm(k)] = String(o[k] ?? '').trim(); });
      const pick = (...names: string[]) => names.map((n) => by[n]).find(Boolean) || '';
      return {
        title: pick('title', 'name', 'event'),
        imageUrl: pick('image url', 'imageurl', 'image', 'cover', 'poster', 'image link'),
        link: pick('google photos link', 'google photos', 'link', 'photos link', 'url'),
        date: pick('date', 'start date', 'from'),
        endDate: pick('end date', 'enddate', 'date end', 'to', 'display date'),
      };
    })
    .filter((r) => r.title);
}

/** Parse a bulk paste — auto-detects JSON (array/object), CSV, or
 *  Tab-separated. Columns: Title, Image URL, Google Photos Link, Date,
 *  End Date (positional, or by header names in any order). End Date is
 *  optional and may repeat Date for single-day events. Never throws — bad
 *  input yields []. */
function parseBulk(text: string): BulkRow[] {
  const t = text.trim();
  if (!t) return [];
  if (t[0] === '[' || t[0] === '{') {
    try { return rowsFromJson(t); } catch { return []; }
  }
  const firstLine = t.split('\n')[0];
  if (firstLine.includes('\t')) return rowsFromDelimited(t, 'tab');
  if (firstLine.includes(',')) return rowsFromDelimited(t, 'csv');
  return rowsFromDelimited(t, 'tab'); // single column = titles only
}

export default function GalleryAdmin() {
  const { docs: images, loading } = useOrderedCollection<GalleryImage>('gallery', 'order');
  const { docs: albums, loading: albumsLoading } = useOrderedCollection<GalleryAlbumDoc>('galleryAlbums', 'order');

  const [category, setCategory] = useState('Campus');
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState('');
  const [deletingAll, setDeletingAll] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFiles = async (files: FileList) => {
    setUploading(true);
    const arr = Array.from(files);
    for (let i = 0; i < arr.length; i++) {
      setProgress(`Uploading ${i + 1} / ${arr.length}…`);
      try {
        const result = await uploadImage(arr[i], `vwu/gallery/${category.toLowerCase()}`);
        await addDoc(collection(db, 'gallery'), {
          title: arr[i].name.replace(/\.[^.]+$/, ''),
          category,
          imageUrl: result.url,
          storagePath: result.path,
          order: images.length + i,
          createdAt: serverTimestamp(),
        });
      } catch (e) {
        console.error(e);
      }
    }
    setUploading(false);
    setProgress('');
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files.length) handleFiles(e.dataTransfer.files);
  };

  const remove = async (id: string) => {
    if (!confirm('Remove this image from the gallery?')) return;
    await deleteDoc(doc(db, 'gallery', id));
  };

  const deleteAllImages = async () => {
    if (images.length === 0 || deletingAll) return;
    if (!confirm(`Delete ALL ${images.length} gallery images? This cannot be undone.`)) return;
    if (prompt('Type DELETE to confirm removing every image from the gallery grid.') !== 'DELETE') return;
    setDeletingAll(true);
    try {
      // Firestore batches cap at 500 writes — chunk well under (same as the
      // bulk-import path below). Only the docs are removed, matching the
      // per-image delete above; Storage blobs aren't touched anywhere here.
      for (let i = 0; i < images.length; i += 400) {
        const batch = writeBatch(db);
        images.slice(i, i + 400).forEach((img) => batch.delete(doc(db, 'gallery', img.id)));
        await batch.commit();
      }
    } catch (e) {
      alert(`Couldn't delete all images: ${(e as Error).message}`);
    } finally {
      setDeletingAll(false);
    }
  };

  // ── Event Albums (by Year) ──────────────────────────────────────────────
  const docYears = useMemo(
    () => Array.from(new Set(albums.map((a) => a.year))).sort((a, b) => b - a),
    [albums],
  );
  const [extraYears, setExtraYears] = useState<number[]>([]);
  const years = useMemo(
    () => Array.from(new Set([...docYears, ...extraYears])).sort((a, b) => b - a),
    [docYears, extraYears],
  );
  const [activeYear, setActiveYear] = useState<number | null>(null);
  const year = activeYear ?? years[0] ?? CURRENT_YEAR;
  const yearAlbums = useMemo(() => albums.filter((a) => a.year === year), [albums, year]);

  const [newYear, setNewYear] = useState('');
  const [form, setForm] = useState({ title: '', imageUrl: '', link: '', date: '' });
  const [saving, setSaving] = useState(false);
  const [bulkText, setBulkText] = useState('');
  const [bulkOpen, setBulkOpen] = useState(false);
  const [importMsg, setImportMsg] = useState('');

  const nextOrder = () => (albums.length ? Math.max(...albums.map((a) => a.order || 0)) + 1 : 0);

  const addYear = () => {
    const y = parseInt(newYear, 10);
    if (!y || y < 1900 || y > 2200) return alert('Enter a valid year, e.g. 2025.');
    setExtraYears((p) => Array.from(new Set([...p, y])));
    setActiveYear(y);
    setNewYear('');
  };

  const addOne = async () => {
    if (!form.title.trim()) return alert('Title is required.');
    setSaving(true);
    try {
      await addDoc(collection(db, 'galleryAlbums'), {
        year,
        title: form.title.trim(),
        imageUrl: form.imageUrl.trim(),
        link: form.link.trim(),
        date: form.date.trim(),
        order: nextOrder(),
        createdAt: serverTimestamp(),
      });
      setForm({ title: '', imageUrl: '', link: '', date: '' });
    } catch (e) {
      alert(`Couldn't add album: ${(e as Error).message}`);
    } finally {
      setSaving(false);
    }
  };

  const importBulk = async () => {
    const parsed = parseBulk(bulkText);
    if (parsed.length === 0) return setImportMsg('Nothing to import — check the format (Tab-separated, CSV, or a JSON array with a "title" on each row).');
    setSaving(true);
    setImportMsg('');
    try {
      // Each row fans out into the year parsed from its Date column (falling
      // back to the selected year when the date has no year). Collapse
      // duplicate (year + title) rows within the paste itself — last wins.
      const key = (y: number, title: string) => `${y} | ${title.trim().toLowerCase()}`;
      const collapsed = new Map<string, { row: BulkRow; y: number }>();
      for (const row of parsed) {
        const y = yearFromDateText(row.date) ?? yearFromDateText(row.endDate) ?? year;
        collapsed.set(key(y, row.title), { row, y });
      }
      const entries = [...collapsed.values()];

      // Existing albums keyed the same way — a match means update in place
      // (create a fresh card for that year otherwise).
      const existingByKey = new Map(albums.map((a) => [key(a.year, a.title), a.id]));

      let order = nextOrder();
      let created = 0;
      let updated = 0;
      const touchedYears = new Set<number>();

      // Firestore batches cap at 500 writes — chunk to stay well under.
      for (let i = 0; i < entries.length; i += 400) {
        const batch = writeBatch(db);
        for (const { row, y } of entries.slice(i, i + 400)) {
          touchedYears.add(y);
          const existingId = existingByKey.get(key(y, row.title));
          if (existingId) {
            // Update the current data — only overwrite image/link when the
            // incoming row actually provides one, so a text-only re-import
            // doesn't blank an existing poster.
            const patch: Record<string, unknown> = { year: y, date: displayDate(row) };
            if (row.imageUrl) patch.imageUrl = row.imageUrl;
            if (row.link) patch.link = row.link;
            batch.update(doc(db, 'galleryAlbums', existingId), patch);
            updated++;
          } else {
            batch.set(doc(collection(db, 'galleryAlbums')), {
              year: y,
              title: row.title,
              imageUrl: row.imageUrl,
              link: row.link,
              date: displayDate(row),
              order: order++,
              createdAt: serverTimestamp(),
            });
            created++;
          }
        }
        await batch.commit();
      }

      const yrs = [...touchedYears].sort((a, b) => a - b).join(', ');
      setImportMsg(`Done — ${created} new, ${updated} updated across ${yrs}.`);
      setBulkText('');
      if (touchedYears.size) setActiveYear(Math.max(...touchedYears));
    } catch (e) {
      setImportMsg(`Import failed: ${(e as Error).message}`);
    } finally {
      setSaving(false);
    }
  };

  const seedStarter = async () => {
    if (!confirm(`Add ${STATIC_ALBUMS.length} starter albums from the built-in archive?`)) return;
    setSaving(true);
    try {
      let base = nextOrder();
      for (let i = 0; i < STATIC_ALBUMS.length; i += 400) {
        const batch = writeBatch(db);
        STATIC_ALBUMS.slice(i, i + 400).forEach((a, j) => {
          batch.set(doc(collection(db, 'galleryAlbums')), {
            year: a.year,
            title: a.title,
            imageUrl: '',
            link: a.link || '',
            date: a.date || '',
            order: base + i + j,
            createdAt: serverTimestamp(),
          });
        });
        await batch.commit();
      }
    } catch (e) {
      alert(`Seed failed: ${(e as Error).message}`);
    } finally {
      setSaving(false);
    }
  };

  const removeAlbum = async (id: string) => {
    if (!confirm('Delete this album card?')) return;
    await deleteDoc(doc(db, 'galleryAlbums', id));
  };

  const [deletingAllAlbums, setDeletingAllAlbums] = useState(false);
  const deleteAllAlbums = async () => {
    if (albums.length === 0 || deletingAllAlbums) return;
    if (!confirm(`Delete ALL ${albums.length} event albums across every year? This cannot be undone.`)) return;
    if (prompt('Type DELETE to confirm removing every event album.') !== 'DELETE') return;
    setDeletingAllAlbums(true);
    try {
      for (let i = 0; i < albums.length; i += 400) {
        const batch = writeBatch(db);
        albums.slice(i, i + 400).forEach((a) => batch.delete(doc(db, 'galleryAlbums', a.id)));
        await batch.commit();
      }
      setExtraYears([]);
      setActiveYear(null);
    } catch (e) {
      alert(`Couldn't delete all albums: ${(e as Error).message}`);
    } finally {
      setDeletingAllAlbums(false);
    }
  };

  return (
    <div className="admin-section">
      <div className="admin-card">
        <h2 className="admin-card__title">Upload Images</h2>
        <div className="admin-field" style={{ maxWidth: 260 }}>
          <label htmlFor="field-category">Category</label>
          <select id="field-category" value={category} onChange={(e) => setCategory(e.target.value)}>
            {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
          </select>
        </div>
        <div
          className="gallery-drop-zone"
          onClick={() => !uploading && inputRef.current?.click()}
          onDragOver={(e) => e.preventDefault()}
          onDrop={onDrop}
        >
          {uploading ? (
            <>
              <div className="admin-spinner" />
              <p>{progress}</p>
            </>
          ) : (
            <>
              <span style={{ fontSize: '2.5rem' }}>📷</span>
              <p><strong>Click or drag & drop</strong> multiple images here</p>
              <p style={{ fontSize: '0.8rem', color: '#888' }}>JPG, PNG, WebP — uploaded directly to Firebase Storage</p>
            </>
          )}
        </div>
        <input ref={inputRef} type="file" accept="image/*" multiple style={{ display: 'none' }}
          onChange={(e) => e.target.files && handleFiles(e.target.files)} />
      </div>

      <div className="admin-card">
        <div className="admin-card__toolbar">
          <h2 className="admin-card__title">Gallery ({images.length} images)</h2>
          <button
            className="admin-btn admin-btn--sm admin-btn--danger"
            disabled={deletingAll || images.length === 0}
            onClick={deleteAllImages}
          >
            {deletingAll ? 'Deleting…' : `Delete all${images.length ? ` ${images.length}` : ''}`}
          </button>
        </div>
        {loading ? <p className="admin-loading">Loading…</p> : (
          <div className="admin-gallery-grid">
            {images.map((img) => (
              <div key={img.id} className="admin-gallery-item">
                <img src={img.imageUrl} alt={img.title} />
                <div className="admin-gallery-item__overlay">
                  <span className="admin-badge">{img.category}</span>
                  <button className="admin-btn admin-btn--sm admin-btn--danger" onClick={() => remove(img.id)}>✕</button>
                </div>
              </div>
            ))}
            {images.length === 0 && <p className="admin-empty">No images yet.</p>}
          </div>
        )}
      </div>

      {/* ── Event Albums (by Year) — the "Milestones by Year" cards on
          /news-awards/gallery. Each album is one card: Title, Date, an
          optional cover image, and a Google Photos link used as the VIEW
          CTA. Managed per selected year. ── */}
      <div className="admin-card">
        <div className="admin-card__toolbar">
          <h2 className="admin-card__title">Event Albums — Milestones by Year</h2>
          <button
            className="admin-btn admin-btn--sm admin-btn--danger"
            disabled={deletingAllAlbums || albums.length === 0}
            onClick={deleteAllAlbums}
          >
            {deletingAllAlbums ? 'Deleting…' : `Delete all${albums.length ? ` ${albums.length}` : ''}`}
          </button>
        </div>
        <p className="admin-lead">
          These are the year-filtered cards on <code>/news-awards/gallery</code>. Pick a year, then add albums
          one at a time or paste a whole batch from a spreadsheet. The public page falls back to the built-in
          archive until at least one album exists here.
        </p>

        {albums.length === 0 && (
          <button className="admin-btn admin-btn--primary" style={{ marginBottom: '1rem' }} disabled={saving} onClick={seedStarter}>
            Add starter albums ({STATIC_ALBUMS.length} from the built-in archive)
          </button>
        )}

        {/* Year selector */}
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', alignItems: 'center', marginBottom: '1rem' }}>
          {years.length === 0 && <span className="admin-empty" style={{ margin: 0 }}>No years yet — add one →</span>}
          {years.map((y) => (
            <button
              key={y}
              type="button"
              className={`admin-btn admin-btn--sm${y === year ? ' admin-btn--primary' : ''}`}
              onClick={() => setActiveYear(y)}
            >
              {y} ({albums.filter((a) => a.year === y).length})
            </button>
          ))}
          <span style={{ display: 'inline-flex', gap: '0.35rem', alignItems: 'center' }}>
            <input
              type="number"
              value={newYear}
              onChange={(e) => setNewYear(e.target.value)}
              placeholder="2025"
              style={{ width: 90 }}
            />
            <button type="button" className="admin-btn admin-btn--sm" onClick={addYear}>+ Add year</button>
          </span>
        </div>

        {/* Add single */}
        <div className="admin-form-grid" style={{ alignItems: 'end' }}>
          <div className="admin-field">
            <label htmlFor="album-title">Title *</label>
            <input id="album-title" value={form.title} onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))} placeholder="TECHNOVA 2025 – Valedictory" />
          </div>
          <div className="admin-field">
            <label htmlFor="album-image">Image URL</label>
            <input id="album-image" value={form.imageUrl} onChange={(e) => setForm((p) => ({ ...p, imageUrl: e.target.value }))} placeholder="https://…/poster.jpg" />
          </div>
          <div className="admin-field">
            <label htmlFor="album-link">Google Photos Link</label>
            <input id="album-link" value={form.link} onChange={(e) => setForm((p) => ({ ...p, link: e.target.value }))} placeholder="https://photos.google.com/share/…" />
          </div>
          <div className="admin-field">
            <label htmlFor="album-date">Date</label>
            <input id="album-date" value={form.date} onChange={(e) => setForm((p) => ({ ...p, date: e.target.value }))} placeholder="March 8, 2025" />
          </div>
          <div className="admin-field">
            <button className="admin-btn admin-btn--primary" disabled={saving} onClick={addOne}>
              {saving ? 'Saving…' : `Add to ${year}`}
            </button>
          </div>
        </div>

        {/* Bulk import */}
        <details className="admin-accordion" open={bulkOpen} onToggle={(e) => setBulkOpen((e.target as HTMLDetailsElement).open)} style={{ marginTop: '1rem' }}>
          <summary className="admin-accordion__summary">Bulk import — auto-sorted by year</summary>
          <div style={{ padding: '0.75rem 0' }}>
            <p className="admin-lead" style={{ marginTop: 0 }}>
              Paste in any of these formats — the type is auto-detected:
              <br />• <strong>Tab-separated</strong> or <strong>CSV</strong>, one album per line:&nbsp;
              <code>Title, Image URL, Google Photos Link, Date, End Date</code>
              <br />• <strong>JSON</strong> array:&nbsp;
              <code>{'[{ "title": "…", "imageUrl": "…", "link": "…", "date": "…", "endDate": "…" }]'}</code>
              <br />Column order is positional, or matched by a header row (any order). Image URL, Link and End Date may be blank.
              <br /><strong>Each row files itself under the year in its Date</strong> (<code>Oct 15, 2025</code>, <code>Aug/23/2026</code>, ranges, or a bare year all work) — new years are created automatically. A row whose title already exists in that year <strong>updates</strong> that card instead of adding a duplicate. Rows with no year in the date fall back to {year}.
            </p>
            <textarea
              rows={8}
              value={bulkText}
              onChange={(e) => setBulkText(e.target.value)}
              placeholder={'"Celebrating the Legacy of Dr. B. V. Raju Garu","https://…/0J2A7183.jpg","https://photos.app.goo.gl/…","Oct 15, 2025","Oct 15, 2025"'}
              style={{ width: '100%', fontFamily: 'monospace', fontSize: '0.85rem' }}
            />
            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginTop: '0.5rem' }}>
              <button className="admin-btn admin-btn--primary" disabled={saving || !bulkText.trim()} onClick={importBulk}>
                {saving ? 'Importing…' : `Import ${parseBulk(bulkText).length} row${parseBulk(bulkText).length === 1 ? '' : 's'}`}
              </button>
              {importMsg && <span style={{ fontSize: '0.85rem', color: '#555' }}>{importMsg}</span>}
            </div>
          </div>
        </details>

        {/* Cards for the selected year */}
        <h3 style={{ margin: '1.5rem 0 0.75rem', fontSize: '0.95rem' }}>
          {year} — {yearAlbums.length} album{yearAlbums.length === 1 ? '' : 's'}
        </h3>
        {albumsLoading ? (
          <p className="admin-loading">Loading…</p>
        ) : yearAlbums.length === 0 ? (
          <p className="admin-empty">No albums for {year} yet.</p>
        ) : (
          <div className="admin-image-grid">
            {yearAlbums.map((a) => (
              <div key={a.id} className="admin-image-card">
                {a.imageUrl
                  ? <img src={a.imageUrl} alt={a.title} />
                  : <div className="admin-image-card__empty">No image</div>}
                <div className="admin-image-card__info">
                  <strong>{a.title}</strong>
                  {a.date && <span className="admin-badge admin-badge--sm admin-badge--gray" style={{ marginTop: 2, alignSelf: 'flex-start' }}>{a.date}</span>}
                  {a.link
                    ? <a href={a.link} target="_blank" rel="noopener noreferrer" style={{ fontSize: '0.8rem', marginTop: 4 }}>Open Google Photos ↗</a>
                    : <span style={{ fontSize: '0.8rem', color: '#b45', marginTop: 4 }}>No VIEW link</span>}
                </div>
                <div className="admin-image-card__actions">
                  <button className="admin-btn admin-btn--sm admin-btn--danger" onClick={() => removeAlbum(a.id)}>Delete</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
