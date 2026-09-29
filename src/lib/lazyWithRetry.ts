import { lazy } from 'react';
import type { ComponentType } from 'react';

// A failed dynamic import() is almost always a stale chunk after a new deploy:
// the previous build's hashed filenames 404, and React surfaces that inside
// <Suspense> as a blank white page that only a manual refresh clears. Here we
// do that refresh automatically — one hard reload pulls a fresh index.html
// with current hashes.
// Both attempts are also time-bounded: a chunk request that neither resolves
// nor rejects (stalled network, stuck service worker) would otherwise leave
// the route transition pending forever — the same "must hard-refresh" symptom.
// A timeout turns that hang into an ordinary failure, flowing into the
// retry → reload path below.
function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  return Promise.race([
    promise,
    new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error('Dynamic import timed out')), ms),
    ),
  ]);
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function lazyWithRetry<T extends ComponentType<any>>(factory: () => Promise<{ default: T }>) {
  return lazy(async () => {
    try {
      return await withTimeout(factory(), 20000);
    } catch (err) {
      console.warn('Lazy chunk import failed or timed out, retrying...', err);
      try {
        await new Promise((r) => setTimeout(r, 200));
        return await withTimeout(factory(), 20000);
      } catch (retryErr) {
        console.error('Lazy chunk import failed twice, auto-reloading page:', retryErr);
        window.location.reload();
        return new Promise<{ default: T }>(() => {});
      }
    }
  });
}
