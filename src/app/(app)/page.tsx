import Link from "next/link";
import { getOverallStats, getCategoryStats, getReadinessScores } from "@/lib/aggregate.server";
import { getFrequentlyForgottenTopics } from "@/lib/adaptive.server";
import { requireUserId } from "@/lib/auth.server";
import { CATEGORY_LABELS_CLIENT } from "@/lib/category-labels";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ReadinessPanel } from "@/components/dashboard/readiness-panel";
import { SkillRadar } from "@/components/dashboard/skill-radar";
import { Heatmap } from "@/components/dashboard/heatmap";
import { Flame, Target, BookOpen, AlertTriangle, RotateCcw, Brain } from "lucide-react";

export const dynamic = "force-dynamic";

function readinessLabel(percent: number) {
  if (percent >= 85) return "Interview-ready";
  if (percent >= 60) return "On track";
  if (percent >= 30) return "Building foundation";
  return "Just getting started";
}

export default async function DashboardPage() {
  const userId = await requireUserId();
  const [stats, categoryStats, readiness, frequentlyForgotten] = await Promise.all([
    getOverallStats(userId),
    getCategoryStats(userId),
    getReadinessScores(userId),
    getFrequentlyForgottenTopics(userId),
  ]);

  return (
    <div className="max-w-6xl mx-auto p-6 md:p-10 space-y-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Welcome back</h1>
        <p className="text-muted-foreground mt-1">
          {stats.totalTopics} topics tracked · {readinessLabel(readiness.overall)}
        </p>
      </div>

      <div>
        <h2 className="text-sm font-medium text-muted-foreground mb-3">
          🎯 Interview Readiness
        </h2>
        <ReadinessPanel readiness={readiness} />
      </div>

      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6 flex flex-col items-center justify-center gap-2 h-full">
            <Flame className="size-7 text-orange-500" />
            <span className="text-2xl font-semibold tabular-nums">{stats.streak}</span>
            <span className="text-sm text-muted-foreground">Day streak</span>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6 flex flex-col items-center justify-center gap-2 h-full">
            <Target className="size-7 text-emerald-500" />
            <span className="text-2xl font-semibold tabular-nums">
              {stats.p0Done}/{stats.p0Total}
            </span>
            <span className="text-sm text-muted-foreground text-center">P0 topics mastered</span>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6 flex flex-col items-center justify-center gap-2 h-full">
            <BookOpen className="size-7 text-blue-500" />
            <span className="text-2xl font-semibold tabular-nums">
              {stats.mastered + stats.expert}/{stats.totalTopics}
            </span>
            <span className="text-sm text-muted-foreground text-center">Topics mastered</span>
          </CardContent>
        </Card>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Skill radar</CardTitle>
          </CardHeader>
          <CardContent>
            <SkillRadar stats={categoryStats} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Activity — last 12 weeks</CardTitle>
          </CardHeader>
          <CardContent>
            <Heatmap data={stats.heatmap} />
            <div className="flex gap-4 mt-6 text-sm flex-wrap">
              <div className="flex items-center gap-2">
                <span className="size-2.5 rounded-full bg-orange-500" /> Not started:{" "}
                {stats.notStarted}
              </div>
              <div className="flex items-center gap-2">
                <span className="size-2.5 rounded-full bg-blue-500" /> Learning: {stats.learning}
              </div>
              <div className="flex items-center gap-2">
                <span className="size-2.5 rounded-full bg-red-500" /> Needs revision:{" "}
                {stats.needsRevision}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <RotateCcw className="size-4" /> Due for revision
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-1">
            {stats.upcomingRevision.length === 0 && (
              <p className="text-sm text-muted-foreground">Nothing due — you&apos;re current.</p>
            )}
            {stats.upcomingRevision.map((t) => (
              <Link
                key={t.id}
                href={`/topics/${t.category}/${t.slug}`}
                className="flex items-center justify-between rounded-md px-3 py-2 hover:bg-accent text-sm"
              >
                <span className="truncate">{t.title}</span>
                <Badge variant="outline" className="text-[10px] shrink-0 ml-2">
                  {CATEGORY_LABELS_CLIENT[t.category] ?? t.category}
                </Badge>
              </Link>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <AlertTriangle className="size-4 text-amber-500" /> Weak areas
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-1">
            {stats.weakAreas.length === 0 && (
              <p className="text-sm text-muted-foreground">
                No flagged weak areas yet — mark low-confidence topics as you study.
              </p>
            )}
            {stats.weakAreas.map((t) => (
              <Link
                key={t.id}
                href={`/topics/${t.category}/${t.slug}`}
                className="flex items-center justify-between rounded-md px-3 py-2 hover:bg-accent text-sm"
              >
                <span className="truncate">{t.title}</span>
                <Badge variant="outline" className="text-[10px] shrink-0 ml-2">
                  {t.priority}
                </Badge>
              </Link>
            ))}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Brain className="size-4 text-purple-500" /> Frequently forgotten
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-1">
          {frequentlyForgotten.length === 0 && (
            <p className="text-sm text-muted-foreground">
              Nothing keeps slipping yet — this fills in once a topic needs revision more than
              once.
            </p>
          )}
          {frequentlyForgotten.map((t) => (
            <Link
              key={t.id}
              href={`/topics/${t.category}/${t.slug}`}
              className="flex items-center justify-between rounded-md px-3 py-2 hover:bg-accent text-sm"
            >
              <span className="truncate">{t.title}</span>
              <span className="flex items-center gap-2 shrink-0 ml-2">
                <span className="text-[11px] text-muted-foreground tabular-nums">
                  reviewed {t.progress.reviewCount}×
                </span>
                <Badge variant="outline" className="text-[10px]">
                  {CATEGORY_LABELS_CLIENT[t.category] ?? t.category}
                </Badge>
              </span>
            </Link>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Category breakdown</CardTitle>
        </CardHeader>
        <CardContent className="grid sm:grid-cols-2 gap-3">
          {categoryStats
            .sort((a, b) => b.percent - a.percent)
            .map((c) => (
              <Link
                key={c.category}
                href={`/roadmap?category=${c.category}`}
                className="flex items-center gap-3 rounded-md border px-3 py-2 hover:bg-accent transition-colors"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between text-sm">
                    <span className="truncate font-medium">{c.label}</span>
                    <span className="text-muted-foreground tabular-nums text-xs">
                      {c.percent}%
                    </span>
                  </div>
                  <div className="mt-1.5 h-1.5 rounded-full bg-muted overflow-hidden">
                    <div
                      className="h-full bg-primary rounded-full transition-all"
                      style={{ width: `${c.percent}%` }}
                    />
                  </div>
                </div>
              </Link>
            ))}
        </CardContent>
      </Card>
    </div>
  );
}
