"use client";

import { useEffect, useState } from "react";
import { MapPin } from "lucide-react";
import { useSavedLocations } from "@/hooks/useSavedLocations";
import type { WeatherSnapshot } from "@/lib/weather/types";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { EmptyState } from "@/components/ui/EmptyState";
import { SavedLocationCard } from "./SavedLocationCard";
import { LocationSearch } from "./LocationSearch";

export function LocationsPageContent() {
  const { savedSlugs, defaultSlug, removeLocation, setDefaultLocation, isHydrated } = useSavedLocations();
  const [snapshots, setSnapshots] = useState<Record<string, WeatherSnapshot>>({});

  useEffect(() => {
    if (!isHydrated || savedSlugs.length === 0) return;
    let cancelled = false;
    Promise.all(
      savedSlugs.map((slug) =>
        fetch(`/api/weather?location=${slug}`)
          .then((res) => (res.ok ? (res.json() as Promise<WeatherSnapshot>) : null))
          .catch(() => null),
      ),
    ).then((results) => {
      if (cancelled) return;
      const next: Record<string, WeatherSnapshot> = {};
      results.forEach((snap) => {
        if (snap) next[snap.location.slug] = snap;
      });
      setSnapshots(next);
    });
    return () => {
      cancelled = true;
    };
  }, [savedSlugs, isHydrated]);

  return (
    <div className="flex flex-col gap-8 py-2">
      <section aria-label="Saved locations">
        <SectionHeader
          title="Saved Locations"
          description={isHydrated ? `${savedSlugs.length} tracked` : undefined}
        />
        {isHydrated && savedSlugs.length === 0 ? (
          <EmptyState
            icon={<MapPin className="size-6" aria-hidden="true" />}
            title="No saved locations yet"
            description="Search for a city below and add it to start tracking its forecast and alerts."
          />
        ) : (
          <ul className="flex flex-col gap-2">
            {savedSlugs.map((slug) => (
              <li key={slug}>
                <SavedLocationCard
                  slug={slug}
                  snapshot={snapshots[slug]}
                  isDefault={slug === defaultSlug}
                  onRemove={removeLocation}
                  onSetDefault={setDefaultLocation}
                />
              </li>
            ))}
          </ul>
        )}
      </section>

      <section aria-label="Add a location">
        <SectionHeader title="Add a Location" description="Search WeatherWise AI's tracked cities" />
        <LocationSearch />
      </section>
    </div>
  );
}
