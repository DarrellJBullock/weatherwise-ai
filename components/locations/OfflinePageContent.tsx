"use client";

import { useSyncExternalStore } from "react";
import Link from "next/link";
import { CloudOff, RotateCcw, Trash2 } from "lucide-react";
import * as cachedEntriesStore from "@/lib/storage/cachedEntriesStore";
import { useSavedLocations } from "@/hooks/useSavedLocations";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";

export function OfflinePageContent() {
  const { savedSlugs, isHydrated } = useSavedLocations();
  const cached = useSyncExternalStore(
    cachedEntriesStore.subscribe,
    cachedEntriesStore.getSnapshot,
    cachedEntriesStore.getServerSnapshot,
  );

  const handleClear = () => {
    cachedEntriesStore.clearAll();
  };

  return (
    <div className="mx-auto flex max-w-md flex-col items-center gap-6 py-12 text-center">
      <div className="flex size-16 items-center justify-center rounded-full bg-(--color-accent-amber)/12">
        <CloudOff className="size-8 text-(--color-accent-amber)" aria-hidden="true" />
      </div>
      <div>
        <h1 className="text-lg font-semibold text-(--color-text-primary)">You&apos;re offline</h1>
        <p className="mt-2 text-sm text-(--color-text-secondary)">
          WeatherWise AI can&apos;t reach live weather data right now. Any location you&apos;ve viewed before is
          available below from the last successful forecast saved on this device.
        </p>
      </div>

      <div className="flex gap-2">
        <Link href="/" className="inline-flex">
          <Button type="button" variant="primary">
            <RotateCcw className="size-3.5" aria-hidden="true" />
            Back to Dashboard
          </Button>
        </Link>
        {cached.length > 0 && (
          <Button type="button" variant="danger" onClick={handleClear}>
            <Trash2 className="size-3.5" aria-hidden="true" />
            Clear Cached Data
          </Button>
        )}
      </div>

      <Card className="w-full text-left">
        <p className="mb-2 text-xs font-semibold tracking-wide text-(--color-text-secondary) uppercase">
          Cached Forecasts
        </p>
        {cached.length === 0 ? (
          <EmptyState
            title="Nothing cached yet"
            description="Visit a location while online once and it'll be available here offline."
          />
        ) : (
          <ul className="flex flex-col divide-y divide-(--color-panel-border)">
            {cached.map((entry) => (
              <li key={entry.slug} className="flex items-center justify-between py-2">
                <Link href={`/location/${entry.slug}`} className="text-sm text-(--color-text-primary) hover:underline">
                  {entry.name}
                </Link>
                <span className="text-[11px] text-(--color-text-muted)">
                  cached {new Date(entry.cachedAt).toLocaleTimeString()}
                </span>
              </li>
            ))}
          </ul>
        )}
      </Card>

      {isHydrated && savedSlugs.length > 0 && (
        <p className="text-xs text-(--color-text-muted)">
          Reminder: you have {savedSlugs.length} saved location{savedSlugs.length === 1 ? "" : "s"}. They&apos;ll
          refresh automatically once you&apos;re back online.
        </p>
      )}

      <p className="text-[11px] text-(--color-text-muted)">
        Cached forecasts are stored only in this browser and may be stale. Clear them any time from this page.
      </p>
    </div>
  );
}
