import Link from "next/link";
import { listNotes } from "@/lib/notes.server";
import { NewNoteButton } from "@/components/new-note-button";
import { Card, CardContent } from "@/components/ui/card";
import { StickyNote } from "lucide-react";
import { requireUserId } from "@/lib/auth.server";

export const dynamic = "force-dynamic";

export default async function NotesPage() {
  const userId = await requireUserId();
  const notes = await listNotes(userId);

  return (
    <div className="max-w-4xl mx-auto p-6 md:p-10 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Notes</h1>
          <p className="text-muted-foreground mt-1">
            Freeform markdown notes — anything not covered by the handbook.
          </p>
        </div>
        <NewNoteButton />
      </div>

      {notes.length === 0 ? (
        <Card>
          <CardContent className="py-12 flex flex-col items-center text-center gap-2 text-muted-foreground">
            <StickyNote className="size-8" />
            <p>No notes yet. Create your first one.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid sm:grid-cols-2 gap-3">
          {notes.map((n) => (
            <Link key={n.slug} href={`/notes/${n.slug}`}>
              <Card className="h-full hover:bg-accent transition-colors">
                <CardContent className="pt-6">
                  <h3 className="font-medium truncate">{n.title}</h3>
                  <p className="text-sm text-muted-foreground mt-1 line-clamp-3">
                    {n.body || "Empty note"}
                  </p>
                  <p className="text-xs text-muted-foreground mt-3">
                    {n.updatedAt ? new Date(n.updatedAt).toLocaleString() : ""}
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
