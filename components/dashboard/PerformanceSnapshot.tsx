import Link from "next/link";
import { Gauge } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { CORE_WEB_VITALS_TARGETS } from "@/lib/performance/vitals";

export function PerformanceSnapshot() {
  return (
    <section aria-label="Performance snapshot">
      <SectionHeader
        title="Performance Snapshot"
        action={
          <Link href="/performance" className="text-xs font-medium text-(--color-accent-cyan) hover:underline">
            Full report
          </Link>
        }
      />
      <Card className="flex flex-col gap-3">
        <div className="flex items-center gap-2 text-xs text-(--color-text-secondary)">
          <Gauge className="size-4 text-(--color-accent-emerald)" aria-hidden="true" />
          Core Web Vitals target status &middot; edge-cached shell
        </div>
        <div className="grid grid-cols-3 gap-2">
          {CORE_WEB_VITALS_TARGETS.map((metric) => (
            <div key={metric.key} className="rounded-xl bg-white/4 p-2.5 text-center">
              <p className="text-[10px] font-medium tracking-wide text-(--color-text-muted) uppercase">{metric.key}</p>
              <p className="mt-1 font-mono text-lg font-semibold text-(--color-accent-emerald) tabular-nums">
                {metric.after}
              </p>
              <p className="font-mono text-[10px] text-(--color-text-muted) line-through">{metric.before}</p>
            </div>
          ))}
        </div>
      </Card>
    </section>
  );
}
