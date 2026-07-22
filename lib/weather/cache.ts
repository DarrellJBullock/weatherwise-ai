import type { WeatherSnapshot } from "./types";

const CACHE_PREFIX = "weatherwise:cache:";
const STALE_AFTER_MS = 30 * 60 * 1000;

export interface CachedSnapshot {
  snapshot: WeatherSnapshot;
  cachedAt: string;
  isStale: boolean;
}

function isBrowser(): boolean {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

export function cacheSnapshot(slug: string, snapshot: WeatherSnapshot): void {
  if (!isBrowser()) return;
  try {
    window.localStorage.setItem(
      `${CACHE_PREFIX}${slug}`,
      JSON.stringify({ snapshot, cachedAt: new Date().toISOString() }),
    );
  } catch {
    // Storage full or unavailable (private browsing) — fail silently, cache is best-effort.
  }
}

export function readCachedSnapshot(slug: string): CachedSnapshot | undefined {
  if (!isBrowser()) return undefined;
  try {
    const raw = window.localStorage.getItem(`${CACHE_PREFIX}${slug}`);
    if (!raw) return undefined;
    const parsed = JSON.parse(raw) as { snapshot: WeatherSnapshot; cachedAt: string };
    const age = Date.now() - new Date(parsed.cachedAt).getTime();
    return { ...parsed, isStale: age > STALE_AFTER_MS };
  } catch {
    return undefined;
  }
}

export function clearCachedSnapshot(slug: string): void {
  if (!isBrowser()) return;
  window.localStorage.removeItem(`${CACHE_PREFIX}${slug}`);
}

export function listCachedSlugs(): string[] {
  if (!isBrowser()) return [];
  const slugs: string[] = [];
  for (let i = 0; i < window.localStorage.length; i++) {
    const key = window.localStorage.key(i);
    if (key?.startsWith(CACHE_PREFIX)) slugs.push(key.slice(CACHE_PREFIX.length));
  }
  return slugs;
}
