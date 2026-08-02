import Link from "next/link";
import { getResumeGroups } from "@/lib/resume-map.server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const dynamic = "force-dynamic";

export default function ResumeMapPage() {
  const groups = getResumeGroups();

  return (
    <div className="max-w-4xl mx-auto p-6 md:p-10 space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Resume ↔ Interview Mapping</h1>
        <p className="text-muted-foreground mt-1">
          Click any resume bullet to see the concepts, technologies, system design scenarios, and
          behavioral stories it maps to.
        </p>
      </div>

      {groups.map((group) => (
        <Card key={group.part}>
          <CardHeader>
            <CardTitle className="text-base">{group.label}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-1">
            {group.topics.map((t) => (
              <Link
                key={t.id}
                href={`/topics/resume/${t.slug}`}
                className="block rounded-md px-3 py-2 text-sm hover:bg-accent transition-colors line-clamp-2"
              >
                {t.title}
              </Link>
            ))}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
