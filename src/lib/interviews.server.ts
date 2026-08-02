import "server-only";
import { pool } from "./db";
import type { InterviewLog, InterviewOutcome, InterviewType } from "./types";

function toDateStr(d: Date | string | null): string | null {
  if (!d) return null;
  return typeof d === "string" ? d : d.toISOString().slice(0, 10);
}

function rowToLog(row: {
  id: string;
  company: string;
  role: string;
  round: string;
  interview_date: Date | string | null;
  interview_type: InterviewType;
  outcome: InterviewOutcome;
  rating: number | null;
  questions: string;
  notes: string;
  created_at: Date;
  updated_at: Date;
}): InterviewLog {
  return {
    id: row.id,
    company: row.company,
    role: row.role,
    round: row.round,
    interviewDate: toDateStr(row.interview_date),
    interviewType: row.interview_type,
    outcome: row.outcome,
    rating: row.rating,
    questions: row.questions,
    notes: row.notes,
    createdAt: row.created_at.toISOString(),
    updatedAt: row.updated_at.toISOString(),
  };
}

export async function listInterviewLogs(userId: string): Promise<InterviewLog[]> {
  const { rows } = await pool.query(
    "select * from interview_logs where user_id = $1 order by interview_date desc nulls last, created_at desc",
    [userId],
  );
  return rows.map(rowToLog);
}

// Every single-record lookup below filters by user_id AND id — never id alone.
// Without that, an authenticated user could read/edit/delete another user's
// row just by guessing its id (IDOR).
export async function getInterviewLog(userId: string, id: string): Promise<InterviewLog | null> {
  const { rows } = await pool.query(
    "select * from interview_logs where user_id = $1 and id = $2",
    [userId, id],
  );
  return rows.length > 0 ? rowToLog(rows[0]) : null;
}

export interface InterviewLogInput {
  company: string;
  role: string;
  round: string;
  interviewDate: string | null;
  interviewType: InterviewType;
  outcome: InterviewOutcome;
  rating: number | null;
  questions: string;
  notes: string;
}

export async function createInterviewLog(
  userId: string,
  input: InterviewLogInput,
): Promise<string> {
  const { rows } = await pool.query(
    `insert into interview_logs
       (user_id, company, role, round, interview_date, interview_type, outcome, rating, questions, notes)
     values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
     returning id`,
    [
      userId,
      input.company,
      input.role,
      input.round,
      input.interviewDate,
      input.interviewType,
      input.outcome,
      input.rating,
      input.questions,
      input.notes,
    ],
  );
  return rows[0].id;
}

export async function updateInterviewLog(
  userId: string,
  id: string,
  input: InterviewLogInput,
): Promise<void> {
  await pool.query(
    `update interview_logs set
       company = $3, role = $4, round = $5, interview_date = $6, interview_type = $7,
       outcome = $8, rating = $9, questions = $10, notes = $11, updated_at = now()
     where user_id = $1 and id = $2`,
    [
      userId,
      id,
      input.company,
      input.role,
      input.round,
      input.interviewDate,
      input.interviewType,
      input.outcome,
      input.rating,
      input.questions,
      input.notes,
    ],
  );
}

export async function deleteInterviewLog(userId: string, id: string): Promise<void> {
  await pool.query("delete from interview_logs where user_id = $1 and id = $2", [userId, id]);
}

export interface InterviewStats {
  total: number;
  byOutcome: Record<InterviewOutcome, number>;
  byCompany: { company: string; count: number }[];
}

export async function getInterviewStats(userId: string): Promise<InterviewStats> {
  const logs = await listInterviewLogs(userId);
  const byOutcome: Record<InterviewOutcome, number> = {
    pending: 0,
    passed: 0,
    rejected: 0,
    no_response: 0,
    withdrew: 0,
  };
  const companyCounts = new Map<string, number>();
  for (const log of logs) {
    byOutcome[log.outcome]++;
    companyCounts.set(log.company, (companyCounts.get(log.company) ?? 0) + 1);
  }
  return {
    total: logs.length,
    byOutcome,
    byCompany: [...companyCounts.entries()]
      .map(([company, count]) => ({ company, count }))
      .sort((a, b) => b.count - a.count),
  };
}
