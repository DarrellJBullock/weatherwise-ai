"use client";

import { useCallback, useSyncExternalStore } from "react";
import * as store from "@/lib/storage/savedLocationsStore";

export function useSavedLocations() {
  const state = useSyncExternalStore(store.subscribe, store.getSnapshot, store.getServerSnapshot);
  const isHydrated = state !== store.IS_SERVER_SNAPSHOT;

  const addLocation = useCallback((slug: string) => store.addLocation(slug), []);
  const removeLocation = useCallback((slug: string) => store.removeLocation(slug), []);
  const setDefaultLocation = useCallback((slug: string) => store.setDefaultLocation(slug), []);
  const isSaved = useCallback((slug: string) => state.slugs.includes(slug), [state.slugs]);

  return {
    savedSlugs: state.slugs,
    defaultSlug: state.defaultSlug,
    isHydrated,
    addLocation,
    removeLocation,
    setDefaultLocation,
    isSaved,
  };
}
