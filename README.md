# Prep/OS — Interview Preparation Platform

A daily-driver interview prep app: roadmap, spaced repetition, mock interviews (coming), progress
tracking, and notes — all built on top of handbook content in [`content/resources/`](content/resources).

## Architecture

- **Content** (`content/resources/*.md`): read-only handbook topics with frontmatter, read fresh
  from disk on every request (`fs.readFileSync`, no build-time caching). Regenerate from the raw
  handbook with `node ../scripts/split-handbook.mjs` (run from the repo root, one level up).
- **State** (progress, notes, activity log): stored in Postgres, not the filesystem. This is what
  makes the app deployable to serverless hosts (Vercel/Netlify) — their filesystems are read-only
  and ephemeral, so anything the app *writes* has to live in a real database.

## Local development

1. Get a Postgres connection string. Easiest options:
   - [Neon](https://neon.tech) free tier (what Vercel Postgres uses under the hood) — create a
     project, copy the connection string from the dashboard.
   - A local Postgres via Docker: `docker run -d -p 5432:5432 -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=prepdb postgres:16-alpine`,
     then use `postgresql://postgres:postgres@localhost:5432/prepdb?sslmode=disable`.
2. Copy `.env.example` to `.env.local` and set `POSTGRES_URL`.
3. Apply the schema once: `node scripts/init-db.mjs`.
4. `npm install && npm run dev`.

## Deploying to Vercel

1. Push this repo to GitHub (or wherever Vercel pulls from).
2. In Vercel, import the project. **Set the project's Root Directory to `app`** — the Next.js
   project lives in this subfolder, not the repo root.
3. Add Postgres: Vercel dashboard → your project → **Storage** → **Create Database** → Postgres
   (Neon-backed). This auto-injects `POSTGRES_URL` and related env vars into the project — no
   manual copy-pasting needed.
4. Run the schema once against that database. Either:
   - `vercel env pull .env.local` locally, then `node scripts/init-db.mjs`, or
   - run the contents of `schema.sql` directly in the Vercel/Neon SQL console.
5. Deploy. Every subsequent `git push` redeploys automatically.

### Why not just deploy as-is?

Two things had to change from the original local-file design to make this deployable to a
serverless host:

- `content/resources/` moved from a sibling directory (`../resources`) to inside the Next.js
  project (`app/content/resources`) — Vercel only bundles files inside the project root.
- Progress and notes moved from JSON/markdown files on disk to Postgres — serverless functions get
  a fresh, read-only filesystem per invocation, so file writes either fail or silently vanish.

If you'd rather run this on your own machine or a VPS/NAS with a persistent disk, the original
file-based approach works fine too and skips the database setup entirely — ask if you want that
version instead.

## Scripts

- `npm run dev` — local dev server
- `npm run build` / `npm run start` — production build/serve
- `node scripts/init-db.mjs` — apply `schema.sql` (safe to re-run, uses `create table if not exists`)
