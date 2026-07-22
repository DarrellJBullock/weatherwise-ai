"use client";

import { useCallback, useEffect, useState } from "react";
import type { WeatherSnapshot } from "@/lib/weather/types";
import { cacheSnapshot, readCachedSnapshot } from "@/lib/weather/cache";

interface UseCachedWeatherResult {
  snapshot: WeatherSnapshot | undefined;
  isLoading: boolean;
  isStale: boolean;
  error: string | undefined;
  refetch: () => void;
}

export function useCachedWeather(slug: string | undefined): UseCachedWeatherResult {
  const [snapshot, setSnapshot] = useState<WeatherSnapshot | undefined>(undefined);
  const [isStale, setIsStale] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | undefined>(undefined);
  const [attempt, setAttempt] = useState(0);

  const refetch = useCallback(() => setAttempt((n) => n + 1), []);

  useEffect(() => {
    if (!slug) return;

    let cancelled = false;

    async function load() {
      setIsLoading(true);
      setError(undefined);
      try {
        const res = await fetch(`/api/weather?location=${slug}`, { cache: "no-store" });
        if (!res.ok) throw new Error(`Weather request failed (${res.status})`);
        const data: WeatherSnapshot = await res.json();
        if (cancelled) return;
        setSnapshot(data);
        setIsStale(false);
        cacheSnapshot(slug!, data);
      } catch {
        if (cancelled) return;
        const cached = readCachedSnapshot(slug!);
        if (cached) {
          setSnapshot(cached.snapshot);
          setIsStale(true);
        } else {
          setError("Unable to load weather data and no cached copy is available.");
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [slug, attempt]);

  return { snapshot, isLoading, isStale, error, refetch };
}
