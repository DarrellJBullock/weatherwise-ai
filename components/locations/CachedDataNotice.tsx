"use client";

import { useEffect, useRef } from "react";
import { CloudOff } from "lucide-react";
import { useOnlineStatus } from "@/hooks/useOnlineStatus";
import { cacheSnapshot } from "@/lib/weather/cache";
import type { WeatherSnapshot } from "@/lib/weather/types";

/**
 * Persists the server-rendered snapshot into the localStorage offline cache
 * on visit, and surfaces a notice when the browser is currently offline.
 */
export function CachedDataNotice({ snapshot }: { snapshot: WeatherSnapshot }) {
  const isOnline = useOnlineStatus();
  const cachedForSlug = useRef<string | null>(null);

  useEffect(() => {
    if (cachedForSlug.current === snapshot.location.slug) return;
    cachedForSlug.current = snapshot.location.slug;
    cacheSnapshot(snapshot.location.slug, snapshot);
  }, [snapshot]);

  if (isOnline) return null;

  return (
    <div className="flex items-center gap-2 rounded-xl border border-(--color-accent-amber)/30 bg-(--color-accent-amber)/10 px-3 py-2 text-xs text-(--color-accent-amber)">
      <CloudOff className="size-3.5 shrink-0" aria-hidden="true" />
      You&apos;re offline. This page may be showing the last cached forecast rather than live data.
    </div>
  );
}
