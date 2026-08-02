import "server-only";
import { getTopicsWithProgress, type TopicWithProgress } from "./aggregate.server";

/** Deterministic per-day seed so the queue stays stable all day and rotates
 * to something new tomorrow — no persistence needed to "remember" today's picks. */
export function todaySeed(salt = 0): number {
  const days = Math.floor(Date.now() / 86_400_000);
  return days * 1000 + salt;
}

// mulberry32 — small, fast, deterministic PRNG from an integer seed.
export function seededRng(seed: number): () => number {
  let a = seed >>> 0;
  return function rng() {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const PRIORITY_MULTIPLIER: Record<string, number> = { P0: 1.5, P1: 1.2, P2: 1.0, P3: 0.7 };

/** Higher = more urgent to practice today. Weak/overdue topics dominate;
 * confidently-mastered topics fade out almost entirely (adaptive learning:
 * "increase practice on weak topics, reduce time on mastered ones"). */
export function computeTopicWeight(topic: TopicWithProgress, today: string): number {
  let weight = 1;
  const p = topic.progress;

  if (p.nextReview && p.nextReview < today) {
    const daysOverdue = Math.max(
      0,
      Math.round((Date.parse(today) - Date.parse(p.nextReview)) / 86_400_000),
    );
    weight += 5 + daysOverdue * 0.5;
  } else if (p.nextReview && p.nextReview === today) {
    weight += 3;
  }

  if (p.status === "needs-revision") weight += 4;
  if (p.status === "not-started") weight += 1;
  if (p.confidence > 0 && p.confidence <= 2) weight += 3;

  if (p.status === "mastered" && p.confidence >= 4) weight *= 0.1;
  if (p.status === "expert") weight *= 0.03;

  weight *= PRIORITY_MULTIPLIER[topic.priority] ?? 1;

  return Math.max(weight, 0.01);
}

/** "Frequently forgotten": reviewed more than once but still not sticking. */
export function isFrequentlyForgotten(topic: TopicWithProgress): boolean {
  const p = topic.progress;
  return p.reviewCount >= 2 && (p.status === "needs-revision" || (p.confidence > 0 && p.confidence <= 2));
}

export function getFrequentlyForgotten(topics: TopicWithProgress[]): TopicWithProgress[] {
  return topics
    .filter(isFrequentlyForgotten)
    .sort((a, b) => b.progress.reviewCount - a.progress.reviewCount)
    .slice(0, 8);
}

export async function getFrequentlyForgottenTopics(): Promise<TopicWithProgress[]> {
  const topics = await getTopicsWithProgress();
  return getFrequentlyForgotten(topics);
}

/** Weighted sample without replacement, using a seeded RNG for determinism. */
export function weightedSample<T>(
  items: T[],
  weightFn: (item: T) => number,
  count: number,
  rng: () => number,
): T[] {
  const pool = items.map((item) => ({ item, weight: Math.max(weightFn(item), 0.0001) }));
  const picked: T[] = [];
  while (picked.length < count && pool.length > 0) {
    const total = pool.reduce((s, p) => s + p.weight, 0);
    let r = rng() * total;
    let idx = 0;
    for (; idx < pool.length; idx++) {
      r -= pool[idx].weight;
      if (r <= 0) break;
    }
    const chosenIdx = Math.min(idx, pool.length - 1);
    picked.push(pool[chosenIdx].item);
    pool.splice(chosenIdx, 1);
  }
  return picked;
}
