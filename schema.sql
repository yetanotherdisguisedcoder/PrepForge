-- Run once against your Postgres database before first deploy:
--   node scripts/init-db.mjs
--
-- BREAKING CHANGE: this version adds multi-user support (a `users` table plus
-- a `user_id` column and updated primary keys on every per-user table). If
-- you already ran an earlier version of this schema against a real database,
-- these `create table if not exists` statements will NOT retrofit the new
-- columns/keys onto tables that already exist. Either:
--   (a) it's a fresh/test database — drop the 7 old tables and re-run this, or
--   (b) you have real data — ask for a proper ALTER-based migration instead
--       of dropping anything.

create table if not exists users (
  id serial primary key,
  email text not null unique,
  password_hash text not null,
  name text not null default '',
  created_at timestamptz not null default now()
);

create table if not exists topic_progress (
  user_id int not null references users(id) on delete cascade,
  topic_id text not null,
  status text not null default 'not-started',
  confidence int not null default 0,
  review_count int not null default 0,
  last_reviewed date,
  next_review date,
  quiz_score int,
  checked_items int[] not null default '{}',
  primary key (user_id, topic_id)
);

create table if not exists activity_log (
  user_id int not null references users(id) on delete cascade,
  day date not null,
  events int not null default 0,
  primary key (user_id, day)
);

create table if not exists notes (
  user_id int not null references users(id) on delete cascade,
  slug text not null,
  title text not null default 'Untitled note',
  body text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  primary key (user_id, slug)
);

create table if not exists interview_logs (
  id serial primary key,
  user_id int not null references users(id) on delete cascade,
  company text not null,
  role text not null default '',
  round text not null default '',
  interview_date date,
  interview_type text not null default 'technical',
  outcome text not null default 'pending',
  rating int,
  questions text not null default '',
  notes text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists designs (
  id serial primary key,
  user_id int not null references users(id) on delete cascade,
  title text not null default 'Untitled design',
  nodes jsonb not null default '[]',
  edges jsonb not null default '[]',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists design_versions (
  id serial primary key,
  design_id int not null references designs(id) on delete cascade,
  user_id int not null references users(id) on delete cascade,
  label text not null default '',
  nodes jsonb not null,
  edges jsonb not null,
  created_at timestamptz not null default now()
);

create table if not exists mock_interview_attempts (
  id serial primary key,
  user_id int not null references users(id) on delete cascade,
  topic_id text,
  question text not null,
  transcript text not null default '',
  duration_seconds int not null default 0,
  score int not null default 0,
  matched_concepts text[] not null default '{}',
  missing_concepts text[] not null default '{}',
  created_at timestamptz not null default now()
);

create index if not exists idx_interview_logs_user on interview_logs(user_id);
create index if not exists idx_designs_user on designs(user_id);
create index if not exists idx_design_versions_user on design_versions(user_id);
create index if not exists idx_mock_attempts_user on mock_interview_attempts(user_id);
