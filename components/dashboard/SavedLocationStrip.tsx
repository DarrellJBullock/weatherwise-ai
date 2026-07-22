"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Plus, Star } from "lucide-react";
import { useSavedLocations } from "@/hooks/useSavedLocations";
import type { WeatherSnapshot } from "@/lib/weather/types";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Skeleton } from "@/components/ui/Skeleton";
import { WeatherIcon } from "./WeatherIcon";
import { cn } from "@/lib/utils";

export function SavedLocationStrip() {
  const { savedSlugs, defaultSlug, isHydrated } = useSavedLocations();
  const [snapshots, setSnapshots] = useState<Record<string, WeatherSnapshot>>({});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!isHydrated || savedSlugs.length === 0) return;
    let cancelled = false;

    async function load() {
      setIsLoading(true);
      const results = await Promise.all(
        savedSlugs.map((slug) =>
          fetch(`/api/weather?location=${slug}`)
            .then((res) => (res.ok ? (res.json() as Promise<WeatherSnapshot>) : null))
            .catch(() => null),
        ),
      );
      if (cancelled) return;
      const next: Record<string, WeatherSnapshot> = {};
      results.forEach((snap) => {
        if (snap) next[snap.location.slug] = snap;
      });
      setSnapshots(next);
      setIsLoading(false);
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [savedSlugs, isHydrated]);

  if (isHydrated && savedSlugs.length === 0) return null;

  return (
    <section aria-label="Saved locations">
      <SectionHeader
        title="Saved Locations"
        action={
          <Link
            href="/locations"
            className="flex items-center gap-1 text-xs font-medium text-(--color-accent-cyan) hover:underline"
          >
            <Plus className="size-3.5" aria-hidden="true" />
            Add
          </Link>
        }
      />
      <ul className="flex gap-2 overflow-x-auto pb-1">
        {(isLoading || !isHydrated ? savedSlugs.length ? savedSlugs : [1, 2] : savedSlugs).map((slug, i) => {
          const snap = typeof slug === "string" ? snapshots[slug] : undefined;
          if (isLoading || !isHydrated || !snap) {
            return <Skeleton key={typeof slug === "string" ? slug : i} className="h-16 w-32 shrink-0 rounded-xl" />;
          }
          const hasAlert = snap.alerts.length > 0;
          return (
            <li key={slug}>
              <Link
                href={`/location/${slug}`}
                className={cn(
                  "glass-panel flex w-32 shrink-0 flex-col gap-1 rounded-xl px-3 py-2.5 transition-colors hover:border-(--color-accent-cyan)/50",
                  hasAlert && "border-(--color-accent-red)/40",
                )}
              >
                <div className="flex items-center justify-between gap-1">
                  <span className="truncate text-xs font-medium text-(--color-text-primary)">{snap.location.name}</span>
                  {slug === defaultSlug && (
                    <Star className="size-3 shrink-0 fill-(--color-accent-amber) text-(--color-accent-amber)" aria-label="Default location" />
                  )}
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-mono text-lg font-semibold text-(--color-text-primary) tabular-nums">
                    {snap.current.temperatureF}&deg;
                  </span>
                  <WeatherIcon condition={snap.current.condition} className="size-5" />
                </div>
                {hasAlert && <span className="text-[10px] font-medium text-(--color-accent-red)">Active alert</span>}
              </Link>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
