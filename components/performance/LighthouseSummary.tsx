import { LIGHTHOUSE_TARGETS } from "@/lib/performance/vitals";
import { Card } from "@/components/ui/Card";

function scoreColor(score: number): string {
  if (score >= 90) return "#3ddc9b";
  if (score >= 50) return "#f2b544";
  return "#ef4a5e";
}

function ScoreGauge({ category, targetScore }: { category: string; targetScore: number }) {
  const color = scoreColor(targetScore);
  return (
    <div className="flex flex-col items-center gap-2">
      <div
        className="relative flex size-20 items-center justify-center rounded-full"
        style={{
          background: `conic-gradient(${color} ${targetScore * 3.6}deg, rgba(255,255,255,0.08) 0deg)`,
        }}
      >
        <div className="flex size-16 items-center justify-center rounded-full bg-(--color-console-bg-elevated)">
          <span className="font-mono text-lg font-bold tabular-nums" style={{ color }}>
            {targetScore}
          </span>
        </div>
      </div>
      <span className="text-center text-[11px] font-medium text-(--color-text-secondary)">{category}</span>
    </div>
  );
}

export function LighthouseSummary() {
  return (
    <Card className="flex flex-col gap-5">
      <div>
        <p className="text-sm font-semibold text-(--color-text-primary)">Lighthouse Report</p>
        <p className="mt-1 text-xs text-(--color-text-secondary)">
          Target scores for this build. Generate a live report locally and drop the JSON/HTML export in{" "}
          <code className="rounded bg-white/8 px-1 py-0.5 font-mono text-[11px]">docs/lighthouse/</code>.
        </p>
      </div>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {LIGHTHOUSE_TARGETS.map((t) => (
          <ScoreGauge key={t.category} category={t.category} targetScore={t.targetScore} />
        ))}
      </div>
      <div className="rounded-xl bg-white/4 p-3">
        <p className="mb-1.5 text-xs font-medium text-(--color-text-primary)">Run it yourself</p>
        <pre className="overflow-x-auto font-mono text-[11px] text-(--color-text-secondary)">
{`npm run build && npm run start
npx lighthouse http://localhost:3000 \\
  --output=html --output-path=./docs/lighthouse/report.html \\
  --preset=desktop`}
        </pre>
      </div>
    </Card>
  );
}
