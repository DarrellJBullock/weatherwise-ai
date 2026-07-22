import { clearCachedSnapshot, listCachedSlugs, readCachedSnapshot } from "@/lib/weather/cache";

export interface CachedEntry {
  slug: string;
  name: string;
  cachedAt: string;
}

const SERVER_SNAPSHOT: CachedEntry[] = [];

let cachedSnapshot: CachedEntry[] | null = null;
const listeners = new Set<() => void>();

function computeEntries(): CachedEntry[] {
  return listCachedSlugs()
    .map((slug) => {
      const entry = readCachedSnapshot(slug);
      return entry ? { slug, name: entry.snapshot.location.name, cachedAt: entry.cachedAt } : undefined;
    })
    .filter((e): e is CachedEntry => Boolean(e));
}

export function getSnapshot(): CachedEntry[] {
  if (typeof window === "undefined") return SERVER_SNAPSHOT;
  if (!cachedSnapshot) cachedSnapshot = computeEntries();
  return cachedSnapshot;
}

export function getServerSnapshot(): CachedEntry[] {
  return SERVER_SNAPSHOT;
}

export function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function clearAll() {
  getSnapshot().forEach((entry) => clearCachedSnapshot(entry.slug));
  cachedSnapshot = null;
  listeners.forEach((listener) => listener());
}
