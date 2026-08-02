import "server-only";
import { getTopicsWithProgress, type TopicWithProgress } from "./aggregate.server";
import { computeTopicWeight, seededRng, todaySeed, weightedSample } from "./adaptive.server";

export interface DailyFlashcard {
  id: string;
  topicId: string;
  topicSlug: string;
  topicTitle: string;
  category: string;
  front: string;
  back: string;
}

export interface DailyQuestion {
  id: string;
  topicId: string;
  topicSlug: string;
  topicTitle: string;
  category: string;
  text: string;
  context?: string;
}

export interface ProjectDeepDive {
  topicId: string;
  title: string;
  category: string;
  slug: string;
}

export interface DailyQueue {
  date: string;
  flashcards: DailyFlashcard[];
  rapidFire: DailyQuestion[];
  systemDesign: DailyQuestion[];
  behavioral: DailyQuestion[];
  projectDeepDive: ProjectDeepDive | null;
  commandLine: DailyQuestion[];
}

interface ChecklistItem {
  index: number;
  text: string;
}

function extractChecklistItems(body: string): ChecklistItem[] {
  const items: ChecklistItem[] = [];
  const re = /^- \[[ xX]\]\s*(.+)$/gm;
  let match: RegExpExecArray | null;
  let index = 0;
  while ((match = re.exec(body)) !== null) {
    items.push({ index: index++, text: match[1].trim() });
  }
  return items;
}

function stripMd(text: string): string {
  return text
    .replace(/\*\*(.+?)\*\*/g, "$1")
    .replace(/\*(.+?)\*/g, "$1")
    .replace(/`/g, "")
    .trim();
}

function bulletToFlashcard(text: string): { front: string; back: string } {
  const back = stripMd(text);
  const boldMatch = text.match(/^\*\*(.+?)\*\*/);
  if (boldMatch) {
    return { front: boldMatch[1].trim(), back };
  }
  const dashMatch = text.match(/^(.+?)\s+—\s+/);
  if (dashMatch) {
    return { front: stripMd(dashMatch[1]), back };
  }
  const truncated = stripMd(text).slice(0, 70);
  return { front: truncated.length < stripMd(text).length ? `${truncated}…` : truncated, back };
}

function extractNumberedQuestions(body: string): string[] {
  const questions: string[] = [];
  const re = /^\d+[a-z]?\.\s+(.+)$/gm;
  let match: RegExpExecArray | null;
  while ((match = re.exec(body)) !== null) {
    questions.push(stripMd(match[1]));
  }
  return questions;
}

const CLI_CATEGORIES = ["os", "networking", "devops", "kubernetes"];
const MIN_CLI_TOKEN_LENGTH = 2;

function extractCliCandidates(
  topic: TopicWithProgress,
): { command: string; context: string }[] {
  const out: { command: string; context: string }[] = [];
  for (const item of extractChecklistItems(topic.body)) {
    const tokens = [...item.text.matchAll(/`([^`]+)`/g)].map((m) => m[1]);
    for (const token of tokens) {
      if (token.length >= MIN_CLI_TOKEN_LENGTH && !token.includes("\n")) {
        out.push({ command: token, context: stripMd(item.text) });
      }
    }
  }
  return out;
}

