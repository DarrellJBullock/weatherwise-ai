import type { ReactNode } from "react";
import { Card } from "./Card";
import { Badge, type BadgeTone } from "./Badge";
import { cn } from "@/lib/utils";

interface MetricCardProps {
  label: string;
  value: string;
  unit?: string;
  status?: { label: string; tone: BadgeTone };
  helpText?: string;
  icon?: ReactNode;
  className?: string;
}

export function MetricCard({ label, value, unit, status, helpText, icon, className }: MetricCardProps) {
  return (
    <Card className={cn("flex flex-col gap-2", className)}>
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium tracking-wide text-(--color-text-secondary) uppercase">{label}</span>
        {icon && <span className="text-(--color-text-muted)">{icon}</span>}
      </div>
      <div className="flex items-baseline gap-1 font-mono">
        <span className="text-2xl font-semibold text-(--color-text-primary) tabular-nums">{value}</span>
        {unit && <span className="text-sm text-(--color-text-secondary)">{unit}</span>}
      </div>
      <div className="flex items-center justify-between gap-2">
        {helpText && <span className="text-xs text-(--color-text-muted)">{helpText}</span>}
        {status && (
          <Badge tone={status.tone} className="ml-auto">
            {status.label}
          </Badge>
        )}
      </div>
    </Card>
  );
}
