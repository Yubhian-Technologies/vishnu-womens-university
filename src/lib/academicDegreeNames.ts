/** Ensure "B.Tech" / "M.Tech" always carry the trailing dot in displayed copy.
    Idempotent — forms that already have the dot (or aren't at a word boundary)
    are left untouched. */
export const dotTech = (s: string) => (s || '').replace(/\b([BM]\.Tech)(?!\.)/g, '$1.');