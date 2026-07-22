import { CheckCircle2 } from "lucide-react";
import { OPTIMIZATIONS } from "@/lib/performance/vitals";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";

export function PerformanceChecklist() {
  return (
    <Card className="flex flex-col divide-y divide-(--color-panel-border) p-0">
      {OPTIMIZATIONS.map((item) => (
        <div key={item.title} className="flex items-start gap-3 px-4 py-3.5">
          <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-(--color-accent-emerald)" aria-hidden="true" />
          <div className="min-w-0">
            <p className="text-sm font-medium text-(--color-text-primary)">{item.title}</p>
            <p className="mt-0.5 text-xs text-(--color-text-secondary)">{item.detail}</p>
            <div className="mt-1.5 flex flex-wrap gap-1">
              {item.metrics.map((m) => (
                <Badge key={m} tone="cyan">
                  {m}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      ))}
    </Card>
  );
}
