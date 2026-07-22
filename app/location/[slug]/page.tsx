import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { weatherService } from "@/lib/weather/weatherService";
import { getActivityRecommendations, getAllLocations } from "@/lib/weather/mockWeatherProvider";
import { CurrentConditions } from "@/components/dashboard/CurrentConditions";
import { HourlyForecast } from "@/components/dashboard/HourlyForecast";
import { DailyForecast } from "@/components/dashboard/DailyForecast";
import { ActivityRecommendation } from "@/components/dashboard/ActivityRecommendation";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Card } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { AlertCard } from "@/components/alerts/AlertCard";
import { SaveToggleButton } from "@/components/locations/SaveToggleButton";
import { CachedDataNotice } from "@/components/locations/CachedDataNotice";
import { WeatherMap } from "@/components/maps/WeatherMap";
import { formatLocationLabel } from "@/lib/utils";
import { ShieldCheck } from "lucide-react";

interface LocationPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return getAllLocations().map((loc) => ({ slug: loc.slug }));
}

export async function generateMetadata({ params }: LocationPageProps): Promise<Metadata> {
  const { slug } = await params;
  const location = await weatherService.getLocation(slug);
  if (!location) return { title: "Location not found" };
  const label = formatLocationLabel(location.name, location.region, location.country);
  return {
    title: label,
    description: `Current conditions, hourly and 7-day forecast, and active alerts for ${label}.`,
  };
}

export default async function LocationPage({ params }: LocationPageProps) {
  const { slug } = await params;
  const snapshot = await weatherService.getSnapshot(slug);

  if (!snapshot) notFound();

  const recommendations = getActivityRecommendations(snapshot);

  return (
    <div className="flex flex-col gap-8 py-2">
      <div className="flex items-center justify-between gap-3">
        <Link
          href="/locations"
          className="flex items-center gap-1 text-xs font-medium text-(--color-text-secondary) hover:text-(--color-text-primary)"
        >
          <ChevronLeft className="size-3.5" aria-hidden="true" />
          Locations
        </Link>
        <SaveToggleButton slug={snapshot.location.slug} />
      </div>

      <CachedDataNotice snapshot={snapshot} />

      <CurrentConditions snapshot={snapshot} />

      <HourlyForecast hourly={snapshot.hourly} timezone={snapshot.location.timezone} />

      <DailyForecast daily={snapshot.daily} />

      <section aria-label="Weather alerts for this location">
        <SectionHeader title="Alerts" />
        {snapshot.alerts.length === 0 ? (
          <EmptyState
            icon={<ShieldCheck className="size-6" aria-hidden="true" />}
            title="No active alerts"
            description={`${snapshot.location.name} is currently clear of watches, warnings, and emergencies.`}
          />
        ) : (
          <ul className="flex flex-col gap-2">
            {snapshot.alerts.map((alert) => (
              <li key={alert.id}>
                <AlertCard alert={alert} defaultOpen />
              </li>
            ))}
          </ul>
        )}
      </section>

      <ActivityRecommendation recommendations={recommendations} />

      <section aria-label="Location map" className="scroll-mt-20">
        <SectionHeader title="Map" description={snapshot.location.timezone} />
        <Card className="h-72 p-0">
          <WeatherMap
            locations={[
              {
                slug: snapshot.location.slug,
                name: snapshot.location.name,
                lat: snapshot.location.coordinates.lat,
                lon: snapshot.location.coordinates.lon,
                temperatureF: snapshot.current.temperatureF,
                windMph: snapshot.current.windMph,
                windDirection: snapshot.current.windDirection,
                hasAlert: snapshot.alerts.length > 0,
              },
            ]}
            className="h-full"
          />
        </Card>
      </section>
    </div>
  );
}
