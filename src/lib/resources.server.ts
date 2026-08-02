import "server-only";
import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import type { Topic, CategoryGroup, TopicFrontmatter } from "./types";
import { CATEGORY_LABELS_CLIENT } from "./category-labels";

// Lives inside the project (not a sibling directory) so it's included in the
// Vercel build output — anything outside the project root doesn't get bundled.
export const RESOURCES_DIR = path.join(process.cwd(), "content", "resources");

export const CATEGORY_LABELS = CATEGORY_LABELS_CLIENT;

function countChecklistItems(body: string): number {
  const matches = body.match(/^- \[[ xX]\]/gm);
  return matches ? matches.length : 0;
}

function walkMarkdownFiles(dir: string): string[] {
  if (!fs.existsSync(dir)) return [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const files: string[] = [];
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...walkMarkdownFiles(full));
    } else if (entry.name.endsWith(".md")) {
      files.push(full);
    }
  }
  return files;
}

/** Reads the resources/ tree fresh on every call — no build-time caching, so
 * new markdown files show up immediately without an app restart. */
export function getAllTopics(): Topic[] {
  if (!fs.existsSync(RESOURCES_DIR)) return [];
  const categoryDirs = fs
    .readdirSync(RESOURCES_DIR, { withFileTypes: true })
    .filter((e) => e.isDirectory())
    .map((e) => e.name)
    // "notes" holds freeform user notes (see notes.server.ts) — not handbook topics
    .filter((name) => name !== "notes");

  const topics: Topic[] = [];

  for (const category of categoryDirs) {
    const dir = path.join(RESOURCES_DIR, category);
    const files = walkMarkdownFiles(dir);
    for (const file of files) {
      const raw = fs.readFileSync(file, "utf8");
      const { data, content } = matter(raw);
      const slug = path
        .relative(dir, file)
        .replace(/\.md$/, "")
        .split(path.sep)
        .join("/");
      const fm = data as Partial<TopicFrontmatter>;
      topics.push({
        id: `${category}/${slug}`,
        slug,
        category,
        title: fm.title ?? slug,
        part: fm.part,
        number: fm.number,
        order: typeof fm.order === "number" ? fm.order : 0,
        priority: fm.priority ?? "P2",
        status: fm.status ?? "not-started",
        source: fm.source ?? "unknown",
        note: fm.note,
        body: content.trim(),
        checklistTotal: countChecklistItems(content),
      });
    }
  }

  return topics.sort((a, b) => {
    if (a.category !== b.category) return a.category.localeCompare(b.category);
    return a.order - b.order;
  });
}

export function getCategoryGroups(): CategoryGroup[] {
  const topics = getAllTopics();
  const byCategory = new Map<string, Topic[]>();
  for (const t of topics) {
    if (!byCategory.has(t.category)) byCategory.set(t.category, []);
    byCategory.get(t.category)!.push(t);
  }
  return [...byCategory.entries()]
    .map(([category, topics]) => ({
      category,
      label: CATEGORY_LABELS[category] ?? category,
      topics,
    }))
    .sort((a, b) => a.label.localeCompare(b.label));
}

export function getTopic(category: string, slug: string): Topic | null {
  const filePath = path.join(RESOURCES_DIR, category, `${slug}.md`);
  if (!fs.existsSync(filePath)) return null;
  const raw = fs.readFileSync(filePath, "utf8");
  const { data, content } = matter(raw);
  const fm = data as Partial<TopicFrontmatter>;
  return {
    id: `${category}/${slug}`,
    slug,
    category,
    title: fm.title ?? slug,
    part: fm.part,
    number: fm.number,
    order: typeof fm.order === "number" ? fm.order : 0,
    priority: fm.priority ?? "P2",
    status: fm.status ?? "not-started",
    source: fm.source ?? "unknown",
    note: fm.note,
    body: content.trim(),
    checklistTotal: countChecklistItems(content),
  };
}
