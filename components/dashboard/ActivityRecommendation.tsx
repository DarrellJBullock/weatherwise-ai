import { CheckCircle2, CircleAlert, MinusCircle } from "lucide-react";
import type { ActivityRecommendation as ActivityRecommendationType } from "@/lib/weather/types";
import { Card } from "@/components/ui/Card";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { cn } from "@/lib/utils";

const VERDICT_CONFIG = {
  great: { icon: CheckCircle2, className: "text-(--color-accent-emerald)" },
  fair: { icon: MinusCircle, className: "text-(--color-accent-amber)" },
  poor: { icon: CircleAlert, className: "text-(--color-accent-red)" },
} as const;

export function ActivityRecommendation({ recommendations }: { recommendations: ActivityRecommendationType[] }) {
  return (
    <section aria-label="Activity recommendations">
      <SectionHeader title="Activity Recommendations" />
      <Card className="flex flex-col divide-y divide-(--color-panel-border) p-0">
        {recommendations.map((rec) => {
          const { icon: Icon, className } = VERDICT_CONFIG[rec.verdict];
          return (
            <div key={rec.label} className="flex items-start gap-3 px-4 py-3">
              <Icon className={cn("mt-0.5 size-4 shrink-0", className)} aria-hidden="true" />
              <div className="min-w-0">
                <p className="text-sm font-medium text-(--color-text-primary)">{rec.label}</p>
                <p className="text-xs text-(--color-text-secondary)">{rec.reason}</p>
              </div>
            </div>
          );
        })}
      </Card>
    </section>
  );
}
