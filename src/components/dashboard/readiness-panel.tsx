import { ProgressRing } from "./progress-ring";
import type { ReadinessScores } from "@/lib/aggregate.server";

export function ReadinessPanel({ readiness }: { readiness: ReadinessScores }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-8 gap-4">
      <div className="col-span-2 sm:col-span-4 md:col-span-2 flex flex-col items-center justify-center gap-2 rounded-lg border bg-card py-4">
        <ProgressRing percent={readiness.overall} size={88} strokeWidth={8} />
        <span className="text-sm font-medium">Overall Readiness</span>
      </div>
      {readiness.dimensions.map((d) => (
        <div
          key={d.key}
          className="flex flex-col items-center justify-center gap-2 rounded-lg border bg-card py-4"
        >
          <ProgressRing percent={d.score} size={64} strokeWidth={6} />
          <span className="text-xs text-muted-foreground text-center px-1">{d.label}</span>
        </div>
      ))}
    </div>
  );
}
