import "server-only";
import { pool } from "./db";
import type { ProgressEntry, ProgressMap, TopicStatus } from "./types";

function toDateStr(d: Date | string | null): string | null {
  if (!d) return null;
  return typeof d === "string" ? d : d.toISOString().slice(0, 10);
}

function rowToEntry(row: {
  status: TopicStatus;
  confidence: number;
  review_count: number;
  last_reviewed: Date | string | null;
  next_review: Date | string | null;
  quiz_score: number | null;
  checked_items: number[] | null;
}): ProgressEntry {
  return {
    status: row.status,
    confidence: row.confidence,
    reviewCount: row.review_count,
    lastReviewed: toDateStr(row.last_reviewed),
    nextReview: toDateStr(row.next_review),
    quizScore: row.quiz_score,
    checkedItems: row.checked_items ?? [],
  };
}

const EMPTY_ENTRY: ProgressEntry = {
  status: "not-started",
  confidence: 0,
  reviewCount: 0,
  lastReviewed: null,
  nextReview: null,
  quizScore: null,
  checkedItems: [],
};

export async function readProgress(userId: string): Promise<ProgressMap> {
  const { rows } = await pool.query("select * from topic_progress where user_id = $1", [userId]);
  const map: ProgressMap = {};
  for (const row of rows) map[row.topic_id] = rowToEntry(row);
  return map;
}

export async function getEntry(userId: string, topicId: string): Promise<ProgressEntry> {
  const { rows } = await pool.query(
    "select * from topic_progress where user_id = $1 and topic_id = $2",
    [userId, topicId],
  );
  return rows.length > 0 ? rowToEntry(rows[0]) : EMPTY_ENTRY;
}

const REVISION_INTERVALS_DAYS = [1, 3, 7, 14, 30, 90];

function nextReviewDate(reviewCount: number): string {
  const days =
    REVISION_INTERVALS_DAYS[Math.min(reviewCount, REVISION_INTERVALS_DAYS.length - 1)];
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}

async function bumpActivity(userId: string) {
  const today = new Date().toISOString().slice(0, 10);
  await pool.query(
    `insert into activity_log (user_id, day, events) values ($1, $2, 1)
     on conflict (user_id, day) do update set events = activity_log.events + 1`,
    [userId, today],
  );
}

async function upsertEntry(userId: string, topicId: string, entry: ProgressEntry) {
  await pool.query(
    `insert into topic_progress
       (user_id, topic_id, status, confidence, review_count, last_reviewed, next_review, quiz_score, checked_items)
     values ($1, $2, $3, $4, $5, $6, $7, $8, $9)
     on conflict (user_id, topic_id) do update set
       status = excluded.status,
       confidence = excluded.confidence,
       review_count = excluded.review_count,
       last_reviewed = excluded.last_reviewed,
       next_review = excluded.next_review,
       quiz_score = excluded.quiz_score,
       checked_items = excluded.checked_items`,
    [
      userId,
      topicId,
      entry.status,
      entry.confidence,
      entry.reviewCount,
      entry.lastReviewed,
      entry.nextReview,
      entry.quizScore,
      entry.checkedItems,
    ],
  );
}

export async function setStatus(
  userId: string,
  topicId: string,
  status: TopicStatus,
): Promise<ProgressEntry> {
  const prev = await getEntry(userId, topicId);
  const today = new Date().toISOString().slice(0, 10);
  const reviewCount =
    status === "mastered" || status === "expert" ? prev.reviewCount + 1 : prev.reviewCount;
  const entry: ProgressEntry = {
    ...prev,
    status,
    lastReviewed: today,
    reviewCount,
    nextReview: nextReviewDate(reviewCount),
  };
  await upsertEntry(userId, topicId, entry);
  await bumpActivity(userId);
  return entry;
}

export async function setConfidence(
  userId: string,
  topicId: string,
  confidence: number,
): Promise<ProgressEntry> {
  const prev = await getEntry(userId, topicId);
  const entry: ProgressEntry = { ...prev, confidence };
  await upsertEntry(userId, topicId, entry);
  await bumpActivity(userId);
  return entry;
}

export type FlashcardRating = "again" | "hard" | "good" | "easy";

/** Anki-style rating feeds straight into the topic's confidence/status —
 * this is the "adaptive learning" feedback loop: a bad recall today makes
 * that topic more likely to resurface in tomorrow's queue, a string of good
 * recalls fades it out. */
export async function rateFlashcard(
  userId: string,
  topicId: string,
  rating: FlashcardRating,
): Promise<ProgressEntry> {
  const prev = await getEntry(userId, topicId);
  let confidence = prev.confidence;
  let status = prev.status;

  switch (rating) {
    case "again":
      confidence = Math.max(0, confidence - 1);
      if (status === "mastered" || status === "expert") status = "needs-revision";
      else if (status === "not-started") status = "learning";
      break;
    case "hard":
      confidence = Math.max(1, Math.min(confidence, 2));
      if (status === "not-started") status = "learning";
      break;
    case "good":
      confidence = Math.min(5, confidence + 1);
      if (status === "not-started") status = "learning";
      break;
    case "easy":
      confidence = Math.min(5, confidence + 1);
      if (status === "not-started") status = "learning";
      if (status === "learning" && confidence >= 4) status = "mastered";
      break;
  }

  const today = new Date().toISOString().slice(0, 10);
  const reviewCount = prev.reviewCount + 1;
  const entry: ProgressEntry = {
    ...prev,
    status,
    confidence,
    reviewCount,
    lastReviewed: today,
    nextReview: nextReviewDate(reviewCount),
  };
  await upsertEntry(userId, topicId, entry);
  await bumpActivity(userId);
  return entry;
}

export async function toggleChecklistItem(
  userId: string,
  topicId: string,
  index: number,
): Promise<ProgressEntry> {
  const prev = await getEntry(userId, topicId);
  const has = prev.checkedItems.includes(index);
  const checkedItems = has
    ? prev.checkedItems.filter((i) => i !== index)
    : [...prev.checkedItems, index].sort((a, b) => a - b);
  const entry: ProgressEntry = { ...prev, checkedItems };
  await upsertEntry(userId, topicId, entry);
  await bumpActivity(userId);
  return entry;
}

export async function readActivitySince(
  userId: string,
  startDate: string,
): Promise<Record<string, number>> {
  const { rows } = await pool.query(
    "select day, events from activity_log where user_id = $1 and day >= $2",
    [userId, startDate],
  );
  const map: Record<string, number> = {};
  for (const row of rows) map[toDateStr(row.day)!] = row.events;
  return map;
}

export async function currentStreak(userId: string): Promise<number> {
  const { rows } = await pool.query(
    "select day from activity_log where user_id = $1 order by day desc limit 400",
    [userId],
  );
  const days = new Set(rows.map((r) => toDateStr(r.day)));
  let streak = 0;
  const d = new Date();
  for (;;) {
    const key = d.toISOString().slice(0, 10);
    if (days.has(key)) {
      streak++;
      d.setDate(d.getDate() - 1);
    } else {
      break;
    }
  }
  return streak;
}
