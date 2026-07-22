import type { HourlyForecastEntry } from "@/lib/weather/types";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Card } from "@/components/ui/Card";
import { WeatherIcon } from "./WeatherIcon";

interface HourlyForecastProps {
  hourly: HourlyForecastEntry[];
  timezone: string;
}

export function HourlyForecast({ hourly, timezone }: HourlyForecastProps) {
  return (
    <section aria-label="Hourly forecast">
      <SectionHeader title="Hourly Forecast" />
      <Card className="overflow-hidden p-2">
        <ul className="flex snap-x snap-mandatory gap-2 overflow-x-auto scroll-smooth px-2 py-1">
          {hourly.map((hour, i) => (
            <li
              key={hour.time}
              className="flex w-[64px] shrink-0 snap-start flex-col items-center gap-1.5 rounded-xl px-1.5 py-2.5 text-center hover:bg-white/5"
            >
              <span className="text-[11px] font-medium text-(--color-text-secondary)">
                {i === 0
                  ? "Now"
                  : new Date(hour.time).toLocaleTimeString("en-US", { hour: "numeric", timeZone: timezone })}
              </span>
              <WeatherIcon condition={hour.condition} className="size-6" strokeWidth={1.75} />
              <span className="font-mono text-sm font-semibold text-(--color-text-primary) tabular-nums">
                {hour.temperatureF}&deg;
              </span>
              <span className="text-[10px] text-(--color-accent-blue) tabular-nums">{hour.rainChancePct}%</span>
            </li>
          ))}
        </ul>
      </Card>
    </section>
  );
}
