import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { getInterviewLog } from "@/lib/interviews.server";
import { InterviewForm } from "@/components/interview-form";
import { requireUserId } from "@/lib/auth.server";

export const dynamic = "force-dynamic";

export default async function InterviewDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  if (!/^\d+$/.test(id)) notFound();

  const userId = await requireUserId();
  const log = await getInterviewLog(userId, id);
  if (!log) notFound();

  return (
    <div className="max-w-3xl mx-auto p-6 md:p-10 space-y-6">
      <Link
        href="/interviews"
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
      >
        <ChevronLeft className="size-4" /> Interview Log
      </Link>
      <h1 className="text-2xl font-semibold tracking-tight">{log.company}</h1>
      <InterviewForm existing={log} />
    </div>
  );
}
