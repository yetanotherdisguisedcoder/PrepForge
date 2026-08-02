// One-time setup: creates the tables this app needs.
// Usage: POSTGRES_URL=postgres://... node scripts/init-db.mjs
import fs from "node:fs";
import path from "node:path";
import pg from "pg";

const connectionString = process.env.POSTGRES_URL ?? process.env.DATABASE_URL;
if (!connectionString) {
  console.error("Set POSTGRES_URL (or DATABASE_URL) before running this script.");
  process.exit(1);
}

const schema = fs.readFileSync(path.join(import.meta.dirname, "..", "schema.sql"), "utf8");

const client = new pg.Client({
  connectionString,
  ssl: connectionString.includes("sslmode=") ? undefined : { rejectUnauthorized: false },
});

try {
  await client.connect();
  await client.query(schema);
  const { rows } = await client.query(
    "select tablename from pg_tables where schemaname = 'public' order by tablename",
  );
  console.log(`Schema applied: ${rows.map((r) => r.tablename).join(", ")}`);
} finally {
  await client.end();
}
