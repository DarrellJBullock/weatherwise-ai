export interface VitalTarget {
  key: "LCP" | "CLS" | "INP" | "TTFB";
  label: string;
  before: string;
  after: string;
  goodThreshold: string;
  description: string;
}

/**
 * Illustrative before/after Core Web Vitals for this project's optimization
 * pass. "Before" reflects an unoptimized client-rendered baseline of this
 * same dashboard; "after" reflects the shipped, edge-cached, RSC-first build.
 * These are documented targets for the portfolio narrative, not live RUM data.
 */
export const CORE_WEB_VITALS_TARGETS: VitalTarget[] = [
  {
    key: "LCP",
    label: "Largest Contentful Paint",
    before: "3.8s",
    after: "<1.8s",
    goodThreshold: "<2.5s",
    description: "Time until the hero current-conditions card finishes painting.",
  },
  {
    key: "CLS",
    label: "Cumulative Layout Shift",
    before: "0.18",
    after: "<0.05",
    goodThreshold: "<0.1",
    description: "Visual stability across skeleton-to-content swaps and forecast cards.",
  },
  {
    key: "INP",
    label: "Interaction to Next Paint",
    before: "280ms",
    after: "<150ms",
    goodThreshold: "<200ms",
    description: "Responsiveness of saved-location chips, map layer toggles, and nav.",
  },
  {
    key: "TTFB",
    label: "Time to First Byte",
    before: "620ms",
    after: "<180ms",
    goodThreshold: "<800ms",
    description: "Edge-cached route handler + Server Component shell response time.",
  },
];

export interface LighthouseCategoryTarget {
  category: string;
  targetScore: number;
}

export const LIGHTHOUSE_TARGETS: LighthouseCategoryTarget[] = [
  { category: "Performance", targetScore: 96 },
  { category: "Accessibility", targetScore: 100 },
  { category: "Best Practices", targetScore: 100 },
  { category: "SEO", targetScore: 100 },
];

export interface OptimizationItem {
  title: string;
  detail: string;
  metrics: VitalTarget["key"][];
}

export const OPTIMIZATIONS: OptimizationItem[] = [
  {
    title: "Server Components for the initial shell",
    detail:
      "Dashboard, location, and alert pages render weather data on the server, shipping HTML immediately instead of waiting on client-side fetch waterfalls.",
    metrics: ["LCP", "TTFB"],
  },
  {
    title: "Edge cache headers on weather route handlers",
    detail:
      "app/api/weather and app/api/alerts set Cache-Control with s-maxage + stale-while-revalidate so repeat requests are served from the edge.",
    metrics: ["TTFB"],
  },
  {
    title: "Dynamic import for the map",
    detail:
      "WeatherMap is loaded via next/dynamic with no SSR, keeping map/canvas code out of the initial client bundle.",
    metrics: ["LCP", "INP"],
  },
  {
    title: "Skeleton UI with reserved dimensions",
    detail: "Loading states use fixed-height skeletons that match final content, preventing reflow on hydration.",
    metrics: ["CLS"],
  },
  {
    title: "Stable card dimensions",
    detail: "Forecast and metric cards use fixed aspect and min-height rules so late-arriving text never shifts layout.",
    metrics: ["CLS"],
  },
  {
    title: "Reduced client JavaScript bundle",
    detail:
      "Interactivity is isolated to small client islands (saved locations, offline banner, map) instead of a client-rendered page shell.",
    metrics: ["INP", "LCP"],
  },
  {
    title: "Lazy-loaded non-critical sections",
    detail: "Below-the-fold sections such as the map preview and performance checklist defer hydration until visible.",
    metrics: ["LCP", "INP"],
  },
  {
    title: "Offline cached forecast fallback",
    detail: "localStorage caches the last successful snapshot so navigation stays instant even without network.",
    metrics: ["TTFB"],
  },
  {
    title: "Accessible, lightweight motion",
    detail: "Microinteractions use short CSS transitions and honor prefers-reduced-motion instead of JS animation libraries.",
    metrics: ["INP"],
  },
];
