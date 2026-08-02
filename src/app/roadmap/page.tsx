import { getCategoryGroupsWithProgress } from "@/lib/aggregate.server";
import { RoadmapTree } from "@/components/roadmap-tree";

export const dynamic = "force-dynamic";

export default async function RoadmapPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const { category } = await searchParams;
  const groups = await getCategoryGroupsWithProgress();

  return (
    <div className="max-w-5xl mx-auto p-6 md:p-10 space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Roadmap</h1>
        <p className="text-muted-foreground mt-1">
          Every topic across the handbook, grouped by category. Expand, filter, and check off as
          you go.
        </p>
      </div>
      <RoadmapTree groups={groups} initialCategory={category} />
    </div>
  );
}
