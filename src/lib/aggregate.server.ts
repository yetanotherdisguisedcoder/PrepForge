import "server-only";
import { getAllTopics, getCategoryGroups, CATEGORY_LABELS } from "./resources.server";
import { readProgress, readActivitySince, currentStreak } from "./progress.server";
import type { Topic, ProgressEntry } from "./types";

export interface TopicWithProgress extends Topic {
  progress: ProgressEntry;
  percent: number; // 0-100, based on checked checklist items
}

const EMPTY_ENTRY: ProgressEntry = {
  status: "not-started",
  confidence: 0,
  reviewCount: 0,
  lastReviewed: null,
  nextReview: null,
  quizScore: null,
  checkedItems: [],
};

export async function getTopicsWithProgress(userId: string): Promise<TopicWithProgress[]> {
  const topics = getAllTopics();
  const progressMap = await readProgress(userId);
  return topics.map((t) => {
    const progress = progressMap[t.id] ?? EMPTY_ENTRY;
    const percent =
      t.checklistTotal > 0
        ? Math.round((progress.checkedItems.length / t.checklistTotal) * 100)
        : progress.status === "mastered" || progress.status === "expert"
          ? 100
          : 0;
    return { ...t, progress, percent };
  });
}

export interface CategoryStat {
  category: string;
  label: string;
  topicsCount: number;
  masteredCount: number;
  doneItems: number;
  totalItems: number;
  percent: number;
  avgConfidence: number;
}

export async function getCategoryStats(userId: string): Promise<CategoryStat[]> {
  const topics = await getTopicsWithProgress(userId);
  const byCategory = new Map<string, TopicWithProgress[]>();
  for (const t of topics) {
    if (!byCategory.has(t.category)) byCategory.set(t.category, []);
    byCategory.get(t.category)!.push(t);
  }
  return [...byCategory.entries()].map(([category, list]) => {
    const totalItems = list.reduce((s, t) => s + Math.max(t.checklistTotal, 1), 0);
    const doneItems = list.reduce(
      (s, t) =>
        s +
        (t.checklistTotal > 0
          ? t.progress.checkedItems.length
          : t.progress.status === "mastered" || t.progress.status === "expert"
            ? 1
            : 0),
      0,
    );
    const masteredCount = list.filter(
      (t) => t.progress.status === "mastered" || t.progress.status === "expert",
    ).length;
    const avgConfidence =
      list.reduce((s, t) => s + t.progress.confidence, 0) / (list.length || 1);
    return {
      category,
      label: CATEGORY_LABELS[category] ?? category,
      topicsCount: list.length,
      masteredCount,
      doneItems,
      totalItems,
      percent: totalItems > 0 ? Math.round((doneItems / totalItems) * 100) : 0,
      avgConfidence: Math.round(avgConfidence * 10) / 10,
    };
  });
}

export interface OverallStats {
  totalTopics: number;
  totalChecklistItems: number;
  doneChecklistItems: number;
  percent: number;
  streak: number;
  notStarted: number;
  learning: number;
  needsRevision: number;
  mastered: number;
  expert: number;
  weakAreas: TopicWithProgress[];
  upcomingRevision: TopicWithProgress[];
  recentlyTouched: TopicWithProgress[];
  p0Total: number;
  p0Done: number;
  heatmap: { date: string; count: number }[];
}

export async function getOverallStats(userId: string): Promise<OverallStats> {
  const topics = await getTopicsWithProgress(userId);
  const totalChecklistItems = topics.reduce((s, t) => s + Math.max(t.checklistTotal, 1), 0);
  const doneChecklistItems = topics.reduce(
    (s, t) =>
      s +
      (t.checklistTotal > 0
        ? t.progress.checkedItems.length
        : t.progress.status === "mastered" || t.progress.status === "expert"
          ? 1
          : 0),
    0,
  );

  const p0 = topics.filter((t) => t.priority === "P0");
  const p0Done = p0.filter(
    (t) => t.progress.status === "mastered" || t.progress.status === "expert",
  ).length;

  const today = new Date().toISOString().slice(0, 10);
  const weakAreas = topics
    .filter(
      (t) =>
        t.progress.status === "needs-revision" ||
        (t.progress.status !== "not-started" && t.progress.confidence > 0 && t.progress.confidence <= 2),
    )
    .slice(0, 8);

  const upcomingRevision = topics
    .filter((t) => t.progress.nextReview && t.progress.nextReview <= today)
    .sort((a, b) => (a.progress.nextReview ?? "").localeCompare(b.progress.nextReview ?? ""))
    .slice(0, 8);

  const recentlyTouched = topics
    .filter((t) => t.progress.lastReviewed)
    .sort((a, b) => (b.progress.lastReviewed ?? "").localeCompare(a.progress.lastReviewed ?? ""))
    .slice(0, 6);

  const heatmapStart = new Date();
  heatmapStart.setDate(heatmapStart.getDate() - 83); // ~12 weeks
  const activity = await readActivitySince(userId, heatmapStart.toISOString().slice(0, 10));
  const heatmap: { date: string; count: number }[] = [];
  const d = new Date(heatmapStart);
  for (let i = 0; i < 84; i++) {
    const key = d.toISOString().slice(0, 10);
    heatmap.push({ date: key, count: activity[key] ?? 0 });
    d.setDate(d.getDate() + 1);
  }

  return {
    totalTopics: topics.length,
    totalChecklistItems,
    doneChecklistItems,
    percent:
      totalChecklistItems > 0 ? Math.round((doneChecklistItems / totalChecklistItems) * 100) : 0,
    streak: await currentStreak(userId),
    notStarted: topics.filter((t) => t.progress.status === "not-started").length,
    learning: topics.filter((t) => t.progress.status === "learning").length,
    needsRevision: topics.filter((t) => t.progress.status === "needs-revision").length,
    mastered: topics.filter((t) => t.progress.status === "mastered").length,
    expert: topics.filter((t) => t.progress.status === "expert").length,
    weakAreas,
    upcomingRevision,
    recentlyTouched,
    p0Total: p0.length,
    p0Done,
    heatmap,
  };
}

