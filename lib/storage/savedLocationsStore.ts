const STORAGE_KEY = "weatherwise:saved-locations";
const DEFAULT_KEY = "weatherwise:default-location";

/** Seed a couple of cities so the dashboard reads as populated on first visit. */
const SEED_LOCATIONS = ["philadelphia", "orlando"];
const SEED_DEFAULT = "philadelphia";

export interface SavedLocationsState {
  slugs: string[];
  defaultSlug: string | undefined;
}

const SERVER_SNAPSHOT: SavedLocationsState = { slugs: [], defaultSlug: undefined };

let cachedSnapshot: SavedLocationsState | null = null;
const listeners = new Set<() => void>();

function isBrowser() {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

function readFromStorage(): SavedLocationsState {
  try {
    const rawSlugs = window.localStorage.getItem(STORAGE_KEY);
    const rawDefault = window.localStorage.getItem(DEFAULT_KEY);
    if (rawSlugs === null) {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(SEED_LOCATIONS));
      window.localStorage.setItem(DEFAULT_KEY, SEED_DEFAULT);
      return { slugs: SEED_LOCATIONS, defaultSlug: SEED_DEFAULT };
    }
    const slugs: string[] = JSON.parse(rawSlugs);
    return { slugs, defaultSlug: rawDefault ?? slugs[0] };
  } catch {
    return { slugs: [], defaultSlug: undefined };
  }
}

function writeToStorage(state: SavedLocationsState) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state.slugs));
  if (state.defaultSlug) {
    window.localStorage.setItem(DEFAULT_KEY, state.defaultSlug);
  } else {
    window.localStorage.removeItem(DEFAULT_KEY);
  }
}

function emitChange() {
  cachedSnapshot = null;
  listeners.forEach((listener) => listener());
}

export function getSnapshot(): SavedLocationsState {
  if (!isBrowser()) return SERVER_SNAPSHOT;
  if (!cachedSnapshot) cachedSnapshot = readFromStorage();
  return cachedSnapshot;
}

export function getServerSnapshot(): SavedLocationsState {
  return SERVER_SNAPSHOT;
}

export function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  window.addEventListener("storage", emitChange);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", emitChange);
  };
}

export function addLocation(slug: string) {
  const current = getSnapshot();
  if (current.slugs.includes(slug)) return;
  writeToStorage({ slugs: [...current.slugs, slug], defaultSlug: current.defaultSlug ?? slug });
  emitChange();
}

export function removeLocation(slug: string) {
  const current = getSnapshot();
  const slugs = current.slugs.filter((s) => s !== slug);
  writeToStorage({ slugs, defaultSlug: current.defaultSlug === slug ? slugs[0] : current.defaultSlug });
  emitChange();
}

export function setDefaultLocation(slug: string) {
  const current = getSnapshot();
  if (!current.slugs.includes(slug)) return;
  writeToStorage({ ...current, defaultSlug: slug });
  emitChange();
}

export const IS_SERVER_SNAPSHOT = SERVER_SNAPSHOT;
