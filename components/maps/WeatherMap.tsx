"use client";

import dynamic from "next/dynamic";
import { MapErrorBoundary } from "./MapErrorBoundary";
import { MapFallback } from "./MapFallback";
import type { MapLocationSummary } from "./geo";

const WeatherMapClient = dynamic(
  () => import("./WeatherMapClient").then((mod) => mod.WeatherMapClient),
  {
    ssr: false,
    loading: () => <MapFallback locations={[]} reason="loading" />,
  },
);

interface WeatherMapProps {
  locations: MapLocationSummary[];
  className?: string;
}

export function WeatherMap({ locations, className }: WeatherMapProps) {
  return (
    <div className={className}>
      <MapErrorBoundary locations={locations}>
        <WeatherMapClient locations={locations} />
      </MapErrorBoundary>
    </div>
  );
}
