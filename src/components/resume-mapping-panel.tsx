import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { ResumeMapping, RelatedTopic } from "@/lib/resume-map.server";

function RelatedList({ items }: { items: RelatedTopic[] }) {
  if (items.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        None found automatically — browse the roadmap for related material.
      </p>
    );
  }
  return (
    <div className="flex flex-wrap gap-2">
      {items.map((t) => (
        <Link key={t.id} href={`/topics/${t.category}/${t.slug}`}>
          <Badge variant="outline" className="hover:bg-accent transition-colors cursor-pointer">
            {t.title}
          </Badge>
        </Link>
      ))}
    </div>
  );
}

export function ResumeMappingPanel({ mapping }: { mapping: ResumeMapping }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">💼 Interview Mapping</CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">
        <div>
          <h3 className="text-sm font-medium mb-2">Concepts &amp; technologies involved</h3>
          <RelatedList items={mapping.concepts} />
        </div>
        <div>
          <h3 className="text-sm font-medium mb-2">System design scenarios</h3>
          <RelatedList items={mapping.systemDesign} />
        </div>
        <div>
          <h3 className="text-sm font-medium mb-2">Behavioral stories to pair with this</h3>
          <RelatedList items={mapping.behavioral} />
        </div>
        {mapping.siblings.length > 0 && (
          <div>
            <h3 className="text-sm font-medium mb-2">Other bullets from this project</h3>
            <RelatedList items={mapping.siblings} />
          </div>
        )}
      </CardContent>
    </Card>
  );
}
