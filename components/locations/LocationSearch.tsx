"use client";

import { useMemo, useState } from "react";
import { Check, Plus, Search } from "lucide-react";
import { getAllLocations } from "@/lib/weather/mockWeatherProvider";
import { useSavedLocations } from "@/hooks/useSavedLocations";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";

const ALL_LOCATIONS = getAllLocations();

export function LocationSearch() {
  const [query, setQuery] = useState("");
  const { savedSlugs, addLocation, isHydrated } = useSavedLocations();

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return ALL_LOCATIONS;
    return ALL_LOCATIONS.filter(
      (loc) => loc.name.toLowerCase().includes(q) || loc.region.toLowerCase().includes(q),
    );
  }, [query]);

  return (
    <div className="flex flex-col gap-3">
      <label htmlFor="location-search" className="sr-only">
        Search for a city to add
      </label>
      <div className="relative">
        <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-(--color-text-muted)" aria-hidden="true" />
        <input
          id="location-search"
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search Philadelphia, Orlando, Seattle…"
          className="glass-panel w-full rounded-full py-2.5 pr-4 pl-9 text-sm text-(--color-text-primary) placeholder:text-(--color-text-muted) focus:outline-none focus-visible:border-(--color-accent-cyan)"
        />
      </div>

      {results.length === 0 ? (
        <EmptyState title="No matching cities" description="Try a different city or state abbreviation." />
      ) : (
        <ul className="flex flex-col gap-1.5">
          {results.map((loc) => {
            const saved = isHydrated && savedSlugs.includes(loc.slug);
            return (
              <li
                key={loc.slug}
                className="flex items-center justify-between gap-3 rounded-xl bg-white/4 px-3 py-2.5"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-(--color-text-primary)">{loc.name}</p>
                  <p className="text-xs text-(--color-text-muted)">
                    {loc.region}, {loc.country}
                  </p>
                </div>
                <Button
                  type="button"
                  size="sm"
                  variant={saved ? "secondary" : "primary"}
                  disabled={saved}
                  onClick={() => addLocation(loc.slug)}
                  aria-label={saved ? `${loc.name} already saved` : `Add ${loc.name}`}
                >
                  {saved ? <Check className="size-3.5" aria-hidden="true" /> : <Plus className="size-3.5" aria-hidden="true" />}
                  {saved ? "Saved" : "Add"}
                </Button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
