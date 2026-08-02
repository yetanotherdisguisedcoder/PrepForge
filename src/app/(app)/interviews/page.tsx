import Link from "next/link";
import { listInterviewLogs, getInterviewStats } from "@/lib/interviews.server";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Plus, Briefcase } from "lucide-react";
import { requireUserId } from "@/lib/auth.server";

export const dynamic = "force-dynamic";

const OUTCOME_STYLES: Record<string, string> = {
  pending: "border-yellow-500/50 text-yellow-600 dark:text-yellow-400",
  passed: "border-emerald-500/50 text-emerald-600 dark:text-emerald-400",
  rejected: "border-red-500/50 text-red-600 dark:text-red-400",
  no_response: "border-muted-foreground/30 text-muted-foreground",
  withdrew: "border-muted-foreground/30 text-muted-foreground",
};

const OUTCOME_LABELS: Record<string, string> = {
  pending: "Pending",
  passed: "Passed",
  rejected: "Rejected",
  no_response: "No response",
  withdrew: "Withdrew",
};

const TYPE_LABELS: Record<string, string> = {
  technical: "Technical",
  system_design: "System Design",
  behavioral: "Behavioral",
  hr: "HR / Recruiter",
  take_home: "Take-home",
  other: "Other",
};

export default async function InterviewsPage() {
  const userId = await requireUserId();
  const [logs, stats] = await Promise.all([
    listInterviewLogs(userId),
    getInterviewStats(userId),
  ]);

  return (
    <div className="max-w-4xl mx-auto p-6 md:p-10 space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Interview Log</h1>
          <p className="text-muted-foreground mt-1">
            {stats.total} interview{stats.total === 1 ? "" : "s"} logged
            {stats.total > 0 &&
              ` across ${stats.byCompany.length} compan${stats.byCompany.length === 1 ? "y" : "ies"}`}
          </p>
        </div>
        <Link href="/interviews/new">
          <Button>
            <Plus className="size-4" /> Log interview
          </Button>
        </Link>
      </div>

      {logs.length === 0 ? (
        <Card>
          <CardContent className="py-12 flex flex-col items-center text-center gap-2 text-muted-foreground">
            <Briefcase className="size-8" />
            <p>No interviews logged yet — record one after your next round.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-2">
          {logs.map((log) => (
            <Link key={log.id} href={`/interviews/${log.id}`}>
              <Card className="hover:bg-accent transition-colors">
                <CardContent className="py-4 flex items-center gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-medium">{log.company}</span>
                      {log.role && (
                        <span className="text-muted-foreground text-sm">· {log.role}</span>
                      )}
                      <Badge variant="outline" className="text-[10px]">
                        {TYPE_LABELS[log.interviewType]}
                      </Badge>
                    </div>
                    <div className="text-sm text-muted-foreground truncate mt-0.5">
                      {log.round || "—"}
                      {log.interviewDate && ` · ${log.interviewDate}`}
                    </div>
                  </div>
                  <Badge variant="outline" className={OUTCOME_STYLES[log.outcome]}>
                    {OUTCOME_LABELS[log.outcome]}
                  </Badge>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
