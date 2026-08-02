import Link from "next/link";
import { notFound } from "next/navigation";
import { getTopic } from "@/lib/resources.server";
import { getEntry } from "@/lib/progress.server";
import { CATEGORY_LABELS_CLIENT } from "@/lib/category-labels";
import { Badge } from "@/components/ui/badge";
import { TopicControls } from "@/components/topic-controls";
import { TopicBody } from "@/components/topic-body";
import { ResumeMappingPanel } from "@/components/resume-mapping-panel";
import { getResumeMapping } from "@/lib/resume-map.server";
import { ChevronLeft } from "lucide-react";

export const dynamic = "force-dynamic";

const PRIORITY_COLORS: Record<string, string> = {
  P0: "border-red-500/50 text-red-600 dark:text-red-400",
  P1: "border-orange-500/50 text-orange-600 dark:text-orange-400",
  P2: "border-yellow-500/50 text-yellow-600 dark:text-yellow-400",
  P3: "border-muted-foreground/30 text-muted-foreground",
};

export default async function TopicPage({
  params,
}: {
  params: Promise<{ category: string; slug: string }>;
}) {
  const { category, slug } = await params;
  const topic = getTopic(category, slug);
  if (!topic) notFound();

  const progress = await getEntry(topic.id);

  return (
    <div className="max-w-4xl mx-auto p-6 md:p-10 space-y-6">
      <Link
        href={`/roadmap?category=${category}`}
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
      >
        <ChevronLeft className="size-4" />
        {CATEGORY_LABELS_CLIENT[category] ?? category}
      </Link>

      <div className="space-y-2">
        <div className="flex items-center gap-2 flex-wrap">
          <Badge variant="outline" className={PRIORITY_COLORS[topic.priority]}>
            {topic.priority}
          </Badge>
          {topic.number && (
            <span className="text-xs text-muted-foreground tabular-nums">{topic.number}</span>
          )}
          {topic.part && (
            <span className="text-xs text-muted-foreground truncate">{topic.part}</span>
          )}
        </div>
        <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">{topic.title}</h1>
        {topic.note && (
          <p className="text-sm text-muted-foreground italic border-l-2 pl-3">{topic.note}</p>
        )}
      </div>

      <div className="border-y py-4">
        <TopicControls
          topicId={topic.id}
          initialStatus={progress.status}
          initialConfidence={progress.confidence}
        />
      </div>

      <TopicBody
        topicId={topic.id}
        body={topic.body}
        initialChecked={progress.checkedItems}
      />

      {category === "resume" && <ResumeMappingPanel mapping={getResumeMapping(topic)} />}
    </div>
  );
}
