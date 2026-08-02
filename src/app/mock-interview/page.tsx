import { getMockQuestionPool } from "@/lib/mock-interview.server";
import { listRecentMockAttempts } from "@/lib/mock-interview.server";
import { InterviewSession } from "@/components/mock-interview/interview-session";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const dynamic = "force-dynamic";

export default async function MockInterviewPage() {
  const [questions, history] = await Promise.all([
    getMockQuestionPool(40),
    listRecentMockAttempts(10),
  ]);

  return (
    <div className="max-w-3xl mx-auto p-6 md:p-10 space-y-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">🎙 Voice Interview Mode</h1>
        <p className="text-muted-foreground mt-1">
          One question at a time. Answer out loud, get scored on concept coverage, and see what
          you missed.
        </p>
      </div>

      <InterviewSession questions={questions} />

      {history.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Recent attempts</CardTitle>
          </CardHeader>
          <CardContent className="space-y-1">
            {history.map((h) => (
              <div
                key={h.id}
                className="flex items-center justify-between text-sm border-b last:border-0 py-2"
              >
                <span className="truncate flex-1">{h.question}</span>
                <span className="text-muted-foreground tabular-nums ml-3 shrink-0">
                  {h.score}% · {h.durationSeconds}s
                </span>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
