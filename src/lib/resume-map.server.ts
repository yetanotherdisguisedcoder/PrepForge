import "server-only";
import { getAllTopics } from "./resources.server";
import type { Topic } from "./types";

const STOPWORDS = new Set([
  "the", "and", "for", "with", "from", "this", "that", "your", "you", "are", "was",
  "were", "have", "has", "had", "not", "but", "all", "can", "use", "used", "using",
  "into", "onto", "over", "under", "also", "each", "per", "via", "how", "what",
  "when", "where", "why", "who", "which", "their", "them", "then", "than", "its",
  "a", "an", "of", "to", "in", "on", "at", "is", "be", "as", "or", "by", "you're",
]);

function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[`*_#>[\]()]/g, " ")
    .split(/[^a-z0-9+.]+/)
    .filter((w) => w.length >= 3 && !STOPWORDS.has(w));
}

interface KeywordEntry {
  topic: Topic;
  keywords: Set<string>;
}

function buildKeywordIndex(topics: Topic[]): KeywordEntry[] {
  return topics
    .filter((t) => t.category !== "resume")
    .map((t) => {
      const titleWords = tokenize(t.title);
      const boldTerms = [...t.body.matchAll(/\*\*(.+?)\*\*/g)]
        .slice(0, 15)
        .flatMap((m) => tokenize(m[1]));
      const codeTerms = [...t.body.matchAll(/`([^`]+)`/g)]
        .slice(0, 15)
        .map((m) => m[1].toLowerCase())
        .filter((w) => w.length >= 3);
      return { topic: t, keywords: new Set([...titleWords, ...boldTerms, ...codeTerms]) };
    });
}

function scoreMatch(haystack: string, entry: KeywordEntry): number {
  let score = 0;
  for (const kw of entry.keywords) {
    if (haystack.includes(kw)) score++;
  }
  return score;
}

export interface RelatedTopic {
  id: string;
  title: string;
  category: string;
  slug: string;
  score: number;
}

export interface ResumeMapping {
  concepts: RelatedTopic[];
  systemDesign: RelatedTopic[];
  behavioral: RelatedTopic[];
  siblings: RelatedTopic[];
}

const CONCEPT_CATEGORIES = [
  "backend", "dbms", "os", "networking", "cloud", "devops", "kubernetes",
  "dsa", "design_patterns", "frontend", "extras",
];

const BEHAVIORAL_FALLBACK_SLUGS = [
  "L2-2-most-complex-thing-you-ve-built",
  "L2-8-technical-judgment-architecture",
];

function toRelated(entry: KeywordEntry, score: number): RelatedTopic {
  return {
    id: entry.topic.id,
    title: entry.topic.title,
    category: entry.topic.category,
    slug: entry.topic.slug,
    score,
  };
}

export function getResumeMapping(resumeTopic: Topic): ResumeMapping {
  const all = getAllTopics();
  const index = buildKeywordIndex(all);
  const haystack = (resumeTopic.title + " " + resumeTopic.body).toLowerCase();

  const scored = index
    .map((entry) => ({ entry, score: scoreMatch(haystack, entry) }))
    .filter((s) => s.score > 0)
    .sort((a, b) => b.score - a.score);

  const concepts = scored
    .filter((s) => CONCEPT_CATEGORIES.includes(s.entry.topic.category))
    .slice(0, 6)
    .map((s) => toRelated(s.entry, s.score));

  const systemDesign = scored
    .filter((s) => s.entry.topic.category === "system_design")
    .slice(0, 3)
    .map((s) => toRelated(s.entry, s.score));

  let behavioral = scored
    .filter((s) => s.entry.topic.category === "behavioral")
    .slice(0, 3)
    .map((s) => toRelated(s.entry, s.score));

  if (behavioral.length === 0) {
    behavioral = all
      .filter((t) => t.category === "behavioral" && BEHAVIORAL_FALLBACK_SLUGS.includes(t.slug))
      .map((t) => ({ id: t.id, title: t.title, category: t.category, slug: t.slug, score: 0 }));
  }

  const siblings = all
    .filter(
      (t) => t.category === "resume" && t.part === resumeTopic.part && t.id !== resumeTopic.id,
    )
    .slice(0, 6)
    .map((t) => ({ id: t.id, title: t.title, category: t.category, slug: t.slug, score: 0 }));

  return { concepts, systemDesign, behavioral, siblings };
}

export interface ResumeGroup {
  part: string;
  label: string;
  topics: Topic[];
}

function shortLabel(part: string): string {
  return part
    .replace(/^SECTION [A-E]\s*—\s*/, "")
    .replace(/\s*\(.*$/, "")
    .trim();
}

export function getResumeGroups(): ResumeGroup[] {
  const resumeTopics = getAllTopics().filter((t) => t.category === "resume");
  const byPart = new Map<string, Topic[]>();
  for (const t of resumeTopics) {
    const part = t.part ?? "Other";
    if (!byPart.has(part)) byPart.set(part, []);
    byPart.get(part)!.push(t);
  }
  return [...byPart.entries()]
    .map(([part, topics]) => {
      const sortedTopics = [...topics].sort((a, b) => a.order - b.order);
      return {
        part,
        label: shortLabel(part),
        minOrder: sortedTopics[0]?.order ?? 0,
        topics: sortedTopics,
      };
    })
    .sort((a, b) => a.minOrder - b.minOrder)
    .map(({ part, label, topics }) => ({ part, label, topics }));
}
