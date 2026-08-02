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

export async function listNotes(userId: string): Promise<Note[]> {
  const { rows } = await pool.query(
    "select * from notes where user_id = $1 order by updated_at desc",
    [userId],
  );
  return rows.map(rowToNote);
}

export async function getNote(userId: string, slug: string): Promise<Note | null> {
  const { rows } = await pool.query(
    "select * from notes where user_id = $1 and slug = $2",
    [userId, slug],
  );
  return rows.length > 0 ? rowToNote(rows[0]) : null;
}

export async function createNote(userId: string, title: string): Promise<string> {
  const base = slugify(title || "untitled-note");
  let finalSlug = base;
  let n = 1;
  for (;;) {
    const { rows } = await pool.query(
      "select 1 from notes where user_id = $1 and slug = $2",
      [userId, finalSlug],
    );
    if (rows.length === 0) break;
    finalSlug = `${base}-${n++}`;
  }
  await pool.query(
    "insert into notes (user_id, slug, title, body) values ($1, $2, $3, '')",
    [userId, finalSlug, title || "Untitled note"],
  );
  return finalSlug;
}

export async function saveNote(
  userId: string,
  slug: string,
  title: string,
  body: string,
): Promise<void> {
  await pool.query(
    `insert into notes (user_id, slug, title, body, updated_at)
     values ($1, $2, $3, $4, now())
     on conflict (user_id, slug) do update set
       title = excluded.title,
       body = excluded.body,
       updated_at = now()`,
    [userId, slug, title, body],
  );
}

export async function deleteNote(userId: string, slug: string): Promise<void> {
  await pool.query("delete from notes where user_id = $1 and slug = $2", [userId, slug]);
}
