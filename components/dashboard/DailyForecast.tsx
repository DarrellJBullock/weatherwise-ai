import type { DailyForecastEntry } from "@/lib/weather/types";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Card } from "@/components/ui/Card";
import { WeatherIcon } from "./WeatherIcon";

interface DailyForecastProps {
  daily: DailyForecastEntry[];
}

export function DailyForecast({ daily }: DailyForecastProps) {
  const maxHigh = Math.max(...daily.map((d) => d.highF));
  const minLow = Math.min(...daily.map((d) => d.lowF));
  const range = Math.max(maxHigh - minLow, 1);

  return (
    <section aria-label="7 day forecast">
      <SectionHeader title="7-Day Forecast" />
      <Card className="divide-y divide-(--color-panel-border) p-0">
        {daily.map((day) => {
          const barLeft = ((day.lowF - minLow) / range) * 100;
          const barWidth = ((day.highF - day.lowF) / range) * 100;
          return (
            <div key={day.date} className="grid grid-cols-[52px_28px_1fr_auto] items-center gap-3 px-4 py-2.5 sm:grid-cols-[64px_28px_1fr_100px]">
              <span className="text-xs font-medium text-(--color-text-secondary)">{day.dayLabel}</span>
              <WeatherIcon condition={day.condition} className="size-5" strokeWidth={1.75} />
              <div className="flex items-center gap-2">
                <span className="w-7 text-right font-mono text-xs text-(--color-text-muted) tabular-nums">
                  {day.lowF}&deg;
                </span>
                <div className="relative h-1.5 flex-1 rounded-full bg-white/8">
                  <div
                    className="absolute h-full rounded-full bg-gradient-to-r from-(--color-accent-blue) to-(--color-accent-orange)"
                    style={{ left: `${barLeft}%`, width: `${barWidth}%` }}
                  />
                </div>
                <span className="w-7 font-mono text-xs font-medium text-(--color-text-primary) tabular-nums">
                  {day.highF}&deg;
                </span>
              </div>
              <span className="hidden text-right text-[11px] text-(--color-accent-blue) sm:block">
                {day.rainChancePct}% rain
              </span>
            </div>
          );
        })}
      </Card>
    </section>
  );
}