export interface CategoryGroupWithProgress {
  category: string;
  label: string;
  percent: number;
  topics: TopicWithProgress[];
}

export async function getCategoryGroupsWithProgress(
  userId: string,
): Promise<CategoryGroupWithProgress[]> {
  const topics = await getTopicsWithProgress(userId);
  const byCategory = new Map<string, TopicWithProgress[]>();
  for (const t of topics) {
    if (!byCategory.has(t.category)) byCategory.set(t.category, []);
    byCategory.get(t.category)!.push(t);
  }
  return [...byCategory.entries()]
    .map(([category, list]) => {
      const totalItems = list.reduce((s, t) => s + Math.max(t.checklistTotal, 1), 0);
      const doneItems = list.reduce(
        (s, t) =>
          s +
          (t.checklistTotal > 0
            ? t.progress.checkedItems.length
            : t.progress.status === "mastered" || t.progress.status === "expert"
              ? 1
              : 0),
        0,
      );
      return {
        category,
        label: CATEGORY_LABELS[category] ?? category,
        percent: totalItems > 0 ? Math.round((doneItems / totalItems) * 100) : 0,
        topics: list,
      };
    })
    .sort((a, b) => a.label.localeCompare(b.label));
}

function stripMarkdown(body: string): string {
  return body
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/^- \[[ xX]\]\s*/gm, "")
    .replace(/[`*_#>[\]]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 4000);
}

export function getSearchIndex() {
  return getAllTopics().map((t) => ({
    id: t.id,
    title: t.title,
    category: t.category,
    slug: t.slug,
    priority: t.priority,
    note: t.note ?? "",
    content: stripMarkdown(t.body),
  }));
}

export { getCategoryGroups };

export interface ReadinessDimension {
  key: string;
  label: string;
  score: number; // 0-100
  topicsCount: number;
}

export interface ReadinessScores {
  overall: number;
  dimensions: ReadinessDimension[];
}

// A category can be "not started" (score 0) or "no content yet" (excluded from
// the overall average so an empty dimension doesn't drag the score down).
function scoreForTopics(topics: TopicWithProgress[]): number | null {
  if (topics.length === 0) return null;
  const completion = topics.reduce((s, t) => s + t.percent, 0) / topics.length;
  const masteryRatio =
    (topics.filter((t) => t.progress.status === "mastered" || t.progress.status === "expert")
      .length /
      topics.length) *
    100;
  const avgConfidence = topics.reduce((s, t) => s + t.progress.confidence, 0) / topics.length;
  const confidenceScore = (avgConfidence / 5) * 100;
  return Math.round(completion * 0.4 + masteryRatio * 0.35 + confidenceScore * 0.25);
}

// category key -> readiness dimension label. "resume" doubles as "project
// discussion readiness" since that's exactly what the resume deep-dive covers.
const READINESS_DIMENSIONS: { key: string; label: string; categories: string[] }[] = [
  { key: "backend", label: "Backend", categories: ["backend"] },
  { key: "system_design", label: "System Design", categories: ["system_design"] },
  { key: "dbms", label: "DBMS", categories: ["dbms"] },
  { key: "os", label: "Operating Systems", categories: ["os"] },
  { key: "networking", label: "Networking", categories: ["networking"] },
  { key: "behavioral", label: "Behavioral", categories: ["behavioral"] },
  { key: "projects", label: "Project Discussion", categories: ["resume"] },
];

export async function getReadinessScores(userId: string): Promise<ReadinessScores> {
  const topics = await getTopicsWithProgress(userId);

  const dimensions: ReadinessDimension[] = READINESS_DIMENSIONS.map((d) => {
    const scoped = topics.filter((t) => d.categories.includes(t.category));
    return {
      key: d.key,
      label: d.label,
      score: scoreForTopics(scoped) ?? 0,
      topicsCount: scoped.length,
    };
  });

  const overallInputs = dimensions.filter((d) => d.topicsCount > 0);
  const overall =
    overallInputs.length > 0
      ? Math.round(overallInputs.reduce((s, d) => s + d.score, 0) / overallInputs.length)
      : 0;

  return { overall, dimensions };
}
