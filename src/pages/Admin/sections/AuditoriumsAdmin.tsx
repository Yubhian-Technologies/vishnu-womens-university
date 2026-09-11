import { useEffect, useState } from 'react';
import { collection, addDoc, deleteDoc, doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../../lib/firebase';
import { useOrderedCollection } from '../../../hooks/useCollection';
import ImageUploader from '../../../components/ImageUploader/ImageUploader';
import type { UploadResult } from '../../../lib/storage';
import type { ContentBlockDoc } from './ContentBlocksAdmin';

// Auditoriums (src/pages/Campus/Auditoriums.tsx) is a bespoke Campus Life
// page — not the generic CampusLifeDetail.tsx template every other facility
// here uses — so it has no `campusLifeItems` doc of its own. Its body copy
// (everything below the hero banner: tagline/caption/screen text, the two
// tile rows, and the About section) lives in the same shared `contentBlocks`
// collection the generic "Page Content Blocks" admin screen used to expose
// for it (page: 'auditoriums' — same field mapping documented previously in
// CONTENT_BLOCK_SECTIONS, now removed from there in favor of this
// page-specific form living directly in Campus Life admin). The hero banner
// image/title and the photo gallery are unaffected — still Admin → Hero
// Banners / Admin → Website Photos, same as every other page.
const PAGE = 'auditoriums';

const DEFAULT_HERO_TAGLINE = 'Ideas · Events · People · Possibilities';
const DEFAULT_HERO_CAPTION = 'A Space for Every Big Idea';
const DEFAULT_HERO_SCREEN = 'Ideas\nInspire\nPeople';

const DEFAULT_TOP_FEATURES: Tile[] = [
  { title: 'Academic Events', desc: 'Seminars, lectures, conferences' },
  { title: 'Cultural Programmes', desc: 'Celebrations, performances' },
  { title: 'Student Activities', desc: 'Workshops, debates, discussions' },
  { title: 'Modern Facilities', desc: 'Audio-visual systems, projectors' },
];
const DEFAULT_BOTTOM_STATS: Tile[] = [
  { title: 'Multiple Venues', desc: 'Indoor, Open-Air, Mini-Auditorium, Seminar Halls' },
  { title: 'Up to 250', desc: 'Seating capacity (in Seminar Halls)' },
  { title: 'Modern AV Setup', desc: 'Projectors, sound systems, internet connectivity' },
  { title: 'Comfortable & Accessible', desc: 'Air-conditioned spaces with modern facilities' },
];

const DEFAULT_ABOUT_HEADING = "Auditoriums at Vishnu Women's University";
const DEFAULT_ABOUT_BODY = [
  "Vishnu Women's University houses an Indoor Auditorium, Open-Air Auditorium, Mini-Auditorium, and numerous Seminar Halls that support the cultural programmes, seminars, debates, plays, and other events held throughout the year — bringing students together to share, discuss, and explore knowledge in their areas of learning.",
  'The Smt. B. Seetha Indoor Auditorium is centrally air-conditioned, fully sound-proofed, and equipped with the latest technology for audio/video presentations. The Open-Air Auditorium and Mini-Auditorium host a wide variety of student activities, while the Seminar Halls provide flexible, well-equipped spaces for smaller academic and collaborative sessions.',
].join('\n');
const DEFAULT_ABOUT_QUOTE = 'More than just halls, our auditoriums bring people, ideas, and opportunities together.';
const DEFAULT_ABOUT_ATTRIBUTION = "Vishnu Women's University";
const DEFAULT_ABOUT_IMAGE = 'https://images.unsplash.com/photo-1519452575417-564c1401ecc0?w=900&q=80';

interface Tile { title: string; desc: string; }

// Runs `computeInitial` exactly once, the first time `loading` turns false —
// not on every snapshot — so the form starts out showing the page's real
// live content (or its defaults, if nothing's been saved yet) without a
// later Firestore delivery clobbering whatever the admin is mid-typing.
function useLoadedState<T>(loading: boolean, computeInitial: () => T) {
  const [state, setState] = useState<T>(computeInitial);
  const [initialized, setInitialized] = useState(false);
  useEffect(() => {
    if (!initialized && !loading) {
      setState(computeInitial());
      setInitialized(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading, initialized]);
  return [state, setState] as const;
}

export default function AuditoriumsAdmin() {
  const { docs: allBlocks, loading } = useOrderedCollection<ContentBlockDoc>('contentBlocks', 'order');
  const blocks = allBlocks.filter((b) => b.page === PAGE);
  const hero = blocks.find((b) => b.section === 'hero');
  const about = blocks.find((b) => b.section === 'about');
  const topFeatureDocs = blocks.filter((b) => b.section === 'topFeatures');
  const bottomStatDocs = blocks.filter((b) => b.section === 'bottomStats');

  const [heroForm, setHeroForm] = useLoadedState(loading, () => ({
    tagline: hero?.value || DEFAULT_HERO_TAGLINE,
    caption: hero?.title || DEFAULT_HERO_CAPTION,
    screenText: hero?.desc || DEFAULT_HERO_SCREEN,
  }));
  const [heroSaving, setHeroSaving] = useState(false);

  const [aboutForm, setAboutForm] = useLoadedState(loading, () => ({
    heading: about?.title || DEFAULT_ABOUT_HEADING,
    body: about?.desc || DEFAULT_ABOUT_BODY,
    quote: about?.value || DEFAULT_ABOUT_QUOTE,
    attribution: about?.icon || DEFAULT_ABOUT_ATTRIBUTION,
    imageUrl: about?.slug || DEFAULT_ABOUT_IMAGE,
    storagePath: about?.storagePath || '',
  }));
  const [aboutSaving, setAboutSaving] = useState(false);

  const [topTiles, setTopTiles] = useLoadedState(loading, () =>
    topFeatureDocs.length > 0 ? topFeatureDocs.map((d) => ({ title: d.title, desc: d.desc })) : DEFAULT_TOP_FEATURES
  );
  const [topSaving, setTopSaving] = useState(false);

  const [bottomTiles, setBottomTiles] = useLoadedState(loading, () =>
    bottomStatDocs.length > 0 ? bottomStatDocs.map((d) => ({ title: d.title, desc: d.desc })) : DEFAULT_BOTTOM_STATS
  );
  const [bottomSaving, setBottomSaving] = useState(false);

  const saveHero = async () => {
    setHeroSaving(true);
    try {
      const fields = { title: heroForm.caption, desc: heroForm.screenText, value: heroForm.tagline };
      if (hero) {
        await updateDoc(doc(db, 'contentBlocks', hero.id), fields);
      } else {
        await addDoc(collection(db, 'contentBlocks'), {
          page: PAGE, section: 'hero', icon: '', slug: '', storagePath: '', order: 0, ...fields, createdAt: serverTimestamp(),
        });
      }
    } catch (e) {
      alert(`Couldn't save: ${(e as Error).message}`);
    } finally {
      setHeroSaving(false);
    }
  };

  const handleAboutPhotoUploaded = (r: UploadResult) => setAboutForm((p) => ({ ...p, imageUrl: r.url, storagePath: r.path }));

  const saveAbout = async () => {
    setAboutSaving(true);
    try {
      const fields = {
        title: aboutForm.heading, desc: aboutForm.body, value: aboutForm.quote,
        icon: aboutForm.attribution, slug: aboutForm.imageUrl, storagePath: aboutForm.storagePath,
      };
      if (about) {
        await updateDoc(doc(db, 'contentBlocks', about.id), fields);
      } else {
        await addDoc(collection(db, 'contentBlocks'), {
          page: PAGE, section: 'about', order: 0, ...fields, createdAt: serverTimestamp(),
        });
      }
    } catch (e) {
      alert(`Couldn't save: ${(e as Error).message}`);
    } finally {
      setAboutSaving(false);
    }
  };

  // Bulk-saves a 4-tile row by position: overwrites each existing doc's
  // title/desc in place (so its `order` never changes), adds a doc for any
  // new tile beyond the existing count, and deletes any existing doc beyond
  // the new tile count — so removing tile #2 correctly shifts #3/#4's
  // content into the remaining docs rather than leaving a gap.
  const saveTiles = async (section: string, existingDocs: ContentBlockDoc[], tiles: Tile[], setSaving: (v: boolean) => void) => {
    setSaving(true);
    try {
      await Promise.all([
        ...tiles.map((t, i) => {
          const existing = existingDocs[i];
          return existing
            ? updateDoc(doc(db, 'contentBlocks', existing.id), { title: t.title, desc: t.desc })
            : addDoc(collection(db, 'contentBlocks'), {
                page: PAGE, section, value: '', title: t.title, desc: t.desc, icon: '', slug: '', storagePath: '',
                order: i, createdAt: serverTimestamp(),
              });
        }),
        ...existingDocs.slice(tiles.length).map((d) => deleteDoc(doc(db, 'contentBlocks', d.id))),
      ]);
    } catch (e) {
      alert(`Couldn't save: ${(e as Error).message}`);
    } finally {
      setSaving(false);
    }
  };

  const updateTile = (tiles: Tile[], setTiles: (t: Tile[]) => void, i: number, field: keyof Tile, value: string) => {
    setTiles(tiles.map((t, j) => (j === i ? { ...t, [field]: value } : t)));
  };

  const renderTileList = (label: string, tiles: Tile[], setTiles: (t: Tile[]) => void) => (
    <>
      {tiles.map((t, i) => (
        <div key={i} className="admin-form-grid" style={{ gridTemplateColumns: '1fr 1fr auto', alignItems: 'end', marginBottom: '0.6rem' }}>
          <div className="admin-field">
            <label>Title</label>
            <input value={t.title} onChange={(e) => updateTile(tiles, setTiles, i, 'title', e.target.value)} placeholder="e.g. Academic Events" />
          </div>
          <div className="admin-field">
            <label>Sub-text</label>
            <input value={t.desc} onChange={(e) => updateTile(tiles, setTiles, i, 'desc', e.target.value)} placeholder="e.g. Seminars, lectures, conferences" />
          </div>
          <button type="button" className="admin-btn admin-btn--sm admin-btn--danger" onClick={() => setTiles(tiles.filter((_, j) => j !== i))}>
            Remove
          </button>
        </div>
      ))}
      <button type="button" className="admin-btn admin-btn--sm" onClick={() => setTiles([...tiles, { title: '', desc: '' }])}>
        + Add {label} Tile
      </button>
    </>
  );

  return (
    <div className="admin-card">
      <h2 className="admin-card__title">Auditoriums — Page Body</h2>
      <p className="admin-field__hint">
        Auditoriums (<code>/campus/auditoriums</code>) is a bespoke page with its own layout, so its body content is
        edited right here instead of the generic Page Content Blocks screen. Its hero banner image/title and photo
        gallery are still managed from Admin → Hero Banners and Admin → Website Photos respectively.
      </p>

      {loading ? <p className="admin-loading">Loading…</p> : (
        <>
          <hr />
          <h3>Hero Extra Text</h3>
          <div className="admin-form-grid">
            <div className="admin-field">
              <label htmlFor="field-aud-tagline">Tagline (separate words with " · ")</label>
              <input id="field-aud-tagline" value={heroForm.tagline} onChange={(e) => setHeroForm((p) => ({ ...p, tagline: e.target.value }))} placeholder="Ideas · Events · People · Possibilities" />
            </div>
            <div className="admin-field">
              <label htmlFor="field-aud-caption">Corner Caption</label>
              <input id="field-aud-caption" value={heroForm.caption} onChange={(e) => setHeroForm((p) => ({ ...p, caption: e.target.value }))} placeholder="A Space for Every Big Idea" />
            </div>
            <div className="admin-field admin-field--full">
              <label htmlFor="field-aud-screen">Screen Overlay Text (one line each)</label>
              <textarea id="field-aud-screen" rows={3} value={heroForm.screenText} onChange={(e) => setHeroForm((p) => ({ ...p, screenText: e.target.value }))} placeholder={'Ideas\nInspire\nPeople'} />
            </div>
          </div>
          <div className="admin-form-actions">
            <button className="admin-btn admin-btn--primary" onClick={saveHero} disabled={heroSaving}>
              {heroSaving ? 'Saving…' : 'Save Hero Extra Text'}
            </button>
          </div>

          <hr />
          <h3>Top Feature Tiles</h3>
          <p className="admin-field__hint">The tiles shown just below the hero.</p>
          {renderTileList('Top Feature', topTiles, setTopTiles)}
          <div className="admin-form-actions">
            <button className="admin-btn admin-btn--primary" onClick={() => saveTiles('topFeatures', topFeatureDocs, topTiles, setTopSaving)} disabled={topSaving}>
              {topSaving ? 'Saving…' : 'Save Top Feature Tiles'}
            </button>
          </div>

          <hr />
          <h3>About Section</h3>
          <div className="admin-form-grid">
            <div className="admin-field admin-field--full">
              <label htmlFor="field-aud-about-heading">Heading</label>
              <input id="field-aud-about-heading" value={aboutForm.heading} onChange={(e) => setAboutForm((p) => ({ ...p, heading: e.target.value }))} />
            </div>
            <div className="admin-field admin-field--full">
              <label htmlFor="field-aud-about-body">Body Paragraphs (one per line)</label>
              <textarea id="field-aud-about-body" rows={5} value={aboutForm.body} onChange={(e) => setAboutForm((p) => ({ ...p, body: e.target.value }))} />
            </div>
            <div className="admin-field admin-field--full">
              <label htmlFor="field-aud-about-quote">Pull-Quote</label>
              <textarea id="field-aud-about-quote" rows={2} value={aboutForm.quote} onChange={(e) => setAboutForm((p) => ({ ...p, quote: e.target.value }))} />
            </div>
            <div className="admin-field">
              <label htmlFor="field-aud-about-attribution">Quote Attribution</label>
              <input id="field-aud-about-attribution" value={aboutForm.attribution} onChange={(e) => setAboutForm((p) => ({ ...p, attribution: e.target.value }))} />
            </div>
            <div className="admin-field">
              <label>Side Photo</label>
              <ImageUploader folder="vwu/campus-life/auditoriums" currentUrl={aboutForm.imageUrl} onUploaded={handleAboutPhotoUploaded} label="Upload Side Photo" aspect={4 / 3} />
            </div>
          </div>
          <div className="admin-form-actions">
            <button className="admin-btn admin-btn--primary" onClick={saveAbout} disabled={aboutSaving}>
              {aboutSaving ? 'Saving…' : 'Save About Section'}
            </button>
          </div>

          <hr />
          <h3>Bottom Stat Tiles</h3>
          <p className="admin-field__hint">The tiles shown just below the About section.</p>
          {renderTileList('Bottom Stat', bottomTiles, setBottomTiles)}
          <div className="admin-form-actions">
            <button className="admin-btn admin-btn--primary" onClick={() => saveTiles('bottomStats', bottomStatDocs, bottomTiles, setBottomSaving)} disabled={bottomSaving}>
              {bottomSaving ? 'Saving…' : 'Save Bottom Stat Tiles'}
            </button>
          </div>
        </>
      )}
    </div>
  );
}
