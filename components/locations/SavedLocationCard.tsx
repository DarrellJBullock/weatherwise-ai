"use client";

import Link from "next/link";
import { Star, Trash2 } from "lucide-react";
import type { WeatherSnapshot } from "@/lib/weather/types";
import { Card } from "@/components/ui/Card";
import { Skeleton } from "@/components/ui/Skeleton";
import { AlertSeverityBadge, severityRank } from "@/components/alerts/AlertSeverityBadge";
import { WeatherIcon } from "@/components/dashboard/WeatherIcon";

interface SavedLocationCardProps {
  slug: string;
  snapshot: WeatherSnapshot | undefined;
  isDefault: boolean;
  onRemove: (slug: string) => void;
  onSetDefault: (slug: string) => void;
}

export function SavedLocationCard({ slug, snapshot, isDefault, onRemove, onSetDefault }: SavedLocationCardProps) {
  if (!snapshot) {
    return (
      <Card className="flex items-center gap-3">
        <Skeleton className="size-10 rounded-full" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-3.5 w-24" />
          <Skeleton className="h-3 w-16" />
        </div>
      </Card>
    );
  }

  const topAlert = [...snapshot.alerts].sort((a, b) => severityRank(b.severity) - severityRank(a.severity))[0];
  const today = snapshot.daily[0];

  return (
    <Card className="flex items-center gap-3">
      <Link href={`/location/${slug}`} className="flex flex-1 items-center gap-3 rounded-lg">
        <WeatherIcon condition={snapshot.current.condition} className="size-9 shrink-0" strokeWidth={1.5} />
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            <p className="truncate text-sm font-semibold text-(--color-text-primary)">{snapshot.location.name}</p>
            {isDefault && (
              <Star className="size-3 shrink-0 fill-(--color-accent-amber) text-(--color-accent-amber)" aria-label="Default location" />
            )}
          </div>
          <p className="text-xs text-(--color-text-secondary)">
            H:{today?.highF}&deg; L:{today?.lowF}&deg; &middot; {snapshot.current.conditionLabel}
          </p>
          {topAlert && (
            <div className="mt-1">
              <AlertSeverityBadge severity={topAlert.severity} />
            </div>
          )}
        </div>
        <span className="font-mono text-xl font-semibold text-(--color-text-primary) tabular-nums">
          {snapshot.current.temperatureF}&deg;
        </span>
      </Link>
      <div className="flex shrink-0 flex-col gap-1">
        <button
          type="button"
          onClick={() => onSetDefault(slug)}
          disabled={isDefault}
          aria-label={isDefault ? "Default location" : `Set ${snapshot.location.name} as default`}
          className="rounded-full p-1.5 text-(--color-text-muted) transition-colors hover:text-(--color-accent-amber) disabled:cursor-default disabled:text-(--color-accent-amber)"
        >
          <Star className={isDefault ? "size-4 fill-(--color-accent-amber)" : "size-4"} aria-hidden="true" />
        </button>
        <button
          type="button"
          onClick={() => onRemove(slug)}
          aria-label={`Remove ${snapshot.location.name}`}
          className="rounded-full p-1.5 text-(--color-text-muted) transition-colors hover:text-(--color-accent-red)"
        >
          <Trash2 className="size-4" aria-hidden="true" />
        </button>
      </div>
    </Card>
  );
}
