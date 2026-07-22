import Link from "next/link";
import { AlertTriangle, Gauge, MapPinned, Plus } from "lucide-react";
import { weatherService } from "@/lib/weather/weatherService";
import { CurrentConditions } from "@/components/dashboard/CurrentConditions";
import { HourlyForecast } from "@/components/dashboard/HourlyForecast";
import { DailyForecast } from "@/components/dashboard/DailyForecast";
import { SavedLocationStrip } from "@/components/dashboard/SavedLocationStrip";
import { AlertSummary } from "@/components/dashboard/AlertSummary";
import { PerformanceSnapshot } from "@/components/dashboard/PerformanceSnapshot";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Card } from "@/components/ui/Card";
import { WeatherMap } from "@/components/maps/WeatherMap";
import type { MapLocationSummary } from "@/components/maps/geo";

const FEATURED_SLUG = "philadelphia";

const QUICK_ACTIONS = [
  { href: "/locations", label: "Add Location", icon: Plus },
  { href: "/alerts", label: "View Alerts", icon: AlertTriangle },
  { href: "#weather-map", label: "Open Map", icon: MapPinned },
  { href: "/performance", label: "View Performance", icon: Gauge },
];

export default async function HomePage() {
  const locations = await weatherService.listLocations();
  const snapshots = await Promise.all(locations.map((loc) => weatherService.getSnapshot(loc.slug)));
  const featured = snapshots.find((s) => s?.location.slug === FEATURED_SLUG) ?? snapshots[0];
  const alerts = await weatherService.listAlerts();

  const mapLocations: MapLocationSummary[] = snapshots
    .filter((s): s is NonNullable<typeof s> => Boolean(s))
    .map((s) => ({
      slug: s.location.slug,
      name: s.location.name,
      lat: s.location.coordinates.lat,
      lon: s.location.coordinates.lon,
      temperatureF: s.current.temperatureF,
      windMph: s.current.windMph,
      windDirection: s.current.windDirection,
      hasAlert: s.alerts.length > 0,
    }));

  if (!featured) {
    return (
      <Card className="mt-10 text-center text-sm text-(--color-text-secondary)">
        Weather data is temporarily unavailable.
      </Card>
    );
  }

  return (
    <div className="flex flex-col gap-8 py-2">
      <div>
        <h1 className="sr-only">WeatherWise AI Storm Operations Console</h1>
        <div role="group" aria-label="Quick actions" className="flex gap-2 overflow-x-auto pb-3">
          {QUICK_ACTIONS.map(({ href, label, icon: Icon }) => (
            <Link
              key={label}
              href={href}
              className="glass-panel flex shrink-0 items-center gap-1.5 rounded-full px-3.5 py-2 text-xs font-medium text-(--color-text-secondary) transition-colors hover:border-(--color-accent-cyan)/50 hover:text-(--color-text-primary)"
            >
              <Icon className="size-3.5 text-(--color-accent-cyan)" aria-hidden="true" />
              {label}
            </Link>
          ))}
        </div>
      </div>

      <CurrentConditions snapshot={featured} />

      <SavedLocationStrip />

      <HourlyForecast hourly={featured.hourly} timezone={featured.location.timezone} />

      <DailyForecast daily={featured.daily} />

      <AlertSummary alerts={alerts} />

      <section id="weather-map" aria-label="Weather map preview" className="scroll-mt-20">
        <SectionHeader
          title="Weather Map"
          description="Storm Ops Console &middot; all tracked locations"
          action={
            <Link href="/locations" className="text-xs font-medium text-(--color-accent-cyan) hover:underline">
              Manage locations
            </Link>
          }
        />
        <Card className="h-80 p-0 sm:h-96">
          <WeatherMap locations={mapLocations} className="h-full" />
        </Card>
      </section>

      <PerformanceSnapshot />
    </div>
  );
}