export async function getDailyQueue(): Promise<DailyQueue> {
  const topics = await getTopicsWithProgress();
  const today = new Date().toISOString().slice(0, 10);
  const weights = new Map(topics.map((t) => [t.id, computeTopicWeight(t, today)]));

  // --- Flashcard + rapid-fire pool: every checklist bullet across every topic ---
  const cardPool: (DailyFlashcard & { weight: number })[] = [];
  for (const t of topics) {
    const w = weights.get(t.id)!;
    for (const item of extractChecklistItems(t.body)) {
      const { front, back } = bulletToFlashcard(item.text);
      cardPool.push({
        id: `${t.id}#${item.index}`,
        topicId: t.id,
        topicSlug: t.slug,
        topicTitle: t.title,
        category: t.category,
        front,
        back,
        weight: w,
      });
    }
  }

  const rngCards = seededRng(todaySeed(1));
  const flashcardsRaw = weightedSample(cardPool, (c) => c.weight, 20, rngCards);
  const flashcardIds = new Set(flashcardsRaw.map((c) => c.id));
  const rapidFirePool = cardPool.filter((c) => !flashcardIds.has(c.id));
  const rngRapid = seededRng(todaySeed(2));
  const rapidFireRaw = weightedSample(rapidFirePool, (c) => c.weight, 10, rngRapid);

  const stripWeight = <T extends { weight: number }>(c: T): Omit<T, "weight"> => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { weight, ...rest } = c;
    return rest;
  };

  const flashcards = flashcardsRaw.map(stripWeight);
  const rapidFire: DailyQuestion[] = rapidFireRaw.map((c) => ({
    id: c.id,
    topicId: c.topicId,
    topicSlug: c.topicSlug,
    topicTitle: c.topicTitle,
    category: c.category,
    text: c.front,
    context: c.back,
  }));

  // --- System design prompts ---
  // Scoped to the "classic problems" topic specifically — other system_design
  // topics are concept checklists, not "design X" prompts, and read awkwardly
  // if force-fitted into that phrasing.
  const sdTopics = topics.filter(
    (t) => t.category === "system_design" && t.number === "8.4",
  );
  const sdPool: (DailyQuestion & { weight: number })[] = [];
  for (const t of sdTopics) {
    const w = weights.get(t.id)!;
    for (const item of extractChecklistItems(t.body)) {
      sdPool.push({
        id: `${t.id}#${item.index}`,
        topicId: t.id,
        topicSlug: t.slug,
        topicTitle: t.title,
        category: t.category,
        text: `Design: ${stripMd(item.text)}`,
        weight: w,
      });
    }
  }
  const systemDesign = weightedSample(sdPool, (c) => c.weight, 2, seededRng(todaySeed(3))).map(
    stripWeight,
  );

  // --- Behavioral questions ---
  const behTopics = topics.filter((t) => t.category === "behavioral");
  const behPool: (DailyQuestion & { weight: number })[] = [];
  for (const t of behTopics) {
    const w = weights.get(t.id)!;
    let i = 0;
    for (const q of extractNumberedQuestions(t.body)) {
      behPool.push({
        id: `${t.id}#q${i++}`,
        topicId: t.id,
        topicSlug: t.slug,
        topicTitle: t.title,
        category: t.category,
        text: q,
        weight: w,
      });
    }
  }
  const behavioral = weightedSample(behPool, (c) => c.weight, 2, seededRng(todaySeed(4))).map(
    stripWeight,
  );

  // --- Project deep dive: one resume bullet (CodInferno/SDE role/CloudNap sections) ---
  const projectTopics = topics.filter(
    (t) => t.category === "resume" && /^SECTION [ABC]/.test(t.part ?? ""),
  );
  const projectPicked = weightedSample(
    projectTopics,
    (t) => weights.get(t.id)!,
    1,
    seededRng(todaySeed(5)),
  )[0];
  const projectDeepDive: ProjectDeepDive | null = projectPicked
    ? {
        topicId: projectPicked.id,
        title: projectPicked.title,
        category: projectPicked.category,
        slug: projectPicked.slug,
      }
    : null;

  // --- Command-line questions ---
  const cliTopics = topics.filter((t) => CLI_CATEGORIES.includes(t.category));
  const cliPool: (DailyQuestion & { weight: number })[] = [];
  for (const t of cliTopics) {
    const w = weights.get(t.id)!;
    let i = 0;
    for (const { command, context } of extractCliCandidates(t)) {
      cliPool.push({
        id: `${t.id}#cli${i++}`,
        topicId: t.id,
        topicSlug: t.slug,
        topicTitle: t.title,
        category: t.category,
        text: `What does \`${command}\` do, and when would you reach for it?`,
        context,
        weight: w,
      });
    }
  }
  const commandLine = weightedSample(cliPool, (c) => c.weight, 5, seededRng(todaySeed(6))).map(
    stripWeight,
  );

  return { date: today, flashcards, rapidFire, systemDesign, behavioral, projectDeepDive, commandLine };
}
