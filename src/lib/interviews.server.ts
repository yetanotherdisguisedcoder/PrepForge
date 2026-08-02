import "server-only";
import { pool } from "./db";
import type { InterviewLog, InterviewOutcome, InterviewType } from "./types";

function toDateStr(d: Date | string | null): string | null {
  if (!d) return null;
  return typeof d === "string" ? d : d.toISOString().slice(0, 10);
}

function rowToLog(row: {
  id: number;
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

export async function listInterviewLogs(): Promise<InterviewLog[]> {
  const { rows } = await pool.query(
    "select * from interview_logs order by interview_date desc nulls last, created_at desc",
  );
  return rows.map(rowToLog);
}

export async function getInterviewLog(id: number): Promise<InterviewLog | null> {
  const { rows } = await pool.query("select * from interview_logs where id = $1", [id]);
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

export async function createInterviewLog(input: InterviewLogInput): Promise<number> {
  const { rows } = await pool.query(
    `insert into interview_logs
       (company, role, round, interview_date, interview_type, outcome, rating, questions, notes)
     values ($1, $2, $3, $4, $5, $6, $7, $8, $9)
     returning id`,
    [
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

export async function updateInterviewLog(id: number, input: InterviewLogInput): Promise<void> {
  await pool.query(
    `update interview_logs set
       company = $2, role = $3, round = $4, interview_date = $5, interview_type = $6,
       outcome = $7, rating = $8, questions = $9, notes = $10, updated_at = now()
     where id = $1`,
    [
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

export async function deleteInterviewLog(id: number): Promise<void> {
  await pool.query("delete from interview_logs where id = $1", [id]);
}

export interface InterviewStats {
  total: number;
  byOutcome: Record<InterviewOutcome, number>;
  byCompany: { company: string; count: number }[];
}

export async function getInterviewStats(): Promise<InterviewStats> {
  const logs = await listInterviewLogs();
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
