import { ChevronDown, MapPin } from "lucide-react";
import type { WeatherAlert } from "@/lib/weather/types";
import { Card } from "@/components/ui/Card";
import { AlertSeverityBadge } from "./AlertSeverityBadge";
import { formatDateTime } from "@/lib/utils";

const SEVERITY_BORDER: Record<WeatherAlert["severity"], string> = {
  advisory: "border-l-(--color-severity-advisory)",
  watch: "border-l-(--color-severity-watch)",
  warning: "border-l-(--color-severity-warning)",
  emergency: "border-l-(--color-severity-emergency)",
};

export function AlertCard({ alert, defaultOpen }: { alert: WeatherAlert; defaultOpen?: boolean }) {
  return (
    <Card className={`border-l-4 p-0 ${SEVERITY_BORDER[alert.severity]}`}>
      <details open={defaultOpen} className="group">
        <summary className="flex cursor-pointer list-none items-start justify-between gap-3 px-4 py-3.5 [&::-webkit-details-marker]:hidden">
          <div className="min-w-0">
            <div className="mb-1.5 flex flex-wrap items-center gap-2">
              <AlertSeverityBadge severity={alert.severity} />
              <span className="flex items-center gap-1 text-xs text-(--color-text-muted)">
                <MapPin className="size-3" aria-hidden="true" />
                {alert.affectedArea}
              </span>
            </div>
            <p className="text-sm font-semibold text-(--color-text-primary)">{alert.headline}</p>
            <p className="mt-0.5 text-xs text-(--color-text-muted)">
              {formatDateTime(alert.startsAt)} &ndash; {formatDateTime(alert.endsAt)}
            </p>
          </div>
          <ChevronDown
            className="mt-1 size-4 shrink-0 text-(--color-text-muted) transition-transform group-open:rotate-180"
            aria-hidden="true"
          />
        </summary>
        <div className="space-y-3 border-t border-(--color-panel-border) px-4 py-3.5 text-sm">
          <div>
            <p className="text-xs font-medium tracking-wide text-(--color-text-secondary) uppercase">Impact</p>
            <p className="mt-1 text-(--color-text-primary)">{alert.impactSummary}</p>
          </div>
          <div>
            <p className="text-xs font-medium tracking-wide text-(--color-text-secondary) uppercase">
              Recommended Action
            </p>
            <p className="mt-1 text-(--color-text-primary)">{alert.recommendedAction}</p>
          </div>
          <p className="font-mono text-[11px] text-(--color-text-muted)">
            Source: {alert.source} &middot; ID {alert.sourceId}
          </p>
        </div>
      </details>
    </Card>
  );
}
