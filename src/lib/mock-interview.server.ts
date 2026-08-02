import "server-only";
import { getTopicsWithProgress } from "./aggregate.server";
import { computeTopicWeight, seededRng, weightedSample } from "./adaptive.server";
import { pool } from "./db";

export interface MockQuestion {
  id: string;
  topicId: string;
  topicSlug: string;
  topicTitle: string;
  category: string;
  text: string;
  concepts: string[];
}

function stripMd(text: string): string {
  return text
    .replace(/\*\*(.+?)\*\*/g, "$1")
    .replace(/\*(.+?)\*/g, "$1")
    .replace(/`/g, "")
    .trim();
}

function extractConcepts(body: string): string[] {
  const bold = [...body.matchAll(/\*\*(.+?)\*\*/g)].map((m) => m[1]);
  const code = [...body.matchAll(/`([^`]+)`/g)].map((m) => m[1]);
  const combined = [...bold, ...code]
    .map((s) => s.replace(/[:,;].*$/, "").trim())
    .filter((s) => s.length > 0 && s.length < 40);
  return Array.from(new Set(combined)).slice(0, 10);
}

function extractNumberedQuestions(body: string): string[] {
  const out: string[] = [];
  const re = /^\d+[a-z]?\.\s+(.+)$/gm;
  let match: RegExpExecArray | null;
  while ((match = re.exec(body)) !== null) {
    out.push(stripMd(match[1]));
  }
  return out;
}

const TOPIC_PROMPT_CATEGORIES = [
  "backend", "dbms", "os", "networking", "cloud", "devops", "kubernetes",
  "dsa", "design_patterns", "frontend", "extras", "resume",
];

export async function getMockQuestionPool(userId: string, count = 40): Promise<MockQuestion[]> {
  const topics = await getTopicsWithProgress(userId);
  const today = new Date().toISOString().slice(0, 10);
  const candidates: (MockQuestion & { weight: number })[] = [];

  for (const t of topics) {
    const weight = computeTopicWeight(t, today);
    const concepts = extractConcepts(t.body);

    if (t.category === "behavioral") {
      let i = 0;
      for (const q of extractNumberedQuestions(t.body)) {
        candidates.push({
          id: `${t.id}#q${i++}`,
          topicId: t.id,
          topicSlug: t.slug,
          topicTitle: t.title,
          category: t.category,
          text: q,
          concepts,
          weight,
        });
      }
    } else if (t.category === "system_design" && t.number === "8.4") {
      const re = /^- \[[ xX]\]\s*(.+)$/gm;
      let match: RegExpExecArray | null;
      let i = 0;
      while ((match = re.exec(t.body)) !== null) {
        const clean = stripMd(match[1]);
        candidates.push({
          id: `${t.id}#d${i++}`,
          topicId: t.id,
          topicSlug: t.slug,
          topicTitle: t.title,
          category: t.category,
          text: `Design: ${clean}`,
          concepts: extractConcepts(clean),
          weight,
        });
      }
    } else if (TOPIC_PROMPT_CATEGORIES.includes(t.category) && concepts.length > 0) {
      candidates.push({
        id: `${t.id}#topic`,
        topicId: t.id,
        topicSlug: t.slug,
        topicTitle: t.title,
        category: t.category,
        text: `Explain: ${t.title}`,
        concepts,
        weight,
      });
    }
  }

  const rng = seededRng(Date.now() % 1_000_000);
  const picked = weightedSample(
    candidates,
    (q) => q.weight,
    Math.min(count, candidates.length),
    rng,
  );
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  return picked.map(({ weight, ...rest }) => rest);
}

export interface MockAttemptInput {
  topicId: string | null;
  question: string;
  transcript: string;
  durationSeconds: number;
  score: number;
  matchedConcepts: string[];
  missingConcepts: string[];
}

export async function saveMockAttempt(userId: string, input: MockAttemptInput): Promise<void> {
  await pool.query(
    `insert into mock_interview_attempts
       (user_id, topic_id, question, transcript, duration_seconds, score, matched_concepts, missing_concepts)
     values ($1, $2, $3, $4, $5, $6, $7, $8)`,
    [
      userId,
      input.topicId,
      input.question,
      input.transcript,
      input.durationSeconds,
      input.score,
      input.matchedConcepts,
      input.missingConcepts,
    ],
  );
}

export interface MockAttemptHistoryItem {
  id: string;
  question: string;
  score: number;
  durationSeconds: number;
  createdAt: string;
}

export async function listRecentMockAttempts(
  userId: string,
  limit = 10,
): Promise<MockAttemptHistoryItem[]> {
  const { rows } = await pool.query(
    "select id, question, score, duration_seconds, created_at from mock_interview_attempts where user_id = $1 order by created_at desc limit $2",
    [userId, limit],
  );
  return rows.map((r) => ({
    id: r.id,
    question: r.question,
    score: r.score,
    durationSeconds: r.duration_seconds,
    createdAt: r.created_at.toISOString(),
  }));
}
