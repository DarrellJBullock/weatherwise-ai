"use client";

import { useEffect, useMemo, useState } from "react";
import { Check, Loader2, Plus, Search } from "lucide-react";
import { getAllLocations } from "@/lib/weather/mockWeatherProvider";
import { useSavedLocations } from "@/hooks/useSavedLocations";
import type { LocationInfo } from "@/lib/weather/types";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { SectionHeader } from "@/components/ui/SectionHeader";

const ALL_LOCATIONS = getAllLocations();
const MIN_SEARCH_LENGTH = 2;
const DEBOUNCE_MS = 350;

function LocationRow({
  location,
  saved,
  onAdd,
}: {
  location: LocationInfo;
  saved: boolean;
  onAdd: (slug: string) => void;
}) {
  return (
    <li className="flex items-center justify-between gap-3 rounded-xl bg-white/4 px-3 py-2.5">
      <div className="min-w-0">
        <p className="truncate text-sm font-medium text-(--color-text-primary)">{location.name}</p>
        <p className="text-xs text-(--color-text-muted)">
          {[location.region, location.country].filter(Boolean).join(", ") || "—"}
        </p>
      </div>
      <Button
        type="button"
        size="sm"
        variant={saved ? "secondary" : "primary"}
        disabled={saved}
        onClick={() => onAdd(location.slug)}
        aria-label={saved ? `${location.name} already saved` : `Add ${location.name}`}
      >
        {saved ? <Check className="size-3.5" aria-hidden="true" /> : <Plus className="size-3.5" aria-hidden="true" />}
        {saved ? "Saved" : "Add"}
      </Button>
    </li>
  );
}

export function LocationSearch() {
  const [query, setQuery] = useState("");
  const [searchResults, setSearchResults] = useState<LocationInfo[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchFailed, setSearchFailed] = useState(false);
  const { savedSlugs, addLocation, isHydrated } = useSavedLocations();

  const trimmedQuery = query.trim();

  const curatedMatches = useMemo(() => {
    const q = trimmedQuery.toLowerCase();
    if (!q) return ALL_LOCATIONS;
    return ALL_LOCATIONS.filter(
      (loc) => loc.name.toLowerCase().includes(q) || loc.region.toLowerCase().includes(q),
    );
  }, [trimmedQuery]);

  useEffect(() => {
    if (trimmedQuery.length < MIN_SEARCH_LENGTH) return;

    let cancelled = false;
    const timeoutId = setTimeout(async () => {
      setIsSearching(true);
      setSearchFailed(false);
      try {
        const res = await fetch(`/api/geocode?q=${encodeURIComponent(trimmedQuery)}`);
        if (!res.ok) throw new Error(`Geocoding failed (${res.status})`);
        const data: { results: LocationInfo[] } = await res.json();
        if (!cancelled) setSearchResults(data.results);
      } catch {
        if (!cancelled) {
          setSearchResults([]);
          setSearchFailed(true);
        }
      } finally {
        if (!cancelled) setIsSearching(false);
      }
    }, DEBOUNCE_MS);

    return () => {
      cancelled = true;
      clearTimeout(timeoutId);
    };
  }, [trimmedQuery]);

  const showSearchResults = trimmedQuery.length >= MIN_SEARCH_LENGTH;
  const activeSearchResults = showSearchResults ? searchResults : [];
  const hasAnyResults = curatedMatches.length > 0 || activeSearchResults.length > 0;

  return (
    <div className="flex flex-col gap-4">
      <div>
        <label htmlFor="location-search" className="sr-only">
          Search for any city to add
        </label>
        <div className="relative">
          <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-(--color-text-muted)" aria-hidden="true" />
          <input
            id="location-search"
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search any city — Austin, Tokyo, London…"
            className="glass-panel w-full rounded-full py-2.5 pr-4 pl-9 text-sm text-(--color-text-primary) placeholder:text-(--color-text-muted) focus:outline-none focus-visible:border-(--color-accent-cyan)"
          />
        </div>
        <p className="mt-1.5 px-1 text-[11px] text-(--color-text-muted)">
          City lookup via Open-Meteo&apos;s free geocoding API. Forecasts for cities outside the tracked roster are
          modeled from latitude and season, not live data.
        </p>
      </div>

      {!hasAnyResults && !isSearching ? (
        <EmptyState title="No matching cities" description="Try a different spelling or a nearby major city." />
      ) : (
        <>
          {curatedMatches.length > 0 && (
            <div>
              {trimmedQuery && <SectionHeader as="h3" title="Tracked Cities" className="mb-1.5" />}
              <ul className="flex flex-col gap-1.5">
                {curatedMatches.map((loc) => (
                  <LocationRow
                    key={loc.slug}
                    location={loc}
                    saved={isHydrated && savedSlugs.includes(loc.slug)}
                    onAdd={addLocation}
                  />
                ))}
              </ul>
            </div>
          )}

          {showSearchResults && (
            <div>
              <SectionHeader as="h3" title="Search Results" className="mb-1.5" />
              {isSearching ? (
                <p className="flex items-center gap-2 px-1 text-xs text-(--color-text-muted)">
                  <Loader2 className="size-3.5 animate-spin" aria-hidden="true" />
                  Searching…
                </p>
              ) : searchFailed ? (
                <p className="px-1 text-xs text-(--color-accent-amber)">
                  City search is temporarily unavailable. Try again in a moment.
                </p>
              ) : activeSearchResults.length === 0 ? (
                <p className="px-1 text-xs text-(--color-text-muted)">No matches beyond the tracked cities above.</p>
              ) : (
                <ul className="flex flex-col gap-1.5">
                  {activeSearchResults.map((loc) => (
                    <LocationRow
                      key={loc.slug}
                      location={loc}
                      saved={isHydrated && savedSlugs.includes(loc.slug)}
                      onAdd={addLocation}
                    />
                  ))}
                </ul>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}
