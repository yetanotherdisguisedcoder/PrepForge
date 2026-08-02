// One-time migration for databases that had data before multi-user auth existed.
// Creates (or reuses) a user account, then retrofits `user_id` onto every
// per-user table and attributes all pre-existing rows to that user.
//
// Usage: node scripts/create-user-and-migrate.mjs <email> <password> [name]
import bcrypt from "bcryptjs";
import pg from "pg";

const [, , email, password, name] = process.argv;
if (!email || !password) {
  console.error("Usage: node scripts/create-user-and-migrate.mjs <email> <password> [name]");
  process.exit(1);
}

const connectionString = process.env.POSTGRES_URL ?? process.env.DATABASE_URL;
if (!connectionString) {
  console.error("Set POSTGRES_URL (or DATABASE_URL) before running this script.");
  process.exit(1);
}

const client = new pg.Client({
  connectionString,
  ssl: connectionString.includes("sslmode=") ? undefined : { rejectUnauthorized: false },
});

// tables whose primary key must change from a business column to (user_id, col)
const COMPOSITE_PK_TABLES = [
  { table: "topic_progress", col: "topic_id" },
  { table: "activity_log", col: "day" },
  { table: "notes", col: "slug" },
];

// tables that keep their serial `id` primary key — user_id is just an added column
const SIMPLE_TABLES = ["interview_logs", "designs", "design_versions", "mock_interview_attempts"];

async function tableExists(name) {
  const { rows } = await client.query(
    "select 1 from information_schema.tables where table_schema = 'public' and table_name = $1",
    [name],
  );
  return rows.length > 0;
}

async function columnExists(table, column) {
  const { rows } = await client.query(
    "select 1 from information_schema.columns where table_name = $1 and column_name = $2",
    [table, column],
  );
  return rows.length > 0;
}

async function ensureUsersTable() {
  await client.query(`
    create table if not exists users (
      id serial primary key,
      email text not null unique,
      password_hash text not null,
      name text not null default '',
      created_at timestamptz not null default now()
    )
  `);
}

async function ensureUser() {
  const existing = await client.query("select id from users where email = $1", [
    email.toLowerCase().trim(),
  ]);
  if (existing.rows.length > 0) {
    console.log(`User ${email} already exists (id=${existing.rows[0].id}) — reusing it.`);
    return existing.rows[0].id;
  }
  const passwordHash = await bcrypt.hash(password, 10);
  const { rows } = await client.query(
    "insert into users (email, password_hash, name) values ($1, $2, $3) returning id",
    [email.toLowerCase().trim(), passwordHash, (name ?? "").trim()],
  );
  console.log(`Created user ${email} (id=${rows[0].id}).`);
  return rows[0].id;
}

async function migrateSimpleTable(table, userId) {
  if (!(await tableExists(table))) {
    console.log(`  ${table}: doesn't exist yet, skipping (will be created fresh by schema.sql).`);
    return;
  }
  if (await columnExists(table, "user_id")) {
    console.log(`  ${table}: user_id already present, skipping.`);
    return;
  }
  await client.query(`alter table ${table} add column user_id int`);
  const { rowCount } = await client.query(
    `update ${table} set user_id = $1 where user_id is null`,
    [userId],
  );
  await client.query(`alter table ${table} alter column user_id set not null`);
  await client.query(
    `alter table ${table} add constraint ${table}_user_fk foreign key (user_id) references users(id) on delete cascade`,
  );
  console.log(`  ${table}: added user_id, attributed ${rowCount} existing row(s) to this user.`);
}

async function migrateCompositePkTable(table, col, userId) {
  if (!(await tableExists(table))) {
    console.log(`  ${table}: doesn't exist yet, skipping (will be created fresh by schema.sql).`);
    return;
  }
  if (await columnExists(table, "user_id")) {
    console.log(`  ${table}: user_id already present, skipping.`);
    return;
  }
  await client.query(`alter table ${table} add column user_id int`);
  const { rowCount } = await client.query(
    `update ${table} set user_id = $1 where user_id is null`,
    [userId],
  );
  await client.query(`alter table ${table} alter column user_id set not null`);
  await client.query(
    `alter table ${table} add constraint ${table}_user_fk foreign key (user_id) references users(id) on delete cascade`,
  );
  try {
    await client.query(`alter table ${table} alter primary key using columns (user_id, ${col})`);
  } catch (err) {
    console.log(
      `  ${table}: could not switch primary key automatically (${err.message}) — ` +
        `it still has its old primary key on "${col}" alone, which will collide if a ` +
        `second user ever gets the same ${col}. Ask for a manual fix before adding more users.`,
    );
  }
  console.log(`  ${table}: added user_id, attributed ${rowCount} existing row(s) to this user.`);
}

try {
  await client.connect();
  await ensureUsersTable();
  const userId = await ensureUser();

  console.log("\nMigrating existing tables:");
  for (const table of SIMPLE_TABLES) {
    await migrateSimpleTable(table, userId);
  }
  for (const { table, col } of COMPOSITE_PK_TABLES) {
    await migrateCompositePkTable(table, col, userId);
  }

  console.log(`\nDone. User id ${userId} (${email}) now owns all pre-existing data.`);
  console.log("Run `node scripts/init-db.mjs` next to create any tables that don't exist yet.");
} finally {
  await client.end();
}
