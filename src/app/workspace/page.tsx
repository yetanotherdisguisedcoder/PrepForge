import Link from "next/link";
import { listDesigns } from "@/lib/designs.server";
import { NewDesignButton } from "@/components/workspace/new-design-button";
import { Card, CardContent } from "@/components/ui/card";
import { Boxes } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function WorkspacePage() {
  const designs = await listDesigns();

  return (
    <div className="max-w-3xl mx-auto p-6 md:p-10 space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">System Design Workspace</h1>
          <p className="text-muted-foreground mt-1">
            Sketch architectures, save versions, and compare against reference designs.
          </p>
        </div>
        <NewDesignButton />
      </div>

      {designs.length === 0 ? (
        <Card>
          <CardContent className="py-12 flex flex-col items-center text-center gap-2 text-muted-foreground">
            <Boxes className="size-8" />
            <p>No designs yet — sketch your first architecture.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid sm:grid-cols-2 gap-3">
          {designs.map((d) => (
            <Link key={d.id} href={`/workspace/${d.id}`}>
              <Card className="hover:bg-accent transition-colors">
                <CardContent className="pt-6">
                  <h3 className="font-medium">{d.title}</h3>
                  <p className="text-xs text-muted-foreground mt-1">
                    Updated {new Date(d.updatedAt).toLocaleString()}
                  </p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
