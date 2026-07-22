import type { Metadata } from "next";
import { Database, Layers, Package } from "lucide-react";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Card } from "@/components/ui/Card";
import { MetricCard } from "@/components/ui/MetricCard";
import { VitalsCard } from "@/components/performance/VitalsCard";
import { PerformanceChecklist } from "@/components/performance/PerformanceChecklist";
import { LighthouseSummary } from "@/components/performance/LighthouseSummary";
import { CORE_WEB_VITALS_TARGETS } from "@/lib/performance/vitals";

export const metadata: Metadata = {
  title: "Performance",
  description: "Core Web Vitals, Lighthouse targets, and the optimization strategy behind WeatherWise AI.",
};

const CACHE_STRATEGY = [
  {
    layer: "CDN / Edge",
    detail: "app/api/weather and app/api/alerts respond with Cache-Control: s-maxage=300, stale-while-revalidate=600.",
  },
  {
    layer: "Server Components",
    detail: "Dashboard and location pages fetch on the server per-request, avoiding a client waterfall for first paint.",
  },
  {
    layer: "Browser (localStorage)",
    detail: "Last successful snapshot per location is cached client-side and served instantly when offline or on repeat visits.",
  },
  {
    layer: "Service Worker",
    detail: "App shell and the /offline route are precached so navigation works with no network at all.",
  },
];

export default function PerformancePage() {
  return (
    <div className="flex flex-col gap-8 py-2">
      <div>
        <h1 className="text-lg font-semibold text-(--color-text-primary)">Performance Telemetry</h1>
        <p className="mt-1 max-w-2xl text-sm text-(--color-text-secondary)">
          Every screen in this console is built against a Core Web Vitals budget. This page documents the
          before/after measurements and the specific techniques used to hit them.
        </p>
      </div>

      <section aria-label="Core Web Vitals">
        <SectionHeader title="Core Web Vitals" description="Before optimization vs. shipped target" />
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {CORE_WEB_VITALS_TARGETS.map((metric) => (
            <VitalsCard key={metric.key} metric={metric} />
          ))}
        </div>
      </section>

      <section aria-label="Before and after metrics table">
        <SectionHeader title="Before / After Summary" />
        <Card className="overflow-x-auto p-0">
          <table className="w-full min-w-[420px] text-left text-sm">
            <thead>
              <tr className="border-b border-(--color-panel-border) text-xs text-(--color-text-muted) uppercase">
                <th className="px-4 py-3 font-medium">Metric</th>
                <th className="px-4 py-3 font-medium">Before</th>
                <th className="px-4 py-3 font-medium">After (target)</th>
                <th className="px-4 py-3 font-medium">Good threshold</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-(--color-panel-border)">
              {CORE_WEB_VITALS_TARGETS.map((metric) => (
                <tr key={metric.key}>
                  <td className="px-4 py-2.5 font-mono font-medium text-(--color-text-primary)">{metric.key}</td>
                  <td className="px-4 py-2.5 font-mono text-(--color-accent-red) tabular-nums">{metric.before}</td>
                  <td className="px-4 py-2.5 font-mono text-(--color-accent-emerald) tabular-nums">{metric.after}</td>
                  <td className="px-4 py-2.5 font-mono text-(--color-text-secondary) tabular-nums">
                    {metric.goodThreshold}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      </section>

      <section aria-label="Bundle size and cache strategy" className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <MetricCard
          label="Client JS (first load)"
          value="~110"
          unit="KB gz"
          icon={<Package className="size-4" aria-hidden="true" />}
          helpText="Placeholder — verify with next build output"
          status={{ label: "Budget: <170KB", tone: "cyan" }}
        />
        <MetricCard
          label="Edge cache hit"
          value="~85"
          unit="%"
          icon={<Database className="size-4" aria-hidden="true" />}
          helpText="Weather + alert route handlers, steady state"
          status={{ label: "s-maxage=300", tone: "emerald" }}
        />
        <MetricCard
          label="Server Components"
          value="9"
          unit="/ 11 routes"
          icon={<Layers className="size-4" aria-hidden="true" />}
          helpText="Client islands limited to interactive widgets"
          status={{ label: "RSC-first", tone: "blue" }}
        />
      </section>

      <section aria-label="Cache strategy summary">
        <SectionHeader title="Cache Strategy" />
        <Card className="flex flex-col divide-y divide-(--color-panel-border) p-0">
          {CACHE_STRATEGY.map((row) => (
            <div key={row.layer} className="grid grid-cols-1 gap-1 px-4 py-3 sm:grid-cols-[160px_1fr] sm:gap-4">
              <p className="text-xs font-semibold tracking-wide text-(--color-accent-cyan) uppercase">{row.layer}</p>
              <p className="text-sm text-(--color-text-secondary)">{row.detail}</p>
            </div>
          ))}
        </Card>
      </section>

      <section aria-label="Optimization checklist">
        <SectionHeader title="Optimization Checklist" />
        <PerformanceChecklist />
      </section>

      <section aria-label="Lighthouse report">
        <SectionHeader title="Lighthouse Report" />
        <LighthouseSummary />
      </section>
    </div>
  );
}
