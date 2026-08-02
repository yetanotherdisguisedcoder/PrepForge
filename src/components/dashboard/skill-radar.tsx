"use client";

import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
} from "recharts";
import type { CategoryStat } from "@/lib/aggregate.server";

export function SkillRadar({ stats }: { stats: CategoryStat[] }) {
  const data = stats
    .filter((s) => s.topicsCount > 0)
    .map((s) => ({
      category: s.label.length > 18 ? s.label.slice(0, 16) + "…" : s.label,
      completion: s.percent,
    }));

  return (
    <ResponsiveContainer width="100%" height={280}>
      <RadarChart data={data} outerRadius="72%">
        <PolarGrid stroke="var(--border)" />
        <PolarAngleAxis
          dataKey="category"
          tick={{ fill: "var(--muted-foreground)", fontSize: 11 }}
        />
        <PolarRadiusAxis
          angle={30}
          domain={[0, 100]}
          tick={{ fill: "var(--muted-foreground)", fontSize: 10 }}
        />
        <Radar
          dataKey="completion"
          stroke="var(--primary)"
          fill="var(--primary)"
          fillOpacity={0.25}
        />
      </RadarChart>
    </ResponsiveContainer>
  );
}
