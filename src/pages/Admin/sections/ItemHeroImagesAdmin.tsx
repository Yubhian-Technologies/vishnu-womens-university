import { useState } from 'react';
import { addDoc, collection, doc, serverTimestamp, updateDoc } from 'firebase/firestore';
import { db } from '../../../lib/firebase';
import { useCollection, useOrderedCollection, type WithId } from '../../../hooks/useCollection';
import { useImageCropModal } from '../../../components/ImageUploader/useImageCropModal';
import { deleteFile, type UploadResult } from '../../../lib/storage';

interface CategoryDef {
  value: string;
  label: string;
}

interface BannerDoc extends WithId {
  page: string;
  imageUrl: string;
  storagePath: string;
}

interface Props {
  collectionName: string;
  orderByField: string;
  imageField: string;
  storagePathField: string;
  folder: string;
  getLabel: (doc: WithId) => string;
  getSubLabel?: (doc: WithId) => string;
  emptyMessage: string;
  /** When given (with getCategoryValue), items are shown one category at a
   *  time — a first screen of just category names, matching the same
   *  drill-down pattern as the Page Banners tab, instead of dumping every
   *  item in the collection into one flat grid at once. */
  categories?: CategoryDef[];
  getCategoryValue?: (doc: WithId) => string;
  /** For the rare item whose live hero image is actually a shared Page
   *  Banner rather than this collection's own field (e.g. Governing Body,
   *  which has its own dedicated page reading banners/page="governing-body")
   *  — return that page slug and the card reads/writes the banners
   *  collection instead, so it still works directly from this grid. */
  getBannerPageOverride?: (doc: WithId) => string | null;
}

/**
 * Generic "one row per Firestore doc, click to replace its hero image"
 * grid — reused across Programs, Governance Items, Placement Items,
 * Differentiators, and Research Items so every per-item hero image on the
 * site is editable from one place (Hero Banners admin) instead of being
 * scattered across five different admin sections. Writes straight to the
 * item's own doc/fields (passed in as props), same collection each item's
 * public detail page already reads from — no separate banner record needed,
 * except for the rare getBannerPageOverride case above.
 */
export default function ItemHeroImagesAdmin({
  collectionName, orderByField, imageField, storagePathField, folder,
  getLabel, getSubLabel, emptyMessage, categories, getCategoryValue, getBannerPageOverride,
}: Props) {
  const { docs: items, loading } = useOrderedCollection<WithId>(collectionName, orderByField);
  // Only ever needed for the odd item using getBannerPageOverride, but hooks
  // can't be conditional — this is the same small (~70-doc) "banners"
  // collection already subscribed to elsewhere in this admin section.
  const { docs: pageBanners } = useCollection<BannerDoc>('banners');
  const { openCrop, cropModal } = useImageCropModal();
  const [uploadingId, setUploadingId] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const changeImage = (item: WithId, file: File, bannerPage: string | null) => {
    setUploadingId(item.id);
    const uploadFolder = bannerPage ? `vwu/banners/${bannerPage}` : folder;
    openCrop(file, uploadFolder, async (result: UploadResult) => {
      try {
        if (bannerPage) {
          const existing = pageBanners.find((b) => b.page === bannerPage);
          const prevPath = existing?.storagePath;
          if (existing) {
            await updateDoc(doc(db, 'banners', existing.id), { imageUrl: result.url, storagePath: result.path });
          } else {
            await addDoc(collection(db, 'banners'), {
              page: bannerPage, title: getLabel(item), subtitle: '', ctaLabel: '', ctaLink: '',
              order: 0, imageUrl: result.url, storagePath: result.path, createdAt: serverTimestamp(),
            });
          }
          if (prevPath) await deleteFile(prevPath);
        } else {
          const prevPath = item[storagePathField] as string | undefined;
          await updateDoc(doc(db, collectionName, item.id), {
            [imageField]: result.url,
            [storagePathField]: result.path,
          });
          if (prevPath) await deleteFile(prevPath);
        }
      } catch (e) {
        alert(`Couldn't update image: ${(e as Error).message}`);
      } finally {
        setUploadingId(null);
      }
    });
  };

  if (loading) {
    return <div className="admin-card"><p className="admin-loading">Loading…</p></div>;
  }
  if (items.length === 0) {
    return <div className="admin-card"><p className="admin-empty">{emptyMessage}</p></div>;
  }

  // First screen: just the category names (with a count each) — nothing
  // else — when this collection has categories and none is picked yet.
  if (categories && getCategoryValue && !selectedCategory) {
    return (
      <div className="admin-card">
        <h2 className="admin-card__title">Choose a category</h2>
        <div className="admin-page-selector__grid">
          {categories.map((c) => {
            const count = items.filter((it) => getCategoryValue(it) === c.value).length;
            return (
              <button
                key={c.value}
                type="button"
                className="admin-page-btn"
                onClick={() => setSelectedCategory(c.value)}
              >
                {c.label} ({count})
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  const visibleItems = categories && getCategoryValue && selectedCategory
    ? items.filter((it) => getCategoryValue(it) === selectedCategory)
    : items;
  const categoryLabel = categories?.find((c) => c.value === selectedCategory)?.label;

  return (
    <div className="admin-card">
      {categories && (
        <button type="button" className="admin-btn admin-btn--ghost admin-btn--sm" style={{ marginBottom: '1rem' }} onClick={() => setSelectedCategory(null)}>
          ← All Categories
        </button>
      )}
      <h2 className="admin-card__title">{categoryLabel ?? 'All items'} ({visibleItems.length})</h2>
      <div className="admin-image-grid">
        {visibleItems.map((item) => {
          const bannerPage = getBannerPageOverride?.(item) ?? null;
          const imageUrl = bannerPage
            ? pageBanners.find((b) => b.page === bannerPage)?.imageUrl
            : (item[imageField] as string | undefined);
          return (
            <div key={item.id} className="admin-image-card">
              {imageUrl ? (
                <img src={imageUrl} alt={getLabel(item)} />
              ) : (
                <div className="admin-image-card__empty">No image set</div>
              )}
              <div className="admin-image-card__info">
                <strong>{getLabel(item)}</strong>
                {getSubLabel && (
                  <span className="admin-badge admin-badge--sm" style={{ marginTop: 2, alignSelf: 'flex-start' }}>
                    {getSubLabel(item)}
                  </span>
                )}
                {bannerPage && (
                  <span className="admin-badge admin-badge--sm admin-badge--gray" style={{ marginTop: 2, alignSelf: 'flex-start' }}>
                    Shared page banner
                  </span>
                )}
              </div>
              <div className="admin-image-card__actions">
                <label className="admin-btn admin-btn--sm" style={{ opacity: uploadingId !== null ? 0.5 : 1 }}>
                  {uploadingId === item.id ? 'Uploading…' : imageUrl ? 'Change Image' : 'Add Image'}
                  <input
                    type="file"
                    accept="image/*"
                    hidden
                    disabled={uploadingId !== null}
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) changeImage(item, file, bannerPage);
                      e.target.value = '';
                    }}
                  />
                </label>
              </div>
            </div>
          );
        })}
      </div>
      {cropModal}
    </div>
  );
}
