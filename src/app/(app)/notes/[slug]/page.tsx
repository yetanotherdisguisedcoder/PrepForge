import { notFound } from "next/navigation";
import { getNote } from "@/lib/notes.server";
import { NoteEditor } from "@/components/note-editor";
import { requireUserId } from "@/lib/auth.server";

export const dynamic = "force-dynamic";

export default async function NotePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const userId = await requireUserId();
  const note = await getNote(userId, slug);
  if (!note) notFound();

  return (
    <div className="max-w-4xl mx-auto p-6 md:p-10">
      <NoteEditor slug={slug} initialTitle={note.title} initialBody={note.body} />
    </div>
  );
}
