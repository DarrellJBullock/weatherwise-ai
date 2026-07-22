import type { Metadata } from "next";
import Link from "next/link";
import { ShieldCheck } from "lucide-react";
import { weatherService } from "@/lib/weather/weatherService";
import type { AlertSeverity } from "@/lib/weather/types";
import { AlertCard } from "@/components/alerts/AlertCard";
import { severityRank } from "@/components/alerts/AlertSeverityBadge";
import { EmptyState } from "@/components/ui/EmptyState";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Alerts",
  description: "Active severe weather alerts across all tracked WeatherWise AI locations.",
};

const SEVERITY_FILTERS: { value: AlertSeverity | "all"; label: string }[] = [
  { value: "all", label: "All" },
  { value: "advisory", label: "Advisory" },
  { value: "watch", label: "Watch" },
  { value: "warning", label: "Warning" },
  { value: "emergency", label: "Emergency" },
];

interface AlertsPageProps {
  searchParams: Promise<{ severity?: string }>;
}

export default async function AlertsPage({ searchParams }: AlertsPageProps) {
  const { severity } = await searchParams;
  const alerts = await weatherService.listAlerts();
  const filtered = severity
    ? alerts.filter((a) => a.severity === severity)
    : alerts;
  const sorted = [...filtered].sort((a, b) => severityRank(b.severity) - severityRank(a.severity));

  return (
    <div className="flex flex-col gap-6 py-2">
      <div>
        <h1 className="text-lg font-semibold text-(--color-text-primary)">Severe Weather Alerts</h1>
        <p className="mt-1 text-sm text-(--color-text-secondary)">
          {alerts.length} active alert{alerts.length === 1 ? "" : "s"} across tracked locations. Source: National
          Weather Service (mock feed).
        </p>
      </div>

      <nav aria-label="Filter alerts by severity" className="flex gap-1.5 overflow-x-auto">
        {SEVERITY_FILTERS.map(({ value, label }) => {
          const active = value === "all" ? !severity : severity === value;
          return (
            <Link
              key={value}
              href={value === "all" ? "/alerts" : `/alerts?severity=${value}`}
              aria-current={active ? "page" : undefined}
              className={cn(
                "shrink-0 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
                active
                  ? "border-(--color-accent-cyan)/50 bg-(--color-accent-cyan)/12 text-(--color-accent-cyan)"
                  : "border-(--color-panel-border-strong) text-(--color-text-secondary) hover:text-(--color-text-primary)",
              )}
            >
              {label}
            </Link>
          );
        })}
      </nav>

      {sorted.length === 0 ? (
        <EmptyState
          icon={<ShieldCheck className="size-8" aria-hidden="true" />}
          title="No alerts match this filter"
          description="All clear — check back later or view all severities."
        />
      ) : (
        <ul className="flex flex-col gap-2">
          {sorted.map((alert) => (
            <li key={alert.id}>
              <AlertCard alert={alert} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
