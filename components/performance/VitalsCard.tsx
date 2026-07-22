import type { VitalTarget } from "@/lib/performance/vitals";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";

export function VitalsCard({ metric }: { metric: VitalTarget }) {
  return (
    <Card className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <span className="font-mono text-xs font-bold tracking-widest text-(--color-accent-cyan)">{metric.key}</span>
        <Badge tone="emerald">Target {metric.goodThreshold}</Badge>
      </div>
      <p className="text-xs text-(--color-text-secondary)">{metric.label}</p>
      <div className="mt-1 flex items-end justify-between gap-2">
        <div>
          <p className="text-[10px] tracking-wide text-(--color-text-muted) uppercase">Before</p>
          <p className="font-mono text-lg font-semibold text-(--color-accent-red) line-through decoration-1 tabular-nums">
            {metric.before}
          </p>
        </div>
        <div className="mb-1 h-px flex-1 bg-gradient-to-r from-(--color-accent-red)/40 to-(--color-accent-emerald)/40" />
        <div className="text-right">
          <p className="text-[10px] tracking-wide text-(--color-text-muted) uppercase">After</p>
          <p className="font-mono text-lg font-semibold text-(--color-accent-emerald) tabular-nums">{metric.after}</p>
        </div>
      </div>
      <p className="mt-1 text-[11px] text-(--color-text-muted)">{metric.description}</p>
    </Card>
  );
}
