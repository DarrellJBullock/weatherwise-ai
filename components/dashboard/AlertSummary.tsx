import Link from "next/link";
import { ShieldCheck } from "lucide-react";
import type { WeatherAlert } from "@/lib/weather/types";
import { Card } from "@/components/ui/Card";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { EmptyState } from "@/components/ui/EmptyState";
import { AlertSeverityBadge, severityRank } from "@/components/alerts/AlertSeverityBadge";

export function AlertSummary({ alerts }: { alerts: WeatherAlert[] }) {
  const sorted = [...alerts].sort((a, b) => severityRank(b.severity) - severityRank(a.severity));
  const top = sorted.slice(0, 3);

  return (
    <section aria-label="Severe weather alerts">
      <SectionHeader
        title="Active Alerts"
        action={
          alerts.length > 0 && (
            <Link href="/alerts" className="text-xs font-medium text-(--color-accent-cyan) hover:underline">
              View all ({alerts.length})
            </Link>
          )
        }
      />
      {top.length === 0 ? (
        <EmptyState
          icon={<ShieldCheck className="size-6" aria-hidden="true" />}
          title="No active alerts"
          description="All tracked locations are clear of watches, warnings, and emergencies."
        />
      ) : (
        <ul className="flex flex-col gap-2">
          {top.map((alert) => (
            <li key={alert.id}>
              <Link href="/alerts" className="block">
                <Card interactive className="flex items-center justify-between gap-3 py-2.5">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-(--color-text-primary)">{alert.headline}</p>
                    <p className="truncate text-xs text-(--color-text-muted)">{alert.affectedArea}</p>
                  </div>
                  <AlertSeverityBadge severity={alert.severity} />
                </Card>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
