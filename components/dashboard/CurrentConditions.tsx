import { Droplets, Eye, Gauge, Sunrise, Sunset, Wind } from "lucide-react";
import type { WeatherSnapshot } from "@/lib/weather/types";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { WeatherIcon } from "./WeatherIcon";

interface CurrentConditionsProps {
  snapshot: WeatherSnapshot;
  isStale?: boolean;
}

const STATS = (current: WeatherSnapshot["current"]) => [
  { icon: Droplets, label: "Humidity", value: `${current.humidityPct}%` },
  { icon: Wind, label: "Wind", value: `${current.windMph} mph ${current.windDirection}` },
  { icon: Gauge, label: "UV Index", value: `${current.uvIndex}` },
  { icon: Eye, label: "Visibility", value: `${current.visibilityMi} mi` },
  { icon: Sunrise, label: "Sunrise", value: current.sunrise },
  { icon: Sunset, label: "Sunset", value: current.sunset },
];

export function CurrentConditions({ snapshot, isStale }: CurrentConditionsProps) {
  const { location, current } = snapshot;

  return (
    <Card strong className="relative overflow-hidden">
      <div className="radar-sweep" aria-hidden="true" />
      <div className="relative z-10">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs font-medium tracking-widest text-(--color-text-secondary) uppercase">
              {location.name}, {location.region}
            </p>
            <p className="mt-0.5 text-[11px] text-(--color-text-muted)">
              Updated{" "}
              {new Date(current.observedAt).toLocaleTimeString("en-US", {
                hour: "numeric",
                minute: "2-digit",
                timeZone: location.timezone,
              })}
            </p>
          </div>
          {isStale && <Badge tone="amber">Cached</Badge>}
        </div>

        <div className="mt-4 flex items-center gap-4">
          <WeatherIcon condition={current.condition} className="size-16 shrink-0" strokeWidth={1.5} />
          <div>
            <div className="flex items-start font-mono">
              <span className="text-6xl leading-none font-semibold tracking-tight text-glow-cyan tabular-nums">
                {current.temperatureF}
              </span>
              <span className="mt-1 text-2xl text-(--color-text-secondary)">&deg;F</span>
            </div>
            <p className="mt-1 text-sm text-(--color-text-secondary)">
              {current.conditionLabel} &middot; Feels like {current.feelsLikeF}&deg;
            </p>
          </div>
        </div>

        <dl className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {STATS(current).map(({ icon: Icon, label, value }) => (
            <div key={label} className="rounded-xl bg-white/4 p-2.5">
              <dt className="flex items-center gap-1 text-[10px] font-medium tracking-wide text-(--color-text-muted) uppercase">
                <Icon className="size-3" aria-hidden="true" />
                {label}
              </dt>
              <dd className="mt-1 font-mono text-sm font-medium text-(--color-text-primary) tabular-nums">
                {value}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </Card>
  );
}
