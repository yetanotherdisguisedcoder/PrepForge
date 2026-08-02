import Link from "next/link";
import { getDailyQueue } from "@/lib/daily-queue.server";
import { FlashcardDeck } from "@/components/daily/flashcard-deck";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CATEGORY_LABELS_CLIENT } from "@/lib/category-labels";
import { requireUserId } from "@/lib/auth.server";

export const dynamic = "force-dynamic";

export default async function TodayPage() {
  const userId = await requireUserId();
  const queue = await getDailyQueue(userId);

  return (
    <div className="max-w-3xl mx-auto p-6 md:p-10 space-y-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Today&apos;s Revision Queue</h1>
        <p className="text-muted-foreground mt-1">
          {queue.date} — regenerates daily, weighted toward your weakest and most overdue topics.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">🧠 Flashcards ({queue.flashcards.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <FlashcardDeck cards={queue.flashcards} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">⚡ Rapid fire ({queue.rapidFire.length})</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {queue.rapidFire.length === 0 && (
            <p className="text-sm text-muted-foreground">Nothing generated yet — start tracking more topics.</p>
          )}
          {queue.rapidFire.map((q) => (
            <Link
              key={q.id}
              href={`/topics/${q.category}/${q.topicSlug}`}
              className="block text-sm border rounded-md p-3 hover:bg-accent transition-colors"
            >
              <p className="font-medium">{q.text}</p>
              {q.context && <p className="text-muted-foreground mt-1 text-xs">{q.context}</p>}
            </Link>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">🏗 System design ({queue.systemDesign.length})</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {queue.systemDesign.length === 0 && (
            <p className="text-sm text-muted-foreground">No system design content tracked yet.</p>
          )}
          {queue.systemDesign.map((q) => (
            <Link
              key={q.id}
              href={`/topics/${q.category}/${q.topicSlug}`}
              className="block text-sm border rounded-md p-3 hover:bg-accent transition-colors font-medium"
            >
              {q.text}
            </Link>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">🎙 Behavioral ({queue.behavioral.length})</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {queue.behavioral.length === 0 && (
            <p className="text-sm text-muted-foreground">No behavioral questions tracked yet.</p>
          )}
          {queue.behavioral.map((q) => (
            <Link
              key={q.id}
              href={`/topics/${q.category}/${q.topicSlug}`}
              className="block text-sm border rounded-md p-3 hover:bg-accent transition-colors font-medium"
            >
              {q.text}
            </Link>
          ))}
        </CardContent>
      </Card>

      {queue.projectDeepDive && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">💼 Project deep dive</CardTitle>
          </CardHeader>
          <CardContent>
            <Link
              href={`/topics/${queue.projectDeepDive.category}/${queue.projectDeepDive.slug}`}
              className="block text-sm border rounded-md p-4 hover:bg-accent transition-colors"
            >
              <p className="font-medium">{queue.projectDeepDive.title}</p>
              <p className="text-muted-foreground text-xs mt-1">
                Open it and talk through the whole thing out loud, end to end, unprompted.
              </p>
            </Link>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="text-base">⌨️ Command line ({queue.commandLine.length})</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {queue.commandLine.length === 0 && (
            <p className="text-sm text-muted-foreground">No command-line content tracked yet.</p>
          )}
          {queue.commandLine.map((q) => (
            <Link
              key={q.id}
              href={`/topics/${q.category}/${q.topicSlug}`}
              className="block text-sm border rounded-md p-3 hover:bg-accent transition-colors"
            >
              <p className="font-medium">{q.text}</p>
              {q.context && (
                <p className="text-muted-foreground mt-1 text-xs">
                  Context: {q.context} ·{" "}
                  <span className="text-[10px]">
                    {CATEGORY_LABELS_CLIENT[q.category] ?? q.category}
                  </span>
                </p>
              )}
            </Link>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
