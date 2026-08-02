import "server-only";
import { pool } from "./db";

export interface Note {
  slug: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  body: string;
}

function slugify(title: string): string {
  const base = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
  return base || `note-${Date.now()}`;
}

function rowToNote(row: {
  slug: string;
  title: string;
  body: string;
  created_at: Date;
  updated_at: Date;
}): Note {
  return {
    slug: row.slug,
    title: row.title,
    body: row.body,
    createdAt: row.created_at.toISOString(),
    updatedAt: row.updated_at.toISOString(),
  };
}

export async function listNotes(): Promise<Note[]> {
  const { rows } = await pool.query(
    "select * from notes order by updated_at desc",
  );
  return rows.map(rowToNote);
}

export async function getNote(slug: string): Promise<Note | null> {
  const { rows } = await pool.query("select * from notes where slug = $1", [slug]);
  return rows.length > 0 ? rowToNote(rows[0]) : null;
}

export async function createNote(title: string): Promise<string> {
  const base = slugify(title || "untitled-note");
  let finalSlug = base;
  let n = 1;
  for (;;) {
    const { rows } = await pool.query("select 1 from notes where slug = $1", [finalSlug]);
    if (rows.length === 0) break;
    finalSlug = `${base}-${n++}`;
  }
  await pool.query(
    "insert into notes (slug, title, body) values ($1, $2, '')",
    [finalSlug, title || "Untitled note"],
  );
  return finalSlug;
}

export async function saveNote(slug: string, title: string, body: string): Promise<void> {
  await pool.query(
    `insert into notes (slug, title, body, updated_at)
     values ($1, $2, $3, now())
     on conflict (slug) do update set
       title = excluded.title,
       body = excluded.body,
       updated_at = now()`,
    [slug, title, body],
  );
}

export async function deleteNote(slug: string): Promise<void> {
  await pool.query("delete from notes where slug = $1", [slug]);
}
