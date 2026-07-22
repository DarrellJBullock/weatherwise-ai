"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowUp, CloudRain, Thermometer, TriangleAlert } from "lucide-react";
import { compassToDegrees, projectToPercent, type MapLocationSummary } from "./geo";
import { RadarOverlay } from "./RadarOverlay";
import { cn } from "@/lib/utils";

type MapLayer = "radar" | "temperature" | "wind" | "alerts";

const LAYERS: { id: MapLayer; label: string; icon: typeof CloudRain }[] = [
  { id: "radar", label: "Radar", icon: CloudRain },
  { id: "temperature", label: "Temperature", icon: Thermometer },
  { id: "wind", label: "Wind", icon: ArrowUp },
  { id: "alerts", label: "Alerts", icon: TriangleAlert },
];

function tempColor(tempF: number): string {
  if (tempF >= 90) return "#ef4a5e";
  if (tempF >= 80) return "#f2793f";
  if (tempF >= 68) return "#f2b544";
  if (tempF >= 55) return "#3ddc9b";
  return "#4d8ff0";
}

export function WeatherMapClient({ locations }: { locations: MapLocationSummary[] }) {
  const [layer, setLayer] = useState<MapLayer>("radar");

  return (
    <div className="flex h-full flex-col gap-3 p-3">
      <div role="group" aria-label="Map layers" className="flex flex-wrap gap-1.5">
        {LAYERS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            type="button"
            aria-pressed={layer === id}
            onClick={() => setLayer(id)}
            className={cn(
              "flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-medium transition-colors",
              layer === id
                ? "border-(--color-accent-cyan)/50 bg-(--color-accent-cyan)/12 text-(--color-accent-cyan)"
                : "border-(--color-panel-border-strong) text-(--color-text-secondary) hover:text-(--color-text-primary)",
            )}
          >
            <Icon className="size-3" aria-hidden="true" />
            {label}
          </button>
        ))}
      </div>

      <div className="relative flex-1 overflow-hidden rounded-xl bg-(--color-console-bg-elevated)">
        {layer === "radar" && <RadarOverlay />}
        <div className="map-grid-texture" aria-hidden="true" />

        {locations.map((loc) => {
          const { x, y } = projectToPercent(loc.lat, loc.lon);
          const dimmed = layer === "alerts" && !loc.hasAlert;
          return (
            <Link
              key={loc.slug}
              href={`/location/${loc.slug}`}
              className="group absolute -translate-x-1/2 -translate-y-1/2 rounded-full focus-visible:z-20"
              style={{ left: `${x}%`, top: `${y}%` }}
              aria-label={`${loc.name}, ${loc.temperatureF} degrees${loc.hasAlert ? ", active alert" : ""}`}
            >
              <span
                className={cn(
                  "relative flex items-center justify-center rounded-full border-2 transition-all",
                  loc.hasAlert && !dimmed
                    ? "size-4 border-(--color-accent-red) bg-(--color-accent-red)/60 animate-pulse"
                    : "size-3 border-white/70 bg-(--color-accent-cyan)",
                  dimmed && "opacity-30",
                )}
                style={layer === "temperature" ? { background: tempColor(loc.temperatureF), borderColor: "rgba(255,255,255,0.7)" } : undefined}
              >
                {layer === "wind" && (
                  <ArrowUp
                    className="absolute size-4 text-(--color-accent-cyan)"
                    style={{ transform: `rotate(${compassToDegrees(loc.windDirection)}deg)` }}
                    aria-hidden="true"
                  />
                )}
              </span>
              <span className="pointer-events-none absolute top-full left-1/2 mt-1 hidden -translate-x-1/2 rounded-md bg-(--color-console-bg-elevated) px-2 py-1 text-[10px] whitespace-nowrap text-(--color-text-primary) shadow-lg group-hover:block group-focus-visible:block">
                {loc.name} &middot; {loc.temperatureF}&deg;
                {layer === "wind" && ` · ${loc.windMph}mph ${loc.windDirection}`}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
