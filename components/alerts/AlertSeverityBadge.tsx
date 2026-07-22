import { AlertOctagon, AlertTriangle, Info, Siren } from "lucide-react";
import type { AlertSeverity } from "@/lib/weather/types";
import { Badge, type BadgeTone } from "@/components/ui/Badge";

const SEVERITY_CONFIG: Record<AlertSeverity, { label: string; tone: BadgeTone; icon: typeof Info }> = {
  advisory: { label: "Advisory", tone: "blue", icon: Info },
  watch: { label: "Watch", tone: "amber", icon: AlertTriangle },
  warning: { label: "Warning", tone: "orange", icon: AlertOctagon },
  emergency: { label: "Emergency", tone: "red", icon: Siren },
};

export function AlertSeverityBadge({ severity }: { severity: AlertSeverity }) {
  const { label, tone, icon: Icon } = SEVERITY_CONFIG[severity];
  return (
    <Badge tone={tone} className={severity === "emergency" ? "animate-pulse" : undefined}>
      <Icon className="size-3" aria-hidden="true" />
      {label}
    </Badge>
  );
}

export function severityRank(severity: AlertSeverity): number {
  return { advisory: 0, watch: 1, warning: 2, emergency: 3 }[severity];
}
