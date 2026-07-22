import { MapPinned, RadioTower } from "lucide-react";
import type { MapLocationSummary } from "./geo";

interface MapFallbackProps {
  locations: MapLocationSummary[];
  reason?: "loading" | "error";
}

export function MapFallback({ locations, reason = "loading" }: MapFallbackProps) {
  return (
    <div className="flex h-full min-h-[220px] flex-col justify-between gap-3 p-4">
      <div className="flex items-center gap-2 text-xs text-(--color-text-muted)">
        <RadioTower className="size-3.5" aria-hidden="true" />
        {reason === "error"
          ? "Interactive map unavailable — showing radar summary instead."
          : "Loading interactive map…"}
      </div>
      <ul className="grid grid-cols-2 gap-2 sm:grid-cols-3">
        {locations.map((loc) => (
          <li
            key={loc.slug}
            className="flex items-center gap-2 rounded-lg bg-white/4 px-2.5 py-2 text-xs"
          >
            <MapPinned
              className={loc.hasAlert ? "size-3.5 text-(--color-accent-red)" : "size-3.5 text-(--color-accent-cyan)"}
              aria-hidden="true"
            />
            <span className="min-w-0 flex-1 truncate text-(--color-text-primary)">{loc.name}</span>
            <span className="font-mono text-(--color-text-secondary) tabular-nums">{loc.temperatureF}&deg;</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
